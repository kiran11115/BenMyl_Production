import React, { useState } from "react";
import "./FormWizard.css";
import { useNavigate } from "react-router-dom";
import { FiCheck, FiX } from "react-icons/fi";

const FormWizard = () => {
  // --- State Management ---
  const [currentStep, setCurrentStep] = useState(1);
  const [cardType, setCardType] = useState("credit");
  const [fileName, setFileName] = useState("");

  // New States for Loaders and Modal
  const [isVerifying, setIsVerifying] = useState(false); // Loader for Step 2
  const [isSubmitting, setIsSubmitting] = useState(false); // Loader for Step 3
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
    country: "India",
    licenseType: "GSTIN",
  });

  // --- Configuration Data ---
  const licenseOptions = {
    India: [
      { value: "GSTIN", label: "GSTIN (Goods & Services Tax)" },
      { value: "PAN", label: "Company PAN Card" },
      { value: "UDYAM", label: "Udyam/MSME Registration" },
      { value: "FSSAI", label: "FSSAI License (Food)" },
    ],
    USA: [
      { value: "EIN", label: "EIN (Employer ID Number)" },
      { value: "SS4", label: "Form SS-4 (EIN App)" },
      { value: "DBA", label: "DBA Certificate" },
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

    // Auto-format Card Number
    if (name === "cardNumber") {
      const raw = value.replace(/\D/g, "").substring(0, 16);
      value = raw.replace(/(\d{4})(?=\d)/g, "$1 ");
    }

    // Auto-format Expiry
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

  // --- Action Handlers ---

  // 1. Step 2 Action: Verify Business (Simulated)
  const handleBusinessVerification = () => {
    setIsVerifying(true);
    // Simulate verification delay
    setTimeout(() => {
      setIsVerifying(false);
      nextStep(); // Move to Billing Step
    }, 1500);
  };

  // 2. Step 3 Action: Final Account Creation
  const handleAccountCreation = () => {
    setIsSubmitting(true);
    // Simulate Server Request (2 Seconds)
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessModal(true);
    }, 2000);
  };

  const handleClaimReward = () => {
    navigate("/user/account-settings");
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
  };

  // --- Helpers ---
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
        <div className="auth-card ">
          <div className="auth-form-section">
            {/* Header */}
            <div className="auth-form-header">
              <h1 className="auth-page-title">Complete Registration</h1>
              <p className="auth-page-subtitle">
                Verify your business identity to unlock full access.
              </p>
            </div>

            {/* Stepper (Reordered: Account -> Verify -> Billing) */}
            <div className="auth-stepper">
              <div
                className={`auth-step ${
                  currentStep >= 1 ? "auth-step-active" : ""
                } ${currentStep > 1 ? "auth-step-completed" : ""}`}
              >
                <div className="auth-step-circle">
                  {currentStep > 1 ? "✓" : "1"}
                </div>
                <span className="auth-step-text">Account</span>
              </div>
              <div
                className={`auth-step-line ${
                  currentStep > 1 ? "auth-step-line-active" : ""
                }`}
              ></div>

              <div
                className={`auth-step ${
                  currentStep >= 2 ? "auth-step-active" : ""
                } ${currentStep > 2 ? "auth-step-completed" : ""}`}
              >
                <div className="auth-step-circle">
                  {currentStep > 2 ? "✓" : "2"}
                </div>
                <span className="auth-step-text">Verify</span>
              </div>
              <div
                className={`auth-step-line ${
                  currentStep > 2 ? "auth-step-line-active" : ""
                }`}
              ></div>

              <div
                className={`auth-step ${
                  currentStep >= 3 ? "auth-step-active" : ""
                }`}
              >
                <div className="auth-step-circle">3</div>
                <span className="auth-step-text">Billing</span>
              </div>
            </div>

            <form className="auth-form-card" onSubmit={(e) => e.preventDefault()}>
              {/* ---------------- STEP 1: ACCOUNT ---------------- */}
              {currentStep === 1 && (
                <div className="animate-fade-in">
                  <section className="auth-section">
                    <h3 className="auth-section-title">Primary Contact</h3>
                    <div className="auth-grid-3">
                      <div className="auth-group">
                        <label className="auth-label">Full Name</label>
                        <input
                          type="text"
                          name="fullName"
                          className="auth-input"
                          placeholder="John Doe"
                          value={formData.fullName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="auth-group">
                        <label className="auth-label">Business Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          className="auth-input"
                          placeholder={
                            formData.country === "India"
                              ? "+91 94413 88886"
                              : "+1 (555) 123-4567"
                          }
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="auth-group">
                        <label className="auth-label">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          className="auth-input"
                          placeholder="john@company.com"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </section>

                  <div className="auth-toggle-wrapper">
                    <label className="auth-toggle-label">
                      <div className="auth-toggle-input-wrapper">
                        <input
                          type="checkbox"
                          name="notifications"
                          className="auth-toggle-checkbox"
                          checked={formData.notifications}
                          onChange={handleInputChange}
                        />
                        <span className="auth-toggle-slider"></span>
                      </div>
                      <div className="auth-toggle-text">
                        <span className="auth-toggle-title">
                          Enable Priority Notifications
                        </span>
                        <span className="auth-toggle-desc">
                          Receive critical updates via SMS & WhatsApp
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* ---------------- STEP 2: VERIFY (Moved from Step 3) ---------------- */}
              {currentStep === 2 && (
                <div className="animate-fade-in">
                  <section className="auth-section">
                    <h3 className="auth-section-title">Business Verification</h3>
                    <div className="auth-grid-3">
                      <div className="auth-group">
                        <label className="auth-label">
                          Country of Registration
                        </label>
                        <div className="auth-select-wrapper">
                          <select
                            name="country"
                            className="auth-input auth-select"
                            value={formData.country}
                            onChange={handleCountryChange}
                          >
                            <option value="India">India</option>
                            <option value="USA">United States</option>
                            <option value="UK">United Kingdom</option>
                            <option value="UAE">UAE</option>
                          </select>
                        </div>
                      </div>

                      <div className="auth-group">
                        <label className="auth-label">{getLicenseLabel()}</label>
                        <input
                          type="text"
                          className="auth-input"
                          placeholder={getLicensePlaceholder()}
                        />
                      </div>

                      <div className="auth-group auth-action-group">
                        {formData.country === "USA" ? (
                          <div className="auth-upload-wrapper">
                            <input
                              type="file"
                              id="file-upload"
                              className="auth-file-input-hidden"
                              accept=".pdf,.jpg,.png"
                              onChange={handleFileUpload}
                            />
                            <label
                              htmlFor="file-upload"
                              className="btn-secondary"
                            >
                              Upload Doc
                            </label>
                            {fileName && (
                              <span className="auth-file-name">{fileName}</span>
                            )}
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="auth-btn-secondary auth-btn-sm"
                          >
                            Validate Now
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="auth-license-grid">
                      {currentLicenseOptions.map((option) => (
                        <label
                          key={option.value}
                          className={`auth-license-card ${
                            formData.licenseType === option.value
                              ? "auth-license-card-active"
                              : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name="licenseType"
                            className="auth-hidden-radio"
                            value={option.value}
                            checked={formData.licenseType === option.value}
                            onChange={handleInputChange}
                          />
                          <div className="auth-license-content">
                            <span className="auth-license-value">
                              {option.value}
                            </span>
                            <span className="auth-license-label">
                              {option.label}
                            </span>
                          </div>
                          {formData.licenseType === option.value && (
                            <div className="auth-check-icon">✓</div>
                          )}
                        </label>
                      ))}
                    </div>
                  </section>

                  <section className="auth-section">
                    <h3 className="auth-section-title">Registered Address</h3>
                    <div className="projects-grid">
                      <div className="auth-group auth-span-2">
                        <label className="auth-label">Street Address</label>
                        <input
                          type="text"
                          name="street"
                          className="auth-input"
                          placeholder="123 Business Street"
                          value={formData.street}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="auth-group">
                        <label className="auth-label">City</label>
                        <input
                          type="text"
                          name="city"
                          className="auth-input"
                          placeholder={
                            formData.country === "India"
                              ? "Bengaluru"
                              : "New York"
                          }
                          value={formData.city}
                          onChange={handleInputChange}
                        />
                      </div>
                      {formData.country === "USA" && (
                        <div className="auth-group">
                          <label className="auth-label">State</label>
                          <div className="auth-select-wrapper">
                            <select
                              name="state"
                              className="auth-input auth-select"
                              value={formData.state}
                              onChange={handleInputChange}
                            >
                              <option value="">Select State</option>
                              <option value="CA">California</option>
                              <option value="NY">New York</option>
                              <option value="TX">Texas</option>
                              <option value="FL">Florida</option>
                            </select>
                          </div>
                        </div>
                      )}
                      <div className="auth-group">
                        <label className="auth-label">
                          {formData.country === "USA"
                            ? "Zip Code"
                            : "Postal Code"}
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          className="auth-input"
                          placeholder={
                            formData.country === "USA" ? "10001" : "560001"
                          }
                          value={formData.zipCode}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {/* ---------------- STEP 3: BILLING (Moved from Step 2, Now Final) ---------------- */}
              {currentStep === 3 && (
                <div className="animate-fade-in">
                  <div className="row">
                    <div className="col-6">
                      <div className="payment-type-toggle">
                        <button
                          type="button"
                          className={`payment-toggle-btn ${
                            cardType === "credit" ? "active" : ""
                          }`}
                          onClick={() => setCardType("credit")}
                        >
                          Credit Card
                        </button>
                        <button
                          type="button"
                          className={`payment-toggle-btn ${
                            cardType === "debit" ? "active" : ""
                          }`}
                          onClick={() => setCardType("debit")}
                        >
                          Debit Card
                        </button>
                      </div>

                      <div className={`credit-card-preview ${cardType}`}>
                        <div className="card-glass-effect"></div>
                        <div className="card-content">
                          <div className="card-top">
                            <span className="card-chip"></span>
                            <span className="card-brand">{getCardBrand()}</span>
                          </div>
                          <div className="card-middle">
                            <div className="card-number-display">
                              {formData.cardNumber || "•••• •••• •••• ••••"}
                            </div>
                          </div>
                          <div className="card-bottom">
                            <div className="card-info-group">
                              <label>Card Holder</label>
                              <span>{formData.cardName || "YOUR NAME"}</span>
                            </div>
                            <div className="card-info-group right">
                              <label>Expires</label>
                              <span>{formData.cardExpiry || "MM/YY"}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="billing-layout">
                        <div className="billing-form-fields">
                          <div className="auth-group">
                            <label className="auth-label mb-0">
                              Card Number
                            </label>
                            <input
                              type="text"
                              name="cardNumber"
                              className="auth-input"
                              placeholder="0000 0000 0000 0000"
                              value={formData.cardNumber}
                              onChange={handleInputChange}
                              maxLength={19}
                            />
                          </div>
                          <div className="auth-group">
                            <label className="auth-label mt-3 mb-0">
                              Name on Card
                            </label>
                            <input
                              type="text"
                              name="cardName"
                              className="auth-input"
                              placeholder="As written on card"
                              value={formData.cardName}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="auth-grid-2">
                            <div className="auth-group">
                              <label className="auth-label mt-3 mb-0">
                                Expiry Date
                              </label>
                              <input
                                type="text"
                                name="cardExpiry"
                                className="auth-input"
                                placeholder="MM/YY"
                                value={formData.cardExpiry}
                                onChange={handleInputChange}
                                maxLength={5}
                              />
                            </div>
                            <div className="auth-group">
                              <label className="auth-label mt-3 mb-0">
                                CVV / CVC
                              </label>
                              <input
                                type="password"
                                name="cardCvv"
                                className="auth-input"
                                placeholder="123"
                                value={formData.cardCvv}
                                onChange={handleInputChange}
                                maxLength={4}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Navigation */}
              <footer className="auth-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={prevStep}
                  disabled={currentStep === 1 || isSubmitting || isVerifying}
                  style={{
                    opacity: currentStep === 1 ? 0 : 1,
                    pointerEvents: currentStep === 1 ? "none" : "auto",
                  }}
                >
                  Back
                </button>

                {/* --- Step 1 Button: Simple Next --- */}
                {currentStep === 1 && (
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={nextStep}
                  >
                    Next Step
                  </button>
                )}

                {/* --- Step 2 Button: Verify & Continue (With Loader) --- */}
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

                {/* --- Step 3 Button: Create Account (Final Submit) --- */}
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
              </footer>
            </form>

            <div className="auth-support-bar">
              Protected by 256-bit SSL encryption.{" "}
              <a href="#">Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>

      {/* --- Success Reward Modal (Appears after Billing) --- */}
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
                As a welcome bonus, we've added credits to your wallet.
              </p>
              <div className="alert-reward-box text-warning fs-2 text-center fw-bolder mb-2">
                <span className="reward-amount me-2">300</span>
                <span className="reward-label">Credits</span>
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
