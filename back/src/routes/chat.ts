import { RequestHandler, Router } from "express";
import {
  createChat,
  getUserChats,
  getChatById,
  deleteChat,
  getChatMessages,
  createMessage,
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
router.get("/:id/messages", authenticateToken, getChatMessages);
router.post("/:id/messages", authenticateToken, createMessage);

export default router;
