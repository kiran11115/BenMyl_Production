import React from "react";

export default function ContractCard({ title, value, percent }) {
  return (
    <div className="cm-card">
      <div className="cm-card-top">
        <div className="cm-card-title">{title}</div>
        <div className="cm-card-percent">{percent}</div>
      </div>
      <div className="cm-card-value">{value}</div>
    </div>
  );
}
