import React from "react";

const TalentAvailabilityBadge = ({ text }) => {
  let style = { bg: "#f3f4f6", text: "#374151" }; // Default Gray

  if (text.includes("Available Now")) {
    style = { bg: "#dcfce7", text: "#166534" }; // Green
  } else if (text.includes("Remote")) {
    style = { bg: "#dbeafe", text: "#1e40af" }; // Blue
  } else if (text.includes("Notice") || text.includes("Part-time")) {
    style = { bg: "#ffedd5", text: "#9a3412" }; // Orange
  } else if (text.includes("Entry")) {
    style = { bg: "#fce7f3", text: "#be185d" }; // Pink
  }

  return (
    <span
      style={{
        backgroundColor: style.bg,
        color: style.text,
        padding: "4px 10px",
        borderRadius: "6px",
        fontSize: "11px",
        fontWeight: "600",
        whiteSpace: "nowrap",
        display: "inline-block",
        marginRight: "4px",
        marginBottom: "2px",
      }}
    >
      {text}
    </span>
  );
};

export default TalentAvailabilityBadge;
