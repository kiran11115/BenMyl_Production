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
    <div className="job-overview-premium-card" style={{ padding: '20px', borderRadius: '12px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
      {/* Job Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ width: '44px', height: '44px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a' }}>
            <FiBriefcase size={20} strokeWidth={1.5} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.01em', lineHeight: '1.2' }}>
              {jobTitle}
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#475569', fontWeight: '500' }}>
              {companyName}
            </p>

            <div style={{ display: 'flex', gap: '14px', fontSize: '12px', color: '#64748b', fontWeight: '400', marginTop: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FiMapPin size={13} color="#94a3b8" />
                {location}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FiDollarSign size={13} color="#94a3b8" />
                {minSal && maxSal
                  ? `${currSym}${minSal} - ${currSym}${maxSal} ${salType}`
                  : minSal
                    ? `${currSym}${minSal} ${salType}`
                    : "Not Disclosed"}
              </div>

              {postedDate && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FiClock size={13} color="#94a3b8" />
                  Posted {formatPostedDate(postedDate)}
                </div>
              )}
            </div>
          </div>
        </div>

        {!hideShare && (
          <div>
            <ShareJobCard job={job} />
          </div>
        )}
      </div>

      {/* Grid of Key Info */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9', marginBottom: '16px' }}>
        {workModel && (
          <div>
            <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '600', marginBottom: '4px' }}>Work Model</div>
            <div style={{ fontSize: '13px', color: '#0f172a', fontWeight: '500' }}>{workModel}</div>
          </div>
        )}
        {exp && (
          <div>
            <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '600', marginBottom: '4px' }}>Experience</div>
            <div style={{ fontSize: '13px', color: '#0f172a', fontWeight: '500' }}>{exp} {String(exp).toLowerCase().includes('yr') ? '' : 'Years'}</div>
          </div>
        )}
        {edu && (
          <div>
            <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '600', marginBottom: '4px' }}>Education</div>
            <div style={{ fontSize: '13px', color: '#0f172a', fontWeight: '500' }}>{edu}</div>
          </div>
        )}
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
          if(auths.length === 0) return null;
          return (
            <div>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '600', marginBottom: '4px' }}>Work Auth</div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {auths.map(a => (
                  <span key={a.label} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '500' }}>{a.label}</span>
                ))}
              </div>
            </div>
          );
        })()}
        {(() => {
          const prefs = [
            { label: "Corp-Corp", val: job.isCorpToCorp },
            { label: "W2-Perm", val: job.isW2Permanent },
            { label: "W2-Contract", val: job.isW2Contract },
            { label: "1099", val: job.is1099Contract },
            { label: "C2H", val: job.isContractToHire },
          ].filter(a => a.val === true);
          if(prefs.length === 0) return null;
          return (
            <div>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '600', marginBottom: '4px' }}>Emp Preference</div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {prefs.map(p => (
                  <span key={p.label} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '500' }}>{p.label}</span>
                ))}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Job Description */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '10px' }}>
          Job Description
        </h4>
        {jobDesc ? (
          <div
            className="google-jd-content premium-jd-content"
            style={{ color: '#334155', lineHeight: '1.6', fontSize: '13px' }}
            dangerouslySetInnerHTML={{
              __html: formatMarkdownToHtml(jobDesc),
            }}
          />
        ) : (
          <p style={{ color: "#64748b", fontStyle: 'italic', fontSize: '13px' }}>
            No description available for this job.
          </p>
        )}
      </div>

      {/* Skills */}
      <div>
        <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '10px' }}>
          Required Skills
        </h4>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {(
            Array.isArray(job.requiredSkills) ? job.requiredSkills :
            Array.isArray(job.skills) ? job.skills :
            (job.requiredSkills || job.skills)?.split(",") || []
          ).map((skill, idx) => (
            <span key={idx} style={{ 
              background: '#f1f5f9', 
              color: '#334155', 
              padding: '4px 10px', 
              borderRadius: '6px', 
              fontSize: '11.5px', 
              fontWeight: '500', 
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 2px rgba(0,0,0,0.01)'
            }}>
              {String(skill).trim()}
            </span>
          ))}
          {(!job.requiredSkills && !job.skills) && (
            <span style={{ color: '#64748b', fontStyle: 'italic', fontSize: '12px' }}>Not specified</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobOverviewCard;
