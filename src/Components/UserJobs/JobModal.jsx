import React, { useState } from "react";
import { createPortal } from "react-dom";
import { 
  FiX, 
  FiCheck, 
  FiLoader, 
  FiEye
} from "react-icons/fi";
import { useGetEmployeesByTitleQuery, usePlaceBidMutation } from "../../State-Management/Api/ProjectApiSlice";
import JobOverviewCard from "../TalentPool/JobOverviewCard";
import { useNavigate } from "react-router-dom";
import { CustomAlert } from "../Common/CustomAlert";
import NoData from "../UploadTalent/NoData";


const JobModal = ({ job, onClose, initialSelectedTalentId, initialCandidate }) => {
  const title = job?.title;
  
  const {
    data: talents = [],
    isLoading,
    isError,
  } = useGetEmployeesByTitleQuery(title);
  const [placeBid] = usePlaceBidMutation();
  const recruiterUserId = localStorage.getItem("CompanyId");
  console.log("uId:",job?.userId)

  const [selectedTalents, setSelectedTalents] = useState(initialSelectedTalentId ? [initialSelectedTalentId] : []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customAlert, setCustomAlert] = useState(null);

  const navigate = useNavigate();

  const handleToggleTalent = (id) => {
    if (isSubmitting) return;
    setSelectedTalents((prev) =>
      prev.includes(id) ? prev.filter((tId) => tId !== id) : [...prev, id],
    );
  };

  const handleDone = async () => {
  if (selectedTalents.length === 0) return;

  try {
    setIsSubmitting(true);

    const payload = {
      jobId: job.id,
      jobUserId: job?.userId, // recruiter who posted job
      logUserId: Number(recruiterUserId),
      employeesListID: selectedTalents,
    };

    const response = await placeBid(payload).unwrap();

    console.log("Bid placed:", response);
    setCustomAlert({
      title: "Bid Placed Successfully",
      message: response?.message || "Your bid has been placed for the selected talent.",
      type: "success",
      onConfirm: () => {
        onClose();
      }
    });
  } catch (error) {
    console.error("Place Bid Error:", error);
    setCustomAlert({
      title: "Failed to Place Bid",
      message: error?.data?.message || "An error occurred while placing the bid. Please check your connection and try again.",
      type: "error",
      onConfirm: () => {}
    });
  } finally {
    setIsSubmitting(false);
  }
};

  const getInitials = (name = "") =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0].toUpperCase())
      .join("");



  let normalizedTalents = talents
    .filter((t) => !t.isShortlisted)
    .map((t) => ({
      id: t.employeeID,
      name: `${t.firstName} ${t.lastName ?? ""}`,
      role: title,
      email: t.emailAddress,
      avatar: t.profileImage, // Use actual profile image if available
    }));

  if (initialCandidate && initialSelectedTalentId) {
    const exists = normalizedTalents.find(t => t.id === initialSelectedTalentId);
    if (!exists) {
      normalizedTalents = [initialCandidate, ...normalizedTalents];
    }
  }

  return createPortal(
    <div className="job-modal-overlay">
      <div className="job-modal-window">
        <div className="job-modal-drag-handle" />
        {isSubmitting && (
          <div className="job-modal-loading-overlay">
            <div className="job-modal-spinner" />
            <div className="job-modal-loading-text">Finalizing talent allocation…</div>
          </div>
        )}

        <button className="job-modal-close" onClick={onClose} disabled={isSubmitting}>
          <FiX />
        </button>

        <div className="job-modal-inner">
          {/* LEFT: Talent Selection */}
          <aside className="job-modal-left">
            <div className="job-modal-selection-header">
              <h4 className="job-modal-selection-title">Select Talent</h4>
              <span className="job-modal-count-badge">{selectedTalents.length} Selected</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
              {/* Loading & Empty States */}
              {isLoading ? (
                <div className="job-modal-empty-state">
                  <div className="job-modal-spinner spinner-margin" />
                  Loading suitable talents...
                </div>
              ) : isError ? (
                <div className="job-modal-empty-state error">Failed to load talents</div>
              ) : normalizedTalents.length === 0 ? (
                <div className="job-modal-empty-state" style={{ background: 'transparent', border: 'none' }}>
                  <NoData text="No talents matching this role" maxWidth="130px" />
                </div>
              ) : (
                <>
                  {/* Selected Candidates Section */}
                  <div style={{ flexShrink: 0, borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                    {normalizedTalents.filter(t => selectedTalents.includes(t.id)).length > 0 ? (
                      <>
                        <h5 className="job-modal-talent-group-title" style={{ marginBottom: '8px' }}>Selected Candidates</h5>
                        <div className="talent-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '6px' }}>
                          {normalizedTalents.filter(t => selectedTalents.includes(t.id)).map(talent => (
                            <div 
                              key={talent.id} 
                              className="job-modal-talent-card-row selectable selected"
                              onClick={() => handleToggleTalent(talent.id)}
                              style={{ padding: '8px 10px', marginBottom: 0 }}
                            >
                              <div className="job-modal-checkbox-selected" style={{ width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FiCheck size={10} color="#fff" strokeWidth={3} />
                              </div>

                              <div className="job-modal-initial-avatar" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                                {talent.avatar ? (
                                  <img src={talent.avatar} alt={talent.name} />
                                ) : (
                                  getInitials(talent.name)
                                )}
                              </div>

                              <div className="job-modal-t-info">
                                <div className="t-header">
                                  <span className="job-modal-t-name" style={{ fontSize: '13px' }}>{talent.name}</span>
                                </div>
                                <div className="job-modal-t-role" style={{ fontSize: '11px' }}>{talent.role}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <p style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic', margin: '0 0 12px 0' }}>No candidates selected yet.</p>
                    )}

                    {/* Footer / Actions for Selected Talents */}
                    <div className="job-modal-footer-actions" style={{ marginTop: '12px', paddingTop: '0', borderTop: 'none', justifyContent: 'flex-start', gap: '8px' }}>
                      <button 
                        className="btn-primary" 
                        onClick={handleDone}
                        disabled={isSubmitting || selectedTalents.length === 0}
                        style={{ flex: 1, padding: '8px', fontSize: '13px' }}
                      >
                        {isSubmitting ? <><FiLoader style={{ marginRight: '6px', animation: 'spin 1s linear infinite' }} size={14} /> Processing...</> : "Place Bid"}
                      </button>
                      <button className="btn-secondary" onClick={onClose} disabled={isSubmitting} style={{ flex: 1, padding: '8px', fontSize: '13px' }}>
                        Cancel
                      </button>
                    </div>
                  </div>

                  {/* Non-Selected (Recommended) Candidates - Internal Scroll */}
                  <div style={{ flex: 1, overflowY: 'auto', paddingTop: '12px', paddingRight: '6px' }}>
                    {normalizedTalents.filter(t => !selectedTalents.includes(t.id)).length > 0 && (
                      <>
                        <h5 className="job-modal-talent-group-title recommended" style={{ marginTop: 0, marginBottom: '8px' }}>Also Recommended Candidates</h5>
                        <div className="talent-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {normalizedTalents.filter(t => !selectedTalents.includes(t.id)).map(talent => (
                            <div 
                              key={talent.id} 
                              className="job-modal-talent-card-row selectable"
                              onClick={() => handleToggleTalent(talent.id)}
                              style={{ padding: '8px 10px', marginBottom: 0 }}
                            >
                              <div className="job-modal-checkbox-unselected" style={{ width: '16px', height: '16px' }}>
                              </div>

                              <div className="job-modal-initial-avatar" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                                {talent.avatar ? (
                                  <img src={talent.avatar} alt={talent.name} />
                                ) : (
                                  getInitials(talent.name)
                                )}
                              </div>

                              <div className="job-modal-t-info">
                                <div className="t-header">
                                  <span className="job-modal-t-name" style={{ fontSize: '13px' }}>{talent.name}</span>
                                </div>
                                <div className="job-modal-t-role" style={{ fontSize: '11px' }}>{talent.role}</div>
                              </div>

                              <button 
                                className="job-modal-t-view-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
                                  navigate(`${basePath}/talent-profile`, {
                                    state: { employeeId: talent.id, jobId: job.id },
                                  });
                                }}
                                style={{ padding: '4px 8px' }}
                              >
                                <FiEye size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </aside>

          {/* RIGHT: Project Overview */}
          <div className="job-modal-right">
            <div className="job-modal-overview-wrapper">
              <JobOverviewCard job={job} hideShare={true} />
            </div>
          </div>
        </div>
      </div>

      {customAlert && (
        <CustomAlert
          title={customAlert.title}
          message={customAlert.message}
          type={customAlert.type}
          onConfirm={customAlert.onConfirm}
          onClose={() => setCustomAlert(null)}
        />
      )}
    </div>,
    document.body
  );
};

export default JobModal;
