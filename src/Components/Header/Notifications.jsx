import React, { useState } from "react";
import { Bell } from "lucide-react";

const Notifications = () => {
  const [showPopover, setShowPopover] = useState(false);

  const notifications = [
    { id: 1, title: "New message from John", time: "2 min ago", type: "message" },
    { id: 2, title: "Payment received", time: "1 hour ago", type: "payment" },
    { id: 3, title: "New job application", time: "3 hours ago", type: "application" },
  ];

  return (
    <>
      {/* Notification Bell */}
      <div className="notification-container" onMouseEnter={() => setShowPopover(true)} onMouseLeave={() => setShowPopover(false)}>
        <button type="button" className="header-action-btn" aria-label="Notifications">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>

        {/* Popover */}
        {showPopover && (
          <div className="notification-popover">
            <div className="popover-header">
              <h4>Notifications</h4>
              <button className="popover-close" onClick={() => setShowPopover(false)}>
                ×
              </button>
            </div>
            
            <div className="popover-body">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div key={notification.id} className={`notification-item ${notification.type}`}>
                    <div className="notification-icon">
                      {notification.type === "message" && "💬"}
                      {notification.type === "payment" && "💰"}
                      {notification.type === "application" && "📄"}
                    </div>
                    <div className="notification-content">
                      <p className="notification-title">{notification.title}</p>
                      <span className="notification-time">{notification.time}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-notifications">
                  No new notifications
                </div>
              )}
            </div>
            
            <div className="popover-footer">
              <button className="btn-link">View all notifications</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Notifications;
