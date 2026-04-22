import React, { useState } from "react";
import { 
    Clock, Search, Download, Filter, 
    User, ShieldAlert, FileSearch, ArrowUpRight,
    Activity, Calendar, ChevronLeft, ChevronRight,
    AlertCircle, FileText
} from "lucide-react";
import "./ComplianceAudit.css";
import ModuleHeader from "../ModuleHeader";

const AUDIT_LOGS = [
    { id: "log-1", user: "Admin User", action: "Updated Role Permissions", module: "Role Center", date: "2024-03-21 14:30", severity: "Medium", ip: "192.168.1.1" },
    { id: "log-2", user: "David Miller", action: "Deleted Talent Profile", module: "Talent Pool", date: "2024-03-21 12:15", severity: "High", ip: "45.22.11.90" },
    { id: "log-3", user: "System", action: "Auto-Match Triggered", module: "Intelligence", date: "2024-03-21 10:00", severity: "Low", ip: "INTERNAL" },
    { id: "log-4", user: "Sarah Jones", action: "Changed Job Status", module: "User Jobs", date: "2024-03-21 09:45", severity: "Low", ip: "10.0.0.122" },
    { id: "log-5", user: "Admin User", action: "Added New IP Restriction", module: "Security", date: "2024-03-20 17:30", severity: "High", ip: "192.168.1.1" },
];

function ComplianceAudit() {
    return (
        <div className="audit-container">
            <ModuleHeader 
                breadcrumb="Compliance & Audit"
                title="Compliance & Audit Center"
                description="Track all platform activities, monitor data changes, and export governance reports."
                badgeText="Governance & Traceability"
                icon={ShieldAlert}
                actions={[
                    { 
                        label: "Export Logs", 
                        icon: <Download size={16} />, 
                        type: "primary",
                        onClick: () => console.log("Export")
                    }
                ]}
            />

            <div className="audit-header-stats-wrapper">
                <div className="header-stats">
                    <div className="audit-stat">
                        <span className="stat-label">Logs Today</span>
                        <span className="stat-value">1,240</span>
                    </div>
                    <div className="audit-stat">
                        <span className="stat-label">Security Alerts</span>
                        <span className="stat-value text-red">3</span>
                    </div>
                </div>
            </div>

            <div className="audit-toolbar">
                <div className="search-box">
                    <Search size={18} />
                    <input type="text" placeholder="Search by user, action, or module..." />
                </div>
                <div className="toolbar-actions">
                    <button className="tool-btn">
                        <Calendar size={16} />
                        Date Range
                    </button>
                    <button className="tool-btn">
                        <Filter size={16} />
                        Filter
                    </button>
                    <button className="btn-primary">
                        <Download size={16} />
                        Export Logs
                    </button>
                </div>
            </div>

            <div className="audit-body">
                <div className="audit-table-wrapper">
                    <table className="audit-table">
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>User / Actor</th>
                                <th>Activity / Action</th>
                                <th>Module</th>
                                <th>Severity</th>
                                <th>IP Address</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {AUDIT_LOGS.map((log) => (
                                <tr key={log.id}>
                                    <td className="timestamp-cell">
                                        <Clock size={14} />
                                        {log.date}
                                    </td>
                                    <td>
                                        <div className="user-cell">
                                            <div className="user-avatar">{log.user.charAt(0)}</div>
                                            <span>{log.user}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="action-text">{log.action}</span>
                                    </td>
                                    <td>
                                        <span className="module-badge">{log.module}</span>
                                    </td>
                                    <td>
                                        <span className={`severity-tag ${log.severity.toLowerCase()}`}>
                                            {log.severity}
                                        </span>
                                    </td>
                                    <td><code>{log.ip}</code></td>
                                    <td>
                                        <button className="btn-view-details">
                                            <ArrowUpRight size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <footer className="audit-footer">
                    <div className="pagination-info">
                        Showing 1 to 50 of 4,829 entries
                    </div>
                    <div className="pagination-controls">
                        <button className="page-nav"><ChevronLeft size={18} /></button>
                        <button className="page-num active">1</button>
                        <button className="page-num">2</button>
                        <button className="page-num">3</button>
                        <span className="page-dots">...</span>
                        <button className="page-num">97</button>
                        <button className="page-nav"><ChevronRight size={18} /></button>
                    </div>
                </footer>
            </div>

            <section className="track-policies">
                <div className="section-title">
                    <AlertCircle size={20} color="#f97316" />
                    <h3>Automated Tracking Policies</h3>
                </div>
                <div className="policy-grid">
                    <div className="policy-card">
                        <div className="policy-meta">
                            <h4>PII Data Change Tracking</h4>
                            <p>Store before/after snapshots of any changes to sensitive talent data.</p>
                        </div>
                        <label className="toggle-switch">
                            <input type="checkbox" defaultChecked />
                            <span className="slider"></span>
                        </label>
                    </div>
                    <div className="policy-card">
                        <div className="policy-meta">
                            <h4>Failed Login Tracking</h4>
                            <p>Generate high-severity alerts after 5 consecutive failed login attempts.</p>
                        </div>
                        <label className="toggle-switch">
                            <input type="checkbox" defaultChecked />
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default ComplianceAudit;
