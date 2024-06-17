import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

import authRoutes from "./routes/authRoutes";
import blogRoutes from "./routes/blogRoutes";
import forumRoutes from "./routes/forumRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import userRoutes from "./routes/userRoutes";
import passport from "passport";
import "./config/passport";

app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/user", userRoutes);
app.use(passport.initialize());

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
