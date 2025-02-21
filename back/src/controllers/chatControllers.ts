import { Request, Response } from "express";
import { Chat, User } from "../nmodels";
import { Op } from "@sequelize/core";

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    username: string;
  };
}

class ChatController {
  // Create chat method
  async createChat(req: AuthenticatedRequest, res: Response) {
    try {
      const { user2Id } = req.body;
      const user1Id = req.user.id;
  
      // Validate users exist
      const [user1, user2] = await Promise.all([
        User.findByPk(req.user.id),
        User.findByPk(user2Id)
      ]);
  
      if (!user2) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const existingChat = await Chat.findOne({
        where: {
          [Op.or]: [
            { user1_id: user1Id, user2_id: user2Id },
            { user1_id: user2Id, user2_id: user1Id },
          ],
        },
      });
  
      if (existingChat) {
        return res.status(400).json({ message: "Chat already exists" });
      }
  
      const chat = await Chat.create({
        user1_id: user1Id,
        user2_id: user2Id,
        name: `${req.user.username} & ${user2.username}`,
        is_active: true
      });
  
      res.status(201).json(chat);
    } catch (error) {
      console.error("Create chat error:", error);
      res.status(500).json({ message: "Error creating chat" });
    }
  }
  
  // Get user chats method
  async getUserChats(req: AuthenticatedRequest, res: Response) {
    try {
      const chats = await Chat.findAll({
        where: {
          [Op.or]: [{ user1_id: req.user.id }, { user2_id: req.user.id }],
          is_active: true,
        },
        include: [
          {
            model: User,
            as: "user1",
            attributes: ["id", "username"],
          },
          {
            model: User,
            as: "user2",
            attributes: ["id", "username"],
          },
        ],
        order: [["last_message_at", "DESC"]],
      });

      const transformedChats = chats.map((chat) => ({
        id: chat.id,
        otherUser: chat.user1_id === req.user.id ? chat.user2 : chat.user1,
        lastMessageAt: chat.last_message_at,
        createdAt: chat.created_at,
      }));

      res.json(transformedChats);
    } catch (error) {
      console.error("Get user chats error:", error);
      res.status(500).json({ message: "Error fetching chats" });
    }
  }
}

export const chatController = new ChatController();
