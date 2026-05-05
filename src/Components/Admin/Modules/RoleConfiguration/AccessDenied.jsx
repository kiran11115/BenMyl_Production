import React from 'react';
import { ShieldAlert, ArrowLeft, Lock, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AccessDenied = ({ module = "this feature", action = "view" }) => {
    const navigate = useNavigate();

    return (
        <div style={{
            height: '100vh',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8fafc',
            fontFamily: "'Inter', sans-serif",
            padding: '20px'
        }}>
            <div style={{
                maxWidth: '500px',
                width: '100%',
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                padding: '40px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                textAlign: 'center',
                border: '1px solid #e2e8f0'
            }}>
                {/* Icon Circle */}
                <div style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: '#fef2f2',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                    border: '4px solid #fff1f2'
                }}>
                    <Lock size={36} color="#ef4444" />
                </div>

                {/* Title */}
                <h1 style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#0f172a',
                    marginBottom: '12px',
                    letterSpacing: '-0.025em'
                }}>
                    Access Restricted
                </h1>

                {/* Description */}
                <p style={{
                    fontSize: '16px',
                    color: '#64748b',
                    lineHeight: '1.6',
                    marginBottom: '32px'
                }}>
                    You don't have the necessary permissions to {action} the <strong>{module}</strong> module. 
                    Please contact your system administrator to request access.
                </p>

                {/* Buttons */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                }}>
                    <button 
                        onClick={() => navigate('/user/user-dashboard')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            backgroundColor: '#0f172a',
                            color: '#ffffff',
                            padding: '14px 24px',
                            borderRadius: '12px',
                            fontSize: '15px',
                            fontWeight: '600',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            width: '100%'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0f172a'}
                    >
                        <ArrowLeft size={18} />
                        Back to Dashboard
                    </button>

                    <button 
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            backgroundColor: '#ffffff',
                            color: '#475569',
                            padding: '14px 24px',
                            borderRadius: '12px',
                            fontSize: '15px',
                            fontWeight: '600',
                            border: '1px solid #e2e8f0',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            width: '100%'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                    >
                        <Mail size={18} />
                        Contact Support
                    </button>
                </div>

                {/* Footer Note */}
                <div style={{
                    marginTop: '32px',
                    paddingTop: '24px',
                    borderTop: '1px solid #f1f5f9',
                    fontSize: '13px',
                    color: '#94a3b8'
                }}>
                    Role: <span style={{ color: '#64748b', fontWeight: '500' }}>{localStorage.getItem("Role") || "User"}</span>
                </div>
            </div>
        </div>
    );
};

export default AccessDenied;
