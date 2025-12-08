import React from "react";
import "./Dashboard.css";

import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

// ---------- DATA (for .map()) ----------

const kpiCards = [
  { label: "Active Job Posts", value: "24", change: "+8%" },
  { label: "Total Applications", value: "156", change: "+15%" },
  { label: "Ongoing Contracts", value: "18", change: "+12%" },
  { label: "Total Spend", value: "$125K", change: "+18%" },
];

const quickActions = [
  { label: "+ Post New Job", primary: true },
  { label: "Find Vendors" },
  { label: "Schedule interviews" },
  { label: "Review Contracts" },
];

const recentApplications = [
  {
    initials: "SJ",
    avatarClass: "avatar-red",
    name: "Sarah Johnson",
    company: "Tech Solutions Inc.",
    position: "Senior Developer",
    status: "Shortlisted",
    statusClass: "badge-green",
  },
  {
    initials: "MC",
    avatarClass: "avatar-blue",
    name: "Michael Chen",
    company: "Digital Dynamics",
    position: "Project Manager",
    status: "In Review",
    statusClass: "badge-yellow",
  },
  {
    initials: "ED",
    avatarClass: "avatar-purple",
    name: "Emily Davis",
    company: "Cloud Systems LLC",
    position: "DevOps Engineer",
    status: "Interviewing",
    statusClass: "badge-blue",
  },
];

const projects = [
  {
    title: "Cloud Migration Project",
    company: "Tech Solutions Inc.",
    status: "On Track",
    statusClass: "badge-green",
    progress: 75,
    budget: "$45,000",
  },
  {
    title: "Mobile App Development",
    company: "Digital Dynamics",
    status: "In Progress",
    statusClass: "badge-yellow",
    progress: 40,
    budget: "$85,000",
  },
];

const interviews = [
  {
    name: "Sarah Johnson",
    role: "Senior Developer",
    time: "10:00 AM",
    tag: "Technical",
  },
  {
    name: "Michael Chen",
    role: "Project Manager",
    time: "2:00 PM",
    tag: "Final",
  },
];

const budgetLegend = [
  { label: "Recruitment", dotClass: "dot-blue" },
  { label: "Training", dotClass: "dot-green" },
  { label: "Benefits", dotClass: "dot-yellow" },
];

// ---------- CHART CONFIG ----------

const pipelineLineData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      data: [26, 35, 40, 32, 50, 60, 55],
      borderWidth: 2,
      tension: 0.45,
      fill: true,
      backgroundColor: "rgba(37, 99, 235, 0.08)",
      borderColor: "#2563eb",
      pointRadius: 0,
    },
  ],
};

const pipelineLineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { enabled: true } },
  scales: {
    x: { grid: { display: false }, ticks: { display: false } },
    y: { grid: { display: false }, ticks: { display: false } },
  },
};

const budgetDoughnutData = {
  labels: budgetLegend.map((b) => b.label),
  datasets: [
    {
      data: [45, 30, 25],
      backgroundColor: ["#2563eb", "#16a34a", "#f59e0b"],
      borderWidth: 0,
    },
  ],
};

const budgetDoughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { enabled: true } },
  cutout: "68%",
};

// ---------- COMPONENT ----------

const Dashboard = () => {
  return (
    <div className="dashboard">
      {/* KPI CARDS */}
      <div className="dashboard-top-cards">
        {kpiCards.map((item) => (
          <div key={item.label} className="kpi-card">
            <div className="kpi-label">{item.label}</div>
            <div className="kpi-value-row">
              <span className="kpi-value">{item.value}</span>
              <span className="kpi-change kpi-change-up">{item.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* QUICK ACTIONS */}
      <div className="quick-actions">
        {quickActions.map((btn) => (
          <button
            key={btn.label}
            className={btn.primary ? "btn-primary" : "btn-ghost"}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* MAIN */}
      <div className="dashboard-main">
        {/* LEFT SIDE */}
        <div className="dashboard-left">
          {/* Recent Applications */}
          <div className="card recent-applications">
            <div className="card-header">
              <h3>Recent Applications</h3>
            </div>

            <div className="table-header">
              <span>Candidate</span>
              <span>Position</span>
              <span>Status</span>
              <span>Action</span>
            </div>

            {recentApplications.map((app) => (
              <div key={app.name} className="table-row">
                <div className="candidate">
                  <div className={`avatar ${app.avatarClass}`}>
                    {app.initials}
                  </div>
                  <div>
                    <div className="candidate-name">{app.name}</div>
                    <div className="candidate-sub">{app.company}</div>
                  </div>
                </div>
                <div className="position">{app.position}</div>
                <div className="status">
                  <span className={`badge ${app.statusClass}`}>
                    {app.status}
                  </span>
                </div>
                <div className="action-dots">⋯</div>
              </div>
            ))}
          </div>

          {/* Ongoing Projects */}
          <div className="card ongoing-projects">
            <div className="card-header">
              <h3>Ongoing Projects</h3>
              <button className="link-btn">View All</button>
            </div>

            <div className="project-grid">
              {projects.map((project) => (
                <div key={project.title} className="project-card">
                  <div className="project-header-row">
                    <div>
                      <div className="project-title">{project.title}</div>
                      <div className="project-sub">{project.company}</div>
                    </div>
                    <span className={`badge ${project.statusClass}`}>
                      {project.status}
                    </span>
                  </div>

                  <div className="project-meta">
                    <span className="meta-label">Progress</span>
                    <span className="meta-value">{project.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className={`progress-fill ${
                        project.statusClass === "badge-yellow"
                          ? "progress-fill-yellow"
                          : "progress-fill-blue"
                      }`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>

                  <div className="project-footer">
                    <span className="meta-label">Budget</span>
                    <span className="meta-value">{project.budget}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="dashboard-right">
          {/* Upcoming Interviews */}
          <div className="card upcoming-interviews">
            <div className="card-header">
              <h3>Upcoming Interviews</h3>
            </div>

            {interviews.map((int) => (
              <div key={int.name} className="interview-row">
                <div className="interview-icon">📅</div>
                <div className="interview-info">
                  <div className="interview-name">{int.name}</div>
                  <div className="interview-role">{int.role}</div>
                  <div className="interview-meta">
                    <span>{int.time}</span>
                    <span className="interview-tag">{int.tag}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Analytics Summary */}
          <div className="card analytics-summary">
            <div className="card-header">
              <h3>Analytics Summary</h3>
            </div>

            <div className="analytics-section">
              <div className="analytics-title">Hiring Pipeline</div>
              <div className="chart-wrapper chart-wrapper-line">
                <Line data={pipelineLineData} options={pipelineLineOptions} />
              </div>
            </div>

            <div className="analytics-section">
              <div className="analytics-title">Budget Allocation</div>
              <div className="analytics-row">
                <div className="chart-wrapper chart-wrapper-donut">
                  <Doughnut
                    data={budgetDoughnutData}
                    options={budgetDoughnutOptions}
                  />
                </div>
                <div className="legend">
                  {budgetLegend.map((b) => (
                    <div key={b.label} className="legend-item">
                      <span className={`legend-dot ${b.dotClass}`} />
                      <span>{b.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
};

export default Dashboard;
