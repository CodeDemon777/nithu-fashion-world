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
