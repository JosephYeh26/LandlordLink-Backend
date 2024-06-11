import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  propertyAddress: string;
  isAccreditedInvestor: boolean;
  referralSource: string;
  googleId?: string;
  appleId?: string;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    propertyAddress: { type: String, required: true },
    isAccreditedInvestor: { type: Boolean, required: true },
    referralSource: { type: String, required: true },
    googleId: { type: String },
    appleId: { type: String },
  },
  { timestamps: true }
);

export default model<IUser>("User", userSchema);
