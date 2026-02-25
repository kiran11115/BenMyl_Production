import React from "react";
import {
    FiCalendar,
    FiDollarSign,
    FiUser,
    FiClock,
    FiCheckSquare,
    FiAlertCircle,
    FiList,
    FiFileText,
    FiTarget,
    FiUsers,
} from "react-icons/fi";

const TEAM = [
    {
        id: "u1",
        name: "Sarah Johnson",
        role: "Lead Developer",
        avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80",
    },
    {
        id: "u2",
        name: "Michael Chen",
        role: "Backend Engineer",
        avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80",
    },
    {
        id: "u3",
        name: "Emma Davis",
        role: "UI/UX Designer",
        avatar:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80",
    },
    {
        id: "u4",
        name: "Alex Thompson",
        role: "QA Engineer",
        avatar:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80",
    },
];

const formatCurrency = (n) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumSignificantDigits: 3 }).format(n);

/* Small inline label+value row */
function InfoRow({ Icon, label, value }) {
    return (
        <div className="d-flex align-items-center gap-2 mb-3">
            <div className="stat-icon-box box-indigo" style={{ width: 32, height: 32, borderRadius: 8 }}>
                <Icon size={14} />
            </div>
            <div>
                <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    {label}
                </div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>{value}</div>
            </div>
        </div>
    );
}

export default function OverviewTab({ project, tasks }) {
    const done = tasks.filter((t) => t.status === "Done").length;
    const inProgress = tasks.filter((t) => t.status === "In Progress").length;
    const todo = tasks.filter((t) => t.status === "To Do").length;

    /* SVG circle */
    const R = 52;
    const C = 2 * Math.PI * R;
    const offset = C - (project.progress / 100) * C;

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "1fr 320px",
                gap: "20px",
                alignItems: "start",
            }}
        >
            {/* ── LEFT ─────────────────────────────────────────── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

                {/* Mini stats */}
                <div className="stats-grid" style={{ marginBottom: 0 }}>
                    <div className="stat-card">
                        <div className="stat-content">
                            <div className="stat-label">Completed</div>
                            <div className="stat-value" style={{ fontSize: 22, color: "#10b981" }}>{done}</div>
                            <div className="stat-trend trend-up">
                                <FiCheckSquare size={12} /> Tasks done
                            </div>
                        </div>
                        <div className="stat-icon-box box-emerald"><FiCheckSquare size={20} /></div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-content">
                            <div className="stat-label">In Progress</div>
                            <div className="stat-value" style={{ fontSize: 22, color: "#3b82f6" }}>{inProgress}</div>
                            <div className="stat-trend trend-up">
                                <FiList size={12} /> Active
                            </div>
                        </div>
                        <div className="stat-icon-box box-blue"><FiList size={20} /></div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-content">
                            <div className="stat-label">To Do</div>
                            <div className="stat-value" style={{ fontSize: 22, color: "#f59e0b" }}>{todo}</div>
                            <div className="stat-trend trend-down">
                                <FiAlertCircle size={12} /> Pending
                            </div>
                        </div>
                        <div className="stat-icon-box box-amber"><FiAlertCircle size={20} /></div>
                    </div>
                </div>

                {/* Description */}
                <div className="project-card" style={{ gap: 10 }}>
                    <div className="card-header">
                        <h3 className="card-title m-0 d-flex align-items-center gap-1">
                            <FiFileText size={14} /> Project Description
                        </h3>
                    </div>
                    <p className="m-0" style={{ fontSize: "13px", color: "#475569", lineHeight: 1.7 }}>
                        {project.description ||
                            `This project focuses on delivering high-quality results for ${project.title}. The team works collaboratively to meet all milestones on time while maintaining the highest standards. Regular check-ins and progress updates ensure transparency throughout the project lifecycle.`}
                    </p>
                </div>

                {/* Project Details */}
                <div className="project-card" style={{ gap: 10 }}>
                    <div className="card-header">
                        <h3 className="card-title m-0 d-flex align-items-center gap-1">
                            <FiTarget size={14} /> Project Details
                        </h3>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
                        <InfoRow Icon={FiUser} label="Client / Author" value={project.author} />
                        <InfoRow Icon={FiCalendar} label="Due Date" value={project.dueDate} />
                        <InfoRow Icon={FiDollarSign} label="Budget" value={formatCurrency(project.budget)} />
                        <InfoRow Icon={FiClock} label="Status" value={project.status} />
                    </div>
                </div>
            </div>

            {/* ── RIGHT ────────────────────────────────────────── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

                {/* Progress Circle */}
                <div className="project-card" style={{ alignItems: "center", gap: 12 }}>
                    <h3 className="card-title m-0 d-flex align-items-center gap-1">
                        <FiTarget size={14} /> Overall Progress
                    </h3>
                    <svg
                        width="130"
                        height="130"
                        style={{ transform: "rotate(-90deg)", display: "block", margin: "0 auto" }}
                    >
                        <defs>
                            <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#6366f1" />
                                <stop offset="100%" stopColor="#a855f7" />
                            </linearGradient>
                        </defs>
                        <circle cx="65" cy="65" r={R} fill="none" stroke="#e2e8f0" strokeWidth={10} />
                        <circle
                            cx="65"
                            cy="65"
                            r={R}
                            fill="none"
                            stroke="url(#pg)"
                            strokeWidth={10}
                            strokeLinecap="round"
                            strokeDasharray={C}
                            strokeDashoffset={offset}
                            style={{ transition: "stroke-dashoffset 0.6s ease" }}
                        />
                    </svg>
                    <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "24px", fontWeight: 700, color: "#0f172a" }}>
                            {project.progress}%
                        </div>
                        <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>
                            Completion Rate
                        </div>
                    </div>
                </div>

                {/* Team Members */}
                <div className="project-card" style={{ gap: 12 }}>
                    <h3 className="card-title m-0 d-flex align-items-center gap-1">
                        <FiUsers size={14} /> Team Members
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {TEAM.map((m) => (
                            <div key={m.id} className="d-flex align-items-center gap-2">
                                <img
                                    src={m.avatar}
                                    alt={m.name}
                                    style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover" }}
                                />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>{m.name}</div>
                                    <div style={{ fontSize: "11px", color: "#64748b" }}>{m.role}</div>
                                </div>
                                <span className="status-tag status-progress" style={{ fontSize: "10px" }}>
                                    Active
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
