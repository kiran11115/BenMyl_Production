import React, { useState } from "react";
import { 
    Database, Search, Plus, Trash2, Edit2, 
    Globe, Briefcase, Code, Tag, Download,
    Filter, MoreVertical, CheckCircle2, X
} from "lucide-react";
import "./MasterData.css";
import ModuleHeader from "../ModuleHeader";

const CATEGORIES = [
    { id: "skills", name: "Skills List", icon: <Code size={20} />, count: 1240 },
    { id: "industries", name: "Industries", icon: <Briefcase size={20} />, count: 45 },
    { id: "locations", name: "Locations", icon: <Globe size={20} />, count: 180 },
    { id: "tags", name: "Tags & Categories", icon: <Tag size={20} />, count: 85 },
];

function MasterData() {
    const [selectedCategory, setSelectedCategory] = useState("skills");
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="master-data-container">
            <ModuleHeader 
                breadcrumb="Master Data"
                title="Master Data Management"
                description="Standardize and manage platform-wide datasets for skills, industries, and locations."
                badgeText="Data Synchronization"
                icon={Database}
                actions={[
                    { 
                        label: "Export CSV", 
                        icon: <Download size={16} />, 
                        type: "secondary",
                        onClick: () => console.log("Export")
                    },
                    { 
                        label: "Add New Entry", 
                        icon: <Plus size={16} />, 
                        type: "primary",
                        onClick: () => console.log("Add")
                    }
                ]}
            />

            <div className="master-data-layout">
                <aside className="category-sidebar">
                    {CATEGORIES.map((cat) => (
                        <div 
                            key={cat.id} 
                            className={`category-item ${selectedCategory === cat.id ? "active" : ""}`}
                            onClick={() => setSelectedCategory(cat.id)}
                        >
                            <div className="cat-icon">{cat.icon}</div>
                            <div className="cat-info">
                                <span className="cat-name">{cat.name}</span>
                                <span className="cat-count">{cat.count} entries</span>
                            </div>
                        </div>
                    ))}
                </aside>

                <main className="data-explorer">
                    <div className="explorer-toolbar">
                        <div className="search-bar">
                            <Search size={18} />
                            <input 
                                type="text" 
                                placeholder={`Search ${selectedCategory}...`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="toolbar-actions">
                            <button className="filter-pill">
                                <Filter size={14} />
                                Category
                            </button>
                            <button className="filter-pill">
                                <Filter size={14} />
                                Status
                            </button>
                        </div>
                    </div>

                    <div className="tt-wrapper">
                        <table className="tt-table">
                            <thead>
                                <tr className="tt-thead-tr">
                                    <th className="tt-th">Name</th>
                                    <th className="tt-th">Slug / Identifier</th>
                                    <th className="tt-th">Usage Count</th>
                                    <th className="tt-th">Status</th>
                                    <th className="tt-th">Last Updated</th>
                                    <th className="tt-th">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                    <tr key={i} className="tt-row">
                                        <td className="tt-td">
                                            <span className="data-name">
                                                {selectedCategory === "skills" ? "React.js" : 
                                                 selectedCategory === "industries" ? "FinTech" : 
                                                 selectedCategory === "locations" ? "Austin, TX" : "Hotlist"}
                                            </span>
                                        </td>
                                        <td className="tt-td" style={{ textAlign: "center" }}><code>{selectedCategory}-{i * 100}</code></td>
                                        <td className="tt-td" style={{ textAlign: "center" }}><span className="usage-stat">2.4k</span></td>
                                        <td className="tt-td" style={{ textAlign: "center" }}>
                                            <span className="status-badge active" style={{ fontSize: "10px", padding: "2px 8px" }}>Active</span>
                                        </td>
                                        <td className="tt-td" style={{ textAlign: "center", fontSize: "var(--text-xs)", color: "#64748b" }}>2 days ago</td>
                                        <td className="tt-td">
                                            <div className="row-actions" style={{ justifyContent: "center" }}>
                                                <button className="btn-icon"><Edit2 size={16} /></button>
                                                <button className="btn-icon text-red"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <footer className="explorer-footer">
                        <span className="pagination-info">Showing 1 to 20 of 1,240 entries</span>
                        <div className="pagination-btns">
                            <button className="page-btn">Previous</button>
                            <button className="page-btn active">1</button>
                            <button className="page-btn">2</button>
                            <button className="page-btn">3</button>
                            <button className="page-btn">Next</button>
                        </div>
                    </footer>
                </main>
            </div>
        </div>
    );
}

export default MasterData;
