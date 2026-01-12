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
          role: "Admin",
        }).unwrap();

        if (response?.result_Code !== 200) {
          setOtpErrorMsg(
            response?.result_Message || "Verification code is wrong or expired"
          );
          formik.setFieldValue("otp", ["", "", "", "", "", ""]);
          document.getElementById("otp-0")?.focus();
          return;
        }

        navigate("/User-details", {
          state: {
            emailID,
            fullName: location.state?.fullName,
            companyName: location.state?.companyName,
          },
        });
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
        <div className="auth-brand-side">
          <span className="auth-brand-accent-circle" />
          <div className="auth-brand-title">
            <h2 className="auth-title">Verify your account</h2>
            <p className="auth-subtitle">
              A quick security check so we can keep your workspace safe.
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
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="auth-form-side">
          <img
            src="/Images/Loader-copy.gif"
            alt="BenMyl Logo"
            className="auth-logo"
          />

          <button
            type="button"
            onClick={() => navigate("/sign-up")}
            className="auth-link"
            style={{ display: "flex", gap: "5px", marginBottom: "1rem" }}
          >
            <ArrowLeft size={16} /> Back to Sign Up
          </button>

          <div className="auth-header">
            <h2 className="auth-title">Verify OTP</h2>
            <p className="auth-subtitle">
              Enter the 6-digit code sent to your email.
            </p>

            {timer > 0 ? (
              <p className="auth-tagline">Resend available in {timer}s</p>
            ) : (
              <button
                type="button"
                className="auth-link"
                disabled={resendLoading}
                onClick={handleResend}
              >
                {resendLoading ? "Resending..." : "Resend OTP"}
              </button>
            )}

            {resendMsg && (
              <p className="auth-info-msg" style={{ textAlign: "center" }}>
                {resendMsg}
              </p>
            )}
          </div>

          <form onSubmit={formik.handleSubmit}>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                margin: "2rem 0",
              }}
            >
              {formik.values.otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  className="auth-input auth-otp-input"
                />
              ))}
            </div>

            {formik.errors.otp && (
              <p className="auth-error-msg" style={{ textAlign: "center" }}>
                {formik.errors.otp}
              </p>
            )}

            {otpErrorMsg && (
              <p className="auth-error-msg" style={{ textAlign: "center" }}>
                {otpErrorMsg}
              </p>
            )}

            <button
              type="submit"
              className="auth-btn-primary"
              disabled={!isOtpComplete || isLoading}
            >
              {isLoading ? "Verifying..." : "Verify Code"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default OTPVerification;
