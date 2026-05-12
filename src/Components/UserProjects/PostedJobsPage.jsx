import React from "react";
import { FiBriefcase, FiGlobe, FiUsers, FiZap, FiArrowLeft } from "react-icons/fi";
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

                <div className="projects-page-header">
                    <div>
                        <h1 className="projects-page-title">Posted Jobs</h1>
                        <p className="projects-page-subtitle">
                            Manage and track all positions you've posted to the talent pool.
                        </p>
                    </div>
                    <button className="btn-primary" onClick={() => {
                        const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
                        navigate(`${basePath}/user-post-new-positions`);
                    }}>
                        Post New Job
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
