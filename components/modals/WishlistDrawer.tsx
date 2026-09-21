"use client";

import React from "react";
import { useShop } from "@/context/ShopContext";
import { PRODUCTS } from "@/lib/data";
import { X, Heart, ShoppingBag, Trash2 } from "lucide-react";

export const WishlistDrawer: React.FC = () => {
  const {
    wishlist,
    isWishlistOpen,
    setIsWishlistOpen,
    toggleWishlist,
    addToCart,
  } = useShop();

  if (!isWishlistOpen) return null;

  const wishlistProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsWishlistOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFFBF7] shadow-2xl flex flex-col border-l border-blush">
          
          {/* Header */}
          <div className="p-5 border-b border-blush/80 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 fill-burgundy text-burgundy" />
              <h2
                className="text-xl font-serif text-charcoal font-semibold"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                My Wishlist ({wishlist.length})
              </h2>
            </div>
            <button
              onClick={() => setIsWishlistOpen(false)}
              aria-label="Close wishlist"
              className="p-1.5 rounded-full hover:bg-cream-soft text-charcoal-muted hover:text-burgundy transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Wishlist Items */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {wishlistProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 p-6">
                <div className="w-16 h-16 rounded-full bg-blush/40 flex items-center justify-center text-burgundy">
                  <Heart className="w-8 h-8 text-burgundy" />
                </div>
                <h3 className="font-serif text-lg text-charcoal font-medium">
                  Your wishlist is empty
                </h3>
                <p className="text-xs text-charcoal-muted max-w-xs">
                  Click the heart icon on any saree, blouse, or gift item to save your favorites here.
                </p>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="mt-2 px-6 py-2.5 bg-burgundy text-cream text-xs font-semibold rounded-full shadow-sm hover:shadow-md transition-all"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-3.5 p-3 rounded-xl bg-white border border-blush/70 shadow-sm"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 rounded-lg object-cover border border-blush flex-shrink-0"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-serif font-semibold text-charcoal line-clamp-1">
                          {product.name}
                        </h4>
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className="text-charcoal-muted hover:text-red-600 transition-colors p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-xs font-bold text-burgundy mt-1">
                        ₹{product.price.toLocaleString("en-IN")}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        addToCart(product);
                        toggleWishlist(product.id);
                      }}
                      className="mt-2 text-xs font-semibold py-1.5 px-3 bg-burgundy text-cream rounded-full hover:bg-burgundy-deep flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ShoppingBag className="w-3 h-3 text-gold-light" />
                      <span>Move to Cart</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
