// SignUp.jsx
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import { useRegisterMutation } from "../../State-Management/Api/SignupApiSlice";

/* =========================
   Validation Schema
========================= */
const signUpValidationSchema = Yup.object({
  companyName: Yup.string()
    .trim()
    .min(2, "Company name must be at least 2 characters")
    .required("Company name is required"),

  fullName: Yup.string()
    .trim()
    .min(3, "Full name must be at least 3 characters")
    .required("Full name is required"),

  email: Yup.string()
    .email("Enter a valid email address")
    .required("Email is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .matches(/[@$!%*?&#]/, "Must contain one special character")
    .required("Password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),

  acceptTerms: Yup.boolean().oneOf(
    [true],
    "You must accept Terms & Conditions"
  ),
});

function SignUp() {
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  /* =========================
     READ URL QUERY PARAMS
  ========================= */
  const params = new URLSearchParams(window.location.search);

  const invitedCompanyName = params.get("CompanyName");
  const invitedEmail = params.get("EmailID");
  const invitedFullName = params.get("FullName");

  console.log("Company:", invitedCompanyName);
  console.log("Email:", invitedEmail);
  console.log("FullName:", invitedFullName);


  const isInviteSignup = !!invitedEmail;

  /* =========================
     FORMIK
  ========================= */
  const formik = useFormik({
    enableReinitialize: true, // 🔑 REQUIRED

    initialValues: {
      companyName: invitedCompanyName || "",
      fullName: invitedFullName || "",
      email: invitedEmail || "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },

    validationSchema: signUpValidationSchema,

    onSubmit: async (values) => {
      try {
        const payload = {
          companyName: values.companyName,
          fullName: values.fullName,
          emailID: values.email,
          password: values.password,
          role: "Admin",
        };

        await register(payload).unwrap();

        navigate("/otp-verification", {
          state: {
            emailID: values.email,
            fullName: values.fullName,
            companyName: values.companyName,
          },
        });
      } catch (err) {
        console.error("Signup failed:", err);
      }
    },
  });

  return (
    <div className="auth-container-signup">
      <div className="auth-card">
        {/* LEFT SIDE unchanged */}
        <div className="auth-brand-side">
          <span className="auth-brand-accent-circle" />
          <div className="auth-brand-title">
            <h2 className="auth-title">Create your account</h2>
            <p className="auth-subtitle">
              Join our communities and use the blocks & components you need to
              build a truly professional experience.
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
                  CEO & Founder
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
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
                placeholder="User Name"
              />
              {formik.touched.fullName && formik.errors.fullName && (
                <p className="auth-error-msg">{formik.errors.fullName}</p>
              )}
            </div>

            {/* Company Name */}
            <div className="auth-form-group">
              <label className="auth-label">Company Name</label>
              <input
                type="text"
                {...formik.getFieldProps("companyName")}
                className="auth-input"
                placeholder="Company Name"
              />
              {formik.touched.companyName && formik.errors.companyName && (
                <p className="auth-error-msg">{formik.errors.companyName}</p>
              )}
            </div>

            {/* Email */}
            <div className="auth-form-group">
              <label className="auth-label">Email</label>
              <input
                type="email"
                {...formik.getFieldProps("email")}
                className="auth-input"
                placeholder="Enter email"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="auth-error-msg">{formik.errors.email}</p>
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
                  placeholder="Confirm password"
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

            {/* Terms */}
            <div className="auth-form-group">
              <label className="auth-remember">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formik.values.acceptTerms}
                  onChange={formik.handleChange}
                />
                <span>
                  I agree to the Terms & Conditions and Cookie Policy.
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="auth-btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
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
