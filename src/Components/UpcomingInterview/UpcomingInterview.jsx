import React, { useState, useMemo } from "react";
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
    FiEyeOff

} from "react-icons/fi";
import { GiCheckMark } from "react-icons/gi";
import "./UpcomingInterview.css";
import "../UserJobs/Jobs.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSchedulesDetailsQuery, useSchedulesDetailsBenchsalesQuery } from "../../State-Management/Api/ScheduleInterviewApiSlice";
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
    const [navDate, setNavDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedInterview, setSelectedInterview] = useState(null);
    const [view, setView] = useState("list"); // list | detail
    const [meetingLinkInput, setMeetingLinkInput] = useState("");
    const [isJobExpanded, setIsJobExpanded] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showCalendarModal, setShowCalendarModal] = useState(false);
    const [showJobModal, setShowJobModal] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isNextInterviewHidden, setIsNextInterviewHidden] = useState(false);

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
            const dateParts = item.interviewDate.split('T')[0].split('-');
            const dateObj = dateParts.length === 3
                ? new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]))
                : new Date(item.interviewDate);

            // Derive status if not present (simple logic: past = completed, future = scheduled)
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            let derivedStatus = "scheduled";
            if (dateObj < today) {
                derivedStatus = "completed";
            }

            // Find matching job for description enrichment
            const matchingJob = fetchedJobs?.find(j => j.jobTitle === item.jobTitle);
            const enrichedDescription = item.jobDescription || matchingJob?.jobDescription || "";

            return {
                id: item.candidateID || index,
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
                status: item.status?.toLowerCase() || derivedStatus,
                vendorName: item.companyName,
                partnerContact: item.candidateName,
                meetingLink: item.interviewLink,
                recruiterID: item.recruiterID || item.recruiterId || null,
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
            <div className="hero-card mb-4">
                <div className="hero-left">
                    <div className="hero-pill">
                        ✦ Interview Management
                    </div>
                    <h1 className="text-white">
                        Upcoming Interviews
                    </h1>
                    <p className="hero-subtitle">
                        Manage your scheduled interviews, track candidate availability, and monitor upcoming meetings.
                    </p>
                </div>

                {userRole !== 'Benchsales' && (
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <button
                            onClick={() => setIsNextInterviewHidden(!isNextInterviewHidden)}
                            className="routine-btn"
                            style={{ height: '48px', padding: '0 20px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', backdropFilter: 'blur(10px)' }}
                        >
                            {isNextInterviewHidden ? <FiEye size={16} /> : <FiEyeOff size={16} />}
                            <span>{isNextInterviewHidden ? "Show Interviews" : "Hide Interviews"}</span>
                        </button>
                        <button
                            onClick={() => setIsDrawerOpen(true)}
                            className="routine-btn"
                            style={{ height: '48px', padding: '0 20px', borderRadius: '12px', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', backdropFilter: 'blur(10px)' }}
                        >
                            <FiPlus size={16} />
                            <span>Add New Interview</span>
                        </button>
                    </div>
                )}
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
                                    <h2 className="hero-candidate-name" style={{ fontSize: '16px', marginBottom: '4px',color: "white", textTransform:"uppercase", lineHeight:"10px" }}>{nextInterview.name}</h2>
                                    <p className="hero-candidate-role" style={{ fontSize: '11px', marginBottom: '8px' }}>{nextInterview.role} • {nextInterview.vendorName}</p>
                                    <div className="hero-time-box d-flex gap-2" style={{ fontSize: '12px', padding: '6px 12px', marginTop:"15px" }}>
                                        <FiCalendar className="icon" /> {nextInterview.dateLabel}
                                        <FiClock className="icon ms-2" /> {nextInterview.time}
                                    </div>
                                </div>
                                <div className="hero-actions" style={{ flexDirection: 'column', gap: '8px', minWidth: '130px', marginLeft: '16px' }}>
                                    {nextInterview.meetingLink ? (
                                        <button
                                            onClick={() => window.open(nextInterview.meetingLink, "_blank", "noopener,noreferrer")}
                                            className="routine-btn"
                                            style={{ padding: '8px 12px', fontSize: '12px', display:"block" }}
                                        >
                                            Join Meeting
                                        </button>
                                    ) : (
                                        <button className="hero-join-btn disabled" disabled style={{ padding: '8px 12px', fontSize: '12px' }}>
                                            Link Pending
                                        </button>
                                    )}
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
                                    : `Scheduled Feed`}
                            </h3>
                            <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>
                                {filteredInterviews.length} Sessions Found
                            </span>
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
                        ) : filteredInterviews.length > 0 ? (
                            <div className="jobs-wrapper" style={{ padding: 0 }}>
                                <div className="jobs-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                                    {filteredInterviews.map((interview) => (
                                        <div 
                                            key={interview.id} 
                                            className="job-card justify-content-between ui-no-hover"
                                            onClick={() => handleViewDetail(interview)}
                                            style={{ cursor: "pointer" }}
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
                                                    <div className="job-eye-icon">
                                                        <FiEye size={22} />
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

                                                {/* ACTIONS */}
                                                <div className="job-desc-block">
                                                    <div className="d-flex gap-2">
                                                        {interview.meetingLink ? (
                                                            <button
                                                                className="job-view-more-btn flex-grow-1"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    window.open(interview.meetingLink, "_blank");
                                                                }}
                                                            >
                                                                Join Session
                                                            </button>
                                                        ) : (
                                                            <button className="job-view-more-btn disabled flex-grow-1" disabled style={{ opacity: 0.6 }}>
                                                                Pending Link
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
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
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="empty-feed-state">
                                <div className="empty-icon-circle">
                                    <FiCalendar size={32} />
                                </div>
                                <h3>No Interviews Scheduled</h3>
                                <p>Relax! You don't have any sessions booked for this criteria.</p>
                                <button className="btn-v2-primary mt-3"  onClick={() => setIsDrawerOpen(true)}>
                                    <FiPlus size={16} /> Schedule Now
                                </button>
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
                onSuccess={() => {}}
            />
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
