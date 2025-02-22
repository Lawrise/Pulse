import { Request, Response } from "express";
import { Chat, Message, User } from "../nmodels";
import { Op } from "sequelize";

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    username: string;
  };
}

interface TransformedChat {
  id: string;
  otherUser: {
    id: string;
    username: string;
  };
  lastMessageAt?: Date;
  createdAt: Date;
}

interface ChatWithAssociations extends Chat {
  user1?: User;
  user2?: User;
  messages?: Message[];
}

export const createChat = async (req: Request, res: Response) => {
  try {
    const { user2Id } = req.body;
    const user1Id = req.user!.id;

    const [user1, user2] = await Promise.all([
      User.findByPk(user1Id),
      User.findByPk(user2Id),
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
      return res.status(201).json(existingChat);
    }

    const chat = await Chat.create({
      user1_id: user1Id,
      user2_id: user2Id,
      name: `${req.user!.username} & ${user2.username}`,
      is_active: true,
    });

    res.status(201).json(chat);
  } catch (error) {
    console.error("Create chat error:", error);
    res.status(500).json({ message: "Error creating chat" });
  }
};

export const getUserChats = async (req: Request, res: Response) => {
  try {
    const chats = (await Chat.findAll({
      where: {
        [Op.or]: [{ user1_id: req.user!.id }, { user2_id: req.user!.id }],
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
    })) as unknown as ChatWithAssociations[];

    const transformedChats = chats.map((chat) => ({
      id: chat.id,
      otherUser: chat.user1_id === req.user!.id ? chat.user2 : chat.user1,
      lastMessageAt: chat.last_message_at,
      createdAt: chat.created_at,
    }));

    res.json(transformedChats);
  } catch (error) {
    console.error("Get user chats error:", error);
    res.status(500).json({ message: "Error fetching chats" });
  }
};

export const getChatById = async (req: Request, res: Response) => {
  try {
    const { id: chatId } = req.params;
    const userId = req.user!.id;

    const chat = await Chat.findOne({
      where: {
        id: chatId,
        [Op.or]: [{ user1_id: userId }, { user2_id: userId }],
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
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.json(chat);
  } catch (error) {
    console.error("Get chat by id error:", error);
    res.status(500).json({ message: "Error fetching chat" });
  }
};

export const deleteChat = async (req: Request, res: Response) => {
  try {
    const { id: chatId } = req.params;
    const userId = req.user!.id;

    const chat = await Chat.findOne({
      where: {
        id: chatId,
        [Op.or]: [{ user1_id: userId }, { user2_id: userId }],
      },
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    await chat.update({
      is_active: false,
      deleted_at: new Date(),
    });

    res.json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Delete chat error:", error);
    res.status(500).json({ message: "Error deleting chat" });
  }
};

export const getChatMessages = async (req: Request, res: Response) => {
  try {
    const { id: chatId } = req.params;
    const userId = req.user!.id;

    const chat = await Chat.findOne({
      where: {
        id: chatId,
        [Op.or]: [{ user1_id: userId }, { user2_id: userId }],
        is_active: true,
      },
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const messages = await Message.findAll({
      where: { chat_id: chatId },
      order: [["created_at", "ASC"]],
    });

    res.json(messages);
  } catch (error) {
    console.error("Get chat messages error:", error);
    res.status(500).json({ message: "Error fetching messages" });
  }
};

export const createMessage = async (req: Request, res: Response) => {
  try {
    const { id: chatId } = req.params;
    const { content } = req.body;
    const userId = req.user!.id;

    // Verify chat exists and user has access
    const chat = await Chat.findOne({
      where: {
        id: chatId,
        [Op.or]: [{ user1_id: userId }, { user2_id: userId }],
        is_active: true,
      },
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Create the message using the correct field names
    const message = await Message.create({
      chat_id: chatId,
      sender_id: userId,
      message: content,
      type: "text",
      status: "sent",
      metadata: {},
    });

    // Update the chat's last_message_at
    await chat.update({
      last_message_at: new Date(),
    });

    res.status(201).json(message);
  } catch (error) {
    console.error("Create message error:", error);
    res.status(500).json({ message: "Error creating message" });
  }
};
