import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
}

export interface IOrderDocument extends Document {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  items: IOrderItem[];
  totalAmount: number;
  status: "Processing" | "In Tailoring" | "Dispatched" | "Delivered" | "Cancelled";
  paymentMethod: "UPI" | "Card" | "NetBanking" | "COD";
  paymentStatus: "Paid" | "Pending";
  estimatedDelivery?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrderDocument>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerEmail: {
      type: String,
      required: true,
      trim: true,
    },
    customerPhone: {
      type: String,
      required: true,
      trim: true,
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    items: [
      {
        productId: String,
        name: String,
        image: String,
        price: Number,
        quantity: Number,
        size: String,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Processing", "In Tailoring", "Dispatched", "Delivered", "Cancelled"],
      default: "In Tailoring",
    },
    paymentMethod: {
      type: String,
      enum: ["UPI", "Card", "NetBanking", "COD"],
      default: "UPI",
    },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Pending"],
      default: "Paid",
    },
    estimatedDelivery: {
      type: String,
      default: "Within 4-6 Days",
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

const OrderModel: Model<IOrderDocument> =
  mongoose.models.Order || mongoose.model<IOrderDocument>("Order", OrderSchema);

export default OrderModel;
