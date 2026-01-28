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
  "Any Time",
  "Immediate",
  "1-3 Days",
  "3-7 Days",
  "1-2 Weeks",
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
                className={`custom-checkbox ${
                  selectedValues.includes(option) ? "checked" : ""
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
const TalentFilters = ({ onApplyFilters,jobs,selectedJobId }) => {
  const initialFilters = {
    selectedJobs: [],
    skills: [],
    locations: [],
    availability: [],
    experience: "Any Experience",
    minRating: 0,
    maxBudget: 50000,
    isVerified: false,
    locationType: "Any Type",
  };

  const [filterInputs, setFilterInputs] = useState(initialFilters);
  const [isJobDropdownOpen, setIsJobDropdownOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [open, setOpen] = useState(false);

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
      const current = prev.selectedJobs[0];

      return {
        ...prev,
        selectedJobs: current === jobId ? [] : [jobId],
      };
    });
  };

  const removeArrayItem = (field, value) => {
    setFilterInputs((prev) => ({
      ...prev,
      [field]: prev[field].filter((item) => item !== value),
    }));
  };

  const removeJobTag = (jobId) => {
    setFilterInputs((prev) => ({
      ...prev,
      selectedJobs: prev.selectedJobs.filter((id) => id !== jobId),
    }));
    if (onApplyFilters) {
    onApplyFilters(null);
  }
  };

const applyFilters = () => {
  const jobId = filterInputs.selectedJobs[0] || null;
  onApplyFilters(jobId);
};

  const resetFilters = () => {
    setFilterInputs(initialFilters);
    if (onApplyFilters) onApplyFilters(initialFilters);
  };

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
        <h4 className="section-title">Find for Jobs</h4>
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
        <div className="select-wrapper" style={{ position: "relative" }}>
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
                    className={`custom-checkbox ${
                      filterInputs.selectedJobs.includes(job.id)
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

      {/* Verified */}
      <div className="filter-section">
        <label
          className="checkbox-row"
          style={{ marginTop: "5px" }}
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
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <GiCheckMark size={14} color="#059669" /> Verified Profiles Only
          </span>
        </label>
      </div>

      {/* Job Type */}
      <div className="filter-section">
        <h4 className="section-title">Job Type</h4>
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

      {/* Skills */}
      <div className="filter-section">
        <h4 className="section-title">Skills & Tech</h4>
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
          options={SKILL_TAGS}
          selectedValues={filterInputs.skills}
          onChange={(v) => handleInputChange("skills", v)}
        />
      </div>

      {/* Availability */}
      <div className="filter-section">
        <h4 className="section-title">Availability</h4>
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
          label="Add Availability..."
          options={AVAILABILITY_OPTIONS}
          selectedValues={filterInputs.availability}
          onChange={(v) => handleInputChange("availability", v)}
        />
      </div>

      {/* Locations */}
      <div className="filter-section">
        <h4 className="section-title">Locations</h4>
        {filterInputs.locations.length > 0 && (
          <div className="tags-container">
            {filterInputs.locations.map((l) => (
              <span key={l} className="filter-tag">
                {l}
                <FiX
                  className="tag-close-icon"
                  onClick={() => removeArrayItem("locations", l)}
                />
              </span>
            ))}
          </div>
        )}
        <MultiSelectDropdown
          label="Add Locations..."
          options={POPULAR_LOCATIONS}
          selectedValues={filterInputs.locations}
          onChange={(v) => handleInputChange("locations", v)}
        />
      </div>

      {/* Experience */}
      <div className="filter-section">
        <h4 className="section-title">Experience Level</h4>
        <div className="select-wrapper">
          <select
            className="filter-select"
            value={filterInputs.experience}
            onChange={(e) =>
              handleInputChange("experience", e.target.value)
            }
          >
            {EXPERIENCE_LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <FiChevronDown className="select-icon" />
        </div>
      </div>

      {/* Rating */}
      <div className="filter-section">
        <h4 className="section-title">Minimum Rating</h4>
        <div className="rating-container">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleInputChange("minRating", star)}
              type="button"
              className={`rating-btn ${
                filterInputs.minRating >= star ? "active" : ""
              }`}
            >
              <FiStar
                size={16}
                fill={
                  filterInputs.minRating >= star ? "#f59f0a" : "none"
                }
                color={
                  filterInputs.minRating >= star
                    ? "#f59f0a"
                    : "#94a3b8"
                }
              />
            </button>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div className="budget-section">
        <h4 className="section-title">Max Hourly Rate</h4>
        <input
          type="range"
          className="budget-slider"
          min="0"
          max="200"
          step="5"
          value={filterInputs.maxBudget}
          onChange={(e) =>
            handleInputChange("maxBudget", Number(e.target.value))
          }
        />
        <div className="budget-labels">
          <span>$0</span>
          <span>${filterInputs.maxBudget}/hr</span>
        </div>
      </div>

      <button onClick={applyFilters} className="apply-btn">
        Apply Filters
      </button>

      {/* Styles reused from original snippet */}
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
      `}</style>
    </div>
  );
};

export default TalentFilters;
