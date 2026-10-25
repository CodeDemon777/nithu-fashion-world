"use client";

import React from "react";
import { Product } from "@/lib/types";
import { useShop } from "@/context/ShopContext";
import { Heart, ShoppingBag, Eye, Star, MessageCircle } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist, setQuickViewProduct, openWhatsAppCheckout } = useShop();
  const wishlisted = isInWishlist(product.id);

  return (
    <div className="group relative bg-white rounded-2xl p-3 sm:p-3.5 transition-colors duration-300 flex flex-col justify-between reveal-card">
      
      {/* Image Area with Badges & Hover Actions */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-cream-soft mb-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Discount Badge on Top Left */}
        {product.discount && (
          <div className="absolute top-2.5 left-2.5 bg-burgundy text-cream text-sm font-semibold px-2.5 py-0.5 rounded-full">
            {product.discount}% OFF
          </div>
        )}

        {/* Wishlist Button on Top Right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          aria-label="Add to wishlist"
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            wishlisted
              ? "bg-burgundy text-white"
              : "bg-white/95 hover:bg-white text-burgundy"
          }`}
        >
          <Heart
            className={`w-4 h-4 ${wishlisted ? "fill-white text-white" : "text-burgundy"}`}
          />
        </button>

        {/* Quick View Hover Overlay Button */}
        <div className="absolute inset-0 bg-burgundy/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
          <button
            onClick={() => setQuickViewProduct(product)}
            className="bg-white hover:bg-cream-soft text-burgundy font-semibold text-sm py-2 px-4 rounded-full flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-1 justify-between">
        <div>
          {/* Category Tag */}
          <div className="text-sm text-charcoal-muted font-medium mb-1">
            {product.categoryLabel}
          </div>

          {/* Title */}
          <h3
            onClick={() => setQuickViewProduct(product)}
            className="text-base sm:text-lg font-serif font-semibold text-charcoal group-hover:text-burgundy transition-colors cursor-pointer line-clamp-1"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1">
            <div className="flex text-gold">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating)
                      ? "fill-gold text-gold"
                      : "text-blush-dark fill-blush"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-charcoal-muted">
              ({product.reviewsCount})
            </span>
          </div>
        </div>

        {/* Price & Add to Cart Footer */}
        <div className="flex items-center justify-between pt-3 mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-bold text-burgundy font-serif">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.oldPrice && (
              <span className="text-sm text-charcoal-muted line-through">
                ₹{product.oldPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {/* Action Buttons: WhatsApp Order + Add to Cart */}
          <div className="flex items-center gap-1.5">
            {/* WhatsApp Direct Buy */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                openWhatsAppCheckout({
                  product,
                  quantity: 1,
                  selectedSize: "Standard / Free Size",
                });
              }}
              title="Order on WhatsApp"
              aria-label={`Order ${product.name} on WhatsApp`}
              className="w-8 h-8 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white flex items-center justify-center transition-colors transform active:scale-95 hover:scale-105"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
            </button>

            {/* Add to Cart Circular Icon Button */}
            <button
              onClick={() => addToCart(product)}
              title="Add to Cart"
              aria-label={`Add ${product.name} to cart`}
              className="w-8 h-8 rounded-full bg-burgundy hover:bg-burgundy-deep text-cream flex items-center justify-center transition-colors transform active:scale-95 hover:scale-105"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-gold-light" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
