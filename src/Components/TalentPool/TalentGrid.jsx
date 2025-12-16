import React, { memo } from "react";
import { FiMapPin, FiBriefcase } from "react-icons/fi";
import { FaStar } from "react-icons/fa";

const TalentCard = memo(({ candidate, onProfileClick }) => (
  <div className="vendor-card">
    <div className="left">
      <img
        src={candidate.avatar}
        alt={candidate.name}
        className="v-avatar"
        loading="lazy"
      />
      <div className="v-info">
        <div className="v-header">
          <h4>{candidate.name}</h4>
          <div className="v-stars">
            <FaStar color="#fbbf24" />
            <span>{candidate.rating}</span>
          </div>
        </div>
        
        <div className="v-tags">
          <span className="tag">{candidate.role}</span>
          {candidate.skills.slice(0, 2).map((s) => (
            <span key={s} className="tag" style={{ background: "#f1f5f9", color: "#475569" }}>
              {s}
            </span>
          ))}
        </div>

        <div className="v-meta">
          <div className="meta-item">
            <FiMapPin size={14} />
            <span>{candidate.location}</span>
          </div>
          <div className="meta-item">
            <FiBriefcase size={14} />
            <span>{candidate.experience}</span>
          </div>
        </div>
      </div>
    </div>

    <div className="right">
      <div className="budget">
        {candidate.availability[0]}
      </div>
      <div className="actions">
        <button className="btn-outline" onClick={onProfileClick}>
          Profile
        </button>
        <button className="btn-solid">
          Shortlist
        </button>
      </div>
    </div>
  </div>
));

export default TalentCard;
