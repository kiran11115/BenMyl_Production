import React from "react";
import { FiBriefcase, FiGlobe, FiUsers, FiZap, FiLinkedin, FiPlus } from "react-icons/fi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import PostedJobs from "./PostedJobs";
import StatsRow from "./StatsRow";
import { useGetGroupedJobTitlesQuery, useGetJobPostingINDQuery } from "../../State-Management/Api/TalentPoolApiSlice";
import { useMemo, useState, useEffect } from "react";
import "./Projects.css";

export default function PostedJobsPage() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [showStats, setShowStats] = useState(false);
    const userId = localStorage.getItem("CompanyId");
    const countryRegistration = Number(localStorage.getItem("countryRegistration") || 1);
    const isIND = countryRegistration === 2;

    const { data: usJobs = [], isLoading: isUSLoading } = useGetGroupedJobTitlesQuery(userId, { skip: isIND });
    const { data: indJobs = [], isLoading: isINDLoading } = useGetJobPostingINDQuery(userId, { skip: !isIND });

    const apiJobs = isIND ? indJobs : usJobs;
    const isLoading = isIND ? isINDLoading : isUSLoading;

    useEffect(() => {
        const linkedinStatus = searchParams.get("linkedin");
        if (linkedinStatus === "posted") {
            toast.success(
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    Posted successfully on LinkedIn <FiLinkedin size={16} color="#0a66c2" style={{ fill: "#0a66c2", marginTop: "-2px" }} />
                </span>
            );
            searchParams.delete("linkedin");
            setSearchParams(searchParams);
        }
    }, [searchParams, setSearchParams]);

    const jobStats = useMemo(() => {
        if (!Array.isArray(apiJobs)) return [];
        // IND uses workMode/employmentType, US uses workModels/employeeType
        const remoteJobs = apiJobs.filter((j) => (j.workMode ?? j.workModels) === "Remote").length;
        const fullTimeJobs = apiJobs.filter((j) =>
            (j.employmentType ?? j.employeeType ?? "")?.includes("Full-time")
        ).length;
        const activeJobs = isIND
            ? apiJobs.filter((j) => (j.jobStatus ?? "active").toLowerCase() === "active").length
            : apiJobs.length;

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
                value: activeJobs,
                trend: "Live now",
                isPositive: true,
                icon: FiZap,
                cardType: "card-purple",
                bubbleColor: "#a855f7",
            },
        ];
    }, [apiJobs, isIND]);

    return (
        <div className="projects-page-wrapper">
            <div className="projects-container">

                {/* Top cards for Posted Jobs */}

                <div className="hero-section-wrapper mb-4">
                    <div className="hero-card ">
                        <div className="hero-concentric-lines"></div>
                        <div className="hero-ripple-pattern"></div>
                        <div className="hero-circular-highlights"></div>
                        <div className="hero-left">
                            <div className="hero-pill">
                                ✦ Posted Jobs
                            </div>
                            <div className="hero-title-row">
                                <h1 className="job-posting-title text-white">
                                    Posted Opportunities Board
                                </h1>

                                <div className="hero-buttons">
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

                            <div className="hero-content-row">
                                <p className="job-posting-subtitle">
                                    Displaying all posted job opportunities with complete role details
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
                            <img src="/Images/jobs.png" alt="Jobs Illustration" className="hero-svg-image" />
                        </div>
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
