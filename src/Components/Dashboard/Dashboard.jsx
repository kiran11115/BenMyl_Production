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
import {
  MoreVertical,
  Clock,
  DollarSign,
  TrendingUp,
  Briefcase,
  Users,
  FileText,
  Calendar,
  Search,
} from "lucide-react";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

// --- Data ---
const kpiCards = [
  {
    label: "Active Job Posts",
    value: "24",
    change: "+8%",
    icon: Briefcase,
    colorClass: "blue",
  },
  {
    label: "Total Applications",
    value: "156",
    change: "+15%",
    icon: Users,
    colorClass: "indigo",
  },
  {
    label: "Ongoing Contracts",
    value: "18",
    change: "+12%",
    icon: FileText,
    colorClass: "amber",
  },
  {
    label: "Total Spend",
    value: "$125K",
    change: "+18%",
    icon: DollarSign,
    colorClass: "emerald",
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
const pipelineLineData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      data: [26, 35, 40, 32, 50, 60, 55],
      borderWidth: 2,
      tension: 0.45,
      fill: true,
      backgroundColor: "rgba(59, 130, 246, 0.08)",
      borderColor: "#3b82f6",
      pointRadius: 0,
    },
  ],
};

const pipelineLineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { enabled: true } },
  scales: { x: { display: false }, y: { display: false } },
};

const budgetDoughnutData = {
  labels: ["Recruitment", "Training", "Benefits"],
  datasets: [
    {
      data: [45, 30, 25],
      backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"],
      borderWidth: 0,
    },
  ],
};

const budgetDoughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  cutout: "75%",
};

const Dashboard = () => {
  return (
    <div className="projects-container">
      {/* 1. KPI Stats Grid (Matches Projects.css) */}
      <div className="stats-grid">
        {kpiCards.map((item, index) => (
          <div key={index} className="stat-card">
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

      {/* 2. Quick Actions */}
      <div
        className="projects-header"
        style={{ justifyContent: "flex-start", gap: "12px" }}
      >
        <button className="btn-upload" style={{ maxWidth: "160px" }}>
          + Post New Job
        </button>
        <button
          className="btn-review"
          style={{ flex: "0 0 auto", width: "auto", padding: "8px 16px" }}
        >
          Find Vendors
        </button>
        <button
          className="btn-review"
          style={{ flex: "0 0 auto", width: "auto", padding: "8px 16px" }}
        >
          Schedule Interviews
        </button>
      </div>

      {/* 3. Main Dashboard Layout */}
      <div className="dashboard-layout">
        {/* LEFT COLUMN */}
        <div className="dashboard-column-main">
          {/* Ongoing Projects Section */}
          <h3 className="section-title">Ongoing Projects</h3>
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

          {/* Recent Applications (Table Style adapted to Card) */}
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
            <div style={{ height: "150px", marginTop: "16px" }}>
              <Line data={pipelineLineData} options={pipelineLineOptions} />
            </div>
          </div>

          <div className="project-card">
            <div className="card-header">
              <h3 className="card-title">Budget</h3>
            </div>
            <div
              style={{
                height: "140px",
                marginTop: "16px",
                position: "relative",
              }}
            >
              <Doughnut
                data={budgetDoughnutData}
                options={budgetDoughnutOptions}
              />
              <div className="doughnut-center-text">
                <span
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    color: "#1e293b",
                  }}
                >
                  45%
                </span>
              </div>
            </div>
            <div className="legend-row">
              <div className="legend-item">
                <span className="dot" style={{ background: "#3b82f6" }}></span>
                Recruit
              </div>
              <div className="legend-item">
                <span className="dot" style={{ background: "#10b981" }}></span>
                Train
              </div>
              <div className="legend-item">
                <span className="dot" style={{ background: "#f59e0b" }}></span>
                Ben.
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
