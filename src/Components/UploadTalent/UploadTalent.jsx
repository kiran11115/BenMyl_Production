import React, { useState } from "react";
import UploadTalentTable from "./UploadTalentTable";
import { talentsData } from "./talentsData";
import "./UploadTalent.css";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import DocPickerButton from "./DocPickerButton";

const UploadTalent = () => {
    const [selectedEmails, setSelectedEmails] = useState(new Set());
    const navigate = useNavigate();

    const toggleSelect = (email) => {
        const updated = new Set(selectedEmails);
        updated.has(email) ? updated.delete(email) : updated.add(email);
        setSelectedEmails(updated);
    };

    return (
        <>
            <div className="vp-breadcrumbs" style={{padding: "24px 24px 0px 24px"}}>
                <button
                    className="link-button"
                    onClick={() => navigate("/user/user-dashboard")}
                >
                    <FiArrowLeft /> Back to Dashboard
                </button>
                <span className="crumb">/ Upload Talent</span>
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

                {/* RIGHT */}
                <div className="upload-cards-panel">
                    <DocPickerButton />
                </div>
            </div>
        </>
    );
};

export default UploadTalent;
