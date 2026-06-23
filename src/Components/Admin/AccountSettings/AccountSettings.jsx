import React, { useState, useMemo } from "react";
import {
  FiArrowLeft,
  FiShield,
  FiBell,
  FiPlus,
  FiCreditCard,
  FiUsers,
  FiActivity,
  FiGlobe,
  FiUser,
  FiMail,
  FiSend,
  FiCheckCircle,
} from "react-icons/fi";
import "./AccountSettings.css";
import { useNavigate, useLocation } from "react-router-dom";
import BillingHistoryTable from "./BillingHistoryTable";
import TeamMembersTable from "../AdminProfile/TeamMembersTable";
import { useGetTeamMembersQuery } from "../../../State-Management/Api/AdminDetailsApiSlice";
import { useInviteUserMutation } from "../../../State-Management/Api/SignupApiSlice";
import { toast } from "react-toastify";

export default function AccountSettings() {
  const navigate = useNavigate();
  const emailID = localStorage.getItem("Email");
  const companyId = localStorage.getItem("CompanyId");
  const companyName = localStorage.getItem("CompanyName");
  const username = localStorage.getItem("UserName");

  const {
    data: teamApiData = [],
    isLoading: isTeamLoading,
    refetch: refetchTeam,
  } = useGetTeamMembersQuery(emailID, { skip: !emailID });

  const [inviteUser, { isLoading: isInviting }] = useInviteUserMutation();

  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || "billing");

  const [inviteForm, setInviteForm] = useState({ fullName: "", email: "", role: "Admin" });
  const [inviteError, setInviteError] = useState("");

  const handleInviteChange = (e) => {
    setInviteForm({ ...inviteForm, [e.target.name]: e.target.value });
    if (inviteError) setInviteError("");
  };

  const handleInvite = async () => {
    if (!inviteForm.fullName || !inviteForm.email) {
      setInviteError("Please fill in all required fields.");
      return;
    }
    try {
      const fd = new FormData();
      fd.append("emails", inviteForm.email);
      fd.append("role", inviteForm.role);
      fd.append("companyEmailID", emailID);
      fd.append("CompanyID", companyId);
      fd.append("CompanyName", companyName);
      fd.append("inviterusername", username);
      fd.append("FullName", inviteForm.fullName);
      const response = await inviteUser(fd).unwrap();
      setInviteForm({ fullName: "", email: "", role: "Admin" });
      toast.success(response?.result_Message || "Invitation sent successfully!");
      if (refetchTeam) refetchTeam();
    } catch (err) {
      const msg = err?.data?.result_Message || "Failed to send invitation.";
      setInviteError(msg);
      toast.error(msg);
    }
  };

  const formattedTeamMembers = useMemo(() => {
    const dataList = Array.isArray(teamApiData) ? teamApiData : (teamApiData?.value || []);
    if (!dataList.length) return [];
    return dataList.map((member) => ({
      username: member.name || member.emailID.split("@")[0],
      email: member.emailID,
      role: member.role,
      status: member.accepted ? "Active" : "Pending",
      joinedOn: member.dateofjoin,
    }));
  }, [teamApiData]);

  const seatStats = useMemo(() => {
    const totalSeats = 25;
    const used = formattedTeamMembers.length;
    return { used, total: totalSeats, remaining: totalSeats - used, percent: Math.round((used / totalSeats) * 100) };
  }, [formattedTeamMembers]);

  // Role slots per plan
  const roleSlots = [
    { role: "Administrator", total: 3, used: formattedTeamMembers.filter(m => m.role === "Admin").length },
    { role: "Recruiter", total: 10, used: formattedTeamMembers.filter(m => m.role === "Recruiter2").length },
    { role: "Hiring Manager", total: 8, used: formattedTeamMembers.filter(m => m.role === "Recruiter").length },
    { role: "Bench Sales", total: 4, used: formattedTeamMembers.filter(m => m.role === "Benchsales").length },
  ];

  const integrations = [
    { name: "Google Workspace", desc: "Connect your Google account to import contacts and schedule interviews", connected: true },
    { name: "Microsoft Office 365", desc: "Sync calendar events and integrate with Teams", connected: true },
    { name: "Apple Calendar", desc: "Sync your Apple calendar for interview scheduling", connected: false },
    { name: "PayPal Business", desc: "Additional payment processing option", connected: false },
  ];

  const sectionTitle = (icon, label) => (
    <h2 style={{ fontSize: "13px", fontWeight: 700, color: "#1F2937", textTransform: "uppercase", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: "7px", marginBottom: "14px" }}>
      {icon} {label}
    </h2>
  );

  return (
    <div className="ai-dashboard-wrapper">
      {/* Hero Header */}
      <div className="hero-section-wrapper mb-4">
        <div className="hero-card ">
          <div className="hero-concentric-lines"></div>
          <div className="hero-ripple-pattern"></div>
          <div className="hero-circular-highlights"></div>
        <div className="hero-left">
          <div className="hero-pill">✦ Account Settings</div>
          <h1 className="job-posting-title text-white">System &amp; Preferences</h1>
          <div className="job-posting-header-info">
            <p className="job-posting-subtitle">Manage your billing, security, and team preferences</p>
          </div>
        </div>
        <div className="hero-buttons">
          <button type="button" className="routine-btn" onClick={() => navigate("/Admin/overview-dashboard")}>
            <FiArrowLeft style={{ marginRight: "8px" }} /> Back
          </button>
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

      {/* Elegant Tabs */}
      <div className="elegant-tabs-container">
        {[
          { id: "billing", label: "Billing", color: "#3b82f6" }, // Blue
          { id: "team", label: "Team Management", color: "#10b981" }, // Green
          { id: "security", label: "Security & Info", color: "#8b5cf6" }, // Purple
          { id: "integrations", label: "Integrations", color: "#3b82f6" }, // Blue
        ].map((tab) => (
          <button
            key={tab.id}
            className={`tab-item ${activeTab === tab.id ? "active" : ""}`}
            style={activeTab === tab.id ? { color: tab.color, borderBottomColor: tab.color } : {}}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="settings-content-wrapper mb-4">

        {/* ── BILLING TAB ─────────────────────────────────── */}
        {activeTab === "billing" && (
          <div className="animate-fade-in">
            <div className="row g-3">
              <div className="col-lg-8">
                {/* Subscription Plan Card */}
                <section className="premium-card mb-3" style={{ padding: "16px" }}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    {sectionTitle(<FiCreditCard />, "Subscription Plan")}
                    <span className="status-tag status-green">Active</span>
                  </div>
                  <div style={{ background: "#f8fafc", padding: "14px 18px", borderRadius: "10px", border: "1px solid #e2e8f0", marginBottom: "16px" }}>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div style={{ background: "#1e293b", color: "white", display: "inline-block", padding: "3px 10px", borderRadius: "6px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.05em", marginBottom: "8px" }}>ENTERPRISE PLAN</div>
                        <div style={{ fontSize: "22px", fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>$499 <span style={{ fontSize: "13px", color: "#64748b", fontWeight: 500 }}>/ month</span></div>
                        <p className="text-muted m-0 mt-1" style={{ fontSize: "12px" }}>Billed annually · Next renewal: Oct 12, 2026</p>
                      </div>
                      <button className="btn-secondary" style={{ fontSize: "12px", padding: "6px 14px" }}>Change Plan</button>
                    </div>
                  </div>
                  {/* Seat Usage */}
                  <div className="mb-0">
                    <div className="d-flex justify-content-between mb-1" style={{ fontSize: "12px" }}>
                      <span style={{ color: "#64748b" }}>Team Seats Used</span>
                      <span style={{ fontWeight: 600, color: "#1e293b" }}>{seatStats.used} / {seatStats.total}</span>
                    </div>
                    <div style={{ height: "6px", background: "#f1f5f9", borderRadius: "999px", overflow: "hidden" }}>
                      <div style={{ width: `${seatStats.percent}%`, height: "100%", background: "#3b82f6", borderRadius: "999px", transition: "width 0.5s ease" }} />
                    </div>
                    <p className="m-0 mt-1" style={{ fontSize: "11px", color: "#94a3b8" }}>{seatStats.percent}% of allocated capacity in use.</p>
                  </div>
                </section>

                {/* Payment Methods */}
                <section className="premium-card mb-3" style={{ padding: "16px" }}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    {sectionTitle(<FiCreditCard />, "Payment Methods")}
                    <button style={{ background: "none", border: "none", color: "#475569", fontWeight: 600, fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                      <FiPlus size={13} /> Add Method
                    </button>
                  </div>
                  <div style={{ border: "1px solid #e2e8f0", borderRadius: "8px", padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div className="d-flex align-items-center gap-3">
                      <div style={{ background: "#1e293b", color: "white", padding: "4px 8px", borderRadius: "5px", fontWeight: 700, fontSize: "11px" }}>VISA</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "13px" }}>•••• •••• •••• 4242</div>
                        <div style={{ fontSize: "11px", color: "#94a3b8" }}>Expires 04/2028</div>
                      </div>
                    </div>
                    <span className="status-tag status-green" style={{ fontSize: "10px" }}>Primary</span>
                  </div>
                </section>

                {/* Billing History */}
                <section className="premium-card mb-3" style={{ padding: "16px" }}>
                  {sectionTitle(<FiActivity />, "Billing History")}
                  <BillingHistoryTable />
                </section>
              </div>

              <div className="col-lg-4">
                <div className="premium-card" style={{ border: "1.5px dashed #cbd5e1", padding: "16px", background: "#f8fafc" }}>
                  <h3 style={{ fontSize: "13px", fontWeight: 700, color: "#1F2937", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>Need customization?</h3>
                  <p style={{ fontSize: "12px", color: "#64748b", marginBottom: "14px" }}>For custom seat counts or dedicated support, please contact our enterprise team.</p>
                  <button className="btn-primary" style={{ width: "100%", fontSize: "13px", padding: "8px 14px" }}>Contact Support</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TEAM MANAGEMENT TAB ─────────────────────────── */}
        {activeTab === "team" && (
          <div className="animate-fade-in" style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: "20px", alignItems: "start" }}>

            {/* Left — Invite Form + Role Quota */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

              {/* Invite User Card */}
              <div className="premium-card" style={{ padding: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                  <div style={{ background: "#f1f5f9", color: "#334155", borderRadius: "8px", padding: "7px", display: "flex" }}>
                    <FiUser size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#1e293b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Invite Member</div>
                    <div style={{ fontSize: "11px", color: "#94a3b8" }}>Add a user to your organization</div>
                  </div>
                </div>

                {inviteError && (
                  <div style={{ background: "#fef2f2", border: "1px solid #fee2e2", borderRadius: "8px", padding: "8px 12px", fontSize: "12px", color: "#dc2626", marginBottom: "12px" }}>
                    {inviteError}
                  </div>
                )}

                <div style={{ marginBottom: "12px" }}>
                  <label style={{ fontSize: "11px", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "5px" }}>Full Name</label>
                  <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #e2e8f0", borderRadius: "8px", padding: "0 10px", background: "#f8fafc", height: "38px" }}>
                    <FiUser size={13} color="#94a3b8" style={{ marginRight: "8px", flexShrink: 0 }} />
                    <input
                      type="text" name="fullName"
                      value={inviteForm.fullName} onChange={handleInviteChange}
                      placeholder="Jane Smith"
                      style={{ border: "none", background: "transparent", outline: "none", fontSize: "13px", color: "#1e293b", width: "100%" }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "12px" }}>
                  <label style={{ fontSize: "11px", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "5px" }}>Email Address</label>
                  <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #e2e8f0", borderRadius: "8px", padding: "0 10px", background: "#f8fafc", height: "38px" }}>
                    <FiMail size={13} color="#94a3b8" style={{ marginRight: "8px", flexShrink: 0 }} />
                    <input
                      type="email" name="email"
                      value={inviteForm.email} onChange={handleInviteChange}
                      placeholder="jane@company.com"
                      style={{ border: "none", background: "transparent", outline: "none", fontSize: "13px", color: "#1e293b", width: "100%" }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "11px", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "5px" }}>Assign Role</label>
                  <select
                    name="role" value={inviteForm.role} onChange={handleInviteChange}
                    style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: "8px", padding: "0 10px", background: "#f8fafc", height: "38px", fontSize: "13px", color: "#1e293b", outline: "none", cursor: "pointer" }}
                  >
                    <option value="Admin">Administrator</option>
                    <option value="Recruiter2">Recruiter</option>
                    <option value="Recruiter">Hiring Manager</option>
                    <option value="Benchsales">Bench Sales</option>
                  </select>
                </div>

                <button
                  className={isInviting ? "btn-secondary" : "btn-primary"}
                  onClick={handleInvite} disabled={isInviting}
                  style={{ width: "100%", padding: "9px 14px", fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center", gap: "7px" }}
                >
                  {isInviting ? (
                    <><span className="spinner-border spinner-border-sm" />&nbsp;Sending...</>
                  ) : (
                    <><FiSend size={13} /> Send Invitation</>
                  )}
                </button>
              </div>

              {/* Roles Left per Subscription */}
              <div className="premium-card" style={{ padding: "16px" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#1F2937", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "14px" }}>
                  Roles Remaining
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {roleSlots.map((r) => {
                    const remaining = r.total - r.used;
                    const pct = Math.round((r.used / r.total) * 100);
                    return (
                      <div key={r.role}>
                        <div className="d-flex justify-content-between" style={{ marginBottom: "4px" }}>
                          <span style={{ fontSize: "12px", color: "#475569", fontWeight: 500 }}>{r.role}</span>
                          <span style={{ fontSize: "11px", color: remaining === 0 ? "#dc2626" : "#16a34a", fontWeight: 700 }}>
                            {remaining > 0 ? `${remaining} left` : "Full"}
                          </span>
                        </div>
                        <div style={{ height: "5px", background: "#f1f5f9", borderRadius: "999px", overflow: "hidden" }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: pct >= 100 ? "#dc2626" : ["#3b82f6", "#10b981", "#8b5cf6", "#f43f5e"][roleSlots.indexOf(r)], borderRadius: "999px", transition: "width 0.4s ease" }} />
                        </div>
                        <div style={{ fontSize: "10px", color: "#94a3b8", marginTop: "2px" }}>{r.used} / {r.total} slots used</div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ borderTop: "1px solid #f1f5f9", marginTop: "14px", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>Total seats remaining</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <FiCheckCircle size={14} color="#16a34a" />
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#1e293b" }}>{seatStats.remaining} / {seatStats.total}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — Team Members Table */}
            <div className="premium-card" style={{ padding: "16px" }}>
              {sectionTitle(<FiUsers />, "Team Members")}
              <TeamMembersTable
                teammembers={formattedTeamMembers}
                isLoading={isTeamLoading}
              />
            </div>
          </div>
        )}

        {/* ── SECURITY TAB ────────────────────────────────── */}
        {activeTab === "security" && (
          <div className="animate-fade-in">
            <div className="row g-3">
              <div className="col-md-6">
                <section className="premium-card mb-3" style={{ padding: "16px" }}>
                  {sectionTitle(<FiShield />, "Password & Security")}
                  <div className="auth-group">
                    <label className="auth-label">Current Password</label>
                    <input type="password" disabled className="auth-input" value="••••••••••••" />
                  </div>
                  <button className="btn-secondary" style={{ marginTop: "10px", fontSize: "13px", padding: "7px 16px" }}>
                    Change Password
                  </button>
                </section>
              </div>
              <div className="col-md-6">
                <section className="premium-card mb-3" style={{ padding: "16px" }}>
                  {sectionTitle(<FiBell />, "Notification Preferences")}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>Email Alerts</div>
                      <div style={{ fontSize: "11px", color: "#94a3b8" }}>Receive daily activity summaries</div>
                    </div>
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" defaultChecked />
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}

        {/* ── INTEGRATIONS TAB ────────────────────────────── */}
        {activeTab === "integrations" && (
          <div className="animate-fade-in">
            <div className="premium-card" style={{ padding: "16px" }}>
              {sectionTitle(<FiGlobe />, "Connected Apps")}
              <div className="row g-3">
                {integrations.map((it) => (
                  <div key={it.name} className="col-md-6">
                    <div style={{ border: "1.5px solid #e2e8f0", borderRadius: "10px", padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", height: "100%" }}>
                      <div className="d-flex align-items-center gap-3">
                        <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "14px", color: "#475569", flexShrink: 0 }}>
                          {it.name[0]}
                        </div>
                        <div>
                          <div style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>{it.name}</div>
                          <div style={{ fontSize: "11px", color: "#94a3b8", maxWidth: "180px" }}>{it.desc}</div>
                        </div>
                      </div>
                      <button style={{
                        background: it.connected ? "#f0fdf4" : "transparent",
                        border: `1.5px solid ${it.connected ? "#86efac" : "#e2e8f0"}`,
                        color: it.connected ? "#16a34a" : "#64748b",
                        borderRadius: "7px", padding: "5px 12px",
                        fontSize: "11px", fontWeight: 600,
                        cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0
                      }}>
                        {it.connected ? "Connected" : "Connect"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      <footer className="text-center text-muted small p-4 border-top" style={{ fontSize: "11px" }}>
        <p className="m-0">BenMyl Administration · Account ID: {localStorage.getItem("logincompanyid") || "BML-4029"}</p>
        <p className="m-0">Last profile sync: {new Date().toLocaleDateString()} · <a href="#support" style={{ color: "#334155" }}>Help Center</a></p>
      </footer>
    </div>
  );
}
