import React from "react";
import {
  FiMoreVertical,
  FiClock,
  FiDollarSign,
  FiEye,
} from "react-icons/fi";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumSignificantDigits: 3,
  }).format(amount);
};

const getStatusClass = (status) => {
  if (status === "Completed") return "status-completed";
  if (status === "Awaiting Review") return "status-review";
  return "status-progress";
};

export default function ProjectCard({ project, onViewProgress }) {
  return (
    <div className="project-card">
      {/* Header */}
      <div className="card-header">
        <h3 className="card-title">{project.title}</h3>
        <button className="card-options-btn">
          <FiMoreVertical size={16} />
        </button>
      </div>

      {/* Author */}
      <div className="card-author">
        <img
          src={project.avatar}
          alt={project.author}
          className="author-avatar"
        />
        <span className="author-name">{project.author}</span>
      </div>

      {/* Progress Bar */}
      <div className="progress-section">
        <div className="progress-labels">
          <span>Progress</span>
          <span className="progress-text">{project.progress}%</span>
        </div>
        <div className="progress-bg">
          <div
            className="progress-fill"
            style={{
              width: `${project.progress}%`,
              backgroundColor:
                project.status === "Completed" ? "#10B981" : "#3b82f6",
            }}
          ></div>
        </div>
      </div>

      <div className="d-flex justify-content-between">
        {/* Details */}
        <div className="card-details">
          <div className="detail-item">
            <FiClock size={14} /> Due {project.dueDate}
          </div>
          <div className="detail-item">
            <FiDollarSign size={14} /> Budget: {formatCurrency(project.budget)}
          </div>
        </div>

        {/* Status Tag */}
        <div>
          <span className={`status-tag ${getStatusClass(project.status)}`}>
            {project.status}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <div className="card-actions">
        <button
          className="btn-upload w-100"
          onClick={() => onViewProgress && onViewProgress(project)}
        >
          <FiEye size={14} /> View Progress
        </button>
      </div>
    </div>
  );
}
