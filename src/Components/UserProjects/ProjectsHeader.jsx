import React from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiFilter } from "react-icons/fi";

export default function ProjectsHeader({ activeFilter, onFilterChange }) {
  const navigate = useNavigate();

  return (
    <div className="ongoing-header">
      <div>
        <h2 className="section-title">Ongoing Projects</h2>
        <p className="section-subtitle">
          Track progress and manage all active client engagements.
        </p>
      </div>

      <div className="ongoing-controls">
        {/* Filter */}
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <FiFilter
            size={13}
            style={{
              position: "absolute",
              left: "10px",
              color: "#94a3b8",
              pointerEvents: "none",
            }}
          />
          <select
            className="projects-filter-select"
            style={{ paddingLeft: "28px" }}
            value={activeFilter}
            onChange={(e) => onFilterChange(e.target.value)}
          >
            <option>All Projects</option>
            <option>In Progress</option>
            <option>Awaiting Review</option>
            <option>Completed</option>
          </select>
        </div>

          <button
          onClick={() => navigate("/user/user-post-new-positions")}
          className="btn-upload"
          style={{
            background: "#fefefe",
            border: "1px solid #e2e8f0",
            color: "#0f172a",
          }}
        >
          <FiPlus size={14} />
          Create Job
        </button>

        <button
          onClick={() => navigate("/user/create-project")}
          className="btn-upload"
        >
          <FiPlus size={14} />
          New Project
        </button>
      
      </div>
    </div>
  );
}
