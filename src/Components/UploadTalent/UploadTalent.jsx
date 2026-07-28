import React, { useEffect, useState, useRef } from "react";
import UploadTalentTable from "./UploadTalentTable";
import { FiSearch } from "react-icons/fi";
import { talentsData } from "./talentsData";
import "./UploadTalent.css";
import { FiArrowLeft } from "react-icons/fi";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import UserTalentProfiles from "./UserTalentProfiles";
import NoData from "../UploadTalent/NoData"; // adjust path if needed
import { toast } from "react-toastify";
import StatsGrid from "../Dashboard/StatsGrid";
import { Users, Briefcase, Sparkles } from "lucide-react";
import { useGetQueueManagementMutation, useGetMyBenchMutation } from "../../State-Management/Api/UploadResumeApiSlice";


const UploadTalent = () => {
    const [showModal, setShowModal] = useState(false);
    const location = useLocation();

    const [searchQuery, setSearchQuery] = useState("");
    const [pendingReviewCount, setPendingReviewCount] = useState(0);
    const [totalTalentCount, setTotalTalentCount] = useState(0);
    const [refreshKey, setRefreshKey] = useState(0);
    const [showUploading, setShowUploading] = useState(false);
    const [showStats, setShowStats] = useState(false);
    const [showDevMsg, setShowDevMsg] = useState(false);
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
                <div className="hero-section-wrapper mb-4">
                    <div className="hero-card ">
                        <div className="hero-concentric-lines"></div>
                        <div className="hero-ripple-pattern"></div>
                        <div className="hero-circular-highlights"></div>
                        <div className="hero-left">
                            <div className="hero-pill">
                                ✦ Resource Management
                            </div>
                            
                            <div className="hero-title-row">
                                <h1>Admin Talent Hub</h1>

                                <div className="hero-buttons">
                                    <button
                                        className="routine-btn"
                                        onClick={() => {
                                            const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/User';
                                            navigate(`${basePath}/upload-review-talent`);
                                        }}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                                        <span>Upload Talent</span>
                                    </button>
                                </div>
                            </div>

                            <div className="hero-content-row">
                                <p>
                                    Manage and review your uploaded talent profiles effectively.
                                </p>
                            </div>
                        </div>
                        
                        <div className="hero-illustration">
                            <div className="hero-particles">
                                <div className="particle"></div>
                                <div className="particle"></div>
                                <div className="particle"></div>
                                <div className="particle"></div>
                                <div className="particle"></div>
                                <div className="particle"></div>
                            </div>
                            <img src="/Images/Resume.png" alt="Resource Management Illustration" className="hero-svg-image" />
                        </div>
                    </div>

                    <div className="copilot-card" style={{ flex: 1, margin: 0 }}>
                        <div className="copilot-header">
                            <div className="copilot-title-wrapper">
                                <Sparkles size={16} className="copilot-sparkles-icon" />
                                <span className="copilot-title">AI Agent</span>
                                <span className="copilot-beta-badge">Beta</span>
                            </div>
                        </div>

                        <div className="copilot-body">
                            <p className="copilot-text">
                                I found <strong>{totalTalentCount} Total Talent Profiles</strong><br /> available in your network.
                            </p>

                        </div>

                        <div className="copilot-bot-illustration">
                            <img src="/Images/AI-Bot.png" alt="AI Copilot Bot" className="copilot-bot-image" />
                            <div className="copilot-glow-bg"></div>
                        </div>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="view-content">
                    <div className="upload-main">
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
                </div>
            </div>
          </div>
    );
};

export default UploadTalent;
