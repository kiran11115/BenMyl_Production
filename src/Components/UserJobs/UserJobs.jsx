import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  FiSearch,
  FiMapPin,
  FiFilter,
  FiBriefcase,
  FiEye,
} from "react-icons/fi";
import JobFilters from "../Filters/JobFilters";
import JobModal from "./JobModal";
import FilterBottomSheet from "../Common/FilterBottomSheet";
import "./Jobs.css";
import { useGetFindJobsMutation } from "../../State-Management/Api/ProjectApiSlice";
import NoData from "../UploadTalent/NoData";
import { useLocation } from "react-router-dom";

const PAGE_SIZE = 50;

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
  const loadingRef = useRef(false);

  // Search state (matching Talent Profile functionality)
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceRef = useRef(null);

  // Debounce search query
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [searchQuery]);

  // pagination
  const [pageNumber, setPageNumber] = useState(1);
  const [allJobs, setAllJobs] = useState([]);

  // Refs to always hold latest values inside scroll/async callbacks
  const hasMoreRef = useRef(true);
  const pageNumberRef = useRef(1);

  // scroll container ref
  const resultsRef = useRef(null);

  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

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

    // Job Title Search (Contains)
    if (debouncedSearch) {
      apiFilters.push({
        filterName: "Job Title",
        filterOperator: "Contains",
        filterValue: [debouncedSearch],
      });
    }

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

    // Work Models (Job Type)
    if (filters.locationType && filters.locationType !== "Any Type") {
      const apiVal = filters.locationType === "On-Site" ? "On-site" : filters.locationType;
      apiFilters.push({
        filterName: "workModels",
        filterOperator: "string",
        filterValue: [apiVal],
      });
    }

    return apiFilters;
  };
  // initial + pagination fetch
  useEffect(() => {
    let isMounted = true;
    loadingRef.current = true;

    const fetchJobs = async () => {
      if (pageNumber > 1 && !hasMoreRef.current) {
        loadingRef.current = false;
        return;
      }

      let res = [];

      try {
        const payload = {
          ComponyID: Number(companyId),
          pageNumber,
          pageSize: PAGE_SIZE,
          filters: buildApiFilters(filters),
        };

        res = await getTalentJobs(payload).unwrap();

        if (!isMounted) return;

        if (!Array.isArray(res) || res.length === 0) {
          hasMoreRef.current = false;
          return;
        }

        setAllJobs(prev =>
          pageNumber === 1 ? res : [...prev, ...res]
        );

        if (res.length < PAGE_SIZE) {
          hasMoreRef.current = false;
        }
      } catch (err) {
        console.error("Fetch jobs failed:", err);
      } finally {
        if (isMounted) {
          loadingRef.current = false;
        }
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
            userId: jobToOpen.userId,
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

    fetchJobs();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, filters, debouncedSearch]);

  // =========================
  // SCROLL HANDLER (same as TalentPool)
  // =========================
  useEffect(() => {
    const el = resultsRef.current;
    if (!el) return;

    const onScroll = () => {
      if (
        el.scrollTop + el.clientHeight >= el.scrollHeight - 50 &&
        hasMoreRef.current &&
        !loadingRef.current
      ) {
        loadingRef.current = true; // prevent duplicate increments
        setPageNumber(prev => {
          const next = prev + 1;
          pageNumberRef.current = next;
          return next;
        });
      }
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

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
      userId: job.userId,
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
        if (t.includes("hour") || t.includes("/hr") || t === "hourly") return "/Hr";
        if (t.includes("month")) return "/Month";
        if (t.includes("budget") || t.includes("fixed") || t.includes("entire")) return "- Budget";
        return "/Hr"; // default
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

  // Client-side search filtering (fast visual refinement)
  const filteredJobs = useMemo(() => {
    if (!searchQuery.trim()) return jobs;
    const query = searchQuery.toLowerCase();
    return jobs.filter((job) =>
      job.title?.toLowerCase().includes(query) ||
      job.company?.toLowerCase().includes(query) ||
      job.location?.toLowerCase().includes(query) ||
      job.description?.toLowerCase().includes(query) ||
      job.type?.toLowerCase().includes(query) ||
      job.skills?.some((s) => s.toLowerCase().includes(query))
    );
  }, [jobs, searchQuery]);

  useEffect(() => {
    setAllJobs([]);
    setPageNumber(1);
    pageNumberRef.current = 1;
    hasMoreRef.current = true;
    setMinTimeElapsed(false);
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [filters, debouncedSearch]);




  return (
    <div className="user-jobs-page-wrapper">
      <div className="user-jobs-main-content">
        {/* LEFT FILTER */}
        <aside className="vs-filters-sidebar">
          <JobFilters
            initialFilters={filters}
            onApplyFilters={(appliedFilters) => {
              setAllJobs([]);
              setPageNumber(1);
              setFilters(appliedFilters);
            }}
          />
        </aside>

        <FilterBottomSheet
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
          title="Filters"
        >
          <JobFilters
            initialFilters={filters}
            onApplyFilters={(appliedFilters) => {
              setAllJobs([]);
              setPageNumber(1);
              setFilters(appliedFilters);
              setIsMobileFilterOpen(false);
            }}
          />
        </FilterBottomSheet>

        {/* RIGHT */}
        <div className="user-jobs-right-section">
          {/* TOP */}
          <div className="hero-section-wrapper mb-4">
        <div className="hero-card ">
          <div className="hero-concentric-lines"></div>
          <div className="hero-ripple-pattern"></div>
          <div className="hero-circular-highlights"></div>
            <div className="hero-left">
              <div className="hero-pill">
                ✦ Find jobs
              </div>
              <h1 className="job-posting-title text-white">Jobs & Openings Board</h1>
              <div className="job-posting-header-info">
                <p className="job-posting-subtitle">
                  Showing {filteredJobs.length} matches based on your interactive filters
                </p>
              </div>
            </div>

            <div className="hero-card-actions-wrapper">
              <button
                className="filters-applied"
                onClick={() => setIsMobileFilterOpen(true)}
              >
                <FiFilter /> Filters
              </button>

              <div className="user-jobs-search-wrapper">
                <FiSearch className="user-jobs-search-icon" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="jobs-search-input"
                />
              </div>
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
            <img src="/Images/jobs.png" alt="Dashboard Illustration" className="hero-svg-image" />
          </div>
        </div>
      </div>

          {/* GRID */}
          <div
            ref={resultsRef}
            className="user-jobs-results-container"
          >
            {(isLoading || !minTimeElapsed) && allJobs.length === 0 ? (
              <div className="jobs-screen-loader">
                <div className="jobs-loader-ring">
                  <div className="jobs-loader-icon">
                    <FiBriefcase size={18} />
                  </div>
                </div>
                <p className="jobs-loader-text">Searching for job opportunities...</p>
                <span className="jobs-loader-sub">Matching roles based on your filters</span>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="user-jobs-empty-state-wrapper">
                <NoData text={searchQuery ? "No jobs matching your search" : "No jobs found"} />
              </div>
            ) : (
              <div className="user-jobs-grid-layout">
                {filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => setSelectedJob(job)}
                    className="job-card"
                  >
                    {/* TOP */}
                    <div className="job-card-header">
                      <div className="job-header-left">
                        <div className="job-company-logo">
                          {getInitials(job.company)}
                        </div>

                        <div className="job-header-info">
                          <h3 className="job-title">{job.title}</h3>
                          <p className="company-name">{job.company}</p>
                        </div>
                      </div>

                      <div className="job-eye-icon">
                        <FiEye size={22} />
                      </div>
                    </div>

                    {/* TAGS */}
                    <div className="job-tags-row">
                      <span className="job-chip purple">
                        {job.experienceText}
                      </span>

                      <span className="job-chip green">
                        {job.workModel}
                      </span>

                      <span className="job-chip mint">
                        {job.type?.length > 12
                          ? `${job.type.slice(0, 12)}...`
                          : job.type}
                      </span>
                    </div>

                    {/* DESC */}
                    <p className="job-description">
                      {job.description?.replace(/\*\*/g, "")}
                    </p>

                    {/* FOOTER */}
                    <div className="job-card-footer">
                      <div className="job-rate">
                        {job.rateText}
                        <span className="job-rate-unit">
                          {job.salaryType}
                        </span>
                      </div>

                      <div className="meta-pill">
                        <FiMapPin size={12} />
                        <span
                          title={job.location}
                          className="user-jobs-location-text"
                        >
                          {job.location ? job.location.split(',')[0].trim() : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedJob && (
        <JobModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          initialSelectedTalentId={
            location.state?.initialSelectedTalentId
          }
        />
      )}
    </div>
  );
};

export default UserJobs;
