import React, { useEffect, useMemo, useState } from "react";
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
  FiEdit2,
  FiSave,
  FiX,
  FiPlus,
  FiArrowRight,
} from "react-icons/fi";
import { X } from "lucide-react";
import { BsDribbble, BsBuilding } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useGetRecommendJobsListMutation,
  useLazyGetEmployeeTalentProfileQuery,
} from "../../State-Management/Api/TalentPoolApiSlice";
import { useGetFindJobsMutation } from "../../State-Management/Api/ProjectApiSlice";
import NoData from "./NoData";
import JobModal from "../UserJobs/JobModal";

// ===========================
// RecommendedJobs Component (Simplified for inline use)
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

        const payload = {
          role: role,
          skills: skills,
        };

        const res = await getRecommendedJobs(payload).unwrap();

        if (Array.isArray(res) && res.length > 0) {
          setAllJobs(res);
        } else {
          setAllJobs([]);
        }
      } catch (error) {
        console.error("Error fetching recommended jobs:", error);
        setAllJobs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendedJobs();
  }, [role, skills, getRecommendedJobs]);

  // Normalize API data
  const jobs = useMemo(() => {
    return allJobs.map((job) => ({
      id: job.jobID,
      title: job.jobTitle,
      company: job.companyName,
      location: job.location,
      type: job.employeeType,
      rateText: job.salaryRange_min
        ? `$${job.salaryRange_min}-${job.salaryRange_max}/hr`
        : "N/A",
      experienceText: job.experienceLevel,
      skills: job.requiredSkills
        ? job.requiredSkills.split(",").map((s) => s.trim())
        : [],
    }));
  }, [allJobs]);

  // Get first 3 jobs
  const firstThreeJobs = useMemo(() => {
    return jobs.slice(0, 3);
  }, [jobs]);

  const handleAddTalentClick = (job) => {
    setSelectedJob(job);
  };

  const handleViewMoreJobs = () => {
    navigate("/user/user-jobs");
  };

  return (
    <div style={{ padding: "0" }}>
      <div>
        <div className="jobs-grid">
          {!isLoading && firstThreeJobs.length > 0 ? (
            <>
              {firstThreeJobs.map((job) => (
                <div key={job.id} className="project-card" style={{ gap: "0" }}>
                  {/* Job Card Header */}
                  <div
                    className="job-card-top"
                    style={{ marginBottom: "16px", alignItems: "flex-start" }}
                  >
                    <div className="company-icon-box large">
                      <BsBuilding size={24} />
                    </div>
                    <div className="job-header-info">
                      <h3
                        className="job-title"
                        style={{ fontSize: "18px", marginBottom: "6px" }}
                      >
                        {job.title}
                      </h3>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px",
                        }}
                      >
                        <p
                          className="company-name"
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#6366f1",
                          }}
                        >
                          {job.company}
                        </p>
                        <div
                          style={{
                            fontSize: "13px",
                            color: "var(--slate-500)",
                          }}
                        >
                          {job.location}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats Block */}
                  <div
                    className="drawer-stats"
                    style={{ marginBottom: "20px" }}
                  >
                    <div className="drawer-stat-item">
                      <span className="label">Budget</span>
                      <span className="value">{job.rateText}</span>
                    </div>
                    <div className="drawer-stat-item">
                      <span className="label">Experience</span>
                      <span className="value">{job.experienceText}</span>
                    </div>
                    <div className="drawer-stat-item">
                      <span className="label">Type</span>
                      <span className="value">{job.type}</span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div style={{ marginBottom: "24px" }}>
                    <h4
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "var(--slate-800)",
                        margin: "0 0 8px 0",
                      }}
                    >
                      Required Skills
                    </h4>
                    <div className="skills-cloud">
                      {job.skills.map((skill) => (
                        <span
                          key={skill}
                          className="status-tag status-progress"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div
                    className="card-actions full-width"
                    style={{
                      marginTop: "auto",
                      borderTop: "none",
                      paddingTop: 0,
                    }}
                  >
                    <button
                      className="btn-primary full-width"
                      onClick={() => handleAddTalentClick(job)}
                    >
                      <FiPlus size={16} style={{ marginRight: "8px" }} />
                      Add Talent
                    </button>
                  </div>
                </div>
              ))}

              {/* More Jobs Card */}
              {firstThreeJobs.length >= 3 && (
                <div
                  className="project-card"
                  style={{
                    gap: "0",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    backgroundColor: "#f8fafc",
                    border: "2px dashed #e2e8f0",
                  }}
                >
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "50%",
                      backgroundColor: "#e2e8f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 24px",
                    }}
                  >
                    <FiArrowRight size={32} color="#64748b" />
                  </div>

                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: 600,
                      color: "#334155",
                      marginBottom: "12px",
                    }}
                  >
                    Discover More Opportunities
                  </h3>

                  <p
                    style={{
                      fontSize: "14px",
                      color: "#64748b",
                      marginBottom: "32px",
                      lineHeight: "1.5",
                      maxWidth: "300px",
                    }}
                  >
                    Explore additional job opportunities that match your skills
                    and preferences
                  </p>

                  <div
                    className="card-actions full-width"
                    style={{
                      marginTop: "auto",
                      borderTop: "none",
                      paddingTop: 0,
                    }}
                  >
                    <button
                      className="btn-primary full-width"
                      onClick={handleViewMoreJobs}
                    >
                      <FiArrowRight size={18} />
                      View More Jobs
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : isLoading ? (
            <div
              style={{
                gridColumn: "1 / -1",
                minHeight: "320px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading job recommendations...</p>
              </div>
            </div>
          ) : (
            <div
              style={{
                gridColumn: "1 / -1",
                minHeight: "320px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <NoData text="No job recommendations available" />
            </div>
          )}
        </div>
      </div>

      {/* Job Modal */}
      {selectedJob && (
        <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  );
};

const UploadTalentProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showContent, setShowContent] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [languageInput, setLanguageInput] = useState("");

  const handleAddSkill = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const newSkill = skillInput.trim();
      if (!newSkill) return;

      setEditFormData((prev) => {
        if (prev.skills.includes(newSkill)) return prev;

        return {
          ...prev,
          skills: [...prev.skills, newSkill],
        };
      });

      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setEditFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const workPreferenceOptions = [
    "Onsite",
    "Remote",
    "Hybrid (1–2 days onsite)",
    "Hybrid (2–3 days onsite)",
    "Hybrid (3–4 days onsite)",
    "Flexible",
  ];

  const [editFormData, setEditFormData] = useState({
    expectedSalaryMin: "",
    expectedSalaryMax: "",
    noticePeriod: "",
    workPreference: "",
    languages: [],
    workAuthorization: [],
    preferredEmployment: [],
    skills: [],
  });

  const employeeId = location.state?.employeeId;

  const [getEmployeeProfile, { data: apiData, isLoading, isError }] =
    useLazyGetEmployeeTalentProfileQuery();

  useEffect(() => {
    if (employeeId) {
      getEmployeeProfile(employeeId);
    }
  }, [employeeId, getEmployeeProfile]);

  // Initialize form data when apiData is available
  useEffect(() => {
    if (apiData) {
      // Parse salary range from existing data
      const salaryMatch = "$120,000 - $150,000 / year".match(/\$([\d,]+)/g);
      const minSalary = salaryMatch?.[0]?.replace(/[$,]/g, "") || "120000";
      const maxSalary = salaryMatch?.[1]?.replace(/[$,]/g, "") || "150000";

      setEditFormData({
        expectedSalaryMin: minSalary,
        expectedSalaryMax: maxSalary,
        noticePeriod: "2",
        workPreference: "Hybrid (2-3 days remote)",
        languages: ["English", "Spanish"],
        workAuthorization: [],
        preferredEmployment: [],
        skills: apiData?.skills
          ? apiData.skills.split(",").map((s) => s.trim())
          : [],
      });
    }
  }, [apiData]);

  // Delay showing content to prevent flash of NoData components
  useEffect(() => {
    let timer;
    if (apiData && !isLoading) {
      timer = setTimeout(() => {
        setShowContent(true);
      }, 100);
    } else if (isLoading) {
      setShowContent(false);
    }
    return () => clearTimeout(timer);
  }, [apiData, isLoading]);

  const getInitials = (firstName = "", lastName = "") => {
    const first = firstName?.trim().charAt(0) || "";
    const last = lastName?.trim().charAt(0) || "";
    return (first + last).toUpperCase() || "N/A";
  };

  const profileData = useMemo(() => {
    if (!apiData) return null;

    return {
      name: `${apiData?.firstName || "N/A"} ${apiData?.lastName || ""}`.trim(),
      role: apiData?.title || "N/A",
      location: `${apiData?.city || "N/A"}, ${apiData?.state || ""}`.replace(
        /, $/,
        "",
      ),
      experience: apiData?.noofExperience
        ? `${apiData.noofExperience}+ years experience`
        : "N/A",
      status: apiData?.status || "N/A",

      summary: apiData?.bio || "N/A",
      email: apiData?.emailAddress || "N/A",
      phoneNo: apiData?.phoneNo || "N/A",
      stats: [
        {
          label: "Experience",
          value: apiData?.noofExperience
            ? `${apiData.noofExperience}+ yrs`
            : "N/A",
        },
        { label: "Projects", value: apiData?.employeeprojects?.length || 0 },
      ],

      skills: apiData?.skills ? apiData?.skills.split(",") : [],

      workExperience:
        apiData?.workexperiences?.map((w) => ({
          role: w.position || "N/A",
          company: w.companyName || "N/A",
          period: `${w.startDate?.slice(0, 4) || "N/A"} - ${
            w.endDate ? w.endDate.slice(0, 4) : "Present"
          }`,
          location: w.city || apiData?.city || "N/A",
          desc: w.description || "N/A",
        })) || [],

      portfolio:
        apiData?.employeeprojects?.map((p) => ({
          title: p.projectName || "N/A",
          role: p.role || "N/A",
          description: p.description || "N/A",
          period: `${p.startDate?.slice(0, 10) || "N/A"} - ${
            p.endDate ? p.endDate.slice(0, 10) : "Present"
          }`,
          tags: p.skills ? p.skills.split(",") : [],
        })) || [],

      education:
        apiData.employee_Heighers?.map((edu) => ({
          degree: edu.highestQualification || "N/A",
          school: edu.university || "N/A",
          field: edu.fieldofstudy || "N/A",
          year: `${edu.startDate?.slice(0, 4) || "N/A"} - ${
            edu.endDate ? edu.endDate.slice(0, 4) : "Present"
          }`,
          certifications: edu.certifications || "N/A",
          percentage: edu.percentage || "N/A",
        })) || [],

      resume: apiData?.resumeFilePath || "N/A",

      languages: apiData?.prefLanguage ? apiData?.prefLanguage.split(",") : [],
    };
  }, [apiData]);

  const initials = useMemo(() => {
    if (!apiData) return "N/A";
    return getInitials(apiData.firstName, apiData.lastName);
  }, [apiData]);

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleWorkAuthChange = (authType) => {
    setEditFormData((prev) => {
      const currentAuths = [...prev.workAuthorization];
      const index = currentAuths.indexOf(authType);

      if (index > -1) {
        currentAuths.splice(index, 1);
      } else {
        currentAuths.push(authType);
      }

      return {
        ...prev,
        workAuthorization: currentAuths,
      };
    });
  };

  const handleEmploymentChange = (employmentType) => {
    setEditFormData((prev) => {
      const currentTypes = [...prev.preferredEmployment];
      const index = currentTypes.indexOf(employmentType);

      if (index > -1) {
        currentTypes.splice(index, 1);
      } else {
        currentTypes.push(employmentType);
      }

      return {
        ...prev,
        preferredEmployment: currentTypes,
      };
    });
  };

  const handleSkillsChange = (e) => {
    const skillsString = e.target.value;
    const skillsArray = skillsString
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill);
    setEditFormData((prev) => ({
      ...prev,
      skills: skillsArray,
    }));
  };

  const handleAddLanguage = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();

      const newLang = languageInput.replace(",", "").trim();
      if (!newLang) return;

      setEditFormData((prev) => {
        if (prev.languages.includes(newLang)) return prev;

        return {
          ...prev,
          languages: [...prev.languages, newLang],
        };
      });

      setLanguageInput("");
    }
  };

  const removeLanguage = (langToRemove) => {
    setEditFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((l) => l !== langToRemove),
    }));
  };

  const handleSave = () => {
    // Here you would typically make an API call to save the updated data
    console.log("Saving data:", editFormData);

    // For now, just close the modal
    setShowEditModal(false);

    // You could add a success toast/notification here
    alert("Profile information updated successfully!");
  };

  const formatSalary = (min, max) => {
    const formatNumber = (num) => {
      return `$${parseInt(num).toLocaleString()}`;
    };
    return `${formatNumber(min)} - ${formatNumber(max)} / year`;
  };

  const workAuthOptions = [
    { value: "US Citizen", label: "US Citizen" },
    { value: "GC", label: "Green Card" },
    { value: "H1B", label: "H1B Visa" },
    { value: "EAD", label: "EAD (OPT/CPT/GC/H4)" },
  ];

  const employmentOptions = [
    { value: "Corp-Corp", label: "Corp-Corp" },
    { value: "W2-Permanent", label: "W2 Permanent" },
    { value: "W2-Contract", label: "W2 Contract" },
    { value: "1099-Contract", label: "1099 Contract" },
    { value: "Contract to Hire", label: "Contract to Hire" },
  ];

  const styleCards = `
    .project-card1{
      background: #ffffff;
      border-radius: 1rem;
      padding: 16px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 12px -1px rgba(15, 23, 42, 0.05);
      display: flex;
      flex-direction: column;
      gap: 12px;
      position: relative;
      overflow: hidden;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      z-index: 1;
      height: 300px;
    }
    
    .experience-list {
      max-height: 285px;
      overflow-y: auto;
      width: 100%;
      padding-right: 6px;
    }

    .experience-list::-webkit-scrollbar {
      width: 6px;
    }

    .experience-list::-webkit-scrollbar-thumb {
      background-color: #cbd5e1;
      border-radius: 4px;
    }

    .experience-list::-webkit-scrollbar-track {
      background: transparent;
    }

    .skills-container {
      flex: 1;
      overflow-y: auto;
      max-height: 250px;
      padding: 2px 4px;
    }

    .status-tag.status-progress {
      margin: 1px;
      padding: 2px 6px;
      font-size: 11px;
    }

    .skills-container::-webkit-scrollbar {
      width: 6px;
    }

    .skills-container::-webkit-scrollbar-thumb {
      background-color: #cbd5e1;
      border-radius: 4px;
    }

    .education-list {
      flex: 1;
      overflow-y: auto;
      max-height: 250px;
      padding-right: 6px;
    }

    .education-list::-webkit-scrollbar {
      width: 6px;
    }

    .education-list::-webkit-scrollbar-thumb {
      background-color: #cbd5e1;
      border-radius: 4px;
    }

    .summary-text-container {
      flex: 1;
      overflow-y: auto;
      max-height: 150px;
      margin-bottom: 16px;
      padding-right: 6px;
    }

    .summary-text-container::-webkit-scrollbar {
      width: 6px;
    }

    .summary-text-container::-webkit-scrollbar-thumb {
      background-color: #cbd5e1;
      border-radius: 4px;
    }

    /* Edit Modal Styles */
    .edit-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .edit-modal {
      background: white;
      border-radius: 12px;
      width: 90%;
      max-width: 800px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    .edit-modal-header {
      padding: 20px 24px;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .edit-modal-body {
      padding: 24px;
    }

    .edit-form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    .form-group {
      margin-bottom: 16px;
    }



    .form-control {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
      transition: border-color 0.15s ease-in-out;
    }

    .form-control:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .checkbox-group {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 8px;
    }

    .checkbox-item {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }

    .checkbox-item input[type="checkbox"] {
      width: 16px;
      height: 16px;
      cursor: pointer;
    }

    .checkbox-item label {
      margin: 0;
      cursor: pointer;
      font-size: 14px;
    }

    .edit-modal-footer {
      padding: 20px 24px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    .full-width {
      grid-column: 1 / -1;
    }

    .salary-inputs {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .salary-inputs .form-control {
      flex: 1;
    }

    @media (max-width: 768px) {
      .edit-form-grid {
        grid-template-columns: 1fr;
      }
    }
  `;

  // Loading skeleton component
  if (isLoading || !showContent) {
    return (
      <>
        <style>{styleCards}</style>
        <div className="projects-container">
          {/* Breadcrumb Skeleton */}
          <div className="profile-breadcrumb d-flex gap-1 mb-4">
            <div
              className="skeleton-text"
              style={{ width: "150px", height: "24px" }}
            ></div>
          </div>

          <div className="dashboard-layout">
            {/* === LEFT MAIN COLUMN === */}
            <div className="dashboard-column-main">
              <div className="row mb-4">
                <div className="col-3">
                  {/* Profile Header Card Skeleton */}
                  <div className="project-card h-100">
                    <div
                      className="skeleton-circle"
                      style={{
                        width: "100px",
                        height: "100px",
                        margin: "0 auto 16px auto",
                      }}
                    ></div>
                    <div
                      className="skeleton-text"
                      style={{
                        width: "80%",
                        height: "24px",
                        margin: "0 auto 8px auto",
                      }}
                    ></div>
                    <div
                      className="skeleton-text"
                      style={{
                        width: "60%",
                        height: "20px",
                        margin: "0 auto 12px auto",
                      }}
                    ></div>
                    <div className="d-flex gap-2 justify-content-center">
                      <div
                        className="skeleton-text"
                        style={{ width: "40px", height: "24px" }}
                      ></div>
                      <div
                        className="skeleton-text"
                        style={{ width: "40px", height: "24px" }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="col-9">
                  {/* Professional Summary Skeleton */}
                  <div
                    className="project-card h-100"
                    style={{
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      className="skeleton-text"
                      style={{
                        width: "40%",
                        height: "28px",
                        marginBottom: "16px",
                      }}
                    ></div>
                    <div
                      style={{
                        flex: 1,
                        overflow: "auto",
                        marginBottom: "16px",
                      }}
                    >
                      <div
                        className="skeleton-text"
                        style={{
                          width: "100%",
                          height: "16px",
                          marginBottom: "8px",
                        }}
                      ></div>
                      <div
                        className="skeleton-text"
                        style={{
                          width: "90%",
                          height: "16px",
                          marginBottom: "8px",
                        }}
                      ></div>
                      <div
                        className="skeleton-text"
                        style={{
                          width: "80%",
                          height: "16px",
                          marginBottom: "8px",
                        }}
                      ></div>
                    </div>
                    <div className="summary-stats-grid">
                      <div className="summary-stat-box">
                        <div
                          className="skeleton-text"
                          style={{
                            width: "50px",
                            height: "32px",
                            margin: "0 auto 4px auto",
                          }}
                        ></div>
                        <div
                          className="skeleton-text"
                          style={{
                            width: "60px",
                            height: "16px",
                            margin: "0 auto",
                          }}
                        ></div>
                      </div>
                      <div className="summary-stat-box">
                        <div
                          className="skeleton-text"
                          style={{
                            width: "40px",
                            height: "32px",
                            margin: "0 auto 4px auto",
                          }}
                        ></div>
                        <div
                          className="skeleton-text"
                          style={{
                            width: "50px",
                            height: "16px",
                            margin: "0 auto",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mb-4" style={{ minHeight: "300px" }}>
                <div className="col-7">
                  {/* Work Experience Skeleton */}
                  <div className="project-card1 h-100">
                    <div
                      className="skeleton-text"
                      style={{
                        width: "30%",
                        height: "28px",
                        marginBottom: "16px",
                      }}
                    ></div>
                    <div style={{ flex: 1, overflow: "auto" }}>
                      {[1, 2].map((i) => (
                        <div key={i} className="experience-item mb-3">
                          <div
                            className="skeleton-circle"
                            style={{
                              width: "40px",
                              height: "40px",
                              marginRight: "12px",
                            }}
                          ></div>
                          <div style={{ flex: 1 }}>
                            <div
                              className="skeleton-text"
                              style={{
                                width: "60%",
                                height: "20px",
                                marginBottom: "8px",
                              }}
                            ></div>
                            <div
                              className="skeleton-text"
                              style={{
                                width: "40%",
                                height: "16px",
                                marginBottom: "4px",
                              }}
                            ></div>
                            <div
                              className="skeleton-text"
                              style={{
                                width: "30%",
                                height: "16px",
                                marginBottom: "8px",
                              }}
                            ></div>
                            <div
                              className="skeleton-text"
                              style={{ width: "100%", height: "14px" }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="col-5">
                  {/* Skills & Expertise Skeleton */}
                  <div
                    className="project-card1 h-100"
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <div
                      className="skeleton-text"
                      style={{
                        width: "35%",
                        height: "28px",
                        marginBottom: "16px",
                      }}
                    ></div>
                    <div style={{ flex: 1, overflow: "auto" }}>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="skeleton-text d-inline-block"
                          style={{
                            width: `${Math.random() * 40 + 60}px`,
                            height: "28px",
                            borderRadius: "16px",
                            marginRight: "8px",
                            marginBottom: "8px",
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Portfolio Skeleton */}
              <div className="portfolio-section">
                <div className="portfolio-header mb-3">
                  <div
                    className="skeleton-text"
                    style={{ width: "20%", height: "28px" }}
                  ></div>
                  <div
                    className="skeleton-text"
                    style={{ width: "80px", height: "20px" }}
                  ></div>
                </div>

                <div className="projects-grid premium-portfolio-grid">
                  {[1, 2].map((i) => (
                    <div key={i} className="project-card">
                      <div className="portfolio-content p-3">
                        <div
                          className="skeleton-text"
                          style={{
                            width: "70%",
                            height: "24px",
                            marginBottom: "8px",
                          }}
                        ></div>
                        <div
                          className="skeleton-text"
                          style={{
                            width: "50%",
                            height: "16px",
                            marginBottom: "12px",
                          }}
                        ></div>
                        <div
                          className="skeleton-text"
                          style={{
                            width: "100%",
                            height: "14px",
                            marginBottom: "8px",
                          }}
                        ></div>
                        <div
                          className="skeleton-text"
                          style={{
                            width: "90%",
                            height: "14px",
                            marginBottom: "12px",
                          }}
                        ></div>
                        <div className="portfolio-tags">
                          {[1, 2, 3].map((j) => (
                            <div
                              key={j}
                              className="skeleton-text d-inline-block"
                              style={{
                                width: "60px",
                                height: "24px",
                                borderRadius: "12px",
                                marginRight: "8px",
                              }}
                            ></div>
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
              {/* Action Buttons Skeleton */}
              <div className="sidebar-actions mb-4">
                <div
                  className="skeleton-text"
                  style={{
                    width: "100%",
                    height: "40px",
                    borderRadius: "8px",
                    marginBottom: "8px",
                  }}
                ></div>
                <div
                  className="skeleton-text"
                  style={{
                    width: "100%",
                    height: "40px",
                    borderRadius: "8px",
                    marginBottom: "12px",
                  }}
                ></div>
                <div className="sidebar-links">
                  <div
                    className="skeleton-text"
                    style={{
                      width: "100%",
                      height: "32px",
                      marginBottom: "8px",
                    }}
                  ></div>
                  <div
                    className="skeleton-text"
                    style={{ width: "100%", height: "32px" }}
                  ></div>
                </div>
              </div>

              {/* Quick Information Skeleton */}
              <div className="table-card sidebar-card mb-4">
                <div
                  className="skeleton-text"
                  style={{ width: "50%", height: "24px", marginBottom: "16px" }}
                ></div>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="quick-info-item mb-3">
                    <div
                      className="skeleton-text"
                      style={{
                        width: "60%",
                        height: "16px",
                        marginBottom: "4px",
                      }}
                    ></div>
                    <div
                      className="skeleton-text"
                      style={{ width: "80%", height: "18px" }}
                    ></div>
                  </div>
                ))}
              </div>

              {/* Contact Information Skeleton */}
              <div className="table-card sidebar-card mb-4">
                <div
                  className="skeleton-text"
                  style={{ width: "50%", height: "24px", marginBottom: "16px" }}
                ></div>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="contact-item mb-2">
                    <div
                      className="skeleton-text"
                      style={{ width: "100%", height: "20px" }}
                    ></div>
                  </div>
                ))}
              </div>

              {/* Education Skeleton */}
              <div
                className="table-card sidebar-card h-100"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <div
                  className="skeleton-text"
                  style={{ width: "40%", height: "24px", marginBottom: "16px" }}
                ></div>
                <div style={{ flex: 1, overflow: "auto" }}>
                  {[1, 2].map((i) => (
                    <div key={i} className="interview-item-premium mb-3">
                      <div
                        className="skeleton-circle"
                        style={{
                          width: "32px",
                          height: "32px",
                          marginRight: "12px",
                        }}
                      ></div>
                      <div style={{ flex: 1 }}>
                        <div
                          className="skeleton-text"
                          style={{
                            width: "80%",
                            height: "18px",
                            marginBottom: "4px",
                          }}
                        ></div>
                        <div
                          className="skeleton-text"
                          style={{
                            width: "60%",
                            height: "16px",
                            marginBottom: "4px",
                          }}
                        ></div>
                        <div
                          className="skeleton-text"
                          style={{ width: "40%", height: "14px" }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styleCards}</style>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="edit-modal-overlay">
          <div className="edit-modal">
            <div className="edit-modal-header">
              <h3 className="card-title mb-0">Edit Profile Information</h3>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={handleCloseModal}
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="edit-modal-body">
              <div className="edit-form-grid">
                {/* Salary Range */}
                <div className="form-group">
                  <label htmlFor="expectedSalaryMin" className="auth-label">
                    Expected Salary Range
                  </label>
                  <div className="salary-inputs">
                    <input
                      type="number"
                      id="expectedSalaryMin"
                      name="expectedSalaryMin"
                      className="auth-input"
                      placeholder="Min Salary"
                      value={editFormData.expectedSalaryMin}
                      onChange={handleInputChange}
                    />
                    <span>to</span>
                    <input
                      type="number"
                      id="expectedSalaryMax"
                      name="expectedSalaryMax"
                      className="auth-input"
                      placeholder="Max Salary"
                      value={editFormData.expectedSalaryMax}
                      onChange={handleInputChange}
                    />
                    <select
                      className="auth-input"
                      name="salaryCurrency"
                      style={{ cursor: "pointer" }}
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="INR">INR</option>
                      <option value="CAD">CAD</option>
                    </select>
                  </div>
                </div>

                {/* Notice Period */}
                {/* <div className="form-group">
                  <label htmlFor="noticePeriod" className="auth-label">Notice Period (weeks)</label>
                  <input
                    type="number"
                    id="noticePeriod"
                    name="noticePeriod"
                    className="auth-input"
                    placeholder="Enter notice period in weeks"
                    value={editFormData.noticePeriod}
                    onChange={handleInputChange}
                  />
                </div> */}

                {/* Work Preference */}
                <div className="form-group">
                  <label htmlFor="workPreference" className="auth-label">
                    Work Preference
                  </label>

                  <select
                    id="workPreference"
                    name="workPreference"
                    className="auth-input"
                    style={{ cursor: "pointer" }}
                    value={editFormData.workPreference}
                    onChange={handleInputChange}
                  >
                    <option value="">Select work preference</option>
                    {workPreferenceOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Languages */}
                <div className="form-group full-width">
                  <label className="auth-label">Languages</label>

                  <input
                    className="auth-input w-100"
                    placeholder="Add language and press Enter or ,"
                    value={languageInput}
                    onChange={(e) => setLanguageInput(e.target.value)}
                    onKeyDown={handleAddLanguage}
                  />

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                      marginTop: "12px",
                    }}
                  >
                    {editFormData.languages.map((lang) => (
                      <span
                        key={lang}
                        className="status-tag status-pending"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "12px",
                          padding: "6px 10px",
                        }}
                      >
                        {lang}
                        <X
                          size={12}
                          style={{ cursor: "pointer" }}
                          onClick={() => removeLanguage(lang)}
                        />
                      </span>
                    ))}
                  </div>
                </div>

                {/* Work Authorization - Full Width */}
                <div className="form-group full-width">
                  <label className="auth-label">Work Authorization</label>
                  <div className="checkbox-group">
                    {workAuthOptions.map((option) => (
                      <div key={option.value} className="checkbox-item">
                        <input
                          type="checkbox"
                          id={`auth-${option.value}`}
                          checked={editFormData.workAuthorization.includes(
                            option.value,
                          )}
                          onChange={() => handleWorkAuthChange(option.value)}
                        />
                        <label htmlFor={`auth-${option.value}`}>
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preferred Employment - Full Width */}
                <div className="form-group full-width">
                  <label className="auth-label">Preferred Employment</label>
                  <div className="checkbox-group">
                    {employmentOptions.map((option) => (
                      <div key={option.value} className="checkbox-item">
                        <input
                          type="checkbox"
                          id={`emp-${option.value}`}
                          checked={editFormData.preferredEmployment.includes(
                            option.value,
                          )}
                          onChange={() => handleEmploymentChange(option.value)}
                        />
                        <label htmlFor={`emp-${option.value}`}>
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills - Full Width */}
                <div className="form-group full-width">
                  <label className="auth-label">Skills</label>

                  <input
                    className="auth-input w-100"
                    placeholder="Add skills (e.g. React, Node.js) and press Enter"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                  />

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                      marginTop: "12px",
                    }}
                  >
                    {editFormData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="status-tag status-progress"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "12px",
                          padding: "6px 10px",
                        }}
                      >
                        {skill}
                        <X
                          size={12}
                          style={{ cursor: "pointer" }}
                          onClick={() => removeSkill(skill)}
                        />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="edit-modal-footer">
              <button className="btn btn-secondary" onClick={handleCloseModal}>
                Cancel
              </button>
              <button className="btn-primary gap-1" onClick={handleSave}>
                <FiSave /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

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
            <div className="row mb-2">
              <div className="col-3">
                {/* Profile Header Card */}
                <div className="project-card h-100">
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
                <div
                  className="project-card h-100"
                  style={{
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <h2 className="card-title">Professional Summary</h2>
                  <div className="summary-text-container">
                    <p className="summary-text">{profileData?.summary}</p>
                  </div>

                  {profileData?.stats?.length > 0 && (
                    <div
                      className="summary-stats-grid"
                      style={{ flexShrink: 0 }}
                    >
                      {profileData.stats.map((stat, idx) => (
                        <div key={idx} className="summary-stat-box">
                          <div className="summary-stat-value">{stat.value}</div>
                          <div className="summary-stat-label">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="row" style={{ minHeight: "300px" }}>
              <div className="col-7">
                {/* Work Experience */}
                <div
                  className="project-card1 h-100"
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <h2 className="card-title">Work Experience</h2>
                  <div className="experience-list">
                    {profileData?.workExperience?.length > 0 ? (
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
                      <NoData text="No work experience added yet" />
                    )}
                  </div>
                </div>
              </div>
              <div className="col-5">
                {/* Skills & Expertise */}
                <div
                  className="project-card1 h-100"
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <h2 className="card-title mb-2">Skills & Expertise</h2>
                  <div className="skills-container">
                    {profileData?.skills?.length > 0 ? (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "4px 6px",
                          alignItems: "flex-start",
                        }}
                      >
                        {profileData.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="status-tag status-progress"
                            style={{
                              flex: "0 0 auto",
                              padding: "3px 8px",
                              fontSize: "12px",
                              lineHeight: "1.2",
                            }}
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <NoData text="No skills added yet" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Portfolio */}
            <div
              className="portfolio-section card mb-2"
              style={{ padding: "20px", marginTop: "10px" }}
            >
              <div className="portfolio-header">
                <h2 className="card-title">Projects</h2>
                <span className="portfolio-count">
                  {profileData?.portfolio.length} Projects
                </span>
              </div>

              <div className="projects-grid premium-portfolio-grid">
                {profileData?.portfolio?.length > 0 ? (
                  profileData.portfolio.map((item, idx) => (
                    <div
                      key={idx}
                      className="project-card"
                      style={{ padding: "0px" }}
                    >
                      <div className="portfolio-content">
                        <h3
                          className="portfolio-title"
                          style={{ fontSize: "18px" }}
                        >
                          {item.title}
                        </h3>
                        <div className="small text-muted">
                          {item.role} • {item.period}
                        </div>

                        <div
                          className="mt-2 rounded-2"
                          style={{ background: "#f8fafc", padding: "5px 10px" }}
                        >
                          {item.description && (
                            <p className="small mt-1 mb-0 value">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <div className="portfolio-tags mt-2">
                          {item.tags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="status-tag status-progress"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <NoData text="No projects added yet" />
                )}
              </div>
            </div>

            {/* Job Recommendations Section */}
            <div
              className="card"
              style={{ padding: "20px", marginTop: "20px" }}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="card-title mb-0">Recommended Jobs</h2>
              </div>
              <RecommendedJobs
                navigate={navigate}
                role={profileData?.role}
                skills={profileData?.skills}
              />
            </div>
          </div>

          {/* === RIGHT SIDE COLUMN === */}
          <div className="dashboard-column-side">
            {/* Action Buttons */}
            <div className="sidebar-actions">
              <button
  className="btn-primary w-100"
  onClick={() =>
    navigate("/user/user-jobs", {
      state: { role: profileData?.role },
    })
  }
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

            {/* Quick Information with Edit Button */}
            <div className="table-card sidebar-card">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="card-title mb-0">Quick Information</h3>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={handleEditClick}
                  style={{ padding: "4px 8px", fontSize: "12px" }}
                >
                  <FiEdit2 size={12} /> Edit
                </button>
              </div>

              <div className="quick-info-item">
                <div className="stat-label">Expected Salary</div>
                <div className="info-value">
                  {formatSalary(
                    editFormData.expectedSalaryMin,
                    editFormData.expectedSalaryMax,
                  )}
                </div>
              </div>

              <div className="quick-info-item">
                <div className="stat-label">Notice Period</div>
                <div className="info-value">
                  {editFormData.noticePeriod} weeks
                </div>
              </div>

              <div className="quick-info-item">
                <div className="stat-label">Work Preference</div>
                <div className="info-value">{editFormData.workPreference}</div>
              </div>

              <div className="quick-info-item">
                <div className="stat-label">Work Authorization</div>
                <div className="info-value">
                  {editFormData.workAuthorization.length > 0 ? (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "4px",
                        marginTop: "4px",
                      }}
                    >
                      {editFormData.workAuthorization.map((auth, index) => (
                        <span
                          key={index}
                          className="status-tag status-pending"
                          style={{ fontSize: "11px", padding: "2px 6px" }}
                        >
                          {auth}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted">Not specified</span>
                  )}
                </div>
              </div>

              <div className="quick-info-item">
                <div className="stat-label">Preferred Employment</div>
                <div className="info-value">
                  {editFormData.preferredEmployment.length > 0 ? (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "4px",
                        marginTop: "4px",
                      }}
                    >
                      {editFormData.preferredEmployment.map((emp, index) => (
                        <span
                          key={index}
                          className="status-tag status-progress"
                          style={{ fontSize: "11px", padding: "2px 6px" }}
                        >
                          {emp}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted">Not specified</span>
                  )}
                </div>
              </div>

              <div className="quick-info-item">
                <div className="stat-label">Languages</div>
                <div className="languages-list">
                  {editFormData.languages.map((lang, index) => (
                    <span key={index} className="status-tag status-pending">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="table-card sidebar-card">
              <h3 className="card-title">Contact Information</h3>
              <div className="contact-list">
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
            <div
              className="table-card sidebar-card h-100"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <h3 className="card-title">Education</h3>
              <div className="education-list">
                {profileData?.education?.length > 0 ? (
                  profileData.education.map((edu, index) => (
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
                ) : (
                  <NoData text="No education details added yet" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadTalentProfile;
