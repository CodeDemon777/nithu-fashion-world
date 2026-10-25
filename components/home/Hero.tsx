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
    <section className="relative bg-hero-burgundy text-cream-ivory overflow-hidden pt-6 sm:pt-10 pb-16 lg:pb-24">
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Content Area */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 lg:pr-4">
            
            {/* Full Official Brand Logo Showcase Box */}
            <div className="relative group w-full max-w-[360px] sm:max-w-[400px] rounded-2xl overflow-hidden bg-[#3D0008] p-4 sm:p-5 transition-colors duration-300">
              <img
                src="/images/logo/logo.png"
                alt="NITHU FASHION WORLD Official Brand Logo - Stitching Dreams, Creating You"
                className="w-full h-auto object-contain max-h-[300px] select-none mx-auto"
              />
            </div>

            {/* Clear, Prominent Display H1 Title & Tagline */}
            <div className="space-y-4">
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif text-cream font-bold tracking-tight leading-[1.0] max-w-none reveal-headline"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Bespoke Bridal Sarees &amp; Couture Tailoring
              </h1>

              <p className="text-base sm:text-lg text-blush-soft max-w-xl font-normal leading-relaxed reveal-subhead">
                Handcrafted Kanchipuram silks, precision-fit bridal blouses, authentic aari embroidery, and bespoke heirloom crafts in Komarapalayam.
              </p>
            </div>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2 reveal-cta">
              <a
                href="#featured-collection"
                className="bg-gold hover:bg-gold-light text-burgundy-deep font-bold text-sm px-7 py-3.5 rounded-full transition-colors flex items-center gap-2"
              >
                <span>Explore Collections</span>
                <ArrowRight className="w-4 h-4 text-burgundy-deep" />
              </a>

              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="bg-white/10 hover:bg-white/20 text-cream text-sm font-semibold px-6 py-3.5 rounded-full transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-gold-light" />
                <span>Explore Tailoring</span>
              </button>

              <a
                href="https://wa.me/917373848555?text=Hello%20Nithu%20Fashion%20World,%20I%20would%20like%20to%20order%20sarees%20and%20tailoring."
                target="_blank"
                rel="noreferrer"
                className="bg-[#075E54] hover:bg-[#128C7E] text-white text-sm font-bold px-6 py-3.5 rounded-full transition-colors flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp Order</span>
              </a>
            </div>
          </div>

          {/* Right Content Area (Hero Showcase & Slide Switcher) */}
          <div className="lg:col-span-5 relative flex flex-col items-center lg:items-end justify-center mt-6 lg:mt-0 reveal-media">

            {/* Arch-Framed Model Image Container */}
            <div className="relative w-full max-w-[320px] sm:max-w-[420px] lg:max-w-[460px] xl:max-w-[500px] aspect-[3/4] rounded-t-[140px] rounded-b-2xl overflow-hidden bg-[#3D0008] group">
              <img
                src={currentSlide.image}
                alt="Nithu Fashion World Bridal Model - Saree & Aari Work Blouse"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />

              {/* Bottom Floating Card on Image */}
              <div className="absolute bottom-4 left-4 right-4 bg-[#3D0008] rounded-xl p-3 flex items-center justify-between">
                <div className="text-left">
                  <div className="text-sm text-gold font-medium">
                    Artisan Showcase
                  </div>
                  <div className="text-base font-serif text-white font-medium">
                    {currentSlide.badge}
                  </div>
                </div>
                <a
                  href="#featured-collection"
                  className="w-8 h-8 rounded-full bg-gold hover:bg-gold-light text-burgundy flex items-center justify-center transition-transform hover:scale-110"
                  aria-label="View collection"
                >
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Collection Switcher Chips */}
            <div className="mt-4 flex flex-wrap items-center justify-center lg:justify-end gap-2 text-sm font-medium text-gold-light select-none">
              <span className="text-sm text-gold/80 mr-1">Showcase:</span>
              {heroSlides.map((slide) => (
                <button
                  key={slide.id}
                  onClick={() => setActiveSlide(slide.id)}
                  className={`py-1.5 px-3.5 rounded-full transition-colors text-sm ${
                    activeSlide === slide.id
                      ? "text-burgundy-deep font-bold bg-gold"
                      : "text-cream/90 hover:text-gold-light bg-burgundy-deep/80"
                  }`}
                >
                  {slide.badge}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Clean Editorial Trust Statement Bar */}
        <div className="mt-14 pt-6 flex flex-wrap items-center justify-around gap-6 text-cream/95 text-base font-medium">
          <div className="flex items-center gap-2">
            <Diamond className="w-4 h-4 text-gold-light" />
            <span>Pure Kanchipuram Weaving</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-gold-light" />
            <span>Bespoke Bridal Tailoring</span>
          </div>
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-gold-light" />
            <span>Handcrafted Aari Work</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-gold-light" />
            <span>Delivery Across Tamil Nadu</span>
          </div>
        </div>

      </div>
    </section>
  );
};
