import React, { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
    FiArrowLeft,
    FiLayout,
    FiCheckSquare,
    FiMessageSquare,
} from "react-icons/fi";
import "./Projects.css";
import OverviewTab from "./OverviewTab";
import TasksTab from "./TasksTab";
import UpdatesTab from "./UpdatesTab";

/* ── Seed tasks ────────────────────────────────────────────── */
const seedTasks = () => [
    {
        id: 101,
        title: "Initial kickoff & stakeholder alignment",
        description: "Set up the project structure and align with all stakeholders.",
        priority: "High",
        status: "Done",
        dueDate: "2024-01-10",
        assigneeId: "u1",
        updatedBy: null,
        lastUpdate: null,
    },
    {
        id: 102,
        title: "Design wireframes and prototypes",
        description: "Create low-fi wireframes and get design approval from team.",
        priority: "High",
        status: "Done",
        dueDate: "2024-01-18",
        assigneeId: "u3",
        updatedBy: null,
        lastUpdate: null,
    },
    {
        id: 103,
        title: "Develop core functionality",
        description: "Implement the main features as per the technical spec document.",
        priority: "Urgent",
        status: "In Progress",
        dueDate: "2024-02-05",
        assigneeId: "u2",
        updatedBy: null,
        lastUpdate: null,
    },
    {
        id: 104,
        title: "QA testing and bug fixes",
        description: "Run full regression tests and fix any identified issues.",
        priority: "Normal",
        status: "To Do",
        dueDate: "2024-02-15",
        assigneeId: "u1",
        updatedBy: null,
        lastUpdate: null,
    },
    {
        id: 105,
        title: "Client review and feedback incorporation",
        description: "Present deliverables to client and apply revision requests.",
        priority: "Normal",
        status: "To Do",
        dueDate: "2024-02-22",
        assigneeId: "u4",
        updatedBy: null,
        lastUpdate: null,
    },
];

/* ── Seed feed ─────────────────────────────────────────────── */
const seedFeed = () => [
    {
        id: 1,
        type: "comment",
        name: "Sarah Johnson",
        initials: "SJ",
        avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80",
        text: "Project has been kicked off! Initial scope and requirements are finalised. Let's aim to hit the first milestone by end of week.",
        createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
        reactions: { thumbs: 2, heart: 1, fire: 0, check: 0 },
        reactedBy: [],
        tag: "#kickoff",
    },
    {
        id: 2,
        type: "system",
        text: 'Task "#101 – Initial kickoff & stakeholder alignment" was moved to Done.',
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
    {
        id: 3,
        type: "comment",
        name: "Michael Chen",
        initials: "MC",
        avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80",
        text: "Backend API endpoints are 80% complete. Running into a few CORS issues with the auth service — will resolve by tomorrow.",
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        reactions: { thumbs: 1, heart: 0, fire: 0, check: 0 },
        reactedBy: [],
        tag: "#development",
    },
    {
        id: 4,
        type: "comment",
        name: "Emma Davis",
        initials: "ED",
        avatar:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80",
        text: "UI components for the dashboard are ready for review. Please check before end of day.",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        reactions: { thumbs: 0, heart: 3, fire: 1, check: 0 },
        reactedBy: [],
        tag: "#design",
    },
];

/* ── Status badge helper ───────────────────────────────────── */
const badgeClass = (status) => {
    if (status === "Completed") return "status-completed";
    if (status === "Awaiting Review") return "status-review";
    return "status-progress";
};

/* ── Tab config ────────────────────────────────────────────── */
const TABS = [
    { key: "overview", label: "Overview", Icon: FiLayout },
    { key: "tasks", label: "Tasks", Icon: FiCheckSquare },
    { key: "updates", label: "Updates", Icon: FiMessageSquare },
];

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
export default function ProjectProgress() {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    const project = location.state?.project || {
        id: id || 1,
        title: "Project #" + (id || 1),
        author: "Unknown",
        avatar: null,
        progress: 50,
        dueDate: "N/A",
        budget: 0,
        status: "In Progress",
    };

    const [activeTab, setActiveTab] = useState("overview");
    const [tasks, setTasks] = useState(seedTasks);
    const [feed, setFeed] = useState(seedFeed);

    /* Activity logger — called from TasksTab on every task mutation */
    const logActivity = (text) => {
        setFeed((prev) => [
            ...prev,
            {
                id: Date.now(),
                type: "system",
                text,
                createdAt: new Date().toISOString(),
            },
        ]);
    };

    const taskCount = tasks.length;
    const updateCount = feed.filter((f) => f.type === "comment").length;

    return (
        <div className="projects-page-wrapper">
            {/* ── HEADER ─────────────────────────────────────────── */}
            <div
                style={{
                    background: "#fff",
                    borderBottom: "1px solid #e2e8f0",
                    padding: "16px 24px 0",
                    position: "sticky",
                    top: 0,
                    zIndex: 100,
                }}
            >
                {/* Breadcrumb */}
                <div className="d-flex align-items-center gap-2 mb-2" style={{ fontSize: "13px", color: "#64748b" }}>
                    <button
                        className="link-button d-flex align-items-center gap-1"
                        onClick={() => navigate("/User/user-projects")}
                        style={{ border: "none", background: "none", cursor: "pointer", color: "#3b82f6", display: "flex", alignItems: "center", gap: "4px" }}
                    >
                        <FiArrowLeft size={13} /> Back to Projects
                    </button>
                    <span>/</span>
                    <span style={{ color: "#94a3b8" }}>Project Progress</span>
                </div>

                {/* Title row */}
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
                    <h3 className="m-0" style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>
                        {project.title}
                    </h3>
                    <div className="d-flex align-items-center gap-2">
                        <span className={`status-tag ${badgeClass(project.status)}`}>
                            {project.status}
                        </span>
                        <div
                            className="d-flex align-items-center gap-2"
                            style={{
                                background: "#f1f5f9",
                                borderRadius: "20px",
                                padding: "3px 10px",
                                fontSize: "12px",
                                fontWeight: 600,
                                color: "#334155",
                            }}
                        >
                            <div
                                style={{
                                    width: "60px",
                                    height: "5px",
                                    background: "#e2e8f0",
                                    borderRadius: "99px",
                                    overflow: "hidden",
                                }}
                            >
                                <div
                                    style={{
                                        height: "100%",
                                        width: `${project.progress}%`,
                                        background: "linear-gradient(90deg,#6366f1,#a855f7)",
                                        borderRadius: "99px",
                                    }}
                                />
                            </div>
                            {project.progress}%
                        </div>
                    </div>
                </div>

                {/* Tab Bar — same view-toggle1 / toggle style */}
                <div className="view-toggle1">
                    {TABS.map(({ key, label, Icon }) => (
                        <button
                            key={key}
                            className={`toggle d-flex align-items-center gap-1 ${activeTab === key ? "active" : ""}`}
                            onClick={() => setActiveTab(key)}
                        >
                            <Icon size={13} />
                            {label}
                            {key === "tasks" && taskCount > 0 && (
                                <span
                                    style={{
                                        background: activeTab === key ? "#fff" : "#1e293b",
                                        color: activeTab === key ? "#1e293b" : "#fff",
                                        borderRadius: "10px",
                                        padding: "0 5px",
                                        fontSize: "10px",
                                        fontWeight: 700,
                                        lineHeight: "16px",
                                        minWidth: "16px",
                                        textAlign: "center",
                                        marginLeft: "4px"
                                    }}
                                >
                                    {taskCount}
                                </span>
                            )}
                            {key === "updates" && updateCount > 0 && (
                                <span
                                    style={{
                                        background: activeTab === key ? "#f59e0b" : "#f59e0b",
                                        color: "#fff",
                                        borderRadius: "10px",
                                        padding: "0 5px",
                                        fontSize: "10px",
                                        fontWeight: 700,
                                        lineHeight: "16px",
                                        minWidth: "16px",
                                        textAlign: "center",
                                        marginLeft: "4px"
                                    }}
                                >
                                    {updateCount}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── BODY ───────────────────────────────────────────── */}
            <div className="projects-container">
                {activeTab === "overview" && (
                    <OverviewTab project={project} tasks={tasks} />
                )}
                {activeTab === "tasks" && (
                    <TasksTab
                        tasks={tasks}
                        setTasks={setTasks}
                        logActivity={logActivity}
                    />
                )}
                {activeTab === "updates" && (
                    <UpdatesTab feed={feed} setFeed={setFeed} />
                )}
            </div>
        </div>
    );
}
