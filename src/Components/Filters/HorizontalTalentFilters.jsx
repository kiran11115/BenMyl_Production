import React, { useState, useRef, useEffect, useMemo } from "react";
import { FiChevronDown, FiCheck, FiX, FiSearch } from "react-icons/fi";
import { GiCheckMark } from "react-icons/gi";
import "./HorizontalTalentFilters.css";

const MultiSelectDropdown = ({ label, options, selectedValues, onChange, isOpen, toggleOpen }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (isOpen) toggleOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, toggleOpen]);

  const toggleOption = (option) => {
    const newValues = selectedValues.includes(option)
      ? selectedValues.filter((item) => item !== option)
      : [...selectedValues, option];
    onChange(newValues);
  };

  return (
    <div className="horizontal-filter-wrapper" ref={dropdownRef}>
      <button 
        className={`horizontal-filter-btn ${selectedValues.length > 0 ? "active" : ""}`}
        onClick={() => toggleOpen(!isOpen)}
      >
        {selectedValues.length > 0 ? `${label} (${selectedValues.length})` : label}
        <FiChevronDown />
      </button>
      {isOpen && (
        <div className="horizontal-dropdown-menu">
          {options.map((option) => (
            <div
              key={option}
              className="horizontal-custom-option"
              onClick={() => toggleOption(option)}
            >
              <div
                className={`horizontal-custom-checkbox ${selectedValues.includes(option) ? "checked" : ""}`}
              >
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

const HorizontalTalentFilters = ({ onApplyFilters, jobs = [], selectedJobId, skillsList = [], appliedFilters, children }) => {
  const initialFilters = {
    selectedJobs: [],
    skills: [],
    location: [],
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

  const [filterInputs, setFilterInputs] = useState(appliedFilters || initialFilters);
  const [openDropdown, setOpenDropdown] = useState(null); // 'jobs', 'skills', 'location', 'experience', 'salary'
  const [locationInputValue, setLocationInputValue] = useState("");
  const [jobSearchTerm, setJobSearchTerm] = useState("");
  const debounceTimerRef = useRef(null);
  const jobsDropdownRef = useRef(null);
  const locDropdownRef = useRef(null);
  const expDropdownRef = useRef(null);
  const salDropdownRef = useRef(null);

  const filteredJobs = useMemo(() => {
    if (!jobs || !Array.isArray(jobs)) return [];
    if (!jobSearchTerm.trim()) return jobs;
    const term = jobSearchTerm.toLowerCase().trim();
    return jobs.filter((j) => {
      const titleMatch = j.title ? j.title.toLowerCase().includes(term) : false;
      const roleMatch = j.role ? j.role.toLowerCase().includes(term) : false;
      const jobRoleMatch = j.jobRole ? j.jobRole.toLowerCase().includes(term) : false;
      const categoryMatch = j.category ? j.category.toLowerCase().includes(term) : false;
      return titleMatch || roleMatch || jobRoleMatch || categoryMatch;
    });
  }, [jobs, jobSearchTerm]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (jobsDropdownRef.current && !jobsDropdownRef.current.contains(event.target)) {
        if (openDropdown === 'jobs') setOpenDropdown(null);
      }
      if (locDropdownRef.current && !locDropdownRef.current.contains(event.target)) {
        if (openDropdown === 'location') setOpenDropdown(null);
      }
      if (expDropdownRef.current && !expDropdownRef.current.contains(event.target)) {
        if (openDropdown === 'experience') setOpenDropdown(null);
      }
      if (salDropdownRef.current && !salDropdownRef.current.contains(event.target)) {
        if (openDropdown === 'salary') setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

  useEffect(() => {
    if (!selectedJobId) return;
    setFilterInputs((prev) => ({
      ...prev,
      selectedJobs: [selectedJobId],
    }));
  }, [selectedJobId]);

  const handleInputChange = (field, value, isDebounced = false) => {
    setFilterInputs((prev) => {
      const updated = { ...prev, [field]: value };
      if (onApplyFilters) {
        if (isDebounced) {
          if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
          debounceTimerRef.current = setTimeout(() => onApplyFilters(updated), 400);
        } else {
          if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
          onApplyFilters(updated);
        }
      }
      return updated;
    });
  };

  const handleToggle = (field) => {
    setFilterInputs((prev) => {
      const updated = { ...prev, [field]: !prev[field] };
      if (onApplyFilters) {
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        onApplyFilters(updated);
      }
      return updated;
    });
  };

  const toggleJobSelection = (jobId) => {
    setFilterInputs((prev) => {
      const isSelected = prev.selectedJobs.includes(jobId);
      const newSelectedJobs = isSelected
        ? prev.selectedJobs.filter((id) => id !== jobId)
        : [...prev.selectedJobs, jobId];
      const updated = { ...prev, selectedJobs: newSelectedJobs };
      
      if (onApplyFilters) {
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = setTimeout(() => onApplyFilters(updated), 500);
      }
      return updated;
    });
  };

  const resetFilters = () => {
    setFilterInputs(initialFilters);
    setJobSearchTerm("");
    if (onApplyFilters) {
      onApplyFilters(initialFilters);
    }
  };

  const toggleDropdown = (name) => {
    setOpenDropdown(prev => prev === name ? null : name);
  };

  const hasActiveFilters = 
    filterInputs.selectedJobs.length > 0 ||
    filterInputs.skills.length > 0 ||
    filterInputs.location.length > 0 ||
    filterInputs.minExperience !== "" ||
    filterInputs.maxExperience !== "";

  const selectedJobTitles = useMemo(() => {
    return filterInputs.selectedJobs
      .map((id) => jobs.find((j) => j.id === id)?.title)
      .filter(Boolean);
  }, [filterInputs.selectedJobs, jobs]);

  return (
    <div className="horizontal-filters-container">
      {/* Jobs Dropdown */}
      <div className="horizontal-filter-wrapper" ref={jobsDropdownRef}>
        <button 
          className={`horizontal-filter-btn find-jobs-btn ${filterInputs.selectedJobs.length > 0 ? "active" : ""}`}
          onClick={() => toggleDropdown('jobs')}
        >
          {filterInputs.selectedJobs.length > 0 
            ? (selectedJobTitles.length === 1 ? selectedJobTitles[0] : `${selectedJobTitles[0]} (+${selectedJobTitles.length - 1})`) 
            : 'Find for Jobs'}
          <FiChevronDown />
        </button>
        {openDropdown === 'jobs' && (
          <div className="horizontal-dropdown-menu" style={{ width: '250px' }}>
            <div className="horizontal-dropdown-search">
              <FiSearch size={14} color="#94a3b8" />
              <input
                type="text"
                placeholder="Search jobs & roles..."
                value={jobSearchTerm}
                onChange={(e) => setJobSearchTerm(e.target.value)}
              />
              {jobSearchTerm && (
                <FiX size={13} color="#94a3b8" style={{ cursor: "pointer" }} onClick={() => setJobSearchTerm("")} />
              )}
            </div>
            <div className="horizontal-dropdown-list">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <div key={job.id} className="horizontal-custom-option" onClick={() => toggleJobSelection(job.id)}>
                    <div className={`horizontal-custom-checkbox ${filterInputs.selectedJobs.includes(job.id) ? "checked" : ""}`}>
                      {filterInputs.selectedJobs.includes(job.id) && <FiCheck size={10} color="white" />}
                    </div>
                    <span className="truncate-text">{job.title}</span>
                  </div>
                ))
              ) : (
                <div className="horizontal-dropdown-empty">No related jobs found</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Skills Dropdown */}
      <MultiSelectDropdown
        label="Skills"
        options={skillsList}
        selectedValues={filterInputs.skills}
        onChange={(v) => handleInputChange("skills", v)}
        isOpen={openDropdown === 'skills'}
        toggleOpen={(open) => toggleDropdown(open ? 'skills' : null)}
      />

      {/* Location Dropdown */}
      <div className="horizontal-filter-wrapper" ref={locDropdownRef}>
        <button 
          className={`horizontal-filter-btn ${filterInputs.location.length > 0 ? "active" : ""}`}
          onClick={() => toggleDropdown('location')}
        >
          {filterInputs.location.length > 0
            ? filterInputs.location.length === 1
              ? `Location: ${filterInputs.location[0]}`
              : `Location (${filterInputs.location.length})`
            : 'Location'}
          <FiChevronDown />
        </button>
        {openDropdown === 'location' && (
          <div className="horizontal-dropdown-menu" style={{ padding: '10px', minWidth: '220px' }}>
            {filterInputs.location.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
                {filterInputs.location.map((loc) => (
                  <span
                    key={loc}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                      background: '#f1f5f9', borderRadius: '12px',
                      padding: '2px 8px', fontSize: '11px', color: '#334155',
                      fontWeight: '500'
                    }}
                  >
                    {loc}
                    <FiX
                      size={10}
                      style={{ cursor: 'pointer', color: '#64748b' }}
                      onClick={() => {
                        const updated = filterInputs.location.filter((l) => l !== loc);
                        handleInputChange("location", updated);
                      }}
                    />
                  </span>
                ))}
              </div>
            )}
            <input
              type="text"
              className="horizontal-input"
              placeholder="Type & press Enter to add..."
              value={locationInputValue}
              onChange={(e) => setLocationInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault();
                  const val = locationInputValue.trim().replace(/,$/, '');
                  if (val && !filterInputs.location.includes(val)) {
                    handleInputChange("location", [...filterInputs.location, val]);
                  }
                  setLocationInputValue("");
                } else if (e.key === 'Backspace' && !locationInputValue && filterInputs.location.length > 0) {
                  const updated = filterInputs.location.slice(0, -1);
                  handleInputChange("location", updated);
                }
              }}
            />
          </div>
        )}
      </div>

      {/* Experience Dropdown */}
      <div className="horizontal-filter-wrapper" ref={expDropdownRef}>
        <button 
          className={`horizontal-filter-btn ${filterInputs.minExperience || filterInputs.maxExperience ? "active" : ""}`}
          onClick={() => toggleDropdown('experience')}
        >
          {(filterInputs.minExperience || filterInputs.maxExperience) ? 'Experience Set' : 'Experience'}
          <FiChevronDown />
        </button>
        {openDropdown === 'experience' && (
          <div className="horizontal-dropdown-menu" style={{ padding: '10px', width: '200px' }}>
            <div className="horizontal-flex-row">
              <input
                type="number"
                min="0"
                placeholder="Min Yrs"
                className="horizontal-input"
                value={filterInputs.minExperience}
                onChange={(e) => handleInputChange("minExperience", e.target.value, true)}
              />
              <span className="horizontal-separator">-</span>
              <input
                type="number"
                min="0"
                placeholder="Max Yrs"
                className="horizontal-input"
                value={filterInputs.maxExperience}
                onChange={(e) => handleInputChange("maxExperience", e.target.value, true)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Salary Dropdown */}
      <div className="horizontal-filter-wrapper" ref={salDropdownRef}>
        <button 
          className={`horizontal-filter-btn ${filterInputs.minSalary || filterInputs.maxSalary ? "active" : ""}`}
          onClick={() => toggleDropdown('salary')}
        >
          {(filterInputs.minSalary || filterInputs.maxSalary) ? 'Salary Set' : 'Salary'}
          <FiChevronDown />
        </button>
        {openDropdown === 'salary' && (
          <div className="horizontal-dropdown-menu" style={{ padding: '10px', width: '220px' }}>
            <div className="horizontal-flex-row">
              <input
                type="number"
                min="0"
                placeholder="Min (e.g. 50000)"
                className="horizontal-input"
                value={filterInputs.minSalary}
                onChange={(e) => handleInputChange("minSalary", e.target.value, true)}
              />
              <span className="horizontal-separator">-</span>
              <input
                type="number"
                min="0"
                placeholder="Max (e.g. 150000)"
                className="horizontal-input"
                value={filterInputs.maxSalary}
                onChange={(e) => handleInputChange("maxSalary", e.target.value, true)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Verified Toggle */}
      {/* <button
        className={`horizontal-filter-btn ${filterInputs.isVerified ? "active" : ""}`}
        onClick={() => handleToggle("isVerified")}
        style={{ display: 'flex', gap: '6px', alignItems: 'center' }}
      >
        <GiCheckMark size={12} color={filterInputs.isVerified ? "#fff" : "#059669"} /> 
        Verified Only
      </button> */}

      {/* Additional Actions / Children and Reset */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '8px' }}>
        {children}
        {hasActiveFilters && (
          <button className="horizontal-filter-reset" onClick={resetFilters}>
            Reset
          </button>
        )}
      </div>
    </div>
  );
};

export default HorizontalTalentFilters;
