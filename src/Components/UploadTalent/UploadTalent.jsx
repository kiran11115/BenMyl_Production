import React, { useState } from "react";
import UploadTalentTable from "./UploadTalentTable";
import { talentsData } from "./talentsData";
import "./UploadTalent.css";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import UploadTalentModal from "./UploadTalentModal";
import UserTalentProfiles from "./UserTalentProfiles";

const UploadTalent = () => {
    const [showModal, setShowModal] = useState(false);
    const [view, setView] = useState("Review");

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
            {/* <div className="d-flex align-items-center justify-content-between" style={{ padding: "24px 24px 0px 24px" }}>
                <div className="vp-breadcrumbs d-flex gap-1" >
                    <button
                        className="link-button"
                        onClick={() => navigate("/user/user-dashboard")}
                    >
                        <FiArrowLeft /> Back to Dashboard
                    </button>
                    <span className="crumb">/ Upload Talent</span>
                </div>

            </div> */}
            <div className="upload-talent-layout">
                <div className="d-flex align-items-center gap-2 justify-content-between">
                    {/* TOGGLE BUTTONS */}
                    <div className="view-toggle1">
                        <button
                            className={`toggle ${view === "Review" ? "active" : ""}`}
                            onClick={() => setView("Review")}
                        >
                            Review Profiles
                        </button>

                        <button
                            className={`toggle ${view === "Talent" ? "active" : ""}`}
                            onClick={() => setView("Talent")}
                        >
                            Talent Profiles
                        </button>
                    </div>

                    <UploadTalentModal
                        show={showModal}
                        onHide={handleCloseModal}
                        onShow={handleShowModal}
                    />
                </div>

                {/* CONTENT */}
                <div className="view-content">
                    {view === "Talent" &&
                        <>
                            <div className="upload-main mt-3">
                                <UserTalentProfiles />
                            </div>
                        </>
                    }
                    {view === "Review" &&
                        <>
                            <div className="upload-main mt-3">
                                <UploadTalentTable
                                    talents={talentsData}
                                    selectedEmails={selectedEmails}
                                    onToggleSelect={toggleSelect}
                                />
                            </div >
                        </>
                    }
                </div>
            </div>
        </>
    );
};

export default UploadTalent;
