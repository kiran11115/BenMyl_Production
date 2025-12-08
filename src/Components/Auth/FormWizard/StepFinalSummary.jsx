// StepFinalSummary.jsx
import React from "react";

const StepFinalSummary = ({
  formData,
  isMobile,
  buttonContainerStyle,
  backButtonStyle,
  continueButtonStyle,
  handleBack,
}) => {
  const sectionTitle = {
    fontSize: "14px",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "1rem",
  };

  const labelText = {
    fontSize: "12px",
    color: "#6b7280",
    marginBottom: "0.25rem",
    margin: 0,
  };

  const valueTextStrong = {
    fontSize: "14px",
    fontWeight: 600,
    color: "#292d34",
    margin: 0,
    wordBreak: "break-word",
  };

  const valueText = {
    fontSize: "14px",
    color: "#292d34",
    margin: 0,
  };

  const gridThree = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr",
    gap: "1rem",
  };

  const gridTwo = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
    gap: "1rem",
  };

  const cardStyle = {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: isMobile ? "1.5rem" : "2rem",
    marginBottom: "2rem",
  };

  const formTitleStyle = {
    fontSize: isMobile ? "20px" : "24px",
    fontWeight: 700,
    color: "#292d34",
    marginBottom: "0.5rem",
  };
  const formSubtitleStyle = {
    fontSize: isMobile ? "13px" : "14px",
    color: "#6b7280",
    marginBottom: isMobile ? "1.5rem" : "2rem",
  };

  return (
    <>
      <h2 style={formTitleStyle}>Final Summary</h2>
      <p style={formSubtitleStyle}>
        Review your information before completing setup.
      </p>

      <div style={cardStyle}>
        {/* Company information summary */}
        <div
          style={{
            paddingBottom: "1.5rem",
            marginBottom: "1.5rem",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <h3 style={sectionTitle}>Company Information</h3>

          <div style={gridThree}>
            {[
              ["Company Name", formData.CompanyName],
              ["Industry", formData.Industry],
              ["Total Employees", formData.TotalEmployees],
              ["Country", formData.Country],
              ["ZIP Code", formData.ZipCode],
              ["City", formData.City],
              ["State", formData.State],
              ["Region", formData.Region],
              ["Website", formData.Website],
              ["Organization", formData.Organization],
              ["Contact Phone", formData.ContactPhone],
              ["Contact Email", formData.ContactEmail],
              ["Contact Address 1", formData.Address1],
              ["Contact Address 2", formData.Address2],
              [
                "Multiple office locations",
                formData.hasBranches === "Yes"
                  ? `Yes – ${formData.Numberoflocations || 0} locations`
                  : "No",
              ],
              ["Employees in all locations", formData.Totalemployeesinalllocations],
            ].map(([label, value]) => (
              <div key={label}>
                <p style={labelText}>{label}</p>
                <p style={valueTextStrong}>{value || "-"}</p>
              </div>
            ))}
          </div>

          {formData.branchLocations &&
            formData.branchLocations.length > 0 &&
            formData.hasBranches === "Yes" && (
              <div style={{ marginTop: "1rem" }}>
                <p style={labelText}>Location names</p>
                <p style={valueText}>
                  {formData.branchLocations.join(", ")}
                </p>
              </div>
            )}

          <div style={{ marginTop: "1rem" }}>
            <p style={labelText}>Description</p>
            <p
              style={{
                ...valueText,
                whiteSpace: "pre-wrap",
              }}
            >
              {formData.CompanyDescription || "-"}
            </p>
          </div>
        </div>

        {/* Verification summary */}
        <div
          style={{
            paddingBottom: "1.5rem",
            marginBottom: "1.5rem",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <h3 style={sectionTitle}>Verification</h3>
          <div style={gridTwo}>
            <div>
              <p style={labelText}>Document Type</p>
              <p style={valueTextStrong}>
                {formData.verificationType || "-"}
              </p>
            </div>
            <div>
              <p style={labelText}>Document Number</p>
              <p style={valueTextStrong}>
                {formData.verificationId || "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Plan & Billing summary */}
        <div
          style={{
            paddingBottom: "1.5rem",
            marginBottom: "1.5rem",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <h3 style={sectionTitle}>Plan & Billing</h3>
          <div style={gridTwo}>
            <div>
              <p style={labelText}>Selected Plan</p>
              <p style={valueTextStrong}>{formData.plan || "-"}</p>
            </div>

            <div>
              <p style={labelText}>Card Holder</p>
              <p style={valueTextStrong}>
                {formData.CardHolderName || "-"}
              </p>
            </div>

            <div>
              <p style={labelText}>Card Number (masked)</p>
              <p style={valueTextStrong}>
                {formData.CardNumber
                  ? `•••• •••• •••• ${formData.CardNumber.slice(-4)}`
                  : "-"}
              </p>
            </div>

            <div>
              <p style={labelText}>Expiry</p>
              <p style={valueTextStrong}>
                {formData.ExpiryDate || "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Invited users summary */}
        <div>
          <h3 style={sectionTitle}>Invited Users</h3>
          {(!formData.users || formData.users.length === 0) && (
            <p
              style={{
                fontSize: "13px",
                color: "#6b7280",
                margin: 0,
              }}
            >
              No additional users added yet.
            </p>
          )}
          {formData.users && formData.users.length > 0 && (
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                fontSize: "13px",
                color: "#4b5563",
              }}
            >
              {formData.users.map((u, idx) => (
                <li
                  key={`${u.email}-${idx}`}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0.35rem 0",
                    borderBottom:
                      idx === formData.users.length - 1
                        ? "none"
                        : "1px dashed #e5e7eb",
                  }}
                >
                  <span>{u.email || "No email"}</span>
                  <span style={{ color: "#6b7280" }}>
                    {u.role || "-"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div style={buttonContainerStyle}>
        <button
          type="button"
          style={backButtonStyle}
          onClick={handleBack}
        >
          Back
        </button>
        <button type="submit" style={continueButtonStyle}>
          Complete Setup
        </button>
      </div>
    </>
  );
};

export default StepFinalSummary;
