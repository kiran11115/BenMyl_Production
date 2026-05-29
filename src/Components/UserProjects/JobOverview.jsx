import React, { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiMapPin,
  FiBriefcase,
  FiHome,
  FiDollarSign,
  FiLayers,
  FiTrendingUp,
  FiBookOpen,
  FiClock,
  FiFileText,
  FiEdit,
  FiEye,
  FiCheck,
  FiUserPlus,
} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import ShareJobCard from "./ShareJobCard";
import { useLazyGetJobByIdQuery, useSendInviteNotificationMutation } from "../../State-Management/Api/TalentPoolApiSlice";
import WorkAndPreference from "./WorkAndPreference";
import { useGetJobBidsQuery } from "../../State-Management/Api/ProjectApiSlice";
import { toast } from "react-toastify";

const JobOverview = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const jobId = location.state?.jobId;
  const userId = localStorage.getItem("CompanyId");

  const [getJobById, { data }] = useLazyGetJobByIdQuery();
  const [sendInviteNotification] = useSendInviteNotificationMutation();
  const [inviteStatuses, setInviteStatuses] = useState({});
  const [selectedBidIds, setSelectedBidIds] = useState([]);
  const [isBulkInviting, setIsBulkInviting] = useState(false);

  const { data: bids = [] } = useGetJobBidsQuery(jobId, {
  skip: !jobId,
  refetchOnMountOrArgChange: true
});

  const handleToggleSelectBid = (employeeId) => {
    setSelectedBidIds(prev => 
      prev.includes(employeeId) 
        ? prev.filter(id => id !== employeeId) 
        : [...prev, employeeId]
    );
  };

  const handleSendBulkInvite = async () => {
    if (selectedBidIds.length === 0) return;
    setIsBulkInviting(true);

    try {
      const selectedBids = bids.filter(bid => selectedBidIds.includes(bid.EmployeeID));
      const companyname = localStorage.getItem("CompanyName") || "";
      const username = localStorage.getItem("UserName") || "";

      // Construct bulk arrays
      const userIds = selectedBids.map(bid => Number(bid.logUserid || bid.logUserId));
      const usernames = selectedBids.map(bid => bid.FullName);
      const employeeIds = selectedBids.map(bid => Number(bid.EmployeeID));
      const uatUserId = selectedBids[0]?.jobUserId ? Number(selectedBids[0].jobUserId) : Number(userId);

      const payload = {
        userIds,
        usernames,
        employeeIds,
        message: "Your talent has been shortlisted. Please check your mailbox.",
        uatUserId,
        uatfirstName: username,
        companyName: companyname
      };

      await sendInviteNotification(payload).unwrap();

      // Update statuses for each of the selected bids
      const newInviteStatuses = { ...inviteStatuses };
      selectedBids.forEach(bid => {
        newInviteStatuses[bid.EmployeeID] = "sent";
      });
      setInviteStatuses(newInviteStatuses);
      
      // Clear selected list
      setSelectedBidIds([]);
      toast.success(`Shortlisted invite sent to ${selectedBids.length} candidate(s) successfully!`);

      const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
      navigate(`${basePath}/user-schedule-interview`, {
        state: { preSelectedJobId: jobId }
      });
    } catch (err) {
      console.error("Bulk invite failed", err);
      toast.error("Failed to send bulk invites");
    } finally {
      setIsBulkInviting(false);
    }
  };

  const handleViewProfile = (bid) => {
    const from = location.pathname + location.search;
    const basePath = location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';

    navigate(
      `${basePath}/user-talent-profile?from=${encodeURIComponent(from)}`,
      {
        state: {
          employeeID: bid.EmployeeID,
          candidate: {
            id: bid.EmployeeID,
            name: bid.FullName,
            status: "Verified",
          },
          jobId: jobId,
        },
      }
    );
  };

  const pendingBids =
  bids?.filter((bid) => bid.IsShortlisted === false) || [];

  const handleSendInvite = async (bid) => {
    const empId = bid.EmployeeID;
    setInviteStatuses((prev) => ({ ...prev, [empId]: "loading" }));
    console.log("bidno:",bid.jobUserId)

    try {
      const companyname = localStorage.getItem("CompanyName") || "";
      const username = localStorage.getItem("UserName") || "";

      const payload = {
        userIds: [Number(bid.logUserid)],
        usernames: [bid.FullName],
        employeeIds: [Number(bid.EmployeeID)],
        message: "Your talent has been shortlisted. Please check your mailbox.",
        uatUserId: Number(bid.jobUserId),
        uatfirstName: username,
        companyName: companyname
      };

      await sendInviteNotification(payload).unwrap();

      setInviteStatuses((prev) => ({ ...prev, [empId]: "sent" }));
      toast.success(`Invite successfully sent to ${bid.FullName}!`);

      const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
      navigate(`${basePath}/user-schedule-interview`, {
        state: { preSelectedJobId: jobId }
      });
    } catch (err) {
      console.error("Invite failed", err);
      setInviteStatuses((prev) => ({ ...prev, [empId]: "idle" }));
      toast.error("Failed to send invite");
    }
  };

  useEffect(() => {
    if (jobId && userId) {
      getJobById({ jobId, userId });
    }
  }, [jobId, userId, getJobById]);

  const job = data?.[0];


  const formatPostedDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
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

  const salaryType = (() => {
  const t = (job?.salarType || "").toLowerCase();

  if (t.includes("hour") || t.includes("/hr") || t === "hourly") return "/hr";
  if (t.includes("month")) return "/month";
  if (t.includes("budget") || t.includes("fixed") || t.includes("entire")) return "Budget";

  return "/hr"; // default
})();



  return (
    <div className="jobs-container">
      {/* HEADER */}
      <div className="mb-4">
        <div className="profile-breadcrumb d-flex gap-1">
          <button
            type="button"
            className="link-button"
            onClick={() => {
              const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
              const postedJobsPath = basePath === '/Admin' ? '/Admin/admin-posted-jobs' : '/user/user-posted-jobs';
              navigate(postedJobsPath);
            }}
          >
            <FiArrowLeft /> Back to Projects
          </button>
          <span className="crumb">/ Job Overview</span>
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h2 className="drawer-header">Job Overview</h2>
            <p className="company-name">
              A complete summary of the job details and requirements
            </p>
          </div>
          <button
            className="btn-premium btn-premium-secondary"
            onClick={() => {
              const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
              navigate(`${basePath}/user-post-new-positions`, {
                state: {
                  jobId: job?.jobID,
                  jobData: job,
                  isEdit: true
                },
              });
            }}
            style={{
              padding: "8px 16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <FiEdit size={16} /> Edit Job
          </button>
        </div>
      </div>

      <div className="dashboard-layout">
        {/* LEFT MAIN CONTENT */}
        <div
          className="dashboard-column-main card-base"
          style={{ padding: "16px" }}
        >
          {/* Job Header */}
          <div className="job-card-top">
            <div className="company-icon-box large">
              <FiBriefcase size={24} />
            </div>

            <div className="job-header-info">
              <h3 className="job-title">
                {job?.jobTitle || "Senior Frontend Developer"}
              </h3>
              <p className="company-name">
                {job?.companyName || "Tech Solutions Inc."}
              </p>

              <div className="d-flex gap-3">
                <div className="meta-item">
                  <FiMapPin size={14} />
                  {job?.location || "Visakhapatnam"}
                </div>

                <div className="meta-item">
                  <FiDollarSign size={14} />
                  {job?.salaryRange_Min && job?.salaryRange_Max
  ? `${job.salaryRange_Min} - ${job.salaryRange_Max} ${salaryType}`
  : job?.salaryRange_Min
  ? `${job.salaryRange_Min} ${salaryType}`
  : ""}
                </div>

                <div className="meta-item text-orange">
                  <FiClock size={14} />
                  Posted on {formatPostedDate(job?.createdOn || job?.postedDate)}
                </div>
              </div>
            </div>
          </div>

          {/* Key Info Grid */}
          <div className="drawer-stats">
            <div className="drawer-stat-item">
              <span className="label">Employment Type</span>
              <span className="value">{job?.employeeType || "Full-time"}</span>
            </div>

            <div className="drawer-stat-item">
              <span className="label">Work Model</span>
              <span className="value">{job?.workModels || "On-site"}</span>
            </div>

            <div className="drawer-stat-item">
              <span className="label">Experience</span>
              <span className="value">
                {job?.yearsOfExperience || "NA"} years
              </span>
            </div>

            <div className="drawer-stat-item">
              <span className="label">Education</span>
              <span className="value">{job?.educationLevel || "Masters"}</span>
            </div>
          </div>

          {/* Job Description */}
          <div className="drawer-section">
            <h4>
              <FiFileText size={14} /> Job Description
            </h4>
            {job?.jobDescription ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: formatMarkdownToHtml(job.jobDescription),
                }}
              />
            ) : (
              <p style={{ color: "#64748b" }}>
                No description available for this job.
              </p>
            )}

          </div>

          {/* Skills */}
          <div className="drawer-section mt-3">
            <h4>
              <FiLayers size={14} /> Required Skills
            </h4>
            <div className="skills-cloud">
              {(
                job?.requiredSkills?.split(",") || [
                  "REACT",
                  "HTML",
                  "CSS",
                  "JAVASCRIPT",
                ]
              ).map((skill) => (
                <span key={skill.trim()} className="status-tag status-progress">
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>

          {/* Education & Experience */}
          {/* <div className="drawer-stats">
            <div className="drawer-stat-item">
              <span className="label">Education</span>
              <span className="value">{job?.educationLevel || "Masters"}</span>
            </div>

            <div className="drawer-stat-item">
              <span className="label">Years of Experience</span>
              <span className="value">
                {job?.yearsofExperience || "5"} years
              </span>
            </div>
          </div> */}
        </div>

        {/* RIGHT SIDEBAR */}
        {/* <div className="dashboard-column-side card-base filters-sidebar">
          <ShareJobCard />
          <WorkAndPreference job={job} />
        </div> */}
        <div className="dashboard-column-side">

  {/* BIDS CARD */}
  <div
    className="card-base"
    style={{
      padding: "18px",
      marginBottom: "16px",
      borderRadius: "20px",
      background: "#fff",
    }}
  >
    <div
      style={{
        marginBottom: "16px",
        borderBottom: "1px solid #eef2f7",
        paddingBottom: "12px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <h5
          style={{
            margin: 0,
            fontWeight: 700,
            fontSize: "16px",
            color: "#0f172a",
          }}
        >
          Bids From Recruiters
        </h5>

        <span
          style={{
            fontSize: "12px",
            color: "#64748b",
          }}
        >
          {pendingBids.length} Candidate(s)
        </span>
      </div>

      {/* Bulk Shortlist/Invite Button */}
      {selectedBidIds.length > 0 && (
        <button
          type="button"
          onClick={handleSendBulkInvite}
          disabled={isBulkInviting}
          style={{
            padding: "6px 14px",
            borderRadius: "20px",
            background: "linear-gradient(135deg,#7c3aed,#2563eb)",
            color: "#fff",
            fontSize: "12px",
            fontWeight: 600,
            border: "none",
            cursor: isBulkInviting ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            boxShadow: "0 4px 10px rgba(124,58,237,0.2)",
            transition: "all 0.2s ease",
          }}
        >
          {isBulkInviting ? (
            <>
              <div className="spinner-border spinner-border-sm text-light" style={{ width: "12px", height: "12px", borderWidth: "2px" }} />
              Sending...
            </>
          ) : (
            <>
              <FiUserPlus size={14} />
              Shortlist ({selectedBidIds.length})
            </>
          )}
        </button>
      )}
    </div>

    {pendingBids.length > 0 ? (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {pendingBids.map((bid) => (
          <div
            key={bid.EmployeeID}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "14px",
              border: "1px solid #eef2f7",
              borderRadius: "14px",
              background: "#fafbfc",
              transition: "all .2s ease",
            }}
          >
            {/* Selection Checkbox */}
            <input
              type="checkbox"
              checked={selectedBidIds.includes(bid.EmployeeID)}
              onChange={() => handleToggleSelectBid(bid.EmployeeID)}
              disabled={inviteStatuses[bid.EmployeeID] === "sent" || inviteStatuses[bid.EmployeeID] === "loading"}
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "4px",
                border: "1px solid #cbd5e1",
                cursor: (inviteStatuses[bid.EmployeeID] === "sent" || inviteStatuses[bid.EmployeeID] === "loading") ? "not-allowed" : "pointer",
                accentColor: "#7c3aed",
                marginRight: "4px",
              }}
            />
            {/* Avatar */}
            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg,#2563eb,#7c3aed)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "16px",
                flexShrink: 0,
              }}
            >
              {bid.FullName?.charAt(0)?.toUpperCase()}
            </div>

            {/* Content */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontWeight: 600,
                  color: "#0f172a",
                  fontSize: "14px",
                }}
              >
                {bid.FullName}
              </div>

              <div
                style={{
                  marginTop: "4px",
                  fontSize: "12px",
                  color: "#64748b",
                }}
              >
                Bidded By {bid.companyName}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* View Profile Eye Icon */}
              <button
                type="button"
                onClick={() => handleViewProfile(bid)}
                title="View Profile"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  border: "1px solid #e2e8f0",
                  background: "#ffffff",
                  color: "#64748b",
                  cursor: "pointer",
                  transition: "all 0.2s ease-in-out",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#2563eb";
                  e.currentTarget.style.borderColor = "#bfdbfe";
                  e.currentTarget.style.background = "#eff6ff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#64748b";
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.background = "#ffffff";
                }}
              >
                <FiEye size={18} />
              </button>

              {/* Shortlist/Invite Icon */}
              {/* <button
                type="button"
                onClick={() => handleSendInvite(bid)}
                disabled={inviteStatuses[bid.EmployeeID] === "loading" || inviteStatuses[bid.EmployeeID] === "sent"}
                title={inviteStatuses[bid.EmployeeID] === "sent" ? "Invite Sent" : "Shortlist & Invite"}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  border: "1px solid",
                  borderColor: inviteStatuses[bid.EmployeeID] === "sent" ? "#bbf7d0" : "#e2e8f0",
                  background: inviteStatuses[bid.EmployeeID] === "sent" ? "#f0fdf4" : "#ffffff",
                  color: inviteStatuses[bid.EmployeeID] === "sent" ? "#16a34a" : "#64748b",
                  cursor: (inviteStatuses[bid.EmployeeID] === "loading" || inviteStatuses[bid.EmployeeID] === "sent") ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease-in-out",
                }}
                onMouseEnter={(e) => {
                  if (inviteStatuses[bid.EmployeeID] !== "loading" && inviteStatuses[bid.EmployeeID] !== "sent") {
                    e.currentTarget.style.color = "#7c3aed";
                    e.currentTarget.style.borderColor = "#ddd6fe";
                    e.currentTarget.style.background = "#f5f3ff";
                  }
                }}
                onMouseLeave={(e) => {
                  if (inviteStatuses[bid.EmployeeID] !== "sent") {
                    e.currentTarget.style.color = "#64748b";
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.background = "#ffffff";
                  }
                }}
              >
                {inviteStatuses[bid.EmployeeID] === "loading" ? (
                  <div className="spinner-border spinner-border-sm text-primary" role="status" style={{ width: "16px", height: "16px", borderWidth: "2px", borderColor: "#7c3aed transparent transparent transparent" }} />
                ) : inviteStatuses[bid.EmployeeID] === "sent" ? (
                  <FiCheck size={18} />
                ) : (
                  <FiUserPlus size={18} />
                )}
              </button> */}
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div
        style={{
          textAlign: "center",
          padding: "40px 20px",
          border: "1px dashed #dbe4ee",
          borderRadius: "14px",
          background: "#f8fafc",
        }}
      >
        <div
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "#64748b",
          }}
        >
          No candidates selected for this role
        </div>

        <div
          style={{
            fontSize: "12px",
            color: "#94a3b8",
            marginTop: "6px",
          }}
        >
          Recruiter bids will appear here
        </div>
      </div>
    )}
  </div>

  {/* WORK AUTHORIZATION CARD */}
  <div className="card-base filters-sidebar">
    <WorkAndPreference job={job} />
  </div>

</div>
      </div>
    </div>
  );
};

export default JobOverview;