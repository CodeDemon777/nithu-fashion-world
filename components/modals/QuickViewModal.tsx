"use client";

import React, { useState } from "react";
import { useShop } from "@/context/ShopContext";
import { X, Heart, ShoppingBag, Star, Check, Sparkles, ShieldCheck } from "lucide-react";

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setIsBookingModalOpen,
    setBookingPreselectService,
  } = useShop();

  const [selectedSize, setSelectedSize] = useState("Standard / Free Size");
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const wishlisted = isInWishlist(quickViewProduct.id);

  const sizes = ["Standard / Free Size", "Custom Fitting (Tailored)", "Made to Measure"];

  const handleCustomTailoring = () => {
    setBookingPreselectService(`Custom Stitching for ${quickViewProduct.name}`);
    setQuickViewProduct(null);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        onClick={() => setQuickViewProduct(null)}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-8 shadow-2xl border border-blush z-10 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          aria-label="Close product view"
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-cream text-charcoal-muted hover:text-burgundy transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
          
          {/* Product Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-cream-soft border border-blush/60 shadow-sm">
            <img
              src={quickViewProduct.image}
              alt={quickViewProduct.name}
              className="w-full h-full object-cover"
            />
            {quickViewProduct.discount && (
              <span className="absolute top-3 left-3 bg-burgundy text-cream text-xs font-bold px-2.5 py-1 rounded-full shadow">
                {quickViewProduct.discount}% OFF
              </span>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <div>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-charcoal-muted">
                {quickViewProduct.categoryLabel}
              </span>
              <h3
                className="text-xl sm:text-2xl font-serif text-charcoal font-bold mt-0.5"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                {quickViewProduct.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-1.5 mt-1.5">
                <div className="flex text-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                  ))}
                </div>
                <span className="text-xs text-charcoal-muted">
                  {quickViewProduct.rating} ({quickViewProduct.reviewsCount} verified reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 pb-3 border-b border-cream-warm">
              <span className="text-2xl font-bold font-serif text-burgundy">
                ₹{quickViewProduct.price.toLocaleString("en-IN")}
              </span>
              {quickViewProduct.oldPrice && (
                <span className="text-sm text-charcoal-muted line-through">
                  ₹{quickViewProduct.oldPrice.toLocaleString("en-IN")}
                </span>
              )}
              <span className="text-xs text-emerald-600 font-semibold ml-2">
                In Stock & Ready
              </span>
            </div>

            {/* Description */}
            <p className="text-xs text-charcoal/80 leading-relaxed">
              {quickViewProduct.description}
            </p>

            {/* Size / Fit Selection */}
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1.5">
                Fitting & Size Option:
              </label>
              <div className="flex flex-col gap-1.5">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`text-left text-xs px-3 py-2 rounded-xl border transition-all flex items-center justify-between ${
                      selectedSize === s
                        ? "border-burgundy bg-blush-light text-burgundy font-semibold"
                        : "border-blush/60 hover:bg-cream-soft text-charcoal"
                    }`}
                  >
                    <span>{s}</span>
                    {selectedSize === s && <Check className="w-3.5 h-3.5 text-burgundy" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  addToCart(quickViewProduct, quantity, selectedSize);
                  setQuickViewProduct(null);
                }}
                className="flex-1 py-3 bg-burgundy hover:bg-burgundy-deep text-cream text-xs font-semibold uppercase tracking-wider rounded-full shadow-md hover:shadow-luxury transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-gold-light" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={() => toggleWishlist(quickViewProduct.id)}
                aria-label="Wishlist"
                className={`p-3 rounded-full border transition-colors ${
                  wishlisted
                    ? "border-burgundy bg-burgundy text-white"
                    : "border-blush hover:border-burgundy text-burgundy"
                }`}
              >
                <Heart className={`w-4 h-4 ${wishlisted ? "fill-white" : ""}`} />
              </button>
            </div>

            {/* Custom Tailoring Request Link */}
            {quickViewProduct.isCustomizable && (
              <button
                onClick={handleCustomTailoring}
                className="w-full text-center text-xs text-burgundy hover:text-burgundy-wine font-semibold flex items-center justify-center gap-1 pt-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                <span>Need custom stitching or Aari work on this? Book here</span>
              </button>
            )}

            <div className="flex items-center justify-center gap-2 text-[10px] text-charcoal-muted pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-gold" />
              <span>Free Delivery & Quality Guarantee in Tamil Nadu</span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
