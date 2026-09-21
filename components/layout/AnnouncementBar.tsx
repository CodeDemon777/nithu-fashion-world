import React from "react";
import { Truck, ShieldCheck, Heart, Instagram, Facebook, Phone, MessageCircle } from "lucide-react";

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-[#4A0009] text-cream-ivory text-[11px] sm:text-xs py-2 px-4 sm:px-8 border-b border-burgundy-deep/60 relative z-40">
      <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left Announcements */}
        <div className="flex items-center flex-wrap justify-center sm:justify-start gap-4 sm:gap-6 font-medium tracking-wide">
          <div className="flex items-center gap-1.5 text-gold-light">
            <Truck className="w-3.5 h-3.5 text-gold" />
            <span>Delivering Across Tamil Nadu</span>
          </div>
          <span className="hidden md:inline text-gold/40">•</span>
          <div className="hidden sm:flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-gold" />
            <span>Secure Online Payments</span>
          </div>
          <span className="hidden lg:inline text-gold/40">•</span>
          <div className="hidden lg:flex items-center gap-1.5 text-blush">
            <Heart className="w-3.5 h-3.5 fill-blush text-blush" />
            <span>Handmade with Love</span>
          </div>
        </div>

        {/* Right Social & Contact */}
        <div className="flex items-center gap-4 text-cream/90 text-[11px]">
          <span className="hidden sm:inline text-gold-light/80 font-medium">Follow Us:</span>
          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/nithufashionworld?stkn=MTBrd253OWQ0Nmd2dA=="
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="hover:text-gold transition-colors"
            >
              <Instagram className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="hover:text-gold transition-colors"
            >
              <Facebook className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://wa.me/919585477733"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="hover:text-gold transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
            </a>
            <a
              href="tel:9585477733"
              className="flex items-center gap-1 text-gold-light font-semibold hover:text-white transition-colors ml-2"
            >
              <Phone className="w-3 h-3 text-gold" />
              <span>9585477733</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
