import React, { useState } from 'react';
import { 
  FiSearch, FiPlus, FiMoreVertical, 
  FiStar, FiMapPin, FiClock, FiChevronDown, FiCalendar, FiArrowLeft
} from 'react-icons/fi';
import { useNavigate } from "react-router-dom";

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

// --- NEW MOCK DATA FOR RIGHT COLUMN ---
const TOP_VENDORS_WIDGET = [
  { id: 1, name: 'HR Solutions Pro', rating: 4.6, avatar: 'https://i.pravatar.cc/150?u=8' },
  { id: 2, name: 'Talent Bridge', rating: 4.8, avatar: 'https://i.pravatar.cc/150?u=9' },
  { id: 3, name: 'Hire Right', rating: 4.7, avatar: 'https://i.pravatar.cc/150?u=10' },
];

const RECENT_INVITES_WIDGET = [
  { id: 1, name: 'HR Solutions Pro', time: 'Invited 2 days ago' },
  { id: 2, name: 'Talent Bridge', time: 'Invited 2 days ago' },
  { id: 3, name: 'Hire Right', time: 'Invited 2 days ago' },
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
  const [activeFilters, setActiveFilters] = useState({
    serviceType: 'All Services',
    minRating: 0,
    location: '',
    availability: '',
    maxBudget: 50000
  });

  const handleInputChange = (field, value) => {
    setFilterInputs(prev => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    setActiveFilters(filterInputs);
  };

  const navigate = useNavigate();

  // --- FILTERING LOGIC ---
  const filteredVendors = MOCK_VENDORS.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesService = activeFilters.serviceType === 'All Services' || vendor.category === activeFilters.serviceType;
    const matchesRating = vendor.rating >= activeFilters.minRating;
    const matchesLocation = activeFilters.location === '' || vendor.location.toLowerCase().includes(activeFilters.location.toLowerCase());
    const matchesAvailability = activeFilters.availability === '' || vendor.availability === activeFilters.availability;
    const matchesBudget = vendor.hourlyRate <= (activeFilters.maxBudget / 100);

    return matchesSearch && matchesService && matchesRating && matchesLocation && matchesAvailability && matchesBudget;
  });

  return (
    <div className="projects-container">
      
      {/* === BREADCRUMBS === */}
       <div className="vs-breadcrumbs d-flex mb-3">
                <button className="link-button" onClick={() => navigate("/user/user-dashboard")}>
                  <FiArrowLeft /> Back to Dashboard
                </button>
                <span className="crumb">/ Find Vendors</span>
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
          <button className="add-project-btn" style={{ width: 'auto', padding: '0 20px' }}>
          <span>Find Vendor</span>
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

          {/* Service Type */}
          <div style={{ marginBottom: '24px' }}>
            <h4 className='card-title  mb-2'>Service Type</h4>
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

          {/* Min Rating */}
          <div style={{ marginBottom: '24px' }}>
            <h4 className='card-title  mb-2'>Minimum Rating</h4>
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
            <h4 className='card-title  mb-2'>Location</h4>
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
            <h4 className='card-title  mb-2'>Availability</h4>
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

          {/* Budget */}
          <div style={{ marginBottom: '32px' }}>
             <h4 className='card-title mb-2'>Max Hourly Rate</h4>
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
                <div key={vendor.id} className="project-card">
                  <div className="card-header">
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <img src={vendor.avatar} alt={vendor.name} className="author-avatar" style={{ width: '40px', height: '40px' }} />
                      <div>
                        <h3 className="card-title">{vendor.name}</h3>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>{vendor.category}</span>
                      </div>
                    </div>
                    <button className="card-options-btn">
                      <FiMoreVertical size={18} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <div className={`status-tag ${vendor.statusClass}`}>
                      {vendor.status}
                    </div>
                    <div className="detail-item" style={{ fontSize: '11px', padding: '4px 8px' }}>
                      <FiStar color="#f59f0a" size={12} fill="#f59f0a" /> 
                      <span style={{ color: '#334155', fontWeight: 600 }}>{vendor.rating}</span>
                      <span style={{ color: '#94a3b8' }}>({vendor.reviews})</span>
                    </div>
                  </div>

                  <div className="card-details" style={{ flexDirection: 'column', gap: '10px' }}>
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

                  <div style={{ marginTop: '10px', display: 'flex', gap: '12px' }}>
                      <button onClick={() => navigate("/user/user-invite-bid")} className="btn-primary">
                        Invite
                      </button>
                      <button onClick={() => navigate("/user/user-vendor-detail")} className="btn-secondary">
                        View
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

        {/* === RIGHT COLUMN: UPDATED TO MATCH IMAGE === */}
        <div className="dashboard-column-side" style={{ width: '280px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* 1. Top Vendors Section */}
          <div className='project-card'>
            <h3 className='card-title'>Top Vendors</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {TOP_VENDORS_WIDGET.map(vendor => (
                <div key={vendor.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img 
                    src={vendor.avatar} 
                    alt={vendor.name} 
                    style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover' }} 
                  />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{vendor.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#64748b' }}>
                      <FiStar size={12} color="#fbbf24" fill="#fbbf24" style={{ marginTop: '-1px' }} />
                      {vendor.rating}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Average Spend Chart */}
          <div className='project-card'>
            <h3 className='card-title'>Average Spend</h3>
            
            <div style={{ position: 'relative', height: '140px', display: 'flex', alignItems: 'flex-end', paddingLeft: '35px', paddingBottom: '20px' }}>
              {/* Y-Axis Labels */}
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '9px', color: '#94a3b8', textAlign: 'right', width: '30px' }}>
                <span>16000</span>
                <span>12000</span>
                <span>8000</span>
                <span>4000</span>
                <span>0</span>
              </div>

              {/* Grid Lines */}
              <div style={{ position: 'absolute', left: '35px', right: 0, top: '7px', bottom: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 0 }}>
                {[...Array(5)].map((_, i) => (
                  <div key={i} style={{ width: '100%', height: '1px', borderTop: '1px dashed #e2e8f0' }}></div>
                ))}
              </div>

              {/* Bars (Visual approximation) */}
              <div style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', zIndex: 1, paddingRight: '10px' }}>
                {/* Bar 1 */}
                <div style={{ width: '40px', height: '100%', display: 'flex', alignItems: 'flex-end', position: 'relative' }}>
                  {/* Invisible container, drawing line only */}
                  <div style={{ width: '1px', height: '100%', background: '#cbd5e1', position: 'absolute', left: 0 }}></div>
                </div>
                {/* Bar 2 (Just vertical grid line as per image style usually implies bounds) */}
                <div style={{ width: '1px', height: '100%', background: '#cbd5e1' }}></div>
              </div>

              {/* X-Axis Labels */}
              <div style={{ position: 'absolute', left: '35px', right: 0, bottom: 0, display: 'flex', justifyContent: 'space-between', paddingRight: '10px' }}>
                <span style={{ fontSize: '9px', color: '#94a3b8' }}>Background</span>
                <span style={{ fontSize: '9px', color: '#94a3b8' }}>Onboarding</span>
              </div>
            </div>
          </div>

          {/* 3. Recent Invites */}
          <div className='project-card'>
            <h3 className='card-title'>Recent Invites</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {RECENT_INVITES_WIDGET.map(invite => (
                <div className='interview-item-premium' key={invite.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    width: '36px', height: '36px', borderRadius: '8px', 
                    background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' 
                  }}>
                    <FiCalendar size={16} color="#2563eb" />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{invite.name}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>{invite.time}</div>
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
