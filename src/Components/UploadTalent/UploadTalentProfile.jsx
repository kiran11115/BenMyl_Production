import React, { useEffect, useMemo } from "react";
import {
  FiMapPin,
  FiBriefcase,
  FiDownload,
  FiShare2,
  FiMail,
  FiPhone,
  FiLinkedin,
  FiFileText,
  FiEye,
  FiExternalLink,
  FiArrowLeft,
} from "react-icons/fi";
import { BsDribbble } from "react-icons/bs";
import { FaGem } from "react-icons/fa"; // Added for Premium Diamond Icon
import { useLocation, useNavigate } from "react-router-dom";
import { useLazyGetEmployeeTalentProfileQuery } from "../../State-Management/Api/TalentPoolApiSlice";

const UploadTalentProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const employeeId = location.state?.employeeId;

  const [getEmployeeProfile, { data: apiData, isLoading, isError }] =
    useLazyGetEmployeeTalentProfileQuery();

  useEffect(() => {
    if (employeeId) {
      getEmployeeProfile(employeeId);
    }
  }, [employeeId, getEmployeeProfile]);

  const getInitials = (firstName = "", lastName = "") => {
    const first = firstName.trim().charAt(0);
    const last = lastName.trim().charAt(0);
    return (first + last).toUpperCase();
  };

  const profileData = useMemo(() => {
    if (!apiData) return null;

    return {
      name: `${apiData?.firstName} ${apiData?.lastName}`,
      role: apiData?.title,
      location: `${apiData?.city}, ${apiData?.state}`,
      experience: `${apiData?.noofExperience}+ years experience`,
      status: apiData?.status,

      summary: apiData?.bio,
      email: apiData?.emailAddress,
      phoneNo: apiData?.phoneNo,
      stats: [
        { label: "Experience", value: `${apiData?.noofExperience}+ yrs` },
        { label: "Projects", value: apiData?.employeeprojects?.length || 0 },
      ],

      skills: apiData?.skills ? apiData?.skills.split(",") : [],

      workExperience:
        apiData?.workexperiences?.map((w) => ({
          role: w.position,
          company: w.companyName,
          period: `${w.startDate?.slice(0, 4)} - ${
            w.endDate ? w.endDate.slice(0, 4) : "Present"
          }`,
          location: apiData?.city,
          desc: w.description,
        })) || [],

      portfolio:
        apiData?.employeeprojects?.map((p) => ({
          title: p.projectName,
          role: p.role,
          description: p.description,
          period: `${p.startDate?.slice(0, 10)} - ${
            p.endDate ? p.endDate.slice(0, 10) : "Present"
          }`,
          tags: p.skills ? p.skills.split(",") : [],

        })) || [],

      education:
        apiData.employee_Heighers?.map((edu) => ({
          degree: edu.highestQualification,
          school: edu.university,
          field: edu.fieldofstudy,
          year: `${edu.startDate?.slice(0, 4)} - ${
            edu.endDate ? edu.endDate.slice(0, 4) : "Present"
          }`,
          certifications: edu.certifications,
          percentage: edu.percentage,
        })) || [],

      resume: apiData?.resumeFilePath,

      languages: apiData?.prefLanguage ? apiData?.prefLanguage.split(",") : [],
    };
  }, [apiData]);

  const initials = useMemo(() => {
    if (!apiData) return "";
    return getInitials(apiData.firstName, apiData.lastName);
  }, [apiData]);

  return (
    <div className="projects-container">
      {/* Breadcrumb - Matches Global Text Styles */}
      <div className="profile-breadcrumb d-flex gap-1">
        <button
          className="link-button"
          onClick={() => navigate("/user/user-upload-talent")}
        >
          <FiArrowLeft /> Talent Profile
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
                {apiData?.profileImage ? (
                  <img
                    src={apiData.profileImage}
                    alt={profileData?.name}
                    className="profile-avatar-lg"
                  />
                ) : (
                  <div className="profile-avatar-lg avatar-initials">
                    {initials}
                  </div>
                )}
                <div className="profile-header-content">
                  <div className="d-flex gap-3">
                    <h1 className="mb-2">{profileData?.name}</h1>
                    <FiFileText className="profile-verified-icon" />
                  </div>
                  <div className="card-title mb-2">{profileData?.role}</div>

                  <div className="profile-meta-row">
                    <span className="meta-item">
                      <FiMapPin /> {profileData?.location}
                    </span>
                    <span className="meta-item">
                      <FiBriefcase /> {profileData?.experience}
                    </span>
                  </div>

                  <div className="profile-status-wrapper">
                    <span className="status-tag status-completed">
                      {profileData?.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-9">
              {/* Professional Summary */}
              <div className="project-card">
                <h2 className="card-title">Professional Summary</h2>
                <p className="summary-text">{profileData?.summary}</p>

                <div className="summary-stats-grid">
                  {profileData?.stats.map((stat, idx) => (
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
              <div className="project-card">
                <h2 className="card-title">Work Experience</h2>
                <div className="experience-list">
                  {profileData?.workExperience.map((job, idx) => (
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
                  ))}
                </div>
              </div>
            </div>
            <div className="col-4">
              {/* Skills & Expertise */}
              <div className="project-card">
                <h2 className="card-title">Skills & Expertise</h2>
                <div className="skills-container">
                  {profileData?.skills.map((skill, idx) => (
                    <span key={idx} className="status-tag status-progress">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Portfolio */}
          <div className="portfolio-section">
            <div className="portfolio-header">
              <h2 className="card-title">Projects</h2>
              <span className="portfolio-count">
                {profileData?.portfolio.length} Projects
              </span>
            </div>

            <div className="projects-grid premium-portfolio-grid">
              {profileData?.portfolio.map((item, idx) => (
                <div key={idx} className="premium-portfolio-card">
                  <div className="portfolio-content">
                    <h3 className="portfolio-title">{item.title}</h3>
                    <div className="small text-muted">
                      {item.role} • {item.period}
                    </div>

                    {item.description && (
                      <p className="small text-muted mt-1">
                        {item.description}
                      </p>
                    )}
                    <div className="portfolio-tags">
                      {item.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="portfolio-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
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
              onClick={() => navigate("/user/user-jobs")}
            >
              Find Jobs
            </button>
            <button className="btn-secondary w-100">Preview Resume</button>

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
              // style={{
              //     filter: "blur(6px)",
              //     opacity: 0.6,
              //     pointerEvents: "none",
              //     userSelect: "none",
              // }}
            >
              <div className="contact-item">
                <FiMail className="contact-icon" /> {profileData?.email}
              </div>
              <div className="contact-item">
                <FiPhone className="contact-icon" /> {profileData?.phoneNo}
              </div>
              <div className="contact-item">
                <FiLinkedin className="contact-icon" />{" "}
                linkedin.com/in/sarahanderson
              </div>
              <div className="contact-item">
                <BsDribbble className="contact-icon" /> sarahanderson.design
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="table-card sidebar-card">
            <h3 className="card-title">Education</h3>

            <div className="education-list">
              {profileData?.education.length === 0 ? (
                <p className="text-muted">No education details available</p>
              ) : (
                profileData?.education.map((edu, index) => (
                  <div key={index} className="interview-item-premium">
                    <div className="edu-icon-box">
                      <FiFileText size={14} />
                    </div>

                    <div>
                      <div className="edu-degree">
                        {edu.degree}
                        {edu.field && ` in ${edu.field}`}
                      </div>

                      <div className="edu-school">{edu.school}</div>

                      <div className="edu-year">{edu.year}</div>

                      {edu.certifications && (
                        <div className="edu-cert">
                          Certification: {edu.certifications}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadTalentProfile;
