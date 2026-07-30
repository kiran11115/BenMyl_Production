import React, { useState, useEffect } from 'react';
import { Sparkles, Search, FileText, CheckCircle, Activity, ChevronDown, Mic, Volume2, Send, PieChart, Settings } from 'lucide-react';
import { CandidateCard } from '../../UploadTalent/UserTalentGrid';
import '../../UserProjects/Projects.css';
import '../../TalentPool/TalentPool.css';
import './AIScreen.css';

const AIScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [activeCardId, setActiveCardId] = useState('find');

  const handleCloseIntro = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setShowIntro(false);
    }, 500); // Wait for CSS transition to finish
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleCloseIntro();
    }, 4000); // 4 seconds auto-fade
    return () => clearTimeout(timer);
  }, []);

  // Mock data for Find Resources
  const foundResources = [
    { id: '1', name: 'Rahul Sharma', match: 96, availability: 'Available Now', role: 'Full Stack Developer', exp: '6 Years', skills: ['React', 'Node.js', 'Azure'] },
    { id: '2', name: 'Priya Singh', match: 92, availability: 'Available in 5 Days', role: 'Frontend Developer', exp: '5 Years', skills: ['React', 'CSS', 'HTML'] },
    { id: '3', name: 'Amit Kumar', match: 89, availability: 'Available Immediately', role: 'React Developer', exp: '4 Years', skills: ['React', 'Redux', 'TypeScript'] },
  ];

  const cardsData = [
    { id: 'find', title: 'Find Resources', color: '#e0f2fe', borderColor: '#0369a1', icon: Search, text: 'Locate bench resources using natural language instead of manually applying multiple filters.', placeholder: 'E.g., Find a Senior React Developer with Azure experience, available immediately for a 6-month contract...' },
    { id: 'summary', title: 'AI Resource Summary', color: '#fef3c7', borderColor: '#b45309', icon: FileText, text: 'Generate intelligent professional summaries highlighting key skills, experience, and availability.', placeholder: 'E.g., Summarize the professional profile of candidates with 5+ years of React experience...' },
    { id: 'match', title: 'Smart Match', color: '#dcfce7', borderColor: '#15803d', icon: CheckCircle, text: 'Compare job requirements with profiles to generate match scores, missing skills, and rank suitability.', placeholder: 'E.g., Match job requirement #402 with available candidates...' }
  ];

  const activeCard = cardsData.find(c => c.id === activeCardId) || cardsData[0];

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setShowResults(false);
    setTimeout(() => {
      setIsSearching(false);
      setShowResults(true);
    }, 1500);
  };

  return (
    <>
      {showIntro && (
        <div className={`ai-intro-screen ${isFadingOut ? 'fade-out' : ''}`}>
          <div className="ai-intro-left">
            <div className="ai-intro-blob-container">
              <div className="ai-intro-blob"></div>
              <div className="ai-intro-blob-2"></div>
            </div>
          </div>
          <div className="ai-intro-right">

            <div className="ai-intro-content">
              <h1 className="ai-intro-title">Build a <span>talent team</span> that can <span>build anything.</span></h1>
              <p className="ai-intro-desc">Our intelligent AI analyzes real-world requirements, delivering real-time insights that instantly level up your hiring processes.</p>
              <button className="ai-intro-cta" onClick={handleCloseIntro}>Start matching free</button>
            </div>
          </div>
        </div>
      )}

      <div className="jillo-container">
        <div className="jillo-main-content">
          <div className="jillo-center-wrapper">
            {!showResults && !isSearching ? (
              <>
                <div className="jillo-sparkle-logo">
                  <Sparkles size={24} color="#0f172a" />
                </div>
                <h1 className="jillo-greeting">What's on your mind?</h1>
              </>
            ) : (
              showResults && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px', marginTop: '20px', textAlign: 'center' }}>
                  <div className="jillo-sparkle-logo" style={{ marginBottom: '16px' }}>
                    <Sparkles size={24} color="#a855f7" />
                  </div>
                  <h1 className="jillo-greeting" style={{ marginBottom: '10px' }}>Here are your top matches</h1>
                  <p style={{ color: '#64748b', fontSize: '15px' }}>Based on your requirements, I've found these resources.</p>
                </div>
              )
            )}

            <div className="jillo-input-box">
              <div className="jillo-input-header" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={14} color={activeCard.borderColor} />
                  <span style={{ color: activeCard.borderColor, fontWeight: 600 }}>{activeCard.title}</span>
                </div>
                {(searchQuery || showResults) && (
                  <button 
                    onClick={() => { setSearchQuery(''); setShowResults(false); setIsSearching(false); setActiveCardId('find'); }} 
                    style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '13px', cursor: 'pointer', fontWeight: 500, textDecoration: 'underline' }}
                  >
                    Reset
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input 
                  type="text"
                  className="jillo-textarea" 
                  placeholder={activeCard.placeholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isSearching && searchQuery.trim()) {
                      e.preventDefault();
                      handleSearch();
                    }
                  }}
                  style={{ minHeight: '40px', marginBottom: 0, flex: 1 }}
                />
                <button className="jillo-send-btn" onClick={handleSearch} disabled={isSearching || !searchQuery.trim()} style={{ backgroundColor: activeCard.borderColor, flexShrink: 0 }}>
                  {isSearching ? <Activity className="ai-spin" size={14} color="#fff" /> : <Send size={14} color="#fff" />}
                </button>
              </div>
            </div>

            {!showResults && !isSearching && (
              <>
                <div className="jillo-tags">
                  <span className="jillo-tag"><Search size={12} /> Top Rated</span>
                  <span className="jillo-tag"><Activity size={12} /> Available Now</span>
                  <span className="jillo-tag"><FileText size={12} /> Contractors</span>
                  <span className="jillo-tag"><PieChart size={12} /> Full-Time</span>
                  <span className="jillo-tag"><Settings size={12} /> Filter Options</span>
                </div>

                <div className="jillo-cards">
                  {cardsData.map((card) => (
                    <div 
                      key={card.id} 
                      className="jillo-card" 
                      style={{ 
                        backgroundColor: card.color, 
                        border: activeCardId === card.id ? `2px solid ${card.borderColor}` : '2px solid transparent',
                        cursor: 'pointer',
                        transform: activeCardId === card.id ? 'translateY(-4px)' : 'none',
                        transition: 'all 0.3s ease'
                      }}
                      onClick={() => setActiveCardId(card.id)}
                    >
                      <card.icon size={14} color={card.borderColor} />
                      <h4 style={{ color: card.borderColor }}>{card.title}</h4>
                      <p>{card.text}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {isSearching && (
              <div className="ai-loading-state" style={{ marginTop: '40px' }}>
                <Activity className="ai-pulse-icon" size={32} />
                <p>Analyzing requirements and scanning talent pool...</p>
              </div>
            )}

            {showResults && !isSearching && (
              <div className="projects-grid ai-fade-up" style={{ marginTop: '24px', width: '100%', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                {foundResources.map((res, idx) => (
                  <CandidateCard
                    key={res.id}
                    candidate={{
                      id: res.id,
                      name: res.name,
                      role: res.role,
                      experience: res.exp,
                      rating: 4.8,
                      skills: res.skills,
                      profileCompletionPercentage: res.match,
                      status: res.availability
                    }}
                    isSelected={false}
                    onToggle={() => {}}
                    index={idx}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AIScreen;
