import React from "react";
import { BsBuilding } from "react-icons/bs";
import { FiMapPin, FiChevronDown, FiPlus, FiDollarSign, FiBriefcase, FiClock } from "react-icons/fi";

const JobOverviewCard = ({ job, isExpanded, onToggle }) => {
  const formatMarkdownToHtml = (text) => {
    if (!text) return "";
    let formatted = text;
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    formatted = formatted.replace(/^\s*-\s+(.*)$/gm, "<li>$1</li>");
    if (formatted.includes("<li>")) {
      formatted = formatted.replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>");
    }
    formatted = formatted.replace(/\n/g, "<br/>");
    return formatted;
  };

  if (!job) {
    return (
      <div className="job-overview-card job-empty">
        <div className="job-empty-title">No job selected</div>
        <div className="job-empty-subtitle">
          Select a job in “Find for Jobs” to see its overview here.
        </div>
      </div>
    );
  }

  return (
    <div
      className={`interview-card-v2 ${isExpanded ? "expanded" : ""}`}
      onClick={onToggle}
      style={{ cursor: 'pointer' }}
    >
      <div className="card-accent-bar"></div>

      <div className="d-flex flex-column gap-3">
        {/* Header: Company Icon + Title */}
        <div className="card-header-row">
          <div className="status-pill-v2">
            <span className="dot" style={{ background: '#3b82f6' }}></span>
            Active Role
          </div>
          <div className="time-badge">
            {isExpanded ? (
              <FiChevronDown size={20} style={{ transform: 'rotate(180deg)', transition: 'transform 0.3s' }} />
            ) : (
              <FiPlus size={20} />
            )}
          </div>
        </div>

        <div className="card-profile-section">
          <div className="avatar-initials-premium" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <BsBuilding size={24} />
          </div>
          <div className="profile-details">
            <h4 className="candidate-name" style={{ fontSize: '18px' }}>{job.title}</h4>
            <div className="d-flex align-items-center gap-2">
              <span className="candidate-role" style={{ color: 'var(--primary)' }}>{job.company}</span>
              <span style={{ color: '#cbd5e1' }}>•</span>
              <div className="meta-pill" style={{ padding: 0, background: 'transparent' }}>
                <FiMapPin size={12} />
                <span>{job.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Meta Stats Row */}
        <div className="card-meta-grid">
          <div className="meta-pill">
            <FiDollarSign size={12} />
            <span>{(job.budget ?? job.rateText ?? "NA")} {job.salaryType}</span>
          </div>
          <div className="meta-pill">
            <FiBriefcase size={12} />
            <span>{job.experience ?? job.experienceText}</span>
          </div>
          <div className="meta-pill">
            <FiClock size={12} />
            <span>{job.type}</span>
          </div>
        </div>

        {/* Expandable Content */}
        {isExpanded && (
          <div className="job-details-content mt-2" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
            <div className="job-section">
              <div className="candidate-name mb-2" style={{ fontSize: '14px' }}>Job Description</div>
              <div
                className="candidate-role"
                style={{ fontSize: '13px', lineHeight: '1.6', textAlign: 'justify' }}
                dangerouslySetInnerHTML={{
                  __html: formatMarkdownToHtml(job.description),
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobOverviewCard;
