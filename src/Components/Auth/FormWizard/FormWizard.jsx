import React, { useState } from "react";
import "./FormWizard.css";
import { useNavigate } from "react-router-dom";
import { FiCheck, FiX } from "react-icons/fi";

import StepAccount from "./FormSteps/StepAccount";
import StepVerify from "./FormSteps/StepVerify";
import StepBilling from "./FormSteps/StepBilling";

const FormWizard = () => {
  // --- State Management ---
  const [currentStep, setCurrentStep] = useState(1);
  const [cardType, setCardType] = useState("credit");
  const [fileName, setFileName] = useState("");

  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const navigate = useNavigate();

  // Centralized form data
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    notifications: false,
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    cardName: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "USA",
    licenseType: "EIN",
  });

  // --- Configuration Data ---
  const licenseOptions = {
    India: [
      { value: "GSTIN", label: "coming soon..." },
      // { value: "PAN", label: "Company PAN Card" },
      // { value: "UDYAM", label: "Udyam/MSME Registration" },
      // { value: "FSSAI", label: "FSSAI License (Food)" },
    ],
    USA: [
      { value: "EIN", label: "EIN (Employer ID Number)" },
      { value: "SS4", label: "Form SS-4 (EIN App)" },
      { value: "INC", label: "Incorporation Certificate" },
    ],
    UK: [
      { value: "CRN", label: "coming soon..." },
      // { value: "VAT", label: "VAT Registration" },
    ],
    UAE: [
      { value: "TL", label: "coming soon..." },
      // { value: "VAT", label: "TRN Number" },
    ],
  };

  const currentLicenseOptions =
    licenseOptions[formData.country] || licenseOptions.India;

  // --- Handlers ---
  const handleInputChange = (e) => {
    let { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    if (name === "cardNumber") {
      const raw = value.replace(/\D/g, "").substring(0, 16);
      value = raw.replace(/(\d{4})(?=\d)/g, "$1 ");
    }

    if (name === "cardExpiry") {
      const raw = value.replace(/\D/g, "").substring(0, 4);
      if (raw.length >= 2) {
        value = raw.substring(0, 2) + "/" + raw.substring(2);
      } else {
        value = raw;
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (e) => {
    const newCountry = e.target.value;
    const defaultLicense = licenseOptions[newCountry]
      ? licenseOptions[newCountry][0].value
      : "GSTIN";

    setFormData((prev) => ({
      ...prev,
      country: newCountry,
      licenseType: defaultLicense,
      state: "",
      zipCode: "",
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) setFileName(file.name);
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleBackToSignIn = () => {
    navigate("/sign-in");
  };

  const handleBusinessVerification = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      nextStep();
    }, 1500);
  };

  const handleAccountCreation = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessModal(true);
    }, 2000);
  };

  const handleClaimReward = () => {
    navigate("/admin/edit-profile");
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
  };

  const getCardBrand = () => {
    const num = formData.cardNumber.replace(/\s/g, "");
    if (num.startsWith("4")) return "VISA";
    if (num.startsWith("5")) return "Mastercard";
    if (num.startsWith("3")) return "Amex";
    return "CARD";
  };

  const getLicensePlaceholder = () => {
    const placeholders = {
      GSTIN: "29AACCC1234D1Z5",
      PAN: "AACCC1234D",
      UDYAM: "UDYAM-AP-01-0001234",
      EIN: "12-3456789",
      SS4: "SS-4 Form Number",
    };
    return placeholders[formData.licenseType] || "Enter Document Number";
  };

  const getLicenseLabel = () => {
    const selected = currentLicenseOptions.find(
      (opt) => opt.value === formData.licenseType
    );
    return selected ? selected.label : "Verification Document";
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

            <div className="auth-stepper">
              <div
                className={`auth-step ${currentStep >= 1 ? "auth-step-active" : ""
                  } ${currentStep > 1 ? "auth-step-completed" : ""}`}
              >
                <div className="auth-step-circle">
                  {currentStep > 1 ? "✓" : "1"}
                </div>
                <span className="auth-step-text">Account</span>
              </div>
              <div
                className={`auth-step-line ${currentStep > 1 ? "auth-step-line-active" : ""
                  }`}
              ></div>

              <div
                className={`auth-step ${currentStep >= 2 ? "auth-step-active" : ""
                  } ${currentStep > 2 ? "auth-step-completed" : ""}`}
              >
                <div className="auth-step-circle">
                  {currentStep > 2 ? "✓" : "2"}
                </div>
                <span className="auth-step-text">Verify</span>
              </div>
              <div
                className={`auth-step-line ${currentStep > 2 ? "auth-step-line-active" : ""
                  }`}
              ></div>

              <div
                className={`auth-step ${currentStep >= 3 ? "auth-step-active" : ""
                  }`}
              >
                <div className="auth-step-circle">3</div>
                <span className="auth-step-text">Billing</span>
              </div>
            </div>

            <form className="auth-form-card" onSubmit={(e) => e.preventDefault()}>
              {currentStep === 1 && (
                <StepAccount
                  formData={formData}
                  handleInputChange={handleInputChange}
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
                  getLicenseLabel={getLicenseLabel}
                  getLicensePlaceholder={getLicensePlaceholder}
                />
              )}

              {currentStep === 3 && (
                <StepBilling
                  formData={formData}
                  handleInputChange={handleInputChange}
                  cardType={cardType}
                  setCardType={setCardType}
                  getCardBrand={getCardBrand}
                />
              )}

              <footer className="auth-footer">
                {/* STEP 1 ONLY: Full Left/Right buttons - NO hidden Back button interference */}
                {currentStep === 1 && (
                  <div className="step1-buttons-fullwidth">
                    <div className="step1-left-section">
                      <button
                        type="button"
                        className="btn-signin-left-full"
                        onClick={handleBackToSignIn}
                      >
                        ← Back to Sign in
                      </button>
                    </div>
                    <div className="step1-right-section">
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={nextStep}
                      >
                        Next Step
                      </button>
                    </div>
                  </div>
                )}

                {/* STEPS 2 & 3: Regular Back + Primary button */}
                {currentStep !== 1 && (
                  <>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={prevStep}
                      disabled={isSubmitting || isVerifying}
                    >
                      Back
                    </button>

                    {currentStep === 2 && (
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={handleBusinessVerification}
                        disabled={isVerifying}
                      >
                        {isVerifying ? (
                          <span className="flex-center-gap">
                            <span className="loader-spinner"></span>
                            Verifying...
                          </span>
                        ) : (
                          "Verify & Continue"
                        )}
                      </button>
                    )}

                    {currentStep === 3 && (
                      <button
                        type="button"
                        className="btn-primary w-25"
                        onClick={handleAccountCreation}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="flex-center-gap">
                            <span className="loader-spinner"></span>
                            Creating Account...
                          </span>
                        ) : (
                          "Create Account"
                        )}
                      </button>
                    )}
                  </>
                )}
              </footer>
            </form>

            <div className="auth-support-bar">
              Protected by 256-bit SSL encryption.{" "}
              <a href="#">Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="alert-card success-theme">
            <button className="alert-close-icon" onClick={handleCloseModal}>
              <FiX />
            </button>

            <div className="alert-content left-align">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="icon-circle success-icon-bg">
                  <FiCheck className="icon-main" />
                </div>
                <h3 className="alert-title mt-0 mb-0">Account Created!</h3>
              </div>

              <p className="alert-message mb-2">
                You've successfully verified your identity and set up billing.
                As a welcome bonus, we've added Tokens to your wallet.
              </p>
              <div className="alert-reward-box text-warning fs-2 text-center fw-bolder mb-2">
                <span className="reward-amount me-2">300</span>
                <span className="reward-label">Tokens</span>
              </div>
              <div className="alert-actions start">
                <button
                  className="btn-primary w-100"
                  onClick={handleClaimReward}
                >
                  Claim Rewards & Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormWizard;
