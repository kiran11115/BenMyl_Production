import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

export default function HiringLineChart({ interviewTrend = [], isLoading }) {
  if (isLoading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted gap-2">
        <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
        <span className="small">Loading interview trends...</span>
      </div>
    );
  }

  if (!interviewTrend || interviewTrend.length === 0) {
    return (
      <div className="d-flex align-items-center justify-content-center h-100 text-muted small">
        No interview trend data available
      </div>
    );
  }

  const labels = interviewTrend.map((item) => item.month);
  const candidatesData = interviewTrend.map((item) => item.candidates);
  const hiresData = interviewTrend.map((item) => item.hires);

  const data = {
    labels,
    datasets: [
      {
        label: "Candidates",
        data: candidatesData,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.08)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#2563eb",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Hires",
        data: hiresData,
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.08)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#10b981",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        align: "end",
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          boxHeight: 8,
          font: { size: 12, weight: 600 },
          padding: 16,
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleFont: { size: 13, weight: "bold" },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 12 }, color: "#64748b" },
      },
      y: {
        beginAtZero: true,
        grid: { color: "#f1f5f9" },
        ticks: { stepSize: 1, font: { size: 12 }, color: "#64748b" },
      },
    },
  };

  return <Line data={data} options={options} />;
}
