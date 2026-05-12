import React, { memo } from "react";
import { FiMapPin, FiBriefcase, FiClock, FiDollarSign, FiUser } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { GiCheckMark } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import "../TalentPool/TalentPool.css";

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
      className={`interview-card-v2 h-100 ${small ? 'small-variant' : ''}`}
      style={small ? { padding: '16px', gap: '12px' } : {}}
    >
      <div className="card-accent-bar"></div>

      <div className="d-flex flex-column gap-3 h-100">
        {/* Header: Status Pill and Meta Row */}
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
          {candidate.progress !== undefined && (
            <div className="time-badge">
              <span style={{ color: '#f5810c' }}>{candidate.progress}% Match</span>
            </div>
          )}
        </div>

        {/* Profile Section */}
        <div className="card-profile-section" style={small ? { gap: '10px' } : {}}>
          {candidate.avatar ? (
            <img
              src={candidate.avatar}
              alt={candidate.name}
              className="avatar-initials-premium"
              style={small ? { width: '40px', height: '40px' } : {}}
            />
          ) : (
            <div
              className="avatar-initials-premium"
              style={small ? { width: '40px', height: '40px', fontSize: '14px' } : {}}
            >
              {getInitials(candidate.name || candidate.title || candidate.company)}
            </div>
          )}
          <div className="profile-details">
            <h4 className="candidate-name" style={small ? { fontSize: '14px' } : {}}>{candidate.name || candidate.title}</h4>
            <p className="candidate-role" style={small ? { fontSize: '11px' } : {}}>{candidate.role || candidate.company}</p>
          </div>
        </div>

        {/* Meta Grid */}
        <div className="card-meta-grid" style={small ? { padding: '8px', gap: '8px' } : {}}>
          {candidate.salary && (
            <div className="meta-pill">
              <FiDollarSign size={small ? 10 : 12} />
              <span>{candidate.salary}</span>
            </div>
          )}
          <div className="meta-pill">
            <FiBriefcase size={small ? 10 : 12} />
            <span>{candidate.experience}</span>
          </div>
          <div className="meta-pill">
            <FiMapPin size={small ? 10 : 12} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{candidate.location}</span>
          </div>
          <div className="meta-pill">
            <FiClock size={small ? 10 : 12} />
            <span>{candidate.type || candidate.workModel || 'N/A'}</span>
          </div>
          {candidate.uploadedByName && (
            <div className="meta-pill" title={`Uploaded By: ${candidate.uploadedByName}`}>
              <FiUser size={small ? 10 : 12} />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                By: {candidate.uploadedByName}
              </span>
            </div>
          )}
        </div>

        {/* Skills Row (Optional) */}
        {!small && candidate.skills && (
          <div className="card-skills-row mt-1">
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
        )}

        {/* Actions */}
        <div className="card-actions-v2 mt-auto" style={small ? { gap: '8px' } : {}}>
          <button
            onClick={handleProfileClick}
            className="btn-v2-outline"
            style={small ? { padding: '6px', fontSize: '11px' } : {}}
          >
            {primaryActionLabel || (small ? 'Details' : 'View Profile')}
          </button>

          {!candidate.salary && (
            <button
              onClick={() => onToggle(candidate.id)}
              className={isSelected ? "btn-v2-primary shortlisted" : "btn-v2-primary"}
              style={small ? { padding: '6px', fontSize: '11px' } : {}}
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
