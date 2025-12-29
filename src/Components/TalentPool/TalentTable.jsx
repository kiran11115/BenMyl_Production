import React, { memo, useState, useMemo } from "react";
import { FiBriefcase, FiMapPin, FiChevronUp, FiChevronDown } from "react-icons/fi";
import { FaSort } from "react-icons/fa";

// --- Sub-component: Availability Badge ---
const AvailabilityBadge = ({ text }) => (
  <span style={{ 
    display: 'inline-block', padding: '4px 10px', borderRadius: '6px', 
    fontSize: '11px', fontWeight: '600', marginRight: '4px' , backgroundColor: "#f0fdf4",
    color: "#22c55e",
  }}>
    {text}
  </span>
);

// --- Sub-component: Sort Icon Helper ---
const SortIcon = ({ active, direction }) => {
  if (!active) return <FaSort className="tt-sort-icon" />;
  return direction === "ascending" ? <FiChevronUp className="tt-sort-icon active" /> : <FiChevronDown className="tt-sort-icon active" />;
};

// --- Sub-component: Table Row ---
// Modified to accept shortlist props and render the button in the Action column
const CandidateRow = memo(({ candidate, onShortlist, isShortlisted, activeJobId, activeJobColor }) => (
  <tr className="tt-row">
    <td className="tt-td">
      <input type="checkbox" className="row-checkbox" />
    </td>
    <td className="tt-td">
      <div className="tt-candidate-flex">
        <img src={candidate.avatar} alt="" className="tt-avatar" />
        <div className="tt-info-col">
          <span className="tt-name">{candidate.name}</span>
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
          <AvailabilityBadge key={avail} text={avail} />
        ))}
      </div>
    </td>
    <td className="tt-td action">
      {/* Replaced generic MoreVertical with functional Shortlist Button */}
      <button 
        className="tt-action-btn"
        onClick={() => onShortlist(candidate)}
        style={{
            border: `1px solid ${activeJobId ? activeJobColor : '#cbd5e1'}`,
            backgroundColor: isShortlisted ? activeJobColor : 'white',
            color: isShortlisted ? 'white' : (activeJobId ? activeJobColor : '#64748b'),
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600',
            width: '100%'
        }}
      >
        {isShortlisted ? 'Selected' : 'Shortlist'}
      </button>
    </td>
  </tr>
));

// --- Main Component ---
const TalentTableView = ({ candidates, onShortlist, activeJobId, activeJobColor, shortlistedMap }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });

  // Universal Sorting Logic
  const sortedCandidates = useMemo(() => {
    let sortableItems = [...candidates];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key] ?? "";
        let bValue = b[sortConfig.key] ?? "";

        if (Array.isArray(aValue)) {
          aValue = aValue.join(", ").toLowerCase();
          bValue = bValue.join(", ").toLowerCase();
        } else if (typeof aValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [candidates, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") direction = "descending";
    setSortConfig({ key, direction });
  };

  return (
    <div className="tt-wrapper">
      <table className="tt-table">
        <thead>
          <tr className="tt-thead-tr">
            <th className="tt-th" style={{ width: "40px" }}></th>
            <th className="tt-th sortable" onClick={() => requestSort("name")}>
              <div className="tt-th-content">Candidate <SortIcon active={sortConfig.key === "name"} direction={sortConfig.direction} /></div>
            </th>
            <th className="tt-th sortable" onClick={() => requestSort("role")}>
              <div className="tt-th-content">Role & Experience <SortIcon active={sortConfig.key === "role"} direction={sortConfig.direction} /></div>
            </th>
            <th className="tt-th sortable" onClick={() => requestSort("skills")}>
              <div className="tt-th-content">Skills <SortIcon active={sortConfig.key === "skills"} direction={sortConfig.direction} /></div>
            </th>
            <th className="tt-th sortable" onClick={() => requestSort("location")}>
              <div className="tt-th-content">Location <SortIcon active={sortConfig.key === "location"} direction={sortConfig.direction} /></div>
            </th>
            <th className="tt-th sortable" onClick={() => requestSort("availability")}>
              <div className="tt-th-content">Availability <SortIcon active={sortConfig.key === "availability"} direction={sortConfig.direction} /></div>
            </th>
            <th className="tt-th" style={{ textAlign: "right" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedCandidates.map((c) => {
            const isShortlisted = activeJobId && shortlistedMap[activeJobId]?.find(item => item.id === c.id);
            return (
                <CandidateRow 
                    key={c.id} 
                    candidate={c} 
                    onShortlist={onShortlist}
                    isShortlisted={isShortlisted}
                    activeJobId={activeJobId}
                    activeJobColor={activeJobColor}
                />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TalentTableView;
