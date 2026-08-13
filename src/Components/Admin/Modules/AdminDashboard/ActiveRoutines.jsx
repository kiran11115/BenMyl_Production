import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Database,
  Cpu,
  Mail,
  Calendar,
  Zap,
  Play,
  CheckCircle2,
  X,
  Sparkles,
  Info,
  Clock,
  Briefcase,
  Search,
  ShieldCheck,
  Plus,
  Users,
  Activity,
  Upload,
  Send,
  Lock,
  Layers,
  UserCheck
} from "lucide-react";
import "./ActiveRoutines.css";

// -------------------------------------------------------------
// -------------------------------------------------------------
// DYNAMIC WORKFLOW PIPELINES PER OPERATIONAL ROLE
// -------------------------------------------------------------
const WORKFLOWS = {
  admin: [
    {
      id: 0,
      badge: "TRIGGER",
      badgeType: "trigger",
      title: "Invite and Add User",
      desc: "Sets up corporate portal credentials",
      icon: <Users size={18} />,
      logText: "Adding a new user and sending them an invite link."
    },
    {
      id: 1,
      badge: "ACTION",
      badgeType: "action",
      title: "Role Configuration",
      desc: "Sets access limits and module gates",
      icon: <Lock size={18} />,
      logText: "Setting up what parts of the app the new user can access."
    },
    {
      id: 2,
      badge: "ACTION",
      badgeType: "action",
      title: "Token Allotment",
      desc: "Assigns platform orchestration credits",
      icon: <Sparkles size={18} />,
      logText: "Giving the user AI credits so they can use smart features."
    },
    {
      id: 3,
      badge: "ACTION",
      badgeType: "action",
      title: "Subscription",
      desc: "Calibrates enterprise license indices",
      icon: <ShieldCheck size={18} />,
      logText: "Checking the company's billing plan to unlock premium tools."
    },
    {
      id: 4,
      badge: "ACTION",
      badgeType: "action",
      title: "Post Job",
      desc: "Define requirements and core job parameters",
      icon: <Briefcase size={18} />,
      logText: "Getting ready to create a new job opening."
    },
    {
      id: 5,
      badge: "ACTION",
      badgeType: "action",
      title: "Create Job",
      desc: "Generates structured role spec details",
      icon: <Plus size={18} />,
      logText: "Automatically writing the job description using AI."
    },
    {
      id: 6,
      badge: "ACTION",
      badgeType: "action",
      title: "Preview and Post",
      desc: "Publishes listings and shares on LinkedIn",
      icon: <Mail size={18} />,
      logText: "Publishing the job to the internal board and LinkedIn."
    },
    {
      id: 7,
      badge: "ACTION",
      badgeType: "action",
      title: "Find Talent",
      desc: "Slices bench records for matching profiles",
      icon: <Search size={18} />,
      logText: "Searching our database to find candidates that match the job."
    },
    {
      id: 8,
      badge: "CONDITION",
      badgeType: "condition",
      title: "Shortlist Talent",
      desc: "Filters top candidates for recruiter review",
      icon: <UserCheck size={18} />,
      logText: "Picking the top candidates for the recruiter to review."
    },
    {
      id: 9,
      badge: "ACTION",
      badgeType: "action",
      title: "Create Interviews",
      desc: "Blocks schedules via Outlook calendars",
      icon: <Calendar size={18} />,
      logText: "Scheduling interview times on everyone's calendar."
    },
    {
      id: 10,
      badge: "ACTION",
      badgeType: "action",
      title: "Negotiate",
      desc: "Calibrates salary/rate parameters",
      icon: <Clock size={18} />,
      logText: "Making sure the candidate's expected pay fits the budget."
    },
    {
      id: 11,
      badge: "ACTION",
      badgeType: "action",
      title: "Approve Candidate & Create Contract",
      desc: "Generates secure legal staffing contract",
      icon: <Layers size={18} />,
      logText: "Creating the official contract and sending it out for signatures."
    },
    {
      id: 12,
      badge: "ACTION",
      badgeType: "action",
      title: "Project Progress",
      desc: "Launches onboarding metrics tracking",
      icon: <Activity size={18} />,
      logText: "The contract is signed, and we are now tracking the project."
    },
    {
      id: 13,
      badge: "FUTURE",
      badgeType: "future",
      title: "Coming Soon",
      desc: "Advanced autonomous payroll sync triggers",
      icon: <Clock size={18} />,
      logText: "Coming next: Automatic syncing for payroll and billing."
    }
  ],
  hiring_manager: [
    {
      id: 0,
      badge: "TRIGGER",
      badgeType: "trigger",
      title: "Post Job",
      desc: "Define requirements and core job parameters",
      icon: <Briefcase size={18} />,
      logText: "Starting a new job posting for your team."
    },
    {
      id: 1,
      badge: "ACTION",
      badgeType: "action",
      title: "Create Job",
      desc: "Generates structured role spec details",
      icon: <Plus size={18} />,
      logText: "AI is helping write a great job description and requirements."
    },
    {
      id: 2,
      badge: "ACTION",
      badgeType: "action",
      title: "Preview and Post",
      desc: "Publishes listings and shares on LinkedIn",
      icon: <Mail size={18} />,
      logText: "Sharing the new job on LinkedIn and job boards."
    },
    {
      id: 3,
      badge: "ACTION",
      badgeType: "action",
      title: "Find Talent",
      desc: "Slices bench records for matching profiles",
      icon: <Search size={18} />,
      logText: "Looking through available candidates to find the best match."
    },
    {
      id: 4,
      badge: "CONDITION",
      badgeType: "condition",
      title: "Shortlist Talent",
      desc: "Filters top candidates for recruiter review",
      icon: <UserCheck size={18} />,
      logText: "Selecting the best matching profiles to interview."
    },
    {
      id: 5,
      badge: "ACTION",
      badgeType: "action",
      title: "Create Interviews",
      desc: "Blocks schedules via Outlook calendars",
      icon: <Calendar size={18} />,
      logText: "Sending out calendar invites to schedule the interviews."
    },
    {
      id: 6,
      badge: "ACTION",
      badgeType: "action",
      title: "Negotiate",
      desc: "Calibrates salary/rate parameters",
      icon: <Clock size={18} />,
      logText: "Discussing and finalizing the pay rate."
    },
    {
      id: 7,
      badge: "ACTION",
      badgeType: "action",
      title: "Approve Candidate & Create Contract",
      desc: "Generates secure legal staffing contract",
      icon: <Layers size={18} />,
      logText: "Approving the hire and sending the legal contract."
    },
    {
      id: 8,
      badge: "ACTION",
      badgeType: "action",
      title: "Project Progress",
      desc: "Launches onboarding metrics tracking",
      icon: <Activity size={18} />,
      logText: "Tracking the start of the project and onboarding."
    },
    {
      id: 9,
      badge: "FUTURE",
      badgeType: "future",
      title: "Coming Soon",
      desc: "Advanced autonomous payroll sync triggers",
      icon: <Clock size={18} />,
      logText: "Coming next: Automated timesheets and billing."
    }
  ],
  bench_sales: [
    {
      id: 0,
      badge: "TRIGGER",
      badgeType: "trigger",
      title: "Upload Talent",
      desc: "Ingresses resume assets into portal",
      icon: <Upload size={18} />,
      logText: "Uploading a developer's resume to the system."
    },
    {
      id: 1,
      badge: "ACTION",
      badgeType: "action",
      title: "Review Resumes",
      desc: "Screener extracts developer summaries",
      icon: <Cpu size={18} />,
      logText: "AI is reading the resume to extract skills and experience."
    },
    {
      id: 2,
      badge: "ACTION",
      badgeType: "action",
      title: "Share and Publish Talent",
      desc: "Publishes to LinkedIn and active Talent Pool",
      icon: <Sparkles size={18} />,
      logText: "Publishing the developer's profile to the talent pool and LinkedIn."
    },
    {
      id: 3,
      badge: "ACTION",
      badgeType: "action",
      title: "Find Jobs by Roles",
      desc: "Queries portal requirements by skill keys",
      icon: <Search size={18} />,
      logText: "Searching for open jobs that match the developer's skills."
    },
    {
      id: 4,
      badge: "ACTION",
      badgeType: "action",
      title: "Make Offer to Job",
      desc: "Submits matched talent profiles to HM",
      icon: <Send size={18} />,
      logText: "Sending the developer's profile to hiring managers."
    },
    {
      id: 5,
      badge: "ACTION",
      badgeType: "action",
      title: "Join Interview",
      desc: "Calibrates candidate loop stages",
      icon: <Calendar size={18} />,
      logText: "Scheduling a virtual interview with the client."
    },
    {
      id: 6,
      badge: "ACTION",
      badgeType: "action",
      title: "Negotiate",
      desc: "Coordinates billing rate variables",
      icon: <Clock size={18} />,
      logText: "Agreeing on the final billing rate with the client."
    },
    {
      id: 7,
      badge: "ACTION",
      badgeType: "action",
      title: "Accept Contract",
      desc: "Executes onboarding documents",
      icon: <CheckCircle2 size={18} />,
      logText: "The contract is signed, and the developer is ready to start."
    },
    {
      id: 8,
      badge: "ACTION",
      badgeType: "action",
      title: "Project Progress",
      desc: "Sets up benchmark tracking",
      icon: <Activity size={18} />,
      logText: "Tracking the developer's progress on their new assignment."
    },
    {
      id: 9,
      badge: "FUTURE",
      badgeType: "future",
      title: "Coming Soon",
      desc: "Auto-invoice generation parameters",
      icon: <Clock size={18} />,
      logText: "Coming next: Automatic invoices and timesheets."
    }
  ],
  recruiter: [
    {
      id: 0,
      badge: "TRIGGER",
      badgeType: "trigger",
      title: "Upload Talent & Post Job",
      desc: "Dual sourcing and requirement entry",
      icon: <Database size={18} />,
      logText: "Starting the process to find talent and create a job at the same time."
    },
    {
      id: 1,
      badge: "ACTION",
      badgeType: "action",
      title: "Review Resumes & Create Job",
      desc: "AI structures descriptions and skills",
      icon: <Cpu size={18} />,
      logText: "AI is reading resumes and drafting the job description."
    },
    {
      id: 2,
      badge: "ACTION",
      badgeType: "action",
      title: "Publish Talent & LinkedIn Post",
      desc: "Dispatches updates across channels",
      icon: <Sparkles size={18} />,
      logText: "Sharing the job and talent profiles across our networks."
    },
    {
      id: 3,
      badge: "ACTION",
      badgeType: "action",
      title: "Find Jobs & Match Talent",
      desc: "Runs bidirectional fit indices",
      icon: <Search size={18} />,
      logText: "Matching our best candidates with the open jobs."
    },
    {
      id: 4,
      badge: "CONDITION",
      badgeType: "condition",
      title: "Shortlist Candidates",
      desc: "Filters best fits from automated scores",
      icon: <ShieldCheck size={18} />,
      logText: "Filtering the list to show only the strongest matches."
    },
    {
      id: 5,
      badge: "ACTION",
      badgeType: "action",
      title: "Create & Coordinate Interviews",
      desc: "Blocks shared times on Outlook",
      icon: <Calendar size={18} />,
      logText: "Booking interview times for both the client and the candidate."
    },
    {
      id: 6,
      badge: "ACTION",
      badgeType: "action",
      title: "Negotiate & Rate Sync",
      desc: "Aligns agency margins and rates",
      icon: <Clock size={18} />,
      logText: "Making sure the pay rates and agency fees are all agreed upon."
    },
    {
      id: 7,
      badge: "ACTION",
      badgeType: "action",
      title: "Approve Candidate & Contract",
      desc: "Dispatches digitally signing packs",
      icon: <Layers size={18} />,
      logText: "Generating the final contracts for everyone to sign."
    },
    {
      id: 8,
      badge: "ACTION",
      badgeType: "action",
      title: "Onboard & Track Progress",
      desc: "Triggers task lists and schedules",
      icon: <Activity size={18} />,
      logText: "The placement is confirmed, and we are tracking the onboarding."
    },
    {
      id: 9,
      badge: "FUTURE",
      badgeType: "future",
      title: "Coming Soon",
      desc: "Fully autonomous smart payout grids",
      icon: <Clock size={18} />,
      logText: "Coming next: Smart tracking for payments and timesheets."
    }
  ]
};

function ActiveRoutines() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(-1);
  const [simulationStatus, setSimulationStatus] = useState("idle"); // idle, running, completed
  const [simulationLogs, setSimulationLogs] = useState([]);
  const [selectedRole, setSelectedRole] = useState("admin"); // admin, hiring_manager, bench_sales, recruiter
  const timerRef = React.useRef(null);

  // Get active steps based on selected role pipeline
  const activeSteps = WORKFLOWS[selectedRole] || WORKFLOWS.admin;

  // Safely reset states and clear running timers
  const handleReset = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setActiveStep(-1);
    setSimulationStatus("idle");
    setSimulationLogs([]);
  };

  // Clear running timers on unmount or role switch
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    handleReset();
  }, [selectedRole]);

  const runStep = (index, stepsList) => {
    if (index >= stepsList.length) {
      setSimulationStatus("completed");
      setSimulationLogs(prev => [...prev, "Simulation sequence completed. All active routines synchronized successfully!"]);
      return;
    }

    setActiveStep(index);
    setSimulationLogs(prev => [...prev, stepsList[index].logText]);

    timerRef.current = setTimeout(() => {
      runStep(index + 1, stepsList);
    }, 1800);
  };

  const handleStop = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setSimulationStatus("idle");
    setSimulationLogs(prev => [...prev, "Simulation stopped manually."]);
  };

  const handleSimulate = () => {
    if (simulationStatus === "running") return;
    
    // Clear any existing simulation timers
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setActiveStep(-1);
    setSimulationStatus("running");
    setSimulationLogs(["Starting Workflow Automation sequence..."]);

    runStep(0, activeSteps);
  };

  return (
    <div className="routines-page-wrapper">
      <div className="routines-page-container">
        
        {/* HEADER AREA */}
        <div className="routines-modal-header">
          <div className="routines-header-title-area">
            <div className="routines-header-glow"></div>
            <h1 className="job-title" style={{ fontSize: '18px' }}>Platform Orchestration & Automation Guide</h1>
            <p style={{ fontSize: '12px' }}>Select a role below to see a step-by-step simulation of how we handle jobs, talent, and scheduling in the background.</p>
          </div>
          
          <div className="routines-header-actions">
            {simulationStatus === "running" ? (
              <button 
                className="simulate-btn stop-btn"
                onClick={handleStop}
              >
                <X size={16} fill="currentColor" />
                Stop Simulation
              </button>
            ) : (
              <button 
                className="simulate-btn"
                onClick={handleSimulate}
              >
                <Play size={16} fill="currentColor" />
                Start Simulation
              </button>
            )}
            
          </div>
        </div>

        {/* WORKSPACE CONTENT GRID */}
        <div className="routines-modal-body-grid">
          
          {/* LEFT COLUMN: ACTIVE ROUTINE BUILDER MAP */}
          <div className="routines-builder-card">
            <div className="routines-card-header">
              <h2 style={{ fontSize: '12px' }}>Step-by-Step Flowchart</h2>
              <p style={{ fontSize: '11px' }}>Watch how the process moves from start to finish.</p>
            </div>

            <div className="flowchart-container">
              {activeSteps.map((step, idx) => {
                const isStepActive = activeStep === step.id;
                const isStepCompleted = activeStep > step.id || simulationStatus === "completed";
                const isStepPending = activeStep < step.id && simulationStatus !== "completed";
                const isLast = idx === activeSteps.length - 1;

                return (
                  <div 
                    key={step.id} 
                    className={`flowchart-step ${isStepActive ? "active" : ""} ${isStepCompleted ? "completed" : ""} ${isStepPending ? "pending" : ""}`}
                  >
                    {/* Vertical Line Connector (skip for last item) */}
                    {!isLast && <div className="step-connector-line"></div>}

                    {/* Left Icon Badge */}
                    <div className="step-icon-wrapper">
                      {isStepCompleted ? (
                        <CheckCircle2 size={18} className="success-check-icon" />
                      ) : (
                        step.icon
                      )}
                    </div>

                    {/* Node Content Card */}
                    <div className="flowchart-node-card">
                      <div className="node-content-body">
                        <div className="node-badge-row">
                          <span className={`node-badge badge-${step.badgeType}`}>
                            {step.badge}
                          </span>
                          <h3 className="node-title">{step.title}</h3>
                        </div>
                        <p className="node-desc">{step.desc}</p>
                      </div>

                      {/* Dynamic Status Indicator */}
                      {isStepActive && (
                        <div className="node-status-glow">
                          <span className="pulse-dot-active"></span>
                          <span className="status-text-active">Active</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* DYNAMIC LOGGING OR STEPS WALKTHROUGH */}
            {simulationLogs.length > 0 && (
              <div className="simulation-logs-panel">
                <div className="logs-header">
                  <Clock size={12} />
                  <span>Real-Time Execution Logs</span>
                  {simulationStatus === "completed" && (
                    <button className="reset-logs-btn" onClick={handleReset}>Clear Logs</button>
                  )}
                </div>
                <div className="logs-list-wrapper">
                  {simulationLogs.map((log, index) => (
                    <div key={index} className="log-item-entry">
                      <span className="log-bullet">&gt;</span>
                      <p className="log-text">{log}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="routines-card-footer-mono">
              The flowchart updates automatically as the simulation runs.
            </div>
          </div>

          {/* RIGHT COLUMN: OPERATIONAL PERSONA SELECTION */}
          <div className="routines-templates-card">
            <div className="routines-card-header">
              <h2 style={{ fontSize: '12px' }}>Choose a Role to Explore</h2>
              <p style={{ fontSize: '11px' }}>Click on any role below to see their exact step-by-step process.</p>
            </div>

            <div className="templates-list-container">
              
              {/* Card 1: ADMIN */}
              <div 
                className={`template-item-card ${selectedRole === "admin" ? "selected" : ""}`}
                onClick={() => setSelectedRole("admin")}
              >
                <div className="template-icon-wrapper cpu-icon">
                  <ShieldCheck size={16} />
                </div>
                <div className="template-card-info">
                  <h3 style={{ fontSize: '12px' }}>Admin Operations Pipeline</h3>
                  <p style={{ fontSize: '11px' }}>Configures enterprise controls (Invite & Setup, Role settings, Subscription, AI Tokens) alongside full recruiter flows.</p>
                </div>
              </div>

              {/* Card 2: HIRING MANAGER */}
              <div 
                className={`template-item-card ${selectedRole === "hiring_manager" ? "selected" : ""}`}
                onClick={() => setSelectedRole("hiring_manager")}
              >
                <div className="template-icon-wrapper bolt-icon">
                  <Briefcase size={16} />
                </div>
                <div className="template-card-info">
                  <h3 style={{ fontSize: '12px' }}>Hiring Manager Workflow</h3>
                  <p style={{ fontSize: '11px' }}>Handles job creation, LinkedIn publishing, candidate shortlisting, Outlook calendar loops, MSC generation, and onboarding.</p>
                </div>
              </div>

              {/* Card 3: BENCH SALES */}
              <div 
                className={`template-item-card ${selectedRole === "bench_sales" ? "selected" : ""}`}
                onClick={() => setSelectedRole("bench_sales")}
              >
                <div className="template-icon-wrapper bolt-icon" style={{ backgroundColor: "#ecfdf5", color: "#10b981", borderColor: "#a7f3d0" }}>
                  <Upload size={16} />
                </div>
                <div className="template-card-info">
                  <h3 style={{ fontSize: '12px' }}>Bench Sales Workflow</h3>
                  <p style={{ fontSize: '11px' }}>Manages benchmark profiles, parsing, social publishing, automated applications, virtual loops, and timesheet setups.</p>
                </div>
              </div>

              {/* Card 4: RECRUITER */}
              <div 
                className={`template-item-card ${selectedRole === "recruiter" ? "selected" : ""}`}
                onClick={() => setSelectedRole("recruiter")}
              >
                <div className="template-icon-wrapper calendar-icon">
                  <Zap size={16} />
                </div>
                <div className="template-card-info">
                  <h3 style={{ fontSize: '12px' }}>Recruiter Workflow (Combined)</h3>
                  <p style={{ fontSize: '11px' }}>Coordinates bidirectional syncs, aligning both Client requisitions (Hiring Managers) and Bench Sales providers concurrently.</p>
                </div>
              </div>

            </div>

            {/* Bottom Status Block */}
            <div className="alignment-status-box">
              <div className="alignment-left">
                <Sparkles size={14} className="sparkles-purple" />
                <span>Selected Template Aligned</span>
              </div>
              <div className={`alignment-right ${simulationStatus}`}>
                {simulationStatus === "idle" && "READY TO SIMULATE"}
                {simulationStatus === "running" && "SIMULATION IN PROGRESS"}
                {simulationStatus === "completed" && "SIMULATION FINISHED"}
              </div>
            </div>

            {/* EXPLANATORY FLOW TEXT BLOCK (Dynamic) */}
            <div className="workflow-explanation-box">
              <div className="explanation-title-row">
                <Info size={14} />
                <h4>Role Details</h4>
              </div>
              <div className="explanation-details">
                {selectedRole === "admin" && (
                  <p><strong>Admin:</strong> Adds new users, sets up permissions, and manages billing so everything runs smoothly.</p>
                )}
                {selectedRole === "hiring_manager" && (
                  <p><strong>Hiring Manager:</strong> Creates new jobs, reviews matched candidates, schedules interviews, and approves new hires.</p>
                )}
                {selectedRole === "bench_sales" && (
                  <p><strong>Bench Sales:</strong> Uploads resumes, shares developer profiles, and helps schedule interviews to place talent.</p>
                )}
                {selectedRole === "recruiter" && (
                  <p><strong>Recruiter:</strong> The matchmaker. Finds the best talent for open jobs, handles interviews, and manages the final contracts.</p>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default ActiveRoutines;
