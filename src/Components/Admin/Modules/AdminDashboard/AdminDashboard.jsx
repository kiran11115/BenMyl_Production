import React from "react";
import { useNavigate } from "react-router-dom";
import { 
    LayoutDashboard, UserCheck, TrendingUp, ExternalLink, 
    Activity, Layers, Shield, Zap, PieChart, ChevronRight,
    ShieldCheck, CheckCircle, Database, Bell, CreditCard,
    TrendingDown
} from "lucide-react";
import "./AdminDashboard.css";
import ModuleHeader from "../ModuleHeader";

const DASHBOARD_STATS = [
    { id: "bench", label: "Total Bench Talent", value: "1,240", sub: "Resources Available", icon: <Layers size={20} />, color: "#f5810c" },
    { id: "roles", label: "Active System Roles", value: "3", sub: "Governance Control", icon: <Shield size={20} />, color: "#0f172a" },
    { id: "approvals", label: "Pending Decisions", value: "12", sub: "SLA Progress: 84%", icon: <UserCheck size={20} />, color: "#3b82f6" },
    { id: "plan", label: "Active Subscription", value: "Enterprise", sub: "Seats: 42 / 50", icon: <Zap size={20} />, color: "#10b981" },
];

const RECENT_ROLES = [
    { title: "Super Admin", level: "Global", permissions: "Full Access", status: "Active" },
    { title: "Bench Sales Lead", level: "Module", permissions: "Talent Read / Write", status: "Active" },
    { title: "Hiring Manager", level: "Group", permissions: "Limited Approval", status: "Active" },
];

const BENCH_DISTRIBUTION = [
    { category: "Cloud Architecture", count: 420, trend: "+12%" },
    { category: "Frontend Engineering", count: 380, trend: "+5%" },
    { category: "DevOps & SRE", count: 210, trend: "+8%" },
    { category: "Data Science", count: 180, trend: "-2%" },
    { category: "Backend Microservices", count: 50, trend: "+15%" },
];

const PENDING_APPROVALS = [
    { id: "app-1", subject: "Senior Frontend Developer Submission", requestedBy: "David Miller", type: "Talent Submission", date: "2024-03-21" },
    { id: "app-2", subject: "Rate Increase ($110/hr) — AWS Expert", requestedBy: "Sarah Jones", type: "Rate Change", date: "2024-03-20" },
    { id: "app-3", subject: "New Project: AI Optimization Hub", requestedBy: "System Admin", type: "Project Init", date: "2024-03-19" },
];

const MODULE_SHORTCUTS = [
    { title: "Security Roles", path: "/Admin/role-configuration", icon: <ShieldCheck size={16} /> },
    { title: "Approval Rules", path: "/Admin/approval-control", icon: <CheckCircle size={16} /> },
    { title: "Data Dictionary", path: "/Admin/master-data", icon: <Database size={16} /> },
    { title: "Subscription", path: "/Admin/billing-control", icon: <CreditCard size={16} /> },
    { title: "Alert Policies", path: "/Admin/notification-policy", icon: <Bell size={16} /> },
];

function AdminDashboard() {
    const navigate = useNavigate();

    return (
        <div className="admin-dashboard-container">

            {/* ── Stats Grid ── */}
            <div className="dashboard-stats-grid">
                {DASHBOARD_STATS.map((stat) => (
                    <div key={stat.id} className="dash-stat-card">
                        <div className="stat-card-header">
                            <div className="stat-icon-box" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                                {stat.icon}
                            </div>
                            <span className="stat-trend">
                                <TrendingUp size={14} />
                                3.2%
                            </span>
                        </div>
                        <div className="stat-card-body">
                            <span className="stat-value">{stat.value}</span>
                            <span className="stat-label">{stat.label}</span>
                            <span className="stat-sub">{stat.sub}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Main Two-Column Grid ── */}
            <div className="dashboard-main-grid">

                {/* Left: Roles Table + Pending Approvals */}
                <div className="dashboard-left-col">
                    {/* Governance Roles */}
                    <section className="dash-section roles-summary">
                        <div className="section-header">
                            <h3>Governance Role Summary</h3>
                            <button className="btn-link" onClick={() => navigate("/Admin/role-configuration")}>
                                Manage All <ExternalLink size={12} />
                            </button>
                        </div>
                        <div className="tt-wrapper">
                            <table className="tt-table">
                                <thead>
                                    <tr className="tt-thead-tr">
                                        <th className="tt-th">Role Title</th>
                                        <th className="tt-th">Scope</th>
                                        <th className="tt-th">Permissions</th>
                                        <th className="tt-th">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {RECENT_ROLES.map((role, i) => (
                                        <tr key={i} className="tt-row">
                                            <td className="tt-td">
                                                <span style={{ fontWeight: 700, color: "#0f172a", fontSize: "var(--text-sm)" }}>{role.title}</span>
                                            </td>
                                            <td className="tt-td" style={{ textAlign: "center" }}>
                                                <span className="scope-tag">{role.level}</span>
                                            </td>
                                            <td className="tt-td" style={{ color: "#64748b", fontSize: "var(--text-xs)" }}>
                                                {role.permissions}
                                            </td>
                                            <td className="tt-td" style={{ textAlign: "center" }}>
                                                <span className="ds-badge-active">Active</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Pending Approvals */}
                    <section className="dash-section pending-summary">
                        <div className="section-header">
                            <h3>Pending Approvals</h3>
                            <button className="btn-link" onClick={() => navigate("/Admin/approval-control")}>
                                View All <ExternalLink size={12} />
                            </button>
                        </div>
                        <div className="approval-list">
                            {PENDING_APPROVALS.map((item) => (
                                <div key={item.id} className="approval-row">
                                    <div className="approval-indicator" style={{ backgroundColor: item.type === "Rate Change" ? "#f5810c" : "#3b82f6" }}></div>
                                    <div className="approval-info">
                                        <span className="approval-subject">{item.subject}</span>
                                        <span className="approval-meta">By {item.requestedBy} · {item.date}</span>
                                    </div>
                                    <span className="approval-type-tag">{item.type}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right: Bench Distribution */}
                <section className="dash-section bench-insights">
                    <div className="section-header">
                        <h3>Bench Talent Concentration</h3>
                        <PieChart size={18} color="#94a3b8" />
                    </div>
                    <div className="bench-total-badge">
                        <span className="bench-total-num">1,240</span>
                        <span className="bench-total-label">Total Resources on Bench</span>
                    </div>
                    <div className="bench-list">
                        {BENCH_DISTRIBUTION.map((item, i) => {
                            const isUp = item.trend.startsWith("+");
                            return (
                                <div key={i} className="bench-item">
                                    <div className="bench-info">
                                        <span className="bench-cat">{item.category}</span>
                                        <div className="bench-trend-pill" style={{ color: isUp ? "#10b981" : "#ef4444", background: isUp ? "#f0fdf4" : "#fef2f2" }}>
                                            {isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                                            {item.trend}
                                        </div>
                                    </div>
                                    <div className="bench-bar-context">
                                        <div className="bench-bar-track">
                                            <div 
                                                className="bench-bar-fill" 
                                                style={{ 
                                                    width: `${(item.count / 420) * 100}%`, 
                                                    backgroundColor: i % 2 === 0 ? "#f5810c" : "#1e293b" 
                                                }}
                                            ></div>
                                        </div>
                                        <span className="bench-count">{item.count}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>

            {/* ── Module Quick Access ── */}
            <div className="quick-access-footer">
                <div className="section-header">
                    <h3>Governance Controls</h3>
                    <button className="btn-link" onClick={() => navigate("/Admin/control-center")}>
                        All Modules <ExternalLink size={12} />
                    </button>
                </div>
                <div className="access-grid">
                    {MODULE_SHORTCUTS.map((link, i) => (
                        <div key={i} className="access-card" onClick={() => navigate(link.path)}>
                            <div className="access-card-icon">{link.icon}</div>
                            <span>{link.title}</span>
                            <ChevronRight size={14} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
