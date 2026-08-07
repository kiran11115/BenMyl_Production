import React, { useState } from "react";
import { FiDownload, FiCalendar, FiTrendingUp, FiUsers, FiClock, FiDollarSign, FiFilter } from "react-icons/fi";
import "./Analytics.css";
import StatCard from "./AnalyticsComp/StatCard";
import HiringLineChart from "./AnalyticsComp/HiringLineChart";
import BudgetPieChart from "./AnalyticsComp/BudgetPieChart";
import MonthlyBarChart from "./AnalyticsComp/MonthlyBarChart";

export default function Analytics() {
  const [timeframe, setTimeframe] = useState("Last 30 Days");

  return (
    <div className="admin-profile-container">
      {/* PAGE HEADER */}
      <div className="hero-section-wrapper mb-4">
        <div className="hero-card ">
          <div className="hero-concentric-lines"></div>
          <div className="hero-ripple-pattern"></div>
          <div className="hero-circular-highlights"></div>
          <div className="hero-left">
            <div className="hero-pill">
              ✦ Intelligence
            </div>
            <h1 className="job-posting-title text-white">Analytics Dashboard</h1>
            <div className="job-posting-header-info">
              <p className="job-posting-subtitle">
                Real-time insights into your hiring pipeline and team performance
              </p>
            </div>
          </div>
          <div className="hero-card-actions-wrapper">
             <div className="d-flex align-items-center gap-2 bg-white px-3 py-2 rounded-3 border me-3" style={{ cursor: "pointer", color: "black" }}>
               <FiCalendar className="text-primary" />
               <span className="small fw-semibold">{timeframe}</span>
             </div>
             <button className="action-btn-premium action-btn-secondary d-flex align-items-center gap-2 py-2 px-3 bg-white border">
               <FiDownload /> Export
             </button>
          </div>
          <div className="hero-illustration">
            <div className="hero-particles">
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
            </div>
            <img src="/Images/Dashboard.png" alt="Dashboard Illustration" className="hero-svg-image" />
          </div>
        </div>
      </div>

      {/* TOP STATS SUMMARY */}
      <section className="mb-4">
        <StatCard />
      </section>

      {/* CHARTS GRID */}
      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="card-premium h-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="card-title-premium m-0"><FiTrendingUp /> Total Interviews Done</h3>
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
          <div className="card-premium h-100">
            <h3 className="card-title-premium mb-4"><FiUsers /> Jobs Posted by Roles</h3>
            <div className="analytics-chart-box-analytics" style={{ height: "320px" }}>
              <BudgetPieChart />
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="card-premium">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="card-title-premium m-0"><FiTrendingUp /> Total Bench Utilization</h3>
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


      <footer className="text-center text-muted small p-4 border-top">
        <p className="m-0">AI-Powered Insights • Powered by BenMyl Intelligence</p>
      </footer>
    </div>
  );
}

