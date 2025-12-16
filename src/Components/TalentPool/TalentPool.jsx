import React, { useState, useMemo, memo } from "react";
import {
  FiChevronRight,
  FiFilter,
  FiMapPin,
  FiGrid,
  FiList,
  FiMoreVertical,
  FiBriefcase
} from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./TalentPool.css";

// --- 1. UNIFIED DATA SOURCE ---
const candidatesMock = [
  {
    id: 101,
    name: "Sarah Johnson",
    email: "sarah.j@techsolutions.com",
    role: "Senior Developer",
    experience: "8 years exp.",
    skills: ["React", "Node.js", "AWS"],
    location: "San Francisco, CA",
    availability: ["Available Now", "Remote"],
    status: "SHORTLISTED",
    rating: 4.9,
    avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: 102,
    name: "Michael Chen",
    email: "m.chen@digitaldyn.net",
    role: "Project Manager",
    experience: "12 years exp.",
    skills: ["Agile", "Jira", "Scrum"],
    location: "New York, NY",
    availability: ["2 Weeks Notice"],
    status: "IN REVIEW",
    rating: 4.7,
    avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: 103,
    name: "Emily Davis",
    email: "edavis.dev@gmail.com",
    role: "DevOps Engineer",
    experience: "5 years exp.",
    skills: ["Docker", "K8s", "CI/CD"],
    location: "Austin, TX",
    availability: ["Available Now"],
    status: "INTERVIEWING",
    rating: 4.8,
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: 104,
    name: "David Lee",
    email: "david.lee88@outlook.com",
    role: "Backend Developer",
    experience: "6 years exp.",
    skills: ["Python", "Django", "SQL"],
    location: "Chicago, IL",
    availability: ["1 Month Notice", "Remote"],
    status: "INTERVIEWING",
    rating: 4.6,
    avatar: "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: 105,
    name: "Maria Garcia",
    email: "maria.g.qa@testlab.io",
    role: "QA Engineer",
    experience: "4 years exp.",
    skills: ["Selenium", "Cypress"],
    location: "Miami, FL",
    availability: ["Available Now"],
    status: "SHORTLISTED",
    rating: 4.9,
    avatar: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: 106,
    name: "James Williams",
    email: "jwilliams@dataminds.com",
    role: "Data Scientist",
    experience: "7 years exp.",
    skills: ["Python", "TF", "SQL"],
    location: "Seattle, WA",
    availability: ["Remote Only"],
    status: "IN REVIEW",
    rating: 5.0,
    avatar: "https://images.pexels.com/photos/1130624/pexels-photo-1130624.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: 107,
    name: "Olivia Martinez",
    email: "omartinez@product.co",
    role: "Product Owner",
    experience: "9 years exp.",
    skills: ["Strategy", "Agile"],
    location: "Denver, CO",
    availability: ["Available Now"],
    status: "OFFER EXTENDED",
    rating: 4.8,
    avatar: "https://images.pexels.com/photos/1181682/pexels-photo-1181682.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: 108,
    name: "John Smith",
    email: "john.smith.ui@design.net",
    role: "UI/UX Designer",
    experience: "3 years exp.",
    skills: ["Figma", "Sketch"],
    location: "Boston, MA",
    availability: ["Part-time"],
    status: "NEW",
    rating: 4.5,
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: 109,
    name: "William Rodriguez",
    email: "will.rod@sysops.org",
    role: "SysAdmin",
    experience: "15 years exp.",
    skills: ["Linux", "Bash", "Net"],
    location: "Houston, TX",
    availability: ["Available Now"],
    status: "REJECTED",
    rating: 4.4,
    avatar: "https://images.pexels.com/photos/428364/pexels-photo-428364.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: 110,
    name: "Ava Wilson",
    email: "ava.w@frontend.dev",
    role: "Jr. Frontend Dev",
    experience: "1 year exp.",
    skills: ["HTML", "CSS", "JS"],
    location: "Portland, OR",
    availability: ["Entry Level"],
    status: "NEW",
    rating: 4.7,
    avatar: "https://images.pexels.com/photos/774095/pexels-photo-774095.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
];


// --- 2. SUB-COMPONENTS ---

const FilterCheckbox = memo(({ label }) => (
  <label><input type="checkbox" /> {label}</label>
));

const FilterGroup = memo(({ title, children }) => (
  <div className="fg">
    <div className="fg-title">{title}</div>
    <div className="fg-body">{children}</div>
  </div>
));

// New Badge component specifically for Availability tags
const AvailabilityBadge = ({ text }) => {
  let style = { bg: "#f3f4f6", text: "#374151" }; // Default Gray

  if (text.includes("Available Now")) {
    style = { bg: "#dcfce7", text: "#166534" }; // Green
  } else if (text.includes("Remote")) {
    style = { bg: "#dbeafe", text: "#1e40af" }; // Blue
  } else if (text.includes("Notice") || text.includes("Part-time")) {
    style = { bg: "#ffedd5", text: "#9a3412" }; // Orange
  } else if (text.includes("Entry")) {
    style = { bg: "#fce7f3", text: "#be185d" }; // Pink
  }

  return (
    <span style={{ 
      backgroundColor: style.bg, 
      color: style.text, 
      padding: "4px 10px", 
      borderRadius: "6px", 
      fontSize: "11px", 
      fontWeight: "600", 
      whiteSpace: "nowrap",
      display: "inline-block",
      marginRight: "4px",
      marginBottom: "2px"
    }}>
      {text}
    </span>
  );
};

// --- GRID VIEW CARD (Keeps Stars) ---
const CandidateCard = memo(({ candidate, onProfileClick }) => (
  <div className="project-card">
    <div className="card-header">
      <div className="card-header gap-2">
        <img src={candidate.avatar} alt={candidate.name} className="v-avatar" loading="lazy" />
        <div>
          <div className="candidate-name-row"><h4 className="card-title">{candidate.name}</h4></div>
          <div className="candidate-sub">
            <span>{candidate.role}</span>
            <span className="dot">•</span>
            <span>{candidate.experience}</span>
          </div>
        </div>
      </div>
      <div className="candidate-rating"><FaStar /><span>{candidate.rating}</span></div>
    </div>
    <div className="v-tags">
      {candidate.skills.slice(0, 3).map((s) => <span className="status-tag status-progress" key={s}>{s}</span>)}
    </div>
    <div className="candidate-meta">
      <div className="meta-item"><FiMapPin /><span>{candidate.location}</span></div>
    </div>
    <div className="candidate-badges">
        {candidate.availability.map((a) => <span key={a} className="status-tag status-completed">{a}</span>)}
    </div>
    <div className="d-flex gap-3">
      <button className="btn-primary" onClick={onProfileClick}>View Profile</button>
      <button className="btn-secondary">Shortlist</button>
    </div>
  </div>
));

// --- TABLE VIEW ROW (No Stars, Availability Column) ---
const CandidateRow = memo(({ candidate }) => (
  <tr className="v-table-row">
    {/* 1. Checkbox */}
    <td style={{ padding: "16px", borderBottom: "1px solid #f0f0f0", verticalAlign: "top" }}>
      <input type="checkbox" className="row-checkbox" />
    </td>

    {/* 2. Candidate: Avatar, Name, Email (NO RATING) */}
    <td style={{ padding: "16px", borderBottom: "1px solid #f0f0f0", verticalAlign: "top" }}>
      <div style={{ display: "flex", gap: "12px" }}>
        <img src={candidate.avatar} alt="" style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <span style={{ fontWeight: "600", color: "#111827", fontSize: "14px", lineHeight: "1.4" }}>{candidate.name}</span>
          <span style={{ fontSize: "13px", color: "#6b7280" }}>{candidate.email}</span>
        </div>
      </div>
    </td>

    {/* 3. Role & Experience */}
    <td style={{ padding: "16px", borderBottom: "1px solid #f0f0f0", verticalAlign: "top" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}>{candidate.role}</span>
            <span style={{ fontSize: "12px", color: "#6b7280", display: "flex", alignItems: "center", gap: "4px" }}>
                <FiBriefcase size={12} /> {candidate.experience}
            </span>
        </div>
    </td>

    {/* 4. Skills */}
    <td style={{ padding: "16px", borderBottom: "1px solid #f0f0f0", verticalAlign: "top" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", maxWidth: "200px" }}>
            {candidate.skills.slice(0, 2).map(skill => (
                <span key={skill} style={{ background: "#f3f4f6", color: "#4b5563", fontSize: "11px", padding: "2px 6px", borderRadius: "4px", border: "1px solid #e5e7eb" }}>
                    {skill}
                </span>
            ))}
            {candidate.skills.length > 2 && <span style={{ fontSize: "11px", color: "#9ca3af", alignSelf: "center" }}>+{candidate.skills.length - 2}</span>}
        </div>
    </td>

    {/* 5. Location (Split from Availability) */}
    <td style={{ padding: "16px", borderBottom: "1px solid #f0f0f0", verticalAlign: "top" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#4b5563", height: "100%", paddingTop: "2px" }}>
            <FiMapPin size={14} color="#9ca3af"/> {candidate.location}
        </div>
    </td>

    {/* 6. Availability (Formerly Status) */}
    <td style={{ padding: "16px", borderBottom: "1px solid #f0f0f0", verticalAlign: "top" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {candidate.availability.map(avail => (
           <AvailabilityBadge key={avail} text={avail} />
        ))}
      </div>
    </td>

    {/* 7. Action */}
    <td style={{ padding: "16px", borderBottom: "1px solid #f0f0f0", verticalAlign: "top", textAlign: "right" }}>
      <button style={{ border: "none", background: "none", cursor: "pointer", color: "#9ca3af", padding: "4px" }}>
        <FiMoreVertical size={18} />
      </button>
    </td>
  </tr>
));


// --- 3. MAIN COMPONENT ---
const TalentPool = () => {
  const navigate = useNavigate();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const candidates = useMemo(() => candidatesMock, []);

  return (
    <div className="vs-page">
      <div className="projects-container d-flex gap-3">
        <aside className={`vs-filters ${filtersOpen ? "open" : ""}`}>
          <div className="vs-filters-header d-flex justify-content-between">
            <h3 className="">Filters</h3>
            <button className="link-button small mb-2">Clear All</button>
          </div>
          <FilterGroup title="Skills">
            {["React", "Node.js", "Python", "UI/UX Design", "Project Management"].map(s => <FilterCheckbox key={s} label={s} />)}
          </FilterGroup>
          <FilterGroup title="Experience Level">
             {["Entry Level", "Mid Level", "Senior", "Lead", "Executive"].map(level => <FilterCheckbox key={level} label={level} />)}
          </FilterGroup>
          <FilterGroup title="Availability">
            {["Immediately", "Within 1 week", "Within 1 month"].map(time => <FilterCheckbox key={time} label={time} />)}
          </FilterGroup>
          <div className="fg">
            <div className="fg-title">Location</div>
            <div className="loc-input"><FiMapPin /><input type="text" placeholder="Search location…" /></div>
          </div>
          <div className="fg">
             <div className="fg-title">Salary Range</div>
             <input type="range" min="0" max="200" defaultValue="100"/>
             <div className="budget-row"><span>$0</span><span>$200k+</span></div>
          </div>
          <button className="apply" onClick={() => setFiltersOpen(false)}>Apply Filters</button>
        </aside>

        <section className="vs-results">
          <div className="vs-results-head">
            <div className="vs-results-left">
              <h3>{candidates.length} Candidates</h3>
              <button className="filters-applied" onClick={() => setFiltersOpen(!filtersOpen)}>
                <FiFilter className="filters-applied-icon" /> Filters
              </button>
            </div>
            <div className="vs-results-right">
              <div className="view-toggle">
                <button className={`view-btn ${viewMode === 'grid' ? 'view-btn-active' : ''}`} onClick={() => setViewMode('grid')}><FiGrid /></button>
                <button className={`view-btn ${viewMode === 'table' ? 'view-btn-active' : ''}`} onClick={() => setViewMode('table')}><FiList /></button>
              </div>
              {/* <div className="sort-select"><span className="sort-label">Most Recent</span><FiChevronRight className="sort-caret" /></div> */}
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="projects-grid">
              {candidates.map((c) => <CandidateCard key={c.id} candidate={c} onProfileClick={() => navigate("/user/user-talent-profile")} />)}
            </div>
          ) : (
            <div className="table-wrapper" style={{ background: "white", borderRadius: "8px", border: "1px solid #e5e7eb", overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "1000px" }}>
                <thead>
                  <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb", textAlign: "left" }}>
                    <th style={{ padding: "16px", width: "40px" }}><input type="checkbox" /></th>
                    <th style={{ padding: "16px", fontSize: "11px", fontWeight:"600", textTransform: "uppercase", color:"#6b7280" }}>Candidate</th>
                    <th style={{ padding: "16px", fontSize: "11px", fontWeight:"600", textTransform: "uppercase", color:"#6b7280" }}>Role & Experience</th>
                    <th style={{ padding: "16px", fontSize: "11px", fontWeight:"600", textTransform: "uppercase", color:"#6b7280" }}>Skills</th>
                    <th style={{ padding: "16px", fontSize: "11px", fontWeight:"600", textTransform: "uppercase", color:"#6b7280" }}>Location</th>
                    <th style={{ padding: "16px", fontSize: "11px", fontWeight:"600", textTransform: "uppercase", color:"#6b7280" }}>Availability</th>
                    <th style={{ padding: "16px", textAlign: "right", color:"#6b7280" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((c) => <CandidateRow key={c.id} candidate={c} />)}
                </tbody>
              </table>
            </div>
          )}

          <div className="pagination-row">
            <span className="muted small">Showing 1-{candidates.length} of 248 candidates</span>
            <div className="pagination">
              <button className="page-btn active">1</button>
              <button className="page-btn">2</button>
              <button className="page-btn">Next</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TalentPool;
