import React, { useEffect } from "react";
import "./TalentProfile.css";
import "../../UserJobs/Jobs.css";
import {
  FiMapPin,
  FiBriefcase,
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
  FiChevronDown,
  FiAlertCircle,
  FiPlusCircle,
  FiX
} from "react-icons/fi";
import { FaGem } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useLazyGetEmployeeTalentProfileQuery,
  useGetGroupedJobTitlesQuery,
  useGetEmployeeProfessionalDetailsQuery
} from "../../../State-Management/Api/TalentPoolApiSlice";
import { calculateTotalExperience } from "../../../Utils/experienceUtils";
import { toast } from "react-toastify";
import NoData from "../../UploadTalent/NoData";
import RecommendedJobs from "../../UploadTalent/RecommendedJobs";

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
  const [activeTab, setActiveTab] = React.useState("Overview");
  const tabs = ["Overview", "Experience", "Projects", "Education"];
  const [showNoJobModal, setShowNoJobModal] = React.useState(false);
  const [isRecommendedJobsOpen, setIsRecommendedJobsOpen] = React.useState(false);

  const query = new URLSearchParams(location.search);
  const from = query.get("from");

  const { state } = useLocation();
  const fromJobOverview = state?.fromJobOverview;
  const employeeId = state?.employeeID;
  const jobId = state?.jobId;
  const userId = localStorage.getItem("CompanyId");

  // Fetch available job listings to match by role
  const { data: jobTitles = [] } = useGetGroupedJobTitlesQuery(userId, { skip: !userId });

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

  const { data: professionalData, isLoading: isProfessionalLoading } =
    useGetEmployeeProfessionalDetailsQuery(employeeId, {
      refetchOnMountOrArgChange: true,
      skip: !employeeId,
    });

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

    // ── Existing shortlist logic (unchanged) ──
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

  if (isLoading || isProfessionalLoading) return (
    <div className="posted-jobs-loader" style={{ minHeight: '60vh' }}>
      <div className="jobs-loader-ring">
        <div className="jobs-loader-icon"><FiUser size={18} /></div>
      </div>
      <p className="jobs-loader-text">Loading profile...</p>
      <span className="jobs-loader-sub">Fetching candidate details</span>
    </div>
  );

  return (
    <div className="ai-dashboard-wrapper">

      {/* ── HERO HEADER CARD (COVER) ── */}
      <div className="hero-card tp-banner">
        <button type="button" className="routine-btn mb-5" onClick={handleBack} style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(4px)' }}>
          <FiArrowLeft style={{ marginRight: '6px' }} /> Back
        </button>
        {!fromJobOverview && (

          <button

            type="button"

            className={`routine-btn mb-5${isShortlisted ? ' tp-shortlisted-btn' : ''}`}

            onClick={handleShortlistFromProfile}

          >

            {isShortlisted ? "✓ Shortlisted" : "Shortlist Talent"}

          </button>

        )}
      </div>

      {/* ── MAIN PROFILE OVERLAP CARD ── */}
      <div className="premium-card tp-main-profile-card">
        <div className="d-flex align-items-start gap-4">
          <div className="tp-avatar-wrapper mb-0 mt-1">
            {employee?.profilePicture ? (
              <img src={profileData.avatar} alt={profileData.name} className="tp-avatar-large" />
            ) : (
              <div className="tp-avatar-large tp-avatar-initials-large">{getInitials(profileData.name)}</div>
            )}
          </div>

          <div style={{ flex: 1 }}>
            <h1 className="tp-profile-name">
              {profileData.name}
              <FiCheckCircle size={16} className="tp-verified-icon ms-2" />
            </h1>
            <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
              <p className="tp-profile-role mb-0" style={{ color: '#64748b' }}>
                {profileData.role} &nbsp;•&nbsp; {profileData.location}
              </p>
              <div className="tp-meta-pills-row mb-0">
                <span className="job-chip orange py-1 px-2"><FiBriefcase size={12} /> {profileData.experience}</span>
                <span className="job-chip purple py-1 px-2"><FiAward size={12} /> {profileData.status}</span>
                {profileData.uploadedByName !== "N/A" && (
                  <span className="tp-meta-pill-outline py-1 px-2" style={{ height: 'auto', lineHeight: 1 }}><FiUser size={12} /> By: {profileData.uploadedByName}</span>
                )}
              </div>
            </div>
            <p className="tp-exp-desc mb-4" style={{ color: '#64748b', maxWidth: '800px', lineHeight: '1.6' }}>
              {profileData.summary}
            </p>

            {/* ── IMAGE-STYLE TABS (Inside Card) ── */}
            <div className="tp-image-tabs" style={{ flexWrap: 'wrap', overflowX: 'visible', borderTop: 'none', paddingBottom: '0' }}>
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`tp-image-tab ${activeTab === tab ? 'active' : ''}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="tp-main-content-wrapper">
        {activeTab === "Overview" && (
          <div className="tp-tab-pane" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>

            {/* Card 1: Salary */}
            <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '220px' }}>
              <div className="tp-info-icon" style={{ marginBottom: '12px', background: '#fef3c7', color: '#f59e0b', borderRadius: '50%' }}>
                <FiStar size={20} />
              </div>
              <div className="tp-info-label" style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>Expected Salary</div>
              <div className="tp-info-value" style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                {professionalData?.expectedSalaryMin && professionalData?.expectedSalaryMax
                  ? (() => {
                      const currency = professionalData?.salaryCurrency || "USD";
                      let symbol = "$";
                      if (currency === "EUR") symbol = "€";
                      else if (currency === "INR") symbol = "₹";
                      
                      const formatVal = (val) => {
                        const numericVal = Number(val);
                        if (isNaN(numericVal)) return val;
                        if (numericVal >= 1000) {
                          const kVal = numericVal / 1000;
                          return `${Number(kVal.toFixed(1)).toLocaleString()}k`;
                        }
                        return numericVal.toLocaleString();
                      };
                      return `${symbol}${formatVal(professionalData.expectedSalaryMin)} – ${symbol}${formatVal(professionalData.expectedSalaryMax)} / yr`;
                    })()
                  : "Not Mentioned"}
              </div>
            </div>

            {/* Card 2: Work Model */}
            <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '220px' }}>
              <div className="tp-info-icon" style={{ marginBottom: '12px', background: '#eff6ff', color: '#3b82f6', borderRadius: '50%' }}>
                <FiMapPin size={20} />
              </div>
              <div className="tp-info-label" style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>Work Model</div>
              <div className="tp-info-value" style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{professionalData?.workPreference || "Not Mentioned"}</div>
            </div>

            {/* Card 3: Skills */}
            <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', minHeight: '220px' }}>
              <div className="tp-section-heading" style={{ justifyContent: 'center', marginBottom: '12px' }}>Expertise</div>
              <div className="tp-tag-row hide-scrollbar" style={{ justifyContent: 'center', marginTop: 'auto', marginBottom: 'auto', maxHeight: '130px', overflowY: 'auto', paddingRight: '4px' }}>
                {profileData.skills.map((skill, idx) => {
                  const colors = ["orange", "pink", "purple", "mint", "green"];
                  const colorClass = colors[idx % colors.length];
                  return (
                    <span key={idx} className={`job-chip ${colorClass}`}>
                      {skill}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Card 4: Contact Locked */}
            <div className="premium-card tp-contact-locked" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '220px' }}>
              <div className="tp-section-heading" style={{ justifyContent: 'center', marginBottom: '12px' }}>
                <FiLock size={12} /> Contact Details
              </div>
              <div className="tp-lock-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="tp-lock-msg" style={{ marginBottom: '16px' }}>Unlock to view direct contact info</div>
                <button className="tp-unlock-btn" style={{ padding: '8px 16px', borderRadius: '8px' }}>
                  <FaGem size={12} /> Unlock Profile
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ── EXPERIENCE TAB ── */}
        {activeTab === "Experience" && (
          <div className="tp-tab-pane">
            <div className="premium-card">
              <div className="tp-section-heading"><FiTrendingUp size={14} /> Work Experience</div>
              <div className="tp-exp-list hide-scrollbar" style={{ maxHeight: '450px', overflowY: 'auto', paddingRight: '8px' }}>
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
            </div>
          </div>
        )}

        {/* ── PROJECTS TAB ── */}
        {activeTab === "Projects" && (
          <div className="tp-tab-pane">
            <div className="premium-card">
              <div className="tp-section-heading"><FiFileText size={14} /> Project Portfolio</div>
              <div className="tp-exp-list hide-scrollbar" style={{ maxHeight: '450px', overflowY: 'auto', paddingRight: '8px' }}>
                {projectsData.length > 0 ? (
                  projectsData.map((data, idx) => (
                    <div key={idx} className="tp-exp-item">
                      <div className="tp-exp-icon"><FiExternalLink size={13} /></div>
                      <div className="tp-exp-body">
                        <div className="tp-exp-title-row">
                          <span className="tp-exp-role">{data.projectName}</span>
                          <span className="tp-exp-badge secondary">{data.role}</span>
                        </div>
                        <div className="tp-exp-period">
                          <FiCalendar size={11} /> {data.startDate} — {data.endDate}
                        </div>
                        <div className="tp-tag-row" style={{ marginTop: '8px', marginBottom: '12px' }}>
                          {data.skills.map((skill, i) => {
                            const colors = ["orange", "pink", "purple", "mint", "green"];
                            const colorClass = colors[i % colors.length];
                            return (
                              <span key={i} className={`job-chip ${colorClass}`}>
                                {skill}
                              </span>
                            );
                          })}
                        </div>
                        <p className="tp-exp-desc">{data.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <NoData text="No projects listed" />
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── EDUCATION TAB ── */}
        {activeTab === "Education" && (
          <div className="tp-tab-pane">
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
          </div>
        )}

      </div>

      {/* ── NO JOB FOUND MODAL ── */}
      {showNoJobModal && (
        <div
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(15,23,42,0.60)',
            backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 10000, padding: '20px',
            animation: 'fadeIn 0.25s ease-out'
          }}
          onClick={() => setShowNoJobModal(false)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '20px',
              width: '100%', maxWidth: '440px',
              boxShadow: '0 20px 40px -10px rgba(91,91,214,0.18)',
              overflow: 'hidden',
              animation: 'slideUp 0.35s cubic-bezier(0.165,0.84,0.44,1)'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ padding: '24px 28px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: 'rgba(245,158,11,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#f59e0b', flexShrink: 0
                }}>
                  <FiAlertCircle size={20} />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>No Matching Job Found</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Role: <strong>{profileData.role}</strong></div>
                </div>
              </div>
              <button
                onClick={() => setShowNoJobModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4 }}
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '18px 28px 28px' }}>
              <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, margin: '0 0 20px' }}>
                There are no active job listings matching the role <strong>&ldquo;{profileData.role}&rdquo;</strong>.
                Would you like to create one so this candidate can be properly shortlisted?
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => setShowNoJobModal(false)}
                  style={{
                    flex: 1, padding: '9px 16px', fontSize: 13, fontWeight: 600,
                    background: '#f8fafc', color: '#475569',
                    border: '1px solid #e2e8f0', borderRadius: 10, cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowNoJobModal(false);
                    const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
                    navigate(`${basePath}/user-post-new-positions`);
                  }}
                  style={{
                    flex: 1, padding: '9px 16px', fontSize: 13, fontWeight: 600,
                    background: 'linear-gradient(135deg,#5B5BD6 0%,#7C3AED 100%)',
                    color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(91,91,214,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                  }}
                >
                  <FiPlusCircle size={14} /> Create Job
                </button>
              </div>
            </div>
          </div>
        </div>
      )}



    </div>
  );
};

export default TalentProfile;