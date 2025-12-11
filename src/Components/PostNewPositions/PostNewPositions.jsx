import React, { useState } from "react";
import {
    FiArrowLeft,
    FiMapPin,
    FiClock,
    FiDollarSign,
    FiBriefcase,
    FiLink,
    FiCopy,
} from "react-icons/fi";
import PreviewModal from "./PreviewModal";
import "./PostNewPositions.css";
import { useNavigate } from "react-router-dom";

export default function PostNewPositions() {

    const navigate = useNavigate(); 

    // Basic Info
    const [jobTitle, setJobTitle] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [location, setLocation] = useState("");
    const [employmentType, setEmploymentType] = useState("");
    const [workModel, setWorkModel] = useState("");
    const [salaryMin, setSalaryMin] = useState("");
    const [salaryMax, setSalaryMax] = useState("");
    const [currency, setCurrency] = useState("USD");

    // Job Details
    const [description, setDescription] = useState("");
    const [department, setDepartment] = useState("");
    const [experienceLevel, setExperienceLevel] = useState("");

    // Requirements
    const [skillInput, setSkillInput] = useState("");
    const [skills, setSkills] = useState([]);
    const [educationLevel, setEducationLevel] = useState("");
    const [yearsExperience, setYearsExperience] = useState("");
    const [additional, setAdditional] = useState("");

    // modal open
    const [openPreview, setOpenPreview] = useState(false);

    // Step helpers (determine if each step is "complete")
    const step1Complete =
        jobTitle.trim() &&
        companyName.trim() &&
        location.trim() &&
        employmentType.trim();

    const step2Complete = description.trim();

    const step3Complete = skills.length > 0;

    function addSkillFromInput() {
        const v = skillInput.trim();
        if (!v) return;
        if (!skills.includes(v)) setSkills((s) => [...s, v]);
        setSkillInput("");
    }

    function removeSkill(tag) {
        setSkills((s) => s.filter((x) => x !== tag));
    }

    function onClickPostJob() {
        // require all steps to be complete to preview
        if (!step1Complete || !step2Complete || !step3Complete) {
            // scroll to top and highlight incomplete? simple alert for now
            window.scrollTo({ top: 0, behavior: "smooth" });
            alert("Please complete all steps (Basic Info, Job Details, Requirements) before previewing.");
            return;
        }
        setOpenPreview(true);
    }

    function resetForm() {
        setJobTitle("");
        setCompanyName("");
        setLocation("");
        setEmploymentType("");
        setWorkModel("");
        setSalaryMin("");
        setSalaryMax("");
        setCurrency("USD");
        setDescription("");
        setDepartment("");
        setExperienceLevel("");
        setSkillInput("");
        setSkills([]);
        setEducationLevel("");
        setYearsExperience("");
        setAdditional("");
    }

    return (
        <div className="job-page">
            <div className="top">
                <button className="link-button" onClick={()=>navigate("/user/user-dashboard")}><FiArrowLeft /> Back to dashboard</button>
                <span className="crumb">/ Job Posting</span>
            </div>

            <div className="job-container">
                <h1>Creating New Job Posting</h1>
                <p className="muted">Here's what's happening with your projects today</p>

                <div className="steps">
                    <Step number={1} label="Basic Info" active={true} complete={!!step1Complete} />
                    <Step number={2} label="Details" active={true} complete={!!step2Complete} />
                    <Step number={3} label="Requirements" active={true} complete={!!step3Complete} />
                    <Step number={4} label="Review" active={false} complete={false} />
                </div>

                <div className="job-layout">
                    <div className="job-main">
                        <section className="card">
                            <h3 className="section-title">Basic Information</h3>

                            <div className="form-row">
                                <div className="field full">
                                    <label>Job Title <span className="req">*</span></label>
                                    <input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Senior Frontend Developer" />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="field">
                                    <label>Company Name <span className="req">*</span></label>
                                    <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Your company name" />
                                </div>
                                <div className="field">
                                    <label>Location <span className="req">*</span></label>
                                    <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. New York, NY" />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="field">
                                    <label>Employment Type <span className="req">*</span></label>
                                    <select value={employmentType} onChange={(e) => setEmploymentType(e.target.value)}>
                                        <option value="">Select type</option>
                                        <option>Full-time</option>
                                        <option>Part-time</option>
                                        <option>Contract</option>
                                        <option>Internship</option>
                                    </select>
                                </div>
                                <div className="field">
                                    <label>Work Model</label>
                                    <select value={workModel} onChange={(e) => setWorkModel(e.target.value)}>
                                        <option value="">Select model</option>
                                        <option>Onsite</option>
                                        <option>Hybrid</option>
                                        <option>Remote</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="field salary">
                                    <label>Salary Range</label>
                                    <div className="salary-row">
                                        <input value={salaryMin} onChange={(e) => setSalaryMin(e.target.value)} placeholder="Min" />
                                        <span className="dash">-</span>
                                        <input value={salaryMax} onChange={(e) => setSalaryMax(e.target.value)} placeholder="Max" />
                                        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                                            <option>USD</option>
                                            <option>EUR</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="card">
                            <h3 className="section-title">Job Details</h3>
                            <label>Job Description <span className="req">*</span></label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the role and responsibilities..." />
                            <div className="form-row">
                                <div className="field"><label>Department</label>
                                    <select value={department} onChange={(e) => setDepartment(e.target.value)}><option value="">Select department</option><option>Engineering</option><option>Design</option></select>
                                </div>
                                <div className="field"><label>Experience Level</label>
                                    <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)}><option value="">Select level</option><option>Junior</option><option>Mid</option><option>Senior</option></select>
                                </div>
                            </div>
                        </section>

                        <section className="card">
                            <h3 className="section-title">Requirements</h3>
                            <label className="mb-2">Required Skills <span className="req">*</span></label>
                            <div className="skill-input-row">
                                <input
                                    className="form-control"
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    placeholder="Add skills (press Enter to add)"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            addSkillFromInput();
                                        }
                                    }}
                                />
                                <button className="btn-add" onClick={addSkillFromInput}>Add</button>
                            </div>

                            <div className="chips" style={{ marginTop: 8 }}>
                                {skills.map((s) => (
                                    <div key={s} className="chip removable">
                                        {s} <button onClick={() => removeSkill(s)} className="x">×</button>
                                    </div>
                                ))}
                            </div>

                            <div className="form-row" style={{ marginTop: 12 }}>
                                <div className="field"><label>Education Level</label>
                                    <select value={educationLevel} onChange={(e) => setEducationLevel(e.target.value)}><option value="">Select education</option><option>Bachelor's</option><option>Master's</option></select>
                                </div>
                                <div className="field"><label>Years of Experience</label><input value={yearsExperience} onChange={(e) => setYearsExperience(e.target.value)} placeholder="e.g. 3" /></div>
                            </div>

                            <label style={{ marginTop: 12 }}>Additional Requirements</label>
                            <textarea value={additional} onChange={(e) => setAdditional(e.target.value)} placeholder="Any other requirements or qualifications..." />
                        </section>

                        <div className="actions-row">
                            <button className="btn-muted" onClick={resetForm}>Cancel</button>
                            <div style={{ flex: 1 }} />
                            <button className="btn-outline" onClick={() => alert("Saved as draft (local)")} >Save as Draft</button>
                            <button className="btn-primary" onClick={onClickPostJob}>Post Job</button>
                        </div>
                    </div>

                    <aside className="job-preview">
                        <div className="card preview-card">
                            <div className="preview-top">
                                <div className="preview-icon">📄</div>
                                <div>
                                    <h3 className="preview-title">{jobTitle || "Job Title"}</h3>
                                    <div className="muted small">{companyName || "Company name"}</div>
                                </div>
                            </div>

                            <div className="preview-row"><FiMapPin /> {location || "Location"}</div>
                            <div className="preview-row"><FiClock /> {employmentType || "Employment type"}</div>
                            <div className="preview-row"><FiDollarSign /> {salaryMin || "-"} - {salaryMax || "-"} {currency}</div>
                            <div className="preview-row"><FiBriefcase /> {workModel || "Work model"}</div>

                            <div style={{ marginTop: 12 }}><strong>Required Skills</strong></div>
                            <div className="chips" style={{ marginTop: 8 }}>
                                {skills.length ? skills.map((s) => <span key={s} className="chip">{s}</span>) : <span className="muted small">No skills yet</span>}
                            </div>

                            <div className="all-completed"><span>✔</span> Fill all sections to preview complete</div>
                        </div>
                    </aside>
                </div>
            </div>

            {openPreview && (
                <PreviewModal
                    onClose={() => setOpenPreview(false)}
                    data={{
                        jobTitle,
                        companyName,
                        location,
                        employmentType,
                        workModel,
                        salaryMin,
                        salaryMax,
                        currency,
                        description,
                        department,
                        experienceLevel,
                        skills,
                        educationLevel,
                        yearsExperience,
                        additional,
                    }}
                />
            )}
        </div>
    );
}

function Step({ number, label, active, complete }) {
    return (
        <div className={`step ${complete ? "step-complete" : ""} ${active ? "active" : ""}`}>
            <div className="step-circle">{number}</div>
            <div className="step-label">{label}</div>
        </div>
    );
}
