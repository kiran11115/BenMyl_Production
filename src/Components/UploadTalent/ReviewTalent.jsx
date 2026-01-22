import React, { useEffect, useState } from "react";
import { Edit2, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import "./UploadTalent.css";
import { useApprovedEmployeeMutation, useDraftProfileEmployeeMutation, useGetEmployeeResumeQuery } from "../../State-Management/Api/UploadResumeApiSlice";
const PDFResumePreview = ({ data }) => {
  if (!data) return null;

  return (
    <div className="auth-card" style={{ flexDirection: "column", minHeight: "800px", padding: "40px", maxWidth: "100%" }}>
      <div style={{ textAlign: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: 20, marginBottom: 20 }}>
        <h1 className="auth-title">
          {data.firstName} {data.lastName}
        </h1>
        <div className="auth-subtitle">
          {data.emailAddress} • {data.phoneNo}
          <br />
          {data.city}, {data.state}, {data.country}
        </div>
      </div>

      {data.bio && (
    <div className="auth-form-group">
      <h3 className="auth-label">PROFESSIONAL SUMMARY</h3>
      <div className="auth-subtitle" style={{ lineHeight: 1.6 }}>
        {data.bio}
      </div>
    </div>
  )}

      {/* EDUCATION */}
      <div className="auth-form-group">
        <h3 className="auth-label">EDUCATION</h3>
        {data.employee_Heighers?.map((e, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div className="auth-label">{e.university}</div>
            <div className="auth-subtitle">
              {e.fieldofstudy} • {e.percentage}
            </div>
            <div className="auth-subtitle">
              {e.startDate?.slice(0, 4)} - {e.endDate?.slice(0, 4)}
            </div>
          </div>
        ))}
      </div>

      {/* EXPERIENCE */}
      <div className="auth-form-group">
        <h3 className="auth-label">EXPERIENCE</h3>
        {data.workexperiences?.map((e, i) => (
          <div key={i} style={{ marginBottom: 14 }}>
            <div className="auth-label">{e.companyName}</div>
            <div className="auth-subtitle">
              {e.position} • {e.startDate?.slice(0, 7)} - {e.endDate ? e.endDate.slice(0, 7) : "Present"}
            </div>
            <ul className="auth-subtitle" style={{ paddingLeft: 20 }}>
              {e.description?.split(".").map((d, idx) => d.trim() && <li key={idx}>{d}</li>)}
            </ul>
          </div>
        ))}
      </div>

      {/* PROJECTS */}
      <div className="auth-form-group">
        <h3 className="auth-label">PROJECTS</h3>
        {data.employeeprojects?.map((p, i) => (
          <div key={i} style={{ marginBottom: 14 }}>
            <div className="auth-label">{p.projectName}</div>
            <div className="auth-subtitle">
              {p.startDate?.slice(0, 7)} - {p.endDate ? p.endDate.slice(0, 7) : "Present"}
            </div>
            <div className="auth-subtitle">{p.description}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
              {p.skills?.split(",").map((s, idx) => (
                <span key={idx} className="status-tag status-progress">{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* SKILLS */}
      <div className="auth-form-group">
        <h3 className="auth-label">SKILLS</h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {data.skills?.split(",").map((s, i) => (
            <span key={i} className="status-tag status-progress">{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

const EditableField = ({ label, value, editing, onEdit, onSave, onCancel }) => {
    const [temp, setTemp] = useState(value || "");
    return (
        <div className="auth-form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <label className="auth-label">{label}</label>
                {!editing && <button className="auth-link" onClick={onEdit}><Edit2 size={12} /> Edit</button>}
            </div>
            {editing ? (
                <>
                    <input className="auth-input" value={temp} onChange={e => setTemp(e.target.value)} autoFocus />
                    <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                        <button className="btn-primary" onClick={() => onSave(temp)}>Save</button>
                        <button className="btn-secondary" onClick={onCancel}>Cancel</button>
                    </div>
                </>
            ) : (
                <div className="auth-input" style={{ border: 'none', padding: '4px 0', fontWeight: 600 }}>{value || "—"}</div>
            )}
        </div>
    );
};

const EditableTextarea = ({ label, value, editing, onEdit, onSave, onCancel }) => {
    const [temp, setTemp] = useState(value || "");
    return (
        <div className="auth-form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <label className="auth-label">{label}</label>
                {!editing && <button className="auth-link" onClick={onEdit}><Edit2 size={12} /> Edit</button>}
            </div>
            {editing ? (
                <>
                    <textarea className="auth-input" style={{ minHeight: 120 }} value={temp} onChange={e => setTemp(e.target.value)} />
                    <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                        <button className="btn-primary" onClick={() => onSave(temp)}>Save</button>
                        <button className="btn-secondary" onClick={onCancel}>Cancel</button>
                    </div>
                </>
            ) : (
                <div className="auth-input" style={{ border: 'none', padding: '4px 0' }}>{value || "—"}</div>
            )}
        </div>
    );
};

const EditableTags = ({ label, values, editing, onEdit, onSave, onCancel }) => {
    const [temp, setTemp] = useState(values.join(", "));
    return (
        <div className="auth-form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label className="auth-label">{label}</label>
                {!editing && <button className="auth-link" onClick={onEdit}><Edit2 size={12} /> Edit</button>}
            </div>
            {editing ? (
                <>
                    <textarea className="auth-input" style={{ minHeight: 70 }} value={temp} onChange={e => setTemp(e.target.value)} />
                    <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                        <button className="btn-primary" onClick={() => onSave(temp.split(",").map(t => t.trim()).filter(Boolean))}>Save</button>
                        <button className="btn-secondary" onClick={onCancel}>Cancel</button>
                    </div>
                </>
            ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                    {values.length === 0 ? <span className="auth-subtitle">No items</span> :
                        values.map((v, i) => <span key={i} className="status-tag status-progress">{v}</span>)}
                </div>
            )}
        </div>
    );
};

const ReviewTalent = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
  const employeeID = state?.employeeID;

  const { data, isLoading } = useGetEmployeeResumeQuery(employeeID);
  const [approveEmployee, { isLoading: isSaving }] =
  useApprovedEmployeeMutation();
  const [draftProfile, { isLoading: draft }] =
  useDraftProfileEmployeeMutation();
    const [isReviewed, setIsReviewed] = useState(false);

    // SINGLE OPEN ACCORDION
    const [openAccordion, setOpenAccordion] = useState("basicInfo");
    const toggleAccordion = (key) => setOpenAccordion(prev => prev === key ? null : key);

    const [editingSection, setEditingSection] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);
    const beginEdit = (s, i = null) => { setEditingSection(s); setEditingIndex(i); };
    const cancelEdit = () => { setEditingSection(null); setEditingIndex(null); };

    const [talent, setTalent] = useState(null);

    const handleSaveTalent = async () => {
  if (!isReviewed) return;

  const formData = new FormData();

/* ===== BASIC INFO ===== */
formData.append("EmployeeID", data.employeeID);
formData.append("CompanyID", data.companyID);
formData.append("BranchID", data.branchID ?? 0);

formData.append("FirstName", talent.basicInfo.firstName);
formData.append("LastName", talent.basicInfo.lastName);
formData.append("Title", talent.basicInfo.position);
formData.append("PhoneNo", talent.basicInfo.phone);
formData.append("EmailAddress", talent.basicInfo.email);

formData.append("ProfilePicture", ""); // null not allowed in FormData
formData.append("ResumeFilePath", data.resumeFilePath ?? "");

/* ===== PERSONAL INFO ===== */
formData.append("DOB", talent.personalInfo.dob ?? "");
formData.append("Gender", talent.personalInfo.gender ?? "");
formData.append("EmergencyContactNumber", talent.personalInfo.emergency ?? "");

formData.append("Country", talent.personalInfo.country ?? "");
formData.append("State", talent.personalInfo.state ?? "");
formData.append("City", talent.personalInfo.city ?? "");
formData.append("Address", talent.personalInfo.address ?? "");
formData.append("Bio", talent.personalInfo.bio ?? "");

/* ===== SKILLS ===== */
formData.append("Skills", talent.basicInfo.skills.join(","));

/* ===== META ===== */
formData.append("InsertBy", data.uploadedBy ?? "");
formData.append("NoofExperience", data.noofExperience ?? 0);
formData.append("EmpDetailID", 0);
formData.append("EmpID", 0);
formData.append("EmployeeCode", data.employeeCode ?? "");
formData.append("department", data.department ?? "");
formData.append("Manager", data.manager ?? "");
formData.append("Supervisor", "");
formData.append("startdate", data.startDate ?? "");
formData.append("lastdate", data.endDate ?? "");
formData.append("Status", "Approved");

/* ===== SALARY ===== */
formData.append("Salary", data.salary ?? "");
formData.append("PayFrequency", data.salaryFrequency ?? "");

/* ===== PREFERENCES ===== */
formData.append("PreferedLanguage", data.prefLanguage ?? "");
formData.append("Prefereddistancefromhome", data.prefDistHome ?? "");
formData.append("OtherPreferedLocations", data.otherPerfLocation ?? "");
formData.append("PreferedWorkTimings", data.perfWorkTime ?? "");

/* ===== WORK EXPERIENCES (STRING) ===== */
formData.append(
  "workexperiences",
  JSON.stringify([
    {
      ExperienceID: 0,
      EmployeeID: 0,
      CompanyName: "mylas tech",
      Position: "developer",
      StartDate: "1-12-2024",
      EndDate: "1-12-2024",
      Skills: ["sdds"],
      Description: "dasdasd1",
    },
  ])
);


/* ===== PROJECTS (STRING — CRITICAL) ===== */
formData.append(
  "project",
  JSON.stringify([
    {
      ExperienceID: 0,
      EmployeeID: 0,
      projectName: "mylas tech",
      Role: "developer",
      StartDate: "1-12-2024",
      EndDate: "1-12-2024",
      Skills: ["sdd"],
      Description: "Description1",
    },
  ])
);

/* ===== EDUCATION (STRING) ===== */
formData.append(
  "employee_Heighers",
  JSON.stringify([
    {
      _EductionhigherId: 0,
      EmployeeID: 0,
      HighestQualification: "B.Tech",
      University: "JNTU Hyderabad",
      Fieldofstudy: "Computer Science",
      Certifications: "Azure Fundamentals",
      Percentage: "75",
      StartDate: "2016-06-01",
      EndDate: "2020-05-30",
    },
  ])
);

  try {
    await approveEmployee(formData).unwrap();
    navigate("/user/user-upload-talent");
  } catch (err) {
    console.error("Approve failed", err);
    alert("Failed to save talent");
  }
};

const handleDraftTalent = async () => {
  if (!isReviewed) return;

  const formData = new FormData();

/* ===== BASIC INFO ===== */
formData.append("EmployeeID", data.employeeID);
formData.append("CompanyID", data.companyID);
formData.append("BranchID", data.branchID ?? 0);

formData.append("FirstName", talent.basicInfo.firstName);
formData.append("LastName", talent.basicInfo.lastName);
formData.append("Title", talent.basicInfo.position);
formData.append("PhoneNo", talent.basicInfo.phone);
formData.append("EmailAddress", talent.basicInfo.email);

formData.append("ProfilePicture", ""); // null not allowed in FormData
formData.append("ResumeFilePath", data.resumeFilePath ?? "");

/* ===== PERSONAL INFO ===== */
formData.append("DOB", talent.personalInfo.dob ?? "");
formData.append("Gender", talent.personalInfo.gender ?? "");
formData.append("EmergencyContactNumber", talent.personalInfo.emergency ?? "");

formData.append("Country", talent.personalInfo.country ?? "");
formData.append("State", talent.personalInfo.state ?? "");
formData.append("City", talent.personalInfo.city ?? "");
formData.append("Address", talent.personalInfo.address ?? "");
formData.append("Bio", talent.personalInfo.bio ?? "");

/* ===== SKILLS ===== */
formData.append("Skills", talent.basicInfo.skills.join(","));

/* ===== META ===== */
formData.append("InsertBy", data.uploadedBy ?? "");
formData.append("NoofExperience", data.noofExperience ?? 0);
formData.append("EmpDetailID", 0);
formData.append("EmpID", 0);
formData.append("EmployeeCode", data.employeeCode ?? "");
formData.append("department", data.department ?? "");
formData.append("Manager", data.manager ?? "");
formData.append("Supervisor", "");
formData.append("startdate", data.startDate ?? "");
formData.append("lastdate", data.endDate ?? "");
formData.append("Status", "Approved");

/* ===== SALARY ===== */
formData.append("Salary", data.salary ?? "");
formData.append("PayFrequency", data.salaryFrequency ?? "");

/* ===== PREFERENCES ===== */
formData.append("PreferedLanguage", data.prefLanguage ?? "");
formData.append("Prefereddistancefromhome", data.prefDistHome ?? "");
formData.append("OtherPreferedLocations", data.otherPerfLocation ?? "");
formData.append("PreferedWorkTimings", data.perfWorkTime ?? "");

/* ===== WORK EXPERIENCES (STRING) ===== */
formData.append(
  "workexperiences",
  JSON.stringify([
    {
      ExperienceID: 0,
      EmployeeID: 0,
      CompanyName: "mylas tech",
      Position: "developer",
      StartDate: "1-12-2024",
      EndDate: "1-12-2024",
      Skills: ["sdds"],
      Description: "dasdasd1",
    },
  ])
);


/* ===== PROJECTS (STRING — CRITICAL) ===== */
formData.append(
  "project",
  JSON.stringify([
    {
      ExperienceID: 0,
      EmployeeID: 0,
      projectName: "mylas tech",
      Role: "developer",
      StartDate: "1-12-2024",
      EndDate: "1-12-2024",
      Skills: ["sdd"],
      Description: "Description1",
    },
  ])
);

/* ===== EDUCATION (STRING) ===== */
formData.append(
  "employee_Heighers",
  JSON.stringify([
    {
      _EductionhigherId: 0,
      EmployeeID: 0,
      HighestQualification: "B.Tech",
      University: "JNTU Hyderabad",
      Fieldofstudy: "Computer Science",
      Certifications: "Azure Fundamentals",
      Percentage: "75",
      StartDate: "2016-06-01",
      EndDate: "2020-05-30",
    },
  ])
);

  try {
    await draftProfile(formData).unwrap();
    navigate("/user/user-upload-talent");
  } catch (err) {
    console.error("Approve failed", err);
    alert("Failed to save talent");
  }
};


  /* ===== MAP API → LOCAL STATE (NO DESIGN CHANGE) ===== */
  useEffect(() => {
    if (!data) return;

    setTalent({
      basicInfo: {
        firstName: data.firstName,
        lastName: data.lastName,
        position: data.title,
        phone: data.phoneNo,
        email: data.emailAddress,
        skills: data.skills?.split(",") || []
      },
      personalInfo: {
        dob: data.dob || "",
        gender: data.gender || "",
        emergency: data.emergencyContactNumber || "",
        country: data.country,
        state: data.state,
        city: data.city,
        address: data.address,
        bio: data.bio
      },
      education: data.employee_Heighers?.map(e => ({
        university: e.university,
        qualification: e.highestQualification || "",
        startDate: e.startDate?.slice(0, 10),
        endDate: e.endDate?.slice(0, 10),
        field: e.fieldofstudy || "",
        percentage: e.percentage,
        certifications: e.certifications ? e.certifications.split(",") : []
      })) || [],
      experience: data.workexperiences?.map(e => ({
        company: e.companyName,
        position: e.position,
        startDate: e.startDate?.slice(0, 10),
        endDate: e.endDate?.slice(0, 10),
        skills: e.skills?.split(",") || [],
        description: e.description
      })) || [],
      projects: data.employeeprojects?.map(p => ({
        name: p.projectName,
        role: p.role || "",
        startDate: p.startDate?.slice(0, 10),
        endDate: p.endDate?.slice(0, 10),
        skills: p.skills?.split(",") || [],
        description: p.description
      })) || []
    });
  }, [data]);

  if (isLoading || !talent) return <div style={{ padding: 40 }}>Loading profile…</div>;

    const addEducation = () => setTalent(p => ({ ...p, education: [...p.education, { university: "", qualification: "", startDate: "", endDate: "", field: "", percentage: "", certifications: [] }] }));
    const addExperience = () => setTalent(p => ({ ...p, experience: [...p.experience, { company: "", position: "", startDate: "", endDate: "", skills: [], description: "" }] }));
    const addProjects = () => setTalent(p => ({ ...p, projects: [...p.projects, { name: "", role: "", startDate: "", endDate: "", skills: [], description: "" }] }));

   const smoothStyle = (open) => ({
  maxHeight: open ? 1000 : 0,
  overflow: 'auto',
  transition: 'max-height .3s ease',

  /* Hide scrollbar — Chrome/Safari/Edge */
  '::-webkit-scrollbar': {
    display: 'none'
  },

  /* Firefox */
  scrollbarWidth: 'none',

  /* IE/old Edge */
  msOverflowStyle: 'none'
});


    return (
        <div style={{ padding: 24 }}>
            <div className="d-flex gap-2 mb-3 align-items-center">
                <button className="auth-link" onClick={() => navigate("/user/user-upload-talent")}><FiArrowLeft /> Talent Management</button>
                <span className="auth-subtitle">/ Review Talent</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

                {/* LEFT */}
                <div className="auth-form-side" style={{ border: '1px solid #e2e8f0', borderRadius: '1rem', padding: 24, background: 'white', display: 'flex', flexDirection: 'column' }}>
                    <h4 className="auth-title mb-4">2. Edit Information</h4>

                    <div style={{ flex: 1, overflowY: 'auto' }}>

                        {/* ===== BASIC ===== */}
                        <div style={{ marginBottom: 16 }}>
                            <div className="" style={{
                                border: "1px solid #e2e8f0",
                                borderRadius: "6px",
                                padding: "10px 10px 0px 10px"
                            }}>
                                <div onClick={() => toggleAccordion("basicInfo")}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <h5 className="auth-label">Basic Information</h5>
                                    {openAccordion === "basicInfo" ? <ChevronUp /> : <ChevronDown />}
                                </div>
                                <div style={smoothStyle(openAccordion === "basicInfo")} className="mt-2 scrollable" >
                                    {["firstName", "lastName", "position", "phone", "email"].map(f => (
                                        <EditableField key={f} label={f} value={talent.basicInfo[f]}
                                            editing={editingSection === "basicInfo" && editingIndex === f}
                                            onEdit={() => beginEdit("basicInfo", f)}
                                            onSave={val => { setTalent(p => ({ ...p, basicInfo: { ...p.basicInfo, [f]: val } })); cancelEdit(); }}
                                            onCancel={cancelEdit}
                                        />
                                    ))}
                                    <EditableTags
                                        label="Skills"
                                        values={talent.basicInfo.skills}
                                        editing={editingSection === "basicInfo" && editingIndex === "skills"}
                                        onEdit={() => beginEdit("basicInfo", "skills")}
                                        onSave={val => { setTalent(p => ({ ...p, basicInfo: { ...p.basicInfo, skills: val } })); cancelEdit(); }}
                                        onCancel={cancelEdit}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ===== PERSONAL ===== */}
                        <div style={{ marginBottom: 16 }}>
                            <div className="" style={{
                                border: "1px solid #e2e8f0",
                                borderRadius: "6px",
                                padding: "10px 10px 0px 10px"
                            }}>
                                <div onClick={() => toggleAccordion("personalInfo")} style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}>
                                    <h5 className="auth-label">Personal Information</h5>
                                    {openAccordion === "personalInfo" ? <ChevronUp /> : <ChevronDown />}
                                </div>
                                <div style={smoothStyle(openAccordion === "personalInfo")} className="mt-2">
                                    {Object.keys(talent.personalInfo).map(field => {
                                        const isTxt = field === "bio";
                                        return isTxt ? (
                                            <EditableTextarea key={field} label={field} value={talent.personalInfo[field]}
                                                editing={editingSection === "personalInfo" && editingIndex === field}
                                                onEdit={() => beginEdit("personalInfo", field)}
                                                onSave={val => { setTalent(p => ({ ...p, personalInfo: { ...p.personalInfo, [field]: val } })); cancelEdit(); }}
                                                onCancel={cancelEdit}
                                            />
                                        ) : (
                                            <EditableField key={field} label={field} value={talent.personalInfo[field]}
                                                editing={editingSection === "personalInfo" && editingIndex === field}
                                                onEdit={() => beginEdit("personalInfo", field)}
                                                onSave={val => { setTalent(p => ({ ...p, personalInfo: { ...p.personalInfo, [field]: val } })); cancelEdit(); }}
                                                onCancel={cancelEdit}
                                            />
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* ===== EDUCATION ===== */}
                        <div style={{ marginBottom: 16 }}>
                            <div className="" style={{
                                border: "1px solid #e2e8f0",
                                borderRadius: "6px",
                                padding: "10px 10px 0px 10px"
                            }}>
                                <div onClick={() => toggleAccordion("education")} style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}>
                                    <h5 className="auth-label">Education</h5>
                                    {openAccordion === "education" ? <ChevronUp /> : <ChevronDown />}
                                </div>
                                <div style={smoothStyle(openAccordion === "education")} className="mt-2">
                                   
                                    {talent.education.map((ed, i) => (
                                        <div key={i} style={{ border: '1px solid #e2e8f0', padding: 12, borderRadius: 8, marginTop: 10, marginBottom: 14 }}>
                                            {["university", "qualification", "startDate", "endDate", "field", "percentage"].map(field => (
                                                <EditableField
                                                    key={field}
                                                    label={field}
                                                    value={ed[field]}
                                                    editing={editingSection === "education" && editingIndex === `${i}-${field}`}
                                                    onEdit={() => beginEdit("education", `${i}-${field}`)}
                                                    onSave={val => {
                                                        const arr = [...talent.education]; arr[i][field] = val;
                                                        setTalent(p => ({ ...p, education: arr })); cancelEdit();
                                                    }}
                                                    onCancel={cancelEdit}
                                                />
                                            ))}
                                            <EditableTags
                                                label="Certifications"
                                                values={ed.certifications}
                                                editing={editingSection === "education" && editingIndex === `${i}-certifications`}
                                                onEdit={() => beginEdit("education", `${i}-certifications`)}
                                                onSave={val => {
                                                    const arr = [...talent.education]; arr[i].certifications = val;
                                                    setTalent(p => ({ ...p, education: arr })); cancelEdit();
                                                }}
                                                onCancel={cancelEdit}
                                            />
                                        </div>
                                    ))}

                                     <div className="mb-3" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <button className="btn-secondary" onClick={addEducation}><Plus size={12} /> Add</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ===== EXPERIENCE ===== */}
                        <div style={{ marginBottom: 16 }}>
                            <div className="" style={{
                                border: "1px solid #e2e8f0",
                                borderRadius: "6px",
                                padding: "10px 10px 0px 10px"
                            }}>
                                <div onClick={() => toggleAccordion("experience")} style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}>
                                    <h5 className="auth-label">Experience</h5>
                                    {openAccordion === "experience" ? <ChevronUp /> : <ChevronDown />}
                                </div>
                                <div style={smoothStyle(openAccordion === "experience")} className="mt-2">
                                    
                                    {talent.experience.map((ex, i) => (
                                        <div key={i} style={{ border: '1px solid #e2e8f0', padding: 12, borderRadius: 8, marginTop: 10, marginBottom: 14 }}>
                                            {["company", "position", "startDate", "endDate"].map(field => (
                                                <EditableField key={field} label={field} value={ex[field]}
                                                    editing={editingSection === "experience" && editingIndex === `${i}-${field}`}
                                                    onEdit={() => beginEdit("experience", `${i}-${field}`)}
                                                    onSave={val => {
                                                        const arr = [...talent.experience]; arr[i][field] = val;
                                                        setTalent(p => ({ ...p, experience: arr })); cancelEdit();
                                                    }}
                                                    onCancel={cancelEdit}
                                                />
                                            ))}
                                            <EditableTags
                                                label="Skills"
                                                values={ex.skills}
                                                editing={editingSection === "experience" && editingIndex === `${i}-skills`}
                                                onEdit={() => beginEdit("experience", `${i}-skills`)}
                                                onSave={val => {
                                                    const arr = [...talent.experience]; arr[i].skills = val;
                                                    setTalent(p => ({ ...p, experience: arr })); cancelEdit();
                                                }}
                                                onCancel={cancelEdit}
                                            />
                                            <EditableTextarea
                                                label="Description"
                                                value={ex.description}
                                                editing={editingSection === "experience" && editingIndex === `${i}-description`}
                                                onEdit={() => beginEdit("experience", `${i}-description`)}
                                                onSave={val => {
                                                    const arr = [...talent.experience]; arr[i].description = val;
                                                    setTalent(p => ({ ...p, experience: arr })); cancelEdit();
                                                }}
                                                onCancel={cancelEdit}
                                            />
                                        </div>
                                    ))}

                                    <div className="mb-3" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <button className="btn-secondary" onClick={addExperience}><Plus size={12} /> Add</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ===== PROJECTS ===== */}
                        <div style={{ marginBottom: 16 }}>
                            <div className="" style={{
                                border: "1px solid #e2e8f0",
                                borderRadius: "6px",
                                padding: "10px 10px 0px 10px"
                            }}>
                                <div onClick={() => toggleAccordion("projects")} style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}>
                                    <h5 className="auth-label">Projects</h5>
                                    {openAccordion === "projects" ? <ChevronUp /> : <ChevronDown />}
                                </div>
                                <div style={smoothStyle(openAccordion === "projects")} className="mt-2">
        
                                    {talent.projects.map((pr, i) => (
                                        <div key={i} style={{ border: '1px solid #e2e8f0', padding: 12, borderRadius: 8, marginTop: 10, marginBottom: 14 }}>
                                            {["name", "role", "startDate", "endDate"].map(field => (
                                                <EditableField key={field} label={field} value={pr[field]}
                                                    editing={editingSection === "projects" && editingIndex === `${i}-${field}`}
                                                    onEdit={() => beginEdit("projects", `${i}-${field}`)}
                                                    onSave={val => {
                                                        const arr = [...talent.projects]; arr[i][field] = val;
                                                        setTalent(p => ({ ...p, projects: arr })); cancelEdit();
                                                    }}
                                                    onCancel={cancelEdit}
                                                />
                                            ))}
                                            <EditableTags
                                                label="Skills"
                                                values={pr.skills}
                                                editing={editingSection === "projects" && editingIndex === `${i}-skills`}
                                                onEdit={() => beginEdit("projects", `${i}-skills`)}
                                                onSave={val => {
                                                    const arr = [...talent.projects]; arr[i].skills = val;
                                                    setTalent(p => ({ ...p, projects: arr })); cancelEdit();
                                                }}
                                                onCancel={cancelEdit}
                                            />
                                            <EditableTextarea
                                                label="Description"
                                                value={pr.description}
                                                editing={editingSection === "projects" && editingIndex === `${i}-description`}
                                                onEdit={() => beginEdit("projects", `${i}-description`)}
                                                onSave={val => {
                                                    const arr = [...talent.projects]; arr[i].description = val;
                                                    setTalent(p => ({ ...p, projects: arr })); cancelEdit();
                                                }}
                                                onCancel={cancelEdit}
                                            />
                                        </div>
                                    ))}

                                    <div className="mb-3" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <button className="btn-secondary" onClick={addProjects}><Plus size={12} /> Add</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: 24 }}>
                        <div className="auth-alert auth-alert-success" style={{ marginBottom: 24, display: 'flex', gap: 10 }}>
                            <input type="checkbox" checked={isReviewed} onChange={e => setIsReviewed(e.target.checked)} style={{ width: 18, height: 18 }} />
                            <span style={{ fontSize: 14, fontWeight: 600 }}>I have reviewed and verified all information is correct</span>
                        </div>
                        <div className="d-flex gap-3 justify-content-end">
                            <button className="btn-secondary" onClick={handleDraftTalent}>Save as Draft</button>
                            <button className="btn-primary" disabled={!isReviewed} onClick={handleSaveTalent}>Save Talent</button>
                        </div>
                    </div>
                </div>

                {/* RIGHT */}
                <div style={{ borderRadius: '1rem', border: '1px solid #e2e8f0', background: 'white' }}>
                    <h4 className="auth-title" style={{ padding: 16 }}>Preview Resume</h4>
                    <div style={{ height: 'calc(100% - 48px)', overflowY: 'auto' }}>
                        <PDFResumePreview data={data} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewTalent;
