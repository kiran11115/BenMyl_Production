import React, { useState } from "react";
import { 
  Ticket, 
  Building, 
  Activity, 
  DollarSign, 
  Plus, 
  Search, 
  SlidersHorizontal,
  ChevronRight,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  MessageSquare
} from "lucide-react";
import "./MasterDashboard.css";

const initialTickets = [
  { id: "TKT-8902", company: "AeroTech Solutions", title: "Talent Pool API synchronization timeout during sync", category: "API Integration", priority: "High", status: "Open", assignee: "Sarah Jenkins", date: "2026-07-07" },
  { id: "TKT-8903", company: "Quantum Byte", title: "Billing invoice PDF generation rendering error", category: "Billing", priority: "Medium", status: "In Progress", assignee: "Alex Reid", date: "2026-07-06" },
  { id: "TKT-8904", company: "CyberDyne Systems", title: "Invite Bid emails failing SPF alignment checks", category: "Email Server", priority: "High", status: "Open", assignee: "Marcus Chen", date: "2026-07-07" },
  { id: "TKT-8905", company: "CloudScale Inc", title: "Requesting custom roles configuration panel expansion", category: "Customization", priority: "Low", status: "Resolved", assignee: "Unassigned", date: "2026-07-05" },
  { id: "TKT-8906", company: "Meta Systems", title: "Database lock contention during bulk upload", category: "Database", priority: "High", status: "In Progress", assignee: "Sarah Jenkins", date: "2026-07-07" },
  { id: "TKT-8907", company: "Designly Studio", title: "Trial subscription expiry banner displaying incorrectly", category: "Billing", priority: "Low", status: "Resolved", assignee: "Alex Reid", date: "2026-07-04" },
];

const MasterDashboard = () => {
  const [tickets, setTickets] = useState(initialTickets);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // State for new ticket form
  const [newTicket, setNewTicket] = useState({
    company: "",
    title: "",
    category: "General",
    priority: "Medium",
    status: "Open",
    assignee: "Unassigned"
  });

  // Response form inside detail drawer
  const [ticketReply, setTicketReply] = useState("");

  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!newTicket.company || !newTicket.title) {
      alert("Please fill in the Company Name and Ticket Title");
      return;
    }
    const tktId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    const addedTicket = {
      ...newTicket,
      id: tktId,
      date: new Date().toISOString().split("T")[0]
    };
    setTickets([addedTicket, ...tickets]);
    setIsModalOpen(false);
    setNewTicket({
      company: "",
      title: "",
      category: "General",
      priority: "Medium",
      status: "Open",
      assignee: "Unassigned"
    });
  };

  const handleUpdateStatus = (ticketId, nextStatus) => {
    setTickets(tickets.map(tkt => tkt.id === ticketId ? { ...tkt, status: nextStatus } : tkt));
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket({ ...selectedTicket, status: nextStatus });
    }
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!ticketReply.trim()) return;
    
    // Simulate updating ticket response logs and resolving ticket on reply
    alert(`Response sent to ${selectedTicket.company}: "${ticketReply}"`);
    handleUpdateStatus(selectedTicket.id, "In Progress");
    setTicketReply("");
  };

  // Filter computations
  const filteredTickets = tickets.filter(tkt => {
    const matchesSearch = tkt.title.toLowerCase().includes(search.toLowerCase()) || 
                          tkt.company.toLowerCase().includes(search.toLowerCase()) ||
                          tkt.id.toLowerCase().includes(search.toLowerCase());
    
    const matchesPriority = priorityFilter === "All" || tkt.priority === priorityFilter;
    const matchesStatus = statusFilter === "All" || tkt.status === statusFilter;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  const kpis = [
    { label: "Active Tickets", value: tickets.filter(t => t.status !== "Resolved").length, icon: Ticket, change: "-12% from yesterday", changeType: "positive" },
    { label: "Client Companies", value: "38 Companies", icon: Building, change: "+2 registered today", changeType: "neutral" },
    { label: "System Nodes Live", value: "12 / 12 Nodes", icon: Activity, change: "99.98% Latency SLA", changeType: "positive" },
    { label: "MRR Outstanding", value: "$42,650", icon: DollarSign, change: "+8.4% monthly trend", changeType: "positive" }
  ];

  return (
    <div className="dashboard-container">
      {/* KPI Section */}
      <section className="kpi-grid">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-label">{kpi.label}</span>
                <div className="kpi-icon-wrapper">
                  <Icon size={20} />
                </div>
              </div>
              <div className="kpi-body">
                <span className="kpi-value">{kpi.value}</span>
                <span className={`kpi-change ${kpi.changeType}`}>{kpi.change}</span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Main Content Layout: Queue List and Drawer Side-by-Side when selected */}
      <div className="dashboard-layout-main">
        <section className={`queue-list-section ${selectedTicket ? "drawer-open" : ""}`}>
          <div className="section-header-row">
            <h2 className="section-title">Support Desk Queue</h2>
            <button className="create-ticket-btn" onClick={() => setIsModalOpen(true)}>
              <Plus size={16} />
              <span>Create Ticket</span>
            </button>
          </div>

          {/* Filters Bar */}
          <div className="filters-container-row">
            <div className="search-box-wrapper">
              <Search size={16} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search ticket, client, ID..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="table-search-input"
              />
            </div>

            <div className="filters-dropdowns">
              <div className="filter-group">
                <SlidersHorizontal size={14} className="filter-icon" />
                <select 
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="All">All Priorities</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="filter-group">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="All">All Statuses</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tickets Table */}
          <div className="table-responsive-wrapper">
            <table className="tickets-data-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Client Company</th>
                  <th>Incident Details</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="empty-table-state">
                      No matching support tickets found.
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((tkt) => (
                    <tr 
                      key={tkt.id} 
                      className={`ticket-row-item ${selectedTicket?.id === tkt.id ? "selected" : ""}`}
                      onClick={() => setSelectedTicket(tkt)}
                    >
                      <td className="tkt-id-col">{tkt.id}</td>
                      <td className="tkt-company-col">{tkt.company}</td>
                      <td className="tkt-title-col">
                        <div className="tkt-title-text">{tkt.title}</div>
                        <div className="tkt-meta-row">Opened on {tkt.date}</div>
                      </td>
                      <td className="tkt-cat-col">
                        <span className="cat-tag">{tkt.category}</span>
                      </td>
                      <td className="tkt-priority-col">
                        <span className={`priority-badge ${tkt.priority.toLowerCase()}`}>
                          {tkt.priority}
                        </span>
                      </td>
                      <td className="tkt-status-col">
                        <span className={`status-badge-outline ${tkt.status.toLowerCase().replace(" ", "-")}`}>
                          {tkt.status}
                        </span>
                      </td>
                      <td className="tkt-action-col">
                        <ChevronRight size={16} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Detailed Response Drawer */}
        {selectedTicket && (
          <aside className="ticket-detail-drawer">
            <div className="drawer-header">
              <div className="drawer-header-title">
                <span className="drawer-tkt-id">{selectedTicket.id}</span>
                <h3>{selectedTicket.company}</h3>
              </div>
              <button className="drawer-close-btn" onClick={() => setSelectedTicket(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="drawer-body">
              <div className="detail-card">
                <h4 className="detail-subject">{selectedTicket.title}</h4>
                <div className="detail-meta-grid">
                  <div className="meta-item">
                    <span className="meta-lbl">Category</span>
                    <span className="meta-val">{selectedTicket.category}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-lbl">Created Date</span>
                    <span className="meta-val">{selectedTicket.date}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-lbl">Assignee</span>
                    <span className="meta-val">{selectedTicket.assignee}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-lbl">Priority</span>
                    <span className={`priority-badge ${selectedTicket.priority.toLowerCase()}`}>
                      {selectedTicket.priority}
                    </span>
                  </div>
                </div>
              </div>

              <div className="drawer-actions-row">
                <span className="quick-action-lbl">Quick Status Update:</span>
                <div className="action-buttons-group">
                  <button 
                    onClick={() => handleUpdateStatus(selectedTicket.id, "Open")}
                    className={`status-btn open ${selectedTicket.status === "Open" ? "active" : ""}`}
                  >
                    Open
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(selectedTicket.id, "In Progress")}
                    className={`status-btn progress ${selectedTicket.status === "In Progress" ? "active" : ""}`}
                  >
                    In Progress
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(selectedTicket.id, "Resolved")}
                    className={`status-btn resolved ${selectedTicket.status === "Resolved" ? "active" : ""}`}
                  >
                    Resolve
                  </button>
                </div>
              </div>

              <div className="response-composer">
                <h4>
                  <MessageSquare size={16} />
                  <span>Send Ticket Reply</span>
                </h4>
                <form onSubmit={handleSendReply}>
                  <textarea 
                    value={ticketReply}
                    onChange={(e) => setTicketReply(e.target.value)}
                    placeholder="Type support response message..."
                    className="drawer-reply-input"
                    rows="5"
                  />
                  <div className="composer-footer-buttons">
                    <button type="submit" className="send-reply-submit">
                      Send to Client
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Create Ticket Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Create New Support Ticket</h3>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateTicket} className="modal-form">
              <div className="form-group-item">
                <label>Client Company Name</label>
                <input 
                  type="text" 
                  value={newTicket.company}
                  onChange={(e) => setNewTicket({ ...newTicket, company: e.target.value })}
                  placeholder="e.g. AeroTech Solutions"
                  required
                />
              </div>

              <div className="form-group-item">
                <label>Issue Description Summary</label>
                <input 
                  type="text" 
                  value={newTicket.title}
                  onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                  placeholder="Summarize the core technical incident"
                  required
                />
              </div>

              <div className="form-row-double">
                <div className="form-group-item">
                  <label>Category</label>
                  <select 
                    value={newTicket.category}
                    onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                  >
                    <option value="General">General Support</option>
                    <option value="API Integration">API Integration</option>
                    <option value="Billing">Billing & Finance</option>
                    <option value="Database">Database System</option>
                    <option value="Email Server">Email Server</option>
                    <option value="Customization">Customization</option>
                  </select>
                </div>

                <div className="form-group-item">
                  <label>Ticket Priority</label>
                  <select 
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions-footer">
                <button 
                  type="button" 
                  className="modal-cancel-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="modal-submit-btn">
                  Publish Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterDashboard;
