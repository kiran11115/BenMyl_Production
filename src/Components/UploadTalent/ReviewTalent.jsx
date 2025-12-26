import React, { useState } from "react";
import { ArrowLeft, Edit2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

// PDF Preview Component for Basic_Resume.docx.pdf
const PDFResumePreview = () => {
    return (
        <div style={{
            width: "100%",
            minHeight: 500,
            backgroundColor: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: 20,
            // remove overflowY here to avoid double scroll
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)"
        }}>
            <div style={{ textAlign: "center", marginBottom: 24, color: "#6b7280" }}>
                📄 Basic Resume Template Preview
            </div>

            {/* Header Section */}
            <div style={{
                textAlign: "center",
                marginBottom: 32,
                paddingBottom: 20,
                borderBottom: "2px solid #e5e7eb"
            }}>
                <div style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: "#111827",
                    marginBottom: 4,
                    letterSpacing: "-0.02em"
                }}>
                    First Last Name
                </div>
                <div style={{
                    fontSize: 14,
                    color: "#6b7280",
                    fontWeight: 500
                }}>
                    14pt-16pt font • Professional Email Address • Phone Number<br />
                    Portfolio, Website or LinkedIn Address (Optional)
                </div>
            </div>

            {/* Education Section */}
            <div style={{ marginBottom: 28 }}>
                <div style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#111827",
                    marginBottom: 12,
                    letterSpacing: "0.5px"
                }}>
                    EDUCATION
                </div>
                <div style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#111827",
                    marginBottom: 6
                }}>
                    Southeastern Louisiana University • City, State
                </div>
                <div style={{
                    fontSize: 14,
                    color: "#374151",
                    marginBottom: 4
                }}>
                    Bachelor of Science Arts in Name of Major
                </div>
                <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 12 }}>
                    Month and Year Received/Expected • Concentration, Second Major, Minor, Emphasis • GPA/XX.XX/4.00
                </div>
                <div style={{ fontSize: 12, color: "#9ca3af", fontStyle: "italic" }}>
                    Related Coursework, Study Abroad (optional)
                </div>
            </div>

            {/* Experience Sections */}
            <div style={{ marginBottom: 28 }}>
                <div style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#111827",
                    marginBottom: 12,
                    letterSpacing: "0.5px"
                }}>
                    RELEVANT EXPERIENCE
                </div>
                <div style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#111827",
                    marginBottom: 6
                }}>
                    Name of Company • City, State
                </div>
                <div style={{
                    fontSize: 13,
                    color: "#6b7280",
                    marginBottom: 12
                }}>
                    Job Title • Month Year - Month Year
                </div>
                <ul style={{
                    margin: 0,
                    paddingLeft: 20,
                    fontSize: 13,
                    color: "#374151",
                    lineHeight: 1.5
                }}>
                    <li>• Include 3-5 bullet points demonstrating skills gained through this position</li>
                    <li>• Emphasize accomplishments over day-to-day tasks</li>
                    <li>• Place action verb at beginning of bullet point</li>
                    <li>• Use quantifiers: numbers, money amounts, percentages</li>
                </ul>
            </div>

            <div style={{ marginBottom: 28 }}>
                <div style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#111827",
                    marginBottom: 12,
                    letterSpacing: "0.5px"
                }}>
                    ADDITIONAL EXPERIENCE
                </div>
                <div style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#111827",
                    marginBottom: 6
                }}>
                    Name of Company • City, State
                </div>
                <div style={{
                    fontSize: 13,
                    color: "#6b7280",
                    marginBottom: 12
                }}>
                    Job Title • Month Year - Month Year
                </div>
                <ul style={{
                    margin: 0,
                    paddingLeft: 20,
                    fontSize: 13,
                    color: "#374151",
                    lineHeight: 1.5
                }}>
                    <li>• Emphasize key skills employers want to see</li>
                    <li>• Highlight results and impact</li>
                    <li>• Use past tense verbs</li>
                </ul>
            </div>

            {/* Project & Campus Involvement */}
            <div style={{ marginBottom: 28 }}>
                <div style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#111827",
                    marginBottom: 12,
                    letterSpacing: "0.5px"
                }}>
                    PROJECT EXPERIENCE & CAMPUS INVOLVEMENT
                </div>
                <div style={{
                    fontSize: 13,
                    color: "#374151",
                    lineHeight: 1.5
                }}>
                    • Name of Project/Course/Club • Month Year - Month Year<br />
                    • Include 3-5 bullet points with action verbs<br />
                    • Quantify contributions and highlight team leadership
                </div>
            </div>

            {/* Skills Section */}
            <div style={{ marginBottom: 28 }}>
                <div style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#111827",
                    marginBottom: 12,
                    letterSpacing: "0.5px"
                }}>
                    SKILLS
                </div>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                    gap: 8,
                    fontSize: 13,
                    color: "#374151",
                    fontWeight: 500
                }}>
                    <div>Skill 1</div>
                    <div>Skill 2</div>
                    <div>Skill 3</div>
                    <div>Skill 4</div>
                    <div>Skill 5</div>
                    <div>Skill 6</div>
                </div>
                <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 8 }}>
                    List skills relevant to field • ATS-friendly format
                </div>
            </div>

            {/* Honors Section */}
            <div>
                <div style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#111827",
                    marginBottom: 12,
                    letterSpacing: "0.5px"
                }}>
                    HONORS AND AWARDS
                </div>
                <div style={{
                    fontSize: 13,
                    color: "#374151"
                }}>
                    Name of Honor/Award/Grant • Month and Year Given
                </div>
            </div>

            <div style={{
                marginTop: 24,
                paddingTop: 20,
                borderTop: "1px solid #e5e7eb",
                fontSize: 11,
                color: "#9ca3af",
                textAlign: "center"
            }}>
                Basic Resume Template • Ready for customization[file:1]
            </div>
        </div>
    );
};

const ReviewTalent = ({ previewSrc }) => {
    const [showPreview, setShowPreview] = useState(true);
    const [isReviewed, setIsReviewed] = useState(false);
    const [editingField, setEditingField] = useState(null);
    const navigate = useNavigate();

    // Form state for all fields
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
        <div className="" style={{ padding: "24px" }}>
            <div className="vp-breadcrumbs d-flex gap-1 mb-3" >
                <button
                    className="link-button"
                    onClick={() => navigate("/user/user-upload-talent")}
                >
                    <FiArrowLeft /> Talent Management
                </button>
                <span className="crumb">/ Review Talent</span>
            </div>

            {/* Two-column grid */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 2fr",
                    gap: 24,
                    alignItems: "start",
                }}
            >
                {/* LEFT COLUMN */}
                <div
                    style={{
                        backgroundColor: "white",
                        borderRadius: 12,
                        padding: 24,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                        border: "1px solid #f0f0f0",
                    }}
                >
                    <div style={{ marginBottom: 12 }}>
                        <div
                            style={{
                                background: "#f0fdf4",
                                border: "1px solid #bbf7d0",
                                color: "#166534",
                                fontSize: 12,
                                fontWeight: 600,
                                padding: "8px 10px",
                                borderRadius: 8,
                                marginBottom: 4,
                            }}
                        >
                            Basic_Resume.docx.pdf uploaded successfully[file:1]
                        </div>
                    </div>

                    <section style={{ marginBottom: 32 }}>
                        <h4 style={sectionTitleStyle}>2. Edit Information</h4>

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
                    </section>

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

                    <section
                        style={{
                            marginTop: 24,
                            marginBottom: 16,
                            background: "#f0f4ff",
                            border: "1px solid #e0e7ff",
                            color: "#2744a0",
                            padding: 14,
                            borderRadius: 10,
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            fontSize: 13,
                            fontWeight: 600,
                            userSelect: "none",
                            transition: "border-color 0.2s",
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={isReviewed}
                            onChange={e => setIsReviewed(e.target.checked)}
                            style={{
                                width: 18,
                                height: 18,
                                accentColor: "#2744a0",
                                marginRight: 10,
                                cursor: "pointer",
                            }}
                        />
                        I have reviewed and verified all information is correct
                    </section>

                    <div style={{ display: "flex", gap: 10 }}>
                        <button
                            style={{
                                background: "#fff",
                                color: "#2744a0",
                                border: "1.5px solid #e5e7eb",
                                borderRadius: 10,
                                fontWeight: 600,
                                fontSize: 14,
                                padding: "12px 24px",
                                width: "50%",
                                cursor: "pointer",
                            }}
                        >
                            Save as Draft
                        </button>
                        <button
                            disabled={!isReviewed}
                            style={{
                                backgroundColor: isReviewed ? "#6843C7" : "#d1d5db",
                                color: "white",
                                border: "none",
                                borderRadius: 10,
                                fontSize: 14,
                                fontWeight: 600,
                                padding: "12px 24px",
                                width: "50%",
                                cursor: isReviewed ? "pointer" : "not-allowed",
                                transition: "background-color 0.2s",
                            }}
                        >
                            Save to Bench
                        </button>
                    </div>
                </div>

                {/* RIGHT COLUMN - single scroll, 600px tall */}
                <div
                    style={{
                        backgroundColor: "white",
                        borderRadius: 12,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                        border: "1px solid #f0f0f0",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",        // prevent outer scroll
                        height: 600,               // fixed height
                        position: "sticky",
                        top: 20,
                        minWidth: 430
                    }}
                >
                    <div
                        style={{
                            padding: "16px 20px",
                            borderBottom: "1px solid #e5e7eb",
                            flexShrink: 0,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}
                    >
                        <h4 style={sectionTitleStyle}>Preview Resume</h4>
                        <button
                            style={{
                                border: "1px solid #2744a0",
                                backgroundColor: "white",
                                color: "#2744a0",
                                borderRadius: 6,
                                padding: "4px 8px",
                                fontSize: 12,
                                cursor: "pointer",
                                fontWeight: 600
                            }}
                            type="button"
                            onClick={() => setShowPreview(prev => !prev)}
                        >
                            {showPreview ? "Hide Preview" : "Show Preview"}
                        </button>
                    </div>

                    {showPreview && (
                        <div
                            style={{
                                padding: 16,
                                flex: 1,                 // fill remaining height
                                minHeight: 0,            // allow flex child to shrink
                                overflowY: "auto",       // only this area scrolls
                                background: "#fff"
                            }}
                        >
                            <PDFResumePreview />
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

// Helper styles (unchanged)
const sectionTitleStyle = {
    fontSize: 12,
    fontWeight: 600,
    color: "#2744a0",
    marginBottom: 14,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
};

const fieldLabelStyle = {
    fontSize: 11,
    color: "#6b7280",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: 8,
    userSelect: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
    marginTop: 10,
};

const fieldValueStyle = {
    margin: 0,
    fontWeight: 600,
    color: "#111827",
    fontSize: 14,
    lineHeight: 1.4,
    whiteSpace: "pre-wrap",
    minHeight: 38,
    paddingLeft: 6,
    display: "flex",
    alignItems: "center",
};

// EditableField Component (unchanged)
const EditableField = ({ label, value, fieldName, isEditing, onEdit, onSave, onCancel, multiline = false }) => {
    const [tempValue, setTempValue] = useState(value);

    React.useEffect(() => {
        setTempValue(value);
    }, [value, isEditing]);

    const handleSaveClick = () => {
        onSave(fieldName, tempValue);
    };

    return (
        <>
            <div style={fieldLabelStyle}>
                <span>{label} *</span>
                {!isEditing && (
                    <button
                        onClick={() => onEdit(fieldName)}
                        style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            padding: 4,
                            display: "flex",
                            alignItems: "center",
                            color: "#6b7280",
                        }}
                        aria-label={`Edit ${label}`}
                    >
                        <Edit2 size={14} />
                    </button>
                )}
            </div>
            {isEditing ? (
                <div style={{ marginBottom: 12 }}>
                    {multiline ? (
                        <textarea
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "10px 12px",
                                fontSize: 14,
                                border: "1.5px solid #2744a0",
                                borderRadius: 8,
                                fontFamily: "inherit",
                                resize: "vertical",
                                minHeight: 80,
                                outline: "none",
                            }}
                            autoFocus
                        />
                    ) : (
                        <input
                            type="text"
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "10px 12px",
                                fontSize: 14,
                                border: "1.5px solid #2744a0",
                                borderRadius: 8,
                                fontFamily: "inherit",
                                outline: "none",
                            }}
                            autoFocus
                        />
                    )}
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                        <button
                            onClick={handleSaveClick}
                            style={{
                                background: "#2744a0",
                                color: "white",
                                border: "none",
                                borderRadius: 6,
                                padding: "6px 14px",
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: "pointer",
                            }}
                        >
                            Save
                        </button>
                        <button
                            onClick={onCancel}
                            style={{
                                background: "#fff",
                                color: "#6b7280",
                                border: "1px solid #e5e7eb",
                                borderRadius: 6,
                                padding: "6px 14px",
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: "pointer",
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div style={{ ...fieldValueStyle, marginBottom: 12 }}>{value}</div>
            )}
        </>
    );
};

// EditableTags Component (unchanged)
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
        <>
            <div style={fieldLabelStyle}>
                <span>{label} *</span>
                {!isEditing && (
                    <button
                        onClick={() => onEdit(fieldName)}
                        style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            padding: 4,
                            display: "flex",
                            alignItems: "center",
                            color: "#6b7280",
                        }}
                        aria-label={`Edit ${label}`}
                    >
                        <Edit2 size={14} />
                    </button>
                )}
            </div>
            {isEditing ? (
                <div style={{ marginBottom: 12 }}>
                    <textarea
                        value={tempTags}
                        onChange={(e) => setTempTags(e.target.value)}
                        placeholder="Separate items with commas"
                        style={{
                            width: "100%",
                            padding: "10px 12px",
                            fontSize: 14,
                            border: "1.5px solid #2744a0",
                            borderRadius: 8,
                            fontFamily: "inherit",
                            resize: "vertical",
                            minHeight: 80,
                            outline: "none",
                        }}
                        autoFocus
                    />
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                        <button
                            onClick={handleSaveClick}
                            style={{
                                background: "#2744a0",
                                color: "white",
                                border: "none",
                                borderRadius: 6,
                                padding: "6px 14px",
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: "pointer",
                            }}
                        >
                            Save
                        </button>
                        <button
                            onClick={onCancel}
                            style={{
                                background: "#fff",
                                color: "#6b7280",
                                border: "1px solid #e5e7eb",
                                borderRadius: 6,
                                padding: "6px 14px",
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: "pointer",
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 8,
                        minHeight: 38,
                        alignItems: "center",
                        marginBottom: 12,
                    }}
                    aria-label={`${label} tags`}
                >
                    {tags && tags.length > 0 ? (
                        tags.map((tag, idx) => (
                            <span
                                key={idx}
                                style={{
                                    backgroundColor: "#f0f4ff",
                                    color: "#2744a0",
                                    padding: "6px 12px",
                                    borderRadius: 20,
                                    fontSize: 12,
                                    fontWeight: 600,
                                    border: "1px solid #cbd5e1",
                                    userSelect: "none",
                                    display: "inline-flex",
                                    alignItems: "center",
                                }}
                            >
                                {tag}
                            </span>
                        ))
                    ) : (
                        <span style={{ color: "#9ca3af" }}>Add information</span>
                    )}
                </div>
            )}
        </>
    );
};

export default ReviewTalent;
