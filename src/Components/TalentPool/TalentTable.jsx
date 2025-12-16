import React, { memo } from "react";
import { FiBriefcase, FiMapPin, FiMoreVertical } from "react-icons/fi";
import "./TalentPool.css";

// Utility for badge styling logic
const AvailabilityBadge = ({ text }) => {
  let className = "avail-badge default";

  if (text.includes("Available Now")) className = "avail-badge green";
  else if (text.includes("Remote")) className = "avail-badge blue";
  else if (text.includes("Notice") || text.includes("Part-time")) className = "avail-badge orange";
  else if (text.includes("Entry")) className = "avail-badge pink";

  return <span className={className}>{text}</span>;
};

const CandidateRow = memo(({ candidate }) => (
  <tr className="t-row">
    {/* 1. Checkbox */}
    <td className="t-cell">
      <input type="checkbox" className="row-checkbox" />
    </td>

    {/* 2. Candidate Info */}
    <td className="t-cell">
      <div className="t-user-flex">
        <img src={candidate.avatar} alt="" className="t-avatar-img" />
        <div className="t-user-info">
          <span className="t-name">{candidate.name}</span>
          <span className="t-email">{candidate.email}</span>
        </div>
      </div>
    </td>

    {/* 3. Role & Experience */}
    <td className="t-cell">
      <div className="t-role-flex">
        <span className="t-role-title">{candidate.role}</span>
        <span className="t-exp">
          <FiBriefcase size={12} /> {candidate.experience}
        </span>
      </div>
    </td>

    {/* 4. Skills */}
    <td className="t-cell">
      <div className="t-skills-flex">
        {candidate.skills.slice(0, 2).map((skill) => (
          <span key={skill} className="t-skill-tag">
            {skill}
          </span>
        ))}
        {candidate.skills.length > 2 && (
          <span className="t-skill-more">+{candidate.skills.length - 2}</span>
        )}
      </div>
    </td>

    {/* 5. Location */}
    <td className="t-cell">
      <div className="t-loc-flex">
        <FiMapPin size={14} color="#9ca3af" /> {candidate.location}
      </div>
    </td>

    {/* 6. Availability */}
    <td className="t-cell">
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {candidate.availability.map((avail) => (
          <AvailabilityBadge key={avail} text={avail} />
        ))}
      </div>
    </td>

    {/* 7. Action */}
    <td className="t-cell" style={{ textAlign: "right" }}>
      <button className="t-action-btn">
        <FiMoreVertical size={18} />
      </button>
    </td>
  </tr>
));

const TalentTable = ({ candidates }) => {
  return (
    <div className="table-wrapper">
      <table className="t-table">
        <thead>
          <tr className="t-head-row">
            <th className="t-th" style={{ width: "40px" }}><input type="checkbox" /></th>
            <th className="t-th">Candidate</th>
            <th className="t-th">Role & Experience</th>
            <th className="t-th">Skills</th>
            <th className="t-th">Location</th>
            <th className="t-th">Availability</th>
            <th className="t-th" style={{ textAlign: "right" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((c) => (
            <CandidateRow key={c.id} candidate={c} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TalentTable;
