import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiStar, FiCheck, FiX, FiPlus } from 'react-icons/fi';
import '../Filters/FiltersSidebar.css';


// --- DATA CONSTANTS ---
const ROLE_TYPES = [
  'Frontend Developer',
  'Full Stack Engineer',
  'UI/UX Designer', 
  'React Native Developer', 
];


const POPULAR_LOCATIONS = [
  'San Francisco, CA',
  'New York, NY',
  'Austin, TX',
  'London, UK',
  'Bengaluru, India',
  'Remote'
];


const LOCATION_TYPES = [
  'Any Type',
  'Remote',
  'On-Site',
  'Hybrid'
];


const EXPERIENCE_LEVELS = [
  'Any Experience',
  'Junior (0-3 years)',
  'Mid-Level (3-7 years)',
  'Senior (8+ years)'
];


const AVAILABILITY_OPTIONS = [
  'Any Time',
  'Immediate',
  '1-3 Days',
  '3-7 Days',
  '1-2 Weeks'
];


// --- REUSABLE MULTI-SELECT DROPDOWN COMPONENT ---
const MultiSelectDropdown = ({ label, options, selectedValues, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const toggleOption = (option) => {
    const newValues = selectedValues.includes(option)
      ? selectedValues.filter(item => item !== option)
      : [...selectedValues, option];
    onChange(newValues);
  };


  return (
    <div className="select-wrapper" ref={dropdownRef} style={{ position: 'relative' }}>
      <div 
        className="filter-select" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          cursor: 'pointer', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          minHeight: '44px'
        }}
      >
        <span style={{ 
          color: selectedValues.length ? '#0f172a' : '#64748b',
          fontSize: '14px'
        }}>
          {isOpen ? "Close List" : (selectedValues.length > 0 ? `${selectedValues.length} selected` : label)}
        </span>
        {isOpen ? (
          <FiChevronDown style={{ transform: 'rotate(180deg)', fontSize: '16px' }} /> 
        ) : (
          <FiPlus style={{ fontSize: '16px' }} />
        )}
      </div>


      {isOpen && (
        <div className="custom-dropdown-menu">
          {options.map(option => (
            <div 
              key={option} 
              className="custom-option" 
              onClick={() => toggleOption(option)}
            >
              <div className={`custom-checkbox ${selectedValues.includes(option) ? 'checked' : ''}`}>
                {selectedValues.includes(option) && <FiCheck size={10} color="white" />}
              </div>
              <span>{option}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


// --- MAIN COMPONENT ---
const JobFilters = ({ onApplyFilters }) => {
  const initialFilters = {
    roles: [],          // Fixed key name from 'Role' to 'roles'
    locations: [],        
    locationType: 'Any Type', 
    experience: 'Any Experience',
    availability: [],
    minRating: 0,
    maxBudget: 200,
  };


  const [filterInputs, setFilterInputs] = useState(initialFilters);


  const handleInputChange = (field, value) => {
    setFilterInputs(prev => ({ ...prev, [field]: value }));
  };


  // --- TAG REMOVAL HELPERS ---
  const removeTag = (field, value) => {
    setFilterInputs(prev => ({
      ...prev,
      [field]: prev[field].filter(item => item !== value)
    }));
  };


  const applyFilters = () => {
    if (onApplyFilters) onApplyFilters(filterInputs);
  };


  const resetFilters = () => {
    setFilterInputs(initialFilters);
  };


  return (
    <div className="filter-sidebar">
      {/* Header */}
      <div className="filter-header mb-4">
        <h3 className="filter-title">Filters</h3>
        <span onClick={resetFilters} className="filter-reset">Reset</span>
      </div>


      {/* 1. Roles */}
      <div className="filter-section">
        <h4 className="section-title">Find by Roles</h4>


        {/* Active Role Tags */}
        {filterInputs.roles.length > 0 && (
          <div className="tags-container">
            {filterInputs.roles.map(role => (
              <span key={role} className="filter-tag">
                {role}
                <FiX 
                  className="tag-close-icon" 
                  onClick={() => removeTag('roles', role)} 
                />
              </span>
            ))}
          </div>
        )}
         <MultiSelectDropdown 
          label="Find by Talent"
          options={ROLE_TYPES}
          selectedValues={filterInputs.roles}
          onChange={(newValues) => handleInputChange('roles', newValues)}
        />
      </div>




      {/* 2. Locations (Tags + Multi-Select) */}
      <div className="filter-section">
        <h4 className="section-title">Locations</h4>


        {/* Active Location Tags */}
        {filterInputs.locations.length > 0 && (
          <div className="tags-container">
            {filterInputs.locations.map(loc => (
              <span key={loc} className="filter-tag">
                {loc}
                <FiX 
                  className="tag-close-icon" 
                  onClick={() => removeTag('locations', loc)} 
                />
              </span>
            ))}
          </div>
        )}
        <MultiSelectDropdown 
          label="Add Locations..."
          options={POPULAR_LOCATIONS}
          selectedValues={filterInputs.locations}
          onChange={(newValues) => handleInputChange('locations', newValues)}
        />
      </div>


      {/* 3. Location Type (Single Selection) */}
      <div className="filter-section">
        <h4 className="section-title">Job Type</h4>
        <div className="select-wrapper">
          <select 
            className="filter-select"
            value={filterInputs.locationType}
            onChange={(e) => handleInputChange('locationType', e.target.value)}
          >
            {LOCATION_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <FiChevronDown className="select-icon" />
        </div>
      </div>


      {/* 4. Availability (Multi-Select) */}
      <div className="filter-section">
        <h4 className="section-title">Availability</h4>


        {/* Active Availability Tags */}
        {filterInputs.availability.length > 0 && (
          <div className="tags-container">
            {filterInputs.availability.map(avail => (
              <span key={avail} className="filter-tag">
                {avail}
                <FiX 
                  className="tag-close-icon" 
                  onClick={() => removeTag('availability', avail)} 
                />
              </span>
            ))}
          </div>
        )}


        <MultiSelectDropdown 
          label="Select Availability..."
          options={AVAILABILITY_OPTIONS}
          selectedValues={filterInputs.availability}
          onChange={(newValues) => handleInputChange('availability', newValues)}
        />
      </div>


      {/* 5. Experience Level (Single) */}
      <div className="filter-section">
        <h4 className="section-title">Experience Level</h4>
        <div className="select-wrapper">
          <select 
            className="filter-select"
            value={filterInputs.experience}
            onChange={(e) => handleInputChange('experience', e.target.value)}
          >
            {EXPERIENCE_LEVELS.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
          <FiChevronDown className="select-icon" />
        </div>
      </div>


      {/* 6. Minimum Rating */}
      <div className="filter-section">
        <h4 className="section-title">Minimum Rating</h4>
        <div className="rating-container">
          {[1, 2, 3, 4, 5].map((star) => {
            const isActive = filterInputs.minRating >= star;
            return (
              <button 
                key={star} 
                onClick={() => handleInputChange('minRating', star)}
                type="button"
                className={`rating-btn ${isActive ? 'active' : ''}`}
              >
                <FiStar 
                  size={16} 
                  fill={isActive ? "#f59f0a" : "none"} 
                  color={isActive ? "#f59f0a" : "#94a3b8"} 
                />
              </button>
            );
          })}
        </div>
      </div>


      {/* 7. Budget */}
      <div className="budget-section">
        <h4 className="section-title">Max Hourly Rate</h4>
        <input 
          type="range" 
          className="budget-slider"
          min="0" 
          max="200" 
          step="5"
          value={filterInputs.maxBudget} 
          onChange={(e) => handleInputChange('maxBudget', Number(e.target.value))}
        />
        <div className="budget-labels">
          <span>$0</span>
          <span>${filterInputs.maxBudget}/hr</span>
        </div>
      </div>


      {/* Apply Button */}
      <button onClick={applyFilters} className="apply-btn">
        Apply Filters
      </button>


      {/* INLINE STYLES */}
      <style jsx>{`
        /* Tag Styles */
        .tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 8px;
        }
        .filter-tag {
          background: #e0e7ff;
          color: #4338ca;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .tag-close-icon {
          cursor: pointer;
          opacity: 0.7;
        }
        .tag-close-icon:hover {
          opacity: 1;
        }
        .checkbox-row {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          font-size: 14px;
          color: #334155;
        }
        .checkbox-container {
          position: relative;
          width: 18px;
          height: 18px;
        }
        .checkbox-container input {
          opacity: 0;
          position: absolute;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }
        .checkmark {
          position: absolute;
          top: 0;
          left: 0;
          height: 18px;
          width: 18px;
          background-color: #fff;
          border: 1px solid #cbd5e1;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .checkbox-row:hover .checkmark {
          border-color: #6366f1;
        }
        .checkbox-container input:checked ~ .checkmark {
          background-color: #6366f1;
          border-color: #6366f1;
        }
        .custom-dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          margin-top: 4px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          z-index: 50;
          max-height: 200px;
          overflow-y: auto;
          padding: 4px 0;
        }
        .custom-option {
          padding: 8px 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: background 0.2s;
          font-size: 14px;
          color: #334155;
        }
        .custom-option:hover {
          background-color: #f8fafc;
        }
        .custom-checkbox {
          width: 16px;
          height: 16px;
          border: 1px solid #cbd5e1;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          flex-shrink: 0;
        }
        .custom-checkbox.checked {
          background-color: #6366f1;
          border-color: #6366f1;
        }
      `}</style>
    </div>
  );
};


export default JobFilters;
