import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  FiSearch,
  FiMapPin,
  FiClock,
  FiDollarSign,
  FiUser,
  FiPlus,
} from "react-icons/fi";
import { BsBuilding } from "react-icons/bs";
import JobFilters from "../Filters/JobFilters";
import JobModal from "./JobModal";
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
  const fetchJobs = async () => {
    if (!hasMore) return;

    const payload = {
      companyid: Number(companyId),
      pageNumber,
      pageSize: PAGE_SIZE,
      filters: filters.roles?.length
  ? [
      {
        filterName: "Job Title",
        filterOperator: "Equals",
        filterValue: filters.roles,
      },
    ]
  : [],


    };

    const res = await getTalentJobs(payload).unwrap();

    if (!Array.isArray(res) || res.length === 0) {
      setHasMore(false);
      return;
    }

    setAllJobs((prev) => (pageNumber === 1 ? res : [...prev, ...res]));

    // stop pagination if backend returns less than page size
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
      rateText: job.salaryRange_Min
        ? `$${job.salaryRange_Min}-${job.salaryRange_Max}/hr`
        : "N/A",
      experienceText: job.experienceLevel,
      description:job.jobDescription,
      educationLevel:job.educationLevel,
      yearsOfExperience:job.yearsOfExperience,
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
              fontSize: "24px",
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

        <div style={{ position: "relative", flex: 1, maxWidth: "400px" }}>
          <FiSearch
            style={{
              position: "absolute",
              left: "12px",
              top: "35%",
              transform: "translateY(-50%)",
              color: "#94a3b8",
            }}
          />
          <input
            type="text"
            placeholder="Search by Talent Role..."
            style={{
              width: "100%",
              padding: "7px 10px 7px 40px",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              outline: "none",
              fontSize: "14px",
              color: "#334155",
            }}
          />
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
        <aside>
          <JobFilters initialFilters={filters} onApplyFilters={(appliedFilters) => {
  setAllJobs([]);
  setPageNumber(1);
  setHasMore(true);
  setFilters(appliedFilters);
}} />

        </aside>

        {/* Main Grid */}
        <main className="jobs-results-wrapper" ref={resultsRef}>
          <div className="jobs-grid">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <div
                  key={job.id}
                  className={`project-card ${selectedJob?.id === job.id ? "active-card" : ""}`}
                  style={{ gap: "0" }}
                >
                  {/* A. Header: Title & Company Info */}
                  <div
                    className="job-card-top"
                    style={{ marginBottom: "16px", alignItems: "flex-start" }}
                  >
                    <div className="company-icon-box large">
                      <BsBuilding size={24} />
                    </div>
                    <div className="job-header-info">
                      <h3
                        className="job-title"
                        style={{ fontSize: "18px", marginBottom: "6px" }}
                      >
                        {job.title}
                      </h3>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px",
                        }}
                      >
                        <p
                          className="company-name"
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#6366f1",
                          }}
                        >
                          {job.company}
                        </p>
                        <div
                          style={{
                            fontSize: "13px",
                            color: "var(--slate-500)",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <FiMapPin size={12} /> {job.location}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* B. Stats Block (Grey Box) */}
                  <div
                    className="drawer-stats"
                    style={{ marginBottom: "20px" }}
                  >
                    <div className="drawer-stat-item">
                      <span className="label">Budget</span>
                      <span className="value">{job.rateText}</span>
                    </div>
                    <div className="drawer-stat-item">
                      <span className="label">Experience</span>
                      <span className="value">{job.experienceText}</span>
                    </div>
                    <div className="drawer-stat-item">
                      <span className="label">Type</span>
                      <span className="value">{job.type}</span>
                    </div>
                  </div>

                  {/* C. Description */}
                  {/* <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--slate-800)', margin: '0 0 8px 0' }}>
                    Job Description
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--slate-500)', lineHeight: '1.6', margin: 0 }}>
                    {job.description}
                  </p>
                </div> */}

                  {/* D. Skills Cloud */}
                  <div style={{ marginBottom: "24px" }}>
                    <h4
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "var(--slate-800)",
                        margin: "0 0 8px 0",
                      }}
                    >
                      Required Skills
                    </h4>
                    <div className="skills-cloud">
                      {job.skills.map((skill) => (
                        <span
                          key={skill}
                          className="status-tag status-progress"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* E. Action Button */}
                  <div
                    className="card-actions full-width"
                    style={{
                      marginTop: "auto",
                      borderTop: "none",
                      paddingTop: 0,
                    }}
                  >
                    <button
                      className="btn-primary full-width"
                      onClick={() => handleAddTalentClick(job)}
                    >
                      <FiPlus size={16} style={{ marginRight: "8px" }} />
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
