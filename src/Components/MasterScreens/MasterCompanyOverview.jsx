import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Building2,
  ArrowLeft,
  Globe,
  Users,
  Shield,
  Briefcase,
  UserCheck,
  BarChart3,
  Calendar,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  TrendingUp,
  Download,
  Loader2
} from "lucide-react";
import "./MasterCompanyOverview.css";
import { useGetCompanyUsersQuery, useGetCompanyJobListQuery, useLazyGetCompanyJobListQuery, useLazyGetInterviewSchedulesQuery } from "../../State-Management/Api/CompanyApiSlice";


// Dynamic mock databases mapped to Company IDs
const companyDatabase = {
  "COMP-101": {
    name: "AeroTech Solutions",
    domain: "aerotech.io",
    tier: "Enterprise",
    status: "Active",
    users: 42,
    maxUsers: 100,
    joined: "2026-01-15",
    roles: ["Super Admin", "Recruiter", "Hiring Manager", "Client Reviewer"],
    members: [
      { name: "John Doe", email: "j.doe@aerotech.io", role: "Super Admin", status: "Active", joined: "2026-01-16" },
      { name: "Jane Smith", email: "j.smith@aerotech.io", role: "Recruiter", status: "Active", joined: "2026-01-18" },
      { name: "Bob Johnson", email: "b.johnson@aerotech.io", role: "Hiring Manager", status: "Inactive", joined: "2026-02-01" },
      { name: "Alice Williams", email: "a.williams@aerotech.io", role: "Client Reviewer", status: "Active", joined: "2026-03-10" }
    ],
    posts: [
      { title: "Senior Avionics Engineer", department: "Aerospace", status: "Active", applicants: 24, date: "2026-06-10" },
      { title: "React Native Developer", department: "Mobile", status: "Closed", applicants: 45, date: "2026-04-12" },
      { title: "DevOps Engineer (Cloud)", department: "Infrastructure", status: "Active", applicants: 12, date: "2026-07-02" }
    ],
    talent: [
      { candidate: "Alex Reid", title: "Lead Systems Architect", match: "98%", status: "Interviewing", score: 94 },
      { candidate: "Sarah Jenkins", title: "Full-Stack Dev", match: "92%", status: "Sourced", score: 88 },
      { candidate: "Marcus Chen", title: "Cloud Specialist", match: "89%", status: "Offer Extended", score: 91 }
    ],
    analytics: {
      postVolume: 18,
      matchesFound: 142,
      interviewsCompleted: 35,
      tokensUsed: 680
    },
    interviews: [
      { date: "2026-07-05", candidate: "Alex Reid", interviewer: "Jane Smith", format: "Technical Live Coding", result: "Passed" },
      { date: "2026-07-02", candidate: "Sarah Jenkins", interviewer: "Bob Johnson", format: "System Architecture", result: "Passed" },
      { date: "2026-06-28", candidate: "Michael Scott", interviewer: "Jane Smith", format: "Behavioral", result: "Failed" }
    ],
    billing: [
      { id: "INV-2026-001", amount: 4500.00, status: "Paid", issued: "2026-06-01", due: "2026-06-15" },
      { id: "INV-2026-003", amount: 6500.00, status: "Pending", issued: "2026-07-01", due: "2026-07-15" }
    ]
  },
  "COMP-102": {
    name: "Quantum Byte",
    domain: "quantbyte.com",
    tier: "Professional",
    status: "Active",
    users: 15,
    maxUsers: 30,
    joined: "2026-02-10",
    roles: ["Admin", "Recruiter", "Hiring Manager"],
    members: [
      { name: "Steve Wozniak", email: "woz@quantbyte.com", role: "Admin", status: "Active", joined: "2026-02-11" },
      { name: "Linus Torvalds", email: "linus@quantbyte.com", role: "Hiring Manager", status: "Active", joined: "2026-02-15" },
      { name: "Ada Lovelace", email: "ada@quantbyte.com", role: "Recruiter", status: "Active", joined: "2026-03-01" }
    ],
    posts: [
      { title: "Quantum Computing Lead", department: "R&D", status: "Active", applicants: 9, date: "2026-06-25" },
      { title: "Compiler Optimization Dev", department: "Core Systems", status: "Active", applicants: 15, date: "2026-07-01" }
    ],
    talent: [
      { candidate: "Richard Feynman", title: "Quantum Physicist", match: "100%", status: "Hired", score: 99 },
      { candidate: "Grace Hopper", title: "CS Architect", match: "91%", status: "Sourced", score: 90 }
    ],
    analytics: {
      postVolume: 8,
      matchesFound: 45,
      interviewsCompleted: 12,
      tokensUsed: 220
    },
    interviews: [
      { date: "2026-06-30", candidate: "Richard Feynman", interviewer: "Linus Torvalds", format: "Physics & Logic QA", result: "Passed" },
      { date: "2026-06-15", candidate: "Grace Hopper", interviewer: "Ada Lovelace", format: "Compiler Assembly", result: "Passed" }
    ],
    billing: [
      { id: "INV-2026-002", amount: 1500.00, status: "Paid", issued: "2026-06-01", due: "2026-06-15" }
    ]
  },
  "COMP-103": {
    name: "CyberDyne Systems",
    domain: "cyberdyne-systems.com",
    tier: "Enterprise",
    status: "Active",
    users: 84,
    maxUsers: 150,
    joined: "2025-11-20",
    roles: ["Super Admin", "Recruiter", "Hiring Manager"],
    members: [
      { name: "Miles Dyson", email: "m.dyson@cyberdyne-systems.com", role: "Super Admin", status: "Active", joined: "2025-11-21" },
      { name: "John Connor", email: "j.connor@cyberdyne-systems.com", role: "Hiring Manager", status: "Active", joined: "2025-12-01" }
    ],
    posts: [
      { title: "Principal Algorithmic Engineer", department: "Algorithms", status: "Active", applicants: 88, date: "2026-05-18" }
    ],
    talent: [
      { candidate: "T-800 Cyber", title: "Chassis Specialist", match: "95%", status: "Sourced", score: 93 }
    ],
    analytics: {
      postVolume: 32,
      matchesFound: 540,
      interviewsCompleted: 98,
      tokensUsed: 1450
    },
    interviews: [
      { date: "2026-07-01", candidate: "T-800 Cyber", interviewer: "Miles Dyson", format: "Live CPU Sync Test", result: "Passed" }
    ],
    billing: [
      { id: "INV-2026-003", amount: 6500.00, status: "Pending", issued: "2026-07-01", due: "2026-07-15" }
    ]
  }
};

const defaultCompany = {
  name: "Generic Organization",
  domain: "generic.com",
  tier: "Starter",
  status: "Active",
  users: 5,
  maxUsers: 10,
  joined: "2026-03-15",
  roles: ["Admin", "Recruiter"],
  members: [
    { name: "Generic User", email: "user@generic.com", role: "Admin", status: "Active", joined: "2026-03-16" }
  ],
  posts: [],
  talent: [],
  analytics: { postVolume: 0, matchesFound: 0, interviewsCompleted: 0, tokensUsed: 0 },
  interviews: [],
  billing: []
};

const MasterCompanyOverview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("posts");

  const company = companyDatabase[id] || { ...defaultCompany, name: `Company Profile (${id})` };

  // Fetch users from API (eager)
  const { data: usersResponse, isLoading: usersLoading } = useGetCompanyUsersQuery(id, { skip: !id });
  // Fetch jobs lazily — triggered by clicking a member row
  const [fetchMemberJobs, { data: jobsResponse, isLoading: jobsLoading }] = useLazyGetCompanyJobListQuery();
  // Fetch interviews lazily — triggered by clicking a member row
  const [fetchMemberInterviews, { data: interviewsResponse, isLoading: interviewsLoading }] = useLazyGetInterviewSchedulesQuery();

  const [selectedMember, setSelectedMember] = useState(null);

  const apiMembers = usersResponse?.data || [];
  const apiJobs = jobsResponse?.data || [];
  const apiInterviews = interviewsResponse?.data || [];

  const handleMemberClick = (member) => {
    setSelectedMember(member);
    fetchMemberJobs(member.authInfoID);
    fetchMemberInterviews(member.authInfoID);
    setActiveTab("posts");
  };

  const tabItems = [
    { id: "posts", name: "Job Posts", icon: Briefcase },
    { id: "analytics", name: "Analytics", icon: BarChart3 },
    { id: "interviews", name: "Interviews Done", icon: Calendar },
    { id: "tokens", name: "Tokens & Subscription", icon: CreditCard }
  ];

  return (
    <div className="overview-page-container">
      {/* Top Navigation Header */}
      <div className="overview-header-nav-row">
        <button className="back-list-btn" onClick={() => navigate("/MasterAdmin/companies")}>
          <ArrowLeft size={16} />
          <span>Back to Companies</span>
        </button>
        <div className="header-meta-details">
          <span className="comp-id-pill">{id}</span>
          <span className="joined-label">Workspace active since {company.joined}</span>
        </div>
      </div>

      {/* Hero Overview Profile Summary */}
      <section className="overview-hero-card">
        <div className="hero-left-profile">
          <div className="hero-avatar-box">
            <Building2 size={32} />
          </div>
          <div className="hero-profile-details">
            <div className="title-status-row">
              <h2>{company.name}</h2>
              <span className={`status-pill ${company.status.toLowerCase()}`}>
                {company.status}
              </span>
            </div>
            <div className="domain-row">
              <Globe size={14} />
              <a href={`https://${company.domain}`} target="_blank" rel="noreferrer">
                {company.domain}
              </a>
            </div>
          </div>
        </div>

        <div className="hero-right-roles">
          <span className="roles-title">Allocated Security Roles</span>
          <div className="roles-badges-list">
            {company.roles.map((role, idx) => (
              <span key={idx} className="role-tag">
                <Shield size={12} />
                <span>{role}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Members Table Section */}
      <section className="members-section-wrapper">
        <div className="section-title-row">
          <div className="title-desc">
            <h3>Registered Team Members</h3>
            <p>Displaying accounts enrolled in the client workspace ({apiMembers.length} active / {company.maxUsers} limit)</p>
          </div>
          <div className="quota-bar-wrapper">
            <div className="quota-bar-info">
              <span>Seats Filled:</span>
              <strong>{company.maxUsers ? Math.round((apiMembers.length / company.maxUsers) * 100) : 0}%</strong>
            </div>
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{ width: `${company.maxUsers ? (apiMembers.length / company.maxUsers) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="table-card-container">
          {usersLoading ? (
            <div className="panel-empty-state"><Loader2 size={18} className="spin-icon" /> Loading members...</div>
          ) : apiMembers.length === 0 ? (
            <div className="panel-empty-state">No team members registered in this workspace.</div>
          ) : (
            <table className="overview-matching-table">
              <thead>
                <tr>
                  <th>Member Name</th>
                  <th>Corporate Email</th>
                  <th>Allocated Role</th>
                  <th>Account Status</th>
                  <th>Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {apiMembers.map((member, idx) => (
                  <tr
                    key={member.authInfoID || idx}
                    onClick={() => handleMemberClick(member)}
                    style={{ cursor: "pointer" }}
                    className={selectedMember?.authInfoID === member.authInfoID ? "member-row-selected" : ""}
                  >
                    <td className="member-name-col">
                      <div className="avatar-letter">{member.memberName?.[0]?.toUpperCase() || "?"}</div>
                      <span className="bold-text">{member.memberName || "—"}</span>
                    </td>
                    <td className="email-col">{member.corporateEmail || "—"}</td>
                    <td className="role-col">
                      <span className="role-badge-text">
                        {member.allocatedRole === "Recruiter2"
                          ? "Recruiter"
                          : member.allocatedRole === "Recruiter"
                            ? "Hiring Manager"
                            : member.allocatedRole || "—"}
                      </span>
                    </td>
                    <td>
                      <span className={`status-dot-text ${(member.accountStatus || "").toLowerCase()}`}>
                        <span className="dot"></span>
                        <span>{member.accountStatus || "—"}</span>
                      </span>
                    </td>
                    <td className="date-col">
                      {member.joinedDate ? new Date(member.joinedDate).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Tabs Controller Matrix */}
      <section className="tabs-matrix-container">
        {/* Navigation Tabs Bar */}
        <div className="tabs-bar-navigation">
          {tabItems.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`tab-btn-item ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={16} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Panels */}
        <div className="tab-content-panel">
          {activeTab === "posts" && (
            <div className="tab-panel-posts">
              <div className="panel-header">
                <h4>
                  {selectedMember
                    ? <>Job Vacancies &mdash; <span style={{ color: "var(--primary)" }}>{selectedMember.memberName}</span></>
                    : "Active Job Vacancies"}
                </h4>
                <span className="count-pill">{selectedMember ? `${apiJobs.length} Openings` : "Select a member"}</span>
              </div>

              {!selectedMember ? (
                <div className="panel-empty-state">
                  Click on any team member above to load their job list.
                </div>
              ) : jobsLoading ? (
                <div className="panel-empty-state"><Loader2 size={18} className="spin-icon" /> Loading jobs...</div>
              ) : apiJobs.length === 0 ? (
                <div className="panel-empty-state">No job vacancies found for {selectedMember.memberName}.</div>
              ) : (
                <div className="table-card-container">
                  <table className="overview-matching-table">
                    <thead>
                      <tr>
                        <th>Job Title</th>
                        <th>Department</th>
                        <th>Created Date</th>
                        <th>Applicants</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {apiJobs.map((post, idx) => (
                        <tr key={post.jobID || idx}>
                          <td className="bold-text">{post.jobTitle || "—"}</td>
                          <td>{post.department || "—"}</td>
                          <td className="date-col">
                            {post.createdDate ? new Date(post.createdDate).toLocaleDateString() : "—"}
                          </td>
                          <td className="bold-text">{post.applicants ?? 0} applicants</td>
                          <td>
                            <span className={`status-badge-outline ${(post.status || "").toLowerCase()}`}>
                              {post.status || "—"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}



          {activeTab === "analytics" && (
            <div className="tab-panel-analytics">
              <div className="panel-header">
                <h4>Workspace Utilization Analytics</h4>
              </div>
              <div className="analytics-metrics-grid">
                <div className="metric-box-large">
                  <span className="lbl">Total Jobs Generated</span>
                  <strong className="val">{company.analytics.postVolume}</strong>
                  <span className="change positive">+15% vs last month</span>
                </div>
                <div className="metric-box-large">
                  <span className="lbl">System Matches Analyzed</span>
                  <strong className="val">{company.analytics.matchesFound}</strong>
                  <span className="change positive">+24% vs last month</span>
                </div>
                <div className="metric-box-large">
                  <span className="lbl">Interviews Completed</span>
                  <strong className="val">{company.analytics.interviewsCompleted}</strong>
                  <span className="change positive">+8% vs last month</span>
                </div>
                <div className="metric-box-large">
                  <span className="lbl">Token Allocation Consumed</span>
                  <strong className="val">{company.analytics.tokensUsed} tokens</strong>
                  <span className="change warning">82% of current pool</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "interviews" && (
            <div className="tab-panel-interviews">
              <div className="panel-header">
                <h4>
                  {selectedMember
                    ? <>Interview Schedules &mdash; <span style={{ color: "var(--primary)" }}>{selectedMember.memberName}</span></>
                    : "Completed and Scheduled Assessments"}
                </h4>
                <span className="count-pill">{selectedMember ? `${apiInterviews.length} Interviews` : "Select a member"}</span>
              </div>

              {!selectedMember ? (
                <div className="panel-empty-state">
                  Click on any team member above to load their interview schedules.
                </div>
              ) : interviewsLoading ? (
                <div className="panel-empty-state"><Loader2 size={18} className="spin-icon" /> Loading interviews...</div>
              ) : apiInterviews.length === 0 ? (
                <div className="panel-empty-state">No interview schedules found for {selectedMember.memberName}.</div>
              ) : (
                <div className="table-card-container">
                  <table className="overview-matching-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Candidate</th>
                        <th>Job Title</th>
                        <th>Time</th>
                        <th>Mode</th>
                        <th>Interviewer</th>
                        <th>Meeting Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {apiInterviews.map((item, idx) => (
                        <tr key={item.candidateID || idx}>
                          <td className="date-col">
                            {item.interviewDate ? new Date(item.interviewDate).toLocaleDateString() : "\u2014"}
                          </td>
                          <td className="bold-text">{item.candidateName || "\u2014"}</td>
                          <td>{item.jobTitle || "\u2014"}</td>
                          <td>{item.interviewTime || "\u2014"}</td>
                          <td>{item.interviewMode || "\u2014"}</td>
                          <td>{item.interviewerName || "\u2014"}</td>
                          <td>
                            <span className={`status-badge-outline ${(item.meetingLinkStatus || "").toLowerCase()}`}>
                              {item.meetingLinkStatus || "\u2014"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "tokens" && (
            <div className="tab-panel-tokens">
              {/* Subscription telemetry */}
              <div className="subscription-billing-grid">
                <div className="sub-detail-panel">
                  <h4>Tokens & Licensing Summary</h4>
                  <div className="sub-rows-wrapper">
                    <div className="sub-detail-row">
                      <span>Assigned Plan Level:</span>
                      <strong>{company.tier} Plan</strong>
                    </div>
                    <div className="sub-detail-row">
                      <span>Platform Rate:</span>
                      <strong>{company.tier === "Enterprise" ? "$1,500.00 / mo" : "$500.00 / mo"}</strong>
                    </div>
                    <div className="sub-detail-row">
                      <span>Token Pool Remaining:</span>
                      <strong>{company.analytics.tokensUsed * 2} Credits</strong>
                    </div>
                    <div className="sub-detail-row">
                      <span>Licensing renewal:</span>
                      <strong>August 01, 2026</strong>
                    </div>
                  </div>
                </div>

                <div className="billing-ledger-panel">
                  <div className="panel-header">
                    <h4>Billing & Invoices History</h4>
                  </div>

                  {company.billing.length === 0 ? (
                    <div className="panel-empty-state">No billing invoices have been issued.</div>
                  ) : (
                    <div className="table-card-container">
                      <table className="overview-matching-table">
                        <thead>
                          <tr>
                            <th>Invoice ID</th>
                            <th>Billing Amount</th>
                            <th>Issued Date</th>
                            <th>Payment Status</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {company.billing.map((b, idx) => (
                            <tr key={idx}>
                              <td className="bold-text inv-id-text">{b.id}</td>
                              <td className="bold-text">${b.amount.toFixed(2)}</td>
                              <td className="date-col">{b.issued}</td>
                              <td>
                                <span className={`status-tag ${b.status.toLowerCase()}`}>
                                  {b.status}
                                </span>
                              </td>
                              <td className="action-col">
                                <button className="inv-dl-btn" title="Download Invoice Bundle">
                                  <Download size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MasterCompanyOverview;
