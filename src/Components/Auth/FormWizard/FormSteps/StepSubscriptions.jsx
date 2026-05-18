import React from "react";
import "./StepSubscriptions.css";

const StepSubscriptions = ({ formData, handleSubscriptionChange }) => {
  const plans = [
    {
      id: "free_trial",
      name: "Free Trial",
      description: "Valid for limited time. Get full access to our platform features for 20 days.",
      price: "$0",
      comingSoon: false,
    },
    {
      id: "pro",
      name: "Pro",
      description: "Advanced tools for growing teams.",
      price: "$49/mo",
      comingSoon: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "Custom solutions for large organizations.",
      price: "Custom",
      comingSoon: true,
    },
  ];

  return (
    <div className="auth-step-content">
      <h2 className="auth-step-title">Choose Your Plan</h2>
      <p className="auth-step-desc">Select a subscription plan that fits your needs.</p>

      <div className="plans-grid">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`plan-card ${formData.subscriptionPlan === plan.id ? "selected" : ""} ${
              plan.comingSoon ? "disabled" : ""
            }`}
            onClick={() => !plan.comingSoon && handleSubscriptionChange(plan.id)}
          >
            {plan.comingSoon && <span className="coming-soon-badge">Coming Soon</span>}
            <div className="plan-header">
              <h3 className="plan-name">{plan.name}</h3>
              <p className="plan-price">{plan.price}</p>
            </div>
            <p className="plan-desc">{plan.description}</p>
            
            <div className="plan-radio">
              <div className={`radio-circle ${formData.subscriptionPlan === plan.id ? "checked" : ""}`}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepSubscriptions;
