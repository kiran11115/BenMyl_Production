// SignUp.jsx
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import { useRegisterMutation } from "../../State-Management/Api/SignupApiSlice";
import { toast } from "react-toastify";
import { SubmissionErrorModal } from "./SigninAlert";
import TermsModal from "./TermsModal";

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
    "You must accept Terms & Conditions and Cookie Policy"
  ),
});

function SignUp() {
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Alert State
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  /* =========================
     READ URL QUERY PARAMS
  ========================= */
  const params = new URLSearchParams(window.location.search);

  const invitedCompanyName = params.get("CompanyName");
  const invitedEmail = params.get("EmailID");
  const invitedFullName = params.get("FullName");
  const invitedRole = params.get("Role");

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
          role: invitedRole || "Admin",
        };

        const res = await register(payload).unwrap();
        const successMsg = res?.message || (typeof res === 'string' ? res : "Registration successful!");
        toast.success(successMsg);

        navigate("/otp-verification", {
          state: {
            emailID: values.email,
            fullName: values.fullName,
            companyName: values.companyName,
            role: payload.role,
          },
        });
      } catch (err) {
        console.error("Signup failed:", err);
        // Extract the most relevant error message
        const extractedMsg =
          err?.data?.message ||
          (typeof err?.data === 'string' ? err.data : "Signup failed") ||
          err?.message ||
          "Signup failed. Please try again.";

        setErrorMsg(extractedMsg);
        setShowError(true);
      }
    },
  });

  return (
    <div className="auth-container-signup">
      <div className="auth-card">
        {/* LEFT SIDE unchanged */}
        {/* LEFT FORM SIDE */}
        <div className="auth-form-side">


          <div className="auth-logo-container">
            <img src="/Images/Benmyl-logo.svg" alt="BenMyl Logo" className="auth-logo-img" />
          </div>

          <h1 className="auth-form-title title-sm">
            The Autonomous <span className="auth-highlight">Talent Platform</span>
          </h1>

          <form onSubmit={formik.handleSubmit} className="auth-form-custom">

            <div className="auth-form-row-custom">
              <div className="auth-form-col-50">
                <input
                  type="text"
                  {...formik.getFieldProps("fullName")}
                  className="auth-input auth-input-custom font-sm"
                  placeholder="Full Name"
                  readOnly={!!invitedFullName}
                />
                {formik.touched.fullName && formik.errors.fullName && (
                  <div className="auth-error-msg auth-error-msg-custom font-xs">{formik.errors.fullName}</div>
                )}
              </div>
              <div className="auth-form-col-50">
                <input
                  type="text"
                  {...formik.getFieldProps("companyName")}
                  className="auth-input auth-input-custom font-sm"
                  placeholder="Company Name"
                  readOnly={!!invitedCompanyName}
                />
                {formik.touched.companyName && formik.errors.companyName && (
                  <div className="auth-error-msg auth-error-msg-custom font-xs">{formik.errors.companyName}</div>
                )}
              </div>
            </div>

            <div className="auth-form-row-custom">
              <div className="auth-form-col-100">
                <input
                  type="email"
                  {...formik.getFieldProps("email")}
                  className="auth-input auth-input-custom font-sm"
                  placeholder="Email Address"
                  readOnly={!!invitedEmail}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="auth-error-msg auth-error-msg-custom">{formik.errors.email}</div>
                )}
              </div>
            </div>

            <div className="auth-form-row-custom">
              <div className="auth-form-col-50">
                <input
                  type={isVisible ? "text" : "password"}
                  {...formik.getFieldProps("password")}
                  className="auth-input auth-input-custom font-sm"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setIsVisible(!isVisible)}
                  className="auth-password-toggle-btn"
                >
                  {isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                {formik.touched.password && formik.errors.password && (
                  <div className="auth-error-msg auth-error-msg-custom">{formik.errors.password}</div>
                )}
              </div>
              <div className="auth-form-col-50">
                <input
                  type={isConfirmVisible ? "text" : "password"}
                  {...formik.getFieldProps("confirmPassword")}
                  className="auth-input auth-input-custom font-sm"
                  placeholder="Confirm password"
                />
                <button
                  type="button"
                  onClick={() => setIsConfirmVisible(!isConfirmVisible)}
                  className="auth-password-toggle-btn"
                >
                  {isConfirmVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <div className="auth-error-msg auth-error-msg-custom">{formik.errors.confirmPassword}</div>
                )}
              </div>
            </div>

            <div className="auth-options-container">
              <label className="auth-checkbox-label font-xs">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formik.values.acceptTerms}
                  onChange={formik.handleChange}
                  className="auth-checkbox-input"
                />
                <span>
                  I agree to the <span className="auth-highlight" onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }}>Terms & Conditions and Cookie Policy</span>
                </span>
              </label>
            </div>
            {formik.touched.acceptTerms && formik.errors.acceptTerms && (
              <div className="auth-error-msg auth-error-msg-custom">{formik.errors.acceptTerms}</div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="auth-submit-btn-custom"
            >
              {isLoading ? "Creating Account..." : "Create Account →"}
            </button>

            <div className="auth-footer-container">
              Already verified on BenMyl workspace?{' '}
              <button
                type="button"
                onClick={() => navigate("/sign-in")}
                className="auth-footer-btn"
              >
                Sign In Instead
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT BRAND SIDE (Replaced) */}
        <div className="auth-brand-side auth-brand-preview-side">

          <div className="auth-preview-header">
            <div className="auth-preview-meta">
              <div className="auth-preview-dot purple-theme"></div>
              BENMYL PREVIEW UNIT
            </div>
            <div className="auth-preview-status-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              Matching Candidates Live
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
                <div className="auth-card-sub">BenMyl Collaboration Hub</div>
              </div>

              <div className="auth-card-feed-header">
                NEURAL PIPELINE FEED
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5b5bd6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              </div>

              <div className="auth-candidate-list">
                {/* Candidate 1 */}
                <div className="auth-candidate-row">
                  <div className="auth-candidate-info">
                    <div className="auth-candidate-avatar bg-primary-purple">AR</div>
                    <div>
                      <div className="auth-candidate-name">Alex Reid</div>
                      <div className="auth-candidate-title">Staffing Lead</div>
                    </div>
                  </div>
                  <div className="auth-candidate-match">
                    <div className="auth-match-bar bar-98-purple"></div>
                    <div className="auth-match-badge badge-match-purple">98.7% MATCH</div>
                  </div>
                </div>

                {/* Candidate 2 */}
                <div className="auth-candidate-row">
                  <div className="auth-candidate-info">
                    <div className="auth-candidate-avatar bg-secondary-purple">MC</div>
                    <div>
                      <div className="auth-candidate-name">Marcus Chen</div>
                      <div className="auth-candidate-title">Solutions Architect</div>
                    </div>
                  </div>
                  <div className="auth-candidate-match">
                    <div className="auth-match-bar bar-sourced"></div>
                    <div className="auth-match-badge badge-sourced">SOURCED</div>
                  </div>
                </div>

                {/* Candidate 3 */}
                <div className="auth-candidate-row">
                  <div className="auth-candidate-info">
                    <div className="auth-candidate-avatar bg-blue">SJ</div>
                    <div>
                      <div className="auth-candidate-name">Sarah Jenkins</div>
                      <div className="auth-candidate-title">Full-Stack Lead</div>
                    </div>
                  </div>
                  <div className="auth-candidate-match">
                    <div className="auth-match-bar bar-interview"></div>
                    <div className="auth-match-badge badge-interview">INTERVIEW</div>
                  </div>
                </div>
              </div>

              <div className="auth-preview-status-card">
                <div className="auth-status-card-header">
                  <div className="auth-status-card-title">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    INTELLIGENT INSIGHTS
                  </div>
                  <div className="auth-status-card-label text-blue">LIVE AI STREAM</div>
                </div>
                <div className="auth-status-card-body">
                  Matched applicant <strong>Alex Reid</strong> to Senior React Specialist position with <strong>98.7%</strong> accuracy index.
                </div>
              </div>

            </div>
          </div>

          <div className="auth-preview-stats-row">
            <div className="auth-preview-stats-box">
              <div className="auth-stats-sub">DAILY MATCH ENGINE</div>
              <div className="auth-stats-val-row">
                <div className="auth-stats-val-main">98.4%</div>
                <div className="auth-stats-val-badge badge-bg">+2.1K</div>
              </div>
            </div>
            <div className="auth-preview-stats-box">
              <div className="auth-stats-sub">ACTIVE JOB GIGS</div>
              <div className="auth-stats-val-row">
                <div className="auth-stats-val-main">24 Live</div>
                <div className="auth-stats-val-badge">+4 today</div>
              </div>
            </div>
            <div className="auth-preview-stats-box">
              <div className="auth-stats-sub">SOURCED PROFILES</div>
              <div className="auth-stats-val-row">
                <div className="auth-stats-val-main">14.2K</div>
                <div className="auth-stats-val-badge">+1.3K today</div>
              </div>
            </div>
          </div>

          <div className="auth-preview-blob-1"></div>
          <div className="auth-preview-blob-2"></div>

        </div>
      </div>

      {/* ERROR MODAL */}
      {showError && (
        <SubmissionErrorModal
          message={errorMsg}
          onClose={() => setShowError(false)}
          onRetry={() => {
            setShowError(false);
            formik.handleSubmit();
          }}
          extraAction={
            errorMsg.toLowerCase().includes("already exists")
              ? {
                label: "Verify OTP",
                onClick: () => {
                  navigate("/otp-verification", {
                    state: {
                      emailID: formik.values.email,
                      fullName: formik.values.fullName,
                      companyName: formik.values.companyName,
                      role: invitedRole || "Admin",
                    },
                  });
                },
              }
              : null
          }
        />
      )}
      
      {/* TERMS MODAL */}
      {showTermsModal && (
        <TermsModal onClose={() => setShowTermsModal(false)} />
      )}
    </div>
  );
}

export default SignUp;
