import React from "react";
import { FiX, FiCheck, FiFileText, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

/**
 * Error Modal - Replicates the red "Submission Error" design
 */
export const SubmissionErrorModal = ({
    onClose,
    onRetry,
    onContactSupport
}) => {
    return (
        <div className="modal-overlay">
            <div className="alert-card error-theme">
                <button className="alert-close-icon" onClick={onClose}><FiX /></button>

                <div className="alert-content">
                    <div className="icon-circle error-icon-bg">
                        <FiX className="icon-main" />
                    </div>

                    <h3 className="alert-title">Submission Error</h3>
                    <p className="alert-message">
                        Your application could not be submitted at this time.
                        Please review the form for any errors.
                    </p>

                    <div className="error-list-container">
                        <span className="error-list-label">Common issues to check:</span>
                        <ul className="error-list">
                            <li><span className="bullet-icon"><FiFileText /></span> Missing required fields</li>
                            <li><span className="bullet-icon"><FiFileText /></span> Incorrect file format</li>
                            <li><span className="bullet-icon"><FiFileText /></span> Server error</li>
                        </ul>
                    </div>

                    <div className="link-button">
                        <button className="btn-alert-primary error-btn" onClick={onRetry}>
                            Try Again
                        </button>
                        <button className="btn-alert-text error-text-btn" onClick={onContactSupport}>
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Success Modal - Replicates the green "Success!" design
 */
export const SuccessModal = ({ onClose }) => {
    // 1. Initialize the hook
    const navigate = useNavigate();
    window.scrollTo(0, 0);

    return (
        <div className="modal-overlay">
            <div className="alert-card success-theme">
                <button className="alert-close-icon" onClick={onClose}><FiX /></button>

                <div className="alert-content left-align">
                    <div className="d-flex align-items-center gap-2 mb-3">
                        <div className="icon-circle success-icon-bg">
                            <FiCheck className="icon-main" />
                        </div>
                        <h3 className="alert-title mt-0 mb-0">Success!</h3>
                    </div>

                    <p className="alert-message mb-3">
                        The Job has been posted sucessfully.
                    </p>

                    <div className="alert-actions start">
                        {/* 2. Apply navigation on button click */}
                        <button
                            className="btn-primary w-100"
                            onClick={() => navigate("/user/user-talentpool")}
                        >
                            Find Talent
                        </button>

                        <button
                            className="btn-primary w-100"
                            onClick={() => navigate("/user/user-dashboard")}
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
