import React from "react";
import { BsBuilding } from "react-icons/bs";
import { FiMapPin, FiX } from "react-icons/fi";

const Stat = ({ label, value }) => (
  <div className="job-stat">
    <div className="job-stat-label">{label}</div>
    <div className="job-stat-value">{value}</div>
  </div>
);

const JobOverviewCard = ({ job, onClose }) => {
  // Empty state when no job is selected
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
}

.job-overview-top {
  display: flex;
  gap: 12px;
  align-items: flex-start;
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
  gap: 10px;
}

.job-title {
  margin: 0;
  font-size: 18px;
  line-height: 1.2;
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

.job-close-btn {
  background: transparent;
  border: 0;
  cursor: pointer;
  color: #94a3b8;
  padding: 6px;
  border-radius: 10px;
}
.job-close-btn:hover {
  background: #f1f5f9;
  color: #334155;
}

.job-stats-row {
  margin-top: 12px;
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


  `

  return (
    <>
    <style>{stylesoverivew}</style>
       <div className="job-overview-card">
      <div className="job-overview-top">
     <div className="company-icon-box large">
                <BsBuilding size={28} />
              </div>
        <div className="job-title-block">
          <div className="job-title-row">
            <h3 className="job-title">{job.title}</h3>
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

      <div className="job-stats-row">
        <Stat label="BUDGET" value={job.budget} />
        <Stat label="EXPERIENCE" value={`${job.experience}+`} />
        <Stat label="TYPE" value={job.type} />
      </div>

      <div className="job-section">
        <div className="job-section-title">Job Description</div>
        <div className="job-section-text">{job.description}</div>
      </div>

      <div className="job-section">
        <div className="job-section-title">Required Skills</div>
        <div className="d-flex gap-2">
          {(job.requiredSkills || []).map((s) => (
            <span key={s} className="status-tag status-progress">
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
    </>
 
  );
};

export default JobOverviewCard;
