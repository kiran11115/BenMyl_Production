import React from "react";
import "./Analytics.css";

import StatCard from "./AnalyticsComp/StatCard";
import HiringLineChart from "./AnalyticsComp/HiringLineChart";
import BudgetPieChart from "./AnalyticsComp/BudgetPieChart";
import MonthlyBarChart from "./AnalyticsComp/MonthlyBarChart";
import DepartmentTable from "./AnalyticsComp/DepartmentTable";

export default function Analytics() {
  return (
    <div className="analytics-page-analytics">
      {/* TOP STATS */}
      <StatCard />

      {/* CHARTS */}
      <div className="analytics-charts-row-analytics">
        <div className="analytics-card-analytics">
          <h4 className="analytics-title-analytics">Hiring Pipeline</h4>
          <div className="analytics-chart-box-analytics">
            <HiringLineChart />
          </div>
        </div>

        <div className="analytics-card-analytics">
          <h4 className="analytics-title-analytics">Budget Distribution</h4>
          <div className="analytics-chart-box-analytics">
            <BudgetPieChart />
          </div>
        </div>

        <div className="analytics-card-analytics">
          <h4 className="analytics-title-analytics">
            Monthly Spend by Department
          </h4>
          <div className="analytics-chart-box-analytics">
            <MonthlyBarChart />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="analytics-card-analytics analytics-full-width-analytics">
        <h4 className="analytics-title-analytics">Department Metrics</h4>
        <DepartmentTable />
      </div>
    </div>
  );
}
