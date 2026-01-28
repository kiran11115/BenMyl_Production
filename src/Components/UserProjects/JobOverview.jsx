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
import { useLocation, useNavigate } from "react-router-dom";
import ShareJobCard from "./ShareJobCard";
import { useLazyGetJobByIdQuery } from "../../State-Management/Api/TalentPoolApiSlice";

const JobOverview = () => {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [isTablet, setIsTablet] = useState(window.innerWidth <= 1024);

    const location = useLocation();

  const jobId = location.state?.jobId;
  const userId = localStorage.getItem("CompanyId");

  const [getJobById, { data, isLoading }] = useLazyGetJobByIdQuery();

  useEffect(() => {
  if (jobId && userId) {
    getJobById({ jobId, userId });
  }
}, [jobId, userId, getJobById]);

  // API returns array with single object
  const job = data?.[0];

    const styles = {
        page: {
            padding: "0 24px 24px",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: "24px",
            fontFamily: "Inter, sans-serif",
            background: "#f8fafc",
        },

        card: {
            background: "#ffffff",
            borderRadius: "1rem",
            padding: "24px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 12px -1px rgba(15, 23, 42, 0.05)",
            marginBottom: "24px"
        },

        left: { width: isMobile ? "100%" : isTablet ? "65%" : "75%" },
        right: {
            width: isMobile ? "100%" : isTablet ? "35%" : "25%",
            height: "fit-content",
            position: isMobile ? "static" : "sticky",
            top: "24px",
        },

        title: { fontSize: "22px", fontWeight: 600 },
        subtitle: { color: "#6b7280", marginTop: "4px" },
        section: { marginBottom: "22px" },
        value: { fontSize: "15px", fontWeight: 500 },

        grid: {
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: "16px",
        },

        divider: {
            height: "1px",
            background: "#e5e7eb",
            margin: "22px 0",
        },

        badge: {
            display: "inline-block",
            padding: "6px 10px",
            borderRadius: "6px",
            background: "#f3e8ff",
            color: "#6d28d9",
            fontSize: "13px",
            fontWeight: 500,
            marginRight: "8px",
            marginTop: "6px",
        },
    };

    const Label = ({ icon: Icon, text }) => (
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px", color: "#64748b", fontSize: "13px" }}>
            <Icon size={14} />
            <span>{text}</span>
        </div>
    );

    return (
        <>
            {/* HEADER */}
            <div style={{ padding: "24px 24px 0" }} className="mb-4">
                <div className="vs-breadcrumbs mb-3 d-flex gap-2">
                    <button type="button" className="link-button" onClick={() => navigate("/user/user-projects")}>
                        <FiArrowLeft /> Back to Projects
                    </button>
                    <span className="crumb">/ Job Overview</span>
                </div>

                <h1 style={{ fontSize: "24px", fontWeight: 700, margin: "12px 0 4px" }}>
                    Job Overview
                </h1>
                <p style={{ color: "#64748b", margin: 0 }}>
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
                                background: "#f1f5f9",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <FiFileText size={22} color="#475569" />
                        </div>

                        <div>
                            <div style={styles.title}>{job?.jobTitle}</div>
                            <div style={styles.subtitle}>{job?.companyName}</div>
                        </div>
                    </div>

                    <div style={styles.grid}>
                        <div><Label icon={FiMapPin} text="Location" /><div style={styles.value}>{job?.location}</div></div>
                        <div><Label icon={FiBriefcase} text="Employment Type" /><div style={styles.value}>{job?.employeeType}</div></div>
                        <div><Label icon={FiHome} text="Work Model" /><div style={styles.value}>{job?.workModels}</div></div>
                        <div><Label icon={FiDollarSign} text="Salary Range" /><div style={styles.value}>{job?.salaryRange_min}-{job?.salaryRange_max} USD</div></div>
                        <div><Label icon={FiLayers} text="Department" /><div style={styles.value}>{job?.department}</div></div>
                        <div><Label icon={FiTrendingUp} text="Experience Level" /><div style={styles.value}>{job?.yearsofExperience}</div></div>
                    </div>

                    <div style={styles.divider} />

                    <Label icon={FiFileText} text="Job Description" />
                    <p style={{ fontSize: "14px", lineHeight: 1.6 }}>{job?.jobDescription}</p>

                    <div style={styles.section}>
                        <Label icon={FiLayers} text="Required Skills" />
                        <div className="d-flex gap-2">
                            {job?.requiredSkills
  ?.split(",")
  .map((skill) => (
    <span key={skill.trim()} className="status-tag status-progress">
      {skill.trim()}
    </span>
))}
                        </div>
                    </div>

                    <div style={styles.divider} />

                    <div style={styles.grid}>
                        <div><Label icon={FiBookOpen} text="Education Level" /><div style={styles.value}>{job?.educationLevel}</div></div>
                        <div><Label icon={FiClock} text="Years of Experience" /><div style={styles.value}>{job?.yearsofExperience}</div></div>
                    </div>

                    <div style={styles.section} className="mt-3">
                        <Label icon={FiFileText} text="Additional Requirements" />
                        <p style={{ fontSize: "14px", lineHeight: 1.6 }}>{job?.additionalRequirements}</p>
                    </div>
                </div>

                {/* RIGHT */}
                <div style={styles.right}>
                    <ShareJobCard />
                </div>

            </div>
        </>
    );
};

export default JobOverview;
