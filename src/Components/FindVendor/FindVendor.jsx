import React, { useState } from 'react';
import { 
  FiSearch, FiFilter, FiPlus, FiMoreVertical, 
  FiStar, FiMapPin, FiClock, FiCheckCircle, FiChevronLeft, FiChevronDown
} from 'react-icons/fi';

// --- (Augmented Mock Data to support all filters) ---
const MOCK_VENDORS = [
  {
    id: 1,
    name: 'TechFlow Solutions',
    category: 'IT Services',
    rating: 4.8,
    reviews: 124,
    location: 'San Francisco, CA',
    status: 'Verified',
    statusClass: 'status-completed', 
    avatar: 'https://i.pravatar.cc/150?u=1',
    progress: 85,
    matchScore: '98%',
    hourlyRate: 120,
    availability: 'Immediate'
  },
  {
    id: 2,
    name: 'Creative Pulse Agency',
    category: 'Marketing',
    rating: 4.6,
    reviews: 89,
    location: 'New York, NY',
    status: 'Review',
    statusClass: 'status-review', 
    avatar: 'https://i.pravatar.cc/150?u=2',
    progress: 60,
    matchScore: '92%',
    hourlyRate: 85,
    availability: 'Within 1 Week'
  },
  {
    id: 3,
    name: 'Global Logistics Partners',
    category: 'Supply Chain',
    rating: 4.9,
    reviews: 215,
    location: 'Chicago, IL',
    status: 'Pending',
    statusClass: 'status-pending', 
    avatar: 'https://i.pravatar.cc/150?u=3',
    progress: 40,
    matchScore: '88%',
    hourlyRate: 95,
    availability: 'Custom Range'
  },
  {
    id: 4,
    name: 'Apex Legal Group',
    category: 'Legal',
    rating: 4.7,
    reviews: 56,
    location: 'Austin, TX',
    status: 'Verified',
    statusClass: 'status-completed',
    avatar: 'https://i.pravatar.cc/150?u=4',
    progress: 92,
    matchScore: '95%',
    hourlyRate: 200,
    availability: 'Immediate'
  },
  {
    id: 5,
    name: 'Summit HR Consult',
    category: 'Human Resources',
    rating: 4.5,
    reviews: 42,
    location: 'Denver, CO',
    status: 'Progress',
    statusClass: 'status-progress',
    avatar: 'https://i.pravatar.cc/150?u=5',
    progress: 25,
    matchScore: '85%',
    hourlyRate: 75,
    availability: 'Within 1 Week'
  }
];

const RECENT_INTERVIEWS = [
  { id: 1, title: 'Contract Negotiation', role: 'TechFlow Sol.', type: 'Legal', tagClass: 'tag-hr' },
  { id: 2, title: 'Initial Screening', role: 'Creative Pulse', type: 'Technical', tagClass: 'tag-technical' },
  { id: 3, title: 'Compliance Check', role: 'Global Logistics', type: 'Managerial', tagClass: 'tag-managerial' },
];

const SERVICE_TYPES = ['All Services', 'IT Services', 'Marketing', 'Legal', 'Supply Chain', 'Human Resources'];

const VendorSearchPage = () => {
  // State for immediate search input
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for the sidebar form inputs
  const [filterInputs, setFilterInputs] = useState({
    serviceType: 'All Services',
    minRating: 0,
    location: '',
    availability: '', // '' means all
    maxBudget: 50000
  });

  // State for the "Active" filters (applied when button is clicked)
  // We initialize this with the same values as inputs so the list shows initially
  const [activeFilters, setActiveFilters] = useState({
    serviceType: 'All Services',
    minRating: 0,
    location: '',
    availability: '',
    maxBudget: 50000
  });

  // Handler for form changes
  const handleInputChange = (field, value) => {
    setFilterInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handler for "Apply Filters"
  const applyFilters = () => {
    setActiveFilters(filterInputs);
  };

  // --- FILTERING LOGIC ---
  const filteredVendors = MOCK_VENDORS.filter(vendor => {
    // 1. Search Term (Name)
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Service Type
    const matchesService = activeFilters.serviceType === 'All Services' || 
                           vendor.category === activeFilters.serviceType;

    // 3. Minimum Rating
    const matchesRating = vendor.rating >= activeFilters.minRating;

    // 4. Location (Partial match)
    const matchesLocation = activeFilters.location === '' || 
                            vendor.location.toLowerCase().includes(activeFilters.location.toLowerCase());

    // 5. Availability
    const matchesAvailability = activeFilters.availability === '' || 
                                vendor.availability === activeFilters.availability;

    // 6. Budget (Hourly Rate check - assuming budget input implies max hourly cost for this demo context, or project cost)
    // For demo purposes, we'll map the slider (0-500) to hourly rate roughly
    const matchesBudget = vendor.hourlyRate <= (activeFilters.maxBudget / 100); // Scaling budget down for hourly comparison logic

    return matchesSearch && matchesService && matchesRating && matchesLocation && matchesAvailability && matchesBudget;
  });

  return (
    <div className="projects-container">
      
      {/* === BREADCRUMBS === */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '13px', color: '#64748b' }}>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#3b82f6', textDecoration: 'none', fontWeight: 500 }}>
          <FiChevronLeft size={16} /> Back to dashboard
        </a>
        <span style={{ color: '#cbd5e1' }}>/</span>
        <span style={{ color: '#1e293b', fontWeight: 600 }}>Find Vendor</span>
      </div>

      {/* --- Top Header / Search --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="section-title" style={{ fontSize: '24px', marginBottom: '8px' }}>Find Vendor</h1>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Search and manage your vendor network.</p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flex: 1, maxWidth: '600px', justifyContent: 'flex-end' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Search by Vendor Name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px',
                border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px', color: '#334155'
              }}
            />
          </div>
          <button className="btn-upload" style={{ width: 'auto', padding: '0 20px' }}>
            <FiPlus size={16} /> <span>Add Vendor</span>
          </button>
        </div>
      </div>

      <div className="dashboard-layout" style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
        
        {/* === LEFT COLUMN: FILTERS === */}
        <div className="filter-sidebar" style={{ 
          width: '260px', flexShrink: 0, background: '#fff', borderRadius: '12px', 
          padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Filters</h3>
            {/* Clear Filters Link (Optional utility) */}
            <span 
              onClick={() => {
                const reset = { serviceType: 'All Services', minRating: 0, location: '', availability: '', maxBudget: 50000 };
                setFilterInputs(reset);
                setActiveFilters(reset);
              }}
              style={{ fontSize: '12px', color: '#3b82f6', cursor: 'pointer', fontWeight: 500 }}
            >
              Reset
            </span>
          </div>

          {/* Service Type Dropdown */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#334155' }}>Service Type</h4>
            <div style={{ position: 'relative' }}>
              <select 
                value={filterInputs.serviceType}
                onChange={(e) => handleInputChange('serviceType', e.target.value)}
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0',
                  fontSize: '13px', color: '#334155', appearance: 'none', background: '#fff', cursor: 'pointer'
                }}
              >
                {SERVICE_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <FiChevronDown style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
            </div>
          </div>

          {/* Minimum Rating */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#334155' }}>Minimum Rating</h4>
            <div style={{ display: 'flex', gap: '4px' }}>
               {[1, 2, 3, 4, 5].map((star) => (
                 <button 
                   key={star} 
                   onClick={() => handleInputChange('minRating', star)}
                   style={{ 
                     background: filterInputs.minRating >= star ? '#fef3c7' : '#f1f5f9', 
                     border: filterInputs.minRating >= star ? '1px solid #fbbf24' : '1px solid #e2e8f0',
                     borderRadius: '4px', padding: '6px', cursor: 'pointer', display: 'flex', 
                     flex: 1, alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
                   }}
                 >
                   <FiStar size={16} fill={filterInputs.minRating >= star ? "#f59f0a" : "none"} color={filterInputs.minRating >= star ? "#f59f0a" : "#94a3b8"} />
                 </button>
               ))}
            </div>
          </div>

          {/* Location */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#334155' }}>Location</h4>
            <div style={{ position: 'relative' }}>
              <FiMapPin style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={16} />
              <input 
                type="text" 
                placeholder="e.g. New York" 
                value={filterInputs.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                style={{
                  width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px',
                  border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Availability */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#334155' }}>Availability</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['Immediate', 'Within 1 Week', 'Custom Range'].map((item) => (
                <label key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#64748b', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="availability"
                    checked={filterInputs.availability === item}
                    onChange={() => handleInputChange('availability', item)}
                    style={{ accentColor: '#3b82f6', width: '16px', height: '16px' }} 
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>

          {/* Budget Range */}
          <div style={{ marginBottom: '32px' }}>
             <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#334155' }}>Max Hourly Rate</h4>
             <input 
              type="range" 
              min="0" 
              max="25000" 
              step="1000"
              value={filterInputs.maxBudget} 
              onChange={(e) => handleInputChange('maxBudget', Number(e.target.value))}
              style={{ width: '100%', accentColor: '#3b82f6', cursor: 'pointer' }} 
             />
             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
               <span>$0</span>
               <span>${(filterInputs.maxBudget / 100).toFixed(0)}/hr</span>
             </div>
          </div>

          {/* Apply Button */}
          <button 
            onClick={applyFilters}
            style={{
              width: '100%', background: '#3b82f6', color: '#fff', border: 'none',
              padding: '12px', borderRadius: '8px', fontWeight: 600, fontSize: '14px',
              cursor: 'pointer', transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#2563eb'}
            onMouseOut={(e) => e.currentTarget.style.background = '#3b82f6'}
          >
            Apply Filters
          </button>
        </div>

        {/* === CENTER: Results === */}
        <div className="dashboard-column-main" style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0' }}>
            <h2 className="section-title" style={{ margin: 0 }}>Vendor Results</h2>
            <span style={{ fontSize: '13px', color: '#64748b' }}>Showing {filteredVendors.length} result{filteredVendors.length !== 1 && 's'}</span>
          </div>
          
          <div className="projects-grid">
            {filteredVendors.length > 0 ? (
              filteredVendors.map((vendor) => (
                <div key={vendor.id} className="stat-card" style={{ display: 'block', padding: '20px' }}>
                  <div className="card-header" style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <img src={vendor.avatar} alt={vendor.name} className="author-avatar" style={{ width: '40px', height: '40px' }} />
                      <div>
                        <h3 className="card-title" style={{ fontSize: '15px', marginBottom: '4px' }}>{vendor.name}</h3>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>{vendor.category}</span>
                      </div>
                    </div>
                    <button className="card-options-btn">
                      <FiMoreVertical size={18} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    <div className={`status-tag ${vendor.statusClass}`}>
                      {vendor.status}
                    </div>
                    <div className="detail-item" style={{ fontSize: '11px', padding: '4px 8px' }}>
                      <FiStar color="#f59f0a" size={12} fill="#f59f0a" /> 
                      <span style={{ color: '#334155', fontWeight: 600 }}>{vendor.rating}</span>
                      <span style={{ color: '#94a3b8' }}>({vendor.reviews})</span>
                    </div>
                  </div>

                  <div className="card-details" style={{ marginBottom: '20px', flexDirection: 'column', gap: '10px' }}>
                     <div className="detail-item" style={{ background: 'transparent', padding: 0 }}>
                        <FiMapPin size={14} /> <span>{vendor.location}</span>
                     </div>
                     <div className="detail-item" style={{ background: 'transparent', padding: 0 }}>
                        <FiClock size={14} /> <span>{vendor.availability}</span>
                     </div>
                  </div>

                  <div className="progress-section">
                    <div className="progress-labels">
                      <span>Rate: ${vendor.hourlyRate}/hr</span>
                      <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>{vendor.matchScore} Match</span>
                    </div>
                    <div className="progress-bg">
                      <div className="progress-fill" style={{ width: vendor.matchScore }}></div>
                    </div>
                  </div>

                  <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                     <button className="btn-upload" style={{ background: '#fff', color: '#6843c7', fontSize: '11px', height: '32px' }}>
                       View Profile
                     </button>
                     <button className="btn-upload" style={{ fontSize: '11px', height: '32px' }}>
                       Invite
                     </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ 
                gridColumn: '1 / -1', padding: '40px', textAlign: 'center', 
                background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1'
              }}>
                <FiSearch size={24} color="#94a3b8" style={{ marginBottom: '12px' }} />
                <h3 style={{ fontSize: '16px', color: '#475569', marginBottom: '8px' }}>No vendors found</h3>
                <p style={{ fontSize: '13px', color: '#94a3b8' }}>Try adjusting your filters or search terms.</p>
              </div>
            )}
          </div>
        </div>

        {/* === RIGHT COLUMN: STATS === */}
        <div className="dashboard-column-side" style={{ width: '280px', flexShrink: 0 }}>
          {/* Stats Cards remain unchanged */}
          <div className="stat-card card-cyan">
            <div className="bubbles-container">
              <div className="bubble bubble-1"></div>
              <div className="bubble bubble-2"></div>
              <div className="bubble bubble-3"></div>
            </div>
            <div className="stat-content">
              <div>
                <div className="stat-label">Total Active Vendors</div>
                <div className="stat-value">1,248</div>
                <div className="stat-trend trend-up">
                  <span>↑ 12%</span> <span>vs last month</span>
                </div>
              </div>
            </div>
            <div className="stat-icon-box"><FiCheckCircle /></div>
          </div>

          <div className="stat-card card-purple">
             <div className="bubbles-container">
              <div className="bubble bubble-1"></div>
              <div className="bubble bubble-3"></div>
            </div>
            <div className="stat-content">
              <div>
                <div className="stat-label">Pending Reviews</div>
                <div className="stat-value">24</div>
                <div className="stat-trend trend-down">
                  <span>↓ 4%</span> <span>improving</span>
                </div>
              </div>
            </div>
            <div className="stat-icon-box"><FiClock /></div>
          </div>

          <div className="table-card" style={{ padding: '24px' }}>
            <div className="card-header-compact">
              <h3 className="section-title" style={{ fontSize: '15px', marginBottom: 0 }}>Recent Activity</h3>
              <button className="options-btn"><FiMoreVertical /></button>
            </div>
            <div className="interviews-wrapper">
              {RECENT_INTERVIEWS.map((item) => (
                <div key={item.id} className="interview-item-premium">
                  <div className="icon-box-premium" style={{ 
                    background: item.type === 'Technical' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : undefined 
                  }}>
                    <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{item.role.charAt(0)}</span>
                  </div>
                  <div className="interview-content">
                    <div className="interview-title">{item.role}</div>
                    <div className="interview-meta-row">
                      <span>{item.title}</span>
                      <span className={`status-tag ${item.tagClass}`} style={{ fontSize: '9px', padding: '1px 6px' }}>{item.type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorSearchPage;
