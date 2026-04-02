import React from "react";
import { FiX, FiCheck, FiAlertTriangle, FiFileText } from "react-icons/fi";
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

        <div className="alert-body">
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
          <button className="btn-alert-secondary" onClick={onClose}>
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
            onClick={() => navigate("/user/user-upload-talent")}
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
            onClick={() =>
              navigate("/user/user-upload-talent", {
                state: { activeTab: "Review" },
              })
            }
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
          <button className="btn-alert-secondary" onClick={onClose}>
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

export default ValidationErrorModal;
