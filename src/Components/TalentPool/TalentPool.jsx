import React, { useState, useMemo, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import {
  FiGrid,
  FiList,
  FiBriefcase,
  FiX,
  FiTrash2,
  FiLoader,
  FiCheck,
  FiCheckCircle,
  FiChevronDown,
  FiFilter,
} from "react-icons/fi";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { GiCheckMark } from "react-icons/gi";

import TalentGridView from "./TalentGrid";
import TalentTableView from "./TalentTable";
import "./TalentPool.css";
import "../UserJobs/Jobs.css";
import TalentFilters from "../Filters/TalentFilters";
import JobOverviewCard from "./JobOverviewCard";
import FilterBottomSheet from "../Common/FilterBottomSheet";
import { useGetGroupedJobTitlesQuery, useLazyGetJobByIdQuery, useSendInviteNotificationMutation, useTalentPoolMutation } from "../../State-Management/Api/TalentPoolApiSlice";
import NoData from "../UploadTalent/NoData";
import { calculateTotalExperience } from "../../Utils/experienceUtils";
import { usePermissions } from "../Admin/Modules/RoleConfiguration/usePermissions";

// --- UTILS ---
const parseExperience = (expStr) => {
  const match = expStr.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

// --- SHORTLIST DRAWER (unchanged) ---
const ShortlistDrawer = ({ isOpen, onClose, shortlistedMap, onRemove, jobs, userId, refreshTalents, clearShortlistForJob, onInviteSuccess }) => {
  const [offerStatus, setOfferStatus] = useState({});
  const [sendInviteNotification] = useSendInviteNotificationMutation();

  const companyname = localStorage.getItem("CompanyName");
  const username = localStorage.getItem("UserName");

  const { hasPermission } = usePermissions();
  const canEdit = hasPermission("Talent Pool", "edit");

  const handleSendInvite = async (jobId) => {
    setOfferStatus((prev) => ({ ...prev, [jobId]: "loading" }));

    try {
      const shortlistedCandidates = shortlistedMap[jobId] || [];
      if (!shortlistedCandidates.length) return;

      const userIds = shortlistedCandidates.map(
        (c) => Number(c.inviteUserId)
      );

      const usernames = shortlistedCandidates.map((c) => c.name);
      const employeeIds = shortlistedCandidates.map((c) => c.id);

      const payload = {
        userIds,
        usernames,
        employeeIds,
        message: "Your talent has been shortlisted. Please check your mailbox.",
        uatUserId: Number(userId),
        uatfirstName: username,
        companyName: companyname
      };

      await sendInviteNotification(payload).unwrap();

      setOfferStatus((prev) => ({ ...prev, [jobId]: "sent" }));
      clearShortlistForJob(jobId);
      await refreshTalents();
      onClose();
      if (onInviteSuccess) onInviteSuccess(jobId);
    } catch (err) {
      console.error("Invite failed", err);
      setOfferStatus((prev) => ({ ...prev, [jobId]: "idle" }));
      toast.error("Failed to send invite");
    }
  };

  const hasAnyShortlistedCandidates = Object.values(shortlistedMap).some(
    (list) => Array.isArray(list) && list.length > 0
  );


  return (
    <>
      <div
        className={`drawer-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
      />
      <div className={`drawer-panel ${isOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <h3>Shortlisted Candidates</h3>
          <button className="close-btn" onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        <div className="drawer-content">
          {!hasAnyShortlistedCandidates ? (
            <div className="empty-state">No candidates shortlisted yet.</div>
          ) : (
            Object.keys(shortlistedMap).map((jobId) => {
              const job = jobs.find((j) => j.id === jobId);
              const candidates = shortlistedMap[jobId];
              if (!candidates || candidates.length === 0) return null;

              const currentStatus = offerStatus[jobId] || "idle";

              return (
                <div key={jobId} className="job-group">
                  <div
                    className="job-header"
                    style={{ borderLeft: `4px solid ${job?.color}` }}
                  >
                    <span className="job-title">{job?.title}</span>
                    <span className="badge">{candidates.length}</span>
                  </div>

                  {candidates.map((cand) => (
                    <div key={cand.id} className="mini-card">
                      <img src={cand.avatar} className="mini-avatar" alt="" />
                      <div className="mini-info">
                        <div className="mini-name">{cand.name}</div>
                        <div className="mini-role">{cand.role}</div>
                      </div>
                      <button
                        className="remove-btn"
                        disabled={currentStatus !== "idle"}
                        onClick={() => onRemove(jobId, cand.id)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}

                  <div className="job-footer">
                    {canEdit ? (
                      <button
                        className={`btn-primary border-0 ${currentStatus === "sent" ? "sent" : ""}`}
                        onClick={() => handleSendInvite(jobId)}
                        disabled={currentStatus !== "idle"}
                      >
                        {currentStatus === "loading" && (
                          <>
                            <FiLoader className="spin-icon" /> Sending...
                          </>
                        )}
                        {currentStatus === "sent" && (
                          <>
                            <FiCheck /> Invite Sent
                          </>
                        )}
                        {currentStatus === "idle" && "Send Invite"}
                      </button>
                    ) : (
                      <div className="permission-denied-text" style={{ fontSize: '12px', color: '#ef4444', fontStyle: 'italic' }}>
                        You don't have permission to send invites.
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <style jsx>{`
        .drawer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 998;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s;
        }
        .drawer-overlay.open {
          opacity: 1;
          pointer-events: auto;
        }
        .drawer-panel {
          position: fixed;
          top: 75px;
          right: 5px;
          width: 350px;
          height: 90vh;
          border-radius: 12px;
          background: white;
          z-index: 999;
          transform: translateX(100%);
          transition: transform 0.3s;
          box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
        }
        .drawer-panel.open {
          transform: translateX(0);
        }
        .drawer-header {
          padding: 20px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .drawer-header h3 {
          margin: 0;
          font-size: 18px;
        }
        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
        }
        .drawer-content {
          padding: 20px;
          flex: 1;
          overflow-y: auto;
        }
        .job-group {
          margin-bottom: 24px;
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 16px;
        }
        .job-header {
          background: #f8fafc;
          padding: 8px 12px;
          margin-bottom: 10px;
          font-weight: 600;
          font-size: 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .mini-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 0;
          border-bottom: 1px solid #f1f5f9;
        }
        .mini-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
        }
        .mini-info {
          flex: 1;
        }
        .mini-name {
          font-size: 13px;
          font-weight: 600;
        }
        .mini-role {
          font-size: 12px;
          color: #64748b;
        }
        .remove-btn {
          background: none;
          border: none;
          color: #ef4444;
          cursor: pointer;
          opacity: 0.6;
          transition: opacity 0.2s;
        }
        .remove-btn:hover:not(:disabled) {
          opacity: 1;
        }
        .remove-btn:disabled {
          opacity: 0.2;
          cursor: not-allowed;
        }
        .empty-state {
          color: #94a3b8;
          text-align: center;
          margin-top: 40px;
          font-size: 14px;
        }
        .job-footer {
          margin-top: 12px;
          display: flex;
          justify-content: flex-end;
        }
        .btn-primary.sent {
          background-color: #10b981;
        }
        .spin-icon {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
};

// --- JOB DETAILS DRAWER ---
const JobDetailsDrawer = ({ isOpen, onClose, allJobOverviewData }) => {
  return (
    <>
      <div
        className={`drawer-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
      />
      <div className={`drawer-panel-right ${isOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <h3>Job Details Overview</h3>
          <button className="close-btn" onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        <div className="drawer-content">
          {allJobOverviewData.length === 0 ? (
            <div className="empty-state">No jobs selected to view details.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 16 }}>
              {allJobOverviewData.map((jobData) => (
                <JobOverviewCard
                  key={jobData.id}
                  job={jobData}
                  isExpanded={true}
                  onToggle={() => { }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .drawer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 998;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s;
        }
        .drawer-overlay.open {
          opacity: 1;
          pointer-events: auto;
        }
        .drawer-panel-right {
          position: fixed;
          top: 75px;
          right: 5px;
          width: 480px;
          height: 90vh;
          border-radius: 12px;
          background: white;
          z-index: 999;
          transform: translateX(110%);
          transition: transform 0.3s;
          box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
        }
        .drawer-panel-right.open {
          transform: translateX(0);
        }
        .drawer-header {
          padding: 20px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .drawer-header h3 {
          margin: 0;
          font-size: 18px;
        }
        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
        }
        .drawer-content {
          padding: 20px;
          flex: 1;
          overflow-y: auto;
        }
        .empty-state {
          color: #94a3b8;
          text-align: center;
          margin-top: 40px;
          font-size: 14px;
        }
      `}</style>
    </>
  );
};

// --- MAIN COMPONENT ---
const TalentPool = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const preselectedJobTitle = location.state?.jobTitle;
  const userId = localStorage.getItem("CompanyId");
  const companyId = localStorage.getItem("logincompanyid");
  const [viewMode, setViewMode] = useState("grid");
  const resultsRef = useRef(null);
  const [shortlistedMap, setShortlistedMap] = useState(() => {
    try {
      const stored = localStorage.getItem("shortlistedMap");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isJobDetailsDrawerOpen, setIsJobDetailsDrawerOpen] = useState(false);
  const [successJobId, setSuccessJobId] = useState(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("name_asc");
  const [selectedJobId, setSelectedJobId] = useState(null);

  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [allCandidates, setAllCandidates] = useState([]);
  const [isInitialised, setIsInitialised] = useState(false);
  const [allSelectedJobDetails, setAllSelectedJobDetails] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);


  const activeJobId = selectedJobId;

  const { data: jobTitles = [] } = useGetGroupedJobTitlesQuery(userId);
  const [getJobById, { data: jobDetails }] = useLazyGetJobByIdQuery();
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  const [getFindTalent, { data, isLoading }] =
    useTalentPoolMutation();

  const PAGE_SIZE = 50;

  const fetchTalents = async () => {

    try {
      if (pageNumber === 1) {
        setIsInitialLoading(true);   // first load
      } else {
        setIsFetchingMore(true);     // scroll load
      }

      const filtersArray = [];

      if (appliedFilters) {

        // Title
        if (appliedFilters.selectedJobs?.length) {
          const selectedTitles = appliedFilters.selectedJobs
            .map((jobId) => jobs.find((j) => j.id === jobId)?.title)
            .filter(Boolean);

          if (selectedTitles.length > 0) {
            filtersArray.push({
              filterName: "Title",
              filterOperator: "Equals",
              filterValue: selectedTitles,
            });
          }
        }

        // Skills
        if (appliedFilters.skills?.length) {
          filtersArray.push({
            filterName: "skills",
            filterOperator: "Equals",
            filterValue: appliedFilters.skills,
          });
        }

        // Location
        if (appliedFilters.location) {
          filtersArray.push({
            filterName: "Location",
            filterOperator: "Equals",
            filterValue: [appliedFilters.location],
          });
        }

        // Salary Range
        if (appliedFilters.minSalary && appliedFilters.maxSalary) {
          filtersArray.push({
            filterName: "Salary Range",
            filterOperator: "Equals",
            filterValue: [
              `${appliedFilters.minSalary} - ${appliedFilters.maxSalary}`
            ],
          });
        }

        // Years of Experience
        if (appliedFilters.minExperience && appliedFilters.maxExperience) {
          filtersArray.push({
            filterName: "Years of Experience",
            filterOperator: "Equals",
            filterValue: [
              `${appliedFilters.minExperience}- ${appliedFilters.maxExperience}`
            ],
          });
        }

        // Employment Type
        if (appliedFilters.availability?.length) {
          filtersArray.push({
            filterName: "Employment Type",
            filterOperator: "Equals",
            filterValue: appliedFilters.availability,
          });
        }
      }

      const payload = {
        companyid: Number(companyId),
        pageNumber,
        pageSize: PAGE_SIZE,
        filters: filtersArray,
      };

      const res = await getFindTalent(payload).unwrap();

      // 🔥 API returns array directly
      if (!Array.isArray(res) || res.length === 0) {
        setHasMore(false);
        return;
      }

      if (res.length < PAGE_SIZE) {
        setHasMore(false);   // no more pages
      }

      setAllCandidates((prev) =>
        pageNumber === 1 ? res : [...prev, ...res]
      );

    } finally {
      setIsInitialLoading(false);
      setIsFetchingMore(false);
    }
  };


  const candidates = useMemo(() => {
    return allCandidates.map((item) => ({
      id: item.employeeID,

      name: `${item.firstName} ${item.lastName}`,
      inviteUserId: Number(item.insertBy),

      role: item.title || "-",

      experience: `${calculateTotalExperience(item.workexperiences) || 0}`,

      location: item.city || "-",

      skills: item.skills
        ? item.skills.split(",").map((s) => s.trim())
        : [],

      avatar:
        item.profilePicture ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          item.firstName
        )}`,

      rating: 4.5,

      availability: item.status ? [item.status] : ["Available"],

      verified: true,
      status: item.status?.toUpperCase() || "AVAILABLE",
      isshortlisted: item.isshortlisted,
      uploadedByName: item.uploadedByName,
      hourlyRate: item.salary || 0,
    }));
  }, [allCandidates]);

  const jobs = useMemo(() => {
    if (!Array.isArray(jobTitles)) return [];

    const colorPalette = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

    return jobTitles.map((job, index) => ({
      id: `job-${job.jobID}`,      // 🔥 unique per job
      jobID: job.jobID,            // backend id
      title: job.jobTitle,
      companyName: job.companyName,
      color: colorPalette[index % colorPalette.length],
    }));
  }, [jobTitles]);

  const allSkills = useMemo(() => {
    if (!Array.isArray(jobTitles)) return [];

    const skillSet = new Set();

    jobTitles.forEach((job) => {
      if (job.requiredSkills) {
        job.requiredSkills.split(",").forEach((skill) => {
          const clean = skill.trim().toLowerCase();
          if (clean) {
            skillSet.add(clean);
          }
        });
      }
    });

    return Array.from(skillSet).map(
      (skill) => skill.charAt(0).toUpperCase() + skill.slice(1)
    );
  }, [jobTitles]);


  useEffect(() => {
    if (!preselectedJobTitle || jobs.length === 0) return;

    const matchedJob = jobs.find(
      (j) => j.title.toLowerCase() === preselectedJobTitle.toLowerCase()
    );

    if (!matchedJob) return;

    const filters = {
      selectedJobs: [matchedJob.id],
      skills: [],
      location: "",
      minExperience: "",
      maxExperience: "",
      minSalary: "",
      maxSalary: "",
      availability: [],
    };

    setSelectedJobId(matchedJob.id);
    setAppliedFilters(filters);

    // 🔥 VERY IMPORTANT → sync to URL
    setSearchParams({ jobId: matchedJob.id });

  }, [preselectedJobTitle, jobs]);

  const filtersReady = useMemo(() => {
    const hasURLParams = searchParams.toString().length > 0;

    // If coming from "Find Talent" (with preselectedJobTitle in state),
    // wait until the job is matched and appliedFilters is set.
    if (preselectedJobTitle && appliedFilters === null) {
      return false;
    }

    // If URL has filters but appliedFilters not restored yet → wait
    if (hasURLParams && appliedFilters === null) {
      return false;
    }

    return true;
  }, [searchParams, appliedFilters, preselectedJobTitle]);

  useEffect(() => {
    if (selectedJobId !== null) {
      setIsInitialised(true);
    }
  }, [selectedJobId]);

  useEffect(() => {
    setPageNumber(1);
    setHasMore(true);
    setAllCandidates([]);
  }, [activeJobId]);

  useEffect(() => {
    if (!filtersReady) return;

    fetchTalents();
  }, [pageNumber, appliedFilters, activeJobId, filtersReady]);



  useEffect(() => {
    const el = resultsRef.current;
    if (!el) return;

    const onScroll = () => {
      if (
        el.scrollHeight > el.clientHeight &&
        el.scrollTop + el.clientHeight >= el.scrollHeight - 50 &&
        hasMore &&
        !isFetchingMore
      ) {
        setPageNumber((prev) => prev + 1);
      }
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [hasMore, isFetchingMore]);


  const activeJob = useMemo(() => {
    if (!selectedJobId) return null;
    return jobs.find((j) => j.id === selectedJobId) || null;
  }, [selectedJobId, jobs]);

  const activeJobColor = activeJob?.color || "#4f46e5";

  const allJobOverviewData = useMemo(() => {
    return allSelectedJobDetails.map((details) => ({
      id: details.jobID,
      title: details.jobTitle,
      company: details.companyName,
      location: details.location,
      budget:
        details.salaryRange_Min && details.salaryRange_Max
          ? `${details.salaryRange_Min} - ${details.salaryRange_Max}`
          : `${details.salaryRange_Min || ""}`,
      experience: details.yearsofExperience || details.experienceLevel,
      type: details.employeeType,
      salaryType: details.salarType,
      description: details.jobDescription,
      requiredSkills: details.requiredSkills
        ? details.requiredSkills.split(",").map((s) => s.trim())
        : [],
    }));
  }, [allSelectedJobDetails]);

  useEffect(() => {
    let isMounted = true;
    const selectedJobIds = appliedFilters?.selectedJobs || [];
    if (selectedJobIds.length === 0) {
      setAllSelectedJobDetails([]);
      return;
    }

    const fetchDetails = async () => {
      const detailsPromises = selectedJobIds.map((id) => {
        const job = jobs.find((j) => j.id === id);
        if (!job) return null;
        return getJobById({ jobId: job.jobID, userId }).unwrap();
      });

      const results = await Promise.all(detailsPromises);
      if (!isMounted) return;

      const validDetails = results
        .filter(Boolean)
        .map((res) => res?.[0])
        .filter(Boolean);
      setAllSelectedJobDetails(validDetails);
    };

    fetchDetails();
    return () => {
      isMounted = false;
    };
  }, [appliedFilters?.selectedJobs, jobs, userId]);


  const handleShortlist = (candidate) => {
    const matchingJob = jobs.find(
      (job) =>
        job.title?.toLowerCase().trim() ===
        candidate.role?.toLowerCase().trim()
    );

    if (!matchingJob) {
      setSelectedCandidate(candidate);
      setShowCreateJobModal(true);
      return;
    }
    if (!activeJobId) {
      toast.error("Please select a Job from the filters first to shortlist.");
      return;
    }

    setShortlistedMap((prev) => {
      const currentList = prev[activeJobId] || [];
      const exists = currentList.find((c) => c.id === candidate.id);

      if (exists) {
        return { ...prev, [activeJobId]: currentList.filter((c) => c.id !== candidate.id) };
      }
      return { ...prev, [activeJobId]: [...currentList, candidate] };
    });
  };

  const clearShortlistForJob = (jobId) => {
    setShortlistedMap((prev) => {
      const updated = { ...prev };
      delete updated[jobId];
      return updated;
    });
  };


  useEffect(() => {
    if (jobs.length === 0) return;

    const jobId = searchParams.get("jobId");
    const jobIdArray = jobId ? jobId.split(",") : [];
    const skills = searchParams.get("skills");
    const location = searchParams.get("location");
    const minExp = searchParams.get("minExp");
    const maxExp = searchParams.get("maxExp");
    const minSal = searchParams.get("minSal");
    const maxSal = searchParams.get("maxSal");
    const type = searchParams.get("type");

    if (!jobId && preselectedJobTitle) {
      return; // 🔥 do NOT override
    }

    const restoredFilters = {
      selectedJobs: jobIdArray,
      skills: skills ? skills.split(",") : [],
      location: location || "",
      minExperience: minExp || "",
      maxExperience: maxExp || "",
      minSalary: minSal || "",
      maxSalary: maxSal || "",
      availability: type ? type.split(",") : [],
    };

    setSelectedJobId(jobIdArray[0] || null);
    setAppliedFilters(restoredFilters);
    setIsInitialised(true);
  }, [jobs, searchParams, preselectedJobTitle]);



  const handleApplyFilter = (filters) => {
    setPageNumber(1);          // 🔥 RESET TO PAGE 1
    setHasMore(true);          // reset infinite scroll
    setAllCandidates([]);      // clear old data
    setAppliedFilters(filters);

    const params = {};

    if (filters?.selectedJobs?.length) {
      params.jobId = filters.selectedJobs.join(",");
    }

    if (filters?.skills?.length) {
      params.skills = filters.skills.join(",");
    }

    if (filters?.location) {
      params.location = filters.location;
    }

    if (filters?.minExperience) {
      params.minExp = filters.minExperience;
    }

    if (filters?.maxExperience) {
      params.maxExp = filters.maxExperience;
    }

    if (filters?.minSalary) {
      params.minSal = filters.minSalary;
    }

    if (filters?.maxSalary) {
      params.maxSal = filters.maxSalary;
    }

    if (filters?.availability?.length) {
      params.type = filters.availability.join(",");
    }

    setSearchParams(params);
  };

  useEffect(() => {
    setMinTimeElapsed(false);
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [appliedFilters, activeJobId]);


  const handleProfileClick = (candidate) => {
    const from = location.pathname + location.search;
    const basePath = location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';

    navigate(
      `${basePath}/user-talent-profile?from=${encodeURIComponent(from)}`,
      {
        state: {
          employeeID: candidate.id,
          candidate: candidate, // Pass whole object
          jobId: activeJobId, // 🔥 this is critical
        },
      }
    );
  };




  const handleRemoveFromDrawer = (jobId, candId) => {
    setShortlistedMap((prev) => ({
      ...prev,
      [jobId]: prev[jobId].filter((c) => c.id !== candId),
    }));
  };

  const sortedCandidates = useMemo(() => {
    const sortable = [...candidates];
    switch (sortBy) {
      case "rating_high":
        return sortable.sort((a, b) => b.rating - a.rating);
      case "exp_high":
        return sortable.sort((a, b) => parseExperience(b.experience) - parseExperience(a.experience));
      case "exp_low":
        return sortable.sort((a, b) => parseExperience(a.experience) - parseExperience(b.experience));
      case "rate_low":
        return sortable.sort((a, b) => (a.hourlyRate || 0) - (b.hourlyRate || 0));
      case "name_asc":
        return sortable.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sortable;
    }
  }, [candidates, sortBy]);

  useEffect(() => {
    localStorage.setItem(
      "shortlistedMap",
      JSON.stringify(shortlistedMap)
    );
  }, [shortlistedMap]);


  const [expandedCardId, setExpandedCardId] = useState(null);

  const toggleCard = (id) => {
    setExpandedCardId(prev => (prev === id ? null : id));
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
        >
          <TalentFilters onApplyFilters={handleApplyFilter} skillsList={allSkills} jobs={jobs} selectedJobId={selectedJobId} appliedFilters={appliedFilters} />
        </aside>
        <FilterBottomSheet
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
          title="Filters"
        >
          <TalentFilters
            onApplyFilters={(filters) => {
              handleApplyFilter(filters);
              setIsMobileFilterOpen(false);
            }}
            skillsList={allSkills}
            jobs={jobs}
            selectedJobId={selectedJobId}
            appliedFilters={appliedFilters}
          />
        </FilterBottomSheet>

        {/* RIGHT */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

          {/* Sticky header */}
          <div style={{ position: "sticky", top: 0, zIndex: 10 }}>

            <div className="hero-card mb-4">
              <div className="hero-left">
                <div className="hero-pill">
                  ✦ Find Talent
                </div>
                <h1 className="job-posting-title text-white">Talent Network Board</h1>


                <div className="job-posting-header-info">

                  <p className="job-posting-subtitle">
                    Search and manage your Talent network.
                  </p>
                </div>
              </div>

              <div style={{ position: "relative" }}>
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    flex: 1,
                    maxWidth: "700px",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >

                  <button
                    className="filters-applied"
                    onClick={() => setIsMobileFilterOpen(true)}
                  >
                    <FiFilter /> Filters
                  </button>

                  <button
                    className="routine-btn"
                    onClick={() => setIsJobDetailsDrawerOpen(true)}
                  >
                    <FiBriefcase />
                    <span>View Job Details</span>
                  </button>

                  <button
                    className="routine-btn"
                    onClick={() => setIsDrawerOpen(true)}

                  >
                    <FiBriefcase />
                    <span>View Shortlisted</span>
                  </button>

                  <div className="vs-results-right">
                    {/* VIEW TOGGLE */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        background: "#f4f8ff",
                        border: "1px solid #d9e6ff",
                        borderRadius: "10px",
                        padding: "3px",
                        gap: "2px",
                        height: "40px",
                      }}
                    >
                      <button
                        onClick={() => setViewMode("grid")}
                        style={{
                          width: "28px",
                          height: "28px",
                          border: "none",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          background:
                            viewMode === "grid"
                              ? "#3b82f6"
                              : "transparent",
                          color:
                            viewMode === "grid"
                              ? "#ffffff"
                              : "#64748b",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <FiGrid size={14} />
                      </button>

                      <button
                        onClick={() => setViewMode("table")}
                        style={{
                          width: "28px",
                          height: "28px",
                          border: "none",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          background:
                            viewMode === "table"
                              ? "#3b82f6"
                              : "transparent",
                          color:
                            viewMode === "table"
                              ? "#ffffff"
                              : "#64748b",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <FiList size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>



            {/* Layout */}
            <div
              ref={resultsRef}
              style={{
                height: "calc(100vh - 140px)",
                overflowY: "auto",
                paddingRight: "4px",
              }}
            >
              {(isLoading || !minTimeElapsed) && allCandidates.length === 0 ? (
                <div className="jobs-screen-loader">
                  <div className="jobs-loader-ring">
                    <div className="jobs-loader-icon">
                      <FiBriefcase size={18} />
                    </div>
                  </div>
                  <p className="jobs-loader-text">Searching for candidates...</p>
                  <span className="jobs-loader-sub">Matching candidates based on your filters</span>
                </div>
              ) : (
                <>
                  {!isLoading && sortedCandidates.length === 0 ? (
                    <div
                      style={{
                        minHeight: "320px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <NoData text="No Matching Profiles found" />
                    </div>
                  ) : viewMode === "grid" ? (
                    <TalentGridView
                      candidates={sortedCandidates}
                      onShortlist={handleShortlist}
                      activeJobId={activeJobId}
                      activeJobColor={activeJobColor}
                      shortlistedMap={shortlistedMap}
                      onProfileClick={handleProfileClick}
                      hasMore={hasMore}
                    />
                  ) : (
                    <TalentTableView
                      candidates={sortedCandidates}
                      onShortlist={handleShortlist}
                      activeJobId={activeJobId}
                      activeJobColor={activeJobColor}
                      shortlistedMap={shortlistedMap}
                      onProfileClick={handleProfileClick}
                      hasMore={hasMore}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {isDrawerOpen ? (
          <ShortlistDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            shortlistedMap={shortlistedMap}
            onRemove={handleRemoveFromDrawer}
            jobs={jobs}
            userId={userId}
            refreshTalents={fetchTalents}
            clearShortlistForJob={clearShortlistForJob}
            onInviteSuccess={(jobId) => setSuccessJobId(jobId)}
          />
        ) : null}

        {isJobDetailsDrawerOpen ? (
          <JobDetailsDrawer
            isOpen={isJobDetailsDrawerOpen}
            onClose={() => setIsJobDetailsDrawerOpen(false)}
            allJobOverviewData={allJobOverviewData}
          />
        ) : null}

        {showCreateJobModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(15,23,42,0.55)",
              backdropFilter: "blur(4px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
            }}
          >
            <div
              style={{
                width: "420px",
                background: "#fff",
                borderRadius: "20px",
                padding: "28px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.15) !important",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "#5a5de8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <FiBriefcase size={28} color="#ffffffff" />
              </div>

              <h3
                style={{
                  textAlign: "center",
                  fontWeight: 700,
                  marginBottom: "10px",
                  color: "#0f172a",
                }}
              >
                Job Not Found
              </h3>

              <p
                style={{
                  textAlign: "center",
                  color: "#64748b",
                  marginBottom: "24px",
                  lineHeight: "1.6",
                }}
              >
                <strong>{selectedCandidate?.role}</strong> job role is not available.
                <br />
                Would you like to create a new job posting?
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                }}
              >
                <button
                  onClick={() => {
                    setShowCreateJobModal(false);
                    setSelectedCandidate(null);
                  }}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                    background: "#fff",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    navigate("/Admin/user-post-new-positions", {
                      state: {
                        autoFillRole: selectedCandidate?.role,
                      },
                    });

                    setShowCreateJobModal(false);
                  }}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "10px",
                    border: "none",
                    background: "#5a5de8",
                    color: "#fff",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Create Job
                </button>
              </div>
            </div>
          </div>
        )}

        {successJobId && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2100 }} onClick={() => { }}>
            <div style={{ background: 'white', width: '90%', maxWidth: '440px', borderRadius: '24px', padding: '40px', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', animation: 'modalFadeIn 0.3s ease-out' }} onClick={e => e.stopPropagation()}>
              <div style={{ marginBottom: '24px' }}>
                <FiCheckCircle size={60} color="#059669" />
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1e293b', marginBottom: '24px' }}>Invite Sent Successfully!</h2>

              <div style={{ background: '#eff6ff', borderLeft: '4px solid #3b82f6', padding: '12px 16px', borderRadius: '8px', marginBottom: '32px', textAlign: 'left' }}>
                <p style={{ margin: 0, fontSize: '13px', color: '#1e40af', lineHeight: 1.5 }}>
                  <strong>Note:</strong> Selected candidates have been notified successfully. You can now proceed to schedule an interview with them.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button
                  style={{ width: '100%', padding: '14px', background: '#f5810c', color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
                  onClick={() => {
                    const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
                    const targetPath = window.location.pathname.toLowerCase().startsWith('/admin') ? `${basePath}/user-schedule-interview` : `${basePath}/user-schedule-interview`;
                    navigate(targetPath, { state: { preSelectedJobId: successJobId } });
                  }}
                >
                  Schedule Interview
                </button>
                <button
                  style={{ width: '100%', padding: '14px', background: '#f8fafc', color: '#1e293b', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
                  onClick={() => setSuccessJobId(null)}
                >
                  Continue to Talentpool
                </button>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
        .sort-wrapper {
          position: relative;
          margin-right: 8px;
        }
        .sort-select {
          appearance: none;
          background-color: white;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 8px 32px 8px 12px;
          font-size: 13px;
          color: #334155;
          font-weight: 500;
          cursor: pointer;
          outline: none;
          min-width: 180px;
        }
        .sort-select:hover {
          border-color: #cbd5e1;
        }
        .sort-icon {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          pointer-events: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}

/* Firefox */
.hide-scrollbar {
  scrollbar-width: none;
}

/* IE / old Edge */
.hide-scrollbar {
  -ms-overflow-style: none;
}
      `}</style>
      </div>
    </div>
  );
};

export default TalentPool;
