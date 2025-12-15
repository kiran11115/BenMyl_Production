import React, { useState } from "react";
import { FiX, FiCopy, FiShare2, FiMapPin } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

// Imports
import { SubmissionErrorModal, SuccessModal } from "./Alterts";
import "./PostNewPositions.css";

export default function PreviewModal({ onClose, data }) {
    const navigate = useNavigate();

    // --- State: 'idle' | 'loading' | 'success' | 'error' ---
    const [status, setStatus] = useState("idle");

    // --- Handlers ---
    const handlePostJob = () => {
        setStatus("loading");

        // Simulate API call with 1 second delay
        setTimeout(() => {
            // TOGGLE THIS BOOLEAN to test the error screen
            const simulateError = false; 

            if (simulateError) {
                setStatus("error");
            } else {
                setStatus("success");
            }
        }, 1000);
    };

    const handleBackToDashboard = () => {
        navigate("/user/dashboard");
    };

    const handleRetry = () => {
        setStatus("idle");
    };

    // --- Render Alerts Conditionally ---
    
    if (status === "success") {
        return (
            <SuccessModal 
                onClose={onClose} 
                onNavigateBack={handleBackToDashboard} 
            />
        );
    }

    if (status === "error") {
        return (
            <SubmissionErrorModal 
                onClose={onClose} 
                onRetry={handleRetry} 
                onContactSupport={() => console.log("Support clicked")} 
            />
        );
    }

    // --- Default Data ---
    const {
        jobTitle = "Senior Frontend Developer",
        companyName = "TechStream Solutions",
        location = "San Francisco, CA",
        employmentType = "Full-time",
        workModel = "Hybrid (3 days onsite)",
        salaryMin, salaryMax, currency = "USD",
        description = "",
        department = "Engineering",
        experienceLevel = "4+ years",
        skills = [],
        educationLevel = "Bachelor's degree",
    } = data || {};

    const salaryDisplay = (salaryMin || salaryMax) 
        ? `${salaryMin || "—"} - ${salaryMax || "—"} ${currency}` 
        : "$120,000 - $150,000 /year";

    // --- Render Form Preview ---
    return (
        <div className="modal-overlay">
            <div className="modal-window" style={{ position: "relative" }}>
                
                {/* Preloader Overlay */}
                {status === "loading" && (
                    <div className="loading-overlay">
                        <div className="spinner"></div>
                        <div className="loading-text">Posting Job...</div>
                    </div>
                )}

                <button className="modal-close" onClick={onClose} disabled={status === "loading"}>
                    <FiX />
                </button>

                <div className="modal-inner">
                    <div className="modal-left">
                        <div className="modal-top-row">
                            <div className="modal-badge">TS</div>
                            <div>
                                <h2 className="modal-job-title">{jobTitle}</h2>
                                <div className="muted small">{companyName}</div>
                                <div className="modal-tags-row">
                                    <span className="tag small"><FiMapPin /> {location}</span>
                                    <span className="tag small">{employmentType}</span>
                                    <span className="tag small">{workModel}</span>
                                    <span className="tag small">{salaryDisplay}</span>
                                </div>
                            </div>
                        </div>

                        <hr className="modal-divider" />

                        <div className="req-grid">
                            <div><div className="req-label">Experience</div><div className="req-value">{experienceLevel}</div></div>
                            <div><div className="req-label">Department</div><div className="req-value">{department}</div></div>
                            <div><div className="req-label">Education</div><div className="req-value">{educationLevel}</div></div>
                        </div>

                        <h4 className="modal-subtitle" style={{ marginTop: "16px" }}>Skills</h4>
                        <div className="status-tag status-progress">
                            {skills.length ? skills.map((s) => <span key={s} className="status-tag status-progress">{s}</span>)
                                : <span className="muted small">No skills provided</span>}
                        </div>

                        <h4 className="modal-subtitle" style={{ marginTop: 18 }}>Job Description</h4>
                        <div className="modal-description">
                            {description || "No description provided."}
                        </div>
                    </div>

                    <aside className="modal-right">
                        <div className="share-card">
                            <h4 className="share-title">Share This Job</h4>
                            <div className="share-link">
                                <input readOnly value="https://example.com/jobs/job-id" />
                                <button className="icon-btn"><FiCopy /></button>
                            </div>
                            <button className="share-btn"><FiShare2 /> Share on LinkedIn</button>
                        </div>
                    </aside>
                </div>

                <div className="modal-actions-left gap-3" style={{ padding: "24px" }}>
                    <button className="btn-secondary" onClick={onClose} disabled={status === "loading"}>
                        Back to Edit
                    </button>
                    <button 
                        onClick={handlePostJob} 
                        className="btn-primary" 
                        style={{ width: "165px" }}
                        disabled={status === "loading"}
                    >
                        Post Job Now
                    </button>
                </div>
            </div>
        </div>
    );
}
