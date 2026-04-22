import React from "react";
import ProjectTimeCard from "./ProjectTimeCard";
import { useNavigate } from "react-router-dom";
import "./Projects.css";

export default function ProjectsTimeline({ data }) {
  const navigate = useNavigate();

  if (!data || data.length === 0) {
    return (
      <div className="timeline-body">
        <p style={{ fontSize: "13px", color: "#94a3b8", textAlign: "center", padding: "20px" }}>
          No active timelines to track.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <div className="timeline-header">
        <h2 className="section-title">Projects Timeline</h2>
        <p className="section-subtitle">Real-time health of active roles</p>
      </div>

      <div className="timeline-body" style={{ marginTop: "16px" }}>
        <div className="timeline-rows">
          {data.map((item) => (
            <ProjectTimeCard
              key={item.id}
              item={item}
              onClick={() => navigate(`/user/project-details/${item.id}`, { state: { project: item.originalProject } })}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
