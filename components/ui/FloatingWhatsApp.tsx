"use client";

import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export const FloatingWhatsApp: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  const officialWaNumber = "917373848555";
  const defaultMessage = encodeURIComponent(
    "Hello Nithu Fashion World, I would like to inquire about sarees, tailoring, and custom Aari embroidery work."
  );

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-2 pointer-events-auto">
      {/* Tooltip speech bubble */}
      {showTooltip && (
        <div className="relative bg-white text-charcoal text-xs px-3.5 py-2 rounded-2xl shadow-luxury border border-blush flex items-center gap-2 animate-fadeIn max-w-[220px]">
          <span className="font-medium">
            💬 Need help or custom stitching? <strong className="text-burgundy">Chat on WhatsApp</strong>
          </span>
          <button
            onClick={() => setShowTooltip(false)}
            aria-label="Dismiss message"
            className="text-charcoal-muted hover:text-charcoal p-0.5 rounded-full"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          {/* Arrow */}
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-r border-b border-blush rotate-45" />
        </div>
      )}

      {/* Pulsing Button */}
      <a
        href={`https://wa.me/${officialWaNumber}?text=${defaultMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Nithu Fashion World on WhatsApp"
        className="group relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95"
      >
        {/* Pulse Ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-70 animate-ping pointer-events-none" />

        <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 fill-current relative z-10" />

        <span className="sr-only">WhatsApp Chat</span>
      </a>
    </div>
  );
};
