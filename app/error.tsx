"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, MessageCircle } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error boundary triggered:", error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-20 px-4 bg-[#FFF7F0]">
      <div className="max-w-md w-full text-center space-y-6 bg-white rounded-3xl p-8 border border-blush shadow-card">
        <div className="w-16 h-16 rounded-full bg-burgundy/10 flex items-center justify-center mx-auto text-burgundy">
          <AlertTriangle className="w-8 h-8 text-burgundy" />
        </div>

        <div className="space-y-2">
          <h1
            className="text-2xl sm:text-3xl font-serif text-charcoal font-bold"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Something Went Wrong
          </h1>
          <p className="text-xs text-charcoal-muted leading-relaxed">
            Our atelier encountered a momentary disruption. Your shopping session and cart details are safely retained.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full py-3 bg-burgundy hover:bg-burgundy-deep text-cream text-xs font-semibold uppercase tracking-wider rounded-full shadow-md transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4 text-gold-light" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="block w-full py-2.5 bg-cream-soft hover:bg-blush-light text-burgundy border border-blush text-xs font-semibold uppercase tracking-wider rounded-full transition-all text-center"
          >
            Return to Homepage
          </Link>
        </div>

        <div className="pt-4 border-t border-cream-warm text-[11px] text-charcoal-muted">
          Need urgent styling or tailoring help? Call{" "}
          <a href="tel:7373848555" className="text-burgundy font-bold underline">
            +91 7373848555
          </a>
        </div>
      </div>
    </div>
  );
}
