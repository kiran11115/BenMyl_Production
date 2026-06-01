import React from "react";
import { FaCheck } from "react-icons/fa";
import "./WorkAndProgress.css";

function WorkAndPreference({ job }) {
  const authorizations = [
    { label: "OPT", value: job?.isOPT },
    { label: "CPT", value: job?.isCPT },
    { label: "H1B", value: job?.isH1B },
    { label: "EAD", value: job?.isEAD },
    { label: "GC", value: job?.isGC },
    { label: "H4", value: job?.isH4 },
    { label: "Citizenship", value: job?.isUSCitizen },
  ].filter(item => item.value === true);

  const preferences = [
    { label: "Corp-Corp", value: job?.isCorpToCorp },
    { label: "W2-Permanent", value: job?.isW2Permanent },
    { label: "W2-Contract", value: job?.isW2Contract },
    { label: "1099-Contract", value: job?.is1099Contract },
    { label: "Contract to Hire", value: job?.isContractToHire },
  ].filter(item => item.value === true);

  return (
    <div>
      {/* Work Authorization Section */}
      <div className="section">
        <h2 className="section-title">Work Authorization</h2>
        <div className="options-grid">
          {authorizations.length > 0 ? (
            authorizations.map(auth => (
              <Option key={auth.label} label={auth.label} value={true} />
            ))
          ) : (
            <span style={{ fontSize: "12px", color: "#64748b", fontStyle: "italic" }}>
              No specific work authorization requirements configured.
            </span>
          )}
        </div>
      </div>

      {/* Preferred Employment Section */}
      <div className="section">
        <h2 className="section-title">Preferred Employment</h2>
        <div className="options-grid">
          {preferences.length > 0 ? (
            preferences.map(pref => (
              <Option key={pref.label} label={pref.label} value={true} />
            ))
          ) : (
            <span style={{ fontSize: "12px", color: "#64748b", fontStyle: "italic" }}>
              No specific employment preferences configured.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* Reusable Option Component */
const Option = ({ label, value }) => {
  return (
    <div className="option-item authorized preferred">
      <div className="status-icon">
        <FaCheck />
      </div>
      <span className="option-text">{label}</span>
    </div>
  );
};

export default WorkAndPreference;

