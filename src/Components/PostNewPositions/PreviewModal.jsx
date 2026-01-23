import React, { useState } from "react";
import {
  FiX,
  FiCopy,
  FiMapPin,
  FiLinkedin,
  FiFacebook,
  FiMail,
  FiChevronDown,
  FiChevronUp
} from "react-icons/fi";
import { FaPuzzlePiece } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Alerts
import { SubmissionErrorModal, SuccessModal } from "./Alterts";
import "./PostNewPositions.css";

export default function PreviewModal({ onClose, data, onPostJob }) {
  const navigate = useNavigate();

  /* =========================
     STATE
  ========================= */
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [isVendorOpen, setIsVendorOpen] = useState(true);

  /* =========================
     HANDLERS
  ========================= */
  const handlePostJob = async () => {
    try {
      setStatus("loading");

      // ✅ REAL API CALL (FROM PARENT)
      await onPostJob();

      // ✅ SHOW SUCCESS ALERT
      setStatus("success");
    } catch (error) {
      console.error("Post Job Failed:", error);
      setStatus("error");
    }
  };

  const handleRetry = () => {
    setStatus("idle");
  };

  const toggleVendorSection = () => {
    setIsVendorOpen(!isVendorOpen);
  };

  /* =========================
     ALERT SCREENS
  ========================= */
  if (status === "success") {
    return <SuccessModal onClose={onClose} />;
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

  /* =========================
     DATA
  ========================= */
  const {
    jobTitle = "Senior Frontend Developer",
    companyName = "TechStream Solutions",
    location = "San Francisco, CA",
    employmentType = "Full-time",
    workModel = "Hybrid (3 days onsite)",
    salaryMin,
    salaryMax,
    currency = "USD",
    description = "",
    department = "Engineering",
    experienceLevel = "4+ years",
    skills = [],
    educationLevel = "Bachelor's degree"
  } = data || {};

  const salaryDisplay =
    salaryMin || salaryMax
      ? `${salaryMin || "—"} - ${salaryMax || "—"} ${currency}`
      : "$120,000 - $150,000 /year";

  /* =========================
     UI
  ========================= */
  return (
    <div className="modal-overlay">
      <div className="modal-window" style={{ position: "relative" }}>

        {/* LOADING OVERLAY */}
        {status === "loading" && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <div className="loading-text">Posting Job...</div>
          </div>
        )}

        <button
          className="modal-close"
          onClick={onClose}
          disabled={status === "loading"}
        >
          <FiX />
        </button>

        <div className="modal-inner">
          {/* LEFT SIDE */}
          <div className="modal-left">
            <div className="modal-top-row">
              <div className="modal-badge">TS</div>

              <div>
                <h2 className="modal-job-title">{jobTitle}</h2>
                <div className="muted small">{companyName}</div>

                <div className="modal-tags-row">
                  <span className="tag small">
                    <FiMapPin /> {location}
                  </span>
                  <span className="tag small">{employmentType}</span>
                  <span className="tag small">{workModel}</span>
                  <span className="tag small">{salaryDisplay}</span>
                </div>
              </div>
            </div>

            <hr className="modal-divider" />

            <div className="req-grid">
              <div>
                <div className="req-label">Experience</div>
                <div className="req-value">{experienceLevel}</div>
              </div>
              <div>
                <div className="req-label">Department</div>
                <div className="req-value">{department}</div>
              </div>
              <div>
                <div className="req-label">Education</div>
                <div className="req-value">{educationLevel}</div>
              </div>
            </div>

            <h4 className="modal-subtitle" style={{ marginTop: 16 }}>
              Skills
            </h4>

            <div className="status-tag status-progress">
              {skills.length ? (
                skills.map((skill) => (
                  <span key={skill} className="status-tag status-progress">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="muted small">No skills provided</span>
              )}
            </div>

            <h4 className="modal-subtitle" style={{ marginTop: 18 }}>
              Job Description
            </h4>

            <div className="modal-description">
              {description || "No description provided."}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <aside className="modal-right">
            <div className="share-card">
              <h4 className="share-title">Share This Job</h4>

              <div className="share-input-group">
                <label className="input-label">Job Link</label>
                <div className="share-link-row">
                  <input
                    className="share-input"
                    readOnly
                    value={`https://techstream.jobs/${jobTitle
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  />
                  <button className="copy-btn">
                    <FiCopy /> Copy
                  </button>
                </div>
              </div>

              <div className="social-buttons-stack">
                <button className="social-btn linkedin">
                  <FiLinkedin /> Share on LinkedIn
                </button>
                <button className="social-btn facebook">
                  <FiFacebook /> Share on Facebook
                </button>
                <button className="social-btn email">
                  <FiMail /> Share via Email
                </button>
              </div>

              <div className="vendor-section">
                <button className="vendor-header" onClick={toggleVendorSection}>
                  <div className="vendor-header-left">
                    <FaPuzzlePiece className="puzzle-icon" />
                    <span>Share with</span>
                  </div>
                  {isVendorOpen ? <FiChevronUp /> : <FiChevronDown />}
                </button>

                {isVendorOpen && (
                  <div className="vendor-list">
                    <label className="checkbox-row">
                      <input type="checkbox" /> Premier Staffing Agency
                    </label>
                    <label className="checkbox-row">
                      <input type="checkbox" defaultChecked /> Tech Talent Finders
                    </label>
                    <label className="checkbox-row">
                      <input type="checkbox" defaultChecked /> DevHunters
                    </label>
                    <label className="checkbox-row">
                      <input type="checkbox" /> CodeSeeker Recruiting
                    </label>
                    <label className="checkbox-row">
                      <input type="checkbox" defaultChecked /> Elite Tech Staffing
                    </label>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="modal-actions-left gap-3" style={{ padding: 24 }}>
          <button
            className="btn-secondary"
            onClick={onClose}
            disabled={status === "loading"}
          >
            Back to Edit
          </button>

          <button
            className="btn-primary"
            style={{ width: 165 }}
            onClick={handlePostJob}
            disabled={status === "loading"}
          >
            Post Job
          </button>
        </div>
      </div>
    </div>
  );
}
