import React, { useState, useMemo, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
    FiMapPin, FiArrowLeft, FiCheckSquare, FiSquare, FiCalendar,
    FiClock, FiStar, FiCheckCircle, FiEye, FiX, FiBriefcase,
    FiChevronLeft, FiChevronRight, FiList
} from 'react-icons/fi';
import { GiCheckMark } from "react-icons/gi";
import { Home, Plus } from "lucide-react";
import ModuleHeader from "../Admin/Modules/ModuleHeader";
import { useGetRecruiterProfileQuery } from "../../State-Management/Api/RecruiterProfileApiSlice";
import { useGetGroupedJobTitlesQuery, useTalentPoolMutation } from "../../State-Management/Api/TalentPoolApiSlice";
import JobOverviewCard from "../TalentPool/JobOverviewCard";
import { calculateTotalExperience } from "../../Utils/experienceUtils";
import './ScheduleInterview.css';
import '../UpcomingInterview/UpcomingInterview.css';
import { useScheduleInterviewMutation } from '../../State-Management/Api/ScheduleInterviewApiSlice';

// Removed mock candidates

const getNDaysFromDate = (baseDate, n) => {
    const dates = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < n; i++) {
        const d = new Date(baseDate);
        d.setDate(d.getDate() + i);
        d.setHours(0, 0, 0, 0);
        if (d >= today) dates.push(d);
    }
    return dates;
};

const ScheduleInterview = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const preSelectedJobId = location.state?.preSelectedJobId;
    const [scheduleInterview] = useScheduleInterviewMutation();

    // --- User Info ---
    const userName = localStorage.getItem("UserName") || "Current User";
    const userRole = localStorage.getItem("Role") || "Recruiter";
    const userId = localStorage.getItem("CompanyId");

    const { data: apiData } = useGetRecruiterProfileQuery(Number(userId), { skip: !userId });
    const profilePhoto = apiData?.profilePhoto;

    // --- API Jobs ---
    const { data: fetchedJobs, isLoading: isJobsLoading } = useGetGroupedJobTitlesQuery(userId, { skip: !userId });

    // Map fetched jobs to the format expected by the component
    const jobs = useMemo(() => {
        if (!fetchedJobs || !Array.isArray(fetchedJobs)) return [];
        return fetchedJobs.map(job => ({
            id: job.jobID,
            title: job.jobTitle,
            company: job.companyName || "Your Company",
            location: job.location || "On-site",
            budget: job.salaryRange_Min || "N/A",
            salaryType: job.salarType || "/hr",
            experience: job.yearsOfExperience || "0",
            type: job.employeeType || "Full-time",
            description: job.jobDescription || "No description available.",
            requiredSkills: job.requiredSkills ? job.requiredSkills.split(',').map(s => s.trim()) : ["General"]
        }));
    }, [fetchedJobs]);

    const [selectedJob, setSelectedJob] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [isCandidatesLoading, setIsCandidatesLoading] = useState(false);

    const [getFindTalent] = useTalentPoolMutation();
    const companyId = localStorage.getItem("logincompanyid");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewDate, setViewDate] = useState(new Date());

    // Time Logic
    const [timeSlotId, setTimeSlotId] = useState('09:00');
    const [startTime, setStartTime] = useState({ hr: '09', min: '00', ampm: 'AM' });
    const [endTime, setEndTime] = useState({ hr: '10', min: '00', ampm: 'AM' });
    const [isRangeMode, setIsRangeMode] = useState(false);

    const [sendReminder, setSendReminder] = useState(true);
    const [status, setStatus] = useState('idle');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showJobModal, setShowJobModal] = useState(false);
    const [timeMode, setTimeMode] = useState('quick'); // 'quick' or 'custom'
    const [showDateTimeModal, setShowDateTimeModal] = useState(false);
    const [candidatesView, setCandidatesView] = useState("table"); // "table" | "grid"

    // Initial state setup for jobs
    useEffect(() => {
        if (jobs.length > 0 && !selectedJob) {
            if (preSelectedJobId) {
                const job = jobs.find(j => String(j.id) === String(preSelectedJobId));
                if (job) setSelectedJob(job);
                else setSelectedJob(jobs[0]);
            } else {
                setSelectedJob(jobs[0]);
            }
        }
    }, [jobs, selectedJob, preSelectedJobId]);

    // Fetch Candidates when Job changes
    useEffect(() => {
        if (!selectedJob || !companyId) return;

        const fetchShortlisted = async () => {
            setIsCandidatesLoading(true);
            try {
                const payload = {
                    companyid: Number(companyId),
                    pageNumber: 1,
                    pageSize: 100, // Reasonable limit for shortlisted
                    filters: [
                        {
                            filterName: "Title",
                            filterOperator: "Equals",
                            filterValue: [selectedJob.title],
                        }
                    ],
                };

                const res = await getFindTalent(payload).unwrap();

                if (Array.isArray(res)) {
                    // Filter for isshortlisted
                    const shortlisted = res.filter(item => item.isshortlisted && !item.isSchedules).map(item => ({
                        id: item.employeeID,
                        name: `${item.firstName} ${item.lastName}`,
                        role: item.title || "-",
                        experience: `${calculateTotalExperience(item.workexperiences) || 0}`,
                        email: item.emailAddress,
                        city: item.city || "-",
                        phone: item.phoneNumber || "-",
                        avatar: item.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.firstName)}`,
                        skills: item.skills ? item.skills.split(",").map(s => s.trim()) : [],
                        rating: 4.5,
                        verified: true,
                        availability: item.status ? [item.status] : ["Available"]
                    }));

                    setCandidates(shortlisted);
                    if (shortlisted.length > 0) {
                        setSelectedCandidate(shortlisted[0]);
                    } else {
                        setSelectedCandidate(null);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch shortlisted candidates:", err);
            } finally {
                setIsCandidatesLoading(false);
            }
        };

        fetchShortlisted();
    }, [selectedJob, companyId, getFindTalent]);

    useEffect(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (viewDate < today) setViewDate(today);
    }, [viewDate]);

    const upcomingDates = useMemo(() => getNDaysFromDate(viewDate, 28), [viewDate]);

    const handlePickerChange = (date) => {
        setSelectedDate(date);
        setViewDate(date);
    };

    const timeSlots = [
        { id: '09:00', time: '9:00 AM', hr: '09', min: '00', ampm: 'AM' },
        { id: '10:00', time: '10:00 AM', hr: '10', min: '00', ampm: 'AM' },
        { id: '11:00', time: '11:00 AM', hr: '11', min: '00', ampm: 'AM' },
        { id: '12:00', time: '12:00 PM', hr: '12', min: '00', ampm: 'PM' },
        { id: '14:00', time: '2:00 PM', hr: '02', min: '00', ampm: 'PM' },
        { id: '15:00', time: '3:00 PM', hr: '03', min: '00', ampm: 'PM' },
        { id: '16:00', time: '4:00 PM', hr: '04', min: '00', ampm: 'PM' },
        { id: '17:00', time: '5:00 PM', hr: '05', min: '00', ampm: 'PM' }
    ];

    const hoursOptions = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    const minutesOptions = ['00', '15', '30', '45'];

    const getInitials = (name = "") => {
        return name.trim().split(" ").slice(0, 2).map(word => word[0]?.toUpperCase()).join("");
    };

    const handleJobSelect = (jobId) => {
        const job = jobs.find(j => j.id === Number(jobId));
        if (job) setSelectedJob(job);
    };

    const handleQuickSlotClick = (slot) => {
        setTimeSlotId(slot.id);
        setIsRangeMode(false);
        setStartTime({ hr: slot.hr, min: slot.min, ampm: slot.ampm });
        // Default 1hr end time
        let endHr = (parseInt(slot.hr) + 1).toString().padStart(2, '0');
        let endAmpm = slot.ampm;
        if (slot.hr === '11') endAmpm = slot.ampm === 'AM' ? 'PM' : 'AM';
        if (slot.hr === '12') endHr = '01';
        setEndTime({ hr: endHr, min: slot.min, ampm: endAmpm });
    };

    const handleMonthChange = (direction) => {
        const newDate = new Date(viewDate);
        newDate.setMonth(newDate.getMonth() + direction);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (newDate < today) setViewDate(today);
        else setViewDate(newDate);
    };

    const isSameDay = (d1, d2) => d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();

    const formattedRange = `${startTime.hr}:${startTime.min} ${startTime.ampm} ${isRangeMode ? `to ${endTime.hr}:${endTime.min} ${endTime.ampm}` : ''}`;

    const handleConfirm = async () => {
        if (!selectedCandidate || !selectedJob) {
            toast.error("Please select candidate and job");
            return;
        }

        setStatus("loading");

        try {
            // Format date
            const interviewDate = selectedDate.toLocaleDateString('en-CA');

            // Format time (example: "09:00 AM to 10:00 AM")
            const interviewTime = formattedRange;

            const formData = new FormData();

            formData.append("InterviewId", 0);
            formData.append("RecruiterID", Number(userId));
            formData.append("RecruiterName", userName);
            formData.append("CompanyName", selectedJob.company);
            formData.append("JobTitle", selectedJob.title);
            formData.append("CandidateName", selectedCandidate.name);
            formData.append("InterviewDate", interviewDate);
            formData.append("InterviewTime", interviewTime);
            formData.append("InterviewMode", "Online");
            formData.append("InterviewLocation", selectedJob.location);
            formData.append("InterviewerName", userName);
            formData.append("InterviewLink", "Google.com");
            formData.append("CandidateID", selectedCandidate.id);
            formData.append("CandidateEmailid", selectedCandidate.email);
            formData.append("Salary", selectedJob.budget);
            formData.append("SalaryType", selectedJob.salaryType);
            formData.append("CandidtateRecruiterid", 0);

            await scheduleInterview(formData).unwrap();

            setStatus("idle");
            setShowSuccessModal(true);

        } catch (error) {
            console.error("Interview scheduling failed:", error);
            setStatus("idle");
            toast.error("Failed to schedule interview");
        }
    };

    if (isJobsLoading) {
        return <div className="jobs-container d-flex align-items-center justify-content-center">Loading Jobs...</div>;
    }

    const isUserMode = !window.location.pathname.toLowerCase().startsWith('/admin');
    const dashboardPath = isUserMode ? '/user/user-dashboard' : '/Admin/overview-dashboard';
    const interviewsPath = isUserMode ? '/user/user-upcoming-interview' : '/Admin/admin-upcoming-interview';

    return (
        <div className="ui-page">
            <ModuleHeader
                breadcrumb="Schedule Interview"
                title="Schedule Interview"
                description="Manage and finalize candidate interviews efficiently"
                badgeText="Interview Setup"
                icon={FiCalendar}
                customBreadcrumbs={[
                    { label: "Dashboard", path: dashboardPath, icon: <Home size={14} /> },
                    { label: "Upcoming Interviews", path: interviewsPath }
                ]}
                actions={jobs.length > 0 ? [
                    {
                        customElement: (
                            <div className="d-flex align-items-center gap-3">
                                <div className="search-input-container m-0" style={{ maxWidth: '300px' }}>
                                    <select
                                        className="sort-select"
                                        value={selectedJob?.id || ""}
                                        onChange={(e) => handleJobSelect(e.target.value)}
                                        style={{ height: '42px' }}
                                    >
                                        {jobs.map(j => (
                                            <option key={j.id} value={j.id}>{j.title}</option>
                                        ))}
                                    </select>
                                </div>
                                {selectedJob && (
                                    <div
                                        className="job-details-tag-v2"
                                        onClick={() => setShowJobModal(true)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <FiBriefcase size={12} /> View Job Details
                                    </div>
                                )}
                            </div>
                        )
                    }
                ] : [
                    {
                        label: "Create Job",
                        icon: <Plus size={16} />,
                        type: "primary",
                        onClick: () => {
                            const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
                            navigate(`${basePath}/user-post-new-positions`);
                        }
                    }
                ]}
            />

            {/* ── BENTO GRID V2: Big Candidates | Settings Column ── */}
            <div className="si-bento-grid-v2">

                {/* LEFT: Shortlisted Profiles - Big Panel */}
                <div className="si-bento-cell si-cell-candidates project-card">
                    <div className="bento-cell-header d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-2">
                            <div className="bento-cell-icon-wrap"><FiBriefcase size={14} /></div>
                            <h3 className="fg-title m-0">Shortlisted Profiles</h3>
                            <span className="bento-count-badge">{candidates.length}</span>
                        </div>
                        <div className="view-toggle-v2">
                            <button
                                className={`vt-btn ${candidatesView === "table" ? "active" : ""}`}
                                onClick={() => setCandidatesView("table")}
                                title="Table View"
                            >
                                <FiList size={16} />
                            </button>
                            <button
                                className={`vt-btn ${candidatesView === "grid" ? "active" : ""}`}
                                onClick={() => setCandidatesView("grid")}
                                title="Grid View"
                            >
                                <FiSquare size={16} />
                            </button>
                        </div>
                    </div>
                    <div className="profiles-stack hide-scrollbar p-2">
                        {isCandidatesLoading ? (
                            <div className="d-flex justify-content-center p-4">Loading...</div>
                        ) : candidates.length === 0 ? (
                            <div className="empty-candidates-msg p-4 text-center">
                                <p>No shortlisted profiles found.</p>
                                {jobs.length > 0 && (
                                    <button
                                        className="btn-v2-primary mt-3"
                                        onClick={() => {
                                            const isUser = !window.location.pathname.toLowerCase().startsWith('/admin');
                                            navigate(isUser ? '/user/user-talent-pool' : '/Admin/talent-pool');
                                        }}
                                    >
                                        Browse Talent Pool
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="candidates-view-container">
                                {candidatesView === "table" ? (
                                    <div className="candidates-table-wrapper hide-scrollbar">
                                        <table className="custom-table">
                                            <thead>
                                                <tr>
                                                    <th>Candidate</th>
                                                    <th>Skills</th>
                                                    <th>Experience</th>
                                                    <th>Location</th>
                                                    <th className="text-center">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {candidates.map((candidate) => (
                                                    <tr
                                                        key={candidate.id}
                                                        className={selectedCandidate?.id === candidate.id ? "selected-row" : ""}
                                                        onClick={() => setSelectedCandidate(candidate)}
                                                    >
                                                        <td>
                                                            <div className="table-profile-cell">
                                                                <div className="avatar-initials-premium sm">
                                                                    {candidate.avatar ? (
                                                                        <img src={candidate.avatar} alt={candidate.name} />
                                                                    ) : (
                                                                        getInitials(candidate.name)
                                                                    )}
                                                                </div>
                                                                <span className="candidate-name-sm">{candidate.name}</span>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="table-skills-cell">
                                                                {(candidate.skills || []).slice(0, 2).map((skill, i) => (
                                                                    <span key={i} className="skill-tag-sm">{skill}</span>
                                                                ))}
                                                                {(candidate.skills || []).length > 2 && (
                                                                    <span className="skill-count-sm">+{candidate.skills.length - 2}</span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td><span className="exp-text-sm">{candidate.experience}</span></td>
                                                        <td>
                                                            <div className="loc-cell-sm">
                                                                <FiMapPin size={12} /> {candidate.city}
                                                            </div>
                                                        </td>
                                                        <td className="text-center">
                                                            <div className={`check-circle-premium sm ${selectedCandidate?.id === candidate.id ? "active" : ""}`}>
                                                                {selectedCandidate?.id === candidate.id && <GiCheckMark size={8} />}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="candidates-grid-v2">
                                        {candidates.map((candidate) => (
                                            <div
                                                key={candidate.id}
                                                className={`interview-card-v2 selection-card ${selectedCandidate?.id === candidate.id ? 'active-selection' : ''}`}
                                                onClick={() => setSelectedCandidate(candidate)}
                                            >
                                                <div className="card-accent-bar"></div>
                                                <div className="card-header-row">
                                                    <div className="status-pill-v2">
                                                        <span className="dot" style={{ background: '#10b981' }}></span>
                                                        Shortlisted
                                                    </div>
                                                    <div className="selection-indicator">
                                                        {selectedCandidate?.id === candidate.id ? (
                                                            <div className="check-circle-premium active"><GiCheckMark size={10} /></div>
                                                        ) : (
                                                            <div className="check-circle-premium"></div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="card-profile-section">
                                                    {candidate.avatar ? (
                                                        <img src={candidate.avatar} alt={candidate.name} className="avatar-initials-premium" />
                                                    ) : (
                                                        <div className="avatar-initials-premium">
                                                            {getInitials(candidate.name)}
                                                        </div>
                                                    )}
                                                    <div className="profile-details">
                                                        <h4 className="candidate-name">{candidate.name}</h4>
                                                        <p className="candidate-role">{candidate.role} • {candidate.experience}</p>
                                                    </div>
                                                </div>

                                                <div className="card-meta-grid">
                                                    <div className="meta-pill">
                                                        <FiMapPin size={12} /> <span>{candidate.city}</span>
                                                    </div>
                                                    <div className="meta-pill">
                                                        <FiStar size={12} /> <span>{candidate.rating} Rating</span>
                                                    </div>
                                                </div>

                                                <div className="card-skills-row mt-2" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                                    {(candidate.skills || []).slice(0, 3).map((skill, i) => (
                                                        <span key={i} className="status-tag">{skill}</span>
                                                    ))}
                                                    {candidate.skills.length > 3 && <span className="status-tag count">+{candidate.skills.length - 3}</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: Settings Column */}
                <div className="si-settings-column">

                    {/* Card 1: Date + Time trigger */}
                    <div className="si-bento-cell si-cell-datetime project-card">
                        <div className="bento-cell-header">
                            <div className="bento-cell-icon-wrap"><FiCalendar size={14} /></div>
                            <h3 className="fg-title m-0">Date &amp; Time</h3>
                        </div>
                        <div className="datetime-trigger-body">
                            <button
                                className={`datetime-summary-btn ${selectedDate ? 'has-value' : ''}`}
                                onClick={() => setShowDateTimeModal(true)}
                            >
                                <div className="dt-row">
                                    <div className="dt-icon-wrap"><FiCalendar size={15} /></div>
                                    <div className="dt-text">
                                        <span className="dt-label">Date</span>
                                        <span className="dt-value">
                                            {selectedDate ? selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not set'}
                                        </span>
                                    </div>
                                </div>
                                <div className="dt-divider" />
                                <div className="dt-row">
                                    <div className="dt-icon-wrap"><FiClock size={15} /></div>
                                    <div className="dt-text">
                                        <span className="dt-label">Time</span>
                                        <span className="dt-value">{formattedRange || 'Not set'}</span>
                                    </div>
                                </div>
                                <div className="dt-edit-hint">
                                    <FiChevronRight size={16} />
                                    <span>Edit</span>
                                </div>
                            </button>
                        </div>
                    </div>

                </div>

            </div>

            {/* Floating Sticky Footer Summary */}
            <div className="floating-footer-ui">
                <div className="d-flex align-items-center gap-3">
                    <div className="recruiter-pill">
                        {profilePhoto ? (
                            <img src={profilePhoto} alt="Recruiter" className="avatar-initials-premium" style={{ width: '40px', height: '40px' }} />
                        ) : (
                            <div className="avatar-initials-premium" style={{ width: '40px', height: '40px' }}>
                                {getInitials(userName)}
                            </div>
                        )}
                        <div className="recruiter-meta">
                            <h4 className="rec-name">{userName}</h4>
                            <span className="rec-role">{userRole}</span>
                        </div>
                    </div>
                </div>

                <div className="d-flex align-items-center">
                    <div className="divider-v"></div>
                    <div className="selection-summary-ui">
                        <p style={{ margin: 0, fontSize: "14px", fontWeight: 500 }}>
                            Candidate: <span style={{ color: "var(--f5810c)", fontWeight: 700 }}>{selectedCandidate?.name || "None Selection"}</span>
                        </p>
                        <p style={{ margin: 0, fontSize: "13px", color: "var(--slate-500)" }}>
                            On <strong>{selectedDate.toLocaleDateString('en-US', { dateStyle: 'long' })}</strong> | <strong>{formattedRange}</strong>
                        </p>
                    </div>
                    <div className="divider-v"></div>

                    <div className="d-flex align-items-center gap-4">
                        <div className="reminder-check-ui" onClick={() => setSendReminder(!sendReminder)} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", color: "var(--slate-600)" }}>
                            {sendReminder ? <FiCheckSquare color="#f5810c" size={20} /> : <FiSquare size={20} />}
                            <span style={{ fontSize: "12px", fontWeight: 600 }}>Automation Reminders</span>
                        </div>
                        <button
                            className="btn-alert-primary"
                            onClick={handleConfirm}
                            disabled={status === 'loading'}
                        >
                            {status === 'loading' ? 'Scheduling...' : 'Finalize Interview'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Job Full Overview Modal (Implemented with Inline Styles) */}
            {showJobModal && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, width: '100%', height: '100%',
                        background: 'rgba(15, 23, 42, 0.4)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 2000
                    }}
                    onClick={() => setShowJobModal(false)}
                >
                    <div
                        style={{
                            background: 'white',
                            width: '90%',
                            maxWidth: '800px',
                            maxHeight: '85vh',
                            borderRadius: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                            animation: 'modalSlideUp 0.3s ease-out',
                            overflow: 'hidden'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{
                            padding: '20px 24px',
                            borderBottom: '1px solid #f1f5f9',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Job Overview</h3>
                            {/* <button 
                                onClick={() => setShowJobModal(false)}
                                style={{
                                    background: '#f8fafc',
                                    border: 'none',
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#64748b',
                                    cursor: 'pointer'
                                }}
                            >
                                <FiX size={20} />
                            </button> */}
                        </div>
                        <div style={{ padding: '24px', overflowY: 'auto' }} className="hide-scrollbar">
                            <JobOverviewCard
                                job={selectedJob}
                                isExpanded={true}
                                onToggle={() => { }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Success Popover Modal */}
            {showSuccessModal && (
                <div className="success-overlay" onClick={() => { }}>
                    <div className="success-popover-modal" onClick={e => e.stopPropagation()}>
                        <div className="success-icon-wrap">
                            <FiCheckCircle size={60} color="#059669" />
                        </div>
                        <h2 className="success-title">Interview Scheduled Successfully!</h2>

                        <div className="success-summary-box">
                            <div className="summary-item">
                                <span className="s-label">Candidate</span>
                                <span className="s-value">{selectedCandidate?.name}</span>
                            </div>
                            <div className="summary-divider"></div>
                            <div className="summary-item">
                                <span className="s-label">Date</span>
                                <span className="s-value">{selectedDate.toLocaleDateString('en-US', { dateStyle: 'long' })}</span>
                            </div>
                            <div className="summary-divider"></div>
                            <div className="summary-item">
                                <span className="s-label">Time</span>
                                <span className="s-value">{formattedRange}</span>
                            </div>
                        </div>

                        <div className="success-note">
                            <p><strong>Note:</strong> Please check your mail to continue the process.</p>
                        </div>

                        <button className="back-btn-ui" onClick={() => navigate("/user/user-upcoming-interview")}>
                            Back to Schedules
                        </button>
                    </div>
                </div>
            )}

            {/* ── Combined Date + Time Modal ── */}
            {showDateTimeModal && (
                <div className="custom-modal-overlay" onClick={() => setShowDateTimeModal(false)}>
                    <div className="dt-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header-premium">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div className="bento-cell-icon-wrap"><FiCalendar size={14} /></div>
                                <h3 className="m-0" style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>Schedule Date &amp; Time</h3>
                            </div>
                            <button className="close-btn-premium" onClick={() => setShowDateTimeModal(false)}>
                                <FiX size={20} />
                            </button>
                        </div>
                        <div className="dt-modal-body">
                            {/* Left: Calendar */}
                            <div className="dt-modal-calendar">
                                <p className="dt-section-label"><FiCalendar size={12} /> Pick a Date</p>
                                <div className="calendar-popover-container">
                                    <DatePicker
                                        selected={selectedDate}
                                        onChange={(date) => setSelectedDate(date)}
                                        minDate={new Date()}
                                        inline
                                    />
                                </div>
                            </div>
                            {/* Right: Time */}
                            <div className="dt-modal-time">
                                <p className="dt-section-label"><FiClock size={12} /> Pick a Time</p>
                                <div className="time-tabs-wrapper mb-3" style={{ margin: '0 0 12px' }}>
                                    <button className={`time-tab-btn ${timeMode === 'quick' ? 'active' : ''}`} onClick={() => setTimeMode('quick')}>Quick</button>
                                    <button className={`time-tab-btn ${timeMode === 'custom' ? 'active' : ''}`} onClick={() => setTimeMode('custom')}>Custom</button>
                                </div>
                                {timeMode === 'quick' && (
                                    <div className="slots-grid">
                                        {timeSlots.map(slot => (
                                            <button
                                                key={slot.id}
                                                className={`slot-chip ${(!isRangeMode && timeSlotId === slot.id) ? 'active' : ''}`}
                                                onClick={() => handleQuickSlotClick(slot)}
                                            >
                                                {slot.time}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                {timeMode === 'custom' && (
                                    <div className="custom-range-container">
                                        <div className="time-select-block mb-3">
                                            <span className="range-label">From:</span>
                                            <div className="h-m-picker">
                                                <select value={startTime.hr} onChange={(e) => { setStartTime({ ...startTime, hr: e.target.value }); setIsRangeMode(true); }}>
                                                    {hoursOptions.map(h => <option key={h} value={h}>{h}</option>)}
                                                </select>
                                                <select value={startTime.min} onChange={(e) => { setStartTime({ ...startTime, min: e.target.value }); setIsRangeMode(true); }}>
                                                    {minutesOptions.map(m => <option key={m} value={m}>{m}</option>)}
                                                </select>
                                                <select value={startTime.ampm} onChange={(e) => { setStartTime({ ...startTime, ampm: e.target.value }); setIsRangeMode(true); }}>
                                                    <option value="AM">AM</option>
                                                    <option value="PM">PM</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="time-select-block">
                                            <span className="range-label">To:</span>
                                            <div className="h-m-picker">
                                                <select value={endTime.hr} onChange={(e) => { setEndTime({ ...endTime, hr: e.target.value }); setIsRangeMode(true); }}>
                                                    {hoursOptions.map(h => <option key={h} value={h}>{h}</option>)}
                                                </select>
                                                <select value={endTime.min} onChange={(e) => { setEndTime({ ...endTime, min: e.target.value }); setIsRangeMode(true); }}>
                                                    {minutesOptions.map(m => <option key={m} value={m}>{m}</option>)}
                                                </select>
                                                <select value={endTime.ampm} onChange={(e) => { setEndTime({ ...endTime, ampm: e.target.value }); setIsRangeMode(true); }}>
                                                    <option value="AM">AM</option>
                                                    <option value="PM">PM</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="dt-modal-confirm-row">
                                    <div className="dt-confirm-summary">
                                        <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Selected</span>
                                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                                            {selectedDate ? selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '-'} · {formattedRange || '-'}
                                        </span>
                                    </div>
                                    <button
                                        className="btn-alert-primary"
                                        style={{ padding: '10px 28px', fontSize: '13px' }}
                                        onClick={() => setShowDateTimeModal(false)}
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScheduleInterview;
