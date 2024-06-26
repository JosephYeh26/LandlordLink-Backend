import { Request, Response } from "express";
import ForumPost from "../models/forumModel";
import mongoose from "mongoose";
import { AuthRequest } from "../middleware/authMiddleware";
import Category from "../models/categoryModel";
import User from "../models/userModel";

// Create Forum Post
export const createForumPost: any = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, category: categoryName } = req.body;
    // Check if category exists
    console.log(req.body);
    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const newForumPost = new ForumPost({
      category: category._id,
      title,
      content,
      author: req.user?._id,
      replies: [],
      votesCount: 0,
    });
    const savedForumPost = await newForumPost.save();

    await User.findByIdAndUpdate(req.user!._id, { $inc: { postsCount: 1 } });

    res.status(201).json(savedForumPost);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Forum Posts
export const getForumPosts: any = async (req: Request, res: Response) => {
  try {
    const forumPosts = await ForumPost.find()
      .select("-replies -content")
      .populate("author", "username avatar propertyAddress")
      .populate("category", "name");
    res.status(200).json(forumPosts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get Forum Post by ID
export const getForumPostById: any = async (req: Request, res: Response) => {
  try {
    const forumPost = await ForumPost.findById(req.params.id)
      .populate(
        "author",
        "username avatar postsCount votesCount propertyAddress"
      )
      .populate("category", "name")
      .populate(
        "replies.author",
        "username postsCount votesCount job propertyAddress avatar"
      );
    if (!forumPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(forumPost);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update Forum Post
export const updateForumPost: any = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const forumPost = await ForumPost.findById(id);
    if (!forumPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (forumPost.author.toString() !== req.user?._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    forumPost.title = title || forumPost.title;
    forumPost.content = content || forumPost.content;
    await forumPost.save();

    res.status(200).json(forumPost);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Forum Post
export const deleteForumPost: any = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const forumPost = await ForumPost.findById(id);
    if (!forumPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (forumPost.author.toString() !== req.user?._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await ForumPost.findByIdAndDelete(req.params.id);
    await User.findByIdAndUpdate(req.user!._id, { $inc: { postsCount: -1 } });

    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Add Reply to Forum Post
export const addReply: any = async (req: AuthRequest, res: Response) => {
  try {
    const { content } = req.body;
    const forumPost = await ForumPost.findById(req.params.id);
    if (!forumPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const newReply = {
      author: new mongoose.Types.ObjectId(req.user._id),
      content,
      createdAt: new Date(),
      votesCount: 0,
      upvoters: [],
    };

    forumPost.replies.push(newReply);
    forumPost.replyCount = forumPost.replies.length;
    forumPost.lastRepliedAt = new Date();
    await forumPost.save();

    await User.findByIdAndUpdate(req.user!._id, { $inc: { postsCount: 1 } });

    res.status(201).json(forumPost);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Upvote Forum Post
export const upvoteForumPost: any = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId: any = req.user?._id;

    const forumPost = await ForumPost.findById(id);
    if (!forumPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (forumPost.author.toString() === userId.toString()) {
      return res.status(400).json({ message: "Cannot upvote your own post" });
    }

    if (forumPost.upvoters.includes(userId)) {
      return res.status(400).json({ message: "Already upvoted" });
    }

    forumPost.votesCount += 1;
    forumPost.upvoters.push(userId);
    await forumPost.save();

    await User.findByIdAndUpdate(userId, {
      $addToSet: { upvotedPosts: id },
    });

    await User.findByIdAndUpdate(forumPost.author, {
      $inc: { votesCount: 1 },
    });

    res.status(200).json(forumPost);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Upvote Reply
export const upvoteReply: any = async (req: AuthRequest, res: Response) => {
  try {
    const { postId, replyId } = req.params;
    const userId: any = req.user!._id;

    const forumPost = await ForumPost.findById(postId);
    if (!forumPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    const replies = forumPost.replies as any;
    const reply = replies.id(replyId);
    if (!reply) {
      return res.status(404).json({ message: "Reply not found" });
    }

    if (reply.author.toString() === userId.toString()) {
      return res.status(400).json({ message: "Cannot upvote your own reply" });
    }

    if (!reply.upvoters) {
      reply.upvoters = [];
    }

    if (reply.upvoters.includes(userId)) {
      return res.status(400).json({ message: "Already upvoted" });
    }

    reply.votesCount += 1;
    reply.upvoters.push(userId);
    await forumPost.save();

    await User.findByIdAndUpdate(userId, {
      $addToSet: { upvotedReplies: replyId },
    });

    await User.findByIdAndUpdate(reply.author, {
      $inc: { votesCount: 1 },
    });

    res.status(200).json(forumPost);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
