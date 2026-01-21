import React, { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiX, FiSave, FiImage } from "react-icons/fi";


function EditProfile() {
  const navigate = useNavigate();

  // Complete empty state matching ALL ProfilePage fields
  const [formData, setFormData] = useState({
  id: "",
  slug: "",
  name: "",
  companyname: "",
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

  // ✅ NEW: Work Experience
  workExperience: [
    {
      role: "",
      company: "",
      startYear: "",
      endYear: "",
      isCurrent: false,
    },
  ],
   additionalInfo: {
    jobTitle: "",
    experience: "",
    education: "",
    languages: [], // ["English", "Spanish"]
    referredBy: "",
  },
});

const toggleLanguage = (lang) => {
  setFormData((prev) => {
    const exists = prev.additionalInfo.languages.includes(lang);
    return {
      ...prev,
      additionalInfo: {
        ...prev.additionalInfo,
        languages: exists
          ? prev.additionalInfo.languages.filter((l) => l !== lang)
          : [...prev.additionalInfo.languages, lang],
      },
    };
  });
};


const handleExperienceChange = (index, field, value) => {
  setFormData((prev) => {
    const updated = [...prev.workExperience];
    updated[index] = { ...updated[index], [field]: value };
    return { ...prev, workExperience: updated };
  });
};

const addExperience = () => {
  setFormData((prev) => ({
    ...prev,
    workExperience: [
      ...prev.workExperience,
      {
        role: "",
        company: "",
        startYear: "",
        endYear: "",
        isCurrent: false,
      },
    ],
  }));
};

const removeExperience = (index) => {
  setFormData((prev) => ({
    ...prev,
    workExperience: prev.workExperience.filter((_, i) => i !== index),
  }));
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
    navigate("/user/user-profile");
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
          <label className="auth-label">Role</label>
          <input
            type="text"
            value={exp.role}
            onChange={(e) =>
              handleExperienceChange(index, "role", e.target.value)
            }
            className="auth-input"
            placeholder="Recruiter"
          />
        </div>

        <div className="auth-group">
          <label className="auth-label">Company</label>
          <input
            type="text"
            value={exp.company}
            onChange={(e) =>
              handleExperienceChange(index, "company", e.target.value)
            }
            className="auth-input"
            placeholder="Nimbus Labs"
          />
        </div>
      </div>

      <div className="input-grid-3 mt-2">
        <div className="auth-group">
          <label className="auth-label">Start Year</label>
          <input
            type="number"
            value={exp.startYear}
            onChange={(e) =>
              handleExperienceChange(index, "startYear", e.target.value)
            }
            className="auth-input"
            placeholder="2019"
          />
        </div>

        <div className="auth-group">
          <label className="auth-label">End Year</label>
          <input
            type="number"
            value={exp.endYear}
            onChange={(e) =>
              handleExperienceChange(index, "endYear", e.target.value)
            }
            className="auth-input"
            disabled={exp.isCurrent}
            placeholder="2023"
          />
        </div>

        <div className="auth-group" style={{ alignSelf: "end" }}>
          <label className="auth-label">
            <input
              type="checkbox"
              checked={exp.isCurrent}
              onChange={(e) =>
                handleExperienceChange(index, "isCurrent", e.target.checked)
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

  <button type="button" onClick={addExperience} className="btn-secondary">
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

        {/* Headquarters */}
        <div className="form-section">
          <h3 className="section-title">Address</h3>
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

       {/* Additional Information */}
<div className="form-section">
  <h3 className="section-title">Additional Information</h3>

  <div className="input-grid-2">
    <div className="auth-group">
      <label className="auth-label">Job Title</label>
      <input
        type="text"
        value={formData.additionalInfo.jobTitle}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            additionalInfo: {
              ...prev.additionalInfo,
              jobTitle: e.target.value,
            },
          }))
        }
        className="auth-input"
        placeholder="Recruiter"
      />
    </div>

    <div className="auth-group">
      <label className="auth-label">Experience (Years)</label>
      <input
        type="number"
        min="0"
        value={formData.additionalInfo.experience}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            additionalInfo: {
              ...prev.additionalInfo,
              experience: e.target.value,
            },
          }))
        }
        className="auth-input"
        placeholder="5"
      />
    </div>
  </div>

  <div className="input-grid-2 mt-3">
    <div className="auth-group">
      <label className="auth-label">Education</label>
      <select
        value={formData.additionalInfo.education}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            additionalInfo: {
              ...prev.additionalInfo,
              education: e.target.value,
            },
          }))
        }
        className="auth-input"
      >
        <option value="">Select education</option>
        <option value="High School">High School</option>
        <option value="Bachelor's Degree">Bachelor's Degree</option>
        <option value="Master's Degree">Master's Degree</option>
        <option value="PhD">PhD</option>
      </select>
    </div>

    <div className="auth-group">
      <label className="auth-label">Referred By</label>
      <input
        type="email"
        value={formData.additionalInfo.referredBy}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            additionalInfo: {
              ...prev.additionalInfo,
              referredBy: e.target.value,
            },
          }))
        }
        className="auth-input"
        placeholder="gsrinivas@mylastech.com"
      />
    </div>
  </div>

  {/* Languages */}
  <div className="auth-group mt-3">
    <label className="auth-label">Languages Spoken</label>

    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      {["English", "Spanish", "Hindi", "French"].map((lang) => (
        <button
          type="button"
          key={lang}
          onClick={() => toggleLanguage(lang)}
          style={{
            padding: "6px 12px",
            borderRadius: "999px",
            border: "1px solid #e5e7eb",
            background: formData.additionalInfo.languages.includes(lang)
              ? "#e0f2fe"
              : "#fff",
            color: "#0284c7",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          {lang.toUpperCase()}
        </button>
      ))}
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
