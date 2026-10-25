import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOtpDocument extends Document {
  phone: string;
  code: string;
  attempts: number;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OtpSchema = new Schema<IOtpDocument>(
  {
    phone: {
      type: String,
      required: [true, "Phone number is required for OTP"],
      index: true,
      trim: true,
      maxlength: 20,
    },
    code: {
      type: String,
      required: [true, "OTP code is required"],
      trim: true,
      maxlength: 10,
    },
    attempts: {
      type: Number,
      default: 0,
      max: 5,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // Native MongoDB TTL index: automatically deletes document at expiresAt
    },
  },
  {
    timestamps: true,
  }
);

// Prevent re-compilation of model in Next.js hot-reloading
const OtpModel: Model<IOtpDocument> =
  mongoose.models.Otp || mongoose.model<IOtpDocument>("Otp", OtpSchema);

export default OtpModel;
