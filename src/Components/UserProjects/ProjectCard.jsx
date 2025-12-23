import React from "react";
import {
  MoreVertical,
  Clock,
  DollarSign,
  UploadCloud,
  CheckCircle,
  MessageSquare,
} from "lucide-react";

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

export default function ProjectCard({ project, onUpload, onReview }) {
  return (
    <div className="project-card">
      {/* Header */}
      <div className="card-header">
        <h3 className="card-title">{project.title}</h3>
        <button className="card-options-btn">
          <MoreVertical size={16} />
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

      {/* Details */}
      <div className="card-details">
        <div className="detail-item">
          <Clock size={14} /> Due {project.dueDate}
        </div>
        <div className="detail-item">
          <DollarSign size={14} /> Budget: {formatCurrency(project.budget)}
        </div>
      </div>

      {/* Status Tag */}
      <div>
        <span className={`status-tag ${getStatusClass(project.status)}`}>
          {project.status}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="card-actions">
        {project.status === "In Progress" && (
          <button
            className="btn-upload w-100"
            onClick={() => onUpload(project.id)}
          >
            <UploadCloud size={14} /> Upload Work
          </button>
        )}

        {project.status === "Awaiting Review" && (
          <button
            className="btn-review"
            onClick={() => onReview(project.id)}
            style={{
              backgroundColor: "#10B981",
              color: "white",
              borderColor: "#10B981",
            }}
          >
            <CheckCircle size={14} /> Mark Done
          </button>
        )}

        {project.status === "Completed" && (
          <button
            className="btn-review"
            disabled
            style={{ opacity: 0.6 }}
          >
            <CheckCircle size={14} /> Completed
          </button>
        )}

        <button className="btn-chat">
          <MessageSquare size={16} />
        </button>
      </div>
    </div>
  );
}
