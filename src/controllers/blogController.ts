import { Request, Response } from "express";
import Blog from "../models/blogModel";
import Category from "../models/categoryModel";
import { AuthRequest } from "../middleware/authMiddleware";
import mongoose from "mongoose";

// Create Blog
export const createBlog: any = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, category: categoryName } = req.body;
    const imageUrl = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : "";

    // Check if category exists
    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const newBlog = new Blog({
      title,
      content,
      image: imageUrl,
      category: category._id,
      author: req.user?._id,
      comments: [],
    });

    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    //console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Blogs
export const getBlogs: any = async (req: Request, res: Response) => {
  try {
    const blogs = await Blog.find()
      .select("-comments")
      .populate("category", "name")
      .populate("author", "username avatar")
      .lean();

    res.status(200).json(blogs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Blog by ID
export const getBlogById: any = async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("category", "name")
      .populate("author", "username job summary avatar")
      .populate("comments.commentAuthor", "username avatar");
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update Blog
export const updateBlog: any = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, category: categoryName } = req.body;
    const imageUrl = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : "";

    // Check if category exists
    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content, image: imageUrl, category: category._id },
      { new: true }
    );
    res.status(200).json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Blog
export const deleteBlog: any = async (req: AuthRequest, res: Response) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Blog deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Add Comment
export const addComment: any = async (req: AuthRequest, res: Response) => {
  try {
    const { content } = req.body;
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const newComment = {
      commentAuthor: new mongoose.Types.ObjectId(req.user._id),
      content,
      createdAt: new Date(),
    };

    blog.comments.push(newComment);
    blog.commentsCount = blog.comments.length;
    await blog.save();

    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
