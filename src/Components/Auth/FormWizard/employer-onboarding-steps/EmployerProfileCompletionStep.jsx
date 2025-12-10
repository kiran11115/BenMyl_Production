import React from "react";

export default function EmployerProfileCompletionStep({
  state,
  onChange,
  onBack,
  onSubmit,
}) {
  const profile = state.profile || {};

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ profile: { ...profile, [name]: value } });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form className="wizard-card" onSubmit={handleSubmit}>
      <h2 className="wizard-card-title">Profile Completion</h2>
      <p className="wizard-card-subtitle">
        Finish your company profile so candidates and vendors can
        quickly understand who you are.
      </p>

      {/* Top: logo + basic company info */}
      <div className="wizard-profile-top">
        <div className="wizard-profile-photo-card">
          <div className="wizard-upload-icon">🏢</div>
          <button
            type="button"
            className="auth-btn-primary wizard-profile-photo-btn"
          >
            Upload Logo
          </button>
          <p className="wizard-upload-meta">
            JPG, PNG (max 5MB)
          </p>
        </div>

        <div className="wizard-profile-headline">
          <div className="auth-form-group">
            <label className="auth-label">Company Name</label>
            <input
              name="companyName"
              className="auth-input"
              placeholder="Enter company name"
              value={profile.companyName || ""}
              onChange={handleChange}
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-label">Company Website</label>
            <input
              name="website"
              className="auth-input"
              placeholder="https://your-company.com"
              value={profile.website || ""}
              onChange={handleChange}
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-label">Headquarters Location</label>
            <input
              name="location"
              className="auth-input"
              placeholder="City, Country"
              value={profile.location || ""}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Company overview */}
      <section className="wizard-section">
        <h3 className="wizard-section-title">About Company</h3>
        <div className="auth-form-group">
          <label className="auth-label">Overview</label>
          <textarea
            name="about"
            className="auth-input wizard-textarea"
            placeholder="Describe your mission, culture, and what you work on."
            rows={4}
            value={profile.about || ""}
            onChange={handleChange}
          />
        </div>
      </section>

      {/* Focus areas + hiring preferences */}
      <section className="wizard-section wizard-section-grid-2">
        <div>
          <h3 className="wizard-section-title">Focus Areas</h3>
          <div className="auth-form-group">
            <label className="auth-label">Primary Industries</label>
            <input
              name="industries"
              className="auth-input"
              placeholder="e.g. FinTech, SaaS, E‑commerce"
              value={profile.industries || ""}
              onChange={handleChange}
            />
          </div>
          <div className="auth-form-group">
            <label className="auth-label">Team Size</label>
            <input
              name="teamSize"
              className="auth-input"
              placeholder="e.g. 11–50, 51–200"
              value={profile.teamSize || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <h3 className="wizard-section-title">Hiring Preferences</h3>
          <div className="auth-form-group">
            <label className="auth-label">Roles You Typically Hire</label>
            <input
              name="roles"
              className="auth-input"
              placeholder="e.g. Frontend Engineers, Designers, PMs"
              value={profile.roles || ""}
              onChange={handleChange}
            />
          </div>
          <div className="auth-form-group">
            <label className="auth-label">Engagement Type</label>
            <input
              name="engagement"
              className="auth-input"
              placeholder="e.g. Full‑time, Contract, Remote"
              value={profile.engagement || ""}
              onChange={handleChange}
            />
          </div>
        </div>
      </section>

      {/* CTA row */}
      <div className="wizard-footer">
        <button
          type="button"
          className="auth-btn-secondary"
          onClick={onBack}
        >
          Back
        </button>
        <div className="wizard-footer-right">
          <button
            type="button"
            className="auth-btn-secondary"
          >
            Save as Draft
          </button>
          <button type="submit" className="auth-btn-primary">
            Submit Profile
          </button>
        </div>
      </div>
    </form>
  );
}
