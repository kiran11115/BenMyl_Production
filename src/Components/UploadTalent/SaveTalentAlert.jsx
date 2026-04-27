import React from "react";
import { FiX, FiCheck, FiAlertTriangle, FiTrash2 } from "react-icons/fi";
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

        <div className="alert-body"
          style={{
            maxHeight: "300px",   // 👈 control height
            overflowY: "auto",    // 👈 enable scroll
            paddingRight: "6px"
          }}>
          <div className="alert-message">
            {Array.isArray(errors) ? (
              <ul style={{ margin: 0, padding: 0, listStyleType: "none" }}>
                {errors.map((err, idx) => (
                  <li key={idx} style={{ marginBottom: "6px" }}>
                    • {err}
                  </li>
                ))}
              </ul>
            ) : (
              errors
            )}
          </div>
        </div>

        <div className="alert-footer">
          <button
            className="btn-alert-primary btn-alert-error"
            onClick={onRetry}
          >
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
            Are you sure you want to save this talent? This will submit the
            profile to the system for review.
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
            The talent profile has been securely added to the system and is now
            ready for further actions.
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
            There was a problem saving the talent profile. Please try again or contact
            support if the issue persists.
          </p>
        </div>

        <div className="alert-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-alert-primary btn-alert-error"
            onClick={onRetry}
          >
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
  note = "This action is permanent and will remove the draft record from the system. It cannot be undone.",
  confirmText = "Yes, Delete",
}) => {
  return (
    <div className="delete-confirm-overlay">
      <div className="delete-confirm-card" role="dialog" aria-modal="true" aria-labelledby="delete-draft-title">
        <button className="delete-confirm-close" onClick={onClose} aria-label="Close delete confirmation">
          <FiX size={20} />
        </button>

        <div className="delete-confirm-header">
          <div className="delete-confirm-icon">
            <FiTrash2 size={28} />
          </div>
          <h3 className="delete-confirm-title" id="delete-draft-title">{title}</h3>
        </div>

        <div className="delete-confirm-body">
          <p className="delete-confirm-message">
            {message}
          </p>
          <div className="delete-confirm-note">
            <div className="delete-confirm-note-title">
              <FiAlertTriangle size={16} /> NOTE:
            </div>
            <p>
              {note}
            </p>
          </div>
        </div>

        <div className="delete-confirm-footer">
          <button className="delete-confirm-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="delete-confirm-action"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValidationErrorModal;
