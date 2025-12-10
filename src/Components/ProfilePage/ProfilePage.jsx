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
    imageAlt: "E-commerce dashboard preview",
  },
  {
    id: 2,
    title: "Travel App UI",
    tags: ["React Native", "Firebase"],
    imageAlt: "Travel app mobile UI",
  },
  {
    id: 3,
    title: "Financial Analytics Platform",
    tags: ["TypeScript", "D3.js", "Node.js"],
    imageAlt: "Financial analytics dashboard",
  },
  {
    id: 4,
    title: "Health Tracker",
    tags: ["React", "GraphQL", "MongoDB"],
    imageAlt: "Health tracking mobile app screen",
  },
];

const ProfilePage = () => {

const navigate = useNavigate();

  return (
    <div className="profile-page">
      {/* Top breadcrumb */}
      <div className="top-bar">
        <button className="link-button" onClick={()=>navigate("/user/user-dashboard")}>&larr; Back to dashboard</button>
        <span className="top-bar-divider">/</span>
        <span className="top-bar-current">Profile</span>
      </div>

      {/* Main layout */}
      <div className="profile-layout">
        {/* LEFT MAIN COLUMN */}
        <div className="profile-main">
          {/* Header Card */}
          <div className="card profile-header-card">
            <div className="profile-header-left">
              <div className="avatar-wrapper">
                <div className="avatar-circle">
                  <span className="avatar-initials">SA</span>
                </div>
              </div>
              <div className="profile-header-info">
                <div className="name-row">
                  <h1 className="prof-name">Sarah Anderson</h1>
                  <span className="profile-badge profile-badge-blue">Pro</span>
                </div>
                <p className="profile-role">Senior UX Designer</p>

                <div className="profile-meta-row">
                  <span className="profile-meta-item">
                    <span className="meta-dot" />
                    San Francisco, CA
                  </span>
                  <span className="meta-separator">•</span>
                  <span className="profile-meta-item">
                    <span className="meta-dot" />
                    8+ years experience
                  </span>
                </div>

                <span className="availability-pill">Available for hire</span>
              </div>
            </div>
          </div>

          {/* About + Stats */}
          <div className="card about-card">
            <div className="about-text">
              <h2 className="section-title">About Me</h2>
              <p className="about-description">
                Experienced UX Designer with 8+ years of creating user-centered
                digital experiences for various industries. Specialized in
                product design, user research, and design systems. Currently
                leading design initiatives at TechCorp, focusing on enterprise
                software solutions.
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

          {/* Work Experience */}
          <div className="card">
            <h2 className="section-title">Work Experience</h2>

            <div className="experience-list">
              <div className="experience-item">
                <div className="experience-icon">L</div>
                <div className="experience-content">
                  <div className="experience-title-row">
                    <h3 className="experience-role">Lead UX Designer</h3>
                    <span className="experience-company">TechCorp</span>
                    <span className="experience-dot" />
                    <span className="experience-years">2020 – Present</span>
                  </div>
                  <p className="experience-location">San Francisco, CA</p>
                  <p className="experience-description">
                    Leading a team of designers, developing design systems, and
                    managing enterprise projects.
                  </p>
                </div>
              </div>

              <div className="experience-item">
                <div className="experience-icon">S</div>
                <div className="experience-content">
                  <div className="experience-title-row">
                    <h3 className="experience-role">Senior UX Designer</h3>
                    <span className="experience-company">Design Studio</span>
                    <span className="experience-dot" />
                    <span className="experience-years">2018 – 2020</span>
                  </div>
                  <p className="experience-location">New York, NY</p>
                  <p className="experience-description">
                    Designed user interfaces for various clients in fintech and
                    healthcare sectors.
                  </p>
                </div>
              </div>

              <div className="experience-item">
                <div className="experience-icon">U</div>
                <div className="experience-content">
                  <div className="experience-title-row">
                    <h3 className="experience-role">UX Designer</h3>
                    <span className="experience-company">StartupHub</span>
                    <span className="experience-dot" />
                    <span className="experience-years">2015 – 2018</span>
                  </div>
                  <p className="experience-location">Boston, MA</p>
                  <p className="experience-description">
                    Created user experiences for early-stage startups and
                    conducted user research.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="card">
            <h2 className="section-title">Skills &amp; Expertise</h2>
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
                    <img src="" alt="" />
                    <span className="portfolio-image-text">{item.title}</span>
                  </div>
                  <div className="portfolio-info">
                    <div className="portfolio-title-row">
                      <h3 className="portfolio-title">{item.title}</h3>
                    </div>
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
          {/* Top buttons (Share + Download) */}
          <div className="sidebar-actions">
            <button className="sidebar-btn sidebar-btn-primary">
              <FiShare2 className="sidebar-btn-icon" />
              <span>Share Profile</span>
            </button>
            <button className="sidebar-btn sidebar-btn-outline">
              <FiDownload className="sidebar-btn-icon" />
              <span>Download Resume</span>
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

          {/* Quick Information */}
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
              <div className="quick-info-item">
                <span className="quick-info-label">Languages</span>
                <div className="chip-list">
                  <span className="chip chip-light">English</span>
                  <span className="chip chip-light">Spanish</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="card sidebar-card">
            <h2 className="section-title">Contact Information</h2>
            <div className="contact-list">
              <div className="contact-item">
                <div className="contact-icon">
                  <FiMail />
                </div>
                <span>Sarah.anderson@example.com</span>
              </div>
              <div className="contact-item">
                <div className="contact-icon">
                  <FiPhone />
                </div>
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="contact-item">
                <div className="contact-icon">
                  <FiLinkedin />
                </div>
                <span>linkedin.com/in/sarahanderson</span>
              </div>
              <div className="contact-item">
                <div className="contact-icon">
                  <FiGlobe />
                </div>
                <span>sarahanderson.design</span>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="card sidebar-card">
            <h2 className="section-title">Education</h2>
            <div className="education-list">
              <div className="education-item">
                <div className="education-icon">M</div>
                <div>
                  <div className="education-degree">
                    Master in Interaction Design
                  </div>
                  <div className="education-school">
                    Carnegie Mellon University
                  </div>
                  <div className="education-years">2013 – 2015</div>
                </div>
              </div>
              <div className="education-item">
                <div className="education-icon">B</div>
                <div>
                  <div className="education-degree">
                    BA in Graphic Design
                  </div>
                  <div className="education-school">
                    Rhode Island School of Design
                  </div>
                  <div className="education-years">2009 – 2013</div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ProfilePage;
