import React from "react";
import ContractCard from "./ContractCard";
import ContractItem from "./ContractItem";
import "../ContractManagement/Styles/ContractManagement.css";

const stats = [
    { title: "Total Contracts", value: "2,456", percent: "+12.5%" },
    { title: "Active Contracts", value: "1,893", percent: "+8.2%" },
    { title: "Pending Review", value: "245", percent: "-2.4%" },
    { title: "Expiring Soon", value: "89", percent: "+5.7%" },
];

const contracts = [
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

export default function ContractManagement() {
    return (
        <>
            <div style={{ padding: "24px" }}>
                <div className="back-row">
                    <a className="back-link">Back to Dashboard</a>
                    <span className="breadcrumb">/ Contract Management</span>
                </div>
                <div className="cm-page">
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

                            {/* slider intentionally left with no class name -- styles target input[type="range"] */}
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

                    <main className="cm-main">
                        <header className="cm-top">
                            <div>
                                <h1 className="page-title">Contract Management</h1>
                                <p className="page-sub">Here's what's happening with your projects today</p>
                            </div>
                            <button className="btn-primary">+ New Contract</button>
                        </header>

                        <section className="stat-cards">
                            {stats.map((s, idx) => <ContractCard key={idx} {...s} />)}
                        </section>

                        <div className="list-controls">
                            <div className="view-icons">
                                <button className="icon-btn">▦</button>
                                <button className="icon-btn">▤</button>
                            </div>
                            <div className="sort">Sort by: Recent ▾</div>
                            <div className="showing">Showing {contracts.length} contracts</div>
                        </div>

                        <section className="contracts">
                            {contracts.map((c, i) => <ContractItem key={i} {...c} />)}
                        </section>
                    </main>
                </div>
            </div>
        </>

    );
}
