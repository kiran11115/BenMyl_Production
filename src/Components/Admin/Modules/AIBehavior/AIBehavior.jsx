import React, { useState } from "react";
import { 
    Bot, Cpu, Zap, Eye, Target, 
    Sparkles, Settings, Save, RotateCcw,
    MessageSquare, FileText, BarChart3, Shield
} from "lucide-react";
import "./AIBehavior.css";
import ModuleHeader from "../ModuleHeader";

function AIBehavior() {
    const [automationLevels, setAutomationLevels] = useState({
        matching: "assisted",
        outreach: "manual",
        screening: "full",
        analytics: "assisted"
    });

    return (
        <div className="ai-behavior-container">
            <ModuleHeader 
                breadcrumb="AI Behavior"
                title="AI Behavior Settings"
                description="Configure how the intelligent assistant interacts with platform data and users."
                badgeText="AI Governance"
                icon={Sparkles}
                actions={[
                    { 
                        label: "Defaults", 
                        icon: <RotateCcw size={16} />, 
                        type: "secondary",
                        onClick: () => console.log("Defaults")
                    },
                    { 
                        label: "Apply Settings", 
                        icon: <Save size={16} />, 
                        type: "primary",
                        onClick: () => console.log("Applied")
                    }
                ]}
            />

            <div className="ai-content-grid">
                <section className="feature-matrix">
                    <h3>Active AI Power-Ups</h3>
                    <div className="feature-cards">
                        <div className="ai-feature-card">
                            <div className="feature-icon outreach">
                                <MessageSquare size={20} />
                            </div>
                            <div className="feature-info">
                                <h5>Auto-Outreach Generation</h5>
                                <p>Generate personalized LinkedIn & Email content based on talent profile.</p>
                            </div>
                            <label className="toggle-switch">
                                <input type="checkbox" defaultChecked />
                                <span className="slider"></span>
                            </label>
                        </div>

                        <div className="ai-feature-card">
                            <div className="feature-icon screening">
                                <Shield size={20} />
                            </div>
                            <div className="feature-info">
                                <h5>Resume Sentiment Analysis</h5>
                                <p>Extract soft skills and sentiment from project experience sections.</p>
                            </div>
                            <label className="toggle-switch">
                                <input type="checkbox" defaultChecked />
                                <span className="slider"></span>
                            </label>
                        </div>

                        <div className="ai-feature-card">
                            <div className="feature-icon enrichment">
                                <FileText size={20} />
                            </div>
                            <div className="feature-info">
                                <h5>Job Description Enrichment</h5>
                                <p>Auto-fill missing requirements and tech stacks for new job posts.</p>
                            </div>
                            <label className="toggle-switch">
                                <input type="checkbox" />
                                <span className="slider"></span>
                            </label>
                        </div>

                        <div className="ai-feature-card">
                            <div className="feature-icon insights">
                                <BarChart3 size={20} />
                            </div>
                            <div className="feature-info">
                                <h5>Market Rate Forecasting</h5>
                                <p>Suggest optimal bill rates based on current market trends & skills.</p>
                            </div>
                            <label className="toggle-switch">
                                <input type="checkbox" defaultChecked />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                </section>

                <section className="automation-levels">
                    <h3>Automation Strategy</h3>
                    <div className="levels-grid">
                        {Object.keys(automationLevels).map((key) => (
                            <div key={key} className="level-card">
                                <div className="level-header">
                                    <Cpu size={18} />
                                    <span className="capitalize">{key} Management</span>
                                </div>
                                <div className="radio-group">
                                    <label className={`radio-opt ${automationLevels[key] === "manual" ? "selected" : ""}`}>
                                        <input 
                                            type="radio" 
                                            name={key} 
                                            value="manual" 
                                            checked={automationLevels[key] === "manual"}
                                            onChange={(e) => setAutomationLevels({...automationLevels, [key]: e.target.value})}
                                        />
                                        <span>Manual</span>
                                    </label>
                                    <label className={`radio-opt ${automationLevels[key] === "assisted" ? "selected" : ""}`}>
                                        <input 
                                            type="radio" 
                                            name={key} 
                                            value="assisted"
                                            checked={automationLevels[key] === "assisted"}
                                            onChange={(e) => setAutomationLevels({...automationLevels, [key]: e.target.value})}
                                        />
                                        <span>Assisted</span>
                                    </label>
                                    <label className={`radio-opt ${automationLevels[key] === "full" ? "selected" : ""}`}>
                                        <input 
                                            type="radio" 
                                            name={key} 
                                            value="full"
                                            checked={automationLevels[key] === "full"}
                                            onChange={(e) => setAutomationLevels({...automationLevels, [key]: e.target.value})}
                                        />
                                        <span>Fully Auto</span>
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="scope-config">
                    <div className="section-title-group">
                        <Target size={20} />
                        <h3>AI Suggestion Scope</h3>
                    </div>
                    <div className="scope-pills">
                        {["Talent Recommendations", "Job Post Optimization", "Salary Benchmarking", "Retention Risk Alerts", "Interview Question Generation"].map((scope) => (
                            <div key={scope} className="scope-pill">
                                <span>{scope}</span>
                                <button className="pill-toggle active"></button>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default AIBehavior;
