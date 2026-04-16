import React, { useState, useRef, useEffect } from "react";
import {
  FiSearch,
  FiEdit,
  FiMoreHorizontal,
  FiSend,
  FiFileText,
  FiDownload,
  FiImage,
  FiPaperclip,
  FiSmile,
  FiPhone,
  FiVideo,
  FiAtSign,
  FiUsers,
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
    id: 1,
    name: "Sai Lokesh (You)",
    avatar: "SL",
    avatarColor: "#f5810c",
    preview: "You: http://apps.envato.com/video-templates/12dc2fc9...",
    time: "25:02",
    unread: 0,
    online: true,
    domain: "sameDomain",
  },
  {
    id: 2,
    name: "1 request",
    avatar: "1",
    avatarColor: "#e8a838",
    preview: "You: GIF",
    time: "",
    unread: 1,
    online: false,
    special: true,
    domain: "sameDomain",
  },
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
  },
];

const initialMessagesByConversation = {
  1: [
    {
      id: 1,
      from: "me",
      date: "09 January 10:00",
      text: "my practice",
    },
    {
      id: 2,
      from: "me",
      date: "09 January 10:00",
      text: "AI voice",
      showDate: true,
      dateLabel: "09 January 10:00",
    },
    {
      id: 3,
      from: "me",
      date: "12 January 17:30",
      showDate: true,
      dateLabel: "12 January 17:30",
      isLink: true,
      text: "https://docs.google.com/document/d/1zPBgZAdWNa6WVa7UIFLbW_7Fco9Y60Y743RgFull_3o/edit?tab=t.0",
    },
    {
      id: 4,
      from: "me",
      date: "20 January 19:00",
      showDate: true,
      dateLabel: "20 January 19:00",
      isLink: true,
      text: "https://www.canva.com/design/DAG-7n8FuQ/q2tMmBzNkzl68mFZlF-eqw/edit?utm_content=DAG-7n8FuQ&utm...",
    },
    {
      id: 5,
      from: "me",
      date: "18 February 14:01",
      showDate: true,
      dateLabel: "18 February 14:01",
      isCredentials: true,
      emails: [
        "mylastech104@gmail.com",
        "mylastech105@gmail.com",
        "mylastech106@gmail.com",
        "mylastech107@gmail.com",
        "mylastech108@gmail.com",
        "mylastech109@gmail.com",
        "mylastech110@gmail.com",
      ],
      pwd: "mylas@0987",
    },
    {
      id: 6,
      from: "me",
      date: "23 February 16:01",
      showDate: true,
      dateLabel: "23 February 16:01",
      isLink: true,
      text: "https://app.envato.com/video-templates/12dc2c9-c9f8-48d7-b1fa-a85786a314b0",
    },
  ],
  3: [
    {
      id: 1,
      from: "them",
      date: "Today",
      text: "Hi, are you available for a call?",
    },
    {
      id: 2,
      from: "me",
      date: "Today",
      text: "Yes, give me 5 minutes!",
    },
  ],
  4: [
    {
      id: 1,
      from: "them",
      date: "Today",
      text: "ok ok",
    },
  ],
};

/* ── Helpers ── */
const initials = (name) =>
  name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

/* ── Component ── */
const Messages = () => {
  const [selectedId, setSelectedId] = useState(1);
  const [messagesByConversation, setMessagesByConversation] = useState(
    initialMessagesByConversation
  );
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const [domainTab, setDomainTab] = useState("sameDomain"); // Tab state
  const chatBodyRef = useRef(null);

  const currentConversation = conversations.find((c) => c.id === selectedId);
  const currentMessages = messagesByConversation[selectedId] || [];

  const filtered = conversations
    .filter((c) => c.domain === domainTab) // Filter by domain tab
    .filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.preview.toLowerCase().includes(search.toLowerCase())
    );

  useEffect(() => {
    if (chatBodyRef.current)
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
  }, [currentMessages, selectedId]);

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
                Same Domain
              </button>
              <button
                className={`tms-domain-tab ${domainTab === "nonDomain" ? "tms-tab-active" : ""}`}
                onClick={() => setDomainTab("nonDomain")}
              >
                Non Domain
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
                <button
                  key={c.id}
                  className={"tms-contact-item" + (active ? " tms-contact-active" : "")}
                  onClick={() => setSelectedId(c.id)}
                >
                  {/* Avatar */}
                  <div
                    className="tms-avatar"
                    style={{ background: c.avatarColor }}
                  >
                    {c.avatar}
                    {c.online && <span className="tms-online-dot" />}
                  </div>

                  {/* Text */}
                  <div className="tms-contact-text">
                    <div className="tms-contact-top">
                      <span className="tms-contact-name">{c.name}</span>
                      {c.time && <span className="tms-contact-time">{c.time}</span>}
                    </div>
                    <span className="tms-contact-preview">{c.preview}</span>
                  </div>

                  {/* Unread */}
                  {c.unread > 0 && (
                    <span className="tms-unread-badge">{c.unread}</span>
                  )}
                </button>
              );
            })}

            {filtered.length === 0 && (
              <div className="tms-empty">No chats found</div>
            )}
          </div>

          {/* Bottom invite */}
          <div className="tms-invite-bar">
            <FiUsers size={16} className="tms-invite-icon" />
            <span className="tms-invite-label">Invite</span>
          </div>

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
              <span className="tms-chat-header-name">
                {currentConversation?.name}
              </span>
            </div>
            <div className="tms-chat-header-actions">
              <button className="tms-hdr-btn" title="Video call"><FiVideo size={18} /></button>
              <button className="tms-hdr-btn" title="Audio call"><FiPhone size={18} /></button>
              <button className="tms-hdr-btn" title="More options"><FiMoreHorizontal size={18} /></button>
            </div>
          </header>

          {/* Chat Body */}
          <div className="tms-chat-body" ref={chatBodyRef}>

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

            {currentMessages.length === 0 && (
              <div className="tms-no-messages">
                <div
                  className="tms-empty-avatar"
                  style={{ background: currentConversation?.avatarColor || "#6264a7" }}
                >
                  {currentConversation?.avatar}
                </div>
                <p className="tms-empty-name">{currentConversation?.name}</p>
                <p className="tms-empty-hint">Send a message to start a conversation</p>
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
                <button type="button" className="tms-act-btn" title="Emoji"><FiSmile size={18} /></button>
                <button type="button" className="tms-act-btn" title="Meet"><FiVideo size={18} /></button>
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
