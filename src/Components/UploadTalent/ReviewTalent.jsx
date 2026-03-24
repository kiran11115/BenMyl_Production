import React, { useEffect, useState } from "react";
import {
  Edit2,
  Plus,
  ChevronDown,
  ChevronUp,
  Trash2,
  User,
  Info,
  GraduationCap,
  Briefcase,
  Layers,
  CheckCircle,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import "./UploadTalent.css";
import {
  useApprovedEmployeeMutation,
  useDraftProfileEmployeeMutation,
  useGetEmployeeResumeQuery,
} from "../../State-Management/Api/UploadResumeApiSlice";
import {
  ValidationErrorModal,
  ConfirmSaveModal,
  SaveSuccessModal,
  SaveErrorModal,
} from "./SaveTalentAlert";

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
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = accordionAnimationStyles;
  if (!document.head.querySelector("style[data-accordion-animation]")) {
    style.setAttribute("data-accordion-animation", "true");
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
    <div className="premium-resume-card">
      {/* Header Section */}
      <div className="resume-header-section">
        <h1 className="resume-name">
          {data.firstName} {data.lastName}
        </h1>
        <div className="resume-contact">
          <span>{data.emailAddress}</span>
          <span>{data.phoneNo}</span>
          {data.city && (
            <span>
              {data.city}, {data.state}
            </span>
          )}
        </div>
      </div>

      {/* Summary */}
      {data.bio && (
        <div className="resume-section">
          <h3 className="resume-section-title">Professional Summary</h3>
          <p
            className="resume-list"
            style={{
              paddingLeft: 0,
              textAlign: "justify",
              borderBottom: "none",
            }}
          >
            {data.bio}
          </p>
        </div>
      )}

      {/* Experience */}
      {data.workexperiences && data.workexperiences.length > 0 && (
        <div className="resume-section">
          <h3 className="resume-section-title">Professional Experience</h3>
          {data.workexperiences.map((e, i) => (
            <div key={i} className="resume-item">
              <div className="resume-item-header">
                <div className="resume-item-main">{e.companyName}</div>
                <div className="resume-date-badge">
                  {e.startDate?.slice(0, 7)} —{" "}
                  {e.endDate ? e.endDate.slice(0, 7) : "Present"}
                </div>
              </div>
              <div className="resume-item-sub">{e.position}</div>
              <ul className="resume-list">
                {e.description
                  ?.split(".")
                  .map((d, idx) => d.trim() && <li key={idx}>{d}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.employee_Heighers && data.employee_Heighers.length > 0 && (
        <div className="resume-section">
          <h3 className="resume-section-title">Education</h3>
          {data.employee_Heighers.map((e, i) => (
            <div key={i} className="resume-item">
              <div className="resume-item-header">
                <div className="resume-item-main">{e.university}</div>
                <div className="resume-date-badge">
                  {e.startDate?.slice(0, 4)} — {e.endDate?.slice(0, 4)}
                </div>
              </div>
              <div className="resume-item-sub">
                {e.highestQualification}{" "}
                {e.fieldofstudy && `• ${e.fieldofstudy}`}{" "}
                {e.percentage && `(${e.percentage})`}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {data.employeeprojects && data.employeeprojects.length > 0 && (
        <div className="resume-section">
          <h3 className="resume-section-title">Key Projects</h3>
          {data.employeeprojects.map((p, i) => (
            <div key={i} className="resume-item">
              <div className="resume-item-header">
                <div className="resume-item-main">{p.projectName}</div>
                <div className="resume-date-badge">
                  {p.startDate?.slice(0, 7)} —{" "}
                  {p.endDate ? p.endDate.slice(0, 7) : "Present"}
                </div>
              </div>
              <p
                className="resume-list"
                style={{ paddingLeft: 0, marginBottom: "12px" }}
              >
                {p.description}
              </p>
              <div className="resume-skills-grid">
                {p.skills?.split(",").map((s, idx) => (
                  <span key={idx} className="resume-skill-pill">
                    {s.trim()}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills && (
        <div className="resume-section">
          <h3 className="resume-section-title">Core Competencies</h3>
          <div className="resume-skills-grid">
            {data.skills.split(",").map((s, i) => (
              <span key={i} className="resume-skill-pill">
                {s.trim()}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ===== VALIDATION FUNCTIONS =====
const validateFirstName = (val) => {
  if (!val || val.trim() === "") return "First name is required";
  if (!/^[a-zA-Z\s]*$/.test(val))
    return "First name should contain only letters";
  return null;
};

const validateLastName = (val) => {
  if (!val || val.trim() === "") return "Last name is required";
  if (!/^[a-zA-Z\s]*$/.test(val))
    return "Last name should contain only letters";
  return null;
};

const validatePosition = (val) => {
  if (!val || val.trim() === "") return "Position is required";
  return null;
};

const validatePhone = (val) => {
  if (!val || val.trim() === "") return "Phone number is required";
  if (!/^\d+$/.test(val.replace(/[\s\-\(\)+]/g, "")))
    return "Phone number should contain only numbers";
  return null;
};

const validateEmail = (val) => {
  if (!val || val.trim() === "") return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
    return "Please enter a valid email address";
  if (!val.toLowerCase().includes(".com"))
    return "Email should have .com domain";
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
  if (!/^\d+$/.test(String(val).replace(/[\s\-\(\)+]/g, "")))
    return "Emergency contact should contain only numbers";
  return null;
};

const validateAddress = (val) => {
  if (!val || String(val).trim() === "") return "Address is required";
  if (String(val).trim().length < 5)
    return "Address should be more descriptive";
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
  if (val.trim().length < 50)
    return "Bio should contain at least 50 characters";
  return null;
};

// ===== EDUCATION VALIDATION FUNCTIONS =====
const validateUniversity = (val) => {
  if (!val || val.trim() === "") return "University is required";
  if (!/^[a-zA-Z\s.]*$/.test(val))
    return "University should contain only letters";
  return null;
};

const validateQualification = (val) => {
  if (!val || val.trim() === "") return "Qualification is required";
  if (!/^[a-zA-Z\s]*$/.test(val))
    return "Qualification should contain only letters";
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
  if (!/^\d+(?:\.\d+)?$/.test(String(val).trim()))
    return "Percentage should contain only numbers";
  return null;
};

const validateCertifications = (val) => {
  // Certifications optional — only validate when provided
  if (!val || String(val).trim() === "") return null;
  if (!/^[a-zA-Z,\s]*$/.test(String(val)))
    return "Certifications should contain only letters, commas and spaces";
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
  if (String(val).trim().length < 10)
    return "Description should be more descriptive";
  return null;
};

// ===== PROJECTS VALIDATION FUNCTIONS =====
const validateProjectName = (val) => {
  if (!val || val.trim() === "") return " name is required";
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
  if (isNaN(d)) return "Please enter a valid project start date";
  return null;
};

const validateProjectEndDate = (val) => {
  // End date optional — only validate when provided
  if (!val || String(val).trim() === "") return null;
  const d = new Date(val);
  if (isNaN(d)) return "Please enter a valid project end date";
  return null;
};

const validateProjectSkills = (val) => {
  if (!val || val.trim() === "") return "Skills are required";
  return null;
};

const validateProjectDescription = (val) => {
  // Description optional — only validate when provided
  if (!val || String(val).trim() === "") return null;
  if (String(val).trim().length < 10)
    return "Description should be more descriptive";
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
      skills: validateExpSkills,
      description: validateExpDescription,
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
      description: validateProjectDescription,
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
    certifications: validateCertifications,
  };
  return validations[key] || null;
};

const EditableField = ({
  label,
  value,
  editing,
  onEdit,
  onSave,
  onCancel,
  section,
  hideEditButton,
  required,
}) => {
  const isDateField =
    label.toLowerCase().includes("date") || label.toLowerCase().includes("dob");

  const [temp, setTemp] = useState(
    isDateField ? formatDateToInput(value) : value || "",
  );

  const [errorLocal, setErrorLocal] = useState(null);

  const handleChange = (e) => {
    const newVal = e.target.value;
    setTemp(newVal);
    setErrorLocal(null);
    onSave(newVal);
  };

  const hasValidationError = required && !temp;

  return (
    <div className="field-group">
      <label className="field-label">
        {label}
        {required && <span style={{ color: "#ef4444" }}> *</span>}
      </label>

      {editing ? (
        <div style={{ position: "relative" }}>
          <input
            type={isDateField ? "date" : "text"}
            className={`field-input ${hasValidationError ? "error-border" : ""}`}
            value={temp}
            onChange={handleChange}
            autoFocus
          />
          {errorLocal && (
            <div style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>
              {errorLocal}
            </div>
          )}
        </div>
      ) : (
        <div className="field-value">
          {isDateField ? formatDateToDisplay(value) : value || "—"}
        </div>
      )}
    </div>
  );
};

const EditableTextarea = ({
  label,
  value,
  editing,
  onEdit,
  onSave,
  onCancel,
  section,
  hideEditButton,
  required,
}) => {
  const [temp, setTemp] = useState(value || "");
  const [errorLocal, setErrorLocal] = useState(null);

  const handleChange = (e) => {
    const newVal = e.target.value;
    setTemp(newVal);
    setErrorLocal(null);
    onSave(newVal);
  };

  const hasValidationError = required && !temp;

  return (
    <div className="field-group">
      <label className="field-label">
        {label}
        {required && <span style={{ color: "#ef4444" }}> *</span>}
      </label>
      {editing ? (
        <div style={{ position: "relative" }}>
          <textarea
            className={`field-input ${hasValidationError ? "error-border" : ""}`}
            style={{ minHeight: 120 }}
            value={temp}
            onChange={handleChange}
            autoFocus
          />
          {errorLocal && (
            <div style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>
              {errorLocal}
            </div>
          )}
        </div>
      ) : (
        <div
          className="field-value"
          style={{
            display: "block",
            height: "auto",
            minHeight: "80px",
            lineHeight: "1.6",
          }}
        >
          {value || "—"}
        </div>
      )}
    </div>
  );
};

const EditableTags = ({
  label,
  values,
  editing,
  onEdit,
  onSave,
  onCancel,
  section,
  hideEditButton,
  required,
}) => {
  const [temp, setTemp] = useState(values.join(", "));
  const [errorLocal, setErrorLocal] = useState(null);

  const handleChange = (e) => {
    const newVal = e.target.value;
    setTemp(newVal);
    setErrorLocal(null);
    onSave(
      newVal
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    );
  };

  const hasValidationError = required && (!temp || temp.length === 0);

  return (
    <div className="field-group">
      <label className="field-label">
        {label}
        {required && <span style={{ color: "#ef4444" }}> *</span>}
      </label>
      {editing ? (
        <div style={{ position: "relative" }}>
          <textarea
            className={`field-input ${hasValidationError ? "error-border" : ""}`}
            style={{ minHeight: 100 }}
            value={temp}
            onChange={handleChange}
            autoFocus
          />
          {errorLocal && (
            <div style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>
              {errorLocal}
            </div>
          )}
        </div>
      ) : (
        <div className="tag-container">
          {values.length === 0 ? (
            <span className="auth-subtitle">No items</span>
          ) : (
            values.map((v, i) => (
              <span key={i} className="status-tag status-progress">
                {v}
              </span>
            ))
          )}
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

  // MULTI OPEN ACCORDIONS
  const [openAccordions, setOpenAccordions] = useState(["basicInfo"]);

  const toggleAccordion = (key) => {
    setOpenAccordions((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const [editingSections, setEditingSections] = useState([]);
  const [basicInfoErrors, setBasicInfoErrors] = useState(null);
  const [personalInfoErrors, setPersonalInfoErrors] = useState(null);
  const [educationErrors, setEducationErrors] = useState(null);
  const [experienceErrors, setExperienceErrors] = useState(null);
  const [projectsErrors, setProjectsErrors] = useState(null);

  const beginEdit = (s) =>
    setEditingSections((prev) => [...new Set([...prev, s])]);
  const cancelEdit = (s) => {
    setEditingSections((prev) => prev.filter((k) => k !== s));
    if (s === "basicInfo") setBasicInfoErrors(null);
    if (s === "personalInfo") setPersonalInfoErrors(null);
    if (s === "education") setEducationErrors(null);
    if (s === "experience") setExperienceErrors(null);
    if (s === "projects") setProjectsErrors(null);
  };

  const saveBasicInfo = () => {
    const errors = validateAllBasicInfo(talent.basicInfo);
    if (errors.length > 0) {
      setBasicInfoErrors(errors[0]);
      return;
    }
    setBasicInfoErrors(null);
    cancelEdit("basicInfo");
  };

  const savePersonalInfo = () => {
    const errors = validateAllPersonalInfo(talent.personalInfo);
    if (errors.length > 0) {
      setPersonalInfoErrors(errors[0]);
      return;
    }
    setPersonalInfoErrors(null);
    cancelEdit("personalInfo");
  };

  const saveEducation = () => {
    const errors = validateAllEducation(talent.education);
    if (errors.length > 0) {
      setEducationErrors(errors[0]);
      return;
    }
    setEducationErrors(null);
    cancelEdit("education");
  };

  const saveExperience = () => {
    const errors = validateAllExperience(talent.experience);
    if (errors.length > 0) {
      setExperienceErrors(errors[0]);
      return;
    }
    setExperienceErrors(null);
    cancelEdit("experience");
  };

  const saveProjects = () => {
    const errors = validateAllProjects(talent.projects);
    if (errors.length > 0) {
      setProjectsErrors(errors[0]);
      return;
    }
    setProjectsErrors(null);
    cancelEdit("projects");
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

    const positionError = validatePosition(basicInfo.position);
    if (positionError) errors.push(positionError);

    const emailError = validateEmail(basicInfo.email);
    if (emailError) errors.push(emailError);

    return errors;
  };

  // ===== VALIDATE ALL PERSONAL INFO =====
  const validateAllPersonalInfo = (personalInfo) => {
    const errors = [];

    const addressError = validateAddress(personalInfo.address);
    if (addressError) errors.push(addressError);

    return errors;
  };

  // ===== VALIDATE ALL EDUCATION ENTRIES =====
  const validateAllEducation = (educationArr) => {
    const errors = [];
    if (!Array.isArray(educationArr)) return errors;
    educationArr.forEach((edu, idx) => {
      // Only validate dates if any info is entered in this education entry
      const hasData =
        edu.university?.trim() ||
        edu.qualification?.trim() ||
        edu.field?.trim();

      if (hasData) {
        if (!edu.startDate || String(edu.startDate).trim() === "") {
          errors.push(`Education[${idx + 1}]: Start Date is required`);
        }
        if (!edu.endDate || String(edu.endDate).trim() === "") {
          errors.push(`Education[${idx + 1}]: End Date is required`);
        }
      }
    });
    return errors;
  };

  // ===== VALIDATE ALL EXPERIENCE ENTRIES =====
  const validateAllExperience = (experienceArr) => {
    const errors = [];
    if (!Array.isArray(experienceArr)) return errors;
    experienceArr.forEach((exp, idx) => {
      // Only validate dates if any info is entered
      const hasData = exp.company?.trim() || exp.position?.trim();

      if (hasData) {
        if (!exp.startDate || String(exp.startDate).trim() === "") {
          errors.push(`Experience[${idx + 1}]: Start Date is required`);
        }
        // if (!exp.endDate || String(exp.endDate).trim() === "") {
        //   errors.push(`Experience[${idx + 1}]: End Date is required`);
        // }
      }
    });
    return errors;
  };

  // ===== VALIDATE ALL PROJECTS ENTRIES =====
  const validateAllProjects = (projectsArr) => {
    const errors = [];
    if (!Array.isArray(projectsArr)) return errors;
    projectsArr.forEach((proj, idx) => {
      // Only validate dates if any info is entered in this project entry
      const hasData =
        proj.projectName?.trim() ||
        proj.role?.trim() ||
        proj.description?.trim();

      if (hasData) {
        if (!proj.startDate || String(proj.startDate).trim() === "") {
          errors.push(`Project[${idx + 1}]: Start Date is required`);
        }
        if (!proj.endDate || String(proj.endDate).trim() === "") {
          errors.push(`Project[${idx + 1}]: End Date is required`);
        }
      }
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

    const allErrors = [
      ...validationErrors,
      ...personalErrors,
      ...educationErrors,
      ...experienceErrors,
      ...projectErrors,
    ];
    if (allErrors.length > 0) {
      setValidationErrorsState(allErrors);

      // Auto-expand and enter edit mode for ALL failing sections
      const sectionsToOpen = [];
      const sectionsToEdit = [];
      if (validationErrors.length > 0) {
        sectionsToOpen.push("basicInfo");
        sectionsToEdit.push("basicInfo");
      }
      if (personalErrors.length > 0) {
        sectionsToOpen.push("personalInfo");
        sectionsToEdit.push("personalInfo");
      }
      if (educationErrors.length > 0) {
        sectionsToOpen.push("education");
        sectionsToEdit.push("education");
      }
      if (experienceErrors.length > 0) {
        sectionsToOpen.push("experience");
        sectionsToEdit.push("experience");
      }
      if (projectErrors.length > 0) {
        sectionsToOpen.push("projects");
        sectionsToEdit.push("projects");
      }
      setOpenAccordions((prev) => [...new Set([...prev, ...sectionsToOpen])]);
      setEditingSections((prev) => [...new Set([...prev, ...sectionsToEdit])]);

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
    formData.append(
      "EmergencyContactNumber",
      talent.personalInfo.emergency ?? "",
    );

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
          EndDate: exp.endDate ? exp.endDate : null,
          Skills: exp.skills ?? [],
          Description: exp.description ?? "",
        })),
      ),
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
          EndDate: proj.endDate || getToday(), // ✅ current date fallback
          Skills: proj.skills ?? [],
          Description: proj.description ?? "",
        })),
      ),
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
          EndDate: edu.endDate || getToday(), // ✅ current date fallback
        })),
      ),
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

    const allErrors = [
      ...validationErrors,
      ...personalErrors,
      ...educationErrors,
      ...experienceErrors,
      ...projectErrors,
    ];
    if (allErrors.length > 0) {
      setValidationErrorsState(allErrors);

      // Auto-expand and enter edit mode for ALL failing sections
      const sectionsToOpen = [];
      const sectionsToEdit = [];
      if (validationErrors.length > 0) {
        sectionsToOpen.push("basicInfo");
        sectionsToEdit.push("basicInfo");
      }
      if (personalErrors.length > 0) {
        sectionsToOpen.push("personalInfo");
        sectionsToEdit.push("personalInfo");
      }
      if (educationErrors.length > 0) {
        sectionsToOpen.push("education");
        sectionsToEdit.push("education");
      }
      if (experienceErrors.length > 0) {
        sectionsToOpen.push("experience");
        sectionsToEdit.push("experience");
      }
      if (projectErrors.length > 0) {
        sectionsToOpen.push("projects");
        sectionsToEdit.push("projects");
      }
      setOpenAccordions((prev) => [...new Set([...prev, ...sectionsToOpen])]);
      setEditingSections((prev) => [...new Set([...prev, ...sectionsToEdit])]);

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
    formData.append(
      "EmergencyContactNumber",
      talent.personalInfo.emergency ?? "",
    );

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
          EndDate: exp.endDate ? exp.endDate : null,
          Skills: exp.skills ?? [],
          Description: exp.description ?? "",
        })),
      ),
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
          EndDate: proj.endDate || getToday(), // ✅ current date fallback
          Skills: proj.skills ?? [],
          Description: proj.description ?? "",
        })),
      ),
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
          EndDate: edu.endDate || getToday(), // ✅ current date fallback
        })),
      ),
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
        skills: data.skills?.split(",") || [],
      },
      personalInfo: {
        dob: data.dob || "",
        gender: data.gender || "",
        emergency: data.emergencyContactNumber || "",
        country: data.country,
        state: data.state,
        city: data.city,
        address: data.address,
        bio: data.bio,
      },
      education:
        data.employee_Heighers?.map((e) => ({
          university: e.university,
          qualification: e.highestQualification || "",
          startDate: e.startDate?.slice(0, 10),
          endDate: e.endDate?.slice(0, 10),
          field: e.fieldofstudy || "",
          percentage: e.percentage,
          certifications: e.certifications ? e.certifications.split(",") : [],
        })) || [],
      experience:
        data.workexperiences?.map((e) => ({
          company: e.companyName,
          position: e.position,
          startDate: e.startDate?.slice(0, 10),
          endDate: e.endDate?.slice(0, 10),
          skills: e.skills?.split(",") || [],
          description: e.description,
        })) || [],
      projects:
        data.employeeprojects?.map((p) => ({
          name: p.projectName,
          role: p.role || "",
          startDate: p.startDate?.slice(0, 10),
          endDate: p.endDate?.slice(0, 10),
          skills: p.skills?.split(",") || [],
          description: p.description,
        })) || [],
    });
  }, [data]);

  if (isLoading || !talent)
    return <div style={{ padding: 40 }}>Loading profile…</div>;

  const addEducation = () =>
    setTalent((p) => ({
      ...p,
      education: [
        ...p.education,
        {
          university: "",
          qualification: "",
          startDate: "",
          endDate: "",
          field: "",
          percentage: "",
          certifications: [],
        },
      ],
    }));
  const addExperience = () =>
    setTalent((p) => ({
      ...p,
      experience: [
        ...p.experience,
        {
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          skills: [],
          description: "",
        },
      ],
    }));
  const addProjects = () =>
    setTalent((p) => ({
      ...p,
      projects: [
        ...p.projects,
        {
          name: "",
          role: "",
          startDate: "",
          endDate: "",
          skills: [],
          description: "",
        },
      ],
    }));

  const deleteExperience = (index) => {
    if (
      window.confirm("Are you sure you want to delete this experience entry?")
    ) {
      setTalent((p) => ({
        ...p,
        experience: p.experience.filter((_, i) => i !== index),
      }));
    }
  };

  const deleteProjects = (index) => {
    if (window.confirm("Are you sure you want to delete this project entry?")) {
      setTalent((p) => ({
        ...p,
        projects: p.projects.filter((_, i) => i !== index),
      }));
    }
  };

  const deleteEducation = (index) => {
    if (
      window.confirm("Are you sure you want to delete this education entry?")
    ) {
      setTalent((p) => ({
        ...p,
        education: p.education.filter((_, i) => i !== index),
      }));
    }
  };

  const smoothStyle = (open) => ({
    maxHeight: open ? 1000 : 0,
    overflow: "auto",
    transition: "max-height .3s ease",

    /* Hide scrollbar — Chrome/Safari/Edge */
    "::-webkit-scrollbar": {
      display: "none",
    },

    /* Firefox */
    scrollbarWidth: "none",

    /* IE/old Edge */
    msOverflowStyle: "none",
  });

  return (
    <div className="review-talent-container">
      <div className="d-flex gap-2 mb-4 align-items-center">
        <button
          className="auth-link"
          onClick={() => navigate("/user/user-upload-talent")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontWeight: 600,
          }}
        >
          <FiArrowLeft /> Talent Management
        </button>
        <span className="auth-subtitle" style={{ color: "#94a3b8" }}>
          / Review Talent
        </span>
      </div>

      <div className="review-talent-layout">
        {/* LEFT: INFORMATION REVIEW */}
        <div className="review-left-panel">
          <div className="review-header-top mb-4">
            <div>
              <h2
                className="header-title"
                style={{ fontSize: "24px", fontWeight: 700 }}
              >
                Review & Edit
              </h2>
              <p
                style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}
              >
                Please verify the extracted information before saving.
              </p>
            </div>
            <div
              style={{
                background: "#f4f0ff",
                color: "#f5810c",
                padding: "8px 16px",
                borderRadius: "100px",
                fontSize: "12px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <CheckCircle size={14} /> AI Processing Complete
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", paddingRight: "4px" }}>
            {/* ===== BASIC INFORMATION ===== */}
            <div
              className={`accordion-item ${openAccordions.includes("basicInfo") ? "active" : ""}`}
            >
              <div
                className="accordion-header"
                onClick={() => toggleAccordion("basicInfo")}
              >
                <div className="header-content">
                  <div className="header-icon-wrapper">
                    <User size={18} />
                  </div>
                  <h5 className="header-title">Basic Information</h5>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {!editingSections.includes("basicInfo") &&
                    openAccordions.includes("basicInfo") && (
                      <button
                        className="btn-premium btn-premium-secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          beginEdit("basicInfo");
                        }}
                        style={{ padding: "6px 14px", fontSize: "13px" }}
                      >
                        <Edit2 size={13} /> Edit
                      </button>
                    )}
                  <ChevronDown
                    size={20}
                    style={{
                      color: openAccordions.includes("basicInfo")
                        ? "#f5810c"
                        : "#94a3b8",
                      transform: openAccordions.includes("basicInfo")
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                    }}
                  />
                </div>
              </div>
              {openAccordions.includes("basicInfo") && (
                <div className="accordion-content">
                  <div className="review-form-grid" style={{ marginTop: 16 }}>
                    {[
                      "firstName",
                      "lastName",
                      "position",
                      "phone",
                      "email",
                    ].map((f) => (
                      <EditableField
                        key={f}
                        label={f}
                        value={talent.basicInfo[f]}
                        editing={editingSections.includes("basicInfo")}
                        onSave={(val) =>
                          setTalent((p) => ({
                            ...p,
                            basicInfo: { ...p.basicInfo, [f]: val },
                          }))
                        }
                        section="basicInfo"
                        required={["firstName", "position", "email"].includes(
                          f,
                        )}
                      />
                    ))}
                  </div>
                  <EditableTags
                    label="Extracted Skills"
                    values={talent.basicInfo.skills}
                    editing={editingSections.includes("basicInfo")}
                    onSave={(val) =>
                      setTalent((p) => ({
                        ...p,
                        basicInfo: { ...p.basicInfo, skills: val },
                      }))
                    }
                  />
                  {basicInfoErrors && editingSections.includes("basicInfo") && (
                    <div
                      style={{
                        color: "#ef4444",
                        fontSize: 13,
                        marginTop: 16,
                        padding: 12,
                        backgroundColor: "#fef2f2",
                        borderRadius: 10,
                        border: "1px solid #fee2e2",
                      }}
                    >
                      {basicInfoErrors}
                    </div>
                  )}
                  {editingSections.includes("basicInfo") && (
                    <div
                      style={{
                        display: "flex",
                        gap: 12,
                        justifyContent: "flex-end",
                        marginTop: 24,
                        paddingTop: 16,
                        borderTop: "1px solid #f1f5f9",
                      }}
                    >
                      <button
                        className="btn-secondary"
                        onClick={() => cancelEdit("basicInfo")}
                      >
                        Cancel
                      </button>
                      <button className="btn-primary" onClick={saveBasicInfo}>
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ===== PERSONAL INFORMATION ===== */}
            <div
              className={`accordion-item ${openAccordions.includes("personalInfo") ? "active" : ""}`}
            >
              <div
                className="accordion-header"
                onClick={() => toggleAccordion("personalInfo")}
              >
                <div className="header-content">
                  <div className="header-icon-wrapper">
                    <Info size={18} />
                  </div>
                  <h5 className="header-title">Personal Information</h5>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {!editingSections.includes("personalInfo") &&
                    openAccordions.includes("personalInfo") && (
                      <button
                        className="btn-premium btn-premium-secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          beginEdit("personalInfo");
                        }}
                        style={{ padding: "6px 14px", fontSize: "13px" }}
                      >
                        <Edit2 size={13} /> Edit
                      </button>
                    )}
                  <ChevronDown
                    size={20}
                    style={{
                      color: openAccordions.includes("personalInfo")
                        ? "#f5810c"
                        : "#94a3b8",
                      transform: openAccordions.includes("personalInfo")
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                    }}
                  />
                </div>
              </div>
              {openAccordions.includes("personalInfo") && (
                <div className="accordion-content">
                  <div className="review-form-grid" style={{ marginTop: 16 }}>
                    {Object.keys(talent.personalInfo).map((field) => {
                      const isTxt = field === "bio";
                      return isTxt ? null : (
                        <EditableField
                          key={field}
                          label={field}
                          value={talent.personalInfo[field]}
                          editing={editingSections.includes("personalInfo")}
                          onSave={(val) =>
                            setTalent((p) => ({
                              ...p,
                              personalInfo: { ...p.personalInfo, [field]: val },
                            }))
                          }
                          section="personalInfo"
                          required={field === "address"}
                        />
                      );
                    })}
                  </div>
                  {talent.personalInfo.bio !== undefined && (
                    <EditableTextarea
                      label="Professional Bio"
                      value={talent.personalInfo.bio}
                      editing={editingSections.includes("personalInfo")}
                      onSave={(val) =>
                        setTalent((p) => ({
                          ...p,
                          personalInfo: { ...p.personalInfo, bio: val },
                        }))
                      }
                      section="personalInfo"
                    />
                  )}
                  {personalInfoErrors &&
                    editingSections.includes("personalInfo") && (
                      <div
                        style={{
                          color: "#ef4444",
                          fontSize: 13,
                          marginTop: 16,
                          padding: 12,
                          backgroundColor: "#fef2f2",
                          borderRadius: 10,
                          border: "1px solid #fee2e2",
                        }}
                      >
                        {personalInfoErrors}
                      </div>
                    )}
                  {editingSections.includes("personalInfo") && (
                    <div
                      style={{
                        display: "flex",
                        gap: 12,
                        justifyContent: "flex-end",
                        marginTop: 24,
                        paddingTop: 16,
                        borderTop: "1px solid #f1f5f9",
                      }}
                    >
                      <button
                        className="btn-premium btn-premium-secondary"
                        onClick={() => cancelEdit("personalInfo")}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn-primary"
                        onClick={savePersonalInfo}
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ===== EDUCATION ===== */}
            <div
              className={`accordion-item ${openAccordions.includes("education") ? "active" : ""}`}
            >
              <div
                className="accordion-header"
                onClick={() => toggleAccordion("education")}
              >
                <div className="header-content">
                  <div className="header-icon-wrapper">
                    <GraduationCap size={18} />
                  </div>
                  <h5 className="header-title">Education</h5>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {!editingSections.includes("education") &&
                    openAccordions.includes("education") && (
                      <button
                        className="btn-premium btn-premium-secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          beginEdit("education");
                        }}
                        style={{ padding: "6px 14px", fontSize: "13px" }}
                      >
                        <Edit2 size={13} /> Edit
                      </button>
                    )}
                  <ChevronDown
                    size={20}
                    style={{
                      color: openAccordions.includes("education")
                        ? "#f5810c"
                        : "#94a3b8",
                      transform: openAccordions.includes("education")
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                    }}
                  />
                </div>
              </div>
              {openAccordions.includes("education") && (
                <div className="accordion-content">
                  {talent.education.map((ed, i) => (
                    <div
                      key={i}
                      style={{
                        border: "1px solid #f1f5f9",
                        padding: "24px 20px",
                        borderRadius: 16,
                        marginTop: 16,
                        marginBottom: 20,
                        background: "#fcfdfe",
                      }}
                    >
                      <div className="review-form-grid">
                        {[
                          "university",
                          "qualification",
                          "startDate",
                          "endDate",
                          "field",
                          "percentage",
                        ].map((field) => (
                          <EditableField
                            key={field}
                            label={field}
                            value={ed[field]}
                            section="education"
                            editing={editingSections.includes("education")}
                            onSave={(val) => {
                              const arr = [...talent.education];
                              arr[i][field] = val;
                              setTalent((p) => ({ ...p, education: arr }));
                            }}
                            required={["startDate", "endDate"].includes(field)}
                          />
                        ))}
                      </div>
                      <EditableTags
                        label="Certifications"
                        section="education"
                        values={ed.certifications}
                        editing={editingSections.includes("education")}
                        onSave={(val) => {
                          const arr = [...talent.education];
                          arr[i].certifications = val;
                          setTalent((p) => ({ ...p, education: arr }));
                        }}
                      />
                      {!editingSections.includes("education") && (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            marginTop: 16,
                          }}
                        >
                          <button
                            className="btn-secondary"
                            onClick={() => deleteEducation(i)}
                            style={{
                              color: "#ef4444",
                              borderColor: "#fee2e2",
                              fontSize: "12px",
                              gap: "6px",
                            }}
                          >
                            <Trash2 size={12} /> Remove
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 12,
                      marginTop: 12,
                    }}
                  >
                    {!editingSections.includes("education") ? (
                      <button
                        className="btn-premium btn-premium-secondary"
                        onClick={addEducation}
                      >
                        <Plus size={14} /> Add Education
                      </button>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "100%",
                        }}
                      >
                        {educationErrors && (
                          <div
                            style={{
                              color: "#ef4444",
                              fontSize: 13,
                              marginBottom: 16,
                              padding: 12,
                              backgroundColor: "#fef2f2",
                              borderRadius: 10,
                              border: "1px solid #fee2e2",
                            }}
                          >
                            {educationErrors}
                          </div>
                        )}
                        <div
                          style={{
                            display: "flex",
                            gap: 12,
                            justifyContent: "flex-end",
                            paddingTop: 16,
                            borderTop: "1px solid #f1f5f9",
                          }}
                        >
                          <button
                            className="btn-premium btn-premium-secondary"
                            onClick={() => cancelEdit("education")}
                          >
                            Cancel
                          </button>
                          <button
                            className="btn-primary"
                            onClick={saveEducation}
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ===== EXPERIENCE ===== */}
            <div
              className={`accordion-item ${openAccordions.includes("experience") ? "active" : ""}`}
            >
              <div
                className="accordion-header"
                onClick={() => toggleAccordion("experience")}
              >
                <div className="header-content">
                  <div className="header-icon-wrapper">
                    <Briefcase size={18} />
                  </div>
                  <h5 className="header-title">Experience</h5>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {!editingSections.includes("experience") &&
                    openAccordions.includes("experience") && (
                      <button
                        className="btn-premium btn-premium-secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          beginEdit("experience");
                        }}
                        style={{ padding: "6px 14px", fontSize: "13px" }}
                      >
                        <Edit2 size={13} /> Edit
                      </button>
                    )}
                  <ChevronDown
                    size={20}
                    style={{
                      color: openAccordions.includes("experience")
                        ? "#f5810c"
                        : "#94a3b8",
                      transform: openAccordions.includes("experience")
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                    }}
                  />
                </div>
              </div>
              {openAccordions.includes("experience") && (
                <div className="accordion-content">
                  {talent.experience.map((ex, i) => (
                    <div
                      key={i}
                      style={{
                        border: "1px solid #f1f5f9",
                        padding: "24px 20px",
                        borderRadius: 16,
                        marginTop: 16,
                        marginBottom: 20,
                        background: "#fcfdfe",
                      }}
                    >
                      <div className="review-form-grid">
                        {["company", "position", "startDate", "endDate"].map(
                          (field) => (
                            <div key={field}>
                              <EditableField
                                label={
                                  field === "startDate"
                                    ? "Start Date"
                                    : field === "endDate"
                                      ? "End Date"
                                      : field
                                }
                                value={ex[field]}
                                section="experience"
                                editing={editingSections.includes("experience")}
                                onSave={(val) => {
                                  const arr = [...talent.experience];
                                  arr[i][field] = val;
                                  setTalent((p) => ({ ...p, experience: arr }));
                                }}
                                required={["startDate", "endDate"].includes(
                                  field,
                                )}
                              />

                              {/* ✅ ADD NOTE ONLY FOR END DATE */}
                              {field === "endDate" && editingSections.includes("experience") && (
                                <p
                                  style={{
                                    fontSize: "12px",
                                    color: "#64748b",
                                    marginTop: "4px",
                                  }}
                                >
                                  Note: If you are currently working, please leave the End Date field empty.
                                </p>
                              )}
                            </div>
                          ),
                        )}
                      </div>
                      <EditableTags
                        label="Skills Used"
                        section="experience"
                        values={ex.skills}
                        editing={editingSections.includes("experience")}
                        onSave={(val) => {
                          const arr = [...talent.experience];
                          arr[i].skills = val;
                          setTalent((p) => ({ ...p, experience: arr }));
                        }}
                      />
                      <EditableTextarea
                        label="Responsibilities"
                        section="experience"
                        value={ex.description}
                        editing={editingSections.includes("experience")}
                        onSave={(val) => {
                          const arr = [...talent.experience];
                          arr[i].description = val;
                          setTalent((p) => ({ ...p, experience: arr }));
                        }}
                      />
                      {!editingSections.includes("experience") && (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            marginTop: 16,
                          }}
                        >
                          <button
                            className="btn-secondary"
                            onClick={() => deleteExperience(i)}
                            style={{
                              color: "#ef4444",
                              borderColor: "#fee2e2",
                              fontSize: "12px",
                              gap: "6px",
                            }}
                          >
                            <Trash2 size={12} /> Remove
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 12,
                      marginTop: 12,
                    }}
                  >
                    {!editingSections.includes("experience") ? (
                      <button
                        className="btn-premium btn-premium-secondary"
                        onClick={addExperience}
                      >
                        <Plus size={14} /> Add Experience
                      </button>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "100%",
                        }}
                      >
                        {experienceErrors && (
                          <div
                            style={{
                              color: "#ef4444",
                              fontSize: 13,
                              marginBottom: 16,
                              padding: 12,
                              backgroundColor: "#fef2f2",
                              borderRadius: 10,
                              border: "1px solid #fee2e2",
                            }}
                          >
                            {experienceErrors}
                          </div>
                        )}
                        <div
                          style={{
                            display: "flex",
                            gap: 12,
                            justifyContent: "flex-end",
                            paddingTop: 16,
                            borderTop: "1px solid #f1f5f9",
                          }}
                        >
                          <button
                            className="btn-premium btn-premium-secondary"
                            onClick={() => cancelEdit("experience")}
                          >
                            Cancel
                          </button>
                          <button
                            className="btn-primary"
                            onClick={saveExperience}
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ===== PROJECTS ===== */}
            <div
              className={`accordion-item ${openAccordions.includes("projects") ? "active" : ""}`}
            >
              <div
                className="accordion-header"
                onClick={() => toggleAccordion("projects")}
              >
                <div className="header-content">
                  <div className="header-icon-wrapper">
                    <Layers size={18} />
                  </div>
                  <h5 className="header-title">Projects</h5>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {!editingSections.includes("projects") &&
                    openAccordions.includes("projects") && (
                      <button
                        className="btn-premium btn-premium-secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          beginEdit("projects");
                        }}
                        style={{ padding: "6px 14px", fontSize: "13px" }}
                      >
                        <Edit2 size={13} /> Edit
                      </button>
                    )}
                  <ChevronDown
                    size={20}
                    style={{
                      color: openAccordions.includes("projects")
                        ? "#f5810c"
                        : "#94a3b8",
                      transform: openAccordions.includes("projects")
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                    }}
                  />
                </div>
              </div>
              {openAccordions.includes("projects") && (
                <div className="accordion-content">
                  {talent.projects.map((pr, i) => (
                    <div
                      key={i}
                      style={{
                        border: "1px solid #f1f5f9",
                        padding: "24px 20px",
                        borderRadius: 16,
                        marginTop: 16,
                        marginBottom: 20,
                        background: "#fcfdfe",
                      }}
                    >
                      <div className="review-form-grid">
                        {["name", "role", "startDate", "endDate"].map(
                          (field) => (
                            <EditableField
                              key={field}
                              label={
                                field === "startDate"
                                  ? "Start Date"
                                  : field === "endDate"
                                    ? "End Date"
                                    : field
                              }
                              value={pr[field]}
                              section="projects"
                              editing={editingSections.includes("projects")}
                              onSave={(val) => {
                                const arr = [...talent.projects];
                                arr[i][field] = val;
                                setTalent((p) => ({ ...p, projects: arr }));
                              }}
                              required={["startDate", "endDate"].includes(
                                field,
                              )}
                            />
                          ),
                        )}
                      </div>
                      <EditableTags
                        label="Key Tech/Skills"
                        section="projects"
                        values={pr.skills}
                        editing={editingSections.includes("projects")}
                        onSave={(val) => {
                          const arr = [...talent.projects];
                          arr[i].skills = val;
                          setTalent((p) => ({ ...p, projects: arr }));
                        }}
                      />
                      <EditableTextarea
                        label="Project Highlights"
                        section="projects"
                        value={pr.description}
                        editing={editingSections.includes("projects")}
                        onSave={(val) => {
                          const arr = [...talent.projects];
                          arr[i].description = val;
                          setTalent((p) => ({ ...p, projects: arr }));
                        }}
                      />
                      {!editingSections.includes("projects") && (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            marginTop: 16,
                          }}
                        >
                          <button
                            className="btn-secondary"
                            onClick={() => deleteProjects(i)}
                            style={{
                              color: "#ef4444",
                              borderColor: "#fee2e2",
                              fontSize: "12px",
                              gap: "6px",
                            }}
                          >
                            <Trash2 size={12} /> Remove
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 12,
                      marginTop: 12,
                    }}
                  >
                    {!editingSections.includes("projects") ? (
                      <button
                        className="btn-premium btn-premium-secondary"
                        onClick={addProjects}
                      >
                        <Plus size={14} /> Add Project
                      </button>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "100%",
                        }}
                      >
                        {projectsErrors && (
                          <div
                            style={{
                              color: "#ef4444",
                              fontSize: 13,
                              marginBottom: 16,
                              padding: 12,
                              backgroundColor: "#fef2f2",
                              borderRadius: 10,
                              border: "1px solid #fee2e2",
                            }}
                          >
                            {projectsErrors}
                          </div>
                        )}
                        <div
                          style={{
                            display: "flex",
                            gap: 12,
                            justifyContent: "flex-end",
                            paddingTop: 16,
                            borderTop: "1px solid #f1f5f9",
                          }}
                        >
                          <button
                            className="btn-premium btn-premium-secondary"
                            onClick={() => cancelEdit("projects")}
                          >
                            Cancel
                          </button>
                          <button
                            className="btn-primary"
                            onClick={saveProjects}
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ACTION AREA */}
          <div className="review-actions">
            <label className="verification-checkbox">
              <input
                type="checkbox"
                checked={isReviewed}
                onChange={(e) => setIsReviewed(e.target.checked)}
              />
              <span className="verification-text">
                I confirm that I have reviewed all extracted data and it is
                correct.
              </span>
            </label>
            <div className="action-buttons">
              <button
                className="btn-secondary"
                disabled={!isReviewed || isSaving || draft}
                onClick={handleDraftTalent}
              >
                {draft ? "Saving..." : "Save as Draft"}
              </button>
              <button
                className="btn-primary"
                disabled={!isReviewed || isSaving || draft}
                onClick={handleSaveTalent}
              >
                {isSaving ? "Finalizing..." : "Approve & Save Talent"}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: RESUME PREVIEW */}
        <div className="review-right-panel">
          <div
            style={{
              padding: "24px 32px",
              borderBottom: "1px solid #f1f5f9",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#fcfdfe",
            }}
          >
            <h4 className="header-title" style={{ fontSize: "18px" }}>
              Resume Preview
            </h4>
            <div
              style={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}
            >
              Extracted from Original PDF Document
            </div>
          </div>
          <div
            style={{
              height: "calc(100vh - 120px)",
              overflowY: "auto",
              padding: "24px",
            }}
          >
            <PDFResumePreview data={data} />
          </div>
        </div>
      </div>
      {validationErrorsState && (
        <ValidationErrorModal
          errors={validationErrorsState}
          onClose={() => setValidationErrorsState(null)}
          onRetry={() => setValidationErrorsState(null)}
          onContactSupport={() => {
            setValidationErrorsState(null);
            navigate("/support");
          }}
        />
      )}

      {showSuccessModal && (
        <SaveSuccessModal onClose={() => setShowSuccessModal(false)} />
      )}
    </div>
  );
};

export default ReviewTalent;
