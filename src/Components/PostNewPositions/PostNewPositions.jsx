import React, { useState } from 'react';
import {
  Briefcase, MapPin, DollarSign, Monitor,
  FileText, X, Building2
} from 'lucide-react';
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import PreviewModal from './PreviewModal';
import {
  usePostJobMutation,
  useSaveJobDraftMutation
} from '../../State-Management/Api/ProjectApiSlice';

import '../Dashboard/Dashboard.css';
import '../Auth/Auth.css';
import './PostNewPositions.css';

/* =========================
   VALIDATION SCHEMA
========================= */
const validationSchema = Yup.object({
  jobTitle: Yup.string().required("Job Title is required"),
  companyName: Yup.string().required("Company Name is required"),
  location: Yup.string().required("Location is required"),
  employmentType: Yup.string().required("Employment Type is required"),
  salaryMin: Yup.number().typeError("Enter valid amount").required("Required"),
  salaryMax: Yup.number()
    .typeError("Enter valid amount")
    .moreThan(Yup.ref("salaryMin"), "Must be greater than Min")
    .required("Required"),
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

  const [postJob] = usePostJobMutation();

  const [saveJobDraft] = useSaveJobDraftMutation();

  const user = localStorage.getItem("CompanyId");



  /* =========================
     FORMIK
  ========================= */
  const formik = useFormik({
    initialValues: {
      jobTitle: '',
      companyName: '',
      location: '',
      employmentType: '',
      workModel: '',
      salaryMin: '',
      salaryMax: '',
      salaryCurrency: 'USD',
      description: '',
      department: '',
      experienceLevel: '',
      educationLevel: '',
      yearsExperience: '',
      additionalReqs: '',
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

    fd.append("JobID", 0);
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

    try {
      await postJob(fd).unwrap();
      alert("Job posted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to post job");
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

    try {
      await saveJobDraft(fd).unwrap();
      alert("Draft saved successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to save draft");
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
    additional: formik.values.additionalReqs
  };


  const err = (name) =>
    formik.touched[name] && formik.errors[name] && (
      <div className="auth-error">{formik.errors[name]}</div>
    );

  return (
    <form onSubmit={formik.handleSubmit} className="container p-3">
      {/* HEADER */}
      <div style={{ marginBottom: '24px' }}>
        <div className="vs-breadcrumbs mb-3 d-flex gap-2">
          <button type="button" className="link-button" onClick={() => navigate("/user/user-dashboard")}>
            <FiArrowLeft /> Back to Dashboard
          </button>
          <span className="crumb">/ Job Posting</span>
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: '0 0 8px 0' }}>
          Creating New Job Posting
        </h1>
        <p style={{ color: '#64748b', margin: 0 }}>
          Here's what's happening with your projects today
        </p>
      </div>

      <div className="dashboard-layout">

        {/* ================= MAIN FORM ================= */}
        <div className="dashboard-column-main">
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '32px',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
          }}>

            {/* BASIC INFO */}
            <div style={{ marginBottom: '40px' }}>
              <h3 className="section-title" style={{ paddingBottom: '16px', borderBottom: '1px solid #f1f5f9', marginBottom: '24px' }}>
                Basic Information
              </h3>

              <label className="auth-label">Job Title</label>
              <input className="auth-input" name="jobTitle" placeholder="e.g. Senior Frontend Developer"
                value={formik.values.jobTitle} onChange={formik.handleChange} onBlur={formik.handleBlur} />
              {err("jobTitle")}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginBottom: '1.25rem', marginTop: '1.25rem' }}>
                <div>
                  <label className="auth-label">Company Name</label>
                  <input className="auth-input" name="companyName" placeholder="Company"
                    value={formik.values.companyName} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                  {err("companyName")}
                </div>

                <div>
                  <label className="auth-label">Location</label>
                  <input className="auth-input" name="location" placeholder="City, State"
                    value={formik.values.location} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                  {err("location")}
                </div>

                <div>
                  <label className="auth-label">Employment Type</label>
                  <select className="auth-input" name="employmentType"
                    value={formik.values.employmentType} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                    <option value="">Select type</option>
                    <option>Full-time</option>
                    <option>Contract</option>
                    <option>Freelance</option>
                  </select>
                  {err("employmentType")}
                </div>
              </div>

              <label className="auth-label">Salary Range</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px', gap: '16px' }}>
                <input className="auth-input" name="salaryMin" placeholder="Min"
                  value={formik.values.salaryMin} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                <input className="auth-input" name="salaryMax" placeholder="Max"
                  value={formik.values.salaryMax} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                <select className="auth-input" name="salaryCurrency"
                  value={formik.values.salaryCurrency} onChange={formik.handleChange}>
                  <option>USD</option>
                  <option>EUR</option>
                </select>
              </div>
              {err("salaryMin")}
              {err("salaryMax")}
            </div>

            {/* =======================
   Section 2: Job Details
======================= */}
            <div style={{ marginBottom: '40px' }}>
              <h3
                className="section-title"
                style={{
                  paddingBottom: '16px',
                  borderBottom: '1px solid #f1f5f9',
                  marginBottom: '24px'
                }}
              >
                Job Details
              </h3>

              <div className="auth-form-group">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <label className="auth-label m-0">Job Description</label>
                  <button type="button" className="ai-pill-btn">
                    <span className="ai-pill-icon">✦</span>
                    <span className="ai-pill-text">AI</span>
                  </button>
                </div>

                <textarea
                  className="auth-input"
                  rows={6}
                  style={{ resize: 'vertical' }}
                  placeholder="Describe the role and responsibilities..."
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.description && formik.errors.description && (
                  <div className="auth-error">{formik.errors.description}</div>
                )}
              </div>

              {/* 3 Column Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '24px'
                }}
              >
                <div>
                  <label className="auth-label">Work Model</label>
                  <select
                    className="auth-input"
                    name="workModel"
                    value={formik.values.workModel}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="">Select model</option>
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                  {formik.touched.workModel && formik.errors.workModel && (
                    <div className="auth-error">{formik.errors.workModel}</div>
                  )}
                </div>

                <div>
                  <label className="auth-label">Department</label>
                  <select
                    className="auth-input"
                    name="department"
                    value={formik.values.department}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="">Select department</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Product">Product</option>
                  </select>
                  {formik.touched.department && formik.errors.department && (
                    <div className="auth-error">{formik.errors.department}</div>
                  )}
                </div>

                <div>
                  <label className="auth-label">Experience Level</label>
                  <select
                    className="auth-input"
                    name="experienceLevel"
                    value={formik.values.experienceLevel}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="">Select level</option>
                    <option value="Junior">Junior</option>
                    <option value="Mid-Level">Mid-Level</option>
                    <option value="Senior">Senior</option>
                  </select>
                  {formik.touched.experienceLevel && formik.errors.experienceLevel && (
                    <div className="auth-error">{formik.errors.experienceLevel}</div>
                  )}
                </div>
              </div>
            </div>

            {/* =======================
   Section 3: Requirements
======================= */}
            <div style={{ marginBottom: '24px' }}>
              <h3
                className="section-title"
                style={{
                  paddingBottom: '16px',
                  borderBottom: '1px solid #f1f5f9',
                  marginBottom: '24px'
                }}
              >
                Requirements
              </h3>

              {/* Required Skills */}
              <div className="auth-form-group">
                <label className="auth-label">Required Skills</label>
                <input
                  className="auth-input"
                  placeholder="Add skills (e.g. React, Node.js) and press Enter"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                />

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    marginTop: '12px'
                  }}
                >
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="status-tag status-progress"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '12px',
                        padding: '6px 10px'
                      }}
                    >
                      {skill}
                      <X
                        size={12}
                        style={{ cursor: 'pointer' }}
                        onClick={() => removeSkill(skill)}
                      />
                    </span>
                  ))}
                </div>
              </div>

              {/* Education + Experience */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '24px',
                  marginBottom: '1.25rem'
                }}
              >
                <div>
                  <label className="auth-label">Education Level</label>
                  <select
                    className="auth-input"
                    name="educationLevel"
                    value={formik.values.educationLevel}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="">Select education</option>
                    <option value="Bachelors">Bachelor's Degree</option>
                    <option value="Masters">Master's Degree</option>
                  </select>
                  {formik.touched.educationLevel && formik.errors.educationLevel && (
                    <div className="auth-error">{formik.errors.educationLevel}</div>
                  )}
                </div>

                <div>
                  <label className="auth-label">Years of Experience</label>
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
                  {formik.touched.yearsExperience && formik.errors.yearsExperience && (
                    <div className="auth-error">{formik.errors.yearsExperience}</div>
                  )}
                </div>
              </div>

              {/* Additional Requirements */}
              <div className="auth-form-group">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <label className="auth-label m-0">Additional Requirements</label>
                  <button type="button" className="ai-pill-btn">
                    <span className="ai-pill-icon">✦</span>
                    <span className="ai-pill-text">AI</span>
                  </button>
                </div>

                <textarea
                  className="auth-input"
                  rows={4}
                  placeholder="Any other requirements..."
                  name="additionalReqs"
                  value={formik.values.additionalReqs}
                  onChange={formik.handleChange}
                />
              </div>
            </div>

            {/* FOOTER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', paddingTop: '24px', borderTop: '1px solid #e2e8f0' }}>
              <button type="button" className="btn-secondary" onClick={() => navigate("/user/user-dashboard")}>
                Cancel
              </button>
              <div style={{ display: 'flex', gap: '16px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleSaveDraft}
                >
                  Save as Draft
                </button>

                <button
                  type="submit"
                  className="btn-primary"
                >
                  Preview
                </button>


              </div>
            </div>

          </div>
        </div>

        {/* ================= PREVIEW ================= */}
        <div className="dashboard-column-side">
          <div style={{ position: 'sticky', top: '24px' }}>
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
                    {formik.values.salaryMin && formik.values.salaryMax
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

      {showPreview && (
        <PreviewModal
          data={modalData}
          onClose={() => setShowPreview(false)}
          onPostJob={handlePostJob}   // ✅ API CALL HERE
        />
      )}
    </form>
  );
};

export default PostNewPositions;
