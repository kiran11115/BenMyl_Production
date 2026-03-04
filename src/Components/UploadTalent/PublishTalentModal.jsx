import React, { useState } from "react";
import { createPortal } from "react-dom";
import html2canvas from "html2canvas";
import {
  FiX,
  FiCopy,
  FiMapPin,
  FiLinkedin,
  FiFacebook,
  FiMail,
  FiChevronDown,
  FiChevronUp,
  FiTrash2,
  FiDownload,
} from "react-icons/fi";
import { FaPuzzlePiece } from "react-icons/fa";
import { GiCheckMark } from "react-icons/gi";
import { useLazyGetLinkedInAuthUrlQuery, useSaveHotlistImageMutation } from "../../State-Management/Api/UploadResumeApiSlice";

export default function PublishTalentModal({
  open,
  onClose,
  selectedTalents = [],
  onRemove,
  onPublish,
}) {
  const [status, setStatus] = useState("idle");
  const [isVendorOpen, setIsVendorOpen] = useState(true);
  const [showHotlist, setShowHotlist] = useState(false);
  const [hotlistLoading, setHotlistLoading] = useState(false);
  const [postDescription, setPostDescription] = useState("Latest talent hotlist");
  const [postLink, setPostLink] = useState("https://react.benmyl.com/sign-in");


  const [saveHotlistImage] = useSaveHotlistImageMutation();
  const [getLinkedInAuthUrl] = useLazyGetLinkedInAuthUrlQuery();

  const handleLinkedInShare = async () => {
    try {
      const element = document.getElementById("post-capture-area");

      if (!element) {
        alert("Please create post first.");
        return;
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#ffffff",
      });

      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob((b) => {
          if (!b) reject(new Error("Image generation failed"));
          else resolve(b);
        }, "image/png");
      });

      const EmailId = localStorage.getItem("Email");

      const formData = new FormData();
      formData.append("Title", "Selected Candidates Batch");
      formData.append(
        "Description",
        `${postDescription}\n\nExplore more profiles:\n${postLink}`
      );
      formData.append("File", blob, "hotlist.png");
      formData.append("images", "null");
      formData.append("EmailId", EmailId);

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
      alert(error?.data?.message || error.message || "LinkedIn share failed");
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
  };

  const handleDownloadHotlist = async () => {
    const table = document.getElementById("post-capture-area");
    if (!table) return;
    const canvas = await html2canvas(table, { scale: 2 });
    const link = document.createElement("a");
    link.download = "Hotlist.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handlePublish = () => {
    if (!selectedTalents.length) return;
    setStatus("loading");
    setTimeout(() => {
      setStatus("idle");
      onPublish?.();
      onClose();
    }, 1000);
  };

  const getInitials = (name = "") =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0].toUpperCase())
      .join("");

  return createPortal(
    <>
      <div className="modal-overlay">
        <div className="modal-window" style={{ height: "85vh", position: "relative" }}>
          {status === "loading" && (
            <div className="loading-overlay">
              <div className="spinner" />
              <div className="loading-text">
                Publishing {selectedTalents.length} profiles…
              </div>
            </div>
          )}

          <button className="modal-close" onClick={onClose}>
            <FiX />
          </button>

          <div className="modal-inner">
            {/* LEFT */}
            <div className="modal-left">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2>Selected Candidates</h2>
                  <p className="muted small">
                    Review candidates or create post for sharing
                  </p>
                </div>

                {!showHotlist && (
                  <button
                    className="btn-primary"
                    onClick={handleCreateHotlist}
                    disabled={!selectedTalents.length}
                  >
                    Create Post
                  </button>
                )}
              </div>

              <hr className="modal-divider" />

              {/* HOTLIST */}
              {showHotlist && (
                <div className="hotlist-wrapper">
                  {hotlistLoading ? (
                    <div
                      className="loading-overlay"
                      style={{ position: "relative" }}
                    >
                      <div className="spinner" />
                      <div className="loading-text">
                        Creating post preview…
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="hotlist-actions">
                        <h3>Post Preview</h3>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            className="btn-secondary gap-2"
                            onClick={handleDownloadHotlist}
                          >
                            <FiDownload /> Download
                          </button>
                          <button
                            className="btn-secondary"
                            onClick={handleClearHotlist}
                          >
                            Clear
                          </button>
                        </div>
                      </div>

                      <div className="post-preview-display">
                        <div style={{ marginBottom: "16px" }}>
                          <p style={{ fontWeight: "700", fontSize: "16px", color: "#1e293b", marginBottom: "4px", whiteSpace: "pre-wrap" }}>{postDescription}</p>
                          <p style={{ color: "#3b82f6", fontSize: "14px" }}>{postLink}</p>
                        </div>

                        <div id="post-capture-area" style={{background: "#ffffff", borderRadius: "8px" }}>
                          <table id="hotlist-table" className="hotlist-table" >
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Technology</th>
                                <th>Experience</th>
                                <th>Location</th>
                                <th>Visa</th>
                                <th>Relocation</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedTalents.map((t) => (
                                <tr key={t.id}>
                                  <td>{t.name}</td>
                                  <td>{t.role}</td>
                                  <td>{t.experience}</td>
                                  <td>{t.location}</td>
                                  <td>{t.visa || "H1B"}</td>
                                  <td>{t.relocation || "Yes"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* TALENT LIST */}
              {!showHotlist && (
                <div className="talent-list-container">
                  <div className="talent-list" style={{ maxHeight: "290px", overflowY: "auto", paddingRight: "8px" }}>
                    {selectedTalents.length === 0 ? (
                      <div className="empty-state">No candidates selected</div>
                    ) : (
                      selectedTalents.map((talent) => (
                        <div key={talent.id} className="talent-card-row">
                          <div className="initial-avatar">
                            {getInitials(talent.name)}
                          </div>

                          <div className="t-info">
                            <div className="t-header">
                              <span className="t-name">{talent.name}</span>
                              {talent.verified && (
                                <span className="t-verified">
                                  <GiCheckMark />
                                </span>
                              )}
                            </div>
                            <div className="t-role">{talent.role}</div>
                            <div className="t-meta">
                              <FiMapPin size={12} />
                              {talent.location}
                              <span className="bullet">•</span>
                              {talent.experience}
                            </div>
                          </div>

                          <div className="t-actions">
                            <button
                              className="t-remove-btn"
                              onClick={() => onRemove(talent.id)}
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="talent-selection-description" style={{ marginTop: "16px", padding: "16px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <div style={{ marginBottom: "12px" }}>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#64748b", marginBottom: "4px", textTransform: "uppercase" }}>Post Description</label>
                      <textarea
                        style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "14px", color: "#1e293b", minHeight: "80px", resize: "vertical" }}
                        value={postDescription}
                        onChange={(e) => setPostDescription(e.target.value)}
                        placeholder="Enter post description..."
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#64748b", marginBottom: "4px", textTransform: "uppercase" }}>Post Link</label>
                      <input
                        type="text"
                        style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "14px", color: "#3b82f6", backgroundColor: "#f1f5f9", cursor: "not-allowed" }}
                        value={postLink}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT */}
            <aside className="modal-right">
              <div className="share-card">
                <h4 className="share-title">Share Profile Batch</h4>

                <div className="share-input-group">
                  <label className="input-label">Batch Link</label>
                  <div className="share-link-row">
                    <input
                      className="share-input"
                      readOnly
                      value={`https://techstream.jobs/batch/${Date.now().toString().slice(-6)}`}
                    />
                    <button className="copy-btn">
                      <FiCopy /> Copy
                    </button>
                  </div>
                </div>

                <div className="social-buttons-stack">
                  <button className="social-btn linkedin" onClick={handleLinkedInShare}>
                    <FiLinkedin className="social-icon" /> Share on LinkedIn
                  </button>
                  <button className="social-btn facebook">
                    <FiFacebook className="social-icon" /> Share on Facebook
                  </button>
                  <button className="social-btn email">
                    <FiMail className="social-icon" /> Share via Email
                  </button>
                </div>

                <div className="vendor-section">
                  <button
                    className="vendor-header"
                    onClick={() => setIsVendorOpen(!isVendorOpen)}
                  >
                    <div className="vendor-header-left">
                      <FaPuzzlePiece className="puzzle-icon" />
                      <span>Share with</span>
                    </div>
                    {isVendorOpen ? <FiChevronUp /> : <FiChevronDown />}
                  </button>

                  {isVendorOpen && (
                    <div className="vendor-list">
                      <label className="checkbox-row">
                        <input type="checkbox" />
                        <span>Premier Staffing Agency</span>
                      </label>
                      <label className="checkbox-row">
                        <input type="checkbox" defaultChecked />
                        <span>Tech Talent Finders</span>
                      </label>
                      <label className="checkbox-row">
                        <input type="checkbox" defaultChecked />
                        <span>DevHunters</span>
                      </label>
                      <label className="checkbox-row">
                        <input type="checkbox" />
                        <span>CodeSeeker Recruiting</span>
                      </label>
                      <label className="checkbox-row">
                        <input type="checkbox" defaultChecked />
                        <span>Elite Tech Staffing</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </div>

          <div
            className="modal-actions-left gap-3"
            style={{ padding: "24px", borderTop: "1px solid #e2e8f0" }}
          >
            <button
              className="btn-secondary"
              onClick={onClose}
              disabled={status === "loading"}
            >
              Back
            </button>
            <button
              onClick={handlePublish}
              className="btn-primary"
              style={{ width: "165px" }}
              disabled={status === "loading" || selectedTalents.length === 0}
            >
              {status === "loading" ? "Publishing..." : "Publish Talent"}
            </button>
          </div>
        </div>
      </div>

      {/* 🔹 INLINE STYLES (YOUR STYLES + HOTLIST) */}
      <style>{`
        .loading-overlay {
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.9);
          z-index: 50;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #e2e8f0;
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .loading-text {
          margin-top: 16px;
          color: #64748b;
          font-weight: 500;
          font-size: 14px;
        }
 
        .talent-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
 
        .talent-card-row {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 16px;
          padding: 16px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          background: white;
          transition: all 0.2s ease;
        }
        .talent-card-row:hover {
          border-color: #cbd5e1;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }
 
        .t-info { display: flex; flex-direction: column; gap: 2px; }
        .t-header { display: flex; align-items: center; gap: 6px; }
        .t-name { font-weight: 700; color: #1e293b; font-size: 15px; }
        .t-verified { color: #059669; display: flex; align-items: center; }
        .t-role { color: #3b82f6; font-size: 13px; font-weight: 500; }
        .t-meta { display: flex; gap: 6px; font-size: 12px; color: #64748b; }
        .bullet { color: #cbd5e1; }
 
        .t-actions { display: flex; gap: 8px; }
        .t-remove-btn {
          background: transparent;
          border: 1px solid transparent;
          color: #94a3b8;
          padding: 6px;
          border-radius: 6px;
          cursor: pointer;
        }
        .t-remove-btn:hover {
          background: #fee2e2;
          color: #ef4444;
          border-color: #fecaca;
        }
 
        .empty-state {
          padding: 32px;
          text-align: center;
          color: #94a3b8;
          border: 2px dashed #e2e8f0;
          border-radius: 8px;
          background: #f8fafc;
        }
 
        .hotlist-wrapper {
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 16px;
          background: #ffffff;
        }
        .hotlist-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .hotlist-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        .hotlist-table th {
          background: #1e293b;
          color: #fefefe;
          padding: 10px;
          border: 1px solid #d1d5db;
          text-align: left;
        }
        .hotlist-table td {
          padding: 10px;
          border: 1px solid #d1d5db;
        }
      `}</style>
    </>,
    document.body
  );
}