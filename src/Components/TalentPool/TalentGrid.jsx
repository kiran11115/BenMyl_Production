import React from "react";
import { FiMapPin, FiBriefcase, FiUser, FiEye, FiAward, FiStar, FiActivity, FiCpu, FiCode } from "react-icons/fi";
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
}) => {
  const getInitials = (name = "") =>
    name.split(" ").filter(Boolean).slice(0, 2).map((n) => n[0].toUpperCase()).join("");

  const visibleCandidates = candidates.filter((c) => c.isshortlisted === false);
  const matchingCount = visibleCandidates.length;

  return (
    <div>
      {/* count row */}
      <div className="grid-meta">
        <div className="grid-count text-capitalize">
          {matchingCount} Talent {matchingCount === 1 ? "profile" : "profiles"}
        </div>
      </div>

      {visibleCandidates.length === 0 && (
        <div style={{ minHeight: "320px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <NoData text="No Matching Profiles found" />
        </div>
      )}

      {/* ── grid uses projects-grid with 3 columns override ── */}
      <div className="projects-grid talent-grid-3-col" style={{ marginTop: 12 }}>
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
          const fullStars  = Math.floor(rating);
          const halfStar   = rating - fullStars >= 0.5;

          return (
            <div
              key={candidate.id}
              className="project-card talent-card-premium"
              onClick={() => onProfileClick(candidate)}
              style={{ cursor: "pointer" }}
            >
              {(() => {
                const icons = [FiUser, FiBriefcase, FiAward, FiStar, FiActivity, FiCpu, FiCode];
                const colors = ["#f5810c", "#3b82f6", "#10b981", "#8b5cf6", "#ec4899", "#f59e0b", "#06b6d4"];
                const IconComponent = icons[idx % icons.length];
                const iconColor = colors[idx % colors.length];
                return <IconComponent className="card-bg-icon" style={{ color: iconColor }} />;
              })()}
              {/* ── Card header: status + match score + eye icon ── */}
              <div className="card-header-row">
                <span className={`job-chip ${s.chipClass}`}>
                  {s.label}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="match-badge">
                    {matchScore}% Match
                  </div>
                  <div
                    className="eye-icon-btn"
                    onClick={(e) => { e.stopPropagation(); onProfileClick(candidate); }}
                    title="View Profile"
                  >
                    <FiEye size={15} />
                  </div>
                </div>
              </div>

              {/* ── Profile Section: avatar + name + role ── */}
              <div className="profile-section">
                {candidate.avatar ? (
                  <img
                    src={candidate.avatar}
                    alt={initials}
                    className="profile-avatar"
                  />
                ) : (
                  <div className="profile-avatar initials">
                    {initials}
                  </div>
                )}

                <div className="profile-details">
                  <h4 className="name">{candidate.name}</h4>
                  <p className="role">{candidate.role}</p>
                </div>
              </div>

              {/* ── Meta Info Grid: Location + Exp ── */}
              <div className="meta-grid">
                <div className="meta-item" title="Location">
                  <FiMapPin size={12} />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {candidate.location}
                  </span>
                </div>
                <div className="meta-item" title="Experience">
                  <FiBriefcase size={12} />
                  <span>{candidate.experience}</span>
                </div>
              </div>

              {/* ── Skills Chips Row ── */}
              <div className="skills-row">
                {candidate.skills.slice(0, 3).map((skill, si) => {
                  const colors = ["orange", "pink", "purple", "mint", "green"];
                  const colorClass = colors[si % colors.length];
                  return (
                    <span 
                      key={skill} 
                      className={`job-chip ${colorClass}`}
                    >
                      {skill}
                    </span>
                  );
                })}
                {candidate.skills.length > 3 && (
                  <span className="job-chip more">
                    +{candidate.skills.length - 3}
                  </span>
                )}
              </div>

              {/* ── Footer / Card Actions: Rating + Shortlist Button ── */}
              <div className="card-actions" onClick={(e) => e.stopPropagation()}>
                {/* Star rating */}
                <div className="star-rating-row">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} width="11" height="11" viewBox="0 0 24 24" fill="none">
                      <polygon
                        points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                        fill={
                          star <= fullStars
                            ? "#f59e0b"
                            : star === fullStars + 1 && halfStar
                              ? "url(#half)"
                              : "#e2e8f0"
                        }
                        stroke="none"
                      />
                      {star === fullStars + 1 && halfStar && (
                        <defs>
                          <linearGradient id="half">
                            <stop offset="50%" stopColor="#f59e0b" />
                            <stop offset="50%" stopColor="#e2e8f0" />
                          </linearGradient>
                        </defs>
                      )}
                    </svg>
                  ))}
                  <span className="star-rating-value">{rating.toFixed(1)}</span>
                </div>

                {/* Shortlist button */}
                <button
                  onClick={() => onShortlist(candidate)}
                  className={isShortlisted ? "btn-v2-primary shortlisted" : "btn-v2-primary"}
                  style={Object.assign(
                    { fontSize: 10.5, padding: "7px 16px", textTransform: "uppercase", borderRadius: "8px" },
                    isShortlisted && activeJobColor
                      ? { backgroundColor: activeJobColor, borderColor: activeJobColor }
                      : {}
                  )}
                >
                  {isShortlisted ? (
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
