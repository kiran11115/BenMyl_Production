import React from "react";
import { FiMapPin, FiStar, FiBriefcase, FiClock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const TalentGridView = ({
  candidates = [],
  onShortlist,
  activeJobId,
  activeJobColor,
  shortlistedMap,
  hasMore
}) => {
  const navigate = useNavigate();

  const matchingCount = candidates.length;

  return (
    <div>
      {/* Matching profiles count */}
      <div className="grid-meta">
        <div className="grid-count">
         matching {matchingCount === 1 ? "profile" : "profiles"}
        </div>
      </div>

      {!hasMore && candidates.length === 0 && (
  <div style={{ textAlign: "center", padding: "12px", color: "#94a3b8" }}>
    No candidates to show
  </div>
)}


      <div className="jobs-grid">
        {candidates.map((candidate) => {
          const isShortlisted =
            activeJobId &&
            shortlistedMap?.[activeJobId]?.find((c) => c.id === candidate.id);

          return (
            <div key={candidate.id} className="project-card">
              {/* 1. Header: Avatar, Name, Rating */}
              <div className="card-header">
                <img
                  src={candidate.avatar}
                  alt={candidate.name}
                  className="avatar"
                />
                <div className="header-info">
                  <div className="name-row">
                    <h4 className="name">
                      {candidate.name} {candidate.verified}
                    </h4>
                    <div className="rating">
                      <FiStar size={12} fill="#f59e0b" color="#f59e0b" />
                      <span style={{ color: "#f59e0b" }}>
                        {candidate.rating}
                      </span>
                    </div>
                  </div>
                  <div className="role">{candidate.role}</div>
                </div>
              </div>

              {/* 2. Meta Info: Exp, Location */}
              <div className="meta-grid">
                <div className="meta-item">
                  <FiBriefcase size={14} /> <span>{candidate.experience}</span>
                </div>
                <div className="meta-item">
                  <FiMapPin size={14} /> <span>{candidate.location}</span>
                </div>
              </div>

              {/* Availability Badges */}
              <div className="badges-row">
                {candidate.availability.map((avail, idx) => (
                  <span key={idx} className="status-tag status-completed">
                    <FiClock size={12} /> {avail}
                  </span>
                ))}
              </div>

              {/* Skills Tags */}
              <div className="skills-row">
                {candidate.skills.slice(0, 3).map((skill) => (
                  <span key={skill} className="status-tag status-progress">
                    {skill}
                  </span>
                ))}
                {candidate.skills.length > 3 && (
                  <span className="skill-tag count">
                    +{candidate.skills.length - 3}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="d-flex gap-3">
                <button
                  onClick={() =>
    navigate("/user/user-talent-profile", {
      state: { employeeID: candidate.id },
    })
  }
                  className="btn-primary"
                >
                  View Profile
                </button>

                <button
                  onClick={() => onShortlist(candidate)}
                  style={{
                    borderColor: activeJobId ? activeJobColor : "#cbd5e1",
                    backgroundColor: isShortlisted ? activeJobColor : "transparent",
                    color: isShortlisted
                      ? "white"
                      : activeJobId
                      ? activeJobColor
                      : "#64748b",
                  }}
                  className="btn-secondary"
                >
                  {isShortlisted ? "Shortlisted" : "Shortlist"}
                </button>
              </div>

              {/* Internal CSS */}
              <style jsx>{`
                /* Header */
                .card-header {
                  display: flex;
                  gap: 12px;
                  align-items: flex-start;
                }
                .avatar {
                  width: 52px;
                  height: 52px;
                  border-radius: 50%;
                  object-fit: cover;
                  border: 2px solid #f8fafc;
                }
                .header-info {
                  flex: 1;
                }
                .name-row {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                }
                .name {
                  margin: 0;
                  font-size: 16px;
                  font-weight: 700;
                  color: #1e293b;
                  display: flex;
                  align-items: center;
                  gap: 6px;
                }
                .role {
                  font-size: 13px;
                  color: #6366f1;
                  font-weight: 500;
                  margin-top: 2px;
                }
                .rating {
                  display: flex;
                  align-items: center;
                  gap: 4px;
                  font-size: 13px;
                  font-weight: 600;
                  color: #475569;
                  background: #fffbeb;
                  padding: 2px 6px;
                  border-radius: 4px;
                }

                /* Meta Grid */
                .meta-grid {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 8px 12px;
                  font-size: 12px;
                  color: #64748b;
                }
                .meta-item {
                  display: flex;
                  align-items: center;
                  gap: 6px;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }

                /* Badges */
                .badges-row {
                  display: flex;
                  flex-wrap: wrap;
                  gap: 8px;
                }

                /* Skills */
                .skills-row {
                  display: flex;
                  flex-wrap: wrap;
                  gap: 6px;
                }
                .skill-tag {
                  background: #f1f5f9;
                  color: #475569;
                  font-size: 12px;
                  padding: 3px 8px;
                  border-radius: 4px;
                  font-weight: 500;
                }
                .skill-tag.count {
                  background: #e2e8f0;
                  color: #64748b;
                }

                /* Count header */
                .grid-meta {
                  display: flex;
                  align-items: center;
                  justify-content: flex-start;
                  margin-bottom: 10px;
                }
                .grid-count {
                  font-size: 13px;
                  font-weight: 800;
                  color: #334155;
                }
              `}</style>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TalentGridView;
