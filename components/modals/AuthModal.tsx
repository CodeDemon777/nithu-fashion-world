"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useShop } from "@/context/ShopContext";
import { X, Lock, Mail, User, Phone, ShieldCheck, Sparkles, ArrowRight, UserCheck } from "lucide-react";

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalTab,
    setAuthModalTab,
    login,
    signup,
    loginAsDemoAdmin,
    loginAsDemoCustomer,
  } = useAuth();

  const { showToast, triggerConfetti } = useShop();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (authModalTab === "login") {
      if (!email || !password) {
        setError("Please enter your email and password.");
        return;
      }
      login(email, password);
      showToast("Welcome back! ✨");
    } else {
      if (!name || !email || !password) {
        setError("Please fill in all required fields.");
        return;
      }
      signup(name, email, password, phone);
      triggerConfetti();
      showToast("Account created successfully! Welcome to NITHU FASHION WORLD ✨");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        onClick={() => setIsAuthModalOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-blush z-10">
        <button
          onClick={() => setIsAuthModalOpen(false)}
          aria-label="Close"
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-cream text-charcoal-muted hover:text-burgundy transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Switcher */}
        <div className="flex border-b border-blush/80 mb-6">
          <button
            onClick={() => {
              setAuthModalTab("login");
              setError("");
            }}
            className={`flex-1 py-3 text-sm font-semibold text-center border-b-2 transition-all ${
              authModalTab === "login"
                ? "border-burgundy text-burgundy font-serif text-base"
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
                ? "border-burgundy text-burgundy font-serif text-base"
                : "border-transparent text-charcoal-muted hover:text-charcoal"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Header Tag */}
        <div className="text-center mb-6">
          <span
            className="font-script text-burgundy text-2xl"
            style={{ fontFamily: "var(--font-allura)" }}
          >
            {authModalTab === "login"
              ? "Welcome to NITHU FASHION WORLD"
              : "Join Our Creative Journey"}
          </span>
          <h3
            className="text-xl font-serif text-charcoal font-bold mt-1"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            {authModalTab === "login"
              ? "Access Your Orders & Tailoring"
              : "Create Your Luxury Profile"}
          </h3>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs text-center font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authModalTab === "signup" && (
            <div>
              <label className="block text-xs font-medium text-charcoal mb-1">
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
          )}

          <div>
            <label className="block text-xs font-medium text-charcoal mb-1">
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

          {authModalTab === "signup" && (
            <div>
              <label className="block text-xs font-medium text-charcoal mb-1">
                Phone Number (WhatsApp)
              </label>
              <div className="relative flex items-center">
                <Phone className="absolute left-3 w-4 h-4 text-burgundy" />
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-cream-soft text-charcoal text-xs pl-9 pr-3 py-2.5 rounded-xl border border-blush focus:border-burgundy outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-charcoal mb-1">
              Password *
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
            className="w-full py-3.5 bg-burgundy hover:bg-burgundy-deep text-cream text-xs font-semibold uppercase tracking-wider rounded-full shadow-md hover:shadow-luxury transition-all flex items-center justify-center gap-2 mt-2"
          >
            <span>{authModalTab === "login" ? "Sign In" : "Create Account"}</span>
            <ArrowRight className="w-4 h-4 text-gold-light" />
          </button>
        </form>

        {/* 1-Click Quick Demo Login Box */}
        <div className="mt-6 pt-5 border-t border-blush/80">
          <div className="text-center text-[11px] font-semibold text-charcoal-muted uppercase tracking-wider mb-2.5">
            ⚡ Quick 1-Click Demo Logins
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => {
                loginAsDemoCustomer();
                showToast("Logged in as Customer (Priya) 🛍️");
              }}
              className="p-2.5 bg-cream-soft hover:bg-blush-light border border-blush rounded-xl text-center transition-all group"
            >
              <div className="text-xs font-semibold text-burgundy flex items-center justify-center gap-1">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Customer</span>
              </div>
              <span className="text-[10px] text-charcoal-muted">Priya Sundaram</span>
            </button>

            <button
              onClick={() => {
                loginAsDemoAdmin();
                showToast("Logged in as Store Admin 👑");
              }}
              className="p-2.5 bg-burgundy/10 hover:bg-burgundy/20 border border-burgundy/30 rounded-xl text-center transition-all group"
            >
              <div className="text-xs font-semibold text-burgundy-deep flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-gold-dark" />
                <span>Admin Portal</span>
              </div>
              <span className="text-[10px] text-charcoal-muted">Nithu Admin</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
