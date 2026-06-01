import React, { useMemo, useState, useEffect } from "react";
import { toast } from "react-toastify";
import "./FormWizard.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

import StepAccount from "./FormSteps/StepAccount";
import StepVerify from "./FormSteps/StepVerify";
import StepSubscriptions from "./FormSteps/StepSubscriptions";
import StepBilling from "./FormSteps/StepBilling";

import {
  useGetAdminDetailsQuery,
  useAdmindetailsMutation,
} from "../../../State-Management/Api/AdminDetailsApiSlice";

const FormWizard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /* ================= FROM OTP ================= */
  const emailID = location.state?.emailID || "";
  const fullNameFromOTP = location.state?.fullName || "";
  const companyNameFromOTP = location.state?.companyName || "";

  /* ================= STATE ================= */
  const [currentStep, setCurrentStep] = useState(1);
  const [fileName, setFileName] = useState("");
  const [cardType, setCardType] = useState("credit");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [admindetails] = useAdmindetailsMutation();

  /* ================= GET ADMIN DETAILS ================= */
  // const { data: adminData } = useGetAdminDetailsQuery(emailID, {
  //   skip: !emailID,
  // });

  /* ================= LICENSE OPTIONS ================= */
  const licenseOptions = useMemo(
    () => ({
      India: [
        { value: "GSTIN", label: "GSTIN (Goods & Services Tax)" },
        { value: "PAN", label: "Company PAN Card" },
        { value: "UDYAM", label: "Udyam/MSME Registration" },
        { value: "FSSAI", label: "FSSAI License (Food)" },
      ],
      USA: [
        { value: "EIN", label: "EIN (Employer ID Number)" },
        { value: "SS4", label: "Form SS-4 (EIN App)" },
        { value: "INC", label: "Incorporation Certificate" },
      ],
      UK: [
        { value: "CRN", label: "Company Registration Number" },
        { value: "VAT", label: "VAT Registration" },
      ],
      UAE: [
        { value: "TL", label: "Trade License" },
        { value: "VAT", label: "TRN Number" },
      ],
    }),
    []
  );

  /* ================= VALIDATION ================= */
  const stepSchemas = useMemo(
    () => ({
      1: Yup.object({
        companyName: Yup.string().required("Company name is required"),
        phone: Yup.string().required("Business phone is required"),
        email: Yup.string().email().required("Email is required"),
      }),
      2: Yup.object({
        country: Yup.string().required(),
        licenseType: Yup.string().required(),
        licenseNumber: Yup.string().required(),
        street: Yup.string().required(),
        city: Yup.string().required(),
        state: Yup.string().when("country", {
          is: "USA",
          then: (s) => s.required(),
        }),
        zipCode: Yup.string().required(),
        verificationFile: Yup.mixed().when("country", {
          is: "USA",
          then: (s) => s.required("Document required"),
        }),
      }),
      3: Yup.object({
        subscriptionPlan: Yup.string().required(),
      }),
      4: Yup.object({
        cardNumber: Yup.string().required(),
        cardName: Yup.string().required(),
        cardExpiry: Yup.string().required(),
        cardCvv: Yup.string().required(),
      }),
    }),
    []
  );

  /* ================= FORMIK ================= */
  const formik = useFormik({
    initialValues: {
      companyName: companyNameFromOTP || "",
      fullName: fullNameFromOTP || "",
      email: emailID || "",
      phone: "",
      notifications: false,

      country: "USA",
      licenseType: "EIN",
      licenseNumber: "",
      verificationFile: null,

      street: "",
      city: "",
      state: "",
      zipCode: "",

      cardNumber: "",
      cardName: "",
      cardExpiry: "",
      cardCvv: "",

      subscriptionPlan: "free_trial",
    },
    validationSchema: stepSchemas[currentStep],
    validateOnChange: false,
    onSubmit: () => { },
  });

  /* ================= BACKEND PREFILL ================= */
  // useEffect(() => {
  //   if (adminData) {
  //     formik.setFieldValue("companyName", adminData.companyName || formik.values.companyName);
  //     formik.setFieldValue("fullName", adminData.fullName || formik.values.fullName);
  //     formik.setFieldValue("email", adminData.emailID || formik.values.email);
  //   }
  // }, [adminData]);

  const formData = formik.values;
  const currentLicenseOptions =
    licenseOptions[formData.country] || licenseOptions.India;

  /* ================= INPUT HANDLERS ================= */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      formik.setFieldValue(name, checked);
      return;
    }

    if (name === "cardNumber") {
      const raw = value.replace(/\D/g, "").slice(0, 16);
      formik.setFieldValue(name, raw.replace(/(\d{4})(?=\d)/g, "$1 "));
      return;
    }

    if (name === "cardExpiry") {
      const raw = value.replace(/\D/g, "").slice(0, 4);
      formik.setFieldValue(
        name,
        raw.length >= 2 ? raw.slice(0, 2) + "/" + raw.slice(2) : raw
      );
      return;
    }

    formik.handleChange(e);
  };

  const handleCountryChange = (e) => {
    const c = e.target.value;
    formik.setFieldValue("country", c);
    formik.setFieldValue("licenseType", licenseOptions[c]?.[0]?.value || "GSTIN");
    formik.setFieldValue("state", "");
    formik.setFieldValue("city", "");
    formik.setFieldValue("zipCode", "");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    formik.setFieldValue("verificationFile", file);
    formik.setFieldTouched("verificationFile", true);
  };

  /* ================= STEP CONTROL ================= */
  const touchFields = (fields) =>
    formik.setTouched(
      fields.reduce((a, f) => ({ ...a, [f]: true }), {}),
      true
    );

  const getStepFields = (step) => {
    if (step === 1) return ["companyName", "phone", "email"];
    if (step === 2)
      return [
        "country",
        "licenseType",
        "licenseNumber",
        "verificationFile",
        "street",
        "city",
        "state",
        "zipCode",
      ];
    if (step === 3) return ["subscriptionPlan"];
    return ["cardNumber", "cardName", "cardExpiry", "cardCvv"];
  };

  const nextStep = async () => {
    const fields = getStepFields(currentStep);
    touchFields(fields);
    const errors = await formik.validateForm();
    if (Object.keys(errors).length === 0) {
      setCurrentStep((s) => Math.min(s + 1, 4));
    }
  };

  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1));

  /* ================= PAYLOAD ================= */
  const buildPayload = (v) => {
    const fd = new FormData();
    fd.append("companyid", 0);
    fd.append("FullName", v.fullName);
    fd.append("EmailID", v.email);
    fd.append("companyname", v.companyName);
    fd.append("BusinessPhone", v.phone);
    fd.append("Notification", v.notifications);

    const countryMap = { USA: 1, INDIA: 2, UK: 3, UAE: 4 };
    fd.append("countryRegistration", countryMap[v.country] || 0);

    const docMap = {
      GSTIN: ["GSTIN_b", "GSTIN"],
      PAN: ["CompanyPANCard_b", "CompanyPANCard"],
      UDYAM: ["UdyamMSMERegistration_b", "UdyamMSMERegistration"],
      FSSAI: ["FSSAILicense_b", "FSSAILicense"],
      EIN: ["EIN_b", "EmployerIDNumber"],
      SS4: ["FormSS4", "SS4"],
      INC: ["INC_b", "IncorporationCertificate"],
      CRN: ["CRN_b", "CompanyRegistrationNumber"],
      VAT: ["VATRegistration_b", "VATRegistration"],
      TL: ["TL_b", "TradeLicense"],
      TRN: ["VAT_b", "TRNNumber"],
    };

    Object.values(docMap).forEach(([b, v]) => {
      fd.append(b, false);
      fd.append(v, "");
    });

    if (docMap[v.licenseType]) {
      fd.set(docMap[v.licenseType][0], true);
      fd.set(docMap[v.licenseType][1], v.licenseNumber);
    }

    fd.append("StreetAddress", v.street);
    fd.append("City", v.city);
    fd.append("PostalCode", v.zipCode);

    if (v.verificationFile) {
      fd.append("filepath", v.verificationFile);
    }

    fd.append("Paymentstatus", true);
    return fd;
  };

  /* ================= SUBMIT ================= */
  const handleAccountCreation = async () => {
    const fields = getStepFields(4);
    touchFields(fields);

    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    try {
      await admindetails(buildPayload(formik.values)).unwrap();
      localStorage.setItem("TrialStartDate", new Date().toISOString());
      localStorage.removeItem("trialPopoverHidden"); // Reset hidden state for new user
      toast.success("Account created successfully! Free trial valid for 20 days.");
      navigate("/sign-in");
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Backend validation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '1200px', width: '100%' }}>
        {/* LEFT FORM SIDE */}
        <div className="auth-form-side" style={{ display: 'flex', flexDirection: 'column', padding: '2.5rem 3rem', flex: 1, overflowY: 'auto' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', marginTop: '-1rem' }}>
            <img src="/Images/Benmyl-logo.svg" alt="BenMyl Logo" style={{ width: 150, height: 150, objectFit: 'contain' }} />
          </div>

          <div className="auth-form-header">
            <h1 className="auth-page-title" style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>Complete Registration</h1>
            <p className="auth-page-subtitle" style={{ color: '#64748b', fontSize: '0.95rem' }}>
              Verify your business identity to unlock full access.
            </p>
          </div>

          {/* STEPPER */}
          <div className="auth-stepper" style={{ marginBottom: '2rem' }}>
            <div className={`auth-step ${currentStep >= 1 ? "auth-step-active" : ""}`}>
              <div className="auth-step-circle">1</div>
              <span className="auth-step-text">Account</span>
            </div>
            <div className="auth-step-line"></div>
            <div className={`auth-step ${currentStep >= 2 ? "auth-step-active" : ""}`}>
              <div className="auth-step-circle">2</div>
              <span className="auth-step-text">Verify</span>
            </div>
            <div className="auth-step-line"></div>
            <div className={`auth-step ${currentStep >= 3 ? "auth-step-active" : ""}`}>
              <div className="auth-step-circle">3</div>
              <span className="auth-step-text">Plans</span>
            </div>
            <div className="auth-step-line"></div>
            <div className={`auth-step ${currentStep >= 4 ? "auth-step-active" : ""}`}>
              <div className="auth-step-circle">4</div>
              <span className="auth-step-text">Billing</span>
            </div>
          </div>

          <form className="auth-form-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {currentStep === 1 && (
              <StepAccount
                formData={formData}
                handleInputChange={handleInputChange}
                errors={formik.errors}
                touched={formik.touched}
              />
            )}

            {currentStep === 2 && (
              <StepVerify
                formData={formData}
                handleInputChange={handleInputChange}
                handleCountryChange={handleCountryChange}
                handleFileUpload={handleFileUpload}
                fileName={fileName}
                currentLicenseOptions={currentLicenseOptions}
                getLicenseLabel={() =>
                  currentLicenseOptions.find((o) => o.value === formData.licenseType)?.label ||
                  "Verification Document"
                }
                getLicensePlaceholder={() =>
                ({
                  GSTIN: "29AACCC1234D1Z5",
                  PAN: "AACCC1234D",
                  EIN: "12-3456789",
                }[formData.licenseType] || "Enter Document Number")
                }
                errors={formik.errors}
                touched={formik.touched}
                setFieldValue={formik.setFieldValue}
                handleBlur={formik.handleBlur}
              />
            )}

            {currentStep === 3 && (
              <StepSubscriptions
                formData={formData}
                handleSubscriptionChange={(val) => formik.setFieldValue("subscriptionPlan", val)}
              />
            )}

            {currentStep === 4 && (
              <StepBilling
                formData={formData}
                handleInputChange={handleInputChange}
                errors={formik.errors}
                touched={formik.touched}
                cardType={cardType}
                setCardType={setCardType}
                getCardBrand={() => {
                  const n = formData.cardNumber.replace(/\s/g, "");
                  if (n.startsWith("4")) return "VISA";
                  if (n.startsWith("5")) return "Mastercard";
                  if (n.startsWith("3")) return "Amex";
                  return "CARD";
                }}
              />
            )}

            <footer className="auth-footer" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
              {currentStep > 1 && (
                <button type="button" className="btn-secondary" onClick={prevStep} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'transparent', color: '#64748b', fontWeight: 600, cursor: 'pointer' }}>
                  Back
                </button>
              )}
              {currentStep < 4 && (
                <button type="button" className="btn-primary" onClick={nextStep} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', background: '#5b5bd6', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', marginLeft: 'auto' }}>
                  Next Step
                </button>
              )}
              {currentStep === 4 && (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleAccountCreation}
                  disabled={isSubmitting}
                  style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', background: '#5b5bd6', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', marginLeft: 'auto', opacity: isSubmitting ? 0.7 : 1 }}
                >
                  {isSubmitting ? "Creating..." : "Create Account"}
                </button>
              )}
            </footer>
          </form>
        </div>

        {/* RIGHT BRAND SIDE */}
        <div className="auth-brand-side" style={{ background: '#f4f7f9', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', flex: 1 }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2, marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.5px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#5b5bd6' }}></div>
              BENMYL PREVIEW UNIT
            </div>
            <div style={{ background: '#5b5bd6', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(91, 91, 214, 0.3)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              Matching Candidates Live
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2 }}>
            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '420px', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.02)' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#e2e8f0' }}></div>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#e2e8f0' }}></div>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#e2e8f0' }}></div>
                </div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8' }}>BenMyl Collaboration Hub</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', fontSize: '10px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.5px' }}>
                NEURAL PIPELINE FEED
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5b5bd6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#5b5bd6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700 }}>AR</div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '2px' }}>Alex Reid</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>Staffing Lead</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: 40, height: 4, background: '#5b5bd6', borderRadius: '2px' }}></div>
                    <div style={{ fontSize: '10px', fontWeight: 700, background: '#f3e8ff', color: '#5b5bd6', padding: '4px 8px', borderRadius: '4px', letterSpacing: '0.5px' }}>98.7% MATCH</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#8b5cf6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700 }}>MC</div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '2px' }}>Marcus Chen</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>Solutions Architect</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: 20, height: 4, background: '#8b5cf6', borderRadius: '2px' }}></div>
                    <div style={{ fontSize: '10px', fontWeight: 700, background: '#f1f5f9', color: '#64748b', padding: '4px 10px', borderRadius: '4px', letterSpacing: '0.5px' }}>SOURCED</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700 }}>SJ</div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '2px' }}>Sarah Jenkins</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>Full-Stack Lead</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: 30, height: 4, background: '#3b82f6', borderRadius: '2px' }}></div>
                    <div style={{ fontSize: '10px', fontWeight: 700, background: '#eff6ff', color: '#3b82f6', padding: '4px 10px', borderRadius: '4px', letterSpacing: '0.5px' }}>INTERVIEW</div>
                  </div>
                </div>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 800, color: '#5b5bd6', display: 'flex', alignItems: 'center', gap: '6px', letterSpacing: '0.5px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    INTELLIGENT INSIGHTS
                  </div>
                  <div style={{ fontSize: '9px', fontWeight: 700, color: '#3b82f6', letterSpacing: '0.5px' }}>LIVE AI STREAM</div>
                </div>
                <div style={{ fontSize: '13px', color: '#334155', lineHeight: 1.6 }}>
                  Matched applicant <strong>Alex Reid</strong> to Senior React Specialist position with <strong>98.7%</strong> accuracy index.
                </div>
              </div>

            </div>
          </div>

          <div style={{ zIndex: 2, display: 'flex', gap: '12px', marginTop: '2rem' }}>
            <div style={{ flex: 1, background: '#ffffff', borderRadius: '12px', padding: '14px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '9px', fontWeight: 800, color: '#94a3b8', marginBottom: '6px', letterSpacing: '0.5px' }}>DAILY MATCH ENGINE</div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>98.4%</div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#10b981', background: '#d1fae5', padding: '2px 6px', borderRadius: '10px' }}>+2.1K</div>
              </div>
            </div>
            <div style={{ flex: 1, background: '#ffffff', borderRadius: '12px', padding: '14px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '9px', fontWeight: 800, color: '#94a3b8', marginBottom: '6px', letterSpacing: '0.5px' }}>ACTIVE JOB GIGS</div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>24 Live</div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#10b981' }}>+4 today</div>
              </div>
            </div>
            <div style={{ flex: 1, background: '#ffffff', borderRadius: '12px', padding: '14px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '9px', fontWeight: 800, color: '#94a3b8', marginBottom: '6px', letterSpacing: '0.5px' }}>SOURCED PROFILES</div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>14.2K</div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#10b981' }}>+1.3K today</div>
              </div>
            </div>
          </div>
          
          <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(91,91,214,0.05) 0%, rgba(244,247,249,0) 70%)', zIndex: 1 }}></div>
          <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, rgba(244,247,249,0) 70%)', zIndex: 1 }}></div>

        </div>
      </div>
    </div>
  );
};

export default FormWizard;
