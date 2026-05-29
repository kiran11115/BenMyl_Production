import React from "react";
import { FiBriefcase, FiGlobe, FiUsers, FiZap, FiArrowLeft, FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import PostedJobs from "./PostedJobs";
import StatsRow from "./StatsRow";
import { useGetGroupedJobTitlesQuery } from "../../State-Management/Api/TalentPoolApiSlice";
import { useMemo } from "react";
import "./Projects.css";

export default function PostedJobsPage() {
    const navigate = useNavigate();
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
                <div className="profile-breadcrumb d-flex gap-1 mb-4">
                    <button className="link-button" onClick={() => {
                        const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
                        navigate(`${basePath}/user-dashboard`);
                    }}>
                        Dashboard
                    </button>
                    <span className="crumb">/ Posted Jobs</span>
                </div>

                <div
                    style={{
                        background: "linear-gradient(90deg, #07132d 0%, #2b3669 48%, #7b78f3 100%)",
                        border: "1px solid #dbe3ef",
                        borderRadius: "18px",
                        padding: "18px 20px",
                        marginBottom: "28px",
                        boxShadow: "0 20px 45px rgba(92, 92, 230, 0.16)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "16px",
                    }}
                >
                    <div>
                        <h1
                            style={{
                                fontSize: "24px",
                                fontWeight: "700",
                                color: "#ffffff",
                                marginBottom: "8px",
                                letterSpacing: "-0.5px",
                              }}
                        >
                            Posted Jobs
                        </h1>
                        <p
                            style={{
                                color: "rgba(255, 255, 255, 0.6)",
                                fontSize: "14px",
                                fontWeight: "500",
                                margin: 0,
                            }}
                        >
                            Manage and track all positions you've posted to the talent pool.
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
                            navigate(`${basePath}/user-post-new-positions`);
                        }}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            backgroundColor: "#000000",
                            border: "1px solid #000000",
                            borderRadius: "8px",
                            color: "#ffffff",
                            padding: "10px 18px",
                            fontWeight: "700",
                            fontSize: "13px",
                            cursor: "pointer",
                            height: "38px",
                            transition: "transform 0.2s ease",
                        }}
                    >
                        <FiPlus size={16} />
                        <span>Post New Job</span>
                    </button>
                </div>

                <StatsRow stats={jobStats} />

                <div className="view-content mt-4">
                    <div className="upload-main">
                        <PostedJobs />
                    </div>
                </div>
            </div>
        </div>
    );
}
