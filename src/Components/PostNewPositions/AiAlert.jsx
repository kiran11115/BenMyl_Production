import React from "react";
import { FiX, FiCheck, FiFileText } from "react-icons/fi";
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
            <div className="alert-card error-theme submission-error-card">
                <button className="alert-close-icon" onClick={onClose}><FiX /></button>

                <div className="submission-error-header">
                    <div className="alert-icon-wrapper">
                        <FiX />
                    </div>
                    <h3 className="alert-title">Submission Error</h3>
                </div>

                <div className="submission-error-body">
                    <p className="alert-message">
                        Your application could not be submitted at this time.
                        Please review the form for any errors.
                    </p>

                    <div className="submission-error-list-container">
                        <span className="submission-error-list-label">Common issues to check:</span>
                        <ul className="submission-error-list">
                            <li><span><FiFileText /></span> Missing required fields</li>
                            <li><span><FiFileText /></span> Incorrect file format</li>
                            <li><span><FiFileText /></span> Server error</li>
                        </ul>
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

                    <p className="alert-message mb-2">
                        The Job has been posted sucessfully.
                    </p>

                    <div className="alert-actions start">
                        {/* 2. Apply navigation on button click */}
                        <button
                            className="btn-primary w-100"
                            onClick={() => {
                                const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
                                const targetPath = window.location.pathname.toLowerCase().startsWith('/admin') ? `${basePath}/admin-talentpool` : `${basePath}/user-talentpool`;
                                navigate(targetPath);
                            }}
                        >
                            Find Talent
                        </button>

                         <button
                            className="btn-primary w-100"
                            onClick={() => {
                                const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
                                const targetPath = window.location.pathname.toLowerCase().startsWith('/admin') ? `${basePath}/portal` : `${basePath}/user-dashboard`;
                                navigate(targetPath);
                            }}
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
