import React from 'react';
import { GiCheckMark } from "react-icons/gi";
import { FiMapPin, FiMail, FiStar, FiBriefcase, FiClock, FiActivity } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';

const TalentGridView = ({ candidates, onShortlist, activeJobId, activeJobColor, shortlistedMap }) => {

  const navigate = useNavigate();

  return (
    <div className="jobs-grid">
      {candidates.map(candidate => {
        // Check if shortlisted
        const isShortlisted = activeJobId && shortlistedMap[activeJobId]?.find(c => c.id === candidate.id);
    

        return (
          <div key={candidate.id} className="project-card">
            
            {/* 1. Header: Avatar, Name, Rating */}
            <div className="card-header">
              <img src={candidate.avatar} alt={candidate.name} className="avatar" />
              <div className="header-info">
                <div className="name-row">
                  <h4 className="name">{candidate.name} {candidate.verified}</h4>
                  <div className="rating">
                    <FiStar size={12} fill="#f59e0b" color="#f59e0b" />
                    <span style={{ color:"#f59e0b" }}>{candidate.rating}</span>
                  </div>
                </div>
                <div className="role">{candidate.role}</div>
              </div>
            </div>

            {/* 2. Meta Info: Exp, Location, Email */}
            <div className="meta-grid">
              <div className="meta-item">
                <FiBriefcase size={14} /> <span>{candidate.experience}</span>
              </div>
              <div className="meta-item">
                <FiMapPin size={14} /> <span>{candidate.location}</span>
              </div>
            </div>

            {/* Availability Badges */}
            <div className="badges-row">
              
              {/* Availability Badges */}
              {candidate.availability.map((avail, idx) => (
                <span key={idx} className="status-tag status-completed">
                  <FiClock size={12} /> {avail}
                </span>
              ))}
            </div>

            {/* 4. Skills Tags */}
            <div className="skills-row">
              {candidate.skills.slice(0, 4).map(skill => (
                <span key={skill} className="status-tag status-progress">{skill}</span>
              ))}
              {candidate.skills.length > 4 && <span className="skill-tag count">+{candidate.skills.length - 4}</span>}
            </div>

            {/* 5. Action Button */}
            <div className="d-flex gap-3">
 
            <button  onClick={() => navigate("/user/user-talent-profile")} className='btn-primary'>
             View Profile
            </button>

              <button 
                onClick={() => onShortlist(candidate)}
                style={{
                  borderColor: activeJobId ? activeJobColor : '#cbd5e1',
                  backgroundColor: isShortlisted ? activeJobColor : 'transparent',
                  color: isShortlisted ? 'white' : (activeJobId ? activeJobColor : '#64748b'),
                }}
                className="btn-secondary"
              >
                {isShortlisted ? 'Shortlisted' : 'Shortlist'}
              </button>
            </div>

            {/* Internal CSS for this component */}
            <style jsx>{`          
              /* Header */
              .card-header { display: flex; gap: 12px; align-items: flex-start; }
              .avatar { width: 52px; height: 52px; border-radius: 50%; object-fit: cover; border: 2px solid #f8fafc; }
              .header-info { flex: 1; }
              .name-row { display: flex; justify-content: space-between; align-items: center; }
              .name { margin: 0; font-size: 16px; font-weight: 700; color: #1e293b; display: flex; align-items: center; gap: 6px; }
              .role { font-size: 13px; color: #6366f1; font-weight: 500; margin-top: 2px; }
              .rating { display: flex; align-items: center; gap: 4px; font-size: 13px; font-weight: 600; color: #475569; background: #fffbeb; padding: 2px 6px; border-radius: 4px; }

              /* Meta Grid */
              .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 12px; font-size: 12px; color: #64748b; }
              .meta-item { display: flex; align-items: center; gap: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
              .meta-item.full-width { grid-column: span 2; }
              
              /* Badges */
              .badges-row { display: flex; flex-wrap: wrap; gap: 8px; }
              .badge { display: flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; }
              .avail-badge { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }

              /* Skills */
              .skills-row { display: flex; flex-wrap: wrap; gap: 6px; }
              .skill-tag { background: #f1f5f9; color: #475569; font-size: 12px; padding: 3px 8px; border-radius: 4px; font-weight: 500; }
              .skill-tag.count { background: #e2e8f0; color: #64748b; }

            `}</style>
          </div>
        );
      })}
    </div>
  );
};

export default TalentGridView;
