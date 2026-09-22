import React from "react";

interface BrandLogoProps {
  variant?: "light" | "dark" | "gold";
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showFullEmblem?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = "gold",
  className = "",
  size = "md",
  showFullEmblem = false,
}) => {
  const isDark = variant === "dark";
  const isLight = variant === "light";

  const textColor = isLight ? "text-white" : isDark ? "text-burgundy" : "text-gold";
  const subTextColor = isLight ? "text-blush-soft" : isDark ? "text-charcoal-muted" : "text-gold-light";
  const scriptColor = isLight ? "text-blush" : isDark ? "text-burgundy-wine" : "text-[#E5C78C]";

  const iconSizes = {
    sm: "w-11 h-11",
    md: "w-13 h-13",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  const currentIconSize = iconSizes[size] || "w-12 h-12";

  if (showFullEmblem) {
    return (
      <div className={`relative select-none flex flex-col items-center ${className}`}>
        <img
          src="/images/logo/logo.png"
          alt="NITHU FASHION WORLD Logo"
          className="w-full max-w-[280px] h-auto rounded-3xl shadow-luxury-lg border border-gold/40 transition-transform duration-300 hover:scale-105"
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official Brand Logo Icon */}
      <div className={`relative ${currentIconSize} flex-shrink-0 rounded-2xl overflow-hidden border border-gold/40 shadow-md bg-burgundy-deep/90`}>
        <img
          src="/images/logo/logo.png"
          alt="NITHU FASHION WORLD Logo"
          className="w-full h-full object-cover object-center transform scale-110"
        />
        <div className="absolute inset-0 rounded-2xl ring-1 ring-gold/40 pointer-events-none" />
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col leading-none">
        <span
          className={`text-2xl sm:text-[26px] font-serif tracking-[0.2em] font-bold uppercase ${textColor}`}
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          NITHU
        </span>
        <span
          className={`text-[10px] uppercase tracking-[0.38em] font-semibold mt-0.5 ${subTextColor}`}
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          FASHION WORLD
        </span>
        <span
          className={`text-xs sm:text-sm font-script tracking-wide mt-0.5 italic ${scriptColor}`}
          style={{ fontFamily: "var(--font-allura)", fontSize: "16px" }}
        >
          Stitching Dreams, Creating You
        </span>
      </div>
    </div>
  );
};
