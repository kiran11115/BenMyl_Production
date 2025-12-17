import React, { useState } from "react";
import UploadTalentTable from "./UploadTalentTable";
import { talentsData } from "./talentsData";
import "./UploadTalent.css";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import UploadTalentModal from "./UploadTalentModal";

const UploadTalent = () => {
    const [showModal, setShowModal] = useState(false);

    // Handler to close the modal
    const handleCloseModal = () => setShowModal(false);

    // Handler to open the modal
    const handleShowModal = () => setShowModal(true);
    const [selectedEmails, setSelectedEmails] = useState(new Set());
    const navigate = useNavigate();

    const toggleSelect = (email) => {
        const updated = new Set(selectedEmails);
        updated.has(email) ? updated.delete(email) : updated.add(email);
        setSelectedEmails(updated);
    };

    return (
        <>
            <div className="d-flex align-items-center justify-content-between" style={{ padding: "24px 24px 0px 24px" }}>
                <div className="vp-breadcrumbs" >
                    <button
                        className="link-button"
                        onClick={() => navigate("/user/user-dashboard")}
                    >
                        <FiArrowLeft /> Back to Dashboard
                    </button>
                    <span className="crumb">/ Upload Talent</span>
                </div>

                <UploadTalentModal
                    show={showModal}
                    onHide={handleCloseModal}
                    onShow={handleShowModal}
                />
            </div>
            <div className="upload-talent-layout">
                {/* LEFT */}
                <div className="upload-main">
                    <UploadTalentTable
                        talents={talentsData}
                        selectedEmails={selectedEmails}
                        onToggleSelect={toggleSelect}
                    />
                </div>
            </div>
        </>
    );
};

export default UploadTalent;
