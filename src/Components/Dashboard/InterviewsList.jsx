import React from "react";
import { Calendar, Clock, MoreVertical } from "lucide-react";

const InterviewsList = ({ interviews }) => {
  
  const getTagClass = (tag) => {
    const lower = tag.toLowerCase();
    if (lower.includes("tech")) return "tag-technical";
    if (lower.includes("hr")) return "tag-hr";
    if (lower.includes("manager")) return "tag-managerial";
    return ""; 
  };

  return (
    <div className="project-card" style={{ padding: '16px' }}>
      
      {/* Header with Title and Options Dots */}
      <div className="card-header-compact">
        <h3 className="card-title" style={{ fontSize: '13px', margin: 0 }}>Interviews</h3>
        <button className="options-btn">
          <MoreVertical size={16} />
        </button>
      </div>
      
      {/* List */}
      <div className="interviews-wrapper">
        {interviews.map((int, i) => (
          <div key={i} className="interview-item-premium">
            <div className="icon-box-premium">
              <Calendar size={14} strokeWidth={2.5} />
            </div>
            
            <div className="interview-content">
              <div className="interview-title">
                {int.name}
              </div>
              <div className="interview-meta-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Clock size={10} />
                  {int.time}
                </div>
                {int.tag && (
                  <span className={`status-tag status-progress${getTagClass(int.tag)}`}>
                    {int.tag}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewsList;
