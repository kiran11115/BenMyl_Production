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
     className="job-chip mint"
    >
      {text}
    </span>
  );
};

export default TalentAvailabilityBadge;
