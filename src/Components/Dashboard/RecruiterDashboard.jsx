import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import "./BentoDashboard.css";
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
import { Briefcase, Users, FileText, Info, Activity, LayoutGrid, Clock, Calendar, TrendingUp, ChevronRight, MapPin, ShieldCheck, Inbox, CheckSquare, ArrowRight, Plus, Upload } from "lucide-react";
import ProjectsSection from "./ProjectsSection";
import HiringPipelineChart from "./charts/HiringPipelineChart";
import InterviewsList from "./InterviewsList";
import { useGetQueueManagementMutation, useGetMyBenchMutation } from "../../State-Management/Api/UploadResumeApiSlice";
import { useGetGroupedJobTitlesQuery } from "../../State-Management/Api/TalentPoolApiSlice";
import { CandidateCard } from "../UploadTalent/UserTalentGrid";
import Guide from "../Guide/Guide";
import UploadTalentModal from "../UploadTalent/UploadTalentModal";
import { useSchedulesDetailsBenchsalesQuery, useSchedulesDetailsQuery } from "../../State-Management/Api/ScheduleInterviewApiSlice";

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

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const guideRef = useRef();
  const [postedJobsCount, setPostedJobsCount] = useState(0);
  const [activeProjectsCount, setActiveProjectsCount] = useState(0);
  const [pendingReviewCount, setPendingReviewCount] = useState(0);
  const [scheduledInterviewsCount, setScheduledInterviewsCount] = useState(0);
  const [recentJobs, setRecentJobs] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [hiringHealth, setHiringHealth] = useState(75);
  const [activeMetric, setActiveMetric] = useState('earnings');
  const [toastMessage, setToastMessage] = useState("");
  const [showUploadedSuccess, setShowUploadedSuccess] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const user = localStorage.getItem("UserName") || "User";
  const userId = localStorage.getItem("CompanyId");
  const { data: jobTitles = [] } = useGetGroupedJobTitlesQuery(userId);
  const [dashboardProjects, setDashboardProjects] = useState([]);
  const [getQueueManagement] = useGetQueueManagementMutation();
  const [getMyBench] = useGetMyBenchMutation();
  const userRole = localStorage.getItem("Role");

const isBenchsales = userRole === "Benchsales";
const isRecruiter2 = userRole === "Recruiter2";

const isAdmin =
  userRole === "Admin" ||
  window.location.pathname
    .toLowerCase()
    .startsWith('/admin');

const shouldFetchBoth =
  isRecruiter2 || isAdmin;

const shouldFetchNormal =
  !isBenchsales || shouldFetchBoth;

const shouldFetchBench =
  isBenchsales || shouldFetchBoth;

const {
  data: apiInterviewsNormal = []
} = useSchedulesDetailsQuery(userId, {
  skip: !userId || !shouldFetchNormal,
  refetchOnMountOrArgChange: true
});

const {
  data: apiInterviewsBench = []
} = useSchedulesDetailsBenchsalesQuery(userId, {
  skip: !userId || !shouldFetchBench,
  refetchOnMountOrArgChange: true
});

let apiInterviews = [];

if (shouldFetchBoth) {
  apiInterviews = [
    ...apiInterviewsNormal,
    ...apiInterviewsBench
  ];
} else if (isBenchsales) {
  apiInterviews = apiInterviewsBench;
} else {
  apiInterviews = apiInterviewsNormal;
}

  useEffect(() => {
    setPostedJobsCount(Array.isArray(jobTitles) ? jobTitles.length : 0);
    const today = new Date();
today.setHours(0, 0, 0, 0);

const filteredInterviews = Array.isArray(apiInterviews)
  ? apiInterviews.filter((item) => {
      const interviewDate = new Date(
        item.interviewDate
      );

      return interviewDate >= today;
    })
  : [];

setScheduledInterviewsCount(
  filteredInterviews.length
);
    
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
    navigate(`${basePath}${path}`);
  };

  const handleSubmissionAction = (candidateName, actionType, role) => {
    setToastMessage(`Candidate ${candidateName} ${actionType === 'accept' ? 'invited to interview' : 'declined'} for ${role}.`);
    setShowUploadedSuccess(true);
    setTimeout(() => setShowUploadedSuccess(false), 5000);
  };

  return (
    <div className="projects-container">
      {/* Header Section - Modern Role Banner */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3" style={{ borderBottom: '1px solid #e2e8f0' }}>
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="live-status-pill">
              <span className="live-ping"></span>
              Hiring Manager Console
            </span>
          </div>
          <h1 className="m-0" style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>Recruitment Overview</h1>
        </div>
        <div className="d-flex gap-2">
          <button className="btn d-flex align-items-center gap-2" onClick={() => guideRef.current?.startTour()} style={{ background: "#ffffff", color: "#475569", borderRadius: "8px", padding: "8px 16px", fontWeight: "700", border: "1px solid #e2e8f0", fontSize: "12px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
            <Info size={16} /> Help Guide
          </button>
        </div>
      </div>

      <Guide ref={guideRef} />

      {/* Role-Specific Guidance & Status Alert */}
      <div className="role-guidance-banner mb-4 animate-banner" style={{ borderLeftColor: '#f5810c' }}>
        <div className="d-flex align-items-center gap-3">
          <div className="guidance-icon-box" style={{ background: 'rgba(245, 129, 12, 0.1)' }}>
            <Activity size={20} color="#f5810c" />
          </div>
          <div className="guidance-text-box">
            <span className="guidance-label" style={{ color: '#f5810c' }}>PENDING RECRUITMENT DECISIONS</span>
            <p className="guidance-desc">
              Your recruitment pipeline is active. You have <strong style={{ color: "#0f172a" }}>{postedJobsCount} active postings</strong> and{" "}
              <strong style={{ color: "#0f172a" }}>{pendingReviewCount} bench submissions</strong> awaiting your evaluation.
              Review candidate pitches below or schedule upcoming interview slots.
            </p>
          </div>
        </div>
      </div>

      <div className="bento-grid">
        {/* Row 1: Welcome & Stats */}
        <div className="bento-card welcome-card span-8">
          <div className="d-flex justify-content-between align-items-start h-100">
            <div style={{ flex: 1 }}>
              <h3 className="bento-card-title">Welcome back, {user}</h3>
              <p className="welcome-text" style={{ fontSize: "14px", color: "#64748b", marginTop: "12px", lineHeight: "1.6" }}>
                Fill your vacancy pipelines efficiently. You have <span style={{ fontWeight: 700, color: "#0f172a" }}>{postedJobsCount} active postings</span> and <span style={{ fontWeight: 700, color: "#0f172a" }}>3 interviews</span> scheduled for this week.
              </p>
              <div className="d-flex flex-wrap gap-2 mt-4">
                {/* Create Job */}
                <button
                  className="btn d-flex align-items-center gap-2"
                  onClick={() => handleNavigate('/user-post-new-positions')}
                  style={{ background: "#0f172a", border: "none", color: "white", padding: "10px 20px", borderRadius: "12px", fontWeight: 700, fontSize: "13px", boxShadow: "0 10px 15px -3px rgba(15,23,42,0.1)", whiteSpace: "nowrap" }}
                >
                  <Plus size={15} /> Create Job
                </button>

                {/* Upload Talent — opens modal */}
                {/* <button
                  className="btn d-flex align-items-center gap-2"
                  onClick={() => setShowUploadModal(true)}
                  style={{ background: "#f5810c", border: "none", color: "white", padding: "10px 20px", borderRadius: "12px", fontWeight: 700, fontSize: "13px", boxShadow: "0 10px 15px -3px rgba(245,129,12,0.2)", whiteSpace: "nowrap" }}
                >
                  <Upload size={15} /> Upload Talent
                </button> */}

                {/* Schedule Interview */}
                <button
                  className="btn d-flex align-items-center gap-2"
                  onClick={() => handleNavigate('/user-schedule-interview')}
                  style={{ background: "rgba(255,255,255,0.1)", border: "1px solid #e2e8f0", color: "#475569", padding: "10px 20px", borderRadius: "12px", fontWeight: 700, fontSize: "13px", whiteSpace: "nowrap" }}
                >
                  <Calendar size={15} /> Schedule Interview
                </button>
              </div>
            </div>
            <div style={{ background: "rgba(245, 129, 12, 0.05)", padding: "16px", borderRadius: "20px", flexShrink: 0 }}>
              <TrendingUp size={32} color="#f5810c" />
            </div>
          </div>
        </div>

        <div className="span-4 bento-stats-column">
          <div className="bento-stat-mini" onClick={() => handleNavigate('/user-posted-jobs')} style={{ cursor: 'pointer' }}>
            <div className="bento-stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}><Briefcase size={20} /></div>
            <div className="bento-stat-info">
              <span className="bento-stat-label">Jobs Posted</span>
              <span className="bento-stat-value">{postedJobsCount}</span>
            </div>
          </div>
          <div className="bento-stat-mini" onClick={() => handleNavigate('/user-projects')} style={{ cursor: 'pointer' }}>
            <div className="bento-stat-icon" style={{ background: 'rgba(245, 129, 12, 0.1)', color: '#f5810c' }}><LayoutGrid size={20} /></div>
            <div className="bento-stat-info">
              <span className="bento-stat-label">Active Projects</span>
              <span className="bento-stat-value">{activeProjectsCount}</span>
            </div>
          </div>
          <div
  className="bento-stat-mini"
  onClick={() =>
    handleNavigate('/user-upcoming-interview')
  }
  style={{ cursor: 'pointer' }}
>
  <div
    className="bento-stat-icon"
    style={{
      background: 'rgba(16, 185, 129, 0.1)',
      color: '#10b981'
    }}
  >
    <Calendar size={20} />
  </div>

  <div className="bento-stat-info">
    <span className="bento-stat-label">
      Scheduled Interviews
    </span>

    <span className="bento-stat-value">
      {scheduledInterviewsCount}
    </span>
  </div>
</div>
        </div>

        {/* Row 2: Quick Actions — no duplicate links from welcome card */}
        <div className="bento-card span-12">
          <div className="bento-card-header mb-3">
            <div>
              <h3 className="bento-card-title m-0">Quick Actions</h3>
              <span style={{ fontSize: "11px", color: "#64748b" }}>Core hiring workflows for your role</span>
            </div>
          </div>
          <div className="shortcuts-modern-grid">
            <div className="shortcut-interactive-card" onClick={() => handleNavigate('/user-upload-talent')}>
              <div className="shortcut-icon-wrapper">
                <Inbox size={18} />
              </div>
              <div className="shortcut-text-wrapper">
                <span className="shortcut-title">Review Pitches</span>
                <span className="shortcut-desc">{pendingReviewCount} submissions awaiting your approval</span>
              </div>
              <ChevronRight className="shortcut-chevron" size={16} />
            </div>
            <div className="shortcut-interactive-card" onClick={() => handleNavigate('/user-posted-jobs')}>
              <div className="shortcut-icon-wrapper">
                <Briefcase size={18} />
              </div>
              <div className="shortcut-text-wrapper">
                <span className="shortcut-title">Posted Jobs</span>
                <span className="shortcut-desc">{postedJobsCount} active vacancies — view status &amp; applicants</span>
              </div>
              <ChevronRight className="shortcut-chevron" size={16} />
            </div>
            <div className="shortcut-interactive-card" onClick={() => handleNavigate('/user-schedule-interview')}>
              <div className="shortcut-icon-wrapper">
                <Calendar size={18} />
              </div>
              <div className="shortcut-text-wrapper">
                <span className="shortcut-title">Schedule Interviews</span>
                <span className="shortcut-desc">Coordinate calendar slots with candidates</span>
              </div>
              <ChevronRight className="shortcut-chevron" size={16} />
            </div>
            <div className="shortcut-interactive-card" onClick={() => handleNavigate('/user-projects')}>
              <div className="shortcut-icon-wrapper">
                <LayoutGrid size={18} />
              </div>
              <div className="shortcut-text-wrapper">
                <span className="shortcut-title">Active Projects</span>
                <span className="shortcut-desc">{activeProjectsCount} projects — track status &amp; timelines</span>
              </div>
              <ChevronRight className="shortcut-chevron" size={16} />
            </div>
          </div>
        </div>

        {/* Row 3: Projects from API */}
        <div className="bento-card span-8">
          <ProjectsSection projects={dashboardProjects} role="Recruiter" />
        </div>

        {/* Row 3 sidebar: Live Hiring Summary */}
        <div className="bento-card span-4" style={{ background: '#0f172a', color: 'white', border: 'none', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'rgba(245, 129, 12, 0.12)', filter: 'blur(40px)', borderRadius: '50%', pointerEvents: 'none' }}></div>

          <div className="d-flex flex-column h-100" style={{ position: 'relative', zIndex: 1 }}>
            <div className="d-flex align-items-center gap-2 mb-4">
              <TrendingUp size={16} color="#f5810c" />
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Live Hiring Summary</span>
            </div>

            <div className="d-flex flex-column gap-3 flex-1">
              {/* Active postings — real API */}
              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '14px 16px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Active Job Postings</span>
                <div className="d-flex align-items-end gap-2 mt-1">
                  <span style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>{postedJobsCount}</span>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '2px' }}>vacancies</span>
                </div>
              </div>

              {/* Pending pitches — real API */}
              <div style={{ background: 'rgba(245,129,12,0.08)', border: '1px solid rgba(245,129,12,0.15)', borderRadius: '10px', padding: '14px 16px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(245,129,12,0.7)', textTransform: 'uppercase' }}>Pitches to Review</span>
                <div className="d-flex align-items-center justify-content-between mt-1">
                  <span style={{ fontSize: '28px', fontWeight: 800, color: '#f5810c', lineHeight: 1 }}>{pendingReviewCount}</span>
                  {pendingReviewCount > 0 && (
                    <button
                      onClick={() => handleNavigate('/user-upload-talent')}
                      style={{ background: '#f5810c', border: 'none', color: '#fff', fontSize: '10px', fontWeight: 800, padding: '4px 10px', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      Review
                    </button>
                  )}
                </div>
              </div>

              {/* Hiring health — real computed value */}
              <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '10px', padding: '14px 16px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(16,185,129,0.7)', textTransform: 'uppercase' }}>Hiring Health</span>
                <div className="d-flex align-items-end gap-2 mt-1">
                  <span style={{ fontSize: '28px', fontWeight: 800, color: '#34d399', lineHeight: 1 }}>{hiringHealth}%</span>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '2px' }}>SLA score</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 4: Live pitched submissions — full width */}
        <div className="bento-card span-12">
          <div className="bento-card-header mb-4">
            <div className="d-flex align-items-center gap-2">
              <Inbox size={16} color="#f5810c" />
              <h3 className="bento-card-title">Active Pitched Submissions</h3>
            </div>
            <button className="link-button" onClick={() => handleNavigate('/user-posted-jobs')} style={{ fontSize: "12px", fontWeight: 600 }}>View All Postings <ChevronRight size={14} /></button>
          </div>
          
          <div className="matched-jobs-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {recentJobs.length > 0 ? (
              recentJobs.map((job, idx) => (
                <div key={job.id || idx} className="job-match-card-expanded" style={{ borderLeft: '4px solid #f5810c' }}>
                  <div className="job-match-card-header">
                    <div className="job-match-avatar-initials">
                      {getInitials(job.company || job.title || 'JB')}
                    </div>
                    <div className="job-match-meta">
                      <span className="job-match-title">{job.title}</span>
                      <span className="job-match-company">{job.company}{job.location ? ` · ${job.location}` : ''}</span>
                    </div>
                    <div className="job-match-percentage-badge" style={{ background: '#f0fdf4', color: '#16a34a' }}>Active</div>
                  </div>
                  <div className="job-match-specs mt-2">
                    {job.type && <span className="spec-tag">{job.type}</span>}
                    {job.experience && <span className="spec-tag">{job.experience}</span>}
                    {job.salary && <span className="spec-tag-salary">{job.salary}</span>}
                  </div>
                  <div className="job-match-action-row mt-3">
                    <button className="btn-action-pitch-submit" style={{ background: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }} onClick={() => handleSubmissionAction(job.title, 'accept', job.title)}>
                      <CheckSquare size={13} /> Invite to Interview
                    </button>
                    <button className="btn-action-view-details-only" onClick={() => handleSubmissionAction(job.title, 'decline', job.title)}>Decline</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-100 py-5 text-center" style={{ gridColumn: '1 / -1', color: '#94a3b8', fontSize: '13px' }}>
                <Inbox size={28} style={{ marginBottom: 8, opacity: 0.4 }} />
                <div>No active pitched submissions yet.</div>
                <div style={{ fontSize: '11px', marginTop: 4 }}>Bench Sales leads will submit candidates once vacancies are posted.</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showUploadedSuccess && (
        <div className="admin-toast-alert" style={{ bottom: 'unset', top: '24px' }}>
          <SparklePulse />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Upload Talent Modal — triggered from welcome card */}
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

const SparklePulse = () => {
  return (
    <span className="toast-sparkle-dot">
      <span className="toast-sparkle-ping"></span>
    </span>
  );
};

export default RecruiterDashboard;
