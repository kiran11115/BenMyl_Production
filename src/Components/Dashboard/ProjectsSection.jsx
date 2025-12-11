import React from "react";
import { MoreVertical, Clock, DollarSign } from "lucide-react";

const ProjectsSection = ({ projects }) => {
  return (
    <>
      {/* Header Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h3 className="section-title" style={{ margin: 0 }}>
          Ongoing Projects
        </h3>

        <div style={{ display: "flex", gap: "12px" }}>
          {["+ Post New Job", "Find Vendors", "Schedule Interviews"].map(
            (label, i) => (
              <button
                key={i}
                className="btn-upload"
                style={{ fontSize: "13px", padding: "8px 16px" }}
              >
                {label}
              </button>
            )
          )}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="projects-grid">
        {projects.map((project, index) => (
          <div key={index} className="project-card">
            <div className="card-header">
              <h3 className="card-title">{project.title}</h3>
              <button className="card-options-btn">
                <MoreVertical size={16} />
              </button>
            </div>

            <div className="card-author">
              <div
                className="author-avatar"
                style={{ backgroundColor: "#e2e8f0" }}
              />
              <span className="author-name">{project.company}</span>
            </div>

            <div className="progress-section">
              <div className="progress-labels">
                <span>Progress</span>
                <span className="progress-text">{project.progress}%</span>
              </div>
              <div className="progress-bg">
                <div
                  className="progress-fill"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="card-details">
              <div className="detail-item">
                <Clock size={14} /> Due {project.dueDate}
              </div>
              <div className="detail-item">
                <DollarSign size={14} /> Budget: {project.budget}
              </div>
            </div>

            <div>
              <span className={`status-tag ${project.statusClass}`}>
                {project.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProjectsSection;
