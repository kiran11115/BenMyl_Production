import React, { useState, useEffect } from "react";
import {
    FiArrowLeft,
    FiSave,
    FiX,
    FiPlus,
    FiTrash2,
    FiBriefcase,
    FiBookOpen,
    FiLayers,
    FiCalendar,
} from "react-icons/fi";
import { useFormik, FieldArray, FormikProvider } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useApprovedEmployeeMutation } from "../../State-Management/Api/UploadResumeApiSlice";

const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    bio: Yup.string().min(50, "Bio must be at least 50 characters").required("Bio is required"),
    phoneNo: Yup.string().required("Phone number is required"),
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    country: Yup.string().required("Country is required"),
    workexperiences: Yup.array().of(
        Yup.object().shape({
            companyName: Yup.string().required("Company name is required"),
            position: Yup.string().required("Position is required"),
            startDate: Yup.string().required("Start date is required"),
        })
    ),
    employeeprojects: Yup.array().of(
        Yup.object().shape({
            projectName: Yup.string().required("Project name is required"),
            role: Yup.string().required("Role is required"),
            startDate: Yup.string().required("Start date is required"),
        })
    ),
    employee_Heighers: Yup.array().of(
        Yup.object().shape({
            university: Yup.string().required("University is required"),
            highestQualification: Yup.string().required("Qualification is required"),
            startDate: Yup.string().required("Start date is required"),
        })
    ),
});

const EditTalentProfile = ({ initialData, onCancel, onSuccess }) => {
    const [approveEmployee, { isLoading: isSaving }] = useApprovedEmployeeMutation();
    const [skillInput, setSkillInput] = useState("");

    const formik = useFormik({
        initialValues: {
            title: initialData?.title || "",
            bio: initialData?.bio || "",
            skills: initialData?.skills || "",
            phoneNo: initialData?.phoneNo || "",
            address: initialData?.address || "",
            city: initialData?.city || "",
            state: initialData?.state || "",
            country: initialData?.country || "",
            workexperiences: initialData?.workexperiences || [],
            employeeprojects: initialData?.employeeprojects || [],
            employee_Heighers: initialData?.employee_Heighers || [],
        },
        validationSchema,
        onSubmit: async (values) => {
            const formData = new FormData();

            // Basic Info
            formData.append("EmployeeID", initialData.employeeID);
            formData.append("CompanyID", initialData.companyID);
            formData.append("FirstName", initialData.firstName);
            formData.append("LastName", initialData.lastName);
            formData.append("Title", values.title);
            formData.append("Bio", values.bio);
            formData.append("Skills", values.skills);

            // Personal & Contact Info
            formData.append("EmailAddress", initialData.emailAddress || "");
            formData.append("PhoneNo", values.phoneNo);
            formData.append("Address", values.address);
            formData.append("City", values.city);
            formData.append("State", values.state);
            formData.append("Country", values.country);
            formData.append("Status", "Approved");

            // Complex objects as strings
            formData.append("workexperiences", JSON.stringify(values.workexperiences.map(exp => ({
                ...exp,
                ExperienceID: exp.experienceID || 0,
                EndDate: exp.endDate || new Date().toISOString().split('T')[0]
            }))));

            formData.append("project", JSON.stringify(values.employeeprojects.map(proj => ({
                ...proj,
                ExperienceID: proj.experienceID || 0,
                EndDate: proj.endDate || new Date().toISOString().split('T')[0]
            }))));

            formData.append("employee_Heighers", JSON.stringify(values.employee_Heighers.map(edu => ({
                ...edu,
                _EductionhigherId: edu._EductionhigherId || 0,
                EndDate: edu.endDate || new Date().toISOString().split('T')[0]
            }))));

            try {
                await approveEmployee(formData).unwrap();
                onSuccess();
            } catch (err) {
                console.error("Failed to save profile:", err);
                alert("Failed to save changes. Please try again.");
            }
        },
    });

    const handleAddSkill = (e) => {
        if (e.key === "Enter" && skillInput.trim()) {
            e.preventDefault();
            const currentSkills = formik.values.skills ? formik.values.skills.split(",").map(s => s.trim()) : [];
            if (!currentSkills.includes(skillInput.trim())) {
                const updatedSkills = [...currentSkills, skillInput.trim()].join(",");
                formik.setFieldValue("skills", updatedSkills);
            }
            setSkillInput("");
        }
    };

    const removeSkill = (skillToRemove) => {
        const currentSkills = formik.values.skills.split(",").map(s => s.trim());
        const updatedSkills = currentSkills.filter(s => s !== skillToRemove).join(",");
        formik.setFieldValue("skills", updatedSkills);
    };

    const getInitials = (firstName, lastName) => {
        const first = firstName?.charAt(0) || "";
        const last = lastName?.charAt(0) || "";
        return (first + last).toUpperCase() || "??";
    };

    return (
        <FormikProvider value={formik}>
            <style>{`
                .auth-password-wrapper {
                    position: relative;
                    width: 100%;
                }
                .auth-icon-left {
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #94a3b8;
                    pointer-events: none;
                    z-index: 5;
                }
                .react-datepicker-wrapper {
                    width: 100%;
                }
                .react-datepicker__input-container input {
                    padding-left: 2.5rem !important;
                }
                .initials-avatar {
                    width: 48px;
                    height: 48px;
                    border-radius: 8px;
                    background: #f1f5f9;
                    color: #475569;
                    font-weight: 700;
                    font-size: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid #e2e8f0;
                }
            `}</style>
            <div className="post-job-form">
                <div className="form-header">
                    <div className="vs-breadcrumbs mb-2 mt-3 d-flex gap-2">
                        <button type="button" className="link-button" onClick={onCancel}>
                            <FiArrowLeft /> Back to Profile
                        </button>
                        <span className="crumb">/ Edit Profile</span>
                    </div>
                    <h1>Edit Profile Page</h1>
                    <p className="muted">Update talent details and professional background</p>
                </div>

                <div className="dashboard-layout">
                    <div className="dashboard-column-main">
                        <div className="premium-card">
                            {/* Basic Information */}
                            <div style={{ marginBottom: "40px" }}>
                                <div className="section-header">
                                    <h3>Basic Information</h3>
                                </div>
                                <div className="grid-2">
                                    <div>
                                        <label className="auth-label">Full Name</label>
                                        <div className="auth-input bg-light" style={{ pointerEvents: 'none', opacity: 0.8 }}>
                                            {initialData?.firstName} {initialData?.lastName}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="auth-label">Professional Title<span style={{ color: "#ef4444" }}> *</span></label>
                                        <input
                                            name="title"
                                            className="auth-input"
                                            value={formik.values.title}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.title && formik.errors.title && <div className="auth-error">{formik.errors.title}</div>}
                                    </div>
                                </div>
                            </div>

                            {/* Personal Details */}
                            <div style={{ marginBottom: "40px" }}>
                                <div className="section-header">
                                    <h3>Personal Details</h3>
                                </div>
                                <div className="grid-2">
                                    <div>
                                        <label className="auth-label">Phone Number<span style={{ color: "#ef4444" }}> *</span></label>
                                        <input
                                            name="phoneNo"
                                            className="auth-input"
                                            value={formik.values.phoneNo}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.phoneNo && formik.errors.phoneNo && <div className="auth-error">{formik.errors.phoneNo}</div>}
                                    </div>
                                    <div>
                                        <label className="auth-label">Street Address<span style={{ color: "#ef4444" }}> *</span></label>
                                        <input
                                            name="address"
                                            className="auth-input"
                                            value={formik.values.address}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.address && formik.errors.address && <div className="auth-error">{formik.errors.address}</div>}
                                    </div>
                                    <div>
                                        <label className="auth-label">City<span style={{ color: "#ef4444" }}> *</span></label>
                                        <input
                                            name="city"
                                            className="auth-input"
                                            value={formik.values.city}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.city && formik.errors.city && <div className="auth-error">{formik.errors.city}</div>}
                                    </div>
                                    <div>
                                        <label className="auth-label">State<span style={{ color: "#ef4444" }}> *</span></label>
                                        <input
                                            name="state"
                                            className="auth-input"
                                            value={formik.values.state}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.state && formik.errors.state && <div className="auth-error">{formik.errors.state}</div>}
                                    </div>
                                    <div>
                                        <label className="auth-label">Country<span style={{ color: "#ef4444" }}> *</span></label>
                                        <input
                                            name="country"
                                            className="auth-input"
                                            value={formik.values.country}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.country && formik.errors.country && <div className="auth-error">{formik.errors.country}</div>}
                                    </div>
                                </div>
                            </div>

                            {/* Bio & Skills */}
                            <div style={{ marginBottom: "40px" }}>
                                <div className="section-header">
                                    <h3>Professional Summary & Skills</h3>
                                </div>
                                <div className="auth-form-group">
                                    <label className="auth-label">Bio<span style={{ color: "#ef4444" }}> *</span></label>
                                    <textarea
                                        name="bio"
                                        className="auth-input"
                                        style={{ height: "100px" }}
                                        rows={6}
                                        value={formik.values.bio}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.bio && formik.errors.bio && <div className="auth-error">{formik.errors.bio}</div>}
                                </div>
                                <div className="auth-form-group mt-3">
                                    <label className="auth-label">Skills</label>
                                    <input
                                        className="auth-input"
                                        placeholder="Add skills (Enter)"
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        onKeyDown={handleAddSkill}
                                    />
                                    <div className="modal-tags-row mt-2">
                                        {formik.values.skills && formik.values.skills.split(",").map((skill) => skill.trim()).filter(Boolean).map((skill, idx) => (
                                            <span key={idx} className="status-tag status-progress">
                                                {skill}
                                                <FiX size={12} className="ms-1" style={{ cursor: "pointer" }} onClick={() => removeSkill(skill)} />
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Work Experience */}
                            <div style={{ marginBottom: "40px" }}>
                                <div className="section-header d-flex justify-content-between align-items-center">
                                    <h3>Work Experience</h3>
                                    <button
                                        type="button"
                                        className="btn-secondary"
                                        onClick={() => formik.setFieldValue("workexperiences", [...formik.values.workexperiences, { companyName: "", position: "", startDate: "", endDate: "", description: "" }])}
                                    >
                                        <FiPlus /> Add Experience
                                    </button>
                                </div>
                                <FieldArray name="workexperiences">
                                    {({ remove }) => (
                                        <div className="experience-edit-list">
                                            {formik.values.workexperiences.map((exp, index) => (
                                                <div key={index} className="experience-item-card mb-3 p-3 border rounded">
                                                    <div className="d-flex justify-content-between mb-2">
                                                        <h5>Experience #{index + 1}</h5>
                                                        <button type="button" className="text-danger border-0 bg-transparent" onClick={() => remove(index)}>
                                                            <FiTrash2 />
                                                        </button>
                                                    </div>
                                                    <div className="grid-2">
                                                        <input
                                                            className="auth-input mb-2"
                                                            placeholder="Company Name"
                                                            name={`workexperiences.${index}.companyName`}
                                                            value={exp.companyName}
                                                            onChange={formik.handleChange}
                                                        />
                                                        <input
                                                            className="auth-input mb-2"
                                                            placeholder="Position"
                                                            name={`workexperiences.${index}.position`}
                                                            value={exp.position}
                                                            onChange={formik.handleChange}
                                                        />
                                                    </div>
                                                    <div className="grid-2">
                                                        <div>
                                                            <label className="auth-label small">Start Date</label>
                                                            <div className="auth-password-wrapper">
                                                                <DatePicker
                                                                    className="auth-input w-100"
                                                                    selected={exp.startDate ? new Date(exp.startDate) : null}
                                                                    onChange={(date) => formik.setFieldValue(`workexperiences.${index}.startDate`, date ? date.toISOString() : "")}
                                                                    dateFormat="dd-MMM-yyyy"
                                                                    placeholderText="DD-MMM-YYYY"
                                                                    style={{ paddingLeft: '2.5rem' }}
                                                                />
                                                                <FiCalendar size={16} className="auth-icon-left" />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="auth-label small">End Date</label>
                                                            <div className="auth-password-wrapper">
                                                                <DatePicker
                                                                    className="auth-input w-100"
                                                                    selected={exp.endDate ? new Date(exp.endDate) : null}
                                                                    onChange={(date) => formik.setFieldValue(`workexperiences.${index}.endDate`, date ? date.toISOString() : "")}
                                                                    dateFormat="dd-MMM-yyyy"
                                                                    placeholderText="DD-MMM-YYYY"
                                                                    style={{ paddingLeft: '2.5rem' }}
                                                                />
                                                                <FiCalendar size={16} className="auth-icon-left" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <textarea
                                                        className="auth-input mt-2"
                                                        placeholder="Description"
                                                        style={{ height: "100px" }}
                                                        rows={2}
                                                        name={`workexperiences.${index}.description`}
                                                        value={exp.description}
                                                        onChange={formik.handleChange}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </FieldArray>
                            </div>

                            {/* Projects */}
                            <div style={{ marginBottom: "40px" }}>
                                <div className="section-header d-flex justify-content-between align-items-center">
                                    <h3>Key Projects</h3>
                                    <button
                                        type="button"
                                        className="btn-secondary"
                                        onClick={() => formik.setFieldValue("employeeprojects", [...formik.values.employeeprojects, { projectName: "", role: "", startDate: "", endDate: "", description: "", skills: "" }])}
                                    >
                                        <FiPlus /> Add Project
                                    </button>
                                </div>
                                <FieldArray name="employeeprojects">
                                    {({ remove }) => (
                                        <div className="experience-edit-list">
                                            {formik.values.employeeprojects.map((proj, index) => (
                                                <div key={index} className="experience-item-card mb-3 p-3 border rounded">
                                                    <div className="d-flex justify-content-between mb-2">
                                                        <h5>Project #{index + 1}</h5>
                                                        <button type="button" className="text-danger border-0 bg-transparent" onClick={() => remove(index)}>
                                                            <FiTrash2 />
                                                        </button>
                                                    </div>
                                                    <div className="grid-2">
                                                        <input
                                                            className="auth-input mb-2"
                                                            placeholder="Project Name"
                                                            name={`employeeprojects.${index}.projectName`}
                                                            value={proj.projectName}
                                                            onChange={formik.handleChange}
                                                        />
                                                        <input
                                                            className="auth-input mb-2"
                                                            placeholder="Role"
                                                            name={`employeeprojects.${index}.role`}
                                                            value={proj.role}
                                                            onChange={formik.handleChange}
                                                        />
                                                    </div>
                                                    <div className="grid-2">
                                                        <div>
                                                            <label className="auth-label small">Start Date</label>
                                                            <div className="auth-password-wrapper">
                                                                <DatePicker
                                                                    className="auth-input w-100"
                                                                    selected={proj.startDate ? new Date(proj.startDate) : null}
                                                                    onChange={(date) => formik.setFieldValue(`employeeprojects.${index}.startDate`, date ? date.toISOString() : "")}
                                                                    dateFormat="dd-MMM-yyyy"
                                                                    placeholderText="DD-MMM-YYYY"
                                                                    style={{ paddingLeft: '2.5rem' }}
                                                                />
                                                                <FiCalendar size={16} className="auth-icon-left" />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="auth-label small">End Date</label>
                                                            <div className="auth-password-wrapper">
                                                                <DatePicker
                                                                    className="auth-input w-100"
                                                                    selected={proj.endDate ? new Date(proj.endDate) : null}
                                                                    onChange={(date) => formik.setFieldValue(`employeeprojects.${index}.endDate`, date ? date.toISOString() : "")}
                                                                    dateFormat="dd-MMM-yyyy"
                                                                    placeholderText="DD-MMM-YYYY"
                                                                    style={{ paddingLeft: '2.5rem' }}
                                                                />
                                                                <FiCalendar size={16} className="auth-icon-left" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <textarea
                                                        className="auth-input mt-2"
                                                        placeholder="Project Description"
                                                        style={{ height: "100px" }}
                                                        rows={2}
                                                        name={`employeeprojects.${index}.description`}
                                                        value={proj.description}
                                                        onChange={formik.handleChange}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </FieldArray>
                            </div>

                            {/* Education */}
                            <div style={{ marginBottom: "40px" }}>
                                <div className="section-header d-flex justify-content-between align-items-center">
                                    <h3>Education</h3>
                                    <button
                                        type="button"
                                        className="btn-secondary"
                                        onClick={() => formik.setFieldValue("employee_Heighers", [...formik.values.employee_Heighers, { university: "", highestQualification: "", fieldofstudy: "", startDate: "", endDate: "" }])}
                                    >
                                        <FiPlus /> Add Education
                                    </button>
                                </div>
                                <FieldArray name="employee_Heighers">
                                    {({ remove }) => (
                                        <div className="experience-edit-list">
                                            {formik.values.employee_Heighers.map((edu, index) => (
                                                <div key={index} className="experience-item-card mb-3 p-3 border rounded">
                                                    <div className="d-flex justify-content-between mb-2">
                                                        <h5>Education #{index + 1}</h5>
                                                        <button type="button" className="text-danger border-0 bg-transparent" onClick={() => remove(index)}>
                                                            <FiTrash2 />
                                                        </button>
                                                    </div>
                                                    <div className="grid-2">
                                                        <input
                                                            className="auth-input mb-2"
                                                            placeholder="University"
                                                            name={`employee_Heighers.${index}.university`}
                                                            value={edu.university}
                                                            onChange={formik.handleChange}
                                                        />
                                                        <input
                                                            className="auth-input mb-2"
                                                            placeholder="Qualification"
                                                            name={`employee_Heighers.${index}.highestQualification`}
                                                            value={edu.highestQualification}
                                                            onChange={formik.handleChange}
                                                        />
                                                    </div>
                                                    <div className="grid-2">
                                                        <div>
                                                            <label className="auth-label small">Start Date</label>
                                                            <div className="auth-password-wrapper">
                                                                <DatePicker
                                                                    className="auth-input w-100"
                                                                    selected={edu.startDate ? new Date(edu.startDate) : null}
                                                                    onChange={(date) => formik.setFieldValue(`employee_Heighers.${index}.startDate`, date ? date.toISOString() : "")}
                                                                    dateFormat="dd-MMM-yyyy"
                                                                    placeholderText="DD-MMM-YYYY"
                                                                    style={{ paddingLeft: '2.5rem' }}
                                                                />
                                                                <FiCalendar size={16} className="auth-icon-left" />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="auth-label small">End Date</label>
                                                            <div className="auth-password-wrapper">
                                                                <DatePicker
                                                                    className="auth-input w-100"
                                                                    selected={edu.endDate ? new Date(edu.endDate) : null}
                                                                    onChange={(date) => formik.setFieldValue(`employee_Heighers.${index}.endDate`, date ? date.toISOString() : "")}
                                                                    dateFormat="dd-MMM-yyyy"
                                                                    placeholderText="DD-MMM-YYYY"
                                                                    style={{ paddingLeft: '2.5rem' }}
                                                                />
                                                                <FiCalendar size={16} className="auth-icon-left" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </FieldArray>
                            </div>

                            <div className="d-flex justify-content-between mt-4 pt-3 border-top">
                                <button type="button" className="btn-secondary" onClick={onCancel}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary" onClick={formik.handleSubmit} disabled={isSaving}>
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-column-side">
                        <div className="sticky-preview">
                            <h3 className="section-title mb-3">Live Preview</h3>
                            <div className="project-card p-3">
                                <div className="d-flex align-items-center gap-3 mb-3">
                                    <div className="initials-avatar">
                                        {getInitials(initialData?.firstName, initialData?.lastName)}
                                    </div>
                                    <div>
                                        <h4 className="mb-0">{initialData?.firstName} {initialData?.lastName}</h4>
                                        <p className="small text-muted mb-0">{formik.values.title}</p>
                                        <p className="small text-muted mb-0" style={{ fontSize: '11px' }}>{initialData?.emailAddress}</p>
                                    </div>
                                </div>
                                <div className="preview-meta small text-muted">
                                    <p className="mb-2 line-clamp-3">{formik.values.bio}</p>
                                    <div className="skills-cloud d-flex flex-wrap gap-1">
                                        {formik.values.skills && formik.values.skills.split(",").map((s, i) => (
                                            <span key={i} className="status-tag status-progress" style={{ fontSize: 10 }}>{s.trim()}</span>
                                        ))}
                                    </div>
                                </div>
                                <hr />
                                <div className="preview-sections">
                                    <div className="mb-2">
                                        <h6 className="d-flex align-items-center gap-1"><FiBriefcase size={12} /> Experience</h6>
                                        <p className="small mb-0">{formik.values.workexperiences.length} entries added</p>
                                    </div>
                                    <div className="mb-2">
                                        <h6 className="d-flex align-items-center gap-1"><FiLayers size={12} /> Projects</h6>
                                        <p className="small mb-0">{formik.values.employeeprojects.length} entries added</p>
                                    </div>
                                    <div>
                                        <h6 className="d-flex align-items-center gap-1"><FiBookOpen size={12} /> Education</h6>
                                        <p className="small mb-0">{formik.values.employee_Heighers.length} entries added</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </FormikProvider>
    );
};

export default EditTalentProfile;
