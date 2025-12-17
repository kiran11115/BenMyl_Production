// OTP.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "./Auth.css";

function OTP() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // move to next input if value entered
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      if (next) next.focus();
    }
  };

  const isOtpComplete = otp.every((d) => d !== "");

  const handleVerify = () => {
    if (!isOtpComplete) return;
    const otpValue = otp.join("");
    console.log("Verify OTP:", otpValue);
    // TODO: call API with otpValue here
    navigate("/User-details");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* LEFT: same testimonial panel for consistency */}
        <div className="auth-brand-side">
          <span className="auth-brand-accent-circle" />

          <div className="auth-brand-title">
            <h2 className="auth-title">Verify your account</h2>
            <p className="auth-subtitle">
              A quick security check so we can keep your workspace safe.
            </p>

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
                “Multi‑step verification helps us onboard teams securely without
                slowing anyone down.”
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
        </div>

        {/* RIGHT: OTP form */}
        <div className="auth-form-side">
          <img
            src="/Images/Loader-copy.gif"
            alt="BenMyl Logo"
            className="auth-logo"
          />

          {/* Back link same pattern as ForgotPassword / Signin */}
          <button
            type="button"
            onClick={() => navigate("/sign-up")}
            className="auth-link"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              marginBottom: "1rem",
            }}
          >
            <ArrowLeft size={16} /> Back to Sign Up
          </button>

          <div className="auth-header">
            <h2 className="auth-title">Verify OTP</h2>
            <p className="auth-subtitle">
              Enter the 6‑digit code sent to your email.
            </p>
            <p className="auth-tagline">
              For your security, this code expires in a few minutes.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              margin: "2rem 0",
            }}
          >
            {otp.map((digit, index) => (
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

          <button
            onClick={handleVerify}
            className="auth-btn-primary"
            disabled={!isOtpComplete}
          >
            Verify Code
          </button>
        </div>
      </div>
    </div>
  );
}

export default OTP;
