import React from "react";
import { Clock } from "lucide-react";
import "./Projects.css";

function StatusSegment({ label, value, colorClass }) {
  return (
    <div style={{ marginBottom: "8px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "11.5px",
          color: "#64748b",
          marginBottom: "3px",
          fontWeight: 500,
        }}
      >
        <span>{label}</span>
        <span style={{ fontWeight: 700, color: "#334155" }}>{value}%</span>
      </div>
      <div className="timeline-bar-track">
        <div
          className={`timeline-bar ${colorClass}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default function ProjectTimeCard({ item, onClick }) {
  // If item is missing props, handle gracefully
  const active = item.active ?? 0;
  const review = item.review ?? 0;
  const done = item.done ?? 0;

  return (
    <div className="timeline-card" onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "4px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "11px",
            color: "#94a3b8",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          <Clock size={14} />
          <span>Project Hours</span>
        </div>
        <span
          style={{
            fontSize: "18px",
            fontWeight: 800,
            color: "#0f172a",
          }}
        >
          {item.totalHours || "0h"}
        </span>
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: "13.5px",
          fontWeight: 700,
          color: "#1e293b",
          marginBottom: "6px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        title={item.title}
      >
        {item.title}
      </div>

      {/* Progress Segments */}
      <StatusSegment label="Active" value={active} colorClass="timeline-bar-orange" />
      <StatusSegment label="Review" value={review} colorClass="timeline-bar-amber" />
      <StatusSegment label="Done"   value={done}   colorClass="timeline-bar-green" />
    </div>
  );
}
