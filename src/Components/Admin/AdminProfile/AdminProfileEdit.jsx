import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiX, FiSave, FiImage, FiBriefcase, FiGlobe, FiMapPin, FiMail, FiArrowLeft, FiZap } from "react-icons/fi";
import { CustomAlert } from "../../Common/CustomAlert";

import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
// Use the shared layout CSS
import "../../PostNewPositions/PostNewPositions.css";
// Kept some local styles if they are needed, though we will map classes to premium-card
import "./AdminProfileEdit.css"; 
import { useGetCompanyProfileEditQuery, useUpdateCompanyProfileMutation } from "../../../State-Management/Api/CompanyProfileApiSlice";
import { State, City } from "country-state-city";
import ProfilePreviewPanel from "./ProfilePreviewPanel";

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
  const [customAlert, setCustomAlert] = useState(null);

  
  const { data: companyData, refetch } = useGetCompanyProfileEditQuery(emailId, {
    refetchOnMountOrArgChange: true,
  });

  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

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
        navigate("/Admin/overview-dashboard", { state: { openProfileModal: true } });
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
      setCustomAlert({
        title: "Invalid File Type",
        message: "Please upload a valid image file (PNG, JPG, or SVG) for the company logo.",
        type: "error"
      });
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

  const handleGenerateDescription = async () => {
    const generationsUsed = parseInt(localStorage.getItem("desc_generations_count") || "0");
    
    if (generationsUsed >= 2) {
      toast.info("You have used your 2 free AI generations. Please subscribe for more!", {
        icon: "👑"
      });
      return;
    }

    const { companyname, Industry } = formik.values;
    if (!companyname || !Industry) {
      toast.warning("Please enter Company Name and Industry first.");
      return;
    }

    setIsGenerating(true);
    // Simulate AI generation delay
    setTimeout(() => {
      const generatedText = `${companyname} is a forward-thinking organization operating in the ${Industry} sector. We specialize in delivering innovative solutions tailored to modern business needs. Our dedicated team is committed to excellence, leveraging cutting-edge technology to drive growth and create lasting value for our clients and partners.`;
      
      formik.setFieldValue("Description", generatedText);
      localStorage.setItem("desc_generations_count", (generationsUsed + 1).toString());
      setIsGenerating(false);
      toast.success("Description generated successfully!");
    }, 1500);
  };

  const handleCancel = () => {
    navigate("/Admin/overview-dashboard");
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit} className="ai-dashboard-wrapper">
        {/* HEADER CARD matching user-post-new-positions / EditProfile.jsx */}
        <div className="hero-card mb-4">
          <div className="hero-left">
            <div className="hero-pill">
              ✦ Edit Profile
            </div>
            <h1 className="job-posting-title text-white">Profile Control Board</h1>
            <div className="job-posting-header-info">
              <p className="job-posting-subtitle">
                Update your company identity and contact information
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
            
            {/* --- SECTION 1: IDENTITY & BRANDING --- */}
            <div className="premium-card" style={{ padding: '16px' }}>
              <h2 className="font-display mb-1" style={{ fontSize: "16px", fontWeight: 700, color: "#1F2937", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "8px" }}>
                <FiBriefcase /> Identity & Branding
              </h2>
              <p className="muted small mb-4" style={{ fontSize: "12px", color: "#6B7280" }}>
                Fields indicated with a red asterisk (<span style={{ color: '#ef4444' }}>*</span>) are mandatory values.
              </p>
              
              <div className="auth-group mb-4">
                <span className="status-tag status-progress font-mono mb-3 d-inline-block" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', background: '#eef2f6', color: '#5B5BD6', padding: '4px 10px', borderRadius: '6px', fontWeight: 'bold' }}>Company Logo</span>
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

              <div className="grid-3">
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

              <div className="grid-2 mt-3">
                <div className="auth-group">
                  <label className="auth-label">Company Size</label>
                  <select name="CompanySize" {...formik.getFieldProps("CompanySize")} className="auth-input">
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label className="auth-label" style={{ margin: 0 }}>Short Description</label>
                  <button 
                  className="ai-generate-btn"
                    type="button" 
                    onClick={handleGenerateDescription}
                    disabled={isGenerating}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                      <path d="M12 3L14.5 9.5L21 12L14.5 14.5L12 21L9.5 14.5L3 12L9.5 9.5L12 3Z" />
                    </svg>{isGenerating ? 'Generating...' : 'AI Generate'}
                  </button>
                </div>
                <textarea
                  name="Description"
                  rows="8"
                  {...formik.getFieldProps("Description")}
                  className="auth-input"
                  placeholder="Tell us about your organization..."
                  style={{ resize: "vertical", minHeight: "150px" }}
                />
              </div>
            </div>

            {/* --- SECTION 2: WEB & SOCIAL --- */}
            <div className="premium-card" style={{ padding: '16px' }}>
              <h2 className="font-display mb-1" style={{ fontSize: "16px", fontWeight: 700, color: "#1F2937", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "8px" }}>
                <FiGlobe /> Web & Social Presence
              </h2>
              <div className="grid-3 mt-4">
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
            <div className="premium-card" style={{ padding: '16px' }}>
              <h2 className="font-display mb-1" style={{ fontSize: "16px", fontWeight: 700, color: "#1F2937", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "8px" }}>
                <FiMapPin /> Location & Headquarters
              </h2>
              <div className="grid-2 mt-4">
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
              <div className="grid-4 mt-3">
                <div className="auth-group">
                  <label className="auth-label">Country</label>
                  <select
                    name="Country"
                    value={formik.values.Country}
                    onChange={handleCountryChange}
                    onBlur={formik.handleBlur}
                    className="auth-input"
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
                      className="auth-input"
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
                      className="auth-input"
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
            <div className="premium-card" style={{ padding: '16px' }}>
              <h2 className="font-display mb-1" style={{ fontSize: "16px", fontWeight: 700, color: "#1F2937", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "8px" }}>
                <FiMail /> Primary Contact
              </h2>
              <div className="grid-2 mt-4">
                <div className="auth-group">
                  <label className="auth-label">Official Email <span className="text-danger">*</span></label>
                  <input
                    type="email"
                    name="Emailid"
                    {...formik.getFieldProps("Emailid")}
                    className="auth-input bg-light"
                    placeholder="admin@company.com"
                    disabled
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

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end'}}>
              <button type="button" className="btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
              >
                <FiSave style={{ marginRight: '8px' }} /> {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
          
          <aside className="dashboard-column-side">
            <div style={{ position: 'sticky', top: '24px' }}>
              <ProfilePreviewPanel
                data={formik.values}
                logoPreview={logoPreview}
              />
            </div>
          </aside>
        </div>
      </form>
      {customAlert && (
        <CustomAlert
          title={customAlert.title}
          message={customAlert.message}
          type={customAlert.type}
          onConfirm={() => setCustomAlert(null)}
          onClose={() => setCustomAlert(null)}
        />
      )}
    </>
  );
};

export default AdminProfileEdit;
