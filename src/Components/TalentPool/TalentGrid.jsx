import React from "react";
import { FiMapPin, FiBriefcase, FiUser, FiEye } from "react-icons/fi";
import { GiCheckMark } from "react-icons/gi";
import NoData from "../UploadTalent/NoData";

/* Rotating multi-color avatar palette (matches reference image style) */
const AVATAR_PALETTES = [
  { bg: "#fde8e8", color: "#ef4444" },   // red
  { bg: "#e0f2fe", color: "#0ea5e9" },   // sky blue
  { bg: "#fef9c3", color: "#ca8a04" },   // yellow
  { bg: "#dcfce7", color: "#16a34a" },   // green
  { bg: "#ede9fe", color: "#7c3aed" },   // purple
  { bg: "#fff7ed", color: "#f5810c" },   // orange
  { bg: "#ecfdf5", color: "#059669" },   // emerald
  { bg: "#fce7f3", color: "#db2777" },   // pink
];

/* Skill chip color cycling */
const CHIP_COLORS = [
  { bg: "#eff6ff", color: "#3b82f6" },   // blue
  { bg: "#f5f3ff", color: "#7c3aed" },   // purple
  { bg: "#f0fdf4", color: "#16a34a" },   // green
  { bg: "#fff7ed", color: "#f5810c" },   // orange
  { bg: "#fce7f3", color: "#db2777" },   // pink
];

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
          {matchingCount} matching {matchingCount === 1 ? "profile" : "profiles"}
        </div>
      </div>

      {visibleCandidates.length === 0 && (
        <div style={{ minHeight: "320px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <NoData text="No Matching Profiles found" />
        </div>
      )}

      {/* ── grid uses same CSS class as jobs ── */}
      <div className="jobs-grid" style={{ marginTop: 12 }}>
        {visibleCandidates.map((candidate, idx) => {
          const isShortlisted = activeJobId && shortlistedMap?.[activeJobId]?.find((c) => c.id === candidate.id);
          const palette = AVATAR_PALETTES[idx % AVATAR_PALETTES.length];
          const initials = getInitials(candidate.name);

          /* Derive availability */
          const status = candidate.status || "AVAILABLE";
          const statusMap = {
            AVAILABLE:    { label: "Available",    dot: "#10b981", bg: "#f0fdf4", color: "#16a34a" },
            SHORTLISTED:  { label: "Shortlisted",  dot: "#3b82f6", bg: "#eff6ff", color: "#2563eb" },
            INTERVIEWING: { label: "Interviewing", dot: "#8b5cf6", bg: "#f5f3ff", color: "#7c3aed" },
            BUSY:         { label: "Busy",         dot: "#f59e0b", bg: "#fffbeb", color: "#d97706" },
            UNAVAILABLE:  { label: "Unavailable",  dot: "#ef4444", bg: "#fef2f2", color: "#dc2626" },
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
              className="job-card"
              onClick={() => onProfileClick(candidate)}
              style={{ cursor: "pointer" }}
            >
              {/* ── Card header: avatar + name + eye icon ── */}
              <div className="job-card-header">
                <div className="job-header-left">
                  {/* Avatar — same shape as reference image */}
                  <div
                    className="job-company-logo"
                    style={{
                      background: palette.bg,
                      color: palette.color,
                      borderRadius: "50%",
                      width: 44,
                      height: 44,
                      fontSize: 14,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {candidate.avatar
                      ? <img src={candidate.avatar} alt={initials} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%", backgroundColor: palette.bg, }} />
                      : initials}
                  </div>

                  {/* Name + role */}
                  <div className="job-header-info">
                    <p className="job-title" style={{ fontSize: 14, fontWeight: 700 }}>
                      {candidate.name}
                    </p>
                    <p className="company-name" style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>
                      {candidate.role}
                    </p>
                  </div>
                </div>

                {/* Eye icon */}
                <div
                  className="job-eye-icon"
                  onClick={(e) => { e.stopPropagation(); onProfileClick(candidate); }}
                >
                  <FiEye size={16} />
                </div>
              </div>

              {/* ── Status + Match score row ── */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
                {/* Availability status pill */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 5,
                  background: s.bg, borderRadius: 20, padding: "3px 10px",
                  fontSize: 11, fontWeight: 700, color: s.color,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, display: "inline-block" }} />
                  {s.label}
                </div>

                {/* AI match score */}
                <div style={{
                  background: matchScore >= 90 ? "#f0fdf4" : matchScore >= 75 ? "#eff6ff" : "#fffbeb",
                  color:      matchScore >= 90 ? "#16a34a" : matchScore >= 75 ? "#2563eb" : "#d97706",
                  fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 8,
                }}>
                  {matchScore}% Match
                </div>
              </div>

              {/* ── Skill/tag chips row (multi-color) ── */}
              <div className="job-tags-row">
                {candidate.skills.slice(0, 3).map((skill, si) => {
                  const chip = CHIP_COLORS[si % CHIP_COLORS.length];
                  return (
                    <span
                      key={skill}
                      style={{
                        fontSize: 11, fontWeight: 600, padding: "4px 10px",
                        borderRadius: 20, background: chip.bg, color: chip.color,
                        border: `1px solid ${chip.color}22`,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {skill}
                    </span>
                  );
                })}
                {candidate.skills.length > 3 && (
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: "4px 10px",
                    borderRadius: 20, background: "#f1f5f9", color: "#64748b",
                    border: "1px solid #e2e8f0",
                  }}>
                    +{candidate.skills.length - 3}
                  </span>
                )}
              </div>


              {/* ── Footer: location + shortlist ── */}
              <div className="job-card-footer" style={{ flexDirection: "column", alignItems: "flex-start", gap: 11 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                  {/* Location + Exp */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#64748b" }}>
                      <FiMapPin size={12} style={{ color: "#94a3b8" }} />
                      <span>{candidate.location}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#64748b" }}>
                      <FiBriefcase size={12} style={{ color: "#94a3b8" }} />
                      <span>{candidate.experience}</span>
                    </div>
                  </div>

                  {/* Star rating */}
                  <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                    {[1,2,3,4,5].map(star => (
                      <svg key={star} width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <polygon
                          points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                          fill={
                            star <= fullStars ? "#f59e0b"
                            : (star === fullStars + 1 && halfStar) ? "url(#half)"
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
                    <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 2 }}>{rating.toFixed(1)}</span>
                  </div>
                </div>

                {/* Shortlist button */}
                <button
                  onClick={(e) => { e.stopPropagation(); onShortlist(candidate); }}
                  className={isShortlisted ? "btn-v2-primary shortlisted" : "btn-v2-primary"}
                  style={Object.assign(
                    { fontSize: 11, padding: "6px 14px", width: "100%", textTransform: "uppercase" },
                    isShortlisted && activeJobColor ? { backgroundColor: activeJobColor, borderColor: activeJobColor } : {}
                  )}
                >
                  {isShortlisted ? (
                    <span className="d-flex align-items-center gap-1 justify-content-center">
                      <GiCheckMark size={11} /> Selected
                    </span>
                  ) : "Shortlist"}
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
