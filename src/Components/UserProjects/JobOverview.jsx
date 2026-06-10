import React, { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiMapPin,
  FiBriefcase,
  FiDollarSign,
  FiLayers,
  FiClock,
  FiFileText,
  FiEdit,
  FiUser,
  FiTrash2,
  FiSend,
  FiCheckCircle,
  FiEye,
  FiMail,
  FiFile,
  FiUserPlus,
  FiChevronDown,
  FiFilter,
  FiX,
  FiSearch,
  FiCalendar,
  FiCheck
} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import ShareJobCard from "./ShareJobCard";
import {
  useLazyGetJobByIdQuery,
  useTalentPoolMutation,
  useSendInviteNotificationMutation,
} from "../../State-Management/Api/TalentPoolApiSlice";
import { useGetJobBidsQuery } from "../../State-Management/Api/ProjectApiSlice";
import WorkAndPreference from "./WorkAndPreference";
import { toast } from "react-toastify";
import "./JobOverview.css";
import "../UserJobs/Jobs.css"; // Gain access to standard job-chip classes

const JobOverview = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const jobId = location.state?.jobId;
  const userId = localStorage.getItem("CompanyId");
  const companyId = localStorage.getItem("logincompanyid");

  const [getJobById, { data }] = useLazyGetJobByIdQuery();
  const [getFindTalent, { isLoading: isFindingTalent }] = useTalentPoolMutation();
  const [sendInviteNotification] = useSendInviteNotificationMutation();
  const [inviteStatuses, setInviteStatuses] = useState({});
  const [selectedBidIds, setSelectedBidIds] = useState([]);
  const [isBulkInviting, setIsBulkInviting] = useState(false);

  const [activeTab, setActiveTab] = useState("applied");
  const [candidates, setCandidates] = useState([]);
  const [shortlistedCandidates, setShortlistedCandidates] = useState([]);
  const [inviteStatus, setInviteStatus] = useState({});



  useEffect(() => {
    if (jobId && userId) {
      getJobById({ jobId, userId });
    }
  }, [jobId, userId, getJobById]);

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
      const interviewPath = window.location.pathname.toLowerCase().startsWith('/admin') ? 'admin-upcoming-interview' : 'user-upcoming-interview';
      navigate(`${basePath}/${interviewPath}`, {
        state: { preSelectedJobId: jobId }
      });
    } catch (err) {
      console.error("Bulk invite failed", err);
      toast.error("Failed to send bulk invites");
    } finally {
      setIsBulkInviting(false);
    }
  };

  const pendingBids =
    bids?.filter((bid) => bid.IsShortlisted === false) || [];

  const handleSendInvite = async (bid) => {
    const empId = bid.EmployeeID;
    setInviteStatuses((prev) => ({ ...prev, [empId]: "loading" }));
    console.log("bidno:", bid.jobUserId)

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
      const interviewPath = window.location.pathname.toLowerCase().startsWith('/admin') ? 'admin-upcoming-interview' : 'user-upcoming-interview';
      navigate(`${basePath}/${interviewPath}`, {
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


  // Helper to get initials
  const getInitials = (name = "") => {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0].toUpperCase())
      .join("");
  };

  // Fetch applied/matching candidates
  useEffect(() => {
    const fetchAppliedTalent = async () => {
      if (!job?.jobTitle || !companyId) return;

      try {
        const payload = {
          companyid: Number(companyId),
          pageNumber: 1,
          pageSize: 50,
          filters: [
            {
              filterName: "Title",
              filterOperator: "Equals",
              filterValue: [job.jobTitle],
            }
          ]
        };
        const res = await getFindTalent(payload).unwrap();
        if (Array.isArray(res) && res.length > 0) {
          setCandidates(res.map(c => ({
            id: c.employeeID,
            name: `${c.firstName} ${c.lastName}`,
            role: c.title || job.jobTitle,
            avatar: c.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.firstName)}&background=eceffd&color=6b6ff0`,
            uploadedByName: c.uploadedByName || "BenMyl Admin",
            uploaderEmail: c.uploaderEmail || "admin@benmyl.com",
            inviteUserId: c.insertBy || c.employeeID,
            experience: c.experience || "5",
            location: c.city || "Remote",
            salary: c.salary ? `$${c.salary}/hr` : "$85/hr",
            status: c.status || "AVAILABLE"
          })));
        } else {
          // Fallback search
          const fallbackRes = await getFindTalent({
            companyid: Number(companyId),
            pageNumber: 1,
            pageSize: 50,
            filters: []
          }).unwrap();

          if (Array.isArray(fallbackRes)) {
            const matching = fallbackRes.filter(c =>
              (c.title || "").toLowerCase().includes((job.jobTitle || "").toLowerCase())
            );
            const finalCandidates = matching.length > 0 ? matching : fallbackRes.slice(0, 5);
            setCandidates(finalCandidates.map(c => ({
              id: c.employeeID,
              name: `${c.firstName} ${c.lastName}`,
              role: c.title || job.jobTitle,
              avatar: c.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.firstName)}&background=eceffd&color=6b6ff0`,
              uploadedByName: c.uploadedByName || "BenMyl Admin",
              uploaderEmail: c.uploaderEmail || "admin@benmyl.com",
              inviteUserId: c.insertBy || c.employeeID,
              experience: c.experience || "6",
              location: c.city || "Dallas, TX",
              salary: c.salary ? `$${c.salary}/hr` : "$90/hr",
              status: c.status || "AVAILABLE"
            })));
          }
        }
      } catch (err) {
        console.error("Failed to fetch matching candidates", err);
      }
    };

    if (job) {
      fetchAppliedTalent();
    }
  }, [job, companyId, getFindTalent]);



  // Skill pill colors — cycles through multiple hues
  const SKILL_COLORS = [
    { bg: "#f0f0ff", color: "#4f46e5", border: "#c7d2fe" },
    { bg: "#ecfdf5", color: "#047857", border: "#a7f3d0" },
    { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
    { bg: "#fdf2f8", color: "#9d174d", border: "#fbcfe8" },
    { bg: "#fff7ed", color: "#c2410c", border: "#fed7aa" },
    { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
    { bg: "#fefce8", color: "#854d0e", border: "#fef08a" },
    { bg: "#f0f9ff", color: "#0369a1", border: "#bae6fd" },
  ];

  const getSkillColor = (index) => SKILL_COLORS[index % SKILL_COLORS.length];

  const salaryType = (() => {
    const t = (job?.salarType || "").toLowerCase();
    if (t.includes("hour") || t.includes("/hr") || t === "hourly") return "/hr";
    if (t.includes("month")) return "/month";
    if (t.includes("budget") || t.includes("fixed") || t.includes("entire")) return "Budget";
    return "/hr";
  })();

  const handleShortlist = (cand) => {
    setShortlistedCandidates(prev => [...prev, cand]);
    setCandidates(prev => prev.filter(c => c.id !== cand.id));
    toast.success(`${cand.name} shortlisted successfully!`);
  };

  const handleReject = (candId) => {
    setCandidates(prev => prev.filter(c => c.id !== candId));
    setShortlistedCandidates(prev => prev.filter(c => c.id !== candId));
    toast.info("Candidate rejected.");
  };

  const handleConnect = (cand) => {
    toast.info(
      <div>
        <p style={{ margin: "0 0 6px 0", fontSize: "12px" }}><strong>Uploader:</strong> {cand.uploadedByName}</p>
        <p style={{ margin: "0 0 10px 0", fontSize: "11px" }}>{cand.uploaderEmail}</p>
        <button
          className="btn btn-sm btn-light"
          style={{ width: "100%", fontSize: "11px", fontWeight: "bold" }}
          onClick={() => {
            navigator.clipboard.writeText(cand.uploaderEmail);
            toast.success("Copied to clipboard!");
          }}
        >
          Copy Email
        </button>
      </div>,
      { autoClose: 6000 }
    );
  };

  const handleInvite = async (cand) => {
    try {
      const companyname = localStorage.getItem("CompanyName") || "Enterprise Partner";
      const username = localStorage.getItem("UserName") || "Manager";

      const payload = {
        userIds: [Number(cand.inviteUserId)],
        usernames: [cand.name],
        employeeIds: [cand.id],
        message: `Your talent ${cand.name} has been shortlisted for ${job?.jobTitle}. Please check your mailbox.`,
        uatUserId: Number(userId),
        uatfirstName: username,
        companyName: companyname
      };

      await sendInviteNotification(payload).unwrap();
      setInviteStatus(prev => ({ ...prev, [cand.id]: new Date() }));
      toast.success(`Invitation successfully sent to ${cand.name}!`);
    } catch (err) {
      console.error("Invite failed", err);
      toast.error("Failed to send invitation.");
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

  const handleFindTalentClick = () => {
    const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
    const targetPath = window.location.pathname.toLowerCase().startsWith('/admin')
      ? `${basePath}/admin-talentpool`
      : `${basePath}/user-talentpool`;

    navigate(targetPath, {
      state: { jobTitle: job?.jobTitle }
    });
  };

  return (
    <div className="jobs-container">
      {/* HEADER */}
      <div className="hero-card mb-4">
        <FiBriefcase 
            size={240} 
            style={{
                position: 'absolute',
                right: '30%',
                top: '50%',
                transform: 'translateY(-50%) rotate(-10deg)',
                color: '#ffffff',
                opacity: 0.04,
                zIndex: 1,
                pointerEvents: 'none'
            }}
        />
        <div className="hero-left">
          <div className="hero-pill">
            ✦ Job overview
          </div>
          <h1 className="job-posting-title" style={{ position: 'relative', zIndex: 2 }}>Posted Job Overview Board</h1>
          <p className="job-posting-subtitle" style={{ position: 'relative', zIndex: 2 }}>
            A detailed overview of posted job opportunities, including role requirements, responsibilities, and hiring status.
          </p>
        </div>

        <div className="hero-buttons">
          <button
            type="button"
            className="routine-btn"
            onClick={() => {
              const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
              const targetPath = window.location.pathname.toLowerCase().startsWith('/admin') ? `${basePath}/admin-posted-jobs` : `${basePath}/user-posted-jobs`;
              navigate(targetPath);
            }}
          >
            <FiArrowLeft size={13} /> Back to Posted jobs
          </button>

          <button
            className="routine-btn"
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
          >
            <FiEdit size={13} /> Edit Job
          </button>
        </div>
      </div>

      <div className="dashboard-layout">
        {/* LEFT MAIN CONTENT */}
        <div className="dashboard-column-main card-base">
          {/* Job Header */}
          <div className="job-card-top">
            <div className="company-icon-box large">
              <FiBriefcase size={20} />
            </div>

            <div className="job-header-info">
              <h3 className="job-title">
                {job?.jobTitle || "Job Title"}
              </h3>
              <p className="company-name">
                {job?.companyName || "Company Name"}
              </p>

              <div className="d-flex gap-3">
                <div className="meta-item">
                  <FiMapPin size={12} />
                  {job?.location || "Location"}
                </div>

                <div className="meta-item">
                  <FiDollarSign size={12} />
                  {job?.salaryRange_Min && job?.salaryRange_Max
                    ? `${job.salaryRange_Min} - ${job.salaryRange_Max} ${salaryType}`
                    : job?.salaryRange_Min
                      ? `${job.salaryRange_Min} ${salaryType}`
                      : ""}
                </div>

                <div className="meta-item text-indigo">
                  <FiClock size={12} />
                  Posted on {formatPostedDate(job?.createdOn || job?.postedDate)}
                </div>
              </div>
            </div>

            {/* ── LinkedIn / Share — above stats ── */}
            <div className="jov-linkedin-bar">
              <ShareJobCard job={job} />
            </div>
          </div>

          <div className="d-flex">
            {/* ── Multi-color Stat Grid + Work Auth ── */}
            <div className="jov-auth-row">
              {/* Stat Pills Row */}
              <div className="jov-stat-pills">
                {job?.workModels && (
                  <div className="jov-stat-pill">
                    <span className="jov-auth-label">Work Model</span>
                    <span className="job-chip green">{job.workModels}</span>
                  </div>
                )}
                {(job?.yearsOfExperience || job?.yearsofExperience) && (
                  <div className="jov-stat-pill">
                    <span className="jov-auth-label">Experience</span>
                    <span className="job-chip purple">{job?.yearsOfExperience || job?.yearsofExperience} yrs</span>
                  </div>
                )}
                {job?.educationLevel && (
                  <div className="jov-stat-pill">
                    <span className="jov-auth-label">Education</span>
                    <span className="job-chip mint">{job.educationLevel}</span>
                  </div>
                )}


                {/* Work Auth Chips inline */}
                {(() => {
                  const auths = [
                    { label: "OPT", val: job?.isOPT },
                    { label: "CPT", val: job?.isCPT },
                    { label: "H1B", val: job?.isH1B },
                    { label: "EAD", val: job?.isEAD },
                    { label: "GC", val: job?.isGC },
                    { label: "H4", val: job?.isH4 },
                    { label: "US Citizen", val: job?.isUSCitizen },
                  ].filter(a => a.val === true);

                  const prefs = [
                    { label: "Corp-Corp", val: job?.isCorpToCorp },
                    { label: "W2-Perm", val: job?.isW2Permanent },
                    { label: "W2-Contract", val: job?.isW2Contract },
                    { label: "1099", val: job?.is1099Contract },
                    { label: "C2H", val: job?.isContractToHire },
                  ].filter(a => a.val === true);

                  if (!auths.length && !prefs.length) return null;
                  return (
                    <div className="d-flex gap-4 align-items-center">
                      {auths.length > 0 && (
                        <div className="jov-auth-group">
                          <span className="jov-auth-label">Work Auth</span>
                          <div className="jov-auth-chips">
                            {auths.map(a => (
                              <span key={a.label} className="job-chip orange">{a.label}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {prefs.length > 0 && (
                        <div className="jov-auth-group">
                          <span className="jov-auth-label">Employment Pref</span>
                          <div className="jov-auth-chips">
                            {prefs.map(p => (
                              <span key={p.label} className="job-chip pink">{p.label}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                  );
                })()}
              </div>
            </div>



          </div>

          {/* Job Description */}
          <div className="drawer-section">
            <h4>
              <FiFileText size={13} /> Job Description
            </h4>
            {job?.jobDescription ? (
              <div
                className="google-jd-content"
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

          {/* Skills — multi-color pills */}
          <div className="drawer-section mt-3">
            <h4>
              <FiLayers size={13} /> Required Skills
            </h4>
            <div className="skills-cloud">
              {(
                job?.requiredSkills?.split(",") || ["REACT", "HTML", "CSS", "JAVASCRIPT"]
              ).map((skill, idx) => {
                const c = getSkillColor(idx);
                return (
                  <span
                    key={skill.trim()}
                    className="job-chip orange"
                  >
                    {skill.trim()}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR - Candidates applied / Shortlisted / Sourcing */}
        {/* <div className="dashboard-column-side card-base profiles-sidebar"> */}

          {/* Content Lists */}
          {/* {activeTab === "applied" && (
            <div className="candidates-list">
              {candidates.length === 0 ? (
                <div className="no-candidates-box">
                  <FiUser size={24} style={{ color: "#94a3b8" }} />
                  <p className="no-candidates-title">No candidates have applied yet</p>
                  <button className="routine-btn-2" onClick={handleFindTalentClick}>
                    Find Talent Matching Role
                  </button>
                </div>
              ) : (
                candidates.map(cand => (
                  <div key={cand.id} className="candidate-row-card">
                    <div className="candidate-row-header">
                      {cand.avatar.startsWith("http") ? (
                        <img src={cand.avatar} alt={cand.name} className="job-company-logo" />
                      ) : (
                        <div className="job-company-logo">
                          {getInitials(cand.name)}
                        </div>
                      )}
                      <div className="candidate-meta-info">
                        <span className="candidate-name">{cand.name}</span>
                        <span className="candidate-role">{cand.role}</span>
                      </div>

                      {/* View & Connect mini buttons on the right */}
                      {/* <div style={{ display: "flex", gap: "4px" }}>
                        <button className="action-btn icon-only" onClick={() => handleViewProfile(cand)} title="View Profile">
                          <FiEye size={16} />
                        </button>
                      </div>
                    </div> */}

                    {/* Tags matching projects card layout */}
                    {/* <div className="job-tags-row" style={{ display: "flex", gap: "6px", flexWrap: "wrap", margin: "4px 0" }}>
                      <span className="job-chip purple">{cand.experience} Yrs Exp</span>
                      <span className="job-chip mint">{cand.location}</span>
                      <span className="job-chip green">{cand.salary}</span>
                    </div> */}

                    {/* <div className="candidate-actions">
                      <button className="action-btn shortlist" onClick={() => handleShortlist(cand)}>
                        Shortlist Candidate
                      </button>
                      <button className="action-btn reject icon-only" onClick={() => handleReject(cand.id)} title="Reject Candidate">
                        <FiTrash2 size={13} />
                      </button>
                    </div> */}
                  {/* </div>
                ))
              )}
            </div>
          )} */}

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
                  className="routine-btn-2"
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
                        {bid.companyName} Bid for your role.
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {/* View Profile Eye Icon */}
                      <button className="action-btn icon-only" onClick={() => handleViewProfile(bid)} title="View Profile">
                        <FiEye size={16} />
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
        </div>
      </div>
    // </div>
  );
};

export default JobOverview;