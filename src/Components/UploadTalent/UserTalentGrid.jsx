import React, { memo } from "react";
import { FiMapPin, FiBriefcase, FiDollarSign, FiEye } from "react-icons/fi";
import { GiCheckMark } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import "../TalentPool/TalentPool.css";


/* Premium chip color palettes for skill tags */
const CHIP_PALETTES = [
  { bg: "#eff6ff", color: "#1d4ed8", border: "#dbeafe" }, // blue
  { bg: "#f5f3ff", color: "#6d28d9", border: "#ede9fe" }, // purple
  { bg: "#f0fdf4", color: "#15803d", border: "#dcfce7" }, // green
  { bg: "#fff7ed", color: "#c2410c", border: "#ffedd5" }, // orange
  { bg: "#fdf2f8", color: "#be185d", border: "#fce7f3" }, // pink
];

export const CandidateCard = memo(({ candidate, isSelected, onToggle, onPrimaryAction, primaryActionLabel, small = false }) => {
  const navigate = useNavigate();
  const handleProfileClick = (e) => {
    e.stopPropagation();
    if (onPrimaryAction) {
      onPrimaryAction(candidate);
      return;
    }
    const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
    navigate(`${basePath}/talent-profile`, {
      state: {
        employeeId: candidate.id,
        candidate: candidate, // Pass the whole object as payload
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
    <div
      className={`talent-card-premium ${small ? 'small-variant' : ''}`}
      style={small ? { padding: '16px', gap: '12px' } : {}}
    >
      {/* Header: Status Pill, Match Badge, and Eye Icon */}
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
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {candidate.progress !== undefined && (
            <div className="match-badge">
              {candidate.progress}% Match
            </div>
          )}

          <div
            className="eye-icon-btn"
            onClick={handleProfileClick}
            title="View Profile"
            style={small ? { padding: '4px' } : {}}
          >
            <FiEye size={15} />
          </div>
        </div>
      </div>

      {/* Profile Section: Avatar, Name, and Role */}
      <div 
        className="profile-section" 
        onClick={handleProfileClick}
        style={{ cursor: 'pointer' }}
      >
        {candidate.avatar ? (
          <img
            src={candidate.avatar}
            alt={candidate.name}
            className="profile-avatar"
            style={small ? { width: '38px', height: '38px' } : {}}
          />
        ) : (
          <div
            className="profile-avatar initials"
            style={small ? { width: '34px', height: '34px', fontSize: '11px' } : {}}
          >
            {getInitials(candidate.name || candidate.title || candidate.company)}
          </div>
        )}
        <div className="profile-details">
          <h4 className="name" style={small ? { fontSize: '13.5px' } : {}}>{candidate.name || candidate.title}</h4>
          <p className="role" style={small ? { fontSize: '11px' } : {}}>{candidate.role || candidate.company}</p>
        </div>
      </div>

      {/* Meta Grid: Salary, Experience, Location */}
      <div className="meta-grid" style={small ? { padding: '8px', gap: '8px' } : {}}>
        {candidate.salary && (
          <div className="meta-item">
            <FiDollarSign size={small ? 10 : 12} />
            <span>{candidate.salary}</span>
          </div>
        )}
        <div className="meta-item">
          <FiBriefcase size={small ? 10 : 12} />
          <span>{candidate.experience}</span>
        </div>
        <div className="meta-item">
          <FiMapPin size={small ? 10 : 12} />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{candidate.location}</span>
        </div>
      </div>

      {/* Skills Chips Row */}
      {!small && candidate.skills && (
        <div className="skills-row">
          {candidate.skills.slice(0, 3).map((skill, si) => {
            const chip = CHIP_PALETTES[si % CHIP_PALETTES.length];
            return (
              <span 
                key={skill} 
                className="skill-chip"
                style={{
                  background: chip.bg,
                  color: chip.color,
                  borderColor: chip.border,
                }}
              >
                {skill}
              </span>
            );
          })}
          {candidate.skills.length > 3 && (
            <span className="skill-chip more">
              +{candidate.skills.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer / Actions: Uploaded By + Select Button */}
      <div
        className="card-actions"
        onClick={(e) => e.stopPropagation()}
        style={{
          marginTop: 'auto',
          paddingTop: '12px',
          borderTop: '1px solid #edf0f5'
        }}
      >
        {candidate.uploadedByName ? (
          <div
            className="uploaded-by-text"
            title={`Uploaded By: ${candidate.uploadedByName}`}
          >
            By: {candidate.uploadedByName}
          </div>
        ) : (
          <div />
        )}

        {!candidate.salary && (
          <button
            onClick={() => onToggle(candidate.id)}
            className={isSelected ? "btn-v2-primary shortlisted" : "btn-v2-primary"}
            style={small ? { padding: '6px 12px', fontSize: '10.5px', borderRadius: '8px' } : { padding: '8px 18px', borderRadius: '8px' }}
          >
            {isSelected ? (
              <span className="d-flex align-items-center gap-1 justify-content-center">
                <GiCheckMark size={10} /> Selected
              </span>
            ) : (
              "Select"
            )}
          </button>
        )}
      </div>
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
