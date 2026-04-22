import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./ComingSoon.css";

function ComingSoonModule({ title, description }) {
    const navigate = useNavigate();

    return (
        <div className="coming-soon-wrapper">
            <button className="back-btn" onClick={() => navigate("/Admin/control-center")}>
                <ArrowLeft size={16} />
                Back to Control Center
            </button>
            
            <div className="coming-soon-content">
                <div className="cs-illustration">
                    <img src="/Images/ComingSoon.svg" alt="Coming Soon" onError={(e) => e.target.src = "https://illustrations.popsy.co/amber/working-from-home.svg"} />
                </div>
                <h1>{title}</h1>
                <p>{description || "We're currently building this module to give you more control over your platform. Stay tuned for updates!"}</p>
                
                <div className="status-badge">
                    <span className="pulse"></span>
                    Under Development
                </div>
            </div>
        </div>
    );
}

export default ComingSoonModule;
