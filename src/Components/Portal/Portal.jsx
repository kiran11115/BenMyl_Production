import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, 
  Shield, 
  GitMerge, 
  CheckSquare, 
  Database, 
  FileCheck, 
  Zap, 
  BellRing, 
  CreditCard 
} from 'lucide-react';
import './Portal.css';

const Portal = () => {
  const navigate = useNavigate();

  const adminModules = [
    // { name: 'Control Center', path: '/Admin/control-center', icon: Settings, description: 'Global system settings and parameters' },
    { name: 'Role Configuration', path: '/Admin/role-configuration', icon: Shield, description: 'Manage user permissions and access levels' },
    { name: 'Notification', path: '/Admin/notification-policy', icon: BellRing, description: 'Set up alerts and messaging templates' },
    { name: 'Billing', path: '/Admin/billing-control', icon: CreditCard, description: 'Manage subscriptions and invoicing' },
    { name: 'Coming with more features', path: '#', icon: Zap, description: 'Stay tuned for new administrative capabilities' },
  ];

  return (
    <div className="portal-container">
      <div className="portal-header">
        <h1>Control Center</h1>
        <p>Manage platform configurations, security, and global settings</p>
      </div>

      <div className="admin-grid-wrapper">
        {adminModules.map((module, index) => {
          const Icon = module.icon;
          return (
            <div key={index} className="admin-module-card" onClick={() => navigate(module.path)}>
              <div className="admin-module-icon-wrap">
                <Icon size={28} className="admin-module-icon" />
              </div>
              <div className="admin-module-content">
                <h3 className="admin-module-title">{module.name}</h3>
                <p className="admin-module-desc">{module.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Portal;

