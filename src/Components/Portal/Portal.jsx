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
  CreditCard,
  ArrowRight,
  Activity
} from 'lucide-react';
import './Portal.css';

const Portal = () => {
  const navigate = useNavigate();

  const adminModules = [
    // { name: 'Control Center', path: '/Admin/control-center', icon: Settings, description: 'Global system settings and parameters' },
    { name: 'Role Configuration', path: '/Admin/role-configuration', icon: Shield, description: 'Manage user permissions and access levels' },
    { name: 'Notification', path: '/Admin/notification-policy', icon: BellRing, description: 'Set up alerts and messaging templates' },
    { name: 'Billing', path: '/Admin/admin-subscription', icon: CreditCard, description: 'Manage subscriptions and invoicing' },
    { name: 'Analytics', path: '/Admin/admin-analytics', icon: Activity, description: 'View performance and usage metrics' },
    { name: 'Coming with more features', path: '#', icon: Zap, description: 'Stay tuned for new administrative capabilities' },
  ];

  return (
    <div className="portal-page-wrapper">
      <div className="portal-container">
        
        {/* Top Blue Hero Card */}
        <div className="hero-section-wrapper mb-4">
        <div className="hero-card ">
          <div className="hero-concentric-lines"></div>
          <div className="hero-ripple-pattern"></div>
          <div className="hero-circular-highlights"></div>
          <div className="hero-left">
            <div className="hero-pill">
              ✦ Control Center
            </div>
            <h1 className="job-posting-title text-white">Platform Settings & Control</h1>
            <div className="job-posting-header-info">
              <p className="job-posting-subtitle">
                Configure user roles, notification preferences, billing structures, and system configurations.
              </p>
            </div>
          </div>
          <div className="hero-card-actions-wrapper">
            <div className="portal-header-badge">
              <span>Admin Portal</span>
            </div>
          </div>
                  <div className="hero-illustration">
            <div className="hero-particles">
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
            </div>
            <img src="/Images/Dashboard.png" alt="Dashboard Illustration" className="hero-svg-image" />
          </div>
        </div>
      </div>

        {/* Cards Grid */}
        <div className="admin-grid-wrapper">
          {adminModules.map((module, index) => {
            const Icon = module.icon;
            return (
              <div 
                key={index} 
                className="admin-module-card" 
                onClick={() => module.path !== '#' && navigate(module.path)}
              >
                <div className="card-top-row">
                  <div className="admin-module-icon-wrap">
                    <Icon size={24} className="admin-module-icon" />
                  </div>
                  <div className="card-arrow-wrap">
                    <ArrowRight size={18} className="arrow-icon" />
                  </div>
                </div>
                <div className="admin-module-content">
                  <h3 className="admin-module-title">{module.name}</h3>
                  <p className="admin-module-desc">{module.description}</p>
                </div>
                <div className="card-footer-row">
                  <span className="configure-text">
                    {module.path === '#' ? 'Coming Soon' : 'Configure Settings'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Portal;

