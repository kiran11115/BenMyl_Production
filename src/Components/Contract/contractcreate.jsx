import React, { useState, useRef, useEffect, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Upload,
  FileText,
  PenTool,
  Users,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  CheckCircle,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { ContractContext, formatDate } from './ContractContext';
import ModuleHeader from "../Admin/Modules/ModuleHeader";
import { FiFilePlus } from "react-icons/fi";
import { Home } from "lucide-react";
import './contract.css';
import '../PostNewPositions/PostNewPositions.css';
import { useGetGroupedJobTitlesQuery, useTalentPoolMutation } from "../../State-Management/Api/TalentPoolApiSlice";
import { useSaveContractMutation } from "../../State-Management/Api/ContractApiSlice";

/* =====================================================================
   LEGAL DISCLAIMER - REQUIRES REVIEW BEFORE PRODUCTION USE
   ===================================================================== */

const validationSchema = Yup.object().shape({
  contractTitle: Yup.string().required('Contract Title is required'),
  clientCompany: Yup.string().required('Client Company is required'),
  candidateName: Yup.string().required('Candidate Name is required'),
  candidateEmail: Yup.string().email('Invalid email').required('Required'),
  candidatePhone: Yup.string().required('Required'),
  jobTitle: Yup.string().required('Job Title is required'),
  workLocation: Yup.string().required('Required'),
  employmentType: Yup.string().required('Required'),
  startDate: Yup.date().required('Required'),
  endDate: Yup.date().required('Required'),
  salary: Yup.string().required('Required'),
  paymentCycle: Yup.string().required('Required'),
  reportingManager: Yup.string().required('Required'),
  noticePeriod: Yup.string().required('Required'),
  termsAndConditions: Yup.string().required('Required'),
});

const ContractCreate = () => {
  const navigate = useNavigate();
  const { addContract } = useContext(ContractContext);
  const [step, setStep] = useState(1);
  const [signatureType, setSignatureType] = useState('draw');
  const [signatureData, setSignatureData] = useState(null);
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);

  const userId = localStorage.getItem("CompanyId");
  const companyId = localStorage.getItem("logincompanyid");

  // Fetch Jobs
  const { data: fetchedJobs, isLoading: isJobsLoading } = useGetGroupedJobTitlesQuery(userId, { skip: !userId });

  const jobs = useMemo(() => {
    if (!fetchedJobs || !Array.isArray(fetchedJobs)) return [];
    return fetchedJobs.map(job => ({
      id: job.jobID,
      title: job.jobTitle,
      company: job.companyName || "Your Company",
    }));
  }, [fetchedJobs]);

  const [candidates, setCandidates] = useState([]);
  const [isCandidatesLoading, setIsCandidatesLoading] = useState(false);
  const [getFindTalent] = useTalentPoolMutation();
  const [saveContract, { isLoading: isSavingContract }] = useSaveContractMutation();

  const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/User';

  const formik = useFormik({
    initialValues: {
      contractTitle: '',
      clientCompany: '',
      companyName: 'BenMyl Staffing',
      candidateName: '',
      candidateEmail: '',
      candidatePhone: '',
      jobTitle: '',
      workLocation: '',
      employmentType: '',
      startDate: '',
      endDate: '',
      salary: '',
      paymentCycle: 'Monthly',
      workingHours: '40 hrs/week',
      reportingManager: '',
      projectDuration: '',
      termsAndConditions: 'This agreement outlines the terms...',
      confidentialityClause: 'Standard confidentiality clause applies...',
      ndaSection: 'Standard NDA terms apply...',
      terminationPolicy: 'Standard termination policy applies...',
      noticePeriod: '2 Weeks',
      taxInformation: '',
      benefits: '',
      additionalNotes: '',
    },
    validationSchema,
    onSubmit: (values) => {
      // Step 2 submit -> go to step 3
      setStep(3);
    },
  });

  // Load candidates when jobTitle changes
  useEffect(() => {
    if (!formik.values.jobTitle || !companyId) {
      setCandidates([]);
      return;
    }

    const fetchShortlisted = async () => {
      setIsCandidatesLoading(true);
      try {
        const payload = {
          companyid: Number(companyId),
          pageNumber: 1,
          pageSize: 100,
          filters: [
            {
              filterName: "Title",
              filterOperator: "Equals",
              filterValue: [formik.values.jobTitle],
            }
          ],
        };

        const res = await getFindTalent(payload).unwrap();

        if (Array.isArray(res)) {
          // Filter for isshortlisted
          const shortlisted = res.filter(item => item.isshortlisted).map(item => ({
            id: item.employeeID,
            name: `${item.firstName} ${item.lastName}`,
            email: item.emailAddress,
            phone: item.phoneNumber || "",
          }));
          setCandidates(shortlisted);
        }
      } catch (err) {
        console.error("Failed to fetch shortlisted candidates:", err);
      } finally {
        setIsCandidatesLoading(false);
      }
    };

    fetchShortlisted();
  }, [formik.values.jobTitle, companyId, getFindTalent]);

  // Signature Canvas Logic
  useEffect(() => {
    if (step === 3 && signatureType === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#1e293b';
    }
  }, [step, signatureType]);

  const startDrawing = (e) => {
    isDrawing.current = true;
    draw(e);
  };

  const stopDrawing = () => {
    isDrawing.current = false;
    const canvas = canvasRef.current;
    setSignatureData(canvas.toDataURL());
  };

  const draw = (e) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    setSignatureData(null);
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

  const handleCreateContract = async () => {
    if (!signatureData) {
      toast.error('Please provide a signature before sharing.');
      return;
    }

    const selectedJobObj = jobs.find(j => j.title === formik.values.jobTitle);
    const cand = candidates.find(c => c.name === formik.values.candidateName);

    try {
      const formData = new FormData();
      formData.append("contractID", 0);
      formData.append("JobID", selectedJobObj?.id ? String(selectedJobObj.id) : "");
      formData.append("CandidateID", cand?.id ? String(cand.id) : "");
      formData.append("JobTitle", formik.values.jobTitle || "");
      formData.append("CandidateName", formik.values.candidateName || "");
      formData.append("ContractTitle", formik.values.contractTitle || "");
      formData.append("ClientCompanyName", formik.values.clientCompany || "");
      formData.append("VendorCompanyName", formik.values.companyName || "");
      formData.append("WorkLocation", formik.values.workLocation || "");
      formData.append("CandidateEmail", formik.values.candidateEmail || "");
      formData.append("CandidatePhone", formik.values.candidatePhone || "");
      formData.append("EmploymentType", formik.values.employmentType || "");
      
      const startIso = formik.values.startDate ? new Date(formik.values.startDate).toISOString() : new Date().toISOString();
      const endIso = formik.values.endDate ? new Date(formik.values.endDate).toISOString() : new Date().toISOString();
      formData.append("StartDate", startIso);
      formData.append("EndDate", endIso);
      
      formData.append("SalaryRate", formik.values.salary || "");
      formData.append("PaymentCycle", formik.values.paymentCycle || "");
      formData.append("ReportingManager", formik.values.reportingManager || "");
      formData.append("NoticePeriod", formik.values.noticePeriod || "");
      formData.append("TermsAndConditions", formik.values.termsAndConditions || "");
      formData.append("AgreementStatus", "Shared");

      // Signature Image Convert
      const sigBlob = dataURLtoBlob(signatureData);
      if (sigBlob) {
        formData.append("SignatureImage", sigBlob, "signature.png");
      }

      formData.append("SignatureStatus_A", "Signed");
      formData.append("SignatureStatus_B", "");
      formData.append("SignatureStatus_C", "");
      formData.append("CreatedOn", new Date().toISOString());
      formData.append("signatureImagePath", "");
      formData.append("signatureimagePatbenchsales", "");
      formData.append("CreatedBy", Number(localStorage.getItem("CompanyId")) || 0);

      await saveContract(formData).unwrap();

      const newContract = {
        ...formik.values,
        id: `CTR-${Date.now().toString().slice(-4)}`,
        status: 'Shared',
        startDate: formik.values.startDate ? formatDate(formik.values.startDate) : '-',
        endDate: formik.values.endDate ? formatDate(formik.values.endDate) : '-',
        createdDate: formatDate(new Date().toISOString().split('T')[0]),
        hiringManagerUser: 'Sarah Mitchell (Hiring Manager)',
        benchSalesUser: formik.values.candidateName || 'Bench Sales Team',
        hiringManagerAccepted: true,
        benchSalesAccepted: false,
        hiringManagerSignature: signatureData,
        benchSalesSignature: null,
      };

      addContract(newContract);
      setStep(4);
      toast.success("Contract created and shared successfully!");
    } catch (err) {
      console.error("Failed to create contract:", err);
      toast.error(err?.data?.message || err?.message || "Failed to create contract.");
    }
  };

  const renderStep1 = () => (
    <div className="premium-card">
      <div className="section-header">
        <h3>Step 1: Job & Candidate Selection</h3>
      </div>
      <div className="grid-2">
        <div className="auth-form-group">
          <label className="auth-label">Job Title (Active Posted Jobs) *</label>
          <select
            className="auth-input"
            name="jobTitle"
            value={formik.values.jobTitle}
            onChange={(e) => {
              formik.handleChange(e);
              formik.setFieldValue('candidateName', '');
              formik.setFieldValue('candidateEmail', '');
              formik.setFieldValue('candidatePhone', '');
            }}
            onBlur={formik.handleBlur}
          >
            <option value="">Select a job</option>
            {isJobsLoading ? (
              <option disabled>Loading jobs...</option>
            ) : (
              jobs.map(j => (
                <option key={j.id} value={j.title}>{j.title}</option>
              ))
            )}
          </select>
          {formik.touched.jobTitle && formik.errors.jobTitle && <div className="auth-error">{formik.errors.jobTitle}</div>}
        </div>
        <div className="auth-form-group">
          <label className="auth-label">Candidate (Shortlisted) *</label>
          <select
            className="auth-input"
            name="candidateName"
            value={formik.values.candidateName}
            onChange={(e) => {
              const selectedName = e.target.value;
              formik.setFieldValue('candidateName', selectedName);
              const cand = candidates.find(c => c.name === selectedName);
              if (cand) {
                formik.setFieldValue('candidateEmail', cand.email);
                formik.setFieldValue('candidatePhone', cand.phone);
              } else {
                formik.setFieldValue('candidateEmail', '');
                formik.setFieldValue('candidatePhone', '');
              }
            }}
            onBlur={formik.handleBlur}
            disabled={!formik.values.jobTitle || isCandidatesLoading}
          >
            <option value="">Select a candidate</option>
            {isCandidatesLoading ? (
              <option disabled>Loading candidates...</option>
            ) : (
              candidates.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))
            )}
          </select>
          {formik.touched.candidateName && formik.errors.candidateName && <div className="auth-error">{formik.errors.candidateName}</div>}
        </div>
      </div>
      <div className="d-flex justify-content-end mt-4">
        <button
          className="btn-primary"
          onClick={() => {
            if (formik.values.jobTitle && formik.values.candidateName) {
              setStep(2);
            } else {
              toast.error('Please select both Job and Candidate');
            }
          }}
        >
          Approve Candidate & Continue <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="premium-card">
      <div className="section-header">
        <h3>Step 2: Work Order Details</h3>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className="grid-3">
          <div className="auth-form-group">
            <label className="auth-label">Contract Title *</label>
            <input className="auth-input" name="contractTitle" {...formik.getFieldProps('contractTitle')} placeholder="e.g. Senior Dev Work Order" />
            {formik.touched.contractTitle && formik.errors.contractTitle && <div className="auth-error">{formik.errors.contractTitle}</div>}
          </div>
          <div className="auth-form-group">
            <label className="auth-label">Client Company Name *</label>
            <input className="auth-input" name="clientCompany" {...formik.getFieldProps('clientCompany')} placeholder="Client Company Name" />
            {formik.touched.clientCompany && formik.errors.clientCompany && <div className="auth-error">{formik.errors.clientCompany}</div>}
          </div>
          <div className="auth-form-group">
            <label className="auth-label">Vendor Company Name *</label>
            <input className="auth-input" name="companyName" {...formik.getFieldProps('companyName')} placeholder="Vendor Company Name" />
          </div>
          <div className="auth-form-group">
            <label className="auth-label">Work Location *</label>
            <input className="auth-input" name="workLocation" {...formik.getFieldProps('workLocation')} placeholder="City, State / Remote" />
            {formik.touched.workLocation && formik.errors.workLocation && <div className="auth-error">{formik.errors.workLocation}</div>}
          </div>
        </div>

        <div className="grid-3">
          <div className="auth-form-group">
            <label className="auth-label">Candidate Email *</label>
            <input className="auth-input" name="candidateEmail" {...formik.getFieldProps('candidateEmail')} />
          </div>
          <div className="auth-form-group">
            <label className="auth-label">Candidate Phone *</label>
            <input className="auth-input" name="candidatePhone" {...formik.getFieldProps('candidatePhone')} />
          </div>
          <div className="auth-form-group">
            <label className="auth-label">Employment Type *</label>
            <select className="auth-input" name="employmentType" {...formik.getFieldProps('employmentType')}>
              <option value="">Select Type</option>
              <option value="W2-Contract">W2-Contract</option>
              <option value="Corp-Corp">Corp-Corp</option>
              <option value="1099-Contract">1099-Contract</option>
            </select>
          </div>
        </div>

        <div className="grid-3">
          <div className="auth-form-group">
            <label className="auth-label">Start Date *</label>
            <div className="auth-password-wrapper">
              <DatePicker
                className="auth-input w-100"
                maxDate={new Date("2099-12-31")}
                selected={
                  formik.values.startDate
                    ? new Date(formik.values.startDate)
                    : null
                }
                onChange={(date) =>
                  formik.setFieldValue(
                    "startDate",
                    date ? date.toISOString().split('T')[0] : ""
                  )
                }
                dateFormat="dd MMM yyyy"
                placeholderText="dd MMM yyyy"
              />
              <Calendar
                size={16}
                className="auth-icon-left"
              />
            </div>
            {formik.touched.startDate && formik.errors.startDate && (
              <div className="auth-error">{formik.errors.startDate}</div>
            )}
          </div>
          <div className="auth-form-group">
            <label className="auth-label">End Date *</label>
            <div className="auth-password-wrapper">
              <DatePicker
                className="auth-input w-100"
                maxDate={new Date("2099-12-31")}
                selected={
                  formik.values.endDate
                    ? new Date(formik.values.endDate)
                    : null
                }
                onChange={(date) =>
                  formik.setFieldValue(
                    "endDate",
                    date ? date.toISOString().split('T')[0] : ""
                  )
                }
                dateFormat="dd MMM yyyy"
                placeholderText="dd MMM yyyy"
              />
              <Calendar
                size={16}
                className="auth-icon-left"
              />
            </div>
            {formik.touched.endDate && formik.errors.endDate && (
              <div className="auth-error">{formik.errors.endDate}</div>
            )}
          </div>
          <div className="auth-form-group">
            <label className="auth-label">Salary / Rate *</label>
            <input className="auth-input" name="salary" {...formik.getFieldProps('salary')} placeholder="e.g. $85/hr" />
          </div>
        </div>

        <div className="grid-3">
          <div className="auth-form-group">
            <label className="auth-label">Payment Cycle *</label>
            <select className="auth-input" name="paymentCycle" {...formik.getFieldProps('paymentCycle')}>
              <option value="Weekly">Weekly</option>
              <option value="Bi-Weekly">Bi-Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>
          <div className="auth-form-group">
            <label className="auth-label">Reporting Manager *</label>
            <input className="auth-input" name="reportingManager" {...formik.getFieldProps('reportingManager')} />
          </div>
          <div className="auth-form-group">
            <label className="auth-label">Notice Period *</label>
            <input className="auth-input" name="noticePeriod" {...formik.getFieldProps('noticePeriod')} />
          </div>
        </div>

        <div className="auth-form-group">
          <label className="auth-label">Terms & Conditions *</label>
          <textarea className="auth-input" rows="4" name="termsAndConditions" {...formik.getFieldProps('termsAndConditions')}></textarea>
        </div>

        <div className="d-flex justify-content-between mt-4">
          <button type="button" className="btn-secondary" onClick={() => setStep(1)}>Back</button>
          <button type="submit" className="btn-primary">Continue to Signature <ChevronRight size={16} /></button>
        </div>
      </form>
    </div>
  );

  const renderStep3 = () => (
    <div className="premium-card">
      <div className="section-header">
        <h3>Step 3: Signature & Agreement</h3>
      </div>
      <div className="alert-card info-theme mb-4" style={{ textAlign: 'left', padding: '16px', borderRadius: '12px', width: '100%' }}>
        <div className="d-flex gap-3">
          <ShieldCheck size={20} color="#3b82f6" />
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Electronic Signature Consent</div>
            <p style={{ margin: '4px 0 0', fontSize: 12 }}>By signing below, you agree to be legally bound by the terms and conditions outlined in this work order.</p>
          </div>
        </div>
      </div>

      <div className="sig-tabs">
        <button
          className={`sig-tab ${signatureType === 'draw' ? 'active' : ''}`}
          onClick={() => setSignatureType('draw')}
        >
          <PenTool size={14} className="me-2" /> Draw Signature
        </button>
        <button
          className={`sig-tab ${signatureType === 'upload' ? 'active' : ''}`}
          onClick={() => setSignatureType('upload')}
        >
          <Upload size={14} className="me-2" /> Upload Image
        </button>
      </div>

      {signatureType === 'draw' ? (
        <div className="sig-canvas-wrapper">
          <canvas
            ref={canvasRef}
            className="sig-canvas"
            width={700}
            height={200}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
          {!signatureData && (
            <div className="sig-canvas-placeholder">
              <PenTool size={24} />
              <span>Sign here using your mouse or touch</span>
            </div>
          )}
          <div className="sig-actions" style={{ position: 'absolute', right: 12, bottom: 12 }}>
            <button className="btn-secondary" style={{ padding: '4px 12px', fontSize: 11 }} onClick={clearSignature}>Clear</button>
          </div>
        </div>
      ) : (
        <div className="sig-canvas-wrapper" style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
          {signatureData ? (
            <img src={signatureData} alt="Signature" className="sig-preview" style={{ maxWidth: 300 }} />
          ) : (
            <Upload size={32} color="#cbd5e1" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => setSignatureData(reader.result);
                reader.readAsDataURL(file);
              }
            }}
            id="sig-upload"
            style={{ display: 'none' }}
          />
          <label htmlFor="sig-upload" className="btn-secondary" style={{ cursor: 'pointer' }}>
            {signatureData ? 'Change Image' : 'Select Signature Image'}
          </label>
        </div>
      )}

      <div className="acceptance-tracker mt-4">
        <div className="acceptance-tracker-title"><Users size={14} color="#f5810c" /> Mutual Acceptance Process</div>
        <div className="acceptance-party">
          <div className="party-info">
            <div className="party-avatar" style={{ background: '#f5810c' }}>HM</div>
            <div>
              <div className="party-name">{formik.values.clientCompany || 'Hiring Side'}</div>
              <div className="party-role">Authorized Signatory (Creator)</div>
            </div>
          </div>
          <div className="accept-btn done"><CheckCircle size={13} /> Signature Ready</div>
        </div>
        <div className="acceptance-party">
          <div className="party-info">
            <div className="party-avatar" style={{ background: '#3b82f6' }}>BS</div>
            <div>
              <div className="party-name">{formik.values.companyName || 'Vendor Side'}</div>
              <div className="party-role">Authorized Signatory (Acceptor)</div>
            </div>
          </div>
          <div className="accept-btn waiting"><Clock size={13} /> Waiting for Shared</div>
        </div>
      </div>

      <div className="d-flex justify-content-between mt-4">
        <button className="btn-secondary" onClick={() => setStep(2)}>Back</button>
        <button className="btn-primary" onClick={handleCreateContract} disabled={isSavingContract}>
          {isSavingContract ? 'Sharing Contract...' : 'Share Contract for Mutual Acceptance'} <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="premium-card">
      <div className="contract-confirm-screen">
        <div className="confirm-icon-wrap">
          <CheckCircle size={40} color="#fff" />
        </div>
        <h2 className="confirm-title">Contract Successfully Shared!</h2>
        <p className="confirm-sub">The contract has been sent to the Hiring Manager for mutual acceptance.</p>

        <div className="confirm-details-card">
          <div className="confirm-detail-row">
            <span className="confirm-detail-label">Job Title</span>
            <span className="confirm-detail-value">{formik.values.jobTitle}</span>
          </div>
          <div className="confirm-detail-row">
            <span className="confirm-detail-label">Candidate</span>
            <span className="confirm-detail-value">{formik.values.candidateName}</span>
          </div>
          <div className="confirm-detail-row">
            <span className="confirm-detail-label">Status</span>
            <span className="confirm-detail-value">
              <span className="contract-badge badge-shared">
                <span className="badge-dot" /> Shared
              </span>
            </span>
          </div>
        </div>

        <button className="btn-primary mt-4 w-100" onClick={() => navigate(`${basePath}/contract-listing`)}>
          Return to Contract Listing
        </button>
      </div>
    </div>
  );

  return (
    <div className="contract-page">
      <style>{`
        .auth-password-wrapper {
            position: relative;
            width: 100%;
        }
        .auth-icon-left {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: #94a3b8;
            pointer-events: none;
            z-index: 5;
        }
        .react-datepicker-wrapper {
            width: 100%;
        }
        .react-datepicker__input-container input {
            padding-left: 2.5rem !important;
        }
      `}</style>
      <ModuleHeader
        breadcrumb="Create New Work Order"
        title="Generate Work Order"
        description="Professional C2C Agreement Generation Wizard"
        badgeText="Contract Wizard"
        icon={FiFilePlus}
        customBreadcrumbs={[
          { label: "Dashboard", path: basePath === '/Admin' ? '/Admin/overview-dashboard' : '/user/user-dashboard', icon: <Home size={14} /> },
          { label: "Agreements", path: `${basePath}/contract-listing` }
        ]}
      />

      {/* Stepper */}
      <div className="contract-stepper">
        {[
          { id: 1, label: 'Selection' },
          { id: 2, label: 'Details' },
          { id: 3, label: 'Agreement' },
          { id: 4, label: 'Confirmation' },
        ].map((s, idx, arr) => (
          <React.Fragment key={s.id}>
            <div className={`contract-step-item ${step === s.id ? 'active' : ''} ${step > s.id ? 'completed' : ''}`}>
              <div className="contract-step-circle">
                {step > s.id ? <Check size={16} /> : s.id}
              </div>
              <span className="contract-step-label">{s.label}</span>
            </div>
            {idx < arr.length - 1 && (
              <div className={`contract-step-line ${step > s.id ? 'completed' : ''}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="dashboard-layout">
        <div className="dashboard-column-main">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </div>

        <div className="dashboard-column-side">
          <div className="premium-card" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertCircle size={16} color="#f5810c" />
              Compliance Note
            </h4>
            <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>
              This system supports standard contract-management practices commonly used in U.S. business applications.
            </p>
            <ul style={{ paddingLeft: 16, margin: '12px 0', fontSize: 11, color: '#64748b' }}>
              <li>ESIGN Act Compliance</li>
              <li>Mutual Acceptance Tracking</li>
              <li>Audit Timestamps</li>
              <li>Configurable Clauses</li>
            </ul>
            <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '10px', borderRadius: '8px', marginTop: 16 }}>
              <p style={{ fontSize: 10, color: '#92400e', margin: 0, fontStyle: 'italic' }}>
                Legal review is required before production use.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractCreate;
