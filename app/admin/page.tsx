"use client";

import React, { useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useShop } from "@/context/ShopContext";
import { Product, Order, TailoringInquiry } from "@/lib/types";
import {
  ShieldCheck,
  Package,
  ShoppingBag,
  Scissors,
  DollarSign,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  Clock,
  Phone,
  MessageCircle,
  Eye,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Search,
  Filter,
  Check,
  X,
  RefreshCw,
  Database,
  Users,
  Copy,
  MapPin,
  Mail,
  Lock,
  AlertCircle,
  LogOut,
  Key,
  UserCheck,
} from "lucide-react";
import Link from "next/link";

export default function AdminPortalPage() {
  const {
    user,
    login,
    logout,
    customersList,
    isLoadingCustomers,
    refreshCustomers,
  } = useAuth();
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    tailoringInquiries,
    updateInquiryStatus,
    showToast,
    dbStatus,
    refreshDbStatus,
    seedDatabase,
    refreshProducts,
  } = useShop();

  const [activeTab, setActiveTab] = useState<"overview" | "products" | "customers" | "orders" | "tailoring">("overview");

  // Search and Filter States
  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");
  const [productStockFilter, setProductStockFilter] = useState<"all" | "inStock" | "outOfStock">("all");

  const [customerSearch, setCustomerSearch] = useState("");

  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");

  const [inquirySearch, setInquirySearch] = useState("");
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<string>("all");

  // Atlas & Seeding State
  const [isAtlasModalOpen, setIsAtlasModalOpen] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // New Product Modal State
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProdName, setNewProdName] = useState("");
  const [newProdCategory, setNewProdCategory] = useState<Product["category"]>("sarees");
  const [newProdPrice, setNewProdPrice] = useState<number>(1299);
  const [newProdOldPrice, setNewProdOldPrice] = useState<number>(1899);
  const [newProdDiscount, setNewProdDiscount] = useState<number>(20);
  const [newProdDesc, setNewProdDesc] = useState("");
  const [newProdImage, setNewProdImage] = useState("/images/categories/sarees.jpg");

  // Admin Sign-In Form State
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminLoginError, setAdminLoginError] = useState("");
  const [isAdminLoggingIn, setIsAdminLoggingIn] = useState(false);

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.categoryLabel.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.description.toLowerCase().includes(productSearch.toLowerCase());
      const matchesCategory =
        productCategoryFilter === "all" || p.category === productCategoryFilter;
      const matchesStock =
        productStockFilter === "all"
          ? true
          : productStockFilter === "inStock"
          ? p.inStock
          : !p.inStock;
      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, productSearch, productCategoryFilter, productStockFilter]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customerPhone.includes(orderSearch);
      const matchesStatus =
        orderStatusFilter === "all" || o.status === orderStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  // Filtered Inquiries
  const filteredInquiries = useMemo(() => {
    return tailoringInquiries.filter((inq) => {
      const matchesSearch =
        inq.fullName.toLowerCase().includes(inquirySearch.toLowerCase()) ||
        inq.phone.includes(inquirySearch) ||
        inq.city.toLowerCase().includes(inquirySearch.toLowerCase()) ||
        inq.serviceType.toLowerCase().includes(inquirySearch.toLowerCase());
      const matchesStatus =
        inquiryStatusFilter === "all" || inq.status === inquiryStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tailoringInquiries, inquirySearch, inquiryStatusFilter]);

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    return customersList.filter((c) => {
      const term = customerSearch.toLowerCase();
      return (
        c.name.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        (c.phone && c.phone.includes(term)) ||
        (c.city && c.city.toLowerCase().includes(term)) ||
        (c.address && c.address.toLowerCase().includes(term))
      );
    });
  }, [customersList, customerSearch]);

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    await Promise.all([refreshProducts(), refreshCustomers(), refreshDbStatus()]);
    setIsRefreshing(false);
    showToast("Data synced from MongoDB Atlas! 🔄");
  };

  const handleSeed = async () => {
    if (!window.confirm("Seed default product catalog and initial customers to MongoDB Atlas?")) return;
    setIsSeeding(true);
    await seedDatabase();
    await refreshCustomers();
    setIsSeeding(false);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) {
      showToast("Please enter a product title");
      return;
    }

    const newProd: Product = {
      id: "prod-" + Date.now(),
      name: newProdName.trim(),
      slug: newProdName.toLowerCase().replace(/\s+/g, "-"),
      category: newProdCategory,
      categoryLabel:
        newProdCategory === "sarees"
          ? "Sarees"
          : newProdCategory === "blouses"
          ? "Blouses"
          : newProdCategory === "dresses"
          ? "Dresses & Kurtis"
          : newProdCategory === "kids"
          ? "Kids Wear"
          : newProdCategory === "crafts"
          ? "Art & Crafts"
          : "Customized Gifts",
      price: Number(newProdPrice),
      oldPrice: Number(newProdOldPrice),
      discount: Number(newProdDiscount),
      rating: 5.0,
      reviewsCount: 1,
      image: newProdImage,
      description: newProdDesc.trim() || "Exquisite luxury artisanal craft piece from Nithu Fashion World.",
      inStock: true,
      isCustomizable: true,
    };

    addProduct(newProd);
    setIsAddProductOpen(false);
    // Reset
    setNewProdName("");
    setNewProdDesc("");
    showToast(`Product "${newProd.name}" added to live store! 🛍️`);
  };

  const handleUpdateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    updateProduct(editingProduct.id, {
      name: editingProduct.name,
      price: Number(editingProduct.price),
      oldPrice: Number(editingProduct.oldPrice),
      discount: Number(editingProduct.discount),
      inStock: editingProduct.inStock,
      description: editingProduct.description,
      image: editingProduct.image,
    });

    setEditingProduct(null);
    showToast("Product updated successfully! ✨");
  };

  const handleAdminManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail || !adminPassword) {
      setAdminLoginError("Please enter your admin email and password.");
      return;
    }
    setAdminLoginError("");
    setIsAdminLoggingIn(true);
    try {
      const success = await login(adminEmail, adminPassword);
      if (success) {
        showToast("Authenticated as Store Admin 👑");
      } else {
        setAdminLoginError("Invalid credentials. Please verify your password.");
      }
    } catch (err: any) {
      setAdminLoginError(err.message || "Admin login failed.");
    } finally {
      setIsAdminLoggingIn(false);
    }
  };

  // Case 1: Authenticated BUT role is Customer (Broken Access Control Defense)
  if (user && user.role !== "admin") {
    return (
      <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 bg-[#FFF7F0]">
        <div className="max-w-lg w-full bg-white rounded-3xl p-8 sm:p-10 border-2 border-amber-300 shadow-luxury text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto text-amber-700">
            <AlertCircle className="w-8 h-8 text-amber-700" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-wider font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full border border-amber-300">
              Access Denied • 403 Forbidden
            </span>
            <h1
              className="text-2xl sm:text-3xl font-serif text-charcoal font-bold mt-2"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Administrator Privileges Required
            </h1>
            <p className="text-xs text-charcoal-muted leading-relaxed max-w-md mx-auto">
              You are currently signed in with a standard <strong>Customer Account</strong>. Administrative access to product catalogs, customer directories, and database controls is restricted.
            </p>
          </div>

          {/* Current Session Info */}
          <div className="bg-cream-soft rounded-2xl p-4 border border-blush text-left text-xs space-y-1.5">
            <div className="text-[10px] uppercase font-bold text-charcoal-muted tracking-wider">
              Current Session
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-charcoal">{user.name}</span>
              <span className="text-[10px] bg-blush text-burgundy font-semibold px-2 py-0.5 rounded-full uppercase">
                Role: {user.role}
              </span>
            </div>
            <div className="text-charcoal-muted text-[11px]">{user.email}</div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={() => {
                logout();
                showToast("Signed out. Please enter administrator credentials.");
              }}
              className="w-full py-3 bg-burgundy hover:bg-burgundy-deep text-cream text-xs font-semibold uppercase tracking-wider rounded-full shadow-md transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4 text-gold-light" />
              <span>Sign Out & Enter Administrator Credentials</span>
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              <Link
                href="/account"
                className="py-2.5 bg-cream-soft hover:bg-blush-light text-burgundy border border-blush text-xs font-semibold rounded-full transition-all text-center"
              >
                Go to Customer Portal
              </Link>
              <Link
                href="/"
                className="py-2.5 bg-cream-soft hover:bg-blush-light text-charcoal border border-cream-warm text-xs font-semibold rounded-full transition-all text-center"
              >
                Return to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Case 2: Unauthenticated — Render Secure Admin Sign-In Gate
  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 bg-[#FFF7F0]">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-blush shadow-luxury space-y-6 animate-fadeIn">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-burgundy/20 to-gold/20 flex items-center justify-center mx-auto text-burgundy border border-gold/40 shadow-sm">
              <ShieldCheck className="w-8 h-8 text-gold-dark" />
            </div>
            <span className="text-[10px] uppercase tracking-wider font-bold bg-gold/15 text-gold-dark px-3 py-0.5 rounded-full border border-gold/30">
              NITHU FASHION WORLD
            </span>
            <h1
              className="text-2xl sm:text-3xl font-serif text-charcoal font-bold mt-1"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Admin Portal Sign-In
            </h1>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Store management console is restricted to authorized administrators.
            </p>
          </div>

          {/* Error Message */}
          {adminLoginError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs text-center font-medium">
              {adminLoginError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAdminManualLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">
                Admin Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 w-4 h-4 text-burgundy" />
                <input
                  type="email"
                  required
                  placeholder="admin@example.com"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full bg-cream-soft text-charcoal text-xs pl-9 pr-3 py-3 rounded-xl border border-blush focus:border-burgundy outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">
                Admin Password
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 w-4 h-4 text-burgundy" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full bg-cream-soft text-charcoal text-xs pl-9 pr-3 py-3 rounded-xl border border-blush focus:border-burgundy outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isAdminLoggingIn}
              className="w-full py-3.5 bg-burgundy hover:bg-burgundy-deep text-cream text-xs font-semibold uppercase tracking-wider rounded-full shadow-md hover:shadow-luxury transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isAdminLoggingIn ? (
                <span>Authenticating with MongoDB Atlas...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-gold-light" />
                  <span>Sign In to Admin Portal</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-blush text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-charcoal-muted hover:text-burgundy transition"
            >
              ← Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0) + 142000;

  return (
    <div className="min-h-screen bg-[#FFF7F0] py-8 sm:py-12">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-[#3D0008] via-[#57000D] to-[#2A0005] text-cream-ivory rounded-3xl p-5 sm:p-7 shadow-luxury mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border-2 border-gold/40">
          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gold/20 border border-gold/40 flex items-center justify-center text-gold flex-shrink-0">
              <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider bg-gold text-burgundy-deep font-bold px-2 py-0.5 rounded-full">
                  Admin Console 👑
                </span>
                <span className="text-xs text-gold-light font-medium">NITHU FASHION WORLD</span>
              </div>
              <h1
                className="text-xl sm:text-2xl lg:text-3xl font-serif text-cream font-bold mt-1"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Store Administration & Craft Center
              </h1>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2.5 w-full md:w-auto">
            {/* MongoDB Atlas Status Pill */}
            <button
              onClick={() => setIsAtlasModalOpen(true)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                dbStatus?.connected
                  ? "bg-emerald-950/80 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900"
                  : "bg-amber-950/80 border-amber-500/50 text-amber-300 hover:bg-amber-900"
              }`}
              title="Click to check MongoDB Atlas connection & setup guide"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  dbStatus?.connected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                }`}
              />
              <Database className="w-3.5 h-3.5 text-gold-light" />
              <span>
                {dbStatus?.connected
                  ? `Atlas: Connected (${dbStatus.database || "nithu_fashion_world"})`
                  : "Atlas: Setup Guide"}
              </span>
            </button>

            {/* Seed Database Button */}
            <button
              onClick={handleSeed}
              disabled={isSeeding}
              className="px-3 py-1.5 bg-burgundy-rich hover:bg-burgundy text-cream text-xs font-semibold rounded-full border border-gold/30 flex items-center gap-1.5 transition-colors disabled:opacity-50"
              title="Seed initial products and customers into MongoDB Atlas"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>{isSeeding ? "Seeding..." : "Seed Atlas"}</span>
            </button>

            {/* Refresh Sync Button */}
            <button
              onClick={handleRefreshAll}
              disabled={isRefreshing}
              className="p-2 bg-burgundy-rich hover:bg-burgundy text-cream text-xs font-semibold rounded-full border border-gold/30 flex items-center justify-center transition-colors disabled:opacity-50"
              title="Refresh and sync data from MongoDB Atlas"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            </button>

            <Link
              href="/"
              target="_blank"
              className="flex-1 md:flex-none text-center px-4 py-2 bg-burgundy-rich hover:bg-burgundy text-cream text-xs font-semibold rounded-full border border-gold/30 flex items-center justify-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-gold-light" />
              <span>Live Store</span>
            </Link>
            <Link
              href="/account"
              className="flex-1 md:flex-none text-center px-4 py-2 bg-gold hover:bg-gold-light text-burgundy-deep text-xs font-semibold rounded-full shadow-gold transition-colors"
            >
              Customer Portal
            </Link>

            {/* Logged in Admin Identity & Sign Out */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/15 border border-gold/40 text-cream text-xs">
              <img
                src={
                  user.avatar ||
                  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
                }
                alt={user.name}
                className="w-5 h-5 rounded-full object-cover border border-gold"
              />
              <span className="font-semibold text-cream hidden lg:inline max-w-[100px] truncate">
                {user.name}
              </span>
              <button
                onClick={() => {
                  logout();
                  showToast("Signed out of Admin Console 👋");
                }}
                className="ml-1 px-2 py-0.5 rounded bg-burgundy hover:bg-burgundy-deep text-gold-light text-[10px] font-bold uppercase transition-colors flex items-center gap-1"
                title="Sign Out of Admin Console"
              >
                <LogOut className="w-3 h-3" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* 5 Stats KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-blush shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-[11px] uppercase font-semibold text-charcoal-muted">
                Gross Revenue
              </span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl sm:text-2xl font-serif font-bold text-burgundy mt-1">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">
              +18.4% this month
            </span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-blush shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-[11px] uppercase font-semibold text-charcoal-muted">
                Active Orders
              </span>
              <ShoppingBag className="w-4 h-4 text-burgundy" />
            </div>
            <div className="text-xl sm:text-2xl font-serif font-bold text-burgundy mt-1">
              {orders.length}
            </div>
            <span className="text-[10px] text-burgundy font-semibold">
              In production & delivery
            </span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-blush shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-[11px] uppercase font-semibold text-charcoal-muted">
                Registered Customers
              </span>
              <Users className="w-4 h-4 text-burgundy" />
            </div>
            <div className="text-xl sm:text-2xl font-serif font-bold text-burgundy mt-1">
              {customersList.length}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">
              In MongoDB Atlas ✓
            </span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-blush shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-[11px] uppercase font-semibold text-charcoal-muted">
                Catalog Items
              </span>
              <Package className="w-4 h-4 text-burgundy" />
            </div>
            <div className="text-xl sm:text-2xl font-serif font-bold text-burgundy mt-1">
              {products.length}
            </div>
            <span className="text-[10px] text-charcoal-muted">
              Live in catalog
            </span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-blush shadow-sm hover:shadow-md transition-shadow col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-[11px] uppercase font-semibold text-charcoal-muted">
                Tailoring Leads
              </span>
              <Scissors className="w-4 h-4 text-gold-dark" />
            </div>
            <div className="text-xl sm:text-2xl font-serif font-bold text-burgundy mt-1">
              {tailoringInquiries.length}
            </div>
            <span className="text-[10px] text-gold-dark font-semibold">
              Aari & bridal inquiries
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-blush mb-6 gap-2 sm:gap-6 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "overview"
                ? "border-burgundy text-burgundy font-serif text-base"
                : "border-transparent text-charcoal-muted hover:text-charcoal"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "products"
                ? "border-burgundy text-burgundy font-serif text-base"
                : "border-transparent text-charcoal-muted hover:text-charcoal"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Product Catalog ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("customers")}
            className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "customers"
                ? "border-burgundy text-burgundy font-serif text-base"
                : "border-transparent text-charcoal-muted hover:text-charcoal"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Customer Details ({customersList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "orders"
                ? "border-burgundy text-burgundy font-serif text-base"
                : "border-transparent text-charcoal-muted hover:text-charcoal"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Customer Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("tailoring")}
            className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "tailoring"
                ? "border-burgundy text-burgundy font-serif text-base"
                : "border-transparent text-charcoal-muted hover:text-charcoal"
            }`}
          >
            <Scissors className="w-4 h-4" />
            <span>Tailoring Inquiries ({tailoringInquiries.length})</span>
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            {/* Left 2 Cols: Recent Orders Table */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-6 border border-blush shadow-card space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-cream-warm">
                <div>
                  <h3
                    className="text-lg font-serif font-bold text-charcoal"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    Recent Customer Orders
                  </h3>
                  <p className="text-[11px] text-charcoal-muted">Live incoming customer orders</p>
                </div>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="text-xs font-semibold text-burgundy hover:underline"
                >
                  View All ({orders.length}) →
                </button>
              </div>

              <div className="divide-y divide-cream-warm">
                {orders.map((o) => (
                  <div key={o.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold text-charcoal flex items-center gap-2">
                        <span>{o.orderNumber}</span>
                        <span className="text-charcoal-muted">•</span>
                        <span>{o.customerName}</span>
                      </div>
                      <div className="text-[11px] text-charcoal-muted mt-0.5">
                        {o.items.length} item(s) • <strong className="text-burgundy">₹{o.totalAmount.toLocaleString("en-IN")}</strong> • {o.paymentMethod}
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <select
                        value={o.status}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value as Order["status"])}
                        className="text-xs p-1.5 rounded-lg border border-blush bg-cream-soft font-semibold text-burgundy cursor-pointer outline-none"
                      >
                        <option value="Processing">Processing</option>
                        <option value="In Tailoring">In Tailoring</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>

                      <a
                        href={`https://wa.me/91${o.customerPhone}?text=Hello%20${encodeURIComponent(o.customerName)},%20this%20is%20Nithu%20Fashion%20World%20regarding%20your%20order%20${o.orderNumber}%20(Status:%20${o.status}).`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4 fill-current" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 1 Col: Quick Stitching Inquiries */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-blush shadow-card space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-cream-warm">
                <div>
                  <h3
                    className="text-lg font-serif font-bold text-charcoal"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    Latest Tailoring Inquiries
                  </h3>
                  <p className="text-[11px] text-charcoal-muted">Custom stitching requests</p>
                </div>
                <button
                  onClick={() => setActiveTab("tailoring")}
                  className="text-xs font-semibold text-burgundy hover:underline"
                >
                  View All →
                </button>
              </div>

              <div className="space-y-3">
                {tailoringInquiries.slice(0, 3).map((inq) => (
                  <div key={inq.id} className="p-3 bg-cream-soft rounded-xl border border-blush/60 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-charcoal">{inq.fullName}</span>
                      <span className="text-[10px] text-burgundy font-semibold bg-white px-2 py-0.5 rounded-full border border-blush">
                        {inq.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-charcoal-muted line-clamp-1">{inq.serviceType}</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-charcoal-muted">{inq.phone} ({inq.city})</span>
                      <a
                        href={`https://wa.me/91${inq.phone}?text=Hello%20${encodeURIComponent(inq.fullName)},%20this%20is%20Nithu%20Fashion%20World%20regarding%20your%20tailoring%20consultation.`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 hover:underline"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-current" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Products Management */}
        {activeTab === "products" && (
          <div className="bg-white rounded-3xl p-5 sm:p-8 border border-blush shadow-card space-y-5 animate-fadeIn">
            {/* Header + Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-cream-warm gap-4">
              <div>
                <h2
                  className="text-xl sm:text-2xl font-serif font-bold text-charcoal"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  Catalog Products ({filteredProducts.length} of {products.length})
                </h2>
                <p className="text-xs text-charcoal-muted">
                  Add, edit pricing, or toggle stock for sarees, blouses, kurtis, and crafts.
                </p>
              </div>

              <button
                onClick={() => setIsAddProductOpen(true)}
                className="px-5 py-2.5 bg-burgundy hover:bg-burgundy-deep text-cream text-xs font-semibold rounded-full shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-95"
              >
                <Plus className="w-4 h-4 text-gold-light" />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-cream-soft p-3 rounded-2xl border border-blush">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-charcoal-muted absolute left-3" />
                <input
                  type="text"
                  placeholder="Search product title..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full text-xs bg-white pl-9 pr-3 py-2 rounded-xl border border-blush outline-none"
                />
              </div>

              <select
                value={productCategoryFilter}
                onChange={(e) => setProductCategoryFilter(e.target.value)}
                className="text-xs bg-white px-3 py-2 rounded-xl border border-blush outline-none cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="sarees">Sarees</option>
                <option value="blouses">Blouses</option>
                <option value="dresses">Dresses & Kurtis</option>
                <option value="kids">Kids Wear</option>
                <option value="crafts">Art & Crafts</option>
                <option value="gifts">Customized Gifts</option>
              </select>

              <select
                value={productStockFilter}
                onChange={(e) => setProductStockFilter(e.target.value as any)}
                className="text-xs bg-white px-3 py-2 rounded-xl border border-blush outline-none cursor-pointer"
              >
                <option value="all">All Stock Status</option>
                <option value="inStock">In Stock Only</option>
                <option value="outOfStock">Out of Stock Only</option>
              </select>
            </div>

            {/* Products Table (Desktop) / Cards (Mobile) */}
            {filteredProducts.length === 0 ? (
              <div className="py-12 text-center text-charcoal-muted text-xs">
                No products match your search or filter criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[600px]">
                  <thead>
                    <tr className="border-b border-blush text-charcoal-muted uppercase text-[10px] tracking-wider">
                      <th className="pb-3">Product</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Price</th>
                      <th className="pb-3">Discount</th>
                      <th className="pb-3">Stock Status</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-warm">
                    {filteredProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-cream-soft/50 transition-colors">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-12 h-12 rounded-xl object-cover border border-blush flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="font-serif font-semibold text-charcoal text-sm truncate max-w-xs">
                                {prod.name}
                              </div>
                              <div className="text-[10px] text-charcoal-muted line-clamp-1 max-w-xs">
                                {prod.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-charcoal-muted font-medium">
                          {prod.categoryLabel}
                        </td>
                        <td className="py-3 font-serif font-bold text-burgundy text-sm">
                          ₹{prod.price.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3">
                          {prod.discount ? (
                            <span className="bg-burgundy/10 text-burgundy font-semibold px-2 py-0.5 rounded-full text-[10px]">
                              {prod.discount}% OFF
                            </span>
                          ) : (
                            <span className="text-charcoal-muted">-</span>
                          )}
                        </td>
                        <td className="py-3">
                          <button
                            onClick={() => updateProduct(prod.id, { inStock: !prod.inStock })}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors ${
                              prod.inStock
                                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                : "bg-red-100 text-red-800 hover:bg-red-200"
                            }`}
                          >
                            {prod.inStock ? "In Stock ✓" : "Out of Stock ✗"}
                          </button>
                        </td>
                        <td className="py-3 text-right whitespace-nowrap">
                          <button
                            onClick={() => setEditingProduct(prod)}
                            title="Edit Product"
                            className="p-1.5 rounded-lg text-charcoal-muted hover:text-burgundy hover:bg-cream-warm transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteProduct(prod.id)}
                            title="Delete Product"
                            className="p-1.5 rounded-lg text-charcoal-muted hover:text-red-600 hover:bg-red-50 transition-colors ml-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab: Customer Details (MongoDB Atlas) */}
        {activeTab === "customers" && (
          <div className="bg-white rounded-3xl p-5 sm:p-8 border border-blush shadow-card space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-cream-warm gap-3">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2
                    className="text-xl sm:text-2xl font-serif font-bold text-charcoal"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    Customer Directory & Profiles ({filteredCustomers.length} of {customersList.length})
                  </h2>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                    <Database className="w-3 h-3" /> MongoDB Atlas
                  </span>
                </div>
                <p className="text-xs text-charcoal-muted mt-1">
                  Customer records, delivery addresses, phone numbers, and lifetime order values stored in MongoDB Atlas.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefreshAll}
                  disabled={isRefreshing}
                  className="px-3.5 py-2 bg-cream-soft hover:bg-blush border border-blush text-burgundy text-xs font-semibold rounded-full flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                  <span>Sync from Atlas</span>
                </button>
              </div>
            </div>

            {/* Search Box */}
            <div className="relative flex items-center bg-cream-soft p-3 rounded-2xl border border-blush">
              <Search className="w-4 h-4 text-charcoal-muted absolute left-6" />
              <input
                type="text"
                placeholder="Search customers by name, email, phone number, address, or city..."
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                className="w-full text-xs bg-white pl-10 pr-4 py-2.5 rounded-xl border border-blush outline-none focus:border-burgundy"
              />
            </div>

            {isLoadingCustomers ? (
              <div className="py-16 text-center text-charcoal-muted text-xs space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-burgundy" />
                <p>Loading customers from MongoDB Atlas...</p>
              </div>
            ) : filteredCustomers.length === 0 ? (
              <div className="py-16 text-center text-charcoal-muted text-xs space-y-3">
                <Users className="w-10 h-10 text-charcoal-muted/40 mx-auto" />
                <p>No customer records match your search criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCustomers.map((cust) => {
                  const cleanPhone = cust.phone ? cust.phone.replace(/[^0-9]/g, "") : "";
                  return (
                    <div
                      key={cust.id || cust.email}
                      className="bg-cream-soft/30 hover:bg-cream-soft/70 border border-blush rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            {cust.avatar ? (
                              <img
                                src={cust.avatar}
                                alt={cust.name}
                                className="w-12 h-12 rounded-full object-cover border border-gold/40 flex-shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-burgundy/10 text-burgundy font-serif font-bold text-lg flex items-center justify-center flex-shrink-0">
                                {cust.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <h4 className="font-serif font-bold text-charcoal text-base">
                                {cust.name}
                              </h4>
                              <span
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                  cust.role === "admin"
                                    ? "bg-gold/20 text-burgundy border border-gold/40"
                                    : "bg-white text-charcoal-muted border border-blush"
                                }`}
                              >
                                {cust.role === "admin" ? "Administrator 👑" : "Customer Account"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1.5 text-xs text-charcoal-muted pt-1">
                          <div className="flex items-center gap-2 text-charcoal truncate">
                            <Mail className="w-3.5 h-3.5 text-burgundy flex-shrink-0" />
                            <a href={`mailto:${cust.email}`} className="hover:text-burgundy hover:underline truncate">
                              {cust.email}
                            </a>
                          </div>

                          {cust.phone && (
                            <div className="flex items-center gap-2 text-charcoal">
                              <Phone className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                              <span>{cust.phone}</span>
                            </div>
                          )}

                          <div className="flex items-start gap-2 text-charcoal leading-relaxed">
                            <MapPin className="w-3.5 h-3.5 text-gold-dark flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-2">
                              {cust.address || "Address not provided"}, {cust.city || "Tamil Nadu"} {cust.pincode ? `- ${cust.pincode}` : ""}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-[11px] text-charcoal-muted pt-0.5">
                            <Clock className="w-3 h-3 text-charcoal-muted" />
                            <span>Member since: {cust.joinedDate || "Recent"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-blush/60 space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-center text-xs">
                          <div className="bg-white p-2 rounded-xl border border-blush/80">
                            <span className="text-[10px] text-charcoal-muted block uppercase">Orders Placed</span>
                            <span className="font-bold text-burgundy text-sm">{cust.totalOrders || 0}</span>
                          </div>
                          <div className="bg-white p-2 rounded-xl border border-blush/80">
                            <span className="text-[10px] text-charcoal-muted block uppercase">Total Spent</span>
                            <span className="font-bold text-burgundy text-sm">₹{(cust.totalSpent || 0).toLocaleString("en-IN")}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {cleanPhone ? (
                            <a
                              href={`https://wa.me/91${cleanPhone}?text=Hello%20${encodeURIComponent(cust.name)},%20greetings%20from%20Nithu%20Fashion%20World!`}
                              target="_blank"
                              rel="noreferrer"
                              className="flex-1 py-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all"
                            >
                              <MessageCircle className="w-3.5 h-3.5 fill-current" />
                              <span>WhatsApp Customer</span>
                            </a>
                          ) : (
                            <a
                              href={`mailto:${cust.email}`}
                              className="flex-1 py-2 bg-burgundy hover:bg-burgundy-deep text-cream text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>Send Email</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Orders Management */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-3xl p-5 sm:p-8 border border-blush shadow-card space-y-5 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-cream-warm gap-3">
              <div>
                <h2
                  className="text-xl sm:text-2xl font-serif font-bold text-charcoal"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  Customer Orders Management ({filteredOrders.length} of {orders.length})
                </h2>
                <p className="text-xs text-charcoal-muted">
                  Update fulfillment status and contact customers directly via WhatsApp.
                </p>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-cream-soft p-3 rounded-2xl border border-blush">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-charcoal-muted absolute left-3" />
                <input
                  type="text"
                  placeholder="Search by Order ID, Customer Name, or Phone..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full text-xs bg-white pl-9 pr-3 py-2 rounded-xl border border-blush outline-none"
                />
              </div>

              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="text-xs bg-white px-3 py-2 rounded-xl border border-blush outline-none cursor-pointer"
              >
                <option value="all">All Order Statuses</option>
                <option value="Processing">Processing</option>
                <option value="In Tailoring">In Tailoring</option>
                <option value="Dispatched">Dispatched</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="py-12 text-center text-charcoal-muted text-xs">
                No orders match your search or filter.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((o) => (
                  <div key={o.id} className="p-4 sm:p-5 rounded-2xl border border-blush bg-cream-soft/40 space-y-3 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-blush gap-2">
                      <div>
                        <span className="text-sm font-bold font-serif text-burgundy">{o.orderNumber}</span>
                        <span className="text-xs text-charcoal-muted ml-3">Customer: <strong>{o.customerName}</strong> ({o.customerPhone})</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs text-charcoal-muted font-medium">Status:</span>
                        <select
                          value={o.status}
                          onChange={(e) => updateOrderStatus(o.id, e.target.value as Order["status"])}
                          className="text-xs p-2 rounded-xl border border-burgundy bg-white font-semibold text-burgundy cursor-pointer outline-none shadow-sm"
                        >
                          <option value="Processing">Processing</option>
                          <option value="In Tailoring">In Tailoring</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>

                        <a
                          href={`https://wa.me/91${o.customerPhone}?text=Hello%20${encodeURIComponent(o.customerName)},%20this%20is%20Nithu%20Fashion%20World%20regarding%20your%20order%20${o.orderNumber}%20(Current%20Status:%20${o.status}).`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-current" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>

                    <div className="text-xs text-charcoal-muted">
                      <strong>Shipping Address:</strong> {o.deliveryAddress}
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {o.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-blush text-xs">
                          <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
                          <span>{item.name} (x{item.quantity})</span>
                          <span className="font-bold text-burgundy">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-cream-warm text-xs">
                      <span>Payment: <strong>{o.paymentMethod}</strong> ({o.paymentStatus})</span>
                      <span className="text-sm font-bold font-serif text-burgundy">Total: ₹{o.totalAmount.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Tailoring & Aari Leads */}
        {activeTab === "tailoring" && (
          <div className="bg-white rounded-3xl p-5 sm:p-8 border border-blush shadow-card space-y-5 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-cream-warm gap-3">
              <div>
                <h2
                  className="text-xl sm:text-2xl font-serif font-bold text-charcoal"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  Tailoring & Aari Inquiries ({filteredInquiries.length} of {tailoringInquiries.length})
                </h2>
                <p className="text-xs text-charcoal-muted">
                  Client consultations, custom measurements, and direct WhatsApp communication.
                </p>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-cream-soft p-3 rounded-2xl border border-blush">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-charcoal-muted absolute left-3" />
                <input
                  type="text"
                  placeholder="Search by Client Name, City, or Service..."
                  value={inquirySearch}
                  onChange={(e) => setInquirySearch(e.target.value)}
                  className="w-full text-xs bg-white pl-9 pr-3 py-2 rounded-xl border border-blush outline-none"
                />
              </div>

              <select
                value={inquiryStatusFilter}
                onChange={(e) => setInquiryStatusFilter(e.target.value)}
                className="text-xs bg-white px-3 py-2 rounded-xl border border-blush outline-none cursor-pointer"
              >
                <option value="all">All Consultation Statuses</option>
                <option value="New Inquiry">New Inquiry</option>
                <option value="Measurement Done">Measurement Done</option>
                <option value="In Crafting">In Crafting</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {filteredInquiries.length === 0 ? (
              <div className="py-12 text-center text-charcoal-muted text-xs">
                No tailoring inquiries match your search.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredInquiries.map((inq) => (
                  <div key={inq.id} className="p-4 sm:p-5 rounded-2xl border border-blush bg-cream-soft/40 space-y-3 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-blush gap-2">
                      <div>
                        <h4 className="text-base font-serif font-bold text-charcoal">{inq.fullName}</h4>
                        <span className="text-xs text-burgundy font-medium">{inq.serviceType}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={inq.status}
                          onChange={(e) => updateInquiryStatus(inq.id, e.target.value as TailoringInquiry["status"])}
                          className="text-xs p-2 rounded-xl border border-burgundy bg-white font-semibold text-burgundy cursor-pointer outline-none shadow-sm"
                        >
                          <option value="New Inquiry">New Inquiry</option>
                          <option value="Measurement Done">Measurement Done</option>
                          <option value="In Crafting">In Crafting</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-blush/60 text-xs text-charcoal leading-relaxed">
                      <strong>Measurements & Design Notes:</strong> {inq.notes || "Standard measurements requested."}
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-charcoal-muted pt-1">
                      <div>City: <strong>{inq.city}</strong> | Phone: <strong>{inq.phone}</strong> | Date: {inq.createdAt}</div>
                      <a
                        href={`https://wa.me/91${inq.phone}?text=Hello%20${encodeURIComponent(inq.fullName)},%20this%20is%20Nithu%20Fashion%20World%20regarding%20your%20tailoring%20consultation.`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-current" />
                        <span>Chat on WhatsApp ({inq.phone})</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal: Add Product */}
        {isAddProductOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-blush space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-cream-warm">
                <h3
                  className="text-xl sm:text-2xl font-serif text-charcoal font-bold"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  Add Product to Catalog
                </h3>
                <button
                  onClick={() => setIsAddProductOpen(false)}
                  className="p-1 rounded-full hover:bg-cream-soft text-charcoal-muted"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateProduct} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Maroon Velvet Bridal Blouse"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    className="w-full bg-cream-soft text-charcoal text-xs p-2.5 rounded-xl border border-blush outline-none focus:border-burgundy"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-charcoal mb-1">
                      Category
                    </label>
                    <select
                      value={newProdCategory}
                      onChange={(e) => setNewProdCategory(e.target.value as any)}
                      className="w-full bg-cream-soft text-charcoal text-xs p-2.5 rounded-xl border border-blush outline-none cursor-pointer"
                    >
                      <option value="sarees">Sarees</option>
                      <option value="blouses">Blouses</option>
                      <option value="dresses">Dresses & Kurtis</option>
                      <option value="kids">Kids Wear</option>
                      <option value="crafts">Art & Crafts</option>
                      <option value="gifts">Customized Gifts</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-charcoal mb-1">
                      Selling Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(Number(e.target.value))}
                      className="w-full bg-cream-soft text-charcoal text-xs p-2.5 rounded-xl border border-blush outline-none focus:border-burgundy"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-charcoal mb-1">
                      Original / MRP Price (₹)
                    </label>
                    <input
                      type="number"
                      value={newProdOldPrice}
                      onChange={(e) => setNewProdOldPrice(Number(e.target.value))}
                      className="w-full bg-cream-soft text-charcoal text-xs p-2.5 rounded-xl border border-blush outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-charcoal mb-1">
                      Discount %
                    </label>
                    <input
                      type="number"
                      value={newProdDiscount}
                      onChange={(e) => setNewProdDiscount(Number(e.target.value))}
                      className="w-full bg-cream-soft text-charcoal text-xs p-2.5 rounded-xl border border-blush outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">
                    Image Selection
                  </label>
                  <select
                    value={newProdImage}
                    onChange={(e) => setNewProdImage(e.target.value)}
                    className="w-full bg-cream-soft text-charcoal text-xs p-2.5 rounded-xl border border-blush outline-none cursor-pointer"
                  >
                    <option value="/images/categories/sarees.jpg">Kanchipuram Saree</option>
                    <option value="/images/categories/blouses.jpg">Designer Bridal Blouse</option>
                    <option value="/images/categories/dresses.jpg">Pleated Dress / Kurti</option>
                    <option value="/images/categories/kids.jpg">Kids Frock</option>
                    <option value="/images/products/decor-01.jpg">Wall Décor Mandala</option>
                    <option value="/images/products/potli-01.jpg">Embroidered Potli Bag</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={newProdDesc}
                    onChange={(e) => setNewProdDesc(e.target.value)}
                    placeholder="Short description of fabric, embroidery, and care..."
                    className="w-full bg-cream-soft text-charcoal text-xs p-2.5 rounded-xl border border-blush outline-none resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddProductOpen(false)}
                    className="flex-1 py-2.5 border border-blush text-xs font-semibold rounded-full hover:bg-cream-soft transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-burgundy hover:bg-burgundy-deep text-cream text-xs font-semibold rounded-full shadow-md transition-all"
                  >
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Edit Product */}
        {editingProduct && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-blush space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-cream-warm">
                <h3
                  className="text-xl sm:text-2xl font-serif text-charcoal font-bold"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  Edit Product Details
                </h3>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="p-1 rounded-full hover:bg-cream-soft text-charcoal-muted"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateProductSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, name: e.target.value })
                    }
                    className="w-full bg-cream-soft text-charcoal text-xs p-2.5 rounded-xl border border-blush outline-none focus:border-burgundy"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-charcoal mb-1">
                      Selling Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      value={editingProduct.price}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          price: Number(e.target.value),
                        })
                      }
                      className="w-full bg-cream-soft text-charcoal text-xs p-2.5 rounded-xl border border-blush outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-charcoal mb-1">
                      Original Price (₹)
                    </label>
                    <input
                      type="number"
                      value={editingProduct.oldPrice || 0}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          oldPrice: Number(e.target.value),
                        })
                      }
                      className="w-full bg-cream-soft text-charcoal text-xs p-2.5 rounded-xl border border-blush outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-charcoal mb-1">
                      Discount %
                    </label>
                    <input
                      type="number"
                      value={editingProduct.discount || 0}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          discount: Number(e.target.value),
                        })
                      }
                      className="w-full bg-cream-soft text-charcoal text-xs p-2.5 rounded-xl border border-blush outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-charcoal mb-1">
                      Stock Availability
                    </label>
                    <select
                      value={editingProduct.inStock ? "inStock" : "outOfStock"}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          inStock: e.target.value === "inStock",
                        })
                      }
                      className="w-full bg-cream-soft text-charcoal text-xs p-2.5 rounded-xl border border-blush outline-none cursor-pointer"
                    >
                      <option value="inStock">In Stock ✓</option>
                      <option value="outOfStock">Out of Stock ✗</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={editingProduct.description}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        description: e.target.value,
                      })
                    }
                    className="w-full bg-cream-soft text-charcoal text-xs p-2.5 rounded-xl border border-blush outline-none resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="flex-1 py-2.5 border border-blush text-xs font-semibold rounded-full hover:bg-cream-soft transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-burgundy hover:bg-burgundy-deep text-cream text-xs font-semibold rounded-full shadow-md transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: MongoDB Atlas Setup & Connection Guide */}
        {isAtlasModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-blush space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-cream-warm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3
                      className="text-xl sm:text-2xl font-serif text-charcoal font-bold"
                      style={{ fontFamily: "var(--font-cormorant)" }}
                    >
                      MongoDB Atlas Cloud Storage
                    </h3>
                    <p className="text-xs text-charcoal-muted">
                      Customer Profiles, Product Catalog & Orders Storage
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAtlasModalOpen(false)}
                  className="p-1 rounded-full hover:bg-cream-soft text-charcoal-muted"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Card */}
              <div
                className={`p-4 rounded-2xl border text-xs space-y-2 ${
                  dbStatus?.connected
                    ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                    : "bg-amber-50 border-amber-200 text-amber-950"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        dbStatus?.connected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                      }`}
                    />
                    Status: {dbStatus?.connected ? "Connected to MongoDB Atlas 🟢" : "Not Connected / Setup Required ⚠️"}
                  </span>
                  <button
                    onClick={refreshDbStatus}
                    className="text-[11px] font-semibold underline text-burgundy hover:text-burgundy-deep"
                  >
                    Test Connection
                  </button>
                </div>
                <p className="text-charcoal-muted leading-relaxed">
                  {dbStatus?.message ||
                    "Set your MONGODB_URI in .env.local to store customer details and product details in the cloud."}
                </p>

                {dbStatus?.connected && (
                  <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                    <div className="bg-white p-2 rounded-xl border border-emerald-200">
                      <span className="text-[10px] text-charcoal-muted block uppercase">Products in DB</span>
                      <span className="font-bold text-emerald-800 text-base">{dbStatus.stats?.productsCount || 0}</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-emerald-200">
                      <span className="text-[10px] text-charcoal-muted block uppercase">Customers in DB</span>
                      <span className="font-bold text-emerald-800 text-base">{dbStatus.stats?.customersCount || 0}</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-emerald-200">
                      <span className="text-[10px] text-charcoal-muted block uppercase">Orders in DB</span>
                      <span className="font-bold text-emerald-800 text-base">{dbStatus.stats?.ordersCount || 0}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Step-by-Step Instructions */}
              <div className="space-y-4 text-xs text-charcoal leading-relaxed">
                <h4 className="font-serif font-bold text-sm text-burgundy uppercase tracking-wider">
                  Quick MongoDB Atlas Setup (5 Steps)
                </h4>

                <div className="space-y-3">
                  <div className="flex gap-3 items-start bg-cream-soft/50 p-3 rounded-xl border border-blush/60">
                    <span className="w-5 h-5 rounded-full bg-burgundy text-cream text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      <strong>Create Free Atlas Account:</strong> Sign up or log in at{" "}
                      <a
                        href="https://cloud.mongodb.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-burgundy font-bold underline inline-flex items-center gap-1"
                      >
                        cloud.mongodb.com <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start bg-cream-soft/50 p-3 rounded-xl border border-blush/60">
                    <span className="w-5 h-5 rounded-full bg-burgundy text-cream text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      <strong>Create Free Shared Cluster:</strong> Click <em>&quot;Create a Deployment&quot;</em> &gt; choose <strong>M0 (Free)</strong> &gt; Select AWS provider and region (e.g. Mumbai <em>ap-south-1</em>) &gt; Click <em>Create Cluster</em>.
                    </div>
                  </div>

                  <div className="flex gap-3 items-start bg-cream-soft/50 p-3 rounded-xl border border-blush/60">
                    <span className="w-5 h-5 rounded-full bg-burgundy text-cream text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      3
                    </span>
                    <div>
                      <strong>Create Database User:</strong> In Atlas left sidebar, go to <strong>Database Access</strong> &gt; click <em>&quot;Add New Database User&quot;</em>. Set a Username (e.g. <code>nithu_admin</code>) and Password &gt; grant <em>Read and Write to any database</em> &gt; Save.
                    </div>
                  </div>

                  <div className="flex gap-3 items-start bg-cream-soft/50 p-3 rounded-xl border border-blush/60">
                    <span className="w-5 h-5 rounded-full bg-burgundy text-cream text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      4
                    </span>
                    <div>
                      <strong>Allow Network Access:</strong> In left sidebar, click <strong>Network Access</strong> &gt; <em>&quot;Add IP Address&quot;</em> &gt; click <strong>&quot;Allow Access from Anywhere&quot;</strong> (<code>0.0.0.0/0</code>) &gt; Confirm.
                    </div>
                  </div>

                  <div className="flex gap-3 items-start bg-cream-soft/50 p-3 rounded-xl border border-blush/60">
                    <span className="w-5 h-5 rounded-full bg-burgundy text-cream text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      5
                    </span>
                    <div>
                      <strong>Copy Connection String:</strong> Go to <strong>Clusters / Database</strong> &gt; Click <strong>&quot;Connect&quot;</strong> &gt; Choose <strong>&quot;Drivers&quot; (Node.js)</strong> &gt; Copy your connection string.
                    </div>
                  </div>
                </div>

                {/* Connection String Template */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-charcoal">Paste into your <code>.env.local</code> file:</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          "MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/nithu_fashion_world?retryWrites=true&w=majority"
                        );
                        setCopiedEnv(true);
                        showToast("Connection string template copied! 📋");
                        setTimeout(() => setCopiedEnv(false), 2500);
                      }}
                      className="text-[11px] text-burgundy font-semibold flex items-center gap-1 hover:underline"
                    >
                      {copiedEnv ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedEnv ? "Copied!" : "Copy Template"}</span>
                    </button>
                  </div>
                  <pre className="bg-charcoal text-cream-ivory p-3 rounded-xl text-[11px] overflow-x-auto font-mono">
                    MONGODB_URI=mongodb+srv://&lt;username&gt;:&lt;password&gt;@cluster0.xxxxx.mongodb.net/nithu_fashion_world?retryWrites=true&amp;w=majority
                  </pre>
                  <p className="text-[11px] text-charcoal-muted">
                    Replace <code>&lt;username&gt;</code> and <code>&lt;password&gt;</code> with your database credentials. Restart <code>npm run dev</code> after editing <code>.env.local</code>.
                  </p>
                </div>
              </div>

              {/* Modal Bottom Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-cream-warm">
                <a
                  href="https://cloud.mongodb.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-5 py-2.5 bg-burgundy hover:bg-burgundy-deep text-cream text-xs font-semibold rounded-full flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <span>Open MongoDB Atlas Console</span>
                  <ExternalLink className="w-3.5 h-3.5 text-gold-light" />
                </a>

                <button
                  onClick={handleSeed}
                  disabled={isSeeding}
                  className="w-full sm:w-auto px-5 py-2.5 bg-gold hover:bg-gold-light text-burgundy-deep text-xs font-semibold rounded-full shadow-gold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isSeeding ? "Seeding Catalog..." : "Seed Catalog to Atlas"}</span>
                </button>

                <button
                  onClick={() => setIsAtlasModalOpen(false)}
                  className="w-full sm:w-auto sm:ml-auto px-4 py-2.5 border border-blush hover:bg-cream-soft text-charcoal-muted text-xs font-semibold rounded-full transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
