import React, { useState } from 'react';
import { 
  Briefcase, MapPin, DollarSign, Monitor, 
  FileText, X, Building2 
} from 'lucide-react';
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import PreviewModal from './PreviewModal'; // Ensure this path is correct
import '../Dashboard/Dashboard.css';
import '../Auth/Auth.css';
import './PostNewPositions.css'; // This will hold the modal styles

const PostNewPositions = () => {
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState(['React', 'TypeScript', 'Node.js']);

  const [formData, setFormData] = useState({
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
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handlePostJobClick = () => {
    setShowPreview(true);
  };

  // Prepare data object for the modal (mapping fields to what Modal expects)
  const modalData = {
    ...formData,
    skills: skills,
    currency: formData.salaryCurrency,
    additional: formData.additionalReqs
  };

  return (
    <div className="projects-container">
      {/* Header with Navigation */}
      <div style={{ marginBottom: '24px' }}>
        <div className="vs-breadcrumbs mb-3">
          <button className="link-button" onClick={() => navigate("/user/user-dashboard")}>
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

      {/* Stepper */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', margin: '32px 0 48px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', maxWidth: '600px', width: '100%' }}>
          {[
            { num: 1, label: 'Basic Info', active: true },
            { num: 2, label: 'Details', active: false },
            { num: 3, label: 'Requirements', active: false },
            { num: 4, label: 'Review', active: false }
          ].map((step, idx) => (
            <React.Fragment key={step.num}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '28px', height: '28px', borderRadius: '50%', 
                  backgroundColor: step.active ? '#1e293b' : '#e2e8f0',
                  color: step.active ? '#fff' : '#64748b',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: '600'
                }}>
                  {step.num}
                </div>
                <span style={{ fontSize: '14px', fontWeight: '500', color: step.active ? '#1e293b' : '#64748b' }}>
                  {step.label}
                </span>
              </div>
              {idx < 3 && <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="dashboard-layout">
        
        {/* Main Form Area */}
        <div className="dashboard-column-main">
          
          {/* Main Form Container Card */}
          <div style={{ 
            backgroundColor: '#ffffff', 
            borderRadius: '16px', 
            border: '1px solid #e2e8f0', 
            padding: '32px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)'
          }}>
            
            {/* Section 1: Basic Information */}
            <div style={{ marginBottom: '40px' }}>
              <h3 className="section-title" style={{ paddingBottom: '16px', borderBottom: '1px solid #f1f5f9', marginBottom: '24px' }}>
                Basic Information
              </h3>
              
              <div className="auth-form-group">
                <label className="auth-label">Job Title</label>
                <input className="auth-input" name="jobTitle" placeholder="e.g. Senior Frontend Developer" value={formData.jobTitle} onChange={handleInputChange} />
              </div>

              {/* 3-Column Grid for Basic Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginBottom: '1.25rem' }}>
                <div>
                  <label className="auth-label">Company Name</label>
                  <div className="auth-password-wrapper">
                    <input className="auth-input" name="companyName" placeholder="Company" style={{ paddingLeft: '2.5rem' }} value={formData.companyName} onChange={handleInputChange} />
                    <Building2 size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  </div>
                </div>
                <div>
                  <label className="auth-label">Location</label>
                  <div className="auth-password-wrapper">
                    <input className="auth-input" name="location" placeholder="City, State" style={{ paddingLeft: '2.5rem' }} value={formData.location} onChange={handleInputChange} />
                    <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  </div>
                </div>
                <div>
                  <label className="auth-label">Employment Type</label>
                  <select className="auth-input" name="employmentType" value={formData.employmentType} onChange={handleInputChange}>
                    <option value="">Select type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
              </div>

              <div className="auth-form-group">
                <label className="auth-label">Salary Range</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px', gap: '16px' }}>
                  <div className="auth-password-wrapper">
                    <input className="auth-input" name="salaryMin" placeholder="Min" style={{ paddingLeft: '2.5rem' }} value={formData.salaryMin} onChange={handleInputChange} />
                    <DollarSign size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  </div>
                  <div className="auth-password-wrapper">
                    <input className="auth-input" name="salaryMax" placeholder="Max" style={{ paddingLeft: '2.5rem' }} value={formData.salaryMax} onChange={handleInputChange} />
                    <DollarSign size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  </div>
                  <select className="auth-input" style={{ textAlign: 'center' }} name="salaryCurrency" value={formData.salaryCurrency} onChange={handleInputChange}>
                    <option>USD</option>
                    <option>EUR</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Job Details */}
            <div style={{ marginBottom: '40px' }}>
              <h3 className="section-title" style={{ paddingBottom: '16px', borderBottom: '1px solid #f1f5f9', marginBottom: '24px' }}>
                Job Details
              </h3>
              <div className="auth-form-group">
                <label className="auth-label">Job Description</label>
                <textarea className="auth-input" rows={6} style={{ resize: 'vertical' }} placeholder="Describe the role and responsibilities..." name="description" value={formData.description} onChange={handleInputChange} />
              </div>

              {/* 3-Column Grid for Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                <div>
                  <label className="auth-label">Work Model</label>
                  <select className="auth-input" name="workModel" value={formData.workModel} onChange={handleInputChange}>
                    <option value="">Select model</option>
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="auth-label">Department</label>
                  <select className="auth-input" name="department" value={formData.department} onChange={handleInputChange}>
                    <option value="">Select department</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Product">Product</option>
                  </select>
                </div>
                <div>
                  <label className="auth-label">Experience Level</label>
                  <select className="auth-input" name="experienceLevel" value={formData.experienceLevel} onChange={handleInputChange}>
                    <option value="">Select level</option>
                    <option value="Junior">Junior</option>
                    <option value="Mid-Level">Mid-Level</option>
                    <option value="Senior">Senior</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Requirements */}
            <div style={{ marginBottom: '24px' }}>
              <h3 className="section-title" style={{ paddingBottom: '16px', borderBottom: '1px solid #f1f5f9', marginBottom: '24px' }}>
                Requirements
              </h3>
              <div className="auth-form-group">
                <label className="auth-label">Required Skills</label>
                <input className="auth-input" placeholder="Add skills (e.g. React, Node.js) and press Enter" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={handleAddSkill} />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                  {skills.map(skill => (
                    <span key={skill} className="status-tag status-progress" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', padding: '6px 10px' }}>
                      {skill}
                      <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeSkill(skill)} />
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '1.25rem' }}>
                <div>
                  <label className="auth-label">Education Level</label>
                  <select className="auth-input" name="educationLevel" value={formData.educationLevel} onChange={handleInputChange}>
                    <option value="">Select education</option>
                    <option value="Bachelors">Bachelor's Degree</option>
                    <option value="Masters">Master's Degree</option>
                  </select>
                </div>
                <div>
                  <label className="auth-label">Years of Experience</label>
                  <div className="auth-password-wrapper">
                    <input className="auth-input" name="yearsExperience" placeholder="e.g. 3" style={{ paddingLeft: '2.5rem' }} value={formData.yearsExperience} onChange={handleInputChange} />
                    <FileText size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  </div>
                </div>
              </div>
              
              <div className="auth-form-group">
                <label className="auth-label">Additional Requirements</label>
                <textarea className="auth-input" rows={4} placeholder="Any other requirements..." name="additionalReqs" value={formData.additionalReqs} onChange={handleInputChange} />
              </div>
            </div>

            {/* Footer Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', paddingTop: '24px', borderTop: '1px solid #e2e8f0' }}>
              <button className="btn-secondary" onClick={() => navigate("/user/user-dashboard")}>
                Cancel
              </button>
              <div style={{ display: 'flex', gap: '16px' }}>
                <button className="btn-secondary">
                  Save as Draft
                </button>
                <button className="btn-primary" onClick={handlePostJobClick}>
                  Post Job
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Preview Sidebar */}
        <div className="dashboard-column-side">
          <div style={{ position: 'sticky', top: '24px' }}>
            <h3 className="section-title">Preview</h3>
            <div className="project-card" style={{ gap: '20px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '8px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                  <FileText size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px 0' }}>{formData.jobTitle || 'Job Title'}</h4>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>{formData.companyName || 'Company Name'}</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569' }}>
                  <MapPin size={14} />
                  <span>{formData.location || 'Location'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569' }}>
                  <Briefcase size={14} />
                  <span>{formData.employmentType || 'Employment Type'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569' }}>
                  <DollarSign size={14} />
                  <span>
                    {formData.salaryMin && formData.salaryMax 
                      ? `${formData.salaryMin} - ${formData.salaryMax} ${formData.salaryCurrency}`
                      : 'Salary Range'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569' }}>
                  <Monitor size={14} />
                  <span>{formData.workModel || 'Work Model'}</span>
                </div>
              </div>

              <div style={{ height: '1px', backgroundColor: '#f1f5f9' }} />

              <div>
                <p style={{ fontSize: '12px', fontWeight: '600', color: '#1e293b', marginBottom: '12px' }}>Required Skills</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {skills.length > 0 ? skills.map(skill => (
                    <span key={skill} className="status-tag status-pending" style={{ fontSize: '11px' }}>{skill}</span>
                  )) : (
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>No skills added</span>
                  )}
                </div>
              </div>

              <div style={{ marginTop: '8px', padding: '12px', borderRadius: '8px', backgroundColor: '#f0fdf4', border: '1px solid #dcfce7', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                <span style={{ fontSize: '12px', fontWeight: '500', color: '#166534' }}>All fields completed</span>
              </div>
            </div>
          </div>
        </div>

      </div>
      
      {/* Modal is rendered conditionally here */}
      {showPreview && (
        <PreviewModal 
          onClose={() => setShowPreview(false)} 
          data={modalData} 
        />
      )}
    </div>
  );
};

export default PostNewPositions;
