import React, { useState } from "react";
import { FiCopy, FiCheck, FiMail, FiLink } from "react-icons/fi";
import { FaLinkedinIn, FaFacebookF } from "react-icons/fa";
import "./Projects.css";

const ShareJobCard = () => {
  const jobLink = "https://techstream.jobs/";
  const postedByEmail = localStorage.getItem("Email") || "your@email.com";

  const [shared, setShared] = useState({
    linkedin: true,
    facebook: false,
    email: true,
  });

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(jobLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const platforms = [
    {
      key: "linkedin",
      icon: FaLinkedinIn,
      label: "Share on LinkedIn",
      color: "#0a66c2",
    },
    {
      key: "facebook",
      icon: FaFacebookF,
      label: "Share on Facebook",
      color: "#1877f2",
    },
    {
      key: "email",
      icon: FiMail,
      label: "Share via Email",
      color: "#f5810c",
    },
  ];

  return (
    <div className="share-job-card">
      <div className="share-job-title">Share This Job</div>

      {/* Link Row */}
      <div className="share-label">Job Link</div>
      <div className="share-link-row">
        <input
          value={jobLink}
          readOnly
          className="share-link-input"
        />
        <button className="share-copy-btn" onClick={handleCopy}>
          {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Platform Buttons */}
      {platforms.map(({ key, icon: Icon, label, color }) => (
        <button
          key={key}
          className="share-platform-btn"
          onClick={() => setShared((p) => ({ ...p, [key]: true }))}
        >
          <div className="share-platform-left">
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "8px",
                background: `${color}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color,
                flexShrink: 0,
              }}
            >
              <Icon size={14} />
            </div>
            <span>{label}</span>
          </div>

          {shared[key] && (
            <div className="share-shared-badge">
              <FiCheck size={13} /> Shared
            </div>
          )}
        </button>
      ))}

      {/* Posted By */}
      <div className="share-divider" />
      <div className="share-label">Posted By</div>
      <div className="share-posted-by">
        <FiMail size={14} style={{ color: "#f5810c" }} />
        <span>{postedByEmail}</span>
      </div>
    </div>
  );
};

export default ShareJobCard;
