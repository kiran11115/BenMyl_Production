import React, { useMemo, useState } from "react";
import {
  Bell,
  CheckCheck,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Briefcase,
  MessageSquare,
  FolderKanban,
  User,
} from "lucide-react";

/* -----------------------------------------------
   Google Font – Inter (matches project style)
----------------------------------------------- */
if (!document.getElementById("notif-inter-font")) {
  const link = document.createElement("link");
  link.id = "notif-inter-font";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap";
  document.head.appendChild(link);
}

/* -----------------------------------------------
   Mock Data
----------------------------------------------- */
const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: "talent",
    sender: "Acme Corp",
    time: "1h ago",
    read: false,
    talents: [
      { name: "Logitech Ganesh", role: "UI/UX" },
      { name: "Daniel Nguyen", role: "Full Stack Developer" },
      { name: "Aarav Mehta", role: "Backend Developer" },
      { name: "Sophia Lee", role: "QA Engineer" },
    ],
  },
  {
    id: 2,
    type: "message",
    sender: "John (Client)",
    message: "Can we fine-tune the dashboard animation timing?",
    time: "3h ago",
    read: false,
  },
  {
    id: 3,
    type: "project",
    sender: "Project Phoenix",
    message: "Milestone 2 has been approved.",
    time: "Yesterday",
    read: true,
  },
];

/* -----------------------------------------------
   Project Color Tokens (from Dashboard.css / Projects.css / Jobs.css)
----------------------------------------------- */
const C = {
  // Text
  textPrimary: "#0f172a",
  textHeading: "#1e293b",
  textBody: "#334155",
  textMuted: "#475569",
  textSubtle: "#64748b",
  textFaint: "#94a3b8",

  // Surfaces
  white: "#ffffff",
  bgPage: "#f8fafc",
  bgHover: "#f8fafc",
  bgSubtle: "#f1f5f9",

  // Borders
  border: "#e2e8f0",
  borderLight: "#f1f5f9",

  // Brand Orange (project primary)
  orange: "#f5810c",
  orangeHover: "#ea580c",
  orangeBg: "#fff7ed",

  // Accent – Cyan (talent)
  cyan: "#0ea5e9",
  cyanBg: "#f0f9ff",

  // Accent – Purple (talent icon gradient)
  purple: "#a855f7",
  purpleBg: "#f5f3ff",
  purpleDeep: "#7c3aed",

  // Accent – Green (project)
  green: "#22c55e",
  greenDeep: "#16a34a",
  greenBg: "#f0fdf4",

  // Accent – Blue (message)
  blue: "#3b82f6",
  blueBg: "#eff6ff",

  // Status
  red: "#dc2626",
  redBg: "#fef2f2",
  redBorder: "#fecaca",
};

/* -----------------------------------------------
   Type Config — using exact project accent colors
----------------------------------------------- */
const TYPE_CONFIG = {
  talent: {
    icon: <Briefcase size={17} />,
    // Purple glow – matches .card-purple
    iconBg: C.purpleDeep,
    iconShadow: "0 4px 8px -1px rgba(124,58,237,0.28), 0 2px 4px -1px rgba(124,58,237,0.14)",
    labelText: "Talent Request",
    labelColor: C.purpleDeep,
    labelBg: C.purpleBg,
  },
  message: {
    icon: <MessageSquare size={17} />,
    // Cyan – matches .card-cyan
    iconBg: C.cyan,
    iconShadow: "0 4px 8px -1px rgba(14,165,233,0.28), 0 2px 4px -1px rgba(14,165,233,0.14)",
    labelText: "Message",
    labelColor: "#0284c7",
    labelBg: C.cyanBg,
  },
  project: {
    icon: <FolderKanban size={17} />,
    // Green – matches .card-green
    iconBg: C.green,
    iconShadow: "0 4px 8px -1px rgba(34,197,94,0.28), 0 2px 4px -1px rgba(34,197,94,0.14)",
    labelText: "Project Update",
    labelColor: C.greenDeep,
    labelBg: C.greenBg,
  },
};

/* -----------------------------------------------
   Main Component
----------------------------------------------- */
const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [expandedId, setExpandedId] = useState(null);
  const [decisions, setDecisions] = useState({});
  const [hoveredId, setHoveredId] = useState(null);

  const unread = useMemo(() => notifications.filter((n) => !n.read), [notifications]);
  const earlier = useMemo(() => notifications.filter((n) => n.read), [notifications]);

  const markAllAsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const markAsReadWithDecision = (id, decision) => {
    setDecisions((prev) => ({ ...prev, [id]: decision }));
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setExpandedId(null);
  };

  /* ── Single card ── */
  const renderCard = (n) => {
    const cfg = TYPE_CONFIG[n.type];
    const isExpanded = expandedId === n.id;
    const hovered = hoveredId === n.id;
    const decided = decisions[n.id];

    return (
      <div
        key={n.id}
        onMouseEnter={() => setHoveredId(n.id)}
        onMouseLeave={() => setHoveredId(null)}
        style={{
          fontFamily: "'Inter', 'Segoe UI', sans-serif",
          display: "flex",
          gap: 16,
          padding: "18px 20px",
          borderRadius: 16,
          background: hovered ? C.bgHover : C.white,
          border: n.read
            ? `1.5px solid ${C.border}`
            : `1.5px solid rgba(245,129,12,0.35)`,
          // Matches stat-card shadow
          boxShadow: hovered
            ? "0 20px 25px -5px rgba(15,23,42,0.08), 0 10px 10px -5px rgba(15,23,42,0.03)"
            : "0 4px 12px -1px rgba(15,23,42,0.05)",
          marginBottom: 10,
          transition: "all 0.2s ease",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Orange left accent for unread – matches progress-fill gradient */}
        {!n.read && (
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 3,
              borderRadius: "16px 0 0 16px",
              background: "linear-gradient(180deg, #fb923c, #f97316, #ea580c)",
            }}
          />
        )}

        {/* Avatar icon – matches stat-icon-box style */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",      // matches .stat-icon-box border-radius
            background: cfg.iconBg,
            boxShadow: cfg.iconShadow,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: C.white,
            flexShrink: 0,
            marginLeft: !n.read ? 4 : 0,
          }}
        >
          {cfg.icon}
        </div>

        {/* Card body */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Top row: sender + time */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              {/* Sender name */}
              <span
                style={{
                  fontSize: 14,
                  fontWeight: n.read ? 600 : 700,
                  color: C.textHeading,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {n.sender}
              </span>

              {/* Type badge – matches .status-tag style */}
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: cfg.labelColor,
                  background: cfg.labelBg,
                  borderRadius: 6,
                  padding: "2px 8px",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {cfg.labelText}
              </span>

              {/* Unread indicator dot */}
              {!n.read && (
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: C.orange,
                    display: "inline-block",
                    boxShadow: "0 0 0 3px rgba(245,129,12,0.18)",
                  }}
                />
              )}
            </div>

            {/* Timestamp */}
            <span
              style={{
                fontSize: 12,
                color: C.textFaint,
                fontWeight: 500,
                whiteSpace: "nowrap",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {n.time}
            </span>
          </div>

          {/* Message / talent summary */}
          <div
            style={{
              fontSize: 13,
              color: C.textMuted,
              marginTop: 6,
              lineHeight: 1.55,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {n.type === "talent" ? (
              <>
                <span style={{ fontWeight: 600, color: C.textBody }}>Talent request: </span>
                {n.talents.slice(0, 2).map((t, i) => (
                  <span key={i}>
                    {t.name}
                    <span style={{ color: C.textFaint }}> ({t.role})</span>
                    {i < Math.min(n.talents.length, 2) - 1 ? ", " : ""}
                  </span>
                ))}
                {n.talents.length > 2 && (
                  <span style={{ color: C.orange, fontWeight: 600, marginLeft: 4 }}>
                    +{n.talents.length - 2} more
                  </span>
                )}
              </>
            ) : (
              n.message
            )}
          </div>

          {/* Decision badge – matches .status-completed / .status-review */}
          {decided && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                marginTop: 8,
                fontSize: 12,
                fontWeight: 700,
                borderRadius: 8,
                padding: "4px 10px",
                fontFamily: "'Inter', sans-serif",
                background: decided === "approved" ? C.greenBg : C.redBg,
                color: decided === "approved" ? C.greenDeep : C.red,
                border: decided === "approved"
                  ? "1px solid rgba(34,197,94,0.25)"
                  : `1px solid ${C.redBorder}`,
              }}
            >
              {decided === "approved" ? <Check size={12} /> : <X size={12} />}
              {decided === "approved" ? "Approved" : "Declined"}
            </div>
          )}

          {/* Action buttons row */}
          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap", alignItems: "center" }}>

            {/* View details – matches .btn-review */}
            <button
              onClick={() => setExpandedId(isExpanded ? null : n.id)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                background: C.white,
                border: `1px solid ${C.border}`,
                color: C.textMuted,
                fontSize: 12,
                fontWeight: 500,
                borderRadius: 8,
                padding: "7px 13px",
                cursor: "pointer",
                transition: "all 0.2s",
                fontFamily: "'Inter', sans-serif",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = C.bgHover;
                e.currentTarget.style.borderColor = "#cbd5e1";
                e.currentTarget.style.color = C.textHeading;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = C.white;
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.color = C.textMuted;
              }}
            >
              {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              {isExpanded ? "Hide details" : "View details"}
            </button>

            {/* Approve – matches .btn-upload */}
            {!n.read && n.type === "talent" && !decided && (
              <>
                <button
                  onClick={() => markAsReadWithDecision(n.id, "approved")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    background: C.orange,
                    border: `1px solid ${C.orange}`,
                    color: C.white,
                    fontSize: 12,
                    fontWeight: 600,
                    borderRadius: 8,
                    padding: "7px 14px",
                    cursor: "pointer",
                    boxShadow: "0 4px 6px -1px rgba(245,129,12,0.30)",
                    transition: "all 0.2s",
                    fontFamily: "'Inter', sans-serif",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = C.orangeHover; e.currentTarget.style.borderColor = C.orangeHover; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = C.orange; e.currentTarget.style.borderColor = C.orange; }}
                >
                  <Check size={13} /> Approve
                </button>

                {/* Decline – matches .btn-review with red tint */}
                <button
                  onClick={() => markAsReadWithDecision(n.id, "declined")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    background: C.white,
                    border: `1px solid ${C.redBorder}`,
                    color: C.red,
                    fontSize: 12,
                    fontWeight: 600,
                    borderRadius: 8,
                    padding: "7px 13px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    fontFamily: "'Inter', sans-serif",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = C.redBg; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = C.white; }}
                >
                  <X size={13} /> Decline
                </button>
              </>
            )}
          </div>

          {/* Expanded detail panel */}
          {isExpanded && (
            <div
              style={{
                marginTop: 12,
                paddingTop: 14,
                borderTop: `1px solid ${C.borderLight}`,
              }}
            >
              {n.type === "talent" ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {n.talents.map((t, i) => (
                    <div
                      key={i}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 7,
                        background: C.bgSubtle,
                        border: `1px solid ${C.border}`,
                        borderRadius: 8,
                        padding: "5px 10px",
                        fontSize: 12,
                        color: C.textBody,
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      <User size={12} style={{ color: C.purpleDeep }} />
                      <span style={{ fontWeight: 600 }}>{t.name}</span>
                      <span
                        style={{
                          background: C.purpleBg,
                          color: C.purpleDeep,
                          fontSize: 10,
                          fontWeight: 700,
                          borderRadius: 5,
                          padding: "2px 6px",
                        }}
                      >
                        {t.role}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    color: C.textMuted,
                    lineHeight: 1.6,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {n.message}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  /* ── Section label (matches .status-tag uppercase style) ── */
  const SectionLabel = ({ color, text }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {text}
      </span>
      <div
        style={{
          flex: 1,
          height: 1,
          background: `linear-gradient(to right, ${color}40, transparent)`,
        }}
      />
    </div>
  );

  /* ── Page render ── */
  return (
    <div
      className="jobs-container"
      style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
    >
      {/* 1200px max-width, responsive */}
      <div style={{ maxWidth: 1200, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>

        {/* ── Page Header ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 28,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Bell icon – matches icon-box-premium gradient in Dashboard.css */}
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 12,
                background: "linear-gradient(90deg, #fb923c 0%, #f97316 50%, #ea580c 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 6px rgba(246,143,59,0.35)",
                flexShrink: 0,
              }}
            >
              <Bell size={20} color={C.white} strokeWidth={2} />
            </div>

            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 22,
                  fontWeight: 800,
                  color: C.textPrimary,
                  letterSpacing: "-0.5px",
                  fontFamily: "'Inter', sans-serif",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                Notifications
                {unread.length > 0 && (
                  <span
                    style={{
                      background: C.orange,
                      color: C.white,
                      fontSize: 12,
                      fontWeight: 700,
                      borderRadius: 20,
                      padding: "2px 9px",
                      boxShadow: "0 4px 6px -1px rgba(245,129,12,0.30)",
                    }}
                  >
                    {unread.length}
                  </span>
                )}
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: C.textSubtle,
                  fontFamily: "'Inter', sans-serif",
                  marginTop: 2,
                }}
              >
                {unread.length > 0
                  ? `You have ${unread.length} unread notification${unread.length > 1 ? "s" : ""}`
                  : "All caught up!"}
              </p>
            </div>
          </div>

          {/* Mark all read – matches .btn-review */}
          {unread.length > 0 && (
            <button
              onClick={markAllAsRead}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                background: C.white,
                border: `1px solid ${C.border}`,
                color: C.textMuted,
                fontSize: 13,
                fontWeight: 500,
                borderRadius: 8,
                padding: "9px 16px",
                cursor: "pointer",
                boxShadow: "0 4px 12px -1px rgba(15,23,42,0.05)",
                transition: "all 0.2s",
                fontFamily: "'Inter', sans-serif",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = C.bgHover;
                e.currentTarget.style.borderColor = "#cbd5e1";
                e.currentTarget.style.color = C.textHeading;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = C.white;
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.color = C.textMuted;
              }}
            >
              <CheckCheck size={15} />
              Mark all as read
            </button>
          )}
        </div>

        {/* ── Two-column grid (responsive) ── */}
        <div
          className="notif-grid"
          style={{
            display: "grid",
            gridTemplateColumns: unread.length > 0 && earlier.length > 0 ? "1fr 1fr" : "1fr",
            gap: 24,
          }}
        >
          {unread.length > 0 && (
            <div>
              <SectionLabel color={C.orange} text="New" />
              {unread.map((n) => renderCard(n))}
            </div>
          )}

          {earlier.length > 0 && (
            <div>
              <SectionLabel color={C.textSubtle} text="Earlier" />
              {earlier.map((n) => renderCard(n))}
            </div>
          )}
        </div>

        {/* ── Empty state ── */}
        {notifications.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "80px 0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: C.bgSubtle,
                border: `1px solid ${C.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Bell size={28} color={C.textFaint} strokeWidth={1.5} />
            </div>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: C.textBody, fontFamily: "'Inter', sans-serif" }}>
              You're all caught up!
            </p>
            <p style={{ margin: 0, fontSize: 13, color: C.textSubtle, fontFamily: "'Inter', sans-serif" }}>
              No new notifications at this time.
            </p>
          </div>
        )}
      </div>

      {/* Responsive: collapse to 1 column on mobile */}
      <style>{`
        @media (max-width: 768px) {
          .notif-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default NotificationsPage;
