import React, { useState, useRef, useEffect } from "react";
import { Bell, MessageCircle, LogOut, Play } from "lucide-react";
import Notifications from "./Notifications";
import "./MobileTopBar.css";
import { useNavigate } from "react-router-dom";

const MobileTopBar = ({ user, initials, handleSignOut, setOpenVideoGuide }) => {
    const navigate = useNavigate();
    const [isAiPopoverOpen, setIsAiPopoverOpen] = useState(false);
    const aiPopoverRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (aiPopoverRef.current && !aiPopoverRef.current.contains(event.target)) {
                setIsAiPopoverOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="mobile-top-bar">
            <div className="mobile-brand">
                <img src="/Images/Benmyl White logo.svg" alt="BenMyl" className="mobile-logo" />
            </div>
            <div className="mobile-actions">
                <div className="ai-pill-wrapper" ref={aiPopoverRef}>
                    <button onClick={() => setIsAiPopoverOpen((prev) => !prev)} className="ai-pill-btn mobile-top-bar-ai-btn">
                        <span className="ai-pill-icon mobile-top-bar-ai-icon">
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
                    {isAiPopoverOpen && (
                        <div className="ai-coming-soon-popover">
                            <div className="ai-cs-icon">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 3L14.5 9.5L21 12L14.5 14.5L12 21L9.5 14.5L3 12L9.5 9.5L12 3Z" fill="url(#cs-gradient-mobile)" />
                                    <defs>
                                        <linearGradient id="cs-gradient-mobile" x1="0%" y1="0%" x2="100%" y2="100%" gradientUnits="userSpaceOnUse">
                                            <stop offset="0%" stopColor="#3b82f6" />
                                            <stop offset="50%" stopColor="#8b5cf6" />
                                            <stop offset="100%" stopColor="#f59e0b" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <div className="ai-cs-content">
                                <span className="ai-cs-badge">Coming Soon</span>
                                <p className="ai-cs-title">AI Assistant</p>
                                <p className="ai-cs-desc">We're putting the finishing touches on your intelligent hiring companion. Stay tuned!</p>
                            </div>
                        </div>
                    )}
                </div>
                <button className="mobile-action-btn" onClick={() => navigate("/user/user-messages")}>
                    <MessageCircle size={20} />
                </button>
                <button className="mobile-action-btn mobile-top-bar-play-btn" onClick={() => setOpenVideoGuide(true)}>
                    <svg width="0" height="0" style={{ position: "absolute" }}>
                        <defs>
                            <linearGradient id="video-btn-gradient-mobile" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="100%" stopColor="#8b5cf6" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <Play size={20} fill="url(#video-btn-gradient-mobile)" stroke="url(#video-btn-gradient-mobile)" />
                </button>
                <Notifications />
                <button className="mobile-action-btn mobile-top-bar-signout-btn" onClick={handleSignOut}>
                    <LogOut size={20} />
                </button>
            </div>
        </div>
    );
};

export default MobileTopBar;
