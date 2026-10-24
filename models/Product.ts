import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProductDocument extends Document {
  name: string;
  slug: string;
  category: "sarees" | "blouses" | "dresses" | "kids" | "crafts" | "gifts" | "festive";
  categoryLabel: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  features: string[];
  isCustomizable: boolean;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProductDocument>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Product slug is required"],
      trim: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["sarees", "blouses", "dresses", "kids", "crafts", "gifts", "festive"],
    },
    categoryLabel: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: 0,
    },
    oldPrice: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 1,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 1,
    },
    image: {
      type: String,
      required: [true, "Product image URL is required"],
    },
    description: {
      type: String,
      default: "Exquisite hand-tailored piece from Nithu Fashion World.",
    },
    features: {
      type: [String],
      default: [],
    },
    isCustomizable: {
      type: Boolean,
      default: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret: any) => {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Prevent model overwrite in development hot reloading
const ProductModel: Model<IProductDocument> =
  mongoose.models.Product || mongoose.model<IProductDocument>("Product", ProductSchema);

export default ProductModel;
