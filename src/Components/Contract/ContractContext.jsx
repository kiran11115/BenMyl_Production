import React, { createContext, useState } from 'react';

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
    companyName: 'BenMyl Staffing',
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
    companyName: 'BenMyl Staffing',
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
    companyName: 'BenMyl Staffing',
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

export const ContractContext = createContext(null);

export const ContractProvider = ({ children }) => {
  const [contracts, setContracts] = useState(SEED_CONTRACTS);

  const addContract = (newContract) => {
    setContracts(prev => [newContract, ...prev]);
  };

  const updateContract = (updated) => {
    setContracts(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  return (
    <ContractContext.Provider value={{ contracts, addContract, updateContract }}>
      {children}
    </ContractContext.Provider>
  );
};
