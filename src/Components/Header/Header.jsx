import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Search, Bell, Menu, X } from "lucide-react"; 
import "./Header.css";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
              { path: "/talent-pool", label: "Talent Pool" },
              { path: "/user/user-projects", label: "Projects" },
              { path: "/analytics", label: "Analytics" },
              { path: "/messages", label: "Message" },
              { path: "/jobs", label: "Jobs" },
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
          <div className="header-search-container">
            <Search size={16} className="header-search-icon" />
            <input
              type="text"
              placeholder="Search..."
              className="header-search-input"
            />
          </div>

          {/* Notification Bell */}
          <button type="button" className="header-action-btn">
            <Bell size={20} />
            <span className="notification-badge"></span>
          </button>

          {/* User Profile */}
          <div className="header-profile">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="User Avatar"
              className="profile-avatar"
            />
            <div className="profile-info">
              <span className="profile-name">John Smith</span>
              <span className="profile-role">HR Manager</span>
            </div>
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
