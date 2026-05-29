import React, { useMemo, useState, useEffect } from "react";
import { FiEye, FiMapPin, FiBriefcase } from "react-icons/fi";
import { BsBuilding } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useGetGroupedJobTitlesQuery } from "../../State-Management/Api/TalentPoolApiSlice";
import NoData from "../UploadTalent/NoData";
import "../UserJobs/Jobs.css";

const getInitials = (name = "") => {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
};

const PostedJobs = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("CompanyId");

  const { data: apiJobs = [], isLoading } = useGetGroupedJobTitlesQuery(userId);

  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const jobs = useMemo(() => {
    return apiJobs.map((job) => ({
      id: job.jobID,
      title: job.jobTitle,
      company: job.companyName,
      location: job.location,
      type: job.employeeType,
      workModels: job.workModels,
      salaryType: job.salarType,
      rateText:
        job.salaryRange_Min && job.salaryRange_Max
          ? `$${job.salaryRange_Min}-${job.salaryRange_Max}`
          : job.salaryRange_Min
            ? `$${job.salaryRange_Min}`
            : "N/A",
      budgetLabel: (() => {
        const t = (job.salarType || "").toLowerCase();
        if (t.includes("hour") || t.includes("/hr") || t === "hourly") return "/hr";
        if (t.includes("month")) return "/month";
        if (t.includes("budget") || t.includes("fixed") || t.includes("entire")) return "Budget";
        return "/hr"; // default
      })(),
      experienceLevel: job.experienceLevel,
      description: job.jobDescription || "",
      skills: job.requiredSkills
        ? job.requiredSkills.split(",").map((s) => s.trim())
        : [],
    }));
  }, [apiJobs]);

  if (isLoading || !minTimeElapsed) {
    return (
      <div className="posted-jobs-loader">
        <div className="jobs-loader-ring">
          <div className="jobs-loader-icon">
            <FiBriefcase size={18} />
          </div>
        </div>
        <p className="jobs-loader-text">Loading posted positions...</p>
        <span className="jobs-loader-sub">Fetching your active job listings</span>
      </div>
    );
  }

  return (
    <div className="jobs-wrapper">
      {jobs.length === 0 ? (
        <NoData text="No posted jobs available yet." />
      ) : (
        <div className="jobs-grid">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="job-card justify-content-between"
              onClick={() => {
                const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
                navigate(`${basePath}/job-overview`, {
                  state: { jobId: job.id },
                });
              }}
            >
              <div className="d-flex flex-column gap-3">
                {/* TOP */}
                <div className="job-card-header">
                  <div className="job-header-left">
                    <div className="job-company-logo">
                      {getInitials(job.company) || <BsBuilding size={20} />}
                    </div>

                    <div className="job-header-info">
                      <h3 className="job-title" title={job.title}>{job.title}</h3>
                      <p className="company-name">{job.company}</p>
                    </div>
                  </div>

                  <div className="job-eye-icon">
                    <FiEye size={22} />
                  </div>
                </div>

                {/* TAGS */}
                <div className="job-tags-row">
                  {job.experienceLevel && (
                    <span className="job-chip purple">
                      {job.experienceLevel}
                    </span>
                  )}

                  {job.workModels && (
                    <span className="job-chip green">
                      {job.workModels}
                    </span>
                  )}

                  {job.type && (
                    <span className="job-chip mint">
                      {job.type.length > 12
                        ? `${job.type.slice(0, 12)}...`
                        : job.type}
                    </span>
                  )}
                </div>

                {/* DESC */}
                <div className="job-desc-block">
                  <p className="job-description">
                    {job.description?.replace(/\*\*/g, "")}
                  </p>
                  <button
                    className="job-view-more-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
                      navigate(`${basePath}/job-overview`, { state: { jobId: job.id } });
                    }}
                  >
                    View more
                  </button>
                </div>

              </div>

              <div>
                {/* FOOTER */}
                <div className="job-card-footer">
                  <div className="job-rate">
                    {job.rateText}
                    <span className="job-rate-unit">
                      {job.budgetLabel}
                    </span>
                  </div>

                  <div className="meta-pill">
                    <FiMapPin size={12} />
                    <span
                      title={job.location}
                      style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    >
                      {job.location ? job.location.split(',')[0].trim() : "N/A"}
                    </span>
                  </div>
                </div>

                {/* VIEW DETAILS BUTTON */}
                {/* <button
                  className="btn-primary w-100 d-flex gap-2"
                  style={{ marginTop: '16px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
                    navigate(`${basePath}/job-overview`, {
                      state: { jobId: job.id },
                    });
                  }}
                >
                  <FiEye size={16} /> View Details
                </button> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostedJobs;
