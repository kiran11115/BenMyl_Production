import React, { useState, useMemo, useEffect, useRef } from "react";
import { FiGrid, FiList, FiSearch, FiBriefcase } from "react-icons/fi";

// --- Sub-Components ---
import UserTalentGrid from "./UserTalentGrid";
import UserTalentTable from "./UserTalentTable";
import PublishTalentModal from "./PublishTalentModal"; // The modal from the previous step
import { useGetMyBenchMutation } from "../../State-Management/Api/UploadResumeApiSlice";
import NoData from "./NoData";
import "../UserJobs/Jobs.css";

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

      default:
        return 0;
    }
  });
};

// --- MAIN COMPONENT ---
const UserTalentProfiles = ({ searchQuery = "", setSearchQuery = () => { } }) => {
  const PAGE_SIZE = 50;

  const [viewMode, setViewMode] = useState("grid");
  const [sortBy] = useState("recommended");

  const [candidatesMock, setCandidatesMock] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);

  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  // Debounced search — API is called only after user stops typing for 300ms
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceRef = useRef(null);

  const [getMyBench, { isLoading }] = useGetMyBenchMutation();

  // Refs to always hold latest values inside scroll/async callbacks
  const hasMoreRef = useRef(true);
  const isLoadingRef = useRef(false);
  const pageNumberRef = useRef(1);

  // Debounce: whenever searchQuery changes, wait 300ms then apply
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [searchQuery]);

  // When the debounced search changes → reset list and go back to page 1
  useEffect(() => {
    setCandidatesMock([]);
    setPageNumber(1);
    hasMoreRef.current = true;
    pageNumberRef.current = 1;
  }, [debouncedSearch]);

  /* ================= FETCH ================= */
  useEffect(() => {
    let isMounted = true;
    isLoadingRef.current = true;

    const fetchBench = async () => {
      try {
        // Build filters using the API's expected format
        const filters = debouncedSearch
          ? [
              {
                filterName: "title",
                filterOperator: "Contains",
                filterValue: [debouncedSearch],
              },
            ]
          : [];

        const payload = {
          companyid: Number(localStorage.getItem("logincompanyid")),
          pageNumber,
          pageSize: PAGE_SIZE,
          filters,
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
          uploadedByName: item.uploadedByName,
          status: item.status?.toUpperCase() || "NEW",
          rating: 4.5,
          avatar: item.profilepicture || "",
          profileCompletionPercentage: item.profileCompletionPercentage,
        }));

        // Page 1 → replace, Page 2+ → append
        setCandidatesMock((prev) =>
          pageNumber === 1 ? mappedData : [...prev, ...mappedData],
        );

        // Stop infinite scroll if we got fewer than a full page
        hasMoreRef.current = mappedData.length >= PAGE_SIZE;
      } catch (err) {
        console.error("GET MY BENCH FAILED 👉", err);
      } finally {
        if (isMounted) isLoadingRef.current = false;
      }
    };

    fetchBench();

    return () => {
      isMounted = false;
    };
    // Re-run when pageNumber OR debouncedSearch changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, debouncedSearch]);

  /* ================= WINDOW SCROLL ================= */
  useEffect(() => {
    const handleScroll = () => {
      // Use refs so we always read the latest value - no stale closures
      if (!hasMoreRef.current || isLoadingRef.current) return;

      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= fullHeight - 100) {
        isLoadingRef.current = true; // Debounce: prevent duplicate increments
        setPageNumber((prev) => {
          const next = prev + 1;
          pageNumberRef.current = next;
          return next;
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Registered once - refs carry the live values


  /* ================= MEMOS ================= */
  // Client-side filter acts as a fast visual refinement while API re-fetches
  const filteredCandidates = useMemo(() => {
    if (!searchQuery.trim()) return candidatesMock;
    const query = searchQuery.toLowerCase();
    return candidatesMock.filter((c) =>
      c.name?.toLowerCase().includes(query) ||
      c.email?.toLowerCase().includes(query) ||
      c.role?.toLowerCase().includes(query) ||
      c.skills?.some((skill) => skill.toLowerCase().includes(query)) ||
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

            <div className="ut-actions-group d-flex align-items-start">
              {/* SEARCH */}
              <div
                className="ut-search-wrapper"
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "#ffffff",
                  borderRadius: "14px",
                  padding: "0 16px",
                  height: "36px",
                  width: "150px !important",
                  boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
                }}
              >
                <FiSearch
                  style={{
                    color: "#3b82f6",
                    fontSize: "18px",
                    flexShrink: 0,
                  }}
                />

                <input
                  type="text"
                  placeholder="Search by Job Title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    marginLeft: "14px",
                    width: "100%",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#475569",
                  }}
                />
              </div>

              {/* PUBLISH BUTTON */}
              <button
                className="btn-upload ut-publish-btn"
                onClick={() => setIsPublishModalOpen(true)}
                disabled={selectedIds.size === 0}
              >
                <span>
                  Publish{" "}
                  {selectedIds.size > 0 ? `(${selectedIds.size})` : "Talent"}
                </span>
              </button>

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

          <div className="d-flex gap-3">
            <section className="vs-results">
              {isLoading && (
                <div className="jobs-screen-loader">
                  <div className="jobs-loader-ring">
                    <div className="jobs-loader-icon">
                      <FiBriefcase size={18} />
                    </div>
                  </div>
                  <p className="jobs-loader-text">Searching for candidates...</p>
                  <span className="jobs-loader-sub">Matching candidates based on your filters</span>
                </div>
              )}

              {/* No Data */}
              {!isLoading && sortedCandidates.length === 0 && (
                <div
                  style={{
                    padding: "40px",
                    width: "100%",
                  }}
                >
                  <NoData text={searchQuery ? "No Talent Profiles matching your search" : "No Talent Profiles found"} />
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
        `}</style>
      </div>
    </>
  );
};

export default UserTalentProfiles;
