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
  FiEye,
  FiChevronDown,
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

  useEffect(() => {
    setAllJobs([]);
    setPageNumber(1);
    setHasMore(true);
    setMinTimeElapsed(false);
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [filters]);


  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleAddTalentClick = (job) => {
    setSelectedJob(job);
  };

  return (
      <div
        style={{
          background: "#f5f7fb",
          minHeight: "100vh",
          padding: "18px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "22px",
            alignItems: "flex-start",
          }}
        >
          {/* LEFT FILTER */}

        <aside
          style={{
            width: "310px",
            minWidth: "310px",
            background: "#fff",
            borderRadius: "28px",
            padding: "24px",
            border: "1px solid #e7ebf3",
            height: "fit-content",
            overflowY: "auto",
            position: "sticky",
            top: "20px",
          }}
        >
          <JobFilters
            initialFilters={filters}
            onApplyFilters={(appliedFilters) => {
              setAllJobs([]);
              setPageNumber(1);
              setHasMore(true);
              setFilters(appliedFilters);
            }}
          />
        </aside>

          {/* RIGHT */}

          <div style={{ flex: 1 }}>

            {/* TOP */}


                    <div className="hero-card mb-4">
                  <div className="hero-left">
                    <div className="hero-pill">
                              ✦ Find jobs
                            </div>
                  <h1 className="job-posting-title text-white">Jobs & Openings Board</h1>
                  
                   
                  <div className="job-posting-header-info">
                  
                  <p className="job-posting-subtitle">
                   Showing {jobs.length} matches based on your interactive filters
                  </p>
                  </div>
                  </div>
                   
                   <div style={{ position: "relative" }}>
              <select className="routine-btn me-2"
                defaultValue="Most recent"
              >
                <option value="Most recent">Most Recent</option>
              </select>
              <FiChevronDown
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#ffffffff",
                  pointerEvents: "none",
                }}
              />
            </div>
                  </div>

          {/* GRID */}

          <div
            ref={resultsRef}
            style={{
              height: "calc(100vh - 140px)",
              overflowY: "auto",
              paddingRight: "4px",
            }}
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
            ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill,minmax(320px,1fr))",
                gap: "22px",
                paddingTop:"8px"
              }}
            >
              {jobs.map((job) => (
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
                        style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
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
