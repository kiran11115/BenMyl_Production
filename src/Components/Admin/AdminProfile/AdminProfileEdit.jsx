import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiX, FiSave, FiImage } from "react-icons/fi";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./AdminProfileEdit.css";

// CHANGE THIS TO YOUR API IMPORT
import { useGetCompanyProfileEditQuery, useUpdateCompanyProfileMutation } from "../../../State-Management/Api/CompanyProfileApiSlice";

const AdminProfileEdit = () => {
  const navigate = useNavigate();
  const [updateCompanyProfile, { isLoading }] = useUpdateCompanyProfileMutation();
  const companyid = localStorage.getItem("logincompanyid");
  const emailId = localStorage.getItem("Email");
  const { data: companyData, isLoading: isFetching } =
  useGetCompanyProfileEditQuery(emailId, {
    skip: !emailId,
  });

  // Logo preview
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  // Formik initial values using Swagger names
  const formik = useFormik({
    initialValues: {
      companyname: "",
      companyid:companyid,
      Tagline: "",
      Industry: "",
      CompanySize: "",
      FoundedYear: "",
      Description: "",
      WebsiteURL: "",
      Domain: "",
      StreetAddress1: "",
      StreetAddress2: "",
      City: "",
      State: "",
      PostalCode: "",
      Country: "",
      Emailid: "",
      Phone: "",
      LinkedInURL: "",
    },

    validationSchema: Yup.object({
      companyname: Yup.string().required("Company Name is required"),
      Industry: Yup.string().required("Industry is required"),
      Emailid: Yup.string().email("Invalid email").required("Email is required"),
      FoundedYear: Yup.number()
        .min(1900, "Invalid year")
        .max(new Date().getFullYear(), "Invalid year")
        .nullable(),
    }),

    onSubmit: async (values) => {
      try {
        const formData = new FormData();

           // IMPORTANT: overwrite companyid to ensure correct storage
    formData.append("companyid", companyid);

        // Append text fields
        Object.keys(values).forEach((key) => {
          formData.append(key, values[key] || "");
        });

        // Swagger rules: companylogo null, companyimages = uploaded
        if (logoFile instanceof File) {
      formData.append("companyimages", logoFile);
    }

        await updateCompanyProfile(formData).unwrap();

        navigate("/admin/admin-profile");
      } catch (err) {
        console.error("Update failed", err);
      }
    },
  });

  useEffect(() => {
  if (!companyData) return;

  formik.setValues({
    companyname: companyData.companyname || "",
    companyid: companyData.companyid || companyid,

    Tagline: companyData.tagline || "",
    Industry: companyData.industry || "",
    CompanySize: companyData.companySize || "",
    FoundedYear: companyData.foundedYear || "",
    Description: companyData.description || "",

    WebsiteURL: companyData.websiteURL || "",
    Domain: companyData.domain || "",

    StreetAddress1: companyData.streetAddress1 || "",
    StreetAddress2: companyData.streetAddress2 || "",
    City: companyData.city || "",
    State: companyData.state || "",
    PostalCode: companyData.postalCode || "",
    Country: companyData.country || "",

    Emailid: companyData.emailid || "",
    Phone: companyData.phone || "",
    LinkedInURL: companyData.linkedinURL || "",
  });

  // ✅ Logo preview from backend
  if (companyData.companylogo) {
    setLogoPreview(companyData.companylogo);
  }
}, [companyData]);


  // Logo handler
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

  const handleCancel = () => {
    removeLogo();
    formik.resetForm();
    navigate("/admin/admin-profile");
  };

  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
    };
  }, [logoPreview]);

  const styleProf = `
.logo-upload-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 2px dashed #e2e8f0;
}
.logo-preview-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
.logo-preview {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 12px;
  border: 3px solid #e2e8f0;
}
.logo-placeholder {
  width: 120px;
  height: 120px;
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.logo-input {
  display: none;
}
.logo-remove-btn {
  background: #ef4444;
  color: #fff;
  padding: .5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
}
`;

  return (
    <>
      <style>{styleProf}</style>

      <div className="container" style={{ padding: "2rem 0px" }}>
        <div className="profile-header">
          <h1 className="section-title" style={{ fontSize: "24px", marginBottom: "8px" }}>
            Edit Admin Profile
          </h1>
          <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
            Update your company information and branding.
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="profile-form shadow-sm">
          {/* Logo Upload */}
          <div className="form-section">
            <h3 className="section-title">Company Logo</h3>

            <div className="logo-upload-container">
              <label className="logo-upload-label">
                <div className="logo-preview-wrapper">
                  {logoPreview ? (
                    <>
                      <img src={logoPreview} className="logo-preview" alt="" />
                      <button type="button" className="logo-remove-btn" onClick={removeLogo}>
                        Remove Logo
                      </button>
                    </>
                  ) : (
                    <div className="logo-placeholder">
                      <FiImage style={{ fontSize: "2rem", color: "#94a3b8" }} />
                      <p>Click anywhere to upload</p>
                    </div>
                  )}
                </div>

                <input type="file" accept="image/*" onChange={handleLogoUpload} className="logo-input" />
              </label>
            </div>
          </div>

          {/* Company Info */}
          <div className="form-section">
            <h3 className="section-title">Company Information</h3>
            <div className="input-grid-3">
              <div className="auth-group">
                <label className="auth-label">Company Name *</label>
                <input
                  type="text"
                  name="companyname"
                  value={formik.values.companyname}
                  onChange={formik.handleChange}
                  className="auth-input"
                  placeholder="Enter company name"
                />
              </div>

              <div className="auth-group">
                <label className="auth-label">Tagline</label>
                <input
                  type="text"
                  name="Tagline"
                  value={formik.values.Tagline}
                  onChange={formik.handleChange}
                  className="auth-input"
                  placeholder="Short description"
                />
              </div>

              <div className="auth-group">
                <label className="auth-label">Industry *</label>
                <input
                  type="text"
                  name="Industry"
                  value={formik.values.Industry}
                  onChange={formik.handleChange}
                  className="auth-input"
                  placeholder="e.g., Staffing & Recruiting"
                />
              </div>
            </div>

            <div className="input-grid-2">
              <div className="auth-group">
                <label className="auth-label">Company Size</label>
                <select
                  name="CompanySize"
                  value={formik.values.CompanySize}
                  onChange={formik.handleChange}
                  className="auth-input"
                >
                  <option value="">Select size</option>
                  <option value="1-10 employees">1-10 employees</option>
                  <option value="11-50 employees">11-50 employees</option>
                  <option value="51-200 employees">51-200 employees</option>
                  <option value="201-500 employees">201-500 employees</option>
                  <option value="500+ employees">500+ employees</option>
                </select>
              </div>

              <div className="auth-group">
                <label className="auth-label">Founded Year</label>
                <input
                  type="number"
                  name="FoundedYear"
                  value={formik.values.FoundedYear}
                  onChange={formik.handleChange}
                  className="auth-input"
                  placeholder="2020"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="form-section">
            <div className="auth-group">
              <label className="auth-label">Description</label>
              <textarea
                name="Description"
                rows="4"
                value={formik.values.Description}
                onChange={formik.handleChange}
                className="auth-input resize-vertical"
                placeholder="Describe your company..."
                maxLength={500}
              />
            </div>
          </div>

          {/* Online Presence */}
          <div className="form-section">
            <h3 className="section-title">Online Presence</h3>
            <div className="input-grid-2">
              <div className="auth-group">
                <label className="auth-label">Website URL</label>
                <input
                  type="url"
                  name="WebsiteURL"
                  value={formik.values.WebsiteURL}
                  onChange={formik.handleChange}
                  className="auth-input"
                  placeholder="https://company.com"
                />
              </div>

              <div className="auth-group">
                <label className="auth-label">Domain</label>
                <input
                  type="text"
                  name="Domain"
                  value={formik.values.Domain}
                  onChange={formik.handleChange}
                  className="auth-input"
                  placeholder="company.com"
                />
              </div>
            </div>
          </div>

          {/* Headquarters */}
          <div className="form-section">
            <h3 className="section-title">Headquarters</h3>

            <div className="input-grid-2">
              <div className="auth-group">
                <label className="auth-label">Street Address 1</label>
                <input
                  type="text"
                  name="StreetAddress1"
                  value={formik.values.StreetAddress1}
                  onChange={formik.handleChange}
                  className="auth-input"
                  placeholder="123 Main St"
                />
              </div>

              <div className="auth-group">
                <label className="auth-label">Street Address 2</label>
                <input
                  type="text"
                  name="StreetAddress2"
                  value={formik.values.StreetAddress2}
                  onChange={formik.handleChange}
                  className="auth-input"
                  placeholder="Suite 500"
                />
              </div>
            </div>

            <div className="input-grid-4">
              <div className="auth-group">
                <label className="auth-label">City</label>
                <input
                  type="text"
                  name="City"
                  value={formik.values.City}
                  onChange={formik.handleChange}
                  className="auth-input"
                  placeholder="Visakhapatnam"
                />
              </div>

              <div className="auth-group">
                <label className="auth-label">State</label>
                <input
                  type="text"
                  name="State"
                  value={formik.values.State}
                  onChange={formik.handleChange}
                  className="auth-input"
                  placeholder="Andhra Pradesh"
                />
              </div>

              <div className="auth-group">
                <label className="auth-label">Postal Code</label>
                <input
                  type="text"
                  name="PostalCode"
                  value={formik.values.PostalCode}
                  onChange={formik.handleChange}
                  className="auth-input"
                  placeholder="530016"
                />
              </div>

              <div className="auth-group">
                <label className="auth-label">Country</label>
                <select
                  name="Country"
                  value={formik.values.Country}
                  onChange={formik.handleChange}
                  className="auth-input"
                >
                  <option value="">Select country</option>
                  <option value="IN">India</option>
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                  <option value="CA">Canada</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="form-section">
            <h3 className="section-title">Contact Information</h3>

            <div className="input-grid-3">
              <div className="auth-group">
                <label className="auth-label">Email *</label>
                <input
                  type="email"
                  name="Emailid"
                  value={formik.values.Emailid}
                  onChange={formik.handleChange}
                  className="auth-input"
                  placeholder="hello@company.com"
                />
              </div>

              <div className="auth-group">
                <label className="auth-label">Phone</label>
                <input
                  type="tel"
                  name="Phone"
                  value={formik.values.Phone}
                  onChange={formik.handleChange}
                  className="auth-input"
                  placeholder="+91 891 234 5678"
                />
              </div>

              <div className="auth-group">
                <label className="auth-label">LinkedIn URL</label>
                <input
                  type="url"
                  name="LinkedInURL"
                  value={formik.values.LinkedInURL}
                  onChange={formik.handleChange}
                  className="auth-input"
                  placeholder="https://linkedin.com/company/..."
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="btn-secondary">
              <FiX /> Cancel
            </button>

            <button type="submit" disabled={isLoading} className="btn-primary gap-2">
              <FiSave /> {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AdminProfileEdit;
