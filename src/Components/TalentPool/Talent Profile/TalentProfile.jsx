import React, { useEffect } from "react";
import "./TalentProfile.css";
import {
  FiMapPin,
  FiBriefcase,
  FiDownload,
  FiShare2,
  FiMail,
  FiPhone,
  FiLinkedin,
  FiFileText,
  FiArrowLeft,
  FiCalendar,
  FiUser,
} from "react-icons/fi";
import { BsDribbble } from "react-icons/bs";
import { FaGem } from "react-icons/fa"; // Added for Premium Diamond Icon
import { useLocation, useNavigate } from "react-router-dom";
import { useLazyGetEmployeeTalentProfileQuery } from "../../../State-Management/Api/TalentPoolApiSlice";

const TalentProfile = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const employeeId = state?.employeeID;
  console.log("EmpId:", employeeId)

  const [triggerGetProfile, { data: employee, isLoading, isError }] =
    useLazyGetEmployeeTalentProfileQuery();

  useEffect(() => {
    if (employeeId) {
      triggerGetProfile(employeeId);
    }
  }, [employeeId, triggerGetProfile]);

  const profileData = {
    name: `${employee?.firstName ?? ""} ${employee?.lastName ?? ""}`,
    role: employee?.title ?? "—",
    location: `${employee?.city ?? ""}, ${employee?.state ?? ""}, ${employee?.country ?? ""}`,
    experience: `${employee?.noofExperience || 0} yrs experience`,
    status: employee?.status ?? "—",
    summary: employee?.bio ?? "",
    stats: [
      { label: "Projects Completed", value: "150+" },
      { label: "Client Satisfaction", value: "98%" },
    ],
    skills: employee?.skills
      ? employee?.skills.split(",").map((s) => s.trim())
      : [],

    workExperience: employee?.workexperiences?.map((exp) => ({
      role: exp.position,
      company: exp.companyName,
      period: `${exp.startDate?.slice(0, 10)} - ${exp.endDate ? exp.endDate.slice(0, 10) : "Present"
        }`,
      location: employee?.city,
      desc: exp.description,
    })) || [],

    education: employee?.employee_Heighers?.map((edu) => ({
      degree: edu.highestQualification,
      school: edu.university,
      year: `${edu.startDate?.slice(0, 4)} - ${edu.endDate?.slice(0, 4)}`,
    })) || [],
  };

  const getInitials = (name = "") => {
    const words = name.trim().split(" ");
    const first = words[0]?.charAt(0) || "";
    const second = words[1]?.charAt(0) || "";
    return (first + second).toUpperCase();
  };

  const projectsData = [
    {
      projectName: "UI/UX",
      role: "Developer",
      startDate: "2024-Jan-12",
      endDate: "2024-Feb-20",
      skills: ["React", "Native"],
      description: "Description1 hjasn dvnsd uhsdunv",
    },
    {
      projectName: "Fintech App",
      role: "Frontend Developer",
      startDate: "2023-Oct-01",
      endDate: "2024-Jan-05",
      skills: ["React", "Redux", "Tailwind"],
      description: "Worked on onboarding flow and dashboard UI",
    },
    {
      projectName: "Admin Dashboard",
      role: "UI Developer",
      startDate: "2023-Jun-15",
      endDate: "2023-Sept-30",
      skills: ["HTML", "CSS", "JavaScript"],
      description: "Built responsive admin panels and tables",
    },
  ];



  return (
    <div className="projects-container">
      {/* Breadcrumb - Matches Global Text Styles */}
      <div className="profile-breadcrumb d-flex gap-1">
        <button
          className="link-button"
          onClick={() => navigate("/user/user-talentpool")}
        >
          <FiArrowLeft /> Talent Pool{" "}
        </button>
        <span className="crumb">/ Profile Page</span>
      </div>

      <div className="dashboard-layout">
        {/* === LEFT MAIN COLUMN === */}
        <div className="dashboard-column-main">
          <div className="row">
            <div className="col-3">
              {/* Profile Header Card */}
              <div className="project-card">
                <div className="profile-avatar-lg initials-avatar">
                  {getInitials(profileData.name)}
                </div>
                <div className="profile-header-content">
                  <div className="d-flex gap-3">
                    <h1 className="mb-2">{profileData.name}</h1>
                    <FiFileText className="profile-verified-icon" />
                  </div>
                  <div className="card-title mb-2">{profileData.role}</div>

                  <div className="profile-meta-row">
                    <span className="meta-item">
                      <FiMapPin /> {profileData.location}
                    </span>
                    <span className="meta-item">
                      <FiBriefcase /> {profileData.experience}
                    </span>
                  </div>

                  <div className="profile-status-wrapper">
                    <span className="status-tag status-completed">
                      {profileData.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-9">
              {/* Professional Summary */}
              <div className="project-card">
                <h2 className="card-title">Professional Summary</h2>
                <p className="summary-text">{profileData.summary}</p>

                <div className="summary-stats-grid">
                  {profileData.stats.map((stat, idx) => (
                    <div key={idx} className="summary-stat-box">
                      <div className="summary-stat-value">{stat.value}</div>
                      <div className="summary-stat-label">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-8">
              {/* Work Experience */}
              <div className="project-card mb-3">
                <h2 className="card-title">Work Experience</h2>
                <div className="experience-list">
                  {profileData.workExperience.length > 0 ? (
                    profileData.workExperience.map((job, idx) => (
                      <div key={idx} className="experience-item">
                        <div className="experience-icon-box">
                          <FiBriefcase />
                        </div>
                        <div className="experience-content">
                          <h3>{job.role}</h3>
                          <div className="job-meta">
                            {job.company} • {job.period}
                          </div>
                          <div className="job-location">{job.location}</div>
                          <p className="job-desc">{job.desc}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ color: "#94a3b8", fontSize: "14px" }}>
                      No work experience added yet
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-4">
              {/* Skills & Expertise */}
              <div className="project-card mb-3">
                <h2 className="card-title">Skills & Expertise</h2>
                <div className="skills-container">
                  {profileData.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="status-tag status-progress"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="project-card sidebar-card">
                <h3 className="card-title">Education</h3>

                <div className="education-list">
                  {profileData.education.length > 0 ? (
                    profileData.education.map((edu, idx) => (
                      <div key={idx} className="interview-item-premium">
                        <div className="edu-icon-box">
                          <FiFileText size={14} />
                        </div>

                        <div>
                          <div className="edu-degree">{edu.degree}</div>
                          <div className="edu-school">{edu.school}</div>
                          <div className="edu-year">{edu.year}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#94a3b8",
                        padding: "8px 0",
                      }}
                    >
                      No education details added yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Portfolio */}
          <div className="portfolio-section">
            <div className="portfolio-header">
              <h2 className="card-title">Projects</h2>
            </div>

            <div className="premium-portfolio-grid">
              {/* projects */}
              {projectsData.map((data, index) => (
                <div className="project-card mb-3">
                  {/* Header */}
                  <div className="card-top">
                    <div>
                      <h3 className="card-title">{data.projectName}</h3>
                      <p className="card-subtitle">{data.role}</p>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="d-flex justify-content-between">
                    <div className="">
                      <span style={{ fontSize: "14px" }}>Start Date</span>
                      <div className="card-date">
                        <FiCalendar />
                        {data.startDate}
                      </div>
                    </div>

                    <div className="">
                      <span style={{ fontSize: "14px" }}>End Date</span>
                      <div className="card-date">
                        <FiCalendar />
                        {data.endDate}
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="card-skills">
                    {data.skills.map((skill, i) => (
                      <span key={i} className="status-tag status-progress">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Description */}
                  <p className="card-description">{data.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* === RIGHT SIDE COLUMN === */}
        <div className="dashboard-column-side">
          {/* Action Buttons */}
          <div className="sidebar-actions">
            <button
              className="btn-primary w-100"
              onClick={() => navigate("/user/user-schedule-interview")}
            >
              Schedule Interview
            </button>
            <button className="btn-secondary w-100">Shortlist Candidate</button>

            <div className="sidebar-links">
              <button className="link-btn">
                <FiDownload /> Download Resume
              </button>
              <button className="link-btn">
                <FiShare2 /> Share Profile
              </button>
            </div>
          </div>

          {/* Quick Information */}
          <div className="table-card sidebar-card">
            <h3 className="card-title">Quick Information</h3>

            <div className="quick-info-item">
              <div className="stat-label">Expected Salary</div>
              <div className="info-value">$120,000 - $150,000 / year</div>
            </div>

            <div className="quick-info-item">
              <div className="stat-label">Notice Period</div>
              <div className="info-value">2 weeks</div>
            </div>

            <div className="quick-info-item">
              <div className="stat-label">Work Preference</div>
              <div className="info-value">Hybrid (2-3 days remote)</div>
            </div>

            <div className="quick-info-item">
              <div className="stat-label">Languages</div>
              <div className="languages-list">
                <span className="status-tag status-pending">English</span>
                <span className="status-tag status-pending">Spanish</span>
              </div>
            </div>
          </div>

          {/* Contact Information - BLURRED PREMIUM SECTION */}
          <div
            className="table-card sidebar-card"
            style={{ position: "relative", overflow: "hidden" }}
          >
            <h3 className="card-title">Contact Information</h3>

            {/* Blurred Content Layer */}
            <div
              className="contact-list"
              style={{
                filter: "blur(6px)",
                opacity: 0.6,
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              <div className="contact-item">
                <FiMail className="contact-icon" /> [sarah.anderson@example.com]
              </div>
              <div className="contact-item">
                <FiPhone className="contact-icon" /> +1 (555) 123-4567
              </div>
              <div className="contact-item">
                <FiLinkedin className="contact-icon" />{" "}
                linkedin.com/in/sarahanderson
              </div>
              <div className="contact-item">
                <BsDribbble className="contact-icon" /> sarahanderson.design
              </div>
            </div>

            {/* Premium Overlay Layer */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255, 255, 255, 0.4)",
                zIndex: 10,
                gap: "12px",
              }}
            >
              <button
                className="link-btn"
              >
                <FaGem /> Unlock Premium
              </button>

              <button
                className="btn-primary w-50"
              >
                Contact Hiring Manager
              </button>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default TalentProfile;
