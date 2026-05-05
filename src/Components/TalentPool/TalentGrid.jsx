import React from "react";
import { FiMapPin, FiStar, FiBriefcase, FiClock } from "react-icons/fi";
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
  (candidate) => candidate.isshortlisted  === false
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
            <div key={candidate.id} className="candidate-card">
              {/* Header: Avatar, Name, Rating */}
              <div className="card-header">
                <div className="avatar-wrapper">
                  {candidate.avatar ? (
                    <img
                      src={candidate.avatar}
                      alt={candidate.name}
                      className="avatar"
                    />
                  ) : (
                    <div className="avatar initial-avatar d-flex align-items-center justify-content-center" style={{ backgroundColor: "#f1f5f9", color: "#475569", fontSize: "18px", fontWeight: 700, textTransform: "uppercase" }}>
                      {getInitials(candidate.name)}
                    </div>
                  )}
                  {candidate.verified && (
                    <div className="verified-badge">
                      <GiCheckMark size={10} />
                    </div>
                  )}
                </div>
                <div className="header-info flex-column gap-0 align-items-start">
                  <div className="name-row w-100">
                    <h4 className="name">{candidate.name}</h4>
                    <div className="rating-badge">
                      <FiStar size={10} fill="#f59e0b" color="#f59e0b" />
                      <span>{candidate.rating}</span>
                    </div>
                  </div>
                  <div className="role">{candidate.role}</div>
                </div>
              </div>

              {/* Meta Info: Exp, Location */}
              <div className="meta-info">
                <div className="meta-item">
                  <FiBriefcase size={14} />
                  <span>{candidate.experience}</span>
                </div>
                <div className="meta-item">
                  <FiMapPin size={14} />
                  <span>{candidate.location}</span>
                </div>
              </div>

              {/* Tags section: Availability & Skills */}
              <div className="tags-section">
                {/* Skills */}
                <div className="tags-group">
                  {candidate.skills.slice(0, 3).map((skill) => (
                    <span key={skill} className="tag-pill skill">
                      {skill}
                    </span>
                  ))}
                  {candidate.skills.length > 3 && (
                    <span className="tag-pill skill">
                      +{candidate.skills.length - 3}
                    </span>
                  )}
                </div>
                {/* Availability */}
                <div className="tags-group2">
                  {candidate.availability.map((avail, idx) => (
                    <span key={idx} className="tag-pill availability">
                      <FiClock size={10} style={{ marginRight: "4px" }} />{" "}
                      {avail}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="card-actions">
                <button
                  onClick={() => onProfileClick(candidate)}
                  className="btn-primary"
                >
                  View Profile
                </button>

                <button
                  onClick={() => onShortlist(candidate)}
                  className={isShortlisted ? "btn-shortlisted" : "btn-shortlist"}
                  style={
                    !isShortlisted
                      ? {
                          borderColor: activeJobId ? activeJobColor : "#e2e8f0",
                          color: activeJobId ? activeJobColor : "#475569",
                          backgroundColor: "transparent",
                          boxShadow: "none",
                        }
                      : {
                          backgroundColor: activeJobColor || "#059669",
                          borderColor: activeJobColor || "#059669",
                        }
                  }
                >
                  {isShortlisted ? (
                    <>
                      <GiCheckMark size={12} /> Shortlisted
                    </>
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
