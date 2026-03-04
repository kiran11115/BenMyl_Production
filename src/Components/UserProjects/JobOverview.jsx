import React, { useEffect } from "react";
import {
  FiArrowLeft,
  FiMapPin,
  FiBriefcase,
  FiHome,
  FiDollarSign,
  FiLayers,
  FiTrendingUp,
  FiBookOpen,
  FiClock,
  FiFileText,
  FiEdit,
} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import ShareJobCard from "./ShareJobCard";
import { useLazyGetJobByIdQuery } from "../../State-Management/Api/TalentPoolApiSlice";
import WorkAndPreference from "./WorkAndPreference";

const JobOverview = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const jobId = location.state?.jobId;
  const userId = localStorage.getItem("CompanyId");

  const [getJobById, { data }] = useLazyGetJobByIdQuery();

  useEffect(() => {
    if (jobId && userId) {
      getJobById({ jobId, userId });
    }
  }, [jobId, userId, getJobById]);

  const job = data?.[0];


  const formatPostedDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatMarkdownToHtml = (text) => {
    if (!text) return "";

    let formatted = text;

    // Remove first line completely
    formatted = formatted.replace(/^[^\n]*\n?/, "");

    // Convert bold
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Convert bullet points
    formatted = formatted.replace(/^\s*-\s+(.*)$/gm, "<li>$1</li>");

    if (formatted.includes("<li>")) {
      formatted = formatted.replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>");
    }

    formatted = formatted.replace(/\n/g, "<br/>");

    return formatted;
  };



  return (
    <div className="jobs-container">
      {/* HEADER */}
      <div className="mb-4">
        <div className="profile-breadcrumb d-flex gap-1">
          <button
            type="button"
            className="link-button"
            onClick={() => navigate("/user/user-projects")}
          >
            <FiArrowLeft /> Back to Projects
          </button>
          <span className="crumb">/ Job Overview</span>
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h2 className="drawer-header">Job Overview</h2>
            <p className="company-name">
              A complete summary of the job details and requirements
            </p>
          </div>
          <button
            className="btn-premium btn-premium-secondary"
            onClick={() =>
  navigate("/user/user-post-new-positions", {
    state: {
      jobId: job?.jobID,
      jobData: job,
      isEdit: true
    },
  })
}
            style={{
              padding: "8px 16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <FiEdit size={16} /> Edit Job
          </button>
        </div>
      </div>

      <div className="dashboard-layout">
        {/* LEFT MAIN CONTENT */}
        <div
          className="dashboard-column-main card-base"
          style={{ padding: "16px" }}
        >
          {/* Job Header */}
          <div className="job-card-top">
            <div className="company-icon-box large">
              <FiBriefcase size={24} />
            </div>

            <div className="job-header-info">
              <h3 className="job-title">
                {job?.jobTitle || "Senior Frontend Developer"}
              </h3>
              <p className="company-name">
                {job?.companyName || "Tech Solutions Inc."}
              </p>

              <div className="d-flex gap-3">
                <div className="meta-item">
                  <FiMapPin size={14} />
                  {job?.location || "Visakhapatnam"}
                </div>

                <div className="meta-item">
                  <FiDollarSign size={14} />
                  {job?.salaryRange_Min && job?.salaryRange_Max
                    ? `${job.salaryRange_Min} - ${job.salaryRange_Max} ${job?.salarType}`
                    : job?.salaryRange_Min
                      ? `${job.salaryRange_Min} ${job?.salarType}`
                      : ""}
                </div>

                <div className="meta-item text-orange">
                  <FiClock size={14} />
                  Posted on {formatPostedDate(job?.createdOn || job?.postedDate)}
                </div>
              </div>
            </div>
          </div>

          {/* Key Info Grid */}
          <div className="drawer-stats">
            <div className="drawer-stat-item">
              <span className="label">Employment Type</span>
              <span className="value">{job?.employeeType || "Full-time"}</span>
            </div>

            <div className="drawer-stat-item">
              <span className="label">Work Model</span>
              <span className="value">{job?.workModels || "On-site"}</span>
            </div>

            <div className="drawer-stat-item">
              <span className="label">Experience</span>
              <span className="value">
                {job?.yearsOfExperience || "NA"} years
              </span>
            </div>

            <div className="drawer-stat-item">
              <span className="label">Education</span>
              <span className="value">{job?.educationLevel || "Masters"}</span>
            </div>
          </div>

          {/* Job Description */}
          <div className="drawer-section">
            <h4>
              <FiFileText size={14} /> Job Description
            </h4>
            {job?.jobDescription ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: formatMarkdownToHtml(job.jobDescription),
                }}
              />
            ) : (
              <p style={{ color: "#64748b" }}>
                No description available for this job.
              </p>
            )}

          </div>

          {/* Skills */}
          <div className="drawer-section mt-3">
            <h4>
              <FiLayers size={14} /> Required Skills
            </h4>
            <div className="skills-cloud">
              {(
                job?.requiredSkills?.split(",") || [
                  "REACT",
                  "HTML",
                  "CSS",
                  "JAVASCRIPT",
                ]
              ).map((skill) => (
                <span key={skill.trim()} className="status-tag status-progress">
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>

          {/* Education & Experience */}
          {/* <div className="drawer-stats">
            <div className="drawer-stat-item">
              <span className="label">Education</span>
              <span className="value">{job?.educationLevel || "Masters"}</span>
            </div>

            <div className="drawer-stat-item">
              <span className="label">Years of Experience</span>
              <span className="value">
                {job?.yearsofExperience || "5"} years
              </span>
            </div>
          </div> */}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="dashboard-column-side card-base filters-sidebar">
          <ShareJobCard />
          <WorkAndPreference job={job} />
        </div>
      </div>
    </div>
  );
};

export default JobOverview;
