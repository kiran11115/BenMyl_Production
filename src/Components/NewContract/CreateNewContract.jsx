import React, { useState, useRef, useMemo } from "react";
import {
  FiChevronLeft,
  FiPaperclip,
  FiPlus,
  FiUploadCloud,
  FiCheck,
  FiArrowLeft,
} from "react-icons/fi";
import "./CreateNewContract.css";
import { useNavigate } from "react-router-dom";

const progressSteps = [
  "Basic Information",
  "Date & Value",
  "Parties",
  "Clauses",
  "Documents",
];

export default function CreateNewContract() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    type: "", // empty by default (placeholder)
    contractId: "", // empty (auto-generated after save)
    startEnd: "",
    value: "",
    paymentTerm: "", // empty by default
    internalDepartment: "", // empty
    manager: "", // empty
    externalName: "",
    externalEmail: "",
    termination: "",
    renewal: "",
    confidentiality: "",
    description: "",
    status: "Draft",
    reminder: false,
    tags: [], // empty initially
  });

  const [activeStep, setActiveStep] = useState(0);
  const [files, setFiles] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const fileRef = useRef();

  function update(field, value) {
    setForm((s) => ({ ...s, [field]: value }));
  }

  function addTag() {
    const v = tagInput.trim();
    if (!v) return;
    if (!form.tags.includes(v)) update("tags", [...form.tags, v]);
    setTagInput("");
  }

  function removeTag(t) {
    update("tags", form.tags.filter((x) => x !== t));
  }

  function onDrop(e) {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files);
    setFiles((f) => [...f, ...dropped]);
  }

  function onFileSelect(e) {
    const picked = Array.from(e.target.files || []);
    setFiles((f) => [...f, ...picked]);
    e.target.value = "";
  }

  function removeFile(i) {
    setFiles((f) => f.filter((_, idx) => idx !== i));
  }

  function handleSave(draft = false) {
    // placeholder: send `form` & `files` to API
    // Example: generate contractId after successful API save
    alert(draft ? "Saved as draft (implement API)" : "Contract saved (implement API)");
  }

  // ---------- Step completion logic ----------
  // stricter checks: require non-empty values
  const stepCompletion = useMemo(() => {
    const basicInfoDone = Boolean(form.title.trim() && form.type.trim());
    const dateValueDone = Boolean(form.startEnd.trim() && form.value.trim() && form.paymentTerm.trim());
    const partiesDone = Boolean(form.internalDepartment.trim() && form.manager.trim());
    const clausesDone = Boolean(
      (form.termination && form.termination.trim()) ||
      (form.renewal && form.renewal.trim()) ||
      (form.confidentiality && form.confidentiality.trim())
    );
    const documentsDone = files.length > 0;

    return [basicInfoDone, dateValueDone, partiesDone, clausesDone, documentsDone];
  }, [form, files]);

  function isStepComplete(index) {
    return !!stepCompletion[index];
  }

  return (
    <div className="cc-page">
      <div className="cc-container">
        <div className="cc-breadcrumbs">
          <button className="link-button" onClick={() => navigate("/user/user-dashboard")}><FiArrowLeft /> Back to Dashboard</button>
          <button className="link-button" onClick={() => navigate("/user/user-contract-management")}><FiArrowLeft /> Contract Management</button>
          <button className="link-button" onClick={() => navigate("/user/user-contract-view")}><FiArrowLeft /> Contract View</button>
          <span className="crumb">/ Creating New Contract</span>
        </div>

        <div className="cc-layout">
          {/* LEFT FORM */}
          <main className="cc-left">
            <h2 className="cc-heading">Creating New Contract</h2>
            <p className="cc-sub">Enter all necessary details to generate a new contract record</p>

            {/* Wrap left fields inside a white card area (matches screenshot) */}
            <div className="cc-form-card">
              {/* Basic Information */}
              <section className="cc-section">
                <h4 className="cc-section-title">Basic Information</h4>

                <label className="cc-field">
                  <div className="cc-label">Contract Title</div>
                  <input
                    className="cc-input"
                    placeholder="e.g. Software Licence Agreement"
                    value={form.title}
                    onChange={(e) => update("title", e.target.value)}
                  />
                </label>

                {/* Narrow left: contract type (small) + contract id (expand) */}
                <div className="cc-row two narrow-left">
                  <label className="cc-field pill-like">
                    <div className="cc-label">Contract Type</div>
                    <select
                      className="cc-select"
                      value={form.type}
                      onChange={(e) => update("type", e.target.value)}
                    >
                      <option value="" disabled>
                        Select contract type
                      </option>
                      <option>Licence Agreement</option>
                      <option>Service Agreement</option>
                      <option>NDA</option>
                      <option>Partnership</option>
                    </select>
                  </label>

                  <label className="cc-field">
                    <div className="cc-label">Contract ID</div>
                    <input
                      className="cc-input disabled"
                      placeholder="Auto Generated"
                      value={form.contractId}

                    />
                  </label>
                </div>
              </section>

              {/* Date & Value */}
              <section className="cc-section">
                <h4 className="cc-section-title">Date & Value</h4>

                {/* Narrow left: date (small) and right expands for value + payment */}
                <div className="cc-row two narrow-left">
                  <label className="cc-field pill-like">
                    <div className="cc-label">Start & End Date</div>
                    <input
                      className="cc-input"
                      placeholder="Feb 1, 2024 - Jan 31, 2025"
                      value={form.startEnd}
                      onChange={(e) => update("startEnd", e.target.value)}
                    />
                  </label>

                  <div className="cc-col">
                    <label className="cc-field">
                      <div className="cc-label">Contract Value</div>
                      <input
                        className="cc-input"
                        placeholder="$ 0.00"
                        value={form.value}
                        onChange={(e) => update("value", e.target.value)}
                      />
                    </label>

                    <label className="cc-field">
                      <div className="cc-label">Payment Term</div>
                      <select
                        className="cc-select"
                        value={form.paymentTerm}
                        onChange={(e) => update("paymentTerm", e.target.value)}
                      >
                        <option value="" disabled>
                          Select payment term
                        </option>
                        <option>Net 30</option>
                        <option>Net 15</option>
                        <option>Upon Receipt</option>
                      </select>
                    </label>
                  </div>
                </div>
              </section>

              {/* Parties Involved */}
              <section className="cc-section">
                <h4 className="cc-section-title">Parties Involved</h4>

                {/* internal dept & manager as narrow-left so selects stay pill-like */}
                <div className="cc-row two narrow-left">
                  <label className="cc-field pill-like">
                    <div className="cc-label">Internal Department</div>
                    <select
                      className="cc-select"
                      value={form.internalDepartment}
                      onChange={(e) => update("internalDepartment", e.target.value)}
                    >
                      <option value="" disabled>
                        Select department
                      </option>
                      <option>Legal</option>
                      <option>Sales</option>
                      <option>IT</option>
                      <option>Finance</option>
                    </select>
                  </label>

                  <label className="cc-field pill-like">
                    <div className="cc-label">Assigned Manager</div>
                    <select
                      className="cc-select"
                      value={form.manager}
                      onChange={(e) => update("manager", e.target.value)}
                    >
                      <option value="" disabled>
                        Select manager
                      </option>
                      <option>Sarah Anderson</option>
                      <option>Michael Chen</option>
                      <option>David Kim</option>
                    </select>
                  </label>
                </div>

                {/* external name + external email — both expand */}
                <div className="cc-row two">
                  <label className="cc-field">
                    <div className="cc-label">External Party Name</div>
                    <input
                      className="cc-input"
                      placeholder="Enter Company Name"
                      value={form.externalName}
                      onChange={(e) => update("externalName", e.target.value)}
                    />
                  </label>

                  <label className="cc-field">
                    <div className="cc-label">External Email</div>
                    <input
                      className="cc-input"
                      placeholder="Enter Company Email"
                      value={form.externalEmail}
                      onChange={(e) => update("externalEmail", e.target.value)}
                    />
                  </label>
                </div>
              </section>

              {/* Key Clauses */}
              <section className="cc-section">
                <h4 className="cc-section-title">Key Clauses</h4>

                <label className="cc-field">
                  <div className="cc-label">Termination Clause</div>
                  <textarea
                    className="cc-textarea"
                    value={form.termination}
                    onChange={(e) => update("termination", e.target.value)}
                  />
                </label>

                <label className="cc-field">
                  <div className="cc-label">Renewal Terms</div>
                  <textarea
                    className="cc-textarea"
                    value={form.renewal}
                    onChange={(e) => update("renewal", e.target.value)}
                  />
                </label>

                <label className="cc-field">
                  <div className="cc-label">Confidentiality Terms</div>
                  <textarea
                    className="cc-textarea"
                    value={form.confidentiality}
                    onChange={(e) => update("confidentiality", e.target.value)}
                  />
                </label>
              </section>

              {/* Description */}
              <section className="cc-section">
                <h4 className="cc-section-title">Description</h4>
                <label className="cc-field">
                  <textarea
                    className="cc-textarea"
                    placeholder="Enter Contract Summary or Additional Notes"
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                  />
                </label>
              </section>

              <div className="cc-actions-row">
                <button className="cc-btn cc-btn-ghost" onClick={() => alert("Cancelled")}>
                  Cancel
                </button>
                <div style={{ flex: 1 }} />
                <button className="cc-btn cc-btn-secondary" onClick={() => handleSave(true)}>
                  Save as Draft
                </button>
                <button className="cc-btn cc-btn-primary" onClick={() => handleSave(false)}>
                  Save Contract
                </button>
              </div>
            </div>
            {/* end cc-form-card */}
          </main>

          {/* RIGHT SIDEBAR */}
          <aside className="cc-right">
            <div className="cc-right-inner">
              <div className="cc-progress">
                <div className="cc-progress-title">Progress</div>
                <ol className="cc-steps">
                  {progressSteps.map((s, i) => {
                    const done = isStepComplete(i);
                    return (
                      <li
                        key={s}
                        className={`cc-step ${i === activeStep ? "active" : ""} ${done ? "done" : ""}`}
                        onClick={() => setActiveStep(i)}
                      >
                        <span className="cc-step-index">{done ? <FiCheck size={14} /> : i + 1}</span>
                        <span className="cc-step-label">{s}</span>
                      </li>
                    );
                  })}
                </ol>
              </div>

              <div className="cc-box">
                <div className="cc-box-row">
                  <label className="cc-label-small">Contract Status</label>
                  <select
                    className="cc-select"
                    value={form.status}
                    onChange={(e) => update("status", e.target.value)}
                  >
                    <option>Draft</option>
                    <option>Active</option>
                    <option>Pending</option>
                  </select>
                </div>

                <div className="cc-box-row">
                  <label className="cc-label-small">Set Reminder</label>
                  <div className="cc-toggle-row">
                    <label className="cc-switch">
                      <input
                        type="checkbox"
                        checked={form.reminder}
                        onChange={() => update("reminder", !form.reminder)}
                      />
                      <span className="cc-slider" />
                    </label>
                    <span className="cc-small">Renewal Reminder</span>
                  </div>
                </div>

                <div className="cc-box-row">
                  <label className="cc-label-small">Tags</label>
                  <div className="cc-tags">
                    {form.tags.length === 0 ? (
                      <div className="cc-tag-placeholder">No tags added</div>
                    ) : (
                      form.tags.map((t) => (
                        <span key={t} className="cc-tag-pill">
                          {t} <button className="cc-tag-x" onClick={() => removeTag(t)}>×</button>
                        </span>
                      ))
                    )}
                  </div>

                  <div className="cc-tag-input-row">
                    <input
                      className="cc-input-sm"
                      placeholder="Add a tag"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    />
                    <button className="cc-icon-btn" onClick={addTag}>
                      <FiPlus />
                    </button>
                  </div>
                </div>

                <div className="cc-box-row">
                  <label className="cc-label-small">Attach Documents</label>

                  <div
                    className="cc-drop"
                    onDrop={onDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => fileRef.current?.click()}
                    role="button"
                    tabIndex={0}
                  >
                    <FiUploadCloud size={32} />
                    <div className="cc-drop-text">Drag and drop files here, or click to browse</div>
                    <div className="cc-drop-sub">Supported formats: PDF, DOCX, DOC (Max 10MB)</div>
                    <input ref={fileRef} type="file" multiple onChange={onFileSelect} style={{ display: "none" }} />
                  </div>

                  <ul className="cc-file-list">
                    {files.map((f, i) => (
                      <li key={i} className="cc-file-item">
                        <div className="cc-file-meta">
                          <FiPaperclip />
                          <div>
                            <div className="cc-file-name">{f.name}</div>
                            <div className="cc-file-size">{(f.size / 1024).toFixed(0)} KB</div>
                          </div>
                        </div>
                        <button className="cc-file-remove" onClick={() => removeFile(i)}>Remove</button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
