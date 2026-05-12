import React from "react";
import { FiX, FiCheck, FiFileText } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

/**
 * Error Modal - Replicates the red "Submission Error" design
 */
export const SubmissionErrorModal = ({
    onClose,
    onRetry,
    message,
    extraAction
}) => {
    return (
        <div className="modal-overlay">
            <div className="alert-card error-theme">
                <button className="alert-close-icon" onClick={onClose}><FiX size={20} /></button>

                <div className="alert-header">
                    <div className="alert-icon-wrapper">
                        <FiX />
                    </div>
                    <h3 className="alert-title">Submission Error</h3>
                </div>

                <div className="alert-body">
                    <p className="alert-message">
                        {message || "Your application could not be submitted at this time. Please review the form for any errors."}
                    </p>
                </div>

                <div className="alert-footer">
                    <button className="btn-secondary" onClick={onClose}>
                        Close
                    </button>
                    {extraAction && (
                        <button className="btn-alert-primary" onClick={extraAction.onClick}>
                            {extraAction.label}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

/**
 * Success Modal - Replicates the green "Success!" design
 */
export const SuccessModal = ({ onClose }) => {
    const navigate = useNavigate();
    window.scrollTo(0, 0);

    return (
        <div className="modal-overlay">
            <div className="alert-card success-theme">
                <button className="alert-close-icon" onClick={onClose}><FiX size={20} /></button>

                <div className="alert-header">
                    <div className="alert-icon-wrapper">
                        <FiCheck />
                    </div>
                    <h3 className="alert-title">Welcome back!</h3>
                </div>

                <div className="alert-body">
                    <p className="alert-message">
                        Choose an option below to continue with your daily tasks quickly and easily.
                    </p>
                </div>

                <div className="alert-footer" style={{ flexDirection: "column", gap: "12px" }}>
                    <button
                        className="btn-alert-primary"
                        onClick={() => navigate("/user/user-post-new-positions")}
                    >
                        Post Project
                    </button>
                    <button
                        className="btn-secondary"
                        style={{ width: "100%" }}
                        onClick={() => navigate("/user/user-upload-talent")}
                    >
                        Upload Talent
                    </button>
                </div>
            </div>
        </div>
    );
};
