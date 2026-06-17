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
        <div className="profile-breadcrumb d-flex gap-2 mb-3 create-project-breadcrumb">
          <button
            className="link-button d-flex align-items-center gap-1 create-project-breadcrumb-link"
            onClick={() => {
              const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
              navigate(`${basePath}/user-projects`);
            }}
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
          <div className="detail-card">
            {/* Card header strip */}
            <div className="create-project-card-header">
              <h3 className="m-0">
                Project Configuration
              </h3>

              <span className="create-project-step-badge">
                Step 1 of 2
              </span>
            </div>

            {/* Form body */}
            <div className="create-project-form-body">
              {/* Project title */}
              <div className="create-project-field-group">
                <label className="auth-label">
                  Project Title <span className="create-project-required-star">*</span>
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
              <div className="create-project-grid-2col">
                <div>
                  <label className="auth-label">Allocation Budget</label>
                  <div className="create-project-budget-input-wrapper">
                    <span className="create-project-budget-currency-symbol">
                      $
                    </span>
                    <input
                      type="number"
                      placeholder="5000"
                      value={formData.budget}
                      onChange={(e) =>
                        setFormData({ ...formData, budget: e.target.value })
                      }
                      className="create-project-budget-input-field"
                    />
                  </div>
                </div>
                <div>
                  <label className="auth-label">Target Completion Date</label>
                  <input
                    type="date"
                    className="auth-input create-project-date-input"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Searchable Multi-selectable Roles */}
              <div className="create-project-field-group">
                <label className="auth-label">Core Business Roles Required</label>
                
                {/* Selected Roles Pills */}
                <div className="create-project-roles-pills">
                  {formData.roles.map((roleId) => {
                    const roleLabel = ROLE_OPTIONS.find(ro => ro.id === roleId)?.label;
                    return (
                      <span
                        key={roleId}
                        className="create-project-role-pill"
                      >
                        {roleLabel}
                        <button
                          type="button"
                          onClick={() => toggleRole(roleId)}
                          className="create-project-role-delete-btn"
                        >
                          <FiTrash2 size={12} />
                        </button>
                      </span>
                    );
                  })}
                </div>

                {/* Role Search Input */}
                <div className="create-project-search-input-wrapper">
                  <div className="create-project-search-input-wrapper">
                    <FiSearch
                      size={14}
                      className="create-project-search-icon"
                    />
                    <input
                      type="text"
                      className="auth-input create-project-search-input"
                      placeholder="Search and add project roles..."
                      value={roleSearch}
                      onChange={(e) => setRoleSearch(e.target.value)}
                    />
                  </div>

                  {/* Dropdown Results */}
                  {roleSearch && filteredRoles.length > 0 && (
                    <div className="role-dropdown-modern create-project-role-dropdown">
                      {filteredRoles.map(role => (
                        <div
                          key={role.id}
                          onClick={() => {
                            toggleRole(role.id);
                            setRoleSearch("");
                          }}
                          className="role-option-item create-project-role-option"
                        >
                          <div className="create-project-role-dot" />
                          {role.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>





              {/* Description */}
              <div className="create-project-field-group">
                <label className="auth-label">
                  Project Scope & Objectives
                </label>
                <textarea
                  className="auth-input create-project-textarea"
                  rows="4"
                  placeholder="Provide a high-level overview of the project goals..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              {/* Milestones */}
              <div className="create-project-milestones-section">
                <div className="create-project-milestones-header">
                  <h4 className="create-project-milestones-title">
                    <FiFlag style={{ color: "#f5810c" }} />
                    Key Milestones
                  </h4>
                  <button
                    type="button"
                    className="btn-review create-project-milestones-add-btn"
                    onClick={addMilestone}
                  >
                    <FiPlus size={13} /> Add Milestone
                  </button>
                </div>

                <div className="create-project-milestone-list">
                  {milestones.map((m, i) => (
                    <div
                      key={i}
                      className="create-project-milestone-row"
                    >
                      <div className="create-project-milestone-number">
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <input
                        type="text"
                        className="auth-input flex-grow-1 create-project-milestone-input"
                        placeholder={`Milestone #${i + 1}`}
                        value={m}
                        onChange={(e) => updateMilestone(i, e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => removeMilestone(i)}
                        className="create-project-milestone-delete-btn"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer CTAs */}
              <div className="create-project-footer">
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
          <div className="detail-card create-project-sidebar">

            {/* Sidebar header */}
            <div className="create-project-sidebar-header">
              <div className="create-project-sidebar-title-row">
                <h3 className="create-project-sidebar-title">
                  Assign Team
                </h3>
                <div className="create-project-sidebar-counter">
                  {selectedTalentIds.length}
                </div>
              </div>
              <p className="create-project-sidebar-sub">
                Select best talent for this project.
              </p>
            </div>

            {/* Search */}
            <div className="create-project-sidebar-search">
              <div className="create-project-search-input-wrapper">
                <FiSearch
                  size={13}
                  className="create-project-sidebar-search-icon"
                />
                <input
                  type="text"
                  className="auth-input create-project-sidebar-search-input"
                  placeholder="Search professionals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Talent list */}
            <div className="create-project-sidebar-list">
              {filteredTalent.length > 0 ? (
                filteredTalent.map((talent) => {
                  const isSelected = selectedTalentIds.includes(talent.id);
                  return (
                    <div
                      key={talent.id}
                      onClick={() => !isTeamConfirmed && toggleTalent(talent.id)}
                      className={`create-project-talent-item ${isSelected ? "selected" : ""} ${isTeamConfirmed ? "confirmed" : ""} ${isTeamConfirmed && !isSelected ? "disabled" : ""}`}
                    >
                      {/* Avatar */}
                      <div className="create-project-talent-avatar-wrapper">
                        <img
                          src={talent.avatar}
                          alt={talent.name}
                          className="create-project-talent-avatar"
                        />
                        {isSelected && (
                          <div className="create-project-talent-check">
                            <FiCheck size={9} color="#fff" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="create-project-talent-info">
                        <div className="create-project-talent-name">
                          {talent.name}
                        </div>
                        <div className="create-project-talent-role">
                          {talent.role}
                        </div>
                      </div>

                      {/* Matching Tag */}
                      {formData.roles.some(r => talent.role.includes(r)) && (
                        <div className="create-project-talent-match-tag">
                          MATCH
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="create-project-empty-state">
                  <FiUser size={32} className="create-project-empty-icon" />
                  <p>No professionals found</p>
                </div>
              )}
            </div>

            {/* Selected Team Summary - MOVED TO BOTTOM OF SIDEBAR */}
            <div className="create-project-sidebar-summary">
              <div className="create-project-summary-header">
                <h4 className="create-project-summary-title">
                  Assembled Team
                </h4>
                {selectedTalentIds.length > 0 && isTeamConfirmed && (
                  <span className="create-project-summary-confirmed-badge">
                    CONFIRMED
                  </span>
                )}
              </div>

              {selectedTalentIds.length > 0 ? (
                <div className="create-project-summary-list">
                  {INTERVIEWED_TALENT.filter(t => selectedTalentIds.includes(t.id)).map((member) => (
                    <div
                      key={member.id}
                      className="create-project-summary-item"
                    >
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="create-project-summary-avatar"
                      />
                      <div className="create-project-talent-info">
                        <div className="create-project-summary-name">
                          {member.name}
                        </div>
                        <div className="create-project-summary-role">{member.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="create-project-summary-empty">
                  <p className="create-project-summary-empty-text">
                    No selected team
                  </p>
                  <p className="create-project-summary-empty-subtext">
                    Select talent from the list above to assemble your project team.
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Actions */}
            <div className="create-project-sidebar-actions">
              <button
                type="button"
                className={`${isTeamConfirmed ? "btn-review" : "btn-upload"} create-project-sidebar-btn`}
                disabled={selectedTalentIds.length === 0}
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
            <div className="create-project-sidebar-note-footer">
              <FiInfo className="create-project-sidebar-note-icon" />
              <span>
                Only showing members who have cleared all technical interview stages.
              </span>
            </div>
          </div>
        </div>
      </div>




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
