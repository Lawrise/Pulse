const User = require("./userModel");
const Friendship = require("./friendshipModel");

// Define relationships
User.belongsToMany(User, {
  as: "friends",
  through: Friendship,
  foreignKey: "user1Id",
  otherKey: "user2Id",
});
Friendship.belongsTo(User, { foreignKey: "user1Id", as: "requester" });
Friendship.belongsTo(User, { foreignKey: "user2Id", as: "receiver" });

module.exports = { User, Friendship };
