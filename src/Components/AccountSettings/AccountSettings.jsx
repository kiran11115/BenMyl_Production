import React from "react";
import {
    FiChevronLeft,
    FiCreditCard,
    FiArrowLeft,
    FiShield,
    FiBell,
    FiUsers,
    FiLink,
    FiDownload,
    FiCheckCircle,
    FiPlus,
    FiMoreHorizontal,
} from "react-icons/fi";
import "./AccountSettings.css";
import { useNavigate } from "react-router-dom";

const BillingRow = ({ date, desc, amount, status }) => (
    <tr>
        <td>{date}</td>
        <td>{desc}</td>
        <td>{amount}</td>
        <td>
            <span className={`pill pill-${status.toLowerCase()}`}>{status}</span>
        </td>
        <td>
            <a className="link-action" href="#download">
                Download
            </a>
        </td>
    </tr>
);

export default function AccountSettings() {

    const navigate = useNavigate();

    return (
        <div className="settings-page">
            <div className="">
                <div className="back-row">
                    <button className="link-button" onClick={() => navigate("/user/user-dashboard")}><FiArrowLeft /> Back to Dashboard</button>
                    <span className="crumb">/ Job Posting</span>
                </div>

                <div className="page-title-wrapper">
                    <h1 className="page-title">Account Settings</h1>
                    <p className="page-sub">Manage your account details and preferences</p>
                </div>

                <div className="tabs ">
                    <button className="tab active">Billing</button>
                    <button className="tab">Security</button>
                    <button className="tab">Notifications</button>
                    <button className="tab">Team</button>
                    <button className="tab">Integrations</button>
                </div>

                {/* Billing card */}
                <section className="card large">
                    <div className="card-header">
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
                                <button className="btn-outline">Change Plan</button>
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

                                <div className="pm-item">
                                    <div className="pm-left">
                                        <div className="pm-paypal-ico">PayPal</div>
                                        <div>
                                            <div className="pm-title">john.smith@company.com</div>
                                            <div className="pm-sub">Connected</div>
                                        </div>
                                    </div>
                                    <div className="pm-right">
                                        <button className="more"><FiMoreHorizontal /></button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="billing-history mt-3">
                            <h3>Billing History</h3>
                            <div className="table-wrap">
                                <table className="history-table">
                                    <thead>
                                        <tr>
                                            <th>DATE</th>
                                            <th>DESCRIPTION</th>
                                            <th>AMOUNT</th>
                                            <th>STATUS</th>
                                            <th>INVOICE</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <BillingRow
                                            date="Sep 12, 2023"
                                            desc="Professional Plan (Annual)"
                                            amount="$2,388.00"
                                            status="Paid"
                                        />
                                        <BillingRow
                                            date="Aug 12, 2023"
                                            desc="Professional Plan (Annual)"
                                            amount="$2,388.00"
                                            status="Paid"
                                        />
                                        <BillingRow
                                            date="Jul 12, 2023"
                                            desc="Professional Plan (Annual)"
                                            amount="$2,388.00"
                                            status="Paid"
                                        />
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Security + Notifications */}
                <div className="grid-2">
                    <section className="card">
                        <div className="card-header">
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
                                    <button className="btn-outline small">Change Password</button>
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

                            <div className="setting-item">
                                <div className="setting-left">
                                    <div className="ico"><FiUsers /></div>
                                    <div>
                                        <div className="setting-title">Active Sessions</div>
                                        <div className="setting-sub">Manage your active sessions</div>
                                    </div>
                                </div>
                                <div className="setting-right">
                                    <button className="btn-outline small">View Sessions</button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="card">
                        <div className="card-header">
                            <h2>Notification Preferences</h2>
                            <a className="manage-link" href="#edit">Edit All</a>
                        </div>

                        <div className="settings-list">
                            <div className="setting-item">
                                <div className="setting-left">
                                    <div className="ico"><FiBell /></div>
                                    <div>
                                        <div className="setting-title">Email Notifications</div>
                                        <div className="setting-sub">Receive emails about your account activity</div>
                                    </div>
                                </div>
                                <div className="setting-right">
                                    <label className="switch">
                                        <input type="checkbox" defaultChecked />
                                        <span className="slider" />
                                    </label>
                                </div>
                            </div>

                            <div className="setting-item">
                                <div className="setting-left">
                                    <div className="ico"><FiBell /></div>
                                    <div>
                                        <div className="setting-title">In-app Notifications</div>
                                        <div className="setting-sub">Get notifications within the platform</div>
                                    </div>
                                </div>
                                <div className="setting-right">
                                    <label className="switch">
                                        <input type="checkbox" defaultChecked />
                                        <span className="slider" />
                                    </label>
                                </div>
                            </div>

                            <div className="setting-item">
                                <div className="setting-left">
                                    <div className="ico"><FiBell /></div>
                                    <div>
                                        <div className="setting-title">Mobile Push Notifications</div>
                                        <div className="setting-sub">Get alerts on your mobile device</div>
                                    </div>
                                </div>
                                <div className="setting-right">
                                    <label className="switch">
                                        <input type="checkbox" />
                                        <span className="slider" />
                                    </label>
                                </div>
                            </div>

                            <div className="notification-types">
                                <div className="notif-title">Notification Types</div>
                                <label className="chk">
                                    <input type="checkbox" defaultChecked /> New application received
                                </label>
                                <label className="chk">
                                    <input type="checkbox" defaultChecked /> Interview scheduled
                                </label>
                                <label className="chk">
                                    <input type="checkbox" defaultChecked /> Contract updates
                                </label>
                                <label className="chk">
                                    <input type="checkbox" /> Billing alerts
                                </label>
                                <label className="chk">
                                    <input type="checkbox" /> Team member activity
                                </label>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Team management */}
                <section className="card">
                    <div className="card-header">
                        <h2>Team Management</h2>
                        <button className="border-0 text-white p-2 rounded-1" style={{ width: "10rem", background: "#2563EB" }}>Invite Team Member</button>
                    </div>

                    <div className="team-list">
                        {[
                            { name: "John Smith", email: "john.smith@company.com", role: "Admin", tag: "Owner" },
                            { name: "Sarah Johnson", email: "sarah.johnson@company.com", role: "HR Manager", tag: "Active" },
                            { name: "Michael Chen", email: "michael.chen@company.com", role: "Recruiter", tag: "Active" },
                            { name: "Emily Davis", email: "emily.davis@company.com", role: "Hiring Manager", tag: "Pending" },
                        ].map((m) => (
                            <div key={m.email} className="team-item">
                                <div className="team-left">
                                    <div className="avatar-sm">{m.name.split(" ").map(n => n[0]).join("")}</div>
                                    <div>
                                        <div className="team-name">{m.name}</div>
                                        <div className="team-email">{m.email}</div>
                                    </div>
                                </div>
                                <div className="team-right">
                                    <select value={m.role} onChange={() => { }} aria-label="role">
                                        <option>{m.role}</option>
                                    </select>
                                    <span className={`status-tag status-${m.tag.toLowerCase()}`}>{m.tag}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Integrations */}
                <section className="card">
                    <div className="card-header">
                        <h2>Integrations</h2>
                        <a className="manage-link fw-semibold" href="#browse">Browse More</a>
                    </div>

                    <div className="integrations-grid">
                        {[
                            { name: "Google Workspace", desc: "Connect your Google account to import contacts and schedule interviews", connected: true },
                            { name: "Microsoft Office 365", desc: "Sync calendar events and integrate with Teams", connected: true },
                            { name: "Apple Calendar", desc: "Sync your Apple calendar for interview scheduling", connected: false },
                            { name: "PayPal Business", desc: "Additional payment processing option", connected: false },
                        ].map((it) => (
                            <div key={it.name} className="integration-card">
                                <div className="integration-left">
                                    <div className="integration-ico">{it.name[0]}</div>
                                    <div>
                                        <div className="integration-name">{it.name}</div>
                                        <div className="integration-desc">{it.desc}</div>
                                    </div>
                                </div>
                                <div className="integration-right">
                                    <button className={`btn-outline ${it.connected ? "connected" : ""}`}>
                                        {it.connected ? "Manage" : "Connect"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <footer className="settings-footer">
                    <div>Need help? <a href="#support">Contact Support</a></div>
                    <div className="muted">Account created on May 15, 2025</div>
                </footer>
            </div>
        </div>
    );
}
