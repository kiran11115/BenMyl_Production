import React from 'react';
import { FiX } from 'react-icons/fi';
import { BsBuilding } from 'react-icons/bs';
import './Jobs.css';

const JobModal = ({ job, onClose }) => {
  if (!job) return null;

  return (
    <>
      <div className="drawer-overlay" />
      <div className="job-drawer card-base">
        <div className="drawer-header">
          <h3>{job.title}</h3>
          <button className="close-btn" onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>

        <div className="drawer-company-info">
          <div className="company-icon-box large">
            <BsBuilding size={28} />
          </div>
          <div>
            <h4 className="text-slate-800 font-bold">{job.company}</h4>
            <p className="text-slate-500 text-sm">San Francisco, CA</p>
          </div>
        </div>

        <div className="drawer-stats">
          <div className="drawer-stat-item">
            <span className="label">Budget</span>
            <span className="value">{job.rateText}</span>
          </div>
          <div className="drawer-stat-item">
            <span className="label">Experience</span>
            <span className="value">{job.experienceText.split(' ')[0]}</span>
          </div>
          <div className="drawer-stat-item">
            <span className="label">Type</span>
            <span className="value">{job.type}</span>
          </div>
        </div>

        <div className="drawer-section">
          <h4>Job Description</h4>
          <p>{job.description}</p>
        </div>

        <div className="drawer-section">
          <h4>Required Skills</h4>
          <div className="skills-cloud">
            {job.skills.map(skill => (
              <span key={skill} className="skill-chip">{skill}</span>
            ))}
          </div>
        </div>

        <div className="drawer-footer">
          <button 
            className="btn-primary full-width"
            onClick={() => alert(`Application started for ${job.title}`)}
          >
            Apply Now
          </button>
        </div>
      </div>
    </>
  );
};

export default JobModal;
