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

  return (
    <>
      <Outlet />

      {/* Floating AI Chat Button */}
      <div style={chatStyles.button}>
        <div style={chatStyles.avatarWrapper}>
          <img
            src="https://i.imgur.com/6VBx3io.png"
            alt="AI Avatar"
            style={chatStyles.avatar}
          />
        </div>
        <span style={chatStyles.text}>Chat with Ai</span>
      </div>
    </>
  );
};

const styles = {
  wrapper: {
    position: "fixed",
    top: 20,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    zIndex: 9999,
  },
  alert: {
    backgroundColor: "#fff3cd",
    color: "#856404",
    padding: "10px 20px",
    borderRadius: "4px",
    border: "1px solid #ffeeba",
    fontSize: "14px",
  },
};

/* 🔹 Floating Button Styles */
const chatStyles = {
  button: {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "linear-gradient(135deg, #7b4bff, #6a3df0)",
    color: "#fff",
    padding: "10px 22px 10px 10px",
    borderRadius: "999px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    boxShadow: "0 10px 30px rgba(123, 75, 255, 0.45)",
    zIndex: 9999,
  },
  avatarWrapper: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    backgroundColor: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  text: {
    whiteSpace: "nowrap",
  },
};

export default ProtectedRoute;
