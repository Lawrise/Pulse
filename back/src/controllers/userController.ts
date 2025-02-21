import { Request, Response } from "express";
import { User } from "../nmodels";
import { Op } from "sequelize";
import { hash, compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwtconf";

interface RegisterBody {
  username: string;
  email: string;
  password: string;
}

interface LoginBody {
  identifiant: string;
  password: string;
}

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    username: string;
  };
}

export const register = async (
  req: Request<{}, {}, RegisterBody>,
  res: Response
) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const userExists = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (userExists) {
      return res.status(400).json({
        error: `User with this ${
          userExists.email === email ? "email" : "username"
        } already exists`,
      });
    }

    const hashedPassword = await hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req: Request<{}, {}, LoginBody>, res: Response) => {
  try {
    const { identifiant, password } = req.body;

    if (!identifiant || !password) {
      return res
        .status(400)
        .json({ error: "Email/Username and password are required" });
    }

    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: identifiant }, { username: identifiant }],
      },
    });

    if (!user || !(await compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = sign(
      {
        id: user.id,
        username: user.username,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

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

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.user!.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
