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
    <section id="categories" className="relative py-16 sm:py-20 bg-[#F8F7F5] overflow-hidden">
      {/* Decorative Botanical Flourish on Left */}
      <FloralAccent
        variant="burgundy"
        position="left"
        className="absolute -left-10 top-1/2 -translate-y-1/2 w-48 h-auto opacity-15 pointer-events-none"
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 relative z-10">
        <div className="w-full">
            {/* Section Header */}
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2
                  className="text-3xl sm:text-4xl lg:text-5xl font-serif text-charcoal font-bold tracking-tight"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  Shop Handcrafted Categories
                </h2>
              </div>

              <a
                href="#featured-collection"
                className="group flex items-center gap-1.5 text-sm font-semibold text-burgundy hover:text-burgundy-wine transition-colors pb-1"
              >
                <span>View All Categories</span>
                <ArrowRight className="w-4 h-4 text-burgundy transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            {/* 8 Category Cards Responsive Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-3 sm:gap-4">
              {CATEGORIES.map((cat, idx) => (
                <div
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.slug)}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                  className="group cursor-pointer flex flex-col bg-white rounded-2xl p-2.5 transition-colors duration-300 reveal-card"
                >
                  {/* Category Image Box */}
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#FAF7F2]">
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
                      className="text-sm font-medium text-charcoal group-hover:text-burgundy transition-colors leading-tight font-serif"
                      style={{ fontFamily: "var(--font-cormorant)" }}
                    >
                      {cat.name}
                    </h3>
                    <p className="text-sm text-charcoal-muted mt-0.5">
                      {cat.itemCount}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
      </div>
    </section>
  );
};
