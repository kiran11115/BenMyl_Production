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
    FiTrash2
} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { GiCheckMark } from "react-icons/gi";
import { FiCheckSquare, FiSquare } from "react-icons/fi";
import JobOverviewCard from "../TalentPool/JobOverviewCard";
import { useGetRecruiterProfileQuery } from "../../State-Management/Api/RecruiterProfileApiSlice";
import { useGetGroupedJobTitlesQuery } from "../../State-Management/Api/TalentPoolApiSlice";
import { ChevronRight, Home } from "lucide-react";
import ModuleHeader from "../Admin/Modules/ModuleHeader";
import { useShareMeetingLinkMutation } from "../../State-Management/Api/ScheduleInterviewApiSlice";

export default function InterviewDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const interview = location.state?.interview;

    const [isJobExpanded, setIsJobExpanded] = useState(true);
    const [meetingLinkInput, setMeetingLinkInput] = useState(interview?.meetingLink || "");
    const [addedPeople, setAddedPeople] = useState([]);
    const [newPersonEmail, setNewPersonEmail] = useState("");
    const [showEmailInput, setShowEmailInput] = useState(false);
    const userId = localStorage.getItem("CompanyId");

    const { data: fetchedJobs } = useGetGroupedJobTitlesQuery(userId, { skip: !userId });

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

    const userRole = localStorage.getItem("Role");
    const [shareMeetingLink, { isLoading: shareLoading }] = useShareMeetingLinkMutation();

    if (!activeInterview) {
        return (
            <div className="ui-page">
                <div className="ui-breadcrumbs">
                    <button className="link-button" onClick={() => {
                        const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
                        const targetPath = window.location.pathname.toLowerCase().startsWith('/admin') ? `${basePath}/admin-upcoming-interview` : `${basePath}/user-upcoming-interview`;
                        navigate(targetPath);
                    }}>
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

    console.log("interview:",activeInterview?.email);
    console.log("interview:",activeInterview?.role)

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

    const isUser = !window.location.pathname.toLowerCase().startsWith('/admin');
    const basePath = isUser ? '/User' : '/Admin';

    return (
        <div className="ui-page">
            <ModuleHeader
                breadcrumb="Interview Details"
                title="Interview Details"
                description="View and manage interview information"
                badgeText="Interview Insight"
                icon={FiUser}
                customBreadcrumbs={[
                    { label: "Dashboard", path: isUser ? '/user/user-dashboard' : '/Admin/overview-dashboard', icon: <Home size={14} /> },
                    { label: "Interviews", path: isUser ? '/user/user-upcoming-interview' : '/Admin/admin-upcoming-interview' }
                ]}
                actions={userRole === 'Benchsales' ? [] : [
                    {
                        label: "Reschedule Interview",
                        icon: <FiCalendar size={16} />,
                        type: "primary",
                        onClick: () => navigate(`${basePath}/user-schedule-interview`, { state: { interview: activeInterview, mode: 'reschedule' } })
                    }
                ]}
            />

            <div className="detail-view-container mt-4">
                <div className="detail-view-grid-premium">
                    {/* Left: Profile Card */}
                    <aside className="profile-card-premium">
                        {activeInterview.avatar ? (
                            <img src={activeInterview.avatar} alt={activeInterview.name} className="avatar-initials-premium" />
                        ) : (
                            <div className="avatar-initials-premium">
                                {getInitials(activeInterview.name)}
                            </div>
                        )}
                        <h2>{activeInterview.name}</h2>
                        <p className="role">{activeInterview.role}</p>

                        <div className="card-meta w-100 mt-4">
                            <div className="meta-row">
                                <FiCalendar size={14} />
                                <span>{activeInterview.dateLabel}</span>
                            </div>
                            <div className="meta-row">
                                <FiClock size={14} />
                                <span>{activeInterview.time}</span>
                            </div>
                            <div className="meta-row">
                                <FiMapPin size={14} />
                                <span>{activeInterview.location}</span>
                            </div>
                        </div>

                        <div className="skills-row mt-4 w-100 d-flex flex-wrap gap-2">
                            {activeInterview.skills.map(skill => (
                                <span key={skill} className="status-tag status-progress">{skill}</span>
                            ))}
                        </div>
                    </aside>

                    {/* Right: Collaboration Hub & Link */}
                    <section className="collaboration-hub-premium">
                        <div className="d-flex justify-content-between align-items-center">
                            <h3 className="hub-title">Collaboration Hub</h3>
                            <button
                                className="btn-details-outline w-50"
                                style={{ padding: '8px 16px' }}
                                onClick={() => setShowEmailInput(!showEmailInput)}
                            >
                                <FiPlus /> Add Participant
                            </button>
                        </div>

                        <div className="interviewer-info-premium">
                            {recruiterData.profilePhoto ? (
                                <img
                                    className="interviewer-avatar-premium"
                                    src={recruiterData.profilePhoto.startsWith("http") ? recruiterData.profilePhoto : `https://webapidev.benmyl.com/${recruiterData.profilePhoto}`}
                                    alt={recruiterData.name}
                                />
                            ) : (
                                <div className="avatar-initials-premium" style={{ width: '48px', height: '48px', borderRadius: '12px' }}>
                                    {getInitials(recruiterData.name)}
                                </div>
                            )}
                            <div className="interviewer-text">
                                <div className="name">{recruiterData.name}</div>
                                <div className="email">{recruiterData.email}</div>
                            </div>
                        </div>

                        <div className="share-group-premium">
                            <label className="info-label">Meeting Link</label>
                            <div className="share-input-wrapper">
                                <input
                                    type="text"
                                    placeholder="Paste meeting link here..."
                                    value={meetingLinkInput}
                                    onChange={(e) => setMeetingLinkInput(e.target.value)}
                                />
                                <button
                                    className="btn-share-premium"
                                    onClick={handleShare}
                                    disabled={shareLoading}
                                >
                                    <FiShare2 />

                                    {shareLoading ? "Sharing..." : "Share Now"}
                                </button>
                            </div>
                        </div>

                        {showEmailInput && (
                            <div className="share-group-premium" style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid var(--slate-200)' }}>
                                <label className="info-label">Add Recipient Email</label>
                                <div className="share-input-wrapper">
                                    <input
                                        type="email"
                                        placeholder="Enter email address..."
                                        value={newPersonEmail}
                                        onChange={(e) => setNewPersonEmail(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddPerson()}
                                    />
                                    <button className="btn-details-outline" onClick={handleAddPerson}>
                                        Add
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="recipients-group">
                            <label className="info-label mb-3 d-block">Shared With</label>
                            <div className="recipients-list-premium">
                                <div className="recipient-tag-premium highlight">
                                    {activeInterview.name} (Candidate)
                                </div>
                                {addedPeople.map((email, idx) => (
                                    <div key={idx} className="recipient-tag-premium">
                                        {email}
                                        <FiX size={14} style={{ cursor: 'pointer' }} onClick={() => handleRemovePerson(email)} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>

                <div className="job-overview-section-premium mt-5">
                    <div className="d-flex align-items-center gap-3 mb-4">
                        <div style={{ width: '4px', height: '24px', background: 'var(--primary)', borderRadius: '4px' }}></div>
                        <h3 className="hub-title">Job Position Overview</h3>
                    </div>
                    <JobOverviewCard
                        job={activeInterview.jobData}
                        isExpanded={isJobExpanded}
                        onToggle={() => setIsJobExpanded(!isJobExpanded)}
                    />
                </div>
            </div>
        </div>
    );
}
