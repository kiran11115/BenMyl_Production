import React, { useState, useRef, useEffect, useMemo } from 'react';
import { FiChevronDown, FiCheck, FiX, FiSearch } from 'react-icons/fi';
import './HorizontalTalentFilters.css'; 
import { useGetAllRoleNamesQuery } from '../../State-Management/Api/TalentPoolApiSlice';
import { useGetSkillsByTitleQuery } from '../../State-Management/Api/ProjectApiSlice';

const LOCATION_TYPES = ['Any Type', 'Remote', 'On-Site', 'Hybrid'];
const AVAILABILITY_OPTIONS = ['Part-Time', 'Full-Time', 'Contract'];
const EXPERIENCE_LEVELS = [
  { label: 'Any Experience', min: '', max: '' },
  { label: 'Junior (0-3 years)', min: '0', max: '3' },
  { label: 'Mid-Level (3-7 years)', min: '3', max: '7' },
  { label: 'Senior (8+ years)', min: '8', max: '99' }
];
const POPULAR_LOCATIONS = ['San Francisco, CA', 'New York, NY', 'Austin, TX', 'London, UK', 'Bengaluru, India', 'Remote'];

const MultiSelectDropdown = ({ label, options, selectedValues, onChange, isOpen, toggleOpen }) => {
  const dropdownRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (isOpen) toggleOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, toggleOpen]);

  const filteredOptions = useMemo(() => {
    if (!options) return [];
    if (!searchTerm.trim()) return options;
    return options.filter(opt => opt.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [options, searchTerm]);

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
          <div className="horizontal-dropdown-search" style={{ padding: '8px', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', padding: '6px 10px', borderRadius: '6px' }}>
              <FiSearch size={14} color="#64748b" style={{ marginRight: '6px' }} />
              <input
                type="text"
                placeholder={`Search ${label}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', width: '100%' }}
              />
            </div>
          </div>
          <div className="horizontal-dropdown-list" style={{ maxHeight: '220px', overflowY: 'auto' }}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option}
                  className="horizontal-custom-option"
                  onClick={() => toggleOption(option)}
                >
                  <div className={`horizontal-custom-checkbox ${selectedValues.includes(option) ? "checked" : ""}`}>
                    {selectedValues.includes(option) && <FiCheck size={10} color="white" />}
                  </div>
                  <span>{option}</span>
                </div>
              ))
            ) : (
              <div className="horizontal-dropdown-empty">No options found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const JobFilters = ({ onApplyFilters, initialFilters }) => {
  const userId = localStorage.getItem("logincompanyid");
  const [filterInputs, setFilterInputs] = useState(initialFilters || {
    keyword: "",
    locationType: "Any Type",
    roles: [],
    skills: [],
    availability: [],
    location: "",
    minExperience: "",
    maxExperience: "",
    minSalary: "",
    maxSalary: "",
  });

  const [openDropdown, setOpenDropdown] = useState(null);
  const debounceTimerRef = useRef(null);
  
  const locDropdownRef = useRef(null);
  const expDropdownRef = useRef(null);
  const salDropdownRef = useRef(null);
  const locTypeDropdownRef = useRef(null);

  const selectedRole = filterInputs.roles?.[0];
  const { data: roleOptions = [] } = useGetAllRoleNamesQuery(userId);
  const { data: skillsResponse } = useGetSkillsByTitleQuery(selectedRole, { skip: !selectedRole });
  const skillsOptions = skillsResponse?.data || [];

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locDropdownRef.current && !locDropdownRef.current.contains(event.target)) {
        if (openDropdown === 'location') setOpenDropdown(null);
      }
      if (expDropdownRef.current && !expDropdownRef.current.contains(event.target)) {
        if (openDropdown === 'experience') setOpenDropdown(null);
      }
      if (salDropdownRef.current && !salDropdownRef.current.contains(event.target)) {
        if (openDropdown === 'salary') setOpenDropdown(null);
      }
      if (locTypeDropdownRef.current && !locTypeDropdownRef.current.contains(event.target)) {
        if (openDropdown === 'locationType') setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

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

  const handleArrayChange = (field, newValues) => {
    setFilterInputs((prev) => {
      const updated = { ...prev, [field]: newValues };
      if (field === 'roles') {
         updated.skills = []; // reset skills on role change
      }
      if (onApplyFilters) {
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        onApplyFilters(updated);
      }
      return updated;
    });
  };

  const toggleDropdown = (name) => {
    setOpenDropdown(prev => prev === name ? null : name);
  };

  const resetFilters = () => {
    const defaultFilters = {
      keyword: "",
      locationType: "Any Type",
      roles: [],
      skills: [],
      availability: [],
      location: "",
      minExperience: "",
      maxExperience: "",
      minSalary: "",
      maxSalary: "",
    };
    setFilterInputs(defaultFilters);
    if (onApplyFilters) onApplyFilters(defaultFilters);
  };

  const hasActiveFilters = 
    filterInputs.roles?.length > 0 ||
    filterInputs.skills?.length > 0 ||
    filterInputs.availability?.length > 0 ||
    filterInputs.location !== "" ||
    filterInputs.locationType !== "Any Type" ||
    filterInputs.minExperience !== "" ||
    filterInputs.maxExperience !== "" ||
    filterInputs.minSalary !== "" ||
    filterInputs.maxSalary !== "";

  return (
    <div className="horizontal-filters-container">
      
      {/* Roles Dropdown */}
      <MultiSelectDropdown
        label="Find by Roles"
        options={roleOptions}
        selectedValues={filterInputs.roles || []}
        onChange={(val) => handleArrayChange('roles', val)}
        isOpen={openDropdown === 'roles'}
        toggleOpen={(open) => toggleDropdown(open ? 'roles' : null)}
      />

      {/* Skills Dropdown */}
      <MultiSelectDropdown
        label="Skills"
        options={skillsOptions}
        selectedValues={filterInputs.skills || []}
        onChange={(val) => handleArrayChange('skills', val)}
        isOpen={openDropdown === 'skills'}
        toggleOpen={(open) => toggleDropdown(open ? 'skills' : null)}
      />

      {/* Location Type */}
      <div className="horizontal-filter-wrapper" ref={locTypeDropdownRef}>
        <button 
          className={`horizontal-filter-btn ${filterInputs.locationType !== "Any Type" ? "active" : ""}`}
          onClick={() => toggleDropdown('locationType')}
        >
          {filterInputs.locationType !== "Any Type" ? filterInputs.locationType : 'Location Type'}
          <FiChevronDown />
        </button>
        {openDropdown === 'locationType' && (
          <div className="horizontal-dropdown-menu" style={{ minWidth: '150px' }}>
            {LOCATION_TYPES.map(type => (
              <div
                key={type}
                className="horizontal-custom-option"
                onClick={() => {
                  handleInputChange('locationType', type);
                  toggleDropdown(null);
                }}
              >
                <span>{type}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Location Input/Dropdown */}
      <div className="horizontal-filter-wrapper" ref={locDropdownRef}>
        <button 
          className={`horizontal-filter-btn ${filterInputs.location ? "active" : ""}`}
          onClick={() => toggleDropdown('location')}
        >
          {filterInputs.location ? `Loc: ${filterInputs.location}` : 'Location'}
          <FiChevronDown />
        </button>
        {openDropdown === 'location' && (
          <div className="horizontal-dropdown-menu" style={{ padding: '12px', minWidth: '240px' }}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', display: 'block' }}>City, State or Country</label>
              <input
                type="text"
                placeholder="e.g. New York, NY"
                value={filterInputs.location}
                onChange={(e) => handleInputChange('location', e.target.value, true)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '13px'
                }}
              />
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Popular Locations</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {POPULAR_LOCATIONS.map(loc => (
                <span
                  key={loc}
                  onClick={() => handleInputChange('location', loc)}
                  style={{
                    padding: '4px 8px',
                    background: filterInputs.location === loc ? '#3b82f6' : '#f1f5f9',
                    color: filterInputs.location === loc ? '#ffffff' : '#475569',
                    borderRadius: '4px',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  {loc}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Experience Dropdown */}
      <div className="horizontal-filter-wrapper" ref={expDropdownRef}>
        <button 
          className={`horizontal-filter-btn ${filterInputs.minExperience || filterInputs.maxExperience ? "active" : ""}`}
          onClick={() => toggleDropdown('experience')}
        >
          {filterInputs.minExperience || filterInputs.maxExperience ? `Exp: ${filterInputs.minExperience || 0}-${filterInputs.maxExperience || 'Max'} Yrs` : 'Experience'}
          <FiChevronDown />
        </button>
        {openDropdown === 'experience' && (
          <div className="horizontal-dropdown-menu" style={{ padding: '12px', minWidth: '220px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <input
                type="number"
                placeholder="Min Yrs"
                value={filterInputs.minExperience}
                onChange={(e) => handleInputChange('minExperience', e.target.value, true)}
                style={{ width: '50%', padding: '6px', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '13px' }}
              />
              <input
                type="number"
                placeholder="Max Yrs"
                value={filterInputs.maxExperience}
                onChange={(e) => handleInputChange('maxExperience', e.target.value, true)}
                style={{ width: '50%', padding: '6px', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '13px' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {EXPERIENCE_LEVELS.map((lvl) => (
                <div
                  key={lvl.label}
                  className="horizontal-custom-option"
                  style={{ padding: '6px 8px', borderRadius: '4px' }}
                  onClick={() => {
                    handleInputChange('minExperience', lvl.min);
                    handleInputChange('maxExperience', lvl.max);
                  }}
                >
                  {lvl.label}
                </div>
              ))}
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
          {filterInputs.minSalary || filterInputs.maxSalary ? `Salary: $${filterInputs.minSalary || 0}-$${filterInputs.maxSalary || 'Max'}` : 'Salary'}
          <FiChevronDown />
        </button>
        {openDropdown === 'salary' && (
          <div className="horizontal-dropdown-menu" style={{ padding: '12px', minWidth: '220px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="number"
                placeholder="Min $"
                value={filterInputs.minSalary}
                onChange={(e) => handleInputChange('minSalary', e.target.value, true)}
                style={{ width: '50%', padding: '6px', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '13px' }}
              />
              <input
                type="number"
                placeholder="Max $"
                value={filterInputs.maxSalary}
                onChange={(e) => handleInputChange('maxSalary', e.target.value, true)}
                style={{ width: '50%', padding: '6px', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '13px' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Availability Dropdown */}
      <MultiSelectDropdown
        label="Availability"
        options={AVAILABILITY_OPTIONS}
        selectedValues={filterInputs.availability || []}
        onChange={(val) => handleArrayChange('availability', val)}
        isOpen={openDropdown === 'availability'}
        toggleOpen={(open) => toggleDropdown(open ? 'availability' : null)}
      />

      {/* Reset */}
      {hasActiveFilters && (
        <button className="horizontal-filter-reset" onClick={resetFilters}>
          Reset
        </button>
      )}

    </div>
  );
};

export default JobFilters;
