import React, { useState, useMemo } from 'react';
import { FiSearch, FiMapPin, FiClock, FiDollarSign, FiUser, FiPlus } from 'react-icons/fi';
import { BsBuilding } from 'react-icons/bs';
import JobFilters from '../Filters/JobFilters';
import JobModal from './JobModal';
import './Jobs.css';


// --- EXPANDED DATA TO FILL CARDS ---
const JOBS_DATA = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    type: "Contract",
    minRate: 80,
    maxRate: 100,
    rateText: "$80-100/hr",
    experienceLevel: "Senior Level",
    experienceText: "5+ yrs",
    timeLeft: "3 days left",
    description: "We are looking for a Senior Frontend Developer to join our team. You will be responsible for building and maintaining high-quality web applications using modern technologies.",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "GraphQL"]
  },
  {
    id: 2,
    title: "Full Stack Engineer",
    company: "InnovateLabs",
    location: "Hybrid",
    type: "Contract",
    minRate: 90,
    maxRate: 120,
    rateText: "$90-120/hr",
    experienceLevel: "Mid Level",
    experienceText: "4+ yrs",
    timeLeft: "1 day left",
    description: "Seeking a Full Stack Engineer proficient in MERN stack to lead our backend migration and optimize database performance.",
    skills: ["Node.js", "React", "MongoDB", "AWS", "Docker"]
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "Creative Studio",
    location: "On-site",
    type: "Full-time",
    minRate: 60,
    maxRate: 80,
    rateText: "$60-80/hr",
    experienceLevel: "Mid Level",
    experienceText: "3+ yrs",
    timeLeft: "5 days left",
    description: "Design intuitive user interfaces for mobile apps. You will work closely with product managers to define visual languages.",
    skills: ["Figma", "Adobe XD", "Prototyping", "User Research"]
  },
  {
    id: 4,
    title: "React Native Developer",
    company: "AppSolutions",
    location: "Remote",
    type: "Contract",
    minRate: 70,
    maxRate: 95,
    rateText: "$70-95/hr",
    experienceLevel: "Senior Level",
    experienceText: "4+ yrs",
    timeLeft: "2 days left",
    description: "Build cross-platform mobile applications for iOS and Android. Must have experience with native modules.",
    skills: ["React Native", "Redux", "iOS", "Android", "Jest"]
  }
];


const Jobs = () => {
  const [selectedJob, setSelectedJob] = useState(null);

  // -- Filter States --
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    keyword: "",
    locationType: "Any Type",
    minRate: 0,
    experience: "Any Experience",
    availability: [],
    talentRoles: [],
    locations: [],
    maxBudget: 200,
  });


  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };


  const handleAddTalentClick = (job) => {
    setSelectedJob(job);
  };


  // -- Filter Logic --
  const filteredJobs = useMemo(() => {
    return JOBS_DATA.filter(job => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBudget = job.minRate <= filters.maxBudget;
      return matchesSearch && matchesBudget;
    });
  }, [searchQuery, filters]);


  return (
    <div className="jobs-container">

      {/* 1. Header Section */}
      <div className="search-header-row d-flex justify-content-between">
        <div className="header-text">
          <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--slate-800)' }}>
            Find Jobs
          </h1>
          <p style={{ margin: 0, color: 'var(--slate-500)', fontSize: '14px' }}>
            Search and manage your Jobs network.
          </p>
        </div>

        <div style={{ position: "relative", flex: 1, maxWidth: "400px" }}>
          <FiSearch
            style={{
              position: "absolute",
              left: "12px",
              top: "35%",
              transform: "translateY(-50%)",
              color: "#94a3b8",
            }}
          />
          <input
            type="text"
            placeholder="Search by Talent Role..."
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
      </div>


      {/* 2. Layout (Sidebar + Grid) */}
      <div className="jobs-layout">

        {/* Sidebar */}
        <aside>
          <JobFilters
            currentFilters={filters}
            onFilterChange={updateFilters}
          />
        </aside>


        {/* Main Grid */}
        <main className="jobs-grid">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className={`project-card ${selectedJob?.id === job.id ? 'active-card' : ''}`}
                style={{ gap: '0' }}
              >
                {/* A. Header: Title & Company Info */}
                <div className="job-card-top" style={{ marginBottom: '16px', alignItems: 'flex-start' }}>
                  <div className="company-icon-box large">
                    <BsBuilding size={24} />
                  </div>
                  <div className="job-header-info">
                    <h3 className="job-title" style={{ fontSize: '18px', marginBottom: '6px' }}>{job.title}</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <p className="company-name" style={{ fontSize: '14px', fontWeight: 600, color: '#6366f1' }}>
                        {job.company}
                      </p>
                      <div style={{ fontSize: '13px', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FiMapPin size={12} /> {job.location}
                      </div>
                    </div>
                  </div>
                </div>


                {/* B. Stats Block (Grey Box) */}
                <div className="drawer-stats" style={{ marginBottom: '20px' }}>
                  <div className="drawer-stat-item">
                    <span className="label">Budget</span>
                    <span className="value">{job.rateText}</span>
                  </div>
                  <div className="drawer-stat-item">
                    <span className="label">Experience</span>
                    <span className="value">{job.experienceText}</span>
                  </div>
                  <div className="drawer-stat-item">
                    <span className="label">Type</span>
                    <span className="value">{job.type}</span>
                  </div>
                </div>


                {/* C. Description */}
                {/* <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--slate-800)', margin: '0 0 8px 0' }}>
                    Job Description
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--slate-500)', lineHeight: '1.6', margin: 0 }}>
                    {job.description}
                  </p>
                </div> */}


                {/* D. Skills Cloud */}
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--slate-800)', margin: '0 0 8px 0' }}>
                    Required Skills
                  </h4>
                  <div className="skills-cloud">
                    {job.skills.map(skill => (
                      <span key={skill} className="status-tag status-progress">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>


                {/* E. Action Button */}
                <div className="card-actions full-width" style={{ marginTop: 'auto', borderTop: 'none', paddingTop: 0 }}>
                  <button
                    className="btn-primary full-width"
                    onClick={() => handleAddTalentClick(job)}
                  >
                    <FiPlus size={16} style={{ marginRight: '8px' }} />
                    Add Talent
                  </button>
                </div>


              </div>
            ))
          ) : (
            <div className="card-base" style={{ padding: '40px', textAlign: 'center', gridColumn: '1 / -1' }}>
              <h3>No jobs found matching your filters</h3>
              <p style={{ color: 'var(--slate-500)' }}>Try adjusting your search criteria.</p>
            </div>
          )}
        </main>
      </div>


      {selectedJob && (
        <JobModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
};


export default Jobs;
