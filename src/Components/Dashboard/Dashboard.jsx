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
import { Briefcase, Users, FileText, DollarSign } from "lucide-react";
import StatsGrid from "./StatsGrid";
import ProjectsSection from "./ProjectsSection";
import RecentApplications from "./RecentApplications";
import HiringPipelineChart from "./charts/HiringPipelineChart";
import BudgetChart from "./charts/BudgetChart";
import InterviewsList from "./InterviewsList";

// Component Imports


// Register ChartJS
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

// --- DATA CONSTANTS ---
const kpiCards = [
  { label: "Active Job Posts", value: "24", change: "+8%", icon: Briefcase, cardType: "card-blue", bubbleColor: "#3b82f6" },
  { label: "Total Applications", value: "156", change: "+15%", icon: Users, cardType: "card-purple", bubbleColor: "#6366f1" },
  { label: "Ongoing Contracts", value: "18", change: "+12%", icon: FileText, cardType: "card-yellow", bubbleColor: "#f59f0a" },
  { label: "Total Spend", value: "$125K", change: "+18%", icon: DollarSign, cardType: "card-green", bubbleColor: "#10b981" },
];

const projects = [
  { title: "Cloud Migration Project", company: "Tech Solutions Inc.", status: "On Track", statusClass: "status-completed", progress: 75, budget: "$45,000", dueDate: "Dec 20, 2023" },
  { title: "Mobile App Development", company: "Digital Dynamics", status: "In Progress", statusClass: "status-review", progress: 40, budget: "$85,000", dueDate: "Jan 15, 2024" },
  { title: "Cloud Infrastructure", company: "Nexus Systems", status: "Review", statusClass: "status-review", progress: 75, budget: "$120,000", dueDate: "Feb 28, 2024" },
  { title: "Cybersecurity Audit", company: "SecureNet Solutions", status: "Pending", statusClass: "status-pending", progress: 0, budget: "$45,000", dueDate: "Jan 10, 2024" },
];

const recentApplications = [
  { 
    name: "Sarah Johnson", 
    email: "sarah.j@techsolutions.com",
    role: "Senior Dev", 
    status: "Shortlisted", 
    statusClass: "status-completed",
    avatar: "https://i.pravatar.cc/150?img=1"
  },
  { 
    name: "Michael Chen", 
    email: "m.chen@digitaldyn.net",
    role: "Project Mgr", 
    status: "In Review", 
    statusClass: "status-review",
    avatar: "https://i.pravatar.cc/150?img=11"
  },
  { 
    name: "Emily Davis", 
    email: "edavis.dev@gmail.com",
    role: "DevOps Eng", 
    status: "Interviewing", 
    statusClass: "status-progress",
    avatar: "https://i.pravatar.cc/150?img=5"
  },
  { 
    name: "David Lee", 
    email: "david.lee88@outlook.com",
    role: "Backend Dev", 
    status: "Interviewing", 
    statusClass: "status-progress",
    avatar: "https://i.pravatar.cc/150?img=3"
  },
  { 
    name: "Maria Garcia", 
    email: "maria.g.qa@testlab.io",
    role: "QA Engineer", 
    status: "Shortlisted", 
    statusClass: "status-completed",
    avatar: "https://i.pravatar.cc/150?img=9"
  },
  { 
    name: "James Williams", 
    email: "jwilliams@dataminds.com",
    role: "Data Scientist", 
    status: "In Review", 
    statusClass: "status-review",
    avatar: "https://i.pravatar.cc/150?img=8"
  },
  { 
    name: "Olivia Martinez", 
    email: "omartinez@product.co",
    role: "Product Owner", 
    status: "Offer Extended", 
    statusClass: "status-progress",
    avatar: "https://i.pravatar.cc/150?img=20"
  },
  { 
    name: "John Smith", 
    email: "john.smith.ui@design.net",
    role: "UI/UX Designer", 
    status: "New", 
    statusClass: "status-review",
    avatar: "https://i.pravatar.cc/150?img=12"
  },
  { 
    name: "William Rodriguez", 
    email: "will.rod@sysops.org",
    role: "SysAdmin", 
    status: "Rejected", 
    statusClass: "status-pending",
    avatar: "https://i.pravatar.cc/150?img=53"
  },
  { 
    name: "Ava Wilson", 
    email: "ava.w@frontend.dev",
    role: "Jr. Frontend Dev", 
    status: "New", 
    statusClass: "status-review",
    avatar: "https://i.pravatar.cc/150?img=44"
  },
];

const interviews = [
  { name: "Sarah Johnson", role: "Senior Developer", time: "10:00 AM", tag: "Technical" },
  { name: "Michael Chen", role: "Project Manager", time: "2:00 PM", tag: "Final" },
  { name: "David Kim", role: "Backend Engineer", time: "11:30 AM", tag: "Coding" },
  { name: "Jessica Wong", role: "Product Designer", time: "1:15 PM", tag: "Portfolio" },
  { name: "Robert Fox", role: "DevOps Specialist", time: "3:45 PM", tag: "System Design" },
  { name: "Amanda Smith", role: "QA Lead", time: "9:00 AM", tag: "Screening" },
];

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

const Dashboard = () => {
  return (
    <div className="projects-container">
      {/* 1. KPI Stats Grid */}
      <StatsGrid data={kpiCards} />

      {/* 2. Main Dashboard Layout */}
      <div className="dashboard-layout">
        {/* LEFT COLUMN: Projects & Applications */}
        <div className="dashboard-column-main">
          <ProjectsSection projects={projects} />
          <RecentApplications applications={recentApplications} />
        </div>

        {/* RIGHT COLUMN: Charts & Interviews */}
        <div className="dashboard-column-side">
          <HiringPipelineChart 
            data={pipelineLineData} 
            tooltipTheme={tooltipTheme} 
          />
          
          <BudgetChart
            data={budgetDoughnutData} 
            totalBudget={125000} 
            tooltipTheme={tooltipTheme} 
          />
          
          <InterviewsList interviews={interviews} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
