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

  const stylesoverivew = `
.job-overview-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 16px 18px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
  transition: all 0.3s ease;
  cursor: pointer;
}

.job-overview-card:hover {
  border-color: #cbd5e1;
}

.job-overview-top {
  display: flex;
  gap: 12px;
  align-items: center;
}

.job-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  flex: 0 0 auto;
}

.job-title-block {
  flex: 1;
  min-width: 0;
}

.job-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.job-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}

.job-subtitle {
  margin-top: 4px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px 16px;
  color: #64748b;
  font-size: 13px;
}

.job-company {
  font-weight: 600;
  color: #334155;
}

.job-location {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.job-label-icon {
  color: #94a3b8;
  transition: transform 0.3s ease;
}

.job-label-icon.expanded {
  transform: rotate(180deg);
  color: #0f172a;
}

.job-accordion-content {
  overflow: hidden;
  transition: max-height 0.3s ease, margin-top 0.3s ease;
  max-height: 0;
}

.job-accordion-content.expanded {
  max-height: 1000px; /* Large enough to fit content */
  margin-top: 16px;
}

.job-stats-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  background: #f8fafc;
  border: 1px solid #eef2f7;
  border-radius: 12px;
  padding: 10px 12px;
}

.job-stat-label {
  font-size: 11px;
  letter-spacing: 0.06em;
  color: #64748b;
  font-weight: 700;
  text-transform: uppercase;
}

.job-stat-value {
  margin-top: 4px;
  font-size: 14px;
  color: #0f172a;
  font-weight: 700;
}

.job-section {
  margin-top: 14px;
}

.job-section-title {
  font-size: 12px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 6px;
}

.job-section-text {
  font-size: 13px;
  color: #64748b;
  line-height: 1.45;
}

.job-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.job-skill-chip {
  font-size: 12px;
  padding: 6px 10px;
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #dbeafe;
  border-radius: 999px;
  font-weight: 600;
}

/* Empty state */
.job-overview-card.job-empty {
  padding: 18px;
  border-style: dashed;
  background: #fcfcfd;
  cursor: default;
}

.job-empty-title {
  font-size: 14px;
  font-weight: 800;
  color: #0f172a;
}

.job-empty-subtitle {
  margin-top: 6px;
  font-size: 13px;
  color: #64748b;
  line-height: 1.4;
}
  `;

  return (
    <>
      <style>{stylesoverivew}</style>
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
