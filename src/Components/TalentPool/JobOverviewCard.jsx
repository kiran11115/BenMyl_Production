import React from "react";
import { BsBuilding } from "react-icons/bs";
import { FiMapPin, FiChevronDown, FiPlus } from "react-icons/fi";

const Stat = ({ label, value }) => (
  <div className="job-stat">
    <div className="job-stat-label">{label}</div>
    <div className="job-stat-value">{value}</div>
  </div>
);

const JobOverviewCard = ({ job, isExpanded, onToggle }) => {
  // Empty state when no job is selected
  const formatMarkdownToHtml = (text) => {
    if (!text) return "";

    let formatted = text;

    // Convert bold **text**
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Convert bullet points
    formatted = formatted.replace(/^\s*-\s+(.*)$/gm, "<li>$1</li>");

    // Wrap <li> items inside <ul>
    if (formatted.includes("<li>")) {
      formatted = formatted.replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>");
    }

    // Convert line breaks
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
    <>

      <div
        className={`job-overview-card ${isExpanded ? "expanded" : ""}`}
        onClick={onToggle}
      >
        <div className="job-overview-top">
          <div className="company-icon-box large">
            <BsBuilding size={24} />
          </div>
          <div className="job-title-block">
            <div className="job-title-row">
              <h3 className="job-title">{job.title}</h3>
              {isExpanded ? (
                <FiChevronDown
                  className="job-label-icon expanded"
                  size={20}
                />
              ) : (
                <FiPlus
                  className="job-label-icon"
                  size={20}
                />
              )}
            </div>

            <div className="job-subtitle">
              <div className="job-company">{job.company}</div>
              <div className="job-location">
                <FiMapPin />
                <span>{job.location}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={`job-accordion-content ${isExpanded ? "expanded" : ""}`}>
          <div className="job-stats-row">
            <Stat label="BUDGET" value={`$${job.budget} ${job?.salaryType}`} />
            <Stat label="EXPERIENCE" value={`${job.experience}+`} />
            <Stat label="TYPE" value={job.type} />
          </div>

          <div className="job-section">
            <div className="job-section-title">Job Description</div>
            <div
              className="job-section-text"
              dangerouslySetInnerHTML={{
                __html: formatMarkdownToHtml(job.description),
              }}
            />
          </div>

          <div className="job-section">
            <div className="job-section-title">Required Skills</div>
            <div className="d-flex flex-wrap gap-2">
              {(job.requiredSkills || []).map((s) => (
                <span key={s} className="status-tag status-progress">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobOverviewCard;
