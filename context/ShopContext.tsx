"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, CartItem, Order, TailoringInquiry } from "@/lib/types";
import { PRODUCTS as INITIAL_PRODUCTS } from "@/lib/data";
import confetti from "canvas-confetti";

interface ShopContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  cart: CartItem[];
  wishlist: string[]; // product IDs
  addToCart: (product: Product, quantity?: number, selectedSize?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;

  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;

  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (open: boolean) => void;
  bookingPreselectService: string;
  setBookingPreselectService: (service: string) => void;

  activeCategoryFilter: string;
  setActiveCategoryFilter: (category: string) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  orders: Order[];
  createOrder: (order: Omit<Order, "id" | "orderNumber" | "createdAt">) => Order;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;

  tailoringInquiries: TailoringInquiry[];
  addTailoringInquiry: (inquiry: Omit<TailoringInquiry, "id" | "createdAt" | "status">) => void;
  updateInquiryStatus: (inquiryId: string, status: TailoringInquiry["status"]) => void;

  toastMessage: string | null;
  showToast: (message: string) => void;
  triggerConfetti: () => void;
}

const INITIAL_ORDERS: Order[] = [
  {
    id: "ord-101",
    orderNumber: "NFW-2026-9812",
    customerName: "Priya Sundaram",
    customerEmail: "priya@example.com",
    customerPhone: "9876543210",
    deliveryAddress: "14/B, Gandhi Nagar, Komarapalayam, Tamil Nadu - 638183",
    items: [
      {
        productId: "prod-1",
        name: "Elegant Kanchipuram Saree",
        image: "/images/products/saree-01.jpg",
        price: 1299,
        quantity: 1,
        size: "Standard / Free Size",
      },
      {
        productId: "prod-2",
        name: "Designer Blouse (Custom)",
        image: "/images/products/blouse-01.jpg",
        price: 899,
        quantity: 1,
        size: "Custom Fitting (Tailored)",
      },
    ],
    totalAmount: 2198,
    status: "In Tailoring",
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    createdAt: "2026-09-18",
    estimatedDelivery: "2026-09-24",
  },
  {
    id: "ord-102",
    orderNumber: "NFW-2026-9784",
    customerName: "Divya Ramesh",
    customerEmail: "divya@example.com",
    customerPhone: "9585477733",
    deliveryAddress: "42, Netaji Street, Erode, Tamil Nadu",
    items: [
      {
        productId: "prod-3",
        name: "Kids Party Wear Dress",
        image: "/images/products/kids-01.jpg",
        price: 799,
        quantity: 2,
        size: "Age 3-4 Years",
      },
    ],
    totalAmount: 1598,
    status: "Dispatched",
    paymentMethod: "Card",
    paymentStatus: "Paid",
    createdAt: "2026-09-15",
    estimatedDelivery: "2026-09-22",
  },
];

const INITIAL_INQUIRIES: TailoringInquiry[] = [
  {
    id: "inq-1",
    fullName: "Priya Sundaram",
    phone: "9876543210",
    city: "Komarapalayam",
    serviceType: "Custom Bridal Blouse & Aari Work",
    notes: "Heavy peacock zardozi neckline for wedding reception blouse on dark maroon silk.",
    status: "In Crafting",
    createdAt: "2026-09-19",
  },
  {
    id: "inq-2",
    fullName: "Kavitha S.",
    phone: "9443218765",
    city: "Salem",
    serviceType: "Tailoring for Kids & Women",
    notes: "Mother & daughter matching pastel peach ethnic lehengas for family function.",
    status: "Measurement Done",
    createdAt: "2026-09-20",
  },
  {
    id: "inq-3",
    fullName: "Ananya Mohan",
    phone: "9123456780",
    city: "Erode",
    serviceType: "Custom Arts & Crafts / Return Gifts",
    notes: "50 pieces of personalized terracotta painted diyas with organza pouch packing.",
    status: "New Inquiry",
    createdAt: "2026-09-21",
  },
];

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [tailoringInquiries, setTailoringInquiries] = useState<TailoringInquiry[]>(INITIAL_INQUIRIES);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingPreselectService, setBookingPreselectService] = useState("");
  const [activeCategoryFilter, setActiveCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("nithu_cart");
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem("nithu_wishlist");
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedOrders = localStorage.getItem("nithu_orders");
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedInquiries = localStorage.getItem("nithu_inquiries");
      if (savedInquiries) setTailoringInquiries(JSON.parse(savedInquiries));

      const savedProducts = localStorage.getItem("nithu_custom_products");
      if (savedProducts) setProducts(JSON.parse(savedProducts));
    } catch (e) {
      console.error("Failed to parse storage:", e);
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem("nithu_cart", JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem("nithu_wishlist", JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem("nithu_orders", JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem("nithu_inquiries", JSON.stringify(tailoringInquiries));
    } catch (e) {
      console.error(e);
    }
  }, [tailoringInquiries]);

  useEffect(() => {
    try {
      localStorage.setItem("nithu_custom_products", JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#57000D", "#C89B5A", "#F3D7CE", "#E5C78C"],
      });
    } catch (e) {
      // ignore
    }
  };

  const addProduct = (p: Product) => {
    setProducts((prev) => [p, ...prev]);
    showToast(`Product "${p.name}" added to catalog!`);
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );
    showToast("Product catalog updated successfully!");
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast("Product deleted from catalog");
  };

  const addToCart = (product: Product, quantity = 1, selectedSize?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity, selectedSize: selectedSize || "Standard" }];
    });
    showToast(`Added "${product.name}" to cart! 🛍️`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast("Item removed from cart");
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        showToast("Removed from Wishlist ♡");
        return prev.filter((id) => id !== productId);
      } else {
        showToast("Saved to Wishlist ♥");
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);
  const wishlistCount = wishlist.length;

  const createOrder = (orderData: Omit<Order, "id" | "orderNumber" | "createdAt">): Order => {
    const newOrder: Order = {
      ...orderData,
      id: "ord-" + Date.now(),
      orderNumber: "NFW-2026-" + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toISOString().split("T")[0],
      estimatedDelivery: "Within 4-6 Days",
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    showToast(`Order status updated to: ${status}`);
  };

  const addTailoringInquiry = (inquiryData: Omit<TailoringInquiry, "id" | "createdAt" | "status">) => {
    const newInquiry: TailoringInquiry = {
      ...inquiryData,
      id: "inq-" + Date.now(),
      status: "New Inquiry",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setTailoringInquiries((prev) => [newInquiry, ...prev]);
  };

  const updateInquiryStatus = (inquiryId: string, status: TailoringInquiry["status"]) => {
    setTailoringInquiries((prev) =>
      prev.map((i) => (i.id === inquiryId ? { ...i, status } : i))
    );
    showToast(`Inquiry status updated to: ${status}`);
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        toggleWishlist,
        isInWishlist,
        wishlistCount,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        quickViewProduct,
        setQuickViewProduct,
        isBookingModalOpen,
        setIsBookingModalOpen,
        bookingPreselectService,
        setBookingPreselectService,
        activeCategoryFilter,
        setActiveCategoryFilter,
        searchQuery,
        setSearchQuery,
        orders,
        createOrder,
        updateOrderStatus,
        tailoringInquiries,
        addTailoringInquiry,
        updateInquiryStatus,
        toastMessage,
        showToast,
        triggerConfetti,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
};
