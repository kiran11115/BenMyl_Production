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


const UploadTalent = () => {
    const [showModal, setShowModal] = useState(false);
    const location = useLocation();

    const [view, setView] = useState(
        location.state?.activeTab || "Talent"
    );
    const [searchQuery, setSearchQuery] = useState("");
    const [pendingReviewCount, setPendingReviewCount] = useState(0);
    const [totalTalentCount, setTotalTalentCount] = useState(0);
    const [refreshKey, setRefreshKey] = useState(0);
    const [showUploading, setShowUploading] = useState(false);
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

    useEffect(() => {
        if (location.state?.activeTab) {
            setView(location.state.activeTab);
        }
    }, [location.state]);

    // Reset search query when switching tabs
    useEffect(() => {
        setSearchQuery("");
    }, [view]);


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
                {/* 1. KPI Stats Grid */}
                <div id="upload-talent-stats-grid" style={{ marginBottom: "24px" }}>
                    <StatsGrid data={kpiCards} />
                </div>

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

                    <div className="d-flex align-items-center gap-2">
                        {/* SEARCH BAR - Only for Review Profiles */}
                        {view === "Review" && (
                            <div className="ut-search-wrapper" style={{ minWidth: "300px" }}>
                                <FiSearch className="ut-search-icon" />
                                <input
                                    type="text"
                                    className="ut-search-input"
                                    placeholder="Search by Resume Name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        )}

                        <UploadTalentModal
                            show={showModal}
                            onHide={handleCloseModal}
                            onShow={handleShowModal}
                            onSuccess={handleUploadSuccess}
                            onUploading={(isUploading) => setShowUploading(!!isUploading)}
                        />
                    </div>
                </div>

                {/* CONTENT */}
                <div className="view-content">
                    {/* TALENT TAB */}
                    {view === "Talent" && (
                        <div className="upload-main mt-3">
                            {talentsData && talentsData.length > 0 ? (
                                <UserTalentProfiles searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                            ) : (
                                <div
                                    style={{
                                        minHeight: "320px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: "100%"
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
                    )}
                </div>

            </div>
        </>
    );
};

export default UploadTalent;
