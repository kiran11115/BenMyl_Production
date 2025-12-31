import React, { memo } from "react";
import { FiMapPin } from "react-icons/fi"; 
import { FaStar } from "react-icons/fa";

const CandidateCard = memo(({ candidate, onProfileClick, isSelected, onToggle }) => (
  <div className="project-card justify-content-between h-100">
      <div className="d-flex flex-column gap-3">
        {/* --- Header Section --- */}
        <div className="card-header">
          <div className="card-header gap-2">
            <img
              src={candidate.avatar}
              alt={candidate.name}
              className="v-avatar"
              loading="lazy"
            />
            <div>
              <div className="candidate-name-row">
                <div className="d-flex align-items-center gap-2">
                  <h4 className="card-title">{candidate.name}</h4>
                  {candidate.verified && <span>{candidate.verified}</span>}
                </div>
              </div>
              <div className="candidate-sub">
                <span>{candidate.role}</span>
                <span>{candidate.experience}</span>
              </div>
            </div>
          </div>
          <div className="candidate-rating">
            <FaStar />
            <span>{candidate.rating}</span>
          </div>
        </div>

        {/* --- Skills Tags --- */}
        <div className="v-tags">
          {candidate.skills.slice(0, 3).map((s) => (
            <span className="status-tag status-progress" key={s}>
              {s}
            </span>
          ))}
        </div>

        {/* --- Meta Info --- */}
        <div className="candidate-meta">
          <div className="meta-item">
            <FiMapPin />
            <span>{candidate.location}</span>
          </div>
        </div>
        
        <div className="candidate-badges m-0">
          {candidate.availability.map((a) => (
            <span key={a} className="status-tag status-completed">
              {a}
            </span>
          ))}
        </div>
      </div>

      {/* --- ACTION BUTTONS --- */}
      <div className="card-actions d-flex gap-2">
        <button className="btn-primary flex-grow-1" onClick={onProfileClick}>
          View Profile
        </button>

          <button 
            // Append 'btn-selected' class if isSelected is true
            className={`btn-secondary ${isSelected ? 'btn-selected' : ''}`} 
            onClick={() => onToggle(candidate.id)}
            title={isSelected ? "Remove from selection" : "Add to selection"}
            style={{ minWidth: "100px", transition: "all 0.2s ease" }}
        >
            <span>{isSelected ? "Selected" : "Select"}</span>
        </button>
      </div>

      <style jsx>{`
        /* Override styles for the selected state */
        .btn-selected {
            background-color: #10b981 !important; /* Green */
            border-color: #10b981 !important;
            color: white !important;
        }
        
        .btn-selected:hover {
            background-color: #059669 !important; /* Darker Green on hover */
            border-color: #059669 !important;
        }
      `}</style>
  </div>
));

const UserTalentGrid = ({ candidates, onProfileClick, selectedIds, onToggleSelect }) => {
  return (
    <div className="jobs-grid">
      {candidates.map((c) => (
        <CandidateCard
          key={c.id}
          candidate={c}
          onProfileClick={onProfileClick}
          isSelected={selectedIds.has(c.id)}
          onToggle={onToggleSelect}
        />
      ))}
    </div>
  );
};

export default UserTalentGrid;
