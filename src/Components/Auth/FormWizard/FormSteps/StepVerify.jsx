import React, { useState } from "react";
import { State, City } from "country-state-city";
import { FiFile } from "react-icons/fi";

const countryIsoMap = {
  USA: "US",
  India: "IN",
  UK: "GB",
  UAE: "AE"
};

/* ── Required documents per country ── */
const uploadTypeOptions = {
  USA: [
    "IRS EIN Confirmation Letter (CP 575 or 147C)",
    "Government ID",
    "Proof of Business Address"
  ],
  India: [
    "GST Registration Certificate",
    "PAN Card Copy",
    "Government ID",
    "Proof of Business Address"
  ],
  UK: [
    "Certificate of Incorporation",
    "VAT Registration Certificate",
    "Government ID",
    "Proof of Business Address"
  ],
  UAE: [
    "Trade License Copy",
    "TRN Certificate",
    "Government ID",
    "Proof of Business Address"
  ]
};

/* ── Format hints per license type ── */
const licenseFormatHint = {
  EIN:   "Format: XX-XXXXXXX  (e.g. 12-3456789)",
  PAN:   "Format: AAAAA9999A  (5 letters · 4 digits · 1 letter)",
  GSTIN: "Format: 29AACCC1234D1Z5",
  UDYAM: "Format: UDYAM-XX-00-0000000",
  FSSAI: "14-digit number",
  CRN:   "Format: 12345678",
  VAT:   "Format: GB123456789",
  TL:    "Enter Trade License number",
  TRN:   "Format: 100-xxxx-xxxxxxx",
};

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
  setFieldValue,
}) => {
  const countryCode = countryIsoMap[formData.country] || "US";
  const states = State.getStatesOfCountry(countryCode);

  const stateObj = states.find(
    (s) =>
      s.name.toLowerCase() === formData.state?.toLowerCase() ||
      s.isoCode.toLowerCase() === formData.state?.toLowerCase()
  );
  const selectedStateValue = stateObj ? stateObj.isoCode : "";

  const cities = selectedStateValue
    ? City.getCitiesOfState(countryCode, selectedStateValue)
    : [];

  const onStateSelect = (e) => {
    const stateIsoCode = e.target.value;
    const selectedStateObj = states.find((s) => s.isoCode === stateIsoCode);
    const stateName = selectedStateObj ? selectedStateObj.name : "";
    setFieldValue("state", stateName);
    setFieldValue("city", "");
  };

  const onCitySelect = (e) => {
    const cityName = e.target.value;
    setFieldValue("city", cityName);
  };

  /* ── Local state for file preview ── */
  const [previewUrl, setPreviewUrl] = React.useState(null);
  const [previewType, setPreviewType] = React.useState(null);

  /* ── Local state for upload progress ── */
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);

  React.useEffect(() => {
    if (formData.verificationFile) {
      const file = formData.verificationFile;
      if (file.type === "application/pdf") {
        setPreviewUrl(URL.createObjectURL(file));
        setPreviewType("pdf");
      } else if (file.type?.startsWith("image/")) {
        setPreviewUrl(URL.createObjectURL(file));
        setPreviewType("image");
      }
    } else {
      setPreviewUrl(null);
      setPreviewType(null);
    }
  }, [formData.verificationFile]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Save fake event since synthetic event may be nullified
    const fakeEvent = { target: { files: [file] } };

    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
          handleFileUpload(fakeEvent);
        }, 300);
      }
    }, 200);
  };

  const clearFile = () => {
    setPreviewUrl(null);
    setPreviewType(null);
    setFieldValue("verificationFile", null);
  };

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
            <label className="auth-label">{getLicenseLabel()}<span style={{ color: '#ef4444' }}> *</span></label>
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
            {/* Format hint */}
            {licenseFormatHint[formData.licenseType] && (
              <small style={{ color: "#64748b", fontSize: "11px", marginTop: "4px", display: "block" }}>
                {licenseFormatHint[formData.licenseType]}
              </small>
            )}
            {touched.licenseNumber && errors.licenseNumber && (
              <small className="auth-error">{errors.licenseNumber}</small>
            )}
          </div>

          {/* FILE UPLOAD */}
          <div className="auth-group auth-action-group">
            <label className="auth-label">Verification Document<span style={{ color: '#ef4444' }}> *</span></label>

            {/* Document Type Selector */}
            <div className="auth-select-wrapper" style={{ marginBottom: "12px" }}>
              <select
                name="docUploadType"
                className={`auth-input auth-select ${
                  touched.docUploadType && errors.docUploadType ? "is-invalid" : ""
                }`}
                value={formData.docUploadType || ""}
                onChange={handleInputChange}
                onBlur={handleBlur}
              >
                <option value="">Select Document Type</option>
                {(uploadTypeOptions[formData.country] || []).map((doc) => (
                  <option key={doc} value={doc}>
                    {doc}
                  </option>
                ))}
              </select>
              {touched.docUploadType && errors.docUploadType && (
                <small className="auth-error mt-1 d-block" style={{ marginTop: "4px" }}>
                  {errors.docUploadType}
                </small>
              )}
            </div>

            {isUploading ? (
              <div
                style={{
                  border: "2px solid #e2e8f0",
                  borderRadius: "10px",
                  padding: "24px 14px",
                  textAlign: "center",
                  background: "#f8faff",
                }}
              >
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#5b5bd6", marginBottom: "12px" }}>
                  Verifying &amp; Uploading Document...
                </div>
                <div style={{ height: "6px", background: "#e2e8f0", borderRadius: "10px", overflow: "hidden", margin: "0 auto", width: "80%" }}>
                  <div style={{ height: "100%", width: `${uploadProgress}%`, background: "#5b5bd6", transition: "width 0.25s ease" }} />
                </div>
                <div style={{ fontSize: "11px", color: "#64748b", marginTop: "8px" }}>
                  {uploadProgress}% Complete
                </div>
              </div>
            ) : !previewUrl ? (
              /* Drop / Upload zone */
              <div
                style={{
                  border: "2px dashed #c7d2fe",
                  borderRadius: "10px",
                  padding: "18px 14px",
                  textAlign: "center",
                  background: "#f8faff",
                  cursor: "pointer",
                  position: "relative",
                }}
                onClick={() => document.getElementById("file-upload").click()}
              >
                <input
                  type="file"
                  name="verificationFile"
                  id="file-upload"
                  className="auth-file-input-hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  onBlur={handleBlur}
                  style={{ display: "none" }}
                />
                <div style={{ fontSize: "22px", marginBottom: "6px", color: "#5b5bd6" }}> <FiFile/> </div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#5b5bd6" }}>
                  Click to upload
                </div>
                <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
                  PDF supported · JPG / PNG also accepted
                </div>
              </div>
            ) : (
              /* Preview area */
              <div
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  overflow: "hidden",
                  background: "#f8faff",
                  position: "relative",
                }}
              >
                {previewType === "pdf" ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      padding: "16px",
                      gap: "8px",
                    }}
                  >
                    <div style={{ fontSize: "28px", color: "#5b5bd6" }}> <FiFile/> </div>
                    <span style={{ fontSize: "12px", color: "#334155", fontWeight: 600, wordBreak: "break-all", textAlign: "center" }}>
                      {fileName}
                    </span>
                    <a
                      href={previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: "11px", color: "#5b5bd6", textDecoration: "underline" }}
                    >
                      Preview PDF
                    </a>
                  </div>
                ) : (
                  <img
                    src={previewUrl}
                    alt="Uploaded doc"
                    style={{ width: "100%", maxHeight: "120px", objectFit: "contain", display: "block", padding: "8px" }}
                  />
                )}
                {/* Clear button */}
                <button
                  type="button"
                  onClick={clearFile}
                  style={{
                    position: "absolute",
                    top: "6px",
                    right: "8px",
                    background: "#ef4444",
                    border: "none",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    fontSize: "11px",
                    color: "#fff",
                    cursor: "pointer",
                    lineHeight: "20px",
                    textAlign: "center",
                    padding: 0,
                  }}
                >
                  ✕
                </button>
              </div>
            )}

            {touched.verificationFile && errors.verificationFile && (
              <small className="auth-error d-block mt-1">
                {errors.verificationFile}
              </small>
            )}

            {/* PDF note */}
            <small
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "11px",
                color: "#94a3b8",
                marginTop: "6px",
              }}
            >
              <span style={{ color: "#ef4444" }}>*</span> PDF format is recommended for best compatibility
            </small>

            {/* Document requirement hint */}
            <div
              style={{
                marginTop: "12px",
                padding: "10px",
                background: "#f8faff",
                border: "1px solid #c7d2fe",
                borderRadius: "6px",
                fontSize: "11px",
                color: "#475569",
                lineHeight: "1.5"
              }}
            >
              <strong style={{ color: "#5b5bd6" }}>Accepted Documents (Upload ANY ONE):</strong><br />
              <ul style={{ margin: "4px 0 0 0", paddingLeft: "20px" }}>
                {(uploadTypeOptions[formData.country] || []).map((doc, idx) => (
                  <li key={idx} style={{ marginBottom: "2px" }}>{doc}</li>
                ))}
              </ul>
            </div>
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

        <div className="auth-address-grid">
          {/* STREET */}
          <div className="auth-group auth-span-2">
            <label className="auth-label">Street Address<span style={{ color: '#ef4444' }}> *</span></label>
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

           {/* STATE */}
          <div className="auth-group">
            <label className="auth-label">State<span style={{ color: '#ef4444' }}> *</span></label>
            {states.length > 0 ? (
              <div className="auth-select-wrapper">
                <select
                  name="state"
                  className={`auth-input auth-select ${
                    touched.state && errors.state ? "is-invalid" : ""
                  }`}
                  value={selectedStateValue}
                  onChange={onStateSelect}
                  onBlur={handleBlur}
                >
                  <option value="">Select State</option>
                  {states.map((s) => (
                    <option key={s.isoCode} value={s.isoCode}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <input
                type="text"
                name="state"
                className={`auth-input ${
                  touched.state && errors.state ? "is-invalid" : ""
                }`}
                placeholder="Enter State"
                value={formData.state}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
            )}
            {touched.state && errors.state && (
              <small className="auth-error">{errors.state}</small>
            )}
          </div>

          {/* CITY */}
          <div className="auth-group">
            <label className="auth-label">City<span style={{ color: '#ef4444' }}> *</span></label>
            {selectedStateValue && cities.length > 0 ? (
              <div className="auth-select-wrapper">
                <select
                  name="city"
                  className={`auth-input auth-select ${
                    touched.city && errors.city ? "is-invalid" : ""
                  }`}
                  value={formData.city}
                  onChange={onCitySelect}
                  onBlur={handleBlur}
                >
                  <option value="">Select City</option>
                  {cities.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
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
                disabled={!formData.state}
              />
            )}
            {touched.city && errors.city && (
              <small className="auth-error">{errors.city}</small>
            )}
          </div>

          {/* ZIP / POSTAL */}
          <div className="auth-group">
            <label className="auth-label">
              {formData.country === "USA" ? "Zip Code" : "Postal Code"}<span style={{ color: '#ef4444' }}> *</span>
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
