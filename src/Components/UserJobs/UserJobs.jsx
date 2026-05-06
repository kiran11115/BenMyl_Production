import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  FiSearch,
  FiMapPin,
  FiClock,
  FiDollarSign,
  FiUser,
  FiPlus,
  FiFilter,
} from "react-icons/fi";
import { BsBuilding } from "react-icons/bs";
import JobFilters from "../Filters/JobFilters";
import JobModal from "./JobModal";
import FilterBottomSheet from "../Common/FilterBottomSheet";
import "./Jobs.css";
import { useGetFindJobsMutation } from "../../State-Management/Api/ProjectApiSlice";
import NoData from "../UploadTalent/NoData";
import { useLocation } from "react-router-dom";

const PAGE_SIZE = 10;

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
      rateText:
        job.salaryRange_Min && job.salaryRange_Max
          ? `$${job.salaryRange_Min}-${job.salaryRange_Max}`
          : job.salaryRange_Min
            ? `$${job.salaryRange_Min}`
            : "N/A",
      experienceText: job.experienceLevel,
      description: job.jobDescription,
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
          <h1
            style={{
              fontSize: "28px",
              fontWeight: 700,
              margin: "0 0 4px 0",
              color: "var(--slate-800)",
            }}
          >
            Find Jobs
          </h1>
          <p style={{ margin: 0, color: "var(--slate-500)", fontSize: "14px" }}>
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
                border: "1px solid #f1f5f9",
                outline: "none",
                fontSize: "14px",
                color: "#334155",
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
          height: "calc(100vh - 0px)", // ✅ FIXED HEIGHT
        }}
      >
        {/* Sidebar */}
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
        <main className="jobs-results-wrapper" ref={resultsRef}>
          <div className="jobs-grid">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <div
                  key={job.id}
                  className={`tp-item-card ${selectedJob?.id === job.id ? "active-card" : ""}`}
                >
                  <div className="tp-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Header */}
                    <div className="d-flex align-items-start gap-3">
                      <div className="company-icon-box" style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                        <BsBuilding size={20} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 className="job-title" style={{ fontSize: '14px', fontWeight: '700', marginBottom: '2px', color: '#0f172a' }}>{job.title}</h3>
                        <div className="d-flex flex-column">
                          <p className="company-name" style={{ color: '#3b82f6', fontWeight: '600', fontSize: '12px', margin: 0 }}>{job.company}</p>
                          <div className="d-flex align-items-center gap-1 text-muted" style={{ fontSize: '11px' }}>
                            <FiMapPin size={10} /> {job.location}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Highlighted Stats */}
                    <div className="drawer-stats-3" style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                      <div className="d-flex flex-column">
                        <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: '700', letterSpacing: '0.02em' }}>Budget</span>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a' }}>{job.rateText} {job.salaryType}</span>
                      </div>
                      <div className="d-flex flex-column">
                        <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: '700', letterSpacing: '0.02em' }}>Exp</span>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a' }}>{job.experienceText}</span>
                      </div>
                      <div className="d-flex flex-column">
                        <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: '700', letterSpacing: '0.02em' }}>Type</span>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a' }}>{job.type}</span>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="d-flex flex-wrap gap-2">
                      {job.skills?.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="tp-tag-pill"
                          style={{ fontSize: '11px', padding: '4px 10px', background: '#f1f5f9', borderRadius: '6px', color: '#475569', fontWeight: '600' }}
                        >
                          {skill}
                        </span>
                      ))}
                      {job.skills?.length > 3 && (
                        <span style={{ fontSize: '11px', color: '#94a3b8', alignSelf: 'center' }}>+{job.skills.length - 3}</span>
                      )}
                    </div>

                    {/* Action */}
                    <button
                      className="btn-primary w-100"
                      onClick={() => handleAddTalentClick(job)}
                      style={{ marginTop: 'auto', padding: '10px', borderRadius: '10px', fontWeight: '600', fontSize: '13px' }}
                    >
                      Add Talent
                    </button>
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
          {isLoading && (
            <div style={{ textAlign: "center", padding: 16 }}>
              Loading more jobs…
            </div>
          )}
        </main>
      </div>

      {selectedJob && (
        <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  );
};

export default UserJobs;
