import React from "react";
import { MoreVertical, Clock, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MdOutlineCloudUpload } from "react-icons/md";

const ProjectsSection = ({ projects }) => {
  const navigate = useNavigate();

  // Helper to generate a consistent random avatar based on the name
  const getAvatarUrl = (name) => {
    // Remove spaces and special chars to create a clean seed
    const seed = name.replace(/[^a-zA-Z0-9]/g, "");
    return `https://i.pravatar.cc/150?u=${seed}`;
  };

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

        <div className="d-flex align-items-center gap-2">
          {/* <button
            className="btn-upload"
            onClick={() => navigate("/user/user-upload-talent")}
          >
           <MdOutlineCloudUpload size={16} /> Upload Talent
          </button> */}
          <button
            className="btn-upload"
            onClick={() => navigate("/user/user-post-new-positions")}
          >
            + Create Job
          </button>
          <button
            className="btn-upload"
            onClick={() => navigate("/user/user-find-vendor")}
          >
            Find Vendors
          </button>
          <button
            className="btn-upload"
            onClick={() => navigate("/user/user-upcoming-interview")}
          >
            Schedule Interviews
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="projects-grid">
        {projects.map((project, index) => {
          // Use 'talent' or 'company' field from your data as the name
          const talentName = project.talent || project.company || "Unknown Talent";
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
                  // Add a small error handler to fallback if image fails
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${talentName}&background=random`;
                  }}
                />
                <span className="author-name">{talentName}</span>
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
          );
        })}
      </div>
    </>
  );
};

export default ProjectsSection;
