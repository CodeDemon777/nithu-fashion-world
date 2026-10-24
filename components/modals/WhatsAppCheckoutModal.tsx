"use client";

import React, { useState } from "react";
import { useShop } from "@/context/ShopContext";
import {
  X,
  MessageCircle,
  ShoppingBag,
  ShieldCheck,
  Copy,
  Check,
  QrCode,
  ArrowRight,
  Truck,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export const WhatsAppCheckoutModal: React.FC = () => {
  const {
    isWhatsAppModalOpen,
    setIsWhatsAppModalOpen,
    directCheckoutItem,
    cart,
    cartTotal,
    clearCart,
    createOrder,
    triggerConfetti,
    showToast,
  } = useShop();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Komarapalayam");
  const [pincode, setPincode] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMode, setPaymentMode] = useState<"UPI" | "COD">("UPI");
  const [utrNumber, setUtrNumber] = useState("");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!isWhatsAppModalOpen) return null;

  // Determine active items
  const items = directCheckoutItem
    ? [
        {
          productId: directCheckoutItem.product.id,
          name: directCheckoutItem.product.name,
          image: directCheckoutItem.product.image,
          price: directCheckoutItem.product.price,
          quantity: directCheckoutItem.quantity,
          size: directCheckoutItem.selectedSize,
        },
      ]
    : cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        image: item.product.image,
        price: item.product.price,
        quantity: item.quantity,
        size: item.selectedSize || "Standard / Free Size",
      }));

  const totalAmount = directCheckoutItem
    ? directCheckoutItem.product.price * directCheckoutItem.quantity
    : cartTotal;

  const upiId = "7373848555@okbizaxis";
  const upiPayUrl = `upi://pay?pa=${upiId}&pn=NITHU%20FASHION%20WORLD&am=${totalAmount}&cu=INR&tn=NFW%20Order`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    showToast("UPI ID copied: 7373848555@okbizaxis");
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleCompleteWhatsAppOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      showToast("Please fill in your Name, Phone Number, and Delivery Address.");
      return;
    }

    const orderNumber = "NFW-" + Math.floor(100000 + Math.random() * 900000);

    // Format WhatsApp message
    let message = `🛍️ *NEW ORDER - NITHU FASHION WORLD*\n`;
    message += `─────────────────────────\n`;
    message += `📦 *Order ID:* #${orderNumber}\n`;
    message += `👤 *Customer:* ${fullName.trim()}\n`;
    message += `📱 *Phone / WhatsApp:* ${phone.trim()}\n`;
    message += `📍 *Delivery Address:* ${address.trim()}, ${city.trim()} - ${pincode.trim() || "Tamil Nadu"}\n`;
    message += `\n🛒 *Ordered Items:*\n`;

    items.forEach((item, index) => {
      message += `${index + 1}. *${item.name}*\n   Qty: ${item.quantity} | Size: ${item.size} | Price: ₹${(item.price * item.quantity).toLocaleString("en-IN")}\n`;
    });

    message += `─────────────────────────\n`;
    message += `💰 *Subtotal:* ₹${totalAmount.toLocaleString("en-IN")}\n`;
    message += `🚚 *Shipping:* FREE (Across Tamil Nadu)\n`;
    message += `💵 *Total Payable:* ₹${totalAmount.toLocaleString("en-IN")}\n`;
    message += `💳 *Payment Method:* ${paymentMode === "UPI" ? `UPI Paid (ID: ${upiId})` : "Pay on WhatsApp / Delivery"}\n`;
    if (utrNumber.trim()) {
      message += `🔖 *Payment Reference / UTR:* ${utrNumber.trim()}\n`;
    }
    if (notes.trim()) {
      message += `📝 *Custom Notes / Measurements:* ${notes.trim()}\n`;
    }
    message += `─────────────────────────\n`;
    message += `✨ Hello Nithu Fashion World, I would like to confirm this order. Please share tailoring/dispatch updates. Thank you!`;

    // Save to local orders list in context
    createOrder({
      customerName: fullName.trim(),
      customerEmail: `${phone.trim()}@customer.nfw`,
      customerPhone: phone.trim(),
      deliveryAddress: `${address.trim()}, ${city.trim()} - ${pincode.trim()}`,
      items: items,
      totalAmount: totalAmount,
      status: "In Tailoring",
      paymentMethod: paymentMode === "UPI" ? "UPI" : "COD",
      paymentStatus: paymentMode === "UPI" ? "Paid" : "Pending",
    });

    triggerConfetti();
    showToast("🎉 Order placed! Redirecting to WhatsApp...");

    if (!directCheckoutItem) {
      clearCart();
    }

    setIsWhatsAppModalOpen(false);

    // Open WhatsApp
    const waUrl = `https://wa.me/917373848555?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative bg-[#FFFBF7] w-full max-w-2xl rounded-3xl border border-blush shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#57000D] via-[#720013] to-[#3D0008] text-white flex items-center justify-between shadow-md flex-shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#25D366] flex items-center justify-center text-white shadow-lg flex-shrink-0">
              <MessageCircle className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  className="text-lg sm:text-xl font-serif font-bold text-cream tracking-wide"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  WhatsApp Checkout & Payment
                </h2>
                <span className="hidden sm:inline-block bg-[#25D366]/20 text-[#71FF9E] text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border border-[#25D366]/40">
                  Instant Support
                </span>
              </div>
              <p className="text-xs text-gold-light/90">
                Official Store WhatsApp: <span className="font-semibold">+91 7373848555</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsWhatsAppModalOpen(false)}
            aria-label="Close WhatsApp checkout"
            className="p-2 rounded-full hover:bg-white/10 text-cream/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <form onSubmit={handleCompleteWhatsAppOrder} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* 1. Order Summary Card */}
          <div className="bg-white rounded-2xl p-4 border border-blush/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-cream-warm pb-2">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-burgundy" />
                <span className="text-xs font-semibold text-charcoal uppercase tracking-wider">
                  Order Summary ({items.reduce((s, i) => s + i.quantity, 0)} Items)
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <Truck className="w-3 h-3" />
                <span>FREE Tamil Nadu Delivery</span>
              </div>
            </div>

            {/* Item list */}
            <div className="max-h-40 overflow-y-auto space-y-2 pr-1 divide-y divide-cream-warm">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3 pt-2 first:pt-0">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-11 h-11 rounded-lg object-cover border border-blush flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-medium text-charcoal truncate">{item.name}</h4>
                      <div className="text-[11px] text-charcoal-muted">
                        Qty: <span className="font-semibold text-charcoal">{item.quantity}</span> • {item.size}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-burgundy whitespace-nowrap">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </div>
                </div>
              ))}
            </div>

            {/* Total line */}
            <div className="pt-2 border-t border-cream-warm flex items-center justify-between">
              <span className="text-xs font-medium text-charcoal-muted">Total Amount</span>
              <span className="text-base sm:text-lg font-bold font-serif text-burgundy">
                ₹{totalAmount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* 2. Customer Delivery Details */}
          <div className="bg-white rounded-2xl p-4 border border-blush/80 shadow-sm space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-charcoal flex items-center gap-2">
              <span>Delivery Details</span>
              <span className="text-red-500">*</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-charcoal-muted mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sundaram"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-blush focus:border-burgundy focus:ring-1 focus:ring-burgundy outline-none bg-cream-soft"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-charcoal-muted mb-1">
                  WhatsApp / Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-blush focus:border-burgundy focus:ring-1 focus:ring-burgundy outline-none bg-cream-soft"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-charcoal-muted mb-1">
                  Street Address & Landmark *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Door No, Street Name, Landmark"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-blush focus:border-burgundy focus:ring-1 focus:ring-burgundy outline-none bg-cream-soft"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-charcoal-muted mb-1">
                  City / Town (Tamil Nadu) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Komarapalayam / Erode / Salem / Chennai"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-blush focus:border-burgundy focus:ring-1 focus:ring-burgundy outline-none bg-cream-soft"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-charcoal-muted mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  placeholder="e.g. 638183"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-blush focus:border-burgundy focus:ring-1 focus:ring-burgundy outline-none bg-cream-soft"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-charcoal-muted mb-1">
                  Custom Tailoring / Stitching Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Blouse size, preferred neck style, sleeve length, or delivery urgency..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-blush focus:border-burgundy focus:ring-1 focus:ring-burgundy outline-none bg-cream-soft resize-none"
                />
              </div>
            </div>
          </div>

          {/* 3. Payment Method Section with Instant UPI */}
          <div className="bg-white rounded-2xl p-4 border border-blush/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-charcoal">
                Payment Method
              </h3>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Zero Convenience Fee
              </span>
            </div>

            {/* Payment Mode Selector Tabs */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMode("UPI")}
                className={`p-3 rounded-xl border text-left transition-all ${
                  paymentMode === "UPI"
                    ? "border-emerald-600 bg-emerald-50/50 shadow-sm"
                    : "border-blush hover:border-burgundy/40 bg-cream-soft"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-charcoal">UPI Instant (GPay / PhonePe)</span>
                  {paymentMode === "UPI" && <Check className="w-4 h-4 text-emerald-600" />}
                </div>
                <p className="text-[10px] text-charcoal-muted mt-0.5">Pay via QR or UPI App</p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMode("COD")}
                className={`p-3 rounded-xl border text-left transition-all ${
                  paymentMode === "COD"
                    ? "border-emerald-600 bg-emerald-50/50 shadow-sm"
                    : "border-blush hover:border-burgundy/40 bg-cream-soft"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-charcoal">Pay on WhatsApp / Delivery</span>
                  {paymentMode === "COD" && <Check className="w-4 h-4 text-emerald-600" />}
                </div>
                <p className="text-[10px] text-charcoal-muted mt-0.5">Confirm order & pay later</p>
              </button>
            </div>

            {/* UPI Details Box */}
            {paymentMode === "UPI" && (
              <div className="p-3.5 rounded-xl bg-gradient-to-br from-cream to-[#FFF5EC] border border-gold/40 space-y-3 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gold-dark tracking-wider">
                      Official Store UPI ID
                    </span>
                    <div className="text-sm font-bold text-charcoal font-mono">{upiId}</div>
                    <div className="text-[11px] text-charcoal-muted">
                      Beneficiary: <span className="font-semibold text-burgundy">NITHU FASHION WORLD</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="px-3 py-1.5 bg-white border border-gold/60 hover:border-gold text-burgundy text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      {copiedUpi ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy UPI ID</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowQr(!showQr)}
                      className="px-3 py-1.5 bg-burgundy/10 hover:bg-burgundy/20 text-burgundy text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>{showQr ? "Hide QR" : "Show QR"}</span>
                    </button>
                  </div>
                </div>

                {/* Direct Pay Link for Mobile */}
                <div className="pt-2 border-t border-gold/20 flex flex-wrap items-center justify-between gap-2">
                  <a
                    href={upiPayUrl}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open in GPay / PhonePe / Paytm</span>
                  </a>
                  <span className="text-[11px] text-charcoal-muted">
                    Pay <span className="font-bold text-burgundy">₹{totalAmount.toLocaleString("en-IN")}</span>
                  </span>
                </div>

                {/* QR Code view */}
                {showQr && (
                  <div className="p-4 bg-white rounded-xl border border-blush text-center flex flex-col items-center justify-center animate-fadeIn">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                        upiPayUrl
                      )}`}
                      alt="Nithu Fashion World UPI QR Code"
                      className="w-40 h-40 rounded-lg border border-gold p-1 shadow-sm"
                    />
                    <p className="text-[11px] text-charcoal-muted mt-2 font-medium">
                      Scan with any UPI App (GPay, PhonePe, Paytm, BHIM) to pay ₹{totalAmount.toLocaleString("en-IN")}
                    </p>
                  </div>
                )}

                {/* Optional UTR Input */}
                <div>
                  <label className="block text-[11px] font-semibold text-charcoal-muted mb-1">
                    UPI Transaction / UTR Reference No. (Optional if already paid)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 427812984123"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-blush outline-none bg-white font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-sm sm:text-base font-bold uppercase tracking-wider rounded-2xl shadow-luxury-lg hover:shadow-2xl flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Complete Order on WhatsApp (₹{totalAmount.toLocaleString("en-IN")})</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-charcoal-muted pt-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Verified Store in Komarapalayam • Handcrafted Guarantee</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
