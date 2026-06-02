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
      logText: "👤 Admin Console: Initiating new system invite. Provisioning secure access link to department head workspace... Sent."
    },
    {
      id: 1,
      badge: "ACTION",
      badgeType: "action",
      title: "Role Configuration",
      desc: "Sets access limits and module gates",
      icon: <Lock size={18} />,
      logText: "🔐 Access controls applied: Hiring Manager and Recruiter permission sets configured with zero-trust scopes."
    },
    {
      id: 2,
      badge: "ACTION",
      badgeType: "action",
      title: "Token Allotment",
      desc: "Assigns platform orchestration credits",
      icon: <Sparkles size={18} />,
      logText: "💎 AI credits allocated: 5,000 background neural parsing tokens dispatched successfully to recruiter pools."
    },
    {
      id: 3,
      badge: "ACTION",
      badgeType: "action",
      title: "Subscription",
      desc: "Calibrates enterprise license indices",
      icon: <ShieldCheck size={18} />,
      logText: "💳 Enterprise billing verified. Platform features calibrated to premium unlimited tier."
    },
    {
      id: 4,
      badge: "ACTION",
      badgeType: "action",
      title: "Post Job",
      desc: "Define requirements and core job parameters",
      icon: <Briefcase size={18} />,
      logText: "💼 Job posting pipeline initialized. Setting requirement indices..."
    },
    {
      id: 5,
      badge: "ACTION",
      badgeType: "action",
      title: "Create Job",
      desc: "Generates structured role spec details",
      icon: <Plus size={18} />,
      logText: "⚙️ Automatically generating optimized description and key qualifications using AI models."
    },
    {
      id: 6,
      badge: "ACTION",
      badgeType: "action",
      title: "Preview and Post",
      desc: "Publishes listings and shares on LinkedIn",
      icon: <Mail size={18} />,
      logText: "🔗 Channel integration ready. Publishing to internal boards and auto-sharing update on LinkedIn."
    },
    {
      id: 7,
      badge: "ACTION",
      badgeType: "action",
      title: "Find Talent",
      desc: "Slices bench records for matching profiles",
      icon: <Search size={18} />,
      logText: "🔍 Querying database bench records. AI match yielded 12 candidate matches above 85%."
    },
    {
      id: 8,
      badge: "CONDITION",
      badgeType: "condition",
      title: "Shortlist Talent",
      desc: "Filters top candidates for recruiter review",
      icon: <UserCheck size={18} />,
      logText: "⭐ Screening profiles. Top 3 matching profiles shortlisted for active loops."
    },
    {
      id: 9,
      badge: "ACTION",
      badgeType: "action",
      title: "Create Interviews",
      desc: "Blocks schedules via Outlook calendars",
      icon: <Calendar size={18} />,
      logText: "📅 Outlook sync complete. Interview invites successfully drafted and dispatched."
    },
    {
      id: 10,
      badge: "ACTION",
      badgeType: "action",
      title: "Negotiate",
      desc: "Calibrates salary/rate parameters",
      icon: <Clock size={18} />,
      logText: "💰 Rate calibration complete. Candidate profile aligned with project budget cap."
    },
    {
      id: 11,
      badge: "ACTION",
      badgeType: "action",
      title: "Approve Candidate & Create Contract",
      desc: "Generates secure legal staffing contract",
      icon: <Layers size={18} />,
      logText: "📝 Candidate approved. Generating digital staffing contract and dispatching for signatures."
    },
    {
      id: 12,
      badge: "ACTION",
      badgeType: "action",
      title: "Project Progress",
      desc: "Launches onboarding metrics tracking",
      icon: <Activity size={18} />,
      logText: "📈 Contract executed. Logging project start metrics on developer workspace."
    },
    {
      id: 13,
      badge: "FUTURE",
      badgeType: "future",
      title: "Coming Soon",
      desc: "Advanced autonomous payroll sync triggers",
      icon: <Clock size={18} />,
      logText: "🚀 Next phase: Autonomous compliance auditing and smart billing cycles triggers."
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
      logText: "💼 Job posting pipeline initialized. Setting requirement indices..."
    },
    {
      id: 1,
      badge: "ACTION",
      badgeType: "action",
      title: "Create Job",
      desc: "Generates structured role spec details",
      icon: <Plus size={18} />,
      logText: "⚙️ Automatically generating optimized description and key qualifications using AI models."
    },
    {
      id: 2,
      badge: "ACTION",
      badgeType: "action",
      title: "Preview and Post",
      desc: "Publishes listings and shares on LinkedIn",
      icon: <Mail size={18} />,
      logText: "🔗 Channel integration ready. Publishing to internal boards and auto-sharing update on LinkedIn."
    },
    {
      id: 3,
      badge: "ACTION",
      badgeType: "action",
      title: "Find Talent",
      desc: "Slices bench records for matching profiles",
      icon: <Search size={18} />,
      logText: "🔍 Querying database bench records. AI match yielded 12 candidate matches above 85%."
    },
    {
      id: 4,
      badge: "CONDITION",
      badgeType: "condition",
      title: "Shortlist Talent",
      desc: "Filters top candidates for recruiter review",
      icon: <UserCheck size={18} />,
      logText: "⭐ Screening profiles. Top 3 matching profiles shortlisted for active loops."
    },
    {
      id: 5,
      badge: "ACTION",
      badgeType: "action",
      title: "Create Interviews",
      desc: "Blocks schedules via Outlook calendars",
      icon: <Calendar size={18} />,
      logText: "📅 Outlook sync complete. Interview invites successfully drafted and dispatched."
    },
    {
      id: 6,
      badge: "ACTION",
      badgeType: "action",
      title: "Negotiate",
      desc: "Calibrates salary/rate parameters",
      icon: <Clock size={18} />,
      logText: "💰 Rate calibration complete. Candidate profile aligned with project budget cap."
    },
    {
      id: 7,
      badge: "ACTION",
      badgeType: "action",
      title: "Approve Candidate & Create Contract",
      desc: "Generates secure legal staffing contract",
      icon: <Layers size={18} />,
      logText: "📝 Candidate approved. Generating digital staffing contract and dispatching for signatures."
    },
    {
      id: 8,
      badge: "ACTION",
      badgeType: "action",
      title: "Project Progress",
      desc: "Launches onboarding metrics tracking",
      icon: <Activity size={18} />,
      logText: "📈 Contract executed. Logging project start metrics on developer workspace."
    },
    {
      id: 9,
      badge: "FUTURE",
      badgeType: "future",
      title: "Coming Soon",
      desc: "Advanced autonomous payroll sync triggers",
      icon: <Clock size={18} />,
      logText: "🚀 Next phase: Autonomous compliance auditing and smart billing cycles triggers."
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
      logText: "📥 Resume attachment ingress started. Initializing parsing queues..."
    },
    {
      id: 1,
      badge: "ACTION",
      badgeType: "action",
      title: "Review Resumes",
      desc: "Screener extracts developer summaries",
      icon: <Cpu size={18} />,
      logText: "🧠 Processing parsed data cards. Extracting skills, years, and experience matrices."
    },
    {
      id: 2,
      badge: "ACTION",
      badgeType: "action",
      title: "Share and Publish Talent",
      desc: "Publishes to LinkedIn and active Talent Pool",
      icon: <Sparkles size={18} />,
      logText: "📢 Profile aligned. Auto-publishing developer profile to active talent pool and LinkedIn stream."
    },
    {
      id: 3,
      badge: "ACTION",
      badgeType: "action",
      title: "Find Jobs by Roles",
      desc: "Queries portal requirements by skill keys",
      icon: <Search size={18} />,
      logText: "🔍 Scanning portal requirements database. Discovered 5 open client match matches."
    },
    {
      id: 4,
      badge: "ACTION",
      badgeType: "action",
      title: "Make Offer to Job",
      desc: "Submits matched talent profiles to HM",
      icon: <Send size={18} />,
      logText: "✉️ Matching profile dispatched to hiring manager for review."
    },
    {
      id: 5,
      badge: "ACTION",
      badgeType: "action",
      title: "Join Interview",
      desc: "Calibrates candidate loop stages",
      icon: <Calendar size={18} />,
      logText: "📅 Interview schedule confirmed. Connecting candidate to virtual calendar."
    },
    {
      id: 6,
      badge: "ACTION",
      badgeType: "action",
      title: "Negotiate",
      desc: "Coordinates billing rate variables",
      icon: <Clock size={18} />,
      logText: "💰 Rate calibration: Final billing rates agreed by both client and bench vendor."
    },
    {
      id: 7,
      badge: "ACTION",
      badgeType: "action",
      title: "Accept Contract",
      desc: "Executes onboarding documents",
      icon: <CheckCircle2 size={18} />,
      logText: "✍️ Staffing contract accepted. Digitally signing agreement and provisioning vendor tokens."
    },
    {
      id: 8,
      badge: "ACTION",
      badgeType: "action",
      title: "Project Progress",
      desc: "Sets up benchmark tracking",
      icon: <Activity size={18} />,
      logText: "📈 Active assignment tracking triggered. Developer onboards successfully."
    },
    {
      id: 9,
      badge: "FUTURE",
      badgeType: "future",
      title: "Coming Soon",
      desc: "Auto-invoice generation parameters",
      icon: <Clock size={18} />,
      logText: "🚀 Next phase: Automated invoice and timesheet sync triggers."
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
      logText: "🔄 Recruiter active: Launching combined talent pipeline and job posting structures."
    },
    {
      id: 1,
      badge: "ACTION",
      badgeType: "action",
      title: "Review Resumes & Create Job",
      desc: "AI structures descriptions and skills",
      icon: <Cpu size={18} />,
      logText: "🧠 Automated parser parsing incoming applicant CVs while AI drafts role-specs simultaneously."
    },
    {
      id: 2,
      badge: "ACTION",
      badgeType: "action",
      title: "Publish Talent & LinkedIn Post",
      desc: "Dispatches updates across channels",
      icon: <Sparkles size={18} />,
      logText: "📢 Syncing social listings. Rolled out marketing profiles to active pools and LinkedIn."
    },
    {
      id: 3,
      badge: "ACTION",
      badgeType: "action",
      title: "Find Jobs & Match Talent",
      desc: "Runs bidirectional fit indices",
      icon: <Search size={18} />,
      logText: "🔍 Cross-matching 12 benchmark candidates against 5 newly created requisitions."
    },
    {
      id: 4,
      badge: "CONDITION",
      badgeType: "condition",
      title: "Shortlist Candidates",
      desc: "Filters best fits from automated scores",
      icon: <ShieldCheck size={18} />,
      logText: "⭐ 90% score calibration satisfied. Discovered three high-fidelity pairings."
    },
    {
      id: 5,
      badge: "ACTION",
      badgeType: "action",
      title: "Create & Coordinate Interviews",
      desc: "Blocks shared times on Outlook",
      icon: <Calendar size={18} />,
      logText: "📅 Booking panels: Automatically reserving calendars for client and applicant syncs."
    },
    {
      id: 6,
      badge: "ACTION",
      badgeType: "action",
      title: "Negotiate & Rate Sync",
      desc: "Aligns agency margins and rates",
      icon: <Clock size={18} />,
      logText: "💰 Rate calibration complete. Margins, caps, and billings fully synced in agency databases."
    },
    {
      id: 7,
      badge: "ACTION",
      badgeType: "action",
      title: "Approve Candidate & Contract",
      desc: "Dispatches digitally signing packs",
      icon: <Layers size={18} />,
      logText: "📝 Generating execution draft for corporate master services contract."
    },
    {
      id: 8,
      badge: "ACTION",
      badgeType: "action",
      title: "Onboard & Track Progress",
      desc: "Triggers task lists and schedules",
      icon: <Activity size={18} />,
      logText: "📈 Placements confirmed. Active dashboard indicators reporting optimal velocity."
    },
    {
      id: 9,
      badge: "FUTURE",
      badgeType: "future",
      title: "Coming Soon",
      desc: "Fully autonomous smart payout grids",
      icon: <Clock size={18} />,
      logText: "🚀 Next phase: Dynamic billing, timesheets, and auto-settlement protocols."
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
      setSimulationLogs(prev => [...prev, "🎉 Simulation sequence completed. All active routines synchronized successfully!"]);
      return;
    }

    setActiveStep(index);
    setSimulationLogs(prev => [...prev, stepsList[index].logText]);

    timerRef.current = setTimeout(() => {
      runStep(index + 1, stepsList);
    }, 1800);
  };

  const handleSimulate = () => {
    if (simulationStatus === "running") return;
    
    // Clear any existing simulation timers
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setActiveStep(-1);
    setSimulationStatus("running");
    setSimulationLogs(["🚀 Starting Workflow Automation sequence..."]);

    runStep(0, activeSteps);
  };

  return (
    <div className="routines-page-wrapper">
      <div className="routines-page-container">
        
        {/* HEADER AREA */}
        <div className="routines-modal-header">
          <div className="routines-header-title-area">
            <div className="routines-header-glow"></div>
            <h1 className="job-title" style={{ fontSize: '18px' }}>Workflow Automation Orchestrator</h1>
            <p style={{ fontSize: '12px' }}>Execute background scheduling parameters, coordinate system automated operations pipelines, and configure triggers</p>
          </div>
          
          <div className="routines-header-actions">
            <button 
              className={`simulate-btn ${simulationStatus === "running" ? "running" : ""}`}
              onClick={handleSimulate}
              disabled={simulationStatus === "running"}
            >
              {simulationStatus === "running" ? (
                <>
                  <div className="simulate-spinner"></div>
                  Simulating Sequence...
                </>
              ) : (
                <>
                  <Play size={16} fill="currentColor" />
                  Simulate Automation Sequence
                </>
              )}
            </button>
            
            
          </div>
        </div>

        {/* WORKSPACE CONTENT GRID */}
        <div className="routines-modal-body-grid">
          
          {/* LEFT COLUMN: ACTIVE ROUTINE BUILDER MAP */}
          <div className="routines-builder-card">
            <div className="routines-card-header">
              <h2 style={{ fontSize: '12px' }}>Active Routine Builder Map</h2>
              <p style={{ fontSize: '11px' }}>Simulated node flowchart tracking logic from trigger events</p>
            </div>

            <div className="flowchart-container">
              {/* Vertical connector line */}
              <div className="flowchart-connector-line"></div>
              
              {activeSteps.map((step, idx) => {
                const isStepActive = activeStep === step.id;
                const isStepCompleted = activeStep > step.id || simulationStatus === "completed";
                const isStepPending = activeStep < step.id && simulationStatus !== "completed";

                return (
                  <div 
                    key={step.id} 
                    className={`flowchart-node-card ${isStepActive ? "active" : ""} ${isStepCompleted ? "completed" : ""} ${isStepPending ? "pending" : ""}`}
                  >
                    {/* Left Icon Badge */}
                    <div className="node-icon-wrapper">
                      {isStepCompleted ? (
                        <CheckCircle2 size={18} className="success-check-icon" />
                      ) : (
                        step.icon
                      )}
                    </div>

                    {/* Node Content */}
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
                    <button className="reset-logs-btn" onClick={handleReset}>Reset</button>
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
              Drag actions from core registry to insert active rules
            </div>
          </div>

          {/* RIGHT COLUMN: OPERATIONAL PERSONA SELECTION */}
          <div className="routines-templates-card">
            <div className="routines-card-header">
              <h2 style={{ fontSize: '12px' }}>Select Operational Pipeline</h2>
              <p style={{ fontSize: '11px' }}>Configure orchestrator roadmap based on workspace active role</p>
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
                {simulationStatus === "idle" && "READY TO TRANSMIT"}
                {simulationStatus === "running" && "TRANSMITTING SEQUENCE"}
                {simulationStatus === "completed" && "SEQUENCE TRANSMITTED"}
              </div>
            </div>

            {/* EXPLANATORY FLOW TEXT BLOCK */}
            <div className="workflow-explanation-box">
              <div className="explanation-title-row">
                <Info size={14} />
                <h4>Understanding Operational Roles</h4>
              </div>
              <div className="explanation-details">
                <p><strong>Admin Pipeline:</strong> Governs system permissions, provisioning, invite loops, subscription setups, and overall compliance metrics.</p>
                <p><strong>Hiring Manager Flow:</strong> Focuses on requirement creation, sourcing matches, vetting candidates, and executing digital MSA/SOW legal contracts.</p>
                <p><strong>Bench Sales Flow:</strong> Ingresses developer profiles, syndicates listings to pools/social platforms, and automates interview tracking.</p>
                <p><strong>Recruiter Hybrid:</strong> Coordinates mutual matches, bridging client orders with provider bench assets to accelerate onboarding pipelines.</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default ActiveRoutines;
