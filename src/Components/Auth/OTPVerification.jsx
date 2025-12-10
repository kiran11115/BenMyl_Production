import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    // TODO: call API with otpValue here
    navigate("/User-details");
  };

  const handleBackToSignUp = () => {
    navigate("/Sign-up"); // adjust path to your signup route
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: "500px" }}>
        <div className="auth-form-side" style={{ width: "100%" }}>
          <img
            src="/Images/Loader-copy.gif"
            alt="BenMyl Logo"
            className="auth-logo"
          />

          <div className="auth-header">
            <h2 className="auth-title">Verify OTP</h2>
            <p className="auth-subtitle">
              Enter the 6-digit code sent to your email.
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
                className="auth-input"
                style={{
                  width: "60px",
                  height: "60px",
                  textAlign: "center",
                  fontSize: "1.5rem",
                }}
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

          <button
            type="button"
            onClick={handleBackToSignUp}
            className="auth-btn-secondary"
            style={{ marginTop: "1rem" }}
          >
            Back to Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default OTP;
