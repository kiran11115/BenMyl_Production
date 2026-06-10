import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiX, FiSave, FiImage, FiArrowLeft, FiBriefcase, FiMapPin, FiMail, FiGlobe } from "react-icons/fi";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  useUpdateRecruiterProfileMutation,
  useGetRecruiterProfileQuery,
} from "../../State-Management/Api/RecruiterProfileApiSlice";
import "./EditProfile.css";
import ProfilePreviewPanel from "../Admin/AdminProfile/ProfilePreviewPanel";
import "../PostNewPositions/PostNewPositions.css";
import { State, City } from "country-state-city";

const countryIsoMap = {
  USA: "US",
  US: "US",
  India: "IN",
  IN: "IN",
  UK: "GB",
  GB: "GB",
  UAE: "AE",
  AE: "AE",
  CA: "CA",
  Canada: "CA"
};


function EditProfile() {
  const navigate = useNavigate();
  const [updateRecruiterProfile, { isLoading: isSaving }] =
    useUpdateRecruiterProfileMutation();

  /* ================= LOGO ================= */
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);



  const userId = localStorage.getItem("CompanyId"); // stores authInfoID = 315
  const adminName = localStorage.getItem("adminFirstName");

  const {
    data: recruiterData,
    isLoading,
    isError,
  } = useGetRecruiterProfileQuery(Number(userId), {
    refetchOnMountOrArgChange: true,
  });




  /* ================= VALIDATION ================= */
  const currentYear = new Date().getFullYear();

  const validationSchema = Yup.object({
    /* ================= BASIC INFO ================= */
    name: Yup.string()
      .trim()
      .min(3, "Full name must be at least 3 characters")
      .max(100, "Full name is too long")
      .required("Full name is required"),

    companyname: Yup.string()
      .trim()
      .min(2, "Company name must be at least 2 characters")
      .max(150, "Company name is too long")
      .required("Company name is required"),

    description: Yup.string()
      .trim()
      .min(20, "Description must be at least 20 characters")
      .max(500, "Maximum 500 characters allowed")
      .required("Description is required"),

    /* ================= ADDRESS ================= */
    headquarters: Yup.object({
      street1: Yup.string()
        .trim()
        .required("Street address is required"),

      street2: Yup.string().trim(),

      city: Yup.string()
        .trim()
        .required("City is required"),

      state: Yup.string()
        .trim()
        .required("State is required"),

      postalCode: Yup.string()
        .trim()
        .matches(/^[0-9A-Za-z -]{4,10}$/, "Invalid postal code")
        .required("Postal code is required"),

      country: Yup.string()
        .required("Country is required"),
    }),

    /* ================= CONTACT ================= */
    contact: Yup.object({
      email: Yup.string()
        .trim()
        .email("Invalid email address")
        .required("Email is required"),

      phone: Yup.string()
        .trim()
        .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
        .required("Phone number is required"),

      linkedinUrl: Yup.string()
        .nullable()
        .transform((value) => (value === "" ? null : value))
        .matches(
          /^https?:\/\/(www\.)?linkedin\.com\/.*$/,
          "Enter a valid LinkedIn URL"
        ),
    }),

    /* ================= WORK EXPERIENCE ================= */
    workExperience: Yup.array()
      .of(
        Yup.object({
          role: Yup.string()
            .trim()
            .required("Role is required"),

          company: Yup.string()
            .trim()
            .required("Company is required"),

          startYear: Yup.number()
            .typeError("Start year must be a number")
            .min(1950, "Invalid start year")
            .max(currentYear, "Start year cannot be in the future")
            .required("Start year is required"),

          endYear: Yup.number()
            .nullable()
            .when("isCurrent", {
              is: false,
              then: (schema) =>
                schema
                  .typeError("End year must be a number")
                  .min(Yup.ref("startYear"), "End year cannot be before start year")
                  .max(currentYear, "End year cannot be in the future")
                  .required("End year is required"),
              otherwise: (schema) => schema.nullable(),
            }),

          isCurrent: Yup.boolean(),
        })
      )
      .min(1, "At least one work experience is required"),

    /* ================= ADDITIONAL INFO ================= */
    additionalInfo: Yup.object({
      jobTitle: Yup.string()
        .trim()
        .required("Job title is required"),

      experience: Yup.string()
        .trim()
        .required("Experience is required"),

      education: Yup.string()
        .required("Education is required"),

      languages: Yup.array()
        .of(Yup.string())
        .min(1, "Select at least one language")
        .required("Languages are required"),

      referredBy: Yup.string()
        .trim()
        .max(100, "Referred by name is too long"),
    }),
  });


  /* ================= FORMIK ================= */
  const formik = useFormik({
    initialValues: {
      name: "",
      companyname: "",
      description: "",

      headquarters: {
        street1: "",
        street2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      },

      contact: {
        email: "",
        phone: "",
        linkedinUrl: "",
      },

      workExperience: [
        { role: "", company: "", startYear: "", endYear: "", isCurrent: false },
      ],

      additionalInfo: {
        jobTitle: "",
        experience: "",
        education: "",
        languages: [],
        referredBy: adminName,
      },
    },

    validationSchema,

    onSubmit: async (values) => {
      const fd = new FormData();
      // ✅ USER ID BASED API CALL (FROM AUTH)
      fd.append("AuthInfoID", userId);

      fd.append("FullName", values.name);
      fd.append("CompanyName", values.companyname);
      fd.append("Description", values.description);

      fd.append("StreetAddress1", values.headquarters.street1);
      fd.append("StreetAddress2", values.headquarters.street2);
      fd.append("City", values.headquarters.city);
      fd.append("State", values.headquarters.state);
      fd.append("PostalCode", values.headquarters.postalCode);
      fd.append("Country", values.headquarters.country);

      fd.append("Emailid", values.contact.email);
      fd.append("Phone", values.contact.phone);
      fd.append("LinkedInURL", values.contact.linkedinUrl);

      const exp = values.workExperience[0];
      fd.append("Role", exp.role);
      fd.append("Company", exp.company);
      fd.append("StartYear", exp.startYear);
      fd.append("EndYear", exp.isCurrent ? "" : exp.endYear);

      fd.append("Jobtitle", values.additionalInfo.jobTitle);
      fd.append("Experience", values.additionalInfo.experience);
      fd.append("Education", values.additionalInfo.education);
      fd.append("ReferedBy", values.additionalInfo.referredBy);
      fd.append("LanguagesSpoken", values.additionalInfo.languages.join(","));

      if (logoFile instanceof File) {
        fd.append("ProfilePhotos", logoFile);
      }


      await updateRecruiterProfile(fd).unwrap();
      const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
      const targetPath = window.location.pathname.toLowerCase().startsWith('/admin') ? `${basePath}/admin-profile` : `${basePath}/user-profile`;
      navigate(targetPath);

    },
  });

  const countryCode = countryIsoMap[formik.values.headquarters.country] || formik.values.headquarters.country || "US";
  const states = State.getStatesOfCountry(countryCode);

  const stateObj = states.find(
    (s) =>
      s.name.toLowerCase() === formik.values.headquarters.state?.toLowerCase() ||
      s.isoCode.toLowerCase() === formik.values.headquarters.state?.toLowerCase()
  );
  const selectedStateValue = stateObj ? stateObj.isoCode : "";

  const cities = selectedStateValue
    ? City.getCitiesOfState(countryCode, selectedStateValue)
    : [];

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    formik.setFieldValue("headquarters.country", selectedCountry);
    formik.setFieldValue("headquarters.state", "");
    formik.setFieldValue("headquarters.city", "");
  };

  const handleStateChange = (e) => {
    const stateIsoCode = e.target.value;
    const selectedStateObj = states.find((s) => s.isoCode === stateIsoCode);
    const stateName = selectedStateObj ? selectedStateObj.name : "";
    formik.setFieldValue("headquarters.state", stateName);
    formik.setFieldValue("headquarters.city", "");
  };

  const handleCityChange = (e) => {
    const cityName = e.target.value;
    formik.setFieldValue("headquarters.city", cityName);
  };

  useEffect(() => {
    if (!recruiterData) return;

    if (recruiterData?.profilePhoto) {
      setLogoPreview(`${recruiterData.profilePhoto}?t=${Date.now()}`);
    }

    formik.setValues({
      name: recruiterData.fullName || "",
      companyname: recruiterData.companyName || "",
      description: recruiterData.description || "",

      headquarters: {
        street1: recruiterData.streetAddress1 || "",
        street2: recruiterData.streetAddress2 || "",
        city: recruiterData.city || "",
        state: recruiterData.state || "",
        postalCode: recruiterData.postalCode || "",
        country: recruiterData.country || "",
      },

      contact: {
        email: recruiterData.emailid || "",
        phone: recruiterData.phone || "",
        linkedinUrl: recruiterData.linkedinURL || "",
      },

      workExperience: [
        {
          role: recruiterData.role || "",
          company: recruiterData.company || "",
          startYear: recruiterData.startYear || "",
          endYear: recruiterData.endYear || "",
          isCurrent: !recruiterData.endYear,
        },
      ],

      additionalInfo: {
        jobTitle: recruiterData.jobtitle || "",
        experience: recruiterData.experience || "",
        education: recruiterData.education || "",
        languages: recruiterData.languagesSpoken
          ? recruiterData.languagesSpoken.split(",")
          : [],
        referredBy: adminName || "",
      },
    });
  }, [recruiterData]);



  const formData = formik.values;

  // Live preview data mapped from formik values
  const previewData = {
    companyname: formData.companyname,
    Emailid: formData.contact?.email,
    City: formData.headquarters?.city,
    State: formData.headquarters?.state,
    Country: formData.headquarters?.country,
    Description: formData.description,
  };

  const handleChange = useCallback(
    (e) => {
      formik.handleChange(e);
    },
    [formik]
  );

  /* ================= EXPERIENCE ================= */
  const handleExperienceChange = (index, field, value) => {
    const updated = [...formData.workExperience];
    updated[index] = { ...updated[index], [field]: value };
    formik.setFieldValue("workExperience", updated);
  };

  const addExperience = () => {
    formik.setFieldValue("workExperience", [
      ...formData.workExperience,
      { role: "", company: "", startYear: "", endYear: "", isCurrent: false },
    ]);
  };

  const removeExperience = (index) => {
    formik.setFieldValue(
      "workExperience",
      formData.workExperience.filter((_, i) => i !== index)
    );
  };

  const totalExperience = useMemo(() => {
    let total = 0;
    formData.workExperience.forEach((exp) => {
      if (exp.startYear) {
        const start = Number(exp.startYear);
        const end = exp.isCurrent
          ? new Date().getFullYear()
          : Number(exp.endYear || start);
        total += Math.max(end - start, 0);
      }
    });
    return total;
  }, [formData.workExperience]);



  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Invalid file type");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Max size 5MB");
      return;
    }

    setLogoFile(file);

    const previewUrl = URL.createObjectURL(file);
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoPreview(previewUrl);
  };


  const removeLogo = () => {
    setLogoFile(null);
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoPreview(null);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    formik.handleSubmit();
  };

  const handleCancel = () => {
    const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
    const targetPath = window.location.pathname.toLowerCase().startsWith('/admin') ? `${basePath}/overview-dashboard` : `${basePath}/user-dashboard`;
    navigate(targetPath);
  };

  const FormError = ({ error, touched }) => {
    if (!touched || !error) return null;
    return (
      <small style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>
        {error}
      </small>
    );
  };


  /* ================= JSX ================= */
  return (
    <form onSubmit={handleSubmit} className="ai-dashboard-wrapper">
      {/* HEADER CARD */}
      <div className="hero-card mb-4">
        <div className="hero-left">
          <div className="hero-pill">
            ✦ Edit Profile
          </div>
          <h1 className="job-posting-title text-white">Profile Control Board</h1>
          <div className="job-posting-header-info">
            <p className="job-posting-subtitle">
              Update your credentials, contact options and profile configurations.
            </p>
          </div>
        </div>
        <div className="hero-buttons">
          <button
            type="button"
            className="routine-btn"
            onClick={handleCancel}
          >
            <FiArrowLeft style={{ marginRight: '8px' }} /> Cancel
          </button>
        </div>
      </div>

      <div className="dashboard-layout" style={{ gridTemplateColumns: '6fr 4fr', gap: '24px' }}>
        <div className="dashboard-column-main">
          <div className="premium-card" style={{ padding: '16px', marginBottom: '24px' }}>
            <h2 className="font-display mb-1" style={{ fontSize: "16px", fontWeight: 700, color: "#1F2937", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "8px" }}>
              <FiBriefcase /> Identity & Branding
            </h2>
            <p className="muted small mb-4" style={{ fontSize: "12px", color: "#6B7280" }}>
              Fields indicated with a red asterisk (<span style={{ color: '#ef4444' }}>*</span>) are mandatory values.
            </p>

            {/* Profile Photo */}
            <div style={{ marginBottom: '40px' }}>
              <span className="status-tag status-progress font-mono mb-3 d-inline-block" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', background: '#eef2f6', color: '#5B5BD6', padding: '4px 10px', borderRadius: '6px', fontWeight: 'bold' }}>Profile Photo</span>
              <div className="ep-photo-box">
                <div className="ep-photo-preview">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Preview" />
                  ) : (
                    <div className="ep-photo-placeholder">
                      <FiImage size={40} color="#cbd5e1" />
                    </div>
                  )}
                </div>
                <div className="d-flex flex-column align-items-center gap-2">
                  <label className="ep-add-exp-btn" style={{ cursor: 'pointer' }}>
                    Change Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                  {logoPreview && (
                    <button type="button" className="ep-remove-btn" onClick={removeLogo}>
                      Remove Photo
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div style={{ marginBottom: '40px' }}>
              <span className="status-tag status-progress font-mono mb-3 d-inline-block" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', background: '#eef2f6', color: '#5B5BD6', padding: '4px 10px', borderRadius: '6px', fontWeight: 'bold' }}>Personal Information</span>
              <div className="grid-2">
                <div>
                  <label className="auth-label">Full Name<span style={{ color: '#ef4444' }}> *</span></label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={formik.handleBlur}
                    className="auth-input bg-light"
                    disabled
                  />
                  <FormError
                    error={formik.errors.name}
                    touched={formik.touched.name}
                  />
                </div>
                <div>
                  <label className="auth-label">Company Name<span style={{ color: '#ef4444' }}> *</span></label>
                  <input
                    type="text"
                    name="companyname"
                    value={formData.companyname}
                    onChange={handleChange}
                    onBlur={formik.handleBlur}
                    className="auth-input bg-light"
                    disabled
                  />
                  <FormError
                    error={formik.errors.companyname}
                    touched={formik.touched.companyname}
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '40px' }}>
              <span className="status-tag status-progress font-mono mb-3 d-inline-block" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', background: '#eef2f6', color: '#5B5BD6', padding: '4px 10px', borderRadius: '6px', fontWeight: 'bold' }}>Description</span>
              <div>
                <label className="auth-label">Description<span style={{ color: '#ef4444' }}> *</span></label>
                <textarea
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  onBlur={formik.handleBlur}
                  className="auth-input"
                  style={{ minHeight: '120px' }}
                />
                <FormError
                  error={formik.errors.description}
                  touched={formik.touched.description}
                />
                <small style={{ float: "right", color: "#64748b", marginTop: "4px" }}>
                  {formData.description.length}/500
                </small>
              </div>
            </div>

          </div>

          <div className="premium-card" style={{ padding: '16px', marginBottom: '24px' }}>
            <h2 className="font-display mb-1" style={{ fontSize: "16px", fontWeight: 700, color: "#1F2937", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "8px" }}>
              <FiBriefcase /> Work Experience
            </h2>

              {formData.workExperience.map((exp, index) => (
                <div key={index} className="ep-exp-item mb-4" style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', position: 'relative' }}>
                  <div className="grid-2">
                    <div>
                      <label className="auth-label">Role<span style={{ color: '#ef4444' }}> *</span></label>
                      <input
                        type="text"
                        className="auth-input"
                        value={exp.role}
                        onChange={(e) =>
                          handleExperienceChange(index, "role", e.target.value)
                        }
                        onBlur={() =>
                          formik.setFieldTouched(`workExperience.${index}.role`, true)
                        }
                      />
                      <FormError
                        error={formik.errors.workExperience?.[index]?.role}
                        touched={formik.touched.workExperience?.[index]?.role}
                      />
                    </div>

                    <div>
                      <label className="auth-label">Company<span style={{ color: '#ef4444' }}> *</span></label>
                      <input
                        type="text"
                        className="auth-input"
                        value={exp.company}
                        onChange={(e) =>
                          handleExperienceChange(index, "company", e.target.value)
                        }
                        placeholder="Company Name"
                      />
                    </div>
                  </div>

                  <div className="grid-3 mt-4">
                    <div>
                      <label className="auth-label">Start Year<span style={{ color: '#ef4444' }}> *</span></label>
                      <input
                        type="number"
                        className="auth-input"
                        value={exp.startYear}
                        onChange={(e) =>
                          handleExperienceChange(index, "startYear", e.target.value)
                        }
                        onBlur={() =>
                          formik.setFieldTouched(`workExperience.${index}.startYear`, true)
                        }
                      />
                      <FormError
                        error={formik.errors.workExperience?.[index]?.startYear}
                        touched={formik.touched.workExperience?.[index]?.startYear}
                      />
                    </div>

                    <div>
                      <label className="auth-label">End Year</label>
                      {!exp.isCurrent && (
                        <>
                          <input
                            type="number"
                            className="auth-input"
                            value={exp.endYear}
                            onChange={(e) =>
                              handleExperienceChange(index, "endYear", e.target.value)
                            }
                            onBlur={() =>
                              formik.setFieldTouched(`workExperience.${index}.endYear`, true)
                            }
                          />
                          <FormError
                            error={formik.errors.workExperience?.[index]?.endYear}
                            touched={formik.touched.workExperience?.[index]?.endYear}
                          />
                        </>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', height: '100%', paddingTop: '28px' }}>
                      <label className="auth-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', textTransform: 'none' }}>
                        <input
                          type="checkbox"
                          checked={exp.isCurrent}
                          onChange={(e) =>
                            handleExperienceChange(
                              index,
                              "isCurrent",
                              e.target.checked
                            )
                          }
                          style={{ accentColor: '#f5810c' }}
                        />{" "}
                        Present
                      </label>
                    </div>
                  </div>

                  {formData.workExperience.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExperience(index)}
                      className="ep-remove-btn mt-3"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}

              <div className="ep-exp-footer">
                <button
                  type="button"
                  onClick={addExperience}
                  className="ep-add-exp-btn"
                >
                  + Add Experience
                </button>
                <div className="ep-total-exp">
                  <span>Total Experience:</span> {totalExperience} Years
                </div>
              </div>
            </div>

          <div className="premium-card" style={{ padding: '16px', marginBottom: '24px' }}>
            <h2 className="font-display mb-1" style={{ fontSize: "16px", fontWeight: 700, color: "#1F2937", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "8px" }}>
              <FiMapPin /> Location & Headquarters
            </h2>
              <div className="grid-2">
                <div>
                  <label className="auth-label">Street Address 1<span style={{ color: '#ef4444' }}> *</span></label>
                  <input
                    className="auth-input"
                    name="headquarters.street1"
                    value={formData.headquarters.street1}
                    onChange={handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <FormError
                    error={formik.errors.headquarters?.street1}
                    touched={formik.touched.headquarters?.street1}
                  />
                </div>

                <div>
                  <label className="auth-label">Street Address 2<span style={{ color: '#ef4444' }}> *</span></label>
                  <input
                    className="auth-input"
                    name="headquarters.street2"
                    value={formData.headquarters.street2}
                    onChange={handleChange}
                    placeholder="Street Address 2"
                  />
                </div>
              </div>
              <div className="grid-4 mt-4">
                <div>
                  <label className="auth-label">Country<span style={{ color: '#ef4444' }}> *</span></label>
                  <select
                    className="auth-input"
                    name="headquarters.country"
                    value={formData.headquarters.country}
                    onChange={handleCountryChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="">Select country</option>
                    <option value="IN">India</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                    <option value="AE">UAE</option>
                  </select>
                  <FormError
                    error={formik.errors.headquarters?.country}
                    touched={formik.touched.headquarters?.country}
                  />
                </div>

                <div>
                  <label className="auth-label">State<span style={{ color: '#ef4444' }}> *</span></label>
                  {states.length > 0 ? (
                    <select
                      className="auth-input"
                      name="headquarters.state"
                      value={selectedStateValue}
                      onChange={handleStateChange}
                      onBlur={formik.handleBlur}
                    >
                      <option value="">Select State</option>
                      {states.map((s) => (
                        <option key={s.isoCode} value={s.isoCode}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      className="auth-input"
                      name="headquarters.state"
                      value={formData.headquarters.state}
                      onChange={handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="State"
                    />
                  )}
                  <FormError
                    error={formik.errors.headquarters?.state}
                    touched={formik.touched.headquarters?.state}
                  />
                </div>

                <div>
                  <label className="auth-label">City<span style={{ color: '#ef4444' }}> *</span></label>
                  {selectedStateValue && cities.length > 0 ? (
                    <select
                      className="auth-input"
                      name="headquarters.city"
                      value={formData.headquarters.city}
                      onChange={handleCityChange}
                      onBlur={formik.handleBlur}
                    >
                      <option value="">Select City</option>
                      {cities.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      className="auth-input"
                      name="headquarters.city"
                      value={formData.headquarters.city}
                      onChange={handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="City"
                      disabled={!formData.headquarters.state}
                    />
                  )}
                  <FormError
                    error={formik.errors.headquarters?.city}
                    touched={formik.touched.headquarters?.city}
                  />
                </div>

                <div>
                  <label className="auth-label">Postal Code<span style={{ color: '#ef4444' }}> *</span></label>
                  <input
                    className="auth-input"
                    name="headquarters.postalCode"
                    value={formData.headquarters.postalCode}
                    onChange={handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Postal Code"
                  />
                  <FormError
                    error={formik.errors.headquarters?.postalCode}
                    touched={formik.touched.headquarters?.postalCode}
                  />
                </div>
              </div>
            </div>

          <div className="premium-card" style={{ padding: '16px', marginBottom: '24px' }}>
            <h2 className="font-display mb-1" style={{ fontSize: "16px", fontWeight: 700, color: "#1F2937", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "8px" }}>
              <FiMail /> Primary Contact
            </h2>
              <div className="grid-3">
                <div>
                  <label className="auth-label">Email<span style={{ color: '#ef4444' }}> *</span></label>
                  <input
                    className="auth-input bg-light"
                    name="contact.email"
                    value={formData.contact.email}
                    onChange={handleChange}
                    onBlur={formik.handleBlur}
                    disabled
                  />
                  <FormError
                    error={formik.errors.contact?.email}
                    touched={formik.touched.contact?.email}
                  />
                </div>

                <div>
  <label className="auth-label">
    Phone<span style={{ color: "#ef4444" }}> *</span>
  </label>

  <input
    className="auth-input"
    name="contact.phone"
    value={formData.contact.phone}
    onChange={(e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    formik.setFieldValue("contact.phone", value);
  }}
    onBlur={formik.handleBlur}
    placeholder="Phone"
  />

  <FormError
    error={formik.errors.contact?.phone}
    touched={formik.touched.contact?.phone}
  />
</div>

                <div>
                  <label className="auth-label">Linkedin Url<span style={{ color: '#ef4444' }}> *</span></label>
                  <input
                    className="auth-input"
                    name="contact.linkedinUrl"
                    value={formData.contact.linkedinUrl}
                    onChange={handleChange}
                    placeholder="LinkedIn URL"
                  />
                </div>
              </div>
            </div>

          <div className="premium-card" style={{ padding: '16px' }}>
            <h2 className="font-display mb-1" style={{ fontSize: "16px", fontWeight: 700, color: "#1F2937", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "8px" }}>
              <FiGlobe /> Additional Information
            </h2>
              <div className="grid-2">
                <div>
                  <label className="auth-label">Job Title<span style={{ color: '#ef4444' }}> *</span></label>
                  <input
                    className="auth-input"
                    name="additionalInfo.jobTitle"
                    value={formData.additionalInfo.jobTitle}
                    onChange={handleChange}
                    placeholder="Job Title"
                  />
                </div>

                <div>
                  <label className="auth-label">Experience<span style={{ color: '#ef4444' }}> *</span></label>
                  <input
                    className="auth-input"
                    name="additionalInfo.experience"
                    value={formData.additionalInfo.experience}
                    onChange={handleChange}
                    placeholder="Experience"
                  />
                </div>
              </div>

              <div className="grid-2 mt-4">
                <div>
                  <label className="auth-label">Education<span style={{ color: '#ef4444' }}> *</span></label>
                  <select
                    className="auth-input"
                    name="additionalInfo.education"
                    value={formData.additionalInfo.education}
                    onChange={handleChange}
                  >
                    <option value="">Select education</option>
                    <option value="High School">High School</option>
                    <option value="Bachelor's Degree">Bachelor's Degree</option>
                    <option value="Master's Degree">Master's Degree</option>
                    <option value="PhD">PhD</option>
                  </select>
                </div>

                <div>
                  <label className="auth-label">Referred By<span style={{ color: '#ef4444' }}> *</span></label>
                  <input
                    className="auth-input bg-light"
                    name="additionalInfo.referredBy"
                    value={formData.additionalInfo.referredBy}
                    disabled
                    placeholder="Referred By"
                  />
                </div>
              </div>

              {/* Languages */}
              <div className="mt-4">
                <label className="auth-label">Languages Spoken<span style={{ color: '#ef4444' }}> *</span></label>

                <select
                  className="auth-input"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!value) return;

                    if (!formData.additionalInfo.languages.includes(value)) {
                      formik.setFieldValue("additionalInfo.languages", [
                        ...formData.additionalInfo.languages,
                        value,
                      ]);
                    }

                    e.target.value = "";
                  }}
                  style={{ width: "49%", cursor: "pointer" }}
                >
                  <option value="">Select language</option>
                  {["English", "Hindi", "Telugu", "Tamil", "Kannada", "Spanish", "French"].map(
                    (lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    )
                  )}
                </select>

                {/* Selected language chips */}
                <div className="ep-lang-tags">
                  {formData.additionalInfo.languages.map((lang) => (
                    <span
                      key={lang}
                      className="ep-lang-tag"
                      onClick={() =>
                        formik.setFieldValue(
                          "additionalInfo.languages",
                          formData.additionalInfo.languages.filter((l) => l !== lang)
                        )
                      }
                    >
                      {lang} <span className="ep-lang-tag-remove">✕</span>
                    </span>
                  ))}
                </div>

                {/* Validation error */}
                {formik.touched.additionalInfo?.languages &&
                  formik.errors.additionalInfo?.languages && (
                    <FormError
                      error={formik.errors.additionalInfo.languages}
                      touched={formik.touched.additionalInfo.languages}
                    />
                  )}
                <p style={{ color: "#6b7280", fontSize: "12px", marginTop: "8px" }}>Note: you can select multiple languages</p>
              </div>
            </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: '24px' }}>
            <button type="button" className="btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSaving || !formik.isValid}
            >
              <FiSave style={{ marginRight: '8px' }} /> {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* PREVIEW PANEL */}
        <div className="dashboard-column-side" style={{ position: 'sticky', top: '24px' }}>
          <ProfilePreviewPanel
            data={previewData}
            logoPreview={logoPreview}
            roleBadge="RECRUITER"
          />
        </div>
      </div>
    </form>
  );
}

export default EditProfile;
