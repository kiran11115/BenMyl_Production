import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  FiGrid,
  FiList,
  FiBriefcase,
  FiX,
  FiTrash2,
  FiLoader,
  FiCheck,
  FiChevronDown,
} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { GiCheckMark } from "react-icons/gi";

import TalentGridView from "./TalentGrid";
import TalentTableView from "./TalentTable";
import "./TalentPool.css";
import TalentFilters from "../Filters/TalentFilters";
import JobOverviewCard from "./JobOverviewCard";
import { useGetGroupedJobTitlesQuery, useLazyGetJobByIdQuery, useTalentPoolMutation } from "../../State-Management/Api/TalentPoolApiSlice";

// --- UTILS ---
const parseExperience = (expStr) => {
  const match = expStr.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

// --- SHORTLIST DRAWER (unchanged) ---
const ShortlistDrawer = ({ isOpen, onClose, shortlistedMap, onRemove,jobs }) => {
  const [offerStatus, setOfferStatus] = useState({});

  const handleSendOffer = (jobId) => {
    setOfferStatus((prev) => ({ ...prev, [jobId]: "loading" }));
    setTimeout(() => {
      setOfferStatus((prev) => ({ ...prev, [jobId]: "sent" }));
    }, 1000);
  };

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
          {Object.keys(shortlistedMap).length === 0 ? (
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
                      onClick={() => handleSendOffer(jobId)}
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
  const [shortlistedMap, setShortlistedMap] = useState({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [sortBy, setSortBy] = useState("recommended");
  const [selectedJobId, setSelectedJobId] = useState(null);
  const handleProfileClick = () => navigate("/user/user-talent-profile");
  const [pageNumber, setPageNumber] = useState(1);
const [hasMore, setHasMore] = useState(true);
const [allCandidates, setAllCandidates] = useState([]);
const [isInitialised, setIsInitialised] = useState(false);
const [activeJobDetails, setActiveJobDetails] = useState(null);

    const activeJobId = selectedJobId;

    const { data: jobTitles = [] } = useGetGroupedJobTitlesQuery(userId);
    const [getJobById, { data: jobDetails }] = useLazyGetJobByIdQuery();

  const [getFindTalent, { data, isLoading }] =
    useTalentPoolMutation();



  const fetchTalents = async () => {

  const payload = {
    companyid: companyId,
    pageNumber,
    pageSize: 50,
    filters: activeJob
      ? [
          {
            filterName: "Title",
            filterOperator: "Equals",
            filterValue: [activeJob.title],
          },
        ]
      : [],
  };

  const res = await getFindTalent(payload).unwrap();

  // 🔥 API returns array directly
  if (!Array.isArray(res) || res.length === 0) {
    setHasMore(false);
    return;
  }

  setAllCandidates((prev) =>
    pageNumber === 1 ? res : [...prev, ...res]
  );
};


  const candidates = useMemo(() => {
  return allCandidates.map((item) => ({
    id: item.employeeID,

    name: `${item.firstName} ${item.lastName}`,

    role: item.title || "—",

    experience: `${item.noofExperience || 0} yrs`,

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

    verified: <GiCheckMark size={14} color="#059669" />,

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


useEffect(() => {
  // CASE 1: Coming from Success modal
  if (preselectedJobTitle && jobs.length > 0) {
    const matchedJob = jobs.find(
      (j) => j.title.toLowerCase() === preselectedJobTitle.toLowerCase()
    );

    if (matchedJob) {
      setSelectedJobId(matchedJob.id);
    }
  }

  // CASE 2: Normal page load (no preselected job)
  if (!preselectedJobTitle) {
    setIsInitialised(true);
  }
}, [preselectedJobTitle, jobs]);

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
  if (!isInitialised) return;   // 🚫 BLOCK early call
  fetchTalents();
}, [pageNumber, activeJobId, isInitialised]);



useEffect(() => {
  const el = resultsRef.current;
  if (!el) return;

  const onScroll = () => {
    if (
      el.scrollTop + el.clientHeight >=
        el.scrollHeight - 50 &&
      hasMore &&
      !isLoading
    ) {
      setPageNumber((prev) => prev + 1);
    }
  };

  el.addEventListener("scroll", onScroll);
  return () => el.removeEventListener("scroll", onScroll);
}, [hasMore, isLoading]);


const activeJob = useMemo(() => {
  if (!selectedJobId) return null;
  return jobs.find((j) => j.id === selectedJobId) || null;
}, [selectedJobId, jobs]);

  const activeJobColor = activeJob?.color || "#4f46e5";

  useEffect(() => {
  if (!activeJob) {
    setActiveJobDetails(null);
    return;
  }

  getJobById({
    jobId: activeJob.jobID,
    userId,
  })
    .unwrap()
    .then((res) => {
      // API returns array → take first item
      setActiveJobDetails(res?.[0] || null);
    });
}, [activeJob]);

const jobOverviewData = useMemo(() => {
  if (!activeJobDetails) return null;

  return {
    title: activeJobDetails.jobTitle,
    company: activeJobDetails.companyName,
    location: activeJobDetails.location,
    budget: `$${activeJobDetails.salaryRange_min} - $${activeJobDetails.salaryRange_max}`,
    experience: activeJobDetails.yearsofExperience || activeJobDetails.experienceLevel,
    type: activeJobDetails.employeeType,
    description: activeJobDetails.jobDescription,
    requiredSkills: activeJobDetails.requiredSkills
      ? activeJobDetails.requiredSkills.split(",").map((s) => s.trim())
      : [],
  };
}, [activeJobDetails]);

  const handleShortlist = (candidate) => {
    if (!activeJobId) {
      alert("Please select a Job from the filters first to shortlist.");
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
        <div className="d-flex gap-3"  style={{
    display: "flex",
    gap: "16px",
    height: "calc(100vh - 10px)", // SAME HEIGHT for both
  }}>
          <aside className="hide-scrollbar" style={{
      overflowY: "auto",
    }}>
            <TalentFilters onApplyFilters={setSelectedJobId}  jobs={jobs} selectedJobId={selectedJobId}/>
          </aside>

          <section className="vs-results hide-scrollbar" ref={resultsRef} style={{
    height: "calc(100vh - 0px)", // adjust if header height differs
    overflowY: "auto",
    overflowX: "hidden",
  }}>
            {/* ALWAYS render overview card (shows empty state if no job) */}
            <div style={{ marginBottom: 16 }}>
              <JobOverviewCard job={jobOverviewData} />
            </div>
            {isLoading && (
  <div style={{ textAlign: "center", padding: "12px", color: "#64748b" }}>
    Loading candidates...
  </div>
)}

            {viewMode === "grid" ? (
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
