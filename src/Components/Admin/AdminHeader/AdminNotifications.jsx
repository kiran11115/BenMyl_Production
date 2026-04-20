import React, { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";

const AdminNotifications = () => {
    const [showPopover, setShowPopover] = useState(false);
    const containerRef = useRef(null);

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

    return (
        <div ref={containerRef} className="notification-container">
            <button
                className={`header-action-btn ${showPopover ? "active" : ""}`}
                onClick={togglePopover}
                aria-expanded={showPopover}
                aria-label="Notifications"
                type="button"
            >
                <Bell size={20} />
            </button>

            {/* To restore full notification navigation/list later, replace this popover with the previous notification panel. */}
            {showPopover && (
                <div className="ai-coming-soon-popover">
                    <div className="ai-cs-icon">
                        <Bell size={28} color="#8b5cf6" />
                    </div>
                    <div className="ai-cs-content">
                        <span className="ai-cs-badge">Coming Soon</span>
                        <p className="ai-cs-title">Notifications</p>
                        <p className="ai-cs-desc">Admin notification updates and alerts will appear here soon.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminNotifications;
