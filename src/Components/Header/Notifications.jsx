import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  MessageSquare,
  Briefcase,
  FolderKanban,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetUserNotificationsQuery } from "../../State-Management/Api/CompanyProfileApiSlice";

/* ── Soft UI Palette ── */
const S = {
  bg:          "#ffffff",
  bgSoft:      "#f9fafb",
  bgHover:     "#f3f4f6",
  border:      "#e5e7eb",
  borderSoft:  "#f0f0f5",
  text:        "#111827",
  textMid:     "#374151",
  textMuted:   "#6b7280",
  textFaint:   "#9ca3af",

  /* Soft icon backgrounds */
  purpleSoft:  "#ede9fe",
  purpleText:  "#7c3aed",
  cyanSoft:    "#e0f2fe",
  cyanText:    "#0284c7",
  greenSoft:   "#dcfce7",
  greenText:   "#16a34a",
  orangeSoft:  "#fff7ed",
  orangeText:  "#c2410c",
};

/* ── Type detection from message ── */
const detectType = (msg = "") => {
  const m = msg.toLowerCase();
  if (m.includes("talent") || m.includes("candidat") || m.includes("resume") || m.includes("shortlist")) return "talent";
  if (m.includes("project") || m.includes("milestone") || m.includes("deliverable")) return "project";
  return "message";
};

const TYPE_CFG = {
  talent:  { Icon: Briefcase,     iconBg: S.purpleSoft, iconColor: S.purpleText, label: "Talent"  },
  message: { Icon: MessageSquare, iconBg: S.cyanSoft,   iconColor: S.cyanText,   label: "Message" },
  project: { Icon: FolderKanban,  iconBg: S.greenSoft,  iconColor: S.greenText,  label: "Project" },
};

/* ── Time formatter ── */
const fmtTime = (dateString) => {
  if (!dateString) return "";
  const d    = new Date(dateString);
  const now  = new Date();
  const hrs  = Math.floor((now - d) / 3600000);
  if (hrs <= 0)  return "Just now";
  if (hrs < 24)  return `${hrs}h ago`;
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleString("en-US", { month: "short" });
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

/* ════════════════════════════════════════
   Component
════════════════════════════════════════ */
const Notifications = ({ targetPath = "/User/notifications-page" }) => {
  const [open, setOpen]         = useState(false);
  const [hoverId, setHoverId]   = useState(null);
  const containerRef            = useRef(null);
  const navigate                = useNavigate();

  const userId = localStorage.getItem("CompanyId");
  const { data: raw = [], isLoading } = useGetUserNotificationsQuery(userId, {
    pollingInterval: 5000,
  });

  const items = raw
    .map((item, i) => ({
      id:      item.Id ?? i,
      name:    item.Username || "System",
      message: item.Message  || "",
      time:    fmtTime(item.CreatedAt),
      type:    detectType(item.Message),
    }))
    .slice(0, 4);

  /* outside-click / Escape */
  useEffect(() => {
    const onDown = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  /* ── Single card ── */
  const Card = ({ n }) => {
    const { Icon, iconBg, iconColor, label } = TYPE_CFG[n.type];
    const hov = hoverId === n.id;

    return (
      <div
        onMouseEnter={() => setHoverId(n.id)}
        onMouseLeave={() => setHoverId(null)}
        style={{
          display:       "flex",
          gap:           12,
          alignItems:    "flex-start",
          padding:       "12px 14px",
          borderRadius:  10,
          background:    hov ? S.bgHover : S.bg,
          border:        `1px solid ${hov ? S.border : S.borderSoft}`,
          marginBottom:  6,
          transition:    "all 0.18s ease",
          cursor:        "pointer",
          fontFamily:    "'Inter','Segoe UI',sans-serif",
        }}
      >
        {/* Icon pill */}
        <div
          style={{
            width:          34,
            height:         34,
            borderRadius:   8,
            background:     iconBg,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            flexShrink:     0,
          }}
        >
          <Icon size={15} color={iconColor} strokeWidth={2} />
        </div>

        {/* Text block */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Row 1: name + badge + time */}
          <div
            style={{
              display:        "flex",
              alignItems:     "center",
              justifyContent: "space-between",
              gap:            6,
              flexWrap:       "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <span
                style={{
                  fontSize:   13,
                  fontWeight: 600,
                  color:      S.text,
                  lineHeight: 1.3,
                }}
              >
                {n.name}
              </span>

              {/* Soft badge */}
              <span
                style={{
                  fontSize:     10,
                  fontWeight:   600,
                  color:        iconColor,
                  background:   iconBg,
                  borderRadius: 4,
                  padding:      "1px 6px",
                  lineHeight:   1.6,
                }}
              >
                {label}
              </span>
            </div>

            <span style={{ fontSize: 11, color: S.textFaint, whiteSpace: "nowrap" }}>
              {n.time}
            </span>
          </div>

          {/* Row 2: message */}
          <p
            style={{
              margin:          "4px 0 0",
              fontSize:        12,
              color:           S.textMuted,
              lineHeight:      1.55,
              overflow:        "hidden",
              display:         "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {n.message}
          </p>
        </div>
      </div>
    );
  };

  return (
    <>
      {open && (
        <div
          className="notification-backdrop"
          onClick={() => setOpen(false)}
        />
      )}

      <div ref={containerRef} className="notification-container">
        {/* Bell */}
        <button
          className={`header-action-btn ${open ? "active" : ""}`}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Notifications"
          type="button"
        >
          <Bell size={20} />
          {items.length > 0 && (
            <span className="notification-badge">{items.length}</span>
          )}
        </button>

        {/* Popover */}
        {open && (
          <div className="notification-popover-wrapper">
            <div
              style={{
                background:   S.bg,
                borderRadius: 14,
                boxShadow:    "0 8px 30px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)",
                border:       `1px solid ${S.border}`,
                overflow:     "hidden",
                fontFamily:   "'Inter','Segoe UI',sans-serif",
                animation:    "slideDown 0.2s ease-out",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "space-between",
                  padding:        "14px 16px 11px",
                  borderBottom:   `1px solid ${S.borderSoft}`,
                  background:     S.bgSoft,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width:          28,
                      height:         28,
                      borderRadius:   7,
                      background:     S.orangeSoft,
                      display:        "flex",
                      alignItems:     "center",
                      justifyContent: "center",
                    }}
                  >
                    <Bell size={14} color={S.orangeText} strokeWidth={2} />
                  </div>
                  <span
                    style={{
                      fontSize:   14,
                      fontWeight: 700,
                      color:      S.text,
                    }}
                  >
                    Notifications
                  </span>
                </div>

                {items.length > 0 && (
                  <span
                    style={{
                      fontSize:     11,
                      fontWeight:   600,
                      color:        S.orangeText,
                      background:   S.orangeSoft,
                      borderRadius: 20,
                      padding:      "2px 8px",
                    }}
                  >
                    {items.length} new
                  </span>
                )}
              </div>

              {/* Body */}
              <div
                style={{
                  maxHeight: "360px",
                  overflowY: "auto",
                  padding:   "10px 10px 4px",
                }}
              >
                {isLoading ? (
                  <div
                    style={{
                      textAlign:  "center",
                      padding:    "28px 0",
                      fontSize:   13,
                      color:      S.textFaint,
                    }}
                  >
                    Loading…
                  </div>
                ) : items.length === 0 ? (
                  <div
                    style={{
                      textAlign:      "center",
                      padding:        "28px 0",
                      display:        "flex",
                      flexDirection:  "column",
                      alignItems:     "center",
                      gap:            8,
                    }}
                  >
                    <div
                      style={{
                        width:          40,
                        height:         40,
                        borderRadius:   10,
                        background:     S.bgHover,
                        border:         `1px solid ${S.border}`,
                        display:        "flex",
                        alignItems:     "center",
                        justifyContent: "center",
                      }}
                    >
                      <Bell size={18} color={S.textFaint} strokeWidth={1.5} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: S.textMid }}>
                      All caught up!
                    </span>
                    <span style={{ fontSize: 11, color: S.textFaint }}>
                      No new notifications
                    </span>
                  </div>
                ) : (
                  items.map((n) => <Card key={n.id} n={n} />)
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div
                  style={{
                    borderTop:      `1px solid ${S.borderSoft}`,
                    padding:        "8px 10px 10px",
                  }}
                >
                  <button
                    onClick={() => { setOpen(false); navigate(targetPath); }}
                    type="button"
                    style={{
                      width:        "100%",
                      background:   "none",
                      border:       `1px solid ${S.border}`,
                      borderRadius: 8,
                      padding:      "8px 0",
                      fontSize:     12,
                      fontWeight:   600,
                      color:        S.textMuted,
                      cursor:       "pointer",
                      transition:   "all 0.18s ease",
                      fontFamily:   "'Inter','Segoe UI',sans-serif",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background  = S.bgHover;
                      e.currentTarget.style.color       = S.text;
                      e.currentTarget.style.borderColor = "#d1d5db";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background  = "none";
                      e.currentTarget.style.color       = S.textMuted;
                      e.currentTarget.style.borderColor = S.border;
                    }}
                  >
                    View all notifications
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Notifications;