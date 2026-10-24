import { NextResponse } from "next/server";
import { connectToDatabase, isDbConfigured } from "@/lib/mongodb";
import ProductModel from "@/models/Product";
import mongoose from "mongoose";
import { applyRateLimit } from "@/lib/rate-limit";
import { sanitizeString, validateNumber } from "@/lib/validation";

// PUT /api/products/[id] - Update product in MongoDB Atlas
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

    if (!isDbConfigured()) {
      return NextResponse.json(
        { success: false, error: "MongoDB Atlas is not configured." },
        { status: 503 }
      );
    }

    await connectToDatabase();

    const query = mongoose.Types.ObjectId.isValid(id)
      ? { _id: id }
      : { slug: sanitizeString(id, 100) };

    // Sanitize updatable fields
    const sanitizedUpdate: Record<string, any> = {};

    if (body.name !== undefined) sanitizedUpdate.name = sanitizeString(body.name, 120);
    if (body.price !== undefined) sanitizedUpdate.price = validateNumber(body.price, 0, 1_000_000);
    if (body.oldPrice !== undefined) sanitizedUpdate.oldPrice = validateNumber(body.oldPrice, 0, 1_000_000);
    if (body.discount !== undefined) sanitizedUpdate.discount = validateNumber(body.discount, 0, 100);
    if (body.inStock !== undefined) sanitizedUpdate.inStock = Boolean(body.inStock);
    if (body.description !== undefined) sanitizedUpdate.description = sanitizeString(body.description, 1500);
    if (body.image !== undefined) sanitizedUpdate.image = sanitizeString(body.image, 400);

    const updated = await ProductModel.findOneAndUpdate(query, sanitizedUpdate, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product updated in MongoDB Atlas",
      product: {
        ...updated,
        id: (updated as any)._id?.toString() || id,
      },
    });
  } catch (error: any) {
    console.error("PUT /api/products/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete product from MongoDB Atlas
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  // 1. Rate Limiting Check
  const rateLimitResponse = applyRateLimit(req, "WRITE");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { id } = params;

    if (!isDbConfigured()) {
      return NextResponse.json(
        { success: false, error: "MongoDB Atlas is not configured." },
        { status: 503 }
      );
    }

    await connectToDatabase();

    const query = mongoose.Types.ObjectId.isValid(id)
      ? { _id: id }
      : { slug: sanitizeString(id, 100) };

    const deleted = await ProductModel.findOneAndDelete(query);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted from MongoDB Atlas",
    });
  } catch (error: any) {
    console.error("DELETE /api/products/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}
