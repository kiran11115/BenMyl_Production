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


const JobModal = ({ job, onClose, initialSelectedTalentId }) => {
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



  const normalizedTalents = talents
    .filter((t) => !t.isShortlisted)
    .map((t) => ({
      id: t.employeeID,
      name: `${t.firstName} ${t.lastName ?? ""}`,
      role: title,
      email: t.emailAddress,
      avatar: t.profileImage, // Use actual profile image if available
    }));

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

            <div className="job-modal-talent-scroll-area">
              {isLoading ? (
                <div className="job-modal-empty-state">
                  <div className="job-modal-spinner spinner-margin" />
                  Loading suitable talents...
                </div>
              ) : isError ? (
                <div className="job-modal-empty-state error">Failed to load talents</div>
              ) : normalizedTalents.length === 0 ? (
                <div className="job-modal-empty-state">No talents matching this role</div>
              ) : (
                <div className="talent-list d-flex flex-column gap-3">
                  {/* Selected Candidates */}
                  {normalizedTalents.filter(t => selectedTalents.includes(t.id)).length > 0 && (
                    <div className="talent-group">
                      <h5 className="job-modal-talent-group-title">Selected Candidates</h5>
                      {normalizedTalents.filter(t => selectedTalents.includes(t.id)).map(talent => (
                        <div 
                          key={talent.id} 
                          className="job-modal-talent-card-row selectable selected"
                          onClick={() => handleToggleTalent(talent.id)}
                        >
                          <div className="job-modal-checkbox-selected">
                            <FiCheck size={12} color="#fff" strokeWidth={3} />
                          </div>

                          <div className="job-modal-initial-avatar">
                            {talent.avatar ? (
                              <img src={talent.avatar} alt={talent.name} />
                            ) : (
                              getInitials(talent.name)
                            )}
                          </div>

                          <div className="job-modal-t-info">
                            <div className="t-header">
                              <span className="job-modal-t-name">{talent.name}</span>
                            </div>
                            <div className="job-modal-t-role">{talent.role}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Recommended Candidates */}
                  {normalizedTalents.filter(t => !selectedTalents.includes(t.id)).length > 0 && (
                    <div className="talent-group">
                      <h5 className="job-modal-talent-group-title recommended">Also Recommended Candidates</h5>
                      {normalizedTalents.filter(t => !selectedTalents.includes(t.id)).map(talent => (
                        <div 
                          key={talent.id} 
                          className="job-modal-talent-card-row selectable"
                          onClick={() => handleToggleTalent(talent.id)}
                        >
                          <div className="job-modal-checkbox-unselected">
                          </div>

                          <div className="job-modal-initial-avatar">
                            {talent.avatar ? (
                              <img src={talent.avatar} alt={talent.name} />
                            ) : (
                              getInitials(talent.name)
                            )}
                          </div>

                          <div className="job-modal-t-info">
                            <div className="t-header">
                              <span className="job-modal-t-name">{talent.name}</span>
                            </div>
                            <div className="job-modal-t-role">{talent.role}</div>
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
                          >
                            <FiEye size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="job-modal-footer-actions">
              <button className="btn-secondary" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </button>
              <button 
                className="btn-primary" 
                onClick={handleDone}
                disabled={isSubmitting || selectedTalents.length === 0}
              >
                {isSubmitting ? <><FiLoader style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }} size={16} /> Processing...</> : "Place Bid"}
              </button>
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
