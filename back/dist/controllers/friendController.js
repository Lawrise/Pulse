"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectFriendRequest = exports.acceptFriendRequest = exports.getFriendRequests = exports.getFriends = exports.sendFriendRequest = void 0;
const nmodels_1 = require("../nmodels");
const core_1 = require("@sequelize/core");
const sendFriendRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const { username } = req.body;
    const senderId = req.user.id;
    try {
        const targetUser = yield nmodels_1.User.findOne({
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
        const existingFriendship = yield nmodels_1.Friend.findOne({
            where: {
                [core_1.Op.or]: [
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
        const friendRequest = yield nmodels_1.Friend.create({
            userId: senderId,
            friendId: targetUser.id,
            status: "pending",
        });
        res.status(201).json({
            message: "Friend request sent",
            request: friendRequest,
        });
    }
    catch (error) {
        console.error("Send friend request error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.sendFriendRequest = sendFriendRequest;
const getFriends = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const friends = yield nmodels_1.Friend.findAll({
            where: {
                [core_1.Op.or]: [{ userId: req.user.id }, { friendId: req.user.id }],
                status: "accepted",
            },
            include: [
                {
                    model: nmodels_1.User,
                    as: "user",
                    attributes: ["id", "username", "email"],
                },
                {
                    model: nmodels_1.User,
                    as: "friend",
                    attributes: ["id", "username", "email"],
                },
            ],
        });
        // Transform to get only the other user's info
        const transformedFriends = friends.map((friendship) => {
            var _a;
            const otherUser = friendship.userId === ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)
                ? friendship.friend
                : friendship.user;
            return {
                friendshipId: friendship.id,
                friend: otherUser,
            };
        });
        res.json(transformedFriends);
    }
    catch (error) {
        console.error("Get friends error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getFriends = getFriends;
const getFriendRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const friendRequests = yield nmodels_1.Friend.findAll({
            where: {
                friendId: req.user.id,
                status: "pending",
            },
            include: [
                {
                    model: nmodels_1.User,
                    as: "user",
                    attributes: ["id", "username", "email"],
                },
            ],
        });
        res.json(friendRequests);
    }
    catch (error) {
        console.error("Get friend requests error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getFriendRequests = getFriendRequests;
const acceptFriendRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const { requestId } = req.body;
    try {
        const friendRequest = yield nmodels_1.Friend.findOne({
            where: {
                id: requestId,
                friendId: req.user.id,
                status: "pending",
            },
        });
        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }
        yield friendRequest.update({ status: "accepted" });
        res.json({ message: "Friend request accepted" });
    }
    catch (error) {
        console.error("Accept friend request error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.acceptFriendRequest = acceptFriendRequest;
const rejectFriendRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const { requestId } = req.body;
    try {
        const friendRequest = yield nmodels_1.Friend.findOne({
            where: {
                id: requestId,
                friendId: req.user.id,
                status: "pending",
            },
        });
        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }
        yield friendRequest.update({ status: "rejected" });
        res.json({ message: "Friend request rejected" });
    }
    catch (error) {
        console.error("Reject friend request error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.rejectFriendRequest = rejectFriendRequest;
