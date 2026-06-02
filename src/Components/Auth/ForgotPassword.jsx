// ForgotPassword.jsx
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
    onSubmit: (values, { setSubmitting }) => {
      console.log("Reset:", values);
      // TODO: call API and show success message
      setTimeout(() => {
        setSubmitting(false);
      }, 1000);
    },
  });

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ height: "100%" }}>
        {/* LEFT FORM SIDE */}
        <div className="auth-form-side" style={{ padding: '2.5rem 3rem' }}>

          <div style={{ marginTop: '-2rem' }}>

          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <img src="/Images/Benmyl-logo.svg" alt="BenMyl Logo" style={{ width: 150, height: 150, objectFit: 'contain' }} />
          </div>
          <button
            type="button"
            onClick={() => navigate("/sign-in")}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', marginBottom: '1.5rem', color: '#64748b', fontSize: '11px', fontWeight: 600, cursor: 'pointer', padding: 0 }}
          >
            <ArrowLeft size={16} /> Back to Sign In
          </button>

          <h1 style={{ fontSize: '30px', fontWeight: 800, color: '#0f172a', lineHeight: 1.1, marginBottom: '1rem' }}>
            Reset Your <span style={{ color: '#f5810c', fontSize: '30px' }}>Password</span>
          </h1>

          <p style={{ color: '#64748b', fontSize: '11px', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '400px' }}>
            Enter the email associated with your account and a reset link will be sent to you.
          </p>

          <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <input
                type="email"
                {...formik.getFieldProps("email")}
                className="auth-input"
                placeholder="Email Address"
                style={{ background: '#f8fafc', padding: '12px', fontSize: '11px', width: '100%', boxSizing: 'border-box' }}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="auth-error-msg" style={{ fontSize: '11px', marginTop: '4px' }}>{formik.errors.email}</div>
              )}
            </div>

            <button
              type="submit"
              disabled={formik.isSubmitting}
              style={{ background: '#f5810c', color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 600, fontSize: '11px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', transition: 'all 0.2s', marginTop: '8px' }}
            >
              {formik.isSubmitting ? "Sending..." : "Send Reset Link →"}
            </button>

          </form>

          <div style={{ textAlign: 'center', marginTop: 'auto', paddingTop: '1.5rem', color: '#94a3b8', fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px' }}>
            <span style={{ color: '#10b981' }}>⬡</span> SECURE PASSWORD RECOVERY
          </div>
        </div>

        {/* RIGHT BRAND SIDE */}
        <div className="auth-brand-side" style={{ background: '#f4f7f9' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2, marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.5px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f5810c' }}></div>
              BENMYL PREVIEW UNIT
            </div>
            <div style={{ background: '#f5810c', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(91, 91, 214, 0.3)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              Workspace Access
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2 }}>
            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '420px', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.02)' }}>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#e2e8f0' }}></div>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#e2e8f0' }}></div>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#e2e8f0' }}></div>
                </div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8' }}>BenMyl Account Security</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '12px', background: '#f3e8ff', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>Bank-Grade Security</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Your data is protected with enterprise encryption.</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '12px', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>Fast Recovery</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Regain access to your workspace in seconds.</div>
                  </div>
                </div>

              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 800, color: '#5b5bd6', display: 'flex', alignItems: 'center', gap: '6px', letterSpacing: '0.5px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    SYSTEM STATUS
                  </div>
                  <div style={{ fontSize: '9px', fontWeight: 700, color: '#10b981', letterSpacing: '0.5px' }}>ALL SYSTEMS OPERATIONAL</div>
                </div>
                <div style={{ fontSize: '11px', color: '#334155', lineHeight: 1.6 }}>
                  Authentication services are running smoothly with <strong>99.99%</strong> uptime over the last 30 days.
                </div>
              </div>

            </div>
          </div>

          <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(91,91,214,0.05) 0%, rgba(244,247,249,0) 70%)', zIndex: 1 }}></div>
          <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, rgba(244,247,249,0) 70%)', zIndex: 1 }}></div>

        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
