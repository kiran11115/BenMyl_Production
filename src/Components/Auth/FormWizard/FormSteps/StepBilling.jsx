import React from "react";

const StepBilling = ({
  formData,
  handleInputChange,
  cardType,
  setCardType,
  getCardBrand,
}) => {
  return (
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
                <label className="auth-label mb-0">Card Number</label>
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
                <label className="auth-label mt-3 mb-0">Name on Card</label>
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
                  <label className="auth-label mt-3 mb-0">Expiry Date</label>
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
                  <label className="auth-label mt-3 mb-0">CVV / CVC</label>
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
  );
};

export default StepBilling;
