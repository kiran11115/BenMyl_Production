import React from "react";
import { Line } from "react-chartjs-2";

const HiringPipelineChart = ({ data, tooltipTheme }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        ...tooltipTheme,
        callbacks: {
          label: (context) => ` ${context.parsed.y} Candidates`,
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: { display: false },
        ticks: { color: "#94a3b8", font: { size: 11 } },
      },
      y: {
        display: true,
        beginAtZero: true,
        border: { display: false },
        grid: { color: "#f1f5f9", borderDash: [5, 5] },
        ticks: { stepSize: 20, color: "#94a3b8", font: { size: 11 } },
      },
    },
  };

  return (
    <div className="project-card">
      <div className="card-header">
        <h3 className="card-title">Hiring Pipeline</h3>
      </div>
      <div style={{ height: "180px", marginTop: "16px", position: "relative", zIndex: 2 }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default HiringPipelineChart;
