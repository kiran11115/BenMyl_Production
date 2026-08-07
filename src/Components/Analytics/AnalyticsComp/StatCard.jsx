import React from "react";
import { Briefcase, Upload, FileText, Calendar } from "lucide-react";

const stats = [
  { label: "Total Posted Jobs", value: "2,847", change: "+6%", icon: Briefcase },
  { label: "Total Bench Uploads", value: "156", change: "+4%", icon: Upload },
  { label: "Total Contracts", value: "18", change: "-3%", icon: FileText },
  { label: "Total Interviews", value: "125", change: "+8%", icon: Calendar },
];

export default function StatCard() {
  return (
    <>
    <div className="analytics-stats-grid-analytics">
      {stats.map((s, i) => (
        <div className="analytics-stat-card-analytics" key={i}>
          <div className="d-flex flex-column gap-3">
            <div className="analytics-stat-icon-analytics">
              <s.icon size={18} />
            </div>
            <span className="analytics-stat-label-analytics">{s.label}</span>
          </div>

          <div className="d-flex flex-column gap-4" style={{alignItems: "end"}}>
            <span className="analytics-stat-value-analytics">{s.value}</span>
            <span className="analytics-stat-change-analytics">
              {s.change}
            </span>
          </div>
        </div>
      ))}
    </div>
    </>
  );
}
