const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const {pool} = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {register, login} = require("../controllers/userController");

router.post("/register", register);

// Login route
router.post("/login", login);

router.post("/logout", async (req, res) => {
  
})

// Protected route example
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, email, created_at FROM Users WHERE id = $1",
      [req.user.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
