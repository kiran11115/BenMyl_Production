import React, { useState, useMemo, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import {
  FiGrid,
  FiList,
  FiBriefcase,
  FiX,
  FiTrash2,
  FiLoader,
  FiCheck,
  FiCheckCircle,
  FiChevronDown,
  FiFilter,
  FiUsers,
  FiRefreshCw,
  FiArrowUp,
  FiMapPin,
  FiUser,
  FiEye,
} from "react-icons/fi";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { GiCheckMark } from "react-icons/gi";

import TalentGridView from "./TalentGrid";
import TalentTableView from "./TalentTable";
import "./TalentPool.css";
import "../UserJobs/Jobs.css";
import TalentFilters from "../Filters/TalentFilters";
import HorizontalTalentFilters from "../Filters/HorizontalTalentFilters";
import JobOverviewCard from "./JobOverviewCard";
import FilterBottomSheet from "../Common/FilterBottomSheet";
import { useGetGroupedJobTitlesQuery, useGetJobPostingINDQuery, useLazyGetJobByIdQuery, useLazyGetJobPostingINDByIdQuery, useSendInviteNotificationMutation, useTalentPoolMutation } from "../../State-Management/Api/TalentPoolApiSlice";
import { useGetCompanyListQuery } from "../../State-Management/Api/CompanyApiSlice";
import NoData from "../UploadTalent/NoData";
import { calculateTotalExperience } from "../../Utils/experienceUtils";
import { usePermissions } from "../Admin/Modules/RoleConfiguration/usePermissions";
import TalentResumeView from "./TalentResumeView";

// --- UTILS ---
const parseExperience = (expStr) => {
  const match = expStr.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

const getInitials = (name = "") => {
  return name
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
};

// --- SHORTLIST DRAWER (unchanged) ---
const ShortlistDrawer = ({ isOpen, onClose, shortlistedMap, onRemove, jobs, userId, refreshTalents, clearShortlistForJob, onInviteSuccess, onViewCandidateProfile, onOpenConfirmRemoveAll }) => {
  const [offerStatus, setOfferStatus] = useState({});
  const [openJobIds, setOpenJobIds] = useState({});
  const [sendInviteNotification] = useSendInviteNotificationMutation();

  const companyname = localStorage.getItem("CompanyName");
  const username = localStorage.getItem("UserName");

  const { hasPermission } = usePermissions();
  const canEdit = hasPermission("Talent Pool", "edit");

  const [isClosing, setIsClosing] = useState(false);

  const toggleJobAccordion = (jobId) => {
    setOpenJobIds((prev) => ({
      ...prev,
      [jobId]: prev[jobId] === undefined ? false : !prev[jobId],
    }));
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 280);
  };

  const handleRemoveAllClick = () => {
    onClose();
    if (onOpenConfirmRemoveAll) {
      onOpenConfirmRemoveAll();
    }
  };

  const handleSendInvite = async (jobId) => {
    setOfferStatus((prev) => ({ ...prev, [jobId]: "loading" }));

    try {
      const shortlistedCandidates = shortlistedMap[jobId] || [];
      if (!shortlistedCandidates.length) return;

      const userIds = shortlistedCandidates.map(
        (c) => Number(c.inviteUserId)
      );
      const selectedJob = jobs.find((j) => j.id === jobId);
      const usernames = shortlistedCandidates.map((c) => c.name);
      const employeeIds = shortlistedCandidates.map((c) => c.id);

      const payload = {
        userIds,
        usernames,
        employeeIds,
        message: "Your talent has been shortlisted. Please check your mailbox.",
        uatUserId: Number(userId),
        uatfirstName: username,
        companyName: companyname,
        jobid: selectedJob?.jobID,       
        jobName: selectedJob?.title,
      };

      await sendInviteNotification(payload).unwrap();

      setOfferStatus((prev) => ({ ...prev, [jobId]: "sent" }));
      clearShortlistForJob(jobId);
      await refreshTalents();
      onClose();
      if (onInviteSuccess) onInviteSuccess(selectedJob?.jobID,shortlistedCandidates[0]?.id);
    } catch (err) {
      console.error("Invite failed", err);
      setOfferStatus((prev) => ({ ...prev, [jobId]: "idle" }));
      toast.error("Failed to send invite");
    }
  };

  const hasAnyShortlistedCandidates = Object.values(shortlistedMap).some(
    (list) => Array.isArray(list) && list.length > 0
  );

  if (!isOpen && !isClosing) return null;

  return (
    <>
      <div
        className={`drawer-overlay ${isOpen && !isClosing ? "open" : ""} ${isClosing ? "closing" : ""}`}
        onClick={handleClose}
      />
      <div className={`drawer-panel ${isOpen && !isClosing ? "open" : ""}`} onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 className="drawer-header-title">
              <FiUsers size={16} color="#0f172a" style={{ marginRight: "4px" }} />
              Shortlisted Candidates
            </h2>
          </div>
          <button className="trv-close-btn" title="Close Shortlist" onClick={handleClose}>
            <FiX size={18} />
          </button>
        </div>

        <div className="drawer-content hide-scrollbar">
          {!hasAnyShortlistedCandidates ? (
            <div className="empty-state">No candidates shortlisted yet.</div>
          ) : (
            Object.keys(shortlistedMap).map((jobId) => {
              const job = jobs.find((j) => j.id === jobId);
              const candidates = shortlistedMap[jobId];
              if (!candidates || candidates.length === 0) return null;

              const currentStatus = offerStatus[jobId] || "idle";
              const isJobOpen = openJobIds[jobId] !== false;

              return (
                <div key={jobId} className={`job-group ${isJobOpen ? "open" : "collapsed"}`}>
                  <div
                    className="job-header"
                    style={{ borderLeft: `4px solid ${job?.color || '#5a5de8'}`, cursor: 'pointer', userSelect: 'none' }}
                    onClick={() => toggleJobAccordion(jobId)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                      <span className="job-title text-truncate">{job?.title || candidates[0]?.role || "Job Role"}</span>
                      <span className="job-count-badge-green">{candidates.length}</span>
                    </div>
                    <FiChevronDown
                      size={16}
                      style={{
                        transform: isJobOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                        color: "#64748b",
                        flexShrink: 0,
                      }}
                    />
                  </div>

                  <div className={`job-accordion-body ${isJobOpen ? "expanded" : "collapsed"}`}>
                    {candidates.map((cand) => (
                      <div key={cand.id} className="mini-card flex-column align-items-stretch gap-2">
                        <div className="d-flex align-items-center justify-content-between gap-2">
                          <div className="d-flex align-items-center gap-2" style={{ minWidth: 0, flex: 1 }}>
                            <div className="avatar-wrapper" style={{ position: "relative", flexShrink: 0 }}>
                              {cand.avatar ? (
                                <img src={cand.avatar} className="mini-avatar" alt={cand.name} />
                              ) : (
                                <div className="mini-avatar-initials">
                                  {getInitials(cand.name)}
                                </div>
                              )}
                              <div className="avatar-verified-badge">
                                <GiCheckMark size={7} color="#ffffff" />
                              </div>
                            </div>
                            <div className="mini-info" style={{ minWidth: 0 }}>
                              <h4 className="role mini-name text-truncate" style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>{cand.role}</h4>
                              <div className="company-loc-text mini-role text-truncate" style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '500' }}>
                                {cand.company && cand.company.toLowerCase() !== "benmyl" ? cand.company : "N/A"}
                              </div>
                            </div>
                          </div>

                          <button
                            className="remove-btn"
                            disabled={currentStatus !== "idle"}
                            onClick={() => onRemove(jobId, cand.id)}
                            title="Remove candidate"
                          >
                            <FiTrash2 size={13} />
                          </button>
                        </div>

                        {/* Details row: Location, Experience */}
                        <div className="mini-details-row d-flex flex-wrap align-items-center gap-2" style={{ fontSize: "11px", color: "#64748b" }}>
                          {cand.location && cand.location !== "-" && (
                            <span className="d-inline-flex align-items-center gap-1">
                              <FiMapPin size={11} color="#94a3b8" />
                              <span>{cand.location}</span>
                            </span>
                          )}
                          {cand.experience !== undefined && cand.experience !== null && String(cand.experience).trim() !== "" && (
                            <span className="d-inline-flex align-items-center gap-1">
                              <FiBriefcase size={11} color="#f5810c" />
                              <span>{cand.experience}{typeof cand.experience === 'number' || !isNaN(cand.experience) ? ' Yrs Exp' : ''}</span>
                            </span>
                          )}
                        </div>

                        {/* Skills chips */}
                        {cand.skills && cand.skills.length > 0 && (
                          <div className="mini-skills-row d-flex flex-wrap gap-1 mt-1">
                            {cand.skills.slice(0, 3).map((sk) => (
                              <span key={sk} className="job-chip" style={{ fontSize: '10px', padding: '2px 8px' }}>
                                {sk}
                              </span>
                            ))}
                            {cand.skills.length > 3 && (
                              <span className="job-chip more" style={{ fontSize: '10px', padding: '2px 6px' }}>
                                +{cand.skills.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Action row: View Profile button */}
                        <div className="d-flex justify-content-end mt-1 pt-1" style={{ borderTop: "1px solid #f1f5f9" }}>
                          <button
                            className="job-card-view-btn"
                            onClick={() => {
                              if (onViewCandidateProfile) onViewCandidateProfile(cand);
                            }}
                            style={{ padding: "4px 12px", fontSize: "10.5px", borderRadius: "6px" }}
                          >
                            <FiEye size={11} className="me-1" /> View Resume
                          </button>
                        </div>
                      </div>
                    ))}

                    <div className="job-footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginTop: '12px' }}>
                      <button
                        className="remove-all-btn"
                        onClick={handleRemoveAllClick}
                        title="Remove all shortlisted candidates"
                      >
                        <FiTrash2 size={12} style={{ marginRight: '4px' }} /> Remove All
                      </button>

                      {canEdit ? (
                        <button
                          className={`btn-v2-primary border-0 ${currentStatus === "sent" ? "sent" : ""}`}
                          onClick={() => handleSendInvite(jobId)}
                          disabled={currentStatus !== "idle"}
                          style={{ padding: "8px 18px", borderRadius: "8px" }}
                        >
                          {currentStatus === "loading" && (
                            <>
                              <FiLoader className="spin-icon me-1" /> Sending...
                            </>
                          )}
                          {currentStatus === "sent" && (
                            <>
                              <FiCheck className="me-1" /> Invite Sent
                            </>
                          )}
                          {currentStatus === "idle" && "Send Invite"}
                        </button>
                      ) : (
                        <div className="permission-denied-text" style={{ fontSize: '12px', color: '#ef4444', fontStyle: 'italic' }}>
                          No permission
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <style jsx>{`
        .drawer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(3px);
          z-index: 2000;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.28s ease;
          display: flex;
          justify-content: flex-end;
        }
        .drawer-overlay.open {
          opacity: 1;
          pointer-events: auto;
        }
        .drawer-overlay.closing {
          opacity: 0;
        }
        .drawer-panel {
          position: fixed;
          top: 0;
          right: 0;
          width: 20vw;
          min-width: 320px;
          max-width: 90vw;
          height: 100vh;
          background: #ffffff;
          z-index: 2001;
          transform: translateX(100%);
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: -10px 0 40px rgba(15, 23, 42, 0.12);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border-left: 1px solid #e2e8f0;
        }
        .drawer-panel.open {
          transform: translateX(0);
        }
        .job-accordion-body {
          max-height: 0;
          opacity: 0;
          overflow: hidden;
          transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
        }
        .job-accordion-body.expanded {
          max-height: 2500px;
          opacity: 1;
          margin-top: 10px;
        }
        .drawer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          flex-shrink: 0;
        }
        .drawer-header-title {
          margin: 0;
          font-size: 14.5px;
          font-weight: 700;
          color: #0f172a;
          display: flex;
          align-items: center;
        }
        .drawer-content {
          padding: 16px;
          flex: 1;
          overflow-y: auto;
          background: #fafafa;
        }
        .job-group {
          background: #ffffff;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          padding: 14px;
          margin-bottom: 14px;
          display: flex;
          flex-direction: column;
        }
        .job-header {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          padding: 10px 14px;
          margin-bottom: 0px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
          transition: all 0.25s ease;
        }
        .job-header:hover {
          border-color: #cbd5e1;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06);
          background: #ffffff;
        }
        .job-title {
          font-weight: 700;
          font-size: 13.5px;
          color: #0f172a;
          letter-spacing: -0.01em;
          text-transform: capitalize;
        }
        .job-count-badge-green {
          background: #10b981 !important;
          color: #ffffff !important;
          font-size: 11px !important;
          font-weight: 800 !important;
          padding: 2px 8px !important;
          border-radius: 9999px !important;
          box-shadow: 0 2px 6px rgba(16, 185, 129, 0.35) !important;
          line-height: 1 !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          flex-shrink: 0 !important;
        }
        .mini-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          background: #ffffff;
          margin-bottom: 8px;
          transition: all 0.2s ease;
        }
        .mini-card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 2px 8px rgba(0,0,0,0.03);
        }
        .mini-avatar, .mini-avatar-initials {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
        }
        .mini-avatar-initials {
          background: #1e293b;
          color: #ffffff;
          border: 1px solid #1e293b;
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .mini-info {
          flex: 1;
        }
        .mini-name {
          font-size: 13px;
          font-weight: 700;
          color: #1e293b;
        }
        .mini-role {
          font-size: 11px;
          color: #64748b;
          font-weight: 500;
        }
        .remove-btn {
          background: #fef2f2;
          border: none;
          color: #ef4444;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .remove-btn:hover:not(:disabled) {
          background: #fee2e2;
          color: #dc2626;
        }
        .remove-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .remove-all-btn {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .remove-all-btn:hover {
          background: #fee2e2;
          color: #b91c1c;
          border-color: #fca5a5;
        }
        .shortlist-confirm-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(15, 23, 42, 0.55);
          backdrop-filter: blur(4px);
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }
        .shortlist-confirm-modal {
          background: #ffffff;
          border-radius: 16px;
          width: 320px;
          padding: 24px;
          text-align: center;
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.2);
          animation: modalPop 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes modalPop {
          0% { transform: scale(0.92); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .scm-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #fef2f2;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 14px;
        }
        .scm-title {
          margin: 0 0 8px;
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
        }
        .scm-desc {
          margin: 0 0 20px;
          font-size: 12px;
          color: #64748b;
          line-height: 1.4;
        }
        .scm-actions {
          display: flex;
          gap: 10px;
        }
        .scm-btn {
          flex: 1;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .scm-btn.cancel {
          background: #f1f5f9;
          color: #475569;
        }
        .scm-btn.cancel:hover {
          background: #e2e8f0;
          color: #1e293b;
        }
        .scm-btn.confirm-danger {
          background: #ef4444;
          color: #ffffff;
        }
        .scm-btn.confirm-danger:hover {
          background: #dc2626;
        }
        .empty-state {
          color: #94a3b8;
          text-align: center;
          margin-top: 40px;
          font-size: 14px;
        }
        .job-footer {
          margin-top: 12px;
          display: flex;
          justify-content: flex-end;
        }
        .spin-icon {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          100% {
            transform: rotate(360deg);
          }
        }
        .hide-scrollbar::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
      `}</style>
    </>
  );
};

// --- JOB DETAILS DRAWER ---
const JobDetailsDrawer = ({ isOpen, onClose, allJobOverviewData }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 280);
  };

  if (!isOpen && !isClosing) return null;

  return (
    <>
      <div
        className={`drawer-overlay ${isOpen && !isClosing ? "open" : ""} ${isClosing ? "closing" : ""}`}
        onClick={handleClose}
      />
      <div className={`drawer-panel-right ${isOpen && !isClosing ? "open" : ""}`} onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h2 className="drawer-header-title">
            <FiBriefcase size={16} color="rgba(255,255,255,0.8)" style={{ marginRight: '8px' }} />
            Job Details Overview
          </h2>
          <button className="close-btn" onClick={handleClose}>
            <FiX size={18} />
          </button>
        </div>

        <div className="drawer-content hide-scrollbar">
          {allJobOverviewData.length === 0 ? (
            <div className="empty-state">No jobs selected to view details.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 16 }}>
              {allJobOverviewData.map((jobData) => (
                <JobOverviewCard
                  key={jobData.id}
                  job={jobData}
                  isExpanded={true}
                  onToggle={() => { }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .drawer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(3px);
          z-index: 2000;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.28s ease;
          display: flex;
          justify-content: flex-end;
        }
        .drawer-overlay.open {
          opacity: 1;
          pointer-events: auto;
        }
        .drawer-overlay.closing {
          opacity: 0;
        }
        .drawer-panel-right {
          position: fixed;
          top: 0;
          right: 0;
          width: 900px;
          height: 100vh;
          background: #f8fafc;
          z-index: 2001;
          transform: translateX(110%);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: -8px 0 32px rgba(15,23,42,0.10);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .drawer-panel-right.open {
          transform: translateX(0);
        }
        .drawer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          background: linear-gradient(90deg, #07132d 0%, #2b3669 48%, #7b78f3 100%);
          border-bottom: none;
          flex-shrink: 0;
        }
        .drawer-header-title {
          margin: 0;
          font-size: 14px;
          font-weight: 700;
          color: #ffffff;
          display: flex;
          align-items: center;
        }
        .close-btn {
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.2);
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.85);
          cursor: pointer;
          transition: all 0.2s;
        }
        .close-btn:hover {
          background: rgba(255,255,255,0.25);
          color: #ffffff;
        }
        .drawer-content {
          padding: 20px;
          flex: 1;
          overflow-y: auto;
        }
        .empty-state {
          color: #94a3b8;
          text-align: center;
          margin-top: 40px;
          font-size: 14px;
        }
        .hide-scrollbar::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
      `}</style>
    </>
  );
};

// --- MAIN COMPONENT ---
const TalentPool = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const preselectedJobTitle = location.state?.jobTitle;
  const userId = localStorage.getItem("CompanyId");
  const companyId = localStorage.getItem("logincompanyid");
  const [viewMode, setViewMode] = useState("grid");
  const [isToggling, setIsToggling] = useState(false);
  const resultsRef = useRef(null);
  const [shortlistedMap, setShortlistedMap] = useState(() => {
    try {
      const stored = localStorage.getItem("shortlistedMap");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showConfirmRemoveAllModal, setShowConfirmRemoveAllModal] = useState(false);
  const [showShortlistPromptModal, setShowShortlistPromptModal] = useState(false);
  const [shortlistPromptData, setShortlistPromptData] = useState(null);

  const handleConfirmRemoveAll = () => {
    setShortlistedMap({});
    localStorage.removeItem("shortlistedMap");
    setShowConfirmRemoveAllModal(false);
    toast.success("All shortlisted candidates removed.");
  };

  const handleConfirmPromptShortlist = () => {
    if (!shortlistPromptData) return;
    const { candidate, matchingJob } = shortlistPromptData;

    setSelectedJobId(matchingJob.id);
    setAppliedFilters((prev) => {
      const existingSelectedJobs = prev?.selectedJobs || [];
      const updatedSelectedJobs = existingSelectedJobs.includes(matchingJob.id)
        ? existingSelectedJobs
        : [...existingSelectedJobs, matchingJob.id];
      return {
        ...(prev || {}),
        selectedJobs: updatedSelectedJobs,
      };
    });
    setSearchParams({ jobId: matchingJob.id });

    setShortlistedMap((prev) => {
      const currentList = prev[matchingJob.id] || [];
      const exists = currentList.find((c) => c.id === candidate.id);
      if (exists) return prev;
      return { ...prev, [matchingJob.id]: [...currentList, candidate] };
    });

    setShowShortlistPromptModal(false);
    setShortlistPromptData(null);
    setIsDrawerOpen(true);
    toast.success(`Candidate shortlisted for ${matchingJob.title}`);
  };
  const [isJobDetailsDrawerOpen, setIsJobDetailsDrawerOpen] = useState(false);
  const [successJobId, setSuccessJobId] = useState(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("name_asc");
  const [selectedJobId, setSelectedJobId] = useState(null);

  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [allCandidates, setAllCandidates] = useState([]);
  const [isInitialised, setIsInitialised] = useState(false);
  const [allSelectedJobDetails, setAllSelectedJobDetails] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [appliedFilters, setAppliedFilters] = useState(() => {
    const saved = sessionStorage.getItem("talentPoolFilters");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return null;
  });

  useEffect(() => {
    if (appliedFilters !== null) {
      sessionStorage.setItem("talentPoolFilters", JSON.stringify(appliedFilters));
    }
  }, [appliedFilters]);


  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loadingShortlistId, setLoadingShortlistId] = useState(null);

  const activeJobId = selectedJobId;

  const countryRegistration = Number(localStorage.getItem("countryRegistration") || 1);
  const isIND = countryRegistration === 2;

  const { data: usJobTitles = [] } = useGetGroupedJobTitlesQuery(userId, { skip: isIND });
  const { data: indJobTitles = [] } = useGetJobPostingINDQuery(userId, { skip: !isIND });

  const jobTitles = isIND ? indJobTitles : usJobTitles;
  const [getJobById, { data: jobDetails }] = useLazyGetJobByIdQuery();
  const [getJobPostingINDById] = useLazyGetJobPostingINDByIdQuery();
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  const [getFindTalent, { data, isLoading }] =
    useTalentPoolMutation();

  const PAGE_SIZE = 50;

  const fetchTalents = async () => {

    try {
      if (pageNumber === 1) {
        setIsInitialLoading(true);   // first load
      } else {
        setIsFetchingMore(true);     // scroll load
      }

      const filtersArray = [];

      if (appliedFilters) {

       // Title
if (appliedFilters.selectedJobs?.length) {
  const selectedTitles = appliedFilters.selectedJobs
    .map((jobId) => jobs.find((j) => j.id === jobId)?.title)
    .filter(Boolean);

  if (selectedTitles.length > 0) {
    filtersArray.push({
      filterName: "Title",
      filterOperator: "Contains",
      filterValue: selectedTitles,
    });
  }
}

        // Skills
        if (appliedFilters.skills?.length) {
          filtersArray.push({
            filterName: "skills",
            filterOperator: "Equals",
            filterValue: appliedFilters.skills,
          });
        }

        // Location
        if (appliedFilters.location) {
          filtersArray.push({
            filterName: "Location",
            filterOperator: "Equals",
            filterValue: [appliedFilters.location],
          });
        }

        // Salary Range
        if (appliedFilters.minSalary && appliedFilters.maxSalary) {
          filtersArray.push({
            filterName: "Salary Range",
            filterOperator: "Equals",
            filterValue: [
              `${appliedFilters.minSalary} - ${appliedFilters.maxSalary}`
            ],
          });
        }

        // Years of Experience
        if (appliedFilters.minExperience && appliedFilters.maxExperience) {
          filtersArray.push({
            filterName: "Years of Experience",
            filterOperator: "Equals",
            filterValue: [
              `${appliedFilters.minExperience}- ${appliedFilters.maxExperience}`
            ],
          });
        }

        // Employment Type
        if (appliedFilters.availability?.length) {
          filtersArray.push({
            filterName: "Employment Type",
            filterOperator: "Equals",
            filterValue: appliedFilters.availability,
          });
        }
      }

      const payload = {
        companyid: Number(companyId),
        pageNumber,
        pageSize: PAGE_SIZE,
        filters: filtersArray,
      };

      const res = await getFindTalent(payload).unwrap();

      // 🔥 API returns array directly
      if (!Array.isArray(res) || res.length === 0) {
        setHasMore(false);
        return;
      }

      if (res.length < PAGE_SIZE) {
        setHasMore(false);   // no more pages
      }

      setAllCandidates((prev) =>
        pageNumber === 1 ? res : [...prev, ...res]
      );

    } finally {
      setIsInitialLoading(false);
      setIsFetchingMore(false);
    }
  };


  const { data: companyList = [] } = useGetCompanyListQuery();

  const companyMap = useMemo(() => {
    const map = new Map();
    if (Array.isArray(companyList)) {
      companyList.forEach((c) => {
        if (c.companyId && c.companyName) {
          map.set(String(c.companyId), c.companyName.trim());
        }
      });
    }
    return map;
  }, [companyList]);

  const candidates = useMemo(() => {
    return allCandidates.map((item) => {
      const rawCompId = item.companyID || item.companyId || item.company_ID || item.company_id || item.insertByCompanyId || item.insertedByCompanyId;
      const nameFromCompId = rawCompId ? companyMap.get(String(rawCompId)) : "";
      const rawCompany = (item.companyName && item.companyName.toLowerCase() !== "benmyl")
        ? item.companyName
        : (item.company && item.company.toLowerCase() !== "benmyl")
          ? item.company
          : (nameFromCompId && nameFromCompId.toLowerCase() !== "benmyl")
            ? nameFromCompId
            : (item.currentCompany && item.currentCompany.toLowerCase() !== "benmyl")
              ? item.currentCompany
              : (item.uploadedCompany && item.uploadedCompany.toLowerCase() !== "benmyl")
                ? item.uploadedCompany
                : "";

      return {
        id: item.employeeID,
        companyID: rawCompId,

        name: `${item.firstName || ""} ${item.lastName || ""}`.trim(),
        inviteUserId: Number(item.insertBy),

        role: item.title || "-",

        experience: `${calculateTotalExperience(item.workexperiences) || 0}`,

        location: item.city || "-",

        skills: item.skills
          ? item.skills.split(",").map((s) => s.trim())
          : [],

        avatar: item.profilePicture || "",

        rating: 4.5,

        availability: item.status ? [item.status] : ["Available"],

        verified: true,
        isshortlisted: item.isshortlisted,
        uploadedByName: item.uploadedByName,
        company: rawCompany,
        education: item.highestQualification || (item.employee_Heighers && item.employee_Heighers[0]?.highestQualification) || item.degree || "",
        hourlyRate: item.salary || 0,
      };
    });
  }, [allCandidates, companyMap]);

  const jobs = useMemo(() => {
    if (!Array.isArray(jobTitles)) return [];

    const colorPalette = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

    return jobTitles.map((job, index) => {
      const jobIdVal = job.jobId ?? job.jobID;
      return {
        id: `job-${jobIdVal}`,      // 🔥 unique per job
        jobID: jobIdVal,            // backend id
        title: job.jobTitle,
        companyName: job.companyName,
        color: colorPalette[index % colorPalette.length],
      };
    });
  }, [jobTitles]);

  const allSkills = useMemo(() => {
    if (!Array.isArray(jobTitles)) return [];

    const skillSet = new Set();

    jobTitles.forEach((job) => {
      if (job.requiredSkills) {
        job.requiredSkills.split(",").forEach((skill) => {
          const clean = skill.trim().toLowerCase();
          if (clean) {
            skillSet.add(clean);
          }
        });
      }
    });

    return Array.from(skillSet).map(
      (skill) => skill.charAt(0).toUpperCase() + skill.slice(1)
    );
  }, [jobTitles]);


  useEffect(() => {
    if (!preselectedJobTitle || jobs.length === 0) return;

    const matchedJob = jobs.find(
      (j) =>
        j.title.toLowerCase().includes(preselectedJobTitle.toLowerCase()) ||
        preselectedJobTitle.toLowerCase().includes(j.title.toLowerCase())
    );

    if (!matchedJob) return;

    const filters = {
      selectedJobs: [matchedJob.id],
      skills: [],
      location: "",
      minExperience: "",
      maxExperience: "",
      minSalary: "",
      maxSalary: "",
      availability: [],
    };

    setSelectedJobId(matchedJob.id);
    setAppliedFilters(filters);

    // 🔥 VERY IMPORTANT → sync to URL
    setSearchParams({ jobId: matchedJob.id });

  }, [preselectedJobTitle, jobs]);

  const filtersReady = useMemo(() => {
    const hasURLParams = searchParams.toString().length > 0;

    // If coming from "Find Talent" (with preselectedJobTitle in state),
    // wait until the job is matched and appliedFilters is set.
    if (preselectedJobTitle && appliedFilters === null) {
      return false;
    }

    // If URL has filters but appliedFilters not restored yet → wait
    if (hasURLParams && appliedFilters === null) {
      return false;
    }

    return true;
  }, [searchParams, appliedFilters, preselectedJobTitle]);

  useEffect(() => {
    if (selectedJobId !== null) {
      setIsInitialised(true);
    }
  }, [selectedJobId]);

  useEffect(() => {
    setPageNumber(1);
    setHasMore(true);
    setAllCandidates([]);
  }, [activeJobId]);

  useEffect(() => {
    if (!filtersReady) return;

    fetchTalents();
  }, [pageNumber, appliedFilters, activeJobId, filtersReady]);



  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const el = resultsRef.current;

    const handleScroll = () => {
      const currentScroll = window.scrollY || document.documentElement.scrollTop;
      
      if (currentScroll > 180) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }

      // Pagination check based on window scroll
      if (
        window.innerHeight + currentScroll >= document.documentElement.scrollHeight - 100 &&
        hasMore &&
        !isFetchingMore
      ) {
        setPageNumber((prev) => prev + 1);
      }
    };

    if (el) el.addEventListener("scroll", handleScroll);
    window.addEventListener("scroll", handleScroll);

    return () => {
      if (el) el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasMore, isFetchingMore]);

  const scrollToTop = () => {
    if (resultsRef.current) {
      resultsRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  const activeJob = useMemo(() => {
    if (!selectedJobId) return null;
    return jobs.find((j) => j.id === selectedJobId) || null;
  }, [selectedJobId, jobs]);

  const activeJobColor = activeJob?.color || "#4f46e5";

  const allJobOverviewData = useMemo(() => {
    return allSelectedJobDetails.map((details) => {
      // IND: jobId, workMode, minSalary, maxSalary, currency, employmentType, jobSummary, experienceRequired, education
      // US:  jobID, workModels, salaryRange_Min, salaryRange_Max, salarType, employeeType, jobDescription, yearsofExperience, educationLevel
      const currSym = details.currency === "INR" ? "₹" : (details.currency === "USD" ? "$" : (details.currency || "$"));
      const minSal = details.minSalary ?? details.salaryRange_Min;
      const maxSal = details.maxSalary ?? details.salaryRange_Max;
      return {
        id: details.jobId ?? details.jobID,
        title: details.jobTitle,
        company: details.companyName,
        location: details.location || [details.city, details.state, details.country].filter(Boolean).join(", "),
        budget:
          minSal && maxSal
            ? `${currSym}${minSal} - ${currSym}${maxSal}`
            : minSal ? `${currSym}${minSal}` : "",
        // Keep raw fields for JobOverviewCard compatibility
        salaryRange_Min: minSal,
        salaryRange_Max: maxSal,
        currency: details.currency,
        experience: details.experienceRequired ?? details.yearsofExperience ?? details.yearsOfExperience ?? details.experienceLevel,
        yearsofExperience: details.experienceRequired ?? details.yearsofExperience ?? details.yearsOfExperience ?? details.experienceLevel,
        type: details.employmentType ?? details.employeeType,
        salaryType: details.salaryType ?? details.salarType,
        salarType: details.salaryType ?? details.salarType,
        description: details.jobSummary ?? details.jobDescription,
        jobDescription: details.jobSummary ?? details.jobDescription,
        workModels: details.workMode ?? details.workModels,
        educationLevel: details.education ?? details.educationLevel ?? details.highestQualification,
        createdOn: details.createdOn || details.postedDate,
        requiredSkills: details.requiredSkills
          ? details.requiredSkills.split(",").map((s) => s.trim())
          : [],
        // Pass through work-auth flags (US only, harmless for IND)
        isOPT: details.isOPT, isCPT: details.isCPT, isH1B: details.isH1B,
        isEAD: details.isEAD, isGC: details.isGC, isH4: details.isH4,
        isUSCitizen: details.isUSCitizen,
        isCorpToCorp: details.isCorpToCorp, isW2Permanent: details.isW2Permanent,
        isW2Contract: details.isW2Contract, is1099Contract: details.is1099Contract,
        isContractToHire: details.isContractToHire,
      };
    });
  }, [allSelectedJobDetails]);

  useEffect(() => {
    let isMounted = true;
    const selectedJobIds = appliedFilters?.selectedJobs || [];
    if (selectedJobIds.length === 0) {
      setAllSelectedJobDetails([]);
      return;
    }

    const fetchDetails = async () => {
      const detailsPromises = selectedJobIds.map((id) => {
        const job = jobs.find((j) => j.id === id);
        if (!job) return null;
        if (isIND) {
          return getJobPostingINDById({ jobId: job.jobID, userId }).unwrap();
        }
        return getJobById({ jobId: job.jobID, userId }).unwrap();
      });

      const results = await Promise.all(detailsPromises);
      if (!isMounted) return;

      // IND API may return an array or single object; US always returns array
      const validDetails = results
        .filter(Boolean)
        .flatMap((res) => {
          if (Array.isArray(res)) return res.filter(Boolean);
          return [res];
        })
        .filter(Boolean);
      setAllSelectedJobDetails(validDetails);
    };

    fetchDetails();
    return () => {
      isMounted = false;
    };
  }, [appliedFilters?.selectedJobs, jobs, userId, isIND]);


  const handleShortlist = (candidate) => {
    setLoadingShortlistId(candidate.id);
    setTimeout(() => {
      setLoadingShortlistId(null);
      let targetJob = activeJobId ? jobs.find((j) => j.id === activeJobId) : null;
      
      if (!targetJob) {
        targetJob = jobs.find((job) => {
          const jobTitle = job.title?.toLowerCase().trim();
          const candRole = candidate.role?.toLowerCase().trim();
          if (!jobTitle || !candRole) return false;
          if (jobTitle === candRole) return true;
          const subRoles = candRole.split(/[\/,|&]|\band\b/).map((r) => r.trim());
          if (subRoles.includes(jobTitle)) return true;
          return candRole.includes(jobTitle) || jobTitle.includes(candRole);
        });
      }

      if (!targetJob) {
        setSelectedCandidate(candidate);
        setShowCreateJobModal(true);
        return;
      }

      // Check if candidate is already shortlisted for targetJob
      const currentList = shortlistedMap[targetJob.id] || [];
      const isAlreadyShortlisted = currentList.some((c) => c.id === candidate.id);

      if (isAlreadyShortlisted) {
        setShortlistedMap((prev) => ({
          ...prev,
          [targetJob.id]: currentList.filter((c) => c.id !== candidate.id),
        }));
        toast.info(`Removed candidate from ${targetJob.title}`);
        return;
      }

      if (activeJobId && targetJob.id === activeJobId) {
        setShortlistedMap((prev) => ({
          ...prev,
          [targetJob.id]: [...currentList, candidate]
        }));
        toast.success(`Candidate shortlisted for ${targetJob.title}`);
      } else {
        // Raise alert modal: "this job exists in your posted jobs.. would you like to add this role for that job"
        setShortlistPromptData({ candidate, matchingJob: targetJob });
        setShowShortlistPromptModal(true);
      }
    }, 350);
  };

  const clearShortlistForJob = (jobId) => {
    setShortlistedMap((prev) => {
      const updated = { ...prev };
      delete updated[jobId];
      return updated;
    });
  };


  useEffect(() => {
    if (jobs.length === 0) return;

    const jobId = searchParams.get("jobId");
    const jobIdArray = jobId ? jobId.split(",") : [];
    const skills = searchParams.get("skills");
    const location = searchParams.get("location");
    const minExp = searchParams.get("minExp");
    const maxExp = searchParams.get("maxExp");
    const minSal = searchParams.get("minSal");
    const maxSal = searchParams.get("maxSal");
    const type = searchParams.get("type");

    if (!jobId && preselectedJobTitle) {
      return; // 🔥 do NOT override
    }

    const restoredFilters = {
      selectedJobs: jobIdArray,
      skills: skills ? skills.split(",") : [],
      location: location || "",
      minExperience: minExp || "",
      maxExperience: maxExp || "",
      minSalary: minSal || "",
      maxSalary: maxSal || "",
      availability: type ? type.split(",") : [],
    };

    setSelectedJobId(jobIdArray[0] || null);
    setAppliedFilters(restoredFilters);
    setIsInitialised(true);
  }, [jobs, searchParams, preselectedJobTitle]);



  const handleApplyFilter = (filters) => {
    setPageNumber(1);          // 🔥 RESET TO PAGE 1
    setHasMore(true);          // reset infinite scroll
    setAllCandidates([]);      // clear old data
    setAppliedFilters(filters);

    const params = {};

    if (filters?.selectedJobs?.length) {
      params.jobId = filters.selectedJobs.join(",");
    }

    if (filters?.skills?.length) {
      params.skills = filters.skills.join(",");
    }

    if (filters?.location) {
      params.location = filters.location;
    }

    if (filters?.minExperience) {
      params.minExp = filters.minExperience;
    }

    if (filters?.maxExperience) {
      params.maxExp = filters.maxExperience;
    }

    if (filters?.minSalary) {
      params.minSal = filters.minSalary;
    }

    if (filters?.maxSalary) {
      params.maxSal = filters.maxSalary;
    }

    if (filters?.availability?.length) {
      params.type = filters.availability.join(",");
    }

    setSearchParams(params);
  };

  useEffect(() => {
    setMinTimeElapsed(false);
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [appliedFilters, activeJobId]);


  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [selectedResumeCandidate, setSelectedResumeCandidate] = useState(null);

  const handleProfileClick = (candidate) => {
    setSelectedResumeCandidate(candidate);
    setIsResumeModalOpen(true);
  };




  const handleRemoveFromDrawer = (jobId, candId) => {
    setShortlistedMap((prev) => ({
      ...prev,
      [jobId]: prev[jobId].filter((c) => c.id !== candId),
    }));
  };

  const selectedTitles = useMemo(() => {
    if (!appliedFilters?.selectedJobs?.length) return [];
    return appliedFilters.selectedJobs
      .map((jobId) => jobs.find((j) => j.id === jobId)?.title)
      .filter(Boolean);
  }, [appliedFilters?.selectedJobs, jobs]);

  const getRoleMatchScore = (candRole, selectedTitlesList) => {
    if (!candRole || !selectedTitlesList || selectedTitlesList.length === 0) return 0;
    const lowerRole = candRole.toLowerCase().trim();

    for (const title of selectedTitlesList) {
      const lowerTitle = title.toLowerCase().trim();

      // Primary exact role match
      if (lowerRole === lowerTitle) return 100;

      // Primary role starts with or contains selected title
      if (lowerRole.startsWith(lowerTitle)) return 95;
      if (lowerRole.includes(lowerTitle)) return 85;

      // Selected title starts with candidate role
      if (lowerTitle.startsWith(lowerRole)) return 75;
      if (lowerTitle.includes(lowerRole)) return 70;

      // Secondary token matching (e.g. Engineer, Developer)
      const titleTokens = lowerTitle.split(/[\/\s&,-]+/).filter((t) => t.length >= 2);
      const matchedTokens = titleTokens.filter((t) => lowerRole.includes(t));
      if (matchedTokens.length > 0) {
        const isPrimaryKeyword = matchedTokens.some((t) => !["engineer", "developer", "designer", "architect", "lead", "senior", "junior"].includes(t));
        return isPrimaryKeyword ? (50 + matchedTokens.length * 10) : (30 + matchedTokens.length * 5);
      }
    }
    return 0;
  };

  const sortedCandidates = useMemo(() => {
    let sortable = [...candidates];

    if (selectedTitles.length > 0) {
      sortable.sort((a, b) => {
        const scoreA = getRoleMatchScore(a.role, selectedTitles);
        const scoreB = getRoleMatchScore(b.role, selectedTitles);
        if (scoreB !== scoreA) {
          return scoreB - scoreA;
        }
        return a.name.localeCompare(b.name);
      });
      return sortable;
    }

    switch (sortBy) {
      case "rating_high":
        return sortable.sort((a, b) => b.rating - a.rating);
      case "exp_high":
        return sortable.sort((a, b) => parseExperience(b.experience) - parseExperience(a.experience));
      case "exp_low":
        return sortable.sort((a, b) => parseExperience(a.experience) - parseExperience(b.experience));
      case "rate_low":
        return sortable.sort((a, b) => (a.hourlyRate || 0) - (b.hourlyRate || 0));
      case "name_asc":
        return sortable.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sortable;
    }
  }, [candidates, sortBy, selectedTitles]);

  useEffect(() => {
    localStorage.setItem(
      "shortlistedMap",
      JSON.stringify(shortlistedMap)
    );
  }, [shortlistedMap]);


  const [expandedCardId, setExpandedCardId] = useState(null);

  const toggleCard = (id) => {
    setExpandedCardId(prev => (prev === id ? null : id));
  };

  return (
    <div
      style={{
        background: "#f5f7fb",
        minHeight: "100vh",
        padding: "18px",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "22px",
          alignItems: "flex-start",
        }}
      >
        {/* LEFT FILTER (Removed) */}
        <FilterBottomSheet
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
          title="Filters"
        >
          <TalentFilters
            onApplyFilters={(filters) => {
              handleApplyFilter(filters);
            }}
            skillsList={allSkills}
            jobs={jobs}
            selectedJobId={selectedJobId}
            appliedFilters={appliedFilters}
          />
        </FilterBottomSheet>

        {/* RIGHT */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

          {/* Main content wrapper */}
          <div style={{ zIndex: 10 }}>

            {/* Sticky Filters */}
            <div style={{ position: "sticky", top: "70px", zIndex: 20, margin: '-18px -18px 16px -18px' }}>
              <HorizontalTalentFilters 
                onApplyFilters={handleApplyFilter} 
                skillsList={allSkills} 
                jobs={jobs} 
                selectedJobId={selectedJobId} 
                appliedFilters={appliedFilters} 
              >
                {/* ACTIONS & VIEW TOGGLE */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <button
                    className="routine-btn"
                    style={{ height: '36px', padding: '0 12px' }}
                    onClick={() => {
                      if (!activeJobId) {
                        toast.error("Please select a job to view its overview.");
                        return;
                      }
                      setIsJobDetailsDrawerOpen(true);
                    }}
                  >
                    <FiBriefcase size={14} />
                    <span>View Job Details</span>
                  </button>

                  <button
                    className="routine-btn"
                    style={{ height: '36px', padding: '0 12px' }}
                    onClick={() => {
                      if (!activeJobId) {
                        toast.error("Please select a job and talent to view its shortlist.");
                        return;
                      }
                      const currentShortlist = shortlistedMap?.[activeJobId] || [];
                      if (!currentShortlist.length) {
                        toast.error("Please select shortlist to view.");
                        return;
                      }
                      setIsDrawerOpen(true);
                    }}
                  >
                    <FiBriefcase size={14} />
                    <span>View Shortlisted</span>
                    {activeJobId && shortlistedMap?.[activeJobId]?.length > 0 && (
                      <span className="shortlist-count-badge">
                        {shortlistedMap[activeJobId].length}
                      </span>
                    )}
                  </button>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    background: "#f1f5f9",
                    borderRadius: "12px",
                    padding: "4px",
                    gap: "4px",
                    height: "36px",
                    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)",
                    border: "1px solid #e2e8f0"
                  }}
                >
                  <button
                    onClick={() => {
                      if (viewMode === "grid") return;
                      setIsToggling(true);
                      setViewMode("grid");
                      setTimeout(() => setIsToggling(false), 500);
                    }}
                    style={{
                      width: "32px",
                      height: "28px",
                      border: "none",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      background: viewMode === "grid" ? "#ffffff" : "transparent",
                      color: viewMode === "grid" ? "#3b82f6" : "#64748b",
                      boxShadow: viewMode === "grid" ? "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)" : "none",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    <FiGrid size={14} />
                  </button>

                  <button
                    onClick={() => {
                      if (viewMode === "table") return;
                      setIsToggling(true);
                      setViewMode("table");
                      setTimeout(() => setIsToggling(false), 500);
                    }}
                    style={{
                      width: "32px",
                      height: "28px",
                      border: "none",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      background: viewMode === "table" ? "#ffffff" : "transparent",
                      color: viewMode === "table" ? "#3b82f6" : "#64748b",
                      boxShadow: viewMode === "table" ? "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)" : "none",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    <FiList size={14} />
                  </button>
                </div>
                </div>
              </HorizontalTalentFilters>
            </div>

            <div className="hero-section-wrapper mb-4">
        <div className="hero-card ">
          <div className="hero-concentric-lines"></div>
          <div className="hero-ripple-pattern"></div>
          <div className="hero-circular-highlights"></div>
              <FiUsers
                size={240}
                style={{
                  position: 'absolute',
                  right: '30%',
                  top: '50%',
                  transform: 'translateY(-50%) rotate(-10deg)',
                  color: '#ffffff',
                  opacity: 0.04,
                  zIndex: 1,
                  pointerEvents: 'none'
                }}
              />
              <div className="hero-left">
                <div className="hero-pill">
                  ✦ Find Talent
                </div>
                <div className="hero-title-row">
                  <h1 className="job-posting-title text-white" style={{ position: 'relative', zIndex: 2 }}>Talent Network Board</h1>

                  <div className="hero-buttons">
                    <button
                      className="filters-applied"
                      onClick={() => setIsMobileFilterOpen(true)}
                    >
                      <FiFilter /> Filters
                    </button>



                    <div className="vs-results-right">
                      {/* VIEW TOGGLE MOVED TO FILTERS */}
                    </div>
                  </div>
                </div>

                <div className="hero-content-row">
                  <p className="job-posting-subtitle">
                    Search and manage your talent network.
                  </p>
                </div>
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
            <img src="/Images/find.png" alt="Dashboard Illustration" className="hero-svg-image" />
          </div>
        </div>
      </div>



            {/* Layout */}
            <div
              ref={resultsRef}
              className="talent-pool-results-container hide-scrollbar"
            >
              {(isLoading || !minTimeElapsed) && allCandidates.length === 0 ? (
                <div className="jobs-screen-loader">
                  <div className="jobs-loader-ring">
                    <div className="jobs-loader-icon">
                      <FiBriefcase size={18} />
                    </div>
                  </div>
                  <p className="jobs-loader-text">Searching for candidates...</p>
                  <span className="jobs-loader-sub">Matching candidates based on your filters</span>
                </div>
              ) : isToggling ? (
                <div className="jobs-screen-loader">
                  <div className="jobs-loader-ring">
                    <div className="jobs-loader-icon">
                      <FiRefreshCw className="spin-icon" size={18} />
                    </div>
                  </div>
                  <p className="jobs-loader-text">Switching to {viewMode === "grid" ? "Grid" : "Table"} View...</p>
                  <span className="jobs-loader-sub">Preparing layout for optimal viewing</span>
                </div>
              ) : (
                <>
                  {!isLoading && sortedCandidates.length === 0 ? (
                    <div
                      style={{
                        minHeight: "320px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <NoData text="No Matching Profiles found" />
                    </div>
                  ) : viewMode === "grid" ? (
                    <TalentGridView
                      candidates={sortedCandidates}
                      onShortlist={handleShortlist}
                      activeJobId={activeJobId}
                      activeJobColor={activeJobColor}
                      shortlistedMap={shortlistedMap}
                      onProfileClick={handleProfileClick}
                      hasMore={hasMore}
                      loadingShortlistId={loadingShortlistId}
                    />
                  ) : (
                    <TalentTableView
                      candidates={sortedCandidates}
                      onShortlist={handleShortlist}
                      activeJobId={activeJobId}
                      activeJobColor={activeJobColor}
                      shortlistedMap={shortlistedMap}
                      onProfileClick={handleProfileClick}
                      hasMore={hasMore}
                      loadingShortlistId={loadingShortlistId}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <ShortlistDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          shortlistedMap={shortlistedMap}
          onRemove={handleRemoveFromDrawer}
          jobs={jobs}
          userId={userId}
          refreshTalents={fetchTalents}
          clearShortlistForJob={clearShortlistForJob}
          onInviteSuccess={(jobId, candidateId) => {
            setSuccessJobId({
              jobId,
              candidateId
            });
          }}
          onViewCandidateProfile={handleProfileClick}
          onOpenConfirmRemoveAll={() => setShowConfirmRemoveAllModal(true)}
        />

        {/* Remove All Confirmation Modal (Centered on Screen) */}
        {showConfirmRemoveAllModal && (
          <div className="shortlist-confirm-backdrop" onClick={() => setShowConfirmRemoveAllModal(false)}>
            <div className="shortlist-confirm-modal" onClick={(e) => e.stopPropagation()}>
              <div className="scm-icon-wrap">
                <FiTrash2 size={22} color="#ef4444" />
              </div>
              <h3 className="scm-title">Remove All Candidates?</h3>
              <p className="scm-desc">
                Are you sure you want to remove all shortlisted candidates? This action cannot be undone.
              </p>
              <div className="scm-actions">
                <button
                  className="scm-btn cancel"
                  onClick={() => setShowConfirmRemoveAllModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="scm-btn confirm-danger"
                  onClick={handleConfirmRemoveAll}
                >
                  Yes, Remove All
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Matching Job Found Confirmation Alert Modal */}
        {showShortlistPromptModal && shortlistPromptData && (
          <div className="shortlist-confirm-backdrop" onClick={() => setShowShortlistPromptModal(false)}>
            <div className="shortlist-confirm-modal elegant-prompt-modal" onClick={(e) => e.stopPropagation()}>
              <div className="epm-header-glow"></div>
              <div className="epm-icon-badge">
                <FiBriefcase size={22} className="epm-icon" />
              </div>
              <div className="epm-tag">Existing Posted Job Found</div>
              <h3 className="epm-title">Shortlist for {shortlistPromptData.matchingJob?.title}?</h3>
              <p className="epm-desc">
                The position <strong>"{shortlistPromptData.matchingJob?.title}"</strong> is active in your posted jobs. Would you like to shortlist <strong>{shortlistPromptData.candidate?.name || 'this candidate'}</strong> directly under this job role?
              </p>
              <div className="epm-actions">
                <button
                  className="epm-btn cancel"
                  onClick={() => {
                    setShowShortlistPromptModal(false);
                    setShortlistPromptData(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="epm-btn confirm"
                  onClick={handleConfirmPromptShortlist}
                >
                  <GiCheckMark size={13} style={{ marginRight: '5px' }} /> Yes, Add Role
                </button>
              </div>
            </div>
          </div>
        )}

        <JobDetailsDrawer
          isOpen={isJobDetailsDrawerOpen}
          onClose={() => setIsJobDetailsDrawerOpen(false)}
          allJobOverviewData={allJobOverviewData}
        />

        {showCreateJobModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(15,23,42,0.55)",
              backdropFilter: "blur(4px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
            }}
          >
            <div
              style={{
                width: "420px",
                background: "#fff",
                borderRadius: "20px",
                padding: "28px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.15) !important",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "#5a5de8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <FiBriefcase size={28} color="#ffffffff" />
              </div>

              <h3
                style={{
                  textAlign: "center",
                  fontWeight: 700,
                  marginBottom: "10px",
                  color: "#0f172a",
                }}
              >
                Job Not Found
              </h3>

              <p
                style={{
                  textAlign: "center",
                  color: "#64748b",
                  marginBottom: "24px",
                  lineHeight: "1.6",
                }}
              >
                <strong>{selectedCandidate?.role}</strong> job role is not available.
                <br />
                Would you like to create a new job posting?
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                }}
              >
                <button
                  onClick={() => {
                    setShowCreateJobModal(false);
                    setSelectedCandidate(null);
                  }}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                    background: "#fff",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    const basePath = window.location.pathname
                      .toLowerCase()
                      .startsWith("/admin")
                      ? "/Admin"
                      : "/user";

                    navigate(`${basePath}/user-post-new-positions`, {
                      state: {
                        autoFillRole: selectedCandidate?.role,
                      },
                    });

                    setShowCreateJobModal(false);
                  }}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "10px",
                    border: "none",
                    background: "#5a5de8",
                    color: "#fff",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Create Job
                </button>
              </div>
            </div>
          </div>
        )}

        {successJobId && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2100 }} onClick={() => { }}>
            <div style={{ background: 'white', width: '90%', maxWidth: '440px', borderRadius: '24px', padding: '40px', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', animation: 'modalFadeIn 0.3s ease-out' }} onClick={e => e.stopPropagation()}>
              <div style={{ marginBottom: '24px' }}>
                <FiCheckCircle size={60} color="#059669" />
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1e293b', marginBottom: '24px' }}>Invite Sent Successfully!</h2>

              <div style={{ background: '#eff6ff', borderLeft: '4px solid #3b82f6', padding: '12px 16px', borderRadius: '8px', marginBottom: '32px', textAlign: 'left' }}>
                <p style={{ margin: 0, fontSize: '13px', color: '#1e40af', lineHeight: 1.5 }}>
                  <strong>Note:</strong> Selected candidates have been notified successfully. You can now proceed to schedule an interview with them.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button
                  style={{ width: '100%', padding: '14px', background: '#f5810c', color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
                  onClick={() => {
                    const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
                    const targetPath = window.location.pathname.toLowerCase().startsWith('/admin') ? `${basePath}/admin-upcoming-interview` : `${basePath}/user-upcoming-interview`;
                    navigate(targetPath, { state: { openDrawer: true, preSelectedJobId: successJobId.jobId,preSelectedCandidateId: successJobId.candidateId } });
                  }}
                >
                  Schedule Interview
                </button>
                <button
                  style={{ width: '100%', padding: '14px', background: '#f8fafc', color: '#1e293b', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
                  onClick={() => setSuccessJobId(null)}
                >
                  Continue to Talentpool
                </button>
              </div>
            </div>
          </div>
        )}

        <TalentResumeView
          isOpen={isResumeModalOpen}
          onClose={() => setIsResumeModalOpen(false)}
          candidate={selectedResumeCandidate}
          onShortlist={handleShortlist}
          isShortlisted={Boolean(activeJobId && shortlistedMap?.[activeJobId]?.some((c) => c.id === selectedResumeCandidate?.id))}
        />

        {showScrollTop && (
          <button
            className="talent-scroll-top-btn"
            onClick={scrollToTop}
            title="Scroll to top"
          >
            <FiArrowUp size={18} />
          </button>
        )}

        <style jsx>{`
        .sort-wrapper {
          position: relative;
          margin-right: 8px;
        }
        .sort-select {
          appearance: none;
          background-color: white;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 8px 32px 8px 12px;
          font-size: 13px;
          color: #334155;
          font-weight: 500;
          cursor: pointer;
          outline: none;
          min-width: 180px;
        }
        .sort-select:hover {
          border-color: #cbd5e1;
        }
        .sort-icon {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          pointer-events: none;
        }
        .talent-pool-results-container {
          min-height: calc(100vh - 140px);
          overflow-x: hidden;
          padding-right: 4px;
        }

        @media (max-width: 768px) {
          .talent-pool-results-container {
            height: auto;
            overflow-y: visible;
            overflow-x: hidden;
            padding-right: 0;
          }
        }

        .hide-scrollbar::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }

        /* Firefox */
        .hide-scrollbar {
          scrollbar-width: none;
        }

        /* IE / old Edge */
        .hide-scrollbar {
          -ms-overflow-style: none;
        }
      `}</style>
      </div>
    </div>
  );
};

export default TalentPool;
