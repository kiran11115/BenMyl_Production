import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { useGetQueueManagementMutation, useGetMyBenchMutation } from "../../State-Management/Api/UploadResumeApiSlice";
import { useGetGroupedJobTitlesQuery } from "../../State-Management/Api/TalentPoolApiSlice";
import { CandidateCard } from "../UploadTalent/UserTalentGrid";
import Guide from "../Guide/Guide";
import UploadTalentModal from "../UploadTalent/UploadTalentModal";
import "../Admin/Modules/AdminDashboard/AdminDashboard.css";
import { useGetPostedMonthlyAnalyticsQuery } from "../../State-Management/Api/DashboardApiSlice";

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
    label: "Earnings",
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
    label: "Applications",
    data: [26, 35, 40, 32, 50, 60, 55],
    borderWidth: 2,
    tension: 0.4,
    fill: true,
    borderColor: "#3b82f6",
    backgroundColor: "rgba(59, 130, 246, 0.1)",
  }],
};

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
  const { data: jobTitles = [] } = useGetGroupedJobTitlesQuery(userId);
  const [dashboardProjects, setDashboardProjects] = useState([]);
  const [getQueueManagement] = useGetQueueManagementMutation();
  const [getMyBench] = useGetMyBenchMutation();
  const { data: monthlyAnalytics } = useGetPostedMonthlyAnalyticsQuery(undefined,{refetchOnMountOrArgChange:true});

  useEffect(() => {
    setPostedJobsCount(Array.isArray(jobTitles) ? jobTitles.length : 0);
    
    // Calculate Project Data
    const customProjects = JSON.parse(localStorage.getItem("customProjects") || "[]");
    const mockProjects = [
      { status: "Completed", budget: 45000 },
      { status: "In Progress", budget: 85000 },
      { status: "Awaiting Review", budget: 120000 },
    ];
    const allProjects = [...mockProjects, ...customProjects];
    
    setActiveProjectsCount(allProjects.filter(p => p.status === "In Progress").length);
    
    // Map jobTitles to projects for the dashboard
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

    const revenue = allProjects
      .filter(p => p.status === "Completed")
      .reduce((sum, p) => sum + (typeof p.budget === 'string' ? parseFloat(p.budget.replace(/[^0-9.]/g, '')) : p.budget || 0), 0);
    setTotalRevenue(revenue);

    const fetchDashboardData = async () => {
      try {
        const companyIdNum = Number(userId);
        
        // 1. Fetch Pending Review Count
        const pendingPayload = {
            companyid: companyIdNum,
            pageNumber: 1,
            pageSize: 1000,
            filters: [],
        };
        const pendingRes = await getQueueManagement(pendingPayload).unwrap();
        const pendingCount = Array.isArray(pendingRes) ? pendingRes.filter(item => item.status === "Pending For Review").length : 0;
        setPendingReviewCount(pendingCount);

        // 2. Fetch Recent Jobs for Parity
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

        // 3. Calculate Hiring Health
        // If pending is low relative to total, health is higher
        const totalTalentRes = await getMyBench({ companyid: companyIdNum, pageNumber: 1, pageSize: 10 }).unwrap();
        const totalTalent = Array.isArray(totalTalentRes) ? totalTalentRes.length : 10;
        const health = Math.max(60, Math.min(98, 100 - (pendingCount / (totalTalent || 1) * 100)));
        setHiringHealth(Math.round(health));

      } catch (err) {
        console.error("Dashboard data fetch error", err);
      }
    };
    fetchDashboardData();
  }, [jobTitles, userId, getQueueManagement, getMyBench]);

  const handleNavigate = (path) => {
    const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/User';
    let finalPath = path;
    if (basePath === '/Admin' && path === '/user-upcoming-interview') {
      finalPath = '/admin-upcoming-interview';
    }
    navigate(`${basePath}${finalPath}`);
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
      desc: `${postedJobsCount} active vacancies — view status & applicants.`,
      icon: <Briefcase size={20} />,
      path: '/user-posted-jobs',
    },
    {
      title: "Active Projects",
      desc: `${activeProjectsCount} projects — track status & timelines.`,
      icon: <LayoutGrid size={20} />,
      path: '/user-projects',
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
      label: "Posted Jobs",
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
      label: "Active Jobs",
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

      <div className="hero-card">
        <LayoutGrid 
          size={240} 
          strokeWidth={0.5} 
          style={{
            position: 'absolute',
            right: '30%',
            top: '50%',
            transform: 'translateY(-50%) rotate(-10deg)',
            color: '#ffffff',
            opacity: 0.04,
            zIndex: 1,
            pointerEvents: 'none'
          }}
        />
        <div className="hero-left">
          <div className="hero-pill">
            ✦ HIRING MANAGER CONSOLE ACTIVE
          </div>
          <h1 style={{ fontSize: '30px' }}>
            Welcome Back, {user}
          </h1>
          <p style={{ fontSize: '14px' }}>
            Your recruitment pipeline is calibrated and running. You have{" "}
            <strong>{postedJobsCount} active postings</strong> and{" "}
            <strong>{pendingReviewCount} bench submissions</strong> awaiting evaluation.
          </p>
        </div>

        <div className="hero-buttons">
          <button
            className="launch-btn"
            onClick={triggerSync}
          >
            <RefreshCw
              size={16}
              className={syncing ? "spin-icon" : ""}
            />
            {syncing ? "Syncing..." : "Sync Pipeline"}
          </button>

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

      {/* SEARCH */}
      <div className="command-card">
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
      </div>

      {/* STATS */}
      <div className="stats-grid">

        {/* CARD 1 */}
        <div className="stat-card">
          <div className="stat-header-row">
            <div className="stat-title">Jobs Posted</div>
            <div className="stat-icon-box">
              <Briefcase size={16} />
            </div>
          </div>
          <div className="stat-number">{postedJobsCount}</div>
          <div className="stat-footer-row">
            <span>Active vacancies open</span>
          </div>
          <div className="green-badge">Active</div>
          <div className="stat-bottom-link" style={{ cursor: 'pointer' }} onClick={() => handleNavigate('/user-posted-jobs')}>
            ↗ View Jobs
          </div>
        </div>

        {/* CARD 2 */}
        <div className="stat-card">
          <div className="stat-header-row">
            <span className="stat-title">Active Projects</span>
            <div className="stat-icon-box">
              <LayoutGrid size={16} />
            </div>
          </div>
          <div className="stat-number">{activeProjectsCount}</div>
          <div className="stat-footer-row">
            <span>Projects in progress</span>
          </div>
          <div className="green-badge">Live</div>
          <div className="stat-bottom-link" style={{ cursor: 'pointer' }} onClick={() => handleNavigate('/user-projects')}>
            ↗ View Projects
          </div>
        </div>

        {/* CARD 3 */}
        <div className="stat-card">
          <div className="stat-header-row">
            <span className="stat-title">Pitches to Review</span>
            <div className="stat-icon-box">
              <Inbox size={16} />
            </div>
          </div>
          <div className="stat-number">{pendingReviewCount}</div>
          <div className="stat-footer-row">
            <span>Awaiting evaluation</span>
          </div>
          <div className="green-badge" style={{ background: pendingReviewCount > 0 ? '#fff3e0' : '#e8fbf1', color: pendingReviewCount > 0 ? '#f5810c' : '#00b67a' }}>
            {pendingReviewCount > 0 ? 'Pending' : 'Clear'}
          </div>
          <div className="stat-bottom-link" style={{ cursor: 'pointer' }} onClick={() => handleNavigate('/user-upload-talent')}>
            ↗ Review Now
          </div>
        </div>

        {/* CARD 4 */}
        <div className="stat-card">
          <div className="stat-header-row">
            <span className="stat-title">Hiring Health</span>
            <div className="stat-icon-box">
              <ShieldCheck size={16} />
            </div>
          </div>
          <div className="stat-number">{hiringHealth}%</div>
          <div className="stat-footer-row">
            <span>SLA performance score</span>
          </div>
          <div className="green-badge">+{Math.max(0, hiringHealth - 75)}%</div>
          <div className="stat-bottom-link">
            ↗ Optimal Flow
          </div>
        </div>

      </div>

      {/* CHART SECTION */}
      <div className="chart-grid">

        <div className="graph-card">
          <div className="graph-header">
            <div>
              <h3 style={{ fontSize: '14px', marginBottom: 0 }}>
                Hiring Activity Velocity Index
              </h3>
              <p style={{ fontSize: '12px', marginTop: 0 }}>
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
              <strong style={{ fontSize: 14 }}>11.4 Days</strong>
            </div>
            <div>
              <span>ACTIVE POSTINGS</span>
              <strong style={{ fontSize: 14, color: '#5B5BD6' }}>{postedJobsCount} Jobs</strong>
            </div>
            <div>
              <span>HIRING HEALTH INDEX</span>
              <strong style={{ fontSize: 14, color: '#009966' }}>{hiringHealth}% Score</strong>
            </div>
          </div>
        </div>

        {/* ACTIVITY LOG */}
        <div className="log-card">
          <div className="log-header">
            <div>
              <h3 style={{ fontSize: '14px', marginBottom: 0 }}>Active Pitched Submissions</h3>
              <p style={{ fontSize: '12px', marginTop: 0 }}>Live submissions from bench sales</p>
            </div>
            <Activity size={18} />
          </div>

          <div className="log-list">
            {recentJobs.length > 0 ? (
              recentJobs.map((job, idx) => (
                <div className="log-item" key={job.id || idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="log-tag">{job.company || 'Company'}</span>
                    <small style={{ fontSize: 11 }}>Active</small>
                  </div>
                  <p style={{ fontSize: '11px' }}>
                    <strong>{job.title}</strong>{job.location ? ` · ${job.location}` : ''}{job.salary ? ` — ${job.salary}` : ''}
                  </p>
                </div>
              ))
            ) : (
              <>
                <div className="log-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="log-tag">Pipeline</span>
                    <small style={{ fontSize: 11 }}>Live</small>
                  </div>
                  <p style={{ fontSize: '11px' }}>No active submissions yet. Post jobs to attract candidates.</p>
                </div>
              </>
            )}
          </div>

          <div className="security-box">
            <span style={{ fontSize: 11 }}>✓ Recruitment pipeline compliant</span>
            <strong style={{ fontSize: 10 }}>EXCELLENT</strong>
          </div>
        </div>

      </div>

      {/* QUICK ACTIONS */}
      <div className="quick-card">
        <div className="quick-header">
          <div>
            <h3 style={{ fontSize: '14px', marginBottom: 0 }}>
              Quick Action Command Console
            </h3>
            <p style={{ fontSize: '12px', marginTop: 0 }}>
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
              <h4 style={{ fontSize: 12, marginBottom: 0 }}>
                {item.title}
              </h4>
              <p style={{ fontSize: 10, marginTop: 0 }}>
                {item.desc}
              </p>
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
