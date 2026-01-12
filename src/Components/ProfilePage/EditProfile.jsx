import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiX, FiSave, FiImage } from "react-icons/fi";


function EditProfile() {
  const navigate = useNavigate();

  // Complete empty state matching ALL ProfilePage fields
  const [formData, setFormData] = useState({
    id: "",
    slug: "",
    name: "", // "John Smith"
    companyname: "", // "Nimbus Labs"
    size: "", // "100-200"
    status: "", // "Active"
    industry: "",
    foundedYear: "",
    websiteUrl: "",
    domain: "",
    description: "",
    headquarters: {
      street1: "", // "27-1-72/4, hms knska"
      street2: "", // "3rd Floor, Tech Tower"
      city: "", // "San francisco"
      state: "", // "CA"
      postalCode: "", // "572734"
      country: "", // "USA"
    },
    contact: {
      email: "",
      phone: "",
      linkedinUrl: "",
    },
    teamMembers: [], // Array for team members
  });

  // Logo upload state
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  // Fixed nested state handler
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    const path = name.split('.');

    setFormData((prev) => {
      if (path.length === 1) {
        return { ...prev, [name]: value };
      }
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

  // Logo upload - full card clickable
  const handleLogoUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select image file only');
        e.target.value = '';
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Max 5MB');
        e.target.value = '';
        return;
      }
      setLogoFile(file);
      const preview = URL.createObjectURL(file);
      if (logoPreview?.startsWith('blob:')) URL.revokeObjectURL(logoPreview);
      setLogoPreview(preview);
    }
  }, [logoPreview]);

  React.useEffect(() => () => {
    if (logoPreview?.startsWith('blob:')) URL.revokeObjectURL(logoPreview);
  }, [logoPreview]);

  const removeLogo = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLogoFile(null);
    if (logoPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(logoPreview);
      setLogoPreview(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Profile:", { ...formData, logoFile });
    navigate("/user/profile");
  };

  const handleCancel = () => navigate("/user/profile");

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
                    <button type="button" className="logo-remove-btn" onClick={removeLogo}>
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
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="logo-input" />
              <div className="logo-info">
                <small style={{ color: "#64748b" }}>PNG, JPG up to 5MB</small>
                {logoFile && (
                  <small style={{ color: "#10b981", fontWeight: 500 }}>
                    ✓ {logoFile.name}
                  </small>
                )}
              </div>
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
                placeholder="John Smith"
                required
              />
            </div>
            <div className="auth-group">
              <label className="auth-label">Company Name</label>
              <input
                type="text"
                name="companyname"
                value={formData.companyname}
                onChange={handleChange}
                className="auth-input"
                placeholder="Nimbus Labs"
              />
            </div>
          </div>
        </div>

        {/* Company Details */}
        <div className="form-section">
          <h3 className="section-title">Company Details</h3>
          <div className="input-grid-3">
            <div className="auth-group">
              <label className="auth-label">Industry</label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="auth-input"
                placeholder="Staffing & Recruiting"
              />
            </div>
            <div className="auth-group">
              <label className="auth-label">Company Size</label>
              <select name="size" value={formData.size} onChange={handleChange} className="auth-input">
                <option value="">Select size</option>
                <option value="1-10">1-10</option>
                <option value="10-50">10-50</option>
                <option value="50-100">50-100</option>
                <option value="100-200">100-200</option>
                <option value="200+">200+</option>
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
                min="1900"
                max="2026"
                placeholder="2018"
              />
            </div>
          </div>
          <div className="input-grid-2 mt-3">
            <div className="auth-group">
              <label className="auth-label">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="auth-input">
                <option value="">Select status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <div className="auth-group">
              <label className="auth-label">Company ID</label>
              <input type="text" name="id" value={formData.id} onChange={handleChange} className="auth-input" placeholder="cmp_24781" />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="form-section">
          <div className="auth-group">
            <label className="auth-label">Description</label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="auth-input resize-vertical"
              placeholder="Enter company description..."
              maxLength={500}
            />
            <small style={{ color: "#64748b", float: "right" }}>{formData.description.length}/500</small>
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
                placeholder="https://talentbridge.com"
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
                placeholder="talentbridge.com"
              />
            </div>
          </div>
        </div>

        {/* Headquarters */}
        <div className="form-section">
          <h3 className="section-title">Headquarters Address</h3>
          <div className="input-grid-2">
            <div className="auth-group">
              <label className="auth-label">Street Address 1</label>
              <input
                type="text"
                name="headquarters.street1"
                value={formData.headquarters.street1}
                onChange={handleChange}
                className="auth-input"
                placeholder="27-1-72/4, hms knska"
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
                placeholder="3rd Floor, Tech Tower"
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
                placeholder="San francisco"
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
                placeholder="CA"
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
                placeholder="572734"
              />
            </div>
            <div className="auth-group">
              <label className="auth-label">Country</label>
              <select name="headquarters.country" value={formData.headquarters.country} onChange={handleChange} className="auth-input">
                <option value="">Select country</option>
                <option value="USA">USA</option>
                <option value="IN">India</option>
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
                type="email"
                name="contact.email"
                value={formData.contact.email}
                onChange={handleChange}
                className="auth-input"
                placeholder="hr@talentbridge.com"
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

        {/* Additional Fields */}
        <div className="form-section">
          <h3 className="section-title">Additional Information</h3>
          <div className="input-grid-2">
            <div className="auth-group">
              <label className="auth-label">Company Slug</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="auth-input"
                placeholder="talentbridge-hr"
              />
            </div>
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
