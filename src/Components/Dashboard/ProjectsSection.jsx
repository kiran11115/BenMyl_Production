import React from "react";
import { MoreVertical, Clock, DollarSign, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UploadTalentModal from "../UploadTalent/UploadTalentModal";

const ProjectsSection = ({ projects, onUploadSuccess, onUploading }) => {
  const navigate = useNavigate();

  const getAvatarUrl = (name) => {
    const seed = name.replace(/[^a-zA-Z0-9]/g, "");
    return `https://i.pravatar.cc/150?u=${seed}`;
  };

  return (
    <>
      {/* Header Section */}
      <div className="projects-header-row mb-4">
        <div className="d-flex gap-3 align-items-center projects-title-wrap">
          <h3 className="section-title" style={{ margin: 0, fontSize: "1.25rem" }}>
            Ongoing Projects
          </h3>
          <button 
            className="border-0 p-0" 
            onClick={() => navigate("/user/user-projects")}
            style={{ 
              textDecoration: "none", 
              background: "none", 
              color: "#f5810c", 
              fontSize: "13px", 
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            Explore All <ExternalLink size={12} />
          </button>
        </div>

        <div className="d-flex align-items-center gap-2 projects-actions-wrap">
          <button
            className="btn-upload"
            onClick={() => navigate("/user/user-post-new-positions")}
          >
            + Create Job
          </button>
          
          <UploadTalentModal
            onSuccess={onUploadSuccess}
            onUploading={onUploading}
          />

          <button
            className="btn-upload"
            onClick={() => navigate("/user/user-upcoming-interview")}
            style={{ background: "#f8fafc", color: "#475569", border: "1px solid #e2e8f0" }}
          >
            Schedule Interview
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="projects-grid">
        {projects.map((project, index) => {
          const talentName = project.talent || project.company || "Unknown Contact";
          const avatarUrl = project.image || getAvatarUrl(talentName);

          return (
            <div key={index} className="project-card">
              <div className="card-header">
                <h3 className="card-title">{project.title}</h3>
                <button className="card-options-btn">
                  <MoreVertical size={16} />
                </button>
              </div>

              {/* Talent / Author Section */}
              <div className="card-author">
                <img
                  src={avatarUrl}
                  alt={talentName}
                  className="author-avatar"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${talentName}&background=f5810c&color=fff`;
                  }}
                />
                <span className="author-name">{talentName}</span>
              </div>

              <div className="progress-section">
                <div className="progress-labels">
                  <span style={{ fontWeight: "700", fontSize: "11px", textTransform: "uppercase", color: "#64748b" }}>Progress</span>
                  <span className="progress-text" style={{ color: "#f5810c", fontWeight: "800" }}>{project.progress}%</span>
                </div>
                <div className="progress-bg">
                  <div
                    className="progress-fill"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-end">
                <div className="card-details">
                  <div className="detail-item" style={{ background: "#f8fafc" }}>
                    <Clock size={12} className="text-slate-400" /> <span style={{ fontSize: "11px" }}>Due {project.dueDate}</span>
                  </div>
                  <div className="detail-item" style={{ background: "#f8fafc" }}>
                    <DollarSign size={12} className="text-slate-400" /> <span style={{ fontSize: "11px" }}>{project.budget}</span>
                  </div>
                </div>

                <div>
                  <span className={`status-tag ${project.statusClass}`}>
                    {project.status}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ProjectsSection;
