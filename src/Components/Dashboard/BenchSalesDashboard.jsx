import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import "./BentoDashboard.css";
import { Briefcase, Users, FileText, Info, Search, ArrowRight, LayoutGrid, Sparkles, Upload, Calendar, DollarSign, MapPin, Clock, Plus, ChevronRight, TrendingUp, PieChart } from "lucide-react";
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
import InterviewsList from "./InterviewsList";
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

  return (
    <div className="projects-container">
      {/* Header Section - Admin Standard */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3" style={{ borderBottom: '1px solid #e2e8f0' }}>
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span style={{ fontSize: "10px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Talent Operations</span>
          </div>
          <h1 className="m-0" style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>Talent Overview</h1>
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

      <div className="bento-grid">
        {/* Row 1: Welcome & Stats */}
        <div className="bento-card welcome-card span-8" style={{ borderLeftColor: '#3b82f6' }}>
          <div className="d-flex justify-content-between align-items-start h-100">
            <div>
              <h3 className="bento-card-title">Welcome back, {user}</h3>
              <p className="welcome-text" style={{ fontSize: "14px", color: "#64748b", marginTop: "12px", lineHeight: "1.6" }}>Your talent pool is growing. You have <span style={{ fontWeight: 700, color: "#0f172a" }}>{pendingReviewCount} profiles pending review</span> and 45 new job matches identified today.</p>
              <div className="d-flex gap-3 mt-4">
                <button className="btn" onClick={() => handleNavigate('/user-Jobs')} style={{ background: "#0f172a", border: "none", color: "white", padding: "12px 28px", borderRadius: "12px", fontWeight: 700, fontSize: "14px", boxShadow: "0 10px 15px -3px rgba(15,23,42,0.1)" }}>Discover Jobs</button>
                <button className="btn" onClick={() => handleNavigate('/user-upload-talent')} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid #e2e8f0", color: "#64748b", padding: "12px 28px", borderRadius: "12px", fontWeight: 700, fontSize: "14px" }}>Manage Talent</button>
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
              <span className="bento-stat-label">Total Talent</span>
              <span className="bento-stat-value">{totalTalentCount}</span>
            </div>
          </div>
          <div className="bento-stat-mini" onClick={() => handleNavigate('/user-upload-talent')} style={{ cursor: 'pointer' }}>
            <div className="bento-stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}><FileText size={20} /></div>
            <div className="bento-stat-info">
              <span className="bento-stat-label">Pending Review</span>
              <span className="bento-stat-value">{pendingReviewCount}</span>
            </div>
          </div>
          <div className="bento-stat-mini" onClick={() => handleNavigate('/user-Jobs')} style={{ cursor: 'pointer' }}>
            <div className="bento-stat-icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}><Briefcase size={20} /></div>
            <div className="bento-stat-info">
              <span className="bento-stat-label">Job Matches</span>
              <span className="bento-stat-value">{matchedJobsCount}</span>
            </div>
          </div>
        </div>

        {/* Row 2: Job Matches & Sidebar Action */}
        <div className="bento-card span-8">
          <div className="bento-card-header mb-4">
            <div className="d-flex align-items-center gap-2">
              <Sparkles size={16} color="#f5810c" />
              <h3 className="bento-card-title">Recommended Jobs</h3>
            </div>
            <button className="link-button" onClick={() => handleNavigate('/user-Jobs')} style={{ fontSize: "12px", fontWeight: 600 }}>Explore All <ChevronRight size={14} /></button>
          </div>
          
          <div className="matched-jobs-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {isJobsLoading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="candidate-card small-card" style={{ padding: '16px', borderRadius: '12px', height: '180px', background: '#f8fafc', border: '1px dashed #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                </div>
              ))
            ) : realMatchedJobs.length > 0 ? (
              realMatchedJobs.map((job) => (
                <CandidateCard 
                  key={job.id} 
                  candidate={job} 
                  isSelected={false} 
                  onToggle={() => {}} 
                  onPrimaryAction={(j) => {
                    const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/User';
                    navigate(`${basePath}/user-Jobs`, {
                      state: { autoOpenJobId: j.id }
                    });
                  }}
                  small={true}
                />
              ))
            ) : (
              <div className="w-100 py-4 text-center" style={{ gridColumn: '1 / -1', color: '#94a3b8', fontSize: '13px' }}>
                No job matches found for your talent pool.
              </div>
            )}
          </div>
        </div>

        <div className="bento-card span-4" style={{ background: '#0f172a', color: 'white', border: 'none', position: 'relative', overflow: 'hidden' }}>
          {/* Subtle background glow */}
          <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: activeMetric === 'earnings' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 129, 12, 0.1)', filter: 'blur(40px)', borderRadius: '50%', pointerEvents: 'none' }}></div>
          
          <div className="d-flex flex-column h-100" style={{ position: 'relative', zIndex: 1 }}>
            {/* Custom Toggle Switch */}
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
                    <span style={{ fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>Total Earnings</span>
                    <h3 style={{ fontSize: "24px", fontWeight: 800, margin: 0, color: "#ffffff" }}>$124,500</h3>
                  </div>
                  <div style={{ background: "rgba(59, 130, 246, 0.2)", padding: "8px", borderRadius: "10px" }}>
                    <TrendingUp size={18} color="#3b82f6" />
                  </div>
                </div>
                <div style={{ flex: 1, minHeight: "140px" }}>
                  <Line 
                    data={{
                      ...earningsData,
                      datasets: [{
                        ...earningsData.datasets[0],
                        borderColor: "#3b82f6",
                        backgroundColor: "rgba(59, 130, 246, 0.2)",
                        pointBackgroundColor: "#ffffff",
                        pointBorderColor: "#3b82f6",
                        pointBorderWidth: 2,
                      }]
                    }} 
                    options={{
                      ...earningsOptions,
                      scales: {
                        x: { display: false },
                        y: { display: false }
                      }
                    }} 
                  />
                </div>
                <div className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>Monthly Revenue Growth</span>
                    <span style={{ fontSize: "11px", color: "#10b981", fontWeight: 800 }}>+12.5%</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="d-flex flex-column h-100">
                <div className="d-flex align-items-center gap-2 mb-4 justify-content-center">
                  <PieChart size={16} color="#f5810c" />
                  <h3 className="bento-card-title text-white m-0" style={{ fontSize: '14px' }}>Bench Health</h3>
                </div>
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <div style={{ width: "130px", height: "130px" }}>
                    <Doughnut 
                      data={{
                        ...utilizationData,
                        datasets: [{
                          ...utilizationData.datasets[0],
                          backgroundColor: ["#f5810c", "rgba(255,255,255,0.05)"],
                        }]
                      }} 
                      options={{ cutout: "75%", plugins: { legend: { display: false } } }} 
                    />
                  </div>
                  <div style={{ position: "absolute", textAlign: "center" }}>
                    <div style={{ fontSize: "24px", fontWeight: 800, color: "#ffffff" }}>75%</div>
                    <div style={{ fontSize: "9px", fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>Utilized</div>
                  </div>
                </div>
                <div className="mt-4 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="d-flex justify-content-between align-items-center px-2">
                    <div className="d-flex align-items-center gap-2">
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f5810c" }}></div>
                      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>Occupied</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgba(255,255,255,0.2)" }}></div>
                      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>Idle</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Row 3: Pending Review & Interviews */}
        <div className="bento-card span-8">
          <div className="bento-card-header mb-4">
            <div className="d-flex align-items-center gap-2">
              <Clock size={16} color="#f5810c" />
              <h3 className="bento-card-title">Profiles Pending Review</h3>
            </div>
            <button className="link-button" onClick={() => handleNavigate('/user-upload-talent')} style={{ fontSize: "12px", fontWeight: 600 }}>Manage Queue <ChevronRight size={14} /></button>
          </div>
          <div className="bento-table-container">
            <UploadTalentTable isDashboard={true} statusFilter="Pending For Review" refreshKey={refreshKey} onDeleted={() => setRefreshKey(prev => prev + 1)} />
          </div>
        </div>

        <div className="bento-card span-4">
          <InterviewsList interviews={[]} isComingSoon={true} />
        </div>
      </div>

      {showUploading && (
        <div className="uploading-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20000 }}>
          <div style={{ background: 'white', padding: 24, borderRadius: 16, textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div className="spinner" style={{ width: 32, height: 32, border: '3px solid #f5810c', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
            <div style={{ fontWeight: 700, fontSize: '15px', color: '#1e293b' }}>Uploading</div>
          </div>
        </div>
      )}

      {showUploadedSuccess && (
        <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 20001, background: '#10b981', color: 'white', padding: '12px 20px', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: "13px" }}>
          <Sparkles size={16} />
          {toastMessage}
        </div>
      )}
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

export default BenchSalesDashboard;
