import mongoose, { Schema, Document } from "mongoose";

// Interface for a comment
interface IComment {
  commentAuthor: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
}

// Interface for a blog
interface IBlog extends Document {
  title: string;
  content: string;
  image: string;
  category: mongoose.Types.ObjectId;
  lastSeen: Date;
  postedAt: Date;
  author: mongoose.Types.ObjectId;
  comments: IComment[];
  commentsCount: number;
}

// Comment Schema
const CommentSchema: Schema = new Schema({
  commentAuthor: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Blog Schema
const BlogSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String, required: false },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  lastSeen: { type: Date, default: Date.now },
  postedAt: { type: Date, default: Date.now },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  comments: { type: [CommentSchema], default: [] },
  commentsCount: { type: Number, default: 0 },
});

// Update commentsCount before saving
BlogSchema.pre<IBlog>("save", function (next: any) {
  this.commentsCount = this.comments.length;
  next();
});

// Creating the Blog model
const Blog = mongoose.model<IBlog>("Blog", BlogSchema);

export default Blog;
