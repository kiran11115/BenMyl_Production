import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  FiMapPin, FiArrowLeft, FiCheckSquare, FiSquare, FiCalendar, 
  FiClock, FiChevronDown, FiCheck, FiBriefcase, FiMail, FiPhone, FiStar
} from 'react-icons/fi';
import { GiCheckMark } from "react-icons/gi";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetRecruiterProfileQuery } from "../../State-Management/Api/RecruiterProfileApiSlice";
import './ScheduleInterview.css';

// --- Mock Data ---

const mockJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "BenMyl Technologies",
    location: "Hyderabad",
    candidates: [
      { id: 1, firstName: "Michael", lastName: "Chen", name: "Michael Chen", role: "Frontend Expert", email: "michael.c@tech.com", phone: "+1 (555) 101-1234", avatar: "", experience: "8 Years Exp", skills: ["React", "TypeScript", "Node.js"], rating: 4.8, verified: true, availability: ["Full-time"] },
      { id: 2, firstName: "Sophia", lastName: "Rodriguez", name: "Sophia Rodriguez", role: "React Architect", email: "sophia.r@dev.io", phone: "+1 (555) 202-5678", avatar: "", experience: "6 Years Exp", skills: ["Next.js", "Redux", "Tailwind"], rating: 4.7, verified: true, availability: ["Contract"] }
    ]
  },
  {
    id: 2,
    title: "UI/UX Designer",
    company: "Creative Studio",
    location: "Bangalore",
    candidates: [
      { id: 3, firstName: "James", lastName: "Wilson", name: "James Wilson", role: "Product Designer", email: "j.wilson@design.io", phone: "+1 (555) 303-9988", avatar: "", experience: "5 Years Exp", skills: ["Figma", "Adobe XD", "Prototyping"], rating: 4.9, verified: false, availability: ["Full-time"] },
      { id: 4, firstName: "Emma", lastName: "Watson", name: "Emma Watson", role: "UX Strategist", email: "emma.w@agency.com", phone: "+1 (555) 404-7766", avatar: "", experience: "7 Years Exp", skills: ["User Research", "Wireframing", "A/B Testing"], rating: 4.6, verified: true, availability: ["Remote"] }
    ]
  }
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

    const [selectedJob, setSelectedJob] = useState(mockJobs[0]);
    const [selectedCandidate, setSelectedCandidate] = useState(mockJobs[0].candidates[0]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewDate, setViewDate] = useState(new Date());
    const [timeSlotId, setTimeSlotId] = useState('09:00');
    const [sendReminder, setSendReminder] = useState(true);
    const [status, setStatus] = useState('idle');

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
        { id: '09:00', time: '9:00 AM' },
        { id: '10:00', time: '10:00 AM' },
        { id: '11:00', time: '11:00 AM' },
        { id: '12:00', time: '12:00 PM' },
        { id: '14:00', time: '2:00 PM' },
        { id: '15:00', time: '3:00 PM' },
        { id: '16:00', time: '4:00 PM' },
        { id: '17:00', time: '5:00 PM' }
    ];

    const getInitials = (name = "") => {
        return name.trim().split(" ").slice(0, 2).map(word => word[0]?.toUpperCase()).join("");
    };

    const handleJobSelect = (jobId) => {
        const job = mockJobs.find(j => j.id === Number(jobId));
        setSelectedJob(job);
        setSelectedCandidate(job.candidates[0]);
    };

    const handleConfirm = () => {
        setStatus('loading');
        setTimeout(() => {
            setStatus('idle');
            toast.success(`Interview scheduled for ${selectedCandidate.name}!`, { theme: "colored" });
        }, 1000);
    };

    const isSameDay = (d1, d2) => d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();

    return (
        <div className="jobs-container no-effects">
            <ToastContainer />
            
            <div className="profile-breadcrumb">
                <button className="link-button" onClick={() => navigate("/user/user-dashboard")}><FiArrowLeft /> Dashboard </button>
                <span className="crumb">/ Schedule Interview</span>
            </div>

            <div className="search-header-row d-flex justify-content-between align-items-center">
                <div className="header-text">
                    <h1 style={{ fontSize: "24px", fontWeight: 700, margin: "0 0 4px 0", color: "var(--slate-800)" }}>Schedule Interview</h1>
                    <p style={{ margin: 0, color: "var(--slate-500)", fontSize: "14px" }}>Schedule and manage candidate interviews.</p>
                </div>
                <div className="search-input-container d-flex flex-column" style={{ maxWidth: "350px", flex: 1 }}>
                    <label className="fg-title mb-2">Select Posted Job</label>
                    <div className="dropdown-wrapper">
                        <select 
                          className="sort-select" 
                          style={{ width: "100%", padding: "10px 14px" }}
                          value={selectedJob.id} 
                          onChange={(e) => handleJobSelect(e.target.value)}
                        >
                            {mockJobs.map(job => <option key={job.id} value={job.id}>{job.title}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="three-column-schedule">
                
                {/* COLUMN 1: Profiles */}
                <section className="col-candidates">
                    <h3 className="fg-title">Shortlisted Profiles <span className="count-badge">{selectedJob.candidates.length}</span></h3>
                    <div className="profiles-stack">
                        {selectedJob.candidates.map(candidate => (
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
                                                <FiStar size={12} fill="#f59e0b" color="#f59e0b" />
                                                <span style={{ color: "#f59e0b" }}>{candidate.rating}</span>
                                            </div>
                                        </div>
                                        <div className="role">{candidate.role}</div>
                                    </div>
                                </div>
                                <div className="meta-grid">
                                    <div className="meta-item"><FiBriefcase size={14} /> <span>{candidate.experience}</span></div>
                                    <div className="meta-item"><FiMapPin size={14} /> <span>{selectedJob.location}</span></div>
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

                {/* COLUMN 2: Dates Grid */}
                <section className="col-dates">
                    <div className="d-flex justify-content-between align-items-center mb-3">
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
                    <div className="date-cards-grid">
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
                </section>

                {/* COLUMN 3: Times */}
                <section className="col-times">
                    <h3 className="fg-title"><FiClock /> Select Time</h3>
                    <div className="times-stack">
                        {timeSlots.map(slot => (
                            <button 
                              key={slot.id} 
                              className={`time-mini-btn ${timeSlotId === slot.id ? 'active' : ''}`}
                              onClick={() => setTimeSlotId(slot.id)}
                            >
                                <FiClock /> {slot.time}
                            </button>
                        ))}
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
                            Candidate: <span style={{color: "var(--f5810c)", fontWeight: 700}}>{selectedCandidate.name}</span>
                        </p>
                        <p style={{ margin: 0, fontSize: "13px", color: "var(--slate-500)" }}>
                            On <strong>{selectedDate.toLocaleDateString('en-US', { dateStyle: 'long' })}</strong> at <strong>{timeSlots.find(t => t.id === timeSlotId)?.time}</strong>
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

        </div>
    );
};

export default ScheduleInterview;
