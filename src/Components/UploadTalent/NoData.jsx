import React from "react";

const NoData = ({
  text = "No data available",
  image = "/Images/no data.svg",
  maxWidth = "300px",
}) => {
  return (
    <div
      style={{
        color: "#94a3b8",
        fontSize: "14px",
        textAlign: "center",
        padding: "12px 0",
      }}
    >
      {text}
      <img
        src={image}
        alt="No data"
        style={{
          width: "100%",
          maxWidth,
          height: "auto",
          marginTop: "12px",
          objectFit: "contain",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
          opacity: "50%",
        }}
      />
    </div>
  );
};

export default NoData;
