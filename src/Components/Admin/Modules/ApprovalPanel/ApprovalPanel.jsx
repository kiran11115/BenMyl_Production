import React, { useState } from "react";
import { 
    CheckCircle, Shield, UserCheck, AlertTriangle, 
    Filter, Search, ArrowRight, Settings, 
    MoreVertical, Plus, Clock, Ban
} from "lucide-react";
import "./ApprovalPanel.css";
import ModuleHeader from "../ModuleHeader";

const PENDING_APPROVALS = [
    { id: "app-1", subject: "Senior Frontend Developer Submission", requestedBy: "David Miller", status: "Pending", type: "Talent Submission", date: "2024-03-21" },
    { id: "app-2", subject: "Rate Increase ($110/hr) - AWS Cloud Expert", requestedBy: "Sarah Jones", status: "Pending", type: "Rate Change", date: "2024-03-20" },
    { id: "app-3", subject: "New Project: AI Optimization Hub", requestedBy: "Admin", status: "Review", type: "Project Initialization", date: "2024-03-19" },
];

const APPROVAL_CHAINS = [
    { id: "ch-1", name: "Standard Hiring Workflow", steps: ["Bench Sales", "Hiring Manager", "Admin"], isActive: true },
    { id: "ch-2", name: "High Rate Approval (>$120)", steps: ["Hiring Manager", "Admin", "Managing Director"], isActive: true },
];

function ApprovalPanel() {
    const [activeTab, setActiveTab] = useState("pending");

    return (
        <div className="approval-panel-container">
            <ModuleHeader 
                breadcrumb="Approval Control"
                title="Approval Control Panel"
                description="Govern platform-wide decisions, define chains, and manage pending approvals."
                badgeText="Governance Control"
                icon={CheckCircle}
                actions={[
                    { 
                        label: "Create Chain", 
                        icon: <Plus size={18} />, 
                        type: "primary",
                        onClick: () => console.log("Create Chain")
                    }
                ]}
            />

            <div className="approval-header-stats-wrapper">
                <div className="header-stats">
                    <div className="stat-item">
                        <span className="stat-value">12</span>
                        <span className="stat-label">Pending</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <span className="stat-value">84%</span>
                        <span className="stat-label">SLA Met</span>
                    </div>
                </div>
            </div>

            <div className="approval-tabs">
                <button 
                    className={`nav-tab ${activeTab === "pending" ? "active" : ""}`}
                    onClick={() => setActiveTab("pending")}
                >
                    <Clock size={18} />
                    Pending Requests
                </button>
                <button 
                    className={`nav-tab ${activeTab === "chains" ? "active" : ""}`}
                    onClick={() => setActiveTab("chains")}
                >
                    <Settings size={18} />
                    Approval Chains
                </button>
                <button 
                    className={`nav-tab ${activeTab === "history" ? "active" : ""}`}
                    onClick={() => setActiveTab("history")}
                >
                    <Shield size={18} />
                    Audit Logs
                </button>
            </div>

            <div className="approval-content">
                {activeTab === "pending" ? (
                    <div className="pending-section">
                        <div className="content-toolbar">
                            <div className="search-box">
                                <Search size={18} />
                                <input type="text" placeholder="Search approvals..." />
                            </div>
                            <div>
                                <button className="btn-secondary">
                                    <Filter size={16} />
                                    Filter
                                </button>
                            </div>
                        </div>

                        <div className="approvals-list">
                            {PENDING_APPROVALS.map((app) => (
                                <div key={app.id} className="approval-card">
                                    <div className="card-indicator" style={{ backgroundColor: app.type === "Rate Change" ? "#f5810c" : "#3b82f6" }}></div>
                                    <div className="card-main">
                                        <div className="card-info">
                                            <span className="app-type">{app.type}</span>
                                            <h3>{app.subject}</h3>
                                            <div className="app-meta">
                                                <span className="requested-by">By {app.requestedBy}</span>
                                                <span className="meta-dot"></span>
                                                <span className="app-date">{app.date}</span>
                                            </div>
                                        </div>
                                        <div className="card-actions">
                                            <button className="btn-reject">
                                                <Ban size={16} />
                                                Reject
                                            </button>
                                            <button className="btn-approve">
                                                <UserCheck size={16} />
                                                Approve
                                            </button>
                                            <button className="btn-more">
                                                <MoreVertical size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : activeTab === "chains" ? (
                    <div className="chains-section">
                        <div className="section-header">
                            <h3>Active Approval Chains</h3>
                            <button className="btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "var(--text-xs)" }}>
                                <Plus size={18} />
                                Create Chain
                            </button>
                        </div>

                        <div className="chains-grid">
                            {APPROVAL_CHAINS.map((chain) => (
                                <div key={chain.id} className="chain-card">
                                    <div className="chain-header">
                                        <h4>{chain.name}</h4>
                                        <div className="status-toggle">
                                            <span className="status-text">Active</span>
                                            <label className="toggle-switch">
                                                <input type="checkbox" checked={chain.isActive} />
                                                <span className="slider"></span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="chain-steps">
                                        {chain.steps.map((step, idx) => (
                                            <React.Fragment key={idx}>
                                                <div className="step-node">
                                                    <div className="step-number">{idx + 1}</div>
                                                    <span className="step-name">{step}</span>
                                                </div>
                                                {idx < chain.steps.length - 1 && (
                                                    <ArrowRight size={16} color="#cbd5e1" className="step-arrow" />
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                    <div className="chain-footer">
                                        <div className="conditions">
                                            <AlertTriangle size={14} color="#f5810c" />
                                            <span>2 logic conditions applied</span>
                                        </div>
                                        <button className="btn-link">Edit Logic</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="history-section">
                        <div className="tt-wrapper">
                            <table className="tt-table">
                                <thead>
                                    <tr className="tt-thead-tr">
                                        <th className="tt-th">ID</th>
                                        <th className="tt-th">Subject</th>
                                        <th className="tt-th">Requested By</th>
                                        <th className="tt-th">Status</th>
                                        <th className="tt-th">Type</th>
                                        <th className="tt-th">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[1, 2, 3].map((i) => (
                                        <tr key={i} className="tt-row">
                                            <td className="tt-td" style={{ textAlign: "center" }}>APP-{1000 + i}</td>
                                            <td className="tt-td">System Configuration Change #{i}</td>
                                            <td className="tt-td" style={{ textAlign: "center" }}>Admin User</td>
                                            <td className="tt-td" style={{ textAlign: "center" }}>
                                                <span className="status-tag Approved" style={{ background: "#dcfce7", color: "#166534" }}>Approved</span>
                                            </td>
                                            <td className="tt-td" style={{ textAlign: "center" }}>Security</td>
                                            <td className="tt-td" style={{ textAlign: "center" }}>2024-03-{20-i}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ApprovalPanel;
