import React, { useEffect, useState } from "react";
import UploadTalentTable from "./UploadTalentTable";
import { talentsData } from "./talentsData";
import "./UploadTalent.css";
import { FiArrowLeft } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import UploadTalentModal from "./UploadTalentModal";
import UserTalentProfiles from "./UserTalentProfiles";
import NoData from "../UploadTalent/NoData"; // adjust path if needed


const UploadTalent = () => {
    const [showModal, setShowModal] = useState(false);
    const location = useLocation();

const [view, setView] = useState(
  location.state?.activeTab || "Talent"
);

useEffect(() => {
  if (location.state?.activeTab) {
    setView(location.state.activeTab);
  }
}, [location.state]);

    const [refreshKey, setRefreshKey] = useState(0);
    const [showUploading, setShowUploading] = useState(false);
    const [showUploadedSuccess, setShowUploadedSuccess] = useState(false);
    const [showUploadError, setShowUploadError] = useState(false);
    const [uploadErrorMessage, setUploadErrorMessage] = useState("");
    const [waitingForRefresh, setWaitingForRefresh] = useState(false);

    const handleUploadSuccess = (message) => {
  if (message && String(message).toLowerCase().includes("fail")) {
    setUploadErrorMessage(message);
    setShowUploadError(true);
    setTimeout(() => setShowUploadError(false), 10000);
    return;
  }

  setShowUploadedSuccess(true);
  setTimeout(() => setShowUploadedSuccess(false), 10000);

  // 🔥 Start showing loading in table
  setWaitingForRefresh(true);

  // ⏳ Wait 20 seconds
  setTimeout(() => {
    setRefreshKey((prev) => prev + 1);
    setWaitingForRefresh(false); // stop loading after refresh starts
  }, 20000);
};

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
                            className={`toggle ${view === "Talent" ? "active" : ""}`}
                            onClick={() => setView("Talent")}
                        >
                            Talent Profiles
                        </button>
                        <button
                            className={`toggle ${view === "Review" ? "active" : ""}`}
                            onClick={() => setView("Review")}
                        >
                            Review Profiles
                        </button>

                    </div>

                    <UploadTalentModal
                        show={showModal}
                        onHide={handleCloseModal}
                        onShow={handleShowModal}
                        onSuccess={handleUploadSuccess}
                        onUploading={(isUploading) => setShowUploading(!!isUploading)}
                    />
                </div>

                {/* CONTENT */}
                <div className="view-content">
                    {/* TALENT TAB */}
                    {view === "Talent" && (
                        <div className="upload-main mt-3">
                            {talentsData && talentsData.length > 0 ? (
                                <UserTalentProfiles />
                            ) : (
                                <div
                                    style={{
                                        minHeight: "320px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <NoData text="No talent profiles available" />
                                </div>
                            )}
                        </div>
                    )}

                    {/* REVIEW TAB */}
                    {view === "Review" && (
                        <div className="upload-main mt-3">
                            {talentsData && talentsData.length > 0 ? (
                                <UploadTalentTable
                                    talents={talentsData}
                                    selectedEmails={selectedEmails}
                                    onToggleSelect={toggleSelect}
                                    refreshKey={refreshKey}
                                    externalLoading={waitingForRefresh}
                                />
                            ) : (
                                <div
                                    style={{
                                        minHeight: "320px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <NoData text="No talent profiles to review yet" />
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </div>
            {/* Uploading overlay */}
            {showUploading && (
                <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:20000}}>
                    <div style={{background:'white',padding:24,borderRadius:8,display:'flex',flexDirection:'column',alignItems:'center',gap:12,minWidth:280}}>
                        <div style={{width:36,height:36,border:'4px solid #6843c7',borderTopColor:'transparent',borderRadius:'50%',animation:'spin 0.8s linear infinite'}} />
                        <div style={{fontWeight:700}}>Uploading — please wait</div>
                        <div style={{color:'#6b7280',fontSize:13}}>Processing resumes. This may take a moment.</div>
                    </div>
                    <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
                </div>
            )}

            {/* Success toast/modal (top centered) */}
            {showUploadedSuccess && (
                <div aria-live="polite" style={{position:'fixed',top:24,right:24,zIndex:20001}}>
                    <div style={{background:'#10b981',color:'white',padding:'12px 16px',borderRadius:8,boxShadow:'0 6px 18px rgba(16,185,129,0.12)',display:'flex',alignItems:'center',gap:12,minWidth:280}}>
                        <div style={{flex:1,fontWeight:700,textAlign:'left'}}>Resume(s) uploaded successfully</div>
                        <button onClick={() => setShowUploadedSuccess(false)} style={{background:'transparent',border:'none',color:'white',fontSize:16,cursor:'pointer'}} aria-label="Close success">×</button>
                    </div>
                </div>
            )}
            {showUploadError && (
                <div aria-live="assertive" style={{position:'fixed',top:24,right:24,zIndex:20001}}>
                    <div style={{background:'#dc2626',color:'white',padding:'12px 16px',borderRadius:8,boxShadow:'0 6px 18px rgba(220,38,38,0.12)',display:'flex',alignItems:'center',gap:12,minWidth:320}}>
                        <div style={{flex:1,fontWeight:700,textAlign:'left'}}>Upload failed</div>
                        <div style={{fontSize:13,opacity:0.95}}>{uploadErrorMessage}</div>
                        <button onClick={() => setShowUploadError(false)} style={{background:'transparent',border:'none',color:'white',fontSize:16,cursor:'pointer'}} aria-label="Close error">×</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default UploadTalent;
