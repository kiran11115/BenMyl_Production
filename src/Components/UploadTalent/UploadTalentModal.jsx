import React, { useState, useEffect } from "react";
import { Upload, X, FileText, CheckCircle, AlertCircle, Loader2, CloudUpload, Eye, Cpu, LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUploadProfilesMutation } from "../../State-Management/Api/UploadResumeApiSlice";

const injectStyles = () => {
  if (typeof document === "undefined" || document.head.querySelector("[data-ut2]")) return;
  const s = document.createElement("style");
  s.setAttribute("data-ut2", "true");
  s.textContent = `
    @keyframes ut-spin    { to { transform: rotate(360deg); } }
    @keyframes ut-fadein  { from { opacity:0 } to { opacity:1 } }
    @keyframes ut-slideup { from { opacity:0; transform:translateY(100%) } to { opacity:1; transform:translateY(0) } }
    @keyframes ut-pop     { from { opacity:0; transform:scale(.94) } to { opacity:1; transform:scale(1) } }
    @keyframes ut-bar     { 0%{width:0%} 60%{width:80%} 100%{width:100%} }
    @keyframes ut-pulse   { 0%,100%{opacity:1} 50%{opacity:.35} }
    .ut2-spin  { animation: ut-spin  .85s linear infinite; }
    .ut2-pulse { animation: ut-pulse 1.3s ease infinite; }
    .ut2-drop:hover { border-color: #5b5bd6 !important; background: #f5f8ff !important; }
    .ut2-file-row:hover { background: #f8fafc !important; }
    .ut2-btn-proc:hover:not(:disabled) { filter: brightness(1.08); transform: translateY(-1px); }
    .ut2-btn-clear:hover:not(:disabled) { background: #f1f5f9 !important; }
  `;
  document.head.appendChild(s);
};
injectStyles();

/* ── Centered Preview Modal ─────────────────────────────────────── */
function PreviewModal({ file, onClose }) {
  if (!file) return null;
  const ext = file.name.split(".").pop().toUpperCase();
  const initials = file.name.slice(0, 2).toUpperCase();
  return (
    <div onClick={onClose} className="utm-preview-overlay">
      <div onClick={e => e.stopPropagation()} className="utm-preview-window">
        {/* header */}
        <div className="utm-preview-header">
          <div className="utm-preview-avatar-mini">{initials}</div>
          <div className="utm-preview-header-info">
            <div className="utm-preview-filename">{file.name}</div>
            <div className="utm-preview-filesize">{file.size} · {ext}</div>
          </div>
          <button onClick={onClose} className="utm-close-btn">
            <X size={18}/>
          </button>
        </div>
        {/* avatar */}
        <div className="utm-preview-avatar-section">
          <div className="utm-preview-avatar-large">{initials}</div>
          <div>
            <div className="utm-preview-candidate-name">{file.name.replace(/\.[^.]+$/,"")}</div>
            <div className="utm-preview-candidate-sub">Candidate Resume Document</div>
          </div>
        </div>
        {/* info rows */}
        <div className="utm-preview-info-section">
          {[
            {l:"File Name", v:file.name},
            {l:"File Size", v:file.size},
            {l:"Format",    v:ext},
            {l:"Status",    v:"Ready for AI parsing"},
          ].map(({l,v})=>(
            <div key={l} className="utm-preview-info-row">
              <span className="utm-preview-info-label">{l}</span>
              <span className="utm-preview-info-val">{v}</span>
            </div>
          ))}
          {/* AI note */}
          <div className="utm-preview-note">
            <Cpu size={15} style={{color:"#5b5bd6", flexShrink:0, marginTop:3}}/>
            <div>
              <div style={{fontSize:12, fontWeight:700, color:"#c2410c", marginBottom:3}}>AI Neural Parsing Ready</div>
              <div className="utm-preview-note-desc">
                BenMyl AI will extract skills, experiences, and profile dimensions from this document automatically.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main ─────────────────────────────────────────────────────────── */
function UploadTalentModal({
  buttonText = "Upload Talent",
  onSuccess, show = false, onHide, onShow, onUploading,
  hideButton = false, inline = false,
  waitingForRefresh = false, countdown = 0, uploadCount = 0,
}) {
  const [showModal,    setShowModal]    = useState(show);
  const [dragActive,   setDragActive]   = useState(false);
  const [uploadedFiles,setUploadedFiles]= useState([]);
  const [fileStatuses, setFileStatuses] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewFile,  setPreviewFile]  = useState(null);
  const navigate = useNavigate();

  useEffect(()=>{ setShowModal(show); },[show]);

  const handleDrag = e => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(e.type==="dragenter"||e.type==="dragover");
  };
  const handleDrop = e => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) addFiles(e.dataTransfer.files);
  };
  const addFiles = files => {
    const base = uploadedFiles.length;
    setUploadedFiles(prev=>[...prev, ...Array.from(files).map((f,i)=>({
      name:f.name, size:(f.size/1024).toFixed(1)+" KB", file:f, index:base+i,
    }))]);
  };
  const removeFile = i => {
    if (isProcessing) return;
    setUploadedFiles(prev=>prev.filter((_,idx)=>idx!==i));
    setFileStatuses(prev=>{ const n={...prev}; delete n[i]; return n; });
  };

  const [uploadProfiles] = useUploadProfilesMutation();

  const handleProcess = async () => {
    if (!uploadedFiles.length) return;
    if (typeof onUploading==="function") onUploading(true);
    setIsProcessing(true);
    const init={};
    uploadedFiles.forEach((_,i)=>{ init[i]="processing"; });
    setFileStatuses(init);
    try {
      const fd = new FormData();
      uploadedFiles.forEach(f=>fd.append("file",f.file));
      fd.append("companyid", Number(localStorage.getItem("logincompanyid"))||0);
      fd.append("branchid",0); fd.append("userid",0);
      fd.append("sessionid","upload_session_"+Date.now());
      await uploadProfiles(fd).unwrap();
      const done={};
      uploadedFiles.forEach((_,i)=>{ done[i]="done"; });
      setFileStatuses(done);
      if (onSuccess) onSuccess(`Successfully uploaded ${uploadedFiles.length} resume(s)`);
      setTimeout(()=>{
        handleClose();
      },1000);
    } catch(err) {
      console.error("Upload failed",err);
      const e={};
      uploadedFiles.forEach((_,i)=>{ e[i]="error"; });
      setFileStatuses(e);
      if (onSuccess) onSuccess("Failed to upload resumes. Please try again.");
    } finally {
      setIsProcessing(false);
      if (typeof onUploading==="function") onUploading(false);
    }
  };

  const handleClose = () => {
    if (isProcessing) return;
    setUploadedFiles([]); setFileStatuses({}); setDragActive(false);
    setShowModal(false); onHide?.();
  };

  const doneCount  = Object.values(fileStatuses).filter(s=>s==="done").length;
  const errCount   = Object.values(fileStatuses).filter(s=>s==="error").length;
  const procCount  = Object.values(fileStatuses).filter(s=>s==="processing").length;
  const hasFiles   = uploadedFiles.length > 0;

  /* ── Ingestion Pipeline card ────────────────────────────────── */
  const renderPipeline = () => (
    <div className="utm-pipeline-card">
      {/* card header – Google multi-color dots */}
      <div className="utm-pipeline-header">
        <div className="utm-pipeline-header-left">
          <LoaderCircle size={13} style={{color:"#3b82f6"}} className="ut2-spin"/>
          <span className="utm-pipeline-header-title">Ingestion Pipeline</span>
        </div>
        {hasFiles && (
          <div className="utm-pipeline-badge-group">
            <span className="utm-badge-file">
              {uploadedFiles.length} file{uploadedFiles.length!==1?"s":""}
            </span>
            {doneCount>0  && <span className="utm-badge-done">✓ {doneCount}</span>}
            {errCount>0   && <span className="utm-badge-error">✕ {errCount}</span>}
          </div>
        )}
      </div>

      {/* two-panel body */}
      <div className="utm-pipeline-body">
        {/* left – dropzone */}
        <div className="utm-dropzone-panel">
          <div
            className="utm-dropzone ut2-drop"
            style={{
              border:`1.5px dashed ${dragActive?"#5b5bd6":"#cbd5e1"}`,
              background: dragActive?"#fffbf5":"#fafbfc",
              cursor: isProcessing?"not-allowed":"pointer",
            }}
            onDragEnter={handleDrag} onDragLeave={handleDrag}
            onDragOver={handleDrag}  onDrop={handleDrop}
            onClick={()=>!isProcessing&&document.getElementById("ut2FileInput").click()}
          >
            <input id="ut2FileInput" type="file" multiple accept=".pdf,.zip,.rar"
              style={{display:"none"}} onChange={e=>e.target.files?.[0]&&addFiles(e.target.files)}
              disabled={isProcessing}/>
            <div className="utm-dropzone-icon" style={{
              background: dragActive?"linear-gradient(135deg,#fff7ed,#ffedd5)":"#f1f5f9",
              color: dragActive?"#5b5bd6":"#94a3b8",
              border:`1.5px solid ${dragActive?"#4c4cc021":"#e2e8f0"}`,
            }}>
              <Upload size={20}/>
            </div>
            <div className="utm-dropzone-title">
              {dragActive?"Drop your files here":"Drag & drop candidate CVs or click to pick"}
            </div>
            <div className="utm-dropzone-desc">
              {"Accepted parameters: PDF, ZIP up to 12 MB.\nSupports Bulk processing simultaneously."}
            </div>
          </div>

          {/* file rows */}
          {hasFiles && (
            <div className="utm-file-list">
              {/* scrollable file list */}
              <div className="utm-file-scroll">
              {uploadedFiles.map((file,i)=>{
                const st = fileStatuses[i];
                return (
                  <div key={i} className="utm-file-row ut2-file-row" style={{
                    border:`1px solid ${st==="error"?"#fecaca":st==="done"?"#bbf7d0":"#f1f5f9"}`,
                    background: st==="error"?"#fef2f2":st==="done"?"#f0fdf4":"#fff",
                  }}>
                    <div className="utm-file-icon" style={{
                      background: st==="error"?"#fee2e2":st==="done"?"#dcfce7":"#fff7ed",
                      color: st==="error"?"#dc2626":st==="done"?"#16a34a":"#d6ab5bff",
                    }}>
                      <FileText size={13}/>
                    </div>
                    <div className="utm-file-info">
                      <div className="utm-file-name">{file.name}</div>
                      <div className="utm-file-size">{file.size}</div>
                    </div>
                    {/* progress bar */}
                    {st==="processing" && (
                      <div className="utm-file-progress-track">
                        <div className="utm-file-progress-bar"/>
                      </div>
                    )}
                    <div className="utm-file-actions">
                      {st==="processing" && <Loader2 size={13} className="ut2-spin" style={{color:"#5b5bd6"}}/>}
                      {st==="done"       && <CheckCircle size={13} style={{color:"#16a34a"}}/>}
                      {st==="error"      && <AlertCircle size={13} style={{color:"#dc2626"}}/>}
                      {!st && !isProcessing && (<>
                        <button onClick={e=>{e.stopPropagation();setPreviewFile(file);}} className="utm-btn-view">
                          <Eye size={10}/> View
                        </button>
                        <button onClick={()=>removeFile(i)} className="utm-btn-delete">
                          <X size={12}/>
                        </button>
                      </>)}
                    </div>
                  </div>
                );
              })}
              </div>{/* end scroll wrapper */}
              {/* actions */}
              <div className="utm-actions-row">
                <button className="btn-secondary" onClick={handleClose} disabled={isProcessing}>
                  Clear
                </button>
                <button className="quick-create-btn" onClick={handleProcess}
                  disabled={!uploadedFiles.length||isProcessing}
                  style={{
                    opacity:(!uploadedFiles.length||isProcessing)?.6:1,
                    cursor:(!uploadedFiles.length||isProcessing)?"not-allowed":"pointer",
                  }}>
                  {isProcessing
                    ? <><Loader2 size={12} className="ut2-spin"/> Processing {procCount>0?`${procCount}…`:"…"}</>
                    : <><CloudUpload size={12}/> Process {uploadedFiles.length} File{uploadedFiles.length!==1?"s":""}</>}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* right – neural parsing status */}
        <div className="utm-neural-panel">
          <div className="utm-neural-icon-wrap" style={{
            background: (hasFiles || waitingForRefresh) ? "linear-gradient(135deg,#0b5fe5,#09bac2)" : "#f1f5f9",
            boxShadow: (hasFiles || waitingForRefresh) ? "0 6px 20px rgba(11,95,229,.25)" : "none",
          }}>
            {waitingForRefresh ? (
              <Loader2 size={22} className="ut2-spin" style={{color: "#fff"}}/>
            ) : (
              <Cpu size={22} style={{color: (hasFiles || waitingForRefresh) ? "#fff" : "#94a3b8"}}/>
            )}
          </div>
          <div>
            <div className="utm-neural-status">
              {waitingForRefresh ? "AI Extraction in Progress" : isProcessing ? "Neural Parsing Active" : "Ready for Neural Parsing"}
            </div>
            <div className="utm-neural-desc">
              {waitingForRefresh
                ? (
                  <>
                    <span className="ut2-pulse" style={{color:"#0b5fe5",fontWeight:600, display:"block", marginBottom:2}}>
                      Analyzing {uploadCount} resume{uploadCount !== 1 ? 's' : ''}…
                    </span>
                    {countdown > 0 && <span>Estimated time remaining: <strong>{countdown}s</strong></span>}
                  </>
                )
                : isProcessing
                ? <span className="ut2-pulse" style={{color:"#0b5fe5",fontWeight:600}}>Uploading {procCount} file{procCount!==1?"s":""}…</span>
                : hasFiles
                  ? "Files staged. Click Process to begin AI extraction."
                  : "Select or drag a CV on the left coordinate field. BenMyl AI will extract key vectors, experiences, missing criteria, and preview the profile index instantly."}
            </div>
          </div>
          {(isProcessing || waitingForRefresh) && (
            <div className="utm-neural-progress-track">
              <div className="utm-neural-progress-bar"/>
            </div>
          )}
        </div>
      </div>

      {/* preview modal */}
      {previewFile && <PreviewModal file={previewFile} onClose={()=>setPreviewFile(null)}/>}
    </div>
  );

  if (inline) return renderPipeline();

  return (
    <>
      {!hideButton && (
        <button onClick={()=>{setShowModal(true);onShow?.();}} className="routine-btn">
          <Upload size={16}/><span>{buttonText}</span>
        </button>
      )}
      {showModal && (
        <div onClick={handleClose} className="utm-overlay">
          <div onClick={e=>e.stopPropagation()} className="utm-window">
            <div className="utm-drag-handle" />
            <div className="utm-header">
              <div className="utm-header-title-wrap">
                <div className="utm-header-title-icon">
                  <CloudUpload size={18} color="#fff"/>
                </div>
                <div>
                  <h3 className="utm-header-title">Upload Talent</h3>
                  <div className="utm-header-subtitle">AI-powered resume ingestion pipeline</div>
                </div>
              </div>
              <button onClick={handleClose} className="utm-close-btn"><X size={18}/></button>
            </div>
            <div className="utm-content">{renderPipeline()}</div>
          </div>
        </div>
      )}
    </>
  );
}

export default UploadTalentModal;
