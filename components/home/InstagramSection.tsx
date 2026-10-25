"use client";

import React from "react";
import { INSTAGRAM_POSTS } from "@/lib/data";
import { Instagram, Heart } from "lucide-react";

export const InstagramSection: React.FC = () => {
  return (
    <section className="py-10 sm:py-14 bg-[#F8F7F5]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        
        {/* Instagram Strip Container */}
        <div className="bg-[#F3EFEA] rounded-3xl p-5 sm:p-6 flex flex-col xl:flex-row items-center justify-between gap-6">
          
          {/* Left Title with Instagram Icon */}
          <div className="flex items-center gap-3.5 flex-shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-[#E1306C] flex items-center justify-center text-white">
              <Instagram className="w-6 h-6" />
            </div>
            <div>
              <h3
                className="text-xl sm:text-2xl font-serif text-charcoal font-semibold"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Follow Our Artisans on Instagram
              </h3>
            </div>
          </div>

          {/* 7 Image Thumbnails Responsive Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-7 gap-2 sm:gap-2.5 flex-1 w-full max-w-[760px]">
            {INSTAGRAM_POSTS.map((post) => (
              <a
                key={post.id}
                href="https://www.instagram.com/nithufashionworld?stkn=MTBrd253OWQ0Nmd2dA=="
                target="_blank"
                rel="noreferrer"
                className="group relative aspect-square rounded-xl overflow-hidden bg-[#E8DDD8] block"
              >
                <img
                  src={post.image}
                  alt={post.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Hover overlay with IG icon and likes */}
                <div className="absolute inset-0 bg-burgundy/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-1 text-center">
                  <Instagram className="w-4 h-4 text-gold-light mb-0.5" />
                  <div className="flex items-center gap-0.5 text-sm font-semibold text-cream">
                    <Heart className="w-3 h-3 fill-current" />
                    <span>{post.likes}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Right Follow Action */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-sm font-semibold text-charcoal-muted">
              @nithufashionworld
            </span>
            <a
              href="https://www.instagram.com/nithufashionworld?stkn=MTBrd253OWQ0Nmd2dA=="
              target="_blank"
              rel="noreferrer"
              className="bg-burgundy hover:bg-burgundy-deep text-cream text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
            >
              Follow
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};
