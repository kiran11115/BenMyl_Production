// StepDocuments.jsx
import React, { useRef } from "react";
import { File } from "lucide-react";

export default function StepDocuments({ data, patch, onNext, onBack }) {
  const docs = data.documents || {};
  const isIndividual = data.accountType === "individual";

  const firstRef = useRef(null);
  const secondRef = useRef(null);

  const setFile = (key, files) =>
    patch({ documents: { ...docs, [key]: files?.[0] || null } });

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  // Labels based on selection
  const firstLabel = isIndividual ? "Government ID" : "CIN No";
  const firstDesc = isIndividual
    ? "Upload a valid government‑issued ID (Passport, Driver’s License)."
    : "Upload a valid government‑issued CIN document.";
  const firstKey = isIndividual ? "govId" : "cin";

  const secondLabel = isIndividual ? "Address Proof" : "Tax Certificate";
  const secondDesc = isIndividual
    ? "Upload a recent utility bill or bank statement that confirms your address."
    : "Upload your latest tax certificate or registration.";
  const secondKey = isIndividual ? "addressProof" : "taxCertificate";

  return (
    <form className="wizard-card" onSubmit={handleSubmit}>
      <h2 className="wizard-card-title">Document Upload</h2>
      <p className="wizard-card-subtitle">
        Upload the required documents to verify your{" "}
        {isIndividual ? "identity" : "business"}.
      </p>

      <div className="wizard-upload-grid">
        {/* First Card */}
        <div className="wizard-upload-card">
          <div className="wizard-upload-icon">@</div>
          <h3 className="wizard-upload-title">{firstLabel}</h3>
          <p className="wizard-upload-subtitle">{firstDesc}</p>
          <p className="wizard-upload-meta">
            Supported formats: PDF, JPG, PNG (max 5MB)
          </p>

          <input
            ref={firstRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            style={{ display: "none" }}
            onChange={(e) => setFile(firstKey, e.target.files)}
          />

          <button
            type="button"
            className="auth-btn-secondary wizard-upload-btn"
            onClick={() => firstRef.current?.click()}
          >
            {docs[firstKey] ? docs[firstKey].name : "Choose File"}
          </button>
        </div>

        {/* Second Card */}
        <div className="wizard-upload-card">
          <div className="wizard-upload-icon"><File/></div>
          <h3 className="wizard-upload-title">{secondLabel}</h3>
          <p className="wizard-upload-subtitle">{secondDesc}</p>
          <p className="wizard-upload-meta">
            Supported formats: PDF, JPG, PNG (max 5MB)
          </p>

          <input
            ref={secondRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            style={{ display: "none" }}
            onChange={(e) => setFile(secondKey, e.target.files)}
          />

          <button
            type="button"
            className="auth-btn-secondary wizard-upload-btn"
            onClick={() => secondRef.current?.click()}
          >
            {docs[secondKey] ? docs[secondKey].name : "Choose File"}
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
