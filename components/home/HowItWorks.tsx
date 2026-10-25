"use client";

import React from "react";
import { FloralAccent } from "@/components/ui/FloralAccent";
import { Heart, Compass, SlidersHorizontal, CreditCard, Sparkles, ArrowRight } from "lucide-react";

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: "1",
      title: "Choose",
      subtitle: "Explore our collections or services",
      icon: Compass,
    },
    {
      number: "2",
      title: "Customize",
      subtitle: "Select your preferences or share your design",
      icon: SlidersHorizontal,
    },
    {
      number: "3",
      title: "Place Order",
      subtitle: "Complete payment securely",
      icon: CreditCard,
    },
    {
      number: "4",
      title: "We Create & Deliver",
      subtitle: "Handcrafted with love to your doorstep",
      icon: Sparkles,
    },
  ];

  return (
    <section id="how-it-works" className="relative py-16 sm:py-24 bg-hero-burgundy text-cream-ivory overflow-hidden">
      
      {/* Background Floral Accents */}
      <FloralAccent
        variant="gold"
        position="left"
        className="absolute -left-16 top-1/2 -translate-y-1/2 w-64 h-auto opacity-15 pointer-events-none"
      />
      <FloralAccent
        variant="gold"
        position="right"
        className="absolute -right-16 top-1/2 -translate-y-1/2 w-64 h-auto opacity-15 pointer-events-none"
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12 sm:mb-16 text-left">
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-serif text-cream font-bold tracking-tight leading-tight"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            How We Craft Your Couture
          </h2>
          <p className="text-base sm:text-lg text-blush-soft mt-3 font-normal leading-relaxed">
            From heirloom silk selection and bridal fitting consultations to intricate hand-aari needlework in Komarapalayam.
          </p>
        </div>

        {/* Narrative Split: Authentic Loom Video on Left, 4-Step Process on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left: Authentic Silk Weaving Loop Video */}
          <div className="lg:col-span-5 relative rounded-3xl overflow-hidden aspect-[4/3] bg-[#3D0008]">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/videos/silk-weaving-in-thailand-poster.jpg"
              className="w-full h-full object-cover"
              aria-hidden="true"
            >
              <source src="/videos/silk-weaving-in-thailand.webm" type="video/webm" />
            </video>
            
            <div className="absolute bottom-4 left-4 right-4 bg-[#3D0008]/90 p-3 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-sm text-gold-light font-semibold">Master Loom &amp; Needlework</p>
                <p className="text-sm text-cream/80">Authentic Heritage Handcraft</p>
              </div>
              <Sparkles className="w-4 h-4 text-gold" />
            </div>
          </div>

          {/* Right: 4-Step Editorial Flow */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-5 rounded-2xl bg-[#3D0008] transition-colors reveal-card">
              <h3 className="text-xl sm:text-2xl font-serif text-cream font-bold" style={{ fontFamily: "var(--font-cormorant)" }}>
                1. Select Saree &amp; Custom Silhouette
              </h3>
              <p className="text-base text-blush-soft mt-1 leading-relaxed">
                Choose pure Kanchipuram silks or bring your bespoke bridal silhouette and fabric concept to our atelier.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#3D0008] transition-colors reveal-card" style={{ animationDelay: "0.1s" }}>
              <h3 className="text-xl sm:text-2xl font-serif text-cream font-bold" style={{ fontFamily: "var(--font-cormorant)" }}>
                2. Bespoke Measurements &amp; Fitting Guidance
              </h3>
              <p className="text-base text-blush-soft mt-1 leading-relaxed">
                Provide precise measurements online or request our expert WhatsApp video measurement consultation.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#3D0008] transition-colors reveal-card" style={{ animationDelay: "0.2s" }}>
              <h3 className="text-xl sm:text-2xl font-serif text-cream font-bold" style={{ fontFamily: "var(--font-cormorant)" }}>
                3. Intricate Aari &amp; Zardozi Embroidery
              </h3>
              <p className="text-base text-blush-soft mt-1 leading-relaxed">
                Master craftswomen bead fine metallic threads, pearls, and custom motifs with authentic generational skills.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#3D0008] transition-colors reveal-card" style={{ animationDelay: "0.3s" }}>
              <h3 className="text-xl sm:text-2xl font-serif text-cream font-bold" style={{ fontFamily: "var(--font-cormorant)" }}>
                4. Quality Inspection &amp; Doorstep Delivery
              </h3>
              <p className="text-base text-blush-soft mt-1 leading-relaxed">
                Every stitch is inspected for flawless comfort and finish, packed in luxury protection, and delivered across Tamil Nadu.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
