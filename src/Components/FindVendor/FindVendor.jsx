import React, { useState } from "react";
import {
    FiSearch,
    FiChevronLeft,
    FiArrowLeft,
    FiMapPin,
    FiClock,
    FiUsers,
    FiCalendar,
    FiMessageCircle,
    FiStar,
} from "react-icons/fi";
import "./FindVendor.css";
import { useNavigate } from "react-router-dom";

const VENDORS = [
    {
        id: 1,
        name: "HR Solutions Pro",
        rating: 4.6,
        reviews: 120,
        avatar: "https://i.pravatar.cc/60?img=32",
        services: ["Resume Screening", "Background Check"],
        avgResponse: "Avg. 1 hr response",
        clients: "Digital Dynamics, Tech Solutions Inc",
        budget: "$3,000 - $15,000",
    },
    {
        id: 2,
        name: "Talent Bridge",
        rating: 4.8,
        reviews: 89,
        avatar: "https://i.pravatar.cc/60?img=12",
        services: ["Interview Panel", "Onboarding"],
        avgResponse: "Avg. 2 hrs response",
        clients: "Innovation Labs, Global Tech",
        budget: "$5,000 - $20,000",
    },
    {
        id: 3,
        name: "Hire Right",
        rating: 4.7,
        reviews: 156,
        avatar: "https://i.pravatar.cc/60?img=5",
        services: ["Contracting", "Compliance"],
        avgResponse: "Avg. 30 min response",
        clients: "Future Corp, Tech Giants",
        budget: "$4,000 - $18,000",
    },
];

export default function VendorSearchPage() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [budget, setBudget] = useState(12000);
    const [showFiltersMobile, setShowFiltersMobile] = useState(false);

    const filtered = VENDORS.filter((v) =>
        (v.name + v.services.join(" ")).toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="vs-page">
            <div className="vs-top">
                <div className="vs-breadcrumbs">
                    <button className="link-button" onClick={() => navigate("/user/user-dashboard")}><FiArrowLeft /> Back to dashboard</button>
                    <span className="crumb">/ Job Posting</span>
                </div>

                <div className="vs-search">
                    <div className="search-box">
                        <FiSearch className="search-icon" />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by Vendor Name or Service"
                        />
                    </div>
                    <button className="btn-primary">Find Vendor</button>
                </div>
            </div>

            <div className="vs-content">
                <aside className={`vs-filters ${showFiltersMobile ? "open" : ""}`}>
                    <h3>Filters</h3>

                    <div className="fg">
                        <div className="fg-title">Service Type</div>
                        <div className="fg-body">
                            <label><input type="checkbox" /> Resume Screening</label>
                            <label><input type="checkbox" /> Background Check</label>
                            <label><input type="checkbox" /> Contracting Services</label>
                            <label><input type="checkbox" /> Interview Panel</label>
                            <label><input type="checkbox" /> Onboarding / Compliance</label>
                            <label><input type="checkbox" /> Custom</label>
                        </div>
                    </div>

                    <div className="fg">
                        <div className="fg-title">Minimum Rating</div>
                        <div className="fg-body rating-icons">
                            <FiStar /> <FiStar /> <FiStar /> <FiStar /> <FiStar />
                        </div>
                    </div>

                    <div className="fg">
                        <div className="fg-title">Location</div>
                        <div className="fg-body">
                            <div className="loc-input"><FiMapPin /> <input placeholder="Select location" /></div>
                        </div>
                    </div>

                    <div className="fg">
                        <div className="fg-title">Availability</div>
                        <div className="fg-body">
                            <label><input type="radio" name="avail" /> Immediate</label>
                            <label><input type="radio" name="avail" /> Within 1 Week</label>
                            <label><input type="radio" name="avail" /> Custom Range</label>
                        </div>
                    </div>

                    <div className="fg">
                        <div className="fg-title">Budget Range</div>
                        <div className="fg-body">
                            <input type="range" min={0} max={50000} value={budget} onChange={(e) => setBudget(Number(e.target.value))} />
                            <div className="budget-row"><span>$0</span><strong>${budget.toLocaleString()}</strong><span>$50,000</span></div>
                        </div>
                    </div>

                    <button className="apply">Apply Filters</button>
                </aside>

                <main className="vs-results">
                    {filtered.map((v) => (
                        <div className="vendor-card" key={v.id}>
                            <div className="left">
                                <img className="v-avatar" src={v.avatar} alt="avatar" />
                                <div className="v-info">
                                    <div className="v-header">
                                        <h4>{v.name}</h4>
                                        <div className="v-stars">{v.rating} <span className="muted">/ 5 ({v.reviews} reviews)</span></div>
                                    </div>

                                    <div className="v-tags">
                                        {v.services.map((s) => <span key={s} className="tag">{s}</span>)}
                                    </div>

                                    <div className="v-meta">
                                        <span className="meta-item"><FiClock /> {v.avgResponse}</span>
                                        <span className="meta-item muted">· Past clients: {v.clients}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="right">
                                <div className="budget">{v.budget}</div>
                                <div className="actions">
                                    <button className="btn-outline" onClick={() => navigate("/user/user-vendor-detail")}>View Profile</button>
                                    <button className="btn-primary small" onClick={() => navigate("/user/user-invite-bid")}>Invite to Bid</button>
                                </div>
                                <FiMessageCircle className="msg-icon" />
                            </div>
                        </div>
                    ))}
                </main>

                <aside className="vs-widgets">
                    <div className="card top-vendors">
                        <h4>Top Vendors</h4>
                        <ul>
                            {VENDORS.map((t) => (
                                <li key={t.id}>
                                    <img src={t.avatar} alt="a" />
                                    <div>
                                        <div className="tv-name">{t.name}</div>
                                        <div className="tv-rating">{t.rating}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="card graph">
                        <h4>Average Spend</h4>
                        <div className="graph-box">(chart)</div>
                    </div>

                    <div className="card invites">
                        <h4>Recent Invites</h4>
                        <ul>
                            {VENDORS.map((v) => (
                                <li key={v.id}><div className="cal">📅</div><div><div>{v.name}</div><div className="muted small">Invited 2 days ago</div></div></li>
                            ))}
                        </ul>
                    </div>
                </aside>
            </div>

            <button className="mobile-toggle" onClick={() => setShowFiltersMobile(!showFiltersMobile)}>{showFiltersMobile ? 'Close' : 'Filters'}</button>
        </div>
    );
}
