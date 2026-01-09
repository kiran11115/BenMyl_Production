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

const ProfilePage = () => {
  const navigate = useNavigate();

  const companyData = {
    id: "cmp_24781",
    slug: "talentbridge-hr",
    name: "John Smith",
    companyname: "Nimbus Labs",
    size: "100-200",
    status: "Active",
    industry: "Staffing & Recruiting",
    foundedYear: "2018",
    websiteUrl: "https://talentbridge.com",
    domain: "talentbridge.com",

    headquarters: {
      city: "San francisco",
      state: "CA",
      country: "USA",
      postalCode: "572734",
      street1: "27-1-72/4, hms  knska",
      street2: "3rd Floor, Tech Tower",
    },

    description:
      "TalentBridge Solutions is a leading staffing and recruitment firm specializing in healthcare, IT, and engineering talent acquisition. We partner with enterprises to build high-performing teams through strategic hiring, talent pipelining, and workforce management solutions. Our HR technology platform streamlines recruitment workflows, candidate tracking, and employee onboarding for scalable growth.",

    contact: {
      email: "hr@talentbridge.com",
      phone: "+91 891 234 5678",
      linkedinUrl: "https://linkedin.com/company/talentbridge-solutions",
    },


    teamMembers: [
      { username: "hr-manager", email: "hr-manager@talentbridge.com", role: "HR Manager" },
      { username: "recruiter-lead", email: "lead-recruiter@talentbridge.com", role: "Recruitment Lead" },
      { username: "talent-admin", email: "admin@talentbridge.com", role: "Talent Admin" },
      { username: "onboarding-specialist", email: "onboarding@talentbridge.com", role: "Onboarding Specialist" },
    ],
  };

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
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="TalentBridge Logo"
                    className="profile-avatar-lg"
                  />

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

                    <div className="card-title mb-2">{companyData.companyname}</div>

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
              <div className="project-card"></div>
            </div>

             <div className="col-12 col-md-12 col-lg-4 mb-4">
              <div className="project-card"></div>
            </div>

             <div className="col-12 col-md-12 col-lg-4 mb-4">
              <div className="project-card"></div>
            </div>

             <div className="col-12 col-md-12 col-lg-4 mb-4">
              <div className="project-card"></div>
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
                <a href={companyData.websiteUrl} target="_blank" rel="noreferrer">
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
                {companyData.headquarters.city}, {companyData.headquarters.state}
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
