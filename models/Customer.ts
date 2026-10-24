import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICustomerDocument extends Document {
  name: string;
  email: string;
  phone?: string;
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
    },
    email: {
      type: String,
      required: [true, "Customer email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    password: {
      type: String,
      default: "user123",
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    address: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "Tamil Nadu",
    },
    pincode: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
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
    },
    totalSpent: {
      type: Number,
      default: 0,
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

const CustomerModel: Model<ICustomerDocument> =
  mongoose.models.Customer ||
  mongoose.model<ICustomerDocument>("Customer", CustomerSchema);

export default CustomerModel;
