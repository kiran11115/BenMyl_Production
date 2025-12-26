import React, { useState, useMemo } from "react";
import { MoreVertical, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { FiMoreVertical, FiChevronUp, FiChevronDown } from "react-icons/fi";
import { FaSort } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const initialTalents = [
  {
    fileName: "Johndoe-resume.pdf",
    batchFormat: ".pdf",
    extractStatus: "70%",
    statusClass: "status-blue",
    created: "Yes",
    createdClass: "status-green",
    uploadedBy: "Sarah Johnson",
    uploadDate: "15-NOV-2025",
    confidence: "60%",
    confidenceClass: "status-yellow",
    email: "john.doe@example.com",
  },
  {
    fileName: "JaneSmith-resume.pdf",
    batchFormat: ".pdf",
    extractStatus: "85%",
    statusClass: "status-blue",
    created: "Yes",
    createdClass: "status-green",
    uploadedBy: "Michael Brown",
    uploadDate: "14-NOV-2025",
    confidence: "75%",
    confidenceClass: "status-blue",
    email: "jane.smith@example.com",
  },
  {
    fileName: "MichaelJohnson-resume.pdf",
    batchFormat: ".pdf",
    extractStatus: "92%",
    statusClass: "status-green",
    created: "Yes",
    createdClass: "status-green",
    uploadedBy: "Emily Davis",
    uploadDate: "16-NOV-2025",
    confidence: "88%",
    confidenceClass: "status-teal",
    email: "michael.johnson@example.com",
  },
  {
    fileName: "AditiSharma-resumes.pdf",
    batchFormat: "Resumefiles-1/10.zip",
    extractStatus: "65%",
    statusClass: "status-yellow",
    created: "No",
    createdClass: "status-red",
    uploadedBy: "Tobias Whetton",
    uploadDate: "13-NOV-2025",
    confidence: "55%",
    confidenceClass: "status-orange",
    email: "aditi.sharma@example.com",
  },
  {
    fileName: "RohanMehta-resume.pdf",
    batchFormat: ".pdf",
    extractStatus: "78%",
    statusClass: "status-blue",
    created: "Yes",
    createdClass: "status-green",
    uploadedBy: "Sarah Johnson",
    uploadDate: "17-NOV-2025",
    confidence: "70%",
    confidenceClass: "status-blue",
    email: "rohan.mehta@example.com",
  },
  {
    fileName: "CarlosDiaz-resume.pdf",
    batchFormat: ".pdf",
    extractStatus: "81%",
    statusClass: "status-blue",
    created: "Yes",
    createdClass: "status-green",
    uploadedBy: "Laura Kim",
    uploadDate: "12-NOV-2025",
    confidence: "73%",
    confidenceClass: "status-blue",
    email: "carlos.diaz@example.com",
  },
  {
    fileName: "EmilyClark-resume.docx",
    batchFormat: ".docx",
    extractStatus: "58%",
    statusClass: "status-orange",
    created: "No",
    createdClass: "status-red",
    uploadedBy: "Mark Allen",
    uploadDate: "11-NOV-2025",
    confidence: "48%",
    confidenceClass: "status-orange",
    email: "emily.clark@example.com",
  },
  {
    fileName: "SanjayPatel-resume.pdf",
    batchFormat: ".pdf",
    extractStatus: "89%",
    statusClass: "status-green",
    created: "Yes",
    createdClass: "status-green",
    uploadedBy: "Priya Desai",
    uploadDate: "10-NOV-2025",
    confidence: "91%",
    confidenceClass: "status-teal",
    email: "sanjay.patel@example.com",
  },
  {
    fileName: "LindaNguyen-resume.zip",
    batchFormat: "Resumefiles-2/20.zip",
    extractStatus: "62%",
    statusClass: "status-yellow",
    created: "No",
    createdClass: "status-red",
    uploadedBy: "Kevin Wright",
    uploadDate: "09-NOV-2025",
    confidence: "57%",
    confidenceClass: "status-orange",
    email: "linda.nguyen@example.com",
  },
  {
    fileName: "DavidWilson-resume.pdf",
    batchFormat: ".pdf",
    extractStatus: "76%",
    statusClass: "status-blue",
    created: "Yes",
    createdClass: "status-green",
    uploadedBy: "Emily Davis",
    uploadDate: "08-NOV-2025",
    confidence: "69%",
    confidenceClass: "status-blue",
    email: "david.wilson@example.com",
  },
  {
    fileName: "FatimaAli-resume.pdf",
    batchFormat: ".pdf",
    extractStatus: "94%",
    statusClass: "status-green",
    created: "Yes",
    createdClass: "status-green",
    uploadedBy: "Sarah Johnson",
    uploadDate: "07-NOV-2025",
    confidence: "96%",
    confidenceClass: "status-teal",
    email: "fatima.ali@example.com",
  },
  {
    fileName: "GeorgeMiller-resume.docx",
    batchFormat: ".docx",
    extractStatus: "55%",
    statusClass: "status-orange",
    created: "No",
    createdClass: "status-red",
    uploadedBy: "Michael Brown",
    uploadDate: "06-NOV-2025",
    confidence: "50%",
    confidenceClass: "status-orange",
    email: "george.miller@example.com",
  },
  {
    fileName: "HiroTanaka-resume.pdf",
    batchFormat: ".pdf",
    extractStatus: "83%",
    statusClass: "status-blue",
    created: "Yes",
    createdClass: "status-green",
    uploadedBy: "Naomi Lee",
    uploadDate: "05-NOV-2025",
    confidence: "79%",
    confidenceClass: "status-blue",
    email: "hiro.tanaka@example.com",
  },
  {
    fileName: "IsabellaRossi-resume.pdf",
    batchFormat: ".pdf",
    extractStatus: "88%",
    statusClass: "status-green",
    created: "Yes",
    createdClass: "status-green",
    uploadedBy: "Tobias Whetton",
    uploadDate: "04-NOV-2025",
    confidence: "82%",
    confidenceClass: "status-teal",
    email: "isabella.rossi@example.com",
  },
  {
    fileName: "LiamOBrien-resume.zip",
    batchFormat: "Resumefiles-3/15.zip",
    extractStatus: "67%",
    statusClass: "status-yellow",
    created: "No",
    createdClass: "status-red",
    uploadedBy: "Mark Allen",
    uploadDate: "03-NOV-2025",
    confidence: "59%",
    confidenceClass: "status-orange",
    email: "liam.obrien@example.com",
  },
];


const UploadTalentTable = () => {
  const navigate = useNavigate();
  const [talents] = useState(initialTalents);
  const [selectedEmails, setSelectedEmails] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const getInitials = (name = "") =>
    name
      .split(" ")
      .slice(0, 2)
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
      <div className="table-scroll">
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
                      onClick={() => navigate("/user/review-talent")}
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
    </div>
  );
};

export default UploadTalentTable;
