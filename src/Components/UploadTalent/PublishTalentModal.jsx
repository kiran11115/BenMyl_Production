import React, { useState } from "react";
import { createPortal } from "react-dom";
import { 
    FiX, FiCopy, FiMapPin, 
    FiLinkedin, FiFacebook, FiMail, 
    FiChevronDown, FiChevronUp, FiTrash2, FiEye 
} from "react-icons/fi";
import { FaPuzzlePiece } from "react-icons/fa";
import { GiCheckMark } from "react-icons/gi";

// Ensure you import your existing CSS file here if it's not global
// import "./PostNewPositions.css"; 

export default function PublishTalentModal({ 
    open, 
    onClose, 
    selectedTalents = [], 
    onRemove, 
    onPublish 
}) {
    const [status, setStatus] = useState("idle"); // idle, loading, success
    const [isVendorOpen, setIsVendorOpen] = useState(true);

    if (!open) return null;

    const handlePublish = () => {
        if (selectedTalents.length === 0) return;
        
        setStatus("loading");
        
        // Simulate API call 1 second
        setTimeout(() => {
            setStatus("idle"); // or 'success' if you want a success screen
            if (onPublish) onPublish();
            onClose(); // Close modal after publishing
        }, 1000);
    };

    // Prevent clicks inside modal from closing it
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget && status !== "loading") {
            onClose();
        }
    };

    return createPortal(
        <>
            <div className="modal-overlay" onClick={handleOverlayClick}>
                <div className="modal-window" style={{ height: "85vh", maxHeight: "800px", position: 'relative' }}>
                    
                    {/* --- LOADER OVERLAY --- */}
                    {status === "loading" && (
                        <div className="loading-overlay">
                            <div className="spinner"></div>
                            <div className="loading-text">Publishing {selectedTalents.length} Profiles...</div>
                        </div>
                    )}

                    <button className="modal-close" onClick={onClose} disabled={status === "loading"}>
                        <FiX />
                    </button>

                    <div className="modal-inner" style={{ height: "calc(100% - 80px)", overflow: "hidden" }}>
                        
                        {/* --- LEFT SIDE: SELECTED TALENTS --- */}
                        <div className="modal-left" style={{ overflowY: "auto", paddingRight: "10px" }}>
                            <div className="modal-top-row" style={{ display: 'block' }}>
                                <h2 className="modal-job-title" style={{ marginBottom: "6px" }}>Selected Candidates</h2>
                                <p className="muted small">
                                    Review the candidates you are about to publish to your network.
                                </p>
                            </div>

                            <hr className="modal-divider" style={{ margin: "16px 0" }} />

                            {selectedTalents.length === 0 ? (
                                <div className="empty-state">
                                    No candidates selected. Please close and select talents from the grid.
                                </div>
                            ) : (
                                <div className="talent-list">
                                    {selectedTalents.map((talent) => (
                                        <div key={talent.id} className="talent-card-row">
                                            {/* Avatar Section */}
                                            <img src={talent.avatar} alt={talent.name} className="t-avatar" />
                                            
                                            {/* Info Section */}
                                            <div className="t-info">
                                                <div className="t-header">
                                                    <span className="t-name">{talent.name}</span>
                                                    {talent.verified && (
                                                        <span className="t-verified" title="Verified">
                                                            <GiCheckMark />
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="t-role">{talent.role}</div>
                                                <div className="t-meta">
                                                    <span><FiMapPin size={10}/> {talent.location}</span>
                                                    <span className="bullet">•</span>
                                                    <span>{talent.experience}</span>
                                                </div>
                                            </div>

                                            {/* Actions Section (New Design) */}
                                            <div className="t-actions">
                                                <button className="btn-primary w-75" title="View Full Profile">
                                                    View Profile
                                                </button>
                                                <button 
                                                    className="t-remove-btn" 
                                                    onClick={() => onRemove(talent.id)}
                                                    disabled={status === "loading"}
                                                    title="Remove from batch"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* --- RIGHT SIDE: SHARE & VENDOR (Unchanged) --- */}
                        <aside className="modal-right">
                            <div className="share-card">
                                <h4 className="share-title">Share Profile Batch</h4>
                                
                                <div className="share-input-group">
                                    <label className="input-label">Batch Link</label>
                                    <div className="share-link-row">
                                        <input 
                                            className="share-input" 
                                            readOnly 
                                            value={`https://techstream.jobs/batch/${Date.now().toString().slice(-6)}`} 
                                        />
                                        <button className="copy-btn">
                                            <FiCopy /> Copy
                                        </button>
                                    </div>
                                </div>

                                <div className="social-buttons-stack">
                                    <button className="social-btn linkedin">
                                        <FiLinkedin className="social-icon" /> Share on LinkedIn
                                    </button>
                                    <button className="social-btn facebook">
                                        <FiFacebook className="social-icon" /> Share on Facebook
                                    </button>
                                    <button className="social-btn email">
                                        <FiMail className="social-icon" /> Share via Email
                                    </button>
                                </div>

                                <div className="vendor-section">
                                    <button 
                                        className="vendor-header" 
                                        onClick={() => setIsVendorOpen(!isVendorOpen)}
                                    >
                                        <div className="vendor-header-left">
                                            <FaPuzzlePiece className="puzzle-icon" />
                                            <span>Share with</span>
                                        </div>
                                        {isVendorOpen ? <FiChevronUp /> : <FiChevronDown />}
                                    </button>
                                    
                                    {isVendorOpen && (
                                        <div className="vendor-list">
                                            <label className="checkbox-row">
                                                <input type="checkbox" />
                                                <span>Premier Staffing Agency</span>
                                            </label>
                                            <label className="checkbox-row">
                                                <input type="checkbox" defaultChecked />
                                                <span>Tech Talent Finders</span>
                                            </label>
                                            <label className="checkbox-row">
                                                <input type="checkbox" defaultChecked />
                                                <span>DevHunters</span>
                                            </label>
                                            <label className="checkbox-row">
                                                <input type="checkbox" />
                                                <span>CodeSeeker Recruiting</span>
                                            </label>
                                            <label className="checkbox-row">
                                                <input type="checkbox" defaultChecked />
                                                <span>Elite Tech Staffing</span>
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </aside>
                    </div>

                    {/* --- FOOTER ACTIONS --- */}
                    <div className="modal-actions-left gap-3" style={{ padding: "24px", borderTop: "1px solid #e2e8f0" }}>
                        <button className="btn-secondary" onClick={onClose} disabled={status === "loading"}>
                            Back
                        </button>
                        <button 
                            onClick={handlePublish} 
                            className="btn-primary" 
                            style={{ width: "165px" }}
                            disabled={status === "loading" || selectedTalents.length === 0}
                        >
                            {status === "loading" ? "Publishing..." : "Publish Talent"}
                        </button>
                    </div>

                </div>
            </div>

            {/* --- INLINE STYLES FOR NEW ELEMENTS --- */}
            <style>{`
                .loading-overlay {
                    position: absolute; inset: 0; background: rgba(255,255,255,0.9);
                    z-index: 50; display: flex; flex-direction: column;
                    align-items: center; justify-content: center;
                }
                .spinner {
                    width: 32px; height: 32px; border: 3px solid #e2e8f0;
                    border-top-color: #3b82f6; border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                .loading-text { margin-top: 16px; color: #64748b; font-weight: 500; font-size: 14px; }

                .talent-list { display: flex; flex-direction: column; gap: 12px; }
                
                /* Updated Card Design */
                .talent-card-row {
                    display: grid; 
                    grid-template-columns: auto 1fr auto; /* Avatar | Info | Actions */
                    align-items: center; 
                    gap: 16px;
                    padding: 16px; 
                    border: 1px solid #e2e8f0; 
                    border-radius: 10px;
                    background: white; 
                    transition: all 0.2s ease;
                }
                .talent-card-row:hover { 
                    border-color: #cbd5e1; 
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); 
                }
                
                .t-avatar { 
                    width: 48px; height: 48px; 
                    border-radius: 50%; /* Circular avatar looks more modern */
                    object-fit: cover; 
                    border: 2px solid #f1f5f9;
                }
                
                .t-info { display: flex; flex-direction: column; gap: 2px; }
                .t-header { display: flex; align-items: center; gap: 6px; }
                .t-name { font-weight: 700; color: #1e293b; font-size: 15px; }
                .t-verified { color: #059669; display: flex; align-items: center; font-size: 14px; }
                
                .t-role { 
                    color: #3b82f6; /* Blue for role */
                    font-weight: 500; 
                    font-size: 13px; 
                }
                
                .t-meta { 
                    display: flex; align-items: center; gap: 6px; 
                    color: #64748b; font-size: 12px; margin-top: 2px;
                }
                .bullet { color: #cbd5e1; }

                /* Action Buttons */
                .t-actions {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .t-remove-btn {
                    background: transparent; 
                    border: 1px solid transparent; 
                    color: #94a3b8;
                    cursor: pointer; 
                    padding: 6px; 
                    border-radius: 6px; 
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .t-remove-btn:hover { 
                    background: #fee2e2; 
                    color: #ef4444; 
                    border-color: #fecaca;
                }
                
                .empty-state {
                    padding: 32px; text-align: center; color: #94a3b8; font-size: 14px;
                    border: 2px dashed #e2e8f0; border-radius: 8px; background: #f8fafc;
                }
            `}</style>
        </>,
        document.body
    );
}
