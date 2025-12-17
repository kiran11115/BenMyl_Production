// StatsRow.jsx
import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import "./Projects.css";

const StatsRow = ({ stats }) => {
  return (
    <div className="stats-grid">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`stat-card ${stat.cardType || ""}`}
        >
          {/* Bubbles Decoration */}
          <div
            className="bubbles-container"
            style={{ color: stat.bubbleColor || "#3b82f6" }}
          >
            <div className="bubble bubble-1"></div>
            <div className="bubble bubble-2"></div>
            <div className="bubble bubble-3"></div>
          </div>

          <div className="stat-content">
            <span className="stat-label">{stat.label}</span>
            <div className="stat-value-row">
              <span className="stat-value">{stat.value}</span>
            </div>

            <div
              className={`stat-trend ${
                stat.isPositive ? "trend-up" : "trend-down"
              }`}
            >
              {stat.isPositive ? (
                <TrendingUp size={14} />
              ) : (
                <TrendingDown size={14} />
              )}
              <span>{stat.trend}</span>
            </div>
          </div>

          <div className="stat-icon-box">
            <stat.icon size={24} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsRow;
