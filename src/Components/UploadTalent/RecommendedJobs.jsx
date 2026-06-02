import React, { useEffect, useMemo, useState } from "react";
import { FiMapPin, FiClock, FiArrowRight, FiLoader, FiDollarSign, FiBriefcase, FiPlus } from "react-icons/fi";
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
          skills: skills || [] 
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
      <div className="d-flex justify-content-center p-5 w-100">
        <FiLoader className="loading-spinner" />
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
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '1.5rem'
      }}>
        {firstThreeJobs.map((job) => (
          <div key={job.id} className="candidate-card">
            <div className="d-flex flex-column gap-3">
              {/* Header: Company Avatar + Title */}
              <div className="card-header">
                <div className="avatar-initials-premium">
                    {getInitials(job.company)}
                </div>
                <div className="header-info flex-column gap-0 align-items-start">
                  <div className="name-row w-100">
                    <h4 className="name" title={job.title}>{job.title}</h4>
                  </div>
                  <div className="role" style={{ color: '#5b5bd6', fontWeight: '600' }}>
                    {job.company}
                  </div>
                  {/* Department badge */}
                  {job.department && (
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--slate-500)',
                      background: 'var(--slate-100)',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      marginTop: '4px',
                      display: 'inline-block',
                    }}>
                      {job.department}
                    </span>
                  )}
                </div>
              </div>

              {/* Meta Info: Salary, Exp Level, Location, Work Model */}
              <div className="meta-info">
                <div className="meta-item">
                  <FiDollarSign size={14} />
                  <span>{job.rateText}{job.salaryType ? ` ${job.salaryType}` : ''}</span>
                </div>
                <div className="meta-item">
                  <FiBriefcase size={14} />
                  <span>{job.experienceText}{job.yearsOfExperience ? ` · ${job.yearsOfExperience}yr` : ''}</span>
                </div>
                <div className="meta-item">
                  <FiMapPin size={14} />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{job.location}</span>
                </div>
                <div className="meta-item">
                  <FiClock size={14} />
                  <span>{job.workModel || job.type}</span>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="tags-section">
                <div className="tags-group">
                  {job.skills?.slice(0, 3).map((skill) => (
                    <span key={skill} className="tag-pill skill">
                      {skill}
                    </span>
                  ))}
                  {job.skills?.length > 3 && (
                    <span className="tag-pill skill" style={{ color: 'var(--slate-400)' }}>
                      +{job.skills.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-auto">
              <button
                className="btn-primary w-100"
                onClick={() => handleAddTalentClick(job)}
              >
                <FiPlus size={16} /> Add Talent
              </button>
            </div>
          </div>
        ))}

        {allJobs.length > 3 && (
          <div className="tp-item-card" style={{ borderStyle: 'dashed', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '280px' }}>
            <div className="tp-card-body text-center">
              <div className="tp-timeline-icon mx-auto mb-3" style={{ background: '#f5f3ff', color: '#7c3aed', width: '56px', height: '56px' }}>
                 <FiArrowRight size={28} />
              </div>
              <h4 className="mb-2" style={{ fontWeight: '700' }}>View All Opportunities</h4>
              <p className="text-muted small mb-4">Discover more jobs matching your expertise</p>
              <button className="btn-secondary w-100" onClick={handleViewMoreJobs} style={{ borderRadius: '10px', padding: '10px' }}>
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
