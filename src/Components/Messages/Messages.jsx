import React, { useState, useRef, useEffect } from "react";
import {
  FiSearch,
  FiEdit,
  FiMoreHorizontal,
  FiSend,
  FiPaperclip,
  FiAtSign,
  FiMessageSquare,
} from "react-icons/fi";
import "./Messages.css";

/* ── Google Font ── */
if (!document.getElementById("msg-inter-font")) {
  const link = document.createElement("link");
  link.id = "msg-inter-font";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Segoe+UI:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&display=swap";
  document.head.appendChild(link);
}

/* ── Data ── */
const conversations = [
  {
    id: 3,
    name: "Venugopal Nallana",
    avatar: "VN",
    avatarColor: "#1e293b",
    preview: "You: Sent an image",
    time: "24:02",
    unread: 0,
    online: false,
    domain: "sameDomain",
    role: "Bench Sales",
  },
  {
    id: 4,
    name: "Harry",
    avatar: "H",
    avatarColor: "#0284c7",
    preview: "You: ok ok",
    time: "11:02",
    unread: 0,
    online: true,
    domain: "nonDomain",
    role: "Recruiter",
  },
  {
    id: 5,
    name: "Sample Group",
    avatar: "SG",
    avatarColor: "#16a34a",
    preview: "mournika: Event cancelled: sample",
    time: "02-12-2025",
    unread: 0,
    online: false,
    domain: "sameDomain",
    role: "Team Lead",
  },
  {
    id: 6,
    name: "Ashok KDM",
    avatar: "AK",
    avatarColor: "#0891b2",
    preview: "No messages yet",
    time: "14-11-2025",
    unread: 0,
    online: false,
    domain: "nonDomain",
    role: "Hiring Manager",
  },
  {
    id: 7,
    name: "KiranBenerjee Pentakota",
    avatar: "KB",
    avatarColor: "#7c3aed",
    preview: "You: Sent a file",
    time: "14-11-2025",
    unread: 0,
    online: false,
    domain: "sameDomain",
    role: "Bench Sales",
  },
  {
    id: 8,
    name: "Mohan Rao",
    avatar: "MR",
    avatarColor: "#dc2626",
    preview: "You: link click chasi download chasey",
    time: "11-11-2025",
    unread: 0,
    online: false,
    domain: "nonDomain",
    role: "Recruiter",
  },
  {
    id: 9,
    name: "Gnana Reddy",
    avatar: "GR",
    avatarColor: "#16a34a",
    preview: "You: Gnana bro",
    time: "04-10-2025",
    unread: 0,
    online: false,
    domain: "sameDomain",
    role: "Account Manager",
  },
  {
    id: 10,
    name: "Rishav",
    avatar: "R",
    avatarColor: "#ea580c",
    preview: "You: Sent a file",
    time: "29-08-2025",
    unread: 0,
    online: false,
    domain: "sameDomain",
    role: "Delivery Lead",
  },
  {
    id: 11,
    name: "Ganesh Vaddlashi",
    avatar: "GV",
    avatarColor: "#0891b2",
    preview: "No messages yet",
    time: "12-08-2025",
    unread: 0,
    online: false,
    domain: "nonDomain",
    role: "Bench Sales",
  },
];

const initialMessagesByConversation = {};

const EMPTY_MESSAGES = [];

/* ── Component ── */
const Messages = () => {
  const [selectedId, setSelectedId] = useState(3);
  const [messagesByConversation, setMessagesByConversation] = useState(
    initialMessagesByConversation
  );
  const [acceptedPublicChats, setAcceptedPublicChats] = useState({});
  const [declinedPublicChats, setDeclinedPublicChats] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const [domainTab, setDomainTab] = useState("sameDomain");
  const chatBodyRef = useRef(null);

  const currentConversation = conversations.find((c) => c.id === selectedId);
  const currentMessages = messagesByConversation[selectedId] || EMPTY_MESSAGES;
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

  useEffect(() => {
    if (chatBodyRef.current)
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
  }, [currentMessages, selectedId]);

  useEffect(() => {
    const firstConversation = conversations.find((c) => c.domain === domainTab);
    if (firstConversation) {
      setSelectedId(firstConversation.id);
    }
  }, [domainTab]);

  useEffect(() => {
    if (filtered.length > 0 && !filtered.some((c) => c.id === selectedId)) {
      setSelectedId(filtered[0].id);
    }
  }, [filtered, selectedId]);

  const handleSend = (e) => {
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
    setMessagesByConversation((prev) => ({
      ...prev,
      [selectedId]: [
        ...(prev[selectedId] || []),
        { id: Date.now(), from: "me", date: dateLabel, text },
      ],
    }));
    setInputValue("");
  };

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
      <div className="tms-shell">

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
                onClick={() => setDomainTab("sameDomain")}
              >
                Team
              </button>
              <button
                className={`tms-domain-tab ${domainTab === "nonDomain" ? "tms-tab-active" : ""}`}
                onClick={() => setDomainTab("nonDomain")}
              >
                Public
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
            {filtered.map((c) => {
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
                    onClick={() => setSelectedId(c.id)}
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
                      <span className="tms-contact-role">{c.role}</span>
                    </div>

                    {c.unread > 0 && (
                      <span className="tms-unread-badge">{c.unread}</span>
                    )}
                  </button>

                </div>
              );
            })}

            {filtered.length === 0 && (
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

            {currentMessages.map((msg, index) => {
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
