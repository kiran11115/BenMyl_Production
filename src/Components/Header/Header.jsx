import React, { useState, useEffect, useRef } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { Search, Bell, Menu, X, LogOut, User, ChevronDown, File, Settings, MessageCircleIcon, Play, LayoutDashboard, Briefcase, Calendar, FileText, CreditCard, Coins, ChevronUp, Zap, ArrowRight, Sparkles } from "lucide-react";
import VideoGuidePopover from "../Guide/VideoGuidePopover";
import { videoGuides } from "../Guide/guideData";
import "./Header.css";
import Notifications from "./Notifications";
import { useGetRecruiterProfileQuery } from "../../State-Management/Api/RecruiterProfileApiSlice";
import { useGetCompanyProfileEditQuery } from "../../State-Management/Api/CompanyProfileApiSlice";
import { useGetTokenDashboardQuery } from "../../State-Management/Api/AdminDetailsApiSlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MobileBottomNav from "./MobileBottomNav";
import MobileTopBar from "./MobileTopBar";
import { usePermissions } from "../Admin/Modules/RoleConfiguration/usePermissions";
import TrialPopover from "./TrialPopover";
import ProfileSideModal from "./ProfileSideModal";
import ScrollToTop from "../ScrollToTop";
import { Plus, Users } from "lucide-react";
import SupportButton from "../Common/SupportButton";

const getNavIcon = (label) => {
  const cleanLabel = label.trim().toLowerCase().replace(/\s+/g, " ");
  switch (cleanLabel) {
    case "dashboard":
      return LayoutDashboard;
    case "projects":
      return Briefcase;
    case "talentpool":
    case "talent pool":
    case "resource management":
      return Users;
    case "find jobs":
      return Search;
    case "interviews":
      return Calendar;
    case "contracts":
      return FileText;
    case "subscription":
      return CreditCard;
    default:
      return null;
  }
};


function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isVideoGuideOpen, setIsVideoGuideOpen] = useState(false);
  const [isAiPopoverOpen, setIsAiPopoverOpen] = useState(false);
  const [showRoutineModal, setShowRoutineModal] = useState(false);
  const profileRef = useRef(null);
  const aiPopoverRef = useRef(null);

  const [isSubHeaderVisible, setIsSubHeaderVisible] = useState(() => {
    return localStorage.getItem("tokenSubHeaderVisible") !== "false";
  });

  const { data: tokenData, isLoading: isTokenLoading, isFetching: isTokenFetching } = useGetTokenDashboardQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const isTokenQueryLoading = isTokenLoading || isTokenFetching;

  const userAllocated = tokenData?.companydetails?.userAllocatedTokens ?? 1000;
  const userUsed = tokenData?.companydetails?.userUsedTokens ?? 800;
  const userAvailable = tokenData?.companydetails?.userAvailableTokens ?? 200;
  const userUsedPercent = userAllocated > 0 ? Math.round((userUsed / userAllocated) * 100) : 0;

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
    if (link.module === "Interviews" || link.module === "Contracts" || link.module === "Subscription") return true; // Always show interviews and contracts for now
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
  const location = useLocation();

  useEffect(() => {
    if (location.state?.openProfileModal) {
      setIsProfileModalOpen(true);
      // Clean up the location state so it doesn't reopen if the user refreshes or navigates back/forth
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

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
                      {(() => {
                        const Icon = getNavIcon(link.label);
                        return Icon ? <Icon className="nav-active-icon" size={14} /> : null;
                      })()}
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
                            {(() => {
                              const Icon = getNavIcon(sub.label);
                              return Icon ? <Icon className="nav-active-icon" size={14} /> : null;
                            })()}
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
                    {(() => {
                      const Icon = getNavIcon(link.label);
                      return Icon ? <Icon className="nav-active-icon" size={14} /> : null;
                    })()}
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
          {/* AI Assistant Navigation Icon */}
          <button
            onClick={() => navigate("/user/AI-screen")}
            type="button"
            className="header-action-btn ai-nav-btn"
            title="AI Screen"
          >
            <svg width="0" height="0" style={{ position: "absolute" }}>
              <defs>
                <linearGradient id="ai-btn-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ec4899">
                    <animate attributeName="stop-color" values="#ec4899; #a855f7; #3b82f6; #ec4899" dur="4s" repeatCount="indefinite" />
                  </stop>
                  <stop offset="100%" stopColor="#3b82f6">
                    <animate attributeName="stop-color" values="#3b82f6; #ec4899; #a855f7; #3b82f6" dur="4s" repeatCount="indefinite" />
                  </stop>
                </linearGradient>
              </defs>
            </svg>
            <Sparkles size={20} fill="url(#ai-btn-gradient)" stroke="url(#ai-btn-gradient)" />
          </button>

          {/* Video Guide Icon */}
          <button
            onClick={() => setIsVideoGuideOpen(true)}
            type="button"
            className="header-action-btn"
            title="Video Guide"
          >
            <svg width="0" height="0" style={{ position: "absolute" }}>
              <defs>
                <linearGradient id="video-btn-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            <Play size={20} fill="url(#video-btn-gradient)" stroke="url(#video-btn-gradient)" />
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

      {/* Collapsible Token Sub-Header */}
      <div className={`token-sub-header ${!isSubHeaderVisible ? "hidden" : ""}`}>
        <div className="token-info">
          <Coins className="token-icon" size={14} />
          <span className="token-title">Token Credits:</span>
          <span className="token-details">
            {isTokenQueryLoading ? (
              <span className="token-loader"></span>
            ) : (
              <>
                <strong>{userAvailable}</strong> available / <strong>{userAllocated}</strong> allocated
              </>
            )}
          </span>
        </div>
        
        <div className="token-usage-container">
          <span className="token-usage-text">Usage:</span>
          <div className="token-usage-bar-wrapper">
            <div className="token-usage-bar-container">
              <div 
                className="token-usage-progress" 
                style={{ width: `${Math.min(userUsedPercent, 100)}%` }}
              ></div>
            </div>
          </div>
          {isTokenQueryLoading ? (
            <span className="token-loader" style={{ marginLeft: "10px" }}></span>
          ) : (
            <span className="token-usage-percent">{userUsedPercent}% ({userUsed} used)</span>
          )}
        </div>

        <div className="token-actions">
          <button 
            onClick={() => navigate("/user/user-subscription")} 
            className="token-btn-view-details"
          >
            View Details
          </button>
          <button 
            onClick={() => {
              setIsSubHeaderVisible(false);
              localStorage.setItem("tokenSubHeaderVisible", "false");
            }} 
            className="token-btn-hide"
            title="Hide Details"
          >
            <ChevronUp size={14} />
          </button>
        </div>
      </div>

      {!isSubHeaderVisible && (
        <button 
          className="token-sub-header-show-trigger" 
          onClick={() => {
            setIsSubHeaderVisible(true);
            localStorage.setItem("tokenSubHeaderVisible", "true");
          }}
          title="Show Token Details"
        >
          <Coins size={12} className="token-trigger-icon" />
          {isTokenQueryLoading ? (
            <span className="token-loader inline"></span>
          ) : (
            <span>Tokens: {userAvailable}</span>
          )}
          <ChevronDown size={12} className="token-trigger-chevron" />
        </button>
      )}

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
                <Zap size={18} className="icon-pulse-anim" />
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

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                  <div className="routine-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>
                    <File size={18} />
                  </div>
                  <div className="routine-arrow"><ArrowRight size={16} /></div>
                </div>

                <h4 style={{ position: 'relative', zIndex: 1 }}>Create Job</h4>

                <span>
                  Create hiring requirements.
                </span>
                <div className="routine-bg-icon" style={{ color: '#3b82f6' }}><File size={80} /></div>
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

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                  <div className="routine-icon" style={{ background: '#f5f3ff', color: '#8b5cf6' }}>
                    <Users size={18} />
                  </div>
                  <div className="routine-arrow"><ArrowRight size={16} /></div>
                </div>

                <h4 style={{ position: 'relative', zIndex: 1 }}>Upload Talent</h4>

                <span>
                  AI parser candidate upload.
                </span>
                <div className="routine-bg-icon" style={{ color: '#8b5cf6' }}><Users size={80} /></div>
              </div>

              {/* CONTRACT */}

              <div
                className="routine-card"
                onClick={() => {
                  navigate(
                    "/user/contract-listing"
                  );
                  setShowRoutineModal(false);
                }}
              >

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                  <div className="routine-icon" style={{ background: '#ecfdf5', color: '#10b981' }}>
                    <Users size={18} />
                  </div>
                  <div className="routine-arrow"><ArrowRight size={16} /></div>
                </div>

                <h4 style={{ position: 'relative', zIndex: 1 }}>Create Contract</h4>

                <span>
                  Manage contract listings.
                </span>
                <div className="routine-bg-icon" style={{ color: '#10b981' }}><Users size={80} /></div>
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

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                  <div className="routine-icon" style={{ background: '#fff7ed', color: '#f97316' }}>
                    <Bell size={18} />
                  </div>
                  <div className="routine-arrow"><ArrowRight size={16} /></div>
                </div>

                <h4 style={{ position: 'relative', zIndex: 1 }}>Schedule Interview</h4>

                <span>
                  Coordinate interview flow
                </span>
                <div className="routine-bg-icon" style={{ color: '#f97316' }}><Bell size={80} /></div>
              </div>

            </div>

          </div>

        </div>

      )}

      <SupportButton />
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
          companyDescription: companyApiData?.description || "",
          totalEmployees: companyApiData?.companySize || "",
          founded: companyApiData?.foundedYear || "",
          website: companyApiData?.websiteURL || "",
          subscriptionType: "Enterprise Plan",
          tokens: "150",
        } : { name: user, role, email, subscriptionType: "Enterprise Plan", tokens: "150" }}
      />
    </>
  );
}

export default Header;
