// StepProfileCompletion.jsx
import React, { useRef, useState } from "react";
import { 
  FaUser, 
  FaCloudUploadAlt, 
  FaCheckCircle,
  FaBriefcase,
  FaGraduationCap,
  FaImage
} from "react-icons/fa";

export default function StepProfileCompletion({
  data,
  patch,
  onBack,
  onSubmit,
}) {
  const profile = data.profile || {};
  const availability = profile.availability || []; // Ensure array exists
  
  // Refs & State
  const photoInputRef = useRef(null);
  const resumeInputRef = useRef(null);
  const portfolioInputRef = useRef(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [resumeName, setResumeName] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    patch({ profile: { ...profile, [name]: value } });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
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

  // Toggle Availability Selection
  const toggleAvailability = (type) => {
    const current = profile.availability || [];
    const newAvailability = current.includes(type)
      ? current.filter((item) => item !== type) // Remove if exists
      : [...current, type]; // Add if not exists
    
    patch({ profile: { ...profile, availability: newAvailability } });
  };

  return (
    <form className="wizard-card" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      
      {/* --- Header --- */}
      <div className="mb-4 border-bottom pb-3">
        <h2 className="wizard-card-title" style={{ fontSize: '20px' }}>Complete Your Profile</h2>
        <p className="wizard-card-subtitle mb-0" style={{ fontSize: '14px' }}>
          Professional details help us match you with the right opportunities.
        </p>
      </div>

      {/* --- 1. Top Module: Photo & Resume --- */}
      <div className="wizard-form-grid mb-4" style={{ gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        
        {/* Photo Card */}
        <div className="p-3 border rounded-3 bg-light d-flex align-items-center gap-3 transition-hover">
          <div 
            className="position-relative flex-shrink-0 rounded-circle overflow-hidden border bg-white d-flex align-items-center justify-content-center" 
            style={{ width: "72px", height: "72px" }}
          >
             {photoPreview ? (
               <img src={photoPreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
             ) : (
               <FaUser size={28} color="#cbd5e1" />
             )}
          </div>
          <div className="d-flex flex-column">
              <h3 className="text-dark fw-bold mb-1" style={{ fontSize: '14px' }}>Profile Photo</h3>
              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  className="auth-link p-0 border-0 bg-transparent text-primary fw-medium"
                  style={{ fontSize: '13px' }}
                  onClick={() => photoInputRef.current?.click()}
                >
                  {photoPreview ? "Change Photo" : "Upload Photo"}
                </button>
                <span className="text-muted" style={{ fontSize: '10px' }}>| JPG, PNG</span>
              </div>
              <input type="file" ref={photoInputRef} className="d-none" onChange={handlePhotoChange} accept="image/*" />
          </div>
        </div>

        {/* Resume Card */}
        <div className="p-3 border rounded-3 bg-light d-flex align-items-center gap-3 transition-hover">
           <div 
             className={`flex-shrink-0 rounded-3 d-flex align-items-center justify-content-center ${resumeName ? "bg-success-subtle text-success" : "bg-white text-secondary border"}`} 
             style={{ width: '72px', height: '72px' }}
           >
            {resumeName ? <FaCheckCircle size={24} /> : <FaCloudUploadAlt size={24} />}
          </div>
          <div className="d-flex flex-column overflow-hidden">
              <h3 className="text-dark fw-bold mb-1" style={{ fontSize: '14px' }}>
                {resumeName ? "Resume Attached" : "Upload Resume"}
              </h3>
              <p className="text-muted text-truncate mb-1" style={{ fontSize: '12px', maxWidth: '100%' }}>
                {resumeName || "Auto-fill details from file"}
              </p>
              <button
                type="button"
                className="auth-link p-0 border-0 bg-transparent text-primary fw-medium text-start"
                style={{ fontSize: '13px' }}
                onClick={() => resumeInputRef.current?.click()}
              >
                {resumeName ? "Replace File" : "Select File (PDF/DOCX)"}
              </button>
              <input type="file" ref={resumeInputRef} className="d-none" onChange={handleResumeChange} accept=".pdf,.doc,.docx" />
          </div>
        </div>
      </div>

      {/* --- 2. Personal Information (Strict 3-Col Grid) --- */}
      <section className="mb-4">
        <h3 className="wizard-section-title text-dark mb-3" style={{ fontSize: '15px' }}>Personal Details</h3>
        <div className="wizard-form-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
          
          <div className="auth-form-group">
            <label className="auth-label text-muted" style={{fontSize: '12px'}}>First Name</label>
            <input name="firstName" className="auth-input" placeholder="John" value={profile.firstName || ""} onChange={handleChange} />
          </div>

          <div className="auth-form-group">
            <label className="auth-label text-muted" style={{fontSize: '12px'}}>Last Name</label>
            <input name="lastName" className="auth-input" placeholder="Cooper" value={profile.lastName || ""} onChange={handleChange} />
          </div>

          <div className="auth-form-group">
            <label className="auth-label text-muted" style={{fontSize: '12px'}}>Professional Title</label>
            <input name="title" className="auth-input" placeholder="e.g. Senior Architect" value={profile.title || ""} onChange={handleChange} />
          </div>

          <div className="auth-form-group">
            <label className="auth-label text-muted" style={{fontSize: '12px'}}>Email Address</label>
            <input type="email" name="email" className="auth-input" placeholder="john@example.com" value={profile.email || ""} onChange={handleChange} />
          </div>

          <div className="auth-form-group">
            <label className="auth-label text-muted" style={{fontSize: '12px'}}>Phone Number</label>
            <input name="phone" className="auth-input" placeholder="+1 (555) 000-0000" value={profile.phone || ""} onChange={handleChange} />
          </div>

          <div className="auth-form-group">
            <label className="auth-label text-muted" style={{fontSize: '12px'}}>Location</label>
            <input name="location" className="auth-input" placeholder="City, Country" value={profile.location || ""} onChange={handleChange} />
          </div>
        </div>
      </section>

      {/* --- 3. Split Layout: Experience & Education --- */}
      <section className="mb-4 pt-3 border-top">
         <div className="wizard-form-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
            
            {/* Experience Column */}
            <div className="d-flex flex-column gap-3">
               <div className="d-flex align-items-center gap-2 mb-1">
                 <FaBriefcase className="text-muted" size={14} />
                 <h3 className="wizard-section-title text-dark mb-0" style={{ fontSize: '15px' }}>Latest Experience</h3>
               </div>
               
               <div className="wizard-form-grid" style={{ gridTemplateColumns: "2fr 1fr", gap: "12px" }}>
                  <div className="auth-form-group">
                    <label className="auth-label text-muted" style={{fontSize: '11px'}}>COMPANY</label>
                    <input name="expCompany" className="auth-input" placeholder="Company Name" value={profile.expCompany || ""} onChange={handleChange} />
                  </div>
                  <div className="auth-form-group">
                    <label className="auth-label text-muted" style={{fontSize: '11px'}}>ROLE</label>
                    <input name="expPosition" className="auth-input" placeholder="Role Title" value={profile.expPosition || ""} onChange={handleChange} />
                  </div>
               </div>
               
               <div className="auth-form-group">
                 <label className="auth-label text-muted" style={{fontSize: '11px'}}>SUMMARY</label>
                 <textarea 
                   name="aboutMe" 
                   className="auth-input wizard-textarea" 
                   rows={3} 
                   style={{ minHeight: '88px', resize: 'none' }}
                   placeholder="Briefly describe your responsibilities..." 
                   value={profile.aboutMe || ""} 
                   onChange={handleChange} 
                 />
               </div>
            </div>

            {/* Education Column */}
            <div className="d-flex flex-column gap-3">
               <div className="d-flex align-items-center gap-2 mb-1">
                 <FaGraduationCap className="text-muted" size={16} />
                 <h3 className="wizard-section-title text-dark mb-0" style={{ fontSize: '15px' }}>Education & Skills</h3>
               </div>

               <div className="wizard-form-grid" style={{ gridTemplateColumns: "2fr 1fr", gap: "12px" }}>
                   <div className="auth-form-group">
                     <label className="auth-label text-muted" style={{fontSize: '11px'}}>INSTITUTION</label>
                     <input name="eduInstitution" className="auth-input" placeholder="University" value={profile.eduInstitution || ""} onChange={handleChange} />
                   </div>
                   <div className="auth-form-group">
                     <label className="auth-label text-muted" style={{fontSize: '11px'}}>YEAR</label>
                     <input name="eduYear" className="auth-input" placeholder="202X" value={profile.eduYear || ""} onChange={handleChange} />
                   </div>
               </div>

               <div className="auth-form-group">
                 <label className="auth-label text-muted" style={{fontSize: '11px'}}>SKILLS (COMMA SEPARATED)</label>
                 <textarea
                    name="skills"
                    className="auth-input wizard-textarea"
                    rows={3}
                    style={{ minHeight: '88px', resize: 'none' }}
                    placeholder="e.g. React, Node.js, UI/UX Design..."
                    value={profile.skills || ""}
                    onChange={handleChange}
                 />
               </div>
            </div>

         </div>
      </section>

      {/* --- 4. Portfolio & Availability --- */}
      <section className="pt-3 border-top mb-4">
        <div className="wizard-form-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
          
          {/* Portfolio */}
          <div>
            <h3 className="wizard-section-title text-dark mb-3" style={{ fontSize: '15px' }}>Portfolio</h3>
            <div className="d-flex align-items-center gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-3 border border-dashed d-flex align-items-center justify-content-center text-muted bg-light" style={{ width: '64px', height: '64px' }}>
                   <FaImage size={18} opacity={0.5} />
                </div>
              ))}
              <button 
                type="button" 
                className="btn btn-sm btn-light border d-flex align-items-center justify-content-center ms-2"
                style={{ height: '64px', width: '64px', borderRadius: '12px' }}
                onClick={() => portfolioInputRef.current?.click()}
              >
                <span style={{ fontSize: '24px', lineHeight: 1 }}>+</span>
              </button>
              <input type="file" ref={portfolioInputRef} className="d-none" multiple />
            </div>
          </div>

          {/* Availability (Click Selection) */}
          <div>
            <h3 className="wizard-section-title text-dark mb-3" style={{ fontSize: '15px' }}>Availability</h3>
            <div className="d-flex gap-2">
              {["Full-time", "Contract", "Freelance"].map((type) => {
                const isSelected = availability.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleAvailability(type)}
                    className={`flex-fill border rounded-pill py-2 px-3 d-flex align-items-center justify-content-center gap-2 transition-all fw-medium ${
                      isSelected 
                        ? "bg-primary-subtle text-primary border-primary" 
                        : "bg-white text-secondary border-secondary-subtle hover-bg-light"
                    }`}
                    style={{ fontSize: "13px" }}
                  >
                    {isSelected && <FaCheckCircle size={12} />}
                    {type}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* --- Footer Buttons --- */}
      <div className="wizard-footer d-flex justify-content-between pt-3 border-top">
        <button type="button" className="auth-btn-secondary px-4" onClick={onBack}>Back</button>
        <div className="d-flex gap-3">
            <button type="button" className="auth-btn-secondary px-4">Preview</button>
          <button type="button" className="auth-btn-secondary px-4">Draft</button>
          <button type="submit" className="auth-btn-primary px-5">Complete Profile</button>
        </div>
      </div>

    </form>
  );
}
