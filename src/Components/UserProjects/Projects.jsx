import React, { useState, useMemo } from "react";
import {
  MoreVertical,
  Clock,
  DollarSign,
  UploadCloud,
  CheckCircle,
  MessageSquare,
  Activity,
  TrendingUp,
  TrendingDown,
  AlertCircle,
} from "lucide-react";
import "./Projects.css";

// --- Initial Mock Data ---
const INITIAL_DATA = [
  {
    id: 1,
    title: "E-commerce Website Redesign",
    author: "Sarah Johnson",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80",
    progress: 75,
    dueDate: "2023-12-15",
    budget: 2500,
    status: "In Progress",
  },
  {
    id: 2,
    title: "Mobile App Development",
    author: "Michael Chen",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80",
    progress: 90,
    dueDate: "2023-12-20",
    budget: 3800,
    status: "Awaiting Review",
  },
  {
    id: 3,
    title: "Brand Identity Design",
    author: "Emma Davis",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80",
    progress: 100,
    dueDate: "2023-12-10",
    budget: 1500,
    status: "Completed",
  },
  {
    id: 4,
    title: "Marketing Campaign",
    author: "Alex Thompson",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80",
    progress: 60,
    dueDate: "2023-12-25",
    budget: 2100,
    status: "In Progress",
  },
  {
    id: 5,
    title: "SEO Optimization",
    author: "David Miller",
    avatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80",
    progress: 30,
    dueDate: "2024-01-05",
    budget: 1200,
    status: "In Progress",
  },
];

// timeline data just for the colored bars
const TIMELINE_DATA = [
  { id: 1, name: "Website Redesign", colorClass: "timeline-bar-green", width: "100%" },
  { id: 2, name: "Mobile App Development", colorClass: "timeline-bar-amber", width: "80%" },
  { id: 3, name: "Marketing Campaign", colorClass: "timeline-bar-red", width: "60%" },
];

// Helper to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumSignificantDigits: 3,
  }).format(amount);
};

// Helper to get status class
const getStatusClass = (status) => {
  if (status === "Completed") return "status-completed";
  if (status === "Awaiting Review") return "status-review";
  return "status-progress";
};

export default function Projects() {
  const [projects, setProjects] = useState(INITIAL_DATA);
  const [activeFilter, setActiveFilter] = useState("All Projects");

  // --- 1. Dynamic Stats Calculation (same as before) ---
  const stats = useMemo(() => {
    const completedProjects = projects.filter((p) => p.status === "Completed");
    const activeProjects = projects.filter((p) => p.status === "In Progress");
    const reviewProjects = projects.filter(
      (p) => p.status === "Awaiting Review"
    );

    const totalEarnings = completedProjects.reduce(
      (sum, p) => sum + p.budget,
      0
    );

    return [
      {
        label: "Total Earnings",
        value: formatCurrency(totalEarnings),
        trend: "+12.5%",
        isPositive: true,
        icon: DollarSign,
        colorClass: "blue",
      },
      {
        label: "Active Projects",
        value: activeProjects.length,
        trend: "+2 new",
        isPositive: true,
        icon: Activity,
        colorClass: "indigo",
      },
      {
        label: "Pending Review",
        value: reviewProjects.length,
        trend: "Needs attn",
        isPositive: false,
        icon: Clock,
        colorClass: "amber",
      },
      {
        label: "Completed",
        value: completedProjects.length,
        trend: "All time",
        isPositive: true,
        icon: CheckCircle,
        colorClass: "emerald",
      },
    ];
  }, [projects]);

  // --- filter for dropdown (top-right in Ongoing Projects like design) ---
  const filteredProjects = useMemo(() => {
    if (activeFilter === "All Projects") return projects;
    if (activeFilter === "In Progress")
      return projects.filter((p) => p.status === "In Progress");
    if (activeFilter === "Awaiting Review")
      return projects.filter((p) => p.status === "Awaiting Review");
    if (activeFilter === "Completed")
      return projects.filter((p) => p.status === "Completed");
    return projects;
  }, [projects, activeFilter]);

  // --- 4. Event Handlers ---
  const handleUpload = (id) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: "Awaiting Review", progress: 95 } : p
      )
    );
  };

  const handleReview = (id) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: "Completed", progress: 100 } : p
      )
    );
  };

  return (
    <div className="projects-page-wrapper">
      <div className="projects-container">
        {/* 1. Stats Row (top cards) */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-content">
                <span className="stat-label">{stat.label}</span>
                <div className="stat-value-row">
                  <span className="stat-value">{stat.value}</span>
                </div>
                <div
                  className={`stat-trend ${
                    stat.isPositive ? "trend-up" : "trend-down"
                  }`}
                >
                  {stat.isPositive ? (
                    <TrendingUp size={14} />
                  ) : (
                    <TrendingDown size={14} />
                  )}
                  <span>{stat.trend}</span>
                </div>
              </div>
              <div className={`stat-icon-box box-${stat.colorClass}`}>
                <stat.icon size={24} />
              </div>
            </div>
          ))}
        </div>

        {/* 2. Projects Timeline section */}
        <div className="timeline-card">
          <div className="timeline-header">
            <h2 className="section-title">Projects Timeline</h2>
          </div>

          <div className="timeline-body">
            {/* Today vertical line */}
            {/* <div className="timeline-today-line">
              <span className="timeline-today-label">Today</span>
            </div> */}

            <div className="timeline-rows">
              {TIMELINE_DATA.map((item) => (
                <div key={item.id} className="timeline-row">
                  <div className="timeline-label">{item.name}</div>
                  <div className="timeline-bar-track">
                    <div
                      className={`timeline-bar ${item.colorClass}`}
                      style={{ width: item.width }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Ongoing Projects header + controls */}
        <div className="ongoing-header">
          <div>
            <h2 className="section-title">Ongoing Projects</h2>
            <p className="section-subtitle">
              Keep track of all active client projects and review their progress.
            </p>
          </div>

          <div className="ongoing-controls">
            <select
              className="projects-filter-select"
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
            >
              <option>All Projects</option>
              <option>In Progress</option>
              <option>Awaiting Review</option>
              <option>Completed</option>
            </select>

            <button className="add-project-btn">+ Add Project</button>
          </div>
        </div>

        {/* 4. Projects Grid (cards) */}
        <div className="jobs-grid">
          {filteredProjects.map((project) => (
            <div key={project.id} className="project-card">
              {/* Header */}
              <div className="card-header">
                <h3 className="card-title">{project.title}</h3>
                <button className="card-options-btn">
                  <MoreVertical size={16} />
                </button>
              </div>

              {/* Author */}
              <div className="card-author">
                <img
                  src={project.avatar}
                  alt={project.author}
                  className="author-avatar"
                />
                <span className="author-name">{project.author}</span>
              </div>

              {/* Progress Bar */}
              <div className="progress-section">
                <div className="progress-labels">
                  <span>Progress</span>
                  <span className="progress-text">{project.progress}%</span>
                </div>
                <div className="progress-bg">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${project.progress}%`,
                      backgroundColor:
                        project.status === "Completed" ? "#10B981" : "#3b82f6",
                    }}
                  ></div>
                </div>
              </div>

              {/* Details */}
              <div className="card-details">
                <div className="detail-item">
                  <Clock size={14} /> Due {project.dueDate}
                </div>
                <div className="detail-item">
                  <DollarSign size={14} /> Budget: ${project.budget}
                </div>
              </div>

              {/* Status Tag */}
              <div>
                <span className={`status-tag ${getStatusClass(project.status)}`}>
                  {project.status}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="card-actions">
                {project.status === "In Progress" && (
                  <button
                    className="btn-upload w-100"
                    onClick={() => handleUpload(project.id)}
                  >
                    <UploadCloud size={14} /> Upload Work
                  </button>
                )}

                {project.status === "Awaiting Review" && (
                  <button
                    className="btn-review"
                    onClick={() => handleReview(project.id)}
                    style={{
                      backgroundColor: "#10B981",
                      color: "white",
                      borderColor: "#10B981",
                    }}
                  >
                    <CheckCircle size={14} /> Mark Done
                  </button>
                )}

                {project.status === "Completed" && (
                  <button
                    className="btn-review"
                    disabled
                    style={{ opacity: 0.6 }}
                  >
                    <CheckCircle size={14} /> Completed
                  </button>
                )}

                <button className="btn-chat">
                  <MessageSquare size={16} />
                </button>
              </div>
            </div>
          ))}

          {filteredProjects.length === 0 && (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "40px",
                color: "#64748b",
              }}
            >
              <AlertCircle
                size={48}
                style={{ margin: "0 auto 16px", opacity: 0.5 }}
              />
              <p>No projects found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
