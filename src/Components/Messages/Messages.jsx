import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  FiSearch,
  FiEdit,
  FiMoreHorizontal,
  FiSend,
  FiPaperclip,
  FiAtSign,
  FiMessageSquare,
  FiChevronLeft,
} from "react-icons/fi";
import "./Messages.css";
import {
  useChatListDetailsQuery,
  useChatUsersListQuery,
  useChatMessagesQuery,
  useStartConversationMutation,
  useSendMessageMutation,
} from "../../State-Management/Api/ChatApiSlice";
import { startConnection, getConnection } from "./SignalRService";

/* ── Google Font ── */
if (!document.getElementById("msg-inter-font")) {
  const link = document.createElement("link");
  link.id = "msg-inter-font";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Segoe+UI:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&display=swap";
  document.head.appendChild(link);
}

/* ── Helpers ── */
const AVATAR_COLORS = [
  "#1e293b", "#0284c7", "#16a34a", "#0891b2",
  "#7c3aed", "#dc2626", "#ea580c", "#9333ea",
  "#0f766e", "#b45309",
];

/** Get initials from a full name */
const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

/** Pick a deterministic colour based on string hash */
const pickColor = (str = "") => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

/** Extract domain from an email string */
const emailDomain = (email = "") => (email.split("@")[1] || "").toLowerCase();

/** Map a raw API user object → conversation shape used by the UI */
const mapUser = (user, index) => {
  const name =
    user.FullName ?? user.fullName ?? user.UserName ?? user.userName ?? user.name ?? "Unknown";
  const email = (user.EmailID ?? user.Email ?? user.email ?? "").toLowerCase();
  const role = user.Role ?? user.role ?? user.designation ?? "";
  const id = user.AuthInfoId ?? user.userId ?? user.id ?? index;

  const rawMsg = user.lastMessage ?? user.LastMessage;

  return {
    id,
    name: name.trim(),
    email,
    avatar: getInitials(name),
    avatarColor: pickColor(email || name || String(index)),
    preview: rawMsg || "",
    hasMessaged: !!rawMsg,
    time: user.lastMessageTime ?? user.LastMessageTime ?? "",
    unread: user.unreadCount ?? user.UnreadCount ?? 0,
    online: user.isOnline ?? user.IsOnline ?? false,
    role,
  };
};

const initialMessagesByConversation = {};
const EMPTY_MESSAGES = [];

/* ── Component ── */
const Messages = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [messagesByConversation, setMessagesByConversation] = useState(
    initialMessagesByConversation
  );
  const [acceptedPublicChats, setAcceptedPublicChats] = useState({});
  const [declinedPublicChats, setDeclinedPublicChats] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const [domainTab, setDomainTab] = useState("sameDomain");
  const [mobileView, setMobileView] = useState("list"); // "list" or "chat"
  const chatBodyRef = useRef(null);

  /* ── userId from localStorage (stored at login as response.userid) ── */
  const userId = useMemo(() => localStorage.getItem("CompanyId") ?? "", []);

  const [startConversation] = useStartConversationMutation();
  const [sendMessage] = useSendMessageMutation();

  useEffect(() => {
    if (userId) {
      startConnection(userId);
    }
  }, [userId]);

  /* ── API 1: GET /api/Chat/chat-users → all users for sidebar ── */
  const { data: chatData, isLoading, isError } = useChatListDetailsQuery(undefined, {
    refetchOnMountOrArgChange: true
  });

  /* ── API 2: GET api/Chat/chat-list/{userId} → logged-in user's chat list with conversationId ── */
  const { data: chatUsersListData, refetch: refetchChatUsersList } = useChatUsersListQuery(userId, {
    skip: !userId,
    refetchOnMountOrArgChange: true,
    pollingInterval: 3000,
  });

  /* Build lookup: userId → chat info from API 2 response */
  const chatUsersListMap = useMemo(() => {
    const raw =
      chatUsersListData?.data ??
      chatUsersListData?.users ??
      (Array.isArray(chatUsersListData) ? chatUsersListData : []);
    return raw.reduce((acc, entry) => {
      const uid = String(
        entry.AuthInfoId ?? entry.userId ?? entry.UserId ?? entry.id ?? ""
      );
      if (uid) acc[uid] = entry;
      return acc;
    }, {});
  }, [chatUsersListData]);

  /* ── Logged-in user domain from localStorage ── */
  const loggedInDomain = useMemo(() => {
    const email = localStorage.getItem("Email") ?? "";
    return emailDomain(email);
  }, []);

  /* ── Map API data → conversations list with domain tag ── */
  const conversations = useMemo(() => {
    const raw = chatData?.data ?? chatData?.users ?? chatData ?? [];
    if (!Array.isArray(raw)) return [];
    return raw.map((user, i) => {
      const uid = String(user.AuthInfoId ?? user.userId ?? user.id ?? i);
      const extraInfo = chatUsersListMap[uid] || {};

      const mapped = mapUser({ ...user, ...extraInfo }, i);

      // Instantly apply local messages to the sidebar
      const localMsgs = messagesByConversation[uid];
      if (localMsgs && localMsgs.length > 0) {
        const lastMsg = localMsgs[localMsgs.length - 1];
        mapped.preview = lastMsg.text;
        mapped.hasMessaged = true;
        mapped.time = lastMsg.dateLabel || lastMsg.date || mapped.time;
      }

      const userDomain = emailDomain(mapped.email);
      const isSame =
        loggedInDomain !== "" && userDomain !== "" && userDomain === loggedInDomain;
      return { ...mapped, domain: isSame ? "sameDomain" : "nonDomain" };
    });
  }, [chatData, loggedInDomain, chatUsersListMap, messagesByConversation]);

  const currentConversation = conversations.find((c) => c.id === selectedId);

  /* conversationId for the selected contact (from API 2 lookup map) */
  const selectedConversationId = selectedId
    ? (chatUsersListMap[String(selectedId)]?.ConversationId ??
      chatUsersListMap[String(selectedId)]?.conversationId ??
      chatUsersListMap[String(selectedId)]?.conversation_id ??
      null)
    : null;

  /* ── API 3: GET api/Chat/messages/{conversationId} → right-panel messages ── */
  const {
    data: messagesApiData,
    isLoading: messagesLoading,
    isFetching: messagesFetching,
  } = useChatMessagesQuery(selectedConversationId, {
    skip: !selectedConversationId,
    refetchOnMountOrArgChange: true,
    pollingInterval: 3000,
  });

  /* Map API 3 response → UI message shape */
  const apiMessages = useMemo(() => {
    // Prevent stale messages from the previous chat from showing while loading the new one,
    // or if the selected user doesn't have a conversation yet.
    if (!selectedConversationId || messagesLoading) {
      return [];
    }

    const raw =
      messagesApiData?.data ??
      messagesApiData?.messages ??
      (Array.isArray(messagesApiData) ? messagesApiData : []);

    return raw.map((m) => ({
      id: m.id ?? Math.random(), // ✅ FIXED

      from: String(m.SenderId) === String(userId) ? "me" : "them",

      text: m.Message || "", // ✅ FIXED (exact field)

      date: m.CreatedAt || "",

      showDate: true,
    }));
  }, [messagesApiData, selectedConversationId, messagesLoading, userId]);

  /* Merge API messages + any locally typed (unsent) messages */
  const localSent = messagesByConversation[selectedId] || EMPTY_MESSAGES;
  const currentMessages = useMemo(() => {
    return apiMessages.length > 0 ? [...apiMessages, ...localSent] : localSent;
  }, [apiMessages, localSent]);

  /* Clear local optimistic messages when the API polls and provides the authoritative list, to prevent duplicates */
  useEffect(() => {
    if (apiMessages.length > 0) {
      setMessagesByConversation((prev) => {
        if (!prev[selectedId] || prev[selectedId].length === 0) return prev;
        return { ...prev, [selectedId]: [] };
      });
    }
  }, [apiMessages, selectedId]);

  const isPublicTab = domainTab === "nonDomain";
  const isAcceptedPublicChat = Boolean(acceptedPublicChats[selectedId]);

  const filtered = conversations
    .filter((c) => c.domain === domainTab)
    .filter((c) => !(c.domain === "nonDomain" && declinedPublicChats[c.id]))
    .filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.role.toLowerCase().includes(search.toLowerCase())
    );

  const currentMessagesCount = currentMessages.length;
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [currentMessagesCount, selectedId]);

  /* Auto-select first conversation when tab or data changes */
  useEffect(() => {
    const firstInTab = conversations.find((c) => c.domain === domainTab);
    if (firstInTab && selectedId === null) {
      setSelectedId(firstInTab.id);
    }
  }, [conversations, domainTab]); // eslint-disable-line

  useEffect(() => {
    if (filtered.length > 0 && !filtered.some((c) => c.id === selectedId)) {
      setSelectedId(filtered[0].id);
    }
  }, [filtered, selectedId]);

  /* Tab switch → reset selection */
  const handleTabChange = (tab) => {
    setDomainTab(tab);
    setSelectedId(null);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text) return;
    const now = new Date();
    const dateLabel = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });

    try {
      let currentConvId = selectedConversationId;

      if (!currentConvId && userId && selectedId) {
        // user1 is the logged-in user, user2 is the selected contact
        const startRes = await startConversation({ user1: userId, user2: selectedId }).unwrap();
        // Extract conversationId from response
        currentConvId = startRes?.ConversationId || startRes?.conversationId || startRes?.id || startRes;
      }

      if (currentConvId && userId) {
        await sendMessage({
          conversationId: currentConvId,
          senderId: userId,
          message: text,
        }).unwrap();
        refetchChatUsersList();
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    }

    setMessagesByConversation((prev) => ({
      ...prev,
      [selectedId]: [
        ...(prev[selectedId] || []),
        { id: Date.now(), from: "me", date: dateLabel, text },
      ],
    }));
    setInputValue("");
  };

  useEffect(() => {
    let conn;

    if (userId) {
      startConnection(userId).then((connection) => {
        conn = connection;

        connection.off("ReceiveMessage");
        connection.off("MessageSent");

        const handleMessage = (msg) => {
          console.log("📩 Real-time:", msg);

          refetchChatUsersList();

          if (msg.conversationId !== selectedConversationId) return;

          setMessagesByConversation((prev) => ({
            ...prev,
            [selectedId]: [
              ...(prev[selectedId] || []),
              {
                id: msg.msgId,
                from:
                  String(msg.senderId) === String(userId)
                    ? "me"
                    : "them",
                text: msg.message,
                date: new Date().toLocaleString(),
              },
            ],
          }));
        };

        connection.on("ReceiveMessage", handleMessage);
        connection.on("MessageSent", handleMessage);
      });
    }

    return () => {
      if (conn) {
        conn.off("ReceiveMessage");
        conn.off("MessageSent");
      }
    };
  }, [userId, selectedConversationId, refetchChatUsersList]);

  const handleAcceptPublicChat = () => {
    setAcceptedPublicChats((prev) => ({
      ...prev,
      [selectedId]: true,
    }));
  };

  const handleDeclinePublicChat = () => {
    setDeclinedPublicChats((prev) => ({
      ...prev,
      [selectedId]: true,
    }));
    setAcceptedPublicChats((prev) => {
      const next = { ...prev };
      delete next[selectedId];
      return next;
    });
  };

  return (
    <div className="tms-root">
      <div className={`tms-shell ${mobileView === "chat" ? "tms-mobile-chat-active" : ""}`}>

        {/* ══════════════ SIDEBAR ══════════════ */}
        <aside className="tms-sidebar">

          {/* Sidebar Header with Tabs */}
          <div className="tms-sidebar-header-wrapper">
            <div className="tms-sidebar-header">
              <span className="tms-sidebar-title">Chat</span>
              <div className="tms-sidebar-header-btns">
                <button className="tms-icon-btn" title="New chat">
                  <FiEdit size={16} />
                </button>
              </div>
            </div>

            {/* Domain Tabs */}
            <div className="tms-domain-tabs">
              <button
                className={`tms-domain-tab ${domainTab === "sameDomain" ? "tms-tab-active" : ""}`}
                onClick={() => handleTabChange("sameDomain")}
              >
                Team
                {!isLoading && (
                  <span className="tms-tab-count">
                    {conversations.filter((c) => c.domain === "sameDomain").length}
                  </span>
                )}
              </button>
              <button
                className={`tms-domain-tab ${domainTab === "nonDomain" ? "tms-tab-active" : ""}`}
                onClick={() => handleTabChange("nonDomain")}
              >
                Public
                {!isLoading && (
                  <span className="tms-tab-count">
                    {conversations.filter((c) => c.domain === "nonDomain").length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="tms-search-wrap mt-2">
            <FiSearch className="tms-search-icon" size={14} />
            <input
              className="tms-search-input"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Contact list */}
          <div className="tms-contact-list">
            {isLoading && (
              <div className="tms-empty">
                <span className="tms-loading-spinner" /> Loading chats…
              </div>
            )}

            {isError && !isLoading && (
              <div className="tms-empty tms-empty-error">
                Failed to load chats. Please try again.
              </div>
            )}

            {!isLoading && !isError && filtered.map((c) => {
              const active = selectedId === c.id;
              return (
                <div
                  key={c.id}
                  className={
                    "tms-contact-card" +
                    (isPublicTab ? " tms-contact-card-public" : "") +
                    (active ? " tms-contact-card-active" : "")
                  }
                >
                  <button
                    className={"tms-contact-item" + (active ? " tms-contact-active" : "")}
                    onClick={() => {
                      setSelectedId(c.id);
                      setMobileView("chat");
                    }}
                  >
                    <div
                      className="tms-avatar"
                      style={{ background: c.avatarColor }}
                    >
                      {c.avatar}
                      {c.online && <span className="tms-online-dot" />}
                    </div>

                    <div className="tms-contact-text">
                      <div className="tms-contact-top">
                        <span className="tms-contact-name">{c.name}</span>
                        {c.time && <span className="tms-contact-time">{c.time}</span>}
                      </div>
                      {c.hasMessaged ? (
                        <span className="tms-contact-preview">{c.preview}</span>
                      ) : (
                        <span className="tms-contact-role">{c.role}</span>
                      )}
                    </div>

                    {c.unread > 0 && (
                      <span className="tms-unread-badge">{c.unread}</span>
                    )}
                  </button>
                </div>
              );
            })}

            {!isLoading && !isError && filtered.length === 0 && (
              <div className="tms-empty">No chats found</div>
            )}
          </div>

          {/* Bottom invite */}
        </aside>

        {/* ══════════════ CHAT PANEL ══════════════ */}
        <section className="tms-chat">

          {/* Chat Header */}
          <header className="tms-chat-header">
            <div className="tms-chat-header-left">
              <button
                className="tms-back-btn"
                onClick={() => setMobileView("list")}
                title="Back to list"
              >
                <FiChevronLeft size={24} />
              </button>
              <div
                className="tms-header-avatar"
                style={{ background: currentConversation?.avatarColor || "#6264a7" }}
              >
                {currentConversation?.avatar}
                {currentConversation?.online && (
                  <span className="tms-header-online" />
                )}
              </div>
              <div className="tms-chat-header-meta">
                <span className="tms-chat-header-name">
                  {currentConversation?.name}
                </span>
                <span className="tms-chat-header-role">
                  {currentConversation?.role}
                </span>
              </div>
            </div>
            <div className="tms-chat-header-actions">
              <button className="tms-hdr-btn" title="More options"><FiMoreHorizontal size={18} /></button>
            </div>
          </header>

          {/* Chat Body */}
          <div
            className={
              "tms-chat-body" +
              (isPublicTab && !isAcceptedPublicChat && currentMessages.length === 0
                ? " tms-chat-body-public-empty"
                : "")
            }
            ref={chatBodyRef}
          >
            {isPublicTab && currentConversation && !isAcceptedPublicChat && (
              <div className="tms-public-request-card">
                <div className="tms-public-request-icon">
                  <FiMessageSquare size={24} />
                </div>
                <p className="tms-public-request-title">Public chat request</p>
                <p className="tms-public-request-text">
                  {currentConversation.name} wants to connect with you as a{" "}
                  {currentConversation.role}.
                </p>
                <div className="tms-chat-request-actions">
                  <button
                    type="button"
                    className="tms-action-btn tms-action-accept"
                    onClick={handleAcceptPublicChat}
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    className="tms-action-btn tms-action-decline"
                    onClick={handleDeclinePublicChat}
                  >
                    Decline
                  </button>
                </div>
              </div>
            )}

            {/* Messages loading (API 3) */}
            {messagesLoading && selectedConversationId && (
              <div className="tms-empty">
                <span className="tms-loading-spinner" /> Loading messages…
              </div>
            )}

            {!messagesLoading && currentMessages.map((msg, index) => {
              const isMe = msg.from === "me";
              const showDate = msg.showDate || index === 0;

              return (
                <React.Fragment key={msg.id}>
                  {showDate && (
                    <div className="tms-date-divider">
                      <div className="tms-date-line" />
                      <span className="tms-date-label">{msg.dateLabel || msg.date}</span>
                      <div className="tms-date-line" />
                    </div>
                  )}

                  {/* Credentials block */}
                  {msg.isCredentials ? (
                    <div className="tms-msg-row tms-msg-me">
                      <div className="tms-bubble tms-bubble-me tms-credentials-bubble">
                        <div className="tms-cred-emails">
                          {msg.emails.map((email, i) => (
                            <div key={i} className="tms-cred-email">{email}</div>
                          ))}
                        </div>
                        <div className="tms-cred-pwd-row">
                          <span className="tms-cred-pwd-label">pwd:</span>
                          <span className="tms-cred-pwd-val">{msg.pwd}</span>
                        </div>
                        <div className="tms-cred-ok">ok</div>
                      </div>
                    </div>
                  ) : msg.isLink ? (
                    <div className={"tms-msg-row" + (isMe ? " tms-msg-me" : " tms-msg-them")}>
                      <div className={"tms-bubble tms-link-bubble" + (isMe ? " tms-bubble-me" : " tms-bubble-them")}>
                        <a
                          href={msg.text}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="tms-link-text"
                        >
                          {msg.text}
                        </a>
                        {isMe && <span className="tms-tick">✓</span>}
                      </div>
                    </div>
                  ) : (
                    <div className={"tms-msg-row" + (isMe ? " tms-msg-me" : " tms-msg-them")}>
                      <div className={"tms-bubble" + (isMe ? " tms-bubble-me" : " tms-bubble-them")}>
                        <p>{msg.text}</p>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}

            {currentMessages.length === 0 && (!isPublicTab || isAcceptedPublicChat) && (
              <div className="tms-no-messages">
                <div className="tms-empty-illustration">
                  <FiMessageSquare size={34} />
                </div>
                <p className="tms-empty-name">Start conversation</p>
                <p className="tms-empty-hint">
                  {isPublicTab
                    ? `You can now start chatting with ${currentConversation?.name}.`
                    : "Team chats will appear here once a message is sent."}
                </p>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <footer className="tms-input-bar">
            <form className="tms-input-wrapper" onSubmit={handleSend}>
              <input
                className="tms-input"
                placeholder="Type a message"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <div className="tms-input-actions">
                <button type="button" className="tms-act-btn" title="Attach"><FiPaperclip size={18} /></button>
                <button type="button" className="tms-act-btn" title="Mention"><FiAtSign size={18} /></button>
                <button
                  type="submit"
                  className={"tms-send-btn" + (inputValue.trim() ? " tms-send-active" : "")}
                  title="Send"
                  disabled={!inputValue.trim()}
                >
                  <FiSend size={16} />
                </button>
              </div>
            </form>
          </footer>

        </section>
      </div>
    </div>
  );
};

export default Messages;
