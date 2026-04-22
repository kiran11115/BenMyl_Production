import React, { useState } from "react";
import { 
    SlidersHorizontal, Save, RotateCcw, Target, 
    Zap, Calculator, BrainCircuit, BarChart3, 
    Info, Search, AlertCircle
} from "lucide-react";
import "./MatchingRules.css";
import ModuleHeader from "../ModuleHeader";

function MatchingRules() {
    const [weights, setWeights] = useState({
        skills: 45,
        experience: 30,
        rate: 15,
        availability: 10
    });

    const [threshold, setThreshold] = useState(75);
    const [autoMatchEnabled, setAutoMatchEnabled] = useState(true);

    const handleWeightChange = (key, value) => {
        setWeights(prev => ({
            ...prev,
            [key]: parseInt(value)
        }));
    };

    return (
        <div className="matching-rules-container">
            <ModuleHeader 
                breadcrumb="Matching Rules"
                title="Matching Rules Configuration"
                description="Define the weights and logic used by the AI to match talent with job requirements."
                badgeText="Intelligence Engine"
                icon={BrainCircuit}
                actions={[
                    { 
                        label: "Reset", 
                        icon: <RotateCcw size={16} />, 
                        type: "secondary",
                        onClick: () => console.log("Reset")
                    },
                    { 
                        label: "Save Logic", 
                        icon: <Save size={16} />, 
                        type: "primary",
                        onClick: () => console.log("Saved")
                    }
                ]}
            />

            <div className="matching-content">
                <div className="weightage-section">
                    <div className="section-title-group">
                        <Calculator size={20} color="#f97316" />
                        <h3>Core Weightage (%)</h3>
                        <div className="total-badge" style={{ backgroundColor: (weights.skills + weights.experience + weights.rate + weights.availability === 100) ? "#dcfce7" : "#fee2e2", color: (weights.skills + weights.experience + weights.rate + weights.availability === 100) ? "#166534" : "#991b1b" }}>
                            Total: {weights.skills + weights.experience + weights.rate + weights.availability}%
                        </div>
                    </div>

                    <div className="weight-sliders">
                        <div className="slider-card">
                            <div className="slider-header">
                                <label>Technical Skills</label>
                                <span className="weight-val">{weights.skills}%</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" max="100" 
                                value={weights.skills}
                                onChange={(e) => handleWeightChange("skills", e.target.value)}
                            />
                            <p className="slider-desc">Matches based on primary and secondary skill proficiencies.</p>
                        </div>

                        <div className="slider-card">
                            <div className="slider-header">
                                <label>Industry Experience</label>
                                <span className="weight-val">{weights.experience}%</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" max="100" 
                                value={weights.experience}
                                onChange={(e) => handleWeightChange("experience", e.target.value)}
                            />
                            <p className="slider-desc">Years of experience in specific domains and industries.</p>
                        </div>

                        <div className="slider-card">
                            <div className="slider-header">
                                <label>Rate Competitive Level</label>
                                <span className="weight-val">{weights.rate}%</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" max="100" 
                                value={weights.rate}
                                onChange={(e) => handleWeightChange("rate", e.target.value)}
                            />
                            <p className="slider-desc">Proximity to client budget and market standard rates.</p>
                        </div>

                        <div className="slider-card">
                            <div className="slider-header">
                                <label>Availability & Urgency</label>
                                <span className="weight-val">{weights.availability}%</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" max="100" 
                                value={weights.availability}
                                onChange={(e) => handleWeightChange("availability", e.target.value)}
                            />
                            <p className="slider-desc">Notice period and immediate availability status.</p>
                        </div>
                    </div>
                </div>

                <div className="logic-grid">
                    <div className="logic-card threshold-card">
                        <div className="card-icon-title">
                            <Target size={20} color="#3b82f6" />
                            <h4>Auto-Match Threshold</h4>
                        </div>
                        <div className="threshold-selector">
                            <span className="threshold-val">{threshold}%</span>
                            <input 
                                type="range" 
                                min="50" max="95" 
                                value={threshold}
                                onChange={(e) => setThreshold(e.target.value)}
                            />
                        </div>
                        <p className="card-info-text">
                            <Info size={14} />
                            Candidates below this score will not be auto-suggested.
                        </p>
                    </div>

                    <div className="logic-card feature-card">
                        <div className="card-header">
                            <div className="card-icon-title">
                                <Zap size={20} color="#f59e0b" />
                                <h4>Auto-Suggestions</h4>
                            </div>
                            <label className="toggle-switch">
                                <input type="checkbox" checked={autoMatchEnabled} onChange={() => setAutoMatchEnabled(!autoMatchEnabled)} />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <p className="card-desc">Instantly populate project shortlists when a new job is posted.</p>
                    </div>
                </div>

                <div className="ranking-tuning">
                    <div className="section-title-group">
                        <BarChart3 size={20} color="#8b5cf6" />
                        <h3>Advanced Ranking Tuning</h3>
                    </div>
                    
                    <div className="tuning-options">
                        <div className="tuning-item">
                            <div className="tuning-info">
                                <h5>Prioritize Local Talent</h5>
                                <p>Give a 10% boost to candidates within 50 miles of job location.</p>
                            </div>
                            <label className="toggle-switch">
                                <input type="checkbox" defaultChecked />
                                <span className="slider"></span>
                            </label>
                        </div>

                        <div className="tuning-item">
                            <div className="tuning-info">
                                <h5>Diversity & Inclusion Boost</h5>
                                <p>Apply balancing logic to ensure a diverse candidate slate.</p>
                            </div>
                            <label className="toggle-switch">
                                <input type="checkbox" />
                                <span className="slider"></span>
                            </label>
                        </div>

                        <div className="tuning-item">
                            <div className="tuning-info">
                                <h5>Prioritize Internal Talent</h5>
                                <p>Higher rank for candidates already on-bench vs external pool.</p>
                            </div>
                            <label className="toggle-switch">
                                <input type="checkbox" defaultChecked />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            
            {(weights.skills + weights.experience + weights.rate + weights.availability !== 100) && (
                <div className="error-banner">
                    <AlertCircle size={18} />
                    <span>Warning: Total weightage must equal exactly 100%. Current sum: {weights.skills + weights.experience + weights.rate + weights.availability}%</span>
                </div>
            )}
        </div>
    );
}

export default MatchingRules;
