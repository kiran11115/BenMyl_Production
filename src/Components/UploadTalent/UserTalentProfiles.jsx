import React, { useState, useMemo, useEffect, useRef } from "react";
import { FiGrid, FiList, FiSearch, FiChevronDown } from "react-icons/fi";
import { GiCheckMark } from "react-icons/gi";
import { useNavigate } from "react-router-dom";

// --- Sub-Components ---
import UserTalentGrid from "./UserTalentGrid";
import UserTalentTable from "./UserTalentTable";
import PublishTalentModal from "./PublishTalentModal"; // The modal from the previous step
import { useGetMyBenchMutation } from "../../State-Management/Api/UploadResumeApiSlice";

// --- SORTING FUNCTION ---
const sortCandidates = (candidates, sortBy) => {
  return [...candidates].sort((a, b) => {
    switch (sortBy) {
      case "recommended":
        const statusPriority = {
          SHORTLISTED: 5,
          "OFFER EXTENDED": 4,
          INTERVIEWING: 3,
          "IN REVIEW": 2,
          NEW: 1,
          REJECTED: 0,
        };
        return (
          statusPriority[b.status] - statusPriority[a.status] ||
          b.rating - a.rating
        );

      case "rating_high":
        return b.rating - a.rating;

      case "exp_high":
        const expA = parseInt(a.experience.match(/\d+/)?.[0] || 0);
        const expB = parseInt(b.experience.match(/\d+/)?.[0] || 0);
        return expB - expA;

      case "exp_low":
        const expALow = parseInt(a.experience.match(/\d+/)?.[0] || 0);
        const expBLow = parseInt(b.experience.match(/\d+/)?.[0] || 0);
        return expALow - expBLow;

      case "rate_low":
        return Math.random() - 0.5;

      case "name_asc":
        return a.name.localeCompare(b.name);

      default:
        return 0;
    }
  });
};

// --- MAIN COMPONENT ---
const UserTalentProfiles = ({ searchQuery = "", setSearchQuery = () => {} }) => {
  const PAGE_SIZE = 50;

  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("recommended");

  const [candidatesMock, setCandidatesMock] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  const [getMyBench, { isLoading }] = useGetMyBenchMutation();
  const hasUserScrolled = useRef(false);

  useEffect(() => {
    setCandidatesMock([]);
    setPageNumber(1);
    setHasMore(true);
    hasUserScrolled.current = false;
  }, []);

  /* ================= FETCH ================= */
  useEffect(() => {
    let isMounted = true;

    const fetchBench = async () => {
      try {
        const payload = {
          companyid: Number(localStorage.getItem("logincompanyid")),
          pageNumber,
          pageSize: PAGE_SIZE,
          filters: [],
        };

        const res = await getMyBench(payload).unwrap();

        if (!isMounted) return;

        const list = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
            ? res.data
            : Array.isArray(res?.data?.records)
              ? res.data.records
              : [];

        const mappedData = list.map((item) => ({
          id: item.employeeID,
          name: `${item.firstName || ""} ${item.lastName || ""}`.trim(),
          verified: item.status === "Available",
          email: item.emailaddress,
          role: item.role,
          experience: item.noofexperience
            ? `${item.noofexperience} years exp`
            : "0 years exp",
          skills: item.skills
            ? item.skills.split(",").map((skill) => skill.trim())
            : [],
          location: item.city || "NA",
          availability: item.status ? [item.status] : [],
          status: item.status?.toUpperCase() || "NEW",
          rating: 4.5,
          avatar:
            item.profilepicture ||
            "https://images.pexels.com/photos/774095/pexels-photo-774095.jpeg",
        }));

        // ✅ Page 1 replace, Page 2+ append
        setCandidatesMock((prev) =>
          pageNumber === 1 ? mappedData : [...prev, ...mappedData],
        );

        // ✅ Stop further calls
        if (mappedData.length < PAGE_SIZE) {
          setHasMore(false);
        }
      } catch (err) {
        console.error("GET MY BENCH FAILED 👉", err);
      }
    };

    if (hasMore) fetchBench();

    return () => {
      isMounted = false;
    };
  }, [pageNumber, getMyBench, hasMore]);

  /* ================= WINDOW SCROLL ================= */
  useEffect(() => {
    const handleScroll = () => {
      if (!hasMore || isLoading) return;

      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      if (
        scrollTop + windowHeight >= fullHeight - 100 &&
        candidatesMock.length >= PAGE_SIZE
      ) {
        setPageNumber((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, isLoading, candidatesMock.length]);

  /* ================= MEMOS ================= */
  const filteredCandidates = useMemo(() => {
    if (!searchQuery.trim()) return candidatesMock;
    const query = searchQuery.toLowerCase();
    return candidatesMock.filter((c) =>
      c.name?.toLowerCase().includes(query) ||
      c.email?.toLowerCase().includes(query) ||
      c.role?.toLowerCase().includes(query) ||
      c.skills?.some(skill => skill.toLowerCase().includes(query)) ||
      c.location?.toLowerCase().includes(query)
    );
  }, [candidatesMock, searchQuery]);

  const sortedCandidates = useMemo(() => {
    return sortCandidates(filteredCandidates, sortBy);
  }, [filteredCandidates, sortBy]);

  const selectedCandidates = useMemo(() => {
    return candidatesMock.filter((c) => selectedIds.has(c.id));
  }, [selectedIds, candidatesMock]);

  const toggleSelection = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  return (
    <>
      {/* --- THE MODAL --- */}
      <PublishTalentModal
        open={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        selectedTalents={selectedCandidates}
        onRemove={toggleSelection}
        onPublish={clearSelection}
      />

      <div className="vs-page">
        <div className="projects-container d-flex flex-column gap-3 p-0">
          {/* Heading Section */}
          <div className="ut-header-row">
            <div className="ut-title-group">
              <h1 className="section-title">
                Talent Profiles
              </h1>
              <p className="section-subtitle">
                Search and manage your Talent network.
              </p>
            </div>

            <div className="ut-actions-group">
              {/* SORT DROPDOWN */}
              <div className="sort-wrapper">
                <select
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recommended">Sort by: Recommended</option>
                  <option value="rating_high">Rating: High to Low</option>
                  <option value="exp_high">Experience: High to Low</option>
                  <option value="exp_low">Experience: Low to High</option>
                  <option value="rate_low">Hourly Rate: Low to High</option>
                  <option value="name_asc">Name: A - Z</option>
                </select>
                <FiChevronDown className="sort-icon" />
              </div>

              {/* SEARCH */}
              <div className="ut-search-wrapper">
                <FiSearch className="ut-search-icon" />
                <input
                  type="text"
                  placeholder="Search by Talent Name..."
                  className="ut-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* PUBLISH BUTTON */}
              <button
                className="add-project-btn ut-publish-btn"
                onClick={() => setIsPublishModalOpen(true)}
                disabled={selectedIds.size === 0}
              >
                <span>
                  Publish{" "}
                  {selectedIds.size > 0 ? `(${selectedIds.size})` : "Talent"}
                </span>
              </button>

              {/* VIEW TOGGLE */}
              <div className="vs-results-right ut-view-toggle">
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

          <div className="d-flex gap-3">
            <section className="vs-results">
              {isLoading && (
                <div
                  style={{
                    padding: "40px",
                    textAlign: "center",
                    color: "#64748b",
                    fontSize: "14px",
                  }}
                >
                  Loading Talent Profiles...
                </div>
              )}

              {/* ❌ No Data */}
              {!isLoading && sortedCandidates.length === 0 && (
                <div
                  style={{
                    padding: "40px",
                    textAlign: "center",
                    color: "#64748b",
                    fontSize: "14px",
                  }}
                >
                  {searchQuery ? "No Talent Profiles matching your search" : "No Talent Profiles found"}
                </div>
              )}
              {viewMode === "grid" ? (
                <UserTalentGrid
                  candidates={sortedCandidates}
                  selectedIds={selectedIds}
                  onToggleSelect={toggleSelection}
                />
              ) : (
                <UserTalentTable
                  candidates={sortedCandidates}
                  selectedIds={selectedIds}
                  onToggleSelect={toggleSelection}
                />
              )}
            </section>
          </div>
        </div>

        <style jsx>{`
          /* Sort Dropdown Styles */
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
          /* Ensure button looks disabled when inactive */
          .add-project-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            background-color: #94a3b8;
          }
        `}</style>
      </div>
    </>
  );
};

export default UserTalentProfiles;
