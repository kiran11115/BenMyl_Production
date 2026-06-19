import React, { useEffect, useState, useRef } from "react";
import UploadTalentTable from "./UploadTalentTable";
import { FiSearch } from "react-icons/fi";
import { talentsData } from "./talentsData";
import "./UploadTalent.css";
import { FiArrowLeft } from "react-icons/fi";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import UploadTalentModal from "./UploadTalentModal";
import UserTalentProfiles from "./UserTalentProfiles";
import NoData from "../UploadTalent/NoData"; // adjust path if needed
import { toast } from "react-toastify";
import StatsGrid from "../Dashboard/StatsGrid";
import { Users, Briefcase } from "lucide-react";
import { useGetQueueManagementMutation, useGetMyBenchMutation } from "../../State-Management/Api/UploadResumeApiSlice";


const UploadReviewTalent = () => {
    const [showModal, setShowModal] = useState(false);
    const location = useLocation();


    const [searchQuery, setSearchQuery] = useState("");
    const [pendingReviewCount, setPendingReviewCount] = useState(0);
    const [totalTalentCount, setTotalTalentCount] = useState(0);
    const [refreshKey, setRefreshKey] = useState(0);
    const [showUploading, setShowUploading] = useState(false);
    const [showStats, setShowStats] = useState(false);
    const [showUploadSection, setShowUploadSection] = useState(true);
    const [showUploadedSuccess, setShowUploadedSuccess] = useState(false);
    const [showUploadError, setShowUploadError] = useState(false);
    const [uploadErrorMessage, setUploadErrorMessage] = useState("");
    const [toastMessage, setToastMessage] = useState("");
    const [waitingForRefresh, setWaitingForRefresh] = useState(false);
    const [uploadCount, setUploadCount] = useState(0);
    const [countdown, setCountdown] = useState(0);
    const countdownRef = useRef(null);

    const [getQueueManagement] = useGetQueueManagementMutation();
    const [getMyBench] = useGetMyBenchMutation();

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const companyId = Number(localStorage.getItem("logincompanyid"));

                // Fetch Pending Review Count
                const queueRes = await getQueueManagement({
                    companyid: companyId,
                    pageNumber: 1,
                    pageSize: 1000,
                    filters: [],
                }).unwrap();
                const pendingCount = Array.isArray(queueRes)
                    ? queueRes.filter(item => item.status === "Pending For Review").length
                    : 0;
                setPendingReviewCount(pendingCount);

                // Fetch Total Talent Count
                const benchRes = await getMyBench({
                    companyid: companyId,
                    pageNumber: 1,
                    pageSize: 1000,
                    filters: [],
                }).unwrap();
                const totalCount = Array.isArray(benchRes) ? benchRes.length : 0;
                setTotalTalentCount(totalCount);
            } catch (err) {
                console.error("Failed to fetch talent counts", err);
            }
        };

        fetchCounts();
    }, [getQueueManagement, getMyBench, refreshKey]);

    const kpiCards = [
        { label: "Total Talent Profiles", value: String(totalTalentCount), change: "0%", icon: Briefcase, cardType: "card-blue", bubbleColor: "#3b82f6" },
        { label: "Pending Review Profiles", value: String(pendingReviewCount), change: "0%", icon: Users, cardType: "card-purple", bubbleColor: "#6366f1" },
    ];


    const handleUploadSuccess = (message) => {
        if (message && String(message).toLowerCase().includes("fail")) {
            toast.error(message || "Upload failed");
            setShowUploadError(false);
            return;
        }

        // Extract count from message like "Successfully uploaded N resume(s)"
        const match = message && String(message).match(/(\d+)/);
        const count = match ? parseInt(match[1], 10) : 1;
        setUploadCount(count);

        toast.success("Resume(s) uploaded successfully");
        setShowUploadedSuccess(false);

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

    const handleDeleteSuccess = () => {
        setRefreshKey(prev => prev + 1);
        toast.info("Draft deleted successfully");
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

            window.history.replaceState({}, document.title);

        }
    }, [location.state]);

    return (
        <div className="projects-page-wrapper">
            <div className="projects-container">
                <div className="hero-card mb-4">
                    <Users 
                        size={240} 
                        strokeWidth={0.5}
                        style={{
                            position: 'absolute',
                            right: '30%',
                            top: '50%',
                            transform: 'translateY(-50%) rotate(-10deg)',
                            color: '#ffffff',
                            opacity: 0.04,
                            zIndex: 1,
                            pointerEvents: 'none'
                        }}
                    />
                    <div className="hero-left">
                        <div className="hero-pill">
                            ✦ Upload & Review
                        </div>
                        <h1 className="job-posting-title text-white" style={{ position: 'relative', zIndex: 2 }}>Upload & Review Talent</h1>

                        <div className="job-posting-header-info" style={{ position: 'relative', zIndex: 2 }}>
                            <p className="job-posting-subtitle">
                                Upload new talent resumes and review extracted AI profiles.
                            </p>
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center", position: 'relative', zIndex: 2 }}>
                        <button
                            onClick={() => setShowStats(!showStats)}
                            className="routine-btn"
                            style={{ height: '48px', padding: '0 20px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', fontWeight: '600' }}
                        >
                            {showStats ? "Hide Metrics" : "Show Metrics"}
                        </button>
                        <button
                            onClick={() => setShowUploadSection(!showUploadSection)}
                            className="routine-btn"
                            style={{ height: '48px', padding: '0 20px', borderRadius: '12px', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '13px', fontWeight: '600' }}
                        >
                            {showUploadSection ? "Hide Upload Area" : "Upload Resumes"}
                        </button>
                    </div>
                </div>

                <div className={`metrics-slider ${showStats ? "show" : ""}`}>
                    <StatsGrid data={kpiCards} />
                </div>

                {/* CONTENT */}
                <div className="view-content">
                    {/* INLINE UPLOAD SECTION */}
                    <div style={{
                        marginTop: showUploadSection ? '20px' : '0',
                        marginBottom: showUploadSection ? '24px' : '0',
                        maxHeight: showUploadSection ? '800px' : '0',
                        opacity: showUploadSection ? 1 : 0,
                        overflow: 'hidden',
                        transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
                    }}>
                        <UploadTalentModal
                            inline={true}
                            onSuccess={handleUploadSuccess}
                            onUploading={(isUploading) => setShowUploading(!!isUploading)}
                            waitingForRefresh={waitingForRefresh}
                            countdown={countdown}
                            uploadCount={uploadCount}
                        />
                    </div>

                    {/* REVIEW TAB HEADER WITH SEARCH */}
                    <div className="bento-cell-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', background: '#fff', padding: '16px 20px', borderRadius: '16px', border: '1px solid #e4e8f5', flexWrap: 'wrap', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div className="bento-cell-icon-wrap" style={{ background: '#f0f4ff', color: '#5b5bd6', padding: '8px', borderRadius: '10px' }}><Users size={16} /></div>
                            <div className="d-flex flex-column gap-0">
                                <h3 className="fg-title m-0" style={{ fontSize: '16px', fontWeight: '800', color: '#1e293b' }}>AI Extracted Profiles</h3>
                                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Review parsed data before confirming</span>
                            </div>
                        </div>

                        <div style={{
                            display: "flex", alignItems: "center", gap: 8,
                            background: "#f8fafc", border: "1px solid #e2e8f0",
                            borderRadius: 10, minWidth: 280,
                            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.02)",
                        }}>
                            <FiSearch size={16} className="ms-3" color="#94a3b8" />
                            <input
                                type="text"
                                placeholder="Search extracted resumes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    border: "none", outline: "none", background: "transparent",
                                    fontSize: 13, color: "#1e293b", width: "100%",
                                    fontWeight: 500,
                                }}
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0, display: "flex" }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="upload-main mt-3">
                            {talentsData && talentsData.length > 0 ? (
                                <UploadTalentTable
                                    talents={talentsData}
                                    selectedEmails={selectedEmails}
                                    onToggleSelect={toggleSelect}
                                    refreshKey={refreshKey}
                                    externalLoading={waitingForRefresh}
                                    searchQuery={searchQuery}
                                    onDeleted={handleDeleteSuccess}
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
                </div>
            </div>
        </div>
    );
};

export default UploadReviewTalent;
