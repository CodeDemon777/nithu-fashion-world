"use client";

import React from "react";
import { useShop } from "@/context/ShopContext";
import { Scissors, Sparkles, Shirt, Palette, ArrowRight, Heart } from "lucide-react";

export const ServicesSection: React.FC = () => {
  const { setIsBookingModalOpen, setBookingPreselectService } = useShop();

  const services = [
    {
      id: "tailoring",
      name: "Tailoring for kids and womens",
      icon: Scissors,
      tag: "Custom Fitting",
    },
    {
      id: "embroidery",
      name: "Customized Embroidery",
      icon: Sparkles,
      tag: "Floral & Monograms",
    },
    {
      id: "aari",
      name: "Aari work for blouse and shirts",
      icon: Shirt,
      tag: "Bridal Zardozi",
    },
    {
      id: "crafts",
      name: "Customized Arts and crafts",
      icon: Palette,
      tag: "Handmade Gifts",
    },
  ];

  const handleBook = (serviceName: string) => {
    setBookingPreselectService(serviceName);
    setIsBookingModalOpen(true);
  };

  return (
    <section id="services" className="py-12 sm:py-16 bg-[#F3EFEA]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Left: Heading + 4 Service Items */}
          <div className="flex-1 w-full flex flex-col md:flex-row items-start md:items-center gap-6 lg:gap-10">
            
            {/* Section Title */}
            <div className="flex-shrink-0">
              <h2
                className="text-2xl sm:text-3xl lg:text-4xl font-serif text-charcoal font-bold tracking-tight"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Bespoke Tailoring &amp; Crafts
              </h2>
            </div>

            {/* 4 Service Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 flex-1 w-full">
              {services.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleBook(item.name)}
                    style={{ animationDelay: `${idx * 0.08}s` }}
                    className="group cursor-pointer flex items-center gap-3 p-3 rounded-2xl bg-white/90 hover:bg-white transition-colors duration-300 reveal-card"
                  >
                    {/* Circular Icon Avatar */}
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#E8DDD8] group-hover:bg-burgundy flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                      <IconComponent className="w-5 h-5 text-burgundy group-hover:text-gold-light transition-colors" />
                    </div>

                    {/* Service Name */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-serif font-medium text-charcoal group-hover:text-burgundy leading-snug line-clamp-2">
                        {item.name}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Bespoke CTA Box */}
          <div className="flex-shrink-0 flex flex-col items-center lg:items-end text-center lg:text-right pl-0 lg:pl-6">
            <div className="flex items-center gap-1.5 text-burgundy mb-2">
              <span className="text-sm font-semibold tracking-wide text-burgundy">
                Bespoke Tailoring Studio
              </span>
              <Heart className="w-3.5 h-3.5 fill-burgundy text-burgundy ml-0.5" />
            </div>

            <button
              onClick={() => handleBook("Custom Tailoring")}
              className="bg-burgundy hover:bg-burgundy-deep text-cream text-sm font-semibold px-6 py-2.5 rounded-full transition-colors flex items-center gap-2 group"
            >
              <span>Book a Service</span>
              <ArrowRight className="w-4 h-4 text-gold-light transition-transform group-hover:translate-x-1" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
