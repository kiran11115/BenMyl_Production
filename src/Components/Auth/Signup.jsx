// SignUp.jsx
import React, { useState } from "react";
import { useFormik } from "formik";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function SignUp() {
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      fullName: "",
      companyName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
    // no validationSchema
    validate: () => ({}),
    onSubmit: (values) => {
      console.log("Sign up:", values);
      navigate("/OTP-Verification");
    },
  });

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* LEFT: testimonial card only */}
        <div className="auth-brand-side">
          <span className="auth-brand-accent-circle" />

          <div className="auth-brand-title">
            <h2 className="auth-title">Create your account</h2>
            <p className="auth-subtitle">
              Join our communities and use the blocks &amp; components you need
              to build a truly professional experience.
            </p>

            <div
              style={{
                marginTop: "2.25rem",
                padding: "1.25rem 1.5rem",
                borderRadius: "0.75rem",
                background:
                  "linear-gradient(135deg, rgba(15,23,42,0.8), rgba(15,23,42,0.6))",
                border: "1px solid rgba(148,163,184,0.35)",
                maxWidth: "360px",
              }}
            >
              <p style={{ color: "#facc15", marginBottom: "0.75rem" }}>
                ★★★★★
              </p>

              <p
                style={{
                  color: "#e5e7eb",
                  fontStyle: "italic",
                  lineHeight: 1.5,
                }}
              >
                “BENMYL gives our teams ready‑to‑use components, so we ship
                faster without sacrificing quality.”
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "1.25rem",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "999px",
                    overflow: "hidden",
                    backgroundColor: "#1f2937",
                  }}
                />
                <div style={{ color: "#e5e7eb" }}>
                  <div style={{ fontWeight: 600 }}>Lyndon Hebert</div>
                  <div style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
                    CEO &amp; Founder
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Sign‑up form (no validation) */}
        <div className="auth-form-side">
          <div className="auth-header">
            <img
              src="/Images/Loader-copy.gif"
              alt="BenMyl Logo"
              className="auth-logo"
            />
            <h2 className="auth-title">Create Account</h2>
            <p className="auth-subtitle">
              Start building with BENMYL in a few simple steps.
            </p>
          </div>

          <form onSubmit={formik.handleSubmit}>
            {/* Full Name */}
            <div className="auth-form-group">
              <label className="auth-label">Full Name</label>
              <input
                type="text"
                {...formik.getFieldProps("fullName")}
                className="auth-input"
                placeholder="Your Full Name"
              />
            </div>

            <div className="auth-form-group">
              <label className="auth-label">Company Name</label>
              <input
                type="text"
                {...formik.getFieldProps("companyName")}
                className="auth-input"
                placeholder="Your Company Name"
              />
            </div>

            <div className="auth-form-group">
              <label className="auth-label">Email</label>
              <input
                type="email"
                {...formik.getFieldProps("email")}
                className="auth-input"
                placeholder="name@company.com"
              />
            </div>

            {/* Password */}
            <div className="auth-form-group">
              <label className="auth-label">Password</label>
              <div className="auth-password-wrapper">
                <input
                  type={isVisible ? "text" : "password"}
                  {...formik.getFieldProps("password")}
                  className="auth-input"
                  placeholder="Create password"
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setIsVisible(!isVisible)}
                >
                  {isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="auth-form-group">
              <label className="auth-label">Confirm Password</label>
              <div className="auth-password-wrapper">
                <input
                  type={isConfirmVisible ? "text" : "password"}
                  {...formik.getFieldProps("confirmPassword")}
                  className="auth-input"
                  placeholder="Re-enter password"
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setIsConfirmVisible(!isConfirmVisible)}
                >
                  {isConfirmVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </div>

            {/* Terms + cookies checkbox still present but not validated */}
            <div className="auth-form-group">
              <label className="auth-remember">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formik.values.acceptTerms}
                  onChange={formik.handleChange}
                />
                <span>
                  I agree to the{" "}
                  <button
                    type="button"
                    className="auth-link"
                    onClick={() => navigate("/terms")}
                  >
                    Terms &amp; Conditions
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    className="auth-link"
                    onClick={() => navigate("/cookies")}
                  >
                    Cookie Policy
                  </button>
                  .
                </span>
              </label>
            </div>

            <button type="submit" className="auth-btn-primary">
              Create Account
            </button>
          </form>

          <p className="auth-footer-text">
            Already have an account?{" "}
            <button
              type="button"
              className="auth-link"
              onClick={() => navigate("/sign-in")}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
