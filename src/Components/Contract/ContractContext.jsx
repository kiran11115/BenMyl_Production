import React, { createContext, useState, useEffect } from 'react';
import { useGetAllContractsQuery } from '../../State-Management/Api/ContractApiSlice';

/* =========================================
   STATIC SEED DATA
   Simulates Bench Sales ↔ Hiring Manager contract workflow.
   Replace with API calls when backend is ready.
   ========================================= */
const SEED_CONTRACTS = [
  {
    id: 'CTR-2025-001',
    contractTitle: 'Senior React Developer - Contract',
    jobTitle: 'Senior React Developer',
    candidateName: 'Alex Johnson',
    candidateEmail: 'alex.johnson@email.com',
    candidatePhone: '+1 (555) 234-5678',
    clientCompany: 'TechCorp Solutions',
    companyName: '-',
    workLocation: 'Remote - San Francisco, CA',
    employmentType: 'W2-Contract',
    startDate: '2025-06-01',
    endDate: '2025-12-31',
    salary: '$85/hr',
    paymentCycle: 'Bi-Weekly',
    workingHours: '40 hrs/week',
    reportingManager: 'Sarah Mitchell',
    projectDuration: '6 Months',
    noticePeriod: '2 Weeks',
    taxInformation: '1099 - Independent Contractor',
    benefits: 'Health Insurance, Paid Time Off',
    additionalNotes: 'Candidate must have active US work authorization.',
    termsAndConditions: '[PLACEHOLDER - Legal review required] This agreement outlines the terms under which services are to be provided. All work product created during the engagement shall be considered work-for-hire. Confidentiality obligations survive termination of this agreement.',
    confidentialityClause: '[PLACEHOLDER] The contractor agrees to maintain strict confidentiality of all proprietary information.',
    ndaSection: '[PLACEHOLDER] Non-Disclosure Agreement terms apply per company NDA policy.',
    terminationPolicy: '[PLACEHOLDER] Either party may terminate with written notice per the notice period stated above.',
    status: 'Shared',
    createdDate: '2025-05-01',
    hiringManagerUser: 'Sarah Mitchell (Hiring Manager)',
    benchSalesUser: 'James Carter (Bench Sales)',
    hiringManagerAccepted: true,
    benchSalesAccepted: false,
    hiringManagerSignature: null,
    benchSalesSignature: null,
  },
  {
    id: 'CTR-2025-002',
    contractTitle: 'Full Stack Developer - Work Order',
    jobTitle: 'Full Stack Developer',
    candidateName: 'Priya Sharma',
    candidateEmail: 'priya.sharma@email.com',
    candidatePhone: '+1 (555) 345-6789',
    clientCompany: 'FinanceFlow Inc.',
    companyName: '-',
    workLocation: 'Hybrid - New York, NY',
    employmentType: 'Corp-Corp',
    startDate: '2025-05-15',
    endDate: '2025-11-15',
    salary: '$95/hr',
    paymentCycle: 'Weekly',
    workingHours: '40 hrs/week',
    reportingManager: 'David Chen',
    projectDuration: '6 Months',
    noticePeriod: '2 Weeks',
    taxInformation: 'Corp-Corp Arrangement',
    benefits: 'N/A (Corp-Corp)',
    additionalNotes: '',
    termsAndConditions: '[PLACEHOLDER - Legal review required] Services shall be rendered as per the Statement of Work attached herein.',
    confidentialityClause: '[PLACEHOLDER] Confidentiality terms per MSA.',
    ndaSection: '[PLACEHOLDER] NDA executed separately.',
    terminationPolicy: '[PLACEHOLDER] 2-week written notice required.',
    status: 'Completed',
    createdDate: '2025-04-20',
    benchSalesUser: 'James Carter (Bench Sales)',
    hiringManagerUser: 'David Chen (Hiring Manager)',
    benchSalesAccepted: true,
    hiringManagerAccepted: true,
    benchSalesSignature: null,
    hiringManagerSignature: null,
  },
  {
    id: 'CTR-2025-003',
    contractTitle: 'DevOps Engineer - Contract',
    jobTitle: 'DevOps Engineer',
    candidateName: 'Marcus Williams',
    candidateEmail: 'marcus.w@email.com',
    candidatePhone: '+1 (555) 456-7890',
    clientCompany: 'CloudScale Technologies',
    companyName: '-',
    workLocation: 'On-site - Austin, TX',
    employmentType: 'W2-Contract',
    startDate: '2025-06-15',
    endDate: '2026-06-14',
    salary: '$75/hr',
    paymentCycle: 'Bi-Weekly',
    workingHours: '40 hrs/week',
    reportingManager: 'Linda Torres',
    projectDuration: '12 Months',
    noticePeriod: '30 Days',
    taxInformation: 'W-2 Employee',
    benefits: 'Medical, Dental, Vision',
    additionalNotes: 'On-site presence required Mon–Wed.',
    termsAndConditions: '[PLACEHOLDER - Legal review required] Standard staffing agreement terms apply.',
    confidentialityClause: '[PLACEHOLDER] Strict confidentiality required for all client systems.',
    ndaSection: '[PLACEHOLDER] NDA signed on onboarding.',
    terminationPolicy: '[PLACEHOLDER] 30-day written notice.',
    status: 'Draft',
    createdDate: '2025-05-10',
    benchSalesUser: 'James Carter (Bench Sales)',
    hiringManagerUser: 'Linda Torres (Hiring Manager)',
    benchSalesAccepted: false,
    hiringManagerAccepted: false,
    benchSalesSignature: null,
    hiringManagerSignature: null,
  },
];

export const formatDate = (dateStr) => {
  if (!dateStr || dateStr === '-') return '-';
  try {
    if (typeof dateStr === 'string' && dateStr.includes('-') && !dateStr.includes('T')) {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const monthIdx = parseInt(parts[1], 10) - 1;
        const day = String(parseInt(parts[2], 10)).padStart(2, '0');
        const months = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        return `${day}-${months[monthIdx]}-${year}`;
      }
    }
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const day = String(date.getDate()).padStart(2, '0');
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  } catch (e) {
    return dateStr;
  }
};

export const mapApiContractToUI = (item) => {
  if (!item) return null;
  return {
    id: String(item.contractID || ''),
    contractID: item.contractID || 0,
    jobID: item.jobID || 0,
    candidateID: item.candidateID || 0,
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
    hiringManagerUser: 'Sarah Mitchell (Hiring Manager)',
    benchSalesUser: item.candidateName || 'Bench Sales Team',
    hiringManagerAccepted: item.signatureStatus_A === 'Signed' || !!item.signatureImagePath,
    benchSalesAccepted: item.signatureStatus_B === 'Signed' || !!(item.signatureImagePatbenchsales || item.signatureimagePatbenchsales),
    hiringManagerSignature: item.signatureImagePath || null,
    benchSalesSignature: item.signatureImagePatbenchsales || item.signatureimagePatbenchsales || null,
    createdBy: item.createdBy || null,
  };
};

export const ContractContext = createContext(null);

export const ContractProvider = ({ children }) => {
  const { data: apiContracts, isLoading } = useGetAllContractsQuery();
  const [contracts, setContracts] = useState([]);

  // Sync API contracts to state
  useEffect(() => {
    if (apiContracts && Array.isArray(apiContracts)) {
      const mapped = apiContracts.map(mapApiContractToUI).filter(Boolean);
      setContracts(mapped);
    }
  }, [apiContracts]);

  const addContract = (newContract) => {
    setContracts(prev => [newContract, ...prev]);
  };

  const updateContract = (updated) => {
    setContracts(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  return (
    <ContractContext.Provider value={{ contracts, addContract, updateContract, isLoading }}>
      {children}
    </ContractContext.Provider>
  );
};
