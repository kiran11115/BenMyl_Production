// StepProfileCompletion.jsx
import React, { useRef, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { 
  FaUser, 
  FaCloudUploadAlt, 
  FaCamera, 
  FaLink, 
  FaPlus,
  FaImage,
  FaCheckCircle
} from "react-icons/fa";

export default function StepProfileCompletion({
  data,
  patch,
  onBack,
  onSubmit,
}) {
  const profile = data.profile || {};
  
  // Refs for hidden file inputs
  const photoInputRef = useRef(null);
  const resumeInputRef = useRef(null);
  const portfolioInputRef = useRef(null);

  // Local state for previews/filenames (optional, if you want immediate feedback)
  const [photoPreview, setPhotoPreview] = useState(null);
  const [resumeName, setResumeName] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    patch({ profile: { ...profile, [name]: value } });
  };

  // Handle File Selections
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
      
      // Save file object to parent state
      patch({ profile: { ...profile, photoFile: file } });
    }
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeName(file.name);
      patch({ profile: { ...profile, resumeFile: file } });
    }
  };

  const handlePortfolioUpload = () => {
    // Trigger portfolio input if needed, similar logic
    portfolioInputRef.current?.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="wizard-card-title mb-4">Profile Completion</h2>

      {/* Profile Photo & Resume Section */}
      <section className="wizard-section pt-0 border-top-0">
        <Row className="g-4">
          
          {/* Profile Photo - Left Side */}
          <Col md={6}>
            <div className="p-4 bg-light rounded-4 border h-100 d-flex flex-column justify-content-center align-items-center text-center">
              <h3 className="wizard-section-title mb-3">Profile Photo</h3>
              
              <div 
                className="wizard-profile-photo-circle mb-3 position-relative" 
                style={{ width: "100px", height: "100px" }}
              >
                <div className="w-100 h-100 bg-white border d-flex align-items-center justify-content-center text-secondary rounded-circle overflow-hidden">
                   {photoPreview ? (
                     <img 
                       src={photoPreview} 
                       alt="Profile Preview" 
                       style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                     />
                   ) : (
                     <FaUser size={40} color="#cbd5e1" />
                   )}
                </div>
              </div>

              {/* Hidden File Input */}
              <input 
                type="file" 
                ref={photoInputRef}
                style={{ display: "none" }}
                accept="image/png, image/jpeg, image/jpg"
                onChange={handlePhotoChange}
              />

              <button
                type="button"
                className="auth-btn-primary mb-2 d-flex align-items-center gap-2"
                onClick={() => photoInputRef.current?.click()}
              >
                <FaCamera /> {photoPreview ? "Change Photo" : "Upload Photo"}
              </button>
              <p className="wizard-upload-meta mb-0">JPG, PNG (max 5MB)</p>
            </div>
          </Col>

          {/* Resume Upload - Right Side */}
          <Col md={6}>
            <div className="wizard-resume-card h-100 d-flex flex-column justify-content-center align-items-center">
              <div className="wizard-resume-icon d-flex align-items-center justify-content-center text-secondary">
                {resumeName ? <FaCheckCircle size={24} color="#10b981" /> : <FaCloudUploadAlt size={24} />}
              </div>
              
              <h3 className="wizard-resume-title">
                {resumeName ? "Resume Uploaded" : "Skip the hassle. Upload resume."}
              </h3>
              
              <p className="wizard-resume-text mb-3 text-truncate" style={{ maxWidth: "250px" }}>
                {resumeName 
                  ? `File: ${resumeName}`
                  : "Auto-fill details from your resume."
                }
              </p>
              
              {!resumeName && (
                <p className="wizard-upload-meta mb-3">
                  PDF, JPG, PNG (max 5MB)
                </p>
              )}

              {/* Hidden File Input */}
              <input 
                type="file" 
                ref={resumeInputRef}
                style={{ display: "none" }}
                accept=".pdf, .doc, .docx, .jpg, .png"
                onChange={handleResumeChange}
              />

              <button
                type="button"
                className={`auth-btn-secondary wizard-upload-btn w-auto ${resumeName ? "text-success border-success bg-success-subtle" : ""}`}
                onClick={() => resumeInputRef.current?.click()}
              >
                {resumeName ? "Change File" : "Choose File"}
              </button>
            </div>
          </Col>
        </Row>
      </section>

      {/* Personal Information */}
      <section className="wizard-section mt-4 pt-4 border-top">
        <h3 className="wizard-section-title mb-3">Personal Information</h3>
        <Row className="g-3">
          <Col md={6}>
            <div className="auth-form-group">
              <label className="auth-label">First Name</label>
              <input
                name="firstName"
                className="auth-input"
                placeholder="John"
                value={profile.firstName || ""}
                onChange={handleChange}
              />
            </div>
          </Col>
          <Col md={6}>
            <div className="auth-form-group">
              <label className="auth-label">Last Name</label>
              <input
                name="lastName"
                className="auth-input"
                placeholder="Cooper"
                value={profile.lastName || ""}
                onChange={handleChange}
              />
            </div>
          </Col>
          <Col md={12}>
            <div className="auth-form-group">
              <label className="auth-label">Professional Title</label>
              <input
                name="title"
                className="auth-input"
                placeholder="Senior Web Developer"
                value={profile.title || ""}
                onChange={handleChange}
              />
            </div>
          </Col>
          <Col md={6}>
            <div className="auth-form-group">
              <label className="auth-label">Email</label>
              <input
                type="email"
                name="email"
                className="auth-input"
                placeholder="john@example.com"
                value={profile.email || ""}
                onChange={handleChange}
              />
            </div>
          </Col>
          <Col md={6}>
            <div className="auth-form-group">
              <label className="auth-label">Phone</label>
              <input
                name="phone"
                className="auth-input"
                placeholder="+1 (555) 000‑0000"
                value={profile.phone || ""}
                onChange={handleChange}
              />
            </div>
          </Col>
          <Col md={12}>
            <div className="auth-form-group">
              <label className="auth-label">Location</label>
              <input
                name="location"
                className="auth-input"
                placeholder="San Francisco, CA"
                value={profile.location || ""}
                onChange={handleChange}
              />
            </div>
          </Col>
        </Row>
      </section>

      {/* About Me & Skills (Side-by-Side) */}
      <section className="wizard-section mt-4 pt-4 border-top">
        <Row className="g-4">
          <Col md={6}>
            <h3 className="wizard-section-title mb-3">About Me</h3>
            <div className="auth-form-group">
              <textarea
                name="aboutMe"
                className="auth-input wizard-textarea h-100"
                style={{ minHeight: "140px" }}
                placeholder="Tell clients about your expertise..."
                value={profile.aboutMe || ""}
                onChange={handleChange}
              />
            </div>
          </Col>
          <Col md={6}>
            <div className="d-flex flex-column h-100">
              <h3 className="wizard-section-title mb-3">Skills & Expertise</h3>
              <div className="auth-form-group flex-grow-1">
                <textarea
                   name="skills"
                   className="auth-input wizard-textarea h-100"
                   style={{ minHeight: "140px" }}
                   placeholder="e.g. React, Node.js (Separate with commas)"
                   value={profile.skills || ""}
                   onChange={handleChange}
                />
              </div>
            </div>
          </Col>
        </Row>
      </section>

      {/* Work Experience */}
      <section className="wizard-section mt-4 pt-4 border-top">
        <h3 className="wizard-section-title mb-3">Work Experience</h3>
        <Row className="g-3">
          <Col md={6}>
            <div className="auth-form-group">
              <label className="auth-label">Company</label>
              <input
                name="expCompany"
                className="auth-input"
                placeholder="Company name"
                value={profile.expCompany || ""}
                onChange={handleChange}
              />
            </div>
          </Col>
          <Col md={6}>
            <div className="auth-form-group">
              <label className="auth-label">Position</label>
              <input
                name="expPosition"
                className="auth-input"
                placeholder="Job title"
                value={profile.expPosition || ""}
                onChange={handleChange}
              />
            </div>
          </Col>
          <Col md={12}>
            <div className="auth-form-group">
              <label className="auth-label">Description</label>
              <textarea
                name="expDescription"
                className="auth-input wizard-textarea"
                placeholder="Describe your role..."
                rows={3}
                value={profile.expDescription || ""}
                onChange={handleChange}
              />
            </div>
          </Col>
        </Row>
      </section>

      {/* Education */}
      <section className="wizard-section mt-4 pt-4 border-top">
        <h3 className="wizard-section-title mb-3">Education</h3>
        <Row className="g-3">
          <Col md={6}>
            <div className="auth-form-group">
              <label className="auth-label">Institution</label>
              <input
                name="eduInstitution"
                className="auth-input"
                placeholder="University name"
                value={profile.eduInstitution || ""}
                onChange={handleChange}
              />
            </div>
          </Col>
          <Col md={6}>
            <div className="auth-form-group">
              <label className="auth-label">Degree</label>
              <input
                name="eduDegree"
                className="auth-input"
                placeholder="e.g. Bachelor's"
                value={profile.eduDegree || ""}
                onChange={handleChange}
              />
            </div>
          </Col>
          <Col md={8}>
            <div className="auth-form-group">
              <label className="auth-label">Field of Study</label>
              <input
                name="eduField"
                className="auth-input"
                placeholder="e.g. Computer Science"
                value={profile.eduField || ""}
                onChange={handleChange}
              />
            </div>
          </Col>
          <Col md={4}>
            <div className="auth-form-group">
              <label className="auth-label">Year</label>
              <input
                name="eduYear"
                className="auth-input"
                placeholder="2020"
                value={profile.eduYear || ""}
                onChange={handleChange}
              />
            </div>
          </Col>
        </Row>
      </section>

      {/* Portfolio & Availability (Side-by-Side) */}
      <section className="wizard-section mt-4 pt-4 border-top">
        <Row className="g-4">
          <Col md={6}>
            <h3 className="wizard-section-title mb-3">Portfolio</h3>
            <div className="wizard-portfolio-grid d-grid gap-2" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
              <div className="wizard-portfolio-card bg-light border rounded ratio ratio-1x1 d-flex align-items-center justify-content-center text-black-50">
                 <FaImage size={20} />
              </div>
              <div className="wizard-portfolio-card bg-light border rounded ratio ratio-1x1 d-flex align-items-center justify-content-center text-black-50">
                 <FaImage size={20} />
              </div>
              <div className="wizard-portfolio-card bg-light border rounded ratio ratio-1x1 d-flex align-items-center justify-content-center text-black-50">
                 <FaImage size={20} />
              </div>
            </div>
            
            <div className="wizard-portfolio-actions mt-3">
              {/* Optional: Add hidden input for portfolio here if needed */}
              <input type="file" ref={portfolioInputRef} style={{display: 'none'}} multiple />
              
              <button 
                type="button" 
                className="auth-link"
                onClick={handlePortfolioUpload}
              >
                Upload Work
              </button>
              <button type="button" className="auth-link">
                Add Link
              </button>
            </div>
          </Col>

          <Col md={6}>
            <h3 className="wizard-section-title mb-3">Availability</h3>
            <div className="d-flex flex-column gap-2">
              {["Full-time", "Part-time", "Weekends"].map((type) => (
                <div key={type} className="wizard-availability-row d-flex justify-content-between align-items-center p-2 px-3 border rounded-pill bg-light">
                  <span style={{ fontSize: "14px", fontWeight: "500" }}>{type}</span>
                  <div className="form-check form-switch m-0 p-0 d-flex">
                    <input className="form-check-input ms-0 mt-0" type="checkbox" role="switch" style={{ cursor: "pointer" }} />
                  </div>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </section>

      {/* Footer Buttons */}
      <div className="wizard-footer mt-5 pt-3 border-top d-flex justify-content-between align-items-center">
        <button
          type="button"
          className="auth-btn-secondary"
          onClick={onBack}
        >
          Cancel
        </button>
        <div className="d-flex gap-2">
          <button type="button" className="auth-btn-secondary">
            Draft
          </button>
          <button type="button" className="auth-btn-secondary">
            Preview
          </button>
          <button type="submit" className="auth-btn-primary">
            Save
          </button>
        </div>
      </div>
    </form>
  );
}
