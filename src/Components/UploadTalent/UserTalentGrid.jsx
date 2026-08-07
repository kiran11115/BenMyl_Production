import React, { memo, useState, useEffect } from "react";
import { FiMapPin, FiBriefcase, FiDollarSign, FiEye, FiUser, FiAward, FiStar, FiActivity, FiCpu, FiCode, FiBookOpen, FiArrowUp } from "react-icons/fi";
import { GiCheckMark } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import "../TalentPool/TalentPool.css";
import "../UserProjects/Projects.css";
import TalentResumeView from "../TalentPool/TalentResumeView";




export const CandidateCard = memo(({ candidate, isSelected, onToggle, onPrimaryAction, primaryActionLabel, small = false, index = 0 }) => {
  const navigate = useNavigate();
  const handleProfileClick = (e) => {
    e.stopPropagation();
    if (onPrimaryAction) {
      onPrimaryAction(candidate);
      return;
    }
    const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
    navigate(`${basePath}/talent-profile`, {
      state: {
        employeeId: candidate.id,
        candidate: candidate, // Pass the whole object as payload
      },
    });
  };

  const colors = ["#f5810c", "#3b82f6", "#10b981", "#8b5cf6", "#ec4899", "#f59e0b", "#06b6d4"];
  const avatarBgColor = colors[index % colors.length];

  const getInitials = (text = "") => {
    return text
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0].toUpperCase())
      .join("");
  };

  const hasRealCompany = candidate.company && candidate.company.toLowerCase() !== "benmyl";

  return (
    <div
      className={`project-card talent-card-premium ${small ? 'small-variant' : ''}`}
      style={small ? { padding: '16px', gap: '12px' } : {}}
    >
      {(() => {
        const icons = [FiUser, FiBriefcase, FiAward, FiStar, FiActivity, FiCpu, FiCode];
        const IconComponent = icons[index % icons.length];
        return <IconComponent className="card-bg-icon" style={{ color: avatarBgColor }} />;
      })()}
      {/* Header: Status Pill, Match Badge */}
      <div className="card-header-row">
        <span className="job-chip mint">
          {candidate.status || (candidate.verified ? 'Verified' : 'Pending')}
        </span>
        
        {candidate.profileCompletionPercentage !== undefined && (
          <div className="job-chip green">
            {candidate.profileCompletionPercentage}% completed
          </div>
        )}
      </div>

      {/* Profile Section: Avatar, Role, Rating, Company, Location */}
      <div 
        className="profile-section" 
      >
        <div 
          className="talent-avatar-border-circle"
          style={{ 
            "--percent": candidate.profileCompletionPercentage || 75,
            "--gradient-start": (candidate.profileCompletionPercentage || 75) < 40 ? "#fb923c" : (candidate.profileCompletionPercentage || 75) > 80 ? "#34d399" : "#60a5fa",
            "--gradient-mid": (candidate.profileCompletionPercentage || 75) < 40 ? "#f97316" : (candidate.profileCompletionPercentage || 75) > 80 ? "#10b981" : "#3b82f6",
            "--gradient-end": (candidate.profileCompletionPercentage || 75) < 40 ? "#ea580c" : (candidate.profileCompletionPercentage || 75) > 80 ? "#059669" : "#2563eb"
          }}
        >
          {candidate.avatar ? (
          <img
            src={candidate.avatar}
            alt={candidate.role || "Talent"}
            className="profile-avatar"
            style={small ? { width: '38px', height: '38px' } : {}}
          />
        ) : (
          <div
            className="profile-avatar initials"
            style={{
              backgroundColor: "#1e293b",
              color: "#ffffff",
              border: "1px solid #1e293b",
              ...(small ? { width: '34px', height: '34px', fontSize: '11px' } : {})
            }}
          >
            {getInitials(candidate.name)}
          </div>
        )}
          <div className="avatar-verified-badge" title="Verified Candidate">
            <GiCheckMark size={8} color="#ffffff" />
          </div>
        </div>
        <div className="profile-details">
          {/* Role Name on Top with Rating beside it */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
            <h4 className="role" style={small ? { fontSize: '12.5px', margin: 0, fontWeight: '700', color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 } : { margin: 0, fontSize: '13.5px', fontWeight: '700', color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
              {candidate.role || candidate.title || "Talent Role"}
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
              <FiStar size={11} fill="#f59e0b" color="#f59e0b" />
              <span className="star-rating-value" style={{ fontSize: '11px', fontWeight: '700', color: '#475569' }}>
                {(candidate.rating || 4.5).toFixed(1)}
              </span>
            </div>
          </div>

          {/* Company Name & First Name beside each other */}
          <p className="company-loc-text" style={{ margin: '2px 0 0', fontSize: '11.5px', color: '#64748b', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {hasRealCompany && (
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {candidate.company}
              </span>
            )}
            {hasRealCompany && (candidate.firstName || candidate.name) && <span>•</span>}
            {(candidate.firstName || candidate.name) && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
                <FiUser size={11} color="#94a3b8" />
                {candidate.firstName || candidate.name?.split(" ")[0]}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* ── Separate Section: Work Experience & Education ── */}
      <div className="card-edu-exp-block" style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '12px', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {/* Work Experience */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
          <FiBriefcase size={11} color="#f5810c" style={{ flexShrink: 0 }} />
          <span style={{ fontWeight: 600, color: '#475569' }}>Exp:</span>
          <span style={{ color: '#0f172a', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {candidate.experience ? `${candidate.experience}${typeof candidate.experience === 'number' || (!isNaN(candidate.experience) && String(candidate.experience).trim() !== '') ? (String(candidate.experience).toLowerCase().includes('yr') || String(candidate.experience).toLowerCase().includes('exp') ? '' : ' Yrs Exp') : ''}` : "N/A"}
          </span>
        </div>

        {/* Education */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
          <FiBookOpen size={11} color="#3b82f6" style={{ flexShrink: 0 }} />
          <span style={{ fontWeight: 600, color: '#475569' }}>Education:</span>
          <span style={{ color: '#0f172a', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {candidate.education || candidate.highestQualification || candidate.degree || "Bachelor's Degree"}
          </span>
        </div>
      </div>

      {/* Skills Chips Row */}
      {!small && candidate.skills && (
        <div className="skills-row">
          {candidate.skills.slice(0, 3).map((skill) => (
            <span 
              key={skill} 
              className="job-chip"
            >
              {skill}
            </span>
          ))}
          {candidate.skills.length > 3 && (
            <span className="job-chip more">
              +{candidate.skills.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer / Actions: Uploaded By + View Button + Select Button */}
      <div
        className="card-actions"
        onClick={(e) => e.stopPropagation()}
        style={{
          marginTop: 'auto',
          paddingTop: '12px',
          borderTop: '1px solid #edf0f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px'
        }}
      >
        {candidate.uploadedByName ? (
          <div
            className="uploaded-by-text"
            title={`Uploaded By: ${candidate.uploadedByName}`}
          >
            By: {candidate.uploadedByName}
          </div>
        ) : (
          <div />
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            className="job-card-view-btn"
            onClick={handleProfileClick}
            style={small ? { padding: '6px 12px', fontSize: '10.5px', borderRadius: '8px' } : { padding: '6px 16px', fontSize: '10.5px', borderRadius: '8px' }}
          >
            View
          </button>

          {!candidate.salary && (
            <button
              onClick={() => onToggle(candidate.id)}
              className={isSelected ? "btn-v2-primary shortlisted" : "btn-v2-primary"}
              style={small ? { padding: '6px 12px', fontSize: '10.5px', borderRadius: '8px' } : { padding: '8px 18px', borderRadius: '8px' }}
            >
              {isSelected ? (
                <span className="d-flex align-items-center gap-1 justify-content-center">
                  <GiCheckMark size={10} /> Selected
                </span>
              ) : (
                "Select"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

const UserTalentGrid = ({ candidates, selectedIds, onToggleSelect, onPrimaryAction }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 180) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };



  return (
    <>
      <div className="projects-grid">
        {candidates.map((c, index) => (
          <CandidateCard
            key={c.id}
            candidate={c}
            isSelected={selectedIds.has(c.id)}
            onToggle={onToggleSelect}
            onPrimaryAction={onPrimaryAction}
            index={index}
          />
        ))}
      </div>

      {showScrollTop && (
        <button
          className="talent-scroll-top-btn"
          onClick={scrollToTop}
          title="Scroll to top"
        >
          <FiArrowUp size={18} />
        </button>
      )}


    </>
  );
};

export default UserTalentGrid;
