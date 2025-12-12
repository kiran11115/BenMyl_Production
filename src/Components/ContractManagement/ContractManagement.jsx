import React, { useMemo, useState } from "react";
import { FiGrid, FiList, FiChevronDown, FiClock, FiChevronLeft, FiArrowLeft } from "react-icons/fi";
import ContractCard from "./ContractCard";
import ContractItem from "./ContractItem";
import "./Styles/ContractManagement.css"; // adjust path if needed
import { useNavigate } from "react-router-dom";

const stats = [
    { title: "Total Contracts", value: "2,456", percent: "+12.5%" },
    { title: "Active Contracts", value: "1,893", percent: "+8.2%" },
    { title: "Pending Review", value: "245", percent: "-2.4%" },
    { title: "Expiring Soon", value: "89", percent: "+5.7%" },
];

const initialContracts = [
    {
        title: "Software License Agreement",
        amount: "$45,000",
        date: "Jan 15, 2024 - Jan 14, 2025",
        status: "Active",
        user: "Sarah Wilson",
        avatar: "https://i.pravatar.cc/40?img=12",
    },
    {
        title: "Service Level Agreement",
        amount: "$28,500",
        date: "Feb 1, 2024 - Jan 31, 2025",
        status: "Pending",
        user: "Michael Chen",
        avatar: "https://i.pravatar.cc/40?img=5",
    },
    {
        title: "Vendor Agreement",
        amount: "$12,800",
        date: "Jan 1, 2023 - Dec 31, 2023",
        status: "Expired",
        user: "Emily Rodriguez",
        avatar: "https://i.pravatar.cc/40?img=8",
    },
    {
        title: "Partnership Agreement",
        amount: "$75,000",
        date: "Mar 1, 2024 - Feb 28, 2025",
        status: "Active",
        user: "David Kim",
        avatar: "https://i.pravatar.cc/40?img=15",
    },
    {
        title: "Non-Disclosure Agreement",
        amount: "$5,000",
        date: "Jan 20, 2024 - Jan 19, 2025",
        status: "Active",
        user: "Lisa Thompson",
        avatar: "https://i.pravatar.cc/40?img=20",
    },
];

function parseStartDate(rangeStr) {
    // Parses left side like "Jan 15, 2024 - Jan 14, 2025"
    const left = String(rangeStr || "").split("-")[0].trim();
    const d = new Date(left);
    if (!isNaN(d)) return d;
    // fallback parse
    const parsed = Date.parse(left);
    return isNaN(parsed) ? new Date(0) : new Date(parsed);
}

export default function ContractManagement() {
    const navigate = useNavigate();
    const [view, setView] = useState("list"); // 'list' or 'grid'
    const [sort, setSort] = useState("recent"); // 'recent' or 'oldest'
    const [showSortMenu, setShowSortMenu] = useState(false);

    const contracts = initialContracts; // replace with props or API data if needed

    const sortedContracts = useMemo(() => {
        const arr = [...contracts];
        arr.sort((a, b) => {
            const da = parseStartDate(a.date).getTime();
            const db = parseStartDate(b.date).getTime();
            return sort === "recent" ? db - da : da - db;
        });
        return arr;
    }, [contracts, sort]);

    return (
        <div style={{ padding: 24 }}>
            <div className="back-row">
                <button className="link-button" onClick={() => navigate("/user/user-dashboard")}><FiArrowLeft /> Back to Dashboard</button>
                <span className="crumb">/ Contract Management</span>
            </div>

            <div className="cm-page">
                {/* SIDEBAR */}
                <aside className="cm-sidebar">
                    <div className="filters">
                        <h4 className="filter-heading">Status</h4>
                        <label className="chk"><input type="checkbox" /> <span>Active</span></label>
                        <label className="chk"><input type="checkbox" /> <span>Pending</span></label>
                        <label className="chk"><input type="checkbox" /> <span>Expired</span></label>
                        <label className="chk"><input type="checkbox" /> <span>All</span></label>

                        <h4 className="filter-heading">Contract Time</h4>
                        <label className="chk"><input type="checkbox" /> <span>License</span></label>
                        <label className="chk"><input type="checkbox" /> <span>Service</span></label>
                        <label className="chk"><input type="checkbox" /> <span>Partnership</span></label>
                        <label className="chk"><input type="checkbox" /> <span>NDA</span></label>
                        <label className="chk"><input type="checkbox" /> <span>All</span></label>

                        <h4 className="filter-heading">Department</h4>
                        <label className="chk"><input type="checkbox" /> <span>Legal</span></label>
                        <label className="chk"><input type="checkbox" /> <span>Sales</span></label>
                        <label className="chk"><input type="checkbox" /> <span>IT</span></label>
                        <label className="chk"><input type="checkbox" /> <span>All</span></label>

                        <h4 className="filter-heading">Date Range</h4>
                        <div className="slider-row">
                            <input type="range" min="0" max="100" defaultValue="20" />
                            <div className="slider-labels">
                                <span>30 Days</span>
                                <span>All Time</span>
                            </div>
                        </div>

                        <button className="apply-filters">Apply Filters</button>
                    </div>
                </aside>

                {/* MAIN */}
                <main className="cm-main">
                    <header className="cm-top">
                        <div>
                            <h1 className="page-title">Contract Management</h1>
                            <p className="page-sub">Here's what's happening with your projects today</p>
                        </div>
                        <button
                        onClick={()=>navigate("/user/create-new-contract")}
                            className="border-0 rounded-2 fw-semibold"
                            style={{
                                background: "#2563EB",
                                color: "#fff",
                                padding: "10px 20px",
                                fontSize: "14px"
                            }}>
                            + New Contract
                        </button>
                    </header>

                    <section className="stat-cards">
                        {stats.map((s, i) => <ContractCard key={i} {...s} />)}
                    </section>

                    <div className="list-controls">
                        <div className="view-icons">
                            <button
                                title="Grid view"
                                className={`icon-btn ${view === "grid" ? "active" : ""}`}
                                onClick={() => setView("grid")}
                            >
                                <FiGrid size={16} />
                            </button>
                            <button
                                title="List view"
                                className={`icon-btn ${view === "list" ? "active" : ""}`}
                                onClick={() => setView("list")}
                            >
                                <FiList size={16} />
                            </button>
                        </div>

                        <div className="sort" style={{ position: "relative" }}>
                            <button
                                className="sort-btn"
                                onClick={() => setShowSortMenu((s) => !s)}
                            >
                                <FiClock style={{ marginRight: 8 }} />
                                Sort by: {sort === "recent" ? "Recent" : "Oldest"}
                                <FiChevronDown style={{ marginLeft: 8 }} />
                            </button>

                            {showSortMenu && (
                                <div className="sort-dropdown" onMouseLeave={() => setShowSortMenu(false)}>
                                    <button
                                        className={`sort-item ${sort === "recent" ? "selected" : ""}`}
                                        onClick={() => { setSort("recent"); setShowSortMenu(false); }}
                                    >
                                        Recent
                                    </button>
                                    <button
                                        className={`sort-item ${sort === "oldest" ? "selected" : ""}`}
                                        onClick={() => { setSort("oldest"); setShowSortMenu(false); }}
                                    >
                                        Oldest
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="showing">Showing {sortedContracts.length} contracts</div>
                    </div>

                    <section className={`contracts ${view === "grid" ? "grid-view" : ""}`}>
                        {sortedContracts.map((c, i) => <ContractItem key={i} {...c} />)}
                    </section>
                </main>
            </div>
        </div>
    );
}
