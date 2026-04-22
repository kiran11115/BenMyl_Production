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
  FiCheckCircle,
  FiInfo,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import TeamMembersTable from "./TeamMembersTable";
import { useGetCompanyProfileEditQuery } from "../../../State-Management/Api/CompanyProfileApiSlice";
import { useGetTeamMembersQuery } from "../../../State-Management/Api/AdminDetailsApiSlice";
import "./AdminProfile.css";

const AdminProfile = () => {
  const navigate = useNavigate();
  const emailId = localStorage.getItem("Email");

  const {
    data: apiData,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useGetCompanyProfileEditQuery(emailId);

  const {
    data: teamApiData = [],
    isLoading: isTeamLoading,
    isError: isTeamError,
  } = useGetTeamMembersQuery(emailId);

  const companyData = useMemo(() => {
    if (!apiData) return null;

    return {
      name: apiData.companyname,
      tagline: apiData.tagline || "Providing innovative solutions for the future.",
      industry: apiData.industry || "Technology",
      size: apiData.companySize || "11-50 employees",
      foundedYear: apiData.foundedYear || "2020",
      description: apiData.description,
      websiteUrl: apiData.websiteURL,
      domain: apiData.domain || (apiData.websiteURL ? new URL(apiData.websiteURL).hostname : ""),
      city: apiData.city,
      state: apiData.state,
      country: apiData.country,
      email: apiData.emailid,
      phone: apiData.phone,
      linkedinUrl: apiData.linkedInURL,
      logo: apiData.companylogo,
      // Mocked subscription for now, can be updated from API later
      plan: {
        name: "Enterprise Plan",
        status: "Active",
        billingCycle: "Annual",
        renewsOn: "Oct 12, 2026",
        seats: 25,
        seatsUsed: teamApiData.length || 0,
      },
    };
  }, [apiData, teamApiData]);

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
    navigate("/Admin/edit-profile");
  };

  const onAccountSettings = () => {
    navigate("/Admin/account-settings");
  };

  if (isProfileLoading) {
    return (
      <div className="admin-profile-container">
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading organization profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-profile-container">
      {/* --- HERO SECTION --- */}
      <div className="company-hero-card">
        <div className="company-logo-wrapper">
          <img
            src={companyData?.logo ? `${companyData.logo}?t=${Date.now()}` : "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=300"}
            alt="Company Logo"
            className="company-logo-lg"
          />
        </div>

        <div className="company-info-main">
          <div className="company-name-row">
            <h1>{companyData?.name}</h1>
            <span className="status-tag status-completed">
              <FiCheckCircle size={12} /> Verified
            </span>
          </div>
          <p className="company-tagline">{companyData?.tagline}</p>

          <div className="company-stats-strip">
            <div className="hero-stat-item">
              <FiBriefcase /> {companyData?.industry}
            </div>
            <div className="hero-stat-item">
              <FiUsers /> {companyData?.size}
            </div>
            <div className="hero-stat-item">
              <FiMapPin /> {companyData?.city}, {companyData?.country}
            </div>
            <div className="hero-stat-item">
              <FiCalendar /> Founded {companyData?.foundedYear}
            </div>
          </div>
        </div>

        <div className="admin-actions-sidebar">
          <button className="btn-upload" onClick={onEdit}>
            <FiEdit /> Edit Profile
          </button>
          <button className="btn-upload-secondary" onClick={onAccountSettings}>
            <FiSettings /> Account Settings
          </button>
        </div>
      </div>

      <div className="profile-details-grid">
        {/* --- MAIN COLUMN --- */}
        <div className="profile-main-content">
          {/* About Section */}
          <div className="card-premium mb-4">
            <h3 className="card-title-premium">
              <FiInfo /> About Company
            </h3>
            <p className="m-0" style={{ lineHeight: "1.7", color: "#475569" }}>
              {companyData?.description || "No description provided."}
            </p>
          </div>

          {/* Team Members Section */}
          <div className="card-premium">
            <TeamMembersTable teammembers={teamMembers} isLoading={isTeamLoading} />
          </div>
        </div>

        {/* --- SIDEBAR COLUMN --- */}
        <div className="profile-side-content">
          {/* Subscription Summary */}
          <div className="card-premium subscription-summary-card mb-4">
            <h3 className="card-title-premium">
              <FiFileText /> Subscription Summary
            </h3>
            <div className="subscription-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="plan-badge-premium">{companyData?.plan.name}</span>
                <span className="status-tag status-green">Active</span>
              </div>

              <div className="sub-detail-item">
                <span className="sub-label">Billing Cycle</span>
                <span className="sub-value">{companyData?.plan.billingCycle}</span>
              </div>
              <div className="sub-detail-item">
                <span className="sub-label">Renewal Date</span>
                <span className="sub-value">{companyData?.plan.renewsOn}</span>
              </div>

              <div className="seat-usage-container mt-3">
                <div className="d-flex justify-content-between mb-1">
                  <span className="sub-label">Seat Usage</span>
                  <span className="sub-value">
                    {companyData?.plan.seatsUsed} / {companyData?.plan.seats}
                  </span>
                </div>
                <div className="seat-progress-bg">
                  <div
                    className="seat-progress-fill"
                    style={{
                      width: `${(companyData?.plan.seatsUsed / companyData?.plan.seats) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Presence */}
          <div className="card-premium mb-4">
            <h3 className="card-title-premium">
              <FiGlobe /> Online Presence
            </h3>
            <div className="sidebar-info-grid">
              <div className="info-item-block">
                <div className="info-icon-box"><FiGlobe /></div>
                <div className="info-content-box">
                  <span className="info-label-sm">Website</span>
                  <a href={companyData?.websiteUrl} target="_blank" rel="noreferrer" className="info-link-md">
                    {companyData?.domain}
                  </a>
                </div>
              </div>
              <div className="info-item-block">
                <div className="info-icon-box"><FiLinkedin /></div>
                <div className="info-content-box">
                  <span className="info-label-sm">LinkedIn</span>
                  <a href={companyData?.linkedinUrl} target="_blank" rel="noreferrer" className="info-link-md">
                    View Company Page
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Direct Contact */}
          <div className="card-premium">
            <h3 className="card-title-premium">
              <FiMail /> Contact Details
            </h3>
            <div className="sidebar-info-grid">
              <div className="info-item-block">
                <div className="info-icon-box"><FiMail /></div>
                <div className="info-content-box">
                  <span className="info-label-sm">Email</span>
                  <span className="info-value-md">{companyData?.email}</span>
                </div>
              </div>
              <div className="info-item-block">
                <div className="info-icon-box"><FiPhone /></div>
                <div className="info-content-box">
                  <span className="info-label-sm">Phone</span>
                  <span className="info-value-md">{companyData?.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;

