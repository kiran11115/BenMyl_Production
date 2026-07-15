import React, { useState, useEffect } from "react";
import { FiClock, FiCheckCircle, FiAlertTriangle } from "react-icons/fi";
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

          {expiringContracts.length > 0 && (
  <div
    style={{
      background: "#fff4e5",
      border: "1px solid #f5b942",
      borderRadius: "10px",
      padding: "14px",
      marginBottom: "18px",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <FiAlertTriangle color="#f59e0b" size={22} />

      <div style={{ flex: 1 }}>
        <strong>
          {expiringContracts.length} Contract
          {expiringContracts.length > 1 ? "s are" : " is"} Expiring
        </strong>

        <div
          style={{
            fontSize: "13px",
            marginTop: "4px",
            color: "#555",
          }}
        >
          {expiringContracts.map((item, index) => (
            <div key={item.contractID}>
              • {item.jobTitle} - {item.daysRemaining} day
              {item.daysRemaining !== 1 ? "s" : ""} remaining
            </div>
          ))}
        </div>
      </div>
    </div>

    <button
      className="btn-primary"
      style={{
        marginTop: "12px",
        width: "100%",
      }}
      onClick={handleViewContracts}
    >
      View Contracts
    </button>
  </div>
)}
          
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
