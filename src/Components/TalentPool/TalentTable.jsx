import React, { memo, useState, useMemo } from "react";
import {
  FiBriefcase,
  FiMapPin,
  FiChevronUp,
  FiChevronDown,
  FiEye,
  FiLoader,
} from "react-icons/fi";
import { GiCheckMark } from "react-icons/gi";
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
  ({ candidate, onShortlist, onProfileClick, isShortlisted, activeJobId, activeJobColor, loadingShortlistId, index = 0 }) => {
    const colors = ["#f5810c", "#3b82f6", "#10b981", "#8b5cf6", "#ec4899", "#f59e0b", "#06b6d4"];
    const avatarBgColor = colors[index % colors.length];

    const experienceText = candidate.experience 
      ? `${candidate.experience}${typeof candidate.experience === 'number' || (!isNaN(candidate.experience) && String(candidate.experience).trim() !== '') ? (String(candidate.experience).toLowerCase().includes('yr') || String(candidate.experience).toLowerCase().includes('exp') ? '' : ' Yrs Exp') : ''}` 
      : "N/A";

    const educationText = candidate.education || candidate.highestQualification || candidate.degree || "Bachelor's Degree";

    return (
      <tr className="tt-row">
        <td className="tt-td">
          <input type="checkbox" />
        </td>
        <td className="tt-td">
          <div className="tt-candidate-flex" style={{ alignItems: "center" }}>
            <div 
              className="talent-avatar-border-circle"
              style={{ background: "transparent", flexShrink: 0 }}
            >
              {candidate.avatar ? (
                <img
                  src={candidate.avatar}
                  alt={candidate.role || "Talent"}
                  className="profile-avatar"
                  style={{ width: '38px', height: '38px' }}
                />
              ) : (
                <div 
                  className="profile-avatar initials"
                  style={{
                    width: '34px',
                    height: '34px',
                    fontSize: '11px',
                    backgroundColor: "#1e293b",
                    color: "#ffffff",
                    border: "1px solid #1e293b"
                  }}
                >
                  {getInitials(candidate.name)}
                </div>
              )}
              <div className="avatar-verified-badge" title="Verified Candidate">
                <GiCheckMark size={8} color="#ffffff" />
              </div>
            </div>
            <div className="tt-info-col">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="tt-name">{candidate.role || candidate.title || "Talent Role"}</span>
                {candidate.rating !== undefined && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                    <span style={{ fontSize: '11px', color: '#f59e0b' }}>★</span>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#475569' }}>
                      {(candidate.rating || 4.5).toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </td>
        <td className="tt-td">
          <div className="tt-role-flex">
            <span className="tt-exp">
              <FiBriefcase size={12} color="#f5810c" /> {experienceText}
            </span>
            <span className="tt-exp" style={{ color: "#64748b" }}>
              Edu: {educationText}
            </span>
          </div>
        </td>
        <td className="tt-td">
          <div className="tt-skills-flex">
            {candidate.skills && candidate.skills.length > 0 ? (
              <>
                {candidate.skills.slice(0, 3).map((skill) => (
                  <span key={skill} className="job-chip">
                    {skill}
                  </span>
                ))}
                {candidate.skills.length > 3 && (
                  <span className="job-chip more">
                    +{candidate.skills.length - 3}
                  </span>
                )}
              </>
            ) : (
              <span style={{ color: '#94a3b8', fontSize: '12px' }}>N/A</span>
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
            {candidate.availability && candidate.availability.length > 0 ? (
              candidate.availability.map((avail) => (
                <AvailabilityBadge key={avail} text={avail} />
              ))
            ) : (
              <span className="job-chip mint">
                {candidate.status || (candidate.verified ? 'Verified' : 'Pending')}
              </span>
            )}
          </div>
        </td>
        <td className="tt-td action">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <button
              className="btn-v2-primary"
              onClick={() => onShortlist(candidate)}
              disabled={loadingShortlistId === candidate.id}
              style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '6px' }}
            >
              {loadingShortlistId === candidate.id ? (
                <span className="d-flex align-items-center gap-1 justify-content-center">
                  <FiLoader size={12} className="spin-icon" /> Shortlisting
                </span>
              ) : isShortlisted ? "Selected" : "Shortlist"}
            </button>
            <button
              className="job-card-view-btn"
              onClick={() => onProfileClick(candidate)}
              style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '6px' }}
            >
              <FiEye size={14} /> View
            </button>
          </div>
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
     const visibleCandidates = candidates;

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
            <th className="tt-th sortable" onClick={() => requestSort("role")}>
              <div className="tt-th-content">
                Role{" "}
                <SortIcon
                  active={sortConfig.key === "role"}
                  direction={sortConfig.direction}
                />
              </div>
            </th>
            <th className="tt-th sortable" onClick={() => requestSort("experience")}>
              <div className="tt-th-content">
                Experience & Education{" "}
                <SortIcon
                  active={sortConfig.key === "experience"}
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
          {filteredAndSortedCandidates.map((c, index) => {
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
                index={index}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TalentTableView;
