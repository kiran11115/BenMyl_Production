import React, { useEffect, useMemo, useState } from "react";
import { FiMapPin, FiClock, FiArrowRight, FiLoader, FiDollarSign, FiBriefcase, FiPlus, FiEye } from "react-icons/fi";
import { BsBuilding } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useGetRecommendJobsListMutation } from "../../State-Management/Api/TalentPoolApiSlice";
import NoData from "./NoData";
import JobModal from "../UserJobs/JobModal";
import { toast } from "react-toastify";

const getCountryCodeFromLocation = (location = "") => {
  if (!location) return "";
  const loc = location.toLowerCase();
  if (loc.includes("united states") || loc.includes("usa") || loc.includes("us")) return "us";
  if (loc.includes("united kingdom") || loc.includes("uk")) return "gb";
  if (loc.includes("india")) return "in";
  if (loc.includes("canada")) return "ca";
  if (loc.includes("australia")) return "au";
  if (loc.includes("germany")) return "de";
  return "un";
};

const RecommendedJobs = ({ role, skills, employeeId, isShortlisted, candidate }) => {
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
    const loggedInUserId = Number(localStorage.getItem("CompanyId"));
    return allJobs.filter((job) => Number(job.userId) !== loggedInUserId).map((job) => ({
      id: job.jobID || job.id,
      userId: job.userId || job.jobUserId || job.jobuserid,
      title: job.jobTitle || job.title,
      company: job.companyName || job.company,
      location: job.location || "N/A",
      type: job.employeeType || job.type || "N/A",
      workModel: job.workModels || job.workModel || "",
      department: job.department || "",
      jobDuration: job.jobDuration
        ? String(job.jobDuration).toLowerCase().match(/month|year|yr|mo/i)
          ? job.jobDuration
          : `${job.jobDuration} Months`
        : "",
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
      <div style={{ 
        width: '100%', 
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
        {firstThreeJobs.map((job) => (
          <div
            key={job.id}
            onClick={() => {
              if (isShortlisted) {
                toast.warning("Candidate is already shortlisted");
                return;
              }
              setSelectedJob(job);
            }}
            className="job-card"
          >
            {/* TOP */}
            <div className="job-card-header">
              <div className="job-header-left">
                <div className="job-company-logo">
                  <FiBriefcase color="#ffffff" size={20} />
                </div>

                <div className="job-header-info">
                  <h3 className="job-title" title={job.title}>{job.title}</h3>
                  <div className="job-meta-row">
                    {job.jobDuration && (
                      <div className="job-meta-item">
                        <FiClock size={12} className="meta-icon" />
                        <span>{job.jobDuration}</span>
                      </div>
                    )}
                    {job.location && (
                      <div className="job-meta-item">
                        <FiMapPin size={12} className="meta-icon" />
                        <span title={job.location}>
                          {getCountryCodeFromLocation(job.location) && getCountryCodeFromLocation(job.location) !== "un" && (
                            <img 
                              src={`https://flagcdn.com/w20/${getCountryCodeFromLocation(job.location)}.png`}
                              srcSet={`https://flagcdn.com/w40/${getCountryCodeFromLocation(job.location)}.png 2x`}
                              width="18"
                              alt="Flag"
                              style={{ marginRight: '5px', verticalAlign: 'middle', borderRadius: '2px', display: 'inline-block' }}
                            />
                          )}
                          {job.location ? job.location.split(',')[0].trim() : ""}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {job.isShortlisted && (
                <div className="job-chip mint">
                  SHORTLISTED
                </div>
              )}
            </div>

            {/* DESC */}
            <p className="job-description">
              {[
                job.company && `${job.company}`,
                job.preferredEmployment?.length > 0 && `Employment Type: ${job.preferredEmployment.join(", ")}`,
                job.workModel && `${job.workModel}`,
                job.description?.replace(/\*\*/g, "")
              ].filter(Boolean).join(" | ")}
            </p>

            {/* FOOTER */}
            <div className="job-card-footer">
              <div className="job-rate-block">
                <div className="job-rate">
                  {job.rateText}
                  <span className="job-rate-unit">
                    {job.salaryType}
                  </span>
                </div>
                {job.postedOnText && job.postedOnText !== "N/A" && (
                  <>
                    <span className="job-rate-divider">•</span>
                    <span className="job-posted-on">
                      Posted {job.postedOnText}
                    </span>
                  </>
                )}
              </div>

              <button
                className="job-card-view-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  if (isShortlisted) {
                    toast.warning("Candidate is already shortlisted");
                    return;
                  }
                  setSelectedJob(job);
                }}
              >
                View
              </button>
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
          initialCandidate={candidate}
        />
      )}
    </div>
  );
};

export default RecommendedJobs;
