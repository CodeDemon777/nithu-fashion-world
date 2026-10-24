import { NextResponse } from "next/server";
import { connectToDatabase, isDbConfigured } from "@/lib/mongodb";
import OrderModel from "@/models/Order";
import CustomerModel from "@/models/Customer";
import { applyRateLimit } from "@/lib/rate-limit";
import { sanitizeString, validatePhone, validateEmail, validateNumber } from "@/lib/validation";

// GET /api/orders - Get orders from MongoDB Atlas
export async function GET(req: Request) {
  const rateLimitResponse = applyRateLimit(req, "READ");
  if (rateLimitResponse) return rateLimitResponse;

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
  const rateLimitResponse = applyRateLimit(req, "WRITE");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await req.json();

    const customerName = sanitizeString(body.customerName, 80);
    const phoneResult = validatePhone(body.customerPhone);
    const deliveryAddress = sanitizeString(body.deliveryAddress, 300);

    if (!customerName || !phoneResult.value || !deliveryAddress) {
      return NextResponse.json(
        { success: false, error: "Missing required order information: Name, Phone, and Address are required." },
        { status: 400 }
      );
    }

    const items = Array.isArray(body.items)
      ? body.items.slice(0, 20).map((item: any) => ({
          productId: sanitizeString(item.productId, 100),
          name: sanitizeString(item.name, 120),
          image: sanitizeString(item.image, 400),
          price: validateNumber(item.price, 0, 1_000_000),
          quantity: Math.max(1, Math.min(validateNumber(item.quantity, 1, 50), 50)),
          size: sanitizeString(item.size || "Standard", 50),
        }))
      : [];

    if (items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Order must contain at least one valid item." },
        { status: 400 }
      );
    }

    const totalAmount = validateNumber(body.totalAmount, 1, 10_000_000, 0);
    if (totalAmount <= 0) {
      return NextResponse.json(
        { success: false, error: "Total amount must be greater than ₹0." },
        { status: 400 }
      );
    }

    const customerEmail = validateEmail(body.customerEmail).isValid
      ? validateEmail(body.customerEmail).value!
      : `${phoneResult.value}@customer.nfw`;

    const orderNumber =
      sanitizeString(body.orderNumber, 40) ||
      "NFW-2026-" + Math.floor(1000 + Math.random() * 9000);

    if (!isDbConfigured()) {
      const fallbackOrder = {
        id: "ord-" + Date.now(),
        orderNumber,
        customerName,
        customerEmail,
        customerPhone: phoneResult.value,
        deliveryAddress,
        items,
        totalAmount,
        status: "In Tailoring" as const,
        paymentMethod: (body.paymentMethod === "COD" ? "COD" : "UPI") as "UPI" | "COD",
        paymentStatus: (body.paymentStatus === "Pending" ? "Pending" : "Paid") as "Paid" | "Pending",
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
      customerName,
      customerEmail,
      customerPhone: phoneResult.value,
      deliveryAddress,
      items,
      totalAmount,
      status: ["Processing", "In Tailoring", "Dispatched", "Delivered", "Cancelled"].includes(body.status)
        ? body.status
        : "In Tailoring",
      paymentMethod: ["UPI", "Card", "NetBanking", "COD"].includes(body.paymentMethod)
        ? body.paymentMethod
        : "UPI",
      paymentStatus: body.paymentStatus === "Pending" ? "Pending" : "Paid",
      estimatedDelivery: sanitizeString(body.estimatedDelivery || "Within 4-6 Days", 60),
    });

    // Update customer stats if customer exists
    await CustomerModel.findOneAndUpdate(
      { email: customerEmail },
      {
        $inc: { totalOrders: 1, totalSpent: totalAmount },
        $set: {
          phone: phoneResult.value,
          address: deliveryAddress,
        },
      }
    ).catch(() => {});

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
