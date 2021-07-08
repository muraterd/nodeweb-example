import { Document, Schema, model } from "mongoose";
import { IUserModel } from "../entities/IUserModel";

export interface IUserDocument extends IUserModel, Document {}

const UserSchema = new Schema({
  email: String,
  firstname: String,
  lastname: String,
  phone: String,
  birthdate: Date,
  sex: Number,
  aboutMe: String,
  jobTitle: String,
  company: String,
  school: String,
  photos: {
    type: Array,
    default: []
  },

  createdAt: {
    type: Date,
    required: true,
    default: new Date()
  }
});

export const UserDocument = model<IUserDocument>("User", UserSchema);
