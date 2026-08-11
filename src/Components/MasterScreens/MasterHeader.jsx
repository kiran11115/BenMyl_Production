import React, { useState, useRef, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Building2, 
  Network, 
  CreditCard, 
  LogOut, 
  Menu, 
  X, 
  ShieldAlert,
  User,
  Bell,
  ChevronDown,
  Share2
} from "lucide-react";
import "./MasterHeader.css";

const MasterHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = localStorage.getItem("Email") || "master@benmyl.com";
  const countryReg = localStorage.getItem("countryRegistration");
  const profileRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("Email");
    localStorage.removeItem("Role");
    localStorage.removeItem("UserName");
    localStorage.removeItem("CompanyName");
    navigate("/sign-in");
  };

  const menuItems = [
    { path: "/MasterAdmin/dashboard", name: "Dashboard", icon: LayoutDashboard },
    { path: "/MasterAdmin/companies", name: "Companies", icon: Building2 },
    { path: "/MasterAdmin/network", name: "Network", icon: Network },
    { path: "/MasterAdmin/billing", name: "Billing", icon: CreditCard },
    { path: "/MasterAdmin/share", name: "Share", icon: Share2 },
  ];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="master-header-layout">
      {/* Top Header */}
      <header className="master-header-container">
        <div className="master-header-left">
          {/* Mobile Menu Toggle Button */}
          <button className="master-menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Brand */}
          <a className="master-header-brand" href="#/">
            <img
              src="/Images/Benmyl-logo.svg"
              alt="BenMyl Logo"
              className="master-header-brand-logo"
            />
            <span className="master-header-brand-text">BenMyl Master Console</span>
          </a>

          {/* Navigation Menu */}
          <nav className={`master-header-nav ${isMenuOpen ? "mobile-active" : ""}`}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => 
                    `master-header-nav-link ${isActive ? "active" : ""}`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon size={14} className="nav-icon" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Right tools and profile */}
        <div className="master-header-right">
          <div className="master-system-status">
            <span className="status-indicator live"></span>
            <span className="status-label">All Systems Live</span>
          </div>

          <button className="master-icon-button" title="Notifications">
            <Bell size={18} />
            <span className="badge-dot"></span>
          </button>

          {/* Profile Dropdown */}
          <div className="master-profile-dropdown-wrapper" ref={profileRef}>
            <button 
              className="master-profile-trigger"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className="master-avatar-small">
                <User size={14} />
              </div>
              <span className="master-user-role-badge" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                Super Admin
                {String(countryReg) === "1" ? (
                  <img src="https://flagcdn.com/w20/us.png" alt="US" style={{ width: "14px", height: "auto" }} />
                ) : String(countryReg) === "2" ? (
                  <img src="https://flagcdn.com/w20/in.png" alt="IN" style={{ width: "14px", height: "auto" }} />
                ) : null}
              </span>
              <ChevronDown size={14} className={`dropdown-chevron ${isProfileOpen ? "rotate" : ""}`} />
            </button>

            {isProfileOpen && (
              <div className="master-profile-dropdown-menu">
                <div className="master-dropdown-header">
                  <div className="master-avatar-large">
                    <ShieldAlert size={20} />
                  </div>
                  <div className="master-user-details">
                    <span className="master-user-name">Master Admin</span>
                    <span className="master-user-email">{email}</span>
                  </div>
                </div>
                <div className="master-dropdown-divider"></div>
                <button onClick={handleLogout} className="master-dropdown-item logout">
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Content Render View */}
      <main className="master-main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default MasterHeader;
