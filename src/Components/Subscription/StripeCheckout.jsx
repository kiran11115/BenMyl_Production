import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { useConfirmPaymentMutation } from "../../State-Management/Api/PaymentApiSlice";

const StripeCheckout = ({
  formRef,
  selectedPkg,
  setIsAddTokensOpen,
  refetchDashboard,
  onPaymentSuccess,
  onLoadingChange,
  setShowStripe,
  setClientSecret,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [confirmPayment] = useConfirmPaymentMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error("Stripe is still loading...");
      return;
    }

    setLoading(true);
    if (onLoadingChange) onLoadingChange(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      toast.error(error.message || "Payment Failed");
      setLoading(false);
      if (onLoadingChange) onLoadingChange(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {

      const confirmPayload = {
    paymentIntentId: paymentIntent.id,
    paymentStatus: paymentIntent.status,
  };

  await confirmPayment(confirmPayload).unwrap();

      toast.success("Payment Successful!");

      // Refresh dashboard
      if (refetchDashboard) {
        refetchDashboard();
      }

      setShowStripe(false);
     setClientSecret("");

      // Parent callback
      if (onPaymentSuccess) {
        onPaymentSuccess(paymentIntent);
      }

      // Close modal
      if (setIsAddTokensOpen) {
        setIsAddTokensOpen(false);
      }
    } else {
      toast.warning("Payment is processing.");
    }

    setLoading(false);
    if (onLoadingChange) onLoadingChange(false);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>

      {/* Payment Element */}

      <div
        style={{
          padding: 16,
          border: "1px solid #E5E7EB",
          borderRadius: 10,
          marginBottom: 20,
          background: "#fff",
        }}
      >
        <PaymentElement />
      </div>

      {/* Summary row — Pay button is in the parent footer, so no duplicate button here */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 4,
          fontWeight: 600,
          fontSize: 16,
        }}
      >
        <span>
          {selectedPkg.tokens.toLocaleString()} Tokens
        </span>

        <span>
          ${selectedPkg.price}
        </span>
      </div>

      {/* Hidden submit trigger — actual Pay button is the parent footer button */}
      <button type="submit" style={{ display: "none" }} aria-hidden="true" />
    </form>
  );
};

export default StripeCheckout;