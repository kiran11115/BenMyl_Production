// StepChooseUserType.jsx
import React from "react";
import { FaBuilding, FaBriefcase, FaUserTie } from "react-icons/fa";

export default function StepChooseUserType({ data, patch, onNext }) {
  const handleSelect = (userType) => patch({ userType });

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form className="wizard-card" onSubmit={handleSubmit}>
      <h2 className="wizard-card-title">Choose Your User Type</h2>
      <p className="wizard-card-subtitle">
        Select the option that best describes how you will use the platform.
      </p>

      <div className="wizard-user-types">
        <button
          type="button"
          className={`wizard-user-card ${
            data.userType === "employer" ? "wizard-user-card--active" : ""
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
            data.userType === "vendor" ? "wizard-user-card--active" : ""
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
            data.userType === "talent" ? "wizard-user-card--active" : ""
          }`}
          onClick={() => handleSelect("talent")}
        >
          <div className="wizard-user-icon-box">
            <FaUserTie className="wizard-user-icon" />
          </div>
          <div className="wizard-user-text">
            <div className="wizard-user-label">Talent / Freelancer</div>
            <div className="wizard-user-desc">
              Find opportunities and showcase your skills.
            </div>
          </div>
        </button>
      </div>

      <section className="wizard-next-steps">
        <div className="wizard-next-title">Preview of Next Steps</div>
        <div className="wizard-next-items">
          <div className="wizard-next-item">
            <div className="wizard-next-icon" />
            <div>
              <div className="wizard-next-label">Basic Information</div>
              <div className="wizard-next-desc">
                You'll need to provide your contact details and basic company information.
              </div>
            </div>
          </div>
          <div className="wizard-next-item">
            <div className="wizard-next-icon" />
            <div>
              <div className="wizard-next-label">Document Verification</div>
              <div className="wizard-next-desc">
                Upload your registration and verification documents.
              </div>
            </div>
          </div>
          <div className="wizard-next-item">
            <div className="wizard-next-icon" />
            <div>
              <div className="wizard-next-label">Profile Completion</div>
              <div className="wizard-next-desc">
                Complete your profile to start using our platform.
              </div>
            </div>
          </div>
        </div>
        <div className="wizard-estimate">Estimated time: 5–10 minutes</div>
      </section>

      <div className="wizard-footer d-flex justify-content-end">
        <div className="wizard-footer-right">
          <button type="button" className="auth-btn-secondary">
            Save
          </button>
          <button type="submit" className="auth-btn-primary">
            Continue
          </button>
        </div>
      </div>
    </form>
  );
}
