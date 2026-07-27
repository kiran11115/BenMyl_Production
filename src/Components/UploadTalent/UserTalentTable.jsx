import React, { memo, useState, useMemo } from "react";
import {
  FiBriefcase,
  FiMapPin,
  FiUser,
  FiChevronUp,
  FiChevronDown,
  FiEye,
} from "react-icons/fi";
import { GiCheckMark } from "react-icons/gi";
import { FaSort } from "react-icons/fa";
import TalentAvailabilityBadge from "./TalentAvailabilityBadge";
import NoData from "./NoData"; // adjust path if needed
import { useNavigate } from "react-router-dom";
import UserMobileTalentCard from "./UserMobileTalentCard";

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
const CandidateRow = memo(({ candidate, isSelected, onToggle, index = 0 }) => {
  const navigate = useNavigate();
  const handleProfileClick = () => {
    const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
    navigate(`${basePath}/talent-profile`, {
      state: {
        employeeId: candidate.id,
        candidate: candidate,
      },
    });
  };

  const colors = ["#f5810c", "#3b82f6", "#10b981", "#8b5cf6", "#ec4899", "#f59e0b", "#06b6d4"];
  const avatarBgColor = colors[index % colors.length];

  const experienceText = candidate.experience 
    ? `${candidate.experience}${typeof candidate.experience === 'number' || (!isNaN(candidate.experience) && String(candidate.experience).trim() !== '') ? (String(candidate.experience).toLowerCase().includes('yr') || String(candidate.experience).toLowerCase().includes('exp') ? '' : ' Yrs Exp') : ''}` 
    : "N/A";

  const educationText = candidate.education || candidate.highestQualification || candidate.degree || candidate.educationDetail || "Bachelor's Degree";

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

      {/* Role Profile Avatar & Role Details */}
      <td className="tt-td">
        <div className="tt-candidate-flex" style={{ alignItems: "center" }}>
          <div 
            className="talent-avatar-border-circle"
            style={{ 
              "--percent": candidate.profileCompletionPercentage || 75,
              "--gradient-start": (candidate.profileCompletionPercentage || 75) < 40 ? "#fb923c" : (candidate.profileCompletionPercentage || 75) > 80 ? "#34d399" : "#60a5fa",
              "--gradient-mid": (candidate.profileCompletionPercentage || 75) < 40 ? "#f97316" : (candidate.profileCompletionPercentage || 75) > 80 ? "#10b981" : "#3b82f6",
              "--gradient-end": (candidate.profileCompletionPercentage || 75) < 40 ? "#ea580c" : (candidate.profileCompletionPercentage || 75) > 80 ? "#059669" : "#2563eb",
              flexShrink: 0
            }}
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
            {candidate.email && <span className="tt-email">{candidate.email}</span>}
          </div>
        </div>
      </td>

      {/* Experience & Education */}
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

      {/* Skills */}
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

      {/* First Name / Company */}
      <td className="tt-td">
        <div className="tt-location" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <FiUser size={13} color="#9ca3af" />
            <span>{candidate.firstName || candidate.name?.split(" ")[0] || "NA"}</span>
          </div>
          {candidate.company && candidate.company.toLowerCase() !== "benmyl" && (
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>
              {candidate.company}
            </span>
          )}
        </div>
      </td>

      {/* Availability / Status */}
      <td className="tt-td">
        <div className="tt-role-flex">
          {candidate.availability && candidate.availability.length > 0 ? (
            candidate.availability.map((avail) => (
              <TalentAvailabilityBadge key={avail} text={avail} />
            ))
          ) : (
            <span className="job-chip mint">
              {candidate.status || (candidate.verified ? 'Verified' : 'Pending')}
            </span>
          )}
        </div>
      </td>

      {/* Action */}
      <td className="tt-td action">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <button className="job-card-view-btn" onClick={handleProfileClick} style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '6px' }}>
            View
          </button>
          {!candidate.salary && (
            <button
              onClick={() => onToggle(candidate.id)}
              className={isSelected ? "btn-v2-primary shortlisted" : "btn-v2-primary"}
              style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '6px' }}
            >
              {isSelected ? "Selected" : "Select"}
            </button>
          )}
        </div>
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


  // ✅ PLACE IT HERE (IMMEDIATELY AFTER STATE)
  if (!candidates || candidates.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center w-100">
        <NoData text="No professional summary added yet" />
      </div>
    );
  }

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="tt-wrapper">
      {/* Mobile View */}
      <div className="mobile-talent-list d-md-none">
        {sortedCandidates.map((c, index) => (
          <UserMobileTalentCard
            key={c.id}
            candidate={c}
            isSelected={selectedIds.has(c.id)}
            onToggle={onToggleSelect}
            index={index}
          />
        ))}
      </div>

      {/* Desktop View */}
      <div className="d-none d-md-block" style={{ overflowY: "auto", maxHeight: "600px" }}>
        <table className="tt-table">
          <thead style={{ position: "sticky", top: 0, zIndex: 10, backgroundColor: "#fff" }}>
            <tr className="tt-thead-tr">
              <th className="tt-th" style={{ width: "40px" }}></th>

              <th className="tt-th sortable" onClick={() => requestSort("role")}>
                <div className="tt-th-content">
                  Role
                  <SortIcon
                    active={sortConfig.key === "role"}
                    direction={sortConfig.direction}
                  />
                </div>
              </th>

              <th className="tt-th sortable" onClick={() => requestSort("experience")}>
                <div className="tt-th-content">
                  Experience & Education
                  <SortIcon
                    active={sortConfig.key === "experience"}
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

              <th className="tt-th sortable" onClick={() => requestSort("firstName")}>
                <div className="tt-th-content">
                  First Name
                  <SortIcon
                    active={sortConfig.key === "firstName"}
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
            {sortedCandidates.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div
                    style={{
                      minHeight: "260px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <NoData text="No professional summary added yet" />
                  </div>
                </td>
              </tr>
            ) : (
              sortedCandidates.map((c, index) => (
                <CandidateRow
                  key={c.id}
                  candidate={c}
                  isSelected={selectedIds.has(c.id)}
                  onToggle={onToggleSelect}
                  index={index}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTalentTable;
