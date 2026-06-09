import React, { useState, useEffect, useRef } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Search, Bell, Menu, X, LogOut, User, ChevronDown, File, Settings, MessageCircleIcon, Play } from "lucide-react";
import VideoGuidePopover from "../Guide/VideoGuidePopover";
import { videoGuides } from "../Guide/guideData";
import "./Header.css";
import Notifications from "./Notifications";
import { useGetRecruiterProfileQuery } from "../../State-Management/Api/RecruiterProfileApiSlice";
import { useGetCompanyProfileEditQuery } from "../../State-Management/Api/CompanyProfileApiSlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MobileBottomNav from "./MobileBottomNav";
import MobileTopBar from "./MobileTopBar";
import { usePermissions } from "../Admin/Modules/RoleConfiguration/usePermissions";
import TrialPopover from "./TrialPopover";
import ProfileSideModal from "./ProfileSideModal";
import ScrollToTop from "../ScrollToTop";
import { Plus, Users } from "lucide-react";


function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isVideoGuideOpen, setIsVideoGuideOpen] = useState(false);
  const [isAiPopoverOpen, setIsAiPopoverOpen] = useState(false);
  const [showRoutineModal, setShowRoutineModal] = useState(false);
  const profileRef = useRef(null);
  const aiPopoverRef = useRef(null);

  const user = localStorage.getItem("UserName");
  const role = localStorage.getItem("Role");
  const email = localStorage.getItem("Email");
  const userId = localStorage.getItem("CompanyId");

  const { data: apiData, isLoading } =
    useGetRecruiterProfileQuery(Number(userId), {
      skip: !userId,
    });

  const { data: companyApiData } = useGetCompanyProfileEditQuery(email, {
    skip: !email,
  });

  const { hasPermission, isLoading: isPermLoading } = usePermissions();

  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  const navigationData = {
    "Recruiter": [
      { label: "Dashboard", path: "/user/user-dashboard", module: "Main Dashboard" },
      {
        label: "Projects",
        module: "Projects",
        path: "/user/user-posted-jobs"
      },
      { label: "Talentpool", path: "/user/user-talentpool", module: "Talent Pool" },
      {
        label: "Interviews",
        module: "Interviews",
        path: "/user/user-upcoming-interview"
      },
      { label: "Contracts", path: "/user/contract-listing", module: "Contracts" },

    ],
    "Benchsales": [
      { label: "Dashboard", path: "/user/user-dashboard", module: "Main Dashboard" },
      { label: "Resource  Management", path: "/user/user-upload-talent", module: "Talent Pool" },
      { label: "Find Jobs", path: "/user/user-Jobs", module: "Job Management" },
      { label: "Interviews", path: "/user/user-upcoming-interview", module: "Interviews" },
      { label: "Contracts", path: "/user/contract-listing", module: "Contracts" },

    ],
    "Recruiter2": [
      { label: "Dashboard", path: "/user/user-dashboard", module: "Main Dashboard" },
      {
        label: "Projects",
        module: "Projects",
        path: "/user/user-posted-jobs"
      },
      { label: "Talentpool", path: "/user/user-talentpool", module: "Talent Pool" },
      {
        label: "Interviews",
        module: "Interviews",
        path: "/user/user-upcoming-interview"
        // subItems: [
        //   { label: "Create Interview", path: "/user/user-schedule-interview" },
        //   { label: "Schedule Interview", path: "/user/user-upcoming-interview" },
        // ],
      },
      { label: "Contracts", path: "/user/contract-listing", module: "Contracts" },
      { label: "Resource  Management", path: "/user/user-upload-talent", module: "Talent Pool" },
      { label: "Find Jobs", path: "/user/user-Jobs", module: "Job Management" },
    ]
  };

  const navLinks = navigationData[role] || navigationData["Recruiter"];

  const filteredNavLinks = navLinks.filter(link => {
    if (link.module === "Interviews" || link.module === "Contracts") return true; // Always show interviews and contracts for now
    return hasPermission(link.module, 'view');
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
    setIsProfileModalOpen(true);
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
      if (aiPopoverRef.current && !aiPopoverRef.current.contains(event.target)) {
        setIsAiPopoverOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
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
      <ScrollToTop />
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
              src="/Images/Benmyl-logo.svg"
              alt="BenchSales Logo"
              className="header-brand-logo"
            />
          </a>

          {/* Navigation Menu (Responsive) */}
          <nav className={`header-nav ${isMenuOpen ? "mobile-active" : ""}`} ref={dropdownRef}>
            {filteredNavLinks.map((link) => (
              <div key={link.label} className="nav-item-container">
                {link.subItems ? (
                  <div className="nav-dropdown-wrapper">
                    <button
                      className={`header-nav-link dropdown-trigger ${openDropdown === link.label ? "active" : ""}`}
                      onClick={() => setOpenDropdown(openDropdown === link.label ? null : link.label)}
                    >
                      {link.label}
                      <ChevronDown size={14} className={`dropdown-icon ${openDropdown === link.label ? "rotate" : ""}`} />
                    </button>
                    {openDropdown === link.label && (
                      <div className="nav-dropdown-menu">
                        {link.subItems.map((sub) => (
                          <NavLink
                            key={sub.path}
                            to={sub.path}
                            className={({ isActive }) =>
                              `dropdown-item ${isActive ? "active" : ""}`
                            }
                            onClick={() => {
                              setOpenDropdown(null);
                              setIsMenuOpen(false);
                            }}
                          >
                            {sub.label}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <NavLink
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `header-nav-link ${isActive ? "active" : ""}`
                    }
                  >
                    {link.label}
                  </NavLink>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Right Section: Tools & Profile */}
        <div className="header-right">
          {role === "Recruiter2" && (
            <button
              className="quick-create-btn"
              onClick={() => setShowRoutineModal(true)}
            >
              <Plus size={14} />
              Quick Create
            </button>
          )}
          {/* AI Assistant Pill with Coming Soon Popover */}
          {/* <div className="ai-pill-wrapper" ref={aiPopoverRef}>
            <button
              className="ai-pill-btn"
              onClick={() => setIsAiPopoverOpen((prev) => !prev)}
            >
              <span className="ai-pill-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3L14.5 9.5L21 12L14.5 14.5L12 21L9.5 14.5L3 12L9.5 9.5L12 3Z" fill="url(#gemini-gradient)" />
                  <defs>
                    <linearGradient id="gemini-gradient" x1="0%" y1="0%" x2="100%" y2="100%" gradientUnits="userSpaceOnUse">
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
                    <path d="M12 3L14.5 9.5L21 12L14.5 14.5L12 21L9.5 14.5L3 12L9.5 9.5L12 3Z" fill="url(#cs-gradient)" />
                    <defs>
                      <linearGradient id="cs-gradient" x1="0%" y1="0%" x2="100%" y2="100%" gradientUnits="userSpaceOnUse">
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
          </div> */}

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

          {/* User Profile Trigger */}
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
                  className="avatar-initials-premium"
                />
              ) : (
                <div className="avatar-initials-premium">
                  {getInitials(user)}
                </div>
              )}

              <div className="profile-info">
                <span className="profile-name">{user}</span>
                <span className="profile-role">{role === "Recruiter" ? "Hiring Manager" : role === "Benchsales" ? "Bench Sales" : role === "Recruiter2" ? "Recruiter" : role}</span>
              </div>
              <ChevronDown size={16} className="profile-chevron" />
            </div>
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
      {showRoutineModal && (

        <div className="routine-modal-overlay">

          <div className="routine-modal">

            <div className="routine-header">

              <div className="routine-title">

                <span>
                  QUICK LAUNCH
                </span>

              </div>

              <button
                className="routine-close"
                onClick={() =>
                  setShowRoutineModal(false)
                }
              >
                ✕
              </button>

            </div>

            <div className="routine-divider"></div>

            <p className="routine-subtitle">

              Instantly execute workspace workflows.

            </p>

            <div className="routine-grid">

              {/* CREATE JOB */}

              <div
                className="routine-card"
                onClick={() => {
                  navigate(
                    "/user/user-post-new-positions"
                  );
                  setShowRoutineModal(false);
                }}
              >

                <div className="routine-icon">
                  <File size={18} />
                </div>

                <h4>Create Job</h4>

                <span>
                  Create hiring requirements.
                </span>

              </div>

              {/* UPLOAD TALENT */}

              <div
                className="routine-card"
                onClick={() => {
                  navigate(
                    "/user/upload-review-talent"
                  );
                  setShowRoutineModal(false);
                }}
              >

                <div className="routine-icon">
                  <Users size={18} />
                </div>

                <h4>Upload Talent</h4>

                <span>
                  AI parser candidate upload.
                </span>

              </div>

              {/* TALENT POOL */}

              <div
                className="routine-card"
                onClick={() => {
                  navigate(
                    "/user/contract-listing"
                  );
                  setShowRoutineModal(false);
                }}
              >

                <div className="routine-icon">
                  <Users size={18} />
                </div>

                <h4>Create Contract</h4>

                <span>
                  Manage contract listings.
                </span>

              </div>

              {/* INTERVIEW */}

              <div
                className="routine-card"
                onClick={() => {
                  navigate(
                    "/user/user-upcoming-interview"
                  );
                  setShowRoutineModal(false);
                }}
              >

                <div className="routine-icon">
                  <Bell size={16} />
                </div>

                <h4>Schedule Interview</h4>

                <span>
                  Coordinate interview flow
                </span>

              </div>

            </div>

          </div>

        </div>

      )}

      <TrialPopover />

      {/* Video Guide Popover */}
      <VideoGuidePopover
        isOpen={isVideoGuideOpen}
        onClose={() => setIsVideoGuideOpen(false)}
        videoGuides={videoGuides}
      />

      {/* Profile Side Modal */}
      <ProfileSideModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onEditClick={() => {
          setIsProfileModalOpen(false);
          const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
          navigate(`${basePath}/edit-profile`);
        }}
        onSignOut={handleSignOut}
        profile={apiData ? {
          name: apiData.fullName,
          role: role === "Recruiter" ? "Hiring Manager" : role === "Benchsales" ? "Bench Sales" : role === "Recruiter2" ? "Recruiter" : role,
          email: apiData.emailid,
          phone: apiData.phone,
          avatar: apiData.profilePhoto,
          location: [apiData.city, apiData.state, apiData.country].filter(Boolean).join(", "),
          companyName: apiData.companyName,
          industry: apiData.role,
          jobtitle: apiData.jobtitle,
          company: apiData.company,
          experience: apiData.experience,
          education: apiData.education,
          linkedinUrl: apiData.linkedinURL,
          description: apiData.description,
          languagesSpoken: apiData.languagesSpoken
            ? apiData.languagesSpoken.split(",").map(l => l.trim()).filter(Boolean)
            : [],
          companyDescription: companyApiData?.description || "Providing innovative solutions for the future.",
          totalEmployees: companyApiData?.companySize || "11-50 employees",
          founded: companyApiData?.foundedYear || "2020",
          website: companyApiData?.websiteURL || "https://benmyl.com",
          subscriptionType: "Enterprise Plan",
          tokens: "150",
        } : { name: user, role, email, subscriptionType: "Enterprise Plan", tokens: "150" }}
      />
    </>
  );
}

export default Header;
