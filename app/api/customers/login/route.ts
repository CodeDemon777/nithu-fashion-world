import { NextResponse } from "next/server";
import { connectToDatabase, isDbConfigured } from "@/lib/mongodb";
import CustomerModel from "@/models/Customer";

// POST /api/customers/login - Login customer with MongoDB Atlas
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    if (!isDbConfigured()) {
      // Local fallback for quick demo login
      const isDemoAdmin = cleanEmail.includes("admin");
      const fallbackUser = {
        id: isDemoAdmin ? "usr-admin" : "usr-cust-" + Date.now(),
        name: isDemoAdmin ? "Nithu Admin" : cleanEmail.split("@")[0].toUpperCase(),
        email: cleanEmail,
        role: isDemoAdmin ? "admin" : "customer",
        city: "Komarapalayam, Tamil Nadu",
        joinedDate: "Feb 2026",
      };
      return NextResponse.json({
        success: true,
        source: "local-fallback",
        customer: fallbackUser,
      });
    }

    await connectToDatabase();

    const customer = await CustomerModel.findOne({ email: cleanEmail });

    if (!customer) {
      // Auto-create customer if logging in first time
      const isDemoAdmin = cleanEmail.includes("admin");
      const created = await CustomerModel.create({
        name: cleanEmail.split("@")[0].toUpperCase(),
        email: cleanEmail,
        password: password,
        role: isDemoAdmin ? "admin" : "customer",
        city: "Tamil Nadu",
        joinedDate: new Date().toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
      });

      const safe = {
        ...created.toObject(),
        id: created._id.toString(),
      };
      delete (safe as any).password;

      return NextResponse.json({
        success: true,
        message: "Logged in and customer registered in MongoDB Atlas",
        customer: safe,
      });
    }

    // Verify password if set
    if (customer.password && customer.password !== password) {
      return NextResponse.json(
        { success: false, error: "Incorrect password. Please try again." },
        { status: 401 }
      );
    }

    const safe = {
      ...customer.toObject(),
      id: customer._id.toString(),
    };
    delete (safe as any).password;

    return NextResponse.json({
      success: true,
      message: "Logged in successfully with MongoDB Atlas",
      customer: safe,
    });
  } catch (error: any) {
    console.error("POST /api/customers/login error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Login failed" },
      { status: 500 }
    );
  }
}
