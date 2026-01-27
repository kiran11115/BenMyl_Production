import React, { useMemo } from 'react';
import { FiEye, FiMapPin, FiPlus } from 'react-icons/fi';
import { BsBuilding } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

// --- DATA ---
const JOBS_DATA = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    type: "Contract",
    rateText: "$80-100/hr",
    experienceText: "5+ yrs",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "GraphQL"]
  },
  {
    id: 2,
    title: "Full Stack Engineer",
    company: "InnovateLabs",
    location: "Hybrid",
    type: "Contract",
    rateText: "$90-120/hr",
    experienceText: "4+ yrs",
    skills: ["Node.js", "React", "MongoDB", "AWS", "Docker"]
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "Creative Studio",
    location: "On-site",
    type: "Full-time",
    rateText: "$60-80/hr",
    experienceText: "3+ yrs",
    skills: ["Figma", "Adobe XD", "Prototyping", "User Research"]
  },
  {
    id: 4,
    title: "React Native Developer",
    company: "AppSolutions",
    location: "Remote",
    type: "Contract",
    rateText: "$70-95/hr",
    experienceText: "4+ yrs",
    skills: ["React Native", "Redux", "iOS", "Android", "Jest"]
  }
];

const PostedJobs = () => {
  const jobs = useMemo(() => JOBS_DATA, []);
  const navigate = useNavigate();

  return (
    <>
      {/* ✅ FIXED RESPONSIVE CSS */}
      <style>{`
        .jobs-wrapper {
          width: 100%;
          margin: 0 auto;
        }

        /* GRID BREAKPOINTS */
        .jobs-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        @media (max-width: 1280px) {
          .jobs-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 1024px) {
          .jobs-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .jobs-grid {
            grid-template-columns: 1fr;
          }
        }

        /* CARD */
        .job-card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 18px;
          display: flex;
          flex-direction: column;
          min-width: 0; /* CRITICAL */
        }

        .job-header {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
        }

        .icon-box {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: #eef2ff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6366f1;
          flex-shrink: 0;
        }

        .job-title {
          font-size: 16px;
          font-weight: 600;
          margin: 0;
        }

        .company {
          font-size: 14px;
          color: #6366f1;
          font-weight: 500;
          margin: 4px 0;
        }

        .location {
          font-size: 13px;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .stats {
          background: #f8fafc;
          border-radius: 12px;
          padding: 12px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 16px;
        }

        .stat-label1 {
          font-size: 12px;
          color: #64748b;
        }

        .stat-value1 {
          font-size: 13px;
          font-weight: 600;
          color: #0f172a;
        }

        .skills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 18px;
        }

        .skill {
          font-size: 12px;
          padding: 6px 12px;
          border-radius: 999px;
          background: #eef2ff;
          color: #4338ca;
          white-space: nowrap;
        }

        .add-btn {
          margin-top: auto;
          width: 100%;
          padding: 12px;
          border-radius: 12px;
          background: #6366f1;
          color: white;
          border: none;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
        }

        .add-btn:hover {
          background: #4f46e5;
        }
      `}</style>

      {/* JSX */}
      <div className="jobs-wrapper">
        <div className="jobs-grid">
          {jobs.map(job => (
            <div key={job.id} className="job-card">

              <div className="job-header">
                <div className="icon-box">
                  <BsBuilding size={22} />
                </div>
                <div>
                  <h3 className="job-title">{job.title}</h3>
                  <div className="company">{job.company}</div>
                  <div className="location">
                    <FiMapPin size={12} /> {job.location}
                  </div>
                </div>
              </div>

              <div className="stats">
                <div>
                  <div className="stat-label1">Budget</div>
                  <div className="stat-value1">{job.rateText}</div>
                </div>
                <div>
                  <div className="stat-label1">Experience</div>
                  <div className="stat-value1">{job.experienceText}</div>
                </div>
                <div>
                  <div className="stat-label1">Type</div>
                  <div className="stat-value1">{job.type}</div>
                </div>
              </div>

              <div className="skills">
                {job.skills.map(skill => (
                  <span key={skill} className="skill">{skill}</span>
                ))}
              </div>

              <button className="btn-primary w-100 d-flex gap-2" onClick={()=>navigate("/user/job-overview")}>
                <FiEye size={16} /> View Details
              </button>

            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PostedJobs;
