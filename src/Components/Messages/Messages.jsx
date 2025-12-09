import React, { useState, useRef, useEffect } from "react";
import "./Messages.css";

const conversations = [
  {
    id: 1,
    name: "Sarah Wilson",
    role: "Frontend Role at TechCorp",
    preview: "Thanks for considering my application!",
    time: "2m ago",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Senior Developer at StartupX",
    preview: "When would be a good time to discuss?",
    time: "12m ago",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Product Designer at DesignLab",
    preview: "Looking forward to the next interview",
    time: "38m ago",
  },
];

// initial messages per conversation
const initialMessagesByConversation = {
  1: [
    {
      id: 1,
      from: "them",
      time: "10:30 AM",
      text: "Hi there! Thanks for reaching out regarding the Frontend Developer position.",
    },
    {
      id: 2,
      from: "me",
      time: "10:32 AM",
      text: "Hello! Yes, I'm very interested in the role and would love to learn more about the opportunity.",
    },
    {
      id: 3,
      from: "them",
      time: "10:35 AM",
      type: "file",
      fileName: "Quarterly_Report_Q3.pdf",
      size: "3.2MB",
    },
    {
      id: 4,
      from: "me",
      time: "10:37 AM",
      text: "Thanks! And here’s that photo from the conference",
    },
    {
      id: 5,
      from: "me",
      time: "10:37 AM",
      type: "image",
    },
    {
      id: 6,
      from: "me",
      time: "10:39 AM",
      text: "I have 3 years of experience working with React, including Redux for state management and modern tools like Next.js. I've also worked extensively with TypeScript and various CSS frameworks.",
    },
  ],
  2: [
    {
      id: 1,
      from: "them",
      time: "09:10 AM",
      text: "Hi, I'm reviewing your profile for the Senior Developer role.",
    },
    {
      id: 2,
      from: "me",
      time: "09:12 AM",
      text: "Great, happy to answer any questions you have!",
    },
  ],
  3: [
    {
      id: 1,
      from: "them",
      time: "11:05 AM",
      text: "Thanks for sharing your design portfolio.",
    },
    {
      id: 2,
      from: "me",
      time: "11:07 AM",
      text: "You're welcome! Let me know if you need any additional case studies.",
    },
  ],
};

const Messages = () => {
  const [selectedId, setSelectedId] = useState(conversations[0].id);
  const [messagesByConversation, setMessagesByConversation] = useState(
    initialMessagesByConversation
  );
  const [inputValue, setInputValue] = useState("");

  const chatBodyRef = useRef(null);

  const currentConversation = conversations.find(
    (c) => c.id === selectedId
  );

  const currentMessages = messagesByConversation[selectedId] || [];

  // scroll to bottom whenever messages or selected chat changes
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [currentMessages, selectedId]);

  const handleConversationClick = (id) => {
    setSelectedId(id);
  };

  const handleSend = (e) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newMessage = {
      id: Date.now(),
      from: "me",
      time: timeString,
      text,
    };

    setMessagesByConversation((prev) => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] || []), newMessage],
    }));

    setInputValue("");
  };

  return (
    <div className="messages-root">
      <div className="messages-card">
        {/* LEFT SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <span className="sidebar-title">Messages</span>
            <button className="sidebar-add-btn">+</button>
          </div>

          <div className="sidebar-search">
            <input placeholder="Search messages" />
          </div>

          {/* only this list scrolls on left side */}
          <div className="sidebar-list">
            {conversations.map((c) => (
              <button
                key={c.id}
                className={
                  "conversation-item" +
                  (selectedId === c.id ? " conversation-active" : "")
                }
                onClick={() => handleConversationClick(c.id)}
              >
                <div className="avatar-circle">
                  {c.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="conversation-main">
                  <div className="conversation-top">
                    <span className="conversation-name">{c.name}</span>
                    <span className="conversation-time">{c.time}</span>
                  </div>
                  <span className="conversation-role">{c.role}</span>
                  <span className="conversation-preview">{c.preview}</span>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* RIGHT CHAT AREA */}
        <section className="chat">
          {/* header */}
          <header className="chat-header">
            <div>
              <div className="chat-name">{currentConversation?.name}</div>
              <div className="chat-sub">{currentConversation?.role}</div>
            </div>
            <button className="chat-menu-btn">⋮</button>
          </header>

          {/* messages – ONLY this scrolls */}
          <div className="chat-body" ref={chatBodyRef}>
            {currentMessages.map((msg) => {
              const isMe = msg.from === "me";

              if (msg.type === "file") {
                return (
                  <div
                    key={msg.id}
                    className={"message-row " + (isMe ? "me" : "them")}
                  >
                    <div className="message-bubble file-bubble">
                      <div className="file-icon">📄</div>
                      <div className="file-info">
                        <span className="file-name">{msg.fileName}</span>
                        <span className="file-size">{msg.size}</span>
                      </div>
                      <button className="file-download">⬇</button>
                    </div>
                    <span className="message-time">{msg.time}</span>
                  </div>
                );
              }

              if (msg.type === "image") {
                return (
                  <div
                    key={msg.id}
                    className={"message-row " + (isMe ? "me" : "them")}
                  >
                    <div className="message-bubble image-bubble">
                      <div className="image-placeholder" />
                    </div>
                    <span className="message-time">{msg.time}</span>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={"message-row " + (isMe ? "me" : "them")}
                >
                  <div className="message-bubble">
                    <p>{msg.text}</p>
                  </div>
                  <span className="message-time">{msg.time}</span>
                </div>
              );
            })}
          </div>

          {/* input bar at bottom */}
          <footer className="chat-input-bar">
            <form className="chat-input-wrapper" onSubmit={handleSend}>
              <input
                className="chat-input"
                placeholder="Type a message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button type="submit" className="chat-send-btn">
                ➤
              </button>
            </form>
          </footer>
        </section>
      </div>
    </div>
  );
};

export default Messages;
