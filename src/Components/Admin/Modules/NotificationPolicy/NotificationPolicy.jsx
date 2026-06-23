import React from "react";
import { 
    Bell, Mail, Monitor, Smartphone, 
    AlertTriangle, Search, Save, 
    RotateCcw, Info, Settings2,
    Shield, User, ChevronRight, Globe, Database
} from "lucide-react";
import "./NotificationPolicy.css";
import ModuleHeader from "../ModuleHeader";

const NOTIFICATION_TRIGGERS = [
    { id: "t1", event: "New Talent Registered", category: "Acquisition" },
    { id: "t2", event: "Interview Request Received", category: "Hiring" },
    { id: "t3", event: "Submission Approved", category: "Approval" },
    { id: "t4", event: "Contract Expiration (30 days)", category: "Compliance" },
    { id: "t5", event: "Rate Threshold Breach", category: "Audit" },
];

function NotificationPolicy() {
    return (
        <div className="notification-containerOne">
            <div className="hero-section-wrapper mb-4">
                <div className="hero-card ">
                    <div className="hero-concentric-lines"></div>
                    <div className="hero-ripple-pattern"></div>
                    <div className="hero-circular-highlights"></div>
                    <div className="hero-left">
                        <div className="hero-pill">
                            ✦ Alert Management
                        </div>
                        <div className="hero-title-row">
                            <h1 className="job-posting-title text-white">Notification Policy Manager</h1>

                            <div className="hero-buttons" style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    type="button"
                                    className="routine-btn"
                                    onClick={() => console.log("Reset")}
                                    style={{ background: 'rgba(255, 255, 255, 0.12)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.15)' }}
                                >
                                    <RotateCcw size={16} /> Reset
                                </button>
                                <button
                                    type="button"
                                    className="routine-btn"
                                    onClick={() => console.log("Saved")}
                                >
                                    <Save size={16} /> Save Policies
                                </button>
                            </div>
                        </div>
                        <div className="hero-content-row">
                            <p className="job-posting-subtitle">
                                Configure how and when users receive system-wide alerts and communications.
                            </p>
                        </div>
                    </div>
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
            </div>

            <div className="policy-matrix-box">
                <div className="box-header">
                    <h3>Notification Preference Matrix</h3>
                    <div className="search-box">
                        <Search size={16} />
                        <input type="text" placeholder="Search triggers..." />
                    </div>
                </div>
                
                <div className="tt-wrapper">
                    <table className="tt-table">
                        <thead>
                            <tr className="tt-thead-tr">
                                <th className="tt-th">Event Trigger</th>
                                <th className="tt-th">Email</th>
                                <th className="tt-th">Web</th>
                                <th className="tt-th">Mobile</th>
                                <th className="tt-th">Internal</th>
                                <th className="tt-th">SMS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {NOTIFICATION_TRIGGERS.map((event, i) => (
                                <tr key={event.id} className="tt-row">
                                    <td className="tt-td">
                                        <div className="trigger-cell">
                                            <span className="trigger-name">{event.event}</span>
                                            <span className="trigger-cat">{event.category}</span>
                                        </div>
                                    </td>
                                    {["email", "web", "mobile", "internal", "sms"].map((type) => (
                                        <td key={type} className="tt-td" style={{ textAlign: "center" }}>
                                            <label className="pref-checkbox">
                                                <input type="checkbox" defaultChecked={i % 2 === 0} />
                                                <div className="check-box">
                                                    {type === "email" ? <Mail size={14} /> : 
                                                     type === "web" ? <Globe size={14} /> : 
                                                     type === "mobile" ? <Smartphone size={14} /> : 
                                                     type === "internal" ? <Shield size={14} /> : <Database size={14} />}
                                                </div>
                                            </label>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="notification-bottom-grid">
                <section className="escalation-rules">
                    <div className="section-title">
                        <AlertTriangle size={18} color="#f5810c" />
                        <h3>Escalation Rules</h3>
                    </div>
                    <div className="rules-stack">
                        <div className="escalation-card">
                            <div className="rule-info">
                                <h5>No Response after 24h</h5>
                                <p>If a critical alert is not seen, escalate to Department Head.</p>
                            </div>
                            <button className="btn-edit-rule"><ChevronRight size={18} /></button>
                        </div>
                        <div className="escalation-card">
                            <div className="rule-info">
                                <h5>Pending Approval (48h)</h5>
                                <p>Send high-priority reminder email and Slack alert.</p>
                            </div>
                            <button className="btn-edit-rule"><ChevronRight size={18} /></button>
                        </div>
                    </div>
                </section>

                <section className="role-preferences">
                    <div className="section-title">
                        <Settings2 size={18} color="#0f172a" />
                        <h3>Default Role Preferences</h3>
                    </div>
                    <div className="roles-grid">
                        <div className="role-pref-card">
                            <Shield size={20} color="#0f172a" />
                            <div className="role-text">
                                <h4>Admin</h4>
                                <p>All notifications enabled by default.</p>
                            </div>
                        </div>
                        <div className="role-pref-card">
                            <User size={20} color="#f5810c" />
                            <div className="role-text">
                                <h4>Hiring Manager</h4>
                                <p>Filtered by project assignment.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default NotificationPolicy;
