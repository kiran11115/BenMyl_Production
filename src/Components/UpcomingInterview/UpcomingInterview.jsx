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
    FiStar,
    FiX

} from "react-icons/fi";
import { GiCheckMark } from "react-icons/gi";
import "./UpcomingInterview.css";
import { useNavigate } from "react-router-dom";

const MOCK = [
    {
        id: 1,
        date: new Date(2026, 3, 15),
        dateLabel: "April 15, 2026",
        time: "10:00 AM",
        name: "Sarah Anderson",
        avatar: "",
        role: "Senior Frontend Developer",
        experience: "6+ Years",
        location: "Remote",
        rating: 4.8,
        verified: true,
        skills: ["React", "TypeScript", "Node.js"],
        status: "scheduled",
        vendorName: "Skyline Staffing",
        partnerContact: "Sarah Anderson",
        meetingLink: "https://meet.google.com/abc-defg-hij",
        jobData: {
            title: "Senior Frontend Developer",
            company: "TechFlow Systems",
            location: "Remote",
            budget: "120k - 150k",
            salaryType: "Yearly",
            experience: 6,
            type: "Full-time",
            description: "Building a highly scalable React dashboard with real-time data integration and complex visualization requirements. **Responsibilities:** \n - Lead frontend architecture \n - Optimize performance \n - Mentor junior developers",
            requiredSkills: ["React", "TypeScript", "Redux", "Node.js"]
        }
    },
    {
        id: 2,
        date: new Date(2026, 3, 15),
        dateLabel: "April 15, 2026",
        time: "2:30 PM",
        name: "David Wilson",
        avatar: "",
        role: "Product Manager",
        experience: "8+ Years",
        location: "On-site",
        rating: 4.5,
        verified: false,
        skills: ["Agile", "Scrum", "Product Roadmap"],
        status: "scheduled",
        vendorName: "Global Talent Corp",
        partnerContact: "David Wilson",
        meetingLink: "",
        jobData: {
            title: "Product Manager",
            company: "FinTech Hub",
            location: "New York, NY",
            budget: "140k - 180k",
            salaryType: "Yearly",
            experience: 8,
            type: "Full-time",
            description: "Streamlining cross-functional teams and managing product roadmaps for the next-generation fintech application.",
            requiredSkills: ["Product Strategy", "Agile", "Stakeholder Management"]
        }
    },
    {
        id: 3,
        date: new Date(2026, 3, 16),
        dateLabel: "April 16, 2026",
        time: "11:00 AM",
        name: "James Thompson",
        avatar: "",
        role: "UX Designer",
        experience: "4+ Years",
        location: "Hybrid",
        rating: 4.7,
        verified: true,
        skills: ["Figma", "Adobe XD", "User Research"],
        status: "scheduled",
        vendorName: "Creative Partners",
        partnerContact: "James Thompson",
        meetingLink: "https://zoom.us/j/123456789",
        jobData: {
            title: "UX Designer",
            company: "Creative Pulse",
            location: "Hybrid",
            budget: "90k - 110k",
            salaryType: "Yearly",
            experience: 4,
            type: "Contract",
            description: "Creating intuitive user journeys and high-fidelity prototypes for a multi-platform e-commerce solution.",
            requiredSkills: ["Figma", "UI Design", "Prototyping"]
        }
    },
    {
        id: 4,
        date: new Date(2026, 3, 20),
        dateLabel: "April 20, 2026",
        time: "09:00 AM",
        name: "Linda Garcia",
        avatar: "",
        role: "Backend Engineer",
        experience: "7+ Years",
        location: "Remote",
        rating: 4.6,
        verified: true,
        skills: ["Go", "Kubernetes", "PostgreSQL"],
        status: "scheduled",
        vendorName: "Cloud Ninjas",
        partnerContact: "Linda Garcia",
        meetingLink: "",
        jobData: {
            title: "Backend Engineer",
            company: "CloudCore",
            location: "Remote",
            budget: "130k - 160k",
            salaryType: "Yearly",
            experience: 7,
            type: "Full-time",
            description: "Designing robust microservices architecture and optimizing database performance for high-traffic APIs.",
            requiredSkills: ["Go", "Kubernetes", "PostgreSQL", "gRPC"]
        }
    },
    {
        id: 5,
        date: new Date(2026, 3, 10),
        dateLabel: "April 10, 2026",
        time: "03:00 PM",
        name: "Robert Miller",
        avatar: "",
        role: "DevOps Engineer",
        experience: "5+ Years",
        location: "Remote",
        rating: 4.4,
        verified: true,
        skills: ["Docker", "Jenkins", "AWS"],
        status: "completed",
        vendorName: "Skyline Staffing",
        partnerContact: "Robert Miller",
        meetingLink: "https://meet.google.com/xyz-pdq",
        jobData: {
            title: "DevOps Engineer",
            company: "ScaleGrid",
            location: "Remote",
            budget: "110k - 140k",
            salaryType: "Yearly",
            experience: 5,
            type: "Full-time",
            description: "Implementing CI/CD pipelines and managing cloud infrastructure.",
            requiredSkills: ["Docker", "Jenkins", "AWS"]
        }
    },
    {
        id: 6,
        date: new Date(2026, 3, 5),
        dateLabel: "April 5, 2026",
        time: "11:30 AM",
        name: "Kevin Smith",
        avatar: "",
        role: "Project Manager",
        experience: "10+ Years",
        location: "Hybrid",
        rating: 4.2,
        verified: true,
        skills: ["PMP", "Agile", "Budgeting"],
        status: "cancelled",
        vendorName: "Apex Talents",
        partnerContact: "Kevin Smith",
        meetingLink: "",
        jobData: {
            title: "Project Manager",
            company: "BuildIt",
            location: "Hybrid",
            budget: "150k - 180k",
            salaryType: "Yearly",
            experience: 10,
            type: "Full-time",
            description: "Managing large scale construction and tech projects.",
            requiredSkills: ["PMP", "Agile"]
        }
    },
    {
        id: 7,
        date: new Date(2026, 3, 22),
        dateLabel: "April 22, 2026",
        time: "11:00 AM",
        name: "Maria Rodriguez",
        avatar: "",
        role: "Data Scientist",
        experience: "5+ Years",
        location: "Remote",
        rating: 4.9,
        verified: true,
        skills: ["Python", "TensorFlow", "SQL"],
        status: "rescheduled",
        vendorName: "AI Specialists Inc.",
        partnerContact: "Maria Rodriguez",
        meetingLink: "https://meet.google.com/resched-link",
        jobData: {
            title: "Data Scientist",
            company: "AI Insights",
            location: "Remote",
            budget: "135k - 165k",
            salaryType: "Yearly",
            experience: 5,
            type: "Full-time",
            description: "Building machine learning models and data pipelines for consumer behavioral analysis.",
            requiredSkills: ["Python", "ML", "Statistics"]
        }
    }
];

export default function UpcomingInterview() {
    const navigate = useNavigate();
    const [navDate, setNavDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedInterview, setSelectedInterview] = useState(null);
    const [view, setView] = useState("list"); // list | detail
    const [activeTab, setActiveTab] = useState("scheduled"); // scheduled | completed | cancelled | rescheduled
    const [meetingLinkInput, setMeetingLinkInput] = useState("");
    const [isJobExpanded, setIsJobExpanded] = useState(true);

    const nextInterview = useMemo(() => {
        const upcoming = MOCK.filter(it => it.status === "scheduled");
        if (upcoming.length === 0) return null;
        // Simple sort by date/time (assuming mock data is roughly sorted)
        return upcoming[0];
    }, []);

    const filteredInterviews = useMemo(() => {
        let list = MOCK;

        // Filter by Tab
        list = list.filter(it => it.status === activeTab);

        // Filter by Calendar Date
        if (!selectedDate) return list;
        return list.filter(it =>
            it.date.getDate() === selectedDate.getDate() &&
            it.date.getMonth() === selectedDate.getMonth() &&
            it.date.getFullYear() === selectedDate.getFullYear()
        );
    }, [selectedDate, activeTab]);

    const handleViewDetail = (interview) => {
        navigate("/user/user-interview-details", { state: { interview } });
    };

    const handleShare = () => {
        if (!meetingLinkInput) {
            alert("Please provide a meeting link before sharing.");
            return;
        }
        alert(`Meeting link has been sent to ${selectedInterview.name}'s email successfully!`);
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
        return MOCK.some(it =>
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

    return (
        <div className="ui-page">
            <div className="profile-breadcrumb d-flex gap-1 mb-4">
                <button className="link-button" onClick={() => navigate("/user/user-dashboard")}>
                    <FiArrowLeft /> Back to Dashboard
                </button>
                <span className="crumb">/ Upcoming Interviews</span>
            </div>

            <div className="ui-header">
                <div>
                    <h1 className="ui-title">Upcoming Interviews</h1>
                    <p className="ui-sub">Manage your scheduled interviews and meeting links</p>
                </div>

                <div className="ui-actions">
                    <button className="btn-upload" onClick={() => navigate("/user/user-schedule-interview")}>
                        <FiPlus /> Add New Interview
                    </button>
                </div>
            </div>

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
                            {filteredInterviews.length > 0 ? (
                                filteredInterviews.map((it) => (
                                    <article className="project-card d-flex flex-column gap-3 small-card" key={it.id}>
                                        <div className="d-flex flex-column gap-2">
                                            {/* Header matching Talent Pool */}
                                            <div className="card-header position-relative">
                                                <div className="d-flex gap-2 align-items-center">
                                                    {it.avatar ? (
                                                        <img src={it.avatar} alt={it.name} className="avatar small-avatar" />
                                                    ) : (
                                                        <div className="initials-avatar small-avatar">
                                                            {getInitials(it.name)}
                                                        </div>
                                                    )}
                                                    <div className="header-info">
                                                        <div className="name-row">
                                                            <h4 className="name small-name">
                                                                {it.name} {it.verified && (<GiCheckMark size={12} color="#059669" />)}
                                                            </h4>
                                                        </div>
                                                        <div className="role">{it.role}</div>
                                                    </div>
                                                </div>
                                                {/* Rating in Right Corner */}
                                                <div className="rating small-rating corner-rating">
                                                    <FiStar size={10} fill="#f59e0b" color="#f59e0b" />
                                                    <span style={{ color: "#f59e0b" }}>{it.rating}</span>
                                                </div>
                                            </div>



                                            {/* Card Top Info (Time/Date) */}
                                            <div className="meta-grid small-meta">
                                                <div className="meta-item">
                                                    <FiCalendar size={12} /> <span>{it.dateLabel}</span>
                                                </div>
                                                <div className="meta-item">
                                                    <FiClock size={12} /> <span>{it.time}</span>
                                                </div>
                                                <div className="meta-item">
                                                    <FiBriefcase size={12} /> <span>{it.experience}</span>
                                                </div>
                                                <div className="meta-item">
                                                    <FiMapPin size={12} /> <span>{it.location}</span>
                                                </div>
                                            </div>

                                            {/* Meeting Link Status row */}
                                            <div className="badges-row">
                                                <div className={`link-status-badge small-badge w-[fit-content] d-flex align-items-center gap-2 ${it.meetingLink ? "yes" : "no"}`}>
                                                    Meeting Link: <span>{it.meetingLink ? "Provided" : "Not Provided"}</span>
                                                </div>
                                            </div>

                                            {/* Skills */}
                                            <div className="skills-row small-skills">
                                                {it.skills.slice(0, 2).map(skill => (
                                                    <span key={skill} className="status-tag status-progress">{skill}</span>
                                                ))}
                                                {it.skills.length > 2 && <span className="status-tag">+{it.skills.length - 2}</span>}
                                            </div>
                                        </div>

                                        <div className="card-actions-ui d-flex gap-2 pt-2 mt-auto">
                                            <button className="btn-primary flex-1 small-btn" onClick={() => handleViewDetail(it)}>
                                                Details
                                            </button>
                                            {it.meetingLink ? (
                                                <button
                                                    onClick={() => window.open(it.meetingLink, "_blank", "noopener,noreferrer")}
                                                    className="hero-join-btn flex-1 d-flex align-items-center justify-content-center"
                                                    style={{ padding: '8px', fontSize: '12px', borderRadius: '8px', boxShadow: 'none', border: 'none', cursor: 'pointer' }}
                                                >
                                                    Join Meeting
                                                </button>
                                            ) : (
                                                <button className="btn-secondary flex-1 small-btn disabled" disabled>
                                                    No Link
                                                </button>
                                            )}
                                        </div>
                                    </article>
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
