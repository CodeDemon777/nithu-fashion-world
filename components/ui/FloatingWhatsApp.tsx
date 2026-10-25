"use client";

import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export const FloatingWhatsApp: React.FC = () => {
  const officialWaNumber = "917373848555";
  const defaultMessage = encodeURIComponent(
    "Hello Nithu Fashion World, I would like to inquire about sarees, tailoring, and custom Aari embroidery work."
  );

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-2 pointer-events-auto">
      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/${officialWaNumber}?text=${defaultMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Nithu Fashion World on WhatsApp"
        className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-full transition-transform duration-300 hover:scale-105 active:scale-95"
      >
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 fill-current relative z-10" />
        <span className="sr-only">WhatsApp Chat</span>
      </a>
    </div>
  );
};
