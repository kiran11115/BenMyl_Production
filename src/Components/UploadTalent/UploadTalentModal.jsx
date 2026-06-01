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
    <div
      onClick={onClose}
      style={{
        position:"fixed", inset:0, zIndex:999999,
        background:"rgba(15,23,42,.75)", backdropFilter:"blur(8px)",
        display:"flex", alignItems:"center", justifyContent:"center",
        padding:16, animation:"ut-fadein .2s ease",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background:"#fff", borderRadius:20, width:"100%",
          maxWidth:480, maxHeight:"90vh", overflowY:"auto",
          boxShadow:"0 32px 80px rgba(0,0,0,.3)",
          animation:"ut-pop .28s cubic-bezier(.34,1.56,.64,1)",
        }}
      >
        {/* header */}
        <div style={{
          padding:"20px 22px 16px", borderBottom:"1px solid #f1f5f9",
          display:"flex", alignItems:"center", gap:12,
        }}>
          <div style={{
            width:42, height:42, borderRadius:12, flexShrink:0,
            background:"linear-gradient(135deg,#5b5bd6,#f59e0b)",
            display:"flex", alignItems:"center", justifyContent:"center",
            color:"#fff", fontSize:13, fontWeight:800,
          }}>{initials}</div>
          <div style={{flex:1, minWidth:0}}>
            <div style={{fontSize:13, fontWeight:700, color:"#1e293b", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{file.name}</div>
            <div style={{fontSize:11, color:"#94a3b8"}}>{file.size} · {ext}</div>
          </div>
          <button onClick={onClose} style={{background:"transparent", border:"none", cursor:"pointer", color:"#94a3b8", padding:6, borderRadius:8}}>
            <X size={18}/>
          </button>
        </div>
        {/* avatar */}
        <div style={{padding:"22px 22px 0", display:"flex", alignItems:"center", gap:14, marginBottom:18}}>
          <div style={{
            width:56, height:56, borderRadius:"50%", flexShrink:0,
            background:"linear-gradient(135deg,#0b5fe5,#09bac2)",
            display:"flex", alignItems:"center", justifyContent:"center",
            color:"#fff", fontSize:20, fontWeight:800,
          }}>{initials}</div>
          <div>
            <div style={{fontSize:15, fontWeight:700, color:"#1e293b"}}>{file.name.replace(/\.[^.]+$/,"")}</div>
            <div style={{fontSize:11, color:"#64748b", marginTop:2}}>Candidate Resume Document</div>
          </div>
        </div>
        {/* info rows */}
        <div style={{padding:"0 22px 18px"}}>
          {[
            {l:"File Name", v:file.name},
            {l:"File Size", v:file.size},
            {l:"Format",    v:ext},
            {l:"Status",    v:"Ready for AI parsing"},
          ].map(({l,v})=>(
            <div key={l} style={{display:"flex", alignItems:"center", padding:"9px 0", borderBottom:"1px solid #f8fafc"}}>
              <span style={{width:100, fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".5px", flexShrink:0}}>{l}</span>
              <span style={{fontSize:12, fontWeight:500, color:"#334155"}}>{v}</span>
            </div>
          ))}
          {/* AI note */}
          <div style={{
            marginTop:16, padding:"13px 15px",
            background:"linear-gradient(135deg,#fff7ed,#ffedd5)",
            border:"1.5px solid #fed7aa", borderRadius:12,
            display:"flex", gap:10, alignItems:"flex-start",
          }}>
            <Cpu size={15} style={{color:"#5b5bd6", flexShrink:0, marginTop:1}}/>
            <div>
              <div style={{fontSize:12, fontWeight:700, color:"#c2410c", marginBottom:3}}>AI Neural Parsing Ready</div>
              <div style={{fontSize:11, color:"#7c2d12", lineHeight:1.6}}>
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
    <div style={{
      background:"#fff", borderRadius:16, border:"1px solid #e8edf2",
      overflow:"hidden", boxShadow:"0 2px 12px rgba(0,0,0,.06)",
      marginBottom:20, fontFamily:"inherit",
    }}>
      {/* card header – Google multi-color dots */}
      <div style={{
        padding:"13px 20px", display:"flex",
        alignItems:"center", justifyContent:"space-between",
        borderBottom:"1px solid #f1f5f9",
        background:"linear-gradient(135deg,#f8faff 0%,#fff 100%)",
      }}>
        <div style={{display:"flex", alignItems:"center", gap:10}}>
          {/* Google-style colored dots */}
          <div style={{display:"flex", gap:4}}>
          <LoaderCircle size={13} style={{color:"#3b82f6"}} className="ut2-spin"/>
          </div>
          <span style={{fontSize:13, fontWeight:700, color:"#1e293b", letterSpacing:".2px"}}>Ingestion Pipeline</span>
        </div>
        {hasFiles && (
          <div style={{display:"flex", gap:6}}>
            <span style={{fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20, background:"#eff6ff", color:"#4285F4", border:"1.5px solid #bfdbfe"}}>
              {uploadedFiles.length} file{uploadedFiles.length!==1?"s":""}
            </span>
            {doneCount>0  && <span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,background:"#f0fdf4",color:"#34A853",border:"1.5px solid #bbf7d0"}}>✓ {doneCount}</span>}
            {errCount>0   && <span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,background:"#fef2f2",color:"#EA4335",border:"1.5px solid #fecaca"}}>✕ {errCount}</span>}
          </div>
        )}
      </div>

      {/* two-panel body */}
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:0}}>
        {/* left – dropzone */}
        <div style={{padding:"18px 20px", borderRight:"1px solid #f1f5f9"}}>
          <div
            className="ut2-drop"
            style={{
              border:`1.5px dashed ${dragActive?"#5b5bd6":"#cbd5e1"}`,
              borderRadius:12, padding:"28px 16px", textAlign:"center",
              background: dragActive?"#fffbf5":"#fafbfc",
              cursor: isProcessing?"not-allowed":"pointer",
              transition:"all .25s ease", minHeight:130,
              display:"flex", flexDirection:"column",
              alignItems:"center", justifyContent:"center", gap:8,
            }}
            onDragEnter={handleDrag} onDragLeave={handleDrag}
            onDragOver={handleDrag}  onDrop={handleDrop}
            onClick={()=>!isProcessing&&document.getElementById("ut2FileInput").click()}
          >
            <input id="ut2FileInput" type="file" multiple accept=".pdf,.zip,.rar"
              style={{display:"none"}} onChange={e=>e.target.files?.[0]&&addFiles(e.target.files)}
              disabled={isProcessing}/>
            <div style={{
              width:42, height:42, borderRadius:10, marginBottom:4,
              background: dragActive?"linear-gradient(135deg,#fff7ed,#ffedd5)":"#f1f5f9",
              display:"flex", alignItems:"center", justifyContent:"center",
              color: dragActive?"#5b5bd6":"#94a3b8",
              border:`1.5px solid ${dragActive?"#4c4cc021":"#e2e8f0"}`,
              transition:"all .25s",
            }}>
              <Upload size={20}/>
            </div>
            <div style={{fontSize:12, fontWeight:700, color:"#334155"}}>
              {dragActive?"Drop your files here":"Drag & drop candidate CVs or click to pick"}
            </div>
            <div style={{fontSize:11, color:"#94a3b8", lineHeight:1.5}}>
              Accepted parameters: PDF, ZIP up to 12 MB.{"\n"}Supports Bulk processing simultaneously.
            </div>
          </div>

          {/* file rows */}
          {hasFiles && (
            <div style={{marginTop:12, display:"flex", flexDirection:"column", gap:5}}>
              {/* scrollable file list */}
              <div style={{
                maxHeight:180, overflowY:"auto", display:"flex", flexDirection:"column", gap:5,
                paddingRight:4,
                scrollbarWidth:"thin",
                scrollbarColor:"#e2e8f0 transparent",
              }}>
              {uploadedFiles.map((file,i)=>{
                const st = fileStatuses[i];
                return (
                  <div key={i} className="ut2-file-row" style={{
                    display:"flex", alignItems:"center", gap:8,
                    padding:"8px 10px", borderRadius:9,
                    border:`1px solid ${st==="error"?"#fecaca":st==="done"?"#bbf7d0":"#f1f5f9"}`,
                    background: st==="error"?"#fef2f2":st==="done"?"#f0fdf4":"#fff",
                    transition:"all .2s ease",
                  }}>
                    <div style={{
                      width:28, height:28, borderRadius:7, flexShrink:0,
                      background: st==="error"?"#fee2e2":st==="done"?"#dcfce7":"#fff7ed",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      color: st==="error"?"#dc2626":st==="done"?"#16a34a":"#d6ab5bff",
                    }}>
                      <FileText size={13}/>
                    </div>
                    <div style={{flex:1, minWidth:0}}>
                      <div style={{fontSize:11, fontWeight:600, color:"#1e293b", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{file.name}</div>
                      <div style={{fontSize:10, color:"#94a3b8"}}>{file.size}</div>
                    </div>
                    {/* progress bar */}
                    {st==="processing" && (
                      <div style={{width:44, height:3, background:"#f1f5f9", borderRadius:999, overflow:"hidden", flexShrink:0}}>
                        <div style={{height:"100%", background:"linear-gradient(90deg,#5b5bd6,#f59e0b)", animation:"ut-bar 1.6s ease infinite", borderRadius:999}}/>
                      </div>
                    )}
                    <div style={{display:"flex", alignItems:"center", gap:4, flexShrink:0}}>
                      {st==="processing" && <Loader2 size={13} className="ut2-spin" style={{color:"#5b5bd6"}}/>}
                      {st==="done"       && <CheckCircle size={13} style={{color:"#16a34a"}}/>}
                      {st==="error"      && <AlertCircle size={13} style={{color:"#dc2626"}}/>}
                      {!st && !isProcessing && (<>
                        <button onClick={e=>{e.stopPropagation();setPreviewFile(file);}}
                          style={{background:"transparent",border:"1px solid #e2e8f0",cursor:"pointer",
                            color:"#64748b",padding:"3px 7px",borderRadius:6,fontSize:10,fontWeight:600,
                            display:"flex",alignItems:"center",gap:3, transition:"all .15s"}}>
                          <Eye size={10}/> View
                        </button>
                        <button onClick={()=>removeFile(i)}
                          style={{background:"transparent",border:"none",cursor:"pointer",color:"#94a3b8",padding:3,borderRadius:5}}>
                          <X size={12}/>
                        </button>
                      </>)}
                    </div>
                  </div>
                );
              })}
              </div>{/* end scroll wrapper */}
              {/* actions */}
              <div style={{display:"flex", gap:7, justifyContent:"flex-end", marginTop:8}}>
                <button className="ut2-btn-clear" onClick={handleClose} disabled={isProcessing}
                  style={{padding:"7px 16px",borderRadius:8,border:"1px solid #e2e8f0",
                    background:"#fff",color:"#64748b",fontSize:11,fontWeight:600,
                    cursor:isProcessing?"not-allowed":"pointer",transition:"all .2s"}}>
                  Clear
                </button>
                <button className="quick-create-btn" onClick={handleProcess}
                  disabled={!uploadedFiles.length||isProcessing}
                  style={{padding:"7px 18px",borderRadius:8,border:"none",
                    color:"#fff",fontSize:11,fontWeight:700,
                    cursor:(!uploadedFiles.length||isProcessing)?"not-allowed":"pointer",
                    opacity:(!uploadedFiles.length||isProcessing)?.6:1,
                    display:"flex",alignItems:"center",gap:6,transition:"all .25s ease",
                    boxShadow:"0 4px 14px rgba(245,129,12,.28)"}}>
                  {isProcessing
                    ? <><Loader2 size={12} className="ut2-spin"/> Processing {procCount>0?`${procCount}…`:"…"}</>
                    : <><CloudUpload size={12}/> Process {uploadedFiles.length} File{uploadedFiles.length!==1?"s":""}</>}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* right – neural parsing status */}
        <div style={{
          padding:"28px 20px", display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center", gap:12,
          background:"#fafbfc", textAlign:"center", minHeight:200,
        }}>
          <div style={{
            width:48, height:48, borderRadius:12,
            background: (hasFiles || waitingForRefresh) ? "linear-gradient(135deg,#0b5fe5,#09bac2)" : "#f1f5f9",
            display:"flex", alignItems:"center", justifyContent:"center",
            transition:"all .3s ease",
            boxShadow: (hasFiles || waitingForRefresh) ? "0 6px 20px rgba(11,95,229,.25)" : "none",
          }}>
            {waitingForRefresh ? (
              <Loader2 size={22} className="ut2-spin" style={{color: "#fff"}}/>
            ) : (
              <Cpu size={22} style={{color: (hasFiles || waitingForRefresh) ? "#fff" : "#94a3b8"}}/>
            )}
          </div>
          <div>
            <div style={{fontSize:10, fontWeight:800, color:"#94a3b8", letterSpacing:"1.2px", textTransform:"uppercase", marginBottom:6}}>
              {waitingForRefresh ? "AI Extraction in Progress" : isProcessing ? "Neural Parsing Active" : "Ready for Neural Parsing"}
            </div>
            <div style={{fontSize:11, color:"#64748b", lineHeight:1.6, maxWidth:240, margin:"0 auto"}}>
              {waitingForRefresh
                ? (
                  <>
                    <span className="ut2-pulse" style={{color:"#0b5fe5",fontWeight:600, display:"block", marginBottom:2}}>
                      Analyzing {uploadCount} resume{uploadCount !== 1 ? 's' : ''}…
                    </span>
                    {countdown > 0 && <span style={{color:"#64748b"}}>Estimated time remaining: <strong>{countdown}s</strong></span>}
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
            <div style={{width:80, height:4, background:"#e2e8f0", borderRadius:999, overflow:"hidden", marginTop:4}}>
              <div style={{height:"100%", background:"linear-gradient(90deg,#0b5fe5,#09bac2)", animation:"ut-bar 1.8s ease-in-out infinite", borderRadius:999}}/>
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
        <div onClick={handleClose} style={{
          position:"fixed",inset:0,zIndex:10000,
          background:"rgba(15,23,42,.65)",backdropFilter:"blur(4px)",
          display:"flex",alignItems:"flex-end",justifyContent:"center",
          animation:"ut-fadein .3s ease",
        }}>
          <div onClick={e=>e.stopPropagation()} style={{
            background:"#fff",borderRadius:"24px 24px 0 0",
            width:"100%",maxWidth:720,maxHeight:"90vh",overflowY:"auto",
            boxShadow:"0 -10px 40px rgba(0,0,0,.2)",
            animation:"ut-slideup .4s cubic-bezier(.165,.84,.44,1)",
          }}>
            <div style={{padding:"22px 28px 16px",borderBottom:"1px solid #f1f5f9",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#5b5bd6,#f59e0b)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <CloudUpload size={18} color="#fff"/>
                </div>
                <div>
                  <div style={{fontSize:14,fontWeight:700,color:"#1e293b"}}>Upload Talent</div>
                  <div style={{fontSize:11,color:"#94a3b8"}}>AI-powered resume ingestion pipeline</div>
                </div>
              </div>
              <button onClick={handleClose} style={{background:"transparent",border:"none",cursor:"pointer",color:"#94a3b8",padding:8,borderRadius:8}}><X size={18}/></button>
            </div>
            <div style={{padding:"18px 28px 28px"}}>{renderPipeline()}</div>
          </div>
        </div>
      )}
    </>
  );
}

export default UploadTalentModal;
