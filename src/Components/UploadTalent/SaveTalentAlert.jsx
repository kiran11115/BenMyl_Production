import React from "react";
import { FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

/* ================= ILLUSTRATIONS ================= */

const ValidationIllustration = () => (
  <div className="alert-graphic-wrapper">
    <svg width="64" height="64" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="30" fill="#fee2e2" />
      <path d="M32 18 V38 M32 46 H32.01" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
    </svg>
  </div>
);

const SaveConfirmIllustration = () => (
  <div className="alert-graphic-wrapper">
    <svg width="64" height="64" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="30" fill="#e0e7ff" />
      <path d="M22 42 V22 H36 L42 28 V42 Z" stroke="#4f46e5" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M26 22 V30 H34 V22" stroke="#4f46e5" strokeWidth="3.5" fill="none" />
    </svg>
  </div>
);

const SuccessIllustration = () => (
  <div className="alert-graphic-wrapper">
    <svg width="64" height="64" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="30" fill="#dcfce7" />
      <path d="M20 32 L28 40 L44 24" stroke="#16a34a" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

const WarningIllustration = () => (
  <div className="alert-graphic-wrapper">
    <svg width="64" height="64" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="30" fill="#ffedd5" />
      <path d="M32 18 L48 46 H16 Z" stroke="#d97706" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M32 28 V38 M32 42 H32.01" stroke="#d97706" strokeWidth="3" strokeLinecap="round" />
    </svg>
  </div>
);

const ErrorIllustration = () => (
  <div className="alert-graphic-wrapper">
    <svg width="64" height="64" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="30" fill="#fee2e2" />
      <path d="M22 22 L42 42 M42 22 L22 42" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
    </svg>
  </div>
);

const DeleteIllustration = () => (
  <div className="alert-graphic-wrapper">
    <svg width="64" height="64" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="30" fill="#fee2e2" />
      <path d="M20 24 H44 M24 24 V44 A4 4 0 0 0 28 48 H36 A4 4 0 0 0 40 44 V24 M28 20 H36" stroke="#ef4444" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M29 30 V40 M35 30 V40" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
    </svg>
  </div>
);

/* ================= STYLE SHEETS ================= */

const AlertStyles = () => (
  <style jsx="true">{`
    .custom-talent-alert-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.45);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100000;
      animation: talentAlertFadeIn 0.25s ease-out;
      font-family: 'Inter', -apple-system, sans-serif;
    }

    .custom-talent-alert-card {
      width: min(440px, calc(100vw - 32px));
      background: #fafaf9; /* Cream/off-white tone */
      border-radius: 24px;
      padding: 40px 32px 32px;
      box-shadow: 
        0 20px 48px -10px rgba(15, 23, 42, 0.18),
        0 8px 16px -4px rgba(15, 23, 42, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.7);
      text-align: center;
      position: relative;
      animation: talentAlertSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      overflow: hidden;
    }

    .custom-talent-alert-close-btn {
      position: absolute;
      top: 20px;
      right: 20px;
      border: none;
      background: #f1f0ee;
      color: #78716c;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      outline: none;
    }

    .custom-talent-alert-close-btn:hover {
      background: #e7e5e4;
      color: #1c1917;
      transform: rotate(90deg);
    }

    .custom-talent-alert-body-container {
      margin-bottom: 28px;
    }

    .alert-graphic-wrapper {
      display: flex;
      justify-content: center;
      margin-bottom: 24px;
    }

    .custom-talent-alert-title {
      font-family: 'Playfair Display', 'Georgia', 'Times New Roman', serif;
      font-size: 24px;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 12px 0;
      line-height: 1.25;
    }

    .custom-talent-alert-message {
      font-size: 14px;
      color: #64748b;
      line-height: 1.6;
      margin: 0 0 16px 0;
      padding: 0 8px;
    }

    .custom-talent-alert-actions-row {
      display: flex;
      gap: 12px;
      justify-content: center;
      width: 100%;
    }

    .custom-talent-alert-secondary-btn {
      flex: 1;
      background: #ffffff;
      color: #475569;
      border: 1px solid #e2e8f0;
      padding: 14px 24px;
      font-size: 14px;
      font-weight: 600;
      border-radius: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
      outline: none;
    }

    .custom-talent-alert-secondary-btn:hover {
      background: #f8fafc;
      color: #0f172a;
      border-color: #cbd5e1;
    }

    .custom-talent-alert-primary-btn {
      flex: 1.2;
      background: #7c5dfa;
      color: #ffffff;
      border: none;
      padding: 14px 24px;
      font-size: 14px;
      font-weight: 600;
      border-radius: 14px;
      cursor: pointer;
      box-shadow: 0 8px 16px -4px rgba(124, 93, 250, 0.35);
      transition: all 0.2s ease;
      outline: none;
    }

    .custom-talent-alert-primary-btn:hover {
      background: #6344d6;
      transform: translateY(-1px);
      box-shadow: 0 10px 20px -2px rgba(124, 93, 250, 0.45);
    }

    .custom-talent-alert-primary-btn.btn-danger-red {
      background: #ef4444;
      box-shadow: 0 8px 16px -4px rgba(239, 68, 68, 0.35);
    }

    .custom-talent-alert-primary-btn.btn-danger-red:hover {
      background: #dc2626;
      box-shadow: 0 10px 20px -2px rgba(239, 68, 68, 0.45);
    }

    @keyframes talentAlertFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes talentAlertSlideUp {
      from {
        opacity: 0;
        transform: translateY(24px) scale(0.96);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
  `}</style>
);

/* ================= MODAL COMPONENTS ================= */

export const ValidationErrorModal = ({
  errors = [],
  onClose,
  onRetry,
}) => {
  return (
    <div className="custom-talent-alert-overlay">
      <AlertStyles />
      <div className="custom-talent-alert-card">
        <button className="custom-talent-alert-close-btn" onClick={onClose} aria-label="Close">
          <FiX size={18} />
        </button>

        <div className="custom-talent-alert-body-container">
          <ValidationIllustration />
          <h2 className="custom-talent-alert-title">Submission Error</h2>
          <p className="custom-talent-alert-message" style={{ marginBottom: "16px" }}>
            We encountered issues with the profile data. Please review the errors listed below:
          </p>

          <div style={{ maxHeight: "200px", overflowY: "auto", textAlign: "left", display: "flex", flexDirection: "column", gap: "10px" }}>
            {Array.isArray(errors) ? (
              errors.map((err, idx) => (
                <div key={idx} style={{ 
                  display: "flex", 
                  gap: "10px", 
                  padding: "10px 14px", 
                  backgroundColor: "rgba(239, 68, 68, 0.04)", 
                  borderRadius: "10px",
                  border: "1px solid rgba(239, 68, 68, 0.08)",
                  color: "#475569",
                  fontSize: "13px",
                  lineHeight: "1.5"
                }}>
                  <span style={{ color: "#ef4444", fontWeight: 700 }}>•</span>
                  <span>{err}</span>
                </div>
              ))
            ) : (
              <div style={{ 
                padding: "10px 14px", 
                backgroundColor: "rgba(239, 68, 68, 0.04)", 
                borderRadius: "10px",
                border: "1px solid rgba(239, 68, 68, 0.08)",
                color: "#475569",
                fontSize: "13px"
              }}>
                {errors}
              </div>
            )}
          </div>
        </div>

        <div className="custom-talent-alert-actions-row">
          <button className="custom-talent-alert-primary-btn btn-danger-red" onClick={onRetry}>
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export const ConfirmSaveModal = ({ onClose, onConfirm }) => {
  return (
    <div className="custom-talent-alert-overlay">
      <AlertStyles />
      <div className="custom-talent-alert-card">
        <button className="custom-talent-alert-close-btn" onClick={onClose} aria-label="Close">
          <FiX size={18} />
        </button>

        <div className="custom-talent-alert-body-container">
          <SaveConfirmIllustration />
          <h2 className="custom-talent-alert-title">Save Talent</h2>
          <p className="custom-talent-alert-message">
            Are you sure you want to save this talent? This will submit the profile to the system for review.
          </p>
        </div>

        <div className="custom-talent-alert-actions-row">
          <button className="custom-talent-alert-secondary-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="custom-talent-alert-primary-btn" onClick={onConfirm}>
            Yes, Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export const SaveSuccessModal = ({ onClose }) => {
  const navigate = useNavigate();
  return (
    <div className="custom-talent-alert-overlay">
      <AlertStyles />
      <div className="custom-talent-alert-card">
        <div className="custom-talent-alert-body-container">
          <SuccessIllustration />
          <h2 className="custom-talent-alert-title">Saved Successfully</h2>
          <p className="custom-talent-alert-message">
            The talent profile has been securely added to the system and is now ready for further actions.
          </p>
        </div>

        <div className="custom-talent-alert-actions-row">
          <button
            className="custom-talent-alert-secondary-btn"
            onClick={() => {
              const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/User';
              navigate(`${basePath}/upload-review-talent`);
              if (onClose) onClose();
            }}
          >
            Continue Review
          </button>
          <button
            className="custom-talent-alert-primary-btn"
            onClick={() => {
              const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
              const targetPath = window.location.pathname.toLowerCase().startsWith('/admin') ? `${basePath}/admin-upload-talent` : `${basePath}/user-upload-talent`;
              navigate(targetPath);
              if (onClose) onClose();
            }}
          >
            Review Profiles
          </button>
        </div>
      </div>
    </div>
  );
};

export const AlreadyExistModal = ({ onClose, message }) => {
  const navigate = useNavigate();
  return (
    <div className="custom-talent-alert-overlay">
      <AlertStyles />
      <div className="custom-talent-alert-card">
        <button className="custom-talent-alert-close-btn" onClick={onClose} aria-label="Close">
          <FiX size={18} />
        </button>

        <div className="custom-talent-alert-body-container">
          <WarningIllustration />
          <h2 className="custom-talent-alert-title">Profile Exists</h2>
          <p className="custom-talent-alert-message">
            {message || "This talent profile already exists in our active records."}
          </p>
        </div>

        <div className="custom-talent-alert-actions-row">
          <button
            className="custom-talent-alert-primary-btn"
            onClick={() => {
              const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
              const targetPath = window.location.pathname.toLowerCase().startsWith('/admin') ? `${basePath}/admin-upload-talent` : `${basePath}/user-upload-talent`;
              navigate(targetPath, {
                state: { activeTab: "Review" },
              });
              if (onClose) onClose();
            }}
          >
            View Review Profiles
          </button>
        </div>
      </div>
    </div>
  );
};

export const SaveErrorModal = ({ onClose, onRetry }) => {
  return (
    <div className="custom-talent-alert-overlay">
      <AlertStyles />
      <div className="custom-talent-alert-card">
        <button className="custom-talent-alert-close-btn" onClick={onClose} aria-label="Close">
          <FiX size={18} />
        </button>

        <div className="custom-talent-alert-body-container">
          <ErrorIllustration />
          <h2 className="custom-talent-alert-title">Save Failed</h2>
          <p className="custom-talent-alert-message">
            There was a problem saving the talent profile. Please try again or contact support if the issue persists.
          </p>
        </div>

        <div className="custom-talent-alert-actions-row">
          <button className="custom-talent-alert-secondary-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="custom-talent-alert-primary-btn btn-danger-red" onClick={onRetry}>
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export const DeleteConfirmModal = ({
  onClose,
  onConfirm,
  title = "Delete Draft",
  message = "Are you sure you want to delete this draft employee?",
  note = "This action is permanent and will remove the draft record from the system.",
  confirmText = "Yes, Delete",
}) => {
  return (
    <div className="custom-talent-alert-overlay">
      <AlertStyles />
      <div className="custom-talent-alert-card">
        <button className="custom-talent-alert-close-btn" onClick={onClose} aria-label="Close">
          <FiX size={18} />
        </button>

        <div className="custom-talent-alert-body-container">
          <DeleteIllustration />
          <h2 className="custom-talent-alert-title">{title}</h2>
          <p className="custom-talent-alert-message" style={{ marginBottom: "16px" }}>
            {message}
          </p>
          <div style={{ background: "rgba(239, 68, 68, 0.04)", padding: "12px 16px", borderRadius: "12px", border: "1px solid rgba(239, 68, 68, 0.08)", textAlign: "left" }}>
            <p style={{ color: "#b91c1c", fontSize: "12.5px", margin: 0, fontWeight: 600, lineHeight: 1.4 }}>
              NOTE: {note}
            </p>
          </div>
        </div>

        <div className="custom-talent-alert-actions-row">
          <button className="custom-talent-alert-secondary-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="custom-talent-alert-primary-btn btn-danger-red" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValidationErrorModal;
