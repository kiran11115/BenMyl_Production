import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function Signin() {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    // Validation schema commented out as requested
    /* validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Required"),
      password: Yup.string().required("Required"),
    }), */
    onSubmit: (values) => {
      console.log("Login:", values);
      navigate("/user/user-dashboard");
    },
  });

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-brand-side">
          <div className="auth-brand-title">
            <h2 className="auth-title">Welcome Back</h2>
            <p className="auth-subtitle">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/sign-up")}
                className="auth-link"
              >
                Sign Up
              </button>
            </p>
            
          </div>
        </div>

        <div className="auth-form-side">
          {/* LOGO ADDED HERE */}
          <img
            src="/Images/Loader-copy.gif"
            alt="BenMyl Logo"
            className="auth-logo"
          />

          <div className="auth-header">
            
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
              {/* Validation error display remains but won't trigger without schema */}
              {formik.touched.email && formik.errors.email && (
                <div className="auth-error-msg">{formik.errors.email}</div>
              )}
            </div>

            <div className="auth-form-group">
              <label className="auth-label">Password</label>
              <div className="auth-password-wrapper">
                <input
                  type={isVisible ? "text" : "password"}
                  {...formik.getFieldProps("password")}
                  className="auth-input"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setIsVisible(!isVisible)}
                >
                  {isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <div className="auth-error-msg">{formik.errors.password}</div>
              )}
            </div>

            <button type="submit" className="auth-btn-primary">
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default Signin;
