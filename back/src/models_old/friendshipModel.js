const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

class Friendship extends Model {}

Friendship.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user1Id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "Users", key: "id" },
    },
    user2Id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "Users", key: "id" },
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected"),
      defaultValue: "pending",
    },
  },
  {
    sequelize,
    modelName: "Friendship",
    tableName: "friendships",
    timestamps: false,
  }
);

module.exports = Friendship;
