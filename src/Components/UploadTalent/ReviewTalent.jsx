import React, { useEffect, useState } from "react";
import { Edit2, Plus, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import "./UploadTalent.css";
import { useApprovedEmployeeMutation, useDraftProfileEmployeeMutation, useGetEmployeeResumeQuery } from "../../State-Management/Api/UploadResumeApiSlice";
import { ValidationErrorModal, ConfirmSaveModal, SaveSuccessModal, SaveErrorModal } from "./SaveTalentAlert";

const formatDateToDisplay = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (isNaN(date)) return value;

  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();

  return `${day}-${month}-${year}`; // 16-Feb-2026
};

const formatDateToInput = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (isNaN(date)) return "";
  return date.toISOString().split("T")[0]; // YYYY-MM-DD for input type=date
};


const PDFResumePreview = ({ data }) => {
  if (!data) return null;

  return (
    <div className="auth-card" style={{ flexDirection: "column", minHeight: "800px", padding: "40px", maxWidth: "100%" }}>
      <div style={{ textAlign: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: 20, marginBottom: 20 }}>
        <h1 className="auth-title">
          {data.firstName} {data.lastName}
        </h1>
        <div className="auth-subtitle">
          {data.emailAddress} • {data.phoneNo}
          <br />
          {data.city}, {data.state}, {data.country}
        </div>
      </div>

      {data.bio && (
    <div className="auth-form-group">
      <h3 className="auth-label">PROFESSIONAL SUMMARY</h3>
      <div className="auth-subtitle" style={{ lineHeight: 1.6 }}>
        {data.bio}
      </div>
    </div>
  )}

      {/* EDUCATION */}
      <div className="auth-form-group">
        <h3 className="auth-label">EDUCATION</h3>
        {data.employee_Heighers?.map((e, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div className="auth-label">{e.university}</div>
            <div className="auth-subtitle">
              {e.fieldofstudy} • {e.percentage}
            </div>
            <div className="auth-subtitle">
              {e.startDate?.slice(0, 4)} - {e.endDate?.slice(0, 4)}
            </div>
          </div>
        ))}
      </div>

      {/* EXPERIENCE */}
      <div className="auth-form-group">
        <h3 className="auth-label">EXPERIENCE</h3>
        {data.workexperiences?.map((e, i) => (
          <div key={i} style={{ marginBottom: 14 }}>
            <div className="auth-label">{e.companyName}</div>
            <div className="auth-subtitle">
              {e.position} • {e.startDate?.slice(0, 7)} - {e.endDate ? e.endDate.slice(0, 7) : "Present"}
            </div>
            <ul className="auth-subtitle" style={{ paddingLeft: 20 }}>
              {e.description?.split(".").map((d, idx) => d.trim() && <li key={idx}>{d}</li>)}
            </ul>
          </div>
        ))}
      </div>

      {/* PROJECTS */}
      <div className="auth-form-group">
        <h3 className="auth-label">PROJECTS</h3>
        {data.employeeprojects?.map((p, i) => (
          <div key={i} style={{ marginBottom: 14 }}>
            <div className="auth-label">{p.projectName}</div>
            <div className="auth-subtitle">
              {p.startDate?.slice(0, 7)} - {p.endDate ? p.endDate.slice(0, 7) : "Present"}
            </div>
            <div className="auth-subtitle">{p.description}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
              {p.skills?.split(",").map((s, idx) => (
                <span key={idx} className="status-tag status-progress">{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* SKILLS */}
      <div className="auth-form-group">
        <h3 className="auth-label">SKILLS</h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {data.skills?.split(",").map((s, i) => (
            <span key={i} className="status-tag status-progress">{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

// ===== VALIDATION FUNCTIONS =====
const validateFirstName = (val) => {
    if (!val || val.trim() === "") return "First name is required";
    if (!/^[a-zA-Z\s]*$/.test(val)) return "First name should contain only letters";
    return null;
};

const validateLastName = (val) => {
    if (!val || val.trim() === "") return "Last name is required";
    if (!/^[a-zA-Z\s]*$/.test(val)) return "Last name should contain only letters";
    return null;
};

const validatePosition = (val) => {
    if (!val || val.trim() === "") return "Position is required";
    if (!/^[a-zA-Z\s]*$/.test(val)) return "Position should contain only letters";
    return null;
};

const validatePhone = (val) => {
    if (!val || val.trim() === "") return "Phone number is required";
    if (!/^\d+$/.test(val.replace(/[\s\-\(\)+]/g, ""))) return "Phone number should contain only numbers";
    return null;
};

const validateEmail = (val) => {
    if (!val || val.trim() === "") return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return "Please enter a valid email address";
    if (!val.toLowerCase().includes(".com")) return "Email should have .com domain";
    return null;
};

// ===== PERSONAL INFO VALIDATION FUNCTIONS =====
const validateDOB = (val) => {
    if (!val || val.trim() === "") return "Date of Birth is required";
    return null;
};

const validateGender = (val) => {
    if (!val || val.trim() === "") return "Gender is required";
    if (!/^[a-zA-Z\s]*$/.test(val)) return "Gender should contain only letters";
    return null;
};

const validateEmergency = (val) => {
    if (!val || val.trim() === "") return "Emergency contact is required";
    if (!/^\d+$/.test(val.replace(/[\s\-\(\)]/g, ""))) return "Emergency contact should contain only numbers";
    return null;
};

const validateCountry = (val) => {
    if (!val || val.trim() === "") return "Country is required";
    if (!/^[a-zA-Z\s]*$/.test(val)) return "Country should contain only letters";
    return null;
};

const validateState = (val) => {
    if (!val || val.trim() === "") return "State is required";
    if (!/^[a-zA-Z\s]*$/.test(val)) return "State should contain only letters";
    return null;
};

const validateCity = (val) => {
    if (!val || val.trim() === "") return "City is required";
    if (!/^[a-zA-Z\s]*$/.test(val)) return "City should contain only letters";
    return null;
};

const validateBio = (val) => {
    if (!val || val.trim() === "") return "Bio is required";
    if (val.trim().length < 50) return "Bio should contain at least 50 characters";
    return null;
};

// ===== EDUCATION VALIDATION FUNCTIONS =====
const validateUniversity = (val) => {
  if (!val || val.trim() === "") return "University is required";
  if (!/^[a-zA-Z\s.]*$/.test(val)) return "University should contain only letters";
  return null;
};

const validateQualification = (val) => {
  if (!val || val.trim() === "") return "Qualification is required";
  if (!/^[a-zA-Z\s]*$/.test(val)) return "Qualification should contain only letters";
  return null;
};

const validateEduStartDate = (val) => {
  if (!val || val.trim() === "") return "Start date is required";
  return null;
};

const validateEduEndDate = (val) => {
  if (!val || val.trim() === "") return "End date is required";
  return null;
};

const validateEduField = (val) => {
  if (!val || val.trim() === "") return "Field of study is required";
  if (!/^[a-zA-Z\s]*$/.test(val)) return "Field should contain only letters";
  return null;
};

const validatePercentage = (val) => {
  if (!val || String(val).trim() === "") return "Percentage is required";
  if (!/^\d+(?:\.\d+)?$/.test(String(val).trim())) return "Percentage should contain only numbers";
  return null;
};

const validateCertifications = (val) => {
  if (!val || val.trim() === "") return "Certifications is required";
  if (!/^[a-zA-Z,\s]*$/.test(val)) return "Certifications should contain only letters, commas and spaces";
  return null;
};

// ===== EXPERIENCE VALIDATION FUNCTIONS =====
const validateCompany = (val) => {
      if (!val || val.trim() === "") return "Company name is required";
  return null;
};

const validateExpPosition = (val) => {
  if (!val || val.trim() === "") return "Position is required";
  return null;
};

const validateExpStartDate = (val) => {
  if (!val || val.trim() === "") return "Start date is required";
  return null;
};

const validateExpEndDate = (val) => {
  if (!val || val.trim() === "") return "End date is required";
  return null;
};

const validateExpSkills = (val) => {
  if (!val || val.trim() === "") return "Skills are required";
  return null;
};

const validateExpDescription = (val) => {
  if (!val || val.trim() === "") return "Description is required";
  return null;
};

// ===== PROJECTS VALIDATION FUNCTIONS =====
const validateProjectName = (val) => {
  if (!val || val.trim() === "") return " name is required";
  if (!/^[a-zA-Z0-9\s]*$/.test(val)) return "Project name should contain only letters";
  return null;
};

const validateProjectRole = (val) => {
  if (!val || val.trim() === "") return "Role is required";
  return null;
};

const validateProjectStartDate = (val) => {
  if (!val || val.trim() === "") return "Start date is required";
  return null;
};

const validateProjectEndDate = (val) => {
  if (!val || val.trim() === "") return "End date is required";
  return null;
};

const validateProjectSkills = (val) => {
  if (!val || val.trim() === "") return "Skills are required";
  return null;
};

const validateProjectDescription = (val) => {
  if (!val || val.trim() === "") return "Description is required";
  return null;
};

// ===== GET VALIDATION FUNCTION BY FIELD =====
const getValidationForField = (fieldName, section) => {
  const key = String(fieldName).toLowerCase();
  
  // Experience section has its own validators
  if (section === "experience") {
    const expValidations = {
      company: validateCompany,
      position: validateExpPosition,
      startdate: validateExpStartDate,
      enddate: validateExpEndDate,
      skills: validateExpSkills,
      description: validateExpDescription
    };
    return expValidations[key] || null;
  }

  // Projects section has its own validators
  if (section === "projects") {
    const projValidations = {
      name: validateProjectName,
      role: validateProjectRole,
      startdate: validateProjectStartDate,
      enddate: validateProjectEndDate,
      skills: validateProjectSkills,
      description: validateProjectDescription
    };
    return projValidations[key] || null;
  }

  // Default validations for other sections
  const validations = {
    firstname: validateFirstName,
    lastname: validateLastName,
    position: validatePosition,
    phone: validatePhone,
    email: validateEmail,
    dob: validateDOB,
    gender: validateGender,
    emergency: validateEmergency,
    country: validateCountry,
    state: validateState,
    city: validateCity,
    bio: validateBio,
    university: validateUniversity,
    qualification: validateQualification,
    startdate: validateEduStartDate,
    enddate: validateEduEndDate,
    field: validateEduField,
    percentage: validatePercentage,
    certifications: validateCertifications
  };
  return validations[key] || null;
};

const EditableField = ({ label, value, editing, onEdit, onSave, onCancel, section }) => {

    const isDateField =
        label.toLowerCase().includes("date") ||
        label.toLowerCase().includes("dob");

    const [temp, setTemp] = useState(
        isDateField ? formatDateToInput(value) : (value || "")
    );
    
    const [error, setError] = useState(null);

    // Get validation function for fields, passing section for context
    const validationFn = (section === "basicInfo" || section === "personalInfo" || section === "education" || section === "experience" || section === "projects") ? getValidationForField(label, section) : null;

    const handleSave = () => {
        // Validate if validation function exists
        if (validationFn) {
            const validationError = validationFn(temp);
            if (validationError) {
                setError(validationError);
                return;
            }
        }
        setError(null);
        if (isDateField) {
            onSave(temp); // save YYYY-MM-DD internally
        } else {
            onSave(temp);
        }
    };

    return (
        <div className="auth-form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <label className="auth-label">{label}</label>
                {!editing && (
                    <button className="auth-link" onClick={onEdit}>
                        <Edit2 size={12} /> Edit
                    </button>
                )}
            </div>

            {editing ? (
                <>
                    {isDateField ? (
                        <input
                            type="date"
                            className="auth-input"
                            value={temp}
                            onChange={e => { setTemp(e.target.value); setError(null); }}
                            autoFocus
                        />
                    ) : (
                        <input
                            className="auth-input"
                            value={temp}
                            onChange={e => { setTemp(e.target.value); setError(null); }}
                            autoFocus
                            style={{ borderColor: error ? '#ef4444' : undefined }}
                        />
                    )}
                    {error && <div style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{error}</div>}

                    <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                        <button className="btn-primary" onClick={handleSave} disabled={error}>
                            Save
                        </button>
                        <button className="btn-secondary" onClick={onCancel}>
                            Cancel
                        </button>
                    </div>
                </>
            ) : (
                <div
                    className="auth-input"
                    style={{
                        border: 'none',
                        padding: '4px 0',
                        fontWeight: 600,
                        height: "100%"
                    }}
                >
                    {isDateField
                        ? formatDateToDisplay(value)
                        : (value || "—")}
                </div>
            )}
        </div>
    );
};


const EditableTextarea = ({ label, value, editing, onEdit, onSave, onCancel, section }) => {
    const [temp, setTemp] = useState(value || "");
    const [error, setError] = useState(null);

    // Get validation function for personal info, experience and projects description fields, passing section for context
    const validationFn = (section === "personalInfo" || section === "experience" || section === "projects") ? getValidationForField(label, section) : null;

    const handleSave = () => {
        // Validate if validation function exists
        if (validationFn) {
            const validationError = validationFn(temp);
            if (validationError) {
                setError(validationError);
                return;
            }
        }
        setError(null);
        onSave(temp);
    };

    return (
        <div className="auth-form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <label className="auth-label">{label}</label>
                {!editing && <button className="auth-link" onClick={onEdit}><Edit2 size={12} /> Edit</button>}
            </div>
            {editing ? (
                <>
                    <textarea 
                        className="auth-input" 
                        style={{ minHeight: 120, borderColor: error ? '#ef4444' : undefined }} 
                        value={temp} 
                        onChange={e => { setTemp(e.target.value); setError(null); }} 
                    />
                    {error && <div style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{error}</div>}
                    <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                        <button className="btn-primary" onClick={handleSave} disabled={error}>Save</button>
                        <button className="btn-secondary" onClick={onCancel}>Cancel</button>
                    </div>
                </>
            ) : (
                <div className="auth-input" style={{ border: 'none', padding: '4px 0', height: "100%" }}>{value || "—"}</div>
            )}
        </div>
    );
};

const EditableTags = ({ label, values, editing, onEdit, onSave, onCancel, section }) => {
    const [temp, setTemp] = useState(values.join(", "));
    const [error, setError] = useState(null);

    // validation function applies when a section provides a mapped validator (e.g., skills in experience, certifications in education)
    const validationFn = section ? getValidationForField(label, section) : null;

    const handleSave = () => {
        if (validationFn) {
            const validationError = validationFn(temp);
            if (validationError) {
                setError(validationError);
                return;
            }
        }
        setError(null);
        onSave(temp.split(",").map(t => t.trim()).filter(Boolean));
    };

    return (
        <div className="auth-form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label className="auth-label">{label}</label>
                {!editing && <button className="auth-link" onClick={onEdit}><Edit2 size={12} /> Edit</button>}
            </div>
            {editing ? (
                <>
                    <textarea className="auth-input" style={{ minHeight: 100, borderColor: error ? '#ef4444' : undefined }} value={temp} onChange={e => { setTemp(e.target.value); setError(null); }} />
                    {error && <div style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{error}</div>}
                    <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                        <button className="btn-primary" onClick={handleSave} disabled={!!error}>Save</button>
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
    const { state } = useLocation();
  const employeeID = state?.employeeID;

  const { data, isLoading } = useGetEmployeeResumeQuery(employeeID);
  const [approveEmployee, { isLoading: isSaving }] =
  useApprovedEmployeeMutation();
  const [draftProfile, { isLoading: draft }] =
  useDraftProfileEmployeeMutation();
    const [isReviewed, setIsReviewed] = useState(false);

    // SINGLE OPEN ACCORDION
    const [openAccordion, setOpenAccordion] = useState("basicInfo");
    const toggleAccordion = (key) => setOpenAccordion(prev => prev === key ? null : key);

    const [editingSection, setEditingSection] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);
    const beginEdit = (s, i = null) => { setEditingSection(s); setEditingIndex(i); };
    const cancelEdit = () => { setEditingSection(null); setEditingIndex(null); };

    const [talent, setTalent] = useState(null);
    const [validationErrorsState, setValidationErrorsState] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const getToday = () => {
  return new Date().toISOString().split("T")[0]; // YYYY-MM-DD
};

// ===== VALIDATE ALL BASIC INFO =====
const validateAllBasicInfo = (basicInfo) => {
  const errors = [];
  
  const firstNameError = validateFirstName(basicInfo.firstName);
  if (firstNameError) errors.push(firstNameError);
  
  const lastNameError = validateLastName(basicInfo.lastName);
  if (lastNameError) errors.push(lastNameError);
  
  const positionError = validatePosition(basicInfo.position);
  if (positionError) errors.push(positionError);
  
  const phoneError = validatePhone(basicInfo.phone);
  if (phoneError) errors.push(phoneError);
  
  const emailError = validateEmail(basicInfo.email);
  if (emailError) errors.push(emailError);
  
  return errors;
};

// ===== VALIDATE ALL PERSONAL INFO =====
const validateAllPersonalInfo = (personalInfo) => {
  const errors = [];
  
  const dobError = validateDOB(personalInfo.dob);
  if (dobError) errors.push(dobError);
  
  const genderError = validateGender(personalInfo.gender);
  if (genderError) errors.push(genderError);
  
  const emergencyError = validateEmergency(personalInfo.emergency);
  if (emergencyError) errors.push(emergencyError);
  
  const countryError = validateCountry(personalInfo.country);
  if (countryError) errors.push(countryError);
  
  const stateError = validateState(personalInfo.state);
  if (stateError) errors.push(stateError);
  
  const cityError = validateCity(personalInfo.city);
  if (cityError) errors.push(cityError);
  
  const bioError = validateBio(personalInfo.bio);
  if (bioError) errors.push(bioError);
  
  return errors;
};

// ===== VALIDATE ALL EDUCATION ENTRIES =====
const validateAllEducation = (educationArr) => {
  const errors = [];
  if (!Array.isArray(educationArr)) return errors;
  educationArr.forEach((edu, idx) => {
    const uniErr = validateUniversity(edu.university);
    if (uniErr) errors.push(`Education[${idx}] University: ${uniErr}`);

    const qualErr = validateQualification(edu.qualification);
    if (qualErr) errors.push(`Education[${idx}] Qualification: ${qualErr}`);

    const sdErr = validateEduStartDate(edu.startDate);
    if (sdErr) errors.push(`Education[${idx}] Start Date: ${sdErr}`);

    const edErr = validateEduEndDate(edu.endDate);
    if (edErr) errors.push(`Education[${idx}] End Date: ${edErr}`);

    const fieldErr = validateEduField(edu.field);
    if (fieldErr) errors.push(`Education[${idx}] Field: ${fieldErr}`);

    const perErr = validatePercentage(edu.percentage);
    if (perErr) errors.push(`Education[${idx}] Percentage: ${perErr}`);

    const certs = (edu.certifications || []).join(", ");
    const certErr = validateCertifications(certs);
    if (certErr) errors.push(`Education[${idx}] Certifications: ${certErr}`);
  });
  return errors;
};

// ===== VALIDATE ALL EXPERIENCE ENTRIES =====
const validateAllExperience = (experienceArr) => {
  const errors = [];
  if (!Array.isArray(experienceArr)) return errors;
  experienceArr.forEach((exp, idx) => {
    const compErr = validateCompany(exp.company);
    if (compErr) errors.push(`Experience[${idx}] Company: ${compErr}`);

    const posErr = validateExpPosition(exp.position);
    if (posErr) errors.push(`Experience[${idx}] Position: ${posErr}`);

    const sdErr = validateExpStartDate(exp.startDate);
    if (sdErr) errors.push(`Experience[${idx}] Start Date: ${sdErr}`);

    const edErr = validateExpEndDate(exp.endDate);
    if (edErr) errors.push(`Experience[${idx}] End Date: ${edErr}`);

    const skillsStr = Array.isArray(exp.skills) ? exp.skills.join(", ") : (exp.skills || "");
    const skillErr = validateExpSkills(skillsStr);
    if (skillErr) errors.push(`Experience[${idx}] Skills: ${skillErr}`);

    const descErr = validateExpDescription(exp.description);
    if (descErr) errors.push(`Experience[${idx}] Description: ${descErr}`);
  });
  return errors;
};


// ===== VALIDATE ALL PROJECTS ENTRIES =====
const validateAllProjects = (projectsArr) => {
  const errors = [];
  if (!Array.isArray(projectsArr)) return errors;
  projectsArr.forEach((proj, idx) => {
    const nameErr = validateProjectName(proj.name);
    if (nameErr) errors.push(`Project[${idx}] Name: ${nameErr}`);

    const roleErr = validateProjectRole(proj.role);
    if (roleErr) errors.push(`Project[${idx}] Role: ${roleErr}`);

    const sdErr = validateProjectStartDate(proj.startDate);
    if (sdErr) errors.push(`Project[${idx}] Start Date: ${sdErr}`);

    const edErr = validateProjectEndDate(proj.endDate);
    if (edErr) errors.push(`Project[${idx}] End Date: ${edErr}`);

    const skillsStr = Array.isArray(proj.skills) ? proj.skills.join(", ") : (proj.skills || "");
    const skillErr = validateProjectSkills(skillsStr);
    if (skillErr) errors.push(`Project[${idx}] Skills: ${skillErr}`);

    const descErr = validateProjectDescription(proj.description);
    if (descErr) errors.push(`Project[${idx}] Description: ${descErr}`);
  });
  return errors;
};


    const handleSaveTalent = async () => {
  if (!isReviewed) return;

  // Validate basic info before saving
  const validationErrors = validateAllBasicInfo(talent.basicInfo);
  const personalErrors = validateAllPersonalInfo(talent.personalInfo);
  const educationErrors = validateAllEducation(talent.education);
  const experienceErrors = validateAllExperience(talent.experience);
  const projectErrors = validateAllProjects(talent.projects);
  
  const allErrors = [...validationErrors, ...personalErrors, ...educationErrors, ...experienceErrors, ...projectErrors];
  if (allErrors.length > 0) {
    setValidationErrorsState(allErrors[0]);
    return;
  }

  const formData = new FormData();

/* ===== BASIC INFO ===== */
formData.append("EmployeeID", data.employeeID);
formData.append("CompanyID", data.companyID);
formData.append("BranchID", data.branchID ?? 0);

formData.append("FirstName", talent.basicInfo.firstName);
formData.append("LastName", talent.basicInfo.lastName);
formData.append("Title", talent.basicInfo.position);
formData.append("PhoneNo", talent.basicInfo.phone);
formData.append("EmailAddress", talent.basicInfo.email);

formData.append("ProfilePicture", ""); // null not allowed in FormData
formData.append("ResumeFilePath", data.resumeFilePath ?? "");

/* ===== PERSONAL INFO ===== */
formData.append("DOB", talent.personalInfo.dob ?? "");
formData.append("Gender", talent.personalInfo.gender ?? "");
formData.append("EmergencyContactNumber", talent.personalInfo.emergency ?? "");

formData.append("Country", talent.personalInfo.country ?? "");
formData.append("State", talent.personalInfo.state ?? "");
formData.append("City", talent.personalInfo.city ?? "");
formData.append("Address", talent.personalInfo.address ?? "");
formData.append("Bio", talent.personalInfo.bio ?? "");

/* ===== SKILLS ===== */
formData.append("Skills", talent.basicInfo.skills.join(","));

/* ===== META ===== */
formData.append("InsertBy", data.uploadedBy ?? "");
formData.append("NoofExperience", data.noofExperience ?? 0);
formData.append("EmpDetailID", 0);
formData.append("EmpID", 0);
formData.append("EmployeeCode", data.employeeCode ?? "");
formData.append("department", data.department ?? "");
formData.append("Manager", data.manager ?? "");
formData.append("Supervisor", "");
formData.append("startdate", data.startDate ?? "");
formData.append("lastdate", data.endDate ?? "");
formData.append("Status", "Approved");

/* ===== SALARY ===== */
formData.append("Salary", data.salary ?? "");
formData.append("PayFrequency", data.salaryFrequency ?? "");

/* ===== PREFERENCES ===== */
formData.append("PreferedLanguage", data.prefLanguage ?? "");
formData.append("Prefereddistancefromhome", data.prefDistHome ?? "");
formData.append("OtherPreferedLocations", data.otherPerfLocation ?? "");
formData.append("PreferedWorkTimings", data.perfWorkTime ?? "");

/* ===== WORK EXPERIENCES (STRING) ===== */
formData.append(
  "workexperiences",
  JSON.stringify(
    talent.experience.map((exp) => ({
      ExperienceID: 0,
      EmployeeID: 0,
      CompanyName: exp.company ?? "",
      Position: exp.position ?? "",
      StartDate: exp.startDate ?? "",
      EndDate: exp.endDate || getToday(),
      Skills: exp.skills ?? [],
      Description: exp.description ?? "",
    }))
  )
);


/* ===== PROJECTS (STRING — CRITICAL) ===== */
formData.append(
  "project",
  JSON.stringify(
    talent.projects.map((proj) => ({
      ExperienceID: 0,
      EmployeeID: 0,
      projectName: proj.name ?? "",
      Role: proj.role ?? "",
      StartDate: proj.startDate ?? "",
      EndDate: proj.endDate || getToday(),  // ✅ current date fallback
      Skills: proj.skills ?? [],
      Description: proj.description ?? "",
    }))
  )
);


/* ===== EDUCATION (STRING) ===== */
formData.append(
  "employee_Heighers",
  JSON.stringify(
    talent.education.map((edu) => ({
      _EductionhigherId: 0,
      EmployeeID: 0,
      HighestQualification: edu.qualification ?? "",
      University: edu.university ?? "",
      Fieldofstudy: edu.field ?? "",
      Certifications: (edu.certifications ?? []).join(","),
      Percentage: edu.percentage ?? "",
      StartDate: edu.startDate ?? "",
      EndDate: edu.endDate || getToday(),   // ✅ current date fallback
    }))
  )
);

  try {
    await approveEmployee(formData).unwrap();
    setShowSuccessModal(true);
  } catch (err) {
    console.error("Approve failed", err);
    alert("Failed to save talent");
  }
};

const handleDraftTalent = async () => {
  if (!isReviewed) return;

  // Validate basic info before saving
  const validationErrors = validateAllBasicInfo(talent.basicInfo);
  const personalErrors = validateAllPersonalInfo(talent.personalInfo);
  const educationErrors = validateAllEducation(talent.education);
  const experienceErrors = validateAllExperience(talent.experience);
  const projectErrors = validateAllProjects(talent.projects);
  
  const allErrors = [...validationErrors, ...personalErrors, ...educationErrors, ...experienceErrors, ...projectErrors];
  if (allErrors.length > 0) {
    alert("Please fix validation errors:\n" + allErrors.join("\n"));
    return;
  }

  const formData = new FormData();

/* ===== BASIC INFO ===== */
formData.append("EmployeeID", data.employeeID);
formData.append("CompanyID", data.companyID);
formData.append("BranchID", data.branchID ?? 0);

formData.append("FirstName", talent.basicInfo.firstName);
formData.append("LastName", talent.basicInfo.lastName);
formData.append("Title", talent.basicInfo.position);
formData.append("PhoneNo", talent.basicInfo.phone);
formData.append("EmailAddress", talent.basicInfo.email);

formData.append("ProfilePicture", ""); // null not allowed in FormData
formData.append("ResumeFilePath", data.resumeFilePath ?? "");

/* ===== PERSONAL INFO ===== */
formData.append("DOB", talent.personalInfo.dob ?? "");
formData.append("Gender", talent.personalInfo.gender ?? "");
formData.append("EmergencyContactNumber", talent.personalInfo.emergency ?? "");

formData.append("Country", talent.personalInfo.country ?? "");
formData.append("State", talent.personalInfo.state ?? "");
formData.append("City", talent.personalInfo.city ?? "");
formData.append("Address", talent.personalInfo.address ?? "");
formData.append("Bio", talent.personalInfo.bio ?? "");

/* ===== SKILLS ===== */
formData.append("Skills", talent.basicInfo.skills.join(","));

/* ===== META ===== */
formData.append("InsertBy", data.uploadedBy ?? "");
formData.append("NoofExperience", data.noofExperience ?? 0);
formData.append("EmpDetailID", 0);
formData.append("EmpID", 0);
formData.append("EmployeeCode", data.employeeCode ?? "");
formData.append("department", data.department ?? "");
formData.append("Manager", data.manager ?? "");
formData.append("Supervisor", "");
formData.append("startdate", data.startDate ?? "");
formData.append("lastdate", data.endDate ?? "");
formData.append("Status", "Approved");

/* ===== SALARY ===== */
formData.append("Salary", data.salary ?? "");
formData.append("PayFrequency", data.salaryFrequency ?? "");

/* ===== PREFERENCES ===== */
formData.append("PreferedLanguage", data.prefLanguage ?? "");
formData.append("Prefereddistancefromhome", data.prefDistHome ?? "");
formData.append("OtherPreferedLocations", data.otherPerfLocation ?? "");
formData.append("PreferedWorkTimings", data.perfWorkTime ?? "");

/* ===== WORK EXPERIENCES (STRING) ===== */
formData.append(
  "workexperiences",
  JSON.stringify(
    talent.experience.map((exp) => ({
      ExperienceID: 0,
      EmployeeID: 0,
      CompanyName: exp.company ?? "",
      Position: exp.position ?? "",
      StartDate: exp.startDate ?? "",
      EndDate: exp.endDate || getToday(),
      Skills: exp.skills ?? [],
      Description: exp.description ?? "",
    }))
  )
);


/* ===== PROJECTS (STRING — CRITICAL) ===== */
formData.append(
  "project",
  JSON.stringify(
    talent.projects.map((proj) => ({
      ExperienceID: 0,
      EmployeeID: 0,
      projectName: proj.name ?? "",
      Role: proj.role ?? "",
      StartDate: proj.startDate ?? "",
      EndDate: proj.endDate || getToday(),  // ✅ current date fallback
      Skills: proj.skills ?? [],
      Description: proj.description ?? "",
    }))
  )
);


/* ===== EDUCATION (STRING) ===== */
formData.append(
  "employee_Heighers",
  JSON.stringify(
    talent.education.map((edu) => ({
      _EductionhigherId: 0,
      EmployeeID: 0,
      HighestQualification: edu.qualification ?? "",
      University: edu.university ?? "",
      Fieldofstudy: edu.field ?? "",
      Certifications: (edu.certifications ?? []).join(","),
      Percentage: edu.percentage ?? "",
      StartDate: edu.startDate ?? "",
      EndDate: edu.endDate || getToday(),   // ✅ current date fallback
    }))
  )
);

  try {
    await draftProfile(formData).unwrap();
    setShowSuccessModal(true);
  } catch (err) {
    console.error("Approve failed", err);
    alert("Failed to save talent");
  }
};


  /* ===== MAP API → LOCAL STATE (NO DESIGN CHANGE) ===== */
  useEffect(() => {
    if (!data) return;

    setTalent({
      basicInfo: {
        firstName: data.firstName,
        lastName: data.lastName,
        position: data.title,
        phone: data.phoneNo,
        email: data.emailAddress,
        skills: data.skills?.split(",") || []
      },
      personalInfo: {
        dob: data.dob || "",
        gender: data.gender || "",
        emergency: data.emergencyContactNumber || "",
        country: data.country,
        state: data.state,
        city: data.city,
        address: data.address,
        bio: data.bio
      },
      education: data.employee_Heighers?.map(e => ({
        university: e.university,
        qualification: e.highestQualification || "",
        startDate: e.startDate?.slice(0, 10),
        endDate: e.endDate?.slice(0, 10),
        field: e.fieldofstudy || "",
        percentage: e.percentage,
        certifications: e.certifications ? e.certifications.split(",") : []
      })) || [],
      experience: data.workexperiences?.map(e => ({
        company: e.companyName,
        position: e.position,
        startDate: e.startDate?.slice(0, 10),
        endDate: e.endDate?.slice(0, 10),
        skills: e.skills?.split(",") || [],
        description: e.description
      })) || [],
      projects: data.employeeprojects?.map(p => ({
        name: p.projectName,
        role: p.role || "",
        startDate: p.startDate?.slice(0, 10),
        endDate: p.endDate?.slice(0, 10),
        skills: p.skills?.split(",") || [],
        description: p.description
      })) || []
    });
  }, [data]);

  if (isLoading || !talent) return <div style={{ padding: 40 }}>Loading profile…</div>;

    const addEducation = () => setTalent(p => ({ ...p, education: [...p.education, { university: "", qualification: "", startDate: "", endDate: "", field: "", percentage: "", certifications: [] }] }));
    const addExperience = () => setTalent(p => ({ ...p, experience: [...p.experience, { company: "", position: "", startDate: "", endDate: "", skills: [], description: "" }] }));
    const addProjects = () => setTalent(p => ({ ...p, projects: [...p.projects, { name: "", role: "", startDate: "", endDate: "", skills: [], description: "" }] }));

    const deleteExperience = (index) => {
      if (window.confirm("Are you sure you want to delete this experience entry?")) {
        setTalent(p => ({ ...p, experience: p.experience.filter((_, i) => i !== index) }));
      }
    };

    const deleteProjects = (index) => {
      if (window.confirm("Are you sure you want to delete this project entry?")) {
        setTalent(p => ({ ...p, projects: p.projects.filter((_, i) => i !== index) }));
      }
    };

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
                    <h4 className="auth-title mb-4">Review & Edit Information</h4>

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
                                    <h5 className="auth-label fw-bolder">Basic Information</h5>
                                    {openAccordion === "basicInfo" ? <ChevronUp /> : <ChevronDown />}
                                </div>
                                <div style={smoothStyle(openAccordion === "basicInfo")} className="mt-2 scrollable">
                                    {["firstName", "lastName", "position", "phone", "email"].map(f => (
                                        <EditableField key={f} label={f} value={talent.basicInfo[f]}
                                            editing={editingSection === "basicInfo" && editingIndex === f}
                                            onEdit={() => beginEdit("basicInfo", f)}
                                            onSave={val => { setTalent(p => ({ ...p, basicInfo: { ...p.basicInfo, [f]: val } })); cancelEdit(); }}
                                            onCancel={cancelEdit}
                                            section="basicInfo"
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
                                    <h5 className="auth-label fw-bolder">Personal Information</h5>
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
                                                section="personalInfo"
                                            />
                                        ) : (
                                            <EditableField key={field} label={field} value={talent.personalInfo[field]}
                                                editing={editingSection === "personalInfo" && editingIndex === field}
                                                onEdit={() => beginEdit("personalInfo", field)}
                                                onSave={val => { setTalent(p => ({ ...p, personalInfo: { ...p.personalInfo, [field]: val } })); cancelEdit(); }}
                                                onCancel={cancelEdit}
                                                section="personalInfo"
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
                                    <h5 className="auth-label fw-bolder">Education</h5>
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
                                            section="education"
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
                                          section="education"
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
                                    <h5 className="auth-label fw-bolder">Experience</h5>
                                    {openAccordion === "experience" ? <ChevronUp /> : <ChevronDown />}
                                </div>
                                <div style={smoothStyle(openAccordion === "experience")} className="mt-2">
                                    
                                    {talent.experience.map((ex, i) => (
                                        <div key={i} style={{ border: '1px solid #e2e8f0', padding: 12, borderRadius: 8, marginTop: 10, marginBottom: 14 }}>
                                            {["company", "position", "startDate", "endDate"].map(field => (
                                                <EditableField key={field} label={field} value={ex[field]}
                                                    section="experience"
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
                                                section="experience"
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
                                                section="experience"
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

                                    <div className="mb-3" style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                                        <button className="btn-secondary" onClick={addExperience}><Plus size={12} /> Add</button>
                                        <button className="btn-secondary" onClick={() => {
                                          const experienceCount = talent.experience.length;
                                          if (experienceCount > 1) {
                                            deleteExperience(experienceCount - 1);
                                          } else {
                                            alert("Cannot delete the last experience entry");
                                          }
                                        }}><Trash2 size={12} /> Remove</button>
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
                                    <h5 className="auth-label fw-bolder">Projects</h5>
                                    {openAccordion === "projects" ? <ChevronUp /> : <ChevronDown />}
                                </div>
                                <div style={smoothStyle(openAccordion === "projects")} className="mt-2">
        
                                    {talent.projects.map((pr, i) => (
                                        <div key={i} style={{ border: '1px solid #e2e8f0', padding: 12, borderRadius: 8, marginTop: 10, marginBottom: 14 }}>
                                            {["name", "role", "startDate", "endDate"].map(field => (
                                                <EditableField key={field} label={field} value={pr[field]} section="projects"
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
                                                section="projects"
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
                                                section="projects"
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

                                    <div className="mb-3" style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                                        <button className="btn-secondary" onClick={addProjects}><Plus size={12} /> Add</button>
                                        <button className="btn-secondary" onClick={() => {
                                          const projectsCount = talent.projects.length;
                                          if (projectsCount > 1) {
                                            deleteProjects(projectsCount - 1);
                                          } else {
                                            alert("Cannot delete the last project entry");
                                          }
                                        }}><Trash2 size={12} /> Remove</button>
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

    <button
        className="btn-secondary"
        disabled={!isReviewed}
        onClick={handleDraftTalent}
        style={{
            opacity: !isReviewed ? 0.6 : 1,
            cursor: !isReviewed ? "not-allowed" : "pointer"
        }}
    >
        Save as Draft
    </button>


    <button
        className="btn-primary"
        disabled={!isReviewed}
        onClick={handleSaveTalent}
        style={{
            opacity: !isReviewed ? 0.6 : 1,
            cursor: !isReviewed ? "not-allowed" : "pointer"
        }}
    >
        Save Talent
    </button>

</div>

                    </div>
                </div>

                {/* RIGHT */}
                <div style={{ borderRadius: '1rem', border: '1px solid #e2e8f0', background: 'white' }}>
                    <h4 className="auth-title" style={{ padding: 16 }}>Preview Resume</h4>
                    <div style={{ height: 'calc(100% - 48px)', overflowY: 'auto', padding:"1rem" }}>
                        <PDFResumePreview data={data} />
                    </div>
                </div>
            </div>

            {validationErrorsState &&  (
              <ValidationErrorModal
                errors={validationErrorsState}
                onClose={() => setValidationErrorsState(null)}
                onRetry={() => setValidationErrorsState(null)}
                onContactSupport={() => { setValidationErrorsState(null); navigate('/support'); }}
              />
            )}

            {showSuccessModal && (
              <SaveSuccessModal onClose={() => setShowSuccessModal(false)} />
            )}


        </div>
    );
};

export default ReviewTalent;
