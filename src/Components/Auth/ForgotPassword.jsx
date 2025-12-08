import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";



function ForgotPassword() {
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);
    const navigate = useNavigate();


    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
        };


        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    const formik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Invalid email address")
                .required("Email is required")
                .matches(
                    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    "Invalid Email"
                ),
        }),
        onSubmit: (values, { setSubmitting }) => {
            console.log("Reset password email sent to:", values.email);
            
            setTimeout(() => {
                setSubmitSuccess(true);
                setSubmitting(false);
                setShowModal(true);
            }, 1000);
        },
    });


    const handleModalClose = () => {
        setShowModal(false);
        navigate("/sign-in");
    };


    const CompanyIcon = ({ name, color }) => {
        const svgStyle = { transition: 'all 0.3s ease' };
        const size = isMobile ? "20" : "24";


        switch(name) {
            case 'ByteBlaze':
                return (
                    <svg width={size} height={size} viewBox="0 0 32 32" style={svgStyle}>
                        <path d="M16 4 L28 16 L16 28 L4 16 Z" fill={color}/>
                        <circle cx="16" cy="16" r="6" fill="white"/>
                    </svg>
                );
            case 'NexaCore':
                return (
                    <svg width={size} height={size} viewBox="0 0 32 32" style={svgStyle}>
                        <rect x="8" y="8" width="16" height="16" fill="none" stroke={color} strokeWidth="2.5"/>
                        <circle cx="16" cy="16" r="5" fill={color}/>
                    </svg>
                );
            case 'PulsePixels':
                return (
                    <svg width={size} height={size} viewBox="0 0 32 32" style={svgStyle}>
                        <path d="M4 16 L10 8 L16 20 L22 12 L28 16" stroke={color} strokeWidth="2.5" fill="none"/>
                    </svg>
                );
            case 'TechNebula':
                return (
                    <svg width={size} height={size} viewBox="0 0 32 32" style={svgStyle}>
                        <circle cx="16" cy="16" r="10" fill={color} opacity="0.5"/>
                        <circle cx="16" cy="16" r="6" fill={color} opacity="0.8"/>
                        <circle cx="16" cy="16" r="3" fill={color}/>
                    </svg>
                );
            case 'DataDynamo':
                return (
                    <svg width={size} height={size} viewBox="0 0 32 32" style={svgStyle}>
                        <polygon points="16,4 26,12 26,20 16,28 6,20 6,12" fill={color} opacity="0.7"/>
                        <polygon points="16,10 20,13 20,19 16,22 12,19 12,13" fill={color}/>
                    </svg>
                );
            case 'SparkSphere':
                return (
                    <svg width={size} height={size} viewBox="0 0 32 32" style={svgStyle}>
                        <circle cx="16" cy="16" r="12" fill="none" stroke={color} strokeWidth="2"/>
                        <path d="M16 8 L18 14 L24 16 L18 18 L16 24 L14 18 L8 16 L14 14 Z" fill={color}/>
                    </svg>
                );
            default:
                return null;
        }
    };


    const clients = [
        { name: 'ByteBlaze', color: '#8B5CF6' },
        { name: 'NexaCore', color: '#3B82F6' },
        { name: 'PulsePixels', color: '#10B981' },
        { name: 'TechNebula', color: '#F59E0B' },
        { name: 'DataDynamo', color: '#EF4444' },
        { name: 'SparkSphere', color: '#06B6D4' },
    ];


    return (
        <>
            <div className="forgot-container">
                <div className="forgot-auth-form">
                    {/* LEFT SIDE */}
                    <div className="forgot-left-side">
                        <div className="forgot-left-content">
                            <h2 className="forgot-heading-white">Forgot your</h2>
                            <h2 className="forgot-heading-white">password?</h2>
                            <h2 className="forgot-heading-green">No worries, we'll</h2>
                            <h2 className="forgot-heading-green">help you reset it</h2>
                            
                            <h2 className="forgot-quote-text">
                                "Get back to hiring in just a few clicks."
                            </h2>
                        </div>


                        <div className="forgot-trusted-section">
                            <p className="forgot-trusted-title">Trusted By Leading Companies</p>
                            <div className="forgot-companies-grid">
                                {clients.map((client, index) => (
                                    <div
                                        key={index}
                                        className="forgot-company-item"
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.transform = 'scale(1.05)';
                                            const span = e.currentTarget.querySelector('span');
                                            if (span) span.style.color = client.color;
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.transform = 'scale(1)';
                                            const span = e.currentTarget.querySelector('span');
                                            if (span) span.style.color = '#374151';
                                        }}
                                    >
                                        <div className="forgot-icon-wrapper">
                                            <CompanyIcon name={client.name} color={client.color} />
                                        </div>
                                        <span className="forgot-company-name">{client.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>


                    {/* RIGHT SIDE */}
                    <div className="forgot-right-side">
                        <div className="forgot-form-wrapper">
                            <div className="forgot-header-container">
                                <img className="forgot-logo" src="./Images/Benmyl-logo.svg" alt="BenMyl Logo" />
                                <h2 className="forgot-welcome-title">Forgot Password?</h2>
                                <p className="forgot-subtitle">
                                    Enter your email address and we'll send you a link to reset your password
                                </p>
                            </div>


                            <form onSubmit={formik.handleSubmit}>
                                <div className="forgot-form-group">
                                    <label htmlFor="email" className="forgot-label">
                                        Email Id
                                    </label>
                                    <div className="forgot-input-wrapper">
                                        <Mail size={18} className="forgot-mail-icon" />
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            placeholder="Enter your email"
                                            className="forgot-input"
                                            value={formik.values.email}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                    </div>
                                    {formik.touched.email && formik.errors.email && (
                                        <div className="forgot-error-text">{formik.errors.email}</div>
                                    )}
                                </div>


                                {submitSuccess && (
                                    <div className="forgot-alert forgot-alert-success">
                                        Reset link sent! Check your email inbox.
                                    </div>
                                )}


                                <button
                                    onClick={() => navigate('/OTP-Verification')}
                                    type="submit"
                                    disabled={formik.isSubmitting}
                                    className="forgot-submit-button"
                                    onMouseOver={(e) => !formik.isSubmitting && (e.target.style.backgroundColor = "#1565c0")}
                                    onMouseOut={(e) => !formik.isSubmitting && (e.target.style.backgroundColor = "#2744A0")}
                                >
                                    {formik.isSubmitting ? "Sending..." : "Send Reset Link"}
                                </button>


                                <div className="forgot-back-link">
                                    <a className="forgot-back-link-text" onClick={() => navigate('/sign-in')}>
                                        ← Back to Sign In
                                    </a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>


                {/* {showModal && (
                    <div className="forgot-modal-overlay" onClick={handleModalClose}>
                        <div className="forgot-modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="forgot-modal-icon">
                                <span className="forgot-checkmark">✓</span>
                            </div>
                            <h2 className="forgot-modal-title">Email Sent!</h2>
                            <p className="forgot-modal-message">
                                We've sent a password reset link to <strong>{formik.values.email}</strong>. Please check your inbox and follow the instructions.
                            </p>
                            <button 
                                className="forgot-modal-button"
                                onClick={handleModalClose}
                                onMouseOver={(e) => e.target.style.backgroundColor = "#1565c0"}
                                onMouseOut={(e) => e.target.style.backgroundColor = "#2744A0"}
                            >
                                Back to Sign In
                            </button>
                        </div>
                    </div>
                )} */}
            </div>
        </>
    );
}


export default ForgotPassword;
