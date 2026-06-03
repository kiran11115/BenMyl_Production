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
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>BenMyl Terms & Conditions</h2>
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
        <div
          style={{
            padding: "24px",
            overflowY: "auto",
            fontSize: "14px",
            color: "#334155",
            lineHeight: 1.7,
          }}
        >
          {/* <p style={{ marginBottom: "20px", color: "#64748b" }}>
    <strong>Last Updated:</strong> [Date]
  </p> */}

          <p style={{ marginBottom: "20px" }}>
            Welcome to BenMyl. These Terms & Conditions ("Terms") govern your access
            to and use of the BenMyl platform, website, and services. By accessing or
            using BenMyl, you agree to comply with these Terms.
          </p>

          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1e293b", marginBottom: "12px" }}>
            1. Acceptance of Terms
          </h3>
          <p style={{ marginBottom: "16px" }}>
            By registering, accessing, or using BenMyl, you agree to be bound by these
            Terms and all applicable laws and regulations.
          </p>
          <p style={{ marginBottom: "16px" }}>
            If you do not agree with these Terms, you must not use the platform.
          </p>

          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1e293b", marginBottom: "12px", marginTop: "24px" }}>
            2. Platform Description
          </h3>
          <p style={{ marginBottom: "12px" }}>
            BenMyl is a recruitment and talent management platform that enables users
            to:
          </p>
          <ul style={{ paddingLeft: "20px", marginBottom: "16px" }}>
            <li>Manage talent pools and candidate profiles</li>
            <li>Create and manage job requirements</li>
            <li>Share candidate profiles</li>
            <li>Connect and collaborate with recruiters</li>
            <li>Track hiring pipelines</li>
            <li>Participate in project-based recruiting activities</li>
            <li>Use AI-powered matching and workflow features</li>
          </ul>

          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1e293b", marginBottom: "12px", marginTop: "24px" }}>
            3. User Eligibility
          </h3>
          <p style={{ marginBottom: "12px" }}>Users must:</p>
          <ul style={{ paddingLeft: "20px", marginBottom: "16px" }}>
            <li>Be at least 18 years old</li>
            <li>Provide accurate registration information</li>
            <li>Have authority to represent their organization when applicable</li>
            <li>Comply with all applicable employment and data protection laws</li>
          </ul>

          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1e293b", marginBottom: "12px", marginTop: "24px" }}>
            4. User Accounts
          </h3>
          <p style={{ marginBottom: "12px" }}>Users are responsible for:</p>
          <ul style={{ paddingLeft: "20px", marginBottom: "16px" }}>
            <li>Maintaining account confidentiality</li>
            <li>Securing login credentials</li>
            <li>All activities conducted under their account</li>
          </ul>
          <p style={{ marginBottom: "16px" }}>
            BenMyl reserves the right to suspend or terminate accounts for unauthorized
            or suspicious activities.
          </p>

          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1e293b", marginBottom: "12px", marginTop: "24px" }}>
            5. Recruiter Responsibilities
          </h3>
          <p style={{ marginBottom: "12px" }}>Recruiters agree to:</p>
          <ul style={{ paddingLeft: "20px", marginBottom: "16px" }}>
            <li>Upload accurate candidate information</li>
            <li>Obtain proper authorization before sharing candidate data</li>
            <li>Use candidate information solely for legitimate recruitment purposes</li>
            <li>Not submit fraudulent, misleading, or duplicate profiles</li>
            <li>Respect confidentiality agreements between parties</li>
          </ul>

          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1e293b", marginBottom: "12px", marginTop: "24px" }}>
            6. Candidate Data & Privacy
          </h3>
          <p style={{ marginBottom: "12px" }}>
            Users are responsible for ensuring that:
          </p>
          <ul style={{ paddingLeft: "20px", marginBottom: "16px" }}>
            <li>Candidate data is collected lawfully</li>
            <li>Candidate consent is obtained where required</li>
            <li>Uploaded information complies with applicable privacy regulations</li>
          </ul>
          <p style={{ marginBottom: "16px" }}>
            BenMyl acts as a platform provider and is not responsible for the accuracy
            or legality of user-submitted candidate information.
          </p>

          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1e293b", marginBottom: "12px", marginTop: "24px" }}>
            7. Profile Sharing & Collaboration
          </h3>
          <p style={{ marginBottom: "12px" }}>
            When sharing profiles with other recruiters or organizations:
          </p>
          <ul style={{ paddingLeft: "20px", marginBottom: "16px" }}>
            <li>Mutual acceptance may be required</li>
            <li>Shared information must remain confidential</li>
            <li>Users may not redistribute candidate information without authorization</li>
          </ul>
          <p style={{ marginBottom: "16px" }}>
            BenMyl reserves the right to monitor and restrict misuse of shared data.
          </p>

          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1e293b", marginBottom: "12px", marginTop: "24px" }}>
            8. Recruiter Network & Communications
          </h3>
          <p style={{ marginBottom: "12px" }}>Users agree that:</p>
          <ul style={{ paddingLeft: "20px", marginBottom: "16px" }}>
            <li>Communications must remain professional</li>
            <li>Harassment, abuse, spam, or misleading information is prohibited</li>
            <li>BenMyl may suspend users engaging in inappropriate conduct</li>
          </ul>

          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1e293b", marginBottom: "12px", marginTop: "24px" }}>
            9. Subscription & Payments
          </h3>
          <p style={{ marginBottom: "12px" }}>For paid plans:</p>
          <ul style={{ paddingLeft: "20px", marginBottom: "16px" }}>
            <li>Subscription fees are billed according to the selected plan</li>
            <li>Fees are non-refundable unless otherwise stated</li>
            <li>BenMyl may modify pricing with prior notice</li>
            <li>Failure to pay may result in service suspension</li>
          </ul>

          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1e293b", marginBottom: "12px", marginTop: "24px" }}>
            10. AI Features & Token Usage
          </h3>
          <p style={{ marginBottom: "12px" }}>
            BenMyl may provide AI-powered services. Users acknowledge:
          </p>
          <ul style={{ paddingLeft: "20px", marginBottom: "16px" }}>
            <li>AI-generated suggestions are recommendations only</li>
            <li>Users are responsible for validating all AI-generated outputs</li>
            <li>Token allocations may vary by subscription plan</li>
            <li>Unused tokens may expire based on plan policies</li>
          </ul>

          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1e293b", marginBottom: "12px", marginTop: "24px" }}>
            11. Intellectual Property
          </h3>
          <p style={{ marginBottom: "12px" }}>
            All BenMyl software, branding, content, designs, and intellectual property
            remain the exclusive property of BenMyl.
          </p>
          <ul style={{ paddingLeft: "20px", marginBottom: "16px" }}>
            <li>Reverse engineer the platform</li>
            <li>Copy platform functionality</li>
            <li>Reproduce proprietary content without authorization</li>
          </ul>

          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1e293b", marginBottom: "12px", marginTop: "24px" }}>
            12. Prohibited Activities
          </h3>
          <p style={{ marginBottom: "12px" }}>Users may not:</p>
          <ul style={{ paddingLeft: "20px", marginBottom: "16px" }}>
            <li>Upload unlawful content</li>
            <li>Share malicious software</li>
            <li>Attempt unauthorized access</li>
            <li>Scrape platform data</li>
            <li>Create fake accounts</li>
            <li>Interfere with platform operations</li>
          </ul>
          <p style={{ marginBottom: "16px" }}>
            Violation may result in immediate suspension or termination.
          </p>

          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1e293b", marginBottom: "12px", marginTop: "24px" }}>
            13. Project Bidding & Agreements
          </h3>
          <p style={{ marginBottom: "16px" }}>
            Where project bidding or recruiter collaboration features are used, BenMyl
            acts solely as a technology platform. BenMyl is not a party to agreements
            between users. Users are responsible for contract terms and obligations.
          </p>

          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1e293b", marginBottom: "12px", marginTop: "24px" }}>
            14. Limitation of Liability
          </h3>
          <p style={{ marginBottom: "16px" }}>
            BenMyl is provided on an "as available" basis. BenMyl shall not be liable
            for hiring decisions, candidate performance, business losses, data
            inaccuracies provided by users, or third-party service interruptions.
          </p>
          <p style={{ marginBottom: "16px" }}>
            To the maximum extent permitted by law, BenMyl's liability shall be limited
            to the fees paid by the user during the preceding 12 months.
          </p>

          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1e293b", marginBottom: "12px", marginTop: "24px" }}>
            15. Data Security
          </h3>
          <p style={{ marginBottom: "16px" }}>
            BenMyl implements reasonable security measures; however, no system can
            guarantee absolute security. Users are responsible for protecting their
            account credentials and maintaining secure access practices.
          </p>

          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1e293b", marginBottom: "12px", marginTop: "24px" }}>
            16. Account Suspension & Termination
          </h3>
          <p style={{ marginBottom: "16px" }}>
            BenMyl may suspend or terminate accounts that violate these Terms, engage
            in fraudulent activity, abuse platform features, or breach applicable laws.
          </p>

          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1e293b", marginBottom: "12px", marginTop: "24px" }}>
            17. Service Availability
          </h3>
          <p style={{ marginBottom: "16px" }}>
            BenMyl may perform scheduled maintenance, platform updates, and feature
            enhancements. Temporary service interruptions may occur during such
            activities.
          </p>

          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1e293b", marginBottom: "12px", marginTop: "24px" }}>
            18. Changes to Terms
          </h3>
          <p style={{ marginBottom: "16px" }}>
            BenMyl reserves the right to update these Terms at any time. Continued use
            of the platform after updates constitutes acceptance of the revised Terms.
          </p>

          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1e293b", marginBottom: "12px", marginTop: "24px" }}>
            19. Governing Law
          </h3>
          <p style={{ marginBottom: "16px" }}>
            These Terms shall be governed by and interpreted in accordance with the
            laws applicable in the jurisdiction where BenMyl operates. Any disputes
            shall be subject to the exclusive jurisdiction of the appropriate courts.
          </p>

          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1e293b", marginBottom: "12px", marginTop: "24px" }}>
            20. Contact Information
          </h3>
          <p style={{ marginBottom: "8px" }}>
            <strong>BenMyl Support</strong>
          </p>
          <p style={{ marginBottom: "4px" }}>Email: support@benmyl.com</p>
          <p style={{ marginBottom: "16px" }}>Website: benmyl.com</p>

          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1e293b", marginBottom: "12px", marginTop: "24px" }}>
            User Acknowledgement
          </h3>
          <p style={{ marginBottom: "16px" }}>
            By creating an account or using BenMyl, you acknowledge that you have read,
            understood, and agree to these Terms & Conditions.
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
