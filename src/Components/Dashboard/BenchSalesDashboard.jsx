import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import "./BentoDashboard.css";
import { Briefcase, Users, FileText, Info, Search, ArrowRight, Activity, Upload, Calendar, Clock, ChevronRight, TrendingUp, CheckSquare } from "lucide-react";
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

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, Filler);

const matchedJobs = [
  { id: 1, title: "Senior React Developer", company: "Meta Systems", location: "Remote", type: "Full-time", salary: "$140k - $180k", experience: "5+ Years" },
  { id: 2, title: "Frontend Architect", company: "CloudScale", location: "San Francisco", type: "Contract", salary: "$90/hr", experience: "8+ Years" },
  { id: 3, title: "UI Engineer", company: "Designly", location: "New York", type: "Full-time", salary: "$120k - $150k", experience: "3+ Years" },
];

const earningsData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [{
    label: "Earnings",
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
  const user = localStorage.getItem("UserName") || "User";
  const [getQueueManagement] = useGetQueueManagementMutation();
  const [getMyBench] = useGetMyBenchMutation();
  const [getTalentJobs, { isLoading: isJobsLoading }] = useGetFindJobsMutation();

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
    navigate(`${basePath}${path}`);
  };

  const handlePitchCandidate = (candidateName, jobTitle, company) => {
    setToastMessage(`Pitch initiated — structuring placement package for ${candidateName} at ${company} for ${jobTitle}.`);
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
              Bench Sales Lead Console
            </span>
          </div>
          <h1 className="m-0" style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>Talent Operations Overview</h1>
        </div>
        <div className="d-flex gap-2">
            <UploadTalentModal 
                onSuccess={(msg) => { setToastMessage(msg); setShowUploadedSuccess(true); setTimeout(() => setShowUploadedSuccess(false), 5000); }} 
                onUploading={(isUploading) => setShowUploading(!!isUploading)} 
            />
            <button className="btn d-flex align-items-center gap-2" onClick={() => guideRef.current?.startTour()} style={{ background: "#ffffff", color: "#475569", borderRadius: "8px", padding: "8px 16px", fontWeight: "700", border: "1px solid #e2e8f0", fontSize: "12px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
              <Info size={16} /> Help Guide
            </button>
        </div>
      </div>

      <Guide ref={guideRef} />

      {/* Role-Specific Guidance & Status Alert */}
      <div className="role-guidance-banner mb-4 animate-banner">
        <div className="d-flex align-items-center gap-3">
          <div className="guidance-icon-box">
            <Activity size={20} color="#f5810c" />
          </div>
          <div className="guidance-text-box">
            <span className="guidance-label">RECOMMENDED NEXT ACTIONS</span>
            <p className="guidance-desc">
              Your bench sales channel is active. You have <strong style={{ color: "#0f172a" }}>{totalTalentCount} available candidates</strong> and{" "}
              <strong style={{ color: "#0f172a" }}>{pendingReviewCount} resumes pending review</strong>. Match candidates with open vacancies and submit qualified profiles.
            </p>
          </div>
        </div>
      </div>

      <div className="bento-grid">
        {/* Row 1: Welcome & Stats */}
        <div className="bento-card welcome-card span-8" style={{ borderLeftColor: '#3b82f6' }}>
          <div className="d-flex justify-content-between align-items-start h-100">
            <div>
              <h3 className="bento-card-title">Welcome back, {user}</h3>
              <p className="welcome-text" style={{ fontSize: "14px", color: "#64748b", marginTop: "12px", lineHeight: "1.6" }}>
                Keep your bench active. You have parsed <span style={{ fontWeight: 700, color: "#0f172a" }}>{totalTalentCount} profiles</span> and matched them against <span style={{ fontWeight: 700, color: "#0f172a" }}>{matchedJobsCount} client vacancies</span> across multiple vendors.
              </p>
              <div className="d-flex gap-3 mt-4">
                <button className="btn" onClick={() => handleNavigate('/user-Jobs')} style={{ background: "#0f172a", border: "none", color: "white", padding: "12px 28px", borderRadius: "12px", fontWeight: 700, fontSize: "14px", boxShadow: "0 10px 15px -3px rgba(15,23,42,0.1)" }}>Discover Open Jobs</button>
                <button className="btn" onClick={() => handleNavigate('/user-upload-talent')} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid #e2e8f0", color: "#64748b", padding: "12px 28px", borderRadius: "12px", fontWeight: 700, fontSize: "14px" }}>Manage Resume Queue</button>
              </div>
            </div>
            <div style={{ background: "rgba(59, 130, 246, 0.05)", padding: "16px", borderRadius: "20px" }}>
              <Users size={32} color="#3b82f6" />
            </div>
          </div>
        </div>

        <div className="span-4 bento-stats-column">
          <div className="bento-stat-mini" onClick={() => handleNavigate('/user-upload-talent')} style={{ cursor: 'pointer' }}>
            <div className="bento-stat-icon" style={{ background: 'rgba(245, 129, 12, 0.1)', color: '#f5810c' }}><Users size={20} /></div>
            <div className="bento-stat-info">
              <span className="bento-stat-label">Total Bench</span>
              <span className="bento-stat-value">{totalTalentCount}</span>
            </div>
          </div>
          <div className="bento-stat-mini" onClick={() => handleNavigate('/user-upload-talent')} style={{ cursor: 'pointer' }}>
            <div className="bento-stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}><FileText size={20} /></div>
            <div className="bento-stat-info">
              <span className="bento-stat-label">Resumes Awaiting</span>
              <span className="bento-stat-value">{pendingReviewCount}</span>
            </div>
          </div>
          <div className="bento-stat-mini" onClick={() => handleNavigate('/user-Jobs')} style={{ cursor: 'pointer' }}>
            <div className="bento-stat-icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}><Briefcase size={20} /></div>
            <div className="bento-stat-info">
              <span className="bento-stat-label">Vacancies Found</span>
              <span className="bento-stat-value">{matchedJobsCount}</span>
            </div>
          </div>
        </div>

        {/* Row 2: Quick Action Shortcuts (no duplicates) */}
        <div className="bento-card span-12">
          <div className="bento-card-header mb-3">
            <div>
              <h3 className="bento-card-title m-0">Quick Actions</h3>
              <span style={{ fontSize: "11px", color: "#64748b" }}>Core workflows for your Bench Sales role</span>
            </div>
          </div>
          <div className="shortcuts-modern-grid">
            <div className="shortcut-interactive-card" onClick={() => handleNavigate('/user-upload-talent')}>
              <div className="shortcut-icon-wrapper">
                <Upload size={18} />
              </div>
              <div className="shortcut-text-wrapper">
                <span className="shortcut-title">Upload Resumes</span>
                <span className="shortcut-desc">Parse and add candidate files to the bench pool</span>
              </div>
              <ChevronRight className="shortcut-chevron" size={16} />
            </div>
            <div className="shortcut-interactive-card" onClick={() => handleNavigate('/review-talent')}>
              <div className="shortcut-icon-wrapper">
                <CheckSquare size={18} />
              </div>
              <div className="shortcut-text-wrapper">
                <span className="shortcut-title">Review Queue</span>
                <span className="shortcut-desc">Audit {pendingReviewCount} resumes pending AI processing</span>
              </div>
              <ChevronRight className="shortcut-chevron" size={16} />
            </div>
            <div className="shortcut-interactive-card" onClick={() => handleNavigate('/user-Jobs')}>
              <div className="shortcut-icon-wrapper">
                <Search size={18} />
              </div>
              <div className="shortcut-text-wrapper">
                <span className="shortcut-title">Discover Vacancies</span>
                <span className="shortcut-desc">Browse {matchedJobsCount} auto-matched client positions</span>
              </div>
              <ChevronRight className="shortcut-chevron" size={16} />
            </div>
            <div className="shortcut-interactive-card" onClick={() => handleNavigate('/user-talentpool')}>
              <div className="shortcut-icon-wrapper">
                <Users size={18} />
              </div>
              <div className="shortcut-text-wrapper">
                <span className="shortcut-title">Talent Pool</span>
                <span className="shortcut-desc">{totalTalentCount} candidates — explore and filter your bench</span>
              </div>
              <ChevronRight className="shortcut-chevron" size={16} />
            </div>
          </div>
        </div>

        {/* Row 3: Recommended Jobs with Direct Pitch action */}
        <div className="bento-card span-8">
          <div className="bento-card-header mb-4">
            <div className="d-flex align-items-center gap-2">
              <Briefcase size={16} color="#f5810c" />
              <h3 className="bento-card-title">Recommended Placements</h3>
            </div>
            <button className="link-button" onClick={() => handleNavigate('/user-Jobs')} style={{ fontSize: "12px", fontWeight: 600 }}>Browse Vacancy List <ChevronRight size={14} /></button>
          </div>
          
          <div className="matched-jobs-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {isJobsLoading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="candidate-card small-card" style={{ padding: '16px', borderRadius: '12px', height: '180px', background: '#f8fafc', border: '1px dashed #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                </div>
              ))
            ) : realMatchedJobs.length > 0 ? (
              realMatchedJobs.map((job) => (
                <div key={job.id} className="job-match-card-expanded">
                  <div className="job-match-card-header">
                    <img src={job.avatar} alt={job.company} className="job-match-avatar" />
                    <div className="job-match-meta">
                      <span className="job-match-title">{job.title}</span>
                      <span className="job-match-company">{job.company} · <span style={{ fontWeight: 800 }}>{job.location}</span></span>
                    </div>
                    <div className="job-match-percentage-badge">
                      95% Match
                    </div>
                  </div>
                  <div className="job-match-specs mt-2">
                    <span className="spec-tag">{job.type}</span>
                    <span className="spec-tag">{job.experience}</span>
                    <span className="spec-tag-salary">{job.salary}</span>
                  </div>
                  <div className="job-match-action-row mt-3">
                    <button 
                      className="btn-action-pitch-submit"
                      onClick={() => handlePitchCandidate(dashboardTalent[0]?.name || "Bench Candidate", job.title, job.company)}
                    >
                      <ArrowRight size={13} style={{ marginRight: 4 }} /> Quick Submit
                    </button>
                    <button 
                      className="btn-action-view-details-only"
                      onClick={() => navigate(`${window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/User'}/user-Jobs`, { state: { autoOpenJobId: job.id } })}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-100 py-4 text-center" style={{ gridColumn: '1 / -1', color: '#94a3b8', fontSize: '13px' }}>
                No active recommended placements. Add profiles to trigger.
              </div>
            )}
          </div>
        </div>

        <div className="bento-card span-4" style={{ background: '#0f172a', color: 'white', border: 'none', position: 'relative', overflow: 'hidden' }}>
          {/* Glow accent */}
          <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'rgba(245, 129, 12, 0.12)', filter: 'blur(40px)', borderRadius: '50%', pointerEvents: 'none' }}></div>

          <div className="d-flex flex-column h-100" style={{ position: 'relative', zIndex: 1 }}>
            <div className="d-flex align-items-center gap-2 mb-4">
              <Activity size={16} color="#f5810c" />
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Live Bench Summary</span>
            </div>

            {/* Total bench — real API value */}
            <div className="d-flex flex-column gap-3 flex-1">
              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '14px 16px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Total on Bench</span>
                <div className="d-flex align-items-end gap-2 mt-1">
                  <span style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>{totalTalentCount}</span>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '2px' }}>candidates</span>
                </div>
              </div>

              {/* Pending review — real API value */}
              <div style={{ background: 'rgba(245,129,12,0.08)', border: '1px solid rgba(245,129,12,0.15)', borderRadius: '10px', padding: '14px 16px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(245,129,12,0.7)', textTransform: 'uppercase' }}>Awaiting Review</span>
                <div className="d-flex align-items-center justify-content-between mt-1">
                  <span style={{ fontSize: '28px', fontWeight: 800, color: '#f5810c', lineHeight: 1 }}>{pendingReviewCount}</span>
                  {pendingReviewCount > 0 && (
                    <button
                      onClick={() => handleNavigate('/review-talent')}
                      style={{ background: '#f5810c', border: 'none', color: '#fff', fontSize: '10px', fontWeight: 800, padding: '4px 10px', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      Review
                    </button>
                  )}
                </div>
              </div>

              {/* Matched vacancies — real API value */}
              <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: '10px', padding: '14px 16px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(59,130,246,0.7)', textTransform: 'uppercase' }}>Open Vacancies</span>
                <div className="d-flex align-items-end gap-2 mt-1">
                  <span style={{ fontSize: '28px', fontWeight: 800, color: '#60a5fa', lineHeight: 1 }}>{matchedJobsCount}</span>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '2px' }}>matched</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 4: Pending Review Queue — full width */}
        <div className="bento-card span-12">
          <div className="bento-card-header mb-4">
            <div className="d-flex align-items-center gap-2">
              <Clock size={16} color="#f5810c" />
              <h3 className="bento-card-title">Pending Parser Auditing Queue</h3>
            </div>
            <button className="link-button" onClick={() => handleNavigate('/user-upload-talent')} style={{ fontSize: "12px", fontWeight: 600 }}>Manage Queue <ChevronRight size={14} /></button>
          </div>
          <div className="bento-table-container">
            <UploadTalentTable isDashboard={true} statusFilter="Pending For Review" refreshKey={refreshKey} onDeleted={() => setRefreshKey(prev => prev + 1)} />
          </div>
        </div>
      </div>

      {showUploading && (
        <div className="uploading-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20000 }}>
          <div style={{ background: 'white', padding: 24, borderRadius: 16, textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div className="spinner" style={{ width: 32, height: 32, border: '3px solid #f5810c', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
            <div style={{ fontWeight: 700, fontSize: '15px', color: '#1e293b' }}>Uploading Resumes</div>
          </div>
        </div>
      )}

      {showUploadedSuccess && (
        <div className="admin-toast-alert" style={{ bottom: 'unset', top: '24px' }}>
          <SparklePulse />
          <span>{toastMessage}</span>
        </div>
      )}
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
