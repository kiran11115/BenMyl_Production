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
        phone: Yup.string()
          .required("Business phone is required")
          .test("phone-length", "Phone must have 10–15 digits", (val) => {
            if (!val) return false;
            const digits = val.replace(/\D/g, "");
            return digits.length >= 10 && digits.length <= 15;
          }),
        email: Yup.string().email().required("Email is required"),
      }),
      2: Yup.object({
        country: Yup.string().required(),
        licenseType: Yup.string().required(),
        licenseNumber: Yup.string()
          .required("License number is required")
          .test("license-format", "Invalid format", function (value) {
            if (!value) return false;
            const type = this.parent.licenseType;
            if (type === "EIN") return /^\d{2}-\d{7}$/.test(value);
            if (type === "PAN") return /^[A-Z]{5}\d{4}[A-Z]$/.test(value);
            if (type === "GSTIN") return /^[0-9A-Z]{15}$/.test(value);
            if (type === "FSSAI") return /^\d{14}$/.test(value);
            if (type === "CRN") return /^[0-9A-Z]{8}$/.test(value);
            if (type === "TRN") return /^\d{3}-\d{4}-\d{7}$/.test(value);
            if (type === "UDYAM") return value.length >= 10;
            return true;
          }),
        street: Yup.string().required(),
        city: Yup.string().required(),
        state: Yup.string().when("country", {
          is: "USA",
          then: (s) => s.required(),
        }),
        zipCode: Yup.string().required(),
        docUploadType: Yup.string().required("Please select document type"),
        verificationFile: Yup.mixed().required("Document required"),
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
      countryCode: "+1",
      phone: "",
      notifications: false,

      country: "USA",
      licenseType: "EIN",
      licenseNumber: "",
      docUploadType: "",
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

    if (name === "phone") {
      const formatted = value.replace(/[^\d\s\+\-\(\)]/g, "");
      formik.setFieldValue(name, formatted);
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

    if (name === "licenseNumber") {
      const licenseType = formik.values.licenseType;

      if (licenseType === "EIN") {
        const raw = value.replace(/\D/g, "").slice(0, 9);
        formik.setFieldValue(name, raw.length >= 2 ? raw.slice(0, 2) + "-" + raw.slice(2) : raw);
        return;
      }
      if (licenseType === "PAN") {
        const raw = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
        formik.setFieldValue(name, raw);
        return;
      }
      if (licenseType === "GSTIN") {
        const raw = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 15);
        formik.setFieldValue(name, raw);
        return;
      }
      if (licenseType === "FSSAI") {
        const raw = value.replace(/\D/g, "").slice(0, 14);
        formik.setFieldValue(name, raw);
        return;
      }
      if (licenseType === "CRN") {
        const raw = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
        formik.setFieldValue(name, raw);
        return;
      }
      if (licenseType === "VAT") {
        const raw = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 15);
        formik.setFieldValue(name, raw);
        return;
      }
      if (licenseType === "UDYAM") {
        const raw = value.toUpperCase().replace(/[^A-Z0-9\-]/g, "").slice(0, 19);
        formik.setFieldValue(name, raw);
        return;
      }
      if (licenseType === "TRN") {
        const raw = value.replace(/\D/g, "").slice(0, 15);
        let formatted = raw;
        if (raw.length > 3 && raw.length <= 7) {
          formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`;
        } else if (raw.length > 7) {
          formatted = `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7)}`;
        }
        formik.setFieldValue(name, formatted);
        return;
      }

      formik.setFieldValue(name, value.toUpperCase().slice(0, 25));
      return;
    }

    formik.handleChange(e);
  };

  const handleCountryChange = (e) => {
    const c = e.target.value;
    formik.setFieldValue("country", c);
    formik.setFieldValue("licenseType", licenseOptions[c]?.[0]?.value || "GSTIN");
    formik.setFieldValue("docUploadType", "");
    formik.setFieldValue("state", "");
    formik.setFieldValue("city", "");
    formik.setFieldValue("zipCode", "");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    formik.setFieldValue("verificationFile", file);
    formik.setFieldError("verificationFile", undefined);
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
        "docUploadType",
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
    fd.append("BusinessPhone", `${v.countryCode} ${v.phone}`);
    fd.append("Notification", v.notifications);

    const countryMap = { USA: 1, India: 2, UK: 3, UAE: 4 };
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
  const handleAccountCreation = async (isSkipped = false) => {
    if (!isSkipped) {
      const fields = getStepFields(4);
      touchFields(fields);
      const errors = await formik.validateForm();
      if (Object.keys(errors).length > 0) return;
    } else {
      const errors = await formik.validateForm();
      const step4Fields = getStepFields(4);
      const remainingErrors = Object.keys(errors).filter(k => !step4Fields.includes(k));
      if (remainingErrors.length > 0) return;
    }

    setIsSubmitting(true);
    try {
      await admindetails(buildPayload(formik.values)).unwrap();
      localStorage.setItem("TrialStartDate", new Date().toISOString());
      localStorage.removeItem("trialPopoverHidden"); // Reset hidden state for new user
      toast.success("Account created successfully! Free trial valid for 90 days.");
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
            <h1 className="auth-page-title" style={{ fontSize: '30px', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>Complete Registration</h1>
            <p className="auth-page-subtitle" style={{ color: '#64748b', fontSize: '11px' }}>
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
                handleBlur={formik.handleBlur}
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
                <button type="button" className="btn-primary" onClick={nextStep} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', background: '#5a5de8', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', marginLeft: 'auto' }}>
                  Next Step
                </button>
              )}
              {currentStep === 4 && (
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem' }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => handleAccountCreation(true)}
                    disabled={isSubmitting}
                    style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', background: 'transparent', color: '#64748b', border: '1px solid #e2e8f0', fontWeight: 600, cursor: 'pointer', opacity: isSubmitting ? 0.7 : 1 }}
                  >
                    Skip for Now
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => handleAccountCreation(false)}
                    disabled={isSubmitting}
                    style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', background: '#5b5bd6', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', opacity: isSubmitting ? 0.7 : 1 }}
                  >
                    {isSubmitting ? "Creating..." : "Create Account"}
                  </button>
                </div>
              )}
            </footer>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormWizard;
