import React from "react";

const TalentAvailabilityBadge = ({ text }) => {
  let style = { bg: "#f0fdf4", text: "#22c55e" };

  if (text.includes("Available Now")) {
    style = { bg: "#dcfce7", text: "#22c55e" };
  } else if (text.includes("Remote")) {
    style = { bg: "#dbeafe", text: "#1e40af" };
  } else if (text.includes("Notice") || text.includes("Part-time")) {
    style = { bg: "#ffedd5", text: "#9a3412" };
  } else if (text.includes("Entry")) {
    style = { bg: "#fce7f3", text: "#be185d" };
  }

  return (
    <span
      style={{
        backgroundColor: style.bg,
        color: style.text,
       display: "inline-block",
      padding: "4px 10px",
      borderRadius: "6px",
      fontSize: "11px",
      fontWeight: "600",
      whiteSpace: "normal",
      textTransform:"uppercase",
      width:"fit-content"
      }}
    >
      {text}
    </span>
  );
};

export default TalentAvailabilityBadge;
