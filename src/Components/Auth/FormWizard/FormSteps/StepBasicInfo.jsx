// StepBasicInfo.jsx
import React from "react";

export default function StepBasicInfo({ data, patch, onNext, onBack }) {
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
        Tell us how to contact you and where you're based.
      </p>

      {/* Account Type Toggle */}
      <div className="wizard-user-types wizard-user-types--two">
        <button
          type="button"
          className={`wizard-user-card ${
            data.accountType === "individual" ? "wizard-user-card--active" : ""
          }`}
          onClick={() => patch({ accountType: "individual" })}
        >
          <div className="wizard-user-icon-box">
             {/* Simple SVG User Icon */}
             <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </div>
          <div className="wizard-user-text">
            <div className="wizard-user-label">Individual</div>
            <div className="wizard-user-desc">Personal account</div>
          </div>
        </button>
        <button
          type="button"
          className={`wizard-user-card ${
            data.accountType === "company" ? "wizard-user-card--active" : ""
          }`}
          onClick={() => patch({ accountType: "company" })}
        >
          <div className="wizard-user-icon-box">
             {/* Simple SVG Building Icon */}
             <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          </div>
          <div className="wizard-user-text">
            <div className="wizard-user-label">Company</div>
            <div className="wizard-user-desc">Business account</div>
          </div>
        </button>
      </div>

      {/* 
         Change grid to 3 columns here via inline style or CSS class update.
         Assuming 'wizard-form-grid' is defined in CSS.
         Inline style added to force 3 columns as requested.
      */}
      <div className="wizard-form-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        
        {/* Row 1: Name, Email, Phone */}
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

        {/* Row 2: Address 1 spans 2 cols, Address 2 takes 1 col */}
        <div className="auth-form-group" style={{ gridColumn: "span 2" }}>
          <label className="auth-label">Address Line 1</label>
          <input
            name="address1"
            className="auth-input"
            placeholder="Enter street address"
            value={info.address1 || ""}
            onChange={handleChange}
          />
        </div>
        <div className="auth-form-group">
          <label className="auth-label">Address Line 2 (Optional)</label>
          <input
            name="address2"
            className="auth-input"
            placeholder="Apartment, suite, unit, etc."
            value={info.address2 || ""}
            onChange={handleChange}
          />
        </div>

        {/* Row 3: Country, State, City */}
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
          <label className="auth-label">City</label>
          <input
            name="city"
            className="auth-input"
            placeholder="Enter city"
            value={info.city || ""}
            onChange={handleChange}
          />
        </div>

        {/* Row 4: Postal Code (Start), others empty if needed */}
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
        {/* Empty divs to maintain grid structure if you want, or let grid handle it */}
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
