import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  FiSearch,
  FiEdit,
  FiMoreHorizontal,
  FiSend,
  FiMessageSquare,
  FiChevronLeft,
  FiChevronDown,
  FiChevronRight,
  FiSmile,
  FiCopy
} from "react-icons/fi";
import "./Messages.css";
import { toast } from "react-toastify";
import {
  useChatListDetailsQuery,
  useChatUsersListQuery,
  useChatMessagesQuery,
  useStartConversationMutation,
  useSendMessageMutation,
} from "../../State-Management/Api/ChatApiSlice";
import { startConnection, getConnection } from "./SignalRService";
import { Pin } from "lucide-react";

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
const AVATAR_COLOR_PAIRS = [
  { background: "#eceffd", color: "#6b6ff0" }, // purple
  { background: "#e6f9f8", color: "#0ea5e9" }, // green
  { background: "#e6fbf1", color: "#00b67a" }, // mint
  { background: "#ffedd5", color: "#f5810c" }, // orange
  { background: "#fef2f2", color: "#DC2626" }, // pink
];

/** Get initials from a full name */
const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

/** Pick a deterministic colour pair based on string hash */
const pickColorPair = (str = "") => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLOR_PAIRS[Math.abs(hash) % AVATAR_COLOR_PAIRS.length];
};

/** Format to dd-MMM-yyyy (e.g. 04-May-2026) */
const formatDDMMMYYYY = (d) => {
  const day = String(d.getDate()).padStart(2, '0');
  const month = d.toLocaleString('en-US', { month: 'short' });
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

/** Concise sidebar time/date */
const formatSidebarTime = (raw = "") => {
  if (!raw) return "";
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yestStart = new Date(todayStart - 86400000);
  const msgStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  if (msgStart >= todayStart) {
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  }
  if (msgStart >= yestStart) return "Yesterday";

  // Within same year
  if (d.getFullYear() === now.getFullYear()) {
    return formatDDMMMYYYY(d);
  }
  return formatDDMMMYYYY(d);
};

/** Extract domain from an email string */
const emailDomain = (email = "") => (email.split("@")[1] || "").toLowerCase();

/**
 * Format a date/time the same way Microsoft Teams does:
 *  same day  → "2:30 PM"  |  yesterday → "Yesterday 2:30 PM"
 *  same year → "Mon, Apr 28  2:30 PM"  |  older → "4/28/2025  2:30 PM"
 */
const formatTeamsTime = (raw = "") => {
  if (!raw) return "";
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yestStart = new Date(todayStart - 86400000);
  const msgStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const timeStr = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  if (msgStart >= todayStart) return timeStr;
  if (msgStart >= yestStart) return `Yesterday ${timeStr}`;
  return `${formatDDMMMYYYY(d)}  ${timeStr}`;
};

/** Date-group label for dividers: Today / Yesterday / Monday, April 28 / 4/28/2025 */
const formatDateGroup = (raw = "") => {
  if (!raw) return "";
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yestStart = new Date(todayStart - 86400000);
  const msgStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  if (msgStart >= todayStart) return "Today";
  if (msgStart >= yestStart) return "Yesterday";
  return formatDDMMMYYYY(d);
};

/** Map a raw API user object → conversation shape used by the UI */
const mapUser = (user, index) => {
  const name =
    user.FullName ?? user.fullName ?? user.UserName ?? user.userName ?? user.name ?? "Unknown";
  const email = (user.EmailID ?? user.Email ?? user.email ?? "").toLowerCase();
  
  let role = user.Role ?? user.role ?? user.designation ?? "";
  const roleLower = role.trim().toLowerCase();
  if (roleLower === "recruiter") {
    role = "Hiring Manager";
  } else if (roleLower === "recruiter2") {
    role = "Recruiter";
  }

  const id = user.AuthInfoId ?? user.userId ?? user.id ?? index;

  const rawMsg = user.lastMessage ?? user.LastMessage;

  return {
    id,
    name: name.trim(),
    email,
    avatar: getInitials(name),
    avatarBg: pickColorPair(email || name || String(index)).background,
    avatarTextColor: pickColorPair(email || name || String(index)).color,
    preview: rawMsg || "",
    hasMessaged: !!rawMsg,
    time: formatSidebarTime(user.lastMessageTime ?? user.LastMessageTime ?? ""),
    lastRawTime: user.lastMessageTime ?? user.LastMessageTime ?? "",
    unread: user.unreadCount ?? user.UnreadCount ?? 0,
    online: user.isOnline ?? user.IsOnline ?? false,
    role,
  };
};

const FLUENT_EMOJI_MAP = {
  '👍': 'thumbs-up',
  '❤️': 'red-heart',
  '😂': 'face-with-tears-of-joy',
  '😮': 'face-with-open-mouth',
  '😢': 'crying-face',
  '🙏': 'folded-hands',
  '😀': 'grinning-face',
  '😍': 'smiling-face-with-heart-eyes',
  '🎉': 'party-popper',
  '🔥': 'fire',
  '🤔': 'thinking-face',
  '👀': 'eyes',
  '🚀': 'rocket',
  '👏': 'clapping-hands',
  '🙌': 'raising-hands',
  '💯': 'hundred-points',
  '😭': 'loudly-crying-face',
  '😡': 'enraged-face',
  '☀️': 'sun',
  '💼': 'briefcase',
  '✉️': 'envelope',
};

const getFluentEmojiUrl = (emoji) => {
  const name = FLUENT_EMOJI_MAP[emoji];
  if (!name) return "";
  return `https://unpkg.com/@lobehub/assets-emoji@1.3.0/assets/${name}.webp`;
};

const renderMessageContent = (text) => {
  if (!text) return null;
  
  // Check if message consists ONLY of one or more mapped emojis
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
  const cleanText = text.replace(/\s+/g, "");
  const matchEmojis = cleanText.match(emojiRegex) || [];
  const isOnlyEmojis = matchEmojis.length > 0 && matchEmojis.join("") === cleanText;

  const keys = Object.keys(FLUENT_EMOJI_MAP);
  const escapedKeys = keys.map(k => k.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
  const pattern = new RegExp(`(${escapedKeys.join('|')})`, 'g');
  
  const parts = text.split(pattern);
  
  return (
    <span className={isOnlyEmojis ? "tms-msg-only-emojis" : "tms-msg-text-with-emojis"}>
      {parts.map((part, index) => {
        if (FLUENT_EMOJI_MAP[part]) {
          return (
            <img
              key={index}
              src={getFluentEmojiUrl(part)}
              alt={part}
              className="tms-inline-emoji"
              title={part}
            />
          );
        }
        return part;
      })}
    </span>
  );
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

  // Accordion states
  const [recentExpanded, setRecentExpanded] = useState(true);
  const [pendingExpanded, setPendingExpanded] = useState(true);
  const [pinnedExpanded, setPinnedExpanded] = useState(true);

  // Feature states
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [pinnedChats, setPinnedChats] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("benmyl_persist_pinned_chats") || "[]");
    } catch {
      return [];
    }
  });
  const chatBodyRef = useRef(null);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem("benmyl_persist_pinned_chats", JSON.stringify(pinnedChats));
  }, [pinnedChats]);

  const togglePinChat = (chatId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setPinnedChats((prev) => {
      const isPinned = prev.includes(chatId);
      if (isPinned) {
        toast.info("Chat unpinned");
        return prev.filter((id) => id !== chatId);
      } else {
        toast.success("Chat pinned to top!");
        return [...prev, chatId];
      }
    });
  };

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
        mapped.time = formatSidebarTime(lastMsg.rawDate || lastMsg.date);
        mapped.lastRawTime = lastMsg.rawDate || lastMsg.date || mapped.lastRawTime;
      }

      const userDomain = emailDomain(mapped.email);
      const isSame =
        loggedInDomain !== "" && userDomain !== "" && userDomain === loggedInDomain;
      return { ...mapped, domain: isSame ? "sameDomain" : "nonDomain" };
    })
      .filter((c) => String(c.id) !== String(userId))
      .sort((a, b) => {
        const timeA = new Date(a.lastRawTime || 0).getTime();
        const timeB = new Date(b.lastRawTime || 0).getTime();
        return timeB - timeA;
      });
  }, [chatData, loggedInDomain, chatUsersListMap, messagesByConversation, userId]);

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
      id: m.id ?? Math.random(),
      from: String(m.SenderId) === String(userId) ? "me" : "them",
      text: m.Message || "",
      rawDate: m.CreatedAt || "",
      date: formatTeamsTime(m.CreatedAt),
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
    const nowISO = new Date().toISOString();

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

    // Auto-accept public chat when user sends first message
    if (isPublicTab) {
      setAcceptedPublicChats((prev) => ({ ...prev, [selectedId]: true }));
    }

    setMessagesByConversation((prev) => ({
      ...prev,
      [selectedId]: [
        ...(prev[selectedId] || []),
        { id: Date.now(), from: "me", rawDate: nowISO, date: formatTeamsTime(nowISO), text },
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

          const nowISO = new Date().toISOString();
          setMessagesByConversation((prev) => ({
            ...prev,
            [selectedId]: [
              ...(prev[selectedId] || []),
              {
                id: msg.msgId,
                from: String(msg.senderId) === String(userId) ? "me" : "them",
                text: msg.message,
                rawDate: nowISO,
                date: formatTeamsTime(nowISO),
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

            {!isLoading && !isError && (() => {
              // Pinned: Pinned contacts
              const pinnedList = filtered.filter(c => pinnedChats.includes(c.id));
              // Recent: Any contact that HAS message history (latest on top) and is not pinned
              const recentList = filtered.filter(c => c.hasMessaged && !pinnedChats.includes(c.id));
              // Secondary: Contacts in the current tab that DON'T have messages yet and are not pinned
              const secondaryList = filtered.filter(c => !c.hasMessaged && !pinnedChats.includes(c.id));

              const secondaryLabel = isPublicTab ? "Public" : "Team";

              const renderContact = (c) => {
                const active = selectedId === c.id;
                const isPinned = pinnedChats.includes(c.id);
                return (
                  <div
                    key={c.id}
                    className={
                      "tms-contact-card" +
                      (isPublicTab ? " tms-contact-card-public" : "") +
                      (active ? " tms-contact-card-active" : "") +
                      (isPinned ? " tms-contact-card-pinned" : "")
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
                        style={{ background: c.avatarBg, color: c.avatarTextColor }}
                      >
                        {c.avatar}
                        {c.online && <span className="tms-online-dot" />}
                      </div>

                      <div className="tms-contact-text">
                        <div className="tms-contact-top">
                          <span className="tms-contact-name">{c.name}</span>
                          <div className="d-flex align-items-center gap-1">
                            <button
                              type="button"
                              className={`tms-pin-toggle-btn ${isPinned ? 'pinned' : ''}`}
                              title={isPinned ? "Unpin Chat" : "Pin Chat"}
                              onClick={(e) => togglePinChat(c.id, e)}
                            >
                              <Pin size={12} />
                            </button>
                            {c.time && <span className="tms-contact-time">{c.time}</span>}
                          </div>
                        </div>
                        {c.hasMessaged ? (
                          <span className="tms-contact-preview">{renderMessageContent(c.preview)}</span>
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
              };

              return (
                <div className="tms-accordions">
                  {/* Pinned Accordion */}
                  {pinnedList.length > 0 && (
                    <div className="tms-accordion">
                      <button
                        className="tms-accordion-header"
                        onClick={() => setPinnedExpanded(!pinnedExpanded)}
                      >
                        {pinnedExpanded ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />}
                        <span>Pinned</span>
                        <span className="tms-accordion-badge">{pinnedList.length}</span>
                      </button>
                      {pinnedExpanded && (
                        <div className="tms-accordion-content">
                          {pinnedList.map(renderContact)}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Recent Accordion (Active chats) */}
                  <div className="tms-accordion">
                    <button
                      className="tms-accordion-header"
                      onClick={() => setRecentExpanded(!recentExpanded)}
                    >
                      {recentExpanded ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />}
                      <span>Recent</span>
                      {recentList.length > 0 && (
                        <span className="tms-accordion-badge">{recentList.length}</span>
                      )}
                    </button>
                    {recentExpanded && (
                      <div className="tms-accordion-content">
                        {recentList.map(renderContact)}
                        {recentList.length === 0 && (
                          <div className="tms-empty">No recent chats</div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Secondary Accordion (Public or Team contacts without messages) */}
                  <div className="tms-accordion">
                    <button
                      className="tms-accordion-header"
                      onClick={() => setPendingExpanded(!pendingExpanded)}
                    >
                      {pendingExpanded ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />}
                      <span>{secondaryLabel}</span>
                    </button>
                    {pendingExpanded && (
                      <div className="tms-accordion-content">
                        {secondaryList.map(renderContact)}
                        {secondaryList.length === 0 && (
                          <div className="tms-empty">No {secondaryLabel.toLowerCase()} contacts</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
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
                style={{ 
                  background: currentConversation?.avatarBg || "#eceffd", 
                  color: currentConversation?.avatarTextColor || "#6b6ff0" 
                }}
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
            {/* <div className="tms-chat-header-actions">
              <button className="tms-hdr-btn" title="More options"><FiMoreHorizontal size={18} /></button>
            </div> */}
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
            {/* Accept card - only shown for incoming public requests that haven't been handled yet. */}
            {isPublicTab &&
              currentConversation &&
              currentConversation.hasMessaged &&
              !isAcceptedPublicChat &&
              !currentMessages.some(m => m.from === "me") ? (
              <div className="tms-public-request-card">
                <div className="tms-empty-illustration">
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
                    className="copilot-action-btn w-100"
                    onClick={handleAcceptPublicChat}
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    className="routine-btn w-100"
                    onClick={handleDeclinePublicChat}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Messages loading (API 3) */}
                {messagesLoading && selectedConversationId && (
                  <div className="tms-empty">
                    <span className="tms-loading-spinner" /> Loading messages…
                  </div>
                )}

                {!messagesLoading && (() => {
                  let lastGroup = null;
                  return currentMessages.map((msg, index) => {
                    const isMe = msg.from === "me";
                    const groupLabel = formatDateGroup(msg.rawDate || msg.date || "");
                    const isFirstInGroup = groupLabel !== lastGroup;
                    if (isFirstInGroup) lastGroup = groupLabel;
                    const prevMsg = currentMessages[index - 1];
                    const isFirstInBlock = !prevMsg || prevMsg.from !== msg.from || isFirstInGroup;

                    return (
                      <React.Fragment key={msg.id}>
                        {/* Date group divider */}
                        {isFirstInGroup && groupLabel && (
                          <div className="tms-date-divider">
                            <div className="tms-date-line" />
                            <span className="tms-date-label">{groupLabel}</span>
                            <div className="tms-date-line" />
                          </div>
                        )}

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
                            {!isMe && (
                              <div className="tms-msg-avatar"
                                style={{
                                  background: isFirstInBlock ? currentConversation?.avatarBg : "transparent",
                                  color: isFirstInBlock ? currentConversation?.avatarTextColor : "transparent",
                                  visibility: isFirstInBlock ? "visible" : "hidden",
                                }}
                              >
                                {isFirstInBlock ? currentConversation?.avatar : ""}
                              </div>
                            )}
                            <div className="tms-bubble-wrap">
                              {!isMe && isFirstInBlock && <span className="tms-sender-name">{currentConversation?.name}</span>}
                              <div className="tms-bubble-container">
                                <div className={"tms-bubble tms-link-bubble" + (isMe ? " tms-bubble-me" : " tms-bubble-them")}>
                                  <a href={msg.text} target="_blank" rel="noopener noreferrer" className="tms-link-text">{msg.text}</a>
                                  {isMe && <span className="tms-tick">✓</span>}
                                  <button
                                    type="button"
                                    className="tms-inline-copy-btn"
                                    title="Copy Message"
                                    onClick={() => {
                                      navigator.clipboard.writeText(msg.text);
                                      toast.success("Message copied!");
                                    }}
                                  >
                                    <FiCopy size={12} />
                                  </button>
                                </div>
                              </div>

                              {msg.date && <span className="tms-msg-time">{msg.date}</span>}
                            </div>
                          </div>
                        ) : (
                          <div className={"tms-msg-row" + (isMe ? " tms-msg-me" : " tms-msg-them")}>
                            {!isMe && (
                              <div className="tms-msg-avatar"
                                style={{
                                  background: isFirstInBlock ? currentConversation?.avatarBg : "transparent",
                                  color: isFirstInBlock ? currentConversation?.avatarTextColor : "transparent",
                                  visibility: isFirstInBlock ? "visible" : "hidden",
                                }}
                              >
                                {isFirstInBlock ? currentConversation?.avatar : ""}
                              </div>
                            )}
                            <div className="tms-bubble-wrap">
                              {!isMe && isFirstInBlock && <span className="tms-sender-name">{currentConversation?.name}</span>}
                              <div className="tms-bubble-container">
                                <div className={"tms-bubble" + (isMe ? " tms-bubble-me" : " tms-bubble-them")}>
                                  <p>{renderMessageContent(msg.text)}</p>
                                  <button
                                    type="button"
                                    className="tms-inline-copy-btn"
                                    title="Copy Message"
                                    onClick={() => {
                                      navigator.clipboard.writeText(msg.text);
                                      toast.success("Message copied!");
                                    }}
                                  >
                                    <FiCopy size={12} />
                                  </button>
                                </div>
                              </div>

                              {msg.date && <span className="tms-msg-time">{msg.date}</span>}
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    );
                  });
                })()}

                {/* Start Conversation / Empty State 
                    Shown when there are no messages, but ONLY if we aren't showing the accept card above. */}
                {currentMessages.length === 0 && (
                  <div className="tms-no-messages">
                    <div className="tms-empty-illustration">
                      <FiMessageSquare size={34} />
                    </div>
                    <p className="tms-empty-name">Start conversation</p>
                    <p className="tms-empty-hint">
                      {isPublicTab
                        ? `Send a message to start chatting with ${currentConversation?.name}.`
                        : "Team chats will appear here once a message is sent."}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Input Bar - Only shown if not in showAcceptCard state */}
          {!(isPublicTab &&
            currentConversation &&
            currentConversation.hasMessaged &&
            !isAcceptedPublicChat &&
            !currentMessages.some(m => m.from === "me")) && (
              <footer className="tms-input-bar">
                {/* Suggestions row */}
                <div className="tms-suggestion-row">
                  {["Sounds good!", "Thank you!", "I'm checking this", "Will do!", "Perfect!"].map((text) => (
                    <button
                      key={text}
                      type="button"
                      className="tms-suggestion-chip"
                      onClick={() => setInputValue(text)}
                    >
                      {text}
                    </button>
                  ))}
                </div>

                <form className="tms-input-wrapper" onSubmit={handleSend}>
                  <div className={`tms-emoji-picker-popover ${showEmojiPicker ? 'show' : ''}`}>
                    <div className="tms-emoji-grid">
                      {['😀', '😂', '😍', '👍', '🎉', '❤️', '🔥', '🤔', '👀', '🚀', '👏', '🙌', '💯', '😭', '😡', '☀️', '💼', '✉️'].map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          className="tms-emoji-item"
                          onClick={() => {
                            setInputValue((prev) => prev + emoji);
                            setShowEmojiPicker(false);
                          }}
                        >
                          <img src={getFluentEmojiUrl(emoji)} alt={emoji} style={{ width: 24, height: 24 }} />
                        </button>
                      ))}
                    </div>
                  </div>
                  {showEmojiPicker && (
                    <div className="tms-emoji-picker-overlay" onClick={() => setShowEmojiPicker(false)} />
                  )}
                  
                  <button
                    type="button"
                    className="tms-emoji-btn"
                    title="Choose Emoji"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <FiSmile size={18} />
                  </button>

                  <input
                    className="tms-input"
                    placeholder="Type a message"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <div className="tms-input-actions">
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
            )}

        </section>
      </div>
    </div>
  );
};

export default Messages;
