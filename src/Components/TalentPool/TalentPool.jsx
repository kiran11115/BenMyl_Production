import React from "react";
import "./TalentPool.css";

const candidates = [
  {
    id: 1,
    name: "Sarah Anderson",
    title: "Senior UX Designer",
    experience: "8 years exp.",
    rating: 4.9,
    reviews: 24,
    skills: ["UI/UX", "Figma", "User Research"],
    location: "San Francisco, CA",
    availableNow: true,
    remote: true,
    initials: "SA",
    avatarColor: "#f97373",
  },
  {
    id: 2,
    name: "Sarah Thompson",
    title: "Senior UX Designer",
    experience: "8 years exp.",
    rating: 4.9,
    reviews: 24,
    skills: ["UI/UX", "Figma", "User Research"],
    location: "San Francisco, CA",
    availableNow: true,
    remote: true,
    initials: "ST",
    avatarColor: "#facc15",
  },
  {
    id: 3,
    name: "Sarah Thompson",
    title: "Senior UX Designer",
    experience: "8 years exp.",
    rating: 4.9,
    reviews: 24,
    skills: ["UI/UX", "Figma", "User Research"],
    location: "San Francisco, CA",
    availableNow: true,
    remote: true,
    initials: "ST",
    avatarColor: "#22c55e",
  },
  {
    id: 4,
    name: "Sarah Thompson",
    title: "Senior UX Designer",
    experience: "8 years exp.",
    rating: 4.9,
    reviews: 24,
    skills: ["UI/UX", "Figma", "User Research"],
    location: "San Francisco, CA",
    availableNow: true,
    remote: true,
    initials: "ST",
    avatarColor: "#38bdf8",
  },
  {
    id: 5,
    name: "Sarah Thompson",
    title: "Senior UX Designer",
    experience: "8 years exp.",
    rating: 4.9,
    reviews: 24,
    skills: ["UI/UX", "Figma", "User Research"],
    location: "San Francisco, CA",
    availableNow: true,
    remote: true,
    initials: "ST",
    avatarColor: "#fb7185",
  },
  {
    id: 6,
    name: "Sarah Thompson",
    title: "Senior UX Designer",
    experience: "8 years exp.",
    rating: 4.9,
    reviews: 24,
    skills: ["UI/UX", "Figma", "User Research"],
    location: "San Francisco, CA",
    availableNow: true,
    remote: true,
    initials: "ST",
    avatarColor: "#a78bfa",
  },
  {
    id: 7,
    name: "Sarah Thompson",
    title: "Senior UX Designer",
    experience: "8 years exp.",
    rating: 4.9,
    reviews: 24,
    skills: ["UI/UX", "Figma", "User Research"],
    location: "San Francisco, CA",
    availableNow: true,
    remote: true,
    initials: "ST",
    avatarColor: "#f97316",
  },
  {
    id: 8,
    name: "Sarah Thompson",
    title: "Senior UX Designer",
    experience: "8 years exp.",
    rating: 4.9,
    reviews: 24,
    skills: ["UI/UX", "Figma", "User Research"],
    location: "San Francisco, CA",
    availableNow: true,
    remote: true,
    initials: "ST",
    avatarColor: "#22c55e",
  },
  {
    id: 9,
    name: "Sarah Thompson",
    title: "Senior UX Designer",
    experience: "8 years exp.",
    rating: 4.9,
    reviews: 24,
    skills: ["UI/UX", "Figma", "User Research"],
    location: "San Francisco, CA",
    availableNow: true,
    remote: true,
    initials: "ST",
    avatarColor: "#0ea5e9",
  },
];

const TalentPool = () => {
  return (
    <div className="candidates-page">
      {/* LEFT SIDEBAR FILTERS */}
      <aside className="filters-panel">
        <h3 className="filters-title">Skills</h3>
        <ul className="filters-list">
          {["React", "Node.js", "Python", "UI/UX Design", "Project Management"].map(
            (skill) => (
              <li key={skill} className="filters-item">
                <label>
                  <input type="checkbox" />
                  <span>{skill}</span>
                </label>
              </li>
            )
          )}
        </ul>

        <h3 className="filters-title">Experience Level</h3>
        <ul className="filters-list">
          {["Entry Level", "Mid Level", "Senior", "Lead", "Executive"].map(
            (lvl) => (
              <li key={lvl} className="filters-item">
                <label>
                  <input type="radio" name="experience" />
                  <span>{lvl}</span>
                </label>
              </li>
            )
          )}
        </ul>

        <h3 className="filters-title">Availability</h3>
        <ul className="filters-list">
          {["Immediately", "Within 1 week", "Within 1 month"].map((opt) => (
            <li key={opt} className="filters-item">
              <label>
                <input type="radio" name="availability" />
                <span>{opt}</span>
              </label>
            </li>
          ))}
        </ul>

        <h3 className="filters-title">Location</h3>
        <div className="search-location">
          <span className="search-icon">🔍</span>
          <input placeholder="Search location..." />
        </div>

        <h3 className="filters-title">Salary Range</h3>
        <div className="salary-wrapper">
          <div className="salary-values">
            <span>$0</span>
            <span>$200k+</span>
          </div>
          <input type="range" min="0" max="200" className="salary-range" />
        </div>

        <button className="btn-primary full-width">Apply Filters</button>
        <button className="btn-link full-width clear-all">Clear All</button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="candidates-main">
        {/* HEADER */}
        <header className="candidates-header">
          <div className="header-left">
            <h2>248 Candidates</h2>
            <span className="filters-applied">3 Filters Applied</span>
          </div>
          <div className="header-right">
            <div className="view-toggle">
              <button className="view-btn view-btn-active">▥</button>
              <button className="view-btn">≣</button>
            </div>
            <div className="sort-wrapper">
              <label>Sort by</label>
              <select>
                <option>Most Recent</option>
                <option>Highest Rated</option>
                <option>Experience</option>
              </select>
            </div>
          </div>
        </header>

        {/* GRID OF CARDS */}
        <section className="candidates-grid">
          {candidates.map((c) => (
            <article className="candidate-card" key={c.id}>
              <div className="card-header">
                <div className="card-avatar" style={{ background: c.avatarColor }}>
                  {c.initials}
                </div>
                <div className="card-info">
                  <div className="card-info-top">
                    <h4>{c.name}</h4>
                    <button className="icon-btn" title="Save">
                      ☆
                    </button>
                  </div>
                  <p className="card-title">{c.title}</p>
                  <div className="card-meta">
                    <span className="meta-item">
                      ⏱ <span>{c.experience}</span>
                    </span>
                    <span className="meta-item">
                      ⭐ {c.rating} <span className="meta-reviews">({c.reviews})</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="card-tags">
                {c.skills.map((skill) => (
                  <span key={skill} className="tag">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="card-location-row">
                <span className="location-icon">📍</span>
                <span className="location-text">{c.location}</span>
              </div>

              <div className="card-badges">
                {c.availableNow && (
                  <span className="badge badge-available">Available Now</span>
                )}
                {c.remote && <span className="badge badge-remote">Remote</span>}
              </div>

              <div className="card-actions">
                <button className="btn-primary">View Profile</button>
                <button className="btn-secondary">Shortlist</button>
              </div>
            </article>
          ))}
        </section>

        {/* FOOTER / PAGINATION */}
        <footer className="candidates-footer">
          <span>Showing 1–9 of 248 candidates</span>
          <div className="pagination">
            <button className="page-btn">{"<"}</button>
            <button className="page-btn page-active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <span className="page-dots">…</span>
            <button className="page-btn">27</button>
            <button className="page-btn">{">"}</button>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default TalentPool;
