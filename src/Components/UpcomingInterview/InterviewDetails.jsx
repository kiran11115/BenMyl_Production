import React, { useState, useMemo } from "react";
import { toast } from "react-toastify";
import {
    FiCalendar,
    FiClock,
    FiUser,
    FiBriefcase,
    FiArrowLeft,
    FiShare2,
    FiExternalLink,
    FiMapPin,
    FiX,
    FiPlus,
    FiTrash2,
    FiVideo,
    FiMail,
    FiLayers
} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { GiCheckMark } from "react-icons/gi";
import { FiCheckSquare, FiSquare } from "react-icons/fi";
import JobOverviewCard from "../TalentPool/JobOverviewCard";
import { useGetRecruiterProfileQuery } from "../../State-Management/Api/RecruiterProfileApiSlice";
import { useGetGroupedJobTitlesQuery } from "../../State-Management/Api/TalentPoolApiSlice";
import { useShareMeetingLinkMutation } from "../../State-Management/Api/ScheduleInterviewApiSlice";
import "../UserProjects/JobOverview.css";
import "../UserProjects/Projects.css";

export default function InterviewDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const interview = location.state?.interview;

    const [isJobExpanded, setIsJobExpanded] = useState(true);
    const [meetingLinkInput, setMeetingLinkInput] = useState(
  interview?.meetingLink &&
  interview.meetingLink !== "null"
    ? interview.meetingLink
    : ""
);
    const [addedPeople, setAddedPeople] = useState([]);
    const [newPersonEmail, setNewPersonEmail] = useState("");
    const [showEmailInput, setShowEmailInput] = useState(false);
    const userId = localStorage.getItem("CompanyId");
    const userRole = localStorage.getItem("Role");
    const isBenchsales = userRole === 'Benchsales';
    const jobQueryUserId = isBenchsales && interview?.recruiterID ? interview.recruiterID : userId;

    const { data: fetchedJobs } = useGetGroupedJobTitlesQuery(jobQueryUserId, { skip: !jobQueryUserId });

    // Enrich interview data if description is missing
    const enrichedInterview = useMemo(() => {
        if (!interview) return null;
        if (interview.jobData?.description) return interview;

        const matchingJob = fetchedJobs?.find(j => j.jobTitle === interview.jobData?.title);
        if (matchingJob) {
            return {
                ...interview,
                jobData: {
                    ...interview.jobData,
                    description: matchingJob.jobDescription
                }
            };
        }
        return interview;
    }, [interview, fetchedJobs]);

    const activeInterview = enrichedInterview || interview;

    const { data: apiData } = useGetRecruiterProfileQuery(Number(userId), {
        skip: !userId,
    });

    const recruiterData = apiData ? {
        name: `${apiData.firstName || ""} ${apiData.lastName || ""}`.trim() || localStorage.getItem("UserName"),
        email: apiData.emailID || localStorage.getItem("Email"),
        profilePhoto: apiData.profilePhoto
    } : {
        name: localStorage.getItem("UserName") || "Recruiter",
        email: localStorage.getItem("Email") || "",
        profilePhoto: null
    };

    const [shareMeetingLink, { isLoading: shareLoading }] = useShareMeetingLinkMutation();

    if (!activeInterview) {
        return (
            <div className="jobs-container">
                <div className="hero-section-wrapper mb-4">
        <div className="hero-card ">
          <div className="hero-concentric-lines"></div>
          <div className="hero-ripple-pattern"></div>
          <div className="hero-circular-highlights"></div>
                    <div className="hero-left">
                        <div className="hero-pill">✦ Interview Insight</div>
                        <h1 className="job-posting-title">Interview Details</h1>
                    </div>
                    <div className="hero-buttons">
                        <button className="routine-btn" onClick={() => {
                            const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
                            navigate(window.location.pathname.toLowerCase().startsWith('/admin') ? `${basePath}/admin-upcoming-interview` : `${basePath}/user-upcoming-interview`);
                        }}>
                            <FiArrowLeft size={13} /> Back to Interviews
                        </button>
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
            <img src="/Images/Dashboard.png" alt="Dashboard Illustration" className="hero-svg-image" />
          </div>
        </div>
      </div>
                <div className="card-base" style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
                    No interview data found.
                </div>
            </div>
        );
    }

    const getInitials = (name = "") => {
        return name
            .trim()
            .split(" ")
            .slice(0, 2)
            .map(word => word[0]?.toUpperCase())
            .join("");
    };

    console.log("interview:", activeInterview?.email);
    console.log("interview:", activeInterview?.role)

    const handleShare = async () => {
        if (!meetingLinkInput) {
            toast.error("Please provide a meeting link before sharing.");
            return;
        }

        try {
            const payload = {
                candidateId: activeInterview?.id || 0,
                candidateEmail: activeInterview?.email || "",
                candidateName: activeInterview?.name || "",

                recruiterID: String(userId),
                recruiterEmail: recruiterData?.email || "",
                recruiterName: recruiterData?.name || "",

                companyName: activeInterview?.vendorName || "",

                meetingLink: meetingLinkInput,

                jobTitle: activeInterview?.jobData?.title || "",

                time: `${activeInterview?.dateLabel || ""} ${activeInterview?.time || ""}`,

                interviewerName: recruiterData?.name || "",

                recipientEmails: addedPeople || [],
            };

            const response = await shareMeetingLink(payload).unwrap();

            toast.success(
                response?.message ||
                "Meeting link shared successfully!"
            );

            navigate(
                localStorage.getItem("Role") === "Admin"
                    ? "/Admin/admin-upcoming-interview"
                    : "/user/user-upcoming-interview"
            );


        } catch (error) {
            console.error(error);

            toast.error(
                error?.data?.message ||
                "Failed to share meeting link"
            );
        }
    };

    const handleAddPerson = () => {
        if (!newPersonEmail) return;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newPersonEmail)) {
            toast.error("Please enter a valid email address.");
            return;
        }
        if (addedPeople.includes(newPersonEmail)) {
            toast.warning("This email is already added.");
            return;
        }
        setAddedPeople([...addedPeople, newPersonEmail]);
        setNewPersonEmail("");
        setShowEmailInput(false);
    };

    const handleRemovePerson = (email) => {
        setAddedPeople(addedPeople.filter(p => p !== email));
    };

    const statusColor = {
        scheduled: { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
        completed: { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
        cancelled: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
    }[activeInterview.status?.toLowerCase()] || { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' };

    return (
        <div className="jobs-container">

            {/* ── Hero Header (matches all other pages) ── */}
            <div className="hero-section-wrapper mb-4">
        <div className="hero-card ">
          <div className="hero-concentric-lines"></div>
          <div className="hero-ripple-pattern"></div>
          <div className="hero-circular-highlights"></div>
                <div className="hero-left">
                    <div className="hero-pill">✦ Interview Insight</div>
                    <h1 className="job-posting-title">{activeInterview.name}</h1>
                    <p className="job-posting-subtitle">
                        {activeInterview.role}&nbsp;·&nbsp;{activeInterview.vendorName}
                    </p>
                    <div style={{ marginTop: '10px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>
                            <FiCalendar size={12} /> {activeInterview.dateLabel}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>
                            <FiClock size={12} /> {activeInterview.time}
                        </span>
                        <span style={{
                            background: 'rgba(255,255,255,0.15)',
                            border: '1px solid rgba(255,255,255,0.25)',
                            color: '#fff',
                            fontSize: '10px', fontWeight: 700,
                            padding: '3px 10px', borderRadius: '20px',
                            letterSpacing: '0.05em', textTransform: 'uppercase'
                        }}>
                            {activeInterview.status || 'SCHEDULED'}
                        </span>
                    </div>
                </div>

                <div className="hero-buttons">
                    <button
                        className="routine-btn"
                        onClick={() => {
                            const path = window.location.pathname.toLowerCase().startsWith('/admin')
                                ? '/Admin/admin-upcoming-interview'
                                : '/user/user-upcoming-interview';
                            navigate(path);
                        }}
                    >
                        <FiArrowLeft size={13} /> Back to Interviews
                    </button>
                    <button
  className="routine-btn-2"
  onClick={() => {
    const link = activeInterview?.meetingLink;

    if (!link || link === "null") {
      toast.warning(
        "Meeting link is not available. Please share the meeting link below."
      );
      return;
    }

    window.open(link, "_blank", "noopener,noreferrer");
  }}
>
  <FiVideo size={13} /> Join Meeting
</button>
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
            <img src="/Images/Dashboard.png" alt="Dashboard Illustration" className="hero-svg-image" />
          </div>
        </div>
      </div>

            {/* ── Dashboard Layout (mirrors JobOverview.jsx) ── */}
            <div className="dashboard-layout">

                {/* ── LEFT: Main Content ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* Candidate Card */}
                    <div className="card-base">
                        <div className="job-card-top">
                            {/* Avatar */}
                            {activeInterview.avatar ? (
                                <img
                                    src={activeInterview.avatar}
                                    alt={activeInterview.name}
                                    style={{ width: 56, height: 56, borderRadius: 14, objectFit: 'cover', border: '1px solid #e2e8f0', flexShrink: 0 }}
                                />
                            ) : (
                                <div className="company-icon-box large" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#fff', fontSize: 20, fontWeight: 700 }}>
                                    {getInitials(activeInterview.name)}
                                </div>
                            )}

                            <div className="job-header-info" style={{ flex: 1 }}>
                                <h3 className="job-title">{activeInterview.name}</h3>
                                <p className="company-name">{activeInterview.role}</p>
                                <div className="d-flex gap-3" style={{ flexWrap: 'wrap' }}>
                                    {activeInterview.vendorName && (
                                        <div className="meta-item">
                                            <FiBriefcase size={12} />
                                            {activeInterview.vendorName}
                                        </div>
                                    )}
                                    {activeInterview.location && (
                                        <div className="meta-item">
                                            <FiMapPin size={12} />
                                            {activeInterview.location}
                                        </div>
                                    )}
                                    {/* {activeInterview.email && (
                                        <div className="meta-item text-indigo">
                                            <FiMail size={12} />
                                            {activeInterview.email}
                                        </div>
                                    )} */}
                                </div>
                            </div>

                            {/* Status badge */}
                            <span style={{
                                background: statusColor.bg,
                                color: statusColor.color,
                                border: `1px solid ${statusColor.border}`,
                                fontSize: '11px', fontWeight: 700,
                                padding: '5px 14px', borderRadius: '20px',
                                letterSpacing: '0.04em', textTransform: 'uppercase',
                                flexShrink: 0, alignSelf: 'flex-start'
                            }}>
                                {activeInterview.status || 'Scheduled'}
                            </span>
                        </div>

                        {/* Stats Grid */}
                        <div className="drawer-stats">
                            <div className="drawer-stat-item">
                                <span className="label">Date</span>
                                <span className="value">{activeInterview.dateLabel || '—'}</span>
                            </div>
                            <div className="drawer-stat-item">
                                <span className="label">Time</span>
                                <span className="value">{activeInterview.time || '—'}</span>
                            </div>
                            <div className="drawer-stat-item">
                                <span className="label">Job Role</span>
                                <span className="value">{activeInterview.jobData?.title || activeInterview.role || '—'}</span>
                            </div>
                            <div className="drawer-stat-item">
                                <span className="label">Vendor</span>
                                <span className="value">{activeInterview.vendorName || '—'}</span>
                            </div>
                        </div>

                        {/* Skills */}
                        {activeInterview.skills && activeInterview.skills.length > 0 && (
                            <div className="drawer-section">
                                <h4><FiLayers size={13} /> Key Expertise</h4>
                                <div className="skills-cloud">
                                    {activeInterview.skills.map((skill, idx) => {
                                        const colors = ['orange', 'purple', 'mint', 'green', 'pink', 'blue'];
                                        return (
                                            <span key={skill} className={`job-chip ${colors[idx % colors.length]}`}>
                                                {skill}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Job Position Overview */}
                    {activeInterview.jobData && (
                        <div className="card-base" style={{ padding: 0, overflow: 'hidden' }}>
                            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 4, height: 20, background: '#4f46e5', borderRadius: 4 }} />
                                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#0f172a' }}>Job Position Overview</h3>
                            </div>
                            <div style={{ padding: '24px' }}>
                                <JobOverviewCard
                                    job={activeInterview.jobData}
                                    isExpanded={isJobExpanded}
                                    onToggle={() => setIsJobExpanded(!isJobExpanded)}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* ── RIGHT: Sidebar ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* Interviewer Card */}
                    <div className="card-base">
                        <h4 style={{ margin: '0 0 16px', fontSize: 13, fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <FiUser size={14} style={{ color: '#4f46e5' }} /> Created by
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            {recruiterData.profilePhoto ? (
                                <img
                                    src={recruiterData.profilePhoto.startsWith("http") ? recruiterData.profilePhoto : `https://webapidev.benmyl.com/${recruiterData.profilePhoto}`}
                                    alt={recruiterData.name}
                                    style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' }}
                                />
                            ) : (
                                <div style={{
                                    width: 44, height: 44, borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #1e293b, #334155)',
                                    color: '#fff', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', fontWeight: 700, fontSize: 16, flexShrink: 0
                                }}>
                                    {getInitials(recruiterData.name)}
                                </div>
                            )}
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{recruiterData.name}</div>
                                <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{recruiterData.email}</div>
                            </div>
                        </div>
                    </div>

                    {/* Meeting Link Card */}
                    <div className="card-base">
                        <h4 style={{ margin: '0 0 16px', fontSize: 13, fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <FiVideo size={14} style={{ color: '#4f46e5' }} /> Meeting Link
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <input
                                type="text"
                                placeholder="Paste meeting link here..."
                                value={meetingLinkInput}
                                onChange={(e) => setMeetingLinkInput(e.target.value)}
                                style={{
                                    width: '100%', padding: '10px 12px',
                                    border: '1px solid #e2e8f0', borderRadius: 10,
                                    fontSize: 12, color: '#0f172a', outline: 'none',
                                    background: '#f8fafc', boxSizing: 'border-box'
                                }}
                            />
                            <button
                                onClick={handleShare}
                                disabled={shareLoading}
                                className="routine-btn-2"
                                style={{ width: '100%', justifyContent: 'center', gap: 6 }}
                            >
                                <FiShare2 size={13} />
                                {shareLoading ? "Sharing..." : "Share Meeting Link"}
                            </button>
                        </div>
                    </div>

                    {/* Participants Card */}
                    <div className="card-base">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <h4 style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <FiMail size={14} style={{ color: '#4f46e5' }} /> Shared With
                            </h4>
                            <button
                                onClick={() => setShowEmailInput(!showEmailInput)}
                                style={{
                                    background: '#f1f5f9', border: '1px solid #e2e8f0',
                                    borderRadius: 8, padding: '5px 10px',
                                    fontSize: 11, fontWeight: 600, color: '#334155',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5
                                }}
                            >
                                <FiPlus size={12} /> Add
                            </button>
                        </div>

                        {/* Add email input */}
                        {showEmailInput && (
                            <div style={{ marginBottom: 12, display: 'flex', gap: 8 }}>
                                <input
                                    type="email"
                                    placeholder="Enter email..."
                                    value={newPersonEmail}
                                    onChange={(e) => setNewPersonEmail(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddPerson()}
                                    style={{
                                        flex: 1, padding: '8px 10px',
                                        border: '1px solid #e2e8f0', borderRadius: 8,
                                        fontSize: 12, outline: 'none', background: '#f8fafc'
                                    }}
                                />
                                <button
                                    onClick={handleAddPerson}
                                    className="routine-btn-2"
                                    style={{ flexShrink: 0, padding: '0 12px' }}
                                >
                                    Add
                                </button>
                            </div>
                        )}

                        {/* Recipients list */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {/* Candidate — always first */}
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                background: '#eff6ff', border: '1px solid #bfdbfe',
                                borderRadius: 10, padding: '8px 12px'
                            }}>
                                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                                    {getInitials(activeInterview.name)}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 12, fontWeight: 700, color: '#1d4ed8' }}>{activeInterview.name}</div>
                                    <div style={{ fontSize: 10, color: '#3b82f6' }}>Candidate</div>
                                </div>
                            </div>

                            {addedPeople.map((email, idx) => (
                                <div key={idx} style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    background: '#f8fafc', border: '1px solid #e2e8f0',
                                    borderRadius: 10, padding: '8px 12px'
                                }}>
                                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#e2e8f0', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                                        {email[0]?.toUpperCase()}
                                    </div>
                                    <div style={{ flex: 1, fontSize: 12, color: '#334155', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {email}
                                    </div>
                                    <button
                                        onClick={() => handleRemovePerson(email)}
                                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 2, display: 'flex', flexShrink: 0 }}
                                    >
                                        <FiX size={13} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
