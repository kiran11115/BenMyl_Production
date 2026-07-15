// Signin.jsx
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMasterLoginMutation, useSigninMutation } from "../../State-Management/Api/SigninApiSlice";
import { SubmissionErrorModal } from "./SigninAlert";
import "./Auth.css";

function Signin() {
  const [isVisible, setIsVisible] = useState(false);
  const [showError, setShowError] = useState(false);
  const [loginErrorMsg, setLoginErrorMsg] = useState("");

  const navigate = useNavigate();
  const [signin, { isLoading }] = useSigninMutation();
  const [masterLogin] = useMasterLoginMutation();

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

        if (values.email === "master@benmyl.com") {
  const masterResponse = await masterLogin({
    emailID: values.email,
    password: values.password,
  }).unwrap();

  console.log("MASTER LOGIN", masterResponse);

  if (masterResponse) {
    localStorage.setItem("Email", masterResponse.emailId);
    localStorage.setItem("Role", masterResponse.roleName);
    localStorage.setItem("UserName", masterResponse.fullName);

    navigate("/MasterAdmin/dashboard");
    return;
  }
}

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
          localStorage.setItem("AvailableTokens", response?.companyAvailableTokens);
          localStorage.setItem("TotalTokens", response?.companyTotalTokens);
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

        {/* LEFT FORM SIDE */}
        <div className="auth-form-side">

          <div className="auth-logo-container">
            <img src="/Images/Benmyl-logo.svg" alt="BenMyl Logo" className="auth-logo-img" />
          </div>

          <h1 className="auth-form-title title-md">
            Sign In to BenMyl.
          </h1>

          <p className="auth-form-subtitle">
            The Autonomous <span className="auth-highlight">Talent Platform</span>
          </p>

          <form onSubmit={formik.handleSubmit} className="auth-form-custom">
            <div className="auth-form-custom">
              <div className="auth-form-col-100">
                <input
                  type="email"
                  {...formik.getFieldProps("email")}
                  className="auth-input auth-input-custom"
                  placeholder="Email Address"
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="auth-error-msg auth-error-msg-custom">{formik.errors.email}</div>
                )}
              </div>
              <div className="auth-form-col-100">
                <input
                  type={isVisible ? "text" : "password"}
                  {...formik.getFieldProps("password")}
                  className="auth-input auth-input-custom"
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
            </div>

            <div className="auth-options-container">
              <label className="auth-checkbox-label">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formik.values.rememberMe}
                  onChange={formik.handleChange}
                  className="auth-checkbox-input"
                />
                Remember Me
              </label>
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="auth-forgot-link"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={formik.isSubmitting || isLoading}
              className="auth-submit-btn-custom"
            >
              {isLoading ? "Signing In..." : "Sign In →"}
            </button>
          </form>

           <div className="auth-footer-container">
              Want to Join a BenMyl workspace?{' '}
              <button
                type="button"
                onClick={() => navigate("/sign-up")}
                className="auth-footer-btn"
              >
                Create Account
              </button>
            </div>
        </div>

        {/* RIGHT BRAND SIDE (Replaced) */}
        <div className="auth-brand-side auth-brand-preview-side">

          <div className="auth-preview-header">
            <div className="auth-preview-meta">
              <div className="auth-preview-dot"></div>
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
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5a5de8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
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
                    <div className="auth-match-bar bar-98"></div>
                    <div className="auth-match-badge badge-match">98.7% MATCH</div>
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
