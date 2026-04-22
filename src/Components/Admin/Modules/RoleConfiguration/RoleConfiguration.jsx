import React, { useState } from "react";
import { 
    Shield, ShieldCheck, UserPlus, Search, 
    MoreVertical, ChevronRight, Save, RotateCcw,
    Eye, Edit, CheckCircle2, Trash2, Layout
} from "lucide-react";
import "./RoleConfiguration.css";
import ModuleHeader from "../ModuleHeader";

const INITIAL_ROLES = [
    { id: "hm", name: "Hiring Manager", type: "Standard", status: "Active" },
    { id: "bs", name: "Bench Sales", type: "Standard", status: "Active" },
    { id: "ca", name: "Consultant Admin", type: "Custom", status: "Active" },
];

const MODULE_PERMISSIONS = [
    { id: "dashboard", name: "Main Dashboard", icon: <Layout size={18} /> },
    { id: "talent", name: "Talent Pool", icon: <Layout size={18} /> },
    { id: "jobs", name: "Job Management", icon: <Layout size={18} /> },
    { id: "projects", name: "Projects", icon: <Layout size={18} /> },
    { id: "contracts", name: "Contracts", icon: <Layout size={18} /> },
    { id: "analytics", name: "Analytics", icon: <Layout size={18} /> },
];

function RoleConfiguration() {
    const [selectedRole, setSelectedRole] = useState(INITIAL_ROLES[0]);
    const [permissions, setPermissions] = useState({});

    const handleTogglePermission = (moduleId, action) => {
        setPermissions(prev => ({
            ...prev,
            [`${moduleId}_${action}`]: !prev[`${moduleId}_${action}`]
        }));
    };

    return (
        <div className="role-config-container">
            <div className="role-config-sidebar">
                <div className="sidebar-header">
                    <div className="header-top">
                        <h2>System Roles</h2>
                        <button className="add-role-btn">
                            <UserPlus size={18} />
                        </button>
                    </div>
                    <div className="search-box w-100">
                        <Search size={16} />
                        <input type="text" placeholder="Search roles..." />
                    </div>
                </div>

                <div className="role-list">
                    {INITIAL_ROLES.map((role) => (
                        <div 
                            key={role.id} 
                            className={`role-item ${selectedRole.id === role.id ? "active" : ""}`}
                            onClick={() => setSelectedRole(role)}
                        >
                            <div className="role-icon">
                                <Shield size={20} />
                            </div>
                            <div className="role-info">
                                <span className="role-name">{role.name}</span>
                                <span className="role-type">{role.type}</span>
                            </div>
                            <ChevronRight size={16} className="chevron" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="role-config-main">
                <ModuleHeader 
                    breadcrumb="Role Configuration"
                    title={selectedRole.name}
                    description="Set module-level access and feature capabilities for this role."
                    badgeText="Configuring Permissions"
                    icon={ShieldCheck}
                    actions={[
                        { 
                            label: "Reset Defaults", 
                            icon: <RotateCcw size={16} />, 
                            type: "secondary",
                            onClick: () => console.log("Reset")
                        },
                        { 
                            label: "Save Changes", 
                            icon: <Save size={16} />, 
                            type: "primary",
                            onClick: () => console.log("Saved")
                        }
                    ]}
                />

                <div className="tt-wrapper">
                    <table className="tt-table">
                        <thead>
                            <tr className="tt-thead-tr">
                                <th className="tt-th">Module / Feature</th>
                                <th className="tt-th">View</th>
                                <th className="tt-th">Edit</th>
                                <th className="tt-th">Approve</th>
                                <th className="tt-th">Delete</th>
                                <th className="tt-th">UI Visibility</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MODULE_PERMISSIONS.map((module) => (
                                <tr key={module.id} className="tt-row">
                                    <td className="tt-td">
                                        <div className="module-cell">
                                            <div className="module-icon">{module.icon}</div>
                                            <span>{module.name}</span>
                                        </div>
                                    </td>
                                    {["view", "edit", "approve", "delete", "ui"].map((action) => (
                                        <td key={action} className="tt-td" style={{ textAlign: "center" }}>
                                            <label className="toggle-switch">
                                                <input 
                                                    type="checkbox" 
                                                    checked={permissions[`${module.id}_${action}`] || false}
                                                    onChange={() => handleTogglePermission(module.id, action)}
                                                />
                                                <span className="slider"></span>
                                            </label>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="additional-settings">
                    <h3>Access Policies</h3>
                    <div className="settings-grid">
                        <div className="setting-card">
                            <div className="setting-info">
                                <h4>API Access</h4>
                                <p>Enable programmatic access via system API tokens.</p>
                            </div>
                            <label className="toggle-switch">
                                <input type="checkbox" />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <div className="setting-card">
                            <div className="setting-info">
                                <h4>MFA Requirement</h4>
                                <p>Force multi-factor authentication for this role.</p>
                            </div>
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

export default RoleConfiguration;
