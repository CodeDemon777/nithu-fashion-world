import { NextResponse } from "next/server";
import { connectToDatabase, isDbConfigured } from "@/lib/mongodb";
import ProductModel from "@/models/Product";
import { PRODUCTS as DEFAULT_PRODUCTS } from "@/lib/data";

// GET /api/products - Get all products from MongoDB Atlas
export async function GET() {
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
        error: error.message || "Failed to fetch from MongoDB Atlas",
        products: DEFAULT_PRODUCTS,
      },
      { status: 200 }
    );
  }
}

// POST /api/products - Add a new product to MongoDB Atlas
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.name || !body.price || !body.category) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: name, price, category" },
        { status: 400 }
      );
    }

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
      body.slug ||
      body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") +
        "-" +
        Date.now();

    const newProduct = await ProductModel.create({
      name: body.name.trim(),
      slug,
      category: body.category,
      categoryLabel: body.categoryLabel || body.category.toUpperCase(),
      price: Number(body.price),
      oldPrice: Number(body.oldPrice) || 0,
      discount: Number(body.discount) || 0,
      rating: Number(body.rating) || 5.0,
      reviewsCount: Number(body.reviewsCount) || 1,
      image: body.image || "/images/categories/sarees.jpg",
      description: body.description || "Artisanal creation from Nithu Fashion World.",
      features: body.features || ["Artisan Handcrafted", "Custom Fitting Available"],
      isCustomizable: body.isCustomizable ?? true,
      inStock: body.inStock ?? true,
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
      { success: false, error: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
