import React from "react";
import { FiX, FiCheck, FiAlertTriangle, FiTrash2, FiFileText } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export const ValidationErrorModal = ({
  errors = [],
  onClose,
  onRetry,
}) => {
  return (
    <div className="modal-overlay">
      <div className="alert-card error-theme">
        <button className="alert-close-icon" onClick={onClose}>
          <FiX size={20} />
        </button>

        <div className="alert-header">
          <div className="alert-icon-wrapper">
            <FiX />
          </div>
          <h3 className="alert-title">Submission Error</h3>
        </div>

        <div className="alert-body" style={{ maxHeight: "300px", overflowY: "auto", textAlign: "left" }}>
          <div className="alert-message">
            {Array.isArray(errors) ? (
              <div className="submission-error-list" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {errors.map((err, idx) => (
                  <div key={idx} style={{ 
                    display: "flex", 
                    gap: "12px", 
                    padding: "10px 14px", 
                    backgroundColor: "rgba(239, 68, 68, 0.05)", 
                    borderRadius: "10px",
                    border: "1px solid rgba(239, 68, 68, 0.1)",
                    color: "#475569",
                    fontSize: "13px",
                    lineHeight: "1.5"
                  }}>
                    <FiFileText size={16} style={{ color: "#ef4444", marginTop: "2px", flexShrink: 0 }} /> 
                    <span>{err}</span>
                  </div>
                ))}
              </div>
            ) : (
              errors
            )}
          </div>
        </div>

        <div className="alert-footer">
          <button className="btn-alert-primary btn-alert-error" onClick={onRetry}>
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export const ConfirmSaveModal = ({ onClose, onConfirm }) => {
  return (
    <div className="modal-overlay">
      <div className="alert-card info-theme">
        <button className="alert-close-icon" onClick={onClose}>
          <FiX size={20} />
        </button>

        <div className="alert-header">
          <div className="alert-icon-wrapper">
            <FiAlertTriangle />
          </div>
          <h3 className="alert-title">Save Talent</h3>
        </div>

        <div className="alert-body">
          <p className="alert-message">
            Are you sure you want to save this talent? This will submit the profile to the system for review.
          </p>
        </div>

        <div className="alert-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-alert-primary" onClick={onConfirm}>
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
    <div className="modal-overlay">
      <div className="alert-card success-theme">
        <div className="alert-header">
          <div className="alert-icon-wrapper">
            <FiCheck />
          </div>
          <h3 className="alert-title">Saved Successfully</h3>
        </div>

        <div className="alert-body">
          <p className="alert-message">
            The talent profile has been securely added to the system and is now ready for further actions.
          </p>
        </div>

        <div className="alert-footer">
          <button
            className="btn-alert-primary"
            onClick={() => {
              const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
              const targetPath = window.location.pathname.toLowerCase().startsWith('/admin') ? `${basePath}/admin-upload-talent` : `${basePath}/user-upload-talent`;
              navigate(targetPath);
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
    <div className="modal-overlay">
      <div className="alert-card info-theme">
        <button className="alert-close-icon" onClick={onClose}>
          <FiX size={20} />
        </button>

        <div className="alert-header">
          <div className="alert-icon-wrapper">
            <FiAlertTriangle />
          </div>
          <h3 className="alert-title">Profile Exists</h3>
        </div>

        <div className="alert-body">
          <p className="alert-message">
            {message || "This talent profile already exists in our active records."}
          </p>
        </div>

        <div className="alert-footer">
          <button
            className="btn-alert-primary"
            onClick={() => {
              const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
              const targetPath = window.location.pathname.toLowerCase().startsWith('/admin') ? `${basePath}/admin-upload-talent` : `${basePath}/user-upload-talent`;
              navigate(targetPath, {
                state: { activeTab: "Review" },
              });
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
    <div className="modal-overlay">
      <div className="alert-card error-theme">
        <button className="alert-close-icon" onClick={onClose}>
          <FiX size={20} />
        </button>

        <div className="alert-header">
          <div className="alert-icon-wrapper">
            <FiX />
          </div>
          <h3 className="alert-title">Save Failed</h3>
        </div>

        <div className="alert-body">
          <p className="alert-message">
            There was a problem saving the talent profile. Please try again or contact support if the issue persists.
          </p>
        </div>

        <div className="alert-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-alert-primary btn-alert-error" onClick={onRetry}>
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
    <div className="modal-overlay">
      <div className="alert-card error-theme">
        <button className="alert-close-icon" onClick={onClose}>
          <FiX size={20} />
        </button>

        <div className="alert-header">
          <div className="alert-icon-wrapper">
            <FiTrash2 />
          </div>
          <h3 className="alert-title">{title}</h3>
        </div>

        <div className="alert-body">
          <p className="alert-message" style={{ marginBottom: "16px" }}>
            {message}
          </p>
          <div style={{ background: "#fff5f5", padding: "12px", borderRadius: "12px", border: "1px solid #fee2e2", textAlign: "left" }}>
            <p style={{ color: "#991b1b", fontSize: "12px", margin: 0, fontWeight: 600 }}>
              NOTE: {note}
            </p>
          </div>
        </div>

        <div className="alert-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-alert-primary btn-alert-error" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValidationErrorModal;
