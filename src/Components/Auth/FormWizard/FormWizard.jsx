import React, { useState, useRef } from "react";
import {
  FaBuilding,
  FaBriefcase,
  FaUserTie,
  FaGlobe,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "../Auth.css";
import "./FormWizard.css";

const STEPS = [
  "Choose User Type",
  "Basic Information",
  "Document Upload",
  "Profile Completion",
];

export default function FormWizard() {
  const [activeStep, setActiveStep] = useState(0);

  const [data, setData] = useState({
    userType: "employer",
    accountType: "company",
    basicInfo: {},
    documents: {},
    profile: {
      availability: [],
      photoPreview: null,
      resumeName: "",
    },
  });

  const [showPreview, setShowPreview] = useState(false);

  const goNext = () =>
    setActiveStep((s) => Math.min(s + 1, STEPS.length - 1));
  const goBack = () =>
    setActiveStep((s) => Math.max(s - 1, 0));

  const patch = (partial) =>
    setData((prev) => ({ ...prev, ...partial }));

  const handleFinalSubmit = () => {
    // submit to API here
    console.log("Final payload", data);
  };

  return (
    <>
      <div className="auth-container">
        <div className="auth-card wizard-auth-card">
          <div className="auth-form-side wizard-form-side">
            {/* Header */}
            <header className="wizard-page-header">
              <h1 className="wizard-page-title">
                Create Account
              </h1>
            </header>

            {/* Stepper */}
            <div className="wizard-header">
              {STEPS.map((label, index) => {
                const isActive = index === activeStep;
                const isCompleted = index < activeStep;
                return (
                  <div
                    key={label}
                    className={`wizard-step ${
                      isActive ? "wizard-step--active" : ""
                    } ${
                      isCompleted ? "wizard-step--completed" : ""
                    }`}
                  >
                    <div className="wizard-step-pill">
                      <span className="wizard-step-index">
                        {index + 1}
                      </span>
                      <span className="wizard-step-title">
                        {label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Steps */}
            {activeStep === 0 && (
              <StepChooseUserType
                data={data}
                patch={patch}
                onNext={goNext}
              />
            )}
            {activeStep === 1 && (
              <StepBasicInfo
                data={data}
                patch={patch}
                onNext={goNext}
                onBack={goBack}
              />
            )}
            {activeStep === 2 && (
              <StepDocuments
                data={data}
                patch={patch}
                onNext={goNext}
                onBack={goBack}
              />
            )}
            {activeStep === 3 && (
              <StepProfileCompletion
                data={data}
                patch={patch}
                onBack={goBack}
                onSubmit={handleFinalSubmit}
                onOpenPreview={() => setShowPreview(true)}
              />
            )}
          </div>
        </div>
      </div>

      {showPreview && (
        <PreviewModal
          data={data}
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  );
}

/* ----------------------------------------------------
   STEP 1 – Choose User Type
-----------------------------------------------------*/

function StepChooseUserType({ data, patch, onNext }) {
  const handleSelect = (userType) => patch({ userType });

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form className="wizard-card" onSubmit={handleSubmit}>
      <h2 className="wizard-card-title">Choose Your User Type</h2>
      <p className="wizard-card-subtitle">
        Select the option that best describes how you will use the
        platform.
      </p>

      <div className="wizard-user-types">
        <button
          type="button"
          className={`wizard-user-card ${
            data.userType === "employer"
              ? "wizard-user-card--active"
              : ""
          }`}
          onClick={() => handleSelect("employer")}
        >
          <div className="wizard-user-icon-box">
            <FaBuilding className="wizard-user-icon" />
          </div>
          <div className="wizard-user-text">
            <div className="wizard-user-label">Employer</div>
            <div className="wizard-user-desc">
              Post jobs and find the right talent for your company.
            </div>
          </div>
        </button>

        <button
          type="button"
          className={`wizard-user-card ${
            data.userType === "vendor"
              ? "wizard-user-card--active"
              : ""
          }`}
          onClick={() => handleSelect("vendor")}
        >
          <div className="wizard-user-icon-box">
            <FaBriefcase className="wizard-user-icon" />
          </div>
          <div className="wizard-user-text">
            <div className="wizard-user-label">Vendor</div>
            <div className="wizard-user-desc">
              Offer your services and grow your business.
            </div>
          </div>
        </button>

        <button
          type="button"
          className={`wizard-user-card ${
            data.userType === "talent"
              ? "wizard-user-card--active"
              : ""
          }`}
          onClick={() => handleSelect("talent")}
        >
          <div className="wizard-user-icon-box">
            <FaUserTie className="wizard-user-icon" />
          </div>
          <div className="wizard-user-text">
            <div className="wizard-user-label">
              Talent / Freelancer
            </div>
            <div className="wizard-user-desc">
              Find opportunities and showcase your skills.
            </div>
          </div>
        </button>
      </div>

      <section className="wizard-next-steps">
        <div className="wizard-next-title">
          Preview of Next Steps
        </div>
        <div className="wizard-next-items">
          <div className="wizard-next-item">
            <div className="wizard-next-icon" />
            <div>
              <div className="wizard-next-label">
                Basic Information
              </div>
              <div className="wizard-next-desc">
                You&apos;ll need to provide your contact details and
                basic company information.
              </div>
            </div>
          </div>
          <div className="wizard-next-item">
            <div className="wizard-next-icon" />
            <div>
              <div className="wizard-next-label">
                Document Verification
              </div>
              <div className="wizard-next-desc">
                Upload your registration and verification documents.
              </div>
            </div>
          </div>
          <div className="wizard-next-item">
            <div className="wizard-next-icon" />
            <div>
              <div className="wizard-next-label">
                Profile Completion
              </div>
              <div className="wizard-next-desc">
                Complete your profile to start using our platform.
              </div>
            </div>
          </div>
        </div>
        <div className="wizard-estimate">
          Estimated time: 5–10 minutes
        </div>
      </section>

      <div className="wizard-footer">
        <button
          type="button"
          className="auth-btn-secondary"
          disabled
        >
          Back
        </button>
        <div className="wizard-footer-right">
          <button
            type="button"
            className="auth-btn-secondary"
          >
            Save Progress
          </button>
          <button type="submit" className="auth-btn-primary">
            Continue
          </button>
        </div>
      </div>
    </form>
  );
}

/* ----------------------------------------------------
   STEP 2 – Basic Information
-----------------------------------------------------*/

function StepBasicInfo({ data, patch, onNext, onBack }) {
  const info = data.basicInfo || {};

  const handleChange = (e) => {
    const { name, value } = e.target;
    patch({ basicInfo: { ...info, [name]: value } });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form className="wizard-card" onSubmit={handleSubmit}>
      <h2 className="wizard-card-title">Basic Information</h2>
      <p className="wizard-card-subtitle">
        Tell us how to contact you and where you&apos;re based.
      </p>

      <div className="wizard-user-types wizard-user-types--two">
        <button
          type="button"
          className={`wizard-user-card ${
            data.accountType === "individual"
              ? "wizard-user-card--active"
              : ""
          }`}
          onClick={() => patch({ accountType: "individual" })}
        >
          <div className="wizard-user-label">Individual</div>
        </button>
        <button
          type="button"
          className={`wizard-user-card ${
            data.accountType === "company"
              ? "wizard-user-card--active"
              : ""
          }`}
          onClick={() => patch({ accountType: "company" })}
        >
          <div className="wizard-user-label">Company</div>
        </button>
      </div>

      <div className="wizard-form-grid">
        <div className="auth-form-group">
          <label className="auth-label">Full Name</label>
          <input
            name="fullName"
            className="auth-input"
            placeholder="Enter your full name"
            value={info.fullName || ""}
            onChange={handleChange}
          />
        </div>
        <div className="auth-form-group">
          <label className="auth-label">Email Address</label>
          <input
            type="email"
            name="email"
            className="auth-input"
            placeholder="john.doe@example.com"
            value={info.email || ""}
            onChange={handleChange}
          />
        </div>
        <div className="auth-form-group">
          <label className="auth-label">Phone Number</label>
          <input
            name="phone"
            className="auth-input"
            placeholder="Enter phone number"
            value={info.phone || ""}
            onChange={handleChange}
          />
        </div>
        <div className="auth-form-group">
          <label className="auth-label">Country/Region</label>
          <select
            name="country"
            className="auth-input"
            value={info.country || ""}
            onChange={handleChange}
          >
            <option value="">Select country</option>
            <option value="india">India</option>
            <option value="usa">United States</option>
            <option value="uk">United Kingdom</option>
          </select>
        </div>
        <div className="auth-form-group wizard-form-grid--full">
          <label className="auth-label">Address Line 1</label>
          <input
            name="address1"
            className="auth-input"
            placeholder="Enter street address"
            value={info.address1 || ""}
            onChange={handleChange}
          />
        </div>
        <div className="auth-form-group wizard-form-grid--full">
          <label className="auth-label">
            Address Line 2 (Optional)
          </label>
          <input
            name="address2"
            className="auth-input"
            placeholder="Apartment, suite, unit, etc."
            value={info.address2 || ""}
            onChange={handleChange}
          />
        </div>
        <div className="auth-form-group">
          <label className="auth-label">City</label>
          <input
            name="city"
            className="auth-input"
            placeholder="Enter city"
            value={info.city || ""}
            onChange={handleChange}
          />
        </div>
        <div className="auth-form-group">
          <label className="auth-label">State/Province</label>
          <input
            name="state"
            className="auth-input"
            placeholder="Enter state"
            value={info.state || ""}
            onChange={handleChange}
          />
        </div>
        <div className="auth-form-group">
          <label className="auth-label">Postal Code</label>
          <input
            name="postal"
            className="auth-input"
            placeholder="Enter postal code"
            value={info.postal || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="wizard-footer">
        <button
          type="button"
          className="auth-btn-secondary"
          onClick={onBack}
        >
          Back
        </button>
        <div className="wizard-footer-right">
          <button
            type="button"
            className="auth-btn-secondary"
          >
            Save Progress
          </button>
          <button type="submit" className="auth-btn-primary">
            Continue
          </button>
        </div>
      </div>
    </form>
  );
}

/* ----------------------------------------------------
   STEP 3 – Document Upload
-----------------------------------------------------*/

function StepDocuments({ data, patch, onNext, onBack }) {
  const docs = data.documents || {};
  const isIndividual = data.accountType === "individual";

  const firstRef = useRef(null);
  const secondRef = useRef(null);

  const setFile = (key, files) =>
    patch({ documents: { ...docs, [key]: files?.[0] || null } });

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  const firstLabel = isIndividual ? "Government ID" : "CIN No";
  const firstDesc = isIndividual
    ? "Upload a valid government‑issued ID (Passport, Driver’s License)."
    : "Upload a valid government‑issued CIN document.";
  const firstKey = isIndividual ? "govId" : "cin";

  const secondLabel = isIndividual ? "Address Proof" : "Tax Certificate";
  const secondDesc = isIndividual
    ? "Upload a recent utility bill or bank statement that confirms your address."
    : "Upload your latest tax certificate or registration.";
  const secondKey = isIndividual ? "addressProof" : "taxCertificate";

  return (
    <form className="wizard-card" onSubmit={handleSubmit}>
      <h2 className="wizard-card-title">Document Upload</h2>
      <p className="wizard-card-subtitle">
        Upload the required documents to verify your{" "}
        {isIndividual ? "identity" : "business"}.
      </p>

      <div className="wizard-upload-grid">
        <div className="wizard-upload-card">
          <div className="wizard-upload-icon">@</div>
          <h3 className="wizard-upload-title">{firstLabel}</h3>
          <p className="wizard-upload-subtitle">{firstDesc}</p>
          <p className="wizard-upload-meta">
            Supported formats: PDF, JPG, PNG (max 5MB)
          </p>

          <input
            ref={firstRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            style={{ display: "none" }}
            onChange={(e) => setFile(firstKey, e.target.files)}
          />

          <button
            type="button"
            className="auth-btn-secondary wizard-upload-btn"
            onClick={() => firstRef.current?.click()}
          >
            {docs[firstKey] ? docs[firstKey].name : "Choose File"}
          </button>
        </div>

        <div className="wizard-upload-card">
          <div className="wizard-upload-icon">📄</div>
          <h3 className="wizard-upload-title">{secondLabel}</h3>
          <p className="wizard-upload-subtitle">{secondDesc}</p>
          <p className="wizard-upload-meta">
            Supported formats: PDF, JPG, PNG (max 5MB)
          </p>

          <input
            ref={secondRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            style={{ display: "none" }}
            onChange={(e) => setFile(secondKey, e.target.files)}
          />

          <button
            type="button"
            className="auth-btn-secondary wizard-upload-btn"
            onClick={() => secondRef.current?.click()}
          >
            {docs[secondKey]
              ? docs[secondKey].name
              : "Choose File"}
          </button>
        </div>
      </div>

      <div className="wizard-footer">
        <button
          type="button"
          className="auth-btn-secondary"
          onClick={onBack}
        >
          Back
        </button>
        <div className="wizard-footer-right">
          <button
            type="button"
            className="auth-btn-secondary"
          >
            Save Progress
          </button>
          <button type="submit" className="auth-btn-primary">
            Continue
          </button>
        </div>
      </div>
    </form>
  );
}

/* ----------------------------------------------------
   STEP 4 – Profile Completion (upload + preview)
-----------------------------------------------------*/

function StepProfileCompletion({
  data,
  patch,
  onBack,
  onSubmit,
  onOpenPreview,
}) {
  const profile = data.profile || { availability: [] };
  const availability = profile.availability || [];

  const photoInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    patch({ profile: { ...profile, [name]: value } });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      patch({
        profile: {
          ...profile,
          photoPreview: ev.target?.result || null,
        },
      });
    };
    reader.readAsDataURL(file);
  };

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];
    patch({
      profile: {
        ...profile,
        resumeName: file ? file.name : "",
      },
    });
  };

  const toggleAvailability = (key) => {
    const exists = availability.includes(key);
    const next = exists
      ? availability.filter((v) => v !== key)
      : [...availability, key];
    patch({ profile: { ...profile, availability: next } });
  };

  const isSelected = (key) => availability.includes(key);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form className="wizard-card" onSubmit={handleSubmit}>
      <h2 className="wizard-card-title">Profile Completion</h2>

      {/* Profile photo */}
      <section className="wizard-section">
        <h3 className="wizard-section-title">Profile Photo</h3>
        <div className="wizard-profile-photo-row">
          <div className="wizard-profile-photo-circle">
            {profile.photoPreview && (
              <img
                src={profile.photoPreview}
                alt="Profile"
                className="wizard-profile-photo-img"
              />
            )}
          </div>
          <div className="wizard-profile-photo-content">
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handlePhotoChange}
            />
            <button
              type="button"
              className="auth-btn-primary wizard-profile-photo-btn"
              onClick={() => photoInputRef.current?.click()}
            >
              Upload Photo
            </button>
            <p className="wizard-upload-meta">
              JPG, PNG (max 5MB)
            </p>
          </div>
        </div>
      </section>

      {/* Resume upload */}
      <section className="wizard-section">
        <div className="wizard-resume-card">
          <div className="wizard-resume-icon" />
          <h3 className="wizard-resume-title">
            Skip the hassle. Upload your resume.
          </h3>
          <p className="wizard-resume-text">
            Let us extract your experience, education, and skills
            automatically. No manual entry needed.
          </p>
          <p className="wizard-upload-meta">
            Supported formats: PDF, JPG, PNG (max 5MB)
          </p>

          <input
            ref={resumeInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            style={{ display: "none" }}
            onChange={handleResumeChange}
          />

          <button
            type="button"
            className="auth-btn-secondary wizard-upload-btn"
            onClick={() => resumeInputRef.current?.click()}
          >
            {profile.resumeName || "Choose File"}
          </button>
        </div>
      </section>

      {/* Personal Information */}
      <section className="wizard-section">
        <h3 className="wizard-section-title">
          Personal Information
        </h3>
        <div className="wizard-form-grid">
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
          <div className="auth-form-group wizard-form-grid--full">
            <label className="auth-label">
              Professional Title
            </label>
            <input
              name="title"
              className="auth-input"
              placeholder="Senior Web Developer"
              value={profile.title || ""}
              onChange={handleChange}
            />
          </div>
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
          <div className="auth-form-group wizard-form-grid--full">
            <label className="auth-label">Location</label>
            <div className="wizard-input-with-icon">
              <FaMapMarkerAlt className="wizard-input-icon" />
              <input
                name="location"
                className="auth-input"
                placeholder="San Francisco, CA"
                value={profile.location || ""}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Me */}
      <section className="wizard-section">
        <h3 className="wizard-section-title">About Me</h3>
        <div className="auth-form-group">
          <textarea
            name="aboutMe"
            className="auth-input wizard-textarea"
            placeholder="Tell clients about your expertise, experience, and what makes you unique..."
            rows={4}
            value={profile.aboutMe || ""}
            onChange={handleChange}
          />
        </div>
      </section>

      {/* Skills */}
      <section className="wizard-section">
        <h3 className="wizard-section-title">
          Skills &amp; Expertise
        </h3>
        <div className="auth-form-group">
          <input
            name="skills"
            className="auth-input"
            placeholder="e.g. React, TypeScript, Node.js"
            value={profile.skills || ""}
            onChange={handleChange}
          />
          <p className="wizard-upload-meta">
            Separate skills with commas.
          </p>
        </div>
      </section>

      {/* Work Experience */}
      <section className="wizard-section">
        <h3 className="wizard-section-title">
          Work Experience
        </h3>
        <div className="wizard-form-grid">
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
          <div className="auth-form-group wizard-form-grid--full">
            <label className="auth-label">Description</label>
            <textarea
              name="expDescription"
              className="auth-input wizard-textarea"
              placeholder="Describe your role and achievements..."
              rows={3}
              value={profile.expDescription || ""}
              onChange={handleChange}
            />
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="wizard-section">
        <h3 className="wizard-section-title">Education</h3>
        <div className="wizard-form-grid">
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
          <div className="auth-form-group">
            <label className="auth-label">Degree</label>
            <input
              name="eduDegree"
              className="auth-input"
              placeholder="e.g. Bachelor&apos;s"
              value={profile.eduDegree || ""}
              onChange={handleChange}
            />
          </div>
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
          <div className="auth-form-group">
            <label className="auth-label">Year</label>
            <input
              name="eduYear"
              className="auth-input"
              placeholder="e.g. 2020"
              value={profile.eduYear || ""}
              onChange={handleChange}
            />
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section className="wizard-section">
        <h3 className="wizard-section-title">Portfolio</h3>
        <div className="wizard-portfolio-grid">
          <div className="wizard-portfolio-card" />
          <div className="wizard-portfolio-card" />
          <div className="wizard-portfolio-card" />
        </div>
        <div className="wizard-portfolio-actions">
          <button type="button" className="auth-link">
            Upload Work
          </button>
          <button type="button" className="auth-link">
            Add Link
          </button>
        </div>
      </section>

      {/* Availability */}
      <section className="wizard-section">
        <h3 className="wizard-section-title">Availability</h3>
        <div className="wizard-availability-list">
          <AvailabilityOption
            label="Full-time"
            value="full_time"
            selected={isSelected("full_time")}
            onToggle={toggleAvailability}
          />
          <AvailabilityOption
            label="Part-time"
            value="part_time"
            selected={isSelected("part_time")}
            onToggle={toggleAvailability}
          />
          <AvailabilityOption
            label="Weekends"
            value="weekends"
            selected={isSelected("weekends")}
            onToggle={toggleAvailability}
          />
        </div>
      </section>

      {/* Footer */}
      <div className="wizard-footer">
        <button
          type="button"
          className="auth-btn-secondary"
          onClick={onBack}
        >
          Cancel
        </button>
        <div className="wizard-footer-right">
          <button
            type="button"
            className="auth-btn-secondary"
            onClick={onOpenPreview}
          >
            Preview
          </button>
          <button
            type="button"
            className="auth-btn-secondary"
          >
            Save as Draft
          </button>
          <button type="submit" className="auth-btn-primary">
            Save
          </button>
        </div>
      </div>
    </form>
  );
}

/* availability pill */

function AvailabilityOption({ label, value, selected, onToggle }) {
  return (
    <button
      type="button"
      className={`wizard-availability-row ${
        selected ? "wizard-availability-row--active" : ""
      }`}
      onClick={() => onToggle(value)}
    >
      <span>{label}</span>
      <span className="wizard-toggle-placeholder" />
    </button>
  );
}

/* ----------------------------------------------------
   Preview Modal
-----------------------------------------------------*/

function PreviewModal({ data, onClose }) {
  const { basicInfo, profile, documents } = data;
  const availLabels = {
    full_time: "Full-time",
    part_time: "Part-time",
    weekends: "Weekends",
  };

  return (
    <div className="wizard-modal-backdrop">
      <div className="wizard-modal">
        <div className="wizard-modal-header">
          <h2 className="wizard-modal-title">Preview Profile</h2>
          <button
            type="button"
            className="wizard-modal-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="wizard-modal-body">
          {/* Left: summary card */}
          <section className="wizard-preview-left">
            <div className="wizard-preview-photo">
              <div className="wizard-preview-photo-circle">
                {profile.photoPreview && (
                  <img
                    src={profile.photoPreview}
                    alt="Profile"
                  />
                )}
              </div>
              <div className="wizard-preview-name">
                {profile.firstName || "First"}{" "}
                {profile.lastName || "Last"}
              </div>
              <div className="wizard-preview-title">
                {profile.title || "Title"}
              </div>
              <div className="wizard-preview-location">
                {profile.location || "Location"}
              </div>
            </div>

            <div className="wizard-preview-meta">
              <div className="wizard-preview-meta-label">
                Availability
              </div>
              <div className="wizard-preview-chips">
                {(profile.availability || []).length === 0
                  ? "Not set"
                  : profile.availability.map((a) => (
                      <span
                        key={a}
                        className="wizard-preview-chip"
                      >
                        {availLabels[a] || a}
                      </span>
                    ))}
              </div>
            </div>

            <div className="wizard-preview-meta">
              <div className="wizard-preview-meta-label">
                Resume
              </div>
              <div className="wizard-preview-text">
                {profile.resumeName || "Not uploaded"}
              </div>
            </div>
          </section>

          {/* Right: details */}
          <section className="wizard-preview-right">
            <div className="wizard-preview-section">
              <h3>Contact</h3>
              <p>
                {basicInfo.fullName || "Full Name"} ·{" "}
                {profile.email || basicInfo.email || "Email"} ·{" "}
                {profile.phone || basicInfo.phone || "Phone"}
              </p>
            </div>

            <div className="wizard-preview-section">
              <h3>About Me</h3>
              <p>
                {profile.aboutMe ||
                  "You have not added an About Me yet."}
              </p>
            </div>

            <div className="wizard-preview-section">
              <h3>Skills</h3>
              <p>
                {profile.skills ||
                  "No skills added yet. Add them to stand out."}
              </p>
            </div>

            <div className="wizard-preview-section">
              <h3>Work Experience</h3>
              <p>
                <strong>
                  {profile.expCompany || "Company name"}
                </strong>{" "}
                – {profile.expPosition || "Position"}
              </p>
              <p>
                {profile.expDescription ||
                  "Describe your role and achievements to give clients context."}
              </p>
            </div>

            <div className="wizard-preview-section">
              <h3>Education</h3>
              <p>
                <strong>
                  {profile.eduInstitution || "Institution"}
                </strong>{" "}
                · {profile.eduDegree || "Degree"} ·{" "}
                {profile.eduField || "Field"} ·{" "}
                {profile.eduYear || "Year"}
              </p>
            </div>
          </section>
        </div>

        <div className="wizard-modal-footer">
          <button
            type="button"
            className="auth-btn-secondary"
            onClick={onClose}
          >
            Back to Edit
          </button>
          <button type="button" className="auth-btn-primary">
            Submit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
