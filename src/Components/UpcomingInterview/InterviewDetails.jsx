import React, { useState } from "react";
import {
    FiCalendar,
    FiClock,
    FiUser,
    FiBriefcase,
    FiArrowLeft,
    FiShare2,
    FiExternalLink,
    FiMapPin,
    FiStar,
    FiX
} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { GiCheckMark } from "react-icons/gi";
import { FiCheckSquare, FiSquare } from "react-icons/fi";
import JobOverviewCard from "../TalentPool/JobOverviewCard";
import { useGetRecruiterProfileQuery } from "../../State-Management/Api/RecruiterProfileApiSlice";

export default function InterviewDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const interview = location.state?.interview;

    const [isJobExpanded, setIsJobExpanded] = useState(true);
    const [meetingLinkInput, setMeetingLinkInput] = useState(interview?.meetingLink || "");

    const userId = localStorage.getItem("CompanyId");
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

    if (!interview) {
        return (
            <div className="ui-page">
                <div className="ui-breadcrumbs">
                    <button className="link-button" onClick={() => navigate("/user/user-upcoming-interview")}>
                        <FiArrowLeft /> Back to Interviews
                    </button>
                </div>
                <div className="no-data">No interview data found.</div>
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

    const handleShare = () => {
        if (!meetingLinkInput) {
            alert("Please provide a meeting link before sharing.");
            return;
        }
        alert(`Meeting link has been sent to ${interview.name}'s email successfully!`);
    };

    return (
        <div className="ui-page">
            <div className="profile-breadcrumb d-flex gap-1 mb-4">
                <button className="link-button" onClick={() => navigate("/user/user-dashboard")}>
                    Dashboard
                </button>
                <button className="link-button" onClick={() => navigate("/user/user-upcoming-interview")}>
                    / Upcoming Interviews
                </button>
                <span className="crumb">/ Interview Details</span>
            </div>

            <div className="detail-view-container">
                <div className="detail-card">
                    <div className="detail-header">
                        <div>
                            <h1 className="ui-title">Interview Details</h1>
                            <p className="ui-sub">View and manage interview information</p>
                        </div>
                        <div className="detail-actions">
                            <button
                                className="btn-secondary d-flex align-items-center gap-2 w-100"
                                style={{ padding: '8px 20px', borderRadius: '8px', border: '1px solid var(--slate-200)', background: 'white', color: 'var(--slate-800)', fontWeight: 600, fontSize: '14px' }}
                                onClick={() => navigate("/user/user-schedule-interview", { state: { interview, mode: 'reschedule' } })}
                            >
                                <FiCalendar /> Reschedule Interview
                            </button>
                        </div>
                    </div>

                    <div className="detail-grid-v2">
                        {/* Row 1: Candidate Card | Checklist | Interviewer */}
                        <div className="candidate-full-card small-variant">
                            <article className="project-card d-flex flex-column gap-3">
                                <div className="card-header position-relative">
                                    <div className="d-flex gap-3 align-items-center">
                                        {interview.avatar ? (
                                            <img src={interview.avatar} alt={interview.name} className="avatar main-avatar-large" />
                                        ) : (
                                            <div className="initials-avatar int-avatar-large">
                                                {getInitials(interview.name)}
                                            </div>
                                        )}
                                        <div className="header-info">
                                            <div className="name-row">
                                                <h2 className="name">
                                                    {interview.name} {interview.verified && (<GiCheckMark size={16} color="#059669" />)}
                                                </h2>
                                            </div>
                                            <div className="role-large">{interview.role}</div>
                                        </div>
                                    </div>
                                    <div className="rating-large corner-rating">
                                        <FiStar fill="#f59e0b" color="#f59e0b" />
                                        <span>{interview.rating}</span>
                                    </div>
                                </div>

                                <div className="meta-grid detailed-meta">
                                    <div className="meta-item">
                                        <FiCalendar /> <span>{interview.dateLabel}</span>
                                    </div>
                                    <div className="meta-item">
                                        <FiClock /> <span>{interview.time}</span>
                                    </div>
                                    <div className="meta-item">
                                        <FiBriefcase /> <span>{interview.experience} Exp</span>
                                    </div>
                                    <div className="meta-item">
                                        <FiMapPin /> <span>{interview.location}</span>
                                    </div>
                                </div>

                                <div className="skills-row expanded-skills">
                                    {interview.skills.slice(0, 3).map(skill => (
                                        <span key={skill} className="status-tag status-progress">{skill}</span>
                                    ))}
                                </div>
                            </article>
                        </div>

                        {/* Prep Checklist */}
                        <div className="checklist-container">

                            <div className="link-section-card h-100" style={{ borderRadius: '12px', border: '1px solid var(--slate-200)' }}>
                                <h3 className="section-title">B2B Prep Checklist</h3>
                                <div className="prep-checklist">
                                    {[
                                        "Resume shared?",
                                        "Partner pre-screen?",
                                        "Room instructions?",
                                        "Candidate ready?",
                                        "Vendor check clear?"
                                    ].map((item, idx) => (
                                        <label key={idx} className="checklist-item d-flex align-items-center gap-3 mb-2" style={{ cursor: 'pointer' }}>
                                            <input type="checkbox" className="custom-checkbox" style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }} />
                                            <span className="checkbox-label" style={{ fontSize: '13px', color: 'var(--slate-600)' }}>{item}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="interviewer-column-side">
                            <div className="link-section-card h-100" style={{ borderRadius: '12px', border: '1px solid var(--slate-200)', padding: '16px' }}>
                                <h3 className="section-title">Interviewer & Link</h3>
                                <div className="d-flex align-items-center gap-3 mb-3">
                                    {recruiterData.profilePhoto ? (
                                        <img
                                            className="int-avatar-small"
                                            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                                            src={recruiterData.profilePhoto.startsWith("http") ? recruiterData.profilePhoto : `https://webapidev.benmyl.com/${recruiterData.profilePhoto}`}
                                            alt={recruiterData.name}
                                        />
                                    ) : (
                                        <div className="int-avatar-small initials-avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', fontSize: '14px' }}>
                                            {getInitials(recruiterData.name)}
                                        </div>
                                    )}
                                    <div className="int-info">
                                        <div className="int-name-small fw-bold" style={{ fontSize: '14px' }}>{recruiterData.name}</div>
                                        <div className="int-email-small" style={{ fontSize: '11px' }}>{recruiterData.email}</div>
                                    </div>
                                </div>

                                <div className="link-section-mini">
                                    <div className="input-wrapper-ui mb-2">
                                        <input
                                            type="text"
                                            className="meeting-input w-100"
                                            style={{ padding: '8px 12px', fontSize: '13px', borderRadius: '8px' }}
                                            placeholder="Meeting link..."
                                            value={meetingLinkInput}
                                            onChange={(e) => setMeetingLinkInput(e.target.value)}
                                        />
                                    </div>
                                    <button className="share-btn w-100" style={{ padding: '8px', fontSize: '13px', borderRadius: '8px' }} onClick={handleShare}>
                                        <FiShare2 /> Share Link
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Job Overview | Feedback */}
                    <div className="detail-grid-bottom">
                        <div className="job-overview-column">
                            <h3 className="section-title">Job Overview</h3>
                            <JobOverviewCard
                                job={interview.jobData}
                                isExpanded={isJobExpanded}
                                onToggle={() => setIsJobExpanded(!isJobExpanded)}
                            />
                        </div>

                        <div className="feedback-container">
                            <h3 className="section-title">Interview Feedback Loop</h3>
                            <div className="feedback-card link-section-card" style={{ borderRadius: '12px', border: '1px solid var(--slate-200)' }}>
                                <div className="feedback-tabs d-flex gap-4 mb-3" style={{ borderBottom: '1px solid var(--slate-100)' }}>
                                    <button className="fb-tab active" style={{ pb: '8px', borderBottom: '2px solid var(--primary)', color: 'var(--primary)', fontWeight: 700, border: 'none', background: 'none' }}>Client Feedback</button>
                                    <button className="fb-tab" style={{ pb: '8px', border: 'none', background: 'none', color: 'var(--slate-400)', fontWeight: 600 }}>Vendor Notes</button>
                                </div>

                                <div className="feedback-content">
                                    <div className="mb-3">
                                        <label className="form-label d-block mb-1 fw-bold small text-uppercase" style={{ color: 'var(--slate-500)', fontSize: '10px' }}>Fit Rating</label>
                                        <div className="d-flex gap-1">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <FiStar key={star} size={16} color={star <= Math.floor(interview.rating) ? "#f59e0b" : "#e2e8f0"} fill={star <= Math.floor(interview.rating) ? "#f59e0b" : "none"} />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label d-block mb-1 fw-bold small text-uppercase" style={{ color: 'var(--slate-500)', fontSize: '10px' }}>Assessment Notes</label>
                                        <textarea className="form-input w-100" style={{ minHeight: '80px', padding: '10px', borderRadius: '8px', border: '1px solid var(--slate-200)', resize: 'none', fontSize: '13px' }} placeholder="Enter notes..."></textarea>
                                    </div>
                                    <div className="d-flex justify-content-end">
                                        <button className="btn-primary" style={{ padding: '8px 20px', borderRadius: '8px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: 700, fontSize: '13px' }}>Save Feedback</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
