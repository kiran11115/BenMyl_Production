import React from "react";

const StepVerify = ({
  formData,
  handleInputChange,
  handleBlur,
  handleCountryChange,
  handleFileUpload,
  fileName,
  currentLicenseOptions,
  getLicenseLabel,
  getLicensePlaceholder,
  errors,
  touched,
}) => {
  return (
    <div className="animate-fade-in">
      {/* ================= BUSINESS VERIFICATION ================= */}
      <section className="auth-section">
        <h3 className="auth-section-title">Business Verification</h3>

        <div className="auth-grid-3">
          {/* COUNTRY */}
          <div className="auth-group">
            <label className="auth-label">Country of Registration</label>
            <div className="auth-select-wrapper">
              <select
                name="country"
                className={`auth-input auth-select ${
                  touched.country && errors.country ? "is-invalid" : ""
                }`}
                value={formData.country}
                onChange={handleCountryChange}
                onBlur={handleBlur}
              >
                <option value="USA">United States</option>
                 <option value="India">India</option>
                <option value="UK">United Kingdom</option>
                <option value="UAE">UAE</option>
              </select>
            </div>
            {touched.country && errors.country && (
              <small className="auth-error">{errors.country}</small>
            )}
          </div>

          {/* LICENSE NUMBER */}
          <div className="auth-group">
            <label className="auth-label">{getLicenseLabel()}</label>
            <input
              type="text"
              name="licenseNumber"
              className={`auth-input ${
                touched.licenseNumber && errors.licenseNumber ? "is-invalid" : ""
              }`}
              placeholder={getLicensePlaceholder()}
              value={formData.licenseNumber}
              onChange={handleInputChange}
              onBlur={handleBlur}
            />
            {touched.licenseNumber && errors.licenseNumber && (
              <small className="auth-error">{errors.licenseNumber}</small>
            )}
          </div>

          {/* FILE UPLOAD (USA ONLY) */}
          <div className="auth-group auth-action-group">
            {formData.country === "USA" ? (
              <div className="auth-upload-wrapper">
                <input
                  type="file"
                  name="verificationFile"      // ✅ VERY IMPORTANT
                  id="file-upload"
                  className="auth-file-input-hidden"
                  accept=".pdf,.jpg,.png"
                  onChange={handleFileUpload}
                  onBlur={handleBlur}
                />
                <label htmlFor="file-upload" className="btn-secondary">
                  Upload Doc
                </label>

                {fileName && (
                  <span className="auth-file-name">{fileName}</span>
                )}

                {touched.verificationFile && errors.verificationFile && (
                  <small className="auth-error d-block mt-1">
                    {errors.verificationFile}
                  </small>
                )}
              </div>
            ) : (
              <button type="button" className="auth-btn-secondary auth-btn-sm">
                Validate Now
              </button>
            )}
          </div>
        </div>

        {/* LICENSE TYPE */}
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
                onBlur={handleBlur}
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

      {/* ================= REGISTERED ADDRESS ================= */}
      <section className="auth-section">
        <h3 className="auth-section-title">Registered Address</h3>

        <div className="projects-grid">
          {/* STREET */}
          <div className="auth-group auth-span-2">
            <label className="auth-label">Street Address</label>
            <input
              type="text"
              name="street"
              className={`auth-input ${
                touched.street && errors.street ? "is-invalid" : ""
              }`}
              placeholder="123 Business Street"
              value={formData.street}
              onChange={handleInputChange}
              onBlur={handleBlur}
            />
            {touched.street && errors.street && (
              <small className="auth-error">{errors.street}</small>
            )}
          </div>

          {/* CITY */}
          <div className="auth-group">
            <label className="auth-label">City</label>
            <input
              type="text"
              name="city"
              className={`auth-input ${
                touched.city && errors.city ? "is-invalid" : ""
              }`}
              placeholder={formData.country === "India" ? "Bengaluru" : "New York"}
              value={formData.city}
              onChange={handleInputChange}
              onBlur={handleBlur}
            />
            {touched.city && errors.city && (
              <small className="auth-error">{errors.city}</small>
            )}
          </div>

          {/* STATE (USA ONLY) */}
          {formData.country === "USA" && (
            <div className="auth-group">
              <label className="auth-label">State</label>
              <select
                name="state"
                className={`auth-input auth-select ${
                  touched.state && errors.state ? "is-invalid" : ""
                }`}
                value={formData.state}
                onChange={handleInputChange}
                onBlur={handleBlur}
              >
                <option value="">Select State</option>
                <option value="CA">California</option>
                <option value="NY">New York</option>
                <option value="TX">Texas</option>
                <option value="FL">Florida</option>
              </select>
              {touched.state && errors.state && (
                <small className="auth-error">{errors.state}</small>
              )}
            </div>
          )}

          {/* ZIP / POSTAL */}
          <div className="auth-group">
            <label className="auth-label">
              {formData.country === "USA" ? "Zip Code" : "Postal Code"}
            </label>
            <input
              type="text"
              name="zipCode"
              className={`auth-input ${
                touched.zipCode && errors.zipCode ? "is-invalid" : ""
              }`}
              placeholder={formData.country === "USA" ? "10001" : "560001"}
              value={formData.zipCode}
              onChange={handleInputChange}
              onBlur={handleBlur}
            />
            {touched.zipCode && errors.zipCode && (
              <small className="auth-error">{errors.zipCode}</small>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default StepVerify;
