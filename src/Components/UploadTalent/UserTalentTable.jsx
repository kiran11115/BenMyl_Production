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

/* ---------------- HELPER: INITIALS ---------------- */
const getInitials = (name = "") => {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
};

/* ---------------- SORT ICON ---------------- */
const SortIcon = ({ active, direction }) => {
  if (!active) return <FaSort className="tt-sort-icon" />;

  return direction === "ascending" ? (
    <FiChevronUp className="tt-sort-icon active" />
  ) : (
    <FiChevronDown className="tt-sort-icon active" />
  );
};

/* ---------------- TABLE ROW ---------------- */
const CandidateRow = memo(({ candidate, isSelected, onToggle }) => {
  return (
    <tr className="tt-row">
      {/* Checkbox */}
      <td className="tt-td">
        <input
          type="checkbox"
          className="row-checkbox"
          checked={isSelected}
          onChange={() => onToggle(candidate.id)}
        />
      </td>

      {/* Candidate */}
      <td className="tt-td">
        <div className="tt-candidate-flex">
          {/* Initial Avatar */}
          <div className="initial-avatar">
            {getInitials(candidate.name)}
          </div>

          <div className="tt-info-col">
            <span className="tt-name">{candidate.name}</span>
            <span className="tt-email">{candidate.email}</span>
          </div>
        </div>
      </td>

      {/* Role & Experience */}
      <td className="tt-td">
        <div className="tt-role-flex">
          <span className="tt-role">{candidate.role}</span>
          <span className="tt-exp">
            <FiBriefcase size={12} /> {candidate.experience}
          </span>
        </div>
      </td>

      {/* Skills */}
      <td className="tt-td">
        <div className="tt-skills-flex">
          {candidate.skills.slice(0, 2).map((skill) => (
            <span key={skill} className="status-tag status-progress">
              {skill}
            </span>
          ))}
          {candidate.skills.length > 2 && (
            <span className="tt-skill-more">
              +{candidate.skills.length - 2}
            </span>
          )}
        </div>
      </td>

      {/* Location */}
      <td className="tt-td">
        <div className="tt-location">
          <FiMapPin size={14} color="#9ca3af" /> {candidate.location}
        </div>
      </td>

      {/* Availability */}
      <td className="tt-td">
        <div className="tt-role-flex">
          {candidate.availability.map((avail) => (
            <TalentAvailabilityBadge key={avail} text={avail} />
          ))}
        </div>
      </td>

      {/* Action */}
      <td className="tt-td action">
        <button className="tt-action-btn">
          <FiMoreVertical size={18} />
        </button>
      </td>
    </tr>
  );
});

/* ---------------- MAIN TABLE ---------------- */
const UserTalentTable = ({ candidates, selectedIds, onToggleSelect }) => {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  /* ---------- SORTING ---------- */
  const sortedCandidates = useMemo(() => {
    const items = [...candidates];

    if (sortConfig.key) {
      items.sort((a, b) => {
        let aVal = a[sortConfig.key] ?? "";
        let bVal = b[sortConfig.key] ?? "";

        if (Array.isArray(aVal)) {
          aVal = aVal.join(", ").toLowerCase();
          bVal = bVal.join(", ").toLowerCase();
        } else if (typeof aVal === "string") {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }

        if (aVal < bVal) return sortConfig.direction === "ascending" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }

    return items;
  }, [candidates, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
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

            <th className="tt-th sortable" onClick={() => requestSort("name")}>
              <div className="tt-th-content">
                Candidate
                <SortIcon
                  active={sortConfig.key === "name"}
                  direction={sortConfig.direction}
                />
              </div>
            </th>

            <th className="tt-th sortable" onClick={() => requestSort("role")}>
              <div className="tt-th-content">
                Role & Experience
                <SortIcon
                  active={sortConfig.key === "role"}
                  direction={sortConfig.direction}
                />
              </div>
            </th>

            <th className="tt-th sortable" onClick={() => requestSort("skills")}>
              <div className="tt-th-content">
                Skills
                <SortIcon
                  active={sortConfig.key === "skills"}
                  direction={sortConfig.direction}
                />
              </div>
            </th>

            <th className="tt-th sortable" onClick={() => requestSort("location")}>
              <div className="tt-th-content">
                Location
                <SortIcon
                  active={sortConfig.key === "location"}
                  direction={sortConfig.direction}
                />
              </div>
            </th>

            <th
              className="tt-th sortable"
              onClick={() => requestSort("availability")}
            >
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
            <CandidateRow
              key={c.id}
              candidate={c}
              isSelected={selectedIds.has(c.id)}
              onToggle={onToggleSelect}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTalentTable;
