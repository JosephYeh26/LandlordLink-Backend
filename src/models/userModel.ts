import mongoose, { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  propertyAddress: string;
  isAccreditedInvestor: boolean;
  referralSource: string;
  googleId?: string;
  appleId?: string;
  job?: string;
  summary?: string;
  avatar?: string;
  postsCount?: number;
  votesCount?: number;
  upvotedPosts?: mongoose.Types.ObjectId[];
  upvotedReplies?: mongoose.Types.ObjectId[];
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
    job: { type: String, default: "Freelancer" },
    summary: {
      type: String,
      default: "Full stack developer with 5 years of experience",
    },
    avatar: { type: String, required: false },
    postsCount: { type: Number, default: 0 },
    votesCount: { type: Number, default: 0 },
    upvotedPosts: [{ type: mongoose.Types.ObjectId, ref: "ForumPost" }],
    upvotedReplies: [
      { type: mongoose.Types.ObjectId, ref: "ForumPost.replies" },
    ],
  },
  { timestamps: true }
);

export default model<IUser>("User", userSchema);
