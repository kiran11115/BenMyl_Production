import React, { useState, useEffect, useRef, useMemo } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom"; // Added useNavigate
import { Search, Bell, Menu, X, LogOut, User, ChevronDown, File, Settings, MessageCircleIcon } from "lucide-react";
import "./AdminHeader.css";
import AdminNotifications from "./AdminNotifications";
import { useGetCompanyProfileEditQuery } from "../../../State-Management/Api/CompanyProfileApiSlice";


function AdminHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isAiPopoverOpen, setIsAiPopoverOpen] = useState(false);
    const [isMessagesPopoverOpen, setIsMessagesPopoverOpen] = useState(false);
    const profileRef = useRef(null);
    const aiPopoverRef = useRef(null);
    const messagesPopoverRef = useRef(null);
    const company = localStorage.getItem("CompanyName");
    const role = localStorage.getItem("Role");

    const emailid = localStorage.getItem("Email"); // or from auth state

    const {
        data: apiData,
        isLoading,
        isError,
    } = useGetCompanyProfileEditQuery(emailid);

    const companyData = useMemo(() => {
        if (!apiData) return null;

        return {
            logo: apiData.companylogo,
        };
    }, [apiData]);


    // Initialize navigation hook
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleProfile = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    // --- Navigation Handlers ---
    const handleViewProfile = () => {
        setIsProfileOpen(false); // Close menu
        navigate("/admin/admin-profile"); // Navigate to profile page
    };


    const handleSignOut = () => {
        setIsProfileOpen(false); // Close menu
        // Add your actual sign-out logic here (clearing tokens, context, etc.)
        console.log("User signed out");
        navigate("/sign-in"); // Redirect to login
    };

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
            if (aiPopoverRef.current && !aiPopoverRef.current.contains(event.target)) {
                setIsAiPopoverOpen(false);
            }
            if (messagesPopoverRef.current && !messagesPopoverRef.current.contains(event.target)) {
                setIsMessagesPopoverOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            <header className="header-container">
                {/* Left Section: Brand & Nav */}
                <div className="header-left">

                    {/* Mobile Menu Toggle Button */}
                    <button className="menu-toggle" onClick={toggleMenu}>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    {/* Brand */}
                    <a className="header-brand">
                        <img
                            src="/Images/Benmyl White logo.svg"
                            alt="BenchSales Logo"
                            className="header-brand-logo"
                        />
                    </a>

                    {/* Navigation Menu (Responsive) */}
                    <nav className={`header-nav ${isMenuOpen ? "mobile-active" : ""}`}>
                        {[
                            // { path: "/user/user-dashboard", label: "Dashboard" },
                            // { path: "/user/user-talentpool", label: "Talent Pool" },
                            // { path: "/user/user-projects", label: "Projects" },
                            // { path: "/user/user-jobs", label: "Find Jobs" },
                            // { path: "/user/user-upload-talent", label: "Talent Management" },
                        ].map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsMenuOpen(false)} // Close menu on click
                                className={({ isActive }) =>
                                    `header-nav-link ${isActive ? "active" : ""}`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* Right Section: Tools & Profile */}
                <div className="header-right">
                    {/* Search Bar */}
                    {/* <div className="header-search-container">
            <Search size={16} className="header-search-icon" />
            <input
              type="text"
              placeholder="Search..."
              className="header-search-input"
            />
          </div> */}
                    <div className="ai-pill-wrapper" ref={aiPopoverRef}>
                        <button
                            onClick={() => setIsAiPopoverOpen((prev) => !prev)}
                            className="ai-pill-btn"
                        >
                            <span className="ai-pill-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 3L14.5 9.5L21 12L14.5 14.5L12 21L9.5 14.5L3 12L9.5 9.5L12 3Z" fill="url(#gemini-gradient-admin)" />
                                    <defs>
                                        <linearGradient id="gemini-gradient-admin" x1="0%" y1="0%" x2="100%" y2="100%" gradientUnits="userSpaceOnUse">
                                            <stop offset="0%" stopColor="#3b82f6" />
                                            <stop offset="50%" stopColor="#8b5cf6" />
                                            <stop offset="100%" stopColor="#f59e0b" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </span>
                            <span className="ai-pill-text">AI Assistant</span>
                        </button>

                        {isAiPopoverOpen && (
                            <div className="ai-coming-soon-popover">
                                <div className="ai-cs-icon">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 3L14.5 9.5L21 12L14.5 14.5L12 21L9.5 14.5L3 12L9.5 9.5L12 3Z" fill="url(#cs-gradient-admin)" />
                                        <defs>
                                            <linearGradient id="cs-gradient-admin" x1="0%" y1="0%" x2="100%" y2="100%" gradientUnits="userSpaceOnUse">
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

                    {/* Messages Icon */}
                    <div className="admin-message-popover-wrapper" ref={messagesPopoverRef}>
                        <button
                            onClick={() => setIsMessagesPopoverOpen((prev) => !prev)}
                            type="button"
                            className={`header-action-btn ${isMessagesPopoverOpen ? "active" : ""}`}
                            aria-expanded={isMessagesPopoverOpen}
                            aria-label="Messages"
                        >
                            <MessageCircleIcon size={20} />
                        </button>

                        {/* To restore direct navigation later, use:
                            onClick={() => navigate("/user/user-messages")}
                        */}
                        {isMessagesPopoverOpen && (
                            <div className="ai-coming-soon-popover">
                                <div className="ai-cs-icon">
                                    <MessageCircleIcon size={28} color="#8b5cf6" />
                                </div>
                                <div className="ai-cs-content">
                                    <span className="ai-cs-badge">Coming Soon</span>
                                    <p className="ai-cs-title">Messages</p>
                                    <p className="ai-cs-desc">Team conversations and admin message alerts will be available here soon.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Notification Bell */}
                    <AdminNotifications />

                    {/* User Profile Dropdown */}
                    <div className="header-profile-wrapper" ref={profileRef}>
                        <div
                            className="header-profile"
                            onClick={toggleProfile}
                            role="button"
                            tabIndex={0}
                        >
                            <img
                                src={companyData?.logo ? `${companyData.logo}?t=${Date.now()}` : "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=150"}
                                alt="Company Logo"
                                className="profile-avatar"
                            />
                            <div className="profile-info">
                                <span className="profile-name">{company}</span>
                                <span className="profile-role">{role}</span>
                            </div>
                            <ChevronDown size={16} className={`profile-chevron ${isProfileOpen ? 'rotate' : ''}`} />
                        </div>

                        {/* Popover Menu */}
                        {isProfileOpen && (
                            <div className="profile-popover">
                                <div className="popover-header">
                                    {/* <p className="popover-name">John Smith</p> */}
                                    <p className="popover-email">{emailid}</p>
                                </div>
                                <div className="popover-menu">
                                    <button className="popover-item" onClick={handleViewProfile}>
                                        <User size={16} />
                                        View Profile
                                    </button>
                                    <button className="popover-item" onClick={() => navigate("/admin/admin-analytics")}>
                                        <File size={16} />
                                        Analytics
                                    </button>
                                    {/* <button className="popover-item" onClick={() => navigate("/user/account-settings")}>
                                        <Settings size={16} />
                                        Account Settings
                                    </button> */}
                                    <div className="popover-divider"></div>
                                    <button className="popover-item text-red" onClick={handleSignOut}>
                                        <LogOut size={16} />
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <div class="app-zoom">
                <main className="cust-main">
                    <Outlet />
                </main>
            </div>

        </>
    );
}

export default AdminHeader;
