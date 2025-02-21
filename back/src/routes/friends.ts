import { Router } from "express";
import {
  sendFriendRequest,
  getFriends,
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
} from "../controllers/friendController";
import authenticateToken from "../middleware/authMiddleware";

const router = Router();

// router.use(authenticateToken);
router.post("/send-request", authenticateToken, sendFriendRequest);
router.get("/requests", authenticateToken, getFriendRequests);
router.get("/friends", authenticateToken, getFriends);
router.post("/request/accept", authenticateToken, acceptFriendRequest);
router.post("/request/reject", authenticateToken, rejectFriendRequest);

export default router;
