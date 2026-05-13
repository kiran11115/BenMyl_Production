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
    FiX

} from "react-icons/fi";
import { GiCheckMark } from "react-icons/gi";
import "./UpcomingInterview.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSchedulesDetailsQuery, useSchedulesDetailsBenchsalesQuery } from "../../State-Management/Api/ScheduleInterviewApiSlice";
import { useGetGroupedJobTitlesQuery } from "../../State-Management/Api/TalentPoolApiSlice";
import { useGetRecruiterProfileQuery } from "../../State-Management/Api/RecruiterProfileApiSlice";
import ModuleHeader from "../Admin/Modules/ModuleHeader";
import { Home } from "lucide-react";
import JobOverviewCard from "../TalentPool/JobOverviewCard";
import { FiEye } from "react-icons/fi";



export default function UpcomingInterview() {
    const navigate = useNavigate();
    const [navDate, setNavDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedInterview, setSelectedInterview] = useState(null);
    const [view, setView] = useState("list"); // list | detail
    const [activeTab, setActiveTab] = useState("scheduled"); // scheduled | completed | cancelled | rescheduled
    const [meetingLinkInput, setMeetingLinkInput] = useState("");
    const [isJobExpanded, setIsJobExpanded] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showCalendarModal, setShowCalendarModal] = useState(false);
    const [showJobModal, setShowJobModal] = useState(false);

    const recruiterId = localStorage.getItem("CompanyId");
    const userRole = localStorage.getItem("Role");
    const isBenchsales = userRole === "Benchsales";

    const { data: apiInterviewsNormal = [], isLoading: isLoadingNormal, isError: isErrorNormal } = useSchedulesDetailsQuery(recruiterId, {
        skip: !recruiterId || isBenchsales,
        refetchOnMountOrArgChange: true
    });

    const { data: apiInterviewsBench = [], isLoading: isLoadingBench, isError: isErrorBench } = useSchedulesDetailsBenchsalesQuery(recruiterId, {
        skip: !recruiterId || !isBenchsales,
        refetchOnMountOrArgChange: true
    });

    const apiInterviews = isBenchsales ? apiInterviewsBench : apiInterviewsNormal;
    const isLoading = isBenchsales ? isLoadingBench : isLoadingNormal;
    const isError = isBenchsales ? isErrorBench : isErrorNormal;

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
                dateLabel: dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
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

    const nextInterview = useMemo(() => {
        const upcoming = interviews.filter(it => it.status === "scheduled");
        if (upcoming.length === 0) return null;
        return upcoming[0];
    }, [interviews]);

    const filteredInterviews = useMemo(() => {
        let list = interviews;

        // Filter by Tab
        list = list.filter(it => it.status === activeTab);

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
    }, [interviews, selectedDate, activeTab, searchQuery]);

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
            <ModuleHeader
                breadcrumb="Upcoming Interviews"
                title="Upcoming Interviews"
                description="Manage your scheduled interviews and meeting links"
                badgeText="Interview Management"
                icon={FiCalendar}
                customBreadcrumbs={[
                    { label: "Dashboard", path: isUser ? '/user/user-dashboard' : '/Admin/overview-dashboard', icon: <Home size={14} /> }
                ]}
                actions={userRole === 'Benchsales' ? [] : [
                    {
                        label: "Add New Interview",
                        icon: <FiPlus size={16} />,
                        type: "primary",
                        onClick: () => navigate(`${basePath}/user-schedule-interview`)
                    }
                ]}
            />

            {nextInterview && !selectedDate && !searchQuery && activeTab === "scheduled" && (
                <div className="hero-next-interview mb-4">
                    <div className="hero-content">
                        <div className="hero-label-row d-flex align-items-center gap-2">
                            <div className="hero-label">
                                <span className="live-dot"></span> Next Interview
                            </div>

                        </div>
                        <div className="hero-main">
                            <div className="hero-info">
                                <h2 className="hero-candidate-name">{nextInterview.name}</h2>
                                <p className="hero-candidate-role">{nextInterview.role} • {nextInterview.vendorName}</p>
                                <div className="hero-time-box d-flex gap-2">
                                    <FiCalendar className="icon" /> {nextInterview.dateLabel}
                                    <FiClock className="icon ms-3" /> {nextInterview.time}
                                </div>
                            </div>
                            <div className="hero-actions">
                                {nextInterview.meetingLink ? (
                                    <button
                                        onClick={() => window.open(nextInterview.meetingLink, "_blank", "noopener,noreferrer")}
                                        className="hero-join-btn"
                                    >
                                        Join Meeting
                                    </button>
                                ) : (
                                    <button className="hero-join-btn disabled" disabled>
                                        Link Pending
                                    </button>
                                )}
                                <button className="hero-details-btn" onClick={() => handleViewDetail(nextInterview)}>
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="hero-bg-accent"></div>
                </div>
            )}

            <div className="view-toggle1 mb-4">
                <button
                    className={`toggle ${activeTab === "scheduled" ? "active" : ""}`}
                    onClick={() => setActiveTab("scheduled")}
                >
                    Scheduled
                </button>
                <button
                    className={`toggle ${activeTab === "completed" ? "active" : ""}`}
                    onClick={() => setActiveTab("completed")}
                >
                    Interviews Done
                </button>
                <button
                    className={`toggle ${activeTab === "cancelled" ? "active" : ""}`}
                    onClick={() => setActiveTab("cancelled")}
                >
                    Cancelled
                </button>
                <button
                    className={`toggle ${activeTab === "rescheduled" ? "active" : ""}`}
                    onClick={() => setActiveTab("rescheduled")}
                >
                    Rescheduled
                </button>
            </div>

            {/* ── BENTO GRID V2: Main Feed | Sidebar ── */}
            <div className="ui-bento-grid-v2">

                {/* LEFT: Interviews Feed — Big Panel */}
                <div className="ui-bento-cell ui-cell-feed project-card">
                    <div className="bento-cell-header">
                        <div className="bento-cell-icon-wrap"><FiCalendar size={14} /></div>
                        <div className="d-flex flex-column gap-0">
                            <h3 className="fg-title m-0">
                                {selectedDate
                                    ? `Interviews: ${selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                                    : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Feed`}
                            </h3>
                            <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>
                                {filteredInterviews.length} Sessions Found
                            </span>
                        </div>
                    </div>

                    <div className="interviews-stack hide-scrollbar">
                        {isLoading ? (
                            <div className="loading-state p-5 text-center">
                                <div className="spinner-border text-primary mb-3" role="status"></div>
                                <p style={{ color: '#64748b', fontWeight: 600 }}>Synchronizing your schedule...</p>
                            </div>
                        ) : isError ? (
                            <div className="error-state p-5 text-center">
                                <p className="text-danger fw-bold">Unable to fetch interviews</p>
                            </div>
                        ) : filteredInterviews.length > 0 ? (
                            <div className="interviews-grid-v2">
                                {filteredInterviews.map((interview) => (
                                    <div key={interview.id} className="interview-card-v2">
                                        <div className="card-accent-bar"></div>
                                        <div className="card-header-row">
                                            <div className="status-pill-v2">
                                                <span className={`dot ${interview.status.toLowerCase()}`}></span>
                                                {interview.status}
                                            </div>
                                            <div className="time-badge">
                                                <FiClock size={12} /> {interview.time}
                                            </div>
                                        </div>

                                        <div className="card-profile-section">
                                            {interview.avatar ? (
                                                <img src={interview.avatar} alt={interview.name} className="avatar-initials-premium" />
                                            ) : (
                                                <div className="avatar-initials-premium">
                                                    {getInitials(interview.name)}
                                                </div>
                                            )}
                                            <div className="profile-details">
                                                <h4 className="candidate-name">{interview.name}</h4>
                                                <p className="candidate-role">{interview.role}</p>
                                            </div>
                                        </div>

                                        <div className="card-meta-grid">
                                            <div className="meta-pill">
                                                <FiCalendar size={12} /> <span>{interview.dateLabel}</span>
                                            </div>
                                            <div className="meta-pill">
                                                <FiMapPin size={12} /> <span>{interview.location}</span>
                                            </div>
                                        </div>

                                        <div className="card-actions-v2">
                                            <button className="btn-v2-outline" onClick={() => handleViewDetail(interview)}>
                                                Details
                                            </button>
                                            {interview.meetingLink ? (
                                                <button
                                                    className="btn-v2-primary"
                                                    onClick={() => window.open(interview.meetingLink, "_blank")}
                                                >
                                                    Join Session
                                                </button>
                                            ) : (
                                                <button className="btn-v2-disabled" disabled>Pending Link</button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-feed-state">
                                <div className="empty-icon-circle">
                                    <FiCalendar size={32} />
                                </div>
                                <h3>No Interviews Scheduled</h3>
                                <p>Relax! You don't have any sessions booked for this criteria.</p>
                                <button className="btn-v2-primary mt-3" onClick={() => navigate(`${basePath}/user-schedule-interview`)}>
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
