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
  Filler,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import {
  MoreVertical,
  Clock,
  DollarSign,
  TrendingUp,
  Briefcase,
  Users,
  FileText,
  Calendar,
} from "lucide-react";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

// --- Data ---
const kpiCards = [
  {
    label: "Active Job Posts",
    value: "24",
    change: "+8%",
    icon: Briefcase,
    colorClass: "blue",
    bubbleColor: "#3b82f6", 
  },
  {
    label: "Total Applications",
    value: "156",
    change: "+15%",
    icon: Users,
    colorClass: "indigo",
    bubbleColor: "#6366f1",
  },
  {
    label: "Ongoing Contracts",
    value: "18",
    change: "+12%",
    icon: FileText,
    colorClass: "amber",
    bubbleColor: "#f59e0b",
  },
  {
    label: "Total Spend",
    value: "$125K",
    change: "+18%",
    icon: DollarSign,
    colorClass: "emerald",
    bubbleColor: "#10b981",
  },
];

const projects = [
  {
    title: "Cloud Migration Project",
    company: "Tech Solutions Inc.",
    status: "On Track",
    statusClass: "status-completed",
    progress: 75,
    budget: "$45,000",
    dueDate: "Dec 20, 2023",
  },
  {
    title: "Mobile App Development",
    company: "Digital Dynamics",
    status: "In Progress",
    statusClass: "status-review",
    progress: 40,
    budget: "$85,000",
    dueDate: "Jan 15, 2024",
  },
  {
    title: "Cloud Infrastructure",
    company: "Nexus Systems",
    status: "Review",
    statusClass: "status-review",
    progress: 75,
    budget: "$120,000",
    dueDate: "Feb 28, 2024",
  },
  {
    title: "Cybersecurity Audit",
    company: "SecureNet Solutions",
    status: "Pending",
    statusClass: "status-pending",
    progress: 0,
    budget: "$45,000",
    dueDate: "Jan 10, 2024",
  },
];

const recentApplications = [
  {
    name: "Sarah Johnson",
    role: "Senior Dev",
    status: "Shortlisted",
    statusClass: "status-completed",
  },
  {
    name: "Michael Chen",
    role: "Project Mgr",
    status: "In Review",
    statusClass: "status-review",
  },
  {
    name: "Emily Davis",
    role: "DevOps Eng",
    status: "Interviewing",
    statusClass: "status-progress",
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

// --- Chart Config ---
const tooltipTheme = {
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  titleColor: "#1e293b",
  bodyColor: "#64748b",
  borderColor: "#e2e8f0",
  borderWidth: 1,
  padding: 10,
  cornerRadius: 8,
  displayColors: true,
  boxPadding: 4,
};

const pipelineLineData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Applications",
      data: [26, 35, 40, 32, 50, 60, 55],
      borderWidth: 2,
      tension: 0.4,
      fill: true,
      backgroundColor: (context) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, "rgba(59, 130, 246, 0.25)");
        gradient.addColorStop(1, "rgba(59, 130, 246, 0.0)");
        return gradient;
      },
      borderColor: "#3b82f6",
      pointBackgroundColor: "#ffffff",
      pointBorderColor: "#3b82f6",
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
  ],
};

const pipelineLineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: "index", intersect: false },
  plugins: {
    legend: { display: false },
    tooltip: {
      ...tooltipTheme,
      callbacks: {
        label: (context) => ` ${context.parsed.y} Candidates`,
      },
    },
  },
  scales: {
    x: {
      display: true,
      grid: { display: false },
      ticks: { color: "#94a3b8", font: { size: 11 } },
    },
    y: {
      display: true,
      beginAtZero: true,
      border: { display: false },
      grid: { color: "#f1f5f9", borderDash: [5, 5] },
      ticks: { stepSize: 20, color: "#94a3b8", font: { size: 11 } },
    },
  },
};

const totalBudget = 125000;
const budgetDoughnutData = {
  labels: ["Recruitment", "Training", "Benefits"],
  datasets: [
    {
      data: [45, 30, 25],
      backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"],
      hoverBackgroundColor: ["#2563eb", "#059669", "#d97706"],
      hoverOffset: 8,
      borderWidth: 2,
      borderColor: "#ffffff",
    },
  ],
};

const budgetDoughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      ...tooltipTheme,
      callbacks: {
        label: function (context) {
          const percentage = context.raw;
          const value = (totalBudget * percentage) / 100;
          const formattedValue = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumSignificantDigits: 3,
          }).format(value);
          return ` ${context.label}: ${percentage}% (${formattedValue})`;
        },
      },
    },
  },
  cutout: "75%",
  animation: { animateScale: true, animateRotate: true },
};

const Dashboard = () => {
  return (
    <div className="projects-container">
      {/* 1. KPI Stats Grid (Premium Bubbles) */}
      <div className="stats-grid">
        {kpiCards.map((item, index) => (
          <div key={index} className="stat-card">
            
            {/* --- Premium Bubbles Container --- */}
            {/* We apply the color to the container so bubbles inherit it */}
            <div className="bubbles-container" style={{ color: item.bubbleColor }}>
              <div className="bubble bubble-1"></div>
              <div className="bubble bubble-2"></div>
              <div className="bubble bubble-3"></div>
            </div>

            <div className="stat-content">
              <span className="stat-label">{item.label}</span>
              <div className="stat-value-row">
                <span className="stat-value">{item.value}</span>
              </div>
              <div className="stat-trend trend-up">
                <TrendingUp size={14} />
                <span>{item.change}</span>
              </div>
            </div>
            <div className={`stat-icon-box box-${item.colorClass}`}>
              <item.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      {/* 2. Main Dashboard Layout */}
      <div className="dashboard-layout">
        {/* LEFT COLUMN */}
        <div className="dashboard-column-main">
          
          {/* --- FLEX HEADER: Title Left, Buttons Right --- */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <h3 className="section-title" style={{ margin: 0 }}>
              Ongoing Projects
            </h3>
            
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                className="btn-upload"
                style={{ fontSize: "13px", padding: "8px 16px" }}
              >
                + Post New Job
              </button>
              <button
                className="btn-upload"
                style={{ fontSize: "13px", padding: "8px 16px" }}
              >
                Find Vendors
              </button>
              <button
                className="btn-upload"
                style={{ fontSize: "13px", padding: "8px 16px" }}
              >
                Schedule Interviews
              </button>
            </div>
          </div>

          <div className="projects-grid">
            {projects.map((project, index) => (
              <div key={index} className="project-card">
                
                <div className="card-header">
                  <h3 className="card-title">{project.title}</h3>
                  <button className="card-options-btn">
                    <MoreVertical size={16} />
                  </button>
                </div>

                <div className="card-author">
                  <div
                    className="author-avatar"
                    style={{ backgroundColor: "#e2e8f0" }}
                  />
                  <span className="author-name">{project.company}</span>
                </div>

                <div className="progress-section">
                  <div className="progress-labels">
                    <span>Progress</span>
                    <span className="progress-text">{project.progress}%</span>
                  </div>
                  <div className="progress-bg">
                    <div
                      className="progress-fill"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="card-details">
                  <div className="detail-item">
                    <Clock size={14} /> Due {project.dueDate}
                  </div>
                  <div className="detail-item">
                    <DollarSign size={14} /> {project.budget}
                  </div>
                </div>

                <div>
                  <span className={`status-tag ${project.statusClass}`}>
                    {project.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Applications */}
          <h3 className="section-title" style={{ marginTop: "32px" }}>
            Recent Applications
          </h3>
          <div
            className="project-card"
            style={{ padding: "0", overflow: "hidden" }}
          >
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentApplications.map((app, i) => (
                  <tr key={i}>
                    <td>
                      <div className="card-author">
                        <div
                          className="author-avatar"
                          style={{
                            background: "#3b82f6",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "10px",
                          }}
                        >
                          {app.name.charAt(0)}
                        </div>
                        <span
                          className="author-name"
                          style={{ color: "#1e293b" }}
                        >
                          {app.name}
                        </span>
                      </div>
                    </td>
                    <td style={{ fontSize: "13px", color: "#64748b" }}>
                      {app.role}
                    </td>
                    <td>
                      <span className={`status-tag ${app.statusClass}`}>
                        {app.status}
                      </span>
                    </td>
                    <td>
                      <button className="card-options-btn">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="dashboard-column-side">
          {/* Analytics Card */}
          <div className="project-card">
            <div className="card-header">
              <h3 className="card-title">Hiring Pipeline</h3>
            </div>
            <div style={{ height: "180px", marginTop: "16px", position: "relative", zIndex: 2 }}>
              <Line data={pipelineLineData} options={pipelineLineOptions} />
            </div>
          </div>

          {/* Budget Chart */}
          <div className="project-card">
            <div className="card-header">
              <h3 className="card-title">Budget Allocation</h3>
            </div>
            <div
              style={{
                height: "160px",
                marginTop: "16px",
                position: "relative",
                zIndex: 2,
              }}
            >
              <Doughnut
                data={budgetDoughnutData}
                options={budgetDoughnutOptions}
              />
              <div className="doughnut-center-text">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: "10px",
                      color: "#64748b",
                      fontWeight: "500",
                      textTransform: "uppercase",
                    }}
                  >
                    Total
                  </span>
                  <span
                    style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      color: "#1e293b",
                    }}
                  >
                    $125k
                  </span>
                </div>
              </div>
            </div>

            <div className="legend-row" style={{position: 'relative', zIndex: 2}}>
              <div className="legend-item">
                <span className="dot" style={{ background: "#3b82f6" }}></span>
                <span style={{ marginRight: "4px" }}>Recruit</span>
                <span style={{ fontWeight: "600", color: "#3b82f6" }}>45%</span>
              </div>
              <div className="legend-item">
                <span className="dot" style={{ background: "#10b981" }}></span>
                <span style={{ marginRight: "4px" }}>Train</span>
                <span style={{ fontWeight: "600", color: "#10b981" }}>30%</span>
              </div>
              <div className="legend-item">
                <span className="dot" style={{ background: "#f59e0b" }}></span>
                <span style={{ marginRight: "4px" }}>Ben.</span>
                <span style={{ fontWeight: "600", color: "#f59e0b" }}>25%</span>
              </div>
            </div>
          </div>

          {/* Interviews */}
          <div className="project-card">
            <div className="card-header">
              <h3 className="card-title">Interviews</h3>
              <span
                style={{
                  fontSize: "12px",
                  color: "#3b82f6",
                  cursor: "pointer",
                }}
              >
                View All
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                marginTop: "16px",
                position: "relative",
                zIndex: 2,
              }}
            >
              {interviews.map((int, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      background: "#eff6ff",
                      padding: "8px",
                      borderRadius: "8px",
                      color: "#3b82f6",
                    }}
                  >
                    <Calendar size={18} />
                  </div>
                  <div>
                    <div className="card-title" style={{ fontSize: "13px" }}>
                      {int.name}
                    </div>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>
                      {int.time} • {int.tag}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
