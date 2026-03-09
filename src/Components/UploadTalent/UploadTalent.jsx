import React, { useEffect, useState, useRef } from "react";
import UploadTalentTable from "./UploadTalentTable";
import { talentsData } from "./talentsData";
import "./UploadTalent.css";
import { FiArrowLeft } from "react-icons/fi";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import UploadTalentModal from "./UploadTalentModal";
import UserTalentProfiles from "./UserTalentProfiles";
import NoData from "../UploadTalent/NoData"; // adjust path if needed
import { toast } from "react-toastify";


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
    const [uploadCount, setUploadCount] = useState(0);
    const [countdown, setCountdown] = useState(0);
    const countdownRef = useRef(null);

    const handleUploadSuccess = (message) => {
        if (message && String(message).toLowerCase().includes("fail")) {
            setUploadErrorMessage(message);
            setShowUploadError(true);
            setTimeout(() => setShowUploadError(false), 10000);
            return;
        }

        // Extract count from message like "Successfully uploaded N resume(s)"
        const match = message && String(message).match(/(\d+)/);
        const count = match ? parseInt(match[1], 10) : 1;
        setUploadCount(count);

        setShowUploadedSuccess(true);
        setTimeout(() => setShowUploadedSuccess(false), 10000);

        // 🔥 Start showing loading in table
        setWaitingForRefresh(true);

        // Start countdown
        const totalSeconds = 20;
        setCountdown(totalSeconds);
        if (countdownRef.current) clearInterval(countdownRef.current);
        countdownRef.current = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(countdownRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // ⏳ Wait 20 seconds then refresh
        setTimeout(() => {
            setRefreshKey((prev) => prev + 1);
            setWaitingForRefresh(false);
            setUploadCount(0);
            setCountdown(0);
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

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const linkedinStatus = searchParams.get("linkedin");

        if (linkedinStatus === "posted") {
            toast.success("Posted successfully on LinkedIn 🎉");

            // Remove query param so it doesn’t show again on refresh
            searchParams.delete("linkedin");
            setSearchParams(searchParams);
        }
    }, []);

    useEffect(() => {
  if (location.state?.fromDashboardUpload) {

    const totalSeconds = 20;

    setUploadCount(location.state?.uploadCount || 1);
    setWaitingForRefresh(true);
    setCountdown(totalSeconds);

    if (countdownRef.current) clearInterval(countdownRef.current);

    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setTimeout(() => {
      setRefreshKey(prev => prev + 1);
      setWaitingForRefresh(false);
      setUploadCount(0);
      setCountdown(0);
    }, 20000);

  }
}, [location.state]);

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
                            {/* AI Analysis Banner */}
                            {waitingForRefresh && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 16,
                                    padding: '16px 20px',
                                    marginBottom: 16,
                                    background: 'linear-gradient(135deg, #fff7ed, #fff)',
                                    border: '1.5px solid #f5810c',
                                    borderRadius: 12,
                                    boxShadow: '0 4px 16px rgba(245,129,12,0.08)',
                                }}>
                                    {/* Spinner */}
                                    <div style={{
                                        flexShrink: 0,
                                        width: 40, height: 40,
                                        borderRadius: '50%',
                                        border: '3px solid #fde8cc',
                                        borderTopColor: '#f5810c',
                                        animation: 'spin 0.9s linear infinite',
                                    }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 700, fontSize: 14, color: '#c2410c', marginBottom: 2 }}>
                                            ✦ AI is analysing the resume{uploadCount > 1 ? 's' : ''}…
                                        </div>
                                        <div style={{ fontSize: 13, color: '#78350f' }}>
                                            Processing <strong>{uploadCount}</strong> file{uploadCount !== 1 ? 's' : ''}.
                                            {countdown > 0 && (
                                                <> Estimated time remaining: <strong>{countdown}s</strong></>
                                            )}
                                        </div>
                                    </div>
                                    {/* Countdown ring */}
                                    <div style={{
                                        flexShrink: 0,
                                        width: 46, height: 46,
                                        borderRadius: '50%',
                                        background: '#fff7ed',
                                        border: '2px solid #f5810c',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 700,
                                        fontSize: 15,
                                        color: '#f5810c',
                                    }}>
                                        {countdown}s
                                    </div>
                                    <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
                                </div>
                            )}
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
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20000 }}>
                    <div style={{ background: 'white', padding: 24, borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, minWidth: 280 }}>
                        <div style={{ width: 36, height: 36, border: '4px solid #f5810c', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                        <div style={{ fontWeight: 700 }}>Uploading — please wait</div>
                        <div style={{ color: '#6b7280', fontSize: 13 }}>Processing resumes. This may take a moment.</div>
                    </div>
                    <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
                </div>
            )}

            {/* Success toast/modal (top centered) */}
            {showUploadedSuccess && (
                <div aria-live="polite" style={{ position: 'fixed', top: 24, right: 24, zIndex: 20001 }}>
                    <div style={{ background: '#10b981', color: 'white', padding: '12px 16px', borderRadius: 8, boxShadow: '0 6px 18px rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', gap: 12, minWidth: 280 }}>
                        <div style={{ flex: 1, fontWeight: 700, textAlign: 'left' }}>Resume(s) uploaded successfully</div>
                        <button onClick={() => setShowUploadedSuccess(false)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: 16, cursor: 'pointer' }} aria-label="Close success">×</button>
                    </div>
                </div>
            )}
            {showUploadError && (
                <div aria-live="assertive" style={{ position: 'fixed', top: 24, right: 24, zIndex: 20001 }}>
                    <div style={{ background: '#dc2626', color: 'white', padding: '12px 16px', borderRadius: 8, boxShadow: '0 6px 18px rgba(220,38,38,0.12)', display: 'flex', alignItems: 'center', gap: 12, minWidth: 320 }}>
                        <div style={{ flex: 1, fontWeight: 700, textAlign: 'left' }}>Upload failed</div>
                        <div style={{ fontSize: 13, opacity: 0.95 }}>{uploadErrorMessage}</div>
                        <button onClick={() => setShowUploadError(false)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: 16, cursor: 'pointer' }} aria-label="Close error">×</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default UploadTalent;
