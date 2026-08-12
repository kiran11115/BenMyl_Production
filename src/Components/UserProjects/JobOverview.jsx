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
  FiCheck,
  FiLinkedin
} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import ShareJobCard from "./ShareJobCard";
import {
  useLazyGetJobByIdQuery,
  useLazyGetJobPostingINDByIdQuery,
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
  const countryRegistration = Number(localStorage.getItem("countryRegistration") || 1);
  const isIND = countryRegistration === 2;

  const [getJobById, { data: usData }] = useLazyGetJobByIdQuery();
  const [getJobPostingINDById, { data: indData }] = useLazyGetJobPostingINDByIdQuery();
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
      if (isIND) {
        getJobPostingINDById({ jobId, userId });
      } else {
        getJobById({ jobId, userId });
      }
    }
  }, [jobId, userId, isIND, getJobById, getJobPostingINDById]);

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
        companyName: companyname,
        jobid: job?.jobID ?? jobId,
        jobName: job?.jobTitle,
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
        state: { 
          openDrawer: true, 
          preSelectedJobId: jobId,
          preSelectedCandidateId: selectedBids.length === 1 ? selectedBids[0].EmployeeID : null
        }
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
        state: { 
          openDrawer: true, 
          preSelectedJobId: jobId,
          preSelectedCandidateId: bid.EmployeeID
        }
      });
    } catch (err) {
      console.error("Invite failed", err);
      setInviteStatuses((prev) => ({ ...prev, [empId]: "idle" }));
      toast.error("Failed to send invite");
    }
  };

  const rawJobData = isIND ? indData : usData;
  const job = Array.isArray(rawJobData)
    ? (rawJobData.find(j => Number(j.jobId || j.jobID) === Number(jobId)) || rawJobData[0])
    : rawJobData;

  const isLinkedin = Boolean(
    job?.islinkedin ?? job?.isLinkedin ?? job?.Islinkedin ?? job?.IsLinkedin ?? location.state?.jobData?.islinkedin ?? location.state?.jobData?.isLinkedin ?? location.state?.jobData?.Islinkedin ?? location.state?.jobData?.IsLinkedin ?? false
  );

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
  const t = (job?.salaryType || "").toLowerCase();

  if (t.includes("hour") || t.includes("/hr") || t === "hourly")
    return "/hr";

  if (t.includes("month"))
    return "/month";

  if (
    t.includes("budget") ||
    t.includes("fixed") ||
    t.includes("entirebudget")
  )
    return "Budget";

  return "";
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
        companyName: companyname,

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
          fromJobOverview: true,
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
      <div className="hero-section-wrapper mb-4">
        <div className="hero-card ">
          <div className="hero-concentric-lines"></div>
          <div className="hero-ripple-pattern"></div>
          <div className="hero-circular-highlights"></div>
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
                <div className="hero-illustration">
            <div className="hero-particles">
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
            </div>
            {/* <img src="/Images/Dashboard.png" alt="Dashboard Illustration" className="hero-svg-image" /> */}
          </div>
        </div>
      </div>

      <div className="dashboard-layout">
        {/* LEFT MAIN CONTENT */}
        <div className="dashboard-column-main job-overview-premium-card" style={{ padding: '20px', borderRadius: '12px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          {/* Job Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ width: '44px', height: '44px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a' }}>
                <FiBriefcase size={20} strokeWidth={1.5} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.01em', lineHeight: '1.2' }}>
                  {job?.jobTitle || "Job Title"}
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#475569', fontWeight: '500' }}>
                  {job?.companyName || "Company Name"}
                </p>

                <div style={{ display: 'flex', gap: '14px', fontSize: '12px', color: '#64748b', fontWeight: '400', marginTop: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FiMapPin size={13} color="#94a3b8" />
                    {job?.location || [job?.city, job?.state, job?.country].filter(Boolean).join(", ") || "Location"}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FiDollarSign size={13} color="#94a3b8" />
                    {(() => {
                      const minSal = job?.minSalary ?? job?.salaryRange_Min;
                      const maxSal = job?.maxSalary ?? job?.salaryRange_Max;
                      const currSym = job?.currency === "INR" ? "₹" : (job?.currency === "USD" ? "$" : (job?.currency || "$"));
                      if (minSal && maxSal) return `${currSym}${minSal} - ${currSym}${maxSal} ${salaryType}`;
                      if (minSal) return `${currSym}${minSal} ${salaryType}`;
                      return "Not Disclosed";
                    })()}
                  </div>

                  {(job?.createdOn || job?.postedDate || job?.createdDate) && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FiClock size={13} color="#94a3b8" />
                      Posted {formatPostedDate(job?.createdOn || job?.postedDate || job?.createdDate)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {isLinkedin && (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 14px",
                    borderRadius: "8px",
                    background: "#f0f7ff",
                    border: "1px solid #cce4f7",
                    color: "#0a66c2",
                    fontSize: "13px",
                    fontWeight: "600",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  <FiLinkedin size={16} color="#0a66c2" />
                  <span>Shared on LinkedIn</span>
                </div>
              )}

              {(!bids || !bids.some((bid) => bid.IsShortlisted)) && (
                <button
                  className="routine-btn-2"
                  onClick={handleFindTalentClick}
                >
                  <FiSearch size={14} style={{ marginRight: "6px" }} />
                  Find Talent
                </button>
              )}
            </div>
          </div>

          {/* Grid of Key Info */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9', marginBottom: '16px' }}>
            {(job?.workMode || job?.workModels) && (
              <div>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '600', marginBottom: '4px' }}>Work Model</div>
                <div style={{ fontSize: '13px', color: '#0f172a', fontWeight: '500' }}>{job.workMode || job.workModels}</div>
              </div>
            )}
            {(job?.experienceRequired !== undefined || job?.yearsOfExperience || job?.yearsofExperience) && (
              <div>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '600', marginBottom: '4px' }}>Experience</div>
                <div style={{ fontSize: '13px', color: '#0f172a', fontWeight: '500' }}>{job?.experienceRequired ?? job?.yearsOfExperience ?? job?.yearsofExperience} {String(job?.experienceRequired ?? job?.yearsOfExperience ?? job?.yearsofExperience).toLowerCase().includes('yr') ? '' : 'Yrs'}</div>
              </div>
            )}
            {(job?.education || job?.educationLevel || job?.highestQualification) && (
              <div>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '600', marginBottom: '4px' }}>Education</div>
                <div style={{ fontSize: '13px', color: '#0f172a', fontWeight: '500' }}>{job.education || job.educationLevel || job.highestQualification}</div>
              </div>
            )}
            {job?.numberOfOpenings && (
              <div>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '600', marginBottom: '4px' }}>Openings</div>
                <div style={{ fontSize: '13px', color: '#0f172a', fontWeight: '500' }}>{job.numberOfOpenings}</div>
              </div>
            )}
            {job?.noticePeriod && (
              <div>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '600', marginBottom: '4px' }}>Notice Period</div>
                <div style={{ fontSize: '13px', color: '#0f172a', fontWeight: '500' }}>{job.noticePeriod}</div>
              </div>
            )}
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
              if(auths.length === 0) return null;
              return (
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '600', marginBottom: '4px' }}>Work Auth</div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {auths.map(a => (
                      <span key={a.label} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '500' }}>{a.label}</span>
                    ))}
                  </div>
                </div>
              );
            })()}
            {(() => {
              const prefs = [
                { label: "Corp-Corp", val: job?.isCorpToCorp },
                { label: "W2-Perm", val: job?.isW2Permanent },
                { label: "W2-Contract", val: job?.isW2Contract },
                { label: "1099", val: job?.is1099Contract },
                { label: "C2H", val: job?.isContractToHire },
              ].filter(a => a.val === true);
              if(prefs.length === 0) return null;
              return (
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '600', marginBottom: '4px' }}>Emp Preference</div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {prefs.map(p => (
                      <span key={p.label} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '500' }}>{p.label}</span>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Job Description */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '10px' }}>
              Job Description
            </h4>
            {(job?.jobSummary || job?.jobDescription) ? (
              <div
                className="google-jd-content premium-jd-content"
                style={{ color: '#334155', lineHeight: '1.6', fontSize: '13px' }}
                dangerouslySetInnerHTML={{
                  __html: formatMarkdownToHtml(job.jobSummary || job.jobDescription),
                }}
              />
            ) : (
              <p style={{ color: "#64748b", fontStyle: 'italic', fontSize: '13px' }}>
                No description available for this job.
              </p>
            )}
          </div>

          {/* Skills */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '10px' }}>
              Required Skills
            </h4>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {(
                job?.requiredSkills?.split(",") || ["REACT", "HTML", "CSS", "JAVASCRIPT"]
              ).map((skill, idx) => (
                <span key={idx} style={{ 
                  background: '#f1f5f9', 
                  color: '#334155', 
                  padding: '4px 10px', 
                  borderRadius: '6px', 
                  fontSize: '11.5px', 
                  fontWeight: '500', 
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.01)'
                }}>
                  {skill.trim()}
                </span>
              ))}
              {(!job?.requiredSkills) && (
                <span style={{ color: '#64748b', fontStyle: 'italic', fontSize: '12px' }}>Not specified</span>
              )}
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
                      {bid.companyName}
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