import React from "react";
import {
  FiMapPin,
  FiBriefcase,
  FiMail,
  FiEdit,
  FiSettings,
  FiPhone,
  FiLinkedin,
  FiFileText,
  FiArrowLeft,
  FiExternalLink,
  FiUsers,
  FiCalendar,
  FiGlobe,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import TeamMembersTable from "./TeamMemberTable";
import { useGetRecruiterProfileQuery } from "../../State-Management/Api/RecruiterProfileApiSlice";


const ProfilePage = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("CompanyId");

  const { data: apiData, isLoading } =
    useGetRecruiterProfileQuery(Number(userId), {
      skip: !userId,
    });

  const companyData = apiData
    ? {
      id: apiData.authInfoID,
      slug: "",
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

      profilePhoto: apiData.profilePhoto

    }
    : null;

  /* ✅ NOW place guard HERE */
  if (isLoading || !companyData) return null;


  const fullAddress = [
    companyData.headquarters?.street1,
    companyData.headquarters?.street2,
    [companyData.headquarters?.city, companyData.headquarters?.state]
      .filter(Boolean)
      .join(", "),
    companyData.headquarters?.postalCode,
    companyData.headquarters?.country,
  ]
    .filter(Boolean)
    .join(" • ");

  const onEdit = () => {
    navigate("/user/edit-profile");
  };

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


  const onAccountSettings = () => {
    navigate("/admin/account-settings");
  };

  return (
    <div className="projects-container">
      {/* Breadcrumb */}
      <div className="profile-breadcrumb d-flex gap-1">
        <button
          className="link-button"
          onClick={() => navigate("/user/user-dashboard")}
        >
          <FiArrowLeft /> Back to Dashboard
        </button>
        <span className="crumb">/ Profile</span>
      </div>

      <div className="dashboard-layout">
        {/* === LEFT MAIN COLUMN === */}
        <div className="dashboard-column-main">
          <div className="row">
            <div className="col-12 col-md-12 col-lg-8 mb-4">
              {/* Company Header Card */}
              <div className="project-card">
                <div className="d-flex gap-3 align-items-start">
                  {/* Profile Photo */}
                  {companyData.profilePhoto && (
                    <img
                      src={
                        companyData.profilePhoto.startsWith("http")
                          ? `${companyData.profilePhoto}?t=${Date.now()}`
                          : `https://webapidev.benmyl.com/${companyData.profilePhoto}?t=${Date.now()}`
                      }
                      alt="Profile"
                      className="profile-avatar-lg"
                    />
                  )}

                  {/* Initials fallback (only when no photo) */}
                  {!companyData.profilePhoto && (
                    <div className="profile-avatar-placeholder">
                      {companyData.name?.charAt(0)}
                    </div>
                  )}

                  <div className="profile-header-content w-100">
                    <div className="d-flex align-items-center justify-content-between gap-3">
                      <h1 className="mb-1">{companyData.name}</h1>
                      {/* Status */}
                      <div className="profile-status-wrapper">
                        <span className="status-tag status-completed">
                          {companyData.status}
                        </span>
                      </div>
                    </div>

                    <div className="card-title mb-2">
                      {companyData.companyname}
                    </div>

                    {/* Meta row */}
                    <div className="profile-meta-row">
                      <span className="meta-item">
                        <FiBriefcase /> {companyData.industry}
                      </span>
                      <span className="meta-item">
                        <FiMapPin /> {companyData.headquarters.city},{" "}
                        {companyData.headquarters.state}
                      </span>
                    </div>

                    {/* About */}
                    <div className="mt-3">
                      <h3 className="card-title mb-2">About</h3>
                      <div className="small text-muted">
                        {companyData.description}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-12 col-lg-4 mb-4">
              <div className="project-card" style={{ height: "200px" }}>
                <h3
                  className="card-title"
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    marginBottom: "10px",
                  }}
                >
                  Tokens
                </h3>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        color: "#444",
                        fontWeight: 500,
                      }}
                    >
                      Total Tokens:
                    </span>
                    <span
                      style={{
                        padding: "3px 10px",
                        fontSize: "12px",
                        fontWeight: 600,
                        borderRadius: "12px",
                        minWidth: "50px",
                        textAlign: "center",
                        background: "#dbeafe", // blue-100
                        color: "#1d4ed8", // blue-700
                      }}
                    >
                      1500
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        color: "#444",
                        fontWeight: 500,
                      }}
                    >
                      Tokens Used:
                    </span>
                    <span
                      style={{
                        padding: "3px 10px",
                        fontSize: "12px",
                        fontWeight: 600,
                        borderRadius: "12px",
                        minWidth: "50px",
                        textAlign: "center",
                        background: "#fee2e2", // red-100
                        color: "#b91c1c", // red-700
                      }}
                    >
                      850
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        color: "#444",
                        fontWeight: 500,
                      }}
                    >
                      Tokens Left:
                    </span>
                    <span
                      style={{
                        padding: "3px 10px",
                        fontSize: "12px",
                        fontWeight: 600,
                        borderRadius: "12px",
                        minWidth: "50px",
                        textAlign: "center",
                        background: "#dcfce7", // green-100
                        color: "#15803d", // green-700
                      }}
                    >
                      650
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-12 col-lg-4 mb-4">
              <div className="project-card" style={{ padding: "14px 16px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    marginBottom: "6px",
                  }}
                >
                  <span style={{ fontSize: "12px", fontWeight: 600 }}>
                    Notifications Preferences
                  </span>
                </div>

                <div />

                {/* Row */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ fontSize: "13px" }}>
                    Email Notifications :
                  </span>
                  <span style={{ color: "#16a34a", fontWeight: 600 }}>✓</span>
                </div>

                {/* Row */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ fontSize: "13px" }}>SMS Notifications :</span>
                  <span style={{ color: "#16a34a", fontWeight: 600 }}>✓</span>
                </div>

                {/* Row */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ fontSize: "13px" }}>Push Notifications :</span>
                  <span style={{ color: "#16a34a", fontWeight: 600 }}>✓</span>
                </div>

                {/* Row */}
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ fontSize: "13px" }}>Do Not Disturb :</span>
                  <span style={{ color: "#16a34a", fontWeight: 600 }}>✓</span>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-12 col-lg-4 mb-4">
              <div className="project-card">
                {/* Header */}
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    marginBottom: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "#111827",
                  }}
                >
                  Work Experience
                </div>

                {/* Experience List */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  {workExperiences.length > 0 ? (
                    workExperiences.map((exp, index) => (
                      <div key={index}>
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "#1f2937",
                            marginBottom: "2px",
                          }}
                        >
                          {exp.title}
                        </div>
                        <div style={{ fontSize: "12px", color: "#6b7280" }}>
                          {exp.company} • {exp.start} — {exp.end}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>-</div>
                  )}
                </div>

                {/* Summary */}
                <div
                  style={{
                    marginTop: "16px",
                    paddingTop: "10px",
                    fontSize: "12px",
                    color: "#6b7280",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Total Experience:</span>
                  <span style={{ fontWeight: 600, color: "#1f2937" }}>
                    {companyData.experience
                      ? `${companyData.experience} Years`
                      : "-"}
                  </span>
                </div>
              </div>
            </div>


            <div className="col-12 col-md-12 col-lg-4 mb-4">
              <div className="project-card">
                {/* Header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    marginBottom: "6px",
                  }}
                >
                  <span style={{ fontSize: "12px", fontWeight: 600 }}>
                    Additional Information
                  </span>
                </div>

                {/* Job Title */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    marginBottom: "10px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      width: "140px",
                      fontWeight: 500,
                    }}
                  >
                    Job Title :
                  </span>
                  <span style={{ fontSize: "13px", color: "#374151" }}>
                    {companyData.jobtitle || "-"}
                  </span>
                </div>

                {/* Experience */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    marginBottom: "10px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      width: "140px",
                      fontWeight: 500,
                    }}
                  >
                    Experience :
                  </span>
                  <span style={{ fontSize: "13px", color: "#374151" }}>
                    {companyData.experience
                      ? `${companyData.experience} Years`
                      : "-"}
                  </span>
                </div>

                {/* Education */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    marginBottom: "16px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      width: "140px",
                      fontWeight: 500,
                    }}
                  >
                    Education :
                  </span>
                  <span style={{ fontSize: "13px", color: "#374151" }}>
                    {companyData.education || "-"}
                  </span>
                </div>

                {/* Languages */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    marginBottom: "12px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      width: "140px",
                      fontWeight: 500,
                    }}
                  >
                    Languages Spoken :
                  </span>

                  <div className="status-tag status-progress d-flex gap-3">
                    {companyData.languagesSpoken?.length > 0
                      ? companyData.languagesSpoken.map((lang, i) => (
                        <span key={i}>{lang}</span>
                      ))
                      : <span>-</span>}
                  </div>
                </div>

                {/* Referred By */}
                <div style={{ display: "flex", alignItems: "flex-start" }}>
                  <span
                    style={{
                      fontSize: "13px",
                      width: "140px",
                      fontWeight: 500,
                    }}
                  >
                    Referred By :
                  </span>
                  <span style={{ fontSize: "13px", color: "#374151" }}>
                    {companyData.referredBy || "-"}
                  </span>
                </div>
              </div>
            </div>


            {/* Team members table */}
            <div className="col-12 mt-3">
              {/* <div className="table-card">
                <TeamMembersTable />
              </div> */}
            </div>
          </div>
        </div>

        {/* === RIGHT SIDE COLUMN === */}
        <div className="dashboard-column-side">
          {/* Actions */}
          <div className="sidebar-actions">
            <button className="btn-primary w-100 gap-2" onClick={onEdit}>
              <FiEdit /> Edit
            </button>

            <button
              className="btn-secondary w-100 gap-2"
              onClick={onAccountSettings}
            >
              <FiSettings /> Account Settings
            </button>
          </div>

          {/* Company Information */}
          <div className="table-card sidebar-card">
            <h3 className="card-title">Company information</h3>
            <div className="contact-list">
              <div className="contact-item">
                <FiGlobe className="contact-icon" />{" "}
                <a
                  href={companyData.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {companyData.domain}
                </a>
              </div>
              <div className="contact-item">
                <FiBriefcase className="contact-icon" /> Industry:{" "}
                {companyData.industry}
              </div>
              <div className="contact-item">
                <FiUsers className="contact-icon" /> Size: {companyData.size}
              </div>
              <div className="contact-item">
                <FiCalendar className="contact-icon" /> Founded:{" "}
                {companyData.foundedYear}
              </div>
              <div className="contact-item">
                <FiMapPin className="contact-icon" /> HQ:{" "}
                {companyData.headquarters.city},{" "}
                {companyData.headquarters.state}
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="table-card sidebar-card">
            <h3 className="card-title">Contact</h3>
            <div className="contact-list">
              <div className="contact-item">
                <FiMail className="contact-icon" />{" "}
                <a href={`mailto:${companyData.contact.email}`}>
                  {companyData.contact.email}
                </a>
              </div>
              <div className="contact-item">
                <FiPhone className="contact-icon" /> {companyData.contact.phone}
              </div>
              <div className="contact-item">
                <FiLinkedin className="contact-icon" />{" "}
                <a
                  href={companyData.contact.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                >
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
