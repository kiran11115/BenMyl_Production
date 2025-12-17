import React, { useState, useMemo, memo } from "react";
import { FiGrid, FiList, FiSearch, FiMapPin } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

// Import separated views
import TalentGridView from "./TalentGrid";
import TalentTableView from "./TalentTable";
import "./TalentPool.css";

// --- DATA SOURCE ---
const candidatesMock = [
  {
    id: 101,
    name: "Sarah Johnson",
    email: "sarah.j@techsolutions.com",
    role: "Senior Developer",
    experience: "8 years exp",
    skills: ["React", "Node.js", "AWS"],
    location: "San Francisco, CA",
    availability: ["Available Now", "Remote"],
    status: "SHORTLISTED",
    rating: 4.9,
    avatar:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: 102,
    name: "Michael Chen",
    email: "m.chen@digitaldyn.net",
    role: "Project Manager",
    experience: "12 years exp",
    skills: ["Agile", "Jira", "Scrum"],
    location: "New York, NY",
    availability: ["2 Weeks Notice"],
    status: "IN REVIEW",
    rating: 4.7,
    avatar:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: 103,
    name: "Emily Davis",
    email: "edavis.dev@gmail.com",
    role: "DevOps Engineer",
    experience: "5 years exp",
    skills: ["Docker", "K8s", "CI/CD"],
    location: "Austin, TX",
    availability: ["Available Now"],
    status: "INTERVIEWING",
    rating: 4.8,
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: 104,
    name: "David Lee",
    email: "david.lee88@outlook.com",
    role: "Backend Developer",
    experience: "6 years exp",
    skills: ["Python", "Django", "SQL"],
    location: "Chicago, IL",
    availability: ["1 Month Notice", "Remote"],
    status: "INTERVIEWING",
    rating: 4.6,
    avatar:
      "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: 105,
    name: "Maria Garcia",
    email: "maria.g.qa@testlab.io",
    role: "QA Engineer",
    experience: "4 years exp",
    skills: ["Selenium", "Cypress"],
    location: "Miami, FL",
    availability: ["Available Now"],
    status: "SHORTLISTED",
    rating: 4.9,
    avatar:
      "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: 106,
    name: "James Williams",
    email: "jwilliams@dataminds.com",
    role: "Data Scientist",
    experience: "7 years exp",
    skills: ["Python", "TF", "SQL"],
    location: "Seattle, WA",
    availability: ["Remote Only"],
    status: "IN REVIEW",
    rating: 5.0,
    avatar:
      "https://images.pexels.com/photos/1130624/pexels-photo-1130624.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: 107,
    name: "Olivia Martinez",
    email: "omartinez@product.co",
    role: "Product Owner",
    experience: "9 years exp",
    skills: ["Strategy", "Agile"],
    location: "Denver, CO",
    availability: ["Available Now"],
    status: "OFFER EXTENDED",
    rating: 4.8,
    avatar:
      "https://images.pexels.com/photos/1181682/pexels-photo-1181682.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: 108,
    name: "John Smith",
    email: "john.smith.ui@design.net",
    role: "UI/UX Designer",
    experience: "3 years exp",
    skills: ["Figma", "Sketch"],
    location: "Boston, MA",
    availability: ["Part-time"],
    status: "NEW",
    rating: 4.5,
    avatar:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: 109,
    name: "William Rodriguez",
    email: "will.rod@sysops.org",
    role: "SysAdmin",
    experience: "15 years exp",
    skills: ["Linux", "Bash", "Net"],
    location: "Houston, TX",
    availability: ["Available Now"],
    status: "REJECTED",
    rating: 4.4,
    avatar:
      "https://images.pexels.com/photos/428364/pexels-photo-428364.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: 110,
    name: "Ava Wilson",
    email: "ava.w@frontend.dev",
    role: "Jr. Frontend Dev",
    experience: "1 year exp",
    skills: ["HTML", "CSS", "JS"],
    location: "Portland, OR",
    availability: ["Entry Level"],
    status: "NEW",
    rating: 4.7,
    avatar:
      "https://images.pexels.com/photos/774095/pexels-photo-774095.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
];

// --- LOCAL FILTER COMPONENTS ---
const FilterCheckbox = memo(({ label }) => (
  <label>
    <input type="checkbox" /> {label}
  </label>
));

const FilterGroup = memo(({ title, children }) => (
  <div className="fg">
    <div className="fg-title">{title}</div>
    <div className="fg-body">{children}</div>
  </div>
));

// --- MAIN COMPONENT ---
const TalentPool = () => {
  const navigate = useNavigate();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const candidates = useMemo(() => candidatesMock, []);

  const handleProfileClick = () => {
    navigate("/user/user-talent-profile");
  };

  return (
    <div className="vs-page">
      <div className="projects-container d-flex flex-column gap-3">
        {/* Heading Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <h1
              className="section-title"
              style={{ fontSize: "24px", marginBottom: "8px" }}
            >
              Find Talent
            </h1>
            <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
              Search and manage your Talent network.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              flex: 1,
              maxWidth: "600px",
              justifyContent: "flex-end",
            }}
          >
            <div style={{ position: "relative", flex: 1 }}>
              <FiSearch
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                }}
              />
              <input
                type="text"
                placeholder="Search by Talent Name..."
                style={{
                  width: "100%",
                  padding: "10px 10px 10px 40px",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  outline: "none",
                  fontSize: "14px",
                  color: "#334155",
                }}
              />
            </div>
            <button
              className="add-project-btn"
              style={{ width: "auto", padding: "0 20px" }}
            >
              <span>Find Talent</span>
            </button>
            <div className="vs-results-right">
              <div className="view-toggle1">
                <button
                  className={`view-btn ${
                    viewMode === "grid" ? "toggle active" : ""
                  }`}
                  onClick={() => setViewMode("grid")}
                >
                  <FiGrid />
                </button>
                <button
                  className={`view-btn ${
                    viewMode === "table" ? "toggle active" : ""
                  }`}
                  onClick={() => setViewMode("table")}
                >
                  <FiList />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex gap-3">
          <aside className={`vs-filters ${filtersOpen ? "open" : ""}`}>
            <div className="vs-filters-header d-flex justify-content-between">
              <h3 className="">Filters</h3>
              <button className="link-button small mb-2">Clear All</button>
            </div>
            <FilterGroup title="Skills">
              {[
                "React",
                "Node.js",
                "Python",
                "UI/UX Design",
                "Project Management",
              ].map((s) => (
                <FilterCheckbox key={s} label={s} />
              ))}
            </FilterGroup>
            <FilterGroup title="Experience Level">
              {["Entry Level", "Mid Level", "Senior", "Lead", "Executive"].map(
                (level) => (
                  <FilterCheckbox key={level} label={level} />
                )
              )}
            </FilterGroup>
            <FilterGroup title="Availability">
              {["Immediately", "Within 1 week", "Within 1 month"].map(
                (time) => (
                  <FilterCheckbox key={time} label={time} />
                )
              )}
            </FilterGroup>
            <div className="fg">
              <div className="fg-title">Location</div>
              <div className="loc-input">
                <FiMapPin />
                <input type="text" placeholder="Search location…" />
              </div>
            </div>
            <div className="fg">
              <div className="fg-title">Salary Range</div>
              <input type="range" min="0" max="200" defaultValue="100" />
              <div className="budget-row">
                <span>$0</span>
                <span>$200k+</span>
              </div>
            </div>
            <button className="apply" onClick={() => setFiltersOpen(false)}>
              Apply Filters
            </button>
          </aside>

          <section className="vs-results">
            {viewMode === "grid" ? (
              <TalentGridView
                candidates={candidates}
                onProfileClick={handleProfileClick}
              />
            ) : (
              <TalentTableView candidates={candidates} />
            )}

            <div className="pagination-row">
              <span className="muted small">
                Showing 1-{candidates.length} of 248 candidates
              </span>
              <div className="pagination">
                <button className="page-btn active">1</button>
                <button className="page-btn">2</button>
                <button className="page-btn">Next</button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TalentPool;
