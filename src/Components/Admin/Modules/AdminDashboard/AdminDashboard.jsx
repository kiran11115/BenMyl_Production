import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import {
  Users,
  RefreshCw,
  ShieldCheck,
  Activity,
  Briefcase,
  Upload,
  Sparkles,
  Send,
  Layers3,
  ArrowUpRight,
} from "lucide-react";

import UploadTalentModal from "../../../UploadTalent/UploadTalentModal";

import "../../Modules/AdminDashboard/AdminDashboard.css";

import { useRoleListDetailsQuery } from "../../../../State-Management/Api/PermissionsApiSlice";

import { useGetTeamMembersQuery } from "../../../../State-Management/Api/AdminDetailsApiSlice";

import { useGetAllContractsQuery } from "../../../../State-Management/Api/ContractApiSlice";

import {
  useGetGroupedJobTitlesQuery,
  useTalentPoolMutation,
} from "../../../../State-Management/Api/TalentPoolApiSlice";

const QUICK_ACTIONS = [
  {
    title: "Add New Recruiter",
    desc: "Configure profile, access limits, and KPI scoreboards.",
    icon: <Users size={20} />,
    path: "/Admin/account-settings",
  },

  {
    title: "Post Open Job",
    desc: "Create job listings and matching parameters instantly.",
    icon: <Briefcase size={20} />,
    path: "/Admin/user-post-new-positions",
  },

  {
    title: "Auto Match Sync",
    desc: "Sync candidate profiles against active requirements.",
    icon: <Sparkles size={20} />,
    path: "/Admin/admin-talentpool",
  },
];

function AdminDashboard() {
  const navigate = useNavigate();

  const emailId = localStorage.getItem("Email") || "";

  const companyId =
    localStorage.getItem("logincompanyid") || "";

  const userId =
    localStorage.getItem("CompanyId") || "";

  const [syncing, setSyncing] = useState(false);

  const [toast, setToast] = useState(null);

  const [talentCount, setTalentCount] = useState(0);

  const [showUploadModal, setShowUploadModal] =
    useState(false);
    const [showRoutineModal, setShowRoutineModal] =
  useState(false);

  const { data: rolesData = [] } =
    useRoleListDetailsQuery();

  const { data: teamData } =
    useGetTeamMembersQuery(emailId, {
      skip: !emailId,
    });

  const { data: apiContracts = [] } =
    useGetAllContractsQuery();

  const { data: apiJobs = [] } =
    useGetGroupedJobTitlesQuery(userId, {
      skip: !userId,
    });

  const [getFindTalent] =
    useTalentPoolMutation();

  useEffect(() => {
    if (companyId) {
      getFindTalent({
        companyid: Number(companyId),
        pageNumber: 1,
        pageSize: 1000,
        filters: [],
      })
        .unwrap()
        .then((res) => {
          if (Array.isArray(res)) {
            setTalentCount(res.length);
          }
        });
    }
  }, [companyId, getFindTalent]);

  const teamMembers = useMemo(() => {
    return Array.isArray(teamData)
      ? teamData
      : teamData?.value || [];
  }, [teamData]);

  const triggerSync = () => {
    setSyncing(true);

    setTimeout(() => {
      setSyncing(false);

      setToast(
        "AI systems synchronized successfully."
      );

      setTimeout(() => {
        setToast(null);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="ai-dashboard-wrapper">

      {/* TOAST */}

      {toast && (
        <div className="ai-toast">
          <div className="pulse-dot"></div>
          {toast}
        </div>
      )}

      {/* HERO */}

      <div className="hero-card">

        <div className="hero-left">

          <div className="hero-pill">
            ✦ ENTERPRISE AI PORTAL ENABLED
          </div>

          <h1>
            Welcome Back to BenMyl
          </h1>

          <p>
            Your autonomous recruitment workflow
            is calibrated and running. AI neural
            screens completed
            <strong>
              {" "}
              14,204 parsing jobs{" "}
            </strong>
            successfully today.
          </p>

        </div>

        <div className="hero-buttons">

          <button
            className="launch-btn"
            onClick={triggerSync}
          >
            <RefreshCw
              size={16}
              className={
                syncing ? "spin-icon" : ""
              }
            />

            {syncing
              ? "Syncing..."
              : "Launch AI Workspace"}
          </button>

          <button
  className="routine-btn"
  onClick={() =>
    setShowRoutineModal(true)
  }
>
  View Active Routines
  <ArrowUpRight size={16} />
</button>

        </div>

      </div>

      {/* SEARCH */}

      <div className="command-card">

        <div className="command-title">
          ⌘ INTERACTIVE NEURAL COMMAND INTERFACE
        </div>

        <div className="command-search">

          <input
            type="text"
            placeholder="Type a recruiter, requirement, or AI neural action e.g. 'Show active recruiters with 5+ years React experience'..."
          />

          <button>
            Ask AI
            <Send size={15} />
          </button>

        </div>

        <div className="prompt-row">

          <span>
            Find React developers with 5+
            years
          </span>

          <span>
            Show inactive recruiters
          </span>

          <span>
            Generate vendor report
          </span>

          <span>
            Predict hiring closure rate
          </span>

        </div>

      </div>

      {/* STATS */}

      <div className="stats-grid">

  {/* CARD 1 */}

  <div className="stat-card">

    <div className="stat-header-row">

      <div className="stat-title">
        Active Recruiters
      </div>

      <div className="stat-icon-box">
        <Users size={16} />
      </div>

    </div>

    <div className="stat-number">
      {teamMembers.length}
    </div>

    <div className="stat-footer-row">

      <span>
        Last calibrated 5m ago
      </span>
      </div>

      <div className="green-badge">
        +12%
      </div>

    

    <div className="stat-bottom-link">
      ↗ Optimal Flow
    </div>

  </div>

  {/* CARD 2 */}

  <div className="stat-card">

    <div className="stat-header-row">

      <span className="stat-title">
        Open Requirements
      </span>

      <div className="stat-icon-box">
        <Briefcase size={16} />
      </div>

    </div>

    <div className="stat-number">
      {apiJobs.length}
    </div>

    <div className="stat-footer-row">

      <span>
        Last calibrated 5m ago
      </span>
       </div>

      <div className="green-badge">
        +8%
      </div>

   

    <div className="stat-bottom-link">
      ↗ Optimal Flow
    </div>

  </div>

  {/* CARD 3 */}

  <div className="stat-card">

    <div className="stat-header-row">

      <span className="stat-title">
        Candidate Submissions
      </span>

      <div className="stat-icon-box">
        <Layers3 size={16} />
      </div>

    </div>

    <div className="stat-number">
      {talentCount}
    </div>

    <div className="stat-footer-row">

      <span>
        Last calibrated 5m ago
      </span>
      </div>

      <div className="green-badge">
        +24%
      </div>

    

    <div className="stat-bottom-link">
      ↗ Optimal Flow
    </div>

  </div>

  {/* CARD 4 */}

  <div className="stat-card">

    <div className="stat-header-row">

      <span className="stat-title">
        Hiring Success Rate
      </span>

      <div className="stat-icon-box">
        <ShieldCheck size={16} />
      </div>

    </div>

    <div className="stat-number">
      94.2%
    </div>

    <div className="stat-footer-row">

      <span>
        Last calibrated 5m ago
      </span>
          </div>

      <div className="green-badge">
        +4.1%
      </div>



    <div className="stat-bottom-link">
      ↗ Optimal Flow
    </div>

  </div>

</div>

      {/* CHART SECTION */}

      <div className="chart-grid">

        <div className="graph-card">

          <div className="graph-header">

            <div>

              <h3>
                Hiring Activity Velocity
                Index
              </h3>

              <p>
                Real-time mapping of
                applicant pipelines &
                revenue capture
              </p>

            </div>

            <div className="graph-tabs">

              <button className="active">
                Pipeline Volume
              </button>

              <button>
                Revenue Stream (k$)
              </button>

            </div>

          </div>

          <div className="graph-area">

            <svg
              viewBox="0 0 1000 300"
              className="graph-svg"
            >

              <path
                d="M0 220 C120 70 240 70 360 130 C480 180 580 190 700 100 C790 40 860 30 1000 100"
                fill="none"
                stroke="#5a5de8"
                strokeWidth="5"
                strokeLinecap="round"
              />

              <circle
                cx="390"
                cy="135"
                r="10"
                fill="#5a5de8"
                stroke="#fff"
                strokeWidth="5"
              />

              <circle
                cx="810"
                cy="40"
                r="12"
                fill="#ef4444"
                stroke="#fff"
                strokeWidth="5"
              />

            </svg>

          </div>

          <div className="graph-footer">

            <div>
              <span>
                AVG RECRUITMENT CYCLE
              </span>

              <strong style={{fontSize:14}}>
                11.4 Days
              </strong>
            </div>

            <div>
              <span>
                AI SCORE SUCCESS RATE
              </span>

              <strong style={{fontSize:14,color:'#5B5BD6'}}>
                98.4% Accuracy
              </strong>
            </div>

            <div>
              <span>
                YIELD INDEX GROWTH
              </span>

              <strong style={{fontSize:14,color:'#009966'}}>
                +14% Growth
              </strong>
            </div>

          </div>

        </div>

        {/* LOG */}

        <div className="log-card">

          <div className="log-header">

            <div>

              <h3>
                Autonomous Activity Log
              </h3>

              <p>
                Live triggers from
                sourcing systems
              </p>

            </div>

            <Activity size={18} />

          </div>

          <div className="log-list">

            <div className="log-item">

              <span className="log-tag">
                Sourcing Engine
              </span>

              <p>
                AI-Match paired Candidate
                "Nolan V." with Staffing
                Requirement #4019 (98.2%
                Match Score)
              </p>

              <small>
                2 mins ago
              </small>

            </div>

            <div className="log-item">

              <span className="log-tag">
                Submission Gateway
              </span>

              <p>
                Recruiter Samantha Chen
                submitted 4 candidates to
                "Cloud Solutions Engineer"
              </p>

              <small>
                14 mins ago
              </small>

            </div>

            <div className="log-item">

              <span className="log-tag">
                Client Mapping
              </span>

              <p>
                New Priority requirement
                added: Senior DevOps
                Specialist
              </p>

              <small>
                1 hour ago
              </small>

            </div>

            <div className="log-item">

              <span className="log-tag">
                Bench Validation
              </span>

              <p>
                Vendor "Synapse Sourcing"
                updated 8 hot-list bench
                profiles
              </p>

              <small>
                2 hours ago
              </small>

            </div>

          </div>

          <div className="security-box">

            <span>
              ✓ Security token protocol
              compliant
            </span>

            <strong>
              EXCELLENT
            </strong>

          </div>

        </div>

      </div>

      {/* QUICK ACTIONS */}

      <div className="quick-card">

        <div className="quick-header">

          <div>

            <h3>
              Quick Action Command Console
            </h3>

            <p>
              Launch background processes
              or manual calibration flows
              instantly
            </p>

          </div>

        </div>

        <div className="quick-grid">

          {QUICK_ACTIONS.map(
            (item, index) => (

              <div
                className="quick-item"
                key={index}
                onClick={() =>
                  navigate(item.path)
                }
              >

                <div className="quick-icon">
                  {item.icon}
                </div>

                <h4>
                  {item.title}
                </h4>

                <p>
                  {item.desc}
                </p>

              </div>
            )
          )}

        </div>

      </div>

      {/* MODAL */}

      <UploadTalentModal
        show={showUploadModal}
        hideButton={true}
        onHide={() =>
          setShowUploadModal(false)
        }
        onSuccess={() =>
          setShowUploadModal(false)
        }
      />

      {/* ROUTINE MODAL */}

{showRoutineModal && (

  <div className="routine-modal-overlay">

    <div className="routine-modal">

      {/* HEADER */}

      <div className="routine-header">

        <div className="routine-title">

          <Sparkles size={18} />

          <span>
            EXPRESS DISPATCH CONSOLE
          </span>

        </div>

        <button
          className="routine-close"
          onClick={() =>
            setShowRoutineModal(false)
          }
        >
          ✕
        </button>

      </div>

      <div className="routine-divider"></div>

      <p className="routine-subtitle">

        Instantly execute workspace
        workflows. Select your
        operations parameter matching
        standard staffing lifecycle:

      </p>

      {/* GRID */}

      <div className="routine-grid">

        {/* CREATE JOB */}

        <div
          className="routine-card"
          onClick={() => {
            navigate(
              "/Admin/user-post-new-positions"
            );
            setShowRoutineModal(false);
          }}
        >

          <div className="routine-icon">
            <Briefcase size={18} />
          </div>

          <h4>Create Job</h4>

          <span>
            Create hiring requirements
          </span>

        </div>

        {/* UPLOAD TALENT */}

        <div
          className="routine-card"
          onClick={() => {
            setShowRoutineModal(false);
            setShowUploadModal(true);
          }}
        >

          <div className="routine-icon">
            <Upload size={18} />
          </div>

          <h4>Upload Talent</h4>

          <span>
            AI parser candidate upload
          </span>

        </div>

        {/* TALENT POOL */}

        <div
          className="routine-card"
          onClick={() => {
            navigate(
              "/Admin/admin-talentpool"
            );
            setShowRoutineModal(false);
          }}
        >

          <div className="routine-icon">
            <Users size={18} />
          </div>

          <h4>Talent Pool</h4>

          <span>
            Manage candidate profiles
          </span>

        </div>

        {/* SCHEDULE */}

        <div
          className="routine-card"
          onClick={() => {
            navigate(
              "/Admin/user-schedule-interview"
            );
            setShowRoutineModal(false);
          }}
        >

          <div className="routine-icon">
            <Activity size={18} />
          </div>

          <h4>
            Schedule Interview
          </h4>

          <span>
            Coordinate interview flow
          </span>

        </div>

      </div>

    </div>

  </div>

)}

    </div>
  );
}

export default AdminDashboard;