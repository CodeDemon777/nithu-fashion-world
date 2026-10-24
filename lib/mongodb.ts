import mongoose from "mongoose";

declare global {
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

/**
 * Connect to MongoDB Atlas cluster
 * Returns mongoose instance or null if MONGODB_URI is not configured
 */
export async function connectToDatabase(): Promise<typeof mongoose | null> {
  const uri = process.env.MONGODB_URI?.trim();

  if (!uri) {
    return null;
  }

  if (cached!.conn && mongoose.connection.readyState === 1) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 6000, // Timeout after 6s if unreachable
    };

    cached!.promise = mongoose.connect(uri, opts).then((m) => {
      console.log("Successfully connected to MongoDB Atlas database:", m.connection.name);
      return m;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    console.error("MongoDB Atlas connection error:", e);
    throw e;
  }

  return cached!.conn;
}

export function isDbConfigured(): boolean {
  const uri = process.env.MONGODB_URI?.trim();
  return Boolean(uri && uri.length > 10 && !uri.includes("<password>"));
}
