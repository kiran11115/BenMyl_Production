import React, { useState } from 'react';
import { FiChevronDown, FiStar, FiMapPin } from 'react-icons/fi';
import '../Filters/FiltersSidebar.css';

const SERVICE_TYPES = [
  'All Services',
  'House Cleaning', 
  'Plumbing', 
  'Electrical', 
  'Gardening', 
  'Moving'
];

const FilterSidebar = ({ onApplyFilters }) => {
  const initialFilters = {
    serviceType: 'All Services',
    minRating: 0,
    location: '',
    availability: '',
    maxBudget: 50000
  };

  const [filterInputs, setFilterInputs] = useState(initialFilters);

  const handleInputChange = (field, value) => {
    setFilterInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const applyFilters = () => {
    if (onApplyFilters) {
      onApplyFilters(filterInputs);
    }
  };

  const resetFilters = () => {
    setFilterInputs(initialFilters);
  };

  return (
    <div className="filter-sidebar">
      {/* Header */}
      <div className="filter-header">
        <h3 className="filter-title">Filters</h3>
        <span onClick={resetFilters} className="filter-reset">
          Reset
        </span>
      </div>

      {/* Service Type */}
      <div className="filter-section">
        <h4 className="section-title">Service Type</h4>
        <div className="select-wrapper">
          <select 
            className="filter-select"
            value={filterInputs.serviceType}
            onChange={(e) => handleInputChange('serviceType', e.target.value)}
          >
            {SERVICE_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <FiChevronDown className="select-icon" />
        </div>
      </div>

      {/* Min Rating */}
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

      {/* Location */}
      <div className="filter-section">
        <h4 className="section-title">Location</h4>
        <div className="location-wrapper">
          <FiMapPin className="location-icon" size={16} />
          <input 
            type="text" 
            className="location-input"
            placeholder="e.g. New York" 
            value={filterInputs.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
          />
        </div>
      </div>

      {/* Availability */}
      <div className="filter-section">
        <h4 className="section-title">Availability</h4>
        <div className="availability-list">
          {['Immediate', 'Within 1 Week', 'Custom Range'].map((item) => (
            <label key={item} className="availability-label">
              <input 
                type="radio" 
                className="availability-radio"
                name="availability"
                checked={filterInputs.availability === item}
                onChange={() => handleInputChange('availability', item)}
              />
              {item}
            </label>
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
           max="50000" 
           step="1000"
           value={filterInputs.maxBudget} 
           onChange={(e) => handleInputChange('maxBudget', Number(e.target.value))}
         />
         <div className="budget-labels">
           <span>$0</span>
           <span>${(filterInputs.maxBudget / 100).toFixed(0)}/hr</span>
         </div>
      </div>

      {/* Apply Button */}
      <button onClick={applyFilters} className="apply-btn">
        Apply Filters
      </button>
    </div>
  );
};

export default FilterSidebar;
