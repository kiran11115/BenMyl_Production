import React from "react";
import { Calendar } from "lucide-react";

const InterviewsList = ({ interviews }) => {
  return (
    <div className="project-card">
      <div className="card-header">
        <h3 className="card-title">Interviews</h3>
        <span style={{ fontSize: "12px", color: "#3b82f6", cursor: "pointer" }}>
          View All
        </span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          marginTop: "16px",
          position: "relative",
          zIndex: 2,
        }}
      >
        {interviews.map((int, i) => (
          <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <div
              style={{
                background: "#eff6ff",
                padding: "8px",
                borderRadius: "8px",
                color: "#3b82f6",
              }}
            >
              <Calendar size={18} />
            </div>
            <div>
              <div className="card-title" style={{ fontSize: "13px" }}>
                {int.name}
              </div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>
                {int.time} • {int.tag}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewsList;
