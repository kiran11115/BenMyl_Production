import React, { useState } from "react";
import {
  FiArrowLeft,
  FiShield,
  FiBell,
  FiUsers,
  FiPlus,
  FiMoreHorizontal,
  FiCheckCircle,
} from "react-icons/fi";
import "./AccountSettings.css";
import { useNavigate } from "react-router-dom";
import BillingHistoryTable from "./BillingHistoryTable";
import InviteTeamMemberModal from "./InviteTeamMemberModal";

// Import your existing FormWizard component
// Make sure FormWizard is in the same directory or adjust the path


const BillingRow = ({ date, desc, amount, status }) => (
  <tr>
    <td>{date}</td>
    <td>{desc}</td>
    <td>{amount}</td>
    <td>
      <span className={`pill pill-${status.toLowerCase()}`}>{status}</span>
    </td>
    <td>
      <a className="link-action" href="#download">Download</a>
    </td>
  </tr>
);

export default function AccountSettings() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  // State to control active tab
  const [activeTab, setActiveTab] = useState("billing");

  // Mock Data (moved out of render for cleaner code)
  const teamMembers = [
    { name: "John Smith", email: "john.smith@company.com", role: "Admin", tag: "Owner" },
    { name: "Sarah Johnson", email: "sarah.johnson@company.com", role: "HR Manager", tag: "Active" },
    { name: "Michael Chen", email: "michael.chen@company.com", role: "Recruiter", tag: "Active" },
    { name: "Emily Davis", email: "emily.davis@company.com", role: "Hiring Manager", tag: "Pending" },
  ];

  const integrations = [
    { name: "Google Workspace", desc: "Connect your Google account to import contacts and schedule interviews", connected: true },
    { name: "Microsoft Office 365", desc: "Sync calendar events and integrate with Teams", connected: true },
    { name: "Apple Calendar", desc: "Sync your Apple calendar for interview scheduling", connected: false },
    { name: "PayPal Business", desc: "Additional payment processing option", connected: false },
  ];

  return (
    <div className="settings-page">
      <div className="">

        {/* Header Section */}
        <div className="back-row d-flex gap-1">
          <button className="link-button" onClick={() => navigate("/user/user-dashboard")}>
            <FiArrowLeft /> Back to Dashboard
          </button>
          <span className="crumb">/ Account Settings</span>
        </div>

        <div className="page-title-wrapper mt-3">
          <h1 className="page-title">Account Settings</h1>
          <p className="page-sub">Manage your account details and preferences</p>
        </div>

        {/* Tab Navigation */}
        <div className="view-toggle1 mt-3 mb-3">
          <button
            className={`toggle ${activeTab === "billing" ? "active" : ""}`}
            onClick={() => setActiveTab("billing")}
          >
            Billing
          </button>
          <button
            className={`toggle ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            Security & Notif.
          </button>
          <button
            className={`toggle ${activeTab === "team" ? "active" : ""}`}
            onClick={() => setActiveTab("team")}
          >
            Team
          </button>
          <button
            className={`toggle ${activeTab === "integrations" ? "active" : ""}`}
            onClick={() => setActiveTab("integrations")}
          >
            Integrations
          </button>
        </div>

        {/* --- TAB CONTENT: BILLING --- */}
        {activeTab === "billing" && (
          <div className="animate-fade-in">
            <section className="card large">
              <div className="card-header mb-3" style={{ padding: "16px 12px" }}>
                <h2>Billing Information</h2>
                <a className="view-history fw-semibold" href="#history">View History</a>
              </div>

              <div className="card-block">
                <div className="current-plan">
                  <div className="plan-left">
                    <div className="plan-badge">Professional</div>
                    <div className="plan-desc">
                      <div className="price">$199/month, billed annually</div>
                      <div className="renew">Renews on Oct 12, 2023</div>
                    </div>
                  </div>
                  <div className="plan-actions">
                    <button className="btn-secondary">Change Plan</button>
                    <button className="btn-cancel">Cancel</button>
                  </div>
                </div>

                <div className="payment-methods">
                  <div className="pm-header">
                    <h3>Payment Methods</h3>
                    <button className="add-method"><FiPlus /> Add Method</button>
                  </div>

                  <div className="pm-list">
                    <div className="pm-item">
                      <div className="pm-left">
                        <div className="pm-card-ico">VISA</div>
                        <div>
                          <div className="pm-title">•••• •••• •••• 4242</div>
                          <div className="pm-sub">Expires 04/25</div>
                        </div>
                      </div>
                      <div className="pm-right">
                        <span className="default-badge">Default</span>
                        <button className="more"><FiMoreHorizontal /></button>
                      </div>
                    </div>
                    {/* Add more payment methods here if needed */}
                  </div>
                </div>

                <div className="billing-history mt-3">
                  <h3>Billing History</h3>
                  <BillingHistoryTable />
                </div>
              </div>
            </section>
          </div>
        )}

        {/* --- TAB CONTENT: SECURITY + NOTIFICATIONS --- */}
        {activeTab === "security" && (
          <div className="grid-2 animate-fade-in">
            <section className="card">
              <div className="card-header mb-3" style={{ padding: "16px 12px" }}>
                <h2>Security</h2>
                <a className="manage-link" href="#manage">Manage</a>
              </div>
              <div className="settings-list">
                <div className="setting-item">
                  <div className="setting-left">
                    <div className="ico"><FiShield /></div>
                    <div>
                      <div className="setting-title">Password</div>
                      <div className="setting-sub">Last changed 3 months ago</div>
                    </div>
                  </div>
                  <div className="setting-right">
                    <button className="btn-secondary small">Change Password</button>
                  </div>
                </div>
                <div className="setting-item">
                  <div className="setting-left">
                    <div className="ico"><FiCheckCircle /></div>
                    <div>
                      <div className="setting-title">Two-Factor Authentication</div>
                      <div className="setting-sub">Add an extra layer of security</div>
                    </div>
                  </div>
                  <div className="setting-right">
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider" />
                    </label>
                  </div>
                </div>
              </div>
            </section>

            <section className="card">
              <div className="card-header mb-3" style={{ padding: "16px 12px" }}>
                <h2>Notification Preferences</h2>
                <a className="manage-link" href="#edit">Edit All</a>
              </div>
              <div className="settings-list">
                <div className="setting-item">
                  <div className="setting-left">
                    <div className="ico"><FiBell /></div>
                    <div>
                      <div className="setting-title">Email Notifications</div>
                      <div className="setting-sub">Receive emails about activity</div>
                    </div>
                  </div>
                  <div className="setting-right">
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider" />
                    </label>
                  </div>
                </div>
                {/* Notification Types checkboxes */}
                <div className="notification-types">
                  <div className="notif-title">Notification Types</div>
                  <label className="chk"><input type="checkbox" defaultChecked /> New application received</label>
                  <label className="chk"><input type="checkbox" defaultChecked /> Interview scheduled</label>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* --- TAB CONTENT: TEAM --- */}
        {activeTab === "team" && (
          <div className="animate-fade-in">
            <section className="card">
              <div className="card-header d-flex align-items-center mb-3">
                <h2>Team Management</h2>
                <>
                  <button
                    className="btn-primary"
                    type="button"
                    onClick={() => setShow(true)}
                  >
                    Invite Team Member
                  </button>

                  <InviteTeamMemberModal show={show} onHide={() => setShow(false)} />
                </>
              </div>
              <div className="team-list">
                {teamMembers.map((m) => (
                  <div key={m.email} className="team-item">
                    <div className="team-left">
                      <div className="avatar-sm">{m.name.split(" ").map(n => n[0]).join("")}</div>
                      <div>
                        <div className="team-name">{m.name}</div>
                        <div className="team-email">{m.email}</div>
                      </div>
                    </div>
                    <div className="team-right">
                      <select value={m.role} onChange={() => { }} className="role-select btn-secondary">
                        <option>{m.role}</option>
                      </select>
                      <span className={`status-tag status-${m.tag.toLowerCase()}`}>{m.tag}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* --- TAB CONTENT: INTEGRATIONS --- */}
        {activeTab === "integrations" && (
          <div className="animate-fade-in">
            <section className="card">
              <div className="card-header" style={{ padding: "16px 12px" }}>
                <h2>Integrations</h2>
                <a className="manage-link fw-semibold" href="#browse">Browse More</a>
              </div>
              <div className="integrations-grid">
                {integrations.map((it) => (
                  <div key={it.name} className="integration-card">
                    <div className="integration-left">
                      <div className="integration-ico">{it.name[0]}</div>
                      <div>
                        <div className="integration-name">{it.name}</div>
                        <div className="integration-desc">{it.desc}</div>
                      </div>
                    </div>
                    <div className="integration-right">
                      <button className={`btn-secondary ${it.connected ? "connected" : ""}`}>
                        {it.connected ? "Manage" : "Connect"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        <footer className="settings-footer">
          <div>Need help? <a href="#support">Contact Support</a></div>
          <div className="muted">Account created on May 15, 2025</div>
        </footer>

      </div>
    </div>
  );
}
