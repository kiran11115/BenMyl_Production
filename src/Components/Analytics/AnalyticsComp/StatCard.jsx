import React from "react";
import { Briefcase, Upload, FileText, Calendar } from "lucide-react";

export default function StatCard({ cardsData, isLoading }) {
  const stats = [
    {
      label: "Total Posted Jobs",
      value: cardsData?.totalPostedJobs !== undefined ? cardsData.totalPostedJobs.toLocaleString() : (isLoading ? "..." : "0"),
      subtitle: "Active job requisitions",
      icon: Briefcase,
      iconBg: "#fff7ed",
      iconColor: "#f59e0b",
      borderColor: "#fde68a",
    },
    {
      label: "Total Bench Uploads",
      value: cardsData?.totalBenchUploads !== undefined ? cardsData.totalBenchUploads.toLocaleString() : (isLoading ? "..." : "0"),
      subtitle: "Bench candidates listed",
      icon: Upload,
      iconBg: "#eff6ff",
      iconColor: "#2563eb",
      borderColor: "#bfdbfe",
    },
    {
      label: "Total Contracts",
      value: cardsData?.totalContracts !== undefined ? cardsData.totalContracts.toLocaleString() : (isLoading ? "..." : "0"),
      subtitle: "Active client contracts",
      icon: FileText,
      iconBg: "#ecfdf5",
      iconColor: "#10b981",
      borderColor: "#a7f3d0",
    },
    {
      label: "Total Interviews",
      value: cardsData?.totalInterviews !== undefined ? cardsData.totalInterviews.toLocaleString() : (isLoading ? "..." : "0"),
      subtitle: "Total interviews conducted",
      icon: Calendar,
      iconBg: "#f5f3ff",
      iconColor: "#8b5cf6",
      borderColor: "#ddd6fe",
    },
  ];

  return (
    <div className="analytics-stats-grid-analytics">
      {stats.map((s, i) => (
        <div className="analytics-stat-card-analytics" key={i}>
          <div className="d-flex align-items-center gap-3">
            <div
              className="analytics-stat-icon-container"
              style={{ backgroundColor: s.iconBg, color: s.iconColor, border: `1px solid ${s.borderColor}` }}
            >
              <s.icon size={22} />
            </div>
            <div className="d-flex flex-column">
              <span className="analytics-stat-label-analytics">{s.label}</span>
              <span className="analytics-stat-value-analytics my-1">{s.value}</span>
              <span className="text-muted" style={{ fontSize: "11px" }}>{s.subtitle}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
