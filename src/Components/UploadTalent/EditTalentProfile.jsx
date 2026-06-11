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
import { MapPin, Monitor, Phone } from 'lucide-react';
import { useFormik, FieldArray, FormikProvider } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { Country, State, City } from "country-state-city";
import { useUpdateEmployeeResumeMutation } from "../../State-Management/Api/UploadResumeApiSlice";
import { ValidationErrorModal } from "./SaveTalentAlert";

const yearLimit = 2099;
const dateValidation = Yup.string().test("year-limit", "Year cannot exceed 2099", (value) => {
  if (!value) return true;
  const d = new Date(value);
  return !isNaN(d) && d.getFullYear() <= yearLimit;
});

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  bio: Yup.string()
    .min(50, "Bio must be at least 50 characters")
    .required("Bio is required"),
  phoneNo: Yup.string().required("Phone number is required"),
  address: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  country: Yup.string().required("Country is required"),
  workexperiences: Yup.array().of(
    Yup.object().shape({
      companyName: Yup.string().required("Company name is required"),
      position: Yup.string().required("Position is required"),
      startDate: dateValidation.required("Start date is required"),
      endDate: dateValidation.nullable(),
    }),
  ),
  employeeprojects: Yup.array().of(
    Yup.object().shape({
      projectName: Yup.string().required("Project name is required"),
      role: Yup.string().required("Role is required"),
      startDate: dateValidation.required("Start date is required"),
      endDate: dateValidation.nullable(),
    }),
  ),
  employee_Heighers: Yup.array().of(
    Yup.object().shape({
      university: Yup.string().required("University is required"),
      highestQualification: Yup.string().required("Qualification is required"),
      startDate: dateValidation.required("Start date is required"),
      endDate: dateValidation.nullable(),
    }),
  ),
});

const EditTalentProfile = ({ initialData: propsData, onCancel: propsCancel, onSuccess: propsSuccess }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialData = propsData || location.state?.initialData;
  const onCancel = propsCancel || (() => navigate(-1));
  const onSuccess = propsSuccess || (() => navigate(-1));

  const [updateEmployee, { isLoading: isSaving }] =
    useUpdateEmployeeResumeMutation();
  const [skillInput, setSkillInput] = useState("");
  const [validationErrorsState, setValidationErrorsState] = useState(null);

  // Cascading dropdown state
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [availableStates, setAvailableStates] = useState([]);
  const [selectedStateCode, setSelectedStateCode] = useState("");
  const [availableCities, setAvailableCities] = useState([]);

  // Initialize cascading dropdowns from existing profile data
  useEffect(() => {
    const countryName = initialData?.country || "";
    const stateName = initialData?.state || "";
    if (!countryName) return;

    const allCountries = Country.getAllCountries();
    const countryObj = allCountries.find(
      (c) =>
        c.name.toLowerCase() === countryName.toLowerCase() ||
        c.isoCode.toLowerCase() === countryName.toLowerCase()
    );
    if (countryObj) {
      setSelectedCountryCode(countryObj.isoCode);
      const stateList = State.getStatesOfCountry(countryObj.isoCode);
      setAvailableStates(stateList);

      const stateObj = stateList.find(
        (s) =>
          s.name.toLowerCase() === stateName.toLowerCase() ||
          s.isoCode.toLowerCase() === stateName.toLowerCase()
      );
      if (stateObj) {
        setSelectedStateCode(stateObj.isoCode);
        const cityList = City.getCitiesOfState(countryObj.isoCode, stateObj.isoCode);
        setAvailableCities(cityList);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCountryChange = (e) => {
    const code = e.target.value;
    const countryObj = Country.getCountryByCode(code);
    setSelectedCountryCode(code);
    setSelectedStateCode("");
    setAvailableCities([]);
    const stateList = code ? State.getStatesOfCountry(code) : [];
    setAvailableStates(stateList);
    formik.setFieldValue("country", countryObj ? countryObj.name : "");
    formik.setFieldValue("state", "");
    formik.setFieldValue("city", "");
  };

  const handleStateChange = (e) => {
    const code = e.target.value;
    const stateObj = State.getStateByCodeAndCountry(code, selectedCountryCode);
    setSelectedStateCode(code);
    const cityList = code ? City.getCitiesOfState(selectedCountryCode, code) : [];
    setAvailableCities(cityList);
    formik.setFieldValue("state", stateObj ? stateObj.name : "");
    formik.setFieldValue("city", "");
  };

  const handleCityChange = (e) => {
    formik.setFieldValue("city", e.target.value);
  };

   const calculateExperience = (experiences) => {
  if (!experiences || experiences.length === 0) return 0;

  let totalMonths = 0;

  experiences.forEach((exp) => {
    if (!exp.startDate) return;

    const start = new Date(exp.startDate);
    const end = exp.endDate ? new Date(exp.endDate) : new Date();

    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());

    if (months > 0) totalMonths += months;
  });

  return Math.floor(totalMonths / 12); // convert to years
};

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

      formData.append("EmployeeID", initialData.employeeID);
      formData.append("CompanyID", initialData.companyID);
      formData.append("BranchID", initialData.branchID || 0);

      formData.append("FirstName", initialData.firstName);
      formData.append("LastName", initialData.lastName);

      formData.append("Title", values.title);
      formData.append("PhoneNo", values.phoneNo);
      formData.append("EmailAddress", initialData.emailAddress || "");

      formData.append("Address", values.address);
      formData.append("City", values.city);
      formData.append("State", values.state);
      formData.append("Country", values.country);

      formData.append("Bio", values.bio);
      formData.append("Skills", values.skills || "");

      formData.append("Status", "Approved");

      formData.append("NoofExperience", calculateExperience(values.workexperiences) || 0);

      // Work Experience
      formData.append(
        "workexperiences",
        JSON.stringify(
          values.workexperiences.map((exp) => ({
            ExperienceID: exp.experienceID || 0,
            CompanyName: exp.companyName,
            Position: exp.position,
            StartDate: exp.startDate,
            EndDate: exp.endDate,
            Description: exp.description,
          })),
        ),
      );

      // Projects
      formData.append(
        "project",
        JSON.stringify(
          values.employeeprojects.map((proj) => ({
            ExperienceID: proj.experienceID || 0,
            ProjectName: proj.projectName,
            Role: proj.role,
            StartDate: proj.startDate,
            EndDate: proj.endDate,
            Description: proj.description,
          })),
        ),
      );

      // Education
      formData.append(
        "employee_Heighers",
        JSON.stringify(
          values.employee_Heighers.map((edu) => ({
            _EductionhigherId: edu._EductionhigherId || 0,
            University: edu.university,
            HighestQualification: edu.highestQualification,
            Fieldofstudy: edu.fieldofstudy,
            StartDate: edu.startDate,
            EndDate: edu.endDate,
          })),
        ),
      );

      try {
        await updateEmployee(formData).unwrap();
        onSuccess();
      } catch (err) {
        console.error("Failed to save profile:", err);
        toast.error("Failed to save changes. Please try again.");
      }
    },
  });

  const handleAddSkill = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      const currentSkills = formik.values.skills
        ? formik.values.skills.split(",").map((s) => s.trim())
        : [];
      if (!currentSkills.includes(skillInput.trim())) {
        const updatedSkills = [...currentSkills, skillInput.trim()].join(",");
        formik.setFieldValue("skills", updatedSkills);
      }
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    const currentSkills = formik.values.skills.split(",").map((s) => s.trim());
    const updatedSkills = currentSkills
      .filter((s) => s !== skillToRemove)
      .join(",");
    formik.setFieldValue("skills", updatedSkills);
  };

  const getInitials = (firstName, lastName) => {
    const first = firstName?.charAt(0) || "";
    const last = lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || "??";
  };

  const handleSaveClick = async (e) => {
    if (e) e.preventDefault();
    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0) {
      formik.setTouched(
        Object.keys(formik.values).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {}),
      );

      const errorMessages = [];
      let firstErrorPath = null;

      const flattenErrors = (errObj, prefix = "", pathPrefix = "") => {
        for (const key in errObj) {
          const currentPath = pathPrefix ? `${pathPrefix}.${key}` : key;
          if (Array.isArray(errObj[key])) {
            errObj[key].forEach((item, index) => {
              const itemPath = `${currentPath}.${index}`;
              if (typeof item === "object" && item !== null) {
                const sectionName =
                  key === "workexperiences"
                    ? "Experience"
                    : key === "employeeprojects"
                      ? "Project"
                      : key === "employee_Heighers"
                        ? "Education"
                        : key;
                flattenErrors(item, `${sectionName}[${index + 1}]: `, itemPath);
              } else if (item) {
                if (!firstErrorPath) firstErrorPath = itemPath;
                errorMessages.push(`${prefix}${key}[${index + 1}]: ${item}`);
              }
            });
          } else if (typeof errObj[key] === "object" && errObj[key] !== null) {
            flattenErrors(errObj[key], `${key} `, currentPath);
          } else if (errObj[key]) {
            if (!firstErrorPath) firstErrorPath = currentPath;
            errorMessages.push(`${prefix}${errObj[key]}`);
          }
        }
      };

      flattenErrors(errors);
      setValidationErrorsState(errorMessages);

      // Scroll to the first missing validation field
      if (firstErrorPath) {
        setTimeout(() => {
          const errorElement = document.querySelector(
            `[name="${firstErrorPath}"]`,
          );
          if (errorElement) {
            errorElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
            errorElement.focus({ preventScroll: true });
            // Add a temporary highlight effect
            const originalBorder = errorElement.style.border;
            errorElement.style.border = "1px solid #ef4444";
            setTimeout(() => {
              errorElement.style.border = originalBorder;
            }, 2000);
          }
        }, 100);
      }

      return;
    }
    formik.handleSubmit(e);
  };

  return (
    <FormikProvider value={formik}>
      <form onSubmit={handleSaveClick}>
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
            `}</style>
        <div className="ai-dashboard-wrapper">
          <div className="hero-card mb-4">
            <div className="hero-left">
              <div className="hero-pill">✦ Edit Talent Profile</div>
              <h1 className="job-posting-title text-white">Talent Data Center</h1>
              <div className="job-posting-header-info">
                <p className="job-posting-subtitle">
                  Update talent details and professional background.
                </p>
              </div>
            </div>
            <div className="hero-buttons">
              <button type="button" className="routine-btn" onClick={onCancel}>
                <FiArrowLeft /> Back to Profile
              </button>
            </div>
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
                      <div
                        className="auth-input bg-light"
                        style={{ pointerEvents: "none", opacity: 0.8 }}
                      >
                        {initialData?.firstName} {initialData?.lastName}
                      </div>
                    </div>
                    <div>
                      <label className="auth-label">
                        Professional Title
                        <span style={{ color: "#ef4444" }}> *</span>
                      </label>
                      <input
                        name="title"
                        className="auth-input"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.title && formik.errors.title && (
                        <div className="auth-error">{formik.errors.title}</div>
                      )}
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
                      <label className="auth-label">
                        Phone Number<span style={{ color: "#ef4444" }}> *</span>
                      </label>
                      <input
                        name="phoneNo"
                        className="auth-input"
                        value={formik.values.phoneNo}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.phoneNo && formik.errors.phoneNo && (
                        <div className="auth-error">
                          {formik.errors.phoneNo}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="auth-label">
                        Street Address
                        <span style={{ color: "#ef4444" }}> *</span>
                      </label>
                      <input
                        name="address"
                        className="auth-input"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.address && formik.errors.address && (
                        <div className="auth-error">
                          {formik.errors.address}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="auth-label">
                        Country<span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <select
                        className="auth-input"
                        value={selectedCountryCode}
                        onChange={handleCountryChange}
                        onBlur={formik.handleBlur}
                        name="country"
                      >
                        <option value="">Select Country</option>
                        {Country.getAllCountries().map((c) => (
                          <option key={c.isoCode} value={c.isoCode}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      {formik.touched.country && formik.errors.country && (
                        <div className="auth-error">{formik.errors.country}</div>
                      )}
                    </div>

                    <div>
                      <label className="auth-label">
                        State<span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      {availableStates.length > 0 ? (
                        <select
                          className="auth-input"
                          value={selectedStateCode}
                          onChange={handleStateChange}
                          onBlur={formik.handleBlur}
                          name="state"
                        >
                          <option value="">Select State</option>
                          {availableStates.map((s) => (
                            <option key={s.isoCode} value={s.isoCode}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          name="state"
                          className="auth-input"
                          placeholder="Enter state"
                          value={formik.values.state}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                      )}
                      {formik.touched.state && formik.errors.state && (
                        <div className="auth-error">{formik.errors.state}</div>
                      )}
                    </div>

                    <div>
                      <label className="auth-label">
                        City<span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      {availableCities.length > 0 ? (
                        <select
                          className="auth-input"
                          value={formik.values.city}
                          onChange={handleCityChange}
                          onBlur={formik.handleBlur}
                          name="city"
                        >
                          <option value="">Select City</option>
                          {availableCities.map((city, idx) => (
                            <option key={idx} value={city.name}>
                              {city.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          name="city"
                          className="auth-input"
                          placeholder="Enter city"
                          value={formik.values.city}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                      )}
                      {formik.touched.city && formik.errors.city && (
                        <div className="auth-error">{formik.errors.city}</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bio & Skills */}
                <div style={{ marginBottom: "40px" }}>
                  <div className="section-header">
                    <h3>Professional Summary & Skills</h3>
                  </div>
                  <div className="auth-form-group">
                    <label className="auth-label">
                      Bio<span style={{ color: "#ef4444" }}> *</span>
                    </label>
                    <textarea
                      name="bio"
                      className="auth-input"
                      style={{ height: "100px" }}
                      rows={6}
                      value={formik.values.bio}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.bio && formik.errors.bio && (
                      <div className="auth-error">{formik.errors.bio}</div>
                    )}
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
                      {formik.values.skills &&
                        formik.values.skills
                          .split(",")
                          .map((skill) => skill.trim())
                          .filter(Boolean)
                          .map((skill, idx) => (
                            <span
                              key={idx}
                              className="status-tag status-progress"
                            >
                              {skill}
                              <FiX
                                size={12}
                                className="ms-1"
                                style={{ cursor: "pointer" }}
                                onClick={() => removeSkill(skill)}
                              />
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
                      onClick={() =>
                        formik.setFieldValue("workexperiences", [
                          ...formik.values.workexperiences,
                          {
                            companyName: "",
                            position: "",
                            startDate: "",
                            endDate: "",
                            description: "",
                          },
                        ])
                      }
                    >
                      <FiPlus /> Add Experience
                    </button>
                  </div>
                  <FieldArray name="workexperiences">
                    {({ remove }) => (
                      <div className="experience-edit-list">
                        {formik.values.workexperiences.map((exp, index) => (
                          <div
                            key={index}
                            className="experience-item-card mb-3 p-3 border rounded"
                          >
                            <div className="d-flex justify-content-between mb-2">
                              <h5>Experience #{index + 1}</h5>
                              <button
                                type="button"
                                className="text-danger border-0 bg-transparent"
                                onClick={() => remove(index)}
                              >
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
                                <label className="auth-label small">
                                  Start Date
                                </label>
                                <div className="auth-password-wrapper">
                                  <DatePicker
                                    className="auth-input w-100"
                                    maxDate={new Date("2099-12-31")}
                                    selected={
                                      exp.startDate
                                        ? new Date(exp.startDate)
                                        : null
                                    }
                                    onChange={(date) =>
                                      formik.setFieldValue(
                                        `workexperiences.${index}.startDate`,
                                        date ? date.toLocaleDateString("en-CA") : "",
                                      )
                                    }
                                    dateFormat="dd-MMM-yyyy"
                                    placeholderText="dd-MMM-yyyy"
                                    style={{ paddingLeft: "2.5rem" }}
                                  />
                                  <FiCalendar
                                    size={16}
                                    className="auth-icon-left"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="auth-label small">
                                  End Date
                                </label>
                                <div className="auth-password-wrapper">
                                  <DatePicker
                                    className="auth-input w-100"
                                    maxDate={new Date("2099-12-31")}
                                    selected={
                                      exp.endDate ? new Date(exp.endDate) : null
                                    }
                                    onChange={(date) =>
                                      formik.setFieldValue(
                                        `workexperiences.${index}.endDate`,
                                        date
                                          ? date.toLocaleDateString("en-CA")
                                          : "",
                                      )
                                    }
                                    dateFormat="dd-MMM-yyyy"
                                    placeholderText="dd-MMM-yyyy"
                                    style={{ paddingLeft: "2.5rem" }}
                                  />
                                  <FiCalendar
                                    size={16}
                                    className="auth-icon-left"
                                  />
                                </div>
                                <p
                                  style={{
                                    fontSize: "12px",
                                    color: "#64748b",
                                    marginTop: "4px",
                                  }}
                                >
                                  Note: If you are currently working, please
                                  leave the End Date field empty.
                                </p>
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
                      onClick={() =>
                        formik.setFieldValue("employeeprojects", [
                          ...formik.values.employeeprojects,
                          {
                            projectName: "",
                            role: "",
                            startDate: "",
                            endDate: "",
                            description: "",
                            skills: "",
                          },
                        ])
                      }
                    >
                      <FiPlus /> Add Project
                    </button>
                  </div>
                  <FieldArray name="employeeprojects">
                    {({ remove }) => (
                      <div className="experience-edit-list">
                        {formik.values.employeeprojects.map((proj, index) => (
                          <div
                            key={index}
                            className="experience-item-card mb-3 p-3 border rounded"
                          >
                            <div className="d-flex justify-content-between mb-2">
                              <h5>Project #{index + 1}</h5>
                              <button
                                type="button"
                                className="text-danger border-0 bg-transparent"
                                onClick={() => remove(index)}
                              >
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
                                <label className="auth-label small">
                                  Start Date
                                </label>
                                <div className="auth-password-wrapper">
                                  <DatePicker
                                    className="auth-input w-100"
                                    maxDate={new Date("2099-12-31")}
                                    selected={
                                      proj.startDate
                                        ? new Date(proj.startDate)
                                        : null
                                    }
                                    onChange={(date) =>
                                      formik.setFieldValue(
                                        `employeeprojects.${index}.startDate`,
                                        date ? date.toLocaleDateString("en-CA") : "",
                                      )
                                    }
                                    dateFormat="dd-MMM-yyyy"
                                    placeholderText="dd-MMM-yyyy"
                                    style={{ paddingLeft: "2.5rem" }}
                                  />
                                  <FiCalendar
                                    size={16}
                                    className="auth-icon-left"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="auth-label small">
                                  End Date
                                </label>
                                <div className="auth-password-wrapper">
                                  <DatePicker
                                    className="auth-input w-100"
                                    maxDate={new Date("2099-12-31")}
                                    selected={
                                      proj.endDate
                                        ? new Date(proj.endDate)
                                        : null
                                    }
                                    onChange={(date) =>
                                      formik.setFieldValue(
                                        `employeeprojects.${index}.endDate`,
                                        date ? date.toLocaleDateString("en-CA") : "",
                                      )
                                    }
                                    dateFormat="dd-MMM-yyyy"
                                    placeholderText="dd-MMM-yyyy"
                                    style={{ paddingLeft: "2.5rem" }}
                                  />
                                  <FiCalendar
                                    size={16}
                                    className="auth-icon-left"
                                  />
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
                      onClick={() =>
                        formik.setFieldValue("employee_Heighers", [
                          ...formik.values.employee_Heighers,
                          {
                            university: "",
                            highestQualification: "",
                            fieldofstudy: "",
                            startDate: "",
                            endDate: "",
                          },
                        ])
                      }
                    >
                      <FiPlus /> Add Education
                    </button>
                  </div>
                  <FieldArray name="employee_Heighers">
                    {({ remove }) => (
                      <div className="experience-edit-list">
                        {formik.values.employee_Heighers.map((edu, index) => (
                          <div
                            key={index}
                            className="experience-item-card mb-3 p-3 border rounded"
                          >
                            <div className="d-flex justify-content-between mb-2">
                              <h5>Education #{index + 1}</h5>
                              <button
                                type="button"
                                className="text-danger border-0 bg-transparent"
                                onClick={() => remove(index)}
                              >
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
                                <label className="auth-label small">
                                  Start Date
                                </label>
                                <div className="auth-password-wrapper">
                                  <DatePicker
                                    className="auth-input w-100"
                                    maxDate={new Date("2099-12-31")}
                                    selected={
                                      edu.startDate
                                        ? new Date(edu.startDate)
                                        : null
                                    }
                                    onChange={(date) =>
                                      formik.setFieldValue(
                                        `employee_Heighers.${index}.startDate`,
                                        date ? date.toLocaleDateString("en-CA") : "",
                                      )
                                    }
                                    dateFormat="dd-MMM-yyyy"
                                    placeholderText="dd-MMM-yyyy"
                                    style={{ paddingLeft: "2.5rem" }}
                                  />
                                  <FiCalendar
                                    size={16}
                                    className="auth-icon-left"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="auth-label small">
                                  End Date
                                </label>
                                <div className="auth-password-wrapper">
                                  <DatePicker
                                    className="auth-input w-100"
                                    maxDate={new Date("2099-12-31")}
                                    selected={
                                      edu.endDate ? new Date(edu.endDate) : null
                                    }
                                    onChange={(date) =>
                                      formik.setFieldValue(
                                        `employee_Heighers.${index}.endDate`,
                                        date ? date.toLocaleDateString("en-CA") : "",
                                      )
                                    }
                                    dateFormat="dd-MMM-yyyy"
                                    placeholderText="dd-MMM-yyyy"
                                    style={{ paddingLeft: "2.5rem" }}
                                  />
                                  <FiCalendar
                                    size={16}
                                    className="auth-icon-left"
                                  />
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
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={onCancel}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handleSaveClick}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>

            <div className="dashboard-column-side">
              <div className="sticky-preview">
                <div className="preview-card-dark">
                  <div className="preview-card-logo-row">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div className="preview-company-logo">
                        {getInitials(initialData?.firstName, initialData?.lastName)}
                      </div>
                      <span className="preview-company-name">
                        {initialData?.firstName} {initialData?.lastName}
                      </span>
                    </div>
                  </div>

                  <h3 className={`preview-job-title ${!formik.values.title ? 'preview-placeholder-title' : ''}`}>
                    {formik.values.title || "Professional Title"}
                  </h3>

                  <div className="preview-metas-grid">
                    <div className="preview-meta-item">
                      <span className="preview-meta-icon"><MapPin size={14} /></span>
                      <span>{[formik.values.city, formik.values.state, formik.values.country].filter(Boolean).join(", ") || 'Location'}</span>
                    </div>
                    <div className="preview-meta-item">
                      <span className="preview-meta-icon"><Monitor size={14} /></span>
                      <span>{initialData?.emailAddress || 'Email Address'}</span>
                    </div>
                    <div className="preview-meta-item">
                      <span className="preview-meta-icon"><Phone size={14} /></span>
                      <span>{formik.values.phoneNo || 'Phone No'}</span>
                    </div>
                  </div>

                  <div style={{ height: '1px', backgroundColor: '#20273a', margin: '16px 0' }} />

                  <div>
                    <p className="preview-section-title">REQUIRED INTEL TECH STACK:</p>
                    <div className="preview-tech-stack-container">
                      {formik.values.skills ? (
                        formik.values.skills.split(",").map((skill, idx) => (
                          <span key={idx} className="preview-tech-pill">{skill.trim()}</span>
                        ))
                      ) : (
                        <span className="preview-tech-pill preview-tech-pill-placeholder">No skills added</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="preview-section-title">Description abstract:</p>
                    <p className={`preview-description-abstract ${!formik.values.bio ? 'preview-placeholder-text' : ''}`}>
                      {formik.values.bio 
                        ? (formik.values.bio.length > 150 
                           ? formik.values.bio.slice(0, 150) + "..." 
                           : formik.values.bio)
                        : "No professional summary provided..."}
                    </p>
                  </div>

                  <div style={{ height: '1px', backgroundColor: '#20273a', margin: '16px 0' }} />

                  <div className="preview-sections">
                    <div className="mb-2">
                      <h6 className="d-flex align-items-center gap-2 text-white" style={{ fontSize: '13px' }}>
                        <FiBriefcase size={14} style={{ color: '#8b5cf6' }} /> Experience
                      </h6>
                      <p className="small mb-0" style={{ color: '#94a3b8', marginLeft: '22px' }}>
                        {formik.values.workexperiences.length} entries added
                      </p>
                    </div>
                    <div className="mb-2">
                      <h6 className="d-flex align-items-center gap-2 text-white" style={{ fontSize: '13px' }}>
                        <FiLayers size={14} style={{ color: '#8b5cf6' }} /> Projects
                      </h6>
                      <p className="small mb-0" style={{ color: '#94a3b8', marginLeft: '22px' }}>
                        {formik.values.employeeprojects.length} entries added
                      </p>
                    </div>
                    <div>
                      <h6 className="d-flex align-items-center gap-2 text-white" style={{ fontSize: '13px' }}>
                        <FiBookOpen size={14} style={{ color: '#8b5cf6' }} /> Education
                      </h6>
                      <p className="small mb-0" style={{ color: '#94a3b8', marginLeft: '22px' }}>
                        {formik.values.employee_Heighers.length} entries added
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
        {validationErrorsState && (
          <ValidationErrorModal
            errors={validationErrorsState}
            onClose={() => setValidationErrorsState(null)}
            onRetry={() => setValidationErrorsState(null)}
            onContactSupport={() => setValidationErrorsState(null)}
          />
        )}
      </form>
    </FormikProvider>
  );
};

export default EditTalentProfile;
