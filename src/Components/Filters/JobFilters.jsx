import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiStar, FiCheck, FiX, FiPlus } from 'react-icons/fi';
import '../Filters/FiltersSidebar.css';
import { useGetAllRoleNamesQuery } from '../../State-Management/Api/TalentPoolApiSlice';


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
  'Part-Time',
  'Full-Time',
  'Contract',
];

const SKILLS_LIST = [
  "React",
  "JavaScript",
  "TypeScript",
  "Node.js",
  "Python",
  "SQL",
  "Power BI",
  "Redux",
  "HTML",
  "CSS",
  "C#",
  ".NET",
  "Azure",
  "AWS"
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
const JobFilters = ({ onApplyFilters,initialFilters }) => {
  const userId = localStorage.getItem("logincompanyid");

const { data: roleOptions = [] } = useGetAllRoleNamesQuery(userId);


  const [filterInputs, setFilterInputs] = useState(initialFilters);


  const handleInputChange = (field, value) => {
    setFilterInputs(prev => ({ ...prev, [field]: value }));
  };


  // --- TAG REMOVAL HELPERS ---
  const removeTag = (field, value) => {
  setFilterInputs(prev => {
    const updatedFilters = {
      ...prev,
      [field]: prev[field].filter(item => item !== value)
    };

    // Immediately notify parent
    if (onApplyFilters) {
      onApplyFilters(updatedFilters);
    }

    return updatedFilters;
  });
};

const removeSkill = (skill) => {
  setFilterInputs(prev => {
    const updatedFilters = {
      ...prev,
      skills: prev.skills.filter(item => item !== skill)
    };

    if (onApplyFilters) {
      onApplyFilters(updatedFilters);
    }

    return updatedFilters;
  });
};

  const [availability, setAvailability] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (option) => {
    if (availability.includes(option)) {
      setAvailability(availability.filter((item) => item !== option));
    } else {
      setAvailability([...availability, option]);
    }
  };

  const removeAvailability = (option) => {
    setAvailability(availability.filter((item) => item !== option));
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
          label="Find by Roles"
          options={roleOptions}
          selectedValues={filterInputs.roles}
          onChange={(newValues) => handleInputChange('roles', newValues)}
        />
      </div>

      {/* Location Type (Single Selection) */}
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


{/* Skills & Tech */}
<div className="filter-section">
  <h4 className="section-title">Skills & Tech</h4>

  {/* Active Skills Tags */}
  {filterInputs.skills?.length > 0 && (
    <div className="tags-container">
      {filterInputs.skills.map(skill => (
        <span key={skill} className="filter-tag">
          {skill}
          <FiX
            className="tag-close-icon"
            onClick={() => removeSkill(skill)}
          />
        </span>
      ))}
    </div>
  )}

  {/* Multi Select Dropdown */}
  <MultiSelectDropdown
    label="Add Skills..."
    options={SKILLS_LIST}
    selectedValues={filterInputs.skills || []}
    onChange={(newValues) => handleInputChange("skills", newValues)}
  />
</div>



    <div className="filter-section">
      <h4 className="section-title">Employment Type</h4>

      {/* Selected Tags */}
      {availability.length > 0 && (
        <div className="tags-container">
          {availability.map((a) => (
            <span key={a} className="filter-tag">
              {a}
              <FiX
                className="tag-close-icon"
                onClick={() => removeAvailability(a)}
              />
            </span>
          ))}
        </div>
      )}

      {/* Dropdown */}
      <div className="select-wrapper" style={{ position: "relative" }}>
        <div
          className="filter-select"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            minHeight: "44px"
          }}
        >
          <span style={{ color: availability.length ? "#0f172a" : "#64748b" }}>
            {availability.length > 0
              ? `${availability.length} selected`
              : "Employment Type..."}
          </span>

          {isOpen ? <FiChevronDown /> : <FiPlus />}
        </div>

        {/* Options */}
        {isOpen && (
          <div className="custom-dropdown-menu">
            {AVAILABILITY_OPTIONS.map((option) => (
              <div
                key={option}
                className="custom-option"
                onClick={() => toggleOption(option)}
              >
                <div
                  className={`custom-checkbox ${
                    availability.includes(option) ? "checked" : ""
                  }`}
                >
                  {availability.includes(option) && (
                    <FiCheck size={10} color="white" />
                  )}
                </div>
                <span>{option}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>


        {/* Locations */}
     <div className="filter-section">
  <h4 className="section-title">Location</h4>

  <input
    type="text"
    className="filter-input"
    placeholder="Add Location..."
    value={filterInputs.location || ""}
    onChange={(e) =>
      handleInputChange("location", e.target.value)
    }
  />
</div>

      {/* Experience */}
      <div className="filter-section">
  <h4 className="section-title">Years Of Experience</h4>

  <div style={{ display: "flex", gap: "8px" }}>
    <input
      type="number"
      className="filter-input"
      placeholder="Min"
      value={filterInputs.minExperience || ""}
      onChange={(e) =>
        handleInputChange("minExperience", e.target.value)
      }
    />

    <input
      type="number"
      className="filter-input"
      placeholder="Max"
      value={filterInputs.maxExperience || ""}
      onChange={(e) =>
        handleInputChange("maxExperience", e.target.value)
      }
    />
  </div>
</div>


{/* Salary Range */}
<div className="filter-section">
  <h4 className="section-title">Salary Range</h4>

  <div style={{ display: "flex", gap: "8px" }}>
    <input
      type="number"
      className="filter-input"
      placeholder="Min Salary"
      value={filterInputs.minSalary}
      onChange={(e) =>
        handleInputChange("minSalary", e.target.value)
      }
    />

    <input
      type="number"
      className="filter-input"
      placeholder="Max Salary"
      value={filterInputs.maxSalary}
      onChange={(e) =>
        handleInputChange("maxSalary", e.target.value)
      }
    />
  </div>
</div>


      {/* Apply Button */}
      <button onClick={applyFilters} className="apply-btn">
        Apply Filters
      </button>


      {/* INLINE STYLES */}
      <style jsx>{`
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
          .filter-input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 14px;
  background: #fff;
  color: #334155;
  outline: none;
  transition: border 0.2s;
}

.filter-input:focus {
  border-color: #3b82f6;
}

/* Remove spinner arrows in Chrome, Edge, Safari */
.filter-input::-webkit-outer-spin-button,
.filter-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Remove spinner arrows in Firefox */
.filter-input {
  -moz-appearance: textfield;
  appearance: textfield;
}
      `}</style>
    </div>
  );
};


export default JobFilters;
