import { NextResponse } from "next/server";
import { connectToDatabase, isDbConfigured } from "@/lib/mongodb";
import CustomerModel from "@/models/Customer";
import { applyRateLimit } from "@/lib/rate-limit";
import { validateEmail, sanitizeString } from "@/lib/validation";
import { hashPassword, verifyPassword } from "@/lib/auth-security";

// POST /api/customers/login - Login customer with MongoDB Atlas
export async function POST(req: Request) {
  // 1. Strict Rate Limiting Check (max 10 login attempts per minute per IP to prevent brute force)
  const rateLimitResponse = applyRateLimit(req, "AUTH");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await req.json();

    // 2. Validate inputs
    const emailResult = validateEmail(body?.email);
    if (!emailResult.isValid || !emailResult.value) {
      return NextResponse.json(
        { success: false, error: emailResult.error || "Valid email is required" },
        { status: 400 }
      );
    }

    const cleanEmail = emailResult.value;
    const cleanPassword = sanitizeString(body?.password, 100);

    if (!cleanPassword) {
      return NextResponse.json(
        { success: false, error: "Password is required" },
        { status: 400 }
      );
    }

    if (!isDbConfigured()) {
      // Local fallback for customer login
      const fallbackUser = {
        id: "usr-cust-" + Date.now(),
        name: cleanEmail.split("@")[0].toUpperCase(),
        email: cleanEmail,
        role: "customer",
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

    // Select password field explicitly since select: false is on schema
    const customer = await CustomerModel.findOne({ email: cleanEmail }).select("+password");

    if (!customer) {
      // Auto-create customer if logging in first time with salted scrypt hash
      const hashedPassword = hashPassword(cleanPassword);

      const created = await CustomerModel.create({
        name: cleanEmail.split("@")[0].toUpperCase(),
        email: cleanEmail,
        password: hashedPassword,
        role: "customer",
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

    // Verify password using timing-safe salted scrypt verification
    if (customer.password) {
      const verification = verifyPassword(cleanPassword, customer.password);
      if (!verification.isValid) {
        return NextResponse.json(
          { success: false, error: "Incorrect password. Please try again." },
          { status: 401 }
        );
      }

      // Seamless security upgrade: If user had legacy plain text, rehash to salted scrypt
      if (verification.needsRehash) {
        customer.password = hashPassword(cleanPassword);
        await customer.save().catch((e) => console.warn("Could not upgrade password hash:", e));
      }
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
      { success: false, error: "Authentication service unavailable. Please try again." },
      { status: 500 }
    );
  }
}
