import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";
import {
  FiX,
  FiMapPin,
  FiLinkedin,
  FiFacebook,
  FiMail,
  FiTrash2,
  FiDownload,
  FiShare2,
  FiUsers,
  FiChevronRight,
  FiEye,
  FiLock,
  FiClock,
  FiCheck,
  FiChevronLeft,
  FiZap,
  FiCpu
} from "react-icons/fi";
import { GiCheckMark } from "react-icons/gi";
import {
  useLazyGetLinkedInAuthUrlQuery,
  useSaveHotlistImageMutation,
} from "../../State-Management/Api/UploadResumeApiSlice";

/* ─── Template Definitions ─── */
const TEMPLATES = [
  {
    id: "classic",
    name: "Classic Table",
    tag: "Free",
    tagType: "free",
    desc: "Clean rows with branded header",
  },
  {
    id: "darkpro",
    name: "Dark Pro",
    tag: "Free",
    tagType: "free",
    desc: "Sleek dark-mode grid layout",
  },
  {
    id: "cards",
    name: "Pro Cards",
    tag: "Pro",
    tagType: "subscription",
    desc: "Premium card-based layout",
  },
  {
    id: "timeline",
    name: "Timeline",
    tag: "Soon",
    tagType: "soon",
    desc: "Visual timeline format",
  },
];

/* ─── Template Previews (mini thumbnails) ─── */
function TemplateMini({ id }) {
  if (id === "classic")
    return (
      <div style={{ width: "100%", height: "100%", background: "#fff", borderRadius: 6, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ background: "#f5810c", height: 14, display: "flex", alignItems: "center", paddingLeft: 6, gap: 3 }}>
          {[1,2,3].map(i => <div key={i} style={{ width: 16, height: 4, background: "rgba(255,255,255,0.4)", borderRadius: 2 }} />)}
        </div>
        {[1,2,3].map(i => (
          <div key={i} style={{ display: "flex", gap: 3, padding: "3px 6px", borderBottom: "1px solid #f1f5f9" }}>
            {[1,2,3,4].map(j => <div key={j} style={{ flex: 1, height: 4, background: i === 1 ? "#e2e8f0" : "#f8fafc", borderRadius: 2 }} />)}
          </div>
        ))}
      </div>
    );

  if (id === "darkpro")
    return (
      <div style={{ width: "100%", height: "100%", background: "#0f172a", borderRadius: 6, overflow: "hidden", display: "flex", flexDirection: "column", padding: 5, gap: 4, boxSizing: "border-box" }}>
        <div style={{ display: "flex", gap: 3 }}>
          {[1,2].map(i => (
            <div key={i} style={{ flex: 1, background: "#1e293b", borderRadius: 4, padding: 4, border: "1px solid #334155" }}>
              <div style={{ width: "60%", height: 4, background: "#f5810c", borderRadius: 2, marginBottom: 3 }} />
              <div style={{ width: "90%", height: 3, background: "#334155", borderRadius: 2 }} />
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 3 }}>
          {[1,2].map(i => (
            <div key={i} style={{ flex: 1, background: "#1e293b", borderRadius: 4, padding: 4, border: "1px solid #334155" }}>
              <div style={{ width: "60%", height: 4, background: "#5B5BD6", borderRadius: 2, marginBottom: 3 }} />
              <div style={{ width: "90%", height: 3, background: "#334155", borderRadius: 2 }} />
            </div>
          ))}
        </div>
      </div>
    );

  if (id === "cards")
    return (
      <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#667eea,#764ba2)", borderRadius: 6, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5, padding: 5, boxSizing: "border-box" }}>
        {[1, 2].map(i => (
          <div key={i} style={{ width: "90%", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)", borderRadius: 5, padding: "4px 6px", display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "rgba(255,255,255,0.5)", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ width: "70%", height: 3, background: "rgba(255,255,255,0.7)", borderRadius: 2, marginBottom: 2 }} />
              <div style={{ width: "50%", height: 2, background: "rgba(255,255,255,0.4)", borderRadius: 2 }} />
            </div>
          </div>
        ))}
      </div>
    );

  if (id === "timeline")
    return (
      <div style={{ width: "100%", height: "100%", background: "#f8fafc", borderRadius: 6, display: "flex", flexDirection: "column", padding: 6, gap: 5, boxSizing: "border-box" }}>
        {[1,2,3].map(i => (
          <div key={i} style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: i === 1 ? "#f5810c" : "#e2e8f0", flexShrink: 0, border: i !== 1 ? "1px solid #cbd5e1" : "none" }} />
            <div style={{ flex: 1, height: 4, background: i === 1 ? "#fed7aa" : "#f1f5f9", borderRadius: 2 }} />
          </div>
        ))}
      </div>
    );

  return null;
}

/* ─── Canvas Template Renderers ─── */
function ClassicTemplate({ talents, description, link }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Description outside capture area */}
      {description && (
        <div style={{ padding: "12px 16px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8 }}>
          <p style={{ fontSize: 12, color: "#334155", fontWeight: 500, margin: 0, lineHeight: 1.5 }}>{description}</p>
          {link && <p style={{ fontSize: 11, color: "#3b82f6", margin: "6px 0 0 0", fontWeight: 600 }}>🔗 {link}</p>}
        </div>
      )}

      {/* Captured Image Area */}
      <div id="post-capture-area" style={{ background: "#ffffff", borderRadius: 8, overflow: "hidden", fontFamily: "Inter, system-ui, sans-serif", border: "1px solid #e2e8f0", width: "100%" }}>
        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #3b82f6, #5B5BD6)", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 14, letterSpacing: "-0.3px" }}>Talent Hotlist</div>
            <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 10, marginTop: 2 }}>Available bench professionals</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 6, padding: "4px 8px", color: "#fff", fontSize: 10, fontWeight: 700 }}>
            {talents.length} Profiles
          </div>
        </div>

        {/* Table */}
        <table className="hotlist-table" style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12 }}>
          <thead>
            <tr>
              <th style={{ background: "#f1f5f9", color: "#64748b", padding: "10px 16px", borderBottom: "1px solid #e2e8f0", textAlign: "left", fontWeight: 600, textTransform: "uppercase", fontSize: 9, letterSpacing: "0.05em" }}>Name</th>
              <th style={{ background: "#f1f5f9", color: "#64748b", padding: "10px 16px", borderBottom: "1px solid #e2e8f0", textAlign: "left", fontWeight: 600, textTransform: "uppercase", fontSize: 9, letterSpacing: "0.05em" }}>Technology</th>
              <th style={{ background: "#f1f5f9", color: "#64748b", padding: "10px 16px", borderBottom: "1px solid #e2e8f0", textAlign: "left", fontWeight: 600, textTransform: "uppercase", fontSize: 9, letterSpacing: "0.05em" }}>Experience</th>
              <th style={{ background: "#f1f5f9", color: "#64748b", padding: "10px 16px", borderBottom: "1px solid #e2e8f0", textAlign: "left", fontWeight: 600, textTransform: "uppercase", fontSize: 9, letterSpacing: "0.05em" }}>Location</th>
              <th style={{ background: "#f1f5f9", color: "#64748b", padding: "10px 16px", borderBottom: "1px solid #e2e8f0", textAlign: "left", fontWeight: 600, textTransform: "uppercase", fontSize: 9, letterSpacing: "0.05em" }}>Visa</th>
              <th style={{ background: "#f1f5f9", color: "#64748b", padding: "10px 16px", borderBottom: "1px solid #e2e8f0", textAlign: "left", fontWeight: 600, textTransform: "uppercase", fontSize: 9, letterSpacing: "0.05em" }}>Relocation</th>
            </tr>
          </thead>
          <tbody>
            {talents.map((t, i) => (
              <tr key={t.id} style={{ background: i % 2 === 0 ? "#ffffff" : "#fafafa" }}>
                <td style={{ padding: "10px 16px", borderBottom: "1px solid #f1f5f9", color: "#0f172a", fontWeight: 600, fontSize: 11 }}>{t.name}</td>
                <td style={{ padding: "10px 16px", borderBottom: "1px solid #f1f5f9", color: "#3b82f6", fontWeight: 600, fontSize: 11 }}>{t.role}</td>
                <td style={{ padding: "10px 16px", borderBottom: "1px solid #f1f5f9", color: "#475569", fontWeight: 500, fontSize: 11 }}>{t.experience}</td>
                <td style={{ padding: "10px 16px", borderBottom: "1px solid #f1f5f9", color: "#475569", fontWeight: 500, fontSize: 11 }}>{t.location}</td>
                <td style={{ padding: "10px 16px", borderBottom: "1px solid #f1f5f9", fontSize: 11 }}>
                  <span style={{ background: "#eff6ff", color: "#3b82f6", border: "1px solid #bfdbfe", borderRadius: 4, padding: "2px 6px", fontSize: 9, fontWeight: 700 }}>{t.visa || "H1B"}</span>
                </td>
                <td style={{ padding: "10px 16px", borderBottom: "1px solid #f1f5f9", fontSize: 11 }}>
                  <span style={{ background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", borderRadius: 4, padding: "2px 6px", fontSize: 9, fontWeight: 700 }}>{t.relocation || "Yes"}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div style={{ padding: "10px 20px", background: "#f8fafc", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "flex-end" }}>
          <span style={{ fontSize: 9, color: "#94a3b8", fontWeight: 500 }}>Powered by BenMyl · react.benmyl.com</span>
        </div>
      </div>
    </div>
  );
}

function DarkProTemplate({ talents, description, link }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Description outside capture area */}
      {description && (
        <div style={{ padding: "12px 16px", background: "#1e293b", border: "1px solid #334155", borderRadius: 8 }}>
          <p style={{ fontSize: 12, color: "#cbd5e1", fontWeight: 500, margin: 0, lineHeight: 1.5 }}>{description}</p>
          {link && <p style={{ fontSize: 11, color: "#60a5fa", margin: "6px 0 0 0", fontWeight: 600 }}>🔗 {link}</p>}
        </div>
      )}

      {/* Captured Image Area */}
      <div id="post-capture-area" style={{ background: "#0f172a", borderRadius: 8, overflow: "hidden", fontFamily: "Inter, system-ui, sans-serif", border: "1px solid #1e293b", width: "100%" }}>
        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "space-between", background: "linear-gradient(135deg, #0f172a, #1e293b)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div>
              <div style={{ color: "#f8fafc", fontWeight: 800, fontSize: 13 }}>Talent Hotlist</div>
              <div style={{ color: "#94a3b8", fontSize: 9 }}>Bench professionals ready to deploy</div>
            </div>
          </div>
          <div style={{ background: "#1e293b", borderRadius: 6, padding: "4px 10px", color: "#3b82f6", fontSize: 10, fontWeight: 700, border: "1px solid #334155" }}>
            {talents.length} Active
          </div>
        </div>

        {/* Table Only */}
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12 }}>
          <thead>
            <tr>
              <th style={{ background: "#1e293b", color: "#94a3b8", padding: "10px 16px", borderBottom: "1px solid #334155", textAlign: "left", fontWeight: 600, textTransform: "uppercase", fontSize: 9, letterSpacing: "0.05em" }}>Name</th>
              <th style={{ background: "#1e293b", color: "#94a3b8", padding: "10px 16px", borderBottom: "1px solid #334155", textAlign: "left", fontWeight: 600, textTransform: "uppercase", fontSize: 9, letterSpacing: "0.05em" }}>Technology</th>
              <th style={{ background: "#1e293b", color: "#94a3b8", padding: "10px 16px", borderBottom: "1px solid #334155", textAlign: "left", fontWeight: 600, textTransform: "uppercase", fontSize: 9, letterSpacing: "0.05em" }}>Experience</th>
              <th style={{ background: "#1e293b", color: "#94a3b8", padding: "10px 16px", borderBottom: "1px solid #334155", textAlign: "left", fontWeight: 600, textTransform: "uppercase", fontSize: 9, letterSpacing: "0.05em" }}>Location</th>
              <th style={{ background: "#1e293b", color: "#94a3b8", padding: "10px 16px", borderBottom: "1px solid #334155", textAlign: "left", fontWeight: 600, textTransform: "uppercase", fontSize: 9, letterSpacing: "0.05em" }}>Visa</th>
              <th style={{ background: "#1e293b", color: "#94a3b8", padding: "10px 16px", borderBottom: "1px solid #334155", textAlign: "left", fontWeight: 600, textTransform: "uppercase", fontSize: 9, letterSpacing: "0.05em" }}>Relocation</th>
            </tr>
          </thead>
          <tbody>
            {talents.map((t, i) => (
              <tr key={t.id} style={{ background: i % 2 === 0 ? "#0f172a" : "#1e293b" }}>
                <td style={{ padding: "10px 16px", borderBottom: "1px solid #1e293b", color: "#f8fafc", fontWeight: 600, fontSize: 11 }}>{t.name}</td>
                <td style={{ padding: "10px 16px", borderBottom: "1px solid #1e293b", color: "#60a5fa", fontWeight: 600, fontSize: 11 }}>{t.role}</td>
                <td style={{ padding: "10px 16px", borderBottom: "1px solid #1e293b", color: "#cbd5e1", fontWeight: 500, fontSize: 11 }}>{t.experience}</td>
                <td style={{ padding: "10px 16px", borderBottom: "1px solid #1e293b", color: "#cbd5e1", fontWeight: 500, fontSize: 11 }}>{t.location}</td>
                <td style={{ padding: "10px 16px", borderBottom: "1px solid #1e293b", fontSize: 11 }}>
                  <span style={{ background: "#1e3a8a", color: "#93c5fd", border: "1px solid #1e40af", borderRadius: 4, padding: "2px 6px", fontSize: 9, fontWeight: 700 }}>{t.visa || "H1B"}</span>
                </td>
                <td style={{ padding: "10px 16px", borderBottom: "1px solid #1e293b", fontSize: 11 }}>
                  <span style={{ background: "#064e3b", color: "#6ee7b7", border: "1px solid #065f46", borderRadius: 4, padding: "2px 6px", fontSize: 9, fontWeight: 700 }}>{t.relocation || "Yes"}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function PublishTalentModal({
  open,
  onClose,
  selectedTalents = [],
  onRemove,
  onPublish,
}) {
  const [status, setStatus] = useState("idle");
  const [showHotlist, setShowHotlist] = useState(false);
  const [hotlistLoading, setHotlistLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("classic");
  const [templateLoading, setTemplateLoading] = useState(false);
  
  const [aiGenCount, setAiGenCount] = useState(0);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  
  const [selectedPlatforms, setSelectedPlatforms] = useState(["linkedin"]);
  const [postDescription, setPostDescription] = useState(
    "Latest Talent Hotlist is live! Discover skilled bench talent ready for new opportunities. Connect with top professionals and explore talent available to make an impact."
  );
  const [postLink, setPostLink] = useState("https://uat.benmyl.com/sign-in");

  const [saveHotlistImage] = useSaveHotlistImageMutation();
  const [getLinkedInAuthUrl] = useLazyGetLinkedInAuthUrlQuery();

  /* ─── LinkedIn Share ─── */
  const handleLinkedInShare = async () => {
    try {
      const element = document.getElementById("post-capture-area");
      if (!element) { toast.warning("Please create post first."); return; }
      const canvas = await html2canvas(element, { scale: 2, backgroundColor: "#ffffff" });
      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob((b) => { if (!b) reject(new Error("Image generation failed")); else resolve(b); }, "image/png");
      });
      const EmailId = localStorage.getItem("Email");
      const formData = new FormData();
      formData.append("Title", "Selected Candidates Batch");
      formData.append("Description", `${postDescription}\n\nExplore more profiles:\n${postLink}`);
      formData.append("File", blob, "hotlist.png");
      formData.append("images", "null");
      formData.append("EmailId", EmailId);
      await saveHotlistImage(formData).unwrap();
      const authResponse = await getLinkedInAuthUrl().unwrap();
      if (!authResponse?.result_Message) throw new Error("LinkedIn auth URL not received");
      window.location.href = authResponse.result_Message;
    } catch (error) {
      console.error("LinkedIn Share Error:", error);
      toast.error(error?.data?.message || error.message || "LinkedIn share failed");
    }
  };

  const togglePlatform = (platform) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  if (!open) return null;

  const handleCreateHotlist = () => {
    setShowHotlist(true);
    setHotlistLoading(true);
    setTimeout(() => setHotlistLoading(false), 1200);
  };

  const handleClearHotlist = () => {
    setShowHotlist(false);
    setHotlistLoading(false);
    setShowPreview(false);
  };

  const handleDownloadHotlist = async () => {
    const table = document.getElementById("post-capture-area");
    if (!table) return;
    const canvas = await html2canvas(table, { scale: 2, backgroundColor: selectedTemplate === "darkpro" ? "#0f172a" : "#ffffff" });
    const link = document.createElement("a");
    link.download = "Hotlist.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handlePublish = () => {
    if (!selectedTalents.length) return;
    setStatus("loading");
    
    // Trigger linkedin share if selected
    if (selectedPlatforms.includes('linkedin') && showHotlist) {
      handleLinkedInShare();
    }
    
    setTimeout(() => { setStatus("idle"); onPublish?.(); onClose(); }, 1000);
  };

  const handleTemplateSelect = (tpl) => {
    if (tpl.tagType !== "free") {
      if (tpl.tagType === "subscription") toast.info("This template requires a Pro subscription.");
      if (tpl.tagType === "soon") toast.info("This template is coming soon!");
      return;
    }
    if (tpl.id !== selectedTemplate) {
      setTemplateLoading(true);
      setSelectedTemplate(tpl.id);
      setTimeout(() => {
        setTemplateLoading(false);
      }, 500);
    }
  };

  const handleAiGenerate = () => {
    if (aiGenCount >= 2) {
      toast.info("AI limit reached. Please subscribe to Pro for unlimited generation.", {
        icon: "🚀",
        style: { background: "#1e293b", color: "#fff", border: "1px solid #334155" }
      });
      return;
    }
    setIsAiGenerating(true);
    setTimeout(() => {
      setPostDescription(`Here are ${selectedTalents.length} highly skilled professionals ready to take on new challenges. These candidates bring deep expertise in their respective domains and are available immediately.`);
      setAiGenCount(prev => prev + 1);
      setIsAiGenerating(false);
      toast.success("Description generated by AI");
    }, 1500);
  };

  const getInitials = (name = "") =>
    name.split(" ").filter(Boolean).slice(0, 2).map((n) => n[0].toUpperCase()).join("");

  const drawerExpanded = showHotlist && showPreview && !hotlistLoading;

  return createPortal(
    <>
      {/* ── BACKDROP ── */}
      <div className="ptm-backdrop" onClick={onClose} />

      {/* ── SIDE DRAWER ── */}
      <div className={`ptm-drawer${drawerExpanded ? " ptm-drawer--expanded" : ""}`}>
        {/* Loading Overlay */}
        {status === "loading" && (
          <div className="ptm-loading-overlay">
            <div className="ptm-spinner" />
            <div className="ptm-loading-text">
              Publishing {selectedTalents.length} profile{selectedTalents.length !== 1 ? "s" : ""}…
            </div>
          </div>
        )}

        {/* ── MAIN DRAWER CONTENT ── */}
        <div className="ptm-drawer-main">
          {/* ── HEADER ── */}
          <div className="ptm-header">
            <div className="ptm-header-left">
              <div className="ptm-header-icon">
                <FiShare2 size={16} />
              </div>
              <div>
                <h2 className="ptm-title">Publish Talent</h2>
                <p className="ptm-subtitle">Share your bench talent hotlist</p>
              </div>
            </div>
            <div className="ptm-header-right">
              {selectedTalents.length > 0 && (
                <span className="ptm-count-badge">
                  <FiUsers size={11} />
                  {selectedTalents.length}
                </span>
              )}
              <button className="ptm-close-btn" onClick={onClose} title="Close">
                <FiX size={18} />
              </button>
            </div>
          </div>

          <div className="ptm-divider" />

          {/* ── BODY ── */}
          <div className="ptm-body">

            {/* ── SECTION: CANDIDATES ── */}
            <div className="ptm-section">
              <div className="ptm-section-header">
                <span className="ptm-section-label">Selected Candidates</span>
                <div style={{ display: "flex", gap: 6 }}>
                  {showHotlist && !hotlistLoading && (
                    <button
                      className={`ptm-preview-toggle-btn${showPreview ? " ptm-preview-toggle-btn--active" : ""}`}
                      onClick={() => setShowPreview(!showPreview)}
                    >
                      <FiEye size={12} />
                      {showPreview ? "Hide" : "Preview"}
                    </button>
                  )}
                  {!showHotlist && (
                    <button
                      className="ptm-create-post-btn"
                      onClick={handleCreateHotlist}
                      disabled={!selectedTalents.length}
                    >
                      <FiEye size={13} />
                      Create Post
                    </button>
                  )}
                  {showHotlist && !hotlistLoading && (
                    <button className="ptm-icon-action-btn" onClick={handleClearHotlist}>
                      <FiX size={12} /> Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Talent Cards */}
              {!showHotlist && (
                <div className="ptm-talent-list">
                  {selectedTalents.length === 0 ? (
                    <div className="ptm-empty-state">
                      <div className="ptm-empty-icon"><FiUsers size={24} /></div>
                      <p className="ptm-empty-text">No candidates selected</p>
                      <p className="ptm-empty-hint">Go back and select talent to publish</p>
                    </div>
                  ) : (
                    selectedTalents.map((talent) => (
                      <div key={talent.id} className="ptm-talent-card">
                        <div className="ptm-avatar">{getInitials(talent.name)}</div>
                        <div className="ptm-talent-info">
                          <div className="ptm-talent-name-row">
                            <span className="ptm-talent-name">{talent.name}</span>
                            {talent.verified && (
                              <span className="ptm-verified-badge"><GiCheckMark size={9} /></span>
                            )}
                          </div>
                          <div className="ptm-talent-role">{talent.role}</div>
                          <div className="ptm-talent-meta">
                            <FiMapPin size={10} />
                            <span>{talent.location}</span>
                            <span className="ptm-dot">•</span>
                            <span>{talent.experience}</span>
                          </div>
                        </div>
                        <button
                          className="ptm-remove-btn"
                          onClick={() => onRemove(talent.id)}
                          title="Remove candidate"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Hotlist Loading */}
              {showHotlist && hotlistLoading && (
                <div className="ptm-hotlist-loading">
                  <div className="ptm-spinner" />
                  <div className="ptm-loading-text">Creating post…</div>
                </div>
              )}

              {/* Hotlist Ready State (mini summary) */}
              {showHotlist && !hotlistLoading && (
                <div className="ptm-hotlist-ready-banner">
                  <div className="ptm-hotlist-ready-icon">✓</div>
                  <div>
                    <div className="ptm-hotlist-ready-title">Post ready with {selectedTalents.length} candidate{selectedTalents.length !== 1 ? "s" : ""}</div>
                    <div className="ptm-hotlist-ready-hint">Click Preview to choose a template &amp; see the full layout</div>
                  </div>
                </div>
              )}
            </div>

            {/* ── SECTION: DESCRIPTION ── */}
            <div className="ptm-section">
              <div className="ptm-section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="ptm-section-label">Post Description</span>
                <button 
                  className="ai-generate-btn" 
                  onClick={handleAiGenerate}
                  disabled={isAiGenerating}
                >
                  <FiCpu size={13} /> {isAiGenerating ? "Generating..." : "AI Generate"}
                </button>
              </div>
              <textarea
                className="ptm-textarea"
                value={postDescription}
                onChange={(e) => setPostDescription(e.target.value)}
                placeholder="Enter post description…"
              />
              <div className="ptm-field-group" style={{ marginTop: "14px" }}>
                <label className="ptm-field-label">Post Link</label>
                <input
                  type="text"
                  className="ptm-input ptm-input-readonly"
                  value={postLink}
                  readOnly
                />
              </div>
            </div>

            {/* ── SECTION: SHARE ── */}
            <div className="ptm-section">
              <div className="ptm-section-header">
                <span className="ptm-section-label">Share Hotlist</span>
              </div>
              <div className="ptm-share-stack">
                <label className="ptm-social-btn ptm-social-linkedin" style={{ cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={selectedPlatforms.includes('linkedin')}
                    onChange={() => togglePlatform('linkedin')}
                    className="ptm-checkbox"
                  />
                  <FiLinkedin size={16} />
                  <span>Share on LinkedIn</span>
                </label>
                <label className="ptm-social-btn ptm-social-facebook" style={{ opacity: 0.4, cursor: "not-allowed", filter: "grayscale(1)" }}>
                  <input type="checkbox" disabled className="ptm-checkbox" />
                  <FiFacebook size={16} />
                  <span>Share on Facebook</span>
                  <span className="ptm-coming-soon">Coming soon</span>
                </label>
                <label className="ptm-social-btn ptm-social-email" style={{ opacity: 0.4, cursor: "not-allowed", filter: "grayscale(1)" }}>
                  <input type="checkbox" disabled className="ptm-checkbox" />
                  <FiMail size={16} />
                  <span>Share via Email</span>
                  <span className="ptm-coming-soon">Coming soon</span>
                </label>
              </div>
            </div>
          </div>

          {/* ── FOOTER ── */}
          <div className="ptm-footer" style={{ justifyContent: "space-between" }}>
            <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 500, display: "flex", alignItems: "center", gap: "6px" }}>
              {selectedPlatforms.length > 0 && showHotlist ? (
                <>
                  <FiShare2 size={12} />
                  Publishing to: <span style={{ color: "#0a66c2", fontWeight: 700 }}>LinkedIn</span>
                </>
              ) : (
                <>No platform selected</>
              )}
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button className="btn-secondary" onClick={onClose} disabled={status === "loading"} style={{ padding: "9px 20px" }}>
                Back
              </button>
              <button
                className="btn-primary"
                onClick={handlePublish}
                disabled={status === "loading" || selectedTalents.length === 0}
                style={{ padding: "9px 22px" }}
              >
                {status === "loading" ? (
                  <><span className="ptm-btn-spinner" /> Publishing…</>
                ) : "Publish Talent"}
              </button>
            </div>
          </div>
        </div>

        {/* ── EXPANDED PREVIEW PANEL ── */}
        {drawerExpanded && (
          <div className="ptm-preview-panel">
            {/* Preview Panel Header */}
            <div className="ptm-preview-panel-header">
              <div className="ptm-preview-panel-title">
                <FiEye size={14} /> Post Preview
              </div>
              <button className="ptm-preview-close-btn" onClick={() => setShowPreview(false)}>
                <FiChevronLeft size={14} /> Back
              </button>
            </div>

            {/* Template Selector */}
            <div className="ptm-tpl-section-label">Choose Template</div>
            <div className="ptm-tpl-grid">
              {TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  className={`ptm-tpl-card${selectedTemplate === tpl.id && tpl.tagType === "free" ? " ptm-tpl-card--selected" : ""}${tpl.tagType !== "free" ? " ptm-tpl-card--locked" : ""}`}
                  onClick={() => handleTemplateSelect(tpl)}
                  title={tpl.desc}
                >
                  {/* Mini thumbnail */}
                  <div className="ptm-tpl-thumb">
                    <TemplateMini id={tpl.id} />
                    {/* Overlay for locked states */}
                    {tpl.tagType === "subscription" && (
                      <div className="ptm-tpl-overlay ptm-tpl-overlay--pro">
                        <FiLock size={14} />
                      </div>
                    )}
                    {tpl.tagType === "soon" && (
                      <div className="ptm-tpl-overlay ptm-tpl-overlay--soon">
                        <FiClock size={14} />
                      </div>
                    )}
                    {selectedTemplate === tpl.id && tpl.tagType === "free" && (
                      <div className="ptm-tpl-selected-check">
                        <FiCheck size={11} />
                      </div>
                    )}
                  </div>
                  {/* Card Footer */}
                  <div className="ptm-tpl-card-footer">
                    <span className="ptm-tpl-name">{tpl.name}</span>
                    <span className={`ptm-tpl-tag ptm-tpl-tag--${tpl.tagType}`}>
                      {tpl.tagType === "subscription" && <FiLock size={8} />}
                      {tpl.tagType === "soon" && <FiClock size={8} />}
                      {tpl.tagType === "free" && <FiZap size={8} />}
                      {tpl.tag}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="ptm-divider" style={{ margin: "4px 0 16px" }} />

            {/* Live Canvas Preview */}
            <div className="ptm-preview-canvas-label">
              <FiEye size={12} /> Live Preview
              <button className="ptm-download-preview-btn" onClick={handleDownloadHotlist}>
                <FiDownload size={12} /> Download
              </button>
            </div>

            <div className="ptm-canvas-wrap">
              {templateLoading ? (
                <div style={{ padding: "60px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                  <div className="ptm-spinner" style={{ width: 24, height: 24, borderWidth: 2 }} />
                  <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>Loading template...</span>
                </div>
              ) : (
                <>
                  {selectedTemplate === "classic" && (
                    <ClassicTemplate
                      talents={selectedTalents}
                      description={postDescription}
                      link={postLink}
                    />
                  )}
                  {selectedTemplate === "darkpro" && (
                    <DarkProTemplate
                      talents={selectedTalents}
                      description={postDescription}
                      link={postLink}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── STYLES ── */}
      <style>{`
        /* ── Backdrop ── */
        .ptm-backdrop {
          position: fixed; inset: 0;
          background: rgba(15,23,42,0.45);
          backdrop-filter: blur(3px);
          z-index: 1040;
          animation: ptmFadeIn 0.25s ease;
        }

        /* ── Drawer ── */
        .ptm-drawer {
          position: fixed;
          top: 0; right: 0; bottom: 0;
          width: 480px;
          max-width: 100vw;
          background: #ffffff;
          z-index: 1050;
          display: flex;
          flex-direction: row;
          box-shadow: -8px 0 40px rgba(15,23,42,0.15);
          animation: ptmSlideIn 0.3s cubic-bezier(0.16,1,0.3,1);
          overflow: hidden;
          transition: width 0.38s cubic-bezier(0.16,1,0.3,1);
        }

        .ptm-drawer--expanded {
          width: 80vw;
          max-width: 1400px;
        }

        /* ── Drawer Main (right column) ── */
        .ptm-drawer-main {
          display: flex;
          flex-direction: column;
          width: 480px;
          min-width: 480px;
          flex-shrink: 0;
          border-left: 1px solid #f1f5f9;
          background: #fff;
          z-index: 2;
        }

        /* ── Preview Panel (left column, slides in) ── */
        .ptm-preview-panel {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          background: #f8fafc;
          border-left: 1px solid #e2e8f0;
          overflow-y: auto;
          padding: 20px;
          gap: 12px;
          animation: ptmSlideInRight 0.32s cubic-bezier(0.16,1,0.3,1);
          scrollbar-width: thin;
          scrollbar-color: #e2e8f0 transparent;
        }

        .ptm-drawer--expanded {
          width: 80vw;
          max-width: 1200px;
        }

        @keyframes ptmSlideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        /* Preview Panel Header */
        .ptm-preview-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 4px;
        }

        .ptm-preview-panel-title {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
        }

        .ptm-preview-close-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #fff;
          border: 1px solid #e2e8f0;
          color: #64748b;
          border-radius: 8px;
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .ptm-preview-close-btn:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
          color: #0f172a;
        }

        /* ── Template Selector ── */
        .ptm-tpl-section-label {
          font-size: 10px;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .ptm-tpl-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }

        .ptm-tpl-card {
          display: flex;
          flex-direction: column;
          background: #fff;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          overflow: hidden;
          cursor: pointer;
          padding: 0;
          transition: all 0.2s ease;
          text-align: left;
        }

        .ptm-tpl-card:hover:not(.ptm-tpl-card--locked) {
          border-color: #3b82f6;
          box-shadow: 0 4px 16px rgba(59,130,246,0.15);
          transform: translateY(-2px);
        }

        .ptm-tpl-card--selected {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.15) !important;
        }

        .ptm-tpl-card--locked {
          cursor: not-allowed;
          opacity: 0.8;
        }

        .ptm-tpl-thumb {
          width: 100%;
          aspect-ratio: 4/3;
          position: relative;
          overflow: hidden;
          background: #f1f5f9;
        }

        .ptm-tpl-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }

        .ptm-tpl-overlay--pro {
          background: rgba(88,28,135,0.55);
          color: #fff;
          backdrop-filter: blur(2px);
        }

        .ptm-tpl-overlay--soon {
          background: rgba(15,23,42,0.45);
          color: #fff;
          backdrop-filter: blur(2px);
        }

        .ptm-tpl-selected-check {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(59,130,246,0.4);
        }

        .ptm-tpl-card-footer {
          padding: 7px 8px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 4px;
          border-top: 1px solid #f1f5f9;
        }

        .ptm-tpl-name {
          font-size: 10px;
          font-weight: 700;
          color: #1e293b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ptm-tpl-tag {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 9px;
          font-weight: 700;
          border-radius: 4px;
          padding: 2px 5px;
          flex-shrink: 0;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .ptm-tpl-tag--free   { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
        .ptm-tpl-tag--subscription { background: #faf5ff; color: #7c3aed; border: 1px solid #ddd6fe; }
        .ptm-tpl-tag--soon   { background: #f8fafc; color: #64748b; border: 1px solid #e2e8f0; }

        /* ── Preview Canvas ── */
        .ptm-preview-canvas-label {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .ptm-download-preview-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          margin-left: auto;
          background: #fff;
          border: 1px solid #e2e8f0;
          color: #475569;
          border-radius: 7px;
          padding: 5px 10px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          text-transform: none;
          letter-spacing: 0;
        }

        .ptm-download-preview-btn:hover {
          background: #3b82f6;
          border-color: #3b82f6;
          color: #fff;
        }

        .ptm-canvas-wrap {
          border-radius: 10px;
          overflow: auto;
          box-shadow: 0 4px 20px rgba(15,23,42,0.08);
          max-height: calc(100vh - 280px);
          padding-bottom: 24px;
        }

        /* ── Hotlist Ready Banner ── */
        .ptm-hotlist-ready-banner {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 14px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 12px;
        }

        .ptm-hotlist-ready-icon {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #16a34a;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 13px;
          flex-shrink: 0;
        }

        .ptm-hotlist-ready-title {
          font-size: 13px;
          font-weight: 700;
          color: #15803d;
          margin-bottom: 2px;
        }

        .ptm-hotlist-ready-hint {
          font-size: 11px;
          color: #4ade80;
          color: #166534;
          opacity: 0.8;
        }

        /* ── Preview Toggle Button ── */
        .ptm-preview-toggle-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #eff6ff;
          color: #3b82f6;
          border: 1px solid #bfdbfe;
          border-radius: 8px;
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .ptm-preview-toggle-btn:hover {
          background: #3b82f6;
          color: #fff;
          border-color: #3b82f6;
          box-shadow: 0 4px 12px rgba(59,130,246,0.3);
        }

        .ptm-preview-toggle-btn--active {
          background: #3b82f6;
          color: #fff;
          border-color: #3b82f6;
        }

        /* ── Hotlist Loading ── */
        .ptm-hotlist-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 32px 20px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
        }

        /* ── Animations ── */
        @keyframes ptmFadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes ptmSlideIn {
          from { transform: translateX(100%); } to { transform: translateX(0); }
        }

        /* ── Header ── */
        .ptm-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          flex-shrink: 0;
          background: #ffffff;
        }
        .ptm-header-left { display: flex; align-items: center; gap: 12px; }
        .ptm-header-icon {
          width: 38px; height: 38px; border-radius: 10px;
          background: linear-gradient(135deg,#5B5BD6,#3b82f6);
          color: #fff; display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; box-shadow: 0 4px 12px rgba(91,91,214,0.3);
        }
        .ptm-title { font-size: 16px; font-weight: 700; color: #0f172a; margin: 0; line-height: 1.2; }
        .ptm-subtitle { font-size: 12px; color: #94a3b8; margin: 2px 0 0 0; }
        .ptm-header-right { display: flex; align-items: center; gap: 10px; }
        .ptm-count-badge {
          display: inline-flex; align-items: center; gap: 5px;
          background: #eff6ff; color: #3b82f6; border: 1px solid #bfdbfe;
          border-radius: 20px; padding: 4px 10px; font-size: 12px; font-weight: 700;
        }
        .ptm-close-btn {
          width: 34px; height: 34px; border-radius: 8px; border: 1px solid #e2e8f0;
          background: #f8fafc; color: #64748b; display: flex; align-items: center;
          justify-content: center; cursor: pointer; transition: all 0.2s ease; flex-shrink: 0;
        }
        .ptm-close-btn:hover { background: #fee2e2; border-color: #fca5a5; color: #ef4444; }

        /* ── Divider ── */
        .ptm-divider { height: 1px; background: #f1f5f9; flex-shrink: 0; }

        /* ── Body ── */
        .ptm-body {
          flex: 1; overflow-y: auto; padding: 20px 24px;
          display: flex; flex-direction: column; gap: 20px;
          scrollbar-width: thin; scrollbar-color: #e2e8f0 transparent;
        }
        .ptm-body::-webkit-scrollbar { width: 4px; }
        .ptm-body::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }

        /* ── Section ── */
        .ptm-section { display: flex; flex-direction: column; gap: 12px; }
        .ptm-section-header { display: flex; align-items: center; justify-content: space-between; }
        .ptm-section-label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.07em; }

        /* ── Create Post Button ── */
        .ptm-create-post-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: #eff6ff; color: #3b82f6; border: 1px solid #bfdbfe;
          border-radius: 8px; padding: 6px 12px; font-size: 12px; font-weight: 600;
          cursor: pointer; transition: all 0.2s ease;
        }
        .ptm-create-post-btn:hover:not(:disabled) {
          background: #3b82f6; color: #fff; border-color: #3b82f6;
          box-shadow: 0 4px 12px rgba(59,130,246,0.3);
        }
        .ptm-create-post-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        /* ── Talent List ── */
        .ptm-talent-list {
          display: flex; flex-direction: column; gap: 8px;
          max-height: 260px; overflow-y: auto; padding-right: 2px;
          scrollbar-width: thin; scrollbar-color: #e2e8f0 transparent;
        }
        .ptm-talent-list::-webkit-scrollbar { width: 4px; }
        .ptm-talent-list::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }

        /* ── Talent Card ── */
        .ptm-talent-card {
          display: flex; align-items: center; gap: 12px; padding: 12px 14px;
          background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;
          transition: all 0.2s ease;
        }
        .ptm-talent-card:hover {
          background: #fff; border-color: #cbd5e1;
          box-shadow: 0 2px 8px rgba(15,23,42,0.06); transform: translateY(-1px);
        }
        .ptm-avatar {
          width: 40px; height: 40px; border-radius: 10px;
          background: linear-gradient(135deg,#5B5BD6,#7b7fdb);
          color: #fff; font-size: 14px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; box-shadow: 0 2px 8px rgba(91,91,214,0.25);
        }
        .ptm-talent-info { flex: 1; min-width: 0; }
        .ptm-talent-name-row { display: flex; align-items: center; gap: 6px; margin-bottom: 2px; }
        .ptm-talent-name { font-size: 13px; font-weight: 700; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ptm-verified-badge { width: 16px; height: 16px; border-radius: 50%; background: #059669; color: #fff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .ptm-talent-role { font-size: 12px; color: #5B5BD6; font-weight: 600; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ptm-talent-meta { display: flex; align-items: center; gap: 5px; font-size: 11px; color: #94a3b8; font-weight: 500; }
        .ptm-dot { color: #cbd5e1; }
        .ptm-remove-btn {
          width: 32px; height: 32px; border-radius: 8px; background: transparent;
          border: 1px solid #e2e8f0; color: #94a3b8; display: flex; align-items: center;
          justify-content: center; cursor: pointer; flex-shrink: 0; transition: all 0.2s ease;
        }
        .ptm-remove-btn:hover { background: #fee2e2; border-color: #fca5a5; color: #ef4444; }

        /* ── Empty State ── */
        .ptm-empty-state {
          display: flex; flex-direction: column; align-items: center;
          padding: 32px 20px; background: #f8fafc; border: 2px dashed #e2e8f0;
          border-radius: 12px; text-align: center;
        }
        .ptm-empty-icon { width: 48px; height: 48px; border-radius: 12px; background: #f1f5f9; color: #cbd5e1; display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
        .ptm-empty-text { font-size: 14px; font-weight: 600; color: #475569; margin: 0 0 4px 0; }
        .ptm-empty-hint { font-size: 12px; color: #94a3b8; margin: 0; }

        /* ── Icon Action Button ── */
        .ptm-icon-action-btn {
          display: inline-flex; align-items: center; gap: 5px;
          background: #fff; border: 1px solid #e2e8f0; color: #475569;
          border-radius: 7px; padding: 5px 10px; font-size: 12px; font-weight: 600;
          cursor: pointer; transition: all 0.2s ease;
        }
        .ptm-icon-action-btn:hover { background: #f1f5f9; border-color: #cbd5e1; color: #0f172a; }

        /* ── Post Detail Fields ── */
        .ptm-field-group { display: flex; flex-direction: column; gap: 6px; }
        .ptm-field-label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
        .ptm-textarea, .ptm-input {
          width: 100%; border-radius: 10px; border: 1px solid #e2e8f0;
          font-size: 10px; color: #1e293b; transition: all 0.2s ease;
          background: #f8fafc; box-sizing: border-box;
        }
        .ptm-textarea:focus, .ptm-input:focus {
          outline: none; border-color: #3b82f6; background: #fff;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.12);
        }
        .ptm-textarea { padding: 10px 12px; min-height: 80px; resize: vertical; line-height: 1.6; }
        .ptm-input { padding: 9px 12px; }
        .ptm-input-readonly { background: #f1f5f9; color: #3b82f6; cursor: not-allowed; font-weight: 500; }

        /* ── Social Buttons ── */
        .ptm-share-stack { display: flex; flex-direction: column; gap: 8px; }
        .ptm-social-btn {
          display: flex; align-items: center; gap: 12px; width: 100%;
          padding: 13px 16px; border-radius: 12px; border: 1px solid transparent;
          font-size: 11px; font-weight: 600; cursor: pointer;
          transition: all 0.22s ease; text-align: left; position: relative;
        }
        .ptm-social-btn span { flex: 1; }
        .ptm-social-arrow { margin-left: auto; opacity: 0; transition: all 0.2s ease; transform: translateX(-4px); }
        .ptm-social-btn:hover .ptm-social-arrow { opacity: 1; transform: translateX(0); }
        .ptm-checkbox { margin-right: 8px; accent-color: #0a66c2; cursor: pointer; }
        .ptm-coming-soon {
          font-size: 10px; font-weight: 600; color: #94a3b8; background: #f1f5f9;
          border-radius: 4px; padding: 2px 6px; text-transform: uppercase; letter-spacing: 0.04em; flex: unset !important;
        }
        .ptm-social-linkedin { background: #EBF5FB; border-color: #BFDBFE; color: #0a66c2; }
        .ptm-social-linkedin:hover { background: #0a66c2; border-color: #0a66c2; color: #fff; box-shadow: 0 4px 16px rgba(10,102,194,0.28); transform: translateY(-1px); }
        .ptm-social-facebook { background: #EFF6FF; border-color: #BFDBFE; color: #1877f2; }
        .ptm-social-email { background: #F0FDF4; border-color: #BBF7D0; color: #16a34a; }

        /* ── AI Button ── */
        .ptm-ai-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: linear-gradient(135deg, #1e293b, #0f172a);
          color: #fff; border: none; border-radius: 6px; padding: 4px 10px;
          font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.2s ease;
        }
        .ptm-ai-btn:hover:not(:disabled) {
          box-shadow: 0 4px 12px rgba(15,23,42,0.3); transform: translateY(-1px);
        }
        .ptm-ai-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        /* ── Spinner ── */
        .ptm-spinner { width: 28px; height: 28px; border: 3px solid #f1f5f9; border-top-color: #3b82f6; border-radius: 50%; animation: ptmSpin 0.8s linear infinite; }
        .ptm-btn-spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff; border-radius: 50%; animation: ptmSpin 0.8s linear infinite; vertical-align: middle; margin-right: 6px; }
        .ptm-loading-text { font-size: 13px; color: #64748b; font-weight: 500; }
        @keyframes ptmSpin { to { transform: rotate(360deg); } }

        /* ── Loading Overlay ── */
        .ptm-loading-overlay {
          position: absolute; inset: 0; background: rgba(255,255,255,0.92); z-index: 60;
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px;
          border-radius: 16px 0 0 16px;
        }

        /* ── Footer ── */
        .ptm-footer {
          flex-shrink: 0; display: flex; align-items: center; justify-content: flex-end;
          gap: 10px; padding: 16px 24px; border-top: 1px solid #f1f5f9; background: #ffffff;
        }
        .ptm-btn-secondary {
          padding: 9px 20px; border-radius: 10px; border: 1px solid #e2e8f0;
          background: #f8fafc; color: #475569; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all 0.2s ease;
        }
        .ptm-btn-secondary:hover:not(:disabled) { background: #f1f5f9; border-color: #cbd5e1; color: #0f172a; }
        .ptm-btn-secondary:disabled { opacity: 0.5; cursor: not-allowed; }
        .ptm-btn-primary {
          padding: 9px 22px; border-radius: 10px; border: none;
          background: linear-gradient(135deg,#f5810c,#ff9a3c); color: #fff;
          font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(245,129,12,0.3);
          display: inline-flex; align-items: center; gap: 6px;
        }
        .ptm-btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(245,129,12,0.4); filter: brightness(1.05); }
        .ptm-btn-primary:active:not(:disabled) { transform: translateY(0); box-shadow: 0 2px 8px rgba(245,129,12,0.3); }
        .ptm-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: none; transform: none; }

        @media (max-width: 960px) {
          .ptm-drawer--expanded { width: 100vw; border-radius: 0; flex-direction: column-reverse; }
          .ptm-drawer-main { min-width: 100vw; width: 100vw; }
          .ptm-preview-panel { border-right: none; border-bottom: 1px solid #e2e8f0; }
        }
      `}</style>
    </>,
    document.body
  );
}