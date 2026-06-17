// OTPVerification.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import { ArrowLeft } from "lucide-react";
import {
  useOtpVerifyMutation,
  useResendOtpMutation,
} from "../../State-Management/Api/SignupApiSlice";
import "./Auth.css";

function OTPVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const emailID = location.state?.emailID;
  const role = location.state?.role;
  console.log("Role:", role);

  const [timer, setTimer] = useState(60);
  const [otpErrorMsg, setOtpErrorMsg] = useState("");
  const [resendMsg, setResendMsg] = useState("");

  const [otpVerify, { isLoading }] = useOtpVerifyMutation();
  const [resendOtp, { isLoading: resendLoading }] = useResendOtpMutation();

  /* =========================
     TIMER LOGIC
  ========================= */
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  /* =========================
     FORMIK
  ========================= */
  const formik = useFormik({
    initialValues: {
      otp: ["", "", "", "", "", ""],
    },
    validate: (values) => {
      const errors = {};
      if (values.otp.join("").length !== 6) {
        errors.otp = "Enter all 6 digits";
      }
      return errors;
    },
    onSubmit: async (values) => {
      setOtpErrorMsg("");

      const otpValue = values.otp.join("");

      try {
        const response = await otpVerify({
          emailID,
          vcode: Number(otpValue),
          role,
        }).unwrap();

        if (response?.result_Code !== 200) {
          setOtpErrorMsg(
            response?.result_Message || "Verification code is wrong or expired"
          );
          formik.setFieldValue("otp", ["", "", "", "", "", ""]);
          document.getElementById("otp-0")?.focus();
          return;
        }

        if (role === "Recruiter" || role === "Benchsales" || role === "Recruiter2") {
          navigate("/sign-in");
        } else {
          navigate("/User-details", {
            state: {
              emailID,
              fullName: location.state?.fullName,
              companyName: location.state?.companyName,
            },
          });
        }

      } catch (err) {
        console.error("OTP verification failed:", err);
        setOtpErrorMsg("Something went wrong. Please try again.");
      }
    },
  });

  const isOtpComplete = formik.values.otp.every((d) => d !== "");

  /* =========================
     OTP INPUT HANDLER
  ========================= */
  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...formik.values.otp];
    newOtp[index] = value;
    formik.setFieldValue("otp", newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  /* =========================
     RESEND OTP
  ========================= */
  const handleResend = async () => {
    if (timer > 0) return;

    setResendMsg("");
    setOtpErrorMsg("");

    try {
      // IMPORTANT: backend expects string EmailID only
      const response = await resendOtp(emailID).unwrap();

      if (response?.result_Code !== 200) {
        setResendMsg(response?.result_Message || "Failed to resend OTP");
        return;
      }

      setResendMsg("OTP sent successfully!");
      setTimer(60);
    } catch (err) {
      console.error("Resend OTP failed:", err);
      setResendMsg("Something went wrong, try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* LEFT SIDE */}
        {/* LEFT FORM SIDE */}
        <div className="auth-form-side">

          <div className="auth-logo-container-large">
            <img src="/Images/Benmyl-logo.svg" alt="BenMyl Logo" className="auth-logo-img-large" />
          </div>
          <button
            type="button"
            onClick={() => navigate("/sign-in")}
            className="auth-back-btn no-margin"
          >
            <ArrowLeft size={16} /> Back to Sign In
          </button>

          <div className="auth-otp-info-block">

            <h2 className="auth-form-title title-lg">Verify OTP</h2>
            <p className="auth-form-subtitle subtitle-sm">
              Enter the 6-digit code sent to your email.
            </p>
            <p className="auth-form-subtitle subtitle-lg">
              <strong>Note:</strong> If you do not receive the OTP, please check your Spam/Junk folder.
            </p>

            {timer > 0 ? (
              <p className="auth-otp-timer-text">Resend available in {timer}s</p>
            ) : (
              <button
                type="button"
                disabled={resendLoading}
                onClick={handleResend}
                className="auth-otp-resend-btn"
              >
                {resendLoading ? "Resending..." : "Resend OTP"}
              </button>
            )}

            {resendMsg && (
              <p className={`auth-otp-resend-status ${resendMsg.includes("success") ? 'success' : 'error'}`}>
                {resendMsg}
              </p>
            )}
          </div>

          <form onSubmit={formik.handleSubmit} className="auth-form-custom">
            <div className="auth-otp-inputs-wrapper">
              {formik.values.otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  className="auth-otp-input-box"
                />
              ))}
            </div>

            {formik.errors.otp && (
              <p className="auth-error-msg-custom">
                {formik.errors.otp}
              </p>
            )}

            {otpErrorMsg && (
              <p className="auth-error-msg-custom">
                {otpErrorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={!isOtpComplete || isLoading}
              className="auth-submit-btn-custom"
            >
              {isLoading ? "Verifying..." : "Verify Code →"}
            </button>
          </form>
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
    </div>
  );
}

export default OTPVerification;
