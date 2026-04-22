import React from "react";
import { useNavigate } from "react-router-dom";
import {
  MoreVertical,
  Clock,
  DollarSign,
  UploadCloud,
  CheckCircle,
  MessageSquare,
  AlertTriangle,
  Zap,
} from "lucide-react";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumSignificantDigits: 3,
  }).format(amount);

const getStatusClass = (status) => {
  if (status === "Completed") return "status-completed";
  if (status === "Awaiting Review") return "status-review";
  return "status-progress";
};

const getHealthStatus = (project) => {
  const today = new Date();
  const deadline = new Date(project.dueDate);
  const diffDays = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

  if (project.status === "Completed")
    return { label: "Completed", color: "#10B981", icon: CheckCircle };
  if (diffDays < 0 && project.status !== "Completed")
    return { label: "Delayed", color: "#EF4444", icon: AlertTriangle };
  if (diffDays <= 7 && project.progress < 80)
    return { label: "At Risk", color: "#F59E0B", icon: Zap };
  return { label: "On Track", color: "#3B82F6", icon: Zap };
};

export default function ProjectCard({ project, onUpload, onReview }) {
  const navigate = useNavigate();
  const health = getHealthStatus(project);

  return (
    <div className="project-card">
      {/* ── Header: Title + Health dot + Options ── */}
      <div className="card-header">
        <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
          <h3
            className="card-title"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "165px",
            }}
            title={project.title}
          >
            {project.title}
          </h3>
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: health.color,
              flexShrink: 0,
              boxShadow: `0 0 6px ${health.color}88`,
            }}
            title={health.label}
          />
        </div>
        <button className="card-options-btn" aria-label="Options">
          <MoreVertical size={15} />
        </button>
      </div>

      {/* ── Author + Team avatars ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="card-author">
          <img
            src={project.avatar}
            alt={project.author}
            className="author-avatar"
          />
          <span className="author-name">{project.author}</span>
        </div>

        {/* Stacked team mini-avatars */}
        <div style={{ display: "flex", alignItems: "center" }}>
          {project.team?.slice(0, 3).map((member, idx) => (
            <img
              key={member.id}
              src={member.avatar}
              style={{
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                border: "2px solid white",
                objectFit: "cover",
                marginLeft: idx > 0 ? "-7px" : "0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
              alt={member.name}
              title={member.name}
            />
          ))}
          {project.team?.length > 3 && (
            <div
              style={{
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                background: "#f1f5f9",
                color: "#64748b",
                fontSize: "9px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid white",
                marginLeft: "-7px",
                fontWeight: 700,
              }}
            >
              +{project.team.length - 3}
            </div>
          )}
        </div>
      </div>

      {/* ── Progress Bar ── */}
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
              background:
                project.status === "Completed"
                  ? "linear-gradient(90deg,#10b981,#059669)"
                  : undefined,
            }}
          />
        </div>
      </div>

      {/* ── Meta row: due date + budget + status tag ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "8px" }}>
        <div className="card-details">
          <div className="detail-item">
            <Clock size={12} />
            Due {project.dueDate}
          </div>
          <div className="detail-item">
            <DollarSign size={12} />
            {formatCurrency(project.budget)}
          </div>
        </div>
        <span className={`status-tag ${getStatusClass(project.status)}`}>
          {project.status}
        </span>
      </div>

      {/* ── Action Buttons ── */}
      <div className="card-actions">
        {project.status === "In Progress" && (
          <button
            className="btn-upload"
            style={{ flex: 1 }}
            onClick={() => onUpload(project.id)}
          >
            <UploadCloud size={13} /> Upload Work
          </button>
        )}

        {project.status === "Awaiting Review" && (
          <button
            className="btn-upload"
            style={{
              flex: 1,
              background: "linear-gradient(135deg,#10b981,#059669)",
              boxShadow: "0 3px 8px -1px rgba(16,185,129,0.35)",
            }}
            onClick={() => onReview(project.id)}
          >
            <CheckCircle size={13} /> Mark Done
          </button>
        )}

        {project.status === "Completed" && (
          <button
            className="btn-review"
            disabled
            style={{ flex: 1, opacity: 0.55, cursor: "not-allowed" }}
          >
            <CheckCircle size={13} /> Completed
          </button>
        )}

        <button
          className="btn-review"
          style={{ flex: 1 }}
          onClick={() =>
            navigate(`/user/project-details/${project.id}`, {
              state: { project },
            })
          }
        >
          View Details
        </button>

        <button className="btn-chat" aria-label="Chat">
          <MessageSquare size={14} />
        </button>
      </div>
    </div>
  );
}
