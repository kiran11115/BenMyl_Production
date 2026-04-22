import React from "react";

const StepAccount = ({
  formData,
  handleInputChange,
  handleBlur,
  errors,
  touched,
}) => {
  return (
    <div className="animate-fade-in">
      <section className="auth-section">
        <h3 className="auth-section-title">Primary Contact</h3>

        <div className="auth-grid-3 mb-3">

          {/* Company Name (READONLY) */}
          <div className="auth-group">
            <label className="auth-label">Company Name</label>
            <input
              type="text"
              name="companyName"
              className="auth-input"
              value={formData.companyName}
              readOnly
            />
          </div>

          {/* Full Name (READONLY) */}
          <div className="auth-group">
            <label className="auth-label">Full Name</label>
            <input
              type="text"
              name="fullName"
              className="auth-input"
              value={formData.fullName}
              readOnly
            />
          </div>

          {/* Email (READONLY) */}
          <div className="auth-group">
            <label className="auth-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="auth-input"
              value={formData.email}
              readOnly
            />
          </div>
        </div>

        {/* Business Phone (EDITABLE) */}
        <div className="auth-group">
          <label className="auth-label">Business Phone</label>
          <input
            type="tel"
            name="phone"
            className={`auth-input ${
              touched.phone && errors.phone ? "is-invalid" : ""
            }`}
            placeholder={
              formData.country === "India"
                ? "+91 94413 88886"
                : "+1 (555) 123-4567"
            }
            value={formData.phone}
            onChange={handleInputChange}
            onBlur={handleBlur}
          />
          {touched.phone && errors.phone && (
            <small className="auth-error">{errors.phone}</small>
          )}
        </div>
      </section>

      {/* Notifications (EDITABLE) */}
      <div className="auth-toggle-wrapper">
        <label className="auth-toggle-label">
          <div className="auth-toggle-input-wrapper">
            <input
              type="checkbox"
              name="notifications"
              className="auth-toggle-checkbox"
              checked={formData.notifications}
              onChange={handleInputChange}
              onBlur={handleBlur}
            />
            <span className="auth-toggle-slider"></span>
          </div>

          <div className="auth-toggle-text">
            <span className="auth-toggle-title">Enable Priority Notifications</span>
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
