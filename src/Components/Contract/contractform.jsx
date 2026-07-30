import React, { useState, useContext, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Plus, Download, Eye, EyeOff, Search, CheckCircle,
  Clock, XCircle, FileCheck, Users, ChevronUp, ChevronDown,
  PenTool, Upload, ShieldCheck, Building, User, Info, Calendar, DollarSign, Layers,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { toast } from 'react-toastify';
import { ContractContext, mapApiContractToUI, formatDate } from './ContractContext';
import {
  useGetContractsByBenchsalesQuery,
  useRequestExtensionMutation,
  useGetExtensionRequestsQuery,
  useApproveExtensionMutation,
  useSaveRatingAndReviewMutation,
  useGetRatingAndReviewQuery,
} from '../../State-Management/Api/ContractApiSlice';
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
        <PenTool size={16} color="#1e293b" /> Complete Bench Sales Acceptance
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
  onExtensionAccept,
  onExtensionReject,
  status,
  simulateCompleted,
  onToggleSimulation
}) => {
  const contractIdForQuery = contract?.contractID || contract?.id;
  const { data: ratingApiResponse, isLoading: isLoadingRating } = useGetRatingAndReviewQuery(contractIdForQuery, {
    skip: !contractIdForQuery,
  });

  const fetchedReviewObj = useMemo(() => {
    const rawData = ratingApiResponse?.data || ratingApiResponse;
    let item = null;
    if (Array.isArray(rawData) && rawData.length > 0) {
      item = rawData[0];
    } else if (rawData && typeof rawData === 'object' && !Array.isArray(rawData) && (rawData.overallRating !== undefined || rawData.ratingReviewID !== undefined)) {
      item = rawData;
    }

    if (item && (item.overallRating !== undefined || item.reviewComments !== undefined)) {
      return {
        rating: Number(item.overallRating) || 0,
        comment: item.reviewComments || '',
        submitted: true,
        reviewerRole: item.reviewerRole,
        reviewDate: item.reviewDate,
        ratingReviewID: item.ratingReviewID,
      };
    }
    return null;
  }, [ratingApiResponse]);

  const effectiveReview = review?.submitted ? review : (fetchedReviewObj || review);

  const [rating, setRating] = useState(effectiveReview?.rating || 5);
  const [comment, setComment] = useState(effectiveReview?.comment || '');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedExtDate, setSelectedExtDate] = useState('');
  const [selectedExtReason, setSelectedExtReason] = useState('');
  const [confirmModal, setConfirmModal] = useState(null);

  // Reset local state when selected contract or effective review changes
  useEffect(() => {
    setRating(effectiveReview?.rating !== undefined ? effectiveReview.rating : 5);
    setComment(effectiveReview?.comment !== undefined ? effectiveReview.comment : '');
    setShowDatePicker(false);
    setSelectedExtDate('');
    setSelectedExtReason('');
  }, [contract?.id, effectiveReview?.rating, effectiveReview?.comment, effectiveReview?.submitted]);

  const StarRating = () => {
    const starsArray = [1, 2, 3, 4, 5];
    return (
      <div className="star-rating-input" style={{ display: 'flex', gap: '6px' }}>
        {starsArray.map((starIdx) => {
          const isFull = starIdx <= rating;
          const isHalf = (starIdx - 0.5) === rating;
          
          return (
            <div 
              key={starIdx} 
              style={{ 
                position: 'relative', 
                display: 'inline-block', 
                fontSize: '24px', 
                cursor: effectiveReview?.submitted ? 'default' : 'pointer',
                userSelect: 'none'
              }}
            >
              {/* Background grey star */}
              <span style={{ color: '#e2e8f0' }}>★</span>
              
              {/* Highlighted yellow star */}
              {(isFull || isHalf) && (
                <span 
                  style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    width: isFull ? '100%' : '50%', 
                    overflow: 'hidden', 
                    color: '#eab308' 
                  }}
                >
                  ★
                </span>
              )}
              
              {/* Left and Right half invisible click areas (if not submitted) */}
              {!effectiveReview?.submitted && (
                <>
                  <div 
                    style={{ position: 'absolute', top: 0, left: 0, width: '50%', height: '100%', zIndex: 2 }} 
                    onClick={() => setRating(starIdx - 0.5)}
                  />
                  <div 
                    style={{ position: 'absolute', top: 0, left: '50%', width: '50%', height: '100%', zIndex: 2 }} 
                    onClick={() => setRating(starIdx)}
                  />
                </>
              )}
            </div>
          );
        })}
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
            <span className="progress-target-label">Target: {contract.endDate}</span>
          </div>

          <div className="milestone-typo-days-left">
            {progress < 100 ? (
              <>
                Target deadline: <span className="days-left-highlight">{contract.endDate}</span> • <span className="days-left-count">{daysLeft}d {hoursLeft}h {minutesLeft}m left</span> to achieve milestone.
              </>
            ) : (
              <>
                Target deadline: <span className="days-left-highlight">{contract.endDate}</span> reached. Progress is fully completed.
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
      {(progress === 100 || effectiveReview?.submitted || isClosed) && (
        <div className="detail-section review-section-wrap">
          <h4 className="section-title">Talent Evaluation & Feedback</h4>
          {(() => {
            const currentUserId = localStorage.getItem('CompanyId');
            const role = localStorage.getItem('Role') || 'Benchsales';
            const isBenchsales = role === 'Benchsales';
            const isCreator = (contract?.createdBy && currentUserId)
              ? String(contract.createdBy) === String(currentUserId)
              : !isBenchsales;

            if (isLoadingRating) {
              return (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '13px', padding: '12px 0' }}>
                  <div className="contract-spinner" style={{ width: 16, height: 16 }} />
                  <span>Loading rating & evaluation feedback...</span>
                </div>
              );
            }

            if (isCreator) {
              // Contract Creator (Hiring Manager / Client)
              if (effectiveReview?.submitted || isClosed) {
                return (
                  <div className="review-submitted-card">
                    <div className="submitted-header">
                      <span className="badge-check">✓ Rated & Closed</span>
                      {renderStars(effectiveReview?.rating || rating)}
                    </div>
                    <p className="submitted-comments">"{effectiveReview?.comment || comment || 'Completed successfully.'}"</p>
                    <div className="contract-closed-notification alert alert-success mt-2">
                      <strong>Closed:</strong> You have closed this contract and submitted evaluation feedback.
                    </div>
                  </div>
                );
              } else {
                return (
                  <form onSubmit={handleReviewSubmit} className="review-form">
                    <p className="section-desc">Provide your service evaluation and feedback below to close the contract.</p>
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
                );
              }
            } else {
              // Talent Provider / Benchsales (Read-Only)
              if (effectiveReview?.submitted || isClosed) {
                return (
                  <div className="review-submitted-card">
                    <div className="submitted-header">
                      <span className="badge-check">✓ Received Client Rating</span>
                      {renderStars(effectiveReview?.rating || rating)}
                    </div>
                    <p className="submitted-comments">"{effectiveReview?.comment || comment || 'Completed successfully.'}"</p>
                    <div className="contract-closed-notification alert alert-success mt-2" style={{ background: '#eff6ff', color: '#1e3a8a', borderColor: '#bfdbfe' }}>
                      <strong>Evaluation Feedback Received:</strong> The client has rated and successfully closed this contract.
                    </div>
                  </div>
                );
              } else {
                return (
                  <p className="section-desc" style={{ fontStyle: 'italic', margin: 0 }}>
                    Awaiting final evaluation rating and feedback from the client/contract creator.
                  </p>
                );
              }
            }
          })()}
        </div>
      )}

      {/* Milestone Extension Request Section */}
      {!(effectiveReview?.submitted || isClosed) && (
      <div className="detail-section extension-section-wrap">
        <h4 className="section-title">Milestone Extension Request</h4>
        {(() => {
          const role = localStorage.getItem('Role') || 'Benchsales';
          const userId = localStorage.getItem('CompanyId');
          const isAccepted = extension?.status === 'Accepted' || extension?.status === 'Approved';
          const isRejected = extension?.status === 'Rejected';
          const isPending = extension?.status === 'Pending';

          const renderRequestForm = () => (
            <div className="mt-3" style={{ borderTop: (isAccepted || isRejected) ? '1px solid #e2e8f0' : 'none', paddingTop: (isAccepted || isRejected) ? '16px' : '0' }}>
              <p className="section-desc">If milestones cannot be met within the target week, you can raise an extension request.</p>
              {showDatePicker ? (
                <div className="elegant-date-picker-wrap" style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
                  <div className="form-group mb-2">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', fontSize: '11px', color: '#475569' }}>
                      <Calendar size={13} color="#ea580c" /> CHOOSE EXTENSION TARGET DATE
                    </label>
                    <input
                      type="date"
                      className="date-filter-input"
                      value={selectedExtDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setSelectedExtDate(e.target.value)}
                    />
                  </div>
                  <div className="form-group mb-2">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', fontSize: '11px', color: '#475569' }}>
                      <Info size={13} color="#ea580c" /> EXTENSION JUSTIFICATION REASON
                    </label>
                    <textarea
                      className="form-control feedback-textarea"
                      rows="2"
                      placeholder="Explain why the extension is required..."
                      value={selectedExtReason}
                      onChange={(e) => setSelectedExtReason(e.target.value)}
                    />
                  </div>
                  <div className="date-input-filter-row" style={{ marginTop: '6px' }}>
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
                            onExtensionSubmit(selectedExtDate, selectedExtReason, role);
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
          );

          if (extension?.submitted) {
            // isRequester: true if the current user raised this request
            const isRequester = extension.requestedBy != null
              ? String(extension.requestedBy) === String(userId)
              : role === 'Benchsales';

            if (isRequester) {
              return (
                <>
                  <div className="extension-submitted-card" style={{ borderLeft: isAccepted ? '4px solid #16a34a' : isRejected ? '4px solid #ef4444' : '4px solid #ea580c' }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className={isAccepted ? "badge-check" : isRejected ? "badge-rejected" : "badge-pending"}>
                        {isAccepted ? "Extension Approved" : isRejected ? "Extension Rejected" : "Extension Requested"}
                      </span>
                      <span className="ext-date">{formatDate(extension.newDate)}</span>
                    </div>
                    <p className="ext-reason"><strong>Reason:</strong> {extension.reason}</p>
                    <div className="ext-meta">Status: <strong>{isAccepted ? "Approved" : isRejected ? "Rejected" : "Pending Review by " + (role === 'Benchsales' ? "Client" : "Talent Provider")}</strong></div>
                  </div>
                  {renderRequestForm()}
                </>
              );
            } else {
              return (
                <>
                  <div className="extension-submitted-card" style={{ borderLeft: isAccepted ? '4px solid #16a34a' : isRejected ? '4px solid #ef4444' : '4px solid #ea580c' }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className={isAccepted ? "badge-check" : isRejected ? "badge-rejected" : "badge-pending"}>
                        {isAccepted ? "Extension Approved" : isRejected ? "Extension Rejected" : "Extension Received"}
                      </span>
                      <span className="ext-date">{formatDate(extension.newDate)}</span>
                    </div>
                    <p className="ext-reason"><strong>Reason:</strong> {extension.reason}</p>
                    <div className="ext-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                      <span>Raised by: <strong>{role === 'Benchsales' ? "Client" : "Candidate Handler"}</strong></span>
                      {isPending && (
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className="btn-primary"
                            onClick={() => {
                              setConfirmModal({
                                title: "Accept Extension",
                                message: `Accept the extension request to ${formatDate(extension.newDate)}?`,
                                confirmText: "Accept",
                                cancelText: "Cancel",
                                onConfirm: () => {
                                  setConfirmModal(null);
                                  onExtensionAccept();
                                }
                              });
                            }}
                          >
                            Accept Extension
                          </button>
                          <button
                            type="button"
                            className="tbl-btn tbl-btn-status-change"
                            style={{ borderColor: '#ef4444', color: '#ef4444', margin: 0 }}
                            onClick={() => {
                              setConfirmModal({
                                title: "Reject Extension",
                                message: `Reject the extension request to ${formatDate(extension.newDate)}?`,
                                confirmText: "Reject",
                                cancelText: "Cancel",
                                onConfirm: () => {
                                  setConfirmModal(null);
                                  onExtensionReject();
                                }
                              });
                            }}
                          >
                            Reject Extension
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  {renderRequestForm()}
                </>
              );
            }
          } else {
            return renderRequestForm();
          }
        })()}
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
    if (c.endDate && c.endDate !== '-') {
      const end = new Date(c.endDate);
      if (!isNaN(end.getTime())) {
         return end >= monday && end <= sunday;
      }
    }
    return false;
  });
};

const parseDateSafely = (dateStr) => {
  if (!dateStr || dateStr === '-') return null;
  const cleanStr = dateStr.replace(/\//g, '-');
  const parts = cleanStr.split('-');
  if (parts.length === 3) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthIdx = months.indexOf(parts[1]);
    if (monthIdx !== -1) {
      const day = parseInt(parts[0], 10);
      const year = parseInt(parts[2], 10);
      return new Date(year, monthIdx, day);
    }
    if (parts[0].length === 4) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    if (parts[2].length === 4) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
  }
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? null : parsed;
};

const getNextUpcomingDate = (parsedContracts) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const futureContracts = parsedContracts.filter(c => {
    if (!c.parsedEndDate) return false;
    const end = new Date(c.parsedEndDate);
    end.setHours(0, 0, 0, 0);
    return end >= today;
  });
  
  if (futureContracts.length === 0) return null;
  
  const sorted = [...futureContracts].sort((a, b) => a.parsedEndDate - b.parsedEndDate);
  return sorted[0].parsedEndDate;
};

const calculateDateProgress = (startDateStr, endDateObj) => {
  const startObj = parseDateSafely(startDateStr);
  const endObj = endDateObj instanceof Date ? endDateObj : parseDateSafely(endDateObj);
  
  if (!startObj || !endObj) return 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  startObj.setHours(0, 0, 0, 0);
  endObj.setHours(0, 0, 0, 0);
  
  const totalTime = endObj.getTime() - startObj.getTime();
  const elapsedTime = today.getTime() - startObj.getTime();
  
  if (totalTime <= 0) return 100;
  if (elapsedTime <= 0) return 0;
  if (today.getTime() >= endObj.getTime()) return 100;
  
  return Math.min(100, Math.max(0, Math.floor((elapsedTime / totalTime) * 100)));
};

const getDaysHoursMinutesLeft = (endDateObj) => {
  const endObj = endDateObj instanceof Date ? endDateObj : parseDateSafely(endDateObj);
  if (!endObj) return { days: 0, hours: 0, minutes: 0 };
  
  const today = new Date();
  const diffTime = endObj.getTime() - today.getTime();
  if (diffTime <= 0) {
    return { days: 0, hours: 0, minutes: 0 };
  }
  
  const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
  return { days, hours, minutes };
};

const renderStars = (ratingValue) => {
  const stars = [];
  const fullStars = Math.floor(ratingValue);
  const hasHalf = ratingValue % 1 !== 0;
  
  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<span key={i} style={{ color: '#eab308' }}>★</span>);
    } else if (i === fullStars + 1 && hasHalf) {
      stars.push(
        <span key={i} style={{ position: 'relative', display: 'inline-block', color: '#e2e8f0' }}>
          <span style={{ color: '#e2e8f0' }}>★</span>
          <span style={{ position: 'absolute', top: 0, left: 0, width: '50%', overflow: 'hidden', color: '#eab308' }}>
            ★
          </span>
        </span>
      );
    } else {
      stars.push(<span key={i} style={{ color: '#e2e8f0' }}>★</span>);
    }
  }
  return <div style={{ display: 'flex', gap: '3px', fontSize: '16px' }}>{stars}</div>;
};

const getFunctionalStatus = (contract, statusOverride, isSimulated, progressValue) => {
  if (statusOverride === 'Completed' || contract.status === 'Completed') {
    return 'Completed';
  }
  if (statusOverride === 'Closed' || contract.status === 'Closed') {
    return 'Closed';
  }
  if (progressValue === 100 || isSimulated) {
    return 'Completed';
  }
  return statusOverride || contract.status;
};

/* =========================================
   PROJECT END DATE CALENDAR VIEWS
   ========================================= */
function ContractCalendarWidget({ navDate, selectedDate, onDateSelect, isContractEndDate, onPrev, onNext }) {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

  const month = navDate.getMonth();
  const year = navDate.getFullYear();
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = daysInMonth(month, year);

  const blanks = Array(firstDay).fill(null);
  const days = Array.from({ length: totalDays }, (_, i) => i + 1);

  return (
    <div className="custom-calendar">
      <div className="calendar-header">
        <h3>{monthNames[month]} {year}</h3>
        <div className="cal-nav">
          <button onClick={onPrev} type="button">
            <ChevronLeft size={16} />
          </button>
          <button onClick={onNext} type="button">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <div className="calendar-weekdays">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => <div key={d}>{d}</div>)}
      </div>
      <div className="calendar-days">
        {blanks.map((_, i) => <div key={`b-${i}`} className="day blank"></div>)}
        {days.map(d => {
          const todayDate = new Date();
          todayDate.setHours(0, 0, 0, 0);
          const currentIterDate = new Date(year, month, d);

          const isToday = todayDate.toDateString() === currentIterDate.toDateString();
          const isSelected = selectedDate && selectedDate.getDate() === d && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
          const hasEndDate = isContractEndDate(d, month, year);

          return (
            <div
              key={d}
              className={`day ${isSelected ? "selected" : ""} ${hasEndDate ? "has-interview" : ""} ${isToday ? "today" : ""}`}
              onClick={() => {
                const newDate = new Date(year, month, d);
                if (selectedDate && selectedDate.toDateString() === newDate.toDateString()) {
                  onDateSelect(null);
                } else {
                  onDateSelect(newDate);
                }
              }}
            >
              {d}
            </div>
          );
        })}
      </div>
      <div className="calendar-legend">
        <div className="legend-item">
          <span className="dot interview-dot"></span>
          <span>Contract End Date</span>
        </div>
      </div>
    </div>
  );
}

const CalendarContractCard = ({ c, navigate, basePath, statusOverrideMap, extensionMap, submitExtension }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedExtDate, setSelectedExtDate] = useState('');
  const [selectedExtReason, setSelectedExtReason] = useState('');
  const [confirmModal, setConfirmModal] = useState(null);

  let displayStatus = (statusOverrideMap && statusOverrideMap[c.id]) || c.status;
  if (displayStatus === 'Completed') {
    displayStatus = 'Agreed';
  }

  // Progress calculation matching WeeklyMilestonesView logic
  const { monday, friday } = getWeekRangeData();
  const isClosed = displayStatus === 'Closed';
  let progress = 0;
  if (isClosed) {
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

  const role = localStorage.getItem('Role') || 'Benchsales';
  const userId = localStorage.getItem('CompanyId');
  const extension = extensionMap && extensionMap[c.id];
  const isAccepted = extension?.status === 'Accepted' || extension?.status === 'Approved';
  const isRejected = extension?.status === 'Rejected';
  const isPending = extension?.status === 'Pending';
  // isRequester: true if the current user raised this request
  const isRequester = extension?.requestedBy != null
    ? String(extension.requestedBy) === String(userId)
    : role === 'Benchsales';

  const renderCardRequestForm = () => {
    if (showDatePicker) {
      return (
        <div className="elegant-date-picker-wrap" style={{ gap: '6px', marginTop: '6px' }}>
          <div className="form-group mb-1">
            <label className="form-label" style={{ fontSize: '10px' }}>Extension Target Date</label>
            <input
              type="date"
              className="date-filter-input"
              style={{ fontSize: '11px', padding: '4px 8px' }}
              value={selectedExtDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setSelectedExtDate(e.target.value)}
            />
          </div>
          <div className="form-group mb-1">
            <label className="form-label" style={{ fontSize: '10px' }}>Reason</label>
            <textarea
              className="form-control feedback-textarea"
              style={{ fontSize: '11px', padding: '4px 8px' }}
              rows="2"
              placeholder="Explain reason for extension..."
              value={selectedExtReason}
              onChange={(e) => setSelectedExtReason(e.target.value)}
            />
          </div>
          <div className="date-input-filter-row" style={{ marginTop: '8px', gap: '6px' }}>
            <button
              type="button"
              className="btn-primary"
              style={{ fontSize: '10px', padding: '4px 10px' }}
              onClick={() => {
                if (!selectedExtDate) {
                  toast.warning("Please choose a date.");
                  return;
                }
                if (!selectedExtReason.trim()) {
                  toast.warning("Please provide a reason.");
                  return;
                }
                setConfirmModal({
                  title: "Confirm Extension Request",
                  message: `Submit extension request to ${selectedExtDate}?`,
                  confirmText: "Submit",
                  cancelText: "Cancel",
                  onConfirm: () => {
                    setConfirmModal(null);
                    submitExtension(c.id, selectedExtDate, selectedExtReason);
                    toast.success("Extension request submitted!");
                    setShowDatePicker(false);
                  }
                });
              }}
            >
              Confirm
            </button>
            <button
              type="button"
              className="tbl-btn tbl-btn-status-change"
              style={{ fontSize: '10px', padding: '4px 10px' }}
              onClick={() => setShowDatePicker(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }

    return (
      <button
        type="button"
        className="btn-primary"
        style={{ width: '100%', fontSize: '10px', padding: '4px 10px', marginTop: '6px' }}
        onClick={() => setShowDatePicker(true)}
      >
        Request Extension
      </button>
    );
  };

  return (
    <div
      className="milestone-list-item"
      style={{ cursor: 'default', background: '#fff', border: '1px solid #e2e8f0', gap: '10px' }}
    >
      <div className="milestone-item-header">
        <span className="milestone-item-id">{c.id}</span>
        <span className={`milestone-item-status-tag ${displayStatus.toLowerCase()}`}>{displayStatus}</span>
      </div>
      <div className="milestone-item-title" style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>{c.contractTitle}</div>
      <div className="milestone-item-candidate">{c.candidateName} • {c.jobTitle}</div>
      
      <div className="milestone-item-progress-bar-container" style={{ margin: '4px 0 8px' }}>
        <div className="milestone-item-progress-track">
          <div className="milestone-item-progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <span className="milestone-item-progress-text">{progress}% Complete</span>
      </div>

      {/* Extension request option */}
      {progress < 100 && (
        <div className="extension-section-wrap" style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #f1f5f9', marginTop: '4px' }}>
          {extension?.submitted ? (
            <>
              <div className="extension-submitted-card" style={{ padding: 0, background: 'none', border: 'none', boxShadow: 'none' }}>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className={isAccepted ? "badge-check" : isRejected ? "badge-rejected" : "badge-pending"} style={{ fontSize: '10px', padding: '2px 6px' }}>
                    {isAccepted ? "Extension Approved" : isRejected ? "Extension Rejected" : isRequester ? "Extension Requested" : "Extension Received"}
                  </span>
                  <span className="ext-date" style={{ fontSize: '10px', fontWeight: '600' }}>{formatDate(extension.newDate)}</span>
                </div>
                <p className="ext-reason" style={{ fontSize: '10px', margin: '4px 0 0 0' }}><strong>Reason:</strong> {extension.reason}</p>
              </div>
              {renderCardRequestForm()}
            </>
          ) : (
            renderCardRequestForm()
          )}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
        <span style={{ fontSize: '11px', color: '#64748b' }}>Client: <strong>{c.clientCompany}</strong></span>
        <button
          className="tbl-btn tbl-btn-view"
          style={{ padding: '4px 10px', fontSize: '11px' }}
          type="button"
          onClick={() => navigate(`${basePath}/contract-view/${c.id}`)}
        >
          View Details
        </button>
      </div>

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

const CalendarView = ({
  contracts,
  navigate,
  basePath,
  statusOverrideMap,
  extensionMap,
  submitExtension,
  acceptExtension,
  rejectExtension,
  progressMap,
  reviewMap,
  submitReview
}) => {
  const [navDate, setNavDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [simulatedCompletedMap, setSimulatedCompletedMap] = useState({});

  // Parse project end dates safely supporting DD-MMM-YYYY and ISO format, filtering only agreed contracts
  const parsedContracts = useMemo(() => {
    return contracts.map(c => {
      return {
        ...c,
        parsedEndDate: parseDateSafely(c.endDate)
      };
    })
    .filter(c => c.parsedEndDate !== null)
    .filter(c => !!c.benchSalesSignature && !!c.hiringManagerSignature);
  }, [contracts]);

  const isContractEndDate = (day, month, year) => {
    return parsedContracts.some(c =>
      c.parsedEndDate.getDate() === day &&
      c.parsedEndDate.getMonth() === month &&
      c.parsedEndDate.getFullYear() === year
    );
  };

  const handlePrevMonth = () => {
    setNavDate(new Date(navDate.getFullYear(), navDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setNavDate(new Date(navDate.getFullYear(), navDate.getMonth() + 1, 1));
  };

  const { monday, friday, sunday } = getWeekRangeData();

  // Get displayed contracts: filter by calendar date if selected, otherwise show upcoming milestones for a single date
  const displayedContracts = useMemo(() => {
    if (selectedDate) {
      return parsedContracts.filter(c =>
        c.parsedEndDate.getDate() === selectedDate.getDate() &&
        c.parsedEndDate.getMonth() === selectedDate.getMonth() &&
        c.parsedEndDate.getFullYear() === selectedDate.getFullYear()
      );
    } else {
      const nextUpcomingDateObj = getNextUpcomingDate(parsedContracts);
      if (nextUpcomingDateObj) {
        return parsedContracts.filter(c =>
          c.parsedEndDate.getDate() === nextUpcomingDateObj.getDate() &&
          c.parsedEndDate.getMonth() === nextUpcomingDateObj.getMonth() &&
          c.parsedEndDate.getFullYear() === nextUpcomingDateObj.getFullYear()
        );
      }
      return [];
    }
  }, [contracts, selectedDate, parsedContracts]);

  // Handle auto-selection when the displayed contracts change
  useEffect(() => {
    if (displayedContracts.length > 0) {
      if (!displayedContracts.some(c => c.id === selectedId)) {
        setSelectedId(displayedContracts[0].id);
      }
    } else {
      setSelectedId(null);
    }
  }, [displayedContracts, selectedId]);

  const selectedContract = parsedContracts.find(c => c.id === selectedId);

  return (
    <div className="milestones-layout">
      {/* Calendar & List Side */}
      <div className="milestones-list-panel" style={{ height: '760px' }}>
        <div className="panel-header" style={{ marginBottom: '12px' }}>
          <h4 className="panel-title">
            <Calendar size={14} color="#1e293b" /> Contract End Dates & Milestones
          </h4>
        </div>
        
        {/* Calendar Widget */}
        <div style={{ padding: '0 4px', marginBottom: '16px' }}>
          <ContractCalendarWidget
            navDate={navDate}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            isContractEndDate={isContractEndDate}
            onPrev={handlePrevMonth}
            onNext={handleNextMonth}
          />
        </div>

        {/* Dynamic List Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', padding: '0 4px' }}>
          <span className="week-label" style={{ fontWeight: '700', color: '#1e293b', fontSize: '13px' }}>
            {selectedDate ? (
              `Ending: ${selectedDate.getDate()}-${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][selectedDate.getMonth()]}-${selectedDate.getFullYear()}`
            ) : (
              (() => {
                const nextUpcoming = getNextUpcomingDate(parsedContracts);
                if (nextUpcoming) {
                  return `Upcoming Milestones: ${nextUpcoming.getDate()}-${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][nextUpcoming.getMonth()]}-${nextUpcoming.getFullYear()}`;
                }
                return "Upcoming Milestones";
              })()
            )}
          </span>
          {selectedDate && (
            <button
              style={{ 
                fontSize: '11px', 
                padding: '4px 10px', 
                background: '#fffbeb', 
                border: '1px solid #fed7aa', 
                borderRadius: '6px',
                color: '#ea580c', 
                cursor: 'pointer', 
                fontWeight: '700',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                margin: 0
              }}
              onClick={() => setSelectedDate(null)}
              type="button"
            >
              Reset
            </button>
          )}
        </div>

        {/* Scrollable list of contract cards */}
        <div className="milestones-list" style={{ overflowY: 'auto', flex: 1 }}>
          {displayedContracts.length === 0 ? (
            <NoData text={selectedDate ? "No contracts ending on this date." : "No active milestone contracts."} />
          ) : (
            displayedContracts.map(c => {
              const isSimulated = !!simulatedCompletedMap[c.id];
              const ext = extensionMap[c.id];
              let endDateObj = c.parsedEndDate;
              if (ext && ext.status === 'Accepted') {
                endDateObj = parseDateSafely(ext.newDate) || c.parsedEndDate;
              }
              const progress = calculateDateProgress(c.startDate, endDateObj);
              const status = getFunctionalStatus(c, statusOverrideMap[c.id], isSimulated, progress);
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

      {/* Details Side */}
      <div className="milestones-detail-panel" style={{ height: '760px', overflowY: 'auto' }}>
        {selectedContract ? (() => {
          const isSimulated = !!simulatedCompletedMap[selectedContract.id];
          const ext = extensionMap[selectedContract.id];
          let endDateObj = selectedContract.parsedEndDate;
          if (ext && ext.status === 'Accepted') {
            endDateObj = parseDateSafely(ext.newDate) || selectedContract.parsedEndDate;
          }
          const progress = calculateDateProgress(selectedContract.startDate, endDateObj);
          const status = getFunctionalStatus(selectedContract, statusOverrideMap[selectedContract.id], isSimulated, progress);
          const { days, hours, minutes } = getDaysHoursMinutesLeft(endDateObj);
          const daysLeft = progress === 100 ? 0 : days;
          const hoursLeft = progress === 100 ? 0 : hours;
          const minutesLeft = progress === 100 ? 0 : minutes;

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
              onReviewSubmit={(rating, comment) => submitReview(selectedContract.id, rating, comment, selectedContract)}
              extension={extensionMap[selectedContract.id]}
              onExtensionSubmit={(newDate, reason, requestedBy) => submitExtension(selectedContract.id, newDate, reason, requestedBy)}
              onExtensionAccept={() => acceptExtension(selectedContract.id)}
              onExtensionReject={() => rejectExtension(selectedContract.id)}
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
  const [requestExtension, { isLoadingextension }] =
  useRequestExtensionMutation();
  const [saveRatingAndReview] = useSaveRatingAndReviewMutation();

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

  // Milestone tracking states
  const [progressMap, setProgressMap] = useState({});
  const [reviewMap, setReviewMap] = useState({});
  const [statusOverrideMap, setStatusOverrideMap] = useState({});

  const role = localStorage.getItem('Role') || 'Benchsales';
  const { data: extensionRequests } = useGetExtensionRequestsQuery(userId, {
    skip: !userId,
  });

  const extensionMap = useMemo(() => {
    const map = {};
    if (extensionRequests && Array.isArray(extensionRequests)) {
      extensionRequests.forEach(req => {
        const contractId = String(req.ContractID || req.contractID || '');
        if (contractId) {
          map[contractId] = {
            requestID: req.RequestID || req.requestID,
            newDate: req.RequestedEndDate ? req.RequestedEndDate.split('T')[0] : '',
            reason: req.ExtensionReason || req.extensionReason,
            submitted: true,
            status: req.RequestStatus || req.requestStatus,
            requestedBy: req.RequestedBy ?? req.requestedBy ?? null,
          };
        }
      });
    }
    return map;
  }, [extensionRequests, role]);

  const [approveExtension] = useApproveExtensionMutation();

  const handleApproveRejectExtension = async (contractId, status) => {
    try {
      const ext = extensionMap[contractId];
      if (!ext || !ext.requestID) {
        toast.error("Extension request ID not found.");
        return;
      }

      const payload = {
        requestID: Number(ext.requestID),
        status: status, // "Approved" or "Rejected"
        approvedBy: Number(userId),
        remarks: status === "Approved" ? "Extension request approved" : "Extension request rejected",
      };

      const response = await approveExtension(payload).unwrap();
      toast.success(response?.message || `Extension request ${status.toLowerCase()} successfully!`);
    } catch (error) {
      console.error(error);
      toast.error(
        error?.data?.message || `Failed to update extension status.`
      );
    }
  };

  const updateProgress = (id, value) => {
    const next = { ...progressMap, [id]: value };
    setProgressMap(next);
  };

  const submitReview = async (id, rating, comment, contract) => {
    try {
      const role = localStorage.getItem('Role') || 'Benchsales';
      const reviewedBy = Number(localStorage.getItem('CompanyId')) || 0;

      const payload = {
        ratingReviewID: 0,
        contractID: Number(contract?.contractID || id) || 0,
        jobID: Number(contract?.jobID) || 0,
        candidateID: Number(contract?.candidateID) || 0,
        overallRating: rating,
        reviewComments: comment,
        reviewedBy: reviewedBy,
        reviewerRole: role,
        reviewDate: new Date().toISOString(),
      };

      const response = await saveRatingAndReview(payload).unwrap();
      toast.success(response?.message || 'Rating & review submitted successfully!');

      const nextReview = { ...reviewMap, [id]: { rating, comment, submitted: true } };
      setReviewMap(nextReview);

      const nextStatus = { ...statusOverrideMap, [id]: 'Completed' };
      setStatusOverrideMap(nextStatus);
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || 'Failed to submit rating & review.');
    }
  };

  const submitExtension = async (contractId, newDate, reason) => {
  try {
    const payload = {
      contractID: Number(contractId),
      requestedEndDate: new Date(newDate).toISOString(),
      extensionReason: reason,
      requestedBy: userId,
    };

    const response = await requestExtension(payload).unwrap();

    toast.success(response?.message || "Extension request submitted.");
  } catch (error) {
    console.error(error);
    toast.error(
      error?.data?.message || "Failed to submit extension request."
    );
  }
};

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
      let y = 40;

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
      // Prefetch signatures and logo before drawing PDF elements
      let logoBase64 = await getBase64Image('/Images/Benmyl White logo.png');

      let hmSigBase64 = null;
      if (contract.hiringManagerSignature) {
        hmSigBase64 = await getBase64Image(contract.hiringManagerSignature);
      }

      let bsSigBase64 = null;
      if (contract.benchSalesSignature) {
        bsSigBase64 = await getBase64Image(contract.benchSalesSignature);
      }

      // Draw watermark in background
      doc.setTextColor(241, 245, 249); doc.setFont('helvetica', 'bold'); doc.setFontSize(72);
      doc.text('BENMYL SECURED', W / 2, H / 2 + 50, { align: 'center', angle: 45 });

      // Draw Preamble Header (Client vs Vendor Organization)
      doc.setTextColor(148, 163, 184); doc.setFont('helvetica', 'bold'); doc.setFontSize(8);
      doc.text('CREATOR ORGANIZATION', 40, y);
      doc.text('VENDOR ORGANIZATION', W - 40, y, { align: 'right' });
      y += 14;

      doc.setTextColor(30, 41, 59); doc.setFontSize(13);
      doc.text(contract.clientCompany || '-', 40, y);
      doc.setTextColor(30, 41, 59);
      doc.text(contract.companyName && contract.companyName !== '-' ? contract.companyName : 'BenMyl', W - 40, y, { align: 'right' });
      y += 20;

      // Divider Line
      doc.setDrawColor(30, 41, 59); doc.setLineWidth(2);
      doc.line(40, y, W - 40, y);
      y += 20;

      // Title Strip
      doc.setFillColor(30, 41, 59); doc.rect(40, y, W - 80, 24, 'F');
      doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
      if (logoBase64) {
        try {
          doc.addImage(logoBase64, 'PNG', 48, y + 4, 45, 16);
          doc.text('C2C STAFFING WORK ORDER AGREEMENT', (W + 45) / 2, y + 15, { align: 'center' });
        } catch (err) {
          console.warn("Logo drawing failed:", err);
          doc.text('C2C STAFFING WORK ORDER AGREEMENT', W / 2, y + 15, { align: 'center' });
        }
      } else {
        doc.text('C2C STAFFING WORK ORDER AGREEMENT', W / 2, y + 15, { align: 'center' });
      }
      y += 38;

      // Preamble Text
      doc.setTextColor(51, 65, 85); doc.setFont('helvetica', 'oblique'); doc.setFontSize(8.5);
      const preambleText = `This C2C Staffing Work Order ("Work Order") is effective as of ${contract.startDate} ("Effective Date"), and is entered into by and between ${contract.clientCompany} ("Client" or "Hiring Side") and ${contract.companyName && contract.companyName !== '-' ? contract.companyName : 'BenMyl'} ("Vendor" or "Bench Side"). This Work Order governs the professional services provided by the designated Resource outlined in the table below.`;
      const preambleLines = doc.splitTextToSize(preambleText, W - 80);
      doc.text(preambleLines, 40, y);
      y += preambleLines.length * 12 + 18;

      // Schedule A Table Title
      doc.setTextColor(30, 41, 59); doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
      doc.text('SCHEDULE A: STATEMENT OF WORK & FINANCIAL TERMS', 40, y);
      y += 8;

      // Draw Schedule A Table
      const tableRows = [
        ['Designated Resource (Consultant)', contract.candidateName],
        ['Project Position / Role', contract.jobTitle],
        ['Employment Terms / Type', `${contract.employmentType} (Company-to-Company)`],
        ['Project Location', contract.workLocation],
        ['Commencement Date', contract.startDate],
        ['Project End Date (Target)', contract.endDate],
        ['Hourly Billing Rate', contract.salary],
        ['Remittance Cycle', contract.paymentCycle],
        ['Reporting Manager', contract.reportingManager],
        ['Termination Notice Period', contract.noticePeriod],
      ];

      const rowHeight = 15;
      const col1Width = 180;
      const col2Width = W - 80 - col1Width;
      const tableHeight = tableRows.length * rowHeight;

      // Outer border
      doc.setDrawColor(203, 213, 225); doc.setLineWidth(1);
      doc.rect(40, y, W - 80, tableHeight);
      // Column dividing line
      doc.line(40 + col1Width, y, 40 + col1Width, y + tableHeight);

      let currentY = y;
      tableRows.forEach(([label, value], idx) => {
        // Alternating fill for labels
        doc.setFillColor(248, 250, 252);
        doc.rect(41, currentY + 1, col1Width - 1, rowHeight - 2, 'F');

        // Draw text
        doc.setTextColor(30, 41, 59); doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5);
        doc.text(label, 48, currentY + 11);
        doc.setFont('helvetica', 'normal');
        if (label === 'Hourly Billing Rate') {
          doc.setTextColor(22, 163, 74); doc.setFont('helvetica', 'bold');
        }
        doc.text(String(value || '-'), 40 + col1Width + 10, currentY + 11);

        currentY += rowHeight;
        if (idx < tableRows.length - 1) {
          doc.line(40, currentY, W - 40, currentY);
        }
      });
      y += tableHeight + 20;

      // Section 1: Terms & Conditions
      if (contract.termsAndConditions) {
        doc.setTextColor(30, 41, 59); doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5);
        doc.text('SECTION 1: TERMS & CONDITIONS', 40, y);
        y += 8;

        const termsLines = doc.splitTextToSize(contract.termsAndConditions, W - 80 - 24);
        const boxHeight = termsLines.length * 12 + 16;

        // Background
        doc.setFillColor(248, 250, 252);
        doc.rect(40, y, W - 80, boxHeight, 'F');

        // Left Accent Border (Slate #1e293b)
        doc.setFillColor(30, 41, 59);
        doc.rect(40, y, 4, boxHeight, 'F');

        // Text
        doc.setTextColor(71, 85, 105); doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5);
        doc.text(termsLines, 56, y + 14, { lineHeightFactor: 1.4 });

        y += boxHeight + 16;
      }

      // Section 2: Confidentiality & Non-Disclosure
      if (contract.confidentialityClause) {
        doc.setTextColor(30, 41, 59); doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5);
        doc.text('SECTION 2: CONFIDENTIALITY & NON-DISCLOSURE', 40, y);
        y += 8;

        const confLines = doc.splitTextToSize(contract.confidentialityClause, W - 80 - 24);
        const boxHeight = confLines.length * 12 + 16;

        // Background
        doc.setFillColor(248, 250, 252);
        doc.rect(40, y, W - 80, boxHeight, 'F');

        // Left Accent Border (Slate #1e293b)
        doc.setFillColor(30, 41, 59);
        doc.rect(40, y, 4, boxHeight, 'F');

        // Text
        doc.setTextColor(71, 85, 105); doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5);
        doc.text(confLines, 56, y + 14, { lineHeightFactor: 1.4 });

        y += boxHeight + 16;
      }

      // Signatures
      if (y > H - 140) {
        doc.addPage();
        y = 40;

        doc.setTextColor(241, 245, 249); doc.setFont('helvetica', 'bold'); doc.setFontSize(72);
        doc.text('BENMYL SECURED', W / 2, H / 2 + 50, { align: 'center', angle: 45 });
      }

      doc.setTextColor(148, 163, 184); doc.setFont('helvetica', 'bold'); doc.setFontSize(8);
      doc.text('AUTHORIZED SIGNATORY (HIRING SIDE)', 40, y);
      doc.text('AUTHORIZED SIGNATORY (VENDOR SIDE)', W / 2 + 20, y);
      y += 8;

      const sigY = y;
      // Draw HM Signature
      if (hmSigBase64) {
        try {
          doc.addImage(hmSigBase64, 'PNG', 40, sigY, 140, 35);
        } catch (err) {
          console.warn("HM Signature drawing failed:", err);
        }
      }
      // Draw BS Signature
      if (bsSigBase64) {
        try {
          doc.addImage(bsSigBase64, 'PNG', W / 2 + 20, sigY, 140, 35);
        } catch (err) {
          console.warn("BS Signature drawing failed:", err);
        }
      }
      y += 40;

      doc.setDrawColor(30, 41, 59); doc.setLineWidth(1);
      doc.line(40, y, W / 2 - 20, y);
      doc.line(W / 2 + 20, y, W - 40, y);
      y += 12;

      doc.setTextColor(30, 41, 59); doc.setFont('helvetica', 'bold'); doc.setFontSize(9);
      doc.text(contract.hiringManagerUser, 40, y);
      doc.text(contract.benchSalesUser, W / 2 + 20, y);
      y += 12;

      doc.setTextColor(148, 163, 184); doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
      doc.text('Authorized Client Representative', 40, y);
      doc.text('Authorized Vendor Representative', W / 2 + 20, y);

      // Footer
      doc.setTextColor(203, 213, 225); doc.setFontSize(7);
      doc.text(`DIGITAL DOCUMENT REF: ${contract.id}-SECURE-VERIFIED | COMPLIANT DOCUMENT`, 40, H - 30);
      doc.text('PAGE 1 OF 1', W - 40, H - 30, { align: 'right' });

      doc.save(`Legal_Contract_${contract.id}.pdf`);
      toast.success('Professional PDF exported successfully.');
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
          className={`tab-item tab-item-users ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          <Calendar size={13} className="tab-icon" />
          <span>Milestones & Calendar</span>
        </button>
      </div>

      {activeTab === 'all' && (
        <div className="contract-table-wrapper">
          <div className="contract-table-header">
            <div className="contract-table-title"><ShieldCheck size={16} color="#1e293b" /> Legal Documents Vault</div>
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
                              <Eye size={12} /> {String(c.createdBy) === String(userId) || sigStatus === 'complete' ? 'View' : 'View & Sign'}
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
      )}
      {activeTab === 'calendar' && (
        <CalendarView
          contracts={contracts}
          navigate={navigate}
          basePath={basePath}
          statusOverrideMap={statusOverrideMap}
          extensionMap={extensionMap}
          submitExtension={submitExtension}
          acceptExtension={(id) => handleApproveRejectExtension(id, "Approved")}
          rejectExtension={(id) => handleApproveRejectExtension(id, "Rejected")}
          progressMap={progressMap}
          reviewMap={reviewMap}
          submitReview={submitReview}
        />
      )}
    </div>
  );
};

export default ContractForm;
