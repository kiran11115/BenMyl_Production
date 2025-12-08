import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Signin() {
  const [isVisible, setIsVisible] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is a required field")
        .matches(
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          "Invalid Email"
        ),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: (values, { setSubmitting }) => {
      console.log("Form submitted with values:", values);

      // Replace this with real API call
      setTimeout(() => {
        // Example: set error or success based on API response
        const isOk = true;

        if (isOk) {
          setSubmitSuccess(true);
          setSubmitError(false);
          navigate("/dashboard");
        } else {
          setSubmitSuccess(false);
          setSubmitError(true);
        }

        setSubmitting(false);
      }, 1000);
    },
  });

  const handleSocialLogin = (provider) => {
    console.log(`Logging in with ${provider}`);
  };

  const GoogleIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );

  const LinkedInIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="#0A66C2">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );

  const MicrosoftIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <path fill="#f25022" d="M1 1h10v10H1z" />
      <path fill="#00a4ef" d="M13 1h10v10H13z" />
      <path fill="#7fba00" d="M1 13h10v10H1z" />
      <path fill="#ffb900" d="M13 13h10v10H13z" />
    </svg>
  );

  return (
    <div className="signin-container">
      <div className="signin-auth-form">
        {/* LEFT SIDE */}
        <div className="signin-left-side">
          <div className="signin-left-content">
            <h2 className="signin-heading-white">Log in to power your</h2>
            <h2 className="signin-heading-white">bench</h2>
            <h2 className="signin-heading-green">with AI-driven staffing</h2>
            <h2 className="signin-heading-green">intelligence</h2>

            <p className="signin-quote-text">"AI-matched resources in minutes."</p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="signin-right-side">
          <div className="signin-form-wrapper">
            <div className="signin-header-container">
              <img
                className="signin-logo"
                src="/Images/Loader-copy.gif"
                alt="BenMyl Logo"
              />
              <h2 className="signin-welcome-title">Welcome</h2>
              <span className="signin-signup-text">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/sign-up")}
                  className="signin-signup-link"
                >
                  Sign Up
                </button>
              </span>
            </div>

            <form onSubmit={formik.handleSubmit}>
              {/* EMAIL */}
              <div className="signin-form-group">
                <label htmlFor="email" className="signin-label">
                  Email Id
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  className="signin-input"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="signin-error-text">{formik.errors.email}</div>
                )}
              </div>

              {/* PASSWORD */}
              <div className="signin-password-container">
                <label htmlFor="password" className="signin-label">
                  Password
                </label>
                <div className="signin-password-wrapper">
                  <input
                    type={isVisible ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Password"
                    className="signin-input"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <button
                    type="button"
                    className="signin-eye-icon"
                    onClick={() => setIsVisible((prev) => !prev)}
                  >
                    {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <div className="signin-error-text">
                    {formik.errors.password}
                  </div>
                )}
              </div>

              {/* ALERTS */}
              {submitSuccess && (
                <div className="signin-alert signin-alert-success">
                  Login successful!
                </div>
              )}
              {submitError && (
                <div className="signin-alert signin-alert-error">
                  Incorrect email or password
                </div>
              )}

              {/* REMEMBER & FORGOT */}
              <div className="signin-remember-container">
                <div className="signin-checkbox-container">
                  <input
                    type="checkbox"
                    id="rememberCheck"
                    className="signin-checkbox"
                  />
                  <label
                    htmlFor="rememberCheck"
                    className="signin-checkbox-label"
                  >
                    Remember Me
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="signin-forgot-link"
                >
                  Forgot Password?
                </button>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="signin-submit-button"
              >
                {formik.isSubmitting ? "Signing In..." : "Sign In"}
              </button>
            </form>

            {/* DIVIDER */}
            <div className="signin-divider-container">
              <div className="signin-divider-line" />
              <span className="signin-divider-text">Or continue with</span>
              <div className="signin-divider-line" />
            </div>

            {/* SOCIAL BUTTONS */}
            <div className="signin-social-buttons-container">
              <button
                type="button"
                className="signin-social-button"
                onClick={() => handleSocialLogin("Google")}
              >
                <GoogleIcon />
              </button>

              <button
                type="button"
                className="signin-social-button"
                onClick={() => handleSocialLogin("LinkedIn")}
              >
                <LinkedInIcon />
              </button>

              <button
                type="button"
                className="signin-social-button"
                onClick={() => handleSocialLogin("Microsoft")}
              >
                <MicrosoftIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signin;
