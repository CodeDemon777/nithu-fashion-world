"use client";

import React from "react";
import { useShop } from "@/context/ShopContext";
import { Sparkles } from "lucide-react";

export const ToastNotification: React.FC = () => {
  const { toastMessage } = useShop();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce">
      <div className="bg-[#3D0008] text-cream-ivory px-5 py-3 rounded-2xl shadow-luxury-lg border border-gold/40 flex items-center gap-3 backdrop-blur-md">
        <Sparkles className="w-4 h-4 text-gold flex-shrink-0" />
        <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
      </div>
    </div>
  );
};
