import React, { useState } from "react";
import { FiCopy, FiCheck, FiLinkedin, FiAlertCircle } from "react-icons/fi";
import { toast } from "react-toastify";
import "./Projects.css";

const ShareJobCard = ({ job }) => {
  const jobLink = `https://benmyl.com/jobs/${job?.jobID || "blueprint"}`;
  const postedByEmail = localStorage.getItem("Email") || "support@benmyl.com";

  const [linkedInShared, setLinkedInShared] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(jobLink);
    setCopied(true);
    toast.success("Job link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePostLinkedIn = () => {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobLink)}`;
    window.open(shareUrl, "_blank", "width=600,height=600");
    setLinkedInShared(true);
    toast.success("Opening LinkedIn Sourcing Wizard...");
  };

  return (
    <div className="share-job-card-jd" style={{ width: "100%", display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* LinkedIn Status Section */}
      {/* <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "22px", width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div 
            style={{ 
              width: "36px", 
              height: "36px", 
              borderRadius: "10px", 
              background: "#0a66c215", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              color: "#0a66c2" 
            }}
          >
            <FiLinkedin size={18} />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a" }}>LinkedIn Status</span>
            <span style={{ fontSize: "11px", color: linkedInShared ? "#059669" : "#64748b", display: "flex", alignItems: "center", gap: "4px", fontWeight: "600" }}>
              {linkedInShared ? (
                <>
                  <FiCheck size={13} style={{ color: "#059669" }} /> Shared
                </>
              ) : (
                <>
                  <FiAlertCircle size={13} style={{ color: "#e11d48" }} /> Not Posted Yet
                </>
              )}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <button 
            type="button" 
            onClick={handlePostLinkedIn}
            style={{ 
              background: "#0a66c2", 
              color: "#fff", 
              border: "none", 
              borderRadius: "8px", 
              padding: "8px 14px", 
              fontSize: "11px", 
              fontWeight: "700", 
              cursor: "pointer", 
              display: "flex", 
              alignItems: "center", 
              gap: "6px",
              transition: "all 0.2s ease"
            }}
          >
            <FiLinkedin size={13} />
            Post on LinkedIn
          </button>

        </div>
      </div> */}
    </div>
  );
};

export default ShareJobCard;
