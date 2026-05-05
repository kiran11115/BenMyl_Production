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
  const [postDescription, setPostDescription] = useState("Latest Talent Hotlist is live! Discover skilled bench talent ready for new opportunities. Connect with top professionals and explore talent available to make an impact.");
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

                        <div id="post-capture-area" style={{ background: "#ffffff", borderRadius: "8px" }}>
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

                          <div className="t-info" style={{ flex: 1 }}>
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
                              title="Remove"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="talent-selection-description">
                    <div style={{ marginBottom: "16px" }}>
                      <label className="desc-label">Post Description</label>
                      <textarea
                        className="desc-textarea"
                        value={postDescription}
                        onChange={(e) => setPostDescription(e.target.value)}
                        placeholder="Enter post description..."
                      />
                    </div>
                    <div>
                      <label className="desc-label">Post Link</label>
                      <input
                        type="text"
                        className="desc-input"
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
                  <button className="social-btn facebook" disabled style={{ opacity: 0.4, cursor: 'not-allowed', filter: 'grayscale(1)' }}>
                    <FiFacebook className="social-icon" /> Share on Facebook
                  </button>
                  <button className="social-btn email" disabled style={{ opacity: 0.4, cursor: 'not-allowed', filter: 'grayscale(1)' }}>
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
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: #ffffff;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }
        .talent-card-row:hover {
          border-color: #cbd5e1;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
          transform: translateY(-1px);
        }

        .initial-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background-color: #f1f5f9;
          color: #475569;
          font-size: 16px;
          font-weight: 700;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
 
        .t-info { display: flex; flex-direction: column; gap: 4px; }
        .t-header { display: flex; align-items: center; gap: 8px; }
        .t-name { font-weight: 700; color: #1e293b; font-size: 15px; }
        .t-verified { color: #059669; display: flex; align-items: center; }
        .t-role { color: #64748b; font-size: 13px; font-weight: 500; }
        .t-meta { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #94a3b8; font-weight: 500; }
        .bullet { color: #cbd5e1; font-size: 10px; }
 
        .t-actions { display: flex; gap: 8px; }
        .t-remove-btn {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #94a3b8;
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .t-remove-btn:hover {
          background: #fee2e2;
          color: #ef4444;
          border-color: #fecaca;
        }
 
        .empty-state {
          padding: 40px;
          text-align: center;
          color: #94a3b8;
          border: 2px dashed #e2e8f0;
          border-radius: 12px;
          background: #f8fafc;
          font-weight: 500;
        }
 
        .hotlist-wrapper {
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 24px;
          background: #ffffff;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
        }
        .hotlist-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .hotlist-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          font-size: 14px;
        }
        .hotlist-table th {
          background: #f8fafc;
          color: #64748b;
          padding: 12px 16px;
          border-bottom: 1px solid #e2e8f0;
          text-align: left;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 0.05em;
        }
        .hotlist-table th:first-child {
          border-top-left-radius: 8px;
        }
        .hotlist-table th:last-child {
          border-top-right-radius: 8px;
        }
        .hotlist-table td {
          padding: 16px;
          border-bottom: 1px solid #f1f5f9;
          color: #334155;
          font-weight: 500;
        }
        .hotlist-table tr:last-child td {
          border-bottom: none;
        }

        .talent-selection-description {
          margin-top: 24px;
          padding: 20px;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }
        .desc-label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .desc-textarea, .desc-input {
          width: 100%;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          font-size: 14px;
          color: #1e293b;
          transition: all 0.2s ease;
          background: #ffffff;
          box-sizing: border-box;
        }
        .desc-textarea:focus, .desc-input:focus {
          outline: none;
          border-color: #f5810c;
          box-shadow: 0 0 0 3px rgba(245, 129, 12, 0.1);
        }
        .desc-textarea {
          padding: 12px;
          min-height: 80px;
          resize: vertical;
        }
        .desc-input {
          padding: 10px 12px;
        }
        .desc-input[readOnly] {
          background-color: #f1f5f9;
          color: #3b82f6;
          cursor: not-allowed;
          font-weight: 500;
        }
      `}</style>
    </>,
    document.body
  );
}