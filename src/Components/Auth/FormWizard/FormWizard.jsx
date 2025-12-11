// FormWizard.jsx
import React, { useState } from "react";
import "./FormWizard.css";
import StepChooseUserType from "./FormSteps/StepChooseUserType";
import StepBasicInfo from "./FormSteps/StepBasicInfo";
import StepDocuments from "./FormSteps/StepDocuments";
import StepProfileCompletion from "./FormSteps/StepProfileCompletion";

const STEPS = [
  "Choose User Type",
  "Basic Information",
  "Document Upload",
  "Profile Completion",
];

export default function FormWizard() {
  const [activeStep, setActiveStep] = useState(0);

  const [data, setData] = useState({
    userType: "employer",
    accountType: "company", // "individual" | "company"
    basicInfo: {},
    documents: {},
    profile: {},
  });

  const goNext = () =>
    setActiveStep((s) => Math.min(s + 1, STEPS.length - 1));
  
  const goBack = () =>
    setActiveStep((s) => Math.max(s - 1, 0));

  const patch = (partial) =>
    setData((prev) => ({ ...prev, ...partial }));

  const handleFinalSubmit = () => {
    console.log("Onboarding payload", data);
    // Add your API submit logic here
  };

  return (
    <div className="auth-container">
      <div className="auth-card wizard-auth-card">
        <div className="auth-form-side wizard-form-side">
          {/* Header */}
          <header className="wizard-page-header">
            <h1 className="wizard-page-title">Create Account</h1>
          </header>

          {/* Stepper Navigation */}
          <div className="wizard-header">
            {STEPS.map((label, index) => {
              const isActive = index === activeStep;
              const isCompleted = index < activeStep;
              return (
                <div
                  key={label}
                  className={`wizard-step ${
                    isActive ? "wizard-step--active" : ""
                  } ${isCompleted ? "wizard-step--completed" : ""}`}
                >
                  <div className="wizard-step-pill">
                    <span className="wizard-step-index">{index + 1}</span>
                    <span className="wizard-step-title">{label}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Step Components */}
          {activeStep === 0 && (
            <StepChooseUserType
              data={data}
              patch={patch}
              onNext={goNext}
            />
          )}
          {activeStep === 1 && (
            <StepBasicInfo
              data={data}
              patch={patch}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {activeStep === 2 && (
            <StepDocuments
              data={data}
              patch={patch}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {activeStep === 3 && (
            <StepProfileCompletion
              data={data}
              patch={patch}
              onBack={goBack}
              onSubmit={handleFinalSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}
