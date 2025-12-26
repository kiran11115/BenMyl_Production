import React from "react";

const StepVerify = ({
  formData,
  handleInputChange,
  handleCountryChange,
  handleFileUpload,
  fileName,
  currentLicenseOptions,
  getLicenseLabel,
  getLicensePlaceholder,
}) => {
  return (
    <div className="animate-fade-in">
      <section className="auth-section">
        <h3 className="auth-section-title">Business Verification</h3>
        <div className="auth-grid-3">
          <div className="auth-group">
            <label className="auth-label">Country of Registration</label>
            <div className="auth-select-wrapper">
              <select
                name="country"
                className="auth-input auth-select"
                value={formData.country}
                onChange={handleCountryChange}
              >
                <option value="India">India</option>
                <option value="USA">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="UAE">UAE</option>
              </select>
            </div>
          </div>

          <div className="auth-group">
            <label className="auth-label">{getLicenseLabel()}</label>
            <input
              type="text"
              className="auth-input"
              placeholder={getLicensePlaceholder()}
            />
          </div>

          <div className="auth-group auth-action-group">
            {formData.country === "USA" ? (
              <div className="auth-upload-wrapper">
                <input
                  type="file"
                  id="file-upload"
                  className="auth-file-input-hidden"
                  accept=".pdf,.jpg,.png"
                  onChange={handleFileUpload}
                />
                <label htmlFor="file-upload" className="btn-secondary">
                  Upload Doc
                </label>
                {fileName && <span className="auth-file-name">{fileName}</span>}
              </div>
            ) : (
              <button type="button" className="auth-btn-secondary auth-btn-sm">
                Validate Now
              </button>
            )}
          </div>
        </div>

        <div className="auth-license-grid">
          {currentLicenseOptions.map((option) => (
            <label
              key={option.value}
              className={`auth-license-card ${
                formData.licenseType === option.value
                  ? "auth-license-card-active"
                  : ""
              }`}
            >
              <input
                type="radio"
                name="licenseType"
                className="auth-hidden-radio"
                value={option.value}
                checked={formData.licenseType === option.value}
                onChange={handleInputChange}
              />
              <div className="auth-license-content">
                <span className="auth-license-value">{option.value}</span>
                <span className="auth-license-label">{option.label}</span>
              </div>
              {formData.licenseType === option.value && (
                <div className="auth-check-icon">✓</div>
              )}
            </label>
          ))}
        </div>
      </section>

      <section className="auth-section">
        <h3 className="auth-section-title">Registered Address</h3>
        <div className="projects-grid">
          <div className="auth-group auth-span-2">
            <label className="auth-label">Street Address</label>
            <input
              type="text"
              name="street"
              className="auth-input"
              placeholder="123 Business Street"
              value={formData.street}
              onChange={handleInputChange}
            />
          </div>
          <div className="auth-group">
            <label className="auth-label">City</label>
            <input
              type="text"
              name="city"
              className="auth-input"
              placeholder={
                formData.country === "India" ? "Bengaluru" : "New York"
              }
              value={formData.city}
              onChange={handleInputChange}
            />
          </div>
          {formData.country === "USA" && (
            <div className="auth-group">
              <label className="auth-label">State</label>
              <div className="auth-select-wrapper">
                <select
                  name="state"
                  className="auth-input auth-select"
                  value={formData.state}
                  onChange={handleInputChange}
                >
                  <option value="">Select State</option>
                  <option value="CA">California</option>
                  <option value="NY">New York</option>
                  <option value="TX">Texas</option>
                  <option value="FL">Florida</option>
                </select>
              </div>
            </div>
          )}
          <div className="auth-group">
            <label className="auth-label">
              {formData.country === "USA" ? "Zip Code" : "Postal Code"}
            </label>
            <input
              type="text"
              name="zipCode"
              className="auth-input"
              placeholder={formData.country === "USA" ? "10001" : "560001"}
              value={formData.zipCode}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default StepVerify;
