import React, { useState, useEffect, useRef } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom"; // Added useNavigate
import { Search, Bell, Menu, X, LogOut, User, ChevronDown, File, Settings, MessageCircleIcon, Play } from "lucide-react";
import VideoGuidePopover from "../Guide/VideoGuidePopover";
import { videoGuides } from "../Guide/guideData";
import "./Header.css";
import Notifications from "./Notifications";
import { useGetRecruiterProfileQuery } from "../../State-Management/Api/RecruiterProfileApiSlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MobileBottomNav from "./MobileBottomNav";
import MobileTopBar from "./MobileTopBar";


function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isVideoGuideOpen, setIsVideoGuideOpen] = useState(false);
  const profileRef = useRef(null);

  const user = localStorage.getItem("UserName");
  const role = localStorage.getItem("Role");
  const email = localStorage.getItem("Email");
  const userId = localStorage.getItem("CompanyId");

  const { data: apiData, isLoading } =
    useGetRecruiterProfileQuery(Number(userId), {
      skip: !userId,
    });

  const companyData = apiData
    ? {
      id: apiData.authInfoID,
      slug: "",
      profilePhoto: apiData.profilePhoto

    }
    : null;

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
    navigate("/user/user-profile"); // Navigate to profile page
  };


  const handleSignOut = () => {
    setIsProfileOpen(false); // Close menu
    localStorage.removeItem("shortlistedMap");
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
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getInitials = (name = "") => {
    return name
      .trim()
      .split(" ")
      .slice(0, 2)
      .map(word => word[0]?.toUpperCase())
      .join("");
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <MobileTopBar 
        user={user} 
        initials={getInitials(user)} 
        handleSignOut={handleSignOut} 
        setOpenVideoGuide={setIsVideoGuideOpen}
      />

      <header className="header-container desktop-header">
        {/* Left Section: Brand & Nav */}
        <div className="header-left">
          {/* Mobile Menu Toggle Button (kept for tablet if needed, but we used bottom nav) */}
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
              { path: "/user/user-dashboard", label: "Dashboard" },
              { path: "/user/user-talentpool", label: "Talent Pool" },
              { path: "/user/user-projects", label: "Projects" },
              { path: "/user/user-jobs", label: "Find Jobs" },
              { path: "/user/user-upload-talent", label: "Talent Management" },
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
          <button onClick={() => navigate("/user/AI-screen")} className="ai-pill-btn">
            <span className="ai-pill-icon">✦</span>
            <span className="ai-pill-text">AI</span>
          </button>

          {/* Video Guide Icon */}
          <button 
            onClick={() => setIsVideoGuideOpen(true)} 
            type="button" 
            className="header-action-btn"
            title="Video Guide"
            style={{ color: "#f5810c" }}
          >
            <Play size={20} fill="currentColor" />
          </button>

          {/* Messages Icon */}
          <button onClick={() => navigate("/user/user-messages")} type="button" className="header-action-btn">
            <MessageCircleIcon size={20} />
          </button>

          {/* Notification Bell */}
          <Notifications />

          {/* User Profile Dropdown */}
          <div className="header-profile-wrapper" ref={profileRef}>
            <div
              className="header-profile"
              onClick={toggleProfile}
              role="button"
              tabIndex={0}
            >
              {companyData?.profilePhoto ? (
                <img
                  src={
                    companyData.profilePhoto.startsWith("http")
                      ? `${companyData.profilePhoto}?t=${Date.now()}`
                      : `https://webapidev.benmyl.com/${companyData.profilePhoto}?t=${Date.now()}`
                  }
                  alt="Profile"
                  className="profile-avatar"
                />
              ) : (
                <div className="profile-avatar initials-avatar fs-5">
                  {getInitials(user)}
                </div>
              )}

              <div className="profile-info">
                <span className="profile-name">{user}</span>
                <span className="profile-role">{role}</span>
              </div>
              <ChevronDown size={16} className={`profile-chevron ${isProfileOpen ? 'rotate' : ''}`} />
            </div>

            {/* Popover Menu */}
            {isProfileOpen && (
              <div className="profile-popover">
                <div className="popover-header">
                  <p className="popover-email">{email}</p>
                </div>
                <div className="popover-menu">
                  <button className="popover-item" onClick={handleViewProfile}>
                    <User size={16} />
                    View Profile
                  </button>
                  <button className="popover-item" onClick={() => navigate("/user/user-analytics")}>
                    <File size={16} />
                    Analytics
                  </button>
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

      <div className="app-zoom main-content-wrapper">
        <main className="cust-main">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      <ToastContainer position="top-right" autoClose={3000} />

      {/* Video Guide Popover */}
      <VideoGuidePopover 
        isOpen={isVideoGuideOpen} 
        onClose={() => setIsVideoGuideOpen(false)} 
        videoGuides={videoGuides}
      />
    </>
  );
}

export default Header;
