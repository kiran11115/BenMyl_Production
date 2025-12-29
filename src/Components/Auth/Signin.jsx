// Signin.jsx
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SuccessModal, SubmissionErrorModal } from "./SigninAlert"; // adjust path to your modals file
import "./Auth.css";

function Signin() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: "", password: "", rememberMe: false },
    // validationSchema: Yup.object({
    //   email: Yup.string().email("Invalid email").required("Required"),
    //   password: Yup.string().required("Required"),
    // }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        console.log("Login:", values);
        // TODO: Replace with your actual API call
        // await loginApi(values);
        setShowSuccess(true);
      } catch (error) {
        console.error("Login failed:", error);
        setShowError(true);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const styleSign = `
  
  /* Ensure modals overlay properly without hiding left panel text */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.alert-card {
  position: relative;
  z-index: 10000;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

  
  `;

  return (
    <>
    <style>{styleSign}</style>
      <div className="auth-container">
        <div className="auth-card">
          {/* LEFT: welcome + testimonial card + decorative circles - UNCHANGED */}
          <div className="auth-brand-side">
            <span className="auth-brand-accent-circle" />

            <div className="auth-brand-title">
              <h2 className="auth-title">Welcome to our communities</h2>
              <p className="auth-subtitle">
                Clarity gives you the blocks &amp; components you need to create a
                truly professional website.
              </p>

              {/* Testimonial card */}
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
                  "We love BENMYL; our organizations were using it for their
                  projects, so we already knew what kind of design they want."
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
                  >
                    {/* Optional avatar image */}
                  </div>
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

          {/* RIGHT: sign-in form - UNCHANGED DESIGN */}
          <div className="auth-form-side">
            <img
              src="/Images/Loader-copy.gif"
              alt="BenMyl Logo"
              className="auth-logo"
            />

            <div className="auth-header">
              <h2 className="auth-title">Join BENMYL</h2>
              <p className="auth-subtitle">
                Clarity gives you the blocks &amp; components you need to create a
                truly professional website.
              </p>
            </div>

            <div className="d-flex justify-content-center">
              <button
                type="button"
                className="auth-btn-secondary"
                style={{
                  boxShadow: "none",
                  justifyContent: "center",
                  gap: "0.5rem",
                  width: "100%",
                }}
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  style={{ width: 18, height: 18 }}
                />
                <span>Continue with Google</span>
              </button>
            </div>

            <div className="auth-divider">
              <span className="auth-divider-line" />
              <span className="auth-divider-text">Or</span>
              <span className="auth-divider-line" />
            </div>

            <form onSubmit={formik.handleSubmit}>
              <div className="auth-form-group">
                <label className="auth-label">Email Id</label>
                <input
                  type="email"
                  {...formik.getFieldProps("email")}
                  className="auth-input"
                  placeholder="Enter your email id"
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="auth-error-msg">{formik.errors.email}</div>
                )}
              </div>

              <div className="auth-form-group">
                <label className="auth-label">Password</label>
                <div className="auth-password-wrapper">
                  <input
                    type={isVisible ? "text" : "password"}
                    {...formik.getFieldProps("password")}
                    className="auth-input"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    className="auth-eye-btn"
                    onClick={() => setIsVisible(!isVisible)}
                  >
                    {isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>

                <div className="auth-options-row">
                  <label className="auth-remember">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formik.values.rememberMe}
                      onChange={formik.handleChange}
                    />
                    Remember Me
                  </label>

                  <button
                    type="button"
                    className="auth-link"
                    onClick={() => navigate("/forgot-password")}
                  >
                    Forgot Password?
                  </button>
                </div>

                {formik.touched.password && formik.errors.password && (
                  <div className="auth-error-msg">{formik.errors.password}</div>
                )}
              </div>

              <button
                type="submit"
                className="auth-btn-primary"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <p className="auth-footer-text">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                className="auth-link"
                onClick={() => navigate("/sign-up")}
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>

        {/* MODALS: Overlay on entire screen - Left side text stays visible */}
        {showSuccess && (
          <SuccessModal
            onClose={() => {
              setShowSuccess(false);
              navigate("/user/user-dashboard");
            }}
          />
        )}

        {showError && (
          <SubmissionErrorModal
            onClose={() => setShowError(false)}
            onRetry={() => {
              setShowError(false);
              formik.handleSubmit(); // retry submission
            }}
            onContactSupport={() => {
              setShowError(false);
              navigate("/support");
            }}
          />
        )}
      </div>
    </>
  );
}

export default Signin;
