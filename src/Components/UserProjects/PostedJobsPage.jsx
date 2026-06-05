import React from "react";
import { FiBriefcase, FiGlobe, FiUsers, FiZap, FiArrowLeft, FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import PostedJobs from "./PostedJobs";
import StatsRow from "./StatsRow";
import { useGetGroupedJobTitlesQuery } from "../../State-Management/Api/TalentPoolApiSlice";
import { useMemo, useState } from "react";
import "./Projects.css";

export default function PostedJobsPage() {
    const navigate = useNavigate();
    const [showStats, setShowStats] = useState(false);
    const userId = localStorage.getItem("CompanyId");
    const { data: apiJobs = [], isLoading } = useGetGroupedJobTitlesQuery(userId);

    const jobStats = useMemo(() => {
        if (!Array.isArray(apiJobs)) return [];
        const remoteJobs = apiJobs.filter((j) => j.workModels === "Remote").length;
        const fullTimeJobs = apiJobs.filter((j) =>
            j.employeeType?.includes("Full-time")
        ).length;

        return [
            {
                label: "Total Postings",
                value: apiJobs.length,
                trend: "Total active",
                isPositive: true,
                icon: FiBriefcase,
                cardType: "card-orange",
                bubbleColor: "#f5810c",
            },
            {
                label: "Remote Roles",
                value: remoteJobs,
                trend: "Work from home",
                isPositive: true,
                icon: FiGlobe,
                cardType: "card-cyan",
                bubbleColor: "#0ea5e9",
            },
            {
                label: "Full-Time Roles",
                value: fullTimeJobs,
                trend: "Growth roles",
                isPositive: true,
                icon: FiUsers,
                cardType: "card-blue",
                bubbleColor: "#3b82f6",
            },
            {
                label: "Active Listings",
                value: apiJobs.length,
                trend: "Live now",
                isPositive: true,
                icon: FiZap,
                cardType: "card-purple",
                bubbleColor: "#a855f7",
            },
        ];
    }, [apiJobs]);

    return (
        <div className="projects-page-wrapper">
            <div className="projects-container">

                {/* Top cards for Posted Jobs */}

                <div
                    className="hero-card mb-4"
                >
                    <div className="hero-left">
                        <div className="hero-pill">
                            ✦ Posted Jobs
                        </div>

                        <h1 className="job-posting-title text-white">
                            Posted Opportunities Board
                        </h1>

                        <div className="job-posting-header-info">
                            <p className="job-posting-subtitle">
                                Displaying all posted job opportunities with complete role details
                            </p>
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <button
                            onClick={() => setShowStats(!showStats)}
                            className="routine-btn"
                        >
                            {showStats ? "Hide Metric Cards" : "Show Metric Cards"}
                        </button>

                        <button
                            onClick={() => {
                                const basePath = window.location.pathname
                                    .toLowerCase()
                                    .startsWith('/admin')
                                    ? '/Admin'
                                    : '/user';

                                navigate(`${basePath}/user-post-new-positions`);
                            }}
                            className="routine-btn"
                        >
                            <FiPlus size={16} />
                            <span>Post New Job</span>
                        </button>
                    </div>
                </div>

                <div className={`metrics-slider ${showStats ? "show" : ""}`}>
                    <StatsRow stats={jobStats} />
                </div>

                <div className="view-content">
                    <div className="upload-main">
                        <PostedJobs />
                    </div>
                </div>
            </div>
        </div>
    );
}
