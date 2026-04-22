import React, { useState } from "react";
import { 
    Zap, Plus, ArrowRight, Play, 
    Settings, MoreVertical, Trash2, AlertCircle,
    Bell, Mail, UserCheck, RefreshCw, Save, RotateCcw
} from "lucide-react";
import "./AutomationPanel.css";
import ModuleHeader from "../ModuleHeader";

const RULES = [
    { id: "r1", name: "Auto-Assign Hiring Manager", trigger: "Job Created", action: "Assign Dept Head", status: "Active" },
    { id: "r2", name: "Status Sync (Interview)", trigger: "Interview Scheduled", action: "Update Talent Status", status: "Active" },
    { id: "r3", name: "Slack Notification: Hired", trigger: "Talent Hired", action: "Send Slack Alert", status: "Inactive" },
];

function AutomationPanel() {
    return (
        <div className="automation-container">
            <ModuleHeader 
                breadcrumb="Automation"
                title="Automation Control Panel"
                description="Build IF/THEN rules to automate repetitive tasks and system status updates."
                badgeText="Workflow Automation"
                icon={Zap}
                actions={[
                    { 
                        label: "Reset", 
                        icon: <RotateCcw size={16} />, 
                        type: "secondary",
                        onClick: () => console.log("Reset")
                    },
                    { 
                        label: "Create New Rule", 
                        icon: <Plus size={16} />, 
                        type: "primary",
                        onClick: () => console.log("Create")
                    }
                ]}
            />

            <div className="automation-builder">
                <div className="builder-header">
                    <h3>Rule Builder</h3>
                    <div className="builder-mode">Visual Mode</div>
                </div>
                <div className="builder-visual">
                    <div className="logic-step trigger">
                        <div className="step-label">IF (Trigger)</div>
                        <div className="step-content">
                            <AlertCircle size={20} color="#f97316" />
                            <select defaultValue="talent_created">
                                <option value="talent_created">Talent Profile Created</option>
                                <option value="job_posted">New Job Posted</option>
                                <option value="interview_cancelled">Interview Cancelled</option>
                            </select>
                        </div>
                    </div>
                    <div className="logic-connector">
                        <ArrowRight size={24} color="#cbd5e1" />
                    </div>
                    <div className="logic-step action">
                        <div className="step-label">THEN (Action)</div>
                        <div className="step-content">
                            <Bell size={20} color="#3b82f6" />
                            <select defaultValue="notify_admin">
                                <option value="notify_admin">Send Admin Notification</option>
                                <option value="auto_match">Trigger Auto-Match</option>
                                <option value="slack_alert">Post to Slack Channel</option>
                            </select>
                        </div>
                    </div>
                    <button className="btn-add-logic">
                        <Plus size={16} />
                    </button>
                </div>
            </div>

            <div className="active-rules-section">
                <h3>Active Automations</h3>
                <div className="rules-list">
                    {RULES.map((rule) => (
                        <div key={rule.id} className="rule-item-card">
                            <div className="rule-info">
                                <div className="rule-status-dot" style={{ backgroundColor: rule.status === "Active" ? "#10b981" : "#cbd5e1" }}></div>
                                <div className="rule-text">
                                    <h4>{rule.name}</h4>
                                    <div className="rule-logic-summary">
                                        <span>{rule.trigger}</span>
                                        <ArrowRight size={12} />
                                        <span>{rule.action}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="rule-actions">
                                <label className="toggle-switch">
                                    <input type="checkbox" checked={rule.status === "Active"} />
                                    <span className="slider"></span>
                                </label>
                                <button className="btn-icon"><Settings size={16} /></button>
                                <button className="btn-icon text-red"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="automation-suggestions">
                <div className="suggestions-header">
                    <Zap size={18} color="#f59e0b" />
                    <h3>Smart Suggestions</h3>
                </div>
                <div className="suggestions-grid">
                    <div className="suggestion-card">
                        <p>Automatically move Talent to "Assigned" when they receive their 3rd invitation.</p>
                        <button className="btn-ghost">Add Rule</button>
                    </div>
                    <div className="suggestion-card">
                        <p>Archive Job posts after 60 days of inactivity.</p>
                        <button className="btn-ghost">Add Rule</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AutomationPanel;
