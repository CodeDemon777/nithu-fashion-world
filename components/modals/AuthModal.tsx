"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useShop } from "@/context/ShopContext";
import {
  X,
  Lock,
  Mail,
  User,
  Phone,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  RefreshCw,
  Smartphone,
} from "lucide-react";

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalTab,
    setAuthModalTab,
    login,
    sendPhoneOtp,
    verifyPhoneOtp,
  } = useAuth();

  const { showToast, triggerConfetti } = useShop();

  // Registration form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // OTP Verification state
  const [signupStep, setSignupStep] = useState<"form" | "otp">("form");
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [demoOtp, setDemoOtp] = useState<string>("");
  const [otpCountdown, setOtpCountdown] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);

  // Reset step if tab switches
  useEffect(() => {
    setSignupStep("form");
    setError("");
    setOtpDigits(["", "", "", "", "", ""]);
  }, [authModalTab, isAuthModalOpen]);

  // Countdown timer for resending OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (signupStep === "otp" && otpCountdown > 0) {
      timer = setTimeout(() => {
        setOtpCountdown((prev) => prev - 1);
      }, 1000);
    } else if (otpCountdown === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [signupStep, otpCountdown]);

  if (!isAuthModalOpen) return null;

  // Handle Sign In submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await login(email, password);
      if (success) {
        showToast("Welcome back to NITHU FASHION WORLD.");
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to log in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 1: Send OTP to Phone
  const handleInitiateSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password || !phone.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, "");
    if (cleanPhone.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await sendPhoneOtp(cleanPhone, email, name);
      if (res.success) {
        setDemoOtp(res.previewOtp || "");
        setSignupStep("otp");
        setOtpCountdown(60);
        setCanResend(false);
        setOtpDigits(["", "", "", "", "", ""]);
        showToast(`Verification code sent to +91 ${cleanPhone.slice(-10)} 📱`);
      } else {
        setError(res.error || "Failed to send verification code.");
      }
    } catch (err: any) {
      setError(err.message || "Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // OTP 6-box input handlers
  const handleOtpChange = (index: number, val: string) => {
    const digit = val.replace(/[^0-9]/g, "").slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);

    if (digit && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
    if (pasted.length > 0) {
      const newDigits = [...otpDigits];
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pasted[i] || "";
      }
      setOtpDigits(newDigits);
      const focusIndex = Math.min(pasted.length, 5);
      document.getElementById(`otp-input-${focusIndex}`)?.focus();
    }
  };

  const fillOtp = (code: string) => {
    const digits = code.split("").slice(0, 6);
    setOtpDigits(digits);
    showToast("Filled verification code.");
  };

  // Step 2: Verify OTP & Complete Registration
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otpDigits.join("");
    if (fullCode.length !== 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await verifyPhoneOtp({
        phone: phone.replace(/[^0-9]/g, ""),
        code: fullCode,
        name,
        email,
        password,
      });

      if (res.success) {
        triggerConfetti();
        showToast(`Phone verified & Account created! Welcome, ${res.customer?.name || name} 🎉`);
        setSignupStep("form");
        setOtpDigits(["", "", "", "", "", ""]);
        setDemoOtp("");
      } else {
        setError(res.error || "Incorrect verification code. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to verify. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!canResend) return;
    setIsSubmitting(true);
    setError("");

    try {
      const cleanPhone = phone.replace(/[^0-9]/g, "");
      const res = await sendPhoneOtp(cleanPhone, email, name);
      if (res.success) {
        setDemoOtp(res.previewOtp || "");
        setOtpCountdown(60);
        setCanResend(false);
        showToast("New verification code sent! 📱");
      } else {
        setError(res.error || "Failed to resend code.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to resend code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={() => setIsAuthModalOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-blush z-10 space-y-5">
        <button
          onClick={() => setIsAuthModalOpen(false)}
          aria-label="Close"
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-cream-soft text-charcoal-muted hover:text-burgundy transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Switcher (Visible only when not on OTP verification screen) */}
        {signupStep === "form" && (
          <div className="flex border-b border-blush/80 pb-1">
            <button
              onClick={() => {
                setAuthModalTab("login");
                setError("");
              }}
              className={`flex-1 py-3 text-sm font-semibold text-center border-b-2 transition-all ${
                authModalTab === "login"
                  ? "border-burgundy text-burgundy font-serif text-base font-bold"
                  : "border-transparent text-charcoal-muted hover:text-charcoal"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setAuthModalTab("signup");
                setError("");
              }}
              className={`flex-1 py-3 text-sm font-semibold text-center border-b-2 transition-all ${
                authModalTab === "signup"
                  ? "border-burgundy text-burgundy font-serif text-base font-bold"
                  : "border-transparent text-charcoal-muted hover:text-charcoal"
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Header Tag */}
        <div className="text-center space-y-1">
          <span
            className="font-script text-burgundy text-2xl block"
            style={{ fontFamily: "var(--font-allura)" }}
          >
            {authModalTab === "login"
              ? "Welcome to NITHU FASHION WORLD"
              : signupStep === "otp"
              ? "Mobile Phone Verification"
              : "Join Our Creative Family"}
          </span>
          <h3
            className="text-xl font-serif text-charcoal font-bold"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            {authModalTab === "login"
              ? "Access Your Orders & Tailoring"
              : signupStep === "otp"
              ? "Enter 6-Digit OTP"
              : "Create Your Customer Account"}
          </h3>
          {signupStep === "otp" && (
            <p className="text-xs text-charcoal-muted leading-relaxed pt-1">
              We have sent a verification code to{" "}
              <strong className="text-charcoal font-semibold">+91 {phone.replace(/[^0-9]/g, "").slice(-10)}</strong>
            </p>
          )}
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs text-center font-medium animate-fadeIn">
            {error}
          </div>
        )}

        {/* ----------------- CASE 1: Sign In Tab ----------------- */}
        {authModalTab === "login" && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 w-4 h-4 text-burgundy" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-cream-soft text-charcoal text-xs pl-9 pr-3 py-2.5 rounded-xl border border-blush focus:border-burgundy outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 w-4 h-4 text-burgundy" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-cream-soft text-charcoal text-xs pl-9 pr-3 py-2.5 rounded-xl border border-blush focus:border-burgundy outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-burgundy hover:bg-burgundy-deep text-cream text-xs font-semibold uppercase tracking-wider rounded-full shadow-md hover:shadow-luxury transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 text-gold-light" />
                </>
              )}
            </button>
          </form>
        )}

        {/* ----------------- CASE 2: Sign Up - Step 1: Account Form ----------------- */}
        {authModalTab === "signup" && signupStep === "form" && (
          <form onSubmit={handleInitiateSignup} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">
                Full Name *
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3 w-4 h-4 text-burgundy" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sundaram"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-cream-soft text-charcoal text-xs pl-9 pr-3 py-2.5 rounded-xl border border-blush focus:border-burgundy outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">
                Email Address *
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 w-4 h-4 text-burgundy" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-cream-soft text-charcoal text-xs pl-9 pr-3 py-2.5 rounded-xl border border-blush focus:border-burgundy outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">
                Mobile Number (for SMS OTP Verification) *
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs font-bold text-burgundy border-r border-blush pr-2">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                  className="w-full bg-cream-soft text-charcoal text-xs pl-14 pr-3 py-2.5 rounded-xl border border-blush focus:border-burgundy outline-none font-medium"
                />
              </div>
              <span className="text-[10px] text-charcoal-muted mt-0.5 block">
                🔒 A 6-digit OTP will be sent to this phone number
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">
                Create Password *
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 w-4 h-4 text-burgundy" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-cream-soft text-charcoal text-xs pl-9 pr-3 py-2.5 rounded-xl border border-blush focus:border-burgundy outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-burgundy hover:bg-burgundy-deep text-cream text-xs font-semibold uppercase tracking-wider rounded-full shadow-md hover:shadow-luxury transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Sending SMS OTP...
                </span>
              ) : (
                <>
                  <Smartphone className="w-4 h-4 text-gold-light" />
                  <span>Send OTP & Verify Phone</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* ----------------- CASE 3: Sign Up - Step 2: OTP Verification Screen ----------------- */}
        {authModalTab === "signup" && signupStep === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            {/* Demo Helper Banner for testing verification instantly */}
            {demoOtp && (
              <div className="bg-[#FFF9F2] border border-gold/40 rounded-2xl p-3 flex items-center justify-between text-xs animate-fadeIn shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gold/20 flex items-center justify-center text-burgundy">
                    <Sparkles className="w-4 h-4 text-gold-dark" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-charcoal-muted block">SMS Verification Code:</span>
                    <span className="font-mono font-bold text-burgundy tracking-widest text-base select-all">
                      {demoOtp}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => fillOtp(demoOtp)}
                  className="px-3 py-1 bg-gold hover:bg-gold-light text-burgundy-deep font-bold rounded-full text-[10px] transition-all shadow-sm"
                >
                  Auto Fill
                </button>
              </div>
            )}

            {/* 6 Digit Input Boxes */}
            <div>
              <label className="block text-center text-xs font-semibold text-charcoal mb-3">
                Enter 6-Digit Verification Code
              </label>
              <div className="flex justify-between gap-2 max-w-[320px] mx-auto">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    onPaste={idx === 0 ? handleOtpPaste : undefined}
                    className="w-11 h-12 text-center text-lg font-bold font-mono bg-cream-soft rounded-xl border border-blush focus:border-burgundy focus:bg-white outline-none text-charcoal shadow-sm transition-all"
                  />
                ))}
              </div>
            </div>

            {/* Resend OTP & Change Number Controls */}
            <div className="flex items-center justify-between text-xs pt-1 px-1">
              <button
                type="button"
                onClick={() => {
                  setSignupStep("form");
                  setError("");
                }}
                className="text-charcoal-muted hover:text-burgundy flex items-center gap-1 font-medium transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change Mobile</span>
              </button>

              <div>
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isSubmitting}
                    className="text-burgundy font-bold hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Resend OTP</span>
                  </button>
                ) : (
                  <span className="text-charcoal-muted text-[11px]">
                    Resend in <strong className="text-burgundy font-bold">{otpCountdown}s</strong>
                  </span>
                )}
              </div>
            </div>

            {/* Verify CTA */}
            <button
              type="submit"
              disabled={isSubmitting || otpDigits.join("").length !== 6}
              className="w-full py-3.5 bg-burgundy hover:bg-burgundy-deep text-cream text-xs font-semibold uppercase tracking-wider rounded-full shadow-md hover:shadow-luxury transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Verifying with MongoDB Atlas...
                </span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Verify OTP & Sign In</span>
                </>
              )}
            </button>
          </form>
        )}


      </div>
    </div>
  );
};
