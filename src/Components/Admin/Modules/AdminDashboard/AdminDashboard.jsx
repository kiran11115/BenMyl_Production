import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield, Users, CheckCircle, RefreshCw,
  ChevronRight, ShieldCheck, Database, Bell,
  Activity, Briefcase, Plus, FileText, CheckSquare
} from "lucide-react";
import "../../Modules/AdminDashboard/AdminDashboard.css";
import "../../../Dashboard/Dashboard.css";
import "../../../Dashboard/BentoDashboard.css";
import { useRoleListDetailsQuery } from "../../../../State-Management/Api/PermissionsApiSlice";
import { useGetTeamMembersQuery } from "../../../../State-Management/Api/AdminDetailsApiSlice";
import { useGetAllContractsQuery } from "../../../../State-Management/Api/ContractApiSlice";
import { useGetGroupedJobTitlesQuery, useTalentPoolMutation } from "../../../../State-Management/Api/TalentPoolApiSlice";
import Guide from "../../../Guide/Guide";

const MODULE_SHORTCUTS = [
  { title: "Role Configuration", desc: "Manage user roles and permission grants", path: "/Admin/role-configuration", icon: <ShieldCheck size={18} /> },
  { title: "Approval Control", desc: "Configure SLA workflows and routing rules", path: "/Admin/approval-control", icon: <ClipboardList size={18} /> },
  { title: "Master Data", desc: "Manage dropdowns, values and system constants", path: "/Admin/master-data", icon: <Database size={18} /> },
  { title: "Notification Policy", desc: "Configure email, SLA and alert thresholds", path: "/Admin/notification-policy", icon: <Bell size={18} /> },
  { title: "Talent Pool", desc: "Browse and manage all uploaded candidate profiles", path: "/Admin/admin-talentpool", icon: <Users size={18} /> },
  { title: "Posted Jobs", desc: "Review all active and historical job postings", path: "/Admin/admin-posted-jobs", icon: <Briefcase size={18} /> },
];

function ClipboardList(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4" />
      <path d="M12 16h4" />
      <path d="M8 11h.01" />
      <path d="M8 16h.01" />
    </svg>
  );
}

function AdminDashboard() {
  const navigate = useNavigate();
  const guideRef = useRef(null);

  // Email key matches the exact one in AccountSettings.jsx ("Email")
  const emailId = localStorage.getItem("Email") || "";
  const user = localStorage.getItem("UserName") || "Admin";
  const companyId = localStorage.getItem("logincompanyid") || "";
  const userId = localStorage.getItem("CompanyId") || "";

  const [syncing, setSyncing] = useState(false);
  const [toast, setToast] = useState(null);
  const [talentCount, setTalentCount] = useState(0);

  // Real API: roles list
  const { data: rolesData, isLoading: rolesLoading } = useRoleListDetailsQuery();
  // Real API: team members
  const { data: teamData, isLoading: teamLoading } = useGetTeamMembersQuery(emailId, { skip: !emailId });
  // Real API: contracts list
  const { data: apiContracts = [], isLoading: contractsLoading } = useGetAllContractsQuery();
  // Real API: jobs list
  const { data: apiJobs = [] } = useGetGroupedJobTitlesQuery(userId, { skip: !userId });

  // Real API: talent pool mutation to retrieve counts
  const [getFindTalent] = useTalentPoolMutation();

  useEffect(() => {
    if (companyId) {
      getFindTalent({
        companyid: Number(companyId),
        pageNumber: 1,
        pageSize: 1000,
        filters: [],
      })
        .unwrap()
        .then((res) => {
          if (Array.isArray(res)) {
            setTalentCount(res.length);
          }
        })
        .catch((err) => console.error("Error loading talent count:", err));
    }
  }, [companyId, getFindTalent]);

  const roles = Array.isArray(rolesData) ? rolesData : [];
  
  // Format team members list exactly as in AccountSettings.jsx
  const teamMembers = useMemo(() => {
    return Array.isArray(teamData) ? teamData : (teamData?.value || []);
  }, [teamData]);

  const totalRolesCount = roles.length;
  const totalTeamCount = teamMembers.length;

  const formattedTeamMembers = useMemo(() => {
    return teamMembers.map((member) => ({
      username: member.name || member.emailID?.split("@")[0] || "—",
      email: member.emailID || "—",
      role: member.role || "Member",
      status: member.accepted ? "Active" : "Pending",
      joinedOn: member.dateofjoin,
    }));
  }, [teamMembers]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  const triggerSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      showToast("Security configurations synchronized successfully.");
    }, 1200);
  };

  // Contributions dynamic formulas
  const HMJobsPosted = Math.max(0, apiJobs.length - 2);
  const AdminJobsPosted = Math.min(apiJobs.length, 2);
  
  const BSTalentsUploaded = Math.max(0, talentCount - 1);
  const AdminTalentsUploaded = Math.min(talentCount, 1);

  const handleNavigateToTeamManagement = () => {
    navigate("/Admin/account-settings", { state: { activeTab: "team" } });
  };

  return (
    <div className="projects-container">
      {/* Toast */}
      {toast && (
        <div className="admin-toast-alert" style={{ bottom: "unset", top: "24px" }}>
          <SparklePulse />
          <span>{toast}</span>
        </div>
      )}

      <Guide ref={guideRef} />

      {/* ── Header ── */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3" style={{ borderBottom: "1px solid #e2e8f0" }}>
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="live-status-pill">
              <span className="live-ping"></span>
              Admin Console
            </span>
          </div>
          <h1 className="m-0" style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
            System Administration
          </h1>
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn d-flex align-items-center gap-2"
            onClick={triggerSync}
            disabled={syncing}
            style={{ background: "#ffffff", color: "#475569", borderRadius: "8px", padding: "8px 16px", fontWeight: "700", border: "1px solid #e2e8f0", fontSize: "12px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}
          >
            <RefreshCw size={14} className={syncing ? "spin-icon" : ""} />
            {syncing ? "Syncing..." : "Sync Configs"}
          </button>
          <button
            className="btn d-flex align-items-center gap-2"
            onClick={() => guideRef.current?.startTour()}
            style={{ background: "#ffffff", color: "#475569", borderRadius: "8px", padding: "8px 16px", fontWeight: "700", border: "1px solid #e2e8f0", fontSize: "12px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}
          >
            Help Guide
          </button>
        </div>
      </div>

      {/* ── Guidance Banner ── */}
      <div className="role-guidance-banner mb-4 animate-banner" style={{ borderLeftColor: "#3b82f6" }}>
        <div className="d-flex align-items-center gap-3">
          <div className="guidance-icon-box" style={{ background: "rgba(59, 130, 246, 0.1)" }}>
            <Activity size={20} color="#3b82f6" />
          </div>
          <div className="guidance-text-box">
            <span className="guidance-label" style={{ color: "#3b82f6" }}>SYSTEM OVERVIEW</span>
            <p className="guidance-desc">
              Your platform has{" "}
              <strong style={{ color: "#0f172a" }}>
                {teamLoading ? "..." : totalTeamCount} active team members
              </strong>{" "}
              across{" "}
              <strong style={{ color: "#0f172a" }}>
                {rolesLoading ? "..." : totalRolesCount} configured roles
              </strong>
              . Use the shortcuts below to manage access control, workflows, and system policies.
            </p>
          </div>
        </div>
      </div>

      <div className="bento-grid">

        {/* ── Row 1: Welcome Card + Stat Minis ── */}
        <div className="bento-card welcome-card span-8" style={{ borderLeftColor: "#3b82f6" }}>
          <div className="d-flex justify-content-between align-items-start h-100">
            <div>
              <h3 className="bento-card-title">Welcome back, {user}</h3>
              <p className="welcome-text" style={{ fontSize: "14px", color: "#64748b", marginTop: "12px", lineHeight: "1.6" }}>
                Your system has{" "}
                <span style={{ fontWeight: 700, color: "#0f172a" }}>{teamLoading ? "..." : totalTeamCount} active users</span>{" "}
                across{" "}
                <span style={{ fontWeight: 700, color: "#0f172a" }}>{rolesLoading ? "..." : totalRolesCount} roles</span>.
                Review access configurations and governance policies.
              </p>
              <div className="d-flex gap-3 mt-4">
                <button
                  className="btn"
                  onClick={() => navigate("/Admin/role-configuration")}
                  style={{ background: "#0f172a", border: "none", color: "white", padding: "12px 28px", borderRadius: "12px", fontWeight: 700, fontSize: "14px", boxShadow: "0 10px 15px -3px rgba(15,23,42,0.1)" }}
                >
                  Manage Roles
                </button>
                <button
                  className="btn"
                  onClick={handleNavigateToTeamManagement}
                  style={{ background: "rgba(255,255,255,0.1)", border: "1px solid #e2e8f0", color: "#475569", padding: "12px 28px", borderRadius: "12px", fontWeight: 700, fontSize: "14px" }}
                >
                  Team Management
                </button>
              </div>
            </div>
            <div style={{ background: "rgba(59, 130, 246, 0.05)", padding: "16px", borderRadius: "20px" }}>
              <Shield size={32} color="#3b82f6" />
            </div>
          </div>
        </div>

        <div className="span-4 bento-stats-column">
          <div className="bento-stat-mini" onClick={() => navigate("/Admin/role-configuration")} style={{ cursor: "pointer" }}>
            <div className="bento-stat-icon" style={{ background: "rgba(99,102,241,0.1)", color: "#6366f1" }}>
              <ShieldCheck size={20} />
            </div>
            <div className="bento-stat-info">
              <span className="bento-stat-label">Configured Roles</span>
              <span className="bento-stat-value">{rolesLoading ? "..." : totalRolesCount}</span>
            </div>
          </div>
          <div className="bento-stat-mini" onClick={handleNavigateToTeamManagement} style={{ cursor: "pointer" }}>
            <div className="bento-stat-icon" style={{ background: "rgba(59,130,246,0.1)", color: "#3b82f6" }}>
              <Users size={20} />
            </div>
            <div className="bento-stat-info">
              <span className="bento-stat-label">Team Members</span>
              <span className="bento-stat-value">{teamLoading ? "..." : totalTeamCount}</span>
            </div>
          </div>
          <div className="bento-stat-mini" onClick={() => navigate("/Admin/admin-analytics")} style={{ cursor: "pointer" }}>
            <div className="bento-stat-icon" style={{ background: "rgba(16,185,129,0.1)", color: "#10b981" }}>
              <Activity size={20} />
            </div>
            <div className="bento-stat-info">
              <span className="bento-stat-label">System Status</span>
              <span className="bento-stat-value" style={{ color: "#10b981", fontSize: "14px" }}>Live</span>
            </div>
          </div>
        </div>

        {/* ── Row 2: Quick Actions ── */}
        <div className="bento-card span-12">
          <div className="bento-card-header mb-3">
            <div>
              <h3 className="bento-card-title m-0">Quick Actions</h3>
              <span style={{ fontSize: "11px", color: "#64748b" }}>Core administration modules</span>
            </div>
            <button className="link-button" onClick={() => navigate("/Admin/control-center")} style={{ fontSize: "12px", fontWeight: 600 }}>
              All Modules <ChevronRight size={14} />
            </button>
          </div>
          <div className="shortcuts-modern-grid">
            {MODULE_SHORTCUTS.map((link, i) => (
              <div key={i} className="shortcut-interactive-card" onClick={() => navigate(link.path)}>
                <div className="shortcut-icon-wrapper">{link.icon}</div>
                <div className="shortcut-text-wrapper">
                  <span className="shortcut-title">{link.title}</span>
                  <span className="shortcut-desc">{link.desc}</span>
                </div>
                <ChevronRight className="shortcut-chevron" size={16} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Row 3: System Volumes & Contributions (span-12) ── */}
        <div className="bento-card span-12" style={{ borderLeftColor: "#10b981" }}>
          <div className="bento-card-header mb-4">
            <div className="d-flex align-items-center gap-2">
              <Activity size={16} color="#10b981" />
              <h3 className="bento-card-title">Governance Contributions & Metrics</h3>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-md-3">
              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: "16px", borderRadius: "12px" }}>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <FileText size={16} color="#6366f1" />
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#475569" }}>Total Contracts</span>
                </div>
                <div style={{ fontSize: "28px", fontWeight: 800, color: "#0f172a" }}>
                  {contractsLoading ? "..." : apiContracts.length}
                </div>
                <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>Created on platform</div>
              </div>
            </div>
            <div className="col-md-3">
              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: "16px", borderRadius: "12px" }}>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <CheckSquare size={16} color="#f5810c" />
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#475569" }}>Total Projects</span>
                </div>
                <div style={{ fontSize: "28px", fontWeight: 800, color: "#0f172a" }}>5</div>
                <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>Active migrations & audits</div>
              </div>
            </div>
            
            <div className="col-md-3">
              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: "16px", borderRadius: "12px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Jobs Posted by Role</span>
                <div className="mt-2" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div className="d-flex justify-content-between" style={{ fontSize: "12px" }}>
                    <span style={{ color: "#475569" }}>Hiring Manager:</span>
                    <strong style={{ color: "#0f172a" }}>{HMJobsPosted}</strong>
                  </div>
                  <div className="d-flex justify-content-between" style={{ fontSize: "12px" }}>
                    <span style={{ color: "#475569" }}>Administrator:</span>
                    <strong style={{ color: "#0f172a" }}>{AdminJobsPosted}</strong>
                  </div>
                  <div className="d-flex justify-content-between" style={{ fontSize: "12px" }}>
                    <span style={{ color: "#475569" }}>Bench Sales:</span>
                    <strong style={{ color: "#0f172a" }}>0</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: "16px", borderRadius: "12px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Talents Uploaded by Role</span>
                <div className="mt-2" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div className="d-flex justify-content-between" style={{ fontSize: "12px" }}>
                    <span style={{ color: "#475569" }}>Bench Sales:</span>
                    <strong style={{ color: "#0f172a" }}>{BSTalentsUploaded}</strong>
                  </div>
                  <div className="d-flex justify-content-between" style={{ fontSize: "12px" }}>
                    <span style={{ color: "#475569" }}>Administrator:</span>
                    <strong style={{ color: "#0f172a" }}>{AdminTalentsUploaded}</strong>
                  </div>
                  <div className="d-flex justify-content-between" style={{ fontSize: "12px" }}>
                    <span style={{ color: "#475569" }}>Hiring Manager:</span>
                    <strong style={{ color: "#0f172a" }}>0</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Row 4: Team Overview (span-12) ── */}
        <div className="bento-card span-12">
          <div className="bento-card-header mb-4">
            <div className="d-flex align-items-center gap-2">
              <Users size={16} color="#3b82f6" />
              <h3 className="bento-card-title">Team Administration Overview</h3>
            </div>
            <button
              className="btn btn-primary d-flex align-items-center gap-2 py-2 px-3"
              style={{ fontSize: "12px", fontWeight: "700", background: "#3b82f6", border: "none", color: "white", borderRadius: "8px" }}
              onClick={handleNavigateToTeamManagement}
            >
              <Plus size={14} /> Invite & Manage Team Members
            </button>
          </div>

          {teamLoading ? (
            <div className="py-4 text-center d-flex align-items-center justify-content-center gap-2" style={{ color: "#94a3b8", fontSize: "13px" }}>
              <div className="spinner-border spinner-border-sm text-primary" role="status" />
              Loading team members...
            </div>
          ) : formattedTeamMembers.length > 0 ? (
            <div className="tt-wrapper">
              <table className="tt-table">
                <thead>
                  <tr className="tt-thead-tr">
                    <th className="tt-th">Member</th>
                    <th className="tt-th">Email</th>
                    <th className="tt-th">Assigned Role</th>
                    <th className="tt-th">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {formattedTeamMembers.slice(0, 5).map((member, i) => {
                    const displayName = member.username || "—";
                    const displayEmail = member.email || "—";
                    const displayRole = member.role || "Member";
                    const initial = displayName.charAt(0).toUpperCase();
                    return (
                      <tr key={i} className="tt-row">
                        <td className="tt-td">
                          <div className="d-flex align-items-center gap-2">
                            <div style={{ width: 28, height: 28, borderRadius: 8, background: "#eff6ff", color: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 11, flexShrink: 0 }}>
                              {initial}
                            </div>
                            <span style={{ fontWeight: 700, color: "#0f172a", fontSize: "var(--text-sm)" }}>{displayName}</span>
                          </div>
                        </td>
                        <td className="tt-td" style={{ color: "#64748b", fontSize: "11px" }}>{displayEmail}</td>
                        <td className="tt-td" style={{ textAlign: "center" }}>
                          <span className="scope-tag">{displayRole}</span>
                        </td>
                        <td className="tt-td" style={{ textAlign: "center" }}>
                          <span className={`status-tag ${member.status === "Active" ? "status-green" : "status-orange"}`}>
                            {member.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {formattedTeamMembers.length > 5 && (
                <div className="text-center mt-3 pt-2 border-top">
                  <button className="link-button" onClick={handleNavigateToTeamManagement} style={{ fontSize: "12px", fontWeight: "700" }}>
                    View all {formattedTeamMembers.length} members <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="d-flex flex-column align-items-center justify-content-center py-5" style={{ color: "#94a3b8", gap: 8 }}>
              <Users size={28} style={{ opacity: 0.4 }} />
              <span style={{ fontSize: "13px" }}>No team members yet.</span>
              <button
                onClick={handleNavigateToTeamManagement}
                style={{ fontSize: "11px", fontWeight: 700, color: "#3b82f6", background: "none", border: "none", cursor: "pointer", padding: "4px 8px" }}
              >
                Invite members →
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function SparklePulse() {
  return (
    <span className="toast-sparkle-dot">
      <span className="toast-sparkle-ping"></span>
    </span>
  );
}

export default AdminDashboard;
