import React from "react";

const StepAccount = ({ formData, handleInputChange }) => {
  return (
    <div className="animate-fade-in">
      <section className="auth-section">
        <h3 className="auth-section-title">Primary Contact</h3>
        <div className="auth-grid-3">
          <div className="auth-group">
            <label className="auth-label">Full Name</label>
            <input
              type="text"
              name="fullName"
              className="auth-input"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleInputChange}
            />
          </div>
          <div className="auth-group">
            <label className="auth-label">Business Phone</label>
            <input
              type="tel"
              name="phone"
              className="auth-input"
              placeholder={
                formData.country === "India"
                  ? "+91 94413 88886"
                  : "+1 (555) 123-4567"
              }
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
          <div className="auth-group">
            <label className="auth-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="auth-input"
              placeholder="john@company.com"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </section>

      <div className="auth-toggle-wrapper">
        <label className="auth-toggle-label">
          <div className="auth-toggle-input-wrapper">
            <input
              type="checkbox"
              name="notifications"
              className="auth-toggle-checkbox"
              checked={formData.notifications}
              onChange={handleInputChange}
            />
            <span className="auth-toggle-slider"></span>
          </div>
          <div className="auth-toggle-text">
            <span className="auth-toggle-title">
              Enable Priority Notifications
            </span>
            <span className="auth-toggle-desc">
              Receive critical updates via SMS & WhatsApp
            </span>
          </div>
        </label>
      </div>
    </div>
  );
};

export default StepAccount;
