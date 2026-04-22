import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import "./ModuleHeader.css";

const ModuleHeader = ({ 
    title, 
    description, 
    breadcrumb, 
    icon: IconComponent, 
    badgeText,
    actions = []
}) => {
    return (
        <header className="module-header-standard">
            <div className="header-left-content">
                <nav className="breadcrumb-nav">
                    <Link to="/Admin/control-center" className="breadcrumb-link">
                        <Home size={14} />
                        Control Center
                    </Link>
                    <ChevronRight size={14} className="breadcrumb-separator" />
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
                {actions.map((action, index) => (
                    <button 
                        key={index} 
                        className={`btn-${action.type || 'secondary'}`} 
                        onClick={action.onClick}
                    >
                        {action.icon}
                        {action.label}
                    </button>
                ))}
            </div>
        </header>
    );
};

export default ModuleHeader;
