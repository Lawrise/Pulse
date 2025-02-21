import { Response, Request } from "express";
import { Friend, User } from "../nmodels";
import { Op } from "sequelize";

interface TransformedFriend {
  friendshipId: string;
  friend: {
    id: string;
    username: string;
    email: string;
  };
}

interface FriendWithAssociations extends Friend {
  user?: User;
  friendUser?: User;
}

export const getFriends = async (req: Request, res: Response) => {
  try {
    const friends = (await Friend.findAll({
      where: {
        [Op.or]: [{ userId: req.user!.id }, { friendId: req.user!.id }],
        status: "accepted",
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "email"],
        },
        {
          model: User,
          as: "friendUser", // Changed from "friend" to "friendUser"
          attributes: ["id", "username", "email"],
        },
      ],
    })) as unknown as FriendWithAssociations[];

    const transformedFriends: TransformedFriend[] = friends.map(
      (friendship) => ({
        friendshipId: friendship.id,
        friend:
          friendship.userId === req.user!.id
            ? friendship.friendUser! // Changed from friendship.friend to friendship.friendUser
            : friendship.user!,
      })
    );

    res.json(transformedFriends);
  } catch (error) {
    console.error("Get friends error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update other controller methods to use AuthenticatedRequest
export const sendFriendRequest = async (req: Request, res: Response) => {
  const { username } = req.body;
  const senderId = req.user!.id;

  try {
    const targetUser = await User.findOne({
      where: { username },
    });

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (senderId === targetUser.id) {
      return res.status(400).json({
        message: "You can't send a friend request to yourself",
      });
    }

    // Check existing friendship
    const existingFriendship = await Friend.findOne({
      where: {
        [Op.or]: [
          { userId: senderId, friendId: targetUser.id },
          { userId: targetUser.id, friendId: senderId },
        ],
      },
    });

    if (existingFriendship) {
      return res.status(400).json({
        message: `Friend request already ${existingFriendship.status}`,
      });
    }

    const friendRequest = await Friend.create({
      userId: senderId,
      friendId: targetUser.id,
      status: "pending",
    });

    res.status(201).json({
      message: "Friend request sent",
      request: friendRequest,
    });
  } catch (error) {
    console.error("Send friend request error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getFriendRequests = async (req: Request, res: Response) => {
  try {
    const friendRequests = await Friend.findAll({
      where: {
        friendId: req.user!.id,
        status: "pending",
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "email"],
        },
      ],
    });

    res.json(friendRequests);
  } catch (error) {
    console.error("Get friend requests error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update accept and reject methods similarly
export const acceptFriendRequest = async (req: Request, res: Response) => {
  const { requestId } = req.body;

  try {
    const friendRequest = await Friend.findOne({
      where: {
        id: requestId,
        friendId: req.user!.id,
        status: "pending",
      },
    });

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    await friendRequest.update({ status: "accepted" });

    res.json({ message: "Friend request accepted" });
  } catch (error) {
    console.error("Accept friend request error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const rejectFriendRequest = async (req: Request, res: Response) => {
  const { requestId } = req.body;

  try {
    const friendRequest = await Friend.findOne({
      where: {
        id: requestId,
        friendId: req.user!.id,
        status: "pending",
      },
    });

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    await friendRequest.update({ status: "rejected" });

    res.json({ message: "Friend request rejected" });
  } catch (error) {
    console.error("Reject friend request error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
