import React from "react";
import { IoEyeOutline } from "react-icons/io5";
import { FileText, Calendar, User, CheckCircle, Clock } from "lucide-react";

const MobileTalentCard = ({ talent, onView }) => {
  const getAvatarColor = (name = "") => {
    const colors = ["#3b82f6", "#6366f1", "#8b5cf6", "#ec4899", "#f97316"];
    return colors[name.length % colors.length];
  };

  const getInitials = (name = "") =>
    name
      .split(" ")
      .slice(0, 1)
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <div className="mobile-talent-card">
      <div className="card-top">
        <div className="candidate-info">
          <div
            className="mobile-avatar"
            style={{ background: getAvatarColor(talent.fileName) }}
          >
            {getInitials(talent.fileName)}
          </div>
          <div className="text-content">
            <h4 className="file-name">{talent.fileName}</h4>
            <p className="candidate-email">{talent.email}</p>
          </div>
        </div>
        <button className="view-btn" onClick={onView}>
          <IoEyeOutline size={20} />
        </button>
      </div>

      <div className="card-details-grid">
        <div className="detail-item">
          <FileText size={14} />
          <span>{talent.batchFormat}</span>
        </div>
        <div className="detail-item">
          <Calendar size={14} />
          <span>{talent.uploadDate}</span>
        </div>
        <div className="detail-item full-width">
          <span className={`status-pill ${talent.statusClass}`}>
            {talent.extractStatus === "Pending For Review" ? <Clock size={12} /> : <CheckCircle size={12} />}
            {talent.extractStatus}
          </span>
        </div>
      </div>

      <style jsx>{`
        .mobile-talent-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center; /* Changed from flex-start to center */
          margin-bottom: 16px;
        }

        .candidate-info {
          display: flex;
          gap: 12px;
          align-items: center;
          flex: 1; /* Ensure text takes up available space */
          min-width: 0; /* Enable text truncation if needed */
        }

        .mobile-avatar {
          width: 44px; /* Increased slightly */
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 14px;
          flex-shrink: 0;
        }

        .text-content {
          min-width: 0;
          flex: 1;
        }

        .text-content .file-name {
          margin: 0;
          font-size: 15px; /* Increased */
          font-weight: 700; /* Bolder */
          color: #1e293b;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .text-content .candidate-email {
          margin: 2px 0 0 0;
          font-size: 12px;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .view-btn {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #475569;
          padding: 10px; /* Increased padding */
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s;
        }

        .view-btn:active {
          background: #f1f5f9;
          transform: scale(0.95);
        }

        .card-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          padding-top: 12px;
          border-top: 1px solid #f1f5f9;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #475569;
        }

        .detail-item.full-width {
          grid-column: span 2;
        }

        .status-pill {
          display: flex;
          align-items: center;
          justify-content: center; /* Center content in pill */
          gap: 6px;
          padding: 6px 12px; /* Increased padding */
          border-radius: 20px;
          font-weight: 700; /* Bolder */
          font-size: 12px; /* Slightly larger */
          width: 100%; /* Full width in its grid cell */
          text-align: center;
        }

        .status-yellow {
          background: #fffbeb;
          color: #d97706;
          border: 1px solid #fef3c7;
        }

        .status-green {
          background: #f0fdf4;
          color: #16a34a;
          border: 1px solid #dcfce7;
        }
      `}</style>
    </div>
  );
};

export default MobileTalentCard;
