import React from "react";
import {
  FiMapPin,
  FiBriefcase,
  FiMail,
  FiEdit,
  FiPhone,
  FiLinkedin,
  FiArrowLeft,
  FiUsers,
  FiCalendar,
  FiGlobe,
  FiBell,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useGetRecruiterProfileQuery } from "../../State-Management/Api/RecruiterProfileApiSlice";
import "./ProfilePage.css";

const ProfilePage = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("CompanyId");
   const adminName = localStorage.getItem("adminFirstName");

  const { data: apiData, isLoading } = useGetRecruiterProfileQuery(
    Number(userId),
    { skip: !userId }
  );


  

  const companyData = apiData
    ? {
        id: apiData.authInfoID,
        name: apiData.fullName,
        companyname: apiData.companyName,
        size: "100-200",
        status: "Active",
        industry: apiData.role,
        foundedYear: apiData.createdate,
        websiteUrl: "",
        domain: "",
        headquarters: {
          city: apiData.city,
          state: apiData.state,
          country: apiData.country,
          postalCode: apiData.postalCode,
          street1: apiData.streetAddress1,
          street2: apiData.streetAddress2,
        },
        description: apiData.description,
        contact: {
          email: apiData.emailid,
          phone: apiData.phone,
          linkedinUrl: apiData.linkedinURL,
        },
        role: apiData.role,
        company: apiData.company,
        startYear: apiData.startYear,
        endYear: apiData.endYear,
        experience: apiData.experience,
        jobtitle: apiData.jobtitle,
        education: apiData.education,
        languagesSpoken: apiData.languagesSpoken
          ? apiData.languagesSpoken.split(",")
          : [],
        referredBy: apiData.referedBy,
        referredBy: adminName,
        profilePhoto: apiData.profilePhoto,
      }
    : null;

  if (isLoading || !companyData) return null;

  const onEdit = () => navigate("/user/edit-profile");

  const workExperiences = companyData.jobtitle
    ? [
        {
          title: companyData.jobtitle,
          company: companyData.company,
          start: companyData.startYear,
          end: companyData.endYear || "Present",
        },
      ]
    : [];

  /* token math (placeholder) */
  const totalTokens = 0;
  const usedTokens  = 0;
  const leftTokens  = totalTokens - usedTokens;
  // const usedPct     = Math.round((usedTokens / totalTokens) * 100);
  const usedPct     = 0;

  return (
    <div className="projects-container">

      {/* Breadcrumb */}
      <div className="profile-breadcrumb">
        <button className="link-button" onClick={() => navigate("/user/user-dashboard")}>
          <FiArrowLeft size={13} /> Back to Dashboard
        </button>
        <span className="crumb">/ Profile</span>
      </div>

      <div className="pp-layout">

        {/* ══════════ LEFT MAIN COLUMN ══════════ */}
        <div className="pp-main-col">

          {/* ── Top Row: Hero + Tokens side by side ── */}
          <div className="pp-top-row">

            {/* Hero Card */}
            <div className="project-card pp-hero-card">
              <div className="pp-hero-cover" />
              <div className="pp-hero-content">

                {/* Avatar */}
                <div className="pp-avatar-wrap">
                  {companyData.profilePhoto ? (
                    <img
                      src={
                        companyData.profilePhoto.startsWith("http")
                          ? `${companyData.profilePhoto}?t=${Date.now()}`
                          : `https://webapidev.benmyl.com/${companyData.profilePhoto}?t=${Date.now()}`
                      }
                      alt="Profile"
                      className="profile-avatar-lg"
                    />
                  ) : (
                    <div className="profile-avatar-placeholder">
                      {companyData.name?.charAt(0)}
                    </div>
                  )}
                  <span className="pp-status-dot" />
                </div>

                {/* Body */}
                <div className="pp-hero-body">
                  <div className="pp-hero-top">
                    <h1 className="pp-name">{companyData.name}</h1>
                    <span className="pp-status-badge">{companyData.status}</span>
                  </div>

                  <div className="pp-company">{companyData.companyname}</div>

                  <div className="pp-meta-row">
                    <span className="pp-meta-item">
                      <FiBriefcase size={13} /> {companyData.industry}
                    </span>
                    <span className="pp-meta-item">
                      <FiMapPin size={13} />
                      {companyData.headquarters.city}, {companyData.headquarters.state}
                    </span>
                  </div>

                  <div className="pp-about-label">About</div>
                  <div className="pp-about-text">{companyData.description}</div>
                </div>
              </div>
            </div>

            {/* Tokens Card */}
            <div className="project-card pp-tokens-card">
              <div className="pp-section-header">
                <span className="pp-section-header-text">Tokens</span>
                <span className="pp-section-header-line" />
              </div>

              <div className="pp-tokens-grid">
                <div className="pp-token-row">
                  <span className="pp-token-label">Total Tokens</span>
                  <span className="pp-token-badge pp-token-total">{totalTokens}</span>
                </div>
                <div className="pp-token-row">
                  <span className="pp-token-label">Tokens Used</span>
                  <span className="pp-token-badge pp-token-used">{usedTokens}</span>
                </div>
                <div className="pp-token-row">
                  <span className="pp-token-label">Tokens Left</span>
                  <span className="pp-token-badge pp-token-left">{leftTokens}</span>
                </div>
              </div>

              <div className="pp-token-progress-wrap">
                <div className="pp-token-progress-label">
                  <span>Usage</span>
                  <span>{usedPct}% used</span>
                </div>
                <div className="pp-token-bar">
                  <div className="pp-token-bar-fill" style={{ width: `${usedPct}%` }} />
                </div>
              </div>
            </div>

          </div>{/* end pp-top-row */}

          {/* ── Bottom 3-column row ── */}
          <div className="pp-bottom-row">

            {/* Notification Preferences */}
            <div className="project-card" style={{ marginBottom: 0 }}>
              <div className="pp-section-header">
                <span className="pp-section-header-text">Notifications</span>
                <span className="pp-section-header-line" />
              </div>
              <div className="pp-notif-list">
                {["Email Notifications", "SMS Notifications", "Push Notifications", "Do Not Disturb"].map(label => (
                  <div className="pp-notif-item" key={label}>
                    <span className="pp-notif-label">{label}</span>
                    <span className="pp-notif-check">✓</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Work Experience */}
            <div className="project-card" style={{ marginBottom: 0 }}>
              <div className="pp-section-header">
                <span className="pp-section-header-text">Work Experience</span>
                <span className="pp-section-header-line" />
              </div>

              <div className="pp-exp-list">
                {workExperiences.length > 0 ? (
                  workExperiences.map((exp, i) => (
                    <div className="pp-exp-item" key={i}>
                      <div className="pp-exp-icon">
                        <FiBriefcase size={16} />
                      </div>
                      <div>
                        <p className="pp-exp-title">{exp.title}</p>
                        <span className="pp-exp-sub">
                          {exp.company} &bull; {exp.start} — {exp.end}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <span style={{ fontSize: "13px", color: "#94a3b8" }}>—</span>
                )}
              </div>

              <hr className="pp-exp-divider" />
              <div className="pp-exp-total">
                <span className="pp-exp-total-label">Total Experience</span>
                <span className="pp-exp-total-val">
                  {companyData.experience ? `${companyData.experience} Years` : "—"}
                </span>
              </div>
            </div>

            {/* Additional Information */}
            <div className="project-card" style={{ marginBottom: 0 }}>
              <div className="pp-section-header">
                <span className="pp-section-header-text">Additional Information</span>
                <span className="pp-section-header-line" />
              </div>
              <div className="pp-info-list">
                <div className="pp-info-row">
                  <span className="pp-info-key">Job Title</span>
                  <span className="pp-info-val">{companyData.jobtitle || "—"}</span>
                </div>
                <div className="pp-info-row">
                  <span className="pp-info-key">Experience</span>
                  <span className="pp-info-val">
                    {companyData.experience ? `${companyData.experience} Years` : "—"}
                  </span>
                </div>
                <div className="pp-info-row">
                  <span className="pp-info-key">Education</span>
                  <span className="pp-info-val">{companyData.education || "—"}</span>
                </div>
                <div className="pp-info-row">
                  <span className="pp-info-key">Languages</span>
                  <div className="pp-lang-chips">
                    {companyData.languagesSpoken?.length > 0
                      ? companyData.languagesSpoken.map((lang, i) => (
                          <span className="status-tag status-progress d-flex gap-3" key={i}>{lang.trim()}</span>
                        ))
                      : <span className="pp-info-val">—</span>}
                  </div>
                </div>
                <div className="pp-info-row">
                  <span className="pp-info-key">Referred By</span>
                  <span className="pp-info-val">{companyData.referredBy || "—"}</span>
                </div>
              </div>
            </div>

          </div>{/* end pp-bottom-row */}
        </div>

        {/* ══════════ RIGHT SIDEBAR ══════════ */}
        <div className="pp-sidebar">

          {/* Edit button */}
          <button className="btn-secondary w-100 d-flex gap-2" onClick={onEdit}>
            <FiEdit size={15} /> <span>Edit Profile</span> 
          </button>

          {/* Company Information */}
          <div className="pp-sidebar-card">
            <div className="pp-section-header">
              <span className="pp-section-header-text">Company Information</span>
              <span className="pp-section-header-line" />
            </div>
            <div className="pp-contact-list">
              <div className="pp-contact-item">
                <span className="pp-contact-icon"><FiBriefcase size={13} /></span>
                Company: {companyData.companyname || "—"}
              </div>
              <div className="pp-contact-item">
                <span className="pp-contact-icon"><FiBriefcase size={13} /></span>
                Industry: {companyData.industry || "—"}
              </div>
              <div className="pp-contact-item">
                <span className="pp-contact-icon"><FiMapPin size={13} /></span>
                Location: {companyData.headquarters.city}, {companyData.headquarters.state}
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="pp-sidebar-card">
            <div className="pp-section-header">
              <span className="pp-section-header-text">Contact</span>
              <span className="pp-section-header-line" />
            </div>
            <div className="pp-contact-list">
              <div className="pp-contact-item">
                <span className="pp-contact-icon"><FiMail size={13} /></span>
                <a href={`mailto:${companyData.contact.email}`}>
                  {companyData.contact.email}
                </a>
              </div>
              <div className="pp-contact-item">
                <span className="pp-contact-icon"><FiPhone size={13} /></span>
                {companyData.contact.phone}
              </div>
              <div className="pp-contact-item">
                <span className="pp-contact-icon"><FiLinkedin size={13} /></span>
                <a href={companyData.contact.linkedinUrl} target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
