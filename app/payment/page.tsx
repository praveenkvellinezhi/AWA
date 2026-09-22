"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDemo } from "@/lib/demo-context";
import {
  ShieldCheck,
  Lock,
  CreditCard,
  QrCode,
  Building2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  Check,
  Smartphone,
  RefreshCw,
} from "lucide-react";

type PlanType = "yearly" | "lifetime";
type PaymentMethod = "upi" | "card" | "netbanking";

interface PlanDetails {
  id: PlanType;
  name: string;
  badge: string;
  price: number;
  originalPrice: number;
  billingPeriod: string;
  description: string;
  features: string[];
}

const PLANS: Record<PlanType, PlanDetails> = {
  yearly: {
    id: "yearly",
    name: "AWA Unlimited Annual",
    badge: "Most Popular",
    price: 199,
    originalPrice: 999,
    billingPeriod: "Billed annually • ₹16.58 / mo",
    description: "Complete unrestricted access for designers, indie builders, and prompt engineers.",
    features: [
      "100% Unmasked Prompts & Shaders across all 5 Disciplines",
      "One-click copy for Midjourney, v0, ChatGPT & Figma",
      "Private MCP server access token with unlimited calls",
      "WebGL & CSS Canvas Backgrounds code export",
      "3 simultaneous device sessions",
      "Weekly template drops & changelog",
    ],
  },
  lifetime: {
    id: "lifetime",
    name: "Founder Lifetime Pass",
    badge: "Best Value",
    price: 999,
    originalPrice: 2999,
    billingPeriod: "One-time payment • Never pay again",
    description: "Pay once and own all future prompts, categories, and masterclasses forever.",
    features: [
      "Everything in Unlimited Annual included forever",
      "Lifetime updates with 0 future renewal fees",
      "Design Rocket Academy VIP Masterclass access",
      "Priority Discord & dedicated email support channel",
      "Commercial rights for client production deployments",
      "5 simultaneous device sessions",
    ],
  },
};

const POPULAR_BANKS = [
  { id: "hdfc", name: "HDFC Bank" },
  { id: "icici", name: "ICICI Bank" },
  { id: "sbi", name: "State Bank of India" },
  { id: "axis", name: "Axis Bank" },
  { id: "kotak", name: "Kotak Mahindra" },
];

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPlanParam = searchParams.get("plan");

  const {
    isSubscriber,
    subscriptionPlan,
    subscribeUser,
    simulatePaymentFailure,
    setSimulatePaymentFailure,
    user,
  } = useDemo();

  // Selected Plan state (defaults to yearly unless 'lifetime' is explicitly requested)
  const [selectedPlan, setSelectedPlan] = useState<PlanType>(
    initialPlanParam === "lifetime" ? "lifetime" : "yearly"
  );

  // Sync with searchParams when changed externally
  useEffect(() => {
    if (initialPlanParam === "lifetime") {
      setSelectedPlan("lifetime");
    } else if (initialPlanParam === "yearly") {
      setSelectedPlan("yearly");
    }
  }, [initialPlanParam]);

  // Payment Method selection
  const [activeMethod, setActiveMethod] = useState<PaymentMethod>("upi");

  // Form states
  const [fullName, setFullName] = useState(user?.displayName || "Alex Creator");
  const [email, setEmail] = useState(user?.email || "alex.creator@awa.guide");

  // Card details
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("888");
  const [cardName, setCardName] = useState("ALEX CREATOR");

  // UPI details
  const [upiId, setUpiId] = useState("alex@okhdfcbank");
  const [selectedBank, setSelectedBank] = useState("hdfc");

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState("");

  // Processing & Confirmation state
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [txnDetails, setTxnDetails] = useState<{
    id: string;
    amount: number;
    method: string;
    date: string;
  } | null>(null);

  const planInfo = PLANS[selectedPlan];

  // Price calculations
  const subtotal = planInfo.price;
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const netBeforeTax = Math.max(0, subtotal - discountAmount);
  const finalTotal = netBeforeTax;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    const code = couponCode.trim().toUpperCase();
    if (code === "AWA50" || code === "LAUNCH") {
      setAppliedCoupon({ code, discount: 50 });
      setCouponCode("");
    } else if (code === "PROMPT20") {
      setAppliedCoupon({ code, discount: 20 });
      setCouponCode("");
    } else {
      setCouponError("Invalid or expired coupon code. Try 'AWA50' or 'LAUNCH'.");
    }
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;

    setIsProcessing(true);
    setErrorMessage(null);

    // Realistic payment gateway verification latency (1.4 seconds)
    await new Promise((resolve) => setTimeout(resolve, 1400));

    if (simulatePaymentFailure) {
      setIsProcessing(false);
      setErrorMessage(
        "Payment declined by bank gateway. [Simulated Test Failure is turned ON in Demo Controls]. Toggle it OFF to proceed."
      );
      return;
    }

    // Success path
    const success = await subscribeUser(selectedPlan);
    setIsProcessing(false);

    if (success) {
      const generatedTxnId = "TXN-AWA-" + Math.floor(100000 + Math.random() * 900000);
      setTxnDetails({
        id: generatedTxnId,
        amount: finalTotal,
        method:
          activeMethod === "upi"
            ? `UPI (${upiId})`
            : activeMethod === "card"
            ? `Card (Ending in ${cardNumber.slice(-4)})`
            : `Net Banking (${selectedBank.toUpperCase()})`,
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
      setPaymentCompleted(true);
    } else {
      setErrorMessage("Could not complete subscription activation. Please try again.");
    }
  };

  // If payment succeeded, show the Receipt Confirmation Screen
  if (paymentCompleted && txnDetails) {
    return (
      <div className="min-h-screen bg-[#0c0d0f] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-zinc-400">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
            <Link href="/unlimited" className="hover:text-white transition-colors">
              Pricing
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
            <span className="text-emerald-400 font-semibold">Payment Success</span>
          </nav>

          {/* Success Card */}
          <div className="relative rounded-3xl border border-emerald-500/40 bg-gradient-to-b from-[#141d18] via-[#111614] to-[#0e100f] p-8 sm:p-10 shadow-2xl space-y-8 text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Checkmark Icon */}
            <div className="relative inline-flex items-center justify-center h-20 w-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/60 text-emerald-400 mx-auto shadow-lg shadow-emerald-950/40">
              <CheckCircle2 className="h-10 w-10 text-emerald-400" />
            </div>

            {/* Header */}
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                Payment Authorized &amp; Verified
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Welcome to AWA Unlimited!
              </h1>
              <p className="text-xs sm:text-sm text-zinc-300 max-w-md mx-auto leading-relaxed">
                Your subscription has been activated successfully. All 500+ production prompts, shaders, MCP tools, and canvas backgrounds are now completely unlocked.
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="rounded-2xl border border-zinc-800 bg-[#141518]/90 p-5 text-left space-y-3.5 text-xs text-zinc-300">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <span className="font-mono text-zinc-400">Transaction ID:</span>
                <span className="font-mono font-bold text-white">{txnDetails.id}</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <span className="text-zinc-400">Plan Activated:</span>
                <span className="font-bold text-rose-300">{planInfo.name}</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <span className="text-zinc-400">Amount Paid:</span>
                <span className="font-black text-base text-white">₹{txnDetails.amount}</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <span className="text-zinc-400">Payment Channel:</span>
                <span className="font-semibold text-zinc-200">{txnDetails.method}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Timestamp:</span>
                <span className="font-mono text-zinc-400">{txnDetails.date}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/templates/template-dark-mode-ai-saas"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-slate-950 text-white dark:bg-white dark:text-black font-bold text-xs sm:text-sm hover:bg-slate-800 dark:hover:bg-zinc-200 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Launch Unlocked Flagship</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-zinc-850 hover:bg-zinc-800 border border-zinc-700 text-xs sm:text-sm font-semibold text-zinc-200 hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <span>Browse All Templates</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0d0f] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-zinc-400">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
          <Link href="/unlimited" className="hover:text-white transition-colors">
            AWA Unlimited
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
          <span className="text-zinc-200 font-semibold">Secure Checkout</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-rose-400 flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5" />
                256-Bit SSL Encrypted Checkout
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <span>Complete Your Subscription</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
              Unlock the entire AWA prompt intelligence library and AI shader generator instantly.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-400 bg-zinc-900/90 border border-zinc-800 px-3.5 py-2 rounded-2xl shrink-0">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Official Razorpay &amp; Stripe Verified</span>
          </div>
        </div>

        {/* Alert if already subscriber */}
        {isSubscriber && (
          <div className="p-4 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 text-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <div>
                <strong className="text-white">You already have an active subscription!</strong>
                <p className="text-zinc-300">
                  Current plan: <span className="uppercase text-emerald-300 font-bold">{subscriptionPlan}</span>. You can change your plan or test payment below.
                </p>
              </div>
            </div>
            <Link
              href="/"
              className="px-3.5 py-1.5 rounded-full bg-emerald-500 text-black font-bold text-[11px] shrink-0"
            >
              Explore Catalog
            </Link>
          </div>
        )}

        {/* 2-Column Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Payment Methods & Billing (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Payment Method Selector Tabs */}
            <div className="rounded-3xl border border-zinc-800 bg-[#121316] p-6 space-y-6">
              <h2 className="text-sm font-bold text-zinc-200 uppercase tracking-wider font-mono flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-rose-400" />
                <span>Select Payment Method</span>
              </h2>

              {/* Method Selector Pills */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setActiveMethod("upi")}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col items-center sm:items-start gap-1.5 ${
                    activeMethod === "upi"
                      ? "bg-rose-950/30 border-rose-500 text-white shadow-lg shadow-rose-950/20"
                      : "bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-850"
                  }`}
                >
                  <QrCode className="h-5 w-5 text-rose-400" />
                  <span className="text-xs font-bold">UPI / QR</span>
                  <span className="text-[10px] text-zinc-500 hidden sm:inline">GPay, PhonePe, Paytm</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMethod("card")}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col items-center sm:items-start gap-1.5 ${
                    activeMethod === "card"
                      ? "bg-rose-950/30 border-rose-500 text-white shadow-lg shadow-rose-950/20"
                      : "bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-850"
                  }`}
                >
                  <CreditCard className="h-5 w-5 text-rose-400" />
                  <span className="text-xs font-bold">Cards</span>
                  <span className="text-[10px] text-zinc-500 hidden sm:inline">Credit &amp; Debit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMethod("netbanking")}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col items-center sm:items-start gap-1.5 ${
                    activeMethod === "netbanking"
                      ? "bg-rose-950/30 border-rose-500 text-white shadow-lg shadow-rose-950/20"
                      : "bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-850"
                  }`}
                >
                  <Building2 className="h-5 w-5 text-rose-400" />
                  <span className="text-xs font-bold">Net Banking</span>
                  <span className="text-[10px] text-zinc-500 hidden sm:inline">All Indian Banks</span>
                </button>
              </div>

              {/* METHOD 1: UPI / QR Code */}
              {activeMethod === "upi" && (
                <div className="space-y-4 pt-2 animate-in fade-in duration-200">
                  <div className="p-4 rounded-2xl border border-zinc-800 bg-[#0e0f12] flex flex-col sm:flex-row items-center gap-6">
                    {/* Simulated QR Code */}
                    <div className="p-3 rounded-2xl bg-white flex flex-col items-center shrink-0 shadow-lg">
                      <div className="h-28 w-28 bg-white flex items-center justify-center">
                        <svg viewBox="0 0 100 100" className="h-28 w-28 text-black" fill="currentColor">
                          <path d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z" />
                          <path d="M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z" />
                          <path d="M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z" />
                          <rect x="40" y="10" width="10" height="20" />
                          <rect x="60" y="40" width="20" height="10" />
                          <rect x="40" y="40" width="15" height="15" />
                          <rect x="20" y="40" width="10" height="20" />
                          <rect x="40" y="70" width="20" height="20" />
                          <rect x="70" y="70" width="20" height="10" />
                          <rect x="80" y="85" width="10" height="10" />
                        </svg>
                      </div>
                      <span className="text-[9px] font-mono font-bold text-black mt-1">SCAN WITH ANY APP</span>
                    </div>

                    <div className="space-y-2 text-center sm:text-left">
                      <span className="text-xs font-bold text-white flex items-center justify-center sm:justify-start gap-1.5">
                        <Smartphone className="h-4 w-4 text-emerald-400" />
                        <span>Instant UPI QR Scan</span>
                      </span>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Open Google Pay, PhonePe, Paytm or Cred on your phone to scan this QR code. Instant authorization with 0 convenience fee.
                      </p>
                      <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">GPay</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">PhonePe</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">Paytm</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">Cred</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-300">Or Enter Your UPI ID / VPA</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="username@okhdfcbank"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500/80"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Verified VPA
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* METHOD 2: Credit / Debit Card */}
              {activeMethod === "card" && (
                <div className="space-y-4 pt-2 animate-in fade-in duration-200">
                  {/* Interactive Card Visualizer */}
                  <div className="relative rounded-2xl p-5 bg-gradient-to-tr from-zinc-900 via-[#181622] to-rose-950/40 border border-zinc-700/80 text-white shadow-xl space-y-4 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black tracking-widest uppercase font-mono text-rose-300">
                        AWA CREATOR PASS
                      </span>
                      <div className="flex items-center gap-1.5">
                        <div className="h-6 w-9 rounded bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-[9px] font-bold text-amber-300">
                          CHIP
                        </div>
                      </div>
                    </div>

                    <div className="font-mono text-lg sm:text-xl tracking-widest text-zinc-200 pt-2">
                      {cardNumber || "•••• •••• •••• ••••"}
                    </div>

                    <div className="flex items-end justify-between text-xs font-mono">
                      <div>
                        <span className="text-[9px] text-zinc-400 block uppercase">Cardholder</span>
                        <span className="font-bold tracking-wider">{cardName || "YOUR NAME"}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-zinc-400 block uppercase">Expires</span>
                        <span className="font-bold">{cardExpiry || "MM/YY"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Form Inputs */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-zinc-300 block mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4242 4242 4242 4242"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500/80 font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-zinc-300 block mb-1">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="12/28"
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500/80 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-zinc-300 block mb-1">CVV / CVC</label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          placeholder="888"
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500/80 font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-zinc-300 block mb-1">Name on Card</label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Alex Creator"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500/80"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* METHOD 3: Net Banking */}
              {activeMethod === "netbanking" && (
                <div className="space-y-4 pt-2 animate-in fade-in duration-200">
                  <span className="text-xs font-semibold text-zinc-300 block">Select Your Bank</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {POPULAR_BANKS.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setSelectedBank(b.id)}
                        className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                          selectedBank === b.id
                            ? "bg-rose-950/40 border-rose-500 text-white shadow"
                            : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-850"
                        }`}
                      >
                        {b.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Billing Information Section */}
            <div className="rounded-3xl border border-zinc-800 bg-[#121316] p-6 space-y-4">
              <h2 className="text-sm font-bold text-zinc-200 uppercase tracking-wider font-mono">
                Billing Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-400 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-zinc-700"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-400 block mb-1">Email for Receipt</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-zinc-700"
                  />
                </div>
              </div>
            </div>

            {/* Simulation / Testing Toggle */}
            <div className="p-4 rounded-2xl border border-zinc-800 bg-[#0e0f12] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
                <div>
                  <span className="font-bold text-zinc-200">Simulate Payment Failure (Testing)</span>
                  <p className="text-[11px] text-zinc-500">Toggle on to test payment decline handler</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSimulatePaymentFailure(!simulatePaymentFailure)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  simulatePaymentFailure ? "bg-rose-500" : "bg-zinc-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${
                    simulatePaymentFailure ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-4 rounded-2xl border border-rose-500/50 bg-rose-950/30 text-xs text-rose-300 flex items-start gap-2.5 animate-in fade-in">
                <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Order Summary & Plan Selector (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Plan Switcher Box */}
            <div className="rounded-3xl border border-zinc-800 bg-[#121316] p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-zinc-200 uppercase tracking-wider font-mono">
                  Your Order
                </h2>
                <Link
                  href="/unlimited"
                  className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
                >
                  Change Plan
                </Link>
              </div>

              {/* Plan Choice Tabs */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setSelectedPlan("yearly")}
                  className={`w-full p-4 rounded-2xl border text-left transition-all relative ${
                    selectedPlan === "yearly"
                      ? "bg-gradient-to-r from-rose-950/40 to-orange-950/30 border-rose-500/80 shadow-md shadow-rose-950/30"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>Unlimited Annual</span>
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-mono">
                          Popular
                        </span>
                      </span>
                      <p className="text-[11px] text-zinc-400">₹16.58 / month • Billed annually</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-white">₹199</span>
                      <span className="text-[11px] text-zinc-500 line-through block">₹999</span>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPlan("lifetime")}
                  className={`w-full p-4 rounded-2xl border text-left transition-all relative ${
                    selectedPlan === "lifetime"
                      ? "bg-gradient-to-r from-purple-950/40 to-indigo-950/30 border-purple-500/80 shadow-md shadow-purple-950/30"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>Founder Lifetime Pass</span>
                        <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono">
                          Best Value
                        </span>
                      </span>
                      <p className="text-[11px] text-zinc-400">One-time payment • Never renews</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-white">₹999</span>
                      <span className="text-[11px] text-zinc-500 line-through block">₹2999</span>
                    </div>
                  </div>
                </button>
              </div>

              {/* Promo Code Input */}
              <form onSubmit={handleApplyCoupon} className="pt-2 border-t border-zinc-800">
                <label className="text-xs font-semibold text-zinc-400 block mb-1.5">Have a coupon code?</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="e.g. AWA50"
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white uppercase placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {appliedCoupon && (
                  <p className="text-xs text-emerald-400 mt-1.5 flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    <span>Coupon <strong>{appliedCoupon.code}</strong> applied (-₹{appliedCoupon.discount})</span>
                  </p>
                )}
                {couponError && <p className="text-xs text-rose-400 mt-1.5">{couponError}</p>}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-2.5 pt-3 border-t border-zinc-800 text-xs text-zinc-300">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Plan Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex items-center justify-between text-emerald-400">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-₹{appliedCoupon.discount}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-zinc-400">
                  <span>GST / Platform Taxes (18%)</span>
                  <span>Included</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-zinc-800 text-sm font-bold text-white">
                  <span>Total Amount Due</span>
                  <span className="text-xl font-black text-rose-300">₹{finalTotal}</span>
                </div>
              </div>

              {/* Pay Now Button */}
              <button
                type="button"
                onClick={handleProcessPayment}
                disabled={isProcessing}
                className="w-full py-3.5 rounded-full bg-slate-950 text-white dark:bg-white dark:text-black font-extrabold text-sm hover:bg-slate-800 dark:hover:bg-zinc-200 transition-all shadow-xl shadow-slate-950/20 dark:shadow-white/10 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-white dark:text-black" />
                    <span>Authorizing Payment with Bank...</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 text-white dark:text-black" />
                    <span>Pay ₹{finalTotal} Securely</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-zinc-500 text-center leading-relaxed">
                By clicking &quot;Pay Securely&quot;, you authorize AWA to process this charge. Instant activation with 7-day refund guarantee.
              </p>
            </div>

            {/* Included Features Bullet Points */}
            <div className="rounded-3xl border border-zinc-800 bg-[#121316] p-6 space-y-4">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">
                Included in your pass
              </span>
              <ul className="space-y-2.5 text-xs text-zinc-300">
                {planInfo.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0c0d0f] flex items-center justify-center text-zinc-400 text-xs">
          Loading secure checkout...
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
