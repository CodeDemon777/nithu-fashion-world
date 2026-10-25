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

  const iconDimensions = {
    sm: 40,
    md: 48,
    lg: 56,
    xl: 64,
  };

  const dim = iconDimensions[size] || 48;

  if (showFullEmblem) {
    return (
      <div className={`relative select-none flex flex-col items-center ${className}`}>
        <img
          src="/images/logo/logo.png"
          alt="NITHU FASHION WORLD Logo"
          className="w-full max-w-[240px] h-auto object-contain rounded-2xl shadow-luxury-lg border border-gold/40 transition-transform duration-300 hover:scale-105"
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none flex-shrink-0 ${className}`}>
      {/* Official Brand Logo Icon with strict constraints */}
      <div
        style={{ width: dim, height: dim, minWidth: dim, minHeight: dim, maxWidth: dim, maxHeight: dim }}
        className="relative flex-shrink-0 rounded-xl overflow-hidden bg-burgundy-deep"
      >
        <img
          src="/images/logo/logo.png"
          alt="NITHU FASHION WORLD Logo"
          className="w-full h-full object-cover object-center block"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col leading-tight min-w-0">
        <span
          className={`text-lg sm:text-xl font-serif tracking-[0.12em] font-bold uppercase truncate ${textColor}`}
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          NITHU
        </span>
        <span
          className={`text-sm tracking-[0.14em] font-medium ${subTextColor}`}
          style={{ fontFamily: "var(--font-archivo)" }}
        >
          Fashion World
        </span>
      </div>
    </div>
  );
};
