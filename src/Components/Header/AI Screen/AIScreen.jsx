import React, { useState, useRef, useEffect, useMemo, useCallback, useReducer } from "react";
import { FiSend, FiX, FiPaperclip, FiSearch, FiClock, FiSave, FiEdit, FiHome } from "react-icons/fi";
import { useTalentPoolMutation } from "../../../State-Management/Api/TalentPoolApiSlice";
import "./AIScreen.css";

/** -----------------------------
 * Data
 * ---------------------------- */
const FULL_IT_ROLES_SKILLS = {
  "Software Developer": [
    "Programming (Java,C#,Python)",
    "Data Structures & Algorithms",
    "Object-Oriented Design",
    "Git Version Control",
    "Unit Testing",
    "REST APIs",
    "Relational Databases (SQL)",
  ],
  "Frontend Developer": ["HTML", "CSS", "JavaScript", "React/Angular/Vue", "Responsive Design", "Browser DevTools", "REST APIs"],
  "Backend Developer": [
    "Java/.NET/Node.js/Python",
    "RESTful API Design",
    "SQL/NoSQL Databases",
    "Authentication & Authorization",
    "Microservices",
    "Docker",
    "Unit/Integration Testing",
  ],
  "Full Stack Developer": [
    "React/Angular/Vue",
    "Node.js/Java/.NET",
    "HTML/CSS/JavaScript",
    "SQL/NoSQL Databases",
    "REST APIs",
    "Git & CI/CD",
    "Cloud Basics (AWS/Azure/GCP)",
  ],
  "Data Scientist": [
    "Python/R",
    "Pandas/NumPy",
    "Statistics & Probability",
    "Machine Learning",
    "SQL",
    "Data Visualization (Tableau/Power BI)",
    "Jupyter Notebook",
  ],
  "Data Analyst": [
    "SQL",
    "Excel/Spreadsheets",
    "Data Cleaning",
    "Dashboards (Tableau/Power BI)",
    "Basic Statistics",
    "Reporting",
    "Stakeholder Communication",
  ],
  "DevOps Engineer": ["Linux", "Shell Scripting", "CI/CD (Jenkins/GitHub Actions)", "Docker", "Kubernetes", "Terraform (IaC)", "Cloud (AWS/Azure/GCP)"],
  "Cloud Engineer": ["AWS/Azure/GCP", "Virtual Networks", "Storage & Databases in Cloud", "IAM & Security", "Monitoring & Logging", "Scripting (Python/Bash)", "Containers"],
  "Cybersecurity Engineer": ["Network Security", "Firewalls/IDS/IPS", "Vulnerability Assessment", "Penetration Testing", "SIEM Tools", "Secure Coding", "Incident Response"],
  "IT Support Engineer": ["Hardware Troubleshooting", "Windows/macOS/Linux Basics", "Ticketing Tools", "Active Directory", "Basic Networking", "Customer Communication", "Documentation"],
  "Systems Administrator": ["Windows/Linux Servers", "User Access Management", "Backups & Recovery", "Networking Basics", "Virtualization", "Monitoring Tools", "Shell/PowerShell Scripting"],
  "Network Engineer": ["Routing & Switching", "TCP/IP", "Firewalls", "VPN", "Network Monitoring", "Cisco/Juniper Devices", "Network Security"],
  "Product Manager": ["Product Strategy", "Roadmapping", "User Research", "Requirements Gathering", "Agile/Scrum", "Stakeholder Management", "Data-Driven Decision Making"],
  "Business Analyst": ["Requirements Analysis", "Process Modelling", "SQL Data Querying", "Documentation (BRD/FRD)", "Stakeholder Workshops", "UML/BPMN", "Reporting & Dashboards"],
  "QA Engineer": ["Test Case Design", "Manual Testing", "Test Automation (Selenium/Cypress)", "API Testing (Postman)", "Regression Testing", "Defect Tracking Tools", "Basic SQL"],
};

const ALL_IT_ROLES = Object.keys(FULL_IT_ROLES_SKILLS);

const SUGGESTED_PROMPTS = [
  {
    id: "optimize-bench",
    name: "Optimize my bench",
    role: "Identify low-performing resumes",
    data: { action: "optimize" },
  },
  {
    id: "low-activity",
    name: "Low activity resumes",
    role: "See who is not getting responses",
    data: { action: "low_activity" },
  },
  {
    id: "match-req",
    name: "Match Requirement",
    role: "Find best matches for a job",
    data: { action: "match" },
  },
  {
    id: "market-demand",
    name: "Market Insights",
    role: "What skills are in demand?",
    data: { action: "insights" },
  },
];

/** -----------------------------
 * Reducer
 * ---------------------------- */
const formReducer = (state, action) => {
  switch (action.type) {
    case "SETROLE":
      return { ...state, role: action.payload, skills: [] };
    case "TOGGLESKILL": {
      const exists = state.skills.includes(action.payload);
      return { ...state, skills: exists ? state.skills.filter((s) => s !== action.payload) : [...state.skills, action.payload] };
    }
    case "REMOVESKILL":
      return { ...state, skills: state.skills.filter((s) => s !== action.payload) };
    case "SETFIELD":
      return { ...state, [action.field]: action.payload };
    case "RESET":
      return action.payload;
    default:
      return state;
  }
};

/** -----------------------------
 * Theme + styles (inline only)
 * ---------------------------- */
const UI = {
  bg: "#0f172a",
  panelA: "rgba(30, 41, 59, 0.7)",
  panelB: "rgba(30, 41, 59, 0.4)",
  border: "rgba(51, 65, 85, 0.6)",
  border2: "rgba(71, 85, 105, 0.8)",
  text: "#f8fafc",
  muted: "#94a3b8",
  muted2: "#64748b",
  primary: "#3b82f6",
  primary2: "#60a5fa",
  danger: "#ef4444",
  shadow: "0 4px 15px rgba(0,0,0,0.25)",
  shadow2: "0 10px 30px rgba(0,0,0,0.35)",
  radiusLg: 16,
  radiusMd: 12,
};

const S = {
  page: {
    minHeight: "92vh",
    padding: 22,
    background:
      "radial-gradient(800px 500px at 20% 0%, rgba(59, 130, 246, 0.08), transparent 60%), radial-gradient(700px 450px at 80% 10%, rgba(99, 102, 241, 0.06), transparent 55%), radial-gradient(900px 600px at 60% 120%, rgba(14, 165, 233, 0.05), transparent 55%), " +
      UI.bg,
    color: UI.text,
  },
  container: { maxWidth: 1180, margin: "0 auto" },

  header: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 16 },
  title: { margin: 0, fontSize: 22, fontWeight: 900, letterSpacing: 0.2, color: UI.text },

  panel: {
    background: `linear-gradient(180deg, ${UI.panelA}, ${UI.panelB})`,
    border: `1px solid ${UI.border}`,
    borderRadius: UI.radiusLg,
    boxShadow: UI.shadow,
    padding: 18,
    backdropFilter: "blur(10px)",
  },

  row: { display: "flex", alignItems: "center" },
  rowGap8: { display: "flex", alignItems: "center", gap: 8 },
  rowGap12: { display: "flex", alignItems: "center", gap: 12 },
  rowBetween: { display: "flex", alignItems: "center", justifyContent: "space-between" },

  btnBase: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 40,
    padding: "0 14px",
    borderRadius: 999,
    border: "1px solid transparent",
    cursor: "pointer",
    userSelect: "none",
    transition: "transform 140ms ease, box-shadow 140ms ease, background 140ms ease, border-color 140ms ease, opacity 140ms ease",
    fontSize: 13,
    fontWeight: 900,
    letterSpacing: 0.2,
    color: UI.text,
    background: "transparent",
  },
  btnPrimary: { background: `linear-gradient(135deg, ${UI.primary}, ${UI.primary2})`, boxShadow: "0 10px 28px rgba(59, 130, 246, 0.25)" },
  btnSecondary: { background: "rgba(255,255,255,0.06)", border: `1px solid ${UI.border}` },
  btnDisabled: { opacity: 0.55, cursor: "not-allowed" },

  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    border: `1px solid ${UI.border}`,
    background: "rgba(255,255,255,0.06)",
    color: UI.text,
    cursor: "pointer",
    transition: "background 140ms ease, transform 140ms ease, border-color 140ms ease",
    display: "grid",
    placeItems: "center",
  },

  inputWrap: { display: "flex", alignItems: "flex-end", gap: 10, padding: 12, borderRadius: UI.radiusLg, border: `1px solid ${UI.border}`, background: "rgba(255,255,255,0.05)" },
  textarea: { flex: 1, minHeight: 40, resize: "none", border: "none", outline: "none", background: "transparent", color: UI.text, fontSize: 14, lineHeight: 1.35, padding: "8px 8px" },

  dropdown: {
    position: "absolute",
    top: "calc(100% + 10px)",
    left: 0,
    right: 0,
    zIndex: 30,
    background: "rgba(10, 14, 28, 0.92)",
    border: `1px solid ${UI.border}`,
    borderRadius: UI.radiusLg,
    boxShadow: UI.shadow2,
    overflow: "hidden",
    backdropFilter: "blur(10px)",
  },
  dropdownHeader: { padding: "12px 14px", borderBottom: `1px solid ${UI.border}` },
  dropdownTitle: { display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 900, fontSize: 13, color: UI.text },
  listRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "12px 14px", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.06)" },

  chip: { display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 999, border: `1px solid ${UI.border}`, background: "rgba(255,255,255,0.05)", color: UI.text, fontSize: 12 },

  messageRow: { display: "flex", gap: 12 },
  avatar: { width: 36, height: 36, borderRadius: 12, display: "grid", placeItems: "center", fontWeight: 950, border: `1px solid ${UI.border}`, background: "rgba(255,255,255,0.06)", flexShrink: 0 },
  bubble: { background: "rgba(255,255,255,0.05)", border: `1px solid ${UI.border}`, borderRadius: 16, padding: "12px 14px", color: UI.text, fontSize: 13, lineHeight: 1.55 },

  grid4: { display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12 },
  grid2: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 },

  card: {
    borderRadius: 16,
    border: `1px solid ${UI.border}`,
    background: "rgba(255,255,255,0.05)",
    padding: 12,
    cursor: "pointer",
    transition: "transform 140ms ease, border-color 140ms ease, background 140ms ease, box-shadow 140ms ease",
    textAlign: "left",
  },

  // overlay already has padding so modal doesn't stick to edges
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", display: "grid", placeItems: "center", padding: 18, zIndex: 60 },

  // UPDATED: responsive modal box
  modal: {
    width: "96vw",
    maxWidth: 880,
    maxHeight: "75vh",
    borderRadius: 18,
    border: `1px solid ${UI.border}`,
    background: "rgba(10, 14, 28, 0.92)",
    boxShadow: UI.shadow2,
    backdropFilter: "blur(12px)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },

  modalHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: `1px solid ${UI.border}` },
  modalTitle: { margin: 0, fontSize: 14, fontWeight: 950, color: UI.text },

  // UPDATED: allow scroll inside body
  modalBody: { padding: 16, overflowY: "auto" },

  // base grid (2 columns on desktop) – mobile handled by class + media query
  formGrid: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 },

  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 12, fontWeight: 950, color: UI.muted },
  control: { borderRadius: 14, border: `1px solid ${UI.border}`, background: "rgba(255,255,255,0.05)", color: UI.text, padding: "10px 12px", outline: "none", fontSize: 13 },

  multiselectTrigger: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, borderRadius: 14, border: `1px solid ${UI.border}`, background: "rgba(255,255,255,0.05)", padding: "10px 12px", cursor: "pointer" },
  dropdownPanel: { position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, zIndex: 40, borderRadius: 14, border: `1px solid ${UI.border}`, background: "rgba(10, 14, 28, 0.96)", boxShadow: UI.shadow, maxHeight: 220, overflow: "auto" },
  optionRow: { display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.06)" },

  pillRow: { display: "flex", flexWrap: "wrap", gap: 10, marginTop: 10 },
  pill: { display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 999, border: "1px solid rgba(59, 130, 246, 0.35)", background: "rgba(59, 130, 246, 0.12)", padding: "8px 10px", fontSize: 12 },
  pillX: { border: "none", background: "transparent", color: UI.text, cursor: "pointer", opacity: 0.8 },

  benchCard: { borderRadius: 16, border: `1px solid ${UI.border}`, background: "rgba(255,255,255,0.05)", padding: 14, transition: "transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease, background 160ms ease" },
};

/** -----------------------------
 * Button
 * ---------------------------- */
const Button = React.memo(function Button({ onClick, disabled, children, variant = "primary", style = {}, type = "button" }) {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);

  const variantStyle = variant === "primary" ? S.btnPrimary : S.btnSecondary;

  const hoverStyle =
    !disabled && hover
      ? variant === "primary"
        ? { transform: "translateY(-1px)", boxShadow: "0 14px 36px rgba(59, 130, 246, 0.32)" }
        : { transform: "translateY(-1px)", background: "rgba(255,255,255,0.085)", borderColor: UI.border2 }
      : null;

  const activeStyle = !disabled && active ? { transform: "translateY(1px)" } : null;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setActive(false);
      }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        ...S.btnBase,
        ...variantStyle,
        ...(disabled ? S.btnDisabled : null),
        ...(hoverStyle || null),
        ...(activeStyle || null),
        ...style,
      }}
    >
      {children}
    </button>
  );
});

/** -----------------------------
 * Modal (inline, responsive)
 * ---------------------------- */
const Modal = React.memo(function Modal({ title, children, isOpen, onClose }) {
  const [closeHover, setCloseHover] = useState(false);
  if (!isOpen) return null;

  return (
    <div style={S.modalOverlay} role="presentation" onMouseDown={onClose}>
      <div style={S.modal} role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}>
        <div style={S.modalHeader}>
          <h3 style={S.modalTitle}>{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            onMouseEnter={() => setCloseHover(true)}
            onMouseLeave={() => setCloseHover(false)}
            style={{
              ...S.iconBtn,
              borderRadius: 14,
              background: closeHover ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.06)",
              borderColor: closeHover ? UI.border2 : UI.border,
            }}
          >
            <FiX size={20} />
          </button>
        </div>
        <div style={S.modalBody}>{children}</div>
      </div>
    </div>
  );
});

/** -----------------------------
 * SearchBar
 * ---------------------------- */
function SearchBar({
  inputValue,
  setInputValue,
  attachedFiles,
  isLoading,
  tokenCount,
  showDropdown,
  setShowDropdown,
  searchLoading,
  filteredSearches,
  handleKeyDown,
  handleSubmit,
  handleSearchSelect,
  deleteRecentSearch,
  clearAllRecentSearches,
  fileInputRef,
  searchContainerRef,
}) {
  const [toggleHover, setToggleHover] = useState(false);
  const [attachHover, setAttachHover] = useState(false);
  const [sendHover, setSendHover] = useState(false);

  const iconStyle = (hover) => ({
    ...S.iconBtn,
    background: hover ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.06)",
    borderColor: hover ? UI.border2 : UI.border,
    transform: hover ? "translateY(-1px)" : "translateY(0px)",
  });

  return (
    <div ref={searchContainerRef} style={{ position: "relative" }}>
      <div style={S.inputWrap}>
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowDropdown(true)}
          placeholder="Ask anything..."
          rows={1}
          style={S.textarea}
        />

        <button
          type="button"
          onClick={() => setShowDropdown((prev) => !prev)}
          onMouseEnter={() => setToggleHover(true)}
          onMouseLeave={() => setToggleHover(false)}
          style={iconStyle(toggleHover)}
        >
          <FiClock size={14} />
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          onMouseEnter={() => setAttachHover(true)}
          onMouseLeave={() => setAttachHover(false)}
          style={iconStyle(attachHover)}
        >
          <FiPaperclip size={18} />
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!inputValue.trim() && attachedFiles.length === 0 && isLoading && tokenCount === 0}
          onMouseEnter={() => setSendHover(true)}
          onMouseLeave={() => setSendHover(false)}
          style={iconStyle(sendHover)}
        >
          <FiSend size={16} />
        </button>
      </div>

      {showDropdown && (
        <div style={S.dropdown}>
          <div style={{ ...S.dropdownHeader, ...S.rowBetween }}>
            <div style={S.dropdownTitle}>
              <FiClock size={14} />
              <span>Recent Searches</span>
            </div>

            {!searchLoading && filteredSearches.length > 0 && (
              <button
                onClick={clearAllRecentSearches}
                style={{
                  height: 30,
                  padding: "0 10px",
                  borderRadius: 999,
                  border: `1px solid ${UI.border}`,
                  background: "transparent",
                  color: UI.muted,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 900,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = UI.border2;
                  e.currentTarget.style.color = UI.text;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = UI.border;
                  e.currentTarget.style.color = UI.muted;
                }}
              >
                Clear All
              </button>
            )}
          </div>

          {searchLoading ? (
            <div style={{ padding: "12px 16px", fontSize: 13, color: UI.muted }}>Loading options...</div>
          ) : filteredSearches.length === 0 ? (
            <div style={{ padding: "12px 16px", fontSize: 13, color: UI.muted }}>No recent searches found</div>
          ) : (
            filteredSearches.map((search, index) => (
              <div
                key={`${search.text}-${index}`}
                onClick={() => handleSearchSelect(search)}
                style={S.listRow}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ display: "inline-flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                  <FiSearch size={16} style={{ color: UI.muted, flexShrink: 0 }} />
                  <span style={{ color: UI.text, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{search.text}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteRecentSearch(search);
                  }}
                  style={{ border: "none", background: "transparent", color: UI.muted, cursor: "pointer" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = UI.danger)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = UI.muted)}
                >
                  <FiX size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

/** -----------------------------
 * TalentForm (with responsive grid class)
 * ---------------------------- */
const TalentForm = React.memo(function TalentForm({
  talentForm,
  talentRoleInputDisplay,
  setTalentRoleInputDisplay,
  dispatch,
  filteredRoleSuggestions,
  roleSuggestionsOpen,
  setRoleSuggestionsOpen,
  skillsDropdownOpen,
  setSkillsDropdownOpen,
  computedSkillOptions,
  talentPrompt,
  isEditingTalentPrompt,
  setIsEditingTalentPrompt,
  setTalentPrompt,
  setTalentPromptDirty,
  skillsDropdownRef,
  onSavePrompt,
  onSubmit,
}) {
  const [editHover, setEditHover] = useState(false);

  const handleRoleChange = (e) => {
    const value = e.target.value;
    setTalentRoleInputDisplay(value);
    setRoleSuggestionsOpen(value.trim().length > 0);
    setTalentPromptDirty(false);
  };

  const handleRoleBlur = () => {
    const trimmedInput = talentRoleInputDisplay.trim();
    const isValidRole = ALL_IT_ROLES.some((r) => r.toLowerCase().includes(trimmedInput.toLowerCase()));
    if (!isValidRole && trimmedInput.length > 0) {
      setTalentRoleInputDisplay(talentForm.role);
    } else if (isValidRole) {
      dispatch({ type: "SETROLE", payload: talentRoleInputDisplay });
      setRoleSuggestionsOpen(false);
    }
  };

  const handleRoleSelect = (role) => (e) => {
    e.preventDefault();
    setTalentRoleInputDisplay(role);
    dispatch({ type: "SETROLE", payload: role });
    setRoleSuggestionsOpen(false);
    setTalentPromptDirty(false);
  };

  return (
    <form onSubmit={onSubmit}>
      <div style={{ display: "flex", gap: 16, marginBottom: 24, alignItems: "flex-start" }}>
        <div className="ai-avatar-pulse" style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--accent)", color: "#fff", display: "grid", placeItems: "center", fontWeight: "900", flexShrink: 0, fontSize: 13, boxShadow: "0 0 15px rgba(99, 102, 241, 0.3)" }}>AI</div>
        <div style={{ background: "rgba(99, 102, 241, 0.08)", border: "1px solid rgba(99, 102, 241, 0.2)", borderRadius: "0 18px 18px 18px", padding: "16px 20px", color: "var(--text-primary)", fontSize: 15, lineHeight: 1.6 }}>
          <strong>Let's find the absolute best talent out there!</strong><br/>
          I need a few details to get started. Can you fill out what role and skills you are looking to hire for?
        </div>
      </div>

      {/* className enables media-query single-column on small screens */}
      <div style={S.formGrid} className="modal-form-grid">
        <div style={S.field}>
          <span style={S.label}>Role</span>
          <div style={{ position: "relative" }}>
            <input
              autoFocus
              type="text"
              placeholder="E.g., Frontend Developer"
              value={talentRoleInputDisplay}
              onChange={handleRoleChange}
              onBlur={handleRoleBlur}
              style={S.control}
            />

            {roleSuggestionsOpen && filteredRoleSuggestions.length > 0 && (
              <div style={S.dropdownPanel}>
                {filteredRoleSuggestions.map((role) => (
                  <div
                    key={role}
                    style={S.optionRow}
                    onMouseDown={handleRoleSelect(role)}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    {role}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={S.field} ref={skillsDropdownRef}>
          <span style={S.label}>Skills</span>

          <div style={{ position: "relative" }}>
            <div
              style={S.multiselectTrigger}
              onClick={() => setSkillsDropdownOpen((prev) => !prev)}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = UI.border2;
                e.currentTarget.style.background = "rgba(255,255,255,0.07)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = UI.border;
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              }}
            >
              <span style={{ color: talentForm.skills.length === 0 ? UI.muted2 : UI.text }}>
                {talentForm.skills.length === 0 ? "Select skills" : `${talentForm.skills.length} selected`}
              </span>
              <span style={{ color: UI.muted }}>{skillsDropdownOpen ? "▲" : "▼"}</span>
            </div>

            {skillsDropdownOpen && (
              <div style={S.dropdownPanel}>
                {computedSkillOptions.length === 0 ? (
                  <div style={{ padding: "10px 12px", fontSize: 12, color: UI.muted }}>Select a valid role to see skills</div>
                ) : (
                  computedSkillOptions.map((skill) => {
                    const checked = talentForm.skills.includes(skill);
                    return (
                      <div
                        key={skill}
                        style={S.optionRow}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        onClick={() => {
                          dispatch({ type: "TOGGLESKILL", payload: skill });
                          setTalentPromptDirty(false);
                        }}
                      >
                        <span
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: 6,
                            border: `1px solid ${UI.border2}`,
                            display: "grid",
                            placeItems: "center",
                            background: checked ? `linear-gradient(135deg, ${UI.primary}, ${UI.primary2})` : "transparent",
                            color: UI.text,
                            fontSize: 12,
                            fontWeight: 950,
                          }}
                        >
                          {checked ? "✓" : ""}
                        </span>
                        <span>{skill}</span>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {talentForm.skills.length > 0 && (
            <div style={S.pillRow}>
              {talentForm.skills.map((skill) => (
                <span key={skill} style={S.pill}>
                  {skill}
                  <button
                    type="button"
                    style={S.pillX}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.8)}
                    onClick={() => {
                      dispatch({ type: "REMOVESKILL", payload: skill });
                      setTalentPromptDirty(false);
                    }}
                  >
                    <FiX />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div style={S.field}>
          <span style={S.label}>Qualification</span>
          <input
            type="text"
            placeholder="E.g., B.Tech, MCA"
            value={talentForm.qualifications}
            onChange={(e) => {
              dispatch({ type: "SETFIELD", field: "qualifications", payload: e.target.value });
              setTalentPromptDirty(false);
            }}
            style={S.control}
          />
        </div>

        <div style={S.field}>
          <span style={S.label}>Experience</span>
          <select
            value={talentForm.experience}
            onChange={(e) => {
              dispatch({ type: "SETFIELD", field: "experience", payload: e.target.value });
              setTalentPromptDirty(false);
            }}
            style={{ ...S.control, appearance: "none", WebkitAppearance: "none" }}
          >
            <option value="">Select experience</option>
            <option value="0-2 years">0-2 years</option>
            <option value="2-4 years">2-4 years</option>
            <option value="3-5 years">3-5 years</option>
            <option value="5+ years">5+ years</option>
            <option value="10+ years">10+ years</option>
          </select>
        </div>

        <div style={S.field}>
          <span style={S.label}>Salary Range</span>
          <select
            value={talentForm.salary}
            onChange={(e) => {
              dispatch({ type: "SETFIELD", field: "salary", payload: e.target.value });
              setTalentPromptDirty(false);
            }}
            style={{ ...S.control, appearance: "none", WebkitAppearance: "none" }}
          >
            <option value="">Select range</option>
            <option value="6 LPA">6 LPA</option>
            <option value="8 LPA">8 LPA</option>
            <option value="10 LPA">10 LPA</option>
            <option value="12 LPA">12 LPA</option>
            <option value="15 LPA">15 LPA</option>
            <option value="80k">$80k</option>
            <option value="100k">$100k</option>
          </select>
        </div>

        <div style={S.field}>
          <span style={S.label}>Work Type</span>
          <select
            value={talentForm.workType}
            onChange={(e) => {
              dispatch({ type: "SETFIELD", field: "workType", payload: e.target.value });
              setTalentPromptDirty(false);
            }}
            style={{ ...S.control, appearance: "none", WebkitAppearance: "none" }}
          >
            <option value="">Select work type</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Onsite">Onsite</option>
          </select>
        </div>

        <div style={S.field}>
          <span style={S.label}>Location</span>
          <input
            type="text"
            placeholder="E.g., Bangalore, Hyderabad"
            value={talentForm.location}
            onChange={(e) => {
              dispatch({ type: "SETFIELD", field: "location", payload: e.target.value });
              setTalentPromptDirty(false);
            }}
            style={S.control}
          />
        </div>
      </div>

      <div style={{ ...S.rowBetween, margin: "16px 0 10px" }}>
        <h4 style={{ margin: 0, fontSize: 13, fontWeight: 950, color: UI.text }}>Generated Prompt</h4>
        <button
          type="button"
          onClick={() => setIsEditingTalentPrompt((prev) => !prev)}
          onMouseEnter={() => setEditHover(true)}
          onMouseLeave={() => setEditHover(false)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            borderRadius: 999,
            padding: "8px 10px",
            cursor: "pointer",
            background: editHover ? "rgba(255,255,255,0.085)" : "rgba(255,255,255,0.05)",
            border: `1px solid ${editHover ? UI.border2 : UI.border}`,
            color: UI.text,
            fontSize: 12,
            fontWeight: 900,
            transition: "all 140ms ease",
          }}
        >
          <FiEdit size={14} />
          {isEditingTalentPrompt ? "Done" : "Edit"}
        </button>
      </div>

      {isEditingTalentPrompt ? (
        <textarea
          value={talentPrompt}
          onChange={(e) => {
            setTalentPrompt(e.target.value);
            setTalentPromptDirty(true);
          }}
          style={{ ...S.control, minHeight: 200, width: "100%", marginBottom: 14, resize: "vertical", lineHeight: 1.55 }}
        />
      ) : (
        <div
          style={{
            padding: 14,
            borderRadius: 16,
            border: `1px solid ${UI.border}`,
            background: "rgba(255,255,255,0.05)",
            minHeight: 200,
            fontSize: 13,
            color: UI.text,
            lineHeight: 1.6,
            marginBottom: 14,
            wordBreak: "break-word",
          }}
        >
          {talentPrompt || "Prompt will be generated based on your selections..."}
        </div>
      )}

      <div style={S.rowGap12}>
        <Button onClick={() => onSavePrompt("talent")} disabled={!talentPrompt?.trim()} variant="secondary" style={{ flex: 1 }} type="button">
          <FiSave size={16} />
          <span>Save Prompt</span>
        </Button>

        <Button type="submit" disabled={!talentPrompt?.trim()} style={{ flex: 1 }}>
          <FiSearch size={16} />
          <span>Search Talents</span>
        </Button>
      </div>
    </form>
  );
});

/** -----------------------------
 * SuggestedBenchCard
 * ---------------------------- */
const SuggestedBenchCard = React.memo(function SuggestedBenchCard({ bench }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...S.benchCard,
        borderColor: hover ? "rgba(59, 130, 246, 0.40)" : UI.border,
        background: hover ? "rgba(30, 41, 59, 0.7)" : "rgba(30, 41, 59, 0.4)",
        transform: hover ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hover ? UI.shadow2 : "none",
      }}
    >
      <div style={{ fontWeight: 950, marginBottom: 4 }}>{bench.name}</div>
      <div style={{ color: UI.muted, fontSize: 12, marginBottom: 6 }}>
        {bench.role} • {bench.experience}
      </div>
      <div style={{ color: UI.text, fontSize: 12, marginBottom: 8 }}>{bench.skills.join(", ")}</div>
      <div style={{ color: UI.muted2, fontSize: 12 }}>{bench.location}</div>
    </div>
  );
});

/** -----------------------------
 * AIScreen
 * ---------------------------- */
function AIScreen() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenCount, setTokenCount] = useState(45);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [isTalentModalOpen, setIsTalentModalOpen] = useState(false);
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false); // reserved
  const [showSavedPrompts, setShowSavedPrompts] = useState(false);

  const [recentSearches, setRecentSearches] = useState([
    { text: "Optimize my bench", type: "job" },
    { text: "Which resumes are not getting responses?", type: "project" },
    { text: "Find best matches for this requirement: React developer 3 years", type: "job" },
    { text: "What skills are in demand?", type: "job" },
  ]);
  const [filteredSearches, setFilteredSearches] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const initialTalentForm = { role: "", skills: [], qualifications: "", experience: "", location: "", salary: "", workType: "" };
  const initialProjectForm = { projectType: "", skills: [], duration: "", budget: "", workType: "", location: "" };

  const [talentForm, talentDispatch] = useReducer(formReducer, initialTalentForm);
  const [projectsForm, projectsDispatch] = useReducer(formReducer, initialProjectForm); // reserved

  // API INTEGRATION
  const [talentPool, { isLoading: isApiLoading }] = useTalentPoolMutation();

  const [talentPrompt, setTalentPrompt] = useState("");
  const [projectsPrompt, setProjectsPrompt] = useState(""); // reserved

  const [isEditingTalentPrompt, setIsEditingTalentPrompt] = useState(false);
  const [isEditingProjectsPrompt, setIsEditingProjectsPrompt] = useState(false); // reserved

  const [talentPromptDirty, setTalentPromptDirty] = useState(false);
  const [projectsPromptDirty, setProjectsPromptDirty] = useState(false); // reserved

  const [talentRoleInputDisplay, setTalentRoleInputDisplay] = useState("");

  const [savedPrompts, setSavedPrompts] = useState([
    {
      id: 1,
      type: "talent",
      name: "Senior Frontend Dev",
      prompt: "Find Frontend Developer with skills in React/Angular/Vue, 5+ years experience, Remote work type, salary expectation 15 LPA.",
      createdAt: new Date(Date.now() - 86400000),
    },
  ]);

  const [editPromptModalOpen, setEditPromptModalOpen] = useState(false);
  const [editingSavedPromptId, setEditingSavedPromptId] = useState(null);
  const [editingSavedPromptName, setEditingSavedPromptName] = useState("");
  const [editingSavedPromptText, setEditingSavedPromptText] = useState("");

  const [skillsDropdownOpen, setSkillsDropdownOpen] = useState(false);
  const [roleSuggestionsOpen, setRoleSuggestionsOpen] = useState(false);

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const searchContainerRef = useRef(null);
  const skillsDropdownRef = useRef(null);

  const computedSkillOptions = useMemo(() => {
    const roleText = talentForm.role.trim().toLowerCase();
    if (!roleText) return [];
    const exactKey = Object.keys(FULL_IT_ROLES_SKILLS).find((r) => r.toLowerCase() === roleText);
    return exactKey ? FULL_IT_ROLES_SKILLS[exactKey] : [];
  }, [talentForm.role]);

  const filteredRoleSuggestions = useMemo(() => {
    const text = talentRoleInputDisplay.trim().toLowerCase();
    if (!text) return ALL_IT_ROLES;
    return ALL_IT_ROLES.filter((r) => r.toLowerCase().includes(text));
  }, [talentRoleInputDisplay]);

  const [suggestedBench, setSuggestedBench] = useState([
    { name: "Alice Johnson", role: "UI/UX Designer", experience: "5 years", skills: ["Figma", "Sketch", "Adobe XD"], location: "Bangalore", score: 92, marketScore: 88, aiInsight: "Perfect match for product design lead roles." },
    { name: "Rahul Mehta", role: "Frontend Developer", experience: "4 years", skills: ["React", "TypeScript", "Tailwind CSS"], location: "Hyderabad", score: 85, marketScore: 82, aiInsight: "Strong technical foundations, but lacking depth in cloud deployments." },
    { name: "Priya Sharma", role: "Backend Developer", experience: "6 years", skills: ["Node.js", "MongoDB", "AWS"], location: "Bangalore", score: 78, marketScore: 75, aiInsight: "Extensive API experience, though recent frequency is low." },
    { name: "Aditya Patel", role: "DevOps Engineer", experience: "3 years", skills: ["Docker", "Kubernetes", "CI/CD"], location: "Remote", score: 94, marketScore: 90, aiInsight: "Exceptional containerization knowledge and automation skills." },
  ]);

  const generateTalentPrompt = useCallback((form) => {
    if (!form.role) return "";
    let prompt = `Find ${form.role}`;
    if (form.skills?.length) prompt += ` with skills in ${form.skills.join(", ")}`;
    if (form.qualifications) prompt += ` with qualifications in ${form.qualifications}`;
    if (form.experience) prompt += `, ${form.experience} experience`;
    if (form.workType) prompt += `, ${form.workType} work type`;
    if (form.location) prompt += `, based in ${form.location}`;
    if (form.salary) prompt += `, salary expectation ${form.salary}`;
    return prompt + ".";
  }, []);

  const handleSubmit = useCallback(
    (searchText = null) => {
      const textToSubmit = searchText || inputValue;
      if (!textToSubmit.trim() && attachedFiles.length === 0 && tokenCount === 0) return;

      if (textToSubmit.trim()) {
        const lower = textToSubmit.toLowerCase();
        const isJobSearch = /developer|engineer|talent|position|hiring/.test(lower);
        const newSearch = { text: textToSubmit.trim(), type: isJobSearch ? "job" : "project" };
        setRecentSearches((prev) => {
          const exists = prev.some((s) => s.text === newSearch.text);
          return exists ? prev : [newSearch, ...prev.slice(0, 9)];
        });
      }

      const userMessage = { id: `msg-${messages.length + 1}`, type: "user", content: textToSubmit, files: attachedFiles, timestamp: new Date() };
      setMessages((prev) => [...prev, userMessage]);

      setInputValue("");
      setAttachedFiles([]);
      setShowDropdown(false);
      setTokenCount((prev) => Math.max(0, prev - 1));
      setIsLoading(true);

      setTimeout(() => {
        let responseContent = "";
        const lowerQuery = textToSubmit.toLowerCase();
        
        if (lowerQuery.includes("optimize") || lowerQuery.includes("low-performing") || lowerQuery.includes("score") || lowerQuery.includes("improve")) {
          responseContent = "**Summary**\nI've analyzed and scored the selected resumes based on skill relevance, completeness, and market demand. 2 resumes scored below 60/100 and need immediate attention.\n\n**Key Insights**\n Rahul Mehta (Score: 55/100) - Missing modern React keywords (Hooks, Context); completeness is low.\n Priya Sharma (Score: 82/100) - Strong skills, but \"Cloud basics\" is too vague for current market demand.\n QA Profiles (Avg Score: 65/100) - Omitting specific automation tool experience lowers the completeness score.\n\n**Suggested Actions**\n Update Rahul's resume with specific React keywords to improve his relevance score.\n Quantify Priya's cloud experience (e.g., \"AWS EC2/S3\") to boost market demand score.\n Add details on Selenium/Cypress for the QA profiles.";
        } else if (lowerQuery.includes("match") || lowerQuery.includes("requirement") || lowerQuery.includes("find best")) {
          responseContent = "**Summary**\nI found 4 strong matches for this requirement. Top candidates have an average 85% match rate based on skills and experience.\n\n**Key Insights**\n Match rate is primarily driven by exact React and TypeScript experience.\n Location preferences align closely with the requirement.\n Aditya Patel (88% Match) - Best fit due to recent overlapping project experience.\n\n**Suggested Actions**\n Review the top matches below and share their profiles with the client.\n Consider highlighting Aditya's specific related project experience in your pitch.";
        } else if (lowerQuery.includes("in demand") || lowerQuery.includes("market") || lowerQuery.includes("skills")) {
          responseContent = "**Summary**\nCloud and AI skills are seeing a 35% MoM increase in search queries on the platform.\n\n**Key Insights**\n High Demand Profiles: DevOps (AWS/Azure), React, Python (AI/ML).\n Low Demand Profiles: Legacy Java (pre-Java 8), Manual QA.\n Fastest growing skill request: TypeScript and Kubernetes.\n\n**Suggested Actions**\n Encourage your bench to upskill in basic cloud deployments to increase marketability.\n Update older Java profiles to highlight microservices if applicable.\n Tag relevant candidates with \"TypeScript\" if they possess the skill but haven't listed it.";
        } else if (lowerQuery.includes("response") || lowerQuery.includes("activity") || lowerQuery.includes("ignored") || lowerQuery.includes("not getting") || lowerQuery.includes("not responded")) {
          responseContent = "**Summary**\nI identified 3 resumes that have had no views or responses in the last 14 days.\n\n**Key Insights**\n Missing key high-volume search skills: \"DevOps Basics\", \"Docker\".\n Project descriptions are too generic (e.g., \"Worked on software\").\n Formatting lacks clear skill highlights, making them easy to ignore in quick scans.\n\n**Suggested Actions**\n Improve the descriptions to use action verbs and impact metrics.\n Add any missing relevant certifications to bump their search ranking.\n Re-upload with a prioritized skills section at the top.";
        } else {
          responseContent = "**Summary**\nRequest processed successfully based on current platform data.\n\n**Key Insights**\n Resume visibility can always be optimized by aligning with current job post keywords.\n Regular profile updates signal active availability to the matching engine.\n\n**Suggested Actions**\n Please provide a specific requirement (e.g., \"Find match for React developer\") or ask about a particular resume to get detailed actionable steps.";
        }

        const aiMessage = { 
          id: `msg-${Date.now()}`, 
          type: "ai", 
          content: responseContent, 
          timestamp: new Date(),
          isMatch: lowerQuery.includes("match") || lowerQuery.includes("requirement") || lowerQuery.includes("find best")
        };
        setMessages((prev) => [...prev, aiMessage]);
        setIsLoading(false);
      }, 1200);

      // --- REAL API CALLS ---
      const lower = textToSubmit.toLowerCase();
      if (lower.includes("developer") || lower.includes("engineer") || lower.includes("talent") || lower.includes("hiring") || lower.includes("find")) {
        talentPool({ query: textToSubmit.trim() })
          .unwrap()
          .then((res) => {
            if (Array.isArray(res) && res.length > 0) {
              const mapped = res.slice(0, 4).map(b => ({
                name: b.name || b.fullName,
                role: b.jobTitle || b.currentRole || "Professional",
                experience: b.totalExperience || b.experience || "N/A",
                skills: (b.keySkills || b.skills || "").split(",").slice(0, 3).map(s => s.trim()),
                location: b.currentLocation || "India",
                score: b.matchScore || 85,
                marketScore: 80,
                aiInsight: `Verified experience at ${b.currentCompany || "leading tech firms"}.`
              }));
              setSuggestedBench(mapped);
            }
          })
          .catch(err => console.error("API error:", err));
      }
    },
    [inputValue, attachedFiles, tokenCount, messages.length, talentPool]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const handleFileAttach = useCallback((e) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).map((file) => ({ id: Math.random(), name: file.name, size: (file.size / 1024).toFixed(2) }));
      setAttachedFiles((prev) => [...prev, ...newFiles]);
    }
  }, []);

  const removeFile = useCallback((fileId) => setAttachedFiles((prev) => prev.filter((file) => file.id !== fileId)), []);

  const handleSavePrompt = useCallback(
    (type) => {
      const promptText = type === "talent" ? talentPrompt : projectsPrompt;
      if (!promptText?.trim()) return;

      const promptName = window.prompt("Enter a name for this prompt");
      if (!promptName) return;

      setSavedPrompts((prev) => [{ id: Date.now(), type, name: promptName, prompt: promptText, createdAt: new Date() }, ...prev]);

      if (type === "talent") setTalentPrompt("");
      if (type === "projects") setProjectsPrompt("");
    },
    [talentPrompt, projectsPrompt]
  );

  const handleLoadSavedPrompt = useCallback(
    (savedPrompt) => {
      handleSubmit(savedPrompt.prompt);
      setShowSavedPrompts(false);
    },
    [handleSubmit]
  );

  const handleDeleteSavedPrompt = useCallback((id) => setSavedPrompts((prev) => prev.filter((p) => p.id !== id)), []);

  const goHome = useCallback(() => {
    setMessages([]);
    setShowSavedPrompts(false);
  }, []);

  useEffect(() => {
    if (!talentPromptDirty) setTalentPrompt(generateTalentPrompt(talentForm));
  }, [talentForm, talentPromptDirty, generateTalentPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    let timeoutId;
    if (inputValue.trim()) {
      setSearchLoading(true);
      timeoutId = setTimeout(() => {
        const filtered = recentSearches.filter((search) => search.text.toLowerCase().includes(inputValue.toLowerCase()));
        setFilteredSearches(filtered);
        setSearchLoading(false);
      }, 200);
    } else {
      setSearchLoading(false);
      setFilteredSearches(recentSearches);
    }
    return () => timeoutId && clearTimeout(timeoutId);
  }, [inputValue, recentSearches]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) setShowDropdown(false);
      if (skillsDropdownRef.current && !skillsDropdownRef.current.contains(event.target)) setSkillsDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsTalentModalOpen(false);
        setIsProjectsModalOpen(false);
        setEditPromptModalOpen(false);
        setShowDropdown(false);
        setRoleSuggestionsOpen(false);
        setSkillsDropdownOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleTalentSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!talentPrompt.trim()) return;
      handleSubmit(talentPrompt);
      setIsTalentModalOpen(false);
    },
    [talentPrompt, handleSubmit]
  );

  const deleteRecentSearch = useCallback((searchToDelete) => setRecentSearches((prev) => prev.filter((search) => search.text !== searchToDelete.text)), []);
  const clearAllRecentSearches = useCallback(() => {
    setRecentSearches([]);
    setShowDropdown(false);
  }, []);
  const handleSearchSelect = useCallback((searchItem) => handleSubmit(searchItem.text), [handleSubmit]);

  const handleSuggestedPromptClick = useCallback((prompt) => {
    if (prompt.data && prompt.data.action) {
      handleSubmit(prompt.name);
    } else {
      talentDispatch({ type: "RESET", payload: prompt.data });
      setTalentRoleInputDisplay(prompt.data.role);
      setRoleSuggestionsOpen(false);
      setTalentPromptDirty(false);
      setIsTalentModalOpen(true);
    }
  }, [handleSubmit, talentDispatch]);

  const openEditPromptModal = useCallback((p) => {
    setEditingSavedPromptId(p.id);
    setEditingSavedPromptName(p.name);
    setEditingSavedPromptText(p.prompt);
    setEditPromptModalOpen(true);
  }, []);

  const closeEditPromptModal = useCallback(() => {
    setEditPromptModalOpen(false);
    setEditingSavedPromptId(null);
    setEditingSavedPromptName("");
    setEditingSavedPromptText("");
  }, []);

  const saveEditedSavedPrompt = useCallback(() => {
    if (!editingSavedPromptId) return;
    setSavedPrompts((prev) => prev.map((p) => (p.id === editingSavedPromptId ? { ...p, name: editingSavedPromptName, prompt: editingSavedPromptText } : p)));
    closeEditPromptModal();
  }, [editingSavedPromptId, editingSavedPromptName, editingSavedPromptText, closeEditPromptModal]);

  // Derived state to represent the current dashboard view easily
  const latestAiMessage = [...messages].reverse().find(m => m.type === "ai");
  const showResults = !!latestAiMessage;
  const [activeQuestionnaire, setActiveQuestionnaire] = useState(null);

  // Extremely simple parsing of our mock AI responses
  const parseAIContent = (content) => {
    if (!content) return { summary: "", insights: [], actions: [] };
    const parts = content.split(/\*\*(Summary|Key Insights|Suggested Actions)\*\*/g);
    
    let summary = "";
    let insights = [];
    let actions = [];

    for (let i = 0; i < parts.length; i++) {
        if (parts[i] === "Summary") summary = parts[i+1]?.trim() || "";
        if (parts[i] === "Key Insights") {
            insights = parts[i+1]?.trim().split('\n').map(l => l.replace(/^- /,"").trim()).filter(Boolean) || [];
        }
        if (parts[i] === "Suggested Actions") {
            actions = parts[i+1]?.trim().split('\n').map(l => l.replace(/^[-\d.] /,"").trim()).filter(Boolean) || [];
        }
    }
    
    if (!summary && content) summary = content;
    return { summary, insights, actions };
  };

  const aiParsed = latestAiMessage ? parseAIContent(latestAiMessage.content) : null;

  return (
    <div className="ai-dashboard">
      
      {/* 1. LEFT SIDEBAR */}
      <div className="ai-sidebar">
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
           <div style={{ width: 32, height: 32, background: "var(--accent)", borderRadius: 8, display: "grid", placeItems: "center", fontWeight: "bold", color: "#fff" }}>
             AI
           </div>
           <span style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)" }}>Workspace</span>
        </div>

        <div className="sidebar-title">Quick Actions</div>
        
        <button className="sidebar-btn" onClick={() => { setActiveQuestionnaire(null); }}>
          <FiSearch size={16} /> New
        </button>

        {SUGGESTED_PROMPTS.map((prompt) => (
          <button 
            key={prompt.id}
            className="sidebar-btn"
            onClick={() => { setActiveQuestionnaire(prompt.id); }}
          >
            <FiSearch size={16} />
            {prompt.name}
          </button>
        ))}

        <button className="sidebar-btn" style={{ marginTop: "auto" }}>
          <FiSave size={16} /> Saved Prompts
        </button>
        <button className="sidebar-btn" onClick={goHome}>
          <FiHome size={16} /> Home
        </button>
      </div>

      {/* 2. MAIN CONTENT AREA */}
      <div className="ai-main">
        <div className="main-header">
          <h1 className="main-title">
             {activeQuestionnaire ? SUGGESTED_PROMPTS.find(p=>p.id===activeQuestionnaire)?.name || "Questionnaire" : "AI Assistant Dashboard"}
          </h1>
          {activeQuestionnaire && (
            <p className="main-subtitle">Complete the parameters to generate a guided prompt.</p>
          )}
        </div>

        {/* INLINE QUESTIONNAIRE AREA */}
        {activeQuestionnaire ? (
          <div style={{ background: "var(--bg-card)", borderRadius: 16, border: "1px solid var(--border-color)", padding: 24 }}>
             
             {activeQuestionnaire === "match-req" ? (
               <TalentForm
                  talentForm={talentForm}
                  talentRoleInputDisplay={talentRoleInputDisplay}
                  setTalentRoleInputDisplay={setTalentRoleInputDisplay}
                  dispatch={talentDispatch}
                  filteredRoleSuggestions={filteredRoleSuggestions}
                  roleSuggestionsOpen={roleSuggestionsOpen}
                  setRoleSuggestionsOpen={setRoleSuggestionsOpen}
                  skillsDropdownOpen={skillsDropdownOpen}
                  setSkillsDropdownOpen={setSkillsDropdownOpen}
                  computedSkillOptions={computedSkillOptions}
                  talentPrompt={talentPrompt}
                  isEditingTalentPrompt={isEditingTalentPrompt}
                  setIsEditingTalentPrompt={setIsEditingTalentPrompt}
                  setTalentPrompt={setTalentPrompt}
                  setTalentPromptDirty={setTalentPromptDirty}
                  skillsDropdownRef={skillsDropdownRef}
                  onSavePrompt={handleSavePrompt}
                  onSubmit={(e) => {
                     setActiveQuestionnaire(null);
                     handleTalentSubmit(e);
                  }}
               />
             ) : (
                <form onSubmit={(e) => {
                    e.preventDefault();
                    setInputValue(`Execute analysis for: ${SUGGESTED_PROMPTS.find(p=>p.id===activeQuestionnaire)?.name}`);
                    setActiveQuestionnaire(null);
                    setTimeout(() => handleSubmit(), 100);
                }}>
                   <div style={{ display: "flex", gap: 16, marginBottom: 24, alignItems: "flex-start" }}>
                     <div className="ai-avatar-pulse" style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--accent)", color: "#fff", display: "grid", placeItems: "center", fontWeight: "900", flexShrink: 0, fontSize: 13, boxShadow: "0 0 15px rgba(99, 102, 241, 0.3)" }}>AI</div>
                     <div style={{ background: "rgba(99, 102, 241, 0.08)", border: "1px solid rgba(99, 102, 241, 0.2)", borderRadius: "0 18px 18px 18px", padding: "16px 20px", color: "var(--text-primary)", fontSize: 15, lineHeight: 1.6 }}>
                       <strong>I can help you {SUGGESTED_PROMPTS.find(p=>p.id===activeQuestionnaire)?.name.toLowerCase()}!</strong><br/>
                       To get the best results, what specific role or target audience should I focus my analysis around?
                     </div>
                   </div>

                   <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                     <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>Target Audience & Focus Areas</span>
                     <input autoFocus type="text" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", padding: "12px 16px", borderRadius: 12, color: "var(--text-primary)", outline: "none", fontSize: 14, boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)" }} placeholder="E.g., Senior iOS Developers with Swift experience..." />
                   </div>
                   
                   <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 25 }}>
                     <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>Any additional instructions for me? <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>(Optional)</span></span>
                     <input type="text" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", padding: "12px 16px", borderRadius: 12, color: "var(--text-primary)", outline: "none", fontSize: 14, boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)" }} placeholder="List any specific checks or constraints..." />
                   </div>

                   <div style={{ display: "flex", gap: 12 }}>
                      <button type="submit" style={{ flex: 1, background: "var(--accent)", color: "#fff", border: "none", height: 42, borderRadius: 12, fontWeight: 700, cursor: "pointer", transition: "0.2s" }} onMouseEnter={e => e.currentTarget.style.opacity = 0.9} onMouseLeave={e => e.currentTarget.style.opacity = 1}>
                        Execute Prompt Request
                      </button>
                      <button type="button" onClick={() => setActiveQuestionnaire(null)} style={{ padding: "0 24px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-color)", color: "var(--text-primary)", height: 42, borderRadius: 12, fontWeight: 700, cursor: "pointer", transition: "0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"} onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}>
                        Cancel
                      </button>
                   </div>
                </form>
             )}

          </div>
        ) : (
          <>
            {/* CARDS SELECTION OVERVIEW */}
            {!showResults && !isLoading && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", gap: 16, marginBottom: 24, alignItems: "flex-start" }}>
                  <div className="ai-avatar-pulse" style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--accent)", color: "#fff", display: "grid", placeItems: "center", fontWeight: "900", flexShrink: 0, fontSize: 13, boxShadow: "0 0 15px rgba(99, 102, 241, 0.3)" }}>AI</div>
                  <div style={{ background: "rgba(99, 102, 241, 0.08)", border: "1px solid rgba(99, 102, 241, 0.2)", borderRadius: "0 18px 18px 18px", padding: "16px 20px", color: "var(--text-primary)", fontSize: 15, lineHeight: 1.6 }}>
                    <strong>Hello! I'm your AI Workspace assistant.</strong><br/>
                    I can help you analyze resumes, match candidate profiles to project requirements, or find market insights. What would you like to do today?
                  </div>
                </div>

                <h3 style={{ fontSize: 16, color: "var(--text-primary)", fontWeight: 700, margin: "0 0 16px 0", paddingLeft: 60 }}>Guided Workflows</h3>
                <div className="results-grid">
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <div 
                      key={prompt.id} 
                      className="resume-card" 
                      onClick={() => setActiveQuestionnaire(prompt.id)}
                      style={{ padding: 16, background: "rgba(99, 102, 241, 0.05)", borderStyle: "dashed", borderColor: "rgba(99, 102, 241, 0.3)" }}
                    >
                      <h4 style={{ margin: "0 0 4px", fontSize: 15, color: "var(--accent)" }}>{prompt.name}</h4>
                      <p style={{ margin: 0, fontSize: 12, color: "var(--text-secondary)" }}>{prompt.role}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SMART INPUT BAR */}
            <div className="smart-input-container">
              <textarea
                className="smart-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder='Ask anything manually... e.g., "Find best resumes for React developer"'
                rows={1}
              />
              <button 
                onClick={handleSubmit} 
                disabled={!inputValue.trim() || isLoading}
                className="smart-submit"
                title="Ask AI"
              >
                {(isLoading || isApiLoading) ? <FiClock size={20} className="spinning" /> : <FiSend size={20} />}
              </button>
            </div>

            {(isLoading || isApiLoading) && (
              <div style={{ color: "var(--accent)", fontSize: 14, fontWeight: "bold", display: "flex", gap: 8, alignItems: "center", marginTop: 12 }}>
                <FiClock className="spinning" /> Analyzing Request...
              </div>
            )}

            {/* Dynamic RESULTS */}
            {showResults && (
                <>
                  {latestAiMessage.isMatch && suggestedBench.length > 0 && (
                    <div style={{ marginTop: 10 }}>
                      <h3 style={{ fontSize: 18, color: "var(--text-primary)", fontWeight: 800, margin: "0 0 16px 0" }}>Analysis Results ({suggestedBench.length})</h3>
                      <div className="results-grid">
                        {suggestedBench.map((bench, idx) => (
                          <div className="resume-card" key={idx}>
                            <div className="r-card-header">
                              <div>
                                <h4 className="r-card-name">{bench.name}</h4>
                                <div className="r-card-role">{bench.role}</div>
                              </div>
                              {bench.score >= 90 ? (
                                <div className="status-tag high">High Match</div>
                              ) : bench.score >= 70 ? (
                                <div className="status-tag medium">Needs Work</div>
                              ) : (
                                <div className="status-tag low">Low Vis</div>
                              )}
                            </div>

                            <div className="scores-row">
                              <div className="score-box">
                                <span className="score-label">Match</span>
                                <span className="score-value">{bench.score}%</span>
                              </div>
                              <div className="score-box">
                                <span className="score-label">Resume</span>
                                <span className="score-value">{bench.marketScore}/100</span>
                              </div>
                            </div>

                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                              {bench.skills.map(s => (
                                <div className="status-tag" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-color)", color: "var(--text-secondary)", fontSize: 10 }} key={s}>{s}</div>
                              ))}
                            </div>

                            <div className="r-card-expand">
                              <strong style={{ color: "var(--text-primary)" }}>AI Insight:</strong> {bench.aiInsight}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI RESPONSE BLOCK */}
                  <div className="ai-response-block">
                    <div className="ai-resp-summary">
                      {aiParsed.summary || "Complete process analysis and outcomes shown above."}
                    </div>
                    
                    {aiParsed.insights.length > 0 && (
                    <div className="ai-resp-insights">
                      <div className="ai-resp-title">Key Insights</div>
                      <ul className="ai-resp-list">
                        {aiParsed.insights.map((ins, i) => <li key={i}>{ins}</li>)}
                      </ul>
                    </div>
                    )}

                    {aiParsed.actions.length > 0 && (
                    <div className="ai-resp-actions">
                      <div className="ai-resp-title">Suggested Actions</div>
                      <ul className="ai-resp-list" style={{ listStyleType: "decimal" }}>
                        {aiParsed.actions.map((act, i) => <li key={i}>{act}</li>)}
                      </ul>
                    </div>
                    )}
                  </div>
                </>
            )}
          </>
        )}
      </div>

      {/* 3. RIGHT INSIGHTS PANEL */}
      <div className="ai-right-panel">
        <div className="panel-title">
          <FiClock size={16} color="var(--accent)" /> System Insights
        </div>

        <div className="insight-card">
           <div className="insight-header">
              <span className="insight-metric">14</span>
              <div className="status-tag low">Needs Attention</div>
           </div>
           <div className="insight-desc">
              <strong>Low Activity Resumes</strong><br/>
              Candidates with less than 2 profile views in 30 days.
           </div>
        </div>

        <div className="insight-card">
           <div className="insight-header">
              <span className="insight-metric">3</span>
              <div className="status-tag accent">Trending</div>
           </div>
           <div className="insight-desc">
              <strong>High Demand Skills</strong><br/>
              React, AWS, Node.js have seen a 45% spike in searches this week.
           </div>
        </div>

        <div className="insight-card">
           <div className="insight-header">
              <span className="insight-metric">8</span>
              <div className="status-tag medium">Review</div>
           </div>
           <div className="insight-desc">
              <strong>Weak Profiles</strong><br/>
              Resumes missing key summary blocks or project specifics.
           </div>
        </div>
      </div>

      {/* Keep invisible inputs & Modals */}
      <input ref={fileInputRef} type="file" multiple onChange={handleFileAttach} style={{ display: "none" }} aria-label="File upload" />

      <Modal title="Find Talent" isOpen={isTalentModalOpen} onClose={() => setIsTalentModalOpen(false)}>
        <TalentForm
          talentForm={talentForm}
          talentRoleInputDisplay={talentRoleInputDisplay}
          setTalentRoleInputDisplay={setTalentRoleInputDisplay}
          dispatch={talentDispatch}
          filteredRoleSuggestions={filteredRoleSuggestions}
          roleSuggestionsOpen={roleSuggestionsOpen}
          setRoleSuggestionsOpen={setRoleSuggestionsOpen}
          skillsDropdownOpen={skillsDropdownOpen}
          setSkillsDropdownOpen={setSkillsDropdownOpen}
          computedSkillOptions={computedSkillOptions}
          talentPrompt={talentPrompt}
          isEditingTalentPrompt={isEditingTalentPrompt}
          setIsEditingTalentPrompt={setIsEditingTalentPrompt}
          setTalentPrompt={setTalentPrompt}
          setTalentPromptDirty={setTalentPromptDirty}
          skillsDropdownRef={skillsDropdownRef}
          onSavePrompt={handleSavePrompt}
          onSubmit={handleTalentSubmit}
        />
      </Modal>

      <Modal title="Edit Saved Prompt" isOpen={editPromptModalOpen} onClose={closeEditPromptModal}>
        <div style={S.field}>
          <span style={S.label}>Name</span>
          <input type="text" value={editingSavedPromptName} onChange={(e) => setEditingSavedPromptName(e.target.value)} placeholder="Name" style={S.control} />
        </div>

        <div style={{ height: 10 }} />

        <div style={S.field}>
          <span style={S.label}>Prompt</span>
          <textarea
            value={editingSavedPromptText}
            onChange={(e) => setEditingSavedPromptText(e.target.value)}
            placeholder="Edit your saved prompt..."
            style={{ ...S.control, minHeight: 160, width: "100%", resize: "vertical", lineHeight: 1.55 }}
          />
        </div>

        <div style={{ height: 12 }} />

        <div style={S.rowGap12}>
          <Button onClick={saveEditedSavedPrompt} disabled={!editingSavedPromptText.trim()} type="button">
            Save
          </Button>
          <Button onClick={closeEditPromptModal} variant="secondary" type="button">
            Cancel
          </Button>
        </div>
      </Modal>

    </div>
  );
}

export default AIScreen;
