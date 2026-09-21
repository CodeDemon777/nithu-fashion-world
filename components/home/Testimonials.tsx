"use client";

import React from "react";
import { TESTIMONIALS } from "@/lib/data";
import { Star, ArrowRight, Quote } from "lucide-react";

export const Testimonials: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-[#FFF7F0] border-b border-blush/60">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-3 border-b border-blush/60">
          <div>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-serif text-charcoal"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Our Happy Customers
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-muted mt-1 font-medium tracking-wide">
              Real Stories, Beautiful Smiles
            </p>
          </div>

          <a
            href="#reviews"
            onClick={(e) => {
              e.preventDefault();
              alert("Showing all 140+ verified customer reviews from Tamil Nadu!");
            }}
            className="group flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-burgundy hover:text-burgundy-wine transition-colors pb-1"
          >
            <span>View All Reviews</span>
            <ArrowRight className="w-4 h-4 text-burgundy transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* 3 Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((review) => (
            <div
              key={review.id}
              className="relative bg-white rounded-2xl p-5 sm:p-6 border border-[#F3D7CE]/80 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
            >
              {/* Top Row: Avatar + Stars + Quote */}
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-13 h-13 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-blush shadow-sm"
                  />
                  <div>
                    {/* 5 Stars */}
                    <div className="flex text-gold gap-0.5 mb-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                      ))}
                    </div>
                    <span className="text-[11px] text-burgundy font-medium">
                      {review.serviceUsed}
                    </span>
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-charcoal/90 italic font-serif leading-relaxed line-clamp-3">
                  "{review.comment}"
                </p>
              </div>

              {/* Bottom: Customer Name & Quote Mark */}
              <div className="flex items-center justify-between pt-4 mt-3 border-t border-cream-warm">
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-charcoal">
                    {review.name}
                  </h4>
                  <span className="text-[10px] text-charcoal-muted">
                    {review.location}
                  </span>
                </div>

                <Quote className="w-6 h-6 text-burgundy/20" />
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
