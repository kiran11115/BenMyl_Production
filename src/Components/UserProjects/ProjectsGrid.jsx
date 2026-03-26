import React from "react";
import NoData from "../UploadTalent/NoData";
import ProjectCard from "./ProjectCard";

export default function ProjectsGrid({ projects, onUpload, onReview }) {
  if (projects.length === 0) {
    return (
      <div className="jobs-grid">
        <div style={{ gridColumn: "1 / -1", width: "100%" }}>
          <NoData text="No projects found in this category." />
        </div>
      </div>
    );
  }

  return (
    <div className="jobs-grid">
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
