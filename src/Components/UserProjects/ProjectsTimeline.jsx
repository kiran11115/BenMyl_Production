import React from "react";
import { Clock } from "lucide-react";

export default function ProjectsTimeline({ data }) {
  return (
    <div className="mb-4">
      <div className="timeline-header">
        <h2 className="section-title">Projects Timeline</h2>
      </div>

      <div className="timeline-body">
        {/* cards wrapper – relies on existing .timeline-body spacing */}
        <div
          className="timeline-rows"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          {data.map((item) => (
            <div
              key={item.id}
              // individual card – look alike to provided image
             className="project-card"
            >
              {/* Top line: label + total time */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 4,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 12,
                    color: "#64748b",
                  }}
                >
                  <Clock size={16} />
                  <span>Total project time</span>
                </div>
                <span
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#0f172a",
                  }}
                >
                  {item.totalHours}
                </span>
              </div>

              {/* Optional project title under header */}
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#1e293b",
                  marginBottom: 6,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={item.title}
              >
                {item.title}
              </div>

              {/* Status rows */}
              <StatusRow label="Active" value={item.active} color="#22c55e" />
              <StatusRow label="Review" value={item.review} color="#f97316" />
              <StatusRow label="Done" value={item.done} color="#2563eb" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatusRow({ label, value, color }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 12,
          color: "#475569",
          marginBottom: 2,
        }}
      >
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      {/* use existing track + bar classes so no CSS changes */}
      <div className="timeline-bar-track">
        <div
          className="timeline-bar"
          style={{
            width: `${value}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}
