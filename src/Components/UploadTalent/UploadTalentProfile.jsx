import React, { useEffect, useMemo, useState } from "react";
import { FiMapPin, FiBriefcase, FiDownload, FiShare2, FiMail, FiPhone, FiLinkedin, FiFileText, FiArrowLeft, FiEdit2, FiSave, FiX, FiPlus, FiArrowRight, FiCalendar, FiUser, FiCheckCircle, FiExternalLink, FiLoader, FiAward, FiBookOpen, FiStar, FiTrendingUp, FiLock, FiClock, FiChevronDown } from "react-icons/fi";
import { BsDribbble, BsBuilding } from "react-icons/bs";
import { FaGem } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import "./../TalentPool/Talent Profile/TalentProfile.css";
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

// ===========================
// RecommendedJobs Component
// ===========================
const RecommendedJobs = ({ navigate, role, skills }) => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [allJobs, setAllJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [getRecommendedJobs] = useGetRecommendJobsListMutation();

  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      if (!role || !skills || skills.length === 0) return;
      try {
        setIsLoading(true);
        const payload = { role, skills };
        const res = await getRecommendedJobs(payload).unwrap();
        setAllJobs(Array.isArray(res) ? res : []);
      } catch (error) {
        console.error("Error fetching recommended jobs:", error);
        setAllJobs([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecommendedJobs();
  }, [role, skills, getRecommendedJobs]);

  const handleAddTalentClick = (job) => {
    const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
    const targetPath = window.location.pathname.toLowerCase().startsWith('/admin') ? `${basePath}/admin-upload-talent` : `${basePath}/user-upload-talent`;
    navigate(targetPath, { state: { jobTitle: job.title } });
  };

  const handleViewMoreJobs = () => {
    const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
    const targetPath = window.location.pathname.toLowerCase().startsWith('/admin') ? `${basePath}/admin-jobs` : `${basePath}/user-jobs`;
    navigate(targetPath, { state: { role: role } });
  };

  const firstThreeJobs = useMemo(() => allJobs.slice(0, 3), [allJobs]);

  return (
    <div style={{ padding: "0" }}>
      <div>
        <div className="tp-scrollable-area grid-view" style={{ padding: 0 }}>
          {!isLoading && firstThreeJobs.length > 0 ? (
            <>
              {firstThreeJobs.map((job) => (
                <div key={job.id} className="tp-item-card">
                  <div className="tp-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="d-flex align-items-start justify-content-between">
                      <div className="d-flex gap-3">
                        <div className="tp-timeline-icon" style={{ width: '40px', height: '40px', borderRadius: '12px' }}>
                          <BsBuilding size={20} />
                        </div>
                        <div>
                          <h4 className="mb-0" style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>{job.title}</h4>
                          <span className="tp-card-badge" style={{ fontSize: '11px', color: '#3b82f6', background: 'transparent', padding: 0 }}>{job.company}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="meta-info d-flex gap-3 text-muted" style={{ fontSize: '12px' }}>
                      <div className="d-flex align-items-center gap-1">
                        <FiMapPin size={12} /> <span>{job.location}</span>
                      </div>
                      <div className="d-flex align-items-center gap-1">
                        <FiClock size={12} /> <span>{job.type}</span>
                      </div>
                    </div>

                    <div className="tp-meta-strip" style={{ gap: '1rem', background: '#f8fafc', padding: '12px', borderRadius: '12px' }}>
                      <div className="tp-meta-item" style={{ fontSize: '11px' }}>
                         <strong style={{ color: '#64748b', fontWeight: '600' }}>Budget:</strong> <span style={{ color: '#0f172a', fontWeight: '700' }}>{job.rateText}{job.budgetLabel}</span>
                      </div>
                      <div className="tp-meta-item" style={{ fontSize: '11px' }}>
                         <strong style={{ color: '#64748b', fontWeight: '600' }}>Exp:</strong> <span style={{ color: '#0f172a', fontWeight: '700' }}>{job.experienceText}</span>
                      </div>
                    </div>

                    <div className="tp-tags-wrapper">
                      {job.skills?.slice(0, 3).map((skill) => (
                        <span key={skill} className="tp-tag-pill" style={{ fontSize: '11px', padding: '4px 10px', background: '#f1f5f9', border: 'none' }}>
                          {skill}
                        </span>
                      ))}
                    </div>

                    <button
                      className="btn-primary w-100 mt-1"
                      onClick={() => handleAddTalentClick(job)}
                      style={{ padding: '8px', borderRadius: '8px', fontSize: '13px', fontWeight: '600' }}
                    >
                      Add Talent
                    </button>
                  </div>
                </div>
              ))}

              {firstThreeJobs.length >= 3 && (
                <div className="tp-item-card" style={{ borderStyle: 'dashed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="tp-card-body text-center">
                    <div className="tp-timeline-icon mx-auto mb-3" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
                       <FiArrowRight size={24} />
                    </div>
                    <h4 className="mb-2">View All Opportunities</h4>
                    <p className="text-muted small mb-4">Discover more jobs matching your expertise</p>
                    <button className="btn-secondary w-100" onClick={handleViewMoreJobs}>
                      Explore More Jobs
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : isLoading ? (
            <div className="d-flex justify-content-center p-5 w-100">
               <FiLoader className="loading-spinner" />
            </div>
          ) : (
            <div className="w-100">
              <NoData text="No matching jobs found at the moment" />
            </div>
          )}
        </div>
      </div>

      {selectedJob && (
        <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  );
};

// ===========================
// Main UploadTalentProfile
// ===========================
const UploadTalentProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showContent, setShowContent] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
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
    return {
      name: `${apiData?.firstName || "N/A"} ${apiData?.lastName || ""}`.trim(),
      role: apiData?.title || "N/A",
      location: `${apiData?.city || "N/A"}, ${apiData?.state || ""}`.replace(/, $/, ""),
      experience: calculateTotalExperience(apiData?.workexperiences),
      status: apiData?.status || "N/A",
      summary: apiData?.bio || "N/A",
      email: apiData?.emailAddress || "N/A",
      phoneNo: apiData?.phoneNo || "N/A",
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
        period: `${p.startDate?.slice(0, 10) || "N/A"} - ${p.endDate ? p.endDate.slice(0, 10) : "Present"}`,
        tags: p.skills ? p.skills.split(",") : [],
      })) || [],
      education: apiData.employee_Heighers?.map(edu => ({
        degree: edu.highestQualification || "N/A",
        school: edu.university || "N/A",
        field: edu.fieldofstudy || "N/A",
        year: `${edu.startDate?.slice(0, 4) || "N/A"} - ${edu.endDate ? edu.endDate.slice(0, 4) : "Present"}`,
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

  const handleEditClick = () => setShowEditModal(true);
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
      <div className="projects-container">
        <div className="profile-breadcrumb">
          <div className="skeleton-text" style={{ width: "150px", height: "24px" }}></div>
        </div>
        <div className="tp-hero-card">
          <div className="tp-avatar-wrapper">
            <div className="skeleton-circle" style={{ width: "120px", height: "120px" }}></div>
          </div>
          <div className="tp-info-main">
            <div className="skeleton-text" style={{ width: "250px", height: "32px", marginBottom: "12px" }}></div>
            <div className="skeleton-text" style={{ width: "180px", height: "20px", marginBottom: "16px" }}></div>
            <div className="tp-meta-strip">
              <div className="skeleton-text" style={{ width: "100px", height: "16px" }}></div>
              <div className="skeleton-text" style={{ width: "100px", height: "16px" }}></div>
              <div className="skeleton-text" style={{ width: "100px", height: "16px" }}></div>
            </div>
          </div>
          <div className="tp-sidebar-actions">
            <div className="skeleton-text" style={{ width: "160px", height: "40px", borderRadius: "8px" }}></div>
            <div className="skeleton-text" style={{ width: "160px", height: "40px", borderRadius: "8px" }}></div>
          </div>
        </div>
        <div className="tp-details-grid">
          <div className="tp-column-main">
            <div className="tp-card-premium">
              <div className="skeleton-text" style={{ width: "200px", height: "24px", marginBottom: "20px" }}></div>
              <div className="skeleton-text" style={{ width: "100%", height: "16px", marginBottom: "8px" }}></div>
              <div className="skeleton-text" style={{ width: "95%", height: "16px", marginBottom: "8px" }}></div>
            </div>
            <div className="tp-square-sections-grid">
              <div className="tp-square-card expanded">
                <div className="tp-square-card-header"><div className="skeleton-text" style={{ width: "150px", height: "24px" }}></div></div>
                <div className="tp-scrollable-area grid-view">
                  {[1, 2].map(i => (
                    <div key={i} className="tp-item-card"><div className="tp-card-body"><div className="skeleton-text" style={{ width: "100%", height: "100px" }}></div></div></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="tp-column-side">
            <div className="tp-card-premium sidebar-card"><div className="skeleton-text" style={{ width: "100%", height: "200px" }}></div></div>
          </div>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <EditTalentProfile
        initialData={apiData}
        onCancel={() => setIsEditing(false)}
        onSuccess={() => { setIsEditing(false); getEmployeeProfile(employeeId); }}
      />
    );
  }

  return (
    <div className="projects-container">
      <div className="profile-breadcrumb">
        <button className="breadcrumb-back" onClick={() => {
          const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
          const targetPath = window.location.pathname.toLowerCase().startsWith('/admin') ? `${basePath}/admin-upload-talent` : `${basePath}/user-upload-talent`;
          navigate(targetPath);
        }}>
          <FiArrowLeft /> Talent Profile
        </button>
        <span>/ Profile Page</span>
      </div>

      <div className="tp-hero-card">
        <div className="tp-avatar-wrapper">
          {profileData?.profileImage ? (
            <img src={profileData.profileImage} alt={profileData?.name} className="tp-avatar-lg" />
          ) : (
            <div className="tp-avatar-lg avatar-initials">{initials}</div>
          )}
        </div>
        <div className="tp-info-main">
          <div className="tp-name-row">
            <h1>{profileData?.name}</h1>
            <FiCheckCircle color="#10b981" size={24} />
          </div>
          <div className="tp-role-subtitle">{profileData?.role}</div>
          <div className="tp-meta-strip">
            <div className="tp-meta-item"><FiMapPin /> {profileData?.location}</div>
            <div className="tp-meta-item"><FiBriefcase /> {profileData?.experience}</div>
            <div className="tp-meta-item"><FiAward /> {profileData?.status}</div>
          </div>
        </div>
        <div className="tp-sidebar-actions">
          <div 
            className="tp-card-premium sidebar-card mb-4" 
            style={{ 
              background: 'linear-gradient(135deg, #eff6ff 0%, #fff 100%)',
              border: '1px solid #dbeafe',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: '20px'
            }}
            onClick={() => {
              const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
              const targetPath = window.location.pathname.toLowerCase().startsWith('/admin') ? `${basePath}/admin-jobs` : `${basePath}/user-jobs`;
              navigate(targetPath, { state: { role: profileData?.role } });
            }}
          >
            <div className="d-flex align-items-center gap-3">
              <div style={{ 
                width: '44px', 
                height: '44px', 
                background: '#3b82f6', 
                borderRadius: '12px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: 'white',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)'
              }}>
                <FiBriefcase size={22} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#1e3a8a' }}>Explore Jobs</h4>
                <p style={{ margin: 0, fontSize: '12px', color: '#60a5fa', fontWeight: '600' }}>Find matches for {profileData?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="tp-details-grid">
        <div className="tp-column-main">
          <div className="tp-card-premium">
            <h3 className="tp-card-title" style={{ borderBottom: "1px solid #f8fafc", paddingBottom: "1.25rem" }}><FiUser /> Professional Summary</h3>
            <p className="summary-text">{profileData?.summary}</p>
          </div>
            <div className="tp-square-sections-grid">
              {/* Work Experience Square Card */}
              <div className={`tp-square-card ${expExpanded ? "expanded" : "collapsed"}`}>
                <div className="tp-square-card-header">
                  <h3 className="tp-card-title mb-0"><FiTrendingUp /> Work Experience</h3>
                  <button 
                    className="tp-view-toggle" 
                    onClick={() => setExpExpanded(!expExpanded)}
                  >
                    {expExpanded ? "Show Less" : "View All"}
                  </button>
                </div>
                
                <div className="tp-square-card-content">
                  {expExpanded ? (
                    <div className="tp-scrollable-area grid-view">
                      {profileData?.workExperience?.length > 0 ? (
                        profileData.workExperience.map((job, idx) => (
                          <div key={idx} className="tp-item-card">
                            <div className="tp-card-body">
                              <div className="tp-timeline-icon"><FiBriefcase /></div>
                              <div className="tp-card-info">
                                <div className="tp-card-header-row"><h4>{job.role}</h4><span className="tp-card-badge">{job.company}</span></div>
                                <div className="tp-timeline-period"><FiCalendar size={12} /> {job.period} • <FiMapPin size={12} /> {job.location}</div>
                                <p className="timeline-desc">{job.desc}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : <NoData text="No work experience added yet" />}
                    </div>
                  ) : (
                    <div className="tp-latest-preview">
                      {profileData?.workExperience?.length > 0 ? (
                        <div className="tp-preview-item">
                          <div className="tp-preview-header">
                            <div className="tp-timeline-icon sm"><FiBriefcase /></div>
                            <div className="tp-preview-main">
                              <h4>{profileData.workExperience[0].role}</h4>
                              <div className="tp-timeline-company">{profileData.workExperience[0].company}</div>
                            </div>
                          </div>
                          <p className="tp-preview-desc">{profileData.workExperience[0].desc}</p>
                          <div className="tp-preview-footer">
                            <span>{profileData.workExperience[0].period}</span>
                            <span>Latest Role</span>
                          </div>
                        </div>
                      ) : <NoData text="No experience added" />}
                    </div>
                  )}
                </div>
              </div>

              {/* Project Portfolio Square Card */}
              <div className={`tp-square-card ${portfolioExpanded ? "expanded" : "collapsed"}`}>
                <div className="tp-square-card-header">
                  <h3 className="tp-card-title mb-0"><FiFileText /> Project Portfolio</h3>
                  <button 
                    className="tp-view-toggle" 
                    onClick={() => setPortfolioExpanded(!portfolioExpanded)}
                  >
                    {portfolioExpanded ? "Show Less" : "View All"}
                  </button>
                </div>
                
                <div className="tp-square-card-content">
                  {portfolioExpanded ? (
                    <div className="tp-scrollable-area grid-view">
                      {profileData?.portfolio?.length > 0 ? (
                        profileData.portfolio.map((item, idx) => (
                          <div key={idx} className="tp-item-card">
                            <div className="tp-card-body">
                              <div className="tp-timeline-icon"><FiExternalLink /></div>
                              <div className="tp-card-info">
                                <div className="tp-card-header-row"><h4>{item.title}</h4><span className="tp-card-badge secondary">{item.role}</span></div>
                                <div className="tp-timeline-period"><FiCalendar size={12} /> {item.period}</div>
                                <p className="timeline-desc">{item.description}</p>
                              <div className="tp-tags-wrapper mt-3">
                                {item.tags?.map((tag, tIdx) => <span key={tIdx} className="tp-tag-pill">{tag}</span>)}
                              </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : <NoData text="No projects added yet" />}
                    </div>
                  ) : (
                    <div className="tp-latest-preview">
                      {profileData?.portfolio?.length > 0 ? (
                        <div className="tp-preview-item">
                          <div className="tp-preview-header">
                            <div className="tp-timeline-icon sm"><FiExternalLink /></div>
                            <div className="tp-preview-main">
                              <h4>{profileData.portfolio[0].title}</h4>
                              <div className="tp-card-badge secondary">{profileData.portfolio[0].role}</div>
                            </div>
                          </div>
                          <p className="tp-preview-desc">{profileData.portfolio[0].description}</p>
                          <div className="tp-preview-footer">
                            <span>{profileData.portfolio[0].period}</span>
                            <span>Featured Project</span>
                          </div>
                        </div>
                      ) : <NoData text="No projects added" />}
                    </div>
                  )}
                </div>
              </div>
            </div>
          <div className="tp-card-premium">
            <h3 className="tp-card-title" style={{ marginBottom: "1.5rem" }}><FiStar /> Recommended Jobs</h3>
            <RecommendedJobs navigate={navigate} role={profileData?.role} skills={profileData?.skills} />
          </div>
        </div>

        <div className="tp-column-side">
         

          <div className="tp-card-premium sidebar-card">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="tp-card-title mb-0">Quick Information</h3>
              <button 
                className="btn-secondary" 
                onClick={() => setShowEditModal(true)}
                style={{ 
                  padding: "6px 12px", 
                  fontSize: "11px", 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '6px',
                  width: 'auto',
                  minWidth: 'fit-content'
                }}
              >
                <FiEdit2 size={12} /> Edit
              </button>
            </div>
            <div className="tp-info-block">
              <div className="tp-info-icon-box"><FiStar /></div>
              <div className="tp-info-content-box">
                <div className="tp-info-label-sm">Expected Salary</div>
                <div className="tp-info-value-md">
                  {professionalData?.expectedSalaryMin && professionalData?.expectedSalaryMax
                    ? `$${professionalData.expectedSalaryMin.toLocaleString()} - $${professionalData.expectedSalaryMax.toLocaleString()} / year`
                    : "Not specified"}
                </div>
              </div>
            </div>
            <div className="tp-info-block">
              <div className="tp-info-icon-box"><FiBriefcase /></div>
              <div className="tp-info-content-box">
                <div className="tp-info-label-sm">Work Preference</div>
                <div className="tp-info-value-md">{professionalData?.workPreference || "Not specified"}</div>
              </div>
            </div>
            <div className="tp-info-label-sm mb-2">Work Authorization</div>
            <div className="tp-tags-wrapper mb-3">
              {[professionalData?.isUSCitizen && "US Citizen", professionalData?.isGreenCard && "Green Card", professionalData?.isH1B && "H1B", professionalData?.isEAD && "EAD"].filter(Boolean).map((auth, index) => (
                <span key={index} className="tp-tag-pill">{auth}</span>
              )) || <span className="text-muted small">Not specified</span>}
            </div>
            <div className="tp-info-label-sm mb-2">Preferred Employment</div>
            <div className="tp-tags-wrapper">
              {[professionalData?.isCorpCorp && "Corp-Corp", professionalData?.isW2Permanent && "W2 Permanent", professionalData?.isW2Contract && "W2 Contract", professionalData?.is1099Contract && "1099 Contract", professionalData?.isContractToHire && "Contract to Hire"].filter(Boolean).map((emp, index) => (
                <span key={index} className="tp-tag-pill" style={{ background: '#eff6ff', color: '#2563eb' }}>{emp}</span>
              )) || <span className="text-muted small">Not specified</span>}
            </div>
          </div>
          <div className="tp-card-premium sidebar-card">
            <h3 className="tp-card-title">Expertise</h3>
            <div className="tp-tags-wrapper scrollable-skills">
              {profileData?.skills?.length > 0 ? profileData.skills.map((skill, idx) => <span key={idx} className="tp-tag-pill">{skill.trim()}</span>) : <NoData text="No skills added" />}
            </div>
          </div>
          <div className="tp-card-premium sidebar-card">
            <h3 className="tp-card-title">Education</h3>
            {profileData?.education?.length > 0 ? profileData.education.map((edu, index) => (
              <div key={index} className="tp-info-block" style={{ marginBottom: '16px' }}>
                <div className="tp-info-icon-box" style={{ background: '#fff7ed', color: '#f5810c' }}><FiBookOpen size={18} /></div>
                <div className="tp-info-content-box">
                  <div className="tp-info-value-md">{edu.degree}{edu.field && ` in ${edu.field}`}</div>
                  <div className="tp-info-label-sm">{edu.school}</div>
                  <div className="tp-timeline-period">{edu.year}</div>
                </div>
              </div>
            )) : <NoData text="No education details" />}
          </div>
          <div className="tp-card-premium sidebar-card">
            <h3 className="tp-card-title">Contact Information</h3>
            <div className="tp-info-block">
              <div className="tp-info-icon-box"><FiMail /></div>
              <div className="tp-info-content-box" style={{ minWidth: 0, flex: 1 }}>
                <div className="tp-info-label-sm">Email</div>
                <div className="tp-info-value-md" style={{ wordBreak: 'break-all', fontSize: '0.85rem' }}>{profileData?.email}</div>
              </div>
            </div>
            <div className="tp-info-block">
              <div className="tp-info-icon-box"><FiPhone /></div>
              <div className="tp-info-content-box">
                <div className="tp-info-label-sm">Phone</div>
                <div className="tp-info-value-md">{profileData?.phoneNo}</div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-between px-2">
            <button className="breadcrumb-back" style={{ fontSize: '0.85rem' }}><FiDownload size={14} /> Resume</button>
            <button className="breadcrumb-back" style={{ fontSize: '0.85rem' }}><FiShare2 size={14} /> Share</button>
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
              borderRadius: "24px",
              width: "100%",
              maxWidth: "700px",
              maxHeight: "90vh",
              overflow: "hidden",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              display: "flex",
              flexDirection: "column",
              animation: "slideUp 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ padding: "32px 32px 24px", position: "relative", borderBottom: "1px solid #e2e8f0" }}>
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
                  borderRadius: "12px",
                  backgroundColor: "#fff7ed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#f5810c"
                }}>
                  <FiEdit2 size={24} />
                </div>
                <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#1e293b", margin: 0 }}>
                  Edit Profile Information
                </h2>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "32px", overflowY: "auto", flex: 1 }}>
              <div className="edit-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="auth-label" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#475569' }}>Salary Range</label>
                  <div className="salary-inputs" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input type="number" name="expectedSalaryMin" className="auth-input" style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }} placeholder="Min" value={editFormData.expectedSalaryMin} onChange={handleInputChange} />
                    <span style={{ color: '#64748b' }}>to</span>
                    <input type="number" name="expectedSalaryMax" className="auth-input" style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }} placeholder="Max" value={editFormData.expectedSalaryMax} onChange={handleInputChange} />
                    <select className="auth-input" name="salaryCurrency" style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', width: '100px' }} value={editFormData.salaryCurrency} onChange={handleInputChange}>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="INR">INR</option>
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="auth-label" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#475569' }}>Work Preference</label>
                  <select name="workPreference" className="auth-input" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }} value={editFormData.workPreference} onChange={handleInputChange}>
                    <option value="">Select preference</option>
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="auth-label" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#475569' }}>Languages</label>
                  <input className="auth-input" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }} placeholder="Add language..." value={languageInput} onChange={(e) => setLanguageInput(e.target.value)} onKeyDown={handleAddLanguage} />
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {editFormData.languages?.map(lang => (
                      <span key={lang} className="tp-tag-pill" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {lang} 
                        <FiX size={12} style={{ cursor: 'pointer' }} onClick={() => removeLanguage(lang)} />
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ gridColumn: 'span 1' }}>
                  <label className="auth-label" style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: '#475569' }}>Work Authorization</label>
                  {["US Citizen", "Green Card", "H1B", "EAD"].map(opt => (
                    <div key={opt} className="d-flex align-items-center gap-2 mb-2">
                      <input type="checkbox" style={{ width: '16px', height: '16px', accentColor: '#f5810c' }} checked={editFormData.workAuthorization.includes(opt)} onChange={() => handleWorkAuthChange(opt)} />
                      <label className="mb-0" style={{ fontSize: '14px', color: '#475569' }}>{opt}</label>
                    </div>
                  ))}
                </div>

                <div style={{ gridColumn: 'span 1' }}>
                  <label className="auth-label" style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: '#475569' }}>Employment Type</label>
                  {["Corp-Corp", "W2 Permanent", "W2 Contract", "1099 Contract"].map(opt => (
                    <div key={opt} className="d-flex align-items-center gap-2 mb-2">
                      <input type="checkbox" style={{ width: '16px', height: '16px', accentColor: '#f5810c' }} checked={editFormData.preferredEmployment.includes(opt)} onChange={() => handleEmploymentChange(opt)} />
                      <label className="mb-0" style={{ fontSize: '14px', color: '#475569' }}>{opt}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: "24px 32px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "flex-end", gap: "12px", backgroundColor: "#f8fafc" }}>
              <button
                onClick={handleCloseModal}
                style={{ padding: "10px 24px", backgroundColor: "#ffffff", color: "#1e293b", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                style={{ padding: "10px 28px", backgroundColor: "#f5810c", color: "#ffffff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer", boxShadow: "0 4px 12px rgba(245, 129, 12, 0.2)" }}
              >
                <FiSave style={{ marginRight: '8px' }} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadTalentProfile;
