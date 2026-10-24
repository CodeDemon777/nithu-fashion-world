"use client";

import React, { useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useShop } from "@/context/ShopContext";
import {
  User,
  ShoppingBag,
  Scissors,
  Heart,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  Truck,
  Sparkles,
  ArrowRight,
  LogOut,
  Save,
  MessageCircle,
  Lock,
  Key,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import Link from "next/link";

export default function CustomerAccountPage() {
  const {
    user,
    login,
    logout,
    updateProfile,
    setIsAuthModalOpen,
    setAuthModalTab,
    loginAsDemoCustomer,
  } = useAuth();
  const { orders, tailoringInquiries, wishlist, products, addToCart, showToast } = useShop();

  const [activeTab, setActiveTab] = useState<"orders" | "tailoring" | "wishlist" | "profile">("orders");

  // Customer Sign-In form state
  const [custEmail, setCustEmail] = useState("priya@example.com");
  const [custPassword, setCustPassword] = useState("");
  const [custLoginError, setCustLoginError] = useState("");
  const [isCustLoggingIn, setIsCustLoggingIn] = useState(false);

  // Filtered Orders for the logged-in customer (Authorization & Privacy)
  const myOrders = useMemo(() => {
    if (!user) return [];
    if (user.role === "admin") return orders;
    return orders.filter(
      (o) =>
        (o.customerEmail && o.customerEmail.toLowerCase() === user.email.toLowerCase()) ||
        (user.phone && o.customerPhone && o.customerPhone.includes(user.phone))
    );
  }, [orders, user]);

  // Filtered Tailoring Inquiries for the logged-in customer
  const myTailoring = useMemo(() => {
    if (!user) return [];
    if (user.role === "admin") return tailoringInquiries;
    return tailoringInquiries.filter(
      (t) =>
        (user.phone && t.phone && t.phone.includes(user.phone)) ||
        (user.name && t.fullName && t.fullName.toLowerCase().includes(user.name.toLowerCase()))
    );
  }, [tailoringInquiries, user]);

  // Profile Form state
  const [profileName, setProfileName] = useState(user?.name || "Priya Sundaram");
  const [profilePhone, setProfilePhone] = useState(user?.phone || "9876543210");
  const [profileCity, setProfileCity] = useState(user?.city || "Komarapalayam");
  const [profileAddress, setProfileAddress] = useState(
    user?.address || "14/B, Gandhi Nagar, Near Saree Market, Komarapalayam - 638183"
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: profileName,
      phone: profilePhone,
      city: profileCity,
      address: profileAddress,
    });
    showToast("Profile and delivery address updated! ✨");
  };

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleCustomerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!custEmail || !custPassword) {
      setCustLoginError("Please enter your email and password.");
      return;
    }
    setCustLoginError("");
    setIsCustLoggingIn(true);
    try {
      const success = await login(custEmail, custPassword);
      if (success) {
        showToast("Welcome to your Customer Portal! ✨");
      } else {
        setCustLoginError("Invalid credentials. Please verify your password.");
      }
    } catch (err: any) {
      setCustLoginError(err.message || "Failed to log in.");
    } finally {
      setIsCustLoggingIn(false);
    }
  };

  // If user is not logged in, show dedicated Customer Login Gate
  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 bg-[#FFF7F0]">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-blush shadow-card space-y-6 animate-fadeIn">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-blush/40 flex items-center justify-center mx-auto text-burgundy shadow-sm">
              <User className="w-8 h-8" />
            </div>
            <span className="text-[10px] uppercase tracking-wider font-bold bg-gold/15 text-gold-dark px-3 py-0.5 rounded-full border border-gold/30">
              Customer Portal
            </span>
            <h1
              className="text-2xl sm:text-3xl font-serif text-charcoal font-bold mt-1"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Sign In to Your Account
            </h1>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Track saree dispatches, custom blouse fittings, and manage delivery addresses.
            </p>
          </div>

          {/* Error Message */}
          {custLoginError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs text-center font-medium">
              {custLoginError}
            </div>
          )}

          {/* Customer Credentials Helper Badge */}
          <div className="bg-[#FFF9F3] rounded-2xl p-3.5 border border-gold/30 text-xs space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-burgundy">
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-gold-dark" />
                <span>Customer Demo Accounts</span>
              </span>
              <span className="text-[10px] text-charcoal-muted font-normal">MongoDB Atlas</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] bg-white p-2 rounded-xl border border-blush/60 font-mono">
              <button
                type="button"
                onClick={() => {
                  setCustEmail("priya@example.com");
                  setCustPassword("user123");
                  showToast("Filled Priya's Credentials ✨");
                }}
                className="text-left p-1 rounded hover:bg-cream-soft transition-colors"
              >
                <div className="font-sans font-bold text-burgundy">1. Priya (Customer)</div>
                <div className="text-charcoal-muted">priya@example.com</div>
                <div className="text-charcoal font-semibold">pass: user123</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCustEmail("divya@example.com");
                  setCustPassword("user123");
                  showToast("Filled Divya's Credentials ✨");
                }}
                className="text-left p-1 rounded hover:bg-cream-soft transition-colors"
              >
                <div className="font-sans font-bold text-burgundy">2. Divya (Customer)</div>
                <div className="text-charcoal-muted">divya@example.com</div>
                <div className="text-charcoal font-semibold">pass: user123</div>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleCustomerLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 w-4 h-4 text-burgundy" />
                <input
                  type="email"
                  required
                  placeholder="priya@example.com"
                  value={custEmail}
                  onChange={(e) => setCustEmail(e.target.value)}
                  className="w-full bg-cream-soft text-charcoal text-xs pl-9 pr-3 py-3 rounded-xl border border-blush focus:border-burgundy outline-none"
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
                  value={custPassword}
                  onChange={(e) => setCustPassword(e.target.value)}
                  className="w-full bg-cream-soft text-charcoal text-xs pl-9 pr-3 py-3 rounded-xl border border-blush focus:border-burgundy outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isCustLoggingIn}
              className="w-full py-3.5 bg-burgundy hover:bg-burgundy-deep text-cream text-xs font-semibold uppercase tracking-wider rounded-full shadow-md hover:shadow-luxury transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isCustLoggingIn ? (
                <span>Verifying credentials...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 text-gold-light" />
                </>
              )}
            </button>
          </form>

          {/* 1-Click Demo Shortcut & Register */}
          <div className="pt-4 border-t border-blush text-center space-y-2.5">
            <button
              type="button"
              onClick={() => {
                loginAsDemoCustomer();
                showToast("Logged in as Demo Customer (Priya) ✨");
              }}
              className="w-full py-2.5 bg-cream-soft hover:bg-blush-light text-burgundy border border-blush text-xs font-semibold rounded-full transition-all flex items-center justify-center gap-2"
            >
              <UserCheck className="w-3.5 h-3.5 text-burgundy" />
              <span>1-Click Quick Demo Login (Priya)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthModalTab("signup");
                setIsAuthModalOpen(true);
              }}
              className="w-full py-2 text-xs text-charcoal-muted hover:text-burgundy font-semibold block transition-colors"
            >
              New customer? Register for an account →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF7F0] py-10 sm:py-14">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        
        {/* Administrator Notice Banner */}
        {user.role === "admin" && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-burgundy via-burgundy-deep to-[#2A0005] text-cream border border-gold/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-luxury animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold flex-shrink-0">
                <ShieldCheck className="w-6 h-6 text-gold" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-gold-light flex items-center gap-1.5">
                  <span>Administrator Session Active</span>
                  <span className="text-[10px] bg-gold text-burgundy-deep px-1.5 py-0.2 rounded font-bold">Role: admin</span>
                </div>
                <div className="text-xs text-cream/80 mt-0.5">
                  You are logged in with full administrative privileges. You can manage products, customers, and Atlas synchronization.
                </div>
              </div>
            </div>
            <Link
              href="/admin"
              className="px-4 py-2 bg-gold text-burgundy-deep hover:bg-gold-light text-xs font-bold uppercase tracking-wider rounded-full shadow-gold transition-all whitespace-nowrap text-center"
            >
              Open Admin Console 👑
            </Link>
          </div>
        )}

        {/* Top Header & Customer Card */}
        <div className="bg-[#FFFBF7] rounded-3xl p-6 sm:p-8 border border-blush shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <img
              src={
                user.avatar ||
                "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
              }
              alt={user.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-gold shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-gold-dark bg-gold/10 px-2.5 py-0.5 rounded-full border border-gold/30">
                  {user.role === "admin" ? "Store Administrator 👑" : "Valued Customer ✨"}
                </span>
                <span className="text-[11px] text-charcoal-muted">
                  Member since {user.joinedDate || "2026"}
                </span>
              </div>
              <h1
                className="text-2xl sm:text-3xl font-serif text-charcoal font-bold mt-1"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Welcome, {user.name}
              </h1>
              <p className="text-xs text-charcoal-muted flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-burgundy" />
                <span>{user.city || "Komarapalayam, Tamil Nadu"}</span>
              </p>
            </div>
          </div>

          {/* Quick Action Links */}
          <div className="flex items-center gap-3">
            {user.role === "admin" && (
              <Link
                href="/admin"
                className="px-4 py-2 bg-burgundy-deep text-cream text-xs font-semibold rounded-full shadow-sm hover:shadow-md transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                <span>Admin Dashboard</span>
              </Link>
            )}
            <button
              onClick={logout}
              className="px-4 py-2 border border-blush hover:border-burgundy text-charcoal-muted hover:text-burgundy text-xs font-semibold rounded-full transition-all flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-blush/80 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase font-semibold text-charcoal-muted">
                Total Orders
              </div>
              <div className="text-2xl font-serif font-bold text-burgundy mt-1">
                {orders.length}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-blush/40 flex items-center justify-center text-burgundy">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-blush/80 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase font-semibold text-charcoal-muted">
                Tailoring Leads
              </div>
              <div className="text-2xl font-serif font-bold text-burgundy mt-1">
                {tailoringInquiries.length}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-blush/40 flex items-center justify-center text-burgundy">
              <Scissors className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-blush/80 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase font-semibold text-charcoal-muted">
                Saved Favorites
              </div>
              <div className="text-2xl font-serif font-bold text-burgundy mt-1">
                {wishlist.length}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-blush/40 flex items-center justify-center text-burgundy">
              <Heart className="w-5 h-5 fill-burgundy" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-blush/80 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase font-semibold text-charcoal-muted">
                Loyalty Points
              </div>
              <div className="text-2xl font-serif font-bold text-burgundy mt-1">
                320 pts
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center text-gold">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-blush mb-8 gap-2 sm:gap-6 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "orders"
                ? "border-burgundy text-burgundy font-serif text-base"
                : "border-transparent text-charcoal-muted hover:text-charcoal"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>My Orders ({myOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("tailoring")}
            className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "tailoring"
                ? "border-burgundy text-burgundy font-serif text-base"
                : "border-transparent text-charcoal-muted hover:text-charcoal"
            }`}
          >
            <Scissors className="w-4 h-4" />
            <span>Tailoring & Aari Requests ({myTailoring.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("wishlist")}
            className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "wishlist"
                ? "border-burgundy text-burgundy font-serif text-base"
                : "border-transparent text-charcoal-muted hover:text-charcoal"
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Wishlist ({wishlist.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "profile"
                ? "border-burgundy text-burgundy font-serif text-base"
                : "border-transparent text-charcoal-muted hover:text-charcoal"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile & Delivery Address</span>
          </button>
        </div>

        {/* Tab 1: Orders (Scoped to authenticated customer) */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {myOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 sm:p-12 border border-blush text-center space-y-4">
                <ShoppingBag className="w-12 h-12 text-burgundy/40 mx-auto" />
                <h3 className="text-lg font-serif font-bold text-charcoal">No Orders Placed Yet</h3>
                <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
                  Browse our handcrafted collection of Kanchipuram sarees, designer blouses, and festive wear to place your first bespoke order.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-burgundy hover:bg-burgundy-deep text-cream text-xs font-semibold rounded-full shadow-sm transition-all"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gold-light" />
                </Link>
              </div>
            ) : (
              myOrders.map((order) => {
              const statusSteps = ["Processing", "In Tailoring", "Dispatched", "Delivered"];
              const currentStepIdx = statusSteps.indexOf(order.status);

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-blush shadow-card space-y-6"
                >
                  {/* Order Top Meta */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-cream-warm gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase font-semibold text-charcoal-muted">
                          Order No:
                        </span>
                        <span className="text-sm font-bold font-serif text-burgundy">
                          {order.orderNumber}
                        </span>
                      </div>
                      <div className="text-xs text-charcoal-muted mt-0.5 flex items-center gap-3">
                        <span>Placed on: {order.createdAt}</span>
                        <span>•</span>
                        <span>Payment: {order.paymentMethod} ({order.paymentStatus})</span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-burgundy/10 text-burgundy border border-burgundy/20">
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Visual 4-Step Tracking Timeline */}
                  <div className="py-2">
                    <div className="grid grid-cols-4 gap-2 relative">
                      {statusSteps.map((step, idx) => {
                        const isCompleted = currentStepIdx >= idx;
                        const isCurrent = currentStepIdx === idx;
                        return (
                          <div key={step} className="flex flex-col items-center text-center relative z-10">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                isCompleted
                                  ? "bg-burgundy text-gold-light shadow-sm"
                                  : "bg-cream-warm text-charcoal-muted border border-blush"
                              } ${isCurrent ? "ring-4 ring-gold/30" : ""}`}
                            >
                              {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                            </div>
                            <span
                              className={`text-[10px] sm:text-xs mt-1.5 font-medium ${
                                isCompleted ? "text-burgundy font-semibold" : "text-charcoal-muted"
                              }`}
                            >
                              {step}
                            </span>
                          </div>
                        );
                      })}
                      {/* Connecting line */}
                      <div className="absolute top-4 left-6 right-6 h-0.5 bg-cream-warm -z-0" />
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-3 pt-2">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-2xl bg-cream-soft/70 border border-blush/60"
                      >
                        <div className="flex items-center gap-3.5">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 rounded-xl object-cover border border-blush"
                          />
                          <div>
                            <h4 className="text-xs sm:text-sm font-serif font-semibold text-charcoal">
                              {item.name}
                            </h4>
                            <div className="text-[11px] text-charcoal-muted">
                              Qty: {item.quantity} | {item.size || "Standard"}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs sm:text-sm font-bold text-burgundy">
                            ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Address & Total Summary */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-cream-warm gap-4 text-xs text-charcoal-muted">
                    <div className="flex items-start gap-2 max-w-md">
                      <MapPin className="w-4 h-4 text-burgundy flex-shrink-0 mt-0.5" />
                      <span>{order.deliveryAddress}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-charcoal-muted">Total Paid: </span>
                      <span className="text-base font-bold font-serif text-burgundy">
                        ₹{order.totalAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                </div>
              );
            })
            )}
          </div>
        )}

        {/* Tab 2: Tailoring & Aari Inquiries (Scoped to authenticated customer) */}
        {activeTab === "tailoring" && (
          <div className="space-y-4">
            {myTailoring.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 sm:p-12 border border-blush text-center space-y-4">
                <Scissors className="w-12 h-12 text-burgundy/40 mx-auto" />
                <h3 className="text-lg font-serif font-bold text-charcoal">No Tailoring Inquiries Yet</h3>
                <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
                  Need a custom bridal blouse, Maggam/Aari embroidery work, or dress fitting? Book a consultation with our master craftswomen.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-burgundy hover:bg-burgundy-deep text-cream text-xs font-semibold rounded-full shadow-sm transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-gold-light" />
                  <span>Book Custom Stitching</span>
                </Link>
              </div>
            ) : (
              myTailoring.map((inq) => (
              <div
                key={inq.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-blush shadow-card space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-cream-warm">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-gold-dark bg-gold/10 px-2.5 py-0.5 rounded-full">
                      {inq.status}
                    </span>
                    <h3
                      className="text-lg font-serif font-bold text-charcoal mt-1.5"
                      style={{ fontFamily: "var(--font-cormorant)" }}
                    >
                      {inq.serviceType}
                    </h3>
                  </div>
                  <span className="text-xs text-charcoal-muted">
                    Submitted: {inq.createdAt}
                  </span>
                </div>

                <div className="bg-cream-soft p-4 rounded-2xl text-xs text-charcoal leading-relaxed">
                  <strong className="text-burgundy">Client Request Notes:</strong>{" "}
                  {inq.notes || "No additional custom instructions provided."}
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
                  <div className="text-xs text-charcoal-muted">
                    City: <strong>{inq.city}</strong> | Phone: <strong>{inq.phone}</strong>
                  </div>

                  <a
                    href={`https://wa.me/917373848555?text=Hello%20Nithu%20Fashion%20World,%20inquiring%20about%20my%20tailoring%20request%20${inq.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </div>
            ))
            )}
          </div>
        )}

        {/* Tab 3: Wishlist */}
        {activeTab === "wishlist" && (
          <div>
            {wishlistedProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-blush">
                <Heart className="w-10 h-10 text-burgundy mx-auto mb-2" />
                <h3 className="text-lg font-serif font-semibold text-charcoal">
                  Your Wishlist is Empty
                </h3>
                <p className="text-xs text-charcoal-muted mt-1">
                  Browse the collection and tap the heart icon to save items.
                </p>
                <Link
                  href="/#featured-collection"
                  className="inline-block mt-4 px-6 py-2.5 bg-burgundy text-cream text-xs font-semibold rounded-full"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {wishlistedProducts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl p-3 border border-blush shadow-sm flex flex-col justify-between"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full aspect-square rounded-xl object-cover mb-2"
                    />
                    <div>
                      <h4 className="text-xs font-serif font-semibold text-charcoal line-clamp-1">
                        {p.name}
                      </h4>
                      <div className="text-xs font-bold text-burgundy mt-0.5">
                        ₹{p.price.toLocaleString("en-IN")}
                      </div>
                    </div>
                    <button
                      onClick={() => addToCart(p)}
                      className="mt-3 w-full py-2 bg-burgundy text-cream text-xs font-semibold rounded-full flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-gold-light" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Profile & Address */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blush shadow-card max-w-2xl">
            <h2
              className="text-2xl font-serif font-bold text-charcoal mb-4"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Edit Profile & Delivery Details
            </h2>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-charcoal mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full bg-cream-soft text-charcoal text-xs p-3 rounded-xl border border-blush focus:border-burgundy outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full bg-cream-soft text-charcoal text-xs p-3 rounded-xl border border-blush focus:border-burgundy outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">
                    City / Town (Tamil Nadu)
                  </label>
                  <input
                    type="text"
                    value={profileCity}
                    onChange={(e) => setProfileCity(e.target.value)}
                    className="w-full bg-cream-soft text-charcoal text-xs p-3 rounded-xl border border-blush focus:border-burgundy outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-charcoal mb-1">
                  Default Delivery Address
                </label>
                <textarea
                  rows={3}
                  value={profileAddress}
                  onChange={(e) => setProfileAddress(e.target.value)}
                  className="w-full bg-cream-soft text-charcoal text-xs p-3 rounded-xl border border-blush focus:border-burgundy outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="px-8 py-3 bg-burgundy hover:bg-burgundy-deep text-cream text-xs font-semibold uppercase tracking-wider rounded-full shadow-md flex items-center gap-2"
              >
                <Save className="w-4 h-4 text-gold-light" />
                <span>Save Profile Changes</span>
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
