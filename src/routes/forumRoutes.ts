import { Router } from "express";
import {
  createForumPost,
  getForumPosts,
  getForumPostById,
  updateForumPost,
  deleteForumPost,
  addReply,
  upvoteForumPost,
  upvoteReply,
} from "../controllers/forumController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authMiddleware, createForumPost);
router.get("/", getForumPosts);
router.get("/:id", getForumPostById);
router.put("/:id", authMiddleware, updateForumPost);
router.delete("/:id", authMiddleware, deleteForumPost);
router.post("/:id/replies", authMiddleware, addReply);
router.post("/:id/upvote", authMiddleware, upvoteForumPost);
router.post("/:postId/replies/:replyId/upvote", authMiddleware, upvoteReply);

export default router;
