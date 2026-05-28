import React from "react";
import { FiMapPin, FiStar, FiBriefcase, FiClock, FiUser } from "react-icons/fi";
import { GiCheckMark } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import NoData from "../UploadTalent/NoData";

const TalentGridView = ({
  candidates = [],
  onShortlist,
  activeJobId,
  activeJobColor,
  shortlistedMap,
  onProfileClick,
  hasMore,
}) => {
  const navigate = useNavigate();

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0].toUpperCase())
      .join("");
  };

  const visibleCandidates = candidates.filter(
    (candidate) => candidate.isshortlisted === false
  );
  const matchingCount = visibleCandidates.length;

  return (
    <div>
      {/* Matching profiles count */}
      <div className="grid-meta">
        <div className="grid-count text-capitalize">
          matching {matchingCount === 1 ? "profile" : "profiles"}
        </div>
      </div>

      {visibleCandidates.length === 0 && (
        <div
          style={{
            minHeight: "320px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <NoData text="No Matching Profiles found" />
        </div>
      )}

      <div className="candidate-grid">
        {visibleCandidates.map((candidate) => {
          const isShortlisted =
            activeJobId &&
            shortlistedMap?.[activeJobId]?.find((c) => c.id === candidate.id);

          return (
            <div key={candidate.id} className="interview-card-v2">
              <div className="card-accent-bar"></div>

              {/* Header: Status Pill and Rating */}
              <div className="card-header-row">
                <div className="status-pill-v2">
                  <span className="dot" style={{ 
                    background: 
                      candidate.status === 'AVAILABLE' ? '#10b981' : 
                      candidate.status === 'SHORTLISTED' ? '#3b82f6' : 
                      candidate.status === 'INTERVIEWING' ? '#8b5cf6' : 
                      '#f59e0b' 
                  }}></span>
                  {candidate.status || (candidate.verified ? 'Verified' : 'Pending')}
                </div>
                <div
            style={{
              background: "#e8f8ef",
              color: "#0f9f57",
              fontSize: "12px",
              fontWeight: "700",
              padding: "4px 10px",
              borderRadius: "8px",
            }}
          >
            93% AIMatch
          </div>
              </div>

              {/* Profile Section */}
              <div className="card-profile-section">
                {candidate.avatar ? (
                  <img src={candidate.avatar} alt={candidate.name} className="avatar-initials-premium" />
                ) : (
                  <div className="avatar-initials-premium">
                    {getInitials(candidate.name)}
                  </div>
                )}
                <div className="profile-details">
                  <h4 className="candidate-name">{candidate.name}</h4>
                  <p className="candidate-role">{candidate.role}</p>
                </div>
              </div>

              {/* Meta Info: Exp, Location */}
              <div className="card-meta-grid">
                <div className="meta-pill">
                  <FiBriefcase size={12} />
                  <span>{candidate.experience}</span>
                </div>
                <div className="meta-pill">
                  <FiMapPin size={12} />
                  <span>{candidate.location}</span>
                </div>
                {candidate.uploadedByName && (
                  <div className="meta-pill" title={`Uploaded By: ${candidate.uploadedByName}`}>
                    <FiUser size={12} />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      By: {candidate.uploadedByName}
                    </span>
                  </div>
                )}
              </div>

              {/* Skills Row */}
              <div className="card-skills-row">
                {candidate.skills.slice(0, 3).map((skill) => (
                  <span key={skill} className="status-tag">
                    {skill}
                  </span>
                ))}
                {candidate.skills.length > 3 && (
                  <span className="status-tag count">
                    +{candidate.skills.length - 3}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="card-actions-v2">
                <button
                  onClick={() => onProfileClick(candidate)}
                  className="btn-v2-outline"
                >
                  View Profile
                </button>

                <button
                  onClick={() => onShortlist(candidate)}
                  className={isShortlisted ? "btn-v2-primary shortlisted" : "btn-v2-primary"}
                  style={
                    isShortlisted && activeJobColor
                      ? { backgroundColor: activeJobColor, borderColor: activeJobColor }
                      : {}
                  }
                >
                  {isShortlisted ? (
                    <span className="d-flex align-items-center gap-1">
                      <GiCheckMark size={12} /> Selected
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
