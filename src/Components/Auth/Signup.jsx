import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
// Adjust this path to where your authApi is located
import { useRegisterMutation } from "../../State-Management/Api/SignupApiSlice";

export default function Signup() {
    const [isVisible, setIsVisible] = useState(false);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showCookieModal, setShowCookieModal] = useState(false);
    const [serverError, setServerError] = useState(null);

    const navigate = useNavigate();
    const [register, { isLoading }] = useRegisterMutation();

    const validationSchema = Yup.object({
        emailID: Yup.string()
            .email("Invalid email address")
            .required("Email is required"),
        password: Yup.string()
            .required("Password is required")
            .min(8, "Password must be at least 8 characters")
            .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
            .matches(/[0-9]/, "Password must contain at least one number"),
        confirmPassword: Yup.string()
            .required("Confirm password is required")
            .oneOf([Yup.ref("password")], "Passwords must match"),
        agreeToTerms: Yup.boolean().oneOf([true], "You must accept the terms and conditions"),
    });

    const formik = useFormik({
        initialValues: {
            emailID: "",
            password: "",
            confirmPassword: "",
            agreeToTerms: false,
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true);
            setServerError(null);

            try {
                const payload = {
                    emailID: values.emailID,
                    password: values.password,
                    // add other fields here if your API expects them
                };

                // call RTK Query mutation and unwrap to throw on error
                const response = await register(payload).unwrap();

                // handle success response (adapt depending on API shape)
                console.log("Signup Response:", response);
                setSubmitSuccess(true);

                // navigate to OTP verification passing email in location state
                navigate("/otp-verification", { state: { emailID: values.emailID } });
            } catch (error) {
                console.error("Signup Error:", error);

                if (error?.data) {
                    // If API returns { message: "..." }
                    if (typeof error.data === "string") {
                        setServerError(error.data);
                    } else if (error.data.message) {
                        setServerError(error.data.message);
                    } else if (error.data.errors) {
                        // example: ASP.NET Identity style validation errors
                        const allErrors = [];
                        for (const key in error.data.errors) {
                            if (Array.isArray(error.data.errors[key])) {
                                allErrors.push(...error.data.errors[key]);
                            } else {
                                allErrors.push(String(error.data.errors[key]));
                            }
                        }
                        setServerError(allErrors.join(" | "));
                    } else {
                        setServerError("Signup failed. Please try again.");
                    }
                } else if (error?.error) {
                    setServerError(error.error);
                } else {
                    setServerError("Signup failed. Please try again.");
                }
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="signup-container">
            <div className="signup-auth-form">
                {/* LEFT SIDE - marketing copy (keep simple) */}
                <div className="signup-left-side">
                    <div className="signup-left-content">
                        <h2 className="signup-heading-white">Create your account</h2>
                        <h2 className="signup-heading-white">and join</h2>
                        <h2 className="signup-heading-green">thousands of recruiters</h2>
                        <h2 className="signup-heading-green">hiring smarter</h2>

                        <p className="signup-quote-text">"Start your AI-powered recruitment journey today."</p>
                    </div>
                </div>

                {/* RIGHT SIDE - form */}
                <div className="signup-right-side">
                    <div className="signup-form-wrapper">
                        <div className="signup-header-container">
                            <img className="signup-logo" src="./Images/Loader-copy.gif" alt="BenMyl Logo" />
                            <h2 className="signup-welcome-title">Sign Up</h2>
                            <span className="signup-signup-text">
                                Already have an account?{' '}
                                <button
                                    type="button"
                                    className="signup-signup-link"
                                    onClick={() => navigate('/sign-in')}
                                >
                                    Sign In
                                </button>
                            </span>
                        </div>

                        <form onSubmit={formik.handleSubmit} noValidate>
                            {/* Email */}
                            <div className="signup-form-group">
                                <label htmlFor="emailID" className="signup-label">Email Id</label>
                                <input
                                    type="email"
                                    id="emailID"
                                    name="emailID"
                                    placeholder="Enter your email"
                                    className="signup-input"
                                    value={formik.values.emailID}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.emailID && formik.errors.emailID && (
                                    <div className="signup-error-text">{formik.errors.emailID}</div>
                                )}
                            </div>

                            {/* Password */}
                            <div className="signup-password-container">
                                <label htmlFor="password" className="signup-label">Password</label>
                                <div className="signup-password-wrapper">
                                    <input
                                        type={isVisible ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        placeholder="Create a password"
                                        className="signup-input"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    <button
                                        type="button"
                                        className="signup-eye-icon"
                                        onClick={() => setIsVisible((s) => !s)}
                                        aria-label={isVisible ? 'Hide password' : 'Show password'}
                                    >
                                        {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                                    </button>
                                </div>
                                {formik.touched.password && formik.errors.password && (
                                    <div className="signup-error-text">{formik.errors.password}</div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="signup-password-container">
                                <label htmlFor="confirmPassword" className="signup-label">Confirm Password</label>
                                <div className="signup-password-wrapper">
                                    <input
                                        type={isConfirmVisible ? 'text' : 'password'}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        placeholder="Re-enter password"
                                        className="signup-input"
                                        value={formik.values.confirmPassword}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    <button
                                        type="button"
                                        className="signup-eye-icon"
                                        onClick={() => setIsConfirmVisible((s) => !s)}
                                        aria-label={isConfirmVisible ? 'Hide confirm password' : 'Show confirm password'}
                                    >
                                        {isConfirmVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                                    </button>
                                </div>
                                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                    <div className="signup-error-text">{formik.errors.confirmPassword}</div>
                                )}
                            </div>

                            {/* Terms Checkbox */}
                            <div className="signup-checkbox-container">
                                <input
                                    type="checkbox"
                                    id="agreeToTerms"
                                    name="agreeToTerms"
                                    className="signup-checkbox"
                                    checked={formik.values.agreeToTerms}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                <label htmlFor="agreeToTerms" className="signup-checkbox-label">
                                    I agree to the{' '}
                                    <button
                                        type="button"
                                        className="signup-link"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setShowTermsModal(true);
                                        }}
                                    >
                                        Terms and Conditions
                                    </button>
                                    {' '}and{' '}
                                    <button
                                        type="button"
                                        className="signup-link"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setShowCookieModal(true);
                                        }}
                                    >
                                        Cookie Policy
                                    </button>
                                </label>
                            </div>

                            {formik.touched.agreeToTerms && formik.errors.agreeToTerms && (
                                <div className="signup-error-text">{formik.errors.agreeToTerms}</div>
                            )}

                            {/* Server error */}
                            {serverError && (
                                <div className="signup-error-text" role="alert" style={{ marginTop: 8 }}>
                                    {serverError}
                                </div>
                            )}

                            {/* Success Alert */}
                            {submitSuccess && (
                                <div className="signup-alert signup-alert-success">
                                    Registration successful! Redirecting to verification…
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={formik.isSubmitting || isLoading}
                                className="signup-submit-button"
                                onMouseOver={(e) => !formik.isSubmitting && (e.currentTarget.style.backgroundColor = "#1565c0")}
                                onMouseOut={(e) => !formik.isSubmitting && (e.currentTarget.style.backgroundColor = "#2744a0")}
                            >
                                {formik.isSubmitting || isLoading ? "Creating Account..." : "Sign Up"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Terms Modal */}
            {showTermsModal && (
                <div className="signup-modal-overlay" onClick={() => setShowTermsModal(false)}>
                    <div className="signup-policy-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="signup-policy-header">
                            <h2 className="signup-policy-title">Terms and Conditions</h2>
                            <button
                                className="signup-close-button"
                                onClick={() => setShowTermsModal(false)}
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="signup-policy-body">
                            {/* (Truncated in the component for brevity) Replace with your real content */}
                            <p>Please review the Terms and Conditions on your platform and update this section as needed.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Cookie Policy Modal */}
            {showCookieModal && (
                <div className="signup-modal-overlay" onClick={() => setShowCookieModal(false)}>
                    <div className="signup-policy-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="signup-policy-header">
                            <h2 className="signup-policy-title">Cookie Policy</h2>
                            <button
                                className="signup-close-button"
                                onClick={() => setShowCookieModal(false)}
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="signup-policy-body">
                            <p>Please review the Cookie Policy on your platform and update this section as needed.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
