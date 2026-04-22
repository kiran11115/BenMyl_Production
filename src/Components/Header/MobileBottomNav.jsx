import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Upload, Briefcase, User } from "lucide-react";
import "./MobileBottomNav.css";

const MobileBottomNav = () => {
    return (
        <nav className="mobile-bottom-nav">
            <NavLink
                to="/user/user-dashboard"
                className={({ isActive }) => `mobile-nav-item ${isActive ? "active" : ""}`}
            >
                <LayoutDashboard size={20} />
                <span>Home</span>
            </NavLink>
            <NavLink
                to="/user/user-talentpool"
                className={({ isActive }) => `mobile-nav-item ${isActive ? "active" : ""}`}
            >
                <Users size={20} />
                <span>Pool</span>
            </NavLink>
            <NavLink
                to="/user/AI-screen"
                className={({ isActive }) => `mobile-nav-item ${isActive ? "active" : ""}`}
            >
                <div className="mobile-nav-ai-bubble">
                    <span style={{ color: "#fff", fontSize: "16px" }}>✦</span>
                </div>
                <span>AI</span>
            </NavLink>
            <NavLink
                to="/user/user-upload-talent"
                className={({ isActive }) => `mobile-nav-item ${isActive ? "active" : ""}`}
            >
                <Upload size={20} />
                <span>Upload</span>
            </NavLink>
            <NavLink
                to="/user/user-Jobs"
                className={({ isActive }) => `mobile-nav-item ${isActive ? "active" : ""}`}
            >
                <Briefcase size={20} />
                <span>Jobs</span>
            </NavLink>
            <NavLink
                to="/user/user-profile"
                className={({ isActive }) => `mobile-nav-item ${isActive ? "active" : ""}`}
            >
                <User size={20} />
                <span>Profile</span>
            </NavLink>
        </nav>
    );
};

export default MobileBottomNav;
