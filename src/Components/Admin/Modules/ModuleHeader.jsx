import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import "./ModuleHeader.css";
import { useNavigate } from "react-router-dom";

const ModuleHeader = ({ 
    title, 
    description, 
    breadcrumb, 
    icon: IconComponent, 
    badgeText,
    actions = [],
    customBreadcrumbs = []
}) => {

    const navigate = useNavigate();

    return (
        <div className="hero-card mb-4 module-hero-header">
            <div className="hero-left">
                <nav className="breadcrumb-nav">
                    {customBreadcrumbs.length > 0 ? (
                        customBreadcrumbs.map((cb, idx) => (
                            <React.Fragment key={idx}>
                                <Link to={cb.path} className="breadcrumb-link">
                                    {cb.icon}
                                    {cb.label}
                                </Link>
                                <ChevronRight size={14} className="breadcrumb-separator" />
                            </React.Fragment>
                        ))
                    ) : (
                        <>
                            <div onClick={() => navigate(-1)} className="breadcrumb-link" style={{ cursor: 'pointer' }}>
                                <Home size={14} />
                                Control Center
                            </div>
                            <ChevronRight size={14} className="breadcrumb-separator" />
                        </>
                    )}
                    <span className="breadcrumb-current">{breadcrumb}</span>
                </nav>

                <div className="title-section" style={{ marginTop: '12px' }}>
                    {badgeText && (
                        <div className="hero-pill mb-2">
                            {IconComponent && <IconComponent size={14} style={{ marginRight: '6px' }} />}
                            {badgeText}
                        </div>
                    )}
                    <h1 className="job-posting-title text-white">{title}</h1>
                    <p className="job-posting-subtitle">{description}</p>
                </div>
            </div>

            <div className="hero-card-actions-wrapper">
                <div className="header-right-actions">
                    {actions.map((action, index) => {
                        if (action.customElement) {
                            return <React.Fragment key={index}>{action.customElement}</React.Fragment>;
                        }
                        return (
                            <button 
                                key={index} 
                                className={`btn-${action.type || 'secondary'}`} 
                                onClick={action.onClick}
                            >
                                {action.icon}
                                {action.label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ModuleHeader;
