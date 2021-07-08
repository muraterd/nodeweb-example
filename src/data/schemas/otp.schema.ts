import { Document, Schema, Model, model } from "mongoose";
import { IOtpModel } from "../entities/IOtpModel";

export interface IOtpDocument extends IOtpModel, Document {}

export const OtpSchema: Schema = new Schema({
  phone: String,
  otp: String,
  ip: String,
  expireTime: Number,
  createdAt: {
    type: Date,
    required: true,
    default: new Date()
  }
});

export const OtpDocument: Model<IOtpDocument> = model<IOtpDocument>("Otp", OtpSchema);
