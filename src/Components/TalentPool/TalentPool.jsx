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
  FiChevronDown,
  FiFilter,
} from "react-icons/fi";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { GiCheckMark } from "react-icons/gi";

import TalentGridView from "./TalentGrid";
import TalentTableView from "./TalentTable";
import "./TalentPool.css";
import TalentFilters from "../Filters/TalentFilters";
import JobOverviewCard from "./JobOverviewCard";
import FilterBottomSheet from "../Common/FilterBottomSheet";
import { useGetGroupedJobTitlesQuery, useLazyGetJobByIdQuery, useSendInviteNotificationMutation, useTalentPoolMutation } from "../../State-Management/Api/TalentPoolApiSlice";
import NoData from "../UploadTalent/NoData";
import { calculateTotalExperience } from "../../Utils/experienceUtils";

// --- UTILS ---
const parseExperience = (expStr) => {
  const match = expStr.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

// --- SHORTLIST DRAWER (unchanged) ---
const ShortlistDrawer = ({ isOpen, onClose, shortlistedMap, onRemove, jobs, userId, refreshTalents, clearShortlistForJob }) => {
  const [offerStatus, setOfferStatus] = useState({});
  const [sendInviteNotification] = useSendInviteNotificationMutation();

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
      };

      await sendInviteNotification(payload).unwrap();

      setOfferStatus((prev) => ({ ...prev, [jobId]: "sent" }));
      clearShortlistForJob(jobId);
      await refreshTalents();
      onClose();
    } catch (err) {
      console.error("Invite failed", err);
      setOfferStatus((prev) => ({ ...prev, [jobId]: "idle" }));
      alert("Failed to send invite");
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
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("recommended");
  const [selectedJobId, setSelectedJobId] = useState(null);

  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [allCandidates, setAllCandidates] = useState([]);
  const [isInitialised, setIsInitialised] = useState(false);
  const [allSelectedJobDetails, setAllSelectedJobDetails] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [appliedFilters, setAppliedFilters] = useState(null);


  const activeJobId = selectedJobId;

  const { data: jobTitles = [] } = useGetGroupedJobTitlesQuery(userId);
  const [getJobById, { data: jobDetails }] = useLazyGetJobByIdQuery();
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

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

      role: item.title || "—",

      experience: `${calculateTotalExperience(item.workexperiences) || 0}`,

      location: item.city || "—",

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
      isshortlisted: item.isshortlisted,

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

    // If URL has filters but appliedFilters not restored yet → wait
    if (hasURLParams && appliedFilters === null) {
      return false;
    }

    return true;
  }, [searchParams, appliedFilters]);

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




  const handleProfileClick = (candidate) => {
    const from = location.pathname + location.search;

    navigate(
      `/user/user-talent-profile?from=${encodeURIComponent(from)}`,
      {
        state: {
          employeeID: candidate.id,
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
    <div className="vs-page">
      <div className="projects-container d-flex flex-column gap-3">
        {/* Heading */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <h1 className="section-title" style={{ fontSize: "24px", marginBottom: "8px" }}>
              Find Talent
            </h1>
            <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
              Search and manage your Talent network.
            </p>
          </div>

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
            {/* Sort */}
            <div className="sort-wrapper">
              <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="recommended">Sort by: Recommended</option>
                <option value="rating_high">Rating: High to Low</option>
                <option value="exp_high">Experience: High to Low</option>
                <option value="exp_low">Experience: Low to High</option>
                <option value="rate_low">Hourly Rate: Low to High</option>
                <option value="name_asc">Name: A - Z</option>
              </select>
              <FiChevronDown className="sort-icon" />
            </div>

            <button
              className="filters-applied"
              onClick={() => setIsMobileFilterOpen(true)}
            >
              <FiFilter /> Filters
            </button>

            <button
              className="add-project-btn"
              onClick={() => setIsDrawerOpen(true)}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <FiBriefcase />
              <span>View Shortlisted</span>
            </button>

            <div className="vs-results-right">
              <div className="view-toggle1">
                <button
                  className={`view-btn ${viewMode === "grid" ? "toggle active" : ""}`}
                  onClick={() => setViewMode("grid")}
                >
                  <FiGrid />
                </button>
                <button
                  className={`view-btn ${viewMode === "table" ? "toggle active" : ""}`}
                  onClick={() => setViewMode("table")}
                >
                  <FiList />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Layout */}
        <div className="d-flex gap-3" style={{
          display: "flex",
          gap: "16px",
          height: "calc(100vh - 10px)", // SAME HEIGHT for both
        }}>
          <aside className="vs-filters-sidebar hide-scrollbar" style={{
            overflowY: "auto",
          }}>
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

          <section className="vs-results hide-scrollbar" ref={resultsRef} style={{
            height: "calc(100vh - 0px)", // adjust if header height differs
            overflowY: "auto",
            overflowX: "hidden",
            width: "600px"
          }}>
            {/* Render overview cards for all selected jobs */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 16 }}>
              {allJobOverviewData.map((jobData) => (
                <JobOverviewCard
                  key={jobData.id}
                  job={jobData}
                  isExpanded={expandedCardId === jobData.id}
                  onToggle={() => toggleCard(jobData.id)}
                />
              ))}
              {allJobOverviewData.length === 0 && (
                <JobOverviewCard job={null} />
              )}
            </div>
            {isLoading && (
              <div style={{ textAlign: "center", padding: "12px", color: "#64748b" }}>
                Loading candidates...
              </div>
            )}

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
                hasMore={hasMore}
              />
            )}

          </section>
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
        />
      ) : null}

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
  );
};

export default TalentPool;
