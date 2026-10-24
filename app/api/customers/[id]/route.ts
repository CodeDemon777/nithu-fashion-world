import { NextResponse } from "next/server";
import { connectToDatabase, isDbConfigured } from "@/lib/mongodb";
import CustomerModel from "@/models/Customer";
import mongoose from "mongoose";

// PUT /api/customers/[id] - Update customer details in MongoDB Atlas
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();

    if (!isDbConfigured()) {
      return NextResponse.json({
        success: true,
        source: "local-fallback",
        message: "Customer profile updated locally",
        customer: { id, ...body },
      });
    }

    await connectToDatabase();

    const query = mongoose.Types.ObjectId.isValid(id)
      ? { _id: id }
      : { email: id };

    // Disallow overriding password directly through profile update
    const updateData = { ...body };
    delete updateData.password;

    const updated = await CustomerModel.findOneAndUpdate(query, updateData, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Customer details updated in MongoDB Atlas",
      customer: {
        ...updated,
        id: (updated as any)._id?.toString() || id,
      },
    });
  } catch (error: any) {
    console.error("PUT /api/customers/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update customer" },
      { status: 500 }
    );
  }
}
