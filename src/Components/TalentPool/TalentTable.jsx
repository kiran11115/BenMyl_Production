import React, { memo, useState, useMemo } from "react";
import {
  FiBriefcase,
  FiMapPin,
  FiChevronUp,
  FiChevronDown,
  FiEye,
  FiLoader,
} from "react-icons/fi";
import { FaSort } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// --- Sub-component: Availability Badge ---
const AvailabilityBadge = ({ text }) => (
  <span
   className="job-chip mint"
  >
    {text}
  </span>
);

// --- Sub-component: Sort Icon Helper ---
const SortIcon = ({ active, direction }) => {
  if (!active) return <FaSort className="tt-sort-icon" />;
  return direction === "ascending" ? (
    <FiChevronUp className="tt-sort-icon active" />
  ) : (
    <FiChevronDown className="tt-sort-icon active" />
  );
};

// --- Helper: getInitials ---
const getInitials = (name = "") =>
  name.split(" ").filter(Boolean).slice(0, 2).map((n) => n[0].toUpperCase()).join("");

// --- Sub-component: Table Row ---
// Modified to accept shortlist props and render the button in the Action column
const CandidateRow = memo(
  ({ candidate, onShortlist, onProfileClick, isShortlisted, activeJobId, activeJobColor, loadingShortlistId }) => {
    const navigate = useNavigate();
    return (
      <tr className="tt-row">
        <td className="tt-td">
          <input type="checkbox" />
        </td>
        <td className="tt-td">
          <div className="tt-candidate-flex">
            {candidate.avatar ? (
              <img src={candidate.avatar} alt="" className="tt-avatar" />
            ) : (
              <div 
                className="profile-avatar initials"
              >
                {getInitials(candidate.name)}
              </div>
            )}
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
              <span key={skill} className="job-chip green">
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
        <td className="tt-td">
          <div className="tt-location">
            <FiMapPin size={12} color="#9ca3af" /> {candidate.location}
          </div>
        </td>
        <td className="tt-td">
          <div className="tt-role-flex">
            {candidate.availability.map((avail) => (
              <AvailabilityBadge key={avail} text={avail} />
            ))}
          </div>
        </td>
        <td className="d-flex gap-2">
          {/* Replaced generic MoreVertical with functional Shortlist Button */}
          <button
            className="btn-v2-primary"
            onClick={() => onShortlist(candidate)}
            disabled={loadingShortlistId === candidate.id}
          >
            {loadingShortlistId === candidate.id ? (
              <span className="d-flex align-items-center gap-1 justify-content-center">
                <FiLoader size={12} className="spin-icon" /> Shortlisting
              </span>
            ) : isShortlisted ? "Selected" : "Shortlist"}
          </button>
          <button
            className="tt-action-btn"
            onClick={() => onProfileClick(candidate)}
          >
            <FiEye size={16} />
          </button>
        </td>
      </tr>
    );
  },
);

// --- Main Component ---
const TalentTableView = ({
  candidates,
  onShortlist,
  activeJobId,
  activeJobColor,
  shortlistedMap,
  onProfileClick,
  hasMore,
  loadingShortlistId,
}) => {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  // Universal Sorting Logic
  const filteredAndSortedCandidates = useMemo(() => {
     const visibleCandidates = candidates.filter(
    (candidate) => candidate.isshortlisted === false
  );

  // 2️⃣ SORT FILTERED DATA
  let sortableItems = [...visibleCandidates];
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

        if (aValue < bValue)
          return sortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue)
          return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [candidates, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending")
      direction = "descending";
    setSortConfig({ key, direction });
  };

  return (
    <div className="tt-wrapper" style={{ overflowY: "auto", maxHeight: "600px" }}>
      <table className="tt-table">
        <thead>
          <tr className="tt-thead-tr">
            <th className="tt-th" style={{ width: "40px" }}></th>
            <th className="tt-th sortable" onClick={() => requestSort("name")}>
              <div className="tt-th-content">
                Candidate{" "}
                <SortIcon
                  active={sortConfig.key === "name"}
                  direction={sortConfig.direction}
                />
              </div>
            </th>
            <th className="tt-th sortable" onClick={() => requestSort("role")}>
              <div className="tt-th-content">
                Role & Experience{" "}
                <SortIcon
                  active={sortConfig.key === "role"}
                  direction={sortConfig.direction}
                />
              </div>
            </th>
            <th
              className="tt-th sortable"
              onClick={() => requestSort("skills")}
            >
              <div className="tt-th-content">
                Skills{" "}
                <SortIcon
                  active={sortConfig.key === "skills"}
                  direction={sortConfig.direction}
                />
              </div>
            </th>
            <th
              className="tt-th sortable"
              onClick={() => requestSort("location")}
            >
              <div className="tt-th-content">
                Location{" "}
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
                Availability{" "}
                <SortIcon
                  active={sortConfig.key === "availability"}
                  direction={sortConfig.direction}
                />
              </div>
            </th>
            <th className="tt-th">Action</th>
          </tr>
        </thead>
        <tbody>
          {!hasMore && filteredAndSortedCandidates.length === 0 && (
            <tr>
              <td
                colSpan={100}
                style={{
                  textAlign: "center",
                  padding: "16px",
                  color: "#94a3b8",
                  fontSize: "14px",
                }}
              >
                No more candidates to show
              </td>
            </tr>
          )}
          {filteredAndSortedCandidates.map((c) => {
            const isShortlisted =
              activeJobId &&
              shortlistedMap[activeJobId]?.find((item) => item.id === c.id);
            return (
              <CandidateRow
                key={c.id}
                candidate={c}
                onShortlist={onShortlist}
                onProfileClick={onProfileClick}
                isShortlisted={isShortlisted}
                activeJobId={activeJobId}
                activeJobColor={activeJobColor}
                loadingShortlistId={loadingShortlistId}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TalentTableView;
