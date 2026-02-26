import React, { useState, useEffect, useRef } from 'react';
import './JobTitleAutocomplete.css';

const JOB_TITLES = [
    // IT & Software Development (Expanded)
    "Frontend Developer", "Backend Developer", "Full Stack Developer", "Fullstack Developer", "React Developer", "Node.js Developer",
    "Python Developer", "Java Developer", "Software Engineer", "Senior Software Engineer", "Junior Software Engineer", "DevOps Engineer",
    "Cloud Engineer", "Cloud Architect", "Site Reliability Engineer (SRE)", "Mobile Developer", "iOS Developer",
    "Android Developer", "Flutter Developer", "React Native Developer", "QA Engineer", "Automation Tester", "Manual Tester",
    "Embedded Systems Engineer", "Firmware Engineer", "PHP Developer", "Ruby on Rails Developer", "Go Developer",
    "Rust Developer", "C++ Developer", "C# Developer", ".NET Developer", "Systems Architect", "Security Engineer", "Pentester",
    "Database Administrator (DBA)", "ERP Consultant", "SAP Consultant", "Salesforce Developer", "Dynamics 365 Specialist",
    "Unity Developer", "Unreal Engine Developer", "Game Developer", "Desktop Applications Developer",

    // Data & AI (Expanded)
    "Data Scientist", "Data Engineer", "Data Analyst", "Machine Learning Engineer", "AI Researcher", "AI Engineer",
    "Business Intelligence (BI) Developer", "Big Data Architect", "Data Warehouse Architect", "Data Architect",
    "Statistics Analyst", "Deep Learning Engineer", "NLP Scientist",

    // Product & Design (Expanded)
    "UI Designer", "UX Designer", "Product Designer", "Product Manager", "Project Manager", "Creative Director",
    "Technical Program Manager", "Scrum Master", "Agile Coach", "User Researcher", "Interaction Designer",
    "Art Director", "Graphic Designer", "Visual Designer", "Motion Designer", "Identity Designer",

    // Specialized Technical & Engineering (Non-IT)
    "Electrical Engineer", "Mechanical Engineer", "Civil Engineer", "Structural Engineer",
    "Chemical Engineer", "Aerospace Engineer", "Biomedical Engineer", "Hardware Design Engineer",
    "VLSI Design Engineer", "Control Systems Engineer", "Robotics Engineer", "Industrial Engineer",
    "Network Engineer", "Systems Administrator", "IT Support Specialist", "Cybersecurity Analyst",
    "Nuclear Engineer", "Environmental Engineer", "Petroleum Engineer", "Materials Scientist",

    // Finance & Accounting
    "Accountant", "Tax Consultant", "Financial Analyst", "Investment Banker", "Internal Auditor",
    "Chartered Accountant (CA)", "Finance Manager", "Credit Analyst", "Risk Manager", "Actuary",
    "Portfolio Manager", "Wealth Manager", "Bookkeeper", "Treasury Analyst",

    // Marketing & Sales
    "Marketing Manager", "Digital Marketing Specialist", "Content Strategist", "SEO Specialist", "Social Media Manager",
    "Brand Manager", "Public Relations Specialist", "Sales Manager", "Account Manager", "Business Development Manager",
    "Sales Representative", "Inside Sales Specialist", "Growth Hacker", "Copywriter", "E-commerce Manager",

    // Healthcare & Medicine
    "Doctor", "Physician", "Nurse", "Surgeon", "Dentist", "Pharmacist", "Physiotherapist",
    "Radiologist", "Psychologist", "Psychiatrist", "Lab Technician", "Clinical Researcher",
    "Medical Assistant", "Occupational Therapist", "Healthcare Administrator",

    // Human Resources
    "HR Manager", "HR Generalist", "Recruiter", "Technical Recruiter", "Talent Acquisition Specialist",
    "HR Business Partner", "Compensation & Benefits Specialist", "L&D Coordinator", "Employee Experience Lead",

    // Legal
    "Lawyer", "Attorney", "Legal Counsel", "Paralegal", "Corporate Secretary", "Compliance Officer",
    "Contract Administrator", "Legal Assistant",

    // Education & Academic
    "Professor", "Teacher", "Lecturer", "Academic Researcher", "Education Coordinator", "Instructional Designer",
    "Principal", "School Administrator", "Tutor",

    // Operations, Logistics & Supply Chain
    "Operations Manager", "Supply Chain Manager", "Logistics Coordinator", "Warehouse Manager",
    "Procurement Specialist", "Purchasing Manager", "Maintenance Engineer", "Safety Officer",

    // Management & Executive Roles
    "CEO", "CTO", "CFO", "COO", "CMO", "CHRO", "VP of Engineering", "Engineering Manager",
    "Technical Lead", "Solution Architect", "IT Director", "Information Security Officer (CISO)",
    "General Manager", "Operations Director", "Managing Director",

    // Specialized Roles
    "Content Creator", "Video Editor", "Journalist", "Editor", "Translator", "Interpreter",
    "Customer Support Specialist", "Customer Success Manager", "Technical Writer", "Support Engineer"
];

const JobTitleAutocomplete = ({ value, onChange, onBlur, name, error }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        onChange(e);

        if (inputValue.length > 0) {
            const filtered = JOB_TITLES.filter(title =>
                title.toLowerCase().includes(inputValue.toLowerCase())
            );
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (title) => {
        const event = {
            target: {
                name: name,
                value: title
            }
        };
        onChange(event);
        setShowSuggestions(false);
    };

    return (
        <div className="autocomplete-wrapper" ref={wrapperRef}>
            <input
                type="text"
                name={name}
                className="auth-input"
                placeholder="e.g. Senior Frontend Developer"
                value={value}
                onChange={handleInputChange}
                onBlur={onBlur}
                autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
                <ul className="suggestions-list">
                    {suggestions.map((title, index) => (
                        <li key={index} onClick={() => handleSuggestionClick(title)}>
                            {title}
                        </li>
                    ))}
                </ul>
            )}
            {error}
        </div>
    );
};

export default JobTitleAutocomplete;
