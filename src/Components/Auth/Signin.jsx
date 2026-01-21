// Signin.jsx
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSigninMutation } from "../../State-Management/Api/SigninApiSlice";
import { SubmissionErrorModal } from "./SigninAlert";
import "./Auth.css";

function Signin() {
  const [isVisible, setIsVisible] = useState(false);
  const [showError, setShowError] = useState(false);
  const [loginErrorMsg, setLoginErrorMsg] = useState("");

  const navigate = useNavigate();
  const [signin, { isLoading }] = useSigninMutation();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .email("Enter a valid email address")
        .required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),

    onSubmit: async (values, { setSubmitting }) => {
      try {
        setLoginErrorMsg("");

        const payload = {
          emailID: values.email,
          password: values.password,
        };

        const response = await signin(payload).unwrap();

        console.log("LOGIN RESPONSE =>", response);

        // SUCCESS CHECK (backend format)
        if (response?.isvalid === true) {
          localStorage.setItem("token", response?.token?.result);
          localStorage.setItem("CompanyId", response?.userid);
          localStorage.setItem("Email", response?.emailID);
          localStorage.setItem("CompanyName", response?.companyName);
          localStorage.setItem("UserName", response?.userName);
          localStorage.setItem("logincompanyid", response?.compabnyId);
          const role = response?.roleID;

          if (role === "Admin") {
            navigate("/Admin/account-settings");
            return;
          }

          if (role === "Recruiter") {
            navigate("/user/user-dashboard");
            return;
          }

        }

        // ERROR IF isvalid is false
        setLoginErrorMsg("Invalid credentials");
        setShowError(true);

      } catch (err) {
        console.error("Login failed:", err);
        setLoginErrorMsg("Invalid email or password");
        setShowError(true);
      } finally {
        setSubmitting(false);
      }
    }

  });

  return (
    <div className="auth-container">
      <div className="auth-card">

        {/* LEFT SIDE */}
        <div className="auth-brand-side">
          <span className="auth-brand-accent-circle" />

          <div className="auth-brand-title">
            <h2 className="auth-title">Welcome to our communities</h2>
            <p className="auth-subtitle">
              Clarity gives you the blocks &amp; components you need to create a
              truly professional website.
            </p>
          </div>

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
            <p style={{ color: "#facc15", marginBottom: "0.75rem" }}>★★★★★</p>
            <p
              style={{
                color: "#e5e7eb",
                fontStyle: "italic",
                lineHeight: 1.5,
              }}
            >
              “BENMYL gives our teams ready-to-use components, so we ship faster
              without sacrificing quality.”
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

        {/* RIGHT FORM SIDE */}
        <div className="auth-form-side">
          <img
            src="/Images/Loader-copy.gif"
            alt="BenMyl Logo"
            className="auth-logo"
          />

          <div className="auth-header">
            <h2 className="auth-title">Join BENMYL</h2>
            <p className="auth-subtitle">
              Sign in to continue to your dashboard.
            </p>
          </div>

          <form onSubmit={formik.handleSubmit}>
            {/* Email */}
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

            {/* Password */}
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
              {formik.touched.password && formik.errors.password && (
                <div className="auth-error-msg">{formik.errors.password}</div>
              )}
            </div>

            {/* Remember + Forgot */}
            <div className="auth-options-row mb-3">
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

            <button
              type="submit"
              className="auth-btn-primary"
              disabled={formik.isSubmitting || isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
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

      {/* ERROR MODAL */}
      {showError && (
        <SubmissionErrorModal
          message={loginErrorMsg}
          onClose={() => setShowError(false)}
          onRetry={() => {
            setShowError(false);
            formik.handleSubmit();
          }}
          onContactSupport={() => navigate("/support")}
        />
      )}
    </div>
  );
}

export default Signin;
