import React from "react";
import { TrendingUp } from "lucide-react";

const StatsGrid = ({ data }) => {
  return (
    <div className="stats-grid">
      {data.map((item, index) => (
        <div key={index} className={`stat-card ${item.cardType}`}>
          {/* Bubbles Decoration */}
          <div className="bubbles-container" style={{ color: item.bubbleColor }}>
            <div className="bubble bubble-1"></div>
            <div className="bubble bubble-2"></div>
            <div className="bubble bubble-3"></div>
          </div>

          <div className="stat-content">
            <span className="stat-label">{item.label}</span>
            <div className="stat-value-row">
              <span className="stat-value">{item.value}</span>
            </div>
            <div className="stat-trend trend-up">
              <TrendingUp size={14} />
              <span>{item.change}</span>
            </div>
          </div>

          <div className="stat-icon-box">
            <item.icon size={24} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
