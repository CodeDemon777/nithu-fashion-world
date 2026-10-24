import { NextResponse } from "next/server";
import { connectToDatabase, isDbConfigured } from "@/lib/mongodb";
import CustomerModel from "@/models/Customer";
import mongoose from "mongoose";
import { applyRateLimit } from "@/lib/rate-limit";
import { sanitizeString, validatePhone } from "@/lib/validation";

// PUT /api/customers/[id] - Update customer details in MongoDB Atlas
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  // 1. Rate Limiting Check
  const rateLimitResponse = applyRateLimit(req, "WRITE");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { id } = params;
    const body = await req.json();

    const cleanId = sanitizeString(id, 120);

    // 2. Sanitize permitted fields (Prevent privilege escalation by stripping role & password)
    const sanitizedUpdate: Record<string, any> = {};

    if (body.name !== undefined) {
      sanitizedUpdate.name = sanitizeString(body.name, 80);
    }
    if (body.phone !== undefined) {
      const phoneRes = validatePhone(body.phone);
      if (phoneRes.isValid) sanitizedUpdate.phone = phoneRes.value;
    }
    if (body.address !== undefined) {
      sanitizedUpdate.address = sanitizeString(body.address, 250);
    }
    if (body.city !== undefined) {
      sanitizedUpdate.city = sanitizeString(body.city, 80);
    }
    if (body.pincode !== undefined) {
      sanitizedUpdate.pincode = sanitizeString(body.pincode, 12);
    }

    if (!isDbConfigured()) {
      return NextResponse.json({
        success: true,
        source: "local-fallback",
        message: "Customer profile updated locally",
        customer: { id: cleanId, ...sanitizedUpdate },
      });
    }

    await connectToDatabase();

    const query = mongoose.Types.ObjectId.isValid(cleanId)
      ? { _id: cleanId }
      : { email: cleanId.toLowerCase() };

    const updated = await CustomerModel.findOneAndUpdate(query, sanitizedUpdate, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Customer not found" },
        { status: 404 }
      );
    }

    const safe = {
      ...updated,
      id: (updated as any)._id?.toString() || cleanId,
    };
    delete (safe as any).password;

    return NextResponse.json({
      success: true,
      message: "Customer details updated in MongoDB Atlas",
      customer: safe,
    });
  } catch (error: any) {
    console.error("PUT /api/customers/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update customer" },
      { status: 500 }
    );
  }
}
