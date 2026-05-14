import React, { useState } from "react";
import {
  FiX,
  FiCopy,
  FiMapPin,
  FiLinkedin,
  FiFacebook,
  FiMail,
  FiChevronDown,
  FiChevronUp,
  FiDownload
} from "react-icons/fi";
import { FaBuilding, FaPuzzlePiece } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";
import { useLazyGetLinkedInAuthUrlQuery, useSaveHotlistImageMutation } from "../../State-Management/Api/UploadResumeApiSlice";
import { useGetCompanyProfileEditQuery } from "../../State-Management/Api/CompanyProfileApiSlice";

// Alerts
import { SubmissionErrorModal, SuccessModal } from "./Alterts";
import "./PostNewPositions.css";

export default function PreviewModal({ onClose, data, onPostJob, isEdit }) {
  const navigate = useNavigate();

  /* =========================
     STATE
  ========================= */
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [isVendorOpen, setIsVendorOpen] = useState(true);

  const [showPostPreview, setShowPostPreview] = useState(false);
  const [postPreviewLoading, setPostPreviewLoading] = useState(false);
  const [postDescription, setPostDescription] = useState("🚀 Explore your next career milestone. We are actively seeking a talented professional to drive strategic initiatives and join our dynamic team. Review the core capabilities and position overview below, and apply today to make an impact.\n\n#Hiring #CareerOpportunity #TalentAcquisition #JobOpening #ProfessionalGrowth");
  const [postLink, setPostLink] = useState("https://uat.benmyl.com/sign-in");
  const [shareToLinkedIn, setShareToLinkedIn] = useState(false);

  const [saveHotlistImage] = useSaveHotlistImageMutation();
  const [getLinkedInAuthUrl] = useLazyGetLinkedInAuthUrlQuery();

  const emailid = localStorage.getItem("Email");
  const { data: companyApiData } = useGetCompanyProfileEditQuery(emailid);
  const companyLogo = companyApiData?.companylogo;
  const companyLogoUrl = companyLogo ? `${companyLogo}?t=${Date.now()}` : null;

  const formatMarkdownToHtml = (text) => {
    if (!text) return "";

    let formatted = text.replace(/\r\n/g, '\n');

    // Convert bold **text**
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Convert bullet points
    formatted = formatted.replace(/^\s*-\s+(.*)$/gm, "<li>$1</li>");

    // Wrap consecutive <li> items inside <ul>
    formatted = formatted.replace(/(<li>.*?<\/li>(\n<li>.*?<\/li>)*)/g, "<ul>$&</ul>");

    // Convert line breaks
    formatted = formatted.replace(/\n/g, "<br/>");

    // Clean up `<br/>` tags that break list layouts
    formatted = formatted.replace(/<ul><br\/>/g, "<ul>");
    formatted = formatted.replace(/<\/li><br\/>/g, "</li>");
    formatted = formatted.replace(/<\/ul><br\/>/g, "</ul>");
    formatted = formatted.replace(/<br\/><ul>/g, "<ul>");
    formatted = formatted.replace(/<br\/><li>/g, "<li>");

    return formatted;
  };

  /* =========================
     HANDLERS
  ========================= */
  const handlePostJob = async () => {
    try {
      if (shareToLinkedIn) {
        const element = document.getElementById("post-capture-area");
        if (!element) {
          toast.warning("Please wait for the post preview to generate before posting.");
          return;
        }
      }

      setStatus("loading");

      // ✅ REAL API CALL (FROM PARENT)
      await onPostJob();

      if (shareToLinkedIn) {
        await handleLinkedInShare();
        return; // Stop execution, handleLinkedInShare will redirect the browser
      }

      // ✅ SHOW SUCCESS ALERT
      setStatus("success");
    } catch (error) {
      console.error("Post Job Failed:", error);
      setStatus("error");
    }
  };

  const handleRetry = () => {
    setStatus("idle");
    onClose();
  };

  const toggleVendorSection = () => {
    setIsVendorOpen(!isVendorOpen);
  };

  const handleCreatePost = () => {
    setShowPostPreview(true);
    setPostPreviewLoading(true);
    setTimeout(() => setPostPreviewLoading(false), 1200);
  };

  const handleClearPost = () => {
    setShowPostPreview(false);
    setPostPreviewLoading(false);
  };

  const createSquare1200Canvas = (rawCanvas) => {
    const squareCanvas = document.createElement("canvas");
    squareCanvas.width = 1200;
    squareCanvas.height = 1200;
    const ctx = squareCanvas.getContext("2d");
    
    // Fill with pristine white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 1200, 1200);
    
    // Calculate scaling to perfectly fit the raw canvas inside the 1200x1200 box without cropping
    const scale = Math.min(1200 / rawCanvas.width, 1200 / rawCanvas.height);
    const scaledWidth = rawCanvas.width * scale;
    const scaledHeight = rawCanvas.height * scale;
    
    // Center the image vertically and horizontally
    const x = (1200 - scaledWidth) / 2;
    const y = (1200 - scaledHeight) / 2;
    
    ctx.drawImage(rawCanvas, x, y, scaledWidth, scaledHeight);
    return squareCanvas;
  };

  const handleDownloadPost = async () => {
    const element = document.getElementById("post-capture-area");
    if (!element) return;
    const rawCanvas = await html2canvas(element, { 
      scale: 1.5, 
      backgroundColor: "#ffffff", 
      useCORS: true,
      windowWidth: 800,
      windowHeight: element.scrollHeight,
      width: 800,
      height: element.scrollHeight
    });
    
    const finalCanvas = createSquare1200Canvas(rawCanvas);
    
    const link = document.createElement("a");
    link.download = `${jobTitle.replace(/\s+/g, '_')}_Post.png`;
    link.href = finalCanvas.toDataURL("image/png");
    link.click();
  };

  const handleLinkedInShare = async () => {
    try {
      const element = document.getElementById("post-capture-area");

      if (!element) {
        toast.warning("Please create post preview first.");
        return;
      }

      const rawCanvas = await html2canvas(element, {
        scale: 1.5, 
        backgroundColor: "#ffffff",
        useCORS: true,
        windowWidth: 800,
        windowHeight: element.scrollHeight,
        width: 800,
        height: element.scrollHeight
      });

      const finalCanvas = createSquare1200Canvas(rawCanvas);

      const blob = await new Promise((resolve, reject) => {
        finalCanvas.toBlob((b) => {
          if (!b) reject(new Error("Image generation failed"));
          else resolve(b);
        }, "image/png");
      });

      const EmailId = localStorage.getItem("Email");

      // Clean the description to strip markdown and format nicely for LinkedIn
      const cleanDesc = description.replace(/\*\*/g, '').replace(/<[^>]*>?/gm, '');

      const linkedInText = `🚀 ${companyName} is actively seeking a ${jobTitle}!\n\n📍 Location: ${location}\n⏱️ Type: ${employmentType}\n🏢 Work Model: ${workModel}\n\n${cleanDesc}\n\nApply Securely At:\n${postLink || "techstream.jobs"}`;

      const formData = new FormData();
      formData.append("Title", `Active Opportunity: ${jobTitle} at ${companyName}`);
      formData.append(
        "Description",
        linkedInText
      );
      formData.append("File", blob, "job_post.png");
      formData.append("images", "null");
      formData.append("EmailId", EmailId || "");

      // 🔹 RTK Mutation Call
      await saveHotlistImage(formData).unwrap();

      // 🔹 RTK Lazy Query Call
      const authResponse = await getLinkedInAuthUrl().unwrap();

      if (!authResponse?.result_Message) {
        throw new Error("LinkedIn auth URL not received");
      }

      window.location.href = authResponse.result_Message;

    } catch (error) {
      console.error("LinkedIn Share Error:", error);
      toast.error(error?.data?.message || error.message || "LinkedIn share failed");
    }
  };

  /* =========================
     ALERT SCREENS
  ========================= */
  if (status === "success") {
    return <SuccessModal onClose={onClose} data={data} isEdit={isEdit} />;
  }

  if (status === "error") {
    return (
      <SubmissionErrorModal
        onClose={onClose}
        onRetry={handleRetry}
        onContactSupport={() => console.log("Support clicked")}
      />
    );
  }

  /* =========================
     DATA
  ========================= */
  const {
    jobTitle = "Senior Frontend Developer",
    companyName = "TechStream Solutions",
    location = "San Francisco, CA",
    employmentType = "Full-time",
    workModel = "Hybrid (3 days onsite)",
    salaryMin,
    salaryMax,
    currency = "USD",
    description = "",
    department = "Engineering",
    experienceLevel = "4+ years",
    skills = [],
    educationLevel = "Bachelor's degree",
    salaryType
  } = data || {};

  const salaryDisplay =
    salaryType === "entireBudget"
      ? `${salaryMin} ${currency} (Fixed)`
      : (salaryMin || salaryMax)
        ? `${salaryMin || "-"} - ${salaryMax || "-"} ${currency}`
        : "Salary Range Not Specified";

  /* =========================
     UI
  ========================= */
  return (
    <div className="modal-overlay">
      <div className="modal-window" style={{ position: "relative" }}>

        {/* LOADING OVERLAY */}
        {status === "loading" && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <div className="loading-text">Posting Job...</div>
          </div>
        )}

        <button
          className="modal-close"
          onClick={onClose}
          disabled={status === "loading"}
        >
          <FiX />
        </button>

        <div className="modal-inner">
          {/* LEFT SIDE */}
          <div className="modal-left">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1e293b", margin: 0 }}>{isEdit ? "Edit Job Preview" : "Job Preview"}</h2>
                <p className="muted small" style={{ margin: 0 }}>Review details or create post for sharing</p>
              </div>
              {!showPostPreview && (
                <button className="btn-primary" onClick={handleCreatePost}>
                  Create Post
                </button>
              )}
            </div>

            <hr className="modal-divider" />

            {showPostPreview && (
              <div className="hotlist-wrapper" style={{ border: "1px solid #e2e8f0", borderRadius: "16px", padding: "24px", background: "#ffffff", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
                {postPreviewLoading ? (
                  <div className="loading-overlay" style={{ position: "relative", minHeight: "200px" }}>
                    <div className="spinner" />
                    <div className="loading-text" style={{ marginTop: "16px", color: "#64748b", fontWeight: "500", fontSize: "14px" }}>
                      Creating post preview...
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="hotlist-actions" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                      <h3 style={{ margin: 0 }}>Post Preview</h3>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button className="btn-secondary gap-2" onClick={handleDownloadPost} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <FiDownload /> Download
                        </button>
                        <button className="btn-secondary" onClick={handleClearPost}>
                          Clear
                        </button>
                      </div>
                    </div>

                    <div className="post-preview-display">
                      <div style={{ marginBottom: "16px" }}>
                        <p style={{ fontWeight: "700", fontSize: "16px", color: "#1e293b", marginBottom: "4px", whiteSpace: "pre-wrap" }}>{postDescription}</p>
                        <p style={{ color: "#3b82f6", fontSize: "14px", margin: 0 }}>{postLink}</p>
                      </div>

                      <div style={{ width: "100%", overflowX: "auto", overflowY: "auto", maxHeight: "65vh", background: "#e8eaed", padding: "40px 0", borderRadius: "12px", border: "1px solid #dadce0" }}>
                        <div id="post-capture-area" style={{ 
                          width: "800px",
                          minHeight: "800px", // Expand dynamically if text is long
                          background: "#ffffff", 
                          position: "relative",
                          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                          color: "#202124",
                          margin: "0 auto",
                          boxShadow: "0 1px 3px 0 rgba(60,64,67,0.3), 0 4px 8px 3px rgba(60,64,67,0.15)",
                          display: "flex",
                          flexDirection: "column",
                          boxSizing: "border-box",
                          overflow: "hidden"
                        }}>
                          {/* Google Material Theme Top Accent */}
                          <div style={{ height: "6px", width: "100%", position: "relative", zIndex: 1, display: "flex" }}>
                              <div style={{ flex: 1, background: "#4285F4" }}></div>
                              <div style={{ flex: 1, background: "#EA4335" }}></div>
                              <div style={{ flex: 1, background: "#FBBC05" }}></div>
                              <div style={{ flex: 1, background: "#34A853" }}></div>
                          </div>

                          {/* Subtle Organic Gradient Orbs Background */}
                          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
                             <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(66,133,244,0.08) 0%, rgba(255,255,255,0) 70%)", borderRadius: "50%", filter: "blur(40px)" }}></div>
                             <div style={{ position: "absolute", bottom: "-150px", left: "-100px", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(52,168,83,0.06) 0%, rgba(255,255,255,0) 70%)", borderRadius: "50%", filter: "blur(60px)" }}></div>
                             <div style={{ position: "absolute", top: "40%", right: "-50px", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(234,67,53,0.05) 0%, rgba(255,255,255,0) 70%)", borderRadius: "50%", filter: "blur(30px)" }}></div>
                          </div>

                          <div style={{ padding: "60px 80px", flex: 1, display: "flex", flexDirection: "column", position: "relative", zIndex: 1 }}>
                             
                             {/* Header Area */}
                             <div style={{ textAlign: "left", marginBottom: "40px", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                                <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#ffffff", border: "1px solid #e8eaed", boxShadow: "0 1px 2px 0 rgba(60,64,67,0.05)", padding: "6px 16px", borderRadius: "20px", fontSize: "11px", fontWeight: "600", color: "#5f6368", textTransform: "uppercase", marginBottom: "24px" }}>
                                   <div style={{ width: "6px", height: "6px", background: "#34A853", borderRadius: "50%", boxShadow: "0 0 0 2px rgba(52,168,83,0.2)" }}></div>
                                   Active Opportunity
                                </div>
                                
                                <h1 style={{ margin: "0 0 20px 0", fontSize: "26px", fontWeight: "400", color: "#202124", lineHeight: "1.4" }}>
                                   <strong style={{ fontWeight: "800", color: "#5082b5" }}>{companyName}</strong> is actively seeking a <strong style={{ fontWeight: "800", color: "#485465" }}>{jobTitle}</strong>
                                </h1>
                                
                                <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "13px", color: "#5f6368", fontWeight: "500", background: "#f8f9fa", padding: "10px 16px", borderRadius: "8px", border: "1px solid #e8eaed" }}>
                                   <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                      <span style={{ color: "#4285F4", display: "flex" }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></span> {location}
                                   </span>
                                   <span style={{ width: "1px", height: "14px", background: "#dadce0" }}></span>
                                   <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                      <span style={{ color: "#FBBC05", display: "flex" }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></span> {employmentType}
                                   </span>
                                   <span style={{ width: "1px", height: "14px", background: "#dadce0" }}></span>
                                   <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                      <span style={{ color: "#EA4335", display: "flex" }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path></svg></span> {workModel}
                                   </span>
                                </div>
                             </div>

                             {/* Summarized Metrics Format */}
                             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#ffffff", border: "1px solid #e8eaed", boxShadow: "0 1px 3px 0 rgba(60,64,67,0.08)", padding: "20px 24px", borderRadius: "12px", marginBottom: "40px" }}>
                                 <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                     <div style={{ fontSize: "11px", color: "#5f6368", fontWeight: "600", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "6px" }}>
                                        <div style={{ width: "6px", height: "6px", background: "#4285F4", borderRadius: "2px" }}></div> Experience
                                     </div>
                                     <div style={{ fontSize: "15px", color: "#202124", fontWeight: "700" }}>{experienceLevel}</div>
                                 </div>
                                 
                                 <div style={{ width: "1px", height: "32px", background: "#dadce0" }}></div>

                                 <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                     <div style={{ fontSize: "11px", color: "#5f6368", fontWeight: "600", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "6px" }}>
                                        <div style={{ width: "6px", height: "6px", background: "#EA4335", borderRadius: "2px" }}></div> Education
                                     </div>
                                     <div style={{ fontSize: "15px", color: "#202124", fontWeight: "700" }}>{educationLevel}</div>
                                 </div>

                                 <div style={{ width: "1px", height: "32px", background: "#dadce0" }}></div>

                                 <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                     <div style={{ fontSize: "11px", color: "#5f6368", fontWeight: "600", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "6px" }}>
                                        <div style={{ width: "6px", height: "6px", background: "#34A853", borderRadius: "2px" }}></div> Compensation
                                     </div>
                                     <div style={{ fontSize: "15px", color: "#202124", fontWeight: "700" }}>{salaryDisplay !== "Salary Range Not Specified" ? salaryDisplay : "Competitive"}</div>
                                 </div>
                             </div>

                             {/* Section I: Position Overview */}
                             <div style={{ marginBottom: "40px", position: "relative" }}>
                                <div style={{ position: "absolute", left: "-20px", top: "4px", bottom: 0, width: "3px", background: "#e8eaed", borderRadius: "2px" }}></div>
                                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#202124", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "10px" }}>
                                   <div style={{ width: "24px", height: "24px", background: "#e8f0fe", color: "#1a73e8", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "800" }}>1</div>
                                   Position Overview
                                </h3>
                                <style>{`
                                  .job-description-content p { margin-top: 0; margin-bottom: 8px; }
                                  .job-description-content p:last-child { margin-bottom: 0; }
                                  .job-description-content ul, .job-description-content ol { margin-top: 4px; margin-bottom: 16px; padding-left: 20px; }
                                  .job-description-content li { margin-bottom: 4px; line-height: 1.6; }
                                  .job-description-content strong { color: #202124; font-weight: 600; display: inline-block; margin-top: 8px; margin-bottom: 4px; }
                                  .job-description-content h1, .job-description-content h2, .job-description-content h3, .job-description-content h4 { margin-top: 16px; margin-bottom: 8px; color: #202124; font-size: 15px; font-weight: 700; }
                                `}</style>
                                <div className="job-description-content" style={{ margin: "0", fontSize: "14px", lineHeight: "1.7", color: "#5f6368", fontWeight: "400" }}
                                     dangerouslySetInnerHTML={{ __html: formatMarkdownToHtml(description) || `We are actively seeking a highly skilled professional to join our team in the ${department} department.` }} />
                             </div>

                             {/* Section II: Core Capabilities */}
                             <div style={{ marginBottom: "40px", position: "relative" }}>
                                <div style={{ position: "absolute", left: "-20px", top: "4px", bottom: 0, width: "3px", background: "#e8eaed", borderRadius: "2px" }}></div>
                                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#202124", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "10px" }}>
                                   <div style={{ width: "24px", height: "24px", background: "#fce8e6", color: "#d93025", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "800" }}>2</div>
                                   Core Capabilities
                                </h3>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                                   {skills.slice(0, 8).map((skill, index) => (
                                      <div key={index} style={{ background: "#ffffff", border: "1px solid #dadce0", color: "#3c4043", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", boxShadow: "0 1px 2px rgba(60,64,67,0.05)" }}>
                                         {skill}
                                      </div>
                                   ))}
                                   {skills.length > 8 && (
                                      <div style={{ background: "#f8f9fa", border: "1px dashed #dadce0", color: "#5f6368", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "600" }}>
                                         +{skills.length - 8} more
                                      </div>
                                   )}
                                </div>
                             </div>
                          </div>
                          
                              <div style={{ marginTop: "20px", borderTop: "1px solid #e8eaed", paddingTop: "30px", textAlign: "center" }}>
                                 <div style={{ fontSize: "14px", color: "#5f6368", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                    Apply securely at: <span style={{ color: "#1a73e8", fontWeight: "700", marginLeft: "4px" }}>{postLink ? new URL(postLink).hostname : "techstream.jobs"}</span>
                                 </div>
                              </div>
                           </div>
                        </div>
                      </div>
              
                  </>
                )}
              </div>
            )}

            {!showPostPreview && (
              <>
                <div className="job-details-container" style={{ maxHeight: "350px", overflowY: "auto", paddingRight: "8px" }}>
                  <div className="modal-top-row">
                    <div className="modal-badge icon">
                      <FaBuilding size={18} />
                    </div>
                    <div>
                      <h2 className="modal-job-title">{jobTitle}</h2>
                      <div className="muted small">{companyName}</div>

                      <div className="modal-tags-row">
                        <span className="tag small">
                          <FiMapPin /> {location}
                        </span>
                        <span className="tag small">{employmentType}</span>
                        <span className="tag small">{workModel}</span>
                        <span className="tag small">{salaryDisplay}</span>
                      </div>
                    </div>
                  </div>

                  <hr className="modal-divider" />

                  <div className="req-grid">
                    <div>
                      <div className="req-label">Experience</div>
                      <div className="req-value">{experienceLevel}</div>
                    </div>
                    <div>
                      <div className="req-label">Department</div>
                      <div className="req-value">{department}</div>
                    </div>
                    <div>
                      <div className="req-label">Education</div>
                      <div className="req-value">{educationLevel}</div>
                    </div>
                  </div>

                  <h4 className="modal-subtitle" style={{ marginTop: 16 }}>
                    Skills
                  </h4>

                  <div className="status-tag status-progress">
                    {skills.length ? (
                      skills.map((skill) => (
                        <span key={skill} className="status-tag status-progress">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="muted small">No skills provided</span>
                    )}
                  </div>

                  <h4 className="modal-subtitle" style={{ marginTop: 18 }}>
                    Job Description
                  </h4>

                  <div className="modal-description">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: formatMarkdownToHtml(description),
                      }}
                    />
                  </div>
                </div>

                <div className="talent-selection-description" style={{ marginTop: "24px", padding: "20px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                  <div style={{ marginBottom: "16px" }}>
                    <label className="desc-label" style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#64748b", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Post Description</label>
                    <textarea
                      className="desc-textarea"
                      value={postDescription}
                      onChange={(e) => setPostDescription(e.target.value)}
                      placeholder="Enter post description..."
                      style={{ width: "100%", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", color: "#1e293b", padding: "12px", minHeight: "80px", resize: "vertical", boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <label className="desc-label" style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#64748b", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Post Link</label>
                    <input
                      type="text"
                      className="desc-input"
                      value={postLink}
                      readOnly
                      style={{ width: "100%", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", padding: "10px 12px", backgroundColor: "#f1f5f9", color: "#3b82f6", cursor: "not-allowed", fontWeight: "500", boxSizing: "border-box" }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* RIGHT SIDE */}
          <aside className="modal-right">
            <div className="share-card">
              <h4 className="share-title">Share this Job</h4>

              <div className="share-input-group">
                <label className="input-label">Job Link</label>
                <div className="share-link-row">
                  <input
                    className="share-input"
                    readOnly
                    value={`https://uat.benmyl.com/sign-in`}
                  />
                  <button className="copy-btn">
                    <FiCopy /> Copy
                  </button>
                </div>
              </div>

              <div className="social-buttons-stack" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <label className="social-btn linkedin" style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", background: shareToLinkedIn ? "#e8f0fe" : "#ffffff", border: shareToLinkedIn ? "1px solid #1a73e8" : "1px solid #dadce0", padding: "12px 16px", borderRadius: "8px", transition: "all 0.2s ease" }}>
                  <input 
                    type="checkbox" 
                    checked={shareToLinkedIn} 
                    onChange={(e) => {
                      setShareToLinkedIn(e.target.checked);
                      if (e.target.checked && !showPostPreview) {
                        handleCreatePost();
                      }
                    }} 
                    style={{ width: "18px", height: "18px", cursor: "pointer", accentColor: "#0a66c2", margin: 0 }} 
                  />
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
                     <FiLinkedin style={{ color: "#0a66c2", fontSize: "20px" }} /> <span style={{ fontWeight: "600", color: "#202124", fontSize: "14px" }}>Share on LinkedIn</span>
                  </div>
                </label>

                <label className="social-btn facebook" style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "not-allowed", opacity: 0.5, filter: "grayscale(1)", background: "#ffffff", border: "1px solid #dadce0", padding: "12px 16px", borderRadius: "8px" }}>
                  <input type="checkbox" disabled style={{ width: "18px", height: "18px", margin: 0 }} />
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
                     <FiFacebook style={{ fontSize: "20px" }} /> <span style={{ fontWeight: "500", color: "#5f6368", fontSize: "14px" }}>Share on Facebook</span>
                  </div>
                </label>

                <label className="social-btn email" style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "not-allowed", opacity: 0.5, filter: "grayscale(1)", background: "#ffffff", border: "1px solid #dadce0", padding: "12px 16px", borderRadius: "8px" }}>
                  <input type="checkbox" disabled style={{ width: "18px", height: "18px", margin: 0 }} />
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
                     <FiMail style={{ fontSize: "20px" }} /> <span style={{ fontWeight: "500", color: "#5f6368", fontSize: "14px" }}>Share via Email</span>
                  </div>
                </label>
              </div>

              <div className="vendor-section">
                <button className="vendor-header" onClick={toggleVendorSection}>
                  <div className="vendor-header-left">
                    <FaPuzzlePiece className="puzzle-icon" />
                    <span>Share with</span>
                  </div>
                  {isVendorOpen ? <FiChevronUp /> : <FiChevronDown />}
                </button>

                {isVendorOpen && (
                  <div className="vendor-list">
                    <label className="checkbox-row">
                      <input type="checkbox" /> Premier Staffing Agency
                    </label>
                    <label className="checkbox-row">
                      <input type="checkbox" defaultChecked /> Tech Talent Finders
                    </label>
                    <label className="checkbox-row">
                      <input type="checkbox" defaultChecked /> DevHunters
                    </label>
                    <label className="checkbox-row">
                      <input type="checkbox" /> CodeSeeker Recruiting
                    </label>
                    <label className="checkbox-row">
                      <input type="checkbox" defaultChecked /> Elite Tech Staffing
                    </label>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="modal-actions-left gap-3" style={{ padding: 24 }}>
          <button
            className="btn-secondary"
            onClick={onClose}
            disabled={status === "loading"}
          >
            Back to Edit
          </button>

          <button
            className="btn-primary"
            style={{ width: 165 }}
            onClick={handlePostJob}
            disabled={status === "loading"}
          >
            {isEdit ? "Update Job" : "Post Job"}
          </button>
        </div>
      </div>
    </div>
  );
}
