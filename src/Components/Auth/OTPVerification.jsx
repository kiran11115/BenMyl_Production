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
        <div className="auth-form-side" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img src="/Images/Benmyl-logo.svg" alt="BenMyl Logo" style={{ width: 150, height: 150, objectFit: 'contain' }} />
          </div>
          <button
            type="button"
            onClick={() => navigate("/sign-in")}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#64748b', fontSize: '11px', fontWeight: 600, cursor: 'pointer', padding: 0 }}
          >
            <ArrowLeft size={16} /> Back to Sign In
          </button>

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

          <div style={{ marginBottom: '1.5rem' }}>

            <h2 style={{ fontSize: '30px', fontWeight: 800, color: '#1e293b', marginTop: '1rem', marginBottom: '0.5rem' }}>Verify OTP</h2>
            <p style={{ color: '#64748b', fontSize: '11px', lineHeight: 1.5, marginBottom: '0.25rem' }}>
              Enter the 6-digit code sent to your email.
            </p>
            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.5, fontStyle: 'italic', marginBottom: '1rem' }}>
              <strong>Note:</strong> If you do not receive the OTP, please check your Spam/Junk folder.
            </p>

            {timer > 0 ? (
              <p style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>Resend available in {timer}s</p>
            ) : (
              <button
                type="button"
                disabled={resendLoading}
                onClick={handleResend}
                style={{ background: 'none', border: 'none', color: '#5b5bd6', fontSize: '11px', fontWeight: 600, cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
              >
                {resendLoading ? "Resending..." : "Resend OTP"}
              </button>
            )}

            {resendMsg && (
              <p style={{ fontSize: '11px', color: resendMsg.includes("success") ? '#10b981' : '#ef4444', marginTop: '0.5rem', fontWeight: 600 }}>
                {resendMsg}
              </p>
            )}
          </div>

          <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
            <div
              style={{
                display: "flex",
                gap: "clamp(0.3rem, 1.5vw, 0.75rem)",
                justifyContent: "space-between",
                marginBottom: "1rem",
                width: '100%',
              }}
            >
              {formik.values.otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  style={{
                    flex: '1 1 0',
                    minWidth: 0,
                    maxWidth: '3.5rem',
                    height: 'clamp(2.75rem, 8vw, 3.5rem)',
                    textAlign: 'center',
                    fontSize: '11px',
                    fontWeight: 700,
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    color: '#0f172a',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#5b5bd6'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              ))}
            </div>

            {formik.errors.otp && (
              <p style={{ fontSize: '11px', color: '#ef4444', marginTop: '-0.5rem', fontWeight: 500 }}>
                {formik.errors.otp}
              </p>
            )}

            {otpErrorMsg && (
              <p style={{ fontSize: '11px', color: '#ef4444', marginTop: '-0.5rem', fontWeight: 500 }}>
                {otpErrorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={!isOtpComplete || isLoading}
              style={{ background: (!isOtpComplete || isLoading) ? '#94a3b8' : '#f5810c', color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 600, fontSize: '14px', cursor: (!isOtpComplete || isLoading) ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', transition: 'all 0.2s', marginTop: '8px' }}
            >
              {isLoading ? "Verifying..." : "Verify Code →"}
            </button>
          </form>
        </div>

        {/* RIGHT BRAND SIDE */}
        <div className="auth-brand-side" style={{ background: '#f4f7f9', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2, marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.5px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#5b5bd6' }}></div>
              BENMYL PREVIEW UNIT
            </div>
            <div style={{ background: '#5b5bd6', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(91, 91, 214, 0.3)' }}>
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
    </div>
  );
}

export default OTPVerification;
