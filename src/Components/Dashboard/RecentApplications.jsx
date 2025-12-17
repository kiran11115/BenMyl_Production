import React, { useState, useMemo } from "react";
// Imports matched to TalentTableView
import { FiMoreVertical, FiChevronUp, FiChevronDown } from "react-icons/fi";
import { FaSort } from "react-icons/fa";

const RecentApplications = ({ applications }) => {
  // --- State ---
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [selectedEmails, setSelectedEmails] = useState(new Set());

  // --- Helpers ---
  const getInitials = (name) => {
    if (!name) return "";
    const names = name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (name) => {
    const colors = ["#3b82f6", "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f97316"];
    return colors[name.length % colors.length];
  };

  // --- Sorting & Filtering Logic ---
  const visibleApplications = useMemo(() => {
    let sortableItems = [...applications];
    
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        const valA = a[sortConfig.key].toString().toLowerCase();
        const valB = b[sortConfig.key].toString().toLowerCase();
        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems.slice(0, 10);
  }, [applications, sortConfig]);

  // --- Selection Handler ---
  const handleSelectRow = (email) => {
    const newSelected = new Set(selectedEmails);
    if (newSelected.has(email)) {
      newSelected.delete(email);
    } else {
      newSelected.add(email);
    }
    setSelectedEmails(newSelected);
  };

  // --- Sorting Handler ---
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // --- Sort Icon Component (Exact Match) ---
  const SortIcon = ({ columnKey }) => {
    const isActive = sortConfig.key === columnKey;
    const direction = sortConfig.direction;

    // Matches the logic in TalentTableView exactly
    if (!isActive) {
      return <FaSort style={{color:"#fefefe"}} className="tt-sort-icon" />;
    }
    return direction === "ascending" ? (
      <FiChevronUp className="tt-sort-icon active" />
    ) : (
      <FiChevronDown className="tt-sort-icon active" />
    );
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "32px", marginBottom: "16px" }}>
        <h3 className="section-title" style={{ margin: 0, fontSize: "18px", fontWeight: "600", color: "#1e293b" }}>
          Recent Applications
        </h3>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
           {selectedEmails.size > 0 && (
            <span style={{ fontSize: "12px", color: "#3b82f6", fontWeight: "600", backgroundColor: "#eff6ff", padding: "4px 8px", borderRadius: "4px" }}>
              {selectedEmails.size} Selected
            </span>
          )}
          <span style={{ fontSize: "12px", color: "#64748b" }}>
            Showing {visibleApplications.length} of {applications.length}
          </span>
        </div>
      </div>

      <div className="tt-wrapper">
        <table className="tt-table">
          <thead>
            <tr className="tt-thead-tr">
              <th className="tt-th" style={{ paddingLeft: "24px", width: "40px" }}></th>
              
              <th className="tt-th sortable" onClick={() => requestSort('name')}>
                <div className="tt-th-content">
                  Candidate <SortIcon columnKey="name" />
                </div>
              </th>

              <th className="tt-th sortable" onClick={() => requestSort('role')}>
                <div className="tt-th-content">
                  Role <SortIcon columnKey="role" />
                </div>
              </th>

              <th className="tt-th sortable" onClick={() => requestSort('status')}>
                <div className="tt-th-content">
                  Status <SortIcon columnKey="status" />
                </div>
              </th>

              <th className="tt-th" style={{ textAlign: "right", paddingRight: "24px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {visibleApplications.map((app, i) => {
              const isSelected = selectedEmails.has(app.email);
              return (
                <tr 
                  key={i} 
                  className="tt-row"
                  style={{ 
                    backgroundColor: isSelected ? "rgb(241, 241, 241)" : undefined 
                  }}
                >
                  <td className="tt-td" style={{ paddingLeft: "24px" }}>
                    <input 
                      type="checkbox" 
                      className="row-checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectRow(app.email)}
                    />
                  </td>

                  <td className="tt-td">
                    <div className="tt-candidate-flex">
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          backgroundColor: getAvatarColor(app.name),
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "14px",
                          fontWeight: "600",
                          flexShrink: 0,
                        }}
                      >
                        {getInitials(app.name)}
                      </div>

                      <div className="tt-info-col">
                        <span className="tt-name">{app.name}</span>
                        <span className="tt-email">{app.email}</span>
                      </div>
                    </div>
                  </td>

                  <td className="tt-td">
                    <span className="tt-role">{app.role}</span>
                  </td>

                  <td className="tt-td">
                    <span className={`status-tag ${app.statusClass}`}>
                      {app.status}
                    </span>
                  </td>

                  <td className="tt-td action" style={{ paddingRight: "24px" }}>
                    <button className="tt-action-btn">
                      <FiMoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default RecentApplications;
