import { NextResponse } from "next/server";
import { connectToDatabase, isDbConfigured } from "@/lib/mongodb";
import OrderModel from "@/models/Order";
import CustomerModel from "@/models/Customer";

// GET /api/orders - Get orders from MongoDB Atlas
export async function GET() {
  try {
    if (!isDbConfigured()) {
      return NextResponse.json({
        success: true,
        source: "local-fallback",
        orders: [],
      });
    }

    await connectToDatabase();
    const orders = await OrderModel.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      source: "mongodb-atlas",
      count: orders.length,
      orders: orders.map((o: any) => ({
        ...o,
        id: o._id ? o._id.toString() : o.id,
      })),
    });
  } catch (error: any) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new order in MongoDB Atlas
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.customerName || !body.customerPhone || !body.items || !body.totalAmount) {
      return NextResponse.json(
        { success: false, error: "Missing required order information" },
        { status: 400 }
      );
    }

    const orderNumber =
      body.orderNumber ||
      "NFW-2026-" + Math.floor(1000 + Math.random() * 9000);

    if (!isDbConfigured()) {
      const fallbackOrder = {
        id: "ord-" + Date.now(),
        orderNumber,
        ...body,
        createdAt: new Date().toISOString().split("T")[0],
      };
      return NextResponse.json({
        success: true,
        source: "local-fallback",
        order: fallbackOrder,
      });
    }

    await connectToDatabase();

    const newOrder = await OrderModel.create({
      orderNumber,
      customerName: body.customerName,
      customerEmail: body.customerEmail || `${body.customerPhone}@customer.nfw`,
      customerPhone: body.customerPhone,
      deliveryAddress: body.deliveryAddress,
      items: body.items,
      totalAmount: Number(body.totalAmount),
      status: body.status || "In Tailoring",
      paymentMethod: body.paymentMethod || "UPI",
      paymentStatus: body.paymentStatus || "Paid",
      estimatedDelivery: body.estimatedDelivery || "Within 4-6 Days",
    });

    // Update customer stats if customer exists
    if (body.customerEmail) {
      await CustomerModel.findOneAndUpdate(
        { email: body.customerEmail.toLowerCase().trim() },
        {
          $inc: { totalOrders: 1, totalSpent: Number(body.totalAmount) },
          $set: {
            phone: body.customerPhone,
            address: body.deliveryAddress,
          },
        }
      ).catch(() => {});
    }

    const formatted = {
      ...newOrder.toObject(),
      id: newOrder._id.toString(),
    };

    return NextResponse.json(
      {
        success: true,
        message: "Order placed and recorded in MongoDB Atlas",
        order: formatted,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
