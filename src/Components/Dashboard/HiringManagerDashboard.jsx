import React, { useRef, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast as toastify } from "react-toastify";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Briefcase,
  Users,
  FileText,
  Info,
  Activity,
  LayoutGrid,
  Clock,
  Calendar,
  TrendingUp,
  ChevronRight,
  MapPin,
  ShieldCheck,
  Inbox,
  CheckSquare,
  ArrowRight,
  Plus,
  Upload,
  RefreshCw,
  ArrowUpRight,
  Search,
  Send,
  Command,
  Sparkles,
  Layers3,
} from "lucide-react";
import ProjectsSection from "./ProjectsSection";
import HiringPipelineChart from "./charts/HiringPipelineChart";
import InterviewsList from "./InterviewsList";
import { useGetGroupedJobTitlesQuery } from "../../State-Management/Api/TalentPoolApiSlice";
import { CandidateCard } from "../UploadTalent/UserTalentGrid";
import Guide from "../Guide/Guide";
import UploadTalentModal from "../UploadTalent/UploadTalentModal";
import "../Admin/Modules/AdminDashboard/AdminDashboard.css";
import { useGetPostedMonthlyAnalyticsQuery, useGetRequiterDashboardQuery } from "../../State-Management/Api/DashboardApiSlice";

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, Filler);

const projects = [
  { title: "Cloud Migration Project", company: "Tech Solutions Inc.", status: "On Track", statusClass: "status-completed", progress: 75, budget: "$45,000", dueDate: "Dec 20, 2023", approvedBy: "John Smith" },
  { title: "Mobile App Development", company: "Digital Dynamics", status: "In Progress", statusClass: "status-review", progress: 40, budget: "$85,000", dueDate: "Jan 15, 2024", approvedBy: "Sarah Johnson" },
  { title: "Cloud Infrastructure", company: "Nexus Systems", status: "Review", statusClass: "status-review", progress: 75, budget: "$120,000", dueDate: "Feb 28, 2024", approvedBy: "Michael Brown" },
];

const topTalent = [
  { id: 1, name: "Robert Fox", role: "Sr. React Developer", match: "98%", experience: "8 Years", location: "San Francisco", availability: "Immediate", approvedBy: "Admin" },
  { id: 2, name: "Jane Cooper", role: "Backend Engineer", match: "95%", experience: "6 Years", location: "Remote", availability: "2 Weeks", approvedBy: "John Smith" },
  { id: 3, name: "Guy Hawkins", role: "UI/UX Designer", match: "92%", experience: "5 Years", location: "New York", availability: "Immediate", approvedBy: "Sarah Johnson" },
];

const earningsData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [{
    label: " Earnings",
    data: [30000, 45000, 42000, 60000, 55000, 75000],
    borderColor: "#3b82f6",
    backgroundColor: "rgba(59, 130, 246, 0.2)",
    fill: true,
    tension: 0.4,
    pointRadius: 0,
    borderWidth: 2,
  }],
};

const utilizationData = {
  labels: ["Utilized", "Available"],
  datasets: [{
    data: [75, 25],
    backgroundColor: ["#f5810c", "rgba(255,255,255,0.05)"],
    borderWidth: 0,
  }]
};

const getInitials = (name = "") => {
  return name.split(" ").filter(Boolean).slice(0, 2).map((n) => n[0].toUpperCase()).join("");
};

const pipelineLineData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [{
    label: " Applications",
    data: [26, 35, 40, 32, 50, 60, 55],
    borderWidth: 2,
    tension: 0.4,
    fill: true,
    borderColor: "#3b82f6",
    backgroundColor: "rgba(59, 130, 246, 0.1)",
  }],
};

const sparklineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { enabled: false } },
  scales: {
    x: { display: false },
    y: { display: false, min: 0 }
  },
  elements: {
    point: { radius: 0, hoverRadius: 0 }
  },
  layout: { padding: 0 }
};

const createSparklineData = (color, gradientStart, gradientEnd, dataPoints) => ({
  labels: dataPoints.map((_, i) => i),
  datasets: [{
    data: dataPoints,
    borderColor: color,
    borderWidth: 1.2,
    fill: true,
    backgroundColor: (context) => {
      const chart = context.chart;
      const { ctx, chartArea } = chart;
      if (!chartArea) return 'transparent';
      const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
      gradient.addColorStop(0, gradientStart);
      gradient.addColorStop(1, gradientEnd);
      return gradient;
    },
    tension: 0.4
  }]
});

const HiringManagerDashboard = () => {
  const navigate = useNavigate();
  const guideRef = useRef();
  const [postedJobsCount, setPostedJobsCount] = useState(0);
  const [activeProjectsCount, setActiveProjectsCount] = useState(0);
  const [pendingReviewCount, setPendingReviewCount] = useState(0);
  const [recentJobs, setRecentJobs] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [hiringHealth, setHiringHealth] = useState(75);
  const [activeMetric, setActiveMetric] = useState('earnings');
  const [toastMessage, setToastMessage] = useState("");
  const [showUploadedSuccess, setShowUploadedSuccess] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [toast, setToast] = useState(null);
  const user = localStorage.getItem("UserName") || "User";
  const userId = localStorage.getItem("CompanyId");
  const companyId = localStorage.getItem("logincompanyid");
  const { data: jobTitles = [] } = useGetGroupedJobTitlesQuery(userId , {refetchOnMountOrArgChange:true});
  const [dashboardProjects, setDashboardProjects] = useState([]);
  const { data: dashboardStats } = useGetRequiterDashboardQuery(
    { companyId, userId },
    { skip: !userId, refetchOnMountOrArgChange: true }
  );
  const { data: monthlyAnalytics } = useGetPostedMonthlyAnalyticsQuery(undefined, { refetchOnMountOrArgChange: true });

  const sparklineData1 = useMemo(() => createSparklineData('#8b5cf6', 'rgba(139, 92, 246, 0.15)', 'rgba(139, 92, 246, 0)', [10, 20, 15, 25, 20, 30]), []);
  const sparklineData2 = useMemo(() => createSparklineData('#3b82f6', 'rgba(59, 130, 246, 0.15)', 'rgba(59, 130, 246, 0)', [15, 18, 20, 22, 25, 28]), []);
  const sparklineData3 = useMemo(() => createSparklineData('#10b981', 'rgba(16, 185, 129, 0.15)', 'rgba(16, 185, 129, 0)', [20, 25, 28, 30, 35, 40]), []);
  const sparklineData4 = useMemo(() => createSparklineData('#06b6d4', 'rgba(6, 182, 212, 0.15)', 'rgba(6, 182, 212, 0)', [10, 15, 20, 25, 22, 30]), []);

  useEffect(() => {
    // 1. Sync card counts from dashboardStats API or fallback to local calculations
    if (dashboardStats) {
      setPostedJobsCount(dashboardStats.jobsPosted ?? 0);
      setActiveProjectsCount(dashboardStats.activeProjects ?? 0);
      setPendingReviewCount(dashboardStats.pitchesToReview ?? 0);
      setHiringHealth(dashboardStats.hiringHealth ?? 75);
    } else {
      setPostedJobsCount(Array.isArray(jobTitles) ? jobTitles.length : 0);

      const customProjects = JSON.parse(localStorage.getItem("customProjects") || "[]");
      const mockProjects = [
        { status: "Completed", budget: 45000 },
        { status: "In Progress", budget: 85000 },
        { status: "Awaiting Review", budget: 120000 },
      ];
      const allProjects = [...mockProjects, ...customProjects];
      setActiveProjectsCount(allProjects.filter(p => p.status === "In Progress").length);
      setHiringHealth(75);
      setPendingReviewCount(0);
    }

    // 2. Map jobTitles to projects for the dashboard
    if (Array.isArray(jobTitles)) {
      const mappedProjects = jobTitles.map(job => {
        const rateText = job.salaryRange_Min && job.salaryRange_Max
          ? `$${job.salaryRange_Min}-${job.salaryRange_Max}`
          : job.salaryRange_Min ? `$${job.salaryRange_Min}` : "N/A";

        const budgetLabel = (() => {
          const t = (job.salarType || "").toLowerCase();
          if (t.includes("hour") || t.includes("/hr") || t === "hourly") return "/hr";
          if (t.includes("month")) return "/month";
          if (t.includes("budget") || t.includes("fixed") || t.includes("entire")) return "Budget";
          return "/hr";
        })();

        return {
          title: job.jobTitle,
          company: job.companyName,
          status: job.isactive ? "Active" : "Closed",
          statusClass: job.isactive ? "status-completed" : "status-review",
          progress: job.isactive ? 100 : 0,
          budget: `${rateText}${budgetLabel}`,
          dueDate: job.lastDateToApply ? new Date(job.lastDateToApply).toLocaleDateString() : "Ongoing",
          approvedBy: job.userName || "Hiring Manager"
        };
      });
      setDashboardProjects(mappedProjects.slice(0, 3));
    }

    // 3. Calculate total revenue from projects
    const customProjects = JSON.parse(localStorage.getItem("customProjects") || "[]");
    const mockProjects = [
      { status: "Completed", budget: 45000 },
      { status: "In Progress", budget: 85000 },
      { status: "Awaiting Review", budget: 120000 },
    ];
    const allProjects = [...mockProjects, ...customProjects];
    const revenue = allProjects
      .filter(p => p.status === "Completed")
      .reduce((sum, p) => sum + (typeof p.budget === 'string' ? parseFloat(p.budget.replace(/[^0-9.]/g, '')) : p.budget || 0), 0);
    setTotalRevenue(revenue);

    // 4. Map jobTitles to recentJobs for parity
    if (Array.isArray(jobTitles)) {
      const mappedJobs = jobTitles.slice(0, 3).map(job => {
        const rateText = job.salaryRange_Min && job.salaryRange_Max
          ? `$${job.salaryRange_Min}-${job.salaryRange_Max}`
          : job.salaryRange_Min ? `$${job.salaryRange_Min}` : "N/A";

        const budgetLabel = (() => {
          const t = (job.salarType || "").toLowerCase();
          if (t.includes("hour") || t.includes("/hr") || t === "hourly") return "/hr";
          if (t.includes("month")) return "/month";
          if (t.includes("budget") || t.includes("fixed") || t.includes("entire")) return "Budget";
          return "/hr";
        })();

        return {
          id: job.jobID,
          title: job.jobTitle,
          company: job.companyName,
          location: job.location,
          experience: job.experienceLevel || job.yearsOfExperience,
          salary: `${rateText}${budgetLabel}`,
          type: job.employeeType || job.workModels,
          department: job.department,
          skills: job.requiredSkills ? job.requiredSkills.split(",").map(s => s.trim()) : [],
          avatar: `https://ui-avatars.com/api/?name=${job.companyName}&background=3b82f6&color=fff`,
        };
      });
      setRecentJobs(mappedJobs);
    }
  }, [jobTitles, dashboardStats]);

  const handleNavigate = (path, state = {}) => {
    const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/User';
    let finalPath = path;
    if (basePath === '/Admin' && path === '/user-upcoming-interview') {
      finalPath = '/admin-upcoming-interview';
    }
    navigate(`${basePath}${finalPath}`, { state });
  };

  const handleSubmissionAction = (candidateName, actionType, role) => {
    setToastMessage(`Candidate ${candidateName} ${actionType === 'accept' ? 'invited to interview' : 'declined'} for ${role}.`);
    setShowUploadedSuccess(true);
    setTimeout(() => setShowUploadedSuccess(false), 5000);
  };

  const triggerSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setToast("Hiring pipeline synchronized successfully.");
      setTimeout(() => setToast(null), 3000);
    }, 1000);
  };

  const QUICK_ACTIONS = [
    {
      title: "Review Pitches",
      desc: `${pendingReviewCount} submissions awaiting your approval.`,
      icon: <Inbox size={20} />,
      path: '/user-upload-talent',
    },
    {
      title: "Posted Jobs",
      desc: `${postedJobsCount} active vacancies - view status & applicants.`,
      icon: <Briefcase size={20} />,
      path: '/user-posted-jobs',
    },
    {
      title: "Active Projects",
      desc: `projects - track status & timelines.`,
      icon: <LayoutGrid size={20} />,
      path: '/user-posted-jobs',
    },
  ];

  const graphData =
    monthlyAnalytics?.data?.map((item) => ({
      month: item.monthName?.slice(0, 3),
      posted: Number(item.totalJobsPosted || 0),
      active: Number(item.activeJobs || 0),
    })) || [];

  const chartData = {
    labels: graphData.map((d) => d.month),
    datasets: [
      {
        label: " Posted Jobs",
        data: graphData.map((d) => d.posted),
        borderColor: "#5a5de8",
        backgroundColor: "rgba(90,93,232,0.12)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#fff",
        pointBorderColor: "#5a5de8",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "  Active Jobs",
        data: graphData.map((d) => d.active),
        borderColor: "#00b67a",
        backgroundColor: "rgba(0,182,122,0.12)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#fff",
        pointBorderColor: "#00b67a",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
        align: "end",
        labels: {
          usePointStyle: true,
          boxWidth: 6,
          font: {
            size: 11,
            family: "Inter",
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#94a3b8",
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          borderDash: [4, 4],
          color: "#f1f5f9",
        },
        ticks: {
          color: "#94a3b8",
        },
      },
    },
  };

  return (
    <div className="ai-dashboard-wrapper">

      {/* TOAST */}
      {toast && (
        <div className="ai-toast">
          <div className="pulse-dot"></div>
          {toast}
        </div>
      )}

      {showUploadedSuccess && (
        <div className="ai-toast">
          <div className="pulse-dot"></div>
          {toastMessage}
        </div>
      )}

      <Guide ref={guideRef} />

      <div className="hero-section-wrapper">
        <div className="hero-card">
          <div className="hero-concentric-lines"></div>
          <div className="hero-ripple-pattern"></div>
          <div className="hero-circular-highlights"></div>

          <div className="hero-left">
            <div className="hero-pill">
              ✦ Recruiter CONSOLE ACTIVE
            </div>
            <div className="hero-title-row">
              <h1>
                Welcome Back, {user}
              </h1>

              <div className="hero-buttons">
                <button
                  className="routine-btn"
                  onClick={() => handleNavigate('/user-post-new-positions')}
                >
                  <Plus size={16} />
                  Post New Job
                  <ArrowUpRight size={16} />
                </button>

                <button
                  className="routine-btn"
                  onClick={() => navigate('/User/active-routines')}
                >
                  View Active Routines
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </div>

            <div className="hero-content-row">
              <p>
                Your recruitment pipeline is calibrated and running. You have{" "}
                <strong>{postedJobsCount} active postings</strong> and{" "}
                <strong>{pendingReviewCount} bench submissions</strong> awaiting evaluation.
              </p>
            </div>
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

        {/* COPILOT CARD */}
        <div className="copilot-card">
          <div className="copilot-header">
            <div className="copilot-title-wrapper">
              <Sparkles size={16} className="copilot-sparkles-icon" />
              <span className="copilot-title">AI Agent</span>
              <span className="copilot-beta-badge">Beta</span>
            </div>
          </div>

          <div className="copilot-body">
            <p className="copilot-text">
              I detected <strong>{pendingReviewCount} pending submissions</strong><br /> for your review.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <button
                className="copilot-action-btn"
                onClick={() => toastify.info("This feature is currently under development.")}
              >
                Review Matches
              </button>
            </div>
          </div>

          <div className="copilot-bot-illustration">
            <img src="/Images/AI-Bot.png" alt="AI Copilot Bot" className="copilot-bot-image" />
            <div className="copilot-glow-bg"></div>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      {/* <div className="command-card">
        <div className="command-title">
          <Command size={14} className="command-title-icon" />
          <span>INTERACTIVE RECRUITMENT COMMAND INTERFACE</span>
        </div>

        <div className="command-search">
          <Search size={18} className="command-search-icon" />
          <input
            type="text"
            placeholder="Type a job, candidate, or action e.g. 'Show candidates for Cloud Solutions Engineer'..."
          />
          <button>
            Ask AI
            <Send size={13} />
          </button>
        </div>

        <div className="prompt-row">
          <span className="prompt-label">Quick Prompts:</span>
          <span>Find React developers with 5+ years</span>
          <span>Show pending submissions</span>
          <span>Active job postings summary</span>
        </div>
      </div> */}

      {/* STATS */}
      <div className="stats-grid">

        {/* CARD 1 */}
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon-title-container">
              <div className="stat-card-icon-box stat-purple">
                <Briefcase size={18} />
              </div>
              <div className="stat-card-title-number">
                <span className="stat-card-title">Jobs Posted</span>
                <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                  <span className="stat-card-number">{postedJobsCount}</span>
                  <div className="stat-card-change">
                    <span className="stat-card-percentage stat-text-purple">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="stat-card-sparkline">
            <Line options={sparklineOptions} data={sparklineData1} />
          </div>
        </div>

        {/* CARD 2 */}
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon-title-container">
              <div className="stat-card-icon-box stat-blue">
                <LayoutGrid size={18} />
              </div>
              <div className="stat-card-title-number">
                <span className="stat-card-title">Active Projects</span>
                <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                  <span className="stat-card-number">{activeProjectsCount}</span>
                  <div className="stat-card-change">
                    <span className="stat-card-percentage stat-text-blue">Live</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="stat-card-sparkline">
            <Line options={sparklineOptions} data={sparklineData2} />
          </div>
        </div>

        {/* CARD 3 */}
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon-title-container">
              <div className="stat-card-icon-box stat-orange">
                <Inbox size={18} />
              </div>
              <div className="stat-card-title-number">
                <span className="stat-card-title">Pitches to Review</span>
                <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                  <span className="stat-card-number">{pendingReviewCount}</span>
                  <div className="stat-card-change">
                    <span className="stat-card-percentage stat-text-orange">{pendingReviewCount > 0 ? 'Pending' : 'Clear'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="stat-card-sparkline">
            <Line options={sparklineOptions} data={sparklineData3} />
          </div>
        </div>

        {/* CARD 4 */}
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon-title-container">
              <div className="stat-card-icon-box stat-green">
                <ShieldCheck size={18} />
              </div>
              <div className="stat-card-title-number">
                <span className="stat-card-title">Hiring Health</span>
                <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                  <span className="stat-card-number">{hiringHealth}%</span>
                  <div className="stat-card-change">
                    <span className="stat-card-percentage stat-text-green">+{Math.max(0, hiringHealth - 75)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="stat-card-sparkline">
            <Line options={sparklineOptions} data={sparklineData4} />
          </div>
        </div>

        {/* CARD 5 */}
        <div
          className="stat-card action-card"
          onClick={() => handleNavigate('/user-upcoming-interview', { openDrawer: true })}
        >
          <div className="action-card-content">
            <div className="stat-card-icon-box stat-orange action-icon-box">
              <Calendar size={22} />
            </div>
            <span className="action-card-title">Schedule Interview</span>
            <span className="action-card-desc">Coordinate calendar slots</span>
            <div className="action-card-arrow-wrapper">
              <ArrowRight size={18} className="action-card-arrow" />
            </div>
          </div>
          <div className="stat-bg-icon stat-text-orange">
            <Calendar size={120} />
          </div>
        </div>

      </div>

      <div className="chart-log-row">

        <div className="graph-card">
          <div className="graph-header">
            <div>
              <h3 className="graph-title">
                Hiring Activity Velocity Index
              </h3>
              <p className="graph-subtitle">
                Real-time mapping of applicant pipelines & revenue capture
              </p>
            </div>
          </div>
          <div
            className="graph-area"
            style={{
              height: "320px",
              padding: "10px",
            }}
          >
            <Line
              data={chartData}
              options={chartOptions}
            />
          </div>

          <div className="graph-footer">
            <div>
              <span>AVG RECRUITMENT CYCLE</span>
              <strong className="graph-footer-jobs" style={{ color: '#475569' }}>11.4 Days</strong>
            </div>
            <div>
              <span>ACTIVE POSTINGS</span>
              <strong className="graph-footer-resumes">{postedJobsCount} Jobs</strong>
            </div>
            <div>
              <span>HIRING HEALTH INDEX</span>
              <strong className="graph-footer-growth">{hiringHealth}% Score</strong>
            </div>
          </div>
        </div>

        {/* ACTIVITY LOG */}
        <div className="log-card">
          <div className="log-header">
            <div>
              <h3 className="log-title">Active Pitched Submissions</h3>
              <p className="log-subtitle">Live submissions from bench sales</p>
            </div>
            <Activity size={18} />
          </div>

          <div className="log-list">
            {recentJobs.length > 0 ? (
              recentJobs.map((job, idx) => (
                <div className={`log-item theme-${idx % 4}`} key={job.id || idx}>
                  <div className="log-item-left">
                    <span className="log-tag">{job.company || 'Company'}</span>
                    <p className="log-message">
                      <strong>{job.title}</strong>{job.location ? ` · ${job.location}` : ''}{job.salary ? ` - ${job.salary}` : ''}
                    </p>
                  </div>
                  <small className="log-time">Active</small>
                </div>
              ))
            ) : (
              <>
                <div className="log-item theme-0">
                  <div className="log-item-left">
                    <span className="log-tag">Pipeline</span>
                    <p className="log-message">No active submissions yet. Post jobs to attract candidates.</p>
                  </div>
                  <small className="log-time">Live</small>
                </div>
              </>
            )}
          </div>

          <div className="security-box">
            <span className="security-text">✓ Recruitment pipeline compliant</span>
            <strong className="security-status">EXCELLENT</strong>
          </div>
        </div>

      </div>

      {/* QUICK ACTIONS */}
      <div className="quick-card">
        <div className="quick-header">
          <div>
            <h3 className="quick-title">
              Quick Action Command Console
            </h3>
            <p className="quick-desc">
              Launch hiring workflows and calibration flows instantly
            </p>
          </div>
        </div>

        <div className="quick-grid">
          {QUICK_ACTIONS.map((item, index) => (
            <div
              className="quick-item"
              key={index}
              onClick={() => handleNavigate(item.path)}
            >
              <div className="quick-icon">
                {item.icon}
              </div>
              <div className="quick-content">
                <h4 className="quick-item-title">{item.title}</h4>
                <p className="quick-item-desc">{item.desc}</p>
              </div>
              <div className="quick-arrow">
                <ArrowUpRight size={18} />
              </div>
            </div>
          ))}
        </div>
      </div>



      {/* Upload Talent Modal */}
      <UploadTalentModal
        show={showUploadModal}
        hideButton={true}
        onHide={() => setShowUploadModal(false)}
        onSuccess={(msg) => {
          setToastMessage(msg);
          setShowUploadedSuccess(true);
          setShowUploadModal(false);
          setTimeout(() => setShowUploadedSuccess(false), 5000);
        }}
      />
    </div>
  );
};

export default HiringManagerDashboard;
