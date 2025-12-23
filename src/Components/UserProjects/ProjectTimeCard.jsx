import React from "react";
import { Clock } from "lucide-react";

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

export default function ProjectTimeCard({ item }) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "16px",
        padding: "16px 18px",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.10)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
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

      <StatusRow label="Active" value={item.active} color="#22c55e" />
      <StatusRow label="Review" value={item.review} color="#f97316" />
      <StatusRow label="Done" value={item.done} color="#2563eb" />
    </div>
  );
}
