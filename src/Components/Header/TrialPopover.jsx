import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import "./TrialPopover.css";

const TrialPopover = () => {
  const [isVisible, setIsVisible] = useState(true);
   const rawDays = localStorage.getItem("RemainingDays");
  const trialdays = (rawDays === null || rawDays === undefined || rawDays === "undefined" || rawDays === "null" || isNaN(Number(rawDays))) ? "0" : rawDays;

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
        <div className="trial-popover-header">
          <span className="trial-badge">Free Trial</span>
          <button className="trial-close-btn" onClick={handleHide} aria-label="Dismiss">
            <X size={16} />
          </button>
        </div>
        <div className="trial-popover-body">
        <h4 className="trial-title">{trialdays} Days Remaining</h4>
          <p className="trial-desc">You are currently on a limited time free trial.</p>
        </div>
      </div>
    </div>
  );
};

export default TrialPopover;
