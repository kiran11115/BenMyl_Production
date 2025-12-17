import React, { useState, useMemo } from "react";
import { MoreVertical, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

const UploadTalentTable = ({ talents, selectedEmails, onToggleSelect }) => {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const getInitials = (name = "") =>
    name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const getAvatarColor = (name = "") => {
    const colors = ["#3b82f6", "#6366f1", "#8b5cf6", "#ec4899", "#f97316"];
    return colors[name.length % colors.length];
  };

  const sortedTalents = useMemo(() => {
    const items = [...talents];
    if (sortConfig.key) {
      items.sort((a, b) => {
        const A = a[sortConfig.key].toLowerCase();
        const B = b[sortConfig.key].toLowerCase();
        if (A < B) return sortConfig.direction === "ascending" ? -1 : 1;
        if (A > B) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return items;
  }, [talents, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey)
      return <ArrowUpDown size={14} className="sort-icon" />;
    return sortConfig.direction === "ascending" ? (
      <ArrowUp size={14} className="sort-active" />
    ) : (
      <ArrowDown size={14} className="sort-active" />
    );
  };

  return (
    <div className="upload-table-panel">
      <div className="table-scroll">
        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}></th>
              <th onClick={() => requestSort("name")}>
                Candidate <SortIcon columnKey="name" />
              </th>
              <th onClick={() => requestSort("role")}>
                Role <SortIcon columnKey="role" />
              </th>
              <th onClick={() => requestSort("status")}>
                Status <SortIcon columnKey="status" />
              </th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {sortedTalents.map((talent, i) => {
              const isSelected = selectedEmails.has(talent.email);
              return (
                <tr key={i} className={isSelected ? "row-selected" : ""}>
                  <td>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(talent.email)}
                    />
                  </td>

                  <td>
                    <div className="candidate-cell">
                      <div
                        className="avatar"
                        style={{ background: getAvatarColor(talent.name) }}
                      >
                        {getInitials(talent.name)}
                      </div>
                      <div>
                        <div className="candidate-name">{talent.name}</div>
                        <div className="candidate-email">{talent.email}</div>
                      </div>
                    </div>
                  </td>

                  <td>{talent.role}</td>

                  <td>
                    <span className={`status-tag ${talent.statusClass}`}>
                      {talent.status}
                    </span>
                  </td>

                  <td>
                    <button className="border-0 w-50 " style={{background: "none"}}>
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UploadTalentTable;
