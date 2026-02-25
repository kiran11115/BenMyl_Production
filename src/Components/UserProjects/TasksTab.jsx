import React, { useState } from "react";
import {
    FiPlus,
    FiX,
    FiCalendar,
    FiUser,
    FiEdit2,
    FiTrash2,
    FiCheckCircle,
    FiClock,
    FiCircle,
    FiAlertCircle,
    FiArrowUp,
    FiMinus,
    FiLayout,
    FiList,
} from "react-icons/fi";

/* ─────────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────────── */
const STATUSES = ["To Do", "In Progress", "Done"];
const PRIORITIES = ["Urgent", "High", "Normal", "Low"];

const ASSIGNEES = [
    {
        id: "u1",
        name: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80",
    },
    {
        id: "u2",
        name: "Michael Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80",
    },
    {
        id: "u3",
        name: "Emma Davis",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80",
    },
    {
        id: "u4",
        name: "Alex Thompson",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80",
    },
];

let idSeed = 200;

/* ─────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────── */
const priorityColor = (p) => {
    if (p === "Urgent") return { bg: "#fef2f2", color: "#ef4444" };
    if (p === "High") return { bg: "#fff7ed", color: "#f97316" };
    if (p === "Normal") return { bg: "#eff6ff", color: "#3b82f6" };
    return { bg: "#f0fdf4", color: "#22c55e" };
};

const PriorityIcon = ({ p, size = 11 }) => {
    if (p === "Urgent") return <FiAlertCircle size={size} />;
    if (p === "High") return <FiArrowUp size={size} />;
    if (p === "Normal") return <FiMinus size={size} />;
    return <FiArrowUp size={size} style={{ transform: "rotate(180deg)" }} />;
};

const statusIcon = (s) => {
    if (s === "Done") return <FiCheckCircle size={14} color="#10b981" />;
    if (s === "In Progress") return <FiClock size={14} color="#3b82f6" />;
    return <FiCircle size={14} color="#94a3b8" />;
};

const getAssignee = (id) => ASSIGNEES.find((a) => a.id === id);

/* ─────────────────────────────────────────────────────────────────
   ADD TASK MODAL (Recruiter Only)
───────────────────────────────────────────────────────────────── */
function AddTaskModal({ onClose, onAdd }) {
    const [form, setForm] = useState({
        title: "",
        description: "",
        priority: "Normal",
        status: "To Do",
        dueDate: "",
        assigneeId: "",
    });

    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const submit = (e) => {
        e.preventDefault();
        if (!form.title.trim()) return;
        idSeed += 1;
        onAdd({ ...form, id: idSeed, title: form.title.trim() });
        onClose();
    };

    return (
        <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px"
        }} onClick={onClose}>
            <div style={{
                background: "#fff", borderRadius: "12px", width: "100%", maxWidth: "500px",
                padding: "24px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
            }} onClick={e => e.stopPropagation()}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="m-0" style={{ fontSize: "18px" }}>Create New Task</h3>
                    <button className="link-button" onClick={onClose}><FiX size={20} /></button>
                </div>
                <form onSubmit={submit}>
                    <div className="mb-3">
                        <label className="stat-label">Title</label>
                        <input className="projects-filter-select w-100" value={form.title} onChange={e => set("title", e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label className="stat-label">Description</label>
                        <textarea className="projects-filter-select w-100" style={{ minHeight: "80px" }} value={form.description} onChange={e => set("description", e.target.value)} />
                    </div>
                    <div className="row mb-3">
                        <div className="col-6">
                            <label className="stat-label">Priority</label>
                            <select className="projects-filter-select w-100" value={form.priority} onChange={e => set("priority", e.target.value)}>
                                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                        <div className="col-6">
                            <label className="stat-label">Assignee</label>
                            <select className="projects-filter-select w-100" value={form.assigneeId} onChange={e => set("assigneeId", e.target.value)}>
                                <option value="">Select Assignee</option>
                                {ASSIGNEES.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="col-6">
                            <label className="stat-label">Due Date</label>
                            <input type="date" className="projects-filter-select w-100" value={form.dueDate} onChange={e => set("dueDate", e.target.value)} />
                        </div>
                        <div className="col-6">
                            <label className="stat-label">Initial Status</label>
                            <select className="projects-filter-select w-100" value={form.status} onChange={e => set("status", e.target.value)}>
                                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end gap-2">
                        <button type="button" className="btn-review" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-upload">Create Task</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────
   UPDATE TASK MODAL (Assignee Only)
───────────────────────────────────────────────────────────────── */
function UpdateTaskModal({ task, onClose, onUpdate }) {
    const [status, setStatus] = useState(task.status);
    const [note, setNote] = useState("");

    const submit = (e) => {
        e.preventDefault();
        onUpdate(task.id, { status, note });
        onClose();
    };

    return (
        <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px"
        }} onClick={onClose}>
            <div style={{
                background: "#fff", borderRadius: "12px", width: "100%", maxWidth: "400px",
                padding: "24px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
            }} onClick={e => e.stopPropagation()}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="m-0" style={{ fontSize: "18px" }}>Update Progress</h3>
                    <button className="link-button" onClick={onClose}><FiX size={20} /></button>
                </div>
                <form onSubmit={submit}>
                    <div className="mb-3">
                        <label className="stat-label">Status</label>
                        <select className="projects-filter-select w-100" value={status} onChange={e => setStatus(e.target.value)}>
                            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="stat-label">Progress Note</label>
                        <textarea className="projects-filter-select w-100" style={{ minHeight: "80px" }} placeholder="Add a note about your progress..." value={note} onChange={e => setNote(e.target.value)} />
                    </div>
                    <div className="d-flex justify-content-end gap-2">
                        <button type="button" className="btn-review" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-upload">Save Update</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────
   TASKS TAB
───────────────────────────────────────────────────────────────── */
export default function TasksTab({ tasks, setTasks, logActivity }) {
    const [viewMode, setViewMode] = useState("board");
    const [userRole, setUserRole] = useState("recruiter"); // "recruiter" or "assignee"
    const [showAddModal, setShowAddModal] = useState(false);
    const [updateTask, setUpdateTask] = useState(null);

    const handleAdd = (task) => {
        setTasks(prev => [task, ...prev]);
        logActivity(`Created task: ${task.title}`);
    };

    const handleUpdate = (id, { status, note }) => {
        setTasks(prev => prev.map(t => {
            if (t.id === id) {
                if (status !== t.status) logActivity(`Moved task "${t.title}" to ${status}`);
                if (note) logActivity(`Note added to "${t.title}": ${note}`);
                return { ...t, status };
            }
            return t;
        }));
    };

    const handleDelete = (id) => {
        const task = tasks.find(t => t.id === id);
        setTasks(prev => prev.filter(t => t.id !== id));
        logActivity(`Deleted task: ${task.title}`);
    };

    return (
        <div>
            {/* Toolbar */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <div className="view-toggle1">
                    <button className={userRole === "recruiter" ? "toggle active" : "toggle"} onClick={() => setUserRole("recruiter")}>Recruiter View</button>
                    <button className={userRole === "assignee" ? "toggle active" : "toggle"} onClick={() => setUserRole("assignee")}>Assignee View</button>
                </div>
                <div className="d-flex gap-2">
                    <div className="view-toggle1">
                        <button className={viewMode === "board" ? "toggle active" : "toggle"} onClick={() => setViewMode("board")}><FiLayout size={14} /></button>
                        <button className={viewMode === "list" ? "toggle active" : "toggle"} onClick={() => setViewMode("list")}><FiList size={14} /></button>
                    </div>
                    {userRole === "recruiter" && (
                        <button className="btn-upload" onClick={() => setShowAddModal(true)}><FiPlus size={14} /> Add Task</button>
                    )}
                </div>
            </div>

            {/* Content */}
            {viewMode === "board" ? (
                <div className="row g-3">
                    {STATUSES.map(status => (
                        <div key={status} className="col-md-4">
                            <div style={{ background: "#f8fafc", borderRadius: "12px", padding: "16px", minHeight: "400px" }}>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h4 className="m-0" style={{ fontSize: "14px", fontWeight: 700, color: "#475569" }}>{status}</h4>
                                    <span className="status-tag status-progress" style={{ fontSize: "11px" }}>{tasks.filter(t => t.status === status).length}</span>
                                </div>
                                <div className="d-flex flex-column gap-2">
                                    {tasks.filter(t => t.status === status).map(task => (
                                        <div key={task.id} className="project-card" style={{ padding: "12px", gap: "8px" }}>
                                            <div className="d-flex justify-content-between align-items-start">
                                                <span style={{ fontSize: "13px", fontWeight: 600 }}>{task.title}</span>
                                                <div className="d-flex gap-1">
                                                    {userRole === "recruiter" && <button className="link-button text-danger" onClick={() => handleDelete(task.id)}><FiTrash2 size={12} /></button>}
                                                    {userRole === "assignee" && <button className="link-button text-primary" onClick={() => setUpdateTask(task)}><FiEdit2 size={12} /></button>}
                                                </div>
                                            </div>
                                            <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>{task.description}</p>
                                            <div className="d-flex justify-content-between align-items-center mt-2">
                                                <div className="d-flex align-items-center gap-1">
                                                    <span style={{ fontSize: "10px", fontWeight: 700, ...priorityColor(task.priority), padding: "2px 6px", borderRadius: "4px", textTransform: "uppercase" }}>
                                                        <PriorityIcon p={task.priority} /> {task.priority}
                                                    </span>
                                                </div>
                                                {getAssignee(task.assigneeId) && (
                                                    <img src={getAssignee(task.assigneeId).avatar} alt="" style={{ width: "24px", height: "24px", borderRadius: "50%" }} />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="tt-wrapper">
                    <table className="tt-table">
                        <thead className="tt-thead-tr">
                            <tr>
                                <th className="tt-th" style={{ textAlign: "left" }}>Task Name</th>
                                <th className="tt-th">Priority</th>
                                <th className="tt-th">Assignee</th>
                                <th className="tt-th">Due Date</th>
                                <th className="tt-th">Status</th>
                                {userRole !== "none" && <th className="tt-th">Action</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map(task => (
                                <tr key={task.id} className="tt-row">
                                    <td className="tt-td">
                                        <div style={{ fontWeight: 600 }}>{task.title}</div>
                                        <div style={{ fontSize: "12px", color: "#64748b" }}>{task.description}</div>
                                    </td>
                                    <td className="tt-td">
                                        <span style={{ fontSize: "11px", fontWeight: 700, ...priorityColor(task.priority), padding: "4px 8px", borderRadius: "6px", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                            <PriorityIcon p={task.priority} /> {task.priority}
                                        </span>
                                    </td>
                                    <td className="tt-td text-center">
                                        {getAssignee(task.assigneeId) ? (
                                            <img src={getAssignee(task.assigneeId).avatar} style={{ width: "28px", height: "28px", borderRadius: "50%" }} title={getAssignee(task.assigneeId).name} />
                                        ) : "—"}
                                    </td>
                                    <td className="tt-td text-center">{task.dueDate || "—"}</td>
                                    <td className="tt-td text-center">
                                        <div className="d-flex justify-content-center align-items-center gap-1">
                                            {statusIcon(task.status)}
                                            <span style={{ fontSize: "12px" }}>{task.status}</span>
                                        </div>
                                    </td>
                                    <td className="tt-td text-center">
                                        {userRole === "recruiter" && <button className="btn-chat text-danger" onClick={() => handleDelete(task.id)} style={{ padding: "4px", minWidth: "32px", height: "32px" }}><FiTrash2 size={14} /></button>}
                                        {userRole === "assignee" && <button className="btn-chat text-primary" onClick={() => setUpdateTask(task)} style={{ padding: "4px", minWidth: "32px", height: "32px" }}><FiEdit2 size={14} /></button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showAddModal && <AddTaskModal onClose={() => setShowAddModal(false)} onAdd={handleAdd} />}
            {updateTask && <UpdateTaskModal task={updateTask} onClose={() => setUpdateTask(null)} onUpdate={handleUpdate} />}
        </div>
    );
}
