import React, { useState } from 'react';
import { Sparkles, Search, FileText, CheckCircle, Briefcase, Clock, Zap, Award, BrainCircuit, Activity, ChevronRight, XCircle } from 'lucide-react';
import './AIScreen.css';

const AIScreen = () => {
  const [activeTab, setActiveTab] = useState('find');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // For Smart Match tab
  const [jobReq, setJobReq] = useState('');
  const [matchLoading, setMatchLoading] = useState(false);
  const [showMatch, setShowMatch] = useState(false);

  // Mock data for Find Resources
  const foundResources = [
    { name: 'Rahul Sharma', match: 96, availability: 'Available Now', role: 'Full Stack Developer', exp: '6 Years' },
    { name: 'Priya Singh', match: 92, availability: 'Available in 5 Days', role: 'Frontend Developer', exp: '5 Years' },
    { name: 'Amit Kumar', match: 89, availability: 'Available Immediately', role: 'React Developer', exp: '4 Years' },
  ];

  // Mock data for Smart Match
  const matchResult = {
    name: 'Rahul Sharma',
    score: 96,
    matchingSkills: ['React', 'TypeScript', 'Redux', 'Azure', 'REST APIs'],
    missingSkills: ['GraphQL'],
    recommendation: 'Strong match. Suitable for immediate client submission.',
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setShowResults(false);
    setTimeout(() => {
      setIsSearching(false);
      setShowResults(true);
    }, 1500);
  };

  const handleMatch = () => {
    if (!jobReq.trim()) return;
    setMatchLoading(true);
    setShowMatch(false);
    setTimeout(() => {
      setMatchLoading(false);
      setShowMatch(true);
    }, 1500);
  };

  return (
    <div className="ai-screen-wrapper">
      <div className="ai-ambient-bg">
        <div className="ai-blob blob-1"></div>
        <div className="ai-blob blob-2"></div>
        <div className="ai-blob blob-3"></div>
      </div>
      
      <div className="ai-screen-content">
        <header className="ai-screen-header">
          <div className="ai-header-title">
            <Sparkles className="ai-sparkles-icon" size={24} />
            <h1>AI Resource Intelligence</h1>
          </div>
          <p className="ai-header-subtitle">Find, summarize, and match candidates using the power of Artificial Intelligence.</p>
        </header>

        <div className="ai-tabs-container">
          <button 
            className={`ai-tab-btn ${activeTab === 'find' ? 'active' : ''}`}
            onClick={() => { setActiveTab('find'); setShowResults(false); setSearchQuery(''); }}
          >
            <Search size={14} />
            Find Resources
          </button>
          <button 
            className={`ai-tab-btn ${activeTab === 'summary' ? 'active' : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            <FileText size={14} />
            AI Resource Summary
          </button>
          <button 
            className={`ai-tab-btn ${activeTab === 'match' ? 'active' : ''}`}
            onClick={() => { setActiveTab('match'); setShowMatch(false); setJobReq(''); }}
          >
            <BrainCircuit size={14} />
            Smart Match
          </button>
        </div>

        <div className="ai-tab-content-area">
          {activeTab === 'find' && (
            <div className="ai-tab-find ai-fade-in">
              <div className="ai-search-box">
                <div className="ai-search-input-wrapper">
                  <Search className="ai-search-icon" size={16} />
                  <input 
                    type="text" 
                    placeholder="E.g., Find a React Developer with 5+ years of experience available immediately."
                    className="ai-search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <button className="ai-search-btn ai-gradient-btn" onClick={handleSearch} disabled={isSearching || !searchQuery.trim()}>
                    {isSearching ? <Activity className="ai-spin" size={14} /> : 'Search AI'}
                  </button>
                </div>
              </div>

              {isSearching && (
                <div className="ai-loading-state">
                  <Activity className="ai-pulse-icon" size={32} />
                  <p>Analyzing requirements and scanning talent pool...</p>
                </div>
              )}

              {showResults && !isSearching && (
                <div className="ai-results-grid ai-fade-up">
                  {foundResources.map((res, idx) => (
                    <div key={idx} className="ai-resource-card" style={{animationDelay: `${idx * 0.1}s`}}>
                      <div className="ai-res-header">
                        <div className="ai-res-avatar">{res.name.charAt(0)}</div>
                        <div className="ai-res-info">
                          <h3>{res.name}</h3>
                          <p>{res.role} • {res.exp}</p>
                        </div>
                        <div className="ai-res-score">
                          <span className="score-val">{res.match}%</span>
                          <span className="score-lbl">Match</span>
                        </div>
                      </div>
                      <div className="ai-res-body">
                        <div className="ai-res-detail">
                          <Clock size={14} />
                          <span>{res.availability}</span>
                        </div>
                      </div>
                      <button className="ai-view-btn">View Profile <ChevronRight size={14} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'summary' && (
            <div className="ai-tab-summary ai-fade-in">
              <div className="ai-summary-card">
                <div className="ai-summary-header">
                  <div className="ai-summary-avatar-lg">R</div>
                  <div className="ai-summary-title">
                    <h2>Rahul Sharma</h2>
                    <span className="ai-badge"><CheckCircle size={14} /> AI Verified Profile</span>
                  </div>
                </div>
                
                <div className="ai-generated-summary">
                  <div className="ai-gen-header">
                    <Sparkles size={16} /> <h3>AI Generated Summary</h3>
                  </div>
                  <p>
                    Rahul is a Full Stack Developer with 6 years of experience specializing in React, Node.js, and Azure. He has worked on enterprise web applications, is AWS Certified, and is available for deployment immediately. Suitable for Senior Frontend and Full Stack roles.
                  </p>
                </div>

                <div className="ai-highlights-grid">
                  <div className="ai-highlight-box">
                    <Briefcase size={18} className="hl-icon" />
                    <div className="hl-text">
                      <span className="hl-lbl">Experience</span>
                      <span className="hl-val">6 Years</span>
                    </div>
                  </div>
                  <div className="ai-highlight-box">
                    <Zap size={18} className="hl-icon" />
                    <div className="hl-text">
                      <span className="hl-lbl">Skills</span>
                      <span className="hl-val">React, Node.js, Azure</span>
                    </div>
                  </div>
                  <div className="ai-highlight-box">
                    <Clock size={18} className="hl-icon" />
                    <div className="hl-text">
                      <span className="hl-lbl">Availability</span>
                      <span className="hl-val">Immediate</span>
                    </div>
                  </div>
                  <div className="ai-highlight-box">
                    <Award size={18} className="hl-icon" />
                    <div className="hl-text">
                      <span className="hl-lbl">Certifications</span>
                      <span className="hl-val">AWS Certified Developer</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'match' && (
            <div className="ai-tab-match ai-fade-in">
              <div className="ai-search-box">
                <div className="ai-search-input-wrapper ai-textarea-wrapper">
                  <BrainCircuit className="ai-search-icon" size={16} style={{marginTop: '10px'}} />
                  <textarea 
                    placeholder="Paste Job Description or Requirements here... (e.g., Senior React Developer with React, TypeScript, Redux, Azure, and REST API experience.)"
                    className="ai-search-input"
                    value={jobReq}
                    onChange={(e) => setJobReq(e.target.value)}
                    rows={3}
                  />
                  <button className="ai-search-btn ai-gradient-btn" onClick={handleMatch} disabled={matchLoading || !jobReq.trim()}>
                    {matchLoading ? <Activity className="ai-spin" size={14} /> : 'Analyze Match'}
                  </button>
                </div>
              </div>

              {matchLoading && (
                <div className="ai-loading-state">
                  <Activity className="ai-pulse-icon" size={32} />
                  <p>Running deep analysis against candidate profiles...</p>
                </div>
              )}

              {showMatch && !matchLoading && (
                <div className="ai-match-result ai-fade-up">
                  <div className="ai-match-score-card">
                    <div className="match-circular-progress">
                      <svg viewBox="0 0 36 36" className="circular-chart">
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%" className="gradient-def">
                            <stop offset="0%" />
                            <stop offset="50%" />
                            <stop offset="100%" />
                          </linearGradient>
                        </defs>
                        <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className="circle" strokeDasharray="96, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <text x="18" y="20.35" className="percentage">96%</text>
                      </svg>
                      <div className="match-name">{matchResult.name}</div>
                    </div>
                  </div>

                  <div className="ai-match-details">
                    <div className="ai-skills-section">
                      <h3><CheckCircle size={14} className="text-success" /> Matching Skills</h3>
                      <div className="ai-skills-list">
                        {matchResult.matchingSkills.map(skill => (
                          <span key={skill} className="ai-skill-pill match-pill">{skill}</span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="ai-skills-section">
                      <h3><XCircle size={14} className="text-danger" /> Missing Skills</h3>
                      <div className="ai-skills-list">
                        {matchResult.missingSkills.map(skill => (
                          <span key={skill} className="ai-skill-pill miss-pill">{skill}</span>
                        ))}
                      </div>
                    </div>

                    <div className="ai-recommendation-box">
                      <Sparkles size={18} className="reco-icon" />
                      <div className="reco-content">
                        <h4>AI Recommendation</h4>
                        <p>{matchResult.recommendation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIScreen;
