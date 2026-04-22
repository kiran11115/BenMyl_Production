import React, { useState } from "react";
import { 
    Link, Globe, Key, Webhook, 
    RefreshCw, Plus, MoreVertical, CheckCircle2, 
    Clock, Loader2, Save, RotateCcw, ShieldCheck,
    Cloud, Settings, Trash2
} from "lucide-react";
import "./IntegrationControl.css";
import ModuleHeader from "../ModuleHeader";

const INTEGRATIONS = [
    { id: "linkedin", name: "LinkedIn Recruiter", type: "Social", status: "Connected", lastSync: "12 mins ago", icon: <Globe size={20} /> },
    { id: "gmail", name: "Google Workspace", type: "Email", status: "Connected", lastSync: "1 hour ago", icon: <Cloud size={20} /> },
    { id: "slack", name: "Slack Notifications", type: "Messaging", status: "Disconnected", lastSync: "Never", icon: <Webhook size={20} /> },
    { id: "twilio", name: "Twilio SMS", type: "Communications", status: "Connected", lastSync: "5 mins ago", icon: <Link size={20} /> },
];

function IntegrationControl() {
    const [activeTab, setActiveTab] = useState("apps");

    return (
        <div className="integration-container">
            <ModuleHeader 
                breadcrumb="Integrations"
                title="Integration Control Center"
                description="Manage third-party connections, system API keys, and automated webhooks."
                badgeText="External Ecosystem"
                icon={Link}
                actions={[
                    { 
                        label: "Sync All", 
                        icon: <RotateCcw size={16} />, 
                        type: "secondary",
                        onClick: () => console.log("Sync All")
                    },
                    { 
                        label: "New Integration", 
                        icon: <Plus size={16} />, 
                        type: "primary",
                        onClick: () => console.log("New Integration")
                    }
                ]}
            />

            <div className="integration-tabs">
                <button 
                    className={`nav-tab ${activeTab === "apps" ? "active" : ""}`}
                    onClick={() => setActiveTab("apps")}
                >
                    <Cloud size={18} />
                    Connected Apps
                </button>
                <button 
                    className={`nav-tab ${activeTab === "api" ? "active" : ""}`}
                    onClick={() => setActiveTab("api")}
                >
                    <Key size={18} />
                    System API Keys
                </button>
                <button 
                    className={`nav-tab ${activeTab === "webhooks" ? "active" : ""}`}
                    onClick={() => setActiveTab("webhooks")}
                >
                    <Webhook size={18} />
                    Outgoing Webhooks
                </button>
            </div>

            <div className="integration-content">
                {activeTab === "apps" ? (
                    <div className="apps-grid">
                        {INTEGRATIONS.map((app) => (
                            <div key={app.id} className={`app-card ${app.status.toLowerCase()}`}>
                                <div className="app-card-header">
                                    <div className="app-icon">{app.icon}</div>
                                    <span className={`status-pill ${app.status.toLowerCase()}`}>
                                        {app.status === "Connected" ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                        {app.status}
                                    </span>
                                </div>
                                <div className="app-info">
                                    <h3>{app.name}</h3>
                                    <p>{app.type} Integration</p>
                                </div>
                                <div className="app-footer">
                                    <div className="sync-info">
                                        <RefreshCw size={12} />
                                        <span>Synced: {app.lastSync}</span>
                                    </div>
                                    <button className="app-settings">
                                        <Settings size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : activeTab === "api" ? (
                    <div className="api-section">
                        <div className="section-header">
                            <h3>Secret API Keys</h3>
                            <p>Use these keys to authenticate external tools with the BenMyl platform.</p>
                        </div>
                        <div className="api-keys-list">
                            <div className="api-key-item">
                                <div className="key-info">
                                    <div className="key-name">Production Main Key</div>
                                    <div className="key-mask">bm_live_•••••••••••••••••••••••••••••7f8c</div>
                                </div>
                                <div className="key-meta">
                                    <span className="key-date">Created: Mar 10, 2024</span>
                                    <div className="key-actions">
                                        <button className="btn-icon">Copy</button>
                                        <button className="btn-icon text-red">Revoke</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="security-notice">
                            <ShieldCheck size={18} />
                            <span>Never share your secret keys. Rotating keys will immediately disconnect any tool using them.</span>
                        </div>
                    </div>
                ) : (
                    <div className="webhooks-section">
                        <table className="webhooks-table">
                            <thead>
                                <tr>
                                    <th>Event Trigger</th>
                                    <th>Endpoint URL</th>
                                    <th>Method</th>
                                    <th>Latest Delivery</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>talent.created</strong></td>
                                    <td><code>https://crm.external.com/webhooks/talent</code></td>
                                    <td>POST</td>
                                    <td>2 mins ago</td>
                                    <td><span className="status-badge success">200 OK</span></td>
                                    <td><button className="btn-icon"><Trash2 size={16} /></button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default IntegrationControl;
