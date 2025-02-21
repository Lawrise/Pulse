"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chatController_1 = require("../controllers/chatController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = (0, express_1.Router)();
// Apply authentication middleware
router.use(authMiddleware_1.default);
// Chat routes
router.post("/", authMiddleware_1.default, chatController_1.createChat);
router.get("/", authMiddleware_1.default, chatController_1.getUserChats);
router.get("/:id", authMiddleware_1.default, chatController_1.getChatById);
router.delete("/:id", authMiddleware_1.default, chatController_1.deleteChat);
exports.default = router;
