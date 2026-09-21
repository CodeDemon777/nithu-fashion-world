"use client";

import React, { useState } from "react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { useShop } from "@/context/ShopContext";
import {
  Phone,
  Instagram,
  MapPin,
  Mail,
  ArrowRight,
  Facebook,
  MessageCircle,
  Youtube,
  Heart,
  CheckCircle2,
} from "lucide-react";

export const Footer: React.FC = () => {
  const { showToast, triggerConfetti } = useShop();
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      showToast("Please enter a valid email address.");
      return;
    }
    setIsSubscribed(true);
    triggerConfetti();
    showToast("Thank you for subscribing to NITHU FASHION WORLD! ✨");
    setEmail("");
  };

  return (
    <footer id="footer" className="bg-[#3D0008] text-cream-ivory pt-16 pb-8 border-t-2 border-gold/40 relative overflow-hidden">
      
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-1/3 w-96 h-96 bg-[#720013]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 relative z-10">
        
        {/* Main 5 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 pb-12 border-b border-burgundy-rich/80">
          
          {/* Col 1: Brand & Bio (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-4">
            <BrandLogo variant="light" size="md" />
            <p className="text-xs text-blush-soft/80 leading-relaxed font-sans max-w-sm pt-2">
              Empowering your elegance with handcrafted luxury sarees, custom bridal blouse tailoring, exquisite Aari craftsmanship, and personalized handcrafted gifts in Tamil Nadu.
            </p>
            <div className="pt-2 text-xs text-gold-light/90 font-medium">
              ✨ Traditional Craftsmanship For A Brighter You
            </div>
          </div>

          {/* Col 2: Quick Links (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-3">
            <h4
              className="text-base font-serif text-gold-light tracking-wider font-semibold"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-cream-ivory/80">
              <li>
                <a href="#home" className="hover:text-gold transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#featured-collection" className="hover:text-gold transition-colors">
                  Shop
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-gold transition-colors">
                  Tailoring
                </a>
              </li>
              <li>
                <a href="#categories" className="hover:text-gold transition-colors">
                  Art & Crafts
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-gold transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#footer" className="hover:text-gold transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-3">
            <h4
              className="text-base font-serif text-gold-light tracking-wider font-semibold"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-cream-ivory/80">
              <li>
                <a href="#home" className="hover:text-gold transition-colors">
                  My Account
                </a>
              </li>
              <li>
                <a href="#home" className="hover:text-gold transition-colors">
                  Track Order
                </a>
              </li>
              <li>
                <a href="#home" className="hover:text-gold transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#home" className="hover:text-gold transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#home" className="hover:text-gold transition-colors">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Us (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-3">
            <h4
              className="text-base font-serif text-gold-light tracking-wider font-semibold"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Contact Us
            </h4>
            <ul className="space-y-2.5 text-xs text-cream-ivory/90">
              <li className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 text-gold flex-shrink-0 mt-0.5" />
                <a href="tel:9585477733" className="hover:text-gold transition-colors">
                  9585477733
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                <a
                  href="https://www.instagram.com/nithufashionworld?stkn=MTBrd253OWQ0Nmd2dA=="
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-gold transition-colors truncate"
                >
                  @nithufashionworld
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                <span>Komarapalayam, Tamil Nadu</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 text-gold flex-shrink-0 mt-0.5" />
                <a
                  href="mailto:nithufashionworld142624@gmail.com"
                  className="hover:text-gold transition-colors break-all text-[11px]"
                >
                  nithufashionworld142624@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Newsletter & Social (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-3">
            <h4
              className="text-base font-serif text-gold-light tracking-wider font-semibold"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Join Our Newsletter
            </h4>
            <p className="text-[11px] text-blush-soft/80">
              Get latest updates and offers.
            </p>

            {/* Newsletter Pill Input */}
            <form onSubmit={handleSubscribe} className="relative mt-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white text-charcoal text-xs pl-3.5 pr-10 py-2.5 rounded-full border border-gold/40 focus:border-gold outline-none placeholder:text-charcoal-light shadow-sm"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="absolute right-1.5 top-1.5 bottom-1.5 w-7 h-7 rounded-full bg-burgundy hover:bg-burgundy-deep text-gold flex items-center justify-center transition-colors"
              >
                {isSubscribed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5" />
                )}
              </button>
            </form>

            {/* Social Media Icons Row */}
            <div className="flex items-center gap-3 pt-3">
              <a
                href="https://instagram.com/nithu_fashion_world"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-burgundy-deep border border-gold/30 hover:border-gold text-gold-light hover:text-white flex items-center justify-center transition-colors shadow-sm"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-burgundy-deep border border-gold/30 hover:border-gold text-gold-light hover:text-white flex items-center justify-center transition-colors shadow-sm"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/919585477733"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="w-8 h-8 rounded-full bg-burgundy-deep border border-gold/30 hover:border-gold text-gold-light hover:text-white flex items-center justify-center transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded-full bg-burgundy-deep border border-gold/30 hover:border-gold text-gold-light hover:text-white flex items-center justify-center transition-colors shadow-sm"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Credits */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-blush-soft/70">
          <div>
            © 2024-2026 <span className="text-gold-light font-medium">NITHU FASHION WORLD</span>. All rights reserved.
          </div>
          <div className="flex items-center gap-1.5">
            <span>Designed with</span>
            <Heart className="w-3.5 h-3.5 fill-[#E5C78C] text-[#E5C78C]" />
            <span>for beautiful people</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
