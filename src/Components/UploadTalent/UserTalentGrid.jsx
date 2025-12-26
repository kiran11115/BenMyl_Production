import React, { memo } from "react";
import { FiMapPin } from "react-icons/fi";
import { FaStar } from "react-icons/fa";


// Internal Sub-component: Candidate Card
const CandidateCard = memo(({ candidate, onProfileClick }) => (
  <div className="project-card">
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
              <span>{candidate.verified}</span>
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
    <div className="v-tags">
      {candidate.skills.slice(0, 3).map((s) => (
        <span className="status-tag status-progress" key={s}>
          {s}
        </span>
      ))}
    </div>
    <div className="candidate-meta">
      <div className="meta-item">
        <FiMapPin />
        <span>{candidate.location}</span>
      </div>
    </div>
    <div className="candidate-badges">
      {candidate.availability.map((a) => (
        <span key={a} className="status-tag status-completed">
          {a}
        </span>
      ))}
    </div>
    <div className="d-flex gap-3">
      <button className="btn-primary" onClick={onProfileClick}>
        View Profile
      </button>
    </div>
  </div>
));

const UserTalentGrid = ({ candidates, onProfileClick }) => {
  return (
    <div className="projects-grid">
      {candidates.map((c) => (
        <CandidateCard
          key={c.id}
          candidate={c}
          onProfileClick={onProfileClick}
        />
      ))}
    </div>
  );
};

export default UserTalentGrid;
