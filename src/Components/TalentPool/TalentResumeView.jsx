import React, { useState, useEffect, useMemo } from "react";
import {
  FiX,
  FiMapPin,
  FiBriefcase,
  FiBookOpen,
  FiAward,
  FiLayers,
  FiUser,
  FiLoader,
  FiEdit3,
  FiExternalLink,
  FiDollarSign,
  FiCheckCircle,
} from "react-icons/fi";
import { GiCheckMark } from "react-icons/gi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  useLazyGetEmployeeTalentProfileQuery,
  useGetEmployeeProfessionalDetailsQuery,
  useAddEmployeeProfessionalDetailsMutation,
} from "../../State-Management/Api/TalentPoolApiSlice";
import { useGetCompanyListQuery } from "../../State-Management/Api/CompanyApiSlice";
import { calculateTotalExperience } from "../../Utils/experienceUtils";
import "./TalentResumeView.css";

const TalentResumeView = ({
  isOpen,
  onClose,
  candidate = null,
  candidateId = null,
  onShortlist = null,
  isShortlisted = false,
  loadingShortlistId = null,
  isUploadTalent = false,
}) => {
  const navigate = useNavigate();
  const [isClosing, setIsClosing] = useState(false);
  const [getEmployeeProfile, { data: apiData, isLoading }] = useLazyGetEmployeeTalentProfileQuery();
  const { data: companyList = [] } = useGetCompanyListQuery();

  const activeId = candidateId || candidate?.id || candidate?.employeeID;

  const { data: professionalData } = useGetEmployeeProfessionalDetailsQuery(activeId, {
    skip: !isOpen || !activeId,
    refetchOnMountOrArgChange: true,
  });

  const [addEmployeeProfessionalDetails] = useAddEmployeeProfessionalDetailsMutation();

  const [isInlineEditing, setIsInlineEditing] = useState(false);
  const [editSalaryMin, setEditSalaryMin] = useState("");
  const [editSalaryMax, setEditSalaryMax] = useState("");
  const [editHourlyRate, setEditHourlyRate] = useState("");
  const [editWorkMode, setEditWorkMode] = useState("Available");
  const [editWorkAuth, setEditWorkAuth] = useState("US Citizen");
  const [customSalary, setCustomSalary] = useState(null);
  const [customWorkMode, setCustomWorkMode] = useState(null);

  const isUploadContext = isUploadTalent || (typeof window !== "undefined" && window.location.pathname.toLowerCase().includes("upload-talent"));

  useEffect(() => {
    if (isOpen) {
      setIsInlineEditing(false);
      setCustomSalary(null);
      setCustomWorkMode(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (professionalData) {
      if (professionalData.expectedSalaryMin) setEditSalaryMin(String(professionalData.expectedSalaryMin));
      if (professionalData.expectedSalaryMax) setEditSalaryMax(String(professionalData.expectedSalaryMax));
      if (professionalData.workPreference) setEditWorkMode(professionalData.workPreference);

      const auth = professionalData.isUSCitizen ? "US Citizen" :
                   professionalData.isGreenCard ? "Green Card" :
                   professionalData.isH1B ? "H1B" :
                   professionalData.isEAD ? "EAD" : "US Citizen";
      setEditWorkAuth(auth);
    }
  }, [professionalData]);

  const companyMap = useMemo(() => {
    const map = new Map();
    if (Array.isArray(companyList)) {
      companyList.forEach((c) => {
        if (c.companyId && c.companyName) {
          map.set(String(c.companyId), c.companyName.trim());
        }
      });
    }
    return map;
  }, [companyList]);

  useEffect(() => {
    if (isOpen && activeId) {
      getEmployeeProfile(activeId);
    }
  }, [isOpen, activeId, getEmployeeProfile]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const handleToggleInlineEdit = (e) => {
    e?.stopPropagation();
    if (!isInlineEditing) {
      if (professionalData?.expectedSalaryMin) setEditSalaryMin(String(professionalData.expectedSalaryMin));
      else if (candidate?.expectedSalaryMin) setEditSalaryMin(String(candidate.expectedSalaryMin));

      if (professionalData?.expectedSalaryMax) setEditSalaryMax(String(professionalData.expectedSalaryMax));
      else if (candidate?.expectedSalaryMax) setEditSalaryMax(String(candidate.expectedSalaryMax));

      setEditHourlyRate(candidate?.hourlyRate || "");

      if (professionalData?.workPreference) setEditWorkMode(professionalData.workPreference);
      else setEditWorkMode(candidate?.workPreference || profile.workMode || "Available");

      if (professionalData) {
        const auth = professionalData.isUSCitizen ? "US Citizen" :
                     professionalData.isGreenCard ? "Green Card" :
                     professionalData.isH1B ? "H1B" :
                     professionalData.isEAD ? "EAD" : "US Citizen";
        setEditWorkAuth(auth);
      } else {
        setEditWorkAuth(candidate?.workAuth || "US Citizen");
      }
    }
    setIsInlineEditing((prev) => !prev);
  };

  const handleFullEditProfile = (e) => {
    e?.stopPropagation();
    const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
    navigate(`${basePath}/edit-talent-profile`, {
      state: {
        employeeId: activeId,
        candidate: candidate,
        initialData: apiData || candidate,
      },
    });
  };

  const handleSaveInlineEdit = async () => {
    try {
      const minVal = editSalaryMin ? parseInt(editSalaryMin, 10) : 0;
      const maxVal = editSalaryMax ? parseInt(editSalaryMax, 10) : 0;

      const payload = {
        employeeId: activeId,
        expectedSalaryMin: minVal,
        expectedSalaryMax: maxVal,
        salaryCurrency: "USD",
        workPreference: editWorkMode,
        isUSCitizen: editWorkAuth === "US Citizen",
        isGreenCard: editWorkAuth === "Green Card",
        isH1B: editWorkAuth === "H1B",
        isEAD: editWorkAuth === "EAD",
        isCorpCorp: true,
        isW2Permanent: true,
        isW2Contract: true,
        is1099Contract: false,
        isContractToHire: false,
      };

      if (activeId) {
        await addEmployeeProfessionalDetails(payload).unwrap();
      }

      let formattedSal = "";
      if (editSalaryMin && editSalaryMax) {
        formattedSal = `$${Number(editSalaryMin).toLocaleString()} - $${Number(editSalaryMax).toLocaleString()}/yr`;
      } else if (editHourlyRate) {
        formattedSal = `$${editHourlyRate}/hr`;
      } else if (editSalaryMin) {
        formattedSal = `$${Number(editSalaryMin).toLocaleString()}/yr`;
      }

      if (formattedSal) {
        setCustomSalary(formattedSal);
      }
      if (editWorkMode) {
        setCustomWorkMode(editWorkMode);
      }

      if (candidate) {
        if (editSalaryMin) candidate.expectedSalaryMin = editSalaryMin;
        if (editSalaryMax) candidate.expectedSalaryMax = editSalaryMax;
        if (editHourlyRate) candidate.hourlyRate = editHourlyRate;
        if (editWorkMode) candidate.workPreference = editWorkMode;
        if (editWorkAuth) candidate.workAuth = editWorkAuth;
      }

      toast.success("Work preferences and expected salary updated successfully");
      setIsInlineEditing(false);
    } catch (err) {
      console.error("Failed to update professional details", err);
      toast.error("Failed to update professional details. Please try again.");
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("trv-modal-open");
    } else {
      document.body.classList.remove("trv-modal-open");
    }
    return () => {
      document.body.classList.remove("trv-modal-open");
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const profile = useMemo(() => {
    const rawCompId = apiData?.companyID || apiData?.companyId || candidate?.companyID || candidate?.companyId || candidate?.company_id || candidate?.insertByCompanyId;
    const nameFromCompId = rawCompId ? companyMap.get(String(rawCompId)) : "";
    const rawCompany = candidate?.company || apiData?.companyName || nameFromCompId || apiData?.company || apiData?.currentCompany || apiData?.uploadedCompany;
    const realCompany = (rawCompany && rawCompany.toLowerCase().trim() !== "benmyl") ? rawCompany : "";

    const fullName = `${apiData?.firstName || ""} ${apiData?.lastName || ""}`.trim();
    const nameStr = fullName || candidate?.name || "N/A";
    const roleStr = apiData?.title || candidate?.role || candidate?.title || "N/A";
    const apiLoc = [apiData?.city, apiData?.state].filter(Boolean).join(", ");
    const locStr = apiLoc || candidate?.location || "N/A";

    let expVal = (apiData?.workexperiences && apiData.workexperiences.length > 0)
      ? calculateTotalExperience(apiData.workexperiences)
      : candidate?.experience;
      
    let expStr = "N/A";
    if (expVal !== undefined && expVal !== null && String(expVal).trim() !== "" && String(expVal).trim() !== "0") {
      expStr = `${expVal}${typeof expVal === 'number' || !isNaN(expVal) ? (String(expVal).toLowerCase().includes('yr') || String(expVal).toLowerCase().includes('exp') ? '' : ' Yrs Exp') : ''}`;
    }

    const rawSal = candidate?.hourlyRate || candidate?.salary || apiData?.salary;
    let salaryVal = "N/A";
    if (rawSal !== undefined && rawSal !== null && String(rawSal).trim() !== "" && String(rawSal).trim() !== "0") {
      salaryVal = typeof rawSal === 'number' || !isNaN(rawSal) ? `$${rawSal}/hr` : String(rawSal);
    }

    const rawStatus = (candidate?.availability && candidate.availability.length > 0)
      ? candidate.availability.join(", ")
      : candidate?.status || apiData?.employmentType || apiData?.status;
    const workModeVal = rawStatus || "N/A";

    const bioStr = apiData?.bio || candidate?.bio || candidate?.summary || "N/A";

    let skillsArr = [];
    if (apiData?.skills) {
      skillsArr = apiData.skills.split(",").map((s) => s.trim()).filter(Boolean);
    } else if (candidate?.skills && candidate.skills.length > 0) {
      skillsArr = candidate.skills.filter(Boolean);
    }

    const rawWorkExp = apiData?.workexperiences || candidate?.workexperiences || candidate?.workExperience;
    let workExpList = [];
    if (Array.isArray(rawWorkExp) && rawWorkExp.length > 0) {
      workExpList = rawWorkExp.map((w) => {
        const comp = w.companyName || w.company;
        const validComp = (comp && comp.toLowerCase().trim() !== "benmyl") ? comp : (realCompany || "N/A");
        const start = w.startDate ? w.startDate.slice(0, 4) : "";
        const end = w.endDate ? w.endDate.slice(0, 4) : "Present";
        const periodStr = start ? `${start} - ${end}` : (w.period || "N/A");
        return {
          position: w.position || w.role || "N/A",
          company: validComp,
          period: periodStr,
          location: w.city || w.location || locStr,
          description: w.description || w.desc || "N/A",
        };
      });
    } else if (realCompany || (expStr !== "N/A" && roleStr !== "N/A")) {
      workExpList = [{
        position: roleStr,
        company: realCompany || "N/A",
        period: expStr,
        location: locStr,
        description: "N/A",
      }];
    }

    const rawEdu = apiData?.employee_Heighers || apiData?.educations || candidate?.educations || candidate?.educationList;
    let educationList = [];
    if (Array.isArray(rawEdu) && rawEdu.length > 0) {
      educationList = rawEdu.map((edu) => ({
        qualification: edu.highestQualification || edu.degree || "N/A",
        field: edu.fieldofstudy || edu.field || "N/A",
        university: edu.university || edu.school || "N/A",
        period: edu.startDate ? `${edu.startDate.slice(0, 4)} - ${edu.endDate ? edu.endDate.slice(0, 4) : 'N/A'}` : (edu.period || edu.year || "N/A"),
      }));
    } else if (candidate?.education || candidate?.highestQualification) {
      educationList = [{
        qualification: candidate.education || candidate.highestQualification,
        field: "N/A",
        university: "N/A",
        period: "N/A",
      }];
    }

    const rawProjs = apiData?.employeeprojects || candidate?.projects;
    let projectsList = [];
    if (Array.isArray(rawProjs) && rawProjs.length > 0) {
      projectsList = rawProjs.map((p) => ({
        title: p.projectName || p.title || "N/A",
        role: p.role || "N/A",
        description: p.description || "N/A",
        tags: p.skills ? p.skills.split(",").map((s) => s.trim()).filter(Boolean) : (p.tags || []),
      }));
    }

    return {
      name: nameStr,
      role: roleStr,
      location: locStr,
      company: realCompany,
      experience: expStr,
      salary: salaryVal,
      workMode: workModeVal,
      bio: bioStr,
      skills: skillsArr,
      status: candidate?.status || apiData?.status || "AVAILABLE",
      workExperiences: workExpList,
      education: educationList,
      projects: projectsList,
    };
  }, [apiData, candidate, companyMap]);

  const displaySalary = useMemo(() => {
    if (customSalary) return customSalary;
    if (professionalData?.expectedSalaryMin && professionalData?.expectedSalaryMax) {
      return `$${Number(professionalData.expectedSalaryMin).toLocaleString()} - $${Number(professionalData.expectedSalaryMax).toLocaleString()}/yr`;
    } else if (professionalData?.expectedSalaryMin) {
      return `$${Number(professionalData.expectedSalaryMin).toLocaleString()}/yr`;
    }
    return profile.salary;
  }, [customSalary, professionalData, profile.salary]);

  const displayWorkMode = useMemo(() => {
    if (customWorkMode) return customWorkMode;
    if (professionalData?.workPreference) return professionalData.workPreference;
    return profile.workMode;
  }, [customWorkMode, professionalData, profile.workMode]);

  if (!isOpen && !isClosing) return null;

  return (
    <div
      className={`trv-overlay ${isOpen && !isClosing ? "open" : ""}`}
      onClick={handleClose}
    >
      <div className={`trv-panel ${isInlineEditing ? "expanded" : ""}`} onClick={(e) => e.stopPropagation()}>
        {/* Top Header Control Bar */}
        <div className="trv-header-bar">
          <div className="trv-header-title-block">
            <span className="trv-badge">Profile Overview</span>
            <h3 className="trv-header-title">{profile.role}</h3>
          </div>
          <div className="trv-actions">
            <button
              className="trv-close-btn"
              title="Close Resume View"
              onClick={handleClose}
            >
              <FiX size={18} />
            </button>
          </div>
        </div>

        {/* Split Body Container */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative" }}>
          {/* Left Side: Candidate Formal Resume */}
          <div className="trv-body" style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
            {isLoading ? (
              <div className="trv-loading-container">
                <FiLoader size={24} className="spin-icon" />
                <span className="trv-loading-text">Loading Candidate Profile Details...</span>
              </div>
            ) : (
              <div className="trv-paper">
                <div className="trv-paper-header">
                  <div>
                    <h1 className="trv-candidate-name">{profile.name}</h1>
                    <p className="trv-candidate-role">{profile.role}</p>

                    <div className="trv-contact-grid">
                      <div className="trv-contact-item">
                        <FiMapPin size={13} />
                        <span>{profile.location}</span>
                      </div>
                      <div className="trv-contact-item">
                        <FiBriefcase size={13} />
                        <span>{profile.experience}</span>
                      </div>
                      {profile.company && (
                        <div className="trv-contact-item">
                          <FiUser size={13} />
                          <span>{profile.company}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <span className="job-chip mint trv-status-chip">
                    {profile.status}
                  </span>
                </div>

                <div className="trv-section">
                  <h4 className="trv-section-title">
                    <FiUser size={14} /> Professional Summary
                  </h4>
                  <p className="trv-summary-text">{profile.bio}</p>
                </div>

                <div className="trv-section">
                  <h4 className="trv-section-title">
                    <FiAward size={14} /> Core Competencies & Skills
                  </h4>
                  <div className="trv-skills-list">
                    {profile.skills.length > 0 ? (
                      profile.skills.map((skill, index) => (
                        <span key={index} className="trv-skill-chip">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="trv-na-text">N/A</span>
                    )}
                  </div>
                </div>

                <div className="trv-section">
                  <h4 className="trv-section-title">
                    <FiBriefcase size={14} /> Professional Work Experience
                  </h4>
                  {profile.workExperiences.length > 0 ? (
                    <div className="trv-timeline">
                      {profile.workExperiences.map((item, index) => (
                        <div key={index} className="trv-timeline-item">
                          <div className="trv-item-header">
                            <h5 className="trv-item-title">{item.position}</h5>
                            <span className="trv-item-date">{item.period}</span>
                          </div>
                          {item.company && item.company !== "N/A" && (
                            <div className="trv-item-company">{item.company} • {item.location}</div>
                          )}
                          {item.description && item.description !== "N/A" && (
                            <p className="trv-item-desc">{item.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="trv-na-text">N/A</span>
                  )}
                </div>

                <div className="trv-section">
                  <h4 className="trv-section-title">
                    <FiLayers size={14} /> Key Projects & Portfolio
                  </h4>
                  {profile.projects.length > 0 ? (
                    <div className="trv-timeline">
                      {profile.projects.map((proj, index) => (
                        <div key={index} className="trv-timeline-item">
                          <div className="trv-item-header">
                            <h5 className="trv-item-title">{proj.title}</h5>
                            <span className="trv-item-date">{proj.role}</span>
                          </div>
                          {proj.description && proj.description !== "N/A" && (
                            <p className="trv-item-desc">{proj.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="trv-na-text">N/A</span>
                  )}
                </div>

                <div className="trv-section">
                  <h4 className="trv-section-title">
                    <FiBookOpen size={14} /> Education & Credentials
                  </h4>
                  {profile.education.length > 0 ? (
                    <div className="trv-timeline">
                      {profile.education.map((edu, index) => (
                        <div key={index} className="trv-timeline-item">
                          <div className="trv-item-header">
                            <h5 className="trv-item-title">
                              {edu.qualification}
                              {edu.field && edu.field !== "N/A" ? ` - ${edu.field}` : ''}
                            </h5>
                            <span className="trv-item-date">{edu.period}</span>
                          </div>
                          {edu.university && edu.university !== "N/A" && (
                            <div className="trv-item-company">{edu.university}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="trv-na-text">N/A</span>
                  )}
                </div>

                <div className="trv-paper-footer">
                  <span>Verified Candidate Profile</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Quick Edit Sidebar Panel */}
          {isInlineEditing && (
            <div
              className="trv-edit-sidebar"
              style={{
                width: "460px",
                flexShrink: 0,
                background: "#f8fafc",
                borderLeft: "1px solid #e2e8f0",
                padding: "24px",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "16px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px" }}>
                <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: "6px" }}>
                  <FiEdit3 size={16} color="#3b82f6" /> Quick Edit Details
                </h4>
                <button
                  onClick={() => setIsInlineEditing(false)}
                  style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <FiX size={16} /> Close
                </button>
              </div>

              {/* SECTION 1: Expected Salary & Rate */}
              <div style={{ background: "#ffffff", padding: "16px", borderRadius: "10px", border: "1px solid #cbd5e1", display: "flex", flexDirection: "column", gap: "12px" }}>
                <h6 style={{ margin: 0, fontSize: "11.5px", fontWeight: 700, color: "#1e293b", textTransform: "uppercase", letterSpacing: "0.03em", display: "flex", alignItems: "center", gap: "6px" }}>
                  <FiDollarSign size={13} color="#2563eb" /> Expected Salary & Rates
                </h6>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#475569", marginBottom: "4px" }}>
                      Salary Min ($/yr)
                    </label>
                    <input
                      type="number"
                      value={editSalaryMin}
                      onChange={(e) => setEditSalaryMin(e.target.value)}
                      placeholder="e.g. 80000"
                      style={{ width: "100%", padding: "7px 10px", fontSize: "12px", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#475569", marginBottom: "4px" }}>
                      Salary Max ($/yr)
                    </label>
                    <input
                      type="number"
                      value={editSalaryMax}
                      onChange={(e) => setEditSalaryMax(e.target.value)}
                      placeholder="e.g. 110000"
                      style={{ width: "100%", padding: "7px 10px", fontSize: "12px", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#475569", marginBottom: "4px" }}>
                    Hourly Rate ($/hr)
                  </label>
                  <input
                    type="text"
                    value={editHourlyRate}
                    onChange={(e) => setEditHourlyRate(e.target.value)}
                    placeholder="e.g. 60"
                    style={{ width: "100%", padding: "7px 10px", fontSize: "12px", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none" }}
                  />
                </div>
              </div>

              {/* SECTION 2: Work Preferences & Authorization */}
              <div style={{ background: "#ffffff", padding: "16px", borderRadius: "10px", border: "1px solid #cbd5e1", display: "flex", flexDirection: "column", gap: "12px" }}>
                <h6 style={{ margin: 0, fontSize: "11.5px", fontWeight: 700, color: "#1e293b", textTransform: "uppercase", letterSpacing: "0.03em", display: "flex", alignItems: "center", gap: "6px" }}>
                  <FiBriefcase size={13} color="#2563eb" /> Work Preferences & Auth
                </h6>

                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#475569", marginBottom: "4px" }}>
                    Work Preference / Model
                  </label>
                  <select
                    value={editWorkMode}
                    onChange={(e) => setEditWorkMode(e.target.value)}
                    style={{ width: "100%", padding: "7px 10px", fontSize: "12px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#fff", outline: "none" }}
                  >
                    <option value="Available">Available</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#475569", marginBottom: "4px" }}>
                    Work Authorization
                  </label>
                  <select
                    value={editWorkAuth}
                    onChange={(e) => setEditWorkAuth(e.target.value)}
                    style={{ width: "100%", padding: "7px 10px", fontSize: "12px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#fff", outline: "none" }}
                  >
                    <option value="US Citizen">US Citizen</option>
                    <option value="Green Card">Green Card</option>
                    <option value="H1B">H1B</option>
                    <option value="EAD">EAD</option>
                    <option value="TN Visa">TN Visa</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons in Right Edit Sidebar */}
              <div style={{ marginTop: "auto", paddingTop: "16px", borderTop: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "10px" }}>
                <button
                  onClick={handleSaveInlineEdit}
                  style={{ width: "100%", padding: "9px", fontSize: "12px", fontWeight: 700, borderRadius: "8px", border: "none", background: "#2563eb", color: "#fff", cursor: "pointer", boxShadow: "0 2px 6px rgba(37, 99, 235, 0.25)" }}
                >
                  Save Changes
                </button>

                <button
                  onClick={handleFullEditProfile}
                  style={{ width: "100%", padding: "8px", fontSize: "11.5px", fontWeight: 600, borderRadius: "8px", border: "1px solid #bfdbfe", background: "#eff6ff", color: "#1d4ed8", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "5px" }}
                >
                  <FiExternalLink size={13} /> Go to Full Profile Edit Page
                </button>
              </div>
            </div>
          )}
        </div>

        {/* STICKY FOOTER BAR */}
        <div className="trv-footer-bar">
          <div className="trv-footer-meta">
            <div className="trv-meta-item">
              <span className="trv-meta-label">Expected Salary:</span>
              <span className="trv-meta-value">{displaySalary}</span>
            </div>
            <div className="trv-meta-divider">•</div>
            <div className="trv-meta-item">
              <span className="trv-meta-label">Work Model:</span>
              <span className="trv-meta-value">{displayWorkMode}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isUploadContext && (
              <>
                <button
                  onClick={handleToggleInlineEdit}
                  className="btn-v2-secondary"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "7px 14px",
                    fontSize: "10.5px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    color: "#334155",
                    cursor: "pointer"
                  }}
                >
                  <FiEdit3 size={13} /> {isInlineEditing ? "Cancel Quick Edit" : "Quick Edit"}
                </button>

                <button
                  onClick={handleFullEditProfile}
                  className="btn-v2-secondary"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "7px 14px",
                    fontSize: "10.5px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    color: "#0f172a",
                    cursor: "pointer"
                  }}
                >
                  <FiExternalLink size={13} /> Full Edit
                </button>
              </>
            )}

            {onShortlist && candidate && (
              <button
                onClick={() => onShortlist(candidate)}
                className={isShortlisted ? "btn-v2-primary shortlisted" : "btn-v2-primary"}
                disabled={loadingShortlistId === candidate.id}
              >
                {loadingShortlistId === candidate.id ? (
                  <span className="d-flex align-items-center gap-1 justify-content-center">
                    <FiLoader size={10} className="spin-icon" /> {isUploadContext ? "Selecting" : "Shortlisting"}
                  </span>
                ) : isShortlisted ? (
                  <span className="d-flex align-items-center gap-1 justify-content-center">
                    <GiCheckMark size={10} /> Selected
                  </span>
                ) : (
                  isUploadContext ? "Select" : "Shortlist"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalentResumeView;
