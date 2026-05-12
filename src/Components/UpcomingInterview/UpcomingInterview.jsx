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
import { useSchedulesDetailsQuery } from "../../State-Management/Api/ScheduleInterviewApiSlice";
import ModuleHeader from "../Admin/Modules/ModuleHeader";
import { Home } from "lucide-react";



export default function UpcomingInterview() {
    const navigate = useNavigate();
    const [navDate, setNavDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedInterview, setSelectedInterview] = useState(null);
    const [view, setView] = useState("list"); // list | detail
    const [activeTab, setActiveTab] = useState("scheduled"); // scheduled | completed | cancelled | rescheduled
    const [meetingLinkInput, setMeetingLinkInput] = useState("");
    const [isJobExpanded, setIsJobExpanded] = useState(true);

    const recruiterId = localStorage.getItem("CompanyId");
    const { data: apiInterviews = [], isLoading, isError } = useSchedulesDetailsQuery(recruiterId, {
        skip: !recruiterId
    });

    const interviews = useMemo(() => {
        if (!Array.isArray(apiInterviews)) return [];
        return apiInterviews.map((item, index) => {
            // Ensure date is parsed correctly regardless of timezone shifts
            // If interviewDate is "YYYY-MM-DD", new Date(YYYY, MM-1, DD) is safer
            const dateParts = item.interviewDate.split('T')[0].split('-');
            const dateObj = dateParts.length === 3 
                ? new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]))
                : new Date(item.interviewDate);
            
            return {
                id: item.candidateID || index,
                date: dateObj,
                dateLabel: dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                time: item.interviewTime,
                name: item.candidateName,
                avatar: item.profilePicture || "",
                role: item.title,
                experience: `${item.experienceYears} Years`,
                location: item.interviewLocation || "Remote",
                rating: 4.5,
                verified: true,
                skills: item.skills ? item.skills.split(",").map(s => s.trim()) : [],
                status: "scheduled", // Default to scheduled for this view
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
                    description: "",
                    requiredSkills: item.skills ? item.skills.split(",").map(s => s.trim()) : []
                }
            };
        });
    }, [apiInterviews]);

    const nextInterview = useMemo(() => {
        const upcoming = interviews.filter(it => it.status === "scheduled");
        if (upcoming.length === 0) return null;
        return upcoming[0];
    }, [interviews]);

    const filteredInterviews = useMemo(() => {
        let list = interviews;

        // Filter by Tab
        list = list.filter(it => it.status === activeTab);

        // Filter by Calendar Date
        if (!selectedDate) return list;
        return list.filter(it =>
            it.date.getDate() === selectedDate.getDate() &&
            it.date.getMonth() === selectedDate.getMonth() &&
            it.date.getFullYear() === selectedDate.getFullYear()
        );
    }, [interviews, selectedDate, activeTab]);

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
            it.status === activeTab &&
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
                actions={[
                    {
                        label: "Add New Interview",
                        icon: <FiPlus size={16} />,
                        type: "primary",
                        onClick: () => navigate(`${basePath}/user-schedule-interview`)
                    }
                ]}
            />

            {nextInterview && !selectedDate && (
                <div className="hero-next-interview mb-4">
                    <div className="hero-content">
                        <div className="hero-label">
                            <span className="live-dot"></span> Next Interview
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

            <div className="ui-main-content">
                <div className="interviews-column">
                    <div className="column-header">
                        <h2 className="section-title">
                            {selectedDate
                                ? `Interviews for ${selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                                : `All ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Interviews`}
                        </h2>
                        {selectedDate && (
                            <button className="clear-filter" onClick={() => setSelectedDate(null)}>Show All</button>
                        )}
                    </div>
                    <div className="interviews-stack hide-scrollbar">
                        <div className="interviews-list">
                            {isLoading ? (
                                <div className="loading-state p-4 text-center">
                                    <div className="spinner-border text-primary mb-2" role="status"></div>
                                    <p style={{ color: '#64748b' }}>Loading interviews...</p>
                                </div>
                            ) : isError ? (
                                <div className="error-state p-4 text-center">
                                    <p className="text-danger">Failed to load interviews. Please try again later.</p>
                                </div>
                            ) : filteredInterviews.length > 0 ? (
                                filteredInterviews.map((interview) => (
                                    <div key={interview.id} className="interview-card-premium">
                                        <div className="card-top">
                                            <div className="interview-status-badge">
                                                <div className={`status-dot ${interview.status.toLowerCase()}`}></div>
                                                {interview.status}
                                            </div>
                                        </div>

                                        <div className="card-profile">
                                            {interview.avatar ? (
                                                <img src={interview.avatar} alt={interview.name} className="avatar-premium" />
                                            ) : (
                                                <div className="avatar-initials-premium">
                                                    {getInitials(interview.name)}
                                                </div>
                                            )}
                                            <div className="profile-info">
                                                <h3 className="name">{interview.name}</h3>
                                                <p className="role">{interview.role}</p>
                                            </div>
                                        </div>

                                        <div className="card-meta">
                                            <div className="meta-row">
                                                <FiCalendar size={14} />
                                                <span>{interview.dateLabel}</span>
                                            </div>
                                            <div className="meta-row">
                                                <FiClock size={14} />
                                                <span>{interview.time}</span>
                                            </div>
                                            <div className="meta-row">
                                                <FiMapPin size={14} />
                                                <span>{interview.location}</span>
                                            </div>
                                        </div>

                                        <div className="card-actions-premium">
                                            <button 
                                                className="btn-details-outline"
                                                onClick={() => handleViewDetail(interview)}
                                            >
                                                Details
                                            </button>
                                            {interview.meetingLink ? (
                                                <a 
                                                    href={interview.meetingLink} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="btn-join-primary"
                                                >
                                                    Join
                                                </a>
                                            ) : (
                                                <button className="btn-join-primary disabled" disabled>
                                                    Pending
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-interviews">No interviews scheduled for this date.</div>
                            )}
                        </div>
                    </div>

                </div>

                <aside className="calendar-column">
                    <div className="calendar-container">
                        <Calendar
                            navDate={navDate}
                            selectedDate={selectedDate}
                            onDateSelect={setSelectedDate}
                            isInterviewDate={isInterviewDate}
                            onPrev={handlePrevMonth}
                            onNext={handleNextMonth}
                        />
                    </div>
                </aside>
            </div>
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
                    <button onClick={onPrev}><FiChevronLeft /></button>
                    <button onClick={onNext}><FiChevronRight /></button>
                </div>
            </div>
            <div className="calendar-weekdays">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="calendar-days">
                {blanks.map((_, i) => <div key={`b-${i}`} className="day blank"></div>)}
                {days.map(d => {
                    const isToday = new Date().toDateString() === new Date(year, month, d).toDateString();
                    const isSelected = selectedDate && selectedDate.getDate() === d && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
                    const hasInterview = isInterviewDate(d, month, year);

                    return (
                        <div
                            key={d}
                            className={`day ${isSelected ? "selected" : ""} ${hasInterview ? "has-interview" : ""} ${isToday ? "today" : ""}`}
                            onClick={() => onDateSelect(new Date(year, month, d))}
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
