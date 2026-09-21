"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { useShop } from "@/context/ShopContext";
import { useAuth } from "@/context/AuthContext";
import {
  Search,
  Heart,
  User as UserIcon,
  ShoppingBag,
  Menu,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  LogOut,
  ChevronDown,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const {
    products,
    cartCount,
    wishlistCount,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsBookingModalOpen,
    searchQuery,
    setSearchQuery,
    setQuickViewProduct,
  } = useShop();

  const { user, setIsAuthModalOpen, logout } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const searchResults = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const navLinks = [
    { name: "Home", href: "/#home" },
    { name: "Shop", href: "/#featured-collection" },
    { name: "Tailoring", href: "/#services" },
    { name: "Art & Crafts", href: "/#categories" },
    { name: "About Us", href: "/#how-it-works" },
    { name: "Contact", href: "/#footer" },
  ];

  return (
    <header
      className={`sticky top-0 z-30 transition-all duration-300 ${
        isScrolled
          ? "bg-[#FFFBF7]/95 backdrop-blur-md shadow-luxury py-2.5"
          : "bg-[#FFF7F0] py-4 border-b border-[#F3D7CE]/50"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between gap-4 md:gap-8">
          {/* Brand Logo on Left */}
          <Link href="/" className="flex-shrink-0 group">
            <BrandLogo variant="dark" size="sm" />
          </Link>

          {/* Desktop Navigation Center */}
          <nav className="hidden lg:flex items-center gap-7 text-[14px] font-medium text-charcoal">
            {navLinks.map((link, idx) => (
              <a
                key={link.name}
                href={link.href}
                className={`nav-link-underline transition-colors py-1 ${
                  idx === 0
                    ? "text-burgundy font-semibold active"
                    : "hover:text-burgundy text-charcoal-muted"
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Search + Icons Right */}
          <div className="flex items-center gap-2 sm:gap-3.5 flex-shrink-0">
            {/* Search Pill Input with Autocomplete */}
            <div className="relative hidden md:block w-44 lg:w-56">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
                  className="w-full bg-white text-xs pl-3.5 pr-9 py-2 rounded-full border border-blush/80 focus:border-burgundy focus:ring-1 focus:ring-burgundy outline-none transition-all placeholder:text-charcoal-light text-charcoal shadow-sm"
                />
                <button
                  aria-label="Submit Search"
                  className="absolute right-2.5 text-burgundy hover:text-gold transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>

              {/* Search Suggestions Dropdown */}
              {isSearchFocused && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-luxury-lg border border-blush p-2 z-50 max-h-80 overflow-y-auto">
                  <div className="text-[10px] uppercase font-semibold text-charcoal-muted px-2 py-1 tracking-wider">
                    Matching Products ({searchResults.length})
                  </div>
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        setQuickViewProduct(product);
                        setSearchQuery("");
                      }}
                      className="flex items-center gap-3 p-2 hover:bg-cream-soft rounded-lg cursor-pointer transition-colors"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 rounded-md object-cover border border-blush"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-charcoal truncate">
                          {product.name}
                        </div>
                        <div className="text-[11px] text-burgundy font-semibold">
                          ₹{product.price}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Custom Tailoring CTA Quick Button */}
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="hidden xl:flex items-center gap-1.5 text-xs font-semibold text-burgundy bg-blush-light hover:bg-blush px-3.5 py-1.5 rounded-full border border-blush transition-all hover:shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
              <span>Book Stitching</span>
            </button>

            {/* Wishlist Heart Icon */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              aria-label="Wishlist"
              className="relative p-2 text-charcoal hover:text-burgundy transition-colors rounded-full hover:bg-cream-soft"
            >
              <Heart className="w-5 h-5 text-burgundy" />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-burgundy text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* User Account / Profile Dropdown */}
            <div className="relative">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-full bg-cream-soft hover:bg-blush-light border border-blush text-xs font-medium transition-all"
                  >
                    <img
                      src={
                        user.avatar ||
                        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
                      }
                      alt={user.name}
                      className="w-6 h-6 rounded-full object-cover border border-gold"
                    />
                    <span className="hidden sm:inline text-xs font-semibold text-charcoal max-w-[80px] truncate">
                      {user.name.split(" ")[0]}
                    </span>
                    <ChevronDown className="w-3 h-3 text-charcoal-muted" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div
                      onMouseLeave={() => setUserDropdownOpen(false)}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-luxury-lg border border-blush p-2 z-50 text-xs animate-fadeIn"
                    >
                      <div className="px-3 py-2 border-b border-cream-warm">
                        <div className="font-semibold text-charcoal truncate">
                          {user.name}
                        </div>
                        <div className="text-[10px] text-charcoal-muted truncate">
                          {user.email}
                        </div>
                        <span className="inline-block mt-1 text-[9px] uppercase font-bold tracking-wider text-gold-dark bg-gold/15 px-2 py-0.5 rounded-full">
                          {user.role === "admin" ? "Administrator 👑" : "Customer ✨"}
                        </span>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/account"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-charcoal hover:text-burgundy hover:bg-cream-soft rounded-lg transition-colors"
                        >
                          <UserIcon className="w-3.5 h-3.5 text-burgundy" />
                          <span>Customer Portal</span>
                        </Link>

                        {user.role === "admin" && (
                          <Link
                            href="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-charcoal hover:text-burgundy hover:bg-cream-soft rounded-lg transition-colors"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-gold-dark" />
                            <span>Admin Dashboard</span>
                          </Link>
                        )}
                      </div>

                      <div className="pt-1 border-t border-cream-warm">
                        <button
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  aria-label="Sign In"
                  className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-full bg-cream-soft hover:bg-blush-light text-burgundy border border-blush text-xs font-semibold transition-all"
                >
                  <UserIcon className="w-4 h-4 text-burgundy" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}
            </div>

            {/* Cart Button with Count Badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping Cart"
              className="relative p-2 text-charcoal hover:text-burgundy transition-colors rounded-full hover:bg-cream-soft"
            >
              <ShoppingBag className="w-5 h-5 text-burgundy" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-gold text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="lg:hidden p-2 text-burgundy hover:bg-cream-soft rounded-lg ml-1"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden mt-3 pt-2 border-t border-blush/40">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search sarees, blouses, crafts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-xs pl-3.5 pr-9 py-2 rounded-full border border-blush outline-none text-charcoal shadow-sm"
            />
            <Search className="absolute right-3 w-4 h-4 text-burgundy" />
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-full bg-white/95 backdrop-blur-lg border-b border-blush shadow-luxury-lg px-6 py-6 transition-all animate-fadeIn">
            <div className="flex flex-col gap-4 text-base font-medium text-charcoal">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2 border-b border-cream-warm hover:text-burgundy"
                >
                  <span>{link.name}</span>
                  <ArrowRight className="w-4 h-4 text-gold" />
                </a>
              ))}
              
              <div className="pt-2 flex flex-col gap-2.5">
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 bg-cream-soft border border-blush text-burgundy text-sm font-semibold rounded-full text-center flex items-center justify-center gap-2"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Customer Portal</span>
                </Link>

                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 bg-burgundy-deep text-cream text-sm font-semibold rounded-full text-center flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-gold" />
                  <span>Admin Dashboard</span>
                </Link>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsBookingModalOpen(true);
                  }}
                  className="w-full py-2.5 bg-burgundy text-white text-sm font-semibold rounded-full shadow-md text-center"
                >
                  Book Custom Tailoring
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
