"use client";

import React from "react";
import { useShop } from "@/context/ShopContext";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartTotal,
    clearCart,
    triggerConfetti,
    showToast,
  } = useShop();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    triggerConfetti();
    showToast("🎉 Order request placed! Our team will contact you on WhatsApp/Phone.");
    clearCart();
    setIsCartOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFFBF7] shadow-2xl flex flex-col border-l border-blush">
          
          {/* Header */}
          <div className="p-5 border-b border-blush/80 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-burgundy" />
              <h2
                className="text-xl font-serif text-charcoal font-semibold"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Shopping Cart ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              aria-label="Close cart"
              className="p-1.5 rounded-full hover:bg-cream-soft text-charcoal-muted hover:text-burgundy transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 p-6">
                <div className="w-16 h-16 rounded-full bg-blush/40 flex items-center justify-center text-burgundy">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg text-charcoal font-medium">
                  Your cart is empty
                </h3>
                <p className="text-xs text-charcoal-muted max-w-xs">
                  Discover our exclusive Kanchipuram sarees, custom blouses, and handcrafted treasures.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 px-6 py-2.5 bg-burgundy text-cream text-xs font-semibold rounded-full shadow-sm hover:shadow-md transition-all"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3.5 p-3 rounded-xl bg-white border border-blush/70 shadow-sm"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-lg object-cover border border-blush flex-shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-serif font-semibold text-charcoal line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-charcoal-muted hover:text-red-600 transition-colors p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-[11px] text-charcoal-muted">
                        {item.selectedSize}
                      </div>
                    </div>

                    {/* Price & Quantity Controls */}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-bold text-burgundy">
                        ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                      </span>

                      <div className="flex items-center border border-blush rounded-full bg-cream-soft">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:text-burgundy transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-charcoal">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:text-burgundy transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 bg-white border-t border-blush space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-charcoal-muted">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-xs text-charcoal-muted">
                  <span>Delivery (Tamil Nadu)</span>
                  <span className="text-emerald-600 font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-charcoal pt-2 border-t border-cream-warm">
                  <span>Total Amount</span>
                  <span className="text-burgundy font-serif text-lg">
                    ₹{cartTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3.5 bg-burgundy hover:bg-burgundy-deep text-cream text-xs font-semibold uppercase tracking-wider rounded-full shadow-gold hover:shadow-luxury-lg flex items-center justify-center gap-2 transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-gold-light" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-charcoal-muted">
                <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                <span>100% Safe & Secure Payments via Razorpay / UPI</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
