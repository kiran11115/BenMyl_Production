import React, { useState, useRef, useEffect, useMemo, useCallback, useReducer } from 'react';
import { FiSend, FiX, FiPaperclip, FiSearch, FiClock, FiSave, FiEdit, FiHome } from 'react-icons/fi';
import "./AIScreen.css"

const FULL_IT_ROLES_SKILLS = {
  "Software Developer": ["Programming (Java,C#,Python)", "Data Structures & Algorithms", "Object-Oriented Design", "Git Version Control", "Unit Testing", "REST APIs", "Relational Databases (SQL)"],
  "Frontend Developer": ["HTML", "CSS", "JavaScript", "React/Angular/Vue", "Responsive Design", "Browser DevTools", "REST APIs"],
  "Backend Developer": ["Java/.NET/Node.js/Python", "RESTful API Design", "SQL/NoSQL Databases", "Authentication & Authorization", "Microservices", "Docker", "Unit/Integration Testing"],
  "Full Stack Developer": ["React/Angular/Vue", "Node.js/Java/.NET", "HTML/CSS/JavaScript", "SQL/NoSQL Databases", "REST APIs", "Git & CI/CD", "Cloud Basics (AWS/Azure/GCP)"],
  "Data Scientist": ["Python/R", "Pandas/NumPy", "Statistics & Probability", "Machine Learning", "SQL", "Data Visualization (Tableau/Power BI)", "Jupyter Notebook"],
  "Data Analyst": ["SQL", "Excel/Spreadsheets", "Data Cleaning", "Dashboards (Tableau/Power BI)", "Basic Statistics", "Reporting", "Stakeholder Communication"],
  "DevOps Engineer": ["Linux", "Shell Scripting", "CI/CD (Jenkins/GitHub Actions)", "Docker", "Kubernetes", "Terraform (IaC)", "Cloud (AWS/Azure/GCP)"],
  "Cloud Engineer": ["AWS/Azure/GCP", "Virtual Networks", "Storage & Databases in Cloud", "IAM & Security", "Monitoring & Logging", "Scripting (Python/Bash)", "Containers"],
  "Cybersecurity Engineer": ["Network Security", "Firewalls/IDS/IPS", "Vulnerability Assessment", "Penetration Testing", "SIEM Tools", "Secure Coding", "Incident Response"],
  "IT Support Engineer": ["Hardware Troubleshooting", "Windows/macOS/Linux Basics", "Ticketing Tools", "Active Directory", "Basic Networking", "Customer Communication", "Documentation"],
  "Systems Administrator": ["Windows/Linux Servers", "User Access Management", "Backups & Recovery", "Networking Basics", "Virtualization", "Monitoring Tools", "Shell/PowerShell Scripting"],
  "Network Engineer": ["Routing & Switching", "TCP/IP", "Firewalls", "VPN", "Network Monitoring", "Cisco/Juniper Devices", "Network Security"],
  "Product Manager": ["Product Strategy", "Roadmapping", "User Research", "Requirements Gathering", "Agile/Scrum", "Stakeholder Management", "Data-Driven Decision Making"],
  "Business Analyst": ["Requirements Analysis", "Process Modelling", "SQL Data Querying", "Documentation (BRD/FRD)", "Stakeholder Workshops", "UML/BPMN", "Reporting & Dashboards"],
  "QA Engineer": ["Test Case Design", "Manual Testing", "Test Automation (Selenium/Cypress)", "API Testing (Postman)", "Regression Testing", "Defect Tracking Tools", "Basic SQL"]
};

const ALL_IT_ROLES = Object.keys(FULL_IT_ROLES_SKILLS);

const SUGGESTED_PROMPTS = [
  {
    id: "frontend-react",
    name: "Frontend React",
    role: "Frontend Developer",
    data: {
      role: "Frontend Developer",
      skills: ["HTML", "CSS", "JavaScript", "React/Angular/Vue"],
      qualifications: "Any graduate with strong frontend skills",
      experience: "2-4 years",
      location: "Bangalore",
      salary: "8 LPA",
      workType: "Hybrid"
    }
  },
  {
    id: "fullstack-node",
    name: "Full Stack Node",
    role: "Full Stack Developer",
    data: {
      role: "Full Stack Developer",
      skills: ["React/Angular/Vue", "Node.js/Java/.NET", "SQL/NoSQL Databases"],
      qualifications: "Graduate in Computer Science",
      experience: "3-5 years",
      location: "Hyderabad",
      salary: "12 LPA",
      workType: "Remote"
    }
  },
  {
    id: "devops-aws",
    name: "DevOps AWS",
    role: "DevOps Engineer",
    data: {
      role: "DevOps Engineer",
      skills: ["Linux", "CI/CD (Jenkins/GitHub Actions)", "Docker", "Kubernetes", "Cloud (AWS/Azure/GCP)"],
      qualifications: "B.Tech/MCA or equivalent",
      experience: "3-5 years",
      location: "Remote",
      salary: "15 LPA",
      workType: "Remote"
    }
  },
  {
    id: "data-scientist",
    name: "Data Scientist",
    role: "Data Scientist",
    data: {
      role: "Data Scientist",
      skills: ["Python/R", "Machine Learning", "Statistics & Probability", "SQL"],
      qualifications: "B.Tech/M.Tech in CS or related field",
      experience: "2-4 years",
      location: "Bangalore",
      salary: "10 LPA",
      workType: "Hybrid"
    }
  }
];

const COLORS = {
  primary: "#2744a0",
  primaryHover: "#1e3285",
  secondary: "#ffffff",
  background: "#fafafa",
  surface: "#ffffff",
  border: "#e5e7eb",
  borderLight: "#f3f4f6",
  text: "#111827",
  textSecondary: "#6b7280",
  textLight: "#9ca3af",
  danger: "#ef4444",
  shadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  shadowLg: "0 10px 25px rgba(15, 23, 42, 0.15)"
};

const formReducer = (state, action) => {
  switch (action.type) {
    case 'SETROLE':
      return { ...state, role: action.payload, skills: [] };
    case 'TOGGLESKILL':
      const exists = state.skills.includes(action.payload);
      return {
        ...state,
        skills: exists
          ? state.skills.filter(s => s !== action.payload)
          : [...state.skills, action.payload]
      };
    case 'REMOVESKILL':
      return {
        ...state,
        skills: state.skills.filter(s => s !== action.payload)
      };
    case 'SETFIELD':
      return { ...state, [action.field]: action.payload };
    case 'RESET':
      return action.payload;
    default:
      return state;
  }
};

const Button = React.memo(({ onClick, disabled, children, variant = "primary", style = {}, type = "button" }) => {
  const baseStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    padding: "10px 20px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "600",
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.15s ease",
    opacity: disabled ? 0.5 : 1
  };

  const variantStyle = variant === "primary" ? {
    background: "#6843C7",
    color: COLORS.secondary
  } : {
    background: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    color: COLORS.textSecondary
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn ${variant}`}
      style={{ ...baseStyle, ...variantStyle, ...style }}
    >
      {children}
    </button>
  );
});
Button.displayName = 'Button';

const Modal = React.memo(({ title, children, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="presentation">
      <div className="modal-content" role="dialog" aria-modal="true">
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button onClick={onClose} aria-label="Close dialog" className="modal-close">
            <FiX size={24} />
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
});
Modal.displayName = 'Modal';

const TalentForm = React.memo(({
  talentForm,
  talentRoleInputDisplay,
  setTalentRoleInputDisplay,
  dispatch,
  filteredRoleSuggestions,
  roleSuggestionsOpen,
  setRoleSuggestionsOpen,
  skillsDropdownOpen,
  setSkillsDropdownOpen,
  computedSkillOptions,
  talentPrompt,
  isEditingTalentPrompt,
  setIsEditingTalentPrompt,
  setTalentPrompt,
  setTalentPromptDirty,
  skillsDropdownRef,
  onSavePrompt,
  onSubmit
}) => {
  const handleRoleChange = (e) => {
    const value = e.target.value;
    setTalentRoleInputDisplay(value);
    setRoleSuggestionsOpen(value.trim().length > 0);
    setTalentPromptDirty(false);
  };

  const handleRoleBlur = () => {
    const trimmedInput = talentRoleInputDisplay.trim();
    const isValidRole = ALL_IT_ROLES.some(r => r.toLowerCase().includes(trimmedInput.toLowerCase()));

    if (!isValidRole && trimmedInput.length > 0) {
      setTalentRoleInputDisplay(talentForm.role);
    } else if (isValidRole) {
      dispatch({ type: 'SETROLE', payload: talentRoleInputDisplay });
      setRoleSuggestionsOpen(false);
    }
  };

  const handleRoleSelect = (role) => (e) => {
    e.preventDefault();
    setTalentRoleInputDisplay(role);
    dispatch({ type: 'SETROLE', payload: role });
    setRoleSuggestionsOpen(false);
    setTalentPromptDirty(false);
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="section-title">Search Filters</div>
      <div className="search-form">
        <div className="form-field">
          <span className="form-label">Role</span>
          <div style={{ position: 'relative' }}>
            <input
              autoFocus
              type="text"
              className="form-input"
              placeholder="E.g., Frontend Developer"
              value={talentRoleInputDisplay}
              onChange={handleRoleChange}
              onBlur={handleRoleBlur}
            />
            {roleSuggestionsOpen && filteredRoleSuggestions.length > 0 && (
              <div className="role-suggestions">
                {filteredRoleSuggestions.map(role => (
                  <div
                    key={role}
                    className="role-suggestion-item"
                    onMouseDown={handleRoleSelect(role)}
                  >
                    {role}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="form-field" ref={skillsDropdownRef}>
          <span className="form-label">Skills</span>
          <div className="form-multiselect-wrapper">
            <div
              className="form-multiselect-trigger"
              onClick={() => setSkillsDropdownOpen(prev => !prev)}
            >
              <span>
                {talentForm.skills.length === 0
                  ? "Select skills"
                  : `${talentForm.skills.length} selected`
                }
              </span>
              <span className="form-multiselect-arrow">
                {skillsDropdownOpen ? '▲' : '▼'}
              </span>
            </div>
            {skillsDropdownOpen && (
              <div className="form-multiselect-dropdown">
                {computedSkillOptions.length === 0 ? (
                  <div style={{ padding: '6px 10px', fontSize: 12, color: '#6b7280' }}>
                    Select a valid role to see skills
                  </div>
                ) : (
                  computedSkillOptions.map(skill => {
                    const checked = talentForm.skills.includes(skill);
                    return (
                      <div
                        key={skill}
                        className="form-multiselect-option"
                        onClick={() => {
                          dispatch({ type: 'TOGGLESKILL', payload: skill });
                          setTalentPromptDirty(false);
                        }}
                      >
                        <span className={`form-multiselect-checkbox ${checked ? 'checked' : ''}`}>
                          {checked ? '✓' : ''}
                        </span>
                        <span>{skill}</span>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
          {talentForm.skills.length > 0 && (
            <div className="skills-selected">
              {talentForm.skills.map(skill => (
                <span key={skill} className="multi-pill">
                  {skill}
                  <button
                    type="button"
                    className="multi-pill-remove"
                    onClick={() => {
                      dispatch({ type: 'REMOVESKILL', payload: skill });
                      setTalentPromptDirty(false);
                    }}
                  >
                    <FiX />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="form-field">
          <span className="form-label">Qualification</span>
          <input
            type="text"
            className="form-input"
            placeholder="E.g., B.Tech, MCA"
            value={talentForm.qualifications}
            onChange={e => {
              dispatch({ type: 'SETFIELD', field: 'qualifications', payload: e.target.value });
              setTalentPromptDirty(false);
            }}
          />
        </div>

        <div className="form-field" style={{ position: 'relative' }}>
          <span className="form-label">Experience</span>
          <div style={{ position: 'relative' }}>
            <select
              className="form-select"
              value={talentForm.experience}
              onChange={e => {
                dispatch({ type: 'SETFIELD', field: 'experience', payload: e.target.value });
                setTalentPromptDirty(false);
              }}
              style={{ appearance: 'none', WebkitAppearance: 'none' }}
            >
              <option value="">Select experience</option>
              <option value="0-2 years">0-2 years</option>
              <option value="2-4 years">2-4 years</option>
              <option value="3-5 years">3-5 years</option>
              <option value="5+ years">5+ years</option>
              <option value="10+ years">10+ years</option>
            </select>
            <span style={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '12px',
              color: '#9ca3af',
              pointerEvents: 'none'
            }}>
              ▼
            </span>
          </div>
        </div>

        <div className="form-field" style={{ position: 'relative' }}>
          <span className="form-label">Salary Range</span>
          <div style={{ position: 'relative' }}>
            <select
              className="form-select"
              value={talentForm.salary}
              onChange={e => {
                dispatch({ type: 'SETFIELD', field: 'salary', payload: e.target.value });
                setTalentPromptDirty(false);
              }}
              style={{ appearance: 'none', WebkitAppearance: 'none' }}
            >
              <option value="">Select range</option>
              <option value="6 LPA">6 LPA</option>
              <option value="8 LPA">8 LPA</option>
              <option value="10 LPA">10 LPA</option>
              <option value="12 LPA">12 LPA</option>
              <option value="15 LPA">15 LPA</option>
              <option value="80k">$80k</option>
              <option value="100k">$100k</option>
            </select>
            <span style={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '12px',
              color: '#9ca3af',
              pointerEvents: 'none'
            }}>
              ▼
            </span>
          </div>
        </div>

        <div className="form-field" style={{ position: 'relative' }}>
          <span className="form-label">Work Type</span>
          <div style={{ position: 'relative' }}>
            <select
              className="form-select"
              value={talentForm.workType}
              onChange={e => {
                dispatch({ type: 'SETFIELD', field: 'workType', payload: e.target.value });
                setTalentPromptDirty(false);
              }}
              style={{ appearance: 'none', WebkitAppearance: 'none' }}
            >
              <option value="">Select work type</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Onsite">Onsite</option>
            </select>
            <span style={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '12px',
              color: '#9ca3af',
              pointerEvents: 'none'
            }}>
              ▼
            </span>
          </div>
        </div>

        <div className="form-field">
          <span className="form-label">Location</span>
          <input
            type="text"
            className="form-input"
            placeholder="E.g., Bangalore, Hyderabad"
            value={talentForm.location}
            onChange={e => {
              dispatch({ type: 'SETFIELD', field: 'location', payload: e.target.value });
              setTalentPromptDirty(false);
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h4 className="section-title">Generated Prompt</h4>
        <button
          type="button"
          onClick={() => setIsEditingTalentPrompt(prev => !prev)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: 'transparent',
            border: `1px solid ${COLORS.border}`,
            borderRadius: '6px',
            padding: '4px 8px',
            cursor: 'pointer',
            color: COLORS.textSecondary,
            fontSize: '12px',
            transition: 'all 0.2s ease'
          }}
        >
          <FiEdit size={12} />
          {isEditingTalentPrompt ? 'Done' : 'Edit'}
        </button>
      </div>

      {isEditingTalentPrompt ? (
        <textarea
          value={talentPrompt}
          onChange={e => {
            setTalentPrompt(e.target.value);
            setTalentPromptDirty(true);
          }}
          className="prompt-textarea"
          style={{ marginBottom: '20px', height: '200px' }}
        />
      ) : (
        <div style={{
          padding: '16px',
          backgroundColor: COLORS.borderLight,
          borderRadius: '12px',
          border: `1px solid ${COLORS.border}`,
          minHeight: '200px',
          fontSize: '14px',
          color: COLORS.text,
          lineHeight: '1.6',
          marginBottom: '20px',
          wordBreak: 'break-word'
        }}>
          {talentPrompt || "Prompt will be generated based on your selections..."}
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px' }}>
        <Button
          onClick={() => onSavePrompt('talent')}
          disabled={!talentPrompt?.trim()}
          variant="secondary"
          style={{ flex: 1 }}
          type="button"
        >
          <FiSave size={14} />
          <span>Save Prompt</span>
        </Button>
        <Button
          type="submit"
          disabled={!talentPrompt?.trim()}
          style={{ flex: 1 }}
        >
          <FiSearch size={16} />
          <span>Search Talents</span>
        </Button>
      </div>
    </form>
  );
});
TalentForm.displayName = 'TalentForm';

const SuggestedBenchCard = React.memo(({ bench }) => (
  <div
    className="bench-card"
    onMouseEnter={e => {
      e.currentTarget.style.boxShadow = COLORS.shadowLg;
      e.currentTarget.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.boxShadow = COLORS.shadow;
      e.currentTarget.style.transform = 'translateY(0)';
    }}
  >
    <div className="bench-name">{bench.name}</div>
    <div className="bench-role">{bench.role} • {bench.experience}</div>
    <div className="bench-skills">{bench.skills.join(', ')}</div>
    <div className="bench-location">{bench.location}</div>
  </div>
));
SuggestedBenchCard.displayName = 'SuggestedBenchCard';

function AIScreen() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenCount, setTokenCount] = useState(45);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isTalentModalOpen, setIsTalentModalOpen] = useState(false);
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
  const [showSavedPrompts, setShowSavedPrompts] = useState(false);
  const [recentSearches, setRecentSearches] = useState([
    { text: 'Find React Developers', type: 'job' },
    { text: 'E-commerce Platform Project', type: 'project' },
    { text: 'UI/UX Design Position', type: 'job' }
  ]);
  const [filteredSearches, setFilteredSearches] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const initialTalentForm = {
    role: '',
    skills: [],
    qualifications: '',
    experience: '',
    location: '',
    salary: '',
    workType: ''
  };

  const initialProjectForm = {
    projectType: '',
    skills: [],
    duration: '',
    budget: '',
    workType: '',
    location: ''
  };

  const [talentForm, talentDispatch] = useReducer(formReducer, initialTalentForm);
  const [projectsForm, projectsDispatch] = useReducer(formReducer, initialProjectForm);
  const [talentPrompt, setTalentPrompt] = useState('');
  const [projectsPrompt, setProjectsPrompt] = useState('');
  const [isEditingTalentPrompt, setIsEditingTalentPrompt] = useState(false);
  const [isEditingProjectsPrompt, setIsEditingProjectsPrompt] = useState(false);
  const [talentPromptDirty, setTalentPromptDirty] = useState(false);
  const [projectsPromptDirty, setProjectsPromptDirty] = useState(false);
  const [talentRoleInputDisplay, setTalentRoleInputDisplay] = useState('');
  const [savedPrompts, setSavedPrompts] = useState([
    {
      id: 1,
      type: 'talent',
      name: 'Senior Frontend Dev',
      prompt: 'Find Frontend Developer with skills in React/Angular/Vue, 5+ years experience, Remote work type, salary expectation 15 LPA.',
      createdAt: new Date(Date.now() - 86400000)
    }
  ]);
  const [editPromptModalOpen, setEditPromptModalOpen] = useState(false);
  const [editingSavedPromptId, setEditingSavedPromptId] = useState(null);
  const [editingSavedPromptName, setEditingSavedPromptName] = useState('');
  const [editingSavedPromptText, setEditingSavedPromptText] = useState('');
  const [skillsDropdownOpen, setSkillsDropdownOpen] = useState(false);
  const [roleSuggestionsOpen, setRoleSuggestionsOpen] = useState(false);

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const searchContainerRef = useRef(null);
  const skillsDropdownRef = useRef(null);

  const computedSkillOptions = useMemo(() => {
    const roleText = talentForm.role.trim().toLowerCase();
    if (!roleText) return [];

    const exactKey = Object.keys(FULL_IT_ROLES_SKILLS).find(r =>
      r.toLowerCase() === roleText
    );
    return exactKey ? FULL_IT_ROLES_SKILLS[exactKey] : [];
  }, [talentForm.role]);

  const filteredRoleSuggestions = useMemo(() => {
    const text = talentRoleInputDisplay.trim().toLowerCase();
    if (!text) return ALL_IT_ROLES;
    return ALL_IT_ROLES.filter(r => r.toLowerCase().includes(text));
  }, [talentRoleInputDisplay]);

  const suggestedBench = useMemo(() => [
    {
      name: 'Alice Johnson',
      role: 'UI/UX Designer',
      experience: '5 years',
      skills: ['Figma', 'Sketch', 'Adobe XD'],
      location: 'Bangalore'
    },
    {
      name: 'Rahul Mehta',
      role: 'Frontend Developer',
      experience: '4 years',
      skills: ['React', 'TypeScript', 'Tailwind CSS'],
      location: 'Hyderabad'
    },
    {
      name: 'Priya Sharma',
      role: 'Backend Developer',
      experience: '6 years',
      skills: ['Node.js', 'MongoDB', 'AWS'],
      location: 'Bangalore'
    },
    {
      name: 'Aditya Patel',
      role: 'DevOps Engineer',
      experience: '3 years',
      skills: ['Docker', 'Kubernetes', 'CI/CD'],
      location: 'Remote'
    }
  ], []);

  const generateTalentPrompt = useCallback((form) => {
    if (!form.role) return '';
    let prompt = `Find ${form.role}`;
    if (form.skills?.length) prompt += ` with skills in ${form.skills.join(', ')}`;
    if (form.qualifications) prompt += ` with qualifications in ${form.qualifications}`;
    if (form.experience) prompt += `, ${form.experience} experience`;
    if (form.workType) prompt += `, ${form.workType} work type`;
    if (form.location) prompt += `, based in ${form.location}`;
    if (form.salary) prompt += `, salary expectation ${form.salary}`;
    return prompt + '.';
  }, []);

  const handleSubmit = useCallback((searchText = null) => {
    const textToSubmit = searchText || inputValue;
    if (!textToSubmit.trim() && attachedFiles.length === 0 && tokenCount === 0) return;

    if (textToSubmit.trim()) {
      const lower = textToSubmit.toLowerCase();
      const isJobSearch = /developer|engineer|talent|position|hiring/.test(lower);
      const newSearch = {
        text: textToSubmit.trim(),
        type: isJobSearch ? 'job' : 'project'
      };
      setRecentSearches(prev => {
        const exists = prev.some(s => s.text === newSearch.text);
        return exists ? prev : [newSearch, ...prev.slice(0, 9)];
      });
    }

    const userMessage = {
      id: `msg-${messages.length + 1}`,
      type: 'user',
      content: textToSubmit,
      files: attachedFiles,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setAttachedFiles([]);
    setShowDropdown(false);
    setTokenCount(prev => Math.max(0, prev - 1));
    setIsLoading(true);

    setTimeout(() => {
      const aiMessage = {
        id: `msg-${messages.length + 2}`,
        type: 'ai',
        content: 'Here are some suggested Bench based on your query.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1200);
  }, [inputValue, attachedFiles, tokenCount, messages.length]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);

  const handleFileAttach = useCallback(e => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).map(file => ({
        id: Math.random(),
        name: file.name,
        size: (file.size / 1024).toFixed(2)
      }));
      setAttachedFiles(prev => [...prev, ...newFiles]);
    }
  }, []);

  const removeFile = useCallback((fileId) => {
    setAttachedFiles(prev => prev.filter(file => file.id !== fileId));
  }, []);

  const handleSavePrompt = useCallback(type => {
    const promptText = type === 'talent' ? talentPrompt : projectsPrompt;
    if (!promptText?.trim()) return;

    const promptName = window.prompt('Enter a name for this prompt');
    if (!promptName) return;

    setSavedPrompts(prev => [{
      id: Date.now(),
      type,
      name: promptName,
      prompt: promptText,
      createdAt: new Date()
    }, ...prev]);
    if (type === 'talent') setTalentPrompt('');
    if (type === 'projects') setProjectsPrompt('');
  }, [talentPrompt, projectsPrompt]);

  const handleLoadSavedPrompt = useCallback(savedPrompt => {
    handleSubmit(savedPrompt.prompt);
    setShowSavedPrompts(false);
  }, [handleSubmit]);

  const handleDeleteSavedPrompt = useCallback(id => {
    setSavedPrompts(prev => prev.filter(p => p.id !== id));
  }, []);

  const goHome = useCallback(() => {
    setMessages([]);
    setShowSavedPrompts(false);
  }, []);

  // Auto-generate talent prompt
  useEffect(() => {
    if (!talentPromptDirty) {
      setTalentPrompt(generateTalentPrompt(talentForm));
    }
  }, [talentForm, talentPromptDirty, generateTalentPrompt]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Search filtering
  useEffect(() => {
    let timeoutId;
    if (inputValue.trim()) {
      setSearchLoading(true);
      timeoutId = setTimeout(() => {
        const filtered = recentSearches.filter(search =>
          search.text.toLowerCase().includes(inputValue.toLowerCase())
        );
        setFilteredSearches(filtered);
        setSearchLoading(false);
      }, 200);
    } else {
      setSearchLoading(false);
      setFilteredSearches(recentSearches);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [inputValue, recentSearches]);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (skillsDropdownRef.current && !skillsDropdownRef.current.contains(event.target)) {
        setSkillsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Escape key handler
  useEffect(() => {
    const onKeyDown = e => {
      if (e.key === 'Escape') {
        setIsTalentModalOpen(false);
        setIsProjectsModalOpen(false);
        setEditPromptModalOpen(false);
        setShowDropdown(false);
        setRoleSuggestionsOpen(false);
        setSkillsDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleTalentSubmit = useCallback((e) => {
    e.preventDefault();
    if (!talentPrompt.trim()) return;
    handleSubmit(talentPrompt);
    setIsTalentModalOpen(false);
  }, [talentPrompt, handleSubmit]);

  const deleteRecentSearch = useCallback(searchToDelete => {
    setRecentSearches(prev => prev.filter(search => search.text !== searchToDelete.text));
  }, []);

  const clearAllRecentSearches = useCallback(() => {
    setRecentSearches([]);
    setShowDropdown(false);
  }, []);

  const handleSearchSelect = useCallback(searchItem => {
    handleSubmit(searchItem.text);
  }, [handleSubmit]);

  const handleSuggestedPromptClick = useCallback(prompt => {
    talentDispatch({ type: 'RESET', payload: prompt.data });
    setTalentRoleInputDisplay(prompt.data.role);
    setRoleSuggestionsOpen(false);
    setTalentPromptDirty(false);
    setIsTalentModalOpen(true);
  }, []);

  // Edit prompt modal handlers
  const openEditPromptModal = useCallback(p => {
    setEditingSavedPromptId(p.id);
    setEditingSavedPromptName(p.name);
    setEditingSavedPromptText(p.prompt);
    setEditPromptModalOpen(true);
  }, []);

  const closeEditPromptModal = useCallback(() => {
    setEditPromptModalOpen(false);
    setEditingSavedPromptId(null);
    setEditingSavedPromptName('');
    setEditingSavedPromptText('');
  }, []);

  const saveEditedSavedPrompt = useCallback(() => {
    if (!editingSavedPromptId) return;
    setSavedPrompts(prev =>
      prev.map(p =>
        p.id === editingSavedPromptId
          ? { ...p, name: editingSavedPromptName, prompt: editingSavedPromptText }
          : p
      )
    );
    closeEditPromptModal();
  }, [editingSavedPromptId, editingSavedPromptName, editingSavedPromptText, closeEditPromptModal]);

  const renderSearchBar = useCallback(() => (
    <div ref={searchContainerRef} className="search-container">
      <div className="search-input-wrapper">
        <textarea
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowDropdown(true)}
          placeholder="Ask anything..."
          className="search-textarea"
          rows={1}
        />
        <button
          type="button"
          onClick={() => setShowDropdown(prev => !prev)}
          className="search-dropdown-toggle"
        >
          <FiClock size={14} />
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="search-attach-btn"
        >
          <FiPaperclip size={18} />
        </button>
        <button
          onClick={() => handleSubmit()}
          disabled={!inputValue.trim() && attachedFiles.length === 0 && isLoading && tokenCount === 0}
          className="search-send-btn"
        >
          <FiSend size={16} />
        </button>
      </div>

      {showDropdown && (
        <div className="search-dropdown">
          <div className="dropdown-header">
            <div className="dropdown-title">
              <FiClock size={14} />
              <span>Recent Searches</span>
            </div>
            {!searchLoading && filteredSearches.length > 0 && (
              <button
                onClick={clearAllRecentSearches}
                className="dropdown-clear-all"
              >
                Clear All
              </button>
            )}
          </div>

          {searchLoading ? (
            <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: COLORS.textSecondary }}>
              <div className="loading-dots">
                <div className="dot-pulse"></div>
                <div className="dot-pulse"></div>
                <div className="dot-pulse"></div>
              </div>
              <span>Loading options...</span>
            </div>
          ) : filteredSearches.length === 0 ? (
            <div style={{ padding: '12px 16px', fontSize: '13px', color: COLORS.textSecondary }}>
              No recent searches found
            </div>
          ) : (
            filteredSearches.map((search, index) => (
              <div
                key={`${search.text}-${index}`}
                onClick={() => handleSearchSelect(search)}
                className="search-item"
              >
                <div className="search-item-content">
                  <FiSearch size={16} style={{ color: COLORS.textSecondary, flexShrink: 0 }} />
                  <span className="search-item-text">{search.text}</span>
                </div>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    deleteRecentSearch(search);
                  }}
                  className="search-item-delete"
                >
                  <FiX size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  ), [
    inputValue,
    attachedFiles,
    tokenCount,
    isLoading,
    showDropdown,
    filteredSearches,
    searchLoading,
    handleKeyDown,
    handleSubmit,
    handleSearchSelect,
    deleteRecentSearch,
    clearAllRecentSearches
  ]);

  return (
    <div className="app-container">
      <div className="main-content">
        <div className="header">
          <h1 className="header-title">AI</h1>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              onClick={() => setShowSavedPrompts(prev => !prev)}
              variant="secondary"
              type="button"
            >
              Saved Prompts ({savedPrompts.length})
            </Button>
            <Button
              onClick={() => {
                setTalentPromptDirty(false);
                setTalentRoleInputDisplay(talentForm.role);
                setRoleSuggestionsOpen(false);
                setIsTalentModalOpen(true);
              }}
              type="button"
            >
              Find Talent
            </Button>
            <Button
              onClick={() => {
                setProjectsPromptDirty(false);
                setIsProjectsModalOpen(true);
              }}
              variant="secondary"
              type="button"
            >
              Find Projects
            </Button>
          </div>
        </div>

        <div className="content-area">
          {showSavedPrompts ? (
            <>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', color: COLORS.text }}>
                Saved Prompts
              </h3>
              {savedPrompts.length === 0 ? (
                <p style={{ color: COLORS.textSecondary }}>No saved prompts yet.</p>
              ) : (
                <div className="saved-prompts-grid">
                  {savedPrompts.map(savedPrompt => (
                    <div key={savedPrompt.id} className="saved-prompt-card">
                      <h4 className="saved-prompt-name">{savedPrompt.name}</h4>
                      <p className="saved-prompt-text">{savedPrompt.prompt}</p>
                      <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                        <Button
                          onClick={() => handleLoadSavedPrompt(savedPrompt)}
                          style={{ flex: 1, padding: '6px 10px', fontSize: '11px' }}
                          type="button"
                        >
                          Use
                        </Button>
                        <Button
                          onClick={() => openEditPromptModal(savedPrompt)}
                          variant="secondary"
                          style={{ padding: '6px 10px', fontSize: '11px' }}
                          type="button"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteSavedPrompt(savedPrompt.id)}
                          variant="secondary"
                          style={{ padding: '6px 10px', fontSize: '11px' }}
                          type="button"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : messages.length === 0 ? (
            <>
              <h3 className="empty-state">Looking for suggestions...</h3>
              <p className="empty-state-subtitle">
                Start by asking for talent or projects, or use a quick template to generate a search prompt.
              </p>
              <div className="suggested-prompt-grid">
                {SUGGESTED_PROMPTS.map(prompt => (
                  <button
                    key={prompt.id}
                    onClick={() => handleSuggestedPromptClick(prompt)}
                    className="prompt-card"
                  >
                    <div style={{ fontWeight: '700', fontSize: '14px', color: COLORS.primary, marginBottom: '2px' }}>
                      {prompt.name}
                    </div>
                    <div style={{ fontSize: '10px', color: COLORS.textSecondary, fontWeight: '600' }}>
                      {prompt.role}
                    </div>
                    <div style={{ fontSize: '11px', color: COLORS.textSecondary, marginTop: '6px' }}>
                      {prompt.data.salary} • {prompt.data.experience}
                    </div>
                  </button>
                ))}
                <button
                  onClick={() => alert('More templates coming soon!')}
                  className="view-more-template"
                >
                  <span style={{ fontSize: '18px' }}>⟋</span>
                  <span>View More Templates</span>
                </button>
              </div>
              {recentSearches.length > 0 && (
                <>
                  <div style={{ marginBottom: '20px' }}>
                    <h4 className="section-subtitle">Recent Searches</h4>
                    <div className="recent-searches-chips">
                      {recentSearches.slice(0, 6).map((search, index) => (
                        <button
                          key={index}
                          onClick={() => handleSearchSelect(search)}
                          className={`recent-search-chip ${search.type}`}
                        >
                          {search.text}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1, marginBottom: '20px' }}>
                {messages.map(message => (
                  <div key={message.id} className="message-bubble">
                    <div className={`message-avatar ${message.type}`}>
                      {message.type === 'user' ? 'U' : 'AI'}
                    </div>
                    <div className="message-content">
                      <div className="message-text">{message.content}</div>
                      {message.files && message.files.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                          {message.files.map(file => (
                            <div key={file.id} className="file-chip">
                              <FiPaperclip size={12} />
                              <span>{file.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {message.type === 'ai' && (
                        <div className="bench-grid">
                          {suggestedBench.map(bench => (
                            <SuggestedBenchCard key={bench.name} bench={bench} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div className="message-avatar ai">AI</div>
                    <div style={{ paddingTop: '8px', display: 'flex', gap: '6px' }}>
                      <div className="loading-dots">
                        <div className="dot-pulse"></div>
                        <div className="dot-pulse"></div>
                        <div className="dot-pulse"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  {attachedFiles.length > 0 && (
                    <div style={{ marginBottom: '10px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {attachedFiles.map(file => (
                        <div key={file.id} className="file-chip">
                          <FiPaperclip size={14} />
                          <span>{file.name}</span>
                          <button
                            onClick={() => removeFile(file.id)}
                            className="file-chip-remove"
                          >
                            <FiX />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {renderSearchBar()}
                </div>
                <Button
                  onClick={goHome}
                  variant="secondary"
                  style={{ padding: '10px 16px', borderRadius: '8px', height: '56px' }}
                  type="button"
                >
                  <FiHome size={18} />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileAttach}
        style={{ display: 'none' }}
        aria-label="File upload"
      />

      <Modal
        title="Find Talent"
        isOpen={isTalentModalOpen}
        onClose={() => setIsTalentModalOpen(false)}
      >
        <TalentForm
          talentForm={talentForm}
          talentRoleInputDisplay={talentRoleInputDisplay}
          setTalentRoleInputDisplay={setTalentRoleInputDisplay}
          dispatch={talentDispatch}
          filteredRoleSuggestions={filteredRoleSuggestions}
          roleSuggestionsOpen={roleSuggestionsOpen}
          setRoleSuggestionsOpen={setRoleSuggestionsOpen}
          skillsDropdownOpen={skillsDropdownOpen}
          setSkillsDropdownOpen={setSkillsDropdownOpen}
          computedSkillOptions={computedSkillOptions}
          talentPrompt={talentPrompt}
          isEditingTalentPrompt={isEditingTalentPrompt}
          setIsEditingTalentPrompt={setIsEditingTalentPrompt}
          setTalentPrompt={setTalentPrompt}
          setTalentPromptDirty={setTalentPromptDirty}
          skillsDropdownRef={skillsDropdownRef}
          onSavePrompt={handleSavePrompt}
          onSubmit={handleTalentSubmit}
        />
      </Modal>

      {/* Edit Prompt Modal */}
      <Modal
        title="Edit Saved Prompt"
        isOpen={editPromptModalOpen}
        onClose={closeEditPromptModal}
      >
        <div className="form-field">
          <span className="form-label">Name</span>
          <input
            type="text"
            className="form-input"
            value={editingSavedPromptName}
            onChange={e => setEditingSavedPromptName(e.target.value)}
            placeholder="Name"
          />
        </div>
        <div className="form-field">
          <span className="form-label">Prompt</span>
          <textarea
            className="prompt-textarea"
            style={{ minHeight: '160px' }}
            value={editingSavedPromptText}
            onChange={e => setEditingSavedPromptText(e.target.value)}
            placeholder="Edit your saved prompt..."
          />
        </div>
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <Button
            onClick={saveEditedSavedPrompt}
            disabled={!editingSavedPromptText.trim()}
            type="button"
          >
            Save
          </Button>
          <Button
            onClick={closeEditPromptModal}
            variant="secondary"
            type="button"
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default AIScreen;
