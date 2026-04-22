import React, { useState, useMemo } from "react";
import {
  FiArrowLeft,
  FiShield,
  FiBell,
  FiPlus,
  FiMoreHorizontal,
  FiCheckCircle,
  FiCreditCard,
  FiUsers,
  FiActivity,
  FiGlobe,
} from "react-icons/fi";
import "./AccountSettings.css";
import { useNavigate } from "react-router-dom";
import BillingHistoryTable from "./BillingHistoryTable";
import InviteTeamMemberModal from "./InviteTeamMemberModal";
import TeamMembersTable from "../AdminProfile/TeamMembersTable";
import { useGetTeamMembersQuery } from "../../../State-Management/Api/AdminDetailsApiSlice";

export default function AccountSettings() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const emailID = localStorage.getItem("Email");

  const {
    data: teamApiData = [],
    isLoading: isTeamLoading,
    isError: isTeamError,
    refetch: refetchTeam
  } = useGetTeamMembersQuery(emailID, {
    skip: !emailID,
  });

  const [activeTab, setActiveTab] = useState("billing");

  // Format team members for the table component
  const formattedTeamMembers = useMemo(() => {
    if (!Array.isArray(teamApiData)) return [];
    return teamApiData.map((member) => ({
      username: member.name || member.emailID.split("@")[0],
      email: member.emailID,
      role: member.role,
      status: member.accepted ? "Active" : "Pending",
      joinedOn: member.dateofjoin,
    }));
  }, [teamApiData]);

  const seatStats = useMemo(() => {
    const totalSeats = 25; // Based on the Enterprise plan set in AdminProfile
    const used = formattedTeamMembers.length;
    return {
      used,
      total: totalSeats,
      percent: Math.round((used / totalSeats) * 100)
    };
  }, [formattedTeamMembers]);

  const integrations = [
    { name: "Google Workspace", desc: "Connect your Google account to import contacts and schedule interviews", connected: true },
    { name: "Microsoft Office 365", desc: "Sync calendar events and integrate with Teams", connected: true },
    { name: "Apple Calendar", desc: "Sync your Apple calendar for interview scheduling", connected: false },
    { name: "PayPal Business", desc: "Additional payment processing option", connected: false },
  ];

  return (
    <div className="admin-profile-container">
      <div className="edit-header-box">
        <div className="edit-title-group">
          <button className="link-button mb-3 d-flex align-items-center gap-2" onClick={() => navigate("/Admin/admin-profile")}>
            <FiArrowLeft /> Back to Profile
          </button>
          <h1>Account Settings</h1>
          <p>Manage your billing, security, and team preferences</p>
        </div>
      </div>

      <div className="view-toggle1 mb-4">
        {[
          { id: "billing", label: "Billing", icon: <FiCreditCard /> },
          { id: "team", label: "Team Management", icon: <FiUsers /> },
          { id: "security", label: "Security & Info", icon: <FiShield /> },
          { id: "integrations", label: "Integrations", icon: <FiGlobe /> },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`toggle ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="me-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="settings-content-wrapper">
        {activeTab === "billing" && (
          <div className="animate-fade-in">
            <div className="row">
              <div className="col-lg-8">
                <section className="card-premium mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="card-title-premium m-0"><FiCreditCard /> Subscription Plan</h2>
                    <span className="status-tag status-green">Active</span>
                  </div>

                  <div className="plan-summary-box mb-4" style={{ background: "#f8fafc", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="badge bg-primary mb-2" style={{ fontSize: "12px", padding: "6px 12px", color: "white" }}>ENTERPRISE PLAN</div>
                        <h3 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", margin: "4px 0" }}>$499 <span style={{ fontSize: "14px", color: "#64748b", fontWeight: "500" }}>/ month</span></h3>
                        <p className="text-muted small m-0">Billed annually (Next renewal: Oct 12, 2026)</p>
                      </div>
                      <div className="d-flex gap-2">
                        <button className="action-btn-premium action-btn-secondary py-2" style={{ fontSize: "13px" }}>Change Plan</button>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="card-title-premium" style={{ fontSize: "0.9rem" }}><FiActivity /> Resource Usage</h3>
                    <div className="seat-usage-container mt-2">
                      <div className="d-flex justify-content-between mb-1">
                        <span className="sub-label">Team Seats Used</span>
                        <span className="sub-value">{seatStats.used} / {seatStats.total}</span>
                      </div>
                      <div className="seat-progress-bg" style={{ height: "10px", background: "#f1f5f9" }}>
                        <div className="seat-progress-fill" style={{ width: `${seatStats.percent}%`, borderRadius: "5px" }}></div>
                      </div>
                      <p className="text-muted xs-text mt-1" style={{ fontSize: "11px" }}>You are using {seatStats.percent}% of your allocated seat capacity.</p>
                    </div>
                  </div>

                  <div className="payment-methods mt-4 pt-4 border-top">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h3 className="card-title-premium m-0" style={{ fontSize: "1rem" }}>Payment Methods</h3>
                      <button className="link-button text-primary small"><FiPlus /> Add Method</button>
                    </div>

                    <div className="pm-item p-3 border rounded-3 d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-3">
                        <div className="pm-card-ico bg-dark text-white p-2 rounded" style={{ fontWeight: "700", fontSize: "12px" }}>VISA</div>
                        <div>
                          <div className="fw-bold" style={{ fontSize: "14px" }}>•••• •••• •••• 4242</div>
                          <div className="text-muted" style={{ fontSize: "12px" }}>Card expires on 04/2028</div>
                        </div>
                      </div>
                      <span className="status-tag status-green" style={{ fontSize: "10px" }}>Primary</span>
                    </div>
                  </div>
                </section>

                <section className="card-premium">
                  <h2 className="card-title-premium mb-4"><FiActivity /> Billing History</h2>
                  <BillingHistoryTable />
                </section>
              </div>

              <div className="col-lg-4">
                <div className="card-premium mb-4 bg-light shadow-none" style={{ border: "1.5px dashed #cbd5e1" }}>
                  <h3 className="card-title-premium">Need customization?</h3>
                  <p className="small text-muted">For custom seat counts or dedicated support, please contact our enterprise team.</p>
                  <button className="action-btn-premium action-btn-primary w-100 py-2" style={{ fontSize: "13px" }}>Contact Support</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "team" && (
          <div className="animate-fade-in">
            <section className="card-premium">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="card-title-premium m-0"><FiUsers /> Team Administration</h2>
                <button
                  className="action-btn-premium action-btn-primary py-2 px-3"
                  style={{ fontSize: "13px" }}
                  onClick={() => setShow(true)}
                >
                  <FiPlus /> Invite New Member
                </button>
              </div>

              <TeamMembersTable
                teammembers={formattedTeamMembers}
                isLoading={isTeamLoading}
              />

              <InviteTeamMemberModal
                show={show}
                onHide={() => setShow(false)}
                onInviteSuccess={refetchTeam}
              />
            </section>
          </div>
        )}

        {activeTab === "security" && (
          <div className="animate-fade-in">
            <div className="row">
              <div className="col-md-6">
                <section className="card-premium mb-4">
                  <h2 className="card-title-premium mb-4"><FiShield /> Password & Security</h2>
                  <div className="auth-group">
                    <label className="auth-label">Current Password</label>
                    <input type="password" disabled className="auth-input" value="••••••••••••" />
                  </div>
                  <button className="action-btn-premium action-btn-secondary py-2 px-4 mt-2" style={{ fontSize: "13px" }}>Change Password</button>
                </section>
              </div>
              <div className="col-md-6">
                <section className="card-premium">
                  <h2 className="card-title-premium mb-4"><FiBell /> Notification Preferences</h2>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <div className="fw-bold" style={{ fontSize: "14px" }}>Email Alerts</div>
                      <div className="text-muted small">Receive daily activity summaries</div>
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

        {activeTab === "integrations" && (
          <div className="animate-fade-in">
            <div className="card-premium">
              <h2 className="card-title-premium mb-4"><FiGlobe /> Connected Apps</h2>
              <div className="row g-3">
                {integrations.map((it) => (
                  <div key={it.name} className="col-md-6">
                    <div className="p-3 border rounded-3 d-flex justify-content-between align-items-center h-100">
                      <div className="d-flex align-items-start gap-3">
                        <div className="icon-box bg-light p-2 rounded" style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {it.name[0]}
                        </div>
                        <div>
                          <div className="fw-bold" style={{ fontSize: "14px" }}>{it.name}</div>
                          <div className="text-muted xs-text" style={{ fontSize: "11px", maxWidth: "200px" }}>{it.desc}</div>
                        </div>
                      </div>
                      <button className={`btn-secondary py-1 px-3 mt-0 ${it.connected ? "text-primary" : ""}`} style={{ fontSize: "11px", width: "auto" }}>
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

      <footer className="text-center text-muted small p-4 border-top">
        <p className="m-0">BenMyl Administration • Account ID: {localStorage.getItem("logincompanyid") || "BML-4029"}</p>
        <p className="m-0">Last profile sync: {new Date().toLocaleDateString()} • <a href="#support" className="text-primary">Help Center</a></p>
      </footer>
    </div>
  );
}

