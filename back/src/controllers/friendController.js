const { Friendship } = require("../models");

const sendFriendRequest = async (req, res) => {
  const { userId } = req.body; // The user to send a request to
  const senderId = req.user.id; // Authenticated user

  try {
    if (senderId === userId) {
      return res
        .status(400)
        .json({ message: "You can't send a friend request to yourself" });
    }

    // Check if friendship already exists
    const existingFriendship = await Friendship.findOne({
      where: {
        [Op.or]: [
          { user1Id: senderId, user2Id: userId },
          { user1Id: userId, user2Id: senderId },
        ],
      },
    });

    if (existingFriendship) {
      return res.status(400).json({ message: "Friend request already exists" });
    }

    // Create a new friend request
    await Friendship.create({ user1Id: senderId, user2Id: userId });

    res.status(201).json({ message: "Friend request sent" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const acceptFriendRequest = async (req, res) => {
  const { requestId } = req.body;
  const userId = req.user.id;

  try {
    const request = await Friendship.findOne({ where: { id: requestId } });

    if (!request) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    if (request.user2Id !== userId) {
      return res
        .status(403)
        .json({ message: "You can only accept requests sent to you" });
    }

    request.status = "accepted";
    await request.save();

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const rejectFriendRequest = async (req, res) => {
  const { requestId } = req.body;
  const userId = req.user.id;

  try {
    const request = await Friendship.findOne({ where: { id: requestId } });

    if (!request) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    if (request.user2Id !== userId) {
      return res
        .status(403)
        .json({ message: "You can only reject requests sent to you" });
    }

    request.status = "rejected";
    await request.save();

    res.status(200).json({ message: "Friend request rejected" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getFriends = async (req, res) => {
  const userId = req.user.id;

  try {
    const friends = await Friendship.findAll({
      where: {
        [Op.or]: [
          { user1Id: userId, status: "accepted" },
          { user2Id: userId, status: "accepted" },
        ],
      },
      include: [
        {
          model: User,
          as: "requester",
          attributes: ["id", "username", "email"],
        },
        {
          model: User,
          as: "receiver",
          attributes: ["id", "username", "email"],
        },
      ],
    });

    res.status(200).json(friends);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
