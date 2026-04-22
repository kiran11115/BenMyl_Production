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

  return <Outlet />;
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

export default ProtectedRoute;
