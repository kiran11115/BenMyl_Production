// TalentFilters.jsx
import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiStar, FiCheck, FiX, FiPlus } from "react-icons/fi";
import { GiCheckMark } from "react-icons/gi";



const SKILL_TAGS = [
  "React",
  "Node.js",
  "AWS",
  "Python",
  "UI/UX Design",
  "TypeScript",
  "Docker",
];
const POPULAR_LOCATIONS = [
  "San Francisco, CA",
  "New York, NY",
  "Austin, TX",
  "London, UK",
  "Bengaluru, India",
  "Remote",
];
const EXPERIENCE_LEVELS = [
  "Any Experience",
  "Junior (0-3 years)",
  "Mid-Level (3-7 years)",
  "Senior (8+ years)",
];
const AVAILABILITY_OPTIONS = [
  "Part-Time",
  "Full-Time",
  "Contract",
];
const LOCATION_TYPES = ["Any Type", "Remote", "On-Site", "Hybrid"];

// --- HELPER: MultiSelect ---
const MultiSelectDropdown = ({ label, options, selectedValues, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (option) => {
    const newValues = selectedValues.includes(option)
      ? selectedValues.filter((item) => item !== option)
      : [...selectedValues, option];
    onChange(newValues);
  };

  return (
    <div className="select-wrapper" ref={dropdownRef} style={{ position: "relative" }}>
      <div
        className="filter-select"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ color: selectedValues.length ? "#0f172a" : "#64748b" }}>
          {isOpen
            ? "Close List"
            : selectedValues.length > 0
              ? "Add / Remove..."
              : label}
        </span>
        {isOpen ? <FiChevronDown style={{ transform: "rotate(180deg)" }} /> : <FiPlus />}
      </div>
      {isOpen && (
        <div className="custom-dropdown-menu">
          {options.map((option) => (
            <div
              key={option}
              className="custom-option"
              onClick={() => toggleOption(option)}
            >
              <div
                className={`custom-checkbox ${selectedValues.includes(option) ? "checked" : ""
                  }`}
              >
                {selectedValues.includes(option) && (
                  <FiCheck size={10} color="white" />
                )}
              </div>
              <span>{option}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- MAIN FILTERS COMPONENT ---
const TalentFilters = ({ onApplyFilters, jobs, selectedJobId, skillsList = [], appliedFilters }) => {
  const initialFilters = {
    selectedJobs: [],
    skills: [],
    location: "",
    availability: [],
    minExperience: "",
    maxExperience: "",
    minSalary: "",
    maxSalary: "",
    minRating: 0,
    maxBudget: 50000,
    isVerified: false,
    locationType: "Any Type",
  };

  const [filterInputs, setFilterInputs] = useState(initialFilters);
  const [isJobDropdownOpen, setIsJobDropdownOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('jobs'); // DEFAULT OPEN
  const jobDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (jobDropdownRef.current && !jobDropdownRef.current.contains(event.target)) {
        setIsJobDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSection = (section) => {
    setActiveSection(prev => (prev === section ? null : section));
  };

  const selectJob = (job) => {
    setSelectedJob(job);
    setOpen(false);
    onApplyFilters(job); // 🔥 send job to parent
  };

  useEffect(() => {
    if (!selectedJobId) return;

    setFilterInputs((prev) => ({
      ...prev,
      selectedJobs: [selectedJobId],
    }));
  }, [selectedJobId]);


  const handleInputChange = (field, value) =>
    setFilterInputs((prev) => ({ ...prev, [field]: value }));
  const handleToggle = (field) =>
    setFilterInputs((prev) => ({ ...prev, [field]: !prev[field] }));

  const toggleJobSelection = (jobId) => {
    setFilterInputs((prev) => {
      const isSelected = prev.selectedJobs.includes(jobId);
      const newSelectedJobs = isSelected
        ? prev.selectedJobs.filter((id) => id !== jobId)
        : [...prev.selectedJobs, jobId];

      return {
        ...prev,
        selectedJobs: newSelectedJobs,
      };
    });
  };

  const removeArrayItem = (field, value) => {
    setFilterInputs((prev) => {
      const updatedFilters = {
        ...prev,
        [field]: prev[field].filter((item) => item !== value),
      };
      if (onApplyFilters) {
        onApplyFilters(updatedFilters);
      }
      return updatedFilters;
    });
  };

  const removeJobTag = (jobId) => {
    setFilterInputs((prev) => {
      const updatedFilters = {
        ...prev,
        selectedJobs: prev.selectedJobs.filter((id) => id !== jobId),
      };
      if (onApplyFilters) {
        onApplyFilters(updatedFilters);
      }
      return updatedFilters;
    });
  };

  const applyFilters = () => {
    onApplyFilters(filterInputs);
  };

  const resetFilters = () => {
    setFilterInputs(initialFilters);
    if (onApplyFilters) onApplyFilters(initialFilters);
  };

  useEffect(() => {
    if (!appliedFilters) return;

    setFilterInputs((prev) => ({
      ...prev,
      ...appliedFilters,
    }));
  }, [appliedFilters]);

  const SectionHeader = ({ id, title, isExpanded, summary }) => (
    <div
      className={`filter-section-header ${isExpanded ? 'active' : ''}`}
      onClick={() => toggleSection(id)}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
        padding: '10px 0',
        borderBottom: '1px solid #f1f5f9',
        marginBottom: isExpanded ? '12px' : '0'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <h4 className="section-title" style={{ margin: 0 }}>{title}</h4>
        {!isExpanded && summary && (
          <span className="header-summary" style={{ fontSize: '12px', color: '#f5810c', fontWeight: '600' }}>
            {summary}
          </span>
        )}
      </div>
      {isExpanded ? (
        <FiChevronDown style={{ color: '#0f172a', fontSize: '16px' }} />
      ) : (
        <FiPlus style={{ color: '#94a3b8', fontSize: '16px' }} />
      )}
    </div>
  );

  return (
    <div className="filter-sidebar">
      <div className="filter-header mb-4">
        <h3 className="filter-title">Filters</h3>
        <span onClick={resetFilters} className="filter-reset">
          Reset
        </span>
      </div>

      {/* Jobs */}
      <div className="filter-section">
        <SectionHeader
          id="jobs"
          title="Find for Jobs"
          isExpanded={activeSection === 'jobs'}
          summary={filterInputs.selectedJobs.map(id => jobs.find(j => j.id === id)?.title).filter(Boolean).join(', ')}
        />
        {activeSection === 'jobs' && (
          <div className="section-content">
            {filterInputs.selectedJobs.length > 0 && (
              <div className="tags-container">
                {filterInputs.selectedJobs.map((jobId) => {
                  const job = jobs.find((j) => j.id === jobId);
                  return (
                    <span key={jobId} className="filter-tag">
                      {job?.title}
                      <FiX
                        className="tag-close-icon"
                        onClick={() => removeJobTag(jobId)}
                      />
                    </span>
                  );
                })}
              </div>
            )}
            <div className="select-wrapper" ref={jobDropdownRef} style={{ position: "relative" }}>
              <div
                className="filter-select"
                onClick={() => setIsJobDropdownOpen(!isJobDropdownOpen)}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ color: "#64748b" }}>
                  {isJobDropdownOpen ? "Close List" : "Add Job..."}
                </span>
                {isJobDropdownOpen ? (
                  <FiChevronDown style={{ transform: "rotate(180deg)" }} />
                ) : (
                  <FiPlus />
                )}
              </div>
              {isJobDropdownOpen && (
                <div className="custom-dropdown-menu">
                  {jobs.map((job) => (
                    <div
                      key={job.id}
                      className="custom-option"
                      onClick={() => toggleJobSelection(job.id)}
                    >
                      <div
                        className={`custom-checkbox ${filterInputs.selectedJobs.includes(job.id)
                          ? "checked"
                          : ""
                          }`}
                        style={
                          filterInputs.selectedJobs.includes(job.id)
                            ? {
                              borderColor: job.color,
                              backgroundColor: job.color,
                            }
                            : {}
                        }
                      >
                        {filterInputs.selectedJobs.includes(job.id) && (
                          <FiCheck size={10} color="white" />
                        )}
                      </div>
                      <span className="truncate-text">{job.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>


      {/* Verified */}
      <div className="filter-section" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
        <label
          className="checkbox-row"
          style={{ marginTop: "5px", cursor: 'pointer' }}
        >
          <div className="checkbox-container">
            <input
              type="checkbox"
              checked={filterInputs.isVerified}
              onChange={() => handleToggle("isVerified")}
            />
            <span className="checkmark custom-checkbox">
              {filterInputs.isVerified && <FiCheck size={12} color="white" />}
            </span>
          </div>
          <span
            className="checkbox-label"
            style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: '14px' }}
          >
            <GiCheckMark size={14} color="#059669" /> Verified Profiles Only
          </span>
        </label>
      </div>

      {/* Job Type */}
      <div className="filter-section">
        <SectionHeader
          id="jobType"
          title="Job Type"
          isExpanded={activeSection === 'jobType'}
          summary={filterInputs.locationType !== 'Any Type' ? filterInputs.locationType : ''}
        />
        {activeSection === 'jobType' && (
          <div className="section-content">
            <div className="select-wrapper">
              <select
                className="filter-select"
                value={filterInputs.locationType}
                onChange={(e) =>
                  handleInputChange("locationType", e.target.value)
                }
              >
                {LOCATION_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <FiChevronDown className="select-icon" />
            </div>
          </div>
        )}
      </div>

      {/* Skills */}
      <div className="filter-section">
        <SectionHeader
          id="skills"
          title="Skills & Tech"
          isExpanded={activeSection === 'skills'}
          summary={filterInputs.skills.join(', ')}
        />
        {activeSection === 'skills' && (
          <div className="section-content">
            {filterInputs.skills.length > 0 && (
              <div className="tags-container">
                {filterInputs.skills.map((s) => (
                  <span key={s} className="filter-tag">
                    {s}
                    <FiX
                      className="tag-close-icon"
                      onClick={() => removeArrayItem("skills", s)}
                    />
                  </span>
                ))}
              </div>
            )}
            <MultiSelectDropdown
              label="Add Skills..."
              options={skillsList}
              selectedValues={filterInputs.skills}
              onChange={(v) => handleInputChange("skills", v)}
            />
          </div>
        )}
      </div>

      {/* Availability */}
      <div className="filter-section">
        <SectionHeader
          id="availability"
          title="Employment Type"
          isExpanded={activeSection === 'availability'}
          summary={filterInputs.availability.join(', ')}
        />
        {activeSection === 'availability' && (
          <div className="section-content">
            {filterInputs.availability.length > 0 && (
              <div className="tags-container">
                {filterInputs.availability.map((a) => (
                  <span key={a} className="filter-tag">
                    {a}
                    <FiX
                      className="tag-close-icon"
                      onClick={() => removeArrayItem("availability", a)}
                    />
                  </span>
                ))}
              </div>
            )}
            <MultiSelectDropdown
              label="Employement Type..."
              options={AVAILABILITY_OPTIONS}
              selectedValues={filterInputs.availability}
              onChange={(v) => handleInputChange("availability", v)}
            />
          </div>
        )}
      </div>

      {/* Locations */}
      <div className="filter-section">
        <SectionHeader
          id="location"
          title="Location"
          isExpanded={activeSection === 'location'}
          summary={filterInputs.location}
        />
        {activeSection === 'location' && (
          <div className="section-content">
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
        )}
      </div>


      {/* Experience */}
      <div className="filter-section">
        <SectionHeader
          id="experience"
          title="Years Of Experience"
          isExpanded={activeSection === 'experience'}
          summary={filterInputs.minExperience || filterInputs.maxExperience ? `${filterInputs.minExperience || 0}-${filterInputs.maxExperience || '+'} years` : ''}
        />
        {activeSection === 'experience' && (
          <div className="section-content">
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
        )}
      </div>


      {/* Salary Range */}
      <div className="filter-section">
        <SectionHeader
          id="salary"
          title="Salary Range"
          isExpanded={activeSection === 'salary'}
          summary={filterInputs.minSalary || filterInputs.maxSalary ? `$${filterInputs.minSalary || 0} - $${filterInputs.maxSalary || '+'}` : ''}
        />
        {activeSection === 'salary' && (
          <div className="section-content">
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
        )}
      </div>

      <button onClick={applyFilters} className="apply-btn mt-3">
        Apply Filters
      </button>

      {/* Styles reused from original snippet */}
      <style jsx>{`
        .filter-section {
          margin-bottom: 8px;
          background: #fff;
          border-radius: 8px;
        }
        .filter-section-header:hover h4 {
          color: #f5810c;
        }
        .section-content {
          padding-bottom: 12px;
          animation: slideDown 0.2s ease-out;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 8px;
        }
        .filter-tag {
          background: #eff6ff;
          color: #1e293b;
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
        .filter-input::-webkit-outer-spin-button,
        .filter-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .filter-input {
          -moz-appearance: textfield;
          appearance: textfield;
        }
      `}</style>
    </div>
  );
};


export default TalentFilters;
