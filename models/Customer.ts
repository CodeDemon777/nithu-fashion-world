import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICustomerDocument extends Document {
  name: string;
  email: string;
  phone?: string;
  phoneVerified?: boolean;
  phoneVerifiedAt?: Date;
  password?: string;
  role: "customer" | "admin";
  address?: string;
  city?: string;
  pincode?: string;
  avatar?: string;
  joinedDate: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomerDocument>(
  {
    name: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, "Customer email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 120,
      index: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
      maxlength: 20,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    phoneVerifiedAt: {
      type: Date,
    },
    password: {
      type: String,
      select: false, // Prevents password exposure in standard queries
      maxlength: 256,
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    address: {
      type: String,
      default: "",
      maxlength: 300,
    },
    city: {
      type: String,
      default: "Tamil Nadu",
      maxlength: 100,
    },
    pincode: {
      type: String,
      default: "",
      maxlength: 15,
    },
    avatar: {
      type: String,
      default: "",
      maxlength: 500,
    },
    joinedDate: {
      type: String,
      default: () =>
        new Date().toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
    },
    totalOrders: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret: any) => {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret.__v;
        delete ret.password; // Enforce zero-password leakage
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (_, ret: any) => {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret.__v;
        delete ret.password; // Enforce zero-password leakage
        return ret;
      },
    },
  }
);

if (process.env.NODE_ENV !== "production") {
  delete (mongoose.models as any).Customer;
}

const CustomerModel: Model<ICustomerDocument> =
  mongoose.models.Customer ||
  mongoose.model<ICustomerDocument>("Customer", CustomerSchema);

export default CustomerModel;
