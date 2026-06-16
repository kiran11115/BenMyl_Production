import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import {
  Users,
  RefreshCw,
  ShieldCheck,
  Activity,
  Briefcase,
  Upload,
  Sparkles,
  Send,
  Layers3,
  ArrowUpRight,
  Cpu,
  Compass,
  Search,
  Command,
  CreditCard,
} from "lucide-react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";



import UploadTalentModal from "../../../UploadTalent/UploadTalentModal";

import "../../Modules/AdminDashboard/AdminDashboard.css";

import { useRoleListDetailsQuery } from "../../../../State-Management/Api/PermissionsApiSlice";

import { useGetTeamMembersQuery } from "../../../../State-Management/Api/AdminDetailsApiSlice";

import { useGetAllContractsQuery } from "../../../../State-Management/Api/ContractApiSlice";

import {
  useGetGroupedJobTitlesQuery,
  useTalentPoolMutation,
} from "../../../../State-Management/Api/TalentPoolApiSlice";
import { useGetAutonomousActivityLogQuery, useGetDashboardStatsQuery, useGetRecruiterGraphQuery } from "../../../../State-Management/Api/DashboardApiSlice";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const QUICK_ACTIONS = [
  {
    title: "Add New Recruiter",
    desc: "Configure profile, access limits, and KPI scoreboards.",
    icon: <Users size={20} />,
    path: "/Admin/account-settings",
  },

  {
    title: "Post Open Job",
    desc: "Create job listings and matching parameters instantly.",
    icon: <Briefcase size={20} />,
    path: "/Admin/user-post-new-positions",
  },

  {
    title: "Auto Match Sync",
    desc: "Sync candidate profiles against active requirements.",
    icon: <Sparkles size={20} />,
    path: "/Admin/admin-talentpool",
  },
  {
    title: "Billing Console",
    desc: "Manage enterprise billing and active subscriptions.",
    icon: <CreditCard size={20} />,
    path: "/Admin/account-settings",
  },
  {
    title: "Security Setup",
    desc: "Configure network policies and role access.",
    icon: <ShieldCheck size={20} />,
    path: "/Admin/role-configuration",
  },
];

function AdminDashboard() {
  const navigate = useNavigate();

  const emailId = localStorage.getItem("Email") || "";

  const companyId =
    localStorage.getItem("logincompanyid") || "";

  const userId =
    localStorage.getItem("CompanyId") || "";

  const [syncing, setSyncing] = useState(false);

  const [toast, setToast] = useState(null);

  const [talentCount, setTalentCount] = useState(0);

  const [showUploadModal, setShowUploadModal] =
    useState(false);

  const { data: rolesData = [] } =
    useRoleListDetailsQuery();

  const { data: teamData } =
    useGetTeamMembersQuery(emailId, {
      skip: !emailId,
    });

  const { data: apiContracts = [] } =
    useGetAllContractsQuery();

  const { data: apiJobs = [] } =
    useGetGroupedJobTitlesQuery(userId, {
      skip: !userId,
    });

  const [getFindTalent] =
    useTalentPoolMutation();

    const { data: dashboardStats = {} } =
  useGetDashboardStatsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

    const { data: recruiterGraph = [] } =
  useGetRecruiterGraphQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const { data: activityLogs = [], isLoading: logsLoading } =
  useGetAutonomousActivityLogQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval:1000
  });

  const getTimeAgo = (dateString) => {
  const diff = Date.now() - new Date(dateString).getTime();

  const mins = Math.floor(diff / 60000);

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} mins ago`;

  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hours ago`;

  const days = Math.floor(hrs / 24);
  return `${days} days ago`;
};

  const {
  activeRecruiters = 0,
  openRequirements = 0,
  candidateSubmissions = 0,
  hiringSuccessRate = 0,
} = dashboardStats;

  const graphData = useMemo(() => {
  if (!Array.isArray(recruiterGraph))
    return [];

  return recruiterGraph.map((item) => ({
    month: item.monthName?.slice(0, 3),
    benchSales: Number(item.benchSales || 0),
    hiringManagers: Number(
      item.hiringManagers || 0
    ),
  }));
}, [recruiterGraph]);

  useEffect(() => {
    if (companyId) {
      getFindTalent({
        companyid: Number(companyId),
        pageNumber: 1,
        pageSize: 1000,
        filters: [],
      })
        .unwrap()
        .then((res) => {
          if (Array.isArray(res)) {
            setTalentCount(res.length);
          }
        });
    }
  }, [companyId, getFindTalent]);

  const teamMembers = useMemo(() => {
    return Array.isArray(teamData)
      ? teamData
      : teamData?.value || [];
  }, [teamData]);

  const triggerSync = () => {
    setSyncing(true);

    setTimeout(() => {
      setSyncing(false);

      setToast(
        "AI systems synchronized successfully."
      );

      setTimeout(() => {
        setToast(null);
      }, 3000);
    }, 1000);
  };

  const chartData = {
    labels: graphData.map(d => d.month),
    datasets: [
      {
        label: "Overall Jobs Posted",
        data: graphData.map(d => d.hiringManagers),
        borderColor: "#5a5de8",
        backgroundColor: "rgba(90, 93, 232, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#fff",
        pointBorderColor: "#5a5de8",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Resumes Uploaded",
        data: graphData.map(d => d.benchSales),
        borderColor: "#00b67a",
        backgroundColor: "rgba(0, 182, 122, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#fff",
        pointBorderColor: "#00b67a",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'end',
        labels: {
          usePointStyle: true,
          boxWidth: 6,
          font: { size: 11, family: 'Inter' }
        }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 10,
        cornerRadius: 8,
        titleFont: { size: 13, family: 'Inter' },
        bodyFont: { size: 12, family: 'Inter' }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 11, family: 'Inter' }, color: '#94a3b8' }
      },
      y: {
        grid: { borderDash: [4, 4], color: '#f1f5f9' },
        ticks: { font: { size: 11, family: 'Inter' }, color: '#94a3b8' },
        beginAtZero: true
      }
    }
  };

  const latest = graphData[graphData.length - 1] || {};
const previous = graphData[graphData.length - 2] || {};

const totalJobs = graphData.reduce(
  (sum, item) => sum + item.hiringManagers,
  0
);

const totalResumes = graphData.reduce(
  (sum, item) => sum + item.benchSales,
  0
);

const growth =
  previous.hiringManagers > 0
    ? (
        ((latest.hiringManagers - previous.hiringManagers) /
          previous.hiringManagers) *
        100
      ).toFixed(1)
    : 0;

  return (
    <div className="ai-dashboard-wrapper">

      {/* TOAST */}

      {toast && (
        <div className="ai-toast">
          <div className="pulse-dot"></div>
          {toast}
        </div>
      )}

      {/* HERO */}

      <div className="hero-card">

        <div className="hero-left">

          <div className="hero-pill">
            ✦ ENTERPRISE AI PORTAL ENABLED
          </div>

          <h1>
            Welcome Back to BenMyl
          </h1>

          <p>
            Your autonomous recruitment workflow
            is calibrated and running. AI neural
            screens completed
            <strong>
              {" "}
              14,204 parsing jobs{" "}
            </strong>
            successfully today.
          </p>

        </div>

        <div className="hero-buttons">

          <button
            className="launch-btn"
            onClick={triggerSync}
          >
            <RefreshCw
              size={16}
              className={
                syncing ? "spin-icon" : ""
              }
            />

            {syncing
              ? "Syncing..."
              : "Launch AI Workspace"}
          </button>

          <button
            className="routine-btn"
            onClick={() =>
              navigate("/Admin/active-routines")
            }
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
          <span>INTERACTIVE NEURAL COMMAND INTERFACE</span>
        </div>

        <div className="command-search">

          <Search size={18} className="command-search-icon" />

          <input
            type="text"
            placeholder="Type a recruiter, requirement, or AI neural action e.g. 'Show active recruiters with 5+ years React experience'..."
          />

          <button>
            Ask AI
            <Send size={13} />
          </button>

        </div>

        <div className="prompt-row">

          <span className="prompt-label">Quick Prompts:</span>

          <span>
            Find React developers with 5+ years
          </span>

          <span>
            Show inactive recruiters
          </span>

          <span>
            Generate vendor report
          </span>

          <span>
            Predict hiring closure rate
          </span>

        </div>

      </div>

      {/* STATS */}

      <div className="stats-grid">

        {/* CARD 1 */}

        <div className="stat-card">

          <div className="stat-header-row">

            <div className="stat-title">
              Active Users
            </div>

            <div className="stat-icon-box">
              <Users size={16} />
            </div>

          </div>

          <div className="stat-number">
            {activeRecruiters}
          </div>

          <div className="stat-footer-row">

            <span>
              Last calibrated 5m ago
            </span>
          </div>

          <div className="green-badge">
            +12%
          </div>



          <div className="stat-bottom-link">
            ↗ Optimal Flow
          </div>

          <div className="stat-bg-icon" style={{ color: '#6b6ff0' }}><Users size={120} /></div>
        </div>

        {/* CARD 2 */}

        <div className="stat-card">

          <div className="stat-header-row">

            <span className="stat-title">
              Open Requirements
            </span>

            <div className="stat-icon-box">
              <Briefcase size={16} />
            </div>

          </div>

          <div className="stat-number">
            {openRequirements}
          </div>

          <div className="stat-footer-row">

            <span>
              Last calibrated 5m ago
            </span>
          </div>

          <div className="green-badge">
            +8%
          </div>



          <div className="stat-bottom-link">
            ↗ Optimal Flow
          </div>

          <div className="stat-bg-icon" style={{ color: '#6b6ff0' }}><Briefcase size={120} /></div>
        </div>

        {/* CARD 3 */}

        <div className="stat-card">

          <div className="stat-header-row">

            <span className="stat-title">
              Candidates Added
            </span>

            <div className="stat-icon-box">
              <Layers3 size={16} />
            </div>

          </div>

          <div className="stat-number">
            {candidateSubmissions}
          </div>

          <div className="stat-footer-row">

            <span>
              Last calibrated 5m ago
            </span>
          </div>

          <div className="green-badge">
            +24%
          </div>



          <div className="stat-bottom-link">
            ↗ Optimal Flow
          </div>

          <div className="stat-bg-icon" style={{ color: '#6b6ff0' }}><Layers3 size={120} /></div>
        </div>

        {/* CARD 4 */}

        <div className="stat-card">

          <div className="stat-header-row">

            <span className="stat-title">
              Hiring Success Rate
            </span>

            <div className="stat-icon-box">
              <ShieldCheck size={16} />
            </div>

          </div>

          <div className="stat-number">
            {hiringSuccessRate}
          </div>

          <div className="stat-footer-row">

            <span>
              Last calibrated 5m ago
            </span>
          </div>

          <div className="green-badge">
            +4.1%
          </div>



          <div className="stat-bottom-link">
            ↗ Optimal Flow
          </div>

          <div className="stat-bg-icon" style={{ color: '#6b6ff0' }}><ShieldCheck size={120} /></div>
        </div>

      </div>

      {/* CHART SECTION */}

      <div className="chart-grid">

        <div className="graph-card">

          <div className="graph-header">

            <div>

              <h3 style={{ fontSize: '14px', marginBottom: 0 }}>
                Hiring Activity Velocity
                Index
              </h3>

              <p style={{ fontSize: '12px', marginTop: 0 }}>
                Real-time mapping of
                applicant pipelines &
                revenue capture
              </p>

            </div>

          </div>

          <div className="graph-area" style={{ padding: "10px" }}>
            <Line data={chartData} options={chartOptions} />
          </div>

          <div className="graph-footer">

  <div>
    <span>TOTAL JOBS POSTED</span>
    <strong style={{ fontSize: 14 }}>
      {totalJobs}
    </strong>
  </div>

  <div>
    <span>TOTAL RESUMES UPLOADED</span>
    <strong
      style={{
        fontSize: 14,
        color: "#5B5BD6",
      }}
    >
      {totalResumes}
    </strong>
  </div>

  <div>
    <span>MONTHLY GROWTH</span>
    <strong
      style={{
        fontSize: 14,
        color: "#009966",
      }}
    >
      {growth > 0 ? "+" : ""}
      {growth}%
    </strong>
  </div>

</div>

        </div>

        {/* LOG */}

        <div className="log-card">

          <div className="log-header">

            <div>

              <h3 style={{ fontSize: '14px', marginBottom: 0 }}>
                Autonomous Activity Log
              </h3>

              <p style={{ fontSize: '12px', marginTop: 0 }}>
                Live triggers from
                sourcing systems
              </p>

            </div>

            <Activity size={18} />

          </div>

          <div className="log-list">
  {logsLoading ? (
    <div className="text-center py-3">
      Loading activity logs...
    </div>
  ) : activityLogs?.length > 0 ? (
    activityLogs.slice(0, 10).map((log, index) => (
      <div className="log-item" key={index}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span className="log-tag">
            {log.activityType}
          </span>

          <small style={{ fontSize: 11 }}>
            {getTimeAgo(log.activityDate)}
          </small>
        </div>

        <p style={{ fontSize: "11px",marginBottom:0 }}>
          {log.activityMessage}
        </p>
      </div>
    ))
  ) : (
    <div className="text-center py-3">
      No activity logs found
    </div>
  )}
</div>

          <div className="security-box">

            <span style={{fontSize:11}}>
              ✓ Security token protocol
              compliant
            </span>

            <strong style={{fontSize:10}}>
              EXCELLENT
            </strong>

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
              Launch background processes
              or manual calibration flows
              instantly
            </p>

          </div>

        </div>

        <div className="quick-grid">

          {QUICK_ACTIONS.map(
            (item, index) => (

              <div
                className="quick-item"
                key={index}
                onClick={() =>
                  navigate(item.path)
                }
              >

                <div className="quick-icon">
                  {item.icon}
                </div>

                <h4 style={{fontSize:12,marginBottom:0}}>
                  {item.title}
                </h4>

                <p style={{fontSize:10,marginTop:0}}>
                  {item.desc}
                </p>

              </div>
            )
          )}

        </div>

      </div>

      {/* MODAL */}

      <UploadTalentModal
        show={showUploadModal}
        hideButton={true}
        onHide={() =>
          setShowUploadModal(false)
        }
        onSuccess={() =>
          setShowUploadModal(false)
        }
      />

    </div>
  );
}

export default AdminDashboard;