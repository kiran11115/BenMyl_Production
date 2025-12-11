import React from "react";
import { Doughnut } from "react-chartjs-2";

const BudgetChart = ({ data, totalBudget, tooltipTheme }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        ...tooltipTheme,
        callbacks: {
          label: function (context) {
            const percentage = context.raw;
            const value = (totalBudget * percentage) / 100;
            const formattedValue = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              maximumSignificantDigits: 3,
            }).format(value);
            return ` ${context.label}: ${percentage}% (${formattedValue})`;
          },
        },
      },
    },
    cutout: "75%",
    animation: { animateScale: true, animateRotate: true },
  };

  return (
    <div className="project-card">
      <div className="card-header">
        <h3 className="card-title">Budget Allocation</h3>
      </div>
      <div style={{ height: "160px", marginTop: "16px", position: "relative", zIndex: 2 }}>
        <Doughnut data={data} options={options} />
        {/* Center Text Overlay */}
        <div className="doughnut-center-text">
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontSize: "10px", color: "#64748b", fontWeight: "500", textTransform: "uppercase" }}>
              Total
            </span>
            <span style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b" }}>
              ${(totalBudget / 1000).toFixed(0)}k
            </span>
          </div>
        </div>
      </div>

      <div className="legend-row" style={{ position: "relative", zIndex: 2 }}>
        <div className="legend-item">
          <span className="dot" style={{ background: "#3b82f6" }}></span>
          <span style={{ marginRight: "4px" }}>Recruit</span>
          <span style={{ fontWeight: "600", color: "#3b82f6" }}>45%</span>
        </div>
        <div className="legend-item">
          <span className="dot" style={{ background: "#10b981" }}></span>
          <span style={{ marginRight: "4px" }}>Train</span>
          <span style={{ fontWeight: "600", color: "#10b981" }}>30%</span>
        </div>
        <div className="legend-item">
          <span className="dot" style={{ background: "#f59e0b" }}></span>
          <span style={{ marginRight: "4px" }}>Ben.</span>
          <span style={{ fontWeight: "600", color: "#f59e0b" }}>25%</span>
        </div>
      </div>
    </div>
  );
};

export default BudgetChart;
