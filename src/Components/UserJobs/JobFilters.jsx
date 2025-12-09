import React, { useState } from 'react';
import { FiFilter } from 'react-icons/fi';
import './Jobs.css';

const JobFilters = ({ currentFilters, onFilterChange }) => {
  const [skillInput, setSkillInput] = useState("");

  // Handler for text inputs
  const handleKeywordChange = (e) => {
    onFilterChange({ keyword: e.target.value });
  };

  // Handler for Radio Buttons (Job Type)
  const handleTypeChange = (type) => {
    onFilterChange({ jobType: type });
  };

  // Handler for Range Slider
  const handleRangeChange = (e) => {
    onFilterChange({ minRate: parseInt(e.target.value, 10) });
  };

  // Handler for Checkboxes (Experience)
  const handleExperienceChange = (level) => {
    const currentLevels = currentFilters.experienceLevels;
    let newLevels;
    
    if (currentLevels.includes(level)) {
      newLevels = currentLevels.filter(l => l !== level);
    } else {
      newLevels = [...currentLevels, level];
    }
    
    onFilterChange({ experienceLevels: newLevels });
  };

  // Handler for adding skills
  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      if (!currentFilters.skillTags.includes(skillInput.trim())) {
        onFilterChange({ 
          skillTags: [...currentFilters.skillTags, skillInput.trim()] 
        });
      }
      setSkillInput("");
    }
  };

  // Handler for removing skills
  const removeSkill = (skillToRemove) => {
    onFilterChange({
      skillTags: currentFilters.skillTags.filter(skill => skill !== skillToRemove)
    });
  };

  return (
    <aside className="filters-sidebar card-base">
      <div className="filter-header">
        <h3>Filter</h3>
        <span className="filter-icon"><FiFilter size={18} /></span>
      </div>

      {/* Keywords Input */}
      <div className="filter-group">
        <label className="filter-label">Keywords</label>
        <input 
          type="text" 
          placeholder="e.g. Job title, skills" 
          className="input-field"
          value={currentFilters.keyword}
          onChange={handleKeywordChange}
        />
      </div>

      {/* Job Type Radio */}
      <div className="filter-group">
        <label className="filter-label">Job Type</label>
        <div className="checkbox-group">
          {['All Types', 'Remote', 'Hybrid', 'On-site'].map((type, idx) => (
            <label key={idx} className="checkbox-item">
              <input 
                type="radio" 
                name="jobType" 
                checked={currentFilters.jobType === type}
                onChange={() => handleTypeChange(type)}
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rate Range Slider */}
      <div className="filter-group">
        <label className="filter-label">Min Rate ($/hr)</label>
        <input 
          type="range" 
          className="range-slider" 
          min="30" 
          max="200" 
          step="10"
          value={currentFilters.minRate}
          onChange={handleRangeChange}
        />
        <div className="range-values">
          <span>${currentFilters.minRate}</span>
          <span>$200k+</span>
        </div>
      </div>

      {/* Experience Checkboxes */}
      <div className="filter-group">
        <label className="filter-label">Experience Level</label>
        <div className="checkbox-group">
          {['Entry Level', 'Mid Level', 'Senior Level', 'Executive'].map((level, idx) => (
            <label key={idx} className="checkbox-item">
              <input 
                type="checkbox" 
                checked={currentFilters.experienceLevels.includes(level)}
                onChange={() => handleExperienceChange(level)}
              />
              <span>{level}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Skills Tags */}
      <div className="filter-group">
        <label className="filter-label">Skills</label>
        <input 
          type="text" 
          placeholder="Type & Enter to add" 
          className="input-field mb-2" 
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={handleAddSkill}
        />
        <div className="skills-tags-wrapper">
          {currentFilters.skillTags.map(skill => (
            <span key={skill} className="skill-tag" onClick={() => removeSkill(skill)}>
              {skill} &times;
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default JobFilters;
