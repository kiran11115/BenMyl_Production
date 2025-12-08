import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Badge } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { List, CheckCircle, Clock, CreditCard, Plus, Send, Upload, AlertCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BiSolidEdit } from "react-icons/bi";
import { BsTrash } from "react-icons/bs";
import EmployeeTable from "./Tables/EmployeeTable";
import TopMatchingJobs from "./Carousels/TopMatchingJobs";
import BenchUtilizationChart from "./Charts/BenchUtilizationChart";
import DailyUpdatesNotifications from "./DailyUpdatesNotifications";


const Dashboard = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [searchTerm, setSearchTerm] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [experienceRange, setExperienceRange] = useState([0, 20]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAIModal, setShowAIModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  //  Action Button Styles
  const actionBtnStyle = {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "6px 8px",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    color: "#6c757d",
  };

  const actionBtnHoverStyle = {
    ...actionBtnStyle,
    color: "#0d6efd",
    backgroundColor: "#e7f1ff",
  };

  const deleteBtnHoverStyle = {
    ...actionBtnStyle,
    color: "#dc3545",
    backgroundColor: "#ffe7e7",
  };

  //  Employee Data
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Senior Developer",
      skills: ["React", "Node.js", "Python"],
      experience: 5,
      currentProject: "BenMyl Platform",
      availability: "Available",
      status: "Active",
      source: "Created Using Resume",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "UI/UX Designer",
      skills: ["Figma", "Adobe XD", "Sketch"],
      experience: 3,
      currentProject: "Design System",
      availability: "On Project",
      status: "Draft",
      source: "Manual Entry",
    },
    {
      id: 3,
      name: "Rajesh Kumar",
      email: "rajesh.kumar@example.com",
      role: "Full Stack Developer",
      skills: ["React", "Node.js", "MongoDB"],
      experience: 4,
      currentProject: "E-Commerce Dashboard",
      availability: "Available",
      status: "Active",
      source: "Created Using Resume",
    },
    {
      id: 4,
      name: "Priya Nair",
      email: "priya.nair@example.com",
      role: "Frontend Developer",
      skills: ["React", "Redux", "CSS"],
      experience: 2,
      currentProject: "HRMS Portal",
      availability: "On Project",
      status: "Draft",
      source: "Manual Entry",
    },
    {
      id: 5,
      name: "Michael Johnson",
      email: "michael.j@example.com",
      role: "Backend Developer",
      skills: ["Node.js", "Express", "MySQL"],
      experience: 6,
      currentProject: "Payment Gateway",
      availability: "Available",
      status: "Active",
      source: "Created Using Resume",
    },
    {
      id: 6,
      name: "Sneha Patel",
      email: "sneha.patel@example.com",
      role: "QA Engineer",
      skills: ["Selenium", "Jest", "Cypress"],
      experience: 3,
      currentProject: "Test Automation Suite",
      availability: "On Project",
      status: "Draft",
      source: "Manual Entry",
    },
    {
      id: 7,
      name: "Vikram Singh",
      email: "vikram.singh@example.com",
      role: "React Native Developer",
      skills: ["React Native", "Redux Toolkit", "Firebase"],
      experience: 4,
      currentProject: "Mobile Banking App",
      availability: "Available",
      status: "Active",
      source: "Created Using Resume",
    },
    {
      id: 8,
      name: "Sara Wilson",
      email: "sara.wilson@example.com",
      role: "DevOps Engineer",
      skills: ["AWS", "Docker", "CI/CD"],
      experience: 5,
      currentProject: "Cloud Migration",
      availability: "On Project",
      status: "Draft",
      source: "Manual Entry",
    },
    {
      id: 9,
      name: "Rohit Sharma",
      email: "rohit.sharma@example.com",
      role: "Project Manager",
      skills: ["Agile", "JIRA", "Scrum"],
      experience: 8,
      currentProject: "Insurance Platform",
      availability: "Available",
      status: "Active",
      source: "Created Using Resume",
    },
    {
      id: 10,
      name: "Ananya Gupta",
      email: "ananya.g@example.com",
      role: "Data Analyst",
      skills: ["Power BI", "SQL", "Excel"],
      experience: 3,
      currentProject: "Sales Analytics Dashboard",
      availability: "On Project",
      status: "Draft",
      source: "Manual Entry",
    },
    {
      id: 11,
      name: "Kevin Thompson",
      email: "kevin.t@example.com",
      role: "Machine Learning Engineer",
      skills: ["Python", "TensorFlow", "Pandas"],
      experience: 5,
      currentProject: "Fraud Detection System",
      availability: "Available",
      status: "Active",
      source: "Created Using Resume",
    },
    {
      id: 12,
      name: "Emily Carter",
      email: "emily.carter@example.com",
      role: "UI Developer",
      skills: ["HTML", "CSS", "Bootstrap"],
      experience: 2,
      currentProject: "Corporate Website",
      availability: "On Project",
      status: "Draft",
      source: "Manual Entry",
    },
    {
      id: 13,
      name: "Abhinav Reddy",
      email: "abhinav.r@example.com",
      role: "API Developer",
      skills: ["Node.js", "REST APIs", "PostgreSQL"],
      experience: 4,
      currentProject: "Logistics Platform",
      availability: "Available",
      status: "Active",
      source: "Created Using Resume",
    },
    {
      id: 14,
      name: "Harshita Mehta",
      email: "harshita.m@example.com",
      role: "Software Tester",
      skills: ["Postman", "API Testing", "JIRA"],
      experience: 3,
      currentProject: "CRM Testing",
      availability: "On Project",
      status: "Draft",
      source: "Manual Entry",
    },
  ]);

  //  Responsive
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //  Alert
  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: "", message: "" }), 4000);
  };

  //  Status Badge
  const getStatusBadge = (status) => {
    const s = status.toLowerCase();
    if (s === "active") {
      return (
        <Badge
          bg="success"
          style={{
            padding: "6px 10px",
            fontSize: "0.8rem",
            fontWeight: 500,
            borderRadius: "3px",
          }}
        >
          {status}
        </Badge>
      );
    } else if (s === "draft") {
      return (
        <Badge
          bg="warning"
          text="dark"
          style={{
            padding: "6px 10px",
            fontSize: "0.8rem",
            fontWeight: 500,
            borderRadius: "3px",
          }}
        >
          {status}
        </Badge>
      );
    } else {
      return (
        <Badge
          bg="secondary"
          style={{
            padding: "6px 10px",
            fontSize: "0.8rem",
            fontWeight: 500,
            borderRadius: "3px",
          }}
        >
          {status}
        </Badge>
      );
    }
  };

  //  Formik for Editing
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      role: "",
      experience: "",
      currentProject: "",
      availability: "Available",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      role: Yup.string().required("Role is required"),
      experience: Yup.number().required().min(0).max(50),
    }),
    onSubmit: (values) => {
      const updatedEmployee = {
        ...editingEmployee,
        ...values,
        experience: parseInt(values.experience),
        skills,
      };
      setEmployees(
        employees.map((emp) =>
          emp.id === editingEmployee.id ? updatedEmployee : emp
        )
      );
      setShowEditModal(false);
      setEditingEmployee(null);
      formik.resetForm();
      setSkills([]);
      showAlert("success", "Employee updated successfully!");
    },
  });

  //  Filtering Logic
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.skills.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesSkillFilter =
      skillFilter.trim() === "" ||
      emp.skills.some((skill) =>
        skill.toLowerCase().includes(skillFilter.toLowerCase())
      );

    const matchesExperience =
      emp.experience >= experienceRange[0] &&
      emp.experience <= experienceRange[1];

    const matchesStatus =
      statusFilter === "All" || emp.status === statusFilter;

    return (
      matchesSearch &&
      matchesSkillFilter &&
      matchesExperience &&
      matchesStatus
    );
  });

  //  Pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handlePrevious = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

  const tdStyle = {
    padding: "14px 16px",
    color: "#212529",
    fontSize: "0.9rem",
  };

  const handleEdit = (employee) => {
    if (!employee) return;
    setEditingEmployee(employee);
    setSkills(employee.skills || []);
    formik.setValues({
      name: employee.name || "",
      email: employee.email || "",
      role: employee.role || "",
      experience: employee.experience || 0,
      currentProject: employee.currentProject || "",
      availability: employee.availability || "Available",
    });
    setShowEditModal(true);
  };

  const statusCellStyle = { ...tdStyle, minWidth: "100px" };
  const actionsCellStyle = { ...tdStyle, minWidth: "120px" };
  const actionButtonsWrapperStyle = {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    alignItems: "center",
  };

  //  Drag & Drop Functions
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const fileArray = Array.from(files).map((file) => ({
      name: file.name,
      size: (file.size / 1024).toFixed(2) + " KB",
      file: file,
    }));
    setUploadedFiles([...uploadedFiles, ...fileArray]);
  };

  const removeFile = (index) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const confirmDelete = () => {
    if (employeeToDelete) {
      setEmployees(employees.filter((emp) => emp.id !== employeeToDelete.id));
      showAlert(
        "success",
        `${employeeToDelete.name} has been deleted successfully!`
      );
      setShowDeleteModal(false);
      setEmployeeToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setEmployeeToDelete(null);
  };

  const handleAIProcess = () => {
    if (uploadedFiles.length > 0) {
      showAlert(
        "success",
        `Processing ${uploadedFiles.length} resume(s) with AI...`
      );
      setTimeout(() => {
        showAlert("success", "AI processing complete! New employees added.");
        setShowAIModal(false);
        setUploadedFiles([]);
      }, 2000);
    }
  };

  const handleSyncHRMS = () => {
    showAlert("success", "Syncing with HRMS...");
  };

  //  Styles
  const labelStyle = {
    fontSize: "12px",
    fontWeight: "700",
    color: "#16151A",
    marginBottom: "0.5rem",
    display: "block",
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid rgb(205, 204, 204)",
    borderRadius: "5px",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  };

  const selectStyle = {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid rgb(205, 204, 204)",
    borderRadius: "5px",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "white",
    cursor: "pointer",
    transition: "border-color 0.2s",
    appearance: "none",
    backgroundImage:
      'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%236b7280\' d=\'M6 9L1 4h10z\'/%3E%3C/svg%3E")',
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 0.75rem center",
    paddingRight: "2.5rem",
  };

  const thStyle = {
    padding: "1rem 0.75rem",
    textAlign: "left",
    fontSize: "12px",
    fontWeight: "700",
    color: "#6b7280",
    textTransform: "uppercase",
    backgroundColor: "#f9fafb",
    borderBottom: "2px solid #e5e7eb",
    letterSpacing: "0.5px",
    whiteSpace: "nowrap",
  };

  const navButtonStyle = (disabled) => ({
    padding: "0.5rem 0.75rem",
    backgroundColor: disabled ? "#f3f4f6" : "white",
    color: disabled ? "#9ca3af" : "#374151",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
  });

  const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "1rem",
    overflowY: "auto",
  };

  const modalContentStyle = {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: isMobile ? "1.5rem" : "2rem",
    maxWidth: isMobile ? "95%" : "700px",
    width: "100%",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    animation: "slideIn 0.3s ease-out",
  };

  const deleteModalContentStyle = {
    backgroundColor: "white",
    borderRadius: "20px",
    padding: isMobile ? "2rem 1.5rem" : "3rem 2.5rem",
    maxWidth: isMobile ? "90%" : "450px",
    width: "100%",
    textAlign: "center",
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    animation: "slideIn 0.3s ease-out",
  };

  const deleteIconContainerStyle = {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundColor: "#fee2e2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 1.5rem",
  };

  const deleteModalTitleStyle = {
    fontSize: isMobile ? "20px" : "24px",
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: "0.75rem",
  };

  const deleteModalTextStyle = {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "2rem",
    lineHeight: "1.6",
  };

  const modalHeaderStyle = {
    fontSize: isMobile ? "20px" : "25px",
    fontWeight: "700",
    color: "#292d34",
    marginBottom: "0.5rem",
  };

  const modalSubtitleStyle = {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "1.5rem",
  };

  const errorTextStyle = {
    fontSize: "11px",
    color: "#dc3545",
    marginTop: "0.25rem",
  };

  const skillsContainerStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
    marginTop: "0.5rem",
    padding: "0.75rem",
    border: "1px solid rgb(205, 204, 204)",
    borderRadius: "5px",
    minHeight: "50px",
    backgroundColor: "#f9fafb",
  };

  const skillTagStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.4rem 0.75rem",
    backgroundColor: "#e0e7ff",
    color: "#3730a3",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "500",
  };

  const dropZoneStyle = {
    border: `2px dashed ${dragActive ? "#2744a0" : "#d1d5db"}`,
    borderRadius: "12px",
    padding: isMobile ? "2rem 1rem" : "3rem 2rem",
    textAlign: "center",
    backgroundColor: dragActive ? "#f0f4ff" : "#f9fafb",
    cursor: "pointer",
    transition: "all 0.3s",
    marginBottom: "1rem",
  };

  const buttonGroupStyle = {
    display: "flex",
    gap: "1rem",
    justifyContent: "flex-end",
    marginTop: "2rem",
    paddingTop: "1.5rem",
    borderTop: "1px solid #e5e7eb",
    flexWrap: "wrap",
  };

  const deleteButtonGroupStyle = {
    display: "flex",
    gap: "0.75rem",
    justifyContent: "center",
    flexWrap: "wrap",
  };

  const cancelButtonStyle = {
    padding: "0.75rem 1.5rem",
    backgroundColor: "transparent",
    color: "#6b7280",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  };

  const saveButtonStyle = {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#2744a0",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  };

  const deleteConfirmButtonStyle = {
    padding: "0.85rem 2rem",
    backgroundColor: "#2744a0",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
    minWidth: "140px",
  };

  const handleAddSkill = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const StatCard = ({ title, value, icon: Icon, bgColor, trend, trendUp, trendColor }) => (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
        border: "1px solid #f0f0f0",
        transition: "all 0.3s ease",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "16px",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.08)";
      }}
    >
      <div
        style={{
          background: bgColor,
          borderRadius: "12px",
          padding: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={28} color="#fff" strokeWidth={2} />
      </div>

      <div style={{ flex: 1 }}>
        <p
          style={{
            fontSize: "11px",
            color: "#6b7280",
            margin: "0 0 4px 0",
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {title}
        </p>
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
          <h3
            style={{
              fontSize: "28px",
              fontWeight: "700",
              color: "#111827",
              margin: "0",
              lineHeight: "1",
            }}
          >
            {value}
          </h3>
          {trend && (
            <span
              style={{
                fontSize: "11px",
                color: trendColor,
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "2px",
              }}
            >
              {trendUp ? "▲" : "▼"} {trend}
            </span>
          )}
        </div>
        <p
          style={{
            fontSize: "11px",
            color: "#9ca3af",
            margin: "4px 0 0 0",
          }}
        >
          {trend && `${trend} since last month`}
        </p>
      </div>
    </div>
  );

  return (
    <div
      className="dashboard-wrapper"
      style={{
        minHeight: "100vh",
        padding: "30px 15px",
      }}
    >
      <div className="container">
        {/* Header with Action Buttons */}
        <div
          className="dashboard-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "#2744a0",
                margin: "0 0 6px 0",
              }}
            >
              Dashboard
            </h1>
            <p
              style={{
                color: "#6b7280",
                margin: 0,
                fontSize: "12px",
                fontWeight: "600",
              }}
            >
              Manage your workforce efficiently
            </p>
          </div>
          <div
            className="action-buttons"
            style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}
          >
            <button
              style={{
                background: "#2744a0",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                padding: "12px 24px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              onClick={() => navigate("/add-Bench")}
            >
              <Plus size={18} />
              Add Bench
            </button>
            <button
              onClick={() => navigate("/create-job")}
              style={{
                background: "#fff",
                color: "#2744a0",
                border: "2px solid #e5e7eb",
                borderRadius: "10px",
                padding: "12px 24px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#2744a0";
                e.currentTarget.style.background = "#f0f4ff";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.background = "#fff";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <Send size={18} />
              Post Requirement
            </button>
          </div>
        </div>

        {/* 4 Cards - Responsive Grid */}
        <div
          className="stats-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <StatCard
            title="Total Bench"
            value="156"
            icon={List}
            bgColor="#3b82f6"
            trend="5.2%"
            trendUp={true}
            trendColor="#10b981"
          />
          <StatCard
            title="Bench on Project"
            value="28"
            icon={CheckCircle}
            bgColor="#10b981"
            trend="12.5%"
            trendUp={false}
            trendColor="#ef4444"
          />
          <StatCard
            title="Total Projects"
            value="17"
            icon={Clock}
            bgColor="#f59e0b"
            trend="8.3%"
            trendUp={true}
            trendColor="#10b981"
          />
          <StatCard
            title="Projects in Progress"
            value="89"
            icon={CreditCard}
            bgColor="#ef4444"
            trend="7.4%"
            trendUp={true}
            trendColor="#10b981"
          />
        </div>

        <div className="row">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <BenchUtilizationChart />
            <DailyUpdatesNotifications />
          </div>
        </div>

         {/* Top Matching Jobs */}
        <div>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#2744a0",
              margin: "0 0 16px 0",
            }}
          >
            Top Matching Jobs
          </h2>

          {/*  Use the EmployeeTable Component */}
            <TopMatchingJobs />

        </div>

        {/* Recently Added Employees Table */}
        <div className="mt-4">
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#2744a0",
              margin: "0 0 16px 0",
            }}
          >
            Recently Added Employees
          </h2>

          {/*  Use the EmployeeTable Component */}
          <EmployeeTable
            currentEmployees={currentEmployees}
            getStatusBadge={getStatusBadge}
            onDelete={(emp) => {
              setEmployeeToDelete(emp);
              setShowDeleteModal(true);
            }}
            onEdit={handleEdit}
            tdStyle={tdStyle}
            statusCellStyle={statusCellStyle}
            actionsCellStyle={actionsCellStyle}
            actionButtonsWrapperStyle={actionButtonsWrapperStyle}
            actionBtnStyle={actionBtnStyle}
            deleteBtnHoverStyle={deleteBtnHoverStyle}
          />
        </div> 
      </div>
    </div>
  );
};

export default Dashboard;
