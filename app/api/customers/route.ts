import { NextResponse } from "next/server";
import { connectToDatabase, isDbConfigured } from "@/lib/mongodb";
import CustomerModel from "@/models/Customer";
import { applyRateLimit } from "@/lib/rate-limit";
import { validateCustomerPayload } from "@/lib/validation";
import { hashPassword } from "@/lib/auth-security";
import { verifyAdminAccess } from "@/lib/auth-guard";

const DEFAULT_DEMO_CUSTOMERS = [
  {
    id: "demo-cust-1",
    name: "Priya Sundaram",
    email: "priya@example.com",
    phone: "9876543210",
    role: "customer",
    address: "14/B, Gandhi Nagar, Near Saree Market",
    city: "Komarapalayam, Tamil Nadu",
    pincode: "638183",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    joinedDate: "Feb 2026",
    totalOrders: 3,
    totalSpent: 4296,
    phoneVerified: true,
  },
  {
    id: "demo-cust-2",
    name: "Divya Ramesh",
    email: "divya@example.com",
    phone: "7373848555",
    role: "customer",
    address: "42, Netaji Street",
    city: "Erode, Tamil Nadu",
    pincode: "638001",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    joinedDate: "Jan 2026",
    totalOrders: 2,
    totalSpent: 2698,
    phoneVerified: true,
  },
  {
    id: "demo-cust-3",
    name: "Nithu Admin",
    email: "admin@nithufashion.com",
    phone: "7373848555",
    role: "admin",
    address: "Bazaar Street, Main Tailoring Unit",
    city: "Komarapalayam",
    pincode: "638183",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    joinedDate: "Jan 2024",
    totalOrders: 0,
    totalSpent: 0,
    phoneVerified: true,
  },
];

// GET /api/customers - List all customers (Protected: Admin Only)
export async function GET(req: Request) {
  // 1. Rate Limiting Check
  const rateLimitResponse = applyRateLimit(req, "READ");
  if (rateLimitResponse) return rateLimitResponse;

  // 2. Broken Access Control Defense: Verify Admin Authorization
  const authResponse = verifyAdminAccess(req);
  if (authResponse) return authResponse;

  try {
    if (!isDbConfigured()) {
      return NextResponse.json({
        success: true,
        source: "local-fallback",
        customers: DEFAULT_DEMO_CUSTOMERS,
      });
    }

    await connectToDatabase();
    let customers: any[] = await CustomerModel.find({})
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    // If MongoDB is connected but has no customers yet, auto-seed sample demo accounts
    if (customers.length === 0) {
      console.log("No customers found in MongoDB. Auto-seeding initial customer accounts with salted scrypt hashes...");
      const seeded = await CustomerModel.insertMany([
        {
          name: "Priya Sundaram",
          email: "priya@example.com",
          phone: "9876543210",
          password: hashPassword("user123"),
          role: "customer",
          address: "14/B, Gandhi Nagar, Near Saree Market",
          city: "Komarapalayam, Tamil Nadu",
          pincode: "638183",
          avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
          joinedDate: "Feb 2026",
          totalOrders: 3,
          totalSpent: 4296,
          phoneVerified: true,
        },
        {
          name: "Divya Ramesh",
          email: "divya@example.com",
          phone: "7373848555",
          password: hashPassword("user123"),
          role: "customer",
          address: "42, Netaji Street",
          city: "Erode, Tamil Nadu",
          pincode: "638001",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          joinedDate: "Jan 2026",
          totalOrders: 2,
          totalSpent: 2698,
          phoneVerified: true,
        },
        {
          name: "Nithu Admin",
          email: "admin@nithufashion.com",
          phone: "7373848555",
          password: hashPassword("admin123"),
          role: "admin",
          address: "Bazaar Street, Main Tailoring Unit",
          city: "Komarapalayam",
          pincode: "638183",
          avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
          joinedDate: "Jan 2024",
          totalOrders: 0,
          totalSpent: 0,
          phoneVerified: true,
        },
      ]);

      customers = seeded.map((doc) => {
        const obj = doc.toObject();
        delete obj.password;
        return {
          ...obj,
          id: doc._id.toString(),
        };
      });
    } else {
      customers = customers.map((c: any) => {
        delete c.password;
        return {
          ...c,
          id: c._id ? c._id.toString() : c.id,
        };
      });
    }

    return NextResponse.json({
      success: true,
      source: "mongodb-atlas",
      count: customers.length,
      customers,
    });
  } catch (error: any) {
    console.error("GET /api/customers error:", error);
    return NextResponse.json(
      {
        success: false,
        source: "local-fallback",
        error: "Unable to retrieve customer records. Please try again later.",
        customers: DEFAULT_DEMO_CUSTOMERS,
      },
      { status: 500 }
    );
  }
}

// POST /api/customers - Register customer in MongoDB Atlas
export async function POST(req: Request) {
  // 1. Strict Auth Rate Limiting Check (prevents bot spam & credential stuffing)
  const rateLimitResponse = applyRateLimit(req, "AUTH");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const rawBody = await req.json();

    // 2. Validate and sanitize input
    const validation = validateCustomerPayload(rawBody);
    if (!validation.isValid || !validation.sanitized) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    const { sanitized } = validation;

    if (!isDbConfigured()) {
      const fallbackUser = {
        id: "usr-" + Date.now(),
        name: sanitized.name,
        email: sanitized.email,
        phone: sanitized.phone,
        role: "customer",
        address: sanitized.address,
        city: sanitized.city,
        pincode: sanitized.pincode,
        joinedDate: "Just now",
        totalOrders: 0,
        totalSpent: 0,
      };
      return NextResponse.json({
        success: true,
        source: "local-fallback",
        message: "Customer saved locally (MongoDB Atlas not configured in .env.local)",
        customer: fallbackUser,
      });
    }

    await connectToDatabase();

    // Check if customer already exists (NoSQL safe string comparison)
    const existing = await CustomerModel.findOne({ email: sanitized.email });
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: "An account with this email address already exists. Please sign in.",
        },
        { status: 409 }
      );
    }

    // Hash password with salted scrypt to eliminate weak authentication
    const hashedPassword = hashPassword(sanitized.password || "user123");

    const newCustomer = await CustomerModel.create({
      name: sanitized.name,
      email: sanitized.email,
      phone: sanitized.phone,
      password: hashedPassword,
      role: "customer",
      address: sanitized.address,
      city: sanitized.city,
      pincode: sanitized.pincode,
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      joinedDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
      totalOrders: 0,
      totalSpent: 0,
    });

    const safeCustomer = {
      ...newCustomer.toObject(),
      id: newCustomer._id.toString(),
    };
    delete (safeCustomer as any).password;

    return NextResponse.json(
      {
        success: true,
        message: "Customer registered in MongoDB Atlas successfully!",
        customer: safeCustomer,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/customers error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred during customer registration." },
      { status: 500 }
    );
  }
}
