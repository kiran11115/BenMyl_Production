import React, { useState, useMemo, useEffect } from "react";
import {
    FiCalendar,
    FiClock,
    FiPlus,
    FiArrowLeft,
    FiBriefcase,
    FiChevronLeft,
    FiChevronRight,
    FiMapPin,
    FiX,
    FiEyeOff,
    FiMessageSquare,
    FiSave,
    FiCheckSquare
} from "react-icons/fi";
import { GiCheckMark } from "react-icons/gi";
import "./UpcomingInterview.css";
import "../UserJobs/Jobs.css";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useSchedulesDetailsQuery, useSchedulesDetailsBenchsalesQuery, useUpdateInterviewStatusMutation } from "../../State-Management/Api/ScheduleInterviewApiSlice";
import { useGetGroupedJobTitlesQuery } from "../../State-Management/Api/TalentPoolApiSlice";
import { useGetRecruiterProfileQuery } from "../../State-Management/Api/RecruiterProfileApiSlice";
import ModuleHeader from "../Admin/Modules/ModuleHeader";
import { Home } from "lucide-react";
import JobOverviewCard from "../TalentPool/JobOverviewCard";
import { FiEye } from "react-icons/fi";
import ScheduleInterviewDrawer from "../ScheduleInterview/ScheduleInterviewDrawer";

const formatDateToDisplay = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (isNaN(date)) return value;

    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
};



export default function UpcomingInterview() {
    const navigate = useNavigate();
    const location = useLocation();
    const [navDate, setNavDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedInterview, setSelectedInterview] = useState(null);
    const [view, setView] = useState("list"); // list | detail
    const [meetingLinkInput, setMeetingLinkInput] = useState("");
    const [isJobExpanded, setIsJobExpanded] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showCalendarModal, setShowCalendarModal] = useState(false);
    const [showJobModal, setShowJobModal] = useState(false);
    const [feedTab, setFeedTab] = useState("scheduled"); // scheduled | completed
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, interviewId: null, interviewIdVal: null, newStatus: "" });
    const [activeStatusPopoverId, setActiveStatusPopoverId] = useState(null);

    useEffect(() => {
        const handleDocumentClick = () => {
            setActiveStatusPopoverId(null);
        };
        document.addEventListener("click", handleDocumentClick);
        return () => document.removeEventListener("click", handleDocumentClick);
    }, []);

    const [updateInterviewStatus] = useUpdateInterviewStatusMutation();

    const handleUpdateStatus = async (interviewId, newStatus) => {
        if (!interviewId) {
            toast.error("Interview ID is missing.");
            return;
        }
        try {
            await updateInterviewStatus({
                recruiterId: Number(interviewId),
                interviewStatus: newStatus
            }).unwrap();
            toast.success(`Interview status updated to ${newStatus} successfully.`);
        } catch (err) {
            toast.error("Failed to update interview status.");
            console.error(err);
        }
    };

    // Support auto-opening drawer and preselection from navigation state
    const [isDrawerOpen, setIsDrawerOpen] = useState(location.state?.openDrawer || false);
    const [preSelectedJobId, setPreSelectedJobId] = useState(location.state?.preSelectedJobId || null);
    const [preSelectedCandidateId, setPreSelectedCandidateId] = useState(location.state?.preSelectedCandidateId || null);

    const [isNextInterviewHidden, setIsNextInterviewHidden] = useState(true);

    const recruiterId = localStorage.getItem("CompanyId");
    const userRole = localStorage.getItem("Role");
    const isBenchsales = userRole === "Benchsales";
    const isRecruiter2 = userRole === "Recruiter2";
    const isAdmin = userRole === "Admin" || window.location.pathname.toLowerCase().startsWith('/admin');

    const shouldFetchBoth = isRecruiter2 || isAdmin;
    const shouldFetchNormal = !isBenchsales || shouldFetchBoth;
    const shouldFetchBench = isBenchsales || shouldFetchBoth;

    const { data: apiInterviewsNormal = [], isLoading: isLoadingNormal, isError: isErrorNormal } = useSchedulesDetailsQuery(recruiterId, {
        skip: !recruiterId || !shouldFetchNormal,
        refetchOnMountOrArgChange: true
    });

    const { data: apiInterviewsBench = [], isLoading: isLoadingBench, isError: isErrorBench } = useSchedulesDetailsBenchsalesQuery(recruiterId, {
        skip: !recruiterId || !shouldFetchBench,
        refetchOnMountOrArgChange: true
    });

    let apiInterviews = [];
    if (shouldFetchBoth) {
        apiInterviews = [...apiInterviewsNormal, ...apiInterviewsBench];
    } else if (isBenchsales) {
        apiInterviews = apiInterviewsBench;
    } else {
        apiInterviews = apiInterviewsNormal;
    }

    const isLoading = shouldFetchBoth ? (isLoadingNormal || isLoadingBench) : (isBenchsales ? isLoadingBench : isLoadingNormal);
    const isError = shouldFetchBoth ? (isErrorNormal || isErrorBench) : (isBenchsales ? isErrorBench : isErrorNormal);

    const { data: fetchedJobs } = useGetGroupedJobTitlesQuery(recruiterId, { skip: !recruiterId });

    const interviews = useMemo(() => {
        if (!Array.isArray(apiInterviews)) return [];
        return apiInterviews.map((item, index) => {
            const dateStr = item.interviewDate || "";
            const dateParts = dateStr ? dateStr.split('T')[0].split('-') : [];
            const dateObj = dateParts.length === 3
                ? new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]))
                : (item.interviewDate ? new Date(item.interviewDate) : new Date());

            // Derive status if not present (simple logic: past = completed, future = scheduled)
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            let derivedStatus = "scheduled";
            if (dateObj < today) {
                derivedStatus = "completed";
            }

            const candidateId = item.candidateID || index;
            let status = item.status?.toLowerCase() || derivedStatus;
            if (status === "ongoing" || status === "scheduled") {
                status = "scheduled";
            } else if (status === "completed") {
                status = "completed";
            }

            // Find matching job for description enrichment
            const matchingJob = fetchedJobs?.find(j => j.jobTitle === item.jobTitle);
            const enrichedDescription = item.jobDescription || matchingJob?.jobDescription || "";

            return {
                id: candidateId,
                date: dateObj,
                dateLabel: formatDateToDisplay(dateObj),
                time: item.interviewTime,
                name: item.candidateName,
                email: item.emailAddress,
                avatar: item.profilePicture || "",
                role: item.title,
                experience: `${item.experienceYears} Years`,
                location: item.interviewLocation || "Remote",
                rating: 4.5,
                verified: true,
                skills: item.skills ? item.skills.split(",").map(s => s.trim()) : [],
                status: status,
                rawStatus: item.status || (status === "completed" ? "Completed" : "Ongoing"),
                vendorName: item.companyName,
                partnerContact: item.candidateName,
                meetingLink: item.interviewLink,
                recruiterID: item.recruiterID || item.recruiterId || null,
                interviewId: item.interviewId || item.interviewID || null,
                jobData: {
                    title: item.jobTitle,
                    company: item.companyName,
                    location: item.interviewLocation || "Remote",
                    budget: item.salary,
                    salaryType: item.salaryType,
                    experience: item.experienceYears,
                    type: "Full-time",
                    description: enrichedDescription,
                    requiredSkills: item.skills ? item.skills.split(",").map(s => s.trim()) : []
                }
            };
        }).sort((a, b) => a.date - b.date);
    }, [apiInterviews, fetchedJobs]);

    const totalScheduled = interviews.filter(it => it.status === "scheduled").length;
    const totalCompleted = interviews.filter(it => it.status === "completed").length;

    const nextInterview = useMemo(() => {
        const upcoming = interviews.filter(it => it.status === "scheduled");
        if (upcoming.length === 0) return null;
        return upcoming[0];
    }, [interviews]);

    const filteredInterviews = useMemo(() => {
        let list = interviews;

        // Only display scheduled interviews
        list = list.filter(it => it.status === "scheduled");

        // Filter by Search Query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            list = list.filter(it =>
                it.name.toLowerCase().includes(query) ||
                it.role.toLowerCase().includes(query) ||
                it.vendorName.toLowerCase().includes(query)
            );
        }

        // Filter by Calendar Date
        if (!selectedDate) return list;
        return list.filter(it =>
            it.date.getDate() === selectedDate.getDate() &&
            it.date.getMonth() === selectedDate.getMonth() &&
            it.date.getFullYear() === selectedDate.getFullYear()
        );

    }, [interviews, selectedDate, searchQuery]);

    // Completed interviews — derives from the same `interviews` array, no API changes
    const completedInterviews = useMemo(() => {
        let list = interviews.filter(it => it.status === "completed");
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            list = list.filter(it =>
                it.name.toLowerCase().includes(query) ||
                it.role.toLowerCase().includes(query) ||
                it.vendorName.toLowerCase().includes(query)
            );
        }
        return list;
    }, [interviews, searchQuery]);

    const handleViewDetail = (interview) => {
        const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
        const targetPath = window.location.pathname.toLowerCase().startsWith('/admin') ? `${basePath}/admin-interview-details` : `${basePath}/user-interview-details`;
        navigate(targetPath, { state: { interview } });
    };

    const handleShare = () => {
        if (!meetingLinkInput) {
            toast.warning("Please provide a meeting link before sharing.");
            return;
        }
        toast.success(`Meeting link has been sent to ${selectedInterview.name}'s email successfully!`);
    };

    const getInitials = (name = "") => {
        return name
            .trim()
            .split(" ")
            .slice(0, 2)
            .map(word => word[0]?.toUpperCase())
            .join("");
    };

    const isInterviewDate = (day, month, year) => {
        return interviews.some(it =>
            it.date.getDate() === day &&
            it.date.getMonth() === month &&
            it.date.getFullYear() === year
        );
    };

    const handlePrevMonth = () => {
        setNavDate(new Date(navDate.getFullYear(), navDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setNavDate(new Date(navDate.getFullYear(), navDate.getMonth() + 1, 1));
    };

    const isUser = !window.location.pathname.toLowerCase().startsWith('/admin');
    const basePath = isUser ? '/User' : '/Admin';

    return (
        <div className="ui-page">
            {/* Hero Header with Blue Gradient */}
            <div className="hero-section-wrapper mb-4">        <div className="hero-card ">          <div className="hero-concentric-lines"></div>         <div className="hero-ripple-pattern"></div>         <div className="hero-circular-highlights"></div>
                <FiCalendar
                    size={240}
                    style={{
                        position: 'absolute',
                        right: '30%',
                        top: '50%',
                        transform: 'translateY(-50%) rotate(-10deg)',
                        color: '#ffffff',
                        opacity: 0.04,
                        zIndex: 1,
                        pointerEvents: 'none'
                    }}
                />
                <div className="hero-left">
                    <div className="hero-pill">
                        ✦ Interview Management
                    </div>
                    <div className="hero-title-row">
                        <h1 className="text-white" style={{ position: 'relative', zIndex: 2 }}>
                            Upcoming Interviews
                        </h1>

                        {userRole !== 'Benchsales' && (
                            <div className="hero-buttons">
                                <button
                                    onClick={() => setIsNextInterviewHidden(!isNextInterviewHidden)}
                                    className="routine-btn"
                                >
                                    {isNextInterviewHidden ? <FiEye size={16} /> : <FiEyeOff size={16} />}
                                    <span>{isNextInterviewHidden ? "Show Interviews" : "Hide Interviews"}</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setPreSelectedJobId(null);
                                        setPreSelectedCandidateId(null);
                                        setIsDrawerOpen(true);
                                    }}
                                    className="routine-btn"
                                >
                                    <FiPlus size={16} />
                                    <span>Add New Interview</span>
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="hero-content-row">
                        <p className="hero-subtitle" style={{ position: 'relative', zIndex: 2 }}>
                            Manage your scheduled interviews, track candidate availability, and monitor upcoming meetings.
                        </p>
                    </div>
                </div>
                <div className="hero-illustration">
                    <div className="hero-particles">
                        <div className="particle"></div>
                        <div className="particle"></div>
                        <div className="particle"></div>
                        <div className="particle"></div>
                        <div className="particle"></div>
                        <div className="particle"></div>
                    </div>
                    <img src="/Images/Calender.png" alt="Dashboard Illustration" className="hero-svg-image" />
                </div>
            </div>
            </div>

            {nextInterview && !selectedDate && !searchQuery && (
                <div className={`next-interview-metrics-container ${isNextInterviewHidden ? 'hidden' : ''}`}>
                    <div className="hero-next-interview" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div className="hero-content">
                            <div className="hero-label-row d-flex align-items-center gap-2 mb-2">
                                <div className="hero-pill" style={{ fontSize: '11px', padding: '4px 10px' }}>
                                    ✦ Next Interview
                                </div>
                            </div>
                            <div className="hero-main" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div className="hero-info" style={{ flex: 1 }}>
                                    <h2 className="hero-candidate-name" style={{ fontSize: '16px', marginBottom: '4px', color: "white", textTransform: "uppercase", lineHeight: "10px" }}>{nextInterview.name}</h2>
                                    <p className="hero-candidate-role" style={{ fontSize: '11px', marginBottom: '8px' }}>{nextInterview.role} • {nextInterview.vendorName}</p>
                                    <div className="hero-time-box d-flex gap-2" style={{ fontSize: '12px', padding: '6px 12px', marginTop: "15px" }}>
                                        <FiCalendar className="icon" /> {nextInterview.dateLabel}
                                        <FiClock className="icon ms-2" /> {nextInterview.time}
                                    </div>
                                </div>
                                <div className="hero-actions" style={{ flexDirection: 'column', gap: '8px', minWidth: '130px', marginLeft: '16px' }}>
                                    <button
                                        className="routine-btn"
                                        onClick={() => {
                                            if (
                                                !nextInterview.meetingLink ||
                                                nextInterview.meetingLink === "null"
                                            ) {
                                                toast.warning(
                                                    "Meeting link is not available. Please open Interview Details and share the meeting link."
                                                );

                                                handleViewDetail(nextInterview); // move to Interview Details page
                                                return;
                                            }

                                            window.open(
                                                nextInterview.meetingLink,
                                                "_blank",
                                                "noopener,noreferrer"
                                            );
                                        }}
                                    >
                                        Join Meeting
                                    </button>
                                    <button className="hero-details-btn" onClick={() => handleViewDetail(nextInterview)} style={{ padding: '8px 12px', fontSize: '12px' }}>
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="ui-metric-cards">
                        <div className="ui-metric-card">
                            <div className="ui-metric-header">
                                <span className="ui-metric-title">Total Scheduled</span>
                                <div className="ui-metric-icon" style={{ background: '#f8fafc', color: '#6366f1' }}>
                                    <FiCalendar size={18} />
                                </div>
                            </div>
                            <div className="ui-metric-body">
                                <span className="ui-metric-value">{totalScheduled}</span>
                                <span className="ui-metric-badge badge-green">+100%</span>
                            </div>
                            <div className="ui-metric-footer">
                                <span className="ui-metric-footer-text">Updated just now</span>
                                <span className="ui-metric-footer-link">↗ View All</span>
                            </div>
                        </div>
                        <div className="ui-metric-card">
                            <div className="ui-metric-header">
                                <span className="ui-metric-title">Total Completed</span>
                                <div className="ui-metric-icon" style={{ background: '#f8fafc', color: '#10b981' }}>
                                    <GiCheckMark size={18} />
                                </div>
                            </div>
                            <div className="ui-metric-body">
                                <span className="ui-metric-value">{totalCompleted}</span>
                                <span className="ui-metric-badge badge-green">+100%</span>
                            </div>
                            <div className="ui-metric-footer">
                                <span className="ui-metric-footer-text">Updated just now</span>
                                <span className="ui-metric-footer-link">↗ View All</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Tabs Removed ── */}

            {/* ── BENTO GRID V2: Main Feed | Sidebar ── */}
            <div className="ui-bento-grid-v2">

                {/* LEFT: Interviews Feed — Big Panel */}
                <div className="">
                    <div className="bento-cell-header">
                        <div className="bento-cell-icon-wrap"><FiCalendar size={14} /></div>
                        <div className="d-flex flex-column gap-0">
                            <h3 className="fg-title m-0">
                                {selectedDate
                                    ? `Interviews: ${formatDateToDisplay(selectedDate)}`
                                    : feedTab === "scheduled" ? `Scheduled Feed` : `Completed Interviews`}
                            </h3>
                            <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>
                                {feedTab === "scheduled" ? filteredInterviews.length : completedInterviews.length} Sessions Found
                            </span>
                        </div>
                        {/* Feed Tab Switcher */}
                        <div className="interview-feed-tabs">
                            <button
                                className={`interview-feed-tab ${feedTab === 'scheduled' ? 'active' : ''}`}
                                onClick={() => setFeedTab('scheduled')}
                            >
                                <FiCalendar size={13} />
                                Scheduled
                                {filteredInterviews.length > 0 && (
                                    <span className="feed-tab-count">{filteredInterviews.length}</span>
                                )}
                            </button>
                            <button
                                className={`interview-feed-tab ${feedTab === 'completed' ? 'active' : ''}`}
                                onClick={() => setFeedTab('completed')}
                            >
                                <GiCheckMark size={12} />
                                Completed
                                {completedInterviews.length > 0 && (
                                    <span className="feed-tab-count completed">{completedInterviews.length}</span>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="interviews-stack hide-scrollbar">
                        {isLoading ? (
                            <div className="loading-state d-flex flex-column align-items-center justify-content-center p-5" style={{ minHeight: '300px' }}>
                                <div className="spinner-border mb-3" style={{ color: '#5b5bd6', width: '3rem', height: '3rem', borderWidth: '0.3em' }} role="status"></div>
                                <h5 style={{ color: '#1e293b', fontWeight: 800 }}>Loading Schedule...</h5>
                                <p style={{ color: '#64748b', fontWeight: 500, fontSize: '13px' }}>Synchronizing your upcoming interviews.</p>
                            </div>
                        ) : isError ? (
                            <div className="error-state p-5 text-center">
                                <p className="text-danger fw-bold">Unable to fetch interviews</p>
                            </div>
                        ) : (feedTab === 'scheduled' ? filteredInterviews : completedInterviews).length > 0 ? (
                            <div className="jobs-wrapper" style={{ padding: 0 }}>
                                <div className="jobs-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                                    {(feedTab === 'scheduled' ? filteredInterviews : completedInterviews).map((interview) => (
                                        <div
                                            key={interview.id}
                                            className="job-card justify-content-between ui-no-hover"
                                        >
                                            <div className="d-flex flex-column gap-3">
                                                {/* TOP */}
                                                <div className="job-card-header">
                                                    <div className="job-header-left">
                                                        <div className="job-company-logo" style={{ overflow: 'hidden' }}>
                                                            {interview.avatar ? (
                                                                <img src={interview.avatar} alt={interview.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                            ) : (
                                                                getInitials(interview.name)
                                                            )}
                                                        </div>
                                                        <div className="job-header-info">
                                                            <h3 className="job-title" title={interview.name}>{interview.name}</h3>
                                                            <p className="company-name">{interview.role}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* TAGS */}
                                                <div className="job-tags-row">
                                                    <span className={`job-chip ${interview.status.toLowerCase() === 'completed' ? 'green' : interview.status.toLowerCase() === 'cancelled' ? 'red' : 'purple'}`}>
                                                        {interview.status}
                                                    </span>
                                                    <span className="job-chip mint">
                                                        <FiClock size={12} style={{ marginRight: '4px' }} />
                                                        {interview.time}
                                                    </span>
                                                </div>

                                                {/* STATUS INPUT — scheduled tab only */}
                                                {feedTab === 'scheduled' && (
                                                    <div className="iv-notes-section" onClick={e => e.stopPropagation()}>
                                                        <div className="iv-notes-row" style={{ position: 'relative' }}>
                                                            <label className="iv-notes-label">Interview Status</label>
                                                            <div className="iv-status-popover-wrapper">
                                                                {interview.rawStatus?.toLowerCase() === 'completed' ? (
                                                                    <div className="iv-status-badge-btn iv-status-completed" style={{ cursor: 'default', background: '#f0fdf4', color: '#16a34a', borderColor: '#bbf7d0' }}>
                                                                        <span className="badge-dot completed" style={{ background: '#16a34a' }}></span> Completed
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        <button
                                                                            type="button"
                                                                            className={`iv-status-badge-btn iv-status-${(interview.rawStatus || 'Ongoing').toLowerCase()}`}
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setActiveStatusPopoverId(activeStatusPopoverId === interview.id ? null : interview.id);
                                                                            }}
                                                                        >
                                                                            <span className="badge-dot"></span>
                                                                            {interview.rawStatus || "Ongoing"}
                                                                            <span className="chevron-down-arrow" style={{ fontSize: '9px', marginLeft: '6px', opacity: 0.7 }}>▼</span>
                                                                        </button>
                                                                        {activeStatusPopoverId === interview.id && (
                                                                            <div className="iv-status-popover-menu">
                                                                                <button
                                                                                    type="button"
                                                                                    className="iv-status-popover-item"
                                                                                    onClick={() => {
                                                                                        setActiveStatusPopoverId(null);
                                                                                        handleUpdateStatus(interview.interviewId, 'Ongoing');
                                                                                    }}
                                                                                >
                                                                                    <span className="badge-dot ongoing"></span> Ongoing
                                                                                </button>
                                                                                <button
                                                                                    type="button"
                                                                                    className="iv-status-popover-item"
                                                                                    onClick={() => {
                                                                                        setActiveStatusPopoverId(null);
                                                                                        setConfirmModal({ isOpen: true, interviewId: interview.id, interviewIdVal: interview.interviewId, newStatus: 'Completed' });
                                                                                    }}
                                                                                >
                                                                                    <span className="badge-dot completed"></span> Completed
                                                                                </button>
                                                                            </div>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* COMPLETED TAB — show status read-only */}
                                                {/* {feedTab === 'completed' && (
                                                    <div className="iv-notes-section iv-notes-readonly" onClick={e => e.stopPropagation()}>
                                                        {interviewNotes[interview.id]?.interviewStatus ? (
                                                            <div className="iv-readonly-row" style={{ marginBottom: 0 }}>
                                                                <span className="iv-readonly-label">Status</span>
                                                                <span className={`iv-status-badge iv-status-${(interviewNotes[interview.id].interviewStatus || '').toLowerCase().replace(/\s+/g, '-')}`}>
                                                                    <FiCheckSquare size={11} style={{marginRight:4}}/>
                                                                    {interviewNotes[interview.id].interviewStatus}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <div className="iv-no-notes">
                                                                <FiCheckSquare size={13} />
                                                                <span>Status: Completed</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )} */}
                                            </div>

                                            <div>
                                                {/* FOOTER */}
                                                <div className="job-card-footer">
                                                    <div className="job-rate" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
                                                        <FiCalendar size={14} />
                                                        {interview.dateLabel}
                                                    </div>

                                                    <div className="meta-pill">
                                                        <FiMapPin size={12} />
                                                        <span title={interview.location} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100px' }}>
                                                            {interview.location ? interview.location.split(',')[0].trim() : "Remote"}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* ACTIONS */}
                                                {feedTab === 'scheduled' && (
                                                    <div className="job-desc-block" style={{ marginTop: '12px' }}>
                                                        <div className="d-flex gap-3" style={{ width: '100%' }}>
                                                            <button
                                                                type="button"
                                                                className="btn-v2-primary"
                                                                style={{ flex: 1, padding: '8px 16px', fontSize: '13px', borderRadius: '10px' }}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();

                                                                    if (
                                                                        !interview.meetingLink ||
                                                                        interview.meetingLink === "null"
                                                                    ) {
                                                                        toast.warning(
                                                                            "Meeting link is not available. Redirecting to Interview Details to share the meeting link."
                                                                        );

                                                                        handleViewDetail(interview);
                                                                        return;
                                                                    }

                                                                    window.open(
                                                                        interview.meetingLink,
                                                                        "_blank",
                                                                        "noopener,noreferrer"
                                                                    );
                                                                }}
                                                            >
                                                                Join Session
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn-secondary"
                                                                style={{ flex: 1, padding: '8px 16px', fontSize: '13px', borderRadius: '10px' }}
                                                                onClick={() => handleViewDetail(interview)}
                                                            >
                                                                View Details
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                {feedTab === 'completed' && (
                                                    <div className="job-desc-block" style={{ marginTop: '12px' }}>
                                                        <button
                                                            type="button"
                                                            className="btn-secondary"
                                                            style={{ width: '100%', padding: '8px 16px', fontSize: '13px', borderRadius: '10px' }}
                                                            onClick={() => handleViewDetail(interview)}
                                                        >
                                                            View Details
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="empty-feed-state">
                                <img
                                    src="/Images/no data.svg"
                                    alt="No data"
                                    style={{ width: "100%", maxWidth: "160px", opacity: "50%", marginBottom: "20px" }}
                                />
                                {feedTab === 'scheduled' ? (
                                    <>
                                        <h3>No Interviews Scheduled</h3>
                                        <p>Relax! You don't have any sessions booked for this criteria.</p>
                                        <button className="btn-v2-primary mt-3" onClick={() => {
                                            setPreSelectedJobId(null);
                                            setPreSelectedCandidateId(null);
                                            setIsDrawerOpen(true);
                                        }}>
                                            <FiPlus size={16} /> Schedule Now
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <h3>No Completed Interviews</h3>
                                        <p>Completed interviews will appear here once past sessions are recorded.</p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: Sidebar Column */}
                <div className="ui-settings-column">

                    {/* Card 1: Calendar Widget */}
                    <div className="si-bento-cell si-cell-calendar project-card">
                        <div className="bento-cell-header">
                            <div className="bento-cell-icon-wrap"><FiCalendar size={14} /></div>
                            <h3 className="fg-title m-0">Calendar</h3>
                        </div>
                        <div className="p-3">
                            <Calendar
                                navDate={navDate}
                                selectedDate={selectedDate}
                                onDateSelect={(date) => setSelectedDate(date)}
                                isInterviewDate={isInterviewDate}
                                onPrev={handlePrevMonth}
                                onNext={handleNextMonth}
                            />
                            {selectedDate && (
                                <button className="btn-clear-date-v2" onClick={() => setSelectedDate(null)}>
                                    Reset Selection
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Job Details Modal ── */}
            {showJobModal && nextInterview?.jobData && (
                <div className="custom-modal-overlay" onClick={() => setShowJobModal(false)}>
                    <div className="job-modal-content-v2" onClick={e => e.stopPropagation()}>
                        <div className="modal-header-premium">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div className="bento-cell-icon-wrap"><FiBriefcase size={14} /></div>
                                <h3 className="m-0" style={{ fontSize: '15px', fontWeight: 800 }}>Job Overview</h3>
                            </div>
                            <button className="close-btn-premium" onClick={() => setShowJobModal(false)}>
                                <FiX size={20} />
                            </button>
                        </div>
                        <div className="modal-body-premium p-0" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                            <JobOverviewCard
                                job={nextInterview.jobData}
                                isExpanded={true}
                                onToggle={() => { }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {showCalendarModal && (
                <div className="custom-modal-overlay" onClick={() => setShowCalendarModal(false)}>
                    <div className="calendar-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header-premium">
                            <h3 className="m-0">Select Interview Date</h3>
                            <button className="close-btn-premium" onClick={() => setShowCalendarModal(false)}>
                                <FiX size={20} />
                            </button>
                        </div>
                        <div className="modal-body-premium">
                            <Calendar
                                navDate={navDate}
                                selectedDate={selectedDate}
                                onDateSelect={(date) => {
                                    setSelectedDate(date);
                                    setShowCalendarModal(false);
                                }}
                                isInterviewDate={isInterviewDate}
                                onPrev={handlePrevMonth}
                                onNext={handleNextMonth}
                            />
                        </div>
                        <div className="modal-footer-premium">
                            <button
                                className="btn-secondary-premium"
                                onClick={() => {
                                    setSelectedDate(null);
                                    setShowCalendarModal(false);
                                }}
                            >
                                Clear Selection
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <ScheduleInterviewDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                onSuccess={() => { }}
                preSelectedJobId={preSelectedJobId}
                preSelectedCandidateId={preSelectedCandidateId}
            />

            {confirmModal.isOpen && (
                <div className="custom-modal-overlay" onClick={() => setConfirmModal({ isOpen: false, interviewId: null, interviewIdVal: null, newStatus: "" })}>
                    <div className="calendar-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px' }}>
                        <div className="modal-header-premium">
                            <h3 className="m-0">Confirm Status Change</h3>
                            <button className="close-btn-premium" onClick={() => setConfirmModal({ isOpen: false, interviewId: null, interviewIdVal: null, newStatus: "" })}>
                                <FiX size={18} />
                            </button>
                        </div>
                        <div className="modal-body-premium text-center py-4 px-3">
                            <div style={{
                                width: '56px',
                                height: '56px',
                                background: '#f0fdf4',
                                color: '#16a34a',
                                borderRadius: '50%',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid #bbf7d0',
                                marginBottom: '16px'
                            }}>
                                <FiCheckSquare size={24} />
                            </div>
                            <h5 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Mark as Completed?</h5>
                            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6', margin: 0 }}>
                                Are you sure you want to move the status to Completed? Once moved, the interview status is finalized and will be transferred to the completed list.
                            </p>
                        </div>
                        <div className="modal-footer-premium d-flex gap-2 justify-content-end align-items-center" style={{ gap: '10px' }}>
                            <button
                                className="btn-secondary-premium"
                                onClick={() => setConfirmModal({ isOpen: false, interviewId: null, interviewIdVal: null, newStatus: "" })}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-v2-primary"
                                style={{ padding: '8px 20px !important' }}
                                onClick={() => {
                                    handleUpdateStatus(confirmModal.interviewIdVal, confirmModal.newStatus);
                                    setConfirmModal({ isOpen: false, interviewId: null, interviewIdVal: null, newStatus: "" });
                                }}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function Calendar({ navDate, selectedDate, onDateSelect, isInterviewDate, onPrev, onNext }) {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

    const month = navDate.getMonth();
    const year = navDate.getFullYear();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = daysInMonth(month, year);

    const blanks = Array(firstDay).fill(null);
    const days = Array.from({ length: totalDays }, (_, i) => i + 1);

    return (
        <div className="custom-calendar">
            <div className="calendar-header">
                <h3>{monthNames[month]} {year}</h3>
                <div className="cal-nav">
                    <button
                        onClick={onPrev}
                        disabled={year === new Date().getFullYear() && month === new Date().getMonth()}
                        style={{ opacity: (year === new Date().getFullYear() && month === new Date().getMonth()) ? 0.3 : 1 }}
                    >
                        <FiChevronLeft />
                    </button>
                    <button onClick={onNext}><FiChevronRight /></button>
                </div>
            </div>
            <div className="calendar-weekdays">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="calendar-days">
                {blanks.map((_, i) => <div key={`b-${i}`} className="day blank"></div>)}
                {days.map(d => {
                    const todayDate = new Date();
                    todayDate.setHours(0, 0, 0, 0);
                    const currentIterDate = new Date(year, month, d);

                    const isToday = todayDate.toDateString() === currentIterDate.toDateString();
                    const isSelected = selectedDate && selectedDate.getDate() === d && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
                    const hasInterview = isInterviewDate(d, month, year);
                    const isPast = currentIterDate < todayDate;

                    return (
                        <div
                            key={d}
                            className={`day ${isSelected ? "selected" : ""} ${hasInterview ? "has-interview" : ""} ${isToday ? "today" : ""} ${isPast ? "past-date" : ""}`}
                            onClick={() => {
                                if (isPast) return;
                                const newDate = new Date(year, month, d);
                                if (selectedDate && selectedDate.toDateString() === newDate.toDateString()) {
                                    onDateSelect(null);
                                } else {
                                    onDateSelect(newDate);
                                }
                            }}
                        >
                            {d}
                        </div>
                    );
                })}
            </div>
            <div className="calendar-legend">
                <div className="legend-item">
                    <span className="dot interview-dot"></span>
                    <span>Interview Scheduled</span>
                </div>
            </div>
        </div>
    );
}
