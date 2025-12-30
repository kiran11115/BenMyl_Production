import React, { useState, useMemo, memo } from "react";
import { FiGrid, FiList, FiSearch, FiMapPin } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { GiCheckMark } from "react-icons/gi";
import UserTalentGrid from "./UserTalentGrid";
import UserTalentTable from "./UserTalentTable";
import { FiChevronDown } from "react-icons/fi";

// --- DATA SOURCE ---
const candidatesMock = [
  {
    id: 101,
    name: "Sarah Johnson",
    verified: <GiCheckMark size={14} color="#059669" />,
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
    verified: "",
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
    verified: <GiCheckMark size={14} color="#059669" />,
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
    verified: <GiCheckMark size={14} color="#059669" />,
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
    verified: "",
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
    verified: "",
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
    verified: <GiCheckMark size={14} color="#059669" />,
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
    verified: "",
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
    verified: "",
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
    verified: <GiCheckMark size={14} color="#059669" />,
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

// --- SORTING FUNCTION ---
const sortCandidates = (candidates, sortBy) => {
  return [...candidates].sort((a, b) => {
    switch (sortBy) {
      case 'recommended':
        // Priority: SHORTLISTED > OFFER EXTENDED > INTERVIEWING > IN REVIEW > NEW > REJECTED
        const statusPriority = {
          'SHORTLISTED': 5,
          'OFFER EXTENDED': 4,
          'INTERVIEWING': 3,
          'IN REVIEW': 2,
          'NEW': 1,
          'REJECTED': 0
        };
        return statusPriority[b.status] - statusPriority[a.status] || b.rating - a.rating;

      case 'rating_high':
        return b.rating - a.rating;

      case 'exp_high':
        const expA = parseInt(a.experience.match(/\d+/)?.[0] || 0);
        const expB = parseInt(b.experience.match(/\d+/)?.[0] || 0);
        return expB - expA;

      case 'exp_low':
        const expALow = parseInt(a.experience.match(/\d+/)?.[0] || 0);
        const expBLow = parseInt(b.experience.match(/\d+/)?.[0] || 0);
        return expALow - expBLow;

      case 'rate_low':
        // Mock hourly rate sorting (assuming lower numbers first)
        return Math.random() - 0.5; // Placeholder - add real rate field

      case 'name_asc':
        return a.name.localeCompare(b.name);

      default:
        return 0;
    }
  });
};

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
const UserTalentProfiles = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState('recommended');

  // Memoized sorted candidates
  const sortedCandidates = useMemo(() => {
    return sortCandidates(candidatesMock, sortBy);
  }, [sortBy]);

  const handleProfileClick = () => {
    navigate("/user/talent-profile");
  };

  const styleUserTP = `
  
 

  `;

  return (
    <>
      <style>{styleUserTP}</style>
      <div className="vs-page">
        <div className="projects-container d-flex flex-column gap-3 p-0">
          {/* Heading Section */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <h1
                className="section-title"
                style={{ fontSize: "24px", marginBottom: "8px" }}
              >
                Talent Profiles
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
                maxWidth: "680px",
                justifyContent: "flex-end",
              }}
            >

              {/* FUNCTIONAL SORT DROPDOWN */}
              <div className="sort-wrapper">
                <select
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recommended">Sort by: Recommended</option>
                  <option value="rating_high">Rating: High to Low</option>
                  <option value="exp_high">Experience: High to Low</option>
                  <option value="exp_low">Experience: Low to High</option>
                  <option value="rate_low">Hourly Rate: Low to High</option>
                  <option value="name_asc">Name: A - Z</option>
                </select>
                <FiChevronDown className="sort-icon" />
              </div>


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
                    padding: "7px 10px 7px 40px",
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
                style={{ width: "auto", padding: "6px 20px" }}
              >
                <span>Find Talent</span>
              </button>
              <div className="vs-results-right">
                <div className="view-toggle1">
                  <button
                    className={`view-btn ${viewMode === "grid" ? "toggle active" : ""
                      }`}
                    onClick={() => setViewMode("grid")}
                  >
                    <FiGrid />
                  </button>
                  <button
                    className={`view-btn ${viewMode === "table" ? "toggle active" : ""
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
            <section className="vs-results">
              {viewMode === "grid" ? (
                <UserTalentGrid
                  candidates={sortedCandidates}
                  onProfileClick={handleProfileClick}
                />
              ) : (
                <UserTalentTable candidates={sortedCandidates} />
              )}

              {/* <div className="pagination-row">
                <span className="muted small">
                  Showing 1-{sortedCandidates.length} of 248 candidates
                </span>
                <div className="pagination">
                  <button className="page-btn active">1</button>
                  <button className="page-btn">2</button>
                  <button className="page-btn">Next</button>
                </div>
              </div> */}
            </section>
          </div>
        </div>

        <style jsx>{`
        /* Sort Dropdown Styles */
        .sort-wrapper {
          position: relative;
          margin-right: 8px;
        }
        .sort-select {
          appearance: none;
          background-color: white;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 8px 32px 8px 12px;
          font-size: 13px;
          color: #334155;
          font-weight: 500;
          cursor: pointer;
          outline: none;
          min-width: 180px;
        }
        .sort-select:hover {
          border-color: #cbd5e1;
        }
        .sort-icon {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          pointer-events: none;
        }
      `}</style>
      </div>
    </>
  );
};

export default UserTalentProfiles;
