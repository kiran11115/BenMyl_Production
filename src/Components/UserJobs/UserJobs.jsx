import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  FiSearch,
  FiMapPin,
  FiClock,
  FiDollarSign,
  FiUser,
  FiPlus,
  FiFilter,
  FiBriefcase,
  FiVideo,
} from "react-icons/fi";
import JobFilters from "../Filters/JobFilters";
import JobModal from "./JobModal";
import FilterBottomSheet from "../Common/FilterBottomSheet";
import "./Jobs.css";
import { useGetFindJobsMutation } from "../../State-Management/Api/ProjectApiSlice";
import NoData from "../UploadTalent/NoData";
import { useLocation } from "react-router-dom";

const PAGE_SIZE = 10;

const getInitials = (name = "") => {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
};

const UserJobs = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const companyId = localStorage.getItem("logincompanyid");
  const location = useLocation();
  const roleFromProfile = location.state?.role;
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // pagination
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [allJobs, setAllJobs] = useState([]);

  // scroll container ref
  const resultsRef = useRef(null);

  const [getTalentJobs, { isLoading }] = useGetFindJobsMutation();

  // filters (unchanged)
  const [filters, setFilters] = useState({
    keyword: "",
    locationType: "Any Type",

    roles: roleFromProfile ? [roleFromProfile] : [],
    skills: [],
    availability: [],

    location: "",

    minExperience: "",
    maxExperience: "",

    minSalary: "",
    maxSalary: "",
  });


  // =========================
  // FETCH JOBS (pagination)
  // =========================
  const buildApiFilters = (filters) => {
    const apiFilters = [];

    // Job Title
    if (filters.roles?.length) {
      apiFilters.push({
        filterName: "Job Title",
        filterOperator: "Equals",
        filterValue: filters.roles,
      });
    }

    // Location (single input → array)
    if (filters.location?.trim()) {
      apiFilters.push({
        filterName: "Location",
        filterOperator: "Equals",
        filterValue: [filters.location.trim()],
      });
    }

    // Skills (multi-select)
    if (filters.skills?.length) {
      apiFilters.push({
        filterName: "skills",
        filterOperator: "Equals",
        filterValue: filters.skills.map(s => s.toLowerCase()),
      });
    }

    if (filters.minSalary && filters.maxSalary) {
      apiFilters.push({
        filterName: "Salary Range",
        filterOperator: "Equals",
        filterValue: [
          `${filters.minSalary} - ${filters.maxSalary}`
        ],
      });
    }

    // Years of Experience
    if (filters.minExperience && filters.maxExperience) {
      apiFilters.push({
        filterName: "Years of Experience",
        filterOperator: "Equals",
        filterValue: [
          `${filters.minExperience}- ${filters.maxExperience}`
        ],
      });
    }

    return apiFilters;
  };
  const fetchJobs = async () => {
    if (!hasMore) return;

    const payload = {
      ComponyID: Number(companyId), // ⚠ exact casing required
      pageNumber,
      pageSize: PAGE_SIZE,
      filters: buildApiFilters(filters),
    };

    const res = await getTalentJobs(payload).unwrap();

    if (!Array.isArray(res) || res.length === 0) {
      setHasMore(false);
      return;
    }

    setAllJobs((prev) =>
      pageNumber === 1 ? res : [...prev, ...res]
    );

    if (res.length < PAGE_SIZE) {
      setHasMore(false);
    }

    // Auto-open logic
    const autoOpenJobId = location.state?.autoOpenJobId;
    if (autoOpenJobId && pageNumber === 1) {
      const jobToOpen = res.find(j => (j.jobID || j.id) === autoOpenJobId);
      if (jobToOpen) {
        // We need to map it to the UI format
        const mappedJob = {
          id: jobToOpen.jobID,
          title: jobToOpen.jobTitle,
          company: jobToOpen.companyName,
          location: jobToOpen.location,
          type: jobToOpen.employeeType,
          workModel: jobToOpen.workModels,
          department: jobToOpen.department,
          jobDuration: jobToOpen.jobDuration,
          jobDurationText: jobToOpen.jobDuration ? `${jobToOpen.jobDuration} ${jobToOpen.jobDuration_Unit || "Months"}` : null,
          rateText: jobToOpen.salaryRange_Min && jobToOpen.salaryRange_Max
            ? `$${jobToOpen.salaryRange_Min}-${jobToOpen.salaryRange_Max}`
            : jobToOpen.salaryRange_Min
              ? `$${jobToOpen.salaryRange_Min}`
              : "N/A",
          experienceText: jobToOpen.experienceLevel,
          description: jobToOpen.jobDescription,
          additionalRequirements: jobToOpen.additionalRequirements,
          salaryType: (() => {
            const t = (jobToOpen.salarType || "").toLowerCase();
            if (t.includes("hour") || t.includes("/hr") || t === "hourly") return "/hr";
            if (t.includes("month")) return "/month";
            if (t.includes("budget") || t.includes("fixed") || t.includes("entire")) return "Budget";
            return "/hr";
          })(),
          educationLevel: jobToOpen.educationLevel,
          yearsOfExperience: jobToOpen.yearsOfExperience,
          skills: jobToOpen.requiredSkills
            ? jobToOpen.requiredSkills.split(",").map((s) => s.trim())
            : [],
          workAuthorization: [
            jobToOpen.isUSCitizen && "US Citizen",
            jobToOpen.isGC && "Green Card",
            jobToOpen.isH1B && "H1B",
            jobToOpen.isEAD && "EAD",
            jobToOpen.isOPT && "OPT",
            jobToOpen.isCPT && "CPT",
            jobToOpen.isH4 && "H4",
          ].filter(Boolean),
          preferredEmployment: [
            jobToOpen.isCorpToCorp && "Corp-Corp",
            jobToOpen.isW2Permanent && "W2-Permanent",
            jobToOpen.isW2Contract && "W2-Contract",
            jobToOpen.is1099Contract && "1099-Contract",
            jobToOpen.isContractToHire && "Contract to Hire",
          ].filter(Boolean),
        };
        setSelectedJob(mappedJob);
      }
    }
  };

  // initial + pagination fetch
  useEffect(() => {
    fetchJobs();
  }, [pageNumber, filters]);

  // =========================
  // SCROLL HANDLER (same as TalentPool)
  // =========================
  useEffect(() => {
    const el = resultsRef.current;
    if (!el) return;

    const onScroll = () => {
      if (
        el.scrollTop + el.clientHeight >= el.scrollHeight - 50 &&
        hasMore &&
        !isLoading
      ) {
        setPageNumber((prev) => prev + 1);
      }
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [hasMore, isLoading]);

  // =========================
  // NORMALIZE API DATA → UI
  // =========================
  const jobs = useMemo(() => {
    return allJobs.map((job) => ({
      id: job.jobID,
      title: job.jobTitle,
      company: job.companyName,
      location: job.location,
      type: job.employeeType,
      workModel: job.workModels,
      department: job.department,
      jobDuration: job.jobDuration,
      jobDurationText: job.jobDuration ? `${job.jobDuration} ${job.jobDuration_Unit || "Months"}` : null,
      rateText:
        job.salaryRange_Min && job.salaryRange_Max
          ? `$${job.salaryRange_Min}-${job.salaryRange_Max}`
          : job.salaryRange_Min
            ? `$${job.salaryRange_Min}`
            : "N/A",
      experienceText: job.experienceLevel,
      description: job.jobDescription,
      additionalRequirements: job.additionalRequirements,
      salaryType: (() => {
        const t = (job.salarType || "").toLowerCase();
        if (t.includes("hour") || t.includes("/hr") || t === "hourly") return "/hr";
        if (t.includes("month")) return "/month";
        if (t.includes("budget") || t.includes("fixed") || t.includes("entire")) return "Budget";
        return "/hr"; // default
      })(),
      educationLevel: job.educationLevel,
      yearsOfExperience: job.yearsOfExperience,
      skills: job.requiredSkills
        ? job.requiredSkills.split(",").map((s) => s.trim())
        : [],
      workAuthorization: [
        job.isUSCitizen && "US Citizen",
        job.isGC && "Green Card",
        job.isH1B && "H1B",
        job.isEAD && "EAD",
        job.isOPT && "OPT",
        job.isCPT && "CPT",
        job.isH4 && "H4",
      ].filter(Boolean),
      preferredEmployment: [
        job.isCorpToCorp && "Corp-Corp",
        job.isW2Permanent && "W2-Permanent",
        job.isW2Contract && "W2-Contract",
        job.is1099Contract && "1099-Contract",
        job.isContractToHire && "Contract to Hire",
      ].filter(Boolean),
    }));
  }, [allJobs]);

  useEffect(() => {
    setAllJobs([]);
    setPageNumber(1);
    setHasMore(true);
  }, [filters]);


  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleAddTalentClick = (job) => {
    setSelectedJob(job);
  };

  return (
    <div className="jobs-container">
      {/* 1. Header Section */}
      <div className="search-header-row d-flex justify-content-between">
        <div className="header-text">
          <div className="d-flex align-items-center gap-2">
            <h1
              style={{
                fontSize: "28px",
                fontWeight: 700,
                margin: "0",
                color: "var(--slate-800)",
              }}
            >
              Find Jobs
            </h1>
            <button
              className="video-btn-help"
              style={{
                background: 'var(--orange-light)',
                border: 'none',
                color: 'var(--orange-primary)',
                padding: '8px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                marginTop: '4px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'var(--orange-primary)';
                e.currentTarget.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'var(--orange-light)';
                e.currentTarget.style.color = 'var(--orange-primary)';
              }}
            >
              <FiVideo size={18} />
            </button>
          </div>
          <p style={{ margin: "4px 0 0 0", color: "var(--slate-500)", fontSize: "14px", fontWeight: "500" }}>
            Search and manage your Jobs network.
          </p>
        </div>

        <div className="search-input-container" style={{ display: "flex", gap: "12px", flex: 1, maxWidth: "400px" }}>
          <div className="search-box-wrapper" style={{ position: "relative", flex: 1 }}>
            <FiSearch
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94a3b8",
              }}
            />
            <input
              type="text"
              placeholder="Search by Talent Role..."
              style={{
                width: "100%",
                padding: "12px 16px 12px 44px",
                borderRadius: "14px",
                border: "1px solid var(--slate-100)",
                outline: "none",
                fontSize: "14px",
                color: "var(--slate-800)",
                background: "white",
                transition: "all 0.2s ease",
                boxShadow: "var(--shadow-sm)"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--orange-primary)";
                e.target.style.boxShadow = "0 0 0 3px rgba(245, 129, 12, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--slate-100)";
                e.target.style.boxShadow = "var(--shadow-sm)";
              }}
            />
          </div>
          <button
            className="filters-applied"
            onClick={() => setIsMobileFilterOpen(true)}
          >
            <FiFilter /> Filters
          </button>
        </div>
      </div>

      {/* 2. Layout (Sidebar + Grid) */}
      <div
        className="jobs-layout"
        style={{
          display: "flex",
          gap: 16,
          height: "calc(100vh - 200px)",
          overflow: "hidden"
        }}
      >
        <aside className="vs-filters-sidebar hide-scrollbar" style={{ overflowY: "auto" }}>
          <JobFilters initialFilters={filters} onApplyFilters={(appliedFilters) => {
            setAllJobs([]);
            setPageNumber(1);
            setHasMore(true);
            setFilters(appliedFilters);
          }} />
        </aside>

        <FilterBottomSheet
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
          title="Filters"
        >
          <JobFilters initialFilters={filters} onApplyFilters={(appliedFilters) => {
            setAllJobs([]);
            setPageNumber(1);
            setHasMore(true);
            setFilters(appliedFilters);
            setIsMobileFilterOpen(false);
          }} />
        </FilterBottomSheet>

        {/* Main Grid */}
        <main className="jobs-results-wrapper">
          <div className="jobs-main-container">
            {isLoading && pageNumber === 1 ? (
              <div className="container-loader-wrapper">
                <div className="custom-loader"></div>
                <span className="loader-text">Finding the best jobs for you...</span>
              </div>
            ) : (
              <div className="jobs-grid" ref={resultsRef}>
                {jobs.length > 0 ? (
                  jobs.map((job) => (
                    <div
                      key={job.id}
                      className={`interview-card-v2 ${selectedJob?.id === job.id ? "active-card" : ""}`}
                      style={{height:'max-content'}}
                    >
                      <div className="card-accent-bar"></div>
                      <div className="d-flex flex-column h-100 gap-3">
                        {/* Header: Company Avatar + Title */}
                        <div className="card-header-row">
                          <div className="status-pill-v2">
                            <span className="dot" style={{ background: '#3b82f6' }}></span>
                            Active
                          </div>
                          {job.jobDurationText && (
                            <div className="time-badge">
                              <FiClock size={12} /> {job.jobDurationText}
                            </div>
                          )}
                        </div>

                        <div className="card-profile-section">
                          <div className="avatar-initials-premium">
                            {getInitials(job.company)}
                          </div>
                          <div className="profile-details">
                            <h4 className="candidate-name" title={job.title}>{job.title}</h4>
                            <p className="candidate-role" style={{ color: 'var(--primary)', fontWeight: '600' }}>
                              {job.company}
                            </p>
                          </div>
                        </div>

                        {/* Meta Info Grid */}
                        <div className="card-meta-grid">
                          <div className="meta-pill">
                            <FiDollarSign size={12} />
                            <span>{job.rateText}{job.salaryType ? ` ${job.salaryType}` : ''}</span>
                          </div>
                          <div className="meta-pill">
                            <FiBriefcase size={12} />
                            <span>{job.experienceText}</span>
                          </div>
                          <div className="meta-pill">
                            <FiMapPin size={12} />
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{job.location}</span>
                          </div>
                          <div className="meta-pill">
                            <FiUser size={12} />
                            <span>{job.workModel || job.type}</span>
                          </div>
                        </div>

                        {/* Skills Row */}
                        <div className="card-skills-row mt-1">
                          {job.skills?.slice(0, 3).map((skill) => (
                            <span key={skill} className="status-tag">
                              {skill}
                            </span>
                          ))}
                          {job.skills?.length > 3 && (
                            <span className="status-tag count">
                              +{job.skills.length - 3}
                            </span>
                          )}
                        </div>

                        {/* Action Button */}
                        <div className="card-actions-v2 mt-auto">
                          <button
                            className="btn-v2-primary w-100"
                            onClick={() => handleAddTalentClick(job)}
                            style={{ gridColumn: 'span 2' }}
                          >
                            <FiPlus size={16} /> Add Talent
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : !isLoading ? (
                  <div
                    style={{
                      gridColumn: "1 / -1",
                      minHeight: "320px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <NoData text="No jobs found matching your filters" />
                  </div>
                ) : null}
              </div>
            )}
            {isLoading && pageNumber > 1 && (
              <div className="compact-loader-wrapper">
                <div className="compact-loader"></div>
                <span className="compact-loader-text">Loading more jobs...</span>
              </div>
            )}
          </div>
        </main>
      </div>

      {selectedJob && (
        <JobModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          initialSelectedTalentId={location.state?.initialSelectedTalentId}
        />
      )}
    </div>
  );
};

export default UserJobs;
