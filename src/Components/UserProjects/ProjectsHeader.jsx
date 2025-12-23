import React from "react";

export default function ProjectsHeader({ activeFilter, onFilterChange }) {
  return (
    <div className="ongoing-header">
      <div>
        <h2 className="section-title">Ongoing Projects</h2>
        <p className="section-subtitle">
          Keep track of all active client projects and review their progress.
        </p>
      </div>

      <div className="ongoing-controls">
        <select
          className="projects-filter-select"
          value={activeFilter}
          onChange={(e) => onFilterChange(e.target.value)}
        >
          <option>All Projects</option>
          <option>In Progress</option>
          <option>Awaiting Review</option>
          <option>Completed</option>
        </select>

        <button className="add-project-btn">+ Add Project</button>
      </div>
    </div>
  );
}
