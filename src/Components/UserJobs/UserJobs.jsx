import React, { useState, useMemo } from 'react';
import { FiSearch, FiMapPin, FiClock, FiDollarSign, FiUser } from 'react-icons/fi';
import { BsBuilding } from 'react-icons/bs';
import JobFilters from '../Filters/JobFilters';
import JobModal from './JobModal';
import './Jobs.css';

// --- Expanded Mock Data with specific attributes for filtering ---
const JOBS_DATA = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "Remote",
    type: "Contract",
    minRate: 80,
    maxRate: 100,
    rateText: "$80-100/hour",
    experienceLevel: "Senior Level",
    experienceText: "5+ years experience",
    timeLeft: "3 days left",
    description: "We are looking for a Senior Frontend Developer to join our team. You will be responsible for building and maintaining high-quality web applications using modern technologies...",
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
    rateText: "$90-120/hour",
    experienceLevel: "Mid Level",
    experienceText: "4+ years experience",
    timeLeft: "1 day left",
    description: "Seeking a Full Stack Engineer proficient in MERN stack.",
    skills: ["Node.js", "React", "MongoDB", "AWS"]
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "Creative Studio",
    location: "On-site",
    type: "Full-time",
    minRate: 60,
    maxRate: 80,
    rateText: "$60-80/hour",
    experienceLevel: "Mid Level",
    experienceText: "3+ years experience",
    timeLeft: "5 days left",
    description: "Design intuitive user interfaces for mobile apps.",
    skills: ["Figma", "Adobe XD", "Prototyping"]
  },
  {
    id: 4,
    title: "React Native Developer",
    company: "AppSolutions",
    location: "Remote",
    type: "Contract",
    minRate: 70,
    maxRate: 95,
    rateText: "$70-95/hour",
    experienceLevel: "Senior Level",
    experienceText: "4+ years experience",
    timeLeft: "2 days left",
    description: "Build cross-platform mobile applications.",
    skills: ["React Native", "Redux", "iOS", "Android"]
  },
  {
    id: 5,
    title: "Junior Web Developer",
    company: "StartUp Inc",
    location: "Remote",
    type: "Full-time",
    minRate: 30,
    maxRate: 45,
    rateText: "$30-45/hour",
    experienceLevel: "Entry Level",
    experienceText: "1 year experience",
    timeLeft: "6 days left",
    description: "Great opportunity for a junior dev to learn.",
    skills: ["HTML", "CSS", "JavaScript"]
  }
];

const Jobs = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  
  // -- Filter States --
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [filters, setFilters] = useState({
    keyword: "",
    jobType: "All Types",
    minRate: 30,
    experienceLevels: [], // Array of selected strings
    skillTags: ["React", "TypeScript", "Node.js"] // Default tags
  });

  // -- Handler to update filters from child component --
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // -- Filter Logic --
  const filteredJobs = useMemo(() => {
    return JOBS_DATA.filter(job => {
      // 1. Top Bar Search (Title/Company)
      const matchesTopSearch = 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        job.company.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Top Bar Location
      const matchesLocationSearch = 
        job.location.toLowerCase().includes(locationQuery.toLowerCase());

      // 3. Sidebar: Keywords (matches title or skills)
      const matchesSidebarKeyword = 
        !filters.keyword || 
        job.title.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(filters.keyword.toLowerCase()));

      // 4. Sidebar: Job Type
      const matchesType = 
        filters.jobType === "All Types" || 
        job.location === filters.jobType; // Assuming 'Remote'/'Hybrid' maps to location field in this data

      // 5. Sidebar: Rate (Job min rate >= Filter min rate)
      const matchesRate = job.minRate >= filters.minRate;

      // 6. Sidebar: Experience Level (If any selected, job must match one)
      const matchesExperience = 
        filters.experienceLevels.length === 0 || 
        filters.experienceLevels.includes(job.experienceLevel);

      // 7. Sidebar: Skill Tags (Job must have at least one matching tag if tags exist)
      // Note: This is an "OR" logic. Change to "AND" if job must have ALL tags.
      const matchesSkillTags = 
        filters.skillTags.length === 0 ||
        job.skills.some(jobSkill => filters.skillTags.includes(jobSkill));

      return matchesTopSearch && matchesLocationSearch && matchesSidebarKeyword && matchesType && matchesRate && matchesExperience && matchesSidebarKeyword;
    });
  }, [searchQuery, locationQuery, filters]);

  return (
    <div className="jobs-container">
      <div className="jobs-layout">
        
        {/* Component 1: Filters */}
        <JobFilters 
          currentFilters={filters} 
          onFilterChange={updateFilters} 
        />

        {/* Main Content */}
        <main className="jobs-main">

          {/* Jobs Grid */}
          <div className="jobs-grid">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div key={job.id} className={`project-card ${selectedJob?.id === job.id ? 'active-card' : ''}`}>
                  <div className="job-card-top">
                    <div className="company-icon-box">
                      <BsBuilding size={22} />
                    </div>
                    <div className="job-header-info">
                      <h3 className="job-title">{job.title}</h3>
                      <p className="company-name">{job.company}</p>
                    </div>
                    <span className="contract-badge">{job.type}</span>
                  </div>

                  <div className="job-meta-grid">
                    <div className="meta-item">
                      <FiMapPin size={14} /> {job.location}
                    </div>
                    <div className="meta-item">
                      <FiDollarSign size={14} /> {job.rateText}
                    </div>
                    <div className="meta-item">
                      <FiUser size={14} /> {job.experienceText}
                    </div>
                    <div className="meta-item text-orange">
                      <FiClock size={14} /> {job.timeLeft}
                    </div>
                  </div>

                  <div className="card-actions">
                    <button 
                      className="btn-primary"
                      onClick={() => setSelectedJob(job)}
                    >
                      Quick Bid
                    </button>
                    <button 
                      className="btn-secondary"
                      onClick={() => setSelectedJob(job)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <h3>No jobs found matching your filters</h3>
                <p>Try adjusting your search criteria or filters.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Component 2: Modal */}
      <JobModal 
        job={selectedJob} 
        onClose={() => setSelectedJob(null)} 
      />
    </div>
  );
};

export default Jobs;
