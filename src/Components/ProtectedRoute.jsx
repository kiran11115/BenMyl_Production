import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

const ProtectedRoute = () => {
  // const [showMessage, setShowMessage] = useState(false);
  // const [redirect, setRedirect] = useState(false);
  // const location = useLocation();

  // useEffect(() => {
  //   if (!isAuthenticated()) {
  //     setShowMessage(true);
  //     const timer = setTimeout(() => {
  //       setRedirect(true);
  //     }, 2000);

  //     return () => clearTimeout(timer);
  //   }
  // }, [location]);

  // if (!isAuthenticated()) {
  //   if (redirect) {
  //     return <Navigate to="/signin" replace />;
  //   }

  //   return (
  //     <div style={styles.wrapper}>
  //       {showMessage && <div style={styles.alert}>⚠️ Please login</div>}
  //     </div>
  //   );
  // }

 const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = () => {
    if (!message.trim()) return;

    setMessages([...messages, { role: "user", text: message }]);
    setMessage("");

    // Fake AI reply demo
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { role: "ai", text: "I'm Ben — how can I help you today?" }
      ]);
    }, 900);
  };

  return (
    <>
      <Outlet />

        {/* Floating Button */}
      <div style={styles.button} onClick={() => setOpen(!open)}>
        <div style={styles.avatarWrap}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png"
            alt="Ben AI"
            style={styles.avatar}
          />
        </div>
        <div style={styles.buttonText}>
          <span style={styles.aiTag}>Ask</span>
          <span style={styles.name}>Ben</span>
        </div>
      </div>

      {/* Chat Panel */}
      {open && (
        <div style={styles.panel}>
          {/* Header */}
          <div style={styles.header}>
            <div>
              <strong>Ben</strong>
              <div style={styles.subtitle}>AI Assistant</div>
            </div>
            <button style={styles.close} onClick={() => setOpen(false)}>×</button>
          </div>

          {/* Chat Body */}
          <div style={styles.chatBody}>
            {messages.length === 0 && (
              <div style={styles.empty}>What’s on your mind?</div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  ...styles.bubble,
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  background:
                    msg.role === "user"
                      ? "linear-gradient(135deg,#7b61ff,#9f7aea)"
                      : "rgba(255,255,255,0.12)",
                }}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div style={styles.inputArea}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What’s on your mind?"
              style={styles.textarea}
            />
            <button style={styles.send} onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    
    </>
  );
};

const styles = {
  button: {
    position: "fixed",
    bottom: "22px",
    right: "22px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 20px 10px 10px",
    borderRadius: "999px",
    background: "linear-gradient(135deg,#6a5cff,#8f7cff)",
    boxShadow: "0 18px 45px rgba(106,92,255,0.45)",
    cursor: "pointer",
    zIndex: 9999,
  },

  avatarWrap: {
    width: "36px",
    height: "6px",
    borderRadius: "50%",
    background: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
  },

  buttonText: {
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    lineHeight: 1.1,
  },

  aiTag: {
    fontSize: "12px",
    opacity: 0.9,
    letterSpacing: "0.6px",
  },

  name: {
    fontSize: "16px",
    fontWeight: "700",
  },

  panel: {
    position: "fixed",
    bottom: "95px",
    right: "22px",
    width: "390px",
    height: "520px",
    borderRadius: "22px",
    background: "rgba(20,20,28,0.88)",
    backdropFilter: "blur(18px)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 30px 90px rgba(0,0,0,0.45)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    zIndex: 9999,
    color: "#fff",
  },

  header: {
    padding: "16px 18px",
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },

  subtitle: {
    fontSize: "12px",
    opacity: 0.7,
  },

  close: {
    background: "transparent",
    border: "none",
    fontSize: "22px",
    color: "#fff",
    cursor: "pointer",
  },

  chatBody: {
    flex: 1,
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    overflowY: "auto",
  },

  empty: {
    textAlign: "center",
    opacity: 0.5,
    marginTop: "40%",
    fontSize: "15px",
  },

  bubble: {
    padding: "12px 14px",
    borderRadius: "14px",
    fontSize: "14px",
    maxWidth: "78%",
    lineHeight: 1.45,
  },

  inputArea: {
    padding: "14px",
    borderTop: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  textarea: {
    width: "100%",
    height: "90px",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#fff",
    padding: "12px",
    fontSize: "14px",
    resize: "none",
    outline: "none",
  },

  send: {
    alignSelf: "flex-end",
    padding: "10px 18px",
    borderRadius: "12px",
    border: "none",
    fontWeight: "600",
    background: "linear-gradient(135deg,#7b61ff,#9f7aea)",
    color: "#fff",
    cursor: "pointer",
    boxShadow: "0 8px 22px rgba(123,97,255,0.45)",
  },
};



export default ProtectedRoute;
