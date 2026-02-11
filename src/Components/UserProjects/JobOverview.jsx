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
  FiUsers,
  FiGlobe,
  FiCalendar,
} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import ShareJobCard from "./ShareJobCard";
import { useLazyGetJobByIdQuery } from "../../State-Management/Api/TalentPoolApiSlice";
import WorkAndPreference from "./WorkAndPreference";

const JobOverview = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth <= 1024);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsTablet(window.innerWidth <= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      gap: "32px",
      width: "100%",
    },

    card: {
      background: "#ffffff",
      borderRadius: "1rem",
      padding: "28px 32px",
      border: "1px solid #e2e8f0",
      boxShadow: "0 4px 12px -1px rgba(15, 23, 42, 0.05)",
      marginBottom: "24px",
    },

    left: {
      width: isMobile ? "100%" : isTablet ? "68%" : "72%",
      flexShrink: 0,
    },
    right: {
      width: isMobile ? "100%" : isTablet ? "32%" : "28%",
      flexShrink: 0,
      height: "fit-content",
      position: isMobile ? "static" : "sticky",
      top: "24px",
      paddingRight: "32px"
    },

    title: {
      fontSize: "26px",
      fontWeight: 700,
      color: "#1e293b",
      marginBottom: "4px",
    },
    subtitle: {
      color: "#64748b",
      fontSize: "16px",
      marginBottom: "24px",
    },
    section: {
      marginBottom: "28px",
    },
    value: {
      fontSize: "16px",
      fontWeight: 500,
      color: "#334155",
    },

    // Improved grid with 4 columns on desktop
    grid: {
      display: "grid",
      gridTemplateColumns: isMobile
        ? "1fr"
        : isTablet
          ? "repeat(2, 1fr)"
          : "repeat(4, 1fr)",
      gap: "20px",
      marginBottom: "32px",
    },

    gridItem: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      padding: "16px",
      background: "#f8fafc",
      borderRadius: "10px",
      border: "1px solid #e2e8f0",
    },

    // Job info section with better spacing
    jobInfoHeader: {
      display: "flex",
      alignItems: "flex-start",
      gap: "20px",
      marginBottom: "32px",
      paddingBottom: "28px",
      borderBottom: "2px solid #f1f5f9",
    },

    iconContainer: {
      width: "60px",
      height: "60px",
      borderRadius: "12px",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },

    // Enhanced skills display
    skillsContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
      marginTop: "8px",
    },

    skillBadge: {
      display: "inline-block",
      padding: "4px 10px",
      borderRadius: "6px",
      fontSize: "12px",
      fontWeight: "600",
      whiteSpace: "normal",
      backgroundColor: " #eff0ff",
      color: "#3b82f6",
    },

    // Section headers
    sectionHeader: {
      fontSize: "18px",
      fontWeight: 600,
      color: "#1e293b",
      marginBottom: "16px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },

    // Content blocks
    contentBlock: {
      background: "#f8fafc",
      padding: "20px",
      borderRadius: "10px",
      border: "1px solid #e2e8f0",
      marginBottom: "24px",
    },

    // Requirements grid for additional requirements
    requirementsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      gap: "12px",
      marginTop: "12px",
    },

    requirementItem: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "14px",
      color: "#475569",
    },

    checkbox: {
      width: "16px",
      height: "16px",
      borderRadius: "4px",
      border: "2px solid #cbd5e1",
      backgroundColor: "white",
    },

    // Description text
    descriptionText: {
      fontSize: "15px",
      lineHeight: 1.7,
      color: "#475569",
      whiteSpace: "pre-wrap",
    },
  };

  const Label = ({ icon: Icon, text }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        color: "#64748b",
        fontSize: "14px",
        fontWeight: 500,
      }}
    >
      <Icon size={16} style={{ opacity: 0.8 }} />
      <span>{text}</span>
    </div>
  );

  return (
    <>
      {/* HEADER */}
      
      <div
        style={{
          padding: "28px 24px 0",
          width: "100%",
        }}
        className="mb-4"
      >
        <div className="vs-breadcrumbs mb-3 d-flex align-items-center gap-2">
          <button
            type="button"
            className="link-button"
            onClick={() => navigate("/user/user-projects")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "none",
              border: "none",
              color: "#2590eb",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              padding: "8px 0",
            }}
          >
            <FiArrowLeft /> Back to Projects
          </button>
          <span style={{ color: "#94a3b8" }} className="crumb">
            / Job Overview
          </span>
        </div>

        <h1
          style={{
            fontSize: "28px",
            fontWeight: 700,
            margin: "12px 0 4px",
            color: "#1e293b",
          }}
        >
          Job Overview
        </h1>
        <p style={{ color: "#64748b", margin: 0, fontSize: "16px" }}>
          A complete summary of the job details and requirements
        </p>
      </div>

      <div style={styles.page}>
        {/* LEFT - MAIN CONTENT */}
        <div style={{ ...styles.card, ...styles.left }}>
          {/* Job Header */}
          <div style={styles.jobInfoHeader}>
            <div style={styles.iconContainer}>
              <FiBriefcase size={28} color="#ffffff" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={styles.title}>
                {job?.jobTitle || "Senior Frontend Developer"}
              </div>
              <div style={styles.subtitle}>
                {job?.companyName || "Tech Solutions Inc."}
              </div>

              {/* Quick Stats */}
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  marginTop: "16px",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <FiMapPin size={16} color="#64748b" />
                  <span style={{ color: "#475569", fontSize: "14px" }}>
                    {job?.location || "Visakhapatnam"}
                  </span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <FiDollarSign size={16} color="#64748b" />
                  <span style={{ color: "#475569", fontSize: "14px" }}>
                    ${job?.salaryRange_min || "25"}-
                    {job?.salaryRange_max || "30"} USD/hour
                  </span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <FiClock size={16} color="#64748b" />
                  <span style={{ color: "#475569", fontSize: "14px" }}>
                    Posted 2 days ago
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Details Grid - Now 4 columns on desktop */}
          <div style={styles.grid}>
            <div style={styles.gridItem}>
              <Label icon={FiBriefcase} text="Employment Type" />
              <div style={styles.value}>{job?.employeeType || "Full-time"}</div>
            </div>
            <div style={styles.gridItem}>
              <Label icon={FiHome} text="Work Model" />
              <div style={styles.value}>{job?.workModels || "On-site"}</div>
            </div>
            <div style={styles.gridItem}>
              <Label icon={FiLayers} text="Department" />
              <div style={styles.value}>{job?.department || "Engineering"}</div>
            </div>
            <div style={styles.gridItem}>
              <Label icon={FiTrendingUp} text="Experience" />
              <div style={styles.value}>
                {job?.yearsofExperience || "5"} years
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <FiFileText size={20} color="#4f46e5" />
              Job Description
            </div>
            <div style={styles.contentBlock}>
              <p style={styles.descriptionText}>
                {job?.jobDescription ||
                  "Lead frontend development by building scalable, high-performance applications using React.js, JavaScript (ES6+), and state management libraries like Redux or Context API. They ensure code quality through comprehensive testing and maintain best practices for performance optimization."}
              </p>
            </div>
          </div>

          {/* Required Skills */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <FiLayers size={20} color="#4f46e5" />
              Required Skills
            </div>
            <div style={styles.contentBlock}>
              <div style={styles.skillsContainer}>
                {(
                  job?.requiredSkills?.split(",") || [
                    "REACT",
                    "HTML",
                    "CSS",
                    "JAVA",
                    "JAVASCRIPT",
                  ]
                ).map((skill) => (
                  <span key={skill.trim()} style={styles.skillBadge}>
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Two Column Section for Education and Experience */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
              gap: "24px",
              marginBottom: "28px",
            }}
          >
            <div style={styles.contentBlock}>
              <div style={styles.sectionHeader}>
                <FiBookOpen size={18} color="#4f46e5" />
                Education Level
              </div>
              <div style={styles.value}>{job?.educationLevel || "Masters"}</div>
            </div>
            <div style={styles.contentBlock}>
              <div style={styles.sectionHeader}>
                <FiClock size={18} color="#4f46e5" />
                Years of Experience
              </div>
              <div style={styles.value}>
                {job?.yearsofExperience || "5"} years
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT - SIDEBAR */}
        <div style={styles.right}>
          <div style={styles.card}>
            <ShareJobCard />
          </div>
          <div style={styles.card}>
            <WorkAndPreference />
          </div>
        </div>
      </div>
    </>
  );
};

export default JobOverview;
