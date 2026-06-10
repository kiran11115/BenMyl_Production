import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CustomConfirm } from "../Common/CustomAlert";

import {
  FiArrowLeft,
  FiUser,
  FiCheck,
  FiSearch,
  FiPlus,
  FiTrash2,
  FiFlag,
  FiInfo,
} from "react-icons/fi";
import "./Projects.css";
import "../Dashboard/Dashboard.css";
import "../Auth/Auth.css";

// Mock: talent who have completed interviews
const INTERVIEWED_TALENT = [
  {
    id: 101,
    name: "Sarah Anderson",
    role: "Senior Frontend Developer",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80",
    experience: "6+ Years",
    rating: 4.8,
    verified: true,
  },
  {
    id: 102,
    name: "Linda Garcia",
    role: "Backend Engineer",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80",
    experience: "7+ Years",
    rating: 4.6,
    verified: true,
  },
  {
    id: 103,
    name: "James Thompson",
    role: "UX Designer",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80",
    experience: "4+ Years",
    rating: 4.7,
    verified: true,
  },
  {
    id: 104,
    name: "Robert Miller",
    role: "DevOps Engineer",
    avatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80",
    experience: "5+ Years",
    rating: 4.4,
    verified: true,
  },
];

export default function CreateProject() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    currency: "USD",
    dueDate: "",
    roles: [], // Changed from role: "" to roles: []
  });

  const [isTeamConfirmed, setIsTeamConfirmed] = useState(false);
  const [customConfirm, setCustomConfirm] = useState(null);
  const [roleSearch, setRoleSearch] = useState("");

  const ROLE_OPTIONS = [
    { id: "Frontend", label: "Frontend Developer" },
    { id: "Backend", label: "Backend Engineer" },
    { id: "UX", label: "UI/UX Designer" },
    { id: "DevOps", label: "DevOps Engineer" },
    { id: "Product", label: "Product Manager" },
    { id: "QA", label: "QA Engineer" },
    { id: "Mobile", label: "Mobile Developer" },
  ];

  const filteredRoles = ROLE_OPTIONS.filter(r => 
    r.label.toLowerCase().includes(roleSearch.toLowerCase()) && 
    !formData.roles.includes(r.id)
  );


  const [milestones, setMilestones] = useState([
    "Requirement Analysis",
    "Design Phase",
  ]);
  const [selectedTalentIds, setSelectedTalentIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTalent = useMemo(() => {
    // 1. Basic search filtering
    let list = INTERVIEWED_TALENT.filter(
      (t) =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 2. Sort based on selected roles (matches first)
    if (formData.roles.length > 0) {
      list = [...list].sort((a, b) => {
        const aMatches = formData.roles.some((r) => a.role.includes(r));
        const bMatches = formData.roles.some((r) => b.role.includes(r));
        if (aMatches && !bMatches) return -1;
        if (!aMatches && bMatches) return 1;
        return 0;
      });
    }

    return list;
  }, [searchTerm, formData.roles]);

  const toggleRole = (role) => {
    setFormData((prev) => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role],
    }));
  };

  const toggleTalent = (id) =>
    setSelectedTalentIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );


  const addMilestone = () => setMilestones([...milestones, ""]);
  const removeMilestone = (i) =>
    setMilestones(milestones.filter((_, idx) => idx !== i));
  const updateMilestone = (i, v) => {
    const next = [...milestones];
    next[i] = v;
    setMilestones(next);
  };

  const executeSave = () => {
    const selectedTeam = INTERVIEWED_TALENT.filter((t) =>
      selectedTalentIds.includes(t.id)
    );

    const newProject = {
      ...formData,
      role: formData.roles.join(", "), // Flatten for storage consistency
      id: Date.now(),

      progress: 0,
      status: "In Progress",
      author: localStorage.getItem("UserName") || "Admin",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80",
      team: selectedTeam,
      milestones: milestones
        .filter((m) => m.trim() !== "")
        .map((m, i) => ({
          id: i + 1,
          title: m,
          completed: false,
          date:
            formData.dueDate ||
            new Date().toISOString().split("T")[0],
        })),
    };
    const existing = JSON.parse(
      localStorage.getItem("customProjects") || "[]"
    );
    localStorage.setItem(
      "customProjects",
      JSON.stringify([...existing, newProject])
    );
    const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
    navigate(`${basePath}/user-projects`);
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a project title to proceed.");
      return;
    }
    if (formData.roles.length === 0) {
      toast.error("Please select at least one core business role.");
      return;
    }
    if (selectedTalentIds.length === 0) {
      toast.error("Please assign at least one team member to this project.");
      return;
    }
    if (!isTeamConfirmed) {
      setCustomConfirm({
        title: "Unconfirmed Team Selection",
        message: "The team selection has not been formally confirmed. Launch project anyway?",
        confirmText: "Yes, Launch Anyway",
        cancelText: "Cancel",
        onConfirm: () => {
          setCustomConfirm(null);
          executeSave();
        }
      });
      return;
    }
    executeSave();
  };

  /* ──────────────────────────────────────────── */
  return (
    <div className="detail-page-wrapper">
      <div className="detail-page-container">
        {/* Breadcrumb */}
        <div className="profile-breadcrumb d-flex gap-2 mb-3" style={{ fontSize: "13px" }}>
          <button
            className="link-button d-flex align-items-center gap-1"
            onClick={() => {
              const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
              navigate(`${basePath}/user-projects`);
            }}
            style={{ color: "#f5810c" }}
          >
            <FiArrowLeft size={13} /> Projects
          </button>
          <span className="crumb">/ Create New Project</span>
        </div>


        {/* Title */}
        <div className="detail-header-section">

          <h1 className="detail-title">Initialize New Project</h1>
          <p className="detail-subtitle">
            Define project parameters, set milestones, and assemble your expert team.
          </p>
        </div>


        {/* Two-column layout */}
        <div className="detail-main-layout">

          {/* ── LEFT: Form card ── */}
          <div className="detail-card" style={{ padding: 0 }}>
            {/* Card header strip */}
            <div
              style={{
                padding: "22px 28px",
                borderBottom: "1px solid #f1f5f9",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>
                Project Configuration
              </h3>

              <span
                style={{
                  fontSize: "11px", fontWeight: 700,
                  background: "rgba(245,129,12,0.1)",
                  color: "#f5810c",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  border: "1px solid rgba(245,129,12,0.2)",
                }}
              >
                Step 1 of 2
              </span>
            </div>

            {/* Form body */}
            <div style={{ padding: "28px" }}>
              {/* Project title */}
              <div style={{ marginBottom: "20px" }}>
                <label className="auth-label">
                  Project Title <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  className="auth-input"
                  placeholder="e.g. Next-Gen Mobile Banking Interface"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              {/* Budget + Due date */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <label className="auth-label">Allocation Budget</label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "10px",
                      overflow: "hidden",
                      transition: "border-color 0.2s, box-shadow 0.2s",
                    }}
                    onFocusCapture={(e) => {
                      e.currentTarget.style.borderColor = "#f5810c";
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(245, 129, 12, 0.1)";
                    }}
                    onBlurCapture={(e) => {
                      e.currentTarget.style.borderColor = "#e2e8f0";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <span
                      style={{
                        padding: "0 14px",
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#94a3b8",
                        background: "#f8fafc",
                        borderRight: "1px solid #e2e8f0",
                        height: "44px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      $
                    </span>
                    <input
                      type="number"
                      placeholder="5000"
                      value={formData.budget}
                      onChange={(e) =>
                        setFormData({ ...formData, budget: e.target.value })
                      }
                      style={{
                        flex: 1,
                        border: "none",
                        outline: "none",
                        padding: "0 16px",
                        height: "44px",
                        fontSize: "14px",
                        color: "#1e293b",
                        background: "transparent",
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label className="auth-label">Target Completion Date</label>
                  <input
                    type="date"
                    className="auth-input"
                    style={{ height: "46px" }}
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Searchable Multi-selectable Roles */}
              <div style={{ marginBottom: "20px" }}>
                <label className="auth-label">Core Business Roles Required</label>
                
                {/* Selected Roles Pills */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
                  {formData.roles.map((roleId) => {
                    const roleLabel = ROLE_OPTIONS.find(ro => ro.id === roleId)?.label;
                    return (
                      <span
                        key={roleId}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "6px 12px",
                          background: "rgba(245, 129, 12, 0.1)",
                          color: "#f5810c",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: 700,
                          border: "1px solid rgba(245, 129, 12, 0.2)",
                        }}
                      >
                        {roleLabel}
                        <button
                          type="button"
                          onClick={() => toggleRole(roleId)}
                          style={{ background: "none", border: "none", color: "#f5810c", cursor: "pointer", display: "flex", padding: 0 }}
                        >
                          <FiTrash2 size={12} />
                        </button>
                      </span>
                    );
                  })}
                </div>

                {/* Role Search Input */}
                <div style={{ position: "relative" }}>
                  <div style={{ position: "relative" }}>
                    <FiSearch
                      size={14}
                      style={{
                        position: "absolute", left: "12px", top: "50%",
                        transform: "translateY(-50%)", color: "#94a3b8"
                      }}
                    />
                    <input
                      type="text"
                      className="auth-input"
                      style={{ paddingLeft: "38px", height: "46px" }}
                      placeholder="Search and add project roles..."
                      value={roleSearch}
                      onChange={(e) => setRoleSearch(e.target.value)}
                    />
                  </div>

                  {/* Dropdown Results */}
                  {roleSearch && filteredRoles.length > 0 && (
                    <div
                      className="role-dropdown-modern"
                      style={{
                        position: "absolute",
                        top: "100%", left: 0, right: 0,
                        background: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "12px",
                        marginTop: "8px",
                        boxShadow: "0 12px 20px -5px rgba(15, 23, 42, 0.15)",
                        zIndex: 100,
                        maxHeight: "240px",
                        overflowY: "auto",
                        animation: "slideIn 0.2s ease",
                      }}
                    >
                      {filteredRoles.map(role => (
                        <div
                          key={role.id}
                          onClick={() => {
                            toggleRole(role.id);
                            setRoleSearch("");
                          }}
                          style={{
                            padding: "12px 16px",
                            cursor: "pointer",
                            fontSize: "13.5px",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            color: "#334155",
                            transition: "all 0.2s",
                          }}
                          className="role-option-item"
                        >
                          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f5810c", opacity: 0.5 }} />
                          {role.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>





              {/* Description */}
              <div style={{ marginBottom: "20px" }}>
                <label className="auth-label">
                  Project Scope & Objectives
                </label>
                <textarea
                  className="auth-input"
                  rows="4"
                  placeholder="Provide a high-level overview of the project goals..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  style={{ height: "120px", resize: "vertical" }}
                />
              </div>

              {/* Milestones */}
              <div
                style={{
                  marginTop: "32px",
                  paddingTop: "28px",
                  borderTop: "1px solid #f1f5f9",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px",
                  }}
                >
                  <h4
                    style={{
                      margin: 0,
                      fontSize: "13.5px",
                      fontWeight: 700,
                      color: "#0f172a",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <FiFlag style={{ color: "#f5810c" }} />
                    Key Milestones
                  </h4>
                  <button
                    type="button"
                    className="btn-review"
                    style={{ fontSize: "12px", padding: "6px 16px", gap: "6px", width: "160px" }}

                    onClick={addMilestone}
                  >
                    <FiPlus size={13} /> Add Milestone
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {milestones.map((m, i) => (
                    <div
                      key={i}
                      style={{ display: "flex", gap: "10px", animation: "slideIn .25s ease" }}
                    >
                      <div
                        style={{
                          width: "32px", height: "44px",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "#94a3b8", fontSize: "12px", fontWeight: 800,
                          flexShrink: 0,
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <input
                        type="text"
                        className="auth-input flex-grow-1"
                        style={{ height: "44px", fontSize: "14px" }}
                        placeholder={`Milestone #${i + 1}`}
                        value={m}
                        onChange={(e) => updateMilestone(i, e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => removeMilestone(i)}
                        style={{
                          width: "44px", height: "44px", flexShrink: 0,
                          borderRadius: "10px", border: "1px solid #fee2e2",
                          background: "#fff", color: "#ef4444",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          cursor: "pointer", transition: "all .2s",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = "#fff5f5";
                          e.currentTarget.style.borderColor = "#fecaca";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = "#fff";
                          e.currentTarget.style.borderColor = "#fee2e2";
                        }}
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer CTAs */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "16px",
                  marginTop: "36px",
                  paddingTop: "28px",
                  borderTop: "1px solid #f1f5f9",
                }}
              >
                <button
                  type="button"
                  className="btn-review"
                  onClick={() => {
                    const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
                    navigate(`${basePath}/user-projects`);
                  }}
                >
                  Discard
                </button>
                <button
                  type="button"
                  className="btn-upload"
                  onClick={handleSave}
                >
                  Launch & Assign Team
                </button>
              </div>


            </div>
          </div>


          {/* ── RIGHT: Assign Team sidebar ── */}
          <div
            className="detail-card"
            style={{
              padding: 0,
              position: "sticky",
              top: "24px",
            }}
          >

            {/* Sidebar header */}
            <div
              style={{
                padding: "20px 20px 16px",
                borderBottom: "1px solid #f1f5f9",
                background: "#f8fafc",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3
                  style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#0f172a" }}
                >
                  Assign Team
                </h3>
                <div
                  style={{
                    background: "#f5810c",
                    color: "#fff",
                    fontSize: "11px",
                    fontWeight: 700,
                    width: "22px", height: "22px",
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  {selectedTalentIds.length}
                </div>
              </div>
              <p
                style={{
                  fontSize: "12px", color: "#64748b", margin: "5px 0 0",
                }}
              >
                Select best talent for this project.
              </p>
            </div>

            {/* Search */}
            <div style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ position: "relative" }}>
                <FiSearch
                  size={13}
                  style={{
                    position: "absolute", left: "10px",
                    top: "50%", transform: "translateY(-50%)",
                    color: "#94a3b8", pointerEvents: "none",
                  }}
                />
                <input
                  type="text"
                  className="auth-input"
                  placeholder="Search professionals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    height: "38px", fontSize: "13px",
                    paddingLeft: "32px", margin: 0,
                  }}
                />
              </div>
            </div>

            {/* Talent list */}
            <div
              style={{
                height: "400px", // Fixed height
                overflowY: "auto",
                padding: "10px 16px",
                borderBottom: "1px solid #e9e9e9ff",
              }}
            >
              {filteredTalent.length > 0 ? (
                filteredTalent.map((talent) => {
                  const isSelected = selectedTalentIds.includes(talent.id);
                  return (
                    <div
                      key={talent.id}
                      onClick={() => !isTeamConfirmed && toggleTalent(talent.id)}
                      style={{
                        display: "flex", alignItems: "center", gap: "12px",
                        padding: "12px",
                        borderRadius: "12px",
                        marginBottom: "8px",
                        cursor: isTeamConfirmed ? "default" : "pointer",
                        border: isSelected ? "1px solid rgba(245,129,12,0.3)" : "1px solid #f1f5f9",
                        background: isSelected ? "rgba(245,129,12,0.05)" : "#fff",
                        transition: "all .2s",
                        opacity: isTeamConfirmed && !isSelected ? 0.5 : 1,
                      }}
                      onMouseOver={(e) => {
                        if (!isSelected && !isTeamConfirmed) e.currentTarget.style.background = "#f8fafc";
                      }}
                      onMouseOut={(e) => {
                        if (!isSelected && !isTeamConfirmed) e.currentTarget.style.background = "#fff";
                      }}
                    >
                      {/* Avatar */}
                      <div style={{ position: "relative", flexShrink: 0 }}>
                        <img
                          src={talent.avatar}
                          alt={talent.name}
                          style={{
                            width: "40px", height: "40px",
                            borderRadius: "10px", objectFit: "cover",
                            border: "1.5px solid #f1f5f9",
                          }}
                        />
                        {isSelected && (
                          <div
                            style={{
                              position: "absolute", bottom: "-3px", right: "-3px",
                              width: "16px", height: "16px", borderRadius: "50%",
                              background: "#f5810c",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              border: "2px solid #fff",
                            }}
                          >
                            <FiCheck size={9} color="#fff" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: "13px", fontWeight: 700, color: "#0f172a",
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          }}
                        >
                          {talent.name}
                        </div>
                        <div
                          style={{
                            fontSize: "11.5px", color: "#64748b",
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          }}
                        >
                          {talent.role}
                        </div>
                      </div>

                      {/* Matching Tag */}
                      {formData.roles.some(r => talent.role.includes(r)) && (
                        <div style={{ background: "#ecfdf5", color: "#059669", fontSize: "10px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px" }}>
                          MATCH
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div
                  style={{
                    textAlign: "center", padding: "40px 0",
                    color: "#94a3b8",
                  }}
                >
                  <FiUser size={32} style={{ marginBottom: "8px", opacity: 0.3 }} />
                  <p style={{ fontSize: "13px" }}>No professionals found</p>
                </div>
              )}
            </div>

            {/* Selected Team Summary - MOVED TO BOTTOM OF SIDEBAR */}
            <div
              style={{
                padding: "20px 16px",
                background: "#ffffff",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <h4 style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>
                  Assembled Team
                </h4>
                {selectedTalentIds.length > 0 && isTeamConfirmed && (
                  <span style={{ fontSize: "10px", fontWeight: 700, color: "#059669", background: "#ecfdf5", padding: "2px 8px", borderRadius: "20px" }}>
                    CONFIRMED
                  </span>
                )}
              </div>

              {selectedTalentIds.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {INTERVIEWED_TALENT.filter(t => selectedTalentIds.includes(t.id)).map((member) => (
                    <div
                      key={member.id}
                      style={{
                        display: "flex", alignItems: "center", gap: "10px",
                        padding: "8px", border: "1px solid #f1f5f9",
                        borderRadius: "10px", background: "#f8fafc"
                      }}
                    >
                      <img
                        src={member.avatar}
                        alt={member.name}
                        style={{ width: "30px", height: "30px", borderRadius: "50%", objectFit: "cover" }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: "12px", fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {member.name}
                        </div>
                        <div style={{ fontSize: "10px", color: "#64748b" }}>{member.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    padding: "24px 0",
                    textAlign: "center",
                    border: "1px dashed #e2e8f0",
                    borderRadius: "12px",
                    background: "#f8fafc",
                  }}
                >
                  <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8", fontWeight: 500 }}>
                    No selected team
                  </p>
                  <p style={{ margin: "4px 0 0", fontSize: "10.5px", color: "#cbd5e1" }}>
                    Select talent from the list above to assemble your project team.
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Actions */}
            <div style={{ padding: "16px", background: "#fff" }}>
              <button
                type="button"
                className={isTeamConfirmed ? "btn-review" : "btn-upload"}
                disabled={selectedTalentIds.length === 0}
                style={{ width: "100%", height: "44px", fontSize: "13px", fontWeight: 700 }}
                onClick={() => {
                  if (isTeamConfirmed) {
                    setIsTeamConfirmed(false);
                  } else {
                    setCustomConfirm({
                      title: "Confirm Team Selection",
                      message: "Are you sure you want to confirm this team selection? This will prioritize these experts for the project launch.",
                      confirmText: "Yes, Confirm Team",
                      cancelText: "Cancel",
                      onConfirm: () => {
                        setCustomConfirm(null);
                        setIsTeamConfirmed(true);
                      }
                    });
                  }
                }}
              >
                {isTeamConfirmed ? (
                  <>
                    <FiCheck size={14} style={{ marginRight: "6px" }} /> Edit Selection
                  </>
                ) : (
                  "Confirm Team Selection"
                )}
              </button>
            </div>

            {/* Footer note */}
            <div
              style={{
                padding: "12px 16px",
                borderTop: "1px solid #f1f5f9",
                background: "#f8fafc",
                display: "flex", alignItems: "flex-start", gap: "8px",
                fontSize: "11px", color: "#64748b",
              }}
            >
              <FiInfo style={{ color: "#f5810c", flexShrink: 0, marginTop: "1px" }} />
              <span>
                Only showing members who have cleared all technical interview stages.
              </span>
            </div>
          </div>
        </div>
      </div>


      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .role-option-item:hover {
          background: #f8fafc;
          color: #f5810c !important;
          padding-left: 20px !important;
        }
      `}</style>

      {customConfirm && (
        <CustomConfirm
          title={customConfirm.title}
          message={customConfirm.message}
          confirmText={customConfirm.confirmText}
          cancelText={customConfirm.cancelText}
          onConfirm={customConfirm.onConfirm}
          onCancel={() => setCustomConfirm(null)}
          onClose={() => setCustomConfirm(null)}
        />
      )}
    </div>
  );
}
