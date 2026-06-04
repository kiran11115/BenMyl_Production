import React, { useState, useContext, useRef, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FileText, ArrowLeft, Download, CheckCircle,
  XCircle, PenTool, Upload, ShieldCheck, Printer,
  Lock, Clock, Building, User, Info, FileCheck, Check
} from 'lucide-react';
import { toast } from 'react-toastify';
import { ContractContext, formatDate } from './ContractContext';
import ModuleHeader from "../Admin/Modules/ModuleHeader";
import { FiFileText, FiArrowLeft, FiPrinter, FiDownload } from "react-icons/fi";
import { Home } from "lucide-react";
import { useGetContractByIdQuery, useSaveContractMutation } from '../../State-Management/Api/ContractApiSlice';
import './contract.css';
import jsPDF from 'jspdf';

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
    <div className="acceptance-signature-box premium-card mt-4" style={{ border: '2px solid #f5810c', background: '#fff9f5' }}>
      <h4 style={{ fontSize: 14, fontWeight: 800, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8, color: '#92400e' }}>
        <PenTool size={18} /> Finalize Your Acceptance
      </h4>
      <p style={{ fontSize: 12, color: '#92400e', marginBottom: 16, opacity: 0.8 }}>
        As an authorized representative of the <strong>Vendor Company</strong>, please provide your legal signature below to execute this C2C work order.
      </p>

      <div className="sig-tabs" style={{ background: '#fff', border: '1px solid #fed7aa' }}>
        <button className={`sig-tab ${type === 'draw' ? 'active' : ''}`} onClick={() => setType('draw')}>Draw Signature</button>
        <button className={`sig-tab ${type === 'upload' ? 'active' : ''}`} onClick={() => setType('upload')}>Upload Image</button>
      </div>

      {type === 'draw' ? (
        <div className="sig-canvas-wrapper" style={{ height: 180, background: '#fff', borderColor: '#fed7aa' }}>
          <canvas ref={canvasRef} width={600} height={180} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseOut={stopDrawing} onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing} style={{ width: '100%', height: '100%', cursor: 'crosshair' }} />
          {!data && <div className="sig-canvas-placeholder">Draw your legal signature here</div>}
          <button className="btn-secondary" style={{ position: 'absolute', right: 12, bottom: 12 }} onClick={clear}>Clear Canvas</button>
        </div>
      ) : (
        <div className="sig-canvas-wrapper" style={{ height: 180, background: '#fff', borderColor: '#fed7aa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          {data ? <img src={data} alt="Sig" style={{ maxHeight: 140 }} /> : <Upload size={32} color="#cbd5e1" />}
          <input type="file" id="bs-sig-up-premium" hidden onChange={(e) => {
            const f = e.target.files[0];
            if (f) { const r = new FileReader(); r.onloadend = () => setData(r.result); r.readAsDataURL(f); }
          }} />
          <label htmlFor="bs-sig-up-premium" className="btn-secondary mt-2" style={{ cursor: 'pointer' }}>Choose Signature File</label>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
        <button className="btn-primary" style={{ flex: 1, height: '48px', fontSize: 14 }} onClick={() => onComplete(data)}>Sign & Execute Contract</button>
        <button className="btn-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

const dataURLtoBlob = (dataurl) => {
  if (!dataurl) return null;
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

const API_BASE = 'https://webapidev.benmyl.com';

// Prefix relative image paths with API base and append stable cache-buster to prevent rendering stale signatures
const resolveImagePath = (path, buster) => {
  if (!path) return null;
  if (path.startsWith('data:') || path.startsWith('http')) return path;
  const baseUrl = `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
  return `${baseUrl}?v=${buster}`;
};

const mapApiContractToUI = (item) => {
  if (!item) return null;

  // Cache buster stamp stable for the lifecycle of this mapped item
  const buster = Date.now();

  // Creator/Hiring Manager Name: check reportingManager first, then other creator fields, falling back to Sarah Mitchell
  const creatorName = item.reportingManager || item.createdByName || item.createdBy_Name || item.createdByEmail || 'Sarah Mitchell';
  const creatorRole = item.createdByRole || 'Hiring Manager';
  const hiringManagerLabel = creatorName.includes('(') ? creatorName : `${creatorName} (${creatorRole})`;

  // Bench sales signatory: use dedicated bench sales name first, fall back to candidateName, then default
  const benchSalesLabel = item.benchSalesName || item.benchSales_Name || item.vendorSignatoryName || 'Bench Sales Representative';

  return {
    id: String(item.contractID || ''),
    contractTitle: item.contractTitle || 'Unnamed Contract',
    jobTitle: item.jobTitle || '-',
    candidateName: item.candidateName || '-',
    candidateEmail: item.candidateEmail || '',
    candidatePhone: item.candidatePhone || '',
    clientCompany: item.clientCompanyName || '-',
    companyName: item.vendorCompanyName || 'BenMyl Staffing',
    workLocation: item.workLocation || '-',
    employmentType: item.employmentType || '-',
    startDate: item.startDate ? formatDate(item.startDate.split('T')[0]) : '-',
    endDate: item.endDate ? formatDate(item.endDate.split('T')[0]) : '-',
    salary: item.salaryRate || '-',
    paymentCycle: item.paymentCycle || '-',
    workingHours: '40 hrs/week',
    reportingManager: item.reportingManager || '-',
    projectDuration: '-',
    noticePeriod: item.noticePeriod || '-',
    taxInformation: '-',
    benefits: '-',
    additionalNotes: '',
    termsAndConditions: item.termsAndConditions || '',
    confidentialityClause: item.confidentialityClause || '',
    ndaSection: '',
    terminationPolicy: '',
    status: item.agreementStatus || 'Shared',
    createdDate: item.createdOn ? formatDate(item.createdOn.split('T')[0]) : formatDate(new Date().toLocaleDateString("en-CA")),
    // Accurate creator & bench sales labels
    hiringManagerUser: hiringManagerLabel,
    benchSalesUser: benchSalesLabel,
    hiringManagerAccepted: item.signatureStatus_A === 'Signed' || !!item.signatureImagePath,
    benchSalesAccepted: item.signatureStatus_B === 'Signed' || !!(item.signatureImagePatbenchsales || item.signatureimagePatbenchsales),
    // Resolve full image URLs for signatures with cache buster
    hiringManagerSignature: resolveImagePath(item.signatureImagePath, buster),
    benchSalesSignature: resolveImagePath(item.signatureImagePatbenchsales || item.signatureimagePatbenchsales, buster),
  };
};

const ContractView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateContract } = useContext(ContractContext);
  const [showSignBox, setShowSignBox] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const { data: apiResponse, isLoading: isApiLoading } = useGetContractByIdQuery(id);
  const [saveContract, { isLoading: isSaving }] = useSaveContractMutation();

  const contract = useMemo(() => {
    if (!apiResponse || !apiResponse.data) return null;
    return mapApiContractToUI(apiResponse.data);
  }, [apiResponse]);

  const role = localStorage.getItem('Role');
  // BenchSales role can be stored with varying casing
  const isBS = role === 'Benchsales' || role === 'Admin' || role === 'Recruiter2';
  const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/User';

  if (isApiLoading) {
    return (
      <div className="contract-page d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
        <div className="contract-spinner" style={{ width: 40, height: 40, marginBottom: 16 }} />
        <h4 style={{ fontWeight: 700, color: '#475569' }}>Retrieving Secure Document...</h4>
        <p style={{ color: '#94a3b8', fontSize: 13 }}>Verifying signatures and audit records</p>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="contract-page d-flex flex-column align-items-center justify-content-center">
        <div className="premium-card text-center p-5">
          <XCircle size={48} color="#ef4444" className="mb-3" />
          <h2 style={{ fontWeight: 800 }}>Agreement Not Found</h2>
          <p className="text-muted">The requested contract ID does not exist or has been archived.</p>
          <button className="btn-primary mt-4" onClick={() => navigate(`${basePath}/contract-listing`)}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  const handleAccept = async (signature) => {
    if (!signature) {
      toast.error('Legal signature is required to proceed.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append("contractID", apiResponse.data.contractID);
      formData.append("JobID", apiResponse.data.jobID || "");
      formData.append("CandidateID", apiResponse.data.candidateID || "");
      formData.append("JobTitle", apiResponse.data.jobTitle || "");
      formData.append("CandidateName", apiResponse.data.candidateName || "");
      formData.append("ContractTitle", apiResponse.data.contractTitle || "");
      formData.append("ClientCompanyName", apiResponse.data.clientCompanyName || "");
      formData.append("VendorCompanyName", apiResponse.data.vendorCompanyName || "");
      formData.append("WorkLocation", apiResponse.data.workLocation || "");
      formData.append("CandidateEmail", apiResponse.data.candidateEmail || "");
      formData.append("CandidatePhone", apiResponse.data.candidatePhone || "");
      formData.append("EmploymentType", apiResponse.data.employmentType || "");
      formData.append("StartDate", apiResponse.data.startDate || "");
      formData.append("EndDate", apiResponse.data.endDate || "");
      formData.append("SalaryRate", apiResponse.data.salaryRate || "");
      formData.append("PaymentCycle", apiResponse.data.paymentCycle || "");
      formData.append("ReportingManager", apiResponse.data.reportingManager || "");
      formData.append("NoticePeriod", apiResponse.data.noticePeriod || "");
      formData.append("TermsAndConditions", apiResponse.data.termsAndConditions || "");
      formData.append("AgreementStatus", "Completed");

      formData.append("SignatureStatus_A", apiResponse.data.signatureStatus_A || "Signed");
      formData.append("SignatureStatus_B", "Signed");
      formData.append("SignatureStatus_C", "");
      formData.append("CreatedOn", apiResponse.data.createdOn || new Date().toISOString());

      // Preserve existing hiring manager signature path to prevent database null values
      const existingPath = apiResponse.data.signatureImagePath || "";
      formData.append("SignatureImagePath", existingPath);
      formData.append("signatureImagePath", existingPath);

      // Clear old signature paths when uploading a new signature, so backend processes the new file upload
      formData.append("SignatureImagePatbenchsales", "");
      formData.append("signatureimagePatbenchsales", "");

      formData.append("CreatedBy", apiResponse.data.createdBy || 0);

      // Signature Image Convert
      const sigBlob = dataURLtoBlob(signature);
      if (sigBlob) {
        formData.append("signature_iformfile_benchsales", sigBlob, "signature_benchsales.png");
      }

      await saveContract(formData).unwrap();
      setShowSignBox(false);
      toast.success('🎉 Agreement fully executed and archived.');
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || 'Failed to submit signature. Please try again.');
    }
  };

  const handleReject = async () => {
    if (window.confirm('Are you sure you want to decline this agreement? This action will be logged.')) {
      try {
        const formData = new FormData();
        formData.append("contractID", apiResponse.data.contractID);
        formData.append("JobID", apiResponse.data.jobID || "");
        formData.append("CandidateID", apiResponse.data.candidateID || "");
        formData.append("JobTitle", apiResponse.data.jobTitle || "");
        formData.append("CandidateName", apiResponse.data.candidateName || "");
        formData.append("ContractTitle", apiResponse.data.contractTitle || "");
        formData.append("ClientCompanyName", apiResponse.data.clientCompanyName || "");
        formData.append("VendorCompanyName", apiResponse.data.vendorCompanyName || "");
        formData.append("WorkLocation", apiResponse.data.workLocation || "");
        formData.append("CandidateEmail", apiResponse.data.candidateEmail || "");
        formData.append("CandidatePhone", apiResponse.data.candidatePhone || "");
        formData.append("EmploymentType", apiResponse.data.employmentType || "");
        formData.append("StartDate", apiResponse.data.startDate || "");
        formData.append("EndDate", apiResponse.data.endDate || "");
        formData.append("SalaryRate", apiResponse.data.salaryRate || "");
        formData.append("PaymentCycle", apiResponse.data.paymentCycle || "");
        formData.append("ReportingManager", apiResponse.data.reportingManager || "");
        formData.append("NoticePeriod", apiResponse.data.noticePeriod || "");
        formData.append("TermsAndConditions", apiResponse.data.termsAndConditions || "");
        formData.append("AgreementStatus", "Rejected");

        formData.append("SignatureStatus_A", apiResponse.data.signatureStatus_A || "Signed");
        formData.append("SignatureStatus_B", "Rejected");
        formData.append("SignatureStatus_C", "");
        formData.append("CreatedOn", apiResponse.data.createdOn || new Date().toISOString());

        // Preserve existing signature image path to prevent database null values
        const existingPath = apiResponse.data.signatureImagePath || "";
        formData.append("SignatureImagePath", existingPath);
        formData.append("signatureImagePath", existingPath);

        formData.append("CreatedBy", apiResponse.data.createdBy || 0);

        await saveContract(formData).unwrap();
        toast.error('Agreement declined.');
        navigate(`${basePath}/contract-listing`);
      } catch (err) {
        console.error(err);
        toast.error('Failed to submit reject status.');
      }
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
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
      doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.text('OFFICIAL WORK ORDER AGREEMENT', 40, 58);
      doc.setFontSize(9); doc.setTextColor(245, 129, 12); doc.text(`REF: ${contract.id}`, W - 40, 42, { align: 'right' });
      doc.setTextColor(255, 255, 255); doc.text(`CREATED: ${contract.createdDate}`, W - 40, 58, { align: 'right' });

      y = 120;
      const section = (title) => {
        doc.setFillColor(248, 250, 252); doc.rect(40, y - 5, W - 80, 22, 'F');
        doc.setTextColor(30, 41, 59); doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.text(title.toUpperCase(), 50, y + 10);
        y += 40;
      };

      const field = (label, value, xOffset = 0) => {
        doc.setTextColor(148, 163, 184); doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.text(label.toUpperCase(), 50 + xOffset, y);
        doc.setTextColor(30, 41, 59); doc.setFont('helvetica', 'normal'); doc.setFontSize(11); doc.text(String(value || '-'), 50 + xOffset, y + 15);
      };

      section('Contracting Entities');
      field('Client Side', contract.clientCompany);
      field('Vendor Side', contract.companyName || 'BenMyl Staffing', W / 2);
      y += 50;

      section('Engagement Scope');
      field('Agreement Title', contract.contractTitle); field('Role / Job Title', contract.jobTitle, W / 2); y += 40;
      field('Resource Name', contract.candidateName); field('Terms', contract.employmentType, W / 2); y += 40;
      field('Location', contract.workLocation); field('Effective Date', contract.startDate, W / 2); y += 50;

      section('Terms of Engagement');
      doc.setTextColor(71, 85, 105); doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setLineHeightFactor(1.5);
      const lines = doc.splitTextToSize(contract.termsAndConditions || '', W - 100);
      doc.text(lines, 50, y);
      y += lines.length * 15 + 40;

      if (y > H - 180) { doc.addPage(); y = 50; }
      section('Digital Execution & Validation');
      const sigY = y + 20;
      doc.setDrawColor(226, 232, 240); doc.line(50, sigY + 60, W / 2 - 20, sigY + 60); doc.line(W / 2 + 20, sigY + 60, W - 50, sigY + 60);
      doc.setFontSize(8); doc.setTextColor(148, 163, 184);
      doc.text('Client Authorized Signature', 50, sigY + 72); doc.text('Vendor Authorized Signature', W / 2 + 20, sigY + 72);

      // Draw hiring manager signature safely
      if (hmSigBase64) {
        try {
          doc.addImage(hmSigBase64, 'PNG', 50, sigY, 140, 55);
        } catch (err) {
          console.warn("Error drawing hiring manager signature in PDF:", err);
          doc.setFont('helvetica', 'italic'); doc.setFontSize(8); doc.setTextColor(148, 163, 184);
          doc.text('[Client Signature Draw Failed]', 50, sigY + 25);
        }
      } else if (contract.hiringManagerSignature) {
        doc.setFont('helvetica', 'italic'); doc.setFontSize(8); doc.setTextColor(148, 163, 184);
        doc.text('[Client Signature Image Unavailable]', 50, sigY + 25);
      }

      // Draw bench sales signature safely
      if (bsSigBase64) {
        try {
          doc.addImage(bsSigBase64, 'PNG', W / 2 + 20, sigY, 140, 55);
        } catch (err) {
          console.warn("Error drawing bench sales signature in PDF:", err);
          doc.setFont('helvetica', 'italic'); doc.setFontSize(8); doc.setTextColor(148, 163, 184);
          doc.text('[Vendor Signature Draw Failed]', W / 2 + 20, sigY + 25);
        }
      } else if (contract.benchSalesSignature) {
        doc.setFont('helvetica', 'italic'); doc.setFontSize(8); doc.setTextColor(148, 163, 184);
        doc.text('[Vendor Signature Image Unavailable]', W / 2 + 20, sigY + 25);
      }

      doc.setTextColor(203, 213, 225); doc.setFontSize(8);
      doc.text(`TRACER-ID: ${contract.id}-SECURE-VERIFIED | DIGITAL AUDIT LOGGED | COMPLIANT DOCUMENT`, 40, H - 30);
      doc.save(`Legal_Contract_${contract.id}.pdf`);
      toast.success('Professional document exported.');
    } catch (e) {
      console.error("PDF generation global failure:", e);
      toast.error('Export failed.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="ai-dashboard-wrapper contract-page">
      {/* HEADER CARD */}
      <div className="hero-card mb-4">
        <div className="hero-left">
          <div className="hero-pill">
            ✦ Document Viewer
          </div>
          <h1 className="job-posting-title text-white">{contract.contractTitle}</h1>
          <div className="job-posting-header-info">
            <p className="job-posting-subtitle">
              Formal Work Order Agreement • Ref ID: {contract.id}
            </p>
          </div>
        </div>
        <div className="hero-buttons">
          <button
            type="button"
            className="routine-btn"
            onClick={() => navigate(`${basePath}/contract-listing`)}
          >
            <FiArrowLeft style={{ marginRight: '8px' }} /> Back
          </button>
          <button
            type="button"
            className="routine-btn"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            <FiDownload style={{ marginRight: '8px' }} /> {isDownloading ? 'Preparing...' : 'Export Formal PDF'}
          </button>
          <button
            type="button"
            className="routine-btn"
            onClick={() => window.print()}
          >
            <FiPrinter style={{ marginRight: '8px' }} /> Print
          </button>
        </div>
      </div>

      <div className="formal-document-view-container">
        {/* SIDEBAR */}
        <div className="document-sidebar">
          <div className="premium-timeline">
            <h4 style={{ fontSize: 14, fontWeight: 800, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShieldCheck size={18} color="#f5810c" /> Execution Timeline
            </h4>

            <div className={`timeline-item completed`}>
              <div className="timeline-dot"><Check size={14} /></div>
              <div className="timeline-content">
                <span className="timeline-title">Contract Created</span>
                <span className="timeline-sub">By {contract.hiringManagerUser} on {contract.createdDate}</span>
              </div>
            </div>

            <div className={`timeline-item completed`}>
              <div className="timeline-dot"><Check size={14} /></div>
              <div className="timeline-content">
                <span className="timeline-title">Hiring Manager Signed</span>
                <span className="timeline-sub">Digital signature verified</span>
              </div>
            </div>

            <div className={`timeline-item ${contract.benchSalesAccepted ? 'completed' : 'active'}`}>
              <div className="timeline-dot">
                {contract.benchSalesAccepted ? <Check size={14} /> : <Clock size={12} />}
              </div>
              <div className="timeline-content">
                <span className="timeline-title">Bench Sales Acceptance</span>
                <span className="timeline-sub">
                  {contract.benchSalesAccepted ? `Signed on ${contract.benchSalesDate}` : 'Pending Bench Sales signature'}
                </span>
              </div>
            </div>

            <div className={`timeline-item ${contract.status === 'Completed' ? 'completed' : ''}`}>
              <div className="timeline-dot">
                {contract.status === 'Completed' ? <FileCheck size={14} /> : <Lock size={12} />}
              </div>
              <div className="timeline-content">
                <span className="timeline-title">Fully Executed</span>
                <span className="timeline-sub">{contract.status === 'Completed' ? 'Legal agreement archived' : 'Waiting for final signature'}</span>
              </div>
            </div>
          </div>

          <div className="premium-card" style={{ background: '#f8fafc', padding: '20px', borderStyle: 'dashed' }}>
            <h5 style={{ fontSize: 12, fontWeight: 800, marginBottom: 12 }}>Security Trace</h5>
            <div style={{ fontSize: 11, color: '#64748b', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="d-flex justify-content-between"><span>Audit ID:</span><span className="text-dark fw-bold">{contract.id.split('-')[1]}X99</span></div>
              <div className="d-flex justify-content-between"><span>Hashing:</span><span className="text-dark fw-bold">SHA-256</span></div>
              <div className="d-flex justify-content-between"><span>Network:</span><span className="text-dark fw-bold">AES-Encrypted</span></div>
            </div>
          </div>
        </div>

        {/* PAPER CONTENT */}
        <div className="document-main">
          <div className="contract-paper" style={{ border: '1px solid #e2e8f0' }}>
            <div className="document-seal"><ShieldCheck size={100} /></div>

            <div className="paper-header">
              <div className="company-info-row">
                <div className="party-box">
                  <span className="party-label">CREATOR ORGANIZATION</span>
                  <div className="party-val" style={{ color: '#f5810c' }}>{contract.clientCompany}</div>
                </div>
                <div className="party-box" style={{ textAlign: 'right' }}>
                  <span className="party-label">VENDOR ORGANIZATION</span>
                  <div className="party-val" style={{ color: '#1e293b' }}>{contract.companyName || 'BenMyl Staffing'}</div>
                </div>
              </div>
            </div>

            <div className="paper-body">
              <div className="contract-title-strip" style={{ background: 'linear-gradient(to right, #1e293b, #334155)', borderRadius: '4px' }}>
                {contract.contractTitle}
              </div>

              <div className="contract-info-grid">
                <div className="info-item"><span className="il">Designated Resource</span><span className="iv">{contract.candidateName}</span></div>
                <div className="info-item"><span className="il">Project Position</span><span className="iv">{contract.jobTitle}</span></div>
                <div className="info-item"><span className="il">Employment Terms</span><span className="iv">{contract.employmentType}</span></div>
                <div className="info-item"><span className="il">Project Location</span><span className="iv">{contract.workLocation}</span></div>
                <div className="info-item"><span className="il">Commencement Date</span><span className="iv">{contract.startDate}</span></div>
                <div className="info-item"><span className="il">Project End Date</span><span className="iv">{contract.endDate}</span></div>
                <div className="info-item"><span className="il">Professional Fees</span><span className="iv">{contract.salary}</span></div>
                <div className="info-item"><span className="il">Remittance Cycle</span><span className="iv">{contract.paymentCycle}</span></div>
              </div>

              <div className="document-section">
                <h4 style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Article I: Scope of Engagement</h4>
                <p>This Work Order is issued under the master services agreement between <strong>{contract.companyName || 'BenMyl'}</strong> and <strong>{contract.clientCompany}</strong>. The Vendor agrees to provide professional services through the designated resource in accordance with the job descriptions and requirements provided by the Client.</p>
              </div>

              <div className="document-section">
                <h4 style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Article II: Compliance & Legal Terms</h4>
                <p className="legal-text" style={{ fontSize: '13px', borderLeftColor: '#f5810c' }}>{contract.termsAndConditions}</p>
              </div>

              <div className="document-section">
                <h4 style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Article III: Confidentiality</h4>
                <p className="legal-text" style={{ fontSize: '13px' }}>{contract.confidentialityClause || 'All proprietary information, intellectual property, and project data remain the sole property of the Client. The Vendor agrees to maintain absolute confidentiality.'}</p>
              </div>

              <div className="signature-grid">
                <div className="sig-box">
                  <span className="sig-label">Authorized Signatory (Hiring Side)</span>
                  {contract.hiringManagerSignature ? (
                    <div className="formal-sig-wrap">
                      <img src={`${contract.hiringManagerSignature}?t=${Date.now()}`} alt="HM Sig" style={{ filter: 'contrast(1.2) brightness(0.8)' }} />
                      <div className="sig-meta">Digitally Authenticated: {contract.createdDate}</div>
                    </div>
                  ) : <div className="sig-placeholder">Waiting for Signature</div>}
                  <div className="sig-line"></div>
                  <div className="sig-name">{contract.hiringManagerUser}</div>
                  <div className="sig-sub" style={{ fontSize: 10, color: '#94a3b8' }}>Authorized Client Representative</div>
                </div>

                <div className="sig-box">
                  <span className="sig-label">Authorized Signatory (Vendor Side)</span>
                  {contract.benchSalesSignature ? (
                    <div className="formal-sig-wrap">
                      <img src={`${contract.benchSalesSignature}?t=${Date.now()}`} alt="BS Sig" style={{ filter: 'contrast(1.2) brightness(0.8)' }} />
                      <div className="sig-meta">Digitally Authenticated: {contract.benchSalesDate || contract.createdDate}</div>
                    </div>
                  ) : <div className="sig-placeholder">Pending Vendor Acceptance</div>}
                  <div className="sig-line"></div>
                  <div className="sig-name">{contract.benchSalesUser}</div>
                  <div className="sig-sub" style={{ fontSize: 10, color: '#94a3b8' }}>Authorized Vendor Representative</div>
                </div>
              </div>
            </div>

            <div className="paper-footer">
              <div className="d-flex justify-content-between align-items-center">
                <span>DIGITAL DOCUMENT REF: {contract.id}-SECURE-VERIFIED</span>
                <span style={{ color: '#94a3b8' }}>PAGE 1 OF 1</span>
                <span>SECURED BY BENMYL ENCRYPTION</span>
              </div>
            </div>
          </div>

          {showSignBox && (
            <SignatureSection
              onComplete={handleAccept}
              onCancel={() => setShowSignBox(false)}
            />
          )}

          {!contract.benchSalesAccepted && isBS && contract.status !== 'Rejected' && !showSignBox && (
            <div className="mt-5 text-center d-flex justify-content-center gap-3">
              <button className="btn-primary" onClick={() => setShowSignBox(true)} style={{ minWidth: '240px', height: '54px', fontSize: 16, fontWeight: 800, borderRadius: '12px', boxShadow: '0 10px 20px rgba(245,129,12,0.2)' }}>
                <PenTool size={20} className="me-2" /> Accept & Sign Work Order
              </button>
              <button className="btn-secondary text-red" onClick={handleReject} style={{ height: '54px', padding: '0 24px', borderRadius: '12px' }}>
                <XCircle size={20} className="me-2" /> Decline Agreement
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractView;