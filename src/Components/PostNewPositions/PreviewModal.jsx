import React, { useState } from "react";
import {
  FiX,
  FiCopy,
  FiLinkedin,
  FiFacebook,
  FiMail,
  FiDownload,
  FiCpu,
  FiEye,
  FiCheck,
  FiLayout,
  FiMaximize2,
  FiMinimize2,
  FiLock,
  FiClock,
  FiZap
} from "react-icons/fi";
import { FaBuilding } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";
import { useLazyGetLinkedInAuthUrlPostJobQuery, useSaveHotlistImageMutation } from "../../State-Management/Api/UploadResumeApiSlice";
import { useGetCompanyProfileEditQuery } from "../../State-Management/Api/CompanyProfileApiSlice";

// Alerts
import { SubmissionErrorModal, SuccessModal } from "./Alterts";
import "./PostNewPositions.css";

/* ── Template + Size Definitions ── */
const TEMPLATES = [
  { id: "modern", name: "Modern", tag: "Free", tagType: "free", desc: "Clean gradient design with accent colours" },
  { id: "classic", name: "Classic Table", tag: "Free", tagType: "free", desc: "Professional minimal layout" },
  { id: "darkpro", name: "Dark Pro", tag: "Pro", tagType: "subscription", desc: "Sleek dark-mode grid layout" },
  { id: "cards", name: "Pro Cards", tag: "Pro", tagType: "subscription", desc: "Premium card-based layout" },
];

const SIZES = [
  { id: "small", name: "Small",  icon: <FiMinimize2 size={13} />, desc: "Trimmed details – great for social thumbnails" },
  { id: "a4",    name: "A4",     icon: <FiMaximize2 size={13} />, desc: "Full details – ideal for document-style posts"  },
];

/* ─── Template Previews (mini thumbnails) ─── */
function TemplateMini({ id }) {
  if (id === "modern")
    return (
      <div style={{ width: "100%", height: "100%", background: "#fff", borderRadius: 6, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ background: "linear-gradient(135deg, #1e3a8a, #3b82f6)", height: 14, display: "flex", alignItems: "center", paddingLeft: 6, gap: 3 }}>
          {[1,2].map(i => <div key={i} style={{ width: 12, height: 4, background: "rgba(255,255,255,0.4)", borderRadius: 2 }} />)}
        </div>
        <div style={{ padding: "4px" }}>
          <div style={{ width: "80%", height: 4, background: "#e2e8f0", borderRadius: 2, marginBottom: 3 }} />
          <div style={{ width: "60%", height: 3, background: "#f1f5f9", borderRadius: 2 }} />
        </div>
      </div>
    );

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

  return null;
}

/* ─────────────────────────────────────────────────────────
   MODERN TEMPLATE  (Small)
───────────────────────────────────────────────────────── */
function ModernSmall({ jobTitle, companyName, location, employmentType, workModel, experienceLevel, skills }) {
  return (
    <div id="post-capture-area" style={{
      width: "100%", background: "#ffffff",
      fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",
      borderRadius: 12, overflow: "hidden",
      boxShadow: "0 1px 3px rgba(60,64,67,0.3),0 4px 8px rgba(60,64,67,0.15)"
    }}>
      {/* Top accent bar */}
      <div style={{ display: "flex", height: 5 }}>
        {["#4285F4","#EA4335","#FBBC05","#34A853"].map((c,i) => <div key={i} style={{ flex:1, background: c }} />)}
      </div>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg,#1e3a8a,#3b82f6)", padding: "22px 28px" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(255,255,255,0.15)", borderRadius:20, padding:"4px 12px", fontSize:10, fontWeight:700, color:"#e0f2fe", marginBottom:10 }}>
          <div style={{ width:6,height:6,background:"#34A853",borderRadius:"50%" }} /> Active Opportunity
        </div>
        <div style={{ fontSize:20, fontWeight:800, color:"#fff", lineHeight:1.3 }}>{jobTitle}</div>
        <div style={{ fontSize:12, color:"rgba(255,255,255,0.85)", marginTop:4 }}>{companyName}</div>
      </div>
      {/* Tags */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", padding:"14px 28px", borderBottom:"1px solid #f1f5f9" }}>
        {[location, employmentType, workModel].map((t,i) => (
          <span key={i} style={{ background:"#eff6ff", color:"#1d4ed8", border:"1px solid #bfdbfe", borderRadius:6, padding:"4px 10px", fontSize:11, fontWeight:600 }}>{t}</span>
        ))}
      </div>
      {/* Quick info */}
      <div style={{ padding:"14px 28px", display:"flex", gap:16, alignItems:"center" }}>
        <div style={{ fontSize:11, color:"#64748b" }}>Experience: <strong style={{ color:"#0f172a" }}>{experienceLevel}</strong></div>
        {skills.slice(0,3).map((s,i) => (
          <span key={i} style={{ background:"#f0fdf4", color:"#16a34a", border:"1px solid #bbf7d0", borderRadius:4, padding:"2px 8px", fontSize:10, fontWeight:600 }}>{s}</span>
        ))}
        {skills.length > 3 && <span style={{ fontSize:10, color:"#94a3b8", fontWeight:600 }}>+{skills.length-3} more</span>}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MODERN TEMPLATE  (A4)
───────────────────────────────────────────────────────── */
function ModernA4({ jobTitle, companyName, location, employmentType, workModel, experienceLevel, educationLevel, salaryDisplay, department, description, skills, postLink, formatMarkdownToHtml }) {
  return (
    <div id="post-capture-area" style={{
      width: "100%", background: "#ffffff",
      fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",
      color: "#202124", boxShadow: "0 1px 3px rgba(60,64,67,0.3),0 4px 8px rgba(60,64,67,0.15)",
      display: "flex", flexDirection: "column", boxSizing: "border-box",
      overflow: "hidden", borderRadius: 8
    }}>
      {/* Top accent bar */}
      <div style={{ height: "6px", display: "flex" }}>
        {["#4285F4","#EA4335","#FBBC05","#34A853"].map((c,i) => <div key={i} style={{ flex:1, background: c }} />)}
      </div>

      {/* Background orbs */}
      <div style={{ position:"absolute", top:0, left:0, right:0, bottom:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"-100px", right:"-100px", width:"500px", height:"500px", background:"radial-gradient(circle,rgba(66,133,244,0.08) 0%,rgba(255,255,255,0) 70%)", borderRadius:"50%", filter:"blur(40px)" }} />
        <div style={{ position:"absolute", bottom:"-150px", left:"-100px", width:"600px", height:"600px", background:"radial-gradient(circle,rgba(52,168,83,0.06) 0%,rgba(255,255,255,0) 70%)", borderRadius:"50%", filter:"blur(60px)" }} />
      </div>

      <div style={{ padding:"40px 60px", flex:1, display:"flex", flexDirection:"column", position:"relative", zIndex:1 }}>
        {/* Header */}
        <div style={{ textAlign:"left", marginBottom:"32px" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"#ffffff", border:"1px solid #e8eaed", boxShadow:"0 1px 2px rgba(60,64,67,0.05)", padding:"6px 16px", borderRadius:"20px", fontSize:"11px", fontWeight:"600", color:"#5f6368", textTransform:"uppercase", marginBottom:"20px" }}>
            <div style={{ width:"6px", height:"6px", background:"#34A853", borderRadius:"50%", boxShadow:"0 0 0 2px rgba(52,168,83,0.2)" }} />
            Active Opportunity
          </div>
          <h1 style={{ margin:"0 0 16px 0", fontSize:"22px", fontWeight:"400", color:"#202124", lineHeight:"1.4" }}>
            <strong style={{ fontWeight:"800", color:"#5082b5" }}>{companyName}</strong> is actively seeking a <strong style={{ fontWeight:"800", color:"#485465" }}>{jobTitle}</strong>
          </h1>
          <div style={{ display:"flex", alignItems:"center", gap:"14px", fontSize:"12px", color:"#5f6368", fontWeight:"500", background:"#f8f9fa", padding:"8px 14px", borderRadius:"8px", border:"1px solid #e8eaed", flexWrap:"wrap" }}>
            <span>{location}</span><span style={{ width:"1px", height:"12px", background:"#dadce0" }} />
            <span>{employmentType}</span><span style={{ width:"1px", height:"12px", background:"#dadce0" }} />
            <span>{workModel}</span>
          </div>
        </div>

        {/* Metrics */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:"#ffffff", border:"1px solid #e8eaed", boxShadow:"0 1px 3px rgba(60,64,67,0.08)", padding:"16px 20px", borderRadius:"10px", marginBottom:"32px" }}>
          {[
            { label:"Experience", color:"#4285F4", value: experienceLevel },
            { label:"Education",  color:"#EA4335", value: educationLevel  },
            { label:"Compensation", color:"#34A853", value: salaryDisplay !== "Salary Range Not Specified" ? salaryDisplay : "Competitive" },
          ].map((m,i) => (
            <React.Fragment key={i}>
              {i > 0 && <div style={{ width:"1px", height:"28px", background:"#dadce0" }} />}
              <div style={{ display:"flex", flexDirection:"column", gap:"4px" }}>
                <div style={{ fontSize:"10px", color:"#5f6368", fontWeight:"600", textTransform:"uppercase", display:"flex", alignItems:"center", gap:"6px" }}>
                  <div style={{ width:"6px", height:"6px", background: m.color, borderRadius:"2px" }} /> {m.label}
                </div>
                <div style={{ fontSize:"14px", color:"#202124", fontWeight:"700" }}>{m.value}</div>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Position Overview */}
        <div style={{ marginBottom:"32px", position:"relative" }}>
          <div style={{ position:"absolute", left:"-16px", top:"4px", bottom:0, width:"3px", background:"#e8eaed", borderRadius:"2px" }} />
          <h3 style={{ fontSize:"14px", fontWeight:"700", color:"#202124", margin:"0 0 12px 0", display:"flex", alignItems:"center", gap:"10px" }}>
            <div style={{ width:"22px", height:"22px", background:"#e8f0fe", color:"#1a73e8", borderRadius:"6px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"11px", fontWeight:"800" }}>1</div>
            Position Overview
          </h3>
          <style>{`
            .pjm-desc-content p { margin-top:0; margin-bottom:8px; }
            .pjm-desc-content ul,.pjm-desc-content ol { margin-top:4px; margin-bottom:14px; padding-left:20px; }
            .pjm-desc-content li { margin-bottom:4px; line-height:1.6; }
            .pjm-desc-content strong { color:#202124; font-weight:600; }
          `}</style>
          <div className="pjm-desc-content" style={{ margin:0, fontSize:"13px", lineHeight:"1.7", color:"#5f6368", fontWeight:"400" }}
            dangerouslySetInnerHTML={{ __html: formatMarkdownToHtml(description) || `We are actively seeking a highly skilled professional to join our team in the ${department} department.` }} />
        </div>

        {/* Core Capabilities */}
        <div style={{ marginBottom:"32px", position:"relative" }}>
          <div style={{ position:"absolute", left:"-16px", top:"4px", bottom:0, width:"3px", background:"#e8eaed", borderRadius:"2px" }} />
          <h3 style={{ fontSize:"14px", fontWeight:"700", color:"#202124", margin:"0 0 12px 0", display:"flex", alignItems:"center", gap:"10px" }}>
            <div style={{ width:"22px", height:"22px", background:"#fce8e6", color:"#d93025", borderRadius:"6px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"11px", fontWeight:"800" }}>2</div>
            Core Capabilities
          </h3>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
            {skills.slice(0,8).map((skill,idx) => (
              <div key={idx} style={{ background:"#ffffff", border:"1px solid #dadce0", color:"#3c4043", padding:"6px 14px", borderRadius:"8px", fontSize:"12px", fontWeight:"600", boxShadow:"0 1px 2px rgba(60,64,67,0.05)" }}>{skill}</div>
            ))}
            {skills.length > 8 && <div style={{ background:"#f8f9fa", border:"1px dashed #dadce0", color:"#5f6368", padding:"6px 14px", borderRadius:"8px", fontSize:"12px", fontWeight:"600" }}>+{skills.length-8} more</div>}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop:"1px solid #e8eaed", padding:"16px 60px", textAlign:"center" }}>
        <div style={{ fontSize:"12px", color:"#5f6368", fontWeight:"500", textTransform:"uppercase", letterSpacing:"0.5px" }}>
          Apply securely at: <span style={{ color:"#1a73e8", fontWeight:"700", marginLeft:"4px" }}>{postLink ? (() => { try { return new URL(postLink).hostname; } catch { return postLink; } })() : "benmyl.com"}</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   CLASSIC TEMPLATE  (Small)
───────────────────────────────────────────────────────── */
function ClassicSmall({ jobTitle, companyName, location, employmentType, workModel, experienceLevel, skills }) {
  return (
    <div id="post-capture-area" style={{
      width:"100%", background:"#ffffff",
      fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",
      borderRadius:8, overflow:"hidden",
      boxShadow:"0 1px 3px rgba(60,64,67,0.3),0 4px 8px rgba(60,64,67,0.15)"
    }}>
      {/* Header */}
      <div style={{ background:"#f8fafc", borderBottom:"3px solid #3b82f6", padding:"18px 24px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <div style={{ fontSize:16, fontWeight:800, color:"#0f172a" }}>{jobTitle}</div>
          <div style={{ fontSize:12, color:"#64748b", marginTop:2 }}>{companyName}</div>
        </div>
        <div style={{ background:"#eff6ff", color:"#3b82f6", border:"1px solid #bfdbfe", borderRadius:6, padding:"4px 10px", fontSize:10, fontWeight:700 }}>Now Hiring</div>
      </div>
      {/* Info strip */}
      <div style={{ display:"flex", gap:0, borderBottom:"1px solid #f1f5f9" }}>
        {[["📍", location], ["💼", employmentType], ["🏠", workModel]].map(([icon, val], i) => (
          <div key={i} style={{ flex:1, padding:"12px 16px", borderRight: i < 2 ? "1px solid #f1f5f9" : "none" }}>
            <div style={{ fontSize:9, color:"#94a3b8", fontWeight:600, textTransform:"uppercase", marginBottom:4 }}>{icon}</div>
            <div style={{ fontSize:11, color:"#334155", fontWeight:600 }}>{val}</div>
          </div>
        ))}
      </div>
      {/* Skills row */}
      <div style={{ padding:"12px 24px", display:"flex", gap:6, flexWrap:"wrap", alignItems:"center" }}>
        <span style={{ fontSize:10, color:"#94a3b8", fontWeight:600, marginRight:4 }}>Skills:</span>
        {skills.slice(0,4).map((s,i) => <span key={i} style={{ background:"#f1f5f9", color:"#475569", borderRadius:4, padding:"3px 8px", fontSize:10, fontWeight:600 }}>{s}</span>)}
        {skills.length > 4 && <span style={{ fontSize:10, color:"#94a3b8" }}>+{skills.length-4} more</span>}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   CLASSIC TEMPLATE  (A4)
───────────────────────────────────────────────────────── */
function ClassicA4({ jobTitle, companyName, location, employmentType, workModel, experienceLevel, educationLevel, salaryDisplay, department, description, skills, postLink, formatMarkdownToHtml }) {
  return (
    <div id="post-capture-area" style={{
      width:"100%", background:"#ffffff",
      fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",
      borderRadius:8, overflow:"hidden",
      boxShadow:"0 1px 3px rgba(60,64,67,0.3),0 4px 8px rgba(60,64,67,0.15)"
    }}>
      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#f8fafc,#eff6ff)", borderBottom:"3px solid #3b82f6", padding:"28px 36px", display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
        <div>
          <div style={{ fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Career Opportunity</div>
          <div style={{ fontSize:22, fontWeight:800, color:"#0f172a", lineHeight:1.3, marginBottom:6 }}>{jobTitle}</div>
          <div style={{ fontSize:14, color:"#3b82f6", fontWeight:600 }}>{companyName}</div>
        </div>
        <div style={{ background:"#3b82f6", color:"#fff", borderRadius:8, padding:"8px 16px", fontSize:11, fontWeight:700, textAlign:"center", flexShrink:0 }}>
          <div>Now</div><div>Hiring</div>
        </div>
      </div>

      {/* Meta row */}
      <div style={{ display:"flex", borderBottom:"1px solid #f1f5f9" }}>
        {[["Location", location], ["Type", employmentType], ["Model", workModel], ["Experience", experienceLevel]].map(([lbl, val], i) => (
          <div key={i} style={{ flex:1, padding:"14px 20px", borderRight: i < 3 ? "1px solid #f1f5f9" : "none" }}>
            <div style={{ fontSize:9, color:"#94a3b8", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:4 }}>{lbl}</div>
            <div style={{ fontSize:12, color:"#0f172a", fontWeight:700 }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Body */}
      <div style={{ padding:"24px 36px" }}>
        {/* Description */}
        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:11, fontWeight:700, color:"#3b82f6", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:10, display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:3, height:14, background:"#3b82f6", borderRadius:2 }} /> Position Overview
          </div>
          <style>{`
            .classic-desc p { margin:0 0 8px 0; } .classic-desc ul { margin:4px 0 12px 0; padding-left:18px; }
            .classic-desc li { margin-bottom:4px; line-height:1.6; } .classic-desc strong { font-weight:600; color:#0f172a; }
          `}</style>
          <div className="classic-desc" style={{ fontSize:12, lineHeight:"1.7", color:"#475569" }}
            dangerouslySetInnerHTML={{ __html: formatMarkdownToHtml(description) || `We are actively seeking a highly skilled professional in the ${department} department.` }} />
        </div>

        {/* Skills */}
        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:11, fontWeight:700, color:"#3b82f6", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:10, display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:3, height:14, background:"#3b82f6", borderRadius:2 }} /> Core Skills
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {skills.map((s,i) => <span key={i} style={{ background:"#f1f5f9", color:"#334155", border:"1px solid #e2e8f0", borderRadius:6, padding:"5px 12px", fontSize:11, fontWeight:600 }}>{s}</span>)}
          </div>
        </div>

        {/* Additional Info */}
        <div style={{ display:"flex", gap:16, background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:8, padding:"14px 18px" }}>
          <div><div style={{ fontSize:9, color:"#94a3b8", fontWeight:700, textTransform:"uppercase", marginBottom:3 }}>Education</div><div style={{ fontSize:12, fontWeight:700, color:"#0f172a" }}>{educationLevel}</div></div>
          <div style={{ width:1, background:"#e2e8f0" }} />
          <div><div style={{ fontSize:9, color:"#94a3b8", fontWeight:700, textTransform:"uppercase", marginBottom:3 }}>Compensation</div><div style={{ fontSize:12, fontWeight:700, color:"#0f172a" }}>{salaryDisplay !== "Salary Range Not Specified" ? salaryDisplay : "Competitive"}</div></div>
          <div style={{ width:1, background:"#e2e8f0" }} />
          <div><div style={{ fontSize:9, color:"#94a3b8", fontWeight:700, textTransform:"uppercase", marginBottom:3 }}>Department</div><div style={{ fontSize:12, fontWeight:700, color:"#0f172a" }}>{department}</div></div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop:"1px solid #e2e8f0", padding:"12px 36px", display:"flex", justifyContent:"space-between", alignItems:"center", background:"#f8fafc" }}>
        <div style={{ fontSize:10, color:"#94a3b8", fontWeight:500 }}>Powered by BenMyl</div>
        <div style={{ fontSize:11, color:"#3b82f6", fontWeight:700 }}>
          Apply at: {postLink ? (() => { try { return new URL(postLink).hostname; } catch { return postLink; } })() : "benmyl.com"}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────── */
export default function PreviewModal({ onClose, data, onPostJob, isEdit }) {
  const navigate = useNavigate();

  /* =========================
     STATE
  ========================= */
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [isVendorOpen, setIsVendorOpen] = useState(true);

  const [showPostPreview, setShowPostPreview] = useState(false);
  const [postPreviewLoading, setPostPreviewLoading] = useState(false);
  const [descType, setDescType] = useState("brief");
  const [postDescription, setPostDescription] = useState(
    `${data?.companyName || "Our company"} is actively seeking a skilled ${data?.jobTitle || "professional"}. This is an exciting ${data?.employmentType || "full-time"} opportunity for someone who thrives in a dynamic environment and is ready to make an immediate impact.\n\n#Hiring #NowHiring #CareerOpportunity #JobOpening`
  );
  const [postLink, setPostLink] = useState("https://uat.benmyl.com/sign-in");
  // LinkedIn pre-selected by default
  const [shareToLinkedIn, setShareToLinkedIn] = useState(true);

  // Template & size selection
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [selectedSize, setSelectedSize] = useState("a4");

  const [aiGenCount, setAiGenCount] = useState(0);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  /* ── INTEGRATION HOOKS (unchanged) ── */
  const [saveHotlistImage] = useSaveHotlistImageMutation();
  const [getLinkedInAuthUrl] = useLazyGetLinkedInAuthUrlPostJobQuery();

  const emailid = localStorage.getItem("Email");
  const { data: companyApiData } = useGetCompanyProfileEditQuery(emailid);
  const companyLogo = companyApiData?.companylogo;
  const companyLogoUrl = companyLogo ? `${companyLogo}?t=${Date.now()}` : null;

  /* ── FORMATTING (unchanged) ── */
  const formatMarkdownToHtml = (text) => {
    if (!text) return "";
    let formatted = text.replace(/\r\n/g, '\n');
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    formatted = formatted.replace(/^\s*-\s+(.*)$/gm, "<li>$1</li>");
    formatted = formatted.replace(/(<li>.*?<\/li>(\n<li>.*?<\/li>)*)/g, "<ul>$&</ul>");
    formatted = formatted.replace(/\n/g, "<br/>");
    formatted = formatted.replace(/<ul><br\/>/g, "<ul>");
    formatted = formatted.replace(/<\/li><br\/>/g, "</li>");
    formatted = formatted.replace(/<\/ul><br\/>/g, "</ul>");
    formatted = formatted.replace(/<br\/><ul>/g, "<ul>");
    formatted = formatted.replace(/<br\/><li>/g, "<li>");
    return formatted;
  };

  /* =========================
     HANDLERS (integration - all unchanged)
  ========================= */
  const handlePublish = async () => {
    try {
      if (shareToLinkedIn && !showPostPreview) {
        toast.warning("Please create post preview first to share on LinkedIn.");
        return;
      }
      setStatus("loading");

      if (shareToLinkedIn) {
        const element = document.getElementById("post-capture-area");
        if (!element) {
          toast.warning("Please create post preview first.");
          setStatus("idle");
          return;
        }
        const rawCanvas = await html2canvas(element, {
          scale: 1.5, backgroundColor: "#ffffff", useCORS: true
        });
        const blob = await new Promise((resolve, reject) => {
          rawCanvas.toBlob((b) => {
            if (!b) reject(new Error("Image generation failed"));
            else resolve(b);
          }, "image/png");
        });
        const EmailId = localStorage.getItem("Email");
        const cleanDesc = postDescription.replace(/\*\*/g, '').replace(/<[^>]*>?/gm, '');
        const linkedInText = `${cleanDesc}\n\nApply Securely At:\n${postLink || "techstream.jobs"}`;
        const formData = new FormData();
        formData.append("Title", `Active Opportunity: ${jobTitle} at ${companyName}`);
        formData.append("Description", linkedInText);
        formData.append("File", blob, "job_post.png");
        formData.append("images", "null");
        formData.append("EmailId", EmailId || "");
        
        await saveHotlistImage(formData).unwrap();
        const authResponse = await getLinkedInAuthUrl().unwrap();
        if (!authResponse?.result_Message) throw new Error("LinkedIn auth URL not received");
        
        await onPostJob();
        window.location.href = authResponse.result_Message;
      } else {
        await onPostJob();
        setStatus("success");
      }
    } catch (error) {
      console.error("Publish Error:", error);
      toast.error(error?.data?.message || error.message || "Publish failed");
      setStatus("error");
    }
  };

  const handleRetry = () => {
    setStatus("idle");
    onClose();
  };

  const handleDownloadPost = async () => {
    const element = document.getElementById("post-capture-area");
    if (!element) return;
    const rawCanvas = await html2canvas(element, {
      scale: 1.5, backgroundColor: "#ffffff", useCORS: true
    });
    const link = document.createElement("a");
    link.download = `${jobTitle.replace(/\s+/g, '_')}_Post.png`;
    link.href = rawCanvas.toDataURL("image/png");
    link.click();
  };

  /* =========================
     UI HANDLERS
  ========================= */
  const handleCreatePost = () => {
    setShowPostPreview(true);
    setPostPreviewLoading(true);
    setTimeout(() => setPostPreviewLoading(false), 900);
  };

  const handleTemplateSelect = (tpl) => {
    if (tpl.tagType !== "free") {
      if (tpl.tagType === "subscription") toast.info("This template requires a Pro subscription.");
      if (tpl.tagType === "soon") toast.info("This template is coming soon!");
      return;
    }
    if (tpl.id !== selectedTemplate) {
      setPostPreviewLoading(true);
      setSelectedTemplate(tpl.id);
      setTimeout(() => {
        setPostPreviewLoading(false);
      }, 500);
    }
  };

  const handleAiGenerate = () => {
    if (aiGenCount >= 2) {
      toast.info("AI limit reached. Please subscribe to Pro for unlimited generation.", {
        icon: "✨",
        style: { background: "#1e293b", color: "#fff", border: "1px solid #334155" }
      });
      return;
    }
    setIsAiGenerating(true);
    setTimeout(() => {
      const empType = data?.employmentType || "full-time";
      const title = data?.jobTitle || "this role";
      const company = data?.companyName || "our company";
      setPostDescription(`${company} is actively seeking a skilled ${title} professional. This is an exciting ${empType} opportunity for someone who thrives in a dynamic environment and is ready to make an immediate impact.\n\n#Hiring #NowHiring #CareerOpportunity #JobOpening`);
      setAiGenCount(prev => prev + 1);
      setIsAiGenerating(false);
      toast.success("Description generated by AI");
    }, 1500);
  };

  /* =========================
     ALERT SCREENS (unchanged)
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
     DATA (unchanged)
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

  const drawerExpanded = showPostPreview;

  /* ── Shared template props ── */
  const tplProps = {
    jobTitle, companyName, location, employmentType, workModel,
    experienceLevel, educationLevel, salaryDisplay, department,
    description, skills, postLink, formatMarkdownToHtml
  };

  /* ── Render active template ── */
  const renderTemplate = () => {
    if (selectedTemplate === "modern" && selectedSize === "small") return <ModernSmall {...tplProps} />;
    if (selectedTemplate === "modern" && selectedSize === "a4")    return <ModernA4 {...tplProps} />;
    if (selectedTemplate === "classic" && selectedSize === "small") return <ClassicSmall {...tplProps} />;
    if (selectedTemplate === "classic" && selectedSize === "a4")   return <ClassicA4 {...tplProps} />;
    return null;
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="pjm-overlay" onClick={onClose}>
      <div
        className={`pjm-drawer${drawerExpanded ? " pjm-drawer--expanded" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Loading Overlay (unchanged) ── */}
        {status === "loading" && (
          <div className="pjm-loading-overlay">
            <div className="pjm-spinner" />
            <div className="pjm-loading-text">Posting Job...</div>
          </div>
        )}

        {/* ── Close Button (main panel) ── */}
        <button className="pjm-close-btn" onClick={onClose} disabled={status === "loading"}>
          <FiX size={16} />
        </button>

        <div className="pjm-drawer-content">
          {/* ═══════════════ LEFT PANEL – FORM ═══════════════ */}
          <div className="pjm-main">

            {/* Header */}
            <div className="pjm-header">
              <div>
                <div className="pjm-header-title">{isEdit ? "Edit Job Preview" : "Job Preview"}</div>
                <div className="pjm-header-sub">Review details and configure your post</div>
              </div>
            </div>

            <div className="pjm-divider" />

            {/* ── Job Summary Card ── */}
            <div className="pjm-section">
              <div className="pjm-section-header">
                <span className="pjm-section-label">Job Summary</span>
                {/* Create Post Button moved to top */}
                <button className="pjm-create-post-btn-top" onClick={handleCreatePost}>
                  <FiEye size={13} />
                  {showPostPreview ? "Refresh Post" : "Create Post"}
                </button>
              </div>
              <div className="pjm-job-card">
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div className="pjm-job-icon"><FaBuilding size={16} /></div>
                  <div>
                    <div className="pjm-job-title">{jobTitle}</div>
                    <div className="pjm-job-company">{companyName}</div>
                  </div>
                </div>
                <div className="pjm-tag-row">
                  <span className="pjm-tag">{location}</span>
                  <span className="pjm-tag">{employmentType}</span>
                  <span className="pjm-tag">{workModel}</span>
                  <span className="pjm-tag pjm-tag--salary">{salaryDisplay}</span>
                </div>
                <div className="pjm-meta-row">
                  <span className="pjm-meta-item"><span className="pjm-meta-label">Experience</span>{experienceLevel}</span>
                  <span className="pjm-meta-item"><span className="pjm-meta-label">Dept</span>{department}</span>
                  <span className="pjm-meta-item"><span className="pjm-meta-label">Education</span>{educationLevel}</span>
                </div>
                {skills.length > 0 && (
                  <div className="pjm-skills-row">
                    {skills.slice(0, 6).map(s => <span key={s} className="pjm-skill">{s}</span>)}
                    {skills.length > 6 && <span className="pjm-skill pjm-skill--more">+{skills.length - 6}</span>}
                  </div>
                )}
              </div>
            </div>

            {/* ── Post Description ── */}
            <div className="pjm-section">
              <div className="pjm-section-header">
                <span className="pjm-section-label">Post Description</span>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <select
                    className="pjm-input pjm-input--sm"
                    style={{ width: "auto", margin: 0, padding: "4px 8px" }}
                    value={descType}
                    onChange={(e) => {
                      const type = e.target.value;
                      setDescType(type);
                      if (type === "full") {
                        setPostDescription(description || "");
                      } else {
                        setPostDescription(`${companyName} is actively seeking a skilled ${jobTitle} professional. This is an exciting ${employmentType} opportunity for someone who thrives in a dynamic environment and is ready to make an immediate impact.\n\n#Hiring #NowHiring #CareerOpportunity #JobOpening`);
                      }
                    }}
                  >
                    <option value="brief">Brief Post Note</option>
                    <option value="full">Entire JD</option>
                  </select>
                  {descType === "brief" && (
                    <button
                      className="ai-generate-btn"
                      onClick={handleAiGenerate}
                      disabled={isAiGenerating}
                    >
                      <FiCpu size={13} />
                      {isAiGenerating ? "Generating..." : "AI Generate"}
                      {aiGenCount < 2 && (
                        <span className="pjm-ai-badge">{2 - aiGenCount} left</span>
                      )}
                    </button>
                  )}
                </div>
              </div>
              <textarea
                className="pjm-textarea"
                value={postDescription}
                readOnly
                style={{ background: "#f1f5f9", cursor: "default" }}
                placeholder="Generated description..."
                rows={4}
              />
            </div>

            {/* ── Post Link ── */}
            <div className="pjm-section">
              <div className="pjm-section-label">Post Link</div>
              <input
                type="text"
                className="pjm-input pjm-input--readonly"
                value={postLink}
                readOnly
              />
            </div>

            {/* ── Share Platforms ── */}
            <div className="pjm-section">
              <div className="pjm-section-label">Share on</div>
              <div className="pjm-platforms">
                <label className={`pjm-platform-btn pjm-platform-linkedin${shareToLinkedIn ? " pjm-platform-btn--active" : ""}`}>
                  <input
                    type="checkbox"
                    checked={shareToLinkedIn}
                    onChange={(e) => setShareToLinkedIn(e.target.checked)}
                    style={{ display: "none" }}
                  />
                  <FiLinkedin size={16} />
                  <span>LinkedIn</span>
                  {shareToLinkedIn && <span className="pjm-check">✓</span>}
                </label>

                <label className="pjm-platform-btn pjm-platform-btn--disabled">
                  <FiFacebook size={16} />
                  <span>Facebook</span>
                  <span className="pjm-coming-soon">Soon</span>
                </label>

                <label className="pjm-platform-btn pjm-platform-btn--disabled">
                  <FiMail size={16} />
                  <span>Email</span>
                  <span className="pjm-coming-soon">Soon</span>
                </label>
              </div>
            </div>

            {/* ── Copy Link ── */}
            <div className="pjm-section pjm-section--copy">
              <div className="pjm-copy-row">
                <input className="pjm-input pjm-input--sm" readOnly value="https://uat.benmyl.com/sign-in" />
                <button className="pjm-copy-btn" onClick={() => { navigator.clipboard.writeText("https://uat.benmyl.com/sign-in"); toast.success("Link copied!"); }}>
                  <FiCopy size={13} /> Copy
                </button>
              </div>
            </div>

          </div>

          {/* ═══════════════ RIGHT PANEL – PREVIEW ═══════════════ */}
          {drawerExpanded && (
            <div className="pjm-preview-panel">
              {/* Preview Header */}
              <div className="pjm-preview-header">
                <div>
                  <div className="pjm-preview-title">Post Preview</div>
                  <div className="pjm-preview-sub">
                    Select a template and size for your post
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginRight: "40px" }}>
                  <button className="pjm-download-btn" onClick={handleDownloadPost}>
                    <FiDownload size={13} /> Download Image
                  </button>
                </div>
              </div>

              <div className="pjm-preview-body">
                {/* ── Template & Size selectors (Same as PublishTalent) ── */}
                <div className="ptm-tpl-section-label" style={{ marginBottom: 10 }}>Choose Template</div>
                <div className="ptm-tpl-grid" style={{ marginBottom: 20 }}>
                  {TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.id}
                      className={`ptm-tpl-card${selectedTemplate === tpl.id && tpl.tagType === "free" ? " ptm-tpl-card--selected" : ""}${tpl.tagType !== "free" ? " ptm-tpl-card--locked" : ""}`}
                      onClick={() => handleTemplateSelect(tpl)}
                      title={tpl.desc}
                    >
                      <div className="ptm-tpl-thumb">
                        <TemplateMini id={tpl.id} />
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

                <div className="ptm-tpl-section-label" style={{ marginBottom: 10 }}>Post Size</div>
                <div className="pjm-size-row" style={{ flexDirection: "row", marginBottom: 24 }}>
                  {SIZES.map(sz => (
                    <button
                      key={sz.id}
                      className={`pjm-size-btn${selectedSize === sz.id ? " pjm-size-btn--active" : ""}`}
                      onClick={() => setSelectedSize(sz.id)}
                      title={sz.desc}
                      style={{ flex: 1 }}
                    >
                      {sz.icon}
                      <div>
                        <div className="pjm-size-name">{sz.name}</div>
                        <div className="pjm-size-desc">{sz.desc}</div>
                      </div>
                      {selectedSize === sz.id && <FiCheck size={11} style={{ marginLeft: "auto", color: "#3b82f6" }} />}
                    </button>
                  ))}
                </div>

                {postPreviewLoading ? (
                  <div className="pjm-preview-loader">
                    <div className="pjm-spinner" />
                    <span>Loading preview...</span>
                  </div>
                ) : (
                  <div className="pjm-canvas-wrap">
                    {/* Description above capture area */}
                    {postDescription && (
                      <div className="pjm-desc-preview">
                        <p style={{ margin: 0, fontSize: 12, color: "#334155", fontWeight: 500, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{postDescription}</p>
                        <p style={{ margin: "6px 0 0 0", fontSize: 11, color: "#3b82f6", fontWeight: 600 }}>🔗 {postLink}</p>
                      </div>
                    )}

                    {/* ── RENDER TEMPLATE ── */}
                    {renderTemplate()}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ═══════════════ FULL WIDTH FOOTER ═══════════════ */}
        <div className="pjm-footer">
          <div className="pjm-footer-platforms">
            {shareToLinkedIn ? (
              <span className="pjm-footer-platform-badge">
                <FiLinkedin size={12} /> Publishing to: LinkedIn
              </span>
            ) : (
              <span style={{ fontSize: 12, color: "#94a3b8" }}>No platform selected</span>
            )}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              className="btn-primary"
              onClick={handlePublish}
              disabled={status === "loading"}
              style={{ minWidth: 160 }}
            >
              {status === "loading" ? (
                <><span className="pjm-btn-spinner" /> Publishing...</>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {shareToLinkedIn && <FiLinkedin size={14} />}
                  {isEdit ? "Update Job" : (shareToLinkedIn ? "Post & Share" : "Post Job")}
                </div>
              )}
            </button>
          </div>
        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        /* ── Overlay ── */
        .pjm-overlay {
          position: fixed; inset: 0;
          background: rgba(15,23,42,0.45);
          backdrop-filter: blur(3px);
          z-index: 1040;
          animation: pjmFadeIn 0.25s ease;
        }
        @keyframes pjmFadeIn { from { opacity: 0; } to { opacity: 1; } }

        /* ── Drawer ── */
        .pjm-drawer {
          position: fixed; top: 0; right: 0; bottom: 0;
          width: 520px; max-width: 100vw;
          background: #ffffff;
          z-index: 1050;
          display: flex; flex-direction: column;
          box-shadow: -8px 0 40px rgba(15,23,42,0.15);
          animation: pjmSlideIn 0.3s cubic-bezier(0.16,1,0.3,1);
          overflow: hidden;
          transition: width 0.38s cubic-bezier(0.16,1,0.3,1);
        }
        .pjm-drawer--expanded { width: 82vw; max-width: 1400px; }
        @keyframes pjmSlideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }

        /* ── Drawer Content Wrapper ── */
        .pjm-drawer-content {
          display: flex;
          flex-direction: row;
          flex: 1;
          min-height: 0; /* Important for scroll */
          padding-bottom: 60px; /* Space for the absolute footer */
        }

        /* ── Left Main Panel ── */
        .pjm-main {
          width: 520px; min-width: 520px;
          display: flex; flex-direction: column;
          height: 100%; overflow-y: auto;
          border-right: 1px solid #e2e8f0;
        }

        /* ── Right Preview Panel ── */
        .pjm-preview-panel {
          flex: 1; display: flex; flex-direction: column;
          background: #f8fafc; height: 100%; overflow: hidden;
        }
        .pjm-preview-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 24px; border-bottom: 1px solid #e2e8f0;
          background: #fff; flex-shrink: 0;
        }
        .pjm-preview-title { font-size: 14px; font-weight: 700; color: #0f172a; }
        .pjm-preview-sub { font-size: 11px; color: #94a3b8; margin-top: 2px; }
        .pjm-preview-body {
          flex: 1; overflow-y: auto; padding: 24px;
        }
        .pjm-preview-loader {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; gap: 12px; padding: 60px 0;
          font-size: 12px; color: #64748b; font-weight: 500;
        }
        .pjm-canvas-wrap {
          display: flex; flex-direction: column; gap: 14px;
        }
        .pjm-desc-preview {
          padding: 14px 18px; background: #fff; border: 1px solid #e2e8f0;
          border-radius: 10px; box-shadow: 0 1px 4px rgba(15,23,42,0.05);
        }

        /* ── Header ── */
        .pjm-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 24px; flex-shrink: 0;
        }
        .pjm-header-title { font-size: 16px; font-weight: 800; color: #0f172a; }
        .pjm-header-sub { font-size: 12px; color: #94a3b8; margin-top: 2px; }

        .pjm-download-btn {
          display: inline-flex; align-items: center; gap: 6px;
          border: 1px solid #e2e8f0; border-radius: 8px; padding: 6px 12px;
          font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; background: #fff; color: #475569;
        }
        .pjm-download-btn:hover { background: #3b82f6; color: #fff; border-color: #3b82f6; }
        
        /* Back to Edit & Close Btn in Preview */
        .pjm-back-to-edit-btn {
          padding: 6px 12px !important;
          border-radius: 8px !important;
          font-size: 12px !important;
          background: #fff; border: 1px solid #e2e8f0; color: #475569; font-weight: 600; cursor: pointer; transition: all 0.2s;
        }
        .pjm-back-to-edit-btn:hover { background: #f1f5f9; border-color: #cbd5e1; color: #0f172a; }

        .pjm-divider { height: 1px; background: #f1f5f9; margin: 0 24px; }

        /* ── Sections ── */
        .pjm-section { padding: 16px 24px; border-bottom: 1px solid #f1f5f9; }
        .pjm-section--copy { padding-top: 12px; padding-bottom: 12px; }
        .pjm-section-label {
          font-size: 10px; font-weight: 700; color: #94a3b8;
          text-transform: uppercase; letter-spacing: 0.06em; display: block;
        }
        .pjm-section-header {
          display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;
        }

        /* ── Job Card ── */
        .pjm-job-card {
          background: #f8fafc; border: 1px solid #e2e8f0;
          border-radius: 12px; padding: 14px; 
        }
        .pjm-job-icon {
          width: 36px; height: 36px; border-radius: 8px; background: #eff6ff; color: #3b82f6;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .pjm-job-title { font-size: 14px; font-weight: 700; color: #0f172a; }
        .pjm-job-company { font-size: 11px; color: #64748b; }
        .pjm-tag-row { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
        .pjm-tag {
          background: #fff; border: 1px solid #e2e8f0; border-radius: 6px;
          padding: 3px 8px; font-size: 10px; font-weight: 600; color: #475569;
        }
        .pjm-tag--salary { color: #3b82f6; border-color: #bfdbfe; background: #eff6ff; }
        .pjm-meta-row { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 10px; }
        .pjm-meta-item { font-size: 11px; color: #334155; font-weight: 600; display: flex; align-items: center; gap: 4px; }
        .pjm-meta-label { font-size: 10px; color: #94a3b8; font-weight: 500; margin-right: 2px; }
        .pjm-skills-row { display: flex; flex-wrap: wrap; gap: 5px; }
        .pjm-skill {
          background: #fff; border: 1px solid #ddd6fe; color: #7c3aed;
          border-radius: 4px; padding: 2px 7px; font-size: 10px; font-weight: 600;
        }
        .pjm-skill--more { background: #f8fafc; border-color: #e2e8f0; color: #64748b; }

        /* ── Textarea / Input ── */
        .pjm-textarea {
          width: 100%; border-radius: 10px; border: 1px solid #e2e8f0;
          font-size: 12px; color: #1e293b; background: #f8fafc;
          box-sizing: border-box; font-family: inherit;
          padding: 10px 12px; resize: vertical; min-height: 80px;
          transition: all 0.2s ease;
        }
        .pjm-textarea:focus { outline: none; border-color: #3b82f6; background: #fff; box-shadow: 0 0 0 3px rgba(59,130,246,0.12); }
        .pjm-input {
          width: 100%; border-radius: 10px; border: 1px solid #e2e8f0;
          font-size: 12px; color: #1e293b; background: #f8fafc;
          box-sizing: border-box; padding: 9px 12px; font-family: inherit;
        }
        .pjm-input--readonly { color: #3b82f6; cursor: not-allowed; }
        .pjm-input--sm { flex: 1; border-radius: 8px; padding: 7px 10px; font-size: 11px; }

        /* ── Platforms ── */
        .pjm-platforms { display: flex; flex-direction: column; gap: 8px; }
        .pjm-platform-btn {
          display: flex; align-items: center; gap: 10px; padding: 10px 14px;
          border: 1px solid #e2e8f0; border-radius: 10px; cursor: pointer;
          font-size: 13px; font-weight: 600; color: #334155; background: #fff;
          transition: all 0.2s ease; user-select: none;
        }
        .pjm-platform-linkedin { color: #0a66c2; }
        .pjm-platform-btn--active { background: #eff6ff; border-color: #3b82f6; color: #0a66c2; }
        .pjm-platform-btn--disabled { opacity: 0.45; cursor: not-allowed; }
        .pjm-check { margin-left: auto; color: #16a34a; font-weight: 700; font-size: 12px; }
        .pjm-coming-soon {
          margin-left: auto; font-size: 9px; font-weight: 700;
          background: #f1f5f9; color: #94a3b8; border-radius: 4px; padding: 2px 6px;
        }

        /* ── Size Row ── */
        .pjm-size-row { display: flex; flex-direction: column; gap: 8px; }
        .pjm-size-btn {
          display: flex; align-items: center; gap: 10px; padding: 10px 12px;
          border: 1.5px solid #e2e8f0; border-radius: 9px;
          background: #fff; color: #334155; font-size: 12px;
          cursor: pointer; transition: all 0.2s ease; text-align: left;
        }
        .pjm-size-btn:hover { border-color: #93c5fd; background: #eff6ff; }
        .pjm-size-btn--active { border-color: #3b82f6 !important; background: #eff6ff !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.12); }
        .pjm-size-name { font-size: 12px; font-weight: 700; color: #0f172a; }
        .pjm-size-desc { font-size: 10px; color: #94a3b8; margin-top: 1px; }

        /* ── Template Grid from PublishTalentModal ── */
        .ptm-tpl-section-label { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em; }
        .ptm-tpl-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        .ptm-tpl-card { display: flex; flex-direction: column; background: #fff; border: 1.5px solid #e2e8f0; border-radius: 10px; overflow: hidden; cursor: pointer; padding: 0; transition: all 0.2s ease; text-align: left; }
        .ptm-tpl-card:hover:not(.ptm-tpl-card--locked) { border-color: #3b82f6; box-shadow: 0 4px 16px rgba(59,130,246,0.15); transform: translateY(-2px); }
        .ptm-tpl-card--selected { border-color: #3b82f6 !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.15) !important; }
        .ptm-tpl-card--locked { cursor: not-allowed; opacity: 0.8; }
        .ptm-tpl-thumb { width: 100%; aspect-ratio: 4/3; position: relative; overflow: hidden; background: #f1f5f9; }
        .ptm-tpl-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 16px; }
        .ptm-tpl-overlay--pro { background: rgba(88,28,135,0.55); color: #fff; backdrop-filter: blur(2px); }
        .ptm-tpl-overlay--soon { background: rgba(15,23,42,0.45); color: #fff; backdrop-filter: blur(2px); }
        .ptm-tpl-selected-check { position: absolute; top: 6px; right: 6px; width: 20px; height: 20px; border-radius: 50%; background: #3b82f6; color: #fff; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(59,130,246,0.4); }
        .ptm-tpl-card-footer { padding: 7px 8px; display: flex; align-items: center; justify-content: space-between; gap: 4px; border-top: 1px solid #f1f5f9; }
        .ptm-tpl-name { font-size: 10px; font-weight: 700; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ptm-tpl-tag { display: inline-flex; align-items: center; gap: 3px; font-size: 9px; font-weight: 700; border-radius: 4px; padding: 2px 5px; flex-shrink: 0; text-transform: uppercase; letter-spacing: 0.04em; }
        .ptm-tpl-tag--free { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
        .ptm-tpl-tag--subscription { background: #faf5ff; color: #7c3aed; border: 1px solid #ddd6fe; }
        .ptm-tpl-tag--soon { background: #f8fafc; color: #64748b; border: 1px solid #e2e8f0; }

        /* ── Create Post Main Btn (Top) ── */
        .pjm-create-post-btn-top {
          display: inline-flex; align-items: center; justify-content: center; gap: 6px;
          padding: 6px 12px; border-radius: 8px;
          background: linear-gradient(135deg,#3b82f6,#5B5BD6);
          color: #fff; border: none; font-size: 12px; font-weight: 600;
          cursor: pointer; transition: all 0.25s ease;
          box-shadow: 0 2px 8px rgba(59,130,246,0.3);
        }
        .pjm-create-post-btn-top:hover { box-shadow: 0 4px 12px rgba(59,130,246,0.4); transform: translateY(-1px); }
        .pjm-create-post-btn-top:active { transform: translateY(0); }

        /* ── Copy Row ── */
        .pjm-copy-row { display: flex; gap: 8px; align-items: center; }
        .pjm-copy-btn {
          display: inline-flex; align-items: center; gap: 5px;
          background: #fff; border: 1px solid #e2e8f0; color: #475569;
          border-radius: 8px; padding: 7px 12px; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap;
        }
        .pjm-copy-btn:hover { background: #3b82f6; color: #fff; border-color: #3b82f6; }

        /* ── AI Button ── */
        .pjm-ai-btn {
          display: inline-flex; align-items: center; gap: 5px;
          background: linear-gradient(135deg, #1e293b, #0f172a);
          color: #fff; border: none; border-radius: 6px; padding: 5px 10px;
          font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.2s;
        }
        .pjm-ai-btn:hover:not(:disabled) { box-shadow: 0 4px 12px rgba(15,23,42,0.3); transform: translateY(-1px); }
        .pjm-ai-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .pjm-ai-badge {
          background: rgba(255,255,255,0.18); border-radius: 4px;
          padding: 1px 5px; font-size: 9px; font-weight: 700;
        }

        /* ── Footer ── */
        .pjm-footer {
          position: absolute; bottom: 0; left: 0; right: 0; width: 100%;
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 24px; background: #fff; border-top: 1px solid #e2e8f0;
          box-shadow: 0 -4px 12px rgba(15,23,42,0.06); z-index: 10; box-sizing: border-box;
        }
        .pjm-footer-platforms { display: flex; align-items: center; gap: 8px; }
        .pjm-footer-platform-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: #eff6ff; color: #3b82f6; border: 1px solid #bfdbfe;
          border-radius: 6px; padding: 4px 10px; font-size: 11px; font-weight: 700;
        }

        /* ── Share with LinkedIn btn ── */
        .pjm-share-btn {
          display: inline-flex; align-items: center; gap: 7px;
          background: #0a66c2; color: #fff; border: none; border-radius: 10px;
          padding: 9px 16px; font-size: 13px; font-weight: 700;
          cursor: pointer; transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(10,102,194,0.35);
        }
        .pjm-share-btn:hover:not(:disabled) { background: #004182; box-shadow: 0 6px 18px rgba(10,102,194,0.45); transform: translateY(-1px); }
        .pjm-share-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* ── Close Btn ── */
        .pjm-close-btn {
          position: absolute; top: 18px; right: 18px;
          width: 30px; height: 30px; border-radius: 50%;
          background: #fff; border: 1px solid #e2e8f0; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #64748b; z-index: 20; transition: all 0.2s;
        }
        .pjm-close-btn:hover { background: #fee2e2; color: #ef4444; border-color: #fecaca; }

        /* ── Loading ── */
        .pjm-loading-overlay {
          position: absolute; inset: 0; background: rgba(255,255,255,0.85);
          backdrop-filter: blur(4px); z-index: 100; display: flex;
          flex-direction: column; align-items: center; justify-content: center; gap: 12px;
        }
        .pjm-loading-text { font-size: 13px; color: #64748b; font-weight: 600; }
        .pjm-spinner {
          width: 26px; height: 26px; border: 3px solid #f1f5f9;
          border-top-color: #3b82f6; border-radius: 50%; animation: pjmSpin 0.8s linear infinite;
        }
        .pjm-btn-spinner {
          display: inline-block; width: 13px; height: 13px;
          border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff;
          border-radius: 50%; animation: pjmSpin 0.8s linear infinite; vertical-align: middle; margin-right: 6px;
        }
        @keyframes pjmSpin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
