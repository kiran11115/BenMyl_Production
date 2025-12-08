import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Search, Bell } from "lucide-react"; // Using lucide-react icons as seen in your previous code
import "./Header.css";

function Header() {
  return (
    <>
      <header className="header-container">
        {/* Left Section: Brand & Nav */}
        <div className="header-left">
          {/* Brand */}
          <a href="/dashboard" className="header-brand">
            {/* Replace with your 'BS' logo image if you have one, or use text/div fallback */}
            <img
              src="/Images/Benmyl White logo.svg"
              alt="BenchSales Logo"
              className="header-brand-logo"
            />
          </a>

          {/* Navigation Menu */}
          <nav className="header-nav">
            <NavLink
              to="/user/user-dashboard"
              className={({ isActive }) =>
                `header-nav-link ${isActive ? "active" : ""}`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/talent-pool"
              className={({ isActive }) =>
                `header-nav-link ${isActive ? "active" : ""}`
              }
            >
              Talent Pool
            </NavLink>
            <NavLink
              to="/user/user-projects"
              className={({ isActive }) =>
                `header-nav-link ${isActive ? "active" : ""}`
              }
            >
              Projects
            </NavLink>
            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                `header-nav-link ${isActive ? "active" : ""}`
              }
            >
              Analytics
            </NavLink>
            <NavLink
              to="/messages"
              className={({ isActive }) =>
                `header-nav-link ${isActive ? "active" : ""}`
              }
            >
              Message
            </NavLink>
            <NavLink
              to="/jobs"
              className={({ isActive }) =>
                `header-nav-link ${isActive ? "active" : ""}`
              }
            >
              Jobs
            </NavLink>
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
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
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
