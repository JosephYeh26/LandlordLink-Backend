import { Request, Response } from "express";
import User from "../models/userModel";
import upload from "../config/multerConfig";
import { AuthRequest } from "../middleware/authMiddleware";
import bcrypt from "bcryptjs";

//View user information
export const getUserInfo: any = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update user information
export const updateUserInfo: any = async (req: AuthRequest, res: Response) => {
  upload.single("avatar")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const userId = req.params.id;
      const updates = req.body;

      // Check if the authenticated user is the owner of the account
      if (req.user && req.user._id.toString() !== userId) {
        return res
          .status(403)
          .json({ message: "Unauthorized to update user information" });
      }

      // Allow only specific fields to be updated
      const allowedUpdates = [
        "username",
        "email",
        "password",
        "propertyAddress",
        "isAccreditedInvestor",
        "referralSource",
        "job",
        "summary",
        "avatar",
      ];
      const filteredUpdates: any = {};
      allowedUpdates.forEach((field) => {
        if (updates[field]) {
          filteredUpdates[field] = updates[field];
        }
      });

      // Hash the new password if it is being updated
      if (filteredUpdates.password) {
        filteredUpdates.password = await bcrypt.hash(
          filteredUpdates.password,
          10
        );
      }

      if (req.file) {
        filteredUpdates.avatar = `${req.protocol}://${req.get(
          "host"
        )}/uploads/${req.file.filename}`;
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        filteredUpdates,
        {
          new: true,
        }
      ).select("-password");

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
};
