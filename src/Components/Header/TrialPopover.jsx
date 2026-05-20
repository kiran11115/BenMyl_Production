import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import "./TrialPopover.css";

const TrialPopover = () => {
  const [isVisible, setIsVisible] = useState(true);
  const trialdays = localStorage.getItem("RemainingDays");

  useEffect(() => {
    const hidden = localStorage.getItem("trialPopoverHidden");
    if (hidden === "true") {
      setIsVisible(false);
    }
  }, []);

  const handleHide = () => {
    setIsVisible(false);
    localStorage.setItem("trialPopoverHidden", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="trial-floating-popover">
      <div className="trial-popover-content">
        <span className="trial-badge">Free Trial</span>
        <div className="trial-text mt-1">
          <p className="trial-title">{Number(trialdays)} Days Remaining</p>
          <p className="trial-desc">You are currently on a limited time free trial.</p>
        </div>
        <button className="trial-hide-btn" onClick={handleHide}>
          Hidden
          <X size={14} className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default TrialPopover;
