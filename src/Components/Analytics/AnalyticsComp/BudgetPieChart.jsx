import React, { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const COLOR_PALETTE = [
  "#2563eb", // Blue
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#f97316", // Orange
  "#6366f1", // Indigo
  "#64748b", // Slate
];

export default function BudgetPieChart({ jobRoleChart = [], isLoading }) {
  const processedData = useMemo(() => {
    if (!jobRoleChart || jobRoleChart.length === 0) return { labels: [], data: [] };

    const sorted = [...jobRoleChart].sort((a, b) => b.totalJobs - a.totalJobs);

    if (sorted.length <= 6) {
      return {
        labels: sorted.map((item) => (item.role ? item.role.trim() : "Unknown")),
        data: sorted.map((item) => item.totalJobs),
      };
    }

    const top = sorted.slice(0, 5);
    const othersTotal = sorted.slice(5).reduce((sum, item) => sum + (item.totalJobs || 0), 0);

    const labels = top.map((item) => (item.role ? item.role.trim() : "Unknown"));
    const data = top.map((item) => item.totalJobs);

    if (othersTotal > 0) {
      labels.push("Others");
      data.push(othersTotal);
    }

    return { labels, data };
  }, [jobRoleChart]);

  if (isLoading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted gap-2">
        <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
        <span className="small">Loading role distribution...</span>
      </div>
    );
  }

  if (!jobRoleChart || jobRoleChart.length === 0) {
    return (
      <div className="d-flex align-items-center justify-content-center h-100 text-muted small">
        No job role data available
      </div>
    );
  }

  const chartData = {
    labels: processedData.labels,
    datasets: [
      {
        data: processedData.data,
        backgroundColor: COLOR_PALETTE.slice(0, processedData.labels.length),
        borderWidth: 2,
        borderColor: "#ffffff",
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          boxHeight: 8,
          padding: 12,
          font: { size: 11, weight: 500 },
          color: "#475569",
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return ` ${label}: ${value} ${value === 1 ? 'Job' : 'Jobs'} (${percentage}%)`;
          },
        },
      },
    },
  };

  return <Doughnut data={chartData} options={options} />;
}
