"use client";

import React from "react";
import { useShop } from "@/context/ShopContext";
import { Home, Sparkles, Heart, ShoppingBag, Grid, MessageCircle } from "lucide-react";

export const MobileBottomNav: React.FC = () => {
  const {
    cartCount,
    wishlistCount,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsBookingModalOpen,
  } = useShop();

  const handleNavClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FFFBF7]/95 backdrop-blur-lg border-t border-[#F3D7CE] shadow-[0_-4px_20px_rgba(87,0,13,0.08)] px-2 py-1.5 safe-area-pb"
    >
      <div className="flex items-center justify-around">
        {/* Home */}
        <button
          onClick={() => handleNavClick("#home")}
          className="flex flex-col items-center justify-center p-1.5 text-charcoal-muted hover:text-burgundy transition-colors active:scale-95"
        >
          <Home className="w-5 h-5 text-burgundy" />
          <span className="text-[10px] font-medium mt-0.5">Home</span>
        </button>

        {/* Categories / Shop */}
        <button
          onClick={() => handleNavClick("#featured-collection")}
          className="flex flex-col items-center justify-center p-1.5 text-charcoal-muted hover:text-burgundy transition-colors active:scale-95"
        >
          <Grid className="w-5 h-5 text-charcoal" />
          <span className="text-[10px] font-medium mt-0.5">Shop</span>
        </button>

        {/* Tailor / Bespoke Center Floating Pill */}
        <button
          onClick={() => setIsBookingModalOpen(true)}
          className="flex flex-col items-center justify-center -mt-4 p-2 bg-gradient-to-br from-burgundy via-burgundy-wine to-burgundy-deep text-cream rounded-full shadow-gold hover:shadow-luxury-lg border-2 border-gold/40 transition-all active:scale-95"
        >
          <Sparkles className="w-5 h-5 text-gold-light animate-pulseSlow" />
          <span className="sr-only">Book Tailoring</span>
        </button>

        {/* Wishlist */}
        <button
          onClick={() => setIsWishlistOpen(true)}
          className="relative flex flex-col items-center justify-center p-1.5 text-charcoal-muted hover:text-burgundy transition-colors active:scale-95"
        >
          <Heart className="w-5 h-5 text-burgundy" />
          {wishlistCount > 0 && (
            <span className="absolute top-0 right-2 w-4 h-4 bg-burgundy text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
          <span className="text-[10px] font-medium mt-0.5">Wishlist</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center p-1.5 text-charcoal-muted hover:text-burgundy transition-colors active:scale-95"
        >
          <ShoppingBag className="w-5 h-5 text-burgundy" />
          {cartCount > 0 && (
            <span className="absolute top-0 right-2 w-4 h-4 bg-gold text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
              {cartCount}
            </span>
          )}
          <span className="text-[10px] font-medium mt-0.5">Cart</span>
        </button>
      </div>
    </nav>
  );
};
