"use client";

import React from "react";
import { TESTIMONIALS } from "@/lib/data";
import { useShop } from "@/context/ShopContext";
import { Star, ArrowRight, Quote } from "lucide-react";

export const Testimonials: React.FC = () => {
  const { showToast } = useShop();

  const featuredReview = TESTIMONIALS[0];
  const sideReviews = TESTIMONIALS.slice(1, 3);

  return (
    <section className="py-16 sm:py-20 bg-[#F8F7F5]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-serif text-charcoal font-bold tracking-tight"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Our Happy Customers
            </h2>
            <p className="text-sm text-charcoal-muted mt-1 font-medium tracking-wide">
              Real Stories from Across Tamil Nadu
            </p>
          </div>

          <a
            href="#reviews"
            onClick={(e) => {
              e.preventDefault();
              showToast("Showing all 140+ verified customer reviews from Tamil Nadu.");
            }}
            className="group flex items-center gap-1.5 text-sm font-semibold text-burgundy hover:text-burgundy-wine transition-colors pb-1"
          >
            <span>View All Reviews</span>
            <ArrowRight className="w-4 h-4 text-burgundy transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* Asymmetric Editorial Review Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Featured Large Customer Story on Left (7 cols) */}
          <div className="lg:col-span-7 p-7 sm:p-10 rounded-3xl bg-[#F3EFEA] flex flex-col justify-between reveal-card">
            <div>
              <Quote className="w-8 h-8 text-burgundy/25 mb-4" />
              <p
                className="text-xl sm:text-2xl lg:text-3xl font-serif text-charcoal italic leading-relaxed"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                &ldquo;{featuredReview.comment}&rdquo;
              </p>
            </div>

            <div className="flex items-center justify-between gap-4 pt-8 mt-6">
              <div className="flex items-center gap-4">
                <img
                  src={featuredReview.avatar}
                  alt={featuredReview.name}
                  className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                />
                <div>
                  <h3 className="text-base font-bold text-charcoal">
                    {featuredReview.name}
                  </h3>
                  <p className="text-sm text-burgundy font-medium">
                    {featuredReview.serviceUsed} · {featuredReview.location}
                  </p>
                </div>
              </div>

              <div className="flex text-gold gap-1">
                {[...Array(featuredReview.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
            </div>
          </div>

          {/* Two Stacked Secondary Reviews on Right (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            {sideReviews.map((review, idx) => (
              <div
                key={review.id}
                style={{ animationDelay: `${(idx + 1) * 0.1}s` }}
                className="p-6 rounded-2xl bg-[#F3EFEA] flex flex-col justify-between flex-1 reveal-card"
              >
                <p className="text-base text-charcoal italic font-serif leading-relaxed mb-4">
                  &ldquo;{review.comment}&rdquo;
                </p>

                <div className="flex items-center justify-between gap-3 pt-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-charcoal">
                        {review.name}
                      </h4>
                      <p className="text-sm text-burgundy font-medium">
                        {review.serviceUsed} · {review.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex text-gold gap-0.5">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
