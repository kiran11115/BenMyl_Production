import React, { useState, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiInfo,
  FiUsers,
  FiActivity,
  FiClock,
  FiDollarSign,
  FiCalendar,
  FiStar,
  FiMapPin,
  FiBriefcase,
  FiEdit,
  FiTrash2,
  FiCheckCircle,
  FiFile,
  FiMail,
  FiMessageSquare,
  FiExternalLink,
} from "react-icons/fi";
import { GiCheckMark } from "react-icons/gi";
import "./Projects.css";
import "../UpcomingInterview/UpcomingInterview.css";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const initialProject = location.state?.project;

  const [project] = useState(initialProject);
  const [activeTab, setActiveTab] = useState("overview");

  const [milestones, setMilestones] = useState([
    { id: 1, title: "Requirement Gathering",   completed: true,  date: "2023-11-01" },
    { id: 2, title: "UI/UX Design Mockups",    completed: true,  date: "2023-11-15" },
    { id: 3, title: "Frontend Development",    completed: false, date: "2023-12-01" },
    { id: 4, title: "Backend API Integration", completed: false, date: "2023-12-10" },
    { id: 5, title: "Final QA & User Testing", completed: false, date: "2023-12-20" },
  ]);

  const progress = useMemo(() => {
    const done = milestones.filter((m) => m.completed).length;
    return Math.round((done / milestones.length) * 100);
  }, [milestones]);

  const toggleMilestone = (mid) =>
    setMilestones((prev) =>
      prev.map((m) => (m.id === mid ? { ...m, completed: !m.completed } : m))
    );

  /* ── Guard: no project ── */
  if (!project) {
    return (
      <div className="ui-page">
        <div className="profile-breadcrumb d-flex gap-1 mb-4">
          <button className="link-button" onClick={() => {
            const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
            navigate(`${basePath}/user-projects`);
          }}>
            <FiArrowLeft /> Back to Projects
          </button>
        </div>
        <div className="no-data p-5 text-center bg-white rounded-3">
          <h3>Project details not found</h3>
        </div>
      </div>
    );
  }

  const TABS = [
    { key: "overview", label: "Overview",       Icon: FiInfo },
    { key: "team",     label: `Team (${project.team?.length || 0})`, Icon: FiUsers },
    { key: "progress", label: "Plan & Progress", Icon: FiActivity },
  ];

  /* ── status badge helper ── */
  const statusClass =
    project.status === "Completed"
      ? "status-completed"
      : project.status === "Awaiting Review"
      ? "status-review"
      : "status-progress";

  return (
    <div className="detail-page-wrapper">
      <div className="detail-page-container">
        {/* Breadcrumb */}
        <div className="profile-breadcrumb d-flex gap-2 mb-3" style={{ fontSize: "13px" }}>
          <button className="link-button d-flex align-items-center gap-1" onClick={() => {
            const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
            navigate(`${basePath}/user-projects`);
          }} style={{ color: "#f5810c" }}>
            <FiArrowLeft size={13} /> Projects
          </button>
          <span className="crumb">/ {project.title}</span>
        </div>

        {/* ── Page Header ── */}
        <div className="detail-header-section">
          <div>
            <div className="d-flex align-items-center gap-3 flex-wrap">
              <h1 className="detail-title">{project.title}</h1>
            </div>
            <p className="detail-subtitle" style={{ marginTop: "6px" }}>
              Managed by {project.author} · Updated 2 hours ago
            </p>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              className="share-copy-btn"
              style={{ background: "#f8fafc", color: "#64748b", border: "1px solid #e2e8f0" }}
              onMouseOver={(e) => { e.currentTarget.style.background = "#eff6ff"; e.currentTarget.style.color = "#3b82f6"; e.currentTarget.style.borderColor = "#bfdbfe"; }}
              onMouseOut={(e) => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.color = "#64748b"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
            >
              <FiEdit size={14} />
            </button>
            <button
              className="share-copy-btn"
              style={{ background: "#f8fafc", color: "#64748b", border: "1px solid #e2e8f0" }}
              onMouseOver={(e) => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.borderColor = "#fecaca"; }}
              onMouseOut={(e) => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.color = "#64748b"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
            >
              <FiTrash2 size={14} />
            </button>
            <span className={`status-tag ${statusClass}`} style={{ fontSize: "12px", padding: "6px 14px" }}>
              {project.status}
            </span>
          </div>
        </div>

        {/* ── Main card ── */}
        <div className="detail-card" style={{ padding: 0 }}>
          {/* Card Head Area for Tabs */}
          <div
            style={{
              padding: "20px 28px 0",
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            {/* Tabs */}
            <div style={{ display: "flex", gap: "4px" }}>
              {TABS.map(({ key, label, Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  style={{
                    padding: "12px 20px",
                    border: "none",
                    background: "none",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer",
                    color: activeTab === key ? "#f5810c" : "#94a3b8",
                    borderBottom: activeTab === key ? "3px solid #f5810c" : "3px solid transparent",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "-1.5px",
                  }}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Tab Body ── */}
          <div style={{ padding: "28px" }}>

            {/* ▸ OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="row g-4" style={{ animation: "fadeIn .3s ease" }}>
                {/* Left column */}
                <div className="col-lg-8">
                  {/* Scope card */}
                  <div
                    style={{
                      background: "#fff",
                      border: "1px solid #f1f5f9",
                      borderRadius: "16px",
                      padding: "24px",
                      marginBottom: "20px",
                    }}
                  >
                    <h3 className="section-title" style={{ marginBottom: "12px" }}>
                      Project Scope
                    </h3>
                    <p
                      style={{
                        color: "#64748b",
                        fontSize: "14px",
                        lineHeight: "1.75",
                        whiteSpace: "pre-wrap",
                        margin: 0,
                      }}
                    >
                      {project.description ||
                        "The goal is to modernize the user interface and improve the overall experience. This project involves a complete overhaul using modern frameworks with a focus on performance and accessibility."}
                    </p>

                    {/* Key metrics row */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3,1fr)",
                        gap: "16px",
                        marginTop: "24px",
                      }}
                    >
                      {[
                        { icon: FiDollarSign, label: "Budget", value: `$${project.budget?.toLocaleString()}` },
                        { icon: FiCalendar,   label: "Timeline", value: project.dueDate || "N/A" },
                        { icon: FiActivity,   label: "Progress", value: `${progress}%` },
                      ].map(({ icon: Icon, label, value }) => (
                        <div
                          key={label}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            background: "#f8fafc",
                            padding: "14px 16px",
                            borderRadius: "12px",
                            border: "1px solid #f1f5f9",
                          }}
                        >
                          <div
                            style={{
                              width: "38px", height: "38px", borderRadius: "10px",
                              background: "rgba(245,129,12,0.1)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              color: "#f5810c", flexShrink: 0,
                            }}
                          >
                            <Icon size={16} />
                          </div>
                          <div>
                            <div style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                              {label}
                            </div>
                            <div style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>
                              {value}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Milestones */}
                  <div
                    style={{
                      background: "#f8fafc",
                      border: "1px solid #f1f5f9",
                      borderRadius: "16px",
                      padding: "24px",
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h3 className="section-title" style={{ margin: 0 }}>
                        Core Milestones
                      </h3>
                      <span
                        style={{
                          fontSize: "11px", fontWeight: 700,
                          background: "#fff",
                          border: "1px solid #e2e8f0",
                          color: "#f5810c",
                          padding: "3px 12px",
                          borderRadius: "20px",
                        }}
                      >
                        {milestones.filter((m) => m.completed).length}/{milestones.length} Done
                      </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {milestones.map((m) => (
                        <div
                          key={m.id}
                          onClick={() => toggleMilestone(m.id)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "12px 16px",
                            borderRadius: "10px",
                            background: m.completed ? "rgba(16,185,129,0.05)" : "#fff",
                            border: `1px solid ${m.completed ? "rgba(16,185,129,0.2)" : "#e2e8f0"}`,
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                        >
                          <div
                            style={{
                              width: "20px", height: "20px", borderRadius: "6px",
                              border: `2px solid ${m.completed ? "#10b981" : "#cbd5e1"}`,
                              background: m.completed ? "#10b981" : "transparent",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              transition: "all 0.2s", flexShrink: 0,
                            }}
                          >
                            {m.completed && <FiCheckCircle size={11} color="#fff" />}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                fontSize: "13px", fontWeight: 600,
                                color: m.completed ? "#64748b" : "#0f172a",
                                textDecoration: m.completed ? "line-through" : "none",
                              }}
                            >
                              {m.title}
                            </div>
                            <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                              Target: {m.date}
                            </div>
                          </div>
                          {m.completed && (
                            <span className="status-tag status-completed">Achieved</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right column */}
                <div className="col-lg-4">
                  {/* Project Assets */}
                  <div
                    style={{
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "16px",
                      padding: "20px",
                      marginBottom: "16px",
                    }}
                  >
                    <h3 className="section-title" style={{ marginBottom: "14px" }}>
                      Project Assets
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {[
                        { name: "Project_SOW.pdf",        size: "2.4 MB" },
                        { name: "Design_System_v2.fig",   size: "15.8 MB" },
                        { name: "Backend_API_Spec.docx",  size: "1.1 MB" },
                      ].map((doc, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: "flex", alignItems: "center", gap: "10px",
                            padding: "10px 12px", borderRadius: "8px",
                            border: "1px solid #f1f5f9", background: "#f8fafc",
                            cursor: "pointer", transition: "background 0.2s",
                          }}
                          onMouseOver={(e) => e.currentTarget.style.background = "#f1f5f9"}
                          onMouseOut={(e) => e.currentTarget.style.background = "#f8fafc"}
                        >
                          <FiFile size={14} style={{ color: "#f5810c", flexShrink: 0 }} />
                          <span
                            style={{
                              flex: 1, fontSize: "12.5px", fontWeight: 500,
                              color: "#334155", overflow: "hidden",
                              textOverflow: "ellipsis", whiteSpace: "nowrap",
                            }}
                          >
                            {doc.name}
                          </span>
                          <span style={{ fontSize: "11px", color: "#94a3b8", flexShrink: 0 }}>
                            {doc.size}
                          </span>
                        </div>
                      ))}
                    </div>
                    <button
                      className="btn-review"
                      style={{ width: "100%", marginTop: "12px", fontSize: "12.5px" }}
                    >
                      View All Files
                    </button>
                  </div>

                  {/* Recent Activity */}
                  <div
                    style={{
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "16px",
                      padding: "20px",
                    }}
                  >
                    <h3 className="section-title" style={{ marginBottom: "16px" }}>
                      Recent Activity
                    </h3>
                    {[
                      { name: "Sarah Anderson", action: "updated UI mockups",  time: "Yesterday, 4:30 PM" },
                      { name: "Linda Garcia",   action: "completed API spec",  time: "2 days ago" },
                    ].map((act, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "flex", gap: "12px",
                          marginBottom: idx < 1 ? "14px" : 0,
                        }}
                      >
                        <div
                          style={{
                            width: "8px", height: "8px", borderRadius: "50%",
                            background: "#f5810c", marginTop: "5px", flexShrink: 0,
                          }}
                        />
                        <div>
                          <div style={{ fontSize: "13px", color: "#334155" }}>
                            <strong>{act.name}</strong> {act.action}
                          </div>
                          <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>
                            {act.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ▸ TEAM TAB */}
            {activeTab === "team" && (
              <div style={{ animation: "fadeIn .3s ease" }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="section-title" style={{ margin: 0 }}>
                    Assigned Professionals
                  </h3>
                  <button className="btn-upload">
                    <FiUsers size={13} /> Add Member
                  </button>
                </div>

                {project.team && project.team.length > 0 ? (
                  <div className="row g-4">
                    {project.team.map((member) => (
                      <div key={member.id} className="col-md-6 col-lg-4">
                        <div
                          style={{
                            background: "#fff",
                            border: "1px solid #e2e8f0",
                            borderRadius: "16px",
                            padding: "20px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "16px",
                            transition: "all 0.25s",
                            boxShadow: "0 2px 8px -1px rgba(15,23,42,0.05)",
                            width:"fit-content"
                          }}
                         className="project-card"
                        >
                          {/* Member header */}
                          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                            <img
                              src={member.avatar}
                              alt={member.name}
                              style={{
                                width: "52px", height: "52px", borderRadius: "100%",
                                objectFit: "cover", border: "2px solid #f1f5f9",
                              }}
                            />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  fontSize: "14px", fontWeight: 700, color: "#0f172a",
                                  display: "flex", alignItems: "center", gap: "6px",
                                }}
                              >
                                {member.name}
                                {member.verified && <GiCheckMark size={12} color="#059669" />}
                              </div>
                              <div style={{ fontSize: "12px", color: "#f5810c", fontWeight: 600 }}>
                                {member.role}
                              </div>
                              <div
                                style={{
                                  display: "flex", alignItems: "center", gap: "4px",
                                  fontSize: "11px", color: "#f59e0b", fontWeight: 700, marginTop: "2px",
                                }}
                              >
                                <FiStar size={11} fill="#f59e0b" />
                                {member.rating}
                              </div>
                            </div>
                          </div>

                          {/* Meta */}
                          <div
                            style={{
                              display: "grid", gridTemplateColumns: "1fr 1fr",
                              gap: "8px",
                            }}
                          >
                            {[
                              { icon: FiBriefcase, label: `${member.experience} Exp` },
                              { icon: FiMapPin,    label: "Remote" },
                            ].map(({ icon: Icon, label }) => (
                              <div
                                key={label}
                                style={{
                                  display: "flex", alignItems: "center", gap: "6px",
                                  fontSize: "12px", color: "#64748b", fontWeight: 500,
                                  background: "#f8fafc", padding: "8px 10px",
                                  borderRadius: "8px", border: "1px solid #f1f5f9",
                                }}
                              >
                                <Icon size={12} style={{ color: "#94a3b8" }} />
                                {label}
                              </div>
                            ))}
                          </div>

                          {/* Actions */}
                          <div
                            style={{
                              display: "flex", gap: "8px",
                              borderTop: "1px solid #f1f5f9", paddingTop: "14px",
                            }}
                          >
                            {[
                              { icon: FiMail, label: "Email" },
                              { icon: FiMessageSquare, label: "Chat" },
                            ].map(({ icon: Icon, label }) => (
                              <button
                                key={label}
                                title={label}
                                style={{
                                  width: "36px", height: "36px", borderRadius: "50%",
                                  border: "1px solid #e2e8f0", background: "#f8fafc",
                                  color: "#64748b", display: "flex", alignItems: "center",
                                  justifyContent: "center", cursor: "pointer",
                                  transition: "all 0.2s", flexShrink: 0,
                                }}
                              >
                                <Icon size={14} />
                              </button>
                            ))}
                            <button
                              className="btn-review"
                              style={{ flex: 1 }}
                              onClick={() => {
                                const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
                                navigate(`${basePath}/user-talentpool`, {
                                  state: { talentId: member.id },
                                });
                              }}
                            >
                              <FiExternalLink size={12} /> Profile
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "60px 0" }}>
                    <FiUsers size={48} style={{ color: "#e2e8f0", marginBottom: "12px" }} />
                    <h4 style={{ color: "#94a3b8", fontWeight: 600 }}>No Team Members Assigned</h4>
                    <p style={{ color: "#cbd5e1", fontSize: "13px" }}>
                      Click "Add Member" to select from vetted talent.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ▸ PROGRESS TAB */}
            {activeTab === "progress" && (
              <div style={{ animation: "fadeIn .3s ease" }}>
                <p style={{ color: "#64748b", fontSize: "14px", textAlign: "center", padding: "40px" }}>
                  Project milestones are tracked in the Overview tab. Detailed timeline visualization has been removed.
                </p>
              </div>
            )}

          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
