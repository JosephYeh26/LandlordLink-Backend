import { Router } from "express";
import { getUserInfo, updateUserInfo } from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/:id", authMiddleware, getUserInfo);
router.put("/:id", authMiddleware, updateUserInfo);

export default router;
