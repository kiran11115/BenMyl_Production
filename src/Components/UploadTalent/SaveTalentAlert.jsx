import React from "react";
import { FiX, FiCheck, FiAlertTriangle, FiFileText } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export const ValidationErrorModal = ({ errors = [], onClose, onRetry, onContactSupport }) => {
  return (
    <div className="modal-overlay">
      <div className="alert-card error-theme">
        <button className="alert-close-icon" onClick={onClose}><FiX /></button>

        <div className="alert-content">
          <div className="d-flex gap-3 align-items-center">
            <div className="icon-circle error-icon-bg">
              <FiX className="icon-main" />
            </div>
            <div className="d-flex flex-column">
              <h3 className="alert-title">Submission Error</h3>
              <div className="alert-message" style={{ textAlign: "left" }}>
                {Array.isArray(errors) ? (
                  <ul style={{ margin: 0, paddingLeft: "1.2rem", listStyleType: "disc" }}>
                    {errors.map((err, idx) => (
                      <li key={idx} style={{ marginBottom: "4px" }}>{err}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{errors}</p>
                )}
              </div>
            </div>
          </div>
          <div className="link-button" style={{ marginTop: 24 }}>
            <button className="btn-alert-primary error-btn w-100" onClick={onRetry}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ConfirmSaveModal = ({ onClose, onConfirm }) => {
  return (
    <div className="modal-overlay">
      <div className="alert-card info-theme">
        <button className="alert-close-icon" onClick={onClose}><FiX /></button>

        <div className="alert-content">
          <div className="icon-circle info-icon-bg">
            <FiAlertTriangle className="icon-main" />
          </div>

          <h3 className="alert-title">Save Talent</h3>
          <p className="alert-message">Are you sure you want to save this talent? This will submit the profile to the system.</p>

          <div className="link-button">
            <button className="btn-alert-primary" onClick={onConfirm}>Save</button>
            <button className="btn-alert-text" onClick={onClose}>Cancel</button>
          </div>
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

        <div className="alert-content left-align">
          <div className="d-flex align-items-center gap-2 mb-3">
            <div className="icon-circle success-icon-bg">
              <FiCheck className="icon-main" />
            </div>
            <h3 className="alert-title mt-0 mb-0">Saved successfully</h3>
          </div>

          <p className="alert-message mb-3">The talent profile was saved successfully.</p>

          <div className="alert-actions start">
            <button className="btn-primary w-100" onClick={() => navigate("/user/user-upload-talent")}>Back to Talent Profiles</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SaveErrorModal = ({ onClose, onRetry }) => {
  return (
    <div className="modal-overlay">
      <div className="alert-card error-theme">
        <button className="alert-close-icon" onClick={onClose}><FiX /></button>

        <div className="alert-content">
          <div className="d-flex gap-3 align-items-center">
            <div className="icon-circle error-icon-bg">
              <FiX className="icon-main" />
            </div>
            <div className="d-flex flex-column">
              <h3 className="alert-title">Save Failed</h3>
              <p className="alert-message">There was a problem saving the talent. Please try again.</p>
            </div>
          </div>
          <div className="link-button">
            <button className="btn-alert-primary error-btn" onClick={onRetry}>Try Again</button>
            <button className="btn-alert-text error-text-btn" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidationErrorModal;