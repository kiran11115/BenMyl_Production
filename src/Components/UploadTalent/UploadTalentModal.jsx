import React, { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUploadProfilesMutation } from "../../State-Management/Api/UploadResumeApiSlice";

function UploadTalentModal({
  buttonText = "Upload Talent",
  buttonStyle = {},
  onSuccess,
  show = false,
  onHide,
  onShow,
}) {
  const [showModal, setShowModal] = useState(show);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
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
    const fileArray = Array.from(files).map((file) => ({
      name: file.name,
      size: (file.size / 1024).toFixed(2) + " KB",
      file: file,
    }));
    setUploadedFiles([...uploadedFiles, ...fileArray]);
  };

  const removeFile = (index) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const [uploadProfiles] = useUploadProfilesMutation();

const handleAIProcess = async () => {
  if (uploadedFiles.length === 0) return;

  setIsProcessing(true);

  try {
    const formData = new FormData();

    // ✅ multiple files (same key: "file")
    uploadedFiles.forEach((item) => {
      formData.append("file", item.file);
    });

    // ✅ required metadata
    formData.append("companyid", 0);
    formData.append("branchid", 0);
    formData.append("userid", 0);
    formData.append("sessionid", "hii");

    await uploadProfiles(formData).unwrap();
    onSuccess?.();
    if (onSuccess) {
      onSuccess(`Successfully uploaded ${uploadedFiles.length} resume(s)`);
    }

    handleClose();

    navigate("/user/user-upload-talent", {
      state: { files: uploadedFiles },
    });

  } catch (error) {
    console.error("Upload failed", error);
    if (onSuccess) {
      onSuccess("Failed to upload resumes");
    }
  } finally {
    setIsProcessing(false);
  }
};


  const handleClose = () => {
    setUploadedFiles([]);
    setDragActive(false);
    setShowModal(false);
    if (onHide) {
      onHide();
    }
  };

  const handleOpen = () => {
    setShowModal(true);
    if (onShow) {
      onShow();
    }
  };

  // Default button style
  const defaultButtonStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    padding: "8px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    backgroundColor: "#6843c7",
    color: "#ffffff",
    border: "1px solid #6843c7",
    transition: "all 0.2s ease",
  };

  // Styles
  const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "1rem",
    overflowY: "auto",
  };

  const modalContentStyle = {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: isMobile ? "1.5rem" : "2rem",
    maxWidth: isMobile ? "95%" : "700px",
    width: "100%",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    animation: "slideIn 0.3s ease-out",
  };

  const modalHeaderStyle = {
    fontSize: isMobile ? "20px" : "25px",
    fontWeight: "700",
    color: "#292d34",
    marginBottom: "0.5rem",
  };

  const modalSubtitleStyle = {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "1.5rem",
  };

  const dropZoneStyle = {
    border: `2px dashed ${dragActive ? "#2744a0" : "#d1d5db"}`,
    borderRadius: "12px",
    padding: isMobile ? "2rem 1rem" : "3rem 2rem",
    textAlign: "center",
    backgroundColor: dragActive ? "#f0f4ff" : "#f9fafb",
    cursor: "pointer",
    transition: "all 0.3s",
    marginBottom: "1rem",
  };

  const buttonGroupStyle = {
    display: "flex",
    gap: "1rem",
    justifyContent: "flex-end",
    marginTop: "2rem",
    paddingTop: "1.5rem",
    borderTop: "1px solid #e5e7eb",
    flexWrap: "wrap",
  };

  const cancelButtonStyle = {
    padding: "0.75rem 1.5rem",
    backgroundColor: "transparent",
    color: "#6b7280",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  };

  const saveButtonStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    padding: "8px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    backgroundColor: "#6843c7",
    color: "#ffffff",
    border: "1px solid #6843c7",
    transition: "all 0.2s ease",
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={handleOpen}
        style={{ ...defaultButtonStyle, ...buttonStyle }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(39, 68, 160, 0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <Upload size={18} />
        <span>{buttonText}</span>
      </button>

      {/* Modal */}
      {showModal && (
        <>
          <style>
            {`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
              @keyframes slideIn {
                from {
                  opacity: 0;
                  transform: translateY(-20px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}
          </style>
          <div style={modalOverlayStyle} onClick={handleClose}>
            <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
              <h2 style={modalHeaderStyle}>Import Talent with Resumes</h2>
              <p style={modalSubtitleStyle}>
                Upload resumes and let AI extract talent information
              </p>

              <div
                style={dropZoneStyle}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() =>
                  document.getElementById("bulkUploadFileInput").click()
                }
              >
                <Upload
                  size={48}
                  style={{ color: "#2744a0", margin: "0 auto 1rem" }}
                />
                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#111827",
                    marginBottom: "0.5rem",
                  }}
                >
                  Drop your resume files here
                </p>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#6b7280",
                    marginBottom: "1rem",
                  }}
                >
                  or click to browse
                </p>
                <p style={{ fontSize: "12px", color: "#9ca3af" }}>
                  Supports PDF, DOC, DOCX (Max 10MB each)
                </p>
                <input
                  id="bulkUploadFileInput"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </div>

              {uploadedFiles.length > 0 && (
                <div style={{ marginBottom: "1rem" }}>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#111827",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Uploaded Files ({uploadedFiles.length})
                  </p>
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0.75rem",
                        backgroundColor: "#f9fafb",
                        borderRadius: "8px",
                        marginBottom: "0.5rem",
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            fontSize: "13px",
                            fontWeight: "600",
                            color: "#111827",
                            marginBottom: "0.25rem",
                          }}
                        >
                          {file.name}
                        </p>
                        <p style={{ fontSize: "12px", color: "#6b7280" }}>
                          {file.size}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        style={{
                          padding: "0.5rem",
                          backgroundColor: "transparent",
                          border: "none",
                          cursor: "pointer",
                          color: "#dc2626",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div style={buttonGroupStyle}>
                <button
                  style={cancelButtonStyle}
                  onClick={handleClose}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f3f4f6")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  Cancel
                </button>
                <button
                  style={{
                    ...saveButtonStyle,
                    opacity:
                      uploadedFiles.length === 0 || isProcessing ? 0.5 : 1,
                    cursor:
                      uploadedFiles.length === 0 || isProcessing
                        ? "not-allowed"
                        : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                  onClick={handleAIProcess}
                  disabled={uploadedFiles.length === 0 || isProcessing}
                  onMouseEnter={(e) => {
                    if (uploadedFiles.length > 0 && !isProcessing) {
                      e.currentTarget.style.backgroundColor = "#1e3a8a";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (uploadedFiles.length > 0 && !isProcessing) {
                      e.currentTarget.style.backgroundColor = "#6843c7";
                    }
                  }}
                >
                  {isProcessing ? (
                    <>
                      <div
                        style={{
                          width: "16px",
                          height: "16px",
                          border: "2px solid #ffffff",
                          borderTopColor: "transparent",
                          borderRadius: "50%",
                          animation: "spin 0.6s linear infinite",
                        }}
                      />
                      <span>Processing...</span>
                    </>
                  ) : (
                    "Process"
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default UploadTalentModal;
