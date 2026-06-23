import React, {useState, useRef, useEffect, useMemo} from "react";
import {useNavigate} from "react-router-dom";

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
    Maximize2,
    Bot,
    MoreHorizontal,
    ArrowRight,
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
    Filler
} from "chart.js";
import {Line} from "react-chartjs-2";


import UploadTalentModal from "../../../UploadTalent/UploadTalentModal";

import "../../Modules/AdminDashboard/AdminDashboard.css";

import {useRoleListDetailsQuery} from "../../../../State-Management/Api/PermissionsApiSlice";

import {useGetTeamMembersQuery} from "../../../../State-Management/Api/AdminDetailsApiSlice";

import {useGetAllContractsQuery} from "../../../../State-Management/Api/ContractApiSlice";

import {useGetGroupedJobTitlesQuery, useTalentPoolMutation} from "../../../../State-Management/Api/TalentPoolApiSlice";
import {useGetAutonomousActivityLogQuery, useGetDashboardStatsQuery, useGetRecruiterGraphQuery} from "../../../../State-Management/Api/DashboardApiSlice";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const sparklineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: {
        x: { display: false },
        y: { display: false, min: 0 }
    },
    elements: {
        point: { radius: 0, hoverRadius: 0 } // Removing points for elegant look
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
            const {ctx, chartArea} = chart;
            if (!chartArea) return 'transparent'; // Fix for initial render error
            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, gradientStart);
            gradient.addColorStop(1, gradientEnd);
            return gradient;
        },
        tension: 0.4 // Smoother curves
    }]
});



const QUICK_ACTIONS = [
    {
        title: "Add New Recruiter",
        desc: "Configure profile, access limits, and KPI scoreboards.",
        icon: <Users size={20}/>,
        path: "/Admin/account-settings"
    },

    {
        title: "Post Open Job",
        desc: "Create job listings and matching parameters instantly.",
        icon: <Briefcase size={20}/>,
        path: "/Admin/user-post-new-positions"
    },

    {
        title: "Auto Match Sync",
        desc: "Sync candidate profiles against active requirements.",
        icon: <Sparkles size={20}/>,
        path: "/Admin/admin-talentpool"
    },
    {
        title: "Billing Console",
        desc: "Manage enterprise billing and active subscriptions.",
        icon: <CreditCard size={20}/>,
        path: "/Admin/admin-subscription"
    }, {
        title: "Security Setup",
        desc: "Configure network policies and role access.",
        icon: <ShieldCheck size={20}/>,
        path: "/Admin/role-configuration"
    },
];

function AdminDashboard() {
    const navigate = useNavigate();

    const emailId = localStorage.getItem("Email") || "";

    const companyId = localStorage.getItem("logincompanyid") || "";

    const userId = localStorage.getItem("CompanyId") || "";

    const [syncing, setSyncing] = useState(false);

    const [toast, setToast] = useState(null);

    const [talentCount, setTalentCount] = useState(0);

    const [showUploadModal, setShowUploadModal] = useState(false);

    const [showDevMsg, setShowDevMsg] = useState(false);

    const {
        data: rolesData = []
    } = useRoleListDetailsQuery();

    const {data: teamData} = useGetTeamMembersQuery(emailId, {
        skip: ! emailId
    });

    const {
        data: apiContracts = []
    } = useGetAllContractsQuery();

    const {
        data: apiJobs = []
    } = useGetGroupedJobTitlesQuery(userId, {
        skip: ! userId
    });

    const [getFindTalent] = useTalentPoolMutation();

    const {
        data: dashboardStats = {}
    } = useGetDashboardStatsQuery(undefined, {refetchOnMountOrArgChange: true});

    const {
        data: recruiterGraph = []
    } = useGetRecruiterGraphQuery(undefined, {refetchOnMountOrArgChange: true});

    const {
        data: activityLogs = [],
        isLoading: logsLoading
    } = useGetAutonomousActivityLogQuery(undefined, {
        refetchOnMountOrArgChange: true,
        pollingInterval: 1000
    });

    const getTimeAgo = (dateString) => {
        const diff = Date.now() - new Date(dateString).getTime();

        const mins = Math.floor(diff / 60000);

        if (mins < 1) 
            return "Just now";
        
        if (mins < 60) 
            return `${mins} mins ago`;
        

        const hrs = Math.floor(mins / 60);
        if (hrs < 24) 
            return `${hrs} hours ago`;
        

        const days = Math.floor(hrs / 24);
        return `${days} days ago`;
    };

    const {
        activeRecruiters = 0,
        openRequirements = 0,
        candidateSubmissions = 0,
        hiringSuccessRate = 0
    } = dashboardStats;

    const graphData = useMemo(() => {
        if (!Array.isArray(recruiterGraph)) 
            return [];
        

        return recruiterGraph.map((item) => ({
            month: item.monthName ?. slice(0, 3),
            benchSales: Number(item.benchSales || 0),
            hiringManagers: Number(item.hiringManagers || 0)
        }));
    }, [recruiterGraph]);

    const sparklineData1 = useMemo(() => createSparklineData('#8b5cf6', 'rgba(139, 92, 246, 0.15)', 'rgba(139, 92, 246, 0)', graphData.length ? graphData.map(d => d.hiringManagers) : [10, 20, 15, 25]), [graphData]);
    const sparklineData2 = useMemo(() => createSparklineData('#3b82f6', 'rgba(59, 130, 246, 0.15)', 'rgba(59, 130, 246, 0)', graphData.length ? graphData.map(d => d.benchSales) : [15, 18, 20, 22]), [graphData]);
    const sparklineData3 = useMemo(() => createSparklineData('#10b981', 'rgba(16, 185, 129, 0.15)', 'rgba(16, 185, 129, 0)', graphData.length ? graphData.map(d => d.benchSales * 1.5) : [20, 25, 28, 30]), [graphData]);
    const sparklineData4 = useMemo(() => createSparklineData('#06b6d4', 'rgba(6, 182, 212, 0.15)', 'rgba(6, 182, 212, 0)', graphData.length ? graphData.map(d => d.hiringManagers * 1.2) : [10, 15, 20, 25]), [graphData]);
    const sparklineData5 = useMemo(() => createSparklineData('#f97316', 'rgba(249, 115, 22, 0.15)', 'rgba(249, 115, 22, 0)', graphData.length ? graphData.map(d => d.hiringManagers * 1.5) : [12, 18, 22, 28]), [graphData]);

    useEffect(() => {
        if (companyId) {
            getFindTalent({companyid: Number(companyId), pageNumber: 1, pageSize: 1000, filters: []}).unwrap().then((res) => {
                if (Array.isArray(res)) {
                    setTalentCount(res.length);
                }
            });
        }
    }, [companyId, getFindTalent]);

    const teamMembers = useMemo(() => {
        return Array.isArray(teamData) ? teamData : teamData ?. value || [];
    }, [teamData]);

    const triggerSync = () => {
        setSyncing(true);

        setTimeout(() => {
            setSyncing(false);

            setToast("AI systems synchronized successfully.");

            setTimeout(() => {
                setToast(null);
            }, 3000);
        }, 1000);
    };

    const chartData = {
        labels: graphData.map(d => d.month),
        datasets: [
            {
                label: " Overall Jobs Posted",
                data: graphData.map(d => d.hiringManagers),
                borderColor: "#3CC9C9",
                backgroundColor: (context) => {
                    const chart = context.chart;
                    const {ctx, chartArea} = chart;
                    if (!chartArea) return "rgba(60, 201, 201, 0.08)";
                    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                    gradient.addColorStop(0, "rgba(60, 201, 201, 0.22)");
                    gradient.addColorStop(1, "rgba(60, 201, 201, 0.01)");
                    return gradient;
                },
                tension: 0.45,
                fill: true,
                pointBackgroundColor: "#fff",
                pointBorderColor: "#3CC9C9",
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 7
            }, {
                label: " Resumes Uploaded",
                data: graphData.map(d => d.benchSales),
                borderColor: "#FFA94D",
                backgroundColor: (context) => {
                    const chart = context.chart;
                    const {ctx, chartArea} = chart;
                    if (!chartArea) return "rgba(255, 169, 77, 0.08)";
                    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                    gradient.addColorStop(0, "rgba(255, 169, 77, 0.20)");
                    gradient.addColorStop(1, "rgba(255, 169, 77, 0.01)");
                    return gradient;
                },
                tension: 0.45,
                fill: true,
                pointBackgroundColor: "#fff",
                pointBorderColor: "#FFA94D",
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 7
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
                align: 'end',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    boxWidth: 8,
                    boxHeight: 8,
                    padding: 20,
                    color: '#475569',
                    font: {
                        size: 11,
                        family: 'Inter',
                        weight: '600'
                    }
                }
            },
            tooltip: {
                backgroundColor: '#0f2a2a',
                padding: 12,
                cornerRadius: 10,
                borderColor: 'rgba(60, 201, 201, 0.35)',
                borderWidth: 1,
                titleColor: '#b2f5f5',
                bodyColor: '#e0fafa',
                titleFont: {
                    size: 12,
                    family: 'Inter',
                    weight: '700'
                },
                bodyFont: {
                    size: 11,
                    family: 'Inter'
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                border: { display: false },
                ticks: {
                    font: {
                        size: 11,
                        family: 'Inter'
                    },
                    color: '#94a3b8'
                }
            },
            y: {
                grid: {
                    borderDash: [4, 4],
                    color: 'rgba(60, 201, 201, 0.07)'
                },
                border: { display: false, dash: [4, 4] },
                ticks: {
                    font: {
                        size: 11,
                        family: 'Inter'
                    },
                    color: '#94a3b8'
                },
                beginAtZero: true
            }
        }
    };

    const latest = graphData[graphData.length - 1] || {};
    const previous = graphData[graphData.length - 2] || {};

    const totalJobs = graphData.reduce((sum, item) => sum + item.hiringManagers, 0);

    const totalResumes = graphData.reduce((sum, item) => sum + item.benchSales, 0);

    const growth = previous.hiringManagers > 0 ? (((latest.hiringManagers - previous.hiringManagers) / previous.hiringManagers) * 100).toFixed(1) : 0;

    return (
        <div className="ai-dashboard-wrapper">

            {/* TOAST */}

            {
            toast && (
                <div className="ai-toast">
                    <div className="pulse-dot"></div>
                    {toast} </div>
            )
        }

            {/* HERO SECTION WRAPPER */}
            <div className="hero-section-wrapper">
                {/* HERO */}
                <div className="hero-card">
                    {/* Background Decorative Elements */}
                    <div className="hero-concentric-lines"></div>
                    <div className="hero-ripple-pattern"></div>
                    <div className="hero-circular-highlights"></div>

                    <div className="hero-left">

                        {/* <div className="hero-header">
                <div className="hero-logo">B</div>
                <span className="hero-brand">BENMYL</span>
                <span className="hero-divider">|</span>
                <span className="hero-portal-text">ENTERPRISE AI PORTAL</span>
              </div> */}

                        <div className="hero-pill">
                            {/* <span className="green-dot"></span> */}
                           ✦ ENTERPRISE AI PORTAL ENABLED
                        </div>

                        {/* <div className="hero-subtitle">Workforce Intelligence</div> */}
                        <div className="hero-title-row">
                            <h1>
                                Welcome Back to BenMyl !
                            </h1>

                            <div className="hero-buttons">
                                <button className="routine-btn"
                                    onClick={
                                        () => navigate("/Admin/active-routines")
                                }>
                                    View Active Routines
                                    <ArrowUpRight size={16}/>
                                </button>
                            </div>
                        </div>

                        <div className="hero-content-row">
                            <p>
                                Workforce intelligence is ready. Review today's recruitment performance, candidate activity, and hiring opportunities.
                            </p>
                        </div>

                    </div>

                    {/* Dashboard Illustration */}
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
                            I found <strong>18 high-match candidates</strong><br/> for your open roles.
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <button 
                                className="copilot-action-btn" 
                                onClick={() => setShowDevMsg(true)}
                            >
                                Review Matches
                            </button>
                            {showDevMsg && (
                                <span style={{ fontSize: "11px", color: "#64748b" }}>
                                    We are currently under development.
                                </span>
                            )}
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

      </div> */}

            {/* STATS */}

            <div className="stats-grid">

                {/* CARD 1 */}
                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-card-icon-title-container">
                            <div className="stat-card-icon-box stat-purple">
                                <Users size={18}/>
                            </div>
                            <div className="stat-card-title-number">
                                <span className="stat-card-title">Active Users</span>
                                <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                                    <span className="stat-card-number">{activeRecruiters}</span>
                                    <div className="stat-card-change">
                                        <span className="stat-card-percentage stat-text-purple">↑ 12.5%</span>
                                        <span className="stat-card-vs">vs last month</span>
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
                                <Briefcase size={18}/>
                            </div>
                            <div className="stat-card-title-number">
                                <span className="stat-card-title">Open Requirements</span>
                                <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                                    <span className="stat-card-number">{openRequirements}</span>
                                    <div className="stat-card-change">
                                        <span className="stat-card-percentage stat-text-green">↑ 8.3%</span>
                                        <span className="stat-card-vs">vs last month</span>
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
                            <div className="stat-card-icon-box stat-green">
                                <Users size={18}/>
                            </div>
                            <div className="stat-card-title-number">
                                <span className="stat-card-title">Candidates Added</span>
                                <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                                    <span className="stat-card-number">{candidateSubmissions}</span>
                                    <div className="stat-card-change">
                                        <span className="stat-card-percentage stat-text-green">↑ 15.8%</span>
                                        <span className="stat-card-vs">vs last month</span>
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
                            <div className="stat-card-icon-box stat-teal">
                                <Briefcase size={18}/>
                            </div>
                            <div className="stat-card-title-number">
                                <span className="stat-card-title">Hires This Month</span>
                                <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                                    <span className="stat-card-number">{talentCount}</span>
                                    <div className="stat-card-change">
                                        <span className="stat-card-percentage stat-text-green">↑ 50.0%</span>
                                        <span className="stat-card-vs">vs last month</span>
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
                    onClick={() => navigate("/Admin/role-configuration")}
                >
                    <div className="action-card-content">
                        <div className="stat-card-icon-box stat-orange action-icon-box">
                            <ShieldCheck size={22}/>
                        </div>
                        <span className="action-card-title">Role Configuration</span>
                        <span className="action-card-desc">Manage access & policies</span>
                        <div className="action-card-arrow-wrapper">
                            <ArrowRight size={18} className="action-card-arrow" />
                        </div>
                    </div>
                    <div className="stat-bg-icon stat-text-orange">
                        <ShieldCheck size={120} />
                    </div>
                </div>

            </div>

            {/* CHART + LOG SECTION */}

            <div className="chart-log-row">

                <div className="graph-card">

                    <div className="graph-header">
                        <div>
                            <h3 className="graph-title">Hiring Activity Velocity Index</h3>
                            <p className="graph-subtitle">Real-time mapping of applicant pipelines &amp; revenue capture</p>
                        </div>
                    </div>

                    <div className="graph-area">
                        <Line data={chartData} options={chartOptions}/>
                    </div>

                    <div className="graph-footer">

                        <div>
                            <span>TOTAL JOBS POSTED</span>
                            <strong className="graph-footer-jobs">{totalJobs}</strong>
                        </div>

                        <div>
                            <span>TOTAL RESUMES UPLOADED</span>
                            <strong className="graph-footer-resumes">{totalResumes}</strong>
                        </div>

                        <div>
                            <span>MONTHLY GROWTH</span>
                            <strong className="graph-footer-growth">
                                {growth > 0 ? "+" : ""}{growth}%
                            </strong>
                        </div>

                    </div>

                </div>

                {/* LOG */}

                <div className="log-card">

                    <div className="log-header">

                        <div>
                            <h3 className="log-title">Autonomous Activity Log</h3>
                            <p className="log-subtitle">Live triggers from sourcing systems</p>
                        </div>

                        <Activity size={18}/>

                    </div>

                    <div className="log-list">
                        {
                        logsLoading ? (
                            <div className="text-center py-3">
                                Loading activity logs...
                            </div>
                        ) : activityLogs?.length > 0 ? (activityLogs.slice(0, 10).map((log, index) => (
                            <div className={`log-item theme-${index % 4}`} key={index}>
                                <div className="log-item-left">
                                    <span className="log-tag">{log.activityType}</span>
                                    <p className="log-message">{log.activityMessage}</p>
                                </div>
                                <small className="log-time">{getTimeAgo(log.activityDate)}</small>
                            </div>
                        ))) : (
                            <div className="text-center py-3">
                                No activity logs found
                            </div>
                        )
                    } </div>

                    <div className="security-box">
                        <span className="security-text">✓ Security token protocol compliant</span>
                        <strong className="security-status">EXCELLENT</strong>
                    </div>

                </div>

            </div>

            {/* QUICK ACTIONS */}

            <div className="quick-card">

                <div className="quick-header">
                    <div>
                        <h3 className="quick-title">Quick Action Command Console</h3>
                        <p className="quick-desc">Launch background processes or manual calibration flows instantly</p>
                    </div>
                </div>

                <div className="quick-grid">
                    {
                    QUICK_ACTIONS.map((item, index) => (

                        <div className="quick-item"
                            key={index}
                            onClick={() => navigate(item.path)}>

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
                    ))
                }
                </div>

            </div>

            {/* MODAL */}

            <UploadTalentModal show={showUploadModal}
                hideButton={true}
                onHide={
                    () => setShowUploadModal(false)
                }
                onSuccess={
                    () => setShowUploadModal(false)
                }/>

        </div>
    );
}

export default AdminDashboard;
