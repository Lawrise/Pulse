"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const friendController_1 = require("../controllers/friendController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = (0, express_1.Router)();
router.use(authMiddleware_1.default);
router.post("/send-request", authMiddleware_1.default, friendController_1.sendFriendRequest);
router.get("/requests", authMiddleware_1.default, friendController_1.getFriendRequests);
router.get("/friends", authMiddleware_1.default, friendController_1.getFriends);
router.post("/request/accept", authMiddleware_1.default, friendController_1.acceptFriendRequest);
router.post("/request/reject", authMiddleware_1.default, friendController_1.rejectFriendRequest);
exports.default = router;
