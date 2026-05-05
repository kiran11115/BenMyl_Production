import React from "react";
import {
    CreditCard, Calendar, Users, Zap,
    TrendingUp, Shield, HelpCircle, ArrowRight,
    Check, Sparkles, Sliders, DollarSign
} from "lucide-react";
import "./BillingControl.css";
import ModuleHeader from "../ModuleHeader";

const PLAN_TIERS = [
    {
        id: "starter",
        name: "Starter",
        price: "$299",
        period: "/mo",
        features: ["Up to 5 Users", "Basic AI Matching", "Standard Support", "Audit Logs (30 days)"],
        current: false
    },
    {
        id: "pro",
        name: "Professional",
        price: "$799",
        period: "/mo",
        features: ["Up to 25 Users", "Advanced AI Behavior", "Priority Support", "Unlimited Audit Logs", "Custom Workflows"],
        current: true
    },
    {
        id: "enterprise",
        name: "Enterprise",
        price: "Custom",
        period: "",
        features: ["Unlimited Users", "Full AI Automation", "Dedicated Account Manager", "White-label Options", "SLA Guarantee"],
        current: false
    }
];

function BillingControl() {
    return (
        <div className="billing-container">
            <ModuleHeader
                breadcrumb="Billing Control"
                title="Billing & Subscription Control"
                description="Manage subscription tiers, monitor seat allocation, and configure platform-wide pricing rules."
                badgeText="Financial Governance"
                icon={DollarSign}
                actions={[
                    {
                        label: "Billing History",
                        icon: <Calendar size={16} />,
                        type: "secondary",
                        onClick: () => console.log("History")
                    },
                    {
                        label: "Upgrade Plan",
                        icon: <Zap size={16} />,
                        type: "primary",
                        onClick: () => console.log("Upgrade")
                    }
                ]}
            />

            <div className="billing-overview">
                <div className="overview-card main-plan">
                    <div className="plan-info">
                        <span className="current-badge">CURRENT PLAN</span>
                        <h2>Professional Tier</h2>
                        <p>Renews on May 12, 2024</p>
                    </div>
                    <div className="plan-stats">
                        <div className="stat">
                            <span className="stat-label">Monthly Cost</span>
                            <span className="stat-val">$799.00</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat">
                            <span className="stat-label">Payment Method</span>
                            <span className="stat-val">•••• 4242</span>
                        </div>
                    </div>
                </div>

                <div className="overview-card seats-usage">
                    <div className="seats-header">
                        <div className="title-group">
                            <Users size={20} color="#f97316" />
                            <h3>Seat Allocation</h3>
                        </div>
                        <span className="usage-text">18 / 25 Used</span>
                    </div>
                    <div className="progress-container">
                        <div className="progress-bar" style={{ width: "72%" }}></div>
                    </div>
                    <div className="allocation-details">
                        <div className="detail-item">
                            <span className="dot admin"></span>
                            <span>Admins: 3</span>
                        </div>
                        <div className="detail-item">
                            <span className="dot manager"></span>
                            <span>Managers: 10</span>
                        </div>
                        <div className="detail-item">
                            <span className="dot sales"></span>
                            <span>Sales: 5</span>
                        </div>
                    </div>
                </div>
            </div>

            <section className="tiers-section">
                <div className="section-title">
                    <Sparkles size={20} color="#8b5cf6" />
                    <h3>Available Subscription Tiers</h3>
                </div>
                <div className="plans-grid">
                    {PLAN_TIERS.map((plan) => (
                        <div key={plan.id} className={`plan-card ${plan.current ? "featured" : ""}`}>
                            {plan.current && <div className="active-ribbon">Active</div>}
                            <div className="plan-header">
                                <h4>{plan.name}</h4>
                                <div className="price-group">
                                    <span className="amount">{plan.price}</span>
                                    <span className="period">{plan.period}</span>
                                </div>
                            </div>
                            <ul className="feature-list">
                                {plan.features.map((feature, i) => (
                                    <li key={i}>
                                        <Check size={16} color="#10b981" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <button className={`plan-btn ${plan.current ? "btn-current" : "btn-outline"}`}>
                                {plan.current ? "Manage Plan" : "Switch to " + plan.name}
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            <section className="advanced-billing">
                <div className="section-title">
                    <Sliders size={20} color="#3b82f6" />
                    <h3>Administrative Controls</h3>
                </div>
                <div className="admin-controls-grid">
                    <div className="admin-control-card">
                        <div className="control-info">
                            <h5>Seat Allocation Rules</h5>
                            <p>Restrict the number of 'Bench Sales' seats to 2x the number of 'Hiring Managers'.</p>
                        </div>
                        <label className="toggle-switch">
                            <input type="checkbox" />
                            <span className="slider"></span>
                        </label>
                    </div>
                    <div className="admin-control-card">
                        <div className="control-info">
                            <h5>Global Discount Overrides</h5>
                            <p>Enable the ability for Super Admins to apply custom discounts at checkout.</p>
                        </div>
                        <label className="toggle-switch">
                            <input type="checkbox" defaultChecked />
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default BillingControl;
