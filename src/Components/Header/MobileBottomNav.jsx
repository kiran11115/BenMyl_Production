import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Upload, Briefcase, User } from "lucide-react";
import "./MobileBottomNav.css";

const MobileBottomNav = () => {
    const role = localStorage.getItem("Role");

    const navItems = {
        "Recruiter": [
            { path: "/user/user-dashboard", icon: <LayoutDashboard size={20} />, label: "Home" },
            { path: "/user/user-talentpool", icon: <Users size={20} />, label: "Pool" },
            { path: "/user/AI-screen", icon: <div className="mobile-nav-ai-bubble"><span style={{ color: "#fff", fontSize: "16px" }}>✦</span></div>, label: "AI" },
            { path: "/user/user-projects", icon: <Briefcase size={20} />, label: "Projects" },
            { path: "/user/user-profile", icon: <User size={20} />, label: "Profile" },
        ],
        "Benchsales": [
            { path: "/user/user-dashboard", icon: <LayoutDashboard size={20} />, label: "Home" },
            { path: "/user/user-upload-talent", icon: <Upload size={20} />, label: "Upload" },
            { path: "/user/AI-screen", icon: <div className="mobile-nav-ai-bubble"><span style={{ color: "#fff", fontSize: "16px" }}>✦</span></div>, label: "AI" },
            { path: "/user/user-Jobs", icon: <Briefcase size={20} />, label: "Jobs" },
            { path: "/user/user-profile", icon: <User size={20} />, label: "Profile" },
        ]
    };

    const currentNav = navItems[role] || navItems["Recruiter"];

    return (
        <nav className="mobile-bottom-nav">
            {currentNav.map((item, index) => (
                <NavLink
                    key={index}
                    to={item.path}
                    className={({ isActive }) => `mobile-nav-item ${isActive ? "active" : ""}`}
                >
                    {item.icon}
                    <span>{item.label}</span>
                </NavLink>
            ))}
        </nav>
    );
};

export default MobileBottomNav;
