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
    onSubmit: (values, { setSubmitting }) => {
      console.log("Reset:", values);
      // TODO: call API and show success message
      setTimeout(() => {
        setSubmitting(false);
      }, 1000);
    },
  });

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* LEFT FORM SIDE */}
        <div className="auth-form-side">

          <div>

          </div>

          <div className="auth-logo-container-large">
            <img src="/Images/Benmyl-logo.svg" alt="BenMyl Logo" className="auth-logo-img-large" />
          </div>
          <button
            type="button"
            onClick={() => navigate("/sign-in")}
            className="auth-back-btn"
          >
            <ArrowLeft size={16} /> Back to Sign In
          </button>

          <h1 className="auth-form-title title-lg">
            Reset Your <span className="auth-highlight">Password</span>
          </h1>

          <p className="auth-form-subtitle subtitle-sm">
            Enter the email associated with your account and a reset link will be sent to you.
          </p>

          <form onSubmit={formik.handleSubmit} className="auth-form-custom">
            <div className="auth-form-custom">
              <input
                type="email"
                {...formik.getFieldProps("email")}
                className="auth-input auth-input-custom font-xs"
                placeholder="Email Address"
              />
              {formik.touched.email && formik.errors.email && (
                <div className="auth-error-msg auth-error-msg-custom">{formik.errors.email}</div>
              )}
            </div>

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="auth-submit-btn-custom font-xs"
            >
              {formik.isSubmitting ? "Sending..." : "Send Reset Link →"}
            </button>

          </form>

          <div className="auth-recovery-footer">
            <span className="auth-recovery-footer-diamond">⬡</span> SECURE PASSWORD RECOVERY
          </div>
        </div>

        {/* RIGHT BRAND SIDE */}
        <div className="auth-brand-side auth-brand-preview-side">

          <div className="auth-preview-header">
            <div className="auth-preview-meta">
              <div className="auth-preview-dot"></div>
              BENMYL PREVIEW UNIT
            </div>
            <div className="auth-preview-status-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              Workspace Access
            </div>
          </div>

          <div className="auth-preview-body">
            <div className="auth-preview-card">

              <div className="auth-card-top-bar">
                <div className="auth-card-dots">
                  <div className="auth-card-dot"></div>
                  <div className="auth-card-dot"></div>
                  <div className="auth-card-dot"></div>
                </div>
                <div className="auth-card-sub">BenMyl Account Security</div>
              </div>

              <div className="auth-benefit-list">

                <div className="auth-benefit-item">
                  <div className="auth-benefit-icon-box purple-theme">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  </div>
                  <div>
                    <div className="auth-benefit-title">Bank-Grade Security</div>
                    <div className="auth-benefit-desc">Your data is protected with enterprise encryption.</div>
                  </div>
                </div>

                <div className="auth-benefit-item">
                  <div className="auth-benefit-icon-box indigo-theme">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  </div>
                  <div>
                    <div className="auth-benefit-title">Fast Recovery</div>
                    <div className="auth-benefit-desc">Regain access to your workspace in seconds.</div>
                  </div>
                </div>

              </div>

              <div className="auth-preview-status-card">
                <div className="auth-status-card-header">
                  <div className="auth-status-card-title">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    SYSTEM STATUS
                  </div>
                  <div className="auth-status-card-label text-green">ALL SYSTEMS OPERATIONAL</div>
                </div>
                <div className="auth-status-card-body">
                  Authentication services are running smoothly with <strong>99.99%</strong> uptime over the last 30 days.
                </div>
              </div>

            </div>
          </div>

          <div className="auth-preview-blob-1"></div>
          <div className="auth-preview-blob-2"></div>

        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
