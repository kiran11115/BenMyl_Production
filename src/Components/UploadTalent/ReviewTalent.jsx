import React, { useState } from "react";
import { Edit2, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import "./UploadTalent.css";
const PDFResumePreview = () => {
    return (
        <div className="auth-card" style={{ flexDirection: 'column', minHeight: '800px', padding: '40px', maxWidth: '100%' }}>
            <div className="auth-subtitle" style={{ textAlign: "center", marginBottom: '20px' }}>
                Basic Resume Template Preview
            </div>

            {/* Header Section */}
            <div style={{ textAlign: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: '20px', marginBottom: '20px' }}>
                <h1 className="auth-title" style={{ fontSize: '24px', marginBottom: '8px' }}>
                    First Last Name
                </h1>
                <div className="auth-subtitle" style={{ fontSize: '14px' }}>
                    14pt-16pt font • Professional Email Address • Phone Number<br />
                    Portfolio, Website or LinkedIn Address (Optional)
                </div>
            </div>

            {/* Education Section */}
            <div className="auth-form-group">
                <h3 className="auth-label" style={{ fontSize: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>EDUCATION</h3>
                <div className="auth-label" style={{ color: '#0f172a', fontSize: '14px' }}>
                    Southeastern Louisiana University • City, State
                </div>
                <div className="auth-subtitle" style={{ marginBottom: '4px' }}>
                    Bachelor of Science Arts in Name of Major
                </div>
                <div className="auth-subtitle" style={{ fontSize: '13px' }}>
                    Month and Year Received/Expected • Concentration, Second Major, Minor, Emphasis
                </div>
            </div>

            {/* Experience Sections */}
            <div className="auth-form-group">
                <h3 className="auth-label" style={{ fontSize: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>RELEVANT EXPERIENCE</h3>
                <div className="auth-label" style={{ color: '#0f172a', fontSize: '14px' }}>
                    Name of Company • City, State
                </div>
                <div className="auth-subtitle" style={{ fontSize: '13px', marginBottom: '8px' }}>
                    Job Title • Month Year - Month Year
                </div>
                <ul className="auth-subtitle" style={{ fontSize: '13px', paddingLeft: '20px', lineHeight: '1.6' }}>
                    <li>Include 3-5 bullet points demonstrating skills gained through this position</li>
                    <li>Emphasize accomplishments over day-to-day tasks</li>
                    <li>Place action verb at beginning of bullet point</li>
                </ul>
            </div>

            <div className="auth-form-group">
                <h3 className="auth-label" style={{ fontSize: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>ADDITIONAL EXPERIENCE</h3>
                <div className="auth-label" style={{ color: '#0f172a', fontSize: '14px' }}>
                    Name of Company • City, State
                </div>
                <div className="auth-subtitle" style={{ fontSize: '13px', marginBottom: '8px' }}>
                    Job Title • Month Year - Month Year
                </div>
                <ul className="auth-subtitle" style={{ fontSize: '13px', paddingLeft: '20px', lineHeight: '1.6' }}>
                    <li>Emphasize key skills employers want to see</li>
                    <li>Highlight results and impact</li>
                    <li>Use past tense verbs</li>
                </ul>
            </div>

            {/* Skills Section */}
            <div className="auth-form-group">
                <h3 className="auth-label" style={{ fontSize: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>SKILLS</h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                    {["JavaScript", "React", "TypeScript", "Node.js", "SQL", "Leadership"].map((skill, i) => (
                        <span key={i} className="status-tag status-progress" style={{ fontSize: '13px' }}>
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

const EditableField = ({ label, value, editing, onEdit, onSave, onCancel }) => {
    const [temp, setTemp] = useState(value || "");
    return (
        <div className="auth-form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <label className="auth-label">{label}</label>
                {!editing && <button className="auth-link" onClick={onEdit}><Edit2 size={12} /> Edit</button>}
            </div>
            {editing ? (
                <>
                    <input className="auth-input" value={temp} onChange={e => setTemp(e.target.value)} autoFocus />
                    <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                        <button className="btn-primary" onClick={() => onSave(temp)}>Save</button>
                        <button className="btn-secondary" onClick={onCancel}>Cancel</button>
                    </div>
                </>
            ) : (
                <div className="auth-input" style={{ border: 'none', padding: '4px 0', fontWeight: 600 }}>{value || "—"}</div>
            )}
        </div>
    );
};

const EditableTextarea = ({ label, value, editing, onEdit, onSave, onCancel }) => {
    const [temp, setTemp] = useState(value || "");
    return (
        <div className="auth-form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <label className="auth-label">{label}</label>
                {!editing && <button className="auth-link" onClick={onEdit}><Edit2 size={12} /> Edit</button>}
            </div>
            {editing ? (
                <>
                    <textarea className="auth-input" style={{ minHeight: 120 }} value={temp} onChange={e => setTemp(e.target.value)} />
                    <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                        <button className="btn-primary" onClick={() => onSave(temp)}>Save</button>
                        <button className="btn-secondary" onClick={onCancel}>Cancel</button>
                    </div>
                </>
            ) : (
                <div className="auth-input" style={{ border: 'none', padding: '4px 0' }}>{value || "—"}</div>
            )}
        </div>
    );
};

const EditableTags = ({ label, values, editing, onEdit, onSave, onCancel }) => {
    const [temp, setTemp] = useState(values.join(", "));
    return (
        <div className="auth-form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label className="auth-label">{label}</label>
                {!editing && <button className="auth-link" onClick={onEdit}><Edit2 size={12} /> Edit</button>}
            </div>
            {editing ? (
                <>
                    <textarea className="auth-input" style={{ minHeight: 70 }} value={temp} onChange={e => setTemp(e.target.value)} />
                    <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                        <button className="btn-primary" onClick={() => onSave(temp.split(",").map(t => t.trim()).filter(Boolean))}>Save</button>
                        <button className="btn-secondary" onClick={onCancel}>Cancel</button>
                    </div>
                </>
            ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                    {values.length === 0 ? <span className="auth-subtitle">No items</span> :
                        values.map((v, i) => <span key={i} className="status-tag status-progress">{v}</span>)}
                </div>
            )}
        </div>
    );
};

const ReviewTalent = () => {
    const navigate = useNavigate();
    const [isReviewed, setIsReviewed] = useState(false);

    // SINGLE OPEN ACCORDION
    const [openAccordion, setOpenAccordion] = useState("basicInfo");
    const toggleAccordion = (key) => setOpenAccordion(prev => prev === key ? null : key);

    const [editingSection, setEditingSection] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);
    const beginEdit = (s, i = null) => { setEditingSection(s); setEditingIndex(i); };
    const cancelEdit = () => { setEditingSection(null); setEditingIndex(null); };

    const [talent, setTalent] = useState({
        basicInfo: { firstName: "Subramanya", lastName: "Gopaluni", position: "Software Engineer", phone: "+1 980-345-0039", email: "sgopaluni@charlotte.edu", skills: ["Java", "Python", "Spring Boot"] },
        personalInfo: { dob: "", gender: "", emergency: "", country: "USA", state: "", city: "Dallas", address: "Dallas, TX", bio: "" },
        education: [{ university: "UNC Charlotte", qualification: "", startDate: "01-Jan-2025", endDate: "30-Jul-2025", field: "Computer Science", percentage: "", certifications: [] }],
        experience: [{ company: "Upright", position: "Software Engineer", startDate: "01-Jan-2025", endDate: "01-Jun-2025", skills: ["Java", "AWS"], description: "" }],
        projects: [{ name: "High Performance Data Service", role: "", startDate: "01-Jan-2025", endDate: "30-Jul-2025", skills: ["Kafka", "Java"], description: "" }]
    });

    const addEducation = () => setTalent(p => ({ ...p, education: [...p.education, { university: "", qualification: "", startDate: "", endDate: "", field: "", percentage: "", certifications: [] }] }));
    const addExperience = () => setTalent(p => ({ ...p, experience: [...p.experience, { company: "", position: "", startDate: "", endDate: "", skills: [], description: "" }] }));
    const addProjects = () => setTalent(p => ({ ...p, projects: [...p.projects, { name: "", role: "", startDate: "", endDate: "", skills: [], description: "" }] }));

   const smoothStyle = (open) => ({
  maxHeight: open ? 1000 : 0,
  overflow: 'auto',
  transition: 'max-height .3s ease',

  /* Hide scrollbar — Chrome/Safari/Edge */
  '::-webkit-scrollbar': {
    display: 'none'
  },

  /* Firefox */
  scrollbarWidth: 'none',

  /* IE/old Edge */
  msOverflowStyle: 'none'
});


    return (
        <div style={{ padding: 24 }}>
            <div className="d-flex gap-2 mb-3 align-items-center">
                <button className="auth-link" onClick={() => navigate("/user/user-upload-talent")}><FiArrowLeft /> Talent Management</button>
                <span className="auth-subtitle">/ Review Talent</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

                {/* LEFT */}
                <div className="auth-form-side" style={{ border: '1px solid #e2e8f0', borderRadius: '1rem', padding: 24, background: 'white', display: 'flex', flexDirection: 'column' }}>
                    <h4 className="auth-title mb-4">2. Edit Information</h4>

                    <div style={{ flex: 1, overflowY: 'auto' }}>

                        {/* ===== BASIC ===== */}
                        <div style={{ marginBottom: 16 }}>
                            <div className="" style={{
                                border: "1px solid #e2e8f0",
                                borderRadius: "6px",
                                padding: "10px 10px 0px 10px"
                            }}>
                                <div onClick={() => toggleAccordion("basicInfo")}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <h5 className="auth-label">Basic Information</h5>
                                    {openAccordion === "basicInfo" ? <ChevronUp /> : <ChevronDown />}
                                </div>
                                <div style={smoothStyle(openAccordion === "basicInfo")} className="mt-2 scrollable" >
                                    {["firstName", "lastName", "position", "phone", "email"].map(f => (
                                        <EditableField key={f} label={f} value={talent.basicInfo[f]}
                                            editing={editingSection === "basicInfo" && editingIndex === f}
                                            onEdit={() => beginEdit("basicInfo", f)}
                                            onSave={val => { setTalent(p => ({ ...p, basicInfo: { ...p.basicInfo, [f]: val } })); cancelEdit(); }}
                                            onCancel={cancelEdit}
                                        />
                                    ))}
                                    <EditableTags
                                        label="Skills"
                                        values={talent.basicInfo.skills}
                                        editing={editingSection === "basicInfo" && editingIndex === "skills"}
                                        onEdit={() => beginEdit("basicInfo", "skills")}
                                        onSave={val => { setTalent(p => ({ ...p, basicInfo: { ...p.basicInfo, skills: val } })); cancelEdit(); }}
                                        onCancel={cancelEdit}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ===== PERSONAL ===== */}
                        <div style={{ marginBottom: 16 }}>
                            <div className="" style={{
                                border: "1px solid #e2e8f0",
                                borderRadius: "6px",
                                padding: "10px 10px 0px 10px"
                            }}>
                                <div onClick={() => toggleAccordion("personalInfo")} style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}>
                                    <h5 className="auth-label">Personal Information</h5>
                                    {openAccordion === "personalInfo" ? <ChevronUp /> : <ChevronDown />}
                                </div>
                                <div style={smoothStyle(openAccordion === "personalInfo")} className="mt-2">
                                    {Object.keys(talent.personalInfo).map(field => {
                                        const isTxt = field === "bio";
                                        return isTxt ? (
                                            <EditableTextarea key={field} label={field} value={talent.personalInfo[field]}
                                                editing={editingSection === "personalInfo" && editingIndex === field}
                                                onEdit={() => beginEdit("personalInfo", field)}
                                                onSave={val => { setTalent(p => ({ ...p, personalInfo: { ...p.personalInfo, [field]: val } })); cancelEdit(); }}
                                                onCancel={cancelEdit}
                                            />
                                        ) : (
                                            <EditableField key={field} label={field} value={talent.personalInfo[field]}
                                                editing={editingSection === "personalInfo" && editingIndex === field}
                                                onEdit={() => beginEdit("personalInfo", field)}
                                                onSave={val => { setTalent(p => ({ ...p, personalInfo: { ...p.personalInfo, [field]: val } })); cancelEdit(); }}
                                                onCancel={cancelEdit}
                                            />
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* ===== EDUCATION ===== */}
                        <div style={{ marginBottom: 16 }}>
                            <div className="" style={{
                                border: "1px solid #e2e8f0",
                                borderRadius: "6px",
                                padding: "10px 10px 0px 10px"
                            }}>
                                <div onClick={() => toggleAccordion("education")} style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}>
                                    <h5 className="auth-label">Education</h5>
                                    {openAccordion === "education" ? <ChevronUp /> : <ChevronDown />}
                                </div>
                                <div style={smoothStyle(openAccordion === "education")} className="mt-2">
                                   
                                    {talent.education.map((ed, i) => (
                                        <div key={i} style={{ border: '1px solid #e2e8f0', padding: 12, borderRadius: 8, marginTop: 10, marginBottom: 14 }}>
                                            {["university", "qualification", "startDate", "endDate", "field", "percentage"].map(field => (
                                                <EditableField
                                                    key={field}
                                                    label={field}
                                                    value={ed[field]}
                                                    editing={editingSection === "education" && editingIndex === `${i}-${field}`}
                                                    onEdit={() => beginEdit("education", `${i}-${field}`)}
                                                    onSave={val => {
                                                        const arr = [...talent.education]; arr[i][field] = val;
                                                        setTalent(p => ({ ...p, education: arr })); cancelEdit();
                                                    }}
                                                    onCancel={cancelEdit}
                                                />
                                            ))}
                                            <EditableTags
                                                label="Certifications"
                                                values={ed.certifications}
                                                editing={editingSection === "education" && editingIndex === `${i}-certifications`}
                                                onEdit={() => beginEdit("education", `${i}-certifications`)}
                                                onSave={val => {
                                                    const arr = [...talent.education]; arr[i].certifications = val;
                                                    setTalent(p => ({ ...p, education: arr })); cancelEdit();
                                                }}
                                                onCancel={cancelEdit}
                                            />
                                        </div>
                                    ))}

                                     <div className="mb-3" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <button className="btn-secondary" onClick={addEducation}><Plus size={12} /> Add</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ===== EXPERIENCE ===== */}
                        <div style={{ marginBottom: 16 }}>
                            <div className="" style={{
                                border: "1px solid #e2e8f0",
                                borderRadius: "6px",
                                padding: "10px 10px 0px 10px"
                            }}>
                                <div onClick={() => toggleAccordion("experience")} style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}>
                                    <h5 className="auth-label">Experience</h5>
                                    {openAccordion === "experience" ? <ChevronUp /> : <ChevronDown />}
                                </div>
                                <div style={smoothStyle(openAccordion === "experience")} className="mt-2">
                                    
                                    {talent.experience.map((ex, i) => (
                                        <div key={i} style={{ border: '1px solid #e2e8f0', padding: 12, borderRadius: 8, marginTop: 10, marginBottom: 14 }}>
                                            {["company", "position", "startDate", "endDate"].map(field => (
                                                <EditableField key={field} label={field} value={ex[field]}
                                                    editing={editingSection === "experience" && editingIndex === `${i}-${field}`}
                                                    onEdit={() => beginEdit("experience", `${i}-${field}`)}
                                                    onSave={val => {
                                                        const arr = [...talent.experience]; arr[i][field] = val;
                                                        setTalent(p => ({ ...p, experience: arr })); cancelEdit();
                                                    }}
                                                    onCancel={cancelEdit}
                                                />
                                            ))}
                                            <EditableTags
                                                label="Skills"
                                                values={ex.skills}
                                                editing={editingSection === "experience" && editingIndex === `${i}-skills`}
                                                onEdit={() => beginEdit("experience", `${i}-skills`)}
                                                onSave={val => {
                                                    const arr = [...talent.experience]; arr[i].skills = val;
                                                    setTalent(p => ({ ...p, experience: arr })); cancelEdit();
                                                }}
                                                onCancel={cancelEdit}
                                            />
                                            <EditableTextarea
                                                label="Description"
                                                value={ex.description}
                                                editing={editingSection === "experience" && editingIndex === `${i}-description`}
                                                onEdit={() => beginEdit("experience", `${i}-description`)}
                                                onSave={val => {
                                                    const arr = [...talent.experience]; arr[i].description = val;
                                                    setTalent(p => ({ ...p, experience: arr })); cancelEdit();
                                                }}
                                                onCancel={cancelEdit}
                                            />
                                        </div>
                                    ))}

                                    <div className="mb-3" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <button className="btn-secondary" onClick={addExperience}><Plus size={12} /> Add</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ===== PROJECTS ===== */}
                        <div style={{ marginBottom: 16 }}>
                            <div className="" style={{
                                border: "1px solid #e2e8f0",
                                borderRadius: "6px",
                                padding: "10px 10px 0px 10px"
                            }}>
                                <div onClick={() => toggleAccordion("projects")} style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}>
                                    <h5 className="auth-label">Projects</h5>
                                    {openAccordion === "projects" ? <ChevronUp /> : <ChevronDown />}
                                </div>
                                <div style={smoothStyle(openAccordion === "projects")} className="mt-2">
        
                                    {talent.projects.map((pr, i) => (
                                        <div key={i} style={{ border: '1px solid #e2e8f0', padding: 12, borderRadius: 8, marginTop: 10, marginBottom: 14 }}>
                                            {["name", "role", "startDate", "endDate"].map(field => (
                                                <EditableField key={field} label={field} value={pr[field]}
                                                    editing={editingSection === "projects" && editingIndex === `${i}-${field}`}
                                                    onEdit={() => beginEdit("projects", `${i}-${field}`)}
                                                    onSave={val => {
                                                        const arr = [...talent.projects]; arr[i][field] = val;
                                                        setTalent(p => ({ ...p, projects: arr })); cancelEdit();
                                                    }}
                                                    onCancel={cancelEdit}
                                                />
                                            ))}
                                            <EditableTags
                                                label="Skills"
                                                values={pr.skills}
                                                editing={editingSection === "projects" && editingIndex === `${i}-skills`}
                                                onEdit={() => beginEdit("projects", `${i}-skills`)}
                                                onSave={val => {
                                                    const arr = [...talent.projects]; arr[i].skills = val;
                                                    setTalent(p => ({ ...p, projects: arr })); cancelEdit();
                                                }}
                                                onCancel={cancelEdit}
                                            />
                                            <EditableTextarea
                                                label="Description"
                                                value={pr.description}
                                                editing={editingSection === "projects" && editingIndex === `${i}-description`}
                                                onEdit={() => beginEdit("projects", `${i}-description`)}
                                                onSave={val => {
                                                    const arr = [...talent.projects]; arr[i].description = val;
                                                    setTalent(p => ({ ...p, projects: arr })); cancelEdit();
                                                }}
                                                onCancel={cancelEdit}
                                            />
                                        </div>
                                    ))}

                                    <div className="mb-3" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <button className="btn-secondary" onClick={addProjects}><Plus size={12} /> Add</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: 24 }}>
                        <div className="auth-alert auth-alert-success" style={{ marginBottom: 24, display: 'flex', gap: 10 }}>
                            <input type="checkbox" checked={isReviewed} onChange={e => setIsReviewed(e.target.checked)} style={{ width: 18, height: 18 }} />
                            <span style={{ fontSize: 14, fontWeight: 600 }}>I have reviewed and verified all information is correct</span>
                        </div>
                        <div className="d-flex gap-3 justify-content-end">
                            <button className="btn-secondary">Save as Draft</button>
                            <button className="btn-primary" disabled={!isReviewed} onClick={() => navigate("/user/user-upload-talent")}>Save Talent</button>
                        </div>
                    </div>
                </div>

                {/* RIGHT */}
                <div style={{ borderRadius: '1rem', border: '1px solid #e2e8f0', background: 'white' }}>
                    <h4 className="auth-title" style={{ padding: 16 }}>Preview Resume</h4>
                    <div style={{ height: 'calc(100% - 48px)', overflowY: 'auto' }}>
                        <PDFResumePreview />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewTalent;
