"use client";

import React from "react";
import { PRODUCTS } from "@/lib/data";
import { ProductCard } from "@/components/products/ProductCard";
import { useShop } from "@/context/ShopContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const FeaturedCollection: React.FC = () => {
  const { activeCategoryFilter, setActiveCategoryFilter } = useShop();

  const filterTabs = [
    { id: "all", label: "All" },
    { id: "sarees", label: "Sarees" },
    { id: "blouses", label: "Blouses" },
    { id: "dresses", label: "Dresses" },
    { id: "crafts", label: "Art & Crafts" },
    { id: "gifts", label: "Gifts" },
  ];

  const filteredProducts =
    activeCategoryFilter === "all"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategoryFilter);

  return (
    <section id="featured-collection" className="py-16 sm:py-20 bg-[#FFF7F0]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        
        {/* Section Header with Filter Pills and Slider Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-4 border-b border-blush/60">
          
          {/* Title */}
          <div>
            <span className="text-[11px] tracking-[0.25em] uppercase text-charcoal-muted font-semibold">
              Curated By Artisans
            </span>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-serif text-charcoal flex items-baseline flex-wrap gap-2 mt-0.5"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              <span>Featured</span>
              <span
                className="font-script text-burgundy text-4xl sm:text-5xl lg:text-6xl font-normal leading-none ml-1"
                style={{ fontFamily: "var(--font-allura)" }}
              >
                Collection
              </span>
            </h2>
          </div>

          {/* Filter Pills + Arrows */}
          <div className="flex items-center flex-wrap gap-2 sm:gap-3">
            <div className="flex items-center flex-wrap gap-1.5 bg-[#F3D7CE]/40 p-1 rounded-full border border-blush/60">
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategoryFilter(tab.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    activeCategoryFilter === tab.id
                      ? "bg-burgundy text-cream shadow-sm"
                      : "text-charcoal hover:text-burgundy hover:bg-white/50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Left / Right Nav Arrows */}
            <div className="hidden sm:flex items-center gap-1 ml-2">
              <button
                aria-label="Previous products"
                className="w-8 h-8 rounded-full border border-blush hover:border-burgundy flex items-center justify-center text-charcoal hover:text-burgundy transition-colors"
                onClick={() => {
                  const currentIndex = filterTabs.findIndex((t) => t.id === activeCategoryFilter);
                  const prevIndex = (currentIndex - 1 + filterTabs.length) % filterTabs.length;
                  setActiveCategoryFilter(filterTabs[prevIndex].id);
                }}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                aria-label="Next products"
                className="w-8 h-8 rounded-full border border-blush hover:border-burgundy flex items-center justify-center text-charcoal hover:text-burgundy transition-colors"
                onClick={() => {
                  const currentIndex = filterTabs.findIndex((t) => t.id === activeCategoryFilter);
                  const nextIndex = (currentIndex + 1) % filterTabs.length;
                  setActiveCategoryFilter(filterTabs[nextIndex].id);
                }}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white/50 rounded-2xl border border-dashed border-blush">
            <p className="text-charcoal-muted text-sm font-serif">
              No products found in this category right now.
            </p>
            <button
              onClick={() => setActiveCategoryFilter("all")}
              className="mt-3 text-xs font-semibold text-burgundy underline"
            >
              View All Products
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
