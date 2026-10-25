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
    <section id="featured-collection" className="pt-20 pb-16 sm:py-20 bg-[#F8F7F5] scroll-mt-24">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        
        {/* Section Header with Filter Pills and Slider Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          
          {/* Title */}
          <div>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-serif text-charcoal font-bold tracking-tight"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Featured Collection
            </h2>
          </div>

          {/* Filter Pills + Arrows */}
          <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto overflow-hidden">
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-1.5 bg-[#EFEAE4] rounded-full max-w-full">
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategoryFilter(tab.id)}
                  className={`px-3.5 sm:px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                    activeCategoryFilter === tab.id
                      ? "bg-burgundy text-cream"
                      : "text-charcoal hover:text-burgundy hover:bg-white/60"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Left / Right Nav Arrows */}
            <div className="hidden sm:flex items-center gap-1 ml-2 flex-shrink-0">
              <button
                aria-label="Previous products"
                className="w-8 h-8 rounded-full bg-[#EFEAE4] hover:bg-burgundy hover:text-white flex items-center justify-center text-charcoal transition-colors"
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
                className="w-8 h-8 rounded-full bg-[#EFEAE4] hover:bg-burgundy hover:text-white flex items-center justify-center text-charcoal transition-colors"
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

        {/* Product Grid Responsive across mobile (2 col), tablet (3 col), laptop (4 col), PC (5 col) */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
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
