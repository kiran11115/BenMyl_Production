import React, { useState, useMemo } from "react";
import { FiEdit2, FiCheck, FiX, FiChevronUp, FiChevronDown, FiUserX, FiMail } from "react-icons/fi";
import { FaSort } from "react-icons/fa";

function TeamMembersTable({ teammembers = [], isLoading }) {
  const [editingRow, setEditingRow] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const getInitials = (username) => {
    if (!username) return "??";
    return username.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
  };

  const getAvatarColor = (username) => {
    const colors = ["#3b82f6", "#6366f1", "#8b5cf6", "#f5810c", "#10b981", "#ef4444"];
    const safe = username || "";
    let hash = 0;
    for (let i = 0; i < safe.length; i++) hash = safe.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  const visibleMembers = useMemo(() => {
    const members = Array.isArray(teammembers) ? teammembers : [];
    let sortableItems = [...members];

    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        const valA = (a[sortConfig.key] ?? "").toString().toLowerCase();
        const valB = (b[sortConfig.key] ?? "").toString().toLowerCase();
        if (valA < valB) return sortConfig.direction === "ascending" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }

    return sortableItems;
  }, [teammembers, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const SortIcon = ({ columnKey }) => {
    const isActive = sortConfig.key === columnKey;
    if (!isActive) return <FaSort className="tt-sort-icon" />;
    return sortConfig.direction === "ascending" ? (
      <FiChevronUp className="tt-sort-icon active" />
    ) : (
      <FiChevronDown className="tt-sort-icon active" />
    );
  };

  const handleDeactivate = (email) => {
    if (window.confirm(`Are you sure you want to deactivate ${email}?`)) {
      console.log("Deactivating user:", email);
    }
  };

  const handleEdit = (member) => {
    setEditingRow(member.email);
  };

  const handleSave = (member) => {
    console.log("Saving new role for:", member.email);
    setEditingRow(null);
  };

  const handleCancel = () => {
    setEditingRow(null);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem"
        }}
      >
        <h3 className="section-title m-0">Team members</h3>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <span style={{ fontSize: "12px", color: "#64748b" }}>
            Showing {visibleMembers.length} of {teammembers.length}
          </span>
        </div>
      </div>

      <div className="tt-wrapper" style={{ overflowY: "auto", maxHeight: "450px" }}>
        <table className="tt-table">
          <thead>
            <tr className="tt-thead-tr">
              <th className="tt-th" style={{ paddingLeft: "24px", width: "40px" }}></th>
              <th className="tt-th sortable" onClick={() => requestSort("username")}>
                <div className="tt-th-content">
                  Member Profile <SortIcon columnKey="username" />
                </div>
              </th>
              <th className="tt-th sortable" onClick={() => requestSort("role")}>
                <div className="tt-th-content">
                  Role <SortIcon columnKey="role" />
                </div>
              </th>
              <th className="tt-th sortable" onClick={() => requestSort("status")}>
                <div className="tt-th-content">
                  Status <SortIcon columnKey="status" />
                </div>
              </th>
              <th className="tt-th text-end" style={{ paddingRight: "24px" }}>
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {visibleMembers.length ? (
              visibleMembers.map((m, i) => {
                const isEditing = editingRow === m.email;
                return (
                  <tr key={m.email || i} className="tt-row">
                    <td className="tt-td" style={{ paddingLeft: "24px" }}>
                      <input type="checkbox" className="row-checkbox" />
                    </td>

                    <td className="tt-td">
                      <div className="tt-candidate-flex">
                        <div
                          className="tt-avatar-initials"
                          style={{
                            backgroundColor: getAvatarColor(m.username),
                          }}
                        >
                          {getInitials(m.username)}
                        </div>

                        <div className="tt-info-col">
                          <span className="tt-name">{m.username}</span>
                          <span className="tt-email">{m.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="tt-td">
                      <select 
                        className={`form-select form-select-sm border-0 ${isEditing ? 'bg-white border' : 'bg-transparent text-muted'} p-0`} 
                        defaultValue={m.role}
                        disabled={!isEditing}
                        style={{ 
                          fontSize: "14px", 
                          fontWeight: isEditing ? "600" : "400", 
                          color: isEditing ? "#1e293b" : "inherit",
                          width: "auto",
                          minWidth: "140px",
                          cursor: isEditing ? 'pointer' : 'default',
                          outline: "none"
                        }}
                      >
                        <option value="Admin">Administrator</option>
                        <option value="Recruiter">Hiring Manager</option>
                        <option value="Benchsales">Bench Sales</option>
                      </select>
                    </td>

                    <td className="tt-td">
                      <span className={`status-tag ${m.status === "Active" ? "status-green" : "status-orange"}`}>
                        {m.status}
                      </span>
                    </td>

                    <td className="tt-td text-end" style={{ paddingRight: "24px" }}>
                      <div className="d-flex gap-2 justify-content-end">
                        {isEditing ? (
                          <>
                            <button 
                              className="action-btn-premium p-0 d-flex align-items-center justify-content-center" 
                              style={{ width: "32px", height: "32px", borderRadius: "8px", color: "#10b981", background: "#f0fdf4", border: "1px solid #dcfce7" }}
                              onClick={() => handleSave(m)}
                            >
                              <FiCheck size={14} />
                            </button>
                            <button 
                              className="action-btn-premium p-0 d-flex align-items-center justify-content-center" 
                              style={{ width: "32px", height: "32px", borderRadius: "8px", color: "#64748b", background: "#f1f5f9", border: "1px solid #e2e8f0" }}
                              onClick={handleCancel}
                            >
                              <FiX size={14} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              className="action-btn-premium p-0 d-flex align-items-center justify-content-center" 
                              style={{ width: "32px", height: "32px", borderRadius: "8px", color: "#f5810c", background: "#fff7ed", border: "1px solid #ffedd5" }}
                              onClick={() => handleEdit(m)}
                            >
                              <FiEdit2 size={14} />
                            </button>
                            <a href={`mailto:${m.email}`} className="action-btn-premium p-0 d-flex align-items-center justify-content-center" style={{ width: "32px", height: "32px", borderRadius: "8px", color: "#3b82f6", background: "#eff6ff", border: "1px solid #dbeafe" }}>
                              <FiMail size={14} />
                            </a>
                            <button 
                              className="action-btn-premium p-0 d-flex align-items-center justify-content-center" 
                              style={{ width: "32px", height: "32px", borderRadius: "8px", color: "#ef4444", background: "#fef2f2", border: "1px solid #fee2e2" }}
                              onClick={() => handleDeactivate(m.email)}
                            >
                              <FiUserX size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-5">
                  {isLoading ? "Retrieving team data..." : "No team members joined yet."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default TeamMembersTable;
