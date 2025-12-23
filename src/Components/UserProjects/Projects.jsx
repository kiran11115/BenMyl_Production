import React, { useState, useMemo } from "react";
import {
  MoreVertical,
  Clock,
  DollarSign,
  UploadCloud,
  CheckCircle,
  MessageSquare,
  Activity,
  TrendingUp,
  TrendingDown,
  AlertCircle,
} from "lucide-react";
import "./Projects.css";
import StatsRow from "./StatsRow";
import ProjectsTimeline from "./ProjectsTimeline";
import ProjectsHeader from "./ProjectsHeader";
import ProjectsGrid from "./ProjectsGrid";

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
  },
];

// timeline data just for the colored bars
// timeline data for status bars per project
const TIMELINE_DATA = [
  {
    id: 1,
    title: "E-commerce Website Redesign",
    totalHours: "68h",
    active: 65,
    review: 20,
    done: 15,
  },
  {
    id: 2,
    title: "Mobile App Development",
    totalHours: "54h",
    active: 50,
    review: 30,
    done: 20,
  },
  {
    id: 3,
    title: "Brand Identity Design",
    totalHours: "40h",
    active: 30,
    review: 10,
    done: 60,
  },
  {
    id: 4,
    title: "Marketing Campaign",
    totalHours: "72h",
    active: 70,
    review: 15,
    done: 15,
  },
  {
    id: 5,
    title: "SEO Optimization",
    totalHours: "36h",
    active: 55,
    review: 25,
    done: 20,
  },
  {
    id: 6,
    title: "Landing Page A/B Test",
    totalHours: "24h",
    active: 40,
    review: 35,
    done: 25,
  },
];


export default function Projects() {
  const [projects, setProjects] = useState(INITIAL_DATA);
  const [activeFilter, setActiveFilter] = useState("All Projects");

  // --- Dynamic Stats Calculation ---
  const stats = useMemo(() => {
    const completedProjects = projects.filter((p) => p.status === "Completed");
    const activeProjects = projects.filter((p) => p.status === "In Progress");
    const reviewProjects = projects.filter(
      (p) => p.status === "Awaiting Review"
    );

    const totalEarnings = completedProjects.reduce(
      (sum, p) => sum + p.budget,
      0
    );

    return [
      {
        label: "Total Earnings",
        value: `$ ${totalEarnings.toLocaleString()}`,
        trend: "+12.5%",
        isPositive: true,
        icon: DollarSign,
        colorClass: "blue",
      },
      {
        label: "Active Projects",
        value: activeProjects.length,
        trend: "+2 new",
        isPositive: true,
        icon: Activity,
        colorClass: "indigo",
      },
      {
        label: "Pending Review",
        value: reviewProjects.length,
        trend: "Needs attn",
        isPositive: false,
        icon: Clock,
        colorClass: "amber",
      },
      {
        label: "Completed",
        value: completedProjects.length,
        trend: "All time",
        isPositive: true,
        icon: CheckCircle,
        colorClass: "emerald",
      },
    ];
  }, [projects]);

  // --- filter for dropdown ---
  const filteredProjects = useMemo(() => {
    if (activeFilter === "All Projects") return projects;
    if (activeFilter === "In Progress")
      return projects.filter((p) => p.status === "In Progress");
    if (activeFilter === "Awaiting Review")
      return projects.filter((p) => p.status === "Awaiting Review");
    if (activeFilter === "Completed")
      return projects.filter((p) => p.status === "Completed");
    return projects;
  }, [projects, activeFilter]);

  // --- Event Handlers ---
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
        <StatsRow stats={stats} />
        <ProjectsTimeline data={TIMELINE_DATA} />
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
  );
}
