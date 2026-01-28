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
  const [updateRecruiterProfile] = useUpdateRecruiterProfileMutation();
  /* ================= LOGO ================= */
  const [logoPreview, setLogoPreview] = useState(null);

  const userId = localStorage.getItem("CompanyId"); // stores authInfoID = 315

  const {
    data: recruiterData,
    isLoading,
    isError,
  } = useGetRecruiterProfileQuery(Number(userId), {
    skip: !userId,
  });




  /* ================= VALIDATION ================= */
  const validationSchema = Yup.object({
    name: Yup.string().required(),
    companyname: Yup.string().required(),
    description: Yup.string().required().max(500),

    headquarters: Yup.object({
      street1: Yup.string().required(),
      street2: Yup.string(),
      city: Yup.string().required(),
      state: Yup.string().required(),
      postalCode: Yup.string().required(),
      country: Yup.string().required(),
    }),

    contact: Yup.object({
      email: Yup.string().email().required(),
      phone: Yup.string().required(),
      linkedinUrl: Yup.string().url(),
    }),

    workExperience: Yup.array().of(
      Yup.object({
        role: Yup.string().required(),
        company: Yup.string().required(),
        startYear: Yup.number().required(),
        endYear: Yup.number().nullable(),
        isCurrent: Yup.boolean(),
      })
    ),

    additionalInfo: Yup.object({
      jobTitle: Yup.string().required(),
      experience: Yup.string().required(),
      education: Yup.string().required(),
      languages: Yup.array().min(1),
      referredBy: Yup.string(),
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
        referredBy: "",
      },

      ProfilePhotos: null,
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

      if (values.ProfilePhotos) {
        fd.append("ProfilePhotos", values.ProfilePhotos);
      }

      await updateRecruiterProfile(fd).unwrap();
      navigate("/user/user-profile");
    },
  });

  useEffect(() => {
    if (!recruiterData) return;

    // ✅ SET IMAGE PREVIEW FROM API
    if (recruiterData.profilePhoto) {
      setLogoPreview(recruiterData.profilePhoto);
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
        referredBy: recruiterData.referedBy || "",
      },

      ProfilePhotos: null,
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
    formik.setFieldValue("ProfilePhotos", file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const removeLogo = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLogoPreview(null);
    formik.setFieldValue("ProfilePhotos", null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    formik.handleSubmit();
  };

  const handleCancel = () => navigate("/user/profile");

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
              <label className="auth-label">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="auth-input"
              />
            </div>
            <div className="auth-group">
              <label className="auth-label">Company Name *</label>
              <input
                type="text"
                name="companyname"
                value={formData.companyname}
                onChange={handleChange}
                className="auth-input"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="form-section">
          <div className="auth-group">
            <label className="auth-label">Description *</label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="auth-input resize-vertical"
              maxLength={500}
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
                  <label className="auth-label">Role *</label>
                  <input
                    type="text"
                    className="auth-input"
                    value={exp.role}
                    onChange={(e) =>
                      handleExperienceChange(index, "role", e.target.value)
                    }
                    placeholder="Recruiter"
                  />
                </div>

                <div className="auth-group">
                  <label className="auth-label">Company *</label>
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
                  <label className="auth-label">Start Year *</label>
                  <input
                    type="number"
                    className="auth-input"
                    value={exp.startYear}
                    onChange={(e) =>
                      handleExperienceChange(index, "startYear", e.target.value)
                    }
                    placeholder="2019"
                  />
                </div>

                <div className="auth-group">
                  <label className="auth-label">End Year</label>
                  <input
                    type="number"
                    className="auth-input"
                    value={exp.endYear}
                    disabled={exp.isCurrent}
                    onChange={(e) =>
                      handleExperienceChange(index, "endYear", e.target.value)
                    }
                    placeholder="2023"
                  />
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
              <label className="auth-label">Street Address 1 *</label>
              <input
                className="auth-input"
                name="headquarters.street1"
                value={formData.headquarters.street1}
                onChange={handleChange}
                placeholder="Street Address 1"
              />
            </div>

            <div className="auth-group">
              <label className="auth-label">Street Address 2 *</label>
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
              <label className="auth-label">City *</label>
              <input
                className="auth-input"
                name="headquarters.city"
                value={formData.headquarters.city}
                onChange={handleChange}
                placeholder="City"
              />
            </div>

            <div className="auth-group">
              <label className="auth-label">State *</label>
              <input
                className="auth-input"
                name="headquarters.state"
                value={formData.headquarters.state}
                onChange={handleChange}
                placeholder="State"
              />
            </div>

            <div className="auth-group">
              <label className="auth-label">Postal Code *</label>
              <input
                className="auth-input"
                name="headquarters.postalCode"
                value={formData.headquarters.postalCode}
                onChange={handleChange}
                placeholder="Postal Code"
              />
            </div>

            <div className="auth-group">
              <label className="auth-label">Country *</label>
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
              <label className="auth-label">Email *</label>
              <input
                className="auth-input"
                name="contact.email"
                value={formData.contact.email}
                onChange={handleChange}
                placeholder="Email"
              />
            </div>

            <div className="auth-group">
              <label className="auth-label">Phone *</label>
              <input
                className="auth-input"
                name="contact.phone"
                value={formData.contact.phone}
                onChange={handleChange}
                placeholder="Phone"
              />
            </div>

            <div className="auth-group">
              <label className="auth-label">Linkedin Url *</label>
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
              <label className="auth-label">Job Title *</label>
              <input
                className="auth-input"
                name="additionalInfo.jobTitle"
                value={formData.additionalInfo.jobTitle}
                onChange={handleChange}
                placeholder="Job Title"
              />
            </div>

            <div className="auth-group">
              <label className="auth-label">Experience *</label>
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
              <label className="auth-label">Education *</label>
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
                className="auth-input"
                name="additionalInfo.referredBy"
                value={formData.additionalInfo.referredBy}
                onChange={handleChange}
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
          </div>
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button type="button" onClick={handleCancel} className="btn-secondary">
            <FiX /> Cancel
          </button>
          <button type="submit" className="btn-primary">
            <FiSave /> Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;
