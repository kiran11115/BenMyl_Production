import React from "react";
import { FiMapPin, FiDollarSign, FiClock, FiBriefcase, FiFileText, FiLayers } from "react-icons/fi";
import ShareJobCard from "../UserProjects/ShareJobCard";

const JobOverviewCard = ({ job, isExpanded, onToggle, hideShare }) => {
  const formatMarkdownToHtml = (text) => {
    if (!text) return "";
    let formatted = text;
    formatted = formatted.replace(/^[^\n]*\n?/, ""); // Remove first line if needed, matching JobOverview
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    formatted = formatted.replace(/^\s*-\s+(.*)$/gm, "<li>$1</li>");
    if (formatted.includes("<li>")) {
      formatted = formatted.replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>");
    }
    formatted = formatted.replace(/\n/g, "<br/>");
    return formatted;
  };

  const formatPostedDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getSkillColor = (index) => {
    const colors = ["orange", "pink", "purple", "mint", "blue", "green"];
    return colors[index % colors.length];
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

  // Handle differences in prop names between different callers (e.g. TalentPool vs ScheduleInterview)
  const jobTitle = job.jobTitle || job.title || "Job Title";
  const companyName = job.companyName || job.company || "Company Name";
  const location = job.location || [job.city, job.state, job.country].filter(Boolean).join(", ") || "Location";

  // Salary — IND uses minSalary/maxSalary/currency, US uses salaryRange_Min/Max
  const minSal = job.minSalary ?? job.salaryRange_Min ?? job.budget ?? job.rateText;
  const maxSal = job.maxSalary ?? job.salaryRange_Max;
  const currSym = job.currency === "INR" ? "₹" : (job.currency === "USD" ? "$" : (job.currency || "$"));
  const salType = job.salaryType ?? job.salarType ?? "/hr";

  const postedDate = job.createdOn || job.postedDate;

  // Work model — IND uses workMode, US uses workModels
  const workModel = job.workMode || job.workModels || ((job.jobDescription || job.jobSummary || job.description || "")?.includes("Remote") ? "Remote" : undefined);

  // Experience — IND uses experienceRequired, US uses yearsofExperience/yearsOfExperience
  const exp = job.experienceRequired ?? job.yearsOfExperience ?? job.yearsofExperience ?? job.experience ?? job.experienceText;

  // Education — IND uses education/highestQualification, US uses educationLevel
  const edu = job.education || job.educationLevel || job.highestQualification;

  // Description — IND uses jobSummary, US uses jobDescription
  const jobDesc = job.jobSummary || job.jobDescription || job.description;

  return (
    <div className="dashboard-column-main card-base" style={{ padding: '24px', borderRadius: '16px', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
      {/* Job Header */}
      <div className="job-card-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px'}}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div className="company-icon-box large" style={{ width: '48px', height: '48px', background: '#f1f5f9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
            <FiBriefcase size={20} />
          </div>

          <div className="job-header-info">
            <h3 className="job-title">
              {jobTitle}
            </h3>
            <p className="company-name">
              {companyName}
            </p>

            <div className="d-flex gap-3" style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
              <div className="meta-item" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiMapPin size={12} />
                {location}
              </div>

              <div className="meta-item" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiDollarSign size={12} />
                {minSal && maxSal
                  ? `${currSym}${minSal} - ${currSym}${maxSal} ${salType}`
                  : minSal
                    ? `${currSym}${minSal} ${salType}`
                    : ""}
              </div>

              {postedDate && (
                <div className="meta-item text-indigo" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4f46e5' }}>
                  <FiClock size={12} />
                  Posted on {formatPostedDate(postedDate)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* LinkedIn / Share — above stats */}
        {!hideShare && (
          <div className="jov-linkedin-bar">
            <ShareJobCard job={job} />
          </div>
        )}
      </div>

      <div className="d-flex">
        {/* Multi-color Stat Grid + Work Auth */}
        <div className="jov-auth-row" style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
          {/* Stat Pills Row */}
          <div className="jov-stat-pills" style={{ display: 'flex', gap: '24px' }}>
            {workModel && (
              <div className="jov-stat-pill" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span className="jov-auth-label" style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Work Model</span>
                <span className="job-chip green">{workModel}</span>
              </div>
            )}
            {exp && (
              <div className="jov-stat-pill" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span className="jov-auth-label" style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Experience</span>
                <span className="job-chip purple">{exp} {String(exp).includes('yrs') || String(exp).includes('Yrs') ? '' : 'YRS'}</span>
              </div>
            )}
            {edu && (
              <div className="jov-stat-pill" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span className="jov-auth-label" style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Education</span>
                <span className="job-chip mint">{edu}</span>
              </div>
            )}

            {/* Work Auth Chips */}
            {(() => {
              const auths = [
                { label: "OPT", val: job.isOPT },
                { label: "CPT", val: job.isCPT },
                { label: "H1B", val: job.isH1B },
                { label: "EAD", val: job.isEAD },
                { label: "GC", val: job.isGC },
                { label: "H4", val: job.isH4 },
                { label: "US Citizen", val: job.isUSCitizen },
              ].filter(a => a.val === true);

              const prefs = [
                { label: "Corp-Corp", val: job.isCorpToCorp },
                { label: "W2-Perm", val: job.isW2Permanent },
                { label: "W2-Contract", val: job.isW2Contract },
                { label: "1099", val: job.is1099Contract },
                { label: "C2H", val: job.isContractToHire },
              ].filter(a => a.val === true);

              return (
                <div className="d-flex gap-4 align-items-center">
                  {auths.length > 0 && (
                    <div className="jov-auth-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span className="jov-auth-label" style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Work Auth</span>
                      <div className="jov-auth-chips" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {auths.map(a => (
                          <span key={a.label} className="job-chip orange">{a.label}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {prefs.length > 0 && (
                    <div className="jov-auth-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span className="jov-auth-label" style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Employment Pref</span>
                      <div className="jov-auth-chips" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {prefs.map(p => (
                          <span key={p.label} className="job-chip pink">{p.label}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Job Description */}
      <div className="drawer-section">
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', marginBottom: '16px' }}>
          <FiFileText size={14} /> Job Description
        </h4>
        {jobDesc ? (
          <div
            className="google-jd-content"
            dangerouslySetInnerHTML={{
              __html: formatMarkdownToHtml(jobDesc),
            }}
          />
        ) : (
          <p style={{ color: "#64748b" }}>
            No description available for this job.
          </p>
        )}
      </div>

      {/* Skills — multi-color pills */}
      <div className="drawer-section mt-3">
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', marginBottom: '16px' }}>
          <FiLayers size={14} /> Required Skills
        </h4>
        <div className="skills-cloud" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {(
            Array.isArray(job.requiredSkills) ? job.requiredSkills :
            Array.isArray(job.skills) ? job.skills :
            (job.requiredSkills || job.skills)?.split(",") || ["REACT", "HTML", "CSS", "JAVASCRIPT"]
          ).map((skill, idx) => {
            const c = getSkillColor(idx);
            return (
              <span key={idx} className={`job-chip ${c}`}>
                {String(skill).trim()}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default JobOverviewCard;
