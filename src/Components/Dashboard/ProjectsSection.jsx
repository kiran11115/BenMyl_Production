import React from "react";
import { ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CandidateCard } from "../UploadTalent/UserTalentGrid";

const ProjectsSection = ({ projects, onUploadSuccess, onUploading, role }) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Header Section */}
      <div className="projects-header-row mb-4">
        <div className="d-flex gap-3 align-items-center projects-title-wrap">
          <h3 className="section-title" style={{ margin: 0 }}>
            Ongoing Projects
          </h3>
          <button 
            className="border-0 p-0" 
            onClick={() => {
              const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
              const targetPath = window.location.pathname.toLowerCase().startsWith('/admin') ? `${basePath}/admin-posted-jobs` : `${basePath}/user-posted-jobs`;
              navigate(targetPath);
            }}
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
      </div>

      {/* Projects Grid */}
      <div className="projects-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        {projects.map((project, index) => {
          const mappedCandidate = {
            id: index,
            name: project.title,
            role: project.company,
            experience: project.dueDate,
            location: project.status,
            progress: project.progress,
            uploadedByName: project.approvedBy,
            verified: project.statusClass === "status-completed",
            avatar: project.image || `https://ui-avatars.com/api/?name=${project.title}&background=f5810c&color=fff`,
            rating: 5,
            skills: [],
            availability: []
          };

          return (
            <CandidateCard 
              key={index} 
              candidate={mappedCandidate} 
              isSelected={false} 
              onToggle={() => {}} 
              small={true}
            />
          );
        })}
      </div>
    </>
  );
};

export default ProjectsSection;
