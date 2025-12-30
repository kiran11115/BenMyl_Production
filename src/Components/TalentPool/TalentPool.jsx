import React, { useState, useMemo } from "react";
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
import { useNavigate } from "react-router-dom";
import { GiCheckMark } from "react-icons/gi";

import TalentGridView from "./TalentGrid";
import TalentTableView from "./TalentTable";
import "./TalentPool.css";
import TalentFilters, { USER_CREATED_JOBS } from "../Filters/TalentFilters";
import JobOverviewCard from "./JobOverviewCard";

// --- DATA SOURCE (With Hourly Rates for Sorting) ---
const candidatesMock = [
  {
    id: 101,
    name: "Sarah Johnson",
    verified: <GiCheckMark size={14} color="#059669" />,
    role: "Senior Developer",
    experience: "8 years exp",
    skills: ["React", "Node.js", "AWS"],
    location: "San Francisco, CA",
    availability: ["Available Now", "Remote"],
    status: "SHORTLISTED",
    rating: 4.9,
    hourlyRate: 85,
    avatar:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: 102,
    name: "Michael Chen",
    verified: "",
    role: "Project Manager",
    experience: "12 years exp",
    skills: ["Agile", "Jira", "Scrum"],
    location: "New York, NY",
    availability: ["2 Weeks Notice"],
    status: "IN REVIEW",
    rating: 4.7,
    hourlyRate: 95,
    avatar:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: 103,
    name: "Emily Davis",
    verified: <GiCheckMark size={14} color="#059669" />,
    role: "DevOps Engineer",
    experience: "5 years exp",
    skills: ["Docker", "K8s", "CI/CD"],
    location: "Austin, TX",
    availability: ["Available Now"],
    status: "INTERVIEWING",
    rating: 4.8,
    hourlyRate: 70,
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: 104,
    name: "David Lee",
    verified: <GiCheckMark size={14} color="#059669" />,
    role: "Backend Developer",
    experience: "6 years exp",
    skills: ["Python", "Django", "SQL"],
    location: "Chicago, IL",
    availability: ["1 Month Notice", "Remote"],
    status: "INTERVIEWING",
    rating: 4.6,
    hourlyRate: 65,
    avatar:
      "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: 105,
    name: "Maria Garcia",
    verified: "",
    role: "QA Engineer",
    experience: "4 years exp",
    skills: ["Selenium", "Cypress"],
    location: "Miami, FL",
    availability: ["Available Now"],
    status: "SHORTLISTED",
    rating: 4.9,
    hourlyRate: 50,
    avatar:
      "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: 106,
    name: "James Williams",
    verified: "",
    role: "Data Scientist",
    experience: "7 years exp",
    skills: ["Python", "TF", "SQL"],
    location: "Seattle, WA",
    availability: ["Remote Only"],
    status: "IN REVIEW",
    rating: 5.0,
    hourlyRate: 110,
    avatar:
      "https://images.pexels.com/photos/1130624/pexels-photo-1130624.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: 107,
    name: "Olivia Martinez",
    verified: <GiCheckMark size={14} color="#059669" />,
    role: "Product Owner",
    experience: "9 years exp",
    skills: ["Strategy", "Agile"],
    location: "Denver, CO",
    availability: ["Available Now"],
    status: "OFFER EXTENDED",
    rating: 4.8,
    hourlyRate: 90,
    avatar:
      "https://images.pexels.com/photos/1181682/pexels-photo-1181682.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: 108,
    name: "John Smith",
    verified: "",
    role: "UI/UX Designer",
    experience: "3 years exp",
    skills: ["Figma", "Sketch"],
    location: "Boston, MA",
    availability: ["Part-time"],
    status: "NEW",
    rating: 4.5,
    hourlyRate: 45,
    avatar:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: 109,
    name: "William Rodriguez",
    verified: "",
    role: "SysAdmin",
    experience: "15 years exp",
    skills: ["Linux", "Bash", "Net"],
    location: "Houston, TX",
    availability: ["Available Now"],
    status: "REJECTED",
    rating: 4.4,
    hourlyRate: 80,
    avatar:
      "https://images.pexels.com/photos/428364/pexels-photo-428364.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: 110,
    name: "Ava Wilson",
    verified: <GiCheckMark size={14} color="#059669" />,
    role: "Jr. Frontend Dev",
    experience: "1 year exp",
    skills: ["HTML", "CSS", "JS"],
    location: "Portland, OR",
    availability: ["Entry Level"],
    status: "NEW",
    rating: 4.7,
    hourlyRate: 30,
    avatar:
      "https://images.pexels.com/photos/774095/pexels-photo-774095.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
];

// --- UTILS ---
const parseExperience = (expStr) => {
  const match = expStr.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

// --- SHORTLIST DRAWER (unchanged) ---
const ShortlistDrawer = ({ isOpen, onClose, shortlistedMap, onRemove }) => {
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
              const job = USER_CREATED_JOBS.find((j) => j.id === jobId);
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
  const [viewMode, setViewMode] = useState("grid");
  const candidates = useMemo(() => candidatesMock, []);
  const [activeFilters, setActiveFilters] = useState(null);

  const [shortlistedMap, setShortlistedMap] = useState({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [sortBy, setSortBy] = useState("recommended");

  const handleApplyFilters = (newFilters) => setActiveFilters(newFilters);
  const handleProfileClick = () => navigate("/user/user-talent-profile");

  const activeJobId = activeFilters?.selectedJobs?.[0] || null;

  const activeJob = useMemo(() => {
    if (!activeJobId) return null;
    return USER_CREATED_JOBS.find((j) => j.id === activeJobId) || null;
  }, [activeJobId]);

  const activeJobColor = activeJob?.color || "#4f46e5";

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
        <div className="d-flex gap-3">
          <aside>
            <TalentFilters onApplyFilters={handleApplyFilters} />
          </aside>

          <section className="vs-results">
            {/* ALWAYS render overview card (shows empty state if no job) */}
            <div style={{ marginBottom: 16 }}>
              <JobOverviewCard job={activeJob} />
            </div>

            {viewMode === "grid" ? (
              <TalentGridView
                candidates={sortedCandidates}
                onShortlist={handleShortlist}
                activeJobId={activeJobId}
                activeJobColor={activeJobColor}
                shortlistedMap={shortlistedMap}
                onProfileClick={handleProfileClick}
              />
            ) : (
              <TalentTableView
                candidates={sortedCandidates}
                onShortlist={handleShortlist}
                activeJobId={activeJobId}
                activeJobColor={activeJobColor}
                shortlistedMap={shortlistedMap}
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
      `}</style>
    </div>
  );
};

export default TalentPool;
