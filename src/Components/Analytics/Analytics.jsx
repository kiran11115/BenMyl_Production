import React from "react";
import "./Analytics.css";
import StatCard from "./AnalyticsComp/StatCard";
import HiringLineChart from "./AnalyticsComp/HiringLineChart";
import BudgetPieChart from "./AnalyticsComp/BudgetPieChart";
import MonthlyBarChart from "./AnalyticsComp/MonthlyBarChart";
import DepartmentTable from "./AnalyticsComp/DepartmentTable";

const Analytics = () => {
    return (
        <div className="analytics">
            {/* TOP STATS */}
          
                <StatCard/>
           

            {/* CHARTS */}
            <div className="card full-width">
                <h4>Hiring Pipeline</h4>
                <HiringLineChart />
            </div>

            <div className="chart-grid">
                <div className="card">
                    <h4>Budget Distribution</h4>
                    <div className="chart-box">
                        <BudgetPieChart />
                    </div>
                </div>

                <div className="card">
                    <h4>Monthly Spend by Department</h4>
                    <div className="chart-box">
                        <MonthlyBarChart />
                    </div>
                </div>
            </div>

            {/* TABLE */}
            <div className="card full-width">
                <h4>Department Metrics</h4>
                <DepartmentTable />
            </div>
        </div>
    );
};

export default Analytics;
