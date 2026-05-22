import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiX, FiSave, FiImage, FiBriefcase, FiGlobe, FiMapPin, FiMail, FiArrowLeft } from "react-icons/fi";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./AdminProfileEdit.css";
import { useGetCompanyProfileEditQuery, useUpdateCompanyProfileMutation } from "../../../State-Management/Api/CompanyProfileApiSlice";
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

const AdminProfileEdit = () => {
  const navigate = useNavigate();
  const [updateCompanyProfile, { isLoading }] = useUpdateCompanyProfileMutation();
  const companyid = localStorage.getItem("logincompanyid");
  const emailId = localStorage.getItem("Email");
  
  const { data: companyData, refetch } = useGetCompanyProfileEditQuery(emailId, {
    refetchOnMountOrArgChange: true,
  });

  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  const formik = useFormik({
    initialValues: {
      companyname: "",
      companyid: companyid,
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
        formData.append("companyid", companyid);
        Object.keys(values).forEach((key) => {
          formData.append(key, values[key] || "");
        });
        if (logoFile instanceof File) {
          formData.append("companyimages", logoFile);
        }
        await updateCompanyProfile(formData).unwrap();
        refetch(); // Ensure data is updated before navigation
        navigate("/Admin/admin-profile");
      } catch (err) {
        console.error("Update failed", err);
      }
    },
  });

  const countryCode = countryIsoMap[formik.values.Country] || formik.values.Country || "US";
  const states = State.getStatesOfCountry(countryCode);

  const stateObj = states.find(
    (s) =>
      s.name.toLowerCase() === formik.values.State?.toLowerCase() ||
      s.isoCode.toLowerCase() === formik.values.State?.toLowerCase()
  );
  const selectedStateValue = stateObj ? stateObj.isoCode : "";

  const cities = selectedStateValue
    ? City.getCitiesOfState(countryCode, selectedStateValue)
    : [];

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    formik.setFieldValue("Country", selectedCountry);
    formik.setFieldValue("State", "");
    formik.setFieldValue("City", "");
  };

  const handleStateChange = (e) => {
    const stateIsoCode = e.target.value;
    const selectedStateObj = states.find((s) => s.isoCode === stateIsoCode);
    const stateName = selectedStateObj ? selectedStateObj.name : "";
    formik.setFieldValue("State", stateName);
    formik.setFieldValue("City", "");
  };

  const handleCityChange = (e) => {
    const cityName = e.target.value;
    formik.setFieldValue("City", cityName);
  };

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
    if (companyData?.companylogo) {
      setLogoPreview(`${companyData.companylogo}?t=${Date.now()}`);
    }
  }, [companyData]);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Invalid file type");
      return;
    }
    setLogoFile(file);
    const previewUrl = URL.createObjectURL(file);
    if (logoPreview && !logoPreview.startsWith("http")) URL.revokeObjectURL(logoPreview);
    setLogoPreview(previewUrl);
  };

  const removeLogo = (e) => {
    e.stopPropagation();
    setLogoFile(null);
    if (logoPreview && !logoPreview.startsWith("http")) URL.revokeObjectURL(logoPreview);
    setLogoPreview(null);
  };

  const handleCancel = () => {
    navigate("/Admin/admin-profile");
  };

  return (
    <div className="admin-edit-container">
      <div className="edit-header-box">
        <div className="edit-title-group">
          <button className="link-button mb-3 d-flex align-items-center gap-2" onClick={handleCancel}>
            <FiArrowLeft /> Back to Profile
          </button>
          <h1>Edit Organization Profile</h1>
          <p>Update your company identity and contact information</p>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit} className="profile-form-premium">
        {/* --- SECTION 1: IDENTITY & BRANDING --- */}
        <div className="form-section-premium">
          <h2 className="section-label-premium">
            <FiBriefcase /> Identity & Branding
          </h2>
          
          <div className="auth-group mb-4">
            <label className="auth-label">Company Logo</label>
            <div className="logo-upload-zone" onClick={() => document.getElementById('logo-input').click()}>
              <div className="logo-preview-box">
                {logoPreview ? (
                  <>
                    <img src={logoPreview} className="logo-circle-lg" alt="Preview" />
                    <button type="button" className="logo-remove-pill" onClick={removeLogo}>
                      <FiX />
                    </button>
                  </>
                ) : (
                  <div className="logo-circle-lg d-flex align-items-center justify-content-center bg-light">
                    <FiImage className="upload-icon-lg" />
                  </div>
                )}
              </div>
              <div className="upload-placeholder-premium text-center">
                <span className="fw-bold text-primary">Click to upload logo</span>
                <span className="text-muted small">PNG, JPG or SVG (Max 5MB)</span>
              </div>
              <input 
                id="logo-input"
                type="file" 
                accept="image/*" 
                onChange={handleLogoUpload} 
                className="d-none" 
              />
            </div>
          </div>

          <div className="input-grid-premium grid-3-col">
            <div className="auth-group">
              <label className="auth-label">Company Name <span className="text-danger">*</span></label>
              <input
                type="text"
                name="companyname"
                {...formik.getFieldProps("companyname")}
                className={`auth-input ${formik.touched.companyname && formik.errors.companyname ? "border-danger" : ""}`}
                placeholder="BenMyl Inc."
              />
            </div>
            <div className="auth-group">
              <label className="auth-label">Tagline</label>
              <input
                type="text"
                name="Tagline"
                {...formik.getFieldProps("Tagline")}
                className="auth-input"
                placeholder="Innovative Bench Sales"
              />
            </div>
            <div className="auth-group">
              <label className="auth-label">Industry <span className="text-danger">*</span></label>
              <input
                type="text"
                name="Industry"
                {...formik.getFieldProps("Industry")}
                className="auth-input"
                placeholder="Staffing & Recruiting"
              />
            </div>
          </div>

          <div className="input-grid-premium grid-2-col mt-3">
            <div className="auth-group">
              <label className="auth-label">Company Size</label>
              <select name="CompanySize" {...formik.getFieldProps("CompanySize")} className="auth-select">
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
                {...formik.getFieldProps("FoundedYear")}
                className="auth-input"
                placeholder="2020"
              />
            </div>
          </div>

          <div className="auth-group mt-3">
            <label className="auth-label">Short Description</label>
            <textarea
              name="Description"
              rows="4"
              {...formik.getFieldProps("Description")}
              className="auth-input"
              placeholder="Tell us about your organization..."
              style={{ resize: "vertical" }}
            />
          </div>
        </div>

        {/* --- SECTION 2: WEB & SOCIAL --- */}
        <div className="form-section-premium">
          <h2 className="section-label-premium">
            <FiGlobe /> Web & Social Presence
          </h2>
          <div className="input-grid-premium grid-3-col">
            <div className="auth-group">
              <label className="auth-label">Website URL</label>
              <input
                type="url"
                name="WebsiteURL"
                {...formik.getFieldProps("WebsiteURL")}
                className="auth-input"
                placeholder="https://company.com"
              />
            </div>
            <div className="auth-group">
              <label className="auth-label">Domain</label>
              <input
                type="text"
                name="Domain"
                {...formik.getFieldProps("Domain")}
                className="auth-input"
                placeholder="company.com"
              />
            </div>
            <div className="auth-group">
              <label className="auth-label">LinkedIn Page</label>
              <input
                type="url"
                name="LinkedInURL"
                {...formik.getFieldProps("LinkedInURL")}
                className="auth-input"
                placeholder="https://linkedin.com/company/..."
              />
            </div>
          </div>
        </div>

        {/* --- SECTION 3: LOCATION & HEADQUARTERS --- */}
        <div className="form-section-premium">
          <h2 className="section-label-premium">
            <FiMapPin /> Location & Headquarters
          </h2>
          <div className="input-grid-premium grid-2-col">
            <div className="auth-group">
              <label className="auth-label">Street Address 1</label>
              <input
                type="text"
                name="StreetAddress1"
                {...formik.getFieldProps("StreetAddress1")}
                className="auth-input"
              />
            </div>
            <div className="auth-group">
              <label className="auth-label">Street Address 2</label>
              <input
                type="text"
                name="StreetAddress2"
                {...formik.getFieldProps("StreetAddress2")}
                className="auth-input"
              />
            </div>
          </div>
          <div className="input-grid-premium grid-4-col" style={{gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))"}}>
            <div className="auth-group">
              <label className="auth-label">Country</label>
              <select
                name="Country"
                value={formik.values.Country}
                onChange={handleCountryChange}
                onBlur={formik.handleBlur}
                className="auth-select"
              >
                <option value="">Select country</option>
                <option value="IN">India</option>
                <option value="US">United States</option>
                <option value="GB">United Kingdom</option>
                <option value="CA">Canada</option>
                <option value="AE">UAE</option>
              </select>
            </div>
            <div className="auth-group">
              <label className="auth-label">State</label>
              {states.length > 0 ? (
                <select
                  name="State"
                  value={selectedStateValue}
                  onChange={handleStateChange}
                  onBlur={formik.handleBlur}
                  className="auth-select"
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
                  type="text"
                  name="State"
                  value={formik.values.State}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="auth-input"
                  placeholder="Enter State"
                />
              )}
            </div>
            <div className="auth-group">
              <label className="auth-label">City</label>
              {selectedStateValue && cities.length > 0 ? (
                <select
                  name="City"
                  value={formik.values.City}
                  onChange={handleCityChange}
                  onBlur={formik.handleBlur}
                  className="auth-select"
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
                  type="text"
                  name="City"
                  value={formik.values.City}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="auth-input"
                  placeholder="Enter City"
                  disabled={!formik.values.State}
                />
              )}
            </div>
            <div className="auth-group">
              <label className="auth-label">Postal Code</label>
              <input type="text" name="PostalCode" {...formik.getFieldProps("PostalCode")} className="auth-input" />
            </div>
          </div>
        </div>

        {/* --- SECTION 4: CONTACT INFORMATION --- */}
        <div className="form-section-premium">
          <h2 className="section-label-premium">
            <FiMail /> Primary Contact
          </h2>
          <div className="input-grid-premium grid-2-col">
            <div className="auth-group">
              <label className="auth-label">Official Email <span className="text-danger">*</span></label>
              <input
                type="email"
                name="Emailid"
                {...formik.getFieldProps("Emailid")}
                className="auth-input"
                placeholder="admin@company.com"
              />
            </div>
            <div className="auth-group">
              <label className="auth-label">Contact Phone</label>
              <input
                type="tel"
                name="Phone"
                {...formik.getFieldProps("Phone")}
                className="auth-input"
                placeholder="+1 234 567 890"
              />
            </div>
          </div>
        </div>

        <div className="edit-form-actions">
          <button type="button" className="action-btn-premium action-btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="action-btn-premium action-btn-primary" disabled={isLoading}>
            <FiSave /> {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProfileEdit;

