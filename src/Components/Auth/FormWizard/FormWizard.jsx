// FormWizard.jsx
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useLocation } from "react-router-dom";
import { Check, Plus, X, Send, Upload } from "lucide-react";
import { useCompanyDetailsMutation } from "../../../State-Management/Api/CompanyApiSlice"; 
import StepCompanyInfo from "../FormWizard/StepCompanyInfo";
import StepPlanBilling from "../FormWizard/StepPlanBilling";
import StepFinalSummary from "../FormWizard/StepFinalSummary";

function FormWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isLoading, setIsLoading] = useState(false);
  const [isZipLoading, setIsZipLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFileName, setLogoFileName] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);

  // RTK Query mutation hook
  const [companyDetailsMutation, { isLoading: isApiLoading, error: apiError }] = useCompanyDetailsMutation();

  const navigate = useNavigate();
  const locationRouter = useLocation();
  const signupEmail = locationRouter.state?.email;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const steps = [
    {
      number: 1,
      title: "Company Info",
      subtitle: "Basic details & verification",
    },
    {
      number: 2,
      title: "Plan & Billing",
      subtitle: "Choose plan, billing & invites",
    },
    {
      number: 3,
      title: "Final Summary",
      subtitle: "Review and complete",
    },
  ];

  const [formData, setFormData] = useState({
    CompanyName: "",
    filepath: null,
    CompanyDescription: "",
    Industry: "",
    TotalEmployees: "",
    Country: "",
    Integration: "",
    ZipCode: "",
    City: "",
    State: "",
    Region: "",
    hasBranches: "No",
    Numberoflocations: "",
    Totalemployeesinalllocations: "",
    branchLocations: [],
    verificationType: "",
    verificationId: "",
    Website: "",
    Organization: "",
    ContactPhone: "",
    ContactEmail: "",
    Address1: "",
    Address2: "",
    plan: "",
    users: [{ role: "Admin", email: "" }],
    CardNumber: "",
    CardHolderName: "",
    ExpiryDate: "",
    CVV: "",
  });

  const fetchCityStateFromZip = async (ZipCode, formik) => {
    if (ZipCode.length !== 5 && ZipCode.length !== 6) return;
    setIsZipLoading(true);
    try {
      const response = await fetch(`https://api.zippopotam.us/us/${ZipCode}`);
      if (!response.ok) {
        formik.setFieldError("ZipCode", "Invalid ZIP code");
        return;
      }
      const data = await response.json();
      const place = data.places?.[0];
      if (!place) {
        formik.setFieldError("ZipCode", "Invalid ZIP code");
        return;
      }
      formik.setFieldValue("City", place["place name"] || "");
      formik.setFieldValue("State", place["state abbreviation"] || "");
      formik.setFieldValue("Region", place["state"] || "");
    } catch (error) {
      formik.setFieldError("ZipCode", "Could not validate ZIP code");
    } finally {
      setIsZipLoading(false);
    }
  };

  const sendInvite = (user, values) => {
    if (user.email && user.role) {
      console.log(`Sending invite to ${user.email} as ${user.role}`);
      alert(`Invitation sent to ${user.email} as ${user.role}!`);
    } else {
      alert("Please fill in both role and email before sending invite.");
    }
  };

  const sendAllInvites = (values) => {
    const validUsers = values.users.filter((u) => u.email && u.role);
    if (validUsers.length === 0) {
      alert(
        "No valid users to invite. Please add at least one user with email and role."
      );
      return;
    }
    console.log("Sending all invites", validUsers);
    alert(`Invitations sent to ${validUsers.length} users!`);
  };

  const validationSchemas = [
    Yup.object({
      CompanyName: Yup.string().required("Company name is required"),
      CompanyDescription: Yup.string().required(
        "Company description is required"
      ),
      Industry: Yup.string().required("Industry is required"),
      TotalEmployees: Yup.string().required("Total employees is required"),
      Country: Yup.string().required("Country is required"),
      Integration: Yup.string(),
      ZipCode: Yup.string()
        .required("ZIP code is required")
        .matches(/^\d{6}$/, "ZIP code must be 6 digits"),
      City: Yup.string().required("City is required"),
      State: Yup.string().required("State is required"),
      Region: Yup.string(),
      hasBranches: Yup.string()
        .oneOf(["Yes", "No"])
        .required("Please select an option"),
      Numberoflocations: Yup.string().when("hasBranches", {
        is: "Yes",
        then: (schema) => schema.required("Number of branches is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      Totalemployeesinalllocations: Yup.string().when("hasBranches", {
        is: "Yes",
        then: (schema) =>
          schema.required("Total number of branch employees is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      branchLocations: Yup.array().when("hasBranches", {
        is: "Yes",
        then: (schema) =>
          schema.of(Yup.string().required("Branch location is required")),
        otherwise: (schema) => schema.notRequired(),
      }),
      verificationType: Yup.string().required("Select a verification document"),
      verificationId: Yup.string().required("Enter the document number"),
      Website: Yup.string()
        .url("Enter a valid website URL")
        .nullable()
        .transform((v, o) => (o === "" ? null : v)),
      Organization: Yup.string().required("Organization type is required"),
      ContactPhone: Yup.string()
        .required("Contact number is required")
        .matches(/^[0-9+\-()\s]{7,20}$/, "Enter a valid contact number"),
      ContactEmail: Yup.string()
        .email("Invalid email")
        .required("Contact email is required"),
      Address1: Yup.string().required("Contact address 1 is required"),
      Address2: Yup.string(),
    }),
    Yup.object({
      plan: Yup.string().required("Please select a plan"),
      CardNumber: Yup.string()
        .required("Card number is required")
        .matches(/^\d{16}$/, "Invalid card number"),
      CardHolderName: Yup.string().required("Card holder name is required"),
      ExpiryDate: Yup.string()
        .required("Expiry date is required")
        .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "Format MM/YY"),
      CVV: Yup.string()
        .required("CVV is required")
        .matches(/^\d{3,4}$/, "Invalid CVV"),
      users: Yup.array().of(
        Yup.object({
          role: Yup.string().nullable(),
          email: Yup.string().email("Invalid email").nullable(),
        })
      ),
    }),
    Yup.object({}),
  ];

  const formik = useFormik({
    initialValues: formData,
    validationSchema: validationSchemas[currentStep - 1],
    validateOnChange: true,
    validateOnBlur: true,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setFormData(values);
      if (currentStep === steps.length) {
        setIsLoading(true);
        try {
          // Handle file upload with FormData if companyLogo exists
          let payload = values;
          if (values.filepath && values.filepath instanceof File) {
            const formDataPayload = new FormData();
            Object.keys(values).forEach((key) => {
              if (key === "companyLogo" && values[key]) {
                formDataPayload.append(key, values[key]);
              } else if (key === "branchLocations" && Array.isArray(values[key])) {
                values[key].forEach((location, index) => {
                  formDataPayload.append(`${key}[${index}]`, location);
                });
              } else if (key === "users" && Array.isArray(values[key])) {
                values[key].forEach((user, index) => {
                  formDataPayload.append(`users[${index}][role]`, user.role || "");
                  formDataPayload.append(`users[${index}][email]`, user.email || "");
                });
              } else {
                formDataPayload.append(key, values[key] || "");
              }
            });
            payload = formDataPayload;
          }

          // Make RTK Query API call
          await companyDetailsMutation(payload).unwrap();
          
          // Success - navigate to dashboard
          setTimeout(() => {
            setIsLoading(false);
            navigate("/dashboard");
          }, 1500);
        } catch (error) {
          console.error("Company creation failed:", error);
          setIsLoading(false);
          alert(
            apiError?.data?.message || 
            error?.data?.message || 
            "Failed to create company. Please try again."
          );
        }
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    },
  });

  // Combine local and API loading states
  const combinedLoading = isLoading || isApiLoading;

  const handleBack = () => {
    if (currentStep === 1) return;
    setFormData(formik.values);
    setCurrentStep((prev) => prev - 1);
  };

  const handleStepClick = (targetStep) => {
    if (targetStep === currentStep) return;
    setFormData(formik.values);
    setCurrentStep(targetStep);
  };

  const addUser = () => {
    formik.setFieldValue("users", [
      ...formik.values.users,
      { role: "Admin", email: "" },
    ]);
  };

  const removeUser = (index) => {
    const users = [...formik.values.users];
    if (users.length === 1) return;
    users.splice(index, 1);
    formik.setFieldValue("users", users);
  };

  const handleVerifyDocument = async () => {
    setIsVerifying(true);
    setVerificationStatus(null);
    try {
      await new Promise((res) => setTimeout(res, 1000));
      setVerificationStatus("success");
      alert("Verification successful.");
    } catch (e) {
      setVerificationStatus("error");
      alert("Verification failed. Please check your details.");
    } finally {
      setIsVerifying(false);
    }
  };

  // All styles (complete)
  const containerStyle = {
    padding: isMobile ? "1rem 1rem 2rem" : "2rem 2rem 2.5rem",
  };
  const contentWrapperStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
  };
  const headerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginBottom: isMobile ? "1.5rem" : "2rem",
  };
  const logoStyle = {
    width: isMobile ? "120px" : "150px",
  };
  const headerTitleStyle = {
    fontSize: isMobile ? "18px" : "24px",
    fontWeight: 600,
    color: "#292d34",
    margin: 0,
  };
  const stepperContainerStyle = {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: isMobile ? "1rem 1.25rem" : "1.25rem 2rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    marginBottom: isMobile ? "1.5rem" : "2rem",
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    alignItems: isMobile ? "flex-start" : "center",
    gap: isMobile ? "1rem" : "2rem",
  };
  const stepItemStyle = (stepNumber) => ({
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    position: "relative",
    cursor: "pointer",
    flex: 1,
  });
  const stepNumberContainerStyle = (stepNumber) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor:
      stepNumber < currentStep
        ? "#2744a0"
        : stepNumber === currentStep
        ? "#2744a0"
        : "#e5e7eb",
    color: stepNumber <= currentStep ? "#ffffff" : "#9ca3af",
    fontSize: "14px",
    fontWeight: 600,
    flexShrink: 0,
    position: "relative",
    zIndex: 2,
  });
  const stepConnectorStyle = (index) => ({
    flex: index === steps.length - 1 ? "0 0 auto" : 1,
    height: "2px",
    background:
      index < currentStep - 1
        ? "linear-gradient(to right, #2744a0, #1d4ed8)"
        : "#e5e7eb",
    marginLeft: "0.75rem",
    marginRight: index === steps.length - 1 ? 0 : "0.75rem",
  });
  const stepContentStyle = {
    display: "flex",
    flexDirection: "column",
  };
  const stepTitleStyle = (stepNumber) => ({
    fontSize: isMobile ? "13px" : "14px",
    fontWeight: stepNumber === currentStep ? 700 : 600,
    color: stepNumber === currentStep ? "#292d34" : "#6b7280",
    marginBottom: "0.15rem",
  });
  const stepSubtitleStyle = {
    fontSize: isMobile ? "11px" : "12px",
    color: "#9ca3af",
    fontWeight: 400,
  };
  const formContainerStyle = {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: isMobile ? "1.5rem" : "2.5rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  };
  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "space-between",
    gap: "1rem",
    marginTop: isMobile ? "2rem" : "2.5rem",
    paddingTop: isMobile ? "1.5rem" : "2rem",
    borderTop: "1px solid #e5e7eb",
  };
  const backButtonStyle = {
    padding: isMobile ? "0.65rem 1.5rem" : "0.75rem 2rem",
    backgroundColor: "transparent",
    color: "#6b7280",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: isMobile ? "13px" : "14px",
    fontWeight: 600,
    cursor: currentStep === 1 ? "not-allowed" : "pointer",
    opacity: currentStep === 1 ? 0.5 : 1,
    transition: "all 0.2s",
  };
  const continueButtonStyle = {
    padding: isMobile ? "0.65rem 1.5rem" : "0.75rem 2rem",
    backgroundColor: "#2744a0",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: isMobile ? "13px" : "14px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  };
  const loaderOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.95)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10000,
  };
  const spinnerStyle = {
    width: isMobile ? "50px" : "60px",
    height: isMobile ? "50px" : "60px",
    border: "4px solid #e5e7eb",
    borderTop: "4px solid #2744a0",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  };
  const loaderTextStyle = {
    marginTop: "1.5rem",
    fontSize: isMobile ? "14px" : "16px",
    color: "#6b7280",
    fontWeight: 600,
  };

  // Add spinner animation to global styles (add to your CSS or use styled-components)
  const spinAnimation = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  const renderStep = () => {
    if (currentStep === 1) {
      return (
        <StepCompanyInfo
          formik={formik}
          isMobile={isMobile}
          isZipLoading={isZipLoading}
          logoPreview={logoPreview}
          logoFileName={logoFileName}
          setLogoFileName={setLogoFileName}
          setLogoPreview={setLogoPreview}
          fetchCityStateFromZip={fetchCityStateFromZip}
          buttonContainerStyle={buttonContainerStyle}
          backButtonStyle={backButtonStyle}
          continueButtonStyle={continueButtonStyle}
          Plus={Plus}
          Upload={Upload}
          isVerifying={isVerifying}
          verificationStatus={verificationStatus}
          handleVerifyDocument={handleVerifyDocument}
        />
      );
    }
    if (currentStep === 2) {
      return (
        <StepPlanBilling
          formik={formik}
          isMobile={isMobile}
          addUser={addUser}
          removeUser={removeUser}
          sendInvite={sendInvite}
          sendAllInvites={sendAllInvites}
          signupEmail={signupEmail}
          buttonContainerStyle={buttonContainerStyle}
          backButtonStyle={backButtonStyle}
          continueButtonStyle={continueButtonStyle}
          Plus={Plus}
          X={X}
          Send={Send}
        />
      );
    }
    return (
      <StepFinalSummary
        formData={formData}
        isMobile={isMobile}
        buttonContainerStyle={buttonContainerStyle}
        backButtonStyle={backButtonStyle}
        continueButtonStyle={continueButtonStyle}
      />
    );
  };

  return (
    <>
      <style>{spinAnimation}</style>
      {combinedLoading ? (
        <div style={loaderOverlayStyle}>
          <div style={spinnerStyle} />
          <p style={loaderTextStyle}>Completing your account setup...</p>
        </div>
      ) : (
        <div style={containerStyle}>
          <div style={contentWrapperStyle}>
            <div style={headerStyle}>
              <img
                src="/Images/Benmyl-logo.svg"
                alt="BenMyl Logo"
                style={logoStyle}
              />
              <h1 style={headerTitleStyle}>Complete Your Account Setup</h1>
            </div>

            <div style={stepperContainerStyle}>
              {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                  <div
                    style={stepItemStyle(step.number)}
                    onClick={() => handleStepClick(step.number)}
                  >
                    <div style={stepNumberContainerStyle(step.number)}>
                      {step.number < currentStep ? (
                        <Check size={16} />
                      ) : (
                        step.number
                      )}
                    </div>
                    <div style={stepContentStyle}>
                      <span style={stepTitleStyle(step.number)}>
                        {step.title}
                      </span>
                      <span style={stepSubtitleStyle}>{step.subtitle}</span>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div style={stepConnectorStyle(index)} />
                  )}
                </React.Fragment>
              ))}
            </div>

            <div style={formContainerStyle}>
              <form onSubmit={formik.handleSubmit}>{renderStep()}</form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default FormWizard;
