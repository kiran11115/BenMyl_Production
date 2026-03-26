import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiX, FiSave, FiImage } from "react-icons/fi";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  useUpdateRecruiterProfileMutation,
  useGetRecruiterProfileQuery,
} from "../../State-Management/Api/RecruiterProfileApiSlice";


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
        .matches(/^[0-9+()-]{8,15}$/, "Invalid phone number")
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
      navigate("/user/user-profile");

    },
  });

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

  const handleCancel = () => navigate("/user/profile");

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
    <div className="container" style={{ padding: "2rem 0" }}>
      <div className="profile-header">
        <div>
          <h1 className="section-title mb-1">Edit Profile</h1>
          <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
            Update your personal and company information
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="profile-form shadow-sm">

        {/* Profile Photo */}
        <div className="form-section">
          <h3 className="section-title">Profile Photo</h3>
          <div className="logo-upload-container">
            <label className="logo-upload-label">
              <div className="logo-preview-wrapper">
                {logoPreview ? (
                  <>
                    <img src={logoPreview} alt="Preview" className="logo-preview" />
                    <button
                      type="button"
                      className="logo-remove-btn"
                      onClick={removeLogo}
                    >
                      Remove Photo
                    </button>
                  </>
                ) : (
                  <div className="logo-placeholder">
                    <FiImage className="logo-placeholder-icon" />
                    <p>Click anywhere to upload</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="logo-input"
              />
            </label>
          </div>
        </div>

        {/* Personal Information */}
        <div className="form-section">
          <h3 className="section-title">Personal Information</h3>
          <div className="input-grid-2">
            <div className="auth-group">
              <label className="auth-label">Full Name<span style={{ color: '#ef4444' }}> *</span></label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={formik.handleBlur}
                className="auth-input text-muted"
                disabled
              />

              <FormError
                error={formik.errors.name}
                touched={formik.touched.name}
              />
            </div>
            <div className="auth-group">
              <label className="auth-label">Company Name<span style={{ color: '#ef4444' }}> *</span></label>
              <input
                type="text"
                name="companyname"
                value={formData.companyname}
                onChange={handleChange}
                onBlur={formik.handleBlur}
                className="auth-input text-muted"
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
        <div className="form-section">
          <div className="auth-group">
            <label className="auth-label">Description<span style={{ color: '#ef4444' }}> *</span></label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              onBlur={formik.handleBlur}
              className="auth-input resize-vertical"
            />

            <FormError
              error={formik.errors.description}
              touched={formik.touched.description}
            />
            <small style={{ float: "right", color: "#64748b" }}>
              {formData.description.length}/500
            </small>
          </div>
        </div>

        {/* Work Experience */}
        <div className="form-section">
          <h3 className="section-title">Work Experience</h3>

          {formData.workExperience.map((exp, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
                padding: "16px",
                marginBottom: "12px",
              }}
            >
              <div className="input-grid-2">
                <div className="auth-group">
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

                <div className="auth-group">
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

              <div className="input-grid-3 mt-2">
                <div className="auth-group">
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

                <div className="auth-group">
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

                <div className="auth-group" style={{ alignSelf: "end" }}>
                  <label className="auth-label">
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
                    />{" "}
                    Present
                  </label>
                </div>
              </div>

              {formData.workExperience.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="btn-secondary mt-2"
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addExperience}
            className="btn-secondary"
          >
            + Add Experience
          </button>

          <div
            style={{
              marginTop: "16px",
              display: "flex",
              justifyContent: "space-between",
              fontWeight: 600,
            }}
          >
            <span style={{ color: "#64748b" }}>Total Experience:</span>
            <span>{totalExperience} Years</span>
          </div>
        </div>


        {/* Address */}
        <div className="form-section">
          <h3 className="section-title">Address</h3>
          <div className="input-grid-2">
            <div className="auth-group">
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

            <div className="auth-group">
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
          <div className="input-grid-4">
            <div className="auth-group">
              <label className="auth-label">City<span style={{ color: '#ef4444' }}> *</span></label>
              <input
                className="auth-input"
                name="headquarters.city"
                value={formData.headquarters.city}
                onChange={handleChange}
                placeholder="City"
              />
            </div>

            <div className="auth-group">
              <label className="auth-label">State<span style={{ color: '#ef4444' }}> *</span></label>
              <input
                className="auth-input"
                name="headquarters.state"
                value={formData.headquarters.state}
                onChange={handleChange}
                placeholder="State"
              />
            </div>

            <div className="auth-group">
              <label className="auth-label">Postal Code<span style={{ color: '#ef4444' }}> *</span></label>
              <input
                className="auth-input"
                name="headquarters.postalCode"
                value={formData.headquarters.postalCode}
                onChange={handleChange}
                placeholder="Postal Code"
              />
            </div>

            <div className="auth-group">
              <label className="auth-label">Country<span style={{ color: '#ef4444' }}> *</span></label>
              <select
                className="auth-input"
                name="headquarters.country"
                value={formData.headquarters.country}
                onChange={handleChange}
              >
                <option value="">Select country</option>
                <option value="IN">India</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="form-section">
          <h3 className="section-title">Contact Information</h3>
          <div className="input-grid-3">
            <div className="auth-group">
              <label className="auth-label">Email<span style={{ color: '#ef4444' }}> *</span></label>
              <input
                className="auth-input text-muted"
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

            <div className="auth-group">
              <label className="auth-label">Phone<span style={{ color: '#ef4444' }}> *</span></label>
              <input
                className="auth-input"
                name="contact.phone"
                value={formData.contact.phone}
                onChange={handleChange}
                placeholder="Phone"
              />
            </div>

            <div className="auth-group">
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

        {/* Additional Information */}
        <div className="form-section">
          <h3 className="section-title">Additional Information</h3>
          <div className="input-grid-2">
            <div className="auth-group">
              <label className="auth-label">Job Title<span style={{ color: '#ef4444' }}> *</span></label>
              <input
                className="auth-input"
                name="additionalInfo.jobTitle"
                value={formData.additionalInfo.jobTitle}
                onChange={handleChange}
                placeholder="Job Title"
              />
            </div>

            <div className="auth-group">
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

          <div className="input-grid-2 mt-3">
            <div className="auth-group">
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

            <div className="auth-group">
              <label className="auth-label">Referred By *</label>
              <input
  className="auth-input text-muted"
  name="additionalInfo.referredBy"
  value={formData.additionalInfo.referredBy}
  disabled
  placeholder="Referred By"
/>
            </div>
          </div>

          {/* Languages */}
          <div className="auth-group mt-3">
            <label className="auth-label">Languages Spoken *</label>

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
            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
                marginTop: "8px",
              }}
            >
              {formData.additionalInfo.languages.map((lang) => (
                <span
                  key={lang}
                  style={{
                    background: "#e0f2fe",
                    color: "#0284c7",
                    padding: "4px 10px",
                    borderRadius: "999px",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    formik.setFieldValue(
                      "additionalInfo.languages",
                      formData.additionalInfo.languages.filter((l) => l !== lang)
                    )
                  }
                >
                  {lang} ✕
                </span>
              ))}
            </div>

            {/* Validation error */}
            {formik.touched.additionalInfo?.languages &&
              formik.errors.additionalInfo?.languages && (
                <small style={{ color: "red" }}>
                  {formik.errors.additionalInfo.languages}
                </small>
              )}
              <p style={{ color: "#6b7280", fontSize: "12px" }}>Note: you can select multiple languages</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button type="button" onClick={handleCancel} className="btn-secondary">
            <FiX /> Cancel
          </button>
          <button
            type="submit"
            className="btn-primary d-flex gap-1"
            disabled={isSaving || !formik.isValid}
          >
            <FiSave />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>

        </div>
      </form>
    </div>
  );
}

export default EditProfile;
