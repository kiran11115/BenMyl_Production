import React from "react";
import {
  FiMapPin,
  FiBriefcase,
  FiMail,
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

const CompanyProfile = () => {
  const navigate = useNavigate(); // Programmatic navigation with useNavigate(). [web:62]

  // NOTE: Existing data is unchanged; only plan + teamMembers are added.
  const companyData = {
    id: "cmp_10231",
    slug: "nimbus-labs",
    name: "Nimbus Labs",
    tagline: "Design-led product studio for B2B teams",
    status: "Operating",
    companyType: "Privately Held",
    industry: "Software Development",
    size: "51–200 employees",
    foundedYear: "2016",
    websiteUrl: "https://nimbuslabs.com",
    domain: "nimbuslabs.com",

    headquarters: {
      city: "San Francisco",
      state: "CA",
      country: "US",
      postalCode: "94105",
      street1: "123 Market St",
      street2: "Suite 500",
    },

    description:
      "Nimbus Labs builds and improves B2B digital products with a focus on UX quality, speed-to-market, and maintainable UI systems.",

    contact: {
      email: "hello@nimbuslabs.com",
      phone: "+1 (555) 123-4567",
      linkedinUrl: "https://linkedin.com/company/nimbuslabs",
    },

    // Added: subscription plan
    plan: {
      name: "Business",
      status: "Active",
      billingCycle: "Monthly",
      renewsOn: "2026-02-01",
      seats: 10,
      seatsUsed: 6,
    },

    // Added: team members
    teamMembers: [
      { username: "nimbus.owner", email: "owner@nimbuslabs.com", role: "Owner" },
      { username: "sarah.admin", email: "sarah@nimbuslabs.com", role: "Admin" },
      { username: "arun.member", email: "arun@nimbuslabs.com", role: "Member" },
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
    navigate(`/user/company/${companyData.slug}/edit`);
  };

  const onAccountSettings = () => {
    navigate("/user/account-settings"); // Navigate by passing a path string. [web:62]
  };

  return (
    <div className="projects-container">
      {/* Breadcrumb */}
      <div className="profile-breadcrumb">
        <button
          className="link-button"
          onClick={() => navigate("/user/user-dashboard")}
        >
          <FiArrowLeft /> Back to Dashboard
        </button>
        <span className="crumb">/ Company Profile</span>
      </div>

      <div className="dashboard-layout">
        {/* === LEFT MAIN COLUMN === */}
        <div className="dashboard-column-main">
          <div className="row">
            <div className="col-12">
              {/* Company Header Card */}
              <div className="project-card">
                <div className="d-flex gap-3 align-items-start">
                  <img
                    src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=150"
                    alt="Company Logo"
                    className="profile-avatar-lg"
                  />

                  <div className="profile-header-content w-100">
                    <div className="d-flex align-items-center gap-3">
                      <h1 className="mb-1">{companyData.name}</h1>
                    </div>

                    <div className="card-title mb-2">{companyData.tagline}</div>

                    {/* Meta row */}
                    <div className="profile-meta-row">
                      <span className="meta-item">
                        <FiBriefcase /> {companyData.industry}
                      </span>
                      <span className="meta-item">
                        <FiMapPin /> {companyData.headquarters.city},{" "}
                        {companyData.headquarters.state}
                      </span>
                      <span className="meta-item">
                        <FiUsers /> {companyData.size}
                      </span>
                      <span className="meta-item">
                        <FiCalendar /> Founded {companyData.foundedYear}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="profile-status-wrapper">
                      <span className="status-tag status-completed">
                        {companyData.status}
                      </span>
                      <span className="status-tag status-inprogress">
                        {companyData.companyType}
                      </span>
                    </div>

                    {/* About */}
                    <div className="mt-3">
                      <h3 className="card-title">About</h3>
                      <div className="small text-muted">
                        {companyData.description}
                      </div>
                    </div>

                    {/* Headquarters */}
                    <div className="mt-3">
                      <h3 className="card-title">Headquarters</h3>
                      <div className="small text-muted">{fullAddress}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Added: Team members table */}
            <div className="col-12 mt-3">
              <div className="table-card">
                <h3 className="card-title">Team members</h3>

                <div className="table-responsive mt-3">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                      </tr>
                    </thead>

                    <tbody>
                      {companyData.teamMembers?.length ? (
                        companyData.teamMembers.map((m) => (
                          <tr key={m.email}>
                            <td>{m.username}</td>
                            <td>
                              <a href={`mailto:${m.email}`}>{m.email}</a>
                            </td>
                            <td>{m.role}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="text-muted">
                            No team members added.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* === RIGHT SIDE COLUMN === */}
        <div className="dashboard-column-side">
          {/* Actions */}
          <div className="sidebar-actions">
            <button className="btn-primary w-100" onClick={onEdit}>
              Edit Company
            </button>

            <button
              className="btn-secondary w-100"
              onClick={onAccountSettings}
            >
              Account Settings
            </button>
          </div>

          {/* Added: Plan card */}
          <div className="table-card sidebar-card">
            <h3 className="card-title">Plan</h3>
            <div className="contact-list">
              <div className="contact-item">
                <FiFileText className="contact-icon" /> {companyData.plan.name} (
                {companyData.plan.status})
              </div>
              <div className="contact-item">
                <FiCalendar className="contact-icon" /> Billing:{" "}
                {companyData.plan.billingCycle}
              </div>
              <div className="contact-item">
                <FiCalendar className="contact-icon" /> Renews on:{" "}
                {companyData.plan.renewsOn}
              </div>
              <div className="contact-item">
                <FiUsers className="contact-icon" /> Seats:{" "}
                {companyData.plan.seatsUsed}/{companyData.plan.seats}
              </div>
            </div>
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

export default CompanyProfile;
