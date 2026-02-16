import React from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import "./WorkAndProgress.css";

function WorkAndPreference({ job }) {
  return (
    <div>
      {/* Work Authorization Section */}
      <div className="section">
        <h2 className="section-title">Work Authorization</h2>
        <div className="options-grid">

          <Option label="US Citizen" value={job?.isUSCitizen} />
          <Option label="GC" value={job?.isGC} />
          <Option label="H1B" value={job?.isH1B} />
          <Option label="EAD (OPT/CPT/GC/H4)" value={job?.isEAD} />

        </div>
      </div>

      {/* Preferred Employment Section */}
      <div className="section">
        <h2 className="section-title">Preferred Employment</h2>
        <div className="options-grid">

          <Option label="Corp-Corp" value={job?.isCorpToCorp} />
          <Option label="W2-Permanent" value={job?.isW2Permanent} />
          <Option label="W2-Contract" value={job?.isW2Contract} />
          <Option label="1099-Contract" value={job?.is1099Contract} />
          <Option label="Contract to Hire" value={job?.isContractToHire} />

        </div>
      </div>
    </div>
  );
}

/* Reusable Option Component */
const Option = ({ label, value }) => {
  const isTrue = value === true;

  return (
    <div className={`option-item ${isTrue ? "authorized preferred" : "not-authorized not-preferred"}`}>
      <div className="status-icon">
        {isTrue ? <FaCheck /> : <FaTimes />}
      </div>
      <span className="option-text">{label}</span>
    </div>
  );
};

export default WorkAndPreference;
