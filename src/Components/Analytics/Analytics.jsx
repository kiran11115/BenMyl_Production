import React, { useState } from "react";
import { FiDownload, FiCalendar, FiTrendingUp, FiUsers, FiFilter } from "react-icons/fi";
import "./Analytics.css";
import StatCard from "./AnalyticsComp/StatCard";
import HiringLineChart from "./AnalyticsComp/HiringLineChart";
import BudgetPieChart from "./AnalyticsComp/BudgetPieChart";
import MonthlyBarChart from "./AnalyticsComp/MonthlyBarChart";
import { useGetCardsAnalyticsQuery } from "../../State-Management/Api/DashboardApiSlice";

export default function Analytics() {
  const [timeframe, setTimeframe] = useState("Last 30 Days");
  const companyId = localStorage.getItem("logincompanyid") || localStorage.getItem("companyId");
  const { data, isLoading, error } = useGetCardsAnalyticsQuery(companyId);

  const cardsData = data?.cards;
  const interviewTrend = data?.interviewTrend || [];
  const jobRoleChart = data?.jobRoleChart || [];
  const benchUtilization = data?.benchUtilization || [];

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
        <StatCard cardsData={cardsData} isLoading={isLoading} />
      </section>

      {/* CHARTS GRID */}
      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="card-premium h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h3 className="card-title-premium m-0"><FiTrendingUp /> Monthly Interview & Hiring Trend</h3>
                <p className="text-muted small m-0 mt-1">Comparison of candidate interviews conducted vs successful hires</p>
              </div>
            </div>
            <div className="analytics-chart-box-analytics" style={{ height: "300px" }}>
              <HiringLineChart interviewTrend={interviewTrend} isLoading={isLoading} />
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card-premium h-100">
            <div className="mb-3">
              <h3 className="card-title-premium m-0"><FiUsers /> Job Postings by Role</h3>
              <p className="text-muted small m-0 mt-1">Role breakdown of all active job requisitions</p>
            </div>
            <div className="analytics-chart-box-analytics" style={{ height: "300px" }}>
              <BudgetPieChart jobRoleChart={jobRoleChart} isLoading={isLoading} />
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="card-premium">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h3 className="card-title-premium m-0"><FiTrendingUp /> Bench Talent Availability by Role</h3>
                <p className="text-muted small m-0 mt-1">Total registered bench candidates compared to currently available talent</p>
              </div>
            </div>
            <div className="analytics-chart-box-analytics" style={{ minHeight: "210px" }}>
              <MonthlyBarChart benchUtilization={benchUtilization} isLoading={isLoading} />
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

