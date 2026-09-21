"use client";

import React, { useState } from "react";
import { useShop } from "@/context/ShopContext";
import { X, Sparkles, Send, CheckCircle2, Phone, MessageCircle } from "lucide-react";

export const BookServiceModal: React.FC = () => {
  const {
    isBookingModalOpen,
    setIsBookingModalOpen,
    bookingPreselectService,
    showToast,
    triggerConfetti,
    addTailoringInquiry,
  } = useShop();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Komarapalayam");
  const [serviceType, setServiceType] = useState(
    bookingPreselectService || "Custom Bridal Blouse & Aari Work"
  );
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isBookingModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) {
      showToast("Please enter your name and contact phone number.");
      return;
    }

    addTailoringInquiry({
      fullName,
      phone,
      city,
      serviceType,
      notes,
    });

    setSubmitted(true);
    triggerConfetti();
    showToast("🎉 Service booking request received! We'll call you shortly.");
  };

  const handleClose = () => {
    setIsBookingModalOpen(false);
    setSubmitted(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Box */}
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-blush z-10">
        <button
          onClick={handleClose}
          aria-label="Close booking modal"
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-cream text-charcoal-muted hover:text-burgundy transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3
              className="text-2xl font-serif text-charcoal font-semibold"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Booking Request Received!
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-muted max-w-sm mx-auto leading-relaxed">
              Thank you, <strong className="text-burgundy">{fullName}</strong>. Our master artisan tailor from NITHU FASHION WORLD will contact you on <strong>{phone}</strong> to discuss your measurement and design preferences.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="https://wa.me/919585477733"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-semibold flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
              <button
                onClick={handleClose}
                className="w-full sm:w-auto px-6 py-2.5 bg-burgundy text-cream rounded-full text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-gold-dark text-xs font-semibold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Bespoke Tailoring & Crafts</span>
              </div>
              <h3
                className="text-2xl font-serif text-charcoal font-bold"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Book Custom Tailoring Service
              </h3>
              <p className="text-xs text-charcoal-muted">
                Share your design or measurement requirement with our master artisan team.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-charcoal mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Priya Sundaram"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-cream-soft text-charcoal text-xs p-3 rounded-xl border border-blush focus:border-burgundy outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-charcoal mb-1">
                  Phone / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-cream-soft text-charcoal text-xs p-3 rounded-xl border border-blush focus:border-burgundy outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-charcoal mb-1">
                  City / Town
                </label>
                <input
                  type="text"
                  placeholder="Komarapalayam, Erode, Salem..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-cream-soft text-charcoal text-xs p-3 rounded-xl border border-blush focus:border-burgundy outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-charcoal mb-1">
                Service Required
              </label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full bg-cream-soft text-charcoal text-xs p-3 rounded-xl border border-blush focus:border-burgundy outline-none cursor-pointer"
              >
                <option value="Custom Bridal Blouse & Aari Work">
                  Custom Bridal Blouse & Aari Work
                </option>
                <option value="Tailoring for Kids & Women">
                  Tailoring for Kids & Women
                </option>
                <option value="Customized Embroidery & Monogramming">
                  Customized Embroidery & Monogramming
                </option>
                <option value="Custom Arts & Crafts / Return Gifts">
                  Custom Arts & Crafts / Return Gifts
                </option>
                <option value="Festive Saree Draping & Tassels">
                  Festive Saree Draping & Tassels
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-charcoal mb-1">
                Design Details / Measurements (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Mention specific neck designs, sleeves, occasion date, or custom color requests..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-cream-soft text-charcoal text-xs p-3 rounded-xl border border-blush focus:border-burgundy outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-burgundy hover:bg-burgundy-deep text-cream text-xs font-semibold uppercase tracking-wider rounded-full shadow-md hover:shadow-luxury transition-all flex items-center justify-center gap-2 mt-2"
            >
              <Send className="w-4 h-4 text-gold-light" />
              <span>Submit Booking Request</span>
            </button>

            <div className="pt-2 text-center text-[11px] text-charcoal-muted">
              Direct Helpline:{" "}
              <a href="tel:9585477733" className="text-burgundy font-semibold">
                9585477733
              </a>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
