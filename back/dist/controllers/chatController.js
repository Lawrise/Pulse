"use strict";
/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   chatController.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jeboisne <jeboisne@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/02/21 14:16:11 by jeboisne          #+#    #+#             */
/*   Updated: 2025/02/21 15:26:34 by jeboisne         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */
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
exports.deleteChat = exports.getChatById = exports.getUserChats = exports.createChat = void 0;
const nmodels_1 = require("../nmodels");
const core_1 = require("@sequelize/core");
const createChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { user2Id } = req.body;
        const user1Id = req.user.id;
        const [user1, user2] = yield Promise.all([
            nmodels_1.User.findByPk(user1Id),
            nmodels_1.User.findByPk(user2Id),
        ]);
        if (!user2) {
            return res.status(404).json({ message: "User not found" });
        }
        const existingChat = yield nmodels_1.Chat.findOne({
            where: {
                [core_1.Op.or]: [
                    { user1_id: user1Id, user2_id: user2Id },
                    { user1_id: user2Id, user2_id: user1Id },
                ],
            },
        });
        if (existingChat) {
            return res.status(400).json({ message: "Chat already exists" });
        }
        const chat = yield nmodels_1.Chat.create({
            user1_id: user1Id,
            user2_id: user2Id,
            name: `${(_a = req.user) === null || _a === void 0 ? void 0 : _a.username} & ${user2.username}`,
            is_active: true,
        });
        res.status(201).json(chat);
    }
    catch (error) {
        console.error("Create chat error:", error);
        res.status(500).json({ message: "Error creating chat" });
    }
});
exports.createChat = createChat;
const getUserChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chats = yield nmodels_1.Chat.findAll({
            where: {
                [core_1.Op.or]: [{ user1_id: req.user.id }, { user2_id: req.user.id }],
                is_active: true,
            },
            include: [
                {
                    model: nmodels_1.User,
                    as: "user1",
                    attributes: ["id", "username"],
                },
                {
                    model: nmodels_1.User,
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
    }
    catch (error) {
        console.error("Get user chats error:", error);
        res.status(500).json({ message: "Error fetching chats" });
    }
});
exports.getUserChats = getUserChats;
const getChatById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: chatId } = req.params;
        const userId = req.user.id;
        const chat = yield nmodels_1.Chat.findOne({
            where: {
                id: chatId,
                [core_1.Op.or]: [{ user1_id: userId }, { user2_id: userId }],
                is_active: true,
            },
            include: [
                {
                    model: nmodels_1.User,
                    as: "user1",
                    attributes: ["id", "username"],
                },
                {
                    model: nmodels_1.User,
                    as: "user2",
                    attributes: ["id", "username"],
                },
            ],
        });
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }
        res.json(chat);
    }
    catch (error) {
        console.error("Get chat by id error:", error);
        res.status(500).json({ message: "Error fetching chat" });
    }
});
exports.getChatById = getChatById;
const deleteChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: chatId } = req.params;
        const userId = req.user.id;
        const chat = yield nmodels_1.Chat.findOne({
            where: {
                id: chatId,
                [core_1.Op.or]: [{ user1_id: userId }, { user2_id: userId }],
            },
        });
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }
        yield chat.update({
            is_active: false,
            deleted_at: new Date(),
        });
        res.json({ message: "Chat deleted successfully" });
    }
    catch (error) {
        console.error("Delete chat error:", error);
        res.status(500).json({ message: "Error deleting chat" });
    }
});
exports.deleteChat = deleteChat;
