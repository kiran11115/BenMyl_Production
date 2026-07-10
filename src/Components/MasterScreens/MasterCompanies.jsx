import React, { useState } from "react";
import { 
  Building2, 
  Search, 
  Plus, 
  User, 
  Globe, 
  ShieldCheck, 
  SlidersHorizontal,
  X,
  UserCheck,
  Ban,
  Activity,
  Ticket
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./MasterCompanies.css";

const initialCompanies = [
  { id: "COMP-101", name: "AeroTech Solutions", domain: "aerotech.io", tier: "Enterprise", status: "Active", users: 42, maxUsers: 100, tickets: 2, joined: "2026-01-15" },
  { id: "COMP-102", name: "Quantum Byte", domain: "quantbyte.com", tier: "Professional", status: "Active", users: 15, maxUsers: 30, tickets: 1, joined: "2026-02-10" },
  { id: "COMP-103", name: "CyberDyne Systems", domain: "cyberdyne-systems.com", tier: "Enterprise", status: "Active", users: 84, maxUsers: 150, tickets: 1, joined: "2025-11-20" },
  { id: "COMP-104", name: "CloudScale Inc", domain: "cloudscale.net", tier: "Starter", status: "Suspended", users: 4, maxUsers: 5, tickets: 1, joined: "2026-03-01" },
  { id: "COMP-105", name: "Meta Systems", domain: "metasystems.org", tier: "Professional", status: "Active", users: 22, maxUsers: 50, tickets: 1, joined: "2026-04-18" },
  { id: "COMP-106", name: "Designly Studio", domain: "designly.co", tier: "Starter", status: "Active", users: 3, maxUsers: 5, tickets: 0, joined: "2026-05-22" },
  { id: "COMP-107", name: "Nova Softtech", domain: "novasoft.io", tier: "Professional", status: "Pending Verification", users: 0, maxUsers: 20, tickets: 0, joined: "2026-07-06" }
];

const MasterCompanies = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState(initialCompanies);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [tierFilter, setTierFilter] = useState("All");
  const [selectedCompany, setSelectedCompany] = useState(null);
  
  // Registration modal state
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: "",
    domain: "",
    tier: "Starter",
    status: "Active",
    maxUsers: 25,
  });

  const handleRegisterCompany = (e) => {
    e.preventDefault();
    if (!newCompany.name || !newCompany.domain) {
      alert("Please enter both Company Name and Website Domain.");
      return;
    }
    const compId = `COMP-${Math.floor(108 + Math.random() * 900)}`;
    const addedCompany = {
      ...newCompany,
      id: compId,
      users: 0,
      tickets: 0,
      joined: new Date().toISOString().split("T")[0]
    };
    setCompanies([...companies, addedCompany]);
    setIsRegisterOpen(false);
    setNewCompany({
      name: "",
      domain: "",
      tier: "Starter",
      status: "Active",
      maxUsers: 25,
    });
  };

  const handleToggleStatus = (companyId) => {
    setCompanies(companies.map(comp => {
      if (comp.id === companyId) {
        const nextStatus = comp.status === "Active" ? "Suspended" : "Active";
        if (selectedCompany && selectedCompany.id === companyId) {
          setSelectedCompany({ ...selectedCompany, status: nextStatus });
        }
        return { ...comp, status: nextStatus };
      }
      return comp;
    }));
  };

  const handleUpdateUsersQuota = (companyId, newQuota) => {
    setCompanies(companies.map(comp => {
      if (comp.id === companyId) {
        if (selectedCompany && selectedCompany.id === companyId) {
          setSelectedCompany({ ...selectedCompany, maxUsers: parseInt(newQuota) });
        }
        return { ...comp, maxUsers: parseInt(newQuota) };
      }
      return comp;
    }));
  };

  // Filter calculations
  const filteredCompanies = companies.filter(comp => {
    const matchesSearch = comp.name.toLowerCase().includes(search.toLowerCase()) || 
                          comp.domain.toLowerCase().includes(search.toLowerCase()) ||
                          comp.id.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || comp.status === statusFilter;
    const matchesTier = tierFilter === "All" || comp.tier === tierFilter;

    return matchesSearch && matchesStatus && matchesTier;
  });

  return (
    <div className="companies-container">
      {/* Search and Filters Bar */}
      <div className="control-bar">
        <div className="search-wrapper">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by name, ID or domain..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <div className="select-container">
            <SlidersHorizontal size={14} className="select-icon" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="control-select"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
              <option value="Pending Verification">Pending Verification</option>
            </select>
          </div>

          <div className="select-container">
            <select 
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="control-select"
            >
              <option value="All">All Tiers</option>
              <option value="Starter">Starter</option>
              <option value="Professional">Professional</option>
              <option value="Enterprise">Enterprise</option>
            </select>
          </div>

          <button className="add-company-btn" onClick={() => setIsRegisterOpen(true)}>
            <Plus size={16} />
            <span>Add Company</span>
          </button>
        </div>
      </div>

      {/* Main Companies Grid & Details Sidebar */}
      <div className="companies-layout-main">
        <div className="companies-grid">
          {filteredCompanies.length === 0 ? (
            <div className="empty-grid-state">No registered companies match your filters.</div>
          ) : (
            filteredCompanies.map((comp) => (
              <div 
                key={comp.id} 
                className="company-card"
                onClick={() => navigate(`/MasterAdmin/companies/${comp.id}`)}
              >
                <div className="card-top">
                  <div className="card-avatar">
                    <Building2 size={20} />
                  </div>
                  <span className={`status-pill ${comp.status.toLowerCase().replace(" ", "-")}`}>
                    {comp.status}
                  </span>
                </div>

                <div className="card-info">
                  <h3 className="company-name">{comp.name}</h3>
                  <div className="company-domain">
                    <Globe size={12} />
                    <span>{comp.domain}</span>
                  </div>
                </div>

                <div className="card-stats">
                  <div className="stat-box">
                    <span className="stat-lbl">Users</span>
                    <span className="stat-val">{comp.users} / {comp.maxUsers}</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-lbl">Tier</span>
                    <span className={`tier-badge ${comp.tier.toLowerCase()}`}>{comp.tier}</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-lbl">Support</span>
                    <span className="stat-val support-alert">
                      <Ticket size={12} />
                      {comp.tickets} Active
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detailed Side Panel */}
        {selectedCompany && (
          <aside className="company-details-sidebar">
            <div className="sidebar-header">
              <h3>Company Management</h3>
              <button className="close-btn" onClick={() => setSelectedCompany(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="sidebar-body">
              <div className="profile-summary">
                <div className="profile-avatar">
                  <Building2 size={32} />
                </div>
                <h2>{selectedCompany.name}</h2>
                <a href={`https://${selectedCompany.domain}`} target="_blank" rel="noreferrer" className="profile-website">
                  {selectedCompany.domain}
                </a>
              </div>

              <div className="details-section">
                <h4>Subscription & Access</h4>
                <div className="details-row">
                  <span className="detail-lbl">Account Status</span>
                  <span className={`status-pill ${selectedCompany.status.toLowerCase().replace(" ", "-")}`}>
                    {selectedCompany.status}
                  </span>
                </div>
                <div className="details-row">
                  <span className="detail-lbl">Subscription Plan</span>
                  <span className="detail-val">{selectedCompany.tier}</span>
                </div>
                <div className="details-row">
                  <span className="detail-lbl">Registration Date</span>
                  <span className="detail-val">{selectedCompany.joined}</span>
                </div>
                <div className="details-row">
                  <span className="detail-lbl">Active Users Count</span>
                  <span className="detail-val">{selectedCompany.users} Users</span>
                </div>
              </div>

              <div className="actions-section">
                <h4>Administrative Actions</h4>
                
                {/* Inputs for quota limit modifications */}
                <div className="quota-edit-group">
                  <label className="input-lbl">Edit Max User Quota Limit</label>
                  <div className="quota-input-wrapper">
                    <input 
                      type="number"
                      value={selectedCompany.maxUsers}
                      onChange={(e) => handleUpdateUsersQuota(selectedCompany.id, e.target.value)}
                      className="quota-number-input"
                      min={selectedCompany.users}
                    />
                    <span className="quota-hint">allocated</span>
                  </div>
                </div>

                <div className="button-actions-grid">
                  <button 
                    onClick={() => handleToggleStatus(selectedCompany.id)}
                    className={`action-toggle-btn ${selectedCompany.status === "Active" ? "suspend" : "activate"}`}
                  >
                    {selectedCompany.status === "Active" ? (
                      <>
                        <Ban size={14} />
                        <span>Suspend Account</span>
                      </>
                    ) : (
                      <>
                        <UserCheck size={14} />
                        <span>Activate Account</span>
                      </>
                    )}
                  </button>

                  <button 
                    onClick={() => alert(`Diagnostics compiled for ${selectedCompany.name}. Integrity level: 100%`)}
                    className="action-diag-btn"
                  >
                    <Activity size={14} />
                    <span>Run Data Sync</span>
                  </button>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Register Company Modal */}
      {isRegisterOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-top">
              <h3>Register Client Workspace</h3>
              <button className="close-btn" onClick={() => setIsRegisterOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleRegisterCompany} className="modal-form-body">
              <div className="form-input-container">
                <label>Company Name</label>
                <input 
                  type="text" 
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                  placeholder="e.g. Acme Corporation"
                  required
                />
              </div>

              <div className="form-input-container">
                <label>Website Domain</label>
                <input 
                  type="text" 
                  value={newCompany.domain}
                  onChange={(e) => setNewCompany({ ...newCompany, domain: e.target.value })}
                  placeholder="e.g. acme.com"
                  required
                />
              </div>

              <div className="form-row-split">
                <div className="form-input-container">
                  <label>Subscription Tier</label>
                  <select 
                    value={newCompany.tier}
                    onChange={(e) => setNewCompany({ ...newCompany, tier: e.target.value })}
                  >
                    <option value="Starter">Starter Plan</option>
                    <option value="Professional">Professional Plan</option>
                    <option value="Enterprise">Enterprise Plan</option>
                  </select>
                </div>

                <div className="form-input-container">
                  <label>Max Users Quota</label>
                  <input 
                    type="number"
                    value={newCompany.maxUsers}
                    onChange={(e) => setNewCompany({ ...newCompany, maxUsers: parseInt(e.target.value) })}
                    min="5"
                    required
                  />
                </div>
              </div>

              <div className="modal-footer-row">
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => setIsRegisterOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Create Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterCompanies;
