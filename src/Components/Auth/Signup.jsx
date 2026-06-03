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
      <div className="auth-card" style={{ height: "50%" }}>
        {/* LEFT SIDE unchanged */}
        {/* LEFT FORM SIDE */}
        <div className="auth-form-side" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '2.5rem 3rem' }}>


          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img src="/Images/Benmyl-logo.svg" alt="BenMyl Logo" style={{ width: 150, height: 150, objectFit: 'contain' }} />
          </div>

          <h1 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', lineHeight: 1.1, marginBottom: '1rem' }}>
            The Autonomous <span style={{ color: '#5a5de8', fontSize: '18px' }}>Talent Platform</span>
          </h1>
          {/* <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', fontSize: '11px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.5px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#5b5bd6' }}>❖</span> COLLABORATIVE HUB STATUS
              </div>
              <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span> ONLINE
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#ffffff', padding: '12px', borderRadius: '8px', marginBottom: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
              <div style={{ width: 32, height: 32, borderRadius: '8px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5b5bd6' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>Human Networks Sync</div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Sourcing & placements running 4.5x faster</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#ffffff', padding: '12px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
              <div style={{ width: 32, height: 32, borderRadius: '8px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5b5bd6' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>Multi-Role Workspace</div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>ClickUp-inspired adaptive agent layouts</div>
              </div>
            </div>
          </div> */}

          <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 calc(50% - 0.5rem)' }}>
                <input
                  type="text"
                  {...formik.getFieldProps("fullName")}
                  className="auth-input"
                  placeholder="Full Name"
                  readOnly={!!invitedFullName}
                  style={{ background: '#f8fafc', padding: '12px', fontSize: '13px' }}
                />
                {formik.touched.fullName && formik.errors.fullName && (
                  <div className="auth-error-msg" style={{ fontSize: '10px', marginTop: '4px' }}>{formik.errors.fullName}</div>
                )}
              </div>
              <div style={{ flex: '1 1 calc(50% - 0.5rem)' }}>
                <input
                  type="text"
                  {...formik.getFieldProps("companyName")}
                  className="auth-input"
                  placeholder="Company Name"
                  readOnly={!!invitedCompanyName}
                  style={{ background: '#f8fafc', padding: '12px', fontSize: '13px' }}
                />
                {formik.touched.companyName && formik.errors.companyName && (
                  <div className="auth-error-msg" style={{ fontSize: '10px', marginTop: '4px' }}>{formik.errors.companyName}</div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 100%' }}>
                <input
                  type="email"
                  {...formik.getFieldProps("email")}
                  className="auth-input"
                  placeholder="Email Address"
                  readOnly={!!invitedEmail}
                  style={{ background: '#f8fafc', padding: '12px', fontSize: '13px' }}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="auth-error-msg" style={{ fontSize: '10px', marginTop: '4px' }}>{formik.errors.email}</div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 calc(50% - 0.5rem)', position: 'relative' }}>
                <input
                  type={isVisible ? "text" : "password"}
                  {...formik.getFieldProps("password")}
                  className="auth-input"
                  placeholder="Password"
                  style={{ background: '#f8fafc', padding: '12px', fontSize: '13px' }}
                />
                <button
                  type="button"
                  onClick={() => setIsVisible(!isVisible)}
                  style={{ position: 'absolute', right: '12px', top: '12px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
                >
                  {isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                {formik.touched.password && formik.errors.password && (
                  <div className="auth-error-msg" style={{ fontSize: '11px', marginTop: '4px' }}>{formik.errors.password}</div>
                )}
              </div>
              <div style={{ flex: '1 1 calc(50% - 0.5rem)', position: 'relative' }}>
                <input
                  type={isConfirmVisible ? "text" : "password"}
                  {...formik.getFieldProps("confirmPassword")}
                  className="auth-input"
                  placeholder="Confirm password"
                  style={{ background: '#f8fafc', padding: '12px', fontSize: '13px' }}
                />
                <button
                  type="button"
                  onClick={() => setIsConfirmVisible(!isConfirmVisible)}
                  style={{ position: 'absolute', right: '12px', top: '12px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
                >
                  {isConfirmVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <div className="auth-error-msg" style={{ fontSize: '11px', marginTop: '4px' }}>{formik.errors.confirmPassword}</div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', padding: '0 4px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', cursor: 'pointer', fontWeight: 500, fontSize:"11px" }}>
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formik.values.acceptTerms}
                  onChange={formik.handleChange}
                  style={{width: 16, height: 16 }}
                />
                <span>
                  I agree to the <span style={{ color: '#5a5de8', textDecoration: 'underline' }} onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }}>Terms & Conditions and Cookie Policy</span>
                </span>
              </label>
            </div>
            {formik.touched.acceptTerms && formik.errors.acceptTerms && (
              <div className="auth-error-msg" style={{ fontSize: '11px', marginTop: '-8px' }}>{formik.errors.acceptTerms}</div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{ background: '#5a5de8', color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 600, fontSize: '14px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', transition: 'all 0.2s', marginTop: '8px' }}
            >
              {isLoading ? "Creating Account..." : "Create Account →"}
            </button>

            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '14px', color: '#94a3b8' }}>
              Already verified on BenMyl workspace?{' '}
              <button
                type="button"
                onClick={() => navigate("/sign-in")}
                style={{ color: '#5a5de8', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, padding: 0, textDecoration: 'none', fontSize: '14px' }}
              >
                Sign In Instead
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT BRAND SIDE (Replaced) */}
        <div className="auth-brand-side" style={{ background: '#f4f7f9', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2, marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.5px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#5b5bd6' }}></div>
              BENMYL PREVIEW UNIT
            </div>
            <div style={{ background: '#5a5de8', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(91, 91, 214, 0.3)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              Matching Candidates Live
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2 }}>
            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '420px', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.02)' }}>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#e2e8f0' }}></div>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#e2e8f0' }}></div>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#e2e8f0' }}></div>
                </div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8' }}>BenMyl Collaboration Hub</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', fontSize: '10px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.5px' }}>
                NEURAL PIPELINE FEED
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5b5bd6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
                {/* Candidate 1 */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#5b5bd6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>AR</div>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#1e293b', marginBottom: '2px' }}>Alex Reid</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>Staffing Lead</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: 40, height: 4, background: '#5b5bd6', borderRadius: '2px' }}></div>
                    <div style={{ fontSize: '10px', fontWeight: 700, background: '#f3e8ff', color: '#5b5bd6', padding: '4px 8px', borderRadius: '4px', letterSpacing: '0.5px' }}>98.7% MATCH</div>
                  </div>
                </div>

                {/* Candidate 2 */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#8b5cf6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>MC</div>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#1e293b', marginBottom: '2px' }}>Marcus Chen</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>Solutions Architect</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: 20, height: 4, background: '#8b5cf6', borderRadius: '2px' }}></div>
                    <div style={{ fontSize: '10px', fontWeight: 700, background: '#f1f5f9', color: '#64748b', padding: '4px 10px', borderRadius: '4px', letterSpacing: '0.5px' }}>SOURCED</div>
                  </div>
                </div>

                {/* Candidate 3 */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>SJ</div>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#1e293b', marginBottom: '2px' }}>Sarah Jenkins</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>Full-Stack Lead</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: 30, height: 4, background: '#3b82f6', borderRadius: '2px' }}></div>
                    <div style={{ fontSize: '10px', fontWeight: 700, background: '#eff6ff', color: '#3b82f6', padding: '4px 10px', borderRadius: '4px', letterSpacing: '0.5px' }}>INTERVIEW</div>
                  </div>
                </div>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 800, color: '#5b5bd6', display: 'flex', alignItems: 'center', gap: '6px', letterSpacing: '0.5px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    INTELLIGENT INSIGHTS
                  </div>
                  <div style={{ fontSize: '9px', fontWeight: 700, color: '#3b82f6', letterSpacing: '0.5px' }}>LIVE AI STREAM</div>
                </div>
                <div style={{ fontSize: '11px', color: '#334155', lineHeight: 1.6 }}>
                  Matched applicant <strong>Alex Reid</strong> to Senior React Specialist position with <strong>98.7%</strong> accuracy index.
                </div>
              </div>

            </div>
          </div>

          <div style={{ zIndex: 2, display: 'flex', gap: '12px', marginTop: '2rem' }}>
            <div style={{ flex: 1, background: '#ffffff', borderRadius: '12px', padding: '14px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '9px', fontWeight: 800, color: '#94a3b8', marginBottom: '6px', letterSpacing: '0.5px' }}>DAILY MATCH ENGINE</div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a' }}>98.4%</div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#10b981', background: '#d1fae5', padding: '2px 6px', borderRadius: '10px' }}>+2.1K</div>
              </div>
            </div>
            <div style={{ flex: 1, background: '#ffffff', borderRadius: '12px', padding: '14px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '9px', fontWeight: 800, color: '#94a3b8', marginBottom: '6px', letterSpacing: '0.5px' }}>ACTIVE JOB GIGS</div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a' }}>24 Live</div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#10b981' }}>+4 today</div>
              </div>
            </div>
            <div style={{ flex: 1, background: '#ffffff', borderRadius: '12px', padding: '14px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '9px', fontWeight: 800, color: '#94a3b8', marginBottom: '6px', letterSpacing: '0.5px' }}>SOURCED PROFILES</div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a' }}>14.2K</div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#10b981' }}>+1.3K today</div>
              </div>
            </div>
          </div>

          <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(91,91,214,0.05) 0%, rgba(244,247,249,0) 70%)', zIndex: 1 }}></div>
          <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, rgba(244,247,249,0) 70%)', zIndex: 1 }}></div>

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
