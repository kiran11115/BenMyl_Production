import React, { useState, useMemo } from "react";
import { FiMoreVertical, FiChevronUp, FiChevronDown } from "react-icons/fi";
import { FaSort } from "react-icons/fa";

function TeamMembersTable() {
  const companyData = {
    id: "cmp_10231",
    slug: "nimbus-labs",
    name: "Nimbus Labs",
    tagline: "Design-led product studio for B2B teams",
    status: "Operating",
    companyType: "Privately Held",
    industry: "Software Development",
    size: "51–200 employees",
    foundedYear: "2016",
    websiteUrl: "https://nimbuslabs.com",
    domain: "nimbuslabs.com",
    headquarters: {
      city: "San Francisco",
      state: "CA",
      country: "US",
      postalCode: "94105",
      street1: "123 Market St",
      street2: "Suite 500",
    },
    description:
      "Nimbus Labs builds and improves B2B digital products with a focus on UX quality, speed-to-market, and maintainable UI systems.",
    contact: {
      email: "hello@nimbuslabs.com",
      phone: "+1 (555) 123-4567",
      linkedinUrl: "https://linkedin.com/company/nimbuslabs",
    },
    plan: {
      name: "Business",
      status: "Active",
      billingCycle: "Monthly",
      renewsOn: "2026-02-01",
      seats: 10,
      seatsUsed: 6,
    },
    teamMembers: [
      { username: "nimbus.owner", email: "owner@nimbuslabs.com", role: "Owner" },
      { username: "sarah.admin", email: "sarah@nimbuslabs.com", role: "Admin" },
      { username: "arun.member", email: "arun@nimbuslabs.com", role: "Member" },
    ],
  };

  // --- State (same pattern as RecentApplications) ---
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [selectedEmails, setSelectedEmails] = useState(new Set());

  // --- Helpers (avatar from username) ---
  const getInitials = (username) => {
    if (!username) return "";
    const parts = username.split(".");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return username.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (username) => {
    const colors = ["#3b82f6", "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f97316"];
    const safe = username || "";
    return colors[safe.length % colors.length];
  };

  // --- Sorting logic (same style as RecentApplications) ---
  const visibleMembers = useMemo(() => {
    const members = companyData.teamMembers || [];
    let sortableItems = [...members];

    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        const valA = (a[sortConfig.key] ?? "").toString().toLowerCase();
        const valB = (b[sortConfig.key] ?? "").toString().toLowerCase();
        if (valA < valB) return sortConfig.direction === "ascending" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }

    return sortableItems; // no slicing, small static list
  }, [companyData.teamMembers, sortConfig]);

  // --- Selection handler (same pattern) ---
  const handleSelectRow = (email) => {
    const next = new Set(selectedEmails);
    if (next.has(email)) next.delete(email);
    else next.add(email);
    setSelectedEmails(next);
  };

  // --- Sorting handler ---
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // --- Sort Icon component (copied pattern) ---
  const SortIcon = ({ columnKey }) => {
    const isActive = sortConfig.key === columnKey;
    const direction = sortConfig.direction;

    if (!isActive) {
      return <FaSort style={{ color: "#fefefe" }} className="tt-sort-icon" />;
    }
    return direction === "ascending" ? (
      <FiChevronUp className="tt-sort-icon active" />
    ) : (
      <FiChevronDown className="tt-sort-icon active" />
    );
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3 className="section-title m-0">Team members</h3>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {selectedEmails.size > 0 && (
            <span
              style={{
                fontSize: "12px",
                color: "#3b82f6",
                fontWeight: 600,
                backgroundColor: "#eff6ff",
                padding: "4px 8px",
                borderRadius: "4px",
              }}
            >
              {selectedEmails.size} Selected
            </span>
          )}
          <span style={{ fontSize: "12px", color: "#64748b" }}>
            Showing {visibleMembers.length} of {companyData.teamMembers?.length || 0}
          </span>
        </div>
      </div>

      <div className="tt-wrapper">
        <table className="tt-table">
          <thead>
            <tr className="tt-thead-tr">
              <th
                className="tt-th"
                style={{ paddingLeft: "24px", width: "40px" }}
              ></th>

              <th
                className="tt-th sortable"
                onClick={() => requestSort("username")}
              >
                <div className="tt-th-content">
                  Username <SortIcon columnKey="username" />
                </div>
              </th>

              <th
                className="tt-th sortable"
                onClick={() => requestSort("email")}
              >
                <div className="tt-th-content">
                  Email <SortIcon columnKey="email" />
                </div>
              </th>

              <th
                className="tt-th sortable"
                onClick={() => requestSort("role")}
              >
                <div className="tt-th-content">
                  Role <SortIcon columnKey="role" />
                </div>
              </th>


            </tr>
          </thead>

          <tbody>
            {visibleMembers.length ? (
              visibleMembers.map((m, i) => {
                const isSelected = selectedEmails.has(m.email);
                return (
                  <tr
                    key={m.email || i}
                    className="tt-row"
                    style={{
                      backgroundColor: isSelected
                        ? "rgb(241, 241, 241)"
                        : undefined,
                    }}
                  >
                    <td className="tt-td" style={{ paddingLeft: "24px" }}>
                      <input
                        type="checkbox"
                        className="row-checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(m.email)}
                      />
                    </td>

                    {/* Avatar + username + email block to mirror RecentApplications */}
                    <td className="tt-td">
                      <div className="tt-candidate-flex">
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            backgroundColor: getAvatarColor(m.username),
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "14px",
                            fontWeight: 600,
                            flexShrink: 0,
                          }}
                        >
                          {getInitials(m.username)}
                        </div>

                        <div className="tt-info-col">
                          <span className="tt-name">{m.username}</span>
                          <span className="tt-email">{m.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="tt-td">
                      <a href={`mailto:${m.email}`} className="tt-email">
                        {m.email}
                      </a>
                    </td>

                    <td className="tt-td">
                      <span className="tt-role">{m.role}</span>
                    </td>

                  </tr>
                );
              })
            ) : (
              <tr className="tt-row">
                <td
                  className="tt-td text-muted"
                  colSpan={5}
                  style={{ textAlign: "center", padding: "24px" }}
                >
                  No team members added.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default TeamMembersTable;
