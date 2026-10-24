import { NextResponse } from "next/server";
import { connectToDatabase, isDbConfigured } from "@/lib/mongodb";
import mongoose from "mongoose";
import ProductModel from "@/models/Product";
import CustomerModel from "@/models/Customer";
import OrderModel from "@/models/Order";
import { applyRateLimit } from "@/lib/rate-limit";

// GET /api/db-status - Check live MongoDB Atlas connection
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

    return NextResponse.json({
      configured: true,
      connected: true,
      status: "connected",
      database: mongoose.connection.name,
      host: mongoose.connection.host,
      stats: {
        productsCount,
        customersCount,
        ordersCount,
      },
      message: "Successfully connected to MongoDB Atlas!",
    });
  } catch (error: any) {
    let friendlyMessage = error.message;
    if (error.message?.includes("bad auth") || error.message?.includes("Authentication failed")) {
      friendlyMessage = "Authentication failed: Check your database username and password in .env.local";
    } else if (error.message?.includes("whitelist") || error.message?.includes("timed out")) {
      friendlyMessage = "Connection timed out: Ensure IP 0.0.0.0/0 is added to Network Access in MongoDB Atlas.";
    }

    return NextResponse.json({
      configured: true,
      connected: false,
      status: "error",
      message: friendlyMessage,
    });
  }
}
