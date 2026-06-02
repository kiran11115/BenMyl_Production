import React, { useState } from "react";
import { 
    GitBranch, Plus, ChevronRight, Settings, 
    Trash2, AlertCircle, CheckCircle2, UserCheck, 
    FileText, Briefcase, Users, MoveRight, Search, Save
} from "lucide-react";
import "./WorkflowConfig.css";
import ModuleHeader from "../ModuleHeader";

const INITIAL_STAGES = [
    { id: "s1", name: "Application Received", color: "#64748b", icon: <FileText size={18} />, mandatory: true },
    { id: "s2", name: "Initial Screening", color: "#3b82f6", icon: <Search size={18} />, mandatory: false },
    { id: "s3", name: "Internal Interview", color: "#8b5cf6", icon: <Users size={18} />, mandatory: true },
    { id: "s4", name: "Client Submission", color: "#f59e0b", icon: <Briefcase size={18} />, mandatory: true },
    { id: "s5", name: "Interview Scheduled", color: "#06b6d4", icon: <CheckCircle2 size={18} />, mandatory: false },
    { id: "s6", name: "Hired", color: "#10b981", icon: <UserCheck size={18} />, mandatory: true },
];

function WorkflowConfig() {
    const [activeTab, setActiveTab] = useState("talent"); // talent or job
    const [stages, setStages] = useState(INITIAL_STAGES);

    return (
        <div className="workflow-config-container">
            <ModuleHeader 
                breadcrumb="Workflow Configuration"
                title="Workflow Configuration"
                description="Customize the lifecycle stages and transitions for talent and jobs."
                badgeText="Workflow Engine"
                icon={GitBranch}
                actions={[
                    { 
                        label: "Save Workflow", 
                        icon: <Save size={16} />, 
                        type: "primary",
                        onClick: () => console.log("Workflow Saved")
                    }
                ]}
            />

            <div className="tab-switcher">
                <button 
                    className={`tab-btn ${activeTab === "talent" ? "active" : ""}`}
                    onClick={() => setActiveTab("talent")}
                >
                    Talent Lifecycle
                </button>
                <button 
                    className={`tab-btn ${activeTab === "job" ? "active" : ""}`}
                    onClick={() => setActiveTab("job")}
                >
                    Job Lifecycle
                </button>
            </div>

            <div className="workflow-content">
                <div className="workflow-visualizer">
                    <h3>Visual Process Map</h3>
                    <div className="stages-flow">
                        {stages.map((stage, index) => (
                            <React.Fragment key={stage.id}>
                                <div className="stage-node-wrapper">
                                    <div className="stage-node" style={{ borderColor: stage.color }}>
                                        <div className="stage-icon" style={{ backgroundColor: stage.color + "1a", color: stage.color }}>
                                            {stage.icon}
                                        </div>
                                        <div className="stage-info">
                                            <span className="stage-name">{stage.name}</span>
                                            {stage.mandatory && <span className="mandatory-tag">Mandatory</span>}
                                        </div>
                                        <button className="node-settings">
                                            <Settings size={14} />
                                        </button>
                                    </div>
                                </div>
                                {index < stages.length - 1 && (
                                    <div className="flow-arrow">
                                        <MoveRight size={20} color="#cbd5e1" />
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                        <button className="add-stage-node">
                            <Plus size={20} />
                            <span>Add Stage</span>
                        </button>
                    </div>
                </div>

                <div className="stages-management">
                    <div className="section-header">
                        <h3>Detailed Stage Settings</h3>
                        <button className="btn-save">Save Workflow</button>
                    </div>
                    
                    <div className="stages-table-container">
                        <table className="stages-table">
                            <thead>
                                <tr>
                                    <th>Stage Name</th>
                                    <th>Status</th>
                                    <th>Requirements</th>
                                    <th>Transition Permissions</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stages.map((stage) => (
                                    <tr key={stage.id}>
                                        <td>
                                            <div className="stage-cell">
                                                <div className="stage-dot" style={{ backgroundColor: stage.color }}></div>
                                                <input type="text" defaultValue={stage.name} />
                                            </div>
                                        </td>
                                        <td>
                                            <select className="status-select">
                                                <option>Enabled</option>
                                                <option>Disabled</option>
                                            </select>
                                        </td>
                                        <td>
                                            <div className="checkbox-group">
                                                <label>
                                                    <input type="checkbox" checked={stage.mandatory} />
                                                    Mandatory
                                                </label>
                                                <label>
                                                    <input type="checkbox" />
                                                    Requires Approval
                                                </label>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="roles-tags">
                                                <span className="role-tag">Admin</span>
                                                <span className="role-tag">Hiring Manager</span>
                                            </div>
                                        </td>
                                        <td>
                                            <button className="btn-icon text-red">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="automation-rules">
                    <div className="rules-header">
                        <AlertCircle size={18} color="#5a5de8" />
                        <h3>Smart Transitions</h3>
                    </div>
                    <div className="rules-grid">
                        <div className="rule-card">
                            <h4>Auto-Move to "Screening"</h4>
                            <p>Automatically move talent to screening stage when profile completion is 80%.</p>
                            <label className="toggle-switch">
                                <input type="checkbox" defaultChecked />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <div className="rule-card">
                            <h4>Approval Lock</h4>
                            <p>Require Admin approval before moving talent to "Hired" stage.</p>
                            <label className="toggle-switch">
                                <input type="checkbox" defaultChecked />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WorkflowConfig;
