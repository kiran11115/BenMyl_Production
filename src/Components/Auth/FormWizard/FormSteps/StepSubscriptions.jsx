import React from "react";
import "./StepSubscriptions.css";
import { subscriptionPlans } from "../../../Subscription/subscriptionData";

const StepSubscriptions = ({ formData, handleSubscriptionChange }) => {
  const plans = subscriptionPlans.map(plan => ({
    id: plan.id,
    name: plan.name,
    description: `${plan.subtitle}. ${plan.tokens}`,
    price: plan.price,
    comingSoon: plan.comingSoon,
  }));

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
