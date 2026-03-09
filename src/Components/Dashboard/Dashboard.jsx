import React, { useRef, useState, useEffect, useMemo } from "react";
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
import { Briefcase, Users, FileText, DollarSign, Info } from "lucide-react";
import StatsGrid from "./StatsGrid";
import ProjectsSection from "./ProjectsSection";
import UploadTalentTable from "../UploadTalent/UploadTalentTable";
import HiringPipelineChart from "./charts/HiringPipelineChart";
import BudgetChart from "./charts/BudgetChart";
import InterviewsList from "./InterviewsList";
import { useGetQueueManagementMutation } from "../../State-Management/Api/UploadResumeApiSlice";
import { useGetGroupedJobTitlesQuery } from "../../State-Management/Api/TalentPoolApiSlice";

// Component Imports
import Guide from "../Guide/Guide";
import { useNavigate } from "react-router-dom";

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
const projects = [
  { title: "Cloud Migration Project", company: "Tech Solutions Inc.", status: "On Track", statusClass: "status-completed", progress: 75, budget: "$45,000", dueDate: "Dec 20, 2023" },
  { title: "Mobile App Development", company: "Digital Dynamics", status: "In Progress", statusClass: "status-review", progress: 40, budget: "$85,000", dueDate: "Jan 15, 2024" },
  { title: "Cloud Infrastructure", company: "Nexus Systems", status: "Review", statusClass: "status-review", progress: 75, budget: "$120,000", dueDate: "Feb 28, 2024" },
  { title: "Cybersecurity Audit", company: "SecureNet Solutions", status: "Pending", statusClass: "status-pending", progress: 0, budget: "$45,000", dueDate: "Jan 10, 2024" },
];

const interviews = [
  // { name: "Sarah Johnson", role: "Senior Developer", time: "10:00 AM", tag: "Final" },
  // { name: "Michael Chen", role: "Project Manager", time: "2:00 PM", tag: "Final" },
  // { name: "David Kim", role: "Backend Engineer", time: "11:30 AM", tag: "Coding" },
  // { name: "Jessica Wong", role: "Product Designer", time: "1:15 PM", tag: "Portfolio" },
  // { name: "Robert Fox", role: "DevOps Specialist", time: "3:45 PM", tag: "System Design" },
  // { name: "Amanda Smith", role: "QA Lead", time: "9:00 AM", tag: "Screening" },
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
  const guideRef = useRef();
  const [pendingReviewCount, setPendingReviewCount] = useState(0);
  const [postedJobsCount, setPostedJobsCount] = useState(0);
  const [getQueueManagement] = useGetQueueManagementMutation();
  const userId = localStorage.getItem("CompanyId");
  const { data: jobTitles = [] } = useGetGroupedJobTitlesQuery(userId);

  const kpiCards = [
    { label: "Posted Jobs", value: String(postedJobsCount), change: "+8%", icon: Briefcase, cardType: "card-blue", bubbleColor: "#3b82f6" },
    { label: "Pending Review Profiles", value: String(pendingReviewCount), change: "+15%", icon: Users, cardType: "card-purple", bubbleColor: "#6366f1" },
    { label: "Ongoing Contracts", value: "0", change: "0%", icon: FileText, cardType: "card-yellow", bubbleColor: "#f59f0a" },
    { label: "Total Spend", value: "$0", change: "0%", icon: DollarSign, cardType: "card-green", bubbleColor: "#10b981" },
  ];

  useEffect(() => {
    const fetchPendingReviewCount = async () => {
      try {
        const payload = {
          companyid: Number(localStorage.getItem("logincompanyid")),
          pageNumber: 1,
          pageSize: 1000, // Fetch enough to get all pending items
          filters: [],
        };

        const res = await getQueueManagement(payload).unwrap();
        const pendingCount = Array.isArray(res)
          ? res.filter(item => item.status === "Pending For Review").length
          : 0;
        setPendingReviewCount(pendingCount);
      } catch (err) {
        console.error("Failed to fetch pending review count", err);
      }
    };

    fetchPendingReviewCount();
  }, [getQueueManagement]);

  useEffect(() => {
    // Update posted jobs count from job titles
    setPostedJobsCount(Array.isArray(jobTitles) ? jobTitles.length : 0);
  }, [jobTitles]);

  
   const [refreshKey, setRefreshKey] = useState(0);
      const [showUploading, setShowUploading] = useState(false);
      const [showUploadedSuccess, setShowUploadedSuccess] = useState(false);
      const [showUploadError, setShowUploadError] = useState(false);
      const [uploadErrorMessage, setUploadErrorMessage] = useState("");
      const [waitingForRefresh, setWaitingForRefresh] = useState(false);
      const [uploadCount, setUploadCount] = useState(0);
      const [countdown, setCountdown] = useState(0);
      const countdownRef = useRef(null);
  
      const handleUploadSuccess = (message) => {
          if (message && String(message).toLowerCase().includes("fail")) {
              setUploadErrorMessage(message);
              setShowUploadError(true);
              setTimeout(() => setShowUploadError(false), 10000);
              return;
          }
  
          // Extract count from message like "Successfully uploaded N resume(s)"
          const match = message && String(message).match(/(\d+)/);
          const count = match ? parseInt(match[1], 10) : 1;
          setUploadCount(count);
  
          setShowUploadedSuccess(true);
          setTimeout(() => setShowUploadedSuccess(false), 10000);
  
          // 🔥 Start showing loading in table
          setWaitingForRefresh(true);
  
          // Start countdown
          const totalSeconds = 20;
          setCountdown(totalSeconds);
          if (countdownRef.current) clearInterval(countdownRef.current);
          countdownRef.current = setInterval(() => {
              setCountdown(prev => {
                  if (prev <= 1) {
                      clearInterval(countdownRef.current);
                      return 0;
                  }
                  return prev - 1;
              });
          }, 1000);
  
          // ⏳ Wait 20 seconds then refresh
          setTimeout(() => {
              setRefreshKey((prev) => prev + 1);
              setWaitingForRefresh(false);
              setUploadCount(0);
              setCountdown(0);
          }, 20000);
      };
  
    
      const [selectedEmails, setSelectedEmails] = useState(new Set());
      const navigate = useNavigate();
  
      const toggleSelect = (email) => {
          const updated = new Set(selectedEmails);
          updated.has(email) ? updated.delete(email) : updated.add(email);
          setSelectedEmails(updated);
      };

  return (
    <div className="projects-container">
      {/* Dashboard Header with Guide Trigger */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="section-title m-0">Dashboard</h2>
        <button
          className="btn d-flex align-items-center gap-2"
          onClick={() => guideRef.current?.startTour()}
          style={{
            background: "#eff6ff",
            color: "#313131",
            borderRadius: "10px",
            padding: "8px 16px",
            fontWeight: "600",
            fontSize: "14px",
            transition: "all 0.2s"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <Info size={18} />
          Help Guide
        </button>
      </div>

      {/* Workflow Guide */}
      <Guide ref={guideRef} />

      {/* 1. KPI Stats Grid */}
      <div id="dashboard-stats-grid">
        <StatsGrid data={kpiCards} />
      </div>

      {/* 2. Main Dashboard Layout */}
      <div className="dashboard-layout">
        {/* LEFT COLUMN: Projects & Applications */}
        <div className="dashboard-column-main">
          <div id="dashboard-projects-section">
           <ProjectsSection
  projects={projects}
  onUploadSuccess={handleUploadSuccess}
  onUploading={(isUploading) => setShowUploading(!!isUploading)}
/>
          </div>
          <div style={{ marginTop: "12px", marginBottom: "16px" }}>
            <h3 className="section-title">Review Profiles</h3>
          </div>
          <div id="dashboard-talent-table">
            <UploadTalentTable isDashboard={true} />
          </div>
        </div>

        {/* RIGHT COLUMN: Charts & Interviews */}
        <div className="dashboard-column-side">
          <div id="dashboard-charts-area" className="gap-3 d-flex flex-column">
            <HiringPipelineChart
              data={pipelineLineData}
              tooltipTheme={tooltipTheme}
            />

            <BudgetChart
              data={budgetDoughnutData}
              totalBudget={125000}
              tooltipTheme={tooltipTheme}
            />
          </div>

          <div id="dashboard-interviews-list">
            <InterviewsList interviews={interviews} />
          </div>
        </div>
      </div>
      {showUploading && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20000 }}>
                    <div style={{ background: 'white', padding: 24, borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, minWidth: 280 }}>
                        <div style={{ width: 36, height: 36, border: '4px solid #f5810c', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                        <div style={{ fontWeight: 700 }}>Uploading — please wait</div>
                        <div style={{ color: '#6b7280', fontSize: 13 }}>Processing resumes. This may take a moment.</div>
                    </div>
                    <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
                </div>
            )}
    </div>
  );
};

export default Dashboard;
