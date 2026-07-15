import React, { useState, useEffect } from "react";
import { FiClock, FiCheckCircle, FiAlertTriangle, FiX, FiFileText } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./TrialPopover.css";
import { useGetContractNotificationsQuery } from "../../State-Management/Api/ContractApiSlice";

const TrialPopover = () => {   
  const [isVisible, setIsVisible] = useState(() => {
    return localStorage.getItem("trialPopoverHidden") !== "true";
  });
  const navigate = useNavigate();
  const userId = Number(localStorage.getItem("CompanyId"));

  const { data: contractData } = useGetContractNotificationsQuery(userId, {
    skip: !userId,
  });

  const expiringContracts =
    contractData?.data?.filter(
      (item) =>
        Number(item.daysRemaining) >= 0 &&
        Number(item.daysRemaining) <= 7
    ) || [];

  const handleViewContracts = () => {
    handleHide();

    const isSharedAdmin =
      window.location.pathname.toLowerCase().startsWith("/admin");

    navigate(
      isSharedAdmin
        ? "/Admin/contract-listing"
        : "/user/contract-listing"
    );
  };

  const rawDays = localStorage.getItem("RemainingDays");
  const remainingDaysNum = (rawDays === null || rawDays === undefined || rawDays === "undefined" || rawDays === "null" || isNaN(Number(rawDays))) ? 0 : Number(rawDays);
  const trialdays = String(remainingDaysNum);

  // Date Calculations derived from the remaining days count
  const now = new Date();
  const endDate = new Date(now.getTime() + (remainingDaysNum * 24 * 60 * 60 * 1000));
  const createdDate = new Date(endDate.getTime() - (90 * 24 * 60 * 60 * 1000));

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
    const isSharedAdmin = window.location.pathname.toLowerCase().startsWith('/admin');
    const path = isSharedAdmin ? '/Admin/admin-subscription' : '/user/user-subscription';
    navigate(path);
  };

  if (!isVisible) return null;

  return (
    <div className="trial-floating-popover centered-overlay">
      <div className="trial-popover-content extended">
        <button className="trial-close-btn" onClick={handleHide} aria-label="Close">
          <FiX size={16} />
        </button>
        
        <div className="trial-extended-layout">
          {/* Left Column: Trial Information */}
          <div className="trial-column trial-left-col">

            {/* Icon + Label side-by-side header */}
            <div className="trial-header-row">
              <div className="trial-clock-badge">
                {/* Animated SVG clock */}
                <svg className="trial-clock-svg" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  <line className="clock-hand-minute" x1="24" y1="24" x2="24" y2="10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  <line className="clock-hand-hour" x1="24" y1="24" x2="33" y2="24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  <circle cx="24" cy="24" r="2" fill="currentColor"/>
                </svg>
              </div>
              <div className="trial-header-text">
                <h3 className="trial-title">Free Trial Period</h3>
                <p className="trial-subtitle">Your subscription access overview</p>
              </div>
            </div>
            
            <div className="origin-widget-grid">
              <div className="origin-card origin-days-card">
                <span className="origin-days-number">{trialdays}</span>
                <span className="origin-days-label">Days Remaining</span>
              </div>
              
              <div className="origin-card origin-date-card">
                <span className="origin-date-label">Started</span>
                <span className="origin-date-value">{formatDate(createdDate)}</span>
              </div>
              
              <div className="origin-card origin-date-card">
                <span className="origin-date-label">Expires</span>
                <span className="origin-date-value">{formatDate(endDate)}</span>
              </div>
            </div>
            
            <p className="trial-desc">
              Subscribe now to secure uninterrupted access to premium features, seamless talent sourcing, and unlimited interview scheduling.
            </p>

            <div className="trial-actions">
              <button className="btn-primary trial-action-btn" onClick={handleSubscribe}>
                Subscribe Now
              </button>
              <button className="trial-btn-skip" onClick={handleHide}>
                Maybe later
              </button>
            </div>
          </div>

          <div className="trial-divider"></div>

          {/* Right Column: Contract Notifications */}
          <div className="trial-column trial-right-col">

            <div className="contract-col-header">
              <div className="contract-col-title-row">
                <span className="contract-col-icon"><FiAlertTriangle size={15} /></span>
                <h4 className="contract-col-title">Contract Alerts</h4>
              </div>
              {expiringContracts.length > 0 && (
                <span className="contract-count-badge">{expiringContracts.length} Expiring</span>
              )}
            </div>

            {expiringContracts.length > 0 ? (
              <div className="contractor-scroll-container">
                {expiringContracts.map((item) => (
                  <div key={item.contractID} className="contract-alert-card">
                    <div className="contract-alert-left">
                      <div className="contract-alert-icon">
                        <FiFileText size={16} />
                      </div>
                      <div className="contract-alert-info">
                        <span className="contract-alert-title">{item.jobTitle}</span>
                        <span className="contract-alert-meta">Contract expiring soon</span>
                      </div>
                    </div>
                    <div className={`contract-days-pill ${Number(item.daysRemaining) <= 2 ? 'urgent' : ''}`}>
                      {item.daysRemaining}d left
                    </div>
                  </div>
                ))}
                <button className="contractor-view-btn" onClick={handleViewContracts}>
                  Manage Expiring Contracts
                </button>
              </div>
            ) : (
              <div className="empty-contract-state">
                <div className="empty-icon-wrapper">
                  <FiCheckCircle size={28} className="empty-icon" />
                </div>
                <h5>All Clear!</h5>
                <p>No contracts expiring within the next 7 days. Operations are running smoothly.</p>
                <button className="contractor-view-btn outline" onClick={handleViewContracts}>
                  View All Contracts
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrialPopover;
