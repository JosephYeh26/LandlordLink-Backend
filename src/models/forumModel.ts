import mongoose, { Schema, Document } from "mongoose";

// Interface for a reply
interface IReply {
  author: mongoose.Types.ObjectId; // Reference to User model
  content: string;
  createdAt: Date;
  votesCount: number;
  upvoters: mongoose.Types.ObjectId[]; // Reference to User model
}

// Interface for a forum post
interface IForumPost extends Document {
  category: mongoose.Types.ObjectId; // Reference to Category model
  title: string;
  content: string;
  postedAt: Date;
  lastRepliedAt: Date;
  author: mongoose.Types.ObjectId; // Reference to User model
  replyCount: number;
  votesCount: number;
  replies: IReply[];
  upvoters: Schema.Types.ObjectId[];
}

// Reply Schema
const ReplySchema: Schema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User model
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  votesCount: { type: Number, default: 0 },
  upvoters: [{ type: mongoose.Types.ObjectId, ref: "User", default: [] }],
});

// Forum Post Schema
const ForumPostSchema: Schema = new Schema({
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true }, // Reference to Category model
  title: { type: String, required: true },
  content: { type: String, required: true },
  postedAt: { type: Date, default: Date.now },
  lastRepliedAt: { type: Date, default: Date.now },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User model
  replyCount: { type: Number, default: 0 },
  votesCount: { type: Number, default: 0 },
  replies: { type: [ReplySchema], default: [] },
  upvoters: [{ type: mongoose.Types.ObjectId, ref: "User", default: [] }],
});

// Creating the ForumPost model
const ForumPost = mongoose.model<IForumPost>("ForumPost", ForumPostSchema);

export default ForumPost;
