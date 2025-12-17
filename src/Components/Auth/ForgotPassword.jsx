// ForgotPassword.jsx
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "./Auth.css";

function ForgotPassword() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Required"),
    }),
    onSubmit: (values) => {
      console.log("Reset:", values);
      // TODO: call API and show success message
    },
  });

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* LEFT: reuse testimonial card */}
        <div className="auth-brand-side">
          <span className="auth-brand-accent-circle" />

          <div className="auth-brand-title">
            <h2 className="auth-title">Forgot your password?</h2>
            <p className="auth-subtitle">
              No worries — reset access to your account in just a few steps.
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
                “BENMYL keeps our team productive and secure, even when
                people forget their credentials.”
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

        {/* RIGHT: reset form */}
        <div className="auth-form-side">
          <img
            src="/Images/Loader-copy.gif"
            alt="BenMyl Logo"
            className="auth-logo"
          />

          <button
            type="button"
            onClick={() => navigate("/sign-in")}
            className="auth-link"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              marginBottom: "1rem",
            }}
          >
            <ArrowLeft size={16} /> Back to Sign In
          </button>

          <div className="auth-header">
            <h2 className="auth-title">Forgot Password?</h2>
            <p className="auth-subtitle">
              Enter the email associated with your account and a reset link will
              be sent to you.
            </p>
          </div>

          <form onSubmit={formik.handleSubmit}>
            <div className="auth-form-group">
              <label className="auth-label">Email Address</label>
              <input
                type="email"
                {...formik.getFieldProps("email")}
                className="auth-input"
                placeholder="name@company.com"
              />
              {formik.touched.email && formik.errors.email && (
                <div className="auth-error-msg">{formik.errors.email}</div>
              )}
            </div>

            <button type="submit" className="auth-btn-primary">
              Send Reset Link
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
