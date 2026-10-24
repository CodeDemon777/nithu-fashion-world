"use client";

import React, { useState } from "react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { FloralAccent } from "@/components/ui/FloralAccent";
import { useShop } from "@/context/ShopContext";
import { Diamond, Heart, Gift, Truck, ArrowRight, Sparkles, MessageCircle } from "lucide-react";

export const Hero: React.FC = () => {
  const { setIsBookingModalOpen } = useShop();
  const [activeSlide, setActiveSlide] = useState(1);

  const heroSlides = [
    {
      id: 1,
      tag: "Fashion | Embroidery | Arts & Crafts",
      headlineScript: "Creating You",
      image: "/images/hero/hero-model.jpg",
      badge: "Bridal Silk & Aari Work",
    },
    {
      id: 2,
      tag: "Custom Tailoring | Designer Blouses",
      headlineScript: "Perfect Fitting",
      image: "/images/categories/blouses.jpg",
      badge: "Handmade Embroidery",
    },
    {
      id: 3,
      tag: "Kids Party Wear | Artisan Gifts",
      headlineScript: "Precious Moments",
      image: "/images/categories/kids.jpg",
      badge: "Handcrafted with Love",
    },
  ];

  const currentSlide = heroSlides.find((s) => s.id === activeSlide) || heroSlides[0];

  return (
    <section className="relative bg-hero-burgundy text-cream-ivory overflow-hidden pt-6 sm:pt-10 pb-16 lg:pb-24 border-b border-[#720013]/60">
      {/* Background Decorative Gold Floral Vectors */}
      <FloralAccent
        variant="gold"
        position="left"
        className="absolute -left-12 top-0 w-64 md:w-96 h-auto opacity-20 pointer-events-none"
      />
      <FloralAccent
        variant="gold"
        position="right"
        className="absolute -right-12 bottom-12 w-64 md:w-96 h-auto opacity-25 pointer-events-none"
      />

      {/* Subtle Radial Glow */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#851525]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
          
          {/* Vertical Tag on Desktop Far Left */}
          <div className="hidden xl:flex lg:col-span-1 flex-col items-center justify-center space-y-6 select-none opacity-80">
            <div className="rotate-[-90deg] whitespace-nowrap text-[11px] tracking-[0.35em] uppercase font-medium text-gold-light">
              WEAR • CREATE • CELEBRATE YOU
            </div>
            <Heart className="w-3.5 h-3.5 fill-gold-light text-gold-light animate-pulse" />
          </div>

          {/* Left Content Area (Full Official Logo & Brand Presentation) */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 lg:pr-6">
            
            {/* Full Official Brand Logo Showcase Box - Completely Visible, Zero Cropping */}
            <div className="relative group w-full max-w-[380px] sm:max-w-[420px] rounded-3xl overflow-hidden bg-gradient-to-b from-[#4A0009]/90 to-[#2A0005]/95 border-2 border-gold/40 shadow-2xl p-4 sm:p-5 backdrop-blur-md transition-all duration-300 hover:border-gold hover:shadow-gold">
              {/* Subtle Ambient Gold Glow */}
              <div className="absolute inset-0 bg-gold/5 rounded-3xl pointer-events-none group-hover:bg-gold/10 transition-all" />
              
              {/* Official Brand Logo - 100% Full View */}
              <img
                src="/images/logo/logo.png"
                alt="NITHU FASHION WORLD Official Brand Logo - Stitching Dreams, Creating You"
                className="w-full h-auto object-contain max-h-[340px] drop-shadow-[0_8px_20px_rgba(200,155,90,0.35)] select-none"
              />
            </div>

            {/* Sub-eyebrow & Tagline */}
            <div className="space-y-2">
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <span className="w-8 h-[1px] bg-gold-light/60"></span>
                <span
                  className="text-[11px] sm:text-xs tracking-[0.25em] uppercase text-gold-light font-semibold"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  TRADITIONAL CRAFTSMANSHIP FOR A BRIGHTER YOU
                </span>
                <span className="w-8 h-[1px] bg-gold-light/60"></span>
              </div>

              <p className="text-xs sm:text-sm text-blush-soft/90 max-w-md font-medium tracking-wide">
                Bridal Silk Sarees • Custom Tailored Blouses • Handcrafted Aari Work & Bespoke Gifts
              </p>
            </div>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-1">
              <a
                href="#featured-collection"
                className="gold-shimmer-btn text-burgundy-deep font-bold text-xs sm:text-sm px-6 sm:px-7 py-3 sm:py-3.5 rounded-full shadow-gold hover:shadow-luxury-lg flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Explore Collections</span>
                <ArrowRight className="w-4 h-4 text-burgundy-deep" />
              </a>

              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="bg-transparent hover:bg-white/10 text-cream text-xs sm:text-sm font-semibold px-5 sm:px-6 py-3 sm:py-3.5 rounded-full border border-gold/60 hover:border-gold transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-gold-light" />
                <span>Explore Tailoring</span>
              </button>

              <a
                href="https://wa.me/917373848555?text=Hello%20Nithu%20Fashion%20World,%20I%20would%20like%20to%20order%20sarees%20and%20tailoring."
                target="_blank"
                rel="noreferrer"
                className="bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs sm:text-sm font-bold px-5 py-3 sm:py-3.5 rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp Order</span>
              </a>
            </div>
          </div>

          {/* Right Content Area (hero-model.jpg Showcased Completely Separately) */}
          <div className="lg:col-span-6 xl:col-span-5 relative flex flex-col items-center lg:items-end justify-center mt-6 lg:mt-0">
            
            {/* Top Right Script Flourish */}
            <div className="mb-3 text-center lg:text-right select-none hidden sm:block">
              <div
                className="text-xl sm:text-2xl font-script text-gold-light leading-tight drop-shadow"
                style={{ fontFamily: "var(--font-allura)" }}
              >
                Style Tradition Creativity You
              </div>
              <div className="flex justify-center lg:justify-end pr-2 pt-0.5">
                <Heart className="w-3.5 h-3.5 fill-gold-light text-gold-light animate-pulse" />
              </div>
            </div>

            {/* Arch-Framed Model Image Container - Standalone Showcase */}
            <div className="relative w-full max-w-[280px] sm:max-w-[340px] lg:max-w-[380px] aspect-[3/4] rounded-t-[140px] rounded-b-3xl overflow-hidden border-2 border-gold/60 shadow-2xl bg-burgundy-deep/80 group">
              <img
                src={currentSlide.image}
                alt="Nithu Fashion World Bridal Model - Saree & Aari Work Blouse"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />

              {/* Gradient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#2A0005]/95 via-transparent to-transparent pointer-events-none" />

              {/* Bottom Floating Pill on Image */}
              <div className="absolute bottom-4 left-4 right-4 bg-[#3D0008]/90 backdrop-blur-md border border-gold/40 rounded-xl p-3 flex items-center justify-between shadow-lg">
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-wider text-gold font-semibold">
                    Signature Craft
                  </div>
                  <div className="text-xs font-serif text-white font-medium">
                    {currentSlide.badge}
                  </div>
                </div>
                <a
                  href="#featured-collection"
                  className="w-7 h-7 rounded-full bg-gold/90 hover:bg-gold text-burgundy flex items-center justify-center transition-transform hover:scale-110"
                  aria-label="View collection"
                >
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Slider Switcher (01 - 02 - 03) */}
            <div className="mt-4 flex items-center gap-3 text-xs font-medium text-gold-light select-none">
              <span className="text-[10px] uppercase text-gold/70 tracking-wider">Collections:</span>
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  onClick={() => setActiveSlide(num)}
                  className={`transition-all py-0.5 px-1.5 rounded ${
                    activeSlide === num
                      ? "text-gold font-bold bg-gold/20 border border-gold/40 scale-105"
                      : "text-cream-ivory/60 hover:text-gold-light"
                  }`}
                >
                  0{num}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Hero Trust / USP Strip */}
        <div className="mt-14 pt-8 border-t border-gold/20 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 p-3 rounded-xl bg-burgundy-deep/30 border border-gold/15 hover:border-gold/40 transition-colors">
            <div className="w-8 h-8 rounded-full bg-gold/15 flex items-center justify-center text-gold">
              <Diamond className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-serif tracking-wide text-cream font-medium">
              Premium Quality
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 p-3 rounded-xl bg-burgundy-deep/30 border border-gold/15 hover:border-gold/40 transition-colors">
            <div className="w-8 h-8 rounded-full bg-gold/15 flex items-center justify-center text-gold">
              <Heart className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-serif tracking-wide text-cream font-medium">
              Handcrafted with Love
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 p-3 rounded-xl bg-burgundy-deep/30 border border-gold/15 hover:border-gold/40 transition-colors">
            <div className="w-8 h-8 rounded-full bg-gold/15 flex items-center justify-center text-gold">
              <Gift className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-serif tracking-wide text-cream font-medium">
              Best for Every Occasion
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 p-3 rounded-xl bg-burgundy-deep/30 border border-gold/15 hover:border-gold/40 transition-colors">
            <div className="w-8 h-8 rounded-full bg-gold/15 flex items-center justify-center text-gold">
              <Truck className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-serif tracking-wide text-cream font-medium">
              Fast Delivery Across TN
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
