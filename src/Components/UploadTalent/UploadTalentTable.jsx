import React, { useState, useMemo, useEffect } from "react";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import { FaSort } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useGetQueueManagementMutation } from "../../State-Management/Api/UploadResumeApiSlice";

const PAGE_SIZE = 10;
const UploadTalentTable = ({refreshKey}) => {
 const navigate = useNavigate();

  const [talents, setTalents] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [getQueueManagement, { isLoading }] =
    useGetQueueManagementMutation();

  /* ================= FETCH ================= */
  useEffect(() => {
    let isMounted = true;

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
          employeeID:item.employeeID,
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

        // ✅ Page 1 replaces, Page 2+ appends
        setTalents((prev) =>
          pageNumber === 1 ? mapped : [...prev, ...mapped]
        );

        if (mapped.length < PAGE_SIZE) {
          setHasMore(false);
        }
      } catch (err) {
        console.error("Queue fetch failed", err);
      }
    };

    fetchQueue();

    return () => {
      isMounted = false;
    };
  }, [pageNumber, getQueueManagement,refreshKey]);

  useEffect(() => {
  setPageNumber(1);
  setHasMore(true);
}, [refreshKey]);

  /* ================= SCROLL ================= */
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    if (
      scrollHeight - scrollTop <= clientHeight + 50 &&
      hasMore &&
      !isLoading
    ) {
      setPageNumber((prev) => prev + 1);
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
    const colors = ["#3b82f6", "#6366f1", "#8b5cf6", "#ec4899", "#f97316"];
    return colors[name.length % colors.length];
  };

  const sortedTalents = useMemo(() => {
    const items = [...talents];
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
  }, [talents, sortConfig]);

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
      <div className="table-scroll" onScroll={handleScroll} style={{ overflowY: "auto", maxHeight: 600 }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}></th>

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

              <th onClick={() => requestSort("uploadedBy")}>
                UPLOADED BY <SortIcon columnKey="uploadedBy" />
              </th>

              <th onClick={() => requestSort("uploadDate")}>
                UPLOAD DATE <SortIcon columnKey="uploadDate" />
              </th>

              <th onClick={() => requestSort("confidence")}>
                CONFIDENCE <SortIcon columnKey="confidence" />
              </th>

              <th>ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {isLoading && (
    <tr>
      <td colSpan={9} style={{ textAlign: "center", padding: "40px" }}>
        <span style={{ color: "#64748b", fontSize: "14px" }}>
          Loading resumes...
        </span>
      </td>
    </tr>
  )}
            {!isLoading && sortedTalents.length === 0 && (
    <tr>
      <td colSpan={9} style={{ textAlign: "center", padding: "40px" }}>
        <span style={{ color: "#64748b", fontSize: "14px" }}>
          No resumes uploaded
        </span>
      </td>
    </tr>
  )}
            {sortedTalents.map((talent, i) => {
              const isSelected = selectedEmails.has(talent.email);
              return (
                <tr key={i} className={isSelected ? "row-selected" : ""}>
                  <td>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(talent.email)}
                    />
                  </td>

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
                  <td>{talent.uploadedBy}</td>

                  {/* UPLOAD DATE */}
                  <td>{talent.uploadDate}</td>

                  {/* CONFIDENCE */}
                  <td>
                    <span
                      className={`status-tag ${talent.confidenceClass}`}
                    >
                      {talent.confidence}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td>
                    <button
                      className="border-0 w-50"
                      style={{ background: "none" }}
                      onClick={() =>
      navigate("/user/review-talent", {
        state: { employeeID: talent.employeeID },
      })
    }
                    >
                      <IoEyeOutline size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

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
