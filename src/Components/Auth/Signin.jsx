// Signin.jsx
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
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
          localStorage.setItem("Role", response?.roleID);
          localStorage.setItem("adminFirstName", response?.adminFirstName);
          localStorage.setItem("Industry", response?.industry);
          localStorage.setItem("RemainingDays", response?.remainingDays);
          localStorage.removeItem("trialPopoverHidden");
          const role = response?.roleID;

          if (formik.values.rememberMe) {
            localStorage.setItem("rememberedEmail", formik.values.email);
            localStorage.setItem("rememberedPassword", formik.values.password);
            localStorage.setItem("rememberMe", "true");
          } else {
            localStorage.removeItem("rememberedEmail");
            localStorage.removeItem("rememberedPassword");
            localStorage.setItem("rememberMe", "false");
          }

          if (role === "Admin") {
            navigate("/Admin/overview-dashboard");
            return;
          }

          if (role === "Recruiter") {
            navigate("/user/user-dashboard");
            return;
          }

          if (role === "Benchsales") {
            navigate("/user/user-dashboard");
            return;
          }

          if (role === "Recruiter2") {
            navigate("/user/user-dashboard");
            return;
          }

        }

        // ERROR IF isvalid is false
        setLoginErrorMsg(response?.result_Message || "Incorrect Email or Password");
        setShowError(true);

      } catch (err) {
        console.error("Login failed:", err);
        setLoginErrorMsg(err?.data?.result_Message || "Incorrect Email or Password");
        setShowError(true);
      } finally {
        setSubmitting(false);
      }
    }

  });

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedPassword = localStorage.getItem("rememberedPassword");
    const remember = localStorage.getItem("rememberMe") === "true";

    if (remember && savedEmail && savedPassword) {
      formik.setValues({
        email: savedEmail,
        password: savedPassword,
        rememberMe: true,
      });
    }
  }, []);




  return (
    <div className="auth-container">
      <div className="auth-card">
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <div className="auth-container">
        <div className="auth-card" style={{ height: "100%" }}>

        {/* LEFT FORM SIDE */}
        <div className="auth-form-side" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '2.5rem 3rem' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '20px', paddingTop: '20px' }}>
            <img src="/Images/Benmyl-logo.svg" alt="BenMyl Logo" style={{ width: 150, objectFit: 'contain' }} />
          </div>
          {/* LEFT FORM SIDE */}
          <div className="auth-form-side" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2.5rem 3rem', marginRight: '2rem' }}>
            <div style={{ width: '100%', maxWidth: '400px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', marginTop: '-1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img src="/Images/Benmyl-logo.svg" alt="BenMyl Logo" style={{ height: 40, objectFit: 'contain', marginLeft: '-12px' }} />
                </div>
                <div style={{ color: '#5b5bd6', fontSize: '10px', fontWeight: 700, background: '#f3e8ff', padding: '4px 8px', borderRadius: '12px', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                  SECURE GATE
                </div>
              </div>

          <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', lineHeight: 1.1, marginBottom: '1rem' }}>
            The Autonomous <span style={{ color: '#5b5bd6' }}>Talent Platform</span>
          </h1>
              <h1 style={{ fontSize: '30px', fontWeight: 800, color: '#0f172a', lineHeight: 1.1, marginBottom: '0.75rem' }}>
                Sign In to <span style={{ color: '#f5810c' }}>BenMyl</span>
              </h1>

          <p style={{ color: '#64748b', fontSize: '12px', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '400px' }}>
            Unite high-speed neural candidate screenings with premium collaborative sourcing desks. Designed for elite recruiters, sales squads, and enterprise staffing partners.
          </p>


          <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 calc(50% - 0.5rem)' }}>
                <input
                  type="email"
                  {...formik.getFieldProps("email")}
                  className="auth-input"
                  placeholder="Email Address"
                  style={{ background: '#f8fafc', padding: '12px', fontSize: '14px' }}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="auth-error-msg" style={{ fontSize: '11px', marginTop: '4px' }}>{formik.errors.email}</div>
                )}
              </div>
              <div style={{ flex: '1 1 calc(50% - 0.5rem)', position: 'relative' }}>
                <input
                  type={isVisible ? "text" : "password"}
                  {...formik.getFieldProps("password")}
                  className="auth-input"
                  placeholder="Password"
                  style={{ background: '#f8fafc', padding: '12px', fontSize: '14px' }}
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
            </div>
              <p style={{ color: '#64748b', fontSize: '11px', lineHeight: 1.6, marginBottom: '2rem' }}>
                Enter your credentials to securely access your BenMyl node workspace.
              </p>

              <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1rem' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex', alignItems: 'center' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  </div>
                  <input
                    type="email"
                    {...formik.getFieldProps("email")}
                    className="auth-input"
                    placeholder="admin@benmyl.ai"
                    style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '12px 12px 12px 40px', fontSize: '11px', borderRadius: '8px', width: '100%', boxSizing: 'border-box' }}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="auth-error-msg" style={{ fontSize: '11px', marginTop: '4px' }}>{formik.errors.email}</div>
                  )}
                </div>

                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex', alignItems: 'center' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  </div>
                  <input
                    type={isVisible ? "text" : "password"}
                    {...formik.getFieldProps("password")}
                    className="auth-input"
                    placeholder="••••••••••••••••••••"
                    style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '12px 40px 12px 40px', fontSize: '11px', borderRadius: '8px', width: '100%', boxSizing: 'border-box', letterSpacing: isVisible ? 'normal' : '2px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setIsVisible(!isVisible)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                  >
                    {isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  {formik.touched.password && formik.errors.password && (
                    <div className="auth-error-msg" style={{ fontSize: '11px', marginTop: '4px' }}>{formik.errors.password}</div>
                  )}
                </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', padding: '0 4px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', cursor: 'pointer', fontWeight: 500, fontSize: '11px' }}>
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formik.values.rememberMe}
                  onChange={formik.handleChange}
                  style={{ accentColor: '#5b5bd6', width: 16, height: 16 }}
                />
                Remember Me
              </label>
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                style={{ color: '#5b5bd6', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, padding: 0, fontSize: '11px' }}
              >
                Forgot Password?
              </button>
            </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', padding: '0 4px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', cursor: 'pointer', fontWeight: 500, fontSize: '14px' }}>
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formik.values.rememberMe}
                      onChange={formik.handleChange}
                      style={{ accentColor: '#f5810c', width: 12, height: 12, cursor: 'pointer' }}
                    />
                    Keep me signed in
                  </label>
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    style={{ color: '#f5810c', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '14px' }}
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={formik.isSubmitting || isLoading}
                  style={{ background: '#f5810c', color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 600, fontSize: '14px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', transition: 'all 0.2s', marginTop: '8px', width: '100%' }}
                >
                  {isLoading ? "Signing In..." : "Sign In →"}
                </button>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '14px', color: '#94a3b8' }}>
                  New enterprise node partner?{' '}
                  <button
                    type="button"
                    onClick={() => navigate("/sign-up")}
                    style={{ color: '#f5810c', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, padding: 0, textDecoration: 'none', fontSize: '14px' }}
                  >
                    Create an Account
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* RIGHT BRAND SIDE (Replaced) */}
          <div className="auth-brand-side" style={{ background: '#f4f7f9' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2, marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.5px' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#5b5bd6' }}></div>
                BENMYL PREVIEW UNIT
              </div>
              <div style={{ background: '#f5810c', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(91, 91, 214, 0.3)' }}>
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
                      <div style={{ fontSize: '11px', fontWeight: 700, background: '#f3e8ff', color: '#5b5bd6', padding: '4px 8px', borderRadius: '4px', letterSpacing: '0.5px' }}>98.7% MATCH</div>
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
                      <div style={{ fontSize: '11px', fontWeight: 700, background: '#f1f5f9', color: '#64748b', padding: '4px 10px', borderRadius: '4px', letterSpacing: '0.5px' }}>SOURCED</div>
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
