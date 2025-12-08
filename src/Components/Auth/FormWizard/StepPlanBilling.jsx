import React from "react";

const StepPlanBilling = ({
  formik,
  isMobile,
  addUser,
  removeUser,
  sendInvite,
  sendAllInvites,
  signupEmail,
  buttonContainerStyle,
  backButtonStyle,
  continueButtonStyle,
  Plus,
  X,
  Send,
  handleBack,
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
      <h2 style={formTitleStyle}>Plan, Billing & Invite</h2>
      <p style={formSubtitleStyle}>
        Pick a plan, add billing details and optionally invite users.
      </p>

      {/* Plan selection */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {[
          {
            id: "Starter",
            price: 0,
            tag: "Easy start",
            desc: "For small teams getting started in under 5 minutes.",
            bullets: [
              "Up to 25 employees",
              "Email support",
              "Guided onboarding",
            ],
          },
          {
            id: "Professional",
            price: 49,
            tag: "Best value",
            desc: "Balanced control and automation for growing teams.",
            bullets: [
              "Up to 250 employees",
              "Priority support",
              "Advanced reports",
            ],
          },
          {
            id: "Enterprise",
            price: 149,
            tag: "Full control",
            desc: "All features unlocked with dedicated assistance.",
            bullets: [
              "Unlimited employees",
              "Dedicated success manager",
              "Custom integrations",
            ],
          },
        ].map((plan) => (
          <div
            key={plan.id}
            onClick={() => formik.setFieldValue("plan", plan.id)}
            style={{
              border:
                formik.values.plan === plan.id
                  ? "2px solid #2744a0"
                  : "1px solid #d1d5db",
              borderRadius: "12px",
              padding: "1.5rem",
              cursor: "pointer",
              transition: "all 0.2s",
              backgroundColor:
                formik.values.plan === plan.id ? "#f0f4ff" : "white",
              position: "relative",
            }}
          >
            {plan.tag && (
              <span
                style={{
                  position: "absolute",
                  top: "0.75rem",
                  right: "0.75rem",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#2563eb",
                  backgroundColor: "#dbeafe",
                  borderRadius: "999px",
                  padding: "0.15rem 0.6rem",
                }}
              >
                {plan.tag}
              </span>
            )}
            <h3
              style={{
                fontSize: "18px",
                fontWeight: 600,
                marginBottom: "0.5rem",
              }}
            >
              {plan.id}
            </h3>
            <p
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "#2744a0",
                marginBottom: "0.25rem",
              }}
            >
              {plan.price === 0 ? "Free" : `$${plan.price}/mo`}
            </p>
            <p
              style={{
                fontSize: "13px",
                color: "#6b7280",
                marginBottom: "0.75rem",
              }}
            >
              {plan.desc}
            </p>
            <ul
              style={{
                paddingLeft: "1.1rem",
                margin: 0,
                listStyleType: "disc",
                fontSize: "12px",
                color: "#4b5563",
              }}
            >
              {plan.bullets.map((b) => (
                <li key={b} style={{ marginBottom: "0.25rem" }}>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {formik.touched.plan && formik.errors.plan && (
        <div style={errorTextStyle}>{formik.errors.plan}</div>
      )}

      {/* Billing */}
      <h3
        style={{
          fontSize: "14px",
          fontWeight: 600,
          color: "#374151",
          marginBottom: "0.75rem",
        }}
      >
        Billing Information
      </h3>

      <div style={formGroupStyle}>
        <label htmlFor="CardNumber" style={labelStyle}>
          Card Number
        </label>
        <input
          type="text"
          id="CardNumber"
          name="CardNumber"
          placeholder="1234 5678 9012 3456"
          maxLength={16}
          style={inputStyle}
          value={formik.values.CardNumber}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.CardNumber && formik.errors.CardNumber && (
          <div style={errorTextStyle}>{formik.errors.CardNumber}</div>
        )}
      </div>

      <div style={formGroupStyle}>
        <label htmlFor="CardHolderName" style={labelStyle}>
          Card Holder Name
        </label>
        <input
          type="text"
          id="CardHolderName"
          name="CardHolderName"
          placeholder="John Doe"
          style={inputStyle}
          value={formik.values.cardHolder}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.CardHolderName && formik.errors.CardHolderName && (
          <div style={errorTextStyle}>{formik.errors.CardHolderName}</div>
        )}
      </div>

      <div style={gridTwoColWrapper}>
        <div style={formGroupStyle}>
          <label htmlFor="ExpiryDate" style={labelStyle}>
            Expiry Date
          </label>
          <input
            type="text"
            id="ExpiryDate"
            name="ExpiryDate"
            placeholder="MM/YY"
            maxLength={5}
            style={inputStyle}
            value={formik.values.ExpiryDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.ExpiryDate && formik.errors.ExpiryDate && (
            <div style={errorTextStyle}>{formik.errors.ExpiryDate}</div>
          )}
        </div>

        <div style={formGroupStyle}>
          <label htmlFor="CVV" style={labelStyle}>
            CVV
          </label>
          <input
            type="text"
            id="CVV"
            name="CVV"
            placeholder="123"
            maxLength={4}
            style={inputStyle}
            value={formik.values.CVV}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.CVV && formik.errors.CVV && (
            <div style={errorTextStyle}>{formik.errors.CVV}</div>
          )}
        </div>
      </div>

      {/* Invite users */}
      <div
        style={{
          marginTop: "2rem",
          paddingTop: "1.25rem",
          borderTop: "1px solid #e5e7eb",
        }}
      >
        <h3
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "#374151",
            marginBottom: "0.75rem",
          }}
        >
          Invite team members (optional)
        </h3>
        <p
          style={{
            fontSize: "12px",
            color: "#6b7280",
            marginBottom: "1rem",
          }}
        >
          Add colleagues who will also manage benefits, payroll or approvals.
          You can always invite more people later.
        </p>

        {formik.values.users.map((user, index) => (
          <div
            key={index}
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr auto auto",
              gap: "0.75rem",
              alignItems: "center",
              marginBottom: "0.75rem",
            }}
          >
            <div>
              <label
                htmlFor={`users[${index}].role`}
                style={{ ...labelStyle, marginBottom: "0.25rem" }}
              >
                Role
              </label>
              <select
                id={`users[${index}].role`}
                name={`users[${index}].role`}
                style={selectStyle}
                value={formik.values.users[index].role}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="Admin">Admin</option>
                <option value="HR">Recruiter</option>
              </select>
            </div>

            <div>
              <label
                htmlFor={`users[${index}].email`}
                style={{ ...labelStyle, marginBottom: "0.25rem" }}
              >
                Work Email
              </label>
              <input
                type="email"
                id={`users[${index}].email`}
                name={`users[${index}].email`}
                placeholder="name@company.com"
                style={inputStyle}
                value={formik.values.users[index].email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.users &&
                formik.touched.users[index] &&
                formik.touched.users[index].email &&
                formik.errors.users &&
                formik.errors.users[index] &&
                formik.errors.users[index].email && (
                  <div style={errorTextStyle}>
                    {formik.errors.users[index].email}
                  </div>
                )}
            </div>

            <button
              type="button"
              onClick={() => sendInvite(user, formik.values)}
              style={{
                ...continueButtonStyle,
                padding: "0.55rem 0.9rem",
                backgroundColor: "#10B981",
                fontSize: "12px",
                justifyContent: "center",
                marginTop: "2rem",
              }}
            >
              <Send size={14} />
              <span>Send invite</span>
            </button>

            <button
              type="button"
              onClick={() => removeUser(index)}
              disabled={formik.values.users.length === 1}
              style={{
                border: "1px solid #e5e7eb",
                background: "#f9fafb",
                borderRadius: "8px",
                padding: "0.45rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "2rem",
                cursor:
                  formik.values.users.length === 1
                    ? "not-allowed"
                    : "pointer",
                opacity: formik.values.users.length === 1 ? 0.4 : 1,
              }}
            >
              <X size={14} color="#6b7280" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addUser}
          style={{
            marginTop: "0.5rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.3rem",
            borderRadius: "999px",
            border: "1px dashed #9ca3af",
            padding: "0.4rem 0.9rem",
            fontSize: "12px",
            color: "#4b5563",
            background: "#f9fafb",
            cursor: "pointer",
          }}
        >
          <Plus size={14} />
          Add another user
        </button>

        <div
          style={{
            marginTop: "0.75rem",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "center",
            justifyContent: "space-between",
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
            You will always be added as an administrator with your sign‑up
            email ({signupEmail || "current email"}).
          </p>
          <button
            type="button"
            onClick={() => sendAllInvites(formik.values)}
            style={{
              ...continueButtonStyle,
              padding: "0.6rem 1.1rem",
              backgroundColor: "#10B981",
              fontSize: "12px",
            }}
          >
            Invite All Users
          </button>
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
          Continue
        </button>
      </div>
    </>
  );
};

export default StepPlanBilling;
