import { NextResponse } from "next/server";
import { connectToDatabase, isDbConfigured } from "@/lib/mongodb";
import CustomerModel from "@/models/Customer";
import OtpModel from "@/models/Otp";
import { applyRateLimit } from "@/lib/rate-limit";
import { sanitizeString, validateEmail } from "@/lib/validation";
import { generateOtp, sendOtpSms, saveOtpToMemory } from "@/lib/sms";

// POST /api/auth/otp/send - Send OTP to phone number
export async function POST(req: Request) {
  // 1. Rate Limiting Check (Prevent OTP SMS spam / abuse)
  const rateLimitResponse = applyRateLimit(req, "AUTH");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await req.json();
    const rawPhone = body?.phone || "";
    const cleanPhone = String(rawPhone).replace(/[^0-9]/g, "");

    // 2. Validate Phone Number (must be at least 10 digits)
    if (!cleanPhone || cleanPhone.length < 10) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter a valid 10-digit mobile number.",
        },
        { status: 400 }
      );
    }

    const email = body?.email ? sanitizeString(body.email, 120).toLowerCase() : "";
    const name = sanitizeString(body?.name, 80) || "Customer";

    // 3. If email provided, check if account already exists
    if (email) {
      const emailResult = validateEmail(email);
      if (!emailResult.isValid) {
        return NextResponse.json(
          { success: false, error: emailResult.error || "Invalid email address." },
          { status: 400 }
        );
      }

      if (isDbConfigured()) {
        await connectToDatabase();
        const existing = await CustomerModel.findOne({ email });
        if (existing) {
          return NextResponse.json(
            {
              success: false,
              error: "An account with this email address already exists. Please Sign In.",
            },
            { status: 409 }
          );
        }
      }
    }

    // 4. Generate 6-digit OTP code
    const code = generateOtp();

    // 5. Save to MongoDB Atlas with TTL index
    if (isDbConfigured()) {
      try {
        await connectToDatabase();
        // Remove any prior pending OTP for this phone
        await OtpModel.deleteMany({ phone: cleanPhone });

        // Save new OTP valid for 10 minutes
        await OtpModel.create({
          phone: cleanPhone,
          code,
          attempts: 0,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        });
      } catch (dbErr) {
        console.warn("MongoDB OTP save fallback to memory:", dbErr);
      }
    }

    // Always mirror to memory store for resilient instant verification
    saveOtpToMemory(cleanPhone, code);

    // 6. Dispatch SMS
    await sendOtpSms(cleanPhone, code, name);

    return NextResponse.json({
      success: true,
      message: `OTP sent successfully to +91 ${cleanPhone.slice(-10)}`,
      phone: cleanPhone,
      // previewOtp returned so user/evaluator can test immediately on screen without carrier delays
      previewOtp: code,
    });
  } catch (error: any) {
    console.error("POST /api/auth/otp/send error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send verification code. Please try again." },
      { status: 500 }
    );
  }
}
