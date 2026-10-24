import { NextResponse } from "next/server";
import { connectToDatabase, isDbConfigured } from "@/lib/mongodb";
import CustomerModel from "@/models/Customer";

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
  },
];

// GET /api/customers - List all customers from MongoDB Atlas
export async function GET() {
  try {
    if (!isDbConfigured()) {
      return NextResponse.json({
        success: true,
        source: "local-fallback",
        customers: DEFAULT_DEMO_CUSTOMERS,
      });
    }

    await connectToDatabase();
    let customers: any[] = await CustomerModel.find({}).sort({ createdAt: -1 }).lean();

    // If MongoDB is connected but has no customers yet, auto-seed sample demo accounts
    if (customers.length === 0) {
      console.log("No customers found in MongoDB. Auto-seeding initial customer accounts...");
      const seeded = await CustomerModel.insertMany([
        {
          name: "Priya Sundaram",
          email: "priya@example.com",
          phone: "9876543210",
          password: "user123",
          role: "customer",
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
          role: "customer",
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
          role: "admin",
          address: "Bazaar Street, Main Tailoring Unit",
          city: "Komarapalayam",
          pincode: "638183",
          avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
          joinedDate: "Jan 2024",
          totalOrders: 0,
          totalSpent: 0,
        },
      ]);

      customers = seeded.map((doc) => ({
        ...doc.toObject(),
        id: doc._id.toString(),
      }));
    } else {
      customers = customers.map((c: any) => ({
        ...c,
        id: c._id ? c._id.toString() : c.id,
      }));
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
        error: error.message || "Failed to fetch customers",
        customers: DEFAULT_DEMO_CUSTOMERS,
      },
      { status: 200 }
    );
  }
}

// POST /api/customers - Register or create customer in MongoDB Atlas
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.email || !body.name) {
      return NextResponse.json(
        { success: false, error: "Name and email are required" },
        { status: 400 }
      );
    }

    const email = body.email.toLowerCase().trim();

    if (!isDbConfigured()) {
      // Return successful local fallback response
      const fallbackUser = {
        id: "usr-" + Date.now(),
        name: body.name.trim(),
        email,
        phone: body.phone || "",
        role: email.includes("admin") ? "admin" : "customer",
        address: body.address || "",
        city: body.city || "Tamil Nadu",
        pincode: body.pincode || "",
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

    // Check if customer already exists
    const existing = await CustomerModel.findOne({ email });
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: "An account with this email address already exists. Please sign in.",
        },
        { status: 409 }
      );
    }

    const newCustomer = await CustomerModel.create({
      name: body.name.trim(),
      email,
      phone: body.phone || "",
      password: body.password || "user123",
      role: email.includes("admin") ? "admin" : "customer",
      address: body.address || "",
      city: body.city || "Tamil Nadu",
      pincode: body.pincode || "",
      avatar:
        body.avatar ||
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
      { success: false, error: error.message || "Failed to register customer" },
      { status: 500 }
    );
  }
}
