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
        <header className="module-header-standard">
            <div className="header-left-content">
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
                            <div onClick={() => navigate(-1)} className="breadcrumb-link">
                                <Home size={14} />
                                Control Center
                            </div>
                            <ChevronRight size={14} className="breadcrumb-separator" />
                        </>
                    )}
                    <span className="breadcrumb-current">{breadcrumb}</span>
                </nav>

                <div className="title-section">
                    {badgeText && (
                        <div className="header-badge-standard">
                            {IconComponent && <IconComponent size={14} />}
                            {badgeText}
                        </div>
                    )}
                    <h1>{title}</h1>
                    <p>{description}</p>
                </div>
            </div>

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
        </header>
    );
};

export default ModuleHeader;
