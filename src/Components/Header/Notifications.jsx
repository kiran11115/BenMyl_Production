import React, { useState, useRef, useEffect } from "react";
import { Bell, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetUserNotificationsQuery } from "../../State-Management/Api/CompanyProfileApiSlice";

const Notifications = () => {
  const [showPopover, setShowPopover] = useState(false);
  const containerRef = useRef(null);

  const userId = localStorage.getItem("CompanyId");

  const { data: apiNotifications = [], isLoading } =
    useGetUserNotificationsQuery(userId);

  const notifications = apiNotifications.map((item, index) => ({
    id: item.Id || index,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
      item.Username || "User",
    )}`,
    name: item.Username || "System",
    message: item.Message,
    time: new Date(item.CreatedAt).toLocaleString(),
  }));

  const togglePopover = () => setShowPopover(!showPopover);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowPopover(false);
      }
    };
    if (showPopover) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPopover]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") setShowPopover(false);
    };
    if (showPopover) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showPopover]);

  const navigate = useNavigate();

  const handleClose = () => {
    setShowPopover(false); // close popover
    navigate("/User/notifications-page"); // navigate
  };

  const markAllRead = () => console.log("Mark all as read");

  return (
    <>
      {/* Full page backdrop */}
      {showPopover && (
        <div className="notification-backdrop" onClick={handleClose} />
      )}

      <div ref={containerRef} className="notification-container">
        <button
          className={`header-action-btn ${showPopover ? "active" : ""}`}
          onClick={togglePopover}
          aria-expanded={showPopover}
          aria-label="Notifications"
          type="button"
        >
          <Bell size={20} />
          <span className="notification-badge">{notifications.length}</span>
        </button>

        {showPopover && (
          <div className="notification-popover-wrapper">
            <div className="notification-popover">
              <div className="popover-header" style={{ background: "#fff" }}>
                <h4>Notifications</h4>
                <button
                  className="mark-all-btn"
                  onClick={markAllRead}
                  type="button"
                >
                  Mark all as read
                </button>
              </div>

              <div className="popover-body">
                {isLoading ? (
                  <div className="text-center p-3">
                    Loading notifications...
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="text-center p-3">No notifications</div>
                ) : (
                  notifications.map((notif) => (
                    <div key={notif.id} className="notification-item">
                      <div className="d-flex w-100">
                        <div className="notification-avatar">
                          <img src={notif.avatar} alt={notif.name} />
                        </div>

                        <div className="notification-main-content">
                          <div className="notification-text">
                            <span className="notification-name">
                              {notif.name}
                            </span>
                            <span className="notification-message">
                              {notif.message}
                            </span>
                          </div>
                          <div className="notification-time">{notif.time}</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="popover-footer">
                <button
                  className="btn-link"
                  onClick={handleClose}
                  type="button"
                >
                  View all notifications
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Notifications;
