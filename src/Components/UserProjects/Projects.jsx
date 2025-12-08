import React, { useState } from "react";
import {
  MoreVertical,
  Clock,
  DollarSign,
  UploadCloud,
  CheckCircle,
  MessageSquare,
} from "lucide-react";
import "./Projects.css";

// --- Mock Data ---
const stats = [
  { label: "Total Earnings", value: "$24,580" },
  { label: "Active Projects", value: "8" },
  { label: "Pending Bids", value: "12" },
  { label: "Completed Projects", value: "130" },
];

const projectsData = [
  {
    id: 1,
    title: "E-commerce Website Redesign",
    author: "Sarah Johnson",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80",
    progress: 75,
    dueDate: "Dec 15, 2023",
    budget: "$2,500",
    status: "In Progress",
  },
  {
    id: 2,
    title: "Mobile App Development",
    author: "Michael Chen",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80",
    progress: 90,
    dueDate: "Dec 20, 2023",
    budget: "$3,800",
    status: "Awaiting Review",
  },
  {
    id: 3,
    title: "Brand Identity Design",
    author: "Emma Davis",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80",
    progress: 100,
    dueDate: "Dec 10, 2023",
    budget: "$1,500",
    status: "Completed",
  },
  {
    id: 4,
    title: "Marketing Campaign",
    author: "Alex Thompson",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80",
    progress: 60,
    dueDate: "Dec 25, 2023",
    budget: "$2,100",
    status: "In Progress",
  },
  {
    id: 5,
    title: "Content Strategy",
    author: "Lisa Wang",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80",
    progress: 30,
    dueDate: "Dec 30, 2023",
    budget: "$1,800",
    status: "In Progress",
  },
  {
    id: 6,
    title: "SEO Optimization",
    author: "David Miller",
    avatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80",
    progress: 85,
    dueDate: "Dec 18, 2023",
    budget: "$2,300",
    status: "Awaiting Review",
  },
];

// Helper to get status class
const getStatusClass = (status) => {
  if (status === "Completed") return "status-completed";
  if (status === "Awaiting Review") return "status-review";
  return "status-progress";
};

function Projects() {
  const [activeTab, setActiveTab] = useState("All Projects");

  return (
    <div className="projects-container">
      {/* 1. Stats Row */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* 2. Header & Tabs */}
      <div className="projects-header">
        <div className="tabs-container">
          {[
            "All Projects (45)",
            "Active (8)",
            "Bids (12)",
            "Completed (22)",
            "Cancelled (3)",
          ].map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${
                activeTab === tab.split(" ")[0] ? "active" : ""
              }`}
              onClick={() => setActiveTab(tab.split(" ")[0])}
            >
              {tab}
            </button>
          ))}
        </div>

        <button className="sort-dropdown">
          Sort by:{" "}
          <span style={{ color: "#1e293b", fontWeight: 500 }}>
            Recent First
          </span>{" "}
          ▾
        </button>
      </div>

      {/* 3. Projects Grid */}
      <div className="projects-grid">
        {projectsData.map((project) => (
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
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Details */}
            <div className="card-details">
              <div className="detail-item">
                <Clock size={14} /> Due {project.dueDate}
              </div>
              <div className="detail-item">
                <DollarSign size={14} /> In Escrow: {project.budget}
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
              <button className="btn-upload">
                <UploadCloud size={14} /> Upload Work
              </button>
              <button className="btn-review">
                <CheckCircle size={14} /> Request Review
              </button>
              <button className="btn-chat">
                <MessageSquare size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;
