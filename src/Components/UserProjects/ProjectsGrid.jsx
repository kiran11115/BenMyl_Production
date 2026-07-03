import React from "react";
import ProjectCard from "./ProjectCard";
import NoData from "../UploadTalent/NoData";

export default function ProjectsGrid({ projects, onUpload, onReview }) {
  if (!projects || projects.length === 0) {
    return (
      <div className="projects-grid">
        <div
          style={{
            gridColumn: "1 / -1",
            padding: "40px 24px",
          }}
        >
          <NoData text="No projects found in this category." />
        </div>
      </div>
    );
  }

  return (
    <div className="projects-grid">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onUpload={onUpload}
          onReview={onReview}
        />
      ))}
    </div>
  );
}
