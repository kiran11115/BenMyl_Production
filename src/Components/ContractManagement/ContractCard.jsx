import React from "react";

export default function ContractCard({ title, value, percent }) {
  const isPositive = typeof percent === "string" && percent.startsWith("+");
  return (
    <div className="cm-card">
      <div className="cm-card-top">
        <div className="cm-card-title">{title}</div>
        <div
          className="cm-card-percent"
          style={{ color: isPositive ? "var(--accent-green)" : "var(--accent-red)" }}
        >
          {percent}
        </div>
      </div>
      <div className="cm-card-value">{value}</div>
    </div>
  );
}
