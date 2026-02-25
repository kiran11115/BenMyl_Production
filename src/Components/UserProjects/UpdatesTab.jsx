import React, { useState } from "react";
import {
    FiSend,
    FiSmile,
    FiThumbsUp,
    FiHeart,
    FiZap,
    FiCheckCircle,
    FiActivity,
    FiUser,
    FiClock,
} from "react-icons/fi";

const REACTIONS = [
    { key: "thumbs", Icon: FiThumbsUp, color: "#3b82f6" },
    { key: "heart", Icon: FiHeart, color: "#ef4444" },
    { key: "fire", Icon: FiZap, color: "#f59e0b" },
    { key: "check", Icon: FiCheckCircle, color: "#10b981" },
];

const fmt = (iso) => {
    const date = new Date(iso);
    return date.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
};

function FeedEntry({ entry, onReact }) {
    const isSystem = entry.type === "system";

    if (isSystem) {
        return (
            <div className="d-flex align-items-center gap-2 mb-3 px-3">
                <div style={{ width: "24px", height: "1px", background: "#e2e8f0", flex: 1 }}></div>
                <div style={{ fontSize: "11px", color: "#94a3b8", display: "flex", alignItems: "center", gap: "6px" }}>
                    <FiActivity size={10} />
                    {entry.text} • {fmt(entry.createdAt)}
                </div>
                <div style={{ width: "24px", height: "1px", background: "#e2e8f0", flex: 1 }}></div>
            </div>
        );
    }

    return (
        <div className="project-card mb-3" style={{ padding: "16px", gap: "12px" }}>
            <div className="d-flex gap-3">
                {entry.avatar ? (
                    <img src={entry.avatar} alt={entry.name} style={{ width: "36px", height: "36px", borderRadius: "50%" }} />
                ) : (
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <FiUser size={18} color="#64748b" />
                    </div>
                )}
                <div style={{ flex: 1 }}>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <span style={{ fontSize: "14px", fontWeight: 700, color: "#1e293b" }}>{entry.name}</span>
                        <span style={{ fontSize: "11px", color: "#94a3b8" }}>{fmt(entry.createdAt)}</span>
                    </div>
                    <p style={{ fontSize: "13px", color: "#475569", margin: "0 0 12px 0", lineHeight: 1.6 }}>{entry.text}</p>

                    <div className="d-flex align-items-center gap-2">
                        {REACTIONS.map(({ key, Icon, color }) => {
                            const count = entry.reactions?.[key] || 0;
                            const hasReacted = entry.reactedBy?.includes(key);
                            return (
                                <button
                                    key={key}
                                    style={{
                                        border: hasReacted ? `1px solid ${color}` : "1px solid #e2e8f0",
                                        background: hasReacted ? `${color}10` : "transparent",
                                        borderRadius: "6px",
                                        padding: "3px 8px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                        cursor: "pointer",
                                        transition: "all 0.2s"
                                    }}
                                    onClick={() => onReact(entry.id, key)}
                                >
                                    <Icon size={12} color={hasReacted ? color : "#94a3b8"} />
                                    {count > 0 && <span style={{ fontSize: "11px", fontWeight: 600, color: hasReacted ? color : "#64748b" }}>{count}</span>}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function UpdatesTab({ feed, setFeed }) {
    const [comment, setComment] = useState("");

    const handleSend = () => {
        if (!comment.trim()) return;
        const newEntry = {
            id: Date.now(),
            type: "comment",
            name: "You",
            avatar: null,
            text: comment.trim(),
            createdAt: new Date().toISOString(),
            reactions: {},
            reactedBy: [],
        };
        setFeed(prev => [newEntry, ...prev]);
        setComment("");
    };

    const handleReact = (id, key) => {
        setFeed(prev => prev.map(e => {
            if (e.id === id) {
                const reactedBy = e.reactedBy || [];
                const reactions = e.reactions || {};
                const hasReacted = reactedBy.includes(key);

                return {
                    ...e,
                    reactedBy: hasReacted ? reactedBy.filter(r => r !== key) : [...reactedBy, key],
                    reactions: {
                        ...reactions,
                        [key]: hasReacted ? (reactions[key] || 1) - 1 : (reactions[key] || 0) + 1
                    }
                };
            }
            return e;
        }));
    };

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div className="project-card mb-4" style={{ padding: "16px", gap: "12px" }}>
                <h4 className="m-0 d-flex align-items-center gap-2" style={{ fontSize: "15px", fontWeight: 700 }}>
                    <FiSend size={14} /> Post an Update
                </h4>
                <textarea
                    className="projects-filter-select w-100"
                    placeholder="Write a comment or share progress..."
                    style={{ minHeight: "100px", borderRadius: "8px", padding: "12px" }}
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                />
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex gap-2">
                        <button className="link-button"><FiSmile size={16} /></button>
                    </div>
                    <button className="btn-upload" onClick={handleSend} disabled={!comment.trim()}>Send Update</button>
                </div>
            </div>

            <div className="d-flex flex-column gap-2">
                {feed.map(entry => (
                    <FeedEntry key={entry.id} entry={entry} onReact={handleReact} />
                ))}
            </div>
        </div>
    );
}
