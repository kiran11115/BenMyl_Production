import React, { useState } from "react";
import "./TalentProfile.css";
import {
  FiMapPin,
  FiBriefcase,
  FiDownload,
  FiShare2,
  FiMail,
  FiPhone,
  FiLinkedin,
  FiFileText,
  FiEye,
  FiExternalLink,
  FiArrowLeft,
  FiUser,
  FiCheckCircle,
  FiAward,
  FiTrendingUp,
  FiCalendar,
  FiChevronDown,
  FiStar,
  FiMessageSquare
} from "react-icons/fi";
import { BsDribbble } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const TalentProfile = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("Role");

  const [isExpOpen, setIsExpOpen] = useState(true);

  const profileData = {
    name: "Sarah Anderson",
    role: "Senior UX Designer",
    location: "San Francisco, CA",
    experience: "8+ years experience",
    status: "Available for hire",
    summary:
      "Experienced UX Designer with 8+ years of creating user-centered digital experiences for various industries. Specialized in product design, user research, and design systems. Currently leading design initiatives at TechCorp, focusing on enterprise software solutions.",
    stats: [
      { label: "Projects Completed", value: "150+" },
      { label: "Client Satisfaction", value: "98%" },
    ],
    skills: [
      "UI/UX Design",
      "User Research",
      "Figma",
      "Adobe XD",
      "Sketch",
      "Prototyping",
      "Design Systems",
      "Wireframing",
      "User Testing",
      "Information Architecture",
      "Design Thinking",
      "Team Leadership",
    ],
    workExperience: [
      {
        role: "Lead UX Designer",
        company: "TechCorp",
        period: "2020 - Present",
        location: "San Francisco, CA",
        desc: "Leading a team of designers, developing design systems, and managing enterprise projects.",
      },
      {
        role: "Senior UX Designer",
        company: "Design Studio",
        period: "2018 - 2020",
        location: "New York, NY",
        desc: "Designed user interfaces for various clients in fintech and healthcare sectors.",
      },
      {
        role: "UX Designer",
        company: "StartupHub",
        period: "2015 - 2018",
        location: "Boston, MA",
        desc: "Created user experiences for early-stage startups and conducted user research.",
      },
    ],
    portfolio: [
      {
        title: "E-commerce Dashboard",
        tags: ["React", "Redux", "TailwindCSS"],
        img:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=500",
      },
      {
        title: "Travel App UI",
        tags: ["React Native", "Firebase"],
        img:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=500",
      },
      {
        title: "Financial Analytics Platform",
        tags: ["TypeScript", "D3.js", "Node.js"],
        img:
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=500",
      },
      {
        title: "Health Tracker",
        tags: ["React", "GraphQL", "MongoDB"],
        img:
          "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=500",
      },
    ],
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="ai-dashboard-wrapper">
      
      {/* ── HERO HEADER CARD ── */}
      <div className="hero-card mb-4">
        <div className="hero-left">
          <div className="hero-pill">✦ Profile Page</div>
          <h1 className="job-posting-title text-white">{profileData.name}</h1>
          <div className="job-posting-header-info">
            <p className="job-posting-subtitle">
              {profileData.role} &nbsp;•&nbsp; {profileData.location}
            </p>
          </div>
        </div>
        <div className="hero-buttons">
          <button 
            type="button" 
            className="routine-btn" 
            onClick={() => {
              const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
              navigate(`${basePath}/admin-talentpool`);
            }}
          >
            <FiArrowLeft style={{ marginRight: '6px' }} /> Talent Pool
          </button>
        </div>
      </div>

      {/* ── PROFILE IDENTITY STRIP ── */}
      <div className="premium-card tp-identity-strip mb-4">
        <div className="tp-avatar-col">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
            alt="Profile"
            className="tp-avatar-sm"
          />
        </div>
        <div className="tp-identity-info">
          <div className="tp-identity-name">
            {profileData.name}
            <FiCheckCircle size={14} style={{ color: '#10b981', marginLeft: 8 }} />
          </div>
          <div className="tp-identity-role">{profileData.role}</div>
          <div className="tp-meta-pills">
            <span className="tp-meta-pill"><FiMapPin size={11} /> {profileData.location}</span>
            <span className="tp-meta-pill"><FiBriefcase size={11} /> {profileData.experience}</span>
            <span className="tp-meta-pill"><FiAward size={11} /> {profileData.status}</span>
          </div>
        </div>
        <div className="tp-identity-actions">
          {role !== 'Benchsales' && (
            <button className="tp-util-btn" style={{ background: '#5B5BD6', color: '#fff', borderColor: '#5B5BD6' }} onClick={() => {
              const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
              navigate(window.location.pathname.toLowerCase().startsWith('/admin') ? `${basePath}/admin-upcoming-interview` : `${basePath}/user-upcoming-interview`);
            }}>
              Schedule Interview
            </button>
          )}
          <button className="tp-util-btn">Shortlist Candidate</button>
        </div>
      </div>

      {/* ── MAIN CONTENT GRID ── */}
      <div className="tp-content-grid">

        {/* ─ LEFT COLUMN ─ */}
        <div className="tp-col-main">

          {/* Professional Summary */}
          <div className="premium-card mb-3">
            <div className="tp-section-heading"><FiUser size={13} /> Professional Summary</div>
            <p className="tp-summary-text mb-3">{profileData.summary}</p>
            <div className="tp-stats-row">
              {profileData.stats.map((stat, idx) => (
                <div key={idx} className="tp-stat-box">
                  <div className="tp-stat-val">{stat.value}</div>
                  <div className="tp-stat-lbl">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Work Experience */}
          <div className="premium-card mb-3">
            <div className="tp-section-heading-row">
              <span className="tp-section-heading"><FiTrendingUp size={13} /> Work Experience</span>
              <button className="tp-toggle-btn" onClick={() => setIsExpOpen(!isExpOpen)}>
                {isExpOpen ? "Show Less" : "View All"} <FiChevronDown size={12} style={{ transform: isExpOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
              </button>
            </div>
            
            {isExpOpen ? (
              <div className="tp-exp-list">
                {profileData.workExperience.map((job, idx) => (
                  <div key={idx} className="tp-exp-item">
                    <div className="tp-exp-icon"><FiBriefcase size={13} /></div>
                    <div className="tp-exp-body">
                      <div className="tp-exp-title-row">
                        <span className="tp-exp-role">{job.role}</span>
                        <span className="tp-exp-badge">{job.company}</span>
                      </div>
                      <div className="tp-exp-period">
                        <FiCalendar size={11} /> {job.period} &nbsp;•&nbsp; <FiMapPin size={11} /> {job.location}
                      </div>
                      <p className="tp-exp-desc">{job.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="tp-exp-preview">
                <span className="tp-exp-role">{profileData.workExperience[0].role}</span>
                <span className="tp-exp-badge">{profileData.workExperience[0].company}</span>
                <p className="tp-exp-desc" style={{ marginTop: 6 }}>
                  {profileData.workExperience[0].desc.slice(0, 120)}…
                </p>
              </div>
            )}
          </div>

          {/* Portfolio Grid */}
          <div className="premium-card mb-3">
            <div className="tp-section-heading-row" style={{ borderBottom: 'none', marginBottom: 0 }}>
              <span className="tp-section-heading" style={{ borderBottom: 'none', margin: 0, padding: 0 }}><FiFileText size={13} /> Portfolio ({profileData.portfolio.length})</span>
            </div>
            <div className="tp-portfolio-grid mt-3">
              {profileData.portfolio.map((item, idx) => (
                <div key={idx} className="tp-port-card">
                  <div className="tp-port-img-wrap">
                    <img src={item.img} alt={item.title} className="tp-port-img" />
                    <div className="tp-port-overlay">
                      <button className="tp-overlay-btn"><FiEye size={12} /> Preview</button>
                      <button className="tp-overlay-btn"><FiExternalLink size={12} /> Open</button>
                    </div>
                  </div>
                  <div className="tp-port-info">
                    <h4 className="tp-port-title">{item.title}</h4>
                    <div className="tp-tag-row" style={{ marginBottom: 0 }}>
                      {item.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="tp-tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ─ RIGHT SIDEBAR ─ */}
        <div className="tp-col-side">

          {/* Quick Info */}
          <div className="premium-card mb-3">
            <div className="tp-section-heading">Quick Information</div>
            <div className="tp-info-row" style={{ marginBottom: '16px' }}>
              <div className="tp-info-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>
                <FiStar size={14} />
              </div>
              <div>
                <div className="tp-quick-lbl">Expected Salary</div>
                <div className="tp-quick-val">$120k - $150k / year</div>
              </div>
            </div>
            
            <div className="tp-info-row" style={{ marginBottom: '16px' }}>
              <div className="tp-info-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>
                <FiMapPin size={14} />
              </div>
              <div>
                <div className="tp-quick-lbl">Notice Period</div>
                <div className="tp-quick-val">2 weeks</div>
              </div>
            </div>

            <div className="tp-info-row" style={{ marginBottom: '16px' }}>
              <div className="tp-info-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>
                <FiBriefcase size={14} />
              </div>
              <div>
                <div className="tp-quick-lbl">Work Preference</div>
                <div className="tp-quick-val">Hybrid (2-3 days remote)</div>
              </div>
            </div>

            <div className="tp-info-row">
              <div className="tp-info-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>
                <FiMessageSquare size={14} />
              </div>
              <div>
                <div className="tp-quick-lbl">Languages</div>
                <div className="tp-tag-row mt-1">
                  <span className="tp-tag">English</span>
                  <span className="tp-tag">Spanish</span>
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="premium-card mb-3">
            <div className="tp-section-heading">Skills & Expertise</div>
            <div className="tp-tag-row">
              {profileData.skills.map((skill, idx) => (
                <span key={idx} className="tp-tag">{skill}</span>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="premium-card mb-3">
            <div className="tp-section-heading">Contact Information</div>
            <div className="tp-contact-list">
              <div className="tp-contact-item"><FiMail /> sarah.anderson@example.com</div>
              <div className="tp-contact-item"><FiPhone /> +1 (555) 123-4567</div>
              <div className="tp-contact-item"><FiLinkedin /> linkedin.com/in/sarah</div>
              <div className="tp-contact-item"><BsDribbble /> sarahanderson.design</div>
            </div>
          </div>

          {/* Education */}
          <div className="premium-card mb-3">
            <div className="tp-section-heading">Education</div>
            <div className="tp-info-row" style={{ marginBottom: 12 }}>
              <div className="tp-info-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>
                <FiFileText size={13} />
              </div>
              <div>
                <div className="tp-info-value">Master in Interaction Design</div>
                <div className="tp-info-label">Carnegie Mellon University</div>
                <div className="tp-info-label" style={{ marginTop: 2 }}>2013 - 2015</div>
              </div>
            </div>
            <div className="tp-info-row">
              <div className="tp-info-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>
                <FiFileText size={13} />
              </div>
              <div>
                <div className="tp-info-value">BA in Graphic Design</div>
                <div className="tp-info-label">Rhode Island School of Design</div>
                <div className="tp-info-label" style={{ marginTop: 2 }}>2009 - 2013</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TalentProfile;
