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
  FiCheckCircle,
  FiExternalLink,
  FiLoader,
  FiAward,
  FiBookOpen,
  FiStar,
  FiTrendingUp,
  FiLock,
  FiClock,
  FiChevronDown
} from "react-icons/fi";
import { BsDribbble } from "react-icons/bs";
import { FaGem } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useLazyGetEmployeeTalentProfileQuery } from "../../../State-Management/Api/TalentPoolApiSlice";
import { calculateTotalExperience } from "../../../Utils/experienceUtils";
import { toast } from "react-toastify";
import NoData from "../../UploadTalent/NoData";

const formatDateToDisplay = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (isNaN(date)) return value;

  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();

  return `${day}-${month}-${year}`; // 16-Feb-2026
};

const TalentProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpOpen, setIsExpOpen] = React.useState(true);
  const [isProjOpen, setIsProjOpen] = React.useState(true);

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
    experience: calculateTotalExperience(employee?.workexperiences),
    status: state?.candidate?.status || employee?.status || "Verified",
    uploadedByName: state?.candidate?.uploadedByName || "N/A",
    summary: employee?.bio ?? "N/A",
    skills: employee?.skills
      ? employee?.skills.split(",").map((s) => s.trim())
      : [],

    workExperience:
      employee?.workexperiences?.map((exp) => ({
        role: exp.position || "N/A",
        company: exp.companyName || "N/A",
        period: `${exp.startDate ? formatDateToDisplay(exp.startDate) : "N/A"} - ${exp.endDate ? formatDateToDisplay(exp.endDate) : "Present"}`,
        location: employee?.city || "N/A",
        desc: exp.description || "N/A",
      })) || [],

    education:
      employee?.employee_Heighers?.map((edu) => ({
        degree: edu.highestQualification || "N/A",
        school: edu.university || "N/A",
        year: `${edu.startDate ? formatDateToDisplay(edu.startDate) : "N/A"} - ${edu.endDate ? formatDateToDisplay(edu.endDate) : "N/A"}`,
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
        ? formatDateToDisplay(proj.startDate)
        : "N/A",
      endDate: proj.endDate
        ? formatDateToDisplay(proj.endDate)
        : "Present",
      skills: proj.skills
        ? proj.skills.split(",").map((s) => s.trim())
        : [],
      description: proj.description || "N/A",
    })) || [];

  const handleShortlistFromProfile = () => {
    if (!jobId || !employeeId) {
      toast.error("Please select a Job from the filters first to shortlist.");
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
    setIsShortlisted(!exists);
  };

  if (isLoading) return <div className="projects-container d-flex justify-content-center align-items-center"><FiLoader className="loading-spinner" /></div>;

  return (
    <div className="projects-container">
      {/* Breadcrumb - Matches Admin Look */}
      <div className="profile-breadcrumb">
        <button className="breadcrumb-back" onClick={handleBack}>
          <FiArrowLeft /> Talent Pool
        </button>
        <span>/ Talent Details</span>
      </div>

      {/* Hero Section - Matches Admin .company-hero-card */}
      <div className="tp-hero-card">
        <div className="tp-avatar-wrapper">
          {employee?.profilePicture ? (
            <img src={profileData.avatar} alt={profileData.name} className="tp-avatar-lg" />
          ) : (
            <div className="tp-avatar-lg">{getInitials(profileData.name)}</div>
          )}
        </div>
        <div className="tp-info-main">
          <div className="tp-name-row">
            <h1>{profileData.name}</h1>
            <FiCheckCircle color="#10b981" size={24} />
          </div>
          <div className="tp-role-subtitle">{profileData.role}</div>
          <div className="tp-meta-strip">
            <div className="tp-meta-item">
              <FiMapPin /> {profileData.location}
            </div>
            <div className="tp-meta-item">
              <FiBriefcase /> {profileData.experience}
            </div>
            <div className="tp-meta-item">
              <FiAward /> {profileData.status}
            </div>
            {profileData.uploadedByName !== "N/A" && (
              <div className="tp-meta-item">
                <FiUser /> Uploaded By: {profileData.uploadedByName}
              </div>
            )}
          </div>
        </div>

        {/* Quick Action Side in Hero */}
        <div className="tp-sidebar-actions">
          <button
            className="btn-primary"
            onClick={() => {
              const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
              navigate(`${basePath}/user-schedule-interview`);
            }}
          >
            Schedule Interview
          </button>
          <button
            className={`btn-secondary ${isShortlisted ? "active" : ""}`}
            onClick={handleShortlistFromProfile}
          >
            {isShortlisted ? "Selected" : "Shortlist Talent"}
          </button>
        </div>
      </div>

      {/* Content Grid - Matches Admin .profile-details-grid */}
      <div className="tp-details-grid">
        {/* Main Column */}
        <div className="tp-column-main">

          {/* Professional Summary */}
          <div className="tp-card-premium">
            <h3 className="tp-card-title" style={{ borderBottom: "1px solid #f8fafc", paddingBottom: "1.25rem" }}><FiUser /> Professional Summary</h3>
            <p className="summary-text">
              {profileData.summary}
            </p>
          </div>

          {/* Square Section Cards Row */}
          <div className="tp-square-sections-grid">
            {/* Work Experience Square Card */}
            <div className={`tp-square-card ${isExpOpen ? "expanded" : "collapsed"}`}>
              <div className="tp-square-card-header">
                <h3 className="tp-card-title"><FiTrendingUp /> Work Experience</h3>
                <button className="tp-view-toggle" onClick={() => setIsExpOpen(!isExpOpen)}>
                  {isExpOpen ? "Show Less" : "View All"}
                </button>
              </div>

              <div className="tp-square-card-content">
                {isExpOpen ? (
                  <div className="tp-scrollable-area grid-view">
                    {profileData.workExperience.length > 0 ? (
                      profileData.workExperience.map((job, idx) => (
                        <div key={idx} className="tp-item-card">
                          <div className="tp-card-body">
                            <div className="tp-timeline-icon">
                              <FiBriefcase />
                            </div>
                            <div className="tp-card-info">
                              <div className="tp-card-header-row">
                                <h4>{job.role}</h4>
                                <span className="tp-card-badge">{job.company}</span>
                              </div>
                              <div className="tp-timeline-period">
                                <FiCalendar size={12} /> {job.period} • <FiMapPin size={12} /> {job.location}
                              </div>
                              <p className="timeline-desc">{job.desc}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <NoData text="No work history provided" />
                    )}
                  </div>
                ) : (
                  <div className="tp-latest-preview">
                    {profileData.workExperience.length > 0 ? (
                      <div className="tp-preview-item">
                        <div className="tp-preview-header">
                          <div className="tp-timeline-icon sm">
                            <FiBriefcase />
                          </div>
                          <div className="tp-preview-main">
                            <h4>{profileData.workExperience[0].role}</h4>
                            <div className="tp-timeline-company">{profileData.workExperience[0].company}</div>
                          </div>
                        </div>
                        <p className="tp-preview-desc">{profileData.workExperience[0].desc.slice(0, 120)}...</p>
                        <div className="tp-preview-footer">
                          <span>Latest Experience</span>
                          <FiChevronDown />
                        </div>
                      </div>
                    ) : (
                      <NoData text="No work history" />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Project Portfolio Square Card */}
            <div className={`tp-square-card ${isProjOpen ? "expanded" : "collapsed"}`}>
              <div className="tp-square-card-header">
                <h3 className="tp-card-title"><FiFileText /> Project Portfolio</h3>
                <button className="tp-view-toggle" onClick={() => setIsProjOpen(!isProjOpen)}>
                  {isProjOpen ? "Show Less" : "View All"}
                </button>
              </div>

              <div className="tp-square-card-content">
                {isProjOpen ? (
                  <div className="tp-scrollable-area grid-view">
                    {projectsData.length > 0 ? (
                      projectsData.map((data, idx) => (
                        <div key={idx} className="tp-item-card">
                          <div className="tp-card-body">
                            <div className="tp-timeline-icon">
                              <FiExternalLink />
                            </div>
                            <div className="tp-card-info">
                              <div className="tp-card-header-row">
                                <h4>{data.projectName}</h4>
                                <span className="tp-card-badge secondary">{data.role}</span>
                              </div>
                              <div className="tp-tags-wrapper mb-3">
                                {data.skills.map((skill, i) => (
                                  <span key={i} className="tp-tag-pill">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                              <p className="timeline-desc">{data.description}</p>
                              <div className="tp-timeline-period mt-2">
                                <FiCalendar size={12} /> {data.startDate} - {data.endDate}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <NoData text="No projects listed" />
                    )}
                  </div>
                ) : (
                  <div className="tp-latest-preview">
                    {projectsData.length > 0 ? (
                      <div className="tp-preview-item">
                        <div className="tp-preview-header">
                          <div className="tp-timeline-icon sm">
                            <FiExternalLink />
                          </div>
                          <div className="tp-preview-main">
                            <h4>{projectsData[0].projectName}</h4>
                            <div className="tp-timeline-company">{projectsData[0].role}</div>
                          </div>
                        </div>
                        <p className="tp-preview-desc">{projectsData[0].description.slice(0, 120)}...</p>
                        <div className="tp-preview-footer">
                          <span>Latest Project</span>
                          <FiChevronDown />
                        </div>
                      </div>
                    ) : (
                      <NoData text="No projects" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>


        </div>

        {/* Sidebar Column */}
        <div className="tp-column-side">

          {/* Quick Info Sidebar Block */}
          <div className="tp-card-premium sidebar-card">
            <h3 className="tp-card-title">Quick Information</h3>
            <div className="tp-info-block">
              <div className="tp-info-icon-box"><FiStar /></div>
              <div className="tp-info-content-box">
                <div className="tp-info-label-sm">Expected Salary</div>
                <div className="tp-info-value-md">$120k - $150k / yr</div>
              </div>
            </div>
            <div className="tp-info-block">
              <div className="tp-info-icon-box"><FiMapPin /></div>
              <div className="tp-info-content-box">
                <div className="tp-info-label-sm">Work Model</div>
                <div className="tp-info-value-md">Hybrid / Remote</div>
              </div>
            </div>
          </div>

          {/* Skills Sidebar Block */}
          <div className="tp-card-premium sidebar-card">
            <h3 className="tp-card-title">Expertise</h3>
            <div className="tp-tags-wrapper scrollable-skills">
              {profileData.skills.map((skill, idx) => (
                <span key={idx} className="tp-tag-pill">{skill}</span>
              ))}
            </div>
          </div>

          {/* Education Sidebar Block */}
          <div className="tp-card-premium sidebar-card">
            <h3 className="tp-card-title">Education</h3>
            {profileData.education.length > 0 ? (
              profileData.education.map((edu, idx) => (
                <div key={idx} className="tp-info-block" style={{ marginBottom: '16px' }}>
                  <div className="tp-info-icon-box" style={{ background: '#fff7ed', color: '#f5810c' }}>
                    <FiBookOpen size={18} />
                  </div>
                  <div className="tp-info-content-box">
                    <div className="tp-info-value-md">{edu.degree}</div>
                    <div className="tp-info-label-sm">{edu.school}</div>
                    <div className="tp-timeline-period">{edu.year}</div>
                  </div>
                </div>
              ))
            ) : (
              <NoData text="N/A" />
            )}
          </div>

          {/* Contact Locked (Matches Admin Premium Look) */}
          <div className="tp-card-premium tp-contact-locked">
            <h3 className="tp-card-title"><FiLock /> Contact Details</h3>
            <div className="tp-lock-overlay">
              <div className="tp-lock-text">Unlock to view direct contact info</div>
              <button className="tp-btn-unlock">
                <FaGem /> Unlock Profile
              </button>
            </div>
          </div>

          {/* Utility Links */}
          <div className="d-flex justify-content-between px-2">
            <button className="breadcrumb-back" style={{ fontSize: '0.85rem' }}>
              <FiDownload size={14} /> Resume
            </button>
            <button className="breadcrumb-back" style={{ fontSize: '0.85rem' }}>
              <FiShare2 size={14} /> Share
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TalentProfile;