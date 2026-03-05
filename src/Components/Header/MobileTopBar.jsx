import React from "react";
import { Bell, MessageCircle, LogOut } from "lucide-react";
import Notifications from "./Notifications";
import "./MobileTopBar.css";
import { useNavigate } from "react-router-dom";

const MobileTopBar = ({ user, initials }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <div className="mobile-top-bar">
            <div className="mobile-brand">
                <img src="/Images/Benmyl White logo.svg" alt="BenMyl" className="mobile-logo" />
            </div>
            <div className="mobile-actions">
                <button className="mobile-action-btn" onClick={() => navigate("/user/user-messages")}>
                    <MessageCircle size={20} />
                </button>
                <Notifications />
                <button className="mobile-action-btn" onClick={handleLogout} style={{ color: '#ef4444' }}>
                    <LogOut size={20} />
                </button>
            </div>
        </div>
    );
};

export default MobileTopBar;
