import { Router } from "express";
import {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  addComment,
} from "../controllers/blogController";
import upload from "../config/multerConfig";
import { authMiddleware, checkOwnership } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authMiddleware, upload.single("image"), createBlog);
router.get("/", getBlogs);
router.get("/:id", getBlogById);
router.put(
  "/:id",
  authMiddleware,
  upload.single("image"),
  checkOwnership,
  updateBlog
);
router.delete("/:id", authMiddleware, checkOwnership, deleteBlog);
router.post("/:id/comments", authMiddleware, addComment);

export default router;
