import { NextResponse } from "next/server";
import { connectToDatabase, isDbConfigured } from "@/lib/mongodb";
import mongoose from "mongoose";
import ProductModel from "@/models/Product";
import CustomerModel from "@/models/Customer";
import OrderModel from "@/models/Order";
import { applyRateLimit } from "@/lib/rate-limit";

// GET /api/db-status - Check live MongoDB Atlas connection status securely
export async function GET(req: Request) {
  const rateLimitResponse = applyRateLimit(req, "READ");
  if (rateLimitResponse) return rateLimitResponse;

  const configured = isDbConfigured();

  if (!configured) {
    return NextResponse.json({
      configured: false,
      connected: false,
      status: "missing_uri",
      message: "MONGODB_URI is not configured in .env.local yet.",
      hint: "Add your MongoDB Atlas connection string to .env.local",
    });
  }

  try {
    const conn = await connectToDatabase();
    if (!conn || mongoose.connection.readyState !== 1) {
      return NextResponse.json({
        configured: true,
        connected: false,
        status: "disconnected",
        message: "Could not establish connection to MongoDB Atlas.",
      });
    }

    const [productsCount, customersCount, ordersCount] = await Promise.all([
      ProductModel.countDocuments().catch(() => 0),
      CustomerModel.countDocuments().catch(() => 0),
      OrderModel.countDocuments().catch(() => 0),
    ]);

    // Data leak defense: Omit internal shard topology / hostnames
    return NextResponse.json({
      configured: true,
      connected: true,
      status: "connected",
      database: "nithu_fashion_world",
      cluster: "MongoDB Atlas (Secured Cloud Cluster)",
      stats: {
        productsCount,
        customersCount,
        ordersCount,
      },
      message: "Successfully connected to MongoDB Atlas!",
    });
  } catch (error: any) {
    console.error("GET /api/db-status error:", error);

    return NextResponse.json({
      configured: true,
      connected: false,
      status: "error",
      message: "Database connection failed. Please verify Atlas network access and credentials.",
    });
  }
}
