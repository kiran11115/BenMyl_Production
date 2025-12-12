import React, { useState } from "react";
import {
  FiChevronLeft,
  FiMail,
  FiStar,
  FiBriefcase,
  FiArrowLeft,
  FiClock,
  FiFileText,
  FiFolder,
  FiShield,
} from "react-icons/fi";
import "./VendorDetail.css";
import { useNavigate } from "react-router-dom";

/*
 Replace these image URLs with your real logo and client logos.
 If you want the exact logo from your screenshot, upload it and set vendor.logo to that path (e.g. /assets/innovation-logo.png).
*/
const vendor = {
  id: 1,
  name: "Innovation Solutions",
  // Replace with your real logo URL
  logo: "https://i.ibb.co/2nT3V9Q/innovation-logo-sample.png",
  rating: 4.8,
  reviews: 89,
  services: ["Interview Panel", "Onboarding"],
  avgResponse: "2 hrs",
  budget: "$5,000 - $20,000",
  pastClients: [
    "https://i.ibb.co/g6K8kYg/client-innovation.png",
    "https://i.ibb.co/9s9JX2F/client-globaltech.png",
  ],
  certifications: ["SOC 2", "ISO 27001"],
  about:
    "Innovation Solutions is a leading talent acquisition and HR consulting firm with over 10 years of experience. We specialize in providing comprehensive recruitment solutions for technology companies.",
  highlights: [
    "Team of 50+ HR professionals",
    "Offices in 5 major cities",
  ],
  coreServices: [
    {
      title: "Interview Panel",
      desc: "Expert interviewers for technical and cultural assessment",
    },
    {
      title: "Onboarding",
      desc: "Streamlined onboarding process and documentation",
    },
  ],
};

export default function VendorDetail() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("About");

  return (
    <div className="vp-page">
      {/* subtle gradient header like screenshot */}
      <div className="vp-header-bg" />

      <div className="vp-top">
        <div className="vp-breadcrumbs">
          <button className="link-button" onClick={() => navigate("/user/user-dashboard")}><FiArrowLeft /> Back to Dashboard</button>
          <button className="link-button" onClick={() => navigate("/user/user-find-vendor")}><FiArrowLeft /> Find Vendor</button>
          <span className="crumb">/ View Details</span>
        </div>
      </div>

      <header className="vp-header mt-4">
        <div className="vp-left">
          <div className="logo-wrap">
            <img src={vendor.logo} alt={`${vendor.name} logo`} className="vp-logo" />
          </div>
          <div>
            <div className="small-muted">Vendor Profile</div>
            <h1 className="vp-title">{vendor.name}</h1>
          </div>
        </div>

        <div className="vp-actions">
          <button className="btn-ghost" aria-label="Message vendor">
            <FiMail /> <span>Message Vendor</span>
          </button>
          <button className="btn-primary" aria-label="Invite to bid" onClick={() => navigate("/user/user-invite-bid")}>Invite to Bid</button>
        </div>
      </header>

      <section className="vp-card">
        <div className="vp-rating">
          <div className="big-rating">
            <div className="rating-left">
              <span className="rating-num">{vendor.rating.toFixed(1)}</span>
              <div className="stars" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <FiStar key={i} className="star-icon" />
                ))}
              </div>
              <div className="muted reviews">({vendor.reviews} reviews)</div>
            </div>
          </div>

          <div className="vp-grid">
            <div className="grid-item">
              <div className="grid-title"><FiBriefcase className="ico" /> Services Offered</div>
              <div className="grid-body">{vendor.services.join(", ")}</div>
            </div>

            <div className="grid-item">
              <div className="grid-title"><FiClock className="ico" /> Avg. Response Time</div>
              <div className="grid-body">{vendor.avgResponse}</div>
            </div>

            <div className="grid-item">
              <div className="grid-title"><FiFileText className="ico" /> Typical Budget Range</div>
              <div className="grid-body">{vendor.budget}</div>
            </div>

            <div className="grid-item">
              <div className="grid-title"><FiFolder className="ico" /> Past Clients</div>
              <div className="clients">
                {vendor.pastClients.map((src, i) => (
                  <img key={i} src={src} alt={`client-${i}`} className="client-logo" />
                ))}
              </div>
            </div>

            <div className="grid-item">
              <div className="grid-title"><FiShield className="ico" /> Compliance Certifications</div>
              <div className="certs">
                {vendor.certifications.map((c) => (
                  <span key={c} className="cert">{c}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-white p-3 shadow-sm" style={{borderRadius: "12px"}}>
        <nav className="vp-tabs" role="tablist" aria-label="Profile sections">
          {["About", "Services", "Reviews", "Portfolio", "Contact"].map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={activeTab === t}
              className={`tab ${activeTab === t ? "active" : ""}`}
              onClick={() => setActiveTab(t)}
            >
              {t}
            </button>
          ))}
        </nav>

        <main className="vp-main">
          <div className="col left-col" role="tabpanel">
            <h3>About Us</h3>
            <p className="about-text">{vendor.about}</p>

            <ul className="highlights">
              {vendor.highlights.map((h, i) => (
                <li key={i}>
                  <FiFolder className="bullet-ico" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="col right-col">
            <h3>Core Services</h3>
            <div className="service-list">
              {vendor.coreServices.map((s) => (
                <div className="service-card" key={s.title}>
                  <div className="svc-title">{s.title}</div>
                  <div className="svc-desc">{s.desc}</div>
                </div>
              ))}
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
