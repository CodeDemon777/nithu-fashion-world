import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Home, ShoppingBag, Scissors, MessageCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-20 px-4 bg-[#FFF7F0]">
      <div className="max-w-xl w-full text-center space-y-6 bg-white rounded-3xl p-8 sm:p-12 border border-blush shadow-card">
        {/* Brand Accent */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/15 border border-gold/40 text-gold-dark text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
          <span>NITHU FASHION WORLD</span>
        </div>

        <div className="space-y-2">
          <h1
            className="text-7xl sm:text-8xl font-serif text-burgundy font-bold tracking-tight"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            404
          </h1>
          <h2
            className="text-2xl sm:text-3xl font-serif text-charcoal font-bold"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Artisanal Design Not Found
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-muted max-w-md mx-auto leading-relaxed">
            The page or handcrafted piece you are searching for might have been moved, renamed, or is currently undergoing bespoke tailoring.
          </p>
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 py-3 px-4 bg-burgundy hover:bg-burgundy-deep text-cream text-xs font-semibold uppercase tracking-wider rounded-full shadow-md transition-all group"
          >
            <Home className="w-4 h-4 text-gold-light" />
            <span>Return to Store</span>
            <ArrowRight className="w-3.5 h-3.5 text-gold-light group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/account"
            className="flex items-center justify-center gap-2 py-3 px-4 bg-cream-soft hover:bg-blush-light text-burgundy border border-blush text-xs font-semibold uppercase tracking-wider rounded-full transition-all"
          >
            <ShoppingBag className="w-4 h-4 text-burgundy" />
            <span>Customer Portal</span>
          </Link>
        </div>

        {/* Tailoring Assistance Line */}
        <div className="pt-4 border-t border-cream-warm flex items-center justify-center gap-2 text-xs text-charcoal-muted">
          <span>Need custom stitching help?</span>
          <a
            href="https://wa.me/917373848555?text=Hello%20Nithu%20Fashion%20World,%20I%20need%20assistance%20finding%20a%20design"
            target="_blank"
            rel="noopener noreferrer"
            className="text-burgundy font-semibold hover:text-gold flex items-center gap-1"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp Us (+91 7373848555)</span>
          </a>
        </div>
      </div>
    </div>
  );
}
