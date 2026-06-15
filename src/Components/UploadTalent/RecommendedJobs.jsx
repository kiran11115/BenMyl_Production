import React, { useEffect, useMemo, useState } from "react";
import { FiMapPin, FiClock, FiArrowRight, FiLoader, FiDollarSign, FiBriefcase, FiPlus, FiEye } from "react-icons/fi";
import { BsBuilding } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useGetRecommendJobsListMutation } from "../../State-Management/Api/TalentPoolApiSlice";
import NoData from "./NoData";
import JobModal from "../UserJobs/JobModal";
import { toast } from "react-toastify";

const RecommendedJobs = ({ role, skills, employeeId, isShortlisted }) => {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState(null);
  const [allJobs, setAllJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0].toUpperCase())
      .join("");
  };

  const [getRecommendedJobs] = useGetRecommendJobsListMutation();

  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      // If role or skills are missing, we might still want to try fetching or just show empty
      // But typically we need at least one of them for a good recommendation
      if (!role && (!skills || skills.length === 0)) {
        setAllJobs([]);
        return;
      }
      
      try {
        setIsLoading(true);
        const payload = {
  role: role === "N/A" ? "" : role,
  skills:
    typeof skills === "string"
      ? skills.split(",").map((s) => s.trim())
      : skills || [],
};
        const res = await getRecommendedJobs(payload).unwrap();
        setAllJobs(Array.isArray(res) ? res : []);
      } catch (error) {
        console.error("Error fetching recommended jobs:", error);
        setAllJobs([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecommendedJobs();
  }, [role, skills, getRecommendedJobs]);

  const handleAddTalentClick = (job) => {
    if (isShortlisted) {
  toast.warning("This candidate is already shortlisted");
  return;
}
    setSelectedJob(job);
  };

  const handleViewMoreJobs = () => {
    const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
    const targetPath = window.location.pathname.toLowerCase().startsWith('/admin') ? `${basePath}/admin-jobs` : `${basePath}/user-jobs`;
    navigate(targetPath, { state: { role: role } });
  };

  const mappedJobs = useMemo(() => {
    return allJobs.map((job) => ({
      id: job.jobID || job.id,
      userId: job.userId || job.jobUserId || job.jobuserid,
      title: job.jobTitle || job.title,
      company: job.companyName || job.company,
      location: job.location || "N/A",
      type: job.employeeType || job.type || "N/A",
      workModel: job.workModels || job.workModel || "",
      department: job.department || "",
      jobDuration: job.jobDuration || "",
      rateText:
        job.salaryRange_Min && job.salaryRange_Max
          ? `$${job.salaryRange_Min}-${job.salaryRange_Max}`
          : job.salaryRange_Min
            ? `$${job.salaryRange_Min}`
            : job.rateText || "N/A",
      experienceText: job.experienceLevel || job.experienceText || "N/A",
      yearsOfExperience: job.yearsOfExperience || "",
      description: job.jobDescription || job.description || "",
      additionalRequirements: job.additionalRequirements || "",
      salaryType: (() => {
        const t = (job.salarType || job.salaryType || "").toLowerCase();
        if (t.includes("hour") || t.includes("/hr") || t === "hourly") return "/hr";
        if (t.includes("month")) return "/month";
        if (t.includes("budget") || t.includes("fixed") || t.includes("entire")) return "Budget";
        return "";
      })(),
      educationLevel: job.educationLevel || "",
      skills: job.requiredSkills
        ? job.requiredSkills.split(",").map((s) => s.trim())
        : Array.isArray(job.skills) ? job.skills : [],
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

  const firstThreeJobs = useMemo(() => mappedJobs.slice(0, 3), [mappedJobs]);

  if (isLoading) {
    return (
      <div className="posted-jobs-loader" style={{ minHeight: '30vh', width: '100%' }}>
        <div className="jobs-loader-ring">
          <div className="jobs-loader-icon">
            <FiBriefcase size={18} />
          </div>
        </div>
        <p className="jobs-loader-text">Loading recommended jobs...</p>
        <span className="jobs-loader-sub">Finding the best opportunities</span>
      </div>
    );
  }

  if (firstThreeJobs.length === 0) {
    return (
      <div className="w-100">
        <NoData text="No matching jobs found at the moment" />
      </div>
    );
  }

  return (
    <div style={{ padding: "0" }}>
      <div className="tp-scrollable-area grid-view" style={{ 
        padding: 0,
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1.5rem'
      }}>
        {firstThreeJobs.map((job) => (
          <div
            key={job.id}
            onClick={() => setSelectedJob(job)}
            className="job-card d-flex flex-column"
            style={{ cursor: "pointer" }}
          >
            {/* TOP */}
            <div className="job-card-header">
              <div className="job-header-left">
                <div className="job-company-logo">
                  {getInitials(job.company)}
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
              {job.experienceText && job.experienceText !== "N/A" && (
                <span className="job-chip purple">
                  {job.experienceText}
                </span>
              )}
              {job.workModel && job.workModel !== "N/A" && (
                <span className="job-chip green">
                  {job.workModel}
                </span>
              )}
              {job.type && job.type !== "N/A" && (
                <span className="job-chip mint">
                  {job.type.length > 15 ? `${job.type.slice(0, 15)}...` : job.type}
                </span>
              )}
            </div>

            {/* DESC */}
            <p className="job-description">
              {job.description ? job.description.replace(/\*\*/g, "") : "No description provided."}
            </p>

            {/* FOOTER */}
            <div className="job-card-footer mt-auto pt-3">
              <div className="job-rate">
                {job.rateText}
                <span className="job-rate-unit">
                  {job.salaryType ? ` ${job.salaryType}` : ""}
                </span>
              </div>

              <div className="meta-pill">
                <FiMapPin size={12} />
                <span
                  title={job.location}
                  style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}
                >
                  {job.location ? job.location.split(',')[0].trim() : "N/A"}
                </span>
              </div>
            </div>
          </div>
        ))}

        {allJobs.length > 3 && (
          <div 
            className="job-card d-flex flex-column align-items-center justify-content-center text-center" 
            style={{ cursor: 'pointer', border: '2px dashed #cbd5e1', background: '#f8fafc', boxShadow: 'none' }} 
            onClick={handleViewMoreJobs}
          >
            <div className="mx-auto" style={{ background: '#f5f3ff', color: '#7c3aed', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <FiArrowRight size={28} />
            </div>
            <h3 className="job-title mb-2">View All Opportunities</h3>
            <p className="company-name mb-4">Discover more jobs matching your expertise</p>
            <div className="mt-auto w-100 pt-3">
              <button 
                className="btn-secondary w-100" 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  handleViewMoreJobs(); 
                }} 
                style={{ borderRadius: '8px', padding: '8px 0' }}
              >
                Explore More Jobs
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedJob && (
        <JobModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          initialSelectedTalentId={employeeId ? Number(employeeId) : undefined}
        />
      )}
    </div>
  );
};

export default RecommendedJobs;
