import React, { useState } from 'react';
import { FiX, FiCheck, FiEye, FiLoader } from 'react-icons/fi';

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
  const [isSubmitting, setIsSubmitting] = useState(false); // Loader state

  // Toggle selection logic for multi-select
  const handleToggleTalent = (id) => {
    if (isSubmitting) return; // Disable during submit
    setSelectedTalents(prev =>
      prev.includes(id)
        ? prev.filter(tId => tId !== id)
        : [...prev, id]
    );
  };

  const handleDone = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    // 1 second simulated API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="drawer-overlay" style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      background: 'rgba(0,0,0,0.5)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '20px',
      zIndex: 10000 
    }}>
      
      {/* Modal Container */}
      <div className="card-base" style={{ 
        width: 'clamp(350px, 95vw, 1000px)', 
        height: 'clamp(500px, 90vh, 800px)', 
        maxHeight: '90vh', 
        maxWidth: '95vw', 
        padding: '0', 
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden',
        borderRadius: '12px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 'clamp(16px, 2vw, 18px)', color: '#1e293b', fontWeight: 700 }}>Talent Allocation</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>Assign talents to <strong>{job.company}</strong></p>
          </div>
          <button 
            className="close-btn" 
            onClick={onClose} 
            disabled={isSubmitting}
            style={{ 
              border: 'none', 
              background: 'transparent', 
              cursor: isSubmitting ? 'not-allowed' : 'pointer', 
              color: isSubmitting ? '#94a3b8' : '#64748b' 
            }}
          >
            <FiX size={22} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', minHeight: 0 }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr',
            gap: '24px', 
            height: '100%'
          }}>
            
            {/* LEFT: Project Overview + Notes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Project Details */}
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#334155', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '4px', height: '16px', background: '#3b82f6', borderRadius: '2px' }}></span>
                  Project Overview
                </h4>
                <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <h2 style={{ fontSize: 'clamp(18px, 3vw, 20px)', fontWeight: 700, color: '#1e293b', margin: '0 0 8px 0' }}>{job.title}</h2>
                    <span className='status-tag status-progress'>{job.type}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '20px' }}>
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
                  <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6', margin: '0 0 20px 0' }}>{job.description}</p>
                  <h5 style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Required Skills</h5>
                  <div className="skills-cloud" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {job.skills?.map(skill => (
                      <span key={skill} className='status-tag status-progress'>{skill}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Notes TextArea */}
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#334155', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '4px', height: '16px', background: '#8b5cf6', borderRadius: '2px' }}></span>
                  Notes
                </h4>
                <textarea
                  placeholder="Add specific requirements or notes for this allocation..."
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  disabled={isSubmitting}
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
                    color: isSubmitting ? '#94a3b8' : '#334155',
                    background: isSubmitting ? '#f8fafc' : '#fff'
                  }}
                />
              </div>
            </div>

            {/* RIGHT: Talent Selection */}
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                  <span style={{ width: '4px', height: '16px', background: '#10b981', borderRadius: '2px' }}></span>
                  Select Talent
                </h4>
                <span style={{ fontSize: '12px', color: '#64748b', background: '#f1f5f9', padding: '2px 8px', borderRadius: '12px' }}>
                  {selectedTalents.length} Selected
                </span>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#fff', minHeight: 0 }}>
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
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        background: isSelected ? '#f0f9ff' : 'transparent',
                        transition: 'all 0.2s ease',
                        opacity: isSubmitting ? 0.6 : 1
                      }}
                      className="talent-row"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isSubmitting) alert(`Viewing profile: ${profile.name}`);
                        }}
                        className='btn-primary'
                        disabled={isSubmitting}
                        style={{ 
                          padding: '6px 12px', 
                          fontSize: '12px',
                          opacity: isSubmitting ? 0.6 : 1,
                          width: "8rem"
                        }}
                      >
                        View Profile
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Loader */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', background: '#fff', gap: '12px' }}>
          <button 
            onClick={onClose}
            disabled={isSubmitting}
            style={{ 
              padding: '10px 24px', 
              background: '#fff', 
              border: '1px solid #cbd5e1', 
              borderRadius: '6px', 
              color: '#475569', 
              fontWeight: 600, 
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.6 : 1
            }}
          >
            Cancel
          </button>
          
          <button 
            className="btn-primary" 
            onClick={handleDone}
            disabled={isSubmitting}
            style={{ 
              padding: '10px 32px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              width: "12rem",
              opacity: isSubmitting ? 0.7 : 1
            }}
          >
            {isSubmitting ? (
              <>
                <FiLoader className="spin" style={{ animation: 'spin 1s linear infinite' }} size={16} />
                Placing Bid...
              </>
            ) : (
              'Place Bid'
            )}
          </button>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        textarea:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }
        @media (min-width: 768px) {
          .card-base > div > div {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default JobModal;
