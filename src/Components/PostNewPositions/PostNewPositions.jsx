import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import {
  Briefcase, MapPin, DollarSign, Monitor,
  FileText, X, Building2, Check, ChevronDown, Calendar, Clock
} from 'lucide-react';
import { FiArrowLeft, FiLinkedin } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import JobTitleAutocomplete from './JobTitleAutocomplete';
import PreviewModal from './PreviewModal';
import {
  useGenerateJobDescriptionAIMutation,
  usePostJobMutation,
  useSaveJobDraftMutation
} from '../../State-Management/Api/ProjectApiSlice';
import { Country, State, City } from 'country-state-city';

import '../Dashboard/Dashboard.css';
import '../Auth/Auth.css';
import './PostNewPositions.css';

/* =========================
   VALIDATION SCHEMA
========================= */
const validationSchema = Yup.object().shape({
  jobTitle: Yup.string().required("Job Title is required"),
  companyName: Yup.string().required("Company Name is required"),
  location: Yup.string().required("Location is required"),
  employmentType: Yup.string().required("Employment Type is required"),
  salaryMin: Yup.number().typeError("Enter valid amount").required("Min Salary is Required"),
  salaryMax: Yup.number()
    .typeError("Enter valid amount")
    .when('salaryType', {
      is: (val) => val !== 'entireBudget',
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

const PostNewPositions = () => {
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState([]);
  const [generateAI, { isLoading: isAiLoading }] =
    useGenerateJobDescriptionAIMutation();
  const location = useLocation();
  const editData = location.state?.jobData;
  const isEdit = location.state?.isEdit;
  const JobID = location.state?.jobId;
  console.log("JobID:", JobID)

  // Work Authorization states
  const [workAuthorization, setWorkAuthorization] = useState({
    Citizenship: false,
    GC: false,
    H1B: false,
    EAD: false,
    OPT: false,
    CPT: false,
    H4: false
  });

  // Preferred Employment states
  const [preferredEmployment, setPreferredEmployment] = useState({
    "Corp-Corp": false,
    "W2-Permanent": false,
    "W2-Contract": false,
    "1099-Contract": false,
    "Contract to Hire": false
  });

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isEmpOpen, setIsEmpOpen] = useState(false);
  const [shareToLinkedIn, setShareToLinkedIn] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const countries = Country.getAllCountries();

  const handleCountryChange = (countryCode) => {
    setSelectedCountry(countryCode);
    setSelectedState("");
    setSelectedCity("");
    if (countryCode) {
      setStates(State.getStatesOfCountry(countryCode));
    } else {
      setStates([]);
    }
    setCities([]);
    
    const countryObj = Country.getCountryByCode(countryCode);
    formik.setFieldValue("location", countryObj ? countryObj.name : "");
  };

  const handleStateChange = (stateCode) => {
    setSelectedState(stateCode);
    setSelectedCity("");
    if (stateCode) {
      setCities(City.getCitiesOfState(selectedCountry, stateCode));
    } else {
      setCities([]);
    }
    
    const countryObj = Country.getCountryByCode(selectedCountry);
    const stateObj = State.getStateByCodeAndCountry(stateCode, selectedCountry);
    
    const locStr = [stateObj?.name, countryObj?.name].filter(Boolean).join(", ");
    formik.setFieldValue("location", locStr);
  };

  const handleCityChange = (cityName) => {
    setSelectedCity(cityName);
    
    const countryObj = Country.getCountryByCode(selectedCountry);
    const stateObj = State.getStateByCodeAndCountry(selectedState, selectedCountry);
    
    const locStr = [cityName, stateObj?.name, countryObj?.name].filter(Boolean).join(", ");
    formik.setFieldValue("location", locStr);
  };

const authRef = useRef(null);
const empRef = useRef(null);

useEffect(() => {
  const handleClickOutside = (event) => {
    if (authRef.current && !authRef.current.contains(event.target)) {
      setIsAuthOpen(false);
    }

    if (empRef.current && !empRef.current.contains(event.target)) {
      setIsEmpOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  const [postJob] = usePostJobMutation();
  const [saveJobDraft] = useSaveJobDraftMutation();
  const user = localStorage.getItem("CompanyId");
  const companyname = localStorage.getItem("CompanyName");

const autoFillRole =
  location.state?.autoFillRole || "";

  /* =========================
     FORMIK
  ========================= */
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      jobTitle: editData?.jobTitle || autoFillRole || '',
      companyName: editData?.companyName || companyname,
      location: editData?.location || '',
      employmentType: editData?.employeeType || '',
      workModel: editData?.workModels || '',
      jobDuration: editData?.jobDuration || '',
      salaryMin: editData?.salaryRange_Min || '',
      salaryMax: editData?.salaryRange_Max || '',
      salaryCurrency: 'USD',
      salaryType: editData?.salarType || 'perHour',
      description: editData?.jobDescription || '',
      department: editData?.department || '',
      experienceLevel: editData?.experienceLevel || '',
      educationLevel: editData?.educationLevel || '',
      yearsExperience: editData?.yearsOfExperience || '',
      additionalReqs: editData?.additionalRequirements || '',
    },
    validationSchema,
    // ✅ ONLY OPEN PREVIEW
    onSubmit: () => {
      setShowPreview(true);
    },
  });

  /* =========================
     POST JOB (API CALL)
  ========================= */
  const handlePostJob = async () => {
    if (!user) {
      toast.error("User session expired. Please login again.");
      return;
    }

    const fd = new FormData();

    fd.append("JobID", isEdit ? JobID : 0);
    fd.append("userid", user);

    fd.append("JobTitle", formik.values.jobTitle);
    fd.append("CompanyName", formik.values.companyName);
    fd.append("Location", formik.values.location);
    fd.append("EmployeeType", formik.values.employmentType);

    fd.append("SalaryRange_min", formik.values.salaryMin);
    fd.append("SalaryRange_max", formik.values.salaryMax);
    fd.append("salaryUSD", formik.values.salaryCurrency === "USD" ? 1 : 0);

    fd.append("JobDescription", formik.values.description);
    fd.append("jobdetails", formik.values.description);

    fd.append("WorkModels", formik.values.workModel);
    fd.append("department", formik.values.department);
    fd.append("ExperienceLevel", formik.values.experienceLevel);
    fd.append("EducationLevel", formik.values.educationLevel);
    fd.append("YearsofExperience", formik.values.yearsExperience);

    fd.append("RequiredSkills", skills.join(","));
    fd.append("AdditionalRequirements", formik.values.additionalReqs);

    fd.append("CreatedBy", "Admin");
    fd.append("IsDraft", false);
    fd.append("CreatedOn", new Date().toISOString());
    // 🔹 Work Authorization
    fd.append("IsUSCitizen", workAuthorization.Citizenship);
    fd.append("IsGC", workAuthorization.GC);
    fd.append("IsH1B", workAuthorization.H1B);
    fd.append("IsEAD", workAuthorization.EAD);
    fd.append("IsOPT", workAuthorization.OPT);
    fd.append("IsCPT", workAuthorization.CPT);
    fd.append("IsH4", workAuthorization.H4);

    // 🔹 Preferred Employment
    fd.append("IsCorpToCorp", preferredEmployment["Corp-Corp"]);
    fd.append("IsW2Permanent", preferredEmployment["W2-Permanent"]);
    fd.append("IsW2Contract", preferredEmployment["W2-Contract"]);
    fd.append("Is1099Contract", preferredEmployment["1099-Contract"]);
    fd.append("IsContractToHire", preferredEmployment["Contract to Hire"]);
    fd.append("SalarType", formik.values.salaryType);
    fd.append("JobDuration", formik.values.jobDuration);


    try {
      await postJob(fd).unwrap();
    } catch (err) {
      console.error(err);
      throw err; // 🔥 VERY IMPORTANT
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
    // 🔹 Work Authorization
    fd.append("IsUSCitizen", workAuthorization.Citizenship);
    fd.append("IsGC", workAuthorization.GC);
    fd.append("IsH1B", workAuthorization.H1B);
    fd.append("IsEAD", workAuthorization.EAD);
    fd.append("IsOPT", workAuthorization.OPT);
    fd.append("IsCPT", workAuthorization.CPT);
    fd.append("IsH4", workAuthorization.H4);

    // 🔹 Preferred Employment
    fd.append("IsCorpToCorp", preferredEmployment["Corp-Corp"]);
    fd.append("IsW2Permanent", preferredEmployment["W2-Permanent"]);
    fd.append("IsW2Contract", preferredEmployment["W2-Contract"]);
    fd.append("Is1099Contract", preferredEmployment["1099-Contract"]);
    fd.append("IsContractToHire", preferredEmployment["Contract to Hire"]);


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

    /* ======================
       Skills Binding
    ====================== */
    if (editData.requiredSkills) {
      setSkills(editData.requiredSkills.split(","));
    }

    /* ======================
       Employment Type Binding
    ====================== */
    if (editData.employeeType) {
      const types = editData.employeeType.split(",");

      const updatedEmployment = {
        "Corp-Corp": false,
        "W2-Permanent": false,
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

      formik.setFieldValue("employmentType", editData.employeeType);
    }

    /* ======================
       Work Authorization Binding
    ====================== */
    setWorkAuthorization({
      Citizenship: editData?.isUSCitizen || false,
      GC: editData?.isGC || false,
      H1B: editData?.isH1B || false,
      EAD: editData?.isEAD || false,
      OPT: editData?.isOPT || false,
      CPT: editData?.isCPT || false,
      H4: editData?.isH4 || false
    });

    /* ======================
       Location Binding for Dropdowns on Edit
    ====================== */
    if (editData?.location) {
      const parts = editData.location.split(",").map(p => p.trim());
      if (parts.length > 0) {
        let matchedCountry = null;
        let matchedState = null;
        let matchedCity = null;

        const allCountries = Country.getAllCountries();
        // Search country from right-to-left (last to first)
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

          // Search state from remaining parts (excluding the country part if found)
          for (let i = parts.length - 1; i >= 0; i--) {
            const p = parts[i];
            if (p.toLowerCase() === matchedCountry.name.toLowerCase() || p.toLowerCase() === matchedCountry.isoCode.toLowerCase()) {
              continue;
            }
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

            // Search city from remaining parts (excluding country and state parts)
            for (let i = parts.length - 1; i >= 0; i--) {
              const p = parts[i];
              if (
                p.toLowerCase() === matchedCountry.name.toLowerCase() ||
                p.toLowerCase() === matchedCountry.isoCode.toLowerCase() ||
                p.toLowerCase() === matchedState.name.toLowerCase() ||
                p.toLowerCase() === matchedState.isoCode.toLowerCase()
              ) {
                continue;
              }
              const cityMatch = stateCities.find(x => x.name.toLowerCase() === p.toLowerCase());
              if (cityMatch) {
                matchedCity = cityMatch;
                break;
              }
            }

            if (matchedCity) {
              setSelectedCity(matchedCity.name);
            }
          }
        }
      }
    }

  }, [editData]);

  const handleGenerateAI = async () => {
    const selectedEmpTypes = Object.entries(preferredEmployment)
      .filter(([_, v]) => v)
      .map(([k]) => k)
      .join(", ");

    const isAnyEmpTypeSelected = selectedEmpTypes.length > 0;

    if (
      !formik.values.jobTitle ||
      !formik.values.companyName ||
      !isAnyEmpTypeSelected ||
      !formik.values.workModel ||
      !formik.values.educationLevel ||
      !formik.values.yearsExperience ||
      skills.length === 0
    ) {
      toast.error("Please enter All Required Fields (Job Title, Company, Employment Type, Work Model, Education, Experience, and at least one Skill)");
      return;
    }

    try {
      const payload = {
        jobTitle: formik.values.jobTitle,
        companyName: formik.values.companyName,
        employmentType: selectedEmpTypes,
        workModel: formik.values.workModel,
        education: formik.values.educationLevel,
        experienceYears: formik.values.yearsExperience,
        skills: skills,
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
      w2Permanent: preferredEmployment["W2-Permanent"],
      w2Contract: preferredEmployment["W2-Contract"],
      contract1099: preferredEmployment["1099-Contract"],
      contractToHire: preferredEmployment["Contract to Hire"]
    }
  };

  const getInitials = (name) => {
    if (!name) return "ML";
    return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  };

  const getSalaryString = () => {
    const min = formik.values.salaryMin;
    const max = formik.values.salaryMax;
    const type = formik.values.salaryType;
    const curr = formik.values.salaryCurrency === "USD" ? "$" : "€";
    if (!min && !max) return "$120 - $160 / hr (Hourly)";
    if (type === 'entireBudget') return `${curr}${min} (Fixed)`;
    return `${curr}${min || '0'} - ${curr}${max || '0'} / hr (${type === 'perHour' ? 'Hourly' : 'Monthly'})`;
  };

  const getDurationString = () => {
    const dur = formik.values.jobDuration;
    if (!dur) return "6 Months Term";
    if (dur === "0") return "Ongoing Term";
    if (dur === "12") return "1 Year Term";
    return `${dur} Months Term`;
  };

  const getEmploymentTypeString = () => {
    const type = formik.values.employmentType;
    if (!type) return "Regular Full-time";
    return type.split(",")[0];
  };

  const err = (name) =>
    formik.touched[name] && formik.errors[name] && (
      <div className="auth-error">{formik.errors[name]}</div>
    );

  return (
    <form onSubmit={formik.handleSubmit} className="ai-dashboard-wrapper">
      {/* HEADER CARD */}
   <div className="hero-card mb-4">
<div className="hero-left">
  <div className="hero-pill">
            ✦ Create New Job
          </div>
<h1 className="job-posting-title text-white">Talent & Vacancies Board</h1>

 
<div className="job-posting-header-info">

<p className="job-posting-subtitle">
A cohesive environment compiling hotbench sourcing pools, interactive vacancies.
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
</div>

      <div className="dashboard-layout">

        {/* ================= MAIN FORM ================= */}
        <div className="dashboard-column-main">
          <div className="premium-card">
            
            <h2 className="font-display mb-1" style={{ fontSize: "16px", fontWeight: 700, color: "#1F2937", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Configure New Vacancy Blueprint
            </h2>
            <p className="muted small mb-4" style={{ fontSize: "12px", color: "#6B7280" }}>
              Fields indicated with a red asterisk (<span style={{ color: '#ef4444' }}>*</span>) are mandatory values.
            </p>

            {/* BASIC INFO */}
            <div style={{ marginBottom: '40px' }}>
              <span className="status-tag status-progress font-mono mb-3 d-inline-block" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', background: '#eef2f6', color: '#5B5BD6', padding: '4px 10px', borderRadius: '6px', fontWeight: 'bold' }}>Basic Information</span>

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
                  <select className="auth-input placeholder-text" name="jobDuration"
                    value={formik.values.jobDuration} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                    <option value="">Select duration</option>
                    <option value="1">1 Month</option>
                    <option value="3">3 Months</option>
                    <option value="6">6 Months</option>
                    <option value="12">1 Year</option>
                    <option value="0">Ongoing</option>
                  </select>
                  {err("jobDuration")}
                </div>

                <div>
                  <label className="auth-label">Company<span style={{ color: '#ef4444' }}> *</span></label>
                  <input className="auth-input bg-light placeholder-text" name="companyName" placeholder="Company"
                    value={formik.values.companyName} onChange={formik.handleChange} onBlur={formik.handleBlur} disabled style={{ cursor: "not-allowed" }} />
                  {err("companyName")}
                </div>

                <div>
                  <label className="auth-label">Employment Type<span style={{ color: '#ef4444' }}> *</span></label>
                  <div className="vendor-section" ref={empRef}>
                    <div className="auth-input placeholder-text" onClick={() => setIsEmpOpen(!isEmpOpen)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                      <span className="placeholder-text">Select Type</span>
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

                                // Keep Formik in sync for validation and AI
                                const selected = Object.entries(nextState)
                                  .filter(([_, v]) => v)
                                  .map(([k]) => k)
                                  .join(", ");
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
              </div>

              {/* Cascading Location Dropdowns inside fieldset */}
              <fieldset className="coordinates-fieldset mt-4">
                <legend className="coordinates-legend">Location Coordinates <span style={{ color: '#ef4444' }}>*</span></legend>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                  <div className="placeholder-text">
                    <label className="auth-label">Select Country</label>
                    <select
                      className="auth-input placeholder-text"
                      value={selectedCountry}
                      onChange={(e) => handleCountryChange(e.target.value)}
                    >
                      <option value="">Select Country</option>
                      {countries.map((c) => (
                        <option key={c.isoCode} value={c.isoCode}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="placeholder-text">
                    <label className="auth-label">Select State</label>
                    <select
                      className="auth-input placeholder-text"
                      value={selectedState}
                      onChange={(e) => handleStateChange(e.target.value)}
                      disabled={!selectedCountry || states.length === 0}
                    >
                      <option value="">Select State</option>
                      {states.map((s) => (
                        <option key={s.isoCode} value={s.isoCode}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="placeholder-text">
                    <label className="auth-label">Select City</label>
                    <select
                      className="auth-input placeholder-text"
                      value={selectedCity}
                      onChange={(e) => handleCityChange(e.target.value)}
                      disabled={!selectedState || cities.length === 0}
                    >
                      <option value="">Select City</option>
                      {cities.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {err("location")}
              </fieldset>

              <div className="grid-4">
                <div>
                  <label className="auth-label">Work Authorization/Visa</label>
                  <div className="vendor-section" ref={authRef}>
                    <div className="auth-input placeholder-text" onClick={() => setIsAuthOpen(!isAuthOpen)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                      <span className="placeholder-text">Select Work Authorization</span>
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

                <div>
                  <label className="auth-label">Salary Frequency<span style={{ color: '#ef4444' }}> *</span></label>
                  <div className="salary-frequency-segmented">
                    <button
                      type="button"
                      className={`salary-frequency-btn ${formik.values.salaryType === 'perHour' ? 'active' : ''}`}
                      onClick={() => formik.setFieldValue('salaryType', 'perHour')}
                    >
                      Hourly
                    </button>
                    <button
                      type="button"
                      className={`salary-frequency-btn ${formik.values.salaryType === 'perMonth' ? 'active' : ''}`}
                      onClick={() => formik.setFieldValue('salaryType', 'perMonth')}
                    >
                      Monthly
                    </button>
                    <button
                      type="button"
                      className={`salary-frequency-btn ${formik.values.salaryType === 'entireBudget' ? 'active' : ''}`}
                      onClick={() => formik.setFieldValue('salaryType', 'entireBudget')}
                    >
                      Fixed
                    </button>
                  </div>
                </div>

                  {/* Rates container box */}
              <div className="">
                <div style={{ display: 'grid', gridTemplateColumns: formik.values.salaryType === 'entireBudget' ? '1fr' : '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label className="auth-label">Min Rate<span style={{ color: '#ef4444' }}> *</span></label>
                    <div className="rate-input-container">
                      <span className="rate-prefix">USD</span>
                      <input
                        type="number"
                        className="rate-input"
                        name="salaryMin"
                        placeholder="c.g. 110"
                        value={formik.values.salaryMin}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </div>
                    {err("salaryMin")}
                  </div>

                  {formik.values.salaryType !== 'entireBudget' && (
                    <div>
                      <label className="auth-label">Max Rate<span style={{ color: '#ef4444' }}> *</span></label>
                      <div className="rate-input-container">
                        <span className="rate-prefix">USD</span>
                        <input
                          type="number"
                          className="rate-input"
                          name="salaryMax"
                          placeholder="c.g. 160"
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
              </div>   
            </div>

            {/* JOB DETAILS & REQUIREMENTS */}
            <div style={{ marginBottom: '40px' }}>
              <span className="status-tag status-progress font-mono mb-3 d-inline-block" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', background: '#eef2f6', color: '#5B5BD6', padding: '4px 10px', borderRadius: '6px', fontWeight: 'bold' }}>Job Details & Requirements</span>

              <div className="grid-4">
                <div>
                  <label className="auth-label">Work Model<span style={{ color: '#ef4444' }}> *</span></label>
                  <select className="auth-input placeholder-text" name="workModel" value={formik.values.workModel} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                    <option value="">Select model</option>
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                  {err("workModel")}
                </div>

                <div>
                  <label className="auth-label">Department<span style={{ color: '#ef4444' }}> *</span></label>
                  <select className="auth-input placeholder-text" name="department" value={formik.values.department} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                    <option value="">Select department</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Product">Product</option>
                  </select>
                  {err("department")}
                </div>

                <div>
                  <label className="auth-label">Experience<span style={{ color: '#ef4444' }}> *</span></label>
                  <select className="auth-input placeholder-text" name="experienceLevel" value={formik.values.experienceLevel} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                    <option value="">Select level</option>
                    <option value="Junior">Junior</option>
                    <option value="Mid-Level">Mid-Level</option>
                    <option value="Senior">Senior</option>
                  </select>
                  {err("experienceLevel")}
                </div>

                <div>
                  <label className="auth-label">Education<span style={{ color: '#ef4444' }}> *</span></label>
                  <select className="auth-input placeholder-text" name="educationLevel" value={formik.values.educationLevel} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                    <option value="">Select education</option>
                    <option value="Bachelors">Bachelor's</option>
                    <option value="Masters">Master's</option>
                  </select>
                  {err("educationLevel")}
                </div>
              </div>

              <div className="grid-4 mt-3">
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

                <div className="auth-form-group" style={{ marginBottom: 0 }}>
                  <label className="auth-label">Required Skills (Press Enter)<span style={{ color: '#ef4444' }}> *</span></label>
                  <input
                    className="auth-input"
                    placeholder="Add skills (Press Enter)"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                  />
                  <p style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
                    Type a skill and press <b>Enter</b> to add it. Repeat to add multiple skills.
                  </p>
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

              <div className="auth-form-group mt-4">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <label className="auth-label m-0">Job Description<span style={{ color: '#ef4444' }}> *</span></label>
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
                    placeholder="Describe the role and responsibilities..."
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
              <span className="status-tag status-progress font-mono mb-3 d-inline-block" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', background: '#eef2f6', color: '#5B5BD6', padding: '4px 10px', borderRadius: '6px', fontWeight: 'bold' }}>Additional Requirements</span>
              <div className="auth-form-group">
                <label className="auth-label mb-2">Any other requirements...</label>
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
              {/* <label className="share-linkedin-container">
                <input
                  type="checkbox"
                  checked={shareToLinkedIn}
                  onChange={(e) => setShareToLinkedIn(e.target.checked)}
                />
                <span className="linkedin-icon-blue"><FiLinkedin style={{ marginRight: '4px' }} /></span>
                <span>Share with social network (LinkedIn)</span>
              </label> */}
              
              <div className="d-flex gap-3">
                {/* <button type="button" className="btn-create-post" onClick={handleSaveDraft}>
                  Create Post
                </button> */}
                <button type="submit" className="btn-publish-vacancy">
                  Publish Vacancy
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
                    {getInitials(formik.values.companyName)}
                  </div>
                  <span className="preview-company-name">
                    {formik.values.companyName || "MYLAS RECRUITING SOLUTIONS"}
                  </span>
                </div>
                {/* <span className="preview-badge-remote">Remote</span> */}
              </div>

              <h3 className="preview-job-title">
                {formik.values.jobTitle || "Senior Full Stack Dev"}
              </h3>

              <div className="preview-metas-grid">
                
                <div className="preview-meta-item">
                  <span className="preview-meta-icon"><MapPin size={14} /></span>
                  <span>Remote Available</span>
                </div>

                <div className="preview-meta-item rate-highlight">
                  <span className="preview-meta-icon rate-highlight"><DollarSign size={14} /></span>
                  <span>{getSalaryString()}</span>
                </div>

                <div className="preview-meta-item">
                  <span className="preview-meta-icon"><Clock size={14} /></span>
                  <span>{getDurationString()}</span>
                </div>

                <div className="preview-meta-item">
                  <span className="preview-meta-icon"><Briefcase size={14} /></span>
                  <span>{getEmploymentTypeString()}</span>
                </div>

              </div>

              <div style={{ height: '1px', backgroundColor: '#20273a' }} />

              {/* Tech Stack */}
              <div>
                <p className="preview-section-title">
                  REQUIRED INTEL TECH STACK:
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
                      <span className="preview-tech-pill">React</span>
                      <span className="preview-tech-pill">TypeScript</span>
                      <span className="preview-tech-pill">Node.js</span>
                    </>
                  )}
                </div>
              </div>

              {/* Description Abstract */}
              <div>
                <p className="preview-section-title">
                  Description abstract:
                </p>
                <p className="preview-description-abstract">
                  {formik.values.description 
                    ? (formik.values.description.length > 150 
                       ? formik.values.description.slice(0, 150) + "..." 
                       : formik.values.description)
                    : "Configure fields on the left and trigger AI Generation tool to compose full text."}
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
                <h4 className="crm-notice-title">Sourcing Information</h4>
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
            onPostJob={handlePostJob}   // ✅ API CALL HERE
            isEdit={isEdit}
          />
        )
      }
    </form >
  );
};

export default PostNewPositions;