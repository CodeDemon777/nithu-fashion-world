import React from "react";

interface BrandLogoProps {
  variant?: "light" | "dark" | "gold";
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = "gold",
  className = "",
  size = "md",
}) => {
  const isDark = variant === "dark";
  const isLight = variant === "light";

  const textColor = isLight ? "text-white" : isDark ? "text-burgundy" : "text-gold";
  const subTextColor = isLight ? "text-blush-soft" : isDark ? "text-charcoal-muted" : "text-gold-light";
  const scriptColor = isLight ? "text-blush" : isDark ? "text-burgundy-wine" : "text-[#E5C78C]";

  const scaleClass =
    size === "sm" ? "scale-75 origin-left" : size === "lg" ? "scale-110" : "";

  return (
    <div className={`flex items-center gap-3 select-none ${scaleClass} ${className}`}>
      {/* Brand Icon: Woman Profile + Sewing Needle & Spool */}
      <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Outer Golden Ring */}
          <circle
            cx="50"
            cy="50"
            r="46"
            stroke={isLight ? "#E5C78C" : "#C89B5A"}
            strokeWidth="1.5"
            strokeDasharray="4 2"
            opacity="0.8"
          />
          {/* Woman Profile Silhouette with Floral Bun */}
          <path
            d="M52 22C44 22 40 28 40 35C40 42 45 48 50 50C48 56 42 62 36 68C44 68 54 62 58 54C62 54 66 50 66 45C66 40 62 38 60 38C62 32 60 22 52 22Z"
            fill={isLight ? "#FFF7F0" : isDark ? "#57000D" : "#E5C78C"}
          />
          {/* Jasmine Hair Flowers Motif */}
          <circle cx="58" cy="28" r="3.5" fill="#FFF" />
          <circle cx="64" cy="32" r="3.5" fill="#FFF" />
          <circle cx="66" cy="38" r="3.5" fill="#FFF" />
          {/* Golden Sewing Needle */}
          <line
            x1="32"
            y1="75"
            x2="68"
            y2="28"
            stroke="#C89B5A"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="34" cy="73" r="1.5" fill="#3D0008" />
          {/* Sewing Thread Threading through */}
          <path
            d="M34 73 C25 80, 20 65, 30 55 C40 45, 65 70, 75 60"
            stroke={isLight ? "#F3D7CE" : "#851525"}
            strokeWidth="1.5"
            fill="none"
          />
          {/* Sewing Thread Spool */}
          <rect x="70" y="65" width="8" height="12" rx="2" fill="#C89B5A" />
          <rect x="68" y="63" width="12" height="3" rx="1.5" fill="#E5C78C" />
          <rect x="68" y="76" width="12" height="3" rx="1.5" fill="#E5C78C" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col leading-none">
        <span
          className={`text-2xl font-serif tracking-[0.22em] font-bold uppercase ${textColor}`}
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
          className={`text-xs font-script tracking-wide mt-0.5 italic ${scriptColor}`}
          style={{ fontFamily: "var(--font-allura)", fontSize: "15px" }}
        >
          Stitching Dreams, Creating You
        </span>
      </div>
    </div>
  );
};
