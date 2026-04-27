import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Briefcase, Search, Upload } from 'lucide-react';
import './Portal.css';

const Portal = () => {
  const navigate = useNavigate();

  const flowLinks = [
    { name: 'Talent Pool', path: '/Admin/admin-talentpool', icon: Users },
    { name: 'Projects', path: '/Admin/admin-projects', icon: Briefcase },
    { name: 'Find Jobs', path: '/Admin/admin-jobs', icon: Search },
    { name: 'Talent Management', path: '/Admin/admin-upload-talent', icon: Upload },
  ];

  return (
    <div className="portal-container">
      <div className="portal-header">
        <h1>Portal Navigation</h1>
        <p>Select your role-based flow to get started</p>
      </div>

      <div className="portal-cards-wrapper">
        {/* Hiring Manager Card */}
        <div className="portal-card">
          <div className="portal-card-header hiring-manager-header">
            <h2>Hiring Manager</h2>
            <p className='text-white'>Access your primary hiring workflows</p>
          </div>
          <div className="portal-card-body">
            <ul className="portal-flow-links">
              {flowLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <li key={index} className="portal-flow-item" onClick={() => navigate(link.path)}>
                    <div className="flow-item-icon">
                      <Icon size={20} />
                    </div>
                    <span className="flow-item-name">{link.name}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Bench Sales Card */}
        <div className="portal-card">
          <div className="portal-card-header bench-sales-header">
            <h2>Bench Sales</h2>
            <p className='text-white'>Access your primary sales workflows</p>
          </div>
          <div className="portal-card-body">
            <ul className="portal-flow-links">
              {flowLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <li key={index} className="portal-flow-item" onClick={() => navigate(link.path)}>
                    <div className="flow-item-icon">
                      <Icon size={20} />
                    </div>
                    <span className="flow-item-name">{link.name}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portal;
