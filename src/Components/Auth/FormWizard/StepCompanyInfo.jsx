// StepCompanyInfo.jsx
import React from "react";

const StepCompanyInfo = ({
  formik,
  isMobile,
  isZipLoading,
  logoPreview,
  logoFileName,
  setLogoFileName,
  setLogoPreview,
  fetchCityStateFromZip,
  handleBack,
  buttonContainerStyle,
  backButtonStyle,
  continueButtonStyle,
  Upload,
  isVerifying,
  verificationStatus,
  handleVerifyDocument,
}) => {
  const inputStyle = {
    width: "100%",
    padding: "0.65rem 0.75rem",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: isMobile ? "13px" : "14px",
    outline: "none",
    transition: "all 0.2s",
  };
  const textAreaStyle = {
    ...inputStyle,
    minHeight: "90px",
    resize: "vertical",
  };
  const selectStyle = {
    ...inputStyle,
    appearance: "none",
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 9L1 4h10z'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 0.75rem center",
    paddingRight: "2.5rem",
  };
  const labelStyle = {
    display: "block",
    fontSize: isMobile ? "13px" : "14px",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "0.5rem",
  };
  const formGroupStyle = {
    marginBottom: "1.25rem",
  };
  const errorTextStyle = {
    fontSize: isMobile ? "12px" : "13px",
    color: "#dc2626",
    marginTop: "0.25rem",
  };
  const gridTwoColWrapper = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
    gap: "1rem",
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
      <h2 style={formTitleStyle}>Company Info</h2>
      <p style={formSubtitleStyle}>
        Tell us about your company, contact details, and verification
        information.
      </p>

      {/* Row 1: Company Name + Industry */}
      <div style={gridTwoColWrapper}>
        <div style={formGroupStyle}>
          <label htmlFor="CompanyName" style={labelStyle}>
            Company Name
          </label>
          <input
            type="text"
            id="CompanyName"
            name="CompanyName"
            placeholder="Enter organization name"
            style={inputStyle}
            value={formik.values.CompanyName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.CompanyName && formik.errors.CompanyName && (
            <div style={errorTextStyle}>{formik.errors.CompanyName}</div>
          )}
        </div>

        <div style={formGroupStyle}>
          <label htmlFor="Industry" style={labelStyle}>
            Industry
          </label>
          <input
            type="text"
            id="Industry"
            name="Industry"
            placeholder="Enter your industry (e.g., IT services, Healthcare)"
            style={inputStyle}
            value={formik.values.Industry}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.Industry && formik.errors.Industry && (
            <div style={errorTextStyle}>{formik.errors.Industry}</div>
          )}
        </div>
      </div>

      {/* Row 1b: Website + Organization type */}
      <div style={gridTwoColWrapper}>
        <div style={formGroupStyle}>
          <label htmlFor="Website" style={labelStyle}>
            Website
          </label>
          <input
            type="text"
            id="Website"
            name="Website"
            placeholder="https://example.com"
            style={inputStyle}
            value={formik.values.Website}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.Website && formik.errors.Website && (
            <div style={errorTextStyle}>{formik.errors.Website}</div>
          )}
        </div>

        <div style={formGroupStyle}>
          <label htmlFor="Organization" style={labelStyle}>
            Organization type
          </label>
          <select
            id="Organization"
            name="Organization"
            style={selectStyle}
            value={formik.values.Organization}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="">Select type</option>
            <option value="Public company">Public company</option>
            <option value="Self-employed">Self-employed</option>
            <option value="Government agency">Government agency</option>
            <option value="Nonprofit">Nonprofit</option>
            <option value="Sole proprietorship">Sole proprietorship</option>
            <option value="Privately held">Privately held</option>
            <option value="Partnership">Partnership</option>
          </select>
          {formik.touched.Organization &&
            formik.errors.Organization && (
              <div style={errorTextStyle}>
                {formik.errors.Organization}
              </div>
            )}
        </div>
      </div>

      {/* Row 2: Employees + Country */}
      <div style={gridTwoColWrapper}>
        <div style={formGroupStyle}>
          <label htmlFor="TotalEmployees" style={labelStyle}>
            Total Employees
          </label>
          <select
            id="TotalEmployees"
            name="TotalEmployees"
            style={selectStyle}
            value={formik.values.TotalEmployees}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="">Select size</option>
            <option value="0–1 employees">0–1 employees</option>
            <option value="2–10 employees">2–10 employees</option>
            <option value="11–50 employees">11–50 employees</option>
            <option value="51–200 employees">51–200 employees</option>
            <option value="201–500 employees">201–500 employees</option>
            <option value="501–1,000 employees">501–1,000 employees</option>
            <option value="1,001–5,000 employees">
              1,001–5,000 employees
            </option>
            <option value="5,001–10,000 employees">
              5,001–10,000 employees
            </option>
            <option value="10,000+ employees">10,000+ employees</option>
          </select>
          {formik.touched.TotalEmployees &&
            formik.errors.TotalEmployees && (
              <div style={errorTextStyle}>
                {formik.errors.TotalEmployees}
              </div>
            )}
        </div>

        <div style={formGroupStyle}>
          <label htmlFor="Country" style={labelStyle}>
            Country
          </label>
          <select
            id="Country"
            name="Country"
            style={selectStyle}
            value={formik.values.Country}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="">Select country</option>
            <option value="United States">United States</option>
            <option value="India">India</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
          </select>
          {formik.touched.Country && formik.errors.Country && (
            <div style={errorTextStyle}>{formik.errors.Country}</div>
          )}
        </div>
      </div>

      {/* Row 2b: Contact number + Email */}
      <div style={gridTwoColWrapper}>
        <div style={formGroupStyle}>
          <label htmlFor="ContactPhone" style={labelStyle}>
            Contact number
          </label>
          <input
            type="text"
            id="ContactPhone"
            name="ContactPhone"
            placeholder="+1 555 000 0000"
            style={inputStyle}
            value={formik.values.ContactPhone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.ContactPhone && formik.errors.ContactPhone && (
            <div style={errorTextStyle}>{formik.errors.ContactPhone}</div>
          )}
        </div>

        <div style={formGroupStyle}>
          <label htmlFor="ContactEmail" style={labelStyle}>
            Email ID
          </label>
          <input
            type="email"
            id="ContactEmail"
            name="ContactEmail"
            placeholder="contact@company.com"
            style={inputStyle}
            value={formik.values.ContactEmail}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.ContactEmail && formik.errors.ContactEmail && (
            <div style={errorTextStyle}>{formik.errors.ContactEmail}</div>
          )}
        </div>
      </div>

      {/* Row 3: ZIP + City */}
      <div style={gridTwoColWrapper}>
        <div style={formGroupStyle}>
          <label htmlFor="ZipCode" style={labelStyle}>
            ZIP Code
          </label>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              id="ZipCode"
              name="ZipCode"
              placeholder="Enter your zip code here"
              maxLength={6}
              style={inputStyle}
              value={formik.values.ZipCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                formik.setFieldValue("ZipCode", value);
                if (value.length === 6) {
                  fetchCityStateFromZip(value, formik);
                }
              }}
              onBlur={formik.handleBlur}
            />
            {isZipLoading && (
              <div
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    border: "2px solid #e5e7eb",
                    borderTop: "2px solid #2744a0",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                />
              </div>
            )}
          </div>
          {formik.touched.ZipCode && formik.errors.ZipCode && (
            <div style={errorTextStyle}>{formik.errors.ZipCode}</div>
          )}
        </div>

        <div style={formGroupStyle}>
          <label htmlFor="City" style={labelStyle}>
            City
          </label>
          <input
            type="text"
            id="City"
            name="City"
            placeholder="Enter your city name here"
            style={inputStyle}
            value={formik.values.City}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.City && formik.errors.City && (
            <div style={errorTextStyle}>{formik.errors.City}</div>
          )}
        </div>
      </div>

      {/* Row 4: State + Region */}
      <div style={gridTwoColWrapper}>
        <div style={formGroupStyle}>
          <label htmlFor="State" style={labelStyle}>
            State
          </label>
          <input
            type="text"
            id="State"
            name="State"
            placeholder="Enter your state name here"
            maxLength={2}
            style={inputStyle}
            value={formik.values.State}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.State && formik.errors.State && (
            <div style={errorTextStyle}>{formik.errors.State}</div>
          )}
        </div>

        <div style={formGroupStyle}>
          <label htmlFor="Region" style={labelStyle}>
            Region
          </label>
          <input
            type="text"
            id="Region"
            name="Region"
            placeholder="Enter your region name here"
            style={inputStyle}
            value={formik.values.Region}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.Region && formik.errors.Region && (
            <div style={errorTextStyle}>{formik.errors.Region}</div>
          )}
        </div>
      </div>

      {/* Row 4b: Contact addresses */}
      <div style={gridTwoColWrapper}>
        <div style={formGroupStyle}>
          <label htmlFor="Address1" style={labelStyle}>
            Contact address 1
          </label>
          <input
            type="text"
            id="Address1"
            name="Address1"
            placeholder="Primary office address"
            style={inputStyle}
            value={formik.values.Address1}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.Address1 &&
            formik.errors.Address1 && (
              <div style={errorTextStyle}>
                {formik.errors.Address1}
              </div>
            )}
        </div>

        <div style={formGroupStyle}>
          <label htmlFor="Address2" style={labelStyle}>
            Contact address 2
          </label>
          <input
            type="text"
            id="Address2"
            name="Address2"
            placeholder="Additional address (optional)"
            style={inputStyle}
            value={formik.values.Address2}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.Address2 &&
            formik.errors.Address2 && (
              <div style={errorTextStyle}>
                {formik.errors.Address2}
              </div>
            )}
        </div>
      </div>

      {/* Row 5: Integration + Logo Upload */}
      <div style={gridTwoColWrapper}>
        <div style={formGroupStyle}>
          <label htmlFor="Integration" style={labelStyle}>
            Integration System (Optional)
          </label>
          <select
            id="Integration"
            name="Integration"
            style={selectStyle}
            value={formik.values.Integration}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="None">None</option>
            <option value="SSO">SSO</option>
            <option value="AD">Active Directory</option>
            <option value="HRMS">HRMS</option>
          </select>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Company Logo</label>
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "flex-start" : "center",
              gap: "0.75rem",
            }}
          >
            <input
              type="file"
              id="companyLogo"
              name="companyLogo"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  formik.setFieldValue("companyLogo", file);
                  setLogoFileName(file.name);
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setLogoPreview(reader.result);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            <button
              type="button"
              onClick={() => document.getElementById("companyLogo")?.click()}
              style={{
                ...continueButtonStyle,
                backgroundColor: "#f3f4ff",
                color: "#2744a0",
                border: "1px solid #c7d2fe",
                padding: "0.6rem 1rem",
              }}
            >
              <Upload size={16} />
              <span>Upload logo</span>
            </button>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                }}
              >
                PNG, JPG or SVG. Max 2 MB.
              </span>
              {logoFileName && (
                <span
                  style={{
                    fontSize: "12px",
                    color: "#4b5563",
                  }}
                >
                  Selected: {logoFileName}
                </span>
              )}
            </div>
          </div>
          {logoPreview && (
            <div
              style={{
                marginTop: "0.75rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <img
                src={logoPreview}
                alt="Logo Preview"
                style={{
                  width: "64px",
                  height: "64px",
                  objectFit: "contain",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  backgroundColor: "#f9fafb",
                }}
              />
              <span
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                }}
              >
                Preview of your organization logo
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Company Description */}
      <div style={formGroupStyle}>
        <label htmlFor="CompanyDescription" style={labelStyle}>
          Company Description
        </label>
        <textarea
          id="CompanyDescription"
          name="CompanyDescription"
          placeholder="Briefly describe your organization, what it does and key details."
          style={textAreaStyle}
          value={formik.values.CompanyDescription}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.CompanyDescription &&
          formik.errors.CompanyDescription && (
            <div style={errorTextStyle}>
              {formik.errors.CompanyDescription}
            </div>
          )}
      </div>

      {/* Locations */}
      <div
        style={{
          marginTop: "1.75rem",
          marginBottom: "0.5rem",
          padding: "1.25rem 1.25rem 1rem",
          borderRadius: "10px",
          border: "1px solid #e5e7eb",
          backgroundColor: "#f9fafb",
        }}
      >
        <h3
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "#374151",
            margin: 0,
            marginBottom: "0.75rem",
          }}
        >
          Locations
        </h3>

        <div style={{ marginBottom: "1rem" }}>
          <span
            style={{
              ...labelStyle,
              marginBottom: "0.35rem",
              display: "block",
            }}
          >
            Multiple office locations?
          </span>
          <div
            style={{
              display: "flex",
              gap: "1.5rem",
              alignItems: "center",
              fontSize: "13px",
              color: "#374151",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                margin: 0,
              }}
            >
              <input
                type="radio"
                name="hasBranches"
                value="No"
                checked={formik.values.hasBranches === "No"}
                onChange={() => formik.setFieldValue("hasBranches", "No")}
              />
              <span>Single office</span>
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                margin: 0,
              }}
            >
              <input
                type="radio"
                name="hasBranches"
                value="Yes"
                checked={formik.values.hasBranches === "Yes"}
                onChange={() => formik.setFieldValue("hasBranches", "Yes")}
              />
              <span>Multiple office locations</span>
            </label>
          </div>
        </div>

        {formik.values.hasBranches === "Yes" && (
          <>
            <div style={formGroupStyle}>
              <label htmlFor="Numberoflocations" style={labelStyle}>
                Number of locations
              </label>
              <input
                type="number"
                id="Numberoflocations"
                name="Numberoflocations"
                placeholder="3"
                min={1}
                style={inputStyle}
                value={formik.values.Numberoflocations}
                onChange={(e) => {
                  const value = Math.max(1, Number(e.target.value) || 1);
                  formik.setFieldValue("numberOfBranches", value.toString());
                  const current = formik.values.branchLocations || [];
                  let updated = [...current];
                  if (value > current.length) {
                    updated = [
                      ...current,
                      ...Array.from(
                        { length: value - current.length },
                        () => ""
                      ),
                    ];
                  } else {
                    updated = current.slice(0, value);
                  }
                  formik.setFieldValue("branchLocations", updated);
                }}
                onBlur={formik.handleBlur}
              />
              {formik.touched.numberOfBranches &&
                formik.errors.numberOfBranches && (
                  <div style={errorTextStyle}>
                    {formik.errors.numberOfBranches}
                  </div>
                )}
            </div>

            <div style={formGroupStyle}>
              <label htmlFor="Totalemployeesinalllocations" style={labelStyle}>
                Total employees in all locations
              </label>
              <input
                type="number"
                id="Totalemployeesinalllocations"
                name="Totalemployeesinalllocations"
                placeholder="50"
                min={1}
                style={inputStyle}
                value={formik.values.Totalemployeesinalllocations}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.Totalemployeesinalllocations &&
                formik.errors.Totalemployeesinalllocations && (
                  <div style={errorTextStyle}>
                    {formik.errors.Totalemployeesinalllocations}
                  </div>
                )}
            </div>

            <div style={{ marginBottom: 0 }}>
              <label style={labelStyle}>Location names</label>
              {formik.values.branchLocations &&
                formik.values.branchLocations.map((loc, idx) => (
                  <div key={idx} style={{ marginBottom: "0.5rem" }}>
                    <input
                      type="text"
                      name={`branchLocations[${idx}]`}
                      placeholder={`Location ${idx + 1}`}
                      style={inputStyle}
                      value={loc}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {Array.isArray(formik.errors.branchLocations) &&
                      formik.errors.branchLocations[idx] && (
                        <div style={errorTextStyle}>
                          {formik.errors.branchLocations[idx]}
                        </div>
                      )}
                  </div>
                ))}
            </div>
          </>
        )}
      </div>

      {/* Verification */}
      <div
        style={{
          marginTop: "1.75rem",
          padding: "1.25rem 1.25rem 1rem",
          borderRadius: "10px",
          border: "1px solid #e5e7eb",
          backgroundColor: "#f9fafb",
        }}
      >
        <h3
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "#374151",
            margin: 0,
            marginBottom: "0.75rem",
          }}
        >
          Verification
        </h3>
        <div style={gridTwoColWrapper}>
          <div style={formGroupStyle}>
            <label htmlFor="verificationType" style={labelStyle}>
              Verification Document
            </label>
            <select
              id="verificationType"
              name="verificationType"
              style={selectStyle}
              value={formik.values.verificationType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="">Select document type</option>
              <option value="EIN">
                EIN (Employer Identification Number)
              </option>
              <option value="DRIVINGLICENSE">Driving License</option>
              <option value="SSN">SSN (Social Security Number)</option>
              <option value="PASSPORT">Passport</option>
            </select>
            {formik.touched.verificationType &&
              formik.errors.verificationType && (
                <div style={errorTextStyle}>
                  {formik.errors.verificationType}
                </div>
              )}
          </div>

          <div style={formGroupStyle}>
            <label htmlFor="verificationId" style={labelStyle}>
              Document Number
            </label>
            <input
              type="text"
              id="verificationId"
              name="verificationId"
              placeholder="Enter document number"
              style={inputStyle}
              value={formik.values.verificationId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.verificationId &&
              formik.errors.verificationId && (
                <div style={errorTextStyle}>
                  {formik.errors.verificationId}
                </div>
              )}
          </div>
        </div>

        <div
          style={{
            marginTop: "0.5rem",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "center",
            gap: "0.75rem",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              color: "#6b7280",
              margin: 0,
            }}
          >
            We perform a soft validation and do not store sensitive
            information.
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            {verificationStatus === "success" && (
              <span
                style={{
                  fontSize: "12px",
                  color: "#16a34a",
                }}
              >
                Verified successfully.
              </span>
            )}
            {verificationStatus === "error" && (
              <span
                style={{
                  fontSize: "12px",
                  color: "#dc2626",
                }}
              >
                Verification failed. Please recheck details.
              </span>
            )}
            <button
              type="button"
              onClick={handleVerifyDocument}
              disabled={isVerifying}
              style={{
                ...continueButtonStyle,
                padding: "0.45rem 1.25rem",
                backgroundColor: "#10B981",
                fontSize: "13px",
                opacity: isVerifying ? 0.8 : 1,
              }}
            >
              {isVerifying ? "Verifying..." : "Verify"}
            </button>
          </div>
        </div>
      </div>

      <div style={buttonContainerStyle}>
        <button
          type="button"
          style={backButtonStyle}
          onClick={handleBack}
          disabled={true}
        >
          Back
        </button>
        <button type="submit" style={continueButtonStyle}>
          Continue
        </button>
      </div>
    </>
  );
};

export default StepCompanyInfo;
