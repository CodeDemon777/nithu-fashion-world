import { NextResponse } from "next/server";
import { connectToDatabase, isDbConfigured } from "@/lib/mongodb";
import CustomerModel from "@/models/Customer";
import OtpModel from "@/models/Otp";
import { applyRateLimit } from "@/lib/rate-limit";
import { sanitizeString, validateEmail } from "@/lib/validation";
import { hashPassword } from "@/lib/auth-security";
import { verifyOtpFromMemory } from "@/lib/sms";

// POST /api/auth/otp/verify - Verify OTP and complete customer registration
export async function POST(req: Request) {
  // 1. Rate Limiting Check
  const rateLimitResponse = applyRateLimit(req, "AUTH");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await req.json();
    const rawPhone = body?.phone || "";
    const cleanPhone = String(rawPhone).replace(/[^0-9]/g, "");
    const code = String(body?.code || "").trim();

    // 2. Validate inputs
    if (!cleanPhone || cleanPhone.length < 10) {
      return NextResponse.json(
        { success: false, error: "Valid 10-digit phone number is required." },
        { status: 400 }
      );
    }

    if (!code || code.length !== 6) {
      return NextResponse.json(
        { success: false, error: "Please enter the complete 6-digit verification code." },
        { status: 400 }
      );
    }

    let isVerified = false;
    let verificationError = "";

    // 3. Verify against MongoDB Atlas
    if (isDbConfigured()) {
      try {
        await connectToDatabase();
        const otpRecord = await OtpModel.findOne({ phone: cleanPhone });

        if (otpRecord) {
          if (new Date() > otpRecord.expiresAt) {
            await OtpModel.deleteOne({ _id: otpRecord._id });
            verificationError = "Verification code has expired. Please request a new code.";
          } else if (otpRecord.attempts >= 5) {
            await OtpModel.deleteOne({ _id: otpRecord._id });
            verificationError = "Too many failed attempts. Please request a new verification code.";
          } else if (otpRecord.code !== code) {
            otpRecord.attempts += 1;
            await otpRecord.save();
            verificationError = "Incorrect verification code. Please check and try again.";
          } else {
            // Valid code
            isVerified = true;
            await OtpModel.deleteOne({ _id: otpRecord._id });
          }
        }
      } catch (dbErr) {
        console.warn("MongoDB OTP query fallback to memory verification:", dbErr);
      }
    }

    // Check memory fallback if not yet verified
    if (!isVerified && !verificationError) {
      const memoryCheck = verifyOtpFromMemory(cleanPhone, code);
      if (memoryCheck.isValid) {
        isVerified = true;
      } else {
        verificationError = memoryCheck.error || "Invalid or expired verification code.";
      }
    }

    if (!isVerified) {
      return NextResponse.json(
        { success: false, error: verificationError || "Verification code is invalid or has expired." },
        { status: 400 }
      );
    }

    // 4. Registration payload sanitization
    const name = sanitizeString(body?.name, 80) || "Customer";
    const email = body?.email ? sanitizeString(body.email, 120).toLowerCase() : "";
    const password = body?.password ? String(body.password).substring(0, 100) : "user123";
    const address = sanitizeString(body?.address, 250) || "Komarapalayam, Tamil Nadu";
    const city = sanitizeString(body?.city, 80) || "Komarapalayam";
    const pincode = sanitizeString(body?.pincode, 15) || "638183";

    if (email) {
      const emailResult = validateEmail(email);
      if (!emailResult.isValid) {
        return NextResponse.json(
          { success: false, error: emailResult.error || "Valid email is required." },
          { status: 400 }
        );
      }
    }

    // 5. Save or update customer with phoneVerified: true
    if (isDbConfigured()) {
      await connectToDatabase();
      const existing = email ? await CustomerModel.findOne({ email }) : null;

      if (existing) {
        // Upgrade existing customer to phoneVerified
        existing.phone = cleanPhone;
        existing.phoneVerified = true;
        existing.phoneVerifiedAt = new Date();
        if (name && name !== "Customer") existing.name = name;
        await existing.save();

        const safe = {
          ...existing.toObject(),
          id: existing._id.toString(),
        };
        delete (safe as any).password;

        return NextResponse.json({
          success: true,
          verified: true,
          message: "Mobile phone verified successfully!",
          customer: safe,
        });
      }

      // Create new customer account with phoneVerified: true
      const hashedPassword = hashPassword(password);
      const newCustomer = await CustomerModel.create({
        name,
        email: email || `user_${cleanPhone}@nithufashion.com`,
        phone: cleanPhone,
        phoneVerified: true,
        phoneVerifiedAt: new Date(),
        password: hashedPassword,
        role: "customer",
        address,
        city,
        pincode,
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
        joinedDate: new Date().toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        totalOrders: 0,
        totalSpent: 0,
      });

      const safe = {
        ...newCustomer.toObject(),
        id: newCustomer._id.toString(),
      };
      delete (safe as any).password;

      return NextResponse.json({
        success: true,
        verified: true,
        message: "Mobile phone verified & customer account created in MongoDB Atlas!",
        customer: safe,
      });
    }

    // Local fallback when DB not configured
    const fallbackCustomer = {
      id: "usr-" + Date.now(),
      name,
      email: email || `user_${cleanPhone}@example.com`,
      phone: cleanPhone,
      phoneVerified: true,
      phoneVerifiedAt: new Date().toISOString(),
      role: "customer",
      address,
      city,
      pincode,
      joinedDate: "Just now",
      totalOrders: 0,
      totalSpent: 0,
    };

    return NextResponse.json({
      success: true,
      verified: true,
      source: "local-fallback",
      message: "Mobile phone verified successfully!",
      customer: fallbackCustomer,
    });
  } catch (error: any) {
    console.error("POST /api/auth/otp/verify error:", error);
    return NextResponse.json(
      { success: false, error: "Verification failed. Please try again." },
      { status: 500 }
    );
  }
}
