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
      background: "#1e293b",
      borderRadius: "14px",
      padding: "20px",
      border: "1px solid rgba(71, 85, 105, 0.8)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
    },

    title: {
      fontSize: "16px",
      fontWeight: 600,
      color: "#f8fafc",
      marginBottom: "14px",
    },

    label: {
      fontSize: "13px",
      color: "#94a3b8",
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
      border: "1px solid rgba(71, 85, 105, 0.8)",
      fontSize: "14px",
      color: "#f8fafc",
      background: "rgba(15, 23, 42, 0.5)",
    },

    copyBtn: {
      padding: "0 14px",
      borderRadius: "8px",
      border: "none",
      background: "#3b82f6",
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
      background: "rgba(59, 130, 246, 0.1)",
      color: "#60a5fa",
      fontSize: "14px",
      fontWeight: 500,
      border: "none",
      cursor: "pointer",
      marginBottom: "10px",
      width: "100%",
    },

    leftShare: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },

    tick: {
      color: "#34d399",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      fontSize: "13px",
    },

    divider: {
      height: "1px",
      background: "rgba(51, 65, 85, 0.6)",
      margin: "16px 0",
    },

    postedBy: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "14px",
      color: "#94a3b8",
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
