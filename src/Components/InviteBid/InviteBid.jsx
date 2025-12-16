import React, { useState } from "react";
import {
    FiStar,
    FiDollarSign,
    FiCalendar,
    FiCheckSquare,
    FiArrowLeft,
    FiSend,
    FiSave,
    FiX,
} from "react-icons/fi";
import "./InviteBid.css";
import { useNavigate } from "react-router-dom";

export default function InviteBid() {
    const navigate = useNavigate();
    const [services, setServices] = useState({
        interview: false,
        onboarding: false,
    });
    const [project, setProject] = useState("");
    const [budget, setBudget] = useState("");
    const [deadline, setDeadline] = useState("");
    const [instructions, setInstructions] = useState("");

    const toggleService = (key) =>
        setServices((s) => ({ ...s, [key]: !s[key] }));

    const onSend = () => {
        // placeholder: integrate API here
        console.log({ project, services, budget, deadline, instructions });
        alert("Invite sent (demo)");
    };

    return (
        <div className="container mt-3 mb-3">
            <div className="nb-breadcrumbs">
                <button className="link-button" onClick={() => navigate("/user/user-dashboard")}><FiArrowLeft /> Back to Dashboard</button>
                <button className="link-button" onClick={() => navigate("/user/user-find-vendor")}><FiArrowLeft /> Find Vendor</button>
                <button className="link-button" onClick={() => navigate("/user/user-vendor-detail")}><FiArrowLeft /> Vendor Details</button>
                <span className="crumb">/ New Bid Invitation</span>
            </div>

            <div className="nb-content">
                {/* LEFT: FORM */}
                <div className="nb-form">
                    <h1 className="nb-title">New Bid Invitation</h1>
                    <p className="nb-sub">
                        Enter all necessary details to generate a new contract record
                    </p>

                    <label className="nb-label">Select Project</label>
                    <select
                        className="nb-select"
                        value={project}
                        onChange={(e) => setProject(e.target.value)}
                    >
                        <option value="">Select a project</option>
                        <option value="proj-1">Project Alpha</option>
                        <option value="proj-2">Project Beta</option>
                    </select>

                    <label className="nb-label">Select Services</label>
                    <div className="nb-checkboxes">
                        <label className="nb-checkbox">
                            <input
                                type="checkbox"
                                checked={services.interview}
                                onChange={() => toggleService("interview")}
                            />
                            Interview Panel
                        </label>

                        <label className="nb-checkbox">
                            <input
                                type="checkbox"
                                checked={services.onboarding}
                                onChange={() => toggleService("onboarding")}
                            />
                            Onboarding
                        </label>
                    </div>

                    <label className="nb-label">Estimated Budget</label>
                    <div className="nb-input-wrap">
                        <FiDollarSign className="input-icon" />
                        <input
                            className="nb-input"
                            placeholder="Enter amount"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                        />
                    </div>

                    <label className="nb-label">Proposal Deadline</label>
                    <div className="nb-input-wrap">
                        <FiCalendar className="input-icon" />
                        <input
                            className="nb-input"
                            placeholder="yyyy / mm / dd"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                        />
                    </div>

                    <label className="nb-label">Additional Instructions (Optional)</label>
                    <textarea
                        className="nb-textarea"
                        placeholder="Enter any specific requirements or instructions"
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                    />

                    <div className="nb-actions">
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => {
                                setProject("");
                                setServices({ interview: false, onboarding: false });
                                setBudget("");
                                setDeadline("");
                                setInstructions("");
                            }}
                        >
                         Cancel
                        </button>

                        <div className="right-actions">
                            <button type="button" className="btn-secondary gap-2">
                                <FiSave /> Save as Draft
                            </button>
                            <button type="button" className="btn-primary gap-2" onClick={onSend}>
                                <FiSend /> Send Invite
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT: VENDOR SUMMARY */}
                <aside className="nb-summary">
                    <div className="project-card">
                        <div className="project-header">
                            <img
                                src="https://i.pravatar.cc/100?img=12"
                                alt="vendor"
                                className="vendor-img"
                            />
                            <div className="vendor-meta">
                                <h3 className="vendor-name">Talent Bridge</h3>
                                <div className="rating-row">
                                    <span className="stars" aria-hidden>
                                        <FiStar />
                                    </span>
                                    <span className="rating-num">4.8</span>
                                </div>
                            </div>
                        </div>

                        <div className="vendor-body">
                            <div className="summary-item d-flex gap-3">
                                <div className="label">Average Response:</div>
                                <div className="value">2 hours</div>
                            </div>

                            <div className="summary-item">
                                <div className="label">Past Clients</div>
                                <div className="past-clients">
                                    <div className="client-badge">IL</div>
                                    <div className="client-name">Innovation Labs</div>
                                </div>
                                <div className="past-clients">
                                    <div className="client-badge">GT</div>
                                    <div className="client-name">Global Tech</div>
                                </div>
                            </div>

                            <p className="vendor-desc">
                                Specialized in providing high-quality talent acquisition and
                                onboarding services.
                            </p>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
