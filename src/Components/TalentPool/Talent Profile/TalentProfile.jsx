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
  const location = useLocation();

const query = new URLSearchParams(location.search);
const from = query.get("from");

const handleBack = () => {
  if (from) {
    navigate(decodeURIComponent(from));
  } else {
    navigate(-1);
  }
};
  const { state } = useLocation();
  const employeeId = state?.employeeID;
  console.log("EmpId:", employeeId);
  const jobId = state?.jobId;

const [isShortlisted, setIsShortlisted] = React.useState(false);

useEffect(() => {
  if (!jobId || !employeeId) return;

  const stored = JSON.parse(localStorage.getItem("shortlistedMap") || "{}");
  const exists = stored[jobId]?.some(c => c.id === employeeId);
  setIsShortlisted(!!exists);
}, [jobId, employeeId]);

  const [triggerGetProfile, { data: employee, isLoading, isError }] =
    useLazyGetEmployeeTalentProfileQuery();

  useEffect(() => {
    if (employeeId) {
      triggerGetProfile(employeeId);
    }
  }, [employeeId, triggerGetProfile]);

  const profileData = {
    name: `${employee?.firstName ?? ""} ${employee?.lastName ?? ""}`.trim() || "N/A",
    role: employee?.title ?? "N/A",
    avatar:
    employee?.profilePicture ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      `${employee?.firstName ?? ""} ${employee?.lastName ?? ""}`
    )}`,
    location: `${employee?.city ?? ""}, ${employee?.state ?? ""}, ${employee?.country ?? ""}`.trim().replace(/^,\s*|\s*,\s*$/g, '') || "N/A",
    experience: employee?.noofExperience ? `${employee.noofExperience} yrs experience` : "N/A",
    status: employee?.status ?? "N/A",
    summary: employee?.bio ?? "N/A",
    stats: [
      { label: "Projects Completed", value: "150+" },
      { label: "Client Satisfaction", value: "98%" },
    ],
    skills: employee?.skills
      ? employee?.skills.split(",").map((s) => s.trim())
      : [],

    workExperience:
      employee?.workexperiences?.map((exp) => ({
        role: exp.position || "N/A",
        company: exp.companyName || "N/A",
        period: `${exp.startDate?.slice(0, 10) || "N/A"} - ${exp.endDate ? exp.endDate.slice(0, 10) : "Present"
          }`,
        location: employee?.city || "N/A",
        desc: exp.description || "N/A",
      })) || [],

    education:
      employee?.employee_Heighers?.map((edu) => ({
        degree: edu.highestQualification || "N/A",
        school: edu.university || "N/A",
        year: `${edu.startDate?.slice(0, 4) || "N/A"} - ${edu.endDate?.slice(0, 4) || "N/A"}`,
      })) || [],
  };

  const getInitials = (name = "") => {
    if (name === "N/A") return "N/A";
    const words = name.trim().split(" ");
    const first = words[0]?.charAt(0) || "";
    const second = words[1]?.charAt(0) || "";
    return (first + second).toUpperCase();
  };

  const projectsData =
  employee?.employeeprojects?.map((proj) => ({
    projectName: proj.projectName || "N/A",
    role: proj.role || "N/A",
    startDate: proj.startDate
      ? proj.startDate.slice(0, 10)
      : "N/A",
    endDate: proj.endDate
      ? proj.endDate.slice(0, 10)
      : "Present",
    skills: proj.skills
      ? proj.skills.split(",").map((s) => s.trim())
      : [],
    description: proj.description || "N/A",
  })) || [];

  const handleShortlistFromProfile = () => {
  if (!jobId || !employeeId) {
    alert("Select a job before shortlisting");
    return;
  }

  const stored = JSON.parse(localStorage.getItem("shortlistedMap") || "{}");
  const currentList = stored[jobId] || [];

  const exists = currentList.some(c => c.id === employeeId);

  const updated = {
    ...stored,
    [jobId]: exists
      ? currentList.filter(c => c.id !== employeeId)
      : [
          ...currentList,
          {
            id: employeeId,
            name: profileData.name,
            role: profileData.role,
            avatar: profileData.avatar,
            inviteUserId: employee?.insertBy,
          },
        ],
  };

  localStorage.setItem("shortlistedMap", JSON.stringify(updated));
  setIsShortlisted(!exists); // 🔥 update UI instantly
};


  return (
    <div className="projects-container">
      {/* Breadcrumb - Matches Global Text Styles */}
      <div className="profile-breadcrumb d-flex gap-1">
        <button
          className="link-button"
          onClick={handleBack}
        >
          <FiArrowLeft /> Talent Pool{" "}
        </button>
        <span className="crumb">/ Profile Page</span>
      </div>

      <div className="dashboard-layout gap-2">
        {/* === LEFT MAIN COLUMN === */}
        <div className="dashboard-column-main">
          <div className="row">
            <div className="row">
              <div className="col-3">
                {/* Profile Header Card */}
                <div className="project-card h-100">
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

                <div className="project-card h-100">
                  <h2 className="card-title">Professional Summary</h2>

                  <div className="summary-text-container" style={{
                    flex: 1,
                    overflow: "auto",
                    marginBottom: "16px"
                  }}>
                    <p className="summary-text">{profileData.summary}</p>
                  </div>

                  <div className="summary-stats-grid" style={{ flexShrink: 0 }}>
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
          </div>

          <div className="row">
            <div className="row" style={{ minHeight: "400px" }}>
              <div className="col-8">
                {/* Work Experience */}
                <div className="project-card mb-3 h-100" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
                  <h2 className="card-title">Work Experience</h2>
                  <div className="experience-list" style={{ flex: 1, overflow: "auto" }}>
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
                      <div
                        style={{
                          color: "#94a3b8",
                          fontSize: "14px",
                          textAlign: "center",
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                        }}
                      >
                        No work experience added yet
                        <img
                          src="../Images/no data.svg"
                          alt="No data"
                          style={{
                            width: "100%",
                            maxWidth: "300px",
                            height: "auto",
                            marginTop: "12px",
                            objectFit: "contain",
                            opacity: "50%"
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-4 d-flex flex-column gap-3" style={{ height: "100%" }}>
                {/* Skills & Expertise */}
                <div className="project-card flex-grow-1" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
                  <h2 className="card-title">Skills & Expertise</h2>
                  <div className="skills-container">
                    {profileData.skills.length > 0 ? (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {profileData.skills.map((skill, idx) => (
                          <span key={idx} className="status-tag status-progress" style={{height: "25px"}}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div
                        style={{
                          fontSize: "14px",
                          color: "#94a3b8",
                          padding: "8px 0",
                          width: "100%",
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          textAlign: "center",
                        }}
                      >
                        No skills added yet
                        <img
                          src="../Images/no data.svg"
                          alt="No data"
                          style={{
                            width: "100%",
                            maxWidth: "110px",
                            height: "auto",
                            marginTop: "12px",
                            objectFit: "contain",
                            opacity: "50%"
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Education */}
                <div className="project-card sidebar-card flex-grow-1" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
                  <h3 className="card-title">Education</h3>
                  <div className="education-list" style={{ flex: 1, overflow: "auto" }}>
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
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          textAlign: "center",
                        }}
                      >
                        No education details added yet
                        <img
                          src="../Images/no data.svg"
                          alt="No data"
                          style={{
                            width: "100%",
                            maxWidth: "110px",
                            height: "auto",
                            marginTop: "12px",
                            objectFit: "contain",
                            opacity: "50%"
                          }}
                        />
                      </div>
                    )}
                  </div>
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
  {projectsData.length > 0 ? (
    projectsData.map((data, index) => (
      <div key={index} className="project-card mb-3">
        <div className="card-top">
          <div>
            <h3 className="card-title">{data.projectName}</h3>
            <p className="card-subtitle">{data.role}</p>
          </div>
        </div>

        <div className="d-flex justify-content-between">
          <div>
            <span style={{ fontSize: "14px" }}>Start Date</span>
            <div className="card-date">
              <FiCalendar />
              {data.startDate}
            </div>
          </div>

          <div>
            <span style={{ fontSize: "14px" }}>End Date</span>
            <div className="card-date">
              <FiCalendar />
              {data.endDate}
            </div>
          </div>
        </div>

        <div className="card-skills">
          {data.skills.map((skill, i) => (
            <span key={i} className="status-tag status-progress">
              {skill}
            </span>
          ))}
        </div>

        <p className="card-description">{data.description}</p>
      </div>
    ))
  ) : (
  <div
    style={{
      color: "#94a3b8",
      fontSize: "14px",
      textAlign: "center",
      padding: "30px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    No projects added yet

    <img
      src="../Images/no data.svg"
      alt="No data"
      style={{
        width: "100%",
        maxWidth: "200px",
        height: "auto",
        marginTop: "12px",
        objectFit: "contain",
        opacity: "50%",
      }}
    />
  </div>
)}
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
            <button
  className={`btn-secondary w-100 ${isShortlisted ? "active" : ""}`}
  onClick={handleShortlistFromProfile}
  style={{
    backgroundColor: isShortlisted ? "#3B82F6" : "",
    color: isShortlisted ? "#fff" : ""
  }}
>
  {isShortlisted ? "Shortlisted" : "Shortlist Candidate"}

</button>


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
          <div className=" sidebar-card project-card">
            <h3 className="card-title">Quick Information</h3>

            <div className="quick-info-item">
              <div className="stat-label">Expected Salary</div>
              <div className="info-value">$120,000 - $150,000 / year</div>
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
            className="sidebar-card project-card"
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
              <button className="link-btn">
                <FaGem /> Unlock Premium
              </button>

              <button className="btn-primary w-50">
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