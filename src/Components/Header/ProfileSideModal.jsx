import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiX, FiEdit2, FiLogOut, FiMail, FiPhone, FiMapPin,
  FiBriefcase, FiLinkedin, FiUser, FiCalendar, FiBook, FiGlobe, FiUsers, FiDollarSign,
  FiCreditCard
} from "react-icons/fi";
import "./ProfileSideModal.css";
import packageJson from "../../../package.json";

/**
 * ProfileSideModal
 * ─────────────────
 * Props:
 *   isOpen       – boolean
 *   onClose      – () => void
 *   onEditClick  – () => void   (navigate to edit profile)
 *   onSignOut    – () => void
 *   profile      – {
 *       name, role, email, phone, avatar, location,
 *       company, companyName, industry, jobtitle,
 *       experience, education, linkedinUrl,
 *       description, languagesSpoken[],
 *       companyDescription, totalEmployees, founded, website,
 *       subscriptionType, tokens
 *     }
 */
const ProfileSideModal = ({ isOpen, onClose, onEditClick, onSignOut, profile }) => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  /* Lock body scroll when open */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const getInitials = (name = "") =>
    name.trim().split(" ").slice(0, 2).map(w => w[0]?.toUpperCase()).join("");

  const avatarSrc = profile?.avatar
    ? (profile.avatar.startsWith("http")
        ? `${profile.avatar}?t=${Date.now()}`
        : `https://webapidev.benmyl.com/${profile.avatar}?t=${Date.now()}`)
    : null;

  const handleAddUsersClick = () => {
    onClose();
    // Directs to page with list of users created as team members (activeTab = team)
    navigate("/AdmiN/Account-settings", { state: { activeTab: "team" } });
  };

  const handleSubscriptionClick = () => {
    onClose();
    // Directs to page with list of users created as team members (activeTab = team)
    navigate("/user/user-subscription");
  };

  const industry = localStorage.getItem("Industry");

const displayIndustry =
  industry &&
  industry !== "null" &&
  industry !== "undefined" &&
  industry.trim() !== ""
    ? industry
    : "N/A";

  const handleLogoutClick = () => {
    setShowConfirm(true);
    console.log("Logging Screen State: Profile Side Modal Sign Out Confirmation.", {
        timestamp: new Date().toISOString(),
        currentUrl: window.location.href,
        profileName: profile?.name,
        profileRole: profile?.role
    });
    setTimeout(() => {
        onSignOut();
    }, 2000);
  };

  return (
    <>
      {/* Overlay backdrop */}
      <div className="psm-backdrop" onClick={onClose} />

      {/* Slide-in panel */}
      <aside className="psm-panel">

        {/* ── Hero banner (Blue Card Area) ── */}
        <div className="psm-hero">
          <div className="psm-drag-handle" />
          <div className="psm-hero-bg" />

          {/* Close button */}
          <button className="psm-close-btn" onClick={onClose} aria-label="Close">
            <FiX size={18} />
          </button>

          {/* Name, role, subscription & tokens */}
          <div className="psm-hero-body">

            <div className="d-flex gap-4 align-items-center">
             {/* Avatar */}
          <div className="psm-avatar-wrap">
            {avatarSrc ? (
              <img src={avatarSrc} alt="Profile" className="psm-avatar" />
            ) : (
              <div className="psm-avatar psm-avatar-initials">
                {getInitials(profile?.name)}
              </div>
            )}
            <span className="psm-online-dot" />
          </div>
          <div className="d-flex flex-column mb-3">
            <h2 className="psm-name">{profile?.name || "—"}</h2>
            
            <div className="psm-role-row">
              <span className="psm-role-badge">{profile?.role || "—"}</span>
              <span className="psm-sub-badge">{profile?.subscriptionType || "Enterprise Plan"}</span>
              <span className="psm-tokens-badge"><FiDollarSign size={12} /> {profile?.tokens ?? "150"} Tokens</span>
               <span className="psm-vdisplay-badge">v{packageJson.version}</span>
            </div>
            </div>

            </div>

            {/* Contact details side by side */}
            <div className="psm-hero-contacts">
              {profile?.email && (
                <div className="psm-hero-contact-item">
                  <FiMail size={12} /> <a href={`mailto:${profile.email}`}>{profile.email}</a>
                </div>
              )}
              {profile?.phone && (
                <div className="psm-hero-contact-item">
                  <FiPhone size={12} /> <span>{profile.phone}</span>
                </div>
              )}
              <div className="psm-hero-contact-item">
                <FiMapPin size={12} /> <span>{profile?.location || "N/A"}</span>
              </div>
              {profile?.linkedinUrl && (
                <div className="psm-hero-contact-item">
                  <FiLinkedin size={12} /> <a href={profile.linkedinUrl} target="_blank" rel="noreferrer">LinkedIn</a>
                </div>
              )}
            </div>

            {/* Company Info Box (description, employees, founded, website) */}
            <div className="psm-hero-company-box">
              {/* {profile?.companyDescription && (
                <p className="psm-hero-company-desc">
                  {profile.companyDescription}
                </p>
              )} */}
           <div className="psm-hero-company-grid">
  {profile?.role === "Admin" ? (
    <>
      <div className="psm-hero-company-meta">
        <FiUsers size={12} /> <strong>Size:</strong> {profile?.totalEmployees && profile.totalEmployees.trim() !== "" ? profile.totalEmployees : "N/A"}
      </div>
 
      <div className="psm-hero-company-meta">
        <FiCalendar size={12} /> <strong>Founded:</strong> {profile?.founded && profile.founded.trim() !== "" ? profile.founded : "N/A"}
      </div>
 
      <div
        className="psm-hero-company-meta"
        style={{ gridColumn: "span 2" }}
      >
        <FiGlobe size={12} /> <strong>Website:</strong>{" "}
        {profile?.website && profile.website.trim() !== "" && profile.website !== "N/A" && profile.website !== "N/A" ? (
          <a href={profile.website.startsWith("http") ? profile.website : `https://${profile.website}`} target="_blank" rel="noreferrer">
            {profile.website}
          </a>
        ) : (
          <span>N/A</span>
        )}
      </div>
    </>
  ) : (
    <>
      {localStorage.getItem("CompanyName") && (
        <div className="psm-hero-company-meta">
          <FiGlobe size={12} /> <strong>Company:</strong>{" "}
          {localStorage.getItem("CompanyName")}
        </div>
      )}
 
      {localStorage.getItem("Industry") && (
        <div
          className="psm-hero-company-meta"
          style={{ gridColumn: "span 2" }}
        >
          <FiBriefcase size={12} /> <strong>Industry:</strong>{" "}
          {displayIndustry}
        </div>
      )}
    </>
  )}
</div>
            </div>

          </div>
        </div>

        {/* ── Scrollable content ── */}
        <div className="psm-body">

          {/* About description brought down to right below the blue card section */}
          {profile?.description && (
            <div className="psm-section">
              <p className="psm-section-title">About</p>
              <p className="psm-about-text">{profile.description}</p>
            </div>
          )}

          {/* Work / Company */}
          {(profile?.jobtitle || profile?.companyName || profile?.industry) && (
            <div className="psm-section">
              <p className="psm-section-title">Work</p>
              <div className="psm-detail-list">
                {profile?.jobtitle && (
                  <div className="psm-detail-row">
                    <span className="psm-detail-icon"><FiBriefcase size={13} /></span>
                    <span className="psm-detail-val">
                      {profile.jobtitle}{profile?.company ? ` · ${profile.company}` : ""}
                    </span>
                  </div>
                )}
                {profile?.companyName && (
                  <div className="psm-detail-row">
                    <span className="psm-detail-icon"><FiGlobe size={13} /></span>
                    <span className="psm-detail-val">{profile.companyName}</span>
                  </div>
                )}
                {/* {profile?.industry && (
                  <div className="psm-detail-row">
                    <span className="psm-detail-icon"><FiUser size={13} /></span>
                    <span className="psm-detail-val">{profile.industry}</span>
                  </div>
                )} */}
                {profile?.experience && (
                  <div className="psm-detail-row">
                    <span className="psm-detail-icon"><FiCalendar size={13} /></span>
                    <span className="psm-detail-val">{profile.experience} Years Experience</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Education */}
          {profile?.education && (
            <div className="psm-section">
              <p className="psm-section-title">Education</p>
              <div className="psm-detail-row">
                <span className="psm-detail-icon"><FiBook size={13} /></span>
                <span className="psm-detail-val">{profile.education}</span>
              </div>
            </div>
          )}

          {/* Languages */}
          {profile?.languagesSpoken?.length > 0 && (
            <div className="psm-section">
              <p className="psm-section-title">Languages</p>
              <div className="psm-lang-chips">
                {profile.languagesSpoken.map((lang, i) => (
                  <span className="psm-lang-chip" key={i}>{lang.trim()}</span>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* ── Footer actions ── */}
        <div className="psm-footer">
          <button className="psm-btn psm-btn-primary" onClick={onEditClick}>
            <FiEdit2 size={14} /> Edit Profile
          </button>
          {profile?.role !== "Admin" && (
    <button
      className="psm-btn psm-btn-primary"
      onClick={handleSubscriptionClick}
    >
      <FiCreditCard size={14} /> Subscription
    </button>
  )}
          {profile?.role === "Admin" && (
            <button className="psm-btn psm-btn-secondary" onClick={handleAddUsersClick}>
              <FiUsers size={14} /> Add Users
            </button>
          )}
          <button className="psm-btn psm-btn-danger" onClick={handleLogoutClick}>
            <FiLogOut size={14} /> Sign Out
          </button>
        </div>

      </aside>

      {showConfirm && (
        <div className="psm-alert-overlay">
          <div className="psm-alert-box">
            <div className="psm-alert-icon-wrap">
              <FiLogOut size={32} />
            </div>
            <h3 className="psm-alert-title">Thank You!</h3>
            <p className="psm-alert-note" style={{ marginBottom: 0 }}>
              Thank you for your valuable time on BenMyl. We hope you had a productive session. We look forward to seeing you again soon!
            </p>
            <div className="psm-alert-spinner"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileSideModal;
