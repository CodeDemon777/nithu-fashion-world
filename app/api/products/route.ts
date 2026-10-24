import { NextResponse } from "next/server";
import { connectToDatabase, isDbConfigured } from "@/lib/mongodb";
import ProductModel from "@/models/Product";
import { PRODUCTS as DEFAULT_PRODUCTS } from "@/lib/data";
import { applyRateLimit } from "@/lib/rate-limit";
import { validateProductPayload } from "@/lib/validation";
import { verifyAdminAccess } from "@/lib/auth-guard";

// GET /api/products - Get all products from MongoDB Atlas
export async function GET(req: Request) {
  // 1. Rate Limiting Check
  const rateLimitResponse = applyRateLimit(req, "READ");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    if (!isDbConfigured()) {
      return NextResponse.json({
        success: true,
        source: "local-fallback",
        message: "MongoDB Atlas URI not configured yet. Serving local catalog.",
        products: DEFAULT_PRODUCTS,
      });
    }

    await connectToDatabase();
    let products: any[] = await ProductModel.find({}).sort({ createdAt: -1 }).lean();

    // If MongoDB collection is completely empty, auto-seed with default products
    if (products.length === 0) {
      console.log("MongoDB products collection is empty. Auto-seeding initial catalog...");
      const seedDocs = DEFAULT_PRODUCTS.map((p) => ({
        name: p.name,
        slug: p.slug,
        category: p.category,
        categoryLabel: p.categoryLabel,
        price: p.price,
        oldPrice: p.oldPrice || 0,
        discount: p.discount || 0,
        rating: p.rating || 5.0,
        reviewsCount: p.reviewsCount || 1,
        image: p.image,
        description: p.description,
        features: p.features || [],
        isCustomizable: p.isCustomizable ?? true,
        inStock: p.inStock ?? true,
      }));

      const created = await ProductModel.insertMany(seedDocs);
      products = created.map((doc) => {
        const item = doc.toObject();
        return {
          ...item,
          id: item._id.toString(),
        };
      });
    } else {
      // Format _id to id for frontend compatibility
      products = products.map((p: any) => ({
        ...p,
        id: p._id ? p._id.toString() : p.id,
      }));
    }

    return NextResponse.json({
      success: true,
      source: "mongodb-atlas",
      count: products.length,
      products,
    });
  } catch (error: any) {
    console.error("GET /api/products error:", error);
    // Graceful fallback to default products so the user's store never breaks
    return NextResponse.json(
      {
        success: false,
        source: "local-fallback",
        error: "Unable to retrieve live catalog. Serving local cached collection.",
        products: DEFAULT_PRODUCTS,
      },
      { status: 200 }
    );
  }
}

// POST /api/products - Add a new product (Protected: Admin Only)
export async function POST(req: Request) {
  // 1. Rate Limiting Check
  const rateLimitResponse = applyRateLimit(req, "WRITE");
  if (rateLimitResponse) return rateLimitResponse;

  // 2. Broken Access Control Defense: Verify Admin Authorization
  const authResponse = verifyAdminAccess(req);
  if (authResponse) return authResponse;

  try {
    const rawBody = await req.json();

    // 3. Validate and Sanitize Input (prevents XSS, SSRF, prototype pollution)
    const validation = validateProductPayload(rawBody);
    if (!validation.isValid || !validation.sanitized) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    const { sanitized } = validation;

    if (!isDbConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: "MongoDB Atlas is not configured in .env.local. Please set MONGODB_URI.",
        },
        { status: 503 }
      );
    }

    await connectToDatabase();

    const slug =
      rawBody.slug ||
      sanitized.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") +
        "-" +
        Date.now();

    const newProduct = await ProductModel.create({
      name: sanitized.name,
      slug,
      category: sanitized.category,
      categoryLabel: sanitized.categoryLabel,
      price: sanitized.price,
      oldPrice: sanitized.oldPrice,
      discount: sanitized.discount,
      rating: 5.0,
      reviewsCount: 1,
      image: sanitized.image,
      description: sanitized.description,
      features: sanitized.features,
      isCustomizable: sanitized.isCustomizable,
      inStock: sanitized.inStock,
    });

    const formatted = {
      ...newProduct.toObject(),
      id: newProduct._id.toString(),
    };

    return NextResponse.json(
      {
        success: true,
        message: "Product saved to MongoDB Atlas successfully!",
        product: formatted,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create product in database." },
      { status: 500 }
    );
  }
}
