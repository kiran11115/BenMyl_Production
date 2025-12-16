import React from "react";
import "./ProfilePage.css";
import {
  FiShare2,
  FiDownload,
  FiMail,
  FiPhone,
  FiLinkedin,
  FiGlobe,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const skills = [
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
];

const portfolioItems = [
  {
    id: 1,
    title: "E-commerce Dashboard",
    tags: ["React", "TailwindCSS"],
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200",
  },
  {
    id: 2,
    title: "Travel App UI",
    tags: ["React Native", "Firebase"],
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200",
  },
  {
    id: 3,
    title: "Financial Analytics Platform",
    tags: ["TypeScript", "D3.js", "Node.js"],
    image:
      "https://images.unsplash.com/photo-1556155092-8707de31f9c4?q=80&w=1200",
  },
  {
    id: 4,
    title: "Health Tracker",
    tags: ["React", "GraphQL", "MongoDB"],
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200",
  },
];

const ProfilePage = () => {
  const navigate = useNavigate();

  return (
    <div className="profile-page">
      {/* Top breadcrumb */}
      <div className="top-bar">
        <button
          className="link-button"
          onClick={() => navigate("/user/user-dashboard")}
        >
          ← Back to Dashboard
        </button>
        <span className="top-bar-divider">/</span>
        <span className="top-bar-current">Profile</span>
      </div>

      <div className="profile-layout">
        {/* LEFT */}
        <div className="profile-main">
          {/* Header */}
          <div className="card profile-header-card">
            <div className="profile-header-left">
              <div className="avatar-circle-profile">
                <span className="avatar-initials">SA</span>
              </div>

              <div className="profile-header-info">
                <div className="name-row">
                  <h1 className="prof-name">Sarah Anderson</h1>
                  <span className="profile-badge profile-badge-blue">Pro</span>
                </div>
                <p className="profile-role">Senior UX Designer</p>

                <div className="profile-meta-row">
                  <span className="profile-meta-item">
                    <span className="meta-dot" /> San Francisco, CA
                  </span>
                  <span className="meta-separator">•</span>
                  <span className="profile-meta-item">
                    <span className="meta-dot" /> 8+ years experience
                  </span>
                </div>

                <span className="availability-pill">
                  Available for hire
                </span>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="card about-card">
            <div className="about-text">
              <h2 className="section-title">About Me</h2>
              <p className="about-description">
                Experienced UX Designer with 8+ years of creating user-centered
                digital experiences for various industries.
              </p>
            </div>

            <div className="about-stats">
              <div className="stat-block">
                <div className="stat-value">150+</div>
                <div className="stat-label">Projects Completed</div>
              </div>
              <div className="stat-block">
                <div className="stat-value">98%</div>
                <div className="stat-label">Client Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="card">
            <h2 className="section-title">Skills & Expertise</h2>
            <div className="chip-list">
              {skills.map((skill) => (
                <span key={skill} className="chip">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Portfolio */}
          <div className="card">
            <div className="portfolio-header">
              <h2 className="section-title">Portfolio</h2>
            </div>

            <div className="portfolio-grid">
              {portfolioItems.map((item) => (
                <div key={item.id} className="portfolio-card">
                  <div className="portfolio-image-placeholder">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="portfolio-img"
                    />
                    <span className="portfolio-image-text">
                      {item.title}
                    </span>
                  </div>

                  <div className="portfolio-info">
                    <div className="chip-list">
                      {item.tags.map((tag) => (
                        <span key={tag} className="chip">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="profile-sidebar">
          <div className="sidebar-actions">
            <button className="btn-primary">
              <FiShare2 /> Share Profile
            </button>
            <button className="btn-secondary">
              <FiDownload /> Download Resume
            </button>
          </div>

          {/* Availability */}
          <div className="card sidebar-card">
            <h2 className="section-title">Availability</h2>
            <div className="availability-row">
              <span className="status-dot status-dot-green" />
              <div>
                <div className="availability-label">Open to Work</div>
                <div className="availability-sub">
                  Available for Full-time opportunities
                </div>
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="card sidebar-card">
            <h2 className="section-title">Quick Information</h2>
            <div className="quick-info-list">
              <div className="quick-info-item">
                <span className="quick-info-label">Expected Salary</span>
                <span className="quick-info-value">
                  $120,000 – $150,000 / year
                </span>
              </div>
              <div className="quick-info-item">
                <span className="quick-info-label">Notice Period</span>
                <span className="quick-info-value">2 weeks</span>
              </div>
              <div className="quick-info-item">
                <span className="quick-info-label">Work Preference</span>
                <span className="quick-info-value">
                  Hybrid (2–3 days remote)
                </span>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="card sidebar-card">
            <h2 className="section-title">Contact Information</h2>
            <div className="contact-list">
              <div className="contact-item">
                <FiMail /> Sarah.anderson@example.com
              </div>
              <div className="contact-item">
                <FiPhone /> +1 (555) 123-4567
              </div>
              <div className="contact-item">
                <FiLinkedin /> linkedin.com/in/sarahanderson
              </div>
              <div className="contact-item">
                <FiGlobe /> sarahanderson.design
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ProfilePage;
