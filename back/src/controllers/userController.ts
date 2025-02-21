import { Op } from "@sequelize/core";
import { sequelize } from "../config/db";
import { sign } from "jsonwebtoken";
import { hash, compare } from "bcrypt";
import { User } from "../nmodels";
import { Request, Response } from "express";
import { JWT_SECRET } from "../config/jwtconf";

const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const userExists = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (userExists) {
      console.log(userExists);
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    try {
      await sequelize.authenticate();
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }

    const result = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
    });

    console.log("User created:", result);
    const check = await sequelize.query('SELECT * FROM "Users"');
    console.log("Direct SQL check:", check);

    res.status(201).json({
      message: "User registered successfully",
      user: result,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { identifiant, password } = req.body;

    // Validate input
    if (!identifiant || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: identifiant }, { username: identifiant }],
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password
    const validPassword = await compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT
    const token = sign({ id: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { register, login };
