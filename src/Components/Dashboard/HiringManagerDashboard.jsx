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
import { Briefcase, Users, FileText, DollarSign, Info, Sparkles, LayoutGrid, Clock, Calendar, TrendingUp, ChevronRight, Plus, MapPin, ShieldCheck, PieChart } from "lucide-react";
import ProjectsSection from "./ProjectsSection";
import HiringPipelineChart from "./charts/HiringPipelineChart";
import InterviewsList from "./InterviewsList";
import { useGetQueueManagementMutation, useGetMyBenchMutation } from "../../State-Management/Api/UploadResumeApiSlice";
import { useGetGroupedJobTitlesQuery } from "../../State-Management/Api/TalentPoolApiSlice";
import { CandidateCard } from "../UploadTalent/UserTalentGrid";
import Guide from "../Guide/Guide";

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
  const user = localStorage.getItem("UserName") || "User";
  const userId = localStorage.getItem("CompanyId");
  const { data: jobTitles = [] } = useGetGroupedJobTitlesQuery(userId);
  const [dashboardProjects, setDashboardProjects] = useState([]);
  const [getQueueManagement] = useGetQueueManagementMutation();
  const [getMyBench] = useGetMyBenchMutation();

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
    navigate(`${basePath}${path}`);
  };

  return (
    <div className="projects-container">
      {/* Header Section - Admin Standard */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3" style={{ borderBottom: '1px solid #e2e8f0' }}>
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span style={{ fontSize: "10px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Management Console</span>
          </div>
          <h1 className="m-0" style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>Workspace Overview</h1>
        </div>
        <div className="d-flex gap-2">
          <button className="btn d-flex align-items-center gap-2" onClick={() => guideRef.current?.startTour()} style={{ background: "#ffffff", color: "#475569", borderRadius: "8px", padding: "8px 16px", fontWeight: "700", border: "1px solid #e2e8f0", fontSize: "12px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
            <Info size={16} /> Help Guide
          </button>
        </div>
      </div>

      <Guide ref={guideRef} />

      <div className="bento-grid">
        {/* Row 1: Welcome & Stats */}
        <div className="bento-card welcome-card span-8">
          <div className="d-flex justify-content-between align-items-start h-100">
            <div>
              <h3 className="bento-card-title">Welcome back, {user}</h3>
              <p className="welcome-text" style={{ fontSize: "14px", color: "#64748b", marginTop: "12px", lineHeight: "1.6" }}>Your recruitment ecosystem is active. You have <span style={{ fontWeight: 700, color: "#0f172a" }}>{postedJobsCount} active job postings</span> and <span style={{ fontWeight: 700, color: "#0f172a" }}>3 interviews</span> scheduled for this week.</p>
              <div className="d-flex gap-3 mt-4">
                <button className="btn" onClick={() => handleNavigate('/user-post-new-positions')} style={{ background: "#0f172a", border: "none", color: "white", padding: "12px 28px", borderRadius: "12px", fontWeight: 700, fontSize: "14px", boxShadow: "0 10px 15px -3px rgba(15,23,42,0.1)" }}>Create New Position</button>
                <button className="btn" onClick={() => handleNavigate('/user-analytics')} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid #e2e8f0", color: "#475569", padding: "12px 28px", borderRadius: "12px", fontWeight: 700, fontSize: "14px" }}>System Analytics</button>
              </div>
            </div>
            <div style={{ background: "rgba(245, 129, 12, 0.05)", padding: "16px", borderRadius: "20px" }}>
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
          <div className="bento-stat-mini" onClick={() => handleNavigate('/user-upload-talent')} style={{ cursor: 'pointer' }}>
            <div className="bento-stat-icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}><Clock size={20} /></div>
            <div className="bento-stat-info">
              <span className="bento-stat-label">Pending Review</span>
              <span className="bento-stat-value">{pendingReviewCount}</span>
            </div>
          </div>
        </div>

        {/* Row 2: Projects & Pipeline */}
        <div className="bento-card span-8">
          <ProjectsSection projects={dashboardProjects} role="Recruiter" />
        </div>

        <div className="bento-card span-4" style={{ background: '#0f172a', color: 'white', border: 'none', position: 'relative', overflow: 'hidden' }}>
          {/* Subtle background glow */}
          <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: activeMetric === 'earnings' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 129, 12, 0.1)', filter: 'blur(40px)', borderRadius: '50%', pointerEvents: 'none' }}></div>
          
          <div className="d-flex flex-column h-100" style={{ position: 'relative', zIndex: 1 }}>
            <div className="d-flex p-1 mb-4" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', alignSelf: 'center', width: 'fit-content' }}>
              <button 
                onClick={() => setActiveMetric('earnings')}
                style={{ 
                  padding: '6px 16px', 
                  borderRadius: '10px', 
                  border: 'none', 
                  background: activeMetric === 'earnings' ? '#ffffff' : 'transparent',
                  color: activeMetric === 'earnings' ? '#0f172a' : 'rgba(255,255,255,0.6)',
                  fontSize: '11px',
                  fontWeight: 800,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
              >
                Earnings
              </button>
              <button 
                onClick={() => setActiveMetric('utilization')}
                style={{ 
                  padding: '6px 16px', 
                  borderRadius: '10px', 
                  border: 'none', 
                  background: activeMetric === 'utilization' ? '#ffffff' : 'transparent',
                  color: activeMetric === 'utilization' ? '#0f172a' : 'rgba(255,255,255,0.6)',
                  fontSize: '11px',
                  fontWeight: 800,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
              >
                Utilization
              </button>
            </div>

            {activeMetric === 'earnings' ? (
              <div className="d-flex flex-column h-100">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <span style={{ fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>Project Revenue</span>
                    <h3 style={{ fontSize: "24px", fontWeight: 800, margin: 0, color: "#ffffff" }}>${totalRevenue.toLocaleString()}</h3>
                  </div>
                  <div style={{ background: "rgba(59, 130, 246, 0.2)", padding: "8px", borderRadius: "10px" }}>
                    <TrendingUp size={18} color="#3b82f6" />
                  </div>
                </div>
                <div style={{ flex: 1, minHeight: "140px" }}>
                  <Line data={earningsData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }} />
                </div>
              </div>
            ) : (
              <div className="d-flex flex-column h-100">
                <div className="d-flex align-items-center gap-2 mb-4 justify-content-center">
                  <PieChart size={16} color="#f5810c" />
                  <h3 className="bento-card-title text-white m-0" style={{ fontSize: '14px' }}>Hiring Health</h3>
                </div>
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <div style={{ width: "130px", height: "130px" }}>
                    <Doughnut 
                      data={{
                        ...utilizationData,
                        datasets: [{
                          ...utilizationData.datasets[0],
                          data: [hiringHealth, 100 - hiringHealth]
                        }]
                      }} 
                      options={{ cutout: "75%", plugins: { legend: { display: false } } }} 
                    />
                  </div>
                  <div style={{ position: "absolute", textAlign: "center" }}>
                    <div style={{ fontSize: "24px", fontWeight: 800, color: "#ffffff" }}>{hiringHealth}%</div>
                    <div style={{ fontSize: "9px", fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>Efficiency</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Row 3: Recently Posted Jobs & Interviews */}
        <div className="bento-card span-8">
          <div className="bento-card-header mb-4">
            <div className="d-flex align-items-center gap-2">
              <Sparkles size={16} color="#f5810c" />
              <h3 className="bento-card-title">Recently Posted Jobs</h3>
            </div>
            <button className="link-button" onClick={() => handleNavigate('/user-posted-jobs')} style={{ fontSize: "12px", fontWeight: 600 }}>Explore All <ChevronRight size={14} /></button>
          </div>
          <div className="matched-jobs-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {recentJobs.length > 0 ? (
              recentJobs.map((job) => (
                <CandidateCard 
                  key={job.id} 
                  candidate={job} 
                  isSelected={false} 
                  onToggle={() => {}} 
                  small={true}
                  primaryActionLabel="View Details"
                  onPrimaryAction={() => {
                    const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
                    navigate(`${basePath}/job-overview`, { state: { jobId: job.id } });
                  }}
                />
              ))
            ) : (
              <div className="w-100 py-4 text-center" style={{ gridColumn: '1 / -1', color: '#94a3b8', fontSize: '13px' }}>
                You haven't posted any jobs yet.
              </div>
            )}
          </div>
        </div>

        <div className="bento-card span-4">
          <InterviewsList interviews={[]} isComingSoon={true} />
        </div>
      </div>
    </div>
  );
};

export default HiringManagerDashboard;
