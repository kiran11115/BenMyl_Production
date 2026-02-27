import React, { useEffect, useState } from "react";
import { Edit2, Plus, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import "./UploadTalent.css";
import { useApprovedEmployeeMutation, useDraftProfileEmployeeMutation, useGetEmployeeResumeQuery } from "../../State-Management/Api/UploadResumeApiSlice";
import { ValidationErrorModal, ConfirmSaveModal, SaveSuccessModal, SaveErrorModal } from "./SaveTalentAlert";

// ===== ACCORDION ANIMATIONS =====
const accordionAnimationStyles = `
  @keyframes zoomIn {
    from {
      transform: scale(0.95);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
  
  @keyframes zoomOut {
    from {
      transform: scale(1);
      opacity: 1;
    }
    to {
      transform: scale(0.95);
      opacity: 0;
    }
  }
  
  .accordion-zoom-in {
    animation: zoomIn 0.3s ease-out forwards;
  }
  
  .accordion-zoom-out {
    animation: zoomOut 0.3s ease-out forwards;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = accordionAnimationStyles;
  if (!document.head.querySelector('style[data-accordion-animation]')) {
    style.setAttribute('data-accordion-animation', 'true');
    document.head.appendChild(style);
  }
}

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
  // DOB is optional — only validate when provided
  if (!val || String(val).trim() === "") return null;
  const date = new Date(val);
  if (isNaN(date)) return "Please enter a valid date of birth";
  const today = new Date();
  if (date > today) return "Date of birth cannot be in the future";
  return null;
};

const validateGender = (val) => {
  // Gender is optional — only validate when provided
  if (!val || String(val).trim() === "") return null;
  if (!/^[a-zA-Z\s]*$/.test(val)) return "Gender should contain only letters";
  return null;
};

const validateEmergency = (val) => {
  // Emergency contact is optional — only validate when provided
  if (!val || String(val).trim() === "") return null;
  if (!/^\d+$/.test(String(val).replace(/[\s\-\(\)+]/g, ""))) return "Emergency contact should contain only numbers";
  return null;
};

const validateAddress = (val) => {
  if (!val || String(val).trim() === "") return "Address is required";
  if (String(val).trim().length < 5) return "Address should be more descriptive";
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
  // Start date optional — only validate when provided
  if (!val || String(val).trim() === "") return null;
  const d = new Date(val);
  if (isNaN(d)) return "Please enter a valid start date";
  return null;
};

const validateEduEndDate = (val) => {
  // End date optional — only validate when provided
  if (!val || String(val).trim() === "") return null;
  const d = new Date(val);
  if (isNaN(d)) return "Please enter a valid end date";
  return null;
};

const validateEduField = (val) => {
  if (!val || val.trim() === "") return "Field of study is required";
  if (!/^[a-zA-Z\s]*$/.test(val)) return "Field should contain only letters";
  return null;
};

const validatePercentage = (val) => {
  // Percentage optional — only validate when provided
  if (!val || String(val).trim() === "") return null;
  if (!/^\d+(?:\.\d+)?$/.test(String(val).trim())) return "Percentage should contain only numbers";
  return null;
};

const validateCertifications = (val) => {
  // Certifications optional — only validate when provided
  if (!val || String(val).trim() === "") return null;
  if (!/^[a-zA-Z,\s]*$/.test(String(val))) return "Certifications should contain only letters, commas and spaces";
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
  // Start date optional — only validate when provided
  if (!val || String(val).trim() === "") return null;
  const d = new Date(val);
  if (isNaN(d)) return null;
};

const validateExpEndDate = (val) => {
  // End date optional — only validate when provided
  if (!val || String(val).trim() === "") return null;
  const d = new Date(val);
  if (isNaN(d)) return null;
};

const validateExpSkills = (val) => {
  if (!val || val.trim() === "") return "Skills are required";
  return null;
};

const validateExpDescription = (val) => {
  // Description optional — only validate when provided
  if (!val || String(val).trim() === "") return null;
  if (String(val).trim().length < 10) return "Description should be more descriptive";
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
  // Start date optional — only validate when provided
  if (!val || String(val).trim() === "") return null;
  const d = new Date(val);
  if (isNaN(d)) return null;
};

const validateProjectEndDate = (val) => {
   // End date optional — only validate when provided
  if (!val || String(val).trim() === "") return null;
  const d = new Date(val);
  if (isNaN(d)) return null;
};

const validateProjectSkills = (val) => {
  if (!val || val.trim() === "") return "Skills are required";
  return null;
};

const validateProjectDescription = (val) => {
  // Description optional — only validate when provided
  if (!val || String(val).trim() === "") return null;
  if (String(val).trim().length < 10) return "Description should be more descriptive";
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
  address: validateAddress,
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

const EditableField = ({ label, value, editing, onEdit, onSave, onCancel, section, hideEditButton }) => {

    const isDateField =
        label.toLowerCase().includes("date") ||
        label.toLowerCase().includes("dob");

    const [temp, setTemp] = useState(
        isDateField ? formatDateToInput(value) : (value || "")
    );
    
    const [error, setError] = useState(null);

    // Get validation function for fields, passing section for context
    const validationFn = (section === "basicInfo" || section === "personalInfo" || section === "education" || section === "experience" || section === "projects") ? getValidationForField(label, section) : null;

    const handleChange = (e) => {
        const newVal = e.target.value;
        setTemp(newVal);
        setError(null);
        // Auto-save on change
        onSave(newVal);
    };

    return (
        <div className="auth-form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <label className="auth-label">{label}</label>
            </div>

            {editing ? (
                <>
                    {isDateField ? (
                        <input
                            type="date"
                            className="auth-input"
                            value={temp}
                            onChange={handleChange}
                            autoFocus
                        />
                    ) : (
                        <input
                            className="auth-input"
                            value={temp}
                            onChange={handleChange}
                            autoFocus
                            style={{ borderColor: error ? '#ef4444' : undefined }}
                        />
                    )}
                    {error && <div style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{error}</div>}
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


const EditableTextarea = ({ label, value, editing, onEdit, onSave, onCancel, section, hideEditButton }) => {
    const [temp, setTemp] = useState(value || "");
    const [error, setError] = useState(null);

    // Get validation function for personal info, experience and projects description fields, passing section for context
    const validationFn = (section === "personalInfo" || section === "experience" || section === "projects") ? getValidationForField(label, section) : null;

    const handleChange = (e) => {
        const newVal = e.target.value;
        setTemp(newVal);
        setError(null);
        // Auto-save on change
        onSave(newVal);
    };

    return (
        <div className="auth-form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <label className="auth-label">{label}</label>
            </div>
            {editing ? (
                <>
                    <textarea 
                        className="auth-input" 
                        style={{ minHeight: 120, borderColor: error ? '#ef4444' : undefined }} 
                        value={temp} 
                        onChange={handleChange}
                    />
                    {error && <div style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{error}</div>}
                </>
            ) : (
                <div className="auth-input" style={{ border: 'none', padding: '4px 0', height: "100%" }}>{value || "—"}</div>
            )}
        </div>
    );
};

const EditableTags = ({ label, values, editing, onEdit, onSave, onCancel, section, hideEditButton }) => {
    const [temp, setTemp] = useState(values.join(", "));
    const [error, setError] = useState(null);

    // validation function applies when a section provides a mapped validator (e.g., skills in experience, certifications in education)
    const validationFn = section ? getValidationForField(label, section) : null;

    const handleChange = (e) => {
        const newVal = e.target.value;
        setTemp(newVal);
        setError(null);
        // Auto-save on change
        onSave(newVal.split(",").map(t => t.trim()).filter(Boolean));
    };

    return (
        <div className="auth-form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label className="auth-label">{label}</label>
            </div>
            {editing ? (
                <>
                    <textarea className="auth-input" style={{ minHeight: 100, borderColor: error ? '#ef4444' : undefined }} value={temp} onChange={handleChange} />
                    {error && <div style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{error}</div>}
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
    const [animatingAccordion, setAnimatingAccordion] = useState(null);
    
    const toggleAccordion = (key) => {
      setAnimatingAccordion(key);
      setTimeout(() => {
        setOpenAccordion(prev => prev === key ? null : key);
        setAnimatingAccordion(null);
      }, 150);
    };

    const [editingSection, setEditingSection] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);
    const [basicInfoErrors, setBasicInfoErrors] = useState(null);
    const [personalInfoErrors, setPersonalInfoErrors] = useState(null);
    const [educationErrors, setEducationErrors] = useState(null);
    const [experienceErrors, setExperienceErrors] = useState(null);
    const [projectsErrors, setProjectsErrors] = useState(null);
    
    const beginEdit = (s, i = null) => { setEditingSection(s); setEditingIndex(i); };
    const cancelEdit = () => { 
        setEditingSection(null); 
        setEditingIndex(null); 
        setBasicInfoErrors(null); 
        setPersonalInfoErrors(null);
        setEducationErrors(null);
        setExperienceErrors(null);
        setProjectsErrors(null);
    };
    
    const saveBasicInfo = () => {
        const errors = validateAllBasicInfo(talent.basicInfo);
        if (errors.length > 0) {
            setBasicInfoErrors(errors[0]);
            return;
        }
        setBasicInfoErrors(null);
        cancelEdit();
    };

    const savePersonalInfo = () => {
        const errors = validateAllPersonalInfo(talent.personalInfo);
        if (errors.length > 0) {
            setPersonalInfoErrors(errors[0]);
            return;
        }
        setPersonalInfoErrors(null);
        cancelEdit();
    };

    const saveEducation = () => {
        const errors = validateAllEducation(talent.education);
        if (errors.length > 0) {
            setEducationErrors(errors[0]);
            return;
        }
        setEducationErrors(null);
        cancelEdit();
    };

    const saveExperience = () => {
        const errors = validateAllExperience(talent.experience);
        if (errors.length > 0) {
            setExperienceErrors(errors[0]);
            return;
        }
        setExperienceErrors(null);
        cancelEdit();
    };

    const saveProjects = () => {
        const errors = validateAllProjects(talent.projects);
        if (errors.length > 0) {
            setProjectsErrors(errors[0]);
            return;
        }
        setProjectsErrors(null);
        cancelEdit();
    };

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
  
  const addressError = validateAddress(personalInfo.address);
  if (addressError) errors.push(addressError);

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

    const deleteEducation = (index) => {
      if (window.confirm("Are you sure you want to delete this education entry?")) {
        setTalent(p => ({ ...p, education: p.education.filter((_, i) => i !== index) }));
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
                <div className="auth-form-side" style={{ border: '1px solid #e2e8f0', borderRadius: '1rem', padding: 24, background: 'white', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
                    <h4 className="auth-title mb-4">Review & Edit Information</h4>

                    <div style={{ flex: 1, overflowY: 'auto' }}>

                        {/* ===== BASIC ===== */}
                        <div style={{ marginBottom: 16 }}>
                            <div style={{
                                border: openAccordion === "basicInfo" ? "2px solid #2563eb" : "1px solid #e2e8f0",
                                borderRadius: "8px",
                                padding: "12px 12px 0px 12px",
                                boxShadow: openAccordion === "basicInfo" 
                                  ? '0 20px 40px -10px rgba(37, 99, 235, 0.25), 0 0 0 1px rgba(37, 99, 235, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.6)' 
                                  : '0 2px 4px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                                backgroundColor: openAccordion === "basicInfo" ? '#f0f4ff' : '#fafbff',
                                transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                transform: openAccordion === "basicInfo" ? 'scale(1.03) translateY(-2px)' : 'scale(1) translateY(0)',
                                position: 'relative'
                            }}>
                                <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '10px 4px',
                                        transition: 'all 0.25s ease',
                                        userSelect: 'none'
                                    }}
                                >
                                    <div onClick={() => toggleAccordion("basicInfo")}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            cursor: 'pointer',
                                            flex: 1,
                                            transition: 'all 0.25s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                          e.currentTarget.style.transform = 'translateX(6px)';
                                          if (openAccordion === "basicInfo") {
                                            e.currentTarget.parentElement.parentElement.style.boxShadow = '0 25px 50px -12px rgba(37, 99, 235, 0.3), 0 0 0 1px rgba(37, 99, 235, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.6)';
                                          }
                                        }}
                                        onMouseLeave={(e) => {
                                          e.currentTarget.style.transform = 'translateX(0)';
                                          if (openAccordion === "basicInfo") {
                                            e.currentTarget.parentElement.parentElement.style.boxShadow = '0 20px 40px -10px rgba(37, 99, 235, 0.25), 0 0 0 1px rgba(37, 99, 235, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.6)';
                                          }
                                        }}
                                    >
                                        <h5 className="auth-label fw-bolder" style={{ 
                                            color: openAccordion === "basicInfo" ? '#1e40af' : '#374151',
                                            fontSize: openAccordion === "basicInfo" ? '16px' : '1seco5px',
                                            fontWeight: openAccordion === "basicInfo" ? '700' : '600',
                                            transition: 'all 0.25s ease',
                                            textShadow: openAccordion === "basicInfo" ? '0 1px 2px rgba(0, 0, 0, 0.05)' : 'none'
                                        }}>Basic Information</h5>
                                        <ChevronUp size={22} style={{ 
                                            color: openAccordion === "basicInfo" ? '#2563eb' : '#d1d5db',
                                            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                            transform: openAccordion === "basicInfo" ? 'rotate(0deg) scale(1.1)' : 'rotate(180deg) scale(1)',
                                            filter: openAccordion === "basicInfo" ? 'drop-shadow(0 2px 4px rgba(37, 99, 235, 0.2))' : 'none'
                                        }} />
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, marginLeft: 12 }}>
                                        {editingSection !== "basicInfo" && openAccordion === "basicInfo" ? (
                                            <button className="btn-primary d-flex justify-content-between align-items-center" onClick={() => beginEdit("basicInfo", "all")} style={{ fontSize: 12, padding: '6px 12px', width: 65 }}>
                                                <Edit2  size={12} /> Edit
                                            </button>
                                        ) : null}
                                    </div>
                                </div>
                                <div style={smoothStyle(openAccordion === "basicInfo")} className="mt-2 scrollable">
                                    {["firstName", "lastName", "position", "phone", "email"].map(f => (
                                        <EditableField key={f} label={f} value={talent.basicInfo[f]}
                                            editing={editingSection === "basicInfo"}
                                            onEdit={() => {}}
                                            onSave={val => { setTalent(p => ({ ...p, basicInfo: { ...p.basicInfo, [f]: val } })); }}
                                            onCancel={() => {}}
                                            section="basicInfo"
                                            hideEditButton={true}
                                        />
                                    ))}
                                    <EditableTags
                                        label="Skills"
                                        values={talent.basicInfo.skills}
                                        editing={editingSection === "basicInfo"}
                                        onEdit={() => {}}
                                        onSave={val => { setTalent(p => ({ ...p, basicInfo: { ...p.basicInfo, skills: val } })); }}
                                        onCancel={() => {}}
                                        hideEditButton={true}
                                    />
                                    {basicInfoErrors && editingSection === "basicInfo" && (
                                        <div style={{ color: '#ef4444', fontSize: 12, marginTop: 12, padding: 10, backgroundColor: '#fee2e2', borderRadius: 6 }}>
                                            {basicInfoErrors}
                                        </div>
                                    )}
                                    {editingSection === "basicInfo" && (
                                        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16, paddingTop: 12, borderTop: '1px solid #e2e8f0' }}>
                                            <button className="btn-secondary" onClick={cancelEdit} style={{ fontSize: 12, padding: '8px 16px' }}>
                                                Cancel
                                            </button>
                                            <button className="btn-primary" onClick={saveBasicInfo} style={{ fontSize: 12, padding: '8px 16px' }}>
                                                Save
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ===== PERSONAL ===== */}
                        <div style={{ marginBottom: 16 }}>
                            <div style={{
                                border: "1px solid #e2e8f0",
                                borderRadius: "6px",
                                padding: "10px 10px 0px 10px",
                                boxShadow: openAccordion === "personalInfo" ? '0 10px 25px -5px rgba(0, 0, 0, 0.15)' : '0 1px 3px rgba(0, 0, 0, 0.08)',
                                backgroundColor: openAccordion === "personalInfo" ? '#f8f9fb' : '#fafbff',
                                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                transform: openAccordion === "personalInfo" ? 'scale(1.01)' : 'scale(1)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', transition: 'all 0.2s ease' }}>
                                    <div onClick={() => toggleAccordion("personalInfo")} style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer', flex: 1, transition: 'all 0.2s ease' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateX(4px)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateX(0)'; }}>
                                        <h5 className="auth-label fw-bolder" 
                                        style={{  
                                          color: openAccordion === "personalInfo" ? '#2563eb' : '#374151', 
                                          fontSize: openAccordion === "personalInfo" ? '16px' : '15px',
                                          fontWeight: openAccordion === "personalInfo" ? '700' : '600',
                                          transition: 'color 0.2s ease' }}>Personal Information</h5>
                                        {openAccordion === "personalInfo" ? <ChevronUp size={20} style={{ color: '#2563eb' }} /> : <ChevronDown size={20} style={{ color: '#6b7280' }} />}
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, marginLeft: 12 }}>
                                        {editingSection !== "personalInfo" && openAccordion === "personalInfo" ? (
                                            <button className="btn-primary d-flex justify-content-between align-items-center" onClick={() => beginEdit("personalInfo", "all")} style={{ fontSize: 12, padding: '6px 12px', width: 65 }}>
                                                <Edit2 size={12} /> Edit
                                            </button>
                                        ) : null}
                                    </div>
                                </div>
                                <div style={smoothStyle(openAccordion === "personalInfo")} className="mt-2">
                                    {Object.keys(talent.personalInfo).map(field => {
                                        const isTxt = field === "bio";
                                        return isTxt ? (
                                            <EditableTextarea key={field} label={field} value={talent.personalInfo[field]}
                                                editing={editingSection === "personalInfo"}
                                                onEdit={() => {}}
                                                onSave={val => { setTalent(p => ({ ...p, personalInfo: { ...p.personalInfo, [field]: val } })); }}
                                                onCancel={() => {}}
                                                section="personalInfo"
                                            />
                                        ) : (
                                            <EditableField key={field} label={field} value={talent.personalInfo[field]}
                                                editing={editingSection === "personalInfo"}
                                                onEdit={() => {}}
                                                onSave={val => { setTalent(p => ({ ...p, personalInfo: { ...p.personalInfo, [field]: val } })); }}
                                                onCancel={() => {}}
                                                section="personalInfo"
                                            />
                                        )
                                    })}
                                    {personalInfoErrors && editingSection === "personalInfo" && (
                                        <div style={{ color: '#ef4444', fontSize: 12, marginTop: 12, padding: 10, backgroundColor: '#fee2e2', borderRadius: 6 }}>
                                            {personalInfoErrors}
                                        </div>
                                    )}
                                    {editingSection === "personalInfo" && (
                                        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16, paddingTop: 12, borderTop: '1px solid #e2e8f0' }}>
                                            <button className="btn-secondary" onClick={cancelEdit} style={{ fontSize: 12, padding: '8px 16px' }}>
                                                Cancel
                                            </button>
                                            <button className="btn-primary" onClick={savePersonalInfo} style={{ fontSize: 12, padding: '8px 16px' }}>
                                                Save
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ===== EDUCATION ===== */}
                        <div style={{ marginBottom: 16 }}>
                            <div style={{
                                border: "1px solid #e2e8f0",
                                borderRadius: "6px",
                                padding: "10px 10px 0px 10px",
                                boxShadow: openAccordion === "education" ? '0 10px 25px -5px rgba(0, 0, 0, 0.15)' : '0 1px 3px rgba(0, 0, 0, 0.08)',
                                backgroundColor: openAccordion === "education" ? '#f8f9fb' : '#fafbff',
                                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                transform: openAccordion === "education" ? 'scale(1.01)' : 'scale(1)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', transition: 'all 0.2s ease' }}>
                                    <div onClick={() => toggleAccordion("education")} style={{ display: 'flex', cursor: 'pointer', padding: '8px 0', transition: 'all 0.2s ease', flex: 1 }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}>
                                        <h5 className="auth-label fw-bolder" style={{ 
                                          color: openAccordion === "education" ? '#2563eb' : '#374151', 
                                          fontSize: openAccordion === "education" ? '16px' : '15px',
                                          fontWeight: openAccordion === "education" ? '700' : '600',
                                          transition: 'color 0.2s ease' }}>Education</h5>
                                        {openAccordion === "education" ? <ChevronUp size={20} style={{ color: '#2563eb', marginLeft: 'auto' }} /> : <ChevronDown size={20} style={{ color: '#6b7280', marginLeft: 'auto' }} />}
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, marginLeft: 12 }}>
                                        {editingSection !== "education" && openAccordion === "education" ? (
                                            <button className="btn-primary d-flex justify-content-between align-items-center" onClick={() => beginEdit("education", "all")} style={{ fontSize: 12, padding: '6px 12px', width: 65 }}>
                                                <Edit2 size={12} /> Edit
                                            </button>
                                        ) : null}
                                    </div>
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
                                            editing={editingSection === "education"}
                                            onEdit={() => {}}
                                            onSave={val => {
                                              const arr = [...talent.education]; arr[i][field] = val;
                                              setTalent(p => ({ ...p, education: arr }));
                                            }}
                                            onCancel={() => {}}
                                          />
                                        ))}
                                        <EditableTags
                                          label="Certifications"
                                          section="education"
                                          values={ed.certifications}
                                          editing={editingSection === "education"}
                                          onEdit={() => {}}
                                          onSave={val => {
                                            const arr = [...talent.education]; arr[i].certifications = val;
                                            setTalent(p => ({ ...p, education: arr }));
                                          }}
                                          onCancel={() => {}}
                                        />
                                      </div>
                                    ))}

                                     <div className="mb-3" style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                                        {editingSection !== "education" ? (
                                            <>
                                                <button className="btn-secondary" onClick={addEducation}><Plus size={12} /> Add</button>
                                                <button className="btn-secondary" onClick={() => {
                                                  const educationCount = talent.education.length;
                                                  if (educationCount > 1) {
                                                    deleteEducation(educationCount - 1);
                                                  } else {
                                                    alert("Cannot delete the last education entry");
                                                  }
                                                }}><Trash2 size={12} /> Remove</button>
                                            </>
                                        ) : null}
                                        {editingSection === "education" && (
                                            <>
                                                {educationErrors && (
                                                    <div style={{ color: '#ef4444', fontSize: 12, width: '100%', marginBottom: 12, padding: 10, backgroundColor: '#fee2e2', borderRadius: 6 }}>
                                                        {educationErrors}
                                                    </div>
                                                )}
                                                <button className="btn-secondary" onClick={cancelEdit} style={{ fontSize: 12, padding: '8px 16px' }}>
                                                    Cancel
                                                </button>
                                                <button className="btn-primary" onClick={saveEducation} style={{ fontSize: 12, padding: '8px 16px' }}>
                                                    Save
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ===== EXPERIENCE ===== */}
                        <div style={{ marginBottom: 16 }}>
                            <div style={{
                                border: "1px solid #e2e8f0",
                                borderRadius: "6px",
                                padding: "10px 10px 0px 10px",
                                boxShadow: openAccordion === "experience" ? '0 10px 25px -5px rgba(0, 0, 0, 0.15)' : '0 1px 3px rgba(0, 0, 0, 0.08)',
                                backgroundColor: openAccordion === "experience" ? '#f8f9fb' : '#fafbff',
                                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                transform: openAccordion === "experience" ? 'scale(1.01)' : 'scale(1)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', transition: 'all 0.2s ease' }}>
                                    <div onClick={() => toggleAccordion("experience")} style={{ display: 'flex', cursor: 'pointer', padding: '8px 0', transition: 'all 0.2s ease', flex: 1 }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}>
                                        <h5 className="auth-label fw-bolder" style={{ 
                                          color: openAccordion === "experience" ? '#2563eb' : '#374151', 
                                          fontSize: openAccordion === "experience" ? '16px' : '15px',
                                          fontWeight: openAccordion === "experience" ? '700' : '600',
                                          transition: 'color 0.2s ease' }}>Experience</h5>
                                        {openAccordion === "experience" ? <ChevronUp size={20} style={{ color: '#2563eb', marginLeft: 'auto' }} /> : <ChevronDown size={20} style={{ color: '#6b7280', marginLeft: 'auto' }} />}
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, marginLeft: 12 }}>
                                        {editingSection !== "experience" && openAccordion === "experience" ? (
                                            <button className="btn-primary d-flex justify-content-between align-items-center" onClick={() => beginEdit("experience", "all")} style={{ fontSize: 12, padding: '6px 12px', width: 65 }}>
                                                <Edit2 size={12} /> Edit
                                            </button>
                                        ) : null}
                                    </div>
                                </div>
                                <div style={smoothStyle(openAccordion === "experience")} className="mt-2">
                                    
                                    {talent.experience.map((ex, i) => (
                                        <div key={i} style={{ border: '1px solid #e2e8f0', padding: 12, borderRadius: 8, marginTop: 10, marginBottom: 14 }}>
                                            {["company", "position", "startDate", "endDate"].map(field => (
                                                <EditableField key={field} label={field} value={ex[field]}
                                                    section="experience"
                                                    editing={editingSection === "experience"}
                                                    onEdit={() => {}}
                                                    onSave={val => {
                                                        const arr = [...talent.experience]; arr[i][field] = val;
                                                        setTalent(p => ({ ...p, experience: arr }));
                                                    }}
                                                    onCancel={() => {}}
                                                />
                                            ))}
                                            <EditableTags
                                                label="Skills"
                                                section="experience"
                                                values={ex.skills}
                                                editing={editingSection === "experience"}
                                                onEdit={() => {}}
                                                onSave={val => {
                                                    const arr = [...talent.experience]; arr[i].skills = val;
                                                    setTalent(p => ({ ...p, experience: arr }));
                                                }}
                                                onCancel={() => {}}
                                            />
                                            <EditableTextarea
                                                label="Description"
                                                section="experience"
                                                value={ex.description}
                                                editing={editingSection === "experience"}
                                                onEdit={() => {}}
                                                onSave={val => {
                                                    const arr = [...talent.experience]; arr[i].description = val;
                                                    setTalent(p => ({ ...p, experience: arr }));
                                                }}
                                                onCancel={() => {}}
                                            />
                                        </div>
                                    ))}

                                    <div className="mb-3" style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                                        {editingSection !== "experience" ? (
                                            <>
                                                <button className="btn-secondary" onClick={addExperience}><Plus size={12} /> Add</button>
                                                <button className="btn-secondary" onClick={() => {
                                                  const experienceCount = talent.experience.length;
                                                  if (experienceCount > 1) {
                                                    deleteExperience(experienceCount - 1);
                                                  } else {
                                                    alert("Cannot delete the last experience entry");
                                                  }
                                                }}><Trash2 size={12} /> Remove</button>
                                            </>
                                        ) : null}
                                        {editingSection === "experience" && (
                                            <>
                                                {experienceErrors && (
                                                    <div style={{ color: '#ef4444', fontSize: 12, width: '100%', marginBottom: 12, padding: 10, backgroundColor: '#fee2e2', borderRadius: 6 }}>
                                                        {experienceErrors}
                                                    </div>
                                                )}
                                                <button className="btn-secondary" onClick={cancelEdit} style={{ fontSize: 12, padding: '8px 16px' }}>
                                                    Cancel
                                                </button>
                                                <button className="btn-primary" onClick={saveExperience} style={{ fontSize: 12, padding: '8px 16px' }}>
                                                    Save
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ===== PROJECTS ===== */}
                        <div style={{ marginBottom: 16 }}>
                            <div style={{
                                border: "1px solid #e2e8f0",
                                borderRadius: "6px",
                                padding: "10px 10px 0px 10px",
                                boxShadow: openAccordion === "projects" ? '0 10px 25px -5px rgba(0, 0, 0, 0.15)' : '0 1px 3px rgba(0, 0, 0, 0.08)',
                                backgroundColor: openAccordion === "projects" ? '#f8f9fb' : '#fafbff',
                                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                transform: openAccordion === "projects" ? 'scale(1.01)' : 'scale(1)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', transition: 'all 0.2s ease' }}>
                                    <div onClick={() => toggleAccordion("projects")} style={{ display: 'flex', cursor: 'pointer', padding: '8px 0', transition: 'all 0.2s ease', flex: 1 }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}>
                                        <h5 className="auth-label fw-bolder" style={{ 
                                          color: openAccordion === "projects" ? '#2563eb' : '#374151', 
                                          fontSize: openAccordion === "projects" ? '16px' : '15px',
                                          fontWeight: openAccordion === "projects" ? '700' : '600',
                                          transition: 'color 0.2s ease' }}>Projects</h5>
                                        {openAccordion === "projects" ? <ChevronUp size={20} style={{ color: '#2563eb', marginLeft: 'auto' }} /> : <ChevronDown size={20} style={{ color: '#6b7280', marginLeft: 'auto' }} />}
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, marginLeft: 12, }}>
                                        {editingSection !== "projects" && openAccordion === "projects" ? (
                                            <button className="btn-primary d-flex justify-content-between align-items-center" onClick={() => beginEdit("projects", "all")} style={{ fontSize: 12, padding: '6px 12px', width: 65 }}>
                                                <Edit2 size={12} /> Edit
                                            </button>
                                        ) : null}
                                    </div>
                                </div>
                                <div style={smoothStyle(openAccordion === "projects")} className="mt-2">
        
                                    {talent.projects.map((pr, i) => (
                                        <div key={i} style={{ border: '1px solid #e2e8f0', padding: 12, borderRadius: 8, marginTop: 10, marginBottom: 14 }}>
                                            {["name", "role", "startDate", "endDate"].map(field => (
                                                <EditableField key={field} label={field} value={pr[field]} section="projects"
                                                    editing={editingSection === "projects"}
                                                    onEdit={() => {}}
                                                    onSave={val => {
                                                        const arr = [...talent.projects]; arr[i][field] = val;
                                                        setTalent(p => ({ ...p, projects: arr }));
                                                    }}
                                                    onCancel={() => {}}
                                                />
                                            ))}
                                            <EditableTags
                                                label="Skills"
                                                values={pr.skills}
                                                section="projects"
                                                editing={editingSection === "projects"}
                                                onEdit={() => {}}
                                                onSave={val => {
                                                    const arr = [...talent.projects]; arr[i].skills = val;
                                                    setTalent(p => ({ ...p, projects: arr }));
                                                }}
                                                onCancel={() => {}}
                                            />
                                            <EditableTextarea
                                                label="Description"
                                                value={pr.description}
                                                section="projects"
                                                editing={editingSection === "projects"}
                                                onEdit={() => {}}
                                                onSave={val => {
                                                    const arr = [...talent.projects]; arr[i].description = val;
                                                    setTalent(p => ({ ...p, projects: arr }));
                                                }}
                                                onCancel={() => {}}
                                            />
                                        </div>
                                    ))}

                                    <div className="mb-3" style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                                        {editingSection !== "projects" ? (
                                            <>
                                                <button className="btn-secondary" onClick={addProjects}><Plus size={12} /> Add</button>
                                                <button className="btn-secondary" onClick={() => {
                                                  const projectsCount = talent.projects.length;
                                                  if (projectsCount > 1) {
                                                    deleteProjects(projectsCount - 1);
                                                  } else {
                                                    alert("Cannot delete the last project entry");
                                                  }
                                                }}><Trash2 size={12} /> Remove</button>
                                            </>
                                        ) : null}
                                        {editingSection === "projects" && (
                                            <>
                                                {projectsErrors && (
                                                    <div style={{ color: '#ef4444', fontSize: 12, width: '100%', marginBottom: 12, padding: 10, backgroundColor: '#fee2e2', borderRadius: 6 }}>
                                                        {projectsErrors}
                                                    </div>
                                                )}
                                                <button className="btn-secondary" onClick={cancelEdit} style={{ fontSize: 12, padding: '8px 16px' }}>
                                                    Cancel
                                                </button>
                                                <button className="btn-primary" onClick={saveProjects} style={{ fontSize: 12, padding: '8px 16px' }}>
                                                    Save
                                                </button>
                                            </>
                                        )}
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
                <div style={{ borderRadius: '1rem', border: '1px solid #e2e8f0', background: 'white', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
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
