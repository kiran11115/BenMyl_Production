import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function SignUp() {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { fullName: "", email: "", password: "" },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
      password: Yup.string().min(8, "Min 8 chars").required("Required"),
    }),
    onSubmit: (values) => navigate("/otp-verify"),
  });

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-brand-side">
           <h2 className="auth-title">Create Account</h2>
            <p className="auth-subtitle">
              Already have an account?{" "}
              <button onClick={() => navigate("/sign-in")} className="auth-link">
                Sign In
              </button>
            </p>
        </div>

        <div className="auth-form-side">
         

          <div className="auth-header">
            {/* LOGO ADDED HERE */}
          <img
            src="/Images/Loader-copy.gif"
            alt="BenMyl Logo"
            className="auth-logo"
          />
          </div>

          <form onSubmit={formik.handleSubmit}>
            <div className="auth-form-group">
              <label className="auth-label">Full Name</label>
              <input
                type="text"
                {...formik.getFieldProps("fullName")}
                className="auth-input"
                placeholder="John Doe"
              />
              {formik.touched.fullName && formik.errors.fullName && (
                <div className="auth-error-msg">{formik.errors.fullName}</div>
              )}
            </div>

            <div className="auth-form-group">
              <label className="auth-label">Email</label>
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

            <div className="auth-form-group">
              <label className="auth-label">Password</label>
              <div className="auth-password-wrapper">
                <input
                  type={isVisible ? "text" : "password"}
                  {...formik.getFieldProps("password")}
                  className="auth-input"
                  placeholder="Create password"
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

            <button  onClick={() => navigate("/OTP-Verifications")} type="submit" className="auth-btn-primary">
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default SignUp;
