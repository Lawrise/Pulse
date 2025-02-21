import { RequestHandler, Router } from "express";
import {
  createChat,
  getUserChats,
  getChatById,
  deleteChat,
} from "../controllers/chatController";
import authenticateToken from "../middleware/authMiddleware";

const router = Router();

// Apply authentication middleware
// router.use(authenticateToken);

// Chat routes
router.post("/", authenticateToken, createChat);
router.get("/", authenticateToken, getUserChats);
router.get("/:id", authenticateToken, getChatById);
router.delete("/:id", authenticateToken, deleteChat);

export default router;
