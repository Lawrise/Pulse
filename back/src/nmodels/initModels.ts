// can be used to centralize the relation between model.
// easier to maintain in large project
// ensure that all models are initialised before relation occurs

import { User } from "./userModel";
import { Chat } from "./chatModel";
import { Message } from "./messageModel";
import { Friend } from "./friendModel";

export function initializeModels() {
  // User - Chat relationships
  User.hasMany(Chat, { as: "chatsAsUser1", foreignKey: "user1_id" });
  User.hasMany(Chat, { as: "chatsAsUser2", foreignKey: "user2_id" });
  Chat.belongsTo(User, { as: "user1", foreignKey: "user1_id" });
  Chat.belongsTo(User, { as: "user2", foreignKey: "user2_id" });

  // Chat - Message relationships
  Chat.hasMany(Message, { foreignKey: "chat_id" });
  Message.belongsTo(Chat, { foreignKey: "chat_id" });

  // User - Message relationships
  User.hasMany(Message, { foreignKey: "sender_id" });
  Message.belongsTo(User, { as: "sender", foreignKey: "sender_id" });

  // User - Friend relationships
  User.hasMany(Friend, { foreignKey: "userId" });
  User.hasMany(Friend, { foreignKey: "friendId" });
  Friend.belongsTo(User, { as: "user", foreignKey: "userId" });
  Friend.belongsTo(User, { as: "friendUser", foreignKey: "friendId" }); // Changed from 'friend' to 'friendUser'
}
