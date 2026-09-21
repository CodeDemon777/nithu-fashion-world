"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function AdminPortalPage() {
  const { user, loginAsDemoAdmin, setIsAuthModalOpen } = useAuth();
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
  } = useShop();

  const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders" | "tailoring">("overview");

  // New Product Modal State
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProdName, setNewProdName] = useState("");
  const [newProdCategory, setNewProdCategory] = useState<Product["category"]>("sarees");
  const [newProdPrice, setNewProdPrice] = useState<number>(1299);
  const [newProdOldPrice, setNewProdOldPrice] = useState<number>(1899);
  const [newProdDiscount, setNewProdDiscount] = useState<number>(20);
  const [newProdDesc, setNewProdDesc] = useState("");
  const [newProdImage, setNewProdImage] = useState("/images/categories/sarees.jpg");

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName) {
      showToast("Please enter a product title");
      return;
    }

    const newProd: Product = {
      id: "prod-" + Date.now(),
      name: newProdName,
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
      description: newProdDesc || "Exquisite luxury artisanal craft piece from Nithu Fashion World.",
      inStock: true,
      isCustomizable: true,
    };

    addProduct(newProd);
    setIsAddProductOpen(false);
    // Reset
    setNewProdName("");
    setNewProdDesc("");
  };

  // If user is not admin, provide admin login barrier with demo shortcut
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 bg-[#FFF7F0]">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-blush shadow-card text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-burgundy/10 flex items-center justify-center mx-auto text-burgundy">
            <ShieldCheck className="w-8 h-8 text-gold-dark" />
          </div>
          <div>
            <h1
              className="text-2xl sm:text-3xl font-serif text-charcoal font-bold"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Admin Portal
            </h1>
            <p className="text-xs text-charcoal-muted mt-1">
              Store management console is restricted to NITHU FASHION WORLD administrators.
            </p>
          </div>
          <div className="space-y-3 pt-2">
            <button
              onClick={() => {
                loginAsDemoAdmin();
                showToast("Authenticated as Store Admin 👑");
              }}
              className="w-full py-3 bg-burgundy hover:bg-burgundy-deep text-cream text-xs font-semibold uppercase tracking-wider rounded-full shadow-md transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-gold-light" />
              <span>Login as Admin (1-Click Demo)</span>
            </button>
            <Link
              href="/"
              className="block w-full py-2.5 bg-cream-soft hover:bg-blush-light text-burgundy border border-blush text-xs font-semibold rounded-full transition-all"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0) + 142000;

  return (
    <div className="min-h-screen bg-[#FFF7F0] py-10 sm:py-14">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        
        {/* Top Header */}
        <div className="bg-[#3D0008] text-cream-ivory rounded-3xl p-6 sm:p-8 shadow-luxury mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-2 border-gold/40">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gold/20 border border-gold/40 flex items-center justify-center text-gold">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider bg-gold text-burgundy-deep font-bold px-2 py-0.5 rounded-full">
                  Admin Console
                </span>
                <span className="text-xs text-gold-light">NITHU FASHION WORLD</span>
              </div>
              <h1
                className="text-2xl sm:text-3xl font-serif text-cream font-bold mt-1"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Store Administration & Craft Center
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="px-4 py-2 bg-burgundy-rich hover:bg-burgundy text-cream text-xs font-semibold rounded-full border border-gold/30 flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-gold-light" />
              <span>View Live Store</span>
            </Link>
            <Link
              href="/account"
              className="px-4 py-2 bg-gold hover:bg-gold-light text-burgundy-deep text-xs font-semibold rounded-full shadow-gold transition-colors"
            >
              Switch to Customer View
            </Link>
          </div>
        </div>

        {/* 4 Stats KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-blush shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-semibold text-charcoal-muted">
                Gross Revenue
              </span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-serif font-bold text-burgundy mt-1">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">
              +18.4% this month
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-blush shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-semibold text-charcoal-muted">
                Active Orders
              </span>
              <ShoppingBag className="w-4 h-4 text-burgundy" />
            </div>
            <div className="text-2xl font-serif font-bold text-burgundy mt-1">
              {orders.length}
            </div>
            <span className="text-[10px] text-burgundy font-semibold">
              In production & delivery
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-blush shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-semibold text-charcoal-muted">
                Tailoring Leads
              </span>
              <Scissors className="w-4 h-4 text-gold-dark" />
            </div>
            <div className="text-2xl font-serif font-bold text-burgundy mt-1">
              {tailoringInquiries.length}
            </div>
            <span className="text-[10px] text-gold-dark font-semibold">
              Aari & bridal inquiries
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-blush shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-semibold text-charcoal-muted">
                Catalog Items
              </span>
              <Package className="w-4 h-4 text-burgundy" />
            </div>
            <div className="text-2xl font-serif font-bold text-burgundy mt-1">
              {products.length}
            </div>
            <span className="text-[10px] text-charcoal-muted">
              Live in homepage catalog
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-blush mb-8 gap-2 sm:gap-6 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "overview"
                ? "border-burgundy text-burgundy font-serif text-base"
                : "border-transparent text-charcoal-muted hover:text-charcoal"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Dashboard Overview</span>
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
            <span>Tailoring & Aari Inquiries ({tailoringInquiries.length})</span>
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Recent Orders Table */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-blush shadow-card space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-cream-warm">
                <h3
                  className="text-lg font-serif font-bold text-charcoal"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  Recent Customer Orders
                </h3>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="text-xs font-semibold text-burgundy hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="divide-y divide-cream-warm">
                {orders.map((o) => (
                  <div key={o.id} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-bold text-charcoal">
                        {o.orderNumber} • {o.customerName}
                      </div>
                      <div className="text-[11px] text-charcoal-muted">
                        {o.items.length} items • ₹{o.totalAmount.toLocaleString("en-IN")} • {o.paymentMethod}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
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
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 1 Col: Quick Stitching Inquiries */}
            <div className="bg-white rounded-3xl p-6 border border-blush shadow-card space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-cream-warm">
                <h3
                  className="text-lg font-serif font-bold text-charcoal"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  Latest Tailoring Inquiries
                </h3>
                <button
                  onClick={() => setActiveTab("tailoring")}
                  className="text-xs font-semibold text-burgundy hover:underline"
                >
                  View All
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
                        href={`https://wa.me/91${inq.phone}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 hover:underline"
                      >
                        <MessageCircle className="w-3 h-3" />
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
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blush shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-cream-warm gap-4">
              <div>
                <h2
                  className="text-2xl font-serif font-bold text-charcoal"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  Catalog Products ({products.length})
                </h2>
                <p className="text-xs text-charcoal-muted">
                  Add, edit pricing, or toggle stock for sarees, blouses, kurtis, and crafts.
                </p>
              </div>

              <button
                onClick={() => setIsAddProductOpen(true)}
                className="px-5 py-2.5 bg-burgundy hover:bg-burgundy-deep text-cream text-xs font-semibold rounded-full shadow-md flex items-center gap-2"
              >
                <Plus className="w-4 h-4 text-gold-light" />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
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
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-cream-soft/50">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-12 h-12 rounded-xl object-cover border border-blush"
                          />
                          <div>
                            <div className="font-serif font-semibold text-charcoal text-sm">
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
                          "-"
                        )}
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => updateProduct(prod.id, { inStock: !prod.inStock })}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors ${
                            prod.inStock
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {prod.inStock ? "In Stock ✓" : "Out of Stock ✗"}
                        </button>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => deleteProduct(prod.id)}
                          aria-label="Delete product"
                          className="p-1.5 rounded-lg text-charcoal-muted hover:text-red-600 hover:bg-red-50 transition-colors ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Orders Management */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blush shadow-card space-y-6">
            <h2
              className="text-2xl font-serif font-bold text-charcoal"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Customer Orders Management ({orders.length})
            </h2>

            <div className="space-y-4">
              {orders.map((o) => (
                <div key={o.id} className="p-5 rounded-2xl border border-blush bg-cream-soft/40 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-blush gap-2">
                    <div>
                      <span className="text-sm font-bold font-serif text-burgundy">{o.orderNumber}</span>
                      <span className="text-xs text-charcoal-muted ml-3">Customer: <strong>{o.customerName}</strong> ({o.customerPhone})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-charcoal-muted font-medium">Status:</span>
                      <select
                        value={o.status}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value as Order["status"])}
                        className="text-xs p-2 rounded-xl border border-burgundy bg-white font-semibold text-burgundy cursor-pointer outline-none"
                      >
                        <option value="Processing">Processing</option>
                        <option value="In Tailoring">In Tailoring</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
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
                        <span className="font-bold text-burgundy">₹{item.price * item.quantity}</span>
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
          </div>
        )}

        {/* Tab 4: Tailoring & Aari Leads */}
        {activeTab === "tailoring" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blush shadow-card space-y-6">
            <h2
              className="text-2xl font-serif font-bold text-charcoal"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Tailoring & Aari Embroidery Inquiries ({tailoringInquiries.length})
            </h2>

            <div className="space-y-4">
              {tailoringInquiries.map((inq) => (
                <div key={inq.id} className="p-5 rounded-2xl border border-blush bg-cream-soft/40 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-blush gap-2">
                    <div>
                      <h4 className="text-base font-serif font-bold text-charcoal">{inq.fullName}</h4>
                      <span className="text-xs text-burgundy font-medium">{inq.serviceType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={inq.status}
                        onChange={(e) => updateInquiryStatus(inq.id, e.target.value as TailoringInquiry["status"])}
                        className="text-xs p-2 rounded-xl border border-burgundy bg-white font-semibold text-burgundy cursor-pointer outline-none"
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
                    <div>City: <strong>{inq.city}</strong> | Received: {inq.createdAt}</div>
                    <a
                      href={`https://wa.me/91${inq.phone}?text=Hello%20${encodeURIComponent(inq.fullName)},%20this%20is%20Nithu%20Fashion%20World%20regarding%20your%20tailoring%20consultation`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Chat with Client on WhatsApp ({inq.phone})</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Product Modal */}
        {isAddProductOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
            <div
              onClick={() => setIsAddProductOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-blush z-10 space-y-4">
              <h3
                className="text-2xl font-serif text-charcoal font-bold"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Add Product to Catalog
              </h3>

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
                    className="w-full bg-cream-soft text-charcoal text-xs p-2.5 rounded-xl border border-blush outline-none"
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
                      className="w-full bg-cream-soft text-charcoal text-xs p-2.5 rounded-xl border border-blush outline-none"
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
                    className="flex-1 py-2.5 border border-blush text-xs font-semibold rounded-full"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-burgundy text-cream text-xs font-semibold rounded-full shadow-md"
                  >
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
