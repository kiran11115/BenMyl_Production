import React, { useState, useMemo } from "react";
import { MoreVertical, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

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

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return <ArrowUpDown size={14} style={{ marginLeft: "6px", opacity: 0.3 }} />;
    return sortConfig.direction === 'ascending' 
      ? <ArrowUp size={14} style={{ marginLeft: "6px", color: "#3b82f6" }} />
      : <ArrowDown size={14} style={{ marginLeft: "6px", color: "#3b82f6" }} />;
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "32px" }}>
        <h3 className="section-title" style={{ margin: 0 }}>Recent Applications</h3>
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

      <div className="table-card" style={{ padding: "0", overflow: "hidden", marginTop: "16px" }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ paddingLeft: "24px", width: "40px" }}></th>
              
              <th onClick={() => requestSort('name')} style={{ cursor: "pointer", userSelect: "none" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  Candidate <SortIcon columnKey="name" />
                </div>
              </th>

              <th onClick={() => requestSort('role')} style={{ cursor: "pointer", userSelect: "none" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  Role <SortIcon columnKey="role" />
                </div>
              </th>

              <th onClick={() => requestSort('status')} style={{ cursor: "pointer", userSelect: "none" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  Status <SortIcon columnKey="status" />
                </div>
              </th>

              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {visibleApplications.map((app, i) => {
              const isSelected = selectedEmails.has(app.email);
              return (
                <tr 
                  key={i} 
                  // Updated background color here
                  style={{ backgroundColor: isSelected ? "rgb(241, 241, 241)" : "transparent" }}
                >
                  <td style={{ paddingLeft: "24px" }}>
                    <input 
                      type="checkbox" 
                      checked={isSelected}
                      onChange={() => handleSelectRow(app.email)}
                      style={{ 
                        cursor: "pointer", 
                        width: "14px", 
                        height: "14px",
                        accentColor: "#3b82f6"
                      }}
                    />
                  </td>

                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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

                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span className="author-name" style={{ color: "#1e293b", fontWeight: "600", fontSize: "14px", lineHeight: "1.2" }}>
                          {app.name}
                        </span>
                        <span style={{ color: "#64748b", fontSize: "12px", marginTop: "2px" }}>
                          {app.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: "13px", color: "#64748b" }}>{app.role}</td>
                  <td>
                    <span className={`status-tag ${app.statusClass}`}>
                      {app.status}
                    </span>
                  </td>
                  <td>
                    <button className="card-options-btn">
                      <MoreVertical size={16} />
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
