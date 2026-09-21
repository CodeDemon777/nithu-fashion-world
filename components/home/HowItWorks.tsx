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
    <section id="how-it-works" className="relative py-16 sm:py-20 bg-hero-burgundy text-cream-ivory overflow-hidden border-y border-[#720013]/60">
      
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
        
        <div className="flex flex-col lg:flex-row items-center gap-8">
          
          {/* Vertical Ribbon Left (from reference screenshot) */}
          <div className="hidden xl:flex flex-col items-center justify-center pr-4 select-none opacity-80">
            <div className="rotate-[-90deg] whitespace-nowrap text-[11px] tracking-[0.3em] uppercase font-medium text-gold-light">
              Your Style • Our Craft • Always Unique
            </div>
            <Heart className="w-3.5 h-3.5 fill-gold-light text-gold-light mt-14" />
          </div>

          {/* Main Steps Content */}
          <div className="flex-1 w-full text-center">
            
            {/* Header */}
            <div className="mb-12 space-y-1">
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-serif text-cream font-normal tracking-wide"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                How It Works
              </h2>
              <p
                className="text-lg sm:text-xl font-script text-gold-light italic"
                style={{ fontFamily: "var(--font-allura)" }}
              >
                From Your Heart to Your Hands
              </p>
              <div className="w-16 h-0.5 bg-gold/40 mx-auto mt-2" />
            </div>

            {/* 4 Steps Row with Connecting Arrows */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-4 relative">
              {steps.map((step, idx) => {
                const IconComponent = step.icon;
                return (
                  <div
                    key={step.number}
                    className="relative flex flex-col items-center p-4 rounded-2xl bg-burgundy-deep/30 border border-gold/15 hover:border-gold/40 backdrop-blur-sm transition-all duration-300 group"
                  >
                    {/* Circular Icon Container */}
                    <div className="relative mb-4">
                      <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-cream-ivory text-burgundy flex items-center justify-center shadow-gold group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-7 h-7 text-burgundy" />
                      </div>
                      
                      {/* Step Number Badge */}
                      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gold text-burgundy-deep text-xs font-bold flex items-center justify-center shadow-sm">
                        {step.number}
                      </div>
                    </div>

                    {/* Step Title & Description */}
                    <h3
                      className="text-base sm:text-lg font-serif text-cream font-medium mb-1.5"
                      style={{ fontFamily: "var(--font-cormorant)" }}
                    >
                      {step.number} {step.title}
                    </h3>
                    <p className="text-xs text-blush-soft/90 max-w-[200px] leading-relaxed">
                      {step.subtitle}
                    </p>

                    {/* Desktop Connecting Arrow between steps */}
                    {idx < steps.length - 1 && (
                      <div className="hidden lg:flex absolute top-10 -right-3 z-20 text-gold-light/60">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
