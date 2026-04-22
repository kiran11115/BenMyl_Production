import React from "react";
import { 
    Activity, Users, Zap, AlertCircle, 
    CheckCircle2, Server, Database, Cloud, 
    BarChart, TrendingUp, Clock, RefreshCcw
} from "lucide-react";
import "./SystemHealth.css";
import ModuleHeader from "../ModuleHeader";

const SYSTEM_STATUS = [
    { id: "api", name: "Core API Services", icon: <Cloud size={18} />, status: "Operational", latency: "45ms" },
    { id: "db", name: "Primary Database", icon: <Database size={18} />, status: "Operational", latency: "12ms" },
    { id: "ai", name: "AI Match Engine", icon: <Zap size={18} />, status: "Operational", latency: "850ms" },
    { id: "auth", name: "Auth & Identity", icon: <Server size={18} />, status: "Operational", latency: "28ms" },
];

const RECENT_ERRORS = [
    { id: "err-1", code: "503", message: "AI Engine connection timeout", time: "5 mins ago", severity: "High" },
    { id: "err-2", code: "401", message: "Unauthorized API attempt (IP Blocked)", time: "12 mins ago", severity: "Medium" },
    { id: "err-3", code: "404", message: "Talent profile asset not found", time: "24 mins ago", severity: "Low" },
];

function SystemHealth() {
    return (
        <div className="system-health-container">
            <ModuleHeader 
                breadcrumb="System Health"
                title="System Health & Usage"
                description="Real-time visibility into platform performance, API consumption, and infrastructure status."
                badgeText="Live Monitoring"
                icon={Activity}
                actions={[
                    { 
                        label: "Refresh Data", 
                        icon: <RefreshCcw size={16} />, 
                        type: "secondary",
                        onClick: () => console.log("Refresh")
                    }
                ]}
            />

            <div className="last-sync-wrapper">
                <div className="last-sync">Last updated: Just now</div>
            </div>

            <div className="status-grid">
                {SYSTEM_STATUS.map((service) => (
                    <div key={service.id} className="status-card">
                        <div className="service-info">
                            <div className="service-icon">{service.icon}</div>
                            <div>
                                <h3>{service.name}</h3>
                                <div className="latency-info">
                                    <Clock size={12} />
                                    <span>{service.latency} response time</span>
                                </div>
                            </div>
                        </div>
                        <div className="status-indicator">
                            <CheckCircle2 size={16} />
                            <span>{service.status}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="usage-metrics">
                <div className="metric-card">
                    <div className="metric-header">
                        <div className="metric-title">
                            <Users size={20} color="#3b82f6" />
                            <span>Active Sessions</span>
                        </div>
                        <span className="trend positive">+12%</span>
                    </div>
                    <div className="metric-value">1,482</div>
                    <div className="metric-subtext">Peak usage: 1,840 (Today)</div>
                </div>

                <div className="metric-card">
                    <div className="metric-header">
                        <div className="metric-title">
                            <Zap size={20} color="#f59e0b" />
                            <span>API Requests</span>
                        </div>
                        <span className="trend positive">+5.2%</span>
                    </div>
                    <div className="metric-value">245.8k</div>
                    <div className="metric-subtext">Avg 12.4k requests / hour</div>
                </div>

                <div className="metric-card">
                    <div className="metric-header">
                        <div className="metric-title">
                            <AlertCircle size={20} color="#ef4444" />
                            <span>System Error Rate</span>
                        </div>
                        <span className="trend negative">-0.4%</span>
                    </div>
                    <div className="metric-value">0.02%</div>
                    <div className="metric-subtext">Critical SLA: 99.9% uptime</div>
                </div>
            </div>

            <div className="health-bottom-grid">
                <div className="usage-chart-box">
                    <div className="box-header">
                        <BarChart size={20} />
                        <h3>Activity Trends (24h)</h3>
                    </div>
                    <div className="chart-placeholder">
                        <div className="bar-grid">
                            {[40, 60, 45, 90, 65, 80, 50, 70, 85, 45, 60, 75, 40, 55, 95, 70, 60, 40].map((h, i) => (
                                <div key={i} className="bar" style={{ height: `${h}%` }}></div>
                            ))}
                        </div>
                        <div className="chart-labels">
                            <span>00:00</span>
                            <span>06:00</span>
                            <span>12:00</span>
                            <span>18:00</span>
                        </div>
                    </div>
                </div>

                <div className="error-logs-box">
                    <div className="box-header">
                        <AlertCircle size={20} />
                        <h3>Recent Anomalies</h3>
                    </div>
                    <div className="error-feed">
                        {RECENT_ERRORS.map((error) => (
                            <div key={error.id} className={`error-item ${error.severity.toLowerCase()}`}>
                                <div className="error-code">{error.code}</div>
                                <div className="error-details">
                                    <p className="error-msg">{error.message}</p>
                                    <span className="error-time">{error.time}</span>
                                </div>
                                <div className="error-severity">{error.severity}</div>
                            </div>
                        ))}
                    </div>
                    <button className="view-all-logs">View Full Stack Trace</button>
                </div>
            </div>
        </div>
    );
}

export default SystemHealth;
