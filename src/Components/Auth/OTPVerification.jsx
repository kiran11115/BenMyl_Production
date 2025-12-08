import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
// Adjust this path to where your RTK slice exports the mutation
import { useOtpVerifyMutation } from "../../State-Management/Api/SignupApiSlice";

function OTPVerification() {
  const navigate = useNavigate();
  const location = useLocation();

  // Accept either state.emailaddress or state.email (handles both signup variants)
  const emailFromState = location.state?.emailID || location.state?.email || "your email";
  // Accept role from location.state if signup passed it, otherwise default to "User"
  const roleFromState = location.state?.role || "Admin";

  const inputRefs = useRef([]);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(60);
  const [serverError, setServerError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // RTK Query mutation
  const [otpVerify, { isLoading: isVerifying }] = useOtpVerifyMutation();

  // Formik with a single 'otp' string
  const formik = useFormik({
    initialValues: { otp: "" },
    validationSchema: Yup.object({
      otp: Yup.string()
        .required("OTP is required")
        .matches(/^\d{6}$/, "Enter a 6-digit numeric code"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      setServerError(null);
      setSuccessMessage(null);

      try {
        const payload = {
          // include role because backend requires it
          emailID: emailFromState,
          code: values.otp,
          role: roleFromState,
        };

        const res = await otpVerify(payload).unwrap();
        console.log("Verification response:", res);
        setSuccessMessage("Verification successful!");

        // navigate to company details after success
        navigate("/company-details");
      } catch (err) {
        console.error("Verification error:", err);

        if (err?.data?.message) {
          setServerError(err.data.message);
        } else if (err?.data?.errors) {
          const firstKey = Object.keys(err.data.errors)[0];
          setServerError(err.data.errors[firstKey][0]);
        } else if (err?.error) {
          setServerError(err.error);
        } else {
          setServerError("Verification failed. Please try again.");
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Timer effect
  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  // Helper: get digit at index from formik.otp
  const getDigit = (index) => formik.values.otp[index] || "";

  // Input change handler (single-digit inputs)
  const handleChange = (index, value) => {
    const val = value.replace(/\D/g, "");
    if (val.length > 1) return;

    const otpArr = formik.values.otp.split("").slice(0, 6);
    while (otpArr.length < 6) otpArr.push("");
    otpArr[index] = val;

    const newOtp = otpArr.join("");
    formik.setFieldValue("otp", newOtp);

    if (val !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Keydown for backspace and arrow navigation
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!getDigit(index) && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else {
        const otpArr = formik.values.otp.split("").slice(0, 6);
        while (otpArr.length < 6) otpArr.push("");
        otpArr[index] = "";
        formik.setFieldValue("otp", otpArr.join(""));
      }
    }

    if (e.key === "ArrowLeft" && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5) inputRefs.current[index + 1]?.focus();
  };

  // Paste support for 6-digit OTP
  const handlePaste = (e) => {
    const pasted = (e.clipboardData || window.clipboardData).getData("text").trim();
    if (/^\d{6}$/.test(pasted)) {
      formik.setFieldValue("otp", pasted);
      inputRefs.current[5]?.focus();
    }
    e.preventDefault();
  };

  const handleResend = () => {
    setIsResending(true);
    setTimer(60);
    formik.setFieldValue("otp", "");
    // replace with real resend API if available
    setTimeout(() => {
      setIsResending(false);
      console.log("OTP resent");
    }, 1000);
  };

  const isOtpComplete = formik.values.otp.length === 6 && /^\d{6}$/.test(formik.values.otp);

  return (
    <div className="otp-container">
      <div className="otp-auth-form">
        {/* LEFT SIDE */}
        <div className="otp-left-side">
          <div className="otp-left-content">
            <h2 className="otp-heading-white">Verify your email</h2>
            <h2 className="otp-heading-white">to complete</h2>
            <h2 className="otp-heading-green">your registration</h2>
            <h2 className="otp-heading-green">securely</h2>

            <h2 className="otp-quote-text">"One step away from AI-powered recruitment."</h2>
          </div>
        </div>

        {/* RIGHT SIDE - OTP FORM */}
        <div className="otp-right-side">
          <div className="otp-form-wrapper">
            <div className="otp-header-container">
              <img className="otp-logo" src="./Images/Loader-copy.gif" alt="BenMyl Logo" />
              <h2 className="otp-title">Verify Your Email</h2>
              <p className="otp-subtitle">
                We've sent a 6-digit OTP to{" "}
                <span className="otp-email-highlight">{emailFromState}</span>. Please enter it below to verify your account.
              </p>
            </div>

            <form onSubmit={formik.handleSubmit} onPaste={handlePaste}>
              <div className="otp-input-container">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <input
                    key={i}
                    ref={(el) => (inputRefs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={getDigit(i)}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className="otp-input"
                    autoFocus={i === 0}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#2744a0";
                      e.target.style.boxShadow = "0 0 0 3px rgba(39, 68, 160, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#d1d5db";
                      e.target.style.boxShadow = "none";
                    }}
                    aria-label={`OTP digit ${i + 1}`}
                  />
                ))}
              </div>

              {/* validation error */}
              {formik.touched.otp && formik.errors.otp && (
                <div className="otp-error-text" style={{ marginTop: 8 }}>
                  {formik.errors.otp}
                </div>
              )}

              {/* server error */}
              {serverError && (
                <div className="otp-error-text" role="alert" style={{ marginTop: 8 }}>
                  {serverError}
                </div>
              )}

              {/* success */}
              {successMessage && (
                <div className="otp-success-text" style={{ marginTop: 8 }}>
                  {successMessage}
                </div>
              )}

              <div className="otp-timer-container">
                {timer > 0 ? (
                  <p className="otp-timer-text">
                    Resend OTP in <span className="otp-timer-number">{timer}s</span>
                  </p>
                ) : (
                  <p className="otp-timer-text">
                    Didn't receive the code?{" "}
                    <a className="otp-resend-link" onClick={handleResend}>
                      {isResending ? "Sending..." : "Resend OTP"}
                    </a>
                  </p>
                )}
              </div>

              <button
                type="submit"
                className={`otp-submit-button ${isOtpComplete ? "otp-submit-active" : "otp-submit-disabled"}`}
                disabled={!isOtpComplete || formik.isSubmitting || isVerifying}
                onMouseOver={(e) => isOtpComplete && (e.currentTarget.style.backgroundColor = "#1565c0")}
                onMouseOut={(e) => isOtpComplete && (e.currentTarget.style.backgroundColor = "#2744a0")}
              >
                {isVerifying || formik.isSubmitting ? "Verifying..." : "Verify OTP"}
              </button>

              <div className="otp-back-link">
                <a className="otp-back-link-text" onClick={() => navigate("/sign-up")}>
                  ← Back to Sign Up
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OTPVerification;
