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
  AlertCircle,
  FileCheck,
  Lock,
  ArrowRight,
  RefreshCw,
  Info,
  ChevronDown
} from 'lucide-react';
import { FiArrowLeft, FiFilePlus } from 'react-icons/fi';
import { Home } from 'lucide-react';
import { toast } from 'react-toastify';
import { ContractContext, formatDate } from './ContractContext';
import ModuleHeader from "../Admin/Modules/ModuleHeader";
import { useGetGroupedJobTitlesQuery, useTalentPoolMutation } from "../../State-Management/Api/TalentPoolApiSlice";
import { useSaveContractMutation } from "../../State-Management/Api/ContractApiSlice";

import './contractwizard.css';
import 'react-datepicker/dist/react-datepicker.css';

// Validation Schema matches original fields (Phone and Email are optional now)
const validationSchema = Yup.object().shape({
  contractTitle: Yup.string().required('Contract Title is required'),
  clientCompany: Yup.string().required('Client Company is required'),
  candidateName: Yup.string().required('Candidate Name is required'),
  candidateEmail: Yup.string().email('Invalid email'),
  candidatePhone: Yup.string(),
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

  // 5-step wizard state
  const [step, setStep] = useState(1);
  const [activeSection, setActiveSection] = useState('org'); // For Step 2 collapsible panels

  // Generation step index (for Step 4 progress animation)
  const [generationStep, setGenerationStep] = useState(0);

  const [signatureType, setSignatureType] = useState('draw');
  const [signatureData, setSignatureData] = useState(null);
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);

  const userId = localStorage.getItem("CompanyId");
  const companyId = localStorage.getItem("logincompanyid");
  const userRoleRaw = localStorage.getItem("Role") || "";

  // Accurate Creator Role mapping
  const displayCreatorRole = useMemo(() => {
    const roleLower = userRoleRaw.toLowerCase();
    if (roleLower === 'recruiter') return 'Hiring Manager';
    if (roleLower === 'recruiter2') return 'Recruiter';
    if (roleLower === 'admin') return 'Admin';
    return userRoleRaw || 'Hiring Manager';
  }, [userRoleRaw]);

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

  // Formik setup
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
      termsAndConditions: 'This agreement outlines the terms under which professional services are to be rendered. All work product created during the engagement shall be considered work-for-hire and the sole property of the Creator Organization. Confidentiality obligations survive termination.',
      confidentialityClause: 'The contractor agrees to maintain strict confidentiality of all proprietary information, client intellectual property, and internal records.',
      ndaSection: 'Standard Non-Disclosure Agreement terms apply per company NDA policy.',
      terminationPolicy: 'Either party may terminate this agreement with written notice matching the notice period stated herein.',
      noticePeriod: '2 Weeks',
      taxInformation: '',
      benefits: '',
      additionalNotes: '',
    },
    validationSchema,
    onSubmit: (values) => {
      // Step 2 submit -> goes to Step 3 Review
      setStep(3);
    },
  });

  // Load candidate details when job changes
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
          // Filter shortlisted
          const shortlisted = res.filter(item => item.isshortlisted).map(item => ({
            id: item.employeeID,
            name: `${item.firstName} ${item.lastName}`,
            email: item.emailAddress,
            phone: item.phoneNumber || "",
            workLocation: item.workLocation || "",
            uploadedByName: item.uploadedByName || "", // opposite company from which talent is posted
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

  // Load Autosave values on Mount
  useEffect(() => {
    const saved = localStorage.getItem('benmyl_wizard_draft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        formik.setValues({ ...formik.initialValues, ...parsed });
      } catch (e) {
        console.warn("Could not restore draft values:", e);
      }
    }
  }, []);

  // Autosave triggers on Formik changes
  useEffect(() => {
    if (formik.dirty) {
      localStorage.setItem('benmyl_wizard_draft', JSON.stringify(formik.values));
    }
  }, [formik.values]);

  // Signature Canvas Drawing Engine
  useEffect(() => {
    if (step === 5 && signatureType === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#0f172a';
    }
  }, [step, signatureType]);

  const startDrawing = (e) => {
    isDrawing.current = true;
    draw(e);
  };

  const stopDrawing = () => {
    isDrawing.current = false;
    const canvas = canvasRef.current;
    if (canvas) {
      setSignatureData(canvas.toDataURL());
    }
  };

  const draw = (e) => {
    if (!isDrawing.current || !canvasRef.current) return;
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

  const clearSignature = () => {
    if (!canvasRef.current) return;
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

  // Auto Duration Calculation
  const computedDuration = useMemo(() => {
    if (!formik.values.startDate || !formik.values.endDate) return '';
    const start = new Date(formik.values.startDate);
    const end = new Date(formik.values.endDate);
    if (isNaN(start) || isNaN(end)) return '';
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 'Invalid dates';
    if (diffDays < 30) return `${diffDays} Day${diffDays > 1 ? 's' : ''}`;
    const months = (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth();
    return `${months} Month${months > 1 ? 's' : ''} (${diffDays} days)`;
  }, [formik.values.startDate, formik.values.endDate]);

  // Section completion checks for Step 2
  const sectionStatus = useMemo(() => {
    const orgFields = ['contractTitle', 'clientCompany'];
    const resFields = ['candidateName']; // Phone and email are not mandatory
    const engFields = ['jobTitle', 'employmentType', 'workLocation', 'startDate', 'endDate', 'salary', 'paymentCycle'];
    const manFields = ['reportingManager', 'noticePeriod'];
    const legFields = ['termsAndConditions'];

    const checkFields = (fields) => fields.every(f => !!formik.values[f] && !formik.errors[f]);

    return {
      org: checkFields(orgFields),
      res: checkFields(resFields),
      eng: checkFields(engFields),
      man: checkFields(manFields),
      leg: checkFields(legFields),
    };
  }, [formik.values, formik.errors]);

  // Step 4 Simulation trigger
  const runGenerationSimulation = () => {
    setStep(4);
    setGenerationStep(0);
    const intervals = [800, 1800, 2800, 3800, 4800];
    intervals.forEach((time, index) => {
      setTimeout(() => {
        setGenerationStep(index + 1);
        if (index === intervals.length - 1) {
          // Transition to Step 5 (Signature & Approval)
          setStep(5);
        }
      }, time);
    });
  };

  // Submit and create contract integration
  const handleSaveContractSubmit = async () => {
    if (!signatureData) {
      toast.error('Please provide signature before sharing.');
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

      // Signature Blob conversion
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
      localStorage.removeItem('benmyl_wizard_draft'); // Clean autosave draft
      setStep(6); // Success confirmation step
      toast.success("Contract created and shared successfully!");
    } catch (err) {
      console.error("Failed to create contract:", err);
      toast.error(err?.data?.message || err?.message || "Failed to create contract.");
    }
  };

  // Helper validation lists
  const validationErrors = Object.keys(formik.errors).map(key => ({
    field: key,
    message: formik.errors[key]
  }));

  return (
    <div className="contract-page">
      <ModuleHeader
        breadcrumb="Guided Contract experience"
        title="Benmyl Contract Wizard"
        description="Premium, enterprise-grade 5-step contract generation & execution workflow."
        badgeText="Contract Wizard"
        icon={FiFilePlus}
        customBreadcrumbs={[
          { label: "Dashboard", path: basePath === '/Admin' ? '/Admin/overview-dashboard' : '/User/user-dashboard', icon: <Home size={14} /> },
          { label: "Agreements", path: `${basePath}/contract-listing` }
        ]}
      />

      <div className="cw-shell">
        {/* Sticky Stepper Header */}
        {step <= 5 && (
          <div className="cw-progress-header">
            <div className="cw-progress-row">
              {[
                { id: 1, label: 'Selection', sub: 'Job & Candidate' },
                { id: 2, label: 'Details', sub: 'Terms & Conditions' },
                { id: 3, label: 'Review', sub: 'Legal Document' },
                { id: 4, label: 'Generation', sub: 'Progress Tracker' },
                { id: 5, label: 'Execution', sub: 'Sign & Share' }
              ].map((s, idx, arr) => (
                <React.Fragment key={s.id}>
                  <div className={`cw-progress-step ${step === s.id ? 'active' : ''} ${step > s.id ? 'done' : ''}`}>
                    <div className="cw-progress-num">
                      {step > s.id ? <Check size={16} /> : s.id}
                    </div>
                    <div className="cw-progress-info">
                      <span className="cw-progress-label">{s.label}</span>
                      <span className="cw-progress-sub">{s.sub}</span>
                    </div>
                  </div>
                  {idx < arr.length - 1 && (
                    <div className={`cw-progress-line ${step > s.id ? 'done' : ''} ${step === s.id ? 'active' : ''}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        <div className="cw-autosave">
          <span className="cw-autosave-dot"></span>
          <span>Draft Autosaved</span>
        </div>

        {/* ── STEP 1: CANDIDATE SELECTION ── */}
        {step === 1 && (
          <div className="cw-layout">
            <div className="cw-card">
              <div className="cw-card-header">
                <h3 className="cw-card-title">
                  <div className="cw-card-title-icon"><Users size={18} /></div>
                  Candidate & Position Selection
                </h3>
              </div>

<div className="d-flex gap-5 align-items-center mb-4">

              {/* Job selection dropdown */}
              <div className="cw-field mb-4">
                <label>Job Title / Open Position Role <span className="req">*</span></label>
                <select
                  className="auth-input w-100"
                  value={formik.values.jobTitle}
                  onChange={(e) => {
                    const selectedVal = e.target.value;
                    formik.setFieldValue('jobTitle', selectedVal);
                    formik.setFieldValue('candidateName', '');
                    formik.setFieldValue('candidateEmail', '');
                    formik.setFieldValue('candidatePhone', '');
                    formik.setFieldValue('companyName', 'BenMyl Staffing');
                  }}
                >
                  <option value="">-- Select Open Position Role --</option>
                  {isJobsLoading ? (
                    <option disabled>Loading open roles...</option>
                  ) : (
                    jobs.map(j => (
                      <option key={j.id} value={j.title}>{j.title} ({j.company})</option>
                    ))
                  )}
                </select>
              </div>

              {/* Candidate Selection dropdown (no personal emails shown) */}
              {formik.values.jobTitle && (
                <div className="cw-field mb-4 w-50">
                  <label>Shortlisted Candidates for Role <span className="req">*</span></label>
                  {isCandidatesLoading ? (
                    <div className="text-muted p-2"><RefreshCw className="animate-spin inline me-2" size={14} /> Fetching candidates...</div>
                  ) : candidates.length === 0 ? (
                    <div className="alert-card info-theme p-3" style={{ fontSize: 13 }}>No shortlisted candidates are mapped to this job position.</div>
                  ) : (
                    <select
                      className="auth-input w-100"
                      value={formik.values.candidateName}
                      onChange={(e) => {
                        const selectedName = e.target.value;
                        const c = candidates.find(cand => cand.name === selectedName);
                        if (c) {
                          formik.setFieldValue('candidateName', c.name);
                          formik.setFieldValue('candidateEmail', c.email);
                          formik.setFieldValue('candidatePhone', c.phone);

                          // Determine roles & company name mappings
                          const loggedInComp = localStorage.getItem("CompanyName") || "BenMyl Staffing";
                          const candidateComp = c.uploadedByName || "BenMyl Staffing";

                          const roleLower = userRoleRaw.toLowerCase();
                          if (roleLower === 'benchsales') {
                            formik.setFieldValue('companyName', loggedInComp);
                            formik.setFieldValue('clientCompany', candidateComp);
                          } else {
                            formik.setFieldValue('clientCompany', loggedInComp);
                            formik.setFieldValue('companyName', candidateComp);
                          }

                          if (c.workLocation) {
                            formik.setFieldValue('workLocation', c.workLocation);
                          }
                        } else {
                          formik.setFieldValue('candidateName', '');
                          formik.setFieldValue('candidateEmail', '');
                          formik.setFieldValue('candidatePhone', '');
                          formik.setFieldValue('companyName', 'BenMyl Staffing');
                        }
                      }}
                    >
                      <option value="">-- Select Shortlisted Candidate --</option>
                      {candidates.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  )}
                </div>
              )}
</div>
              {/* Sticky bottom block */}
              <div className="cw-footer-actions">
                <button type="button" className="btn-secondary" disabled>Back</button>
                <button
                  type="button"
                  className="btn-v2-primary"
                  style={{ background: '#f5810c', color: '#fff', display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: '10px' }}
                  onClick={() => {
                    if (formik.values.jobTitle && formik.values.candidateName) {
                      setStep(2);
                    } else {
                      toast.error('Select both Job and Candidate to continue');
                    }
                  }}
                >
                  Approve Candidate & Continue <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* SIDE PANEL: SUMMARY */}
            <div className="cw-summary-panel">
              <h4 className="cw-summary-title"><Building2 size={16} /> Selection Overview</h4>

              <div className="cw-summary-row">
                <span className="cw-summary-label">Selected Job:</span>
                <span className={`cw-summary-value ${!formik.values.jobTitle ? 'empty' : ''}`}>
                  {formik.values.jobTitle || 'None Selected'}
                </span>
              </div>
              <div className="cw-summary-row">
                <span className="cw-summary-label">Candidate Name:</span>
                <span className={`cw-summary-value ${!formik.values.candidateName ? 'empty' : ''}`}>
                  {formik.values.candidateName || 'None Selected'}
                </span>
              </div>
              <div className="cw-summary-row">
                <span className="cw-summary-label">Creator Company Name:</span>
                <span className="cw-summary-value">{formik.values.clientCompany || '-'}</span>
              </div>
              <div className="cw-summary-row">
                <span className="cw-summary-label">Vendor Company Name:</span>
                <span className="cw-summary-value">{formik.values.companyName || '-'}</span>
              </div>

              <div style={{ marginTop: '24px', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '11px', color: '#94a3b8' }}>
                <Info size={14} style={{ display: 'inline', marginRight: '6px', color: '#f5810c' }} />
                Selecting a candidate pulls contract rates, job titles, and company relationships based on selection source. Candidate emails are kept confidential.
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: WORK ORDER DETAILS ── */}
        {step === 2 && (
          <div className="cw-layout">
            <div className="cw-card">
              <div className="cw-card-header">
                <h3 className="cw-card-title">
                  <div className="cw-card-title-icon"><Building2 size={18} /></div>
                  Complete Work Order Terms
                </h3>
              </div>

              {/* Validation Error Summary */}
              {validationErrors.length > 0 && formik.submitCount > 0 && (
                <div className="cw-validation-box">
                  <div className="cw-validation-title">
                    <AlertCircle size={16} /> Validation Errors Found ({validationErrors.length})
                  </div>
                  <ul className="cw-validation-list">
                    {validationErrors.map((err, i) => (
                      <li key={i}><strong>{err.field}</strong>: {err.message}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 1. ORG INFO SECTION */}
              <div className={`cw-section ${activeSection === 'org' ? 'open' : ''} ${!sectionStatus.org && formik.submitCount > 0 ? 'has-error' : ''}`}>
                <div className="cw-section-head" onClick={() => setActiveSection(activeSection === 'org' ? '' : 'org')}>
                  <div className="cw-section-head-left">
                    <div className="cw-section-icon"><Building2 size={16} /></div>
                    <div>
                      <div className="cw-section-title">Organization Information</div>
                      <div className="cw-section-desc">Client company, vendor entities, agreement title</div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className={`cw-section-badge ${sectionStatus.org ? 'complete' : 'incomplete'}`}>
                      {sectionStatus.org ? 'Complete' : 'Incomplete'}
                    </span>
                    <ChevronDown size={18} className="cw-section-chevron" />
                  </div>
                </div>
                <div className="cw-section-body">
                  <div className="cw-grid-2">
                    <div className="cw-field mb-3">
                      <label>Contract Title <span className="req">*</span></label>
                      <input className="auth-input" name="contractTitle" {...formik.getFieldProps('contractTitle')} placeholder="e.g. Senior Backend Dev - SOW" />
                      {formik.touched.contractTitle && formik.errors.contractTitle && <div className="auth-error">{formik.errors.contractTitle}</div>}
                    </div>
                    <div className="cw-field mb-3">
                      <label>Creator Company Name <span className="req">*</span></label>
                      <input className="auth-input" name="clientCompany" {...formik.getFieldProps('clientCompany')} placeholder="e.g. Finance Inc." />
                      {formik.touched.clientCompany && formik.errors.clientCompany && <div className="auth-error">{formik.errors.clientCompany}</div>}
                    </div>
                    <div className="cw-field mb-3">
                      <label>Vendor Org (Opposite Company)</label>
                      <input className="auth-input bg-light" name="companyName" {...formik.getFieldProps('companyName')} readOnly />
                    </div>
                    <div className="cw-field mb-3">
                      <label>Creator Role</label>
                      <input className="auth-input bg-light" value={displayCreatorRole} readOnly />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. RESOURCE INFO SECTION (Email Hidden, Phone Optional) */}
              <div className={`cw-section ${activeSection === 'res' ? 'open' : ''} ${!sectionStatus.res && formik.submitCount > 0 ? 'has-error' : ''}`}>
                <div className="cw-section-head" onClick={() => setActiveSection(activeSection === 'res' ? '' : 'res')}>
                  <div className="cw-section-head-left">
                    <div className="cw-section-icon"><Users size={16} /></div>
                    <div>
                      <div className="cw-section-title">Resource Information</div>
                      <div className="cw-section-desc">Candidate name & optional contact details</div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className={`cw-section-badge ${sectionStatus.res ? 'complete' : 'incomplete'}`}>
                      {sectionStatus.res ? 'Complete' : 'Incomplete'}
                    </span>
                    <ChevronDown size={18} className="cw-section-chevron" />
                  </div>
                </div>
                <div className="cw-section-body">
                  <div className="cw-grid-2">
                    <div className="cw-field mb-3">
                      <label>Candidate Name <span className="req">*</span></label>
                      <input className="auth-input bg-light" {...formik.getFieldProps('candidateName')} readOnly />
                    </div>
                    <div className="cw-field mb-3">
                      <label>Candidate Phone</label>
                      <input className="auth-input" name="candidatePhone" {...formik.getFieldProps('candidatePhone')} placeholder="e.g. +1 555-0199" />
                      {formik.touched.candidatePhone && formik.errors.candidatePhone && <div className="auth-error">{formik.errors.candidatePhone}</div>}
                    </div>
                  </div>
                  {/* Hidden email input to preserve API payload integration */}
                  <input type="hidden" name="candidateEmail" {...formik.getFieldProps('candidateEmail')} />
                </div>
              </div>

              {/* 3. ENGAGEMENT INFO SECTION */}
              <div className={`cw-section ${activeSection === 'eng' ? 'open' : ''} ${!sectionStatus.eng && formik.submitCount > 0 ? 'has-error' : ''}`}>
                <div className="cw-section-head" onClick={() => setActiveSection(activeSection === 'eng' ? '' : 'eng')}>
                  <div className="cw-section-head-left">
                    <div className="cw-section-icon"><Calendar size={16} /></div>
                    <div>
                      <div className="cw-section-title">Engagement Information</div>
                      <div className="cw-section-desc">Duration, rate, employment type, location</div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className={`cw-section-badge ${sectionStatus.eng ? 'complete' : 'incomplete'}`}>
                      {sectionStatus.eng ? 'Complete' : 'Incomplete'}
                    </span>
                    <ChevronDown size={18} className="cw-section-chevron" />
                  </div>
                </div>
                <div className="cw-section-body">
                  <div className="cw-grid-3 mb-3">
                    <div className="cw-field">
                      <label>Project Role / Job Title <span className="req">*</span></label>
                      <input className="auth-input bg-light" {...formik.getFieldProps('jobTitle')} readOnly />
                    </div>
                    <div className="cw-field">
                      <label>Employment Type <span className="req">*</span></label>
                      <select className="auth-input" name="employmentType" {...formik.getFieldProps('employmentType')}>
                        <option value="">Select Type</option>
                        <option value="W2-Contract">W2-Contract</option>
                        <option value="Corp-Corp">Corp-Corp</option>
                        <option value="1099-Contract">1099-Contract</option>
                      </select>
                      {formik.touched.employmentType && formik.errors.employmentType && <div className="auth-error">{formik.errors.employmentType}</div>}
                    </div>
                    <div className="cw-field">
                      <label>Work Location <span className="req">*</span></label>
                      <input className="auth-input" name="workLocation" {...formik.getFieldProps('workLocation')} placeholder="City, State / Remote" />
                      {formik.touched.workLocation && formik.errors.workLocation && <div className="auth-error">{formik.errors.workLocation}</div>}
                    </div>
                  </div>

                  <div className="cw-grid-3 mb-3">
                    <div className="cw-field">
                      <label>Start Date <span className="req">*</span></label>
                      <div className="auth-password-wrapper">
                        <DatePicker
                          className="auth-input w-100"
                          maxDate={new Date("2099-12-31")}
                          selected={formik.values.startDate ? new Date(formik.values.startDate) : null}
                          onChange={(date) => formik.setFieldValue("startDate", date ? date.toLocaleDateString("en-CA") : "")}
                          dateFormat="dd-MMM-yyyy"
                          placeholderText="dd-MMM-yyyy"
                        />
                        <Calendar size={16} className="auth-icon-left" />
                      </div>
                      {formik.touched.startDate && formik.errors.startDate && <div className="auth-error">{formik.errors.startDate}</div>}
                    </div>

                    <div className="cw-field">
                      <label>End Date <span className="req">*</span></label>
                      <div className="auth-password-wrapper">
                        <DatePicker
                          className="auth-input w-100"
                          maxDate={new Date("2099-12-31")}
                          selected={formik.values.endDate ? new Date(formik.values.endDate) : null}
                          onChange={(date) => formik.setFieldValue("endDate", date ? date.toLocaleDateString("en-CA") : "")}
                          dateFormat="dd-MMM-yyyy"
                          placeholderText="dd-MMM-yyyy"
                        />
                        <Calendar size={16} className="auth-icon-left" />
                      </div>
                      {formik.touched.endDate && formik.errors.endDate && <div className="auth-error">{formik.errors.endDate}</div>}
                    </div>

                    <div className="cw-field">
                      <label>Salary / Rate <span className="req">*</span></label>
                      <input className="auth-input" name="salary" {...formik.getFieldProps('salary')} placeholder="e.g. $85/hr" />
                      {formik.touched.salary && formik.errors.salary && <div className="auth-error">{formik.errors.salary}</div>}
                    </div>
                  </div>

                  <div className="cw-grid-2">
                    <div className="cw-field">
                      <label>Payment Cycle <span className="req">*</span></label>
                      <select className="auth-input" name="paymentCycle" {...formik.getFieldProps('paymentCycle')}>
                        <option value="Weekly">Weekly</option>
                        <option value="Bi-Weekly">Bi-Weekly</option>
                        <option value="Monthly">Monthly</option>
                      </select>
                    </div>
                    {computedDuration && (
                      <div className="cw-duration-bar">
                        <Clock size={16} /> Calculated Contract Duration: {computedDuration}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 4. MANAGEMENT INFORMATION */}
              <div className={`cw-section ${activeSection === 'man' ? 'open' : ''} ${!sectionStatus.man && formik.submitCount > 0 ? 'has-error' : ''}`}>
                <div className="cw-section-head" onClick={() => setActiveSection(activeSection === 'man' ? '' : 'man')}>
                  <div className="cw-section-head-left">
                    <div className="cw-section-icon"><Clock size={16} /></div>
                    <div>
                      <div className="cw-section-title">Management Information</div>
                      <div className="cw-section-desc">Reporting manager & notice period constraints</div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className={`cw-section-badge ${sectionStatus.man ? 'complete' : 'incomplete'}`}>
                      {sectionStatus.man ? 'Complete' : 'Incomplete'}
                    </span>
                    <ChevronDown size={18} className="cw-section-chevron" />
                  </div>
                </div>
                <div className="cw-section-body">
                  <div className="cw-grid-2">
                    <div className="cw-field mb-3">
                      <label>Reporting Manager <span className="req">*</span></label>
                      <input className="auth-input" name="reportingManager" {...formik.getFieldProps('reportingManager')} placeholder="Reporting Manager Name" />
                      {formik.touched.reportingManager && formik.errors.reportingManager && <div className="auth-error">{formik.errors.reportingManager}</div>}
                    </div>
                    <div className="cw-field mb-3">
                      <label>Notice Period <span className="req">*</span></label>
                      <input className="auth-input" name="noticePeriod" {...formik.getFieldProps('noticePeriod')} placeholder="e.g. 2 Weeks" />
                      {formik.touched.noticePeriod && formik.errors.noticePeriod && <div className="auth-error">{formik.errors.noticePeriod}</div>}
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. LEGAL TERMS */}
              <div className={`cw-section ${activeSection === 'leg' ? 'open' : ''} ${!sectionStatus.leg && formik.submitCount > 0 ? 'has-error' : ''}`}>
                <div className="cw-section-head" onClick={() => setActiveSection(activeSection === 'leg' ? '' : 'leg')}>
                  <div className="cw-section-head-left">
                    <div className="cw-section-icon"><ShieldCheck size={16} /></div>
                    <div>
                      <div className="cw-section-title">Legal Terms</div>
                      <div className="cw-section-desc">Compliance scope, NDA clause, terms & conditions</div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className={`cw-section-badge ${sectionStatus.leg ? 'complete' : 'incomplete'}`}>
                      {sectionStatus.leg ? 'Complete' : 'Incomplete'}
                    </span>
                    <ChevronDown size={18} className="cw-section-chevron" />
                  </div>
                </div>
                <div className="cw-section-body">
                  <div className="cw-field mb-3">
                    <label>Terms & Conditions <span className="req">*</span></label>
                    <textarea className="auth-input" rows="4" name="termsAndConditions" {...formik.getFieldProps('termsAndConditions')}></textarea>
                    {formik.touched.termsAndConditions && formik.errors.termsAndConditions && <div className="auth-error">{formik.errors.termsAndConditions}</div>}
                  </div>
                  <div className="cw-field mb-3">
                    <label>Confidentiality Clause</label>
                    <textarea className="auth-input" rows="2" name="confidentialityClause" {...formik.getFieldProps('confidentialityClause')}></textarea>
                  </div>
                </div>
              </div>

              <div className="cw-footer-actions">
                <button type="button" className="btn-secondary" onClick={() => setStep(1)}>Back</button>
                <button type="button" className="btn-primary" onClick={() => {
                  formik.submitForm();
                }}>
                  Review Legal Document <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* SIDE PANEL: LIVE PREVIEW */}
            <div className="cw-summary-panel">
              <h4 className="cw-summary-title"><FileText size={16} /> Live SOW Preview</h4>
              <div className="cw-preview-mini">
                <div className="cw-preview-mini-row">
                  <span className="cw-preview-mini-label">Title</span>
                  <span className="cw-preview-mini-value">{formik.values.contractTitle || '-'}</span>
                </div>
                <div className="cw-preview-mini-row">
                  <span className="cw-preview-mini-label">Creator Org</span>
                  <span className="cw-preview-mini-value">{formik.values.clientCompany || '-'}</span>
                </div>
                <div className="cw-preview-mini-row">
                  <span className="cw-preview-mini-label">Vendor Org</span>
                  <span className="cw-preview-mini-value">{formik.values.companyName || '-'}</span>
                </div>
                <div className="cw-preview-mini-row">
                  <span className="cw-preview-mini-label">Candidate</span>
                  <span className="cw-preview-mini-value">{formik.values.candidateName || '-'}</span>
                </div>
                <div className="cw-preview-mini-row">
                  <span className="cw-preview-mini-label">Rate / Fee</span>
                  <span className="cw-preview-mini-value">{formik.values.salary || '-'}</span>
                </div>
                <div className="cw-preview-mini-row">
                  <span className="cw-preview-mini-label">Location</span>
                  <span className="cw-preview-mini-value">{formik.values.workLocation || '-'}</span>
                </div>
                <div className="cw-preview-mini-row">
                  <span className="cw-preview-mini-label">Notice</span>
                  <span className="cw-preview-mini-value">{formik.values.noticePeriod || '-'}</span>
                </div>
                <div className="cw-preview-mini-row">
                  <span className="cw-preview-mini-label">Start Date</span>
                  <span className="cw-preview-mini-value">{formik.values.startDate || '-'}</span>
                </div>
                <div className="cw-preview-mini-row">
                  <span className="cw-preview-mini-label">End Date</span>
                  <span className="cw-preview-mini-value">{formik.values.endDate || '-'}</span>
                </div>
              </div>

              <div style={{ marginTop: '24px', fontSize: '11px', color: '#94a3b8' }}>
                <ShieldCheck size={14} style={{ display: 'inline', marginRight: '6px', color: '#10b981' }} />
                Values filled on the left populate in real-time onto the final Article-structured contract template.
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: CONTRACT REVIEW ── */}
        {step === 3 && (
          <div className="cw-layout-full">
            <div className="cw-card mb-4">
              <div className="cw-card-header">
                <h3 className="cw-card-title">
                  <div className="cw-card-title-icon"><ShieldCheck size={18} /></div>
                  Legal Document Peer Review
                </h3>
                <span className="text-muted" style={{ fontSize: 12 }}>Pre-execution Draft</span>
              </div>

              <div className="cw-legal-doc">
                <div className="cw-legal-watermark">CONFIDENTIAL DRAFT</div>

                <div className="cw-legal-header">
                  <div>
                    <span className="cw-legal-org-label">Creator Organization</span>
                    <div className="cw-legal-org-name">{formik.values.clientCompany}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="cw-legal-org-label">Vendor Organization</span>
                    <div className="cw-legal-org-name accent">{formik.values.companyName}</div>
                  </div>
                </div>

                <div className="cw-legal-title-bar">
                  {formik.values.contractTitle}
                </div>

                <div className="cw-legal-grid">
                  <div>
                    <span className="cw-legal-field-label">Designated Resource</span>
                    <div className="cw-legal-field-value">{formik.values.candidateName}</div>
                  </div>
                  <div>
                    <span className="cw-legal-field-label">Project Position</span>
                    <div className="cw-legal-field-value">{formik.values.jobTitle}</div>
                  </div>
                  <div>
                    <span className="cw-legal-field-label">Employment Terms</span>
                    <div className="cw-legal-field-value">{formik.values.employmentType}</div>
                  </div>
                  <div>
                    <span className="cw-legal-field-label">Location / Site</span>
                    <div className="cw-legal-field-value">{formik.values.workLocation}</div>
                  </div>
                  <div>
                    <span className="cw-legal-field-label">Effective Commencement</span>
                    <div className="cw-legal-field-value">{formik.values.startDate}</div>
                  </div>
                  <div>
                    <span className="cw-legal-field-label">End Date Constraint</span>
                    <div className="cw-legal-field-value">{formik.values.endDate}</div>
                  </div>
                  <div>
                    <span className="cw-legal-field-label">Fees / Remittance Rate</span>
                    <div className="cw-legal-field-value">{formik.values.salary}</div>
                  </div>
                  <div>
                    <span className="cw-legal-field-label">Payment Cycle</span>
                    <div className="cw-legal-field-value">{formik.values.paymentCycle}</div>
                  </div>
                </div>

                <div className="cw-legal-article">
                  <h4>Article I: Scope of Engagement</h4>
                  <p>
                    This statement of work outlines professional services provided by <strong>{formik.values.companyName}</strong> through the designated resource <strong>{formik.values.candidateName}</strong> to the Creator Organization <strong>{formik.values.clientCompany}</strong>. The scope of assignment maps directly to duties aligned under the position of {formik.values.jobTitle}.
                  </p>
                </div>

                <div className="cw-legal-article">
                  <h4>Article II: Compliance & Terms</h4>
                  <div className="legal-quote">
                    {formik.values.termsAndConditions}
                  </div>
                </div>

                <div className="cw-legal-article">
                  <h4>Article III: Confidentiality & NDAs</h4>
                  <p>
                    {formik.values.confidentialityClause}
                  </p>
                </div>

                <div className="cw-legal-sig-grid">
                  <div>
                    <div className="cw-legal-sig-line"></div>
                    <div className="cw-legal-sig-name">Authorized Client Signatory</div>
                    <div className="cw-legal-sig-role">Hiring Manager representing {formik.values.clientCompany}</div>
                  </div>
                  <div>
                    <div className="cw-legal-sig-line"></div>
                    <div className="cw-legal-sig-name">Authorized Vendor Signatory</div>
                    <div className="cw-legal-sig-role">Bench Sales representing {formik.values.companyName}</div>
                  </div>
                </div>

                <div className="cw-legal-footer">
                  <span>REF ID: SECURE-WIZ-DRAFT-{Date.now().toString().slice(-6)}</span>
                  <span>CONFIDENTIAL MASTER SERVICE WORK ORDER</span>
                  <span>PAGE 1 OF 1</span>
                </div>
              </div>

              <div className="cw-footer-actions">
                <button type="button" className="btn-secondary" onClick={() => setStep(2)}>Back</button>
                <button type="button" className="btn-primary" onClick={runGenerationSimulation}>
                  Build & Generate Contract <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 4: GENERATION PROGRESS ── */}
        {step === 4 && (
          <div className="cw-card">
            <div className="cw-gen-container">
              <div className="cw-gen-ring">
                <div className="cw-gen-ring-inner">
                  <FileText size={36} color="#f5810c" />
                </div>
              </div>
              <h3 className="cw-gen-title">Secure Contract Assembly</h3>
              <p className="cw-gen-sub">Compiling details, appending NDAs, verifying compliance policies...</p>

              <div className="cw-gen-steps">
                {[
                  { label: 'Collecting Details', index: 0 },
                  { label: 'Preparing Document Layout', index: 1 },
                  { label: 'Generating Security Metadata & Trace ID', index: 2 },
                  { label: 'Generating Legal PDF Representation', index: 3 },
                  { label: 'Ready for Authentication & Execution', index: 4 }
                ].map((s) => (
                  <div
                    key={s.index}
                    className={`cw-gen-step ${generationStep === s.index ? 'active' : ''} ${generationStep > s.index ? 'done' : ''}`}
                  >
                    <div className="cw-gen-step-dot">
                      {generationStep > s.index ? <Check size={14} /> : s.index + 1}
                    </div>
                    <div className="cw-gen-step-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 5: APPROVAL & SIGNATURE ── */}
        {step === 5 && (
          <div className="cw-layout">
            <div className="cw-card">
              <div className="cw-card-header">
                <h3 className="cw-card-title">
                  <div className="cw-card-title-icon"><PenTool size={18} /></div>
                  Authentication & Execution
                </h3>
              </div>

              {/* Roles Summary Cards */}
              <div className="cw-approval-grid">
                <div className="cw-role-card">
                  <div className="cw-role-avatar creator">HM</div>
                  <div>
                    <div className="cw-role-name">Hiring Side Signatory</div>
                    <div className="cw-role-type">Creator: {displayCreatorRole}</div>
                  </div>
                  <span className="cw-role-badge active">Active</span>
                </div>
                <div className="cw-role-card">
                  <div className="cw-role-avatar approver">BS</div>
                  <div>
                    <div className="cw-role-name">Vendor Side Signatory</div>
                    <div className="cw-role-type">Approver: Bench Sales Representative</div>
                  </div>
                  <span className="cw-role-badge pending">Pending</span>
                </div>
              </div>

              {/* Consent alert banner */}
              <div className="alert-card info-theme mb-4" style={{ textAlign: 'left', padding: '16px', borderRadius: '12px' }}>
                <div className="d-flex gap-3">
                  <ShieldCheck size={20} color="#3b82f6" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>Electronic Consent Declaration</div>
                    <p style={{ margin: '4px 0 0', fontSize: 11 }}>By completing your signature below, you confirm absolute consent to executing this document digitally under active ESIGN compliance frameworks.</p>
                  </div>
                </div>
              </div>

              {/* Signature tabs selector */}
              <div className="sig-tabs">
                <button
                  className={`sig-tab ${signatureType === 'draw' ? 'active' : ''}`}
                  onClick={() => setSignatureType('draw')}
                >
                  Draw Signature
                </button>
                <button
                  className={`sig-tab ${signatureType === 'upload' ? 'active' : ''}`}
                  onClick={() => setSignatureType('upload')}
                >
                  Upload File
                </button>
              </div>

              {/* Canvas / File area */}
              {signatureType === 'draw' ? (
                <div className="sig-canvas-wrapper" style={{ height: 180 }}>
                  <canvas
                    ref={canvasRef}
                    className="sig-canvas"
                    width={700}
                    height={180}
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
                      <PenTool size={20} />
                      <span>Draw signature inside this canvas frame</span>
                    </div>
                  )}
                  <button className="btn-secondary" style={{ position: 'absolute', right: 12, bottom: 12, padding: '4px 12px', fontSize: 11 }} onClick={clearSignature}>Clear</button>
                </div>
              ) : (
                <div className="sig-canvas-wrapper" style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
                  {signatureData ? (
                    <img src={signatureData} alt="Signature Upload Preview" className="sig-preview" style={{ maxWidth: 260 }} />
                  ) : (
                    <Upload size={28} color="#cbd5e1" />
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
                    id="sig-upload-wizard"
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="sig-upload-wizard" className="btn-secondary" style={{ cursor: 'pointer' }}>
                    {signatureData ? 'Replace Image' : 'Select Image File'}
                  </label>
                </div>
              )}

              {/* Mutual acceptance audit trail timeline */}
              <div className="cw-audit">
                <h4 className="cw-audit-title"><Clock size={16} /> Audit Trail & History</h4>

                <div className="cw-audit-item done">
                  <div className="cw-audit-dot"><Check size={12} /></div>
                  <div className="cw-audit-content">
                    <div className="cw-audit-text">Hiring Manager created work order terms</div>
                    <div className="cw-audit-time">Just now • {new Date().toLocaleTimeString()}</div>
                  </div>
                </div>

                <div className="cw-audit-item active">
                  <div className="cw-audit-dot"><PenTool size={12} /></div>
                  <div className="cw-audit-content">
                    <div className="cw-audit-text">Hiring Manager authentication verification</div>
                    <div className="cw-audit-time">In progress</div>
                  </div>
                </div>

                <div className="cw-audit-item">
                  <div className="cw-audit-dot"><Lock size={12} /></div>
                  <div className="cw-audit-content">
                    <div className="cw-audit-text">Vendor Bench Sales signature request</div>
                    <div className="cw-audit-time">Awaiting shared stage</div>
                  </div>
                </div>
              </div>

              <div className="cw-footer-actions">
                <button type="button" className="btn-secondary" onClick={() => setStep(3)}>Back</button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleSaveContractSubmit}
                  disabled={isSavingContract}
                >
                  {isSavingContract ? 'Publishing SOW...' : 'Approve & Execute Contract'} <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* SIDE PANEL: AUDIT HISTORY */}
            <div className="cw-summary-panel">
              <h4 className="cw-summary-title"><ShieldCheck size={16} /> Security Metadata</h4>

              <div className="cw-summary-row">
                <span className="cw-summary-label">Trace Status</span>
                <span className="cw-summary-value text-success">Compliant</span>
              </div>
              <div className="cw-summary-row">
                <span className="cw-summary-label">Hashing</span>
                <span className="cw-summary-value">SHA-256 Enabled</span>
              </div>
              <div className="cw-summary-row">
                <span className="cw-summary-label">Signature Standard</span>
                <span className="cw-summary-value">ESIGN & UETA</span>
              </div>
              <div className="cw-summary-row">
                <span className="cw-summary-label">IP Logging</span>
                <span className="cw-summary-value">Automated</span>
              </div>

              <div style={{ marginTop: '24px', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '11px', color: '#94a3b8', lineHeight: 1.5 }}>
                <Lock size={14} style={{ display: 'inline', marginRight: '6px', color: '#f5810c' }} />
                Once fully executed, all parties receive an automated mail notifications containing trace keys to view secure PDF files.
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 6: CONFIRMATION ── */}
        {step === 6 && (
          <div className="cw-card">
            <div className="cw-success">
              <div className="cw-success-icon">
                <CheckCircle size={44} color="#fff" />
              </div>
              <h2 className="confirm-title">Contract Execution Initialized!</h2>
              <p className="confirm-sub">Agreement details have been validated, stored and shared with Bench Sales.</p>

              <div className="confirm-details-card mb-4" style={{ margin: '0 auto' }}>
                <div className="confirm-detail-row">
                  <span className="confirm-detail-label">Contract Title</span>
                  <span className="confirm-detail-value">{formik.values.contractTitle}</span>
                </div>
                <div className="confirm-detail-row">
                  <span className="confirm-detail-label">Designated Resource</span>
                  <span className="confirm-detail-value">{formik.values.candidateName}</span>
                </div>
                <div className="confirm-detail-row">
                  <span className="confirm-detail-label">Creator Organization</span>
                  <span className="confirm-detail-value">{formik.values.clientCompany}</span>
                </div>
                <div className="confirm-detail-row">
                  <span className="confirm-detail-label">Remittance Cycle</span>
                  <span className="confirm-detail-value">{formik.values.paymentCycle}</span>
                </div>
              </div>

              <button
                className="btn-primary mt-4"
                style={{ width: '100%', maxWidth: '360px', height: '48px', borderRadius: '10px' }}
                onClick={() => navigate(`${basePath}/contract-listing`)}
              >
                Go to Legal Documents Vault
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractCreate;
