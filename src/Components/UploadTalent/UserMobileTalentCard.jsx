import React from "react";
import { FiMapPin, FiBriefcase, FiEye } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import TalentAvailabilityBadge from "./TalentAvailabilityBadge";

const UserMobileTalentCard = ({ candidate, isSelected, onToggle }) => {
    const navigate = useNavigate();
    const handleProfileClick = () => {
        navigate("/user/talent-profile", {
            state: {
                employeeId: candidate.id,
            },
        });
    };

    const getInitials = (name = "") => {
        return name
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((n) => n[0].toUpperCase())
            .join("");
    };

    return (
        <div className={`mobile-talent-card ${isSelected ? "selected" : ""}`}>
            <div className="card-top">
                <div className="candidate-info">
                    <div className="mobile-avatar">{getInitials(candidate.name)}</div>
                    <div className="text-content">
                        <h4 className="file-name">{candidate.name}</h4>
                        <p className="candidate-email">{candidate.email}</p>
                    </div>
                </div>
                <div className="action-row">
                    <button className="view-btn icon-only" onClick={handleProfileClick}>
                        <FiEye size={18} />
                    </button>
                    <input
                        type="checkbox"
                        className="card-checkbox"
                        checked={isSelected}
                        onChange={() => onToggle(candidate.id)}
                    />
                </div>
            </div>

            <div className="card-details-grid">
                <div className="detail-item">
                    <FiBriefcase size={14} />
                    <span>{candidate.role}</span>
                </div>
                <div className="detail-item">
                    <FiMapPin size={14} />
                    <span>{candidate.location}</span>
                </div>
                <div className="detail-item full-width">
                    <div className="availability-badges">
                        {candidate.availability.map((avail) => (
                            <TalentAvailabilityBadge key={avail} text={avail} />
                        ))}
                    </div>
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
          transition: all 0.2s;
        }

        .mobile-talent-card.selected {
            border-color: #f5810c;
            background: #fffaf5;
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .candidate-info {
          display: flex;
          gap: 12px;
          align-items: center;
          flex: 1;
          min-width: 0;
        }

        .mobile-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #f1f5f9;
          color: #475569;
          display: flex;
          align-items: center;
          justify-content: center;
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
          font-size: 15px;
          font-weight: 700;
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

        .action-row {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .view-btn {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #475569;
          padding: 10px;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .card-checkbox {
            width: 20px;
            height: 20px;
            accent-color: #f5810c;
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

        .availability-badges {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
        }
      `}</style>
        </div>
    );
};

export default UserMobileTalentCard;
