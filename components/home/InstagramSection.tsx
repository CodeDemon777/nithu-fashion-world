"use client";

import React from "react";
import { INSTAGRAM_POSTS } from "@/lib/data";
import { Instagram, Heart } from "lucide-react";

export const InstagramSection: React.FC = () => {
  return (
    <section className="py-10 sm:py-14 bg-[#FFF7F0]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        
        {/* Instagram Strip Container */}
        <div className="bg-[#FFFBF7] rounded-3xl p-4 sm:p-6 border border-[#F3D7CE] shadow-card flex flex-col xl:flex-row items-center justify-between gap-6">
          
          {/* Left Title with Instagram Icon */}
          <div className="flex items-center gap-3.5 flex-shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FFDC80] via-[#FD1D1D] to-[#833AB4] flex items-center justify-center text-white shadow-md">
              <Instagram className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-charcoal-muted font-semibold">
                Social Gallery
              </div>
              <h3
                className="text-xl sm:text-2xl font-serif text-charcoal flex items-baseline gap-1"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                <span>Follow Us on</span>
                <span
                  className="font-script text-burgundy text-2xl sm:text-3xl font-normal leading-none"
                  style={{ fontFamily: "var(--font-allura)" }}
                >
                  Instagram
                </span>
              </h3>
            </div>
          </div>

          {/* 7 Image Thumbnails Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5 flex-1 w-full max-w-[760px]">
            {INSTAGRAM_POSTS.map((post) => (
              <a
                key={post.id}
                href="https://www.instagram.com/nithufashionworld?stkn=MTBrd253OWQ0Nmd2dA=="
                target="_blank"
                rel="noreferrer"
                className="group relative aspect-square rounded-xl overflow-hidden bg-cream-soft border border-blush/60 shadow-sm"
              >
                <img
                  src={post.image}
                  alt={post.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-115"
                />
                {/* Hover overlay with IG icon and likes */}
                <div className="absolute inset-0 bg-burgundy/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-1 text-center">
                  <Instagram className="w-4 h-4 text-gold-light mb-0.5" />
                  <div className="flex items-center gap-0.5 text-[9px] font-semibold text-cream">
                    <Heart className="w-2.5 h-2.5 fill-current" />
                    <span>{post.likes}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Right Follow Action */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-xs font-semibold text-charcoal-muted">
              @nithufashionworld
            </span>
            <a
              href="https://www.instagram.com/nithufashionworld?stkn=MTBrd253OWQ0Nmd2dA=="
              target="_blank"
              rel="noreferrer"
              className="bg-burgundy hover:bg-burgundy-deep text-cream text-xs font-semibold px-5 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all"
            >
              Follow
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};
