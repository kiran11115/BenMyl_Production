import React from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";

// Graphic 1: Stars with Colored blocks (matching Mockup 1)
const ReviewIllustration = () => (
  <div className="alert-graphic-wrapper">
    <div className="alert-stars-row">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="24" height="24" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" className="alert-star-svg">
          <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
        </svg>
      ))}
    </div>
    <svg width="120" height="80" viewBox="0 0 120 80" className="alert-illustration-svg" style={{ overflow: 'visible' }}>
      <ellipse cx="60" cy="74" rx="42" ry="4" fill="rgba(0,0,0,0.06)" />
      
      {/* Background blocks */}
      <rect x="25" y="45" width="12" height="25" rx="3" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
      <rect x="40" y="52" width="12" height="18" rx="3" fill="#f87171" />
      <rect x="40" y="32" width="14" height="16" rx="3" fill="#a7f3d0" />
      
      {/* Large horizontal bar */}
      <rect x="58" y="24" width="30" height="14" rx="4" fill="#1e3a8a" />
      
      {/* Plus sign block (hospital/clinic building representation) */}
      <rect x="63" y="42" width="16" height="28" rx="3" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
      <path d="M68 54 H74 M71 51 V57" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" />
      
      {/* Right side blocks */}
      <rect x="91" y="20" width="14" height="42" rx="3" fill="#34d399" />
      <rect x="80" y="24" width="10" height="28" rx="3" fill="#fbd38d" />
      <rect x="80" y="55" width="18" height="15" rx="3" fill="#6b21a8" />
    </svg>
  </div>
);

// Graphic 2: Happy Jumping Team Members (matching Mockup 2)
const TeamIllustration = () => (
  <div className="alert-graphic-wrapper">
    <svg width="220" height="100" viewBox="0 0 220 100" className="alert-illustration-svg" style={{ overflow: 'visible' }}>
      {/* Shadows on floor */}
      <ellipse cx="40" cy="85" rx="14" ry="2.5" fill="rgba(0,0,0,0.04)" />
      <ellipse cx="90" cy="85" rx="14" ry="2.5" fill="rgba(0,0,0,0.04)" />
      <ellipse cx="140" cy="85" rx="14" ry="2.5" fill="rgba(0,0,0,0.04)" />
      <ellipse cx="190" cy="85" rx="14" ry="2.5" fill="rgba(0,0,0,0.04)" />

      {/* Person 1 (Purple clothes) */}
      <g transform="translate(10, 5)">
        <circle cx="30" cy="25" r="4.5" fill="#f59e0b" />
        <path d="M28 30 H32 V48 H28 Z" fill="#818cf8" />
        <path d="M28 32 L19 22" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M32 32 L43 27" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M28 48 L22 66 L27 68" stroke="#818cf8" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M32 48 L37 63 L34 72" stroke="#818cf8" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Person 2 (Green clothes) */}
      <g transform="translate(60, 5)">
        <circle cx="30" cy="22" r="4.5" fill="#f87171" />
        <path d="M28 27 H32 V45 H28 Z" fill="#a7f3d0" />
        <path d="M28 29 L20 16" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M32 29 L41 16" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M28 45 L21 58 L31 70" stroke="#059669" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M32 45 L40 56 L36 65" stroke="#059669" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Person 3 (Orange/Beige clothes) */}
      <g transform="translate(110, 5)">
        <circle cx="30" cy="24" r="4.5" fill="#fbd38d" />
        <path d="M28 29 H32 V47 H28 Z" fill="#ffedd5" />
        <path d="M28 31 L23 19" stroke="#fbd38d" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M32 31 L37 19" stroke="#fbd38d" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M28 47 L28 62 L38 65" stroke="#fca5a5" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M32 47 L30 62 L21 58" stroke="#fca5a5" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Person 4 (Blue clothes) */}
      <g transform="translate(160, 5)">
        <circle cx="30" cy="20" r="4.5" fill="#f87171" />
        <path d="M28 25 H32 V43 H28 Z" fill="#93c5fd" />
        <path d="M28 27 L16 27" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M32 27 L40 14" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M28 43 L34 55 L28 64" stroke="#2563eb" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M32 43 L41 52 L37 61" stroke="#2563eb" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  </div>
);

export const CustomAlert = ({
  title,
  message,
  type = "info", // "info" (jumping team), "success" (review/stars), "error" (review/stars with red tones), "warning"
  confirmText = "OK",
  onConfirm,
  onClose,
}) => {
  const isReviewTheme = type === "success" || type === "error";

  return createPortal(
    <div className="custom-alert-overlay">
      <div className="custom-alert-card">
        {onClose && (
          <button className="custom-alert-close-btn" onClick={onClose} aria-label="Close">
            <FiX size={18} />
          </button>
        )}

        <div className="custom-alert-body-container">
          {/* Illustration selection */}
          {isReviewTheme ? <ReviewIllustration /> : <TeamIllustration />}

          <h2 className="custom-alert-title">{title}</h2>
          <p className="custom-alert-message">{message}</p>
        </div>

        <div className="custom-alert-actions-row">
          <button
            className="custom-alert-primary-btn"
            onClick={() => {
              if (onConfirm) onConfirm();
              if (onClose) onClose();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>

      <style jsx="true">{`
        .custom-alert-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100000;
          animation: customAlertFadeIn 0.25s ease-out;
          font-family: 'Inter', -apple-system, sans-serif;
        }

        .custom-alert-card {
          width: min(420px, calc(100vw - 32px));
          background: #fafaf9; /* Cream/off-white tone */
          border-radius: 24px;
          padding: 40px 32px 32px;
          box-shadow: 
            0 20px 48px -10px rgba(15, 23, 42, 0.18),
            0 8px 16px -4px rgba(15, 23, 42, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.7);
          text-align: center;
          position: relative;
          animation: customAlertSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
        }

        .custom-alert-close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          border: none;
          background: #f1f0ee;
          color: #78716c;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          outline: none;
        }

        .custom-alert-close-btn:hover {
          background: #e7e5e4;
          color: #1c1917;
          transform: rotate(90deg);
        }

        .custom-alert-body-container {
          margin-bottom: 28px;
        }

        .alert-graphic-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 24px;
        }

        .alert-stars-row {
          display: flex;
          gap: 4px;
          margin-bottom: 12px;
        }

        .alert-star-svg {
          filter: drop-shadow(0 1px 2px rgba(251, 191, 36, 0.25));
        }

        .alert-illustration-svg {
          max-width: 100%;
          display: block;
        }

        .custom-alert-title {
          font-family: 'Playfair Display', 'Georgia', 'Times New Roman', serif;
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 12px 0;
          line-height: 1.25;
        }

        .custom-alert-message {
          font-size: 14px;
          color: #64748b;
          line-height: 1.6;
          margin: 0;
          padding: 0 8px;
        }

        .custom-alert-actions-row {
          display: flex;
          gap: 12px;
          justify-content: center;
          width: 100%;
        }

        .custom-alert-primary-btn {
          flex: 1;
          background: #7c5dfa;
          color: #ffffff;
          border: none;
          padding: 14px 28px;
          font-size: 14px;
          font-weight: 600;
          border-radius: 14px;
          cursor: pointer;
          box-shadow: 0 8px 16px -4px rgba(124, 93, 250, 0.35);
          transition: all 0.2s ease;
          outline: none;
        }

        .custom-alert-primary-btn:hover {
          background: #6344d6;
          transform: translateY(-1px);
          box-shadow: 0 10px 20px -2px rgba(124, 93, 250, 0.45);
        }

        .custom-alert-primary-btn:active {
          transform: translateY(0);
        }

        @keyframes customAlertFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes customAlertSlideUp {
          from {
            opacity: 0;
            transform: translateY(24px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>,
    document.body
  );
};

export const CustomConfirm = ({
  title,
  message,
  type = "info", // "info" (jumping team), "warning"
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  onClose,
}) => {
  return createPortal(
    <div className="custom-confirm-overlay">
      <div className="custom-confirm-card">
        {onClose && (
          <button className="custom-confirm-close-btn" onClick={onClose} aria-label="Close">
            <FiX size={18} />
          </button>
        )}

        <div className="custom-confirm-body-container">
          <TeamIllustration />
          <h2 className="custom-confirm-title">{title}</h2>
          <p className="custom-confirm-message">{message}</p>
        </div>

        <div className="custom-confirm-actions-row">
          <button
            className="custom-confirm-secondary-btn"
            onClick={() => {
              if (onCancel) onCancel();
              if (onClose) onClose();
            }}
          >
            {cancelText}
          </button>
          <button
            className="custom-confirm-primary-btn"
            onClick={() => {
              if (onConfirm) onConfirm();
              if (onClose) onClose();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>

      <style jsx="true">{`
        .custom-confirm-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100000;
          animation: customConfirmFadeIn 0.25s ease-out;
          font-family: 'Inter', -apple-system, sans-serif;
        }

        .custom-confirm-card {
          width: min(440px, calc(100vw - 32px));
          background: #fafaf9; /* Cream/off-white tone */
          border-radius: 24px;
          padding: 40px 32px 32px;
          box-shadow: 
            0 20px 48px -10px rgba(15, 23, 42, 0.18),
            0 8px 16px -4px rgba(15, 23, 42, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.7);
          text-align: center;
          position: relative;
          animation: customConfirmSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
        }

        .custom-confirm-close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          border: none;
          background: #f1f0ee;
          color: #78716c;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          outline: none;
        }

        .custom-confirm-close-btn:hover {
          background: #e7e5e4;
          color: #1c1917;
          transform: rotate(90deg);
        }

        .custom-confirm-body-container {
          margin-bottom: 28px;
        }

        .alert-graphic-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 24px;
        }

        .alert-illustration-svg {
          max-width: 100%;
          display: block;
        }

        .custom-confirm-title {
          font-family: 'Playfair Display', 'Georgia', 'Times New Roman', serif;
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 12px 0;
          line-height: 1.25;
        }

        .custom-confirm-message {
          font-size: 14px;
          color: #64748b;
          line-height: 1.6;
          margin: 0;
          padding: 0 8px;
        }

        .custom-confirm-actions-row {
          display: flex;
          gap: 12px;
          justify-content: center;
          width: 100%;
        }

        .custom-confirm-secondary-btn {
          flex: 1;
          background: #ffffff;
          color: #475569;
          border: 1px solid #e2e8f0;
          padding: 14px 24px;
          font-size: 14px;
          font-weight: 600;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          outline: none;
        }

        .custom-confirm-secondary-btn:hover {
          background: #f8fafc;
          color: #0f172a;
          border-color: #cbd5e1;
        }

        .custom-confirm-primary-btn {
          flex: 1.2;
          background: #7c5dfa;
          color: #ffffff;
          border: none;
          padding: 14px 24px;
          font-size: 14px;
          font-weight: 600;
          border-radius: 14px;
          cursor: pointer;
          box-shadow: 0 8px 16px -4px rgba(124, 93, 250, 0.35);
          transition: all 0.2s ease;
          outline: none;
        }

        .custom-confirm-primary-btn:hover {
          background: #6344d6;
          transform: translateY(-1px);
          box-shadow: 0 10px 20px -2px rgba(124, 93, 250, 0.45);
        }

        .custom-confirm-primary-btn:active {
          transform: translateY(0);
        }

        @keyframes customConfirmFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes customConfirmSlideUp {
          from {
            opacity: 0;
            transform: translateY(24px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>,
    document.body
  );
};

export default CustomAlert;
