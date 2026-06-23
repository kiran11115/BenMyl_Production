import React, { useRef, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Users,
  FileText,
  Info,
  Search,
  ArrowRight,
  Activity,
  Upload,
  Calendar,
  Clock,
  ChevronRight,
  TrendingUp,
  CheckSquare,
  RefreshCw,
  ArrowUpRight,
  Send,
  Command,
  Layers3,
  Sparkles,
} from "lucide-react";
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
import UploadTalentTable from "../UploadTalent/UploadTalentTable";
import UploadTalentModal from "../UploadTalent/UploadTalentModal";
import { useGetQueueManagementMutation, useGetMyBenchMutation } from "../../State-Management/Api/UploadResumeApiSlice";
import { useGetFindJobsMutation } from "../../State-Management/Api/ProjectApiSlice";
import { CandidateCard } from "../UploadTalent/UserTalentGrid";
import Guide from "../Guide/Guide";
import "../Admin/Modules/AdminDashboard/AdminDashboard.css";
import { useGetMonthlyAnalyticsQuery } from "../../State-Management/Api/DashboardApiSlice";

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, Filler);

const matchedJobs = [
  { id: 1, title: "Senior React Developer", company: "Meta Systems", location: "Remote", type: "Full-time", salary: "$140k - $180k", experience: "5+ Years" },
  { id: 2, title: "Frontend Architect", company: "CloudScale", location: "San Francisco", type: "Contract", salary: "$90/hr", experience: "8+ Years" },
  { id: 3, title: "UI Engineer", company: "Designly", location: "New York", type: "Full-time", salary: "$120k - $150k", experience: "3+ Years" },
];

const earningsData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [{
    label: " Earnings",
    data: [30000, 45000, 42000, 60000, 55000, 75000],
    borderColor: "#3b82f6",
    backgroundColor: "rgba(59, 130, 246, 0.05)",
    fill: true,
    tension: 0.4,
    pointRadius: 0,
    borderWidth: 2,
  }],
};

const earningsOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { enabled: true } },
  scales: {
    x: { display: false },
    y: { display: false }
  }
};

const utilizationData = {
  labels: ["Utilized", "Available"],
  datasets: [{
    data: [75, 25],
    backgroundColor: ["#f5810c", "#f1f5f9"],
    borderWidth: 0,
    hoverOffset: 4
  }]
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

const getInitials = (name = "") => {
  return name.split(" ").filter(Boolean).slice(0, 2).map((n) => n[0].toUpperCase()).join("");
};

const BenchSalesDashboard = () => {
  const navigate = useNavigate();
  const guideRef = useRef();
  const [activeMetric, setActiveMetric] = useState('earnings'); // 'earnings' or 'utilization'
  const [pendingReviewCount, setPendingReviewCount] = useState(0);
  const [totalTalentCount, setTotalTalentCount] = useState(0);
  const [matchedJobsCount, setMatchedJobsCount] = useState(0);
  const [realMatchedJobs, setRealMatchedJobs] = useState([]);
  const [dashboardTalent, setDashboardTalent] = useState([]);
  const [pendingTalent, setPendingTalent] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showUploading, setShowUploading] = useState(false);
  const [showUploadedSuccess, setShowUploadedSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [toast, setToast] = useState(null);
  const user = localStorage.getItem("UserName") || "User";
  const [getQueueManagement] = useGetQueueManagementMutation();
  const [getMyBench] = useGetMyBenchMutation();
  const [getTalentJobs, { isLoading: isJobsLoading }] = useGetFindJobsMutation();
  const { data: analyticsData } = useGetMonthlyAnalyticsQuery();

  const sparklineData1 = useMemo(() => createSparklineData('#8b5cf6', 'rgba(139, 92, 246, 0.15)', 'rgba(139, 92, 246, 0)', [10, 20, 15, 25, 20, 30]), []);
  const sparklineData2 = useMemo(() => createSparklineData('#3b82f6', 'rgba(59, 130, 246, 0.15)', 'rgba(59, 130, 246, 0)', [15, 18, 20, 22, 25, 28]), []);
  const sparklineData3 = useMemo(() => createSparklineData('#10b981', 'rgba(16, 185, 129, 0.15)', 'rgba(16, 185, 129, 0)', [20, 25, 28, 30, 35, 40]), []);
  const sparklineData4 = useMemo(() => createSparklineData('#06b6d4', 'rgba(6, 182, 212, 0.15)', 'rgba(6, 182, 212, 0)', [10, 15, 20, 25, 22, 30]), []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const companyId = localStorage.getItem("logincompanyid");
        const companyIdNum = Number(companyId);

        // 1. Fetch Pending Review Count & Talent
        const pendingPayload = {
          companyid: companyIdNum,
          pageNumber: 1,
          pageSize: 1000,
          filters: [],
        };
        const pendingRes = await getQueueManagement(pendingPayload).unwrap();
        if (Array.isArray(pendingRes)) {
          const pendingList = pendingRes.filter(item => item.status === "Pending For Review");
          setPendingReviewCount(pendingList.length);
          setPendingTalent(pendingList.slice(0, 3).map(item => ({
            id: item.resumeID,
            name: item.resumeName,
            role: item.jobTitle,
            experience: item.yearsOfExperience,
            location: item.location,
            uploadedByName: item.uploadedBy,
            status: item.status,
            avatar: `https://ui-avatars.com/api/?name=${item.resumeName}&background=3b82f6&color=fff`,
          })));
        }

        // 2. Fetch Total Talent Count & Dashboard Talent
        const benchPayload = {
          companyid: companyIdNum,
          pageNumber: 1,
          pageSize: 1000,
          filters: [],
        };
        const benchRes = await getMyBench(benchPayload).unwrap();
        if (Array.isArray(benchRes)) {
          setTotalTalentCount(benchRes.length);
          const mappedTalent = benchRes.slice(0, 4).map(item => ({
            id: item.resumeID,
            name: item.resumeName,
            role: item.jobTitle,
            experience: item.yearsOfExperience,
            location: item.location,
            uploadedByName: item.uploadedBy,
            verified: true,
            avatar: `https://ui-avatars.com/api/?name=${item.resumeName}&background=f5810c&color=fff`,
          }));
          setDashboardTalent(mappedTalent);
        }

        // 3. Fetch Real Job Matches & Total Count
        const jobsPayload = {
          ComponyID: companyIdNum,
          pageNumber: 1,
          pageSize: 1000,
          filters: [],
        };
        const jobsRes = await getTalentJobs(jobsPayload).unwrap();
        if (Array.isArray(jobsRes)) {
          setMatchedJobsCount(jobsRes.length);
          const mapped = jobsRes.slice(0, 3).map(job => ({
            id: job.jobID,
            title: job.jobTitle,
            company: job.companyName,
            location: job.location,
            experience: job.experienceLevel || job.yearsOfExperience,
            salary: job.salaryRange_Min && job.salaryRange_Max
              ? `$${job.salaryRange_Min}-${job.salaryRange_Max}`
              : job.salaryRange_Min ? `$${job.salaryRange_Min}` : "N/A",
            type: job.employeeType || job.workModels,
            department: job.department,
            avatar: `https://ui-avatars.com/api/?name=${job.companyName}&background=3b82f6&color=fff`,
          }));
          setRealMatchedJobs(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      }
    };
    fetchDashboardData();
  }, [getQueueManagement, getMyBench, getTalentJobs]);

  const handleNavigate = (path) => {
    const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/User';
    let finalPath = path;
    if (basePath === '/Admin' && path === '/user-upcoming-interview') {
      finalPath = '/admin-upcoming-interview';
    }
    navigate(`${basePath}${finalPath}`);
  };

  const handlePitchCandidate = (candidateName, jobTitle, company) => {
    setToastMessage(`Pitch initiated - structuring placement package for ${candidateName} at ${company} for ${jobTitle}.`);
    setShowUploadedSuccess(true);
    setTimeout(() => setShowUploadedSuccess(false), 5000);
  };

  const triggerSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setToast("Bench pipeline synchronized successfully.");
      setTimeout(() => setToast(null), 3000);
    }, 1000);
  };

  const QUICK_ACTIONS = [
    {
      title: "Upload Resumes",
      desc: "Parse and add candidate files to the bench pool.",
      icon: <Upload size={20} />,
      onClick: () => handleNavigate('/user-upload-talent'),
    },
    {
      title: "Review Queue",
      desc: `Audit ${pendingReviewCount} resumes pending AI processing.`,
      icon: <CheckSquare size={20} />,
      onClick: () => navigate(
        `${window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/User'}/user-upload-talent`,
        { state: { activeTab: "Review" } }
      ),
    },
    {
      title: "Discover Vacancies",
      desc: `Browse ${matchedJobsCount} auto-matched client positions.`,
      icon: <Search size={20} />,
      onClick: () => handleNavigate('/user-Jobs'),
    },
    {
      title: "Scheduled Interviews",
      desc: "Explore and find your scheduled interviews.",
      icon: <Users size={20} />,
      onClick: () => handleNavigate('/user-upcoming-interview'),
    },
  ];

  const graphData = useMemo(() => {
    return analyticsData?.data?.map((item) => ({
      month: item.monthName?.slice(0, 3),
      uploads: Number(item.resumeUploads || 0),
      reviews: Number(item.reviews || 0),
    })) || [];
  }, [analyticsData]);

  const chartData = {
    labels: graphData.map((d) => d.month),
    datasets: [
      {
        label: " Resume Uploads",
        data: graphData.map((d) => d.uploads),
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
        label: " Reviews",
        data: graphData.map((d) => d.reviews),
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

      {/* UPLOADING OVERLAY (preserved) */}
      {showUploading && (
        <div className="uploading-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20000 }}>
          <div style={{ background: 'white', padding: 24, borderRadius: 16, textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div className="spinner" style={{ width: 32, height: 32, border: '3px solid #f5810c', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
            <div style={{ fontWeight: 700, fontSize: '15px', color: '#1e293b' }}>Uploading Resumes</div>
          </div>
        </div>
      )}

      <div className="hero-section-wrapper">
        <div className="hero-card">
          <div className="hero-concentric-lines"></div>
          <div className="hero-ripple-pattern"></div>
          <div className="hero-circular-highlights"></div>

          <div className="hero-left">
            <div className="hero-pill">
              ✦ BENCH SALES LEAD CONSOLE ACTIVE
            </div>
            <div className="hero-title-row">
              <h1>
                Welcome Back, {user}
              </h1>

              <div className="hero-buttons">
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
                Your bench sales channel is active. You have{" "}
                <strong>{totalTalentCount} available candidates</strong> and{" "}
                <strong>{matchedJobsCount} matched vacancies</strong> ready for submission.
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
              I found <strong>{matchedJobsCount} matched vacancies</strong><br /> for your bench candidates.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <button
                className="copilot-action-btn"
                onClick={() => handleNavigate('/user-Jobs')}
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
          <span>INTERACTIVE BENCH SALES COMMAND INTERFACE</span>
        </div>

        <div className="command-search">
          <Search size={18} className="command-search-icon" />
          <input
            type="text"
            placeholder="Type a candidate, job, or action e.g. 'Show React developers available for contract roles'..."
          />
          <button>
            Ask AI
            <Send size={13} />
          </button>
        </div>

        <div className="prompt-row">
          <span className="prompt-label">Quick Prompts:</span>
          <span>Find React developers with 5+ years</span>
          <span>Show pending resume queue</span>
          <span>Generate vendor report</span>
          <span>Predict placement closure rate</span>
        </div>
      </div> */}

      {/* STATS */}
      <div className="stats-grid">

        {/* CARD 1 */}
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon-title-container">
              <div className="stat-card-icon-box stat-purple">
                <Users size={18} />
              </div>
              <div className="stat-card-title-number">
                <span className="stat-card-title">Total on Bench</span>
                <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                  <span className="stat-card-number">{totalTalentCount}</span>
                  <div className="stat-card-change">
                    <span className="stat-card-percentage stat-text-purple">+{totalTalentCount}</span>
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
                <FileText size={18} />
              </div>
              <div className="stat-card-title-number">
                <span className="stat-card-title">Resumes Awaiting</span>
                <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                  <span className="stat-card-number">{pendingReviewCount}</span>
                  <div className="stat-card-change">
                    <span className="stat-card-percentage stat-text-blue">{pendingReviewCount > 0 ? 'Review' : 'Clear'}</span>
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
                <Briefcase size={18} />
              </div>
              <div className="stat-card-title-number">
                <span className="stat-card-title">Vacancies Found</span>
                <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                  <span className="stat-card-number">{matchedJobsCount}</span>
                  <div className="stat-card-change">
                    <span className="stat-card-percentage stat-text-orange">+{matchedJobsCount}</span>
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
                <Sparkles size={18} />
              </div>
              <div className="stat-card-title-number">
                <span className="stat-card-title">Match Rate</span>
                <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                  <span className="stat-card-number">95%</span>
                  <div className="stat-card-change">
                    <span className="stat-card-percentage stat-text-green">+4.1%</span>
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
            onClick={() => handleNavigate('/user-upload-talent')}
        >
            <div className="action-card-content">
                <div className="stat-card-icon-box stat-orange action-icon-box">
                    <Upload size={22}/>
                </div>
                <span className="action-card-title">Upload Talent</span>
                <span className="action-card-desc">Add candidates to bench</span>
                <div className="action-card-arrow-wrapper">
                    <ArrowRight size={18} className="action-card-arrow" />
                </div>
            </div>
            <div className="stat-bg-icon stat-text-orange">
                <Upload size={120} />
            </div>
        </div>

      </div>

      <div className="chart-log-row">

        <div className="graph-card">
          <div className="graph-header">
            <div>
              <h3 className="graph-title">
                Bench Placement Velocity Index
              </h3>
              <p className="graph-subtitle">
                Real-time mapping of candidate pipelines & placement revenue
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
              <span>TOTAL ON BENCH</span>
              <strong className="graph-footer-jobs" style={{ color: '#475569' }}>{totalTalentCount} Candidates</strong>
            </div>
            <div>
              <span>RESUME UPLOADS</span>
              <strong className="graph-footer-resumes">{graphData.reduce((a, b) => a + b.uploads, 0)}</strong>
            </div>
            <div>
              <span>TOTAL REVIEWS</span>
              <strong className="graph-footer-growth">{graphData.reduce((a, b) => a + b.reviews, 0)}</strong>
            </div>
          </div>
        </div>

        {/* ACTIVITY LOG */}
        <div className="log-card">
          <div className="log-header">
            <div>
              <h3 className="log-title">Recommended Placements</h3>
              <p className="log-subtitle">
                Live vacancy matches for bench candidates
              </p>
            </div>
            <Activity size={18} />
          </div>

          <div className="log-list">
            {isJobsLoading ? (
              <div className="log-item theme-0">
                <div className="log-item-left">
                  <span className="log-tag">Loading...</span>
                  <p className="log-message">Fetching matched vacancies...</p>
                </div>
              </div>
            ) : realMatchedJobs.length > 0 ? (
              realMatchedJobs.map((job, idx) => (
                <div className={`log-item theme-${idx % 4}`} key={job.id || idx}>
                  <div className="log-item-left">
                    <span className="log-tag">{job.company}</span>
                    <p className="log-message">
                      <strong>{job.title}</strong>
                      {job.location ? ` · ${job.location}` : ''}
                      {job.salary ? ` - ${job.salary}` : ''}
                    </p>
                  </div>
                  <small className="log-time">95% Match</small>
                </div>
              ))
            ) : (
              <div className="log-item theme-0">
                <div className="log-item-left">
                  <span className="log-tag">Pipeline</span>
                  <p className="log-message">No active recommended placements. Add profiles to trigger matches.</p>
                </div>
                <small className="log-time">Live</small>
              </div>
            )}
          </div>

          <div className="security-box">
            <span className="security-text">✓ Bench pipeline AI compliant</span>
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
              Launch bench workflows and placement flows instantly
            </p>
          </div>
        </div>

        <div className="quick-grid">
          {QUICK_ACTIONS.map((item, index) => (
            <div
              className="quick-item"
              key={index}
              onClick={item.onClick}
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

      {/* PENDING PARSER AUDIT QUEUE */}
      <div className="quick-card" style={{ marginTop: 22 }}>
        <div className="quick-header">
          <div className="d-flex justify-content-between align-items-center w-100">
            <div className="d-flex flex-column">
            <h3 style={{ fontSize: '14px', marginBottom: 0 }}>
              Pending Parser Auditing Queue
            </h3>
            <p style={{ fontSize: '12px', marginTop: 0 }}>
              Resumes awaiting AI processing and review
            </p>
            </div>
            <button
              onClick={() => handleNavigate('/user-upload-talent')}
              style={{ background: '#5a5de8', border: 'none', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              Manage Queue <ArrowUpRight size={13} />
            </button>
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <UploadTalentTable
            isDashboard={true}
            statusFilter="Pending For Review"
            refreshKey={refreshKey}
            onDeleted={() => setRefreshKey(prev => prev + 1)}
          />
        </div>
      </div>

      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

const SparklePulse = () => {
  return (
    <span className="toast-sparkle-dot">
      <span className="toast-sparkle-ping"></span>
    </span>
  );
};

export default BenchSalesDashboard;
