import React, { useState, useEffect } from "react";
import { FiClock, FiCheckCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./TrialPopover.css";

const TrialPopover = () => {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  const rawDays = localStorage.getItem("RemainingDays");
  const remainingDaysNum = (rawDays === null || rawDays === undefined || rawDays === "undefined" || rawDays === "null" || isNaN(Number(rawDays))) ? 0 : Number(rawDays);
  const trialdays = String(remainingDaysNum);

  // Date Calculations
  const now = new Date();
  const storedStartDate = localStorage.getItem("TrialStartDate");
  
  let createdDate;
  if (storedStartDate) {
    createdDate = new Date(storedStartDate);
  } else {
    // Fallback: estimate start date assuming 20 days total
    createdDate = new Date(now.getTime() - ((20 - remainingDaysNum) * 24 * 60 * 60 * 1000));
  }
  
  // End date is 20 days from created date
  const endDate = new Date(createdDate.getTime() + (20 * 24 * 60 * 60 * 1000));

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

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

  const handleSubscribe = () => {
    handleHide();
    // Assuming routing to billing or account settings
    const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
    navigate(`${basePath}/billing-control`);
  };

  if (!isVisible) return null;

  return (
    <div className="trial-floating-popover">
      <div className="trial-popover-content">
        {/* Background Vector matching the Bid Alert style */}
        <FiClock 
          size={240} 
          style={{
              position: 'absolute',
              right: '20%',
              top: '50%',
              transform: 'translateY(-50%) rotate(-10deg)',
              color: '#ffffffff',
              opacity: 0.05,
              zIndex: 0,
              pointerEvents: 'none'
          }}
        />

        <div className="trial-content-wrapper">
          <div className="trial-icon-container">
            <FiClock size={40} className="trial-main-icon" />
          </div>

          <h3 className="trial-title">Free Trial</h3>
          
          <div className="origin-widget-grid">
            <div className="origin-card origin-days-card">
              <span className="origin-days-number">{trialdays}</span>
              <span className="origin-days-label">Days Remaining</span>
            </div>
            
            <div className="origin-card origin-date-card">
              <span className="origin-date-label">Created On</span>
              <span className="origin-date-value">{formatDate(createdDate)}</span>
            </div>
            
            <div className="origin-card origin-date-card">
              <span className="origin-date-label">Ends On</span>
              <span className="origin-date-value">{formatDate(endDate)}</span>
            </div>
          </div>
          
          <p className="trial-desc">
            Subscribe now to secure uninterrupted access to premium features, seamless talent sourcing, and unlimited interview scheduling.
          </p>

          <div className="trial-actions" style={{ marginTop: '12px' }}>
            <button className="btn-primary w-100" onClick={handleSubscribe}>
              Subscribe Now
            </button>
            <button className="btn-secondary w-100" onClick={handleHide}>
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrialPopover;
