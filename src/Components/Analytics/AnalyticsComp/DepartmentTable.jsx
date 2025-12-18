import React, { useState, useMemo } from "react";
import { FiMoreVertical, FiChevronUp, FiChevronDown } from "react-icons/fi";
import { FaSort } from "react-icons/fa";

// Transformed data with named keys for easier access/sorting
const departmentData = [
  { department: "Engineering", open: 12, applications: 450, interviews: 85, offers: 15, budget: "78%" },
  { department: "Sales", open: 8, applications: 320, interviews: 62, offers: 10, budget: "65%" },
  { department: "Marketing", open: 5, applications: 280, interviews: 45, offers: 7, budget: "72%" },
  { department: "HR", open: 3, applications: 180, interviews: 28, offers: 4, budget: "58%" },
  { department: "Finance", open: 4, applications: 220, interviews: 35, offers: 6, budget: "63%" },
];

export default function DepartmentTable() {
  // --- State ---
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [selectedDepts, setSelectedDepts] = useState(new Set());

  // --- Helpers ---
  const getInitials = (name) => {
    if (!name) return "";
    return name.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (name) => {
    const colors = ["#3b82f6", "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f97316"];
    return colors[name.length % colors.length];
  };

  // --- Sorting & Filtering Logic ---
  const visibleData = useMemo(() => {
    let sortableItems = [...departmentData];

    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];

        // Handle numeric sorting (remove % if present for budget)
        if (typeof valA === 'string' && valA.includes('%')) {
            valA = parseFloat(valA);
            valB = parseFloat(valB);
        }

        // Standard string/number comparison
        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [sortConfig]);

  // --- Selection Handler ---
  const handleSelectRow = (deptName) => {
    const newSelected = new Set(selectedDepts);
    if (newSelected.has(deptName)) {
      newSelected.delete(deptName);
    } else {
      newSelected.add(deptName);
    }
    setSelectedDepts(newSelected);
  };

  // --- Sorting Handler ---
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // --- Sort Icon Component ---
  const SortIcon = ({ columnKey }) => {
    const isActive = sortConfig.key === columnKey;
    const direction = sortConfig.direction;

    if (!isActive) {
      return <FaSort style={{ color: "#d1d5db" }} className="tt-sort-icon" />;
    }
    return direction === "ascending" ? (
      <FiChevronUp className="tt-sort-icon active" />
    ) : (
      <FiChevronDown className="tt-sort-icon active" />
    );
  };

  // Shared sortable header style
  const renderSortableHeader = (label, key) => (
    <th className="tt-th sortable" onClick={() => requestSort(key)}>
      <div className="tt-th-content">
        {label} <SortIcon columnKey={key} />
      </div>
    </th>
  );

  return (
    <>
      <div className="tt-wrapper">
        <table className="tt-table">
          <thead>
            <tr className="tt-thead-tr">
              <th className="tt-th" style={{ paddingLeft: "24px", width: "40px" }}></th>
              
              {renderSortableHeader("Department", "department")}
              {renderSortableHeader("Open", "open")}
              {renderSortableHeader("Applications", "applications")}
              {renderSortableHeader("Interviews", "interviews")}
              {renderSortableHeader("Offers", "offers")}
              {renderSortableHeader("Budget", "budget")}

              <th className="tt-th" style={{ textAlign: "center", paddingRight: "24px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {visibleData.map((row, i) => {
              const isSelected = selectedDepts.has(row.department);
              return (
                <tr 
                  key={i} 
                  className="tt-row"
                  style={{ 
                    backgroundColor: isSelected ? "rgb(241, 241, 241)" : undefined 
                  }}
                >
                  {/* Checkbox */}
                  <td className="tt-td" style={{ paddingLeft: "24px" }}>
                    {/* <input 
                      type="checkbox" 
                      className="row-checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectRow(row.department)}
                    /> */}
                  </td>

                  {/* Department Name & Avatar */}
                  <td className="tt-td">
                    <div className="tt-candidate-flex">
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "8px", // Slightly square for departments
                          backgroundColor: getAvatarColor(row.department),
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "13px",
                          fontWeight: "600",
                          flexShrink: 0,
                        }}
                      >
                        {getInitials(row.department)}
                      </div>
                      <div className="tt-info-col">
                        <span className="tt-name" style={{fontSize: "14px"}}>{row.department}</span>
                      </div>
                    </div>
                  </td>

                  {/* Numeric Columns */}
                  <td className="tt-td"><span className="tt-text-cell">{row.open}</span></td>
                  <td className="tt-td"><span className="tt-text-cell">{row.applications}</span></td>
                  <td className="tt-td"><span className="tt-text-cell">{row.interviews}</span></td>
                  <td className="tt-td"><span className="tt-text-cell">{row.offers}</span></td>
                  
                  {/* Budget with different color for emphasis */}
                  <td className="tt-td">
                    <span style={{ fontWeight: "600", color: "#059669" }}>{row.budget}</span>
                  </td>

                  {/* Action */}
                  <td className="tt-td action text-center" style={{ paddingRight: "24px" }}>
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
}
