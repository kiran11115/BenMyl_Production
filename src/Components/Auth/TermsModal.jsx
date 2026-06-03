import React from "react";
import { X } from "lucide-react";

export default function TermsModal({ onClose }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Terms & Conditions and Cookie Policy</h2>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#64748b',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{
          padding: '24px',
          overflowY: 'auto',
          fontSize: '14px',
          color: '#334155',
          lineHeight: 1.6
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', marginBottom: '12px' }}>1. Introduction</h3>
          <p style={{ marginBottom: '16px' }}>
            Welcome to BenMyl. By accessing or using our platform, you agree to be bound by these Terms and Conditions. Please read them carefully.
          </p>

          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', marginBottom: '12px', marginTop: '24px' }}>2. Use of Service</h3>
          <p style={{ marginBottom: '16px' }}>
            You agree to use our services only for lawful purposes and in accordance with our guidelines. You are responsible for maintaining the confidentiality of your account information.
          </p>

          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', marginBottom: '12px', marginTop: '24px' }}>3. User Data</h3>
          <p style={{ marginBottom: '16px' }}>
            We respect your privacy and handle your data in accordance with our Privacy Policy. By using the platform, you grant us the right to process your data to provide our services.
          </p>
          
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', marginBottom: '12px', marginTop: '24px' }}>4. Cookie Policy</h3>
          <p style={{ marginBottom: '16px' }}>
            We use cookies to enhance your experience, analyze site traffic, and serve targeted advertisements. By continuing to use our site, you consent to our use of cookies.
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
            <li><strong>Essential Cookies:</strong> Required for basic site functionality.</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how you interact with our site.</li>
            <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements.</li>
          </ul>

          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', marginBottom: '12px', marginTop: '24px' }}>5. Modifications</h3>
          <p style={{ marginBottom: '16px' }}>
            We reserve the right to modify these terms at any time. We will notify users of any material changes via email or platform notification.
          </p>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button 
            onClick={onClose}
            style={{
              background: '#5a5de8',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4c4fcf'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#5a5de8'}
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
