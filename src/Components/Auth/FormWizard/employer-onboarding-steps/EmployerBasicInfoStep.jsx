import React from "react";
export default function EmployerBasicInfoStep({
  state,
  onChange,
  onNext,
  onBack,
}) {
  const info = state.basicInfo || {};

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ basicInfo: { ...info, [name]: value } });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form className="wizard-card" onSubmit={handleSubmit}>
      <h2 className="wizard-card-title">Basic Information</h2>

      <p className="wizard-card-subtitle">
        Tell us a bit about you and your company.
      </p>

      {/* Account type toggle row */}
      <div className="wizard-user-types wizard-user-types--two">
        <button
          type="button"
          className={`wizard-user-card ${
            state.accountType === "individual"
              ? "wizard-user-card--active"
              : ""
          }`}
          onClick={() => onChange({ accountType: "individual" })}
        >
          <div className="wizard-user-label">Individual</div>
        </button>

        <button
          type="button"
          className={`wizard-user-card ${
            state.accountType === "company"
              ? "wizard-user-card--active"
              : ""
          }`}
          onClick={() => onChange({ accountType: "company" })}
        >
          <div className="wizard-user-label">Company</div>
        </button>
      </div>

      {/* Form grid */}
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
