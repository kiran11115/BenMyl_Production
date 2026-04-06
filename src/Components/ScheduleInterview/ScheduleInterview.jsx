import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
    FiMapPin, FiArrowLeft, FiCheckSquare, FiSquare, FiCalendar,
    FiClock, FiStar, FiCheckCircle, FiEye, FiX, FiBriefcase
} from 'react-icons/fi';
import { GiCheckMark } from "react-icons/gi";
import { useGetRecruiterProfileQuery } from "../../State-Management/Api/RecruiterProfileApiSlice";
import { useGetGroupedJobTitlesQuery } from "../../State-Management/Api/TalentPoolApiSlice";
import JobOverviewCard from "../TalentPool/JobOverviewCard";
import './ScheduleInterview.css';

// --- Mock Candidates ---
const mockCandidates = [
    { id: 1, firstName: "Michael", lastName: "Chen", name: "Michael Chen", role: "Frontend Expert", email: "michael.c@tech.com", phone: "+1 (555) 101-1234", avatar: "", experience: "8 Years Exp", skills: ["React", "TypeScript", "Node.js"], rating: 4.8, verified: true, availability: ["Full-time"] },
    { id: 2, firstName: "Sophia", lastName: "Rodriguez", name: "Sophia Rodriguez", role: "React Architect", email: "sophia.r@dev.io", phone: "+1 (555) 202-5678", avatar: "", experience: "6 Years Exp", skills: ["Next.js", "Redux", "Tailwind"], rating: 4.7, verified: true, availability: ["Contract"] },
    { id: 3, firstName: "James", lastName: "Wilson", name: "James Wilson", role: "Product Designer", email: "j.wilson@design.io", phone: "+1 (555) 303-9988", avatar: "", experience: "5 Years Exp", skills: ["Figma", "Adobe XD", "Prototyping"], rating: 4.9, verified: false, availability: ["Full-time"] },
    { id: 4, firstName: "Emma", lastName: "Watson", name: "Emma Watson", role: "UX Strategist", email: "emma.w@agency.com", phone: "+1 (555) 404-7766", avatar: "", experience: "7 Years Exp", skills: ["User Research", "Wireframing", "A/B Testing"], rating: 4.6, verified: true, availability: ["Remote"] }
];

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
    const [selectedCandidate, setSelectedCandidate] = useState(mockCandidates[0]);
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

    // Initial state setup for jobs
    useEffect(() => {
        if (jobs.length > 0 && !selectedJob) {
            setSelectedJob(jobs[0]);
        }
    }, [jobs, selectedJob]);

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

    const handleConfirm = () => {
        setStatus('loading');
        setTimeout(() => {
            setStatus('idle');
            setShowSuccessModal(true);
        }, 1200);
    };

    const isSameDay = (d1, d2) => d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();

    const formattedRange = `${startTime.hr}:${startTime.min} ${startTime.ampm} ${isRangeMode ? `to ${endTime.hr}:${endTime.min} ${endTime.ampm}` : ''}`;

    if (isJobsLoading) {
        return <div className="jobs-container d-flex align-items-center justify-content-center">Loading Jobs...</div>;
    }

    return (
        <div className="jobs-container no-effects">

            <div className="profile-breadcrumb">
                <button className="link-button" onClick={() => navigate("/user/user-dashboard")}><FiArrowLeft /> Dashboard </button>
                <span className="crumb">/ Schedule Interview</span>
            </div>

            <div className="search-header-row d-flex justify-content-between align-items-center">
                <div className="header-text">
                    <h1 style={{ fontSize: "24px", fontWeight: 700, margin: "0 0 4px 0", color: "var(--slate-800)" }}>Schedule Interview</h1>
                    <p style={{ margin: 0, color: "var(--slate-500)", fontSize: "14px" }}>Manage and finalize candidate interviews efficiently.</p>
                </div>
                <div className="search-input-container d-flex flex-column" style={{ maxWidth: "350px", flex: 1 }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <label className="fg-title m-0">Select Posted Job</label>
                    </div>
                    <div className="dropdown-wrapper">
                        <select
                            className="sort-select"
                            style={{ width: "100%", padding: "10px 14px" }}
                            value={selectedJob?.id || ""}
                            onChange={(e) => handleJobSelect(e.target.value)}
                        >
                            {jobs.map(job => <option key={job.id} value={job.id}>{job.title}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="three-column-schedule">

                {/* COLUMN 1: Profiles */}
                <section className="col-candidates">
                    <h3 className="fg-title">Shortlisted Profiles ({mockCandidates.length})</h3>
                    <div className="profiles-stack hide-scrollbar">
                        {mockCandidates.map(candidate => (
                            <div
                                key={candidate.id}
                                className={`project-card ${selectedCandidate.id === candidate.id ? 'active-card' : ''}`}
                                onClick={() => setSelectedCandidate(candidate)}
                                style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "16px", cursor: "pointer" }}
                            >
                                <div className="card-header">
                                    {candidate.avatar ? (
                                        <img src={candidate.avatar} alt={candidate.name} className="avatar" />
                                    ) : (
                                        <div className="avatar initials-bg-profile">
                                            {getInitials(candidate.name)}
                                        </div>
                                    )}
                                    <div className="header-info">
                                        <div className="name-row">
                                            <h4 className="name">
                                                {candidate.name} {candidate.verified && (<GiCheckMark size={14} color="#059669" />)}
                                            </h4>
                                            <div className="rating">
                                                <FiStar size={11} fill="#f59e0b" color="#f59e0b" />
                                                <span style={{ color: "#f59e0b" }}>{candidate.rating}</span>
                                            </div>
                                        </div>
                                        <div className="role">{candidate.role}</div>
                                    </div>
                                </div>
                                <div className="meta-grid">
                                    <div className="meta-item"><FiBriefcase size={14} /> <span>{candidate.experience}</span></div>
                                    <div className="meta-item"><FiMapPin size={14} /> <span>{selectedJob?.location || "Remote"}</span></div>
                                </div>
                                <div className="skills-row">
                                    {candidate.skills.slice(0, 2).map(skill => (
                                        <span key={skill} className="status-tag">{skill}</span>
                                    ))}
                                    {candidate.skills.length > 2 && <span className="status-tag count">+{candidate.skills.length - 2}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* COLUMN 2: Select Date (Middle - 1fr) */}
                <section className="col-times">
                    {/* Compact Job Card (Minor Details) with View Icon */}
                    <div className="mb-4" style={{ position: 'relative' }}>
                        <JobOverviewCard 
                            job={selectedJob} 
                            isExpanded={false} 
                            onToggle={() => {}} 
                        />
                        <button 
                            style={{
                                position: 'absolute',
                                top: '16px',
                                right: '16px',
                                background: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                color: '#1e293b',
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                            }}
                            onClick={() => setShowJobModal(true)}
                            title="View Full Details"
                        >
                            <FiEye size={16} />
                        </button>
                    </div>

                    <div className="project-card flex-grow-1 d-flex flex-column" style={{ minHeight: 0 }}>
                        <div className="d-flex justify-content-between align-items-center p-3">
                            <h3 className="fg-title m-0"><FiCalendar /> Select Date</h3>
                            <div className="date-picker-popup">
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={handlePickerChange}
                                    minDate={new Date()}
                                    todayButton="Go to Today"
                                    customInput={<button className="icon-btn-picker"><FiCalendar /></button>}
                                    popperPlacement="bottom-end"
                                />
                            </div>
                        </div>
                        <div className="date-cards-grid hide-scrollbar p-3">
                            {upcomingDates.map((date, idx) => (
                                <div
                                    key={idx}
                                    className={`date-small-box ${isSameDay(selectedDate, date) ? 'active' : ''}`}
                                    onClick={() => setSelectedDate(date)}
                                >
                                    <span className="m-name">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
                                    <span className="d-num">{date.getDate()}</span>
                                    <span className="d-name">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* COLUMN 3: Select Time (Right - 350px) */}
                <section className="col-dates">
                    <div className="project-card flex-grow-1 d-flex flex-column" style={{ minHeight: 0, height: '100%' }}>
                        <h3 className="fg-title p-3 m-0"><FiClock /> Select Time</h3>
                        
                        <div className="times-stack hide-scrollbar p-3">
                             {/* QUICK SLOTS */}
                            <div className="quick-slots-container mb-4">
                                <label className="sub-title-ui mb-3 d-block">Quick Slots</label>
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
                            </div>

                            {/* CUSTOM RANGE */}
                            <div className="custom-range-container">
                                <label className="sub-title-ui mb-3 d-block w-100">Custom Range</label>

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
                        </div>
                    </div>
                </section>

            </div>

            {/* Floating Sticky Footer Summary */}
            <div className="floating-footer-ui">
                <div className="d-flex align-items-center gap-3">
                    <div className="recruiter-pill">
                        {profilePhoto ? (
                            <img src={profilePhoto} alt="Recruiter" className="recruiter-avatar" />
                        ) : (
                            <div className="recruiter-avatar initials-bg">
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
                            Candidate: <span style={{ color: "var(--f5810c)", fontWeight: 700 }}>{selectedCandidate.name}</span>
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
                                onToggle={() => {}} 
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
                                <span className="s-value">{selectedCandidate.name}</span>
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

                        <button className="back-btn-ui" onClick={() => setShowSuccessModal(false)}>
                            Back to Schedules
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ScheduleInterview;
