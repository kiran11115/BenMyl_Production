import React, { useEffect, useState } from 'react';
import {
  Briefcase, MapPin, DollarSign, Monitor,
  FileText, X, Building2, Check, ChevronDown
} from 'lucide-react';
import { FiArrowLeft } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import JobTitleAutocomplete from './JobTitleAutocomplete';
import PreviewModal from './PreviewModal';
import {
  useGenerateJobDescriptionAIMutation,
  usePostJobMutation,
  useSaveJobDraftMutation
} from '../../State-Management/Api/ProjectApiSlice';

import '../Dashboard/Dashboard.css';
import '../Auth/Auth.css';
import './PostNewPositions.css';

/* =========================
   VALIDATION SCHEMA
========================= */
const validationSchema = Yup.object().shape({
  jobTitle: Yup.string().required("Job Title is required"),
  companyName: Yup.string().required("Company Name is required"),
  location: Yup.string().required("Location is required"),
  employmentType: Yup.string().required("Employment Type is required"),
  salaryMin: Yup.number().typeError("Enter valid amount").required("Required"),
  salaryMax: Yup.number()
    .typeError("Enter valid amount")
    .when('salaryType', {
      is: (val) => val !== 'entireBudget',
      then: (schema) => schema
        .required("Required")
        .moreThan(Yup.ref("salaryMin"), "Must be greater than Min"),
      otherwise: (schema) => schema.notRequired()
    }),
  description: Yup.string().min(20, "Minimum 20 characters").required("Required"),
  workModel: Yup.string().required("Required"),
  department: Yup.string().required("Required"),
  experienceLevel: Yup.string().required("Required"),
  educationLevel: Yup.string().required("Required"),
  yearsExperience: Yup.number().typeError("Enter number").required("Required"),
});

const PostNewPositions = () => {
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState([]);
  const [generateAI, { isLoading: isAiLoading }] =
    useGenerateJobDescriptionAIMutation();
  const location = useLocation();
  const editData = location.state?.jobData;
  const isEdit = location.state?.isEdit;
  const JobID = location.state?.jobId;
  console.log("JobID:", JobID)

  // Work Authorization states
  const [workAuthorization, setWorkAuthorization] = useState({
    Citizenship: false,
    GC: false,
    H1B: false,
    EAD: false,
    OPT: false,
    CPT: false,
    H4: false
  });

  // Preferred Employment states
  const [preferredEmployment, setPreferredEmployment] = useState({
    "Corp-Corp": false,
    "W2-Permanent": false,
    "W2-Contract": false,
    "1099-Contract": false,
    "Contract to Hire": false
  });

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isEmpOpen, setIsEmpOpen] = useState(false);



  const [postJob] = usePostJobMutation();
  const [saveJobDraft] = useSaveJobDraftMutation();
  const user = localStorage.getItem("CompanyId");
  const companyname = localStorage.getItem("CompanyName");

  /* =========================
     FORMIK
  ========================= */
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      jobTitle: editData?.jobTitle || '',
      companyName: editData?.companyName || companyname,
      location: editData?.location || '',
      employmentType: editData?.employeeType || '',
      workModel: editData?.workModels || '',
      jobDuration: editData?.jobDuration || '',
      salaryMin: editData?.salaryRange_Min || '',
      salaryMax: editData?.salaryRange_Max || '',
      salaryCurrency: 'USD',
      salaryType: editData?.salarType || 'perHour',
      description: editData?.jobDescription || '',
      department: editData?.department || '',
      experienceLevel: editData?.experienceLevel || '',
      educationLevel: editData?.educationLevel || '',
      yearsExperience: editData?.yearsOfExperience || '',
      additionalReqs: editData?.additionalRequirements || '',
    },
    validationSchema,
    // ✅ ONLY OPEN PREVIEW
    onSubmit: () => {
      setShowPreview(true);
    },
  });

  /* =========================
     POST JOB (API CALL)
  ========================= */
  const handlePostJob = async () => {
    if (!user) {
      alert("User session expired. Please login again.");
      return;
    }

    const fd = new FormData();

    fd.append("JobID", isEdit ? JobID : 0);
    fd.append("userid", user);

    fd.append("JobTitle", formik.values.jobTitle);
    fd.append("CompanyName", formik.values.companyName);
    fd.append("Location", formik.values.location);
    fd.append("EmployeeType", formik.values.employmentType);

    fd.append("SalaryRange_min", formik.values.salaryMin);
    fd.append("SalaryRange_max", formik.values.salaryMax);
    fd.append("salaryUSD", formik.values.salaryCurrency === "USD" ? 1 : 0);

    fd.append("JobDescription", formik.values.description);
    fd.append("jobdetails", formik.values.description);

    fd.append("WorkModels", formik.values.workModel);
    fd.append("department", formik.values.department);
    fd.append("ExperienceLevel", formik.values.experienceLevel);
    fd.append("EducationLevel", formik.values.educationLevel);
    fd.append("YearsofExperience", formik.values.yearsExperience);

    fd.append("RequiredSkills", skills.join(","));
    fd.append("AdditionalRequirements", formik.values.additionalReqs);

    fd.append("CreatedBy", "Admin");
    fd.append("IsDraft", false);
    fd.append("CreatedOn", new Date().toISOString());
    // 🔹 Work Authorization
    fd.append("IsUSCitizen", workAuthorization.Citizenship);
    fd.append("IsGC", workAuthorization.GC);
    fd.append("IsH1B", workAuthorization.H1B);
    fd.append("IsEAD", workAuthorization.EAD);
    fd.append("IsOPT", workAuthorization.OPT);
    fd.append("IsCPT", workAuthorization.CPT);
    fd.append("IsH4", workAuthorization.H4);

    // 🔹 Preferred Employment
    fd.append("IsCorpToCorp", preferredEmployment["Corp-Corp"]);
    fd.append("IsW2Permanent", preferredEmployment["W2-Permanent"]);
    fd.append("IsW2Contract", preferredEmployment["W2-Contract"]);
    fd.append("Is1099Contract", preferredEmployment["1099-Contract"]);
    fd.append("IsContractToHire", preferredEmployment["Contract to Hire"]);
    fd.append("SalarType", formik.values.salaryType);
    fd.append("JobDuration", formik.values.jobDuration);


    try {
      await postJob(fd).unwrap();
    } catch (err) {
      console.error(err);
      throw err; // 🔥 VERY IMPORTANT
    }
  };

  const handleSaveDraft = async () => {
    const fd = new FormData();

    fd.append("JobID", 0);
    fd.append("userid", user);
    fd.append("JobTitle", formik.values.jobTitle);
    fd.append("CompanyName", formik.values.companyName);
    fd.append("Location", formik.values.location);
    fd.append("EmployeeType", formik.values.employmentType);
    fd.append("SalaryRange_min", formik.values.salaryMin || 0);
    fd.append("SalaryRange_max", formik.values.salaryMax || 0);
    fd.append("salaryUSD", formik.values.salaryCurrency === "USD" ? 1 : 0);
    fd.append("JobDescription", formik.values.description);
    fd.append("jobdetails", formik.values.description);
    fd.append("WorkModels", formik.values.workModel);
    fd.append("department", formik.values.department);
    fd.append("ExperienceLevel", formik.values.experienceLevel);
    fd.append("EducationLevel", formik.values.educationLevel);
    fd.append("YearsofExperience", formik.values.yearsExperience || 0);
    fd.append("RequiredSkills", skills.join(","));
    fd.append("AdditionalRequirements", formik.values.additionalReqs);

    fd.append("CreatedBy", "Admin");
    fd.append("IsDraft", true);
    fd.append("CreatedOn", new Date().toISOString());
    // 🔹 Work Authorization
    fd.append("IsUSCitizen", workAuthorization.Citizenship);
    fd.append("IsGC", workAuthorization.GC);
    fd.append("IsH1B", workAuthorization.H1B);
    fd.append("IsEAD", workAuthorization.EAD);
    fd.append("IsOPT", workAuthorization.OPT);
    fd.append("IsCPT", workAuthorization.CPT);
    fd.append("IsH4", workAuthorization.H4);

    // 🔹 Preferred Employment
    fd.append("IsCorpToCorp", preferredEmployment["Corp-Corp"]);
    fd.append("IsW2Permanent", preferredEmployment["W2-Permanent"]);
    fd.append("IsW2Contract", preferredEmployment["W2-Contract"]);
    fd.append("Is1099Contract", preferredEmployment["1099-Contract"]);
    fd.append("IsContractToHire", preferredEmployment["Contract to Hire"]);


    try {
      await saveJobDraft(fd).unwrap();
      alert("Draft saved successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to save draft");
    }
  };

  useEffect(() => {
    if (!editData) return;

    /* ======================
       Skills Binding
    ====================== */
    if (editData.requiredSkills) {
      setSkills(editData.requiredSkills.split(","));
    }

    /* ======================
       Employment Type Binding
    ====================== */
    if (editData.employeeType) {
      const types = editData.employeeType.split(",");

      const updatedEmployment = {
        "Corp-Corp": false,
        "W2-Permanent": false,
        "W2-Contract": false,
        "1099-Contract": false,
        "Contract to Hire": false
      };

      types.forEach(type => {
        const trimmed = type.trim();
        if (updatedEmployment.hasOwnProperty(trimmed)) {
          updatedEmployment[trimmed] = true;
        }
      });

      setPreferredEmployment(updatedEmployment);

      formik.setFieldValue("employmentType", editData.employeeType);
    }

    /* ======================
       Work Authorization Binding
    ====================== */
    setWorkAuthorization({
      Citizenship: editData?.isUSCitizen || false,
      GC: editData?.isGC || false,
      H1B: editData?.isH1B || false,
      EAD: editData?.isEAD || false,
      OPT: editData?.isOPT || false,
      CPT: editData?.isCPT || false,
      H4: editData?.isH4 || false
    });

  }, [editData]);

  const handleGenerateAI = async () => {
    const selectedEmpTypes = Object.entries(preferredEmployment)
      .filter(([_, v]) => v)
      .map(([k]) => k)
      .join(", ");

    const isAnyEmpTypeSelected = selectedEmpTypes.length > 0;

    if (
      !formik.values.jobTitle ||
      !formik.values.companyName ||
      !isAnyEmpTypeSelected ||
      !formik.values.workModel ||
      !formik.values.educationLevel ||
      !formik.values.yearsExperience ||
      skills.length === 0
    ) {
      alert("Please enter All Required Fields (Job Title, Company, Employment Type, Work Model, Education, Experience, and at least one Skill)");
      return;
    }

    try {
      const payload = {
        jobTitle: formik.values.jobTitle,
        companyName: formik.values.companyName,
        employmentType: selectedEmpTypes,
        workModel: formik.values.workModel,
        education: formik.values.educationLevel,
        experienceYears: formik.values.yearsExperience,
        skills: skills,
      };

      const res = await generateAI(payload).unwrap();
      let cleanedDescription = res?.description || res;

      if (typeof cleanedDescription === 'string') {
        cleanedDescription = cleanedDescription
          .replace(/Job Description:\s*/gi, '')
          .replace(/Required Skills:\s*/gi, '')
          .trim();
      }

      formik.setFieldValue("description", cleanedDescription);

    } catch (err) {
      console.error(err);
      alert("Failed to generate AI description");
    }
  };


  /* =========================
     SKILLS
  ========================= */
  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setSkills(skills.filter(s => s !== skill));
  };


  const modalData = {
    ...formik.values,
    skills,
    currency: formik.values.salaryCurrency,
    additional: formik.values.additionalReqs,
    workAuthorization: {
      usCitizen: workAuthorization.Citizenship,
      gc: workAuthorization.GC,
      h1b: workAuthorization.H1B,
      ead: workAuthorization.EAD || workAuthorization.OPT || workAuthorization.CPT || workAuthorization.H4
    },
    preferredEmployment: {
      corpCorp: preferredEmployment["Corp-Corp"],
      w2Permanent: preferredEmployment["W2-Permanent"],
      w2Contract: preferredEmployment["W2-Contract"],
      contract1099: preferredEmployment["1099-Contract"],
      contractToHire: preferredEmployment["Contract to Hire"]
    }
  };

  const err = (name) =>
    formik.touched[name] && formik.errors[name] && (
      <div className="auth-error">{formik.errors[name]}</div>
    );
  return (
    <form onSubmit={formik.handleSubmit} className="post-job-form">
      {/* HEADER */}
      <div className="form-header">
        <div className="vs-breadcrumbs mb-2 mt-3 d-flex gap-2">
          <button type="button" className="link-button" onClick={() => navigate("/user/user-dashboard")}>
            <FiArrowLeft /> Back to Dashboard
          </button>
          <span className="crumb">/ Job Posting</span>
        </div>

        <h1>
          {isEdit ? "Edit Job Posting" : "Creating New Job Posting"}
        </h1>
        <p className="muted">
          Here's what's happening with your projects today
        </p>
      </div>

      <div className="dashboard-layout">

        {/* ================= MAIN FORM ================= */}
        <div className="dashboard-column-main">
          <div className="premium-card">

            {/* BASIC INFO */}
            <div style={{ marginBottom: '40px' }}>
              <div className="section-header">
                <h3>Basic Information</h3>
              </div>

              <div className="grid-4">
                <div>
                  <label className="auth-label">Job Title<span style={{ color: '#ef4444' }}> *</span></label>
                  <JobTitleAutocomplete
                    name="jobTitle"
                    value={formik.values.jobTitle}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={err("jobTitle")}
                  />
                </div>

                <div>
                  <label className="auth-label">Duration</label>
                  <select className="auth-input" name="jobDuration"
                    value={formik.values.jobDuration} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                    <option value="">Select duration</option>
                    <option value="1">1 Month</option>
                    <option value="3">3 Months</option>
                    <option value="6">6 Months</option>
                    <option value="12">1 Year</option>
                    <option value="0">Ongoing</option>
                  </select>
                  {err("jobDuration")}
                </div>

                <div>
                  <label className="auth-label">Location<span style={{ color: '#ef4444' }}> *</span></label>
                  <input className="auth-input" name="location" placeholder="City, State"
                    value={formik.values.location} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                  {err("location")}
                </div>

                <div>
                  <label className="auth-label">Company<span style={{ color: '#ef4444' }}> *</span></label>
                  <input className="auth-input bg-light" name="companyName" placeholder="Company"
                    value={formik.values.companyName} onChange={formik.handleChange} onBlur={formik.handleBlur} disabled style={{ cursor: "not-allowed" }} />
                  {err("companyName")}
                </div>
              </div>

              <div className="grid-3">
                <div>
                  <label className="auth-label">Employment Type<span style={{ color: '#ef4444' }}> *</span></label>
                  <div className="vendor-section">
                    <div className="auth-input" onClick={() => setIsEmpOpen(!isEmpOpen)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                      <span>Select Type</span>
                      <ChevronDown size={16} className={`chevron ${isEmpOpen ? 'rotate' : ''}`} />
                    </div>
                    {isEmpOpen && (
                      <div className="vendor-list">
                        {Object.keys(preferredEmployment).map(type => (
                          <label key={type} className="checkbox-row">
                            <input
                              type="checkbox"
                              checked={preferredEmployment[type]}
                              onChange={() => {
                                const nextState = { ...preferredEmployment, [type]: !preferredEmployment[type] };
                                setPreferredEmployment(nextState);

                                // Keep Formik in sync for validation and AI
                                const selected = Object.entries(nextState)
                                  .filter(([_, v]) => v)
                                  .map(([k]) => k)
                                  .join(", ");
                                formik.setFieldValue("employmentType", selected);
                              }}
                            />
                            {type}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="modal-tags-row" style={{ marginTop: '8px' }}>
                    {Object.entries(preferredEmployment)
                      .filter(([_, v]) => v)
                      .map(([k]) => (
                        <span key={k} className="status-tag status-progress">{k}</span>
                      ))}
                  </div>
                  {err("employmentType")}
                </div>

                <div>
                  <label className="auth-label">Work Authorization</label>
                  <div className="vendor-section">
                    <div className="auth-input" onClick={() => setIsAuthOpen(!isAuthOpen)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                      <span>Select Work Autherization</span>
                      <ChevronDown size={16} className={`chevron ${isAuthOpen ? 'rotate' : ''}`} />
                    </div>
                    {isAuthOpen && (
                      <div className="vendor-list">
                        {Object.keys(workAuthorization).map(auth => (
                          <label key={auth} className="checkbox-row">
                            <input
                              type="checkbox"
                              checked={workAuthorization[auth]}
                              onChange={() => setWorkAuthorization(prev => ({ ...prev, [auth]: !prev[auth] }))}
                            />
                            {auth}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="modal-tags-row" style={{ marginTop: '8px' }}>
                    {Object.entries(workAuthorization)
                      .filter(([_, v]) => v)
                      .map(([k]) => (
                        <span key={k} className="status-tag status-progress">{k}</span>
                      ))}
                  </div>
                </div>

                <div>
                  <label className="auth-label">Salary Range<span style={{ color: '#ef4444' }}> *</span></label>
                  <div className="salary-radio-group" style={{ padding: '8px', gap: '8px' }}>
                    <label className="salary-radio-item" style={{ fontSize: '11px' }}>
                      <input type="radio" name="salaryType" value="perHour" checked={formik.values.salaryType === 'perHour'} onChange={formik.handleChange} />
                      Hourly
                    </label>
                    <label className="salary-radio-item" style={{ fontSize: '11px' }}>
                      <input type="radio" name="salaryType" value="perMonth" checked={formik.values.salaryType === 'perMonth'} onChange={formik.handleChange} />
                      Monthly
                    </label>
                    <label className="salary-radio-item" style={{ fontSize: '11px' }}>
                      <input type="radio" name="salaryType" value="entireBudget" checked={formik.values.salaryType === 'entireBudget'} onChange={formik.handleChange} />
                      Fixed
                    </label>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: formik.values.salaryType === 'entireBudget' ? '1fr 60px' : '1fr 1fr 60px', gap: '8px' }}>
                    {formik.values.salaryType === 'entireBudget' ? (
                      <input className="auth-input" name="salaryMin" placeholder="Budget" value={formik.values.salaryMin} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    ) : (
                      <>
                        <input className="auth-input" name="salaryMin" placeholder="Min" value={formik.values.salaryMin} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        <input className="auth-input" name="salaryMax" placeholder="Max" value={formik.values.salaryMax} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                      </>
                    )}
                    <select className="auth-input" name="salaryCurrency" value={formik.values.salaryCurrency} onChange={formik.handleChange} style={{ padding: '10px 4px' }}>
                      <option>USD</option>
                      <option>EUR</option>
                    </select>
                  </div>
                  {err("salaryMin")}
                  {err("salaryMax")}
                </div>
              </div>
            </div>



            {/* JOB DETAILS & REQUIREMENTS */}
            <div style={{ marginBottom: '40px' }}>
              <div className="section-header">
                <h3>Job Details & Requirements</h3>
              </div>

              <div className="grid-4">
                <div>
                  <label className="auth-label">Work Model<span style={{ color: '#ef4444' }}> *</span></label>
                  <select className="auth-input" name="workModel" value={formik.values.workModel} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                    <option value="">Select model</option>
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                  {err("workModel")}
                </div>

                <div>
                  <label className="auth-label">Department<span style={{ color: '#ef4444' }}> *</span></label>
                  <select className="auth-input" name="department" value={formik.values.department} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                    <option value="">Select department</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Product">Product</option>
                  </select>
                  {err("department")}
                </div>

                <div>
                  <label className="auth-label">Experience<span style={{ color: '#ef4444' }}> *</span></label>
                  <select className="auth-input" name="experienceLevel" value={formik.values.experienceLevel} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                    <option value="">Select level</option>
                    <option value="Junior">Junior</option>
                    <option value="Mid-Level">Mid-Level</option>
                    <option value="Senior">Senior</option>
                  </select>
                  {err("experienceLevel")}
                </div>

                <div>
                  <label className="auth-label">Education<span style={{ color: '#ef4444' }}> *</span></label>
                  <select className="auth-input" name="educationLevel" value={formik.values.educationLevel} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                    <option value="">Select education</option>
                    <option value="Bachelors">Bachelor's</option>
                    <option value="Masters">Master's</option>
                  </select>
                  {err("educationLevel")}
                </div>
              </div>

              <div className="grid-2">
                <div>
                  <label className="auth-label">Years of Experience<span style={{ color: '#ef4444' }}> *</span></label>
                  <div className="auth-password-wrapper">
                    <input
                      className="auth-input"
                      name="yearsExperience"
                      placeholder="e.g. 3"
                      style={{ paddingLeft: '2.5rem' }}
                      value={formik.values.yearsExperience}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <FileText
                      size={16}
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#94a3b8'
                      }}
                    />
                  </div>
                  {err("yearsExperience")}
                </div>

                <div className="auth-form-group" style={{ marginBottom: 0 }}>
                  <label className="auth-label">Required Skills</label>
                  <input
                    className="auth-input"
                    placeholder="Add skills (Enter)"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                  />
                  <div className="modal-tags-row mt-2">
                    {skills.map((skill) => (
                      <span key={skill} className="status-tag status-progress">
                        {skill}
                        <X size={12} className="ms-1" style={{ cursor: 'pointer' }} onClick={() => removeSkill(skill)} />
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="auth-form-group mt-4">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <label className="auth-label m-0">Job Description<span style={{ color: '#ef4444' }}> *</span></label>
                  <button type="button" className="ai-pill-btn" onClick={handleGenerateAI}>
                    <span className="ai-pill-icon">✦</span>
                    <span className="ai-pill-text">{isAiLoading ? "Generating..." : "Generate with AI"}</span>
                  </button>
                </div>

                <div className="ai-highlight-wrapper">
                  <textarea
                    className="ai-textarea"
                    rows={4}
                    placeholder="Describe the role and responsibilities..."
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                {err("description")}
              </div>

              <div className="auth-form-group">
                <label className="auth-label mb-2">Additional Requirements</label>
                <textarea
                  className="auth-input"
                  rows={2}
                  style={{ height: "60px" }}
                  placeholder="Any other requirements..."
                  name="additionalReqs"
                  value={formik.values.additionalReqs}
                  onChange={formik.handleChange}
                />
              </div>
            </div>

            {/* FOOTER */}
            <div className="d-flex justify-content-between mt-4 pt-3" style={{ borderTop: '1px solid #e2e8f0' }}>
              <button type="button" className="btn-secondary" onClick={() => navigate("/user/user-dashboard")}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Preview
              </button>
            </div>

          </div>
        </div>

        {/* ================= PREVIEW ================= */}
        <div className="dashboard-column-side">
          <div className="sticky-preview">
            <h3 className="section-title mb-3">Preview</h3>
            <div className="project-card" style={{ gap: '20px' }}>

              {/* Header */}
              <div style={{ display: 'flex', gap: '16px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '8px',
                    backgroundColor: '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#64748b'
                  }}
                >
                  <FileText size={24} />
                </div>

                <div>
                  <h4 style={{ margin: 0 }}>
                    {formik.values.jobTitle || "Job Title"}
                  </h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                    {formik.values.companyName || "Company Name"}
                  </p>
                </div>
              </div>

              {/* Meta Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

                <div className="d-flex align-items-center gap-2">
                  <MapPin size={14} />
                  <span>{formik.values.location || "Location"}</span>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <Briefcase size={14} />
                  <span>{formik.values.employmentType || "Employment Type"}</span>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <DollarSign size={14} />
                  <span>
                    {formik.values.salaryType === 'entireBudget'
                      ? `${formik.values.salaryMin} ${formik.values.salaryCurrency} (Fixed)`
                      : formik.values.salaryMin && formik.values.salaryMax
                        ? `${formik.values.salaryMin} - ${formik.values.salaryMax} ${formik.values.salaryCurrency}`
                        : "Salary Range"}
                  </span>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <Monitor size={14} />
                  <span>{formik.values.workModel || "Work Model"}</span>
                </div>

              </div>

              <div style={{ height: '1px', backgroundColor: '#f1f5f9' }} />

              {/* Skills */}
              <div>
                <p style={{ fontSize: '12px', fontWeight: 600 }}>
                  Required Skills
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {skills.length > 0 ? (
                    skills.map(skill => (
                      <span
                        key={skill}
                        className="status-tag status-pending"
                        style={{ fontSize: '11px' }}
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                      No skills added
                    </span>
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>

      {
        showPreview && (
          <PreviewModal
            data={modalData}
            onClose={() => setShowPreview(false)}
            onPostJob={handlePostJob}   // ✅ API CALL HERE
            isEdit={isEdit}
          />
        )
      }
    </form >
  );
};

export default PostNewPositions;