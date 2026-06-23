import React from "react";
import { FiMail, FiMapPin, FiUsers, FiCalendar, FiGlobe } from "react-icons/fi";
import "./ProfilePreviewPanel.css";

const ProfilePreviewPanel = ({ data, logoPreview, roleBadge = "ADMIN" }) => {
  return (
      <div className="profile-preview-panel">
        <div className="preview-hero-banner">
          <div className="preview-hero-content">
            <div className="d-flex align-items-center mb-3">
              <div className="preview-avatar-wrapper">
                <img
                  src={logoPreview || "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=300"}
                  alt="Company Logo"
                  className="preview-avatar"
                />
                <div className="preview-avatar-dot"></div>
              </div>
              <div>
                <div className="preview-name-row">
                  <h1 className="preview-name">{data.companyname || "Mylas Recruiting Solutions"}</h1>
                </div>
                <div className="preview-badges">
                  <span className="preview-badge badge-admin">{roleBadge}</span>
                  <span className="preview-badge badge-plan">ENTERPRISE PLAN</span>
                  <span className="preview-badge badge-tokens">$150 Tokens</span>
                </div>
              </div>
            </div>

            <div className="preview-contact-row">
              <div className="preview-contact-item">
                <FiMail />
                <span>{data.Emailid || "info@mylastech.com"}</span>
              </div>
              <div className="preview-contact-item">
                <FiMapPin />
                <span>
                  {data.City ? `${data.City}, ` : ""}{data.State ? `${data.State}, ` : ""}{data.Country || "US"}
                </span>
              </div>
            </div>

            <div className="preview-glass-card">
              <div className="preview-stat-item">
                <FiUsers />
                <span className="preview-stat-label">Company:</span>
                <span className="preview-stat-value">
                  {(!localStorage.getItem("CompanyName") || localStorage.getItem("CompanyName") === "null") ? "N/A" : localStorage.getItem("CompanyName")}
                </span>
              </div>
              <div className="preview-stat-item">
                <FiCalendar />
                <span className="preview-stat-label">Industry:</span>
                <span className="preview-stat-value">
                  {(!localStorage.getItem("Industry") || localStorage.getItem("Industry") === "null") ? "N/A" : localStorage.getItem("Industry")}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="preview-body">
          <h2 className="preview-section-title">About</h2>
          <div className="preview-desc">
            {data.Description ||
              "An innovative information technology company specializing in digital solutions, software development, IT consulting, and workforce staffing services. The company delivers scalable technology solutions tailored to modern business needs while connecting organizations with highly skilled professionals across diverse industries. With expertise in recruitment, talent acquisition, contract staffing, permanent hiring, and project-based workforce solutions, the organization helps businesses build str"}
          </div>

          <hr className="preview-divider" />

          <h2 className="preview-section-title">Work</h2>
          <div className="preview-work-item">
            <FiGlobe className="preview-work-icon" />
            {data.companyname || "Mylas Recruiting Solutions"}
          </div>
        </div>
      </div>
  );
};

export default ProfilePreviewPanel;
