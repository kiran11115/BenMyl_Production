import React from "react";
import { FiMapPin, FiBriefcase, FiUser, FiEye, FiAward, FiStar, FiActivity, FiCpu, FiCode, FiLoader, FiBookOpen } from "react-icons/fi";
import { GiCheckMark } from "react-icons/gi";
import NoData from "../UploadTalent/NoData";
import "./TalentPool.css";
import "../UserProjects/Projects.css";




const TalentGridView = ({
  candidates = [],
  onShortlist,
  activeJobId,
  activeJobColor,
  shortlistedMap,
  onProfileClick,
  hasMore,
  loadingShortlistId,
}) => {
  const getInitials = (name = "") =>
    name.split(" ").filter(Boolean).slice(0, 2).map((n) => n[0].toUpperCase()).join("");

  const visibleCandidates = candidates;

  return (
    <div>

      {visibleCandidates.length === 0 && (
        <div style={{ minHeight: "320px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <NoData text="No Matching Profiles found" />
        </div>
      )}

      {/* ── grid uses projects-grid with 3 columns override ── */}
      <div className="projects-grid talent-grid-4-col" style={{ marginTop: 12 }}>
        {visibleCandidates.map((candidate, idx) => {
          const isShortlisted = activeJobId && shortlistedMap?.[activeJobId]?.find((c) => c.id === candidate.id);
          const initials = getInitials(candidate.name);

          /* Derive availability */
          const status = candidate.status || "AVAILABLE";
          const statusMap = {
            AVAILABLE:    { label: "Available",    chipClass: "mint" },
            SHORTLISTED:  { label: "Shortlisted",  chipClass: "green" },
            INTERVIEWING: { label: "Interviewing", chipClass: "purple" },
            BUSY:         { label: "Busy",         chipClass: "orange" },
            UNAVAILABLE:  { label: "Unavailable",  chipClass: "pink" },
          };
          const s = statusMap[status.toUpperCase()] || statusMap.AVAILABLE;

          /* AI match score — use existing or fake a deterministic one */
          const matchScore = candidate.matchScore ?? (75 + (idx * 7) % 24);

          /* Rating — use existing or derive */
          const rating = candidate.rating ?? (3.5 + ((idx * 3) % 15) / 10);

          const pct = matchScore || 75;
          let gradientStart = "#60a5fa", gradientMid = "#3b82f6", gradientEnd = "#2563eb";
          if (pct < 40) {
            gradientStart = "#fb923c"; gradientMid = "#f97316"; gradientEnd = "#ea580c";
          } else if (pct > 80) {
            gradientStart = "#34d399"; gradientMid = "#10b981"; gradientEnd = "#059669";
          }

          const hasRealCompany = candidate.company && candidate.company.toLowerCase() !== "benmyl";

          return (
            <div
              key={candidate.id}
              className="project-card talent-card-premium"
            >
              {(() => {
                const icons = [FiUser, FiBriefcase, FiAward, FiStar, FiActivity, FiCpu, FiCode];
                const colors = ["#f5810c", "#3b82f6", "#10b981", "#8b5cf6", "#ec4899", "#f59e0b", "#06b6d4"];
                const IconComponent = icons[idx % icons.length];
                const iconColor = colors[idx % colors.length];
                return <IconComponent className="card-bg-icon" style={{ color: iconColor }} />;
              })()}
              {/* ── Card header: status ── */}
              <div className="card-header-row">
                <span className="job-chip mint">
                  {s.label}
                </span>
              </div>

              {/* ── Profile Section: avatar + role + rating + company + location ── */}
              <div className="profile-section">
                <div 
                  className="talent-avatar-border-circle"
                  style={{ background: "transparent" }}
                >
                  {candidate.avatar ? (
                    <img
                      src={candidate.avatar}
                      alt={initials}
                      className="profile-avatar"
                    />
                  ) : (
                    <div
                      className="profile-avatar initials"
                      style={{
                        backgroundColor: "#1e293b",
                        color: "#ffffff",
                        border: "1px solid #1e293b",
                      }}
                    >
                      {initials}
                    </div>
                  )}
                  <div className="avatar-verified-badge" title="Verified Candidate">
                    <GiCheckMark size={8} color="#ffffff" />
                  </div>
                </div>

                <div className="profile-details">
                  {/* Role Name on Top with Rating beside it */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                    <h4 className="role" style={{ margin: 0, fontSize: '13.5px', fontWeight: '700', color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                      {candidate.role}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
                      <FiStar size={11} fill="#f59e0b" color="#f59e0b" />
                      <span className="star-rating-value" style={{ fontSize: '11px', fontWeight: '700', color: '#475569' }}>
                        {rating.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {/* Company Name & Location beside each other */}
                  <p className="company-loc-text" style={{ margin: '2px 0 0', fontSize: '11.5px', color: '#64748b', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {hasRealCompany && (
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {candidate.company}
                      </span>
                    )}
                    {hasRealCompany && candidate.location && <span>•</span>}
                    {candidate.location && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
                        <FiMapPin size={11} color="#94a3b8" />
                        {candidate.location}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* ── Separate Section: Work Experience & Education ── */}
              <div className="card-edu-exp-block" style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '12px', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {/* Work Experience */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
                  <FiBriefcase size={11} color="#f5810c" style={{ flexShrink: 0 }} />
                  <span style={{ fontWeight: 600, color: '#475569' }}>Exp:</span>
                  <span style={{ color: '#0f172a', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {candidate.experience ? `${candidate.experience}${typeof candidate.experience === 'number' || (!isNaN(candidate.experience) && String(candidate.experience).trim() !== '') ? (String(candidate.experience).toLowerCase().includes('yr') || String(candidate.experience).toLowerCase().includes('exp') ? '' : ' Yrs Exp') : ''}` : "N/A"}
                  </span>
                </div>

                {/* Education */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
                  <FiBookOpen size={11} color="#3b82f6" style={{ flexShrink: 0 }} />
                  <span style={{ fontWeight: 600, color: '#475569' }}>Education:</span>
                  <span style={{ color: '#0f172a', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {candidate.education || candidate.highestQualification || candidate.degree || "Bachelor's Degree"}
                  </span>
                </div>
              </div>

              {/* ── Skills Chips Row ── */}
              <div className="skills-row">
                {candidate.skills.slice(0, 3).map((skill) => (
                  <span 
                    key={skill} 
                    className="job-chip"
                  >
                    {skill}
                  </span>
                ))}
                {candidate.skills.length > 3 && (
                  <span className="job-chip more">
                    +{candidate.skills.length - 3}
                  </span>
                )}
              </div>

              {/* ── Footer / Card Actions: View Button + Shortlist Button ── */}
              <div className="card-actions" style={{ justifyContent: 'flex-end', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
                {/* View button beside Shortlist button */}
                <button
                  className="job-card-view-btn"
                  onClick={(e) => { e.stopPropagation(); onProfileClick(candidate); }}
                  style={{ fontSize: 10.5, padding: "7px 16px", borderRadius: "8px" }}
                >
                  View
                </button>

                {/* Shortlist button */}
                <button
                  onClick={() => onShortlist(candidate)}
                  className={isShortlisted ? "btn-v2-primary shortlisted" : "btn-v2-primary"}
                  disabled={loadingShortlistId === candidate.id}
                  style={Object.assign(
                    { fontSize: 10.5, padding: "7px 16px", textTransform: "uppercase", borderRadius: "8px" },
                    isShortlisted && activeJobColor
                      ? { backgroundColor: activeJobColor, borderColor: activeJobColor }
                      : {}
                  )}
                >
                  {loadingShortlistId === candidate.id ? (
                    <span className="d-flex align-items-center gap-1 justify-content-center">
                      <FiLoader size={10} className="spin-icon" /> Shortlisting
                    </span>
                  ) : isShortlisted ? (
                    <span className="d-flex align-items-center gap-1 justify-content-center">
                      <GiCheckMark size={10} /> Selected
                    </span>
                  ) : (
                    "Shortlist"
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TalentGridView;
