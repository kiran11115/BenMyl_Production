import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function OTP() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "","",""]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) document.getElementById(`otp-${index + 1}`).focus();
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: "500px" }}>
        <div className="auth-form-side" style={{ width: "100%" }}>
          {/* LOGO ADDED HERE */}
          <img
            src="/Images/Loader-copy.gif"
            alt="BenMyl Logo"
            className="auth-logo"
          />

          <div className="auth-header">
            <h2 className="auth-title">Verify OTP</h2>
            <p className="auth-subtitle">
              Enter the 4-digit code sent to your email.
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
            onClick={() => navigate("/dashboard")}
            className="auth-btn-primary"
          >
            Verify Code
          </button>
        </div>
      </div>
    </div>
  );
}
export default OTP;
