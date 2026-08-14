import React, { useState, useRef, useEffect, useMemo } from 'react';
import { FiChevronDown, FiCheck, FiX, FiSearch, FiPlus } from 'react-icons/fi';
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
    location: [],
    minExperience: "",
    maxExperience: "",
    minSalary: "",
    maxSalary: "",
  });

  useEffect(() => {
    if (initialFilters) {
      setFilterInputs(initialFilters);
    }
  }, [initialFilters]);

  const [openDropdown, setOpenDropdown] = useState(null);
  const [locationInputValue, setLocationInputValue] = useState("");
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
      location: [],
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
    filterInputs.location?.length > 0 ||
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

      {/* Location Dropdown */}
      <div className="horizontal-filter-wrapper" ref={locDropdownRef}>
        <button 
          className={`horizontal-filter-btn ${filterInputs.location?.length > 0 ? "active" : ""}`}
          onClick={() => toggleDropdown('location')}
        >
          {filterInputs.location?.length > 0
            ? filterInputs.location.length === 1
              ? `Location: ${filterInputs.location[0]}`
              : `Location (${filterInputs.location.length})`
            : 'Location'}
          <FiChevronDown />
        </button>
        {openDropdown === 'location' && (
          <div className="horizontal-dropdown-menu" style={{ padding: '10px', minWidth: '220px' }}>
            {filterInputs.location?.length > 0 && (
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
            <div style={{ position: "relative", width: "100%" }}>
              <input
                type="text"
                className="horizontal-input"
                placeholder="Search or enter location..."
                value={locationInputValue}
                onChange={(e) => setLocationInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault();
                    const val = locationInputValue.trim().replace(/,$/, '');
                    if (val && !(filterInputs.location || []).includes(val)) {
                      handleInputChange("location", [...(filterInputs.location || []), val]);
                    }
                    setLocationInputValue("");
                  } else if (e.key === 'Backspace' && !locationInputValue && filterInputs.location?.length > 0) {
                    const updated = filterInputs.location.slice(0, -1);
                    handleInputChange("location", updated);
                  }
                }}
                style={{ width: "100%", boxSizing: "border-box", marginBottom: "8px", border: "1px solid #e2e8f0", padding: "8px 12px", borderRadius: "6px", fontSize: "13px" }}
              />

              <div className="horizontal-dropdown-list" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                {locationInputValue.trim() && (
                  <div
                    className="horizontal-custom-option"
                    onClick={() => {
                      const val = locationInputValue.trim().replace(/,$/, '');
                      if (val && !(filterInputs.location || []).includes(val)) {
                        handleInputChange("location", [...(filterInputs.location || []), val]);
                      }
                      setLocationInputValue("");
                    }}
                  >
                    <div className="horizontal-custom-checkbox">
                      <FiPlus size={10} color="#64748b" />
                    </div>
                    <span style={{ fontWeight: 500 }}>Add "{locationInputValue}"</span>
                  </div>
                )}

                {(() => {
                  const term = locationInputValue.trim().toLowerCase();
                  if (term.length < 2 && term.length > 0) return null;
                  
                  let results = [];
                  if (term.length >= 2) {
                    try {
                      const allCities = require('country-state-city').City.getAllCities();
                      const Country = require('country-state-city').Country;
                      for (let i = 0; i < allCities.length; i++) {
                        if (allCities[i].name.toLowerCase().includes(term)) {
                          const c = Country.getCountryByCode(allCities[i].countryCode);
                          results.push({
                            city: allCities[i].name,
                            label: `${allCities[i].name}, ${c ? c.name : allCities[i].countryCode}`
                          });
                          if (results.length >= 50) break;
                        }
                      }
                    } catch (e) {
                      console.error("Error loading cities", e);
                    }
                  } else {
                    results = [
                      { city: "San Francisco", label: "San Francisco, United States" },
                      { city: "New York", label: "New York, United States" },
                      { city: "Austin", label: "Austin, United States" },
                      { city: "London", label: "London, United Kingdom" },
                      { city: "Bengaluru", label: "Bengaluru, India" },
                      { city: "Remote", label: "Remote" }
                    ];
                  }

                  return results.map((item, idx) => (
                    <div
                      key={`${item.city}-${idx}`}
                      className="horizontal-custom-option"
                      onClick={() => {
                        if (!(filterInputs.location || []).includes(item.city)) {
                          handleInputChange("location", [...(filterInputs.location || []), item.city]);
                        }
                        setLocationInputValue("");
                      }}
                    >
                      <div className={`horizontal-custom-checkbox ${(filterInputs.location || []).includes(item.city) ? "checked" : ""}`}>
                        {(filterInputs.location || []).includes(item.city) && <FiCheck size={10} color="white" />}
                      </div>
                      <span>{item.label}</span>
                    </div>
                  ));
                })()}
              </div>
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
