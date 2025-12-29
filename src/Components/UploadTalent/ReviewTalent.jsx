import React, { useState } from "react";
import { Edit2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

// PDF Preview Component
// Uses auth-card for the paper look and auth-title/subtitle for typography
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

// EditableField Component 
const EditableField = ({ label, value, fieldName, isEditing, onEdit, onSave, onCancel, multiline = false }) => {
    const [tempValue, setTempValue] = useState(value);

    React.useEffect(() => {
        setTempValue(value);
    }, [value, isEditing]);

    const handleSaveClick = () => {
        onSave(fieldName, tempValue);
    };

    return (
        <div className="auth-form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="auth-label">{label}</label>
                {!isEditing && (
                    <button
                        onClick={() => onEdit(fieldName)}
                        className="auth-link"
                        style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                        <Edit2 size={12} /> Edit
                    </button>
                )}
            </div>
            
            {isEditing ? (
                <div>
                    {multiline ? (
                        <textarea
                            className="auth-input"
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            style={{ minHeight: '100px', fontFamily: 'inherit' }}
                            autoFocus
                        />
                    ) : (
                        <input
                            type="text"
                            className="auth-input"
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            autoFocus
                        />
                    )}
                    <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                        <button className="btn-primary" onClick={handleSaveClick}>
                            Save
                        </button>
                        <button className="btn-secondary" onClick={onCancel}>
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className="auth-input" style={{ border: 'none', padding: '4px 0', background: 'transparent', fontWeight: 600 }}>
                    {value}
                </div>
            )}
        </div>
    );
};

// EditableTags Component
const EditableTags = ({ label, tags, fieldName, isEditing, onEdit, onSave, onCancel }) => {
    const [tempTags, setTempTags] = useState(tags.join(", "));

    React.useEffect(() => {
        setTempTags(tags.join(", "));
    }, [tags, isEditing]);

    const handleSaveClick = () => {
        const newTags = tempTags.split(",").map(tag => tag.trim()).filter(tag => tag !== "");
        onSave(fieldName, newTags);
    };

    return (
        <div className="auth-form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="auth-label">{label}</label>
                {!isEditing && (
                    <button
                        onClick={() => onEdit(fieldName)}
                        className="auth-link"
                        style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                        <Edit2 size={12} /> Edit
                    </button>
                )}
            </div>

            {isEditing ? (
                <div>
                    <textarea
                        className="auth-input"
                        value={tempTags}
                        onChange={(e) => setTempTags(e.target.value)}
                        placeholder="Separate items with commas"
                        style={{ minHeight: '80px', fontFamily: 'inherit' }}
                        autoFocus
                    />
                    <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                        <button className="btn-primary"  onClick={handleSaveClick}>
                            Save
                        </button>
                        <button className="btn-secondary" onClick={onCancel}>
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                    {tags && tags.length > 0 ? (
                        tags.map((tag, idx) => (
                            <span 
                                key={idx} 
                                className="status-tag status-progress"
                                style={{ 
                                    width: 'auto', 
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    fontSize: '13px'
                                }}
                            >
                                {tag}
                            </span>
                        ))
                    ) : (
                        <span className="auth-subtitle">Add information</span>
                    )}
                </div>
            )}
        </div>
    );
};

const ReviewTalent = () => {
    const [showPreview, setShowPreview] = useState(true);
    const [isReviewed, setIsReviewed] = useState(false);
    const [editingField, setEditingField] = useState(null);
    const navigate = useNavigate();

    // Form state
    const [formData, setFormData] = useState({
        fullName: "John Doe",
        email: "john.doe@example.com",
        phone: "+1234567890",
        address: "1234 Elm Street, Springfield",
        professionalSummary: "Experienced software developer with expertise in full-stack development.",
        professionalExperience: ["Software Engineer", "Full Stack Developer"],
        yearsOfExperience: "7",
        education: ["Bachelor of Science in Computer Science, XYZ University", "Master of Science in Software Engineering, ABC University"],
        certifications: ["Certified React Developer", "AWS Solutions Architect – Associate"],
        skills: ["JavaScript", "React", "TypeScript", "Node.js", "SQL", "Leadership"]
    });

    const handleEdit = (fieldName) => {
        setEditingField(fieldName);
    };

    const handleSave = (fieldName, newValue) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: newValue
        }));
        setEditingField(null);
    };

    const handleCancel = () => {
        setEditingField(null);
    };

    return (
        <div style={{ padding: "24px" }}>
            <div className="d-flex gap-2 mb-3 align-items-center" style={{ marginBottom: '1.5rem' }}>
                <button
                    className="auth-link"
                    style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}
                    onClick={() => navigate("/user/user-upload-talent")}
                >
                    <FiArrowLeft /> Talent Management
                </button>
                <span className="auth-subtitle" style={{ fontSize: '14px' }}>/ Review Talent</span>
            </div>

            {/* Grid Layout - Using flex to mimic grid without external CSS */}
            <div style={{ display: "flex", flexDirection: "row", gap: "24px", alignItems: "flex-start", flexWrap: 'wrap' }}>
                
                {/* LEFT COLUMN: Edit Form */}
                <div className="auth-form-side" style={{ 
                    flex: '1', 
                    minWidth: '350px',
                    borderRadius: '1rem', 
                    border: '1px solid #e2e8f0', 
                    padding: '24px', 
                    background: 'white' 
                }}>
                    <div className="auth-header">
                        <h4 className="auth-title" style={{ fontSize: '18px' }}>2. Edit Information</h4>
                    </div>

                    <EditableField
                        label="Full Name"
                        value={formData.fullName}
                        fieldName="fullName"
                        isEditing={editingField === "fullName"}
                        onEdit={handleEdit}
                        onSave={handleSave}
                        onCancel={handleCancel}
                    />

                    <EditableField
                        label="Email"
                        value={formData.email}
                        fieldName="email"
                        isEditing={editingField === "email"}
                        onEdit={handleEdit}
                        onSave={handleSave}
                        onCancel={handleCancel}
                    />

                    <EditableField
                        label="Phone"
                        value={formData.phone}
                        fieldName="phone"
                        isEditing={editingField === "phone"}
                        onEdit={handleEdit}
                        onSave={handleSave}
                        onCancel={handleCancel}
                    />

                    <EditableField
                        label="Address"
                        value={formData.address}
                        fieldName="address"
                        isEditing={editingField === "address"}
                        onEdit={handleEdit}
                        onSave={handleSave}
                        onCancel={handleCancel}
                    />

                    <EditableField
                        label="Professional Summary"
                        value={formData.professionalSummary}
                        fieldName="professionalSummary"
                        isEditing={editingField === "professionalSummary"}
                        onEdit={handleEdit}
                        onSave={handleSave}
                        onCancel={handleCancel}
                        multiline
                    />

                    <div className="auth-divider">
                        <div className="auth-divider-line"></div>
                    </div>

                    <EditableTags
                        label="Professional Experience"
                        tags={formData.professionalExperience}
                        fieldName="professionalExperience"
                        isEditing={editingField === "professionalExperience"}
                        onEdit={handleEdit}
                        onSave={handleSave}
                        onCancel={handleCancel}
                    />

                    <EditableField
                        label="Years of Experience"
                        value={formData.yearsOfExperience}
                        fieldName="yearsOfExperience"
                        isEditing={editingField === "yearsOfExperience"}
                        onEdit={handleEdit}
                        onSave={handleSave}
                        onCancel={handleCancel}
                    />

                    <EditableTags
                        label="Education"
                        tags={formData.education}
                        fieldName="education"
                        isEditing={editingField === "education"}
                        onEdit={handleEdit}
                        onSave={handleSave}
                        onCancel={handleCancel}
                    />

                    <EditableTags
                        label="Certifications"
                        tags={formData.certifications}
                        fieldName="certifications"
                        isEditing={editingField === "certifications"}
                        onEdit={handleEdit}
                        onSave={handleSave}
                        onCancel={handleCancel}
                    />

                    <EditableTags
                        label="Skills"
                        tags={formData.skills}
                        fieldName="skills"
                        isEditing={editingField === "skills"}
                        onEdit={handleEdit}
                        onSave={handleSave}
                        onCancel={handleCancel}
                    />

                    <div className="auth-alert auth-alert-success" style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                            type="checkbox"
                            checked={isReviewed}
                            onChange={e => setIsReviewed(e.target.checked)}
                            style={{ width: '18px', height: '18px' }}
                        />
                        <span style={{ fontSize: '14px', fontWeight: 600 }}>I have reviewed and verified all information is correct</span>
                    </div>

                    <div className="d-flex gap-3 mt-3 justify-content-end">
                        <button className="btn-secondary">
                            Save as Draft
                        </button>
                        <button
                            className="btn-primary"
                            style={{ width: 'auto', padding: '0 24px' }}
                            disabled={!isReviewed}
                        >
                            Save to Bench
                        </button>
                    </div>
                </div>

                {/* RIGHT COLUMN: Resume Preview */}
                <div style={{ 
                    flex: '1', 
                    minWidth: '350px',
                    position: 'sticky',
                    top: '20px',
                    height: 'calc(100vh - 40px)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                     <div className="auth-form-side" style={{ 
                        borderRadius: '1rem', 
                        border: '1px solid #e2e8f0', 
                        padding: '16px', 
                        background: 'white',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h4 className="auth-title" style={{ fontSize: '16px', margin: 0 }}>Preview Resume</h4>
                            <button
                                type="button"
                                className="btn-secondary"
                                style={{ width: 'auto', padding: '6px 12px', fontSize: '12px', height: 'auto' }}
                                onClick={() => setShowPreview(prev => !prev)}
                            >
                                {showPreview ? "Hide Preview" : "Show Preview"}
                            </button>
                        </div>

                        {showPreview && (
                            <div style={{ flex: 1, overflowY: 'auto', padding: '4px' }}>
                                <PDFResumePreview />
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ReviewTalent;
