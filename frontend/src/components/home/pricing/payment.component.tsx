import React from "react";
import { Link } from "react-router-dom";
import { loadRazorpayScript } from "../../../utils/loadRazorpay";

const PaymentComponent = () => {
  // Handles the full payment flow: load script → create order → open checkout → verify
  const handlePayment = async (amount: number) => {
    // Load the Razorpay checkout script dynamically
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      alert("Failed to load payment gateway. Please try again.");
      return;
    }

    // Create a new order on the backend
    let data;
    try {
      const res = await fetch("/api/v1/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      data = await res.json();
    } catch {
      alert("Network error. Please check your connection and try again.");
      return;
    }

    if (!data.success) {
      alert("Could not create order. Please try again.");
      return;
    }

    // Razorpay checkout configuration
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Public key from environment
      amount: data.order.amount,
      currency: data.order.currency,
      order_id: data.order.id,
      name: "StorySparkAI",
      description: "Premium Subscription",
      // Called by Razorpay after successful payment
      handler: async (response: any) => {
        // Verify the payment signature on the backend
        try {
          const verifyRes = await fetch("/api/v1/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            alert("Payment successful! Your subscription is now active.");
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        } catch {
          alert("Network error during verification. Please contact support.");
        }
      },
      theme: { color: "#2563eb" },
    };

    const rzp = new (window as any).Razorpay(options);
    // Handle payment failure
    rzp.on("payment.failed", () => {
      alert("Payment failed. Please try again.");
    });
    rzp.open();
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#0a0f1e" }}
    >
      <div
        className="flex flex-col items-center gap-8 p-12 rounded-2xl w-full max-w-md"
        style={{
          backgroundColor: "#0d1526",
          boxShadow: "0 0 40px rgba(37, 99, 235, 0.15)",
        }}
      >
        <h1 className="text-4xl font-extrabold tracking-tight leading-tight text-white text-center">
          Complete Your Subscription
        </h1>

        <p className="text-slate-400 text-lg text-center">
          Unlock premium features and take your storytelling to the next level.
        </p>

        <button
          onClick={() => handlePayment(499)}
          className="w-full sm:w-auto px-8 py-4 font-bold text-lg text-white rounded-xl flex items-center justify-center gap-2"
          style={{
            backgroundColor: "#2563eb",
            boxShadow: "0 0 20px rgba(37, 99, 235, 0.3)",
            transition: "transform 180ms ease, box-shadow 220ms ease, background-color 180ms ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1d4ed8";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 34px rgba(37, 99, 235, 0.52)";
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px) scale(1.01)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#2563eb";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 20px rgba(37, 99, 235, 0.3)";
            (e.currentTarget as HTMLButtonElement).style.transform = "translateZ(0)";
          }}
        >
          ⚡ Pay ₹499 with Razorpay
        </button>

        <Link
          to="/pricing"
          className="text-slate-400 text-center hover:text-white hover:underline transition-colors"
        >
          ← Back to Pricing
        </Link>
      </div>
    </div>
  );
};

export default PaymentComponent;