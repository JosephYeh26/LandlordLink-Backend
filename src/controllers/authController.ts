import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/userModel";
import upload from "../config/multerConfig";

export const registerUser = async (req: Request, res: Response) => {
  upload.single("avatar")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    const {
      username,
      email,
      password,
      confirmPassword,
      propertyAddress,
      isAccreditedInvestor,
      referralSource,
    } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords don not match" });
    }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const avatarUrl = req.file
        ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
        : "defaultAvatar.jpg";

      const newUser: IUser = new User({
        username,
        email,
        password: hashedPassword,
        propertyAddress,
        isAccreditedInvestor: Boolean(isAccreditedInvestor),
        referralSource,
        job: "Freelancer",
        summary: "Full stack developer with 5 years of experience",
        avatar: avatarUrl,
        postsCount: 0,
        votesCount: 0,
      });

      await newUser
        .save()
        .then(() => console.log("saved to the database"))
        .catch((err) => console.log(err));

      const token = jwt.sign(
        { id: newUser._id },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );

      res.status(201).json({ token, user: newUser });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
