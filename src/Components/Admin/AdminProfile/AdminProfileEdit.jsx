import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiX, FiSave, FiImage } from "react-icons/fi";
import "./AdminProfileEdit.css";

const AdminProfileEdit = () => {
  const navigate = useNavigate();

  // Empty initial state as requested
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    industry: "",
    size: "",
    foundedYear: "",
    websiteUrl: "",
    domain: "",
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
    plan: {
      name: "",
      billingCycle: "",
      seats: "",
    },
  });

  // Logo upload state - starts empty
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  // Fixed handleChange for nested objects (immutable updates)
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const path = name.split('.');

    setFormData((prev) => {
      if (path.length === 1) {
        return { ...prev, [name]: value };
      }

      // Immutable nested update
      const newData = { ...prev };
      let current = newData;

      for (let i = 0; i < path.length - 1; i++) {
        current[path[i]] = { ...current[path[i]] };
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newData;
    });
  }, []);

  // Logo upload handler
  const handleLogoUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file (PNG, JPG, GIF)');
        e.target.value = ''; // Reset input
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        e.target.value = ''; // Reset input
        return;
      }

      setLogoFile(file);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);

      // Clear previous preview if exists
      if (logoPreview && logoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(logoPreview);
      }

      setLogoPreview(previewUrl);
    }
  }, [logoPreview]);

  // Cleanup preview URL on unmount
  React.useEffect(() => {
    return () => {
      if (logoPreview && logoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = { ...formData, logoFile };
    console.log("Admin Profile Updated:", submitData);
    // TODO: API call to save data
    navigate("/admin/admin-profile");
  };

  const handleCancel = () => {
    // Reset logo preview and file
    if (logoPreview && logoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(logoPreview);
    }
    setLogoPreview(null);
    setLogoFile(null);
    // Reset form to empty
    setFormData({
      name: "",
      tagline: "",
      industry: "",
      size: "",
      foundedYear: "",
      websiteUrl: "",
      domain: "",
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
      plan: {
        name: "",
        billingCycle: "",
        seats: "",
      },
    });
    navigate("/admin/admin-profile");
  };

  const removeLogo = () => {
    if (logoFile) {
      setLogoFile(null);
    }
    if (logoPreview && logoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(logoPreview);
    }
    setLogoPreview(null);
  };

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
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.logo-placeholder {
  width: 120px;
  height: 120px;
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  gap: 0.5rem;
}

.logo-placeholder-icon {
  font-size: 2rem;
  color: #94a3b8;
}

.logo-upload-btn, .logo-remove-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.logo-upload-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
}

.logo-upload-btn:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  transform: translateY(-1px);
}

.logo-remove-btn {
  background: #ef4444;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 13px;
}

.logo-remove-btn:hover {
  background: #dc2626;
}

.logo-input {
  display: none;
}

.logo-info {
  text-align: center;
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

        <form onSubmit={handleSubmit} className="profile-form shadow-sm">
          {/* Logo Upload Section */}
          <div className="form-section">
            <h3 className="section-title">Company Logo</h3>
            <div className="logo-upload-container">
              <label className="logo-upload-label">
                <div className="logo-preview-wrapper">
                  {logoPreview ? (
                    <>
                      <img
                        src={logoPreview}
                        alt="Company Logo Preview"
                        className="logo-preview"
                      />
                      <button
                        type="button"
                        className="logo-remove-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeLogo();
                        }}
                      >
                        Remove Logo
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
                <div className="logo-info">
                  <small style={{ color: "#64748b" }}>
                    PNG, JPG, GIF up to 5MB. Recommended size: 400x400px
                  </small>
                  {logoFile && (
                    <div style={{ marginTop: "0.5rem" }}>
                      <small style={{ color: "#10b981", fontWeight: "500" }}>
                        ✓ {logoFile.name} ({(logoFile.size / 1024 / 1024).toFixed(1)} MB)
                      </small>
                    </div>
                  )}
                </div>
              </label>
            </div>

          </div>

          {/* Company Information */}
          <div className="form-section">
            <h3 className="section-title">Company Information</h3>
            <div className="input-grid-3">
              <div className="auth-group">
                <label className="auth-label">Company Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="auth-input"
                  placeholder="Enter company name"
                  required
                />
              </div>
              <div className="auth-group">
                <label className="auth-label">Tagline</label>
                <input
                  type="text"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  className="auth-input"
                  placeholder="Short description"
                />
              </div>
              <div className="auth-group">
                <label className="auth-label">Industry *</label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="auth-input"
                  placeholder="e.g., Staffing & Recruiting"
                  required
                />
              </div>
            </div>
            <div className="input-grid-2">
              <div className="auth-group">
                <label className="auth-label">Company Size</label>
                <select name="size" value={formData.size} onChange={handleChange} className="auth-input">
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
                  name="foundedYear"
                  value={formData.foundedYear}
                  onChange={handleChange}
                  className="auth-input"
                  placeholder="2020"
                  min="1900"
                  max="2026"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="form-section">
            <div className="auth-group">
              <div className="d-flex align-items-center justify-content-between">
                <label className="auth-label">Description</label>

                <button className="ai-pill-btn">
                  <span className="ai-pill-icon">✦</span>
                  <span className="ai-pill-text">AI</span>
                </button>
              </div>
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className="auth-input resize-vertical"
                placeholder="Describe your company..."
                maxLength={500}
              />
              <small style={{ color: "#64748b", float: "right" }}>
                {formData.description.length}/500
              </small>
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
                  name="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={handleChange}
                  className="auth-input"
                  placeholder="https://company.com"
                />
              </div>
              <div className="auth-group">
                <label className="auth-label">Domain</label>
                <input
                  type="text"
                  name="domain"
                  value={formData.domain}
                  onChange={handleChange}
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
                  name="headquarters.street1"
                  value={formData.headquarters.street1}
                  onChange={handleChange}
                  className="auth-input"
                  placeholder="123 Main St"
                />
              </div>
              <div className="auth-group">
                <label className="auth-label">Street Address 2</label>
                <input
                  type="text"
                  name="headquarters.street2"
                  value={formData.headquarters.street2}
                  onChange={handleChange}
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
                  name="headquarters.city"
                  value={formData.headquarters.city}
                  onChange={handleChange}
                  className="auth-input"
                  placeholder="Visakhapatnam"
                />
              </div>
              <div className="auth-group">
                <label className="auth-label">State</label>
                <input
                  type="text"
                  name="headquarters.state"
                  value={formData.headquarters.state}
                  onChange={handleChange}
                  className="auth-input"
                  placeholder="Andhra Pradesh"
                />
              </div>
              <div className="auth-group">
                <label className="auth-label">Postal Code</label>
                <input
                  type="text"
                  name="headquarters.postalCode"
                  value={formData.headquarters.postalCode}
                  onChange={handleChange}
                  className="auth-input"
                  placeholder="530016"
                />
              </div>
              <div className="auth-group">
                <label className="auth-label">Country</label>
                <select
                  name="headquarters.country"
                  value={formData.headquarters.country}
                  onChange={handleChange}
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

          {/* Contact Information */}
          <div className="form-section">
            <h3 className="section-title">Contact Information</h3>
            <div className="input-grid-3">
              <div className="auth-group">
                <label className="auth-label">Email *</label>
                <input
                  type="email"
                  name="contact.email"
                  value={formData.contact.email}
                  onChange={handleChange}
                  className="auth-input"
                  placeholder="hello@company.com"
                  required
                />
              </div>
              <div className="auth-group">
                <label className="auth-label">Phone</label>
                <input
                  type="tel"
                  name="contact.phone"
                  value={formData.contact.phone}
                  onChange={handleChange}
                  className="auth-input"
                  placeholder="+91 891 234 5678"
                />
              </div>
              <div className="auth-group">
                <label className="auth-label">LinkedIn URL</label>
                <input
                  type="url"
                  name="contact.linkedinUrl"
                  value={formData.contact.linkedinUrl}
                  onChange={handleChange}
                  className="auth-input"
                  placeholder="https://linkedin.com/company/..."
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="btn-secondary"
            >
              <FiX /> Cancel
            </button>
            <button type="submit" onClick={handleSubmit} className="btn-primary gap-2">
              <FiSave /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AdminProfileEdit;
