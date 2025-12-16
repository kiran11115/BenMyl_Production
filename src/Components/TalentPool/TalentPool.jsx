import React, { useState } from "react";
import {
  FiChevronRight,
  FiSearch,
  FiFilter,
  FiMapPin,
  FiGrid,
  FiList,
  FiArrowLeft,
} from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./TalentPool.css";

const candidatesMock = [
  {
    id: 1,
    name: "Sarah Anderson",
    role: "Senior UX Designer",
    experience: "8 years exp.",
    skills: ["UI/UX", "Figma", "User Research"],
    location: "San Francisco, CA",
    availability: ["Available Now", "Remote"],
    rating: 4.9,
    avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
  },
  {
    id: 2,
    name: "Sarah Thompson",
    role: "Senior UX Designer",
    experience: "8 years exp.",
    skills: ["UI/UX", "Figma", "User Research"],
    location: "San Francisco, CA",
    availability: ["Available Now", "Remote"],
    rating: 4.9,
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
  },
  {
    id: 3,
    name: "Sarah Thompson",
    role: "Senior UX Designer",
    experience: "8 years exp.",
    skills: ["UI/UX", "Figma", "User Research"],
    location: "San Francisco, CA",
    availability: ["Available Now", "Remote"],
    rating: 4.9,
    avatar: "https://images.pexels.com/photos/1130624/pexels-photo-1130624.jpeg",
  },
  {
    id: 4,
    name: "Sarah Thompson",
    role: "Senior UX Designer",
    experience: "8 years exp.",
    skills: ["UI/UX", "Figma", "User Research"],
    location: "San Francisco, CA",
    availability: ["Available Now", "Remote"],
    rating: 4.9,
    avatar: "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg",
  },
  {
    id: 5,
    name: "Sarah Thompson",
    role: "Senior UX Designer",
    experience: "8 years exp.",
    skills: ["UI/UX", "Figma", "User Research"],
    location: "San Francisco, CA",
    availability: ["Available Now", "Remote"],
    rating: 4.9,
    avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
  },
  {
    id: 6,
    name: "Sarah Thompson",
    role: "Senior UX Designer",
    experience: "8 years exp.",
    skills: ["UI/UX", "Figma", "User Research"],
    location: "San Francisco, CA",
    availability: ["Available Now", "Remote"],
    rating: 4.9,
    avatar: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg",
  },
  {
    id: 7,
    name: "Sarah Thompson",
    role: "Senior UX Designer",
    experience: "8 years exp.",
    skills: ["UI/UX", "Figma", "User Research"],
    location: "San Francisco, CA",
    availability: ["Available Now", "Remote"],
    rating: 4.9,
    avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
  },
  {
    id: 8,
    name: "Sarah Thompson",
    role: "Senior UX Designer",
    experience: "8 years exp.",
    skills: ["UI/UX", "Figma", "User Research"],
    location: "San Francisco, CA",
    availability: ["Available Now", "Remote"],
    rating: 4.9,
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
  },
  {
    id: 9,
    name: "Sarah Thompson",
    role: "Senior UX Designer",
    experience: "8 years exp.",
    skills: ["UI/UX", "Figma", "User Research"],
    location: "San Francisco, CA",
    availability: ["Available Now", "Remote"],
    rating: 4.9,
    avatar: "https://images.pexels.com/photos/1130624/pexels-photo-1130624.jpeg",
  },
];

const TalentPool = () => {
  const navigate = useNavigate();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const toggleFilters = () => setFiltersOpen((p) => !p);

  return (
    <div className="vs-page">

      {/* layout: filters + results */}
      <div className="vs-content">
        {/* filters */}
        <aside className={`vs-filters ${filtersOpen ? "open" : ""}`}>
          <div className="vs-filters-header">
            <h3>Filters</h3>
            <button className="link-button small">Clear All</button>
          </div>

          <div className="fg">
            <div className="fg-title">Skills</div>
            <div className="fg-body">
              <label>
                <input type="checkbox" /> React
              </label>
              <label>
                <input type="checkbox" /> Node.js
              </label>
              <label>
                <input type="checkbox" /> Python
              </label>
              <label>
                <input type="checkbox" /> UI/UX Design
              </label>
              <label>
                <input type="checkbox" /> Project Management
              </label>
            </div>
          </div>

          <div className="fg">
            <div className="fg-title">Experience Level</div>
            <div className="fg-body">
              <label>
                <input type="checkbox" /> Entry Level
              </label>
              <label>
                <input type="checkbox" /> Mid Level
              </label>
              <label>
                <input type="checkbox" /> Senior
              </label>
              <label>
                <input type="checkbox" /> Lead
              </label>
              <label>
                <input type="checkbox" /> Executive
              </label>
            </div>
          </div>

          <div className="fg">
            <div className="fg-title">Availability</div>
            <div className="fg-body">
              <label>
                <input type="checkbox" /> Immediately
              </label>
              <label>
                <input type="checkbox" /> Within 1 week
              </label>
              <label>
                <input type="checkbox" /> Within 1 month
              </label>
            </div>
          </div>

          <div className="fg">
            <div className="fg-title">Location</div>
            <div className="loc-input">
              <FiMapPin />
              <input type="text" placeholder="Search location…" />
            </div>
          </div>

          <div className="fg">
            <div className="fg-title">Salary Range</div>
            <input type="range" min="0" max="200" />
            <div className="budget-row">
              <span>$0</span>
              <span>$200k+</span>
            </div>
          </div>

          <button className="apply">Apply Filters</button>
        </aside>

        {/* results */}
        <section className="vs-results">
          {/* header */}
          <div className="vs-results-head">
            <div className="vs-results-left">
              <h3>248 Candidates</h3>
              <button className="filters-applied">
                <FiFilter className="filters-applied-icon" />
                Filters Applied (3)
              </button>
            </div>

            <div className="vs-results-right">
              <div className="view-toggle">
                <button className="view-btn view-btn-active">
                  <FiGrid />
                </button>
                <button className="view-btn">
                  <FiList />
                </button>
              </div>

              <div className="sort-select">
                <span className="sort-label">Most Recent</span>
                <FiChevronRight className="sort-caret" />
              </div>
            </div>
          </div>

          {/* grid */}
          <div className="candidate-grid">
            {candidatesMock.map((c) => (
              <div className="candidate-card" key={c.id}>
                <div className="candidate-head">
                  <div className="candidate-main">
                    <img src={c.avatar} alt={c.name} className="v-avatar" />
                    <div>
                      <div className="candidate-name-row">
                        <h4>{c.name}</h4>
                      </div>
                      <div className="candidate-sub">
                        <span>{c.role}</span>
                        <span className="dot">•</span>
                        <span>{c.experience}</span>
                      </div>
                    </div>
                  </div>

                  <div className="candidate-rating">
                    <FaStar />
                    <span>{c.rating}</span>
                  </div>
                </div>

                <div className="v-tags">
                  {c.skills.map((s) => (
                    <span className="tag" key={s}>
                      {s}
                    </span>
                  ))}
                </div>

                <div className="candidate-meta">
                  <div className="meta-item">
                    <FiMapPin />
                    <span>{c.location}</span>
                  </div>
                </div>

                <div className="candidate-badges">
                  {c.availability.map((a) => (
                    <span
                      key={a}
                      className={`badge ${a === "Available Now" ? "badge-green" : "badge-blue"
                        }`}
                    >
                      {a}
                    </span>
                  ))}
                </div>

                <div className="candidate-actions">
                  <button className="btn-primary" onClick={()=>navigate("/user/user-talent-profile")}>View Profile</button>
                  <button className="btn-secondary">Shortlist</button>
                </div>
              </div>
            ))}
          </div>

          {/* pagination */}
          <div className="pagination-row">
            <span className="muted small">
              Showing 1-9 of 248 candidates
            </span>
            <div className="pagination">
              <button className="page-btn active">1</button>
              <button className="page-btn">2</button>
              <button className="page-btn">3</button>
              <button className="page-btn">…</button>
              <button className="page-btn">27</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TalentPool;
