import React, { memo } from "react";
import { FiMapPin, FiBriefcase, FiClock, FiDollarSign } from "react-icons/fi";
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
    <div className={`candidate-card h-100 justify-content-between ${small ? 'small-card' : ''}`} style={small ? { padding: '16px', borderRadius: '12px' } : {}}>
      <div className="d-flex flex-column gap-2">
        {/* Header: Avatar, Name, Rating */}
        <div className="card-header" style={small ? { marginBottom: '8px' } : {}}>
          <div className="avatar-wrapper" style={small ? { width: '36px', height: '36px' } : {}}>
            {candidate.avatar ? (
              <img
                src={candidate.avatar}
                alt={candidate.name}
                className="avatar"
                style={small ? { width: '36px', height: '36px' } : {}}
              />
            ) : (
              <div className="avatar initial-avatar d-flex align-items-center justify-content-center" style={small ? { width: '36px', height: '36px', fontSize: '14px' } : {}}>
                {getInitials(candidate.name || candidate.company)}
              </div>
            )}
            {candidate.verified && (
              <div className="verified-badge" style={small ? { width: '12px', height: '12px' } : {}}>
                <GiCheckMark size={small ? 8 : 10} />
              </div>
            )}
          </div>
          <div className="header-info flex-column gap-0 align-items-start">
            <div className="name-row w-100">
              <h4 className="name" style={small ? { fontSize: '14px' } : {}}>{candidate.name || candidate.title}</h4>
              {!small && candidate.rating && (
                <div className="rating-badge">
                  <FaStar size={10} fill="#f59e0b" color="#f59e0b" />
                  <span>{candidate.rating}</span>
                </div>
              )}
            </div>
            <div className="role" style={small ? { fontSize: '11px', color: candidate.salary ? '#f5810c' : '#64748b' } : {}}>{candidate.role || candidate.company}</div>
            
            {candidate.department && (
              <span style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', background: '#f8fafc', padding: '1px 6px', borderRadius: '4px', marginTop: '2px', border: '1px solid #e2e8f0' }}>{candidate.department}</span>
            )}

            {candidate.uploadedByName && (
              <div className="d-flex align-items-center gap-1 mt-1" style={{ 
                background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)", 
                padding: small ? "2px 6px" : "4px 10px", 
                borderRadius: "100px", 
                border: "1px solid #e2e8f0",
                width: "fit-content",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
              }}>
                <span style={{ fontSize: small ? "7px" : "9px", color: "#64748b", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.03em" }}>APPROVED By: {candidate.uploadedByName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Section (Optional) */}
        {candidate.progress !== undefined && (
          <div className="progress-section" style={{ margin: small ? "4px 0" : "8px 0" }}>
            <div className="progress-labels d-flex justify-content-between mb-1">
              <span style={{ fontWeight: "600", fontSize: "9px", textTransform: "uppercase", color: "#94a3b8" }}>Progress</span>
              <span style={{ color: "#f5810c", fontWeight: "700", fontSize: "10px" }}>{candidate.progress}%</span>
            </div>
            <div className="progress-bg" style={{ height: "4px", background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
              <div
                className="progress-fill"
                style={{ width: `${candidate.progress}%`, height: '100%', background: '#f5810c', transition: 'width 0.3s ease' }}
              ></div>
            </div>
          </div>
        )}

        {/* Meta Info Grid */}
        <div className="meta-info" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: small ? '6px' : '12px' }}>
          {candidate.salary && (
            <div className="meta-item" style={{ fontSize: small ? '10px' : '12px' }}>
              <FiDollarSign size={small ? 12 : 14} />
              <span>{candidate.salary}</span>
            </div>
          )}
          <div className="meta-item" style={{ fontSize: small ? '10px' : '12px' }}>
            <FiBriefcase size={small ? 12 : 14} />
            <span>{candidate.experience}</span>
          </div>
          <div className="meta-item" style={{ fontSize: small ? '10px' : '12px' }}>
            <FiMapPin size={small ? 12 : 14} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{candidate.location}</span>
          </div>
          <div className="meta-item" style={{ fontSize: small ? '10px' : '12px' }}>
            <FiClock size={small ? 12 : 14} />
            <span>{candidate.type || candidate.workModel || 'N/A'}</span>
          </div>
        </div>

        {/* Tags section (Hidden in small) */}
        {!small && candidate.skills && (
          <div className="tags-section">
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
            {candidate.availability && (
              <div className="tags-group2">
                {candidate.availability.map((avail, idx) => (
                  <span key={idx} className="tag-pill availability">
                    <FiClock size={10} style={{ marginRight: "4px" }} />{" "}
                    {avail}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- ACTION BUTTONS --- */}
      <div className="card-actions" style={small ? { marginTop: '12px' } : {}}>
        <button
          className="btn-primary"
          onClick={handleProfileClick}
          style={small ? { padding: '6px 12px', fontSize: '12px', borderRadius: '8px', flex: 1 } : {}}
        >
          {primaryActionLabel || (candidate.salary ? 'Add Talent' : small ? 'Details' : 'View Profile')}
        </button>

        {!candidate.salary && (
          <button
            className={isSelected ? "btn-shortlisted" : "btn-shortlist"}
            onClick={() => onToggle(candidate.id)}
            title={isSelected ? "Remove from selection" : "Add to selection"}
            style={
              small 
                ? { padding: '6px 12px', fontSize: '12px', borderRadius: '8px', ...(!isSelected ? { borderColor: "#e2e8f0", color: "#475569", backgroundColor: "transparent", boxShadow: "none" } : { backgroundColor: "#059669", borderColor: "#059669" }) }
                : !isSelected
                  ? { borderColor: "#e2e8f0", color: "#475569", backgroundColor: "transparent", boxShadow: "none" }
                  : { backgroundColor: "#059669", borderColor: "#059669" }
            }
          >
            {isSelected ? (
              <>{small ? <GiCheckMark size={10} /> : <GiCheckMark size={12} />} {small ? 'Selected' : 'Selected'}</>
            ) : (
              "Select"
            )}
          </button>
        )}
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
