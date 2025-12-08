import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "./Auth.css";

function ForgotPassword() {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Required"),
    }),
    onSubmit: (values) => console.log("Reset:", values),
  });

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: "600px" }}>
        <div className="auth-form-side" style={{ width: "100%" }}>
          {/* LOGO ADDED HERE */}
          <img
            src="/Images/Loader-copy.gif"
            alt="BenMyl Logo"
            className="auth-logo"
          />

          <button
            onClick={() => navigate("/signin")}
            className="auth-link"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              marginBottom: "1rem",
            }}
          >
            <ArrowLeft size={16} /> Back to Login
          </button>

          <div className="auth-header">
            <h2 className="auth-title">Forgot Password?</h2>
            <p className="auth-subtitle">
              Enter your email to reset your password.
            </p>
          </div>

          <form onSubmit={formik.handleSubmit}>
            <div className="auth-form-group">
              <label className="auth-label">Email Address</label>
              <input
                type="email"
                {...formik.getFieldProps("email")}
                className="auth-input"
                placeholder="name@company.com"
              />
              {formik.touched.email && formik.errors.email && (
                <div className="auth-error-msg">{formik.errors.email}</div>
              )}
            </div>
            <button type="submit" className="auth-btn-primary">
              Send Reset Link
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default ForgotPassword;
