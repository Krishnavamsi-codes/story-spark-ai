import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, CreditCard, ShieldCheck } from "lucide-react";
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
    <div className="gradient-bg min-h-screen px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="motion-card rounded-[2rem] border border-slate-700/50 bg-slate-950/75 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-xl sm:p-8">
            <div className="mb-8 flex items-start justify-between gap-4">
              <div>
                <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
                  Secure checkout
                </span>
                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Complete Your Subscription
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                  Finish your upgrade with a clean, encrypted payment flow powered by Razorpay.
                </p>
              </div>
              <div className="hidden rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-cyan-300 sm:block">
                <CreditCard size={22} />
              </div>
            </div>

            {/* Razorpay pay button — opens the Razorpay checkout modal */}
            <button
              onClick={() => handlePayment(499)}
              className="motion-cta inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-4 text-base font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:shadow-cyan-500/30"
            >
              <ShieldCheck size={18} />
              ⚡ Pay ₹499 with Razorpay
            </button>

            <p className="mt-4 text-xs leading-5 text-slate-400">
              Your payment is securely processed by Razorpay. We never store your card details.
            </p>

            <Link
              to="/pricing"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-cyan-300"
            >
              <ArrowLeft size={16} />
              Back to Pricing
            </Link>
          </section>

          <aside className="motion-card rounded-[2rem] border border-slate-700/50 bg-slate-950/55 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-emerald-300">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">What you get</h2>
                <p className="text-sm text-slate-400">A quick summary before you confirm.</p>
              </div>
            </div>

            <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-slate-300">Premium subscription</span>
                <span className="text-lg font-semibold text-white">₹499/mo</span>
              </div>
              <div className="h-px bg-slate-800" />
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-cyan-300" />
                  Unlimited AI writing tools
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-cyan-300" />
                  Priority access to premium features
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-cyan-300" />
                  Cancel anytime from your account settings
                </li>
              </ul>
            </div>

            <div className="mt-6 rounded-3xl border border-cyan-400/10 bg-cyan-400/5 p-5">
              <p className="text-sm font-medium text-cyan-200">Need help?</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                If your payment fails, please try again or contact our support team.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PaymentComponent;