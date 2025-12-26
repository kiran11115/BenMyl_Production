import React, { memo, useState, useMemo } from "react";
import {
  FiBriefcase,
  FiMapPin,
  FiMoreVertical,
  FiChevronUp,
  FiChevronDown,
} from "react-icons/fi";
import { FaSort } from "react-icons/fa";
import TalentAvailabilityBadge from "./TalentAvailabilityBadge";

// --- Sub-component: Sort Icon Helper ---
const SortIcon = ({ active, direction }) => {
  if (!active) {
    return <FaSort className="tt-sort-icon" />;
  }
  return direction === "ascending" ? (
    <FiChevronUp className="tt-sort-icon active" />
  ) : (
    <FiChevronDown className="tt-sort-icon active" />
  );
};

// --- Sub-component: Table Row ---
const CandidateRow = memo(({ candidate }) => (
  <tr className="tt-row">
    <td className="tt-td">
      <input type="checkbox" className="row-checkbox" />
    </td>
    <td className="tt-td">
      <div className="tt-candidate-flex">
        <img src={candidate.avatar} alt="" className="tt-avatar" />
        <div className="tt-info-col">
          <span className="tt-name">{candidate.name}</span>
          <span className="tt-email">{candidate.email}</span>
        </div>
      </div>
    </td>
    <td className="tt-td">
      <div className="tt-role-flex">
        <span className="tt-role">{candidate.role}</span>
        <span className="tt-exp">
          <FiBriefcase size={12} /> {candidate.experience}
        </span>
      </div>
    </td>
    <td className="tt-td">
      <div className="tt-skills-flex">
        {candidate.skills.slice(0, 2).map((skill) => (
          <span key={skill} className="status-tag status-progress">
            {skill}
          </span>
        ))}
        {candidate.skills.length > 2 && (
          <span className="tt-skill-more">+{candidate.skills.length - 2}</span>
        )}
      </div>
    </td>
    <td className="tt-td">
      <div className="tt-location">
        <FiMapPin size={14} color="#9ca3af" /> {candidate.location}
      </div>
    </td>
    <td className="tt-td">
      <div className="tt-role-flex">
        {candidate.availability.map((avail) => (
          <TalentAvailabilityBadge key={avail} text={avail} />
        ))}
      </div>
    </td>
    <td className="tt-td action">
      <button className="tt-action-btn">
        <FiMoreVertical size={18} />
      </button>
    </td>
  </tr>
));

// --- Main Component ---
const UserTalentTable = ({ candidates }) => {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  // Universal Sorting Logic
  const sortedCandidates = useMemo(() => {
    let sortableItems = [...candidates];

    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        // Use optional chaining to safely access properties
        let aValue = a[sortConfig.key] ?? "";
        let bValue = b[sortConfig.key] ?? "";

        // 1. Handle Arrays (Skills, Availability)
        if (Array.isArray(aValue)) {
          aValue = aValue.join(", ").toLowerCase();
          bValue = bValue.join(", ").toLowerCase();
        }
        // 2. Handle Strings
        else if (typeof aValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        // 3. Comparison
        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [candidates, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    // If clicking the same header, toggle direction
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="tt-wrapper">
      <table className="tt-table">
        <thead>
          <tr className="tt-thead-tr">
            <th className="tt-th" style={{ width: "40px" }}></th>

            {/* 1. Name */}
            <th className="tt-th sortable" onClick={() => requestSort("name")}>
              <div className="tt-th-content">
                Candidate
                <SortIcon
                  active={sortConfig.key === "name"}
                  direction={sortConfig.direction}
                />
              </div>
            </th>

            {/* 2. Role */}
            <th className="tt-th sortable" onClick={() => requestSort("role")}>
              <div className="tt-th-content">
                Role & Experience
                <SortIcon
                  active={sortConfig.key === "role"}
                  direction={sortConfig.direction}
                />
              </div>
            </th>

            {/* 3. Skills */}
            <th className="tt-th sortable" onClick={() => requestSort("skills")}>
              <div className="tt-th-content">
                Skills
                <SortIcon
                  active={sortConfig.key === "skills"}
                  direction={sortConfig.direction}
                />
              </div>
            </th>

            {/* 4. Location */}
            <th className="tt-th sortable" onClick={() => requestSort("location")}>
              <div className="tt-th-content">
                Location
                <SortIcon
                  active={sortConfig.key === "location"}
                  direction={sortConfig.direction}
                />
              </div>
            </th>

            {/* 5. Availability */}
            <th className="tt-th sortable" onClick={() => requestSort("availability")}>
              <div className="tt-th-content">
                Availability
                <SortIcon
                  active={sortConfig.key === "availability"}
                  direction={sortConfig.direction}
                />
              </div>
            </th>

            <th className="tt-th" style={{ textAlign: "right" }}>
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedCandidates.map((c) => (
            <CandidateRow key={c.id} candidate={c} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTalentTable;
