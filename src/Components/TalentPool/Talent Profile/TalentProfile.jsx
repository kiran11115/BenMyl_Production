import React, { useEffect } from "react";
import "./TalentProfile.css";
import {
  FiMapPin,
  FiBriefcase,
  FiDownload,
  FiShare2,
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
  FiChevronDown
} from "react-icons/fi";
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
  return `${day}-${month}-${year}`;
};

const TalentProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpOpen, setIsExpOpen] = React.useState(true);
  const [isProjOpen, setIsProjOpen] = React.useState(true);

  const query = new URLSearchParams(location.search);
  const from = query.get("from");

  const { state } = useLocation();
  const employeeId = state?.employeeID;
  const jobId = state?.jobId;

  const handleBack = () => {
    if (from) {
      navigate(decodeURIComponent(from), { state: { jobId } });
    } else {
      navigate(-1);
    }
  };

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
      startDate: proj.startDate ? formatDateToDisplay(proj.startDate) : "N/A",
      endDate: proj.endDate ? formatDateToDisplay(proj.endDate) : "Present",
      skills: proj.skills ? proj.skills.split(",").map((s) => s.trim()) : [],
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

  if (isLoading) return (
    <div className="ai-dashboard-wrapper d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <FiLoader className="tp-spinner" />
    </div>
  );

  return (
    <div className="ai-dashboard-wrapper">

      {/* ── HERO HEADER CARD ── */}
      <div className="hero-card mb-4">
        <div className="hero-left">
          <div className="hero-pill">✦ Talent Profile</div>
          <h1 className="job-posting-title text-white">{profileData.name}</h1>
          <div className="job-posting-header-info">
            <p className="job-posting-subtitle">
              {profileData.role} &nbsp;•&nbsp; {profileData.location}
            </p>
          </div>
        </div>
        <div className="hero-buttons">
          <button type="button" className="routine-btn" onClick={handleBack}>
            <FiArrowLeft style={{ marginRight: '6px' }} /> Back
          </button>
          <button
            type="button"
            className="routine-btn"
            onClick={() => {
              const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
              navigate(`${basePath}/user-schedule-interview`);
            }}
          >
            Schedule Interview
          </button>
          <button
            type="button"
            className={`routine-btn${isShortlisted ? ' tp-shortlisted-btn' : ''}`}
            onClick={handleShortlistFromProfile}
          >
            {isShortlisted ? "✓ Shortlisted" : "Shortlist Talent"}
          </button>
        </div>
      </div>

      {/* ── PROFILE IDENTITY STRIP ── */}
      <div className="premium-card tp-identity-strip mb-4">
        <div className="tp-avatar-col">
          {employee?.profilePicture ? (
            <img src={profileData.avatar} alt={profileData.name} className="tp-avatar-sm" />
          ) : (
            <div className="tp-avatar-sm tp-avatar-initials">{getInitials(profileData.name)}</div>
          )}
        </div>
        <div className="tp-identity-info">
          <div className="tp-identity-name">
            {profileData.name}
            <FiCheckCircle size={14} style={{ color: '#10b981', marginLeft: 8 }} />
          </div>
          <div className="tp-identity-role">{profileData.role}</div>
          <div className="tp-meta-pills">
            <span className="tp-meta-pill"><FiMapPin size={11} /> {profileData.location}</span>
            <span className="tp-meta-pill"><FiBriefcase size={11} /> {profileData.experience}</span>
            <span className="tp-meta-pill"><FiAward size={11} /> {profileData.status}</span>
            {profileData.uploadedByName !== "N/A" && (
              <span className="tp-meta-pill"><FiUser size={11} /> By: {profileData.uploadedByName}</span>
            )}
          </div>
        </div>
        <div className="tp-identity-actions">
          <button className="tp-util-btn"><FiDownload size={13} /> Resume</button>
          <button className="tp-util-btn"><FiShare2 size={13} /> Share</button>
        </div>
      </div>

      {/* ── MAIN CONTENT GRID ── */}
      <div className="tp-content-grid">

        {/* ─ LEFT COLUMN ─ */}
        <div className="tp-col-main">

          {/* Professional Summary */}
          <div className="premium-card mb-3">
            <div className="tp-section-heading"><FiUser size={13} /> Professional Summary</div>
            <p className="tp-summary-text">{profileData.summary}</p>
          </div>

          {/* Work Experience */}
          <div className="premium-card mb-3">
            <div className="tp-section-heading-row">
              <span className="tp-section-heading"><FiTrendingUp size={13} /> Work Experience</span>
              <button className="tp-toggle-btn" onClick={() => setIsExpOpen(!isExpOpen)}>
                {isExpOpen ? "Show Less" : "View All"} <FiChevronDown size={12} style={{ transform: isExpOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
              </button>
            </div>
            {isExpOpen ? (
              <div className="tp-exp-list">
                {profileData.workExperience.length > 0 ? (
                  profileData.workExperience.map((job, idx) => (
                    <div key={idx} className="tp-exp-item">
                      <div className="tp-exp-icon"><FiBriefcase size={13} /></div>
                      <div className="tp-exp-body">
                        <div className="tp-exp-title-row">
                          <span className="tp-exp-role">{job.role}</span>
                          <span className="tp-exp-badge">{job.company}</span>
                        </div>
                        <div className="tp-exp-period">
                          <FiCalendar size={11} /> {job.period} &nbsp;•&nbsp; <FiMapPin size={11} /> {job.location}
                        </div>
                        <p className="tp-exp-desc">{job.desc}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <NoData text="No work history provided" />
                )}
              </div>
            ) : (
              profileData.workExperience.length > 0 ? (
                <div className="tp-exp-preview">
                  <span className="tp-exp-role">{profileData.workExperience[0].role}</span>
                  <span className="tp-exp-badge">{profileData.workExperience[0].company}</span>
                  <p className="tp-exp-desc" style={{ marginTop: 6 }}>
                    {profileData.workExperience[0].desc.slice(0, 120)}…
                  </p>
                </div>
              ) : <NoData text="No work history" />
            )}
          </div>

          {/* Project Portfolio */}
          <div className="premium-card mb-3">
            <div className="tp-section-heading-row">
              <span className="tp-section-heading"><FiFileText size={13} /> Project Portfolio</span>
              <button className="tp-toggle-btn" onClick={() => setIsProjOpen(!isProjOpen)}>
                {isProjOpen ? "Show Less" : "View All"} <FiChevronDown size={12} style={{ transform: isProjOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
              </button>
            </div>
            {isProjOpen ? (
              <div className="tp-proj-grid">
                {projectsData.length > 0 ? (
                  projectsData.map((data, idx) => (
                    <div key={idx} className="tp-proj-item">
                      <div className="tp-proj-icon"><FiExternalLink size={13} /></div>
                      <div className="tp-exp-body">
                        <div className="tp-exp-title-row">
                          <span className="tp-exp-role">{data.projectName}</span>
                          <span className="tp-exp-badge secondary">{data.role}</span>
                        </div>
                        <div className="tp-tag-row">
                          {data.skills.map((skill, i) => (
                            <span key={i} className="tp-tag">{skill}</span>
                          ))}
                        </div>
                        <p className="tp-exp-desc">{data.description}</p>
                        <div className="tp-exp-period">
                          <FiCalendar size={11} /> {data.startDate} — {data.endDate}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <NoData text="No projects listed" />
                )}
              </div>
            ) : (
              projectsData.length > 0 ? (
                <div className="tp-exp-preview">
                  <span className="tp-exp-role">{projectsData[0].projectName}</span>
                  <span className="tp-exp-badge secondary">{projectsData[0].role}</span>
                  <p className="tp-exp-desc" style={{ marginTop: 6 }}>
                    {projectsData[0].description.slice(0, 120)}…
                  </p>
                </div>
              ) : <NoData text="No projects" />
            )}
          </div>
        </div>

        {/* ─ RIGHT SIDEBAR ─ */}
        <div className="tp-col-side">

          {/* Quick Info */}
          <div className="premium-card mb-3">
            <div className="tp-section-heading">Quick Information</div>
            <div className="tp-info-row">
              <div className="tp-info-icon"><FiStar size={13} /></div>
              <div>
                <div className="tp-info-label">Expected Salary</div>
                <div className="tp-info-value">$120k – $150k / yr</div>
              </div>
            </div>
            <div className="tp-info-row">
              <div className="tp-info-icon"><FiMapPin size={13} /></div>
              <div>
                <div className="tp-info-label">Work Model</div>
                <div className="tp-info-value">Hybrid / Remote</div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="premium-card mb-3">
            <div className="tp-section-heading">Expertise</div>
            <div className="tp-tag-row">
              {profileData.skills.map((skill, idx) => (
                <span key={idx} className="tp-tag">{skill}</span>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="premium-card mb-3">
            <div className="tp-section-heading">Education</div>
            {profileData.education.length > 0 ? (
              profileData.education.map((edu, idx) => (
                <div key={idx} className="tp-info-row" style={{ marginBottom: 12 }}>
                  <div className="tp-info-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>
                    <FiBookOpen size={13} />
                  </div>
                  <div>
                    <div className="tp-info-value">{edu.degree}</div>
                    <div className="tp-info-label">{edu.school}</div>
                    <div className="tp-info-label" style={{ marginTop: 2 }}>{edu.year}</div>
                  </div>
                </div>
              ))
            ) : (
              <NoData text="N/A" />
            )}
          </div>

          {/* Contact Locked */}
          <div className="premium-card mb-3 tp-contact-locked">
            <div className="tp-section-heading"><FiLock size={12} /> Contact Details</div>
            <div className="tp-lock-body">
              <div className="tp-lock-msg">Unlock to view direct contact info</div>
              <button className="tp-unlock-btn"><FaGem size={12} /> Unlock Profile</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TalentProfile;