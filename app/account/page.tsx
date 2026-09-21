"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function CustomerAccountPage() {
  const { user, logout, updateProfile, setIsAuthModalOpen, loginAsDemoCustomer } = useAuth();
  const { orders, tailoringInquiries, wishlist, products, addToCart, showToast } = useShop();

  const [activeTab, setActiveTab] = useState<"orders" | "tailoring" | "wishlist" | "profile">("orders");

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

  // If user is not logged in, show elegant login prompt
  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 bg-[#FFF7F0]">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-blush shadow-card text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-blush/40 flex items-center justify-center mx-auto text-burgundy">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h1
              className="text-2xl sm:text-3xl font-serif text-charcoal font-bold"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Customer Portal
            </h1>
            <p className="text-xs text-charcoal-muted mt-1">
              Sign in to view your active saree orders, custom blouse stitching status, and saved designs.
            </p>
          </div>
          <div className="space-y-3 pt-2">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full py-3 bg-burgundy hover:bg-burgundy-deep text-cream text-xs font-semibold uppercase tracking-wider rounded-full shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Sign In / Register</span>
              <ArrowRight className="w-4 h-4 text-gold-light" />
            </button>
            <button
              onClick={() => {
                loginAsDemoCustomer();
                showToast("Logged in as Demo Customer (Priya) ✨");
              }}
              className="w-full py-2.5 bg-cream-soft hover:bg-blush-light text-burgundy border border-blush text-xs font-semibold rounded-full transition-all"
            >
              ⚡ Quick 1-Click Demo Login (Priya)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF7F0] py-10 sm:py-14">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        
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
            <span>My Orders ({orders.length})</span>
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
            <span>Tailoring & Aari Requests ({tailoringInquiries.length})</span>
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

        {/* Tab 1: Orders */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {orders.map((order) => {
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
            })}
          </div>
        )}

        {/* Tab 2: Tailoring & Aari Inquiries */}
        {activeTab === "tailoring" && (
          <div className="space-y-4">
            {tailoringInquiries.map((inq) => (
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
                    href={`https://wa.me/919500706295?text=Hello%20Nithu%20Fashion%20World,%20inquiring%20about%20my%20tailoring%20request%20${inq.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
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
