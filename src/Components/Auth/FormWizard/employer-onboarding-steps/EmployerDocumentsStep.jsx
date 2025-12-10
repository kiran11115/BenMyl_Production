import React, { useRef } from "react";

export default function EmployerDocumentsStep({
  state,
  onChange,
  onNext,
  onBack,
}) {
  const docs = state.documents || {};
  const govIdInputRef = useRef(null);
  const taxCertInputRef = useRef(null);

  const handleFileChange = (key, files) => {
    onChange({ documents: { ...docs, [key]: files?.[0] || null } });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form className="wizard-card" onSubmit={handleSubmit}>
      <h2 className="wizard-card-title">Document Upload</h2>
      <p className="wizard-card-subtitle">
        Upload the required documents to verify your business.
      </p>

      <div className="wizard-upload-grid">
        {/* Government ID */}
        <div className="wizard-upload-card">
          <div className="wizard-upload-icon">@</div>
          <h3 className="wizard-upload-title">CIN No</h3>
          <p className="wizard-upload-subtitle">
            Upload a valid government-issued CIN document.
          </p>
          <p className="wizard-upload-meta">
            Supported formats: PDF, JPG, PNG (max 5MB)
          </p>

          <input
            ref={govIdInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            style={{ display: "none" }}
            onChange={(e) =>
              handleFileChange("cin", e.target.files)
            }
          />

          <button
            type="button"
            className="auth-btn-secondary wizard-upload-btn"
            onClick={() => govIdInputRef.current?.click()}
          >
            {docs.cin ? docs.cin.name : "Choose File"}
          </button>
        </div>

        {/* Tax certificate */}
        <div className="wizard-upload-card">
          <div className="wizard-upload-icon">📄</div>
          <h3 className="wizard-upload-title">Tax Certificate</h3>
          <p className="wizard-upload-subtitle">
            Upload your latest tax certificate or registration.
          </p>
          <p className="wizard-upload-meta">
            Supported formats: PDF, JPG, PNG (max 5MB)
          </p>

          <input
            ref={taxCertInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            style={{ display: "none" }}
            onChange={(e) =>
              handleFileChange("taxCertificate", e.target.files)
            }
          />

          <button
            type="button"
            className="auth-btn-secondary wizard-upload-btn"
            onClick={() => taxCertInputRef.current?.click()}
          >
            {docs.taxCertificate
              ? docs.taxCertificate.name
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
