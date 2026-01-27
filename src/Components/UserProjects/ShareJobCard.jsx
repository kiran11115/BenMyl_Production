import React, { useState } from "react";
import {
  FiCopy,
  FiCheck,
  FiMail,
} from "react-icons/fi";
import { FaLinkedinIn, FaFacebookF } from "react-icons/fa";

const ShareJobCard = () => {
  const jobLink = "https://techstream.jobs/";
  const postedByEmail = "hr@techstream.jobs";

  const [shared, setShared] = useState({
    linkedin: true,
    facebook: false,
    email: true,
  });

  const styles = {
    card: {
      background: "#ffffff",
      borderRadius: "14px",
      padding: "20px",
      border: "1px solid #e2e8f0",
      boxShadow: "0 4px 12px rgba(15, 23, 42, 0.05)",
    },

    title: {
      fontSize: "16px",
      fontWeight: 600,
      color: "#0f172a",
      marginBottom: "14px",
    },

    label: {
      fontSize: "13px",
      color: "#64748b",
      marginBottom: "6px",
    },

    linkRow: {
      display: "flex",
      gap: "8px",
      marginBottom: "16px",
    },

    input: {
      flex: 1,
      padding: "10px 12px",
      borderRadius: "8px",
      border: "1px solid #e2e8f0",
      fontSize: "14px",
      color: "#334155",
      background: "#f8fafc",
    },

    copyBtn: {
      padding: "0 14px",
      borderRadius: "8px",
      border: "none",
      background: "#2563eb",
      color: "#fff",
      fontSize: "14px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      cursor: "pointer",
    },

    shareBtn: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "12px",
      padding: "10px 14px",
      borderRadius: "10px",
      background: "#eff6ff",
      color: "#1e40af",
      fontSize: "14px",
      fontWeight: 500,
      border: "none",
      cursor: "pointer",
      marginBottom: "10px",
    },

    leftShare: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },

    tick: {
      color: "#16a34a",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      fontSize: "13px",
    },

    divider: {
      height: "1px",
      background: "#e5e7eb",
      margin: "16px 0",
    },

    postedBy: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "14px",
      color: "#475569",
    },
  };

  const ShareButton = ({ icon: Icon, label, isShared, onClick }) => (
    <button style={styles.shareBtn} onClick={onClick}>
      <div style={styles.leftShare}>
        <Icon size={16} />
        <span>{label}</span>
      </div>

      {isShared && (
        <div style={styles.tick}>
          <FiCheck size={16} /> Shared
        </div>
      )}
    </button>
  );

  return (
    <div style={styles.card}>
      <div style={styles.title}>Shared with</div>

      {/* Job Link */}
      <div style={styles.label}>Job Link</div>
      <div style={styles.linkRow}>
        <input value={jobLink} readOnly style={styles.input} />
        <button
          style={styles.copyBtn}
          onClick={() => navigator.clipboard.writeText(jobLink)}
        >
          <FiCopy size={14} /> Copy
        </button>
      </div>

      {/* Share buttons */}
      <ShareButton
        icon={FaLinkedinIn}
        label="Share on LinkedIn"
        isShared={shared.linkedin}
        onClick={() =>
          setShared((p) => ({ ...p, linkedin: true }))
        }
      />

      <ShareButton
        icon={FaFacebookF}
        label="Share on Facebook"
        isShared={shared.facebook}
        onClick={() =>
          setShared((p) => ({ ...p, facebook: true }))
        }
      />

      <ShareButton
        icon={FiMail}
        label="Share via Email"
        isShared={shared.email}
        onClick={() =>
          setShared((p) => ({ ...p, email: true }))
        }
      />

      {/* Posted by */}
      <div style={styles.divider} />

      <div style={styles.label}>Posted by</div>
      <div style={styles.postedBy}>
        <FiMail size={16} />
        <span>{postedByEmail}</span>
      </div>
    </div>
  );
};

export default ShareJobCard;
