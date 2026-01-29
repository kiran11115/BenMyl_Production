import React, { useMemo } from "react";
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
import TeamMembersTable from "./TeamMembersTable";
import { useGetCompanyProfileEditQuery } from "../../../State-Management/Api/CompanyProfileApiSlice";
import { useGetTeamMembersQuery } from "../../../State-Management/Api/AdminDetailsApiSlice";

const AdminProfile = () => {
  const navigate = useNavigate(); // Programmatic navigation with useNavigate(). [web:62]
  const emailId = localStorage.getItem("Email"); // or from auth state

const {
  data: apiData,
  isLoading,
  isError,
} = useGetCompanyProfileEditQuery(emailId);

const {
  data: teamApiData = [],
  isLoading: isTeamLoading,
  isError: isTeamError,
} = useGetTeamMembersQuery(emailId);

  // NOTE: Existing data is unchanged; only plan + teamMembers are added.
 const companyData = useMemo(() => {
  if (!apiData) return null;

  return {
    name: apiData.companyname,
    tagline: apiData.tagline,
    industry: apiData.industry,
    size: apiData.companySize,
    foundedYear: apiData.foundedYear,
    description: apiData.description,
    websiteUrl: apiData.websiteURL,
    domain: apiData.domain,
      street1: apiData.streetAddress1,
      street2: apiData.streetAddress2,
      city: apiData.city,
      state: apiData.state,
      postalCode: apiData.postalCode,
      country: apiData.country,
      email: apiData.emailid,
      phone: apiData.phone,
      linkedinUrl: apiData.linkedInURL,

    logo: apiData.companylogo,

    // Optional / future
    plan: {
      name: "Business",
      status: "Active",
      billingCycle: "Monthly",
      renewsOn: "2026-02-01",
      seats: 10,
      seatsUsed: 6,
    },
  };
}, [apiData]);

const teamMembers = useMemo(() => {
  if (!Array.isArray(teamApiData)) return [];

  return teamApiData.map((member) => ({
    username: member.name || member.emailID.split("@")[0],
    email: member.emailID,
    role: member.role,
    status: member.accepted ? "Active" : "Pending",
    joinedOn: member.dateofjoin,
  }));
}, [teamApiData]);

  const onEdit = () => {
    navigate("/admin/edit-profile");
  };

  const onAccountSettings = () => {
    navigate("/admin/account-settings"); // Navigate by passing a path string. [web:62]
  };

  return (
    <div className="projects-container">
      {/* Breadcrumb */}
      <div className="profile-breadcrumb d-flex gap-1">
        <button
          className="link-button"
          onClick={() => navigate("/admin/admin-dashboard")}
        >
          <FiArrowLeft /> Back to Dashboard
        </button>
        <span className="crumb">/ Company Profile</span>
      </div>

      <div className="dashboard-layout">
        {/* === LEFT MAIN COLUMN === */}
        <div className="dashboard-column-main">
          <div className="row">
            <div className="col-8">
              {/* Company Header Card */}
              <div className="project-card">
                <div className="d-flex gap-3 align-items-start">
                 <img
  src={companyData?.logo ? `${companyData.logo}?t=${Date.now()}` : "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=150"}
  alt="Company Logo"
  className="profile-avatar-lg"
/>
                  <div className="profile-header-content w-100">
                    <div className="d-flex align-items-center gap-3">
                      <h1 className="mb-1">{companyData?.name}</h1>
                    </div>

                    <div className="card-title mb-2">{companyData?.tagline}</div>

                    {/* Meta row */}
                    <div className="profile-meta-row">
                      <span className="meta-item">
                        <FiBriefcase /> {companyData?.industry}
                      </span>
                      <span className="meta-item">
                        <FiMapPin /> {companyData?.city},{" "}
                        {companyData?.state}
                      </span>
                      <span className="meta-item">
                        <FiUsers /> {companyData?.size}
                      </span>
                      {/* <span className="meta-item">
                        <FiCalendar /> Founded {companyData?.foundedYear}
                      </span> */}
                    </div>

                    {/* Status */}
                    <div className="profile-status-wrapper">
                      <span className="status-tag status-completed">Operating</span>
                      <span className="status-tag status-progress">Privately Held</span>
                    </div>

                    {/* About */}
                    <div className="mt-3">
                      <h3 className="card-title mb-2">About</h3>
                      <div className="small text-muted" style={{height:"40px", overflowY:"scroll"}}>
                        {companyData?.description}
                      </div>
                    </div>

                    {/*  */}
                    {/* <div className="mt-3">
                      <h3 className="card-title"></h3>
                      <div className="small text-muted">{fullAddress}</div>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-4">
            <div className="table-card sidebar-card" style={{height:"220px"}}>
            <h3 className="card-title">Subscription Plan</h3>
            <div className="contact-list">
              <div className="contact-item">
                <FiFileText className="contact-icon" /> {companyData?.plan.name} (
                {companyData?.plan.status})
              </div>
              <div className="contact-item">
                <FiCalendar className="contact-icon" /> Billing:{" "}
                {companyData?.plan.billingCycle}
              </div>
              <div className="contact-item">
                <FiCalendar className="contact-icon" /> Renews on:{" "}
                {companyData?.plan.renewsOn}
              </div>
              <div className="contact-item">
                <FiUsers className="contact-icon" /> Seats:{" "}
                {companyData?.plan.seatsUsed}/{companyData?.plan.seats}
              </div>
            </div>
          </div>
            </div>

            {/* Added: Team members table */}
            <div className="col-12 mt-3">
              <div className="table-card">
                <TeamMembersTable  teammembers={teamMembers} isLoading={isTeamLoading}/>
              </div>
            </div>
          </div>
        </div>

        {/* === RIGHT SIDE COLUMN === */}
        <div className="dashboard-column-side">
          {/* Actions */}
          <div className="sidebar-actions">
            <button className="btn-primary w-100 gap-2" onClick={onEdit}>
             <FiEdit/> Edit
            </button>

            <button
              className="btn-secondary w-100 gap-2"
              onClick={onAccountSettings}
            >
             <FiSettings/>  Account Settings
            </button>
          </div>

          {/* Company Information */}
          <div className="table-card sidebar-card">
            <h3 className="card-title">Company information</h3>
            <div className="contact-list">
              <div className="contact-item">
                <FiGlobe className="contact-icon" />{" "}
                <a href={companyData?.websiteUrl} target="_blank" rel="noreferrer">
                  {companyData?.domain}
                </a>
              </div>
              <div className="contact-item">
                <FiBriefcase className="contact-icon" /> Industry:{" "}
                {companyData?.industry}
              </div>
              <div className="contact-item">
                <FiUsers className="contact-icon" /> Size: {companyData?.size}
              </div>
              <div className="contact-item">
                <FiCalendar className="contact-icon" /> Founded:{" "}
                {companyData?.foundedYear}
              </div>
              <div className="contact-item">
                <FiMapPin className="contact-icon" /> HQ:{" "}
                {companyData?.city}, {companyData?.state}
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="table-card sidebar-card">
            <h3 className="card-title">Contact</h3>
            <div className="contact-list">
              <div className="contact-item">
                <FiMail className="contact-icon" />{" "}
                <a href={`mailto:${companyData?.email}`}>
                  {companyData?.email}
                </a>
              </div>
              <div className="contact-item">
                <FiPhone className="contact-icon" /> {companyData?.phone}
              </div>
              <div className="contact-item">
                <FiLinkedin className="contact-icon" />{" "}
                <a
                  href={companyData?.linkedinUrl}
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

export default AdminProfile;
