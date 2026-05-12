import React, { useState, useMemo, useEffect } from "react";
import {
  Clock,
  DollarSign,
  UploadCloud,
  CheckCircle,
  Activity,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Briefcase,
  Globe,
  Users,
  Zap,
} from "lucide-react";
import "./Projects.css";
import StatsRow from "./StatsRow";
import ProjectsHeader from "./ProjectsHeader";
import ProjectsGrid from "./ProjectsGrid";
import PostedJobs from "./PostedJobs";
import { useGetGroupedJobTitlesQuery } from "../../State-Management/Api/TalentPoolApiSlice";



// --- Initial Mock Data ---
const INITIAL_DATA = [
  {
    id: 1,
    title: "E-commerce Website Redesign",
    author: "Sarah Johnson",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80",
    progress: 75,
    dueDate: "2023-12-15",
    budget: 2500,
    status: "In Progress",
    milestones: [
      { id: 1, title: "Requirement Analysis", completed: true, date: "2023-11-01" },
      { id: 2, title: "Design Phase", completed: true, date: "2023-11-15" },
      { id: 3, title: "Frontend Implementation", completed: false, date: "2023-12-01" },
    ],
    team: [
      {
        id: 101,
        name: "Sarah Anderson",
        role: "Senior Frontend Developer",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80",
        experience: "6+ Years",
        rating: 4.8,
        verified: true,
      },
    ],
  },
  {
    id: 2,
    title: "Mobile App Development",
    author: "Michael Chen",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80",
    progress: 90,
    dueDate: "2023-12-20",
    budget: 3800,
    status: "Awaiting Review",
    milestones: [
      { id: 1, title: "App Shell", completed: true, date: "2023-11-01" },
      { id: 2, title: "Feature Integration", completed: true, date: "2023-11-15" },
      { id: 3, title: "User Acceptance Testing", completed: true, date: "2023-12-01" },
    ],
    team: [
      {
        id: 102,
        name: "Linda Garcia",
        role: "Backend Engineer",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80",
        experience: "7+ Years",
        rating: 4.6,
        verified: true,
      },
    ],
  },
  {
    id: 3,
    title: "Brand Identity Design",
    author: "Emma Davis",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80",
    progress: 100,
    dueDate: "2023-12-10",
    budget: 1500,
    status: "Completed",
    milestones: [{ id: 1, title: "Style Guide", completed: true, date: "2023-11-01" }],
    team: [
      {
        id: 103,
        name: "James Thompson",
        role: "UX Designer",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80",
        experience: "4+ Years",
        rating: 4.7,
        verified: true,
      },
    ],
  },
  {
    id: 4,
    title: "Marketing Campaign",
    author: "Alex Thompson",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80",
    progress: 60,
    dueDate: "2023-12-25",
    budget: 2100,
    status: "In Progress",
    milestones: [{ id: 1, title: "Ad Copy", completed: true, date: "2023-11-01" }],
    team: [],
  },
  {
    id: 5,
    title: "SEO Optimization",
    author: "David Miller",
    avatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80",
    progress: 30,
    dueDate: "2024-01-05",
    budget: 1200,
    status: "In Progress",
    milestones: [{ id: 1, title: "Keywords Audit", completed: true, date: "2024-01-01" }],
    team: [],
  },
];

export default function Projects() {
  const [view, setView] = useState("ongoingprojects");
  const [projects, setProjects] = useState(INITIAL_DATA);
  const [activeFilter, setActiveFilter] = useState("All Projects");

  useEffect(() => {
    const customProjects = JSON.parse(localStorage.getItem("customProjects") || "[]");
    if (customProjects.length > 0) {
      setProjects([...INITIAL_DATA, ...customProjects]);
    }
  }, []);

  const userId = localStorage.getItem("CompanyId");
  const { data: apiJobs = [] } = useGetGroupedJobTitlesQuery(userId);

  // --- Dynamic Stats ---
  const projectStats = useMemo(() => {
    const completedProjects = projects.filter((p) => p.status === "Completed");
    const activeProjects = projects.filter((p) => p.status === "In Progress");
    const reviewProjects = projects.filter((p) => p.status === "Awaiting Review");
    const totalEarnings = completedProjects.reduce((sum, p) => sum + p.budget, 0);

    return [
      {
        label: "Total Earnings",
        value: `$${totalEarnings.toLocaleString()}`,
        trend: "+12.5%",
        isPositive: true,
        icon: DollarSign,
        cardType: "card-blue",
        bubbleColor: "#3b82f6",
        isNonFunctional: true,
      },
      {
        label: "Active Projects",
        value: activeProjects.length,
        trend: "In progress",
        isPositive: true,
        icon: Activity,
        cardType: "card-purple",
        bubbleColor: "#a855f7",
        isNonFunctional: true,
      },
      {
        label: "Pending Review",
        value: reviewProjects.length,
        trend: "Needs attention",
        isPositive: false,
        icon: Clock,
        cardType: "card-yellow",
        bubbleColor: "#f59e0b",
        isNonFunctional: true,
      },
      {
        label: "Completed",
        value: completedProjects.length,
        trend: "All time",
        isPositive: true,
        icon: CheckCircle,
        cardType: "card-green",
        bubbleColor: "#22c55e",
        isNonFunctional: true,
      },
    ];
  }, [projects]);

  const jobStats = useMemo(() => {
    const remoteJobs = apiJobs.filter((j) => j.workModels === "Remote").length;
    const fullTimeJobs = apiJobs.filter((j) =>
      j.employeeType?.includes("Full-time")
    ).length;

    return [
      {
        label: "Total Postings",
        value: apiJobs.length,
        trend: "Total active",
        isPositive: true,
        icon: Briefcase,
        cardType: "card-orange",
        bubbleColor: "#f5810c",
      },
      {
        label: "Remote Roles",
        value: remoteJobs,
        trend: "Work from home",
        isPositive: true,
        icon: Globe,
        cardType: "card-cyan",
        bubbleColor: "#0ea5e9",
      },
      {
        label: "Full-Time Roles",
        value: fullTimeJobs,
        trend: "Growth roles",
        isPositive: true,
        icon: Users,
        cardType: "card-blue",
        bubbleColor: "#3b82f6",
      },
      {
        label: "Active Listings",
        value: apiJobs.length,
        trend: "Live now",
        isPositive: true,
        icon: Zap,
        cardType: "card-purple",
        bubbleColor: "#a855f7",
      },
    ];
  }, [apiJobs]);

  const stats = view === "ongoingprojects" ? projectStats : jobStats;

  const filteredProjects = useMemo(() => {
    if (activeFilter === "All Projects") return projects;
    return projects.filter((p) => p.status === activeFilter);
  }, [projects, activeFilter]);

  const handleUpload = (id) => {

    setProjects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: "Awaiting Review", progress: 95 } : p
      )
    );
  };

  const handleReview = (id) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: "Completed", progress: 100 } : p
      )
    );
  };

  return (
    <div className="projects-page-wrapper">
      <div className="projects-container">
        {/* Page heading */}
        <div className="projects-page-header">
          <div>
            <h1 className="projects-page-title">Ongoing Projects</h1>
            <p className="projects-page-subtitle">
              Manage your active projects, track milestones and monitor progress.
            </p>
          </div>
        </div>

        {/* Stats */}
        <StatsRow stats={projectStats} />

        {/* View content */}
        <div className="view-content">
          <div className="upload-main">
            <ProjectsHeader
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
            <ProjectsGrid
              projects={filteredProjects}
              onUpload={handleUpload}
              onReview={handleReview}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
