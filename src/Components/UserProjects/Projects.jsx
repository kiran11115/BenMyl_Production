import React from "react";
import {
  Clock,
  Activity,
  Users,
  ShieldCheck,
  DollarSign,
  Zap,
  ArrowLeft,
  ChevronRight,
  GitBranch,
  Target
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Projects.css";

export default function Projects() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Target,
      title: "Interactive Milestone Trackers",
      desc: "Monitor ongoing migrations, app deployments, and audits with visual progress tracking and live percentage indicators.",
      className: "icon-orange"
    },
    // {
    //   icon: Users,
    //   title: "Team Collaboration Workspace",
    //   desc: "Coordinate with developers and engineers directly inside the project space with activity indicators and contribution analytics.",
    //   className: "icon-blue"
    // },
    {
      icon: ShieldCheck,
      title: "Automated Deliverable Reviews",
      desc: "Initiate client/manager review gates for code deliverables, verify compliance checklists, and secure sign-offs automatically.",
      className: "icon-green"
    },
    // {
    //   icon: DollarSign,
    //   title: "Budget & Burn Analytics",
    //   desc: "Track project financial health, burn charts, invoice milestones, and team resource utilization metrics seamlessly.",
    //   className: "icon-purple"
    // },
    {
      icon: Clock,
      title: "Dynamic Deadline Alerts",
      desc: "Stay on top of critical paths with automated countdowns, push alerts for upcoming key dates, and system warnings.",
      className: "icon-blue"
    },
    // {
    //   icon: GitBranch,
    //   title: "Version Control Integration",
    //   desc: "Connect your GitHub or GitLab repositories to automatically synchronize commit histories, build health, and milestones.",
    //   className: "icon-pink"
    // }
  ];

  return (
    <div className="projects-coming-soon-container">
      <div className="cs-hero-card">
        <div className="cs-hero-glow"></div>
        <div className="cs-badge-wrapper">
          <div className="cs-badge">
            <span className="cs-pulse-dot"></span>
            Under Development
          </div>
        </div>
        <h1 className="cs-hero-title">Ongoing Projects</h1>
        <p className="cs-hero-subtitle">
          We are building a robust and comprehensive tracking cockpit for your live projects. 
          Manage your cloud migrations, track development sprints, and monitor quality audits in real-time.
        </p>
      </div>

      <div className="cs-section-divider">
        <div className="cs-divider-line"></div>
        <div className="cs-divider-text">Sneak Peek Features</div>
        <div className="cs-divider-line"></div>
      </div>

      <div className="cs-features-grid">
        {features.map((feat, index) => {
          const IconComponent = feat.icon;
          return (
            <div key={index} className="cs-feature-card">
              <div className={`cs-icon-wrapper ${feat.className}`}>
                <IconComponent size={24} />
              </div>
              <h3 className="cs-feature-title">{feat.title}</h3>
              <p className="cs-feature-desc">{feat.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
