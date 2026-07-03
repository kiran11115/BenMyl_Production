import React, { useState, useEffect, useRef, useMemo } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { Search, Bell, Menu, X, LogOut, User, ChevronDown, File, Settings, MessageCircleIcon, Users, Plus, Zap, ArrowRight, LayoutDashboard, Briefcase, Calendar, FileText, CreditCard, Play, Coins, ChevronUp } from "lucide-react";
import "./AdminHeader.css";
import Notifications from "../../Header/Notifications";
import { useGetCompanyProfileEditQuery } from "../../../State-Management/Api/CompanyProfileApiSlice";
import { useGetTokenDashboardQuery } from "../../../State-Management/Api/AdminDetailsApiSlice";
import TrialPopover from "../../Header/TrialPopover";
import ProfileSideModal from "../../Header/ProfileSideModal";
import ScrollToTop from "../../ScrollToTop";
import SupportButton from "../../Common/SupportButton";
import VideoGuidePopover from "../../Guide/VideoGuidePopover";
import { videoGuides } from "../../Guide/guideData";

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


function AdminHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isVideoGuideOpen, setIsVideoGuideOpen] = useState(false);
    const [isAiPopoverOpen, setIsAiPopoverOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [showRoutineModal, setShowRoutineModal] = useState(false);
    const profileRef = useRef(null);
    const aiPopoverRef = useRef(null);
    const dropdownRef = useRef(null);

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
    const userUsedPercent = userAllocated > 0 ? Math.round((userUsed / userAllocated) * 100) : 80;

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
            name: apiData.companyname || company,
        };
    }, [apiData, company]);


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
        navigate("/Admin/admin-profile"); // Navigate to profile page
    };


    const handleSignOut = () => {
        setIsProfileOpen(false); // Close menu
        // Add your actual sign-out logic here (clearing tokens, context, etc.)
        console.log("User signed out");
        navigate("/sign-in"); // Redirect to login
    };

    const getInitials = (name = "") => {
        return name
            .trim()
            .split(" ")
            .slice(0, 2)
            .map(word => word[0]?.toUpperCase())
            .join("");
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

    return (
        <>
            <ScrollToTop />
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
                            src="/Images/Benmyl-logo.svg"
                            alt="BenchSales Logo"
                            className="header-brand-logo"
                        />
                    </a>

                    {/* Navigation Menu (Responsive) */}
                    <nav className={`header-nav ${isMenuOpen ? "mobile-active" : ""}`} ref={dropdownRef}>
                        {[
                            // { path: "/Admin/portal", label: "Control Center" },
                            { path: "/Admin/overview-dashboard", label: "Dashboard" },
                            { path: "/Admin/admin-posted-jobs", label: "Projects" },
                            { path: "/Admin/admin-talentpool", label: "Talent Pool" },
                            { path: "/Admin/admin-jobs", label: "Find Jobs" },
                            { path: "/Admin/admin-upload-talent", label: "Resource Management" },
                            
                            // {
                            //     label: "Interviews",
                            //     subItems: [
                            //         { label: "Create Interview", path: "/Admin/user-schedule-interview" },
                            //         { label: "Schedule Interview", path: "/Admin/admin-upcoming-interview" },
                            //     ]
                            // },
                            // { path: "/Admin/contract-listing", label: "Contracts" },
                        ].map((link) => (
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
                    {/* Search Bar */}
                    {/* <div className="header-search-container">
            <Search size={16} className="header-search-icon" />
            <input
              type="text"
              placeholder="Search..."
              className="header-search-input"
            />
          </div> */}
                    {/* <div className="ai-pill-wrapper" ref={aiPopoverRef}>
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
                    </div> */}
                    <button
                        className="quick-create-btn"
                        onClick={() =>
                            setShowRoutineModal(true)
                        }
                    >
                        <Plus size={14} />
                        Quick Create
                    </button>

                    {/* Settings Icon */}
                    <div className="admin-message-popover-wrapper">
                        <button
                            onClick={() => navigate('/admin/portal')}
                            type="button"
                            className="header-action-btn"
                            aria-label="Settings"
                        >
                            <Settings size={16} />
                        </button>
                    </div>

                    {/* Messages Icon */}
                    <div className="admin-message-popover-wrapper">
                        <button
                            onClick={() => navigate("/Admin/admin-messages")}
                            type="button"
                            className="header-action-btn"
                            aria-label="Messages"
                        >
                            <MessageCircleIcon size={16} />
                        </button>
                    </div>

                    {/* Video Guide Icon */}
                    <div className="admin-message-popover-wrapper">
                        <button
                            onClick={() => setIsVideoGuideOpen(true)}
                            type="button"
                            className="header-action-btn"
                            aria-label="Video Guide"
                            title="Video Guide"
                        >
                            <svg width="0" height="0" style={{ position: "absolute" }}>
                                <defs>
                                    <linearGradient id="video-btn-gradient-admin" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#3b82f6" />
                                        <stop offset="100%" stopColor="#8b5cf6" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <Play size={16} fill="url(#video-btn-gradient-admin)" stroke="url(#video-btn-gradient-admin)" />
                        </button>
                    </div>

                    {/* Notification Bell */}
                    <Notifications targetPath="/Admin/notifications-page" />

                    {/* User Profile Trigger */}
                    <div className="header-profile-wrapper" ref={profileRef}>
                        <div
                            className="header-profile"
                            onClick={toggleProfile}
                            role="button"
                            tabIndex={0}
                        >
                            {companyData?.logo ? (
                                <img
                                    src={
                                        companyData.logo.startsWith("http")
                                            ? `${companyData.logo}?t=${Date.now()}`
                                            : `https://webapidev.benmyl.com/${companyData.logo}?t=${Date.now()}`
                                    }
                                    alt="Company Logo"
                                    className="avatar-initials-premium"
                                />
                            ) : (
                                <div className="avatar-initials-premium">
                                    {getInitials(company || companyData?.name)}
                                </div>
                            )}
                            <div className="profile-info">
                                <span className="profile-name">{company || companyData?.name}</span>
                                <span className="profile-role">{role}</span>
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
                        onClick={() => navigate("/Admin/admin-subscription")} 
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

            <div className="app-zoom">
                <main className="cust-main">
                    <Outlet />
                </main>
            </div>
            {/* QUICK CREATE MODAL */}

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
                                        "/Admin/user-post-new-positions"
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
                                        "/Admin/upload-review-talent"
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
                                        "/Admin/contract-listing"
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
                                        "/Admin/admin-upcoming-interview"
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

            {/* Profile Side Modal */}
            <ProfileSideModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                onEditClick={() => {
                    setIsProfileModalOpen(false);
                    navigate("/Admin/edit-profile");
                }}
                onSignOut={handleSignOut}
                profile={{
                    name: company || emailid,
                    role: role,
                    email: emailid,
                    avatar: companyData?.logo,
                    companyName: apiData?.companyname || apiData?.companyName,
                    phone: apiData?.phone,
                    location: [apiData?.city, apiData?.state, apiData?.country].filter(Boolean).join(", "),
                    description: apiData?.description,
                    industry: apiData?.industry,
                    companyDescription: apiData?.description || "",
                    totalEmployees: apiData?.companySize || "",
                    founded: apiData?.foundedYear || "",
                    website: apiData?.websiteURL || "",
                    subscriptionType: "Enterprise Plan",
                    tokens: "150",
                }}
            />

            {/* Video Guide Popover */}
            <VideoGuidePopover
                isOpen={isVideoGuideOpen}
                onClose={() => setIsVideoGuideOpen(false)}
                videoGuides={videoGuides}
            />

        </>
    );
}

export default AdminHeader;
