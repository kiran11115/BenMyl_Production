import React, { useState, useEffect } from "react";
import { Upload, X, FileText, CheckCircle, AlertCircle, Loader2, CloudUpload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUploadProfilesMutation } from "../../State-Management/Api/UploadResumeApiSlice";

function UploadTalentModal({
  buttonText = "Upload Talent",
  buttonStyle = {},
  onSuccess,
  show = false,
  onHide,
  onShow,
  onUploading,
}) {
  const [showModal, setShowModal] = useState(show);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileStatuses, setFileStatuses] = useState({}); // { index: 'processing' | 'done' | 'error' }
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  // Sync internal state with external show prop
  useEffect(() => {
    setShowModal(show);
  }, [show]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const baseIndex = uploadedFiles.length;
    const fileArray = Array.from(files).map((file, i) => ({
      name: file.name,
      size: (file.size / 1024).toFixed(2) + " KB",
      file: file,
      index: baseIndex + i,
    }));
    setUploadedFiles(prev => [...prev, ...fileArray]);
  };

  const removeFile = (index) => {
    if (isProcessing) return;
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
    const newStatuses = { ...fileStatuses };
    delete newStatuses[index];
    setFileStatuses(newStatuses);
  };

  const [uploadProfiles] = useUploadProfilesMutation();

  const handleAIProcess = async () => {
    if (uploadedFiles.length === 0) return;

    if (typeof onUploading === "function") onUploading(true);
    setIsProcessing(true);

    const initialStatuses = {};
    uploadedFiles.forEach((_, i) => { initialStatuses[i] = 'processing'; });
    setFileStatuses(initialStatuses);

    try {
      const formData = new FormData();
      uploadedFiles.forEach((item) => {
        formData.append("file", item.file);
      });

      // Pass default metadata
      formData.append("companyid", Number(localStorage.getItem("logincompanyid")) || 0);
      formData.append("branchid", 0);
      formData.append("userid", 0);
      formData.append("sessionid", "upload_session_" + Date.now());

      await uploadProfiles(formData).unwrap();

      const doneStatuses = {};
      uploadedFiles.forEach((_, i) => { doneStatuses[i] = 'done'; });
      setFileStatuses(doneStatuses);

      if (onSuccess) {
        onSuccess(`Successfully uploaded ${uploadedFiles.length} resume(s)`);
      }

      setTimeout(() => {
        handleClose();
        navigate("/user/user-upload-talent", {
          state: {
            files: uploadedFiles,
            activeTab: "Review",
            fromDashboardUpload: true,
            uploadCount: uploadedFiles.length
          },
        });
      }, 1000);

    } catch (error) {
      console.error("Upload failed", error);
      const errorStatuses = {};
      uploadedFiles.forEach((_, i) => { errorStatuses[i] = 'error'; });
      setFileStatuses(errorStatuses);
      if (onSuccess) {
        onSuccess("Failed to upload resumes. Please try again.");
      }
    } finally {
      setIsProcessing(false);
      if (typeof onUploading === "function") onUploading(false);
    }
  };

  const handleClose = () => {
    if (isProcessing) return;
    setUploadedFiles([]);
    setFileStatuses({});
    setDragActive(false);
    setShowModal(false);
    onHide?.();
  };

  const handleOpen = () => {
    setShowModal(true);
    onShow?.();
  };

  // Modern UI Styles
  const colors = {
    primary: "#f5810c",
    primaryLight: "#fff7ed",
    primaryHover: "#ea580c",
    secondary: "#3b82f6",
    secondaryLight: "#eff6ff",
    textMain: "#1e293b",
    textMuted: "#64748b",
    border: "#e2e8f0",
    bgDropzone: "#f8fafc",
    bgDropzoneActive: "#f0f9ff",
    success: "#10b981",
    error: "#ef4444",
    white: "#ffffff"
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="btn-upload"
      >
        <Upload size={18} />
        <span>{buttonText}</span>
      </button>

      {showModal && (
        <div
          className="ut-modal-overlay"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
            padding: "20px",
            animation: "fadeIn 0.3s ease-out"
          }}
          onClick={handleClose}
        >
          <div
            className="ut-modal-content"
            style={{
              backgroundColor: colors.white,
              borderRadius: "24px",
              width: "100%",
              maxWidth: "600px",
              maxHeight: "90vh",
              overflow: "hidden",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              display: "flex",
              flexDirection: "column",
              animation: "slideUp 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ padding: "32px 32px 24px", position: "relative" }}>
              <button
                onClick={handleClose}
                style={{
                  position: "absolute",
                  top: "24px",
                  right: "24px",
                  padding: "8px",
                  borderRadius: "50%",
                  border: "none",
                  backgroundColor: "transparent",
                  color: colors.textMuted,
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                <X size={20} />
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  backgroundColor: colors.primaryLight,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: colors.primary
                }}>
                  <CloudUpload size={24} />
                </div>
                <h2 style={{ fontSize: "24px", fontWeight: "700", color: colors.textMain, margin: 0 }}>
                  Upload Talent
                </h2>
              </div>
              <p style={{ fontSize: "15px", color: colors.textMuted, margin: 0 }}>
                Upload resumes and let our AI handle the parsing.
              </p>
            </div>

            {/* Body */}
            <div style={{ padding: "0 32px 32px", overflowY: "auto", flex: 1 }}>
              <div
                style={{
                  border: `2px dashed ${dragActive ? colors.primary : colors.border}`,
                  borderRadius: "20px",
                  padding: "40px 24px",
                  textAlign: "center",
                  backgroundColor: dragActive ? colors.bgDropzoneActive : colors.bgDropzone,
                  cursor: isProcessing ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  position: "relative"
                }}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => !isProcessing && document.getElementById("bulkUploadFileInput").click()}
              >
                <input
                  id="bulkUploadFileInput"
                  type="file"
                  multiple
                  accept=".pdf,.zip,.rar"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                  disabled={isProcessing}
                />

                <div style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  backgroundColor: colors.white,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                  color: dragActive ? colors.primary : colors.textMuted
                }}>
                  <Upload size={28} />
                </div>

                <h3 style={{ fontSize: "16px", fontWeight: "600", color: colors.textMain, marginBottom: "8px" }}>
                  {dragActive ? "Drop files here" : "Click or drag files to upload"}
                </h3>
                <p style={{ fontSize: "14px", color: colors.textMuted, marginBottom: "0" }}>
                  Supports PDF, ZIP, RAR (Max 10MB)
                </p>
              </div>

              {uploadedFiles.length > 0 && (
                <div style={{ marginTop: "32px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                    <h4 style={{ fontSize: "14px", fontWeight: "700", color: colors.textMain, margin: 0, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Selected Files ({uploadedFiles.length})
                    </h4>
                  </div>

                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    maxHeight: "160px",
                    overflowY: "auto",
                    paddingRight: "4px"
                  }}>
                    {uploadedFiles.map((file, index) => {
                      const status = fileStatuses[index];
                      return (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "12px 16px",
                            backgroundColor: colors.white,
                            borderRadius: "14px",
                            border: `1px solid ${status === 'error' ? '#fee2e2' : status === 'done' ? '#dcfce7' : colors.border}`,
                            transition: 'all 0.2s ease',
                            boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
                          }}
                        >
                          <div style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "8px",
                            backgroundColor: status === 'error' ? '#fef2f2' : status === 'done' ? '#f0fdf4' : colors.primaryLight,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: status === 'error' ? colors.error : status === 'done' ? colors.success : colors.primary
                          }}>
                            <FileText size={18} />
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: "13px", fontWeight: "600", color: colors.textMain, margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {file.name}
                            </p>
                            <p style={{ fontSize: "11px", color: colors.textMuted, margin: 0 }}>
                              {file.size}
                            </p>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            {status === 'processing' && (
                              <Loader2 size={18} className="animate-spin" style={{ color: colors.primary }} />
                            )}
                            {status === 'done' && (
                              <CheckCircle size={18} style={{ color: colors.success }} />
                            )}
                            {status === 'error' && (
                              <AlertCircle size={18} style={{ color: colors.error }} />
                            )}
                            {!status && !isProcessing && (
                              <button
                                onClick={() => removeFile(index)}
                                style={{
                                  padding: "6px",
                                  backgroundColor: "transparent",
                                  border: "none",
                                  cursor: "pointer",
                                  color: colors.textMuted,
                                  transition: "color 0.2s"
                                }}
                              >
                                <X size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{
              padding: "24px 32px",
              borderTop: `1px solid ${colors.border}`,
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              backgroundColor: "#fcfcfd"
            }}>
              <button
                onClick={handleClose}
                disabled={isProcessing}
                style={{
                  padding: "10px 24px",
                  backgroundColor: colors.white,
                  color: colors.textMain,
                  border: `1px solid ${colors.border}`,
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: isProcessing ? "not-allowed" : "pointer",
                  transition: "all 0.2s"
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAIProcess}
                disabled={uploadedFiles.length === 0 || isProcessing}
                style={{
                  padding: "10px 28px",
                  backgroundColor: colors.primary,
                  color: colors.white,
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: (uploadedFiles.length === 0 || isProcessing) ? "not-allowed" : "pointer",
                  opacity: (uploadedFiles.length === 0 || isProcessing) ? 0.6 : 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "all 0.3s ease",
                  boxShadow: (uploadedFiles.length === 0 || isProcessing) ? "none" : "0 4px 12px rgba(245, 129, 12, 0.2)"
                }}
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Process</span>
                  </>
                )}
              </button>
            </div>

            <style>
              {`
                @keyframes fadeIn {
                  from { opacity: 0; }
                  to { opacity: 1; }
                }
                @keyframes slideUp {
                  from { opacity: 0; transform: translateY(20px); }
                  to { opacity: 1; transform: translateY(0); }
                }
                .animate-spin {
                  animation: spin 1s linear infinite;
                }
                @keyframes spin {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
              `}
            </style>
          </div>
        </div>
      )}
    </>
  );
}

export default UploadTalentModal;
