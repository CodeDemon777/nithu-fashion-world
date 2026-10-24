import { NextResponse } from "next/server";
import { connectToDatabase, isDbConfigured } from "@/lib/mongodb";
import ProductModel from "@/models/Product";
import CustomerModel from "@/models/Customer";
import { PRODUCTS as DEFAULT_PRODUCTS } from "@/lib/data";

const DEFAULT_CUSTOMERS = [
  {
    name: "Priya Sundaram",
    email: "priya@example.com",
    phone: "9876543210",
    password: "user123",
    role: "customer" as const,
    address: "14/B, Gandhi Nagar, Near Saree Market",
    city: "Komarapalayam, Tamil Nadu",
    pincode: "638183",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    joinedDate: "Feb 2026",
    totalOrders: 3,
    totalSpent: 4296,
  },
  {
    name: "Divya Ramesh",
    email: "divya@example.com",
    phone: "7373848555",
    password: "user123",
    role: "customer" as const,
    address: "42, Netaji Street",
    city: "Erode, Tamil Nadu",
    pincode: "638001",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    joinedDate: "Jan 2026",
    totalOrders: 2,
    totalSpent: 2698,
  },
  {
    name: "Nithu Admin",
    email: "admin@nithufashion.com",
    phone: "7373848555",
    password: "admin123",
    role: "admin" as const,
    address: "Bazaar Street, Main Tailoring Unit",
    city: "Komarapalayam",
    pincode: "638183",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    joinedDate: "Jan 2024",
    totalOrders: 0,
    totalSpent: 0,
  },
];

// POST /api/seed - Seed database with full product catalog & initial customers
export async function POST() {
  try {
    if (!isDbConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: "MongoDB Atlas is not configured yet. Please add MONGODB_URI in .env.local first.",
        },
        { status: 503 }
      );
    }

    await connectToDatabase();

    // 1. Seed Products
    await ProductModel.deleteMany({});
    const productDocs = DEFAULT_PRODUCTS.map((p) => ({
      name: p.name,
      slug: p.slug,
      category: p.category,
      categoryLabel: p.categoryLabel,
      price: p.price,
      oldPrice: p.oldPrice || 0,
      discount: p.discount || 0,
      rating: p.rating || 5.0,
      reviewsCount: p.reviewsCount || 1,
      image: p.image,
      description: p.description,
      features: p.features || [],
      isCustomizable: p.isCustomizable ?? true,
      inStock: p.inStock ?? true,
    }));
    const seededProducts = await ProductModel.insertMany(productDocs);

    // 2. Seed Customers (skip if already exist by email)
    let customersAdded = 0;
    for (const cust of DEFAULT_CUSTOMERS) {
      const exists = await CustomerModel.findOne({ email: cust.email });
      if (!exists) {
        await CustomerModel.create(cust);
        customersAdded++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Database successfully seeded in MongoDB Atlas! Added ${seededProducts.length} products and ${customersAdded} customer accounts.`,
      productsCount: seededProducts.length,
      customersAdded,
    });
  } catch (error: any) {
    console.error("POST /api/seed error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to seed database" },
      { status: 500 }
    );
  }
}
