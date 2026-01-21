import React, { useMemo, useState, useEffect } from "react";
import "./FormWizard.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

import StepAccount from "./FormSteps/StepAccount";
import StepVerify from "./FormSteps/StepVerify";
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
    },
    validationSchema: stepSchemas[currentStep],
    validateOnChange: false,
    onSubmit: () => {},
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
    formik.setFieldValue("licenseType", licenseOptions[c][0].value);
    formik.setFieldValue("state", "");
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
    return ["cardNumber", "cardName", "cardExpiry", "cardCvv"];
  };

  const nextStep = async () => {
    const fields = getStepFields(currentStep);
    touchFields(fields);
    const errors = await formik.validateForm();
    if (Object.keys(errors).length === 0) {
      setCurrentStep((s) => Math.min(s + 1, 3));
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
    const fields = getStepFields(3);
    touchFields(fields);

    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    try {
      await admindetails(buildPayload(formik.values)).unwrap();
      navigate("/sign-in");
    } catch (err) {
      console.error(err);
      alert(err?.data?.message || "Backend validation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-form-section">
            <div className="auth-form-header">
              <h1 className="auth-page-title">Complete Registration</h1>
              <p className="auth-page-subtitle">
                Verify your business identity to unlock full access.
              </p>
            </div>

            {/* STEPPER */}
            <div className="auth-stepper">
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
                <span className="auth-step-text">Billing</span>
              </div>
            </div>

            <form className="auth-form-card">
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
                />
              )}

              {currentStep === 3 && (
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

              <footer className="auth-footer">
                {currentStep > 1 && (
                  <button type="button" className="btn-secondary" onClick={prevStep}>
                    Back
                  </button>
                )}
                {currentStep < 3 && (
                  <button type="button" className="btn-primary" onClick={nextStep}>
                    Next Step
                  </button>
                )}
                {currentStep === 3 && (
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handleAccountCreation}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating..." : "Create Account"}
                  </button>
                )}
              </footer>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormWizard;
