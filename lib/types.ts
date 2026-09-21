export interface Product {
  id: string;
  name: string;
  slug: string;
  category: "sarees" | "blouses" | "dresses" | "kids" | "crafts" | "gifts" | "festive";
  categoryLabel: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  features?: string[];
  isCustomizable?: boolean;
  inStock: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  itemCount: string;
}

export interface ServiceItem {
  id: string;
  stepNumber: string;
  title: string;
  subtitle: string;
  iconName: string;
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  comment: string;
  serviceUsed: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  role: "customer" | "admin";
  avatar?: string;
  joinedDate: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  items: OrderItem[];
  totalAmount: number;
  status: "Processing" | "In Tailoring" | "Dispatched" | "Delivered" | "Cancelled";
  paymentMethod: "UPI" | "Card" | "NetBanking" | "COD";
  paymentStatus: "Paid" | "Pending";
  createdAt: string;
  estimatedDelivery?: string;
}

export interface TailoringInquiry {
  id: string;
  fullName: string;
  phone: string;
  city: string;
  serviceType: string;
  notes?: string;
  status: "New Inquiry" | "Measurement Done" | "In Crafting" | "Completed";
  createdAt: string;
}
