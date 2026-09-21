import React from "react";

interface FloralAccentProps {
  className?: string;
  variant?: "gold" | "burgundy" | "blush";
  position?: "left" | "right" | "top" | "bottom";
}

export const FloralAccent: React.FC<FloralAccentProps> = ({
  className = "",
  variant = "gold",
  position = "left",
}) => {
  const strokeColor =
    variant === "gold" ? "#C89B5A" : variant === "burgundy" ? "#720013" : "#F3D7CE";

  const transform =
    position === "right"
      ? "scale-x-[-1]"
      : position === "bottom"
      ? "scale-y-[-1]"
      : "";

  return (
    <div className={`pointer-events-none select-none ${transform} ${className}`}>
      <svg
        viewBox="0 0 200 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full opacity-60"
      >
        {/* Main Stem */}
        <path
          d="M10 290 C40 240, 20 180, 70 130 C110 90, 130 50, 180 10"
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Branch 1 */}
        <path
          d="M40 210 C70 190, 90 200, 110 180"
          stroke={strokeColor}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        {/* Leaves */}
        <path
          d="M110 180 C125 170, 130 155, 120 150 C110 145, 100 165, 110 180Z"
          fill={strokeColor}
          fillOpacity="0.15"
          stroke={strokeColor}
          strokeWidth="1"
        />
        <path
          d="M70 130 C90 120, 100 105, 90 95 C80 85, 65 110, 70 130Z"
          fill={strokeColor}
          fillOpacity="0.15"
          stroke={strokeColor}
          strokeWidth="1"
        />
        <path
          d="M140 60 C160 50, 165 35, 155 30 C145 25, 130 45, 140 60Z"
          fill={strokeColor}
          fillOpacity="0.15"
          stroke={strokeColor}
          strokeWidth="1"
        />
        {/* Delicate Flower Bud */}
        <circle cx="180" cy="10" r="4" fill={strokeColor} />
        <circle cx="180" cy="10" r="8" stroke={strokeColor} strokeWidth="0.8" strokeDasharray="2 2" />
        <path
          d="M175 12 C168 18, 160 16, 165 10"
          stroke={strokeColor}
          strokeWidth="1"
        />
      </svg>
    </div>
  );
};
