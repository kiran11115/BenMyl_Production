import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import "./Projects.css";

const StatsRow = ({ stats }) => {
  return (
    <div className="stats-grid">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`stat-card ${stat.cardType || ""} ${stat.isNonFunctional ? "non-functional" : ""}`}
        >
          {/* Floating bubble decorations */}
          <div
            className="bubbles-container"
            style={{ color: stat.bubbleColor || "#3b82f6" }}
          >
            <div className="bubble bubble-1" />
            <div className="bubble bubble-2" />
            <div className="bubble bubble-3" />
          </div>

          <div className="stat-content">
            <span className="stat-label">{stat.label}</span>
            <div className="stat-value-row">
              <span className="stat-value">{stat.value}</span>
            </div>
            <div className={`stat-trend ${stat.isPositive ? "trend-up" : "trend-down"}`}>
              {stat.isPositive ? (
                <TrendingUp size={13} />
              ) : (
                <TrendingDown size={13} />
              )}
              <span>{stat.trend}</span>
            </div>
          </div>

          <div className="stat-icon-box">
            <stat.icon size={22} />
          </div>

          {stat.isNonFunctional && (
            <div className="coming-soon-badge">
              Coming Soon
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StatsRow;
