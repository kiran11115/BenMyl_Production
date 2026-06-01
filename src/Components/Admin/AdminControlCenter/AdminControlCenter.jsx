import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
    ShieldCheck, CheckCircle, Database, Bell, CreditCard, ArrowRight, Settings2, Search, LayoutDashboard, UserPlus
} from "lucide-react";
import "./AdminControlCenter.css";

const ADMIN_MODULES = [
    {
        id: "role-config",
        title: "Role Configuration Center",
        description: "Control access levels and permissions for Hiring Managers, Bench Sales, and Custom roles.",
        icon: <ShieldCheck size={20} />,
        path: "/Admin/role-configuration",
        category: "Governance"
    },
    {
        id: "create-user",
        title: "Create User / Team Member",
        description: "Invite new team members, assign initial roles, and configure seat allocations.",
        icon: <UserPlus size={20} />,
        path: "/Admin/account-settings",
        state: { activeTab: "team" },
        category: "Governance"
    },
    /* {
        id: "approval-panel",
        title: "Approval Control Panel",
        description: "Establish approval chains, set threshold conditions, and monitor pending decisions.",
        icon: <CheckCircle size={20} />,
        path: "/Admin/approval-control",
        category: "Governance"
    },
    {
        id: "master-data",
        title: "Master Data Management",
        description: "Standardize platform-wide skills, industries, locations, and tagging categories.",
        icon: <Database size={20} />,
        path: "/Admin/master-data",
        category: "System"
    }, */
    {
        id: "notification-policy",
        title: "Notification Policy Manager",
        description: "Configure system-wide triggers, role-based alerts, and escalation workflows.",
        icon: <Bell size={20} />,
        path: "/Admin/notification-policy",
        category: "System"
    },
    {
        id: "billing-subscription",
        title: "Billing & Subscription Control",
        description: "Manage subscription plans, seat allocations, and pricing tier overrides.",
        icon: <CreditCard size={20} />,
        path: "/Admin/billing-control",
        category: "Governance"
    }
];

function AdminControlCenter() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("alphabetical");

    const filteredAndSortedModules = useMemo(() => {
        let result = ADMIN_MODULES.filter(module => 
            module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            module.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            module.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (sortBy === "alphabetical") {
            result.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortBy === "category") {
            result.sort((a, b) => a.category.localeCompare(b.category));
        }

        return result;
    }, [searchTerm, sortBy]);

    const groupedModules = useMemo(() => {
        const groups = {};
        filteredAndSortedModules.forEach(module => {
            if (!groups[module.category]) {
                groups[module.category] = [];
            }
            groups[module.category].push(module);
        });
        return groups;
    }, [filteredAndSortedModules]);

    return (
        <div className="admin-cc-container">
            <header className="admin-cc-header">
                <div className="header-info">
                    <div className="header-icon-badge">
                        <Settings2 size={24} />
                    </div>
                    <div>
                        <h1>Admin Control Center</h1>
                        <p>Configure platform-wide settings and governance policies.</p>
                    </div>
                </div>

                <div className="cc-toolbar">
                    <div className="search-wrapper">
                        <Search size={16} />
                        <input 
                             type="text" 
                             placeholder="Search modules..." 
                             value={searchTerm}
                             onChange={(e) => setSearchTerm(e.target.value)}
                         />
                     </div>
                     <div className="category-stats">
                         {Object.keys(groupedModules).length} Categories Active
                     </div>
                 </div>
             </header>
 
             <div className="admin-cc-content">
                 {Object.keys(groupedModules).sort().map((category) => (
                     <section key={category} className="category-section">
                         <div className="category-header">
                             <div className="category-status"></div>
                             <h2>{category}</h2>
                             <span className="module-count">{groupedModules[category].length} Modules</span>
                         </div>
                         <div className="admin-cc-grid">
                             {groupedModules[category].map((module) => (
                                 <div 
                                     key={module.id} 
                                     className="module-card"
                                     onClick={() => navigate(module.path, { state: module.state })}
                                 >
                                    <div className="card-top">
                                        <div className="module-icon">
                                            {module.icon}
                                        </div>
                                        <ArrowRight size={14} className="arrow-icon" />
                                    </div>
                                    <div className="card-content">
                                        <h3>{module.title}</h3>
                                        <p>{module.description}</p>
                                    </div>
                                    <div className="card-footer">
                                        <span className="configure-text">Configure Settings</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
            
            {filteredAndSortedModules.length === 0 && (
                <div className="no-results">
                    <p>No modules found matching your search.</p>
                </div>
            )}
        </div>
    );
}

export default AdminControlCenter;
