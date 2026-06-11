import React, { useState, useEffect, useRef, useMemo } from 'react';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
    FiX, FiBriefcase, FiCalendar, FiClock, FiSearch,
    FiChevronDown, FiEye, FiEyeOff, FiVideo, FiBell, FiUser
} from 'react-icons/fi';
import { BsBuilding } from 'react-icons/bs';
import { useGetGroupedJobTitlesQuery, useTalentPoolMutation } from "../../State-Management/Api/TalentPoolApiSlice";
import { useScheduleInterviewMutation } from '../../State-Management/Api/ScheduleInterviewApiSlice';
import { useGetRecruiterProfileQuery } from '../../State-Management/Api/RecruiterProfileApiSlice';
import JobOverviewCard from "../TalentPool/JobOverviewCard";
import './ScheduleInterviewDrawer.css';

/* ── Helpers ── */
function useOutsideClick(ref, cb) {
    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) cb(); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [ref, cb]);
}

const getInitials = (name = '') =>
    name.trim().split(' ').slice(0, 2).map(w => w[0]?.toUpperCase()).join('');

const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/* ── Component ── */
const ScheduleInterviewDrawer = ({ isOpen, onClose, onSuccess }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [isJobPreviewExpanded, setIsJobPreviewExpanded] = useState(false);

    /* Auth */
    const userId = localStorage.getItem('CompanyId');
    const companyId = localStorage.getItem('logincompanyid');
    const userName = localStorage.getItem('UserName') || 'Recruiter';
    const userRole = localStorage.getItem('Role') || 'Recruiter';

    /* Recruiter profile for footer photo */
    const { data: recruiterProfile } = useGetRecruiterProfileQuery(Number(userId), { skip: !userId });
    const recruiterPhoto = recruiterProfile?.profilePhoto
        ? (recruiterProfile.profilePhoto.startsWith('http')
            ? recruiterProfile.profilePhoto
            : `https://webapidev.benmyl.com/${recruiterProfile.profilePhoto}`)
        : null;

    /* Form */
    const [selectedJob, setSelectedJob] = useState(null);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [timeSlotId, setTimeSlotId] = useState('09:00');
    const [startTime, setStartTime] = useState({ hr: '09', min: '00', ampm: 'AM' });
    const [endTime, setEndTime] = useState({ hr: '10', min: '00', ampm: 'AM' });
    const [timeMode, setTimeMode] = useState('quick');
    const [isRangeMode, setIsRangeMode] = useState(false);

    /* Preferences (UI-only) */
    const [sendReminder, setSendReminder] = useState(true);
    const [interviewMode, setInterviewMode] = useState('Video Call');

    /* Popovers */
    const [jobPopoverOpen, setJobPopoverOpen] = useState(false);
    const [candidatePopoverOpen, setCandidatePopoverOpen] = useState(false);
    const [jobSearch, setJobSearch] = useState('');
    const [candidateSearch, setCandidateSearch] = useState('');

    const jobRef = useRef();
    const candidateRef = useRef();
    useOutsideClick(jobRef, () => setJobPopoverOpen(false));
    useOutsideClick(candidateRef, () => setCandidatePopoverOpen(false));

    /* API */
    const { data: fetchedJobs, isLoading: isJobsLoading } =
        useGetGroupedJobTitlesQuery(userId, { skip: !userId || !isOpen });
    const [getFindTalent] = useTalentPoolMutation();
    const [scheduleInterview, { isLoading: isSubmitting }] = useScheduleInterviewMutation();

    const [candidates, setCandidates] = useState([]);
    const [isCandidatesLoading, setIsCandidatesLoading] = useState(false);

    /* Map API jobs */
    const jobs = useMemo(() => {
        if (!Array.isArray(fetchedJobs)) return [];
        return fetchedJobs.map(j => ({
            id: j.jobID,
            title: j.jobTitle,
            company: j.companyName || 'Your Company',
            location: j.location || 'On-site',
            budget: j.salaryRange_Min || 'N/A',
            salaryType: j.salarType || '/hr',
            experience: j.yearsOfExperience || '0',
            type: j.employeeType || 'Full-time',
            description: j.jobDescription || '',
            requiredSkills: j.requiredSkills
                ? j.requiredSkills.split(',').map(s => s.trim())
                : [],
        }));
    }, [fetchedJobs]);

    const filteredJobs = useMemo(
        () => jobs.filter(j => j.title.toLowerCase().includes(jobSearch.toLowerCase())),
        [jobs, jobSearch]
    );
    const filteredCandidates = useMemo(
        () => candidates.filter(c => c.name.toLowerCase().includes(candidateSearch.toLowerCase())),
        [candidates, candidateSearch]
    );

    /* Fetch shortlisted candidates when job changes */
    useEffect(() => {
        if (!selectedJob || !companyId) { setCandidates([]); setSelectedCandidate(null); return; }
        const fetch = async () => {
            setIsCandidatesLoading(true);
            try {
                const payload = {
                    companyid: Number(companyId),
                    pageNumber: 1,
                    pageSize: 100,
                    filters: [{ filterName: 'Title', filterOperator: 'Equals', filterValue: [selectedJob.title] }],
                };
                const res = await getFindTalent(payload).unwrap();
                if (Array.isArray(res)) {
                    setCandidates(
                        res.filter(i => i.isshortlisted && !i.isSchedules).map(i => ({
                            id: i.employeeID,
                            name: `${i.firstName} ${i.lastName}`,
                            role: i.title || '—',
                            email: i.emailAddress,
                            avatar: i.profilePicture || '',
                        }))
                    );
                    setSelectedCandidate(null);
                }
            } catch (err) {
                console.error('Failed to fetch candidates:', err);
            } finally {
                setIsCandidatesLoading(false);
            }
        };
        fetch();
    }, [selectedJob, companyId, getFindTalent]);

    /* Close with animation */
    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => { setIsClosing(false); onClose(); }, 280);
    };

    if (!isOpen && !isClosing) return null;

    /* Time slots */
    const TIME_SLOTS = [
        { id: '09:00', label: '9:00 AM', hr: '09', min: '00', ampm: 'AM' },
        { id: '10:00', label: '10:00 AM', hr: '10', min: '00', ampm: 'AM' },
        { id: '11:00', label: '11:00 AM', hr: '11', min: '00', ampm: 'AM' },
        { id: '12:00', label: '12:00 PM', hr: '12', min: '00', ampm: 'PM' },
        { id: '14:00', label: '2:00 PM', hr: '02', min: '00', ampm: 'PM' },
        { id: '15:00', label: '3:00 PM', hr: '03', min: '00', ampm: 'PM' },
        { id: '16:00', label: '4:00 PM', hr: '04', min: '00', ampm: 'PM' },
        { id: '17:00', label: '5:00 PM', hr: '05', min: '00', ampm: 'PM' },
    ];
    const HOURS = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    const MINUTES = ['00', '15', '30', '45'];

    const handleQuickSlot = (slot) => {
        setTimeSlotId(slot.id);
        setIsRangeMode(false);
        setStartTime({ hr: slot.hr, min: slot.min, ampm: slot.ampm });
        let eHr = (parseInt(slot.hr, 10) + 1).toString().padStart(2, '0');
        let eAmpm = slot.ampm;
        if (slot.hr === '11') eAmpm = slot.ampm === 'AM' ? 'PM' : 'AM';
        if (slot.hr === '12') eHr = '01';
        setEndTime({ hr: eHr, min: slot.min, ampm: eAmpm });
    };

    const formattedRange = `${startTime.hr}:${startTime.min} ${startTime.ampm} – ${endTime.hr}:${endTime.min} ${endTime.ampm}`;

    /* Footer date display */
    const footerDay = DAY_SHORT[selectedDate?.getDay() ?? 0];
    const footerDate = selectedDate?.getDate() ?? '';

    /* Submit — no changes to existing API payload */
    const handleFinalize = async () => {
        if (!selectedCandidate || !selectedJob) {
            toast.error('Please select a job and candidate.');
            return;
        }
        try {
            const interviewDate = selectedDate.toLocaleDateString('en-CA');
            const fd = new FormData();
            fd.append('InterviewId', 0);
            fd.append('RecruiterID', Number(userId));
            fd.append('RecruiterName', userName);
            fd.append('CompanyName', selectedJob.company);
            fd.append('JobTitle', selectedJob.title);
            fd.append('CandidateName', selectedCandidate.name);
            fd.append('InterviewDate', interviewDate);
            fd.append('InterviewTime', `${startTime.hr}:${startTime.min} ${startTime.ampm} to ${endTime.hr}:${endTime.min} ${endTime.ampm}`);
            fd.append('InterviewMode', 'Online');
            fd.append('InterviewLocation', selectedJob.location);
            fd.append('InterviewerName', userName);
            fd.append('InterviewLink', 'Google.com');
            fd.append('CandidateID', selectedCandidate.id);
            fd.append('CandidateEmailid', selectedCandidate.email);
            fd.append('Salary', selectedJob.budget);
            fd.append('SalaryType', selectedJob.salaryType);
            fd.append('CandidtateRecruiterid', 0);

            await scheduleInterview(fd).unwrap();
            toast.success('Interview scheduled successfully!');
            if (onSuccess) onSuccess();
            handleClose();
        } catch (err) {
            console.error('Schedule failed:', err);
            toast.error('Failed to schedule interview.');
        }
    };

    /* ── Shared avatar helper ── */
    const AvatarOrInitials = ({ src, name, size = 32, bg = '#1e293b' }) =>
        src ? (
            <img src={src} alt={name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }} />
        ) : (
            <div style={{
                width: size, height: size, borderRadius: '50%',
                background: bg, color: '#fff',
                fontSize: size * 0.38, display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0,
            }}>
                {getInitials(name)}
            </div>
        );

    const isSchedulingEnabled = !!(selectedJob && selectedCandidate);

    return (
        <div className={`sid-overlay ${isClosing ? 'closing' : ''}`}>
            <div
                className={`sid-container ${isOpen && !isClosing ? 'open' : ''} ${isJobPreviewExpanded ? 'sid-width-60' : 'sid-width-40'}`}
                onClick={e => e.stopPropagation()}
            >
                {/* ── Header ── */}
                <div className="sid-header">
                    <h2 className="sid-header-title">
                        <FiCalendar size={16} color="rgba(255,255,255,0.8)" />
                        Schedule Interview
                    </h2>
                    <button className="sid-close-btn" onClick={handleClose}><FiX size={18} /></button>
                </div>

                {/* ── Body ── */}
                <div className="sid-body-wrapper">

                    {/* ─ Main panel ─ */}
                    <div className="sid-main-panel hide-scrollbar">

                        {/* Selection card */}
                        <div className="sid-section">
                            <div className="sid-section-label">
                                <FiBriefcase size={12} /> Participants
                            </div>

                            <div className="sid-form-grid">

                                {/* Job */}
                                <div style={{ position: 'relative' }} ref={jobRef}>
                                    <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                        Job Requisition
                                    </div>
                                    <button
                                        className={`sid-dropdown-target ${selectedJob ? 'has-value' : ''}`}
                                        onClick={() => setJobPopoverOpen(p => !p)}
                                    >
                                        {selectedJob
                                            ? <span className="sid-dropdown-value">{selectedJob.title}</span>
                                            : <span className="sid-dropdown-placeholder">Select a job...</span>}
                                        <FiChevronDown size={14} color="#94a3b8" />
                                    </button>

                                    {/* Job popover */}
                                    {jobPopoverOpen && (
                                        <div className="sid-popover">
                                            <div className="sid-popover-search">
                                                <FiSearch className="sid-search-icon" size={13} />
                                                <input
                                                    autoFocus
                                                    type="text"
                                                    placeholder="Search jobs…"
                                                    value={jobSearch}
                                                    onChange={e => setJobSearch(e.target.value)}
                                                />
                                            </div>
                                            <div className="sid-popover-list hide-scrollbar">
                                                {isJobsLoading
                                                    ? Array.from({ length: 3 }).map((_, i) => (
                                                        <div key={i} className="sid-skeleton-item">
                                                            <div className="sid-skeleton" style={{ width: 22, height: 22, borderRadius: '50%' }} />
                                                            <div className="sid-skeleton" style={{ flex: 1, height: 13 }} />
                                                        </div>
                                                    ))
                                                    : filteredJobs.length > 0
                                                        ? filteredJobs.map(job => (
                                                            <div
                                                                key={job.id}
                                                                className={`sid-popover-item ${selectedJob?.id === job.id ? 'selected' : ''}`}
                                                                onClick={() => { setSelectedJob(job); setJobPopoverOpen(false); setJobSearch(''); }}
                                                            >
                                                                <div style={{ width: 28, height: 28, borderRadius: 8, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                                    <BsBuilding size={13} color="#64748b" />
                                                                </div>
                                                                <div>
                                                                    <div style={{ fontSize: 12, fontWeight: 600, color: '#1e293b' }}>{job.title}</div>
                                                                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{job.company}</div>
                                                                </div>
                                                            </div>
                                                        ))
                                                        : <div style={{ padding: '14px 12px', fontSize: 12, color: '#94a3b8', textAlign: 'center' }}>No jobs found.</div>
                                                }
                                            </div>
                                        </div>
                                    )}

                                    {/* View Details link */}
                                    {selectedJob && (
                                        <button
                                            onClick={() => setIsJobPreviewExpanded(p => !p)}
                                            style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 11, fontWeight: 600, marginTop: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, padding: 0 }}
                                        >
                                            {isJobPreviewExpanded ? <><FiEyeOff size={12} /> Hide Details</> : <><FiEye size={12} /> View Details</>}
                                        </button>
                                    )}
                                </div>

                                {/* Candidate */}
                                <div style={{ position: 'relative' }} ref={candidateRef}>
                                    <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                        Candidate
                                    </div>
                                    <button
                                        className={`sid-dropdown-target ${selectedCandidate ? 'has-value' : ''}`}
                                        onClick={() => setCandidatePopoverOpen(p => !p)}
                                        disabled={!selectedJob}
                                    >
                                        {selectedCandidate
                                            ? (
                                                <span className="sid-dropdown-value" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                    <AvatarOrInitials src={selectedCandidate.avatar} name={selectedCandidate.name} size={18} />
                                                    {selectedCandidate.name}
                                                </span>
                                            )
                                            : <span className="sid-dropdown-placeholder">{!selectedJob ? 'Select a job first…' : 'Select candidate…'}</span>
                                        }
                                        <FiChevronDown size={14} color="#94a3b8" />
                                    </button>

                                    {/* Candidate popover */}
                                    {candidatePopoverOpen && selectedJob && (
                                        <div className="sid-popover">
                                            <div className="sid-popover-search">
                                                <FiSearch className="sid-search-icon" size={13} />
                                                <input
                                                    autoFocus
                                                    type="text"
                                                    placeholder="Search candidates…"
                                                    value={candidateSearch}
                                                    onChange={e => setCandidateSearch(e.target.value)}
                                                />
                                            </div>
                                            <div className="sid-popover-list hide-scrollbar">
                                                {isCandidatesLoading
                                                    ? Array.from({ length: 3 }).map((_, i) => (
                                                        <div key={i} className="sid-skeleton-item">
                                                            <div className="sid-skeleton" style={{ width: 30, height: 30, borderRadius: '50%' }} />
                                                            <div className="sid-skeleton" style={{ flex: 1, height: 13 }} />
                                                        </div>
                                                    ))
                                                    : filteredCandidates.length > 0
                                                        ? filteredCandidates.map(c => (
                                                            <div
                                                                key={c.id}
                                                                className={`sid-popover-item ${selectedCandidate?.id === c.id ? 'selected' : ''}`}
                                                                onClick={() => { setSelectedCandidate(c); setCandidatePopoverOpen(false); setCandidateSearch(''); }}
                                                            >
                                                                <AvatarOrInitials src={c.avatar} name={c.name} size={30} />
                                                                <div>
                                                                    <div style={{ fontSize: 12, fontWeight: 600, color: '#1e293b' }}>{c.name}</div>
                                                                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{c.role}</div>
                                                                </div>
                                                            </div>
                                                        ))
                                                        : <div style={{ padding: '14px 12px', fontSize: 12, color: '#94a3b8', textAlign: 'center' }}>No shortlisted candidates found.</div>
                                                }
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Schedule card */}
                        <div className={`sid-section ${!isSchedulingEnabled ? 'sid-disabled' : ''}`}>
                            <div className="sid-section-label" style={{ display: 'none' }}>
                                <FiCalendar size={12} /> Schedule Details
                            </div>

                            <div className="sid-datetime-grid">

                                {/* Image-Matching Calendar Block */}
                                <div className="sid-calendar-container">
                                    {/* Top Header */}
                                    <div className="sid-cal-header">
                                        <div className="sid-cal-icon">
                                            <FiCalendar size={14} color="#f5810c" />
                                        </div>
                                        <span className="sid-cal-title">CALENDAR</span>
                                    </div>

                                    {/* React DatePicker */}
                                    <div className="sid-cal-body">
                                        <DatePicker
                                            selected={selectedDate}
                                            onChange={date => setSelectedDate(date)}
                                            minDate={new Date()}
                                            inline
                                        />
                                    </div>

                                    {/* Bottom Indicator */}
                                    <div className="sid-cal-indicator">
                                        <div className="sid-cal-dot"></div>
                                        <span>Interview Scheduled</span>
                                    </div>

                                    {/* Reset Button */}
                                    <button
                                        className="sid-cal-reset"
                                        onClick={() => setSelectedDate(new Date())}
                                    >
                                        Reset Selection
                                    </button>
                                </div>

                                {/* Time picker */}
                                <div className="sid-time-picker-block">
                                    <div className="sid-time-tabs">
                                        <button
                                            className={`sid-time-tab ${timeMode === 'quick' ? 'active' : ''}`}
                                            onClick={() => setTimeMode('quick')}
                                        >Quick Select</button>
                                        <button
                                            className={`sid-time-tab ${timeMode === 'custom' ? 'active' : ''}`}
                                            onClick={() => setTimeMode('custom')}
                                        >Custom</button>
                                    </div>

                                    {timeMode === 'quick' ? (
                                        <div className="sid-time-slots">
                                            {TIME_SLOTS.map(slot => (
                                                <button
                                                    key={slot.id}
                                                    className={`sid-time-slot ${!isRangeMode && timeSlotId === slot.id ? 'active' : ''}`}
                                                    onClick={() => handleQuickSlot(slot)}
                                                >
                                                    {slot.label}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="sid-custom-time-container">
                                            {[
                                                { label: 'Start Time', time: startTime, setTime: (v) => { setStartTime(v); setIsRangeMode(true); } },
                                                { label: 'End Time', time: endTime, setTime: (v) => { setEndTime(v); setIsRangeMode(true); } },
                                            ].map(({ label, time, setTime }) => (
                                                <div key={label} className="sid-custom-time-group">
                                                    <label className="sid-custom-time-label">{label}</label>
                                                    <div className="sid-custom-time-inputs">
                                                        <select className="sid-auth-input" value={time.hr} onChange={e => setTime({ ...time, hr: e.target.value })}>
                                                            {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                                                        </select>
                                                        <span className="sid-time-colon">:</span>
                                                        <select className="sid-auth-input" value={time.min} onChange={e => setTime({ ...time, min: e.target.value })}>
                                                            {MINUTES.map(m => <option key={m} value={m}>{m}</option>)}
                                                        </select>
                                                        <select className="sid-auth-input sid-auth-ampm" value={time.ampm} onChange={e => setTime({ ...time, ampm: e.target.value })}>
                                                            <option value="AM">AM</option>
                                                            <option value="PM">PM</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Preferences card */}
                        {/* <div className={`sid-section ${!isSchedulingEnabled ? 'sid-disabled' : ''}`}>
                            <div className="sid-addon-row">
                                <span className="sid-addon-label"><FiBell size={13} /> Send Reminder</span>
                                <input
                                    className="form-check-input m-0"
                                    type="checkbox"
                                    role="switch"
                                    checked={sendReminder}
                                    onChange={() => setSendReminder(p => !p)}
                                    style={{ width: 32, height: 16, cursor: 'pointer' }}
                                />
                            </div>
                        </div> */}
                    </div>

                    {/* ─ Preview panel — uses the exact same JobOverviewCard as PostedJobs ─ */}
                    <div className="sid-preview-panel hide-scrollbar">
                        <div className="sid-preview-header">
                            <h3 className="sid-preview-title">Job Overview</h3>
                            <button
                                style={{ background: '#f1f5f9', border: 'none', width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b', flexShrink: 0 }}
                                onClick={() => setIsJobPreviewExpanded(false)}
                            >
                                <FiX size={15} />
                            </button>
                        </div>

                        {selectedJob
                            ? (
                                /* Render the same JobOverviewCard used in TalentPool — expanded always here */
                                <JobOverviewCard
                                    job={selectedJob}
                                    isExpanded={true}
                                    onToggle={() => { }}
                                    hideShare={true}
                                />
                            )
                            : (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', color: '#94a3b8', textAlign: 'center', gap: 12 }}>
                                    <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <BsBuilding size={22} color="#94a3b8" />
                                    </div>
                                    <p style={{ fontSize: 13, fontWeight: 600, margin: 0, color: '#64748b' }}>No job selected</p>
                                    <p style={{ fontSize: 12, margin: 0 }}>Select a job above to preview its details here.</p>
                                </div>
                            )
                        }
                    </div>
                </div>

                {/* ── Footer (matches attached image) ── */}
                <div className="sid-footer">
                    <div className="sid-footer-left">

                        {/* Mini calendar icon */}
                        <div className="sid-footer-calendar-icon">
                            <div className="sid-footer-cal-top">{footerDay}</div>
                            <div className="sid-footer-cal-bottom">{footerDate}</div>
                        </div>

                        <div className="sid-footer-meta">
                            {/* Time + badge row */}
                            <div className="sid-footer-time-row">
                                <span className="sid-footer-time-text">{formattedRange}</span>
                                <span className="sid-footer-badge">
                                    ● Scheduling
                                </span>
                            </div>

                            {/* Candidate role sub-row */}
                            <div className="sid-footer-sub-row">
                                {selectedCandidate
                                    ? (
                                        <>
                                            <AvatarOrInitials src={selectedCandidate.avatar} name={selectedCandidate.name} size={16} bg="#3b82f6" />
                                            <span style={{ fontWeight: 600, color: '#334155' }}>{selectedCandidate.name}</span>
                                            <span style={{ color: '#cbd5e1' }}>·</span>
                                            <span>{selectedCandidate.role}</span>
                                        </>
                                    )
                                    : <span style={{ fontStyle: 'italic', color: '#94a3b8' }}>No candidate selected</span>
                                }
                            </div>
                        </div>
                    </div>

                    {/* Right side: recruiter block + finalize */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                        {/* Recruiter / logged-in user with real photo */}
                        <div className="sid-footer-recruiter">
                            {recruiterPhoto ? (
                                <img
                                    src={recruiterPhoto}
                                    alt={userName}
                                    className="sid-footer-rec-photo"
                                />
                            ) : (
                                <div className="sid-footer-rec-avatar">
                                    {getInitials(userName)}
                                </div>
                            )}
                            <div className="sid-footer-rec-info">
                                <span className="sid-footer-rec-name">{userName}</span>
                                <span className="sid-footer-rec-role">
                                    {userRole === "Recruiter"
                                        ? "Hiring Manager"
                                        : userRole === "Recruiter2"
                                            ? "Recruiter"
                                            : userRole}
                                </span>
                            </div>
                        </div>

                        {/* Finalize button */}
                        <button
                            className="quick-create-btn"
                            onClick={handleFinalize}
                            disabled={isSubmitting || !isSchedulingEnabled}
                        >
                            {isSubmitting
                                ? <><span className="spinner-border spinner-border-sm" style={{ width: 13, height: 13, borderWidth: 2 }} /> Saving…</>
                                : 'Finalize Session'
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScheduleInterviewDrawer;
