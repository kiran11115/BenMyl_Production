import React, { useState, useContext, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Plus, Download, Eye, EyeOff, Search, CheckCircle,
  Clock, XCircle, FileCheck, Users, ChevronUp, ChevronDown,
  PenTool, Upload, ShieldCheck, Building, User, Info, Calendar, DollarSign, Layers
} from 'lucide-react';
import { toast } from 'react-toastify';
import { ContractContext, mapApiContractToUI, formatDate } from './ContractContext';
import { useGetContractsByBenchsalesQuery } from '../../State-Management/Api/ContractApiSlice';
import ModuleHeader from "../Admin/Modules/ModuleHeader";
import { FiChevronDown, FiFileText, FiPlus, FiSearch } from "react-icons/fi";
import { Home } from "lucide-react";
import './contract.css';
import '../Admin/Modules/AdminDashboard/AdminDashboard.css';
import NoData from "../UploadTalent/NoData";
import jsPDF from 'jspdf';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, Filler);

const sparklineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { enabled: false } },
  scales: {
    x: { display: false },
    y: { display: false, min: 0 }
  },
  elements: {
    point: { radius: 0, hoverRadius: 0 }
  },
  layout: { padding: 0 }
};

const createSparklineData = (color, gradientStart, gradientEnd, dataPoints) => ({
  labels: dataPoints.map((_, i) => i),
  datasets: [{
    data: dataPoints,
    borderColor: color,
    borderWidth: 1.2,
    fill: true,
    backgroundColor: (context) => {
      const chart = context.chart;
      const { ctx, chartArea } = chart;
      if (!chartArea) return 'transparent';
      const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
      gradient.addColorStop(0, gradientStart);
      gradient.addColorStop(1, gradientEnd);
      return gradient;
    },
    tension: 0.4
  }]
});

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
  Closed: { cls: 'badge-closed', label: 'Closed', icon: <XCircle size={10} /> },
  Agreed: { cls: 'badge-accepted', label: 'Agreed', icon: <CheckCircle size={10} /> },
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

const StatCard = ({ icon, label, value, colorClass, statusText, statusClass, sparklineData }) => (
  <div className="stat-card">
    <div className="stat-card-header">
      <div className="stat-card-icon-title-container">
        <div className={`stat-card-icon-box ${colorClass}`}>
          {icon}
        </div>
        <div className="stat-card-title-number">
          <span className="stat-card-title">{label}</span>
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
            <span className="stat-card-number">{value}</span>
            {statusText && (
              <div className="stat-card-change">
                <span className={`stat-card-percentage ${statusClass}`}>{statusText}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    {sparklineData && (
      <div className="stat-card-sparkline">
        <Line options={sparklineOptions} data={sparklineData} />
      </div>
    )}
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
};/* =========================================
   MILESTONES & PROJECT PROGRESS COMPONENTS
   ========================================= */
const ConfirmModal = ({ title, message, confirmText = "Confirm", cancelText = "Cancel", onConfirm, onCancel }) => {
  return (
    <div className="custom-talent-alert-overlay">
      <div className="custom-talent-alert-card">
        <div className="custom-talent-alert-body-container">
          <div className="alert-graphic-wrapper">
            <svg width="48" height="48" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="30" fill="#fff7ed" stroke="#fed7aa" strokeWidth="2" />
              <path d="M32 18 L48 46 H16 Z" stroke="#ea580c" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M32 28 V38 M32 42 H32.01" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <h3 className="custom-talent-alert-title">
            {title}
          </h3>
          <p className="custom-talent-alert-message">
            {message}
          </p>
        </div>
        <div className="custom-talent-alert-actions-row">
          <button 
            type="button" 
            className="tbl-btn tbl-btn-status-change" 
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button 
            type="button" 
            className="btn-primary" 
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const MilestoneDetail = ({
  contract,
  progress,
  daysLeft,
  hoursLeft,
  minutesLeft,
  monday,
  friday,
  sunday,
  formatToExactDate,
  review,
  onReviewSubmit,
  extension,
  onExtensionSubmit,
  status,
  simulateCompleted,
  onToggleSimulation
}) => {
  const [rating, setRating] = useState(review?.rating || 5);
  const [comment, setComment] = useState(review?.comment || '');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedExtDate, setSelectedExtDate] = useState('');
  const [selectedExtReason, setSelectedExtReason] = useState('');
  const [confirmModal, setConfirmModal] = useState(null);

  // Reset local state when selected contract changes
  useEffect(() => {
    setRating(review?.rating || 5);
    setComment(comment => review?.comment || '');
    setShowDatePicker(false);
    setSelectedExtDate('');
    setSelectedExtReason('');
  }, [contract.id, review]);

  const StarRating = () => {
    return (
      <div className="star-rating-input">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`star-btn ${star <= rating ? 'filled' : ''}`}
            onClick={() => setRating(star)}
            disabled={!!review?.submitted}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.warning('Please enter feedback comment');
      return;
    }
    onReviewSubmit(rating, comment);
  };

  const isClosed = status === 'Closed';

  return (
    <div className="milestone-detail-card compact-text">
      <div className="detail-header-section">
        <div className="detail-title-wrapper">
          <h3 className="detail-title">{contract.contractTitle}</h3>
          <span className="detail-subtitle">Ref ID: {contract.id}</span>
        </div>
        <span className={`detail-status-badge ${status.toLowerCase()}`}>{status}</span>
      </div>

      <div className="detail-section-grid">
        <div className="detail-info-item">
          <span className="lbl">Designated Resource</span>
          <span className="val">{contract.candidateName}</span>
        </div>
        <div className="detail-info-item">
          <span className="lbl">Position / Role</span>
          <span className="val">{contract.jobTitle}</span>
        </div>
        <div className="detail-info-item">
          <span className="lbl">Client Organization</span>
          <span className="val">{contract.clientCompany}</span>
        </div>
        <div className="detail-info-item">
          <span className="lbl">Milestone Period</span>
          <span className="val font-semibold text-slate-700">{contract.startDate} to {contract.endDate}</span>
        </div>
      </div>

      <div className="detail-divider"></div>

      {/* Automated Progress Section */}
      <div className="detail-section">
        <h4 className="section-title">Automated Progress</h4>
        <p className="section-desc">Progress is calculated automatically relative to the weekly target deadline.</p>

        <div className="progress-automated-container">
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
          </div>
          
          <div className="progress-stat-row">
            <span className="progress-percentage-label">Current Progress: <strong className="text-orange">{progress}%</strong></span>
            <span className="progress-target-label">Target: {formatToExactDate(friday)}</span>
          </div>

          <div className="milestone-typo-days-left">
            {progress < 100 ? (
              <>
                Target deadline: <span className="days-left-highlight">{formatToExactDate(friday)}</span> • <span className="days-left-count">{daysLeft}d {hoursLeft}h {minutesLeft}m left</span> to achieve this week's milestone.
              </>
            ) : (
              <>
                Target deadline: <span className="days-left-highlight">{formatToExactDate(friday)}</span> reached. Progress is fully completed.
              </>
            )}
          </div>
        </div>

        {/* Change Status Action */}
        {!isClosed && (
          <div className="status-action-row mt-3">
            <span className="status-action-label">Need to change status for evaluation?</span>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                const targetState = simulateCompleted ? "In Progress" : "Completed";
                setConfirmModal({
                  title: "Confirm Status Change",
                  message: `Are you sure you want to change the status of this milestone to ${targetState}?`,
                  confirmText: "Change Status",
                  cancelText: "Cancel",
                  onConfirm: () => {
                    setConfirmModal(null);
                    onToggleSimulation();
                  }
                });
              }}
            >
              {simulateCompleted ? "Set to In Progress" : "Change Status to Completed"}
            </button>
          </div>
        )}
      </div>

      <div className="detail-divider"></div>

      {/* Rate Contract Section */}
      {progress === 100 ? (
        <div className="detail-section review-section-wrap">
          <h4 className="section-title">Rate Contract</h4>
          <p className="section-desc">Provide your service evaluation and feedback below to close the contract.</p>
          
          {review?.submitted || isClosed ? (
            <div className="review-submitted-card">
              <div className="submitted-header">
                <span className="badge-check">✓ Rated & Closed</span>
                <span className="stars-display">{'★'.repeat(review?.rating || rating)}{'☆'.repeat(5 - (review?.rating || rating))}</span>
              </div>
              <p className="submitted-comments">"{review?.comment || 'Completed successfully.'}"</p>
              <div className="contract-closed-notification alert alert-success mt-2">
                <strong>Closed:</strong> This contract has been officially closed.
              </div>
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="review-form">
              <div className="form-group mb-3">
                <label className="form-label d-block">Overall Deliverables Rating</label>
                <StarRating />
              </div>
              <div className="form-group mb-3">
                <label className="form-label">Review Summary & Evaluation Comments</label>
                <textarea
                  className="form-control feedback-textarea"
                  rows="3"
                  placeholder="Provide final evaluation comments..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn-primary w-100 py-2" style={{ fontSize: '11px' }}>
                Submit Rating & Close Contract
              </button>
            </form>
          )}
        </div>
      ) : (
        <div className="detail-section extension-section-wrap">
          <h4 className="section-title">Milestone Extension Request</h4>
          <p className="section-desc">If milestones cannot be met within the current week, Candidate Handler can raise an extension request.</p>

          {extension?.submitted ? (
            <div className="extension-submitted-card">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="badge-pending">Extension Requested</span>
                <span className="ext-date">{formatDate(extension.newDate)}</span>
              </div>
              <p className="ext-reason"><strong>Reason:</strong> {extension.reason}</p>
              <div className="ext-meta">Raised by: <strong>Candidate Handler</strong></div>
            </div>
          ) : showDatePicker ? (
            <div className="elegant-date-picker-wrap">
              <div className="form-group mb-2">
                <label className="form-label">Choose Extension Target Date</label>
                <input
                  type="date"
                  className="date-filter-input"
                  value={selectedExtDate}
                  min={new Date().toISOString().split('T')[0]} // Restricted to future dates
                  onChange={(e) => setSelectedExtDate(e.target.value)}
                />
              </div>
              <div className="form-group mb-2">
                <label className="form-label">Extension Justification Reason</label>
                <textarea
                  className="form-control feedback-textarea"
                  rows="2"
                  placeholder="Explain why the extension is required..."
                  value={selectedExtReason}
                  onChange={(e) => setSelectedExtReason(e.target.value)}
                />
              </div>
              <div className="date-input-filter-row">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    if (!selectedExtDate) {
                      toast.warning("Please choose a valid date.");
                      return;
                    }
                    if (!selectedExtReason.trim()) {
                      toast.warning("Please provide a reason for the extension request.");
                      return;
                    }
                    setConfirmModal({
                      title: "Confirm Extension Request",
                      message: `Are you sure you want to submit this extension request to ${selectedExtDate}?`,
                      confirmText: "Submit Request",
                      cancelText: "Cancel",
                      onConfirm: () => {
                        setConfirmModal(null);
                        onExtensionSubmit(selectedExtDate, selectedExtReason);
                        toast.success("Extension request submitted successfully!");
                        setShowDatePicker(false);
                      }
                    });
                  }}
                >
                  Confirm Request
                </button>
                <button
                  type="button"
                  className="tbl-btn tbl-btn-status-change"
                  onClick={() => setShowDatePicker(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="btn-primary"
              disabled={isClosed}
              onClick={() => setShowDatePicker(true)}
            >
              Request Extension
            </button>
          )}
        </div>
      )}
      {confirmModal && (
        <ConfirmModal
          title={confirmModal.title}
          message={confirmModal.message}
          confirmText={confirmModal.confirmText}
          cancelText={confirmModal.cancelText}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal(null)}
        />
      )}
    </div>
  );
};

const getWeekRangeData = () => {
  const today = new Date();
  const day = today.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  
  // Start date of week (Monday)
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);
  monday.setHours(9, 0, 0, 0); // Monday 9 AM

  // End date of work week (Target Deadline Date: Friday)
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);
  friday.setHours(17, 0, 0, 0); // Friday 5 PM

  // End of full week (Sunday)
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return { monday, friday, sunday };
};

const formatToExactDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${day}-${months[date.getMonth()]}-${date.getFullYear()}`;
};

const filterActiveWeekContracts = (contracts, monday, sunday) => {
  return contracts.filter(c => {
    if (c.status === 'Draft' || c.status === 'Rejected') return false;
    if (c.startDate && c.endDate && c.startDate !== '-' && c.endDate !== '-') {
      const start = new Date(c.startDate);
      const end = new Date(c.endDate);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
         return start <= sunday && end >= monday;
      }
    }
    return true; // Fallback for invalid dates
  });
};

const WeeklyMilestonesView = ({ contracts, progressMap, reviewMap, submitReview, extensionMap, submitExtension, statusOverrideMap }) => {
  const { monday, friday, sunday } = getWeekRangeData();
  const activeContracts = filterActiveWeekContracts(contracts, monday, sunday);
  const [selectedId, setSelectedId] = useState(activeContracts[0]?.id || null);
  const [simulatedCompletedMap, setSimulatedCompletedMap] = useState({});

  useEffect(() => {
    if (!selectedId && activeContracts.length > 0) {
      setSelectedId(activeContracts[0].id);
    }
  }, [activeContracts, selectedId]);

  const selectedContract = activeContracts.find(c => c.id === selectedId);

  const currentWeekStr = `${formatToExactDate(monday)} to ${formatToExactDate(sunday)}`;
  const currentFriday = formatToExactDate(friday);

  return (
    <div className="milestones-layout">
      {/* List Side */}
      <div className="milestones-list-panel">
        <div className="panel-header">
          <h4 className="panel-title"><Calendar size={14} color="#f5810c" /> Weekly Deliverables</h4>
          <span className="week-label">Exact Week: {currentWeekStr}</span>
        </div>
        <div className="milestones-list">
          {activeContracts.length === 0 ? (
            <NoData text="No active milestone contracts for this week." />
          ) : (
            activeContracts.map(c => {
              const isSimulated = !!simulatedCompletedMap[c.id];
              const isClosed = (statusOverrideMap[c.id] || c.status) === 'Closed';

              let progress = 0;
              if (isClosed || isSimulated) {
                progress = 100;
              } else {
                const totalTime = friday.getTime() - monday.getTime();
                const elapsedTime = new Date().getTime() - monday.getTime();

                if (new Date().getTime() >= friday.getTime()) {
                  progress = 100;
                } else if (new Date().getTime() <= monday.getTime()) {
                  progress = 0;
                } else {
                  progress = Math.min(99, Math.max(0, Math.floor((elapsedTime / totalTime) * 100)));
                }
              }

              let status = statusOverrideMap[c.id] || c.status;
              const bothSigned = !!c.benchSalesSignature && !!c.hiringManagerSignature;
              if (bothSigned && status === 'Completed') {
                status = 'Agreed';
              }
              const isSelected = c.id === selectedId;

              return (
                <div
                  key={c.id}
                  className={`milestone-list-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedId(c.id)}
                >
                  <div className="milestone-item-header">
                    <span className="milestone-item-id">{c.id}</span>
                    <span className={`milestone-item-status-tag ${status.toLowerCase()}`}>{status}</span>
                  </div>
                  <div className="milestone-item-title">{c.contractTitle}</div>
                  <div className="milestone-item-candidate">{c.candidateName} • {c.jobTitle}</div>
                  <div className="milestone-item-progress-bar-container">
                    <div className="milestone-item-progress-track">
                      <div className="milestone-item-progress-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                    <span className="milestone-item-progress-text">{progress}% Complete</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Detail Side */}
      <div className="milestones-detail-panel">
        {selectedContract ? (() => {
          const isSimulated = !!simulatedCompletedMap[selectedContract.id];
          const isClosed = (statusOverrideMap[selectedContract.id] || selectedContract.status) === 'Closed';
          
          let progress = 0;
          let daysLeft = 0;
          let hoursLeft = 0;
          let minutesLeft = 0;

          if (isClosed || isSimulated) {
            progress = 100;
            daysLeft = 0;
            hoursLeft = 0;
            minutesLeft = 0;
          } else {
            const today = new Date();
            const totalTime = friday.getTime() - monday.getTime();
            const elapsedTime = today.getTime() - monday.getTime();

            if (today.getTime() >= friday.getTime()) {
              progress = 100;
              daysLeft = 0;
              hoursLeft = 0;
              minutesLeft = 0;
            } else if (today.getTime() <= monday.getTime()) {
              progress = 0;
              daysLeft = 5;
              hoursLeft = 0;
              minutesLeft = 0;
            } else {
              progress = Math.min(99, Math.max(0, Math.floor((elapsedTime / totalTime) * 100)));
              const diffTime = friday.getTime() - today.getTime();
              daysLeft = Math.floor(diffTime / (1000 * 60 * 60 * 24));
              hoursLeft = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
              minutesLeft = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
            }
          }

          let status = statusOverrideMap[selectedContract.id] || selectedContract.status;
          const bothSigned = !!selectedContract.benchSalesSignature && !!selectedContract.hiringManagerSignature;
          if (bothSigned && status === 'Completed') {
            status = 'Agreed';
          }

          return (
            <MilestoneDetail
              contract={selectedContract}
              progress={progress}
              daysLeft={daysLeft}
              hoursLeft={hoursLeft}
              minutesLeft={minutesLeft}
              monday={monday}
              friday={friday}
              sunday={sunday}
              formatToExactDate={formatToExactDate}
              review={reviewMap[selectedContract.id]}
              onReviewSubmit={(rating, comment) => submitReview(selectedContract.id, rating, comment)}
              extension={extensionMap[selectedContract.id]}
              onExtensionSubmit={(newDate, reason) => submitExtension(selectedContract.id, newDate, reason)}
              status={status}
              simulateCompleted={isSimulated}
              onToggleSimulation={() => setSimulatedCompletedMap(prev => ({ ...prev, [selectedContract.id]: !prev[selectedContract.id] }))}
            />
          );
        })() : (
          <div className="milestone-detail-empty">
            <Info size={32} color="#94a3b8" />
            <p>Select a contract milestone to view details and track progress.</p>
          </div>
        )}
      </div>
    </div>
  );
};

/* =========================================
   DETAIL MODAL (Elegant Contract View)
   ========================================= */
const ContractForm = () => {
  const navigate = useNavigate();
  const { updateContract } = useContext(ContractContext);
  const [showMetrics, setShowMetrics] = useState(true);

  const sparklineData1 = useMemo(() => createSparklineData('#3b82f6', 'rgba(59, 130, 246, 0.15)', 'rgba(59, 130, 246, 0)', [10, 20, 15, 25, 20, 30]), []);
  const sparklineData2 = useMemo(() => createSparklineData('#f97316', 'rgba(249, 115, 22, 0.15)', 'rgba(249, 115, 22, 0)', [15, 18, 20, 22, 25, 28]), []);
  const sparklineData3 = useMemo(() => createSparklineData('#10b981', 'rgba(16, 185, 129, 0.15)', 'rgba(16, 185, 129, 0)', [20, 25, 28, 30, 35, 40]), []);
  const sparklineData4 = useMemo(() => createSparklineData('#8b5cf6', 'rgba(139, 92, 246, 0.15)', 'rgba(139, 92, 246, 0)', [10, 15, 20, 25, 22, 30]), []);

  const userId = localStorage.getItem("CompanyId");
  const { data: apiResponse, isLoading } = useGetContractsByBenchsalesQuery(userId, {
    skip: !userId,
    refetchOnMountOrArgChange: true,
  });

  const contracts = useMemo(() => {
    const dataArray = apiResponse?.data || apiResponse;
    if (dataArray && Array.isArray(dataArray)) {
      return dataArray.map(mapApiContractToUI).filter(Boolean);
    }
    return [];
  }, [apiResponse]);

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isDownloading, setIsDownloading] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'createdDate', direction: 'desc' });

  const [activeTab, setActiveTab] = useState('all');

  // Milestone tracking states persisted in localStorage
  // Milestone tracking states
  const [progressMap, setProgressMap] = useState({});
  const [reviewMap, setReviewMap] = useState({});
  const [extensionMap, setExtensionMap] = useState({});
  const [statusOverrideMap, setStatusOverrideMap] = useState({});

  const updateProgress = (id, value) => {
    const next = { ...progressMap, [id]: value };
    setProgressMap(next);
  };

  const submitReview = (id, rating, comment) => {
    const nextReview = { ...reviewMap, [id]: { rating, comment, submitted: true } };
    setReviewMap(nextReview);

    const nextStatus = { ...statusOverrideMap, [id]: 'Closed' };
    setStatusOverrideMap(nextStatus);
  };

  const submitExtension = (id, newDate, reason) => {
    const next = { ...extensionMap, [id]: { newDate, reason, submitted: true, status: 'Pending' } };
    setExtensionMap(next);
  };

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
  if (sortConfig.key === "createdDate") {
    const dateA = new Date(a.createdDate);
    const dateB = new Date(b.createdDate);

    return sortConfig.direction === "asc"
      ? dateA - dateB
      : dateB - dateA;
  }

  if (a[sortConfig.key] < b[sortConfig.key]) {
    return sortConfig.direction === "asc" ? -1 : 1;
  }

  if (a[sortConfig.key] > b[sortConfig.key]) {
    return sortConfig.direction === "asc" ? 1 : -1;
  }

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
      benchSalesDate: new Date().toLocaleDateString("en-CA")
    };
    updateContract(updated);
    toast.success('🎉 Contract Accepted!');
  };

  const handleDownload = async (contract) => {
    setIsDownloading(contract.id);
    try {
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const W = doc.internal.pageSize.getWidth();
      const H = doc.internal.pageSize.getHeight();
      let y = 50;

      // Helper to fetch and convert any image URL/path to base64 (supporting CORS)
      const getBase64Image = async (url) => {
        if (!url) return null;
        if (url.startsWith('data:')) return url;

        let targetUrl = url;
        if (url.startsWith('/')) {
          targetUrl = `https://webapidev.benmyl.com${url}`;
        }

        try {
          const response = await fetch(targetUrl, { mode: 'cors' });
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const blob = await response.blob();
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        } catch (e) {
          console.warn(`Failed to fetch image from ${targetUrl}:`, e);
          return null;
        }
      };

      // Prefetch signatures before drawing PDF elements
      let hmSigBase64 = null;
      if (contract.hiringManagerSignature) {
        hmSigBase64 = await getBase64Image(contract.hiringManagerSignature);
      }

      let bsSigBase64 = null;
      if (contract.benchSalesSignature) {
        bsSigBase64 = await getBase64Image(contract.benchSalesSignature);
      }

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
      field('Vendor Company (Bench Side)', contract.companyName || '-', W / 2);
      y += 35;

      section('Engagement Details');
      field('Contract Title', contract.contractTitle); field('Job Title', contract.jobTitle, W / 2); y += 35;
      field('Candidate Name', contract.candidateName); field('Employment Type', contract.employmentType, W / 2); y += 35;
      field('Work Location', contract.workLocation); field('Engagement Start', contract.startDate, W / 2); y += 45;

      section('Terms and Conditions');
      doc.setTextColor(71, 85, 105); doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
      const lines = doc.splitTextToSize(contract.termsAndConditions || '', W - 100);
      doc.text(lines, 50, y);
      y += lines.length * 13 + 30;

      if (y > H - 150) { doc.addPage(); y = 50; }
      section('Digital Signatures & Acceptance');
      const sigY = y + 20;
      doc.setDrawColor(226, 232, 240); doc.line(50, sigY + 50, W / 2 - 20, sigY + 50); doc.line(W / 2 + 20, sigY + 50, W - 50, sigY + 50);
      doc.setFontSize(8); doc.setTextColor(148, 163, 184);
      doc.text('Hiring Side Authorized Signatory', 50, sigY + 62); doc.text('Vendor Side Authorized Signatory', W / 2 + 20, sigY + 62);

      // Draw hiring manager signature safely
      if (hmSigBase64) {
        try {
          doc.addImage(hmSigBase64, 'PNG', 50, sigY - 10, 150, 50);
        } catch (err) {
          console.warn("Error drawing hiring manager signature in PDF:", err);
          doc.setFont('helvetica', 'italic'); doc.setFontSize(8); doc.setTextColor(148, 163, 184);
          doc.text('[HM Signature Draw Failed]', 50, sigY + 20);
        }
      } else if (contract.hiringManagerSignature) {
        doc.setFont('helvetica', 'italic'); doc.setFontSize(8); doc.setTextColor(148, 163, 184);
        doc.text('[HM Signature Image Unavailable]', 50, sigY + 20);
      }

      // Draw bench sales signature safely
      if (bsSigBase64) {
        try {
          doc.addImage(bsSigBase64, 'PNG', W / 2 + 20, sigY - 10, 150, 50);
        } catch (err) {
          console.warn("Error drawing bench sales signature in PDF:", err);
          doc.setFont('helvetica', 'italic'); doc.setFontSize(8); doc.setTextColor(148, 163, 184);
          doc.text('[BS Signature Draw Failed]', W / 2 + 20, sigY + 20);
        }
      } else if (contract.benchSalesSignature) {
        doc.setFont('helvetica', 'italic'); doc.setFontSize(8); doc.setTextColor(148, 163, 184);
        doc.text('[BS Signature Image Unavailable]', W / 2 + 20, sigY + 20);
      }

      doc.setTextColor(203, 213, 225); doc.setFontSize(7); doc.text(`E-SIGNATURE TRACE ID: ${contract.id}-SECURE | IP LOGGED`, 40, H - 30);

      doc.save(`Contract_${contract.id}.pdf`);
      toast.success('PDF generated.');
    } catch (err) {
      console.error("PDF generation global failure:", err);
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
      <div className="hero-section-wrapper mb-4">
        <div className="hero-card ">
          <div className="hero-concentric-lines"></div>
          <div className="hero-ripple-pattern"></div>
          <div className="hero-circular-highlights"></div>
                  <div className="hero-left">
                    <div className="hero-pill">
                              ✦ Contract Management
                            </div>
                  <h1 className="job-posting-title text-white">Manage Contract Lifecycle</h1>
                  
                   
                  <div className="job-posting-header-info">
                  
                  <p className="job-posting-subtitle">
                   Showing contracts based on your interactive filters
                  </p>
                  </div>
                  </div>
                   
                  <div className="hero-card-actions-wrapper">
                    <button
                      className="routine-btn"
                      style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.3)', backdropFilter: 'blur(4px)' }}
                      onClick={() => setShowMetrics(!showMetrics)}
                    >
                      {showMetrics ? <EyeOff size={16} /> : <Eye size={16} />}
                      {showMetrics ? 'Hide Metrics' : 'Show Metrics'}
                    </button>
                    <button
                      className="routine-btn"
                      onClick={() => navigate(`${basePath}/contract-create`)}
                    >
                      <FiPlus size={16} />
                      New Work Order
                    </button>
                  </div>
                            <div className="hero-illustration">
            <div className="hero-particles">
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
            </div>
            <img src="/Images/contract.png" alt="Dashboard Illustration" className="hero-svg-image" />
          </div>
        </div>
      </div>
      {/* <ModuleHeader
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
      /> */}

      <div className={`contract-stats-grid-wrapper ${showMetrics ? 'show' : 'hide'}`}>
        <div className="contract-stats-grid">
          <StatCard icon={<Building size={18} />} label="Total Agreements" value={stats.total} colorClass="stat-blue" statusText="Active" statusClass="stat-text-blue" sparklineData={sparklineData1} />
          <StatCard icon={<Clock size={18} />} label="Pending Review" value={stats.active} colorClass="stat-orange" statusText="Pending" statusClass="stat-text-orange" sparklineData={sparklineData2} />
          <StatCard icon={<FileCheck size={18} />} label="Fully Executed" value={stats.completed} colorClass="stat-green" statusText="Completed" statusClass="stat-text-green" sparklineData={sparklineData3} />
          <StatCard icon={<ShieldCheck size={18} />} label="Compliance Status" value="100%" colorClass="stat-purple" statusText="Optimal" statusClass="stat-text-purple" sparklineData={sparklineData4} />
        </div>
      </div>

      <div className="elegant-tabs-container mb-4">
        <button
          className={`tab-item tab-item-users ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          <Layers size={13} className="tab-icon" />
          <span>All Contracts</span>
          <span className="tab-badge">{contracts.length}</span>
        </button>
        <button
          className={`tab-item tab-item-users ${activeTab === 'milestones' ? 'active' : ''}`}
          onClick={() => setActiveTab('milestones')}
        >
          <Calendar size={13} className="tab-icon" />
          <span>Weekly Milestones</span>
          <span className="tab-badge orange-badge">
            {filterActiveWeekContracts(contracts, getWeekRangeData().monday, getWeekRangeData().sunday).length}
          </span>
        </button>
      </div>

      {activeTab === 'all' ? (
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
                {isLoading ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '40px 0' }}>
                      <div className="contract-spinner" style={{ width: 24, height: 24, margin: '0 auto 12px' }} />
                      <span style={{ fontSize: 13, color: '#64748b' }}>Loading legal documents...</span>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '40px 0' }}>
                      <NoData text="No legal documents found." />
                    </td>
                  </tr>
                ) : (
                  filtered.map(c => {
                    const sigStatus = !!c.benchSalesSignature && !!c.hiringManagerSignature ? 'complete' : 'partial';
                    const sigCfg = SIG_STATUS[sigStatus];
                    let currentStatus = statusOverrideMap[c.id] || c.status;
                    if (sigStatus === 'complete' && currentStatus === 'Completed') {
                      currentStatus = 'Agreed';
                    }
                    return (
                      <tr key={c.id}>
                        <td><span className="contract-id">{c.id}</span></td>
                        <td><div style={{ fontWeight: 700, color: '#1e293b' }}>{c.contractTitle}</div><div style={{ fontSize: 10, color: '#64748b' }}>{c.clientCompany} → {c.companyName || 'BenMyl'}</div></td>
                        <td><div className="d-flex align-items-center gap-2"><User size={12} color="#64748b" /> {c.candidateName}</div></td>
                        <td><ContractBadge status={currentStatus} /></td>
                        <td style={{ color: '#64748b', fontSize: 12 }}>{c.createdDate}</td>
                        <td><span className={`contract-badge ${sigCfg.cls}`}><span className="badge-dot" />{sigCfg.label}</span></td>
                        <td>
                          <div className="d-flex gap-2 justify-content-center">
                            <button className="tbl-btn tbl-btn-view" onClick={() => navigate(`${basePath}/contract-view/${c.id}`)}>
                              <Eye size={12} /> {String(c.createdBy) === String(userId) ? 'View' : 'View & Sign'}
                            </button>
                            <button className="tbl-btn tbl-btn-download" onClick={() => handleDownload(c)} disabled={isDownloading === c.id}>
                              {isDownloading === c.id ? <div className="contract-spinner" style={{ width: 10, height: 10 }} /> : <Download size={12} />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <WeeklyMilestonesView
          contracts={contracts}
          progressMap={progressMap}
          reviewMap={reviewMap}
          submitReview={submitReview}
          extensionMap={extensionMap}
          submitExtension={submitExtension}
          statusOverrideMap={statusOverrideMap}
        />
      )}
    </div>
  );
};

export default ContractForm;
