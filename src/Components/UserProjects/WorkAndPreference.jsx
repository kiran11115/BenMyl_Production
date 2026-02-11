import React from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import "./WorkAndProgress.css"

function WorkAndPreference() {
  return (
    <div className="">
      {/* Work Authorization Section */}
      <div className="section">
        <h2 className="section-title">Work Authorization</h2>
        <div className="options-grid">
          <div className="option-item authorized">
            <div className="status-icon"><FaCheck /></div>
            <span className="option-text">US Citizen</span>
          </div>
          <div className="option-item authorized">
            <div className="status-icon"><FaCheck /></div>
            <span className="option-text">GC</span>
          </div>
          <div className="option-item not-authorized">
            <div className="status-icon"><FaTimes /></div>
            <span className="option-text">H1B</span>
          </div>
          <div className="option-item not-authorized">
            <div className="status-icon"><FaTimes /></div>
            <span className="option-text">EAD (OPT/CPT/GC/H4)</span>
          </div>
        </div>
      </div>

      {/* Preferred Employment Section */}
      <div className="section">
        <h2 className="section-title">Preferred Employment</h2>
        <div className="options-grid">
          <div className="option-item preferred">
            <div className="status-icon"><FaCheck /></div>
            <span className="option-text">Corp-Corp</span>
          </div>
          <div className="option-item not-preferred">
            <div className="status-icon"><FaTimes /></div>
            <span className="option-text">W2-Permanent</span>
          </div>
          <div className="option-item preferred">
            <div className="status-icon"><FaCheck /></div>
            <span className="option-text">W2-Contract</span>
          </div>
          <div className="option-item not-preferred">
            <div className="status-icon"><FaTimes /></div>
            <span className="option-text">1099-Contract</span>
          </div>
          <div className="option-item not-preferred">
            <div className="status-icon"><FaTimes /></div>
            <span className="option-text">Contract to Hire</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkAndPreference