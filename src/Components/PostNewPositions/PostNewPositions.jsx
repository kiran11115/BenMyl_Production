import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import {
  Briefcase, MapPin, DollarSign, Monitor,
  FileText, X, Building2, Check, ChevronDown, Calendar, Clock, Search, Shield,
  Award, FileCheck, UserCheck, Globe, UploadCloud, CheckSquare, Square, Users, Link as LinkIcon
} from 'lucide-react';
import { FiArrowLeft, FiLinkedin } from "react-icons/fi";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import JobTitleAutocomplete from './JobTitleAutocomplete';
import PreviewModal from './PreviewModal';
import {
  useGenerateJobDescriptionAIMutation,
  usePostJobMutation,
  useSaveJobPostingMutation,
  useSaveJobDraftMutation
} from '../../State-Management/Api/ProjectApiSlice';
import { useGetTokenDashboardQuery } from '../../State-Management/Api/AdminDetailsApiSlice';
import { Country, State, City } from 'country-state-city';

import '../Dashboard/Dashboard.css';
import '../Auth/Auth.css';
import './PostNewPositions.css';

/* =========================
   VALIDATION SCHEMAS
========================= */
const usValidationSchema = Yup.object().shape({
  jobTitle: Yup.string().required("Job Title is required"),
  companyName: Yup.string().required("Company Name is required"),
  location: Yup.string().required("Location is required"),
  employmentType: Yup.string().required("Employment Type is required"),
  salaryMin: Yup.number().typeError("Enter valid amount").required("Min Salary is Required"),
  salaryMax: Yup.number()
    .typeError("Enter valid amount")
    .when('salaryType', {
      is: (val) => val !== 'entireBudget' && val !== 'Fixed',
      then: (schema) => schema
        .required("Max Salary is Required")
        .moreThan(Yup.ref("salaryMin"), "Must be greater than Min"),
      otherwise: (schema) => schema.notRequired()
    }),
  description: Yup.string().min(20, "Minimum 20 characters").required("Required"),
  workModel: Yup.string().required("Required"),
  department: Yup.string().required("Required"),
  experienceLevel: Yup.string().required("Required"),
  educationLevel: Yup.string().required("Required"),
  yearsExperience: Yup.number().typeError("Enter number").required("Required"),
});

const indiaValidationSchema = Yup.object().shape({
  jobTitle: Yup.string().required("Job Title is required"),
  companyName: Yup.string().required("Company Name is required"),
  location: Yup.string().required("Location is required"),
  employmentType: Yup.string().required("Employment Type is required"),
  salaryMin: Yup.number().typeError("Enter valid amount").required("Min Salary is Required"),
  salaryMax: Yup.number()
    .typeError("Enter valid amount")
    .when('salaryType', {
      is: (val) => val !== 'entireBudget' && val !== 'Fixed',
      then: (schema) => schema
        .required("Max Salary is Required")
        .moreThan(Yup.ref("salaryMin"), "Must be greater than Min"),
      otherwise: (schema) => schema.notRequired()
    }),
  description: Yup.string().min(20, "Minimum 20 characters").required("Required"),
  workModel: Yup.string().required("Work mode is required"),
  department: Yup.string().required("Department is required"),
  yearsExperience: Yup.number().typeError("Enter number").required("Required"),
  highestQualification: Yup.string().required("Highest Qualification is required"),
  numberOfOpenings: Yup.number().typeError("Enter valid number").min(1, "At least 1 opening").required("Required"),
  aadhaarNumber: Yup.string().nullable(),
  panNumber: Yup.string().nullable(),
  portfolioURL: Yup.string().nullable(),
});

const PostNewPositions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.jobData;
  const isEdit = location.state?.isEdit;
  const JobID = location.state?.jobId;

  // Toggle for Form Region Version ("US" vs "IND") based on countryRegistration from localStorage (1: US form, 2: IND form)
  const getInitialFormRegion = () => {
    const countryRegistration = localStorage.getItem("countryRegistration");
    if (countryRegistration !== null && countryRegistration !== undefined && countryRegistration !== "") {
      const reg = Number(countryRegistration);
      if (reg === 1) return 'US';
      if (reg === 2) return 'IND';
    }
    if (editData?.formRegion) return editData.formRegion;
    if (editData?.country === 'India' || editData?.country === 'IN' || editData?.aadhaarNumber) return 'IND';
    return 'US';
  };

  const [formRegion, setFormRegion] = useState(getInitialFormRegion);

  const [showPreview, setShowPreview] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState([]);
  const [skillsTouched, setSkillsTouched] = useState(false);
  const [showCurrencyPopover, setShowCurrencyPopover] = useState(false);
  const currencyRef = useRef(null);
  const [generateAI, { isLoading: isAiLoading }] = useGenerateJobDescriptionAIMutation();

  const { data: tokenData } = useGetTokenDashboardQuery(undefined, { refetchOnMountOrArgChange: true });
  const remainingTokens = tokenData?.companydetails?.userAvailableTokens ?? 200;
  const isOutOfTokens = tokenData !== undefined && remainingTokens === 0;

  useEffect(() => {
    const countryRegStorage = localStorage.getItem("countryRegistration");
    const regVal = (countryRegStorage !== null && countryRegStorage !== undefined && countryRegStorage !== "")
      ? Number(countryRegStorage)
      : (tokenData?.companydetails?.countryRegistration !== undefined ? Number(tokenData.companydetails.countryRegistration) : null);

    if (regVal === 1) {
      setFormRegion('US');
    } else if (regVal === 2) {
      setFormRegion('IND');
    }
  }, [tokenData]);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const linkedinStatus = searchParams.get("linkedin");
    if (linkedinStatus === "posted") {
      toast.success("Posted successfully on LinkedIn 🎉");
      searchParams.delete("linkedin");
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  // Work Authorization states (US)
  const [workAuthorization, setWorkAuthorization] = useState({
    Citizenship: false,
    GC: false,
    H1B: false,
    EAD: false,
    OPT: false,
    CPT: false,
    H4: false
  });

  // Preferred Employment states (US)
  const [preferredEmployment, setPreferredEmployment] = useState({
    "Corp-Corp": false,
    "W2-Contract": false,
    "1099-Contract": false,
    "Contract to Hire": false
  });

  // Popover States
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isEmpOpen, setIsEmpOpen] = useState(false);
  const [showDeptPopover, setShowDeptPopover] = useState(false);
  const [showEduPopover, setShowEduPopover] = useState(false);
  const [showDurationPopover, setShowDurationPopover] = useState(false);
  const [showCountryPopover, setShowCountryPopover] = useState(false);
  const [showStatePopover, setShowStatePopover] = useState(false);
  const [showCityPopover, setShowCityPopover] = useState(false);
  const [showWorkModelPopover, setShowWorkModelPopover] = useState(false);
  const [showExpPopover, setShowExpPopover] = useState(false);
  const [showNoticePopover, setShowNoticePopover] = useState(false);
  const [showShiftPopover, setShowShiftPopover] = useState(false);
  const [showHighestQualPopover, setShowHighestQualPopover] = useState(false);
  const [showGradYearPopover, setShowGradYearPopover] = useState(false);

  const authRef = useRef(null);
  const empRef = useRef(null);
  const deptRef = useRef(null);
  const eduRef = useRef(null);
  const durationRef = useRef(null);
  const countryRef = useRef(null);
  const stateRef = useRef(null);
  const cityRef = useRef(null);
  const workModelRef = useRef(null);
  const expRef = useRef(null);
  const noticeRef = useRef(null);
  const shiftRef = useRef(null);
  const highestQualRef = useRef(null);
  const gradYearRef = useRef(null);

  const [currencies, setCurrencies] = useState(['USD', 'INR', 'EUR', 'GBP', 'CAD', 'AUD']);
  const [shareToLinkedIn, setShareToLinkedIn] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState(formRegion === 'IND' ? 'IN' : '');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const [countrySearch, setCountrySearch] = useState('');
  const [stateSearch, setStateSearch] = useState('');
  const [citySearch, setCitySearch] = useState('');

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const countries = Country.getAllCountries();

  // Initialize States for India if default region is IND
  useEffect(() => {
    if (formRegion === 'IND' && !selectedCountry) {
      setSelectedCountry('IN');
      setStates(State.getStatesOfCountry('IN'));
    }
  }, [formRegion]);

  const handleCountryChange = (countryCode) => {
    setSelectedCountry(countryCode);
    setSelectedState('');
    setSelectedCity('');
    setCountrySearch('');
    if (countryCode) {
      setStates(State.getStatesOfCountry(countryCode));
    } else {
      setStates([]);
    }
    setCities([]);

    const countryObj = Country.getCountryByCode(countryCode);
    formik.setFieldValue("location", countryObj ? countryObj.name : "");
    formik.setFieldValue("country", countryObj ? countryObj.name : "");

    if (countryObj && countryObj.currency) {
      const curr = countryObj.currency;
      if (!currencies.includes(curr)) {
        setCurrencies(prev => [...prev, curr]);
      }
      formik.setFieldValue("salaryCurrency", curr);
    }
  };

  const handleStateChange = (stateCode) => {
    setSelectedState(stateCode);
    setSelectedCity('');
    setStateSearch('');
    if (stateCode) {
      setCities(City.getCitiesOfState(selectedCountry, stateCode));
    } else {
      setCities([]);
    }

    const countryObj = Country.getCountryByCode(selectedCountry);
    const stateObj = State.getStateByCodeAndCountry(stateCode, selectedCountry);

    const locStr = [stateObj?.name, countryObj?.name].filter(Boolean).join(", ");
    formik.setFieldValue("location", locStr);
    formik.setFieldValue("state", stateObj ? stateObj.name : "");
  };

  const handleCityChange = (cityName) => {
    setSelectedCity(cityName);
    setCitySearch('');

    const countryObj = Country.getCountryByCode(selectedCountry);
    const stateObj = State.getStateByCodeAndCountry(selectedState, selectedCountry);

    const locStr = [cityName, stateObj?.name, countryObj?.name].filter(Boolean).join(", ");
    formik.setFieldValue("location", locStr);
    formik.setFieldValue("city", cityName);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (authRef.current && !authRef.current.contains(event.target)) setIsAuthOpen(false);
      if (empRef.current && !empRef.current.contains(event.target)) setIsEmpOpen(false);
      if (currencyRef.current && !currencyRef.current.contains(event.target)) setShowCurrencyPopover(false);
      if (deptRef.current && !deptRef.current.contains(event.target)) setShowDeptPopover(false);
      if (eduRef.current && !eduRef.current.contains(event.target)) setShowEduPopover(false);
      if (durationRef.current && !durationRef.current.contains(event.target)) setShowDurationPopover(false);
      if (countryRef.current && !countryRef.current.contains(event.target)) setShowCountryPopover(false);
      if (stateRef.current && !stateRef.current.contains(event.target)) setShowStatePopover(false);
      if (cityRef.current && !cityRef.current.contains(event.target)) setShowCityPopover(false);
      if (workModelRef.current && !workModelRef.current.contains(event.target)) setShowWorkModelPopover(false);
      if (expRef.current && !expRef.current.contains(event.target)) setShowExpPopover(false);
      if (noticeRef.current && !noticeRef.current.contains(event.target)) setShowNoticePopover(false);
      if (shiftRef.current && !shiftRef.current.contains(event.target)) setShowShiftPopover(false);
      if (highestQualRef.current && !highestQualRef.current.contains(event.target)) setShowHighestQualPopover(false);
      if (gradYearRef.current && !gradYearRef.current.contains(event.target)) setShowGradYearPopover(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [postJob] = usePostJobMutation();
  const [saveJobPosting] = useSaveJobPostingMutation();
  const [saveJobDraft] = useSaveJobDraftMutation();
  const user = localStorage.getItem("CompanyId");
  const companyId = localStorage.getItem("logincompanyid");
  const companyname = localStorage.getItem("CompanyName");

  const autoFillRole = location.state?.autoFillRole || "";

  /* =========================
     FORMIK
  ========================= */
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      jobTitle: editData?.jobTitle || autoFillRole || '',
      companyName: editData?.companyName || companyname || '',
      location: editData?.location || '',
      country: editData?.country || (formRegion === 'IND' ? 'India' : ''),
      state: editData?.state || '',
      city: editData?.city || '',
      employmentType: editData?.employmentType || editData?.employeeType || '',
      employmentDuration: editData?.employmentDuration || editData?.jobDuration || '',
      jobDuration: editData?.jobDuration || '',
      salaryMin: editData?.minSalary || editData?.salaryRange_Min || '',
      salaryMax: editData?.maxSalary || editData?.salaryRange_Max || '',
      salaryCurrency: editData?.currency || editData?.salaryCurrency || (formRegion === 'IND' ? 'INR' : 'USD'),
      salaryType: editData?.salaryType || editData?.salarType || (formRegion === 'IND' ? 'perMonth' : 'perHour'),
      description: editData?.jobSummary || editData?.jobDescription || editData?.jobdetails || '',
      workModel: editData?.workMode || editData?.workModels || '',
      department: editData?.department || '',
      experienceLevel: editData?.experienceLevel || '',
      educationLevel: editData?.education || editData?.educationLevel || '',
      yearsExperience: editData?.experienceRequired || editData?.yearsOfExperience || editData?.yearsExperience || '',
      additionalReqs: editData?.additionalRequirements || '',
      JobStatus: editData?.jobStatus || editData?.JobStatus || 'active',

      // India Specific Fields
      numberOfOpenings: editData?.numberOfOpenings || 1,
      immediateJoiner: editData?.immediateJoiner ?? false,
      noticePeriod: editData?.noticePeriod || '30 Days',
      shiftType: editData?.shiftType || 'Day Shift',
      aadhaarNumber: editData?.aadhaarNumber || '',
      panNumber: editData?.panNumber || '',
      aadhaarPath: editData?.aadhaarPath || '',
      panPath: editData?.panPath || '',
      highestQualification: editData?.highestQualification || editData?.educationLevel || '',
      degreeCourse: editData?.degreeCourse || '',
      graduationYear: editData?.graduationYear || '',
      certificatePath: editData?.certificatePath || '',
      certifications: editData?.certifications || '',
      portfolioURL: editData?.portfolioURL || '',
      backgroundVerification: editData?.backgroundVerification ?? true,
      medicalFitness: editData?.medicalFitness ?? false,
      travelRequired: editData?.travelRequired ?? false,
      relocationRequired: editData?.relocationRequired ?? false,
      responsibilities: editData?.responsibilities || '',
      qualifications: editData?.qualifications || '',
      benefits: editData?.benefits || '',
    },
    validationSchema: formRegion === 'IND' ? indiaValidationSchema : usValidationSchema,
    onSubmit: () => {
      setSkillsTouched(true);
      if (skills.length === 0) return;
      setShowPreview(true);
    },
  });

  // Auto-select department based on jobTitle
  useEffect(() => {
    const title = formik.values.jobTitle?.toLowerCase() || '';
    if (!title) return;

    if (title.includes('engineer') || title.includes('developer') || title.includes('programmer') || title.includes('tech') || title.includes('architect')) {
      formik.setFieldValue('department', 'Engineering');
    } else if (title.includes('design') || title.includes('ui') || title.includes('ux') || title.includes('art')) {
      formik.setFieldValue('department', 'Design');
    } else if (title.includes('product') || title.includes('manager')) {
      formik.setFieldValue('department', 'Product');
    } else if (title.includes('sales') || title.includes('account') || title.includes('business')) {
      formik.setFieldValue('department', 'Sales');
    } else if (title.includes('market') || title.includes('seo')) {
      formik.setFieldValue('department', 'Marketing');
    } else if (title.includes('hr') || title.includes('human resources') || title.includes('recruit') || title.includes('talent')) {
      formik.setFieldValue('department', 'Human Resources');
    }
  }, [formik.values.jobTitle, formik.setFieldValue]);

  /* =========================
     POST JOB (API CALL)
  ========================= */
  const handlePostJob = async () => {
    if (!user) {
      toast.error("User session expired. Please login again.");
      return;
    }

    const countryObj = Country.getCountryByCode(selectedCountry);
    const stateObj = State.getStateByCodeAndCountry(selectedState, selectedCountry);
    const countryName = countryObj ? countryObj.name : (formik.values.country || "");
    const stateName = stateObj ? stateObj.name : (formik.values.state || "");
    const cityName = selectedCity || formik.values.city || "";

    const countryRegStorage = localStorage.getItem("countryRegistration");
    const countryRegistration = (countryRegStorage !== null && countryRegStorage !== undefined && countryRegStorage !== "")
      ? Number(countryRegStorage)
      : (formRegion === 'IND' ? 2 : 1);

    if (countryRegistration === 2 || (countryRegStorage === null && formRegion === 'IND')) {
      // 🇮🇳 INDIA VERSION (countryRegistration === 2): POST /api/uatcompany/SaveJobPosting (JSON Payload)
      const indPayload = {
        jobId: Number(isEdit ? JobID : 0),
        companyId: Number(companyId || 0),
        userId: Number(user || 0),
        jobTitle: formik.values.jobTitle || "",
        companyName: formik.values.companyName || "",
        employmentType: formik.values.employmentType || "",
        employmentDuration: formik.values.employmentDuration || formik.values.jobDuration || "",
        jobDuration: formik.values.jobDuration || "",
        country: countryName,
        state: stateName,
        city: cityName,
        salaryType: formik.values.salaryType || "",
        currency: formik.values.salaryCurrency || "INR",
        minSalary: Number(formik.values.salaryMin || 0),
        maxSalary: Number(formik.values.salaryMax || 0),
        workMode: formik.values.workModel || "",
        department: formik.values.department || "",
        experienceRequired: Number(formik.values.yearsExperience || 0),
        education: formik.values.educationLevel || formik.values.highestQualification || "",
        requiredSkills: skills.join(","),
        numberOfOpenings: Number(formik.values.numberOfOpenings || 1),
        immediateJoiner: Boolean(formik.values.immediateJoiner),
        noticePeriod: formik.values.noticePeriod || "",
        shiftType: formik.values.shiftType || "",
        aadhaarNumber: formik.values.aadhaarNumber || "",
        panNumber: formik.values.panNumber || "",
        aadhaarPath: formik.values.aadhaarPath || "",
        panPath: formik.values.panPath || "",
        highestQualification: formik.values.highestQualification || "",
        degreeCourse: formik.values.degreeCourse || "",
        graduationYear: Number(formik.values.graduationYear || 0),
        certificatePath: formik.values.certificatePath || "",
        certifications: formik.values.certifications || "",
        portfolioURL: formik.values.portfolioURL || "",
        backgroundVerification: Boolean(formik.values.backgroundVerification),
        medicalFitness: Boolean(formik.values.medicalFitness),
        travelRequired: Boolean(formik.values.travelRequired),
        relocationRequired: Boolean(formik.values.relocationRequired),
        jobSummary: formik.values.description || "",
        responsibilities: formik.values.responsibilities || "",
        qualifications: formik.values.qualifications || "",
        benefits: formik.values.benefits || "",
        jobStatus: formik.values.JobStatus || "active"
      };

      try {
        await saveJobPosting(indPayload).unwrap();
      } catch (err) {
        console.error("India Job Post Error:", err);
        throw err;
      }
    } else {
      // 🇺🇸 US VERSION: POST /api/uatcompany/postjob (FormData)
      const fd = new FormData();

      fd.append("JobID", isEdit ? JobID : 0);
      fd.append("userid", user);
      fd.append("JobTitle", formik.values.jobTitle);
      fd.append("CompanyName", formik.values.companyName);
      fd.append("Location", formik.values.location);
      fd.append("EmployeeType", formik.values.employmentType);

      fd.append("SalaryRange_min", formik.values.salaryMin || 0);
      fd.append("SalaryRange_max", formik.values.salaryMax || 0);
      fd.append("salaryUSD", formik.values.salaryCurrency === "USD" ? 1 : 0);

      fd.append("JobDescription", formik.values.description);
      fd.append("jobdetails", formik.values.description);

      fd.append("WorkModels", formik.values.workModel);
      fd.append("department", formik.values.department);
      fd.append("ExperienceLevel", formik.values.experienceLevel || `${formik.values.yearsExperience || 0} Years`);
      fd.append("EducationLevel", formik.values.educationLevel);
      fd.append("YearsofExperience", formik.values.yearsExperience || 0);

      fd.append("RequiredSkills", skills.join(","));
      fd.append("AdditionalRequirements", formik.values.additionalReqs || "");

      fd.append("CreatedBy", "Admin");
      fd.append("IsDraft", false);
      fd.append("CreatedOn", new Date().toISOString());
      fd.append("SalarType", formik.values.salaryType);
      fd.append("JobDuration", formik.values.jobDuration || "");
      fd.append("JobStatus", formik.values.JobStatus || "active");

      // 🔹 Work Authorization (US)
      fd.append("IsUSCitizen", workAuthorization.Citizenship);
      fd.append("IsGC", workAuthorization.GC);
      fd.append("IsH1B", workAuthorization.H1B);
      fd.append("IsEAD", workAuthorization.EAD);
      fd.append("IsOPT", workAuthorization.OPT);
      fd.append("IsCPT", workAuthorization.CPT);
      fd.append("IsH4", workAuthorization.H4);

      // 🔹 Preferred Employment (US)
      fd.append("IsCorpToCorp", preferredEmployment["Corp-Corp"]);
      fd.append("IsW2Contract", preferredEmployment["W2-Contract"]);
      fd.append("Is1099Contract", preferredEmployment["1099-Contract"]);
      fd.append("IsContractToHire", preferredEmployment["Contract to Hire"]);

      try {
        await postJob(fd).unwrap();
      } catch (err) {
        console.error("US Job Post Error:", err);
        throw err;
      }
    }
  };


  const handleSaveDraft = async () => {
    const fd = new FormData();

    fd.append("JobID", 0);
    fd.append("userid", user);
    fd.append("JobTitle", formik.values.jobTitle);
    fd.append("CompanyName", formik.values.companyName);
    fd.append("Location", formik.values.location);
    fd.append("EmployeeType", formik.values.employmentType);
    fd.append("SalaryRange_min", formik.values.salaryMin || 0);
    fd.append("SalaryRange_max", formik.values.salaryMax || 0);
    fd.append("salaryUSD", formik.values.salaryCurrency === "USD" ? 1 : 0);
    fd.append("JobDescription", formik.values.description);
    fd.append("jobdetails", formik.values.description);
    fd.append("WorkModels", formik.values.workModel);
    fd.append("department", formik.values.department);
    fd.append("ExperienceLevel", formik.values.experienceLevel);
    fd.append("EducationLevel", formik.values.educationLevel);
    fd.append("YearsofExperience", formik.values.yearsExperience || 0);
    fd.append("RequiredSkills", skills.join(","));
    fd.append("AdditionalRequirements", formik.values.additionalReqs);

    fd.append("CreatedBy", "Admin");
    fd.append("IsDraft", true);
    fd.append("CreatedOn", new Date().toISOString());
    fd.append("formRegion", formRegion);

    if (formRegion === "US") {
      fd.append("IsUSCitizen", workAuthorization.Citizenship);
      fd.append("IsGC", workAuthorization.GC);
      fd.append("IsH1B", workAuthorization.H1B);
      fd.append("IsEAD", workAuthorization.EAD);
      fd.append("IsOPT", workAuthorization.OPT);
      fd.append("IsCPT", workAuthorization.CPT);
      fd.append("IsH4", workAuthorization.H4);

      fd.append("IsCorpToCorp", preferredEmployment["Corp-Corp"]);
      fd.append("IsW2Contract", preferredEmployment["W2-Contract"]);
      fd.append("Is1099Contract", preferredEmployment["1099-Contract"]);
      fd.append("IsContractToHire", preferredEmployment["Contract to Hire"]);
    }

    fd.append("numberOfOpenings", formik.values.numberOfOpenings || 1);
    fd.append("immediateJoiner", formik.values.immediateJoiner);
    fd.append("noticePeriod", formik.values.noticePeriod || "");
    fd.append("shiftType", formik.values.shiftType || "");
    fd.append("aadhaarNumber", formik.values.aadhaarNumber || "");
    fd.append("panNumber", formik.values.panNumber || "");
    fd.append("aadhaarPath", formik.values.aadhaarPath || "");
    fd.append("panPath", formik.values.panPath || "");
    fd.append("highestQualification", formik.values.highestQualification || "");
    fd.append("degreeCourse", formik.values.degreeCourse || "");
    fd.append("graduationYear", formik.values.graduationYear || 0);
    fd.append("certificatePath", formik.values.certificatePath || "");
    fd.append("certifications", formik.values.certifications || "");
    fd.append("portfolioURL", formik.values.portfolioURL || "");
    fd.append("backgroundVerification", formik.values.backgroundVerification);
    fd.append("medicalFitness", formik.values.medicalFitness);
    fd.append("travelRequired", formik.values.travelRequired);
    fd.append("relocationRequired", formik.values.relocationRequired);
    fd.append("responsibilities", formik.values.responsibilities || "");
    fd.append("qualifications", formik.values.qualifications || "");
    fd.append("benefits", formik.values.benefits || "");
    fd.append("JobStatus", formik.values.JobStatus);

    try {
      await saveJobDraft(fd).unwrap();
      toast.success("Draft saved successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save draft");
    }
  };

  useEffect(() => {
    if (!editData) return;

    if (editData.requiredSkills) {
      setSkills(editData.requiredSkills.split(","));
    }

    if (editData.employeeType || editData.employmentType) {
      const typeStr = editData.employeeType || editData.employmentType || "";
      const types = typeStr.split(",");

      const updatedEmployment = {
        "Corp-Corp": false,
        "W2-Contract": false,
        "1099-Contract": false,
        "Contract to Hire": false
      };

      types.forEach(type => {
        const trimmed = type.trim();
        if (updatedEmployment.hasOwnProperty(trimmed)) {
          updatedEmployment[trimmed] = true;
        }
      });

      setPreferredEmployment(updatedEmployment);
      formik.setFieldValue("employmentType", typeStr);
    }

    setWorkAuthorization({
      Citizenship: editData?.isUSCitizen || editData?.IsUSCitizen || false,
      GC: editData?.isGC || editData?.IsGC || false,
      H1B: editData?.isH1B || editData?.IsH1B || false,
      EAD: editData?.isEAD || editData?.IsEAD || false,
      OPT: editData?.isOPT || editData?.IsOPT || false,
      CPT: editData?.isCPT || editData?.IsCPT || false,
      H4: editData?.isH4 || editData?.IsH4 || false
    });

    if (editData?.location) {
      const parts = editData.location.split(",").map(p => p.trim());
      if (parts.length > 0) {
        let matchedCountry = null;
        let matchedState = null;
        let matchedCity = null;

        const allCountries = Country.getAllCountries();
        for (let i = parts.length - 1; i >= 0; i--) {
          const p = parts[i];
          const c = allCountries.find(x => x.name.toLowerCase() === p.toLowerCase() || x.isoCode.toLowerCase() === p.toLowerCase());
          if (c) {
            matchedCountry = c;
            break;
          }
        }

        if (matchedCountry) {
          setSelectedCountry(matchedCountry.isoCode);
          const countryStates = State.getStatesOfCountry(matchedCountry.isoCode);
          setStates(countryStates);

          for (let i = parts.length - 1; i >= 0; i--) {
            const p = parts[i];
            if (p.toLowerCase() === matchedCountry.name.toLowerCase() || p.toLowerCase() === matchedCountry.isoCode.toLowerCase()) continue;
            const s = countryStates.find(x => x.name.toLowerCase() === p.toLowerCase() || x.isoCode.toLowerCase() === p.toLowerCase());
            if (s) {
              matchedState = s;
              break;
            }
          }

          if (matchedState) {
            setSelectedState(matchedState.isoCode);
            const stateCities = City.getCitiesOfState(matchedCountry.isoCode, matchedState.isoCode);
            setCities(stateCities);

            for (let i = parts.length - 1; i >= 0; i--) {
              const p = parts[i];
              if (
                p.toLowerCase() === matchedCountry.name.toLowerCase() ||
                p.toLowerCase() === matchedCountry.isoCode.toLowerCase() ||
                p.toLowerCase() === matchedState.name.toLowerCase() ||
                p.toLowerCase() === matchedState.isoCode.toLowerCase()
              ) continue;
              const cityMatch = stateCities.find(x => x.name.toLowerCase() === p.toLowerCase());
              if (cityMatch) {
                matchedCity = cityMatch;
                break;
              }
            }

            if (matchedCity) setSelectedCity(matchedCity.name);
          }
        }
      }
    }
  }, [editData]);

  const handleGenerateAI = async () => {
    const selectedEmpTypes = formRegion === 'US'
      ? Object.entries(preferredEmployment).filter(([_, v]) => v).map(([k]) => k).join(", ")
      : formik.values.employmentType;

    if (
      !formik.values.jobTitle ||
      !formik.values.companyName ||
      !selectedEmpTypes ||
      !formik.values.workModel ||
      !formik.values.yearsExperience ||
      skills.length === 0
    ) {
      toast.error("Please enter All Required Fields (Job Title, Company, Employment Type, Work Model, Experience, and at least one Skill)");
      return;
    }

    try {
      const payload = {
        jobTitle: formik.values.jobTitle,
        companyName: formik.values.companyName,
        employmentType: selectedEmpTypes,
        workModel: formik.values.workModel,
        education: formik.values.educationLevel || formik.values.highestQualification,
        experienceYears: formik.values.yearsExperience,
        skills: skills,
        region: formRegion
      };

      const res = await generateAI(payload).unwrap();
      let cleanedDescription = res?.description || res;

      if (typeof cleanedDescription === 'string') {
        cleanedDescription = cleanedDescription
          .replace(/Job Description:\s*/gi, '')
          .replace(/Required Skills:\s*/gi, '')
          .trim();
      }

      formik.setFieldValue("description", cleanedDescription);

    } catch (err) {
      console.error(err);
      toast.error("Failed to generate AI description");
    }
  };

  /* =========================
     SKILLS
  ========================= */
  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const modalData = {
    ...formik.values,
    formRegion,
    skills,
    currency: formik.values.salaryCurrency,
    additional: formik.values.additionalReqs,
    shareToLinkedIn,
    workAuthorization: {
      usCitizen: workAuthorization.Citizenship,
      gc: workAuthorization.GC,
      h1b: workAuthorization.H1B,
      ead: workAuthorization.EAD || workAuthorization.OPT || workAuthorization.CPT || workAuthorization.H4
    },
    preferredEmployment: {
      corpCorp: preferredEmployment["Corp-Corp"],
      w2Contract: preferredEmployment["W2-Contract"],
      contract1099: preferredEmployment["1099-Contract"],
      contractToHire: preferredEmployment["Contract to Hire"]
    }
  };

  const getInitials = (name) => {
    if (!name) return "ML";
    return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  };

  const currencySymbols = { USD: '$', INR: '₹', EUR: '€', GBP: '£', CAD: 'CA$', AUD: 'A$' };

  const getSalaryString = () => {
    const min = formik.values.salaryMin;
    const max = formik.values.salaryMax;
    const type = formik.values.salaryType;
    const curr = currencySymbols[formik.values.salaryCurrency] || (formRegion === 'IND' ? '₹' : '$');
    if (!min && !max) return null;
    if (type === 'entireBudget' || type === 'Fixed') return `${curr}${min} (Fixed)`;
    if (type === 'perAnnum') return `${curr}${min || '0'} - ${curr}${max || '0'} / Annum (CTC)`;
    return `${curr}${min || '0'} - ${curr}${max || '0'} / ${type === 'perHour' ? 'hr' : 'mo'}`;
  };

  const getDurationString = () => {
    const dur = formik.values.jobDuration || formik.values.employmentDuration;
    if (!dur) return null;
    if (dur === "0" || dur === "Ongoing") return "Ongoing Term";
    if (dur === "12" || dur === "1 Year") return "1 Year Term";
    return `${dur} Term`;
  };

  const getEmploymentTypeString = () => {
    const type = formik.values.employmentType;
    if (!type) return null;
    return type.split(",")[0];
  };

  const err = (name) =>
    formik.touched[name] && formik.errors[name] && (
      <div className="auth-error">{formik.errors[name]}</div>
    );

  return (
    <form onSubmit={formik.handleSubmit} className="ai-dashboard-wrapper">
      <input type="hidden" name="JobStatus" value={formik.values.JobStatus} />

      {/* HEADER CARD */}
      <div className="hero-section-wrapper mb-4">
        <div className="hero-card ">
          <div className="hero-concentric-lines"></div>
          <div className="hero-ripple-pattern"></div>
          <div className="hero-circular-highlights"></div>
          <div className="hero-left">
            <div className="hero-pill">
              ✦ Create New Vacancy ({formRegion === 'IND' ? 'India' : 'US'} Region)
            </div>
            <h1 className="job-posting-title text-white">Talent & Vacancies Board</h1>
            <div className="job-posting-header-info">
              <p className="job-posting-subtitle">
                Configure tailored job descriptions, compliance details, and candidate requirements for {formRegion === 'IND' ? 'India' : 'US'} hiring pools.
              </p>
            </div>
          </div>

          <div className="hero-buttons">
            <button
              type="button"
              className="routine-btn"
              onClick={() => {
                const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
                const targetPath = window.location.pathname.toLowerCase().startsWith('/admin') ? `${basePath}/admin-posted-jobs` : `${basePath}/user-posted-jobs`;
                navigate(targetPath);
              }}
            >
              <FiArrowLeft /> Back to Posted jobs
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
            <img src="/Images/file.png" alt="Dashboard Illustration" className="hero-svg-image" />
          </div>
        </div>
      </div>

      <div className="dashboard-layout">

        {/* ================= MAIN FORM ================= */}
        <div className="dashboard-column-main">
          {isOutOfTokens && (
            <div className="alert-insufficient-tokens" style={{
              backgroundColor: '#fef2f2',
              border: '1.5px solid #fca5a5',
              borderRadius: '12px',
              padding: '16px 20px',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  backgroundColor: '#fee2e2',
                  padding: '8px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Shield size={20} color="#dc2626" />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#991b1b' }}>
                    Insufficient tokens to post
                  </h4>
                  <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#b91c1c' }}>
                    Your remaining token balance is 0. Please top up or upgrade your plan to publish vacancies.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate(window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin/admin-subscription' : '/user/user-subscription')}
                style={{
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 18px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 4px rgba(220, 38, 38, 0.15)'
                }}
              >
                Go to Subscription
              </button>
            </div>
          )}

          {/* REGION INFORMATION BANNER (NON-TOGGLEABLE) */}
          <div className="region-toggle-card mb-4" style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '16px 24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe size={18} style={{ color: '#5B5BD6' }} />
                <span>Job Posting Form Standard: {formRegion === 'IND' ? '🇮🇳 India Specification' : '🇺🇸 US Specification'}</span>
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                Form specification configured based on your company's registration ({formRegion === 'IND' ? 'India' : 'US'}).
              </p>
            </div>
            <div>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '700',
                background: formRegion === 'IND' ? '#fff7ed' : '#eff6ff',
                color: formRegion === 'IND' ? '#c2410c' : '#1d4ed8',
                border: `1px solid ${formRegion === 'IND' ? '#ffedd5' : '#dbeafe'}`
              }}>
                {formRegion === 'IND' ? '🇮🇳 India Form Active' : '🇺🇸 US Form Active'}
              </span>
            </div>
          </div>

          <div className="premium-card">

            <h2 className="font-display mb-1" style={{ fontSize: "16px", fontWeight: 700, color: "#1F2937", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Configure {formRegion === 'IND' ? 'India' : 'US'} Vacancy Blueprint
            </h2>
            <p className="muted small mb-4" style={{ fontSize: "12px", color: "#6B7280" }}>
              Fields indicated with a red asterisk (<span style={{ color: '#ef4444' }}>*</span>) are mandatory values.
            </p>

            {/* BASIC INFO */}
            <div style={{ marginBottom: '40px' }}>
              <span className="status-tag status-progress font-mono mb-3 d-inline-block" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', background: '#eef2f6', color: '#5B5BD6', padding: '4px 10px', borderRadius: '6px', fontWeight: 'bold' }}>
                1. Basic Information
              </span>

              <div className="grid-4">
                <div>
                  <label className="auth-label">Job Title<span style={{ color: '#ef4444' }}> *</span></label>
                  <JobTitleAutocomplete
                    name="jobTitle"
                    value={formik.values.jobTitle}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={err("jobTitle")}
                  />
                </div>

                <div>
                  <label className="auth-label">Duration</label>
                  <div className="currency-popover-anchor" ref={durationRef} style={{ width: '100%' }}>
                    <button
                      type="button"
                      className="auth-input placeholder-text"
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: '#fff', width: '100%', height: '42px', padding: '10px 12px' }}
                      onClick={() => setShowDurationPopover(v => !v)}
                    >
                      <span style={{ fontSize: '14px', color: formik.values.jobDuration !== "" ? '#0f172a' : '#94a3b8' }}>
                        {formik.values.jobDuration !== "" ? (
                          { "1": "1 Month", "3": "3 Months", "6": "6 Months", "12": "1 Year", "0": "Ongoing / Permanent" }[formik.values.jobDuration] || formik.values.jobDuration
                        ) : 'Select duration'}
                      </span>
                      <ChevronDown size={16} className={`chevron ${showDurationPopover ? 'rotate' : ''}`} style={{ color: '#94a3b8' }} />
                    </button>
                    {showDurationPopover && (
                      <div className="currency-popover" style={{ width: '100%' }}>
                        {[
                          { v: "1", l: "1 Month" },
                          { v: "3", l: "3 Months" },
                          { v: "6", l: "6 Months" },
                          { v: "12", l: "1 Year" },
                          { v: "0", l: "Ongoing / Permanent" }
                        ].map(d => (
                          <button
                            key={d.v}
                            type="button"
                            className={`currency-option ${formik.values.jobDuration === d.v ? 'selected' : ''}`}
                            onClick={() => {
                              formik.setFieldValue('jobDuration', d.v);
                              formik.setFieldValue('employmentDuration', d.l);
                              setShowDurationPopover(false);
                            }}
                          >
                            <span className="currency-option-sym" style={{ color: '#1F2937', fontWeight: 500 }}>{d.l}</span>
                            {formik.values.jobDuration === d.v && <Check size={12} style={{ marginLeft: 'auto', color: '#5B5BD6' }} />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {err("jobDuration")}
                </div>

                <div>
                  <label className="auth-label">Company<span style={{ color: '#ef4444' }}> *</span></label>
                  <input className="auth-input bg-light placeholder-text" name="companyName" placeholder="Company"
                    value={formik.values.companyName} onChange={formik.handleChange} onBlur={formik.handleBlur} disabled style={{ cursor: "not-allowed" }} />
                  {err("companyName")}
                </div>

                {formRegion === 'US' ? (
                  <div>
                    <label className="auth-label">Employment Type<span style={{ color: '#ef4444' }}> *</span></label>
                    <div className="vendor-section" ref={empRef}>
                      <div className="auth-input placeholder-text" onClick={() => setIsEmpOpen(!isEmpOpen)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                        <span className="placeholder-text">Select US Type</span>
                        <ChevronDown size={16} className={`chevron ${isEmpOpen ? 'rotate' : ''}`} />
                      </div>
                      {isEmpOpen && (
                        <div className="vendor-list">
                          {Object.keys(preferredEmployment).map(type => (
                            <label key={type} className="checkbox-row">
                              <input
                                type="checkbox"
                                checked={preferredEmployment[type]}
                                onChange={() => {
                                  const nextState = { ...preferredEmployment, [type]: !preferredEmployment[type] };
                                  setPreferredEmployment(nextState);
                                  const selected = Object.entries(nextState).filter(([_, v]) => v).map(([k]) => k).join(", ");
                                  formik.setFieldValue("employmentType", selected);
                                }}
                              />
                              {type}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="modal-tags-row" style={{ marginTop: '8px' }}>
                      {Object.entries(preferredEmployment)
                        .filter(([_, v]) => v)
                        .map(([k]) => (
                          <span key={k} className="status-tag status-progress">{k}</span>
                        ))}
                    </div>
                    {err("employmentType")}
                  </div>
                ) : (
                  <div>
                    <label className="auth-label">Employment Type<span style={{ color: '#ef4444' }}> *</span></label>
                    <div className="currency-popover-anchor" ref={empRef} style={{ width: '100%' }}>
                      <button
                        type="button"
                        className="auth-input placeholder-text"
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: '#fff', width: '100%', height: '42px', padding: '10px 12px' }}
                        onClick={() => setIsEmpOpen(v => !v)}
                      >
                        <span style={{ fontSize: '14px', color: formik.values.employmentType ? '#0f172a' : '#94a3b8' }}>
                          {formik.values.employmentType || 'Select Employment Type'}
                        </span>
                        <ChevronDown size={16} className={`chevron ${isEmpOpen ? 'rotate' : ''}`} style={{ color: '#94a3b8' }} />
                      </button>
                      {isEmpOpen && (
                        <div className="currency-popover" style={{ width: '100%' }}>
                          {["Full-time", "Part-time", "Contractual", "Internship", "Freelance"].map(et => (
                            <button
                              key={et}
                              type="button"
                              className={`currency-option ${formik.values.employmentType === et ? 'selected' : ''}`}
                              onClick={() => {
                                formik.setFieldValue('employmentType', et);
                                setIsEmpOpen(false);
                              }}
                            >
                              <span className="currency-option-sym" style={{ color: '#1F2937', fontWeight: 500 }}>{et}</span>
                              {formik.values.employmentType === et && <Check size={12} style={{ marginLeft: 'auto', color: '#5B5BD6' }} />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {err("employmentType")}
                  </div>
                )}
              </div>

              {/* INDIA SPECIFIC BASIC ROW */}
              {formRegion === 'IND' && (
                <div className="grid-4 mt-3">
                  <div>
                    <label className="auth-label">Shift Type</label>
                    <div className="currency-popover-anchor" ref={shiftRef} style={{ width: '100%' }}>
                      <button
                        type="button"
                        className="auth-input placeholder-text"
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: '#fff', width: '100%', height: '42px', padding: '10px 12px' }}
                        onClick={() => setShowShiftPopover(v => !v)}
                      >
                        <span style={{ fontSize: '14px', color: formik.values.shiftType ? '#0f172a' : '#94a3b8' }}>
                          {formik.values.shiftType || 'Day Shift'}
                        </span>
                        <ChevronDown size={16} className={`chevron ${showShiftPopover ? 'rotate' : ''}`} style={{ color: '#94a3b8' }} />
                      </button>
                      {showShiftPopover && (
                        <div className="currency-popover" style={{ width: '100%' }}>
                          {["Day Shift", "Night Shift", "Rotational Shift", "Flexible Shift"].map(st => (
                            <button
                              key={st}
                              type="button"
                              className={`currency-option ${formik.values.shiftType === st ? 'selected' : ''}`}
                              onClick={() => {
                                formik.setFieldValue('shiftType', st);
                                setShowShiftPopover(false);
                              }}
                            >
                              <span className="currency-option-sym" style={{ color: '#1F2937', fontWeight: 500 }}>{st}</span>
                              {formik.values.shiftType === st && <Check size={12} style={{ marginLeft: 'auto', color: '#5B5BD6' }} />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="auth-label">Number of Openings<span style={{ color: '#ef4444' }}> *</span></label>
                    <input
                      type="number"
                      min="1"
                      className="auth-input"
                      name="numberOfOpenings"
                      placeholder="e.g. 5"
                      value={formik.values.numberOfOpenings}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {err("numberOfOpenings")}
                  </div>

                  <div>
                    <label className="auth-label">Notice Period</label>
                    <div className="currency-popover-anchor" ref={noticeRef} style={{ width: '100%' }}>
                      <button
                        type="button"
                        className="auth-input placeholder-text"
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: '#fff', width: '100%', height: '42px', padding: '10px 12px' }}
                        onClick={() => setShowNoticePopover(v => !v)}
                      >
                        <span style={{ fontSize: '14px', color: formik.values.noticePeriod ? '#0f172a' : '#94a3b8' }}>
                          {formik.values.noticePeriod || '30 Days'}
                        </span>
                        <ChevronDown size={16} className={`chevron ${showNoticePopover ? 'rotate' : ''}`} style={{ color: '#94a3b8' }} />
                      </button>
                      {showNoticePopover && (
                        <div className="currency-popover" style={{ width: '100%' }}>
                          {["Immediate", "15 Days", "30 Days", "45 Days", "60 Days", "90 Days"].map(np => (
                            <button
                              key={np}
                              type="button"
                              className={`currency-option ${formik.values.noticePeriod === np ? 'selected' : ''}`}
                              onClick={() => {
                                formik.setFieldValue('noticePeriod', np);
                                setShowNoticePopover(false);
                              }}
                            >
                              <span className="currency-option-sym" style={{ color: '#1F2937', fontWeight: 500 }}>{np}</span>
                              {formik.values.noticePeriod === np && <Check size={12} style={{ marginLeft: 'auto', color: '#5B5BD6' }} />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', paddingTop: '24px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                      <input
                        type="checkbox"
                        name="immediateJoiner"
                        checked={formik.values.immediateJoiner}
                        onChange={formik.handleChange}
                        style={{ width: '18px', height: '18px', accentColor: '#f5810c' }}
                      />
                      <span>Immediate Joiner Required</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Cascading Location Dropdowns */}
              <fieldset className="coordinates-fieldset mt-4">
                <legend className="coordinates-legend">Location Coordinates <span style={{ color: '#ef4444' }}>*</span></legend>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                  <div className="placeholder-text">
                    <label className="auth-label">Select Country</label>
                    <div className="currency-popover-anchor" ref={countryRef} style={{ width: '100%' }}>
                      <button
                        type="button"
                        className="auth-input placeholder-text"
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: '#fff', width: '100%', height: '42px', padding: '10px 12px' }}
                        onClick={() => setShowCountryPopover(v => !v)}
                      >
                        <span style={{ fontSize: '14px', color: selectedCountry ? '#0f172a' : '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {selectedCountry ? countries.find(c => c.isoCode === selectedCountry)?.name : 'Select Country'}
                        </span>
                        <ChevronDown size={16} className={`chevron ${showCountryPopover ? 'rotate' : ''}`} style={{ color: '#94a3b8', minWidth: '16px' }} />
                      </button>
                      {showCountryPopover && (
                        <div className="currency-popover" style={{ width: '100%', maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                          <div style={{ padding: '8px', position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1, borderBottom: '1px solid #e2e8f0' }}>
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                              <Search size={14} style={{ position: 'absolute', left: '10px', color: '#64748b' }} />
                              <input
                                autoFocus
                                type="text"
                                placeholder="Search country..."
                                value={countrySearch}
                                onChange={(e) => setCountrySearch(e.target.value)}
                                style={{ width: '100%', padding: '8px 8px 8px 30px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none', color: '#0f172a', backgroundColor: '#f8fafc' }}
                                onClick={(e) => e.stopPropagation()}
                                onKeyDown={(e) => e.stopPropagation()}
                              />
                            </div>
                          </div>
                          {countries.filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase())).map(c => (
                            <button
                              key={c.isoCode}
                              type="button"
                              className={`currency-option ${selectedCountry === c.isoCode ? 'selected' : ''}`}
                              onClick={() => {
                                handleCountryChange(c.isoCode);
                                setShowCountryPopover(false);
                              }}
                            >
                              <span className="currency-option-sym" style={{ color: '#1F2937', fontWeight: 500 }}>{c.name}</span>
                              {selectedCountry === c.isoCode && <Check size={12} style={{ marginLeft: 'auto', color: '#5B5BD6', minWidth: '12px' }} />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="placeholder-text">
                    <label className="auth-label">Select State</label>
                    <div className={`currency-popover-anchor ${!selectedCountry || states.length === 0 ? 'disabled-opacity' : ''}`} ref={stateRef} style={{ width: '100%' }}>
                      <button
                        type="button"
                        className="auth-input placeholder-text"
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: (!selectedCountry || states.length === 0) ? 'not-allowed' : 'pointer', background: '#fff', width: '100%', height: '42px', padding: '10px 12px' }}
                        disabled={!selectedCountry || states.length === 0}
                        onClick={() => setShowStatePopover(v => !v)}
                      >
                        <span style={{ fontSize: '14px', color: selectedState ? '#0f172a' : '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {selectedState ? states.find(s => s.isoCode === selectedState)?.name : 'Select State'}
                        </span>
                        <ChevronDown size={16} className={`chevron ${showStatePopover ? 'rotate' : ''}`} style={{ color: '#94a3b8', minWidth: '16px' }} />
                      </button>
                      {showStatePopover && states.length > 0 && (
                        <div className="currency-popover" style={{ width: '100%', maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                          <div style={{ padding: '8px', position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1, borderBottom: '1px solid #e2e8f0' }}>
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                              <Search size={14} style={{ position: 'absolute', left: '10px', color: '#64748b' }} />
                              <input
                                autoFocus
                                type="text"
                                placeholder="Search state..."
                                value={stateSearch}
                                onChange={(e) => setStateSearch(e.target.value)}
                                style={{ width: '100%', padding: '8px 8px 8px 30px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none', color: '#0f172a', backgroundColor: '#f8fafc' }}
                                onClick={(e) => e.stopPropagation()}
                                onKeyDown={(e) => e.stopPropagation()}
                              />
                            </div>
                          </div>
                          {states.filter(s => s.name.toLowerCase().includes(stateSearch.toLowerCase())).map(s => (
                            <button
                              key={s.isoCode}
                              type="button"
                              className={`currency-option ${selectedState === s.isoCode ? 'selected' : ''}`}
                              onClick={() => {
                                handleStateChange(s.isoCode);
                                setShowStatePopover(false);
                              }}
                            >
                              <span className="currency-option-sym" style={{ color: '#1F2937', fontWeight: 500 }}>{s.name}</span>
                              {selectedState === s.isoCode && <Check size={12} style={{ marginLeft: 'auto', color: '#5B5BD6', minWidth: '12px' }} />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="placeholder-text">
                    <label className="auth-label">Select City</label>
                    <div className={`currency-popover-anchor ${!selectedState || cities.length === 0 ? 'disabled-opacity' : ''}`} ref={cityRef} style={{ width: '100%' }}>
                      <button
                        type="button"
                        className="auth-input placeholder-text"
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: (!selectedState || cities.length === 0) ? 'not-allowed' : 'pointer', background: '#fff', width: '100%', height: '42px', padding: '10px 12px' }}
                        disabled={!selectedState || cities.length === 0}
                        onClick={() => setShowCityPopover(v => !v)}
                      >
                        <span style={{ fontSize: '14px', color: selectedCity ? '#0f172a' : '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {selectedCity || 'Select City'}
                        </span>
                        <ChevronDown size={16} className={`chevron ${showCityPopover ? 'rotate' : ''}`} style={{ color: '#94a3b8', minWidth: '16px' }} />
                      </button>
                      {showCityPopover && cities.length > 0 && (
                        <div className="currency-popover" style={{ width: '100%', maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                          <div style={{ padding: '8px', position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1, borderBottom: '1px solid #e2e8f0' }}>
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                              <Search size={14} style={{ position: 'absolute', left: '10px', color: '#64748b' }} />
                              <input
                                autoFocus
                                type="text"
                                placeholder="Search city..."
                                value={citySearch}
                                onChange={(e) => setCitySearch(e.target.value)}
                                style={{ width: '100%', padding: '8px 8px 8px 30px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none', color: '#0f172a', backgroundColor: '#f8fafc' }}
                                onClick={(e) => e.stopPropagation()}
                                onKeyDown={(e) => e.stopPropagation()}
                              />
                            </div>
                          </div>
                          {cities.filter(c => c.name.toLowerCase().includes(citySearch.toLowerCase())).map(c => (
                            <button
                              key={c.name}
                              type="button"
                              className={`currency-option ${selectedCity === c.name ? 'selected' : ''}`}
                              onClick={() => {
                                handleCityChange(c.name);
                                setShowCityPopover(false);
                              }}
                            >
                              <span className="currency-option-sym" style={{ color: '#1F2937', fontWeight: 500 }}>{c.name}</span>
                              {selectedCity === c.name && <Check size={12} style={{ marginLeft: 'auto', color: '#5B5BD6', minWidth: '12px' }} />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {err("location")}
              </fieldset>

              <div style={{ display: 'grid', gridTemplateColumns: formik.values.salaryType === 'entireBudget' || formik.values.salaryType === 'Fixed' ? 'repeat(4, 1fr)' : 'repeat(5, 1fr)', gap: '20px', marginBottom: '24px', alignItems: 'start' }}>
                {formRegion === 'US' ? (
                  <div>
                    <label className="auth-label">Work Authorization/Visa</label>
                    <div className="vendor-section" ref={authRef}>
                      <div className="auth-input placeholder-text" onClick={() => setIsAuthOpen(!isAuthOpen)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                        <span className="placeholder-text">Select Visa</span>
                        <ChevronDown size={16} className={`chevron ${isAuthOpen ? 'rotate' : ''}`} />
                      </div>
                      {isAuthOpen && (
                        <div className="vendor-list">
                          {Object.keys(workAuthorization).map(auth => (
                            <label key={auth} className="checkbox-row">
                              <input
                                type="checkbox"
                                checked={workAuthorization[auth]}
                                onChange={() => setWorkAuthorization(prev => ({ ...prev, [auth]: !prev[auth] }))}
                              />
                              {auth}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="modal-tags-row" style={{ marginTop: '8px' }}>
                      {Object.entries(workAuthorization)
                        .filter(([_, v]) => v)
                        .map(([k]) => (
                          <span key={k} className="status-tag status-progress">{k}</span>
                        ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="auth-label">Work Mode<span style={{ color: '#ef4444' }}> *</span></label>
                    <div className="currency-popover-anchor" ref={workModelRef} style={{ width: '100%' }}>
                      <button
                        type="button"
                        className="auth-input placeholder-text"
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: '#fff', width: '100%', height: '42px', padding: '10px 12px' }}
                        onClick={() => setShowWorkModelPopover(v => !v)}
                      >
                        <span style={{ fontSize: '14px', color: formik.values.workModel ? '#0f172a' : '#94a3b8' }}>
                          {formik.values.workModel || 'Select mode'}
                        </span>
                        <ChevronDown size={16} className={`chevron ${showWorkModelPopover ? 'rotate' : ''}`} style={{ color: '#94a3b8' }} />
                      </button>
                      {showWorkModelPopover && (
                        <div className="currency-popover" style={{ width: '100%' }}>
                          {["On-site", "Remote", "Hybrid"].map(m => (
                            <button
                              key={m}
                              type="button"
                              className={`currency-option ${formik.values.workModel === m ? 'selected' : ''}`}
                              onClick={() => {
                                formik.setFieldValue('workModel', m);
                                setShowWorkModelPopover(false);
                              }}
                            >
                              <span className="currency-option-sym" style={{ color: '#1F2937', fontWeight: 500 }}>{m}</span>
                              {formik.values.workModel === m && <Check size={12} style={{ marginLeft: 'auto', color: '#5B5BD6' }} />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {err("workModel")}
                  </div>
                )}

                <div className='mb-3'>
                  <label className="auth-label">Salary Frequency<span style={{ color: '#ef4444' }}> *</span></label>
                  <div className="salary-frequency-segmented">
                    <button
                      type="button"
                      className={`salary-frequency-btn ${formik.values.salaryType === (formRegion === 'IND' ? 'perMonth' : 'perHour') ? 'active' : ''}`}
                      onClick={() => formik.setFieldValue('salaryType', formRegion === 'IND' ? 'perMonth' : 'perHour')}
                    >
                      {formRegion === 'IND' ? 'Monthly' : 'Hourly'}
                    </button>
                    <button
                      type="button"
                      className={`salary-frequency-btn ${formik.values.salaryType === (formRegion === 'IND' ? 'perAnnum' : 'perMonth') ? 'active' : ''}`}
                      onClick={() => formik.setFieldValue('salaryType', formRegion === 'IND' ? 'perAnnum' : 'perMonth')}
                    >
                      {formRegion === 'IND' ? 'Annum' : 'Monthly'}
                    </button>
                    <button
                      type="button"
                      className={`salary-frequency-btn ${formik.values.salaryType === 'entireBudget' || formik.values.salaryType === 'Fixed' ? 'active' : ''}`}
                      onClick={() => formik.setFieldValue('salaryType', 'entireBudget')}
                    >
                      Fixed
                    </button>
                  </div>
                </div>

                {/* Currency selector */}
                <div className="salary-currency-row mb-3">
                  <label className="auth-label" style={{ marginBottom: 4 }}>Currency</label>
                  <div className="currency-popover-anchor" ref={currencyRef} style={{ width: '100%' }}>
                    <button
                      type="button"
                      className="auth-input placeholder-text"
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: '#fff', width: '100%', height: '42px', padding: '10px 12px' }}
                      onClick={() => setShowCurrencyPopover(v => !v)}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#0f172a', fontWeight: '500' }}>
                        <span style={{ color: '#5B5BD6', fontWeight: 'bold' }}>{currencySymbols[formik.values.salaryCurrency] || '$'}</span>
                        {formik.values.salaryCurrency}
                      </span>
                      <ChevronDown size={16} className={`chevron ${showCurrencyPopover ? 'rotate' : ''}`} style={{ color: '#94a3b8' }} />
                    </button>
                    {showCurrencyPopover && (
                      <div className="currency-popover" style={{ width: '100%' }}>
                        {currencies.map(c => (
                          <button
                            key={c}
                            type="button"
                            className={`currency-option ${formik.values.salaryCurrency === c ? 'selected' : ''}`}
                            onClick={() => {
                              formik.setFieldValue('salaryCurrency', c);
                              setShowCurrencyPopover(false);
                            }}
                          >
                            <span className="currency-option-code">{c}</span>
                            <span className="currency-option-sym">{currencySymbols[c]}</span>
                            {formik.values.salaryCurrency === c && <Check size={12} style={{ marginLeft: 'auto', color: '#5B5BD6' }} />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className='mb-3'>
                  <label className="auth-label">{formik.values.salaryType === 'entireBudget' || formik.values.salaryType === 'Fixed' ? 'Budget' : 'Min Salary / CTC'}<span style={{ color: '#ef4444' }}> *</span></label>
                  <div className="auth-input-wrapper">
                    <input
                      type="number"
                      className="auth-input"
                      name="salaryMin"
                      placeholder={formRegion === 'IND' ? "e.g. 500000" : "e.g. 110"}
                      value={formik.values.salaryMin}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                  {err("salaryMin")}
                </div>

                {formik.values.salaryType !== 'entireBudget' && formik.values.salaryType !== 'Fixed' && (
                  <div className='mb-3'>
                    <label className="auth-label">Max Salary / CTC<span style={{ color: '#ef4444' }}> *</span></label>
                    <div className="auth-input-wrapper">
                      <input
                        type="number"
                        className="auth-input"
                        name="salaryMax"
                        placeholder={formRegion === 'IND' ? "e.g. 800000" : "e.g. 160"}
                        value={formik.values.salaryMax}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </div>
                    {err("salaryMax")}
                  </div>
                )}
              </div>
            </div>

            {/* JOB DETAILS & REQUIREMENTS */}
            <div style={{ marginBottom: '40px' }}>
              <span className="status-tag status-progress font-mono mb-3 d-inline-block" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', background: '#eef2f6', color: '#5B5BD6', padding: '4px 10px', borderRadius: '6px', fontWeight: 'bold' }}>
                2. Job Details & Academic Criteria
              </span>

              <div className="grid-4">
                {formRegion === 'US' ? (
                  <div>
                    <label className="auth-label">Work Model<span style={{ color: '#ef4444' }}> *</span></label>
                    <div className="currency-popover-anchor" ref={workModelRef} style={{ width: '100%' }}>
                      <button
                        type="button"
                        className="auth-input placeholder-text"
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: '#fff', width: '100%', height: '42px', padding: '10px 12px' }}
                        onClick={() => setShowWorkModelPopover(v => !v)}
                      >
                        <span style={{ fontSize: '14px', color: formik.values.workModel ? '#0f172a' : '#94a3b8' }}>
                          {formik.values.workModel || 'Select model'}
                        </span>
                        <ChevronDown size={16} className={`chevron ${showWorkModelPopover ? 'rotate' : ''}`} style={{ color: '#94a3b8' }} />
                      </button>
                      {showWorkModelPopover && (
                        <div className="currency-popover" style={{ width: '100%' }}>
                          {["Remote", "On-site", "Hybrid"].map(m => (
                            <button
                              key={m}
                              type="button"
                              className={`currency-option ${formik.values.workModel === m ? 'selected' : ''}`}
                              onClick={() => {
                                formik.setFieldValue('workModel', m);
                                setShowWorkModelPopover(false);
                              }}
                            >
                              <span className="currency-option-sym" style={{ color: '#1F2937', fontWeight: 500 }}>{m}</span>
                              {formik.values.workModel === m && <Check size={12} style={{ marginLeft: 'auto', color: '#5B5BD6' }} />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {err("workModel")}
                  </div>
                ) : (
                  <div>
                    <label className="auth-label">Highest Qualification<span style={{ color: '#ef4444' }}> *</span></label>
                    <div className="currency-popover-anchor" ref={highestQualRef} style={{ width: '100%' }}>
                      <button
                        type="button"
                        className="auth-input placeholder-text"
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: '#fff', width: '100%', height: '42px', padding: '10px 12px' }}
                        onClick={() => setShowHighestQualPopover(v => !v)}
                      >
                        <span style={{ fontSize: '14px', color: formik.values.highestQualification ? '#0f172a' : '#94a3b8' }}>
                          {formik.values.highestQualification || 'Select Qualification'}
                        </span>
                        <ChevronDown size={16} className={`chevron ${showHighestQualPopover ? 'rotate' : ''}`} style={{ color: '#94a3b8' }} />
                      </button>
                      {showHighestQualPopover && (
                        <div className="currency-popover" style={{ width: '100%' }}>
                          {["B.Tech / B.E.", "M.Tech / M.E.", "MCA / BCA", "B.Sc / M.Sc", "MBA / PGDM", "Diploma", "Doctorate / Ph.D", "High School / Other"].map(hq => (
                            <button
                              key={hq}
                              type="button"
                              className={`currency-option ${formik.values.highestQualification === hq ? 'selected' : ''}`}
                              onClick={() => {
                                formik.setFieldValue('highestQualification', hq);
                                formik.setFieldValue('educationLevel', hq);
                                setShowHighestQualPopover(false);
                              }}
                            >
                              <span className="currency-option-sym" style={{ color: '#1F2937', fontWeight: 500 }}>{hq}</span>
                              {formik.values.highestQualification === hq && <Check size={12} style={{ marginLeft: 'auto', color: '#5B5BD6' }} />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {err("highestQualification")}
                  </div>
                )}

                <div>
                  <label className="auth-label">Department<span style={{ color: '#ef4444' }}> *</span></label>
                  <div className="currency-popover-anchor" ref={deptRef} style={{ width: '100%' }}>
                    <button
                      type="button"
                      className="auth-input placeholder-text"
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: '#fff', width: '100%', height: '42px', padding: '10px 12px' }}
                      onClick={() => setShowDeptPopover(v => !v)}
                    >
                      <span style={{ fontSize: '14px', color: formik.values.department ? '#0f172a' : '#94a3b8' }}>
                        {formik.values.department || 'Select department'}
                      </span>
                      <ChevronDown size={16} className={`chevron ${showDeptPopover ? 'rotate' : ''}`} style={{ color: '#94a3b8' }} />
                    </button>
                    {showDeptPopover && (
                      <div className="currency-popover" style={{ width: '100%' }}>
                        {["Engineering", "Design", "Product", "Sales", "Marketing", "Human Resources", "Finance", "Operations"].map(d => (
                          <button
                            key={d}
                            type="button"
                            className={`currency-option ${formik.values.department === d ? 'selected' : ''}`}
                            onClick={() => {
                              formik.setFieldValue('department', d);
                              setShowDeptPopover(false);
                            }}
                          >
                            <span className="currency-option-sym" style={{ color: '#1F2937', fontWeight: 500 }}>{d}</span>
                            {formik.values.department === d && <Check size={12} style={{ marginLeft: 'auto', color: '#5B5BD6' }} />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {err("department")}
                </div>

                <div>
                  <label className="auth-label">Experience Level</label>
                  <div className="currency-popover-anchor" ref={expRef} style={{ width: '100%' }}>
                    <button
                      type="button"
                      className="auth-input placeholder-text"
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: '#fff', width: '100%', height: '42px', padding: '10px 12px' }}
                      onClick={() => setShowExpPopover(v => !v)}
                    >
                      <span style={{ fontSize: '14px', color: formik.values.experienceLevel ? '#0f172a' : '#94a3b8' }}>
                        {formik.values.experienceLevel || 'Select level'}
                      </span>
                      <ChevronDown size={16} className={`chevron ${showExpPopover ? 'rotate' : ''}`} style={{ color: '#94a3b8' }} />
                    </button>
                    {showExpPopover && (
                      <div className="currency-popover" style={{ width: '100%' }}>
                        {["Junior", "Mid-Level", "Senior"].map(e => (
                          <button
                            key={e}
                            type="button"
                            className={`currency-option ${formik.values.experienceLevel === e ? 'selected' : ''}`}
                            onClick={() => {
                              formik.setFieldValue('experienceLevel', e);
                              setShowExpPopover(false);
                            }}
                          >
                            <span className="currency-option-sym" style={{ color: '#1F2937', fontWeight: 500 }}>{e}</span>
                            {formik.values.experienceLevel === e && <Check size={12} style={{ marginLeft: 'auto', color: '#5B5BD6' }} />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {err("experienceLevel")}
                </div>

                {formRegion !== 'IND' && (
                  <div>
                    <label className="auth-label">Education Standard<span style={{ color: '#ef4444' }}> *</span></label>
                    <div className="currency-popover-anchor" ref={eduRef} style={{ width: '100%' }}>
                    <button
                      type="button"
                      className="auth-input placeholder-text"
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: '#fff', width: '100%', height: '42px', padding: '10px 12px' }}
                      onClick={() => setShowEduPopover(v => !v)}
                    >
                      <span style={{ fontSize: '14px', color: formik.values.educationLevel ? '#0f172a' : '#94a3b8' }}>
                        {formik.values.educationLevel === "Bachelors" ? "Bachelor's Degree" : formik.values.educationLevel === "Masters" ? "Master's Degree" : formik.values.educationLevel || 'Select education'}
                      </span>
                      <ChevronDown size={16} className={`chevron ${showEduPopover ? 'rotate' : ''}`} style={{ color: '#94a3b8' }} />
                    </button>
                    {showEduPopover && (
                      <div className="currency-popover" style={{ width: '100%' }}>
                        {[
                          { value: "Bachelors", label: "Bachelor's Degree" },
                          { value: "Masters", label: "Master's Degree" },
                          { value: "Doctorate", label: "Doctorate / PhD" },
                          { value: "Diploma", label: "Diploma / Certification" },
                          { value: "None", label: "None Required" }
                        ].map(e => (
                          <button
                            key={e.value}
                            type="button"
                            className={`currency-option ${formik.values.educationLevel === e.value ? 'selected' : ''}`}
                            onClick={() => {
                              formik.setFieldValue('educationLevel', e.value);
                              setShowEduPopover(false);
                            }}
                          >
                            <span className="currency-option-sym" style={{ color: '#1F2937', fontWeight: 500 }}>{e.label}</span>
                            {formik.values.educationLevel === e.value && <Check size={12} style={{ marginLeft: 'auto', color: '#5B5BD6' }} />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {err("educationLevel")}
                </div>
                )}

                <div className="auth-form-group w-100" style={{ marginBottom: 0 }}>
                  <label className="auth-label">Years of Experience<span style={{ color: '#ef4444' }}> *</span></label>
                  <div className="auth-password-wrapper">
                    <input
                      className="auth-input"
                      name="yearsExperience"
                      placeholder="e.g. 3"
                      style={{ paddingLeft: '2.5rem' }}
                      value={formik.values.yearsExperience}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <FileText
                      size={16}
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#94a3b8'
                      }}
                    />
                  </div>
                  {err("yearsExperience")}
                </div>
              </div>

              <div className="grid-4 mt-3">

                {formRegion === 'IND' && (
                  <>
                    <div className="auth-form-group" style={{ marginBottom: 0 }}>
                      <label className="auth-label">Degree / Specialization</label>
                      <input
                        className="auth-input"
                        name="degreeCourse"
                        placeholder="e.g. B.Tech Computer Science"
                        value={formik.values.degreeCourse}
                        onChange={formik.handleChange}
                      />
                    </div>

                    <div className="auth-form-group" style={{ marginBottom: 0 }}>
                      <label className="auth-label">Graduation Year</label>
                      <div className="currency-popover-anchor" ref={gradYearRef} style={{ width: '100%' }}>
                        <button
                          type="button"
                          className="auth-input placeholder-text"
                          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: '#fff', width: '100%', height: '42px', padding: '10px 12px' }}
                          onClick={() => setShowGradYearPopover(v => !v)}
                        >
                          <span style={{ fontSize: '14px', color: formik.values.graduationYear ? '#0f172a' : '#94a3b8' }}>
                            {formik.values.graduationYear || 'Select year'}
                          </span>
                          <ChevronDown size={16} className={`chevron ${showGradYearPopover ? 'rotate' : ''}`} style={{ color: '#94a3b8' }} />
                        </button>
                        {showGradYearPopover && (
                          <div className="currency-popover" style={{ width: '100%', maxHeight: '180px', overflowY: 'auto' }}>
                            {[2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015].map(yr => (
                              <button
                                key={yr}
                                type="button"
                                className={`currency-option ${formik.values.graduationYear === yr ? 'selected' : ''}`}
                                onClick={() => {
                                  formik.setFieldValue('graduationYear', yr);
                                  setShowGradYearPopover(false);
                                }}
                              >
                                <span className="currency-option-sym" style={{ color: '#1F2937', fontWeight: 500 }}>{yr}</span>
                                {formik.values.graduationYear === yr && <Check size={12} style={{ marginLeft: 'auto', color: '#5B5BD6' }} />}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                <div className="auth-form-group" style={{ marginBottom: 0, gridColumn: 'span 2' }}>
                  <label className="auth-label">Required Skills<span style={{ color: '#ef4444' }}> *</span></label>
                  <input
                    className={`auth-input ${skillsTouched && skills.length === 0 ? 'input-error-border' : ''}`}
                    placeholder="Add skills (Press Enter)"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                    onBlur={() => setSkillsTouched(true)}
                  />
                  <p style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
                    Type a skill and press <b>Enter</b> to add it. Repeat to add multiple skills.
                  </p>
                  {skillsTouched && skills.length === 0 && (
                    <div className="auth-error">At least one Required Skill must be added</div>
                  )}
                  <div className="modal-tags-row mt-2">
                    {skills.map((skill) => (
                      <span key={skill} className="status-tag status-progress">
                        {skill}
                        <X
                          size={12}
                          className="ms-1"
                          style={{ cursor: "pointer" }}
                          onClick={() => removeSkill(skill)}
                        />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* INDIA IDENTITY & COMPLIANCE VERIFICATION SECTION */}
            {formRegion === 'IND' && (
              <div style={{ marginBottom: '40px', background: '#fafafc', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                <span className="status-tag status-progress font-mono mb-3 d-inline-block" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', background: '#e0e7ff', color: '#4338ca', padding: '4px 10px', borderRadius: '6px', fontWeight: 'bold' }}>
                  3. Verification Requirements
                </span>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                    <input
                      type="checkbox"
                      name="aadhaarNumber"
                      checked={!!formik.values.aadhaarNumber && formik.values.aadhaarNumber !== "false"}
                      onChange={(e) => formik.setFieldValue("aadhaarNumber", e.target.checked ? "true" : "")}
                      style={{ width: '16px', height: '16px', accentColor: '#4338ca' }}
                    />
                    <span>Aadhaar Card</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                    <input
                      type="checkbox"
                      name="panNumber"
                      checked={!!formik.values.panNumber && formik.values.panNumber !== "false"}
                      onChange={(e) => formik.setFieldValue("panNumber", e.target.checked ? "true" : "")}
                      style={{ width: '16px', height: '16px', accentColor: '#4338ca' }}
                    />
                    <span>PAN Card</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                    <input
                      type="checkbox"
                      name="portfolioURL"
                      checked={!!formik.values.portfolioURL && formik.values.portfolioURL !== "false"}
                      onChange={(e) => formik.setFieldValue("portfolioURL", e.target.checked ? "true" : "")}
                      style={{ width: '16px', height: '16px', accentColor: '#4338ca' }}
                    />
                    <span>Portfolio / Work URL</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                    <input
                      type="checkbox"
                      name="certifications"
                      checked={!!formik.values.certifications && formik.values.certifications !== "false"}
                      onChange={(e) => formik.setFieldValue("certifications", e.target.checked ? "true" : "")}
                      style={{ width: '16px', height: '16px', accentColor: '#4338ca' }}
                    />
                    <span>Certifications</span>
                  </label>
                </div>

                {/* VERIFICATION CHECKBOXES */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                    <input
                      type="checkbox"
                      name="backgroundVerification"
                      checked={formik.values.backgroundVerification}
                      onChange={formik.handleChange}
                      style={{ width: '16px', height: '16px', accentColor: '#4338ca' }}
                    />
                    <span>Background Verification</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                    <input
                      type="checkbox"
                      name="medicalFitness"
                      checked={formik.values.medicalFitness}
                      onChange={formik.handleChange}
                      style={{ width: '16px', height: '16px', accentColor: '#4338ca' }}
                    />
                    <span>Medical Fitness Check</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                    <input
                      type="checkbox"
                      name="travelRequired"
                      checked={formik.values.travelRequired}
                      onChange={formik.handleChange}
                      style={{ width: '16px', height: '16px', accentColor: '#4338ca' }}
                    />
                    <span>Travel Required</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                    <input
                      type="checkbox"
                      name="relocationRequired"
                      checked={formik.values.relocationRequired}
                      onChange={formik.handleChange}
                      style={{ width: '16px', height: '16px', accentColor: '#4338ca' }}
                    />
                    <span>Relocation Required</span>
                  </label>
                </div>
              </div>
            )}

            {/* DESCRIPTION & DETAILED CONTENT */}
            <div style={{ marginBottom: '40px' }}>
              <span className="status-tag status-progress font-mono mb-3 d-inline-block" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', background: '#eef2f6', color: '#5B5BD6', padding: '4px 10px', borderRadius: '6px', fontWeight: 'bold' }}>
                {formRegion === 'IND' ? '4. Job Content & Detailed Breakdown' : '3. Job Overview & Description'}
              </span>

              <div className="auth-form-group">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <label className="auth-label m-0">Job Summary / Overview<span style={{ color: '#ef4444' }}> *</span></label>
                  <button type="button" className="ai-generate-btn" onClick={handleGenerateAI}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                      <path d="M12 3L14.5 9.5L21 12L14.5 14.5L12 21L9.5 14.5L3 12L9.5 9.5L12 3Z" />
                    </svg>
                    {isAiLoading ? "Generating..." : "AI GENERATE"}
                  </button>
                </div>

                <div className="ai-highlight-wrapper">
                  <textarea
                    className="ai-textarea"
                    rows={4}
                    placeholder="Describe the role overview and primary objectives..."
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                {err("description")}
              </div>

            </div>

            {/* ADDITIONAL REQUIREMENTS */}
            <div style={{ marginBottom: '20px' }}>
              <span className="status-tag status-progress font-mono mb-3 d-inline-block" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', background: '#eef2f6', color: '#5B5BD6', padding: '4px 10px', borderRadius: '6px', fontWeight: 'bold' }}>
                Additional Notes & Requirements
              </span>
              <div className="auth-form-group">
                <label className="auth-label mb-2">Any other specific demands or instructions...</label>
                <textarea
                  className="auth-input"
                  rows={2}
                  style={{ height: "60px" }}
                  placeholder="Put down other demands or comments..."
                  name="additionalReqs"
                  value={formik.values.additionalReqs}
                  onChange={formik.handleChange}
                />
              </div>
            </div>

            {/* FOOTER */}
            <div className="d-flex justify-content-end align-items-center mt-4 pt-3" style={{ borderTop: '1px solid #e2e8f0' }}>
              <div className="d-flex gap-3">
                <button type="submit" className="btn-publish-vacancy" disabled={isOutOfTokens}>
                  Publish {formRegion === 'IND' ? 'India' : 'US'} Vacancy
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* ================= PREVIEW ================= */}
        <div className="dashboard-column-side">
          <div className="sticky-preview">

            {/* Redesigned Premium Dark Preview Card */}
            <div className="preview-card-dark">

              <div className="preview-card-logo-row">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div className="preview-company-logo">
                    {formik.values.companyName ? getInitials(formik.values.companyName) : '?'}
                  </div>
                  <span className={`preview-company-name ${!formik.values.companyName ? 'preview-placeholder-text' : ''}`}>
                    {formik.values.companyName || "Company Name"}
                  </span>
                </div>
                {formik.values.workModel && (
                  <span className="preview-badge-remote">{formik.values.workModel}</span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <span className="status-tag status-progress" style={{ background: formRegion === 'IND' ? '#fff7ed' : '#eff6ff', color: formRegion === 'IND' ? '#ea580c' : '#2563eb', border: `1px solid ${formRegion === 'IND' ? '#ffedd5' : '#bfdbfe'}`, fontSize: '10px', fontWeight: 'bold' }}>
                  {formRegion === 'IND' ? '🇮🇳 India Specification' : '🇺🇸 US Specification'}
                </span>
                {formRegion === 'IND' && formik.values.immediateJoiner && (
                  <span className="status-tag status-progress" style={{ background: '#f0fdf4', color: '#16a3a4', border: '1px solid #bbf7d0', fontSize: '10px' }}>
                    ⚡ Immediate Joiner
                  </span>
                )}
              </div>

              <h3 className={`preview-job-title ${!formik.values.jobTitle ? 'preview-placeholder-title' : ''}`}>
                {formik.values.jobTitle || "Job Title Preview"}
              </h3>

              <div className="preview-metas-grid">
                <div className={`preview-meta-item ${!formik.values.location ? 'preview-meta-placeholder' : ''}`}>
                  <span className="preview-meta-icon"><MapPin size={14} /></span>
                  <span>{formik.values.location || 'Location'}</span>
                </div>

                <div className={`preview-meta-item ${!getSalaryString() ? 'preview-meta-placeholder' : 'rate-highlight'}`}>
                  <span className={`preview-meta-icon ${getSalaryString() ? 'rate-highlight' : ''}`}><DollarSign size={14} /></span>
                  <span>{getSalaryString() || 'Salary Range'}</span>
                </div>

                <div className={`preview-meta-item ${!getDurationString() ? 'preview-meta-placeholder' : ''}`}>
                  <span className="preview-meta-icon"><Clock size={14} /></span>
                  <span>{getDurationString() || 'Duration'}</span>
                </div>

                <div className={`preview-meta-item ${!getEmploymentTypeString() ? 'preview-meta-placeholder' : ''}`}>
                  <span className="preview-meta-icon"><Briefcase size={14} /></span>
                  <span>{getEmploymentTypeString() || 'Employment Type'}</span>
                </div>
              </div>

              {formRegion === 'IND' && (
                <div style={{ padding: '8px 12px', background: '#1e293b', borderRadius: '8px', margin: '12px 0 4px 0', fontSize: '11px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Openings: <strong>{formik.values.numberOfOpenings}</strong></span>
                    <span>Notice: <strong>{formik.values.noticePeriod}</strong></span>
                  </div>
                  {formik.values.highestQualification && (
                    <div>Qualification: <strong>{formik.values.highestQualification}</strong></div>
                  )}
                </div>
              )}

              <div style={{ height: '1px', backgroundColor: '#20273a', margin: '12px 0' }} />

              {/* Tech Stack */}
              <div>
                <p className="preview-section-title">
                  REQUIRED TECH STACK / SKILLS:
                </p>
                <div className="preview-tech-stack-container">
                  {skills.length > 0 ? (
                    skills.map(skill => (
                      <span key={skill} className="preview-tech-pill">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <>
                      <span className="preview-tech-pill preview-tech-pill-placeholder">Skill 1</span>
                      <span className="preview-tech-pill preview-tech-pill-placeholder">Skill 2</span>
                      <span className="preview-tech-pill preview-tech-pill-placeholder">Skill 3</span>
                    </>
                  )}
                </div>
              </div>

              {/* Description Abstract */}
              <div>
                <p className="preview-section-title">
                  Description abstract:
                </p>
                <p className={`preview-description-abstract ${!formik.values.description ? 'preview-placeholder-text' : ''}`}>
                  {formik.values.description
                    ? (formik.values.description.length > 150
                      ? formik.values.description.slice(0, 150) + "..."
                      : formik.values.description)
                    : "Configure fields on the left to see the job description preview here..."}
                </p>
              </div>

            </div>

            {/* CRM SOURCING INFORMATION CARD */}
            <div className="crm-notice-card mt-4">
              <div className="crm-notice-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              </div>
              <div className="crm-notice-content">
                <h4 className="crm-notice-title">Sourcing Information ({formRegion})</h4>
                <p className="crm-notice-desc">
                  Publishing a new vacancy instantly loads the matching telemetry criteria into candidate indexes.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>

      {
        showPreview && (
          <PreviewModal
            data={modalData}
            onClose={() => setShowPreview(false)}
            onPostJob={handlePostJob}
            isEdit={isEdit}
          />
        )
      }
    </form >
  );
};

export default PostNewPositions;
