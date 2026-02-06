import React, { useMemo, useState } from "react";
import { User } from "lucide-react";

/* -------------------------------
   Mock Data (UNCHANGED)
-------------------------------- */

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
  { name: "Sophia Lee", role: "QA Engineer" }
]

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

/* -------------------------------
   Component
-------------------------------- */

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [expandedId, setExpandedId] = useState(null);
  const [decisions, setDecisions] = useState({});

  const unread = useMemo(
    () => notifications.filter((n) => !n.read),
    [notifications]
  );

  const earlier = useMemo(
    () => notifications.filter((n) => n.read),
    [notifications]
  );

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  const markAsReadWithDecision = (id, decision) => {
    setDecisions((prev) => ({ ...prev, [id]: decision }));
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  const renderTalentSummary = (talents) => {
    const visible = talents.slice(0, 2);
    const remaining = talents.length - visible.length;

    return (
      <>
        <strong>Talent request:</strong>{" "}
        {visible.map((t, i) => (
          <span key={i}>
            {t.name} - {t.role}
            {i < visible.length - 1 && ", "}
          </span>
        ))}
        {remaining > 0 && (
          <span style={{ color: "#64748b" }}>
            {" "}
            +{remaining} more
          </span>
        )}
      </>
    );
  };

  const renderDecisionStatus = (id) => {
    if (!decisions[id]) return null;

    return (
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: decisions[id] === "approved" ? "#16a34a" : "#dc2626",
        }}
      >
        {decisions[id] === "approved" ? "Approved" : "Declined"}
      </span>
    );
  };

  const renderRow = (n, isEarlier = false) => {
    const isExpanded = expandedId === n.id;

    return (
      <div
        key={n.id}
        style={{
          display: "flex",
          gap: 16,
          padding: "14px 20px",
          borderRadius: 12,
          borderLeft: !n.read ? "2px solid #6843C7" : "2px solid transparent",
          background: "#fff",
          opacity: isEarlier ? 0.65 : 1,
          marginBottom: 8,
        }}
      >
        {/* Profile Icon */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "#f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#64748b",
            flexShrink: 0,
          }}
        >
          <User size={18} />
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              gap: 12,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: n.read ? 500 : 700,
                color: "#1e293b",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {n.sender}
            </div>

            <div style={{ fontSize: 12, color: "#64748b" }}>
              {n.time}
            </div>
          </div>

          {/* Message */}
          <div
            style={{
              fontSize: 13,
              color: "#475569",
              marginTop: 4,
              lineHeight: 1.4,
            }}
          >
            {n.type === "talent"
              ? renderTalentSummary(n.talents)
              : n.message}
          </div>

          {/* Decision status */}
          {n.read && n.type === "talent" && (
            <div style={{ marginTop: 6 }}>
              {renderDecisionStatus(n.id)}
            </div>
          )}

          {/* Actions */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              marginTop: 12,
            }}
          >
            <button
              className="btn-secondary"
              onClick={() =>
                setExpandedId(isExpanded ? null : n.id)
              }
            >
              {isExpanded ? "Hide details" : "View details"}
            </button>

            {!n.read && n.type === "talent" && (
              <>
                <button
                  className="btn-primary"
                  onClick={() =>
                    markAsReadWithDecision(n.id, "approved")
                  }
                >
                  Approve
                </button>
                <button
                  className="btn-secondary"
                  onClick={() =>
                    markAsReadWithDecision(n.id, "declined")
                  }
                >
                  Decline
                </button>
              </>
            )}
          </div>

          {/* Expanded Details */}
          {isExpanded && (
            <div
              style={{
                marginTop: 12,
                paddingTop: 12,
                borderTop: "1px solid #e2e8f0",
                fontSize: 13,
                color: "#475569",
              }}
            >
              {n.type === "talent" &&
                n.talents.map((t, i) => (
                  <div key={i}>
                    {t.name} - {t.role}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="jobs-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h2 style={{ margin: 0 }}>Notifications</h2>

        {unread.length > 0 && (
          <button className="btn-secondary" onClick={markAllAsRead}>
            Mark all as read
          </button>
        )}
      </div>

      {unread.length > 0 && (
        <>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#1e293b",
              marginBottom: 12,
            }}
          >
            Unread
          </div>
          {unread.map((n) => renderRow(n))}
        </>
      )}

      {earlier.length > 0 && (
        <>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#64748b",
              margin: "24px 0 12px",
            }}
          >
            Earlier
          </div>
          {earlier.map((n) => renderRow(n, true))}
        </>
      )}
    </div>
  );
};

export default NotificationsPage;
