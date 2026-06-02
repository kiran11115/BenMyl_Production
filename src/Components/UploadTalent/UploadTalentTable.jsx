import React, { useState, useMemo, useEffect, useRef } from "react";
import { FiChevronUp, FiChevronDown, FiTrash2 } from "react-icons/fi";
import { FaSort } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useGetQueueManagementMutation, useDeleteDraftEmployeeMutation } from "../../State-Management/Api/UploadResumeApiSlice";
import MobileTalentCard from "./MobileTalentCard";
import "./UploadTalent.css";
import NoData from "./NoData";
import { DeleteConfirmModal } from "./SaveTalentAlert";

const PAGE_SIZE = 50;
const UploadTalentTable = ({ refreshKey, externalLoading, isDashboard = false, searchQuery = "", onDeleted }) => {
  const navigate = useNavigate();

  const [talents, setTalents] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const hasMoreRef = useRef(true);
const isLoadingRef = useRef(false);
const pageNumberRef = useRef(1);

const [showDeleteModal, setShowDeleteModal] = useState(false);
const [deletingId, setDeletingId] = useState(null);


useEffect(() => {
  hasMoreRef.current = hasMore;
}, [hasMore]);

useEffect(() => {
  pageNumberRef.current = pageNumber;
}, [pageNumber]);

  const [getQueueManagement, { isLoading }] =
    useGetQueueManagementMutation();
  const [deleteDraftEmployee] = useDeleteDraftEmployeeMutation();

  const handleDelete = (employeeID) => {
    setDeletingId(employeeID);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteDraftEmployee(deletingId).unwrap();
      setShowDeleteModal(false);
      setDeletingId(null);
      if (onDeleted) onDeleted();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  /* ================= FETCH ================= */
 useEffect(() => {
  let isMounted = true;
  isLoadingRef.current = true;

  const fetchQueue = async () => {
    try {
      const payload = {
        companyid: Number(localStorage.getItem("logincompanyid")),
        pageNumber,
        pageSize: PAGE_SIZE,
        filters: [],
      };

      const res = await getQueueManagement(payload).unwrap();

      if (!isMounted) return;

      const mapped = res.map((item) => ({
        employeeID: item.employeeID,
        fileName: item.resumeFileName,
        batchFormat: item.resumeFileName?.split(".").pop(),
        extractStatus: item.status,
        statusClass:
          item.status === "Pending For Review"
            ? "status-yellow"
            : "status-green",
        created: item.status === "Completed" ? "Yes" : "No",
        createdClass:
          item.status === "Completed"
            ? "status-green"
            : "status-red",
        uploadedBy: item.uploadedByName,
        uploadDate: item.insertDate?.split(" ")[0] ?? "-",
        confidence: "N/A",
        confidenceClass: "status-blue",
        email: `${item.firstName} ${item.lastName}`,
      }));

      setTalents((prev) =>
        pageNumber === 1 ? mapped : [...prev, ...mapped]
      );

      const moreAvailable = mapped.length >= PAGE_SIZE;
      setHasMore(moreAvailable);
      hasMoreRef.current = moreAvailable;
    } catch (err) {
      console.error("Queue fetch failed", err);
    } finally {
      if (isMounted) isLoadingRef.current = false;
    }
  };

  fetchQueue();

  return () => {
    isMounted = false;
  };
}, [pageNumber, getQueueManagement, refreshKey]);

 useEffect(() => {
  setPageNumber(1);
  setHasMore(true);
  setTalents([]); // 🔥 important
  hasMoreRef.current = true;
  pageNumberRef.current = 1;
}, [refreshKey]);

  /* ================= SCROLL ================= */
  const handleScroll = (e) => {
  if (!hasMoreRef.current || isLoadingRef.current) return;

  const { scrollTop, scrollHeight, clientHeight } = e.target;

  if (scrollHeight - scrollTop <= clientHeight + 50) {
    isLoadingRef.current = true;

    setPageNumber((prev) => {
      const next = prev + 1;
      pageNumberRef.current = next;
      return next;
    });
  }
};



  const [selectedEmails, setSelectedEmails] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const getInitials = (name = "") =>
    name
      .split(" ")
      .slice(0, 1)
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const getAvatarColor = (name = "") => {
    const colors = ["#3b82f6", "#6366f1", "#8b5cf6", "#ec4899", "#5a5de8"];
    return colors[name.length % colors.length];
  };

  const filteredTalents = useMemo(() => {
    if (!searchQuery.trim()) return talents;
    const query = searchQuery.toLowerCase();
    return talents.filter((t) =>
      t.fileName?.toLowerCase().includes(query) ||
      t.email?.toLowerCase().includes(query) ||
      t.uploadedBy?.toLowerCase().includes(query) ||
      t.extractStatus?.toLowerCase().includes(query) ||
      t.batchFormat?.toLowerCase().includes(query)
    );
  }, [talents, searchQuery]);

  const sortedTalents = useMemo(() => {
    const items = [...filteredTalents];
    if (sortConfig.key) {
      items.sort((a, b) => {
        const A = String(a[sortConfig.key] ?? "").toLowerCase();
        const B = String(b[sortConfig.key] ?? "").toLowerCase();
        if (A < B) return sortConfig.direction === "ascending" ? -1 : 1;
        if (A > B) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return items;
  }, [filteredTalents, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const onToggleSelect = (email) => {
    setSelectedEmails((prev) => {
      const next = new Set(prev);
      if (next.has(email)) next.delete(email);
      else next.add(email);
      return next;
    });
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey)
      return <FaSort style={{ color: "#fefefe" }} className="tt-sort-icon" />;
    return sortConfig.direction === "ascending" ? (
      <FiChevronUp className="tt-sort-icon active" />
    ) : (
      <FiChevronDown className="tt-sort-icon active" />
    );
  };

  return (
    <div className="upload-table-panel">
      {/* Mobile View */}
      <div className="mobile-talent-list d-md-none">
        {(isLoading || externalLoading) && (
          <div className="text-center py-5">
            <span className="text-muted">Loading resumes...</span>
          </div>
        )}
        {!isLoading && sortedTalents.length === 0 && (
          <div className="text-center py-5">
            <span className="text-muted">No resumes uploaded</span>
          </div>
        )}
        {sortedTalents.map((talent, i) => (
          <MobileTalentCard
            key={i}
            talent={talent}
            onView={() => {
              const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
              navigate(`${basePath}/review-talent`, {
                state: { employeeID: talent.employeeID },
              })
            }}
            onDelete={() => handleDelete(talent.employeeID)}
          />
        ))}
      </div>

      {/* Desktop View */}
      <div className="table-scroll d-none d-md-block" onScroll={handleScroll} style={{ overflowY: "auto", maxHeight: 700 }}>
        <table className="custom-table">
          <thead>
            <tr>
              {!isDashboard && <th style={{ width: 40 }}></th>}

              <th onClick={() => requestSort("fileName")}>
                FILE NAME <SortIcon columnKey="fileName" />
              </th>

              <th onClick={() => requestSort("batchFormat")}>
                BATCH FORMAT <SortIcon columnKey="batchFormat" />
              </th>

              <th onClick={() => requestSort("extractStatus")}>
                EXTRACT STATUS <SortIcon columnKey="extractStatus" />
              </th>

              <th onClick={() => requestSort("created")}>
                CREATED <SortIcon columnKey="created" />
              </th>

              {!isDashboard && (
                <th onClick={() => requestSort("uploadedBy")}>
                  UPLOADED BY <SortIcon columnKey="uploadedBy" />
                </th>
              )}

              <th onClick={() => requestSort("uploadDate")}>
                UPLOAD DATE <SortIcon columnKey="uploadDate" />
              </th>

              {!isDashboard && (
                <th onClick={() => requestSort("confidence")}>
                  CONFIDENCE <SortIcon columnKey="confidence" />
                </th>
              )}

              <th>ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {(isLoading || externalLoading) && (
              <tr>
                <td colSpan={isDashboard ? 6 : 9} style={{ textAlign: "center", padding: "40px" }}>
                  <span style={{ color: "#64748b", fontSize: "14px" }}>
                    Loading resumes...
                  </span>
                </td>
              </tr>
            )}
            {!isLoading && sortedTalents.length === 0 && (
              <tr>
                <td colSpan={isDashboard ? 6 : 9} style={{ textAlign: "center", padding: "40px" }}>
                  <div
                    style={{
                      minHeight: "320px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <NoData text={searchQuery ? "No matching resumes found" : "No resumes uploaded"} />
                  </div>
                </td>
              </tr>
            )}
            {sortedTalents.map((talent, i) => {
              const isSelected = selectedEmails.has(talent.email);
              return (
                <tr key={i} className={isSelected ? "row-selected" : ""}>
                  {!isDashboard && (
                    <td>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(talent.email)}
                      />
                    </td>
                  )}

                  {/* FILE NAME */}
                  <td>
                    <div className="candidate-cell">
                      <div
                        className="avatar"
                        style={{ background: getAvatarColor(talent.fileName) }}
                      >
                        {getInitials(talent.fileName)}
                      </div>
                      <div>
                        <div className="candidate-name">
                          {talent.fileName}
                        </div>
                        <div className="candidate-email">
                          {talent.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* BATCH FORMAT */}
                  <td>{talent.batchFormat}</td>

                  {/* EXTRACT STATUS */}
                  <td>
                    <span className={`status-tag ${talent.statusClass}`}>
                      {talent.extractStatus}
                    </span>
                  </td>

                  {/* CREATED */}
                  <td>
                    <span className={`status-tag ${talent.createdClass}`}>
                      {talent.created}
                    </span>
                  </td>

                  {/* UPLOADED BY */}
                  {!isDashboard && <td>{talent.uploadedBy}</td>}

                  {/* UPLOAD DATE */}
                  <td>{talent.uploadDate}</td>

                  {/* CONFIDENCE */}
                  {!isDashboard && (
                    <td>
                      <span
                        className={`status-tag ${talent.confidenceClass}`}
                      >
                        {talent.confidence}
                      </span>
                    </td>
                  )}

                  {/* ACTIONS */}
                  <td>
                    {talent.extractStatus === "Already Resume Exits" ? (
                      <button
                        className="border-0 w-50"
                        style={{
                          background: "none",
                          cursor: "pointer",
                          color: "#ef4444",
                        }}
                        onClick={() => handleDelete(talent.employeeID)}
                        title="Delete Duplicate Draft"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    ) : (
                      <button
                        className="border-0 w-50"
                        style={{
                          background: "none",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
                          navigate(`${basePath}/review-talent`, {
                            state: { employeeID: talent.employeeID },
                          });
                        }}
                        title="View Resume"
                      >
                        <IoEyeOutline size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showDeleteModal && (
        <DeleteConfirmModal
          onClose={() => {
            setShowDeleteModal(false);
            setDeletingId(null);
          }}
          onConfirm={confirmDelete}
        />
      )}

      <style jsx>{`
        /* --- Selected Row Style (Green background) --- */
        /* Note: 'tr.row-selected td' ensures it overrides standard stripe styles */
        .custom-table tbody tr.row-selected td {
            background-color: #dcfce7 !important; /* Tailwind green-100 */
        }
        
        .custom-table tbody tr.row-selected:hover td {
             background-color: #bbf7d0 !important; /* Tailwind green-200 */
        }
      `}</style>
    </div>
  );
};

export default UploadTalentTable;
