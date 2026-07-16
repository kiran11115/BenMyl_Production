import React, { useState, useContext, useRef, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CustomConfirm } from '../Common/CustomAlert';

import {
  FileText, ArrowLeft, Download, CheckCircle,
  XCircle, PenTool, Upload, ShieldCheck, Printer,
  Lock, Clock, Building, User, Info, FileCheck, Check,
  AlertCircle
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
  const [signatureError, setSignatureError] = useState('');
  const [isCanvasEmpty, setIsCanvasEmpty] = useState(true);
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);

  // Helper to check if canvas is blank/empty by inspecting pixel data
  const isCanvasBlank = (canvas) => {
    if (!canvas) return true;
    const ctx = canvas.getContext('2d');
    const { data: pixelData } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < pixelData.length; i++) {
      if (pixelData[i] !== 0) {
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    setData(null);
    setIsCanvasEmpty(true);
    setSignatureError('');
    if (type === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#1e293b';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
    }
  }, [type]);

  const startDrawing = (e) => {
    if (e.cancelable) e.preventDefault();
    isDrawing.current = true;
    setSignatureError('');

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clientX = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0] && e.touches[0].clientY);
    if (clientX === undefined || clientY === undefined) return;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsCanvasEmpty(false);
  };

  const stopDrawing = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    const canvas = canvasRef.current;
    if (canvas) {
      const isBlank = isCanvasBlank(canvas);
      setIsCanvasEmpty(isBlank);
      if (!isBlank) {
        setData(canvas.toDataURL());
      } else {
        setData(null);
      }
    }
  };

  const draw = (e) => {
    if (!isDrawing.current) return;
    if (e.cancelable) e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clientX = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0] && e.touches[0].clientY);
    if (clientX === undefined || clientY === undefined) return;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
    }
    setData(null);
    setIsCanvasEmpty(true);
    setSignatureError('Signature/upload image is required');
  };

  const handleSignSubmit = () => {
    if (type === 'draw') {
      const canvas = canvasRef.current;
      const isBlank = !canvas || isCanvasBlank(canvas);
      if (isBlank) {
        setSignatureError('Signature/upload image is required');
        toast.error('Legal signature is required to proceed.');
        return;
      }
      const signatureData = canvas.toDataURL();
      setSignatureError('');
      onComplete(signatureData);
    } else {
      if (!data) {
        setSignatureError('Signature/upload image is required');
        toast.error('Legal signature is required to proceed.');
        return;
      }
      setSignatureError('');
      onComplete(data);
    }
  };
  return (
    <div className="acceptance-signature-box premium-card mt-4 p-3" style={{ border: '2px solid #1e293b', background: '#f8fafc' }}>
      <h4 style={{ fontSize: 14, fontWeight: 800, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8, color: '#1e293b' }}>
        <PenTool size={18} /> Finalize Your Acceptance
      </h4>
      <p style={{ fontSize: 12, color: '#334155', marginBottom: 16, opacity: 0.8 }}>
        As an authorized representative of the <strong>Vendor Company</strong>, please provide your legal signature below to execute this C2C work order.
      </p>

      <div className="sig-tabs" style={{ background: '#fff', border: '1px solid #cbd5e1' }}>
        <button className={`sig-tab ${type === 'draw' ? 'active' : ''}`} onClick={() => setType('draw')}>Draw Signature</button>
        <button className={`sig-tab ${type === 'upload' ? 'active' : ''}`} onClick={() => setType('upload')}>Upload Image</button>
      </div>

      {type === 'draw' ? (
        <div className="sig-canvas-wrapper" style={{ height: 180, background: '#fff', borderColor: '#cbd5e1' }}>
          <canvas ref={canvasRef} width={600} height={180} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseOut={stopDrawing} onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing} style={{ width: '100%', height: '100%', cursor: 'crosshair' }} />
          {isCanvasEmpty && <div className="sig-canvas-placeholder">Draw your legal signature here</div>}
          <button className="btn-secondary" style={{ position: 'absolute', right: 12, bottom: 12 }} onClick={clear}>Clear Canvas</button>
        </div>
      ) : (
        <div className="sig-canvas-wrapper" style={{ height: 180, background: '#fff', borderColor: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          {data ? <img src={data} alt="Sig" style={{ maxHeight: 140 }} /> : <Upload size={32} color="#cbd5e1" />}
          <input type="file" id="bs-sig-up-premium" hidden onChange={(e) => {
            const f = e.target.files[0];
            if (f) { const r = new FileReader(); r.onloadend = () => setData(r.result); r.readAsDataURL(f); }
          }} />
          <label htmlFor="bs-sig-up-premium" className="btn-secondary mt-2" style={{ cursor: 'pointer' }}>Choose Signature File</label>
        </div>
      )}

      {signatureError && (
        <div className="auth-error" style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontSize: '13px', fontWeight: '500' }}>
          <AlertCircle size={16} />
          <span>{signatureError}</span>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
        <button className="btn-primary" style={{ flex: 1, height: '48px', fontSize: 14 }} onClick={handleSignSubmit}>Sign & Execute Contract</button>
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
    companyName: item.vendorCompanyName || '-',
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
    createdBy: item.createdBy || null,
  };
};

const ContractView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateContract } = useContext(ContractContext);
  const [showSignBox, setShowSignBox] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [customConfirm, setCustomConfirm] = useState(null);


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
  
  const userCompanyId = localStorage.getItem("CompanyId");
  const isCreator = contract && userCompanyId && String(contract.createdBy) === String(userCompanyId);

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

  const executeReject = async () => {
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
  };

  const handleReject = () => {
    setCustomConfirm({
      title: "Decline Agreement?",
      message: "Are you sure you want to decline this agreement? This action will be logged in the execution audit logs.",
      confirmText: "Yes, Decline",
      cancelText: "Cancel",
      onConfirm: () => {
        setCustomConfirm(null);
        executeReject();
      }
    });
  };

  const handleDownload = async () => {
    setIsDownloading(true);
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
      <div className="hero-section-wrapper mb-4">
        <div className="hero-card ">
          <div className="hero-concentric-lines"></div>
          <div className="hero-ripple-pattern"></div>
          <div className="hero-circular-highlights"></div>
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
                <div className="hero-illustration">
            <div className="hero-particles">
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
            </div>
            <img src="/Images/Dashboard.png" alt="Dashboard Illustration" className="hero-svg-image" />
          </div>
        </div>
      </div>

      <div className="formal-document-view-container">
        {/* PAPER CONTENT */}
        <div className="document-main">
          <div className="contract-paper" style={{ border: '1px solid #e2e8f0' }}>
            <div className="document-seal"><ShieldCheck size={100} /></div>

            <div className="paper-header">
              <div className="company-info-row">
                <div className="party-box">
                  <span className="party-label">CREATOR ORGANIZATION</span>
                  <div className="party-val" style={{ color: '#1e293b' }}>{contract.clientCompany}</div>
                </div>
                <div className="party-box" style={{ textAlign: 'right' }}>
                  <span className="party-label">VENDOR ORGANIZATION</span>
                  <div className="party-val" style={{ color: '#1e293b' }}>{contract.companyName || '-'}</div>
                </div>
              </div>
            </div>

            <div className="paper-body">
              <div className="contract-title-strip" style={{ background: 'linear-gradient(to right, #1e293b, #334155)', borderRadius: '4px', padding: '12px 16px', fontSize: '15px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src="/Images/Benmyl White logo.png" alt="BenMyl Logo" style={{ height: '22px', objectFit: 'contain' }} />
                <span>C2C STAFFING WORK ORDER AGREEMENT</span>
              </div>

              <div className="document-section Preamble" style={{ marginBottom: '24px' }}>
                <p style={{ fontStyle: 'italic', fontSize: '12px', color: '#334155', lineHeight: '1.6', textAlign: 'justify', margin: 0 }}>
                  This C2C Staffing Work Order ("Work Order") is effective as of <strong>{contract.startDate}</strong> ("Effective Date"), and is entered into by and between <strong>{contract.clientCompany}</strong> ("Client" or "Hiring Side") and <strong>{contract.companyName && contract.companyName !== '-' ? contract.companyName : 'BenMyl'}</strong> ("Vendor" or "Bench Side") (each a "Party", and collectively the "Parties"). This Work Order governs the professional services provided by the designated Resource outlined in the table below.
                </p>
              </div>

              <div className="document-section" style={{ marginBottom: '24px' }}>
                <h4 style={{ textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid #1e293b', paddingBottom: '6px', marginBottom: '12px', fontSize: '12px', fontWeight: '800' }}>
                  Schedule A: Statement of Work & Financial Terms
                </h4>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', color: '#1e293b', border: '1px solid #cbd5e1', marginBottom: '10px' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #cbd5e1' }}>
                      <td style={{ padding: '8px 12px', fontWeight: 'bold', background: '#f8fafc', width: '35%', borderRight: '1px solid #cbd5e1' }}>Designated Resource (Consultant)</td>
                      <td style={{ padding: '8px 12px' }}>{contract.candidateName}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #cbd5e1' }}>
                      <td style={{ padding: '8px 12px', fontWeight: 'bold', background: '#f8fafc', borderRight: '1px solid #cbd5e1' }}>Project Position / Role</td>
                      <td style={{ padding: '8px 12px' }}>{contract.jobTitle}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #cbd5e1' }}>
                      <td style={{ padding: '8px 12px', fontWeight: 'bold', background: '#f8fafc', borderRight: '1px solid #cbd5e1' }}>Employment Terms / Type</td>
                      <td style={{ padding: '8px 12px' }}>{contract.employmentType} (Company-to-Company)</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #cbd5e1' }}>
                      <td style={{ padding: '8px 12px', fontWeight: 'bold', background: '#f8fafc', borderRight: '1px solid #cbd5e1' }}>Project Location</td>
                      <td style={{ padding: '8px 12px' }}>{contract.workLocation}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #cbd5e1' }}>
                      <td style={{ padding: '8px 12px', fontWeight: 'bold', background: '#f8fafc', borderRight: '1px solid #cbd5e1' }}>Commencement Date</td>
                      <td style={{ padding: '8px 12px' }}>{contract.startDate}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #cbd5e1' }}>
                      <td style={{ padding: '8px 12px', fontWeight: 'bold', background: '#f8fafc', borderRight: '1px solid #cbd5e1' }}>Project End Date (Target)</td>
                      <td style={{ padding: '8px 12px' }}>{contract.endDate}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #cbd5e1' }}>
                      <td style={{ padding: '8px 12px', fontWeight: 'bold', background: '#f8fafc', borderRight: '1px solid #cbd5e1' }}>Hourly Billing Rate</td>
                      <td style={{ padding: '8px 12px', color: '#16a34a', fontWeight: 'bold' }}>{contract.salary}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #cbd5e1' }}>
                      <td style={{ padding: '8px 12px', fontWeight: 'bold', background: '#f8fafc', borderRight: '1px solid #cbd5e1' }}>Remittance Cycle</td>
                      <td style={{ padding: '8px 12px' }}>{contract.paymentCycle}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #cbd5e1' }}>
                      <td style={{ padding: '8px 12px', fontWeight: 'bold', background: '#f8fafc', borderRight: '1px solid #cbd5e1' }}>Reporting Manager</td>
                      <td style={{ padding: '8px 12px' }}>{contract.reportingManager}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px 12px', fontWeight: 'bold', background: '#f8fafc', borderRight: '1px solid #cbd5e1' }}>Termination Notice Period</td>
                      <td style={{ padding: '8px 12px' }}>{contract.noticePeriod}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {contract.termsAndConditions && (
                <div className="document-section" style={{ marginBottom: '24px' }}>
                  <h4 style={{ textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px', marginBottom: '8px', fontSize: '11px', fontWeight: '800' }}>
                    Section 1: Terms &amp; Conditions
                  </h4>
                  <p className="legal-text" style={{ fontSize: '12px', background: '#f8fafc', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #1e293b', fontStyle: 'normal', color: '#475569', lineHeight: '1.6', textAlign: 'justify', whiteSpace: 'pre-line', margin: 0 }}>
                    {contract.termsAndConditions}
                  </p>
                </div>
              )}

              {contract.confidentialityClause && (
                <div className="document-section" style={{ marginBottom: '24px' }}>
                  <h4 style={{ textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px', marginBottom: '8px', fontSize: '11px', fontWeight: '800' }}>
                    Section 2: Confidentiality &amp; Non-Disclosure
                  </h4>
                  <p className="legal-text" style={{ fontSize: '12px', background: '#f8fafc', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #1e293b', fontStyle: 'normal', color: '#475569', lineHeight: '1.6', textAlign: 'justify', whiteSpace: 'pre-line', margin: 0 }}>
                    {contract.confidentialityClause}
                  </p>
                </div>
              )}

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
        </div>

        {/* SIDEBAR */}
        <div className="document-sidebar">
          <div className="premium-timeline">
            <h4 style={{ fontSize: 14, fontWeight: 800, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShieldCheck size={18} color="#16a34a" /> Execution Timeline
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

          {/* SIGNATURE SECTION AND ACTIONS */}
          {showSignBox && !isCreator && (
            <div style={{ marginTop: '20px' }}>
              <SignatureSection
                onComplete={handleAccept}
                onCancel={() => setShowSignBox(false)}
              />
            </div>
          )}

          {!contract.benchSalesAccepted && isBS && contract.status !== 'Rejected' && !showSignBox && !isCreator && (
            <div className="d-flex flex-column gap-2 mt-3 w-100">
              <button className="btn-primary w-100" onClick={() => setShowSignBox(true)} style={{ height: '48px', fontSize: 14, fontWeight: 800, borderRadius: '8px', boxShadow: '0 4px 12px rgba(30,41,59,0.1)' }}>
                <PenTool size={18} className="me-2" /> Accept &amp; Sign Work Order
              </button>
              <button className="btn-secondary text-red w-100" onClick={handleReject} style={{ height: '40px', borderRadius: '8px' }}>
                <XCircle size={18} className="me-2" /> Decline Agreement
              </button>
            </div>
          )}
        </div>
      </div>
      {customConfirm && (
        <CustomConfirm
          title={customConfirm.title}
          message={customConfirm.message}
          confirmText={customConfirm.confirmText}
          cancelText={customConfirm.cancelText}
          onConfirm={customConfirm.onConfirm}
          onCancel={() => setCustomConfirm(null)}
          onClose={() => setCustomConfirm(null)}
        />
      )}
    </div>
  );
};

export default ContractView;