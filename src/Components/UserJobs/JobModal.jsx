import React, { useState } from "react";
import { createPortal } from "react-dom";
import { 
  FiX, 
  FiCheck, 
  FiClock, 
  FiDollarSign, 
  FiBriefcase,
  FiBook,
  FiAward,
  FiInfo,
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
  const [customNote, setCustomNote] = useState("");
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

  const formatMarkdownToHtml = (text) => {
    if (!text) return "";
    let formatted = text;
    formatted = formatted.replace(/^[^\n]*\n?/, "");
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    formatted = formatted.replace(/^\s*-\s+(.*)$/gm, "<li>$1</li>");
    if (formatted.includes("<li>")) {
      formatted = formatted.replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>");
    }
    formatted = formatted.replace(/\n/g, "<br/>");
    return formatted;
  };

  const normalizedTalents = talents
    .filter((t) => !t.isShortlisted)
    .map((t) => ({
      id: t.employeeID,
      name: `${t.firstName} ${t.lastName}`,
      role: title,
      email: t.emailAddress,
      avatar: t.profileImage, // Use actual profile image if available
    }));

  return createPortal(
    <div className="modal-overlay">
      <div className="modal-window job-modal-window">
        {isSubmitting && (
          <div className="loading-overlay">
            <div className="spinner" />
            <div className="loading-text">Finalizing talent allocation…</div>
          </div>
        )}

        <button className="modal-close" onClick={onClose} disabled={isSubmitting}>
          <FiX />
        </button>

        <div className="modal-inner">
          {/* LEFT: Talent Selection */}
          <aside className="modal-left">
            <div className="selection-header">
              <h4 className="selection-title">Select Talent</h4>
              <span className="count-badge">{selectedTalents.length} Selected</span>
            </div>

            <div className="talent-scroll-area">
              {isLoading ? (
                <div className="empty-state">
                  <div className="spinner" style={{ marginBottom: '12px' }} />
                  Loading suitable talents...
                </div>
              ) : isError ? (
                <div className="empty-state error">Failed to load talents</div>
              ) : normalizedTalents.length === 0 ? (
                <div className="empty-state">No talents matching this role</div>
              ) : (
                <div className="talent-list d-flex flex-column gap-3">
                  {/* Selected Candidates */}
                  {normalizedTalents.filter(t => selectedTalents.includes(t.id)).length > 0 && (
                    <div className="talent-group">
                      <h5 style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>Selected Candidates</h5>
                      {normalizedTalents.filter(t => selectedTalents.includes(t.id)).map(talent => (
                        <div 
                          key={talent.id} 
                          className="talent-card-row selectable selected"
                          onClick={() => handleToggleTalent(talent.id)}
                        >
                          <div style={{ width: '20px', height: '20px', borderRadius: '6px', border: '2px solid #7c3aed', background: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(124, 58, 237, 0.2)' }}>
                            <FiCheck size={12} color="#fff" strokeWidth={3} />
                          </div>

                          <div className="initial-avatar">
                            {talent.avatar ? (
                              <img src={talent.avatar} alt={talent.name} />
                            ) : (
                              getInitials(talent.name)
                            )}
                          </div>

                          <div className="t-info">
                            <div className="t-header">
                              <span className="t-name">{talent.name}</span>
                            </div>
                            <div className="t-role">{talent.role}</div>
                          </div>


                        </div>
                      ))}
                    </div>
                  )}

                  {/* Recommended Candidates */}
                  {normalizedTalents.filter(t => !selectedTalents.includes(t.id)).length > 0 && (
                    <div className="talent-group">
                      <h5 style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '12px', marginTop: '8px', letterSpacing: '0.05em' }}>Also Recommended Candidates</h5>
                      {normalizedTalents.filter(t => !selectedTalents.includes(t.id)).map(talent => (
                        <div 
                          key={talent.id} 
                          className="talent-card-row selectable"
                          onClick={() => handleToggleTalent(talent.id)}
                        >
                          <div style={{ width: '20px', height: '20px', borderRadius: '6px', border: '2px solid #cbd5e1', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                          </div>

                          <div className="initial-avatar">
                            {talent.avatar ? (
                              <img src={talent.avatar} alt={talent.name} />
                            ) : (
                              getInitials(talent.name)
                            )}
                          </div>

                          <div className="t-info">
                            <div className="t-header">
                              <span className="t-name">{talent.name}</span>
                            </div>
                            <div className="t-role">{talent.role}</div>
                          </div>

                          <button 
                            className="t-view-btn"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px' }}
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

            <div className="modal-footer-actions">
              <button className="btn-secondary" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </button>
              <button 
                className="btn-primary" 
                onClick={handleDone}
                disabled={isSubmitting || selectedTalents.length === 0}
                style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                {isSubmitting ? <><FiLoader style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }} size={16} /> Processing...</> : "Place Bid"}
              </button>
            </div>
          </aside>

          {/* RIGHT: Project Overview */}
          <div className="modal-right">
            <div className="d-flex flex-column gap-4 pb-4">
              <JobOverviewCard job={job} hideShare={true} />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.3s ease-out;
        }

        .modal-window.job-modal-window {
          width: 80vw;
          max-width: none;
          height: 100vh;
          background: #ffffff;
          border-radius: 24px 0 0 24px;
          box-shadow: -25px 0 50px -12px rgba(0, 0, 0, 0.25);
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          animation: slideInRightDrawer 0.4s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
        }

        @keyframes slideInRightDrawer {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .modal-inner {
          display: grid;
          grid-template-columns: 420px 1fr;
          height: 100%;
          overflow: hidden;
        }

        .modal-left {
          padding: 32px;
          display: flex;
          flex-direction: column;
          background: #f8fafc;
          border-right: 1px solid #e2e8f0;
          height: 100%;
        }

        .modal-right {
          padding: 32px;
          overflow-y: auto;
          background: #ffffff;
          width: 100%;
        }

        .modal-header-section { margin-bottom: 32px; }
        .modal-icon-badge {
          width: 48px;
          height: 48px;
          background: #fff7ed;
          color: #1f2937;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          box-shadow: 0 4px 6px -1px rgba(245, 129, 12, 0.1);
        }

        .modal-title { font-size: 24px; font-weight: 800; color: #020618; margin: 0; }
        .muted { color: #64748b; margin-top: 4px; }

        .job-main-info-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 24px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
          margin-bottom: 24px;
        }

        .job-title-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
        }
        .job-title-row h3 { font-size: 20px; font-weight: 700; color: #020618; margin: 0; }
        .type-badge {
          background: #eff6ff;
          color: #3b82f6;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
        }

        .job-meta-grid-modern {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }

        .meta-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #f1f5f9;
        }
        .meta-icon { font-size: 18px; }
        .meta-icon.orange { color: #1f2937; }
        .meta-icon.blue { color: #3b82f6; }
        .meta-icon.purple { color: #8b5cf6; }
        .meta-icon.green { color: #10b981; }

        .meta-text { display: flex; flex-direction: column; }
        .meta-text .label { font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; }
        .meta-text .value { font-size: 14px; font-weight: 600; color: #334155; }

        .job-description-section h4, .job-skills-section h4 {
          font-size: 14px;
          font-weight: 700;
          color: #020618;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .description-text { font-size: 14px; color: #64748b; line-height: 1.6; }

        .skills-cloud { display: flex; flex-wrap: wrap; gap: 8px; }
        .skill-tag {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          color: #475569;
        }

        .notes-section {
          padding: 24px;
          background: #fff7ed;
          border-radius: 20px;
          border: 1px solid #fed7aa;
        }

        .selection-header {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-bottom: 24px;
        }
        .selection-title { font-size: 18px; font-weight: 700; color: #020618; margin: 0; }
        .count-badge {
          background: #3b82f6;
          color: white;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
        }

        .talent-scroll-area {
          flex: 1;
          overflow-y: auto;
          margin-bottom: 24px;
          padding-right: 8px;
        }

        .talent-card-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border: 1px solid #f1f5f9;
          border-radius: 12px;
          margin-bottom: 12px;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .talent-card-row.selectable:hover {
          border-color: #cbd5e1;
          background: #f8fafc;
          transform: translateX(4px);
        }
        .talent-card-row.selected {
          background: #f5f3ff;
          border-color: #7c3aed;
        }

        .selection-indicator {
          width: 20px;
          height: 20px;
          border-radius: 6px;
          border: 2px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          transition: all 0.2s;
        }
        .selected .selection-indicator {
          background: #1f2937;
          border-color: #1f2937;
        }

        .initial-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: #64748b;
          font-size: 14px;
          overflow: hidden;
        }
        .initial-avatar img { width: 100%; height: 100%; object-fit: cover; }

        .t-info { flex: 1; }
        .t-name { font-weight: 700; color: #020618; font-size: 14px; }
        .t-role { font-size: 12px; color: #94a3b8; }

        .t-view-btn {
          background: white;
          border: 1px solid #e2e8f0;
          color: #64748b;
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 600;
          transition: all 0.2s;
        }
        .t-view-btn:hover { background: #f1f5f9; color: #020618; }

        .modal-footer-actions {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 12px;
          padding-top: 24px;
          border-top: 1px solid #f1f5f9;
        }

        .loading-overlay {
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.8);
          backdrop-filter: blur(4px);
          z-index: 100;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #f1f5f9;
          border-top-color: #1f2937;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .modal-close {
          position: absolute;
          top: 24px;
          right: 24px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: white;
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          cursor: pointer;
          z-index: 10;
          transition: all 0.2s;
        }
        .modal-close:hover { background: #fee2e2; color: #ef4444; border-color: #fecaca; }

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        .empty-state {
          padding: 40px 20px;
          text-align: center;
          color: #94a3b8;
          font-size: 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .desc-label { display: block; font-size: 11px; font-weight: 700; color: #1f2937; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em; }
        .desc-textarea {
          width: 100%;
          min-height: 100px;
          padding: 12px;
          border-radius: 12px;
          border: 1px solid #fed7aa;
          background: white;
          font-size: 14px;
          color: #020618;
          outline: none;
          resize: none;
          transition: all 0.2s;
        }
        .desc-textarea:focus { border-color: #1f2937; box-shadow: 0 0 0 4px rgba(245, 129, 12, 0.1); }
      `}</style>
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
