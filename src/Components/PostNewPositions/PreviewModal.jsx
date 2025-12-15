import React from "react";
import { FiX, FiLink, FiCopy, FiShare2 } from "react-icons/fi";
import "./PostNewPositions.css"; // same CSS file contains modal styles
import { useNavigate } from "react-router-dom";

export default function PreviewModal({ onClose, data }) {

const navigate = useNavigate();

    // build some nice defaults if blank
    const {
        jobTitle = "Senior Frontend Developer",
        companyName = "TechStream Solutions",
        location = "San Francisco, CA",
        employmentType = "Full-time",
        workModel = "Hybrid (3 days onsite)",
        salaryMin,
        salaryMax,
        currency = "USD",
        description = "",
        department = "Engineering",
        experienceLevel = "4+ years",
        skills = [],
        educationLevel = "Bachelor's degree",
        yearsExperience,
        additional,
    } = data;

    const salaryDisplay = (salaryMin || salaryMax) ? `${salaryMin || "—"} - ${salaryMax || "—"} ${currency}` : "$120,000 - $150,000 /year";

    return (
        <div className="modal-overlay">
            <div className="modal-window">
                <button className="modal-close" onClick={onClose}><FiX /></button>

                <div className="modal-inner">
                    <div className="modal-left">
                        <div className="modal-top-row">
                            <div className="modal-badge">TS</div>
                            <div>
                                <h2 className="modal-job-title">{jobTitle}</h2>
                                <div className="muted small">{companyName}</div>
                                <div className="modal-tags-row">
                                    <span className="tag small"><FiLink /> {location}</span>
                                    <span className="tag small">{employmentType}</span>
                                    <span className="tag small">{workModel}</span>
                                    <span className="tag small">{salaryDisplay}</span>
                                </div>
                            </div>
                        </div>

                        <hr className="modal-divider" />

                        <h4 className="modal-subtitle">Requirements</h4>
                        <div className="req-grid">
                            <div>
                                <div className="req-label">Experience</div>
                                <div className="req-value">{experienceLevel}</div>
                            </div>
                            <div>
                                <div className="req-label">Department</div>
                                <div className="req-value">{department}</div>
                            </div>
                            <div>
                                <div className="req-label">Education</div>
                                <div className="req-value">{educationLevel}</div>
                            </div>
                        </div>

                        <h4 className="modal-subtitle">Skills</h4>
                        <div className="status-tag status-progress">
                            {skills.length ? skills.map((s) => <span key={s} className="status-tag status-progress">{s}</span>)
                                : <span className="muted small">No skills provided</span>}
                        </div>

                        <h4 className="modal-subtitle" style={{ marginTop: 18 }}>Job Description</h4>
                        <div className="modal-description">
                            {description || (
                                <>
                                    TechStream Solutions is seeking an experienced Senior Frontend Developer to join our growing team. You will be responsible for building and maintaining high-quality web applications using modern JavaScript frameworks and libraries.
                                    <ul>
                                        <li>Develop user-facing features using React.js and related technologies</li>
                                        <li>Translate designs and wireframes into high-quality code</li>
                                        <li>Optimize components for maximum performance across web-capable devices and browsers</li>
                                    </ul>
                                    <strong>Qualifications:</strong>
                                    <ul>
                                        <li>4+ years of experience in frontend development</li>
                                        <li>Strong proficiency with JavaScript and React</li>
                                    </ul>
                                </>
                            )}
                        </div>

                        <h4 className="modal-subtitle" style={{ marginTop: 18 }}>Company Overview</h4>
                        <div className="modal-description small muted">
                            TechStream Solutions is a leading technology company specializing in building innovative digital products for enterprises and startups alike. With offices in San Francisco, New York, and London, we work with clients across the globe to deliver exceptional software solutions.
                        </div>
                    </div>

                    <aside className="modal-right">
                        <div className="share-card">
                            <h4 className="share-title">Share This Job</h4>

                            <div className="share-link">
                                <input readOnly value={`https://example.com/jobs/${encodeURI(jobTitle.replace(/\s+/g, "-").toLowerCase())}`} />
                                <button className="icon-btn"><FiCopy /></button>
                            </div>

                            <button className="share-btn"><FiShare2 /> Share on LinkedIn</button>
                            <button className="share-btn outline"><FiShare2 /> Share on Facebook</button>
                            <button className="share-btn outline"><FiShare2 /> Share via Email</button>

                            <div style={{ marginTop: 12 }}>
                                <div className="vendor-dropdown">
                                    <label className="muted small">Share with Vendors</label>
                                    <div className="vendor-list">
                                        <label><input type="checkbox" defaultChecked /> Premier Staffing Agency</label>
                                        <label><input type="checkbox" defaultChecked /> Tech Talent Finders</label>
                                        <label><input type="checkbox" defaultChecked /> DevHunters</label>
                                        <label><input type="checkbox" defaultChecked /> CodeSeeker Recruiting</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>

                <div className="modal-actions-left gap-3" style={{ padding: "24PX" }}>
                    <button className="btn-secondary" onClick={onClose}>Back to Edit</button>
                    <button onClick={()=>navigate("/user/user-find-vendor")} className="btn-primary" style={{width:"165px"}}>
                        Post Job Now
                    </button>
                </div>
            </div>
        </div>
    );
}
