import React, { memo } from "react";
import { FiMapPin, FiBriefcase, FiClock } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { GiCheckMark } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import "../TalentPool/TalentPool.css";

const CandidateCard = memo(({ candidate, isSelected, onToggle }) => {
  const navigate = useNavigate();
  const handleProfileClick = () => {
    const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
    navigate(`${basePath}/talent-profile`, {
      state: {
        employeeId: candidate.id,
      },
    });
  };

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0].toUpperCase())
      .join("");
  };

  return (
    <div className="candidate-card h-100 justify-content-between">
      <div className="d-flex flex-column gap-3">
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
              <div className="avatar initial-avatar d-flex align-items-center justify-content-center">
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
                <FaStar size={10} fill="#f59e0b" color="#f59e0b" />
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
      </div>

      {/* --- ACTION BUTTONS --- */}
      <div className="card-actions">
        <button
          className="btn-primary"
          onClick={handleProfileClick}
        >
          View Profile
        </button>

        <button
          className={isSelected ? "btn-shortlisted" : "btn-shortlist"}
          onClick={() => onToggle(candidate.id)}
          title={isSelected ? "Remove from selection" : "Add to selection"}
          style={
            !isSelected
              ? {
                  borderColor: "#e2e8f0",
                  color: "#475569",
                  backgroundColor: "transparent",
                  boxShadow: "none",
                }
              : {
                  backgroundColor: "#059669",
                  borderColor: "#059669",
                }
          }
        >
          {isSelected ? (
            <>
              <GiCheckMark size={12} /> Selected
            </>
          ) : (
            "Select"
          )}
        </button>
      </div>

      <style jsx>{`
        .initial-avatar {
          background-color: #f1f5f9;
          color: #475569;
          font-size: 22px;
          font-weight: 600;
          text-transform: uppercase;
        }
      `}</style>
    </div>
  );
});

const UserTalentGrid = ({ candidates, selectedIds, onToggleSelect }) => {
  return (
    <div className="candidate-grid">
      {candidates.map((c) => (
        <CandidateCard
          key={c.id}
          candidate={c}
          isSelected={selectedIds.has(c.id)}
          onToggle={onToggleSelect}
        />
      ))}
    </div>
  );
};

export default UserTalentGrid;
