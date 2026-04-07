import React from "react";
import { Bell, MessageCircle, LogOut, Play } from "lucide-react";
import Notifications from "./Notifications";
import "./MobileTopBar.css";
import { useNavigate } from "react-router-dom";

const MobileTopBar = ({ user, initials, handleSignOut, setOpenVideoGuide }) => {
    const navigate = useNavigate();

    return (
        <div className="mobile-top-bar">
            <div className="mobile-brand">
                <img src="/Images/Benmyl White logo.svg" alt="BenMyl" className="mobile-logo" />
            </div>
            <div className="mobile-actions">
                <button onClick={() => navigate("/user/AI-screen")} className="ai-pill-btn" style={{ padding: '8px', minWidth: '40px', justifyContent: 'center' }}>
                    <span className="ai-pill-icon" style={{ margin: 0 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 3L14.5 9.5L21 12L14.5 14.5L12 21L9.5 14.5L3 12L9.5 9.5L12 3Z" fill="url(#gemini-gradient-mobile)" />
                            <defs>
                                <linearGradient id="gemini-gradient-mobile" x1="0%" y1="0%" x2="100%" y2="100%" gradientUnits="userSpaceOnUse">
                                    <stop offset="0%" stopColor="#3b82f6" />
                                    <stop offset="50%" stopColor="#8b5cf6" />
                                    <stop offset="100%" stopColor="#f59e0b" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </span>
                </button>
                <button className="mobile-action-btn" onClick={() => navigate("/user/user-messages")}>
                    <MessageCircle size={20} />
                </button>
                <button className="mobile-action-btn" onClick={() => setOpenVideoGuide(true)} style={{ color: "#f5810c" }}>
                    <Play size={20} fill="currentColor" />
                </button>
                <Notifications />
                <button className="mobile-action-btn" onClick={handleSignOut} style={{ color: '#ef4444' }}>
                    <LogOut size={20} />
                </button>
            </div>
        </div>
    );
};

export default MobileTopBar;
