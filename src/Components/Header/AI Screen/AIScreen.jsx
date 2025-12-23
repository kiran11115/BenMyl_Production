// AIscreen.jsx
import React, { useState } from "react";
import {
  FiLink2,
  FiArrowRight,
  FiMoreVertical,
  FiPhone,
  FiMail,
  FiMapPin,
} from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi";
import { FaReact, FaFigma } from "react-icons/fa";
import { SiDotnet, SiMongodb, SiSketch, SiAdobe } from "react-icons/si";

const recentSearches = [
  "The user profile page for a guided meditation and mindfulness app",
  "Quiz page in a language learning app with a progress bar at the top. The title challenges you to match a Spanish word with the correct answer, offering four possible options.",
];

const availableTalent = [
  {
    initials: "AK",
    name: "Alexia Kev",
    role: "Technical Specialist",
    domain: "IT Software",
    phone: "+91 98765 43210",
    email: "harrymate@gmail.com",
    location: "Visakhapatnam",
    skills: ["C#", ".Net", "ASP.NET", "+3"],
    match: "70%",
  },
  {
    initials: "RK",
    name: "Raj Kumar",
    role: "Full Stack Developer",
    domain: "IT Software",
    phone: "+91 98765 43211",
    email: "raj.kumar@gmail.com",
    location: "Hyderabad",
    skills: ["React", "Node.js", "MongoDB", "+3"],
    match: "85%",
  },
  {
    initials: "PS",
    name: "Priya Singh",
    role: "UI/UX Designer",
    domain: "Design",
    phone: "+91 98765 43212",
    email: "priya.singh@gmail.com",
    location: "Bangalore",
    skills: ["Figma", "Adobe XD", "Sketch", "+3"],
    match: "92%",
  },
  {
    initials: "MC",
    name: "Michael Chen",
    role: "DevOps Engineer",
    domain: "IT Software",
    phone: "+91 98765 43213",
    email: "michael.chen@gmail.com",
    location: "Remote",
    skills: ["AWS", "Kubernetes", "Docker", "+3"],
    match: "78%",
  },
];

const topChips = [
  "Website Development",
  "Logo Design",
  "Branding Services",
  "Social Media Design",
  "UI/UX Design",
  "Architecture & Interior Design",
  "Video Editing",
  "Packaging Design",
  "Landing Page Design",
  "Illustrations",
  "Stationery Design",
  "Fonts & Typography",
];

const AIscreen = () => {
  // questionnaire state
  const [category, setCategory] = useState("");
  const [goal, setGoal] = useState("");
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState("");
  const [extraNotes, setExtraNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState("");

  const handleChipClick = (chip) => {
    setCategory(chip);
  };

  const handleUseSearch = (text) => {
    setGoal(text);
  };

  const handleSubmit = async () => {
    if (!goal.trim()) {
      alert("Please describe the main goal of this request.");
      return;
    }

    setLoading(true);
    setGeneratedSummary("");

    // Build structured prompt for your AI
    const payload = {
      category: category || "General design",
      goal,
      audience: audience || "Not specified",
      tone: tone || "Professional",
      extraNotes,
    };

    // Example summary generation on client; replace with real API call.
    const summary = `Create a ${payload.category.toLowerCase()} concept. 
Main goal: ${payload.goal}. 
Target audience: ${payload.audience}. 
Preferred tone/style: ${payload.tone}. 
Additional notes: ${payload.extraNotes || "None"}.`;

    // simulate async
    setTimeout(() => {
      setGeneratedSummary(summary);
      setLoading(false);
    }, 400);
  };

  return (
    <div className="projects-container">
      <div className="dashboard-layout">
        {/* MAIN: questionnaire */}
        <div className="dashboard-column-main">
          <h2
            className="section-title"
            style={{
              fontSize: 28,
              textAlign: "center",
              marginBottom: 24,
            }}
          >
            How can i help you ?
          </h2>

          {/* Category chips */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              justifyContent: "center",
              marginBottom: 24,
            }}
          >
            {topChips.map((chip) => {
              const active = category === chip;
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleChipClick(chip)}
                  style={{
                    borderRadius: 999,
                    border: active ? "1px solid #2563eb" : "1px solid #e2e8f0",
                    padding: "6px 14px",
                    backgroundColor: active ? "#eff6ff" : "#ffffff",
                    fontSize: 12,
                    color: active ? "#1d4ed8" : "#1e293b",
                    cursor: "pointer",
                    boxShadow: "0 1px 2px rgba(15,23,42,0.03)",
                  }}
                >
                  {chip}
                </button>
              );
            })}
          </div>

          {/* QUESTIONNAIRE CARD */}
          <div
            className="stat-card"
            style={{
              padding: 0,
              borderRadius: 20,
              overflow: "hidden",
            }}
          >
            {/* Top helper row */}
            <div
              style={{
                padding: 16,
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13,
                color: "#64748b",
              }}
            >
              <FiLink2 />
              <span>
                Answer a few questions and AI will generate a concise brief
                summary for you.
              </span>
            </div>

            {/* Questions */}
            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Q1: Goal */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#1e293b",
                    marginBottom: 6,
                  }}
                >
                  1. What do you need help with?
                </label>
                <textarea
                  rows={3}
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  style={{
                    width: "100%",
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    padding: 10,
                    fontSize: 13,
                    resize: "vertical",
                    outline: "none",
                  }}
                  placeholder="Example: I need a user profile page for a guided meditation app..."
                />
              </div>

              {/* Q2: Audience */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#1e293b",
                    marginBottom: 6,
                  }}
                >
                  2. Who is the primary audience?
                </label>
                <input
                  type="text"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  style={{
                    width: "100%",
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    padding: 10,
                    fontSize: 13,
                    outline: "none",
                  }}
                  placeholder="Example: Busy professionals looking for quick mindfulness breaks"
                />
              </div>

              {/* Q3: Tone */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#1e293b",
                    marginBottom: 6,
                  }}
                >
                  3. What tone or style should it feel like?
                </label>
                <input
                  type="text"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  style={{
                    width: "100%",
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    padding: 10,
                    fontSize: 13,
                    outline: "none",
                  }}
                  placeholder="Example: Calm, minimal, premium, mobile-first"
                />
              </div>

              {/* Q4: Extra notes */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#1e293b",
                    marginBottom: 6,
                  }}
                >
                  4. Any extra notes or constraints?
                </label>
                <textarea
                  rows={2}
                  value={extraNotes}
                  onChange={(e) => setExtraNotes(e.target.value)}
                  style={{
                    width: "100%",
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    padding: 10,
                    fontSize: 13,
                    resize: "vertical",
                    outline: "none",
                  }}
                  placeholder="Deadlines, brand colors, platforms, file formats, etc."
                />
              </div>
            </div>

            {/* Submit */}
            <div
              style={{
                padding: "12px 20px 16px",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 18px",
                  borderRadius: 999,
                  border: "none",
                  backgroundColor: loading ? "#94a3b8" : "#2563eb",
                  color: "#ffffff",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: loading ? "default" : "pointer",
                }}
              >
                {loading ? "Generating..." : "Generate AI Summary"}
                {!loading && <FiArrowRight />}
              </button>
            </div>
          </div>

          {/* Generated summary preview */}
          {generatedSummary && (
            <div
              className="stat-card"
              style={{ marginTop: 20, whiteSpace: "pre-line" }}
            >
              <h4
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#1e293b",
                  marginBottom: 8,
                }}
              >
                AI-ready brief summary
              </h4>
              <p style={{ fontSize: 13, color: "#475569" }}>{generatedSummary}</p>
            </div>
          )}

          {/* Recent searches as quick-fill */}
          <div style={{ marginTop: 24 }}>
            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#1e293b",
                marginBottom: 10,
              }}
            >
              Recent Searches:
            </p>
            <div className="projects-grid">
              {recentSearches.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleUseSearch(item)}
                  className="stat-card"
                  style={{
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: 14,
                    cursor: "pointer",
                  }}
                >
                  <div className="icon-box-premium">
                    <HiOutlineSparkles />
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#475569",
                      lineHeight: 1.5,
                    }}
                  >
                    {item}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SIDE: Available talent (unchanged visual, functional data-driven) */}
        <div className="dashboard-column-side">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#1e293b",
              }}
            >
              Available Talent
            </span>
            <button
              type="button"
              style={{
                borderRadius: 999,
                padding: "2px 10px",
                border: "none",
                fontSize: 11,
                backgroundColor: "#22c55e",
                color: "#ffffff",
                fontWeight: 600,
              }}
            >
              45 AI Tokens
            </button>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {availableTalent.map((t) => (
              <div
                key={t.email}
                className="stat-card"
                style={{ padding: 16, borderRadius: 16 }}
              >
                <div className="card-header">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        backgroundColor: "#0f172a",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      {t.initials}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#1e293b",
                        }}
                      >
                        {t.name}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "#64748b",
                        }}
                      >
                        {t.role}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="card-options-btn"
                    aria-label="More options"
                  >
                    <FiMoreVertical />
                  </button>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginTop: 6,
                    fontSize: 11,
                    color: "#64748b",
                  }}
                >
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: 999,
                      backgroundColor: "#eff6ff",
                    }}
                  >
                    {t.domain}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      marginLeft: "auto",
                      fontWeight: 600,
                      color: "#16a34a",
                    }}
                  >
                    {t.match}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    marginTop: 8,
                    fontSize: 11,
                    color: "#64748b",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <FiPhone />
                    <span>{t.phone}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <FiMail />
                    <span>{t.email}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <FiMapPin />
                    <span>{t.location}</span>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 6,
                    marginTop: 10,
                    fontSize: 11,
                  }}
                >
                  {t.skills.map((skill) => (
                    <span
                      key={skill}
                      className="status-tag status-progress"
                      style={{
                        textTransform: "none",
                        letterSpacing: 0,
                      }}
                    >
                      {skill === "React" ? (
                        <>
                          <FaReact style={{ marginRight: 4 }} />
                          React
                        </>
                      ) : skill === "Figma" ? (
                        <>
                          <FaFigma style={{ marginRight: 4 }} />
                          Figma
                        </>
                      ) : skill === ".Net" ? (
                        <>
                          <SiDotnet style={{ marginRight: 4 }} />
                          .Net
                        </>
                      ) : skill === "MongoDB" ? (
                        <>
                          <SiMongodb style={{ marginRight: 4 }} />
                          MongoDB
                        </>
                      ) : skill === "Adobe XD" ? (
                        <>
                          <SiAdobe style={{ marginRight: 4 }} />
                          Adobe&nbsp;XD
                        </>
                      ) : skill === "Sketch" ? (
                        <>
                          <SiSketch style={{ marginRight: 4 }} />
                          Sketch
                        </>
                      ) : (
                        skill
                      )}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIscreen;
