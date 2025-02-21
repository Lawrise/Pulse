import { Request, Response } from 'express';
import { Friend, User } from '../nmodels';
import { Op } from '@sequelize/core';

interface FriendRequest extends Request {
  user: {
    id: string;
    username: string;
  };
}

class FriendController {
  async sendFriendRequest(req: FriendRequest, res: Response) {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { username } = req.body;
    const senderId = req.user.id;

    try {
      const targetUser = await User.findOne({
        where: { username }
      });

      if (!targetUser) {
        return res.status(404).json({ message: "User not found" });
      }

      if (senderId === targetUser.id) {
        return res.status(400).json({ 
          message: "You can't send a friend request to yourself" 
        });
      }

      // Check existing friendship
      const existingFriendship = await Friend.findOne({
        where: {
          [Op.or]: [
            { userId: senderId, friendId: targetUser.id },
            { userId: targetUser.id, friendId: senderId }
          ]
        }
      });

      if (existingFriendship) {
        return res.status(400).json({ 
          message: `Friend request already ${existingFriendship.status}` 
        });
      }

      const friendRequest = await Friend.create({
        userId: senderId,
        friendId: targetUser.id,
        status: 'pending'
      });

      res.status(201).json({
        message: "Friend request sent",
        request: friendRequest
      });
    } catch (error) {
      console.error('Send friend request error:', error);
      res.status(500).json({ message: "Server error" });
    }
  }

  async getFriends(req: FriendRequest, res: Response) {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const friends = await Friend.findAll({
        where: {
          [Op.or]: [
            { userId: req.user.id },
            { friendId: req.user.id }
          ],
          status: 'accepted'
        },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'email']
          },
          {
            model: User,
            as: 'friend',
            attributes: ['id', 'username', 'email']
          }
        ]
      });

      // Transform to get only the other user's info
      const transformedFriends = friends.map(friendship => {
        const otherUser = friendship.userId === req.user?.id 
          ? friendship.friend 
          : friendship.user;
        return {
          friendshipId: friendship.id,
          friend: otherUser
        };
      });

      res.json(transformedFriends);
    } catch (error) {
      console.error('Get friends error:', error);
      res.status(500).json({ message: "Server error" });
    }
  }
}

export const friendController = new FriendController();