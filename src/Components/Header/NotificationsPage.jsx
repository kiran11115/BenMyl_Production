import React, { useState, useMemo } from "react";
import {
  Bell,
  MessageSquare,
  Briefcase,
  FolderKanban,
  Calendar,
  StickyNote,
  Save,
  X,
  Pencil,
} from "lucide-react";
import { useGetUserNotificationsQuery } from "../../State-Management/Api/CompanyProfileApiSlice";

/* ─────────────────────────────────────────────
   Soft UI Palette
───────────────────────────────────────────── */
const S = {
  bg: "#ffffff",
  bgSoft: "#f9fafb",
  bgHover: "#f3f4f6",
  border: "#e5e7eb",
  borderSoft: "#f0f0f5",
  text: "#111827",
  textMid: "#374151",
  textMuted: "#6b7280",
  textFaint: "#9ca3af",

  purpleSoft: "#ede9fe", purpleText: "#7c3aed",
  cyanSoft: "#e0f2fe", cyanText: "#0284c7",
  greenSoft: "#dcfce7", greenText: "#16a34a",
  orangeSoft: "#fff7ed", orangeText: "#c2410c",

  amberSoft: "#fffbeb",
  amberBorder: "#fde68a",
  amberText: "#92400e",
  amberBtn: "#f59e0b",
};

/* ─────────────────────────────────────────────
   Type detection
───────────────────────────────────────────── */
const detectType = (msg = "") => {
  const m = msg.toLowerCase();
  if (m.includes("talent") || m.includes("candidat") || m.includes("resume") || m.includes("shortlist"))
    return "talent";
  if (m.includes("project") || m.includes("milestone") || m.includes("deliverable"))
    return "project";
  return "message";
};

const TYPE_CFG = {
  talent: { Icon: Briefcase, bg: S.purpleSoft, color: S.purpleText, label: "Talent" },
  message: { Icon: MessageSquare, bg: S.cyanSoft, color: S.cyanText, label: "Message" },
  project: { Icon: FolderKanban, bg: S.greenSoft, color: S.greenText, label: "Project" },
};

/* ─────────────────────────────────────────────
   Date helpers
───────────────────────────────────────────── */
const toLocalISO = (dateString) => {
  if (!dateString) return null;
  const d = new Date(dateString);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const todayISO = () => toLocalISO(new Date().toISOString());

const fmtRelative = (dateString) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  const hrs = Math.floor((Date.now() - d) / 3600000);
  if (hrs <= 0) return "Just now";
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

const fmtDateHeading = (iso) => {
  if (!iso || iso === "Unknown") return "Date Unknown";
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d.getTime())) return "Invalid Date";
  return d.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

/* ─────────────────────────────────────────────
   Section label
───────────────────────────────────────────── */
const SectionLabel = ({ text, count }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
    <span
      style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.07em",
        textTransform: "uppercase",
        color: S.textMuted,
        fontFamily: "'Inter','Segoe UI',sans-serif",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </span>
    {count > 0 && (
      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: S.textFaint,
          background: S.bgHover,
          borderRadius: 10,
          padding: "1px 7px",
        }}
      >
        {count}
      </span>
    )}
    <div style={{ flex: 1, height: 1, background: S.borderSoft }} />
  </div>
);

/* ─────────────────────────────────────────────
   Notification Card (read-only, no per-card note)
───────────────────────────────────────────── */
const fmtFullDate = (isoDate) => {
  if (!isoDate) return "";
  return new Date(isoDate + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const NotifCard = ({ n }) => {
  const { Icon, bg, color, label } = TYPE_CFG[n.type];

  return (
    <div
      style={{
        background: S.bg,
        border: `1px solid ${S.border}`,
        borderRadius: 10,
        marginBottom: 8,
        padding: "12px 14px",
        display: "flex",
        gap: 11,
        alignItems: "flex-start",
        fontFamily: "'Inter','Segoe UI',sans-serif",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = S.bgHover)}
      onMouseLeave={(e) => (e.currentTarget.style.background = S.bg)}
    >
      {/* Icon */}
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 8,
          background: bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={14} color={color} strokeWidth={2} />
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 6,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: S.text }}>{n.name}</span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                color,
                background: bg,
                borderRadius: 4,
                padding: "1px 6px",
              }}
            >
              {label}
            </span>
          </div>
          <span style={{ fontSize: 11, color: S.textFaint, whiteSpace: "nowrap" }}>
            {n.time}
          </span>
        </div>
        <p
          style={{
            margin: "5px 0 0",
            fontSize: 12,
            color: S.textMuted,
            lineHeight: 1.6,
          }}
        >
          {n.message}
        </p>
      </div>
    </div>
  );
};


/* ─────────────────────────────────────────────
   Scrollable column
───────────────────────────────────────────── */
const NotifColumn = ({ items, emptyText, grouped = false }) => {
  if (items.length === 0) {
    return (
      <div className="np-col-list">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "40px 0",
            gap: 8,
            fontFamily: "'Inter','Segoe UI',sans-serif",
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              background: S.bgHover,
              border: `1px solid ${S.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Bell size={18} color={S.textFaint} strokeWidth={1.5} />
          </div>
          <span style={{ fontSize: 12, color: S.textFaint }}>{emptyText}</span>
        </div>
      </div>
    );
  }

  if (!grouped) {
    return (
      <div className="np-col-list">
        {items.map((n) => <NotifCard key={n.id} n={n} />)}
      </div>
    );
  }

  // Handle grouping
  const groups = items.reduce((acc, n) => {
    const d = n.isoDate || "Unknown";
    if (!acc[d]) acc[d] = [];
    acc[d].push(n);
    return acc;
  }, {});

  const sortedDates = Object.keys(groups).sort((a, b) => b.localeCompare(a));

  return (
    <div className="np-col-list">
      {sortedDates.map((date) => (
        <React.Fragment key={date}>
          <div style={{ margin: "16px 0 10px 4px" }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: S.textMuted,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {fmtDateHeading(date)}
            </span>
          </div>
          {groups[date].map((n) => (
            <NotifCard key={n.id} n={n} />
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════
   Main Page
═══════════════════════════════════════════════ */
const NotificationsPage = () => {
  const userId = localStorage.getItem("CompanyId");
  const { data: raw = [], isLoading } = useGetUserNotificationsQuery(userId, {
    pollingInterval: 10000,
  });

  const [selectedDate, setSelectedDate] = useState("");

  const TODAY = todayISO();

  const allItems = useMemo(
    () =>
      raw.map((item, i) => ({
        id: item.Id ?? i,
        name: item.Username || "System",
        message: item.Message || "",
        time: fmtRelative(item.CreatedAt),
        isoDate: toLocalISO(item.CreatedAt),
        type: detectType(item.Message),
      })),
    [raw]
  );

  const todayItems = useMemo(() => allItems.filter((n) => n.isoDate === TODAY), [allItems, TODAY]);
  const earlierItems = useMemo(() => allItems.filter((n) => n.isoDate && n.isoDate < TODAY), [allItems, TODAY]);
  const selectedItems = useMemo(() =>
    selectedDate ? allItems.filter((n) => n.isoDate === selectedDate) : [],
    [allItems, selectedDate]
  );

  const showSelected = !!selectedDate;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        .np-page {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 70px);
          overflow: hidden;
          font-family: 'Inter','Segoe UI',sans-serif;
          background: #f9fafb;
          padding: 0 20px;
          box-sizing: border-box;
        }

        .np-inner {
          max-width: 1040px;
          width: 100%;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          height: 100%;
          box-sizing: border-box;
        }

        /* ── Page header ── */
        .np-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          padding: 20px 0 14px;
          flex-shrink: 0;
        }

        /* ── Two-column grid ── */
        .np-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          flex: 1;
          overflow: hidden;
          min-height: 0;
        }

        /* each column is a flex column with its own scroll */
        .np-col {
          display: flex;
          flex-direction: column;
          min-height: 0;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
        }

        .np-col-header {
          padding: 12px 14px 10px;
          border-bottom: 1px solid #f0f0f5;
          background: #f9fafb;
          flex-shrink: 0;
        }

        .np-col-list {
          flex: 1;
          overflow-y: auto;
          padding: 10px 10px 12px;
        }

        .np-col-list::-webkit-scrollbar        { width: 4px; }
        .np-col-list::-webkit-scrollbar-track  { background: transparent; }
        .np-col-list::-webkit-scrollbar-thumb  { background: #e5e7eb; border-radius: 4px; }
        .np-col-list::-webkit-scrollbar-thumb:hover { background: #d1d5db; }

        /* single col when date selected */
        .np-grid-single {
          grid-template-columns: 1fr;
        }

        /* ── Date picker ── */
        .np-date-input {
          border: none;
          outline: none;
          background: none;
          font-size: 12px;
          color: #374151;
          cursor: pointer;
          font-family: 'Inter','Segoe UI',sans-serif;
          min-width: 110px;
        }
        .np-date-input::-webkit-calendar-picker-indicator {
          opacity: 0.5;
          cursor: pointer;
        }


        /* ── Mobile collapse ── */
        @media (max-width: 640px) {
          .np-page  { padding: 0 12px; }
          .np-grid  { grid-template-columns: 1fr; }
          .np-header { padding: 14px 0 10px; }
        }
      `}</style>

      <div className="np-page">
        <div className="np-inner">

          {/* ── Page Header ── */}
          <div className="np-header">
            {/* Left: title */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 9,
                  background: S.orangeSoft,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Bell size={16} color={S.orangeText} strokeWidth={2} />
              </div>
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 17,
                    fontWeight: 700,
                    color: S.text,
                    lineHeight: 1.2,
                  }}
                >
                  Notifications
                </h2>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: S.textFaint }}>
                  {allItems.length} total · {todayItems.length} today
                </p>
              </div>
            </div>

            {/* Right: date picker */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate("")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    background: "none",
                    border: `1px solid ${S.border}`,
                    borderRadius: 7,
                    padding: "5px 10px",
                    fontSize: 12,
                    color: S.textMuted,
                    cursor: "pointer",
                    fontFamily: "'Inter','Segoe UI',sans-serif",
                  }}
                >
                  <X size={11} /> Clear
                </button>
              )}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  background: S.bg,
                  border: `1px solid ${S.border}`,
                  borderRadius: 8,
                  padding: "6px 12px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                <Calendar size={13} color={S.textFaint} />
                <input
                  type="date"
                  className="np-date-input"
                  value={selectedDate}
                  max={TODAY}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{ color: selectedDate ? S.text : S.textFaint }}
                />
              </div>
            </div>
          </div>

          {/* ── Columns ── */}
          {isLoading ? (
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: S.textFaint,
                fontSize: 13,
              }}
            >
              Loading notifications…
            </div>
          ) : showSelected ? (
            /* Single column for selected date */
            <div className="np-grid np-grid-single">
              <div className="np-col">
                <div className="np-col-header">
                  <SectionLabel
                    text={selectedDate === TODAY ? "Today" : fmtDateHeading(selectedDate)}
                    count={selectedItems.length}
                  />
                </div>
                <NotifColumn
                  items={selectedItems}
                  emptyText={`No notifications on ${selectedDate === TODAY ? "today" : fmtDateHeading(selectedDate)}.`}
                />
              </div>
            </div>
          ) : (
            /* Two columns: Today | Earlier */
            <div className="np-grid">
              {/* Today */}
              <div className="np-col">
                <div className="np-col-header">
                  <SectionLabel text="Today" count={todayItems.length} />
                </div>
                <NotifColumn items={todayItems} emptyText="No notifications today." />
              </div>

              {/* Earlier */}
              <div className="np-col">
                <div className="np-col-header">
                  <SectionLabel text="Earlier" count={earlierItems.length} />
                </div>
                <NotifColumn items={earlierItems} emptyText="No earlier notifications." grouped />
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default NotificationsPage;
