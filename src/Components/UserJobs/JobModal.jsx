import React, { useState } from "react";
import { FiX, FiCheck, FiEye, FiLoader } from "react-icons/fi";
import { useGetEmployeesByTitleQuery } from "../../State-Management/Api/ProjectApiSlice";
import { useNavigate } from "react-router-dom";

// Mock Data for Talent Profiles inside Modal


const JobModal = ({ candidate, job, onClose }) => {
  const title = job?.title;

const {
  data: talents = [],
  isLoading,
  isError,
} = useGetEmployeesByTitleQuery(title);

  const [selectedTalents, setSelectedTalents] = useState([]);
  const [customNote, setCustomNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Loader state

  // Toggle selection logic for multi-select
  const handleToggleTalent = (id) => {
    if (isSubmitting) return; // Disable during submit
    setSelectedTalents((prev) =>
      prev.includes(id) ? prev.filter((tId) => tId !== id) : [...prev, id],
    );
  };
  

  const handleDone = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    // 1 second simulated API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    onClose();
  };

   const navigate = useNavigate();

   const handleProfileClick = () => {
    navigate("/user/talent-profile", {
      state: {
        employeeId: job?.id,
      },
    });
  };

   const formatMarkdownToHtml = (text) => {
  if (!text) return "";

  let formatted = text;

  // Remove first line completely
  formatted = formatted.replace(/^[^\n]*\n?/, "");

  // Convert bold
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Convert bullet points
  formatted = formatted.replace(/^\s*-\s+(.*)$/gm, "<li>$1</li>");

  if (formatted.includes("<li>")) {
    formatted = formatted.replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>");
  }

  formatted = formatted.replace(/\n/g, "<br/>");

  return formatted;
};
  
  const normalizedTalents = talents.map((t) => ({
  id: t.employeeID,
  name: `${t.firstName} ${t.lastName}`,
  role: title,
  email: t.emailAddress,
  resume: t.resumeFilePath,
  status: t.status,
  avatar: `https://ui-avatars.com/api/?name=${t.firstName}+${t.lastName}`,
}));

  return (
    <div
      className="drawer-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        zIndex: 10000,
      }}
    >
      {/* Modal Container */}
      <div
        className="card-base"
        style={{
          width: "clamp(350px, 95vw, 1000px)",
          height: "clamp(500px, 90vh, 800px)",
          maxHeight: "90vh",
          maxWidth: "95vw",
          padding: "0",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          borderRadius: "12px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#fff",
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: "clamp(16px, 2vw, 18px)",
                color: "#1e293b",
                fontWeight: 700,
              }}
            >
              Talent Allocation
            </h3>
            <p
              style={{
                margin: "4px 0 0 0",
                fontSize: "13px",
                color: "#64748b",
              }}
            >
              Assign talents to <strong>{job.company}</strong>
            </p>
          </div>
          <button
            className="close-btn"
            onClick={onClose}
            disabled={isSubmitting}
            style={{
              border: "none",
              background: "transparent",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              color: isSubmitting ? "#94a3b8" : "#64748b",
            }}
          >
            <FiX size={22} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div
          style={{ flex: 1, overflowY: "auto", padding: "24px", minHeight: 0 }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "24px",
              height: "100%",
            }}
          >
            {/* LEFT: Project Overview + Notes */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "24px" }}
            >
              {/* Project Details */}
              <div>
                <h4
                  style={{
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "#334155",
                    marginBottom: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      width: "4px",
                      height: "16px",
                      background: "#3b82f6",
                      borderRadius: "2px",
                    }}
                  ></span>
                  Project Overview
                </h4>
                <div
                  style={{
                    background: "#f8fafc",
                    padding: "20px",
                    borderRadius: "12px",
                    border: "1px solid #f1f5f9",
                  }}
                >
                  <div style={{ marginBottom: "16px" }}>
                    <h2
                      style={{
                        fontSize: "clamp(18px, 3vw, 20px)",
                        fontWeight: 700,
                        color: "#1e293b",
                        margin: "0 0 8px 0",
                      }}
                    >
                      {job.title}
                    </h2>
                    <span className="status-tag status-progress">
                      {job.type}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr",
                      gap: "16px",
                      marginBottom: "20px",
                    }}
                  >
                    <div className="d-flex gap-2">
                      <div
                        style={{
                          background: "#fff",
                          padding: "12px",
                          borderRadius: "8px",
                          border: "1px solid #e2e8f0",
                          width: "100%",
                        }}
                      >
                        <span
                          style={{
                            display: "block",
                            fontSize: "12px",
                            color: "#64748b",
                            marginBottom: "4px",
                          }}
                        >
                          Budget Rate
                        </span>
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#0f172a",
                          }}
                        >
                          {job.rateText}
                        </span>
                      </div>

                      <div
                        style={{
                          background: "#fff",
                          padding: "12px",
                          borderRadius: "8px",
                          border: "1px solid #e2e8f0",
                          width: "100%",
                        }}
                      >
                        <span
                          style={{
                            display: "block",
                            fontSize: "12px",
                            color: "#64748b",
                            marginBottom: "4px",
                          }}
                        >
                          Experience Level
                        </span>
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#0f172a",
                          }}
                        >
                          {job.experienceText}
                        </span>
                      </div>
                    </div>

                    {/* ✅ NEW */}
                    <div className="d-flex gap-2">
                      <div
                        style={{
                          background: "#fff",
                          padding: "12px",
                          borderRadius: "8px",
                          border: "1px solid #e2e8f0",
                          width: "100%",
                        }}
                      >
                        <span
                          style={{
                            display: "block",
                            fontSize: "12px",
                            color: "#64748b",
                            marginBottom: "4px",
                          }}
                        >
                          Education Level
                        </span>
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#0f172a",
                          }}
                        >
                          {job.educationLevel}
                        </span>
                      </div>

                      {/* ✅ NEW */}
                      <div
                        style={{
                          background: "#fff",
                          padding: "12px",
                          borderRadius: "8px",
                          border: "1px solid #e2e8f0",
                          width: "100%",
                        }}
                      >
                        <span
                          style={{
                            display: "block",
                            fontSize: "12px",
                            color: "#64748b",
                            marginBottom: "4px",
                          }}
                        >
                          Years of Experience
                        </span>
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#0f172a",
                          }}
                        >
                          {job.yearsOfExperience}
                        </span>
                      </div>
                    </div>
                  </div>
                  <h5
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#334155",
                      marginBottom: "8px",
                    }}
                  >
                    Description
                  </h5>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#64748b",
                      lineHeight: "1.6",
                      margin: "0 0 20px 0",
                    }}
                  >
                   {job?.description ? (
  <div
    dangerouslySetInnerHTML={{
      __html: formatMarkdownToHtml(job.description),
    }}
  />
) : (
  <p style={{ color: "#64748b" }}>
    No description available for this job.
  </p>
)}
                  </p>
                  <h5
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#334155",
                      marginBottom: "8px",
                    }}
                  >
                    Required Skills
                  </h5>
                  <div
                    className="skills-cloud"
                    style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}
                  >
                    {job.skills?.map((skill) => (
                      <span key={skill} className="status-tag status-progress">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Notes TextArea */}
              <div>
                <h4
                  style={{
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "#334155",
                    marginBottom: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      width: "4px",
                      height: "16px",
                      background: "#8b5cf6",
                      borderRadius: "2px",
                    }}
                  ></span>
                  Notes
                </h4>
                <textarea
                  placeholder="Add specific requirements or notes for this allocation..."
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  disabled={isSubmitting}
                  style={{
                    width: "100%",
                    minHeight: "120px",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    fontFamily: "inherit",
                    resize: "vertical",
                    outline: "none",
                    color: isSubmitting ? "#94a3b8" : "#334155",
                    background: isSubmitting ? "#f8fafc" : "#fff",
                  }}
                />
              </div>
            </div>

            {/* RIGHT: Talent Selection */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <h4
                  style={{
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "#334155",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    margin: 0,
                  }}
                >
                  <span
                    style={{
                      width: "4px",
                      height: "16px",
                      background: "#10b981",
                      borderRadius: "2px",
                    }}
                  ></span>
                  Select Talent
                </h4>
                <span
                  style={{
                    fontSize: "12px",
                    color: "#64748b",
                    background: "#f1f5f9",
                    padding: "2px 8px",
                    borderRadius: "12px",
                  }}
                >
                  {selectedTalents.length} Selected
                </span>
              </div>

              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  background: "#fff",
                  minHeight: 0,
                }}
              >
              {isLoading ? (
  <div style={{ padding: "20px", textAlign: "center" }}>
    Loading talents...
  </div>
) : isError ? (
  <div style={{ padding: "20px", textAlign: "center", color: "red" }}>
    Failed to load talents
  </div>
) : normalizedTalents.length === 0 ? (
  <div style={{ padding: "20px", textAlign: "center" }}>
    No talents found for this role
  </div>
) : (
  normalizedTalents.map((profile) => {
    const isSelected = selectedTalents.includes(profile.id);

    return (
      <div
        key={profile.id}
        onClick={() => handleToggleTalent(profile.id)}
        className="talent-row"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px",
          borderBottom: "1px solid #f1f5f9",
          cursor: isSubmitting ? "not-allowed" : "pointer",
          background: isSelected ? "#f0f9ff" : "transparent",
        }}
      >
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <div
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "4px",
              border: isSelected ? "none" : "2px solid #cbd5e1",
              background: isSelected ? "#3b82f6" : "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isSelected && <FiCheck size={14} color="#fff" />}
          </div>

          <img
            src={profile.avatar}
            alt={profile.name}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "1px solid #e2e8f0",
            }}
          />

          <div>
            <div style={{ fontSize: "14px", fontWeight: 600 }}>
              {profile.name}
            </div>
            <div style={{ fontSize: "12px", color: "#64748b" }}>
              {profile.role}
            </div>
          </div>
        </div>

        <button
          className="btn-primary"
          // onClick={(e) => {
          //   e.stopPropagation();
          //   alert(`Viewing profile of ${profile.name}`);
          // }}
          onClick={()=>navigate("/user/talent-profile", {
      state: {
        employeeId: profile?.id,
      },
    })}
         style={{
                          padding: "6px 12px",
                          fontSize: "12px",
                          opacity: isSubmitting ? 0.6 : 1,
                          width: "8rem",
                        }}
        >
          View Profile
        </button>
      </div>
    );
  })
)}

              </div>
            </div>
          </div>
        </div>

        {/* Footer with Loader */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "flex-end",
            background: "#fff",
            gap: "12px",
          }}
        >
          <button
            onClick={onClose}
            disabled={isSubmitting}
            style={{
              padding: "10px 24px",
              background: "#fff",
              border: "1px solid #cbd5e1",
              borderRadius: "6px",
              color: "#475569",
              fontWeight: 600,
              cursor: isSubmitting ? "not-allowed" : "pointer",
              opacity: isSubmitting ? 0.6 : 1,
            }}
          >
            Cancel
          </button>

          <button
            className="btn-primary"
            onClick={handleDone}
            disabled={isSubmitting}
            style={{
              padding: "10px 32px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              width: "12rem",
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            {isSubmitting ? (
              <>
                <FiLoader
                  className="spin"
                  style={{ animation: "spin 1s linear infinite" }}
                  size={16}
                />
                Placing Bid...
              </>
            ) : (
              "Place Bid"
            )}
          </button>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        textarea:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }
        @media (min-width: 768px) {
          .card-base > div > div {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default JobModal;
