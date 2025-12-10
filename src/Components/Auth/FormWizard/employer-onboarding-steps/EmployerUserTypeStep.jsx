import React from "react";
import { FaBuilding, FaUserTie } from "react-icons/fa";

export default function EmployerUserTypeStep({ state, onChange, onNext }) {
  const handleSelect = (accountType) =>
    onChange({ accountType });

  const handleContinue = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form className="wizard-card" onSubmit={handleContinue}>
      <h2 className="wizard-card-title">Choose Your User Type</h2>
      <p className="wizard-card-subtitle">
        Select how you want to use the platform.
      </p>

      <div className="wizard-user-types">
        <button
          type="button"
          className={`wizard-user-card ${
            state.accountType === "individual"
              ? "wizard-user-card--active"
              : ""
          }`}
          onClick={() => handleSelect("individual")}
        >
          <div className="wizard-user-icon-box">
            <FaUserTie />
          </div>
          <div className="wizard-user-text">
            <div className="wizard-user-label">Individual</div>
            <div className="wizard-user-desc">
              Hire talent as an individual or small business.
            </div>
          </div>
        </button>

        <button
          type="button"
          className={`wizard-user-card ${
            state.accountType === "company"
              ? "wizard-user-card--active"
              : ""
          }`}
          onClick={() => handleSelect("company")}
        >
          <div className="wizard-user-icon-box">
            <FaBuilding />
          </div>
          <div className="wizard-user-text">
            <div className="wizard-user-label">Company</div>
            <div className="wizard-user-desc">
              Create a company profile and manage multiple roles.
            </div>
          </div>
        </button>
      </div>

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
