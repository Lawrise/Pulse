"use strict";
// can be used to centralize the relation between model.
// easier to maintain in large project 
// ensure that all models are initialised before relation occurs
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeModels = initializeModels;
const userModel_1 = require("./userModel");
const chatModel_1 = require("./chatModel");
const messageModel_1 = require("./messageModel");
const friendModel_1 = require("./friendModel");
function initializeModels() {
    // User - Chat relationships
    userModel_1.User.hasMany(chatModel_1.Chat, { as: 'chatsAsUser1', foreignKey: 'user1_id' });
    userModel_1.User.hasMany(chatModel_1.Chat, { as: 'chatsAsUser2', foreignKey: 'user2_id' });
    chatModel_1.Chat.belongsTo(userModel_1.User, { as: 'user1', foreignKey: 'user1_id' });
    chatModel_1.Chat.belongsTo(userModel_1.User, { as: 'user2', foreignKey: 'user2_id' });
    // Chat - Message relationships
    chatModel_1.Chat.hasMany(messageModel_1.Message, { foreignKey: 'chat_id' });
    messageModel_1.Message.belongsTo(chatModel_1.Chat, { foreignKey: 'chat_id' });
    // User - Message relationships
    userModel_1.User.hasMany(messageModel_1.Message, { foreignKey: 'sender_id' });
    messageModel_1.Message.belongsTo(userModel_1.User, { as: 'sender', foreignKey: 'sender_id' });
    // User - Friend relationships
    userModel_1.User.hasMany(friendModel_1.Friend, { foreignKey: 'userId' });
    userModel_1.User.hasMany(friendModel_1.Friend, { foreignKey: 'friendId' });
    friendModel_1.Friend.belongsTo(userModel_1.User, { as: 'user', foreignKey: 'userId' });
    friendModel_1.Friend.belongsTo(userModel_1.User, { as: 'friend', foreignKey: 'friendId' });
}
