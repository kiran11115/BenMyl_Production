import React, { useEffect, useMemo, useState } from "react";
import { FiMapPin, FiBriefcase, FiDownload, FiShare2, FiMail, FiPhone, FiLinkedin, FiFileText, FiArrowLeft, FiEdit2, FiSave, FiX, FiPlus, FiArrowRight, FiCalendar, FiUser, FiCheckCircle, FiExternalLink, FiLoader, FiAward, FiBookOpen, FiStar, FiTrendingUp, FiLock, FiClock, FiChevronDown } from "react-icons/fi";
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
      isshortlisted : apiData?.isshortlisted,
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
      <div className="hero-card mb-4">
        <div className="hero-left">
          <div className="hero-pill">✦ Talent Profile</div>
          <h1 className="job-posting-title text-white">{profileData?.name}</h1>
          <div className="job-posting-header-info">
            <p className="job-posting-subtitle">
              {profileData?.role} &nbsp;•&nbsp; {profileData?.location}
            </p>
          </div>
        </div>
        <div className="hero-buttons">
          <button className="routine-btn" onClick={() => {
            const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
            const targetPath = window.location.pathname.toLowerCase().startsWith('/admin') ? `${basePath}/admin-upload-talent` : `${basePath}/user-upload-talent`;
            navigate(targetPath);
          }}>
            <FiArrowLeft style={{ marginRight: '6px' }} /> Back
          </button>
        </div>
      </div>

      <div className="premium-card tp-identity-strip mb-4">
        <div className="tp-avatar-col">
          {profileData?.profileImage ? (
            <img src={profileData.profileImage} alt={profileData?.name} className="tp-avatar-sm" />
          ) : (
            <div className="tp-avatar-sm tp-avatar-initials">{initials}</div>
          )}
        </div>
        <div className="tp-identity-info">
          <div className="tp-identity-name">
            {profileData?.name}
            <FiCheckCircle size={14} style={{ color: '#10b981', marginLeft: 8 }} />
          </div>
          <div className="tp-identity-role">{profileData?.role}</div>
          <div className="tp-meta-pills">
            <span className="tp-meta-pill"><FiMapPin size={11} /> {profileData?.location}</span>
            <span className="tp-meta-pill"><FiBriefcase size={11} /> {profileData?.experience}</span>
            <span className="tp-meta-pill"><FiAward size={11} /> {profileData?.status}</span>
            {profileData?.uploadedByName !== "N/A" && (
              <span className="tp-meta-pill"><FiUser size={11} /> By: {profileData?.uploadedByName}</span>
            )}
          </div>
        </div>
        <div className="tp-identity-actions" style={{ flexDirection: 'row', alignItems: 'center' }}>
          <button 
            className="tp-util-btn" 
            style={{ background: '#eff6ff', color: '#1e3a8a', borderColor: '#dbeafe' }}
            onClick={() => {
              const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
              const targetPath = window.location.pathname.toLowerCase().startsWith('/admin') ? `${basePath}/admin-jobs` : `${basePath}/user-jobs`;
              navigate(targetPath, { state: { role: profileData?.role } });
            }}
          >
            <FiBriefcase size={13} style={{ marginRight: '4px' }} /> Explore Jobs
          </button>
          <button 
            className="tp-util-btn"
            style={{ background: '#5B5BD6', color: '#fff', borderColor: '#5B5BD6' }}
            onClick={handleEditClick}
          >
            <FiEdit2 size={13} style={{ marginRight: '4px' }} /> Edit Profile
          </button>
        </div>
      </div>

      <div className="tp-content-grid">
        <div className="tp-col-main">
          <div className="premium-card mb-3">
            <div className="tp-section-heading"><FiUser size={13} /> Professional Summary</div>
            <p className="tp-summary-text">{profileData?.summary}</p>
          </div>

          <div className="premium-card mb-3">
            <div className="tp-section-heading-row">
              <span className="tp-section-heading"><FiTrendingUp size={13} /> Work Experience</span>
              <button className="tp-toggle-btn" onClick={() => setExpExpanded(!expExpanded)}>
                {expExpanded ? "Show Less" : "View All"} <FiChevronDown size={12} style={{ transform: expExpanded ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
              </button>
            </div>
            {expExpanded ? (
              <div className="tp-exp-list">
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
            ) : (
              profileData?.workExperience?.length > 0 ? (
                <div className="tp-exp-preview">
                  <span className="tp-exp-role">{profileData.workExperience[0].role}</span>
                  <span className="tp-exp-badge">{profileData.workExperience[0].company}</span>
                  <p className="tp-exp-desc" style={{ marginTop: 6 }}>
                    {profileData.workExperience[0].desc.slice(0, 120)}…
                  </p>
                </div>
              ) : <NoData text="No experience added" />
            )}
          </div>

          <div className="premium-card mb-3">
            <div className="tp-section-heading-row" style={{ borderBottom: 'none', marginBottom: 0 }}>
              <span className="tp-section-heading" style={{ borderBottom: 'none', margin: 0, padding: 0 }}><FiFileText size={13} /> Project Portfolio ({profileData?.portfolio?.length || 0})</span>
              <button className="tp-toggle-btn" onClick={() => setPortfolioExpanded(!portfolioExpanded)}>
                {portfolioExpanded ? "Show Less" : "View All"} <FiChevronDown size={12} style={{ transform: portfolioExpanded ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
              </button>
            </div>
            
            {portfolioExpanded ? (
              <div className="tp-portfolio-grid mt-3">
                {profileData?.portfolio?.length > 0 ? (
                  profileData.portfolio.map((item, idx) => (
                    <div key={idx} className="tp-port-card">
                      <div className="tp-port-info">
                        <h4 className="tp-port-title">{item.title}</h4>
                        <div className="tp-exp-period mb-2">
                          <FiCalendar size={11} /> {item.period}
                        </div>
                        <p className="tp-exp-desc mb-2">{item.description}</p>
                        <div className="tp-tag-row" style={{ marginBottom: 0 }}>
                          {item.tags?.map((tag, tIdx) => (
                            <span key={tIdx} className="tp-tag">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <NoData text="No projects added yet" />
                )}
              </div>
            ) : (
              profileData?.portfolio?.length > 0 ? (
                <div className="tp-exp-preview mt-3">
                  <span className="tp-exp-role">{profileData.portfolio[0].title}</span>
                  <p className="tp-exp-desc" style={{ marginTop: 6 }}>
                    {profileData.portfolio[0].description.slice(0, 120)}…
                  </p>
                </div>
              ) : <NoData text="No projects added" />
            )}
          </div>

          <div className="premium-card">
            <div className="tp-section-heading mb-3"><FiStar size={13} /> Recommended Jobs</div>
            <RecommendedJobs role={profileData?.role} skills={profileData?.skills} employeeId={employeeId} isShortlisted={profileData?.isshortlisted} />
          </div>
        </div>

        <div className="tp-col-side">

          <div className="premium-card mb-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="tp-section-heading mb-0" style={{ borderBottom: 'none', paddingBottom: 0 }}>Quick Information</div>
              <button className="tp-util-btn" style={{ padding: "4px 8px", fontSize: "11px" }} onClick={() => setShowEditModal(true)}>
                <FiEdit2 size={11} style={{ marginRight: '4px' }} /> Edit
              </button>
            </div>
            
            <div className="tp-info-row" style={{ marginBottom: '16px' }}>
              <div className="tp-info-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>
                <FiStar size={14} />
              </div>
              <div>
                <div className="tp-quick-lbl">Expected Salary</div>
                <div className="tp-quick-val">
                  {professionalData?.expectedSalaryMin && professionalData?.expectedSalaryMax
                    ? `$${professionalData.expectedSalaryMin.toLocaleString()} - $${professionalData.expectedSalaryMax.toLocaleString()} / year`
                    : "Not specified"}
                </div>
              </div>
            </div>
            
            <div className="tp-info-row" style={{ marginBottom: '16px' }}>
              <div className="tp-info-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>
                <FiBriefcase size={14} />
              </div>
              <div>
                <div className="tp-quick-lbl">Work Preference</div>
                <div className="tp-quick-val">{professionalData?.workPreference || "Not specified"}</div>
              </div>
            </div>
            
            <div className="tp-info-row" style={{ marginBottom: '16px' }}>
              <div className="tp-info-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>
                <FiMapPin size={14} />
              </div>
              <div>
                <div className="tp-quick-lbl">Work Authorization</div>
                <div className="tp-tag-row mt-1">
                  {[professionalData?.isUSCitizen && "US Citizen", professionalData?.isGreenCard && "Green Card", professionalData?.isH1B && "H1B", professionalData?.isEAD && "EAD"].filter(Boolean).map((auth, index) => (
                    <span key={index} className="tp-tag">{auth}</span>
                  )) || <span className="tp-quick-val text-muted">Not specified</span>}
                </div>
              </div>
            </div>
            
            <div className="tp-info-row">
              <div className="tp-info-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>
                <FiBriefcase size={14} />
              </div>
              <div>
                <div className="tp-quick-lbl">Preferred Employment</div>
                <div className="tp-tag-row mt-1">
                  {[professionalData?.isCorpCorp && "Corp-Corp", professionalData?.isW2Permanent && "W2 Permanent", professionalData?.isW2Contract && "W2 Contract", professionalData?.is1099Contract && "1099 Contract", professionalData?.isContractToHire && "Contract to Hire"].filter(Boolean).map((emp, index) => (
                    <span key={index} className="tp-tag" style={{ background: '#eff6ff', color: '#2563eb', borderColor: '#dbeafe' }}>{emp}</span>
                  )) || <span className="tp-quick-val text-muted">Not specified</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="premium-card mb-3">
            <div className="tp-section-heading">Expertise</div>
            <div className="tp-tag-row">
              {profileData?.skills?.length > 0 ? profileData.skills.map((skill, idx) => <span key={idx} className="tp-tag">{skill.trim()}</span>) : <NoData text="No skills added" />}
            </div>
          </div>

          <div className="premium-card mb-3">
            <div className="tp-section-heading">Contact Information</div>
            <div className="tp-contact-list">
              <div className="tp-contact-item"><FiMail /> <span style={{ wordBreak: 'break-all' }}>{profileData?.email}</span></div>
              <div className="tp-contact-item"><FiPhone /> {profileData?.phoneNo}</div>
            </div>
          </div>

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
      </div>

      {showEditModal && (
        <div
          className="ut-modal-overlay"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
            padding: "20px",
            animation: "fadeIn 0.3s ease-out"
          }}
          onClick={handleCloseModal}
        >
          <div
            className="ut-modal-content"
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "20px",
              width: "100%",
              maxWidth: "600px",
              maxHeight: "90vh",
              overflow: "hidden",
              boxShadow: "0 20px 40px -10px rgba(91, 91, 214, 0.15)",
              display: "flex",
              flexDirection: "column",
              animation: "slideUp 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ padding: "24px 32px", position: "relative", borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
              <button
                onClick={handleCloseModal}
                style={{
                  position: "absolute",
                  top: "24px",
                  right: "24px",
                  padding: "8px",
                  borderRadius: "50%",
                  border: "none",
                  backgroundColor: "transparent",
                  color: "#64748b",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                <FiX size={20} />
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "rgba(91,91,214,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#5B5BD6"
                }}>
                  <FiEdit2 size={20} />
                </div>
                <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                  Edit Profile Information
                </h2>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "32px", overflowY: "auto", flex: 1 }}>
              <div className="edit-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="auth-label" style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>Expected Salary Range</label>
                  <div className="salary-inputs" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input type="number" name="expectedSalaryMin" className="auth-input" style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', color: '#1e293b', outline: 'none' }} placeholder="Min" value={editFormData.expectedSalaryMin} onChange={handleInputChange} />
                    <span style={{ color: '#94a3b8', fontSize: '14px' }}>to</span>
                    <input type="number" name="expectedSalaryMax" className="auth-input" style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', color: '#1e293b', outline: 'none' }} placeholder="Max" value={editFormData.expectedSalaryMax} onChange={handleInputChange} />
                    <select className="auth-input" name="salaryCurrency" style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', color: '#1e293b', width: '90px', outline: 'none' }} value={editFormData.salaryCurrency} onChange={handleInputChange}>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="INR">INR</option>
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="auth-label" style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>Work Preference</label>
                  <select name="workPreference" className="auth-input" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', color: '#1e293b', outline: 'none' }} value={editFormData.workPreference} onChange={handleInputChange}>
                    <option value="">Select preference</option>
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="auth-label" style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>Languages</label>
                  <input className="auth-input" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', color: '#1e293b', outline: 'none' }} placeholder="Add language (press Enter)..." value={languageInput} onChange={(e) => setLanguageInput(e.target.value)} onKeyDown={handleAddLanguage} />
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {editFormData.languages?.map(lang => (
                      <span key={lang} className="tp-tag" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f1f5f9' }}>
                        {lang} 
                        <FiX size={12} style={{ cursor: 'pointer', color: '#94a3b8' }} onClick={() => removeLanguage(lang)} />
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ gridColumn: 'span 1' }}>
                  <label className="auth-label" style={{ display: 'block', marginBottom: '12px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>Work Authorization</label>
                  {["US Citizen", "Green Card", "H1B", "EAD"].map(opt => (
                    <div key={opt} className="d-flex align-items-center gap-2 mb-2">
                      <input type="checkbox" style={{ width: '16px', height: '16px', accentColor: '#5B5BD6' }} checked={editFormData.workAuthorization.includes(opt)} onChange={() => handleWorkAuthChange(opt)} />
                      <label className="mb-0" style={{ fontSize: '13px', color: '#475569', fontWeight: '500' }}>{opt}</label>
                    </div>
                  ))}
                </div>

                <div style={{ gridColumn: 'span 1' }}>
                  <label className="auth-label" style={{ display: 'block', marginBottom: '12px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>Employment Type</label>
                  {["Corp-Corp", "W2 Permanent", "W2 Contract", "1099 Contract"].map(opt => (
                    <div key={opt} className="d-flex align-items-center gap-2 mb-2">
                      <input type="checkbox" style={{ width: '16px', height: '16px', accentColor: '#5B5BD6' }} checked={editFormData.preferredEmployment.includes(opt)} onChange={() => handleEmploymentChange(opt)} />
                      <label className="mb-0" style={{ fontSize: '13px', color: '#475569', fontWeight: '500' }}>{opt}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: "16px 32px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end", gap: "12px", backgroundColor: "#fff" }}>
              <button
                onClick={handleCloseModal}
                style={{ padding: "8px 20px", backgroundColor: "#ffffff", color: "#475569", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer", transition: "0.2s" }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                style={{ padding: "8px 24px", background: "linear-gradient(135deg, #5B5BD6 0%, #7C3AED 100%)", color: "#ffffff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer", boxShadow: "0 4px 12px rgba(91, 91, 214, 0.2)", transition: "0.2s" }}
              >
                <FiSave style={{ marginRight: '6px' }} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadTalentProfile;
