import React, { useState, useMemo, useEffect, useRef } from 'react';
import { subscriptionPlans } from './subscriptionData';
import { CheckCircle, Zap, CreditCard, Clock, Users, Activity, Plus, Check, Shield, Sparkles, Award, Download, Layers, X, ChevronDown, ChevronUp, Bell, TrendingUp, FileText, DollarSign } from 'lucide-react';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useGetTeamMembersQuery } from '../../State-Management/Api/AdminDetailsApiSlice';
import './SubscriptionPage.css';
import '../UserJobs/Jobs.css';
import '../Admin/Modules/AdminDashboard/AdminDashboard.css';
import '../Header/ProfileSideModal.css';

const planThemes = {
  free_trial: {
    themeClass: "plan-theme-free",
    icon: Shield,
    iconColor: "#22c55e",
    accentColor: "#22c55e",
    badgeText: "One-Time Trial"
  },
  basic: {
    themeClass: "plan-theme-basic",
    icon: Zap,
    iconColor: "#f5810c",
    accentColor: "#f5810c",
    badgeText: "Starter"
  },
  professional: {
    themeClass: "plan-theme-pro",
    icon: Sparkles,
    iconColor: "#3b82f6",
    accentColor: "#3b82f6",
    badgeText: "Recommended"
  },
  enterprise: {
    themeClass: "plan-theme-enterprise",
    icon: Award,
    iconColor: "#a855f7",
    accentColor: "#a855f7",
    badgeText: "Enterprise"
  }
};

const SubscriptionPage = () => {
  const role = localStorage.getItem("Role");
  const isAdmin = role === "Admin";
  const emailID = localStorage.getItem("Email");
  const [activeTab, setActiveTab] = useState(isAdmin ? "users" : "plans");
  const billingTableRef = useRef(null);

  // State for user requests and loaders
  const [isAllocating, setIsAllocating] = useState(false);
  const [approvingId, setApprovingId] = useState(null);
  const [userRequests, setUserRequests] = useState([
    { id: "req-1", name: "Alice Smith", emailID: "alice@company.com", tokensRequested: 350, date: "Jun 11, 2026" },
    { id: "req-2", name: "Charlie Brown", emailID: "charlie@company.com", tokensRequested: 500, date: "Jun 12, 2026" }
  ]);

  // Stripe & pool state variables
  const [adminTotalPool, setAdminTotalPool] = useState(50000);
  const [isYearlyBilling, setIsYearlyBilling] = useState(false);
  const [isAddTokensOpen, setIsAddTokensOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState({ tokens: 10000, price: 90, color: "#f5810c", bgLight: "rgba(245, 129, 12, 0.08)" });
  const [stripeCardNumber, setStripeCardNumber] = useState("");
  const [stripeExpiry, setStripeExpiry] = useState("");
  const [stripeCvc, setStripeCvc] = useState("");
  const [stripeName, setStripeName] = useState("");
  const [stripeZip, setStripeZip] = useState("");
  const [isPaying, setIsPaying] = useState(false);

  // Accordion, payment method, dynamic confirm overlay and usage search states
  const [isAllocateExpanded, setIsAllocateExpanded] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("visa_4242");
  const [confirmModalConfig, setConfirmModalConfig] = useState(null);
  const [requestTokenAmount, setRequestTokenAmount] = useState("");
  const [isRequestingTokens, setIsRequestingTokens] = useState(false);

  const tokenPackages = [
    { tokens: 5000, price: 50, color: "#22c55e", bgLight: "rgba(34, 197, 94, 0.08)" },
    { tokens: 10000, price: 90, recommended: true, color: "#f5810c", bgLight: "rgba(245, 129, 12, 0.08)" },
    { tokens: 25000, price: 200, color: "#3b82f6", bgLight: "rgba(59, 130, 246, 0.08)" },
    { tokens: 50000, price: 350, color: "#a855f7", bgLight: "rgba(168, 85, 247, 0.08)" }
  ];

  // State for user view request token
  const handleRequestTokens = () => {
    if (!requestTokenAmount) {
      toast.error("Please enter the number of tokens required.");
      return;
    }
    setIsRequestingTokens(true);
    setTimeout(() => {
      toast.success(`Token request for ${requestTokenAmount} tokens sent successfully!`);
      setRequestTokenAmount("");
      setIsRequestingTokens(false);
    }, 1200);
  };

  // ── Team query & token allocation state ──
  const { data: teamApiData = [], isLoading: isTeamLoading } = useGetTeamMembersQuery(emailID, { skip: !emailID || !isAdmin });
  const [teamUsers, setTeamUsers] = useState([]);
  const [allocateUserEmail, setAllocateUserEmail] = useState("");
  const [allocateTokensAmount, setAllocateTokensAmount] = useState("");

  const formattedTeamFromApi = useMemo(() => {
    const dataList = Array.isArray(teamApiData) ? teamApiData : (teamApiData?.value || []);
    if (!dataList.length) {
      // Fallback mock users
      return [
        { name: "Alice Smith", emailID: "alice@company.com", role: "Recruiter", tokens: 1200 },
        { name: "Bob Jones", emailID: "bob@company.com", role: "Hiring Manager", tokens: 800 },
        { name: "Charlie Brown", emailID: "charlie@company.com", role: "Bench Sales", tokens: 450 }
      ];
    }
    return dataList.map((member) => ({
      name: member.name || member.emailID.split("@")[0],
      emailID: member.emailID,
      role: member.role === "Admin" ? "Administrator" : member.role === "Recruiter2" ? "Recruiter" : member.role === "Recruiter" ? "Hiring Manager" : "Bench Sales",
      tokens: member.tokens || 1000
    }));
  }, [teamApiData]);

  const allRoles = useMemo(() => {
    const roles = teamUsers.map(u => u.role).filter(Boolean);
    return Array.from(new Set(roles));
  }, [teamUsers]);

  useEffect(() => {
    if (formattedTeamFromApi.length > 0) {
      setTeamUsers(formattedTeamFromApi);
    }
  }, [formattedTeamFromApi]);

  useEffect(() => {
    if (teamUsers.length > 0 && !allocateUserEmail) {
      setAllocateUserEmail(teamUsers[0].emailID);
    }
  }, [teamUsers, allocateUserEmail]);

  const selectedUserObject = useMemo(() => {
    return teamUsers.find(u => u.emailID === allocateUserEmail) || null;
  }, [teamUsers, allocateUserEmail]);

  const totalAllocated = useMemo(() => {
    return teamUsers.reduce((acc, u) => acc + (u.tokens || 0), 0);
  }, [teamUsers]);

  const adminTokensLeft = adminTotalPool - totalAllocated;

  const tokenUsageLogs = useMemo(() => {
    return [
      { name: "Alice Smith", emailID: "alice@company.com", role: "Recruiter", tokensUsed: 850, limit: 1200, lastActive: "Jun 12, 2026 14:30" },
      { name: "Bob Jones", emailID: "bob@company.com", role: "Hiring Manager", tokensUsed: 620, limit: 800, lastActive: "Jun 12, 2026 11:15" },
      { name: "Charlie Brown", emailID: "charlie@company.com", role: "Bench Sales", tokensUsed: 400, limit: 450, lastActive: "Jun 11, 2026 17:45" },
      { name: "Dana White", emailID: "dana@company.com", role: "Recruiter", tokensUsed: 920, limit: 1000, lastActive: "Jun 12, 2026 09:20" },
      { name: "Edward Elric", emailID: "edward@company.com", role: "Administrator", tokensUsed: 2100, limit: 5000, lastActive: "Jun 10, 2026 15:30" }
    ];
  }, []);

  const totalTokensUsed = useMemo(() => {
    return tokenUsageLogs.reduce((sum, log) => sum + log.tokensUsed, 0);
  }, [tokenUsageLogs]);

  const avgTokensUsed = useMemo(() => {
    if (tokenUsageLogs.length === 0) return 0;
    return Math.round(totalTokensUsed / tokenUsageLogs.length);
  }, [tokenUsageLogs, totalTokensUsed]);

  const topConsumingRole = useMemo(() => {
    const roleMap = {};
    tokenUsageLogs.forEach(log => {
      roleMap[log.role] = (roleMap[log.role] || 0) + log.tokensUsed;
    });
    let topRole = "N/A";
    let maxUsed = 0;
    Object.keys(roleMap).forEach(role => {
      if (roleMap[role] > maxUsed) {
        maxUsed = roleMap[role];
        topRole = role;
      }
    });
    return topRole;
  }, [tokenUsageLogs]);

  const handleDownloadBillingPDF = async () => {
    const el = billingTableRef.current;
    if (!el) return;
    try {
      toast.info("Generating billing statement PDF...");
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pdfWidth, pdf.internal.pageSize.getHeight(), 'F');
      pdf.setFontSize(18);
      pdf.setTextColor(15, 23, 42);
      pdf.text('BenMyl — Billing Statement', 40, 40);
      pdf.setFontSize(10);
      pdf.setTextColor(100, 116, 139);
      pdf.text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 40, 58);
      pdf.addImage(imgData, 'PNG', 20, 70, pdfWidth - 40, pdfHeight);
      pdf.save('BenMyl_Billing_Statement.pdf');
      toast.success('Billing statement downloaded successfully!');
    } catch (err) {
      toast.error('Failed to generate PDF. Please try again.');
    }
  };

  const handlePayAddTokens = () => {
    if (selectedPaymentMethod === "new_card") {
      if (!stripeCardNumber || !stripeExpiry || !stripeCvc || !stripeName) {
        toast.error("Please fill in all card details.");
        return;
      }
    }
    
    setIsPaying(true);
    setTimeout(() => {
      // Add purchased tokens to pool state
      setAdminTotalPool(prev => prev + selectedPkg.tokens);
      toast.success(`Payment successful! Added ${selectedPkg.tokens.toLocaleString()} tokens to pool.`);
      
      // Reset inputs & close modal
      setStripeCardNumber("");
      setStripeExpiry("");
      setStripeCvc("");
      setStripeName("");
      setStripeZip("");
      setIsPaying(false);
      setIsAddTokensOpen(false);
    }, 1500);
  };

  const handleAllocateTokens = () => {
    if (!allocateUserEmail) {
      toast.error("Please select a user.");
      return;
    }
    const amount = parseInt(allocateTokensAmount);
    if (isNaN(amount) || amount < 100) {
      toast.error("Minimum tokens that can be shared/allocated is 100.");
      return;
    }
    if (amount > adminTokensLeft) {
      toast.error(`Insufficient tokens. You only have ${adminTokensLeft} tokens left.`);
      return;
    }

    setConfirmModalConfig({
      title: "Confirm Token Allocation",
      message: `Are you sure you want to allocate ${amount.toLocaleString()} tokens to ${selectedUserObject?.name}?`,
      icon: <Zap size={20} />,
      onConfirm: () => {
        setIsAllocating(true);
        setTimeout(() => {
          setTeamUsers(prev => prev.map(u => {
            if (u.emailID === allocateUserEmail) {
              return { ...u, tokens: (u.tokens || 0) + amount };
            }
            return u;
          }));

          toast.success(`Successfully allocated ${amount.toLocaleString()} tokens to ${selectedUserObject?.name}!`);
          setAllocateTokensAmount("");
          setIsAllocating(false);
        }, 1200);
      },
      onCancel: () => {}
    });
  };

  const handleApproveRequest = (req) => {
    if (req.tokensRequested > adminTokensLeft) {
      toast.error(`Insufficient tokens. You only have ${adminTokensLeft} tokens left.`);
      return;
    }

    setConfirmModalConfig({
      title: "Approve Token Request",
      message: `Are you sure you want to approve the request of ${req.tokensRequested.toLocaleString()} tokens for ${req.name}?`,
      icon: <Bell size={20} />,
      onConfirm: () => {
        setApprovingId(req.id);
        setTimeout(() => {
          setTeamUsers(prev => prev.map(u => {
            if (u.emailID === req.emailID) {
              return { ...u, tokens: (u.tokens || 0) + req.tokensRequested };
            }
            return u;
          }));
          setUserRequests(prev => prev.filter(r => r.id !== req.id));
          toast.success(`Approved and allocated ${req.tokensRequested.toLocaleString()} tokens to ${req.name}!`);
          setApprovingId(null);
        }, 1200);
      },
      onCancel: () => {}
    });
  };

  const handleDeclineRequest = (id) => {
    setUserRequests(prev => prev.filter(r => r.id !== id));
    toast.success("Token request declined.");
  };

  const getInitialsAvatar = (name) => {
    if (!name) return "";
    const parts = name.split(" ");
    const initials = parts.map(p => p[0]).join("").substring(0, 2).toUpperCase();

    return (
      <div className="profile-avatar initials">
        {initials}
      </div>
    );
  };

  const activePlan = subscriptionPlans.find(p => p.id === "free_trial") || subscriptionPlans[0];

  // Mock data for Admin
  const tokenUsageData = [
    { user: "Alice Smith", role: "Recruiter", usage: 1200 },
    { user: "Bob Jones", role: "Hiring Manager", usage: 800 },
    { user: "Charlie Brown", role: "Bench Sales", usage: 450 },
  ];

  const paymentHistoryData = [
    { date: "Sep 12, 2023", description: "Professional Plan (Annual)", amount: "$2,388.00", status: "PAID", invoice: "#INV-20230912-01" },
    { date: "Aug 12, 2023", description: "Professional Plan (Annual)", amount: "$2,388.00", status: "PAID", invoice: "#INV-20230812-01" },
    { date: "Jul 12, 2023", description: "Professional Plan (Annual)", amount: "$2,388.00", status: "PAID", invoice: "#INV-20230712-01" },
  ];

  const getPlanPrice = (planId) => {
    if (planId === "free_trial") return "$0";
    if (planId === "enterprise") return "Custom";
    
    if (planId === "basic") {
      return isYearlyBilling ? "$39/mo" : "$49/mo";
    }
    if (planId === "professional") {
      return isYearlyBilling ? "$159/mo" : "$199/mo";
    }
    return "Custom";
  };

  const renderPlanCard = (plan, isActive = false) => {
    const theme = planThemes[plan.id] || planThemes.free_trial;
    const PlanIcon = theme.icon;
    const priceDisplay = getPlanPrice(plan.id);

    return (
      <div 
        key={plan.id} 
        className={`subscription-plan-card ${theme.themeClass} ${isActive ? 'active-plan' : ''} ${plan.comingSoon ? 'coming-soon' : ''}`}
      >
        {/* Google UI color bar at the top */}
        <div className="plan-top-bar" style={{ backgroundColor: theme.accentColor }}></div>

        {/* Card Header matching Job Card structure */}
        <div className="plan-card-header">
          <div className="plan-header-left">
            <div className="plan-icon-box" style={{ color: theme.iconColor, backgroundColor: `${theme.accentColor}12` }}>
              <PlanIcon size={20} />
            </div>
            <div className="plan-header-info">
              <h3 className="plan-title">{plan.name}</h3>
              <p className="plan-subtitle">{plan.subtitle}</p>
            </div>
          </div>
          <div className="plan-badge-wrapper">
            {isActive ? (
              <span className="plan-status-badge active">Active Plan</span>
            ) : plan.recommended ? (
              <span className="plan-status-badge recommended">Recommended</span>
            ) : (
              <span className="plan-status-badge normal">{theme.badgeText}</span>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="plan-card-body">
          {/* Token Pills */}
          <div className="plan-token-section">
            <div className="plan-token-pill">
              <Zap size={13} style={{ fill: "#f5810c", color: "#f5810c" }} />
              <span>{plan.tokens}</span>
            </div>
            <p className="plan-token-breakdown">{plan.tokensBreakdown}</p>
          </div>

          {/* Features List */}
          <ul className="plan-features-list">
            {plan.features.map((feature, idx) => (
              <li key={idx}>
                <Check size={14} className="feature-check-icon" style={{ color: theme.accentColor }} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Card Footer */}
        <div className="plan-card-footer">
          <div className="plan-price-wrapper">
            <span className="price-label">Price:</span>
            <span className="price-value">{priceDisplay}</span>
            {isYearlyBilling && plan.id !== "free_trial" && plan.id !== "enterprise" && (
              <span style={{ fontSize: '9px', color: '#64748b', fontWeight: 600, marginTop: '2px' }}>
                Billed annually (${plan.id === "basic" ? 468 : 1908}/yr)
              </span>
            )}
          </div>
          
          <button 
            className={`plan-action-btn ${isActive ? 'active-btn' : plan.comingSoon ? 'coming-soon-btn' : 'upgrade-btn'}`}
            disabled={isActive || plan.comingSoon}
          >
            {isActive ? 'Current Plan' : plan.comingSoon ? 'Coming Soon' : 'Select Plan'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="projects-page-wrapper">
      <div className="projects-container">
        {/* HERO SECTION */}
        <div className="hero-card mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
          <div className="hero-left" style={{ flex: 1, minWidth: '280px' }}>
            <div className="hero-pill">
              ✦ Subscriptions & Billing
            </div>
            <h1 className="job-posting-title text-white">Subscription Management</h1>
            <div className="job-posting-header-info">
              <p className="job-posting-subtitle">
                {isAdmin 
                  ? "Manage your organization's subscription, view token utilization, and access billing history." 
                  : "View your active plan details, monitor your token utilization, and request more tokens."}
              </p>
            </div>
          </div>
          
          {/* Elegant widgets in top blue card */}
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "flex-end" }}>
            {/* Plan Details Widget */}
            <div className="hero-token-widget-premium">
              <div className="widget-header-premium">
                <Shield size={14} style={{ color: "#38bdf8" }} />
                <span>Current Subscription</span>
              </div>
              <div className="widget-value-premium font-sans" style={{ fontSize: "16.5px", fontWeight: 700, margin: "6px 0", color: "#ffffff" }}>
                Free Trial
              </div>
              <div style={{ fontSize: "10px", color: "rgba(255, 255, 255, 0.7)", fontWeight: 600 }}>
                Exp: June 30, 2026
              </div>
            </div>

            {/* Tokens Pool Widget */}
            <div className="hero-token-widget-premium">
              <div className="widget-header-premium">
                <Zap size={14} style={{ fill: "#fbbf24", color: "#fbbf24" }} />
                <span>{isAdmin ? "Available Tokens Pool" : "Your Available Tokens"}</span>
              </div>
              <div className="widget-value-premium">
                {isAdmin ? adminTokensLeft.toLocaleString() : "200"}
                <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.7)", fontWeight: 600, marginTop: "4px" }}>
                  {isAdmin ? `Allocated: ${adminTotalPool.toLocaleString()}` : "Allocated: 1,000"}
                </div>
              </div>
              {isAdmin && (
                <button className="add-tokens-action-btn" onClick={() => setIsAddTokensOpen(true)}>
                  Add Tokens
                </button>
              )}
            </div>
          </div>
        </div>

        {/* INTERACTIVE NAVIGATION TABS - ADMIN ONLY */}
        {isAdmin && (
          <div className="elegant-tabs-container">
            <button 
              className={`tab-item ${activeTab === 'users' ? 'active' : ''}`}
              style={activeTab === 'users' ? { color: '#10b981', borderBottomColor: '#10b981' } : {}}
              onClick={() => setActiveTab('users')}
            >
              <Users size={13} style={{ marginRight: '8px' }} />
              <span>Users</span>
            </button>
            
            <button 
              className={`tab-item ${activeTab === 'billing' ? 'active' : ''}`}
              style={activeTab === 'billing' ? { color: '#3b82f6', borderBottomColor: '#3b82f6' } : {}}
              onClick={() => setActiveTab('billing')}
            >
              <CreditCard size={13} style={{ marginRight: '8px' }} />
              <span>Billing & Payments</span>
            </button>
            
            <button 
              className={`tab-item ${activeTab === 'plans' ? 'active' : ''}`}
              style={activeTab === 'plans' ? { color: '#a855f7', borderBottomColor: '#a855f7' } : {}}
              onClick={() => setActiveTab('plans')}
            >
              <Layers size={13} style={{ marginRight: '8px' }} />
              <span>Subscription Plans</span>
            </button>

            <button 
              className={`tab-item ${activeTab === 'usage' ? 'active' : ''}`}
              style={activeTab === 'usage' ? { color: '#f5810c', borderBottomColor: '#f5810c' } : {}}
              onClick={() => setActiveTab('usage')}
            >
              <Activity size={13} style={{ marginRight: '8px' }} />
              <span>Token Usage</span>
            </button>
          </div>
        )}

        {/* TAB PANELS CONTENTS */}
        {isAdmin ? (
          <div className="subscription-tab-panel">

            {/* TAB 2: USERS AND TOKEN ALLOCATION (Admin Only, 80/20 Layout) */}
            {activeTab === 'users' && (
              <div className="users-tab-layout">
                {/* Left side: Allocate Tokens & Requests from Users (360px wide) */}
                <div className="users-aside-content">
                  {/* Allocate Tokens Card (Accordion style) */}
                  <div className="premium-card" style={{ padding: "20px" }}>
                    <h3 
                      onClick={() => setIsAllocateExpanded(!isAllocateExpanded)}
                      style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center", 
                        cursor: "pointer", 
                        fontSize: "13px", 
                        fontWeight: 700, 
                        color: "#1F2937", 
                        textTransform: "uppercase", 
                        letterSpacing: "0.06em", 
                        margin: 0
                      }}
                    >
                      <span className='section-title-premium' style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <DollarSign size={14} />
                        Allocate Tokens
                      </span>
                      <span>
                        {isAllocateExpanded ? (
                          <ChevronUp size={14} style={{ color: "#64748b" }} />
                        ) : (
                          <ChevronDown size={14} style={{ color: "#64748b" }} />
                        )}
                      </span>
                    </h3>

                    {isAllocateExpanded && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "16px" }}>
                        <div>
                          <label style={{ fontSize: "10px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "5px" }}>
                            Select User
                          </label>
                          <select 
                            value={allocateUserEmail} 
                            onChange={(e) => setAllocateUserEmail(e.target.value)}
                            style={{ width: "100%", padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", color: "#1e293b", outline: "none", cursor: "pointer", background: "#ffffff" }}
                          >
                            {teamUsers.map(user => (
                              <option key={user.emailID} value={user.emailID}>
                                {user.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label style={{ fontSize: "10px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "5px" }}>
                            User Role
                          </label>
                          <select 
                            value={selectedUserObject?.role || ""} 
                            disabled 
                            style={{ width: "100%", padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", color: "#94a3b8", outline: "none", background: "#f8fafc" }}
                          >
                            {allRoles.map((roleName) => (
                              <option key={roleName} value={roleName}>
                                {roleName}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div style={{ background: "#f8fafc", padding: "10px 12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                          <span style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>
                            Tokens Left in Pool
                          </span>
                          <span style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a", fontFamily: "'Space Grotesk', sans-serif" }}>
                            {adminTokensLeft.toLocaleString()}
                          </span>
                        </div>

                        <div>
                          <label style={{ fontSize: "10px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "5px" }}>
                            Tokens to Allocate
                          </label>
                          <input 
                            type="number" 
                            placeholder="Min 100" 
                            value={allocateTokensAmount} 
                            onChange={(e) => setAllocateTokensAmount(e.target.value)}
                            style={{ width: "100%", padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", color: "#1e293b", outline: "none", background: "#ffffff" }}
                          />
                        </div>

                        <button 
                          className="btn-primary" 
                          style={{ width: "100%", marginTop: "6px" }}
                          onClick={handleAllocateTokens}
                          disabled={isAllocating}
                        >
                          {isAllocating ? (
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                              <div className="spinner-sm"></div>
                              Allocating...
                            </div>
                          ) : (
                            "Allocate Tokens"
                          )}
                        </button>

                        <p style={{ fontSize: "11px", color: "#dc2626", fontWeight: 600, margin: "4px 0 0 0", lineHeight: "1.4" }}>
                          * Note: Minimum tokens that can be shared/allocated are 100.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Requests from Users Premium Cards Section (Styled as Toast Alerts in Scroll View) */}
                  <div className="premium-card" style={{ padding: "20px" }}>
                    <h3 className='section-title-premium mb-3' style={{ display: "flex", alignItems: "center", gap: "8px"}}>
                      <Bell size={14} />
                      Requests from Users
                    </h3>
                    <div className="requests-scroll-container">
                      {userRequests.length === 0 ? (
                        <div style={{ padding: "16px", textAlign: "center", color: "#64748b", fontSize: "13px" }}>
                          No pending token requests
                        </div>
                      ) : (
                        userRequests.map((req) => (
                          <div 
                            key={req.id} 
                            className="request-toast-alert-card"
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0, flex: 1 }}>
                              {getInitialsAvatar(req.name)}
                              <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                                <span style={{ fontWeight: 700, fontSize: "12.5px", color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                  {req.name}
                                </span>
                                <span style={{ fontSize: "11px", color: "#64748b", fontWeight: 600 }}>
                                  Req: <span style={{ color: "#f5810c", fontWeight: 700 }}>{req.tokensRequested}</span>
                                </span>
                                <span style={{ fontSize: "9px", color: "#94a3b8", fontWeight: 500, marginTop: "2px" }}>
                                  Requested on {req.date}
                                </span>
                              </div>
                            </div>
                            
                            <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                              <button
                                className="approve-toast-btn"
                                disabled={approvingId !== null}
                                onClick={() => handleApproveRequest(req)}
                                title="Approve Request"
                                style={{
                                  background: "#dcfce7",
                                  color: "#166534",
                                  border: "none",
                                  width: "28px",
                                  height: "28px",
                                  borderRadius: "50%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  cursor: "pointer",
                                }}
                              >
                                {approvingId === req.id ? (
                                  <div className="spinner-sm" style={{ width: "10px", height: "10px", borderTopColor: "#166534" }}></div>
                                ) : (
                                  <Check size={14} />
                                )}
                              </button>
                              <button
                                className="decline-toast-btn"
                                disabled={approvingId !== null}
                                onClick={() => handleDeclineRequest(req.id)}
                                title="Decline Request"
                                style={{
                                  background: "#fee2e2",
                                  color: "#991b1b",
                                  border: "none",
                                  width: "28px",
                                  height: "28px",
                                  borderRadius: "50%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  cursor: "pointer",
                                }}
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side: List of users with roles and tokens (1fr wide) */}
                <div className="users-main-content">
                  {/* User List Premium Card */}
                  <div className="premium-card" style={{ padding: "20px" }}>
                    <h2 className="section-title-premium mb-3">
                      <Users size={15} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                      <span style={{ verticalAlign: 'middle' }}>User Management & Token Allocation</span>
                    </h2>
                    <div className="candidates-table-wrapper">
                      <table className="custom-table">
                        <thead>
                          <tr>
                            <th>User</th>
                            <th>Role</th>
                            <th>Allocated Tokens</th>
                          </tr>
                        </thead>
                        <tbody>
                          {teamUsers.map((user, idx) => (
                            <tr key={idx}>
                              <td>
                                <div className="user-info-td">
                                  {getInitialsAvatar(user.name)}
                                  <div className="user-details-text">
                                    <span className="u-name">{user.name}</span>
                                    <span className="u-role">{user.emailID}</span>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span className="role-tag-sm">{user.role}</span>
                              </td>
                              <td>
                                <span className="token-usage-badge" style={{ background: "rgba(16, 185, 129, 0.08)", color: "#10b981", border: "1px solid rgba(16, 185, 129, 0.15)" }}>
                                  {user.tokens} Tokens
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: BILLING & INVOICES */}
            {activeTab === 'billing' && (
              <div className="billing-tab-layout">
                {/* Left Column: Payment Methods & Billing History vertically stacked */}
                <div className="billing-main-content">
                  
                  {/* 1. Payment Methods Card */}
                  <div className="premium-card mb-4" style={{ padding: "20px" }}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h2 className="section-title-premium m-0">
                        <CreditCard size={15} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                        <span style={{ verticalAlign: 'middle' }}>PAYMENT METHODS</span>
                      </h2>
                      <button className="add-method-btn" style={{ background: "none", border: "none", color: "#475569", fontWeight: 700, fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Plus size={13} /> Add Method
                      </button>
                    </div>
                    
                    <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", alignItems: "stretch" }}>
                      <div className="virtual-credit-card">
                        <div className="card-glow"></div>
                        <div className="card-top-row">
                          <div className="card-chip-container">
                            <div className="card-chip"></div>
                          </div>
                          <div className="card-brand">
                            <span className="brand-text">VISA</span>
                            <span className="card-badge">PRIMARY</span>
                          </div>
                        </div>
                        
                        <div className="card-middle-row">
                          <span className="virtual-card-number">••••  ••••  ••••  4242</span>
                        </div>
                        
                        <div className="card-bottom-row">
                          <div className="card-holder-info">
                            <span className="card-label-mini">CARDHOLDER</span>
                            <span className="card-value-text">BENMYL ORGANISATION</span>
                          </div>
                          <div className="card-expiry-info">
                            <span className="card-label-mini">EXPIRES</span>
                            <span className="card-value-text">04/28</span>
                          </div>
                        </div>
                      </div>

                      <div className="credit-card-details-panel">
                        <h4 className="details-panel-title">Card Information</h4>
                        <div className="details-grid">
                          <div className="details-item">
                            <span className="details-lbl">Card Type</span>
                            <span className="details-val">Visa Business Corporate</span>
                          </div>
                          <div className="details-item">
                            <span className="details-lbl">Bank Issuer</span>
                            <span className="details-val">Chase Bank, N.A.</span>
                          </div>
                          <div className="details-item">
                            <span className="details-lbl">Credit Limit</span>
                            <span className="details-val">$10,000.00 / Month</span>
                          </div>
                          <div className="details-item">
                            <span className="details-lbl">Billing Address</span>
                            <span className="details-val">100 Pine St, San Francisco, CA</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. Billing History Card */}
                  <div className="premium-card" style={{ padding: "20px" }}>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h2 className="section-title-premium m-0">
                        <Activity size={15} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                        <span style={{ verticalAlign: 'middle' }}>BILLING HISTORY</span>
                      </h2>
                      <button
                        className="btn-primary"
                        style={{ padding: '8px 16px', fontSize: '12px', gap: '6px' }}
                        onClick={handleDownloadBillingPDF}
                      >
                        <Download size={13} />
                        Download Statement
                      </button>
                    </div>

                    {/* Billing Summary — Admin Dashboard Style Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '20px' }}>

                      {/* Card: Total Billed */}
                      <div className="stat-card">
                        <div className="stat-header-row">
                          <div className="stat-title">Total Billed (YTD)</div>
                          <div className="stat-icon-box"><CreditCard size={16} /></div>
                        </div>
                        <div className="stat-number">$7,164</div>
                        <div className="stat-footer-row">
                          <span>3 payments made</span>
                        </div>
                        <div className="green-badge">+3</div>
                        <div className="stat-bottom-link">↗ Optimal Flow</div>
                        <div className="stat-bg-icon" style={{ color: '#6b6ff0' }}><CreditCard size={120} /></div>
                      </div>

                      {/* Card: Next Payment */}
                      <div className="stat-card">
                        <div className="stat-header-row">
                          <div className="stat-title">Next Payment Due</div>
                          <div className="stat-icon-box"><Clock size={16} /></div>
                        </div>
                        <div className="stat-number">$2,388</div>
                        <div className="stat-footer-row">
                          <span>Due Aug 12, 2026</span>
                        </div>
                        <div className="green-badge">Aug</div>
                        <div className="stat-bottom-link">↗ Optimal Flow</div>
                        <div className="stat-bg-icon" style={{ color: '#6b6ff0' }}><Clock size={120} /></div>
                      </div>

                      {/* Card: Active Plan */}
                      <div className="stat-card">
                        <div className="stat-header-row">
                          <div className="stat-title">Active Plan</div>
                          <div className="stat-icon-box"><Sparkles size={16} /></div>
                        </div>
                        <div className="stat-number" style={{ fontSize: '20px', letterSpacing: '-0.5px' }}>Professional</div>
                        <div className="stat-footer-row">
                          <span>Annual · Renews Jul 2026</span>
                        </div>
                        <div className="green-badge">Active</div>
                        <div className="stat-bottom-link">↗ Optimal Flow</div>
                        <div className="stat-bg-icon" style={{ color: '#6b6ff0' }}><Sparkles size={120} /></div>
                      </div>

                    </div>

                    <div className="candidates-table-wrapper" ref={billingTableRef}>
                      <table className="custom-table">
                        <thead>
                          <tr>
                            <th>DATE</th>
                            <th>DESCRIPTION</th>
                            <th>AMOUNT</th>
                            <th>STATUS</th>
                            <th>INVOICE</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paymentHistoryData.map((ph, idx) => (
                            <tr key={idx}>
                              <td style={{ fontWeight: 700, color: '#1e293b' }}>{ph.date}</td>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <FileText size={13} style={{ color: '#94a3b8', flexShrink: 0 }} />
                                  {ph.description}
                                </div>
                              </td>
                              <td style={{ fontWeight: 700, color: '#0f172a', fontFamily: "'Space Grotesk', sans-serif" }}>
                                {ph.amount}
                              </td>
                              <td>
                                <span className="job-chip mint">{ph.status}</span>
                              </td>
                              <td>
                                <button
                                  className="invoice-link-btn"
                                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                                  onClick={() => toast.success(`Invoice ${ph.invoice} downloaded successfully!`)}
                                >
                                  <Download size={11} />
                                  {ph.invoice}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>

                {/* Right Column: Aside Custom Assistance Panel */}
                <div className="billing-aside-content">
                  <div className="premium-card" style={{ border: "1.5px dashed #cbd5e1", padding: "16px", background: "#f8fafc" }}>
                    <h3 style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 700, color: "#1F2937", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
                      <Sparkles size={14} style={{ color: "#a855f7" }} />
                      Need customization?
                    </h3>
                    <p style={{ fontSize: "12px", color: "#64748b", marginBottom: "14px", lineHeight: "1.5" }}>For custom seat counts, dedicated support, or white-label platforms, please contact our enterprise team.</p>
                    <button className="btn-primary" style={{ width: "100%", fontSize: "13px", padding: "8px 14px" }} onClick={() => toast.info("Support request submitted!")}>Contact Support</button>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 4: SUBSCRIPTION PLANS (Last) */}
            {activeTab === 'plans' && (
              <div className="plans-section-full">
                <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers size={18} style={{ color: "#a855f7" }} />
                  Available Subscription Plans
                </h3>
                
                {/* Billing Cycle Toggle */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', margin: '24px 0 32px 0' }}>
                  <span style={{ fontSize: '14px', fontWeight: isYearlyBilling ? 500 : 700, color: isYearlyBilling ? '#64748b' : '#0f172a' }}>Monthly Billing</span>
                  <button 
                    onClick={() => setIsYearlyBilling(!isYearlyBilling)}
                    style={{
                      width: '48px',
                      height: '24px',
                      borderRadius: '12px',
                      background: '#5B5BD6',
                      position: 'relative',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'background 0.2s ease'
                    }}
                  >
                    <div 
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: '#ffffff',
                        transform: isYearlyBilling ? 'translateX(24px)' : 'translateX(0)',
                        transition: 'transform 0.2s ease'
                      }}
                    />
                  </button>
                  <span style={{ fontSize: '14px', fontWeight: isYearlyBilling ? 700 : 500, color: isYearlyBilling ? '#0f172a' : '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Yearly Billing 
                    <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 6px', background: '#dcfce7', color: '#166534', borderRadius: '12px' }}>Save 20%</span>
                  </span>
                </div>

                <div className="subscription-plans-container-4col">
                  {subscriptionPlans.map((plan) => (
                    renderPlanCard(plan, plan.id === "free_trial")
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: TOKEN USAGE MONITORING (Admin Only) */}
            {activeTab === 'usage' && (
              <div className="token-usage-tab-layout">
                {/* Summary Stat Cards — Admin Dashboard Style */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '20px' }}>

                  {/* Card: Total Used Tokens */}
                  <div className="stat-card">
                    <div className="stat-header-row">
                      <div className="stat-title">Total Used Tokens</div>
                      <div className="stat-icon-box"><Zap size={16} /></div>
                    </div>
                    <div className="stat-number">{totalTokensUsed.toLocaleString()}</div>
                    <div className="stat-footer-row">
                      <span>Across all users</span>
                    </div>
                    <div className="green-badge">+12%</div>
                    <div className="stat-bottom-link">↗ Optimal Flow</div>
                    <div className="stat-bg-icon" style={{ color: '#6b6ff0' }}><Zap size={120} /></div>
                  </div>

                  {/* Card: Avg Tokens Per User */}
                  <div className="stat-card">
                    <div className="stat-header-row">
                      <div className="stat-title">Avg. Tokens / User</div>
                      <div className="stat-icon-box"><Users size={16} /></div>
                    </div>
                    <div className="stat-number">{avgTokensUsed.toLocaleString()}</div>
                    <div className="stat-footer-row">
                      <span>Per active member</span>
                    </div>
                    <div className="green-badge">+8%</div>
                    <div className="stat-bottom-link">↗ Optimal Flow</div>
                    <div className="stat-bg-icon" style={{ color: '#6b6ff0' }}><Users size={120} /></div>
                  </div>

                  {/* Card: Top Consuming Role */}
                  <div className="stat-card">
                    <div className="stat-header-row">
                      <div className="stat-title">Top Consuming Role</div>
                      <div className="stat-icon-box"><Award size={16} /></div>
                    </div>
                    <div className="stat-number" style={{ fontSize: '18px', letterSpacing: '-0.5px' }}>{topConsumingRole}</div>
                    <div className="stat-footer-row">
                      <span>Highest token usage</span>
                    </div>
                    <div className="green-badge">+24%</div>
                    <div className="stat-bottom-link">↗ Optimal Flow</div>
                    <div className="stat-bg-icon" style={{ color: '#6b6ff0' }}><Award size={120} /></div>
                  </div>

                </div>

                {/* Table Card */}
                <div className="premium-card" style={{ padding: "20px" }}>
                  <div className="usage-table-header mb-4">
                    <div className="header-left">
                      <h2 className="section-title-premium m-0">
                        <Activity size={15} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                        <span style={{ verticalAlign: 'middle' }}>Recorded Token Usage</span>
                      </h2>
                    </div>
                  </div>

                  <div className="candidates-table-wrapper">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Role</th>
                          <th>Utilization</th>
                          <th>Percentage Used</th>
                          <th>Last Active</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tokenUsageLogs.length === 0 ? (
                          <tr>
                            <td colSpan="5" style={{ textAlign: "center", padding: "24px", color: "#64748b" }}>
                              No token usage records available.
                            </td>
                          </tr>
                        ) : (
                          tokenUsageLogs.map((log, idx) => {
                            const percent = Math.min(100, Math.round((log.tokensUsed / log.limit) * 100));
                            let progressClass = "success";
                            if (percent > 85) progressClass = "danger";
                            else if (percent > 60) progressClass = "warning";
                            
                            return (
                              <tr key={idx}>
                                <td>
                                  <div className="user-info-td">
                                    {getInitialsAvatar(log.name)}
                                    <div className="user-details-text">
                                      <span className="u-name">{log.name}</span>
                                      <span className="u-role">{log.emailID}</span>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <span className="role-tag-sm">{log.role}</span>
                                </td>
                                <td>
                                  <div className="usage-progress-col">
                                    <div className="usage-numeric">
                                      <span>{log.tokensUsed.toLocaleString()}</span>
                                      <span className="usage-slash">/</span>
                                      <span className="usage-limit">{log.limit.toLocaleString()}</span>
                                    </div>
                                    <div className="progress-bar-bg compact">
                                      <div 
                                        className={`progress-bar-fill ${progressClass}`} 
                                        style={{ width: `${percent}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <span className={`percent-badge ${progressClass}`}>
                                    {percent}%
                                  </span>
                                </td>
                                <td style={{ color: "#64748b", fontWeight: 600 }}>
                                  {log.lastActive}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

          </div>
        ) : (
          <div className="subscription-tab-panel">
            <div className="users-tab-layout">
              {/* Left Column (Main Content) */}
              <div className="users-main-content">
                {/* Request More Tokens */}
                <div className="premium-card" style={{ padding: "24px" }}>
                  <h2 className="section-title-premium mb-3">
                    <Plus size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    <span style={{ verticalAlign: 'middle' }}>REQUEST MORE TOKENS</span>
                  </h2>
                  <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "20px", lineHeight: "1.6" }}>
                    Running low on tokens for uploading talent profiles or job details? Submit a request to your administrator.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
                    <div>
                      <label style={{ fontSize: "11px", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "8px" }}>
                        Tokens Required
                      </label>
                      <input 
                        type="number" 
                        min="1"
                        placeholder="e.g. 500" 
                        value={requestTokenAmount} 
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "" || Number(val) >= 0) {
                            setRequestTokenAmount(val);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === '-' || e.key === 'e' || e.key === '+' || e.key === '.') {
                            e.preventDefault();
                          }
                        }}
                        className="no-spinner-input"
                        style={{ width: "100%", padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", color: "#1e293b", outline: "none", background: "#f8fafc", transition: "all 0.2s" }}
                      />
                    </div>
                    <button 
                      className="btn-primary" 
                      style={{ padding: "12px 20px", height: "44px", width: "100%", fontSize: "14px" }} 
                      onClick={handleRequestTokens}
                      disabled={isRequestingTokens}
                    >
                      {isRequestingTokens ? (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{ width: '1rem', height: '1rem', borderWidth: '0.15em' }}></span>
                          Submitting...
                        </div>
                      ) : (
                        "Submit Request"
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column (Aside) */}
              <div className="users-aside-content">
                {/* Single Section for Plan Details + Token Utilization */}
                <div className="premium-card" style={{ padding: "20px" }}>
                  <h2 className="section-title-premium mb-4" style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: 'none', paddingBottom: 0 }}>
                    <Activity size={16} style={{ color: "#3b82f6" }} /> YOUR TOKEN UTILIZATION
                  </h2>
                  <div style={{ display: 'flex', gap: '14px', marginBottom: '24px' }}>
                    <div className="stat-card w-100">
                      <div className="stat-header-row">
                        <div className="stat-title">Allocated Tokens</div>
                        <div className="stat-icon-box"><Zap size={16} /></div>
                      </div>
                      <div className="stat-number">1,000</div>
                      <div className="stat-footer-row"><span>Total assigned to you</span></div>
                      <div className="green-badge">Max</div>
                      <div className="stat-bg-icon" style={{ color: '#6b6ff0' }}><Zap size={120} /></div>
                    </div>
                    
                    <div className="stat-card w-100">
                      <div className="stat-header-row">
                        <div className="stat-title">Used Tokens</div>
                        <div className="stat-icon-box"><Activity size={16} /></div>
                      </div>
                      <div className="stat-number">800</div>
                      <div className="stat-footer-row"><span>Tokens consumed</span></div>
                      <div className="green-badge" style={{ background: '#fee2e2', color: '#991b1b' }}>80%</div>
                      <div className="stat-bg-icon" style={{ color: '#ef4444' }}><Activity size={120} /></div>
                    </div>
                    
                    <div className="stat-card w-100">
                      <div className="stat-header-row">
                        <div className="stat-title">Remaining Tokens</div>
                        <div className="stat-icon-box"><Plus size={16} /></div>
                      </div>
                      <div className="stat-number text-orange">200</div>
                      <div className="stat-footer-row"><span>Available for use</span></div>
                      <div className="green-badge" style={{ background: '#fef3c7', color: '#d97706' }}>20%</div>
                      <div className="stat-bg-icon" style={{ color: '#f59e0b' }}><Plus size={120} /></div>
                    </div>
                  </div>

                  <hr style={{ border: 0, borderTop: "1px dashed #e2e8f0", margin: "24px 0" }} />

                  <h2 className="section-title-premium mb-3">
                    <Shield size={15} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    <span style={{ verticalAlign: 'middle' }}>CURRENT PLAN DETAILS</span>
                  </h2>
                  <div className="mb-4">
                    {renderPlanCard(activePlan, true)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ADD TOKENS SIDE MODAL (STRIPE FORMAT) */}
        {isAddTokensOpen && (
          <>
            {/* Backdrop */}
            <div className="psm-backdrop"></div>
            
            {/* Panel */}
            <div className="psm-panel">
              {/* Header */}
              <div className="psm-hero" style={{ padding: "24px 28px" }}>
                <button className="psm-close-btn" onClick={() => setIsAddTokensOpen(false)}>
                  &times;
                </button>
                <h2 className="psm-name" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "18px" }}>
                  <Zap size={18} style={{ fill: "#fbbf24", color: "#fbbf24" }} />
                  Add Tokens to Pool
                </h2>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", margin: "6px 0 0 0" }}>
                  Purchase additional tokens to distribute to your recruiters and hiring managers.
                </p>
              </div>
              
              {/* Scrollable Body */}
              <div className="psm-body" style={{ gap: "20px" }}>
                
                {/* Package Selection */}
                <div>
                  <label className="stripe-label">Select Token Package</label>
                  <div className="token-packages-grid">
                    {tokenPackages.map((pkg) => (
                      <div 
                        key={pkg.tokens}
                        onClick={() => setSelectedPkg(pkg)}
                        className={`token-pkg-grid-card ${selectedPkg.tokens === pkg.tokens ? 'selected' : ''}`}
                        style={selectedPkg.tokens === pkg.tokens ? {
                          borderColor: pkg.color,
                          background: `linear-gradient(145deg, #ffffff, ${pkg.bgLight})`,
                          boxShadow: `0 4px 16px ${pkg.color}20`
                        } : {}}
                      >
                        {pkg.recommended && (
                          <span className="recommended-badge-mini" style={{ backgroundColor: pkg.color, boxShadow: `0 2px 4px ${pkg.color}30` }}>
                            Best Value
                          </span>
                        )}
                        <span className="pkg-tokens-value">
                          {pkg.tokens.toLocaleString()}
                        </span>
                        <span className="pkg-tokens-lbl">Tokens</span>
                        
                        <span className="pkg-price-value" style={{ color: pkg.color }}>${pkg.price}</span>
                        <span className="pkg-unit-price">
                          {(pkg.price / pkg.tokens * 1000).toFixed(2)}¢ / token
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "16px" }}>
                  <label className="stripe-label" style={{ marginBottom: "8px" }}>Payment Method</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div 
                      onClick={() => setSelectedPaymentMethod("visa_4242")}
                      className={`stripe-payment-selector-card ${selectedPaymentMethod === "visa_4242" ? "selected" : ""}`}
                    >
                      <div className="selector-card-left">
                        <div className="brand-logo-icon">
                          <span>VISA</span>
                        </div>
                        <div className="card-meta">
                          <span className="card-desc">Visa ending in 4242 (Primary)</span>
                          <span className="card-expiry-sub">Expires 04/2028</span>
                        </div>
                      </div>
                      <div className="selector-card-right">
                        {selectedPaymentMethod === "visa_4242" ? (
                          <div className="check-indicator active">
                            <Check size={12} />
                          </div>
                        ) : (
                          <div className="check-indicator"></div>
                        )}
                      </div>
                    </div>

                    <div 
                      onClick={() => setSelectedPaymentMethod("new_card")}
                      className={`stripe-payment-selector-card ${selectedPaymentMethod === "new_card" ? "selected" : ""}`}
                    >
                      <div className="selector-card-left">
                        <div className="brand-logo-icon new-card-icon">
                          <Plus size={16} />
                        </div>
                        <div className="card-meta">
                          <span className="card-desc">Add New Payment Method</span>
                          <span className="card-expiry-sub">Pay securely using Stripe</span>
                        </div>
                      </div>
                      <div className="selector-card-right">
                        {selectedPaymentMethod === "new_card" ? (
                          <div className="check-indicator active">
                            <Check size={12} />
                          </div>
                        ) : (
                          <div className="check-indicator"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stripe Credit Card Form */}
                {selectedPaymentMethod === "new_card" && (
                  <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "16px" }}>
                    <label className="stripe-label" style={{ marginBottom: "8px" }}>New Card Details</label>
                    <div className="stripe-input-group">
                      {/* Card Number */}
                      <div className="stripe-input-cell">
                        <span className="stripe-input-label">Card Number</span>
                        <input 
                          type="text" 
                          placeholder="4242 4242 4242 4242" 
                          className="stripe-input-field"
                          value={stripeCardNumber}
                          onChange={(e) => setStripeCardNumber(e.target.value)}
                        />
                      </div>
                      {/* Expiry and CVC row */}
                      <div className="stripe-input-row">
                        <div className="stripe-input-cell">
                          <span className="stripe-input-label">Expiration</span>
                          <input 
                            type="text" 
                            placeholder="MM / YY" 
                            className="stripe-input-field"
                            value={stripeExpiry}
                            onChange={(e) => setStripeExpiry(e.target.value)}
                          />
                        </div>
                        <div className="stripe-input-cell">
                          <span className="stripe-input-label">CVC</span>
                          <input 
                            type="text" 
                            placeholder="123" 
                            className="stripe-input-field"
                            maxLength={4}
                            value={stripeCvc}
                            onChange={(e) => setStripeCvc(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="stripe-field-container">
                      <span className="stripe-label">Cardholder Name</span>
                      <input 
                        type="text" 
                        placeholder="Jane Smith" 
                        className="stripe-field-input"
                        value={stripeName}
                        onChange={(e) => setStripeName(e.target.value)}
                      />
                    </div>

                    <div className="stripe-field-container">
                      <span className="stripe-label">ZIP / Postal Code</span>
                      <input 
                        type="text" 
                        placeholder="10001" 
                        className="stripe-field-input"
                        value={stripeZip}
                        onChange={(e) => setStripeZip(e.target.value)}
                      />
                    </div>
                  </div>
                )}
                
                <div style={{ background: "#f8fafc", padding: "12px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "#64748b" }}>Total Payment:</span>
                <span style={{ fontSize: "18px", fontWeight: 800, color: "#1e293b", fontFamily: "'Space Grotesk', sans-serif" }}>${selectedPkg.price}.00</span>
              </div>
            </div>

            {/* Footer */}
            <div className="psm-footer">
              <button 
                className="btn-secondary" 
                onClick={() => setIsAddTokensOpen(false)}
                disabled={isPaying}
              >
                Cancel
              </button>
              <button 
                className="btn-primary" 
                onClick={handlePayAddTokens}
                disabled={isPaying}
              >
                {isPaying ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                    <div className="spinner-sm"></div>
                    Processing...
                  </div>
                ) : (
                  `Pay $${selectedPkg.price}.00`
                )}
              </button>
            </div>
          </div>
        </>
      )}

      {/* CUSTOM CONFIRMATION DIALOG OVERLAY */}
      {confirmModalConfig && (
        <>
          <div className="psm-backdrop" style={{ zIndex: 10000 }}></div>
          <div className="custom-confirm-overlay">
            <div className="custom-confirm-card">
              <div className="custom-confirm-header">
                <div className="custom-confirm-icon-box">
                  {confirmModalConfig.icon}
                </div>
                <h3>{confirmModalConfig.title}</h3>
              </div>
              <p className="custom-confirm-message">{confirmModalConfig.message}</p>
              <div className="custom-confirm-actions">
                <button 
                  className="btn-secondary" 
                  onClick={() => {
                    confirmModalConfig.onCancel();
                    setConfirmModalConfig(null);
                  }}
                >
                  Cancel
                </button>
                <button 
                  className="btn-primary" 
                  onClick={() => {
                    confirmModalConfig.onConfirm();
                    setConfirmModalConfig(null);
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      </div>
    </div>
  );
};

export default SubscriptionPage;
