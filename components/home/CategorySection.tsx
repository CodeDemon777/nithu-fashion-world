"use client";

import React from "react";
import { CATEGORIES } from "@/lib/data";
import { useShop } from "@/context/ShopContext";
import { FloralAccent } from "@/components/ui/FloralAccent";
import { ArrowRight, Heart } from "lucide-react";

export const CategorySection: React.FC = () => {
  const { setActiveCategoryFilter, setIsBookingModalOpen } = useShop();

  const handleCategoryClick = (slug: string) => {
    if (slug === "tailoring") {
      setIsBookingModalOpen(true);
      return;
    }
    setActiveCategoryFilter(slug);
    const element = document.getElementById("featured-collection");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="categories" className="relative py-16 sm:py-20 bg-[#FFF7F0] overflow-hidden">
      {/* Decorative Botanical Flourish on Left */}
      <FloralAccent
        variant="burgundy"
        position="left"
        className="absolute -left-10 top-1/2 -translate-y-1/2 w-48 h-auto opacity-15 pointer-events-none"
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Side Decorative Vertical Ribbon (as in reference screenshot) */}
          <div className="hidden xl:flex flex-col items-center justify-center pr-4 select-none opacity-80 pt-10">
            <div className="rotate-[-90deg] whitespace-nowrap text-[12px] tracking-[0.25em] font-serif text-burgundy-wine font-medium">
              More Than Fashion • A Story of You
            </div>
            <Heart className="w-4 h-4 fill-burgundy text-burgundy mt-14" />
          </div>

          {/* Main Category Content Area */}
          <div className="flex-1 w-full">
            {/* Section Header */}
            <div className="flex items-end justify-between mb-10 pb-3 border-b border-blush/60">
              <div className="space-y-1">
                <span className="text-[11px] tracking-[0.25em] uppercase text-charcoal-muted font-semibold">
                  Handcrafted Collections
                </span>
                <h2
                  className="text-3xl sm:text-4xl lg:text-5xl font-serif text-charcoal flex items-baseline flex-wrap gap-2"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  <span>Shop by</span>
                  <span
                    className="font-script text-burgundy text-4xl sm:text-5xl lg:text-6xl font-normal leading-none ml-1"
                    style={{ fontFamily: "var(--font-allura)" }}
                  >
                    Category
                  </span>
                </h2>
              </div>

              <a
                href="#featured-collection"
                className="group flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-burgundy hover:text-burgundy-wine transition-colors pb-1"
              >
                <span>View All</span>
                <ArrowRight className="w-4 h-4 text-burgundy transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            {/* 8 Category Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3.5 sm:gap-4">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.slug)}
                  className="group cursor-pointer flex flex-col bg-white rounded-2xl p-2 sm:p-2.5 border border-[#F3D7CE]/70 shadow-sm hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1.5"
                >
                  {/* Category Image Box */}
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-cream-soft">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Hover Tint Overlay */}
                    <div className="absolute inset-0 bg-burgundy/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Category Name Label */}
                  <div className="pt-2.5 pb-1 text-center">
                    <h3
                      className="text-xs sm:text-[13px] font-medium text-charcoal group-hover:text-burgundy transition-colors leading-tight font-serif"
                      style={{ fontFamily: "var(--font-cormorant)", fontSize: "14px" }}
                    >
                      {cat.name}
                    </h3>
                    <p className="text-[10px] text-charcoal-muted mt-0.5 opacity-80">
                      {cat.itemCount}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
