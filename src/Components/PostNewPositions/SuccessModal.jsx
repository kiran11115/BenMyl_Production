import React from "react";
import { FiX, FiCheck, FiFileText, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

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
                    <h3 className="alert-title">Success!</h3>
                </div>

                <div className="alert-body">
                    <p className="alert-message">
                        The Job has been posted successfully.
                    </p>
                </div>

                <div className="alert-footer" style={{ flexDirection: "column", gap: "12px" }}>
                    <button
                        className="btn-alert-primary"
                        onClick={() => {
                            const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
                            const targetPath = window.location.pathname.toLowerCase().startsWith('/admin') ? `${basePath}/admin-talentpool` : `${basePath}/user-talentpool`;
                            navigate(targetPath);
                        }}
                    >
                        Find Talent
                    </button>

                    <button
                        className="btn-secondary"
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
    );
};