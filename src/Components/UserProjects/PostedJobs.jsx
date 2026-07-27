import React, { useMemo, useState, useEffect } from "react";
import { FiClock, FiMapPin, FiBriefcase, FiUsers, FiCalendar, FiArrowUp } from "react-icons/fi";
import { BsBuilding } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useGetGroupedJobTitlesQuery } from "../../State-Management/Api/TalentPoolApiSlice";
import { useGetJobBidsQuery } from "../../State-Management/Api/ProjectApiSlice";
import NoData from "../UploadTalent/NoData";
import "../UserJobs/Jobs.css";

const getInitials = (name = "") => {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
};

const getCountryCodeFromLocation = (location = "") => {
  if (!location || location.toLowerCase().trim() === "remote") return "un";
  const loc = location.toLowerCase().trim();
  
  // Standard overrides & common combinations
  if (loc.includes("india")) return "in";
  if (loc.includes("united states") || loc.includes("usa") || loc.includes("u.s.") || loc.includes("us")) return "us";
  if (loc.includes("united kingdom") || loc.includes("uk") || loc.includes("u.k.") || loc.includes("gb") || loc.includes("england") || loc.includes("scotland") || loc.includes("wales")) return "gb";
  if (loc.includes("united arab emirates") || loc.includes("uae") || loc.includes("dubai") || loc.includes("abu dhabi") || loc.includes("emirates")) return "ae";
  
  // Common cities lookup mapping
  const cityToCountry = {
    // India
    "visakhapatnam": "in", "vizag": "in", "mumbai": "in", "bombay": "in", "delhi": "in", "noida": "in", 
    "gurgaon": "in", "gurugram": "in", "bangalore": "in", "bengaluru": "in", "hyderabad": "in", 
    "chennai": "in", "madras": "in", "pune": "in", "kolkata": "in", "calcutta": "in", "ahmedabad": "in", 
    "jaipur": "in", "kochi": "in", "coimbatore": "in", "indore": "in", "bhubaneswar": "in",
    // USA
    "new york": "us", "san francisco": "us", "dallas": "us", "austin": "us", "chicago": "us", 
    "seattle": "us", "boston": "us", "los angeles": "us", "atlanta": "us", "houston": "us", 
    "miami": "us", "denver": "us", "phoenix": "us", "philadelphia": "us",
    // UK
    "london": "gb", "manchester": "gb", "birmingham": "gb", "edinburgh": "gb", "glasgow": "gb",
    // Canada
    "toronto": "ca", "vancouver": "ca", "montreal": "ca", "ottawa": "ca", "calgary": "ca",
    // Australia
    "sydney": "au", "melbourne": "au", "brisbane": "au", "perth": "au",
    // Germany
    "berlin": "de", "munich": "de", "frankfurt": "de", "hamburg": "de",
    // France
    "paris": "fr", "lyon": "fr",
    // UAE
    "dubai": "ae", "abu dhabi": "ae",
    // Singapore
    "singapore": "sg"
  };

  for (const [city, code] of Object.entries(cityToCountry)) {
    if (loc.includes(city)) {
      return code;
    }
  }
  
  const countryMap = {
    "afghanistan": "af", "albania": "al", "algeria": "dz", "andorra": "ad", "angola": "ao", "antigua": "ag",
    "argentina": "ar", "armenia": "am", "australia": "au", "austria": "at", "azerbaijan": "az", "bahamas": "bs",
    "bahrain": "bh", "bangladesh": "bd", "barbados": "bb", "belarus": "by", "belgium": "be", "belize": "bz",
    "benin": "bj", "bhutan": "bt", "bolivia": "bo", "bosnia": "ba", "botswana": "bw", "brazil": "br",
    "brunei": "bn", "bulgaria": "bg", "burkina faso": "bf", "burundi": "bi", "cambodia": "kh", "cameroon": "cm",
    "canada": "ca", "cape verde": "cv", "central african republic": "cf", "chad": "td", "chile": "cl",
    "china": "cn", "colombia": "co", "comoros": "km", "congo": "cg", "costa rica": "cr", "croatia": "hr",
    "cuba": "cu", "cyprus": "cy", "czech republic": "cz", "denmark": "dk", "djibouti": "dj", "dominica": "dm",
    "dominican republic": "do", "ecuador": "ec", "egypt": "eg", "el salvador": "sv", "equatorial guinea": "gq",
    "eritrea": "er", "estonia": "ee", "eswatini": "sz", "ethiopia": "et", "fiji": "fj", "finland": "fi",
    "france": "fr", "gabon": "ga", "gambia": "gm", "georgia": "ge", "germany": "de", "ghana": "gh",
    "greece": "gr", "grenada": "gd", "guatemala": "gt", "guinea": "gn", "guinea-bissau": "gw", "guyana": "gy",
    "haiti": "ht", "honduras": "hn", "hungary": "hu", "iceland": "is", "indonesia": "id", "iran": "ir",
    "iraq": "iq", "ireland": "ie", "israel": "il", "italy": "it", "jamaica": "jm", "japan": "jp",
    "jordan": "jo", "kazakhstan": "kz", "kenya": "ke", "kiribati": "ki", "korea": "kr", "kuwait": "kw",
    "kyrgyzstan": "kg", "laos": "la", "latvia": "lv", "lebanon": "lb", "lesotho": "ls", "liberia": "lr",
    "libya": "ly", "liechtenstein": "li", "lithuania": "lt", "luxembourg": "lu", "madagascar": "mg",
    "malawi": "mw", "malaysia": "my", "maldives": "mv", "mali": "ml", "malta": "mt", "marshall islands": "mh",
    "mauritania": "mr", "mauritius": "mu", "mexico": "mx", "micronesia": "fm", "moldova": "md", "monaco": "mc",
    "mongolia": "mn", "montenegro": "me", "morocco": "ma", "mozambique": "mz", "myanmar": "mm", "namibia": "na",
    "nauru": "nr", "nepal": "np", "netherlands": "nl", "new zealand": "nz", "nicaragua": "ni", "niger": "ne",
    "nigeria": "ng", "north macedonia": "mk", "norway": "no", "oman": "om", "pakistan": "pk", "palau": "pw",
    "palestine": "ps", "panama": "pa", "papua new guinea": "pg", "paraguay": "py", "peru": "pe",
    "philippines": "ph", "poland": "pl", "portugal": "pt", "qatar": "qa", "romania": "ro", "russia": "ru",
    "rwanda": "rw", "saint kitts": "kn", "saint lucia": "lc", "saint vincent": "vc", "samoa": "ws",
    "san marino": "sm", "sao tome": "st", "saudi arabia": "sa", "senegal": "sn", "serbia": "rs",
    "seychelles": "sc", "sierra leone": "sl", "singapore": "sg", "slovakia": "sk", "slovenia": "si",
    "solomon islands": "sb", "somalia": "so", "south africa": "za", "south sudan": "ss", "spain": "es",
    "sri lanka": "lk", "sudan": "sd", "suriname": "sr", "sweden": "se", "switzerland": "ch", "syria": "sy",
    "taiwan": "tw", "tajikistan": "tj", "tanzania": "tz", "thailand": "th", "timor-leste": "tl", "togo": "tg",
    "tonga": "to", "trinidad": "tt", "tunisia": "tn", "turkey": "tr", "turkmenistan": "tm", "tuvalu": "tv",
    "uganda": "ug", "ukraine": "ua", "uruguay": "uy", "uzbekistan": "uz", "vanuatu": "vu", "vatican": "va",
    "venezuela": "ve", "vietnam": "vn", "yemen": "ye", "zambia": "zm", "zimbabwe": "zw"
  };

  // Find country by searching matching name in the text
  for (const [countryName, code] of Object.entries(countryMap)) {
    if (loc.includes(countryName)) {
      return code;
    }
  }

  const parts = loc.split(",").map(s => s.trim());
  
  // If the last part is a 2-letter code, check if it's a valid code
  if (parts.length > 0) {
    const lastPart = parts[parts.length - 1];
    if (lastPart.length === 2) {
      const validCodes = new Set(Object.values(countryMap));
      // Add standard overrides in set
      validCodes.add("in");
      validCodes.add("us");
      validCodes.add("gb");
      validCodes.add("ae");
      if (validCodes.has(lastPart)) {
        return lastPart;
      }
    }
  }

  // Fallback check for US state codes
  const usStates = ["al", "ak", "az", "ar", "ca", "co", "ct", "de", "fl", "ga", "hi", "id", "il", "in", "ia", "ks", "ky", "la", "me", "md", "ma", "mi", "mn", "ms", "mo", "mt", "ne", "nv", "nh", "nj", "nm", "ny", "nc", "nd", "oh", "ok", "or", "pa", "ri", "sc", "sd", "tn", "tx", "ut", "vt", "va", "wa", "wv", "wi", "wy"];
  if (parts.length > 1) {
    const lastPart = parts[parts.length - 1];
    if (usStates.includes(lastPart)) return "us";
  }
  return "un";
};

const formatPostedDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date)) return dateString;
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const JobCardItem = ({ job, navigate }) => {
  const { data: bids = [] } = useGetJobBidsQuery(job.id, {
    skip: !job.id,
    refetchOnMountOrArgChange: true,
  });

  const pendingBidsCount = bids.filter((bid) => bid.IsShortlisted === false).length;
  const totalBidsCount = bids.length;
  const allShortlisted = totalBidsCount > 0 && pendingBidsCount === 0;

  return (
    <div
      className="job-card justify-content-between"
      style={{ position: 'relative', cursor: 'default' }}
    >
      <div className="d-flex flex-column gap-3">
        {/* TOP */}
        <div className="job-card-header">
          <div className="job-header-left">
            <div className="job-company-logo">
              {getInitials(job.company) || <BsBuilding size={20} />}
            </div>

            <div className="job-header-info">
              <h3 className="job-title" title={job.title}>{job.title}</h3>
              
              {/* METADATA (DURATION & LOCATION SIDE BY SIDE) BELOW ROLE */}
              <div className="job-meta-row">
                <div className="job-meta-item">
                  <FiClock size={12} className="meta-icon" />
                  <span>{job.duration || "Ongoing"}</span>
                </div>
                <div className="job-meta-item">
                  <FiMapPin size={12} className="meta-icon" />
                  <span title={job.location}>
                    {getCountryCodeFromLocation(job.location) && (
                      <img 
                        src={`https://flagcdn.com/w20/${getCountryCodeFromLocation(job.location)}.png`}
                        srcSet={`https://flagcdn.com/w40/${getCountryCodeFromLocation(job.location)}.png 2x`}
                        width="20"
                        alt="Flag"
                        style={{ marginRight: '6px', verticalAlign: 'middle', borderRadius: '2px', display: 'inline-block' }}
                      />
                    )}
                    {job.location ? job.location.split(',')[0].trim() : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {pendingBidsCount > 0 && (
              <div
                className="job-chip orange"
                title="Pending Recruiter Bids"
              >
                <FiUsers size={14} />
                {pendingBidsCount} {pendingBidsCount === 1 }
              </div>
            )}
            {allShortlisted && (
              <div
                className="job-chip green"
                title="All Candidates Shortlisted"
              >
                Shortlisted
              </div>
            )}
          </div>
        </div>

        {/* DESC */}
        <div className="job-desc-block">
          <p className="job-description">
            {job.description?.replace(/\*\*/g, "")}
          </p>
        </div>

      </div>

      <div>
        {/* FOOTER */}
        <div className="job-card-footer">
          <div className="job-rate-block">
            <div className="job-rate">
              {job.rateText}
              <span className="job-rate-unit">
                {job.budgetLabel}
              </span>
            </div>
            <span className="job-rate-divider">•</span>
            <span className="job-posted-on">
              Posted {job.postedOnText}
            </span>
          </div>

          <button
            className="job-card-view-btn"
            onClick={(e) => {
              e.stopPropagation();
              const basePath = window.location.pathname.toLowerCase().startsWith('/admin') ? '/Admin' : '/user';
              navigate(`${basePath}/job-overview`, { state: { jobId: job.id } });
            }}
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};

const PostedJobs = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("CompanyId");

  const { data: apiJobs = [], isLoading } = useGetGroupedJobTitlesQuery(userId);

  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const jobs = useMemo(() => {
    return apiJobs.map((job) => ({
      id: job.jobID,
      title: job.jobTitle,
      company: job.companyName,
      location: job.location,
      type: job.employeeType,
      workModels: job.workModels,
      salaryType: job.salarType,
      rateText:
        job.salaryRange_Min && job.salaryRange_Max
          ? `$${job.salaryRange_Min}-${job.salaryRange_Max}`
          : job.salaryRange_Min
            ? `$${job.salaryRange_Min}`
            : "N/A",
      budgetLabel: (() => {
        const t = (job.salarType || "").toLowerCase();
        if (t.includes("hour") || t.includes("/hr") || t === "hourly") return "/hr";
        if (t.includes("month")) return "/month";
        if (t.includes("budget") || t.includes("fixed") || t.includes("entire")) return "Budget";
        return "/hr"; // default
      })(),
      experienceLevel: job.experienceLevel,
      description: job.jobDescription || "",
      skills: job.requiredSkills
        ? job.requiredSkills.split(",").map((s) => s.trim())
        : [],
      duration: (() => {
        if (!job.jobDuration) return "Ongoing";
        if (job.jobDuration === "0" || job.jobDuration === 0) return "Ongoing";
        const unit = job.jobDuration_Unit || (job.jobDuration === "1" || job.jobDuration === 1 ? "Month" : "Months");
        return `${job.jobDuration} ${unit}`;
      })(),
      postedOnText: formatPostedDate(job.createdOn || job.postedDate),
    }));
  }, [apiJobs]);

  if (isLoading || !minTimeElapsed) {
    return (
      <div className="posted-jobs-loader">
        <div className="jobs-loader-ring">
          <div className="jobs-loader-icon">
            <FiBriefcase size={18} />
          </div>
        </div>
        <p className="jobs-loader-text">Loading posted positions...</p>
        <span className="jobs-loader-sub">Fetching your active job listings</span>
      </div>
    );
  }

  return (
    <div className="jobs-wrapper">
      {jobs.length === 0 ? (
        <NoData text="No posted jobs available yet." />
      ) : (
        <div className="jobs-grid posted-jobs-grid">
          {jobs.map((job) => (
            <JobCardItem key={job.id} job={job} navigate={navigate} />
          ))}
        </div>
      )}

      {showScrollTop && (
        <button
          className="talent-scroll-top-btn"
          onClick={scrollToTop}
          title="Scroll to top"
        >
          <FiArrowUp size={18} />
        </button>
      )}
    </div>
  );
};

export default PostedJobs;
