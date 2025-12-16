import React, { useState } from "react";
import UploadTalentTable from "./UploadTalentTable";
import { talentsData } from "./talentsData";
import "./UploadTalent.css";

const UploadTalent = () => {
    const [selectedEmails, setSelectedEmails] = useState(new Set());

    const toggleSelect = (email) => {
        const updated = new Set(selectedEmails);
        updated.has(email) ? updated.delete(email) : updated.add(email);
        setSelectedEmails(updated);
    };

    const selectedTalents = talentsData.filter((t) =>
        selectedEmails.has(t.email)
    );

    return (
        <div className="upload-talent-layout">

            <UploadTalentTable
                talents={talentsData}
                selectedEmails={selectedEmails}
                onToggleSelect={toggleSelect}
            />


            <div className="upload-cards-panel">
                <h3 className="section-title">Selected Talents</h3>

                {selectedTalents.length === 0 ? (
                    <div className="empty-state">Select talent from table</div>
                ) : (
                    selectedTalents.map((talent, i) => (
                        <div key={i} className="talent-card">
                            <div className="card-header">
                                <div className="avatar large">
                                    {talent.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </div>
                                <div>
                                    <div className="card-name">{talent.name}</div>
                                    <div className="card-role">{talent.role}</div>
                                </div>
                            </div>

                            <div className="card-info">
                                <span>📧 {talent.email}</span>
                                <span>📍 {talent.location}</span>
                            </div>

                            <div className="card-actions">
                                <button className="btn primary">View Profile</button>
                                <button
                                    className="btn secondary"
                                    onClick={() => toggleSelect(talent.email)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div >
    );
};

export default UploadTalent;
