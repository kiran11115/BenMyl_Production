import React, { useEffect, useMemo, useState } from "react";
import { FiMapPin, FiBriefcase, FiDownload, FiShare2, FiMail, FiPhone, FiLinkedin, FiFileText, FiArrowLeft, FiEdit2, FiSave, FiX, FiPlus, FiArrowRight, FiCalendar, FiUser, FiCheckCircle, FiExternalLink, FiLoader, FiAward, FiBookOpen, FiStar, FiTrendingUp, FiLock, FiClock, FiChevronDown, FiCheck } from "react-icons/fi";
import { BsDribbble, BsBuilding } from "react-icons/bs";
import { FaGem } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import "./../TalentPool/Talent Profile/TalentProfile.css";
import "../UserJobs/Jobs.css";
import {
  useAddEmployeeProfessionalDetailsMutation,
  useGetEmployeeProfessionalDetailsQuery,
  useGetRecommendJobsListMutation,
  useLazyGetEmployeeTalentProfileQuery,
} from "../../State-Management/Api/TalentPoolApiSlice";
import { useGetFindJobsMutation } from "../../State-Management/Api/ProjectApiSlice";
import { calculateTotalExperience } from "../../Utils/experienceUtils";
import NoData from "./NoData";
import JobModal from "../UserJobs/JobModal";
import EditTalentProfile from "./EditTalentProfile";
import StatsGrid from "../Dashboard/StatsGrid";
import { Users, Briefcase } from "lucide-react";
import { useGetQueueManagementMutation, useGetMyBenchMutation } from "../../State-Management/Api/UploadResumeApiSlice";

import RecommendedJobs from "./RecommendedJobs";

const formatDateToDisplay = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (isNaN(date)) return value;

  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();

  return `${day}-${month}-${year}`; // 16-Feb-2026
};

// ===========================
// Main UploadTalentProfile
// ===========================
const UploadTalentProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showContent, setShowContent] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [expExpanded, setExpExpanded] = useState(false);
  const [portfolioExpanded, setPortfolioExpanded] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [languageInput, setLanguageInput] = useState("");
  const [activeTab, setActiveTab] = useState("Recommended Jobs");
  const tabs = ["Recommended Jobs", "Overview", "Experience", "Projects", "Education"];
  const [addEmployeeProfessionalDetails, { isLoading: isSaving }] = useAddEmployeeProfessionalDetailsMutation();

  const [getQueueManagement] = useGetQueueManagementMutation();
  const [getMyBench] = useGetMyBenchMutation();
  const [pendingReviewCount, setPendingReviewCount] = useState(0);
  const [totalTalentCount, setTotalTalentCount] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const companyId = localStorage.getItem("companyId");
        if (!companyId) return;

        const queueRes = await getQueueManagement(companyId).unwrap();
        const pendingCount = Array.isArray(queueRes) ? queueRes.filter(item => item.status === "Pending For Review").length : 0;
        setPendingReviewCount(pendingCount);

        const benchRes = await getMyBench({ companyid: companyId, pageNumber: 1, pageSize: 1000, filters: [] }).unwrap();
        setTotalTalentCount(Array.isArray(benchRes) ? benchRes.length : 0);
      } catch (err) {
        console.error("Failed to fetch talent counts", err);
      }
    };
    fetchCounts();
  }, [getQueueManagement, getMyBench]);

  const [editFormData, setEditFormData] = useState({
    expectedSalaryMin: "",
    expectedSalaryMax: "",
    salaryCurrency: "USD",
    noticePeriod: "",
    workPreference: "",
    languages: [],
    workAuthorization: [],
    preferredEmployment: [],
    skills: [],
  });

  const employeeId = location.state?.employeeId;
  const [getEmployeeProfile, { data: apiData, isLoading, isError }] = useLazyGetEmployeeTalentProfileQuery();
  const { data: professionalData, isLoading: isProfessionalLoading } = useGetEmployeeProfessionalDetailsQuery(employeeId, { refetchOnMountOrArgChange: true });

  useEffect(() => {
    if (employeeId) getEmployeeProfile(employeeId);
  }, [employeeId, getEmployeeProfile]);

  useEffect(() => {
    if (professionalData) {
      setEditFormData({
        expectedSalaryMin: professionalData.expectedSalaryMin || "",
        expectedSalaryMax: professionalData.expectedSalaryMax || "",
        salaryCurrency: professionalData.salaryCurrency || "USD",
        workPreference: professionalData.workPreference || "",
        languages: professionalData.languages ? professionalData.languages.split(",") : [],
        workAuthorization: [
          professionalData.isUSCitizen && "US Citizen",
          professionalData.isGreenCard && "Green Card",
          professionalData.isH1B && "H1B",
          professionalData.isEAD && "EAD",
        ].filter(Boolean),
        preferredEmployment: [
          professionalData.isCorpCorp && "Corp-Corp",
          professionalData.isW2Permanent && "W2 Permanent",
          professionalData.isW2Contract && "W2 Contract",
          professionalData.is1099Contract && "1099 Contract",
          professionalData.isContractToHire && "Contract to Hire",
        ].filter(Boolean),
        skills: [],
      });
    }
  }, [professionalData]);

  useEffect(() => {
    let timer;
    if (apiData && !isLoading) {
      timer = setTimeout(() => setShowContent(true), 100);
    } else if (isLoading) {
      setShowContent(false);
    }
    return () => clearTimeout(timer);
  }, [apiData, isLoading]);

  const profileData = useMemo(() => {
    if (!apiData) return null;
    const payloadCandidate = location.state?.candidate;

    return {
      name: `${apiData?.firstName || "N/A"} ${apiData?.lastName || ""}`.trim(),
      role: apiData?.title || "N/A",
      location: `${apiData?.city || "N/A"}, ${apiData?.state || ""}`.replace(/, $/, ""),
      experience: calculateTotalExperience(apiData?.workexperiences),
      status: payloadCandidate?.status || apiData?.status || "N/A",
      uploadedByName: payloadCandidate?.uploadedByName || "N/A",
      summary: apiData?.bio || "N/A",
      email: apiData?.emailAddress || "N/A",
      phoneNo: apiData?.phoneNo || "N/A",
      isshortlisted: apiData?.isshortlisted,
      skills: apiData?.skills ? apiData?.skills.split(",") : [],
      workExperience: apiData?.workexperiences?.map(w => ({
        role: w.position || "N/A",
        company: w.companyName || "N/A",
        period: w.startDate ? `${w.startDate.slice(0, 4)} - ${w.endDate ? w.endDate.slice(0, 4) : 'Present'}` : "N/A",
        location: w.city || apiData?.city || "N/A",
        desc: w.description || "N/A",
      })) || [],
      portfolio: apiData?.employeeprojects?.map(p => ({
        title: p.projectName || "N/A",
        role: p.role || "N/A",
        description: p.description || "N/A",
        period: p.startDate ? `${formatDateToDisplay(p.startDate)} - ${p.endDate ? formatDateToDisplay(p.endDate) : "N/A"}` : "N/A",
        tags: p.skills ? p.skills.split(",") : [],
      })) || [],
      education: apiData.employee_Heighers?.map(edu => ({
        degree: edu.highestQualification || "N/A",
        school: edu.university || "N/A",
        field: edu.fieldofstudy || "N/A",
        year: edu.startDate ? `${formatDateToDisplay(edu.startDate)} - ${edu.endDate ? formatDateToDisplay(edu.endDate) : "N/A"}` : "N/A",
      })) || [],
      profileImage: apiData.profileImage
    };
  }, [apiData]);

  const initials = useMemo(() => {
    if (!apiData) return "N/A";
    const first = apiData.firstName?.trim().charAt(0) || "";
    const last = apiData.lastName?.trim().charAt(0) || "";
    return (first + last).toUpperCase() || "N/A";
  }, [apiData]);

  const handleEditClick = () => {
    const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
    navigate(`${basePath}/edit-talent-profile`, {
      state: { initialData: apiData }
    });
  };
  const handleCloseModal = () => setShowEditModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleWorkAuthChange = (authType) => {
    setEditFormData(prev => {
      const current = [...prev.workAuthorization];
      const index = current.indexOf(authType);
      index > -1 ? current.splice(index, 1) : current.push(authType);
      return { ...prev, workAuthorization: current };
    });
  };

  const handleEmploymentChange = (employmentType) => {
    setEditFormData(prev => {
      const current = [...prev.preferredEmployment];
      const index = current.indexOf(employmentType);
      index > -1 ? current.splice(index, 1) : current.push(employmentType);
      return { ...prev, preferredEmployment: current };
    });
  };

  const handleAddLanguage = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newLang = languageInput.replace(",", "").trim();
      if (!newLang || editFormData.languages.includes(newLang)) return;
      setEditFormData(prev => ({ ...prev, languages: [...prev.languages, newLang] }));
      setLanguageInput("");
    }
  };

  const removeLanguage = (lang) => {
    setEditFormData(prev => ({ ...prev, languages: prev.languages.filter(l => l !== lang) }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        employeeId,
        expectedSalaryMin: parseInt(editFormData.expectedSalaryMin),
        expectedSalaryMax: parseInt(editFormData.expectedSalaryMax),
        salaryCurrency: editFormData.salaryCurrency,
        workPreference: editFormData.workPreference,
        languages: editFormData.languages.join(","),
        isUSCitizen: editFormData.workAuthorization.includes("US Citizen"),
        isGreenCard: editFormData.workAuthorization.includes("Green Card"),
        isH1B: editFormData.workAuthorization.includes("H1B"),
        isEAD: editFormData.workAuthorization.includes("EAD"),
        isCorpCorp: editFormData.preferredEmployment.includes("Corp-Corp"),
        isW2Permanent: editFormData.preferredEmployment.includes("W2 Permanent"),
        isW2Contract: editFormData.preferredEmployment.includes("W2 Contract"),
        is1099Contract: editFormData.preferredEmployment.includes("1099 Contract"),
        isContractToHire: editFormData.preferredEmployment.includes("Contract to Hire"),
      };
      await addEmployeeProfessionalDetails(payload).unwrap();
      setShowEditModal(false);
    } catch (err) {
      console.error("Failed to save professional details", err);
    }
  };

  if (isLoading || !showContent) {
    return (
      <div className="posted-jobs-loader" style={{ minHeight: '60vh' }}>
        <div className="jobs-loader-ring">
          <div className="jobs-loader-icon">
            <FiUser size={18} />
          </div>
        </div>
        <p className="jobs-loader-text">Loading profile...</p>
        <span className="jobs-loader-sub">Fetching candidate details</span>
      </div>
    );
  }

  return (
    <div className="ai-dashboard-wrapper">
      {/* ── HERO HEADER CARD (COVER) ── */}
      <div className="hero-section-wrapper mb-4">
        <div className="hero-card ">
          <div className="hero-concentric-lines"></div>
          <div className="hero-ripple-pattern"></div>
          <div className="hero-circular-highlights"></div>
        <button className="routine-btn mb-5" onClick={() => {
          const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
          const targetPath = window.location.pathname.toLowerCase().startsWith('/admin') ? `${basePath}/admin-upload-talent` : `${basePath}/user-upload-talent`;
          navigate(targetPath);
        }} style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(4px)' }}>
          <FiArrowLeft style={{ marginRight: '6px' }} /> Back
        </button>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            className="routine-btn mb-5"
            style={{ background: '#fff', color: '#1e3a8a', border: 'none', fontWeight: 700 }}
            onClick={() => {
              const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
              const targetPath = window.location.pathname.toLowerCase().startsWith('/admin') ? `${basePath}/admin-jobs` : `${basePath}/user-jobs`;
              navigate(targetPath, { state: { role: profileData?.role } });
            }}
          >
            <FiBriefcase size={14} style={{ marginRight: '6px' }} /> Explore Jobs
          </button>
          <button
            className="routine-btn mb-5"
            style={{ background: '#5B5BD6', color: '#fff', border: 'none', fontWeight: 700 }}
            onClick={handleEditClick}
          >
            <FiEdit2 size={14} style={{ marginRight: '6px' }} /> Edit Profile
          </button>
        </div>
                <div className="hero-illustration">
            <div className="hero-particles">
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
            </div>
            {/* <img src="/Images/Dashboard.png" alt="Dashboard Illustration" className="hero-svg-image" /> */}
          </div>
        </div>
      </div>

      {/* ── MAIN PROFILE OVERLAP CARD ── */}
      <div className="premium-card tp-main-profile-card">
        <div className="d-flex align-items-start gap-4">
          <div className="tp-avatar-wrapper mb-0 mt-1">
            {profileData?.profileImage ? (
              <img src={profileData.profileImage} alt={profileData?.name} className="tp-avatar-large" />
            ) : (
              <div className="tp-avatar-large tp-avatar-initials-large">{initials}</div>
            )}
          </div>

          <div style={{ flex: 1 }}>
            <h1 className="tp-profile-name">
              {profileData?.name}
              <FiCheckCircle size={16} className="tp-verified-icon ms-2" />
            </h1>
            <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
              <p className="tp-profile-role mb-0" style={{ color: '#64748b' }}>
                {profileData?.role} &nbsp;•&nbsp; {profileData?.location} &nbsp;•&nbsp; <FiMail size={12} className="ms-1 me-1" /> {profileData?.email} &nbsp;•&nbsp; <FiPhone size={12} className="ms-1 me-1" /> {profileData?.phoneNo}
              </p>
              <div className="tp-meta-pills-row mb-0">
                <span className="job-chip orange py-1 px-2 gap-2"><FiBriefcase size={12} /> {profileData?.experience}</span>
                <span className="job-chip purple py-1 px-2 gap-2"><FiAward size={12} /> {profileData?.status}</span>
                {profileData?.uploadedByName !== "N/A" && (
                  <span className="job-chip green py-1 px-2 gap-2" style={{ height: 'auto', lineHeight: 1 }}><FiUser size={12} /> By - {profileData?.uploadedByName}</span>
                )}
              </div>
            </div>
            <p className="tp-exp-desc mb-4" style={{ color: '#64748b', maxWidth: '800px', lineHeight: '1.6' }}>
              {profileData?.summary}
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
        {/* ── RECOMMENDED JOBS TAB ── */}
        {activeTab === "Recommended Jobs" && (
          <div className="tp-tab-pane">
            <div className="premium-card">
              <div className="tp-section-heading mb-3 d-flex align-items-center gap-2">
                <span><FiStar size={13} /> Recommended Jobs</span>
                <span className="text-muted" style={{ fontSize: '12px', fontWeight: 'normal', textTransform: 'none', letterSpacing: 'normal' }}>
                  (Click on card to apply the job)
                </span>
              </div>
              <RecommendedJobs role={profileData?.role} skills={profileData?.skills?.join(",")} employeeId={employeeId} isShortlisted={profileData?.isshortlisted} />
            </div>
          </div>
        )}

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "Overview" && (
          <div className="tp-tab-pane">
            <div className="row g-4">

              {/* DETAILS SECTION */}
              <div className="col-lg-8">
                <div className="premium-card h-100">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h6 className="tp-section-heading mb-0 d-flex align-items-center gap-2 text-uppercase" style={{ letterSpacing: '0.5px' }}>
                      <FiUser size={16} /> Professional Details
                    </h6>
                    <button
                      className="btn-secondary d-flex align-items-center gap-2"
                      style={{ borderRadius: '8px', fontWeight: '500' }}
                      onClick={() => setShowEditModal(true)}
                    >
                      <FiEdit2 size={12} /> Edit Details
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>

                    {/* Expected Salary */}
                    <div className="job-card d-flex flex-column p-3" style={{ minHeight: 'auto', borderRadius: "12px" }}>
                      <div className="d-flex align-items-center gap-2 text-muted fw-bold small text-uppercase" style={{ letterSpacing: '0.5px' }}>
                        <span className="d-flex align-items-center justify-content-center bg-warning bg-opacity-10 text-warning p-1 rounded-2"><FiStar size={14} /></span> Expected Salary
                      </div>
                      <div className="fw-bold text-dark mt-auto" style={{ fontSize: '14px' }}>
                        {professionalData?.expectedSalaryMin && professionalData?.expectedSalaryMax
                          ? `$${professionalData.expectedSalaryMin.toLocaleString()} - $${professionalData.expectedSalaryMax.toLocaleString()}/yr`
                          : "Not specified"}
                      </div>
                    </div>


                    {/* Work Preference */}
                    <div className="job-card d-flex flex-column p-3" style={{ minHeight: 'auto', borderRadius: "12px" }}>
                      <div className="d-flex align-items-center gap-2 text-muted fw-bold small text-uppercase" style={{ letterSpacing: '0.5px' }}>
                        <span className="d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary p-1 rounded-2"><FiBriefcase size={14} /></span> Work Preference
                      </div>
                      <div className="fw-bold text-dark mt-auto" style={{ fontSize: '14px' }}>
                        {professionalData?.workPreference || "Not specified"}
                      </div>
                    </div>

                    {/* Languages */}
                    <div className="job-card d-flex flex-column p-3" style={{ minHeight: 'auto', borderRadius: "12px" }}>
                      <div className="d-flex align-items-center gap-2 text-muted fw-bold small text-uppercase" style={{ letterSpacing: '0.5px' }}>
                        <span className="d-flex align-items-center justify-content-center bg-danger bg-opacity-10 text-danger p-1 rounded-2"><FiBookOpen size={14} /></span> Languages
                      </div>
                      <div className="d-flex flex-wrap gap-2 mt-auto">
                        {editFormData.languages?.length > 0 ? editFormData.languages.map((lang, index) => (
                          <span key={`lang-${index}`} className="job-chip orange">{lang}</span>
                        )) : <span className="text-muted" style={{ fontSize: '14px', fontWeight: '500' }}>Not specified</span>}
                      </div>
                    </div>

                    {/* Work Authorization & Employment Type */}
                    <div className="job-card d-flex flex-column p-3" style={{ minHeight: 'auto', borderRadius: "12px" }}>
                      <div className="d-flex align-items-center gap-2 text-muted fw-bold small text-uppercase" style={{ letterSpacing: '0.5px' }}>
                        <span className="d-flex align-items-center justify-content-center bg-info bg-opacity-10 text-info p-1 rounded-2"><FiMapPin size={14} /></span> Work Auth & Type
                      </div>
                      <div className="d-flex flex-wrap gap-2 mt-auto">
                        {[professionalData?.isUSCitizen && "US Citizen", professionalData?.isGreenCard && "Green Card", professionalData?.isH1B && "H1B", professionalData?.isEAD && "EAD"].filter(Boolean).map((auth, index) => (
                          <span key={`auth-${index}`} className="job-chip mint">{auth}</span>
                        ))}
                        {[professionalData?.isCorpCorp && "Corp-Corp", professionalData?.isW2Permanent && "W2 Permanent", professionalData?.isW2Contract && "W2 Contract", professionalData?.is1099Contract && "1099 Contract", professionalData?.isContractToHire && "Contract to Hire"].filter(Boolean).map((emp, index) => (
                          <span key={`emp-${index}`} className="job-chip purple">{emp}</span>
                        ))}
                        {(!professionalData?.isUSCitizen && !professionalData?.isGreenCard && !professionalData?.isH1B && !professionalData?.isEAD && !professionalData?.isCorpCorp && !professionalData?.isW2Permanent && !professionalData?.isW2Contract && !professionalData?.is1099Contract && !professionalData?.isContractToHire) && (
                          <span className="text-muted" style={{ fontSize: '14px', fontWeight: '500' }}>Not specified</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SKILLS SECTION */}
              <div className="col-lg-4">
                <div className="premium-card h-100">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h6 className="tp-section-heading mb-0 d-flex align-items-center gap-2">
                      <FiStar size={16} /> Technical Expertise
                    </h6>
                  </div>

                  <div className="d-flex flex-wrap gap-2 hide-scrollbar" style={{ maxHeight: '100px', overflowY: 'auto', paddingRight: '4px' }}>
                    {profileData?.skills?.length > 0 ? profileData.skills.map((skill, index) => {
                      const colors = ["mint", "green", "pink", "purple", "orange"];
                      return <span key={index} className={`job-chip ${colors[index % colors.length]}`}>{skill.trim()}</span>;
                    }) : <span className="text-muted" style={{ fontSize: '14px' }}>Not specified</span>}
                  </div>
                </div>
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
                {profileData?.workExperience?.length > 0 ? (
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
                  <NoData text="No work experience added yet" />
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
                {profileData?.portfolio?.length > 0 ? (
                  profileData.portfolio.map((item, idx) => (
                    <div key={idx} className="tp-exp-item">
                      <div className="tp-exp-icon"><FiExternalLink size={13} /></div>
                      <div className="tp-exp-body">
                        <div className="tp-exp-title-row">
                          <span className="tp-exp-role">{item.title}</span>
                          <span className="tp-exp-badge secondary">{item.role}</span>
                        </div>
                        <div className="tp-exp-period">
                          <FiCalendar size={11} /> {item.period}
                        </div>
                        <div className="tp-tag-row" style={{ marginTop: '8px', marginBottom: '12px' }}>
                          {item.tags?.map((tag, i) => {
                            const colors = ["orange", "pink", "purple", "mint", "green"];
                            const colorClass = colors[i % colors.length];
                            return (
                              <span key={i} className={`job-chip ${colorClass}`}>
                                {tag}
                              </span>
                            );
                          })}
                        </div>
                        <p className="tp-exp-desc">{item.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <NoData text="No projects added yet" />
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
              {profileData?.education?.length > 0 ? profileData.education.map((edu, index) => (
                <div key={index} className="tp-info-row" style={{ marginBottom: 12 }}>
                  <div className="tp-info-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}><FiBookOpen size={13} /></div>
                  <div>
                    <div className="tp-info-value">{edu.degree}{edu.field && ` in ${edu.field}`}</div>
                    <div className="tp-info-label">{edu.school}</div>
                    <div className="tp-info-label" style={{ marginTop: 2 }}>{edu.year}</div>
                  </div>
                </div>
              )) : <NoData text="No education details" />}
            </div>
          </div>
        )}

      </div>

      {showEditModal && (
        <div
          className="ut-modal-overlay"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.4)",
            backdropFilter: "blur(4px)",
            zIndex: 10000,
            animation: "fadeIn 0.3s ease-out"
          }}
          onClick={handleCloseModal}
        >
          <div
            className="ut-modal-content"
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: "100%",
              maxWidth: "550px",
              backgroundColor: "#ffffff",
              boxShadow: "-10px 0 40px rgba(0, 0, 0, 0.1)",
              display: "flex",
              flexDirection: "column",
              animation: "slideInRightDrawer 0.4s cubic-bezier(0.165, 0.84, 0.44, 1) forwards",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ padding: "24px 32px", borderBottom: "1px solid #f1f5f9", background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(91,91,214,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#5B5BD6" }}>
                  <FiEdit2 size={20} />
                </div>
                <div>
                  <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Edit Details</h2>
                  <p style={{ fontSize: "12px", color: "#64748b", margin: "4px 0 0 0" }}>Update professional information</p>
                </div>
              </div>
              <button onClick={handleCloseModal} style={{ width: '36px', height: '36px', borderRadius: '50%', border: 'none', backgroundColor: '#f1f5f9', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
                <FiX size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "28px 32px", overflowY: "auto", flex: 1, backgroundColor: "#ffffff" }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                {/* Salary */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: '600', color: '#1e293b' }}>Expected Salary Range</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '14px', zIndex: 1 }}>$</span>
                      <input type="number" name="expectedSalaryMin" className="auth-input" style={{ paddingLeft: '28px' }} placeholder="Min" value={editFormData.expectedSalaryMin} onChange={handleInputChange} />
                    </div>
                    <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '500' }}>to</span>
                    <div style={{ flex: 1, position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '14px', zIndex: 1 }}>$</span>
                      <input type="number" name="expectedSalaryMax" className="auth-input" style={{ paddingLeft: '28px' }} placeholder="Max" value={editFormData.expectedSalaryMax} onChange={handleInputChange} />
                    </div>
                    <select className="auth-input" name="salaryCurrency" style={{ width: '90px', cursor: 'pointer' }} value={editFormData.salaryCurrency} onChange={handleInputChange}>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="INR">INR</option>
                    </select>
                  </div>
                </div>
                <div className="d-flex justify-content-between gap-3">
                  {/* Work Preference */}
                  <div className="w-100">
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: '600', color: '#1e293b' }}>Work Preference</label>
                    <select name="workPreference" className="auth-input w-100" style={{ cursor: 'pointer' }} value={editFormData.workPreference} onChange={handleInputChange}>
                      <option value="">Select preference</option>
                      <option value="Full Time">Full Time</option>
                      <option value="Part Time">Part Time</option>
                      <option value="Contract">Contract</option>
                    </select>
                  </div>

                  {/* Languages */}
                  <div className="w-100">
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: '600', color: '#1e293b' }}>Languages</label>
                    <input className="auth-input w-100" placeholder="Add language (press Enter)..." value={languageInput} onChange={(e) => setLanguageInput(e.target.value)} onKeyDown={handleAddLanguage} />
                    <div className="d-flex flex-wrap gap-2 mt-3">
                      {editFormData.languages?.map(lang => (
                        <span key={lang} className="job-chip pink" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          {lang}
                          <FiX size={12} style={{ cursor: 'pointer', opacity: 0.7 }} onClick={() => removeLanguage(lang)} />
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Work Auth */}
                <div>
                  <label style={{ display: 'block', marginBottom: '10px', fontSize: '12px', fontWeight: '600', color: '#1e293b' }}>Work Authorization</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                    {["US Citizen", "Green Card", "H1B", "EAD"].map(opt => {
                      const isChecked = editFormData.workAuthorization.includes(opt);
                      return (
                        <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '10px 14px', background: isChecked ? '#f5f3ff' : '#ffffff', border: `1px solid ${isChecked ? '#7c3aed' : '#e2e8f0'}`, borderRadius: '12px', transition: 'all 0.2s', boxShadow: isChecked ? '0 2px 8px rgba(124, 58, 237, 0.1)' : 'none' }}>
                          <div style={{ width: '18px', height: '18px', borderRadius: '4px', border: `2px solid ${isChecked ? '#7c3aed' : '#cbd5e1'}`, background: isChecked ? '#7c3aed' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                            {isChecked && <FiCheck size={12} color="#fff" strokeWidth={3} />}
                          </div>
                          <input type="checkbox" style={{ display: 'none' }} checked={isChecked} onChange={() => handleWorkAuthChange(opt)} />
                          <span style={{ fontSize: '11px', color: isChecked ? '#4c1d95' : '#475569', fontWeight: '500' }}>{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Employment Type */}
                <div>
                  <label style={{ display: 'block', marginBottom: '10px', fontSize: '12px', fontWeight: '600', color: '#1e293b' }}>Employment Type</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                    {["Corp-Corp", "W2 Permanent", "W2 Contract", "1099 Contract"].map(opt => {
                      const isChecked = editFormData.preferredEmployment.includes(opt);
                      return (
                        <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '10px 14px', background: isChecked ? '#f5f3ff' : '#ffffff', border: `1px solid ${isChecked ? '#7c3aed' : '#e2e8f0'}`, borderRadius: '12px', transition: 'all 0.2s', boxShadow: isChecked ? '0 2px 8px rgba(124, 58, 237, 0.1)' : 'none' }}>
                          <div style={{ width: '18px', height: '18px', borderRadius: '4px', border: `2px solid ${isChecked ? '#7c3aed' : '#cbd5e1'}`, background: isChecked ? '#7c3aed' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                            {isChecked && <FiCheck size={12} color="#fff" strokeWidth={3} />}
                          </div>
                          <input type="checkbox" style={{ display: 'none' }} checked={isChecked} onChange={() => handleEmploymentChange(opt)} />
                          <span style={{ fontSize: '11px', color: isChecked ? '#4c1d95' : '#475569', fontWeight: '500' }}>{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: "20px 32px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end", gap: "12px", backgroundColor: "#ffffff" }}>
              <button
                onClick={handleCloseModal}
                style={{ padding: "10px 24px", backgroundColor: "#f8fafc", color: "#475569", border: "1px solid #e2e8f0", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s" }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                style={{ padding: "10px 28px", background: "linear-gradient(135deg, #5B5BD6 0%, #7C3AED 100%)", color: "#ffffff", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: isSaving ? "not-allowed" : "pointer", boxShadow: "0 4px 12px rgba(91, 91, 214, 0.25)", transition: "all 0.2s", display: "flex", alignItems: "center", opacity: isSaving ? 0.8 : 1 }}
              >
                {isSaving ? (
                  <><FiLoader style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }} size={16} /> Saving...</>
                ) : (
                  <><FiSave style={{ marginRight: '8px' }} size={16} /> Save Changes</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadTalentProfile;
