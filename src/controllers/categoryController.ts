import { Request, Response } from "express";
import Category from "../models/categoryModel";

// Create Category
export const createCategory: any = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const newCategory = new Category({
      name,
    });

    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Categories
export const getCategories: any = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get Category by ID
export const getCategoryById: any = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update Category
export const updateCategory: any = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Category
export const deleteCategory: any = async (req: Request, res: Response) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
