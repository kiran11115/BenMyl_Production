import React, { useState, useMemo, useEffect } from "react";
import { toast } from "react-toastify";
import { 
    Shield, ShieldCheck, UserPlus, Search, 
    MoreVertical, ChevronRight, Save, RotateCcw,
    Eye, Edit, CheckCircle2, Trash2, Layout, Users
} from "lucide-react";
import "./RoleConfiguration.css";
import ModuleHeader from "../ModuleHeader";
import { useRoleListDetailsQuery, useMembersListQuery, useSaveUserPermissionsMutation, useGetUserPermissionsQuery } from "../../../../State-Management/Api/PermissionsApiSlice";

const MODULE_PERMISSIONS = [
    { id: "dashboard", name: "Main Dashboard", icon: <Layout size={18} />, moduleId: 1 },
    { id: "talent", name: "Talent Pool", icon: <Layout size={18} />, moduleId: 2 },
    { id: "jobs", name: "Job Management", icon: <Layout size={18} />, moduleId: 3 },
    { id: "projects", name: "Projects", icon: <Layout size={18} />, moduleId: 4 },
    { id: "contracts", name: "Contracts", icon: <Layout size={18} />, moduleId: 5 },
    { id: "analytics", name: "Analytics", icon: <Layout size={18} />, moduleId: 6 },
];

function RoleConfiguration() {
    const [selectedRole, setSelectedRole] = useState({ id: "", name: "Loading..." });
    const [permissions, setPermissions] = useState({});
    const [selectedTeamMember, setSelectedTeamMember] = useState("");

    const emailID = localStorage.getItem("Email");

    const { data: rolesApiData, isLoading: isRolesLoading } = useRoleListDetailsQuery();
    const [saveUserPermissions, { isLoading: isSaving }] = useSaveUserPermissionsMutation();

    const rolesList = useMemo(() => {
        if (!rolesApiData) return [];
        const raw = Array.isArray(rolesApiData) ? rolesApiData : rolesApiData.data || [];
        return raw.map(r => ({
            id: r.roleId || r.id,
            name: r.roleName || r.name,
            type: "Standard", 
            status: "Active"
        }));
    }, [rolesApiData]);

    useEffect(() => {
        if (rolesList.length > 0 && selectedRole.id === "") {
            setSelectedRole(rolesList[0]);
        }
    }, [rolesList, selectedRole.id]);

    const {
        data: teamApiData = [],
        isLoading: isTeamLoading,
    } = useMembersListQuery(selectedRole.name, {
        skip: !selectedRole.name || selectedRole.name === 'Loading...',
        refetchOnMountOrArgChange: true
    });

    const adminEmail = localStorage.getItem("Email");
    const adminDomain = adminEmail?.includes("@") ? adminEmail.split("@")[1] : "";

    const filteredTeamMembers = useMemo(() => {
        const dataList = Array.isArray(teamApiData) ? teamApiData : (teamApiData?.data || teamApiData?.value || []);
        
        if (!adminDomain) return dataList;

        return dataList.filter(member => {
            const memberEmail = member.emailID || member.email || "";
            return memberEmail.toLowerCase().endsWith(`@${adminDomain.toLowerCase()}`);
        });
    }, [teamApiData, adminDomain]);

    const { data: userPermissionsData } = useGetUserPermissionsQuery(selectedTeamMember, {
        skip: !selectedTeamMember,
    });

    useEffect(() => {
        setSelectedTeamMember("");
    }, [selectedRole]);

    const isTruthy = (value) => {
        if (value === true || value === 1) return true;
        if (value === false || value === 0 || value === null || value === undefined) return false;
        const strValue = String(value).toLowerCase().trim();
        return strValue === 'true' || strValue === '1' || strValue === 'yes';
    };

    useEffect(() => {
        if (selectedTeamMember && userPermissionsData && Array.isArray(userPermissionsData)) {
            const newPermissions = {};
            userPermissionsData.forEach(p => {
                const mod = MODULE_PERMISSIONS.find(m => m.moduleId === p.moduleId || m.name === p.moduleName);
                if (mod) {
                    newPermissions[`${mod.id}_view`] = isTruthy(p.canView);
                    newPermissions[`${mod.id}_edit`] = isTruthy(p.canEdit);
                    newPermissions[`${mod.id}_delete`] = isTruthy(p.canDelete);
                    newPermissions[`${mod.id}_approve`] = isTruthy(p.canApprove);
                    newPermissions[`${mod.id}_ui`] = isTruthy(p.isVisible);
                }
            });
            setPermissions(newPermissions);
        } else if (!selectedTeamMember) {
            setPermissions({});
        }
    }, [userPermissionsData, selectedTeamMember]);

    const handleSavePermissions = async () => {
        const payload = MODULE_PERMISSIONS.map((mod) => {
            return {
                authInfoID: selectedTeamMember ? parseInt(selectedTeamMember, 10) : 0,
                moduleId: mod.moduleId,
                moduleName: mod.name,
                canView: !!permissions[`${mod.id}_view`],
                canEdit: !!permissions[`${mod.id}_edit`],
                canDelete: !!permissions[`${mod.id}_delete`],
                canApprove: !!permissions[`${mod.id}_approve`],
                isVisible: !!permissions[`${mod.id}_ui`]
            };
        });

        try {
            await saveUserPermissions(payload).unwrap();
            toast.success("Permissions saved successfully!");
        } catch (error) {
            console.error("Failed to save permissions", error);
            toast.error("Failed to save permissions.");
        }
    };

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
                    {isRolesLoading ? (
                        <div style={{ padding: "20px", textAlign: "center", color: "#64748b" }}>Loading roles...</div>
                    ) : (
                        rolesList.map((role) => (
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
                        ))
                    )}
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
                            label: isSaving ? "Saving..." : "Save Changes", 
                            icon: <Save size={16} />, 
                            type: "primary",
                            onClick: handleSavePermissions
                        }
                    ]}
                />

                <div className="team-assignment-section" style={{ marginBottom: '24px', backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <Users size={18} style={{ color: '#0f172a' }} />
                        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', margin: 0 }}>Team Members in this Role</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#475569' }}>Select Member to configure specific overrides (Optional)</label>
                        <select 
                            value={selectedTeamMember} 
                            onChange={(e) => setSelectedTeamMember(e.target.value)}
                            style={{ 
                                padding: '10px 12px', 
                                borderRadius: '8px', 
                                border: '1px solid #cbd5e1', 
                                fontSize: '14px', 
                                color: '#334155', 
                                outline: 'none', 
                                backgroundColor: '#f8fafc',
                                width: '100%',
                                maxWidth: '400px',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="">Select a team member...</option>
                            {filteredTeamMembers.map(member => (
                                <option key={member.authInfoID || member.emailID} value={member.authInfoID || ""}>
                                    {member.fullName || member.name || member.emailID.split('@')[0]} - {member.emailID}
                                </option>
                            ))}
                        </select>
                        {filteredTeamMembers.length === 0 && !isTeamLoading && (
                            <span style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                                No active team members found with the role "{selectedRole.name}".
                            </span>
                        )}
                        {isTeamLoading && (
                            <span style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                                Loading team members...
                            </span>
                        )}
                    </div>
                </div>

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
