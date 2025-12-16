import React, { memo } from "react";
import { TrendingUp, Users, DollarSign, Activity } from "lucide-react"; // Or react-icons

// 1. OPTIMIZATION: Define static data outside to prevent re-creation on re-renders
const MOCK_DATA = [
  { label: "Total Users", value: "1,234", change: "+12%", cardType: "bg-blue-600", icon: Users },
  { label: "Revenue", value: "$45k", change: "+8%", cardType: "bg-purple-600", icon: DollarSign },
  { label: "Engagement", value: "85%", change: "+5%", cardType: "bg-orange-500", icon: Activity },
];

const StatCard = ({ data }) => {
  // 2. SAFETY: If data is missing or not an array, strictly fall back to MOCK_DATA
  const finalData = Array.isArray(data) && data.length > 0 ? data : MOCK_DATA;

  return (
    <div className="stats-grid">
      {finalData.map((item, index) => {
        // 3. CLEANUP: Handle dynamic icons safely
        const IconComponent = item.icon || TrendingUp; 

        return (
          <div key={index} className={`stat-card ${item.cardType || "bg-gray-700"}`}>
            {/* Decoration */}
            <div className="bubbles-container" style={{ color: item.bubbleColor || "rgba(255,255,255,0.1)" }}>
              <div className="bubble bubble-1" />
              <div className="bubble bubble-2" />
              <div className="bubble bubble-3" />
            </div>

            {/* Content */}
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

            {/* Icon */}
            <div className="stat-icon-box">
              <IconComponent size={24} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// 4. OPTIMIZATION: memo prevents re-renders if props haven't changed
export default memo(StatCard);
