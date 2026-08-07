import React, { useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function MonthlyBarChart({ benchUtilization = [], isLoading }) {
  const [limit, setLimit] = useState(6);

  const processedData = useMemo(() => {
    if (!benchUtilization || benchUtilization.length === 0)
      return { labels: [], totalCandidates: [], available: [], totalCount: 0 };

    const cleaned = benchUtilization.map((item) => ({
      role: item.role ? item.role.trim() : "Unknown",
      totalCandidates: item.totalCandidates || 0,
      available: item.available || 0,
    }));

    cleaned.sort((a, b) => b.totalCandidates - a.totalCandidates);

    const list = limit === "all" ? cleaned : cleaned.slice(0, limit);

    return {
      labels: list.map((item) => item.role),
      totalCandidates: list.map((item) => item.totalCandidates),
      available: list.map((item) => item.available),
      totalCount: cleaned.length,
    };
  }, [benchUtilization, limit]);

  if (isLoading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted gap-1">
        <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
        <span className="small">Loading bench utilization...</span>
      </div>
    );
  }

  if (!benchUtilization || benchUtilization.length === 0) {
    return (
      <div className="d-flex align-items-center justify-content-center h-100 text-muted small">
        No bench utilization data available
      </div>
    );
  }

  const data = {
    labels: processedData.labels,
    datasets: [
      {
        label: "Total Candidates",
        data: processedData.totalCandidates,
        backgroundColor: "#cbd5e1",
        hoverBackgroundColor: "#94a3b8",
        borderRadius: 4,
        barThickness: 10,
      },
      {
        label: "Available",
        data: processedData.available,
        backgroundColor: "#2563eb",
        hoverBackgroundColor: "#1d4ed8",
        borderRadius: 4,
        barThickness: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    plugins: {
      legend: {
        position: "top",
        align: "end",
        labels: {
          usePointStyle: true,
          boxWidth: 6,
          boxHeight: 6,
          font: { size: 11, weight: 600 },
          color: "#475569",
          padding: 8,
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        padding: 8,
        cornerRadius: 6,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || "";
            const value = context.parsed.x || 0;
            return ` ${label}: ${value} ${value === 1 ? 'Candidate' : 'Candidates'}`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: { color: "#f1f5f9" },
        ticks: { font: { size: 10 }, color: "#64748b" },
      },
      y: {
        grid: { display: false },
        ticks: { font: { size: 11, weight: 500 }, color: "#334155" },
      },
    },
  };

  return (
    <div className="w-100 h-100 d-flex flex-column">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <span className="text-muted" style={{ fontSize: "11px" }}>
          Showing {limit === "all" ? processedData.totalCount : Math.min(limit, processedData.totalCount)} of {processedData.totalCount} roles
        </span>
        <div className="d-flex gap-1">
          <button
            className={`btn btn-sm px-2 py-0 rounded-pill ${limit === 6 ? "btn-primary" : "btn-outline-secondary"}`}
            onClick={() => setLimit(6)}
            style={{ fontSize: "11px", fontWeight: 500 }}
          >
            Top 6
          </button>
          <button
            className={`btn btn-sm px-2 py-0 rounded-pill ${limit === 10 ? "btn-primary" : "btn-outline-secondary"}`}
            onClick={() => setLimit(10)}
            style={{ fontSize: "11px", fontWeight: 500 }}
          >
            Top 10
          </button>
          <button
            className={`btn btn-sm px-2 py-0 rounded-pill ${limit === "all" ? "btn-primary" : "btn-outline-secondary"}`}
            onClick={() => setLimit("all")}
            style={{ fontSize: "11px", fontWeight: 500 }}
          >
            All
          </button>
        </div>
      </div>
      <div
        className="flex-grow-1"
        style={{
          minHeight: limit === "all" ? `${processedData.labels.length * 24}px` : "160px",
          maxHeight: limit === "all" ? "320px" : "185px",
          overflowY: limit === "all" ? "auto" : "hidden",
        }}
      >
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
