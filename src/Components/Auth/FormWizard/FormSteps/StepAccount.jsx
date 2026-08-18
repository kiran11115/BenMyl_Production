import React from "react";

/* Expected digit counts per dial code */
const phoneRules = {
  "+1":   { length: 10, label: "USA",   example: "(111) 111-1111" },
  "+91":  { length: 10, label: "India", example: "11111 11111" },
  "+44":  { length: 11, label: "UK",    example: "11111 11111" },
  "+971": { length: 9,  label: "UAE",   example: "111 111 111" },
};

const StepAccount = ({
  formData,
  handleInputChange,
  handleBlur,
  errors,
  touched,
}) => {
  const rule    = phoneRules[formData.countryCode] || phoneRules["+1"];
  const current = (formData.phone || "").replace(/\D/g, "").length;
  const max     = rule.length;
  const pct     = Math.min((current / max) * 100, 100);

  /* colour thresholds */
  const barColor =
    current === 0 ? "#e2e8f0"
    : current < max ? "#f59e0b"
    : current === max ? "#22c55e"
    : "#ef4444";

  return (
    <div className="animate-fade-in">
      <section className="auth-section">
        <h3 className="auth-section-title">Primary Contact</h3>

        <div className="auth-grid-3 mb-3">

          {/* Company Name (READONLY) */}
          <div className="auth-group">
            <label className="auth-label">Company Name</label>
            <input
              type="text"
              name="companyName"
              className="auth-input"
              value={formData.companyName}
              readOnly
            />
          </div>

          {/* Full Name (READONLY) */}
          <div className="auth-group">
            <label className="auth-label">Full Name</label>
            <input
              type="text"
              name="fullName"
              className="auth-input"
              value={formData.fullName}
              readOnly
            />
          </div>

          {/* Email (READONLY) */}
          <div className="auth-group">
            <label className="auth-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="auth-input"
              value={formData.email}
              readOnly
            />
          </div>
        </div>

        {/* Business Phone (EDITABLE) */}
        <div className="auth-group">
          <label className="auth-label">
            Business Phone
            {/* live badge */}
            <span
              style={{
                marginLeft: "10px",
                fontSize: "11px",
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: "20px",
                background: barColor === "#22c55e" ? "#dcfce7"
                  : barColor === "#f59e0b" ? "#fef3c7"
                  : barColor === "#ef4444" ? "#fee2e2"
                  : "#f1f5f9",
                color: barColor === "#e2e8f0" ? "#94a3b8" : barColor,
                transition: "all 0.3s",
              }}
            >
              {current} / {max} digits
            </span><span style={{ color: '#ef4444' }}> *</span>
          </label>

          <div style={{ display: "flex", gap: "10px" }}>
            <select
              name="countryCode"
              className="auth-input"
              style={{ width: "130px", padding: "0 10px", flexShrink: 0 }}
              value={formData.countryCode || "+1"}
              onChange={handleInputChange}
            >
              {Object.entries(phoneRules).map(([code, r]) => (
                <option key={code} value={code}>
                  {code} ({r.label})
                </option>
              ))}
            </select>
            <input
              type="tel"
              name="phone"
              className={`auth-input ${
                touched.phone && errors.phone ? "is-invalid" : ""
              }`}
              style={{ flex: 1 }}
              placeholder={rule.example}
              value={formData.phone}
              onChange={handleInputChange}
              onBlur={handleBlur}
            />
          </div>

          {/* Progress bar */}
          <div
            style={{
              marginTop: "6px",
              height: "4px",
              borderRadius: "4px",
              background: "#e2e8f0",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${pct}%`,
                background: barColor,
                borderRadius: "4px",
                transition: "width 0.25s ease, background 0.25s ease",
              }}
            />
          </div>

          {/* Hint / error row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "4px",
              fontSize: "11px",
            }}
          >
            <span style={{ color: "#94a3b8" }}>
              {current === 0
                ? `Enter ${max}-digit ${rule.label} number`
                : current < max
                ? `${max - current} more digit${max - current === 1 ? "" : "s"} needed`
                : current === max
                ? "✓ Valid length"
                : `Too long — remove ${current - max} digit${current - max === 1 ? "" : "s"}`}
            </span>
            {touched.phone && errors.phone && (
              <small className="auth-error" style={{ margin: 0 }}>
                {errors.phone}
              </small>
            )}
          </div>
        </div>
      </section>

      {/* Notifications (EDITABLE) */}
      <div className="auth-toggle-wrapper">
        <label className="auth-toggle-label">
          <div className="auth-toggle-input-wrapper">
            <input
              type="checkbox"
              name="notifications"
              className="auth-toggle-checkbox"
              checked={formData.notifications}
              onChange={handleInputChange}
              onBlur={handleBlur}
            />
            <span className="auth-toggle-slider"></span>
          </div>

          <div className="auth-toggle-text">
            <span className="auth-toggle-title">Enable Priority Notifications</span>
            <span className="auth-toggle-desc">
              Receive critical updates via SMS &amp; WhatsApp
            </span>
          </div>
        </label>
      </div>
    </div>
  );
};

export default StepAccount;
