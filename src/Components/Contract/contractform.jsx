import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Plus, Download, Eye, Search, CheckCircle,
  Clock, XCircle, FileCheck, Users, ChevronUp, ChevronDown,
  PenTool, Upload, ShieldCheck, Building, User, Info, Calendar, DollarSign
} from 'lucide-react';
import { toast } from 'react-toastify';
import { ContractContext } from './ContractContext';
import ModuleHeader from "../Admin/Modules/ModuleHeader";
import { FiFileText, FiPlus, FiSearch } from "react-icons/fi";
import { Home } from "lucide-react";
import './contract.css';

/* =========================================
   COMPONENTS
   ========================================= */

const STATUS_CONFIG = {
  Draft: { cls: 'badge-draft', label: 'Draft', icon: <FileText size={10} /> },
  Pending: { cls: 'badge-pending', label: 'Pending', icon: <Clock size={10} /> },
  Shared: { cls: 'badge-shared', label: 'Shared', icon: <Users size={10} /> },
  Accepted: { cls: 'badge-accepted', label: 'Accepted', icon: <CheckCircle size={10} /> },
  Rejected: { cls: 'badge-rejected', label: 'Rejected', icon: <XCircle size={10} /> },
  Completed: { cls: 'badge-completed', label: 'Completed', icon: <FileCheck size={10} /> },
};

const SIG_STATUS = {
  none: { cls: 'badge-draft', label: '- Not Signed' },
  partial: { cls: 'badge-pending', label: '⟳ HM Signed' },
  complete: { cls: 'badge-accepted', label: '✓ Both Signed' },
};

const ContractBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Draft;
  return (
    <span className={`contract-badge ${cfg.cls}`}>
      <span className="badge-dot" />
      {cfg.label}
    </span>
  );
};

const StatCard = ({ icon, label, value, colorClass }) => (
  <div className={`stat-card ${colorClass}`}>
    <div className="stat-content">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
    </div>
    <div className="stat-icon-box">{icon}</div>
  </div>
);

/* =========================================
   SIGNATURE COMPONENT (for Bench Sales Acceptance)
   ========================================= */
const SignatureSection = ({ onComplete, onCancel }) => {
  const [type, setType] = useState('draw');
  const [data, setData] = useState(null);
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    if (type === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#1e293b';
    }
  }, [type]);

  const startDrawing = (e) => {
    isDrawing.current = true;
    draw(e);
  };

  const stopDrawing = () => {
    isDrawing.current = false;
    const canvas = canvasRef.current;
    setData(canvas.toDataURL());
  };

  const draw = (e) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    setData(null);
  };

  return (
    <div className="acceptance-signature-box" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20, marginTop: 16 }}>
      <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
        <PenTool size={16} color="#f5810c" /> Complete Bench Sales Acceptance
      </h4>
      <p style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>
        By signing, your company accepts all terms in this Work Order for <strong>Company-to-Company</strong> services.
      </p>

      <div className="sig-tabs" style={{ marginBottom: 12 }}>
        <button className={`sig-tab ${type === 'draw' ? 'active' : ''}`} onClick={() => setType('draw')}>Draw</button>
        <button className={`sig-tab ${type === 'upload' ? 'active' : ''}`} onClick={() => setType('upload')}>Upload</button>
      </div>

      {type === 'draw' ? (
        <div className="sig-canvas-wrapper" style={{ height: 140, position: 'relative' }}>
          <canvas ref={canvasRef} width={600} height={140} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseOut={stopDrawing} onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing} style={{ width: '100%', height: '100%', cursor: 'crosshair' }} />
          {!data && <div className="sig-canvas-placeholder" style={{ fontSize: 11 }}>Sign here...</div>}
          <button className="btn-secondary" style={{ position: 'absolute', right: 8, bottom: 8, padding: '2px 8px', fontSize: 10 }} onClick={clear}>Clear</button>
        </div>
      ) : (
        <div className="sig-canvas-wrapper" style={{ height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
          {data ? <img src={data} alt="Sig" style={{ maxHeight: 100 }} /> : <Upload size={24} color="#cbd5e1" />}
          <input type="file" id="bs-sig-up" hidden onChange={(e) => {
            const f = e.target.files[0];
            if (f) { const r = new FileReader(); r.onloadend = () => setData(r.result); r.readAsDataURL(f); }
          }} />
          <label htmlFor="bs-sig-up" className="btn-secondary" style={{ fontSize: 11, padding: '4px 10px', cursor: 'pointer' }}>Select Image</label>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <button className="btn-primary" style={{ flex: 1, fontSize: 13 }} onClick={() => onComplete(data)}>Accept & Sign Agreement</button>
        <button className="btn-secondary" style={{ fontSize: 13 }} onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

/* =========================================
   DETAIL MODAL (Elegant Contract View)
   ========================================= */
const ContractForm = () => {
  const navigate = useNavigate();
  const { contracts, updateContract } = useContext(ContractContext);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isDownloading, setIsDownloading] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'createdDate', direction: 'desc' });

  const role = localStorage.getItem('Role') || 'Benchsales';
  const isBenchsales = role === 'Benchsales';
  const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/User';

  // Sorting Logic
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const sortedContracts = [...contracts].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filtered = sortedContracts.filter(c => {
    const matchSearch = !search ||
      c.contractTitle?.toLowerCase().includes(search.toLowerCase()) ||
      c.candidateName?.toLowerCase().includes(search.toLowerCase()) ||
      c.jobTitle?.toLowerCase().includes(search.toLowerCase()) ||
      c.id?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: contracts.length,
    draft: contracts.filter(c => c.status === 'Draft').length,
    active: contracts.filter(c => ['Pending', 'Shared'].includes(c.status)).length,
    completed: contracts.filter(c => c.status === 'Completed').length,
  };

  const handleAccept = (id) => {
    // Basic accept from table if needed, otherwise view first
    const c = contracts.find(x => x.id === id);
    if (!c) return;
    const updated = {
      ...c,
      benchSalesAccepted: true,
      status: 'Completed',
      benchSalesDate: new Date().toISOString().split('T')[0]
    };
    updateContract(updated);
    toast.success('🎉 Contract Accepted!');
  };

  const handleDownload = async (contract) => {
    setIsDownloading(contract.id);
    try {
      const { default: jsPDF } = await import('jspdf');
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const W = doc.internal.pageSize.getWidth();
      const H = doc.internal.pageSize.getHeight();
      let y = 50;

      doc.setFillColor(30, 41, 59); doc.rect(0, 0, W, 70, 'F');
      doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(22); doc.text('BenMyl', 40, 42);
      doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.text('PROFESSIONAL WORK ORDER AGREEMENT', 40, 58);
      doc.setFontSize(9); doc.setTextColor(245, 129, 12); doc.text(`REF ID: ${contract.id}`, W - 40, 42, { align: 'right' });
      doc.setTextColor(255, 255, 255); doc.text(`ISSUED ON: ${contract.createdDate}`, W - 40, 58, { align: 'right' });

      y = 100;
      const section = (title) => {
        doc.setFillColor(248, 250, 252); doc.rect(40, y - 5, W - 80, 20, 'F');
        doc.setTextColor(30, 41, 59); doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.text(title.toUpperCase(), 50, y + 9);
        y += 30;
      };

      const field = (label, value, xOffset = 0) => {
        doc.setTextColor(148, 163, 184); doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.text(label.toUpperCase(), 50 + xOffset, y);
        doc.setTextColor(30, 41, 59); doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.text(String(value || '-'), 50 + xOffset, y + 14);
      };

      section('Entity Information (Company-to-Company)');
      field('Client Company (Hiring Side)', contract.clientCompany);
      field('Vendor Company (Bench Side)', contract.companyName || 'BenMyl Staffing', W / 2);
      y += 35;

      section('Engagement Details');
      field('Contract Title', contract.contractTitle); field('Job Title', contract.jobTitle, W / 2); y += 35;
      field('Candidate Name', contract.candidateName); field('Employment Type', contract.employmentType, W / 2); y += 35;
      field('Work Location', contract.workLocation); field('Engagement Start', contract.startDate, W / 2); y += 45;

      section('Terms and Conditions');
      doc.setTextColor(71, 85, 105); doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
      const lines = doc.splitTextToSize(contract.termsAndConditions, W - 100);
      doc.text(lines, 50, y);
      y += lines.length * 13 + 30;

      if (y > H - 150) { doc.addPage(); y = 50; }
      section('Digital Signatures & Acceptance');
      const sigY = y + 20;
      doc.setDrawColor(226, 232, 240); doc.line(50, sigY + 50, W / 2 - 20, sigY + 50); doc.line(W / 2 + 20, sigY + 50, W - 50, sigY + 50);
      doc.setFontSize(8); doc.setTextColor(148, 163, 184);
      doc.text('Hiring Side Authorized Signatory', 50, sigY + 62); doc.text('Vendor Side Authorized Signatory', W / 2 + 20, sigY + 62);

      if (contract.hiringManagerSignature) doc.addImage(contract.hiringManagerSignature, 'PNG', 50, sigY - 10, 150, 50);
      if (contract.benchSalesSignature) doc.addImage(contract.benchSalesSignature, 'PNG', W / 2 + 20, sigY - 10, 150, 50);

      doc.setTextColor(203, 213, 225); doc.setFontSize(7); doc.text(`E-SIGNATURE TRACE ID: ${contract.id}-SECURE | IP LOGGED`, 40, H - 30);

      doc.save(`Contract_${contract.id}.pdf`);
      toast.success('PDF generated.');
    } catch (err) {
      console.error(err);
      toast.error('PDF failed.');
    } finally {
      setIsDownloading(null);
    }
  };

  const SortIcon = ({ col }) => {
    if (sortConfig.key !== col) return <ChevronDown size={12} style={{ opacity: 0.3 }} />;
    return sortConfig.direction === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
  };

  return (
    <div className="contract-page">
      <ModuleHeader
        breadcrumb="C2C Contracts"
        title="Contract Management"
        description="Manage Company-to-Company Work Orders and E-Signatures"
        badgeText="Legal Management"
        icon={FiFileText}
        customBreadcrumbs={[
          { label: "Dashboard", path: basePath === '/Admin' ? '/Admin/overview-dashboard' : '/user/user-dashboard', icon: <Home size={14} /> }
        ]}
        actions={role === 'Benchsales' ? [] : [
          {
            label: "New Work Order",
            icon: <FiPlus size={16} />,
            type: "primary",
            onClick: () => navigate(`${basePath}/contract-create`)
          }
        ]}
      />

      <div className="contract-stats-grid">
        <StatCard icon={<Building size={20} />} label="Total Agreements" value={stats.total} colorClass="card-blue" />
        <StatCard icon={<Clock size={20} />} label="Pending Review" value={stats.active} colorClass="card-yellow" />
        <StatCard icon={<FileCheck size={20} />} label="Fully Executed" value={stats.completed} colorClass="card-green" />
        <StatCard icon={<ShieldCheck size={20} />} label="Compliance Status" value="100%" colorClass="card-purple" />
      </div>

      <div className="contract-table-wrapper">
        <div className="contract-table-header">
          <div className="contract-table-title"><ShieldCheck size={16} color="#f5810c" /> Legal Documents Vault</div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div className="contract-search-bar"><Search size={14} color="#94a3b8" /><input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} /></div>
          </div>
        </div>

        <div className="contract-table-scroll">
          <table className="contract-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>Ref ID <SortIcon col="id" /></th>
                <th onClick={() => handleSort('contractTitle')} style={{ cursor: 'pointer' }}>Agreement Title <SortIcon col="contractTitle" /></th>
                <th onClick={() => handleSort('candidateName')} style={{ cursor: 'pointer' }}>Candidate <SortIcon col="candidateName" /></th>
                <th>Status</th>
                <th onClick={() => handleSort('createdDate')} style={{ cursor: 'pointer' }}>Created <SortIcon col="createdDate" /></th>
                <th>Execution</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => {
                const sigStatus = !!c.benchSalesSignature && !!c.hiringManagerSignature ? 'complete' : 'partial';
                const sigCfg = SIG_STATUS[sigStatus];
                return (
                  <tr key={c.id}>
                    <td><span className="contract-id">{c.id}</span></td>
                    <td><div style={{ fontWeight: 700, color: '#1e293b' }}>{c.contractTitle}</div><div style={{ fontSize: 10, color: '#64748b' }}>{c.clientCompany} → {c.companyName || 'BenMyl'}</div></td>
                    <td><div className="d-flex align-items-center gap-2"><User size={12} color="#64748b" /> {c.candidateName}</div></td>
                    <td><ContractBadge status={c.status} /></td>
                    <td style={{ color: '#64748b', fontSize: 12 }}>{c.createdDate}</td>
                    <td><span className={`contract-badge ${sigCfg.cls}`}><span className="badge-dot" />{sigCfg.label}</span></td>
                    <td>
                      <div className="d-flex gap-2 justify-content-center">
                        <button className="tbl-btn tbl-btn-view" onClick={() => navigate(`${basePath}/contract-view/${c.id}`)}>
                          <Eye size={12} /> View & Sign
                        </button>
                        <button className="tbl-btn tbl-btn-download" onClick={() => handleDownload(c)} disabled={isDownloading === c.id}>
                          {isDownloading === c.id ? <div className="contract-spinner" style={{ width: 10, height: 10 }} /> : <Download size={12} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContractForm;
