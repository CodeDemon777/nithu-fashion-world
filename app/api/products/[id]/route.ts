import { NextResponse } from "next/server";
import { connectToDatabase, isDbConfigured } from "@/lib/mongodb";
import ProductModel from "@/models/Product";
import mongoose from "mongoose";

// PUT /api/products/[id] - Update product in MongoDB Atlas
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
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
      : { slug: id };

    const updated = await ProductModel.findOneAndUpdate(query, body, {
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
  _req: Request,
  { params }: { params: { id: string } }
) {
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
      : { slug: id };

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
