import React from "react";
import { AlertCircle } from "lucide-react";
import ProjectCard from "./ProjectCard";

export default function ProjectsGrid({ projects, onUpload, onReview }) {
  if (projects.length === 0) {
    return (
      <div className="jobs-grid">
        <div
          style={{
            gridColumn: "1 / -1",
            textAlign: "center",
            padding: "40px",
            color: "#64748b",
          }}
        >
          <AlertCircle
            size={48}
            style={{ margin: "0 auto 16px", opacity: 0.5 }}
          />
          <p>No projects found in this category.</p>
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
