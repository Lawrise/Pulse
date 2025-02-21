const express = require("express");
const router = express.Router();
const { 
  createChat, 
  getUserChats, 
  getChatById, 
  deleteChat 
} = require("../controllers/chatControllers");
const authenticateToken = require("../middleware/authMiddleware");

// Apply authentication middleware
router.use(authenticateToken);

// Chat routes
router.post("/", createChat);
router.get("/", getUserChats);
router.get("/:id", getChatById);
router.delete("/:id", deleteChat);

module.exports = router;