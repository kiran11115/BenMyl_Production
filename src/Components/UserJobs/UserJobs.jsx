import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  FiSearch,
  FiMapPin,
  FiFilter,
  FiBriefcase,
  FiEye,
  FiClock,
  FiArrowUp,
} from "react-icons/fi";
import JobFilters from "../Filters/JobFilters";
import JobModal from "./JobModal";
import FilterBottomSheet from "../Common/FilterBottomSheet";
import "./Jobs.css";
import { useGetFindJobsMutation } from "../../State-Management/Api/ProjectApiSlice";
import NoData from "../UploadTalent/NoData";
import { useLocation } from "react-router-dom";

const PAGE_SIZE = 50;

const getCountryCodeFromLocation = (location = "") => {
  if (!location || location.toLowerCase().trim() === "remote") return "un";
  const loc = location.toLowerCase().trim();
  
  if (loc.includes("india")) return "in";
  if (loc.includes("united states") || loc.includes("usa") || loc.includes("u.s.") || loc.includes("us")) return "us";
  if (loc.includes("united kingdom") || loc.includes("uk") || loc.includes("u.k.") || loc.includes("gb") || loc.includes("england") || loc.includes("scotland") || loc.includes("wales")) return "gb";
  if (loc.includes("united arab emirates") || loc.includes("uae") || loc.includes("dubai") || loc.includes("abu dhabi") || loc.includes("emirates")) return "ae";
  
  const cityToCountry = {
    "visakhapatnam": "in", "vizag": "in", "mumbai": "in", "bombay": "in", "delhi": "in", "noida": "in", 
    "gurgaon": "in", "gurugram": "in", "bangalore": "in", "bengaluru": "in", "hyderabad": "in", 
    "chennai": "in", "madras": "in", "pune": "in", "kolkata": "in", "calcutta": "in", "ahmedabad": "in", 
    "jaipur": "in", "kochi": "in", "coimbatore": "in", "indore": "in", "bhubaneswar": "in",
    "new york": "us", "san francisco": "us", "dallas": "us", "austin": "us", "chicago": "us", 
    "seattle": "us", "boston": "us", "los angeles": "us", "atlanta": "us", "houston": "us", 
    "miami": "us", "denver": "us", "phoenix": "us", "philadelphia": "us",
    "london": "gb", "manchester": "gb", "birmingham": "gb", "edinburgh": "gb", "glasgow": "gb",
    "toronto": "ca", "vancouver": "ca", "montreal": "ca", "ottawa": "ca", "calgary": "ca",
    "sydney": "au", "melbourne": "au", "brisbane": "au", "perth": "au",
    "berlin": "de", "munich": "de", "frankfurt": "de", "hamburg": "de",
    "paris": "fr", "lyon": "fr",
    "dubai": "ae", "abu dhabi": "ae",
    "singapore": "sg"
  };

  for (const [city, code] of Object.entries(cityToCountry)) {
    if (loc.includes(city)) return code;
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

  for (const [countryName, code] of Object.entries(countryMap)) {
    if (loc.includes(countryName)) return code;
  }

  const parts = loc.split(",").map(s => s.trim());
  if (parts.length > 0) {
    const lastPart = parts[parts.length - 1];
    if (lastPart.length === 2) {
      const validCodes = new Set(Object.values(countryMap));
      validCodes.add("in");
      validCodes.add("us");
      validCodes.add("gb");
      validCodes.add("ae");
      if (validCodes.has(lastPart)) return lastPart;
    }
  }

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

const getInitials = (name = "") => {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
};

const UserJobs = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const companyId = localStorage.getItem("logincompanyid");
  const location = useLocation();
  const roleFromProfile = location.state?.role;
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const loadingRef = useRef(false);

  // Search state (matching Talent Profile functionality)
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceRef = useRef(null);

  // Debounce search query
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [searchQuery]);

  // pagination
  const [pageNumber, setPageNumber] = useState(1);
  const [allJobs, setAllJobs] = useState([]);

  // Refs to always hold latest values inside scroll/async callbacks
  const hasMoreRef = useRef(true);
  const pageNumberRef = useRef(1);

  // scroll container ref
  const resultsRef = useRef(null);

  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  const [getTalentJobs, { isLoading }] = useGetFindJobsMutation();

  // filters (unchanged)
  const [filters, setFilters] = useState({
    keyword: "",
    locationType: "Any Type",

    roles: roleFromProfile ? [roleFromProfile] : [],
    skills: [],
    availability: [],

    location: "",

    minExperience: "",
    maxExperience: "",

    minSalary: "",
    maxSalary: "",
  });


  // =========================
  // FETCH JOBS (pagination)
  // =========================
  const buildApiFilters = (filters) => {
    const apiFilters = [];

    // Job Title Search (Contains)
    if (debouncedSearch) {
      apiFilters.push({
        filterName: "Job Title",
        filterOperator: "Contains",
        filterValue: [debouncedSearch],
      });
    }

    // Job Title
    if (filters.roles?.length) {
      apiFilters.push({
        filterName: "Job Title",
        filterOperator: "Equals",
        filterValue: filters.roles,
      });
    }

    // Location (single input → array)
    if (filters.location?.trim()) {
      apiFilters.push({
        filterName: "Location",
        filterOperator: "Equals",
        filterValue: [filters.location.trim()],
      });
    }

    // Skills (multi-select)
    if (filters.skills?.length) {
      apiFilters.push({
        filterName: "skills",
        filterOperator: "Equals",
        filterValue: filters.skills.map(s => s.toLowerCase()),
      });
    }

    if (filters.minSalary && filters.maxSalary) {
      apiFilters.push({
        filterName: "Salary Range",
        filterOperator: "Equals",
        filterValue: [
          `${filters.minSalary} - ${filters.maxSalary}`
        ],
      });
    }

    // Years of Experience
    if (filters.minExperience && filters.maxExperience) {
      apiFilters.push({
        filterName: "Years of Experience",
        filterOperator: "Equals",
        filterValue: [
          `${filters.minExperience}- ${filters.maxExperience}`
        ],
      });
    }

    // Work Models (Job Type)
    if (filters.locationType && filters.locationType !== "Any Type") {
      const apiVal = filters.locationType === "On-Site" ? "On-site" : filters.locationType;
      apiFilters.push({
        filterName: "workModels",
        filterOperator: "string",
        filterValue: [apiVal],
      });
    }

    return apiFilters;
  };
  // initial + pagination fetch
  useEffect(() => {
    let isMounted = true;
    loadingRef.current = true;

    const fetchJobs = async () => {
      if (pageNumber > 1 && !hasMoreRef.current) {
        loadingRef.current = false;
        return;
      }

      let res = [];

      try {
        const payload = {
          ComponyID: Number(companyId),
          pageNumber,
          pageSize: PAGE_SIZE,
          filters: buildApiFilters(filters),
        };

        res = await getTalentJobs(payload).unwrap();

        if (!isMounted) return;

        if (!Array.isArray(res) || res.length === 0) {
          hasMoreRef.current = false;
          return;
        }

        setAllJobs(prev =>
          pageNumber === 1 ? res : [...prev, ...res]
        );

        if (res.length < PAGE_SIZE) {
          hasMoreRef.current = false;
        }
      } catch (err) {
        console.error("Fetch jobs failed:", err);
      } finally {
        if (isMounted) {
          loadingRef.current = false;
        }
      }

      // Auto-open logic
      const autoOpenJobId = location.state?.autoOpenJobId;
      if (autoOpenJobId && pageNumber === 1) {
        const jobToOpen = res.find(j => (j.jobID || j.id) === autoOpenJobId);
        if (jobToOpen) {
          // We need to map it to the UI format
          const mappedJob = {
            id: jobToOpen.jobID,
            title: jobToOpen.jobTitle,
            company: jobToOpen.companyName,
            location: jobToOpen.location,
            type: jobToOpen.employeeType,
            workModel: jobToOpen.workModels,
            department: jobToOpen.department,
            jobDuration: jobToOpen.jobDuration,
            userId: jobToOpen.userId,
            jobDurationText: jobToOpen.jobDuration ? `${jobToOpen.jobDuration} ${jobToOpen.jobDuration_Unit || "Months"}` : null,
            rateText: jobToOpen.salaryRange_Min && jobToOpen.salaryRange_Max
              ? `$${jobToOpen.salaryRange_Min}-${jobToOpen.salaryRange_Max}`
              : jobToOpen.salaryRange_Min
                ? `$${jobToOpen.salaryRange_Min}`
                : "N/A",
            experienceText: jobToOpen.experienceLevel,
            description: jobToOpen.jobDescription,
            additionalRequirements: jobToOpen.additionalRequirements,
            salaryType: (() => {
              const t = (jobToOpen.salarType || "").toLowerCase();
              if (t.includes("hour") || t.includes("/hr") || t === "hourly") return "/hr";
              if (t.includes("month")) return "/month";
              if (t.includes("budget") || t.includes("fixed") || t.includes("entire")) return "Budget";
              return "/hr";
            })(),
            educationLevel: jobToOpen.educationLevel,
            yearsOfExperience: jobToOpen.yearsOfExperience,
            skills: jobToOpen.requiredSkills
              ? jobToOpen.requiredSkills.split(",").map((s) => s.trim())
              : [],
            workAuthorization: [
              jobToOpen.isUSCitizen && "US Citizen",
              jobToOpen.isGC && "Green Card",
              jobToOpen.isH1B && "H1B",
              jobToOpen.isEAD && "EAD",
              jobToOpen.isOPT && "OPT",
              jobToOpen.isCPT && "CPT",
              jobToOpen.isH4 && "H4",
            ].filter(Boolean),
            preferredEmployment: [
              jobToOpen.isCorpToCorp && "Corp-Corp",
              jobToOpen.isW2Permanent && "W2-Permanent",
              jobToOpen.isW2Contract && "W2-Contract",
              jobToOpen.is1099Contract && "1099-Contract",
              jobToOpen.isContractToHire && "Contract to Hire",
            ].filter(Boolean),
          };
          setSelectedJob(mappedJob);
        }
      }
    };

    fetchJobs();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, filters, debouncedSearch]);

  const [showScrollTop, setShowScrollTop] = useState(false);

  // =========================
  // SCROLL HANDLER (same as TalentPool)
  // =========================
  useEffect(() => {
    const el = resultsRef.current;

    const handleWindowScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleWindowScroll);

    const onScroll = () => {
      if (el) {
        if (el.scrollTop > 300) {
          setShowScrollTop(true);
        } else {
          setShowScrollTop(false);
        }

        if (
          el.scrollTop + el.clientHeight >= el.scrollHeight - 50 &&
          hasMoreRef.current &&
          !loadingRef.current
        ) {
          loadingRef.current = true; // prevent duplicate increments
          setPageNumber(prev => {
            const next = prev + 1;
            pageNumberRef.current = next;
            return next;
          });
        }
      }
    };

    if (el) {
      el.addEventListener("scroll", onScroll);
    }

    return () => {
      window.removeEventListener("scroll", handleWindowScroll);
      if (el) el.removeEventListener("scroll", onScroll);
    };
  }, []);

  const scrollToTop = () => {
    if (resultsRef.current) {
      resultsRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // =========================
  // NORMALIZE API DATA → UI
  // =========================
  const jobs = useMemo(() => {
    return allJobs.map((job) => ({
      id: job.jobID,
      title: job.jobTitle,
      company: job.companyName,
      location: job.location,
      type: job.employeeType,
      workModel: job.workModels,
      department: job.department,
      jobDuration: job.jobDuration,
      userId: job.userId,
      jobDurationText: job.jobDuration ? `${job.jobDuration} ${job.jobDuration_Unit || "Months"}` : null,
      rateText:
        job.salaryRange_Min && job.salaryRange_Max
          ? `$${job.salaryRange_Min}-${job.salaryRange_Max}`
          : job.salaryRange_Min
            ? `$${job.salaryRange_Min}`
            : "N/A",
      experienceText: job.experienceLevel,
      description: job.jobDescription,
      additionalRequirements: job.additionalRequirements,
      salaryType: (() => {
        const t = (job.salarType || "").toLowerCase();
        if (t.includes("hour") || t.includes("/hr") || t === "hourly") return "/Hr";
        if (t.includes("month")) return "/Month";
        if (t.includes("budget") || t.includes("fixed") || t.includes("entire")) return "- Budget";
        return "/Hr"; // default
      })(),
      educationLevel: job.educationLevel,
      yearsOfExperience: job.yearsOfExperience,
      skills: job.requiredSkills
        ? job.requiredSkills.split(",").map((s) => s.trim())
        : [],
      workAuthorization: [
        job.isUSCitizen && "US Citizen",
        job.isGC && "Green Card",
        job.isH1B && "H1B",
        job.isEAD && "EAD",
        job.isOPT && "OPT",
        job.isCPT && "CPT",
        job.isH4 && "H4",
      ].filter(Boolean),
      postedOnText: formatPostedDate(job.createdOn || job.postedOn || job.createdDate || job.createdAt),
      isShortlisted: Boolean(job.isShortlisted || job.shortlisted),
      preferredEmployment: [
        job.isCorpToCorp && "Corp-Corp",
        job.isW2Permanent && "W2-Permanent",
        job.isW2Contract && "W2-Contract",
        job.is1099Contract && "1099-Contract",
        job.isContractToHire && "Contract to Hire",
      ].filter(Boolean),
    }));
  }, [allJobs]);

  // Client-side search filtering (fast visual refinement)
  const filteredJobs = useMemo(() => {
    if (!searchQuery.trim()) return jobs;
    const query = searchQuery.toLowerCase();
    return jobs.filter((job) =>
      job.title?.toLowerCase().includes(query) ||
      job.company?.toLowerCase().includes(query) ||
      job.location?.toLowerCase().includes(query) ||
      job.description?.toLowerCase().includes(query) ||
      job.type?.toLowerCase().includes(query) ||
      job.skills?.some((s) => s.toLowerCase().includes(query))
    );
  }, [jobs, searchQuery]);

  useEffect(() => {
    setAllJobs([]);
    setPageNumber(1);
    pageNumberRef.current = 1;
    hasMoreRef.current = true;
    setMinTimeElapsed(false);
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [filters, debouncedSearch]);




  return (
    <div className="user-jobs-page-wrapper">
      <div className="user-jobs-main-content">
        {/* LEFT FILTER */}
        <aside className="vs-filters-sidebar">
          <JobFilters
            initialFilters={filters}
            onApplyFilters={(appliedFilters) => {
              setAllJobs([]);
              setPageNumber(1);
              setFilters(appliedFilters);
            }}
          />
        </aside>

        <FilterBottomSheet
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
          title="Filters"
        >
          <JobFilters
            initialFilters={filters}
            onApplyFilters={(appliedFilters) => {
              setAllJobs([]);
              setPageNumber(1);
              setFilters(appliedFilters);
              setIsMobileFilterOpen(false);
            }}
          />
        </FilterBottomSheet>

        {/* RIGHT */}
        <div className="user-jobs-right-section">
          {/* TOP */}
          <div className="hero-section-wrapper mb-4">
        <div className="hero-card ">
          <div className="hero-concentric-lines"></div>
          <div className="hero-ripple-pattern"></div>
          <div className="hero-circular-highlights"></div>
            <div className="hero-left">
              <div className="hero-pill">
                ✦ Find jobs
              </div>
              <h1 className="job-posting-title text-white">Jobs & Openings Board</h1>
              <div className="job-posting-header-info">
                <p className="job-posting-subtitle">
                  Showing {filteredJobs.length} matches based on your interactive filters
                </p>
              </div>
            </div>

            <div className="hero-card-actions-wrapper">
              <button
                className="filters-applied"
                onClick={() => setIsMobileFilterOpen(true)}
              >
                <FiFilter /> Filters
              </button>

              <div className="user-jobs-search-wrapper">
                <FiSearch className="user-jobs-search-icon" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="jobs-search-input"
                />
              </div>
            </div>
                    <div className="hero-illustration">
            <div className="hero-particles">
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
            </div>
            <img src="/Images/jobs.png" alt="Dashboard Illustration" className="hero-svg-image" />
          </div>
        </div>
      </div>

          {/* GRID */}
          <div
            ref={resultsRef}
            className="user-jobs-results-container"
          >
            {(isLoading || !minTimeElapsed) && allJobs.length === 0 ? (
              <div className="jobs-screen-loader">
                <div className="jobs-loader-ring">
                  <div className="jobs-loader-icon">
                    <FiBriefcase size={18} />
                  </div>
                </div>
                <p className="jobs-loader-text">Searching for job opportunities...</p>
                <span className="jobs-loader-sub">Matching roles based on your filters</span>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="user-jobs-empty-state-wrapper">
                <NoData text={searchQuery ? "No jobs matching your search" : "No jobs found"} />
              </div>
            ) : (
              <div className="user-jobs-grid-layout">
                {filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => setSelectedJob(job)}
                    className="job-card"
                  >
                    {/* TOP */}
                    <div className="job-card-header">
                      <div className="job-header-left">
                        <div className="job-company-logo">
                          <FiBriefcase color="#ffffff" size={20} />
                        </div>

                        <div className="job-header-info">
                          <h3 className="job-title" title={job.title}>{job.title}</h3>
                          <div className="job-meta-row">
                            {job.jobDurationText && (
                              <div className="job-meta-item">
                                <FiClock size={12} className="meta-icon" />
                                <span>{job.jobDurationText}</span>
                              </div>
                            )}
                            {job.location && (
                              <div className="job-meta-item">
                                <FiMapPin size={12} className="meta-icon" />
                                <span title={job.location}>
                                  {getCountryCodeFromLocation(job.location) && getCountryCodeFromLocation(job.location) !== "un" && (
                                    <img 
                                      src={`https://flagcdn.com/w20/${getCountryCodeFromLocation(job.location)}.png`}
                                      srcSet={`https://flagcdn.com/w40/${getCountryCodeFromLocation(job.location)}.png 2x`}
                                      width="18"
                                      alt="Flag"
                                      style={{ marginRight: '5px', verticalAlign: 'middle', borderRadius: '2px', display: 'inline-block' }}
                                    />
                                  )}
                                  {job.location ? job.location.split(',')[0].trim() : ""}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {job.isShortlisted && (
                        <div className="job-chip mint">
                          SHORTLISTED
                        </div>
                      )}
                    </div>

                    {/* DESC */}
                    <p className="job-description">
                      {[
                        job.company && `${job.company}`,
                        job.preferredEmployment?.length > 0 && `Employment Type: ${job.preferredEmployment.join(", ")}`,
                        job.workModel && `${job.workModel}`,
                        job.description?.replace(/\*\*/g, "")
                      ].filter(Boolean).join(" | ")}
                    </p>

                    {/* FOOTER */}
                    <div className="job-card-footer">
                      <div className="job-rate-block">
                        <div className="job-rate">
                          {job.rateText}
                          <span className="job-rate-unit">
                            {job.salaryType}
                          </span>
                        </div>
                        {job.postedOnText && job.postedOnText !== "N/A" && (
                          <>
                            <span className="job-rate-divider">•</span>
                            <span className="job-posted-on">
                              Posted {job.postedOnText}
                            </span>
                          </>
                        )}
                      </div>

                      <button
                        className="job-card-view-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedJob(job);
                        }}
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedJob && (
        <JobModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          initialSelectedTalentId={
            location.state?.initialSelectedTalentId
          }
        />
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

export default UserJobs;
