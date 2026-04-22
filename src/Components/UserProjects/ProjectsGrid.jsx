import React from "react";
import { FiFolder } from "react-icons/fi";
import ProjectCard from "./ProjectCard";

export default function ProjectsGrid({ projects, onUpload, onReview }) {
  if (!projects || projects.length === 0) {
    return (
      <div className="projects-grid">
        <div
          style={{
            gridColumn: "1 / -1",
            textAlign: "center",
            padding: "60px 24px",
            color: "#94a3b8",
          }}
        >
          <FiFolder
            size={48}
            style={{ marginBottom: "12px", opacity: 0.35, display: "block", margin: "0 auto 12px" }}
          />
          <p style={{ fontSize: "14px", fontWeight: 500, margin: 0 }}>
            No projects found in this category.
          </p>
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
