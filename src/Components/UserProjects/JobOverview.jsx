import React, { useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import {
    FiMapPin,
    FiBriefcase,
    FiHome,
    FiDollarSign,
    FiLayers,
    FiTrendingUp,
    FiBookOpen,
    FiClock,
    FiFileText,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import ShareJobCard from "./ShareJobCard";

const JobOverview = () => {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [isTablet, setIsTablet] = useState(window.innerWidth <= 1024);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
            setIsTablet(window.innerWidth <= 1024);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const job = {
        jobTitle: "Senior Frontend Developer",
        companyName: "Bennyl Technologies",
        location: "Bangalore, India",
        employmentType: "Full-time",
        salary: "₹18,00,000 - ₹25,00,000 / year",
        workModel: "Hybrid",
        department: "Engineering",
        experienceLevel: "Senior",
        skills: ["React", "TypeScript", "Redux", "Tailwind CSS"],
        education: "Bachelor’s Degree",
        experience: "5+ Years",
        description:
            "We are looking for a Senior Frontend Developer to build scalable, high-performance web applications and lead UI development.",
        additionalRequirements:
            "Strong problem-solving skills, experience working in agile teams, and excellent communication skills.",
    };

    const styles = {
        page: {
            padding: "0 24px 24px",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: "24px",
        },

        card: {
            background: "#1e293b",
            borderRadius: "1rem",
            padding: "24px",
            border: "1px solid rgba(71, 85, 105, 0.8)",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.25)",
            marginBottom: "24px",
            color: "#f8fafc"
        },

        left: { width: isMobile ? "100%" : isTablet ? "65%" : "75%" },
        right: {
            width: isMobile ? "100%" : isTablet ? "35%" : "25%",
            height: "fit-content",
            position: isMobile ? "static" : "sticky",
            top: "24px",
        },

        title: { fontSize: "22px", fontWeight: 600, color: "#f8fafc" },
        subtitle: { color: "#94a3b8", marginTop: "4px" },
        section: { marginBottom: "22px" },
        value: { fontSize: "15px", fontWeight: 500, color: "#f8fafc" },

        grid: {
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: "16px",
        },

        divider: {
            height: "1px",
            background: "rgba(51, 65, 85, 0.6)",
            margin: "22px 0",
        },

        badge: {
            display: "inline-block",
            padding: "6px 10px",
            borderRadius: "6px",
            background: "rgba(59, 130, 246, 0.15)",
            color: "#60a5fa",
            fontSize: "13px",
            fontWeight: 500,
            marginRight: "8px",
            marginTop: "6px",
            border: "1px solid rgba(59, 130, 246, 0.35)"
        },
    };

    const Label = ({ icon: Icon, text }) => (
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px", color: "#94a3b8", fontSize: "13px" }}>
            <Icon size={14} />
            <span>{text}</span>
        </div>
    );

    return (
        <div style={{ background: "#0f172a", minHeight: "100vh", color: "#f8fafc" }}>
            {/* HEADER */}
            <div style={{ padding: "24px 24px 0" }} className="mb-4">
                <div className="vs-breadcrumbs mb-3 d-flex gap-2">
                    <button type="button" className="link-button" onClick={() => navigate("/user/user-projects")} style={{ color: "#60a5fa", background: "none", border: "none", display: "flex", alignItems: "center", gap: "4px", padding: 0 }}>
                        <FiArrowLeft /> Back to Projects
                    </button>
                    <span className="crumb" style={{ color: "#64748b" }}>/ Job Overview</span>
                </div>

                <h1 style={{ fontSize: "24px", fontWeight: 700, margin: "12px 0 4px", color: "#f8fafc" }}>
                    Job Overview
                </h1>
                <p style={{ color: "#94a3b8", margin: 0 }}>
                    A complete summary of the job details and requirements
                </p>
            </div>

            <div style={styles.page}>
                {/* LEFT */}
                <div style={{ ...styles.card, ...styles.left }}>
                    <div style={{ display: "flex", gap: "14px", marginBottom: "22px" }}>
                        <div
                            style={{
                                width: "52px",
                                height: "52px",
                                borderRadius: "10px",
                                background: "rgba(51, 65, 85, 0.5)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "1px solid rgba(71, 85, 105, 0.8)"
                            }}
                        >
                            <FiFileText size={22} color="#94a3b8" />
                        </div>

                        <div>
                            <div style={styles.title}>{job.jobTitle}</div>
                            <div style={styles.subtitle}>{job.companyName}</div>
                        </div>
                    </div>

                    <div style={styles.grid}>
                        <div><Label icon={FiMapPin} text="Location" /><div style={styles.value}>{job.location}</div></div>
                        <div><Label icon={FiBriefcase} text="Employment Type" /><div style={styles.value}>{job.employmentType}</div></div>
                        <div><Label icon={FiHome} text="Work Model" /><div style={styles.value}>{job.workModel}</div></div>
                        <div><Label icon={FiDollarSign} text="Salary Range" /><div style={styles.value}>{job.salary}</div></div>
                        <div><Label icon={FiLayers} text="Department" /><div style={styles.value}>{job.department}</div></div>
                        <div><Label icon={FiTrendingUp} text="Experience Level" /><div style={styles.value}>{job.experienceLevel}</div></div>
                    </div>

                    <div style={styles.divider} />

                    <Label icon={FiFileText} text="Job Description" />
                    <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#cbd5e1" }}>{job.description}</p>

                    <div style={styles.section}>
                        <Label icon={FiLayers} text="Required Skills" />
                        <div className="d-flex gap-2">
                            {job.skills.map(skill => (
                                <span key={skill} style={styles.badge}>{skill}</span>
                            ))}
                        </div>
                    </div>

                    <div style={styles.divider} />

                    <div style={styles.grid}>
                        <div><Label icon={FiBookOpen} text="Education Level" /><div style={styles.value}>{job.education}</div></div>
                        <div><Label icon={FiClock} text="Years of Experience" /><div style={styles.value}>{job.experience}</div></div>
                    </div>

                    <div style={styles.section} className="mt-3">
                        <Label icon={FiFileText} text="Additional Requirements" />
                        <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#cbd5e1" }}>{job.additionalRequirements}</p>
                    </div>
                </div>

                {/* RIGHT */}
                <div style={styles.right}>
                    <ShareJobCard />
                </div>

            </div>
        </div>
    );
};

export default JobOverview;
