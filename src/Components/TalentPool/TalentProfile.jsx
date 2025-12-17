import React from "react";
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
} from "react-icons/fi";
import { BsDribbble } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const TalentProfile = () => {

  const navigate = useNavigate();

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

  return (
    <div className="projects-container">
      {/* Breadcrumb - Matches Global Text Styles */}
      <div className="profile-breadcrumb">
        <button className="link-button" onClick={() => navigate("/user/user-talentpool")}><FiArrowLeft /> Talent Pool </button>
        <span className="crumb">/ Profile Page</span>
      </div>

      <div className="dashboard-layout">
        {/* === LEFT MAIN COLUMN === */}
        <div className="dashboard-column-main">
          <div className="row">
            <div className="col-3">
              {/* Profile Header Card */}
              <div className="project-card">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
                  alt="Profile"
                  className="profile-avatar-lg"
                />
                <div className="profile-header-content">
                  <div className="d-flex gap-3">
                    <h1 className="mb-2">{profileData.name}</h1>
                    <FiFileText className="profile-verified-icon" />
                  </div>
                  <div className="card-title mb-2">{profileData.role}</div>

                  <div className="profile-meta-row">
                    <span className="meta-item">
                      <FiMapPin /> {profileData.location}
                    </span>
                    <span className="meta-item">
                      <FiBriefcase /> {profileData.experience}
                    </span>
                  </div>

                  <div className="profile-status-wrapper">
                    <span className="status-tag status-completed">
                      {profileData.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-9">
              {/* Professional Summary */}
              <div className="project-card">
                <h2 className="card-title">Professional Summary</h2>
                <p className="summary-text">{profileData.summary}</p>

                <div className="summary-stats-grid">
                  {profileData.stats.map((stat, idx) => (
                    <div key={idx} className="summary-stat-box">
                      <div className="summary-stat-value">{stat.value}</div>
                      <div className="summary-stat-label">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-8">
              {/* Work Experience */}
              <div className="project-card">
                <h2 className="card-title">Work Experience</h2>
                <div className="experience-list">
                  {profileData.workExperience.map((job, idx) => (
                    <div key={idx} className="experience-item">
                      <div className="experience-icon-box">
                        <FiBriefcase />
                      </div>
                      <div className="experience-content">
                        <h3>{job.role}</h3>
                        <div className="job-meta">
                          {job.company} • {job.period}
                        </div>
                        <div className="job-location">{job.location}</div>
                        <p className="job-desc">{job.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-4">
              {/* Skills & Expertise */}
              <div className="project-card">
                <h2 className="card-title">Skills & Expertise</h2>
                <div className="skills-container">
                  {profileData.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="status-tag status-progress"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Portfolio */}
          <div className="portfolio-section">
            <div className="portfolio-header">
              <h2 className="card-title">Portfolio</h2>
              <span className="portfolio-count">
                {profileData.portfolio.length} Projects
              </span>
            </div>

            <div className="projects-grid premium-portfolio-grid">
              {profileData.portfolio.map((item, idx) => (
                <div key={idx} className="premium-portfolio-card">
                  <div className="portfolio-img-wrapper">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="portfolio-img"
                    />

                    <div className="portfolio-overlay">
                      <button className="overlay-btn">
                        <FiEye /> Preview
                      </button>
                      <button className="overlay-btn secondary">
                        <FiExternalLink /> Open
                      </button>
                    </div>
                  </div>

                  <div className="portfolio-content">
                    <h3 className="portfolio-title">{item.title}</h3>
                    <div className="portfolio-tags">
                      {item.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="portfolio-tag">
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

        {/* === RIGHT SIDE COLUMN === */}
        <div className="dashboard-column-side">
          {/* Action Buttons */}
          <div className="sidebar-actions">
            <button className="btn-primary w-100" onClick={() => navigate("/user/user-schedule-interview")}>Schedule Interview</button>
            <button className="btn-secondary w-100">Shortlist Candidate</button>

            <div className="sidebar-links">
              <button className="link-btn">
                <FiDownload /> Download Resume
              </button>
              <button className="link-btn">
                <FiShare2 /> Share Profile
              </button>
            </div>
          </div>

          {/* Quick Information */}
          <div className="table-card sidebar-card">
            <h3 className="card-title">Quick Information</h3>

            <div className="quick-info-item">
              <div className="stat-label">Expected Salary</div>
              <div className="info-value">$120,000 - $150,000 / year</div>
            </div>

            <div className="quick-info-item">
              <div className="stat-label">Notice Period</div>
              <div className="info-value">2 weeks</div>
            </div>

            <div className="quick-info-item">
              <div className="stat-label">Work Preference</div>
              <div className="info-value">Hybrid (2-3 days remote)</div>
            </div>

            <div className="quick-info-item">
              <div className="stat-label">Languages</div>
              <div className="languages-list">
                <span className="status-tag status-pending">English</span>
                <span className="status-tag status-pending">Spanish</span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="table-card sidebar-card">
            <h3 className="card-title">Contact Information</h3>
            <div className="contact-list">
              <div className="contact-item">
                <FiMail className="contact-icon" /> sarah.anderson@example.com
              </div>
              <div className="contact-item">
                <FiPhone className="contact-icon" /> +1 (555) 123-4567
              </div>
              <div className="contact-item">
                <FiLinkedin className="contact-icon" />{" "}
                linkedin.com/in/sarahanderson
              </div>
              <div className="contact-item">
                <BsDribbble className="contact-icon" /> sarahanderson.design
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="table-card sidebar-card">
            <h3 className="card-title">Education</h3>
            <div className="education-list">
              <div className="interview-item-premium">
                <div className="edu-icon-box">
                  <FiFileText size={14} />
                </div>
                <div>
                  <div className="edu-degree">Master in Interaction Design</div>
                  <div className="edu-school">Carnegie Mellon University</div>
                  <div className="edu-year">2013 - 2015</div>
                </div>
              </div>

              <div className="interview-item-premium">
                <div className="edu-icon-box">
                  <FiFileText size={14} />
                </div>
                <div>
                  <div className="edu-degree">BA in Graphic Design</div>
                  <div className="edu-school">
                    Rhode Island School of Design
                  </div>
                  <div className="edu-year">2009 - 2013</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalentProfile;
