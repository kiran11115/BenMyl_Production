import React, { useState, useEffect, useRef } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom"; // Added useNavigate
import { Search, Bell, Menu, X, LogOut, User, ChevronDown } from "lucide-react";
import "./Header.css";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  
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
          <a href="/dashboard" className="header-brand">
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
              { path: "/user/user-analytics", label: "Analytics" },
              { path: "/user/user-messages", label: "Message" },
              { path: "/user/user-jobs", label: "Jobs" },
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
                <button onClick={() => navigate("/user/AI-screen")} className="ai-pill-btn">
                    <span className="ai-pill-icon">✦</span>
                    <span className="ai-pill-text">AI</span>
                  </button>
          {/* Notification Bell */}
          <button type="button" className="header-action-btn">
            <Bell size={20} />
            <span className="notification-badge"></span>
          </button>

          {/* User Profile Dropdown */}
          <div className="header-profile-wrapper" ref={profileRef}>
            <div 
              className="header-profile" 
              onClick={toggleProfile}
              role="button"
              tabIndex={0}
            >
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="User Avatar"
                className="profile-avatar"
              />
              <div className="profile-info">
                <span className="profile-name">John Smith</span>
                <span className="profile-role">HR Manager</span>
              </div>
              <ChevronDown size={16} className={`profile-chevron ${isProfileOpen ? 'rotate' : ''}`} />
            </div>

            {/* Popover Menu */}
            {isProfileOpen && (
              <div className="profile-popover">
                <div className="popover-header">
                  <p className="popover-name">John Smith</p>
                  <p className="popover-email">john.smith@benchsales.com</p>
                </div>
                <div className="popover-menu">
                  <button className="popover-item" onClick={handleViewProfile}>
                    <User size={16} />
                    View Profile
                  </button>
                   <button className="popover-item" onClick={() => navigate("/user/user-upload-talent")}>
                    <User size={16} />
                    Upload Talent
                  </button>
                  <button className="popover-item" onClick={() => navigate("/user/account-settings")}>
                    <User size={16} />
                    Account Settings
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

      <main className="cust-main h-[95%] overflow-y-auto">
        <Outlet />
      </main>
    </>
  );
}

export default Header;
