import React, { useState } from 'react';
import { FiX, FiTrash2, FiUser, FiCheck, FiEye } from 'react-icons/fi';

// Mock Data for Talent Profiles inside Modal
const TALENT_PROFILES = [
  { id: 1, name: "Emily Davis", role: "DevOps Engineer", avatar: "https://i.pravatar.cc/150?u=1" },
  { id: 2, name: "Michael Chen", role: "Project Manager", avatar: "https://i.pravatar.cc/150?u=2" },
  { id: 3, name: "James Williams", role: "Data Scientist", avatar: "https://i.pravatar.cc/150?u=3" },
  { id: 4, name: "Olivia Martinez", role: "Product Owner", avatar: "https://i.pravatar.cc/150?u=4" },
  { id: 5, name: "Sarah Wilson", role: "Frontend Dev", avatar: "https://i.pravatar.cc/150?u=5" },
];

const JobModal = ({ job, onClose }) => {
  const [selectedTalents, setSelectedTalents] = useState([]);
  const [customNote, setCustomNote] = useState("");

  // Toggle selection logic for multi-select
  const handleToggleTalent = (id) => {
    setSelectedTalents(prev =>
      prev.includes(id)
        ? prev.filter(tId => tId !== id) // Remove if exists
        : [...prev, id] // Add if new
    );
  };

  const handleDone = () => {
    // Simply close without loading state
    onClose();
  };

  return (
    <div className="drawer-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* Modal Container - Static Large Size */}
      <div className="card-base" style={{ 
        width: '1000px', 
        height: '800px', 
        maxHeight: '90vh', 
        maxWidth: '95vw', 
        padding: '0', 
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden' 
      }}>
        
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b', fontWeight: 700 }}>Talent Allocation</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>Assign talents to <strong>{job.company}</strong></p>
          </div>
          <button className="close-btn" onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}>
            <FiX size={22} />
          </button>
        </div>

        {/* Scrollable Body - Grid Layout */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', height: '100%' }}>
            
            {/* LEFT COLUMN: Project Overview + Notes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Project Details Box */}
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#334155', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '4px', height: '16px', background: '#3b82f6', borderRadius: '2px', display: 'block' }}></span>
                  Project Overview
                </h4>
                
                <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                  <div style={{ marginBottom: '16px' }}>
                     <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: '0 0 8px 0' }}>{job.title}</h2>
                     <span className='status-tag status-progress'>
                       {job.type}
                     </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                    <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <span style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Budget Rate</span>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{job.rateText}</span>
                    </div>
                    <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <span style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Experience</span>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{job.experienceText}</span>
                    </div>
                  </div>

                  <h5 style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Description</h5>
                  <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6', margin: '0 0 20px 0' }}>
                    {job.description}
                  </p>

                  <h5 style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Required Skills</h5>
                  <div className="skills-cloud" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {job.skills?.map(skill => (
                      <span key={skill} className='status-tag status-progress'>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Custom Note TextArea */}
              <div>
                 <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#334155', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '4px', height: '16px', background: '#8b5cf6', borderRadius: '2px', display: 'block' }}></span>
                    Notes
                 </h4>
                 <textarea
                    placeholder="Add specific requirements or notes for this allocation..."
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    style={{
                      width: '100%',
                      minHeight: '120px',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                      outline: 'none',
                      color: '#334155',
                      background: '#fff'
                    }}
                 />
              </div>

            </div>


            {/* RIGHT COLUMN: Talent Selection (Multi-Select) */}
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                  <span style={{ width: '4px', height: '16px', background: '#10b981', borderRadius: '2px', display: 'block' }}></span>
                  Select Talent
                </h4>
                <span style={{ fontSize: '12px', color: '#64748b', background: '#f1f5f9', padding: '2px 8px', borderRadius: '12px' }}>
                  {selectedTalents.length} Selected
                </span>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#fff' }}>
                {TALENT_PROFILES.map((profile) => {
                  const isSelected = selectedTalents.includes(profile.id);
                  return (
                    <div 
                      key={profile.id} 
                      onClick={() => handleToggleTalent(profile.id)}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        padding: '16px',
                        borderBottom: '1px solid #f1f5f9',
                        cursor: 'pointer',
                        background: isSelected ? '#f0f9ff' : 'transparent',
                        transition: 'all 0.2s ease'
                      }}
                      className="talent-row"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {/* Checkbox Visual */}
                        <div style={{ 
                          width: '20px', height: '20px', 
                          borderRadius: '4px', 
                          border: isSelected ? 'none' : '2px solid #cbd5e1',
                          background: isSelected ? '#3b82f6' : '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: '0.2s'
                        }}>
                          {isSelected && <FiCheck size={14} color="#fff" />}
                        </div>

                        <img 
                          src={profile.avatar} 
                          alt={profile.name} 
                          style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #e2e8f0' }} 
                        />
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{profile.name}</div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>{profile.role}</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {/* View Profile Button */}
                          <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                alert(`Viewing profile: ${profile.name}`);
                            }}
                          className='btn-primary w-100'
                          >
                            View Profile
                          </button>

                          {/* Delete Button (Contextual) */}
                          {/* <button 
                              onClick={(e) => {
                                  e.stopPropagation(); 
                                  alert(`Removed ${profile.name}`);
                              }}
                              style={{ 
                              border: 'none', 
                              background: 'transparent', 
                              padding: '8px',
                              borderRadius: '6px', 
                              display: 'flex', alignItems: 'center', justifyContent: 'center', 
                              cursor: 'pointer',
                              color: '#94a3b8'
                              }}
                              title="Remove Candidate"
                          >
                              <FiTrash2 size={16} />
                          </button> */}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', background: '#fff', gap: '12px' }}>
          <button 
            onClick={onClose}
            style={{ 
              padding: '10px 24px', 
              background: '#fff', 
              border: '1px solid #cbd5e1', 
              borderRadius: '6px', 
              color: '#475569', 
              fontWeight: 600, 
              cursor: 'pointer' 
            }}
          >
            Cancel
          </button>
          
          <button 
            className="btn-primary" 
            onClick={handleDone}
            style={{ 
              padding: '10px 32px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px'
            }}
          >
            Place Bid
          </button>
        </div>

      </div>

      {/* Styles for scrollbar */}
      <style>{`
        /* Custom scrollbar for modal content */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; borderRadius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        
        textarea:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }
      `}</style>
    </div>
  );
};

export default JobModal;
