const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.post("/chats", async (req, res) => {
  const { user1_id, user2_id } = req.body;

  try {
    // Check if chat already exists
    const existingChat = await pool.query(
      `SELECT * FROM chats WHERE (user1_id = $1 AND user2_id = $2) 
		 OR (user1_id = $2 AND user2_id = $1)`,
      [user1_id, user2_id]
    );

    if (existingChat.rows.length > 0) {
      return res.json(existingChat.rows[0]); // Return existing chat
    }

    // Create new chat
    const newChat = await pool.query(
      `INSERT INTO chats (user1_id, user2_id) VALUES ($1, $2) RETURNING *`,
      [user1_id, user2_id]
    );

    res.json(newChat.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/chats/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const chats = await pool.query(
      `SELECT chats.*, u1.username AS user1_name, u2.username AS user2_name 
		 FROM chats 
		 JOIN users u1 ON chats.user1_id = u1.id 
		 JOIN users u2 ON chats.user2_id = u2.id
		 WHERE user1_id = $1 OR user2_id = $1`,
      [userId]
    );

    res.json(chats.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/messages/:chatId", async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await pool.query(
      `SELECT messages.*, users.username 
		 FROM messages 
		 JOIN users ON messages.sender_id = users.id 
		 WHERE chat_id = $1 
		 ORDER BY created_at ASC`,
      [chatId]
    );

    res.json(messages.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;