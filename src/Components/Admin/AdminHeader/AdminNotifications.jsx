import React, { useState, useRef, useEffect } from "react";
import { Bell, FileText } from "lucide-react";

const AdminNotifications = () => {
    const [showPopover, setShowPopover] = useState(false);
    const containerRef = useRef(null);

    const notifications = [
        {
            id: 1,
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face",
            name: "Priya Sharma",
            message: "sent you a new connection request",
            action: "HR Recruiter",
            time: "2 min ago"
        },
        {
            id: 2,
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
            name: "Rahul Patel",
            message: "posted a new job opening for",
            action: "Senior React Developer",
            time: "18 min ago"
        },
        {
            id: 3,
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
            name: "Anita Desai",
            message: "approved your timesheet for this week",
            time: "45 min ago",
            hasActions: true
        },
        {
            id: 5,
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face",
            name: "Micheal",
            message: "scheduled interview for tomorrow at",
            action: "10:30 AM - Tech Round",
            time: "2 hrs ago"
        }
    ];

    const togglePopover = () => setShowPopover(!showPopover);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
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

    const handleClose = () => setShowPopover(false);
    const markAllRead = () => console.log("Mark all as read");

    return (
        <>
            {/* Full page backdrop */}
            {showPopover && (
                <div className="notification-backdrop" onClick={handleClose} />
            )}

            <div ref={containerRef} className="notification-container">
                <button
                    className={`header-action-btn ${showPopover ? 'active' : ''}`}
                    onClick={togglePopover}
                    aria-expanded={showPopover}
                    aria-label="Notifications"
                    type="button"
                >
                    <Bell size={20} />
                    <span className="notification-badge">5</span>
                </button>

                {showPopover && (
                    <div className="notification-popover-wrapper">
                        <div className="notification-popover">
                            <div className="popover-header" style={{ background: "#fff" }}>
                                <h4>Notifications</h4>
                                <button className="mark-all-btn" onClick={markAllRead} type="button">
                                    Mark all as read
                                </button>
                            </div>

                            <div className="popover-body">
                                {notifications.map((notif) => (
                                    <div key={notif.id} className="notification-item">
                                        <div className="d-flex w-100">
                                            <div className="notification-avatar">
                                                <img src={notif.avatar} alt={notif.name} />
                                            </div>

                                            <div className="notification-main-content">
                                                <div className="notification-text">
                                                    <span className="notification-name">{notif.name}</span>
                                                    <span className="notification-message">{notif.message}</span>
                                                    {notif.action && (
                                                        <span className="notification-action">{notif.action}</span>
                                                    )}
                                                </div>
                                                <div className="notification-time">{notif.time}</div>
                                            </div>
                                        </div>

                                        {notif.hasActions && (
                                            <div className="notification-actions gap-3">
                                                <button className="btn-primary" aria-label="Accept" type="button">
                                                    Accept
                                                </button>
                                                <button className="btn-secondary" aria-label="Decline" type="button">
                                                    Decline
                                                </button>
                                            </div>
                                        )}

                                        {notif.file && (
                                            <div className="notification-file">
                                                <FileText size={14} />
                                                <span>{notif.file}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="popover-footer">
                                <button className="btn-link" onClick={handleClose} type="button">
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

export default AdminNotifications;
