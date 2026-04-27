import React, { useState } from "react";
import { FiDownload, FiCalendar, FiTrendingUp, FiUsers, FiClock, FiDollarSign, FiFilter } from "react-icons/fi";
import "./Analytics.css";
import StatCard from "./AnalyticsComp/StatCard";
import HiringLineChart from "./AnalyticsComp/HiringLineChart";
import BudgetPieChart from "./AnalyticsComp/BudgetPieChart";
import MonthlyBarChart from "./AnalyticsComp/MonthlyBarChart";
import DepartmentTable from "./AnalyticsComp/DepartmentTable";

export default function Analytics() {
  const [timeframe, setTimeframe] = useState("Last 30 Days");

  return (
    <div className="admin-profile-container">
      {/* PAGE HEADER */}
      <div className="edit-header-box mb-4">
        <div className="edit-title-group">
          <h1>Analytics Dashboard</h1>
          <p>Real-time insights into your hiring pipeline and team performance</p>
        </div>
        <div className="d-flex gap-3 align-items-center">
          <div className="d-flex align-items-center gap-2 bg-white px-3 py-2 rounded-3 border" style={{ cursor: "pointer" }}>
            <FiCalendar className="text-primary" />
            <span className="small fw-semibold">{timeframe}</span>
          </div>
          <button className="action-btn-premium action-btn-secondary d-flex align-items-center gap-2 py-2 px-3">
            <FiDownload /> Export Reports
          </button>
        </div>
      </div>

      {/* TOP STATS SUMMARY */}
      <section className="mb-4">
        <StatCard />
      </section>

      {/* CHARTS GRID */}
      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="card-premium h-100 non-functional">
            <div className="coming-soon-badge">Coming Soon</div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="card-title-premium m-0"><FiTrendingUp /> Hiring Pipeline Trend</h3>
              <div className="d-flex gap-2">
                <span className="badge bg-light text-dark border">Candidates</span>
                <span className="badge bg-primary">Hires</span>
              </div>
            </div>
            <div className="analytics-chart-box-analytics" style={{ height: "320px" }}>
              <HiringLineChart />
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card-premium h-100 non-functional">
            <div className="coming-soon-badge">Coming Soon</div>
            <h3 className="card-title-premium mb-4"><FiUsers /> Source Distribution</h3>
            <div className="analytics-chart-box-analytics" style={{ height: "320px" }}>
              <BudgetPieChart />
            </div>
            <div className="mt-4">
              <div className="d-flex justify-content-between mb-2 small">
                <span>LinkedIn</span>
                <span className="fw-bold">45%</span>
              </div>
              <div className="progress mb-3" style={{ height: "6px" }}>
                <div className="progress-bar" style={{ width: "45%", backgroundColor: "#f5810c" }}></div>
              </div>
              <div className="d-flex justify-content-between mb-2 small">
                <span>Referrals</span>
                <span className="fw-bold">30%</span>
              </div>
              <div className="progress" style={{ height: "6px" }}>
                <div className="progress-bar" style={{ width: "30%", backgroundColor: "#fbbf24" }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="card-premium non-functional">
            <div className="coming-soon-badge">Coming Soon</div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="card-title-premium m-0"><FiDollarSign /> Monthly Spend by Department</h3>
              <div className="d-flex gap-2">
                <button className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"><FiFilter /> Filter</button>
              </div>
            </div>
            <div className="analytics-chart-box-analytics" style={{ height: "300px" }}>
              <MonthlyBarChart />
            </div>
          </div>
        </div>
      </div>

      {/* DETAILED TABLE */}
      <section className="card-premium non-functional">
        <div className="coming-soon-badge">Coming Soon</div>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="card-title-premium m-0">Department Performance Metrics</h3>
          <div className="text-muted small">Updated 2 hours ago</div>
        </div>
        <DepartmentTable />
      </section>

      <footer className="text-center text-muted small p-4 border-top">
        <p className="m-0">AI-Powered Insights • Powered by BenMyl Intelligence</p>
      </footer>
    </div>
  );
}

