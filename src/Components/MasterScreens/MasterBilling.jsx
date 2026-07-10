import React, { useState } from "react";
import { 
  CreditCard, 
  Search, 
  Plus, 
  FileText, 
  DollarSign, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  ChevronRight,
  X,
  TrendingUp,
  Download,
  Building
} from "lucide-react";
import "./MasterBilling.css";

const initialInvoices = [
  { id: "INV-2026-001", company: "AeroTech Solutions", tier: "Enterprise", amount: 4500.00, status: "Paid", issued: "2026-06-01", due: "2026-06-15" },
  { id: "INV-2026-002", company: "Quantum Byte", tier: "Professional", amount: 1500.00, status: "Paid", issued: "2026-06-01", due: "2026-06-15" },
  { id: "INV-2026-003", company: "CyberDyne Systems", tier: "Enterprise", amount: 6500.00, status: "Pending", issued: "2026-07-01", due: "2026-07-15" },
  { id: "INV-2026-004", company: "CloudScale Inc", tier: "Starter", amount: 450.00, status: "Overdue", issued: "2026-05-15", due: "2026-05-30" },
  { id: "INV-2026-005", company: "Meta Systems", tier: "Professional", amount: 2200.00, status: "Pending", issued: "2026-07-01", due: "2026-07-15" },
  { id: "INV-2026-006", company: "Designly Studio", tier: "Starter", status: "Paid", amount: 450.00, issued: "2026-06-15", due: "2026-06-30" }
];

const initialDisputes = [
  { id: "DSP-301", company: "AeroTech Solutions", invoiceId: "INV-2026-001", issue: "Active user count discrepancy", details: "Charged for 45 active users but audit logs display 42 max concurrently active. Requesting a credit of $300.", status: "Under Review" },
  { id: "DSP-302", company: "CloudScale Inc", invoiceId: "INV-2026-004", issue: "Late fee waiver request", details: "Encountered banking integration issue causing 2 days payment delay. Requesting late-fee removal of $45.", status: "Pending Decision" }
];

const MasterBilling = () => {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [disputes, setDisputes] = useState(initialDisputes);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  
  // Invoice generation wizard state
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    company: "",
    tier: "Starter",
    amount: "",
    description: "",
    dueDays: 14
  });

  const handleCreateInvoice = (e) => {
    e.preventDefault();
    if (!newInvoice.company || !newInvoice.amount) {
      alert("Please fill in the Company Name and Invoice Amount.");
      return;
    }
    const invId = `INV-2026-0${Math.floor(100 + Math.random() * 900)}`;
    const today = new Date();
    const issuedDate = today.toISOString().split("T")[0];
    
    // Calculate due date
    const dueTime = new Date(today);
    dueTime.setDate(today.getDate() + parseInt(newInvoice.dueDays));
    const dueDate = dueTime.toISOString().split("T")[0];

    const addedInvoice = {
      id: invId,
      company: newInvoice.company,
      tier: newInvoice.tier,
      amount: parseFloat(newInvoice.amount),
      status: "Pending",
      issued: issuedDate,
      due: dueDate
    };

    setInvoices([addedInvoice, ...invoices]);
    setIsGenerateOpen(false);
    setNewInvoice({
      company: "",
      tier: "Starter",
      amount: "",
      description: "",
      dueDays: 14
    });
  };

  const handleResolveDispute = (disputeId, action) => {
    // Action can be: "Approve Refund", "Reject Dispute"
    alert(`Dispute ${disputeId} action processed: "${action}"`);
    setDisputes(disputes.filter(d => d.id !== disputeId));
  };

  const handleUpdatePaymentStatus = (invoiceId, nextStatus) => {
    setInvoices(invoices.map(inv => inv.id === invoiceId ? { ...inv, status: nextStatus } : inv));
    if (selectedInvoice && selectedInvoice.id === invoiceId) {
      setSelectedInvoice({ ...selectedInvoice, status: nextStatus });
    }
  };

  // Filter calculations
  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.company.toLowerCase().includes(search.toLowerCase()) || 
                          inv.id.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || inv.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalOutstanding = invoices
    .filter(inv => inv.status !== "Paid")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const mrrData = [
    { tier: "Enterprise", rate: "$1,500 / mo", totalCompanies: 8, totalMRR: 12000.00 },
    { tier: "Professional", rate: "$500 / mo", totalCompanies: 18, totalMRR: 9000.00 },
    { tier: "Starter", rate: "$150 / mo", totalCompanies: 12, totalMRR: 1800.00 }
  ];

  return (
    <div className="billing-container">
      {/* Header Stat row */}
      <section className="billing-kpis-grid">
        <div className="billing-kpi-card">
          <div className="card-top-header">
            <span>Outstanding Balance</span>
            <DollarSign size={18} className="kpi-icon" />
          </div>
          <h3>${totalOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
          <p className="kpi-desc">{invoices.filter(i => i.status !== "Paid").length} invoices pending payment</p>
        </div>

        <div className="billing-kpi-card mrr">
          <div className="card-top-header">
            <span>Monthly Recurring Revenue</span>
            <TrendingUp size={18} className="kpi-icon" />
          </div>
          <h3>$22,800.00</h3>
          <p className="kpi-desc">Consolidated across subscription pools</p>
        </div>

        <div className="billing-kpi-card disputes">
          <div className="card-top-header">
            <span>Billing Disputes Escalated</span>
            <AlertCircle size={18} className="kpi-icon" />
          </div>
          <h3>{disputes.length} Escalations</h3>
          <p className="kpi-desc">Under active support evaluation</p>
        </div>
      </section>

      {/* Main Billing Layout split */}
      <div className="billing-layout-main">
        {/* Left Side: Invoice Queue */}
        <section className="invoices-queue-section">
          <div className="section-header">
            <h2 className="section-title">Corporate Invoices Ledger</h2>
            <button className="wizard-trigger-btn" onClick={() => setIsGenerateOpen(true)}>
              <Plus size={16} />
              <span>Create Invoice</span>
            </button>
          </div>

          <div className="filters-row">
            <div className="search-box">
              <Search size={16} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search invoice by ID or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="invoice-filters">
              {["All", "Paid", "Pending", "Overdue"].map((status) => (
                <button 
                  key={status}
                  className={`status-filter-btn ${statusFilter === status ? "active" : ""}`}
                  onClick={() => setStatusFilter(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="table-wrapper">
            <table className="billing-data-table">
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Client Company</th>
                  <th>Plan Tier</th>
                  <th>Billing Amount</th>
                  <th>Issued Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="empty-state">No matching invoices found.</td>
                  </tr>
                ) : (
                  filteredInvoices.map((inv) => (
                    <tr 
                      key={inv.id} 
                      className={`invoice-row ${selectedInvoice?.id === inv.id ? "selected" : ""}`}
                      onClick={() => setSelectedInvoice(inv)}
                    >
                      <td className="inv-id-col">{inv.id}</td>
                      <td className="inv-company-col">{inv.company}</td>
                      <td className="inv-tier-col">{inv.tier}</td>
                      <td className="inv-amt-col">${inv.amount.toFixed(2)}</td>
                      <td className="inv-date-col">{inv.issued}</td>
                      <td className="inv-date-col">{inv.due}</td>
                      <td>
                        <span className={`status-tag ${inv.status.toLowerCase()}`}>
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Selected Invoice Operations sidebar */}
        {selectedInvoice && (
          <aside className="invoice-sidebar">
            <div className="sidebar-header">
              <h3>Invoice Control</h3>
              <button className="close-btn" onClick={() => setSelectedInvoice(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="sidebar-body">
              <div className="invoice-preview-card">
                <FileText size={28} className="preview-icon" />
                <h4>{selectedInvoice.id}</h4>
                <p className="preview-company">{selectedInvoice.company}</p>
                <h3 className="preview-amount">${selectedInvoice.amount.toFixed(2)}</h3>
              </div>

              <div className="invoice-details">
                <h4>Invoice Summary</h4>
                <div className="inv-detail-row">
                  <span>Issued Date</span>
                  <strong>{selectedInvoice.issued}</strong>
                </div>
                <div className="inv-detail-row">
                  <span>Due Date</span>
                  <strong>{selectedInvoice.due}</strong>
                </div>
                <div className="inv-detail-row">
                  <span>Plan License Tier</span>
                  <strong>{selectedInvoice.tier}</strong>
                </div>
                <div className="inv-detail-row">
                  <span>Payment status</span>
                  <span className={`status-tag ${selectedInvoice.status.toLowerCase()}`}>
                    {selectedInvoice.status}
                  </span>
                </div>
              </div>

              <div className="invoice-actions">
                <h4>Billing Control Actions</h4>
                
                <div className="actions-button-stack">
                  <div className="quick-status-selector">
                    <span className="lbl">Update Status:</span>
                    <div className="buttons-row">
                      <button 
                        onClick={() => handleUpdatePaymentStatus(selectedInvoice.id, "Paid")}
                        className={`status-opt-btn paid ${selectedInvoice.status === "Paid" ? "active" : ""}`}
                      >
                        Paid
                      </button>
                      <button 
                        onClick={() => handleUpdatePaymentStatus(selectedInvoice.id, "Pending")}
                        className={`status-opt-btn pending ${selectedInvoice.status === "Pending" ? "active" : ""}`}
                      >
                        Pending
                      </button>
                      <button 
                        onClick={() => handleUpdatePaymentStatus(selectedInvoice.id, "Overdue")}
                        className={`status-opt-btn overdue ${selectedInvoice.status === "Overdue" ? "active" : ""}`}
                      >
                        Overdue
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={() => alert(`Downloading Invoice PDF bundle for ${selectedInvoice.id}`)}
                    className="download-pdf-btn"
                  >
                    <Download size={14} />
                    <span>Download Invoice PDF</span>
                  </button>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Disputes Resolution Console */}
      <section className="disputes-console-section">
        <h2 className="section-title">Billing Disputes Queue</h2>
        <div className="disputes-list">
          {disputes.length === 0 ? (
            <div className="empty-disputes">No outstanding client billing disputes reported.</div>
          ) : (
            disputes.map((dsp) => (
              <div key={dsp.id} className="dispute-alert-card">
                <div className="dispute-header">
                  <div className="header-info">
                    <span className="dsp-id">{dsp.id}</span>
                    <h4>{dsp.company}</h4>
                    <span className="related-inv">Invoice Ref: {dsp.invoiceId}</span>
                  </div>
                  <span className="dispute-status-badge">{dsp.status}</span>
                </div>

                <div className="dispute-body">
                  <strong className="dispute-issue-title">{dsp.issue}</strong>
                  <p className="dispute-desc-text">"{dsp.details}"</p>
                </div>

                <div className="dispute-actions">
                  <button 
                    onClick={() => handleResolveDispute(dsp.id, "Approve Refund / Credit")}
                    className="dispute-btn approve"
                  >
                    Approve Credit Adjustment
                  </button>
                  <button 
                    onClick={() => handleResolveDispute(dsp.id, "Reject dispute / Request payout")}
                    className="dispute-btn reject"
                  >
                    Reject Claims
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Generate Invoice Modal */}
      {isGenerateOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-top">
              <h3>Generate Corporate Invoice</h3>
              <button className="close-btn" onClick={() => setIsGenerateOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateInvoice} className="modal-form-body">
              <div className="form-input-container">
                <label>Recipient Company Name</label>
                <input 
                  type="text" 
                  value={newInvoice.company}
                  onChange={(e) => setNewInvoice({ ...newInvoice, company: e.target.value })}
                  placeholder="e.g. AeroTech Solutions"
                  required
                />
              </div>

              <div className="form-row-split">
                <div className="form-input-container">
                  <label>Subscription Tier</label>
                  <select 
                    value={newInvoice.tier}
                    onChange={(e) => setNewInvoice({ ...newInvoice, tier: e.target.value })}
                  >
                    <option value="Starter">Starter Plan</option>
                    <option value="Professional">Professional Plan</option>
                    <option value="Enterprise">Enterprise Plan</option>
                  </select>
                </div>

                <div className="form-input-container">
                  <label>Invoice Billing Amount (USD)</label>
                  <input 
                    type="number"
                    value={newInvoice.amount}
                    onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                    placeholder="e.g. 1500.00"
                    min="1"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="form-input-container">
                <label>Payment Terms (Net Days)</label>
                <select 
                  value={newInvoice.dueDays}
                  onChange={(e) => setNewInvoice({ ...newInvoice, dueDays: e.target.value })}
                >
                  <option value="7">Net 7 - Due in 7 Days</option>
                  <option value="14">Net 14 - Due in 14 Days</option>
                  <option value="30">Net 30 - Due in 30 Days</option>
                </select>
              </div>

              <div className="form-input-container">
                <label>Billing Description / Line Item Notes</label>
                <input 
                  type="text" 
                  value={newInvoice.description}
                  onChange={(e) => setNewInvoice({ ...newInvoice, description: e.target.value })}
                  placeholder="e.g. Platform monthly licensing fees (45 active users)"
                />
              </div>

              <div className="modal-footer-row">
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => setIsGenerateOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Generate & Publish Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterBilling;
