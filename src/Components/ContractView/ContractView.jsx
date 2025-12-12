import React, { useState, useMemo } from "react";
import {
    FiChevronLeft,
    FiFileText,
    FiCalendar,
    FiTag,
    FiUser,
    FiDownload,
    FiBell,
    FiX,
    FiClock,
    FiUpload,
    FiFile,
    FiEdit2,
    FiArrowLeft,
} from "react-icons/fi";
import "./ContractView.css";
import { useNavigate } from "react-router-dom";

function Tag({ children }) {
    return <span className="cv-tag">{children}</span>;
}

function InfoItem({ icon, title, value }) {
    return (
        <div className="cv-info-item">
            <div className="cv-info-icon">{icon}</div>
            <div>
                <div className="cv-info-title">{title}</div>
                <div className="cv-info-value">{value}</div>
            </div>
        </div>
    );
}

/* ---------- Tab content small components ---------- */

function OverviewTab({ contract }) {
    return (
        <>
            <div className="cv-card">
                <h3 className="cv-card-title">Contract Description</h3>
                <p className="cv-card-text">{contract.description}</p>
            </div>

            <div style={{ height: 12 }} />

            <div className="cv-card">
                <h3 className="cv-card-title">Key Clauses</h3>

                <div className="cv-clause">
                    <div className="cv-clause-title">Termination Terms</div>
                    <div className="cv-clause-sub">30 days notice required</div>
                </div>

                <div className="cv-clause">
                    <div className="cv-clause-title">Renewal Policy</div>
                    <div className="cv-clause-sub">Auto-renewal with 60 days notice</div>
                </div>

                <div className="cv-clause">
                    <div className="cv-clause-title">Confidentiality</div>
                    <div className="cv-clause-sub">NDA included</div>
                </div>

                <div className="cv-clause">
                    <div className="cv-clause-title">Payment Terms</div>
                    <div className="cv-clause-sub">Net 30 days</div>
                </div>
            </div>
        </>
    );
}

function TimelineTab({ timeline }) {
    if (!timeline?.length) return <div className="cv-card">No timeline events.</div>;
    return (
        <div className="cv-card">
            <h3 className="cv-card-title">Timeline</h3>
            <ul className="cv-timeline">
                {timeline.map((t, i) => (
                    <li key={i} className="cv-timeline-item">
                        <div className="cv-timeline-date">{t.date}</div>
                        <div className="cv-timeline-body">
                            <div className="cv-timeline-title">{t.title}</div>
                            <div className="cv-timeline-desc">{t.desc}</div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function ActivityLogTab({ activity }) {
    if (!activity?.length) return <div className="cv-card">No activity yet.</div>;
    return (
        <div className="cv-card">
            <h3 className="cv-card-title">Activity Log</h3>
            <ul className="cv-activity">
                {activity.map((a, i) => (
                    <li key={i} className="cv-activity-item">
                        <div className="cv-activity-left">
                            <div className="cv-activity-user">{a.user}</div>
                            <div className="cv-activity-time">{a.time}</div>
                        </div>
                        <div className="cv-activity-right">{a.action}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function DocumentsTab({ documents, onUpload }) {
    return (
        <div className="cv-card">
            <h3 className="cv-card-title">Documents</h3>

            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                <label className="cv-upload">
                    <FiUpload style={{ marginRight: 8 }} />
                    Upload
                    <input
                        type="file"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) onUpload(file);
                            e.target.value = "";
                        }}
                    />
                </label>

                <div className="cv-doc-count">{documents.length} file(s)</div>
            </div>

            <ul className="cv-doc-list">
                {documents.map((d, i) => (
                    <li key={i} className="cv-doc-item">
                        <div className="cv-doc-meta">
                            <FiFile style={{ marginRight: 8 }} />
                            <div>
                                <div className="cv-doc-name">{d.name}</div>
                                <div className="cv-doc-sub">{d.size}</div>
                            </div>
                        </div>

                        <div>
                            <a className="cv-doc-action" href={d.url} target="_blank" rel="noopener noreferrer">
                                Preview
                            </a>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function NotesTab({ notes, onChange, onSave, onClear }) {
    return (
        <div className="cv-card">
            <h3 className="cv-card-title">Notes</h3>
            <textarea
                className="cv-notes"
                value={notes}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Write notes about this contract..."
            />
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
                <button className="btn-secondary" onClick={onClear}>
                    Clear
                </button>
                <button className="btn-primary" onClick={onSave}>
                    Save Notes
                </button>
            </div>
        </div>
    );
}

/* ---------- Main component ---------- */

export default function ContractView() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("overview"); // overview|timeline|activity|documents|notes

    // sample contract + sample data for tabs
    const contract = useMemo(
        () => ({
            title: "Software License Agreement",
            id: "SLA-2025-0049",
            status: "Active",
            contractType: "Service",
            department: "Legal",
            value: "$28,500",
            manager: "Michael Chen",
            duration: "Feb 1, 2024 – Jan 31, 2025",
            parties: ["Internal: Legal, Sales", "External: TechCorp Solutions"],
            description:
                "This Service Level Agreement (SLA) establishes the terms and conditions under which TechCorp Solutions will provide IT infrastructure maintenance and support services. The agreement covers system uptime guarantees, response time commitments, and service quality metrics. This contract includes regular maintenance, emergency support, and quarterly performance reviews.",
            tags: ["Renewal", "Important", "Pending Approval"],
            progress: 75,
            deadline: "Jan 31, 2025",
        }),
        []
    );

    const timeline = useMemo(
        () => [
            { date: "Jan 10, 2025", title: "Contract Reviewed", desc: "Legal reviewed terms and requested changes." },
            { date: "Dec 20, 2024", title: "Signed by Vendor", desc: "Vendor representative signed the agreement." },
            { date: "Nov 12, 2024", title: "Draft Created", desc: "Initial draft created by legal team." },
        ],
        []
    );

    const activity = useMemo(
        () => [
            { user: "Michael Chen", time: "2 hours ago", action: "Updated contract value to $28,500" },
            { user: "Sarah Wilson", time: "3 days ago", action: "Uploaded NDA document" },
            { user: "Admin", time: "Jan 15, 2025", action: "Marked as Active" },
        ],
        []
    );

    // documents state (local) - in real app these would come from API
    const [documents, setDocuments] = useState([
        {
            name: "SLA_v1.pdf",
            size: "1.2 MB",
            url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        },
    ]);

    function handleUpload(file) {
        // create URL for preview - in real app you'd upload to server
        const url = URL.createObjectURL(file);
        setDocuments((d) => [
            ...d,
            { name: file.name, size: `${(file.size / 1024 / 1024).toFixed(2)} MB`, url },
        ]);
    }

    // notes state
    const [notes, setNotes] = useState("These are sample notes. Edit and save.");

    function handleSaveNotes() {
        // stub: persist to API
        alert("Notes saved (implement API).");
    }

    return (
        <div className="cv-page">
            <div className="cv-container">
                <div className="cv-breadcrumbs">
                    <button className="link-button" onClick={() => navigate("/user/user-dashboard")}><FiArrowLeft /> Back to Dashboard</button>
                    <button className="link-button" onClick={() => navigate("/user/user-contract-management")}><FiArrowLeft /> Contract Management</button>
                    <span className="crumb">/ Contract View</span>
                </div>

                <div className="cv-layout">
                    {/* left */}
                    <main className="cv-left">
                        <section className="cv-top-card">
                            <div className="cv-top-left">
                                <div className="cv-title-row">
                                    <h1 className="cv-main-title">{contract.title}</h1>
                                    <span className={`cv-status-pill ${contract.status.toLowerCase()}`}>{contract.status}</span>
                                </div>

                                <div className="cv-subtext">
                                    Contract ID: <strong>{contract.id}</strong>
                                </div>

                                <div className="cv-top-grid">
                                    <div className="cv-grid-col">
                                        <InfoItem icon={<FiFileText />} title="Contract Type" value={contract.contractType} />
                                        <InfoItem icon={<FiFileText />} title="Contract Value" value={contract.value} />
                                        <InfoItem icon={<FiCalendar />} title="Contract Duration" value={contract.duration} />
                                    </div>

                                    <div className="cv-grid-col">
                                        <InfoItem icon={<FiFileText />} title="Department" value={contract.department} />
                                        <InfoItem icon={<FiUser />} title="Assigned Manager" value={contract.manager} />
                                        <InfoItem icon={<FiTag />} title="Parties" value={contract.parties.join(", ")} />
                                    </div>
                                </div>

                                <div className="cv-tags-row">{contract.tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>
                            </div>
                        </section>

                        {/* tabs */}
                        <nav className="cv-tabs" role="tablist" aria-label="Contract tabs">
                            <button
                                className={`cv-tab ${activeTab === "overview" ? "active" : ""}`}
                                onClick={() => setActiveTab("overview")}
                                role="tab"
                                aria-selected={activeTab === "overview"}
                            >
                                Overview
                            </button>

                            <button
                                className={`cv-tab ${activeTab === "timeline" ? "active" : ""}`}
                                onClick={() => setActiveTab("timeline")}
                                role="tab"
                                aria-selected={activeTab === "timeline"}
                            >
                                Timeline
                            </button>

                            <button
                                className={`cv-tab ${activeTab === "activity" ? "active" : ""}`}
                                onClick={() => setActiveTab("activity")}
                                role="tab"
                                aria-selected={activeTab === "activity"}
                            >
                                Activity Log
                            </button>

                            <button
                                className={`cv-tab ${activeTab === "documents" ? "active" : ""}`}
                                onClick={() => setActiveTab("documents")}
                                role="tab"
                                aria-selected={activeTab === "documents"}
                            >
                                Documents
                            </button>

                            <button
                                className={`cv-tab ${activeTab === "notes" ? "active" : ""}`}
                                onClick={() => setActiveTab("notes")}
                                role="tab"
                                aria-selected={activeTab === "notes"}
                            >
                                Notes
                            </button>
                        </nav>

                        {/* tab panels */}
                        <section className="cv-content">
                            <div className="cv-content-left">
                                {/* render panels conditionally */}
                                {activeTab === "overview" && <OverviewTab contract={contract} />}

                                {activeTab === "timeline" && <TimelineTab timeline={timeline} />}

                                {activeTab === "activity" && <ActivityLogTab activity={activity} />}

                                {activeTab === "documents" && <DocumentsTab documents={documents} onUpload={handleUpload} />}

                                {activeTab === "notes" && (
                                    <NotesTab
                                        notes={notes}
                                        onChange={setNotes}
                                        onSave={() => {
                                            handleSaveNotes();
                                        }}
                                        onClear={() => setNotes("")}
                                    />
                                )}
                            </div>

                            {/* Right side (Key Clauses) stays visible in left column as in your design */}
                            <aside className="cv-content-right">
                                <div className="cv-card">
                                    <h3 className="cv-card-title">Key Clauses</h3>

                                    <div className="cv-clause">
                                        <div className="cv-clause-title">Termination Terms</div>
                                        <div className="cv-clause-sub">30 days notice required</div>
                                    </div>

                                    <div className="cv-clause">
                                        <div className="cv-clause-title">Renewal Policy</div>
                                        <div className="cv-clause-sub">Auto-renewal with 60 days notice</div>
                                    </div>

                                    <div className="cv-clause">
                                        <div className="cv-clause-title">Confidentiality</div>
                                        <div className="cv-clause-sub">NDA included</div>
                                    </div>

                                    <div className="cv-clause">
                                        <div className="cv-clause-title">Payment Terms</div>
                                        <div className="cv-clause-sub">Net 30 days</div>
                                    </div>
                                </div>
                            </aside>
                        </section>
                    </main>

                    {/* right sticky sidebar */}
                    <aside className="cv-right">
                        <div className="cv-right-inner">
                            <div className="cv-quick-actions">
                                <div className="cv-qa-title">Quick Actions</div>
                                <button className="cv-qa-btn">
                                    <FiX /> <span>Terminate Contract</span>
                                </button>
                                <button className="cv-qa-btn">
                                    <FiDownload /> <span>Export PDF</span>
                                </button>
                                <button className="cv-qa-btn">
                                    <FiBell /> <span>Set Reminder</span>
                                </button>
                            </div>

                            <div className="cv-status-card">
                                <div className="cv-status-label">Status</div>
                                <div className="cv-progress-bar">
                                    <div className="cv-progress-fill" style={{ width: `${contract.progress}%` }} />
                                </div>
                                <div className="cv-progress-text">{contract.progress}% Complete</div>

                                <div className="cv-deadline">
                                    <div className="cv-deadline-label">Deadline</div>
                                    <div className="cv-deadline-date">
                                        <FiCalendar /> <span>{contract.deadline}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
